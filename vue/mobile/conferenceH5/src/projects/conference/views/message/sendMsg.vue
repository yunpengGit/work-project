<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-08-15 20:08:44
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-26 15:53:35
-->
<template>
  <div class="message-container">
    <list
      ref="list"
      nullText="暂无推送信息"
      :params="params"
      @onRefresh="onRefresh"
      @onLoad="onLoad"
      @loadFinish="loadFinish"

    >
      <template v-slot:item="data">
        <div
          v-for="(ele, index) in data.data"
          :key="index"
          class="msg-item"
          @click="linkTo(ele,index)"
        >
          <div v-if="batchShow" class="pic" :class="ele.verifyStatus === 0 ? '' : 'pic-checked'" @click="choice(ele, index)">
            <img :src="ele.checked ? choose : chooseDefault" alt="" v-if="ele.verifyStatus === 0">
          </div>
          <dl>
            <dt>
              <span>{{ ele.themeCodeStr }}</span>
              <div>
                <div class="examine-status" :class="ele.verifyStatus === 0 ? 'examine-await' : ele.verifyStatus === 1 ? 'examine-done' : 'examine-undone'">
                  {{ ele.verifyStatus === 0 ? '待审核' : ele.verifyStatus === 1 ? '审核通过' : '审核不通过' }}
                </div>
                <van-icon name="arrow" />
              </div>
            </dt>
            <dd class="content">
              {{ ele.tplContent }}
            </dd>
            <dd class="detail">
              <span>推送范围：{{ ele.receiveUserTypeStr }}</span>
              <span>{{ createTime(ele.createTime) }} {{ ele.createUserName }}</span>
            </dd>
          </dl>
        </div>
      </template>
    </list>
    <div class="single-btn-bottom single-btn-bottom-allow">
      <van-button
        type="info"
        @click="$router.push({
          name: 'addMsg',
          query: {
            [$enc('conferenceId')]: $enc(routeParams.id)
          }
        })"
      >推送新消息</van-button>
    </div>
    <div class="batch-handler" v-if="batchShow">
      <div class="batch-content">
        <div class="batch-btn-all" @click="choiceAll">
          <div :class="!isAllUnChoice ? 'batch-btn-all-checked': ''">
            <img :src="batchShowBtnFlag ? choose : chooseDefault" alt="">
          </div>
          <span>全选</span>
        </div>
        <i />
        <div class="batch-cancel" @click="choiceCancel">退出选择</div>
      </div>
      <div class="batch-btn"><van-button type="info" @click="submit">确定审核</van-button></div>
    </div>
    <van-overlay :show="batchChoiceShow" z-index="9" @click="batchChoiceShow=false">
      <div class="batch-choice" @click.stop>
        <dl>
          <dt>消息审核</dt>
          <dd>请选择审核意见，消息通知会在审核通过后按策略推送</dd>
        </dl>
        <ul>
          <li><van-button type="info" @click="submitFinnal(1)">审核通过</van-button></li>
          <li><van-button type="danger" @click="submitFinnal(2)">审核不通过</van-button></li>
          <li @click="batchChoiceShow = false"><van-button type="default">取消</van-button></li>
        </ul>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import list from '@/components/list'
