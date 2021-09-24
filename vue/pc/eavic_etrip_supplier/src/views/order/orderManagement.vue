<template>
  <div>
    <a-tabs>
      <a-tab-pane :tab="tabList[0]">
        <div class="title">{{tabList[0]}}</div>
        <div class="table-page-search-wrapper">
          <a-form layout="inline" >
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-item label="机场三字码">
                  <a-input
                    v-model="queryParam.prn"
                    placeholder="请输入"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="国家中文名称">
                  <a-input
                    v-model="queryParam.country"
                    placeholder="请输入"
                  />
                </a-form-item>
              </a-col>
              <template v-if="advanced">
                <a-col :md="8" :sm="24">
                  <a-form-item label="国家简称">
                    <a-input
                      v-model="queryParam.countryAbbreviation"
                      placeholder="请输入"
                    />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="机场名称">
                    <a-input
                      v-model="queryParam.airportName"
                      style="width: 100%"
                      placeholder="请输入"
                    />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="机场名称英文">
                    <a-input
                      v-model="queryParam.airportEnName"
                      style="width: 100%"
                      placeholder="请输入"
                    />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="省分名称">
                    <a-input
                      v-model="queryParam.province"
                      style="width: 100%"
                      placeholder="请输入"
                    />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="城市名称">
                    <a-input
                      v-model="queryParam.city"
                      style="width: 100%"
                      placeholder="请输入"
                    />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="城市拼音">
                    <a-input
                      v-model="queryParam.citySpell"
                      style="width: 100%"
                      placeholder="请输入"
                    />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="城市拼音缩写">
                    <a-input
                      v-model="queryParam.cityShortening"
                      style="width: 100%"
                      placeholder="请输入"
                    />
                  </a-form-item>
                </a-col>
                <!-- <a-col :md="8" :sm="24">
                <a-form-item label="状态">
                  <a-select
                  v-model="queryParam.state"
                    style="width: 200px"
                    v-decorator="[
                      '状态',
                      { rules: [{ required: true, message: '请选择状态' }] },
                    ]"
                    placeholder="请选择状态"
                    @change="selectChange"
                  >
                    <a-select-option :value="0">
                      所有
                    </a-select-option>
                    <a-select-option :value="1">
                      冻结
                    </a-select-option>
                    <a-select-option :value="2">
                      可用
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col> -->
              </template>
              <a-col :md="!advanced && 6 || 24" :sm="24">
                <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                  <a-button type="primary" html-type="submit" icon="search" @click="$refs.table.refreshFn(true)">
                      查询
                    </a-button>
                    <a-button @click="reset">
                      重置
                    </a-button>
                    <a @click="toggleAdvanced" style="margin-left: 8px">
                      {{ advanced ? '收起' : '展开' }}
                      <a-icon :type="advanced ? 'up' : 'down'"/>
                    </a>
                </span>
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
          :scroll="{ x: 10000 }"
        >
          <template slot="num" slot-scope="text, record, index">
            <span>{{index + 1}}</span>
          </template>
          <template slot="journeyState" slot-scope="text, record">
            <div v-if="record.journeyState === 1">正票</div>
            <div v-else-if="record.journeyState === 2">改签</div>
            <div v-else-if="record.journeyState === 0">退票</div>
          </template>
          <template slot="ticketType" slot-scope="text, record">
            <div v-if="record.ticketType === 1">国际</div>
            <div v-else-if="record.ticketType === 0">国内</div>
          </template>
          <template slot="issueprotocal" slot-scope="text, record">
            <div v-if="record.ticketType === 1">是</div>
            <div v-else-if="record.ticketType === 0">否</div>
          </template>
          <template slot="state" slot-scope="text, record">
            <div v-if="record.state === 1">无异常订单</div>
            <div v-else-if="record.state === 2">企业标记有异常</div>
            <div v-else-if="record.state === 3">tmc对异常已修改</div>
            <div v-else-if="record.state === 0">tmc已导入但未发送给企业</div>
          </template>
          <template slot="groupOrderState" slot-scope="text, record">
            <div v-if="record.groupOrderState === 1">是</div>
            <div v-else-if="record.groupOrderState === 0">否</div>
          </template>
          <template slot="payState" slot-scope="text, record">
            <div v-if="record.payState === 1">支付中</div>
            <div v-else-if="record.payState === 2">已支付</div>
            <div v-else-if="record.payState === 0">未支付</div>
          </template>
          <template slot="inpoolState" slot-scope="text, record">
            <div v-if="record.inpoolState === 1">在</div>
            <div v-else-if="record.inpoolState === 0">不在</div>
          </template>
          <template slot="openState" slot-scope="text, record">
            <div v-if="record.openState === 1">是open票</div>
            <div v-else-if="record.openState === 0">非open票</div>
          </template>
          <template slot="payType" slot-scope="text, record">
            <div v-if="record.payType === 1">企业支付</div>
            <div v-else-if="record.payType === 2">个人支付</div>
          </template>
          <template slot="personType" slot-scope="text, record">
            <div v-if="record.personType === 1">按乘机人</div>
            <div v-else-if="record.personType === 2">按预订人</div>
            <div v-else-if="record.personType === 3">按乘机人预订人都未找到</div>
          </template>
          <template slot="reservationMode" slot-scope="text, record">
            <div v-if="record.reservationMode === 1">app预订</div>
            <div v-else-if="record.reservationMode === 2">400电话预订</div>
          </template>
          <template slot="match_state" slot-scope="text, record">
            <div v-if="record.match_state === 1">未报销</div>
            <div v-else-if="record.match_state === 2">已报销</div>
          </template>
          <template slot="matchBeforePay" slot-scope="text, record">
            <div v-if="record.matchBeforePay === 1">支付前报销</div>
            <div v-else-if="record.matchBeforePay === 2">支付后报销</div>
          </template>
          <template slot="customerDownload" slot-scope="text, record">
            <div v-if="record.customerDownload === 1">已下载</div>
            <div v-else-if="record.customerDownload === 2">未下载</div>
          </template>
          <template slot="orderlistAdmit" slot-scope="text, record">
            <div v-if="record.orderlistAdmit === 0">未确认</div>
            <div v-else-if="record.orderlistAdmit === 1">已确认</div>
          </template>
          <template slot="journeyDownloadState" slot-scope="text, record">
            <div v-if="record.journeyDownloadState === 0">未下载</div>
            <div v-else-if="record.journeyDownloadState === 1">已下载</div>
          </template>
          <template slot="journeyConfirmState" slot-scope="text, record">
            <div v-if="record.journeyConfirmState === 0">未确认</div>
            <div v-else-if="record.journeyConfirmState === 1">已确认</div>
          </template>
          <span slot="description" slot-scope="text">
            <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
          </span>
          <template slot="operating" slot-scope="text, record">
            <div class="btn">
              <!-- <span class="blue" @click="detailFn(record)"><a-icon type="profile"/>详情</span> -->
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
      <a-form :label-col="{ span: 5 }"
      :wrapper-col="{ span: 15 }"
      :form="drawerForm"
      >
        <a-form-item label="联系人名称">
          <a-input
            v-decorator="['name', { rules: [{ required: true, message: '必填项'}] }]"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item label="性别" >
          <a-radio-group v-decorator="['sex', { rules: [{ required: true}] }]">
            <a-radio :value="0">
              男
            </a-radio>
            <a-radio :value="1">
              女
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="联系人电话">
          <a-input
            v-decorator="['tel', { rules: [{ required: true, message: '必填项'}] }]"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item label="联系人手机号">
          <a-input
            v-decorator="['mobile', { rules: [{ required: true}] }]"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item label="联系人邮箱">
          <a-input
            v-decorator="['email', { rules: [{ required: true}] }]"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item label="供货商ID">
          <a-input
            v-decorator="['supplierId', { rules: [{ required: true}] }]"
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
</template>

