<template>
  <div
    v-infinite-scroll="load"
    v-loading="eventLoading"
    class="event-list-box"
    infinite-scroll-disabled="disabled"
    :infinite-scroll-distance="10"
    style="overflow: auto;"
    @scroll="listScroll"
  >
    <div v-for="(item, i) in list" :key="i" class="event-list">
      <div class="event-list-time" :class="{ today: isToday(item.eventDate) }">
        {{ getShowDate(item.eventDate) }}
      </div>
      <div class="event-list-item">
        <div
          v-for="val in item.events"
          :key="val.eventId"
          class="event-item"
          @click="editEvent(val, item.eventDate)"
        >
          <div v-if="val.wholeDay" class="time"><p>全天</p></div>
          <div v-else class="time">
            <p class="st">{{ val.startTime.split(" ")[1] || val.startTime }}</p>
            <p class="ft">
              {{ val.finishTime.split(" ")[1] || val.finishTime }}
            </p>
          </div>
          <div class="line" :class="{ shared: isShared(val) }" />
          <div class="content" :class="{ shared: isShared(val) }">
            <div class="title">
              {{ val.subject || "（无标题）" }}
              <div class="type-box">
                <span v-if="val.authorityType !== 'DEFAULT'" class="el-icon-lock"> 私密日程</span>
              </div>
            </div>
            <div class="other">
              <div>
                <el-tag
                  v-if="!isShared(val) && val.label"
                  effect="plain"
                  :style="{
                    color: val.label.color,
                    borderColor: val.label.color,
                  }"
                >{{ val.label.name }}</el-tag>
                <span v-if="isShared(val) && val.ownerName"><icon-svg name="ren" /> {{ val.ownerName }}</span>
                <span
                  v-if="val.location"
                ><icon-svg name="dizhi" />{{
                  val.location
                }}</span>
              </div>
              <div class="type-box">
                <el-tag
                  v-if="val.timeConflicted"
                  type="danger"
                  effect="dark"
                >时间冲突</el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!list.length" class="no-data">
      <img
        width="310"
        height="206"
        src="../../../assets/calendar/nodata.png"
        alt=""
        srcset=""
      >
      <p>{{ getNodataText.text }}</p>
      <span
        v-if="getNodataText.btn"
        class="btn"
        @click="addEvent"
      ><i class="el-icon-plus" />创建日程</span>
    </div>
    <p v-if="loading" style="text-align: center">加载中...</p>
    <p v-if="noMore && list.length" style="margin-top:10px;text-align: center">没有更多了</p>
  </div>
