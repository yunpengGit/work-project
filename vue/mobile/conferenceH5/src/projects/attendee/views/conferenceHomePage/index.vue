<!--
 * @Descripttion:
 * @Author: wanghz
 * @Date: 2021-07-16 10:48:07
 * @LastEditors: zongmz
 * @LastEditTime: 2021-07-23 14:25:55
-->
<template>
  <div class="conference-home-container">
    <!-- 顶部 -->
    <div class="conference-info">
      <div
        class="card"
        :style="
          conferenceDetailData.color
            ? Number(conferenceDetailData.color) === 0
              ? cardBlueStyle
              : cardRedStyle
            : cardBlueStyle
        "
      >
        <div class="title" :class="conferenceDetailData.name.length > 26 ? 'exceed' : ''">
          {{ conferenceDetailData.name }}
        </div>
        <div class="date">
          <span class="label"><img src="./img/time.svg" alt="" /></span>
          <span
class="text"
            >{{ filterDate(conferenceDetailData.startTime) }} - {{ filterDate(conferenceDetailData.endTime) }}</span
          >
        </div>
        <div class="address">
          <span class="label"><img src="./img/place.svg" alt="" /></span>
          <span class="text">{{ conferenceDetailData.station }}</span>
        </div>
      </div>
      <!-- 快捷入口 -->
      <div class="shortcut">
        <div class="shortItem" v-for="item in shortList" :key="item.url" @click="linkShortDetail(item.type)">
          <div>
            <img :src="item.url" alt="" />
          </div>
          <span>{{ item.text }}</span>
        </div>
      </div>
    </div>
    <div class="conference-content">
      <!-- 会议安排 -->
      <div class="conference-plan" v-if="newPlanList.length || escortListStr.length || myEscortListStr.length">
        <div class="plan-title">会议安排</div>
        <div class="list" :style="{ 'flex-wrap': newPlanList.length === 4 ? 'wrap' : 'inherit' }">
          <div
            class="item"
            :class="
              newPlanList.length === 1
                ? 'only-one-item'
                : newPlanList.length === 2
                ? 'only-two-item'
                : newPlanList.length === 3
                ? 'only-three-item'
                : 'total-item'
            "
            :style="{ 'margin-right': index === newPlanList.length - 1 ? '0' : '' }"
            v-for="(ele, index) in newPlanList"
            :key="index"
            @click="
              $router.push({
                name: ele.pushUrl,
                query: {
                  [$enc('conferenceId')]: $enc(routeParams.conferenceId),
                  [$enc('stayAttendeeList')]: $enc(stayAttendeeList),
                  [$enc('diningAttendeeList')]: $enc(diningAttendeeList),
                  [$enc('ticketAttendeeList')]: $enc(ticketAttendeeList),
                  [$enc('carAttendeeList')]: $enc(carAttendeeList)
                }
              })
            "
          >
            <!-- 只有一个安排 -->
            <template v-if="newPlanList.length === 1">
              <div class="left">
                <img :src="ele.iconUrl" alt="" /> <span>{{ ele.text }}</span
                ><span class="new-tip" v-if="ele.hasNew"></span>
              </div>
              <div class="right">
                <span class="names">{{ ele.tips }}</span>
                <img src="./img/arrows.svg" alt="" />
              </div>
            </template>
            <!-- 有三个安排 -->
            <template v-else-if="newPlanList.length === 3">
              <img :src="ele.iconUrl" class="icon" />
              <div class="text">
                <div class="left">{{ ele.text }}<span class="new-tip" v-if="ele.hasNew"></span></div>
                <img src="./img/arrows.svg" alt="" />
              </div>
              <div class="tips">{{ ele.tips }}</div>
            </template>
            <!-- 有两个或四个安排 -->
            <template v-else>
              <img :src="ele.iconUrl" class="icon" />
              <div style="flex: 1">
                <div class="text">
                  <div class="left">{{ ele.text }}<span class="new-tip" v-if="ele.hasNew"></span></div>
                  <img src="./img/arrows.svg" alt="" />
                </div>
                <div class="tips">{{ ele.tips }}</div>
              </div>
            </template>
          </div>
        </div>
        <div class="escort">
          <div class="escort-list" v-if="escortListStr.length" @click="linkEscort">
            <div class="left"><img src="./img/escort.svg" alt="" /> <span>陪同人员</span></div>
            <div class="right">
              <span class="names">{{ escortListStr }}</span>
              <img src="./img/arrows.svg" alt="" />
            </div>
          </div>
          <div class="my-escort-list" v-if="myEscortListStr.length" @click="linkMyEscort">
            <div class="left"><img src="./img/escort.svg" alt="" /> <span>我的陪同</span></div>
            <div class="right">
              <span class="names">{{ myEscortListStr }}</span>
              <img src="./img/arrows.svg" alt="" />
            </div>
          </div>
        </div>
      </div>

      <!-- 我的出车任务 -->
      <div class="conference-car-task" v-if="driverId">
        <div class="title">
          <div class="label">
            我的出车任务<span class="label-number">({{ driverTaskNum }})</span>
          </div>
          <span class="more" @click="linkDriverTripTask">查看全部</span>
        </div>
        <div class="task-content">
          <div
            class="task-content-item"
            v-for="(ele, index) in driverTripTaskList"
            :key="index"
            @click="linkDriverTaskDetail(ele)"
          >
            <div class="item-title">
              <div>{{ formatCode(ele.startTime) }}</div>
              <div>{{ ele.typeStr }} {{ ele.attendeeCount }}人</div>
            </div>
            <div class="content">
              <div class="info-item">
                <div class="label">送往</div>
                <div class="value">{{ ele.endAddress }}</div>
              </div>
              <div class="info-item">
                <div class="label">上车地点</div>
                <div class="value">
                  <span>{{ ele.startAddress }}</span>
                  <img src="./img/arrows.svg" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 议程信息 -->
      <div class="conference-agenda" v-if="agendaListData && agendaListData.length">
        <div class="title">
          <div class="label">议程信息</div>
          <span
            class="more"
            @click="
              $router.push({
                name: 'conferenceAgenda',
                query: {
                  [$enc('conferenceId')]: $enc(routeParams.conferenceId),
                  [$enc('agendaListData')]: $enc(agendaListData)
                }
              })
            "
            >查看全部</span
          >
        </div>
        <van-swipe
          class="my-swipe agenda-list"
          :show-indicators="false"
          :loop="false"
          :width="agendaListData.length > 1 ? 300 : ''"
        >
          <van-swipe-item v-for="(ele, index) in agendaListData" :key="index" @click="linkAgendaDetail(ele)">
            <div class="my-swipe-item">
              <div class="name-title">
                <span>{{ filterHanziDate(ele.conductDate) }}&nbsp;&nbsp;</span
                ><span v-if="agendaListData.length > 1">{{ ele.attendeeName }}的议程</span>
              </div>
              <div class="time-map">
                <span class="point"></span>
                <div class="time">{{ ele.startTime }}-{{ ele.endTime }}</div>
                <div class="map" v-if="ele.seatUrl && ele.seatUrl.length" @click.stop="previewImg(ele.seatUrl)">
                  座位图
                </div>
              </div>
              <h4>
                <div class="line"></div>
                <span>{{ ele.name }}</span>
              </h4>
              <div class="address">
                <img src="./img/yellowPlace.svg" alt="" />
                <span>{{ ele.address }}</span>
              </div>
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
      <van-image-preview v-model="imgPreviewShow" :images="images" :showIndex="false"> </van-image-preview>

      <!-- 报名信息 -->
      <div class="apply-info">
        <div class="title">
          <div class="label">
            报名信息<span class="label-number">({{ attendeeList.length }})</span>
          </div>
          <span class="more" @click="linkApplyInfoList">查看全部</span>
        </div>
        <div class="date">
          会议报名时间：{{ filterDate(conferenceDetailData.signStartTime) }} -
          {{ filterDate(conferenceDetailData.signEndTime) }}
        </div>
        <div class="my-info">
          <div class="my-info-content">
            <div
              class="not-apply"
              v-if="
                attendeeDetailData.signStatus != 1 &&
                attendeeDetailData.signStatus != 2 &&
                attendeeDetailData.signStatus != 3
              "
              @click="linkApply(2)"
            >
              <div class="left"><img src="./img/notApply.svg" alt="" /> <span>您尚未报名本场会议！</span></div>
              <div class="right">
                <span class="names">去报名</span>
                <img src="./img/arrows.svg" alt="" />
              </div>
            </div>
            <div class="has-apply" v-else>
              <template v-if="attendeeDetailData.signStatus === 3">
                <img class="icon" src="./img/pass.svg" alt="" />
                <div class="has-apply-right">
                  <div class="right-top">
                    <span class="text">您的报名</span>
                    <span class="status">审核已通过</span>
                  </div>
                  <div class="right-bottom" v-if="!applyCompleteFlag" @click="linkEditApply(1)">
                    <span class="tip">报名信息填写不完整</span>
                    <div class="to-complete">
                      <span>去完善</span>
                      <img src="./img/arrows.svg" alt="" />
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="attendeeDetailData.signStatus === 1">
                <img class="icon" src="./img/notApply.svg" alt="" />
                <div class="has-apply-right">
                  <div class="right-top">
                    <span class="text">您的报名</span>
                    <span class="status">正在审核…</span>
                  </div>
                  <div class="right-bottom" v-if="!applyCompleteFlag" @click="linkEditApply(1)">
                    <span class="tip">如需修改，点击右侧按钮并重新提交</span>
                    <div class="to-complete">
                      <span>去修改</span>
                      <img src="./img/arrows.svg" alt="" />
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="attendeeDetailData.signStatus === 2">
                <img class="icon" src="./img/notPass.svg" alt="" />
                <div class="has-apply-right">
                  <div class="right-top">
                    <span class="text">您的报名</span>
                    <span class="status" style="color: #ea340f">审核不通过</span>
                  </div>
                  <div class="right-bottom" @click="linkEditApply(1)">
                    <span class="tip">请修改报名信息后重新提交</span>
                    <div class="to-complete">
                      <span>去修改</span>
                      <img src="./img/arrows.svg" alt="" />
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="other-info-count" v-if="total">
            <img class="icon" src="./img/otherHasApply.svg" alt="" />
            <div class="has-apply-right">
              <div class="right-top">
                <span>已代{{ total }}人报名</span>
              </div>
              <div class="right-bottom">
                <span
