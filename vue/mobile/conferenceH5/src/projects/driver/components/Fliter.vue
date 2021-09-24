<!--
 * @Description:
 * @Author: peng
 * @Date: 2021-07-08 14:44:22
 * @LastEditors: peng
 * @LastEditTime: 2021-07-09 15:45:02
-->
<template>
  <van-popup v-model="show" position="right" :close-on-click-overlay="false" @click-overlay="clickOverlay">
    <div class="fliter-box" :style="{ width: width + 'px' }">
      <div class="label">
        查询条件
      </div>
      <div class="input-item">
        <img src="./../icon/chaxun.svg" alt="" class="icon" />
        <input type="text" v-model="params.startAddressLike" placeholder="输入上车地点" />
      </div>
      <div class="input-item">
        <img src="./../icon/chaxun.svg" alt="" class="icon" />
        <input type="text" v-model="params.endAddressLike" placeholder="输入送达地点" />
      </div>
      <div class="label" v-if="!isAll">
        出车时间
      </div>
      <div class="date-list" v-if="!isAll">
        <div
          class="item"
          :class="{ active: currentDate === e.dateShow }"
          v-for="e in dateList"
          :key="e.dateShow"
          @click="select(e)"
        >
          {{ e.dateShow }}
        </div>
      </div>
      <div class="btn">
        <van-button type="default" @click="cancel">重置</van-button>
        <van-button type="info" @click="confirm">确定</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  name: 'Fliter',
  props: {
    width: {
      type: Number,
      default: 315
    },
    show: {
      type: Boolean,
      default: false
    },
    isAll: {
      type: Boolean,
      default: false
    },
    dateList: {
      type: [],
      default: () => [
        { startTime: '00:00:00', endTime: '09:00:00', dateShow: '9:00 前' },
        { startTime: '09:00:00', endTime: '12:00:00', dateShow: '9:00 - 12:00' },
        { startTime: '12:00:00', endTime: '17:00:00', dateShow: '12:00 - 17:00' },
        { startTime: '17:00:00', endTime: '23:59:59', dateShow: '17:00 后' }
      ]
    }
  },
  components: {},
  data() {
    return {
      currentDate: '',
      params: {
        endAddressLike: '',
        startAddressLike: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  methods: {
    select(e) {
      const now = new Date()
      const month = now.getMonth() + 1
      const date = now.getDate()
      const today = `${now.getFullYear()}-${month >= 10 ? month : `0${month}`}-${date >= 10 ? date : `0${date}`}`
      this.currentDate = e.dateShow
      this.params.startTime = today + ' ' + e.startTime
      this.params.endTime = today + ' ' + e.endTime
    },
    cancel() {
      this.currentDate = ''
      this.params = {
        endAddressLike: '',
        startAddressLike: '',
        startTime: '',
        endTime: ''
      }
    },
    clickOverlay() {
      this.$emit('onCancel')
    },
    confirm() {
      // console.log(this.params)
      this.$emit('onConfirm', this.params)
    }
  }
}
</script>

<style lang="scss" scoped>
.fliter-box {
  height: 100vh;
  padding: 16px 16px 0;
  .label {
    margin: 16px 0;
    height: 18px;
    position: relative;
    padding-left: 8px;
    font-size: 15px;
    font-weight: 500;
    color: #191f24;
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      content: '';
      height: 14px;
      width: 4px;
      background-color: #1e89ff;
    }
  }
  .input-item {
    display: flex;
    height: 36px;
    background: rgba(25, 31, 36, 0.04);
    border-radius: 6px;
    align-items: center;
    padding: 0 12px;
    margin-bottom: 16px;
    input {
      margin-left: 4px;
      flex: 1;
      height: inherit;
      font-size: 14px;
      color: #191f24;
      line-height: 18px;
      background-color: transparent;
    }
    .icon {
      width: 18px;
      height: 18px;
    }
  }
  .date-list {
    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      background: rgba(25, 31, 36, 0.04);
      border-radius: 6px;
      margin-bottom: 8px;
      font-size: 15px;
      color: rgba(25, 31, 36, 0.8);
      &.active {
        font-weight: 500;
        background: #1e89ff;
        color: #ffffff;
      }
    }
  }
  .btn {
    display: flex;
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    box-shadow: 0px -2px 8px 0px rgba(25, 31, 36, 0.08);
    .van-button {
      width: 50%;
      border-radius: 0;
      font-size: 16px;
      color: #191f24;
      border: 0;
      &:nth-child(n + 2) {
        background: #1e89ff;
        color: #fff;
      }
    }
  }
}
</style>
