<template>
  <div class="schedule-container">
    <div class="main">
      <div class="table-wrap">
        <div class="head-oprations">
          <div class="head-item haswidth">
            <div class="add-group">
              <el-button
                type="primary"
                icon="el-icon-plus"
                style="box-shadow: 0px 3px 8px 0px rgba(30, 137, 255, 0.3)"
                @click="addEvent(null)"
              ><span>新增日程</span></el-button>
            </div>
            <!-- <el-button>导入数据</el-button>
            <el-button>导出数据</el-button> -->
            <el-radio-group
              v-model="type"
              class="head-radio-group"
            >
              <el-radio-button :label="2">月</el-radio-button>
              <el-radio-button :label="1">列表</el-radio-button>
            </el-radio-group>
            <el-button class="today-btn" :disabled="isSameDate('YYYY-MM-DD')" :type="isSameDate('YYYY-MM')?'':'primary'" @click="goNext(0)">今天</el-button>
          </div>
          <div v-show="type === 2" class="head-time head-item">
            <i class="el-icon-arrow-left" @click="goNext(1)" />
            <span>{{ timeTitle }}</span>
            <i class="el-icon-arrow-right" @click="goNext(2)" />
          </div>
          <div class="head-item" style="text-align: right">
            <el-input
              v-model="params.fuzzySearchText"
              prefix-icon="el-icon-search"
              placeholder="搜索日程标题、地点、描述"
              clearable
              class="calendar-filter-input"
            />
          </div>
        </div>
        <div class="table-body">
          <div style="height: 100%" class="clearfix">
            <div class="left-list-box">
              <small-calendar
                ref="smallcalendar"
                :active-date="selectedDate"
                :index-type="type"
                :filters="params"
                @dateChange="dateChange1"
                @calendarChange="calendarChange"
                @startDateChange="startDateChange"
                @endDateChange="endDateChange"
              />
              <div class="el-menu-box">
                <div
                  v-for="item in filters"
                  :key="item.value"
                  class="menu-item"
                  :class="{ active: (params.queryRangeType === item.value) && scheduleChecked}"
                  @click="scheduleTypeChange(item.value)"
                >
                  <icon-svg :name="item.icon" />
                  <span>{{ item.text }}</span>
                </div>
              </div>
              <div class="user-list-box">
                <div v-if="editList.length" class="user-list-group">
                  <div class="group-title">
                    <span>编辑权限</span><i
                      :class="`el-icon-caret-${writeArrow}`"
                      @click="
                        writeArrow = writeArrow === 'bottom' ? 'top' : 'bottom'
                      "
                    />
                  </div>
                  <div
                    class="group-content"
                    :style="getReadWriteGroup('writeArrow')"
                  >
                    <div
                      v-for="item in editList"
                      :key="item.sharerId"
                      class="user-box"
                      :class="{ active: params.ownerIdsIn[0] === item.sharerId }"
                      @click="sharerChange(item.sharerId)"
                    >
                      <el-avatar :src="item.sharerPhoto" />
                      <div>
                        <h6>{{ item.sharerUserName }}</h6>
                        <p>{{ getDepartment(item) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="readList.length" class="user-list-group">
                  <div class="group-title">
                    <span>查阅权限</span><i
                      :class="`el-icon-caret-${readArrow}`"
                      @click="
                        readArrow = readArrow === 'bottom' ? 'top' : 'bottom'
                      "
                    />
                  </div>
                  <div
                    class="group-content"
                    :style="getReadWriteGroup('readArrow')"
                  >
                    <div
                      v-for="item in readList"
                      :key="item.sharerId"
                      class="user-box"
                      :class="{ active: params.ownerIdsIn[0] === item.sharerId }"
                      @click="sharerChange(item.sharerId)"
                    >
                      <el-avatar :src="item.sharerPhoto" />
                      <div>
                        <h6>{{ item.sharerUserName }}</h6>
                        <p>{{ getDepartment(item) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <event-list
              v-if="type === 1"
              ref="eventList"
              :filters="params"
              :edit-list="editList"
              :start-date="startDate"
              :end-date="endDate"
              @dateChange="dateChange"
              @editEvent="editEvent"
              @addEvent="addEvent"
              @detailEvent="detailEvent"
            />
            <calendar
              v-else
              ref="calendar"
              @editEvent="editEvent"
              @addEvent="addEvent"
              @formDrawerClose="formDrawerClose"
              @detailEvent="detailEvent"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="edit-form">
      <el-drawer
        :title="formTitle"
        direction="rtl"
        :visible.sync="formDrawer"
        destroy-on-close
        size="640px"
      >
        <edit-form
          :event-id="eventId"
          :event-date="eventDate"
          :value="formDrawer"
          :add-date="addDate"
          @formDrawerClose="formDrawerClose"
        />
      </el-drawer>
    </div>
    <div class="edit-form">
      <el-drawer
        title="日程详情"
        direction="rtl"
        :visible.sync="detailDrawer"
        size="30%"
        @close="detailDrawerClose"
      >
        <detail-form
          :event-id="eventId"
          :event-date="eventDate"
          :value="detailDrawer"
          @detailDrawerClose="detailDrawerClose"
        />
      </el-drawer>
    </div>
  </div>
</template>

<script>
import editForm from './edit'
import detailForm from './detail'
import eventList from './eventList'
import smallCalendar from './smallCalendar'
import calendar from './calendar'
import formatDate from '@/utils/format-date'
import dayjs from 'dayjs'
import iconSvg from '@/components/icon-svg'
export default {
  components: {
    editForm,
    eventList,
    smallCalendar,
    calendar,
    detailForm,
    iconSvg
  },
  props: {},
  data () {
    return {
      // 所有日程/我的日程/全部分享 样式是否可变
      scheduleChecked: true,
      // 当页日历的开始日期
      startDate: '',
      // 当页日历的结束日期
      endDate: '',
      type: 2, // 列表展示效果 1=>列表， 2=>月
      formDrawer: false,
      detailDrawer: false,
      eventId: null,
      eventDate: null,
      addDate: null,
      typeArr: ['today', 'prev', 'next'],
      selectedDate: new Date(),
      userList: [],
      filters: [
        {
          text: '所有日程',
          value: 'ALL',
          icon: 'suoyou'
        },
        {
          text: '我的日程',
          value: 'MY_ONLY',
          icon: 'zhuchiren'
        },
        {
          text: '全部分享',
          value: 'ALL_SHARING',
          icon: 'gongxiangricheng'
        }
      ],
      params: {
        fuzzySearchText: '',
        queryRangeType: 'ALL', // ALL-所有日程；MY_ONLY-我的日程；ALL_SHARING-全部共享；不传表示所有范围
        ownerIdsIn: [] // 所属人ID
      },
      writeArrow: 'bottom',
      readArrow: 'bottom'
    }
  },
  computed: {
    formTitle () {
      const title = this.eventId ? '修改日程' : '新建日程'
      return title
    },
    timeTitle () {
      const title = formatDate(this.selectedDate, 'yyyy年MM月')
      return title
    },
    editList () {
      const arr = []
      this.userList.forEach((ele) => {
        if (ele.permsType === 'READWRITE') {
          arr.push(ele)
        }
      })
      return arr
    },
    readList () {
      const arr = []
      this.userList.forEach((ele) => {
        if (ele.permsType === 'READONLY') {
          arr.push(ele)
        }
      })
      return arr
    }
  },
  watch: {
    type: {
      handler (newVal) {
        if (newVal === 2) {
          this.dateChange1(new Date())
        }
      }
    },
    params: {
      handler (newValue, oldValue) {
        if (this.type === 2) {
          if (this.startDate.length) {
            this.$refs.smallcalendar.getDateEvents(this.startDate, this.endDate)
          } else {
            alert('请稍等，日历还没有加载好')
          }
        } else {
          this.$refs.eventList.initList() // 增加初始化日期
        }
      },
      deep: true
    }
  },
  created () {
    const eventId = this.$route.query.eventId
    const eventDate = this.$route.query.eventDate
    if (eventId && eventDate) {
      this.eventId = eventId
      this.eventDate = eventDate
      this.detailDrawer = true
    }
  },
  mounted () {
    this.getEventAuthAsSubscriber()
  },

  methods: {
    sharerChange (sharerId) {
      this.scheduleChecked = false
      const sharerIdExist = this.params.ownerIdsIn.includes(sharerId)
      if (sharerIdExist) {
        this.$set(this.params, 'ownerIdsIn', [])
      } else {
        this.$set(this.params, 'ownerIdsIn', [sharerId])
      }
      this.$set(this.params, 'queryRangeType', 'ALL')
      // this.params.ownerIdsIn[0] === sharerId ? (this.params.ownerIdsIn = []) : (this.params.ownerIdsIn = [sharerId])
    },
    scheduleTypeChange (scheduleType) {
      this.scheduleChecked = true
      this.$set(this.params, 'queryRangeType', scheduleType)
      this.$set(this.params, 'ownerIdsIn', [])
    },
    startDateChange (date) {
      this.startDate = date
    },
    endDateChange (date) {
      this.endDate = date
    },
    getEventAuthAsSubscriber () {
      const permsTypesIn = ['READONLY', 'READWRITE']
      const useSpecificOrderRule = true
      this.$api('schedule.getEventAuthAsSubscriber', { permsTypesIn, useSpecificOrderRule }).then(
        (res) => {
          if (res.code === 200) {
            this.userList = [...res.data]
          } else {
            this.$message.error(res.msg || '发生未知错误')
          }
        }
      )
    },
    formDrawerClose (refresh) {
      this.formDrawer = false
      if (!refresh) {
        return
      }
      if (this.startDate.length) {
        this.$refs.smallcalendar.getDateEvents(this.startDate, this.endDate)
      } else {
        alert('请稍等，日历还没有加载好')
      }
      // this.$refs.smallcalendar.getDateEvents()
      if (this.type === 1) {
        this.$refs.eventList.initList()
      }
    },
    detailDrawerClose () {
      this.detailDrawer = false
      if (this.$route.query.eventId) {
        this.$router.push('/schedule')
      }
    },

    editEvent (event) {
      if (event.date) {
        this.eventDate = event.date
      } else {
        this.eventDate = dayjs(event.startTime2).format('YYYY-MM-DD')
      }
      this.eventId = event.eventId
      this.formDrawer = true
    },

    detailEvent (event) {
      if (event.date) {
        this.eventDate = event.date
      } else {
        this.eventDate = dayjs(event.startTime2).format('YYYY-MM-DD')
      }
      this.eventId = event.eventId
      this.detailDrawer = true
    },

    addEvent (addDate) {
      if (addDate) {
        this.addDate = addDate
      } else {
        this.addDate = dayjs(this.selectedDate).format('YYYY-MM-DD')
      }
      this.eventId = null
      this.eventDate = null
      this.formDrawer = true
    },

    calendarChange (data) {
      this.$refs.calendar[data === 'right' ? 'prev' : 'next']()
      this.selectedDate = this.$refs.calendar.getDate()
    },

    goNext (index) {
      if (this.type === 2) {
        this.$refs.calendar[this.typeArr[index]]()
        this.selectedDate = this.$refs.calendar.getDate()
      }
      if (this.type === 1) {
        this.dateChange1(new Date())
      }
    },

    // 列表滚动选择日期发生变化
    dateChange (date) {
      if (
        dayjs(this.selectedDate).format('YYYY-MM-DD') !==
        dayjs(date).format('YYYY-MM-DD')
      ) {
        this.selectedDate = dayjs(date).toDate()
      }
    },

    // 日历选择日期发生变化
    dateChange1 (date) {
      if (
        dayjs(this.selectedDate).format('YYYY-MM-DD') !==
        dayjs(date).format('YYYY-MM-DD')
      ) {
        this.selectedDate = date
        if (this.type === 1) {
          this.$refs.eventList.setActiveDate(date)
        }
      }
    },
    isSameDate (format) {
      const selectedDate = dayjs(this.selectedDate).format(format)
      const nowDate = dayjs().format(format)
      return selectedDate === nowDate
    },
    getReadWriteGroup (name) {
      return {
        marginBottom: this[name] === 'bottom' ? '20px' : '0',
        height: this[name] === 'bottom' ? 'auto' : '0',
        overflow: this[name] === 'bottom' ? 'auto' : 'hiddren'
      }
    },
    getDepartment (data) {
      if (!data.sharerOrgs || !data.sharerOrgs.length) return ''
      for (const item of data.sharerOrgs) {
        if (item.type === 2) {
          return item.orgName
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.schedule-container {
  height: 100%;
  .main {
    height: 100%;
    background: #fff;
    width: 100%;
    // overflow: auto;
    overflow: hidden;
    box-sizing: border-box;
    .table-wrap {
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
      border-radius: 4px;
      height: 100%;
      .head-radio-group {
        vertical-align: bottom;
        margin: 0 16px;
        position: relative;
        &::v-deep {
          .el-radio-button__inner {
            width: 44px;
          }
          .el-radio-button__inner {
            padding-left: 0;
            padding-right: 0;
          }
        }
        &::before {
          content: "";
          position: absolute;
          width: 1px;
          height: 56px;
          background: #eef0f4;
          top: -12px;
          left: -18px;
        }
      }
      .today-btn {
        width: 44px;
        padding-left: 0;
        padding-right: 0;
      }
      .table-body {
        border-top: 1px solid #ebeef5;
        height: calc(100% - 80px);
      }
      .head-oprations {
        padding: 12px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .head-item {
          // flex-grow: 1;
          &.haswidth {
            display: flex;
            .add-group {
              width: 255px;
              flex-shrink: 0;
              button {
                background-color: #1E89FF;
              }
              .el-button--small {
                    padding: 8px 17px;
              }
              span {
                font-weight: bold;
              }
            }
          }
          ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
            background-color: #1E89FF;
          }
        }
        .head-time {
          display: flex;
          align-items: center;
          i {
            height: 30px;
            width: 30px;
            font-size: 16px;
            text-align: center;
            line-height: 30px;
            cursor: pointer;
            border-radius: 4px;
            &:hover {
              background: rgba(25, 31, 36, 0.04);
            }
          }
          span {
            font-size: 18px;
            font-weight: 500;
            color: #191f24;
            margin: 0 10px;
          }
        }
        &::v-deep {
          .el-input .el-input__inner {
            padding: 0 30px;
          }
        }
      }
    }
    .left-list-box {
      // border-right: 1px solid #eef0f4;
      width: 270px;
      padding: 0 8px;
      box-sizing: border-box;
      overflow: hidden;
      float: left;
      .el-menu-box {
        border-bottom: 1px solid #eef0f4;
        padding-bottom: 10px;
        .menu-item {
          cursor: pointer;
          height: 40px;
          line-height: 40px;
          padding: 0 18px;
          border-radius: 4px;
          margin-bottom: 2px;
          &:hover,
          &.active {
            background: rgba(25, 31, 36, 0.04);
            span {
            font-size: 15px;
            color: #191f24;
            font-weight: 500;
          }
          }
          svg {
            margin-right: 18px;
          }
          span {
            font-size: 15px;
            color: #191f24;
          }
        }
      }
      .user-list-box {
        height: calc(100% - 400px);
        overflow-y: auto;
        .user-list-group {
          .group-title {
            padding: 16px 0 8px 16px;
            span {
              font-size: 13px;
              color: rgba(25, 31, 36, 0.64);
            }
            i {
              font-size: 16px;
              color: rgba(25, 31, 36, 0.64);
              cursor: pointer;
            }
          }
          .group-content {
            transition: all 0.3s ease-in-out;
            margin-bottom: 20px;
            .user-box {
              display: flex;
              height: 60px;
              border-radius: 4px;
              align-items: center;
              padding: 0 16px;
              cursor: pointer;
              &:hover,
              &.active {
                background: rgba(25, 31, 36, 0.04);
              }
              div {
                margin-left: 12px;
                h6 {
                  margin: 0 0 4px 0;
                  font-size: 15px;
                  color: #191f24;
                }
                p {
                  margin: 0;
                  font-size: 13px;
                  color: rgba(25, 31, 36, 0.64);
                }
              }
            }
          }
        }
      }
    }
  }
  &::v-deep {
    .el-drawer__wrapper .el-drawer__close-btn:active {
      outline: none;
    }
    .el-drawer__wrapper .el-drawer__close-btn i {
      opacity: .8;
    }
  }
}
</style>

<style lang="scss">
@mixin del($sc: 1, $fs: 14px){
  .schedule-container {
    .calendar-filter-input {
      width: 240px * $sc;
    }
  }
}
@import '@/ui/size/mixin.scss';
@import '@/ui/size/scale.scss';
</style>
