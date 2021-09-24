<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-08-15 20:08:44
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-16 11:47:41
-->
<template>
  <div class="message-container">
    <list
      ref="list"
      nullText="暂无待审核信息"
      :params="params"
      @onRefresh="onRefresh"
      @onLoad="onLoad"
      @loadFinish="loadFinish"
    >
      <template v-slot:item="data">
        <div v-for="(ele, index) in data.data" :key="index" class="msg-item" @click="linkTo(ele, index)">
          <div class="audit-item-title">
            <div class="title-text">
              <div class="pic" :class="ele.verifyStatus === 0 ? '' : 'pic-checked'" @click.stop="choice(ele, index)">
                <img :src="ele.checked ? choose : chooseDefault" alt="" v-if="ele.verifyStatus === 0" />
              </div>
              <span>{{ ele.themeCodeStr }}</span>
            </div>
            <div class="audit-type">
              <span
                class="status"
                :class="ele.verifyStatus === 0 ? 'in-review' : ele.verifyStatus === 1 ? 'pass' : 'no-pass'"
              >
                {{ ele.verifyStatus === 0 ? '待审核' : ele.verifyStatus === 1 ? '审核通过' : '审核不通过' }}</span
              >
              <img src="@/assets/images/skip.svg" alt="" />
            </div>
          </div>
          <div class="audit-item-content">{{ ele.tplContent }}</div>
          <div class="push-info">
            <div class="left">推送范围：{{ ele.receiveUserTypeStr || '-' }}</div>
            <div class="right">{{ filterTime(ele.createTime) }} {{ ele.createUserName }}</div>
          </div>
        </div>
      </template>
    </list>
    <div class="bottom">
      <div class="batch-btn-all" @click="choiceAll">
        <img :src="batchShowBtnFlag ? choose : chooseDefault" alt="" />
        <span>全选</span>
      </div>
      <van-button
type="info"
@click="batchChoiceShow = true"
:disabled="checkedCount === 0 && !batchShowBtnFlag"
        >确认审核</van-button
      >
    </div>
    <van-overlay :show="batchChoiceShow" z-index="9" @click="batchChoiceShow = false">
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
      choose,
      chooseDefault,
      // 是否所有数据都不可以选择
      isAllUnChoice: false,
      // 全选按钮
      batchShowBtnFlag: false,
      // 审核弹窗
      batchChoiceShow: false,
      // 当前选中项个数
      checkedCount: 0,
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
  created() {
    const conferenceId = this.routeParams.conferenceId
    this.$nextTick(() => {
      this.params.httpParams.conferenceId = conferenceId
    })
  },
  methods: {
    // 将时间2021-08-25 18:00:00 处理为 2021.08.25 18:00
    filterTime(time) {
      const str = time.replace(/-/g, '.')
      const newStr = str.slice(0, str.length - 3)
      return newStr
    },
    // 点击列表页
    linkTo(ele) {
      this.$router.push({
        name: 'msgPeopleInfo',
        query: {
          [this.$enc('templatelogId')]: this.$enc(ele.id),
          [this.$enc('conferenceId')]: this.$enc(this.routeParams.conferenceId),
          [this.$enc('status')]: this.$enc(ele.verifyStatus)
        }
      })
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
      })
        .then(res => {
          this.$toast.success('审核成功')
          setTimeout(() => {
            window.location.reload()
          }, 300)
        })
        .catch(err => {
          const msg = err.message
          this.$toast(msg)
        })
    },
    // 全选
    choiceAll() {
      if (!this.isAllUnChoice) {
        this.$toast('当前页没有可选中项')
        return
      }
      this.batchShowBtnFlag = !this.batchShowBtnFlag
      this.changeData(this.batchShowBtnFlag)
    },
    // 批量更改listData数据
    changeData(status) {
      const checked = []
      this.$refs.list.listData.forEach((ele, indexChoice) => {
        if (ele.verifyStatus === 0) {
          ele.checked = status
          this.$set(this.$refs.list.listData, indexChoice, ele)
        }
        if (ele.checked) {
          checked.push(ele.id)
        }
      })
      this.checkedCount = checked.length
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
      const checked = []
      this.$refs.list.listData.forEach((ele, indexChoice) => {
        if (ele.checked) {
          checked.push(ele.id)
        }
      })
      console.log(1111)
      this.checkedCount = checked.length
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
      data.forEach(ele => {
        // 只有待审核状态的才允许进行选择
        if (ele.verifyStatus === 0) {
          ele.checked = false
          this.isAllUnChoice = true
        }
      })
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
    padding: 0 0 64px;
  }
  .msg-item {
    width: 100%;
    background-color: #fff;
    padding: 0px 20px 16px 20px;
    margin-bottom: 12px;
    .pic {
      margin-right: 7px;
    }
    .pic-checked {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background-color: #c7c8ca;
    }
    .audit-item-title {
      height: 52px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title-text,
      .audit-type {
        display: flex;
        align-items: center;
      }
      .title-text {
        height: 18px;
        font-size: 18px;
        font-weight: 500;
        color: #191f24;
        line-height: 18px;
      }
      .audit-type {
        height: 16px;
        font-size: 14px;
        font-weight: 400;
        color: #1e89ff;
        line-height: 16px;
        .status {
          height: 20px;
          line-height: 20px;
          border-radius: 4px;
          padding: 0 10px;
          font-size: 14px;
        }
        .in-review {
          background: #f4f9ff;
          color: #1e89ff;
        }
        .pass {
          background: #f0f0f0;
          color: #6b7f99;
        }
        .no-pass {
          background: #fff1f1;
          color: #fd3c34;
        }
        img {
          margin-left: 2px;
        }
      }
    }
    .audit-item-content {
      background: #f6f6f6;
      border-radius: 3px;
      padding: 8px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(25, 31, 36, 0.54);
      line-height: 21px;
      word-wrap: break-word;
      word-break: break-all;
    }
    .push-info {
      @include list(row, space-between, center);
      height: 18px;
      font-size: 14px;
      font-weight: 400;
      color: #191f24;
      line-height: 18px;
      margin-top: 12px;
    }
  }
  .bottom {
    z-index: 999;
    position: fixed;
    bottom: 0;
    height: 64px;
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    .batch-btn-all {
      @include list(row, flex-start, center);
      font-size: 16px;
      img {
        margin-right: 11px;
      }
    }
    .van-button {
      width: 210px;
      font-size: 18px;
      border-radius: 8px;
    }
  }
  .batch-choice {
    width: 80%;
    background-color: #fff;
    @include absolute(50%, '', '', 50%);
    transform: translate(-50%, -50%);
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
