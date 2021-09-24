<!--
 * @Author: aq.hu
 * @Date: 2021-05-11 11:43:53
 * @LastEditTime: 2021-05-11 11:43:54
 * @LastEditors: aq.hu
 * @Description:
-->
<template>
  <div class="select-personnel">
    <el-dialog :visible="dialogVisiable" @update:visible="visibaleChange">
      <template #title>
        <div class="tabs">
          <span v-for="tab in tabs" :key="tab.id" :class="['tab', tab.id == defaultTab ? 'tab_active' : '']" @click="tabChange(tab.id)">
            {{ tab.name }}
          </span>
        </div>
      </template>
      <div v-show="defaultTab == 1" class="organization">
        <div class="left">
          <div class="search-header">
            <div class="search__left">待选部门/人员</div>

            <el-input
              v-model="departmentFilterText"
              class="search__right"
              clearable
              :placeholder="`请输入部门${isLoadPersonel ? '/人员' : ''}`"
              @clear="getOrganizationList"
              @keyup.enter.native="searchOrganization"
            >
              <!-- <icon-svg
                slot="suffix"
                class="search-suffix"
                name="sousuo"
                @click.native="searchOrganization"
              /> -->
            </el-input>

          </div>
          <div class="left-container">
            <el-tree
              ref="organizationTree"
              stripe
              :data="organizationData"
              :show-checkbox="showCheckboxHandler"
              :render-after-expand="true"
              :props="treeConfig"
              node-key="id"
              :check-strictly="true"
              lazy
              :load="treeLazyLoad"
              @check-change="organizationSelectHandle"
            >
              <!-- <span slot-scope="{ node, data }" class="custom-tree-node" :class="{'isPerson': data.isPerson}">{{ node.label }}</span> -->
            </el-tree>
          </div>
        </div>
        <div class="right">
          <div class="search-header">
            <div class="search__left">已选{{ organizationNumber }}</div>
          </div>
          <div class="left-container">
            <div v-for="(item, index) in organizationSelected" :key="item.id" :class="['checkbox-item', (index + 1) % 2 == 0 ? 'checkbox-item_grey' : '']">
              <el-checkbox :value="true" :disabled="item.disabled" @input="cancelSelectOrganization(item)">{{ item.label }}</el-checkbox>
            </div>
          </div>
        </div>
      </div>
      <div v-show="defaultTab == 2" class="department-list">
        <div v-for="(item, index) in departmentList" :key="item.id" :class="['department-item', (index + 1) % 2 == 0 ? 'department-item_grey' : '']">
          <el-checkbox :value="item.isSelected" @input="departmentSelected(item)">{{ item.label }}</el-checkbox>
        </div>
      </div>
      <div v-show="defaultTab == 3" class="department-list">
        <div v-for="(item, index) in personelList" :key="item.id" :class="['department-item', (index + 1) % 2 == 0 ? 'department-item_grey' : '']">
          <el-checkbox :value="item.isSelected" @input="personelSelected(item)">{{ item.label }}</el-checkbox>
        </div>
      </div>
      <template #footer>
        <el-button @click="visibaleChange(false)">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// import iconSvg from '@/components/icon-svg'
/**
 * 选择人员部门
 * 1、禁用,不可选的数据和已选不可操作的数据：disabledList
 * 2、只选人：onlySelectPerson，即只有人员节点显示checkbox，通过css和操作dom控制
 */

const tabs = [
  {
    id: 1,
    type: 'organization',
    name: '组织架构'
  }
  // {
  //   id: 2,
  //   type: 'department',
  //   name: '常选部门'
  // },
  // {
  //   id: 3,
  //   type: 'personnel',
  //   name: '常选人员'
  // }
]

