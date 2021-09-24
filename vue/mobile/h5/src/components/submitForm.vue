<!--
 * @Author: your name
 * @Date: 2020-10-19 13:05:56
 * @LastEditTime: 2020-10-22 13:51:15
 * @LastEditors: pengpeng
 * @Description: 使用form表单提交方式跳转返回地址页面
 * @FilePath: \h5\src\components\submitForm.vue
-->
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
  mounted () {
    this.$store.dispatch('removeLoading')
  },
  methods: {
    submit (data) {
      this.form = data.param
      // console.log(data)
      this.$nextTick(() => {
        this.$refs.submit.click()
      })
    }
  }
}
</script>
