<template>
  <div>
    <div v-if="companyData">
    <Breadcrumb :baseBreadcrumbData="['订单抓取']" style="margin: 8px 0 16px;padding-bottom: 16px;"/>
    <div class="table-page-search-wrapper">
      <a-form layout="inline" >
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="账单编号">
              <a-input
                v-model="queryParam.billnum"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="支付状态">
              <a-select
                  v-model="queryParam.payState"
                >
                  <a-select-option value="">
                    所有
                  </a-select-option>
                  <a-select-option :value="0">
                    未支付
                  </a-select-option>
                  <a-select-option :value="1">
                    支付中
                  </a-select-option>
                  <a-select-option :value="2">
                    已支付
                  </a-select-option>
                </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
              <a-form-item label="账单期数">
                <a-select
                  v-model="queryParam.billPeriod"
                >
                  <a-select-option :value="item.id" v-for="item in numberPeriods" :key="item.id">
                    {{item.title}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="机票类型">
                <a-select
                  v-model="queryParam.billState"
                >
                  <a-select-option value="">
                    所有
                  </a-select-option>
                  <a-select-option :value="0">
                    国内
                  </a-select-option>
                  <a-select-option :value="1">
                    国际
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="账单年份">
              <a-date-picker mode='year'
              format='YYYY'
              :value='queryParam.billYear'
              :open='yearPickShow'
              @panelChange="handlePanelChange"
              @openChange="handleOpenChange"/>
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
    <s-table
      ref="table"
      size="default"
      rowKey = "id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      showPagination="auto"
      :scroll="{ x: 1200}"
    >
      <template slot="num" slot-scope="text, record, index">
        <span>{{index + 1}}</span>
      </template>
      <template slot="billnum" slot-scope="text, record">
        <div class="btn">
          <span class="blue" @click="showDrawer(record)">{{record.billnum}}</span>
        </div>
      </template>
      <template slot="billPeriod" slot-scope="text, record">
        <span>{{record.billYear}}年{{record.billPeriod}}期</span>
      </template>
      <template slot="payState" slot-scope="text, record">
        <span :class="record.payState== 0?'red':record.payState == 1?'gree':'blue'" v-text="record.payState== 0?'未支付':record.payState == 1?'支付中':'已支付'"></span>
      </template>
      <template slot="billState" slot-scope="text, record">
        <span v-text="record.billState==0?'国内':'国际'"></span>
      </template>
      <template slot="state" slot-scope="text, record">
        <span :class="record.state== 0 || record.state==2?'red':record.state == 1 || record.state == 3?'blue':'blue'" v-text="record.state== 0?'tmc已导入但未给企业':record.state == 1?'无异常账单':record.state == 2?'企业标记有异常':'tmc对异常已修改'"></span>
      </template>
    </s-table>
    </div>
    <a-empty v-else description="请先选择供应商" style="padding: 16px;"/>
    <a-drawer
      :title="drawerTitle"
      :width="820"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="()=> visible = false"
      class="detail"
    >
      <detail-list v-slot:list :col="3" title="账单详情" :span="{label: 9, content: 15, labelTextLeft: true}">
        <detail-list-item term="账单号">{{detailData.billnum}}</detail-list-item>
        <detail-list-item term="账单期数">{{detailData.billYear}}年{{detailData.billPeriod}}期</detail-list-item>
        <detail-list-item term="账单年份">{{detailData.billYear}}年</detail-list-item>
        <detail-list-item term="所属企业">{{detailData.categoryId}}</detail-list-item>
        <detail-list-item term="所属服务商">{{detailData.supplierId}}</detail-list-item>
        <detail-list-item term="账单类型">
          <span v-text="detailData.billState == 0?'国内':'国际'"></span>
        </detail-list-item>
        <detail-list-item term="账单状态">
          <span :class="detailData.state== 0 || detailData.state==2?'red':detailData.state == 1 || detailData.state == 3?'blue':'blue'" v-text="detailData.state== 0?'tmc已导入但未给企业':detailData.state == 1?'无异常账单':detailData.state == 2?'企业标记有异常':'tmc对异常已修改'"></span>
        </detail-list-item>
        <detail-list-item term="账单支付状态">
          <span :class="detailData.payState== 0?'red':detailData.payStatee == 1?'gree':'blue'" v-text="detailData.payState== 0?'未支付':detailData.payState == 1?'支付中':'已支付'"></span>
        </detail-list-item>
        </detail-list>
      <detail-list v-slot:list :col="3" :span="{label: 10, content: 14, labelTextLeft: true}">
        <detail-list-item term="账单原始金额">{{detailData.originalPrice}}元</detail-list-item>
        <detail-list-item term="企业确认金额">{{detailData.categoryPrice}}元</detail-list-item>
        <detail-list-item term="企业支付金额">{{detailData.paymentPrice}}元</detail-list-item>
        <detail-list-item term="账单生成日期">{{detailData.createTime}}</detail-list-item>
        <detail-list-item term="账单起始日期">{{detailData.startPredate}}</detail-list-item>
        <detail-list-item term="账单结束日期">{{detailData.endPredate}}</detail-list-item>
        <detail-list-item term="申请支付日期">{{detailData.applyTime}}</detail-list-item>
        <detail-list-item term="账单支付日期">{{detailData.paymentTime}}</detail-list-item>
      </detail-list>
      <div class="btn">
        <!-- v-if="detailData.state==0"  订单插入，发送订单，确认收款有这个判断-->
        <a-button type="primary" icon="eye" @click="lookOrder">查看订单</a-button>
        <a-button type="primary" icon="cloud-download" @click="downOrder">导出订单</a-button>
        <a-button type="primary" icon="cloud-upload" v-if="detailData.state==0"   @click="insertOrder">订单插入</a-button>
        <a-button type="primary" icon="fund" v-if="detailData.state==0"  @click="sendOrder">发送订单</a-button>
        <a-button type="primary" icon="pay-circle" v-if="detailData.state==0"  @click="sureMoney">确认收款</a-button>
        <a-button type="danger" icon="delete" @click="deleOrder">删除</a-button>
      </div>
    </a-drawer>
    <a-drawer
      :title="orderListTitle"
      :width="920"
      :visible="orderListVisible"
      :body-style="{ paddingBottom: '80px' }"
      @close="()=> orderListVisible = false"
    >
    <div class="table-page-search-wrapper" v-if="orderListState =='lookOrder' || orderListState =='insertOrder'">
      <a-form layout="inline" >
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="票号">
              <a-input
                v-model="drawerParam.ticketId"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="乘机">
              <a-input
                v-model="drawerParam.passengerName"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24" v-if="orderListState =='lookOrder'">
            <a-form-item label="报销状态">
              <a-select
                  v-model="drawerParam.expenseState"
                >
                  <a-select-option value="">
                    所有
                  </a-select-option>
                  <a-select-option :value="2">
                    已报销
                  </a-select-option>
                  <a-select-option :value="1">
                    未报销
                  </a-select-option>
                </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24" v-if="orderListState =='lookOrder'">
            <a-form-item label="OPEN票">
              <a-select
                v-model="drawerParam.openState"
              >
                <a-select-option value="">
                  所有
                </a-select-option>
                <a-select-option :value="1">
                  是
                </a-select-option>
                <a-select-option :value="0">
                  否
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24" v-if="orderListState =='insertOrder'">
            <a-form-item label="机票状态">
              <a-select
                  v-model="drawerParam.ticketState"
                >
                  <a-select-option value="">
                    所有
                  </a-select-option>
                  <a-select-option :value="1">
                    正票
                  </a-select-option>
                  <a-select-option :value="0">
                    退票
                  </a-select-option>
                  <a-select-option :value="2">
                    改签
                  </a-select-option>
                </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="18" :sm="24" v-if="orderListState =='insertOrder'">
            <a-form-item label="起飞时间范围">
              <a-range-picker
                v-model="drawerParam.departureTime"
                :disabled-date="disabledDate"
                :show-time="{ format: 'HH:mm' }"
                format="YYYY-MM-DD HH:mm"
                :placeholder="['开始时间', '结束时间']"
          />
          </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <span class="table-page-search-submitButtons" :style="{ float: 'right', overflow: 'hidden' }">
              <a-button type="primary" html-type="submit" icon="search" @click="$refs.tableDrawer.refreshFn(true)">
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
    <div class="btn-box" v-if="orderListState =='lookOrder' || orderListState =='insertOrder'">
      <!-- v-if="detailData.state==0 && orderListState == 'lookOrder'" -->
      <a-button type="danger" icon="delete" :disabled="selectedRowKeysDrawer.length==0" v-if="detailData.state==0 && orderListState == 'lookOrder'" @click="lookOrderDele()">批量删除</a-button>
      <a-button type="primary" icon="suer" v-if=" orderListState == 'insertOrder'" @click="insertOrderSure">确认选择</a-button>
    </div>
    <s-table
      ref="tableDrawer"
      size="default"
      rowKey = "id"
      :columns="columnsDrawer"
      :data="loadDataDrawer"
      :alert="optionsDrawer.alert"
      :rowSelection="optionsDrawer.rowSelection"
      showPagination="auto"
      v-if="orderListVisible == true && (orderListState =='lookOrder' || orderListState =='insertOrder')"
    >
      <template slot="num" slot-scope="text, record, index">
        <span>{{index + 1}}</span>
      </template>
      <template slot="ticketId" slot-scope="text, record">
        <span class="blue">{{record.ticketId}}</span>
      </template>
      <template slot="match_state" slot-scope="text, record">
        <div v-if="record.matchState == 1">未报销</div>
        <div v-else-if="record.matchState == 2">已报销</div>
      </template>
      <template slot="openState" slot-scope="text, record">
        <div v-if="record.openState == 1">是open票</div>
        <div v-else-if="record.openState == 0">非open票</div>
      </template>
      <template slot="ticketState" slot-scope="text, record">
        <div :class="record.ticketState === 1?'green':record.ticketState === 0?'red':'green'" v-text="record.ticketState === 1?'正票':record.ticketState === 0?'退票':'改签'"></div>
      </template>
      <template slot="operating" slot-scope="text, record">
        <!-- v-if="detailData.state==0" -->
        <div class="btn">
          <span class="red" v-if="detailData.state==0" @click="lookOrderDele(record)"><a-icon type="delete"/>删除</span>
        </div>
      </template>
    </s-table>
    <div v-if="orderListState =='sureMoney'">
      <div class="table-page-search-wrapper">
        <a-form layout="inline" >
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="企业支付金额">
                <a-input v-model="drawerParam.paymentAmount" placeholder="请输入" />
              </a-form-item>
            </a-col>
          </a-row>
          <label style="display:inline-block; marginBottom:20px">企业支付凭证：</label>
          <a-upload
            :action="logoAction"
            list-type="picture-card"
            :default-file-list="fileList"
            :headers="logoHeaders"
            :before-upload="logoBeforeUpload"
            @change="handleChange"
            @preview="handlePreview"
            class="upload-list-inline"
          >
            <div v-if="fileList.length < 5">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                上传logo
              </div>
            </div>
          </a-upload>
          <div class="btn">
            <span>
              <a-button type="primary" icon="cloud-download" html-type="submit" @click="payBill">提交</a-button>
            </span>
            <a-button @click="()=> orderListVisible = false"><a-icon type="right"/>取消</a-button>
          </div>
        </a-form>
      </div>
    </div>
    <div v-if="orderListState =='exportOrder'">
      <div class="table-page-search-wrapper">
        <a-form layout="inline" :form="exportParam" @submit="downFunction">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="账单所属模版">
                <a-select
                  v-decorator="['modelshow', { rules: [{ required: true, message: '请选择账单模版' }] }]"
                >
                  <a-select-option :value="0">默认模版</a-select-option>
                  <a-select-option :value="1">金网模版</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <div class="btn">
            <a-button type="primary" icon="cloud-download" html-type="submit">模版预览</a-button>
            <span>
              <a-button type="primary" icon="cloud-download" html-type="submit">导出</a-button>
            </span>
            <a-button @click="()=> orderListVisible = false"><a-icon type="right"/>取消</a-button>
          </div>
        </a-form>
      </div>
    </div>
    </a-drawer>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import {
  getPageByParams, insertAirTicketOrder, getInsertAirTicektOrderPageByParam, sendToCategory, removeAirTicketOrder,
  deleteById, getBillAirTicektOrderPageByParam, billPayRecordSave
} from '@/api/order/billManagement.js'
import { STable, DetailList } from '@/components'
import Breadcrumb from './Breadcrumb'
import moment from 'moment'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('order')
const DetailListItem = DetailList.Item
const columns = [
  {
    title: '序号',
    dataIndex: 'num',
    width: 60,
    scopedSlots: { customRender: 'num' }
  },
  {
    title: '账单编号',
    dataIndex: 'billnum',
    width: 200,
    scopedSlots: { customRender: 'billnum' }
  },
  {
    title: '账单期数',
    dataIndex: 'billPeriod',
    scopedSlots: { customRender: 'billPeriod' }
  },
  {
    title: '账单生成日期',
    dataIndex: 'createTime'
  },
  {
    title: '支付状态',
    dataIndex: 'payState',
    scopedSlots: { customRender: 'payState' }
  },
  {
    title: '支付日期',
    dataIndex: 'paymentTime'
  },
  {
    title: '企业名称',
    dataIndex: 'categoryName'
  },
  {
    title: '机票类型',
    dataIndex: 'billState',
    scopedSlots: { customRender: 'billState' }
  },
  {
    title: '账单状态',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' }
  }
]
const columnsLookOrder = [
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
    title: '报销状态',
    dataIndex: 'match_state',
    scopedSlots: { customRender: 'match_state' }
  },
  {
    title: 'OPEN票状态',
    dataIndex: 'openState',
    scopedSlots: { customRender: 'openState' }
  },
  {
    title: '公司名称',
    dataIndex: 'categoryName'
  },
  {
    title: '操作',
    dataIndex: 'operating',
    scopedSlots: { customRender: 'operating' }
  }
]
const columnsInsertOrder = [
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
    title: '机票状态',
    dataIndex: 'ticketState',
    scopedSlots: { customRender: 'ticketState' }
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
    title: '公司名称',
    dataIndex: 'categoryName'
  }
]
function number() {
  const newArr = [{ title: '所有', id: '' }]
  for (let i = 1; i <= 12; i++) {
    newArr.push({ title: i, id: i })
  }
  newArr.push({ title: '其他', id: 'n' })
  return newArr
}

