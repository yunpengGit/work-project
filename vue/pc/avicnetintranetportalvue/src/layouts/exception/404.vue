<!--
 * @Description:
 * @Author: peng
 * @Date: 2021-03-01 11:00:59
 * @LastEditors: peng
 * @LastEditTime: 2021-07-29 17:01:26
-->
<template>
  <exception-page type="404" />
</template>

<script>
import { ExceptionPage } from '@/components'
export default {
  components: {
    ExceptionPage
  },
  mounted () {
    let timer = setTimeout(() => {
      this.$router.push({ path: '/' })
    }, 5000)
    this.$once('hook:beforeDestroy', () => {
      clearInterval(timer)
      timer = null
    })
  }
}
</script>
