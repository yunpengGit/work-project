<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-04 20:09:53
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-09-03 17:21:17
-->
<template>
  <div class="add-msg-container">
    <van-form>
      <!-- <h3>车辆信息</h3> -->
      <van-cell-group>
        <van-field
          readonly
          required
          v-model="paramsVal.tplScope"
          label="发送方式"
          placeholder="请选择发送方式"
          input-align="right"
          right-icon="arrow"
          @click="showSheet('tplScope')"
        />
        <van-field
          readonly
          v-model="paramsVal.sendScope"
          label="人员范围"
          placeholder="全体人员"
          input-align="right"
        />
        <van-field
          readonly
          required
          v-model="paramsVal.receiveUserTypes"
          label="人员类型"
          placeholder="请选择人员类型"
          input-align="right"
          right-icon="arrow"
          @click="showSheet('receiveUserTypes')"
        />
        <van-field
          readonly
          required
          v-model="paramsVal.themeCode"
          label="推送主题"
          placeholder="请选择推送主题"
          input-align="right"
          right-icon="arrow"
          @click="showSheet('themeCode')"
        />
      </van-cell-group>
    </van-form>
    <div class="form-item">
      <h3><span>推送内容</span></h3>
      <van-field
        required
        v-model="params.tplContent"
        placeholder="请填写推送内容"
        type="textarea"
        maxlength="200"
        colon
        show-word-limit
      />
    </div>
    <van-action-sheet
      v-model="actionShow"
      :actions="actions"
      close-on-click-action
      cancel-text="取消"
      @select="onSelect"
    />
    <div class="single-btn-bottom">
      <van-button
        type="info"
        @click="submit"
      >确认推送</van-button>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  props: {
    routeParams: {
      default: Object
    }
  },
  data() {
    return {
      // sheet弹窗
      actionShow: false,
      actions: [],
      // 发送方式
      tplScopeData: [
        { name: 'IM', id: 0 },
        { name: '短信', id: 1 },
        { name: '自动匹配', id: 2 },
        { name: '全部', id: 3 }
      ],
      // 人员类型
      receiveUserTypesData: [
        { name: '参会人', id: 1 },
        { name: '会务组', id: 2 },
        { name: '司机', id: 3 },
        { name: '嘉宾', id: 4 },
        { name: '临时参会人', id: 5 }
      ],
      // 主题
      themeCodeData: [],
      paramsVal: {
        tplScope: '',
        sendScope: '全部',
        receiveUserTypes: '',
        themeCode: ''
      },
      params: {
        conferenceId: '',
        // 发送方式
        tplScope: '',
        // 发送范围 默认全部
        sendScope: 0,
        // 人员类型
        receiveUserTypes: '',
        // 推送主题
        themeCode: '',
        tplContent: '',
        tplTitle: null
      },
      // 选择的类型
      type: ''
    }
  },
  created() {
    console.log(this.routeParams)
    const conferenceId = this.routeParams.conferenceId
    this.params.conferenceId = conferenceId
    this.getTheme()
  },
  methods: {
    showSheet(type) {
      this.actionShow = true
      this.actions = this[`${type}Data`]
      this.type = type
    },
    onSelect(item) {
      this.paramsVal[this.type] = item.name
      this.params[this.type] = item.id
      if (this.type === 'tplScope' || this.type === 'themeCode') {
        const tplScope = this.params['tplScope']
        const themeCode = this.params['themeCode']
        console.log(tplScope, themeCode)
        if (String(tplScope) && themeCode) {
          this.getPushData(tplScope, themeCode)
        }
      }
    },
    submit() {
      const { tplScope, receiveUserTypes, themeCode, tplContent } = this.params
      if (!String(tplScope)) {
        this.$toast('请选择发送方式')
        return
      } else if (!receiveUserTypes) {
        this.$toast('请选择人员类型')
        return
      } else if (!themeCode) {
        this.$toast('请选择推送主题')
        return
      } else if (!tplContent) {
        this.$toast('请填写推送内容')
        return
      }
      const params = this.params
      params.receiveUserType = params.receiveUserTypes
      params.receiveUserTypes = [params.receiveUserTypes]
      this.$api({
        url: 'message.sendMsg',
        data: params
      }).then(res => {
        if (res.code === 2000) {
          this.$toast.success('发送成功，请等待审核')
          setTimeout(() => {
            this.$router.go(-1)
          }, 500)
        }
      })
      // this.$dialog.confirm({
      //   title: '新增车辆',
      //   message: '确认新增？',
      //   className: 'customDialog'
      // })
    },
    getPushData(tplScope = '', themeCode = '') {
      const conferenceId = this.routeParams.conferenceId
      this.$api({
        url: 'message.getPushData',
        data: {
          tplScope, themeCode,
          conferenceId
        }
      }).then(res => {
        const data = res.result.list
        if (data.length) {
          this.params.tplContent = data[0].tplContent
          this.params.tplTitle = data[0].tplTitle
        } else {
          this.params.tplContent = ''
          this.params.tplTitle = null
        }
      })
    },
    getTheme() {
      this.$api({
        url: 'dic.getTheme'
      }).then(res => {
        const data = res.result
        data.forEach(ele => {
          ele.name = ele.valName
          ele.id = ele.valCode
        })
        this.themeCodeData = data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.add-msg-container::v-deep {
  padding: 20px 0 74px;
  min-height: 100%;
  background-color: #f8f8f8;
  .van-form {
    padding: 0 12px;
     > h3 {
      width: 100%;
      height: 44px;
      line-height: 44px;
      padding: 0 4px;
      font-size: 13px;
      color: rgba(25, 31, 36, 0.64);
      background-color: transparent;
    }
    .van-cell-group {
      border-radius: 8px;
      overflow: hidden;
      background: #fff;
      .van-cell {
        height: 56px;
        line-height: 56px;
        padding-top: 0;
        padding-bottom: 0;
        // border-bottom: 1px solid #f0f0f1;
      }
    }
  }
  .van-cell--required {
    &::before {
      content: '';
    }
    .van-cell__title {
      width: auto;
      flex: none;
      span {
        position: relative;
        white-space: nowrap;
        &:before {
          position: absolute;
          right: -10px;
          color: #ee0a24;
          font-size: 14px;
          content: '*';
        }
      }
    }
  }
  .form-item {
    padding: 0 12px;
    > h3 {
      width: 100%;
      height: 44px;
      line-height: 44px;
      padding: 0 4px;
      font-size: 13px;
      color: rgba(25, 31, 36, 0.64);
      background-color: transparent;
      span {
        position: relative;
        &::after {
          position: absolute;
          right: -0.26667rem;
          color: #ee0a24;
          font-size: 0.37333rem;
          content: "*";
        }
      }
    }
    .van-cell {
      border-radius: 8px;
    }
    textarea {
      width: 100%;
      height: 200px;
      background-color: #fff;
      resize: none;
    }
  }
  .van-dialog__content {
    .van-cell {
      line-height: 44px;
    }
  }
  .van-dialog__confirm, .van-dialog__confirm:active {
    color: #1e89ff;
  }
  .single-btn-bottom {
    position: fixed;
  }
  .cars-choice-container {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;
    background-color: #fff;
  }
}
</style>
