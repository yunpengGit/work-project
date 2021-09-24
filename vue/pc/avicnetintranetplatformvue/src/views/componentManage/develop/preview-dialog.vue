<!--
 * @Author: caofeng
 * @LastEditors: caofeng
 * @Date: 2021-07-22 19:07:34
 * @LastEditTime: 2021-08-12 16:04:38
 * @FilePath: \conferenceH5e:\项目\内网\avicnetintranetplatformvue\src\views\componentManage\develop\preview-dialog.vue
-->
<template>
  <el-dialog
    title="组件预览"
    :visible="dialogVisible"
    width="1082px"
    @update:visible="closeDialog"
  >
    <component :is="info.component" v-if="dialogVisible" :block-config="info" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {

    }
  },
  watch: {
    info: {
      deep: true,
      handler (n) {
        if (n.componentName) {
          n.component = require(`@/views/customize/components/${n.componentName}.vue`).default
          n.blockH = 476
        }
        // console.log(n)
      }
    }
  },
  methods: {
    closeDialog () {
      this.$emit('update:dialogVisible', false)
    },
    onSubmit () {
      this.closeDialog()
      this.$emit('onSubmit')
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog{
  .el-dialog__header{
    font-size: 16px;
    font-weight: 500;
    color: #191F24;
    padding: 18px 24px;
  }
  .el-dialog__body{
    box-sizing: border-box;
    padding: 24px;
    height: 524px;
    background-color: #ebebeb;
  }
  .el-dialog__footer{
    padding: 12px 24px;
  }
}
</style>
