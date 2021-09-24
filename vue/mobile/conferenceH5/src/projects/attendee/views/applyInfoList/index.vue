<!--
* @Descripttion:
* @Author: wanghz
* @Date: 2021-07-16 15:44:00
* @LastEditors: Please set LastEditors
* @LastEditTime:
-->
<template>
  <div>
    <list :params="params" @onRefresh="onRefresh" @onLoad="onLoad">
      <template v-slot:item="data">
        <div
          v-for="ele in filterData(data.data)"
          :key="ele.id"
          class="sign-list-item"
          :style="{
            'margin-bottom': Number(ele.userId) === Number(userInfo.id) ? '10px' : '',
            'box-shadow': Number(ele.userId) === Number(userInfo.id) ? '' : '0px 1px 0px 0px rgba(25, 31, 36, 0.08)'
          }"
          @click="linkDetail(ele)"
        >
          <div class="people-info">
            <div class="head-photo"><img :src="ele.showPhotoUrl" alt="" /></div>
            <div :class="[Number(ele.userId) === Number(userInfo.id) ? 'self-name' : 'name']">
              {{ ele.fixAttributeCommonVO.attendeeName != null ? ele.fixAttributeCommonVO.attendeeName : '' }}
            </div>
            <div v-if="Number(ele.userId) === Number(userInfo.id)" class="self">本人</div>
          </div>
          <div class="status">
            <div>
              <span v-if="ele.signStatus == 3" class="pass">{{ ele.signStatusStr }}</span>
              <span
v-else-if="ele.signStatus == 2"
class="not-pass"
                ><img src="@/assets/images/signPeopleWarning.png" alt="" /> {{ ele.signStatusStr }}</span
              >
              <span v-else-if="ele.signStatus == 1" class="inreview">审核中...</span>
            </div>
            <img class="right-arrow" src="@/assets/images/signPeopleRightArrow.png" alt="" />
          </div>
        </div>
      </template>
    </list>
  </div>
</template>

