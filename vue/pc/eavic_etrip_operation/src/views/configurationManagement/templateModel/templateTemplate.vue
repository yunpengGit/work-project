<template>
  <div class="templateTemplate">
    <div>
      <div>模板列表</div>
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
            <a-form-item label="模板名称">
              <a-input
                v-model="queryParam.typeName"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="模板类型">
              <a-select v-model="queryParam.templateTypeId">
                <a-select-option value=''>
                  所有
                </a-select-option>
                <a-select-option v-for="item in modelList" :key="item.id" :value='item.id'>
                  {{item.typeName}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
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
        <span slot="name" slot-scope="text, record" class="btn">
          <span class="blue" @click="detail(record)">{{record.name}}</span>
        </span>
        <span slot="updateName" slot-scope="text, record">
          <div>{{record.updateName}}</div>
          <div>{{record.updateTime}}</div>
        </span>
         <span slot="templateTypeId" slot-scope="text, record">
          <span v-text="record.templateTypeId !=null?'':''"></span>
          <span v-text="record.templateTypeId!=null?(modelList.filter((item)=>item.id == record.templateTypeId))[0].typeName:''"></span>
        </span>
        <span slot='operating' slot-scope="text, record" class="btn">
          <span class="blue" @click="editRowIndex(record)"><a-icon type='edit'/>编辑</span>
          <span class="red" @click="deleteRowIndex(record)"><a-icon type='delete'/>删除</span>
        </span>
      </s-table>
    </div>
    <a-drawer
      :title="drawerTitle"
      :width="680"
      :body-style="{ paddingBottom: '80px' }"
      :visible="visible"
      @close="()=>visible = false"
    >
      <div class="table-page-search-wrapper">
        <a-form layout="inline" :form="drawerForm" @submit="downFunction">
          <a-row :gutter="48">
            <a-col :md="24" :sm="24">
              <a-form-item label="模板名称">
                <a-input
                  :maxLength="30" v-if="drawerStatus != 'detail'"
                  v-decorator="['name', {rules: [{ required: true, message: '请输入模板名称' }] }]"
                />
                <div v-else>{{rowIndexData.name}}</div>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="模板类型">
                <a-select v-if="drawerStatus != 'detail'"
                  v-decorator="['templateTypeId', {rules: [{ required: true, message: '请选择模板类型' }] }]">
                  <a-select-option v-for="item in modelList" :key="item.id" :value='item.id'>
                    {{item.typeName}}
                  </a-select-option>
                </a-select>
                <div v-else v-text="rowIndexData.templateTypeId!=null?(modelList.filter((item)=>item.id == rowIndexData.templateTypeId))[0].typeName:''"></div>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="模板序号">
                <a-input v-if="drawerStatus != 'detail'" type='number'
                  v-decorator="['templateNum', {rules: [{ required: true, message: '请输入不超过4位模板序号', max: 3 }] }]"
                />
                <div v-else>{{rowIndexData.templateNum}}</div>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24" :style="{marginBottom: '20px'}">
              <a-form-item label="上传的文件">
                <a-upload v-if="drawerStatus != 'detail'"
                  v-decorator="['file', {rules: [{ required: true, message: '请上传文件' }] }]"
                  :action="logoAction"
                  :headers="logoHeaders"
                  :default-file-list="fileListFile"
                  :fileList="fileListFile"
                  :before-upload="logoBeforeUploadFile"
                  @change="handleChangeFile"
                  class="upload-list-inline"
                >
                  <a-button v-if="fileListFile.length < 1"> <a-icon type="upload" /> 选择文件 </a-button>
                </a-upload>
                <a v-else :href="rowIndexData.templatePath" v-text="rowIndexData.templatePath !=null?'文件.xlsx':'无'"></a>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="上传图片">
                <a-upload v-if="drawerStatus != 'detail'"
                  v-decorator="['img', {rules: [{ required: true, message: '请上传图片' }] }]"
                  :action="logoAction"
                  list-type="picture-card"
                  :default-file-list="fileList"
                  :fileList="fileList"
                  :headers="logoHeaders"
                  :before-upload="logoBeforeUpload"
                  @change="handleChange"
                  @preview="handlePreview"
                  class="upload-list-inline"
                >
                  <div v-if="fileList.length < 1">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">
                      上传logo
                    </div>
                  </div>
                </a-upload>
                <div v-else ><img v-if="rowIndexData.imagePath != null" style="width: 100px; height: 100px;cursor: pointer;" :src='rowIndexData.imagePath'  @click="handlePreview({url:rowIndexData.imagePath})"/></div>
              </a-form-item>
            </a-col>
          </a-row>
          <div class="btn" style="marginTop:90px">
            <a-button v-if="drawerStatus != 'detail'" type="primary" icon="save" html-type="submit">保存</a-button>
            <a-button @click="()=> visible = false"><a-icon type="right"/>取消</a-button>
          </div>
        </a-form>
      </div>
    </a-drawer>
    <a-modal :visible="previewVisible" :footer="null" @cancel="()=> previewVisible = false">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getListByParamsTemplateType, getPageByParams, save, update, deleteById, deleteByIds } from '@/api/configurationManagement/templateModel/templateTemplate'
