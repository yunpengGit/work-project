<!-- svg格式的图标渲染 -->
<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="'#'+name" />
  </svg>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    }
  }
  // data () {
  //   return {
  //     showHover: false
  //   }
  // },
  // computed: {
  //   isHover () {
  //     return this.name.indexOf('_') !== -1
  //   },
  //   disableBtn () {
  //     return this.name.indexOf('jinyong') !== -1
  //   }
  // },
  // watch: {
  //   name () {
  //     this.showHover = false
  //   }
  // },
  // methods: {
  //   mouseoverFn () {
  //     if (this.isHover) {
  //       this.showHover = true
  //     }
  //   },
  //   mouseoutFn () {
  //     if (this.isHover) {
  //       this.showHover = false
  //     }
  //   }
  // }
}
</script>
