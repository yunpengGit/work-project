<!--
 * @Descripttion:
 * @Author: wanghz
 * @Date: 2021-07-16 15:44:00
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-09-07 16:52:36
-->
<template>
  <div class="home-container">
    <!-- 操作栏 -->
    <div class="tool-bar">
      <div class="conference-name">会议活动大厅</div>
      <div class="tools">
        <img src="@/assets/images/search.svg" alt="" @click="linkSearch" />
        <div class="thin-ling"></div>
        <img src="@/assets/images/scan.svg" alt="" @click="handleScan" />
      </div>
    </div>
    <div class="line"></div>
    <div class="filterfeld">
      <div :class="['my-meeting-check', myMeetingChecked ? 'my-checked' : 'no-checked']">
        <div class="check-box" @click="meetingTypeHandle(myMeetingChecked)">
          <img src="@/assets/images/homeChecked.svg" alt="" v-if="myMeetingChecked" />
          <img src="@/assets/images/homeNoCheck.svg" alt="" v-else />
        </div>
        <span>仅显示我的会议活动</span>
      </div>
      <van-dropdown-menu class="meeting-status-menu" active-color="#3070FF">
        <van-dropdown-item v-model="meetingStatusValue" :options="meetingStatusOptions" @change="meetingStatusHandle">
          <img
            src="@/assets/images/dropChecked.svg"
            alt=""
            :style="{
              top:
                meetingStatusValue === 0
                  ? '14px'
                  : meetingStatusValue === 1
                  ? '60px'
                  : meetingStatusValue === 2
                  ? '102px'
                  : '146px'
            }"
          />
        </van-dropdown-item>
        <img src="@/assets/images/blackArrow.svg" alt="" />
      </van-dropdown-menu>
    </div>
    <div class="meeting-data">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          :immediate-check="false"
          finished-text="没有更多了"
          @load="onLoad"
          class="load"
        >
          <div v-for="ele in meetingData" :key="ele.id" @click="linkDetail(ele.id)" class="meeting-data-item">
            <div class="meeting-data-pic">
              <img :src="ele.coverVOs[0].coverUrl" alt="" />
              <div class="meeting-des">{{ ele.typeStr }}</div>
            </div>
            <dl class="meeting-detail">
              <dt>{{ ele.name }}</dt>
              <dd class="meeting-place">{{ ele.station }}</dd>
              <dd>{{ filterTime(ele.startTime, ele.endTime) }}</dd>
              <div class="apply-status-tips">
                <span class="apply-tip" v-if="isDuringDate(ele.signStartTime, ele.signEndTime)">可报名</span>
                <span
                  :class="
                    ele.conferenceStatus === 2
                      ? 'status-unstart'
                      : ele.conferenceStatus === 3
                      ? 'status-ongoing'
                      : ele.conferenceStatus === 1
                      ? 'status-finished'
                      : ''
                  "
                  >{{ ele.conferenceStatusStr }}</span
                >
              </div>
            </dl>
          </div>
          <van-empty v-if="!meetingData.length" :image="dataNull" description="这里什么都没有哦！" />
        </van-list>
      </van-pull-refresh>
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
        <p>下次打开应用可直接进入本次选择的<br />会议活动，无需再次选择</p>
        <div class="meeting-choice-storage" :class="rememberFlag ? 'checked' : ''" @click="rememberChoice">
          <div class="meeting-choice-storage-status"><van-icon name="passed" /></div>
          <div>今后不再提示</div>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import dataNull from '@/assets/images/dataNull.png'
