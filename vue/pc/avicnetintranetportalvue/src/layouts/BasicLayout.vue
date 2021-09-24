<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-03-04 10:49:20
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-06-29 09:35:02
-->
<template>
  <!-- <div class="page-frame" :class="($route.path ==='/home' || $route.path === '/dragHome' || $route.path === '/index' || showSilder) ? 'no-silder' :''"> -->
  <div class="page-frame" :class="(filterRoute.find(e => $route.path.indexOf(e)>-1) || showSilder) ? 'no-silder' :''">
    <!-- <sidebar v-if="!showSilder && $route.path !=='/home' && $route.path !== '/dragHome' && $route.path !== '/index'" /> -->
    <sidebar v-if="!showSilder && !filterRoute.some(e => $route.path.indexOf(e)>-1)" />
    <layout-header />
    <!-- <tags-view v-show="needTagsView && $route.path !=='/home' && $route.path !== '/dragHome' && $route.path !== '/index'" />
    <page-header v-if="$route.path !=='/home' && $route.path !== '/dragHome' && $route.path !== '/index'" /> -->
    <tags-view v-show="needTagsView && !filterRoute.some(e => $route.path.indexOf(e)>-1)" />
    <page-header v-if="!filterRoute.some(e => $route.path.indexOf(e)>-1)" />
    <el-scrollbar class="page-frame-content" :class="objClass">
      <app-main />
      <Copyright v-if="filterRoute.some(e => this.$route.path.indexOf(e) > -1)" />
    </el-scrollbar>
  </div>
</template>
<script>
import layoutHeader from './layout-header'
import sidebar from './Sidebar'
import appMain from './AppMain'
import pageHeader from './pageHeader'
import TagsView from './TagsView/index.vue'
import Copyright from '@/components/copyright'
import { mapState } from 'vuex'
import filterRoute from './filterRoute'
export default {
  components: {
    layoutHeader,
    sidebar,
    appMain,
    pageHeader,
    TagsView,
    Copyright
  },
  data () {
    return {
      filterRoute,
      bg: require('./../assets/bg.png'),
      noSilderList: ['online']
    }
  },
  computed: {
    routeConfig () {
      return this.$route.meta
    },
    ...mapState({
      needTagsView: state => state.settings.tagsView
    }),
    showSilder () {
      // console.log(this.$router, 3233)
      return this.noSilderList.indexOf(this.$route.name) > -1
    },
    objClass () {
      return {
        // 'index-page': this.$route.path === '/home' || this.$route.path === '/dragHome' || this.$route.path === '/index',
        'index-page': filterRoute.some(e => this.$route.path.indexOf(e) > -1),
        'no-tags-view': this.showSilder
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .bg{
    position: absolute;
    top: 0;
    left: 0;
    width: 1920px;
    height: 669px;
  }
  ::v-deep .layout-container{
    .el-scrollbar__wrap{
      /* overflow-x: hidden; */
      .el-scrollbar__view{
        position: relative;
      }
    }
    /* .is-horizontal{
    display: none;
    } */
  }
</style>
