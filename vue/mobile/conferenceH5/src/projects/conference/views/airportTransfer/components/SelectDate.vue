<!--
 * @Description:
 * @Author: peng
 * @Date: 2021-07-08 11:26:25
 * @LastEditors: caofeng
 * @LastEditTime: 2021-07-27 16:47:33
-->
<template>
  <van-popup v-model="show" round position="bottom" :close-on-click-overlay="false" @click-overlay="clickOverlay">
    <div class="select-date" :style="{ height: height + 'px' }">
      <div class="header">
        <span class="left" @click="cancel">{{ cancelText }}</span>
        <span class="center">{{ title }}</span>
        <span class="right" @click="confirm">{{ confirmText }}</span>
      </div>
      <div class="list" :style="{ height: height - 60 + 'px' }">
        <div class="item" v-for="e in list" :key="e.date" @click="select(e)">
          <div class="date">
            <span class="text">{{ e[label] }}</span>
            <img v-if="current && current.date === e.date" src="./../icon/xuanzhong.svg" class="icon" />
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'ActionSheet',
  components: {},
  props: {
    selected: {
      type: Object,
      default: () => {}
    },
    list: {
      type: Array,
      default: () => []
    },
    height: {
      type: Number,
      default: 516
    },
    show: {
      type: Boolean,
      default: false
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    title: {
      type: String,
      default: '标题'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    label: {
      type: String,
      default: 'label'
    }
  },
  data() {
    return {
      current: { date: '', dateShow: '' }
    }
  },
  watch: {
    selected: {
      deep: true,
      handler(n) {
        this.current = n
      }
    }
  },
  methods: {
    select(e) {
      this.current = e
    },
    cancel() {
      this.$emit('onCancel')
    },
    clickOverlay() {
      this.$emit('onCancel')
    },
    confirm() {
      this.$emit('onConfirm', this.current)
    }
  },
  filters: {
    formatDate(v) {
      if (dayjs().isSame(dayjs(v))) {
        return `${v} （今天）`
      } else if (dayjs().add(1, 'day').isSame(dayjs(v))) {
        return `${v} （明天）`
      }
      return v
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../style/mixin.scss';
.select-date {
  background-color: #fff;
  .header {
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    font-size: 17px;
    font-weight: 500;
    color: #191f24;
    line-height: 22px;
    .left,
    .right {
      color: #1e89ff;
    }
  }
  .list {
    background-color: #f6f6f6;
    padding: 16px 0;
    overflow: auto;
    .item {
      background-color: #fff;
      height: 56px;
      .date {
        margin-left: 20px;
        padding-right: 20px;
        height: inherit;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        &:nth-child(n + 1) {
          @include border1px('top');
        }
        .text {
          font-size: 17px;
          color: #191f24;
        }
        .icon {
          height: 16px;
          width: 16px;
        }
      }
    }
  }
}
</style>