import ScanCodeMixin from '@/mixins/scanCode'
export default {
  mixins: [ScanCodeMixin],
  data() {
    return {
      dataNull,
      dialogShow: false,
      myMeetingChecked: false, // 仅显示我的会议活动复选框
      meetingStatusValue: 0,
      meetingStatusOptions: [
        { text: '全部', value: 0 },
        { text: '进行中', value: 1 },
        { text: '未开始', value: 2 },
        { text: '已结束', value: 3 }
      ],
      // 是否记住选择
      rememberFlag: false,
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
      // 默认url为会议大厅
      url: 'attendeeApi.meetingList',
      // 添加加载开关，以免对此重复请求接口
      scrollFlag: true
    }
  },
  created() {
    // 将用户选择的[仅显示我的会议活动]复选框结果进行存储
    const checkStr = sessionStorage.getItem('myMeetingChecked')
    if (checkStr) {
      this.myMeetingChecked = checkStr === 'true'
      this.url = checkStr === 'true' ? 'attendeeApi.myMeetingList' : 'attendeeApi.meetingList'
    }
    this.getList()
  },
  methods: {
    // 判断当前时间是否可报名
    isDuringDate(beginDateStr, endDateStr) {
      var curDate = new Date()
      var beginDate = new Date(beginDateStr)
      var endDate = new Date(endDateStr)
      if (curDate >= beginDate && curDate <= endDate) {
        return true
      }
      return false
    },
    // 将时间2021-08-25 18:00:00 处理为 2021.08.25 18:00
    filterTime(start, end) {
      const startTime = start.replace(/-/g, '.').slice(0, 16)
      let endTime = end.replace(/-/g, '.').slice(0, 16)
      if (startTime.slice(0, 4) === endTime.slice(0, 4)) {
        // 如果年份相同则截止日期年份不显示
        endTime = endTime.slice(5, endTime.length)
      }
      return `${startTime} - ${endTime}`
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
      // this.pageNum++
      this.getList()
    },
    // 上拉加载
    onLoad() {
      this.pageNum++
      this.loading = true
      this.getList('up')
    },

    // 获取用户信息
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

    // 我的会议活动
    async getList(type = 'up') {
      if (this.scrollFlag) {
        this.scrollFlag = false
        // type : up → 上拉加载 / down → 下拉加载
        const data = {
          pageNum: this.pageNum === 0 ? ++this.pageNum : this.pageNum,
          pageSize: this.pageSize,
          // sortStatus字段我也不知什么规则 接口文档没说明 参考老代码复制过来的
          sortStatus: 'desc',
          conferenceStatusEqual: this.conferenceStatusEqual
        }
        if (this.url === 'attendeeApi.meetingList') {
          const userInfo = await this.getUserInfo()
          data.userId = userInfo.id
        }
        this.$api({
          url: this.url,
          data
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result.list
            data.forEach(ele => {
              type === 'down' ? this.meetingData.unshift(ele) : this.meetingData.push(ele)
            })
            this.isLoading = false
            this.loading = false
            this.scrollFlag = true
            // 最大可分页的数量
            const maxPageSize = Math.ceil(res.result.total / this.pageSize)
            if (this.pageNum === maxPageSize) {
              this.finished = true
            } else {
              this.finished = false
            }
          }
        })
      }
    },
    // 选择会议类型
    meetingTypeHandle(value) {
      this.myMeetingChecked = !this.myMeetingChecked
      sessionStorage.setItem('myMeetingChecked', this.myMeetingChecked)
      this.url = !value ? 'attendeeApi.myMeetingList' : 'attendeeApi.meetingList'
      this.meetingData = []
      this.pageNum = 0
      this.getList()
    },

    // 选择会议状态
    meetingStatusHandle(value) {
      // 1未发布 2未开始 3进行中 4已结束 5已取消
      if (value === 0) {
        this.conferenceStatusEqual = '2,3,4'
      } else if (value === 1) {
        this.conferenceStatusEqual = '3'
      } else if (value === 2) {
        this.conferenceStatusEqual = '2'
      } else {
        this.conferenceStatusEqual = '4'
      }
      this.meetingData = []
      this.pageNum = 0
      this.getList()
    },

    // 跳转会议详情页
    async linkDetail(id) {
      // this.dialogShow = true
      const userInfo = await this.getUserInfo()
      const userId = userInfo.id
      this.$api({
        url: 'attendeeApi.jumpInSuccessVertify',
        data: {
          conferenceId: id,
          userId
        }
      }).then(res => {
        if (res.success) {
          if (Number(res.result) === 1) {
            // 可以进入9宫格
            this.$router.push({
              name: 'conferenceHomePage',
              query: {
                [this.$enc('conferenceId')]: this.$enc(id)
              }
            })
          } else {
            // 进入详情页
            this.$router.push({
              name: 'conferenceDetail',
              query: {
                [this.$enc('conferenceId')]: this.$enc(id)
              }
            })
          }
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
  background-color: #fff;
  .tool-bar {
    display: flex;
    height: 52px;
    padding: 0 16px;
    @include list(row, space-between, center);
    .conference-name {
      font-size: 20px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #000000;
    }
    .tools {
      width: 137px;
      height: 38px;
      border-radius: 19px;
      background: linear-gradient(right, #f5f7fd, #e8ecf9);
      padding: 0 14px;
      @include list(row, space-around, center);
      .thin-ling {
        width: 1px;
        height: 18px;
        background-color: #979797;
      }
    }
  }
  .line {
    border-bottom: 1px solid #ebecec;
    height: 7px;
  }
  .filterfeld {
    display: flex;
    height: 52px;
    padding: 0 24px 0 16px;
    @include list(row, space-between, center);
    .my-meeting-check {
      font-size: 16px;
      display: flex;
      align-items: center;
      .check-box {
        margin-right: 9px;
        padding-top: 0px;
      }
      span {
        height: 22px;
        font-size: 16px;
        line-height: 22px;
      }
    }
    .my-checked {
      color: #191f24;
    }
    .no-checked {
      color: #7c7d7f;
    }
    .meeting-status-menu {
      position: relative;
      background-color: rgba(255, 255, 255, 0);
      img {
        position: absolute;
        top: 16px;
        right: -8px;
      }
      .van-dropdown-menu__title--active {
        color: #000 !important;
      }
      .van-dropdown-item__content {
        border-radius: 0px 0px 8px 8px;
        position: relative;
        img {
          position: absolute;
          left: 140px;
        }
        .van-cell {
          height: 44px;
          background: #f2f5fc;
          position: relative;
        }
      }
      .van-dropdown-menu__bar {
        box-shadow: none;
        background-color: rgba(255, 255, 255, 0);
      }
      .van-dropdown-menu__title::after {
        display: none;
      }
      .van-dropdown-menu__title {
        color: #000000;
        font-size: 16px;
      }
      .van-dropdown-item__option--active {
        // font-weight: 700;
      }
      .van-cell__title {
        position: absolute;
        left: 166px;
        font-size: 16px;
      }
      .van-cell__value {
        display: none;
      }

      .van-ellipsis {
        margin-right: 5px;
      }
    }
  }
  .meeting-data {
    background-color: #fff;
    width: 100%;
    position: fixed;
    left: 0;
    top: 111px;
    height: calc(100% - 111px);
    overflow: auto;
    .load {
      margin: 0 16px;
    }
    .meeting-data-item {
      width: 100%;
      // border: 1px solid red;
      margin-bottom: 10px;
      .meeting-data-pic {
        width: 100%;
        height: 157px;
        overflow: hidden;
        position: relative;
        border-radius: 4px;
        img {
          width: 100%;
          position: absolute;
          z-index: 1;
          border-radius: 4px;
        }
        .meeting-current-status {
          width: 71px;
          height: 20px;
          text-align: center;
          line-height: 20px;
          font-size: 12px;
          color: #fff;
          @include absolute(0, '', '', 0, 2);
          border-radius: 0 6px 14px 0;
        }
        .meeting-current-status-unstart {
          background-color: #0f6ad9;
        }
        .meeting-current-status-ongoing {
          background-color: #009f15;
        }
        .meeting-current-status-finished {
          background-color: rgba(0, 0, 0, 0.12);
        }
        .meeting-des {
          position: absolute;
          z-index: 999;
          text-align: center;
          padding: 0 10px;
          height: 19px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 3px;
          line-height: 19px;
          font-size: 12px;
          color: #fff;
          bottom: 14px;
          left: 10px;
        }
      }
      .meeting-detail {
        position: relative;
        width: 100%;
        padding: 5px 0 14px 0;
        .meeting-place {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
        }
        dt {
          font-size: 18px;
          font-weight: 600;
          line-height: 25px;
          margin: 5px 0 6px;
        }
        dd {
          font-size: 14px;
          height: 16px;
          color: rgba(25, 31, 36, 0.72);
          line-height: 16px;
          margin-bottom: 6px;
        }
        .apply-status-tips {
          position: absolute;
          right: 0;
          bottom: 20px;
          span {
            display: inline-block;
            height: 19px;
            line-height: 19px;
            text-align: center;
            padding: 0 5px;
            border-radius: 3px;
            font-size: 12px;
          }
          .apply-tip {
            background: #ffefe0;
            color: #ff6c19;
            margin-right: 4px;
          }
          .status-unstart {
            background: #e5ebff;
            color: #1652f7;
          }
          .status-ongoing {
            background: #ffefe0;
            color: #ff6c19;
          }
          .status-finished {
            background: #e8e8e9;
            color: #848484;
          }
        }
      }
    }
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
      @include list(row, center, center);
      font-size: 15px;
      color: rgba(25, 31, 36, 1);
      padding-bottom: 20px;
      .meeting-choice-storage-status {
        @include list(row, center, center);
        font-size: 20px;
        margin-right: 2px;
      }
    }
  }
  .van-empty__image {
    width: 176px;
    height: 103px;
  }
}
</style>
