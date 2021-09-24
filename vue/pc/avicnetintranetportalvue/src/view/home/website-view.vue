<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-04-23 11:19:19
 * @LastEditors: zongmz
 * @LastEditTime: 2021-08-24 15:42:09
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
import dragMixin from './mixin/dragMixin'
import dragBasicMixin from './mixin/dragBasicMixin'
import customizeStatus from './mixin/customizeStatus'
import { Base64 } from 'js-base64'
import store from '@/store'
export default {
  name: 'WebsiteView',
  components: {
    GridLayout,
    GridItem
  },
  mixins: [
    dragMixin,
    dragBasicMixin,
    customizeStatus
  ],
  data () {
    return {
      pageWidth: '1592px', // 1560 + 16 + 16 栅格模块横向间距
      pageBgImg: '',
      // 需要动态处理h的组件
      nameList: ['Todo', 'Upcoming', 'FocusWork', 'ToBeRead', 'Done'],
      options: {
        colNum: 12,
        rowHeight: 5,
        isDraggable: false,
        isResizable: false,
        isMirrored: false,
        verticalCompact: true,
        margin: [16, 15],
        useCssransforms: false
      },
      refreshTime: 5000000
    }
  },
  computed: {
    layoutList () {
      const arr = this.layout.map(e => {
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
    store.dispatch('getSecretLevelFn')
    let pageId = this.$route.query.pageId
    // console.log(pageId)
    // console.log(Base64.decode(pageId))
    pageId = Base64.decode(pageId)
    const loadingInstance = this.$loading({
      lock: true,
      target: document.querySelector('.main')
    })
    this.$api('home.pageDetail', { pageId }).then(async res => {
      loadingInstance.close()
      this.pageBgImg = res.data.pageBgImg
      this.pageWidth = res.data.pageWidth
      // const size = window.localStorage.getItem('dataTheme')
      let data = _cloneDeep(JSON.parse(res.data.pageContent))
      if (Object.prototype.toString.call(data) === '[object Array]') {
        // let existNotice = false
        // let existSchedule = false
        // if (data.length > 0) {
        //   const node = data[0]
        //   data = data.map(e => {
        //     if (e.name === 'Notice') existNotice = true
        //     if (e.name === 'Schedule') existSchedule = true
        //     if (size === 'mini') {
        //       if (node.size !== 'mini') {
        //         // 判断当前是否从在Notice Schedule，或者两者都有
        //         if (e.name === 'Notice' || e.name === 'Schedule') {
        //           if (existNotice && !existSchedule) {
        //           // e.size = 'mini'
        //             e.h -= 1
        //           } else if (!existNotice && existSchedule) {
        //           // e.size = 'mini'
        //             e.h -= 1
        //           }
        //         } else {
        //           if (this.nameList.includes(e.name)) {
        //             // e.size = 'mini'
        //             e.h -= 1
        //           }
        //         }
        //       }
        //     } else {
        //       if (node.size !== 'small') {
        //         if (e.name === 'Notice' || e.name === 'Schedule') {
        //           if (existNotice && !existSchedule) {
        //             // e.size = 'small'
        //             e.h += 1
        //           } else if (!existNotice && existSchedule) {
        //             // e.size = 'small'
        //             e.h += 1
        //           }
        //         } else {
        //           if (this.nameList.includes(e.name)) {
        //             // e.size = 'small'
        //             e.h += 1
        //           }
        //         }
        //       }
        //     }
        //     return e
        //   })
        // }
      } else {
        data = _cloneDeep(componentsDefaultConfig)
      }
      this.layout = await this.filterCustomize(data)
      // this.layout = data
      // this.layout = _cloneDeep(componentsConfig)
    }).catch(() => {
      loadingInstance.close()
    })
  },
  methods: {
    resizedEvent (i, newH, newW, newHPx, newWPx, itemName) {
      // console.log(this.$refs[i])
      this.$refs[i][0].resize(i, newH, newW, newHPx, newWPx)
      // console.log('RESIZED i=' + i + ', H=' + newH + ', W=' + newW + ', H(px)=' + newHPx + ', W(px)=' + newWPx, 'itemName=' + itemName)
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
