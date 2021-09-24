<template>
    <div>
      <div class="bottom-box">
        <div class="num-box">
          <span>已选择：</span>
          <span>{{num}}</span>
          <span>项</span>
          <span @click="showChosenList">
            <SvgIcon href="shangjiantou" class="icon"/>
          </span>
        </div>
        <div class="btn-box">
          <van-button type="default" class="btn" color="#f0f0f0" @click="clean">清空</van-button>
          <van-button type="info" class="btn" @click="submit">确定</van-button>
        </div>
      </div>
      <ChosenList ref="chosenList" :listType="listType"/>
    </div>
</template>

<script>
import Vue from 'vue'
import {
  Button
} from 'vant'
import ChosenList from './ChosenList'

Vue.use(Button)
export default {
  props: {
    listType: {
      type: String
    },
    list: {
      type: Array
    },
    sourceData: {
      type: Array
    }
  },
  data () {
    return {
    }
  },
  computed: {
    num () {
      let chosenData = this.$store.state.handleChosen[this.listType + 'Data']
      return chosenData.length
    }
  },
  methods: {
    UpdateData ({ list }) {
      this.list = list
    },
    showChosenList () {
      if (this.$store.state.handleChosen[this.listType].length !== 0) {
        this.$refs.chosenList.isShowList()
      }
    },
    clean () {
      this.$store.dispatch(`set${this.listType.replace(this.listType[0], this.listType[0].toUpperCase())}`, [])
      this.$store.dispatch(`set${this.listType.replace(this.listType[0], this.listType[0].toUpperCase())}Data`, [])
    },
    submit () {
      let chosenData = []
      chosenData = this.$store.state.handleChosen[this.listType + 'Data']
      this.$store.dispatch(`set${this.listType.replace(this.listType[0], this.listType[0].toUpperCase())}Data`, chosenData)
      this.$router.push('/subsidiaryCompany')
    }
  },
  components: {
    ChosenList
  }
}
</script>

<style scoped lang="less">
.bottom-box{
  width: 100vw;
  height: 50px;
  background-color: #fff;
  box-shadow:0px 1px 0px 0px rgba(197,206,216,1);
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 99;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .num-box{
    padding-left: 16px;
    font-size:13px;
    color:rgba(30,137,255,1);
    display: flex;
    align-items: center;
    .icon{
      padding: 16px;
      width: 12px;
      height: 12px;
    }
  }
  .btn-box{
    padding-right: 8px;
    display: flex;
    justify-content: flex-end;
    .btn{
      height: 34px;
      line-height: 30px;
      border-radius:4px;
      &:first-child{
        margin-right: 8px;
        color: #1989fa !important;
      }
    }
  }
}
</style>
