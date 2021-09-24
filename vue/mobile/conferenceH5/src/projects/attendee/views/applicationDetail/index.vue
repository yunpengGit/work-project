<!--
* @Descripttion:
* @Author: wanghz
* @Date: 2021-07-16 15:44:00
* @LastEditors: Please set LastEditors
* @LastEditTime:
-->

<template>
  <div>
    <div class="top">
      <div class="apply-title">审核信息</div>
      <div class="check-info">
        <div class="title">{{ applicationDetail.todoTitle }}</div>
        <div v-if="applicationDetail.result == 3" class="applyStatus pass">
          <span>{{ applicationDetail.resultStr }}</span>
        </div>
        <div v-if="applicationDetail.result == 2" class="applyStatus not-pass">
          <span>{{ applicationDetail.resultStr }}</span>
        </div>
        <div v-if="applicationDetail.result == null" class="applyStatus review">
          <span>{{ applicationDetail.resultStr }}</span>
        </div>
        <div v-if="applicationDetail.result == -4" class="applyStatus recall">
          <span>{{ applicationDetail.resultStr }}</span>
        </div>
        <!--
          1.审核通过 3
          2.审核不通过 2
          3.已分配 100
          4.待分配 101
          5.未分配 110
          6.已撤回 -4
          7.待审核 null
          -->
        <div
          class="infoItem"
          v-if="applicationDetail.result == 2 || applicationDetail.result == 3 || applicationDetail.result == -4"
        >
          审核时间：<span>{{ applicationDetail.verifyTime }}</span>
        </div>
        <div
          class="infoItem"
          v-if="applicationDetail.result == 2 || applicationDetail.result == 3 || applicationDetail.result == -4"
        >
          审核人：<span>{{ applicationDetail.verifyUserName }}</span>
        </div>
        <div
          class="infoItem"
          v-if="applicationDetail.result == 2 || applicationDetail.result == 3 || applicationDetail.result == -4"
        >
          审核意见：<span>{{ applicationDetail.verifyReason || '无' }}</span>
        </div>
      </div>
      <div class="apply-title">申请信息</div>
      <div class="apply-info">
        <div class="infoItem">
          申请人：<span>{{ applicationDetail.createUserName }}</span>
        </div>
        <div class="infoItem">
          申请时间：<span>{{ applicationDetail.createTime }}</span>
        </div>
        <div class="infoItem">
          申请原因：<span>{{ applicationDetail.typeStr }}</span>
        </div>
        <div class="infoItem">
          <div v-if="applicationDetail.type == 5">
            请假信息：
            <div class="apply-info-detail vacate">
              <dl>
                <dt>请假类型：</dt>
                <dd>
                  <span>
                    <img v-if="changeContent.type == '3'" src="@/assets/images/radio-active.png" alt="" />
                    <img v-else src="@/assets/images/radio.png" alt="" />离会外出</span
                  >
                  <span
                    ><img v-if="changeContent.type == '4'" src="@/assets/images/radio-active.png" alt="" />
                    <img v-else src="@/assets/images/radio.png" alt="" />提前离会</span
                  >
                </dd>
                <dt>离会时间：</dt>
                <dd v-if="changeContent.type == '3'">
                  {{ changeContent.leaveTime.substring(0, changeContent.leaveTime.length - 3) }} 至
                  {{ changeContent.returnTime.substring(0, changeContent.returnTime.length - 3) }}
                </dd>
                <dd v-if="changeContent.type == '4'">
                  {{ changeContent.leaveTime.substring(0, changeContent.leaveTime.length - 3) }}
                </dd>
              </dl>
            </div>
          </div>
          <div v-if="applicationDetail.type == 4 || applicationDetail.type == 2">
            变更信息：
            <div class="apply-info-detail vacate">
              <dl>
                <dt>原信息：</dt>
                <dd v-for="ele in changeContent" :key="ele.code">{{ ele.attribute }}：{{ ele.beforeValue || '无' }}</dd>

                <dt>变更后：</dt>
                <dd v-for="(ele, index) in changeContent" :key="index">
                  {{ ele.attribute }}：{{ ele.afterValue || '无' }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="bottom"
      v-if="applicationDetail.result == null || applicationDetail.result == 2 || applicationDetail.result == 3"
    >
      <van-button
v-if="applicationDetail.result == null"
block
type="info"
native-type="submit"
@click="cancelApply"
        >撤回</van-button
      >
      <van-button
        v-if="applicationDetail.result == 3"
        block
        type="info"
        @click="
          $router.push({
            name: 'applyInfoDetail',
            query: {
              [$enc('conferenceId')]: $enc(routeParams.conferenceId),
               [$enc('attendeeId')]: $enc(applicationDetail.attendeeId)
            }
          })
        "
        >查看申请信息</van-button
      >
      <van-button
        v-if="applicationDetail.result == 2"
        block
        type="info"
        @click="
          $router.push({
            name: 'editApply',
            query: {
              [$enc('conferenceId')]: $enc(routeParams.conferenceId),
              [$enc('attendeeId')]: $enc(applicationDetail.attendeeId)
            }
          })
        "
        >修改申请信息</van-button
      >
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
      applicationDetail: {}, // 申请详情
      changeContent: {} // 变更内容
    }
  },
  created() {
    this.applicationDetail = JSON.parse(this.routeParams.applicationDetail)
    this.changeContent = JSON.parse(this.applicationDetail.changeContent)
  },
  mounted() {},

  methods: {
    // 撤回审批
    cancelApply() {
      this.$dialog
        .confirm({
          message: '请确认撤回申请？',
          cancelButtonText: '取消',
          confirmButtonText: '确认',
          className: 'attendeeDialog'
        })
        .then(() => {
          this.$api({
            url: 'attendeeApi.signCancel',
            data: {
              ids: this.applicationDetail.attendeeId, // 参会人id
              taskType: this.applicationDetail.type, // 撤回申请类别 1报名待审核 2信息变更审核 3取消参会审核 4行程变更申请 5请假申请
              cancelMettingReason: ''
            }
          }).then(res => {
            if (res.code === 2000) {
              this.$router.back()
            } else {
              this.$toast(res.message)
            }
          })
        })
    }
  }
}
</script>

