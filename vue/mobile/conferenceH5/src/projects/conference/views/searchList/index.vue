<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-27 20:51:55
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-09-07 14:56:01
-->
<template>
  <div class="search-container">
    <van-search
      v-model="searchVal"
      disabled
      shape="round"
      background="#fff"
      placeholder="请输入会议名称、地点、城市或主办单位"
      @click="linkSearch"
    />
    <div class="list-res-container">
      <list
        :params="params"
        @onRefresh="onRefresh"
        @onLoad="onLoad"
        nullText="未找到会议活动"
      >
        <template v-slot:item="data">
          <div
            v-for="ele in data.data"
            :key="ele.id"
            class="list-item"
          >
            <div class="meeting-data-pic" @click="linkDetail(ele.id)">
              <img :src="ele.coverVOs[0].downloadUrl" alt="">
              <div
                class="meeting-current-status"
                :class="ele.conferenceStatus === 2 ? 'meeting-current-status-unstart' : ele.conferenceStatus === 3 ? 'meeting-current-status-ongoing' : ele.conferenceStatus === 1 ? 'meeting-current-status-finished' : ''"
              >
                <img :src="ele.conferenceStatus === 2 ? unstartIcon : ele.conferenceStatus === 3 ? ongoingIcon : ele.conferenceStatus === 1 ? finishedIcon : ''" alt="">
                <span>{{ ele.conferenceStatusStr }}</span>
              </div>
              <div class="meeting-des">{{ ele.typeStr }}</div>
            </div>
            <dl class="meeting-detail">
              <dt>{{ ele.name }}</dt>
              <dd><span>会议时间：</span>{{ ele.startTime.slice(0, ele.startTime.length - 3) }} 至 {{ ele.endTime.slice(0, ele.endTime.length - 3) }}</dd>
              <dd><span>会议场所：</span>{{ ele.station }}</dd>
              <dd><span>报名时间：</span>{{ ele.signStartTime ? ele.signStartTime.slice(0, ele.signStartTime.length - 3) : '-' }} 至 {{ ele.signEndTime ? ele.signEndTime.slice(0, ele.signEndTime.length - 3) : '-' }}</dd>
            </dl>
          </div>
        </template>
      </list>
    </div>
  </div>
</template>

<script>
import list from '@/components/list'
import unstartIcon from '@/assets/images/unstart.svg'
import ongoingIcon from '@/assets/images/ongoing.svg'
import finishedIcon from '@/assets/images/finished.svg'
export default {
  components: { list },
  props: {
    routeParams: {
      type: Object
    }
  },
  data() {
    return {
      unstartIcon, ongoingIcon, finishedIcon,
      searchVal: '',
      // 接口请求参数
      params: {
        type: 'up',
        httpUrl: 'home.myMeetingList',
        httpParams: {
          nameLikeOrStationLike: '',
          conferenceStatusEqual: '2,3,4',
          pageNum: 1,
          pageSize: 10
        }
      }
    }
  },
  created() {
    this.$nextTick(() => {
      const searchVal = this.routeParams.searchVal
      this.searchVal = searchVal
      this.params.httpParams.nameLikeOrStationLike = searchVal
    })
  },
  methods: {
    onRefresh() {
      this.params.httpParams.pageNum++
      this.params.type = 'down'
    },
    onLoad() {
      this.params.httpParams.pageNum++
      this.params.type = 'up'
    },
    // 跳转会议详情页
    linkDetail(id) {
      this.$router.push({
        name: 'conferenceDesk',
        query: {
          [this.$enc('id')]: this.$enc(id)
        }
      })
    },
    // 跳转搜索页
    linkSearch() {
      this.$router.replace('search')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.search-container::v-deep {
  min-height: 100%;
  .list-res-container {
    // padding-top: 20px;
    .list-container {
      height: calc(100% - 54px);
      top: 54px;
      padding-left: 0;
      padding-right: 0;
      .van-pull-refresh {
        padding: 20px 16px 0;
      }
    }
    .list-item {
      overflow: hidden;
      width: 100%;
      border-radius: 8px;
      box-shadow: 0px 4px 32px 0px rgba(0, 0, 0, 0.12);
      margin-bottom: 20px;
      // padding-top: 10px;
      .meeting-data-pic {
        width: 100%;
        height: 157px;
        overflow: hidden;
        position: relative;
        > img {
          width: 100%;
          position: absolute;
          z-index: 1;
        }
        .meeting-current-status {
          width: 71px;
          height: 20px;
          // text-align: center;
          line-height: 20px;
          font-size: 12px;
          color: #fff;
          @include absolute(0, '', '', 0, 2);
          border-radius: 0 6px 14px 0;
          @include list(row,flex-start,center);
          img {
            margin:  0 2px 0 7px;
          }
        }
        .meeting-current-status-unstart {
          background: url('../../../../assets/images/unstartBg.svg') no-repeat;
          background-color: #0F6AD9;
        }
        .meeting-current-status-ongoing {
          background: url('../../../../assets/images/ongoingBg.svg') no-repeat;
          // background-color: #009F15;
        }
        .meeting-current-status-finished {
          background: url('../../../../assets/images/finishBg.svg') no-repeat;
          // background-color: rgba(0, 0, 0, 0.12);
        }
        .meeting-des {
          width: 100%;
          height: 60px;
          color: #fff;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%);
          @include absolute('', '', 0, 0, 2);
          line-height: 85px;
          padding: 0 16px;
          font-size: 14px;
        }
      }
      .meeting-detail {
        width: 100%;
        padding: 16px 10px 16px 16px;
        background-color: #fff;
        dt {
          font-size: 17px;
          line-height: 20px;
          font-weight: 500;
          margin: 5px 0 10px;
        }
        dd {
          color: rgba(25, 31, 36, 0.48);
          font-size: 12px;
          line-height: 15px;
          margin-bottom: 4px;
          span {
            color: rgb(25, 31, 36);
          }
        }
      }
    }
  }
}
</style>