export default {
  name: 'SelectPersonnel',
  // components: { iconSvg },
  props: {
    // 弹框开关
    dialogVisiable: {
      type: Boolean,
      default: false
    },

    // 默认选择的tab
    defaultTab: {
      type: [String, Number],
      default: tabs[0] && tabs[0].id,
      validator: function (val) {
        return tabs.findIndex(item => item.id === val) > -1
      }
    },

    // 选中的列表,数组元素可以是人员id也可以是包含人员id的对象
    selectedList: {
      type: Array,
      default: () => []
    },

    // 不可选的节点
    disabledList: {
      type: Array,
      default: () => []
    },

    // 是否只能选人
    onlySelectPerson: {
      type: Boolean,
      default: false
    },

    // 最大选择数量, 0表示不限制
    maxSelectNum: {
      type: [Number, String],
      default: 0
    },

    // 是否加载人员,默认加载人员
    isLoadPersonel: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      tabs: tabs, // 选择人员弹框头部tabs
      departmentFilterText: '', // 搜索关键字部门或成员
      organizationData: [], // 组织架构数据
      organizationSelected: [], // 已选择的组织架构
      departmentList: [], // 部门列表
      personelList: [], // 常选人员列表
      treeConfig: {
        label: 'label',
        children: 'children',
        isLeaf: 'isLeaf'
      } // 树结构配置
    }
  },

  computed: {
    organizationNumber () {
      const { organizationSelected } = this
      return organizationSelected && organizationSelected.length ? `（${organizationSelected.length}）` : ''
    },

    // 扁平化获取组织架构一维id数组
    organizationIds () {
      const { organizationData } = this
      const arr = []
      const _getIds = array => {
        array.forEach(item => {
          item.id && arr.push(item.id)
          item.children && item.children.length > 0 && _getIds(item.children)
        })
      }
      _getIds(organizationData)
      return arr
    }
  },

  watch: {
    selectedList: {
      handler (newVal) {
        const selectedIds = newVal.map(item => {
          return Object.prototype.toString.call(item) === '[object Object]' ? item.id : item
        })
        this.departmentList.forEach(item => {
          if (selectedIds.includes(item.id)) this.$set(item, 'isSelected', true)
          else this.$set(item, 'isSelected', false)
        })
        this.personelList.forEach(item => {
          if (selectedIds.includes(item.id)) this.$set(item, 'isSelected', true)
          else this.$set(item, 'isSelected', false)
        })
        this.$nextTick(() => {
          if (!this.$refs.organizationTree) return
          this.organizationIds.forEach(id => {
            this.$refs.organizationTree.setChecked(id, false, false)
          })
          selectedIds.length > 0 && selectedIds.forEach(id => {
            this.$refs.organizationTree.setChecked(id, true, false)
          })
        })

        // 已选不可操作
        newVal.map(d => {
          d.disabled = !!this.disabledList.find(v => v.id === d.id)
        })
        // 深拷贝selectList 避免组件内部更改数据影响到组件外侧
        this.defaultTab === 1 && (this.organizationSelected = JSON.parse(JSON.stringify(newVal)))
      },
      immediate: true
    }
  },

  created () {
    this.getOrganizationList()
  },

  methods: {
    // 获取组织架构列表
    getOrganizationList () {
      this.$api('notice.organizationList').then(res => {
        this.organizationData = res.data
      })
    },

    // 开关.sync支持
    visibaleChange (val) {
      this.$emit('update:dialog-visiable', val)
      !val && this.dialogClosed()
    },

    // 选择人员弹框关闭事件
    dialogClosed () {
      this.$emit('dialogClosed')
    },

    // tab变更
    tabChange (tabId) {
      this.$emit('update:default-tab', tabId)
    },

    // 组织架构选中变更
    organizationSelectHandle (data, isCheck) {
      const { id } = data
      const { organizationSelected, maxSelectNum } = this
      if (isCheck) {
        if (organizationSelected && organizationSelected.length === 0) organizationSelected.push(data)
        else {
          const isHas = organizationSelected.findIndex(item => item.id === id)
          if (isHas === -1) organizationSelected.push(data)
          else organizationSelected.splice(isHas, 1, data)
        }
      } else {
        const isHas = organizationSelected.findIndex(item => item.id === id)
        isHas > -1 && organizationSelected.splice(isHas, 1)
      }
      if (maxSelectNum > 0 && organizationSelected.length > maxSelectNum) {
        const { id: orgaId } = organizationSelected.shift() || {}
        orgaId && this.$refs.organizationTree.setChecked(orgaId, false)
      }
    },

    // 右侧取消已选人员
    cancelSelectOrganization (organization) {
      const isHas = this.organizationSelected.findIndex(item => item.id === organization.id)
      isHas > -1 && this.organizationSelected.splice(isHas, 1)
      this.$refs.organizationTree.setChecked(organization.id, false)
    },

    // 弹框确定事件
    confirm () {
      const res = this._getResult()
      this.$emit('confirm', JSON.parse(JSON.stringify(res)))
      this.visibaleChange(false)
    },

    // 部门列表选中事件
    departmentSelected (item) {
      this._computedMaxSelect(this.departmentList)
      item.isSelected = !item.isSelected
    },

    // 常选人员选中事件
    personelSelected (item) {
      this._computedMaxSelect(this.personelList)
      item.isSelected = !item.isSelected
    },

    // 懒加载树
    async treeLazyLoad (node, resolve) {
      let _data = []
      const data = node.data
      if (Array.isArray(data)) {
        _data = data
      } else {
        const { children, id } = data
        if (Array.isArray(children) && children.length > 0) {
          _data = children
        } else {
          if (this.isLoadPersonel) {
            const res = await this.$api('notice.organizationUser', { deptId: id })
            _data = res.rows.map(item => {
              return {
                id: item.userId,
                label: item.nickName,
                isLeaf: true,
                isPerson: true
              }
            })
            // 将懒加载数据合并至源数据(organizationData),否则setChecked方法不生效
            if (!data.children || data.children.length === 0) data.children = _data
          }
        }
      }
      // 设置disabled
      _data.map(item => {
        const isSelect = this.disabledList.find(select => select.id === item.id)
        item.disabled = !!isSelect
      })
      resolve(_data)
      this._selectOrganization(_data)
    },

    // 获取选中结果
    _getResult () {
      if (this.defaultTab === 1) {
        return this.organizationSelected
      } else if (this.defaultTab === 2) {
        return this._getSelectedItem(this.departmentList)
      } else {
        return this._getSelectedItem(this.personelList)
      }
    },

    /**
     * 从数组中过滤选中项
     * @param {Array} array
     */
    _getSelectedItem (array) {
      return array.filter(item => item.isSelected)
    },

    /**
     * 计算部门列表和常选人员列表最大选中数量
     * @param {Array} array 部门列表或常选人员列表
     */
    _computedMaxSelect (array) {
      const { maxSelectNum } = this
      if (maxSelectNum <= 0) return
      const selected = array.filter(item => item.isSelected)
      // 这里使用大于等于是因为在对el-checkbox的input监听事件中，先进行最大选中数量限制在进行选中状态变更的
      if (selected.length >= maxSelectNum) {
        for (const item of array) {
          if (item.isSelected) {
            item.isSelected = false
            return
          }
        }
      }
    },

    // 用于懒加载选中数据
    _selectOrganization (array) {
      array.forEach(item => {
        const orga = this.selectedList.find(select => select.id === item.id)
        if (orga) {
          this.$nextTick(() => {
            this.$refs.organizationTree.setChecked(orga.id, true, false)
          })
        }
      })
    },

    // tree中节点按需展示checkbox
    showCheckboxHandler (data) {
      if (this.onlySelectPerson) {
        return data.isPerson
      } else {
        return true
      }
    },

    // 搜索组织架构
    searchOrganization () {
      const val = this.departmentFilterText
      // 如果输入为空或者输入了空格则查询全部数据
      if (!val || (val && val.trim() === '')) {
        this.getOrganizationList()
        return
      }
      const params = { name: this.departmentFilterText }
      !this.isLoadPersonel && (params.type = 1)
      this.$api('notice.searchOrganization', { ...params }).then(res => {
        this.organizationData = res.data.map(item => {
          return {
            id: item.id,
            label: item.name,
            isLeaf: true,
            isPerson: item.type === 2
          }
        })

        res.data.forEach(item => {
          const disabledIndex = this.disabledList.findIndex(disabled => disabled.id === item.id)
          const selected = this.organizationSelected.find(selected => selected === item.id || selected.id === item.id)
          if (disabledIndex > -1) item.disabled = true
          if (selected && selected.id) {
            this.$nextTick(() => {
              this.$refs.organizationTree.setChecked(selected.id || selected, true, false)
            })
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .select-personnel {
    display: flex;

    ::v-deep .el-dialog {
      width: 60%;
      .el-dialog__header {
        padding-top: 0;
        padding-bottom: 0;
      }

      .el-dialog__body {
        padding: 12px 24px;
      }

      .tabs {
        display: flex;
        height: 56px;

        .tab {
          position: relative;
          display: flex;
          align-items: center;
          // width: 64px;
          margin-right: 32px;
          font-size: 16px;
          font-weight: 500;
          color: #191F24;
          cursor: pointer;
        }

        .tabs:last-child {
          margin-right: 0;
        }

        .tab_active {
          color: #1E89FF;
        }

        .tab_active::before {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 0;
          width: 100%;
          height: 4px;
          border-radius: 1px;
          background-color: #1E89FF;
        }
      }

      .organization {
        display: flex;
        justify-content: space-between;

        .left {
          width: 49%;
          border: 1px solid #E3E4E4;
          border-radius: 4px;

          .el-tree-node__content {
            height: 40px;
            line-height: 40px;
          }

          .search-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 44px;
            padding: 0 16px;
            border-bottom: 1px solid #E3E4E4;

            .search__left {
              height: 18px;
              font-size: 14px;
              font-weight: 500;
              color: #191F24;
              line-height: 18px;
            }

            .search__right {
              font-size: 12px;
              .icon {
                padding-top: 5px;
              }
            }

            .el-input {
              // width: 137px;
              max-width: 60%;
            }
          }

          .left-container {
            height: 388px;
            overflow-y: auto;
            overflow-x: hidden;
          }
        }

        .right {
          @extend .left;

          .checkbox-item {
            padding-left: 12px;
            height: 40px;
            line-height: 40px;

            .el-checkbox {
              display: flex;
              align-items: center;
              // width: 260px;
              height: 40px;

              .el-checkbox__label {
                // width: 240px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }

          .checkbox-item_grey {
            background-color: #F6F6F6;
          }
        }
      }

      .department-list {
        height: 432px;
        overflow-y: auto;
        overflow-x: hidden;
        border-radius: 4px;
        border: 1px solid #E3E4E4;

        .department-item {
          padding-left: 12px;
          height: 40px;
          line-height: 40px;

          .el-checkbox__label {
            font-size: 14px;
            font-weight: 400;
            color: #191F24;
            line-height: 18px;
          }
        }
      }

      .department-item_grey {
        background-color: #F6F6F6;
      }
    }
  }

  ::v-deep .only-select-person .el-tree-node__content > label.el-checkbox {
    display: none;
  }
</style>
