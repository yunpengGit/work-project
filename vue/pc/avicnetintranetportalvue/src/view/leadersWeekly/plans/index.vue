<template>
  <div class="plans-1620646140088">

    <div class="plan-header">
      <!-- <el-button type="primary" icon="el-icon-plus" :disabled="!canOperateLeaders.length" @click="onAddNew">新建领导安排</el-button> -->
      <el-radio-group v-model="leaderType" size="medium" @change="onLoadPlan">
        <el-radio-button label="1">集团领导</el-radio-button>
        <el-radio-button label="10">总助级高管</el-radio-button>
        <el-radio-button label="20">部门领导</el-radio-button>
      </el-radio-group>
      <div class="date-wrap">
        <el-button class="now-week" :disabled="isNowWeek" @click="nowWeek">显示本周</el-button>
        <el-button class="btn-week" icon="el-icon-back" @click="preWeek">上一周</el-button>
        <span class="date-str">{{ dateStr }}</span>
        <el-button class="btn-week" @click="nextWeek">下一周<i class="el-icon-right el-icon--right" /></el-button>
      </div>
      <div class="btn-wrap">
        <!-- <label>领导类型：</label>
        <el-select v-model="leaderType" placeholder="请选择" @change="onLoadPlan">
          <el-option label="集团领导" value="1" />
          <el-option label="总助级高管" value="10" />
          <el-option label="部门领导" value="20" />
        </el-select> -->

        <template v-if="isManage">
          <el-button type="text" @click="onClear"><icon-svg name="xiazai11" />清除状态</el-button>
          <el-button type="text" @click="exportPlandialogVisible = true"><icon-svg name="xiazai1" />导出数据</el-button>
        </template>
      </div>
    </div>

    <table>
      <tr>
        <th colspan="2">时间</th>
        <th v-for="(week,index) in weeks" :key="index" :class="{'today': isToday(index)}">{{ week }}<span>{{ formatDate(index, 'M/D') }}</span></th>
      </tr>
      <tbody v-for="leader in planList" :key="leader.leaderId">
        <tr class="tr-morning">
          <td rowspan="2" class="leader-name">{{ leader.leaderName }}</td>
          <td class="morning">上午</td>
          <td v-for="(plan,index) in leader.planEvents" :key="index">
            <plan-item
              day-type="上午"
              :is-refresh="isRefresh"
              :leader-info="leader"
              :date="formatDate(index)"
              :item-list="plan.morningPlanEvents.length ? [plan.morningPlanEvents[0]] : []"
              @onAddOrEdit="onAddOrEdit"
            />
          </td>
        </tr>
        <tr>
          <td class="afternoon">下午</td>
          <td v-for="(plan,index) in leader.planEvents" :key="index">
            <plan-item
              day-type="下午"
              :is-refresh="isRefresh"
              :leader-info="leader"
              :date="formatDate(index)"
              :item-list="plan.afternoonPlanEvents.length ? [plan.afternoonPlanEvents[0]] : []"
              @onAddOrEdit="onAddOrEdit"
            />
          </td>
        </tr>
      </tbody>

    </table>
    <export-plan v-if="exportPlandialogVisible" :dialog-visible.sync="exportPlandialogVisible" :all-leaders="allLeaders" />
    <edit-plan v-if="editPlandialogVisible" :dialog-visible.sync="editPlandialogVisible" :info="dialogInfo" :can-operate-leaders="canOperateLeaders" />
  </div>
</template>

<script>
import EditPlan from './EditPlan'
import ExportPlan from './ExportPlan'
import PlanItem from './PlanItem'
import dayjs from 'dayjs'
import iconSvg from '@/components/icon-svg'
import { getItem } from '@/utils/storage'

const weeks = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

