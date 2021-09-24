<!--
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-04-23 11:07:16
 * @LastEditors: zongmz
 * @LastEditTime: 2021-08-24 15:40:39
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import filterRoute from './layouts/filterRoute'
import store from '@/store'
export default {
  name: 'App',
  watch: {
    '$route' () {
      const pathName = window.location.pathname
      // if (pathName === '/home' || pathName === '/dragHome' || pathName === '/index') {
      if (filterRoute.some(e => pathName.indexOf(e) > -1)) {
        document.querySelector('html').className = 'index-data-page'
      } else {
        document.querySelector('html').className = ''
        document.getElementById('app').style.backgroundImage = ``
      }
    }
  },
  mounted () {
    setTimeout(() => {
      store.dispatch('getSecretLevelFn')
    }, 500)
  }
}
</script>
