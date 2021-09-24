<template>
  <a-breadcrumb class="breadcrumb">
    <a-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
      {{item}}
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script>
import cloneDeep from 'lodash.clonedeep'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('supplier')
export default {
  name: 'Breadcrumb',
  props: {
    baseBreadcrumbData: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapState(['company']),
    breadcrumbList() {
      // ! 必须拷贝使用
      const arr = cloneDeep(this.baseBreadcrumbData)
      // ! splice 使用替换时必须添加第二个参数
      arr.splice(1, 0, this.company.shortName)
      return arr
    }
  }
}
</script>

<style scoped lang="less">
.breadcrumb{
  margin-bottom: 16px;
  height: 30px;
  border-bottom: 1px #e3e3e3 solid;
  color: rgba(0, 0, 0, 0.85);
  span:last-child{
    color: rgba(0, 0, 0, 0.85);
  }
}
</style>
