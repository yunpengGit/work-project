<template>
  <div class="form-drawer-container">
    <div class="form-drawer-body">
      <el-form ref="form" :model="form" label-position="left">
        <el-form-item
          label="日程标题："
          :label-width="formLabelWidth"
          prop="subject"
        >
          <p class="p-item-group">{{ form.subject }}</p>
        </el-form-item>

        <el-form-item
          label="日程类型："
          :label-width="formLabelWidth"
          prop="lable"
        >
          <p class="p-item-group">{{ form.labelName }}</p>
        </el-form-item>

        <el-form-item label="日程时间：" :label-width="formLabelWidth">
          <p class="p-item-group">
            {{ getShowDate }}
          </p>
        </el-form-item>

        <el-form-item
          v-if="form.userPermsType === 'READWRITE'"
          label="日程提醒："
          :label-width="formLabelWidth"
          prop="alarmTypes"
        >
          <p class="p-item-group">{{ getAlarmTypes }}</p>
        </el-form-item>

        <el-form-item
          v-if="form.userPermsType === 'READWRITE'"
          label="日程重复："
          :label-width="formLabelWidth"
        >
          <p class="p-item-group">
            {{ getRecurrenceRule() }}
          </p>
        </el-form-item>

        <el-form-item
          v-if="form.location"
          label="日程地点："
          :label-width="formLabelWidth"
        >
          <p class="p-item-group">{{ form.location }}</p>
        </el-form-item>

        <el-form-item
          v-if="form.userPermsType === 'READWRITE'"
          label="日程所有者："
          :label-width="formLabelWidth"
        >
          <p class="p-item-group">{{ form.ownerName }}</p>
        </el-form-item>

        <el-form-item label="公开范围：" :label-width="formLabelWidth">
          <p class="p-item-group">{{ authorityTypeObj[form.authorityType] }}</p>
        </el-form-item>

        <el-form-item
          v-if="form.content"
          label="日程描述："
          :label-width="formLabelWidth"
        >
          <p class="p-item-group textarea">{{ form.content }}</p>
        </el-form-item>

        <el-form-item
          v-if="showCreator"
          label="创建人："
          :label-width="formLabelWidth"
        >
          <p class="p-item-group">{{ form.creatorName }}</p>
        </el-form-item>
        <el-form-item
          v-if="showCreator"
          label="创建时间："
          :label-width="formLabelWidth"
        >
          <p class="p-item-group">{{ form.createdTime }}</p>
        </el-form-item>
      </el-form>
    </div>
    <div class="form-drawer_footer">
      <el-button
        v-if="form.relationUrl"
        type="primary"
        @click="relationUrl(form.relationUrl)"
      >查看日程来源</el-button>
      <el-button @click="detailDrawerClose">取消</el-button>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
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
    showCreator: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formLabelWidth: '120px',
      form: {
        subject: '',
        content: '',
        wholeDay: false,
        startTime: new Date(),
        finishTime: new Date(),
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
      authorityTypeObj: {
        DEFAULT: '分享可见',
        PRIVATE: '私密'
      }
    }
  },
  computed: {
    getAlarmTypes () {
      const alarmTypesArr = [
        {
          name: '不提醒',
          value: 'NO'
        },
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
        },
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
      ]
      const arr = []
      if (this.form.alarmTypes && this.form.alarmTypes.length) {
        this.form.alarmTypes.forEach((ele) => {
          const item = alarmTypesArr.find((e) => {
            return e.value === ele
          })
          if (item) {
            arr.push(item.name)
          }
        })
        return arr.join(',')
      } else {
        return ''
      }
    },

    getMonthWeek () {
      const day = new Date(this.form.startTime).getDate()
      return Math.floor((day - 1) / 7) + 1
    },
    getWeekValue () {
      const value = weekArr[new Date(this.form.startTime).getDay()].value
      return value
    },
    // 是否跨天
    isLongDay () {
      const stime = dayjs(this.form.startTime).format('YYYY-MM-DD')
      const ftime = dayjs(this.form.finishTime).format('YYYY-MM-DD')
      const isLong = stime !== ftime
      return isLong
    },
    getShowDate () {
      // 跨天
      if (this.isLongDay) {
        const st = dayjs(this.form.startTime).format(
          this.form.wholeDay ? 'YYYY年MM月DD日' : 'YYYY年MM月DD日 HH:mm'
        )
        const ft = dayjs(this.form.finishTime).format(
          this.form.wholeDay ? 'YYYY年MM月DD日' : 'YYYY年MM月DD日 HH:mm'
        )
        return `${st} ~ ${ft}`
      } else {
        const d_str = `日一二三四五六`
        const date = dayjs(this.form.startTime)
        const date2 = dayjs(this.form.finishTime)
        const afterStr = this.form.wholeDay
          ? ' 全天'
          : ` ${date.format('HH:mm')} ~ ${date2.format('HH:mm')}`
        return (
          date.format('MM月DD日 星期') +
          d_str.slice(date.day(), date.day() + 1) +
          afterStr
        )
      }
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.getEventInfo()
      }
    }
  },
  created () {
    this.getEventInfo()
  },
  mounted () {},
  methods: {
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

          // 重复处理一下时间
          if (resData.recurrenceRule.recurr) {
            // 针对重复日程，对日期进行处理，不能显示发布时候的日期
            const date =
              this.eventDate || dayjs(this.form.startTime).format('YYYY-MM-DD')
            resData.startTime = resData.wholeDay
              ? `${date}`
              : `${date} ${new Date(resData.startTime).getHours()}:${
                new Date(resData.startTime).getMinutes() || '00'
              }`
            resData.finishTime = resData.wholeDay
              ? `${date}`
              : `${date} ${new Date(resData.finishTime).getHours()}:${
                new Date(resData.finishTime).getMinutes() || '00'
              }`
          }

          this.form = { ...resData }
        } else {
          this.$message.error(res.msg || '发生未知错误')
        }
      })
    },

    getRecurrenceRule () {
      if (!this.form.recurrenceRule) return ''
      const rule = this.form.recurrenceRule
      if (!rule.recurr) return '不重复'
      if (rule.interval === 1 && rule.endType === 'NEVER') {
        // 是否是工作日
        if (
          rule.freq === 'WEEKLY' &&
          rule.weeklyByDays.length === 5 &&
          !rule.weeklyByDays.includes('SU') &&
          !rule.weeklyByDays.includes('SA')
        ) {
          return '每个工作日（周一至周五）'
        }
        // 是否是每天
        if (rule.freq === 'DAILY') {
          return '每天'
        }
        // 是否是每周
        if (
          rule.freq === 'WEEKLY' &&
          rule.weeklyByDays.length === 1 &&
          rule.weeklyByDays.includes(this.getWeekValue)
        ) {
          return '每周'
        }
        // 是否是每月
        if (rule.freq === 'MONTHLY' && rule.monthlyType === 'SAME_DATE') {
          return '每月'
        }
        // 是否是每年
        if (rule.freq === 'YEARLY') {
          return '每年'
        }
      }
      return this.getDiyName(rule)
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
          return `每${interval}周的${arr.join(',')}，${diyName}`
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

    // 抽屉关闭
    detailDrawerClose () {
      this.$emit('detailDrawerClose')
    },
    relationUrl (url) {
      window.open(url)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-drawer-container {
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
      width: 140px;
      flex-shrink: 0;
      color: rgba(25, 31, 36, 0.64);
    }
    .el-radio {
      margin-bottom: 15px;
    }
  }
  .small-line {
    width: 8px;
    height: 2px;
    background: rgba(25, 31, 36, 0.48);
    margin: 0 8px;
  }
}
.p-item-group {
  min-height: 20px;
  height: auto;
  line-height: 20px;
  background: rgba(25, 31, 36, 0.08);
  border-radius: 4px;
  padding: 7px 12px;
  word-break: break-all;
  &.textarea {
    min-height: 100px;
    height: auto;
  }
}
</style>
