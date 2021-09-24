<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-26 21:29:20
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-06-26 21:39:19
-->
<template>
  <li :class="['pub-upper', customStyle]">
    <div class="pub-upper-item-left">
      <img :src="src" alt="" v-if="src">
      <span>{{ text }}</span>
    </div>
    <div class="pub-upper-item-center">
      <slot />
    </div>
    <img src="@/images/pubItemDefault.png" alt="" class="pub-upper-item-right">
  </li>
</template>

<script>
export default {
  props: ['customStyle', 'src', 'text']
}
</script>

<style lang="scss" scoped>
@import '../assets/css/core.scss';
.pub-upper {
  width: 100%;
  height: 45px;
  background-color: #fff;
  @include list(row, space-between, center);
  .pub-upper-item-left {
    font-size: 14px;
    color: #222;
  }
  .pub-upper-item-center {
    flex: 1;
  }
  .pub-upper-item-right {
    width: 7.5px;
    height: 12px;
  }
}
</style>
