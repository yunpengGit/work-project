<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-01 13:28:28
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-09 19:04:46
-->
<template>
  <div class="agenda-container" v-if="agendaData">
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
            <h4>{{ eleChild.name }}</h4>
            <div class="address"><img src="@/assets/images/place.svg" alt="">{{ eleChild.address }}</div>
            <div class="agenda-list" v-if="eleChild.children">
              <div
                v-for="(eleBrat, indexBrat) in eleChild.children"
                :key="indexBrat"
                class="agenda-item"
                :class="agendaChecked(ele.date, eleBrat.startTime, eleBrat.endTime, indexBrat)"
              >
                <div class="time">{{ eleBrat.startTime }} - {{ eleBrat.endTime }}</div>
                <h4>{{ eleBrat.name }}</h4>
                <div class="address"><img src="@/assets/images/place.svg" alt="">{{ eleBrat.address }}</div>
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
      agendaData: null
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
    const id = this.routeParams.id
    this.$api({
      url: 'desk.getAgenda',
      data: {
        conferenceId: id
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
  },
  methods: {
    agendaShow(index) {
      this.agendaData[index].checked = !this.agendaData[index].checked
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.agenda-container {
  width: 100%;
  min-height: 100%;
  background-color: #f8f8f8;
  .agenda-list {
    .title {
      width: 100%;
      height: 56px;
      @include list(row,flex-start,center);
      font-size: 16px;
      line-height: 56px;
      padding: 0 12px;
      font-weight: 500;
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
}
</style>
