<!--
 * @Descripttion: 轮播图组件
 * @Author: zongmz
 * @Date: 2021-06-06 15:51:09
 * @LastEditors: zongmz
 * @LastEditTime: 2021-06-06 18:33:07
-->
<template>
  <div class="avicnet-carousel">
    <!-- <img :src="nav" alt=""> -->
    <el-carousel :interval="5000" arrow="always">
      <el-carousel-item v-for="item in imageList" :key="item.id">
        <img :src="item.pic" alt="" width="100%">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
import nav from '@/assets/demo/nav.png'
import AG660banner2 from '@/assets/demo/AG660banner2.jpg'
import bannerAC313 from '@/assets/demo/banner-AC313.jpg'
import bannerZhi10 from '@/assets/demo/banner-zhi10.jpg'
import banner011 from '@/assets/demo/banner011.jpg'
import banner033 from '@/assets/demo/banner033.jpg'

export default {
  data () {
    return {
      nav,
      imageList: [
        {
          id: 1,
          url: '',
          pic: AG660banner2
        },
        {
          id: 2,
          url: '',
          pic: bannerAC313
        },
        {
          id: 3,
          url: '',
          pic: bannerZhi10
        },
        {
          id: 4,
          url: '',
          pic: banner011
        },
        {
          id: 5,
          url: '',
          pic: banner033
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.avicnet-carousel{
    ::v-deep .el-carousel__container{
        height: 364px;
        img{
            width: 100%;
            height: 100%;
        }
    }
}
</style>
