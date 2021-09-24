<!--表单对接携程、航信-->
<template>
  <form v-show="show" :action="action" :method="method">
    <input v-for="(value, key) in form" :key="key" type="text" :name="key" :value="value"/>
    <input type="submit" ref="submit" value="submit"/>
  </form>
</template>
<script>
export default {
  props: {
    action: {
      type: String
    },
    method: {
      type: String,
      default: 'post'
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {}
    }
  },
  methods: {
    submit (data) {
      this.form = data
      this.$nextTick(() => {
        this.$refs.submit.click()
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
