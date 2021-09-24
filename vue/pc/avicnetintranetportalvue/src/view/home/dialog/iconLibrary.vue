<!--
 * @Author: your name
 * @Date: 2021-06-06 18:18:56
 * @LastEditTime: 2021-06-07 19:54:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \avicnetintranetportalvue\src\view\home\dialog\iconLibrary.vue
-->
<!--
 * @Author: your name
 * @Date: 2021-06-06 18:17:11
 * @LastEditTime: 2021-06-06 19:38:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \avicnetintranetportalvue\src\view\home\dialog\cuscustom.vue
-->
<template>
  <el-dialog title="图标库" :visible="iconDialogVisible" @update:visible="visibaleChange" @open.once="init()">
    <div class="list">
      <div
        v-for="(item,index) in iconList"
        :key="index"
        :class="['item', selected === index ? 'selected' : '']"
        @click="selected = index"
      >
        <img :src="item.icon">
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visibaleChange">取消</el-button>
      <el-button type="primary" @click="onSure">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ExportPlan',
  components: { },
  props: {
    iconDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selected: '',
      iconList: []
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    visibaleChange () {
      this.$emit('update:icon-dialog-visible', false)
    },
    async init () {
      const { data } = await this.$api('setApplication.iconList')
      this.iconList = data
    },
    onSure () {
      this.visibaleChange()
      this.$emit('iconSure', this.selected === '' ? '' : this.iconList[this.selected])
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  .el-dialog__body {
    padding: 0;
    padding-left: 8px;
  }
  .el-dialog__footer {
    padding: 12px 22px;
    border-top: 1px solid rgba(25, 31, 36, 0.08);
  }
}
.list {
    height: 400px;
    overflow: scroll;
    display: flex;
    flex-wrap: wrap;
    & > * {
        box-sizing: border-box;
    }
    .item {
        width: 68px;
        height: 68px;
        background: #FFFFFF;
        border-radius: 8px;
        border: 1px solid rgba(25, 31, 36, 0.16);
        padding: 14px;
        cursor: pointer;
        margin: 12px;
        &.selected {
          border-color: rgba(30, 137, 255, 1);
        }
        img {
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }
    }
}
</style>
