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
<style lang="less">
svg{
  width: 100%;
  height: 100%;
}
</style>
