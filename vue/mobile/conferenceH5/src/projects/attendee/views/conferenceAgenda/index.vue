<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-01 13:28:28
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-07-16 14:51:26
-->
<template>
  <div class="agenda-container">
    <div class="agenda-tab">
      <span
        v-for="(ele, index) in agendaListData"
        :key="index"
        @click="changeCurrentAgenda(ele, index)"
        class="agenda-item"
        :class="activeIndex === index ? 'active-agenda-item' : ''"
      >
        {{ ele.attendeeName }}
      </span>
    </div>
    <div v-for="(ele, index) in agendaData" :key="index" class="agenda-list">
      <div class="title" @click="agendaShow(index)">
        <img v-if="ele.checked" src="@/assets/images/arrowDown.svg" alt="" /><img
          v-if="!ele.checked"
          src="@/assets/images/arrowRight.svg"
          alt=""
        />{{ ele.date }} {{ getWeek(ele.date) }}
      </div>
      <div class="detail-container" v-if="ele.checked">
        <div v-for="(eleChild, eleIndex) in ele.children" :key="eleIndex" class="detail">
          <div class="content">
            <div @click="toAgendaDetail(eleChild)">
              <div class="time-and-map">
                <div class="time">
                  {{ eleChild.startTime }} - {{ eleChild.endTime }}
                  <span class="recommend" v-if="eleChild.recommend && eleChild.recommend.length">{{
                    eleChild.recommend
                  }}</span>
                </div>
                <div
                  class="map"
                  v-if="eleChild.seatUrl && eleChild.seatUrl.length"
                  @click.stop="previewImg(eleChild.seatUrl)"
                >
                  <img src="@/assets/svg/seat.svg" alt="" />座位图
                </div>
              </div>
              <h4>{{ eleChild.name }}</h4>
              <div class="address"><img src="@/assets/images/place.svg" alt="" />{{ eleChild.address }}</div>
            </div>
            <div class="agenda-list" v-if="eleChild.children">
              <div
                v-for="(eleBrat, indexBrat) in eleChild.children"
                :key="indexBrat"
                class="agenda-item"
                :class="agendaChecked(ele.date, eleBrat.startTime, eleBrat.endTime, indexBrat)"
                @click="toAgendaDetail(eleBrat)"
              >
                <div class="time">{{ eleBrat.startTime }} - {{ eleBrat.endTime }}</div>
                <h4>{{ eleBrat.name }}</h4>
                <div class="address"><img src="@/assets/images/place.svg" alt="" />{{ eleBrat.address }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-image-preview v-model="imgPreviewShow" :images="images" :showIndex="false"> </van-image-preview>
  </div>
</template>

<script>
export default {
  props: {
    routeParams: {
      default: Object
    }
  },
  data() {
    return {
      activeIndex: 0,
      activeAttendeeId: '',
      agendaData: null,
      agendaListData: [],
      // 图片预览开关
      imgPreviewShow: false,
      // 图片数组
      images: []
    }
  },
  computed: {
    getWeek() {
      return function(date) {
        const getDay = new Date(date).getDay()
        const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        const week = weeks[getDay]
        const isToday = new Date().toString().substr(0, 15) === date.toString().substr(0, 15)
        return isToday ? '今天' : week
      }
    },
    agendaChecked() {
      return function(date, startTime, endTime, index) {
        const nowTime = new Date().getTime()
        const sTime = new Date(`${date} ${startTime}`).getTime()
        const eTime = new Date(`${date} ${endTime}`).getTime()
        if (nowTime >= eTime) {
          return 'agenda-item-before agenda-item-after'
        } else if (nowTime >= sTime) {
          return 'agenda-item-before'
        } else {
          return ''
        }
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.agendaListData = JSON.parse(this.routeParams.agendaListData)
      this.activeAttendeeId = this.agendaListData[0].attendeeId
      this.getAgenda()
    })
  },
  methods: {
    agendaShow(index) {
      this.agendaData[index].checked = !this.agendaData[index].checked
    },
    // 切换顶部参会人
    changeCurrentAgenda(ele, index) {
      this.activeIndex = index
      this.activeAttendeeId = ele.attendeeId
      this.getAgenda()
    },
    // 根据参会人id获取议程
    getAgenda() {
      const conferenceId = this.routeParams.conferenceId
      this.$api({
        url: 'attendeeApi.getAgenda',
        data: {
          conferenceId,
          attendeeId: this.activeAttendeeId
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result
          for (let i = 0; i < data.length; i++) {
            data[i].checked = false
            // 获取座位图
            if (data[i].children.length) {
              data[i].children.forEach(eleChild => {
                this.$api({
                  url: 'attendeeApi.getSeat',
                  data: {
                    agendaId: eleChild.id,
                    attendeeId: this.activeAttendeeId
                  }
                })
                  .then(res => {
                    if (res.success) {
                      this.$set(eleChild, 'seatUrl', res.result)
                    } else {
                      this.$set(eleChild, 'seatUrl', '')
                    }
                  })
                  .catch(() => {
                    this.$set(eleChild, 'seatUrl', '')
                  })
              })
            }
          }
          data[0].checked = true
          this.agendaData = data
        }
      })
    },
    // 跳转到议程表单
    toAgendaDetail(data) {
      this.$router.push({
        name: 'conferenceAgendaDetail',
        query: {
          [this.$enc('agendaId')]: this.$enc(data.id)
        }
      })
    },
    // 预览座位图
    previewImg(url) {
      this.imgPreviewShow = true
      this.images = [url]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.agenda-container {
  width: 100%;
  .agenda-tab {
    height: 48px;
    padding: 9px 12px;
    background: #ffffff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.06);
    min-width: 100%;
    overflow-y: auto;
    white-space: nowrap;
    .agenda-item {
      display: inline-block !important;
      padding: 0 10px;
      height: 30px;
      line-height: 30px;
      background: rgba(25, 31, 36, 0.04);
      border-radius: 15px;
      font-size: 12px;
      color: rgba(25, 31, 36, 0.8);
      margin-right: 10px;
      text-align: center;
    }
    .active-agenda-item {
      background: #1e89ff;
      color: #ffffff;
    }
  }
  .agenda-list {
    .title {
      width: 100%;
      height: 56px;
      @include list(row, flex-start, center);
      font-size: 16px;
      line-height: 56px;
      padding: 0 12px;
      img {
        width: 20px;
        margin-right: 5px;
      }
    }
    .detail {
      width: 100%;
      padding: 0 12px;
      margin-bottom: 12px;
      .content {
        padding: 16px;
        border-radius: 16px;
        background-color: #fff;
        .time-and-map {
          display: flex;
          vertical-align: center;
          justify-content: space-between;
          font-size: 13px;
          color: #586e81;
          height: 24px;
          .time {
            .recommend {
              margin-left: 5px;
              display: inline-block;
              color: #ff8200;
              line-height: 14px;
              padding: 0 2px;
              height: 16px;
              border-radius: 3px;
              font-size: 10px;
              border: 1px solid #ff8200;
            }
          }
          .map {
            display: flex;
            width: 72px;
            height: 24px;
            padding: 0 8px;
            background-color: #f1f4f6;
            border-radius: 12px;
            align-items: center;
            justify-content: space-between;
            img {
              width: 12px;
              height: 12px;
            }
          }
        }
        h4 {
          font-size: 16px;
          line-height: 21px;
          margin-bottom: 8px;
        }
        .address {
          font-size: 13px;
          color: rgba(25, 31, 36, 0.56);
          line-height: 18px;
          @include list(row, flex-start, center);
          img {
            width: 10px;
            height: 12px;
            margin-right: 5px;
          }
        }
        .agenda-list {
          padding-top: 28px;
          .agenda-item {
            padding: 0 0 32px 20px;
            position: relative;
            &::after {
              content: '';
              display: block;
              width: 2px;
              height: 100%;
              @include absolute(3px, '', '', 3px);
              background-color: rgba(236, 236, 236, 1);
            }
            &::before {
              content: '';
              display: block;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              @include absolute(2px, '', '', 0, 2);
              background-color: rgba(216, 216, 216, 1);
            }
            &:nth-last-of-type(1) {
              border-bottom: 0;
              padding-bottom: 0;
              &::after {
                display: none;
              }
              .address::after {
                display: none;
              }
            }
          }
          .agenda-item-before {
            &::before {
              background-color: rgba(3, 190, 28, 1);
            }
          }
          .agenda-item-after {
            &::after {
              background-color: rgba(3, 190, 28, 1);
            }
          }
          .address {
            &::after {
              content: '';
              display: block;
              width: 315px;
              height: 1px;
              background-color: rgba(25, 31, 36, 0.08);
              @include absolute('', -16px, 16px, '');
            }
          }
        }
      }
    }
  }
}
</style>
