<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import 'lib-flexible';

export default {
  name: 'app',
};
</script>
<style>
*{
  box-sizing: border-box;
}
body{
  /* min-height: 100vh; */
  /* width: 100vw; */
  font-family:PingFangSC-Medium,PingFang SC;
  background-color: #F0F2F4;
}
</style>
