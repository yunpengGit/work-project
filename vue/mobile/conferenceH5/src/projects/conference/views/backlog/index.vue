<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-27 22:07:05
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-30 14:15:11
-->
<template>
  <div class="backlog-container">
    <van-search
      v-model="searchVal"
      shape="round"
      background="#fff"
      placeholder="搜索"
      @search="search"
    />
    <div class="tabs-type">
      <div
        v-for="(ele, index) in tabsTypeData"
        :key="ele.text"
        class="tabs-type-item"
        :class="ele.checked ? 'tabs-type-item-checked' : ''"
        @click="tabsTypeHandle(index)"
      >
        {{ ele.text }}
        <i :class="ele.checked ? 'show' : ''"></i>
      </div>
    </div>
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
    <div class="backlog-list">
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
            :key="ele.id"
            class="list-item"
            @click="showDetail(ele, index)"
          >
            <h6>{{ ele.conferenceName }}</h6>
            <p>
              <span>{{ ele.todoTitle.replace('-',' | ') }}</span>
            </p>
            <div class="apply-time">申请时间：{{ ele.createTime }}</div>
          </div>
          <!-- <van-popup
            v-model="popupShow"
            closeable
            close-icon="close"
            close-on-popstate
          >
            <ul class="backlog-detail">
              <li class="backlog-detail-title">{{ data.data[popupIndex].todoTitle.replace('-',' | ') }}</li>
              <li class="backlog-detail-status">{{ data.data[popupIndex].resultStr }}</li>
              <li>申请人：{{ data.data[popupIndex].attendeeName }}</li>
              <li v-if="data.data[popupIndex].verifyUserName">审核人：{{ data.data[popupIndex].verifyUserName }}</li>
              <li>申请时间：{{ data.data[popupIndex].createTime }}</li>
              <li v-if="data.data[popupIndex].verifyTime">审核时间：{{ data.data[popupIndex].verifyTime }}</li>
            </ul>
          </van-popup> -->
        </template>
      </list>
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
      type: Object
    }
  },
  data() {
    return {
      searchVal: '',
      // 详情弹窗是否出现
      popupShow: false,
      popupIndex: 0,
      tabsTypeData: [
        { text: '我的待办', checked: true },
        { text: '我的已办', checked: false }
      ],
      swiperOptions: {
        slidesPerView: 'auto',
        spaceBetween: 12,
        slidesOffsetBefore: 16,
        freeMode: true
      },
      typesData: [
        { checked: true, text: '全部', typeEqual: '' },
        { checked: false, text: '报名审核', typeEqual: 1 },
        { checked: false, text: '变更审核', typeEqual: 2 },
        { checked: false, text: '取消报名', typeEqual: 3 },
        { checked: false, text: '行程变更', typeEqual: 4 },
        { checked: false, text: '请假', typeEqual: 5 },
        { checked: false, text: '住宿分配', typeEqual: 52 },
        { checked: false, text: '接站用车', typeEqual: 61 },
        { checked: false, text: '送站用车', typeEqual: 62 },
        { checked: false, text: '会议用车', typeEqual: 63 },
        { checked: false, text: '用餐分配', typeEqual: 51 },
        { checked: false, text: '票证分配', typeEqual: 53 }
      ],
      params: {
        httpUrl: 'task.getTask',
        type: 'up',
        // 模拟数据
        httpParams: {
          conferenceId: '',
          // 此参数接口文档没找到 上一版本加了此字段 复制过来的
          sortStatus: 'desc',
          sortName: 'attendeetask.level desc, attendeetask.createTime',
          // 待办名称模糊查询
          todoTitleLike: '',
          // 参会人姓名模糊查询
          // 1 → 待办 2 → 已办 ? 到底是待办是1还是2 已办是2还是1 我也不知道 接口文档传1、2 但是上一版本源码传2、1
          statusFlag: 1,
          typeEqual: '',
          pageNum: 1,
          pageSize: 10
        }
      },
      // 是否将数据内容清空（筛选的时候需要）
      clear: false
    }
  },
  created() {
    console.log(this.routeParams)
    this.$nextTick(() => {
      const id = this.routeParams.id
      if (id) {
        // this.params.httpParams.sortName = 'verifyTime'
        this.params.httpParams.conferenceId = id
      } else {
        this.$set(this.params, 'immediateCheck', true)
      }
    })
  },
  methods: {
    showDetail(ele, index) {
      const conferenceId = ele.conferenceId
      const attendeeId = ele.attendeeId
      const taskType = ele.type
      const taskId = ele.id
      const startTime = ele.startTime
      const endTime = ele.endTime
      let name = ''
      console.log(ele, 'ele!!!!!')
      // console.log(typeof this.params.httpParams.statusFlag)
      if (String(this.params.httpParams.statusFlag) === '1') {
        // 待办跳转
        if (taskType === 1) {
          // 报名审核
          name = 'attendeeForms'
        } else if (taskType === 2 || taskType === 4) {
          // 报名变更
          name = 'attendeeFormsChange'
        } else if (taskType === 3) {
          // 取消报名
          name = 'attendeeFormsCancel'
        } else if (taskType === 5) {
          // 请假
          name = 'backlogDetail/leave'
        } else if (taskType === 51 || taskType === 52 || taskType === 53 || taskType === 61 || taskType === 62 || taskType === 63) {
          name = 'backlogDetail/resource'
        }
        if (name) {
          this.$router.push({
            name,
            query: {
              [this.$enc('id')]: this.$enc(conferenceId),
              [this.$enc('attendeeId')]: this.$enc(attendeeId),
              [this.$enc('taskType')]: this.$enc(taskType),
              [this.$enc('taskId')]: this.$enc(taskId),
              [this.$enc('startTime')]: this.$enc(startTime),
              [this.$enc('endTime')]: this.$enc(endTime),
              [this.$enc('isBacklog')]: this.$enc(true)
            }
          })
        }
      } else if (String(this.params.httpParams.statusFlag) === '2') {
        sessionStorage.setItem('backlog', JSON.stringify(ele))
        name = 'backlogDetail/index'
        // 已办跳转
        this.$router.push({
          name,
          query: {
            [this.$enc('type')]: this.$enc(taskType)
          }
        })
      }
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
      const typeEqual = this.typesData[index].typeEqual
      this.clear = true
      this.params.httpParams.typeEqual = typeEqual
      this.params.httpParams.pageNum = 1
    },
    resetClear() {
      this.clear = false
    },
    search() {
      this.clear = true
      this.params.httpParams.pageNum = 1
      this.params.httpParams.todoTitleLike = this.searchVal
    },
    onRefresh() {
      this.params.httpParams.pageNum++
      this.params.type = 'down'
    },
    onLoad() {
      this.params.httpParams.pageNum++
      this.params.type = 'up'
    },
    tabsTypeHandle(index) {
      if (this.tabsTypeData[index].checked) {
        return
      }
      this.tabsTypeData.forEach(ele => {
        ele.checked = false
      })
      this.tabsTypeData[index].checked = true
      // 每次切换的时候执行onLoad
      // this.onloadStatus = true
      this.clear = true
      this.params.httpParams.typeEqual = ''
      this.typesData.forEach(ele => {
        ele.checked = false
      })
      this.typesData[0].checked = true
      this.params.httpParams.statusFlag = index === 0 ? '1' : '2'
      // this.params.httpParams.statusFlag = index + 1
      this.params.httpParams.pageNum = 1
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.backlog-container {
  min-height: 100%;
  background-color: #f8f8f8;
  .tabs-type {
    width: 100%;
    overflow: hidden;
    background-color: #fff;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    .tabs-type-item {
      float: left;
      width: 50%;
      line-height: 48px;
      text-align: center;
      font-size: 15px;
      position: relative;
      &:nth-of-type(1) {
        &::after {
          content: '';
          display: block;
          width: 1px;
          height: 20px;
          background-color: #eee;
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      i {
        display: none;
        width: 30px;
        height: 3px;
        background: linear-gradient(270deg, #40BEFF 0%, #1E89FF 100%);
        border-radius: 2px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 4px;
      }
    }
    .tabs-type-item-checked {
      color: #1E89FF;
    }
  }
  .list-container {
    height: calc(100% - 152px);
    top: 152px;
    // padding-top: 10px;
    .list-item {
      width: 100%;
      background-color: #fff;
      border-radius: 8px;
      margin-bottom: 12px;
      padding: 9px 10px 9px 16px;
      line-height: 18px;
      > h6 {
        font-size: 13px;
        color: rgba(25, 31, 36, 0.64);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 8px;
      }
      > p {
        font-size: 14px;
        font-weight: 500;
        color: rgba(25, 31, 36, 1);
        margin-bottom: 12px;
      }
      .apply-time {
        font-size: 13px;
        color: rgba(25, 31, 36, 0.64);
      }
    }
  }
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
  .backlog-list {
    .van-popup {
      width: 80%;
    }
  }
}
</style>
