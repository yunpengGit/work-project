<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-01 22:40:33
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-30 14:28:13
-->
<template>
  <div class="enroll-manage-container">
    <van-search
      v-model="searchVal"
      shape="round"
      background="#fff"
      placeholder="搜索"
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
            v-for="(ele, index) in data.data"
            :key="index"
            class="list-item"
            @click="linkTo(ele, index)"
          >
            <dl>
              <dt>{{ ele.fixAttributeCommonVO.attendeeName }}<i :class="ele.signStatus === 3 ? ele.changeStatus === 1 ? '' : 'refuse' : ''">{{ ele.changeStatus === 1 ? '变更待审核' : ele.signStatusStr }}</i></dt>
              <dd>{{ ele.fixAttributeCommonVO.organizationSortName ? ele.fixAttributeCommonVO.organizationSortName : ele.fixAttributeCommonVO.organizationName }}</dd>
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
            [$enc('replaceIdent')]: $enc(4)
          }
        })"
      >代他人报名</van-button>
    </div>
  </div>
</template>

<script>
import list from '@/components/list'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Watermark from '@/utils/watermark'
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
        { checked: true, text: '全部', signStatusEqual: '2,3,1,-3,-1' },
        { checked: false, text: '待审核', signStatusEqual: '1' },
        { checked: false, text: '审核通过', signStatusEqual: '3' },
        { checked: false, text: '审核不通过', signStatusEqual: '-3,-1,2' }
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
          // resFlag: 1,
          attendeeNameLike: '',
          // statusFlag: 1,
          sortName: 'createTime',
          sortStatus: 'desc',
          // 参会人状态 -3 报名驳回 -2 失效 -1 取消参会 0草稿 1报名待审核 2 报名不通过  3成功报名
          // signStatusEqual: '',
          signStatusEqual: '2,3,1,-3,-1',
          pageNum: 1,
          pageSize: 10
        }
      },
      clear: false
    }
  },
  created() {
    // sessionStorage.getItem('userBasicInfo') && Watermark.set(sessionStorage.getItem('userBasicInfo'))
    this.$nextTick(() => {
      const id = this.routeParams.id
      this.params.httpParams.conferenceId = id
    })
  },
  methods: {
    linkTo(ele, index) {
      console.log(ele.changeStatus)
      let name = 'attendeeForms'
      if (ele.changeStatus === 1) {
        name = 'attendeeFormsChange'
      }
      this.$router.push({
        name,
        query: {
          [this.$enc('id')]: this.$enc(this.routeParams.id),
          [this.$enc('attendeeId')]: this.$enc(ele.fixAttributeCommonVO.attendeeId),
          [this.$enc('phone')]: this.$enc(ele.fixAttributeCommonVO.phone),
          [this.$enc('name')]: this.$enc(ele.fixAttributeCommonVO.attendeeName)
        }
      })
    },
    search() {
      this.clear = true
      this.params.httpParams.pageNum = 1
      this.params.httpParams.attendeeNameLike = this.searchVal
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
      const signStatusEqual = this.typesData[index].signStatusEqual
      this.clear = true
      this.params.httpParams.signStatusEqual = signStatusEqual
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
  padding-bottom: 1px;
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
<style lang="scss" scoped>
.enroll-manage-container::v-deep {
  .van-pull-refresh {
    padding-top: 10px;
  }
}
</style>
