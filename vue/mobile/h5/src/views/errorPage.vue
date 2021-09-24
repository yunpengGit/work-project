<!--
 * @Author: your name
 * @Date: 2020-10-20 16:31:29
 * @LastEditTime: 2020-10-23 14:36:44
 * @LastEditors: pengpeng
 * @Description: 错误页面
 * @FilePath: \h5\src\views\errorPage.vue
-->
<template>
  <div class="error-page">
    <img src="../assets/error_page.jpg" alt />
    <p class="title">{{msg}}</p>
  </div>
</template>

<script>
export default {
  name: 'errorPage',
  data () {
    return {
      msg: ''
    }
  },
  created () {
    // this.$changePageTitle('页面出错啦!!!')
  },
  mounted () {
    this.msg = this.$route.params.msg
  }
}
</script>

<style lang="less" scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}
.title {
  color: #99a5b2;
  font-size: 8px;
  margin: 0;
}
img {
  width: 130px;
}
</style>
