<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline" >
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="票号">
              <a-input
                v-model="queryParam.ticketId"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="订单号">
              <a-input
                v-model="queryParam.orderNumber"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="乘机人姓名">
              <a-input
                v-model="queryParam.passengerName"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
              <a-form-item label="正改退状态">
                <a-select
                  v-model="queryParam.ticketState"
                >
                  <a-select-option value="">
                    所有
                  </a-select-option>
                  <a-select-option :value="1">
                    正票
                  </a-select-option>
                  <a-select-option :value="2">
                    改签
                  </a-select-option>
                  <a-select-option :value="0">
                    退票
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
      <a-button type="primary" icon="download">
        导出订单
      </a-button>
      <a-button type="primary" icon="swap" @click="confirmationBatchFn" :disabled = "isDisableBtn">
        批量修改
      </a-button>
      <a-button type="danger" icon="delete" @click="deleteBatchFn" :disabled = "isDisableBtn">
        批量删除
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
      <template slot="ticketId" slot-scope="text, record">
        <div class="btn">
          <span class="blue">{{record.ticketId}}</span>
        </div>
      </template>
      <template slot="operating" slot-scope="text, record">
        <div class="btn">
          <span class="blue" @click="confirmation(record)"><a-icon type="file-protect"/>修正</span>
          <span class="blue" @click="editFn(record)"><a-icon type="edit"/>编辑</span>
          <span class="red"  @click="deleteFn(record)"><a-icon type="delete"/>删除</span>
        </div>
      </template>
    </s-table>
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
              v-decorator="['onlyTime']" />
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
import { getSupplierAirTicketExceptionOrderListPageByParams, deleteByIds } from '@/api/order/abnormalPast1.js'
import { STable } from '@/components'
import moment from 'moment'
const columns = [
  {
    title: '序号',
    dataIndex: 'num',
    scopedSlots: { customRender: 'num' }
  },
  {
    title: '票号',
    dataIndex: 'ticketId',
    scopedSlots: { customRender: 'ticketId' }

  },
  {
    title: '乘机人',
    dataIndex: 'passengerName'
  },
  {
    title: '出发地',
    dataIndex: 'placeOfDeparture'
  },
  {
    title: '目的地',
    dataIndex: 'destination'
  },
  {
    title: '起飞时间',
    dataIndex: 'departureTime'
  },
  {
    title: '所属企业',
    dataIndex: 'categoryName'
  },
  {
    title: '操作',
    dataIndex: 'operating',
    width: 200,
    scopedSlots: { customRender: 'operating' }
  }
]

export default {
  name: 'authority',
  components: {
    STable
  },
  data () {
    return {
      drawerForm: this.$form.createForm(this, { name: 'drawerForm' }),
      tabList: ['往期异常订单'],
      queryParam: {},
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getSupplierAirTicketExceptionOrderListPageByParams(Object.assign(parameter, this.queryParam))
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
          console.log('Received values of form: ', values)
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
    },
    confirmation(row) {
      this.$confirm({
        title: '修正',
        content: `将此条订单移动到正确订单？`,
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          // const data = { id: row.id }
          // deleteByIds(data).then((res) => {
          //   if (res.code === 1000000) {
          //     this.$message.success(res.resultStr)
          //     this.$refs.table.refreshFn()
          //   } else {
          //     this.$message.error(res.resultStr)
          //   }
          // })
        },
        onCancel() {}
      })
    },
    editFn() {

    },
    deleteFn(row) {
      this.$confirm({
        title: '删除',
        content: `确定要删除此条数据吗`,
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          const data = { id: row.id }
          deleteByIds(data).then((res) => {
            if (res.code === 1000000) {
              this.$message.success(res.resultStr)
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
              this.$refs.table.refreshFn()
            } else {
              this.$message.error(res.resultStr)
            }
          })
        },
        onCancel() {}
      })
    },
    confirmationBatchFn() {
      if (this.selectedRows.length < 1) {
        this.$message.warning('请选择要修正的数据！')
        return
      }
      const selectedRowKeys = this.selectedRowKeys
      this.$confirm({
        title: '修正',
        content: `确定要将已选中的订单移动到正确订单？`,
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          const data = { ids: selectedRowKeys + '' }
          deleteByIds(data).then((res) => {
            if (res.code === 1000000) {
              this.$message.success(res.resultStr)
              this.$refs.table.refreshFn()
            } else {
              this.$message.error(res.resultStr)
            }
          })
        },
        onCancel() {}
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import './index.less';
</style>
