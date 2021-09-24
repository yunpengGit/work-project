<template>
  <el-drawer
    :visible="detailDrawer"
    title="部门详情"
    :size="616"
    custom-class="detail-drawer"
    destroy-on-close
    @update:visible="visibaleChange"
    @close="closed"
  >
    <div class="main-content">
      <div v-for="(item, i) in arr" :key="i" class="row">
        <span class="row-label">{{ item.label }}</span>
        <span class="row-text">{{ info[item.value] }}</span>
      </div>
    </div>
  </el-drawer>
</template>

<script>
const arr = [
  {
    label: '部门名称',
    value: 'deptName'
  },
  {
    label: '上级机构',
    value: 'parentName'
  },
  {
    label: '排序号',
    value: 'orderNum'
  },
  {
    label: '办公地址',
    value: 'address'
  },
  {
    label: '联系电话',
    value: 'phone'
  },
  {
    label: '备注信息',
    value: 'remark'
  }
]
export default {
  props: {
    detailDrawer: {
      type: Boolean,
      default: false
    },
    currentId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      info: {
        deptName: ''
      },
      arr: arr
    }
  },
  watch: {
    currentId: {
      handler (val) {
        console.log(val)
        if (val !== '') {
          this.getDetail(val)
        }
      },
      immediate: true
    }
  },
  methods: {
    visibaleChange () {
      this.$emit('update:detail-drawer', false)
    },
    // 获取详情
    getDetail (deptId) {
      this.$api('depts.deptDetail', { deptId }).then(res => {
        if (res.code === 200) {
          this.info = res.data
        }
      })
    },
    closed () {
      this.$emit('closeDetail')
    }
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  padding: 16px;
  max-height: 100%;
  overflow-y: auto;
  .row {
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    .row-label {
      width: 35%;
      flex-shrink: 0;
      font-size: 16px;
      font-weight: 500;
      color: #8c8c8c;
    }
    .row-text {
      font-size: 16px;
      font-weight: 400;
      color: #242424;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
}
</style>
