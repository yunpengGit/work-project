<template>
    <div>
       <div class="title-box">
          <div class="title">办理意见</div>
          <div class="common-msg" @click="showCommon"><SvgIcon href="" class="icon"/>常用意见</div>
        </div>
        <textarea name="" id="" class="msg"></textarea>
        <van-checkbox v-model="isCommon" class="is-common">添加为常用意见</van-checkbox>
    </div>
</template>

<script>
import Vue from 'vue'
import {
  Button,
  RadioGroup,
  Radio,
  Checkbox,
  ActionSheet,
  Toast
} from 'vant'

Vue.use(Button)
  .use(RadioGroup)
  .use(Radio)
  .use(Checkbox)
  .use(ActionSheet)
  .use(Toast)
export default {
  props: {

  },
  data () {
    return {

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

  },
  components: {

  }
}
</script>

<style scoped lang="less">
.title-box{
  display: flex;
  justify-content: space-between;
}
.common-msg{
  margin-right: 16px;
  font-size:14px;
  color:#1E89FF;
  line-height:17px;
  display: flex;
  align-items: center;
  // justify-content: center;
  .icon{
    width: 14px;
    height: 14px;
  }
}
.msg{
  width: 363px;
  padding-right: 12px;
  height: 100px;
  overflow: hidden;
  resize: none;
  border: 0;
}
</style>
