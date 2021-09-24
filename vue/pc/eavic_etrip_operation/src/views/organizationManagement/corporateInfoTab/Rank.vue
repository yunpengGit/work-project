<template>
  <div class="rankManagement">
    <div>职级列表</div>
    <a-divider />
    <div class="table-page-search-wrapper">
      <a-form layout="inline" >
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="职级名称">
              <a-input v-model="queryParam.likeName" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
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
      <span slot='operating' slot-scope="text, record" class="btn">
        <span class="blue" @click="editRowIndex(record)">编辑</span>
      </span>
    </s-table>
    <a-drawer
      title="编辑职级"
      :width="890"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="drawerClose"
    >
      <a-form :label-col="{ span: 5 }"
      :wrapper-col="{ span: 15 }"
      :form="drawerForm"
      >
        <a-form-item label="职级名称">
         <div></div>
        </a-form-item>
        <a-form-item label="职级描述">
          <div></div>
        </a-form-item>
        <a-form-item label="职级编号">
          <a-input></a-input>
        </a-form-item>
        <a-form-item label="职级补助（元）">
         <a-input></a-input>
        </a-form-item>
        <a-form-item labelAlign="right">
          <a-button type="primary" @click="drawerFn()">
            保存
          </a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script>
import { getCategoryById } from '@/api/organizationManagement/corporateInfo'
import { STable } from '@/components'
export default {
  name: 'departmentManagement',
  components: {
    STable
  },
  props: {
    treeSelected: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      queryParam: {
        // name: '',
        // parentDepartment: '',
        // status: ''
      },
      visible: true,
      drawerForm: {},
      loadData: parameter => {
        return getCategoryById(Object.assign(parameter, this.queryParam, { categoryId: this.treeSelected.id, type: 2 }))
          .then(res => {
            return res.model
          })
      },
      columns: [{
        title: '职级名称',
        dataIndex: 'user',
        key: 'user'
      },
      {
        title: '职级描述',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '职级编号',
        dataIndex: 'mobiel',
        key: 'mobiel'
      },
      {
        title: '职级补助（元）',
        dataIndex: 'tel',
        key: 'tel'
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
  },
  methods: {
    reset() {
      this.queryParam = {}
    },
    drawerClose() {
      this.visible = false
    },
    editRowIndex() {
      //
    }
  }
}
</script>

<style scoped lang="less">
@import './index.less'; // 这个分号一定要写，要不会报错
</style>