const numberPeriods = number()

export default {
  name: 'authority',
  components: {
    STable,
    DetailList,
    DetailListItem,
    Breadcrumb
  },
  data () {
    return {
      baseBreadcrumbData: [],
      tabList: ['账单管理'],
      yearPickShow: false, // 年选择器的显示隐藏
      queryParam: {},
      numberPeriods,
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.queryParam.categoryId = this.company.categoryId
        return getPageByParams(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.model
          })
      },
      loadDataDrawer: parameter => {
        if (this.orderListState == 'lookOrder') {
          this.drawerParam.billId = this.detailData.id
          return getBillAirTicektOrderPageByParam(Object.assign(parameter, this.drawerParam))
            .then(res => {
              return res.model
            })
        } else if (this.orderListState == 'insertOrder') {
          if (this.drawerParam.departureTime != null) {
            this.drawerParam.startDepartureTime = moment(this.drawerParam.departureTime[0]).format('YYYY-MM-DD HH:mm:ss')
            this.drawerParam.endDepartureTime = moment(this.drawerParam.departureTime[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          return getInsertAirTicektOrderPageByParam(Object.assign(parameter, this.drawerParam))
            .then(res => {
              return res.model
            })
        }
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
      selectedRowKeysDrawer: [],
      selectedRowsDrawer: [],
      optionsDrawer: {
        alert: { show: false, clear: () => { this.selectedRowKeysDrawer = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeysDrawer,
          onChange: this.onSelectChangeDrawer,
          getCheckboxProps: record => ({
            props: {
              disabled: record.ticketState == 0,
              name: record.passengerName
            }
          })
        }
      },
      optionAlertShow: false,
      loading: false,
      drawerTitle: '',
      visible: false,
      detailData: {},
      orderListVisible: false,
      orderListTitle: '',
      orderListState: '',
      drawerParam: {},
      exportParam: this.$form.createForm(this, { name: 'exportParam' }),
      columnsDrawer: [],
      previewVisible: false,
      previewImage: '',
      logoHeaders: {
        'App-Token': Vue.ls.get(ACCESS_TOKEN)
      },
      logoAction: '/api/airplane/billPayRecord/upload',
      fileList: [],
      logoImageUrl: '',
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
  watch: {
    company: {
      handler(n) {
        this.$refs.table && this.$refs.table.refreshFn(true)
      },
      deep: true
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
    onSelectChangeDrawer (selectedRowKeys, selectedRows) {
      this.selectedRowKeysDrawer = selectedRowKeys
      this.selectedRowsDrawer = selectedRows
    },
    // 弹出日历和关闭日历的回调
    handleOpenChange(status) {
      this.yearPickShow = status
    },
    // 得到年份选择器的值
    handlePanelChange(value) {
      this.queryParam.billYear = value
      this.yearPickShow = false
    },
    showDrawer(rowIndex) {
      this.drawerTitle = '账单详情'
      this.visible = true
      this.orderListState = ''
      this.detailData = rowIndex
    },
    onCheck(checkedKeys) {
      // console.log('onCheck', checkedKeys)
      this.checkedKeys = checkedKeys
    },
    onSelect(selectedKeys, info) {
      // console.log('onSelect', info)
      this.selectedKeys = selectedKeys
    },
    lookOrder() {
      this.orderListVisible = true
      this.orderListTitle = '账单所属订单列表'
      this.columnsDrawer = columnsLookOrder
      this.orderListState = 'lookOrder'
      this.drawerParam = {}
      this.$nextTick(() => {
        this.$refs.tableDrawer.refreshFn()
      })
    },
    // 查看订单的删除,批量删除
    lookOrderDele(rowIndex) {
      let airTicketOrderIds = ''
      if (rowIndex == null) {
        airTicketOrderIds = this.selectedRowKeysDrawer
      } else {
        const arr = []
        arr.push(rowIndex.id)
        airTicketOrderIds = arr
      }
      removeAirTicketOrder({ categoryId: this.company.categoryId, billId: this.detailData.id, airTicketOrderIds: airTicketOrderIds }).then(res => {
        if (res.code == 1000000) {
          this.$message.success('删除成功')
          this.$refs.tableDrawer.refreshFn()
        }
      })
    },
    // 导出订单
    downOrder() {
      this.orderListVisible = true
      this.orderListState = 'exportOrder'
      this.orderListTitle = '导出订单'
    },
    // 插入订单
    insertOrder() {
      this.$confirm({
        title: '发送',
        content: `确定向此账单中插入订单？`,
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          this.orderListVisible = true
          this.orderListTitle = '订单选择列表'
          this.orderListState = 'insertOrder'
          this.drawerParam = {}
          this.columnsDrawer = columnsInsertOrder
        },
        onCancel() {}
      })
    },
    sendOrder() {
      this.orderListState = 'sendOrder'
      this.$confirm({
        title: '发送',
        content: `确定要发送此账单吗`,
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          sendToCategory({ billId: this.detailData.id }).then((res) => {
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
    // 订单确认插入
    insertOrderSure() {
      this.$confirm({
        title: '确认',
        content: `确定要选择这${this.selectedRowKeysDrawer.length}条数据`,
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          const params = {
            categoryId: this.company.categoryId,
            billId: this.detailData.id,
            airTicketOrderIds: this.selectedRowKeysDrawer.toString()
          }
          insertAirTicketOrder(params).then((res) => {
            if (res.code === 1000000) {
              this.$message.success(res.resultStr)
              this.orderListVisible = false
              this.$refs.table.refreshFn()
            }
          })
        },
        onCancel() {}
      })
    },
    deleOrder() {
      this.$confirm({
        title: '删除',
        content: `确定要删除此账单吗`,
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          debugger
          const data = { id: this.detailData.id }
          deleteById(data).then((res) => {
            if (res.code === 1000000) {
              this.$message.success(res.resultStr)
              this.$refs.table.refreshFn()
            }
          })
        },
        onCancel() {}
      })
    },
    // 确认收钱展示
    sureMoney() {
      this.orderListVisible = true
      this.orderListTitle = '账单确认收款'
      this.orderListState = 'sureMoney'
      this.logoImageUrl = ''
    },
    handleCancel() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getImgAdress(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange(info) {
      if (info.file.status === 'done') {
        this.fileList = info.fileList
        if (this.logoImageUrl == '') {
          this.logoImageUrl += info.file.response.model
        } else {
          this.logoImageUrl += (',' + info.file.response.model)
        }
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
    // 模版
    downFunction() {

    },
    payBill() {
      billPayRecordSave({ billId: this.detailData.id, paymentAmount: this.drawerParam.paymentAmount, payImage: this.logoImageUrl }).then(res => {
        if (res.code == 1000000) {
          this.$message.success(res.resultStr)
          this.orderListVisible = false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import './index.less';
.logo-img{
  width: 200px;
  height: 200px;
}
</style>
