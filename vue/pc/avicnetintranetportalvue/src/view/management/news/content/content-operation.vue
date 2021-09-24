<!--
 * @Descripttion:栏目操作
 * @Author: zongmz
 * @Date: 2021-03-23 10:05:51
 * @LastEditors: zongmz
 * @LastEditTime: 2021-06-28 16:59:14
-->
<template>
  <div class="main-container bgwh">
    <content-dialog v-if="JSON.stringify(contentData) !=='{}'" :router-type="$route.meta.routerType" :content-data="contentData" :secret-level="secretLevel" /></div>
</template>
<script>
import contentDialog from '../components/content-dialog'
export default {
  components: {
    contentDialog
  },
  data () {
    return {
      contentData: null,
      secretLevel: []
    }
  },
  created () {
    if (this.$route.meta.routerType !== 'add') {
      this.$api('news.contentsQueryIds', { id: this.$route.query.id }).then(res => {
        this.contentData = res.data
      })
    }
    this.$api('common.getMj').then(res => {
      this.secretLevel = res.data
    })
  }
}
</script>
<style lang="scss" scoped>
.main-container {
  padding: 30px;
}
</style>
