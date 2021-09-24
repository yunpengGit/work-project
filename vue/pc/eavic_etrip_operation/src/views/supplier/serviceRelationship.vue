<template>
  <div class="box">
    <div v-if="companyData">
      <Breadcrumb :baseBreadcrumbData="['国内机票','服务关系']"></Breadcrumb>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="全称">
                <a-input
                  v-model="queryParam.categoryName"
                  placeholder="请输入"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="简称">
                <a-input
                  v-model="queryParam.categoryShortName"
                  placeholder="请输入"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
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
        <a-button type="danger" icon="delete" @click="deleteBatchFn" :disabled = "isDisableBtn">
          批量解除服务关系
        </a-button>
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
        <template slot="categoryName" slot-scope="text, record">
          <span class="categoryName" @click="detailFn(record)">{{record.categoryName}}</span>
        </template>
        <template slot="categoryShortName" slot-scope="text, record">
          <span>{{record.categoryShortName?record.categoryShortName:'-'}}</span>
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
            <span class="red"  @click="deleteFn(record)"><a-icon type="delete"/>接触服务关系</span>
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
        <div v-if="isAdd">
          <a-transfer
            class="tree-transfer"
            :titles="['备选区', '已选择']"
            :data-source="transferDataSource"
            :target-keys="targetKeys"
            :render="item => item.title"
            :show-select-all="false"
            @change="onChange"
          >
            <template
              slot="children"
              slot-scope="{
                props: { direction, selectedKeys },
                on: { itemSelect },
              }"
            >
              <a-tree
                v-if="direction === 'left'"
                :load-data="onLoadData"
                blockNode
                checkable
                checkStrictly
                defaultExpandAll
                :checkedKeys="[...selectedKeys, ...targetKeys]"
                :treeData="treeData"
                @check="(_, props) => {onChecked(_, props, [...selectedKeys, ...targetKeys],itemSelect)}"
                @select="(_, props) => {onChecked(_, props, [...selectedKeys, ...targetKeys],itemSelect)}"
              />
            </template>
          </a-transfer>
          <div style="padding: 16px 0;text-align:right;">
            <a-button type="primary" @click="drawerFn()">
              保存
            </a-button>
          </div>
        </div>
        <div v-else>
          <detail-list :col="1">
            <detail-list-item term="上级公司" v-if="companyDetailData.name">{{companyDetailData.name}}</detail-list-item>
            <detail-list-item term="公司全称">{{companyDetailData.name}}</detail-list-item>
            <detail-list-item term="公司简称" v-if="companyDetailData.shortName">{{companyDetailData.shortName}}</detail-list-item>
            <detail-list-item term="社会统一编码">{{companyDetailData.taxpayerIdNumber}}</detail-list-item>
            <detail-list-item term="地址">{{companyDetailData.address}}</detail-list-item>
            <detail-list-item term="邮编">{{companyDetailData.postcode}}</detail-list-item>
            <detail-list-item term="简介">{{companyDetailData.introduction}}</detail-list-item>
            <detail-list-item term="添加人"><span class="name">{{companyDetailData.createName}}</span><span class="date"><icon-font type="time"/>{{companyDetailData.createTime}}</span></detail-list-item>
            <detail-list-item term="修改人" v-if="companyDetailData.updateName"><span class="name">{{companyDetailData.updateName}}</span><span class="date"><icon-font type="time"/>{{companyDetailData.updateTime}}</span></detail-list-item>
          </detail-list>
          <a-button type="danger" @click="drawerFn()">
            解除服务关系
          </a-button>
        </div>
        <!-- <a-form
          v-else
          :label-col="{ span: 5 }"
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
            <a-button type="danger" @click="drawerFn()">
              解除服务关系
            </a-button>
          </a-form-item>
        </a-form> -->
      </a-drawer>
    </div>
    <a-empty v-else description="请先选择供应商" />
  </div>
</template>

<script>
import Vue from 'vue'
import { USER_MODEL } from '@/store/mutation-types'
import { saveBatch, getCategoryListByParentId, getListByParams, getPageByParams, deleteById, deleteBatchById } from '@/api/supplier/serviceRelationship.js'

import { STable } from '@/components'
import Breadcrumb from './Breadcrumb'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('supplier')

const columns = [
  {
    title: '序号',
    dataIndex: 'num',
    scopedSlots: { customRender: 'num' }
  },
  {
    title: '公司全称',
    dataIndex: 'categoryName',
    scopedSlots: { customRender: 'categoryName' }
  },
  {
    title: '公司简称',
    dataIndex: 'categoryShortName',
    scopedSlots: { customRender: 'categoryShortName' }
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
    scopedSlots: { customRender: 'operating' }
  }
]
// const treeData = [
//   { key: '0-0', title: '0-0' },
//   {
//     key: '0-1',
//     title: '0-1',
//     children: [{ key: '0-1-0', title: '0-1-0' }, { key: '0-1-1', title: '0-1-1' }]
//   },
//   { key: '0-2', title: '0-3' }
// ]

// const transferDataSource = []
// function flatten(list = []) {
//   list.forEach(item => {
//     transferDataSource.push(item)
//     flatten(item.children)
//   })
// }
// flatten(JSON.parse(JSON.stringify(treeData)))

function isChecked(selectedKeys, eventKey) {
  return selectedKeys.indexOf(eventKey) !== -1
}

