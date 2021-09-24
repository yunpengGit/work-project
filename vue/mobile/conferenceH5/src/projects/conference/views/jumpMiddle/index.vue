<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-30 16:54:44
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-09 19:08:19
-->
<template>
  <div class="jump-middle-container">
    <div class="type-choice">
      <h3>请选择为参会人执行：</h3>
      <ul>
        <li><van-button plain type="primary" @click="checkIn">会议报到</van-button></li>
        <li><van-button plain type="info" @click="signInShow = true">议程签到</van-button></li>
      </ul>
    </div>
    <div class="sign-in-container">
      <h3></h3>
    </div>
    <div class="agenda-container" v-if="agendaData && signInShow">
      <div v-for="(ele, index) in agendaData" :key="index" class="agenda-list">
        <div class="title" @click="agendaShow(index)">{{ ele.date }} {{ getWeek(ele.date) }}</div>
        <div class="detail-container" v-if="ele.checked">
          <div
            v-for="(eleChild, eleIndex) in ele.children"
            :key="eleIndex"
            class="detail"
          >
            <div class="content">
              <div class="time">{{ eleChild.startTime }} - {{ eleChild.endTime }}</div>
              <h4>
                <span>{{ eleChild.name }}</span>
                <van-button
                  v-if="eleChild.attendeeCount"
                  type="info"
                  class="sign-in-btn"
                  :disabled="eleChild.signInStatus === 1 ? true : false"
                  @click="signIn(eleChild)"
                >签到</van-button>
              </h4>
              <div class="address"><img src="@/assets/images/place.svg" alt="">{{ eleChild.address }}</div>
              <div class="agenda-list" v-if="eleChild.children">
                <div
                  v-for="(eleBrat, indexBrat) in eleChild.children"
                  :key="indexBrat"
                  class="agenda-item"
                  :class="agendaChecked(ele.date, eleBrat.startTime, eleBrat.endTime, indexBrat)"
                >
                  <div class="time">{{ eleBrat.startTime }} - {{ eleBrat.endTime }}</div>
                  <h4>
                    <span>{{ eleBrat.name }}</span>
                    <van-button
                      v-if="eleBrat.attendeeCount"
                      type="info"
                      class="sign-in-btn"
                      :disabled="eleBrat.signInStatus === 1 ? true : false"
                      @click="signIn(eleBrat)"
                    >签到</van-button>
                  </h4>
                  <div class="address"><img src="@/assets/images/place.svg" alt="">{{ eleBrat.address }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
      conferenceData: null,
      agendaData: null,
      signInShow: false
    }
  },
  computed: {
    filterDate() {
      return function(date) {
        return `${this.formatCode(new Date(date))} ${this.judgeDate(date)}`
      }
    },
    getWeek() {
      return function(date) {
        const getDay = new Date(date).getDay()
        const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        const week = weeks[getDay]
        const today = this.judgeDate(date)
        return `${week}${today ? `（${today}）` : ''}`
      }
    },
    agendaChecked() {
      return function(date, startTime, endTime) {
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
    const conferenceId = this.routeParams.id
    this.$api({
      url: 'desk.getAgenda',
      data: {
        conferenceId
      }
    }).then(res => {
      if (res.code === 2000) {
        const data = res.result
        for (let i = 0; i < data.length; i++) {
          data[i].checked = false
        }
        data[0].checked = true
        this.agendaData = data
      }
    })
    // const attendeeId = this.routeParams.attendeeId
    // const getData = async function() {
    //   await this.getConferenceDetail()
    //   // const conferenceId = this.routeParams.id
    //   const getAgendaTime = () => {
    //     return this.$api({
    //       url: 'manage.getAgendaTime',
    //       data: {
    //         conferenceId
    //       }
    //     }).then(res => {
    //       if (res.code === 2000) {
    //         const data = res.result
    //         const conductDate = data.filter(ele => ele.selected)
    //         return conductDate.length ? conductDate[0].date : ''
    //       }
    //     })
    //   }
    //   const getAgenda = async function() {
    //     const conductDate = await getAgendaTime()
    //     this.conductDate = conductDate
    //     if (!conductDate.length) {
    //       this.agendaData = []
    //     } else {
    //       this.getAgendaList(conductDate)
    //     }
    //   }.bind(this)
    //   getAgenda()
    // }.bind(this)
    // getData()
  },
  methods: {
    // 执行签到
    signIn(ele) {
      const conferenceId = this.routeParams.id
      const attendeeId = this.routeParams.attendeeId
      const agendaId = ele.id
      this.$api({
        url: 'manage.signIn',
        params: {
          conferenceId: conferenceId,
          signInType: 3,
          agendaId: agendaId,
          attendeeIds: attendeeId
        }
      }).then(res => {
        if (res.code === 2000) {
          ele.signInStatus = 1
          this.$toast.success('签到成功')
          setTimeout(() => {
            this.$router.push({
              name: 'conferenceDesk',
              query: {
                [this.$enc('id')]: this.$enc(conferenceId)
              }
            })
          }, 500)
        }
      })
    },
    // 执行报到
    checkIn() {
      const conferenceId = this.routeParams.id
      const attendeeId = this.routeParams.attendeeId
      this.$api({
        url: 'manage.checkIn',
        params: {
          conferenceId: conferenceId,
          signInType: 3,
          attendeeIds: attendeeId
        }
      }).then(res => {
        if (res.code === 2000) {
          this.$toast.success('报到成功')
          setTimeout(() => {
            this.$router.push({
              name: 'conferenceDesk',
              query: {
                [this.$enc('id')]: this.$enc(conferenceId)
              }
            })
          }, 500)
        }
      })
    },
    // 将 2020-01-02 转换为 2020年01月01日
    formatCode(date) {
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    },
    // 将时间戳 转换为 2020-02-02
    formatRod(date) {
      return `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${(date.getDate()) < 10 ? `0${date.getDate()}` : date.getDate()}`
    },
    // 计算两个日期之间相差的天数
    getDaysBetween(startTime, endTime) {
      const startDate = Date.parse(startTime)
      const endDate = Date.parse(endTime)
      const days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)
      return days
    },
    // 判断日期是当前日期的前天 / 昨天 / 今天 / 明天 / 后天
    judgeDate(date) {
      const now = new Date()
      const nowFromat = this.formatRod(now)
      const getDaysBetween = this.getDaysBetween(nowFromat, date)
      switch (getDaysBetween) {
        case 2:
          return '后天'
        case 1:
          return '明天'
        case 0:
          return '今天'
        case -1:
          return '昨天'
        case -2:
          return '前天'
        default:
          return ''
      }
    },
    agendaShow(index) {
      this.agendaData[index].checked = !this.agendaData[index].checked
    },
    // 获取会议详情
    getConferenceDetail() {
      const conferenceId = this.routeParams.id
      return new Promise(resolve => {
        this.$api({
          url: 'desk.getDetail',
          data: {
            id: conferenceId
          }
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result
            this.conferenceData = data
            resolve()
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.jump-middle-container {
  min-height: 100%;
  background-color: #f8f8f8;
  .type-choice {
    width: 100%;
    padding: 16px 0;
    h3 {
      padding: 0 12px;
      font-size: 17px;
      font-weight: 500;
      margin-bottom: 40px;
    }
    ul {
      padding: 0 20px;
      li {
        width: 100%;
        margin-bottom: 14px;
        .van-button {
          width: 100%;
          height: 56px;
        }
      }
    }
  }
}
.agenda-container {
  width: 100%;
  .agenda-list {
    .title {
      width: 100%;
      height: 56px;
      @include list(row,flex-start,center);
      font-size: 16px;
      line-height: 56px;
      padding: 0 12px;
    }
    .detail {
      width: 100%;
      padding: 0 12px;
      margin-bottom: 12px;
      .content{
        padding: 16px;
        border-radius: 16px;
        background-color: #fff;
        .time {
          font-size: 13px;
          color: rgba(88, 110, 129, 1);
          line-height: 18px;
          margin-bottom: 16px;
        }
        h4 {
          font-size: 16px;
          line-height: 21px;
          margin-bottom: 8px;
          padding-right: 96px;
          position: relative;
        }
        .address {
          font-size: 13px;
          color: rgba(25, 31, 36, 0.56);
          line-height: 18px;
          @include list(row,flex-start,center);
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
              @include absolute(3px,'','',3px);
              background-color: rgba(236, 236, 236, 1);
            }
            &::before {
              content: '';
              display: block;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              @include absolute(2px,'','',0,2);
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
              @include absolute('',-16px,16px,'');
            }
          }
        }
      }
    }
  }
  .sign-in-btn {
    width: 80px;
    height: 36px;
    @include absolute(50%,0,'','');
    transform: translateY(-50%);
  }
}
</style>
