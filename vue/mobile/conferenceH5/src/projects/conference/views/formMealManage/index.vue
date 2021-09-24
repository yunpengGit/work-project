<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-03 16:12:31
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-11 14:31:02
-->
<template>
  <div class="form-container" v-if="detailData">
    <div class="form-item">
      <van-cell-group>
        <van-cell title="餐厅名称" :value="detailData.dining.dinnerRoom" border />
        <van-cell title="餐厅位置" :value="detailData.dining.diningAddress" border />
        <van-cell title="总餐位(人)" :value="detailData.dining.seatNum" border />
        <van-cell title="已用餐位(人)" :value="detailData.dining.seatNum - detailData.dining.remainCount" border />
        <van-cell title="用餐类型" :value="detailData.typeCode" border />
        <van-cell title="用餐日期" :value="`${detailData.dinnerStartDate} - ${detailData.dinnerEndDate}`" border />
        <van-cell title="用餐时间" :value="`${detailData.startTime.slice(0,5)} - ${detailData.endTime.slice(0,5)}`" border />
      </van-cell-group>
    </div>
    <div class="cancelTask" v-if="detailData.status !== '-1' && !routeParams.hide">
      <span @click="cancelTask">取消用餐任务</span>
    </div>
    <div class="single-btn-bottom" :class="detailData.status === '-1' ? 'single-btn-bottom-checked' : ''" v-if="!routeParams.hide">
      <van-button
        :disabled="detailData.status === '-1' ? true : false"
        @click="$router.push({
          name: 'manageMealStaff',
          query: {
            [$enc('id')]: $enc(detailData.diningId),
            [$enc('conferenceId')]: $enc(routeParams.conferenceId),
            [$enc('taskId')]: $enc(routeParams.id),
            [$enc('mealName')]: $enc(detailData.dining.dinnerRoom),
            [$enc('mealType')]: $enc(detailData.typeCode),
          }
        })"
      >
        查看用餐人
      </van-button>
      <van-button
        :disabled="detailData.status === '-1' ? true : false"
        type="info"
        @click="$router.push({
          name: 'addMealUser',
          query: {
            [$enc('conferenceId')]: $enc(routeParams.conferenceId),
            [$enc('taskId')]: $enc(routeParams.id),
            [$enc('id')]: $enc(detailData.diningId)
          }
        })"
      >
        添加用餐人
      </van-button>
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
    console.log(2, params)
    this.$api({
      url: 'manage.getMealDetail',
      data: params
    }).then(res => {
      if (res.code === 2000) {
        const data = res.result
        this.detailData = data
      }
    })
  },
  methods: {
    cancelTask() {
      this.$dialog.confirm({
        title: '取消用餐任务',
        message: '确认取消？',
        className: 'customDialog'
      }).then(() => {
        const id = this.routeParams.id
        this.$api({
          url: 'desk.deleteMeal',
          data: [id]
        }).then(res => {
          if (res.code === 2000) {
            this.$toast('取消用餐成功')
            setTimeout(() => {
              this.$router.go(-1)
            }, 300)
          }
        })
      }).catch(() => {
        this.$toast('取消取消用餐成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.form-container::v-deep {
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
        flex: inherit;
      }
      .van-cell__value {
        flex: 1;
        span {
          font-size: 15px;
          color: rgba(25, 31, 36, 1);
        }
      }
    }
  }
  .cancelTask {
    width: 100%;
    text-align: center;
    color: #1E89FF;
    line-height: 18px;
    padding-top: 24px;
    font-size: 14px;
  }
  .single-btn-bottom {
    @include list(row, space-between,center);
    .van-button {
      width: 167px;
    }
  }
  .single-btn-bottom-checked {
    opacity: .6;
  }
}
</style>
