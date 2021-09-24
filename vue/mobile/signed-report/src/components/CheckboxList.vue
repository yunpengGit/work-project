<template>
    <div>
      <van-checkbox v-model="checkAll" @click="checkAllFn" v-if="showCheckAll">
        <div class="box check-all-box">
          <span class="text">全选</span>
          <span class="num">{{chosenNum}}/{{sum}}</span>
        </div>
      </van-checkbox>
      <van-checkbox-group v-model="chosen" ref="checkboxGroup" @change="checkboxGroupChange">
        <van-checkbox v-for="(item, index) in list" :key="index" :name="item.id">
          <div class="box">
            <img :src="item.photo?item.photo:groupHeader" alt="" class="header">
            <div class="name-box">
              <span class="name">{{item.name1?item.name1:item.later?item.later:item.name}}</span>
              <span class="small-name">{{item.name2?item.name2:item.secretary}}</span>
            </div>
          </div>
        </van-checkbox>
      </van-checkbox-group>
      <!-- <van-button type="primary" @click="checkAll">全选</van-button>
      <van-button type="info" @click="toggleAll">反选</van-button> -->
    </div>
</template>

<script>
import Vue from 'vue'
import {
  Checkbox,
  CheckboxGroup
} from 'vant'

Vue.use(Checkbox)
  .use(CheckboxGroup)
export default {
  props: {
    listType: {
      type: String
    },
    showCheckAll: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array
    },
    sourceData: {
      type: Array
    },
    sum: {
      type: Number
    }
  },
  data () {
    return {
      groupHeader: require('./../assets/img/group.png')
      // checkAll: false
    }
  },
  computed: {
    chosen: {
      get () {
        let arr = this.$store.state.handleChosen[this.listType]
        const isType = type => obj => Object.prototype.toString.call(obj) === `[object ${type}]`
        const isArray = isType('Array')
        // const isString = isType('String')
        return arr && isArray(arr) ? arr : []
      },
      set (val) {
        this.$store.dispatch(`set${this.listType.replace(this.listType[0], this.listType[0].toUpperCase())}`, val)
        // this.$store.state.handleChosen[this.listType] = val
        // let obj
        // console.log(this.sourceData)
        // this.sourceData.forEach((item) => {
        //   if (item.id === val) {
        //     obj = item
        //   }
        // })
        // console.log(val)
        // console.log(obj)
        // const checkData = this.$store.state.handleChosen[this.listType + 'Data']
        // this.$store.dispatch(`set${this.listType.replace(this.listType[0], this.listType[0].toUpperCase())}Data`, [...checkData, obj])
      }
    },
    chosenNum () {
      let arr = []
      this.chosen && this.chosen.forEach(item => {
        this.list.forEach(item1 => {
          if (item1.id === item) {
            arr.push(item1)
          }
        })
      })
      return arr.length
    },
    checkAll: {
      get () {
        return this.sum !== 0 && this.sum === this.chosenNum
      },
      set (val) {
        val = !val
      }
    }
  },
  methods: {
    checkboxGroupChange () {
      // console.log(123)
      this.$store.dispatch(`set${this.listType.replace(this.listType[0], this.listType[0].toUpperCase())}`, this.chosen)
      // const obj = this.$store.state.handleChosen[this.listType + 'Data']
      let arr = []
      this.chosen.forEach((val) => {
        this.sourceData.forEach((item) => {
          if (item.id === val) {
            // let index = obj.findIndex((itemObj) => {
            //   return item.id === itemObj.id
            // })
            // if (index === -1) {
            //   arr.push(item)
            // }
            arr.push(item)
          }
        })
      })
      this.$store.dispatch(`set${this.listType.replace(this.listType[0], this.listType[0].toUpperCase())}Data`, [...arr])
    },
    checkAllFn () {
      this.$refs.checkboxGroup.toggleAll(!this.checkAll)
    }
  }
}
</script>
<style lang="less">
.van-checkbox__label{
  flex: 1;
}
.check-all-box{
  padding-right: 16px;
  justify-content: space-between;
  .text{
    font-size:17px;
    color:rgba(4,16,31,1);
  }
  .num{
    font-size:14px;
    color:rgba(149,149,149,1);
  }
}
.van-checkbox{
  &:last-child{
    .box{
      border-bottom: 0;
    }
  }
}
</style>
<style scoped lang="less">
.box{
  display: flex;
  align-items: center;
  margin-left: 8px;
  height: 60px;
  border-bottom: 1px solid #C5CED8;
  .header{
    margin-right: 16px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .name-box{
    display: flex;
    flex-direction: column;
  }
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

</style>
