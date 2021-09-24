
<template>
  <div class="br8 home-todo">
    <div class="continer-box continer-box-title clearfix">
      <span class="fl info-name">
        已办
      </span>
      <span class="fr info-btn-notext" @click="moreFn">
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
      <span class="fr info-btn-notext" @click="nextFn">
        <el-tooltip class="item" effect="dark" content="下一页" placement="bottom">
          <span class="info-btn-notext-icon" :class="{'disabled':nextIcon}"><icon-svg name="xiafan" /></span>
        </el-tooltip>
      </span>
      <span class="fr info-btn-notext" @click="prevFn">
        <el-tooltip class="item" effect="dark" content="上一页" placement="bottom">
          <span class="info-btn-notext-icon" :class="{'disabled':prevIcon}"><icon-svg name="shangfan" /></span>
        </el-tooltip>
      </span>
      <span v-if="tabActiveName==='upcoming'" class="fr info-btn-notext">
        <span class="info-btn-notext-icon"><icon-svg name="shaixuan" /></span>
        <div v-if="filterList.length>1" class="select-list">
          <div
            v-for="item in filterList"
            :key="item"
            :class="{'active': item===currentData.businessType}"
            @click="filterClickFn(item)"
          >
            {{ item }}
          </div>
        </div>
      </span>
      <span v-if="tabActiveName==='toBeRead'" class="fr info-btn" @click="readAllFn">
        <span class="info-btn-icon">全部已阅</span>
      </span>
    </div>
    <el-tabs v-model="tabActiveName" @tab-click="tabChange">
      <el-tab-pane name="upcoming">
        <span slot="label">
          待办 <span class="tip-num">{{ upcoming.number }}</span>
        </span>
        <div v-if="upcoming.data.length>0" class="upcoming">
          <a v-for="item in upcoming.data" :key="item.todoId" class="item" :href="item.pcUrl" target="_blank">
            <div class="left">
              <span class="title ell" :class="{'danger':item.overdueDays||item.adventDays}">
                {{ item.todoTitle }}
              </span>
              <span v-if="item.urgentLevel===3" class="status red"><icon-svg name="teji1" />特急</span>
              <span v-else-if="item.urgentLevel===2" class="status orange"><icon-svg name="teji1" />加急</span>
              <span v-if="item.isCare" class="status red"><icon-svg name="guanzhugongzuo1" /></span>
              <span v-if="item.overdueDays" class="status red"><icon-svg name="yuqi" />逾期{{ item.overdueDays }}天</span>
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
      </el-tab-pane>
      <el-tab-pane name="focusWork">
        <span slot="label">
          关注工作
        </span>
        <div v-if="focusWork.data.length>0" class="focusWork">
          <a v-for="item in focusWork.data" :key="item.processInstanceId" class="item" :href="item.careworkUrl" target="_blank">
            <div class="work fix">
              <div class="left">
                <div class="text">
                  <span class="title">{{ item.businessName }}</span>
                </div>
                <div class="info fix">
                  <span class="type">{{ item.businessTypeDesc }}</span>
                  <span class="date">更新时间：{{ item.lastUpdateTime | day }}</span>
                  <span class="doc ell">{{ item.lastOperation }}</span>
                </div>
              </div>
              <div class="right">
                <span class="btn" @click.prevent="cancelCareWorkFn(item.processInstanceId)">取消关注</span>
              </div>
            </div>
          </a>
        </div>
        <div v-else class="empty">
          <img :src="tipIcon" alt="" class="icon">
          <div class="text">没有关注工作</div>
        </div>
      </el-tab-pane>
      <el-tab-pane name="toBeRead">
        <span slot="label">
          待阅 <span class="tip-num">{{ toBeRead.number }}</span>
        </span>
        <div v-if="toBeRead.data.length>0" class="upcoming toBeRead">
          <a v-for="item in toBeRead.data" :key="item.todoId" class="item" :href="item.pcUrl" target="_blank" @click="readFn(item.todoUserId)">
            <div class="left">
              <span class="title ell">{{ item.todoTitle }}</span>
            </div>
            <div class="right">
              <span class="type">{{ item.businessType }}</span>
              <span v-if="item.sendTime" class="date">{{ item.sendTime | dayHour }}</span>
            </div>
          </a>
        </div>
        <div v-else class="empty">
          <img :src="tipIcon" alt="" class="icon">
          <div class="text">您很勤奋，没有要待阅的事项</div>
        </div>
      </el-tab-pane>
      <el-tab-pane name="done">
        <span slot="label">
          已办
        </span>
        <div v-if="done.data.length>0" class="upcoming done">
          <a v-for="item in done.data" :key="item.todoId" class="item" :href="item.pcUrl" target="_blank">
            <div class="left">
              <span class="title ell">{{ item.todoTitle }}</span>
            </div>
            <div class="right">
              <span class="type">{{ item.businessType }}</span>
              <span class="date" :class="{'vh':!item.handleTime}">{{ item.handleTime | dayHour }}</span>
            </div>
          </a>
        </div>
        <div v-else class="empty">
          <img :src="tipIcon" alt="" class="icon">
          <div class="text">没有已办的事项</div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <mqtt-client @change="change" />
  </div>
