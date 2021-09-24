<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-06-21 14:30:13
 * @LastEditors: peng
 * @LastEditTime: 2021-09-09 11:20:49
-->
<template>
  <div ref="componentBox" class="custom component-box">
    <div v-if="isDefault" class="tip-box">
      <img :src="tipAddIcon" alt="" class="icon">
      <div class="text">编辑添加组件</div>
    </div>
    <el-tabs v-else v-model="current" @tab-click="tabChange">
      <el-tab-pane v-for="item in list" :key="item.id" :name="item.id">
        <span slot="label">
          {{ item.name }}<span v-if="item.num > 0" class="tip-num">{{ item.num }}</span>
        </span>
        <div class="content">
          <component :is="item.component" :ref="item.id" :block-config="blockConfig" @updateNum="updateNum" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'Custom',
  props: {
    blockConfig: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isDefault: true,
      // 当前组件内容区域宽高
      blockW: '',
      blockH: '',
      current: '',
      tipAddIcon: require('@/assets/home/components/tipAddIcon.png'),
      contentData: [
        // {
        //   id: +new Date() + '',
        //   componentName: 'Upcoming',
        //   name: '聚合组件'
        //   // component: require(`./Upcoming.vue`).default
        // }
      ],
      list: []
    }
  },
  // computed: {
  //   list () {
  //     const arr = this.contentData.map(e => {
  //       e.component = require(`./${e.componentName}.vue`).default
  //       return e
  //     })

  //     return arr
  //   }
  // },
  watch: {
    contentData () {
      if (this.contentData.length > 0) {
        this.isDefault = false
      }
      const arr = this.contentData.map(e => {
        e.component = require(`./${e.componentName}.vue`).default
        e.num = 0
        return e
      })
      this.list = arr
    },
    blockConfig () {
      this.contentData = this.blockConfig.config
    }
  },
  mounted () {
    if (this.blockConfig && JSON.stringify(this.blockConfig) !== '{}' && this.blockConfig.config) {
      this.contentData = this.blockConfig.config
      this.current = this.contentData[0] && this.contentData[0].id
    }
  },
  methods: {
    updateNum (num, componentName) {
      let idx = 0
      const item = this.list.find((e, index) => {
        if (e.componentName === componentName) {
          idx = index
          e.num = num
          return true
        }
        return false
      })
      this.$set(this.list, idx, item)
      // this.list = this.list.map(e => {
      //   if (e.componentName === componentName) {
      //     e.num = num
      //   }
      //   return e
      // })
    },
    resize () {
      // 当前组件内容区域宽高
      this.blockW = this.$refs.componentBox.offsetWidth
      this.blockH = this.blockConfig.blockH - 55 - 10
      this.updateChildComponent()
    },
    updateConfig (data) {
      this.contentData = data
    },
    updateChildComponent () {
      if (this.list.length === 0) {
        return
      }
      const currentItem = this.list.filter(e => {
        return e.id === this.current
      })
      // console.log(currentItem)
      // console.log(currentItem[0].id)
      // console.log(this.$refs[currentItem[0].id])
      this.$refs[currentItem[0].id][0].resize(this.blockW, this.blockH)
    },
    tabChange () {
      // 切换tab计算更新显示内容条数
      this.updateChildComponent()
    }
  }
}
</script>

<style lang="scss" scoped >
.custom{
  height: 100%;
  background-color: #fff;
  .tip-box{
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .icon{
        width: 190px;
        height: 76px;
      }
      .text{
        text-align: center;
        height: 20px;
        font-size: 14px;
        color: rgba(25, 31, 36, 0.48);
        line-height: 20px;
      }
    }
  ::v-deep .el-tabs {
    height: 100%;
    .el-tabs__header {
      margin-bottom: 0;
      /* background: #f0f2f4; */
      .el-tabs__nav-wrap::after{
        height: 1px;
        background-color: rgba(25, 31, 36, 0.06);
      }
      .el-tabs__nav-next, .el-tabs__nav-prev{
        line-height: 55px;
      }
      .el-tabs__nav-scroll{
        .el-tabs__nav{
          .el-tabs__item {
            span{
              padding: 0px 2px;
            }
            padding: 0 28px;
            font-size: 16px;
            color: #191F24;
            height: 55px;
            line-height: 55px;
            .tip-num{
              font-family: 'Helvetica';
              height: 16px;
              font-size: 16px;
              font-weight: bold;
              color: #FF4402;
            }
          }
          .el-tabs__active-bar{
            height: 4px;
            border-radius: 2px;
            background-color: #499CF8;
          }
        }
      }
    }
    .el-tabs__content{
      overflow: initial;
      height: calc(100% - 55px);
      .el-tab-pane{
        height: 100%;
      }
    }
  }
  ::v-deep .content {
    height: 100%;
    .continer-box-title{
      border-bottom: 0;
      // display: none;
      position: absolute;
      top: -55px;
      right: 0;
      width: auto;
      background: none;
      z-index: 9;
      .info-name{
        display: none;
      }
      &::before{
        display: none;
      }
    }
    // 重置显示内容高度
    .component-box-cont{
      height: 100%;
    }
  }
}
</style>
