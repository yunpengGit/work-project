<template>
  <div class="billingInfoManagement">
    <div>开票信息列表</div>
    <a-divider />
    <div class="table-page-search-wrapper">
      <a-form layout="inline" >
        <a-row :gutter="48">
          <!-- <a-col :md="8" :sm="24">
            <a-form-item label="企业名称">
              <a-input v-model="queryParam.likeName" placeholder="请输入" />
            </a-form-item>
          </a-col> -->
          <a-col :md="8" :sm="24">
            <a-form-item label="纳税人识别号">
              <a-input v-model="queryParam.identification" placeholder="请输入" />
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
    <div class="btn" >
      <a-button type="primary" icon="plus" @click="add">添加</a-button>
      <a-button type="danger" icon="delete" @click="batchDelete" :disabled='selectedRowKeys.length > 0'>批量删除</a-button>
    </div>
    <s-table
      :columns="columns"
      ref="table"
      size="default"
      rowKey = "id"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      showPagination="auto"
    >
      <span slot='invoiceTitle' slot-scope="text, record" class="btn">
        <span class="blue" @click="detailRowIndex(record)">{{record.invoiceTitle}}</span>
      </span>
      <span slot='operating' slot-scope="text, record" class="btn">
        <span class="blue" @click="editRowIndex(record)">编辑</span>
        <span class="red" @click="deleteRowIndex(record)">删除</span>
      </span>
      <span slot='updateTime' slot-scope="text, record">
        <div>{{record.updateName}}</div>
        <div>{{record.updateTime}}</div>
      </span>
    </s-table>
    <a-drawer
      :title="drawerTitle"
      :width="680"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="()=> visible = false"
    >
      <div class="table-page-search-wrapper">
      <a-form layout="inline" :form="drawerParam" @submit="saveFunction">
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-form-item label="企业名称">
              <a-input v-if="saveState !='detail'" :maxLength="50" v-decorator="['invoiceTitle', { rules: [{ required: true, message: '请输入企业名称' }] }]" />
              <div v-else>{{rowIndexData.invoiceTitle}}</div>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="企业地址">
              <a-input v-if="saveState !='detail'" :maxLength="50" v-decorator="['address', { rules: [{ required: true, message: '请输入企业地址' }] }]" />
              <div v-else>{{rowIndexData.address}}</div>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="纳税人识别号">
              <a-input v-if="saveState !='detail'" :maxLength="50" v-decorator="['identification', { rules: [{ required: true, message: '请输入纳税人识别号' }] }]" />
              <div v-else>{{rowIndexData.identification}}</div>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="开户行名称">
              <a-input v-if="saveState !='detail'" :maxLength="50" v-decorator="['bankName', { rules: [{ required: true, message: '请输入开户行名称' }] }]" />
              <div v-else>{{rowIndexData.bankName}}</div>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="银行账号">
              <a-input v-if="saveState !='detail'" :maxLength="50" v-decorator="['bankAccount', { rules: [{ required: true, message: '请输入银行账号' }] }]" />
              <div v-else>{{rowIndexData.bankAccount}}</div>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="企业电话">
              <a-input v-if="saveState !='detail'" :maxLength="50" v-decorator="['categoryphone', { rules: [{ required: true, message: '请输入企业电话' }] }]" />
              <div v-else>{{rowIndexData.categoryphone}}</div>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="是否为一般纳税人">
              <a-select v-if="saveState !='detail'"
                v-decorator="['generalTaxpayer', {rules: [{ required: true, message: '请选择' }] }]">
                <a-select-option :value='1'>是</a-select-option>
                <a-select-option :value='0'>否</a-select-option>
              </a-select>
              <div v-else v-text="rowIndexData.generalTaxpayer == 1?'是':'否'"></div>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="是否在APP显示">
              <a-select v-if="saveState !='detail'"
                v-decorator="['appShow', {rules: [{ required: true, message: '请选择' }] }]">
                <a-select-option :value='1'>展示</a-select-option>
                <a-select-option :value='0'>不展示</a-select-option>
              </a-select>
              <div v-else v-text="rowIndexData.appShow == 1?'展示':'不展示'"></div>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24" v-if="saveState =='detail'" class="imgContent">
            <a-form-item label="税票机二维码">
              <img :src="rowIndexData.qrCodeUri" class="detailImg">
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24" v-if="saveState =='detail'" class="imgContent">
            <a-form-item label="微信二维码">
              <img :src="rowIndexData.qrCodeWordUri" class="detailImg">
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
import { getPageByParams, save, update, deleteById, deleteByIds, getById } from '@/api/organizationManagement/billingInfo'
import { STable } from '@/components'
export default {
  name: 'billingInfoManagement',
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
      drawerTitle: '',
      visible: false,
      saveState: '',
      rowIndexData: '',
      drawerParam: this.$form.createForm(this, { name: 'drawerParam' }),
      loadData: parameter => {
        return getPageByParams(Object.assign(parameter, this.queryParam, { categoryId: this.treeSelected.id }))
          .then(res => {
            return res.model
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      options: {
        alert: { show: false, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      columns: [{
        title: '企业名称',
        dataIndex: 'invoiceTitle',
        scopedSlots: { customRender: 'invoiceTitle' }
      },
      {
        title: '纳税人识别号',
        dataIndex: 'identification'
      },
      {
        title: '开户银行名称',
        dataIndex: 'bankName'
      },
      {
        title: '修改人',
        dataIndex: 'updateTime',
        scopedSlots: { customRender: 'updateTime' }
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
    add() {
      this.drawerTitle = '新增开票信息'
      this.visible = true
      this.saveState = 'add'
      this.drawerParam.resetFields()
    },
    editRowIndex(rowIndex) {
      this.drawerTitle = '编辑开票信息'
      this.visible = true
      this.saveState = 'edit'
      this.rowIndexData = rowIndex
      this.drawerParam.resetFields()
      this.$nextTick(() => {
        this.drawerParam.setFieldsValue({
          invoiceTitle: rowIndex.invoiceTitle,
          address: rowIndex.address,
          identification: rowIndex.identification,
          bankName: rowIndex.bankName,
          bankAccount: rowIndex.bankAccount,
          categoryphone: rowIndex.categoryphone,
          generalTaxpayer: rowIndex.generalTaxpayer,
          appShow: rowIndex.appShow
        })
      })
    },
    saveFunction(e) {
      e.preventDefault()
      this.drawerParam.validateFields((err, values) => {
        if (!err) {
          values.categoryId = this.treeSelected.id
          if (this.saveState == 'add') {
            save(values).then(res => {
              if (res.code == 1000000) {
                this.$message.success(res.resultStr)
                this.visible = false
                this.$refs.table.refreshFn()
              }
            })
          } else if (this.saveState == 'edit') {
            values.id = this.rowIndexData.id
            update(values).then(res => {
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
    detailRowIndex(rowIndex) {
      getById({ id: rowIndex.id }).then(res => {
        if (res.code == 1000000) {
          this.rowIndexData = res.model
          this.drawerTitle = '开票信息详情'
          this.saveState = 'detail'
          this.visible = true
        }
      })
    },
    deleteRowIndex(rowIndex) {
      deleteById({ id: rowIndex.id }).then(res => {
        if (res.code == 1000000) {
          this.$refs.table.refreshFn()
        }
      })
    },
    batchDelete() {
      const selectedRowKeys = this.selectedRowKeys
      this.$confirm({
        title: '删除',
        content: `确定要删除已选中的数据吗`,
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          const data = { ids: selectedRowKeys + '' }
          deleteByIds(data).then((res) => {
            if (res.code === 1000000) {
              this.$message.success(res.resultStr)
              this.$refs.table.refreshFn()
              this.this.selectedRowKeys = []
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
@import './index.less';
</style>
