<template>
  <div class="select-personnel">
    <el-dialog
      :visible="dialogVisiable"
      @update:visible="visibaleChange"
      @open="getSelectedIfo"
    >
      <template #title>
        <div class="tabs">
          <span
            v-for="{ type, name } in defaultTabs"
            :key="type"
            :class="['tab', type == activeTab ? 'tab_active' : '']"
            @click="onTabChange(type)"
          >
            {{ name }}
          </span>
        </div>
      </template>

      <!-- 组织架构 -->
      <div v-show="activeTab == 'organization'" class="organization">
        <div class="left">
          <div class="header">
            <div class="header-title">{{ strObjs.title }}</div>

            <el-input
              v-model="searchKey"
              class="search-input"
              :placeholder="strObjs.placeholder"
              @input="onSearchOrg"
            >
              <i slot="prefix" class="el-input__icon el-icon-search" />
              <i v-if="searchKey" slot="append" class="el-icon-circle-close" @click="onClearSearch" />
            </el-input>

            <search v-if="searchVisible" :list="searchOrgData" @onSelected="onSearchSelected" @hidenSearch="searchVisible = false" />

          </div>
          <div class="container">
            <el-tree
              v-if="dialogVisiable"
              ref="tree"
              stripe
              :data="organizationData"
              :show-checkbox="showCheckboxHandler"
              :render-after-expand="true"
              empty-text=""
              :props="treeConfig"
              node-key="keyId"
              :check-strictly="true"
              lazy
              :load="treeLazyLoad"
              @check-change="onLeftOrgCheck"
            >
              <span slot-scope="{ data }" class="custom-tree-node">
                <!-- <span v-if="data.type === 2" class="photo">
                  <img :src="data.avatar">
                </span> -->
                <span>{{ data.name }}</span>
              </span>
            </el-tree>
          </div>
        </div>
        <div class="right">
          <div class="header">
            <div class="header-title">已选（{{ organizationSelected.length }}）</div>
          </div>
          <div class="container">
            <div
              v-for="item in organizationSelected"
              :key="item.keyId"
              class="org-Selected-item"
            >
              <el-checkbox
                :value="true"
                :disabled="item.disabled"
                @input="onRightOrgCheck(item)"
              >
                <!-- <span class="photo">
                  <img :src="item.type === 2 ? item.avatar : deptSrc ">
                </span> -->
                <span>{{ item.name }}</span>
              </el-checkbox>
            </div>
          </div>
        </div>
      </div>

      <!-- 常选部门 -->
      <div v-show="activeTab == 'department'" class="often-list">
        <often :list="oftenDeptData" @oftenCheck="onOftenCheck" @delOften="onDelOften" />
      </div>

      <!-- 常选人员 -->
      <div v-show="activeTab == 'personnel'" class="often-list">
        <often :list="oftenPersonData" @oftenCheck="onOftenCheck" @delOften="onDelOften" />
      </div>

      <template #footer>
        <span v-if="confirmDisabled" class="tip">当前选择数量已超过最大限制：{{ maxSelectNum }}</span>
        <el-button @click="visibaleChange">取消</el-button>
        <el-button type="primary" :disabled="confirmDisabled" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import deptSrc from './dept.png'
import often from './often'
import search from './search'
const _throttle = require('lodash.throttle')
const tabs = [
  { type: 'organization', name: '组织架构' },
  { type: 'department', name: '常选部门' },
  { type: 'personnel', name: '常选人员' }
]

