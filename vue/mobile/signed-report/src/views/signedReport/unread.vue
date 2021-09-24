<template>
    <List :config="config" ref='child'></List>
</template>

<script>
import List from './List'
export default {
  data () {
    return {
      config: {
        initFn: 'getUnread'
      }
    }
  },
  methods: {
    search (val) {
      this.$refs.child.onload(val)
    },
    cancel () {
      this.$refs.child.onloadInit()
    }
  },
  components: {
    List
  }
}
</script>

<style scoped lang="less">
</style>
