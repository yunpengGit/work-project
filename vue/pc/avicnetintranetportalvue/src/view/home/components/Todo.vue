
<template>
  <div class="br8 home-todo">
    <div class="continer-box clearfix">
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
    </div>
    <el-tabs v-model="tabActiveName" @tab-click="tabChange">
      <el-tab-pane name="upcoming">
        <span slot="label">
          待办 <span v-if="upcoming.number!==0" class="tip-num">{{ upcoming.number }}</span>
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
              <span v-for="(t,index) in toJson(item.label)" :key="index" class="status" :style="obj(t.color)">{{ t.name }}</span>
            </div>
            <div class="right">
              <span class="type" :title="item.businessType">{{ item.businessType }}</span>
              <span v-if="item.sendTime" class="date" :class="{'vh':!item.sendTime}">{{ item.sendTime | day }}</span>
              <!-- <span class="hide" @click.prevent="hideFn(item.todoUserId)">隐藏</span> -->
            </div>
          </a>
        </div>
        <div v-else class="empty">
          <img :src="tipIcon" alt="" class="icon">
          <div class="text">您很勤奋，没有要待办的事项</div>
        </div>
      </el-tab-pane>
      <el-tab-pane name="toBeRead">
        <span slot="label">
          待阅 <span v-if="toBeRead.number!==0" class="tip-num">{{ toBeRead.number }}</span>
        </span>
        <div v-if="toBeRead.data.length>0" class="upcoming toBeRead">
          <a v-for="item in toBeRead.data" :key="item.todoId" class="item" :href="item.pcUrl" target="_blank" @click="readFn(item.todoUserId)">
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
      </el-tab-pane>
      <el-tab-pane name="focusWork">
        <span slot="label">
          关注
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
                  <span class="date">更新时间：{{ item.lastUpdateTime | dayHour }}</span>
                  <span class="doc ell">{{ item.agentInfo }}</span>
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
      <!-- <el-tab-pane name="done">
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
      </el-tab-pane> -->
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
      return formatDate(value, 'yyyy-MM-dd')
    },
    dayHour (value) {
      return formatDate(value, 'yyyy-MM-dd hh:mm')
    }
  },
  mixins: [routeToNewTab],
  data () {
    return {
      interval: null,
      prevIcon: false,
      nextIcon: true,
      tipIcon: require('@/assets/home/components/tipIcon.png'),
      tabActiveName: 'upcoming',
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
        pageSize: 6,
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
    this.countFn()
    this.todoFn(this.tabActiveName, 'home.todoList', {
      category: 1,
      showState: 1,
      pageNum: this.upcoming.pageNum,
      pageSize: this.upcoming.pageSize
    })
    this.filterListFn()
  },
  methods: {
    resize () {
      // console.log('todo')
    },
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
        if (res.data) { this.filterList = [...this.filterList, ...res.data] }
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
        if (route.url) {
          // window.location.href = route.url
          window.open(route.url, '_blank')
        } else {
          this.$router.push(route)
        }
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
            pageSize: this.focusWork.pageSize,
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
@import '@/ui/size/mixin.scss';
@mixin del($sc: 1, $fs: 14PX){
  .home-todo,
  .component-box{
    position: relative;
    height: 100%;
    background-color: #fff;
    /* box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.14); */
    .continer-box{
      position: absolute;
      z-index: 1;
      .info-btn-notext{
        position: relative;
        &:hover{
          .select-list{
            display: inline-block;
          }
        }
        .select-list{
          display: none;
          padding: 2px 0;
          position: absolute;
          top: 55px;
          left: -42px;
          width: 112px;
          background: #FFFFFF;
          /* box-shadow: 0px 4px 6px 0px rgba(25, 31, 36, 0.16); */
          border-radius: 8px;
          &::before{
            content: '';
            position: absolute;
            top: -10px;
            left: 51px;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 0 5px 10px 5px;
            border-color: transparent transparent #fff transparent;
          }
          div{
            padding: 0 8px;
            height: 32px;
            line-height: 32px;
            font-size: 12px;
            font-weight: 400;
            color: rgba(25, 31, 36, 0.88);
            text-align: center;
            overflow: hidden;
            cursor: pointer;
            &:hover{
              background: #F5F6F8;
              color: #499CF8;
            }
            &.active{
              color: #499CF8;
            }
          }
        }
      }
    }
    ::v-deep .el-tabs {
      height: 100%;
      .el-tabs__header {
        margin-bottom: 0;
        /* background: #f0f2f4; */
        .el-tabs__nav-wrap::after{
          height: 1px;
          background-color: rgba(25, 31, 36, 0.06);
        }
        .el-tabs__nav-scroll{
          .el-tabs__nav{
            .el-tabs__item {
              span{
                padding: 0px 2px;
              }
              padding: 0 28px;
              font-size: 16px;
              color: #191F24;
              height: 55px;
              line-height: 55px;
              .tip-num{
                font-family: 'Helvetica';
                height: 16px;
                font-size: 16px;
                font-weight: bold;
                color: #FF4402;
              }
            }
            .el-tabs__active-bar{
              height: 4px;
              border-radius: 2px;
              background-color: #499CF8;
            }
          }
        }
      }
      .el-tabs__content{
        height: calc(100% - 55px);
        .el-tab-pane{
          height: 100%;
        }
      }
    }

  }
  .br8 {
    border-radius: 8px;
    overflow: hidden;
  }
  .empty{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .icon{
      display: block;
      width: 120px;
      height: 120px;
    }
    .text{
      text-align: center;
      height: 20px;
      font-size: $fs;
      color: rgba(25, 31, 36, 0.48);
      line-height: 20px;
    }
  }
  .upcoming {
    @if $fs == 14PX {
      padding-top: 10px;
    } @else {
      padding-top: 12px;
    }
    & > .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      @if $fs == 14PX {
        height: 40px;
        line-height: 40px;
      } @else {
        height: 42px;
        line-height: 42px;
      }
      overflow: hidden;
      .left {
        display: flex;
        align-items: center;
        width: percent(700px,1034px);
        & > span {
          margin-right: 8px;
          vertical-align: middle;
        }
        .title {
          max-width: percent(530px,700px);
          font-size: $fs;
          color: #191f24;
          &.danger {
            color: #fe0800;
            & > span{
              display: inline-block;
              margin-right: 4px;
            }
          }
        }
        .status {
          margin: 0 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 4px;
          min-width: 18px;
          height: 18px;
          font-size: 12px;
          border-radius: 2px;
          .icon{
            width: 12px;
            height: 12px;
          }
        }
        .icon-box {
          display: inline-block;
          width: 30px;
          height: 22px;
          .icon{
            width: 30px;
            height: 22px;
            vertical-align: baseline;
          }
        }
        .red {
          border: 1px solid #FD3C34;
          color: #FD3C34;
        }
        .orange {
          border: 1px solid #FF6C00;
          color: #FF6C00;
        }
      }
      .right {
        flex: 1;
        display:flex;
        justify-content: flex-end;
        color: rgba(25, 31, 36, 0.64);
        font-size: $fs;
        span {
          margin-left: 36px;
          &:first-child{
            margin-left: 0;
          }
        }
        .type {
          @if $fs == 14PX{
            width: 70px;
          } @else {
            width: 80px
          }
          overflow: hidden;
        }
        .date{
          @if $fs == 14PX{
            width: 82px;
          } @else {
            width: 94px;
          }
        }
        .hide {
          text-align: right;
          @if $fs == 14PX{
            width: 28px;
          } @else {
            width: 32px;
          }
          color: #499CF8;
          cursor: pointer;
        }
      }
      &:hover {
        background: rgba(73, 156, 248, 0.08);
        .left {
          .title {
            color: #499CF8;
            cursor: pointer;
          }
          .dot {
            background: #499CF8;
          }
        }
        .right {
          .hide {
            color: #499CF8;
            cursor: pointer;
          }
        }
      }
    }
  }
  .focusWork {
    .item {
      @if $fs == 14PX {
        height: 70px;
      } @else {
        height: 72px;
      }
      & > *{
        box-sizing: border-box;
      }
      display: block;
      padding: 0 20px;
      .work {
        border-bottom: 1px solid rgba($color: #191F24, $alpha: 0.08);
        display: flex;
        & > .left {
          flex: 1;
          @if $fs == 14PX {
            padding-top: 14px;
          } @else {
            padding-top: 12px;
          }
          & > span {
            display: inline-block;
            vertical-align: middle;
          }
          .text {
            max-width: 820px;
            .title {
              font-size: $fs;
              color: #191f24;
              height: 20px;
              line-height: 20px;
            }
          }
          .info {
            display: flex;
            margin-top: 6px;
            // @if $fs == 14PX {
            //   margin-top: 6px;
            // } @else {
            //   margin-top: 6px;
            // }
            color: rgba(25, 31, 36, 0.64);
            font-size: 12px;
            height: 16px;
            line-height: 16px;
            & > span {
              margin-left: 40px;
              &:first-child {
                margin-left: 0;
              }
            }
            .type {
              width: 60px;
              height: 18px;
              line-height: 18px;
              overflow: hidden;
            }
            .date {
              width: 130px;
              height: 18px;
              line-height: 18px;
              overflow: hidden;
            }
            .doc {
              max-width: 620px;
              flex: 1;
              height: 18px;
              line-height: 18px;
            }
          }
        }
        & > .right {
          width: 64px;
          padding-top: 0;
          text-align: right;
          .btn {
            color: #499CF8;
            display: inline-block;
            @if $fs == 14PX {
              line-height: 69px;
            } @else {
              line-height: 69px;
            }
          }
        }
      }
      &:hover {
        background: rgba(73, 156, 248, 0.06);
        .left {
          .text {
            .dot {
              background: #499CF8;
            }
            .title {
              color: #499CF8;
              cursor: pointer;
            }
          }
        }
        .right {
          .btn {
            color: #499CF8;
            cursor: pointer;
          }
        }
      }
    }
  }
  .toBeRead,
  .done {
    & > .item{
      .right{
        .date{
          text-align: right;
          @if $fs == 14PX {
            width: 146px;
          } @else {
            width: 162px;
          }
        }
      }
    }
  }
}
@import '@/ui/size/scale.scss'
</style>