class="tip"
                  >审核中{{ inReviewCount }}人，审核通过{{ approvedCount }}人，审核不通过{{ notApprovedCount }}人</span
                >
              </div>
            </div>
          </div>
          <div class="btn" v-if="attendeeList.length">
            <van-button type="default" @click="linkEditApply('')">报名变更</van-button>
            <div class="line"></div>
            <van-button type="default" @click="linkEditJourney">行程变更</van-button>
            <div class="line"></div>
            <van-button type="default" @click="linkCancelApply">取消报名</van-button>
            <div class="line"></div>
            <!-- 当本人+代报名审核通过人数为0时，请假按钮禁用 -->
            <van-button
              :disabled="!approvedCount && attendeeDetailData.signStatus != 3"
              type="default"
              @click="linkApplyVacate"
              >我要请假</van-button
            >
          </div>
        </div>
        <div class="other-info" @click="linkApply(3)">
          <div class="left"><img src="./img/other.svg" alt="" /> <span>代他人报名</span></div>
          <div class="right">
            <span class="names">去报名</span>
            <img src="./img/arrows.svg" alt="" />
          </div>
        </div>
      </div>

      <!-- 我的申请 -->
      <div class="application">
        <div class="title">
          <div class="label">
            我的申请<span class="label-number">({{ totalTaskNum }})</span>
          </div>
          <span class="more" @click="linkMyApplication">查看全部</span>
        </div>
        <div class="applyItem" v-if="totalTaskNum" @click="linkApplicationDetail">
          <span
            >{{ recentApplyItem.attendeeName }}的{{ recentApplyItem.typeStr }}申请{{ recentApplyItem.resultStr }}</span
          >

          <img src="./img/arrows.svg" alt="" />
        </div>
        <div class="applyItem" v-if="!totalTaskNum">
          <span>暂无申请记录</span>
          <img src="./img/arrows.svg" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 快捷入口图片
import detailEntrance from './img/detailEntrance.svg'
import materialEntrance from './img/materialEntrance.svg'
import agendaEntrance from './img/agendaEntrance.svg'
import cardEntrance from './img/cardEntrance.svg'
import scanEntrance from './img/scanEntrance.svg'
import detailEntranceRed from './img/detailEntranceRed.svg'
import materialEntranceRed from './img/materialEntranceRed.svg'
import agendaEntranceRed from './img/agendaEntranceRed.svg'
import cardEntranceRed from './img/cardEntranceRed.svg'
import scanEntranceRed from './img/scanEntranceRed.svg'

// 四个安排图片
import car from './img/car.svg'
import dining from './img/dining.svg'
import stay from './img/stay.svg'
import ticket from './img/ticket.svg'

