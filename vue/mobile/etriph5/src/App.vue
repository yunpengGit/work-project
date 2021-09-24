<template>
  <div id="app">
    <loading/>
    <router-view />
  </div>
</template>

<script>
import 'lib-flexible'
import Loading from '@/components/Loading'
export default {
  name: 'app',
  components: { Loading }
}
</script>

<style lang="less">
</style>
