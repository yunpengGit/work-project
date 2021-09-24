<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-03 22:51:22
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-27 16:09:30
-->
<template>
  <div class="accompany-data-container">
    <div
      v-for="(ele, index) in accompanyData"
      :key="index"
      class="material-item"
      @click="$router.push({
        name: 'attendee',
        query: {
          [$enc('conferenceId')]: $enc(routeParams.id),
          [$enc('attendeeId')]: $enc(ele.attendeeId)
        }
      })"
    >
      <div class="content">
        <div class="pic"><img :src="ele.ssoUserPhoto ? ele.ssoUserPhoto : ele.attendeeFixAttribute.sex === '2' ? femaleSex : male" alt=""></div>
        <ul>
          <li class="name">{{ ele.attendeeFixAttribute.attendeeName }} <span v-if="ele.attendeeFixAttribute.position">（{{ ele.attendeeFixAttribute.position }}）</span>   </li>
          <li class="phone">{{ ele.attendeeFixAttribute.organizationName || ele.attendeeFixAttribute.organizationSortName }}</li>
        </ul>
      </div>
      <img src="@/assets/images/conferenceBacklogArrow.svg" alt="" class="contacts-icon">
    </div>
  </div>
</template>

<script>
import male from '@/assets/images/male.png'
import femaleSex from '@/assets/images/femaleSex.png'
export default {
  props: {
    routeParams: {
      default: Object
    }
  },
  data() {
    return {
      male, femaleSex,
      accompanyData: []
    }
  },
  created() {
    const attendeeId = this.routeParams.attendeeId
    console.log(this.routeParams)
    this.$api({
      url: 'desk.getAccompany',
      data: {
        attendeeId: attendeeId
      }
    }).then(res => {
      if (res.code === 2000) {
        const data = res.result
        this.accompanyData = data
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.accompany-data-container {
  min-height: 100%;
  background-color: #FFFFFF rgba(25, 31, 36, 0.04);
  padding: 12px 0;
  .material-item {
    width: 100%;
    height: 64px;
    padding: 0 16px;
    background-color: #fff;
    @include list(row, space-between,center);
    position: relative;
    &::after {
      content: '';
      display: block;
      width: calc(100% - 72px);
      height: 1px;
      background-color: #ebedf0;
      @include absolute('',0,0,'');
    }
    .content {
      @include list(row, flex-start);
      .pic {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 16px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .name {
        font-size: 17px;
        line-height: 22px;
        margin-bottom: 2px;
      }
      .phone {
        font-size: 14px;
        color: rgba(25, 31, 36, 0.64);
        line-height: 20px;
      }
    }
    .contacts-icon {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
