<!--
 * @Descripttion:栏目操作
 * @Author: zongmz
 * @Date: 2021-03-23 10:05:51
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-03-26 16:42:49
-->
<template>
  <div class="main-container bgwh">
    <column-dialog :router-type="$route.meta.routerType" :column-data="columnData" />
  </div>
</template>
<script>
import columnDialog from '../components/column-dialog'
export default {
  components: {
    columnDialog
  },
  data () {
    return {
      columnData: null
    }
  },
  created () {
    if (this.$route.meta.routerType !== 'add') {
      this.$api('news.catalogsQueryId', { id: this.$route.query.id }).then(res => {
        this.columnData = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.main-container {
  padding: 30px;
}
</style>
