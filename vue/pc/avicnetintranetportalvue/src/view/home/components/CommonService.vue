<template>
  <div ref="componentBox" class="component-box">
    <div ref="continerBox" class="continer-box continer-box-title clearfix">
      <span class="fl">
        常办业务
      </span>
      <span v-if="!draggableEnabled" class="fr info-btn" @click="$router.push('/setWork')">
        <span class="info-btn-icon"><icon-svg name="dingzhi" />定制</span>
      </span>
      <span v-if="appData.length>0&&!draggableEnabled" class="fr info-btn" @click="sortFn">
        <span class="info-btn-icon"><icon-svg name="paixu" />排序</span>
      </span>
      <span v-if="draggableEnabled" class="fr info-btn" @click="sortSaveFn">
        <span class="info-btn-icon">保存</span>
      </span>
    </div>
    <div v-if="appData.length>0" class="cont">
      <!-- <div class="clearfix list-group"> -->
      <!-- 排序 -->
      <draggable
        v-if="isSort"
        :list="appData"
        tag="div"
        :disabled="!draggableEnabled"
        class="list-group"
        ghost-class="ghost"
        :move="checkMove"
        @start="dragging = true"
        @end="dragging = false"
      >
        <transition-group type="transition" :name="'flip-list'">
          <div v-for="item in appData" :key="'sort'+item.order" class="item">
            <span class="service" @click="routeToTab(item)"><icon-svg class="icon-span" name="wenben2" />{{ item.appOrResourceName }}</span>
          </div>
        </transition-group>
      </draggable>
      <el-carousel
        v-else
        :autoplay="false"
        :height="carouselHeight + 'px'"
        arrow="never"
      >
        <el-carousel-item v-for="(ele, idx) in carouselData" :key="idx + ele[0]?ele[0].order:'empty' + idx">
          <div v-for="item in ele" :key="idx + item?item.order:'empty'" class="item">
            <span class="service" @click="routeToTab(item)"><icon-svg class="icon-span" name="wenben2" />{{ item.appOrResourceName }}</span>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div v-else class="component-box-empty">
      <img :src="tipIcon" alt="" class="icon">
      <div class="text">{{ tipText }}</div>
    </div>
  </div>
</template>

