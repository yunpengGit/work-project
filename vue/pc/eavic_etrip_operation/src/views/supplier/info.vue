<template>
  <div>
    <a-tabs>
      <a-tab-pane :tab="tabList[0]">
        <div class="title">{{tabList[0]}}</div>
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
                <a-form-item label="供货商名称">
                  <a-input
                    v-model="queryParam.name"
                    placeholder="请输入"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="供货商简称">
                  <a-input
                    v-model="queryParam.shortName"
                    placeholder="请输入"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="纳税人识别号">
                  <a-input
                    v-model="queryParam.taxpayerIdNumber"
                    placeholder="请输入"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24" :push="8" :style="{textAlign: 'right'}">
                <a-form-item>
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
          <!-- <a-button type="primary" icon="download" @click="downloadAndExport" :disabled = "isDisableBtn">
            下载导出
          </a-button> -->
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
        >
          <template slot="num" slot-scope="text, record, index">
            <span>{{index + 1}}</span>
          </template>
          <template slot="name" slot-scope="text, record,">
            <span class="name" @click="detailFn(record)">{{record.name}}</span>
          </template>
          <template slot="logo" slot-scope="text, record">
            <img :src="record.logo" alt="">
          </template>
          <span slot='createName' slot-scope="text, record">
            <div>{{record.createName}}</div>
            <div>{{record.createTime}}</div>
          </span>
          <span slot='updateName' slot-scope="text, record">
            <div>{{record.updateName}}</div>
            <div>{{record.updateTime}}</div>
          </span>
          <span slot="description" slot-scope="text">
            <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
          </span>
          <template slot="operating" slot-scope="text, record">
            <div class="btn">
              <span class="blue" @click="editFn(record)"><a-icon type="edit"/>编辑</span>
              <span class="red"  @click="deleteFn(record)"><a-icon type="delete"/>删除</span>
            </div>
          </template>
        </s-table>
      </a-tab-pane>
    </a-tabs>
    <a-drawer
      :title="drawerTitle"
      :width="890"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="drawerClose"
    >
      <detail-list v-if="isDetail" v-slot:list :col="1">
        <detail-list-item term="供应商LOGO">
          <img :src="detailData.logo" alt="" class="logo-img">
        </detail-list-item>
        <detail-list-item term="供应商全称">{{detailData.name}}</detail-list-item>
        <detail-list-item term="供应商简称">{{detailData.shortName}}</detail-list-item>
        <detail-list-item term="纳税人识别号">{{detailData.taxpayerIdNumber}}</detail-list-item>
        <detail-list-item term="传值">{{detailData.fax}}</detail-list-item>
        <detail-list-item term="邮编">{{detailData.postcode}}</detail-list-item>
        <detail-list-item term="地址">{{detailData.address}}</detail-list-item>
        <detail-list-item term="简介">{{detailData.introduction}}</detail-list-item>
        <detail-list-item term="服务类型">
          <!-- <span>{{detailData.code}}</span> -->
          <a-tag color="#0096FA" v-for="(item, index) in detailData.code.split(',')" :key="index">
            {{supplierTypeMap.get(item)}}
          </a-tag>
        </detail-list-item>
        <detail-list-item term="添加人"><span class="name">{{detailData.createName}}</span><span class="date"><icon-font type="time"/>{{detailData.createTime}}</span></detail-list-item>
        <detail-list-item term="修改人" v-if="detailData.updateName"><span class="name">{{detailData.updateName}}</span><span class="date"><icon-font type="time"/>{{detailData.updateTime}}</span></detail-list-item>
      </detail-list>
      <a-form
        v-else
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 15 }"
        :form="drawerForm"
      >
        <a-form-item :style="{'display': 'none'}">
          <a-input
            v-decorator="['id']"
            type="hidden"
          />
        </a-form-item>
        <a-form-item label="供货商名称">
          <a-input
            v-decorator="['name', { rules: [{ required: true, max: 30, message: '必填项,不能超过30个字符'}] }]"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item label="供货商简称">
          <a-input
            v-decorator="['shortName', { rules: [{ required: true, max: 20, message: '必填项,不能超过20个字符'}] }]"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item label="供货商logo">
          <a-upload
            name="file"
            list-type="picture-card"
            class="avatar-uploader"
            :headers="logoHeaders"
            :show-upload-list="false"
            :action="logoAction"
            :before-upload="logoBeforeUpload"
            @change="logoChange"
            v-decorator="[
              'logo',
              {
                valuePropName: 'fileList',
                getValueFromEvent: normFile
              },
            ]"
          >
            <img v-if="logoImageUrl" :src="logoImageUrl" alt="图片地址失效" class="logo-img"/>
            <div v-else>
              <a-icon :type="logoLoading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                上传logo
              </div>
            </div>
          </a-upload>
          <div style="{font-size: 12px;color: #AAAAAA;line-height: 16px;}">用于显示在APP或打印凭证上显示。建议尺寸：750*400 大小：300KB以下</div>
        </a-form-item>
        <a-form-item label="纳税人识别号">
          <a-input
            v-decorator="['taxpayerIdNumber', {
                rules: [{ required: true, message: '必填项'}]
              },]"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item label="服务内容">
          <a-select
            v-decorator="[
              'code',
              {
                rules: [{ required: true, message: '必填项'}]
              },
            ]"
            mode="multiple"
            style="width: 100%"
            placeholder="请选择，可多选"
            @change="selectChange"
          >
            <a-select-option v-for="item in supplierType" :key="item.name">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="供货商传真">
          <a-input
            v-decorator="['fax']"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item label="供货商邮编">
          <a-input
            v-decorator="['postcode', { rules: [{ pattern: /^\d{0,10}$/, message: '数字，长度不能超过10个'}]}]"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item label="供货商地址">
          <a-input
            v-decorator="['address', { rules: [{ max: 70, message: '字段长度不能超过70个字符'}]}]"
            placeholder="请输入"
          />
        </a-form-item>
        <!-- <a-form-item label="供货商地址">
          <a-cascader
            :options="cascaderOptions"
            :show-search="{ cascaderFilter }"
            placeholder="Please select"
            @change="cascaderChange"
            v-decorator="['address']"
          />
        </a-form-item> -->
        <a-form-item label="供货商简介">
          <a-input
            v-decorator="['introduction']"
            placeholder="请输入"
            type="textarea" />
        </a-form-item>
        <a-row>
          <a-col :md="48" :style="{textAlign: 'right'}">
            <a-button type="primary" @click="drawerFn()">
              保存
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-drawer>
  </div>
