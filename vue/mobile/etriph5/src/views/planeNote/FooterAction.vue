<template>
  <van-action-sheet :value="show" :overlay="false" :lock-scroll="false" :round="false">
    <div>
      <div flex="cross:center" class="check-content">
        <van-checkbox :value="allChecked" @click="$emit('check')">全选</van-checkbox>
        <span v-show="data.length" flex-item="1" class="num">共勾选{{data.length}}/20条</span>
      </div>
      <div class="button-group" flex>
        <van-button size="small" round plain type="info" flex-item="1" @click="toast(2)">
          <svg-icon href="iconxiazai" class="footer-icon"/>
          下载
        </van-button>
        <van-button size="small" round plain type="info" flex-item="1" @click="toast(0)">
          <svg-icon href="iconquxiao" class="footer-icon"/>
          取消确认
        </van-button>
        <van-button size="small" round plain type="info" flex-item="1" @click="toast(1)">
          <svg-icon href="iconqueren" class="footer-icon"/>
          确认
        </van-button>
      </div>
    </div>
  </van-action-sheet>
</template>
<script>
import Vue from 'vue'
import { ActionSheet, Button, Checkbox, Toast, Dialog } from 'vant'
import ApiJourney from '@/api/journey'

Vue.use(ActionSheet).use(Button).use(Checkbox)

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {
    allChecked () {
      return this.data.length === 20
    }
  },
  methods: {
    toast (type) { // 弹窗提示,0取消，1确认，2下载
    // 判断是否选中
      if (this.data.length === 0) {
        Dialog.alert({
          title: '标题',
          message: '请至少选择一条数据'
        }).then(() => {})
        return
      }
      let title = '提示'
      let message = ''
      let className = ''
      let callback
      switch (type) {
        case 0:
          message = '是否全部取消确认？'
          callback = this.cancel
          break
        case 1:
          message = '是否全部确认'
          callback = this.confirm
          break
        case 2:
          message = '确认本次行程将用于报销，请确认以下信息是否属实：\n1）本次行程已实际使用\n2）本次行程是因公出行'
          callback = this.download
          className = 'align-left'
      }
      Dialog.confirm({
        title,
        className,
        message
      }).then(() => {
        callback()
      }).catch(() => {})
    },
    getParams () { // 获取批量操作的参数
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      const { categoryId, tel } = userInfo
      let journeyIds = []
      this.data.forEach(t => {
        journeyIds.push(t.id)
      })
      return {
        categoryId,
        journeyIds: journeyIds.join(','),
        obtUserName: tel
      }
    },
    download () { // 下载行程
      this.$router.push({
        name: 'checkEmails',
        params: {
          requestParams: this.getParams()
        }
      })
    },
    confirm () { // 确认行程
      const params = this.getParams()
      ApiJourney.batchConfirmJourney(params).then(res => {
        if (res.CommonModel.successState) {
          Toast(res.CommonModel.resultStr)
          this.$emit('needRefresh')
        } else {
          Toast(res.CommonModel.resultMsg)
        }
      })
    },
    cancel () { // 取消行程
      const params = this.getParams()
      ApiJourney.batchCancelJourney(params).then(res => {
        if (res.CommonModel.successState) {
          Toast(res.CommonModel.resultStr)
          this.$emit('needRefresh')
        } else {
          Toast(res.CommonModel.resultMsg)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  @import "~vant/es/style/var";
  .button-group {
    background: #DDE4EE;
    padding: @padding-xs @padding-sm;

    button {
      margin-right: @padding-sm;
      &:last-of-type {
        margin-right: 0;
      }
    }
    .footer-icon {
      width: 14px;
      height: 14px;
      vertical-align: sub;
    }
  }
  .check-content {
    padding: @padding-sm;
    border-top: 1px solid @border-color;
    .num {
      text-align: center;
      color: @blue;
      padding-right: 52px;
    }
  }

</style>

<style>
  .align-left .van-dialog__message {
    text-align: left;
  }
</style>