<script>
import list from '@/components/list'
export default {
  props: {
    routeParams: {
      type: Object
    }
  },
  components: {
    list
  },
  data() {
    return {
      params: {
        httpUrl: 'attendeeApi.getAttendeeList',
        type: 'up',
        httpParams: {
          conferenceId: '',
          signStatusNotIn: '0, -1,-2,-3', // 过滤掉signStatus=0(草稿)的数据
          pageNum: 1,
          pageSize: 12,
          attendeeRoleFlagEqual: '0,1,2,3,4'
        }
      },
      userInfo: {},
      clear: false
    }
  },
  async created() {
    this.$nextTick(() => {
      this.params.httpParams.conferenceId = this.routeParams.conferenceId
    })
    this.userInfo = await this.getUserInfo()
  },
  methods: {
    // 获取用户id
    getUserInfo() {
      return new Promise(resolve => {
        this.$api({
          url: 'attendeeApi.userInfo'
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result
            resolve(data)
          }
        })
      })
    },
    // 处理列表数据
    filterData(data) {
      let arr = []
      data.forEach(item => {
        // 处理头像
        var showPhotoUrl = ''
        if (item.ssoUserPhoto !== null && item.ssoUserPhoto !== '') {
          showPhotoUrl = item.ssoUserPhoto
        } else {
          if (Number(item.fixAttributeCommonVO.sex) === 1) {
            showPhotoUrl = require('../../../../assets/images/defaultManPhoto.png')
          } else if (Number(this.userInfo.sex) === 2) {
            showPhotoUrl = require('../../../../assets/images/defaultWomenPhoto.png')
          } else {
            showPhotoUrl = require('../../../../assets/images/defaultPhoto.png')
          }
        }
        item.showPhotoUrl = showPhotoUrl
        arr.push(item)
      })
      // 如果是由行程变更跳转而来需筛选审核通过和审核中的数据
      if (this.routeParams.Type === 'editJourney') {
        const newArr = []
        arr.forEach(item => {
          if (Number(item.signStatus) === 3 || Number(item.signStatus) === 1) {
            newArr.push(item)
          }
        })
        arr = newArr
      }
      // 将本人报名信息提前到最顶端
      const own = element => Number(element.userId) === Number(this.userInfo.id)
      const ownIndex = arr.findIndex(own)
      if (ownIndex !== -1) {
        const ownObj = arr[ownIndex]
        arr.splice(ownIndex, 1)
        arr.unshift(ownObj)
      }
      return arr
    },
    // 我作为参会人的申请
    mySelfapply(value) {
      return new Promise(resolve => {
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
        }).then(res => {
          if (res.success) {
            const data = res.result
            resolve(data)
          }
        })
      })
    },
    async linkDetail(ele) {
      if (this.routeParams.Type === 'editApply' || this.routeParams.Type === 'editJourney') {
        const result = await this.mySelfapply(ele)
        if (result.list.length > 0) {
          let noticeStr = ele.fixAttributeCommonVO.attendeeName + '的'
          const applyType = Number(result.list[0].type)
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
            return
          }
        }
      }
      if (this.routeParams.Type === 'editApply') {
        // 报名变更
        this.$router.push({
          name: 'editApply',
          query: {
            [this.$enc('conferenceId')]: this.$enc(this.routeParams.conferenceId),
            [this.$enc('attendeeId')]: this.$enc(ele.id)
          }
        })
      } else if (this.routeParams.Type === 'editJourney') {
        // 行程变更
        this.$router.push({
          name: 'editJourney',
          query: {
            [this.$enc('conferenceId')]: this.$enc(this.routeParams.conferenceId),
            [this.$enc('attendeeId')]: this.$enc(ele.id),
            [this.$enc('attendeeName')]: this.$enc(ele.fixAttributeCommonVO.attendeeName)
          }
        })
      } else {
        this.$router.push({
          name: 'applyInfoDetail',
          query: {
            [this.$enc('conferenceId')]: this.$enc(this.routeParams.conferenceId),
            [this.$enc('attendeeId')]: this.$enc(ele.id),
            [this.$enc('attendeeName')]: this.$enc(ele.fixAttributeCommonVO.attendeeName),
            [this.$enc('signStatus')]: this.$enc(ele.signStatus)
          }
        })
      }
    },
    onRefresh() {
      this.params.httpParams.pageNum++
      this.params.type = 'up'
    },
    onLoad() {
      this.params.httpParams.pageNum++
      this.params.type = 'up'
    },
    resetClear() {
      this.clear = false
    }
  }
}
</script>

<style scoped lang="scss">
.list-container {
  height: calc(100% - 0px);
  top: 0px;
  padding: 0;
  .van-pull-refresh {
    padding-top: 0;
  }
}
.sign-list-item {
  background-color: #fff;
  height: 64px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .people-info {
    display: flex;
    align-items: center;
    .head-photo {
      width: 40px;
      height: 40px;
      margin-right: 16px;
      img {
        border-radius: 20px;
        width: 100%;
        height: 100%;
      }
    }
    .self-name {
      font-size: 17px;
    }
    .name {
      height: 22px;
      line-height: 22px;
      font-size: 17px;
      width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .self {
      width: 32px;
      height: 14px;
      background: #ffffff;
      border-radius: 3px;
      border: 1px solid #1e89ff;
      font-size: 10px;
      color: #1e89ff;
      line-height: 14px;
      text-align: center;
      margin-left: 5px;
    }
  }
  .status {
    font-size: 14px;
    display: flex;
    align-items: center;
    .right-arrow {
      width: 16px;
    }
  }
  .pass {
    color: rgba(25, 31, 36, 0.56);
  }
  .not-pass {
    color: #ea340f;
    display: flex;
    align-items: center;
    img {
      width: 16px;
      margin-right: 5px;
    }
  }
  .inreview {
    color: #f8b700;
  }
}
</style>
