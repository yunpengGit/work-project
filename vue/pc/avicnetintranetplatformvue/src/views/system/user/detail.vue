<template>
  <el-drawer
    :visible="detailDrawer"
    title="用户详情"
    :size="616"
    custom-class="detail-drawer"
    destroy-on-close
    @update:visible="visibaleChange"
    @close="closed"
  >
    <div class="main-content">
      <div v-for="(item, i) in arr" :key="i" class="row">
        <span class="row-label">{{ item.label }}</span>
        <span v-if="item.value === 'type'" class="row-text">{{ userType }}</span>
        <span v-if="item.value === 'post'" class="row-text">{{ userPost }}</span>
        <span v-if="item.value === 'sex'" class="row-text"> {{ userSex }}</span>
        <span v-else class="row-text">{{ info[item.value] }}</span>
      </div>
    </div>
  </el-drawer>
</template>

<script>
const arr = [
  {
    label: '登录名',
    value: 'userName'
  },
  {
    label: '姓名',
    value: 'nickName'
  },
  {
    label: '人员编码',
    value: 'workNo'
  },
  {
    label: '手机号',
    value: 'phonenumber'
  },
  {
    label: '所属企业',
    value: 'sysUserCompanyName'
  },
  {
    label: '所属部门',
    value: 'deptName'
  },
  {
    label: '员工类型',
    value: 'type'
  },
  {
    label: '密级',
    value: 'secretLevelLabel'
  },
  {
    label: '性别',
    value: 'sex'
  },
  {
    label: '岗位',
    value: 'post'
  },
  {
    label: '邮箱',
    value: 'email'
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
      info: {},
      posts: [],
      arr: arr
    }
  },
  computed: {
    userType () {
      let text = ''
      switch (this.info.type) {
        case 1:
          text = '其他'
          break
        case 2:
          text = '专项'
          break
        case 3:
          text = '正式员工'
          break
      }
      return text
    },
    userPost () {
      let text = ''
      const strArr = this.posts.map(t => t.postName)
      text = strArr.join('，')
      return text
    },
    userSex () {
      return this.info.sex === '0' ? '男' : '女'
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
    getDetail (userId) {
      this.$api('users.userDetail', { userId }).then(res => {
        if (res.code === 200) {
          this.info = res.data
          this.posts = res.posts
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
