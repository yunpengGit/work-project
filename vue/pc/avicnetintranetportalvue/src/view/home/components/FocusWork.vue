
<template>
  <div ref="componentBox" class="component-box">
    <div class="continer-box continer-box-title clearfix">
      <span class="fl info-name">
        {{ componentConfig.label }}
      </span>
      <span class="fr info-btn-notext" @click="routeToNewTab({ url: 'https://awspaasbpm.avicnet.cn/openpage' })">
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
    </div>
    <div v-if="list.length>0" class="component-box-cont focusWork">
      <a v-for="item in list" :key="item.processInstanceId" class="item" :href="item.careworkUrl" target="_blank">
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
        label: '关注'
      },
      tipIcon: require('@/assets/home/components/tipIcon.png'),
      list: [],
      pageNum: 1,
      pageSize: 6,
      itemH: 70,
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
      // console.log(params)
      this.$api('home.careWorkList', {
        ...params
      }).then(res => {
        // console.log(res)
        this.list = res.data
        this.num = res.total
        this.pageNum = params.pageNum
      })
    },
    resize (PBlockW, PBlockH) {
      // 动态计算数据条数
      const itemH = this.itemH
      const colNum = this.colNum
      const blockH = PBlockH || this.blockConfig.blockH - 55 - 10
      this.pageSize = calc(itemH, colNum, blockH)
      this.todoFn({
        pageNum: this.pageNum,
        pageSize: this.pageSize
      })
    },
    refreshFn () {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.todoFn(params)
    },
    cancelCareWorkFn (id) {
      this.$confirm('是否取消关注?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api('home.cancelCareWork', { careWorkId: id }).then(res => {
          const params = {
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }
          this.todoFn(params)
        })
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