<script>
const _debounce = require('lodash.debounce')
// const _cloneDeep = require('lodash.clonedeep')
import calc from './../dragHome/calc'
import iconSvg from '@/components/icon-svg'
import routeToNewTab from '@/mixins/routeToNewTab'
import draggable from 'vuedraggable'
export default {
  name: 'Application',
  components: {
    iconSvg,
    draggable
  },
  mixins: [routeToNewTab],
  props: {
    height: {
      type: Number,
      default: 150
    }
  },
  data () {
    return {
      carouselHeight: 130,
      isSort: false,
      carouselData: [],
      appData: [
        // {
        //   appOrResourceId: '-1',
        //   appOrResourceName: '定制',
        //   fixed: true,
        //   icon: require('./../../../assets/home/dingzhi.png'),
        //   order: 'dingzhi',
        //   type: 0,
        //   url: '/setApplication'
        // }
      ],
      tipIcon: require('@/assets/home/components/app.png'),
      tipText: '点击右侧【定制】按钮，可根据工作需要添加常用业务',
      yingyongguanli: require('./../../../assets/home/yingyongguanli.png'),
      dragging: false,
      draggableEnabled: false,
      loadingInstance: '',
      itemH: 32,
      itemW: 160,
      pageSize: 9
    }
  },
  mounted () {
    this.addClosest()
    this.init()
  },
  methods: {
    addClosest () {
      if (!Element.prototype.matches) {
        Element.prototype.matches =
          Element.prototype.msMatchesSelector ||
          Element.prototype.webkitMatchesSelector
      }

      if (!Element.prototype.closest) {
        Element.prototype.closest = function (s) {
          var el = this

          do {
            if (Element.prototype.matches.call(el, s)) return el
            el = el.parentElement || el.parentNode
          } while (el !== null && el.nodeType === 1)
          return null
        }
      }
    },
    init () {
      // setTimeout(() => { loadingInstance.close() }, 3000)
      this.$api('home.getUserRankList', { type: 1 }).then(res => {
        this.loadingInstance && this.loadingInstance.close()
        let arr = []
        if (res.data) {
          arr = res.data.map((ele, index) => {
            ele.order = index + 1
            if (ele.appOrResourceId === '-1') {
              ele.url = '/manage'
              ele.icon = this.yingyongguanli
              ele.fixed = true
            } else {
              ele.fixed = false
            }
            return ele
          })
        }
        this.appData = arr
        this.resize()
      })
    },
    resize (PBlockW, PBlockH) {
      // 动态计算数据条数
      const itemW = this.itemW
      const itemH = this.itemH
      const blockW = PBlockW || this.$refs.componentBox.offsetWidth
      let blockH = (PBlockH || this.$refs.componentBox.offsetHeight) - 55
      this.carouselHeight = blockH
      blockH = blockH - 32 // ! 优化显示，防止内容和分页圆点重合
      const colNum = ~~(blockW / itemW)
      // console.log(itemH, colNum, blockH)
      this.pageSize = calc(itemH, colNum, blockH)
      // console.log(this.pageSize)
      this.carouselDataFn(this.pageSize)
      // console.log(this.pageSize)
      // console.log(itemH, colNum, blockH)
    },
    carouselDataFn (num) {
      const data = this.appData
      let index = 0
      const arr = []
      const count = num || this.pageSize
      while (index < data.length) {
        var childArr = data.slice(index, index += count)
        // if (childArr.length < count) {
        //   var len = count - childArr.length
        //   for (let i = 0; i < len; i++) {
        //     childArr.push({})
        //   }
        // }
        arr.push(childArr)
      }
      this.carouselData = arr
    },
    routeToTab (item) {
      // console.log(item.url.split('/')[2] === process.env.VUE_APP_BASE_URL, 2222, item.url.split('/')[2], 333, process.env.VUE_APP_BASE_URL)
      let path = ''
      if (item.appOrResourceId === '-1') {
        this.$router.push(item.url)
      } else {
        if (item.type === 0 && item.url.split('/')[2] === process.env.VUE_APP_BASE_URL) {
          path = `/${item.url.split('/')[3]}`
          this.$router.push({ path: path })
        } else {
          if (item.url.indexOf('http://') > -1 || item.url.indexOf('https://') > -1) {
            window.open(item.url, '_blank')
          } else {
            window.open('http://' + item.url, '_blank')
          }
          // window.open(item.url, '_blank')
        }
      }
    },
    sortFn () {
      this.$refs.continerBox.style.borderRadius = '4px 4px 0 0'
      this.$refs.continerBox.style.overflow = 'hidden'
      const el = this.$refs.componentBox.closest('.vue-grid-item')
      el.style.zIndex = 1
      el.style.overflow = 'inherit'
      this.isSort = !this.isSort
      this.draggableEnabled = !this.draggableEnabled
    },
    checkMove ({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      )
    },
    sortSaveFn: _debounce(
      function () {
        const data = this.appData.filter(ele => {
          return ele.appOrResourceId !== '-1'
        })
        this.loadingInstance = this.$loading({
          lock: true,
          target: document.querySelector('.component-box')
        })
        const arr = data.map(e => {
          return e.id
        })
        this.$api('home.rankApp', arr).then(res => {
          this.isSort = !this.isSort
          this.draggableEnabled = !this.draggableEnabled
          this.$refs.continerBox.style.overflow = 'hidden'
          this.init()
        })
      }, 100
    )
  }
}
</script>
<style lang="scss">
.el-carousel{
  .el-carousel__indicators{
    .el-carousel__indicator{
      .el-carousel__button{
        opacity: 1;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #D8D8D8;
      }
      &.is-active button{
        background-color: rgba($color: #191f24, $alpha: 0.36)
      }
    }
  }
}
</style>
<style lang="scss" scoped>
@import '@/ui/size/mixin.scss';
@mixin serviceItem{
  .item {
    position: relative;
    margin: 0 0 3px;
    width: 160px;
    /* margin-right: 25px; */
    font-size: 14px;
    text-align: left;
    .draggable-icon{
      position: absolute;
      right: 10px;
      top: 0;
      height: 24px;
      width: 24px;
      border-radius: 50%;
      background-color: #fff;
      z-index: 1;
      cursor: pointer;
    }
    .service{
      box-sizing: border-box;
      cursor: pointer;
      padding: 0 6px;
      width: 140px;
      height: 29px;
      line-height: 29px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-align: left;
      vertical-align: middle;
      font-size: 14px;
      color: #181931;
      .icon-span{
        // width: 12px;
        height: 13px;
        margin-top: 0;
        margin-right: 6px;
        vertical-align: middle;
        color: #499CF8;
      }
      &:hover{
        // background: #499CF8;
        color: #499CF8;
      }
    }
  }
}
@mixin del($sc: 1, $fs: 14PX){
  .component-box {
    height: 100%;
    .cont {
      height: calc(100% - 52px);
      background-color: #fff;
      position: relative;
      /* overflow: hidden; */
      .el-carousel--horizontal{
        overflow-y: hidden;
      }
      .el-carousel{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        .el-carousel__container{
          .el-carousel__item{
            display:flex;
            flex-wrap: wrap;
            align-content: flex-start;
            padding: 10px 0 10px 20px;
            box-sizing: border-box;
            & > *{
              box-sizing: border-box;
            }
            @include serviceItem();
          }
        }
      }
      .list-group {
        min-height: calc(100% - 50px);
        position: absolute;
        z-index: 10;
        top: 0;
        left: 0;
        right: 0;
        background-color: #fff;
        box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.31);
        border-radius: 0 0 4px 4px;
        padding: 15px 0;
        & > * {
          box-sizing: border-box;
        }
        & > span{
          padding-left: 20px;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
        }
        @include serviceItem();
        .ghost {
          opacity: 0.5;
          background: #c8ebfb;
        }
      }
    }
    &-empty{
      height: calc(100% - 55px);
      background-color: #fff;
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
        font-size: $fs;
        color: rgba(25, 31, 36, 0.48);
        line-height: 20px;
      }
    }
  }
  .button {
    margin-top: 35px;
  }
}
@import '@/ui/size/scale.scss'
</style>
