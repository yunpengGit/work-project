<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-24 10:07:18
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-09-07 18:38:50
-->
<!-- home -->
<template>
  <div class="home-container">
    <div class="meeting-header">
      <van-search
        v-model="searchVal"
        disabled
        show-action
        shape="round"
        background="#fff"
        placeholder="搜索会议活动"
        @click="linkSearch"
      >
        <template #action>
          <div @click="handelScanCode(0)" style="display:none"><img src="@/assets/images/scanCode.svg" alt=""></div>
        </template>
      </van-search>
      <div class="pending-meeting">
        <van-cell value="查看" is-link @click="$router.push('backlog')">
          <template #title>
            <span class="subhead">您有 <span class="meeting-num">{{taskNum}}</span> 件会务工作待处理</span>
          </template>
        </van-cell>
      </div>
      <div class="meeting-type">
        <div
          v-for="(ele, index) in meetingTypeData"
          :key="ele.text"
          class="meeting-type-item"
          :class="ele.checked ? 'meeting-type-item-checked' : ''"
          @click="meetingTypeHandle(index)"
        >
          {{ ele.text }}
        </div>
      </div>
    </div>
    <div class="meeting-data" :class="isOnline ? '' : 'meeting-data-online'">
      <div class="meeting-status meeting-status-null" v-if="!meetingData.length">
        <div
          v-for="(ele, index) in meetingStatusData"
          :key="ele.text"
          class="meeting-status-item"
          :class="ele.checked ? 'meeting-status-item-checked' : ''"
          @click="meetingStatusHandle(index)"
        >
          {{ ele.text }}
        </div>
      </div>
      <van-pull-refresh v-if="meetingData.length" v-model="isLoading" @refresh="onRefresh" style="height: 100%">
        <van-list
          v-model="loading"
          :finished="finished"
          :immediate-check="false"
          :finished-text="finishedText"
          @load="onLoad"
          class="load"
          >
          <div class="meeting-status">
            <div
              v-for="(ele, index) in meetingStatusData"
              :key="ele.text"
              class="meeting-status-item"
              :class="ele.checked ? 'meeting-status-item-checked' : ''"
              @click="meetingStatusHandle(index)"
            >
              {{ ele.text }}
            </div>
          </div>
          <div class="meeting-data-item-container">
            <div
              v-for="ele in meetingData"
              :key="ele.id"
              class="meeting-data-item"
            >
              <div class="meeting-data-pic" @click="linkDetail(ele.id)">
                <img :src="ele.coverVOs[0].downloadUrl" alt="">
                <div
                  class="meeting-current-status"
                  :class="ele.conferenceStatus === 2 ? 'meeting-current-status-unstart' : ele.conferenceStatus === 3 ? 'meeting-current-status-ongoing' : ele.conferenceStatus === 1 ? 'meeting-current-status-finished' : ''"
                >
                  <img :src="ele.conferenceStatus === 2 ? unstartIcon : ele.conferenceStatus === 3 ? ongoingIcon : ele.conferenceStatus === 1 ? finishedIcon : ''" alt="">
                  <span>{{ ele.conferenceStatusStr }}</span>
                </div>
                <div class="meeting-des">{{ ele.typeStr }}</div>
              </div>
              <dl class="meeting-detail">
                <dt>{{ ele.name }}</dt>
                <dd><span>会议时间：</span>{{ ele.startTime.slice(0, ele.startTime.length - 3) }} 至 {{ ele.endTime.slice(0, ele.endTime.length - 3) }}</dd>
                <dd><span>会议场所：</span>{{ ele.station }}</dd>
                <dd><span>报名时间：</span>{{ ele.signStartTime ? ele.signStartTime.slice(0, ele.signStartTime.length - 3) : '-' }} 至 {{ ele.signEndTime ? ele.signEndTime.slice(0, ele.signEndTime.length - 3) : '-' }}</dd>
              </dl>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
      <van-empty
        v-if="!meetingData.length"
        :image="dataNull"
        description="这里什么都没有哦！"
      />
    </div>
    <van-dialog
      v-model="dialogShow"
      title="是否记住本次选择的会议活动？"
      show-cancel-button
      class="customDialog"
      confirm-button-text="记住选择"
      cancel-button-text="取消"
      @confirm="rememberChoiceHandle"
    >
      <div class="meeting-choice-tips">
        <p>下次打开应用可直接进入本次选择的<br/>会议活动，无需再次选择</p>
        <div class="meeting-choice-storage" :class="rememberFlag ? 'checked' : ''" @click="rememberChoice">
           <div class="meeting-choice-storage-status"><van-icon name="passed" /></div>
          <div>今后不再提示</div>
        </div>
      </div>
    </van-dialog>
    <div class="single-btn-bottom" v-if="isOnline">
      <van-button
        type="info"
        @click="$router.push({
          name: 'buildMeet',
          query: {}
        })"
      >创建会议</van-button>
    </div>
  </div>
