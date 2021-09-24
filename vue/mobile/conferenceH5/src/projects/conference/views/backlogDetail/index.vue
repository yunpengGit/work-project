<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-08-07 19:36:18
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-09 19:05:57
-->
<template>
  <div class="backlog-detail-container">
    <ul class="backlog-detail" v-if="data">
      <li class="backlog-detail-title">{{ data.todoTitle.replace('-',' | ') }}</li>
      <li class="backlog-detail-status">{{ data.resultStr }}</li>
      <li>申请人：{{ data.attendeeName }}</li>
      <li v-if="data.verifyUserName">审核人：{{ data.verifyUserName }}</li>
      <li>申请时间：{{ data.createTime }}</li>
      <li v-if="data.verifyTime">审核时间：{{ data.verifyTime }}</li>
    </ul>
    <ul class="backlog-detail" v-if="data.changeContent && routeParams.type !== '5'">
      <li class="backlog-detail-title">
        变更信息
      </li>
      <li v-html="locusContent(data.changeContent)" class="change-content" />
    </ul>
    <ul class="backlog-detail" v-if="leaveData && routeParams.type === '5'">
      <li class="backlog-detail-title">
        请假信息
      </li>
      <li
        class="change-content"
      >
        <div
          v-for="(ele, index) in leaveData"
          :key="index"
        >
          <div v-if="index === 'typeStr'">请假类型 - {{ele}}</div>
          <div v-if="index === 'leaveTime'">离会时间 - {{ele}}</div>
          <div v-if="index === 'returnTime'">返回时间 - {{ele}}</div>
        </div>
      </li>
    </ul>
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
      data: null,
      leaveData: {}
    }
  },
  created() {
    const data = JSON.parse(sessionStorage.getItem('backlog'))
    this.data = data
    if (this.routeParams.type === '5') {
      const changeData = data.changeContent ? JSON.parse(data.changeContent) : data.changeContent
      Object.keys(changeData).forEach(ele => {
        console.log(changeData[ele])
        if (ele === 'typeStr') {
          this.leaveData.typeStr = changeData[ele]
        } else if (ele === 'leaveTime') {
          this.leaveData.leaveTime = changeData[ele]
        } if (ele === 'returnTime') {
          this.leaveData.returnTime = changeData[ele]
        }
      })
    }
    // console.log(this.routeParams)
    // const id = this.routeParams.conferenceId
    // console.log(this.routeParams)
    // this.$api({
    //   url: 'task.getTaskDetailItem',
    //   data: {
    //     id
    //   }
    // }).then(res => {
    //   if (res.code === 2000) {
    //     const data = res.result
    //     this.data = data
    //     console.log(data)
    //   }
    // })
  },
  computed: {
    locusContent() {
      return function(str) {
        let result = ''
        if (!str) {
          return result
        } else {
          const contentData = JSON.parse(str)
          if (Array.isArray(contentData)) {
            contentData.forEach(ele => {
              if (ele.code === 'agenda') {
                if (ele.beforeValue) {
                  result = `${result}${ele.attribute}变更： 增加<span class="change-after">${ele.beforeValue.substr(0, ele.beforeValue.indexOf(';'))}<span><br />`
                }
                if (ele.afterValue) {
                  result = `${result}${ele.attribute}变更： 取消<span class="change-after">${ele.afterValue.substr(0, ele.afterValue.indexOf(';'))}</span><br />`
                }
              } else {
                result = `${result}${ele.attribute}变更： 由<span class="change-before">${ele.beforeValue ? ele.beforeValue : '""'}</span>变更为<span class="change-after">${ele.afterValue}</span><br />`
              }
              return result
            })
          }
          return result
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.backlog-detail-container::v-deep {
  min-height: 100%;
  background-color: #f8f8f8;
  padding-bottom: 16px;
  .backlog-detail {
    padding: 20px 16px;
    background-color: #fff;
    li {
      font-size: 13px;
      margin-bottom: 10px;
      // color: rgba(25, 31, 36, 0.64);
    }
    .backlog-detail-title {
      font-size: 17px;
      font-weight: 500;
      color: rgba(25, 31, 36, 1);
    }
    .backlog-detail-status {
      display: inline-block;
      padding: 3px 8px;
      background-color: rgb(30, 137, 255);
      color: #fff;
      border-radius: 10px;
      margin: 0 0 13px 0;
    }
  }
  .change-content {
    background-color: rgba(255, 204, 0, 0.12);
    padding: 16px;
    line-height: 20px;
  }
  .change-before {
    color: #191F24;
    // color: rgba(25, 31, 36, 0.48);
    margin: 0 3px;
  }
  .change-after {
    color: rgb(30, 137, 255);
    margin: 0 0 0 3px;
    font-weight: 500;
  }
}
</style>
