<!--
* @Descripttion:
* @Author: wanghz
* @Date: 2021-07-16 15:44:00
 * @LastEditors: zongmz
 * @LastEditTime: 2021-07-23 14:20:11
-->
<template>
  <div style="padding-top: 10px">
    <list :params="params" @onRefresh="onRefresh" @onLoad="onLoad">
      <template v-slot:item="data">
        <div v-for="ele in data.data" :key="ele.id" class="list-item" @click="linkDetail(ele)">
          <div class="top">
            <div class="conference-name">{{ ele.conferenceName }}</div>
            <!--
              1.审核通过 3
              2.审核不通过 2
              3.已分配 100
              4.待分配 101
              5.未分配 110
              6.已撤回 -4
              7.待审核 null
              8.禁止报名 -3
             -->
            <div>
              <div v-if="ele.result == 3" class="applyStatus pass">
                <span>{{ ele.resultStr }}</span>
              </div>
              <div v-if="ele.result == 2 || ele.result == -3" class="applyStatus not-pass">
                <span>审核不通过</span>
              </div>
              <div v-if="ele.result == null" class="applyStatus review">
                <span>{{ ele.resultStr }}</span>
              </div>
              <div v-if="ele.result == -4" class="applyStatus recall">
                <span>{{ ele.resultStr }}</span>
              </div>
            </div>
          </div>
          <div class="title">{{ ele.todoTitle }}</div>
          <div class="info">
            <div>申请人：{{ ele.createUserName }}</div>
            <div>{{ ele.createTime }}</div>
          </div>
        </div>
      </template>
    </list>
  </div>
</template>

<script>
import list from '@/components/list'
export default {
  props: {
    routeParams: {
      type: Object
    }
  },
  components: {
    list
  },
  data() {
    return {
      taskList: [],
      params: {
        httpUrl: 'attendeeApi.getTaskList',
        type: 'up',
        httpParams: {
          conferenceId: '',
          pageNum: 1,
          pageSize: 10
        }
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.params.httpParams.conferenceId = this.routeParams.conferenceId
    })
  },
  mounted() {},
  methods: {
    // 跳转申请详情页
    linkDetail(ele) {
      this.$router.push({
        name: 'applicationDetail',
        query: {
          [this.$enc('applicationDetail')]: this.$enc(ele),
          [this.$enc('conferenceId')]: this.$enc(this.routeParams.conferenceId)
        }
      })
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

<style scoped lang="scss">
.list-container {
  height: calc(100% - 12px);
  top: 12px;
  padding: 0 10px;
}
.list-item {
  background-color: #fff;
  margin-bottom: 12px;
  padding: 16px;
  border-radius: 8px;
  .conference-name {
    width: 70%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .top,
  .info {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #959899;
  }
  .applyStatus {
    border-radius: 10px;
    color: #fff;
    height: 20px;
    line-height: 20px;
    padding: 0 10px;
    margin-left: 5px;
    span {
      text-align: center;
    }
  }
  .pass {
    background: #03be1c;
  }
  .not-pass {
    background: #ea340f;
  }
  .review {
    background: #1e89ff;
  }
  .recall {
    background: #7f8285;
  }

  .title {
    font-size: 18px;
    // font-family: ;
    margin: 15px 0 20px 0;
  }
}
</style>
