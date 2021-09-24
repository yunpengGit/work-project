<template>
  <svg class="icon" aria-hidden="true" :class="className">
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

<style scoped>

</style>
