<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-08-06 18:42:03
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-09-09 18:46:38
-->
<template>
  <div class="resource-container">
    <div
      v-if="detailData"
      class="attendee-header"
    >
      <div class="head-portrait">
        <img :src="detailData.ssoUserPhoto" alt="">
      </div>
      <dl>
        <dt>
          <span>{{ detailData.fixAttributeCommonVO.attendeeName }}</span>
          <van-icon
            name="arrow"
            @click="$router.push({
              name: 'attendee',
              query: {
                [$enc('conferenceId')]: $enc(routeParams.id),
                [$enc('attendeeId')]: $enc(routeParams.attendeeId)
              }
            })"
          />
        </dt>
        <!-- <dd>单位：{{ detailData.fixAttributeCommonVO.organizationName }}</dd> -->
        <dd>职务：{{ detailData.fixAttributeCommonVO.position }}</dd>
        <dd>
          电话：{{ phoneShow? detailData.fixAttributeCommonVO.phone : phone }}
          <img :src="phoneShow ? hide :show" alt="" @click="phoneChange">
        </dd>
      </dl>
    </div>
    <stayList
      v-if="isLoading && routeParams.taskType === '52'"
      :routeParams = routeParams
    />
    <mealList
      v-if="isLoading && routeParams.taskType === '51'"
      :routeParams = routeParams
    />
    <cardList
      v-if="isLoading && routeParams.taskType === '53'"
      :routeParams = routeParams
    />
    <!-- <carList
      v-if="isLoading && routeParams.taskType === '61' || routeParams.taskType === '62' || routeParams.taskType === '63'"
      :routeParams = routeParams
    /> -->
    <!-- getStayList -->
    <div class="single-btn-bottom" v-if="isLoading">
      <van-button @click="ignoreHandler">忽略</van-button>
      <van-button
        type="info"
        @click="handler"
      >{{ buttonText }}</van-button>
    </div>
  </div>
</template>

