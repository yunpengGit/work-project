<template>
  <div>
    <div v-if="companyData">
    <Breadcrumb :baseBreadcrumbData="['订单抓取']" style="margin: 8px 0 16px;padding-bottom: 16px;"/>
    <div class="table-page-search-wrapper">
      <a-form layout="inline" >
        <a-row :gutter="48">
          <a-col :md="14" :sm="24">
              <a-form-item label="抓取时间范围">
                <a-range-picker
                  v-model="queryParam.departureTime"
                  :disabled-date="disabledDate"
                  :show-time="{ format: 'HH:mm' }"
                  format="YYYY-MM-DD HH:mm"
                  :placeholder="['开始时间', '结束时间']"
                />
              </a-form-item>
            </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="版本号">
              <a-input
                v-model="queryParam.ctripGrabOrderSeq"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
              <a-form-item label="记录状态">
                <a-select
                  v-model="queryParam.errorState"
                >
                  <a-select-option value="">
                    所有
                  </a-select-option>
                  <a-select-option :value="1">
                    正确记录
                  </a-select-option>
                  <a-select-option :value="0">
                    错误记录
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          <a-col :md="24" :sm="24">
            <span class="table-page-search-submitButtons" :style="{ float: 'right', overflow: 'hidden' }">
              <a-button type="primary" html-type="submit" icon="search" @click="$refs.table.refreshFn(true)">
                  查询
                </a-button>
                <a-button @click="reset">
                  重置
                </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="btn-box">
      <a-button type="primary" icon="cloud-download" @click="showDrawer">
        手动获取
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
      :scroll="{ x: 1500}"
    >
      <template slot="num" slot-scope="text, record, index">
        <span>{{index + 1}}</span>
      </template>
      <template slot="status" slot-scope="text, record">
        <span :class="record.errorState == 1?'blue':'red'" v-text="record.errorState == 1?'正确状态':'错误状态'">{{record.errorState}}</span>
      </template>
    </s-table>
    </div>
    <a-empty v-else description="请先选择供应商" style="padding: 16px;"/>
    <a-drawer
      :title="drawerTitle"
      :width="600"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="()=> visible = false"
      class="detail"
    >
    <p>注：抓取范围不能超过3天。</p>
      <a-form :label-col="{ span: 8 }"
      :wrapper-col="{ span: 14 }"
      :form="drawerForm" @submit="handleSubmit">
        <a-form-item label="抓取时间范围">
          <a-range-picker
            v-decorator="['departureTime', { rules: [{ required: true, message: '请选择抓取时间范围' }] }]"
            :disabled-date="disabledDate"
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            :placeholder="['开始时间', '结束时间']"
          />
          </a-form-item>
          <a-form-item label='只取某起飞时间后的数据'>
            <a-date-picker
              v-decorator="['judgeDateStr']" />
          </a-form-item>
        <div class="btn">
          <span>
            <a-button type="primary" icon="cloud-download" html-type="submit">获取</a-button>
          </span>
          <a-button @click="()=> visible = false"><a-icon type="right"/>取消</a-button>
        </div>
      </a-form>
    </a-drawer>
  </div>
</template>

<script>
import { getSupplierCtripGrabdataRecordListPageByParams, grabSingleCategoryCtripData } from '@/api/order/fetch.js'
import { STable } from '@/components'
import Breadcrumb from './Breadcrumb'
import moment from 'moment'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('order')

const columns = [
  {
    title: '序号',
    width: 60,
    dataIndex: 'num',
    scopedSlots: { customRender: 'num' }
  },
  {
    title: '所属公司',
    dataIndex: 'categoryName'
  },
  {
    title: '版本号',
    dataIndex: 'ctripGrabOrderSeq'
  },
  {
    title: '抓取的日期范围',
    dataIndex: 'startEnd',
    customRender: (text, record) => {
      const time = `${record.dateFrom}～${record.dateTo}`
      return time
    }
  },
  {
    title: '记录状态',
    dataIndex: 'errorState',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '共计',
    dataIndex: 'totalsum'
  },
  {
    title: '正确',
    dataIndex: 'correctsum'
  },
  {
    title: '错误',
    dataIndex: 'wrongsum'
  },
  {
    title: '重复',
    dataIndex: 'alreadysum'
  },
  {
    title: '信息',
    dataIndex: 'errorInfo'
  },
  {
    title: '录入时间',
    dataIndex: 'createTime'
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
      baseBreadcrumbData: [],
      drawerForm: this.$form.createForm(this, { name: 'drawerForm' }),
      tabList: ['订单抓取'],
      queryParam: {},
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        if (this.queryParam.departureTime) {
          this.queryParam.startGrabTime = encodeURIComponent(moment(this.queryParam.departureTime[0]).format('YYYY-MM-DD HH:mm:ss'))
          this.queryParam.endGrabTime = encodeURIComponent(moment(this.queryParam.departureTime[1]).format('YYYY-MM-DD HH:mm:ss'))
        }
        this.queryParam.categoryId = this.company.categoryId
        return getSupplierCtripGrabdataRecordListPageByParams(Object.assign(parameter, this.queryParam))
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
      optionAlertShow: false,
      loading: false,
      drawerTitle: '',
      visible: false
    }
  },
  watch: {
    company: {
      handler(n) {
        this.$refs.table && this.$refs.table.refreshFn(true)
      },
      deep: true
    }
  },
  computed: {
    ...mapState(['company']),
    isDisableBtn() {
      let flag = true
      if (this.selectedRowKeys.length > 0) {
        flag = false
      }
      return flag
    },
    companyData() {
      return this.company
    }
  },
  methods: {
    disabledDate(current) {
      return current && current >= moment().endOf('day')
    },
    reset() {
      this.queryParam = {}
      this.$refs.table.refreshFn()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    showDrawer() {
      this.drawerTitle = '上传订单'
      this.visible = true
      this.drawerForm.resetFields()
    },
    handleSubmit(e) {
      // 获取
      e.preventDefault()
      this.drawerForm.validateFields((err, values) => {
        if (!err) {
          const params = {
            date_from: encodeURIComponent(moment(values.departureTime[0]).format('YYYY-MM-DD HH:mm:ss')),
            date_to: encodeURIComponent(moment(values.departureTime[1]).format('YYYY-MM-DD HH:mm:ss')),
            judgeDateStr: values.judgeDateStr == null ? '' : encodeURIComponent(moment(values.judgeDateStr).format('YYYY-MM-DD HH:mm:ss')),
            categoryId: this.company.categoryId
          }
          grabSingleCategoryCtripData(params).then(res => {
            if (res.code == 100000) {
              this.$confirm({
                title: '成功',
                content: `已成功加入批量任务列表`,
                cancelText: '关闭',
                okText: '去看看',
                onOk: () => {
                  this.$router.push('/systemManagement/batchTask')
                },
                onCancel() {}
              })
            }
          })
        }
      })
    },
    onCheck(checkedKeys) {
      // console.log('onCheck', checkedKeys)
      this.checkedKeys = checkedKeys
    },
    onSelect(selectedKeys, info) {
      // console.log('onSelect', info)
      this.selectedKeys = selectedKeys
    }
  }
}
</script>
<style lang="less" scoped>
@import './index.less';
</style>
