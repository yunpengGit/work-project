<!--
 * @Description:
 * @Author: peng
 * @Date: 2021-07-07 15:23:06
 * @LastEditors: peng
 * @LastEditTime: 2021-07-09 16:00:29
-->
<template>
  <van-list
    v-model="loading"
    :error.sync="error"
    error-text="请求失败，点击重新加载"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <div
      class="item"
      v-for="e in taskList"
      :key="e.id"
      @click="
        $router.push({
          path: '/taskDetail',
          query: {
            id: e.id
          }
        })
      "
    >
      <div class="top">
        <span class="date">
          <!-- <span class="dot"></span> -->
          <span class="text">{{ e.startTime }}</span>
        </span>
        <span class="status">
          <img v-if="e.typeStr === '接站'" src="./../icon/jiezhan.svg" class="icon" />
          <img v-else src="./../icon/songzhan.svg" class="icon" />
          <span class="text" :class="{ sent: e.typeStr !== '接站' }">
            {{ e.typeStr === '接站' ? '接站' : '送站' }}
            {{ e.attendeeCount > 0 ? `(${e.attendeeCount}人)` : '' }}
          </span>
        </span>
      </div>
      <div class="sent-to">
        <span class="label">送往：</span>
        <span class="text">{{ e.endAddress }}</span>
      </div>
      <div class="address">
        <span class="label">上车地点：</span>
        <span class="text">{{ e.startAddress }}</span>
      </div>
    </div>
  </van-list>
</template>

<script>
export default {
  name: 'List',
  data() {
    return {
      taskList: [],
      conferenceId: '',
      driverId: '',
      loading: false,
      finished: false,
      error: false,
      pageNum: 1,
      pageSize: 5
    }
  },
  props: {
    // taskList: {
    //   type: [],
    //   default: () => []
    // },
    params: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    params: {
      deep: true,
      handler() {
        this.loading = true
        this.pageNum = 1
      }
    }
  },
  mounted() {
    this.conferenceId = 1519
    this.driverId = 447
  },
  methods: {
    onLoad() {
      const defaultParams = {
        type: 12,
        statusList: '0,1'
      }
      const params = {
        ...this.params,
        ...defaultParams,
        conferenceId: this.conferenceId,
        driverId: this.driverId,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      const data = {
        url: 'driver.list',
        data: params
      }
      this.$api(data)
        .then(res => {
          console.log(res)
          if (res.code === 2000) {
            this.pageNum += 1
            this.taskList = [...this.taskList, ...res.result.list]
            console.log(...res.result.list)
            this.loading = false
            if (this.taskList.length >= res.result.total) {
              this.finished = true
            }
          }
        })
        .catch(e => {
          // this.loading = false
          // console.log(123)
          // this.error = true
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../style/mixin.scss';
.van-list {
  padding: 0 12px;
  .item {
    padding: 20px 16px;
    margin-top: 12px;
    height: 124px;
    background: #ffffff;
    box-shadow: 0px 3px 20px 0px rgba(0, 0, 0, 0.08);
    border-radius: 16px;
    @include task;
  }
}
</style>
