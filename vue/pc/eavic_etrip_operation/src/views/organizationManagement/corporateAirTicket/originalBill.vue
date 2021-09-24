<template>
  <div class="originalBill">
    <div>
      <div>原始账单列表</div>
      <a-divider />
      <div class="table-page-search-wrapper">
       <a-form layout="inline" >
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="原始账单编号">
              <a-input
                v-model="queryParam.billnum"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="服务商">
              <a-select v-model="queryParam.serviceProvider">
                <a-select-option v-for="item in serviceList" :key="item.id" :value='item.id'>
                  {{item.value}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="账单状态">
             <a-select v-model="queryParam.state">
                <a-select-option v-for="item in billingStatus" :key="item.id" :value='item.id'>
                  {{item.value}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="企业账单编号">
              <a-input
                v-model="queryParam.typeName"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="支付状态">
              <a-select v-model="queryParam.payState">
                <a-select-option v-for="item in payStatusList" :key="item.id" :value='item.id'>
                  {{item.value}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="合并状态">
              <a-select v-model="queryParam.mergeState">
                <a-select-option v-for="item in mergeSatusList" :key="item.id" :value='item.id'>
                  {{item.value}}
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
              <a-button type="primary" @click="test">
                测试服务按钮
              </a-button>
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
      :width="930"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="()=> visible = false"
      class="detail"
    >
      <detail-list v-slot:list :col="3" title="账单详情" :span="{label: 8, content: 16, labelTextLeft: true}">
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
      <detail-list v-slot:list :col="3" :span="{label: 10, content: 14, labelTextLeft: true}">
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
      <detail-list v-slot:list :col="3" :span="{label: 10, content: 14, labelTextLeft: true}">
        <detail-list-item term="支付凭证图片"><img src="" alt=""></detail-list-item>
      </detail-list>
    </a-drawer>
  </div>
</template>

<script>
import { getPageByParams, getPdf } from '@/api/corporateAirTicket/originalBill.js'
import { STable, DetailList } from '@/components'
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
      drawerStatus: '',
      loadData: parameter => {
        this.queryParam.categoryId = this.selectedKeysTreeCategoryId
        return getPageByParams(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.model
          })
      },
      serviceList: [
        { id: '', value: '所有' },
        { id: 0, value: '携程' },
        { id: 1, value: '中航服' },
        { id: 2, value: '华宇航服' },
        { id: 3, value: '空港嘉华' },
        { id: 4, value: '阳光之旅' }
      ],
      billingStatus: [
        { id: '', value: '所有' },
        { id: 0, value: 'tmc已导入但未给企业' },
        { id: 1, value: '无异常账单' },
        { id: 2, value: '企业标记有异常' },
        { id: 3, value: 'tmc对异常已修改' }
      ],
      payStatusList: [
        { id: '', value: '所有' },
        { id: 0, value: '未支付' },
        { id: 1, value: '支付中' },
        { id: 2, value: '已支付' }
      ],
      mergeSatusList: [
        { id: '', value: '所有' },
        { id: 0, value: '未合并' },
        { id: 1, value: '已合并' }
      ],
      columns: [
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
          width: 120,
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
          width: 120,
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '账单状态',
          dataIndex: 'billState',
          scopedSlots: { customRender: 'billState' }
        }
      ],
      detailData: {}
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
    reset() {
      this.queryParam = {}
    },
    detail(rowIndex) {
      this.visible = true
      this.detailData = rowIndex
    },
    test() {
      getPdf({}).then(res => {

      })
    }
  }
}
</script>

<style scoped lang="less">
@import './index.less'; // 这个分号一定要写，要不会报错
</style>
