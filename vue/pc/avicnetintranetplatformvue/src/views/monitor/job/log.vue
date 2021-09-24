<template>
  <div class="app-container">
    <sp-table
      uid="log"
      keys="jobName"
      keys-more="jobGroup,jobStatus,jobTimeRange"
      :api="getList"
      :table-cols="tableCols"
      :selection.sync="selection"
    >
      <div slot="handle">
        <el-button v-hasPermi="['monitor:job:remove']" type="danger" icon="el-icon-delete" :disabled="multiple" @click="handleDelete(ids)">删除</el-button>
        <el-button v-hasPermi="['monitor:job:remove']" type="info" icon="el-icon-delete" @click="handleClean">清空</el-button>
      </div>
    </sp-table>
    <!-- 调度日志详细 -->
    <el-dialog title="调度日志详细" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="日志序号：">{{ form.jobLogId }}</el-form-item>
            <el-form-item label="任务名称：">{{ form.jobName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组：">{{ form.jobGroup }}</el-form-item>
            <el-form-item label="执行时间：">{{ form.createTime }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调用方法：">{{ form.invokeTarget }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="日志信息：">{{ form.jobMessage }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="执行状态：">
              <div v-if="form.status == 0">正常</div>
              <div v-else-if="form.status == 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.status == 1" label="异常信息：">{{ form.exceptionInfo }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listJobLog, delJobLog, cleanJobLog } from '@/api/monitor/jobLog'
import formatDate from '@/utils/format-date'

export default {
  name: 'JobLog',
  data () {
    return {
      selection: [],
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 执行状态字典
      statusOptions: [],
      // 任务组名字典
      jobGroupOptions: [],
      tableCols: [
        {
          label: '日志编号',
          width: '100',
          prop: 'jobLogId'
        },
        {
          label: '任务名称',
          prop: 'jobName'
        },
        {
          label: '任务组名',
          width: '100',
          template: scope => {
            return this.selectDictLabel(this.jobGroupOptions, scope.row.jobGroup)
          }
        },
        {
          label: '调用目标字符串',
          'show-overflow-tooltip': true,
          prop: 'invokeTarget'
        },
        {
          label: '日志信息',
          'show-overflow-tooltip': true,
          prop: 'jobMessage'
        },
        {
          label: '执行状态',
          width: '80',
          template: (scope) => {
            return scope.row.status !== 0 ? '已执行' : '未执行'
          }
        },
        {
          label: '执行时间',
          width: '180',
          template: scope => {
            return formatDate(scope.row.createTime, 'yyyy-MM-dd hh:mm:ss')
          }
        },
        {
          label: '操作',
          width: '100',
          template: (scope) => {
            return <div>
              <el-button type='text' icon='el-icon-view' v-hasPermi={ ['monitor:job:query'] } on-click={() => this.handleView(scope.row) }>详细</el-button>
            </div>
          }
        }
      ]
    }
  },
  computed: {
    ids () {
      return this.selection.map(item => {
        return {
          jobId: item.jobId
        }
      })
    },
    single () {
      return this.selection.length !== 1
    },
    multiple () {
      return !this.selection.length
    }
  },
  destroyed () {
    this.$router.push('/monitor/job')
  },
  created () {
    this.getDicts('sys_job_status').then(response => {
      this.statusOptions = response.data
    })
    this.getDicts('sys_job_group').then(response => {
      this.jobGroupOptions = response.data
    })
  },
  methods: {
    /** 查询调度日志列表 */
    getList (params) {
      if (Array.isArray(params.timeRange)) {
        params.beginTime = params.timeRange[0]
        params.endTime = params.timeRange[1]
        delete params.timeRange
      }
      return listJobLog(params)
    },
    // 执行状态字典翻译
    statusFormat (row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 任务组名字典翻译
    jobGroupFormat (row, column) {
      return this.selectDictLabel(this.jobGroupOptions, row.jobGroup)
    },
    /** 详细按钮操作 */
    handleView (row) {
      this.open = true
      this.form = row
    },
    /** 删除按钮操作 */
    handleDelete (data) {
      const jobLogIds = data.map(v => v.jobLogId)
      this.$confirm('是否确认删除调度日志编号为"' + jobLogIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delJobLog(jobLogIds)
      }).then(() => {
        this.$store.commit('UPDATE_ALL_TABLE_DATA')
        this.msgSuccess('删除成功')
      }).catch(function () {})
    },
    /** 清空按钮操作 */
    handleClean () {
      this.$confirm('是否确认清空所有调度日志数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return cleanJobLog()
      }).then(() => {
        this.$store.commit('UPDATE_ALL_TABLE_DATA')
        this.msgSuccess('清空成功')
      }).catch(function () {})
    },
    /** 导出按钮操作 */
    handleExport () {
      this.download('schedule/job/log/export', {
        ...this.queryParams
      }, `log_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
