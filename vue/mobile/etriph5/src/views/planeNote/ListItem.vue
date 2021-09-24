<template>
  <van-swipe-cell class="cell">
    <div class="list-item" flex>
      <van-checkbox
        class="checkbox"
        v-show="showCheckBox"
        v-model="checked"
        @click="message"
        :disabled="checkDisable&&!checked"
      ></van-checkbox>
      <div class="left" flex="dir:column" @click="toDetail">
        <span class="time" flex-item="1">
          {{item.departuretime?item.departuretime.substring(5,10):''}}
          <br />
          <span class="year">{{item.departuretime?item.departuretime.substring(0,4):''}}</span>
        </span>
        <span class="status" flex="cross:center">
          {{ticketstateMap.get(item.ticketstate)}}
          <svg-icon class="ticketstate-icon" :href="ticketstateIconMap.get(item.ticketstate)" />
        </span>
        <span
          class="sm-status"
        >{{ticketConfirmStateMap.get(item.user_confirm_state)}} {{journeyExpenseStateMap.get(item.journey_expense_state)}}</span>
      </div>
      <div class="right" flex="dir:column" flex-item="1" @click="toDetail">
        <div flex="cross:center main:between">
          <span class="title" flex="cross:center">
            {{item.placeofdeparture}}
            <svg-icon class="flight-icon" href="iconico" />
            {{item.destination}}
          </span>
          <span class="price">￥{{item.sumrealprice}}</span>
        </div>
        <div
          flex-item="1"
          class="basis"
          flex="cross:end dir:row-reverse"
        >{{item.physic_farebasis}}({{item.farebasis}}舱)</div>
        <div flex="cross:center main:between">
          <span class="tel">
            <span class="username"></span>
            {{item.passengername}} {{item.phoneNumber}}
          </span>
          <span class="flightno">{{item.flightno}}</span>
        </div>
        <div flex="cross:end main:between">
          <span class="ticket">票号 {{item.ticket_id}}</span>
          <span class="company">{{item.company}}</span>
        </div>
      </div>
    </div>
    <template slot="right">
      <!-- <van-button class="swipe-btn" square type="danger" :text="journeyCommentMap.get(item.journey_comment)"/> -->
      <van-button
        v-if="item.user_confirm_state === 1"
        class="swipe-btn"
        @click="toast(0)"
        square
        type="primary"
        text="取消"
      />
      <van-button
        v-else-if="item.user_confirm_state === 0"
        class="swipe-btn"
        @click="toast(1)"
        square
        type="primary"
        text="确认"
      />
    </template>
  </van-swipe-cell>
</template>
<script>
import Vue from 'vue'
import { SwipeCell, Button, Toast, Dialog, Checkbox } from 'vant'
import ApiJourney from '@/api/journey'
import staticDataMaps from '@/mock/staticDataMap'

Vue.use(SwipeCell).use(Button).use(Checkbox)
const { ticketstateIconMap, ticketstateMap, ticketConfirmStateMap, journeyExpenseStateMap, journeyCommentMap } = staticDataMaps

export default {
  props: {
    item: Object,
    isChecked: Boolean,
    checkDisable: {
      type: Boolean,
      default: false
    },
    showCheckBox: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      ticketstateMap,
      ticketConfirmStateMap,
      journeyExpenseStateMap,
      journeyCommentMap,
      ticketstateIconMap,
      checked: false
    }
  },
  methods: {
    message () {
      if (this.checkDisable && !this.checked) {
        Toast('最多只能选择20个行程!')
      }
    },
    toDetail () {
      if (this.showCheckBox) {
        if (!this.checkDisable || this.checked) {
          this.checked = !this.checked
        } else {
          Toast('最多只能选择20个行程!')
        }
      } else {
        this.$router.push(`/planeNoteDetail?id=${this.item.id}`)
      }
    },
    toast (type) { // 弹窗提示,0取消，1确认
      let title = '提示'
      let message = ''
      let className = ''
      let callback
      switch (type) {
        case 0:
          message = '是否取消本次行程？'
          callback = this.cancelJourney
          break
        case 1:
          message = '确认本次行程将用于报销，请确认以下信息是否属实：\n1）本次行程已实际使用\n2）本次行程是因公出行'
          callback = this.confirmJourney
          className = 'align-left'
      }
      Dialog.confirm({
        title,
        message,
        className
      }).then(() => {
        callback()
      }).catch(() => { })
    },
    confirmJourney () { // 确认行程
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      const { categoryId, tel } = userInfo
      ApiJourney.confirmJourney({
        categoryId,
        journeyId: this.item.id,
        obtUserName: tel
      }).then(res => {
        this.$store.dispatch('removeLoading')
        const { resultStr, successState } = res.CommonModel
        if (successState) {
          this.$emit('confirmItem') // 通知列表确认行程
        }
        Toast(resultStr)
      })
    },
    cancelJourney () { // 取消行程
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      const { categoryId, tel } = userInfo
      ApiJourney.cancelJourney({
        categoryId,
        journeyId: this.item.id,
        obtUserName: tel
      }).then(res => {
        const { resultStr, successState } = res.CommonModel
        if (successState) {
          this.$emit('deleteItem') // 通知列表移除数据
        }
        Toast(resultStr)
      })
    }
  },
  watch: {
    isChecked: {
      handler (val) {
        this.checked = val
      },
      immediate: true
    },
    checked (val) {
      this.$emit('update:isChecked', val)
    }
  }
}
</script>
<style lang="less" scoped>
@import '~vant/es/style/var';
.cell {
  margin-top: 6px;
  &:first-child {
    margin-top: 0;
  }
  .list-item {
    background-color: white;
    height: 100.5px;
    padding: 9px 15px;
    box-sizing: border-box;
  }
}
.left {
  border-right: 1px dashed #ddd;
  padding-right: 6px;
  .ticketstate-icon {
    width: 12px;
    height: 12px;
    margin-left: 3px;
  }
  .time {
    font-size: 13px;
    color: #9b9b9b;
    .year {
      font-size: 12px;
    }
  }
  .status {
    font-size: 13px;
    color: #007ec8;
  }
  .sm-status {
    font-size: 9.5px;
    color: #9b9b9b;
  }
}
.right {
  padding-left: 8px;
  .flight-icon {
    width: 16px;
    height: 16px;
    margin: 0 3px;
  }
  .title {
    font-size: 13.5px;
    color: #4a4a4a;
  }
  .price {
    font-size: 13px;
    color: #007ec8;
  }
  .basis {
    font-size: 12px;
    color: #9b9b9b;
  }
  .username {
    font-size: 12px;
    color: #4a4a4a;
  }
  .tel {
    font-size: 12px;
    color: #4a4a4a;
  }
  .flightno {
    font-size: 12px;
    color: #9b9b9b;
  }
  .ticket {
    font-size: 10px;
    color: #9b9b9b;
  }
  .company {
    font-size: 12px;
    color: #9b9b9b;
  }
}

.swipe-btn {
  height: 100%;
}
.checkbox {
  margin-right: 8px;
}
</style>

<style>
.align-left .van-dialog__message {
  text-align: left;
}
</style>
