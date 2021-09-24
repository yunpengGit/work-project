<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-29 16:06:42
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-09-01 16:27:41
-->
<template>
  <van-skeleton
    title
    avatar
    :row="6"
    round
    :loading="loading"
  >
    <div class="conference-desk-container" v-if="conferenceData">
      <div class="conference-desk-hearder-container">
        <div class="conference-desk-hearder">
          <top
            :routeParams="routeParams"
            :conferenceData="conferenceData"
          />
          <div class="conference-synopsis">
            <dl
              @click="$router.push({
                name: 'detail',
                query: {
                  [$enc('id')]: $enc(routeParams.id)
                }
              })"
            >
              <dt>{{ conferenceData.name }}</dt>
              <dd class="synopsis-date">{{ conferenceData.startTime.slice(0, conferenceData.startTime.length - 3) }} 至 {{ conferenceData.endTime.slice(0, conferenceData.endTime.length - 3) }}</dd>
            </dl>
          </div>
          <ul class="materials">
            <li v-for="(ele, index) in materialsData" :key="index">
              <span
                @click="$router.push({
                  name: ele.link,
                  query: {
                    [$enc('id')]: $enc(routeParams.id)
                  }
                })"
              >{{ ele.text }}</span>
            </li>
          </ul>
          <div class="accompany-container" v-if="myAccompanyData.length">
            <div
              @click="$router.push({
                name: 'myAccompany',
                query: {
                  [$enc('id')]: $enc(routeParams.id),
                  [$enc('attendeeId')]: $enc(attendeeId)
                }
              })"
              class="accompany"
            >
              我的陪同：
              <span
                v-for="(ele, index) in myAccompanyData"
                :key="index"
              >{{ ele.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <stats
        :routeParams="routeParams"
        :conferenceData="conferenceData"
        />
      <div
        class="conference-backlog"
        @click="$router.push({
          name: 'backlog',
          query: {
            [$enc('id')]: $enc(routeParams.id)
          }
        })"
      >
        <h6>待办待阅</h6>
        <i v-if="taskCount > 0">{{ taskCount > 99 ? 99 : taskCount }}</i>
      </div>
      <div class="conference-attendee-manage-container">
        <div v-for="(ele, index) in attendeeManageData" :key="index" class="conference-attendee-manage">
          <div
            v-if="ele.isShow && !ele.isForce"
          >
            <h3>{{ ele.title }}</h3>
            <ul>
              <li
                v-for="(eleChild, indexChild) in menuData(index) "
                :key="indexChild"
                @click="manageLink(eleChild.link, eleChild.paramDate)"
              >
                <img :src="eleChild.src" alt="">
                <div>{{ eleChild.text }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </van-skeleton>
</template>

<script>
import enroll from '@/assets/images/enroll.svg'
import addAttendee from '@/assets/images/addAttendee.svg'
import queryAttendee from '@/assets/images/queryAttendee.svg'
import myFollow from '@/assets/images/myFollow.svg'
import useCar from '@/assets/images/useCar.svg'
import stay from '@/assets/images/stay.svg'
import dinner from '@/assets/images/dinner.svg'
import ticket from '@/assets/images/ticket.svg'
import car from '@/assets/images/car.svg'
import driver from '@/assets/images/driver.svg'
import queryUseCar from '@/assets/images/queryUseCar.svg'
import queryStay from '@/assets/images/queryStay.svg'
import queryDinner from '@/assets/images/queryDinner.svg'
import queryTicket from '@/assets/images/queryTicket.svg'
import signIn from '@/assets/images/signIn.svg'
import checkIn from '@/assets/images/checkIn.svg'
import pick from '@/assets/images/pick.svg'
import conveyor from '@/assets/images/conveyor.svg'
import auditManage from '@/assets/images/auditManage.svg'
import msgPush from '@/assets/images/msgPush.svg'

import top from './top'
import stats from './stats'

export default {
  components: { top, stats },
  props: {
    routeParams: {
      type: Object
    }
  },
  data() {
    return {
      loading: true,
      // 会议详情数据
      conferenceData: null,
      materialsData: [
        { text: '我的安排', link: 'myPlan' },
        { text: '', link: '' },
        { text: '会议资料', link: 'material' },
        { text: '', link: '' },
        { text: '议程信息', link: 'agenda' },
        { text: '', link: '' },
        { text: '常用联系人', link: 'contacts' }
      ],
      attendeeManageData: [
        { title: '参会人管理', isShow: false, data: [
          { conferenceResCode: 'AppSignupManage', isShow: false, link: 'enrollManage', text: '报名管理', src: enroll },
          { conferenceResCode: 'AppAddAttendee', isShow: false, link: 'addAttendee', text: '添加参会人', src: addAttendee },
          { conferenceResCode: 'AppAttendeeManage', isShow: false, link: 'getAttendee', text: '查询参会人', src: queryAttendee },
          { conferenceResCode: 'AppFocusOnAttendee', isShow: false, link: 'getAttent', text: '我的关注', src: myFollow },
          { conferenceResCode: 'AppDriverMange', isShow: false, link: 'manageSignIn', text: '签到管理', paramDate: true, src: checkIn },
          { conferenceResCode: 'AppDriverMange', isShow: false, link: 'manageCheckIn', text: '报到管理', src: signIn }
        ] },
        { title: '会务管理', isShow: false, data: [
          { conferenceResCode: 'BeingPushed', isShow: false, link: 'sendMsg', text: '消息推送', src: msgPush },
          { conferenceResCode: 'AuditManagement', isShow: false, link: 'auditEntrance', text: '审核管理', src: auditManage },
          { conferenceResCode: 'AppCarTask', isShow: false, link: 'manageUseCar', text: '用车管理', paramDate: true, src: useCar },
          { conferenceResCode: 'AppHotelTask', isShow: false, link: 'manageStay', text: '住宿管理', paramDate: true, src: stay },
          { conferenceResCode: 'AppDiningTask', isShow: false, link: 'manageMeal', text: '用餐管理', paramDate: true, src: dinner },
          { conferenceResCode: 'AppCardManage', isShow: false, link: 'manageCard', text: '票证管理', src: ticket },
          { conferenceResCode: 'AppCarManage', isShow: false, link: 'manageCars', text: '车辆管理', src: car },
          { conferenceResCode: 'AppDriverMange', isShow: false, link: 'manageDriver', text: '司机管理', src: driver },
          { conferenceResCode: 'AppPickUp', isShow: false, link: 'airportTransferTaskList', text: '接站任务', paramDate: { type: 1 }, src: pick },
          { conferenceResCode: 'AppPickOut', isShow: false, link: 'airportTransferTaskList', text: '送站任务', paramDate: { type: 2 }, src: conveyor }
        ] },
        { title: '会务查询', isShow: false, isForce: true, data: [
          { conferenceResCode: 'AppConferenceoverview2', isShow: false, link: '', text: '用车查询', src: queryUseCar },
          { conferenceResCode: 'AppConferenceoverview3', isShow: false, link: '', text: '住宿查询', src: queryStay },
          { conferenceResCode: 'AppConferenceoverview4', isShow: false, link: '', text: '用餐查询', src: queryDinner },
          { conferenceResCode: 'AppConferenceoverview5', isShow: false, link: '', text: '票证查询', src: queryTicket }
        ] }
      ],
      // 我的陪同
      myAccompanyData: [],
      attendeeId: null,
      // 待办待阅数量
      taskCount: 0
    }
  },
  computed: {
    // 处理权限菜单
    menuData() {
      return function(index) {
        const menuHandler = []
        this.attendeeManageData[index].data.forEach(ele => {
          if (ele.isShow) {
            menuHandler.push(ele)
          }
        })
        return menuHandler
      }
    }
  },
  created() {
    console.log(this.routeParams)
    // 获取菜单列表
    this.getMenuList()
    // 获取该场会议详情
    this.getConferenceDetail()
    // 获取待办数量
    this.getTaskCount()
    // 获取陪同人员列表
    this.getMyAccompanyList()
  },
  methods: {
    manageLink(link, paramDate) {
      const query = {
        [this.$enc('id')]: this.$enc(this.routeParams.id),
        [this.$enc('attendeeId')]: this.$enc(this.attendeeId)
      }
      if (paramDate) {
        // const startTime = /\d{4}-\d{1,2}-\d{1,2}/g.exec(this.conferenceData.startTime)
        // const endTime = /\d{4}-\d{1,2}-\d{1,2}/g.exec(this.conferenceData.endTime)
        const startTime = this.conferenceData.startTime
        const endTime = this.conferenceData.endTime
        query[this.$enc('startTime')] = this.$enc(startTime)
        query[this.$enc('endTime')] = this.$enc(endTime)
        for (const key in paramDate) {
          query[this.$enc(key)] = this.$enc(paramDate[key])
        }
      }
      this.$router.push({
        name: link,
        query
      })
    },
    // 获取菜单权限
    getMenuList() {
      const id = this.routeParams.id
      this.$api({
        url: 'desk.getMenuList',
        data: {
          conferenceId: id,
          // 1 → PC 2 → APP
          platformType: 2
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result
          for (let i = 0; i < data.length; i++) {
            if (data[i].operateFlag === 1) {
              const conferenceResCode = data[i].conferenceResCode
              this.attendeeManageData.forEach(ele => {
                ele.data.forEach(eleChild => {
                  if (eleChild.conferenceResCode === conferenceResCode) {
                    eleChild.isShow = true
                    ele.isShow = true
                  }
                })
              })
            }
          }
          /* 此为手动增加的报到管理入口，正常应该由接口获取，后续要沟通此问题 */
          // this.attendeeManageData[1].data[6] = {
          //   conferenceResCode: 'AppDriverMange', isShow: true, link: 'manageCheckIn', text: '报到管理', src: driver
          // }
          // this.attendeeManageData[1].data[7] = {
          //   conferenceResCode: 'AppDriverMange', isShow: true, link: 'manageSignIn', text: '签到管理', paramDate: true, src: driver
          // }
          // this.attendeeManageData[1].data[8] = {
          //   conferenceResCode: 'AppAirportTransfer', isShow: true, link: 'airportTransferTaskList', text: '接机任务', paramDate: { type: 1 }, src: driver
          // }
          // this.attendeeManageData[1].data[9] = {
          //   conferenceResCode: 'AppAirportTransfer', isShow: true, link: 'airportTransferTaskList', text: '送机任务', paramDate: { type: 2 }, src: driver
          // }
          console.log(this.attendeeManageData)
        }
      })
    },
    // 获取该场会议详情
    getConferenceDetail() {
      const id = this.routeParams.id
      this.$api({
        url: 'desk.getDetail',
        data: {
          id
        }
      }).then(res => {
        if (res.code === 2000) {
          this.conferenceData = res.result
          document.title = this.conferenceData.name
          // this.$route.meta.title
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 获取待办数量
    getTaskCount() {
      const id = this.routeParams.id
      this.$api({
        url: 'home.taskCount',
        data: {
          conferenceId: id,
          statusEqual: '1'
        }
      }).then(res => {
        if (res.code === 2000) {
          this.taskCount = res.result
        }
      })
    },
    // 获取陪同人员列表
    getMyAccompanyList() {
      const id = this.routeParams.id
      const getId = () => {
        return this.$api({
          url: 'desk.getAttendeeFromMeetingId',
          data: {
            conferenceId: id
          }
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result
            return data ? res.result.id : ''
          }
        })
      }
      const getPlan = id => {
        return this.$api({
          url: 'desk.getAccompany',
          data: {
            attendeeId: id
          }
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result
            data.forEach(ele => {
              this.myAccompanyData.push({ name: ele.attendeeFixAttribute.attendeeName })
            })
          }
        })
      }
      const getInfo = async function() {
        // 先获取id 再通过id获取安排
        const id = await getId()
        if (id) {
          this.attendeeId = id
          getPlan(id)
        }
      }.bind(this)
      getInfo()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.conference-desk-container {
  min-height: 100%;
  background-color: #f8f8f8;
  width: 100%;
  // padding-bottom: 4px;
  .conference-desk-hearder-container {
    background-color: #fff;
  }
  .conference-desk-hearder {
    background: url('../../../../assets/images/conferenceBg.svg') no-repeat top;
    background-size: 100% 126px;
  }
  .conference-synopsis {
    width: 100%;
    padding: 15px 16px 0;
    dl {
      width: 100%;
      height: 110px;
      background: linear-gradient(180deg, #c5eafd 0%, #FFF 88%);
      box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.08);
      border-radius: 12px;
      padding: 0 20px;
      position: relative;
      dt {
        font-size: 16px;
        line-height: 21px;
        font-weight: 500;
        padding: 20px 20px 27px 0;
      }
      dd {
        font-size: 14px;
        line-height: 18px;
        color: rgba(25, 31, 36, 0.72);
      }
      .synopsis-date {
        @include absolute('','',20px,20px);
      }
      &::before {
        content: '';
        display: block;
        width: 80px;
        height: 80px;
        background: url('../../../../assets/images/synopsisCircular.svg') no-repeat;
        @include absolute(10px,12px);
      }
      &::after {
        content: '';
        display: block;
        width: 16px;
        height: 16px;
        background: url('../../../../assets/images/synopsisMore.svg') no-repeat;
        @include absolute(50%,16px);
        transform: translateY(-50%);
        z-index: 2;
      }
    }
  }
  .materials {
    width: 100%;
    padding: 26px 21px 16px;
    @include list(row,space-between,center);
    font-size: 14px;
    color: rgba(30, 137, 255, 1);
    line-height: 20px;
    background-color: #fff;
    li:nth-child(even) {
       width: 1px;
      height: 20px;
      background: rgba(25, 31, 36, 0.12);
    }
    // .materials-line {
    //   display: block;
    //   width: 1px;
    //   height: 20px;
    //   background: rgba(25, 31, 36, 0.12);
    // }
  }
  .accompany-container {
    width: 100%;
    padding: 0 12px 16px;
    background-color: #fff;
    .accompany {
      width: 100%;
      height: 48px;
      line-height: 48px;
      background-color: #F3F6F9;
      border-radius: 8px;
      padding: 0 35px 0 32px;
      position: relative;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 13px;
      color: #191F24;
      font-weight: 500;
      > span {
        font-weight: 400;
      }
      &::before {
        content: '';
        display: block;
        width: 16px;
        height: 16px;
        background: url('../../../../assets/images/accompanyIcon.svg') no-repeat;
        @include absolute(16px,'','',12px);
      }
      &::after {
        content: '';
        display: block;
        width: 16px;
        height: 16px;
        background: url('../../../../assets/images/accompanyArrow.svg') no-repeat;
        @include absolute(16px,8px,'','');
      }
    }
  }
  .conference-backlog {
    width: 100%;
    height: 56px;
    @include list(row,space-between,center);
    padding: 1.5px 46px 0 50px;
    position: relative;
    background-color: #fff;
    &::before {
      content: '';
      display: block;
      width: 24px;
      height: 24px;
      background: url('../../../../assets/images/conferenceBacklog.svg') no-repeat;
      @include absolute(16px,'','',16px);
    }
     &::after {
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      background: url('../../../../assets/images/conferenceBacklogArrow.svg') no-repeat;
      @include absolute(20px,20px,'','');
    }
    > h6 {
      font-size: 17px;
    }
    > i {
      display: block;
      width: 28px;
      height: 20px;
      background-color: rgba(234, 52, 15, 1);
      border-radius: 11px;
      color: #fff;
      font-size: 13px;
      text-align: center;
      line-height: 20px;
    }
  }
  .conference-attendee-manage-container {
    width: 100%;
    background-color: #fff;
    padding: 0 16px;
    margin-top: 12px;
    .conference-attendee-manage {
      // border-top: 1px solid rgba(25, 31, 36, 0.08);
      // padding-bottom: 8px;
      &:nth-of-type(1) {
        border-top: 0;
      }
      h3 {
        font-size: 17px;
        font-weight: 500;
        padding: 16px 0 12px;
      }
      ul {
        border-bottom: 1px solid rgba(25, 31, 36, 0.08);
        li {
          display: inline-block;
          width: 25%;
          padding-bottom: 8px;
          font-size: 13px;
          text-align: center;
          margin-bottom: 8px;
          img {
            margin:12px auto 10px;
          }
        }
      }
    }
  }

}
</style>
