<!--
* @Descripttion:
* @Author: wanghz
* @Date: 2021-07-16 15:44:00
* @LastEditors: Please set LastEditors
* @LastEditTime:
-->
<template>
  <div>
    <div v-for="ele in allEscortData" :key="ele.id" class="all-escort">
      <div class="all-escort-title">{{ ele.title }}</div>
      <div v-for="(eleChild, index) in ele.children" :key="index" class="my-escort-item">
        <div class="people-info">
          <div class="head-photo"><img :src="eleChild.showPhotoUrl" alt="" /></div>
          <div class="name">
            <div class="attendee-name">
              {{ eleChild.attendeeFixAttribute.attendeeName
              }}<span
                style="margin-left: 5px"
                v-if="eleChild.attendeeFixAttribute.position && eleChild.attendeeFixAttribute.position.length"
                >({{ eleChild.attendeeFixAttribute.position }})</span
              >
            </div>
            <div class="organization-name">{{ eleChild.attendeeFixAttribute.organizationName }}</div>
          </div>
        </div>
        <a :href="'tel:' + eleChild.attendeeFixAttribute.phone"><img src="@/assets/images/phone2x.png" alt="" /></a>
      </div>
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
      allEscortData: [],
      userInfo: {}
    }
  },
  async created() {
    this.userInfo = await this.getUserInfo()
    this.getAttendeeList()
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

    // 获取参会人列表
    getAttendeeList() {
      const conferenceId = this.routeParams.conferenceId
      this.$api({
        url: 'attendeeApi.getAttendeeList',
        data: {
          conferenceId,
          roleId: 2
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result
          /**
           * signStatus=0 草稿
           * signStatus=1 待审核
           * signStatus=2 审核不通过
           * signStatus=3 审核通过
           * signStatus=-1 取消参会
           * signStatus=-2 失效
           * signStatus= -3 报名驳回
           */

          if (data && data.list.length) {
            data.list.forEach(item => {
              if (Number(this.userInfo.id) === Number(item.id)) {
                this.getEscortData(item.id, '我的陪同')
              } else {
                this.getEscortData(item.id, item.fixAttributeCommonVO.attendeeName + '的陪同')
              }
            })
          }
        }
      })
    },
    // 获取陪同人员
    getEscortData(attendeeId, title) {
      this.$api({
        url: 'attendeeApi.escort',
        data: {
          attendeeId
        }
      }).then(res => {
        if (res.success) {
          const data = res.result
          data.forEach(element => {
            if (element.name === '陪同人员') {
              this.formatEscortStr(element.attendeeAccompany, title)
            }
          })
        } else {
          this.$toast(res.msg)
        }
      })
    },

    formatEscortStr(data, title = '') {
      data.forEach(item => {
        var showPhotoUrl = ''
        if (item.ssoUserPhoto !== null && item.ssoUserPhoto !== '') {
          showPhotoUrl = item.ssoUserPhoto
        } else {
          if (Number(item.attendeeFixAttribute.sex) === 1) {
            showPhotoUrl = require('../../../../assets/images/defaultManPhoto.png')
          } else if (Number(item.attendeeFixAttribute.sex) === 2) {
            showPhotoUrl = require('../../../../assets/images/defaultWomenPhoto.png')
          } else {
            showPhotoUrl = require('../../../../assets/images/defaultPhoto.png')
          }
        }
        item.showPhotoUrl = showPhotoUrl
      })
      const obj = {}
      obj.children = data
      obj.title = title
      this.allEscortData.push(obj)
    }
  }
}
</script>

<style scoped lang="scss">
.all-escort {
  margin-bottom: 10px;
  .all-escort-title {
    font-size: 13px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(25, 31, 36, 0.64);
    padding: 13px 16px;
  }
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
}
</style>
