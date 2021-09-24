<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-01 13:28:28
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-13 11:42:51
-->
<template>
  <div class="my-plan-container">
    <div v-if="arrangeData.length">
      <div
        v-for="(ele, index) in arrangeData"
        :key="index"
        class="material-list"
      >
        <div
          class="material-item"
          @click="linkTo(ele)"
        >
          <!-- <img :src="ele.src" alt=""> -->
          <van-cell-group>
            <van-cell is-link>
              <template #title>
                  <span class="custom-title">{{ele.text}}</span>
                </template>
            </van-cell>
            <!-- <van-cell :title="ele.text" is-link :value="ele.text" /> -->
          </van-cell-group>
        </div>
      </div>
    </div>
    <!-- <div class="attendee-top" v-if="detailData">
      <div class="attendee-header">
        <div class="head-portrait">
          <img :src="detailData.ssoUserPhoto" alt="">
        </div>
        <dl>
          <dt>{{ detailData.fixAttributeCommonVO.attendeeName }}</dt>
          <dd>单位：{{ detailData.fixAttributeCommonVO.organizationName }}</dd>
          <dd>职务：{{ detailData.fixAttributeCommonVO.position }}</dd>
          <dd>
            电话：{{ phoneShow? detailData.fixAttributeCommonVO.phone : phone }}
            <img :src="phoneShow ? hide :show" alt="" @click="phoneChange">
          </dd>
        </dl>
      </div>
      <div class="arrange-container">
        <div class="arrange">
          <div
            class="arrange-item"
            :class="!ele.isShow ? 'arrange-item-checked' : ''"
            v-for="(ele, index) in arrangeData"
            :key="index"
            @click="linkTo(ele)"
          >
            <img :src="ele.src" alt="">
            <span>{{ ele.text }}</span>
          </div>
        </div>
      </div>
    </div> -->
    <van-empty
      v-if="!arrangeData.length"
      :image="dataNull"
      description="暂无会议安排"
    />
  </div>
</template>

