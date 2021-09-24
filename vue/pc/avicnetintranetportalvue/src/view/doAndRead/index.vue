<!--
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-16 14:32:36
 * @LastEditors: zongmz
 * @LastEditTime: 2021-04-14 15:58:26
-->
<template>
  <div class="index">
    <List ref="list" :is-to-do="isToDo" />
  </div>
</template>

<script>
import List from './List'
export default {
  name: 'Index',
  components: { List },
  props: {},
  data () {
    return {
      isToDo: false
    }
  },
  created () {
    const { type } = this.$route.meta
    this.isToDo = type === 1
  }
}
</script>
