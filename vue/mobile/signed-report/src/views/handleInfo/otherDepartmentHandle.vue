<template>
    <div>
      <div class="content">
        <Panel>
          <RadioList :list="list" :sourceData="sourceData" listType="otherDepartmentHandle"/>
        </Panel>
      </div>
      <ChosenBox :list="list" listType="otherDepartmentHandle" :sourceData="sourceData"/>
    </div>
</template>

<script>
import Vue from 'vue'
import { Toast } from 'vant'
import RadioList from '@c/RadioList'
import Panel from '@c/Panel'
import ChosenBox from '@c/RadioBox'

import handleApi from '@a/handleApi'
if (process.env.NODE_ENV === 'development') {
  require('@m/handleInfo')
}
Vue.use(Toast)
export default {
  data () {
    return {
      list: [],
      sourceData: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      handleApi.otherDepartmentHandleInit(
        {
          fdParentId: ''
        }
      ).then(res => {
        if (res.data && res.data.length === 0) {
          Toast('没有更多数据了')
          return false
        }
        this.sum = res.sum
        this.sourceData = res.data
        let arr = JSON.parse(JSON.stringify(res.data).replace(/dept/g, 'name1'))
        arr = JSON.parse(JSON.stringify(arr).replace(/staff/g, 'name2'))
        this.list = arr
      }).catch((e) => {
        Toast.fail(e)
      })
    }
  },
  components: {
    Panel,
    RadioList,
    ChosenBox
  }
}
</script>

<style scoped lang="less">
.content{
  padding-bottom: 58px;
}
.panel{
  padding-left: 16px;
  background-color: #fff;
  .item{
    height: 60px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #C5CED8;
    font-size:17px;
    color:rgba(4,16,31,1);
    &:last-child{
      border-bottom: 0;
    }
  }
  & + .panel{
  margin-top: 8px;
}
}
</style>
