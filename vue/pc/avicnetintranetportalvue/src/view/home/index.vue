<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-04-23 11:19:19
 * @LastEditors: zongmz
 * @LastEditTime: 2021-08-24 15:41:57
-->
<template>
  <div class="home">
    <div class="main" :style="{width:pageWidth?pageWidth:'1592px'}">
      <grid-layout
        id="content"
        ref="gridlayout"
        :layout.sync="layoutList"
        :col-num="options.colNum"
        :row-height="options.rowHeight"
        :is-draggable="options.isDraggable"
        :is-resizable="options.isResizable"
        :is-mirrored="options.isMirrored"
        :vertical-compact="options.verticalCompact"
        :margin="options.margin"
        :use-css-transforms="options.useCssTransforms"
      >

        <grid-item
          v-for="item in layoutList"
          :key="item.i"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          @resized="(i, newH, newW, newHPx, newWPx) => resizedEvent(i, newH, newW, newHPx, newWPx, item.name)"
        >
          <component :is="item.component" :ref="item.i" :block-config="item" />
        </grid-item>
      </grid-layout>
    </div>
  </div>
</template>

<script>
import { GridLayout, GridItem } from 'vue-grid-layout'
const _cloneDeep = require('lodash.clonedeep')
import componentsDefaultConfig from './dragHome/componentsDefaultConfig'
import customizeStatus from './mixin/customizeStatus'
import { Base64 } from 'js-base64'
export default {
  name: 'Index',
  components: {
    GridLayout,
    GridItem
  },
  mixins: [customizeStatus],
  data () {
    return {
      pageWidth: '1592px', // 1560 + 16 + 16 栅格模块横向间距
      pageBgImg: '',
      layout: [],
      options: {
        colNum: 12,
        rowHeight: 5,
        isDraggable: false,
        isResizable: false,
        isMirrored: false,
        verticalCompact: true,
        margin: [16, 15],
        useCssTransforms: true
      }
    }
  },
  computed: {
    layoutList () {
      const data = _cloneDeep(this.layout)
      const arr = data.map(e => {
        if (e.componentName) {
          e.component = require(`./components/${e.componentName}.vue`).default
          e.blockH = e.h * 20
          if (!e.i) {
            e.i = e.componentId
          }
        }
        return e
      })
      return arr
    }
  },
  watch: {
    pageBgImg () {
      if (this.pageBgImg) {
        const img = require(`@/assets/home/backgroundImage/${this.pageBgImg}.png`)
        document.getElementById('app').style.backgroundImage = `url(${img})`
      }
    }
  },
  created () {
    const loadingInstance = this.$loading({
      lock: true,
      target: document.querySelector('.main')
    })
    let pageId = this.$route.path.split('/')[2]
    if (pageId) {
      pageId = Base64.decode(pageId)
      // pageId = Base64.decode('MzM=')
      // console.log(pageId)
      this.$api('home.pageDetail', { pageId }).then(async res => {
        loadingInstance.close()
        this.pageBgImg = res.data.pageBgImg
        this.pageWidth = res.data.pageWidth
        // console.log(res.data)
        let data
        if (res.data && res.data.pageContent) {
          data = _cloneDeep(JSON.parse(res.data.pageContent))
        } else {
          data = _cloneDeep(componentsDefaultConfig)
        }
        this.layout = await this.filterCustomize(data)
        // this.layout = data
      // this.layout = _cloneDeep(componentsConfig)
      }).catch(() => {
        loadingInstance.close()
      })
    } else {
      this.layout = _cloneDeep(componentsDefaultConfig)
      loadingInstance.close()
    }
  }
}
</script>
<style lang="scss">
.el-tooltip__popper{
  font-size: 14px !important;
  padding: 4px 6px !important;
}
</style>
<style lang="scss" scoped>
@import '@/ui/size/mixin.scss';
@mixin del($sc: 1, $fs: 14PX){
  .vue-grid-item{
    // box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    overflow: hidden;
  }
  .home{
    padding: 0 20px;
    // padding-bottom: 86px;
    .main{
      margin: 0 auto;
      font-size: $fs;
    }
  }
}
@import '@/ui/size/scale.scss'
</style>