import ScanCodeMixin from '@/mixins/scanCode'
export default {
  mixins: [ScanCodeMixin],
  props: {
    routeParams: {
      type: Object
    }
  },
  data() {
    return {
      /* 顶部卡片主题颜色 */
      // 蓝色主题
      cardBlueStyle: {
        backgroundImage: 'url(' + require('./img/card.svg') + ') ',
        boxShadow: '0px 0px 4px 0px rgba(37, 55, 99, 0.2), 0px 0px 4px 0px rgba(0, 0, 0, 0.5)'
      },
      // 红色主题
      cardRedStyle: {
        backgroundImage: 'url(' + require('./img/cardRed.svg') + ') ',
        boxShadow: '0px 0px 4px 0px rgba(86, 4, 14, 0.58)'
      },

      /* 公共数据 */
      userInfo: {}, // 当前登录人信息

      /* 会议详情 */
      conferenceDetailData: {
        name: '', // 会议名称
        startTime: '', // 会议开始时间
        endTime: '', // 会议结束时间
        station: '', // 会议地点
        signStartTime: '', // 报名开始时间
        signEndTime: '', // 报名结束时间
        color: null // 主题颜色 0 蓝 1 红 其余默认
      },

      /* 会议安排 */
      ajaxNum: 0, // 用于记录ajax发送请求的次数
      passTotal: 0, // 审核通过的参会人个数
      passAttendeeData: null,
      planListData: [
        {
          id: 1,
          text: '用车安排',
          pushUrl: 'planofCar',
          isShow: false,
          iconUrl: car,
          hasNew: false,
          tips: '一键获取用车信息'
        },
        {
          id: 2,
          text: '住宿安排',
          pushUrl: 'planofStay',
          isShow: false,
          iconUrl: stay,
          hasNew: false,
          tips: '提前了解酒店位置'
        },
        {
          id: 3,
          text: '用餐安排',
          pushUrl: 'planofDining',
          isShow: false,
          iconUrl: dining,
          hasNew: false,
          tips: '合理规划用餐时间'
        },
        {
          id: 4,
          text: '票证安排',
          pushUrl: 'planofTicket',
          isShow: false,
          iconUrl: ticket,
          hasNew: false,
          tips: '实时掌握制证进度'
        }
      ],
      carAttendeeList: [], // 用车参会人列表
      stayAttendeeList: [], // 住宿参会人列表
      diningAttendeeList: [], // 用餐参会人列表
      ticketAttendeeList: [], // 票证参会人列表
      escortListData: [], // 陪同人员列表
      myEscortListData: [], // 我的陪同列表
      escortListStr: '', // 陪同人员字符串
      myEscortListStr: '', // 我的陪同字符串
      onlyOneAttendeeId: '', // 只有一个我的陪同？？？？

      /* 我的出车任务 */
      driverTripTaskList: [], // 出车任务列表
      driverId: '', // 当前登录人的driverId
      driverTaskDate: [], // 出车日历
      driverTaskNum: 0, // 我的出车任务数量(所有未完成任务)

      /* 议程信息 */
      currentAttendeeId: '', // 当前登录人的attendeeId
      currentAttendeeName: '', // 当前登录人的attendeeName
      onlyOtherAttendee: null, // 代报名仅为一人且状态为通过/审核中
      agendaListData: [], // 议程列表
      imgPreviewShow: false, // 图片预览开关
      images: [], // 图片数组

      /* 报名信息 */
      attendeeList: [], // 参会人列表
      attendeeDetailData: {}, // 当前登录人的参会人信息
      total: 0, // 代他人报名总人数
      approvedCount: 0, // 代他人报名审核通过人数
      notApprovedCount: 0, // 代他人报名审核未通过人数
      inReviewCount: 0, // 代他人报名审核中人数
      applyCompleteFlag: true, // 参会人信息完整性 true 完整,false 不完整

      /* 我的申请 */
      taskList: [], // 我的申请列表
      totalTaskNum: 0, // 申请列表总数
      recentApplyItem: {} // 最近一条申请详情
    }
  },
  computed: {
    // 快捷入口会议议程按钮是否显示
    shortList() {
      let shortList = [
        {
          type: 'conferenceDetail',
          url: this.conferenceDetailData.color
            ? Number(this.conferenceDetailData.color) === 0
              ? detailEntrance
              : detailEntranceRed
            : detailEntrance,
          text: '会议详情'
        },
        {
          type: 'conferenceMeans',
          url: this.conferenceDetailData.color
            ? Number(this.conferenceDetailData.color) === 0
              ? materialEntrance
              : materialEntranceRed
            : materialEntrance,
          text: '会议资料'
        },
        {
          type: 'businessCard',
          url: this.conferenceDetailData.color
            ? Number(this.conferenceDetailData.color) === 0
              ? cardEntrance
              : cardEntranceRed
            : cardEntrance,
          text: '个人名片'
        },
        {
          type: 'sign',
          url: this.conferenceDetailData.color
            ? Number(this.conferenceDetailData.color) === 0
              ? scanEntrance
              : scanEntranceRed
            : scanEntrance,
          text: '扫码签到'
        }
      ]
      if (this.agendaListData && this.agendaListData.length > 0) {
        shortList = [
          {
            type: 'conferenceDetail',
            url: this.conferenceDetailData.color
              ? Number(this.conferenceDetailData.color) === 0
                ? detailEntrance
                : detailEntranceRed
              : detailEntrance,
            text: '会议详情'
          },
          {
            type: 'conferenceMeans',
            url: this.conferenceDetailData.color
              ? Number(this.conferenceDetailData.color) === 0
                ? materialEntrance
                : materialEntranceRed
              : materialEntrance,
            text: '会议资料'
          },
          {
            type: 'conferenceAgenda',
            url: this.conferenceDetailData.color
              ? Number(this.conferenceDetailData.color) === 0
                ? agendaEntrance
                : agendaEntranceRed
              : agendaEntrance,
            text: '会议议程'
          },
          {
            type: 'businessCard',
            url: this.conferenceDetailData.color
              ? Number(this.conferenceDetailData.color) === 0
                ? cardEntrance
                : cardEntranceRed
              : cardEntrance,
            text: '个人名片'
          },
          {
            type: 'sign',
            url: this.conferenceDetailData.color
              ? Number(this.conferenceDetailData.color) === 0
                ? scanEntrance
                : scanEntranceRed
              : scanEntrance,
            text: '扫码签到'
          }
        ]
      }
      return shortList
    },
    // 安排模块是否显示
    newPlanList() {
      const arr = []
      this.planListData.forEach(item => {
        if (item.isShow) {
          arr.push(item)
        }
      })
      return arr
    }
    // newShortList() {
    //   const res = [...this.shortList]
    //   if (this.agendaData && this.agendaData.length > 0) {
    //     const obj = {
    //       type: 'agenda',
    //       url: huiyiyicheng,
    //       text: '会议议程'
    //     }
    //     res.splice(2, 0, obj)
    //   }
    //   return res
    // }
  },
  created() {
    // 获取该场会议详情
    this.getConferenceDetail()
    // 获取我的申请列表
    this.getTaskList()
    // 获取参会人列表
    this.getAttendeeList()
    // 获取首页我的出车任务列表
    this.getDriverTripTask()
  },
  methods: {
    // 获取用户id
    getUserInfo() {
      return new Promise(resolve => {
        this.$api({
          url: 'attendeeApi.userInfo'
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result
            resolve(data)
          }
        })
      })
    },

    // 将时间2021-08-25 处理为 2021年08月25日
    filterHanziDate(time) {
      const str = time.replace('-', '年').replace('-', '月')
      const newStr = str + '日'
      return newStr
    },

    // 将时间2021-08-25 18:00:00 处理为 2021.08.25 18:00
    filterTime(time) {
      const str = time.replace(/-/g, '.')
      const newStr = str.slice(0, str.length - 3)
      return newStr
    },

    // 将时间2021-08-25 18:00:00 处理为 2021.08.25
    filterDate(time) {
      const str = time.replace(/-/g, '.')
      const newStr = str.slice(0, str.length - 9)
      return newStr
    },

    // 将 2020-01-02 00:00:00 处理为 2020年01月01日 00:00
    formatCode(start) {
      const startStr = start.replace('-', '年').replace('-', '月')
      const startNewStr = startStr.slice(0, 10) + '日 ' + startStr.slice(11, 16)
      return startNewStr
    },
    // 获取参会人信息完整性
    getApplyCompleteFlag(id) {
      this.$api({
        url: 'attendeeApi.getApplyCompleteFlag',
        data: {
          attendeeId: id
        }
      }).then(res => {
        if (res.success) {
          this.applyCompleteFlag = res.result
        }
      })
    },

    // 获取首页我的出车任务
    async getDriverTripTask() {
      const userInfo = await this.getUserInfo()
      const userId = userInfo.id
      const conferenceId = this.routeParams.conferenceId
      this.$api({
        url: 'driver.getDriverIdByUserId',
        data: {
          userId,
          conferenceId
        }
      }).then(res => {
        if (res.code === 2000) {
          const driverId = res.result
          this.driverId = driverId
          if (this.driverId) {
            const params = {
              conferenceId: conferenceId,
              driverId: this.driverId,
              statusList: '0,1'
            }
            const data = {
              url: 'driver.getVechicleTaskDate',
              data: params
            }
            this.$api(data).then(res => {
              if (res.code === 2000) {
                const data = res.result.list
                this.driverTaskDate = data
                if (data) {
                  /* 格式化每日时间 */
                  const newList = []
                  data.forEach(item => {
                    if (item.fromToday <= 0) {
                      newList.push(item)
                    }
                  })
                  if (newList.length) {
                    // 获取初始化每日任务
                    const paramsData = {
                      conferenceId: conferenceId,
                      driverId: this.driverId,
                      statusList: '0,1',
                      pageNum: 1,
                      pageSize: 10,
                      startTime: newList[0].date + ' 00:00:00',
                      endTime: newList[0].date + ' 23:59:59'
                    }
                    this.$api({
                      url: 'driver.list',
                      data: paramsData
                    }).then(res => {
                      if (res.code === 2000) {
                        this.driverTripTaskList = res.result.list
                      }
                    })
                  }

                  // 获取全部未完成任务
                  const paramsData = {
                    conferenceId: conferenceId,
                    driverId: this.driverId,
                    statusList: '0,1',
                    pageNum: 1,
                    pageSize: 10,
                    startTime: data[0].date + ' 00:00:00',
                    endTime: data[data.length - 1].date + ' 23:59:59'
                  }
                  this.$api({
                    url: 'driver.list',
                    data: paramsData
                  }).then(res => {
                    if (res.code === 2000) {
                      this.driverTaskNum = res.result.total
                    }
                  })
                  /* 格式化全部时间 */
                  // const listLen = data.length
                  // let str = data[0].dateShow
                  // if (listLen > 1) {
                  //   str += ` 至 ${data[listLen - 1].dateShow}`
                  // }
                  // this.allDate = str
                }
              }
            })
          }
        }
      })
    },

    // 我的出车任务-查看全部跳转
    linkDriverTripTask() {
      const conferenceId = this.routeParams.conferenceId
      this.$router.push({
        name: 'driverTripTask',
        query: {
          [this.$enc('conferenceId')]: this.$enc(conferenceId),
          [this.$enc('driverId')]: this.$enc(this.driverId)
        }
      })
    },

    // 我的出车任务-详情 跳转
    linkDriverTaskDetail(ele) {
      const conferenceId = this.routeParams.conferenceId
      this.$router.push({
        name: 'driverTaskDetail',
        query: {
          [this.$enc('conferenceId')]: this.$enc(conferenceId),
          [this.$enc('id')]: this.$enc(ele.id)
        }
      })
    },
    // 获取该场会议详情
    getConferenceDetail() {
      const conferenceId = this.routeParams.conferenceId
      this.$api({
        url: 'attendeeApi.getDetail',
        data: {
          id: conferenceId
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result
          this.conferenceDetailData = data
        }
      })
    },

    // 快捷入口跳转：会议详情、会议资料、会议议程、个人名片、扫码签到
    linkShortDetail(type) {
      if (type === 'sign') {
        this.handleSignCode(this.routeParams.conferenceId)
      } else {
        const conferenceId = this.routeParams.conferenceId
        this.$router.push({
          name: type,
          query: {
            [this.$enc('conferenceId')]: this.$enc(conferenceId),
            [this.$enc('agendaListData')]: this.$enc(this.agendaListData)
          }
        })
      }
    },
    // 获取审核通过的参会人个数
    getPassTotal() {
      return new Promise(resolve => {
        const conferenceId = this.routeParams.conferenceId
        this.$api({
          url: 'attendeeApi.getAttendeeList',
          data: {
            conferenceId,
            signStatus: 3,
            attendeeRoleFlagEqual: '0,1,2,3,4',
            roleId: 2
          }
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result
            resolve(data)
          }
        })
      })
    },

    // 获取参会人列表
    async getAttendeeList() {
      const conferenceId = this.routeParams.conferenceId
      this.userInfo = await this.getUserInfo()
      this.passAttendeeData = await this.getPassTotal()
      this.passTotal = this.passAttendeeData.total
      this.$api({
        url: 'attendeeApi.getAttendeeList',
        data: {
          conferenceId,
          signStatusNotIn: '0, -1,-2,-3',
          signStatusEqual: 3,
          attendeeRoleFlagEqual: '0,1,2,3,4',
          roleId: 2
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result
          /**
           * signStatus=0 草稿
           * signStatus=1 待审核
           * signStatus=2 审核不通过
           * signStatus=3 审核通过
           * signStatus=-1 取消参会
           * signStatus=-2 失效
           * signStatus= -3 报名驳回
           */

          if (data && data.list.length) {
            let total = 0
            let approvedCount = 0
            let notApprovedCount = 0
            let inReviewCount = 0
            data.list.find(item => {
              // 代他人的陪同人员查询
              this.getEscortData(item.fixAttributeCommonVO.attendeeId)

              if (Number(this.userInfo.id) === Number(item.userId)) {
                // 判断为当前登录用户的记录
                const id = item.fixAttributeCommonVO.attendeeId
                this.currentAttendeeId = id
                this.currentAttendeeName = item.fixAttributeCommonVO.attendeeName
                this.getApplyCompleteFlag(id)
                this.getAttendeeDetail(id)
                this.getMyEscortData(id)
              }

              // 代他人审核状态
              if (Number(this.userInfo.id) !== Number(item.userId)) {
                if (Number(item.signStatus) === 1) {
                  inReviewCount++
                  if (inReviewCount === 1) {
                    this.onlyOtherAttendee = item
                  }
                  total++
                }
                if (item.signStatus === 2 || item.signStatus === -3) {
                  notApprovedCount++
                  total++
                }
                if (item.signStatus === 3) {
                  approvedCount++
                  if (approvedCount === 1) {
                    this.onlyOtherAttendee = item
                  }
                  total++
                }
              }
              this.total = total
              this.approvedCount = approvedCount
              this.notApprovedCount = notApprovedCount
              this.inReviewCount = inReviewCount
            })
            const newData = []
            data.list.forEach(item => {
              if (Number(item.signStatus) !== 0) {
                newData.push(item)
              }
              if (Number(item.signStatus) !== 3) return
              this.$api({
                url: 'attendeeApi.getAttendeeDetail',
                data: {
                  id: item.id,
                  publish: 1
                }
              }).then(res => {
                if (res.success) {
                  if (res.result != null) {
                    // 控制四个安排展示逻辑
                    if (Number(res.result.ticketStatus) === 2 && Number(this.conferenceDetailData.useCardFlag) === 1) {
                      // 票证安排
                      this.planListData.forEach(item => {
                        if (Number(item.id) === 4) {
                          item.isShow = true
                        }
                      })
                      if (
                        !this.ticketAttendeeList.some(item => {
                          return Number(item.id) === Number(res.result.id)
                        })
                      ) {
                        this.ticketAttendeeList.push(res.result)
                      }
                    }
                    if (
                      Number(res.result.vehicleStatus) === 2 &&
                      Number(this.conferenceDetailData.useVehicleFlag) === 1
                    ) {
                      // 用车安排
                      this.planListData.forEach(item => {
                        if (Number(item.id) === 1) {
                          item.isShow = true
                        }
                      })
                      if (
                        !this.carAttendeeList.some(item => {
                          return Number(item.id) === Number(res.result.id)
                        })
                      ) {
                        this.carAttendeeList.push(res.result)
                      }
                    }
                    if (Number(res.result.foodStatus) === 2 && Number(this.conferenceDetailData.useDinnerFlag) === 1) {
                      // 用餐安排
                      this.planListData.forEach(item => {
                        if (Number(item.id) === 3) {
                          item.isShow = true
                        }
                      })
                      if (
                        !this.diningAttendeeList.some(item => {
                          return Number(item.id) === Number(res.result.id)
                        })
                      ) {
                        this.diningAttendeeList.push(res.result)
                      }
                    }
                    if (Number(res.result.stayStatus) === 2 && Number(this.conferenceDetailData.useRoomFlag) === 1) {
                      // 住宿安排
                      this.planListData.forEach(item => {
                        if (Number(item.id) === 2) {
                          item.isShow = true
                        }
                      })
                      if (
                        !this.stayAttendeeList.some(item => {
                          return Number(item.id) === Number(res.result.id)
                        })
                      ) {
                        this.stayAttendeeList.push(res.result)
                      }
                    }
                    this.$api({
                      url: 'attendeeApi.getAgenda',
                      data: {
                        conferenceId,
                        attendeeId: item.id
                      }
                    }).then(res => {
                      if (res.success) {
                        if (res.result[0] && res.result[0].children[0]) {
                          const data = res.result[0].children[0]
                          var showPhotoUrl = ''
                          if (item.ssoUserPhoto !== null && item.ssoUserPhoto !== '') {
                            showPhotoUrl = item.ssoUserPhoto
                          } else {
                            if (Number(item.fixAttributeCommonVO.sex) === 1) {
                              showPhotoUrl = require('../../../../assets/images/defaultManPhoto.png')
                            } else if (Number(this.userInfo.sex) === 2) {
                              showPhotoUrl = require('../../../../assets/images/defaultWomenPhoto.png')
                            } else {
                              showPhotoUrl = require('../../../../assets/images/defaultPhoto.png')
                            }
                          }
                          this.$api({
                            url: 'attendeeApi.getSeat',
                            data: {
                              agendaId: data.id,
                              attendeeId: item.id
                            }
                          })
                            .then(res => {
                              if (res.success) {
                                this.$set(data, 'seatUrl', res.result)
                              } else {
                                this.$set(data, 'seatUrl', '')
                              }
                            })
                            .catch(() => {
                              this.$set(data, 'seatUrl', '')
                            })
                          data.showPhotoUrl = showPhotoUrl
                          data.attendeeName = item.fixAttributeCommonVO.attendeeName
                          data.attendeeId = item.id
                          this.agendaListData.push(data)
                        }
                      }
                    })
                  }
                  this.ajaxNum++
                  // 查询参会人是否有新任务
                  this.getNewTaskFlag()
                }
              })
            })
            this.attendeeList = newData
          }
        }
      })
    },
    // 查询参会人是否有新任务
    getNewTaskFlag() {
      if (this.passTotal && this.passTotal === this.ajaxNum) {
        const attendeeList = this.carAttendeeList.concat(
          this.stayAttendeeList,
          this.diningAttendeeList,
          this.ticketAttendeeList
        )
        const arr = []
        attendeeList.forEach(item => {
          arr.push(item.id)
        })
        arr.push(this.currentAttendeeId)
        const newArr = [...new Set(arr)]
        const str = newArr.join(',')
        const params = {}
        params.conferenceId = this.routeParams.conferenceId
        // 当前登录人attendeeId
        params.attendeeId = this.currentAttendeeId
        // 当前登录人+代报名的人 attendeeId集合
        params.attendeeIdsIn = str
        if (params.attendeeId) {
          this.$api({
            url: 'attendeeApi.getNewTaskFlag',
            data: params
          }).then(res => {
            if (res.code === 2000) {
              const data = res.result
              if (data.vehicleTaskFlag) {
                this.planListData[0].hasNew = true
              }
              if (data.roomTaskFlag) {
                this.planListData[1].hasNew = true
              }
              if (data.dinnerTaskFlag) {
                this.planListData[2].hasNew = true
              }
              if (data.cardTaskFlag) {
                this.planListData[3].hasNew = true
              }
            }
          })
        }

        // 调整四个安排参会人员顺序与[报名信息-查看全部]顺序一致
        const all = this.passAttendeeData.list
        const arr1 = []
        const arr2 = []
        const arr3 = []
        const arr4 = []
        for (let i = 0; i < all.length; i++) {
          for (let j = 0; j < this.carAttendeeList.length; j++) {
            if (Number(all[i].id) === Number(this.carAttendeeList[j].id)) {
              arr1.push(this.carAttendeeList[j])
            }
          }
          for (let j = 0; j < this.stayAttendeeList.length; j++) {
            if (Number(all[i].id) === Number(this.stayAttendeeList[j].id)) {
              arr2.push(this.stayAttendeeList[j])
            }
          }
          for (let j = 0; j < this.diningAttendeeList.length; j++) {
            if (Number(all[i].id) === Number(this.diningAttendeeList[j].id)) {
              arr3.push(this.diningAttendeeList[j])
            }
          }
          for (let j = 0; j < this.ticketAttendeeList.length; j++) {
            if (Number(all[i].id) === Number(this.ticketAttendeeList[j].id)) {
              arr4.push(this.ticketAttendeeList[j])
            }
          }
        }
        this.carAttendeeList = arr1
        this.stayAttendeeList = arr2
        this.diningAttendeeList = arr3
        this.ticketAttendeeList = arr4
      }
    },

    // 预览座位图
    previewImg(url) {
      this.imgPreviewShow = true
      this.images = [url]
    },

    // 根据id查看参会人信息
    getAttendeeDetail(id) {
      this.$api({
        url: 'attendeeApi.getAttendeeDetail',
        data: {
          id,
          publish: 1
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result
          this.attendeeDetailData = data
        }
      })
    },

    // 获取陪同人员
    getEscortData(id) {
      this.$api({
        url: 'attendeeApi.escort',
        data: {
          attendeeId: id
        }
      }).then(res => {
        if (res.success) {
          const data = res.result
          this.formatEscortStr(data) // 陪同人员格式化
        } else {
          this.$toast(res.msg)
        }
      })
    },

    // 格式化陪同人员
    formatEscortStr(data) {
      for (var k = 0; k < data.length; k++) {
        if (data[k].name === '陪同人员') {
          for (var i = 0; i < data[k].attendeeAccompany.length; i++) {
            if (this.escortListData.indexOf(data[k].attendeeAccompany[i].attendeeFixAttribute.attendeeName) === -1) {
              this.escortListData.push(data[k].attendeeAccompany[i].attendeeFixAttribute.attendeeName)
            }

            this.escortListStr = this.escortListData.join('、')
          }
          if (this.escortListData.length > 4) {
            this.escortListStr = `${this.escortListData.join('、')}等${this.escortListData.length}人`
          }
        }
      }
    },

    // 我的陪同
    getMyEscortData(id) {
      this.$api({
        url: 'attendeeApi.myEscort',
        data: {
          attendeeId: id
        }
      }).then(res => {
        if (res.success) {
          const data = res.result
          this.formatMyEscortStr(data) // 陪同人员格式化
        } else {
          this.$toast(res.msg)
        }
      })
    },

    // 格式化我的陪同
    formatMyEscortStr(data) {
      data.forEach(item => {
        this.myEscortListData.push(item.attendeeFixAttribute.attendeeName)
        this.onlyOneAttendeeId = item.attendeeId
      })
      this.myEscortListStr = this.myEscortListData.join('、')
      if (this.myEscortListData.length > 4) {
        this.myEscortListStr = `${this.myEscortListData.join('、')}等${this.myEscortListData.length}人`
      }
    },

    // 点击陪同人员跳转
    linkEscort() {
      this.$router.push({
        name: 'escort',
        query: {
          [this.$enc('conferenceId')]: this.$enc(this.routeParams.conferenceId)
        }
      })
    },

    // 点击我的陪同跳转
    linkMyEscort() {
      if (this.myEscortListData.length > 1) {
        this.$router.push({
          name: 'myEscort',
          query: {
            [this.$enc('currentAttendeeId')]: this.$enc(this.currentAttendeeId)
          }
        })
      } else {
        this.$router.push({
          name: 'escortDetail',
          query: {
            [this.$enc('attendeeId')]: this.$enc(this.onlyOneAttendeeId)
          }
        })
      }
    },

    // 报名信息查看全部
    linkApplyInfoList() {
      if (this.attendeeList.length === 1) {
        // 只有一条时跳转到报名信息详情页，否则进入列表页
        this.$router.push({
          name: 'applyInfoDetail',
          query: {
            [this.$enc('conferenceId')]: this.$enc(this.routeParams.conferenceId),
            [this.$enc('attendeeId')]: this.$enc(this.attendeeList[0].id),
            [this.$enc('attendeeName')]: this.$enc(this.attendeeList[0].fixAttributeCommonVO.attendeeName),
            [this.$enc('signStatus')]: this.$enc(this.attendeeList[0].signStatus)
          }
        })
      } else {
        this.$router.push({
          name: 'applyInfoList',
          query: {
            [this.$enc('conferenceId')]: this.$enc(this.routeParams.conferenceId)
          }
        })
      }
    },

    // 去报名
    linkApply(type) {
      /**
       * index=0 [我要报名]
       * index=1 [代他人报名]
       */
      this.$router.push({
        name: 'addApply',
        query: {
          [this.$enc('conferenceId')]: this.$enc(this.routeParams.conferenceId),
          [this.$enc('replaceIdent')]: this.$enc(type)
        }
      })
    },

    // 行程变更
    async linkEditJourney() {
      const conferenceId = this.routeParams.conferenceId
      // 本人+代报名审核通过/待审核人数大于1时进入选人列表页，否则直接进入编辑表单页
      let approvedCount = this.approvedCount + this.inReviewCount
      if (this.attendeeDetailData.signStatus === 3 || this.attendeeDetailData.signStatus === 1) {
        approvedCount += 1
      }
      if (approvedCount > 1) {
        this.$router.push({
          name: 'applyInfoList',
          query: {
            [this.$enc('conferenceId')]: this.$enc(conferenceId),
            [this.$enc('Type')]: this.$enc('editJourney')
          }
        })
      } else {
        const result1 = await this.mySelfapply(
          this.attendeeDetailData.signStatus === 3 || this.attendeeDetailData.signStatus === 1
            ? this.currentAttendeeId
            : this.onlyOtherAttendee.id
        )
        if (result1.list.length > 0) {
          let noticeStr1 =
            this.attendeeDetailData.signStatus === 3 || this.attendeeDetailData.signStatus === 1
              ? '您的'
              : this.onlyOtherAttendee.fixAttributeCommonVO.attendeeName + '的'
          const applyType1 = Number(result1.list[0].type)
          if (applyType1 !== 1) {
            if (applyType1 === 2) {
              noticeStr1 = noticeStr1 + '报名信息变更'
            } else if (applyType1 === 3) {
              noticeStr1 = noticeStr1 + '取消报名'
            } else if (applyType1 === 4) {
              noticeStr1 = noticeStr1 + '行程变更'
            } else if (applyType1 === 5) {
              noticeStr1 = noticeStr1 + '请假'
            }
            noticeStr1 = noticeStr1 + '申请正在审核中'
            this.$dialog.alert({
              message: noticeStr1,
              confirmButtonText: '我知道了',
              className: 'attendeeDialog'
            })
            return
          }
        }
        this.$router.push({
          name: 'editJourney',
          query: {
            [this.$enc('conferenceId')]: this.$enc(conferenceId),
            [this.$enc('attendeeId')]:
              this.attendeeDetailData.signStatus === 3 || this.attendeeDetailData.signStatus === 1
                ? this.$enc(this.currentAttendeeId)
                : this.$enc(this.onlyOtherAttendee.id),
            [this.$enc('attendeeName')]:
              this.attendeeDetailData.signStatus === 3 || this.attendeeDetailData.signStatus === 1
                ? this.$enc(this.currentAttendeeName)
                : this.$enc(this.onlyOtherAttendee.fixAttributeCommonVO.attendeeName)
          }
        })
      }
    },
    // 我作为参会人的申请
    mySelfapply(id) {
      return new Promise(resolve => {
        const conferenceId = this.routeParams.conferenceId
        this.$api({
          url: 'attendeeApi.mySelfapply',
          data: {
            conferenceId,
            pageNum: 1, // 传入固定参数，本接口仅需验证有数据即可
            pageSize: 10, // 传入固定参数，本接口仅需验证有数据即可
            statusEqual: '1', // 状态为待办
            attendeeId: id
          }
        }).then(res => {
          if (res.success) {
            const data = res.result
            resolve(data)
          }
        })
      })
    },
    // 报名变更
    async linkEditApply(myself) {
      const conferenceId = this.routeParams.conferenceId
      if (myself) {
        const result = await this.mySelfapply(this.currentAttendeeId)
        if (result.list.length > 0) {
          let noticeStr = '您的'
          const applyType = Number(result.list[0].type)
          if (applyType !== 1) {
            if (applyType === 2) {
              noticeStr = noticeStr + '报名信息变更'
            } else if (applyType === 3) {
              noticeStr = noticeStr + '取消报名'
            } else if (applyType === 4) {
              noticeStr = noticeStr + '行程变更'
            } else if (applyType === 5) {
              noticeStr = noticeStr + '请假'
            }
            noticeStr = noticeStr + '申请正在审核中'
            this.$dialog.alert({
              message: noticeStr,
              confirmButtonText: '我知道了',
              className: 'attendeeDialog'
            })
            return
          }
        }
        this.$router.push({
          name: 'editApply',
          query: {
            [this.$enc('conferenceId')]: this.$enc(this.routeParams.conferenceId),
            [this.$enc('attendeeId')]: this.$enc(this.currentAttendeeId)
          }
        })
      } else {
        // 本人+代报名审核通过人数大于1时进入选人列表页，否则直接进入编辑表单页
        let approvedCount = this.approvedCount + this.inReviewCount
        if (this.attendeeDetailData.signStatus === 3 || this.attendeeDetailData.signStatus === 1) {
          approvedCount += 1
        }
        if (approvedCount > 1) {
          this.$router.push({
            name: 'applyInfoList',
            query: {
              [this.$enc('conferenceId')]: this.$enc(conferenceId),
              [this.$enc('Type')]: this.$enc('editApply')
            }
          })
        } else {
          const result1 = await this.mySelfapply(
            this.attendeeDetailData.signStatus === 3 || this.attendeeDetailData.signStatus === 1
              ? this.currentAttendeeId
              : this.onlyOtherAttendee.id
          )
          if (result1.list.length > 0) {
            let noticeStr1 =
              this.attendeeDetailData.signStatus === 3 || this.attendeeDetailData.signStatus === 1
                ? '您的'
                : this.onlyOtherAttendee.fixAttributeCommonVO.attendeeName + '的'
            const applyType1 = Number(result1.list[0].type)
            if (applyType1 !== 1) {
              if (applyType1 === 2) {
                noticeStr1 = noticeStr1 + '报名信息变更'
              } else if (applyType1 === 3) {
                noticeStr1 = noticeStr1 + '取消报名'
              } else if (applyType1 === 4) {
                noticeStr1 = noticeStr1 + '行程变更'
              } else if (applyType1 === 5) {
                noticeStr1 = noticeStr1 + '请假'
              }
              noticeStr1 = noticeStr1 + '申请正在审核中'
              this.$dialog.alert({
                message: noticeStr1,
                confirmButtonText: '我知道了',
                className: 'attendeeDialog'
              })
              return
            }
          }

          this.$router.push({
            name: 'editApply',
            query: {
              [this.$enc('conferenceId')]: this.$enc(conferenceId),
              [this.$enc('attendeeId')]:
                this.attendeeDetailData.signStatus === 3 || this.attendeeDetailData.signStatus === 1
                  ? this.$enc(this.currentAttendeeId)
                  : this.$enc(this.onlyOtherAttendee.id)
            }
          })
        }
      }
    },

    // 取消报名
    linkCancelApply() {
      // 本人+代报名审核通过人数大于1时传attendeeId空，否则传唯一id
      let approvedCount = this.approvedCount + this.inReviewCount
      if (this.attendeeDetailData.signStatus === 3 || this.attendeeDetailData.signStatus === 1) {
        approvedCount += 1
      }
      this.$router.push({
        name: 'cancelApply',
        query: {
          [this.$enc('conferenceId')]: this.$enc(this.routeParams.conferenceId),
          [this.$enc('attendeeId')]:
            approvedCount > 1
              ? ''
              : this.attendeeDetailData.signStatus === 3 || this.attendeeDetailData.signStatus === 1
                ? this.$enc(this.currentAttendeeId)
                : this.$enc(this.onlyOtherAttendee.id),
          [this.$enc('attendeeName')]:
            approvedCount > 1
              ? ''
              : this.attendeeDetailData.signStatus === 3 || this.attendeeDetailData.signStatus === 1
                ? this.$enc(this.currentAttendeeName)
                : this.$enc(this.onlyOtherAttendee.fixAttributeCommonVO.attendeeName),
          [this.$enc('signStatus')]:
            approvedCount > 1
              ? ''
              : this.attendeeDetailData.signStatus === 3 || this.attendeeDetailData.signStatus === 1
                ? this.$enc(this.attendeeDetailData.signStatus)
                : this.$enc(this.onlyOtherAttendee.signStatus)
        }
      })
    },

    // 我要请假
    linkApplyVacate() {
      this.$router.push({
        name: 'applyVacate',
        query: {
          [this.$enc('conferenceId')]: this.$enc(this.routeParams.conferenceId),
          [this.$enc('conferenceDetailData')]: this.$enc(this.conferenceDetailData)
        }
      })
    },

    // 跳转到议程详情页
    linkAgendaDetail(ele) {
      this.$router.push({
        name: 'conferenceAgendaDetail',
        query: {
          [this.$enc('agendaId')]: this.$enc(ele.id)
        }
      })
    },

    // 获取我的申请列表
    getTaskList() {
      const conferenceId = this.routeParams.conferenceId
      this.$api({
        url: 'attendeeApi.getTaskList',
        data: {
          conferenceId: conferenceId,
          pageNum: 1,
          pageSize: 10
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result
          this.taskList = data.list
          this.totalTaskNum = data.total
          this.recentApplyItem = this.taskList[0]
        }
      })
    },

    // 查看全部 我的申请
    linkMyApplication() {
      const conferenceId = this.routeParams.conferenceId
      this.$router.push({
        name: 'myApplication',
        query: {
          [this.$enc('conferenceId')]: this.$enc(conferenceId)
        }
      })
    },

    // 查看最近一条申请详情
    linkApplicationDetail() {
      this.$router.push({
        name: 'applicationDetail',
        query: {
          [this.$enc('applicationDetail')]: this.$enc(this.recentApplyItem),
          [this.$enc('conferenceId')]: this.$enc(this.routeParams.conferenceId)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import './css/mixin.scss';
@mixin bg-radius {
  background-color: #fff;
  border-radius: 12px;
}
@mixin box-shadow {
  box-shadow: 0px 3px 20px 0px rgba(0, 0, 0, 0.08);
}
.conference-home-container {
  height: 100vh;
  overflow: auto;
  background-color: #fff;
}
.conference-info {
  padding: 28px 16px 0 16px;
  width: 100%;
  // height: 320px;
  background: url('./img/bg.svg') no-repeat;
  background-size: cover;
  color: #fff;
  .card {
    background-repeat: no-repeat;
    border-radius: 4px;
    background-size: cover;
    padding: 16px 20px 21px 16px;
    .title {
      font-size: 22px;
      font-weight: 500;
      color: #ffffff;
      line-height: 34px;
      margin-bottom: 21px;
    }
    .exceed {
      font-size: 20px;
      line-height: 30px;
    }
    .date {
      line-height: 16px;
    }
    .address {
      margin-top: 9px;
      line-height: 22px;
      .label {
        margin-top: 3px;
      }
      .text {
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    .date,
    .address {
      display: flex;
      font-size: 16px;
      color: #ffffff;
      .label {
        height: 16px;
        line-height: 16px;
        width: 20px;
      }
      .text {
        opacity: 0.8;
        flex: 1;
      }
    }
  }
  // 快捷入口
  .shortcut {
    padding: 28px 0 14px 0;
    display: flex;
    height: 114px;
    .shortItem {
      font-size: 13px;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      div {
        height: 50px;
        img {
          width: 40px;
          height: 40px;
        }
      }
      span {
        flex: 1;
        color: rgba(25, 31, 36, 0.56);
      }
    }
  }
}
.conference-content {
  background-color: #f2f5fc;
  padding: 0 16px;
  position: relative;

  // 会议安排
  .conference-plan {
    margin-bottom: 18px;
    .plan-title {
      height: 48px;
      display: flex;
      align-items: center;
      font-size: 17px;
      font-weight: bold;
      color: #191f24;
      margin-left: 8px;
    }
    .list {
      display: flex;
      justify-content: space-between;
      .item {
        margin-bottom: 3px;
        background: linear-gradient(225deg, #ffffff 0%, #f9fbfe 100%);
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.09);
        border-radius: 3px;
        .icon {
          width: 28px;
          height: 28px;
        }
        .text {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2px;
          .left {
            line-height: 21px;
            height: 21px;
            vertical-align: middle;
            color: #191f24;
            font-family: PingFangSC-Medium, PingFang SC;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 15px;
            font-weight: normal;
            .new-tip {
              display: inline-block;
              width: 7px;
              height: 7px;
              border-radius: 4px;
              background-color: #fd3c34;
              margin-left: 5px;
            }
          }
        }

        .tips {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(25, 31, 36, 0.56);
          line-height: 18px;
        }
      }
      .only-one-item {
        width: 100%;
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 48px;
        .left {
          width: 40%;
          display: flex;
          align-items: center;
          img {
            width: 28px;
            height: 28px;
            margin-right: 10px;
          }
          .new-tip {
            display: inline-block;
            width: 7px;
            height: 7px;
            border-radius: 4px;
            background-color: #fd3c34;
            margin-left: 6px;
          }
          span {
            font-size: 15px;
            color: #191f24;
          }
        }
        .right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          span {
            font-size: 12px;
            color: rgba(25, 31, 36, 0.56);
          }
          img {
            margin-left: 5px;
          }
        }
      }
      .only-two-item,
      .total-item {
        width: 50%;
        margin-right: 3px;
        margin-bottom: 3px;
        padding: 15px 10px 17px 10px;
        height: 73px;
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
        }
      }
      .total-item {
        width: 49.5%;
        margin-right: 0;
      }
      .only-three-item {
        padding: 11px 10px;
        width: 33.33%;
        height: 108px;
        margin-right: 3px;
        .icon {
          margin-bottom: 10px;
        }
      }
    }
    .escort {
      .escort-list,
      .my-escort-list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(225deg, #ffffff 0%, #f9fbfe 100%);
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.09);
        border-radius: 3px;
        height: 48px;
        margin-bottom: 3px;
        padding: 0 10px;
        .left {
          width: 35%;
          display: flex;
          align-items: center;
          img {
            width: 28px;
            height: 28px;
            margin-right: 10px;
          }
          span {
            font-size: 15px;
            color: #191f24;
          }
        }
        .right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          span {
            text-align: right;
            width: 190px;
            height: 16px;
            line-height: 16px;
            font-size: 12px;
            color: rgba(25, 31, 36, 0.56);
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          img {
            margin-left: 5px;
          }
        }
      }
    }
  }
  // 我的出车任务
  .conference-car-task {
    margin-bottom: 18px;
    .title {
      height: 48px;
      display: flex;
      align-items: center;
      margin: 0 8px;
      justify-content: space-between;
      color: #191f24;
      .label {
        position: relative;
        font-weight: bold;
        font-size: 17px;
        .label-number {
          position: absolute;
          font-size: 13px;
          margin-left: 2px;
          bottom: 2px;
        }
      }
      .more {
        font-size: 14px;
      }
    }
    .task-content {
      .task-content-item {
        background: linear-gradient(180deg, #fdfdfe 0%, #ffffff 100%);
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        margin-bottom: 12px;
        .item-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 52px;
          font-size: 16px;
          font-weight: 500;
          color: #102c70;
          line-height: 22px;
          padding: 0 14px;
        }
        .content {
          .info-item {
            font-size: 14px;
            display: flex;
            padding: 16px 10px 16px 14px;
            border-top: 1px solid #f1f1f2;
            .label {
              width: 60px;
              color: rgba(25, 31, 36, 0.64);
              margin-right: 15px;
            }
            .value {
              flex: 1;
              display: flex;
              justify-content: space-between;
              color: #191f24;
            }
          }
        }
      }
    }
  }
  // 议程信息
  .conference-agenda {
    margin-bottom: 18px;
    .title {
      height: 48px;
      display: flex;
      align-items: center;
      margin: 0 8px;
      justify-content: space-between;
      color: #191f24;
      .label {
        font-weight: bold;
        font-size: 17px;
      }
      .more {
        font-size: 14px;
      }
    }
    .my-swipe {
      padding-bottom: 10px;
      .my-swipe-item {
        padding: 14px 20px;
        margin-right: 6px;
        border-radius: 4px;
        background: linear-gradient(180deg, #fdfdfe 0%, #f2f5fc 100%);
        box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.06);
      }
    }
    .agenda-list {
      .name-title {
        font-size: 13px;
        font-weight: 400;
        color: #000000;
        line-height: 18px;
        font-weight: 500;
        margin-bottom: 3px;
      }
      .time-map {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2px;
        position: relative;
        .point {
          position: absolute;
          top: 14px;
          left: 0;
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 3px;
          background-color: #000;
        }
        .time {
          width: 80%;
          font-size: 24px;
          font-weight: 600;
          color: #000000;
          line-height: 33px;
          height: 33px;
          vertical-align: middle;
          padding-left: 20px;
        }
        .map {
          width: 73px;
          height: 25px;
          line-height: 25px;
          text-align: center;
          border-radius: 13px;
          border: 1px solid #3a5cc8;
          color: #2e4dc3;
        }
      }
      h4 {
        position: relative;
        font-size: 15px;
        font-weight: 400;
        color: #000000;
        line-height: 21px;
        height: 21px;
        margin-bottom: 19px;
        padding-left: 20px;
        .line {
          position: absolute;
          height: 39px;
          left: 1px;
          top: -7px;
          border-right: 1px dashed #000;
        }
      }
      .address {
        position: relative;
        font-size: 13px;
        padding-left: 20px;
        color: #000000;
        img {
          position: absolute;
          width: 16px;
          height: 16px;
          top: -2px;
          left: -6px;
          margin-right: 5px;
        }
      }
    }
  }
  // 报名信息
  .apply-info {
    margin-bottom: 18px;
    .title {
      height: 48px;
      display: flex;
      align-items: center;
      margin: 0 8px;
      justify-content: space-between;
      color: #191f24;
      .label {
        position: relative;
        font-weight: bold;
        font-size: 17px;
        .label-number {
          position: absolute;
          font-size: 13px;
          margin-left: 2px;
          bottom: 2px;
        }
      }
      .more {
        font-size: 14px;
      }
    }
    .date {
      height: 18px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(25, 31, 36, 0.56);
      line-height: 18px;
      margin: 0 0 8px 9px;
    }

    .my-info {
      background: linear-gradient(180deg, #fdfdfe 0%, #ffffff 100%);
      box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.12);
      border-radius: 4px;
      margin-bottom: 3px;
      .my-info-content {
        .not-apply {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(151, 151, 151, 0.2);
          height: 48px;
          padding: 0 10px;
          .left {
            width: 70%;
            display: flex;
            align-items: center;
            img {
              width: 36px;
              height: 36px;
              margin-right: 10px;
            }
            span {
              font-size: 16px;
              color: #191f24;
            }
          }
          .right {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            span {
              font-size: 13px;
              color: #4869dd;
            }
            img {
              margin-left: 5px;
            }
          }
        }
      }
      .has-apply,
      .other-info-count {
        display: flex;
        align-items: center;
        padding: 0 10px;
        height: 87px;
        border-bottom: 1px solid rgba(151, 151, 151, 0.2);
        .icon {
          width: 36px;
          height: 36px;
          margin-right: 10px;
          margin-top: -28px;
        }
        .has-apply-right {
          flex: 1;
          .right-top {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
            line-height: 22px;
            height: 22px;
            margin-bottom: 9px;
            .text {
              margin-right: 10px;
            }
          }
          .right-bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .tip {
              height: 18px;
              font-size: 13px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(25, 31, 36, 0.56);
              line-height: 18px;
            }
            .to-complete {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              span {
                font-size: 13px;
                color: #4869dd;
              }
              img {
                width: 12px;
                // height: 16px;
                margin-left: 5px;
              }
            }
          }
        }
      }
      .btn {
        height: 49px;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 0 6px;
        .van-button {
          border: none;
          padding: 0;
        }
      }
    }

    .other-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(225deg, #ffffff 0%, #f9fbfe 100%);
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.09);
      border-radius: 3px;
      height: 48px;
      margin-bottom: 3px;
      padding: 0 10px;
      .left {
        width: 40%;
        display: flex;
        align-items: center;
        img {
          width: 36px;
          height: 36px;
          margin-right: 10px;
        }
        span {
          font-size: 15px;
          color: #191f24;
        }
      }
      .right {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        span {
          font-size: 13px;
          color: #4869dd;
        }
        img {
          margin-left: 5px;
        }
      }
    }

    .apply-btn {
      display: flex;
      width: 100%;
      justify-content: space-between;
      background: #ffffff;
      .van-button {
        width: 100%;
        height: 40px;
        border-radius: 8px;
        &:not(:last-child) {
          margin-right: 16px;
        }
      }
    }

    .line {
      width: 1px;
      background-color: rgb(25, 31, 36, 0.3);
      height: 14px;
      transform: scale(0.5, 1);
    }
  }
  // 我的申请
  .application {
    padding-bottom: 28px;
    .title {
      height: 48px;
      display: flex;
      align-items: center;
      margin: 0 8px;
      justify-content: space-between;
      color: #191f24;
      .label {
        position: relative;
        font-weight: bold;
        font-size: 17px;
        .label-number {
          position: absolute;
          font-size: 13px;
          margin-left: 2px;
          bottom: 2px;
        }
      }
      .more {
        font-size: 14px;
      }
    }
    .applyItem {
      display: flex;
      align-items: center;
      padding: 15px 11px;
      height: 48px;
      background: #ffffff;
      box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.12);
      border-radius: 4px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      justify-content: space-between;
      color: rgba(25, 31, 36, 0.64);
      font-size: 14px;
    }
  }
}
</style>
