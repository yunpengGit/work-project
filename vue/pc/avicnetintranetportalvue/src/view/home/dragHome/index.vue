<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-04-23 11:19:19
 * @LastEditors: peng
 * @LastEditTime: 2021-09-23 15:53:14
-->
<template>
  <div ref="homeDrag" class="home-drag">
    <div v-if="showSidebar" class="sidebar">
      <div class="title">
        <span>卡片编辑</span>
        <span class="close" @click="closeSidebar"><icon-svg name="guanbi" /></span>
      </div>
      <el-collapse v-model="activeNames">
        <el-collapse-item v-for="e in sidebarData" :key="e.groupId" :title="e.categoryName" :name="e.categoryName">
          <div class="list fix">
            <div
              v-for="item in e.components"
              :key="e.groupId+''+item.componentId"
              draggable="true"
              unselectable="on"
              class="item"
              @click="addItem(item)"
            >
              <img :src="item.iconUrl" :alt="item.label" class="icon">
              <span>{{ item.label }}</span>
            </div>
            <!-- <div class="item">
              <img :src="require(`./../../../assets/home/components/xinzeng.png`)" class="icon">
              <span>新增</span>
            </div> -->
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div ref="main" class="main" :style="{width:pageWidth?pageWidth:'1592px'}">
      <div v-if="!isPreview" id="btnBox" class="btn-box">
        <span v-if="!isEdit">
          <el-button @click="edit"><icon-svg name="mubanxinzeng" />卡片编辑</el-button>
          <el-button @click="pageSetting"><icon-svg name="yemianguanli" />页面管理</el-button>
          <el-button @click="backHome"><icon-svg name="tuichu" />退出编辑模式</el-button>
        </span>
        <span v-else>
          <el-button @click="addCard"><icon-svg name="mubanxinzeng" />卡片新增</el-button>
          <el-button v-if="pageId" @click="resetSetting"><icon-svg name="mubanhuifumoren" />恢复默认设置</el-button>
        </span>
      </div>
      <div v-if="isEdit&&isShowGrid" class="grid-block">
        <div v-for="(item,idx) in 12" :key="'line'+idx" class="grid-item" />
      </div>
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
          :x="+item.x"
          :y="+item.y"
          :w="+item.w"
          :h="+item.h"
          :i="item.i"
          @resized="(i, newH, newW, newHPx, newWPx) => resizedEvent(i, newH, newW, newHPx, newWPx, item.componentName)"
        >
          <div class="block" :class="{'block-edit':isEdit}">
            <span v-if="!isPreview" class="btn-edit">
              <span v-if="isEditComponents.includes(item.componentName)" class="setting" @click="editItem(item)"><icon-svg name="shezhi" /></span>
              <span class="delete" @click="removeItem(item)"><icon-svg name="guanbi" /></span>
            </span>
            <component :is="item.component" :ref="item.i" :block-config="item" />
          </div>
        </grid-item>
      </grid-layout>
    </div>
    <div v-if="!isPreview&&isEdit" class="footer-btn">
      <el-button v-if="isCustom" @click="cancel">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
    <el-drawer
      :modal-append-to-body="false"
      size="292px"
      :title="drawerTitle"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="drawerClose"
      :modal="isModal"
    >
      <component
        :is="drawerComponent"
        :config="settingConfig"
        @editComponent="editComponent"
        @pageSettingUpdate="pageSettingUpdate"
        @addTemplate="addTemplate"
        @exitEdit="exitEdit"
        @exitEditItem="exitEditItem"
      />
    </el-drawer>
  </div>
</template>

<script>
import { Loading } from '@avic/golden-pc-ui'
import html2canvas from 'html2canvas'
import { GridLayout, GridItem } from 'vue-grid-layout'
const _cloneDeep = require('lodash.clonedeep')
// import { saveAs } from 'file-saver'
import iconSvg from '@/components/icon-svg'
// import components from './component'
import defaultTemplate from './defaultTemplate'
import { getToken } from '@/utils/auth'

import grid from './../mixin/grid.js'
import customizeStatus from './../mixin/customizeStatus'
import { Base64 } from 'js-base64'

