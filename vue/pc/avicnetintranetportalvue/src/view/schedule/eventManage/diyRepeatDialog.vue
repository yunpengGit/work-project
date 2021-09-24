<template>
  <div>
    <el-dialog
      title="自定义重复方式"
      width="600px"
      :visible="dialogVisiable"
      :modal="false"
      @update:visible="visibaleChange"
    >
      <div>
        <el-form ref="form" :model="recurrenceRule" label-position="left">
          <el-form-item label="重复频率：" :label-width="formLabelWidth">
            <div>
              <span style="margin-right: 12px">每</span><el-input-number
                v-model="recurrenceRule.interval"
                :min="1"
                :step="1"
                controls-position="right"
                style="width: 80px; margin-right: 12px"
              />
              <el-select
                v-model="recurrenceRule.freq"
                style="width: 60px; margin-right: 12px"
              >
                <el-option
                  v-for="item in freqArr"
                  :key="item.value"
                  :label="item.title"
                  :value="item.value"
                />
              </el-select>
              <el-select
                v-if="recurrenceRule.freq === 'MONTHLY'"
                v-model="recurrenceRule.monthlyType"
                style="width: 160px"
              >
                <el-option
                  v-for="item in setMonthArr"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div v-if="recurrenceRule.freq === 'WEEKLY'" class="week-list">
              <span
                v-for="item in weekArr"
                :key="item.value"
                :class="{
                  active: recurrenceRule.weeklyByDays.includes(item.value),
                }"
                @click="selectWeekly(item.value)"
              >{{ item.name }}</span>
            </div>
          </el-form-item>
          <el-form-item label="结束重复：" :label-width="formLabelWidth">
            <div>
              <el-select
                v-model="recurrenceRule.endType"
                style="width: 130px; margin-right: 12px"
                @change="endTypeChange"
              >
                <el-option
                  v-for="item in endTypeArr"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
              <el-date-picker
                v-if="recurrenceRule.endType === 'UNTIL'"
                v-model="recurrenceRule.until"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                prefix-icon="el-icon-date"
                :clearable="false"
                style="width: 140px"
              />
              <span v-if="recurrenceRule.endType === 'COUNT'">
                <el-input-number
                  v-model="recurrenceRule.count"
                  :min="1"
                  :step="1"
                  controls-position="right"
                  style="width: 80px; margin-right: 12px"
                />次后
              </span>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visibaleChange(false)">取消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dayjs from 'dayjs'
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    value: Object,
    dialogVisiable: {
      type: Boolean,
      default: false
    },
    startTime: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Date,
      default: new Date()
    }
  },
  data () {
    return {
      formLabelWidth: '90px',
      recurrenceRule: {
        recurr: false, // 是否进行重复
        freq: null, // 重复类型
        interval: null, // 重复间隔
        weeklyByDays: [], // 按周重复
        monthlyType: null, // 按月重复
        monthlyByDay: null,
        endType: null, //	截止类型
        count: null, // 发生X次后结束
        until: null // 直到某天截止
      },
      freqArr: [
        { title: '天', value: 'DAILY' },
        { title: '周', value: 'WEEKLY' },
        { title: '月', value: 'MONTHLY' },
        { title: '年', value: 'YEARLY' }
      ],
      weekArr: [
        {
          name: '日',
          value: 'SU'
        },
        {
          name: '一',
          value: 'MO'
        },
        {
          name: '二',
          value: 'TU'
        },
        {
          name: '三',
          value: 'WE'
        },
        {
          name: '四',
          value: 'TH'
        },
        {
          name: '五',
          value: 'FR'
        },
        {
          name: '六',
          value: 'SA'
        }
      ],
      endTypeArr: [
        {
          name: '无限重复',
          value: 'NEVER'
        },
        {
          name: '限定重复次数',
          value: 'COUNT'
        },
        {
          name: '终止于某天',
          value: 'UNTIL'
        }
      ]
    }
  },
  computed: {
    getMonthWeek () {
      const day = new Date(this.startTime).getDate()
      return Math.floor((day - 1) / 7) + 1
    },
    setMonthArr () {
      const interval =
        this.recurrenceRule.interval === 1 ? '' : this.recurrenceRule.interval
      const monthArr = [
        {
          value: 'SAME_DATE',
          name: `每${interval}月的${new Date(this.startTime).getDate()}日`
        },
        {
          value: 'SAME_POS_WEEKDAY',
          name: `每${interval}月的第${this.getMonthWeek}个周${
            this.weekArr[new Date(this.startTime).getDay()].name
          }`
        }
      ]
      return monthArr
    }
  },
  watch: {
    dialogVisiable (val) {
      if (val) {
        this.recurrenceRule = JSON.parse(JSON.stringify(this.value))
        if (this.recurrenceRule.until) {
          this.recurrenceRule.until = dayjs(this.recurrenceRule.until).format(
            'YYYY-MM-DD'
          )
        }
        if (this.recurrenceRule.freq !== 'MONTHLY') {
          this.recurrenceRule.monthlyType = 'SAME_DATE'
        }
        if (this.recurrenceRule.freq !== 'WEEKLY') {
          this.recurrenceRule.weeklyByDays = [
            this.weekArr[new Date().getDay()].value
          ]
        }
      }
    }
  },
  created () {},
  mounted () {},
  methods: {
    selectWeekly (val) {
      const i = this.recurrenceRule.weeklyByDays.findIndex((item) => {
        return item === val
      })
      if (i > -1) {
        this.recurrenceRule.weeklyByDays.splice(i, 1)
      } else {
        this.recurrenceRule.weeklyByDays.push(val)
      }
    },
    endTypeChange () {
      if (
        this.recurrenceRule.endType === 'COUNT' &&
        !this.recurrenceRule.count
      ) {
        this.recurrenceRule.count = 1
      }
      if (
        this.recurrenceRule.endType === 'UNTIL' &&
        !this.recurrenceRule.until
      ) {
        this.recurrenceRule.until = dayjs().format('YYYY-MM-DD')
      }
    },
    visibaleChange (val) {
      this.$emit('update:dialog-visiable', val)
    },
    // 弹框确定事件
    confirm () {
      this.visibaleChange(false)
      this.dialogClosed()
    },
    dialogClosed () {
      this.recurrenceRule.recurr = true
      this.$emit('refreshRule', this.recurrenceRule)
    }
  }
}
</script>

<style lang="scss" scoped>
.week-list {
  margin-top: 10px;
  display: flex;
  span {
    width: 36px;
    height: 24px;
    border-radius: 4px;
    text-align: center;
    font-size: 13px;
    line-height: 24px;
    margin: 0 2px;
    color: rgba(25, 31, 36, 0.64);
    background: rgba(25, 31, 36, 0.08);
    cursor: pointer;
    &.active {
      background: #1e89ff;
      color: #fff;
    }
  }
}

::v-deep {
  .el-form-item__label {
    color: rgba(25, 31, 36, 0.64);
  }
}
</style>
