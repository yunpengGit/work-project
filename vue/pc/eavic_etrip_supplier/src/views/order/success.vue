<template>
  <div>
    <div v-if="companyData">
      <Breadcrumb :baseBreadcrumbData="['订单管理']" style="margin: 8px 0 16px;padding-bottom: 16px;"/>
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
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="乘机人姓名">
                  <a-input
                    v-model="queryParam.passengerName"
                    placeholder="请输入"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="报销状态">
                  <a-select
                    v-model="queryParam.match_state"
                    placeholder="请选择状态"
                  >
                    <a-select-option :value="0">
                      所有
                    </a-select-option>
                    <a-select-option :value="1">
                      未报销
                    </a-select-option>
                    <a-select-option :value="2">
                      已报销
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="OPEN状态">
                  <a-select
                    v-model="queryParam.openState"
                    placeholder="请选择状态"
                  >
                    <a-select-option :value="-1">
                      所有
                    </a-select-option>
                    <a-select-option :value="1">
                      OPEN
                    </a-select-option>
                    <a-select-option :value="0">
                      非OPEN
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="是否已合并到账单">
                  <a-select
                    v-model="queryParam.journeyState"
                    placeholder="请选择状态"
                  >
                    <a-select-option :value="-1">
                      所有
                    </a-select-option>
                    <a-select-option :value="1">
                      已合并
                    </a-select-option>
                    <a-select-option :value="2">
                      未合并
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="国内国际类型">
                  <a-select
                    v-model="queryParam.ticketType"
                    placeholder="请选择状态"
                  >
                    <a-select-option :value="-1">
                      所有
                    </a-select-option>
                    <a-select-option :value="1">
                      国际
                    </a-select-option>
                    <a-select-option :value="0">
                      国内
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="正退改状态">
                  <a-select
                    v-model="queryParam.journeyState"
                    placeholder="请选择状态"
                  >
                    <a-select-option :value="-1">
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
              <a-col :md="8" :sm="24">
                <a-form-item label="抓取版本号">
                  <a-input
                    v-model="queryParam.ts_record_id"
                    style="width: 100%"
                    placeholder="请输入"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="起飞时间范围">
                  <a-range-picker
                    v-model="queryParam.departureTime"
                    :disabled-date="disabledDate"
                    :show-time="{ format: 'HH:mm' }"
                    format="YYYY-MM-DD HH:mm"
                    :placeholder="['开始时间', '结束时间']"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="录入时间范围">
                  <a-range-picker
                    v-model="queryParam.createTime"
                    :disabled-date="disabledDate"
                    :show-time="{ format: 'HH:mm' }"
                    format="YYYY-MM-DD HH:mm"
                    :placeholder="['开始时间', '结束时间']"
                  />
                </a-form-item>
              </a-col>
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
        <a-upload
          class="upload-btn-order"
          name="file"
          :multiple="uploadMultiple"
          :action="uploadAction"
          :data="uploadData"
          :beforeUpload="beforeUpload"
          :headers="uploadHeaders"
          @change="uploadChange"
        >
          <a-button><a-icon type="upload"/>上传订单</a-button>
        </a-upload>
        <span class="template-text" @click="getSupplierTemplateListFn">订单模板下载<a href="" ref="template-download" download></a></span>
        <a-button type="primary" icon="download" :disabled = "isDisableBtn">
          导出订单
        </a-button>
        <a-button type="primary" icon="download" :disabled = "isDisableBtn">
          确认函批量下载
        </a-button>
        <a-button type="primary" icon="swap" :disabled = "isDisableBtn" @click="openFn">
          OPEN变更
        </a-button>
        <a-button type="primary" @click="mergeAirTicketFn">
          <icon-font type="zuhe"/>订单合并
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
        id="pdfContent"
      >
        <template slot="num" slot-scope="text, record, index">
          <span>{{index + 1}}</span>
        </template>
        <template slot="ticketId" slot-scope="text, record">
          <span class="ticketId" @click="detailFn(record)">{{record.ticketId}}</span>
        </template>
        <template slot="match_state" slot-scope="text, record">
          <div v-if="record.match_state === 1">未报销</div>
          <div v-else-if="record.match_state === 2">已报销</div>
        </template>
        <template slot="openState" slot-scope="text, record">
          <div v-if="record.openState === 1">是open票</div>
          <div v-else-if="record.openState === 0">非open票</div>
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
        <template slot="operating" slot-scope="text, record">
          <div class="btn">
            <span class="blue" @click="confirmation(record)"><a-icon type="file-protect"/>确认函</span>
            <span class="blue" @click="editFn(record)"><a-icon type="edit"/>编辑</span>
            <span class="red"  @click="deleteFn(record)"><a-icon type="delete"/>删除</span>
          </div>
        </template>
      </s-table>
      <a-drawer
        :title="drawerTitle"
        :width="1000"
        :visible="visible"
        :body-style="{ paddingBottom: '80px' }"
        @close="drawerClose"
        class="detail"
      >
        <a-form-model
          :form="drawerForm"
        >
          <div class="detail-item">
            <detail-list v-slot:list :col="3" title="机票信息" :span="{label: 8, content: 16, labelTextLeft: true}">
              <detail-list-item term="票号">{{detailData.ticketId}}</detail-list-item>
              <detail-list-item term="订单号">{{detailData.orderNumber}}</detail-list-item>
              <detail-list-item term="改签前正票号">{{detailData.ticketIdAlter}}</detail-list-item>
              <detail-list-item term="三字码">{{detailData.airCompanyNumCode}}</detail-list-item>
              <detail-list-item term="航程">
                <span v-if="detail">
                  {{detailData.placeOfDeparture}}{{detailData.placeOfDepartureCN}} ~ {{detailData.destination}}{{detailData.destinationCN}}
                </span>
                <span v-else>
                  <a-form-model-item style="width: 45%">
                    <a-input placeholder="出发" v-model="drawerFormData.placeOfDeparture"/>
                  </a-form-model-item>
                    ~
                  <a-form-model-item style="width: 45%">
                    <a-input placeholder="到达" v-model="drawerFormData.destination"/>
                  </a-form-model-item>
                </span>
              </detail-list-item>
              <detail-list-item term="航班号">
                <span v-if="detail">
                  {{detailData.flightNo}}
                </span>
                <span v-else>
                  <a-form-model-item>
                    <a-input placeholder="请输入" v-model="drawerFormData.flightNo"/>
                  </a-form-model-item>
                </span>
              </detail-list-item>
              <detail-list-item term="正退改状态">
                <span v-if="detailData.journeyState === '1'" class="positive-ticket"><icon-font type="zhengpiao"/>正票</span>
                <span v-else-if="detailData.journeyState === '2'" class="change-ticket"><icon-font type="gaiqian"/>改签</span>
                <span v-else class="refund"><icon-font type="tuipiao"/><span>退票</span></span>
              </detail-list-item>
              <detail-list-item term="里程数(公里)">{{detailData.mileage}}</detail-list-item>
              <detail-list-item term="舱位">
                <span v-if="detail">
                  {{detailData.farebasis}}-{{detailData.physicFarebasis}}
                </span>
                <span v-else>
                  <a-form-model-item style="width: 20%">
                    <a-input  v-model="drawerFormData.farebasis" class="farebasis"/>
                  </a-form-model-item>
                  -
                  <a-form-model-item style="width: 70%">
                    <a-input v-model="drawerFormData.physicFarebasis"/>
                  </a-form-model-item>
                </span>
              </detail-list-item>
              <detail-list-item term="起飞日期">
                <span v-if="detail">
                  {{detailData.departureTime}}
                </span>
                <span v-else>
                  <a-form-model-item>
                    <a-date-picker
                      format="YYYY-MM-DD HH:mm:ss"
                      v-model="drawerFormData.departureTime"
                      show-time
                    />
                  </a-form-model-item>
                </span>
              </detail-list-item>
              <detail-list-item term="预定时间">
                <span v-if="detail">
                  {{detailData.preDate}}
                </span>
                <span v-else>
                  <a-form-model-item>
                    <a-date-picker
                      format="YYYY-MM-DD HH:mm:ss"
                      v-model="drawerFormData.preDate"
                      show-time
                    />
                  </a-form-model-item>
                </span>
              </detail-list-item>
              <detail-list-item term="机票类型">
                <span v-if="detail">
                  <span v-if="detailData.ticketType==='1'">国际</span>
                  <span v-else>国内</span>
                </span>
                <span v-else>
                  <a-radio-group v-model="drawerFormData.ticketType">
                    <a-radio :value="0">
                      国内
                    </a-radio>
                    <a-radio :value="1">
                      国际
                    </a-radio>
                  </a-radio-group>
                </span>
              </detail-list-item>
              <detail-list-item term="到达日期">
                <span v-if="detail">
                  {{detailData.arrivingTime}}
                </span>
                <span v-else>
                  <a-form-model-item>
                    <a-date-picker
                      format="YYYY-MM-DD HH:mm:ss"
                      v-model="drawerFormData.arrivingTime"
                      show-time
                    />
                  </a-form-model-item>
                </span>
              </detail-list-item>
              <detail-list-item term="出票日期">
                <span v-if="detail">
                  {{detailData.dateOfDraft}}
                </span>
                <span v-else>
                  <a-form-model-item>
                    <a-date-picker
                      format="YYYY-MM-DD HH:mm:ss"
                      v-model="drawerFormData.dateOfDraft"
                      show-time
                    />
                  </a-form-model-item>
                </span>
              </detail-list-item>
              <detail-list-item term="OPEN状态">
                <span v-if="detail">
                  <span v-if="detailData.openState === 1">OPEN</span>
                <span v-else>非OPEN</span>
                </span>
                <span v-else>
                  <a-radio-group v-model="drawerFormData.openState">
                    <a-radio :value="0">
                      非OPEN
                    </a-radio>
                    <a-radio :value="1">
                      OPEN
                    </a-radio>
                  </a-radio-group>
                </span>
              </detail-list-item>
              <detail-list-item term="是否使用协议">
                <span v-if="detail">
                  <span v-if="detailData.issueprotocal===' 1'">是</span>
                  <span v-else>否</span>
                </span>
                <span v-else>
                  <a-radio-group v-model="drawerFormData.isuseprotocal">
                    <a-radio :value="0">
                      否
                    </a-radio>
                    <a-radio :value="1">
                      是
                    </a-radio>
                  </a-radio-group>
                </span>
              </detail-list-item>
              <detail-list-item term="是否团组">
                <span v-if="detail">
                  <span v-if="detailData.groupOrderState==='1'">是</span>
                  <span v-else>否</span>
                </span>
                <span v-else>
                  <a-radio-group v-model="drawerFormData.groupOrderState">
                    <a-radio :value="0">
                      否
                    </a-radio>
                    <a-radio :value="1">
                      是
                    </a-radio>
                  </a-radio-group>
                </span>
              </detail-list-item>
              <detail-list-item term="支付方式">
                <span v-if="detailData.payType==='1'">企业支付</span>
                <span v-else>个人支付</span>
              </detail-list-item>
              <detail-list-item term="旅行目的">
                <span v-if="detail">
                  {{detailData.travelPurpose}}
                </span>
                <span v-else>
                  <a-form-model-item>
                    <a-textarea placeholder="请输入" :rows="2" v-model="drawerFormData.travelPurpose" style="100%"/>
                  </a-form-model-item>
                </span>
              </detail-list-item>
              <detail-list-item term="行程说明">
                <span v-if="detail">
                  {{detailData.travelInstructions}}
                </span>
                <span v-else>
                  <a-form-model-item>
                    <a-textarea placeholder="请输入" :rows="2" v-model="drawerFormData.travelInstructions" style="width:100%"/>
                  </a-form-model-item>
                </span>
              </detail-list-item>
              <detail-list-item term="节约机会原因">
                <span v-if="detail">
                  {{detailData.reasonOfMissingDiscount}}
                </span>
                <span v-else>
                  <a-form-model-item>
                    <a-textarea placeholder="请输入" :rows="2" v-model="drawerFormData.reasonOfMissingDiscount" style="width:100%"/>
                  </a-form-model-item>
                </span>
              </detail-list-item>
            </detail-list>
          </div>
          <div class="detail-item">
            <detail-list v-slot:list :col="3" title="预定信息" :span="{label: 6, content: 18, labelTextLeft: true}">
              <detail-list-item term="乘机人">{{detailData.passengerName}}</detail-list-item>
              <detail-list-item term="预订人">{{detailData.bookingName}}</detail-list-item>
              <detail-list-item term="订单录入人">{{detailData.createName}}</detail-list-item>
              <detail-list-item term="乘机人证件">{{detailData.idcard}}</detail-list-item>
              <detail-list-item term="预定人证件">{{detailData.bookingIdcard}}</detail-list-item>
              <detail-list-item term="预定方式">
                <span v-if="detail">
                  <span v-if="detailData.reservationMode==='1'"><icon-font type="shouji"/>APP预定</span>
                  <span v-else><icon-font type="dianhua"/>400电话预定</span>
                </span>
                <span v-else>
                  <a-radio-group v-model="drawerFormData.reservationMode">
                    <a-radio :value="0">
                      400电话预定
                    </a-radio>
                    <a-radio :value="1">
                      APP预定
                    </a-radio>
                  </a-radio-group>
                </span>
              </detail-list-item>
              <detail-list-item term="审批人">
                {{detailData.obtApprovalPersonName}}
              </detail-list-item>
              <detail-list-item term="审批意见">
                {{detailData.obtApprovalAdvise}}
              </detail-list-item>
              <detail-list-item term="审批时间">
                {{detailData.obtApprovalTime}}
              </detail-list-item>
            </detail-list>
          </div>
          <div class="detail-item">
            <detail-list v-slot:list :col="4" title="费用信息" :span="{label: 12, content: 12, labelTextLeft: true}">
              <div class="calculation-formula">
                <span>实付</span><span>=</span><span>票面价</span><span>+</span>
                <span>
                  税
                  <a-tooltip slot="icon" title="税费 = 机建费 + 燃油费">
                    <a-icon type="info-circle" />
                  </a-tooltip>
                </span>
                <span>+</span><span>保险</span><span>+</span><span>优惠卷</span><span>+</span><span>服务费</span><span>+</span><span>退票手续费</span></div>
              <div class="calculation-formula">
                <span>
                  <span v-if="detail">
                    {{detailData.totalPrice}}
                  </span>
                  <span v-else>
                    <a-form-model-item>
                      <a-input v-model="drawerFormData.totalPrice" @blur="equationCalculation"/>
                    </a-form-model-item>
                  </span>
                </span>
                <span>=</span><span>
                  <span v-if="detail">
                    {{detailData.parPrice}}
                  </span>
                  <span v-else>
                    <a-form-model-item>
                      <a-input v-model="drawerFormData.parPrice" @blur="equationCalculation"/>
                    </a-form-model-item>
                  </span>
                </span>
                <span>+</span><span>
                  <span v-if="detail">
                    {{detailData.ticketTax}}
                  </span>
                  <span v-else>
                    <a-form-model-item>
                      <a-input v-model="drawerFormData.ticketTax" @blur="equationCalculation"/>
                    </a-form-model-item>
                  </span>
                </span>
                <span>+</span><span>
                  <span v-if="detail">
                    {{detailData.insurance}}
                  </span>
                  <span v-else>
                    <a-form-model-item>
                      <a-input v-model="drawerFormData.insurance" @blur="equationCalculation"/>
                    </a-form-model-item>
                  </span>
                </span>
                <span>+</span><span>
                  <span v-if="detail">
                    {{detailData.coupon}}
                  </span>
                  <span v-else>
                    <a-form-model-item>
                      <a-input v-model="drawerFormData.coupon" @blur="equationCalculation"/>
                    </a-form-model-item>
                  </span>
                </span>
                <span>+</span><span>
                  <span v-if="detail">
                    {{detailData.travelServiceCost}}
                  </span>
                  <span v-else>
                    <a-form-model-item>
                      <a-input v-model="drawerFormData.travelServiceCost" @blur="equationCalculation"/>
                    </a-form-model-item>
                  </span>
                </span>
                <span>+</span><span>
                  <span v-if="detail">
                    {{detailData.bounceCourseFee}}
                  </span>
                  <span v-else>
                    <a-form-model-item>
                      <a-input v-model="drawerFormData.bounceCourseFee" @blur="equationCalculation"/>
                    </a-form-model-item>
                  </span>
                </span>
              </div>
              <div class="tip" v-if="equality">金额不满足公式 ("="两边不相等)</div>
              <detail-list-item term="标准价">
                <span v-if="detail">
                  {{detailData.standPrice}}
                </span>
                <span v-else>
                  <a-form-model-item>
                    <a-input v-model="drawerFormData.standPrice"/>
                  </a-form-model-item>
                </span>
              </detail-list-item>
              <detail-list-item term="改签升舱费">
                <a-tooltip slot="icon" title="改签时如果升舱，收取的升舱费，当机票为改签时,票面价格为实付金额，此时票面价 = 改签升舱费 + 改签手续费">
                  <a-icon type="info-circle" />
                </a-tooltip>
                <span v-if="detail">
                  {{detailData.改签升舱费}}
                </span>
                <span v-else>
                  <a-form-model-item>
                    <a-input v-model="drawerFormData.parpriceDiffer"/>
                  </a-form-model-item>
                </span>
              </detail-list-item>
              <detail-list-item term="机建费">
                <span v-if="detail">
                  {{detailData.oriTax}}
                </span>
                <span v-else>
                  <a-form-model-item>
                    <a-input v-model="drawerFormData.oriTax"/>
                  </a-form-model-item>
                </span>
              </detail-list-item>
              <detail-list-item term="区域时段最低价">
                <span v-if="detail">
                  {{detailData.minPrice}}
                </span>
                <span v-else>
                  <a-form-model-item>
                    <a-input v-model="drawerFormData.minPrice"/>
                  </a-form-model-item>
                </span>
              </detail-list-item>
              <detail-list-item term="折扣">
                <a-tooltip slot="icon" title="折扣 = 票面价 / 标准价">
                  <a-icon type="info-circle" />
                </a-tooltip>
                {{detailData.discountStr}}
              </detail-list-item>
              <detail-list-item term="改签手续费">
                <a-tooltip slot="icon" title="改签时航空公司收取的改签手续费，当机票为改签时票面价格为实付金额，此时票面价 = 改签升舱费 + 改签手续费">
                  <a-icon type="info-circle" />
                </a-tooltip>
                <span v-if="detail">
                  {{detailData.airCompanyAlterFee}}
                </span>
                <span v-else>
                  <a-form-model-item>
                    <a-input v-model="drawerFormData.airCompanyAlterFee"/>
                  </a-form-model-item>
                </span>
              </detail-list-item>
              <detail-list-item term="燃油费">
                <span v-if="detail">
                  {{detailData.oilFee}}
                </span>
                <span v-else>
                  <a-form-model-item>
                    <a-input v-model="drawerFormData.oilFee"/>
                  </a-form-model-item>
                </span>
              </detail-list-item>
              <detail-list-item term="最低价航班">
                <a-tooltip slot="icon" title="最低价/最低价航班/最低价舱位">
                  <a-icon type="info-circle" />
                </a-tooltip>
                <span v-if="detail">
                  {{detailData.minPriceFlightInfo}}
                </span>
                <span v-else>
                  <a-form-model-item>
                    <a-input  v-model="drawerFormData.minPriceFlightInfo"/>
                  </a-form-model-item>
                </span>
              </detail-list-item>
            </detail-list>
          </div>
          <div class="detail-item">
            <detail-list v-slot:list :col="3" title="与企业相关信息" :span="{label: 10, content: 14, labelTextLeft: true}">
              <detail-list-item term="所属企业">
                <ellipsis :length="20" tooltip>{{detailData.categoryName}}</ellipsis>
              </detail-list-item>
              <detail-list-item term="用户确认状态">
                <a-tooltip slot="icon" title="员工通过差旅系统确认或下载了确认函后，订单会变为已确认状态，确认后订单不可再进行修改，修改需要联系用户进行取消行程确认状态">
                  <a-icon type="info-circle" />
                </a-tooltip>
                <span v-if="detailData.orderlistAdmitStr==='已确认'"><icon-font type="suoding"/>已确认</span>
                <span v-else><icon-font type="jiesuo"/>未确认</span>
              </detail-list-item>
              <detail-list-item term="源员工是否已报销">{{detailData.matchStateStr}}</detail-list-item>
              <detail-list-item term="所属账单">{{detailData.billCategoryNo}}</detail-list-item>
              <detail-list-item term="企业确认状态">
                <a-tooltip slot="icon" title="企业通过接口或通过批量下载方式已经同步到网报系统中的订单，会变为企业已确认装，已确认的订单不可再进行修改，修改需要联系企业差旅管理员取消行程确认状态">
                  <a-icon type="info-circle" />
                </a-tooltip>
                <span v-if="detailData.journeyConfirmStateStr === '已确认'"><icon-font type="suoding"/>已确认</span>
                <span v-else><icon-font type="jiesuo"/>未确认</span>
              </detail-list-item>
              <detail-list-item term="成本中心">{{detailData.cost}}</detail-list-item>
            </detail-list>
          </div>
          <div class="btn">
            <span v-if="detail">
              <a-button type="primary" @click="isEditFn(detailData)">
                <a-icon type="edit"/>编辑
              </a-button>
              <a-button type="danger" @click="deleteFn(detailData)" >
                <a-icon type="delete"/>删除
              </a-button>
            </span>
            <span v-else>
              <a-button type="primary" @click="drawerFn">
                <icon-font type="save"/>保存
              </a-button>
            </span>
            <a-button @click="drawerClose" ><a-icon type="right"/>取消</a-button>
          </div>
        </a-form-model>
      </a-drawer>
      <a-drawer
        clsee="mergeAirTicket"
        title="订单合并"
        width="800"
        :visible="mergeAirTicketVisible"
        :body-style="{ paddingBottom: '80px' }"
        @close="drawerMergeAirTicketClose"
      >
        <detail-list v-slot:list :col="1" :span="{label: 8, content: 16}">
          <detail-list-item term="账单所属公司">{{mergeData.categoryName}}</detail-list-item>
          <detail-list-item term="账单所属服务商">{{mergeData.supplierName}}</detail-list-item>
          <detail-list-item term="账单期数">
            <a-select :default-value="mergeData.billYears[0]" style="width: 120px" @change="billYearsChange">
              <a-select-option v-for="item in mergeData.billYears" :value="item" :key="item">
                {{item}}
              </a-select-option>
            </a-select>
            <span style="margin: 0 4px">年</span>
            <a-select :default-value="mergeData.billPeriods[0]" style="width: 120px">
              <a-select-option v-for="item in mergeData.billPeriods" :value="item" :key="item">
                {{item}}
              </a-select-option>
            </a-select>
            <span style="margin: 0 4px">期</span>
          </detail-list-item>
          <detail-list-item term="订单日期范围">
            <a-form-item style="margin-top: -6px;">
              <a-range-picker
                v-model="mergeData.departureTime"
                :disabled-date="disabledDate"
                format="YYYY-MM-DD"
                :placeholder="['开始日期', '结束日期']"
              />
            </a-form-item>
          </detail-list-item>
          <detail-list-item term="机票类型">
            <span v-if="mergeData.billState===0">
              国内
            </span>
            <span v-else-if="mergeData.billState===1">
              国际
            </span>
          </detail-list-item>
          <detail-list-item term="账单原始金额">{{mergeData.originalPrice}}元</detail-list-item>
          <detail-list-item term="账单订单条数">{{mergeData.airTicketCanMergeCount}}条</detail-list-item>
          <detail-list-item term="不可合并订单数">{{mergeData.departureTimeCanNotMergeCount.length + mergeData.openCanNotMergeCount.length}}条</detail-list-item>
        </detail-list>
        <div class="btn" style="text-align: center">
          <a-button type="primary" @click="mergeAirTicketSave">
            <icon-font type="zuhe"/>合并
          </a-button>
          <a-button @click="drawerClose" ><a-icon type="right"/>取消</a-button>
        </div>
      </a-drawer>
    </div>
    <a-empty v-else description="请先选择供应商" style="padding: 16px;"/>
  </div>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getSupplierTemplateList, validateAndUpdateMultiOrderOpenState, mergeAirTicket, save, getListBillPeriod, update, getSupplierAirTicketOrderListPageByParams, getSingleOrderByIdInSupplier, deleteById, deleteByIds } from '@/api/order/success.js'
