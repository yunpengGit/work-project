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
      <ChosenListSub ref="chosenList" :chosenData="chosenData" :listType="listType"/>
    </div>
</template>

<script>
import Vue from 'vue'
import {
  Button
} from 'vant'
import ChosenListSub from './ChosenListSub'

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
    chosenData () {
      let arr = []
      arr = this.$store.state.handleChosen[this.listType + 'Data']
      arr = arr.filter(item => {
        return item.isCheck
      })
      // console.log(arr)
      // if (this.listType === 'ownDepartmentCirculate' || this.listType === 'otherDepartmentCirculate') {
      //   arr = arr.filter(item => {
      //     return item.isCheck
      //   })
      // }
      // console.log(arr)
      return arr
    },
    num () {
      return this.chosenData.length || 0
    }
  },
  methods: {
    showChosenList () {
      if (this.chosenData.length !== 0) {
        this.$refs.chosenList.isShowList()
      }
    },
    clean () {
      let data = this.$store.state.handleChosen[`${this.listType}Data`]
      data = data.map(item => {
        item.isCheck = false
        return item
      })
      this.$store.dispatch(`set${this.listType.replace(this.listType[0], this.listType[0].toUpperCase())}Data`, data)
    },
    submit () {
      let chosenIdList = this.$store.state.handleChosen[this.listType]
      let chosenListData = this.$store.state.handleChosen[this.listType + 'Data']
      const isType = type => obj => Object.prototype.toString.call(obj) === `[object ${type}]`
      const isArray = isType('Array')
      const isString = isType('String')
      if (chosenIdList && chosenIdList.length === 0) {
        if (this.listType === 'ownDepartmentCirculate' || this.listType === 'otherDepartmentCirculate') {
          let chosenListData = this.$store.state.handleChosen[this.listType + 'Data']
          if (chosenListData.length !== 0) {
            this.$store.dispatch(`set${this.listType.replace(this.listType[0], this.listType[0].toUpperCase())}Data`, chosenListData)
            this.$router.push('/subsidiaryCompany')
            return false
          }
        }
        this.$store.dispatch(`set${this.listType.replace(this.listType[0], this.listType[0].toUpperCase())}Data`, [])
        this.$router.push('/subsidiaryCompany')
        return false
      }
      let chosenData = []
      if (isArray(chosenIdList)) {
        if (chosenIdList) {
          chosenIdList.forEach(item => {
            this.sourceData.forEach(item1 => {
              if (item === item1.id) {
                chosenData.push(item1)
              }
            })
          })
        }
      } else if (isString(chosenIdList)) {
        this.sourceData.forEach(item1 => {
          if (chosenIdList === item1.id) {
            chosenData.push(item1)
          }
        })
      }
      if (this.listType === 'ownDepartmentCirculate') {
        let chosenListData = this.$store.state.handleChosen[this.listType + 'Data']
        if (chosenListData.length !== 0) {
          chosenData = [...chosenListData, ...chosenData]
        }
        let obj = {}
        chosenData = chosenData.reduce((cur, next) => {
          // eslint-disable-next-line no-unused-expressions
          obj[next.id] ? '' : obj[next.id] = true && cur.push(next)
          return cur
        }, [])
      }
      this.$store.dispatch(`set${this.listType.replace(this.listType[0], this.listType[0].toUpperCase())}Data`, chosenListData)
      this.$router.push('/subsidiaryCompany')
    }
  },
  components: {
    ChosenListSub
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