import { STable } from '@/components'
export default {
  name: 'templateTemplate',
  components: {
    STable
  },
  data() {
    return {
      queryParam: {},
      modelList: [],
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
        dataIndex: 'name',
        scopedSlots: { customRender: 'name' }
      },
      {
        title: '模板类型名称',
        dataIndex: 'templateTypeId',
        scopedSlots: { customRender: 'templateTypeId' }
      },
      {
        title: '模板序号',
        dataIndex: 'templateNum'
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
      rowIndexData: {},
      logoHeaders: {
        'App-Token': Vue.ls.get(ACCESS_TOKEN)
      },
      logoAction: '/api/uploadordownloadtask/uploadOrDownload/uploadFile',
      fileList: [],
      fileListFile: [],
      logoImageUrl: '',
      upFileUrl: '',
      previewVisible: false,
      previewImage: '',
      getImgAdress: file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => resolve(reader.result)
          reader.onerror = error => reject(error)
        })
      }
    }
  },
  created() {
    this.getmodelList()
  },
  methods: {
    getmodelList() {
      getListByParamsTemplateType({}).then(res => {
        if (res.code == 1000000) {
          this.modelList = res.model
        }
      })
    },
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
      this.fileListFile = []
      this.fileList = []
    },
    editRowIndex(rowIndex) {
      this.drawerTitle = '编辑模版类型'
      this.visible = true
      this.drawerStatus = 'edit'
      this.rowIndexData = rowIndex
      this.$nextTick(() => {
        if (rowIndex.imagePath != null) {
          this.fileList = [{
            uid: '-1',
            name: '图片.png',
            status: 'done',
            response: 'Server Error 500',
            url: rowIndex.imagePath
          }]
        } else {
          this.fileList = []
        }
        if (rowIndex.templatePath !== null) {
          this.fileListFile = [{
            uid: '-2',
            name: '文件.xlsx',
            status: 'done',
            response: 'Server Error 500',
            url: rowIndex.templatePath
          }]
        } else {
          this.fileListFile = []
        }
        this.drawerForm.resetFields()
        this.drawerForm.setFieldsValue({
          name: rowIndex.name,
          templateTypeId: rowIndex.templateTypeId,
          templateNum: rowIndex.templateNum,
          file: this.fileListFile,
          img: this.fileList
        })
      })
    },
    downFunction(e) {
      e.preventDefault()
      this.drawerForm.validateFields((err, values) => {
        if (!err) {
          values.templatePath = this.upFileUrl || values.file.url
          values.imagePath = this.logoImageUrl || values.img.url
          delete values.img
          delete values.file
          if (this.drawerStatus == 'add') {
            save(values).then(res => {
              if (res.code == 1000000) {
                this.$message.success(res.resultStr)
                this.visible = false
                this.$refs.table.refreshFn()
              }
            })
          } else if (this.drawerStatus == 'edit') {
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
    deleteRowIndex(rowIndex) {
      this.rowIndexData = rowIndex
      this.$confirm({
        title: '删除',
        content: `确定要删除此模板类型？`,
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          deleteById({ id: [this.rowIndexData.id] + '' }).then((res) => {
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
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getImgAdress(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange(info) {
      this.fileList = info.fileList
      if (info.file.status === 'done') {
        this.fileList = info.fileList
        this.logoImageUrl = info.file.response.model
      }
    },
    handleChangeFile(info) {
      this.fileListFile = info.fileList
      if (info.file.status === 'done') {
        this.fileListFile = info.fileList
        this.upFileUrl = info.file.response.model
      }
    },
    logoBeforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('请上传图片文件!')
      }
      const maxSize = (file.size / 1024) <= 300
      if (!maxSize) {
        this.$message.error('上传文件大小限制为，最大300kb!')
      }
      return isJpgOrPng && maxSize
    },
    logoBeforeUploadFile(file) {
      const isJpgOrPng = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!isJpgOrPng) {
        this.$message.error('请上传xlsx文件!')
      }
      return isJpgOrPng
    },
    detail(rowIndex) {
      this.visible = true
      this.drawerStatus = 'detail'
      this.drawerTitle = '模板详情'
      this.rowIndexData = rowIndex
    }
  }
}
</script>

<style scoped lang="less">
@import './index.less'; // 这个分号一定要写，要不会报错
</style>
