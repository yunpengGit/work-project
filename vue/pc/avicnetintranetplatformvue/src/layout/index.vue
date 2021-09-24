<!--
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-31 09:05:31
 * @LastEditors: aq.hu
 * @LastEditTime: 2021-05-07 10:16:24
-->
<template>
  <div class="warper">
    <navbar />
    <sidebar />
    <div class="layout-container page-frame-content" :class="classObj">
      <tags-view v-if="needTagsView" :opend="sidebar.opened" />
      <app-main />
    </div>
  </div>
</template>

<script>
import { AppMain, Navbar, Sidebar, TagsView } from './components'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar,
    TagsView
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      needTagsView: state => state.settings.tagsView
    }),
    classObj () {
      return {
        'slide-gl': !this.sidebar.opened
      }
    }
  }

}
</script>