<script>
import { update, getAirTicketOrderPageByParams, deleteByIdAndSendMsg, deleteByIds } from '@/api/order/success.js'
import { STable, Ellipsis } from '@/components'
import { getBase64 } from '@/utils/objectType'

const columns = [
  {
    title: '序号',
    dataIndex: 'num',
    scopedSlots: { customRender: 'num' }
  },
  {
    title: '票号',
    dataIndex: 'ticketId'
  },
  {
    title: '订单号',
    dataIndex: 'orderNumber'
  },
  {
    title: '联票首票号',
    dataIndex: 'unionTicketId'
  },
  {
    title: '改签对应原票号',
    dataIndex: 'ticketIdAlter'
  },
  {
    title: '航空公司三字数字码',
    dataIndex: 'airCompanyNumCode'
  },
  {
    title: '航空公司二字字母码',
    dataIndex: 'airCompanyCharCode'
  },
  {
    title: '预定时间',
    dataIndex: 'preDate'
  },
  {
    title: '出票时间',
    dataIndex: 'dateOfDraft'
  },
  {
    title: '出发时间',
    dataIndex: 'departureTime'
  },
  {
    title: '到达时间',
    dataIndex: 'arrivingTime'
  },
  {
    title: '机票状态',
    dataIndex: 'ticketState'
  },
  {
    title: '当前订单所属行程状态',
    dataIndex: 'journeyState',
    scopedSlots: { customRender: 'journeyState' }
  },
  {
    title: '机票类型',
    dataIndex: 'ticketType',
    scopedSlots: { customRender: 'ticketType' }
  },
  {
    title: '是否使用协议价',
    dataIndex: 'issueprotocal',
    scopedSlots: { customRender: 'issueprotocal' }
  },
  {
    title: '订单标记状态',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '订单异常状态说明',
    dataIndex: 'remarks'
  },
  {
    title: '是否是团组订单',
    dataIndex: 'groupOrderState',
    scopedSlots: { customRender: 'groupOrderState' }
  },
  {
    title: '支付状态',
    dataIndex: 'payState',
    scopedSlots: { customRender: 'payState' }
  },
  {
    title: '是否在异常池里',
    dataIndex: 'inpoolState',
    scopedSlots: { customRender: 'inpoolState' }
  },
  {
    title: 'open票',
    dataIndex: 'openState',
    scopedSlots: { customRender: 'openState' }
  },
  {
    title: '支付方式',
    dataIndex: 'payType',
    scopedSlots: { customRender: 'payType' }
  },
  {
    title: '订单所属人ID',
    dataIndex: 'personId'
  },
  {
    title: '人员类型',
    dataIndex: 'personType',
    scopedSlots: { customRender: 'personType' }
  },
  {
    title: '旅客中文姓名',
    dataIndex: 'passengerName'
  },
  {
    title: '乘机人对应的人员id',
    dataIndex: 'passengerPersonId'
  },
  {
    title: '差旅人身份证号码',
    dataIndex: 'idcard'
  },
  {
    title: '预订人id',
    dataIndex: 'bookingPersonId'
  },
  {
    title: '预订人姓名',
    dataIndex: 'bookingName'
  },
  {
    title: '订票人身份证号',
    dataIndex: 'bookingIdcard'
  },
  {
    title: '行程标准价/人',
    dataIndex: 'standPrice'
  },
  {
    title: '行程区域时段最低价/人',
    dataIndex: 'minPrice'
  },
  {
    title: '行程票面价/人',
    dataIndex: 'parPrice'
  },
  {
    title: '行程税（机建费+燃油费）/人',
    dataIndex: 'ticketTax'
  },
  {
    title: '机建费',
    dataIndex: 'oriTax'
  },
  {
    title: '燃油费',
    dataIndex: 'oillFee'
  },
  {
    title: '行程对外价格',
    dataIndex: 'outprice'
  },
  {
    title: '行程服务费/人',
    dataIndex: 'travelServiceCost'
  },
  {
    title: '改签升舱费(原改签票面价差)',
    dataIndex: 'parpriceDiffer'
  },
  {
    title: '改签手续费',
    dataIndex: 'airCompanyAlterFee'
  },
  {
    title: '退票手续费',
    dataIndex: 'bounceCourseFee'
  },
  {
    title: '保险',
    dataIndex: 'insurance'
  },
  {
    title: '优惠券',
    dataIndex: 'coupon'
  },
  {
    title: '总价/人',
    dataIndex: 'totalPrice'
  },
  {
    title: '公司补助金额',
    dataIndex: 'categoryAllowance'
  },
  {
    title: '起始地',
    dataIndex: 'placeOfDeparture'
  },
  {
    title: '到达地',
    dataIndex: 'destination'
  },
  {
    title: '航班号',
    dataIndex: 'flightNo'
  },
  {
    title: '舱位',
    dataIndex: 'farebasis'
  },
  {
    title: '物理舱位',
    dataIndex: 'physicFarebasis'
  },
  {
    title: '最低价航班信息',
    dataIndex: 'minPirceFlightInfo'
  },
  {
    title: '审批人名称',
    dataIndex: 'obtApprovalPersonName'
  },
  {
    title: '审批意见',
    dataIndex: 'obtApprovalAdvise'
  },
  {
    title: '审批时间',
    dataIndex: 'obtApprovalTime'
  },
  {
    title: '航程错失节约机会原因',
    dataIndex: 'reasonOfMissingDiscount'
  },
  {
    title: '旅行目的',
    dataIndex: 'travelPurpose'
  },
  {
    title: '行程说明',
    dataIndex: 'travelInstructions'
  },
  {
    title: '机票预定时的备注',
    dataIndex: 'orderRemark'
  },
  {
    title: '成本中心名称',
    dataIndex: 'cost'
  },
  {
    title: '成本中心ID',
    dataIndex: 'costId'
  },
  {
    title: '国际机票批件号',
    dataIndex: 'instructionNum'
  },
  {
    title: '国际机票订单编号',
    dataIndex: 'internationalSeq'
  },
  {
    title: '国际机票协议节省金额',
    dataIndex: 'internationalProtocalSaveMoney'
  },
  {
    title: '出差申请单编号',
    dataIndex: 'evectionNo'
  },
  {
    title: '预订方式',
    dataIndex: 'reservationMode',
    scopedSlots: { customRender: 'reservationMode' }
  },
  {
    title: '里程数单位：公里）',
    dataIndex: 'mileage'
  },
  {
    title: '订单所属公司ID',
    dataIndex: 'categoryId'
  },
  {
    title: '供应商ID',
    dataIndex: 'supplierId'
  },
  {
    title: '订单所属部门ID',
    dataIndex: 'deptId'
  },
  {
    title: '订单所属原始账单ID',
    dataIndex: 'billId'
  },
  {
    title: '订单所属行程ID',
    dataIndex: 'journeyId'
  },
  {
    title: '携程工属具对接',
    dataIndex: 'ctripRecoudId'
  },
  {
    title: '携程抓取订单版本序号',
    dataIndex: 'ctripGrabOrderSq'
  },
  {
    title: '航信订单推送任务主键ID',
    dataIndex: 'ts_record_id'
  },
  {
    title: '网报系统报销单编号',
    dataIndex: 'expenseNo'
  },
  {
    title: '报销状态',
    dataIndex: 'match_state',
    scopedSlots: { customRender: 'match_state' }
  },
  {
    title: '支付报销',
    dataIndex: 'matchBeforePay',
    scopedSlots: { customRender: 'matchBeforePay' }
  },
  {
    title: '报销时间',
    dataIndex: 'expenseTime'
  },
  {
    title: '用户是否已下载',
    dataIndex: 'customerDownload',
    scopedSlots: { customRender: 'customerDownload' }
  },
  {
    title: '订单确认状态',
    dataIndex: 'orderlistAdmit',
    scopedSlots: { customRender: 'orderlistAdmit' }
  },
  {
    title: '行程是否已下载',
    dataIndex: 'journeyDownloadState',
    scopedSlots: { customRender: 'journeyDownloadState' }
  },
  {
    title: '行程是否已确认',
    dataIndex: 'journeyConfirmState',
    scopedSlots: { customRender: 'journeyConfirmState' }
  },
  {
    title: '行程下载时间',
    dataIndex: 'JourneyDownloadTime'
  },
  {
    title: '账号',
    dataIndex: 'preEmployId'
  },
  {
    title: '卡号',
    dataIndex: 'preUid'
  },
  {
    title: '操作',
    dataIndex: 'operating',
    width: 160,
    scopedSlots: { customRender: 'operating' },
    fixed: 'right'
  }
]

