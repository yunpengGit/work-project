<template>
  <div class="error-page" flex="main:center cross:center dir:column">
    <img src="../image/error_page.jpg" alt />
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
  mounted () {
    this.msg = this.$route.params.msg
  }
}
</script>

<style lang="less" scoped>
.error-page {
  height: 100vh;
  width: 100vw;
}
.title {
  color: #99a5b2;
  font-size: 16px;
  margin: 0;
}
img {
  width: 260px;
}
</style>