<style scoped lang="scss">
.top {
  // padding: 16px;
  .apply-title {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(25, 31, 36, 0.64);
    padding: 13px 16px;
  }
  .check-info,
  .apply-info {
    // border-radius: 8px;
  }
  .check-info {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 16px;
    .title {
      font-size: 18px;
      margin-bottom: 10px;
    }
    .applyStatus {
      display: inline-block;
      border-radius: 10px;
      color: #fff;
      height: 20px;
      line-height: 20px;
      padding: 0 5px;
      margin: 5px 0 10px 0;
      span {
        margin-left: 5px;
      }
    }
    .pass {
      background: #03be1c;
    }
    .not-pass {
      background: #ea340f;
    }
    .review {
      background: #1e89ff;
    }
    .recall {
      background: #7f8285;
    }
    .infoItem {
      font-size: 13px;
      color: #9a9d9f;
      line-height: 24px;
      span {
        color: #191f24;
      }
    }
  }
  .apply-info {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 16px;

    .infoItem {
      font-size: 13px;
      color: #9a9d9f;
      line-height: 24px;
      span {
        color: #191f24;
      }
      .content {
        background-color: #fff;
        padding: 16px;
        .title {
          font-size: 18px;
          display: flex;
          align-items: center;
          color: #191f24;
          margin-bottom: 20px;
          .line {
            display: inline-block;
            width: 3px;
            background: #1e89ff;
            margin-right: 5px;
            height: 18px;
          }
        }
      }
    }
    .apply-info-detail {
      background-color: rgba(255, 204, 0, 8%);
      border: 0.5px solid #ffcc00;
      border-radius: 8px;
      padding: 16px;
      margin-top: 10px;
    }
    .vacate {
      dl {
        dt {
          color: #191f24;
        }
        span {
          color: #9a9d9f;
        }
        span:first-child {
          margin-right: 15px;
        }
        span img {
          vertical-align: middle;
          width: 20px;
          display: inline-block;
        }
      }
    }
  }
}

.bottom {
  z-index: 999;
  padding: 10px 16px;
  position: fixed;
  bottom: 0;
  background-color: #fff;
  position: fixed;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .van-button {
    border-radius: 4px;
    font-size: 18px;
  }
}
</style>