export default {
  name: 'SelectPersonnel',
  components: { often, search },
  props: {
    // 弹框开关
    dialogVisiable: {
      type: Boolean,
      default: false
    },

    // 是否只展示当前用户所在企业
    onlyCurrentCompany: {
      type: Boolean,
      default: true
    },

    // 是否只显示主职，false：显示挂职
    onlyMainJob: {
      type: Boolean,
      default: true
    },

    // 选择类型【选人、选部门、选人+部门】
    selectType: {
      type: Array,
      default: () => ['personnel', 'department']
    },

    // 选中的列表
    selectedList: {
      type: Array,
      default: () => []
    },

    // 置灰的节点：包括不可选的和已选不可取消的
    disabledList: {
      type: Array,
      default: () => []
    },

    // 最大选择数量, 0表示不限制
    maxSelectNum: {
      type: Number,
      default: 0
    }
  },

  data () {
    return {
      activeTab: 'organization', // 当前激活的tab
      searchKey: '', // 搜索关键字部门或成员
      searchVisible: false,
      searchOrgData: [], // 搜索数据
      organizationData: [], // 组织架构数据
      organizationSelected: [], // 已选择的组织架构
      oftenDeptData: [], // 常选部门列表
      oftenPersonData: [], // 常选人员列表
      treeConfig: { // 树结构配置
        label: 'name',
        children: 'children',
        isLeaf: (data) => !data.hasChildren
      },
      deptSrc,
      initDeptTime: 0,
      initPersonTime: 0
    }
  },

  /**
 * 初期使用computed计算，主要是为了外部可以尽可能少的配置来使用组件，方便啦
 * 后期可改为props传入
 * 为什么没使用watch监听selectType，因为computed有缓存啦
 * 【defaultTabs、strObjs】
 */
  computed: {
    defaultTabs () {
      const arr = ['organization', ...this.selectType]
      return tabs.filter(v => arr.includes(v.type)) // 选择人员弹框头部tabs
    },
    strObjs () {
      const person = this.selectType.includes('personnel') ? '人员' : ''
      const department = this.selectType.includes('department') ? '部门' : ''
      return {
        title: `待选${department}${department && person ? ' / ' : ''}${person}`,
        placeholder: `请输入${department}${department && person ? ' / ' : ''}${person}`
      }
    },
    confirmDisabled () {
      // 最大选择数限制
      return this.maxSelectNum > 1 && this.organizationSelected.length > this.maxSelectNum
    },
    commonParams () {
      return {
        onlyMainJob: this.onlyMainJob, // 主挂职
        onlyCurrentCompany: this.onlyCurrentCompany
      }
    }
  },

  watch: {
    selectedList: {
      handler (n = [], o = []) {
        // 深拷贝 避免组件内部更改数据影响到组件外侧
        const copy = JSON.parse(JSON.stringify(n))
        this.organizationSelected = this.updateStatus(copy)
      }
    }
  },

  created () {},

  methods: {
    // 获取已选的详情
    getSelectedIfo () {
      if (!this.organizationSelected.length) return false
      this.$api('selectPersonnel.getNodeInfo', this.organizationSelected).then(res => {
        this.organizationSelected = this.updateStatus(res.data)
      })
    },
    /**
     * tab点击事件
     * 常选部门和常选人员在点击时才查询数据，且只初始化一次
     */
    onTabChange (type) {
      this.activeTab = type
      switch (type) {
        case 'department' :
          if (!this.initDeptTime) { // 第一次初始化数据
            this.initDeptTime = 1
            this.getOftenDeptList()
          } else { // 更新checkbox状态
            this.updateOftenSelected(1)
          }
          break
        case 'personnel' :
          if (!this.initPersonTime) { // 第一次初始化数据
            this.initPersonTime = 1
            this.getOftenPersonList()
          } else { // 更新checkbox状态
            this.updateOftenSelected(2)
          }
          break
      }
    },

    // 获取常选部门列表
    getOftenDeptList () {
      this.$api('selectPersonnel.oftenDept', this.commonParams).then(res => {
        this.oftenDeptData = this.updateStatus(res.data)
      })
    },

    // 获取常选人员列表
    getOftenPersonList () {
      this.$api('selectPersonnel.oftenUser', this.commonParams).then(res => {
        this.oftenPersonData = this.updateStatus(res.data)
      })
    },

    // 展开获取树的下一级
    async treeLazyLoad (node, resolve) {
      const req = {
        ...this.commonParams,
        deptId: node.level ? node.data.id : 0, // 查询根节点deptId传0
        onlyDept: !this.selectType.includes('personnel')
      }

      const res = await this.$api('selectPersonnel.orgList', req)
      const _data = this.updateStatus(res.data)
      resolve(_data)
      // 处理选中逻辑（由于数据是异步获取渲染，所以需要拿到数据后再操作选中逻辑）
      _data.forEach(item => {
        this.handelLeftOrgCheck(item.keyId, item.isSelected)
      })
    },

    // 处理展示主挂职时，用户id不唯一的情况
    formatKeyId (data) {
      const { id, parentId = '' } = data
      return this.onlyMainJob ? id : `${id}_${parentId}`
    },

    /**
     * 维护数据状态
     * 选中状态
     * 置灰状态
     */
    updateStatus (data) {
      // data instanceof Array
      return data.map(d => {
        const keyId = this.formatKeyId(d)
        return {
          ...d,
          keyId,
          name: d.label ? d.label : d.name,
          disabled: !!this.disabledList.find(v => this.formatKeyId(v) === keyId),
          isSelected: !!this.organizationSelected.find(v => v.keyId === keyId)
        }
      })
    },

    /**
     * 单选
     */
    handelSingleChoice () {
      if (this.maxSelectNum === 1 && this.organizationSelected.length >= 2) {
        // 取消上一个
        const first = this.organizationSelected[0]
        this.handelLeftOrgCheck(first.keyId, false)
        this.organizationSelected.splice(0, 1)
        this.searchOrgData.map(v => { (v.keyId === first.keyId) ? (v.isSelected = false) : '' })
        this.oftenDeptData.map(v => { (v.keyId === first.keyId) ? (v.isSelected = false) : '' })
        this.oftenPersonData.map(v => { (v.keyId === first.keyId) ? (v.isSelected = false) : '' })
      }
    },

    /**
     * 设置左侧组织架构树的选中，取消选中
     * key 树节点的唯一标识
     * check: false 取消选中，true 选中
     */
    handelLeftOrgCheck (key, check) {
      this.$nextTick(() => {
        const tree = this.$refs.tree
        tree.setChecked(key, check)
      })
    },

    /**
     * 维护已选数据
     * flag: true 新增, false 删除
     * data: 当前操作的对象
     */
    updateOrgSelectData (data, flag) {
      const isHas = this.organizationSelected.findIndex(item => item.keyId === data.keyId)
      if (flag) {
        this.organizationSelected = [...this.organizationSelected, ...(isHas > -1 ? [] : [data])]
      } else {
        isHas > -1 && this.organizationSelected.splice(isHas, 1)
      }
    },

    // 更新常用的checkbo选中状态
    updateOftenSelected (type) {
      const list = (type === 1 ? this.oftenDeptData : this.oftenPersonData)
      list.map(d => {
        d.isSelected = !!this.organizationSelected.find(v => v.keyId === d.keyId)
      })
    },

    /**
     *  树右侧已选checkbox的点击事件
     * check: false取消选中，true选中
     * data: 当前操作的对象
     */
    onRightOrgCheck (data) {
      // 维护选中数据
      this.updateOrgSelectData(data, false)
      // 取消树当前节点的选中
      this.handelLeftOrgCheck(data.keyId, false)
    },

    // 树左侧checkbox的change事件（包括被动出发setChecked）
    onLeftOrgCheck (data, isCheck) {
      this.updateOrgSelectData(data, isCheck)
      this.handelSingleChoice() // 单选,取消前一个
    },

    // 常用部门 and 常用人员 checkbox点击事件
    onOftenCheck (data) {
      const flag = data.isSelected
      // 维护选中数据
      this.updateOrgSelectData(data, flag)
      // 维护树当前节点的选中状态
      this.handelLeftOrgCheck(data.keyId, flag)
      // 单选,取消前一个
      this.handelSingleChoice()
    },

    // 删除常用
    onDelOften (item) {
      this.$api('selectPersonnel.delOften', [item.oftenPrimaryId]).then(res => {
        // 删除
        const list = item.type === 1 ? this.oftenDeptData : this.oftenPersonData
        const isHas = list.findIndex(v => v.keyId === item.keyId)
        isHas > -1 && list.splice(isHas, 1)
        // 维护选中数据
        this.updateOrgSelectData(item, false)
        // 维护树当前节点的选中状态
        this.handelLeftOrgCheck(item.keyId, false)
      })
    },

    // tree中节点按需展示checkbox
    showCheckboxHandler (data) {
      // 只选人，则只有人员节点显示checkbox
      return !this.selectType.includes('department') ? data.type === 2 : true
    },

    /**
     * 搜索组织架构
     * 输入框实时搜索使用节流
     */
    onSearchOrg: _throttle(
      function () {
        this.searchVisible = true
        if (!this.searchKey.trim()) {
          this.searchOrgData = []
        } else {
          // type : 0查部门和用户，1查部门，2查用户
          const req = {
            name: this.searchKey,
            ...this.commonParams,
            type: this.selectType.length >= 2 ? 0 : (this.selectType.includes('personnel') ? 2 : 1)
          }
          this.$api('selectPersonnel.searchOrg', req).then(res => {
            this.searchOrgData = this.updateStatus(res.data)
          })
        }
      }, 1000
    ),

    // 搜索项点击
    onSearchSelected (data) {
      const flag = data.isSelected
      // 维护选中数据
      this.updateOrgSelectData(data, flag)
      // 维护树当前节点的选中状态
      this.handelLeftOrgCheck(data.keyId, flag)
      // 单选时，取消上一个
      this.handelSingleChoice()
    },

    // 清空搜索
    onClearSearch () {
      this.searchKey = ''
      this.searchOrgData = []
      this.searchVisible = false
    },

    // 开关.sync支持
    visibaleChange () {
      // 恢复初始状态
      this.onClearSearch()
      this.activeTab = 'organization'
      this.$emit('update:dialog-visiable', false)
    },

    // 弹框确定事件
    confirm () {
      const res = this.organizationSelected.map(d => {
        return {
          ...d,
          label: d.name,
          isLeaf: !d.hasChildren,
          isPerson: d.type === 2
        }
      })
      this.$emit('confirm', JSON.parse(JSON.stringify(res)))
      this.visibaleChange()
      // 设置常用
      this.$api('selectPersonnel.setOften', res)
    }
  }
}
</script>