</template>

<script>
import Vue from 'vue'

import { ACCESS_TOKEN } from '@/store/mutation-types'
import {
  save,
  update,
  getPageByParams,
  deleteById,
  deleteByIds
} from '@/api/supplier/info.js'
import { STable, Ellipsis, DetailList } from '@/components'
import { getBase64 } from '@/utils/objectType'
const DetailListItem = DetailList.Item

const columns = [
  {
    title: '序号',
    dataIndex: 'num',
    width: 60,
    scopedSlots: { customRender: 'num' },
    fixed: 'left'
  },
  {
    title: 'ID',
    dataIndex: 'id',
    fixed: 'left'
  },
  {
    title: '供货商全称',
    dataIndex: 'name',
    fixed: 'left',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '供货商简称',
    dataIndex: 'shortName'
  },
  {
    title: '纳税人识别号',
    dataIndex: 'taxpayerIdNumber'
  },
  // {
  //   title: '供货商logo',
  //   dataIndex: 'logo',
  //   scopedSlots: { customRender: 'logo' }
  // },
  // {
  //   title: '供货商邮编',
  //   dataIndex: 'postcode'
  // },
  // {
  //   title: '供货商传真',
  //   dataIndex: 'fax'
  // },
  // {
  //   title: '供货商简介',
  //   dataIndex: 'introduction'
  // },
  {
    title: '添加人',
    dataIndex: 'createId',
    ellipsis: true,
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
    width: 160,
    scopedSlots: { customRender: 'operating' },
    fixed: 'right'
  }
]
const supplierTypeMap = new Map([
  ['1001', '国内机票'],
  ['1002', '国际机票'],
  ['1003', '酒店'],
  ['1004', '用车']
])
const supplierTypeMap0 = new Map([
  ['国内机票', '1001'],
  ['国际机票', '1002'],
  ['酒店', '1003'],
  ['用车', '1004']
])
export default {
  name: 'authority',
  components: {
    STable,
    Ellipsis,
    DetailList,
    DetailListItem
  },
  data () {
    return {
      drawerForm: this.$form.createForm(this, { name: 'drawerForm' }),
      tabList: ['供应商'],
      queryParam: {},
      code: '1001', // 供应商类型
      uploadMultiple: true, // 是否支持多选文件，ie10+ 支持。开启后按住 ctrl 可选择多个文件
      uploadAction: '',
      uploadHeaders: {}, // 设置上传的请求头，头部ie10以上支持
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getPageByParams(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.model
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      // custom table alert & rowSelection
      options: {
        alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: false,
      loading: false,
      drawerTitle: '',
      logoAction: '/api/supplier/supplier/uploadLogo',
      logoLoading: false,
      logoHeaders: {
        'App-Token': Vue.ls.get(ACCESS_TOKEN)
      },
      logoImageUrl: '',
      detailData: {},
      isDetail: true,
      visible: false,
      supplierType: [
        { id: '1001', name: '国内机票' },
        { id: '1002', name: '国际机票' },
        { id: '1003', name: '酒店' },
        { id: '1004', name: '用车' }
      ],
      supplierTypeMap,
      supplierTypeMap0,
      drawerSubmit: ''
    }
  },
  computed: {
    isDisableBtn() {
      let flag = true
      if (this.selectedRowKeys.length > 0) {
        flag = false
      }
      return flag
    }
  },
  methods: {
    reset() {
      this.queryParam = {}
      this.$refs.table.refreshFn()
    },
    // * btnWrapper
    addFn(record) {
      this.drawerTitle = '新增'
      this.isDetail = false
      this.logoImageUrl = ''
      this.visible = true
      this.drawerForm.resetFields()
      this.drawerInit()
      this.drawerSubmit = save
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
    // * table
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    detailFn(record) {
      this.drawerTitle = '详情'
      this.detailData = record
      console.log(this.detailData)
      this.visible = true
      // this.drawerInit()
    },
    editFn(record) {
      this.drawerTitle = '编辑'
      this.isDetail = false
      this.visible = true
      this.drawerFormData = record
      this.drawerSubmit = update
      const arr = record.code.split(',')
      record.code = arr.map(item => {
        return this.supplierTypeMap.get(item)
      })
      const drawerFormData = {
        id: record.id,
        name: record.name,
        shortName: record.shortName,
        address: record.address,
        taxpayerIdNumber: record.taxpayerIdNumber,
        // logo: [record.logo],
        postcode: record.postcode,
        fax: record.fax,
        introduction: record.introduction,
        code: record.code
      }
      // this.selectDefaultValue = record.code.split(',')
      this.logoImageUrl = record.logo
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
    tablePageChange (page, pageSize) {
      console.log(page, pageSize)
    },
    // * drawer
    showDrawer({ record, title }) {
      this.drawerTitle = title
      this.visible = true
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
          data.code = data.code.map(item => {
            return this.supplierTypeMap0.get(item)
          })
          data.code = data.code.join(',')
          if (data.logo && data.logo.length > 0) {
            data.logo = data.logo[0].response.model
          } else if (this.logoImageUrl) {
            data.logo = this.logoImageUrl
          }
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
    drawerClose() {
      this.visible = false
    },
    cascaderChange(value, selectedOptions) {
      console.log(value, selectedOptions)
    },
    cascaderFilter(inputValue, path) {
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    },
    // * 上传logo
    logoChange(info) {
      if (info.file.status === 'uploading') {
        this.logoLoading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, logoImageUrl => {
          this.logoImageUrl = logoImageUrl
          this.logoLoading = false
        })
      }
    },
    logoBeforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      console.log(file)
      if (!isJpgOrPng) {
        this.$message.error('请上传图片文件!')
      }
      // 限制上传大小300kb以下
      const maxSize = (file.size / 1024) <= 300
      if (!maxSize) {
        this.$message.error('上传文件大小限制为，最大300kb!')
      }
      return isJpgOrPng && maxSize
    },
    // logo 上传校验
    normFile(e) {
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
    selectChange(key) {
      console.log(key)
      const arr = key.map(item => {
        return this.supplierTypeMap.get(item)
      })
      console.log(arr)
    }
  }
}
</script>
<style lang="less">
.ant-modal-body .ant-form-item .ant-form-item-control-wrapper{
  display: inline-block;
}
</style>
<style scoped lang="less">
@import './index.less'; // 这个分号一定要写，要不会报错
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

.logo-img{
  width: 188px;
  height: 104px;
}
/deep/.ant-upload.ant-upload-select-picture-card{
  width: 188px;
  height: 100px;
}
.detail-list,
td {
  .name{
    cursor: pointer;
    color: rgba(0, 150, 250, 0.996);
    text-decoration:underline ;
  }
}
.detail-list{
  .date{
    margin-left: 16px;
  }
}
/deep/[for="drawerForm_logo"]{
  position: relative;
  &:before {
    display: inline-block;
    margin-right: 4px;
    color: #f5222d;
    font-size: 14px;
    line-height: 1;
    content: '*';
}
}
</style>