export default {
  name: 'Index',
  components: {
    GridLayout,
    GridItem,
    iconSvg
  },
  mixins: [grid, customizeStatus],
  data () {
    return {
      pageClassification: '1', // 1工作台页面，2其他页面
      isEditComponents: ['Custom', 'CustomList'], // 可编辑组件
      isModal: true,
      isShowGrid: true,
      pageWidth: '1592px', // 1560 + 16 + 16 栅格模块横向间距
      pageBgImg: '',
      pageType: '',
      siteId: '',
      pageId: '',
      sidebarData: [],
      templateName: '',
      isPreview: false,
      showSidebar: false,
      isEdit: false,
      drawerComponent: require(`./SettingDefault.vue`).default,
      pageImgUrl: '',
      layout: [],
      options: {
        colNum: 12,
        rowHeight: 5,
        isDraggable: false,
        isResizable: false,
        isMirrored: false,
        verticalCompact: true,
        margin: [16, 15],
        useCssTransforms: false
      },
      refreshTime: 5000000,
      drawerTitle: '标题',
      settingConfig: {},
      drawer: false,
      direction: 'ltr',
      currentEditComponent: '',
      fullScreenLoadding: ''
    }
  },
  computed: {
    pageClassType () {
      return this.pageClassification
    },
    activeNames: {
      get () {
        const arr = this.sidebarData.map(e => {
          return e.categoryName
        })
        return arr
      },
      set (e) {
        // console.log(e)
      }
    },
    layoutList () {
      const arr = this.layout.map(e => {
        if (e.componentName) {
          e.component = require(`./../components/${e.componentName}.vue`).default
          e.blockH = (+e.h) * 20
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
  async created () {
    // console.log(window.localStorage.getItem('dataTheme'))
    // console.log('处理初始化后卡片 h')
    // const site = this.$route.query.site
    const { siteId, pageId, isCustom } = this.$route.query
    this.isCustom = isCustom
    this.initComponents()
    this.siteId = siteId && Base64.decode(siteId)
    if (pageId) {
      this.pageId = Base64.decode(pageId)
      await this.init(this.pageId)
    }
  },
  methods: {
    initComponents () {
      // this.sidebarData = components
      this.$api('dragHome.componentList').then(res => {
        this.sidebarData = res.data
        // console.log(res)
      })
    },
    init (pageId) {
      const loadingInstance = this.$loading({
        lock: true,
        target: document.querySelector('.main')
      })
      this.$api('home.pageDetail', { pageId }).then(async res => {
        loadingInstance.close()
        // const size = window.localStorage.getItem('dataTheme')
        this.templateName = res.data.pageName
        this.pageType = res.data.pageType
        this.pageBgImg = res.data.pageBgImg
        this.pageWidth = res.data.pageWidth
        const data = _cloneDeep(JSON.parse(res.data.pageContent))
        // this.layout = data
        this.layout = await this.filterCustomize(data)
        // console.log(this.layout)
      // this.layout = _cloneDeep(componentsConfig)
      }).catch(() => {
        loadingInstance.close()
      })
    },
    pageSetting () {
      this.isModal = false
      this.drawerComponent = require(`./SettingPage.vue`).default
      this.drawerTitle = '页面管理'
      this.drawer = true
      this.$nextTick(() => {
        this.settingConfig = {
          pageWidth: this.pageWidth,
          currentPageImgId: this.pageBgImg
        }
      })
    },
    resetSetting () {
      this.layout = []
      this.$nextTick(() => {
        this.layout = defaultTemplate
      })
    },
    closeSidebar () {
      this.showSidebar = false
    },
    edit () {
      this.options.isDraggable = true
      this.options.isResizable = true
      this.showSidebar = true
      this.isEdit = true
    },
    backHome () {
      this.$router.push('/')
    },
    exitEdit () {
      this.init(this.pageId)
      this.drawer = false
      this.options.isDraggable = false
      this.options.isResizable = false
      this.showSidebar = false
      this.isEdit = false
    },
    exitEditItem () {
      this.drawer = false
    },
    editItem (item) {
      let fileName = 'SettingDefault'
      if (item.componentName) {
        fileName = 'Setting' + item.componentName
      }
      try {
        this.drawerComponent = require(`./${fileName}.vue`).default
        this.currentEditComponent = item
      } catch (e) {
        // console.log(e)
      }
      // console.log(item)
      // console.log(require(`./Setting${item.name}.vue`))
      // if (require(`./Setting${item.name}.vue`)) {
      //   this.drawerComponent = require(`./Setting${item.name}.vue`).default
      // }
      this.drawerTitle = item.label
      this.drawer = true
      this.$nextTick(() => {
        this.settingConfig = { config: item.config }
      })
    },
    editComponent (data) {
      this.drawer = false
      // console.log(this.currentEditComponent)
      // console.log(this.$refs[this.currentEditComponent.i])
      // console.log(data, 12341)
      this.currentEditComponent.config = data
      if (this.$refs[this.currentEditComponent.i][0].updateConfig) {
        this.$refs[this.currentEditComponent.i][0].updateConfig(data)
      }
    },
    drawerClose () {
      this.drawer = false
    },
    cancel () {
      this.$router.go(-1)
    },
    screenshot () {
      const userAgent = navigator.userAgent
      //! 优化火狐浏览器保存截图卡顿问题
      if (userAgent.indexOf('Firefox') > -1) {
        const toCanvas = img => {
          var cvs = document.createElement('canvas')
          var ctx = cvs.getContext('2d')
          cvs.width = image.width
          cvs.height = image.height
          ctx.drawImage(image, 0, 0, cvs.width, cvs.height)
          return cvs
        }
        var img = require('./../../../assets/home/preview-img.png')
        const image = new Image()
        image.crossOrigin = ''
        image.src = img
        image.onload = () => {
          const canvas = toCanvas(image)
          canvas.toBlob(blob => {
            const file = new File([blob], `${this.templateName}.png`, { type: 'image/png' })
            const formData = new FormData()
            formData.append('file', file)
            formData.append('name', `${this.templateName}.png`)
            formData.append('storageType', 'oss')
            this.send(file, `截图.png`)
          }, 'image/png', 1)
        }
      } else {
        const el = document.querySelector('#app')
        this.isShowGrid = false

        const elBox = document.querySelector('.main')
        // elBox.scrollIntoView()
        const option = {
          allowTaint: true, // 是否允许跨域图像污染画布,默认就是false
          useCORS: true, // 是否尝试使用 CORS 从服务器加载图像，移动端不兼容
          ignoreElements: (element) => { // 过滤不需要截图的节点
            if (element.tagName.toLowerCase() === 'iframe') {
              return element
            }
            if (element.id === 'btnBox') { // 过滤 按钮模块
              return true
            }
            if (element.className &&
            element.className.indexOf &&
            (element.className.indexOf('grid-block') !== -1 || // 过滤栅格线
            element.className.indexOf('sidebar') !== -1 || // 过滤左侧组件库
            element.className.indexOf('el-drawer__wrapper)') !== -1) // 过滤编辑
            ) {
              return true
            }
            return false
          },
          width: el.offsetWidth, // 获取内容的宽度
          height: elBox.scrollHeight + 146, // 获取内容的高度
          windowHeight: elBox.scrollHeight + 146,
          x: 0, // 页面在水平方向没有滚动，故设置为0
          y: elBox.pageYOffset
        }
        html2canvas(el, option).then((canvas) => {
          canvas.toBlob(blob => {
          // saveAs(blob, '图.png')
            const file = new File([blob], `${this.templateName}.png`, { type: 'image/png' })
            const formData = new FormData()
            formData.append('file', file)
            formData.append('name', `${this.templateName}.png`)
            formData.append('storageType', 'oss')
            this.send(file, `截图.png`)
          }, 'image/png', 1)
        })
      }
    },
    send (file, filename) {
      var xhr, formData

      xhr = new XMLHttpRequest()
      xhr.withCredentials = true

      xhr.open('POST', '/api/file/publicPic/upload')
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
      xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`)
      xhr.onload = () => {
        var json
        if (xhr.status !== 200) {
          this.$message.error('HTTP Error: ' + xhr.status)
          this.fullScreenLoadding.close()
          return
        }

        json = JSON.parse(xhr.responseText)
        if (!json || typeof json.data !== 'string') {
          this.fullScreenLoadding.close()
          this.$message.error('Invalid JSON: ' + xhr.responseText)
          return
        }
        // this.$message.success(json.data)
        this.pageImgUrl = json.data
        this.addTemplate()
      }
      formData = new FormData()
      formData.append('file', file)
      formData.append('name', filename)
      formData.append('storageType', 'oss')

      xhr.send(formData)
    },
    save () {
      // this.screenshot()
      // console.log(this.layout)
      // console.log(this.group)
      if (this.layout.length === 0) {
        this.$message.warning('请新增模板再保存')
        return false
      }
      const h = this.$createElement
      // 新增 更新
      const isCustom = this.$route.query.isCustom
      // 是否为自定义工作台
      let isAdd
      if (isCustom) {
        // 自定义工作台编辑
        if (this.pageType !== 3) { // 自定义工作台新增
          isAdd = true
        }
      } else {
        // 模板编辑
        if (this.pageType === 2) { // 模板新增
          isAdd = true
        }
      }
      this.$prompt('请输入模板名称', '提示', {
        // type: 'warning',
        title: '请输入模板名称',
        // todo 改变属性后同步状态class is-checked
        // message: h('div', {
        //   class: 'check-page-type'
        // }, [
        //   h('label', {
        //     class: 'el-radio is-checked',
        //     attrs: {
        //       for: 'dd'
        //     }
        //   }, [
        //     h('span',
        //       {
        //         class: 'el-radio__input is-checked'
        //       }, [
        //         h('span', { class: 'el-radio__inner' }, ''),
        //         h('input', {
        //           class: 'el-radio__original',
        //           attrs: {
        //             name: 'pageClassification',
        //             id: 'dd'
        //           },
        //           domProps: {
        //             value: 1,
        //             type: 'radio',
        //             hidden: true
        //           },
        //           on: {
        //             input: this.checkPageType
        //           }
        //         }, '')
        //       ]
        //     ),
        //     h('span', { class: 'el-radio__label' }, '工作台页面')
        //   ]),
        //   h('label', {
        //     class: 'el-radio',
        //     attrs: {
        //       for: 'ff'
        //     }
        //   }, [
        //     h('span',
        //       {
        //         class: 'el-radio__input'
        //       }, [
        //         h('span', { class: 'el-radio__inner' }, ''),
        //         h('input', {
        //           class: 'el-radio__original',
        //           attrs: {
        //             name: 'pageClassification',
        //             id: 'ff'
        //           },
        //           domProps: {
        //             value: 2,
        //             type: 'radio',
        //             hidden: true
        //           },
        //           on: {
        //             input: this.checkPageType
        //           }
        //         }, '')
        //       ]
        //     ),
        //     h('span', { class: 'el-radio__label' }, '其他页面')
        //   ])
        // ]),
        message: h('div', {
          class: {
            'check-page-type': isAdd,
            'dn': !isAdd
          }
        }, [
          h('input', {
            attrs: {
              name: 'pageClassification',
              id: 'dd'
            },
            domProps: {
              value: 1,
              type: 'radio',
              checked: true
            },
            on: {
              input: this.checkPageType
            }
          }, ''), h('label', {
            attrs: {
              for: 'dd'
            }
          }, '工作台页面'),
          h('input', {
            attrs: {
              name: 'pageClassification',
              id: 'ff'
            },
            domProps: {
              value: 2,
              type: 'radio'
            },
            on: {
              input: this.checkPageType
            }
          }, ''), h('label', {
            attrs: {
              for: 'ff'
            }
          }, '其他页面')
        ]),
        dangerouslyUseHTMLString: true,
        inputValue: this.templateName,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入模板名称',
        inputValidator: (value) => !!value && value.trim() !== '',
        inputErrorMessage: '请输入模板名称'
      }).then(({ value }) => {
        this.fullScreenLoadding = Loading.service({ fullscreen: true })
        this.templateName = value
        this.screenshot()
      }).catch(() => {
        // console.log(err)
      })
      // if (this.pageType && (this.pageType === 1 || this.pageType === 3)) {
      //   this.screenshot()
      // } else {
      //   this.$prompt('请输入模板名称', '提示', {
      //     type: 'warning',
      //     inputValue: this.templateName,
      //     inputType: 'radio',
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     inputPlaceholder: '请输入模板名称',
      //     inputValidator: (value) => !!value && value.trim() !== '',
      //     inputErrorMessage: '请输入模板名称'
      //   }).then(({ value }) => {
      //     // this.templateName = value
      //     // this.screenshot()
      //   }).catch(() => {
      //   // console.log(err)
      //   })
      // }
    },
    checkPageType (e) {
      // console.log(e.target.value)
      // this.$set(this.data, 'pageClassification', val)
      this.pageClassification = e.target.value
      // console.log(this.pageClassification)
    },
    addTemplate (params) {
      if (params) {
        const { pageWidth, pageBgImg } = params
        this.pageWidth = pageWidth
        this.pageBgImg = pageBgImg
      }
      // const size = window.localStorage.getItem('dataTheme')
      const layoutData = [...this.layout]
      // layoutData = layoutData.map(e => {
      //   e.size = size
      //   return e
      // })

      // 页面配置参数
      let pageWidth
      if (this.pageWidth) {
        pageWidth = this.pageWidth
      }
      let pageBgImg
      if (this.pageBgImg) {
        pageBgImg = this.pageBgImg
      }
      // 1.工作台新增、编辑 2.站点新增，编辑
      // 页面类型 pageType 1：内置 2：授权（后台创建模板）3：自定义工作台
      const isCustom = this.$route.query.isCustom

      // 是否为自定义工作台
      let path, pageType
      if (isCustom) {
        // 自定义工作台编辑
        if (this.pageType === 3) {
          path = 'dragHome.pageUpdate'
        } else { // 自定义工作台新增
          path = 'dragHome.pageAdd'
          pageType = 3
        }
      } else {
        // 模板编辑
        if (this.pageType === 2) {
          path = 'dragHome.pageUpdate'
        } else { // 模板新增
          path = 'dragHome.pageAdd'
          pageType = 2
        }
      }
      let siteId
      if (this.siteId) {
        siteId = this.siteId
      }
      let pageId
      if (this.pageId) {
        pageId = this.pageId
      }
      const pageClassification = this.pageClassification
      const data = {
        pageName: this.templateName,
        pageContent: JSON.stringify(layoutData),
        pageImgUrl: this.pageImgUrl,
        pageClassification,
        siteId,
        pageId,
        pageType,
        pageWidth,
        pageBgImg
      }
      // console.log(data)
      this.$api(path, data).then((res) => {
        this.fullScreenLoadding.close()
        if (this.pageType) {
          this.$router.push('/')
        } else {
          window.location.href = process.env.VUE_APP_INDEX_LINK + '/website/page?siteId=' + this.siteId
        }
      }).catch(e => {
        this.fullScreenLoadding.close()
      })
    },
    changeStatus () {
      this.isPreview = true
      this.showSidebar = false
      const obj = {
        isDraggable: false,
        isResizable: false
      }
      this.options = { ...this.options, ...obj }
    },
    addCard () {
      this.showSidebar = true
    },
    resizedEvent (i, newH, newW, newHPx, newWPx, itemName) {
      // console.log(i, newH, newW, newHPx, newWPx, itemName)
      // console.log(this.$refs[i][0].resize)
      if (this.$refs[i][0].resize) {
        this.$refs[i][0].resize(newWPx, newHPx)
      }
    },
    // 页面管理
    pageSettingUpdate (data) {
      if (data && data.pageWidth) {
        this.pageWidth = data.pageWidth
        this.pageBgImg = data.pageBgImg
      }
      // console.log(data)
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
::v-deep .el-collapse{
  background-color: #fff;
  height: calc(100% - 46px);
  overflow-y: auto;
  border-top: 0;
  border-bottom: 0;
  padding: 16px 12px;
  .el-collapse-item{
    .el-collapse-item__header{
      position: relative;
      padding-left: 16px;
      height: 20px;
      line-height: 20px;
      margin-bottom: 8px;
      font-size: 14px;
      border-bottom: 0;
      .el-collapse-item__arrow{
        position: absolute;
        left: 0;
      }
    }
    .el-collapse-item__wrap{
      border-bottom: 0;
    }
  }
}

@import '@/ui/size/mixin.scss';
@mixin del($sc: 1, $fs: 14PX){
  .home-drag{
    height: calc(100vh - 146px);
    overflow-y: auto;
    .sidebar{
      & > *{
        box-sizing: border-box;
      }
      position: fixed;
      top: 56px;
      left: 0;
      z-index: 10;
      width: 292px;
      box-sizing: border-box;
      padding: 6px;
      height: calc(100vh - 128px);
      overflow-y: auto;
      background: #F2F2F2;
      box-shadow: 2px 2px 3px 0px rgba(0, 0, 0, 0.22);
      .title{
        margin-bottom: 6px;
        height: 34px;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        .close{
          position: absolute;
          right: 0;
          top: 6px;
          padding: 11px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 12px;
          height: 12px;
          &:hover{
            opacity: 0.68;
            cursor: pointer;
          }
          .icon{
            width: 100%;
            height: 100%;
          }
        }
      }
      .list{
        & > .item{
          float: left;
          width: 33.33333%;
          box-sizing: border-box;
          padding: 10px 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          color: rgba(25, 31, 36, 0.64);
          &:hover{
            opacity: 0.7;
          }
          .icon{
            margin-bottom: 9px;
            width: 70px;
            height: 55px;
          }
          .text{
            width: 62px;
            height: 47px;
            font-size: 14px;
            color: rgba(25, 31, 36, 0.64);
            line-height: 20px;
          }
        }
      }
    }
    .main{
      margin: 0 auto;
      font-size: $fs;
      position: relative;
      top: 0;
      right: 0;
      left: 0;
      min-height: 100%;
      .btn-box{
        position: absolute;
        top: 0;
        right: 16px;
        z-index: 13;
        padding: 20px 0;
        font-size: 14px;
        color: rgba($color: #191f24, $alpha: 0.88);
        .el-button{
          margin-left: 12px;
          font-size: 14px;
          .icon{
            margin-right: 4px;
            width: 16px;
            height: 16px;
          }
        }
      }
      .grid-block{
        box-sizing: border-box;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        bottom: -72px;
        display: flex;
        transition: opacity .2s ease;
        padding-right: 16px;
        .grid-item{
          margin-left: 12px;
          border-left: 1px dashed #A1C1E6;
          border-right: 1px dashed #A1C1E6;
          flex: 1 1;
          &:last-child{
            margin-right: 0;
          }
        }
      }
      .vue-grid-layout{
        top: 58px;
        ::v-deep .vue-grid-item{
          border-radius: 4px;
          overflow: hidden;
          .block{
            width: 100%;
            height: 100%;
            &-edit{
              &:hover{
                .btn-edit{
                  opacity: 0.83;
                  z-index: 99;
                }
              }
            }
            .btn-edit{
              position: absolute;
              top: 0;
              right: 0;
              z-index: 0;
              color: #c7d0e3;
              background: #191F24;
              height: 30px;
              display: flex;
              justify-content: center;
              align-items: center;
              opacity: 0;
              transition: all .2s ease;
              border-radius: 0 0 0 13px;
              padding: 2px 3px;
              & > span{
                padding: 10px;
                width: 14px;
                height: 14px;
                display: flex;
                justify-content: center;
                align-items: center;
                &:hover{
                  opacity: 0.68;
                  cursor: pointer;
                }
                .icon{
                  width: 100%;
                  height: 100%;
                }
              }
            }
          }
          & > .vue-resizable-handle{
            z-index: 13;
          }
          // &:hover{
          //   /* .block-edit{
          //     &::after {
          //       content: "";
          //       background-color: rgba(254,227,78,.1);
          //       position: absolute;
          //       top: 0;
          //       left: 0;
          //       z-index: 11;
          //       width: 100%;
          //       height: 100%;
          //     }
          //   } */
          // }
        }
      }
    }
    .footer-btn{
      position: fixed;
      z-index: 14;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: 40px;
      height: 72px;
      background: #FFFFFF;
      box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.08);
    }
  }
}
@import '@/ui/size/scale.scss';
.check-page-type{
  height: 30px;
  display:flex;
  align-items: center;
  input {
    position: absolute;
    opacity: 0;
  }
  label{
    cursor: pointer;
    margin-right:20px;
  }
  input + label:before {
    content: '';
    background: #f4f4f4;
    border-radius: 100%;
    border: 1px solid #b4b4b4;
    display: inline-block;
    width: 15px;
    height: 15px;
    position: relative;
    top: 0px;
    margin-right: 5px;
    vertical-align: top;
    cursor: pointer;
    text-align: center;
    -webkit-transition: all 250ms ease;
    transition: all 250ms ease;
  }
  input:checked + label:before {
    background-color: #3197EE;
    box-shadow: inset 0 0 0 4px #f4f4f4;
  }
  input:focus + label:before {
    outline: none;
    border-color: #3197EE;
  }
  input:disabled + label:before {
    box-shadow: inset 0 0 0 4px #f4f4f4;
    border-color: #b4b4b4;
    background: #b4b4b4;
  }
  input + label:empty:before {
    margin-right: 0;
  }
}
</style>