<script>
import show from '@/assets/images/show.svg'
import hide from '@/assets/images/hide.svg'
import attendeeCar from '@/assets/images/attendeeCar.svg'
import attendeeStay from '@/assets/images/attendeeStay.svg'
import attendeeMeal from '@/assets/images/attendeeMeal.svg'
import attendeeCard from '@/assets/images/attendeeCard.svg'
import dataNull from '@/assets/images/dataNull.png'
export default {
  props: {
    routeParams: {
      type: Object
    }
  },
  data() {
    return {
      show, hide, attendeeCar, attendeeStay, attendeeMeal, attendeeCard, dataNull,
      detailData: null,
      // 查询安排详情页需要结合 conferenceId + attendeeId
      conferenceId: null,
      attendeeId: null,
      // 电话号码是否全部显示
      phoneShow: false,
      arrangeData: []
    }
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
    const conferenceId = this.routeParams.id
    this.conferenceId = conferenceId
    const getId = () => {
      return this.$api({
        url: 'desk.getAttendeeFromMeetingId',
        data: {
          conferenceId
        }
      }).then(res => {
        if (res.code === 2000) {
          return res.result.id
        }
      })
    }
    const getPlan = id => {
      return this.$api({
        url: 'desk.getAttendee',
        data: {
          id
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result
          this.detailData = data
          // if (data.vehicleStatus === 2) {
          // 依次是用车安排 / 住宿安排 / 用餐安排 / 票证安排
          const key = ['vehicleStatus', 'stayStatus', 'foodStatus', 'ticketStatus']
          const value = [{ text: '用车安排', src: attendeeCar, link: 'planCar', isShow: false },
            { text: '住宿安排', src: attendeeStay, link: 'planStay', isShow: false },
            { text: '用餐安排', src: attendeeMeal, link: 'planMeal', isShow: false },
            { text: '票证安排', src: attendeeCard, link: 'planCard', isShow: false }]
          const arrangeData = []
          for (let i = 0; i < key.length; i++) {
            if (this.detailData[key[i]] === 2) {
              value[i].isShow = true
            } else {
              value[i].isShow = false
            }
            arrangeData.push(value[i])
          }
          arrangeData.forEach(ele => {
            if (ele.isShow) {
              this.arrangeData.push(ele)
            }
          })
          console.log(this.arrangeData)
          // }
        }
      })
    }
    const getInfo = async function() {
      // 先获取id 再通过id获取安排
      const id = await getId()
      this.attendeeId = id
      getPlan(id)
    }.bind(this)
    getInfo()
  },
  methods: {
    linkTo(ele) {
      if (ele.isShow) {
        this.$router.push({
          name: ele.link,
          query: {
            [this.$enc('conferenceId')]: this.$enc(this.conferenceId),
            [this.$enc('attendeeId')]: this.$enc(this.attendeeId)
          }
        })
      }
    },
    // 切换手机号码状态
    phoneChange() {
      this.phoneShow = !this.phoneShow
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.my-plan-container::v-deep {
  padding-top: 10px;
  .material-item {
    width: 100%;
    height: 56px;
    padding: 0 16px;
    background-color: #fff;
    @include list(row,flex-start,center);
    .material-pic {
      width: 24px;
      height: 24px;
      margin-right: 16px;
    }
    .van-cell-group {
      flex: 1;
    }
    .van-cell {
      height: 56px;
      line-height: 56px;
      padding: 0;
      .van-cell__left-icon, .van-cell__right-icon {
        line-height: 56px;
      }
    }
  }
  .van-empty__image {
    width: 176px;
    height: 103px;
  }
//   height: 100%;
//   background-color: #fff;
//   .attendee-header {
//     width: 100%;
//     height: 182px;
//     padding: 20px 16px 0;
//     background: url('../../../../assets/images/attendeeHeaderBg.svg') repeat-x center;
//     @include list(row,flex-start,initial);
//     .head-portrait {
//       width: 56px;
//       height: 56px;
//       border-radius: 50%;
//       margin-right: 10px;
//       overflow: hidden;
//       img {
//         width: 100%;
//         height: 100%;
//       }
//     }
//     dl {
//       color: #fff;
//       dt {
//         font-size: 20px;
//         font-weight: 500;
//         line-height: 25px;
//         margin-bottom: 10px;
//       }
//       dd {
//         font-size: 14px;
//         line-height: 18px;
//         margin-bottom: 4px;
//         @include list(row,flex-start,center);
//         img {
//           margin-left: 12px;
//         }
//       }
//     }
//   }
//   .arrange-container {
//     width: 100%;
//     padding: 0 16px;
//     margin: -40px 0 16px;
//     .arrange {
//       width: 100%;
//       height: 80px;
//       background-color: #fff;
//       border-radius: 12px;
//       padding: 16px 10px 0;
//       .arrange-item {
//         width: 25%;
//         display: inline-block;
//         text-align: center;
//         color: rgba(25, 31, 36, 0.64);
//         font-size: 13px;
//         img {
//           margin: 0 auto 10px;
//         }
//       }
//       .arrange-item-checked {
//         opacity: .3;
//       }
//     }
//   }
//   .van-empty__image {
//     width: 176px;
//     height: 103px;
//   }
}
</style>
<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.material-container::v-deep {
  min-height: 100%;
  background-color: #f8f8f8;
  .list-container {
    // height: calc(100% - 10px);
    // top: 10px;
    padding: 0;
    // margin-top: 10px;
  }
  .material-item {
    width: 100%;
    height: 56px;
    padding: 0 16px;
    background-color: #fff;
    @include list(row,flex-start,center);
    .material-pic {
      width: 24px;
      height: 24px;
      margin-right: 16px;
    }
    .van-cell-group {
      flex: 1;
    }
    .van-cell {
      height: 56px;
      line-height: 56px;
      padding: 0;
      .van-cell__left-icon, .van-cell__right-icon {
        line-height: 56px;
      }
    }
  }
  .van-empty__image {
    width: 176px;
    height: 103px;
  }
}
</style>
