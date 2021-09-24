<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-02 23:50:10
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-09 19:09:34
-->
<template>
  <div class="plan-container">
    <ul class="plan-list" v-if="getData">
      <li
        v-for="ele in getData"
        :key="ele.id"
        @click="$router.push({
          name: 'formCard',
          query: {
            [$enc('dataInfo')]: $enc(JSON.stringify(ele))
          }
        })"
      >
        <div class="location">
          <h3>
            <span class="time">{{ ele.cardTypeStr }}</span>
          </h3>
          <div class="detail">
            {{ ele.cardStatusStr }}
          </div>
        </div>
      </li>
    </ul>
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
      getData: null
    }
  },
  created() {
    const conferenceId = this.routeParams.conferenceId
    const attendeeId = this.routeParams.attendeeId
    this.$api({
      url: 'plan.getCardList',
      data: {
        conferenceId,
        attendeeId
      }
    }).then(res => {
      if (res.code === 2000) {
        this.getData = res.result.list
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.plan-container {
  min-height: 100%;
  background-color: #f8f8f8;
  width: 100%;
  padding: 16px 16px 80px;
  .plan-list {
    li {
      border-radius: 12px;
      background-color: #fff;
      margin-bottom: 16px;
      overflow: hidden;
      .location {
        padding: 16px 16px 12px;
        h3 {
          line-height: 22px;
          @include list(row,flex-start,center);
          margin-bottom: 16px;
          .time {
            font-size: 17px;
            font-weight: 500;
          }
          i {
            width: 1px;
            height: 18px;
            background-color: rgba(216, 216, 216, 1);
            margin: 0 8px;
          }
          .status {
            @include list(row,flex-start,center);
            color: #FF8200;
            font-size: 14px;
            img {
              margin-right: 4px;
            }
          }
          .status-checked {
            color: rgba(0, 162, 140, 1);
          }
        }
      }
      .detail {
          font-size: 13px;
          line-height: 18px;
          color: rgba(25, 31, 36, 0.64);
          margin-bottom: 4px;
          span {
            font-size: 13px;
            color: rgba(25, 31, 36, 1);
          }
      }
      .car {
        background-color: rgba(25, 31, 36, 0.02);
        padding: 12px 16px 12px;
        h4 {
          font-weight: 500;
          margin-bottom: 7px;
        }
      }
    }
    .special-car {
      .type {
        padding-bottom: 10px;
      }
      .type, .time {
        font-size: 28px;
        color: rgba(156, 110, 55, 1);
        line-height: 34px;
        font-weight: 500;
      }
      .car {
        background-color: rgba(179, 133, 78, 1);
        h4 {
          color: rgba(255, 255, 255, 1);
        }
        .detail {
          color: rgba(255, 255, 255, 0.64);
        }
      }
    }
  }
}
</style>
