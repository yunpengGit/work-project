<template>
  <el-switch v-model="values" :disabled="disabled" @change="change" />
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => { }
    },
    warningText: {
      type: String
    },
    callback: {
      type: Function
    }
  },
  data () {
    return {
      values: !Number(this.data.status)
    }
  },
  methods: {
    change () {
      let text = this.data.status !== "0" ? "启用" : "停用";
      this.$confirm(this.warningText, "警告",{
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.callback().then(() => {
          this.msgSuccess(text + "成功");
        })
        this.$store.commit('UPDATE_ALL_TABLE_DATA');
      }).catch(() => {
        this.values = !this.values;
      });
    }
  }
}
</script>