<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-30 14:21:33
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-30 13:41:33
-->
<template>
  <ul class="conference-time">
    <li class="title-content">
      <div @click="sideShow"><img src="@/assets/images/expandMore.svg" alt=""></div>
      <div class="time" :class="conferenceStatus.status === 3 ? 'time-checked' : ''">
        <span v-if="conferenceStatus.status === 1 && conferenceStatus.type === 'days'">
          距活动开始还有 <span class="bold">{{ conferenceStatus.time.days }}</span> 天
        </span>
        <span v-else-if="conferenceStatus.status === 1 && conferenceStatus.type === 'hours'">
          距活动开始还有 <span class="bold">{{ conferenceStatus.time.hours }}</span> 小时 <span class="bold">{{ conferenceStatus.time.minutes }}</span> 分钟
        </span>
        <span v-else-if="conferenceStatus.status === 1 && conferenceStatus.type === 'minutes'">
          距活动开始还有 <span class="bold">{{ conferenceStatus.time.minutes }}</span> 分钟
        </span>
        <span v-else-if="conferenceStatus.status === 3">会议已结束</span>
        <span v-else>会议活动第 <span class="bold">{{ conferenceStatus.timeBeen }}</span> 天，距离结束还有 <span class="bold">{{ conferenceStatus.timeFinish }}</span> 天</span>
      </div>
    </li>
    <li class="scan-code-container">
      <div @click="sideShowHandle" class="qr-code">
        <img src="@/assets/images/qrCode.svg" alt="">
      </div>
      <div class="scan-code" @click="handelScanCode"><img src="@/assets/images/scanCode.svg" alt=""></div>
    </li>
    <van-action-sheet
      v-model="actionShow"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @cancel="actionCancel"
      @select="actionSelect"
    />
    <van-popup v-model="sidePopupShow" position="left" :style="{ width: '315px',height:'100%' }" round>
      <div class="conference-records">
        <div class="conference-records-content">
          <div class="records">
            <h3>近期会议活动</h3>
              <van-cell-group>
                <van-cell
                  v-for="(ele, index) in recordsNearData"
                  :key="index"
                  :title="ele.name"
                  is-link
                  @click="reloadPage(ele.id)"
                />
              </van-cell-group>
          </div>
          <div class="records">
            <h3>往期会议活动</h3>
            <van-cell-group>
              <van-cell
                v-for="(ele, index) in recordsPastData"
                :key="index"
                :title="ele.name"
                is-link
                @click="reloadPage(ele.id)"
              />
            </van-cell-group>
          </div>
        </div>
        <div class="records-btn">
          <van-button icon="arrow-left" type="info" @click="$router.push('home')">返回会议活动大厅</van-button>
          <van-button @click="sidePopupShow = false">关闭</van-button>
        </div>
      </div>
    </van-popup>
  </ul>
</template>

