<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-03 16:12:31
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-11 21:43:08
-->
<template>
  <div class="form-container" v-if="detailData">
    <div class="form-item">
      <van-cell-group>
        <van-cell title="酒店名称" :value="detailData.roomFormVO.hotelVO.name" border />
        <van-cell title="房型" :value="detailData.roomFormVO.modelName" border />
        <van-cell title="房间号" :value="detailData.roomNo" border />
        <van-cell title="总床位" :value="detailData.totalCount" border />
        <van-cell title="可用床位" :value="detailData.remainCount" border />
        <van-cell title="入住人数" :value="detailData.useCount" border />
        <van-cell title="房间状态" :value="detailData.fullStatusStr" border />
        <van-cell title="房间使用方式" :value="detailData.oneself === 0 ? '合住' : '单住'" border />
        <van-cell title="入住时间" value-class="special-cell" :value="`${detailData.startDate} - ${detailData.endDate}`" border>
        </van-cell>
      </van-cell-group>
    </div>
    <div class="single-btn-bottom" v-if="!routeParams.hide">
      <van-button
        @click="$router.push({
          name: 'manageStayStaff',
          query: {
            [$enc('conferenceId')]: $enc(routeParams.conferenceId),
            [$enc('roomId')]: $enc(detailData.roomId),
            [$enc('startDate')]: $enc(routeParams.startDate),
            [$enc('endDate')]: $enc(routeParams.endDate),
            [$enc('hotelName')]: $enc(detailData.roomFormVO.hotelVO.name),
            [$enc('roomNo')]: $enc(detailData.roomNo),
            [$enc('fullStatus')]: $enc(detailData.fullStatus),
          }
        })"
      >查看入住人员</van-button>
      <van-button
        class="add-btn"
        type="info"
        @click="$router.push({
          name: 'stayAdd',
          query: {
            [$enc('conferenceId')]: $enc(routeParams.conferenceId),
            [$enc('roomId')]: $enc(detailData.roomId),
            [$enc('startDate')]: $enc(routeParams.startDate),
            [$enc('endDate')]: $enc(routeParams.endDate)
          }
        })"
      >添加入住人员</van-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    routeParams: {
      type: Object
    }
  },
  data() {
    return {
      detailData: null
    }
  },
  created() {
    const params = this.routeParams
    console.log(this.routeParams)
    const { conferenceId, roomId, startDate, endDate } = params
    // console.log(333, params, roomId)
    this.$api({
      url: 'manage.getStayList',
      data: {
        conferenceId, roomId, startDate, endDate
      }
    }).then(res => {
      if (res.code === 2000) {
        const data = res.result.list[0]
        this.detailData = data
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.form-container {
  min-height: 100%;
  background-color: #f8f8f8;
  padding: 12px 12px 74px;
  .form-item {
    width: 100%;
    // background-color: #fff;
    margin-bottom: 10px;
    > h3 {
      width: 100%;
      height: 44px;
      line-height: 44px;
      padding: 0 16px;
      font-size: 13px;
      color: rgba(25, 31, 36, 0.64);
      background-color: transparent;
    }
    textarea {
      width: 100%;
      height: 200px;
      background-color: #fff;
      border-radius: 8px;
      padding: 16px;
      resize: none;
    }
    .van-cell-group {
      border-radius: 8px;
      overflow: hidden;
    }
    .van-cell {
      height: 53px;
      line-height: 53px;
      padding-top: 0;
      padding-bottom: 0;
      .van-cell__left-icon, .van-cell__right-icon {
        line-height: 53px;
      }
      .van-cell__title {
        font-size: 15px;
        color: rgba(25, 31, 36, 0.64);
      }
      .van-cell__value {
        span {
          font-size: 15px;
          color: rgba(25, 31, 36, 1);
        }
      }
    }
  }
  .special-cell {
    flex-grow: 2;
  }
  .single-btn-bottom {
    position: fixed;
    background-color: #fff;
    z-index: 9;
    @include list(row, space-between,center);
    .van-button {
      width: 167px;
    }
    .van-button__text {
      font-size: 15px;
    }
  }
}
</style>
