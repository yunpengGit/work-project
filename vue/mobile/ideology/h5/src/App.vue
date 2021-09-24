<!--
 * @Description: 
 * @Author: peng
 * @Date: 2021-08-10 15:15:51
 * @LastEditors: peng
 * @LastEditTime: 2021-08-24 10:41:49
-->
<template>
  <div id="app">
    <Home />
  </div>
</template>
<script>
import Home from "./views/Home.vue";

export default {
  components: {
    Home,
  },
};
</script>

<style lang="less">
body {
  font-family: PingFangSC-Medium, PingFang SC;
}
</style>
