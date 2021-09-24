
<template>
  <div ref="componentBox" class="component-box">
    <div class="continer-box continer-box-title clearfix">
      <span class="fl info-name">
        {{ componentConfig.label }}
        <span v-if="num!==0" class="tip-num">{{ num }}</span>
      </span>
      <span class="fr info-btn-notext" @click="$router.push('/doAndRead/toDo')">
        <span class="info-btn-notext-icon">
          <el-tooltip class="item" effect="dark" content="更多" placement="bottom">
            <icon-svg name="gengduo" />
          </el-tooltip>
        </span>
      </span>
      <span class="fr info-btn-notext" @click="refreshFn">
        <span class="info-btn-notext-icon">
          <el-tooltip class="item" effect="dark" content="刷新" placement="bottom">
            <icon-svg name="shuaxin" />
          </el-tooltip>
        </span>
      </span>
      <span class="fr info-btn-notext">
        <span class="info-btn-notext-icon"><icon-svg name="shaixuan" /></span>
        <div v-if="filterList.length>1" class="select-list">
          <div
            v-for="item in filterList"
            :key="item"
            :class="{'active': item===businessType}"
            @click="filterClickFn(item)"
          >
            {{ item }}
          </div>
        </div>
      </span>
    </div>
    <div v-if="list.length>0" class="component-box-cont upcoming">
      <a v-for="item in list" :key="item.todoId" class="item" :href="item.pcUrl" target="_blank">
        <div class="left">
          <span class="title ell" :class="{'danger':item.overdueDays||item.adventDays}">
            {{ item.todoTitle }}
          </span>
          <span v-if="item.urgentLevel===3" class="status red"><icon-svg name="teji1" />特急</span>
          <span v-else-if="item.urgentLevel===2" class="status orange"><icon-svg name="teji1" />加急</span>
          <span v-if="item.isCare" class="status red"><icon-svg name="guanzhugongzuo1" /></span>
          <span v-if="item.overdueDays" class="status red"><icon-svg name="yuqi" />逾期{{ item.overdueDays }}天</span>
          <span v-for="(t,index) in toJson(item.label)" :key="index" class="status" :style="obj(t.color)">{{ t.name }}</span>
        </div>
        <div class="right">
          <span class="type" :title="item.businessType">{{ item.businessType }}</span>
          <span v-if="item.sendTime" class="date" :class="{'vh':!item.sendTime}">{{ item.sendTime | day }}</span>
          <span class="hide" @click.prevent="hideFn(item.todoUserId)">隐藏</span>
        </div>
      </a>
    </div>
    <div v-else class="empty">
      <img :src="tipIcon" alt="" class="icon">
      <div class="text">您很勤奋，没有要待办的事项</div>
    </div>
  </div>
</template>

<script>
// category: 1-待办；2-已办；3-待阅；4-已阅；5-已办和已阅
import iconSvg from '@/components/icon-svg'
import calc from './../dragHome/calc'
import formatDate from '@/utils/format-date'
import routeToNewTab from '@/mixins/routeToNewTab'
export default {
  name: 'Todo',
  components: {
    iconSvg
  },
  filters: {
    day (value) {
      return formatDate(value, 'yyyy-MM-dd')
    },
    dayHour (value) {
      return formatDate(value, 'yyyy-MM-dd hh:mm')
    }
  },
  mixins: [routeToNewTab],
  props: {
    blockConfig: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      componentConfig: {
        label: '待办'
      },
      tipIcon: require('@/assets/home/components/tipIcon.png'),
      list: [],
      pageNum: 1,
      pageSize: 10,
      num: 0,
      tabActiveName: 'upcoming',
      businessType: '全部',
      filterList: ['全部'],
      itemH: 40,
      colNum: 1
    }
  },
  mounted () {
    if (this.blockConfig && JSON.stringify(this.blockConfig) !== '{}' && this.blockConfig.config) {
      this.componentConfig = this.blockConfig.config
    }
    // console.log(this.componentConfig)
    this.resize()
    this.filterListFn()
  },
  methods: {
    toJson (str) {
      return JSON.parse(str)
    },
    obj (color) {
      return {
        'border': `1px solid rgba(${color}, 1)`,
        'border-radius': '2px',
        'padding': '0 7px',
        'color': `rgba(${color}, 1)`
      }
    },
    updateConfig (data) {
      // console.log(data)
      this.componentConfig.label = data.title
    },
    todoFn (params) {
      // console.log(params)
      this.$api('home.todoList', {
        ...params
      }).then(res => {
        // console.log(res)
        this.list = res.data
        // console.log(res.total)
        this.$emit('updateNum', res.total, 'Upcoming')
        this.num = res.total
        this.pageNum = params.pageNum
        // 动态处理分页禁用
        // this.disablePageFn(res.total, params.pageNum, params.pageSize)
      })
    },
    filterListFn () {
      this.$api('home.dictionaryFilter').then(res => {
        if (res.data) { this.filterList = [...this.filterList, ...res.data] }
      })
    },
    resize (PBlockW, PBlockH) {
      // console.log('待办')
      // 动态计算数据条数
      const itemH = this.itemH
      const colNum = this.colNum
      // const blockH = PBlockH || (this.$refs.componentBox.offsetHeight - 55 - 10)
      const blockH = PBlockH || (this.blockConfig.blockH - 55 - 10)
      // console.log(itemH, colNum, blockH)
      // console.log(blockH)
      this.pageSize = calc(itemH, colNum, blockH)
      // console.log(this.pageSize)
      this.todoFn({
        category: 1,
        showState: 1,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      })
      // console.log(itemH, colNum, blockH)
    },
    countFn () {
      this.$api('home.todoCount').then(res => {
        res.data && res.data.forEach(ele => {
          if (ele && ele.category) {
            switch (ele.category) {
              case 1:
                this.upcoming.number = ele.count
                return
              case 2:
                this.toBeRead.number = ele.count
                return
            }
          }
        })
      })
    },
    filterClickFn (value) {
      let businessType
      if (value !== '全部') {
        this.businessType = value
        businessType = value
      }
      this.todoFn(
        {
          category: 1,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          showState: 1,
          businessType
        })
    },
    refreshFn () {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        category: 1,
        showState: 1
      }
      this.todoFn(params)
    },
    hideFn (id) {
      // this.upcoming.data = this.upcoming.data.filter(ele => {
      //   return ele.todoId !== id
      // })
      this.$confirm('是否隐藏当前待办?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api('home.todoHide', { todoUserId: id, showType: 'HIDE' }).then(res => {
          let businessType = this.businessType
          if (this.businessType === '全部') {
            businessType = undefined
          }
          const params = {
            pageNum: 1,
            pageSize: 10,
            businessType,
            category: 1,
            showState: 1
          }
          this.todoFn(params)
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import './Upcoming.scss'
</style>
