<template>
  <div class="app-container">
    <sp-table
      keys="jobName,jobGroup,jobStatus"
      :api="getList"
      :table-cols="tableCols"
      :selection.sync="selection"
    >
      <div slot="handle">
        <el-button v-hasPermi="['monitor:job:add']" type="primary" icon="el-icon-plus" @click="operation('','add')">新增</el-button>
        <el-button v-hasPermi="['monitor:job:edit']" type="primary" icon="el-icon-edit" :disabled="single" @click="operation(ids,'edit')">修改</el-button>
        <el-button v-hasPermi="['monitor:job:remove']" type="danger" icon="el-icon-delete" :disabled="multiple" @click="handleDelete(ids)">删除</el-button>
        <!-- <el-button v-hasPermi="['monitor:job:export']" type="warning" icon="el-icon-download" :disabled="multiple" @click="handleExport">导出</el-button> -->
        <el-button v-hasPermi="['monitor:job:query']" type="info" icon="el-icon-s-operation" @click="handleJobLog">日志</el-button>
      </div>
    </sp-table>
    <!-- 添加或修改定时任务对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务名称" prop="jobName">
              <el-input v-model="form.jobName" placeholder="请输入任务名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组" prop="jobGroup">
              <el-select v-model="form.jobGroup" placeholder="请选择">
                <el-option
                  v-for="dict in jobGroupOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="invokeTarget">
              <span slot="label">
                调用方法
                <el-tooltip placement="top">
                  <div slot="content">
                    Bean调用示例：ryTask.ryParams('jt')
                    <br>Class类调用示例：com.jeethink.quartz.task.RyTask.ryParams('jt')
                    <br>参数说明：支持字符串，布尔类型，长整型，浮点型，整型
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </span>
              <el-input v-model="form.invokeTarget" placeholder="请输入调用目标字符串" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="cron表达式" prop="cronExpression">
              <el-input v-model="form.cronExpression" placeholder="请输入cron执行表达式" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否并发" prop="concurrent">
              <el-radio-group v-model="form.concurrent">
                <el-radio-button label="0">允许</el-radio-button>
                <el-radio-button label="1">禁止</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="错误策略" prop="misfirePolicy">
              <el-radio-group v-model="form.misfirePolicy">
                <el-radio-button label="1">立即执行</el-radio-button>
                <el-radio-button label="2">执行一次</el-radio-button>
                <el-radio-button label="3">放弃执行</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 任务日志详细 -->
    <el-dialog title="任务详细" :visible.sync="openView" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务编号：">{{ form.jobId }}</el-form-item>
            <el-form-item label="任务名称：">{{ form.jobName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组：">{{ jobGroupFormat(form) }}</el-form-item>
            <el-form-item label="创建时间：">{{ form.createTime }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="cron表达式：">{{ form.cronExpression }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下次执行时间：">{{ parseTime(form.nextValidTime) }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调用目标方法：">{{ form.invokeTarget }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务状态：">
              <div v-if="form.status == 0">正常</div>
              <div v-else-if="form.status == 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否并发：">
              <div v-if="form.concurrent == 0">允许</div>
              <div v-else-if="form.concurrent == 1">禁止</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行策略：">
              <div v-if="form.misfirePolicy == 0">默认策略</div>
              <div v-else-if="form.misfirePolicy == 1">立即执行</div>
              <div v-else-if="form.misfirePolicy == 2">执行一次</div>
              <div v-else-if="form.misfirePolicy == 3">放弃执行</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openView = false">关 闭</el-button>
      </div>
    </el-dialog>
    <sp-dialog title="日志查询" width="100%" top="0" uid="log-dialog" />
  </div>
</template>

<script>
import { listJob, getJob, delJob, addJob, updateJob, runJob, changeJobStatus } from '@/api/monitor/job'
// import formatDate from '@/utils/format-date'
import ElSwitch from '@/components/ElSwitch'
export default {
  name: 'Job',
  data () {
    return {
      selection: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否显示详细弹出层
      openView: false,
      // 任务组名字典
      jobGroupOptions: [],
      // 状态字典
      statusOptions: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        jobName: [
          { required: true, message: '任务名称不能为空', trigger: 'blur' }
        ],
        invokeTarget: [
          { required: true, message: '调用目标字符串不能为空', trigger: 'blur' }
        ],
        cronExpression: [
          { required: true, message: 'cron执行表达式不能为空', trigger: 'blur' }
        ]
      },
      tableCols: [
        {
          label: '任务编号',
          width: '100',
          prop: 'jobId'
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
          label: 'cron执行表达式',
          'show-overflow-tooltip': true,
          prop: 'cronExpression'
        },
        {
          label: '状态',
          width: '100',
          template: scope => {
            return <div>
              <ElSwitch
                data={scope.row}
                warningText={'确认要"' + scope.row.status === '0' ? '启用' : '停用' + scope.row.jobName + '任务吗?'}
                callback={() => changeJobStatus(scope.row.jobId, scope.row.status) }
              />
            </div>
          }
        },
        {
          label: '操作',
          width: '180',
          template: (scope) => {
            return <div>
              <el-button type='text' icon='el-icon-caret-right' v-hasPermi={ ['monitor:job:edit'] } on-click={() => this.handleRun(scope.row) }>执行一次</el-button>
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
  created () {
    this.getDicts('sys_job_group').then(response => {
      this.jobGroupOptions = response.data
    })
    this.getDicts('sys_job_status').then(response => {
      this.statusOptions = response.data
    })
  },
  methods: {
    /** 查询定时任务列表 */
    getList (params) {
      return listJob(params)
    },
    // 任务组名字典翻译
    jobGroupFormat (row, column) {
      return this.selectDictLabel(this.jobGroupOptions, row.jobGroup)
    },
    // 状态字典翻译
    statusFormat (row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 取消按钮
    cancel () {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset () {
      this.form = {
        jobId: undefined,
        jobName: undefined,
        jobGroup: undefined,
        invokeTarget: undefined,
        cronExpression: undefined,
        misfirePolicy: 1,
        concurrent: 1,
        status: '0'
      }
      this.resetForm('form')
    },
    /* 立即执行一次 */
    handleRun (row) {
      this.$confirm('确认要立即执行一次"' + row.jobName + '"任务吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return runJob(row.jobId, row.jobGroup)
      }).then(() => {
        this.msgSuccess('执行成功')
      }).catch(function () {})
    },
    /** 任务详细信息 */
    handleView (row) {
      getJob(row.jobId).then(response => {
        this.form = response.data
        this.openView = true
      })
    },
    /** 任务日志列表查询 */
    handleJobLog () {
      this.$store.commit('OPEN_DIALOG', {
        uid: 'log-dialog',
        component: require('./log').default
      })
    },
    operation (data, type) {
      this.reset()
      this.open = true
      if (type === 'add') {
        this.title = '添加任务'
        return
      }
      const jobId = data.map(v => v.jobId)
      getJob(jobId).then(response => {
        this.form = response.data
        this.title = '修改任务'
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.jobId !== undefined) {
            updateJob(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.$store.commit('UPDATE_ALL_TABLE_DATA')
              }
            })
          } else {
            addJob(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.$store.commit('UPDATE_ALL_TABLE_DATA')
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete (data) {
      const jobIds = data.map(v => v.jobId)
      this.$confirm('是否确认删除定时任务编号为"' + jobIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delJob(jobIds)
      }).then(() => {
        this.$store.commit('UPDATE_ALL_TABLE_DATA')
        this.msgSuccess('删除成功')
      }).catch(function () {})
    },
    /** 导出按钮操作 */
    handleExport () {
      this.download('schedule/job/export', {
        ...this.queryParams
      }, `job_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