export default {
  name: 'authority',
  components: {
    STable,
    Ellipsis
  },
  data () {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      drawerForm: this.$form.createForm(this, { name: 'drawerForm' }),
      tabList: ['成功订单'],
      queryParam: {},
      uploadMultiple: true, // 是否支持多选文件，ie10+ 支持。开启后按住 ctrl 可选择多个文件
      uploadAction: '',
      uploadHeaders: {}, // 设置上传的请求头，头部ie10以上支持
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        // console.log(1)
        return getAirTicketOrderPageByParams(Object.assign(parameter, this.queryParam))
          .then(res => {
            // console.log(res)
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
      cascaderOptions: [
        {
          value: 'zhejiang',
          label: 'Zhejiang',
          children: [
            {
              value: 'hangzhou',
              label: 'Hangzhou',
              children: [
                {
                  value: 'xihu',
                  label: 'West Lake'
                },
                {
                  value: 'xiasha',
                  label: 'Xia Sha',
                  disabled: true
                }
              ]
            }
          ]
        },
        {
          value: 'jiangsu',
          label: 'Jiangsu',
          children: [
            {
              value: 'nanjing',
              label: 'Nanjing',
              children: [
                {
                  value: 'zhonghuamen',
                  label: 'Zhong Hua men'
                }
              ]
            }
          ]
        }
      ],
      logoAction: '',
      logoLoading: false,
      logoImageUrl: '',
      visible: false,
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
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    uploadChange(info) {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList)
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
      // console.log(key)
    },
    showDrawer({ record, title }) {
      this.drawerTitle = title
      this.visible = true
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
        state: record.state
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
          deleteByIdAndSendMsg(data).then((res) => {
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
      let initData = {
        name: '',
        state: 2
      }
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
          // console.log('login form', values)
          const data = { ...values }
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
      // console.log(page, pageSize)
    },
    drawerClose() {
      this.visible = false
    },
    cascaderChange(value, selectedOptions) {
      // console.log(value, selectedOptions)
    },
    cascaderFilter(inputValue, path) {
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    },
    logoChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl
          this.loading = false
        })
      }
    },
    logoBeforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      return isJpgOrPng && isLt2M
    },
    onExpand(expandedKeys) {
      // console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
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
