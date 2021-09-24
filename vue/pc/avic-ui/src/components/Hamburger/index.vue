<template>
  <div @click="toggleClick">
    <svg-icon :class="{'is-active':isActive}" class="hamburger" iconClass="sq"></svg-icon>
  </div>
</template>

<script>
import svgIcon from '../SvgIcon'
export default {
  components: {
    svgIcon
  },
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick () {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  margin-left: 20px;
  vertical-align: middle;
  width: 14px;
  height: 14px;
  color: rgba(255, 255, 255, 0.64);
}

.hamburger.is-active {
  transform: rotate(180deg);
}
</style>
