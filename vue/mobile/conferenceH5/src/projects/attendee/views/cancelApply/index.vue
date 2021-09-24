<!--
* @Descripttion:
* @Author: wanghz
* @Date: 2021-07-20 15:44:00
* @LastEditors: Please set LastEditors
* @LastEditTime:
-->
<template>
  <div>
    <van-form @submit="onSubmit">
      <div class="top">
        <!-- 选择申请人 -->
        <van-cell title="申请人" is-link :value="applicantName" @click="handlePop" class="applicant-cell" />

        <van-popup
          class="applicant-pop"
          v-model="showApplicantPop"
          position="bottom"
          round
          :style="{ minHeight: '40%', maxHeight: '60%' }"
        >
          <div class="applicant-pop-title">请选择申请人</div>
          <van-picker
            show-toolbar
            toolbar-position="bottom"
            title=" "
            :columns="passAttendeeList"
            @confirm="applicantConfirm"
            @cancel="showApplicantPop = false"
          />
        </van-popup>

        <van-field
          class="cancel-reason"
          v-model="cancelMettingReason"
          rows="4"
          autosize
          type="textarea"
          maxlength="300"
          placeholder="请输入取消报名原因"
          show-word-limit
        />
      </div>
      <div class="bottom">
        <van-button block type="info" native-type="submit">提交申请</van-button>
      </div>
    </van-form>
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
      /* 申请人*/
      applicantName: '请选择', // 申请人attendeeName
      applicantId: '', // 申请人attendeeId
      applicantSignStatus: '', // 申请人审核状态
      taskType: '',
      showApplicantPop: false,
      /* 取消报名原因 */
      cancelMettingReason: '',
      /* 申请人列表(审核通过和审核中状态) */
      passAttendeeList: []
    }
  },
  created() {
    this.getApplicantList()
  },
  mounted() {},
  methods: {
    // 提交申请
    onSubmit() {
      if (this.applicantName === '请选择') {
        this.$toast('请选择申请人')
        return false
      }
      if (this.cancelMettingReason === '') {
        this.$toast('请输入请假事由')
        return false
      }
      this.$dialog
        .confirm({
          message: '取消报名后参会人如参加会议需要重新提交申请，请确认是否继续',
          confirmButtonText: '确定取消',
          cancelButtonText: '暂不取消',
          className: 'attendeeDialog'
        })
        .then(() => {
          // 需要判断当前审核状态调不同接口
          if (String(this.applicantSignStatus) === '1') {
            const paramsData = {}
            paramsData.ids = this.applicantId // 参会人id
            paramsData.cancelMettingReason = this.cancelMettingReason
            paramsData.taskType = '1' // 参照原代码逻辑固定传1
            this.$api({
              url: 'attendeeApi.signCancel',
              data: paramsData
            })
              .then(res => {
                if (res.success) {
                  this.$router.push({
                    name: 'conferenceHomePage',
                    query: {
                      [this.$enc('conferenceId')]: this.$enc(this.routeParams.conferenceId)
                    }
                  })
                } else {
                  this.$toast(res.message)
                }
              })
              .catch(err => {
                this.$toast(err.message)
              })
          } else {
            const paramsData = {}
            paramsData.conferenceId = parseInt(this.routeParams.conferenceId)
            paramsData.attendeeIds = [parseInt(this.applicantId)]
            paramsData.cancelMettingReason = this.cancelMettingReason
            this.$api({
              url: 'attendeeApi.cancelApply',
              data: paramsData
            })
              .then(res => {
                if (res.success) {
                  this.$router.push({
                    name: 'conferenceHomePage',
                    query: {
                      [this.$enc('conferenceId')]: this.$enc(this.routeParams.conferenceId)
                    }
                  })
                } else {
                  this.$toast(res.message)
                }
              })
              .catch(err => {
                this.$toast(err.message)
              })
          }
        })
    },
    // 获取申请人列表(审核通过状态)
    getApplicantList() {
      const conferenceId = this.routeParams.conferenceId
      this.$api({
        url: 'attendeeApi.getAttendeeList',
        data: {
          conferenceId,
          signStatusEqual: 3,
          attendeeRoleFlagEqual: '0,1,2,3,4',
          roleId: 2
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result.list
          const newData = []
          if (data && data.length) {
            data.forEach(item => {
              //   signStatus=3 审核通过 signStatus=1 审核中
              if (Number(item.signStatus) === 3 || Number(item.signStatus) === 1) {
                const obj = {}
                const name = item.fixAttributeCommonVO.attendeeName
                const position = item.fixAttributeCommonVO.position ? '(' + item.fixAttributeCommonVO.position + ')' : ''
                obj.text = name + position
                obj.id = item.id
                obj.taskType = item.taskType
                obj.signStatus = item.signStatus
                newData.push(obj)
              }
            })
            this.passAttendeeList = newData

            if (this.routeParams.attendeeId.length) {
              this.applicantId = this.routeParams.attendeeId
              this.applicantName = this.routeParams.attendeeName
              this.applicantSignStatus = this.routeParams.signStatus
            } else if (this.passAttendeeList.length === 1) {
              this.applicantName = this.passAttendeeList[0].text
              this.applicantId = this.passAttendeeList[0].id
              this.applicantSignStatus = this.routeParams.signStatus
            }
          }
        }
      })
    },
    // 选择申请人
    applicantConfirm(value) {
      const conferenceId = this.routeParams.conferenceId
      this.$api({
        url: 'attendeeApi.mySelfapply',
        data: {
          conferenceId,
          pageNum: 1, // 传入固定参数，本接口仅需验证有数据即可
          pageSize: 10, // 传入固定参数，本接口仅需验证有数据即可
          statusEqual: '1', // 状态为待办
          attendeeId: value.id
        }
      })
        .then(res => {
          if (res.success) {
            const data = res.result
            if (data.list.length > 0) {
              let noticeStr = value.text + '的'
              const applyType = Number(data.list[0].type)
              if (applyType !== 1) {
                if (applyType === 2) {
                  noticeStr = noticeStr + '报名信息变更'
                } else if (applyType === 3) {
                  noticeStr = noticeStr + '取消报名'
                } else if (applyType === 4) {
                  noticeStr = noticeStr + '行程变更'
                } else if (applyType === 5) {
                  noticeStr = noticeStr + '请假'
                }
                noticeStr = noticeStr + '申请正在审核中'
                this.$dialog.alert({
                  message: noticeStr,
                  confirmButtonText: '我知道了',
                  className: 'attendeeDialog'
                })
              } else {
                this.applicantName = value.text
                this.applicantId = value.id
                this.applicantSignStatus = value.signStatus
                this.showApplicantPop = false
              }
            } else {
              this.applicantName = value.text
              this.applicantId = value.id
              this.applicantSignStatus = value.signStatus
              this.showApplicantPop = false
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 是否禁用弹窗
    handlePop() {
      if (this.routeParams.attendeeId.length) {
        return false
      } else {
        this.showApplicantPop = true
      }
    }
  }
}
</script>

<style scoped lang="scss">
.van-form {
  .van-cell {
    height: 53px;
    line-height: 33px;
    .van-cell__title {
      font-size: 15px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(25, 31, 36, 0.64);
    }
    .van-cell__right-icon {
      line-height: 33px;
    }
  }
}
.top {
  padding: 12px;
  .applicant-cell {
    border-radius: 8px 8px 0 0;
  }
  .cancel-reason {
    border-radius: 0 0 8px 8px;
    height: 200px;
  }
  // 滚轮选择器样式
  .applicant-pop {
    .applicant-pop-title {
      text-align: center;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: rgba(25, 31, 36, 0.64);
      border-bottom: 0.5px solid rgba(25, 31, 36, 0.08);
    }
    .van-picker {
      background: rgba(25, 31, 36, 0.04);
      ::v-deep .van-picker__columns .van-picker-column__item {
        font-size: 17px;
      }
      ::v-deep .van-picker__toolbar {
        height: 56px;
        line-height: 56px;
        margin-top: 16px;
        background-color: #fff;
      }
      ::v-deep .van-picker__cancel {
        font-size: 17px;
        width: 50%;
      }
      ::v-deep .van-picker__confirm {
        flex: 1;
        font-size: 17px;
        box-shadow: -0.5px 0px 0px 0px rgba(25, 31, 36, 0.08);
        color: #1e89ff;
      }
    }
  }
}
.bottom {
  padding: 10px 16px;
  position: fixed;
  bottom: 0;
  font-size: 18px;
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
.van-popup .van-picker-column__wrapper {
  margin-top: -100px !important;
}
</style>