<style lang="scss" scoped>
  .select-personnel {
      .tabs {
        display: flex;
        height: 56px;

        .tab {
          position: relative;
          display: flex;
          align-items: center;
          margin-right: 32px;
          font-size: 16px;
          font-weight: 500;
          color: #191F24;
          cursor: pointer;
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

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 50px;
            padding: 0 16px;
            border-bottom: 1px solid #E3E4E4;
            position: relative;

            .header-title {
              height: 18px;
              font-size: 14px;
              font-weight: 500;
              color: #191F24;
              line-height: 18px;
            }
          }

          .container {
            height: 386px;
            overflow-y: auto;
            overflow-x: hidden;
            .custom-tree-node {
              display: flex;
              align-items: center;
            }
          }
        }

        .right {
          @extend .left;
          .org-Selected-item {
            padding-left: 12px;
            height: 40px;
            line-height: 40px;

            &:nth-child(even) {
              background-color: #F6F6F6;
            }
          }
        }
      }

      .often-list {
        height: 437px;
        overflow-y: auto;
        overflow-x: hidden;
        border-radius: 4px;
        border: 1px solid #E3E4E4;
      }

      .photo {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        margin-right: 8px;
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
        }
      }

      .tip {
        color: red;
        font-size: 13px;
        margin-right: 30px;
      }
  }

  ::v-deep .el-dialog {
    width: 60%;
    .el-dialog__header {
      padding-top: 0;
      padding-bottom: 0;
    }

    .el-dialog__body {
      padding: 12px 24px;
    }
  }

  ::v-deep .el-tree {
    .el-tree-node__content {
      height: 40px;
    }
    .only-select-person .el-tree-node__content > label.el-checkbox {
      display: none;
    }
  }

  ::v-deep .el-input.search-input {
    font-size: 14px;
    width: 60%;
    .el-input__inner {
        border-radius: 0;
        border: none;
        border-bottom: 1px solid #ddd;
    }
    .el-input-group__append {
      cursor: pointer;
      background: #fff;
      border: none;
      border-radius: 0;
      border-bottom: 1px solid rgba(25, 31, 36, 0.16);
      padding: 0 10px;
    }
  }

  ::v-deep .el-checkbox {
      display: flex;
      align-items: center;
      height: 40px;
      &.is-checked .el-checkbox__label {
        color: inherit;
      }

      .el-checkbox__label {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: flex;
          align-items: center;
      }
  }
</style>