import { STable, DetailList, Ellipsis } from '@/components'
import Breadcrumb from './Breadcrumb'
import columns from './tableColumns'
import cloneDeep from 'lodash.clonedeep'
import moment from 'moment'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('order')
const DetailListItem = DetailList.Item

export default {
  name: 'authority',
  components: {
    Breadcrumb,
    STable,
    Ellipsis,
    DetailList,
    DetailListItem
  },
  data () {
    return {
      baseBreadcrumbData: [],
      // 高级搜索 展开/关闭
      advanced: false,
      drawerForm: this.$form.createForm(this, { name: 'drawerForm' }),
      drawerFormData: {},
      queryParam: {},
      uploadData: {
        categoryId: this.company && this.company.categoryId
      },
      uploadMultiple: true, // 是否支持多选文件，ie10+ 支持。开启后按住 ctrl 可选择多个文件
      uploadAction: '/api/airplane/supplierAirTicketOrder/uploadOrder',
      uploadHeaders: {
        // 'Content-Type': 'application/json'
      }, // 设置上传的请求头，头部ie10以上支持
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        if (this.queryParam.departureTime) {
          this.queryParam.startDepartureTime = this.queryParam.departureTime[0]
          this.queryParam.endDepartureTime = this.queryParam.departureTime[1]
          this.queryParam.startDepartureTime = moment(this.queryParam.startDepartureTime).format('YYYY-MM-DD HH:mm:ss')
          this.queryParam.endDepartureTime = moment(this.queryParam.endDepartureTime).format('YYYY-MM-DD HH:mm:ss')
        }
        if (this.queryParam.createTime) {
          this.queryParam.startCreateTime = this.queryParam.createTime[0]
          this.queryParam.endCreateTime = this.queryParam.createTime[1]
          this.queryParam.startCreateTime = moment(this.queryParam.startCreateTime).format('YYYY-MM-DD HH:mm:ss')
          this.queryParam.endCreateTime = moment(this.queryParam.endCreateTime).format('YYYY-MM-DD HH:mm:ss')
        }
        this.queryParam.categoryId = this.company.categoryId
        return getSupplierAirTicketOrderListPageByParams(Object.assign(parameter, this.queryParam))
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
      drawerTitle: '',
      detailData: '',
      visible: false,
      detail: false,
      equality: false,
      drawerSubmit: '',
      ticketTypeOptions: ['国内', '国际'],
      ticketTypeValue: '国内',
      isuseprotocalStrOptions: ['是', '否'],
      isuseprotocalStrValue: '是',
      groupOrderStateStrOptions: ['是', '否'],
      groupOrderStateStrValue: '是',
      reservationModeStrOptions: ['APP预定', '400电话预定'],
      reservationModeStrValue: 'APP预定',
      mergeAirTicketVisible: false,
      mergeData: {
        billYears: [],
        billPeriods: [],
        departureTime: null
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
  methods: {
    beforeUpload() {
      this.uploadData = {
        categoryId: this.company && this.company.categoryId
      }
      this.uploadHeaders = {
        'App-Token': Vue.ls.get(ACCESS_TOKEN)
      }
    },
    getSupplierTemplateListFn() {
      const data = { templateTypeId: 6 }
      getSupplierTemplateList(data).then((res) => {
        if (res.code === 1000000) {
          window.open(res.model[0].templatePath)
        } else {
          this.$message.error(res.resultStr)
        }
      })
    },
    mergeAirTicketFn() {
      if (this.queryParam.departureTime) {
        this.queryParam.startDepartureTime = this.queryParam.departureTime[0]
        this.queryParam.endDepartureTime = this.queryParam.departureTime[1]
        this.queryParam.startDepartureTime = moment(this.queryParam.startDepartureTime).format('YYYY-MM-DD HH:mm:ss')
        this.queryParam.endDepartureTime = moment(this.queryParam.endDepartureTime).format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.queryParam.createTime) {
        this.queryParam.startCreateTime = this.queryParam.createTime[0]
        this.queryParam.endCreateTime = this.queryParam.createTime[1]
        this.queryParam.startCreateTime = moment(this.queryParam.startCreateTime).format('YYYY-MM-DD HH:mm:ss')
        this.queryParam.endCreateTime = moment(this.queryParam.endCreateTime).format('YYYY-MM-DD HH:mm:ss')
      }
      if (!(this.queryParam.ticketType === 1 || this.queryParam.ticketType === 0)) {
        this.$message.error('请选择查询国内国际类型为国内或者国际')
        this.advanced = true
        return
      }
      const data = cloneDeep(this.queryParam)
      data.categoryId = this.company.categoryId
      mergeAirTicket(data).then(res => {
        this.mergeData = res.model
        if (this.mergeData.startPredate) {
          this.mergeData.departureTime = [moment(this.mergeData.startPredate, 'YYYY-MM-DD'), moment(this.mergeData.endPredate, 'YYYY-MM-DD')]
        }
        // console.log(res.model)
        this.mergeAirTicketVisible = true
      })
    },
    mergeAirTicketSave() {
      const data = cloneDeep(this.mergeData)
      // console.log(data)
      if (data.departureTime) {
        data.startPredate = data.departureTime[0]
        data.endPredate = data.departureTime[1]
        data.startPredate = moment(data.startPredate).format('YYYY-MM-DD HH:mm:ss')
        data.endPredate = moment(data.endPredate).format('YYYY-MM-DD HH:mm:ss')
      }
      save(data).then(res => {
        this.$message.success(res.resultStr)
        this.mergeAirTicketVisible = false
      })
    },
    drawerMergeAirTicketClose() {
      this.mergeAirTicketVisible = false
    },
    billYearsChange(value) {
      const data = {
        categoryId: this.company.categoryId,
        year: value,
        ticketType: this.queryParam.ticketType
      }
      getListBillPeriod(data).then(res => {
        if (res.code === 1000000) {
          this.mergeData.billPeriods = res.model
        } else {
          this.$message.error(res.resultStr)
        }
      })
    },
    equationCalculation() {
      const data = this.drawerFormData
      const totalPrice = +data.totalPrice
      const addPrice = (+data.parPrice) + (+data.ticketTax) + (+data.insurance) + (+data.coupon) + (+data.travelServiceCost) + (+data.bounceCourseFee)
      this.equality = totalPrice !== addPrice
    },
    disabledDate(current) {
      return current && current >= moment().endOf('day')
    },
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
    openFn() {
      const selectedRowKeys = this.selectedRowKeys
      this.$confirm({
        title: 'OPEN变更',
        content: `确定要变更已选中的数据OPEN状态吗`,
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          const data = { ids: selectedRowKeys + '' }
          validateAndUpdateMultiOrderOpenState(data).then((res) => {
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
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    showDrawer({ record, title }) {
      this.drawerTitle = title
      this.visible = true
    },
    async detailFn(record) {
      const data = await this.orderDetail(record)
      this.drawerTitle = '订单详情'
      this.detailData = data
      this.detail = true
      this.visible = true
    },
    async orderDetail(record) {
      const data = {
        id: record.id
      }
      let detailData
      await getSingleOrderByIdInSupplier(data).then(res => {
        detailData = res.model
      })
      return detailData
    },
    confirmation(record) {
      this.ExportSavePdf('确认函', 12)
    },
    async editFn(record) {
      // console.log(record)
      const data = await this.orderDetail(record)
      this.drawerTitle = '订单编辑'
      this.detailData = data
      this.detail = false
      this.visible = true
      this.drawerSubmit = update
      const drawerFormData = {
        id: data.id,
        placeOfDeparture: data.placeOfDeparture || '',
        destination: data.destination || '',
        flightNo: data.flightNo || '',
        physicFarebasis: data.physicFarebasis || '',
        farebasis: data.farebasis || '',
        departureTime: moment(data.departureTime) || null,
        preDate: moment(data.preDate) || null,
        ticketType: data.ticketType,
        arrivingTime: moment(data.arrivingTime) || null,
        dateOfDraft: moment(data.dateOfDraft) || null,
        openState: data.openState,
        isuseprotocal: data.isuseprotocal || 0,
        groupOrderState: data.groupOrderState || 0,
        reservationMode: data.reservationMode,
        travelPurpose: data.travelPurpose || '',
        obtApprovalTime: data.obtApprovalTime,
        travelInstructions: data.travelInstructions || '',
        reasonOfMissingDiscount: data.reasonOfMissingDiscount || '',
        totalPrice: data.totalPrice || 0,
        parPrice: data.parPrice || 0,
        ticketTax: data.ticketTax || 0,
        insurance: data.insurance || 0,
        coupon: data.coupon || 0,
        travelServiceCost: data.travelServiceCost || 0,
        bounceCourseFee: data.bounceCourseFee || 0,
        standPrice: data.standPrice || 0,
        parpriceDiffer: data.parpriceDiffer || 0,
        oriTax: data.oriTax || 0,
        minPrice: data.minPrice || 0,
        airCompanyAlterFee: data.airCompanyAlterFee || 0,
        oilFee: data.oilFee || 0,
        minPriceFlightInfo: data.minPriceFlightInfo
      }
      this.drawerInit(drawerFormData)
    },
    deleteFn(record) {
      this.$confirm({
        title: '删除',
        content: `确定要删除${record.ticketId}吗`,
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          const data = {
            id: record.id
          }
          deleteById(data).then((res) => {
            if (res.code === 1000000) {
              this.$message.success(res.resultStr)
              this.visible = false
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
    isEditFn(record) {
      this.editFn(record)
    },
    drawerInit(drawerFormData) {
      this.$nextTick(() => {
        this.drawerFormData = drawerFormData
      })
    },
    drawerFn() {
      const data = cloneDeep(this.drawerFormData)
      data.departureTime = data.departureTime.format('YYYY-MM-DD HH:mm:ss')
      data.preDate = data.preDate.format('YYYY-MM-DD HH:mm:ss')
      data.arrivingTime = data.arrivingTime.format('YYYY-MM-DD HH:mm:ss')
      data.dateOfDraft = data.dateOfDraft.format('YYYY-MM-DD HH:mm:ss')
      this.drawerSubmit(data).then((res) => {
        if (res.code === 1000000) {
          this.$message.success(res.resultStr)
          this.visible = false
          this.$refs.table.refreshFn()
        } else {
          this.$message.error(res.resultStr)
        }
      })
    },
    drawerClose() {
      this.visible = false
    }
  },
  watch: {
    company: {
      handler(n) {
        this.$refs.table && this.$refs.table.refreshFn(true)
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
@import './index.less';
.upload-btn-order{
  display: inline-block;
  /deep/.ant-upload-list{
    display: none;
  }
}
.template-text{
  color: #1890ff;
  cursor: pointer;
  margin: 0 6px;
}
td {
  .ticketId{
    cursor: pointer;
    color: rgba(0, 150, 250, 0.996);
    text-decoration:underline ;
  }
}
.positive-ticket{
  color: #000;
}
.change-ticket{
  color: rgba(0, 156, 34, 0.996078431372549);
}
.refund{
  color: #FF0000;
}
.detail{
  /deep/.ant-form{
    border-bottom: 0;
    padding: 0;
    .ant-form-item{
      margin-top: -6px;
      margin-bottom: 0;
      vertical-align: middle;
    }
    .ant-row{
      display: inline-block;
      .ant-col{
        display: inline-block;
        .ant-form-item-control{
          display: inline-block;
          line-height: 1;
          .ant-input{
            padding: 4px;
          }
        }
      }
    }
  }
  .farebasis{
    text-align: center;
  }
  .calculation-formula{
    margin-bottom: 8px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    span{
      width:70px;
      text-align: center;
    }
  }
  .tip{
      display: block;
      height: 22px;
      color: #FF0000;
    }
  .detail-item{
    border-bottom: 1px solid #e3e3e3;
    &:last-child{
      border-bottom: 0;
    }
  }
  .btn{
    margin-top: 16px;
    text-align: center;
    .ant-btn{
      margin: 0 2px;
    }
  }
}
.anticon-info-circle{
  margin: 0 4px;
}
/deep/.ant-radio-wrapper{
  & > span:nth-child(2){
    padding: 2px;
  }
}
.add-btn{
  margin-bottom: 16px;
  height: 34px;
  line-height: 34px;
  border: 1px dashed #0096FA;
  color: #0096FA;
  text-align: center;
  cursor: pointer;
}
.merge-air-ticket{
  .ant-form-item{
    margin-bottom: 0;
  }
}
</style>
