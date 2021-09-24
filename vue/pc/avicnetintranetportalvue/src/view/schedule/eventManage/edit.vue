<template>
  <div class="schedule-edit-form-drawer-container">
    <div class="form-drawer-body">
      <el-form ref="form" :model="form" label-position="left" :rules="rules">
        <el-form-item
          label="日程标题："
          :label-width="formLabelWidth"
          prop="subject"
        >
          <el-input
            v-model="form.subject"
            class="haspadding"
            autocomplete="off"
            :maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="日程时间：" :label-width="formLabelWidth">
          <div class="schedule-edit-date-picker">
            <!-- {{form.startTime}} - {{form.finishTime}} -->
            <el-date-picker
              v-model="form.startTime"
              prefix-icon="el-icon-date"
              :type="form.wholeDay ? 'date' : 'datetime'"
              :clearable="false"
              placeholder="日程开始时间"
              format="yyyy-MM-dd HH:mm:ss"
              @change="timeChange"
            />
            <div class="small-line">
              <i />
            </div>
            <el-date-picker
              v-model="form.finishTime"
              prefix-icon="el-icon-date"
              :type="form.wholeDay ? 'date' : 'datetime'"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="日程结束时间"
              :clearable="false"
              @change="timeChange"
            />
          </div>
        </el-form-item>

        <el-form-item label="是否全天：" :label-width="formLabelWidth">
          <el-switch v-model="form.wholeDay" @change="switchChange" />
        </el-form-item>

        <el-form-item label="日程地点：" :label-width="formLabelWidth">
          <el-input
            v-model="form.location"
            class="haspadding"
            autocomplete="off"
            :maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="日程所有者：" :label-width="formLabelWidth">
          <el-select
            v-model="form.ownerId"
            placeholder="请选择日程所有者"
            :style="{ minWidth: '80%' }"
          >
            <el-option
              v-for="item in userArr"
              :key="item.sharerId"
              :label="item.sharerUserName"
              :value="item.sharerId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="公开范围：" :label-width="formLabelWidth">
          <el-select
            v-model="form.authorityType"
            placeholder="请选择公开范围"
            :style="{ minWidth: '80%' }"
          >
            <el-option
              v-for="item in authorityTypeActions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="日程提醒："
          :label-width="formLabelWidth"
          prop="alarmTypes"
        >
          <el-select
            v-model="form.alarmTypes"
            multiple
            placeholder="请选择日程提醒"
            :style="{ minWidth: '80%' }"
            @change="alarmTypesChange"
          >
            <el-option
              v-for="item in alarmTypesActions0"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
            <el-option
              v-for="item in alarmTypesActions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="日程重复：" :label-width="formLabelWidth">
          <el-select
            :value="currentAlarmType"
            placeholder="请选择日程重复方式"
            :style="{ minWidth: '80%' }"
            @change="recurrenceRuleChange"
          >
            <el-option
              v-for="item in setRepeatTypeArr"
              v-show="!(item.value != 0 && isLongDay())"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="日程描述：" :label-width="formLabelWidth">
          <el-input
            v-model="form.content"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            autocomplete="off"
            :maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="form-drawer_footer">
      <el-button
        type="primary"
        :loading="loading"
        @click="postWarning('form')"
      >{{ loading ? "提交中 ..." : "确定" }}</el-button>
      <el-button @click="formDrawerClose">取消</el-button>
    </div>
    <diy-repeat-dialog
      :dialog-visiable.sync="repeatDialog"
      :start-time="form.startTime"
      :value="form.recurrenceRule"
      @refreshRule="refreshRule"
    />
    <!-- 编辑时，对于重复日程提交时弹出 -->
    <el-dialog
      title="选择日程更新范围"
      width="390px"
      :modal="false"
      :visible="updateDialog"
      @update:visible="updateDialog= false"
    >
      <div class="radio-group-box">
        <span>日程更新范围：</span>
        <div>
          <el-radio-group v-model="rangeTypeIfRecurr">
            <el-radio label="CURR_ONLY">仅更新此日程</el-radio>
            <el-radio label="CURR_FUTURE">更新以后所有日程</el-radio>
            <el-radio label="ALL">更新所有日程</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialog = false">取消</el-button>
        <el-button
          type="primary"
          @click="(updateDialog = false), postEvents()"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import diyRepeatDialog from './diyRepeatDialog'
