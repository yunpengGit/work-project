<template>
  <div class="edit-plan-1620640966610">
    <el-drawer
      :title="`${isEdit ? '编辑' : '新建'}领导安排`"
      :visible="dialogVisible"
      direction="rtl"
      @update:visible="visibaleChange"
    >

      <el-form ref="ruleForm" :model="form" :rules="rules" label-position="left">

        <el-form-item label="选择领导：" prop="leaderId">
          <el-select v-model="form.leaderId" placeholder="请选择领导" :disabled="isEdit">
            <el-option
              v-for="item in canOperateLeaders"
              :key="item.leaderId"
              :label="item.leaderName"
              :value="item.leaderId"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="选择日期：" prop="planDate">
          <el-date-picker
            v-model="form.planDate"
            :disabled="isEdit"
            type="date"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>

        <el-form-item label="选择时段：" prop="dayType">
          <el-radio-group v-model="form.dayType" :disabled="isEdit">
            <el-radio v-for="(d, i) in dayType" :key="d" :label="i">{{ d }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="选择类型：" prop="type" class="type-form">
          <el-radio-group v-model="form.type">
            <el-radio v-for="(d, i) in type" :key="d" :label="i + 1" @click.native="onSelectType(i + 1)">{{ d }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 类型为总部会议显示时间选项 -->
        <!-- <el-form-item v-if="form.type === 2" label="选择时间：">
          <el-time-picker
            v-model="form.time"
            is-range
            format="HH:mm"
            value-format="HH:mm"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          />
        </el-form-item> -->

        <!-- 类型为休假、京内办事隐藏地点 -->
        <el-form-item v-if="!(form.type === 4 || form.type === 8)" label="地点：" prop="address">
          <el-input v-model="form.address" placeholder="请输入地点" />
        </el-form-item>

        <!-- 类型为休假时，内容非必填，其他情况必填 -->
        <!-- 类型为京内办事隐藏内容 -->
        <!-- 总部办公时，隐藏内容 -->
        <el-form-item v-if="!(form.type === 1 || form.type === 4)" label="内容：" prop="content" :required="form.type !== 8">
          <el-input
            v-model="form.content"
            type="textarea"
            placeholder="请输入内容"
            maxlength="200"
            show-word-limit
            resize="none"
          />
        </el-form-item>

        <el-form-item v-if="!isEdit" label="重复：">
          <el-checkbox-group v-model="form.recurDay">
            <el-checkbox v-for="(d, i) in week" :key="d" :label="i + 1" :disabled="disabledRecurDay(i+1)">{{ d }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

      </el-form>
      <div class="btn-footer">
        <span>
          <el-button type="primary" @click="onSure">{{ isEdit ? '保 存' : '提 交' }}</el-button>
          <el-button @click="visibaleChange">取 消</el-button>
        </span>
        <el-button v-if="isEdit" @click="onDelete">删 除</el-button>
      </div>

    </el-drawer>
  </div>
</template>

<script>
import dayjs from 'dayjs'

const dayType = ['全天', '上午', '下午']
const week = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const type = ['总部办公', '总部会议', '京内会议', '京内办事', '京外出差', '出国', '培训', '休假']

export default {
  name: 'ExportPlan',
  components: { },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default () {
        return {}
      }
    },
    canOperateLeaders: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      type,
      week,
      dayType,
      form: {
        id: '',
        time: '',
        leaderId: '', // 领导id
        leaderName: '', // 领导姓名
        type: '', // 1总部办公 2总部会议 3京内会议 4京内办事 5京外出差 6出国 7培训 8休假
        content: '',	// 内容
        address: '',	// 地点
        planDate: '', // 安排的日期	2021-03-17
        dayType: '', // 天类型	0全天 1上午 2下午
        planStartTime: '', // 开始时间	10:00
        planEndTime: '', // 结束时间	11:00
        recurDay: [] // 重复	传1代表周一 传2代表周二 ….. 1,3代表周一和周三
      },
      rules: {
        leaderId: [
          { required: true, message: '请选择领导', trigger: 'change' }
        ],
        planDate: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        dayType: [
          { required: true, message: '请选择时段', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入地点', trigger: 'blur' }
        ],
        content: [
          { validator: this.checkContent, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {
    'form.planDate' (n, o) {
      if (n) {
        const new_day = dayjs(n).day()
        this.form.recurDay.push(new_day ? new_day : 7)
        if (o) {
          const old_day = dayjs(o).day()
          const index = this.form.recurDay.findIndex(v => v === (old_day ? old_day : 7))
          this.form.recurDay.splice(index, 1)
        }
      }
    }
  },
  created () {
    const { recurDay, planStartTime, planEndTime } = this.info
    this.form = Object.assign({}, this.form, this.info, {
      time: planStartTime ? [planStartTime, planEndTime] : '',
      recurDay: recurDay ? recurDay.splite(',') : []
    })
    this.isEdit = !!this.form.planId
  },
  mounted () {},
  methods: {
    checkContent (rule, value, callback) {
      //  休假时,内容非必填
      if (this.form.type !== 8) {
        if (value) {
          callback()
        } else {
          callback(new Error('请输入内容'))
        }
      } else {
        callback()
      }
    },
    onSelectType (type) {
      // 选择总部办公和总部会议时，地点默认为北区
      const address = this.form.address
      this.form.address = type === 1 || type === 2 ? '北区' : address
    },
    visibaleChange () {
      this.$emit('update:dialog-visible', false)
    },
    disabledRecurDay (i) {
      if (this.form.planDate) {
        // dayjs: 0(星期日)到6(星期六)的数字
        const day = dayjs(this.form.planDate).day()
        return day === 0 && i === 7 ? true : day === i
      } else {
        return false
      }
    },
    onSure () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const { recurDay, type, content, leaderId, time, address } = this.form
          const req = Object.assign({}, this.form, {
            recurDay: recurDay.join(','),
            content: type === 1 || type === 4 ? '' : content, // 类型为京内办事隐藏内容
            address: type === 4 || type === 8 ? '' : address, // 类型为休假、京内办事隐藏地点
            leaderName: this.canOperateLeaders.find(v => v.leaderId === leaderId).leaderName, // 领导姓名
            planStartTime: type === 2 ? time[0] : '', // 类型为总部会议显示时间选项
            planEndTime: type === 2 ? time[1] : ''
          })

          this.$api(`leadersWeekly.${this.isEdit ? 'editPlan' : 'addPlan'}`, { ...req }).then((res) => {
            this.$message.success('操作成功')
            this.visibaleChange()
            this.$parent.onLoadPlan() // 日历刷新
          })
        } else {
          return false
        }
      })
    },
    onDelete () {
      this.$confirm('确认删除该领导安排？')
        .then(_ => {
          this.$api('leadersWeekly.deletePlan', { id: this.form.planId }).then(res => {
            this.$message.success('删除成功')
            this.visibaleChange()
            this.$parent.onLoadPlan() // 日历刷新
          }).catch(() => {
            this.$message.error('删除失败，请稍后再试')
          })
        }).catch(_ => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-plan-1620640966610 {
  ::v-deep .el-drawer {
    width: 640px !important;
  .el-drawer__body {
    display: flex;
    flex-direction: column;
    .el-form {
      flex-grow: 1;
      padding: 24px 48px 24px 24px;
      .el-form-item__label {
        width: 110px;
      }
      .el-form-item__content {
        width: 455px;
        display: inline-block;
      }
      .el-checkbox-group,
      .el-radio-group {
        display: flex;
        flex-wrap: wrap;
        .el-radio {
          line-height: 32px;
        }
        .el-checkbox {
          margin: 9px 30px 9px 0;
        }
      }
      .type-form .el-radio {
          width: 80px;
      }
      .el-select,
      .el-date-editor {
        width: 100%;
      }
    }
    .btn-footer {
      flex-shrink: 0;
      display: flex;
      padding: 16px 24px;
      justify-content: space-between;
      box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.08);
    }
  }
  }
}
</style>

<style lang="scss">
@import '@/ui/size/mixin.scss';
@mixin del($sc: 1, $fs: 14px){
  .edit-plan-1620640966610 {
    .el-drawer {
      width: 640px * $sc !important;
       .el-form {
          .el-form-item__label {
            width: 110px * $sc!important;
          }
          .el-form-item__content {
            width: 455px  * $sc !important;
              .el-radio {
                line-height: 32px * $sc!important;
              }
          }
       }
    }
  }
}
@import '@/ui/size/mixin.scss';
@import '@/ui/size/scale.scss';
</style>