</template>
<script>
import iconSvg from '@/components/icon-svg'
import { getItem } from '@/utils/storage'
import dayjs from 'dayjs'
export default {
  components: { iconSvg },
  props: {
    filters: {
      type: Object,
      default () {
        return {
          fuzzySearchText: '',
          queryRangeType: 'ALL',
          ownerIdsIn: []
        }
      }
    },
    editList: {
      type: Array,
      default () {
        return []
      }
    },
    startDate: {
      type: String,
      default: ''
    },
    endDate: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      eventLoading: true,
      userInfo: JSON.parse(getItem('userInfo')),
      noMore: false,
      loading: false,
      list: [],
      activeDate: '',
      params: {
        fuzzySearchText: '', // 模糊搜索关键字
        labelIdsIn: [], // 标签id
        dateFrom: '', // 日期范围（开始）yyyy-MM-dd
        dateTo: '', // 日期范围（结束）yyyy-MM-dd
        includeDateFrom: true, // 是否包含dateFrom那天的结果
        includeDateTo: false, // 是否包含dateTo那天的结果
        queryRangeType: 'ALL', // ALL-所有日程；MY_ONLY-我的日程；ALL_SHARING-全部共享；不传表示所有范围
        ownerIdsIn: [], // 所属人ID
        orderByDateAsc: true // 是否按照date升序排列
      },
      // 每次切换搜索条件后 不再重复执行load()
      loadFlag: true
    }
  },
  computed: {
    disabled () {
      return this.loading || this.noMore
    },
    getNodataText () {
      if (
        this.params.fuzzySearchText === '' &&
        (this.params.queryRangeType === 'ALL' ||
          this.params.queryRangeType === 'MY_ONLY') &&
        !this.params.ownerIdsIn.length
      ) {
        return {
          text: '您还没有日程，马上创建一个吧！',
          btn: true
        }
      } else {
        return {
          text: '您还没有相关日程',
          btn: false
        }
      }
    }
  },
  watch: {
    activeDate (newValue, oldValue) {
      this.$emit('dateChange', newValue)
    }
  },
  created () {
    this.activeDate = new Date()
    this.fn = this.resizeHandler()
    this.$nextTick(() => {
      this.fn()
      window.addEventListener('resize', this.fn)
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.fn)
  },
  mounted () {
    // 判断列表盒子里是否存在滚动条，如果存在滚动条需主动获取列表数据
    const container = document.querySelector('.event-list-box')
    if (container.scrollHeight > container.clientHeight) {
      this.initList()
    }
  },
  methods: {
    getDateEvents () {
      const { params } = this
      const subPage = {
        pageNum: 1,
        pageSize: 7
      }
      const subList = Object.assign({}, params, this.filters, subPage)
      this.$api(
        'schedule.getDateEvents',
        subList
      ).then((res) => {
        if (res.code === 200) {
          const resData = res.data
          this.noMore = resData.length < 7
          this.list = [...this.list, ...resData]
          this.loading = false
          this.eventLoading = false
          this.loadFlag = true
          const scheduleDate = {}
          scheduleDate.dateFrom = this.startDate
          scheduleDate.dateTo = this.endDate
          const subParams = Object.assign({}, params, this.filters, scheduleDate)
          this.$api(
            'schedule.getDateEvents',
            subParams
          ).then((result) => {
            if (result.code === 200) {
              this.$store.commit('setCache', {
                key: 'events',
                data: result.data
              })
            } else {
              this.$message.error(result.msg || '发生未知错误')
            }
          })
        } else {
          this.$message.error(res.msg || '发生未知错误')
        }
      })
    },
    load () {
      if (!this.loadFlag) {
        return
      }
      const { params } = this
      if (this.list.length) {
        // 获取当前列表最后的日期作为最新的开始时间
        const date = dayjs(this.list[this.list.length - 1].eventDate)
        params.dateFrom = date.date(date.date() + 1).format('YYYY-MM-DD')
      } else if (!params.dateFrom) {
        // 第一次初始化开始时间
        params.dateFrom = dayjs().format('YYYY-MM-DD')
      }
      params.dateTo = ''
      this.loading = true
      setTimeout(() => {
        this.getDateEvents()
      }, 500)
    },
    getShowDate (eventDate) {
      const d_str = `日一二三四五六`
      const date = dayjs(eventDate)
      return (
        date.format('MM月DD日 星期') + d_str.slice(date.day(), date.day() + 1)
      )
    },
    isToday (eventDate) {
      const date = dayjs(eventDate)
      return date.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
    },
    // 供外部使用设置列表选定时间
    setActiveDate (date) {
      this.activeDate = date
      this.initList()
    },
    // 查询条件发生变化，重新加载数据
    initList () { // 接收传递的日期值
      // console.log(2)
      this.loading = false
      this.noMore = false
      const { params } = this
      params.dateFrom = dayjs(this.activeDate).format('YYYY-MM-DD')
      params.dateTo = ''
      this.eventLoading = true
      this.list = []
      this.loadFlag = false
      this.getDateEvents()
    },
    // 列表滚动
    listScroll () {
      try {
        const { list } = this
        // 根据滚动条高度计算当前活跃时间
        const scrollTop = document.querySelector('.event-list-box').scrollTop
        const liHeight = document.querySelector(
          '.event-list .event-list-item .event-item'
        ).offsetHeight
        const titleHeight = document.querySelector('.event-list-time')
          .offsetHeight
        let j = 0
        let activeDate = ''
        for (let i = 0; i < list.length; i++) {
          const domHeight = list[i].events.length * liHeight + titleHeight
          if (scrollTop >= j) {
            activeDate = list[i].eventDate
          } else {
            break
          }
          j += domHeight
        }
        if (!activeDate) {
          activeDate = list[0].eventDate
        }
        this.activeDate = activeDate
      } catch (e) {
        throw new Error(e)
      }
    },
    // 通过对比所属人userId判断是否共享
    isShared (item) {
      const userId = this.userInfo.userId
      return item.ownerId !== userId
    },
    editEvent (event, date) {
      // 判断日程拥有者是否在拥有编辑权限内
      const i = this.editList.findIndex(e => {
        return e.sharerId === event.ownerId
      })
      const hasEdit = event.selfOwned || i > -1 // 是否拥有编辑权限
      this.$emit(hasEdit ? 'editEvent' : 'detailEvent', { date, ...event })
    },
    addEvent () {
      this.$emit('addEvent')
    },
    // 窗口高度变化重新计算日历区域高度
    resizeHandler () {
      let timer
      return () => {
        if (timer) {
          window.clearTimeout(timer)
        }
        timer = window.setTimeout(() => {
          const windowH = document.documentElement.clientHeight
          const headerH = document.querySelector('.page-frame-header').offsetHeight || 0
          const tagsH = document.querySelector('.tags-view-container').offsetHeight || 0
          const headBoxH = document.querySelector('.page-head-box').offsetHeight || 0
          const headOptionH = document.querySelector('.head-oprations').offsetHeight || 0
          const calendarH = windowH - headerH - tagsH - headBoxH - headOptionH
          document.querySelector('.event-list-box').style.setProperty(
            'height',
            calendarH + 'px'
          )
          // document.querySelector('.event-list-box').setAttribute('--maxHeight', calendarH + 'px')
        }, 100)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.event-list-box {
  width: calc(100% - 286px);
  float: right;
  max-height: var(--maxHeight);
  margin-left: 16px;
  .event-list {
    &-time {
      height: 44px;
      line-height: 44px;
      font-size: 18px;
      font-weight: 500;
      color: #191f24;
      &.today {
        color: #1e89ff;
      }
    }
    &-item {
      .event-item {
        min-height: 40px;
        display: flex;
        align-items: center;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
          background: rgba(25, 31, 36, 0.04);
        }
        .time {
          width: 90px;
          flex-shrink: 0;
          padding: 13px 18px 13px 0;
          box-sizing: border-box;
          color: rgba(25, 31, 36, 0.64);
          font-size: 12px;
          p {
            width: 100%;
            text-align: right;
            &.st {
              margin-bottom: 6px;
            }
            &.ft {
              margin-top: 6px;
            }
          }
        }
        .line {
          width: 2px;
          margin-right: 12px;
          min-height: 40px;
          background: #1e89ff;
          border-radius: 2px;
          &.shared {
            background: #ff8200;
          }
        }
        .content {
          width: calc(100% - 80px);
          padding: 15px 32px 15px 0px;
          border-bottom: 1px solid rgba(25, 31, 36, 0.05);
          box-sizing: border-box;
          .title {
            font-size: 16px;
            color: #191f24;
            margin-bottom: 5px;
            display: flex;
            justify-content: space-between
          }
          .other {
            display: flex;
            align-items: center;
            justify-content: space-between;
            >div{
              display: flex;
            }
            .el-tag {
              font-size: 12px;
              height: 18px;
            }
            svg {
              width: 16px;
              height: 16px;
              margin-right: 3px;
            }
            span {
              display: flex;
              align-items: center;
              font-size: 13px;
              margin-right: 20px;
              color: rgba(25, 31, 36, 0.64);
            }
          }
        }
        .type-box {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          span {
            display: flex;
            align-items: center;
            color: rgba(25, 31, 36, 0.64);
            font-size: 13px;
            &.el-tag {
              color: #fff;
              font-size: 12px;
              margin: 0px;
              height: 18px;
            }
            svg {
              width: 14px;
              margin-right: 2px;
            }
          }
        }
      }
    }
  }
}
.no-data {
  text-align: center;
  padding-top: 140px;
  p {
    font-size: 16px;
    color: rgba(25, 31, 36, 0.72);
    margin: 32px 0;
  }
  .btn {
    width: 150px;
    height: 42px;
    text-align: center;
    line-height: 42px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #1e89ff;
    font-size: 16px;
    font-weight: 500;
    color: #1e89ff;
    cursor: pointer;
  }
}
</style>
