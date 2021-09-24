<template>
  <div class="templateType">
    <div>
      <div>模板类型列表</div>
      <a-divider />
      <div class="table-page-search-wrapper">
       <a-form layout="inline" >
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="ID">
              <a-input
                v-model="queryParam.id"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="模板类型名称">
              <a-input
                v-model="queryParam.typeName"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons" :style="{ float: 'right', overflow: 'hidden' }">
              <a-button type="primary" html-type="submit" icon="search" @click="$refs.table.refreshFn(true)">
                  查询
              </a-button>
              <a-button @click="reset">重置</a-button>
            </span>
          </a-col>
        </a-row>
       </a-form>
       <div class="btn-box">
        <a-button type="primary" icon="plus" @click="add">添加</a-button>
        <a-button type="danger"  icon="delete" :disabled='selectedRowKeys.length == 0' @click="batchDele">批量删除</a-button>
       </div>
      </div>
      <s-table
        :columns="columns"
        ref="table"
        size="default"
        rowKey = "id"
        :alert="options.alert"
        :rowSelection="options.rowSelection"
        :data="loadData"
        showPagination="auto"
      >
        <span slot="updateName" slot-scope="text, record">
          <div>{{record.updateName}}</div>
          <div>{{record.updateTime}}</div>
        </span>
        <span slot='operating' slot-scope="text, record" class="btn">
          <span class="blue" @click="editRowIndex(record)"><a-icon type='edit'/>编辑</span>
          <span class="red" @click="deleteRowIndex(record)"><a-icon type='delete'/>删除</span>
        </span>
      </s-table>
    </div>
    <a-drawer
      :title="drawerTitle"
      :width="500"
      :body-style="{ paddingBottom: '80px' }"
      :visible="visible"
      @close="()=>visible = false"
    >
      <div class="table-page-search-wrapper">
        <a-form layout="inline" :form="drawerForm" @submit="downFunction">
          <a-row :gutter="48">
            <a-col :md="24" :sm="24">
              <a-form-item label="模板类型">
                <a-input
                  v-decorator="['typeName', {rules: [{ required: true, message: '请选择模板类型' }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <div class="btn">
            <a-button type="primary" icon="save" html-type="submit">保存</a-button>
            <a-button @click="()=> visible = false"><a-icon type="right"/>取消</a-button>
          </div>
        </a-form>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { getPageByParams, templateTypeSave, templateTypeUpdate, templateTypeDeleteById, deleteByIds } from '@/api/configurationManagement/templateModel/templateType'
import { STable } from '@/components'
export default {
  name: 'templateType',
  components: {
    STable
  },
  data() {
    return {
      queryParam: {},
      drawerTitle: '',
      visible: false,
      drawerStatus: '',
      selectedRowKeys: [],
      selectedRows: [],
      options: {
        alert: { show: false, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      loadData: parameter => {
        return getPageByParams(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.model
          })
      },
      columns: [{
        title: 'ID',
        dataIndex: 'id'
      },
      {
        title: '模板名称',
        dataIndex: 'typeName'
      },
      {
        title: '修改人',
        dataIndex: 'updateName',
        scopedSlots: { customRender: 'updateName' }
      },
      {
        title: '操作',
        dataIndex: 'operating',
        width: 180,
        scopedSlots: { customRender: 'operating' }
      }],
      drawerForm: this.$form.createForm(this, { name: 'drawerForm' }),
      rowIndexData: {}
    }
  },
  methods: {
    reset() {
      this.queryParam = {}
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    add() {
      this.drawerTitle = '添加模版类型'
      this.visible = true
      this.drawerStatus = 'add'
      this.drawerForm.resetFields()
    },
    editRowIndex(rowIndex) {
      this.drawerTitle = '编辑模版类型'
      this.visible = true
      this.drawerStatus = 'edit'
      this.rowIndexData = rowIndex
      this.$nextTick(() => {
        this.drawerForm.setFieldsValue({
          typeName: rowIndex.typeName
        })
      })
    },
    downFunction(e) {
      e.preventDefault()
      debugger
      this.drawerForm.validateFields((err, values) => {
        if (!err) {
          if (this.drawerStatus == 'add') {
            templateTypeSave({ typeName: values.typeName }).then(res => {
              if (res.code == 1000000) {
                this.$message.success(res.resultStr)
                this.visible = false
                this.$refs.table.refreshFn()
              }
            })
          } else if (this.drawerStatus == 'edit') {
            templateTypeUpdate({ id: this.rowIndexData.id, typeName: values.typeName }).then(res => {
              if (res.code == 1000000) {
                this.$message.success(res.resultStr)
                this.visible = false
                this.$refs.table.refreshFn()
              }
            })
          }
        }
      })
    },
    deleteRowIndex(rowIndex) {
      this.$confirm({
        title: '删除',
        content: `确定要删除此模板类型？`,
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          templateTypeDeleteById({ id: rowIndex.id }).then((res) => {
            if (res.code === 1000000) {
              this.$message.success(res.resultStr)
              this.selectedRowKeys = []
              this.selectedRows = []
              this.$refs.table.refreshFn()
            }
          })
        },
        onCancel() {}
      })
    },
    batchDele() {
      this.$confirm({
        title: '删除',
        content: `确定要删除这${this.selectedRowKeys.length}条模板类型？`,
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          deleteByIds({ ids: this.selectedRowKeys + '' }).then((res) => {
            if (res.code === 1000000) {
              this.$message.success(res.resultStr)
              this.selectedRowKeys = []
              this.selectedRows = []
              this.$refs.table.refreshFn()
            }
          })
        },
        onCancel() {}
      })
    }
  }
}
</script>

<style scoped lang="less">
@import './index.less'; // 这个分号一定要写，要不会报错
</style>
