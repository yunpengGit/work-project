<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-05-30 18:12:46
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-06-30 16:09:19
-->
<template>
  <div class="content-box">
    <div class="group">
      <div class="label"><span class="title">页面宽度设置</span></div>
      <el-radio-group v-model="pageData.pageWidth" @change="radioChange">
        <el-radio label="default">默认</el-radio>
        <el-radio label="auto">100%</el-radio>
        <!-- <el-radio label="custom">
          自定义
          <span class="input-box" :class="{'vh':pageData.pageWidth!=='custom'}">
            <el-input v-model="mainW" type="text" placeholder="" @click="blur" /> px
          </span>
        </el-radio> -->
      </el-radio-group>
      <div class="label"><span class="title">更换背景图</span></div>
      <div class="pages">
        <div v-for="item in pages" :key="item.id" class="item" @click="selectedPageImg(item)">
          <span class="selected" :class="{'active': currentPageImgId === item.id}"><icon-svg name="xuanzhong" /></span>
          <img :src="item.icon" alt="" class="img-icon">
        </div>
      </div>
      <!-- <div class="label"><span class="title">更换主色调</span></div>
      <div class="themes">
        <div v-for="item in themes" :key="item.id" class="item" @click="selectedTheme(item)">
          <span class="selected"  :class="{'active': currentThemeId === item.id}"><icon-svg name="shangchuanchenggong" /></span>
          <img :src="item.img" alt="">
        </div>
      </div> -->
      <div class="btn-box">
        <el-button @click="resetForm">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </div>
    </div>

  </div>
</template>
<script>
import iconSvg from '@/components/icon-svg'
export default {
  components: {
    iconSvg
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      pageData: {
        pageWidth: 'default'
      },
      pageWidth: '',
      pageBgImg: '',
      mainW: '',
      currentPageImgId: '',
      currentThemeId: '',
      pages: [
        {
          id: 'bg3',
          icon: require('@/assets/home/backgroundImage/bg3_icon.png'),
          // imgUrl: '',
          imgName: 'bg3',
          componentName: '',
          fixed: false
        },
        {
          id: 'bg2',
          icon: require('@/assets/home/backgroundImage/bg2_icon.png'),
          // imgUrl: '',
          imgName: 'bg2',
          componentName: '',
          fixed: false
        },
        {
          id: 'bg1',
          icon: require('@/assets/home/backgroundImage/bg1_icon.png'),
          // imgUrl: '',
          imgName: 'bg1',
          componentName: '',
          fixed: false
        }
      ],
      themes: [
        {
          id: +new Date() + '',
          name: '',
          componentName: '',
          fixed: false
        }
      ]
    }
  },
  watch: {
    config () {
      if (this.config && JSON.stringify(this.config) !== '{}') {
        let pageWidth = 'default'
        if (this.config.pageWidth === '100%') {
          pageWidth = 'auto'
        }
        this.pageData.pageWidth = pageWidth
        this.currentPageImgId = this.config.currentPageImgId
      }
    }
  },
  methods: {
    selectedPageImg (item) {
      this.currentPageImgId = item.id
      this.pageBgImg = item.imgName
      const data = {
        pageWidth: this.pageWidth,
        pageBgImg: this.pageBgImg
      }
      this.$emit('pageSettingUpdate', data)
    },
    selectedTheme (item) {
      this.currentThemeId = item.id
    },
    blur () {
      if (!Number.isInteger(this.mainW)) {
        this.$message.error('请输入不小于1560的数字值')
      } else {
        if (this.mainW < 1560) {
          this.$message.error('请输入不小于1560的数字值')
        }
      }
    },
    radioChange (val) {
      let width
      if (val === 'auto') {
        width = '100%'
      } else {
        width = '1592px'
      }
      this.pageWidth = width
      const data = {
        pageWidth: this.pageWidth,
        pageBgImg: this.pageBgImg
      }
      this.$emit('pageSettingUpdate', data)
    },
    submitForm () {
      const data = {
        pageWidth: this.pageWidth,
        pageBgImg: this.pageBgImg
      }
      this.$emit('addTemplate', data)
      // this.$emit('pageSettingUpdate', [
      //   {
      //     id: +new Date() + '',
      //     componentName: 'Upcoming',
      //     name: '聚合组件'
      //   }
      // ])
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     alert('submit!')
      //   } else {
      //     // console.log('error submit!!')
      //     return false
      //   }
      // })
    },
    resetForm () {
      this.$emit('exitEdit')
    }
  }
}
</script>
<style lang="scss">
.input-box{
  width: 58px;
  height: 26px;
  line-height: 26px;
  .el-input--mini{
    width: inherit;
    height: inherit;
    line-height: inherit;
    .el-input__inner{
      padding-right: 8px;
      width: inherit;
      height: inherit;
      line-height: inherit;
    }
  }
}
</style>
<style lang="scss" scoped>
@import './setting.scss';
@mixin active{
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba($color: #000000, $alpha: 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  .icon{
    width: 16px;
    height: 16px;
    color: #fff;
  }
}
.label{
  display: flex;
  justify-content: space-between;
  .el-button {
    .icon{
      margin-right: 6px;
      width: 14px;
      height: 14px;
      vertical-align: top;
    }
  }
}
.pages{
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  .item{
    position: relative;
    width: 70px;
    height: 70px;
    .img-icon{
      width: 100%;
      height: 100%;
    }
    .selected{
      display: none;
    }
    .active{
      @include active();
    }
  }
}
.themes{
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  .item{
    position: relative;
    width: 106.5px;
    height: 66px;
    .selected{
      display: none;
    }
    .active{
      @include active();
    }
  }
}
.btn-box{
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 10px;
  text-align: right;
}
.el-radio-group{
  padding: 0 20px;
}
</style>
