<template>
  <div class="box">
    <div v-if="companyData">
      <Breadcrumb :baseBreadcrumbData="['国内机票','联系人']"></Breadcrumb>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="联系人名称">
                <a-input
                  v-model="queryParam.name"
                  placeholder="请输入"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="联系人手机号">
                <a-input
                  v-model="queryParam.mobile"
                  placeholder="请输入"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="联系人类型">
                <a-select
                  class="select"
                  v-model="queryParam.emergencyState"
                  placeholder="请选择类型"
                  @change="selectChange"
                >
                  <a-select-option :value="-1">
                    所有
                  </a-select-option>
                  <a-select-option :value="1">
                    紧急联系人
                  </a-select-option>
                  <a-select-option :value="0">
                    非紧急联系人
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" push="16">
              <!-- <a-form-item :style="{'text-align': 'right', color: 'red'}"> -->
              <!-- <a-form-item style="text-align: right;color: red;"> -->
              <a-form-item style="text-align: right">
                <a-button type="primary" html-type="submit" icon="search" @click="$refs.table.refreshFn(true)">
                  查询
                </a-button>
                <a-button @click="reset">
                  重置
                </a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="btn-box">
        <a-button type="primary" icon="plus" @click="addFn()">
          添加
        </a-button>
        <a-button type="primary" icon="download" @click="downloadAndExport" :disabled = "isDisableBtn">
          下载导出
        </a-button>
        <a-button type="danger" icon="delete" @click="deleteBatchFn" :disabled = "isDisableBtn">
          批量删除
        </a-button>
        <!-- <a-upload
          name="file"
          :multiple="uploadMultiple"
          :action="uploadAction"
          :headers="uploadHeaders"
          @change="uploadChange"
        >
          <a-button> <a-icon type="upload" />批量导入</a-button>
        </a-upload>
        <a href="">下载导入模板</a> -->
      </div>
      <s-table
        ref="table"
        size="default"
        rowKey = "id"
        :columns="columns"
        :data="loadData"
        :alert="options.alert"
        :rowSelection="options.rowSelection"
        showPagination="auto"
        :scroll="{x: 1400}"
      >
        <template slot="num" slot-scope="text, record, index">
          <span>{{index + 1}}</span>
        </template>
        <template slot="name" slot-scope="text, record">
          <span class="name">{{record.name}}</span><span v-if="record.emergencyState == 1" class="urgent">(紧急)</span>
        </template>
        <template slot="sex" slot-scope="text, record">
          <div>{{record.sex === 0 ? '男' : '女'}}</div>
        </template>
        <span slot='createName' slot-scope="text, record">
          <div>{{record.createId}}</div>
          <div>{{record.createTime}}</div>
        </span>
        <span slot='updateName' slot-scope="text, record">
          <div>{{record.updateId}}</div>
          <div>{{record.updateTime}}</div>
        </span>
        <template slot="operating" slot-scope="text, record">
          <div class="btn">
            <!-- <span class="blue" @click="detailFn(record)"><a-icon type="profile"/>详情</span> -->
            <span class="blue" @click="editFn(record)"><a-icon type="edit"/>编辑</span>
            <span class="red"  @click="deleteFn(record)"><a-icon type="delete"/>删除</span>
          </div>
        </template>
      </s-table>
      <a-drawer
        :title="drawerTitle"
        :width="890"
        :visible="visible"
        :body-style="{ paddingBottom: '80px' }"
        @close="drawerClose"
      >
        <!-- <a-form-item :style="{'display': 'none'}">
          <a-input
            v-decorator="['code']"
            type="hidden"
          />
        </a-form-item>
        <a-form-item :style="{'display': 'none'}">
          <a-input
            v-decorator="['supplierId']"
            type="hidden"
          />
        </a-form-item> -->
        <a-form :label-col="{ span: 5 }"
        :wrapper-col="{ span: 15 }"
        :form="drawerForm"
        >
          <a-form-item label="名称">
            <a-input
              v-decorator="['name', { rules: [{ required: true, max: 20, message: '必填项,20个字符以内'}] }]"
              placeholder="请输入"
            />
          </a-form-item>
          <a-form-item label="手机号">
            <a-input
              v-decorator="['mobile', { rules: [{ required: true, pattern: /^1\d{10}$/, message: '请输入有效的手机号'}]}]"
              placeholder="请输入"
            />
          </a-form-item>
          <a-form-item label="性别" >
            <a-radio-group v-decorator="['sex']">
              <a-radio :value="0">
                男
              </a-radio>
              <a-radio :value="1">
                女
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item>
            <span slot="label">
              是否为紧急联系人
              <a-tooltip title="紧急联系人信息会显示在报销凭证上">
                <a-icon type="info-circle" />
              </a-tooltip>
            </span>
            <a-radio-group v-decorator="['emergencyState']">
              <a-radio :value="1">
                是
              </a-radio>
              <a-radio :value="0">
                否
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="电话">
            <a-input
              v-decorator="['tel']"
              placeholder="请输入"
            />
          </a-form-item>
          <a-form-item label="传真">
            <a-input
              v-decorator="['fax']"
              placeholder="请输入"
            />
          </a-form-item>
          <a-form-item label="邮编">
            <a-input
            v-decorator="['postcode', { rules: [{pattern: /^\d{0,10}$/, message: '请输入有效的邮编'}]}]"
              placeholder="请输入"
            />
          </a-form-item>
          <a-form-item label="邮箱">
            <a-input
              v-decorator="['email', { rules: [{pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, message: '请输入有效的邮箱'}]}]"
              placeholder="请输入"
            />
          </a-form-item>
          <a-form-item label="地址">
            <a-input
              v-decorator="['address']"
              placeholder="请输入"
            />
          </a-form-item>
          <a-form-item labelAlign="right">
            <a-button type="primary" @click="drawerFn()">
              保存
            </a-button>
          </a-form-item>
        </a-form>
      </a-drawer>
    </div>
    <a-empty v-else description="请先选择供应商" />
  </div>
