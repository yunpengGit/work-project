<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-26 20:49:21
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-06-27 16:24:59
-->
<template>
  <section class="data-null-container">
    <img src="@/assets/images/dataNull.png" alt="">
    <p>{{ text }}</p>
  </section>
</template>

<script>
export default {
  props: ['text']
}
</script>

<style lang="scss" scoped>
@import '../assets/css/core.scss';
.data-null-container {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 0;
  > img {
    width: 176px;
    height: 103px;
  }
  @include list(column,center,center);
  p {
    font-size: 16px;
    color: rgba(25, 31, 36, 0.48);
    padding: 20px 0;
  }
}
</style>
