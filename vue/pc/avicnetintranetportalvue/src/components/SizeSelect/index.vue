<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-04-29 14:22:04
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-06-07 17:32:29
-->
<template>
  <el-dropdown trigger="click" class="size-select" @command="handleSetSize">
    <div>
      <span>调整字号</span>
      <icon-svg name="xiala-shaixuan" class="dropdown-icon" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item of sizeOptions" :key="item.value" :command="item.value" :class="{'active': item.value===currentSize}">
        {{ item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import iconSvg from '@/components/icon-svg'
export default {
  components: {
    iconSvg
  },
  data () {
    return {
      currentSize: window.localStorage.getItem('dataTheme'),
      sizeOptions: [
        // { label: '大号', value: 'medium' },
        { label: '大号字号', value: 'small' },
        { label: '标准字号', value: 'mini' }
      ]
    }
  },
  methods: {
    handleSetSize (size) {
      this.currentSize = size
      this.$ELEMENT.size = size
      document.querySelector('body').className = 'data-theme--' + size
      window.localStorage.setItem('dataTheme', size)
      this.refreshView()
      // this.$message({
      //   message: '选择 Size 成功',
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
@import '@/ui/size/mixin.scss';
@mixin del($sc: 1, $fs: 14PX){
  .size-select{
    display: flex;
    align-items: center;
    span{
      margin-right: 4px;
      font-size: $fs;
      vertical-align: middle;
    }
  }
  .el-dropdown-menu{
    .el-dropdown-menu__item{
      &.active{
        background-color: #edf5fe;
        color: #6db0f9;
      }
    }
  }
}
@import '@/ui/size/scale.scss'
</style>
