<template>
  <div class="businessBill">
    <div>
      <div>企业账单列表</div>
      <a-divider />
      <div class="table-page-search-wrapper">
       <a-form layout="inline" >
        <a-row :gutter="48">
          <a-col :md="12" :sm="32">
            <a-form-item label="企业账单编号">
              <a-input
                v-model="queryParam.billnum"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="32">
            <a-form-item label="支付状态">
              <a-select v-model="queryParam.payState">
                <a-select-option v-for="item in payStatusList" :key="item.id" :value='item.id'>
                  {{item.value}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="32">
            <a-form-item label="账单生成日期">
              <a-range-picker
                  v-model="queryParam.departureTime"
                  :disabled-date="disabledDate"
                  :show-time="{ format: 'HH:mm' }"
                  format="YYYY-MM-DD HH:mm"
                  :placeholder="['开始时间', '结束时间']"
                />
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
      </div>
      <s-table
        :columns="columns"
        ref="table"
        size="default"
        rowKey = "id"
        :data="loadData"
        showPagination="auto"
      >
        <span slot="id" slot-scope="text, record" class="btn">
          <span class="blue" @click="detail(record)">{{record.id}}</span>
        </span>
        <span slot='payState' slot-scope="text, record" class="btn">
          <span :class="record.payState== 0?'red':record.payStatee == 1?'gree':'blue'" v-text="record.payState== 0?'未支付':record.payState == 1?'支付中':'已支付'"></span>
        </span>
        <span slot='state' slot-scope="text, record" class="btn">
          <span :class="record.state== 0 || record.state==2?'red':record.state == 1 || record.state == 3?'blue':'blue'" v-text="record.state== 0?'tmc已导入但未给企业':record.state == 1?'无异常账单':record.state == 2?'企业标记有异常':'tmc对异常已修改'"></span>
        </span>
        <span slot='billState' slot-scope="text, record" class="btn">
          <span v-text="record.billState == 0?'国内':'国际'"></span>
        </span>
      </s-table>
    </div>
    <a-drawer
      :title="drawerTitle"
      :width="960"
      :body-style="{ paddingBottom: '80px' }"
      :visible="visible"
      @close="()=>visible = false"
    >
    <detail-list v-slot:list :col="3" title="账单详情" :span="{label: 8, content: 16, labelTextLeft: true}">
        <detail-list-item term="账单号">{{detailData.billnum}}</detail-list-item>
        <detail-list-item term="所属企业">{{detailData.categoryName}}</detail-list-item>
        <detail-list-item term="是否已分发">{{detailData.billYear}}</detail-list-item>
        <detail-list-item term="账单状态">
          <span :class="detailData.state== 0 || detailData.state==2?'red':detailData.state == 1 || detailData.state == 3?'blue':'blue'" v-text="detailData.state== 0?'tmc已导入但未给企业':detailData.state == 1?'无异常账单':detailData.state == 2?'企业标记有异常':'tmc对异常已修改'"></span>
        </detail-list-item>
         <detail-list-item term="账单支付状态">
          <span :class="detailData.payState== 0?'red':detailData.payStatee == 1?'gree':'blue'" v-text="detailData.payState== 0?'未支付':detailData.payState == 1?'支付中':'已支付'"></span>
        </detail-list-item>
      </detail-list>
      <detail-list v-slot:list :col="3" :span="{label: 10, content: 14, labelTextLeft: true}">
        <detail-list-item term=""></detail-list-item>
        <detail-list-item term="账单原始金额">{{detailData.originalPrice}}元</detail-list-item>
        <detail-list-item term="企业确认金额">{{detailData.categoryPrice}}元</detail-list-item>
        <detail-list-item term="企业支付金额">{{detailData.paymentPrice}}元</detail-list-item>
        <detail-list-item term="账单生成日期">{{detailData.createTime}}</detail-list-item>
        <detail-list-item term="账单起始日期">{{detailData.startPredate}}</detail-list-item>
        <detail-list-item term="账单结束日期">{{detailData.endPredate}}</detail-list-item>
        <detail-list-item term="备注">{{detailData.remark}}</detail-list-item>
      </detail-list>
      <div class="btn" >
        <a-button type="primary" icon="eye" @click="lookOrder">查看订单</a-button>
        <a-button type="primary" icon="cloud-download" @click="downOrder">导出订单</a-button>
        <!-- <a-button type="primary" icon="sync" @click="refresh">刷新里程数</a-button> -->
      </div>
    </a-drawer>
    <a-drawer
      :title="drawerTitle"
      :width="960"
      :body-style="{ paddingBottom: '80px' }"
      :visible="visibleLook"
      @close="()=> drawerClose"
    >
      <s-table v-if="drawerStatus == 'look'"
        :columns="columnsDrawer"
        ref="tableDrawer"
        size="default"
        rowKey = "id"
        :data="loadDataDrawer"
        showPagination="auto"
      >
        <span slot="id" slot-scope="text, record" class="btn">
          <span class="blue" @click="lookDetail(record)">{{record.id}}</span>
        </span>
        <span slot='payState' slot-scope="text, record" class="btn">
          <span :class="record.payState== 0?'red':record.payStatee == 1?'gree':'blue'" v-text="record.payState== 0?'未支付':record.payState == 1?'支付中':'已支付'"></span>
        </span>
        <span slot='state' slot-scope="text, record" class="btn">
          <span :class="record.state== 0 || record.state==2?'red':record.state == 1 || record.state == 3?'blue':'blue'" v-text="record.state== 0?'tmc已导入但未给企业':record.state == 1?'无异常账单':record.state == 2?'企业标记有异常':'tmc对异常已修改'"></span>
        </span>
      </s-table>
      <div v-if="drawerStatus =='export'">
      <div class="table-page-search-wrapper">
        <a-form layout="inline" :form="exportParam" @submit="downFunction">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="账单所属模版">
                <a-select
                  v-decorator="['templateId', { rules: [{ required: true, message: '请选择账单模版' }] }]"
                >
                  <a-select-option :value="0">默认模版</a-select-option>
                  <a-select-option :value="item.templateTypeId" v-for="item in categoryTemplateList" :key="item.id+'_'">{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <div class="btn">
            <a-button type="primary" icon="cloud-download">模版预览</a-button>
            <span>
              <a-button type="primary" icon="cloud-download" html-type="submit">导出</a-button>
            </span>
            <a-button @click="()=> visibleLook = false"><a-icon type="right"/>取消</a-button>
          </div>
        </a-form>
      </div>
    </div>
      <a-form :label-col="{ span: 5 }"
      :wrapper-col="{ span: 15 }" v-if="drawerStatus == 'process'"
      >
        <a-form-item label="任务ID">
          <div>{{this.drawerForm.id}}</div>
        </a-form-item>
        <a-form-item label="任务类型">
          <div v-text="this.drawerForm.taskTypeCode!=null?(taskTypeList.filter((item)=>item.taskTypeCode == this.drawerForm.taskTypeCode))[0].taskTypeName:''"></div>
        </a-form-item>
        <a-form-item label="任务状态">
          <div>
              <span v-if="this.drawerForm.state == 0">任务排队等待中请稍后</span>
              <span class="blueSpan" v-if="this.drawerForm.state == 1">进行中</span>
              <span class="redSpan" v-if="this.drawerForm.state == 3">异常退出</span>
              <span class="greenSpan" v-if="this.drawerForm.state == 2">已完成</span>
          </div>
          <a-progress :percent="percentDeil.percent" :status="percentDeil.status" :format="percent => percentDeil.state ==1?(this.percentDeil.totalNum || 0) + '/' + (this.percentDeil.num || 0):'' ">
          </a-progress>
        </a-form-item>
        <a-form-item label="异常原因" v-if="this.drawerForm.state == 3">
          <div class="redSpan">{{this.drawerForm.errorMsg}}</div>
        </a-form-item>
        <a-form-item label="任务开始时间">
          <div>{{this.drawerForm.startTime}}</div>
        </a-form-item>
        <a-form-item label="任务结束时间" >
          <a-radio-group>
            <div>{{this.drawerForm.endTime}}</div>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="任务创建时上传的文件">
          <a :href="this.drawerForm.uploadFilePath">{{drawerForm.uploadFileName}}</a>
        </a-form-item>
        <a-form-item label="任务完成后生成的文件">
          <a :href="this.drawerForm.feedbackFilePath">{{drawerForm.feedbackFileName}}</a>
        </a-form-item>
        <a-form-item label="任务所属公司">
          <div>{{this.drawerForm.categoryName}}</div>
        </a-form-item>
        <a-form-item label="操作人">
          <span>{{this.drawerForm.createName}}</span>
          <a-icon type="history" :style="{padding: '0px 16px'}" />
          <span>{{this.drawerForm.createTime}}</span>
        </a-form-item>
        <a-form-item labelAlign="right">
          <a-button type="primary" @click="()=> visibleLook = !visibleLook">
            返回
          </a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
    <a-drawer
      :title="drawerTitle"
      :width="960"
      :body-style="{ paddingBottom: '80px' }"
      :visible="visibleLookDetail"
      @close="()=>{ visibleLookDetail = false; drawerStatus = 'look' }"
    >
      <detail-list  v-slot:list :col="3" title="账单详情" :span="{label: 8, content: 16, labelTextLeft: true}">
        <detail-list-item term="账单号">{{detailData.billnum}}</detail-list-item>
        <detail-list-item term="账单期数">{{detailData.billYear}}年{{detailData.billPeriod}}期</detail-list-item>
        <detail-list-item term="账单年份">{{detailData.billYear}}年</detail-list-item>
        <detail-list-item term="所属企业">{{detailData.categoryName}}</detail-list-item>
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
      <detail-list  v-slot:list :col="3" :span="{label: 10, content: 14, labelTextLeft: true}">
        <detail-list-item term=""></detail-list-item>
        <detail-list-item term="账单原始金额">{{detailData.originalPrice}}元</detail-list-item>
        <detail-list-item term="企业确认金额">{{detailData.categoryPrice}}元</detail-list-item>
        <detail-list-item term="企业支付金额">{{detailData.paymentPrice}}元</detail-list-item>
        <detail-list-item term="账单生成日期">{{detailData.createTime}}</detail-list-item>
        <detail-list-item term="账单起始日期">{{detailData.startPredate}}</detail-list-item>
        <detail-list-item term="账单结束日期">{{detailData.endPredate}}</detail-list-item>
        <detail-list-item term="申请支付日期">{{detailData.applyTime}}</detail-list-item>
        <detail-list-item term="账单支付日期">{{detailData.paymentTime}}</detail-list-item>
      </detail-list>
    </a-drawer>
  </div>
</template>

<script>
import { getPageByParams, adminGetCategoryTemplateList, adminDownloadBillcategory, taskProgress } from '@/api/corporateAirTicket/businessBill.js'
import { STable, DetailList } from '@/components'
import moment from 'moment'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('corporateairticket')
const DetailListItem = DetailList.Item

export default {
  name: 'businessBill',
  components: {
    STable,
    DetailList,
    DetailListItem
  },
  data() {
    return {
      queryParam: {},
      drawerTitle: '',
      visible: false,
      visibleLook: false,
      visibleLookDetail: false,
      drawerStatus: '',
      loadData: parameter => {
        if (this.queryParam.departureTime) {
          this.queryParam.startCreateTime = encodeURIComponent(moment(this.queryParam.departureTime[0]).format('YYYY-MM-DD HH:mm:ss'))
          this.queryParam.endCreateTime = encodeURIComponent(moment(this.queryParam.departureTime[1]).format('YYYY-MM-DD HH:mm:ss'))
        }
        this.queryParam.categoryId = this.selectedKeysTreeCategoryId
        return getPageByParams(Object.assign(parameter, this.queryParam))
          .then(res => {
            // res.model = { "list": [{ id: 123 }], "pageNumber": 1, "pageSize": 10, "totalPage": 1, "totalRow": 0, "startNum": 0 }
            return res.model
          })
      },
      payStatusList: [
        { id: '', value: '所有' },
        { id: 0, value: '未支付' },
        { id: 1, value: '支付中' },
        { id: 2, value: '已支付' }
      ],
      columns: [
        {
          title: '账单编号',
          dataIndex: 'id',
          scopedSlots: { customRender: 'id' }
        },
        {
          title: '账单生成日期',
          width: 120,
          dataIndex: 'createTime'
        },
        {
          title: '支付日期',
          dataIndex: 'applyTime'
        },
        {
          title: '支付状态',
          dataIndex: 'payState',
          scopedSlots: { customRender: 'payState' }
        },
        {
          title: '企业名称',
          dataIndex: 'categoryName'
        },
        {
          title: '账单原始金额',
          width: 120,
          dataIndex: 'originalPrice'
        },
        {
          title: '企业确认金额',
          width: 120,
          dataIndex: 'categoryPrice'
        },
        {
          title: '企业支付金额',
          width: 120,
          dataIndex: 'paymentPrice'
        }
      ],
      columnsDrawer: [
        {
          title: '账单编号',
          dataIndex: 'billnum',
          scopedSlots: { customRender: 'id' }
        },
        {
          title: '账单期数',
          dataIndex: 'billPeriod'
        },
        {
          title: '账单生成日期',
          dataIndex: 'createTime'
        },
        {
          title: '支付日期',
          dataIndex: 'applyTime'
        },
        {
          title: '服务商名称',
          dataIndex: 'supplierName'
        },
        {
          title: '支付状态',
          dataIndex: 'payState',
          scopedSlots: { customRender: 'payState' }
        },
        {
          title: '企业账单状态',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '账单状态',
          dataIndex: 'billState',
          scopedSlots: { customRender: 'billState' }
        }
      ],
      loadDataDrawer: parameter => {
        return getPageByParams(Object.assign(parameter))
          .then(res => {
            return res.model
          })
      },
      detailData: {},
      categoryTemplateList: [],
      exportParam: this.$form.createForm(this, { name: 'exportParam' }),
      drawerForm: {},
      percentDeil: {},
      timer: ''
    }
  },
  computed: {
    ...mapState(['company']),
    selectedKeysTreeCategoryId() {
      return this.company.id
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
    },
    detail(rowIndex) {
      this.visible = true
      this.detailData = rowIndex
      this.drawerStatus = 'detail'
    },
    lookOrder() {
      this.visibleLook = true
      this.drawerStatus = 'look'
    },
    lookDetail() {
      this.visibleLookDetail = true
      this.drawerStatus = 'lookDetail'
    },
    downOrder() {
      this.$confirm({
        title: '发送',
        content: `确定要导出账单？`,
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          this.getcategoryTemplateMidList()
          this.drawerStatus = 'export'
          this.visibleLook = true
        },
        onCancel() {}
      })
    },
    refresh() {

    },
    getcategoryTemplateMidList() {
      adminGetCategoryTemplateList({ categoryId: this.selectedKeysTreeCategoryId, templateTypeId: 1 }).then(res => {
        if (res.code == 1000000) {
          this.categoryTemplateList = res.model
        }
      })
    },
    downFunction(e) {
      e.preventDefault()
      this.exportParam.validateFields((err, values) => {
        if (!err) {
          adminDownloadBillcategory({ categoryId: this.selectedKeysTreeCategoryId, templateTypeId: values.templateId }).then(res => {
            if (res.code == 1000000) {
              this.$confirm({
                title: '成功',
                content: `已成功加入批量任务列表`,
                cancelText: '关闭',
                okText: '去查看',
                onOk: () => {
                  this.drawerStatus = 'process'
                  this.visibleLook = true
                  this.drawerInit(this.detailData.id)
                  this.timer = setInterval(() => {
                    this.drawerInit(this.detailData.id)
                  }, 2000)
                },
                onCancel() {}
              })
            }
          })
        }
      })
    },
    drawerInit(id) {
      taskProgress({ id: id }).then(res => {
        if (res.code == 1000000) {
          const statusNum = res.model.state
          this.percentDeil = {
            percent: (res.model.totalNum || 0) / (res.model.num || 0),
            totalNum: res.model.totalNum,
            num: res.model.num,
            state: res.model.state,
            status: statusNum == 1 ? 'active' : statusNum == 2 ? 'success' : statusNum == 3 ? 'exception' : 'normal'
          }
          this.drawerForm.state = res.model.state
          if (res.model.state == 3 || res.model.state == 2) {
            this.percentDeil.percent = 100
            clearInterval(this.timer)
          }
        }
      })
    },
    drawerClose() {
      this.visibleLook = false
      clearInterval(this.timer)
    }
  }
}
</script>

<style scoped lang="less">
@import './index.less'; // 这个分号一定要写，要不会报错
</style>
