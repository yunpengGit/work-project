<template>
  <el-drawer
    title="人员动态登记表"
    :size="640"
    :visible="drawer"
    @close="closed"
    @update:visible="visibaleChange"
  >
    <div v-loading="loading" class="change-detail">
      <div v-if="!loading" class="detail-content">
        <div class="title">外出人员信息</div>
        <template v-for="item in arr1">
          <div v-if="info[item.value]" :key="item.value" class="row">
            <span class="row-label">{{ item.label }}</span>
            <span
              v-if="item.value === 'outStartTime'"
              class="row-text"
            >{{ info.outStartTime }} 至 {{ info.outEndTime }}</span>
            <span
              v-else-if="item.value === 'outgoingType'"
              class="row-text"
            >{{ outText }}</span>
            <span
              v-else-if="item.value === 'vacationType'"
              class="row-text"
            >{{ vacationText }}</span>
            <span v-else class="row-text">{{ info[item.value] }}</span>
          </div>
        </template>
        <div class="title">接收人员信息</div>
        <div v-for="items in arr2" :key="items.value" class="row">
          <span class="row-label">{{ items.label }}</span>
          <span v-if="items.value === 'entrustStr'" class="row-text">{{ entrustStr }}</span>
          <span v-else class="row-text">{{ info[items.value] }}</span>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
const arr1 = [
  { label: '外出人', value: 'userName' },
  { label: '外出联系方式', value: 'outgoingContact' },
  { label: '外出类型', value: 'outgoingType' },
  { label: '周期', value: 'outStartTime' },
  { label: '休假类型', value: 'vacationType' },
  { label: '休假事由', value: 'vacationReason' },
  { label: '事务描述', value: 'workDesc' },
  { label: '会议名称', value: 'meetingTheme' },
  { label: '会议地点', value: 'meetingAddr' },
  { label: '出差地点', value: 'businessTripAddr' },
  { label: '主办单位', value: 'organizer' },
  { label: '随行人员', value: 'entourage' },
  { label: '出差事由', value: 'businessTripReason' },
  { label: '登记日期', value: 'registerDate' }
]
const arr2 = [
  { label: '接收人', value: 'receiveUserName' },
  { label: '委托范围', value: 'entrustStr' }
]

export default {
  props: {
    dynamicId: {
      type: Number,
      default: null
    },
    drawer: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      info: {
        userName: ''
      },
      vacationText: '',
      outText: '',
      entrustStr: '',
      arr1: arr1,
      arr2: arr2,
      loading: true
    }
  },
  watch: {
    dynamicId: {
      handler (val) {
        if (val !== '') {
          this.getDetail(val)
        }
      },
      immediate: true
    }
  },
  methods: {
    // 获取详情
    async getDetail () {
      const { dynamicId } = this
      const result = await this.$api('peopleChange.changeDetail', { dynamicId })
      if (result.code === 200) {
        this.info = result.data
        const strArr = []
        result.data.entrustList.map(t => {
          strArr.push(t.entrustModuleName)
        })
        this.entrustStr = strArr.join('，')
        await this.outType()
        if (result.data.vacationType) {
          await this.vacationType()
        }
        this.loading = false
      }
    },
    // 匹配休假类型
    async vacationType () {
      const res = await this.$api('peopleChange.getVacation')
      const { vacationType } = this.info
      if (res.code === 200) {
        res.data.some(t => {
          if (t.dictValue === vacationType.toString()) {
            this.vacationText = t.dictLabel
          }
        })
      }
    },
    // 匹配外出类型
    async outType () {
      const res = await this.$api('peopleChange.getOut')
      const { outgoingType } = this.info
      if (res.code === 200) {
        res.data.some(t => {
          if (t.dictValue === outgoingType.toString()) {
            this.outText = t.dictLabel
          }
        })
      }
    },
    // 注销
    deleteData () {
      const { dynamicId } = this
      this.$confirm('确定注销此条动态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api('peopleChange.revokeData', { dynamicId }).then(res => {
          if (res.code === 200) {
            this.$message.success('注销成功')
            this.$router.push('/peopleChange')
          }
        })
      }).catch(() => {})
    },
    visibaleChange () {
      this.$emit('update:drawer', false)
    },
    closed () {
      this.$emit('closeDetail')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/ui/size/mixin.scss';
@mixin del($sc: 1, $fs: 14px){
  .change-detail {
    padding: 16px;
    height: 100%;
    max-height: 100%;
    overflow-y: auto;
    .title {
      margin: 35px 0;
      display: flex;
      align-items: center;
      font-size: 16px * $sc;
      color: #191F24;
      line-height: 21px * $sc;
      &:before {
        content: '';
        display: inline-block;
        width: 4px * $sc;
        height: 15px * $sc;
        margin-right: 5px;
        background-color: #1E89FF;
      }
    }
    .row {
      margin-bottom: 24px;
      display: flex;
      // align-items: center;
      .row-label {
        width: 90px * $sc;
        margin-right: 48px;
        text-align: right;
        flex-shrink: 0;
        font-size: $fs;
        color: rgba(25, 31, 36, 0.48);
      }
      .row-text {
        font-size: $fs;
        color: rgba(25, 31, 36, 0.88);
        word-wrap: break-word;
        word-break: break-all;
      }
    }
  }
}
@import '@/ui/size/mixin.scss';
@import '@/ui/size/scale.scss';
</style>
