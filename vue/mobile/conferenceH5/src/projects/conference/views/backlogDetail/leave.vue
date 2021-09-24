<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-04 20:09:53
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-30 14:10:14
-->
<template>
  <div class="add-driver-container">
    <van-form>
      <van-cell-group>
        <van-field
          readonly
          v-model="attendeeName"
          label="参会人"
          placeholder="请输入姓名"
          input-align="right"
        />
        <van-field
          readonly
          v-model="params.typeStr"
          label="请假类型"
          placeholder="请选择请假类型"
          input-align="right"
        />
      </van-cell-group>
    </van-form>
    <van-form v-if="leaveIndex === '3'">
      <h3>请假时间段</h3>
      <van-cell-group>
        <van-field
          readonly
          v-model="params.leaveTime"
          label="离会开始时间"
          placeholder="请选择开始时间"
          input-align="right"
        />
        <van-field
          readonly
          v-model="params.returnTime"
          label="离会结束时间"
          placeholder="请选择结束时间"
          input-align="right"
        />
      </van-cell-group>
    </van-form>
    <van-form  v-if="leaveIndex === '4'">
      <h3>请假时间段</h3>
      <van-cell-group>
        <van-field
          readonly
          v-model="params.leaveTime"
          label="离会时间"
          placeholder="请选择离会时间"
          input-align="right"
        />
      </van-cell-group>
    </van-form>
    <div class="form-item">
      <h3>请假事由</h3>
      <textarea readonly v-model="params.reason" placeholder="请填写请假事由"></textarea>
    </div>
    <van-action-sheet
      v-model="actionShow"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="onSelect"
    />
    <van-overlay :show="examineShow" z-index="999" class-name="examine-container">
      <div class="examine">
        <h3>填写审核理由</h3>
        <div class="val">
          <van-field
            v-model="examineReason"
            rows="1"
            type="textarea"
            maxlength="300"
            show-word-limit
            placeholder="请输入审核拒绝原因"
          />
          <!-- <textarea name="" id="" cols="30" rows="10" v-model="examineReason"></textarea> -->
        </div>
        <ul class="oper">
          <li @click="rejectHandler">拒绝申请</li>
          <li @click="refuseHanhler">关闭</li>
        </ul>
      </div>
    </van-overlay>
    <div class="single-btn-bottom">
      <van-button
        type="info"
        @click="submit"
      >审核</van-button>
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
      examineReason: '',
      examineShow: false,
      actionShow: false,
      actions: [
        { name: '通过' },
        { name: '不通过' }
      ],
      // 参会人姓名
      attendeeName: '',
      // paramsVal做展示用，当选择sheet时候动态改变params的id值，考虑用户网速慢提交不成功时候的再次提交，舍弃delete key方法改为分开赋值
      paramsVal: {
        typeStr: ''
      },
      params: {
        conferenceId: '',
        attendeeId: '',
        // 开始时间
        leaveTime: '',
        // 结束时间
        returnTime: '',
        // 请假类型
        type: '3',
        // 请假理由
        reason: ''
      },
      // 当前选择的是哪个请假类型
      leaveIndex: '3',
      leaveType: [
        { name: '离会外出', id: '3' },
        { name: '提前离会', id: '4' }
      ],
      // 会议开始时间
      startTime: '',
      // 会议结束时间
      endTime: ''
    }
  },
  created() {
    console.log(this.routeParams)
    // const conferenceId = this.routeParams.conferenceId
    // const attendeeId = this.routeParams.attendeeId
    // const attendeeName = this.routeParams.attendeeName
    // this.params.conferenceId = conferenceId
    // this.params.attendeeId = attendeeId
    // this.attendeeName = attendeeName
    const id = this.routeParams.taskId
    // 获取
    // alert(1)
    this.$api({
      url: 'task.getTaskDetail',
      data: {
        id
      }
    }).then(res => {
      // alert(JSON.stringify(res))
      if (res.code === 2000) {
        const data = res.result
        const changeContent = JSON.parse(data.changeContent)
        this.leaveIndex = String(changeContent.type)
        this.params = changeContent
        this.attendeeName = data.attendeeName
      }
    }).catch(() => {
      // alert(2)
    })
  },
  methods: {
    refuseHanhler() {
      this.examineShow = false
      this.actionShow = true
    },
    // 拒绝申请
    rejectHandler() {
      if (!this.examineReason.length) {
        this.$toast('请填写审核拒绝原因')
        return false
      }
      this.$dialog.confirm({
        title: `${this.attendeeName}的请假申请`,
        message: '确认拒绝申请？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        className: 'customDialog'
      }).then(() => {
        const attendeeId = this.routeParams.attendeeId
        const taskType = this.routeParams.taskType
        this.$api({
          url: 'task.setExamine',
          data: {
            attendeeIds: [attendeeId],
            auditType: taskType,
            // 2不通过3 通过 -3驳回
            signStatus: 2,
            verifyReason: this.examineReason
          }
        }).then(res => {
          if (res.code === 2000) {
            this.$toast.success('操作成功')
            setTimeout(() => {
              if (sessionStorage.getItem('isJumpToHome')) {
                sessionStorage.removeItem('isJumpToHome')
                this.$router.replace({
                  name: 'conferenceDesk',
                  query: {
                    [this.$enc('id')]: this.$enc(this.routeParams.id)
                  }
                })
              } else {
                this.$router.go(-1)
              }
              // this.$router.replace({
              //   name: 'backlog',
              //   [this.$enc('id')]: this.$enc(this.routeParams.id)
              // })
            }, 500)
          }
        })
      }).catch(() => {
        this.$toast('取消操作')
      })
    },
    onSelect(item) {
      const name = item.name
      const attendeeId = this.routeParams.attendeeId
      const taskType = this.routeParams.taskType
      if (name === '通过') {
        console.log(this.routeParams)
        this.$dialog.confirm({
          title: `${this.attendeeName}的请假申请`,
          message: '确认通过审核？',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          className: 'customDialog'
        }).then(() => {
          this.$api({
            url: 'task.setExamine',
            data: {
              attendeeIds: [attendeeId],
              auditType: taskType,
              // 2不通过3 通过 -3驳回
              signStatus: 3
            }
          }).then(res => {
            if (res.code === 2000) {
              this.$toast.success('审核成功')
              setTimeout(() => {
                if (sessionStorage.getItem('isJumpToHome')) {
                  sessionStorage.removeItem('isJumpToHome')
                  this.$router.replace({
                    name: 'conferenceDesk',
                    query: {
                      [this.$enc('id')]: this.$enc(this.routeParams.id)
                    }
                  })
                } else {
                  this.$router.go(-1)
                }
                // this.$router.replace({
                //   name: 'backlog',
                //   [this.$enc('id')]: this.$enc(this.routeParams.id)
                // })
              }, 500)
            }
          })
        }).catch(() => {
          this.$toast('取消通过')
        })
      } else if (name === '不通过') {
        this.examineShow = true
      }
    },
    submit() {
      this.actionShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.add-driver-container::v-deep {
  min-height: 100%;
  background-color: #f8f8f8;
  padding: 16px 0 64px;
  .van-form {
    padding: 0 12px;
     > h3 {
      width: 100%;
      height: 44px;
      line-height: 44px;
      padding: 0 4px;
      font-size: 13px;
      color: rgba(25, 31, 36, 0.64);
      background-color: transparent;
    }
    .van-cell-group {
      border-radius: 8px;
      overflow: hidden;
      background: #fff;
      .van-cell {
        height: 56px;
        line-height: 56px;
        padding-top: 0;
        padding-bottom: 0;
        border-bottom: 1px solid #f0f0f1;
      }
    }
  }
  .van-cell--required {
    &::before {
      content: '';
    }
    .van-cell__title {
      width: auto;
      flex: none;
      span {
        position: relative;
        white-space: nowrap;
        &:before {
          position: absolute;
          right: -10px;
          color: #ee0a24;
          font-size: 14px;
          content: '*';
        }
      }
    }
  }
  .form-item {
    padding: 0 12px;
    > h3 {
      width: 100%;
      height: 44px;
      line-height: 44px;
      padding: 0 4px;
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
  }
  .examine-container {
    .examine {
      width: 284px;
      @include absolute(50%, 50%, '', '');
      transform: translate(50%, -50%);
      background-color: #fff;
      border-radius: 12px;
      overflow: hidden;
      > h3 {
        height: 54px;
        line-height: 54px;
        font-size: 17px;
        padding: 0 20px;
        font-weight: 500;
      }
      .val {
        width: 100%;
        padding: 0 16px 16px;
        .van-cell {
          padding: 0;
          height: 100px;
          background-color: rgba(25, 31, 36, 0.04);
        }
        textarea {
          width: 100%;
          height: 74px;
          line-height: 20px;
          border-radius: 6px;
          resize: none;
          padding: 8px 10px;
        }
      }
      .oper {
        li {
          width: 100%;
          height: 56px;
          line-height: 56px;
          font-size: 17px;
          text-align: center;
          position: relative;
          &::after {
            content: '';
            display: block;
            width: 100%;
            border-top: 1px solid #ebedf0;
            transform: scaleY(.5);
            @include absolute(0,'','',0);
          }
          .item {
            span {
              position: relative;
              img {
                width: 16px;
                height: 16px;
                @include absolute(50%,'','',-32px);
                transform: translateY(-50%);
              }
            }
          }
          .examine-btn {
            width: 50%;
            display: inline-block;
            position: relative;
            color: rgba(30, 137, 255, 1);
            &:nth-of-type(1) {
              color: rgba(25, 31, 36, 1);
              &::after {
                content: '';
                display: block;
                width: 1px;
                height: 100%;
                @include absolute(0,0,'','');
                border-right: 1px solid #ebedf0;
                transform: scaleY(.5);
              }
            }
          }
        }
      }
    }
  }
}
</style>
