
<template>
  <div ref="componentBox" class="component-box">
    <div class="continer-box continer-box-title clearfix">
      <span class="fl info-name">
        {{ componentConfig.label }}
        <span v-if="num!==0" class="tip-num">{{ num }}</span>
      </span>
      <span class="fr info-btn-notext" @click="$router.push('/doAndRead/toRead')">
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
      <span class="fr info-btn" @click="readAllFn">
        <span class="info-btn-icon">全部已阅</span>
      </span>
    </div>
    <div v-if="list.length>0" class="component-box-cont upcoming toBeRead">
      <a v-for="item in list" :key="item.todoId" class="item" :href="item.pcUrl" target="_blank" @click="readFn(item.todoUserId)">
        <div class="left">
          <span class="title ell">{{ item.todoTitle }}</span>
        </div>
        <div class="right">
          <span class="type">{{ item.businessType }}</span>
          <span class="date" :class="{'vh':!item.sendTime}">{{ item.sendTime | dayHour }}</span>
          <!-- <span v-if="item.sendTime" class="date">{{ item.sendTime | dayHour }}</span> -->
        </div>
      </a>
    </div>
    <div v-else class="empty">
      <img :src="tipIcon" alt="" class="icon">
      <div class="text">您很勤奋，没有要待阅的事项</div>
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
        label: '待阅'
      },
      tipIcon: require('@/assets/home/components/tipIcon.png'),
      list: [],
      pageNum: 1,
      pageSize: 10,
      num: 0,
      itemH: 40,
      colNum: 1
    }
  },
  mounted () {
    if (this.blockConfig && JSON.stringify(this.blockConfig) !== '{}' && this.blockConfig.config) {
      this.componentConfig = this.blockConfig.config
    }
    this.resize()
  },
  methods: {
    todoFn (params) {
      this.$api('home.todoList', {
        ...params
      }).then(res => {
        // console.log(res)
        this.list = res.data
        this.$emit('updateNum', res.total, 'ToBeRead')
        this.num = res.total
        this.pageNum = params.pageNum
      })
    },
    resize (PBlockW, PBlockH) {
      // console.log('待阅')
      // 动态计算数据条数
      const itemH = this.itemH
      const colNum = this.colNum
      const blockH = PBlockH || this.blockConfig.blockH - 55 - 10
      this.pageSize = calc(itemH, colNum, blockH)
      this.todoFn({
        category: 3,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      })
    },
    refreshFn () {
      const params = {
        category: 3,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.todoFn(params)
    },
    readFn (todoUserId) {
      this.$api('home.read', { todoUserId })
      const params = {
        category: 3,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.todoFn(params)
    },
    readAllFn () {
      this.$api('home.readAll').then(res => {
        this.refreshFn()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__header{
  visibility: hidden;
}
@import './Upcoming.scss'
</style>
