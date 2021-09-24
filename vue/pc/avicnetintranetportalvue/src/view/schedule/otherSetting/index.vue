<template>
  <div class="main-container">
    <div class="main">
      <div class="table-wrap">
        <el-form ref="form" :model="form" label-position="left">
          <el-form-item label="非全天日程提醒：" :label-width="formLabelWidth">
            <el-select
              v-model="form.nonWholeDayAlarmType"
              placeholder="请选择"
              :style="{ width: '120px' }"
              @change="saveSetting({ nonWholeDayAlarmType: $event })"
            >
              <el-option
                v-for="item in nonWholeDayAlarmTypeArr"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
            <div class="tip">创建非全天日程时，默认的提醒时间</div>
          </el-form-item>
          <el-form-item label="全天日程提醒：" :label-width="formLabelWidth">
            <el-select
              v-model="form.wholeDayAlarmType"
              placeholder="请选择"
              :style="{ width: '180px' }"
              @change="saveSetting({ wholeDayAlarmType: $event })"
            >
              <el-option
                v-for="item in wholeDayAlarmTypeArr"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
            <div class="tip">创建全天日程时，默认的提醒时间</div>
          </el-form-item>
          <el-form-item label="日程默认时长：" :label-width="formLabelWidth">
            <el-select
              v-model="form.durationType"
              placeholder="请选择"
              :style="{ width: '120px' }"
              @change="saveSetting({ durationType: $event })"
            >
              <el-option
                v-for="item in durationTypeArr"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
            <div class="tip">创建日程时，默认的时间长度</div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// import api from "@/api";
export default {
  components: {},
  props: {},
  data () {
    return {
      title: '其他设置',
      formLabelWidth: '160px',
      form: {
        nonWholeDayAlarmType: '', // 非全天日程提醒类型
        wholeDayAlarmType: '', // 全天日程提醒类型
        durationType: '', // 日程默认时长
        firstDay: '', // 每周的第一天
        otherCalendarType: 'NO' // 其他历法
      },
      nonWholeDayAlarmTypeArr: [
        {
          name: '不提醒',
          value: 'NO'
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
      ],
      wholeDayAlarmTypeArr: [
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
        }
      ],
      durationTypeArr: [
        {
          value: '15MINS',
          name: '15分钟'
        },
        {
          value: '30MINS',
          name: '30分钟'
        },
        {
          value: '45MINS',
          name: '45分钟'
        },
        {
          value: '60MINS',
          name: '60分钟'
        },
        {
          value: '90MINS',
          name: '90分钟'
        },
        {
          value: '120MINS',
          name: '120分钟'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getUserSetting()
  },
  mounted () {},
  methods: {
    // 获取用户默认设置
    getUserSetting () {
      this.$api('schedule.getUserSetting')
        .then((res) => {
          if (res.code === 200) {
            const data = res.data
            this.form = { ...data }
          } else {
            this.$message.error(res.msg || '发生未知错误')
          }
        })
        .catch(() => {})
    },
    /**
     * 保存用户设置
     * @param params 更改项
     */
    saveSetting (params) {
      this.$api('schedule.putUserSetting', params).then((res) => {
        if (res.code === 200) {
          this.$message.success('设置成功')
        } else {
          this.$message.error(res.msg || '发生未知错误')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main-container {
  height: 100%;
  .main {
    background: #fff;
    width: 100%;
    overflow: auto;
    box-sizing: border-box;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
    border-radius: 4px;
    .search-box-wrap {
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 10px solid #f1f1f1;
    }

    .table-wrap {
      padding: 20px;
    }
    .tip {
      font-size: 12px;
      color: rgba(25, 31, 36, 0.48);
      line-height: 16px;
      margin-top: 5px;
    }
  }
}
</style>
