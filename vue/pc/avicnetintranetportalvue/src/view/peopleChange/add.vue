<template>
  <div
    v-loading="loading"
    class="change-add-1620442084598"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="title">登记人员动态</div>
    <el-form
      ref="form"
      :rules="formRules"
      :model="params"
      class="form"
      label-width="130px"
      label-position="left"
    >
      <el-form-item label="外出人：">
        <el-select
          v-model="outUser"
          placeholder="请输入姓名搜索"
          filterable
          value-key="nickName"
          :disabled="isDeptAcc"
          remote
          :remote-method="getOutUser"
          :loading="outLoading"
          @change="outChange"
        >
          <el-option
            v-for="item in outUserOptions"
            :key="item.userId"
            :label="item.nickName"
            :value="item"
          >
            <span v-if="item.dept">{{ item.nickName }} / {{ item.dept.deptName }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="外出人部门：">
        <el-input v-model="params.deptName" placeholder="请输入部门" disabled />
      </el-form-item>

      <!-- TO DO -->
      <el-form-item label="登记日期：">
        <el-input v-model="params.registerDate" placeholder="请输入登记日期" disabled />
      </el-form-item>

      <el-form-item label="外出类型：" prop="outgoingType">
        <el-radio-group v-model="params.outgoingType">
          <el-radio
            v-for="out in outOptions"
            :key="out.dictValue"
            :label="Number(out.dictValue)"
          >{{ out.dictLabel }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="预计时间：" prop="timePicker">
        <el-date-picker
          v-model="params.timePicker"
          style="width: 100%;"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>

      <el-form-item label="外出联系方式：" prop="outgoingContact">
        <el-input v-model="params.outgoingContact" placeholder="请填写联系方式" />
      </el-form-item>

      <div v-if="params.outgoingType === 1">
        <el-form-item label="出差事由：" prop="businessTripReason">
          <el-input
            v-model="params.businessTripReason"
            placeholder="请输入出差事由"
            type="textarea"
            :rows="3"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="出差地点：" prop="businessTripAddr">
          <el-input v-model="params.businessTripAddr" placeholder="请填写出差地点" />
        </el-form-item>
      </div>

      <div v-if="params.outgoingType === 2">
        <el-form-item label="会议名称：" prop="meetingTheme">
          <el-input v-model="params.meetingTheme" placeholder="请填写会议名称" />
        </el-form-item>
        <el-form-item label="会议地点：" prop="meetingAddr">
          <el-input v-model="params.meetingAddr" placeholder="请填写会议地点" />
        </el-form-item>
      </div>

      <div v-if="params.outgoingType === 3">
        <el-form-item label="事务描述：" prop="workDesc">
          <el-input
            v-model="params.workDesc"
            placeholder="请输入事务描述"
            type="textarea"
            :rows="5"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </div>

      <div v-if="params.outgoingType === 4">
        <el-form-item label="休假类型：" prop="vacationType">
          <el-radio-group v-model="params.vacationType" class="radio-vacation">
            <el-radio
              v-for="vac in vacationOptions"
              :key="vac.dictValue"
              :label="Number(vac.dictValue)"
              class="radio-vacation-item"
            >{{ vac.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="休假事由：" prop="vacationReason">
          <el-input
            v-model="params.vacationReason"
            placeholder="请输入休假事由"
            type="textarea"
            :rows="3"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </div>

      <el-form-item label="主办单位：" prop="organizer">
        <el-input v-model="params.organizer" placeholder="请填写主办单位" />
      </el-form-item>

      <el-form-item label="随行人员：" prop="entourage">
        <el-input v-model="params.entourage" placeholder="请填写随行人员" />
      </el-form-item>

      <!-- <el-form-item label="生成日程：" prop="generateSchedule">
        <el-radio-group v-model="params.generateSchedule">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item> -->

      <el-divider />

      <el-form-item label="接收人：" prop="receiveUserName">
        <el-select
          v-model="receiveUser"
          value-key="nickName"
          placeholder="请输入姓名搜索"
          filterable
          remote
          :remote-method="getReceive"
          :loading="receiveLoading"
          @click.native="changePlaceholder($event)"
          @change="receiveChange"
        >
          <el-option
            v-for="item in receiveOptions"
            :key="item.userId"
            :label="item.nickName"
            :value="item"
          >
            <span v-if="item.dept">{{ item.nickName }} / {{ item.dept.deptName }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="委托范围：" prop="entrustList">
        <div v-for="app in appMoudel" :key="app.appId">
          <div class="app-top">
            <div>{{ app.appName }}</div>
            <div>
              <el-button type="text" @click="checkAll(app.moduleList)">全选</el-button>
              <el-button type="text" @click="checkCancelAll(app.moduleList)">反选</el-button>
            </div>
          </div>
          <el-divider class="app-deivider" />
          <div>
            <el-checkbox
              v-for="range in app.moduleList"
              :key="range.entrustModuleId"
              :value="isChecked(range.entrustModuleId)"
              @change="checked=>rangeSigle(checked, range)"
            >{{ range.entrustModuleName }}</el-checkbox>
          </div>
        </div>
      </el-form-item>

      <div class="tips">注：部级领导请将“发文管理”、“通知公告”移交给副部级（含）以上领导。</div>

      <el-form-item>
        <el-button type="text" @click="back">返回</el-button>
        <el-button type="default" @click="resetForm('form')">重置</el-button>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getItem } from '@/utils/storage'
export default {
  data () {
    return {
      formRules: {
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        outgoingType: [
          { required: true, message: '请选择外出类型', trigger: 'blur' }
        ],
        timePicker: [
          {
            type: 'array',
            required: true,
            message: '请选择日期区间',
            fields: {
              0: { type: 'string', required: true, message: '请选择开始日期' },
              1: { type: 'string', required: true, message: '请选择结束日期' }
            }
          }
        ],
        outgoingContact: [
          { required: true, message: '请填写联系方式', trigger: 'blur' }
        ],
        businessTripReason: [
          { required: true, message: '请填写事由', trigger: 'blur' }
        ],
        businessTripAddr: [
          { required: true, message: '请填写地点', trigger: 'blur' }
        ],
        meetingTheme: [
          { required: true, message: '请填写会议名称', trigger: 'blur' }
        ],
        meetingAddr: [
          { required: true, message: '请填写会议地点', trigger: 'blur' }
        ],
        workDesc: [
          { required: true, message: '请填写描述', trigger: 'blur' }
        ],
        vacationType: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        vacationReason: [
          { required: true, message: '请填写事由', trigger: 'blur' }
        ],
        entrustList: [
          { type: 'array', required: true, message: '请选择委托范围', trigger: 'change' }
        ],
        receiveUserName: [
          { required: true, message: '请选择接收人', trigger: 'change' }
        ]
      },
      params: {
        userId: '',
        userName: '',
        deptId: '',
        deptName: '',
        outStartTime: '',
        outEndTime: '',
        registerDate: '',
        outgoingType: '',
        businessTripReason: '',
        businessTripAddr: '',
        meetingTheme: '',
        meetingAddr: '',
        workDesc: '',
        vacationType: '',
        vacationReason: '',
        outgoingContact: '',
        organizer: '',
        receiveUserId: '',
        receiveUserName: '',
        generateSchedule: '',
        entourage: '',
        entrustList: [],
        timePicker: ''
      },
      dynamicId: '', // 更新时人员动态id
      vacationOptions: [], // 休假类型集合
      outOptions: [], // 外出类型集合
      appMoudel: [], // 委托范围集合
      loading: false, // 页面loading
      receiveLoading: false, // 接收人搜索loading
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7 // 如果没有后面的-8.64e7就是不可以选择今天的
        }
      },
      isDeptAcc: false, // 当前是否为部门助理
      accIds: [], // 助理的部门id集合
      coompanyId: '', // 公司id
      receiveOptions: [], // 接收人搜索集合
      receiveUser: {},
      outUser: {},
      outUserOptions: [],
      outLoading: false
    }
  },
  async created () {
    this.dynamicId = this.$route.query.id || ''
    const userInfo = JSON.parse(getItem('userInfo'))
    if (this.dynamicId === '') {
      const aData = new Date()
      this.$nextTick(() => {
        this.params.registerDate = aData.getFullYear() + '-' + (aData.getMonth() + 1) + '-' + aData.getDate()
        this.params.userName = userInfo.nickName
        this.params.userId = userInfo.userId
        this.params.outgoingContact = userInfo.phonenumber
        this.outUser.userId = userInfo.userId
        this.outUser.nickName = userInfo.nickName
        this.outUserOptions.push(this.outUser)
      })
    } else {
      await this.getDetail()
    }
    this.isAcc()
    this.getOut()
    this.getModules()
    this.getVacation()
  },
  methods: {
    // 获取详情
    async getDetail () {
      const { dynamicId } = this
      const result = await this.$api('peopleChange.changeDetail', { dynamicId })
      if (result.code === 200) {
        this.$nextTick(() => {
          this.params = result.data
          this.$set(this.params, 'timePicker', [result.data.outStartTime, result.data.outEndTime])
          this.receiveUser.nickName = result.data.receiveUserName
          this.receiveUser.userId = result.data.receiveUserId
          this.receiveOptions.push(this.receiveUser)
        })
      }
    },
    // 重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.params.receiveUserId = ''
      this.params.receiveUserName = ''
      this.receiveUser = null
      // 若为部门助理则清空当前外出人
      if (!this.isDeptAcc) {
        this.params.userName = ''
        this.outUser = null
      }
    },

    // 是否为部门助理，获取部门id集合和公司id
    isAcc () {
      this.$api('peopleChange.isAcc').then(res => {
        this.isDeptAcc = res.data.assistantFlag
        this.companyId = res.data.companyId
        this.params.deptName = res.data.depts[0].deptName
        this.params.deptId = res.data.depts[0].deptId
        res.data.depts.map(t => {
          if (t.isAssistant) {
            this.accIds.push(t.deptiId)
          }
        })
      })
    },

    // 获取接收人
    getReceive (query) {
      this.receiveLoading = true
      const { companyId } = this
      this.$api('peopleChange.getReceive', { deptId: companyId, nickName: query }).then(res => {
        this.receiveLoading = false
        this.receiveOptions = res.rows
      })
    },
    // 获取外出人
    getOutUser (query) {
      this.outLoading = true
      const { companyId } = this
      this.$api('peopleChange.getReceive', { deptId: companyId, nickName: query }).then(res => {
        this.outLoading = false
        this.outUserOptions = res.rows
      })
    },
    changePlaceholder (e) {
      e.target.placeholder = '请输入姓名搜索'
    },
    // 更改选中人员id
    receiveChange (value) {
      this.params.receiveUserId = value.userId
      this.params.receiveUserName = value.nickName
    },

    // 更改外出人
    outChange (value) {
      this.params.userId = value.userId
      this.params.userName = value.nickName
      this.params.deptId = value.deptId
      this.params.outgoingContact = value.phonenumber
      this.params.deptName = value.deptName
    },

    // 获取可移交流程
    getModules () {
      this.$api('peopleChange.getModule').then((res) => {
        this.appMoudel = res.data
      })
    },
    // 单个选择流程
    rangeSigle (isChecked, info) {
      if (isChecked) {
        this.params.entrustList.push(info)
      } else {
        for (let i = 0; i < this.params.entrustList.length; i++) {
          if (this.params.entrustList[i].entrustModuleId === info.entrustModuleId) {
            this.params.entrustList.splice(i, 1)
          }
        }
      }
    },
    // 流程全选
    checkAll (list) {
      // 合并、去重
      const newArr = [...this.params.entrustList, ...list]
      for (var i = 0; i < newArr.length - 1; i++) {
        for (var j = i + 1; j < newArr.length; j++) {
          if (newArr[i].entrustModuleId === newArr[j].entrustModuleId) {
            newArr.splice(j, 1)
            // 因为数组长度减小1，所以直接 j++ 会漏掉一个元素，所以要 j--
            j--
          }
        }
      }
      this.params.entrustList = newArr
    },
    // 反选
    checkCancelAll (list) {
      this.params.entrustList = this.params.entrustList.filter(item => {
        const idList = list.map(v => v.entrustModuleId)
        return !idList.includes(item.entrustModuleId)
      })
    },
    isChecked (id) {
      return this.params.entrustList.some(i => i.entrustModuleId === id)
    },
    // 获取休假类型
    getVacation () {
      this.$api('peopleChange.getVacation').then((res) => {
        this.vacationOptions = res.data
      })
    },
    // 获取外出类型
    getOut () {
      this.$api('peopleChange.getOut').then((res) => {
        this.outOptions = res.data
        if (!this.dynamicId) {
          this.params.outgoingType = Number(res.data[0].dictValue)
        }
      })
    },
    // 选定类型后其他类型必填字段清空
    resetFileds (type) {
      const { params } = this
      switch (type) {
        case 1:
          params.meetingTheme = ''
          params.meetingAddr = ''
          params.workDesc = ''
          params.vacationType = ''
          params.vacationReason = ''
          break
        case 2:
          params.businessTripReason = ''
          params.businessTripAddr = ''
          params.workDesc = ''
          params.vacationType = ''
          params.vacationReason = ''
          break
        case 3:
          params.businessTripReason = ''
          params.businessTripAddr = ''
          params.meetingTheme = ''
          params.meetingAddr = ''
          params.vacationType = ''
          params.vacationReason = ''
          break
        case 4:
          params.businessTripReason = ''
          params.businessTripAddr = ''
          params.meetingTheme = ''
          params.meetingAddr = ''
          params.workDesc = ''
          break
      }
    },
    // 获取当前具体时间
    getTime () {
      const yy = new Date().getFullYear()
      const mm = new Date().getMonth() + 1
      const dd = new Date().getDate()
      const hh = new Date().getHours()
      const mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
    },
    // 提交表单
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 检查接收人时间是否冲突
          const timeRange = this.params.timePicker
          this.params.outStartTime = timeRange[0]
          this.params.outEndTime = timeRange[1]
          const { receiveUserId, outStartTime, outEndTime } = this.params
          const { dynamicId } = this
          const checkFlag = await this.$api('peopleChange.checkTime', !dynamicId ? {
            receiveUserId,
            outStartTime,
            outEndTime
          } : {
            receiveUserId,
            outStartTime,
            outEndTime,
            dynamicId
          }).then(res => {
            return res.data.code
          }).catch(err => {
            return err.data.code
          })
          if (checkFlag === 500) {
            return
          }
          if (this.params.userId === this.params.receiveUserId) {
            this.$message.error('接收人不能是自己，请重选')
            return
          }
          this.loading = true
          this.resetFileds(this.params.outgoingType)
          const paramsData = { ...this.params }
          paramsData.registerDate = this.getTime()
          delete paramsData.timePicker
          // 新增
          if (!this.dynamicId) {
            this.$api('peopleChange.addChange', paramsData).then((res) => {
              this.loading = false
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.$router.push('/peopleChange')
            }).catch(() => {
              this.loading = false
            })
          } else {
            // 更新
            const { dynamicId } = this
            this.$api('peopleChange.updateChange', { dynamicId, ...paramsData }).then(res => {
              this.loading = false
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.$router.push('/peopleChange')
            }).catch(() => {
              this.loading = false
            })
          }
        } else {
          return false
        }
      })
    },
    // 返回
    back () {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss">
@import '@/ui/flex.scss';
.change-add-1620442084598 {
  position: relative;
  padding: 42px 0 5px 0;
  background-color: #fff;
  @include flex-single(center,center);
}
</style>

<style lang="scss" scoped>
@import '@/ui/size/mixin.scss';
@mixin del($sc: 1, $fs: 14px){
  .change-add-1620442084598 {
    .title {
      position: absolute;
      top: 51px;
      left: 56px;
      font-size: 16px;
      color: #191f24;
      line-height: 21px;

      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: -8px;
        margin-top: -7px;
        height: 15px;
        width: 4px;
        background-color: #1e89ff;
      }
    }
    .el-input {
      width: 554px;
    }
    .el-date-editor {
      .el-input__inner {
        padding: 0 30px;
      }
    }
    .el-form {
      .el-form-item {
        margin-bottom: 36px;
        .el-form-item__label {
          width: 130px !important;
        }
        .el-form-item__content {
          margin-left: 130px !important;
        }
        .limite-width .el-input__inner{
          width: 294px;
        }
      }
      .el-form-item__error {
        padding-top: 8px;
      }
      .tips {
        margin-bottom: 26px;
        color: #1E89FF;
      }
    }
    .form {
      margin: 0 auto;
      .line {
        text-align: center;
      }
      label {
        font-size: 14px * $sc;
        color: rgba(25, 31, 36, 0.64);
      }
      .radio-vacation-item {
        width: 85px * $sc;
      }
      a {
        color: #1E89FF;
        margin-left: 12px;
      }

      .radio-vacation {
        max-width: 550px;
        &-item {
          padding-top: 8px;
        }
      }
      .app-top {
        padding-top: 8px;
        display: flex;
        justify-content: space-between;
      }
      .app-deivider {
        margin: 8px 0;
      }
    }
  }
}
@import '@/ui/size/scale.scss';
</style>
