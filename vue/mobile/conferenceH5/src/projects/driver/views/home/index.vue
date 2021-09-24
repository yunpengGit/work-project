<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-07-06 10:48:07
 * @LastEditors: peng
 * @LastEditTime: 2021-07-08 16:30:33
-->
<template>
  <div class="home">
    <div class="base-info">
      <div class="title">2020年集团工作会工作总结大会</div>
      <div class="date">
        <span class="label">会议时间：</span>
        <span class="text">2020/11/20 09:00 - 2020/11/22 09:00</span>
      </div>
      <div class="address">
        <span class="label">会议地点：</span>
        <span class="text">北京云湖度假村</span>
      </div>
    </div>
    <div class="content">
      <div class="center">
        <div class="title">会议安排</div>
        <div class="list">
          <div class="item yongche">
            <img src="./../../icon/yongche.svg" class="icon" />
            <span class="text">用车安排</span>
          </div>
          <div class="item zhusu">
            <img src="./../../icon/zhusu.svg" class="icon" />
            <span class="text">住宿安排</span>
          </div>
          <div class="item yongcan">
            <img src="./../../icon/yongcan.svg" class="icon" />
            <span class="text">用餐安排</span>
          </div>
          <div class="item piaozheng">
            <img src="./../../icon/piaozheng.svg" class="icon" />
            <span class="text">票证安排</span>
          </div>
        </div>
      </div>
      <div class="task" v-if="taskTotal > 0">
        <div class="title">
          <span class="label">我的出车任务（{{ taskTotal }}）</span>
          <span class="more">查看全部</span>
        </div>
        <div class="list">
          <div class="item" v-for="e in taskList" :key="e.id">
            <div class="top">
              <span class="date">
                <!-- <span class="dot"></span> -->
                <span class="text">{{ e.startTime }}</span>
              </span>
              <span class="status">
                <img v-if="e.typeStr === '接站'" src="./../../icon/jiezhan.svg" class="icon" />
                <img v-else src="./../../icon/songzhan.svg" class="icon" />
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
        </div>
      </div>
      <div class="info">
        <div class="title">
          <div class="label">报名信息（4）</div>
          <span class="more">查看全部</span>
        </div>
        <div class="date">
          <span class="label">报名时间：</span>
          <span class="text">2020/12/01 9:00 - 2020/12/31 18:00</span>
        </div>
        <div class="status-info">
          <span class="text">您的报名</span>
          <span class="status">审核已通过！</span>
        </div>
        <div class="btn">
          <span class="item">代他人报名</span>
          <span class="item">行程变更</span>
          <span class="item">取消报名</span>
          <span class="item">我要请假</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      taskList: [],
      taskTotal: 0
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // this.$router.route.query
      const params = {
        conferenceId: 1519,
        driverId: 447,
        type: 12,
        statusList: '0,1'
      }
      const data = {
        url: 'driver.list',
        data: params
      }
      this.$api(data).then(res => {
        if (res.code === 2000) {
          this.taskList = res.result.list
          this.taskTotal = res.result.total
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import './../../style/mixin.scss';
@mixin bg-radius {
  background-color: #fff;
  border-radius: 12px;
}
@mixin box-shadow {
  box-shadow: 0px 3px 20px 0px rgba(0, 0, 0, 0.08);
}
.home {
  height: 100vh;
  overflow: auto;
  background-color: #fff;
}
.base-info {
  padding: 24px 16px;
  width: 100%;
  height: 171px;
  background: rgba(0, 0, 0, 0.16) url('./../../img/bg.png') no-repeat;
  background-size: 100% 100%;
  /* filter: blur(16px); */
  color: #fff;
  .title {
    font-size: 20px;
    font-weight: 500;
    color: #ffffff;
    line-height: 25px;
  }
  .date {
    margin-top: 16px;
  }
  .address {
    margin-top: 8px;
  }
  .date,
  .address {
    display: flex;
    .label {
      width: 70px;
      font-size: 14px;
      font-weight: 500;
      color: #ffffff;
      line-height: 18px;
    }
    .text {
      flex: 1;
      height: 18px;
      font-size: 14px;
      color: #ffffff;
      line-height: 18px;
    }
  }
}
.content {
  padding: 16px 12px;
  .center {
    @include bg-radius();
    @include box-shadow;
    padding: 0 12px 16px;
    .title {
      height: 48px;
      display: flex;
      align-items: center;
      background: #ffffff;
      font-size: 17px;
      color: #191f24;
    }
    .list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-content: flex-start;
      .item {
        display: flex;
        width: calc((100% - 13px) / 2);
        height: 56px;
        border-radius: 8px;
        & > .icon {
          width: 56px;
          height: 56px;
        }
        & > .text {
          padding-left: 12px;
          display: flex;
          align-items: center;
          font-size: 16px;
          color: rgba(25, 31, 36, 0.8);
        }
        &:nth-child(n + 3) {
          margin-top: 10px;
        }
        &.yongche {
          background: #edf8f8;
        }
        &.zhusu {
          background: #eff2f8;
        }
        &.yongcan {
          background: #fcf6f0;
        }
        &.piaozheng {
          background: #ebf8ec;
        }
      }
    }
  }
  .task {
    @include bg-radius();
    margin-top: 16px;
    @include box-shadow;
    .title {
      position: relative;
      padding: 0 12px;
      height: 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      @include border1px('bottom');
      .label {
        font-size: 17px;
        color: #191f24;
      }
      .more {
        font-size: 14px;
        color: #3f73ab;
      }
    }
    .list {
      padding: 0 16px;
      & > .item {
        padding: 20px 0;
        position: relative;
        &:nth-child(n + 2) {
          @include border1px('top');
        }
        @include task;
      }
    }
  }
  .info {
    @include bg-radius();
    @include box-shadow;
    margin-top: 16px;
    padding: 0 12px;
    .title {
      height: 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0px 0px 0px 0px rgba(25, 31, 36, 0.08);
      .label {
        font-size: 17px;
        color: #191f24;
      }
      .more {
        font-size: 14px;
        color: #3f73ab;
      }
    }
    .date {
      .label,
      .text {
        height: 18px;
        font-size: 14px;
        font-weight: 500;
        color: rgba(25, 31, 36, 0.56);
        line-height: 18px;
      }
    }
    .status-info {
      margin-top: 12px;
      .text {
        width: 56px;
        height: 30px;
        font-size: 14px;
        color: #191f24;
        line-height: 30px;
      }
      .status {
        margin-left: 4px;
        width: 96px;
        height: 30px;
        font-size: 16px;
        font-weight: 500;
        color: #03be1c;
        line-height: 30px;
      }
    }
    .btn {
      margin-top: 20px;
      height: 48px;
      font-size: 14px;
      color: #3f73ab;
      display: flex;
      align-items: center;
      justify-content: space-between;
      & > .item {
        display: flex;
        /* width: 25%; */
        height: 18px;
        align-items: center;
        position: relative;
        &:nth-child(n + 2) {
          justify-content: center;
          padding-left: 15px;
          @include border1px('left');
        }
        &:last-child {
          justify-content: flex-end;
        }
      }
    }
  }
}
</style>
