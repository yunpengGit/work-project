<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-01 22:40:33
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-24 17:00:46
-->
<template>
  <div class="enroll-manage-container">
    <van-search
      v-model="searchVal"
      shape="round"
      background="#fff"
      placeholder="姓名/手机号/单位名称/会议码"
      @search="search"
    />
    <div class="types-container">
      <swiper :options="swiperOptions" v-if="typesData.length">
        <swiper-slide v-for="(ele, index) in typesData" :key="index">
          <div
            class="types-item"
            :class="ele.checked ? 'types-item-checked' : ''"
            @click="typesChoice(index)"
          >
            {{ ele.text }}
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <div class="enroll-manage">
      <list
        :params="params"
        :clear="clear"
        @resetClear="resetClear"
        @onRefresh="onRefresh"
        @onLoad="onLoad"
      >
        <template v-slot:item="data">
          <div
            v-for="ele in data.data"
            :key="ele.id"
            class="list-item"
            @click="$router.push({
              name: 'attendee',
              query: {
                [$enc('conferenceId')]: $enc(routeParams.id),
                [$enc('attendeeId')]: $enc(ele.id)
              }
            })"
          >
            <dl>
              <dt>
                {{ ele.fixAttributeCommonVO.attendeeName }}
                <!-- <i :class="ele.signStatus === 3 ? 'refuse' : ''">{{ ele.signStatusStr }}</i> -->
              </dt>
              <dd>{{ ele.fixAttributeCommonVO.organizationName }}</dd>
              <dd><span>职务：</span>{{ ele.fixAttributeCommonVO.position }}</dd>
              <dd><span>联系方式：</span>{{ ele.fixAttributeCommonVO.phone }}</dd>
            </dl>
          </div>
        </template>
      </list>
    </div>
    <div class="single-btn-bottom">
      <van-button
        type="info"
        @click="$router.push({
          name: 'addAttendee',
          query: {
            [$enc('id')]: $enc(routeParams.id),
            [$enc('attendeeId')]: $enc(routeParams.attendeeId),
          }
        })"
      >添加参会人</van-button>
    </div>
  </div>
</template>

<script>
import list from '@/components/list'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  components: { list, swiper, swiperSlide },
  props: {
    routeParams: {
      default: Object
    }
  },
  data() {
    return {
      searchVal: '',
      typesData: [
        { checked: true, text: '全部', meetingStatus: '' },
        { checked: false, text: '正常参会', meetingStatus: '2' },
        { checked: false, text: '离会外出', meetingStatus: '3' },
        { checked: false, text: '提前离会', meetingStatus: '4' }
      ],
      swiperOptions: {
        slidesPerView: 'auto',
        spaceBetween: 12,
        slidesOffsetBefore: 16,
        freeMode: true
      },
      params: {
        httpUrl: 'desk.getEnrollManage',
        type: 'up',
        // 模拟数据
        httpParams: {
          conferenceId: '',
          resFlag: 2,
          nameOrPhoneOrAttendeeCodeOrOrgNameLike: '',
          sortName: 'createTime',
          sortStatus: 'desc',
          signStatusEqual: '2,3,-3,-2,-1',
          // 参会状态（1待参会 2参会中 3离会外出 4提前离会 5完成参会） 空字符串 → 全部
          meetingStatus: '',
          pageNum: 1,
          pageSize: 10
        }
      },
      clear: false
    }
  },
  created() {
    console.log(this.routeParams)
    this.$nextTick(() => {
      const id = this.routeParams.id
      this.params.httpParams.conferenceId = id
    })
  },
  methods: {
    search() {
      this.clear = true
      this.params.httpParams.pageNum = 1
      this.params.httpParams.nameOrPhoneOrAttendeeCodeOrOrgNameLike = this.searchVal
    },
    typesChoice(index) {
      // 当前选中的不允许点击
      if (this.typesData[index].checked) {
        return
      }
      this.typesData.forEach(ele => {
        ele.checked = false
      })
      this.typesData[index].checked = true
      const meetingStatus = this.typesData[index].meetingStatus
      this.clear = true
      this.params.httpParams.meetingStatus = meetingStatus
      this.params.httpParams.pageNum = 1
    },
    resetClear() {
      this.clear = false
    },
    onRefresh() {
      this.params.httpParams.pageNum++
      this.params.type = 'down'
    },
    onLoad() {
      this.params.httpParams.pageNum++
      this.params.type = 'up'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.enroll-manage-container {
  min-height: 100%;
  background-color: #f8f8f8;
  .types-container {
    width: 100%;
    height: 48px;
    .swiper-container {
      width: 100%;
      height: 100%;
      background-color: #fff;
      .swiper-slide {
        width: auto !important;
        @include list(row, flex-start, center);
        .types-item {
          font-size: 12px;
          text-align: center;
          padding: 9px 16px;
          border-radius: 15px;
          background-color: rgba(25, 31, 36, 0.04);
        }
        .types-item-checked {
          background-color: rgba(30, 137, 255, 1);
          color: #fff;
        }
      }
    }
  }
 .list-container {
    height: calc(100% - 102px);
    top: 102px;
    // padding-top: 10px;
    padding-bottom: 64px;
    .list-item {
      width: 100%;
      background-color: #fff;
      border-radius: 8px;
      margin-bottom: 10px;
      padding: 16px 16px 12px;
      i {
        border-radius: 8px;
        padding: 4px 14px;
        background-color: rgba(3, 190, 28, 0.08);
        color: #1E89FF;
      }
      .refuse {
        background-color: rgba(244, 249, 255, 1);
        color: rgba(30, 137, 255, 1);
      }
      dl {
        line-height: 18px;
        dt {
          font-size: 14px;
          font-weight: 500;
          @include list(row,space-between,center);
          margin-bottom: 8px;
        }
        dd {
          font-size: 13px;
          color: rgba(25, 31, 36, 0.64);
          margin-bottom: 4px;
          span {
            font-weight: 500;
          }
        }
      }
    }
  }
}
</style>