import dayjs from 'dayjs'
import formatDate from '@/utils/format-date'
import { getItem } from '@/utils/storage'
const weekArr = [
  {
    name: '周日',
    value: 'SU'
  },
  {
    name: '周一',
    value: 'MO'
  },
  {
    name: '周二',
    value: 'TU'
  },
  {
    name: '周三',
    value: 'WE'
  },
  {
    name: '周四',
    value: 'TH'
  },
  {
    name: '周五',
    value: 'FR'
  },
  {
    name: '周六',
    value: 'SA'
  }
]
export default {

  components: { diyRepeatDialog },
  props: {
    value: Boolean,
    eventId: {
      type: String,
      default: null
    },
    eventDate: {
      type: String,
      default: null
    },
    addDate: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      userInfo: null,
      loading: false,
      formLabelWidth: '120px',
      oldForm: null, // 编辑时，用来存储原始值
      nowStartTime: '', // 用于编辑重复日程时，判断时间是否发生变化
      nowFinishTime: '',
      form: {
        subject: '',
        content: '',
        wholeDay: false,
        startTime: '',
        finishTime: '',
        location: '',
        locationCoordinate: null,
        authorityType: 'DEFAULT',
        alarmTypes: ['ON'],
        ownerId: null,
        recurrenceRule: {
          recurr: false, // 是否进行重复
          freq: null, // 重复类型
          interval: null, // 重复间隔
          weeklyByDays: null, // 按周重复
          monthlyType: null, // 按月重复
          monthlyByDay: null,
          endType: null, //	截止类型
          count: null, // 发生X次后结束
          until: null // 直到某天截止
        }
      },
      currentAlarmType: 0, // 当前的重复方式
      rules: {
        subject: [
          { required: true, message: '请输入日程标题', trigger: 'blur' }
        ],
        alarmTypes: [
          { required: true, message: '请输入日程提醒', trigger: 'change' }
        ]
      },
      authorityTypeActions: [
        { name: '分享可见', value: 'DEFAULT' },
        { name: '私密', value: 'PRIVATE' }
      ],
      alarmTypesActions0: [
        {
          name: '不提醒',
          value: 'NO'
        }
      ],
      alarmTypesActions1: [
        {
          name: '当天9:00',
          value: 'STARTDAY_9H'
        },
        {
          name: '1天前9:00',
          value: 'B_1DAY_9H'
        },
        {
          name: '2天前9:00',
          value: 'B_2DAYS_9H'
        },
        {
          name: '3天前9:00',
          value: 'B_3DAYS_9H'
        },
        {
          name: '1周前9:00',
          value: 'B_1WEEK_9H'
        }
      ],
      alarmTypesActions2: [
        {
          name: '日程开始时',
          value: 'ON_START'
        },
        {
          name: '5分钟前',
          value: 'B_5MINS'
        },
        {
          name: '10分钟前',
          value: 'B_10MINS'
        },
        {
          name: '15分钟前',
          value: 'B_15MINS'
        },
        {
          name: '30分钟前',
          value: 'B_30MINS'
        },
        {
          name: '1小时前',
          value: 'B_1HOUR'
        },
        {
          name: '2小时前',
          value: 'B_2HOURS'
        },
        {
          name: '1天前',
          value: 'B_1DAY'
        },
        {
          name: '2天前',
          value: 'B_2DAYS'
        },
        {
          name: '1周前',
          value: 'B_1WEEK'
        }
      ],
      repeatDialog: false,
      freqArr: [null, 'WEEKLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
      userArr: [],
      defaultSetting: {
        durationType: '30MINS', // 默认时长
        nonWholeDayAlarmType: 'NO', // 非全天日程提醒类型
        wholeDayAlarmType: 'NO' // 全天日程提醒类型
      },
      durationTypeObj: {
        '15MINS': 15,
        '30MINS': 30,
        '45MINS': 45,
        '60MINS': 60,
        '90MINS': 90,
        '120MINS': 120
      },
      updateDialog: false,
      rangeTypeIfRecurr: 'ALL'
    }
  },
  computed: {
    // 重置重复方式列表
    setRepeatTypeArr () {
      const repeatTypeArr = [
        {
          name: '不重复',
          value: 0
        },
        {
          name: '每个工作日（周一至周五）',
          value: 1
        },
        {
          name: '每天',
          value: 2
        },
        {
          name: '每周',
          value: 3
        },
        {
          name: '每月',
          value: 4
        },
        {
          name: '每年',
          value: 5
        },
        {
          name: '自定义',
          value: 6
        }
      ]
      if (this.currentAlarmType === -1) {
        const ruleItem = {
          name: this.getDiyName(this.form.recurrenceRule),
          value: -1
        }
        if (repeatTypeArr.length === 8) {
          repeatTypeArr[0] = ruleItem
        } else {
          repeatTypeArr.unshift(ruleItem)
        }
      } else {
        if (repeatTypeArr.length === 8) {
          repeatTypeArr.splice(0, 1)
        }
      }
      return repeatTypeArr
    },
    alarmTypesActions () {
      return this.form.wholeDay
        ? this.alarmTypesActions1
        : this.alarmTypesActions2
    },
    getMonthWeek () {
      const day = new Date(this.form.startTime).getDate()
      return Math.floor((day - 1) / 7) + 1
    },
    getWeekValue () {
      const value = weekArr[new Date(this.form.startTime).getDay()].value
      return value
    }
  },
  watch: {
    value (val) {
      if (val) {
        if (this.addDate) {
          const addDate = this.handleDateFormat(this.addDate)
          // 如果有默认开始日期，需处理一下form.startTime
          const now = dayjs().format('HH:mm')
          this.form.startTime = `${addDate} ${now}`
        }
        this.getUserSetting()
        this.getAsSubscriber()
      }
    }
  },
  created () {
    this.userInfo = JSON.parse(getItem('userInfo'))
    this.form.ownerId = this.userInfo.userId
    this.form.startTime = new Date()
    this.form.finishTime = new Date()
    if (this.addDate) {
      const addDate = this.handleDateFormat(this.addDate)
      // 如果有默认开始日期，需处理一下form.startTime
      const now = dayjs().format('HH:mm')
      this.form.startTime = `${addDate} ${now}`
    }
    this.getUserSetting()
    this.getAsSubscriber()
  },

  mounted () {},
  methods: {
    handleDateFormat (data) {
      if (data.length) {
        return data.replace(/\-/g, '/')
      } else {
        return ''
      }
    },
    // 获取用户默认设置
    getUserSetting () {
      this.$api('schedule.getUserSetting', { defaultsIfNull: true }).then(
        (res) => {
          const data = res.data
          this.defaultSetting.durationType = data.durationType // 默认时长
          this.defaultSetting.nonWholeDayAlarmType = data.nonWholeDayAlarmType // 非全天日程提醒类型
          this.defaultSetting.wholeDayAlarmType = data.wholeDayAlarmType // 全天日程提醒类型
          if (this.eventId) {
            this.getEventInfo()
          } else {
            this.switchChange()
            this.setDurationType()
          }
        }
      )
    },
    /**
     * 获取日程详情
     * **/
    getEventInfo () {
      this.$api('schedule.getEvent', {
        eventId: this.eventId,
        targetEventDate: this.eventDate
      }).then((res) => {
        if (res.code === 200) {
          const resData = res.data
          this.oldForm = JSON.parse(JSON.stringify(resData))
          // 重复处理一下时间
          if (resData.recurrenceRule.recurr) {
            // 针对重复日程，对日期进行处理，不能显示发布时候的日期
            this.nowStartTime = resData.wholeDay
              ? `${this.eventDate}`
              : `${this.eventDate} ${new Date(this.handleDateFormat(resData.startTime)).getHours()}:${
                new Date(this.handleDateFormat(resData.startTime)).getMinutes() || '00'
              }`
            this.nowFinishTime = resData.wholeDay
              ? `${this.eventDate}`
              : `${this.eventDate} ${new Date(this.handleDateFormat(resData.finishTime)).getHours()}:${
                new Date(this.handleDateFormat(resData.finishTime)).getMinutes() || '00'
              }`
            resData.startTime = this.nowStartTime
            resData.finishTime = this.nowFinishTime
          }
          if (resData.wholeDay) {
            resData.startTime = `${resData.startTime} 00:00`
            resData.finishTime = `${resData.finishTime} 00:00`
          }

          this.form = { ...resData }
          this.form.startTime = this.handleDateFormat(this.form.startTime)
          this.form.finishTime = this.handleDateFormat(this.form.finishTime)
          // 设置currentAlarmType
          if (!this.form.recurrenceRule.recurr) {
            this.currentAlarmType = 0
            return false
          }
          this.currentAlarmType = this.setCurrentAlarmType(
            this.form.recurrenceRule
          )
        } else {
          this.$message.error(res.msg || '发生未知错误')
        }
      })
    },

    /**
     * 用户查询共享给我的权限权限信息
     * **/
    getAsSubscriber () {
      this.$api('schedule.getEventAuthAsSubscriber', {
        permsTypesIn: ['READWRITE']
      }).then((res) => {
        this.userArr = res.data
        this.userArr.unshift({
          sharerId: this.userInfo.userId,
          sharerUserName: this.userInfo.nickName,
          sharerPhoto: this.userInfo.avatar
        })
      })
    },

    // 日程提醒发生变化
    alarmTypesChange (data) {
      if (!data.length) {
        return false
      }

      if (data[data.length - 1] === 'NO') {
        this.form.alarmTypes = ['NO']
      } else {
        const i = data.findIndex((e) => e === 'NO')
        if (i > -1) {
          this.form.alarmTypes.splice(i, 1)
        }
      }
    },

    // 是否全天切换
    switchChange () {
      // 是否是全天切换的时候重置为用户默认选择
      const Item = this[
        this.form.wholeDay ? 'alarmTypesActions1' : 'alarmTypesActions2'
      ].find((item) => {
        return (
          item.value ===
          this.defaultSetting[
            this.form.wholeDay ? 'wholeDayAlarmType' : 'nonWholeDayAlarmType'
          ]
        )
      })
      this.form.alarmTypes = [Item ? Item.value : 'NO']
      // 由全天切换成非全天时判断下时间，并且是在编辑状态下，以前是全天
      if (!this.form.wholeDay && this.oldForm && this.oldForm.wholeDay) {
        this.setDurationType()
      }
    },

    // 时间发生改变
    timeChange () {
      // TO DO 区分开始时间和结束时间发生变化
      const startTime = new Date(this.form.startTime).getTime()
      const finishTime = new Date(this.form.finishTime).getTime()
      if (this.form.wholeDay) {
        if (startTime > finishTime) {
          this.form.finishTime = this.form.startTime
          this.$message.error('开始时间不能大于结束时间')
        }
      } else {
        // 如果开始时间大于等于结束时间,
        if (startTime >= finishTime) {
          this.setDurationType(false)
          this.$message.error('开始时间不能大于结束时间')
        }
      }
    },

    // 设置默认时长
    setDurationType (hourChange = true) {
      const nowTime = this.form.startTime || new Date()
      // 日程开始时间默认为当前时间后的整点时间
      const delayStartTime = hourChange ? new Date(new Date(nowTime).getTime() + 60 * 60 * 1000) : new Date(new Date(nowTime).getTime())
      // 处理时间不可以通过获取当前时间粗暴 +1 ，因为存在23点，但是时间是不可能出现24：00 应该拿到当前时间加一个小时严谨些
      const delayHours = delayStartTime.getHours()
      const st = formatDate(delayStartTime, 'yyyy-MM-dd')
      this.form.startTime = this.handleDateFormat(`${st} ${delayHours}:00`)
      // 日程结束时间默认为开始时间+个人设置中的默认时长
      const finishTime =
        new Date(this.form.startTime).getTime() +
        this.durationTypeObj[this.defaultSetting.durationType] * 60 * 1000
      this.form.finishTime = this.handleDateFormat(formatDate(finishTime, 'yyyy-MM-dd hh:mm'))
      // console.log(new Date(this.form.startTime).getTime(), this.durationTypeObj[this.defaultSetting.durationType], this.defaultSetting.durationType, this.durationTypeObj[this.defaultSetting.durationType] * 60 * 1000)
    },
    // 选择重复方式
    recurrenceRuleChange (data) {
      if (data === -1) return false
      if (data === 6) {
        if (this.setRepeatTypeArr.length !== 8) {
          this.form.recurrenceRule.freq = 'DAILY' // 重复类型
          this.form.recurrenceRule.interval = 1 // 重复间隔
          this.form.recurrenceRule.endType = 'NEVER'
          this.form.recurrenceRule.weeklyByDays = [this.getWeekValue] // 按周重复初始值
          this.form.recurrenceRule.monthlyType = 'SAME_DATE' // 按月重复
          this.form.recurrenceRule.count = null
          this.form.recurrenceRule.until = null
        }
        this.repeatDialog = true
        return false
      }

      this.currentAlarmType = data
      this.form.recurrenceRule.recurr = data === 0 ? false : true // 是否重复
      this.form.recurrenceRule.freq = this.freqArr[data] // 重复类型
      this.form.recurrenceRule.interval = 1 // 重复间隔
      this.form.recurrenceRule.endType = 'NEVER'
      this.form.recurrenceRule.count = null
      this.form.recurrenceRule.until = null

      // 非自定义选择后退出
      switch (data) {
        case 1: // 周一至周五
          this.form.recurrenceRule.weeklyByDays = [
            'MO',
            'TU',
            'WE',
            'TH',
            'FR'
          ]
          this.form.recurrenceRule.monthlyType = 'SAME_DATE'
          break
        case 3:
          this.form.recurrenceRule.weeklyByDays = [this.getWeekValue]
          break
        case 4:
          this.form.recurrenceRule.monthlyType = 'SAME_DATE'
          break
      }
    },

    // 选择自定义重复方式确认后
    refreshRule (rule) {
      this.form.recurrenceRule = JSON.parse(JSON.stringify(rule))
      // 判断currentAlarmType值是否可能为其他值
      this.currentAlarmType = this.setCurrentAlarmType(rule)
    },

    setCurrentAlarmType (rule) {
      if (rule.interval === 1 && rule.endType === 'NEVER') {
        // 是否是工作日
        if (
          rule.freq === 'WEEKLY' &&
          rule.weeklyByDays.length === 5 &&
          !rule.weeklyByDays.includes('SU') &&
          !rule.weeklyByDays.includes('SA')
        ) {
          return 1
        }
        // 是否是每天
        if (rule.freq === 'DAILY') {
          return 2
        }
        // 是否是每周
        if (
          rule.freq === 'WEEKLY' &&
          rule.weeklyByDays.length === 1 &&
          rule.weeklyByDays.includes(this.getWeekValue)
        ) {
          return 3
        }
        // 是否是每月
        if (rule.freq === 'MONTHLY' && rule.monthlyType === 'SAME_DATE') {
          return 4
        }
        // 是否是每年
        if (rule.freq === 'YEARLY') {
          return 5
        }
      }
      return -1
    },

    // 提交前校验
    postWarning (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 判断是否是过去日程
          if (this.oldEventWarning() && !this.eventId) {
            this.$confirm(
              `确定创建一个过去时间的日程？`
            )
              .then(() => {
                this.postEventsAfter()
              })
              .catch(() => {})
          } else {
            this.postEventsAfter()
          }
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },

    postEventsAfter () {
      // 在编辑情况下，如果修改前是重复日程，有弹出框
      if (this.eventId && this.oldForm.recurrenceRule.recurr) {
        // 设置默认选中值
        this.rangeTypeIfRecurr = 'CURR_ONLY'
        this.updateDialog = true
      } else {
        this.rangeTypeIfRecurr = 'ALL'
        this.postEvents()
      }
    },

    // 提交
    postEvents () {
      if (this.loading) {
        return
      }
      this.loading = true
      const startTime = formatDate(
        this.form.startTime,
        this.form.wholeDay ? 'yyyy-MM-dd' : 'yyyy-MM-dd hh:mm'
      )
      const finishTime = formatDate(
        this.form.finishTime,
        this.form.wholeDay ? 'yyyy-MM-dd' : 'yyyy-MM-dd hh:mm'
      )
      const req = {
        ...this.form,
        startTime,
        finishTime,
        eventId: this.eventId
      }

      // 判断开始时间和结束时间
      if (
        new Date(req.startTime).getTime() > new Date(req.finishTime).getTime()
      ) {
        this.$message.warning('日程开始时间要在开始结束之前')
        return false
      }

      // 更新当前的,规则没有变，则为不重复
      if (this.rangeTypeIfRecurr === 'CURR_ONLY' && this.eventId) {
        const oldAlarmType = this.setCurrentAlarmType(
          this.oldForm.recurrenceRule
        )

        if (oldAlarmType === this.currentAlarmType) {
          if (oldAlarmType === -1) {
            // 如果是自定义重复方式 需再次判断
            const diyName = this.getDiyName(this.oldForm.recurrenceRule)
            if (diyName === this.setRepeatTypeArr[0].name) {
              req.recurrenceRule.recurr = false
            }
          } else {
            req.recurrenceRule.recurr = false
          }
        }
      }

      // 针对重复日程，更新所有的时候，判断日期是否发生过变化
      if (
        this.form.recurrenceRule.recurr &&
        this.eventId &&
        this.rangeTypeIfRecurr === 'ALL'
      ) {
        // 判断时间是否发生变化
        if (
          req.startTime === this.nowStartTime &&
          req.finishTime === this.nowFinishTime
        ) {
          // 未发生变化
          req.startTime = this.oldForm.startTime
          req.finishTime = this.oldForm.finishTime
        }
      }

      const apiUrl = this.eventId ? 'schedule.putEvent' : 'schedule.postEvents'

      this.$api(
        apiUrl,
        this.eventId
          ? {
            eventId: this.eventId,
            rangeTypeIfRecurr: this.rangeTypeIfRecurr,
            targetEventDate: this.eventDate,
            ...req
          }
          : req
      )
        .then((res) => {
          if (res.code === 200) {
            this.loading = false
            this.$message.success('提交成功')
            this.$emit('formDrawerClose', true)
            this.initForm()
          } else {
            this.loading = false
            this.$message.error(res.msg || '发生未知错误')
          }
        })
        .catch(() => {
          this.loading = false
        })
    },

    // 判断是否是过去日程
    oldEventWarning () {
      const finishTime = dayjs(this.form.finishTime).format(
        this.form.wholeDay ? 'YYYY/MM/DD' : 'YYYY/MM/DD HH:mm'
      )
      const todayTime = dayjs(new Date()).format(
        this.form.wholeDay ? 'YYYY/MM/DD' : 'YYYY/MM/DD HH:mm'
      )
      return new Date(finishTime).getTime() < new Date(todayTime).getTime()
    },
    // 获取自定义重复方式名称
    getDiyName (recurrenceRule) {
      const diyName =
        recurrenceRule.endType === 'COUNT'
          ? `${recurrenceRule.count}次终止重复`
          : recurrenceRule.endType === 'UNTIL'
            ? `直到${recurrenceRule.until}终止重复`
            : '无限重复'
      const interval =
        recurrenceRule.interval === 1 ? '' : recurrenceRule.interval
      switch (recurrenceRule.freq) {
        case 'DAILY':
          return `每${interval}天，${diyName}`
        case 'WEEKLY': {
          const arr = []
          weekArr.forEach((ele) => {
            if (recurrenceRule.weeklyByDays.includes(ele.value)) {
              arr.push(ele.name)
            }
          })
          return `每${interval}周的${arr.join('、')}，${diyName}`
        }
        case 'MONTHLY': {
          let name = ''
          if (recurrenceRule.monthlyType === 'SAME_DATE') {
            name = `每${interval}月第${new Date(
              this.form.startTime
            ).getDate()}天`
          } else {
            weekArr.forEach((ele) => {
              if (ele.value === recurrenceRule.monthlyByDay.weekday) {
                name = `每${interval}月的第${this.getMonthWeek}个${ele.name}重复`
              }
            })
          }
          return `${name},${diyName}`
        }
        case 'YEARLY':
          return `每${interval}年，${diyName}`
      }
    },

    // 是否跨天
    isLongDay () {
      // 跨天不能重复
      const stime = dayjs(this.form.startTime).format('YYYY-MM-DD')
      const ftime = dayjs(this.form.finishTime).format('YYYY-MM-DD')
      const isLong = stime !== ftime
      if (isLong) {
        this.form.recurrenceRule.recurr = false
        this.currentAlarmType = 0
      }
      return isLong
    },

    // 抽屉关闭
    formDrawerClose () {
      this.initForm()
      this.$emit('formDrawerClose')
    },
    initForm () {
      this.form = {
        subject: '',
        content: '',
        wholeDay: false,
        startTime: new Date(),
        finishTime: new Date(),
        location: '',
        locationCoordinate: null,
        authorityType: 'DEFAULT',
        alarmTypes: ['ON'],
        recurrenceRule: {
          recurr: false, // 是否进行重复
          freq: null, // 重复类型
          interval: null, // 重复间隔
          weeklyByDays: null, // 按周重复
          monthlyType: null, // 按月重复
          monthlyByDay: null,
          endType: null, //	截止类型
          count: null, // 发生X次后结束
          until: null // 直到某天截止
        },
        ownerId: this.userInfo.userId.toString()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<style lang="scss">
@mixin del($sc: 1, $fs: 14px){
  .schedule-edit-form-drawer-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    .form-drawer-body {
      flex: 1;
      width: 100%;
      overflow: auto;
      padding: 24px;
      box-sizing: border-box;
    }
    .form-drawer_footer {
      border-top: 1px solid #e2e2e2;
      height: 64px;
      background: #ffffff;
      box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      padding: 0 16px;
      z-index: 9;
    }
    .radio-group-box {
      display: flex;
      span {
        // width: 140px;
        flex-shrink: 0;
        color: rgba(25, 31, 36, 0.64);
      }
      .el-radio {
        margin-bottom: 15px;
      }
    }
    .schedule-edit-date-picker {
      overflow: hidden;
      .el-date-editor.el-input, .el-date-editor.el-input__inner {
        float: left;
        width: 46.6%;
      }
    }

    .small-line {
      float: left;
      width: 8px;
      margin: 0 8px;
      height: 32.666667px * $sc;
      position: relative;
      i {
        width: 8px;
        height: 2px;
        background: rgba(25, 31, 36, 0.48);
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
    &::v-deep {
      .el-date-editor .el-input__inner {
        padding: 0 10px 0 30px;
      }
      .haspadding .el-input__inner {
        padding: 0px 60px 0 10px;

      }
      .haspadding .el-input__suffix-inner {
        margin-top: 2px;
      }

      .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
        margin-left: -10px
      }
      .el-form-item .el-select__tags-text {
        color: #333;
      }
    }
  }
}
@import '@/ui/size/mixin.scss';
@import '@/ui/size/scale.scss';
</style>

<style lang="scss">
.schedule-container {
  .radio-group-box {
    .el-radio-group {
      .el-radio:not(.is-bordered) {
        display: block;
      }
    }
  }
}
</style>