</template>

<script>
import dataNull from '@/assets/images/dataNull.png'
import ScanCodeMixin from '@/mixins/scanCode'
import unstartIcon from '@/assets/images/unstart.svg'
import ongoingIcon from '@/assets/images/ongoing.svg'
import finishedIcon from '@/assets/images/finished.svg'

export default {
  mixins: [ScanCodeMixin],
  data() {
    return {
      // 临时参数 等待创建会议完成后相关isOnline都要删除
      isOnline: false,
      unstartIcon, ongoingIcon, finishedIcon,
      finishedText: '没有更多了',
      dataNull,
      dialogShow: false,
      // 是否记住选择
      rememberFlag: false,
      // 搜索内容
      searchVal: '',
      // 待处理会务工作数量
      taskNum: '0',
      meetingTypeData: [
        { text: '我的会议活动', checked: true },
        { text: '会议活动大厅', checked: false }
      ],
      // 我的会议活动 / 会议活动大厅的当前选中值 - 默认为0
      // meetingType: 0,
      // 会议状态 - 全部 / 进行中 / 未开始 / 已结束
      meetingStatusData: [
        { text: '全部', checked: true },
        { text: '进行中', checked: false },
        { text: '未开始', checked: false },
        { text: '已结束', checked: false }
      ],
      // 全部 / 进行中 / 未开始 / 已结束 - 默认为0
      meetingStatusType: 0,
      // 会议列表数据
      meetingData: [],
      // 下拉时是否处于加载状态
      isLoading: false,
      // 每次onload需要先将loading设为true 请求完接口再设置为false
      loading: false,
      // 所有数据已经请求完毕
      finished: false,
      pageNum: 0,
      pageSize: 10,
      // 1未发布 2未开始 3进行中 4已结束 5已取消
      conferenceStatusEqual: '2,3,4',
      // 默认url为我的会议活动
      url: 'home.myMeetingList',
      // 添加加载开关，以免对此重复请求接口
      scrollFlag: true
    }
  },
  computed: {},
  created() {
    if (!sessionStorage.getItem('userBasicInfo')) {
      this.$api({
        url: 'user.userInfo'
      }).then(res => {
        const data = res.result
        const userBasicInfo = {
          name: data.ssoUserName,
          mobile: data.mobile ? data.mobile.slice(-4) : ''
        }
        sessionStorage.setItem('userBasicInfo', `${userBasicInfo.name}  ${userBasicInfo.mobile}`)
      })
    }
    this.getList()
    this.$api({
      url: 'home.taskNum',
      data: {
        statusEqual: 1
      }
    }).then(res => {
      if (res.code === 2000) {
        const taskNum = res.result
        this.taskNum = taskNum > 99 ? '99+' : taskNum
      }
    })
  },
  methods: {
    aa() {
      const jsapi = new JsApi()
      alert(jsapi.checkEnvironment())
      jsapi.addressBook({
        appId: 'd11d727a3455427', // 必填，第三方的唯一标识
        type: 2, // 1 单选；2 多选，默认为1
        maxNum: 50,
        authLevel: 1,
        success: function(res) {
          alert('成功')
          alert(JSON.stringify(res))
        },
        fail: function(err) {
          alert('err')
          alert(JSON.stringify(err))
        }
      })
    },
    // 记住选择的文字展示
    rememberChoice() {
      this.rememberFlag = !this.rememberFlag
    },
    rememberChoiceHandle() {
      // localStorage.setItem('isToMeeting', '1')
      // console.log(localStorage.getItem('isToMeeting'))
    },
    // 下拉加载
    onRefresh() {
      this.pageNum++
      this.getList('down')
    },
    // 上拉加载
    onLoad() {
      this.pageNum++
      this.loading = true
      this.getList('up')
    },
    // 我的会议活动
    getList(type = 'up') {
      if (this.scrollFlag) {
        if (type === 'down') {
          window.location.reload()
          // window.location.reload()
          return false
        }
        this.scrollFlag = false
        // type : up → 上拉加载 / down → 下拉加载
        const data = {
          pageNum: this.pageNum === 0 ? ++this.pageNum : this.pageNum,
          pageSize: this.pageSize,
          // sortStatus字段我也不知什么规则 接口文档没说明 参考老代码复制过来的
          sortStatus: 'desc',
          conferenceStatusEqual: this.conferenceStatusEqual
        }
        if (this.url === 'home.meetingList') {
          // const userInfo = JSON.parse(localStorage.getItem('userInfo'))
          // console.log(userInfo)
          // const userId = userInfo.id
          // data.userId = userId
        }
        this.$api({
          url: this.url,
          data
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result.list
            data.forEach(ele => {
              this.meetingData.push(ele)
              // type === 'down' ? this.meetingData.unshift(ele) : this.meetingData.push(ele)
            })
            this.isLoading = false
            this.loading = false
            this.scrollFlag = true
            // 最大可分页的数量
            const maxPageSize = Math.ceil(res.result.total / this.pageSize)
            if (this.pageNum >= maxPageSize) {
              this.finished = true
            }
            if (!data.length) {
              this.finishedText = ''
            }
          }
        })
      }
    },
    // 选择会议类型
    meetingTypeHandle(index) {
      // 当前选中的不允许点击
      if (this.meetingTypeData[index].checked) {
        return
      }
      // this.meetingType = index
      this.meetingTypeData.forEach(ele => {
        ele.checked = false
      })
      this.finished = false
      this.meetingTypeData[index].checked = true
      this.url = index === 0 ? 'home.myMeetingList' : 'home.meetingList'
      this.meetingStatusHandle(0, true)
      // this.pageNum = 0
      // this.meetingData = []
      // this.getList()
    },
    // 选择会议状态
    meetingStatusHandle(index, isForce = false) {
      // 当前选中的不允许点击
      if (!isForce && this.meetingStatusData[index].checked) {
        return
      }
      this.meetingStatusType = index
      // 1未发布 2未开始 3进行中 4已结束 5已取消
      this.conferenceStatusEqual = index === 0 ? '2,3,4' : index === 1 ? '3' : index === 2 ? '2' : index === 3 ? '4' : '2,3,4'
      this.meetingStatusData.forEach(ele => {
        ele.checked = false
      })
      this.finished = false
      this.meetingStatusData[index].checked = true
      this.meetingData = []
      this.pageNum = 0
      this.getList()
    },
    // 跳转会议详情页
    linkDetail(id) {
      // this.dialogShow = true
      this.$router.push({
        name: 'conferenceDesk',
        query: {
          [this.$enc('id')]: this.$enc(id)
        }
      })
    },
    // 跳转搜索页
    linkSearch() {
      this.$router.push('search')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.home-container::v-deep {
  min-height: 100%;
  background-color: #f8f8f8;
  min-height: 100%;
  background-color: rgba(25, 31, 36, 0);
  .meeting-header {
    box-shadow: 0px 1px 8px 0px rgba(25, 31, 36, 0.12), 0px 0px 0px 0px rgba(25, 31, 36, 0.08);
  }
  .pending-meeting {
    .van-cell {
      font-size: 14px;
      height: 36px;
      line-height: 36px;
      padding-top: 0;
      padding-bottom: 0;
      background-color: #EBF8FF;
      .van-cell__title {
        white-space: nowrap;
        color: #191F24;
      }
      .van-cell__value, .van-cell__right-icon, .meeting-num {
        color: #1E89FF;
      }
      .van-cell__left-icon, .van-cell__right-icon {
        line-height: 36px;
      }
    }
  }
  .meeting-type {
    width: 100%;
    overflow: hidden;
    background-color: #fff;
    position: relative;
    z-index: 2;
    border-top: 1px solid rgba(25, 31, 36, 0.08);
    .meeting-type-item {
      float: left;
      width: 50%;
      line-height: 56px;
      text-align: center;
      font-size: 17px;
      font-weight: 500;
      color: rgba(25, 31, 36, 0.48);
      &:nth-of-type(1) {
        position: relative;
        &::after {
          content: '';
          display: block;
          width: 1px;
          height: 20px;
          background-color: rgba(25, 31, 36, 0.08);
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
    .meeting-type-item-checked {
      color: #1E89FF;
    }
  }
  .meeting-data {
    width: 100%;
    // padding: 0 16px;
    position: fixed;
    left: 0;
    top: 147px;
    height: calc(100% - 147px);
    padding-bottom: 64px;
    .meeting-status {
      width: 100%;
      height: 68px;
      padding: 10px 0;
      font-size: 12px;
      @include list(row,flex-start,center);
      background-color: rgba(255, 255, 255, 0);;
      position: relative;
      z-index: 1;
      .meeting-status-item {
        height: 30px;
        line-height: 30px;
        padding: 0 16px;
        background-color: rgba(25, 31, 36, 0.04);
        text-align: center;
        margin-left: 12px;
        color: rgba(25, 31, 36, 0.8);
        border-radius: 15px;
        &:nth-of-type(1) {
          margin-left: 0;
        }
      }
      .meeting-status-item-checked {
        color: #fff;
        background-color: #1E89FF;
      }
    }
    .meeting-status-null {
        padding: 0 16px;
      }
    .van-pull-refresh {
      padding: 0 16px;
      overflow-y: scroll;
      height: calc(100% - 147px);
    }
    .meeting-data-item {
      overflow: hidden;
      width: 100%;
      border-radius: 8px;
      box-shadow: 0px 4px 32px 0px rgba(0, 0, 0, 0.12);
      margin-bottom: 20px;
      &:nth-last-of-type(1) {
        margin-bottom: 0;
      }
      .meeting-data-pic {
        width: 100%;
        height: 157px;
        overflow: hidden;
        position: relative;
        > img {
          width: 100%;
          position: absolute;
          z-index: 1;
        }
        .meeting-current-status {
          width: 71px;
          height: 20px;
          // text-align: center;
          line-height: 20px;
          font-size: 12px;
          color: #fff;
          @include absolute(0, '', '', 0, 2);
          border-radius: 0 6px 14px 0;
          @include list(row,flex-start,center);
          img {
            margin:  0 2px 0 7px;
          }
        }
        .meeting-current-status-unstart {
          background: url('../../../../assets/images/unstartBg.svg') no-repeat;
          background-color: #0F6AD9;
        }
        .meeting-current-status-ongoing {
          background: url('../../../../assets/images/ongoingBg.svg') no-repeat;
          // background-color: #009F15;
        }
        .meeting-current-status-finished {
          background: url('../../../../assets/images/finishBg.svg') no-repeat;
          // background-color: rgba(0, 0, 0, 0.12);
        }
        .meeting-des {
          width: 100%;
          height: 60px;
          color: #fff;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%);
          @include absolute('', '', 0, 0, 2);
          line-height: 85px;
          padding: 0 16px;
          font-size: 14px;
        }
      }
      .meeting-detail {
        width: 100%;
        // padding: 16px;
        padding: 16px 10px 16px 16px;
        background-color: #fff;
        dt {
          font-size: 17px;
          line-height: 20px;
          font-weight: 500;
          margin: 5px 0 6px;
        }
        dd {
          color: rgba(25, 31, 36, 0.48);
          font-size: 12px;
          line-height: 15px;
          margin-bottom: 4px;
          span {
            color: rgb(25, 31, 36);
          }
        }
      }
    }
  }
  .meeting-data-online {
    padding-bottom: 0;
  }
  .meeting-choice-tips {
    padding: 0 22px;
    p {
      font-size: 15px;
      line-height: 23px;
      text-align: center;
      margin: 12px 0;
    }
    .meeting-choice-storage {
      @include list(row,center,center);
      font-size: 15px;
      color: rgba(25, 31, 36, 1);
      padding-bottom: 20px;
      .meeting-choice-storage-status {
        @include list(row,center,center);
        font-size: 20px;
        margin-right: 2px;
      }
    }
  }
  .van-empty__image {
    width: 176px;
    height: 103px;
  }
  .single-btn-bottom {
    position: fixed;
    background-color: #fff;
    z-index: 9;
    @include list(row, space-between,center);
    .van-button {
      width: 100%;
    }
    .van-button__text {
      font-size: 15px;
    }
  }
}
</style>
