<!--
 * @Author: pengpeng
 * @Date: 2020-10-13 14:22:49
 * @LastEditors: pengpeng
 * @LastEditTime: 2020-10-14 10:12:46
 * @Description: file content
-->
<template>
  <svg aria-hidden="true" :class="className">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    href: {
      type: String,
      required: true
    },
    className: {
      type: String
    }
  },
  computed: {
    iconName () {
      return `#${this.href}`
    }
  }
}
</script>
