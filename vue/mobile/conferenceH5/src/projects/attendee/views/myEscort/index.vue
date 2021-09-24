<!--
* @Descripttion:
* @Author: wanghz
* @Date: 2021-07-16 15:44:00
* @LastEditors: Please set LastEditors
* @LastEditTime:
-->
<template>
  <div>
    <div v-for="ele in myEscortListData" :key="ele.id" class="my-escort-item" @click="nextPage(ele)">
      <div class="people-info">
        <div class="head-photo"><img :src="ele.showPhotoUrl" alt="" /></div>
        <div class="name">
          <div class="attendee-name">
            {{ ele.attendeeFixAttribute.attendeeName }}{{ ele.attendeeFixAttribute.position }}
            <span
                style="margin-left: 5px"
                v-if="ele.attendeeFixAttribute.position && ele.attendeeFixAttribute.position.length"
                >({{ ele.attendeeFixAttribute.position }})</span
              >
          </div>
          <div class="organization-name">{{ ele.attendeeFixAttribute.organizationName }}</div>
        </div>
      </div>
      <img src="@/assets/images/signPeopleRightArrow.png" alt="" />
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
      myEscortListData: []
    }
  },
  created() {
    this.getMyEscortData()
  },
  mounted() {},
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
    // 我的陪同
    async getMyEscortData() {
      const attendeeId = this.routeParams.currentAttendeeId
      const userInfo = await this.getUserInfo()
      this.$api({
        url: 'attendeeApi.myEscort',
        data: {
          attendeeId
        }
      }).then(res => {
        if (res.success) {
          const data = res.result
          data.forEach(item => {
            var showPhotoUrl = ''
            if (item.ssoUserPhoto !== null && item.ssoUserPhoto !== '') {
              showPhotoUrl = item.ssoUserPhoto
            } else {
              if (Number(item.attendeeFixAttribute.sex) === 1) {
                showPhotoUrl = require('../../../../assets/images/defaultManPhoto.png')
              } else if (Number(userInfo.sex) === 2) {
                showPhotoUrl = require('../../../../assets/images/defaultWomenPhoto.png')
              } else {
                showPhotoUrl = require('../../../../assets/images/defaultPhoto.png')
              }
              item.showPhotoUrl = showPhotoUrl
            }
          })
          this.myEscortListData = data
        } else {
          this.$toast(res.msg)
        }
      })
    },
    nextPage(ele) {
      this.$router.push({
        name: 'escortDetail',
        query: {
          [this.$enc('attendeeId')]: this.$enc(ele.attendeeId)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.my-escort-item {
  background-color: #fff;
  height: 64px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f1f1f2;
  .people-info {
    display: flex;
    align-items: center;
    .head-photo {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      margin-right: 16px;
      img {
        border-radius: 20px;
        width: 100%;
        height: 100%;
      }
    }
    .name {
      .attendee-name {
        font-size: 17px;
        height: 22px;
        line-height: 22px;
        margin-bottom: 2px;
      }
      .organization-name {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(25, 31, 36, 0.56);
      }
    }
  }
  img {
    width: 16px;
  }
}
</style>
