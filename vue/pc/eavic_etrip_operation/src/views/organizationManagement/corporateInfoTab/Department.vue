<template>
  <div class="departmentManagement">
    <div>部门信息</div>
    <a-divider />
    <div class="left">
        <a-input-search style="margin-bottom: 8px"  @search="onChangeTreeSearch"/>
        <a-tree :showLine="true" :tree-data="treeData" :load-data="onLoadData"
          :expanded-keys="expandedKeys"
          :auto-expand-parent="autoExpandParent"
          @select="selectedTreeAuthority"
          @expand="onExpand"
          :replaceFields="{title:'name', key:'id'}"
        >
          <div slot="name" slot-scope="{ name }">
            <span v-if="name.indexOf(searchValue) > -1">
              {{ name.substr(0, name.indexOf(searchValue)) }}
              <span style="color: #f50">{{ searchValue }}</span>
              {{ name.substr(name.indexOf(searchValue) + searchValue.length) }}
            </span>
            <span v-else>{{ name }}</span>
          </div>
        </a-tree>
      </div>
    <!-- <div class="table-page-search-wrapper">
      <a-form layout="inline" >
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="部门名称">
              <a-input v-model="queryParam.likeName" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="上级部门">
              <a-input v-model="queryParam.parentId" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="状态">
              <a-select v-model="queryParam.state">
                <a-select-option value="">所有</a-select-option>
                <a-select-option :value='1'>已停用</a-select-option>
                <a-select-option :value='0'>正常</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-button type="primary" html-type="submit" icon="search" @click="$refs.table.refreshFn(true)">
              查询
            </a-button>
            <a-button @click="reset">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-divider />
    <s-table
      :columns="columns"
      ref="table"
      size="default"
      rowKey = "id"
      :data="loadData"
      showPagination="auto"
    >
      <span slot='state' slot-scope="state">
        <a-badge :status="state == 1?'success':'default'" :text="state == 1?'正常':'已停用'" />
      </span>
      <span slot='operating' slot-scope="text, record" class="btn">
        <span class="blue" @click="editRowIndex(record)">编辑</span>
      </span>
    </s-table> -->
    <a-drawer
      title="编辑部门"
      :width="890"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="drawerClose"
    >
      <a-form :label-col="{ span: 5 }"
      :wrapper-col="{ span: 15 }"
      :form="drawerForm"
      >
        <a-form-item label="部门名称">
         <div>{{drawerForm.name}}</div>
        </a-form-item>
        <a-form-item label="上级部门">
          <div>{{drawerForm.parentName}}</div>
        </a-form-item>
        <a-form-item label="排序号">
          <div>{{drawerForm.showOrder}}</div>
        </a-form-item>
        <a-form-item label="状态">
          <div></div>
        </a-form-item>
        <a-form-item label="部门秘书">
          <a-select v-model="drawerForm.ms">
            <a-select-option value="">所有</a-select-option>
            <a-select-option :value='1'>已停用</a-select-option>
            <a-select-option :value='0'>正常</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item labelAlign="right">
          <a-button type="primary" @click="drawerSave()">
            保存
          </a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script>
import { getDeptListByParentId, getDeptById } from '@/api/organizationManagement/corporateInfo'
// import { STable } from '@/components'
export default {
  name: 'departmentManagement',
  components: {
    // STable
  },
  props: {
    treeSelected: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      treeData: [],
      autoExpandParent: true,
      expandedKeys: [0],
      searchValue: '',
      queryParam: {
        // name: '',
        // parentDepartment: '',
        // status: ''
      },
      visible: false,
      drawerForm: {},
      loadData: parameter => {
        return getDeptListByParentId(Object.assign(parameter, this.queryParam, { categoryId: this.treeSelected.id, type: 2, parentId: 0 }))
          .then(res => {
            return res.model
          })
      },
      columns: [{
        title: '管理员账号',
        dataIndex: 'user',
        key: 'user'
      },
      {
        title: '部门名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '上级部门',
        dataIndex: 'mobiel',
        key: 'mobiel'
      },
      {
        title: '排序号',
        dataIndex: 'tel',
        key: 'tel'
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: { customRender: 'state' }

      },
      {
        title: '操作',
        dataIndex: 'operating',
        width: 180,
        scopedSlots: { customRender: 'operating' }
      }],
      tableData: [{ state: '1' }]
    }
  },
  watch: {
  },
  created() {
    this.getLimitgroupTree(0, '')
  },
  methods: {
    onLoadData(treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        getDeptListByParentId({ categoryId: this.treeSelected.id, parentId: treeNode.dataRef.id, type: 2 }).then(res => {
          if (res.code == '1000000') {
            treeNode.dataRef.children = JSON.parse(JSON.stringify(res.model))
          } else {
          // message.error(res.resultStr)
          }
        })
        setTimeout(() => {
          this.treeData = [...this.treeData]
          console.log(this.treeData)
          resolve()
        }, 200)
      })
    },
    getLimitgroupTree(parentId, likeName) {
      getDeptListByParentId({ categoryId: this.treeSelected.id, parentId: parentId, type: 2, likeName: likeName }).then(res => {
        if (res.code == '1000000') {
          this.treeData = JSON.parse(JSON.stringify(res.model))
        } else {
          // message.error(res.resultStr)
        }
      })
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onChangeTreeSearch(e) {
      const value = e
      if (e == '') {
        this.getLimitgroupTree(0, '')
        return false
      }
      // 搜过企业名称 likeName
      this.getLimitgroupTree('', value)
    },
    selectedTreeAuthority(selectedKeys) {
      if (selectedKeys.length == 0) {
        return false
      }
      getDeptById({ id: selectedKeys[0] }).then(res => {
        this.visible = true
        this.drawerForm = res.model
        if (this.drawerForm.parentId == null) {
          this.drawerForm.parentName = '无'
          return false
        }
        getDeptById({ id: this.drawerForm.parentId }).then(res => {
          this.drawerForm = Object.assign({ }, this.drawerForm, { parentName: res.model.name })
        })
      })
    },
    reset() {
      this.queryParam = {}
    },
    drawerClose() {
      this.visible = false
    },
    drawerSave() {
      //
    }
  }
}
</script>

<style scoped lang="less">
@import './index.less'; // 这个分号一定要写，要不会报错
</style>
