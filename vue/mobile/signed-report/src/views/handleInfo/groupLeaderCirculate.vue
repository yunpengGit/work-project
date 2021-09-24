<template>
    <div>
      <div class="content">
        <Panel>
          <CheckboxList :list="list" :showCheckAll="showCheckAll" :sum="sum" listType="groupLeader" :sourceData="sourceData"/>
        </Panel>
      </div>
      <ChosenBox listType="groupLeader" :list="list" :sourceData="sourceData"/>
    </div>
</template>

<script>
import Vue from 'vue'
import { Toast } from 'vant'
import CheckboxList from '@c/CheckboxList'
import Panel from '@c/Panel'
import ChosenBox from '@c/ChosenBox'
import handleApi from '@a/handleApi'
if (process.env.NODE_ENV === 'development') {
  require('@m/handleInfo')
}

Vue.use(Toast)
export default {
  data () {
    return {
      showCheckAll: true,
      sum: 0,
      list: [],
      sourceData: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      handleApi.groupLeaderCirculateInit(
        {
          type: true,
          fdParentId: ''
        }
      ).then(res => {
        if (res.data && res.data.length === 0) {
          Toast('没有更多数据了')
          return false
        }
        this.sum = res.sum
        this.sourceData = res.data
        let arr = res.data
        // JSON.parse(JSON.stringify(res.data).replace(/name/g, 'name1'))
        // arr = JSON.parse(JSON.stringify(arr).replace(/secretary/g, 'name2'))
        this.list = arr
      }).catch((e) => {
        Toast.fail(e)
      })
    }
  },
  components: {
    Panel,
    CheckboxList,
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