<script>
import ScanCodeMixin from '@/mixins/scanCode'
export default {
  mixins: [ScanCodeMixin],
  props: {
    conferenceData: {
      type: Object
    },
    routeParams: {
      type: Object
    }
  },
  data() {
    return {
      // 近期活动会议
      recordsNearData: [],
      // 往期活动会议
      recordsPastData: [],
      actions: [{ name: '会议二维码', id: 1 }, { name: '会议报到码', id: 2 }],
      // 二维码弹出窗
      actionShow: false,
      // 侧边栏弹出层
      sidePopupShow: false
    }
  },
  computed: {
    // 会议状态
    conferenceStatus() {
      // 1 → 未开始 / 2 → 进行中 / 3 → 已结束
      const startTime = new Date(this.$format(this.conferenceData.startTime)).getTime()
      const endTime = new Date(this.$format(this.conferenceData.endTime)).getTime()
      const startDate = new Date(`${this.conferenceData.startTime.slice(0, 10)}`).getTime()
      const endDate = new Date(`${this.conferenceData.endTime.slice(0, 10)}`).getTime()
      const nowTime = new Date()
      const nowDateStr = `${nowTime.getFullYear()}-${(nowTime.getMonth() + 1) < 10 ? `0${nowTime.getMonth() + 1}` : nowTime.getMonth() + 1}-${(nowTime.getDate()) < 10 ? `0${nowTime.getDate()}` : nowTime.getDate()} ${nowTime.getHours()}:${(nowTime.getMinutes()) < 10 ? `0${nowTime.getMinutes()}` : nowTime.getMinutes()}:${(nowTime.getSeconds()) < 10 ? `0${nowTime.getSeconds()}` : nowTime.getSeconds()}`
      const nowDate = new Date(nowDateStr).getTime()
      const oneDay = 1 * 24 * 60 * 60 * 1000
      let result = {}
      if (nowTime < startTime) {
        // 未开始 如果距离开始时间不到1天 显示距离的小时：分钟；如果距离开始时间大于1天 显示距离的天数
        const dateDiffer = startTime - nowDate
        let dateDifferVal = ''
        let type = ''
        if (dateDiffer < oneDay) {
          const dateDifferDetail = new Date(dateDiffer)
          const hours = Math.floor(dateDifferDetail / (60 * 60 * 1000))
          const minutes = Math.floor(dateDifferDetail / (60 * 1000) % 60)
          if (hours === 0) {
            dateDifferVal = { minutes }
            type = 'minutes'
          } else {
            dateDifferVal = { hours, minutes }
            type = 'hours'
          }
        } else {
          const dateDiffer = Math.ceil((startDate - nowTime) / oneDay)
          dateDifferVal = { days: dateDiffer }
          type = 'days'
        }
        result = { status: 1, type, time: dateDifferVal }
      } else if (nowTime.getTime() > startTime && nowTime.getTime() < endTime) {
        // 进行中
        result = { status: 2, timeBeen: Math.ceil((nowTime.getTime() - startDate) / oneDay), timeFinish: Math.ceil((endDate - nowTime.getTime()) / oneDay) }
      } else {
        // 已结束
        result = { status: 3 }
      }
      return result
    }
  },
  created() {
  },
  methods: {
    // 展示action
    sideShowHandle() {
      this.actionShow = true
    },
    actionCancel() {
      this.actionShow = false
    },
    actionSelect(item) {
      this.$router.push({
        name: 'enterCode',
        query: {
          [this.$enc('id')]: this.$enc(this.routeParams.id),
          [this.$enc('type')]: this.$enc(item.id)
        }
      })
      console.log(item.id)
    },
    // 顶部查看当前会议 / 往期会议
    sideShow() {
      this.sidePopupShow = true
      if (this.recordsNearData.length || this.recordsPastData.length) {
        return
      }
      // 近期会议活动
      const dataNear = {
        conferenceStatusEqual: '2,3',
        sortStatus: 'desc'
      }
      this.$api({ url: 'home.myMeetingList', data: dataNear }).then(res => {
        if (res.code === 2000) {
          const data = res.result.list
          this.recordsNearData = data
        }
      })
      // 往期会议活动
      const dataPast = {
        conferenceStatusEqual: '4',
        sortStatus: 'desc'
      }
      this.$api({ url: 'home.myMeetingList', data: dataPast }).then(res => {
        if (res.code === 2000) {
          const data = res.result.list
          this.recordsPastData = data
        }
      })
    },
    // 选择会议并刷新当前页面
    reloadPage(id) {
      this.$router.replace({
        name: 'conferenceDesk',
        query: {
          [this.$enc('id')]: this.$enc(id)
        }
      })
      window.location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.conference-time {
  width: 100%;
  padding: 14px 78px 14px 14px;
  color: #fff;
  font-size: 13px;
  position: relative;

  .scan-code-container {
    width: 64px;
    @include absolute(14px, 14px,);
  }
  li {
    @include list(row,flex-start,center);
    .time {
      height: 20px;
      margin: -1px 0 0 12px;
      line-height: 20px;
      white-space: nowrap;
      text-overflow: ellipsis;
      // height: 20px;
      overflow: hidden;
      flex: 1;
      // line-height: 21px;
      .bold {
        font-size: 18px;
        font-weight: 600;
        position: relative;
        top: 2px;
      }
    }
    .time-checked {
      margin-top: 0;
    }
    .qr-code {
      width: 20px;
    }
    .scan-code {
      width: 20px;
      margin-left: 24px;
      position: relative;
      &::after {
        content: '';
        display: block;
        width: 1px;
        height: 20px;
        background-color: rgba(255, 255, 255, 0.24);
        @include absolute(50%,'','',-12px);
        transform: translateY(-50%);
      }
    }
  }
  .conference-records {
    width: 100%;
    height: 100%;
    padding-bottom: 50px;
    position: absolute;
    left: 0;
    top: 0;
  .conference-records-content {
      height: 100%;
      overflow-y: scroll;
    }
    h3 {
      height: 40px;
      line-height: 40px;
      background-color: #f8f8f8;
      // background-color: #eee;
      color: rgba(25, 31, 36, 0.64);
      padding-left: 16px;
    }
    .records-btn {
      width: 100%;
      height: 50px;
      @include absolute('','',0,0);
      .van-button {
        height: 100%;
        border-radius: 0;
        &:nth-of-type(1) {
          width: 60%;
        }
        &:nth-of-type(2) {
          width: 40%;
        }
      }
    }
  }
}
</style>
