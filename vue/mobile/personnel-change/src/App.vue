<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-05-21 14:14:04
 * @LastEditors: peng
 * @LastEditTime: 2021-07-27 09:30:00
-->
<template>
  <div class="w">
    <van-search v-model="fdUserName" placeholder="请输入同事姓名"  @blur="onSearch"/>
    <van-tabs v-model="active" replace swipeable animated >
      <van-tab title="部门人员动态" :name="1">
        <ListItem :active="active" :fdUserName="fdUserName" ref="depPersonnel" :type="1" @setUrl="changeToLinkUrl"/>
      </van-tab>
      <van-tab title="总部全员动态" :name="2">
        <ListItem :active="active" :fdUserName="fdUserName" ref="headAllPersonnel" :type="2" @setUrl="changeToLinkUrl"/>
      </van-tab>
      <van-tab title="历史全员动态" :name="3">
        <ListItem :active="active" :fdUserName="fdUserName" ref="historyAllPersonnel" :type="3" @setUrl="changeToLinkUrl"/>
      </van-tab>
    </van-tabs>
    <div class="btn-box">
      <button @click="toLink">登记去向</button>
    </div>
  </div>
</template>

<script>
import ListItem from './components/ListItem.vue'

export default {
  components: {
    ListItem
  },

  data () {
    return {
      toLinkUrl: '',
      fdUserName: '',
      active: 1,
      type: ''
    }
  },
  methods: {
    onSearch () {
      this.load({
        active: this.active,
        fdUserName: this.fdUserName
      })
    },
    load (obj) {
      const { active } = obj
      switch (active) {
        case '1':
          this.$refs.depPersonnel.onLoad()
          break
        case '2':
          this.$refs.headAllPersonnel.onLoad()
          break
        case '3':
          this.$refs.historyAllPersonnel.onLoad()
          break
        default:
          break
      }
    },
    changeToLinkUrl (url) {
      this.toLinkUrl = url
    },
    toLink () {
      console.log(this.toLinkUrl)
      window.location.href = this.toLinkUrl
      // window.open(this.toLinkUrl)
    }
  }
}
</script>
<style lang="less">
  body {
    background: #f5f5f6;
    font-family: PingFangSC-Regular,PingFang SC;
  }
  *{
    box-sizing: border-box;
  }
</style>
<style lang="less" scoped>
.fcc{
  display: flex;
  justify-content: center;
  align-items: center;
}
.status-color(@color){
  border-color: @color;
  color: @color;
}
.w{
  ::v-deep .van-search{
    height: 52px;
    .van-search__content{
      background-color: rgba(25,31,36,.04);
      height: 36px;
      border-radius: 21px;
    }
  }
  ::v-deep .van-tabs{
    .van-tabs__wrap{
      height: 54px;
      .van-tabs__nav{
        .van-tab--active{
          color: #1e89ff;
          font-size: 15px;
        }
        .van-tabs__line{
          background: linear-gradient(270deg,#40beff 0,#1e89ff 100%);
          height: 2PX;
          border-radius: 1.5px;
        }
      }
    }
    .van-tabs__content{
      height: calc(100vh - 52px - 54px);
      .van-tab__pane{
        height: 100%;
      }
    }
  }

  .btn-box{
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    height: 50px;
    background: #FFFFFF;
    .fcc;
    button{
      width: 346px;
      height: 38px;
      background: linear-gradient(180deg, #00BEFF 0%, #0067FF 100%);
      box-shadow: 0px 1px 0px 0px rgba(25, 31, 36, 0.08);
      border-radius: 19px;
      font-size: 15px;
      color: #FFFFFF;
      border: 0;
      outline: 0;
      &:active {
        background: #1b7be6;
        border-color: #1b7be6;
        color: #fff;
      }
    }
  }
}
</style>