function handleTreeData(data, targetKeys = []) {
  data.forEach(item => {
    item.disabled = targetKeys.includes(item.key)
    if (item.children) {
      handleTreeData(item.children, targetKeys)
    }
  })
  return data
}

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
        const data = {
          code: '1001',
          supplierId: this.company.id,
          emergencyState: 1
        }
        return getPageByParams(Object.assign(parameter, this.queryParam, data))
          .then(res => {
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
      isAdd: true,
      targetKeys: [],
      // dataSource: this.transferDataSource,
      visible: false,
      companyDetailData: {},
      emergencyState: '1',
      drawerSubmit: '',
      data: []
    }
  },
  computed: {
    ...mapState(['company']),
    treeData: {
      get () {
        return handleTreeData(this.data, this.targetKeys)
      },
      set (val) {
        return val
      }
    },
    transferDataSource() {
      const transferDataSource = []
      function flatten(list = []) {
        list.forEach(item => {
          transferDataSource.push(item)
          flatten(item.children)
        })
      }
      flatten(JSON.parse(JSON.stringify(this.data)))
      return transferDataSource
    },
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
    onChange(targetKeys) {
      // console.log('Target Keys:', targetKeys)
      this.targetKeys = targetKeys
    },
    onChecked(_, e, checkedKeys, itemSelect) {
      const { eventKey } = e.node
      itemSelect(eventKey, !isChecked(checkedKeys, eventKey))
      // ! 节点key值数据类型为number时引发报错
      // console.log(typeof eventKey)
    },
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
      this.drawerTitle = '新增服务关系'
      this.visible = true
      this.isAdd = true
      this.getCategoryListByParentId()
      this.drawerInit()
      this.drawerSubmit = saveBatch
    },
    async getCategoryListByParentId(node) {
      // console.log(this.company)
      const data1 = {
        code: '1001',
        supplierId: this.company.id
      }
      // let serviceCompanySelected = []
      let serviceCompanyIdsSelected = []
      await getListByParams(data1).then(res => {
        if (res.model.length > 0) {
          // serviceCompanySelected = res.model
          serviceCompanyIdsSelected = res.model.map(item => {
            return item.categoryId
          })
        }
      })
      const id = (node && node.id) || 0
      const data = {
        parentId: id,
        type: 1
      }
      getCategoryListByParentId(data).then(res => {
        if (res.model.length > 0) {
          this.data = res.model.map(item => {
            // ! 节点key值数据类型为number时引发报错
            let obj
            // console.log(serviceCompanyIdsSelected)
            if (serviceCompanyIdsSelected.includes(item.id)) {
              obj = {
                key: item.id + '',
                title: item.name + '',
                disabled: true
              }
            } else {
              obj = {
                key: item.id + '',
                title: item.name + '',
                disabled: false
              }
            }
            Object.assign(obj, item)
            return obj
          })
        }
      })
    },
    onLoadData(treeNode) {
      return new Promise((resolve, reject) => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        console.log(treeNode)
        const data = {
          parentId: treeNode.dataRef.id,
          type: 1
        }
        let list
        getCategoryListByParentId(data).then(res => {
          if (res.model.length > 0) {
            list = res.model.map(item => {
              // ! 节点key值数据类型为number时引发报错
              item.key = item.id + ''
              item.title = item.name
              return item
            })
            this.$nextTick(() => {
              treeNode.dataRef.children = list
              this.treeData = [...this.treeData]
              this.$forceUpdate()
              resolve()
            })
          }
          resolve()
        }).catch(e => {
          reject(e)
        })
        // setTimeout(() => {
        //   treeNode.dataRef.children = [
        //     { title: 'Child Node', key: `${treeNode.eventKey}-0` },
        //     { title: 'Child Node', key: `${treeNode.eventKey}-1` }
        //   ]
        //   this.treeData = [...this.treeData]
        //   resolve()
        // }, 1000)
      })
    },
    detailFn(record) {
      this.drawerTitle = '公司详情'
      this.isAdd = false
      this.visible = true
      this.companyDetailData = this.record
      this.drawerInit()
    },
    deleteFn(record) {
      this.$confirm({
        title: '解除服务关系',
        content: `确定要解除${record.categoryName}服务关系吗`,
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
        this.$message.warning('请选择要解除服务关系的项！')
        return
      }
      const selectedRowKeys = this.selectedRowKeys
      this.$confirm({
        title: '解除关系服务',
        content: `确定要解除已选中项的服务关系吗`,
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          const data = { ids: selectedRowKeys + '' }
          deleteBatchById(data).then((res) => {
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
      // console.log(this.targetKeys)
      // console.log(this.transferDataSource)
      if (this.targetKeys.length === 0) {
        this.$message.error('请将选中的内容转到已选区')
        return
      }
      let selectData = this.transferDataSource.filter(item => {
        return this.targetKeys.indexOf(item.id + '') !== -1
      })
      // console.log(selectData)
      selectData = selectData.map(item => {
        const obj = {
          code: '1001',
          supplierId: this.company.id
        }
        obj.categoryId = item.id
        obj.categoryName = item.name
        obj.categoryShortName = item.shortName
        return obj
      })
      // const data = {
      //   code: '1001',
      //   supplierId: this.company.id,
      //   categoryId: this.targetKeys[0]
      // }
      const data = {
        supplierCategoryMidList: selectData
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
      // this.drawerForm.validateFields({ force: true }, (err, values) => {
      //   if (!err) {
      //     console.log('login form', values)
      //     const data = { ...values }
      //     data.code = this.company.code
      //     data.supplierId = this.company.id
      //     this.drawerSubmit(data).then((res) => {
      //       if (res.code === 1000000) {
      //         this.$message.success(res.resultStr)
      //         this.visible = false
      //         this.$refs.table.refreshFn()
      //       } else {
      //         this.$message.error(res.resultStr)
      //       }
      //     })
      //   }
      // })
    },
    drawerClose() {
      this.visible = false
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
    color: rgb(216, 10, 10);
  }
}
.tree-transfer .ant-transfer-list:first-child {
  width: 50%;
  flex: none;
}
</style>
