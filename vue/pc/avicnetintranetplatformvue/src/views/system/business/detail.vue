<template>
  <el-drawer
    :visible="detailDrawer"
    title="企业详情"
    :size="616"
    custom-class="detail-drawer"
    destroy-on-close
    @update:visible="visibaleChange"
    @close="closed"
  >
    <div class="main-content">
      <div v-for="(item, i) in arr" :key="i" class="row">
        <span class="row-label">{{ item.label }}</span>
        <span v-if="item.value === 'enterpriseType'" class="row-text">{{ deptType }}</span>
        <span v-else class="row-text">{{ info[item.value] }}</span>
      </div>
    </div>
  </el-drawer>
</template>

<script>
const arr = [
  {
    label: '单位中文全称',
    value: 'deptName'
  },
  {
    label: '单位中文简称',
    value: 'shortName'
  },
  {
    label: '上级管理单位',
    value: 'parentName'
  },
  {
    label: '企业类型',
    value: 'enterpriseType'
  },
  {
    label: '集团单位代码',
    value: 'enterpriseNo'
  },
  {
    label: '军工行业代号',
    value: 'militaryIndustryCode'
  },
  {
    label: '统一社会信用代码',
    value: 'socialCreditCode'
  },
  {
    label: '排序号',
    value: 'orderNum'
  },
  {
    label: '单位联系电话',
    value: 'phone'
  },
  {
    label: '邮政编码',
    value: 'postcode'
  },
  {
    label: '单位地址',
    value: 'address'
  },
  {
    label: '备注',
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
  computed: {
    deptType () {
      let deptText
      switch (this.info.enterpriseType) {
        case 10:
          deptText = '直属企业'
          break
        case 20:
          deptText = '直属业务单位'
          break
        case 30:
          deptText = '集团总部'
          break
        case 40:
          deptText = '直管功能单位'
          break
        case 50:
          deptText = '成员单位'
          break
        case 60:
          deptText = '所属控股单位'
          break
        case 70:
          deptText = '所属参股单位'
          break
      }
      return deptText
    }
  },
  watch: {
    currentId: {
      handler (val) {
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
    getDetail (id) {
      this.$api('business.orgDetail', { id }).then(res => {
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