</template>

<script>
// category: 1-待办；2-已办；3-待阅；4-已阅；5-已办和已阅
import iconSvg from '@/components/icon-svg'
import formatDate from '@/utils/format-date'
import routeToNewTab from '@/mixins/routeToNewTab'
import MqttClient from '@/components/MqttMessage'
export default {
  name: 'Todo',
  components: {
    iconSvg,
    MqttClient
  },
  filters: {
    day (value) {
      return formatDate(value, 'yyyy/MM/dd')
    },
    dayHour (value) {
      return formatDate(value, 'yyyy/MM/dd hh:mm')
    }
  },
  mixins: [routeToNewTab],
  data () {
    return {
      interval: null,
      prevIcon: false,
      nextIcon: true,
      tipIcon: require('@/assets/home/components/tipIcon.png'),
      tabActiveName: 'done',
      filterList: ['全部'],
      currentData: {
        type: 'upcoming',
        url: 'home.todoList',
        currentPage: 1,
        currentSize: 10,
        total: '',
        businessType: '全部',
        category: '1',
        showState: 1
      },
      upcoming: {
        data: [],
        pageNum: 1,
        pageSize: 10,
        currentPage: 1,
        currentSize: 10,
        number: 0
      },
      focusWork: {
        data: [],
        pageNum: 1,
        pageSize: 5,
        currentPage: 1,
        currentSize: 10,
        number: 0
      },
      toBeRead: {
        data: [],
        pageNum: 1,
        pageSize: 10,
        currentPage: 1,
        currentSize: 10,
        number: 0
      },
      done: {
        data: [],
        pageNum: 1,
        pageSize: 10,
        currentPage: 1,
        currentSize: 10,
        number: 0
      }
    }
  },
  created () {
    // this.countFn()
    // this.todoFn(this.tabActiveName, 'home.todoList', {
    //   category: 1,
    //   showState: 1,
    //   pageNum: this.upcoming.pageNum,
    //   pageSize: this.upcoming.pageSize
    // })
    // this.filterListFn()
    this.tabChange()
  },
  methods: {
    resize () {
      // console.log('todo')
    },
    change (data) {
      if (data === 'TODO') {
        this.refreshFn()
      }
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
      this.currentData.businessType = value
      const type = this.tabActiveName
      const url = 'home.todoList'
      let businessType
      if (value !== '全部') {
        businessType = value
      }
      this.todoFn(
        type, url,
        {
          category: 1,
          pageNum: this['upcoming'].currentPage,
          pageSize: this['upcoming'].pageSize,
          showState: 1,
          businessType
        })
      // console.log(this.currentData)
    },
    filterListFn () {
      this.$api('home.dictionaryFilter').then(res => {
        if (res.data) {
          this.filterList = [...this.filterList, ...res.data]
        }
      })
    },
    prevFn () {
      const { type, url, currentSize, category, showState } = this.currentData
      let { currentPage } = this.currentData
      if (currentPage === 1) {
        return false
      }
      let { businessType } = this.currentData
      if (businessType === '全部') {
        businessType = undefined
      }
      const params = {
        pageNum: --currentPage, pageSize: currentSize, category, showState
      }
      if (businessType) {
        params.businessType = businessType
      }
      this.todoFn(type, url, params)
    },
    nextFn () {
      const { type, url, currentSize, category, showState, total } = this.currentData
      let { currentPage } = this.currentData
      if (total === 0 || Math.ceil(total / currentSize) === currentPage) {
        return false
      }
      let { businessType } = this.currentData
      if (businessType === '全部') {
        businessType = undefined
      }
      const params = {
        pageNum: ++currentPage, pageSize: currentSize, businessType, category, showState
      }
      if (businessType) {
        params.businessType = businessType
      }
      this.todoFn(type, url, params)
    },
    refreshFn () {
      const { type, url, category, showState } = this.currentData
      const params = {
        pageNum: this[type].pageNum,
        pageSize: this[type].pageSize,
        category,
        showState
      }
      this.todoFn(type, url, params)
    },
    moreFn () {
      const toFn = (route) => {
        // console.log(route)
        this.$router.push(route)
      }
      switch (this.tabActiveName) {
        case 'upcoming':
          toFn('/doAndRead/toDo')
          break
        case 'focusWork':
          toFn({ url: 'https://awspaasbpm.avicnet.cn/openpage' })
          break
        case 'toBeRead':
          toFn('/doAndRead/toRead')
          break
        case 'done':
          toFn('/doAndRead/done')
          break
      }
    },
    todoFn (type, url, params) {
      // console.log(params)
      this.$api(url, {
        ...params
      }).then(res => {
        // console.log(res)
        this[type].data = res.data
        this[type].number = res.total
        this[type].currentPage = params.pageNum
        // 跟新当前tab相关配置数据
        this.currentData.type = type
        this.currentData.url = url
        this.currentData.total = res.total
        this.currentData.currentPage = params.pageNum
        this.currentData.currentSize = params.pageSize
        this.currentData.category = params.category
        this.disablePageFn(res.total, params.pageNum, params.pageSize)
      })
    },
    disablePageFn (total, pageNum, pageSize) {
      // 第一页 上翻禁用, 其他情况都是可上翻
      if (pageNum === 1) {
        this.prevIcon = true
      } else {
        this.prevIcon = false
      }
      // 当前页数如每页条数大于等于总数下一页禁用
      if (pageNum * pageSize >= total) {
        this.nextIcon = true
      } else {
        this.nextIcon = false
      }
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
          const { type, url, category, showState } = this.currentData
          let { businessType } = this.currentData
          if (businessType === '全部') {
            businessType = undefined
          }
          const params = {
            pageNum: 1,
            pageSize: 10,
            businessType,
            category,
            showState
          }
          this.todoFn(type, url, params)
        })
      }).catch(() => {})
    },
    cancelCareWorkFn (id) {
      this.$confirm('是否取消关注?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api('home.cancelCareWork', { careWorkId: id }).then(res => {
        // this.$message.success(res.msg)
          const { type, url, category, showState } = this.currentData
          let { businessType } = this.currentData
          if (businessType === '全部') {
            businessType = undefined
          }
          const params = {
            pageNum: 1,
            pageSize: 10,
            businessType,
            category,
            showState
          }
          this.todoFn(type, url, params)
        })
      }).catch(() => {})
    },
    readFn (todoUserId) {
      const { type, url, category, showState, pageNum, pageSize } = this.currentData
      const params = {
        pageNum,
        pageSize,
        category,
        showState
      }
      this.todoFn(type, url, params)
      this.$api('home.read', { todoUserId })
    },
    readAllFn () {
      this.$api('home.readAll').then(res => {
        this.refreshFn()
      })
    },
    tabChange (tab, event) {
      // console.log(this.tabActiveName)
      const type = this.tabActiveName
      let url = 'home.todoList'
      if (type === 'focusWork') {
        url = 'home.careWorkList'
        this.todoFn(type, url, { pageNum: this[type].currentPage, pageSize: this[type].pageSize })
      } else {
        const typeData = {
          upcoming: 1,
          toBeRead: 3,
          done: 5
        }
        const category = typeData[type]
        let showState
        if (category === 1) {
          showState = 1
        }

        this.todoFn(type, url, { category, pageNum: this[type].currentPage, pageSize: this[type].pageSize, showState })
      }
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
