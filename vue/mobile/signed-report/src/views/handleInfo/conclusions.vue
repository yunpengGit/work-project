<template>
  <div >
    <div class="list">
      <van-radio-group v-model="conclusionsChosen" ref="checkboxGroup" @change="radioGroupChange">
      <van-radio v-for="(item, index) in list" :key="index" :name="item.id">
        <span class="text">{{item.text}}</span>
      </van-radio>
    </van-radio-group>
    </div>
    <div class="btn-box">
      <van-button type="info" class="btn" @click="submitFn">提交</van-button>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { RadioGroup, Radio, Button } from 'vant'
Vue.use(RadioGroup)
  .use(Radio)
  .use(Button)
export default {
  props: {

  },
  data () {
    return {
      conclusionsChosen: '',
      list: [
        { id: '1', text: '已以×x××号发至×××。' },
        { id: '2', text: '已于XX年X月X日报名，由XX参加会议。' },
        { id: '3', text: '已于XX年X月X日按XX要求发传真至XXX报送材料' },
        { id: '4', text: '已于XX年X月X日通过电子邮件将XX报至XX@XX XXX。' },
        { id: '5', text: '已于XX年X月X日通过X (机要号)报至XXX。' },
        { id: '6', text: '由于XX (原因)，我单位不参加本次会议。' },
        { id: '7', text: '此文应由××（部门）办理。' },
        { id: '8', text: '此文不办理，说明如下: XXXXX。' },
        { id: '9', text: '此文通过XXX (方式)办理，说明如下: XXXX' }
      ]
    }
  },
  computed: {

  },
  created () {

  },
  mounted () {

  },
  watch: {

  },
  methods: {
    radioGroupChange () {
      this.$store.dispatch('setTransferredOpinion', this.conclusionsChosen)
    },
    submitFn () {
      let obj = this.list[this.conclusionsChosen - 1]
      this.$store.dispatch('setTransferredOpinion', obj)
      this.$router.push('/')
    }
  },
  components: {
  }
}
</script>

<style scoped lang="less">
.van-radio{
  height: 58px;
  box-shadow:0px 0px 0px 0px rgba(197,206,216,1);
  border-bottom: 1px solid #C5CED8;
}
.list{
  margin-top: 8px;
  margin-bottom: 120px;
  padding-left: 16px;
  background-color: #fff;
  .text{
    padding-right: 14px;
    padding-left: 2px;
    font-size: 17px;
    color:rgba(25,31,36,1);
    line-height:24px;
  }
}
.btn-box{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 64px;
  background-color: #fff;
  box-shadow:0px 2px 0px 0px rgba(197,206,216,1);
  display: flex;
  justify-content: center;
  align-items: center;
  .btn{
    width: 335px;
    height: 44px;
    border-radius: 8px;
  }
}
</style>
