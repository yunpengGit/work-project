<template>
    <div>
      <van-radio-group v-model="chosen" ref="checkboxGroup">
        <van-radio v-for="(item, index) in list" :key="index" :name="item.id">
          <div class="box">
            <img :src="item.photo?item.photo:item.img?item.img:groupHeader" alt="" class="header">
            <div class="name-box">
              <span class="name">{{item.name1}}</span>
              <span class="small-name">{{item.name2}}</span>
            </div>
          </div>
        </van-radio>
      </van-radio-group>
    </div>
</template>

<script>
import Vue from 'vue'
import {
  RadioGroup,
  Radio
} from 'vant'

Vue.use(RadioGroup)
  .use(Radio)
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
        return this.$store.state.handleChosen[this.listType] ? this.$store.state.handleChosen[this.listType] : ''
      },
      set (val) {
        this.$store.state.handleChosen[this.listType] = val
        let obj
        this.sourceData.forEach((item) => {
          if (item.id === val) {
            obj = item
          }
        })
        this.$store.dispatch(`set${this.listType.replace(this.listType[0], this.listType[0].toUpperCase())}Data`, [obj])
      }
    }
  }
}
</script>
<style lang="less">
.van-radio__label{
  flex: 1;
}
.van-radio{
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
