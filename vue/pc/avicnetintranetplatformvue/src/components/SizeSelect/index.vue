<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div>
      <svg-icon class-name="size-icon" icon-class="size" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item of sizeOptions" :key="item.value" :command="item.value">
        {{
          item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  data () {
    return {
      sizeOptions: [
        { label: 'Default', value: 'default' },
        { label: 'Medium', value: 'medium' },
        { label: 'Small', value: 'small' },
        { label: 'Mini', value: 'mini' }
      ]
    }
  },
  computed: {
    size () {
      return window.localStorage.getItem('dataTheme') || 'mini'
    }
  },
  methods: {
    handleSetSize (size) {
      this.$ELEMENT.size = size
      document.querySelector('body').className = 'data-theme--' + size
      window.localStorage.setItem('dataTheme', size)
      this.refreshView()
      // this.$message({
      //   message: 'Ñ¡Ôñ Size ³É¹¦',
      //   type: 'success'
      // })
    },
    refreshView () {
      const { fullPath } = this.$route
      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect' + fullPath
        })
      })
    }
  }
}
</script>
<style lang="scss">
  .size-select{
    display: flex;
    align-items: center;
    span{
      margin-right: 4px;
    }
  }
</style>