export default {
  name: 'Plans',
  components: { ExportPlan, EditPlan, PlanItem, iconSvg },
  props: {},
  data () {
    return {
      weeks,
      dialogInfo: {},
      planList: [],
      leaderType: '1',	// 领导类型
      startTime: '',	// 开始时间
      endTime: '',	// 结束时间
      isRefresh: 0, // 安排列表刷新
      allLeaders: [],
      canOperateLeaders: [],
      editPlandialogVisible: false,
      exportPlandialogVisible: false,
      userInfo: null
    }
  },
  computed: {
    isManage () {
      /**
     * 拥有权限：
     *    1、导出领导安排
     *    2、清除状态
     *    3、单元格修改高亮
     */
      const userInfo = JSON.parse(getItem('userInfo'))
      const roles = userInfo.roles
      return !!roles.find(v => v.roleKey === 'portal-in-leaderweek')
    },
    isNowWeek () {
      return dayjs().day(1).isSame(this.startTime, 'day')
    },
    dateStr () {
      return `${dayjs(this.startTime).format('YYYY年M月D日')} 至 ${dayjs(this.endTime).format('YYYY年M月D日')}`
    }
  },
  watch: {},
  created () {
    // 初始化渲染本周
    this.nowWeek()
    this.getLeader()
    this.userInfo = JSON.parse(getItem('userInfo'))
  },
  mounted () {},
  methods: {
    getLeader () {
      // 有操作权限的领导列表
      this.$api('leadersWeekly.leaders', { ownCanOperateFlag: true }).then(res => {
        this.canOperateLeaders = res.data
      })
      // 所有领导列表
      this.$api('leadersWeekly.leaders').then(res => {
        this.allLeaders = res.data
      })
    },
    onLoadPlan () {
      const req = {
        leaderType: this.leaderType,
        planStartTime: dayjs(this.startTime).format('YYYY-MM-DD'),
        planEndTime: dayjs(this.endTime).format('YYYY-MM-DD')
      }
      this.$api('leadersWeekly.planList', req).then((res) => {
        this.planList = res.data
        this.$nextTick(() => {
          this.isRefresh = new Date().getTime()
        })
      })
    },
    nowWeek () {
      this.startTime = dayjs().day(1)
      this.endTime = dayjs().day(7)
      this.onLoadPlan()
    },
    preWeek () {
      this.startTime = dayjs(this.startTime).subtract(1, 'week')
      this.endTime = dayjs(this.endTime).subtract(1, 'week')
      this.onLoadPlan()
    },
    nextWeek () {
      this.startTime = dayjs(this.startTime).add(1, 'week')
      this.endTime = dayjs(this.endTime).add(1, 'week')
      this.onLoadPlan()
    },
    formatDate (i, mode = 'YYYY-MM-DD') {
      return dayjs(this.startTime).add(i, 'day').format(mode)
    },
    isToday (i) {
      return dayjs(this.startTime).add(i, 'day').isSame(dayjs(), 'day')
    },
    onAddNew () {
      this.editPlandialogVisible = true
      this.dialogInfo = {}
    },
    // 单元格-菜单事件-新增编辑粘贴
    onAddOrEdit (d) {
      this.editPlandialogVisible = true
      this.dialogInfo = d
    },
    onClear () {
      this.$api('leadersWeekly.clearStatus', { planStartTime: '', planEndTime: '' }).then((res) => {
        this.$message.success('操作成功')
        this.onLoadPlan()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.plans-1620646140088 {
  background: #fff;
  .plan-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 24px 12px 16px;
    ::v-deep .el-radio-group .el-radio-button__inner {
      font-weight: normal;
      padding: 8px 0;
      width: 100px;
      font-size: 14px;
    }

    .date-wrap {
      .now-week {
        padding: 8px 11px !important;
      }
      .date-str {
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191F24;
        margin: 0 24px;
      }
      .btn-week {
        padding: 8px;
      }
      .el-button {
        font-weight: normal;
        color: #191F24;
      }
    }
    .btn-wrap {
       display: flex;
       align-items: center;
       label {
         color: rgba(25, 31, 36, 0.64);
       }
      .el-select {
          width: 120px;
          margin-right: 8px;
      }
      button {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #1E89FF;
        line-height: 16px;
        margin-left: 32px;
        i {
          margin-right: 4px;
        }
      }
      .icon {
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    border-top: 1px solid rgba(25, 31, 36, 0.12);
    th {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #191F24;
      padding: 11px 8px;
      text-align: left;
      background: #FAFBFB;
      &:first-child {
        text-align: center;
        // border-bottom: 0;
        border-bottom-color: rgba(25, 31, 36, 0.06);
      }
      span {
        margin-left: 8px;
        color: rgba(25, 31, 36, 0.48);
      }
      &.today {
        background: rgba(12, 154, 255, 0.12);
      }
    }
    td,
    th {
      border-right: 1px solid rgba(25, 31, 36, 0.12);
      border-bottom: 1px solid rgba(25, 31, 36, 0.12);
      &:last-child {
        border-right:none;
      }
    }
    td {
      text-align: left;
      &:not(.morning):not(.afternoon):not(.leader-name) {
        width: 215px;
        vertical-align: top;
        padding: 0;
      }
      &.leader-name {
        text-align: center;
        font-size: 15px;
        border-right-color: rgba(25, 31, 36, 0.06);
        border-top: 1px solid rgba(25, 31, 36, 0.12);
        background: #FAFBFB;
      }
      &.morning {
        text-align: center;
        font-size: 13px;
        color: rgba(25, 31, 36, 0.48);
        border-left: 1px solid rgba(25, 31, 36, 0.12);
        background: #FAFBFB;
      }
      &.afternoon {
        text-align: center;
        font-size: 13px;
        color: rgba(25, 31, 36, 0.48);
        background: #FAFBFB;
      }
      &.today {
        background: rgba(12, 154, 255, 0.12);
      }
    }
    tr.tr-morning td:not(.leader-name) {
      border-bottom: 1px solid rgba(25, 31, 36, 0.04);
    }
  }
}
</style>

<style lang="scss">
@import '@/ui/size/mixin.scss';
@mixin del($sc: 1, $fs: 14px){
  .plans-1620646140088  {
    .plan-header .btn-wrap {
       label {
         font-size: $fs;
       }
      .el-select {
          width: 120px * $sc;
      }
      button {
        font-size: 12px * $sc;
        line-height: 16px * $sc;
      }
    }

    table {
      th {
        font-size: 13px * $sc;
        padding: 11px 8px * $sc;
      }
      td {
        &.leader-name {
          font-size: 15px * $sc;
        }
        &.morning,
        &.afternoon{
          font-size: 13px * $sc;
        }
      }
    }

  }
}
@import '@/ui/size/mixin.scss';
@import '@/ui/size/scale.scss';
</style>
