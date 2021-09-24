<template>
    <div>
      <van-action-sheet v-model="isShow" :round="isRound">
        <div class="item" v-for="(item, index) in list" :key="index">
          <div class="box">
            <img :src="item.photo?item.photo:item.img?item.img:groupHeader" alt="" class="header">
            <div class="name-box">
              <span class="name">{{item.name1?item.name1:item.later?item.later:item.name}}</span>
              <span class="small-name">{{item.name2?item.name2:item.secretary}}</span>
            </div>
          </div>
          <span @click="deleteFn(item.id)">
            <SvgIcon href="shanchu" class="icon"/>
          </span>
        </div>
      </van-action-sheet>
    </div>
</template>

<script>
import Vue from 'vue'
import {
  ActionSheet,
  Toast
} from 'vant'

Vue.use(ActionSheet)
  .use(Toast)
export default {
  props: {
    listType: {
      type: String
    },
    sourceData: {
      type: Array
    }
  },
  data () {
    return {
      groupHeader: require('./../assets/img/group.png'),
      isRound: false,
      isShow: false
    }
  },
  computed: {
    list () {
      let chosenData = this.$store.state.handleChosen[this.listType + 'Data']
      if (this.listType === 'otherDepartmentCirculate' || this.listType === 'otherDepartmentHandle') {
        chosenData = JSON.parse(JSON.stringify(chosenData).replace(/dept/g, 'name'))
      }
      if (this.listType === 'ownDepartmentCirculate') {
        chosenData = chosenData.filter(item => {
          return item.isCheck
        })
      }
      // console.log(chosenData)
      return chosenData
    }
  },
  methods: {
    deleteFn (id) {
      let arr = this.$store.state.handleChosen[this.listType]
      let arrData = this.$store.state.handleChosen[`${this.listType}Data`]
      const isType = type => obj => Object.prototype.toString.call(obj) === `[object ${type}]`
      const isArray = isType('Array')
      const isString = isType('String')
      if (isArray(arr)) {
        arr.splice(arr.indexOf(id), 1)
        arrData.forEach((item, index) => {
          if (item.id === id) {
            arrData.splice(index, 1)
          }
        })
      } else if (isString(arr)) {
        arr = ''
        arrData.splice(0, 1)
      }
      this.$nextTick(() => {
        this.$store.dispatch(`set${this.listType.replace(this.listType[0], this.listType[0].toUpperCase())}`, arr)
        this.$store.dispatch(`set${this.listType.replace(this.listType[0], this.listType[0].toUpperCase())}Data`, arrData)
      })
      // console.log(this.$store.state.handleChosen[this.listType])
      // console.log(this.$store.state.handleChosen[`${this.listType}Data`])
      if (this.$store.state.handleChosen[`${this.listType}Data`].length === 0) {
        this.isShow = !this.isShow
      }
    },
    isShowList () {
      this.isShow = !this.isShow
    }
  }
}
</script>

<style scoped lang="less">
.item{
  display: flex;
  padding: 10px 30px 10px 38px;
  justify-content: space-between;
  align-items: center;
  .box{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .header{
    margin-right: 14px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .name-box{
    display: flex;
    flex-direction: column;
    .name{
      font-size:17px;
      color:#04101F;
      line-height:17px;
    }
    .small-name{
      margin-top: 4px;
      font-size:14px;
      color:#7B8283;
      line-height:17px;
    }
  }
  .icon{
    width: 22px;
    height: 22px;
  }
}
</style>