</template>

<script>
import { save, update, getPageByParams, deleteById, deleteByIds } from '@/api/supplier/contact.js'

import { STable } from '@/components'
import Breadcrumb from './Breadcrumb'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('supplier')

const columns = [
  {
    title: '序号',
    dataIndex: 'num',
    width: 60,
    scopedSlots: { customRender: 'num' },
    fixed: 'left'
  },
  {
    title: '联系人ID',
    dataIndex: 'supplierId',
    width: 120,
    fixed: 'left'
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 120,
    scopedSlots: { customRender: 'name' },
    fixed: 'left'
  },
  {
    title: '手机号',
    width: 120,
    dataIndex: 'mobile'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    scopedSlots: { customRender: 'sex' }
  },
  {
    title: '电话',
    width: 120,
    dataIndex: 'tel'
  },
  {
    title: '传真',
    dataIndex: 'fax'
  },
  {
    title: '邮箱',
    width: 120,
    dataIndex: 'email'
  },
  {
    title: '添加人',
    dataIndex: 'createId',
    scopedSlots: { customRender: 'createName' }
  },
  {
    title: '修改人',
    dataIndex: 'updateId',
    ellipsis: true,
    scopedSlots: { customRender: 'updateName' }
  },
  {
    title: '操作',
    dataIndex: 'operating',
    scopedSlots: { customRender: 'operating' },
    width: 160,
    fixed: 'right'
  }
]