import chooseDefault from '@/assets/images/chooseDefault.svg'
import choose from '@/assets/images/choose.svg'
export default {
  components: { list },
  props: {
    routeParams: {
      type: Object
    }
  },
  data() {
    return {
      choose, chooseDefault,
      // 是否所有数据都不可以选择
      isAllUnChoice: false,
      // 底部批量操作按钮
      batchShow: false,
      // 全选按钮
      batchShowBtnFlag: false,
      // 审核弹窗
      batchChoiceShow: false,
      isLoading: false,
      params: {
        httpUrl: 'message.getMsgList',
        type: 'up',
        httpParams: {
          conferenceId: '',
          total: 0,
          pageNum: 1,
          pageSize: 10
        }
      }
    }
  },
  computed: {
    createTime() {
      return function(time) {
        console.log(time.length)
        let result = ''
        if (!time) {
          result = '-'
        }
        if (time.length > 18) {
          result = time.slice(0, time.length - 3)
        }
        return result
      }
    }
  },
  created() {
    const conferenceId = this.routeParams.id
    this.$nextTick(() => {
      this.params.httpParams.conferenceId = conferenceId
    })
  },
  methods: {
    // 点击列表页
    linkTo(ele, index) {
      if (!this.batchShow) {
        this.$router.push({
          name: 'messageList',
          query: {
            [this.$enc('templatelogId')]: this.$enc(ele.id),
            [this.$enc('conferenceId')]: this.$enc(this.routeParams.id)
          }
        })
      }
    },
    // 审核弹窗选择审核状态
    submitFinnal(type) {
      this.batchChoiceShow = false
      const params = []
      this.$refs.list.listData.forEach((ele, indexChoice) => {
        if (ele.checked) {
          params.push({ id: ele.id, verifyStatus: type })
        }
      })
      this.$api({
        url: 'message.setMsgStatus',
        data: params
      }).then(res => {
        this.$toast.success('审核成功')
        setTimeout(() => {
          window.location.reload()
        }, 300)
      })
    },
    // 确定审核
    submit() {
      const checked = []
      this.$refs.list.listData.forEach((ele, indexChoice) => {
        if (ele.checked) {
          checked.push(ele.id)
        }
      })
      if (!checked.length) {
        this.$toast('请至少选择一项审核信息')
        return
      }
      this.batchChoiceShow = true
    },
    // 全选
    choiceAll() {
      if (!this.isAllUnChoice) {
        return
      }
      this.batchShowBtnFlag = !this.batchShowBtnFlag
      this.changeData(this.batchShowBtnFlag)
    },
    // 批量更改listData数据
    changeData(status) {
      this.$refs.list.listData.forEach((ele, indexChoice) => {
        if (ele.verifyStatus === 0) {
          ele.checked = status
          this.$set(this.$refs.list.listData, indexChoice, ele)
        }
      })
    },
    // 退出选择
    choiceCancel() {
      this.batchShow = false
      this.batchShowBtnFlag = false
      this.changeData(false)
    },
    // 多选及反选
    choice(ele, index) {
      // 如果不是 待审核状态 禁止点击
      if (ele.verifyStatus !== 0) {
        return
      }
      let checkedAll = true
      this.$refs.list.listData.forEach((ele, indexChoice) => {
        if (index === indexChoice) {
          ele.checked = !ele.checked
        }
        if (!ele.checked) {
          this.batchShowBtnFlag = false
          checkedAll = false
        }
        this.$set(this.$refs.list.listData, indexChoice, ele)
      })
      if (checkedAll) {
        this.batchShowBtnFlag = true
      }
    },
    onRefresh() {
      this.params.httpParams.pageNum++
      this.params.type = 'down'
    },
    onLoad() {
      this.params.httpParams.pageNum++
      this.params.type = 'up'
    },
    loadFinish(result) {
      const data = result.result.list
      console.log(data)
      // const isAllUnChoice = false
      data.forEach(ele => {
        // 只有待审核状态的才允许进行选择
        if (ele.verifyStatus === 0) {
          ele.checked = false
          this.isAllUnChoice = true
        }
      })
      if (data.length) {
        this.isLoading = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.message-container::v-deep {
  min-height: 100%;
  background-color: #f8f8f8;
  .list-container {
    // height: calc(100% - 54px);
    // top: 54px;
    padding:0 0 64px;
    .van-pull-refresh {
      padding-top: 0;
    }
  }
  .msg-item {
    width: 100%;
    background-color: #fff;
    padding: 16px 22px 16px 20px;
    // border-bottom: 1px solid #f0f0f1;
    margin-top: 12px;
    @include list(row,flex-start);
    .pic {
      margin-right: 12px;
    }
    .pic-checked {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: #C7C8CA;
    }
    dl {
      flex: 1;
    }
    dt {
      font-size: 18px;
      font-weight: 500;
      line-height: 18px;
      margin-bottom: 17px;
      @include list(row, space-between, center);
      > div {
        @include list(row, flex-start, center);
        font-size: 14px;
      }
      .examine-status {
        height: 20px;
        line-height: 20px;
        border-radius: 4px;
        padding: 0 9px;
        margin-right: 2px;
      }
      .examine-done {
        background-color: #F0F0F0;
        color: #6B7F99;
      }
      .examine-undone {
        background-color: #FFF1F1;
        color: #FD3C34;
      }
      .examine-await {
        background-color: #F4F9FF;
        color: #1E89FF;
      }
    }
    dd {
      font-size: 14px;
    }
    .content {
      padding: 8px;
      color:rgba(25, 31, 36, 0.54);;
      line-height: 21px;
      background-color: #F6F6F6;
      border-radius: 3px;
      word-wrap:break-word;
      word-break:break-all;
      margin-bottom: 12px;
    }
    .detail {
      @include list(row, space-between, center);

    }
  }
  .single-btn-bottom {
    position: fixed;
    background-color: #fff;
    z-index: 9;
    @include list(row, space-between,center);
    .van-button {
      width: 167px;
    }
    .van-button__text {
      font-size: 15px;
    }
  }
  .single-btn-bottom-allow {
    .van-button {
      width: 100%;
    }
  }
  .batch-handler {
    width: 100%;
    height: 64px;
    background-color: #fff;
    padding: 10px 16px 10px 14px;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 9;
    @include list(row,space-between,center);
    .batch-content {
      @include list(row,flex-start,center);
      .batch-btn-all {
        @include list(row,flex-start,center);
        font-size: 18px;
        img {
          margin-right: 11px;
        }
      }
      .batch-btn-all-checked {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: #C7C8CA;
        margin-right: 11px;
      }
      i {
        display: block;
        width: 1px;
        height: 18px;
        background-color: #E7E7E7;
        margin: 0 17px 0 22px;
      }
      .batch-cancel {
        font-size: 16px;
        color: #1E89FF;
      }
    }
    .batch-btn {
      .van-button {
        width: 140px;
        height: 44px;
        text-align: center;
        line-height: 44px;
        border-radius: 8px;
        background-color: #1E89FF;
        color: #fff;
        font-size: 16px;
        padding: 0;
      }
    }
  }
  .batch-choice {
    width: 80%;
    background-color: #fff;
    @include absolute(50%,'','',50%);
    transform: translate(-50%,-50%);
    border-radius: 8px;
    overflow: hidden;
    padding: 16px 16px 0;
    dl {
      margin-bottom: 30px;
    }
    dt {
      font-size: 17px;
      margin-bottom: 20px;
      font-weight: 500;
    }
    dd {
      font-size: 14px;
      line-height: 18px;
    }
    li {
      margin-bottom: 10px;
      .van-button {
        width: 100%;
        padding: 0;
      }
    }
  }
}
</style>
