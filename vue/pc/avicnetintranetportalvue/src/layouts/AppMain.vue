<!--
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-04-15 14:54:58
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-06-29 09:33:18
-->
<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews () {
      return this.$store.state.tagsView.cachedViews
    },
    key () {
      return this.$route.path
    },
    routeMeta () {
      return this.$route.meta
    }
  }
}
</script>
<style lang="scss">
  .app-main{
    position: relative;
    padding: 0 20px;
    height: calc(100% - 86px);
  }
</style>
