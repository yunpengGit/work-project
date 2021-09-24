<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-27 20:51:55
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-09-07 16:46:50
-->
<template>
  <div class="search-container">
    <van-search
      v-model="searchVal"
      disabled
      shape="round"
      background="#fff"
      left-icon=""
      placeholder="点此搜索会议内容"
      @click="linkSearch"
    />
     <img class="search-icon" src="@/assets/images/search.svg" alt="" />
    <div class="line"></div>
    <div class="list-res-container">
      <list :params="params" @onRefresh="onRefresh" @onLoad="onLoad">
        <template v-slot:item="data">
          <div v-for="ele in data.data" :key="ele.id" class="list-item">
            <div class="meeting-data-pic" @click="linkDetail(ele.id)">
              <img :src="ele.coverVOs[0].coverUrl" alt="" />
              <div class="meeting-des">{{ ele.typeStr }}</div>
            </div>
            <dl class="meeting-detail">
              <dt>{{ ele.name }}</dt>
              <dd class="meeting-place">{{ ele.station }}</dd>
              <dd>{{ filterTime(ele.startTime, ele.endTime) }}</dd>
              <div class="apply-status-tips">
                <span class="apply-tip" v-if="isDuringDate(ele.signStartTime, ele.signEndTime)">可报名</span>
                <span
                  :class="
                    ele.conferenceStatus === 2
                      ? 'status-unstart'
                      : ele.conferenceStatus === 3
                      ? 'status-ongoing'
                      : ele.conferenceStatus === 1
                      ? 'status-finished'
                      : ''
                  "
                  >{{ ele.conferenceStatusStr }}</span
                >
              </div>
            </dl>
          </div>
        </template>
      </list>
    </div>
  </div>
</template>

<script>
import list from '@/components/list'
export default {
  components: { list },
  props: {
    routeParams: {
      type: Object
    }
  },
  data() {
    return {
      searchVal: '',
      // 接口请求参数
      params: {
        type: 'up',
        httpUrl: 'attendeeApi.meetingList',
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
    // 判断当前时间是否可报名
    isDuringDate(beginDateStr, endDateStr) {
      var curDate = new Date()
      var beginDate = new Date(beginDateStr)
      var endDate = new Date(endDateStr)
      if (curDate >= beginDate && curDate <= endDate) {
        return true
      }
      return false
    },
    // 将时间2021-08-25 18:00:00 处理为 2021.08.25 18:00
    filterTime(start, end) {
      const startTime = start.replace(/-/g, '.').slice(0, 16)
      let endTime = end.replace(/-/g, '.').slice(0, 16)
      if (startTime.slice(0, 4) === endTime.slice(0, 4)) {
        // 如果年份相同则截止日期年份不显示
        endTime = endTime.slice(5, endTime.length)
      }
      return `${startTime} - ${endTime}`
    },
    onRefresh() {
      this.params.httpParams.pageNum++
      this.params.type = 'down'
    },
    onLoad() {
      this.params.httpParams.pageNum++
      this.params.type = 'up'
    },
    // 获取用户信息
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
    // 跳转会议详情页
    async linkDetail(id) {
      const userInfo = await this.getUserInfo()
      const userId = userInfo.id
      this.$api({
        url: 'attendeeApi.jumpInSuccessVertify',
        data: {
          conferenceId: id,
          userId
        }
      }).then(res => {
        if (res.success) {
          if (Number(res.result) === 1) {
            // 可以进入9宫格
            this.$router.push({
              name: 'conferenceHomePage',
              query: {
                [this.$enc('conferenceId')]: this.$enc(id)
              }
            })
          } else {
            // 进入详情页
            this.$router.push({
              name: 'conferenceDetail',
              query: {
                [this.$enc('conferenceId')]: this.$enc(id)
              }
            })
          }
        }
      })
    },
    // 跳转搜索页
    linkSearch() {
      this.$router.push('search')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.search-container {
  position: relative;
  .search-icon {
    position: absolute;
    top: 17px;
    left: 38px;
  }
  .van-search {
    padding: 7px 20px;
  }
  .van-cell {
    align-items: center;
    ::v-deep .van-cell__value {
      padding-left: 32px;
    }
  }
  .van-search__content {
    height: 38px;
    line-height: 38px;
    background: linear-gradient(right, #f5f7fd, #e8ecf9);
  }
  ::v-deep .van-field__control {
    font-size: 16px;
    color: #191f24;
    font-weight: 400;
  }
  .line {
      background-color: #fff;
      border-bottom: 1px solid #ebecec;
      height: 7px;
    }
  .list-res-container {
    .list-container {
      padding: 10px 16px 0 16px;
      background-color: #fff;
      height: calc(100% - 59px);
      top: 59px;
      overflow: auto;
    }

    // width: 100%;
    // padding: 0 16px;
    // position: fixed;
    // left: 0;
    // top: 54px;
    // height: calc(100% - 54px);
    // .van-pull-refresh {
    //   height: calc(100% - 54px);
    // }

    .list-item {
      // overflow: hidden;
      width: 100%;
      // border-radius: 8px;
      // box-shadow: 0 1px 2px rgb(0 0 0 / 30%);
      margin-bottom: 10px;
      // padding-top: 10px;
      .meeting-data-pic {
        width: 100%;
        height: 157px;
        overflow: hidden;
        position: relative;
        border-radius: 4px;
        img {
          width: 100%;
          position: absolute;
          z-index: 1;
          border-radius: 4px;
        }
        .meeting-current-status {
          width: 71px;
          height: 20px;
          text-align: center;
          line-height: 20px;
          font-size: 12px;
          color: #fff;
          @include absolute(0, '', '', 0, 2);
          border-radius: 0 6px 14px 0;
        }
        .meeting-current-status-unstart {
          background-color: #0f6ad9;
        }
        .meeting-current-status-ongoing {
          background-color: #009f15;
        }
        .meeting-current-status-finished {
          background-color: rgba(0, 0, 0, 0.12);
        }
        .meeting-des {
          position: absolute;
          z-index: 999;
          text-align: center;
          padding: 0 10px;
          height: 19px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 3px;
          line-height: 19px;
          font-size: 12px;
          color: #fff;
          bottom: 14px;
          left: 10px;
        }
      }
      .meeting-detail {
        position: relative;
        width: 100%;
        padding: 5px 0 14px 0;
        .meeting-place {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
        }
        dt {
          font-size: 18px;
          font-weight: 500;
          line-height: 25px;
          margin: 5px 0 6px;
        }
        dd {
          font-size: 14px;
          height: 16px;
          color: rgba(25, 31, 36, 0.72);
          line-height: 16px;
          margin-bottom: 6px;
        }
        .apply-status-tips {
          position: absolute;
          right: 0;
          bottom: 20px;
          span {
            display: inline-block;
            height: 19px;
            line-height: 19px;
            text-align: center;
            padding: 0 5px;
            border-radius: 3px;
            font-size: 12px;
          }
          .apply-tip {
            background: #ffefe0;
            color: #ff6c19;
            margin-right: 4px;
          }
          .status-unstart {
            background: #e5ebff;
            color: #1652f7;
          }
          .status-ongoing {
            background: #ffefe0;
            color: #ff6c19;
          }
          .status-finished {
            background: #e8e8e9;
            color: #848484;
          }
        }
      }
    }
  }
}
</style>
