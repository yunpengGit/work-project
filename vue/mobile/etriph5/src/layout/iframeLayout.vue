<template>
  <div class="iframe-content" flex="dir:column">
    <van-nav-bar
      flex-item="0"
      v-if="showHead"
      left-arrow
      :title="params.title"
      @click-left="back"
      @click-right="backHome"
      :right-text="params.showHome ? '首页' : ''"
    />
    <img flex-item="0" v-if="isImg" :src="params.src" />
    <iframe v-else scrolling="no" style="width: 1px !important; min-width: 100%;" flex-item="1" :src="params.src" frameborder="0"></iframe>
  </div>
</template>

<script>
import { NavBar } from 'vant'
import Vue from 'vue'
Vue.use(NavBar)
export default {
  data () {
    return {
      showHead: process.env.VUE_APP_SHOW_HEDE === 'true',
      params: {},
      isImg: false
    }
  },
  mounted () {
    this.$store.dispatch('removeLoading')
    if (this.$route.params.src) {
      this.getExtension()
    }
    this.params = this.$route.params
  },
  methods: {
    getExtension () { // 获取文件后缀
      const src = this.$route.params.src
      const imgExt = ['.png', '.jpg', '.jpeg', '.bmp', '.gif']
      let ext = ''
      let name = src.toLowerCase()
      let i = name.lastIndexOf('.')
      if (i > -1) {
        ext = name.substring(i)
      }
      if (imgExt.indexOf(ext) > -1) {
        this.isImg = true
      }
    },
    back () {
      this.$router.back()
    },
    backHome () {
      this.$router.replace('/')
    }
  }
}
</script>

<style lang="less" scoped>
.iframe-content {
  height: 100vh;
  width: 100vw;
}
img {
  width: 100%;
}
</style>