export default {
  name: 'authority',
  components: {
    STable,
    Breadcrumb
  },
  data () {
    return {
      drawerForm: this.$form.createForm(this, { name: 'drawerForm' }),
      queryParam: {},
      uploadMultiple: true, // 是否支持多选文件，ie10+ 支持。开启后按住 ctrl 可选择多个文件
      uploadAction: '',
      uploadHeaders: {}, // 设置上传的请求头，头部ie10以上支持
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log(this.queryParam)
        console.log(this.queryParam.emergencyState || -1)
        const data = {
          code: '1001',
          supplierId: this.company.id,
          emergencyState: this.queryParam.emergencyState === undefined ? -1 : this.queryParam.emergencyState
        }
        return getPageByParams(Object.assign(parameter, this.queryParam, data))
          .then(res => {
            console.log(res)
            return res.model
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      // custom table alert & rowSelection
      options: {
        alert: { show: false, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: false,
      loading: false,
      drawerTitle: '',
      logoAction: '',
      logoLoading: false,
      logoImageUrl: '',
      visible: false,
      emergencyState: '1',
      drawerSubmit: ''
    }
  },
  mounted() {
    console.log(this.company)
  },
  computed: {
    ...mapState(['company']),
    companyData() {
      if (this.company) {
        return this.company
      } else {
        return ''
      }
    },
    isDisableBtn() {
      let flag = true
      if (this.selectedRowKeys.length > 0) {
        flag = false
      }
      return flag
    }
  },
  methods: {
    ...mapActions(['setCompany']),
    reset() {
      this.queryParam = {}
      this.$refs.table.refreshFn()
    },
    uploadChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} 文件上传成功`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 文件上传失败.`)
      }
    },
    downloadAndExport () {

    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    selectChange(key) {
      console.log(key)
    },
    showDrawer({ record, title }) {
      this.drawerTitle = title
      this.visible = true
    },
    addFn() {
      this.drawerTitle = '新增'
      this.visible = true
      // const drawerFormData = {
      //   code: this.company.code,
      //   supplierId: this.company.supplierId
      // }
      // this.drawerInit(drawerFormData)
      this.drawerInit()
      this.drawerSubmit = save
    },
    detailFn(record) {
      this.drawerTitle = '详情'
      this.visible = true
      this.drawerInit()
    },
    editFn(record) {
      this.drawerTitle = '编辑'
      this.visible = true
      this.drawerFormData = record
      this.drawerSubmit = update
      const drawerFormData = {
        name: record.name,
        mobile: record.mobile,
        sex: record.sex,
        emergencyState: record.emergencyState,
        tel: record.tel,
        fax: record.fax,
        postcode: record.postcode,
        email: record.email,
        address: record.address
      }
      this.drawerInit(drawerFormData)
    },
    deleteFn(record) {
      this.$confirm({
        title: '删除',
        content: `确定要删除${record.name}吗`,
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          const data = {
            id: record.id
          }
          deleteById(data).then((res) => {
            if (res.code === 1000000) {
              this.$message.success(res.resultStr)
              // this.listData = this.listData.filters((item) => {
              //   return item.id !== record.id
              // })
              this.$refs.table.refreshFn()
            } else {
              this.$message.error(res.resultStr)
            }
          })
        },
        onCancel() {}
      })
    },
    deleteBatchFn() {
      if (this.selectedRows.length < 1) {
        this.$message.warning('请选择要删除的数据！')
        return
      }
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
              // this.listData = this.listData.filters((item) => {
              //   this.selectedRows.forEach(element => {
              //     return element.id !== item.id
              //   })
              // })
              this.$refs.table.refreshFn()
            } else {
              this.$message.error(res.resultStr)
            }
          })
        },
        onCancel() {}
      })
    },
    drawerInit(drawerFormData) {
      let initData = {}
      if (drawerFormData) {
        initData = drawerFormData
      }
      // 表单回显必须使用后 nextTick
      this.$nextTick(() => {
        this.drawerForm.setFieldsValue(initData)
      })
    },
    drawerFn() {
      this.drawerForm.validateFields({ force: true }, (err, values) => {
        if (!err) {
          console.log('login form', values)
          const data = { ...values }
          data.code = '1001'
          data.supplierId = this.company.id
          this.drawerSubmit(data).then((res) => {
            if (res.code === 1000000) {
              this.$message.success(res.resultStr)
              this.visible = false
              this.$refs.table.refreshFn()
            } else {
              this.$message.error(res.resultStr)
            }
          })
        }
      })
    },
    tablePageChange (page, pageSize) {
      console.log(page, pageSize)
    },
    drawerClose() {
      this.visible = false
    },
    cascaderChange(value, selectedOptions) {
      console.log(value, selectedOptions)
    },
    cascaderFilter(inputValue, path) {
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    },
    onExpand(expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck(checkedKeys) {
      console.log('onCheck', checkedKeys)
      this.checkedKeys = checkedKeys
    },
    onSelect(selectedKeys, info) {
      console.log('onSelect', info)
      this.selectedKeys = selectedKeys
    }
  }
}
</script>

<style scoped lang="less">
@import './index.less'; // 这个分号一定要写，要不会报错
.box{
  padding: 16px;
}
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
td {
  .name{
    cursor: pointer;
    color: rgba(0, 150, 250, 0.996);
    text-decoration:underline ;
  }
  .urgent{
    margin-left: 6px;
    color: rgb(216, 10, 10);
  }
}
</style>