<script>
import show from '@/assets/images/showDark.svg'
import hide from '@/assets/images/hideDark.svg'
import stayList from './list/stayList'
import mealList from './list/mealList'
import cardList from './list/cardList'
// import carList from './list/carList'
export default {
  components: {
    stayList,
    mealList,
    cardList
    // carList
  },
  props: {
    routeParams: {
      type: Object
    }
  },
  data() {
    return {
      hide, show,
      detailData: null,
      phoneShow: false,
      // 是否加载完毕
      isLoading: false,
      // 跳转的url
      linkName: '',
      // 按钮文字
      buttonText: '',
      // 该场会议详情
      conferenceData: null
    }
  },
  watch: {
    // isLoading(newStatus){
    //   console.log(newStatus,"news")
    // }
  },
  computed: {
    // 手机号码隐藏中间四位
    phone() {
      const phone = this.detailData.fixAttributeCommonVO.phone
      const result = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
      return result
    }
  },
  created() {
    const taskType = this.routeParams.taskType
    console.log(this.routeParams)
    if (taskType === '51') {
      this.buttonText = '分配用餐'
    } else if (taskType === '52') {
      this.buttonText = '分配房间'
    } else if (taskType === '53') {
      this.buttonText = '分配票证'
    } else if (taskType === '61' || taskType === '62' || taskType === '63') {
      this.buttonText = '分配车辆'
    }
    this.getConferenceDetail()
    this.getAttendeeDetail()
    console.log(this.routeParams)
  },
  methods: {
    handler() {
      const conferenceId = this.routeParams.id
      const attendeeId = this.routeParams.attendeeId
      const taskType = this.routeParams.taskType
      const taskId = this.routeParams.taskId
      const startTime = this.conferenceData.startTime
      const endTime = this.conferenceData.endTime
      if (taskType === '52') {
        this.$router.push({
          name: 'backlogDetail/stay',
          query: {
            [this.$enc('id')]: this.$enc(conferenceId),
            [this.$enc('attendeeId')]: this.$enc(attendeeId),
            [this.$enc('taskType')]: this.$enc(taskType),
            [this.$enc('taskId')]: this.$enc(taskId),
            [this.$enc('startTime')]: this.$enc(startTime),
            [this.$enc('endTime')]: this.$enc(endTime)
          }
        })
      } else if (taskType === '61' || taskType === '62' || taskType === '63') {
        this.$router.push({
          name: 'backlogDetail/useCar',
          query: {
            [this.$enc('id')]: this.$enc(conferenceId),
            [this.$enc('attendeeId')]: this.$enc(attendeeId),
            [this.$enc('taskType')]: this.$enc(taskType),
            [this.$enc('taskId')]: this.$enc(taskId),
            [this.$enc('startTime')]: this.$enc(startTime),
            [this.$enc('endTime')]: this.$enc(endTime)
          }
        })
      } else if (taskType === '51') {
        this.$router.push({
          name: 'backlogDetail/meal',
          query: {
            [this.$enc('id')]: this.$enc(conferenceId),
            [this.$enc('attendeeId')]: this.$enc(attendeeId),
            [this.$enc('startTime')]: this.$enc(startTime),
            [this.$enc('endTime')]: this.$enc(endTime),
            [this.$enc('taskType')]: this.$enc(taskType),
            [this.$enc('taskId')]: this.$enc(taskId)
          }
        })
      } else if (taskType === '53') {
        const detaiData = JSON.stringify(this.detailData)
        sessionStorage.setItem('cardUserInfo', detaiData)
        this.$router.push({
          name: 'backlogDetail/card',
          query: {
            [this.$enc('id')]: this.$enc(conferenceId),
            [this.$enc('attendeeId')]: this.$enc(attendeeId),
            [this.$enc('taskType')]: this.$enc(taskType),
            [this.$enc('taskId')]: this.$enc(taskId)
          }
        })
      }
    },
    // 忽略
    ignoreHandler() {
      this.$dialog.confirm({
        title: '忽略该任务',
        message: '确定忽略？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        className: 'customDialog'
      }).then(() => {
        const taskId = this.routeParams.taskId
        const params = [{
          id: taskId,
          result: 110
        }]
        this.$api({
          url: 'task.ignoreTask',
          data: params
        }).then(res => {
          if (res.code === 2000) {
            this.$toast.success('操作成功')
            setTimeout(() => {
              this.$router.go(-1)
              // this.$router.replace({
              //   name: 'backlog',
              //   [this.$enc('id')]: this.$enc(this.routeParams.id)
              // })
            }, 500)
          }
        })
      }).catch(() => {
        this.$toast('取消忽略')
      })
    },
    // 切换手机号码状态
    phoneChange() {
      this.phoneShow = !this.phoneShow
    },
    // 获取详情
    getAttendeeDetail() {
      return new Promise(resolve => {
        const attendeeId = this.routeParams.attendeeId
        this.$api({
          url: 'attendee.getAttendeeDetail',
          data: {
            id: attendeeId
          }
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result
            // 将用户姓名和手机号码保存下来 添加联系人时用
            const attendeeInfo = {
              name: data.fixAttributeCommonVO ? data.fixAttributeCommonVO.attendeeName ? data.fixAttributeCommonVO.attendeeName : '' : '',
              phone: data.fixAttributeCommonVO ? data.fixAttributeCommonVO.phone ? data.fixAttributeCommonVO.phone : '' : ''
            }
            sessionStorage.setItem('attendeeInfo', JSON.stringify(attendeeInfo))
            this.detailData = data
          }
        })
      })
    },
    // 获取该场会议详情
    getConferenceDetail() {
      const id = this.routeParams.id
      this.$api({
        url: 'desk.getDetail',
        data: {
          id
        }
      }).then(res => {
        if (res.code === 2000) {
          this.conferenceData = res.result
          this.isLoading = true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.resource-container {
  min-height: 100%;
  background-color: #f8f8f8;
  width: 100%;
  padding-bottom: 64px;
  max-height: 120px;
  .attendee-header {
    width: 100%;
    padding: 20px 16px;
    background-color: #fff;
    @include list(row,flex-start,initial);
    .head-portrait {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      margin-right: 10px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    dl {
      flex: 1;
      width: 100%;
      // color: #fff;
      dt {
        width: 100%;
        font-size: 20px;
        font-weight: 500;
        line-height: 25px;
        margin-bottom: 10px;
        @include list(row, space-between,center);
      }
      dd {
        font-size: 14px;
        line-height: 18px;
        margin-bottom: 4px;
        @include list(row,flex-start,center);
        img {
          margin-left: 12px;
        }
      }
    }
  }
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
</style>
