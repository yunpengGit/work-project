<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-05-21 16:38:37
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-06-17 10:24:40
-->
<template>
  <van-list
    v-model="loading"
    :finished="finished"
    :finished-text="finishedText"
    error-text="请求失败，点击重新加载"
    @load="onLoad"
  >
    <div v-for="item in list" :key="item.fd_id" class="item" @click="routerTo(item)">
      <div class="content">
        <div class="name-status">
          <span class="name">{{ item.fd_user_name }}</span>
          <span class="status">
            <span :class="`text ${classMap.get(item.fd_outgoing_type)}`">
              <span>{{ textMap.get(item.fd_outgoing_type)}}</span>
              <span class="label">{{ stausMap.get(item.doc_status) }}</span>
            </span>
          </span>
        </div>
        <div class="date">
          <span class="date-icon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#shijian" />
            </svg>
          </span>
          <span class="time">预计时间：{{ item.fd_out_start_time }} - {{ item.fd_out_end_time }}</span></div>
        <div class="doc">
          <span class="text-icon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#shuoming" />
            </svg>
          </span>
          <div class="text">{{ item.fd_business_trip_reason }}</div>
        </div>
      </div>
    </div>
  </van-list>
</template>

<script>
import { List } from 'vant'
import infoList from './../api/infoList'
// 市外出差|1
// 外出开会|2
// 市内办事|3
// 休假请假|4
const classMap = new Map([
  [1, 'swcc'],
  [2, 'wckh'],
  [3, 'snbs'],
  [4, 'xjqj']
])
const textMap = new Map([
  [1, '市外出差'],
  [2, '外出开会'],
  [3, '市内办事'],
  [4, '休假请假']
])
// 驳回|11
// 待审|20
// 审核通过|30
const stausMap = new Map([
  ['11', '驳回'],
  ['20', '待审'],
  ['30', '审核通过']
])
export default {
  name: 'ListItem',
  components: {
    [List.name]: List
  },
  props: {
    active: {
      type: Number,
      default: 0
    },
    tabType: {
      type: Number
    },
    fdUserName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      classMap,
      textMap,
      stausMap,
      finishedText: '没有更多了',
      pageNo: 1,
      rowSize: 10,
      className: '',
      error: false,
      loading: false,
      finished: false,
      list: [
        // {
        //   'fd_url': 'http://localhost:8080/km/review/km_review_main/kmReviewMain.do?method=view&fdId=17987fe76f4ae287f8a0dd24d2ba265f',
        //   'fd_id': '17987fe76f4ae287f8a0dd24d2ba265f',
        //   'fd_created_date': '2021-05-20 12:18:45',
        //   'fd_create_by': '43f2de4a-d522-11e9-9f2e-00163e0c6497',
        //   'fd_create_contact': '18513686679',
        //   'fd_user_id': '346ce60df1d044438ab8af1bcaae155e',
        //   'fd_dept_name': '测试2',
        //   'fd_outgoing_contact': '19044442226',
        //   'fd_out_start_time': '2021-05-20',
        //   'fd_out_end_time': '2021-05-20',
        //   'fd_outgoing_type': 2,
        //   'fd_meeting_theme': '333',
        //   'fd_vacation_type': '2',
        //   'fd_business_trip_reason': '123',
        //   'fd_business_trip_addr': '123',
        //   'fd_organizer': '123',
        //   'doc_status': '20',
        //   'fd_user_name': '小李'
        // }
      ]
    }
  },
  watch: {
    active (n, o) {
      // eslint-disable-next-line eqeqeq
      if (n == this.tabType) {
        this.list = []
        this.pageNo = 1
        this.finished = false // 重置之前完全加载
        this.onLoad()
      }
    }
  },
  methods: {
    onLoad () {
      // 异步更新数据
      this.loading = true
      const data = {
        pageNo: this.pageNo,
        rowSize: this.rowSize,
        tabType: this.active
      }
      if (this.fdUserName) {
        this.pageNo = 1
        data.fdUserName = this.fdUserName
        data.pageNo = this.pageNo
      }
      infoList.getData(data).then(res => {
        this.$emit('setUrl', res.addUrl)
        if (this.pageNo === 1) {
          if (res.data.length === 0) {
            if (this.fdUserName) {
              this.finishedText = '试试搜索其他内容'
            } else {
              this.finishedText = '还没有人登记去向'
            }
          } else {
            this.finishedText = '没有更多了'
          }
          this.list = res.data
        } else {
          this.list = [...this.list, ...res.data]
        }
        this.pageNo += 1
        this.loading = false
        if (this.list.length >= res.dataSum) {
          this.finished = true
        }
      }).catch(() => {
        this.error = true
      })
    },
    routerTo (item) {
      window.location.href = item.fd_url
      // window.open(item.fd_url)
    }
  }
}
</script>

<style scoped lang="less">
.fcc{
  display: flex;
  justify-content: center;
  align-items: center;
}
.status-color(@color){
  display: flex;
  align-items: center;
  border-color: @color;
  color: @color;
  .label{
    margin-left: 5px;
    height: 20px;
    line-height: 20px;
    // height: inherit;
    padding: 0 8px 0 5px;
    color: #fff;
    background-color: @color;
  }
}
.van-list{
  box-sizing: border-box;
  padding-top: 10px;
  height: 100%;
  padding-bottom: 50px;
  overflow-y: auto;
}
.item{
  height: 124px;
  margin-top: 10px;
  &:first-child{
    margin-top: 0;
  }
  .content{
    padding: 11px 16px;
    background-color: #fff;
    .name-status{
      height: 22px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .name{
        height: 22px;
        font-size: 17px;
        font-weight: bold;
        color: #191F24;
        line-height: 22px;
      }
      .status{
        font-size: 12px;
        .text{
          .fcc;
          height: 20px;
          padding: 0 8px;
          border: 2px solid transparent;
          border-radius: 10px;
          overflow: hidden;
          box-sizing: content-box;
          padding-right: 0;
        }
        .swcc{
          .status-color(#EA4A29);
        }
        .wckh{
          .status-color(#FF8200);
        }
        .snbs{
          .status-color(#CCA700);
        }
        .xjqj{
          .status-color(#1E89FF);
        }
      }
      .end{
        border-radius: 20px;
        border: 2px solid #191F24;
        font-size: 12px;
        color: #191F24;
        line-height: 12px;
      }
    }
    .date-icon,
    .text-icon{
      margin-top: 2px;
      margin-right: 4px;
      width: 15px;
      height: 20px;
      color: rgba(25, 31, 36, 0.64);
      .icon {
        width: 100%;
        height: 100%;
        fill: currentColor;
        overflow: hidden;
      }
    }
    .date{
      margin-top: 8px;
      display: flex;
      .time{
        flex: 1;
        height: 22px;
        font-size: 15px;
        color: rgba(25, 31, 36, 0.64);
        line-height: 22px;
      }
    }
    .doc{
      margin-top: 6px;
      display: flex;
      .text{
        flex: 1;
        height: 44px;
        font-size: 15px;
        color: rgba(25, 31, 36, 0.64);
        line-height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
      }
    }
  }
}
</style>
