<template>
  <div ref="componentBox" class="component-box">
    <div class="continer-box continer-box-title clearfix">
      <span class="fl info-name">
        通知公告
      </span>
      <span class="fr info-btn-notext" @click="$router.push('/notice')">
        <el-tooltip class="item" effect="dark" content="更多" placement="bottom">
          <span class="info-btn-notext-icon"><icon-svg name="gengduo" /></span>
        </el-tooltip>
      </span>
      <span class="fr info-btn" @click="$router.push('/notice/myStart/addNotice')">
        <span class="info-btn-icon"><icon-svg name="xinjian" />新建</span>
      </span>
      <!-- <span class="fr info-btn-notext" @click="nextFn">
        <el-tooltip class="item" effect="dark" content="下一页" placement="bottom">
          <span class="info-btn-notext-icon" :class="{'disabled': nextIcon}"><icon-svg name="xiafan" /></span>
        </el-tooltip>
      </span>
      <span class="fr info-btn-notext" @click="prevFn">
        <el-tooltip class="item" effect="dark" content="上一页" placement="bottom">
          <span class="info-btn-notext-icon" :class="{'disabled': prevIcon}"><icon-svg name="shangfan" /></span>
        </el-tooltip>
      </span> -->
    </div>
    <ul v-if="noticeList.length>0" class="component-box-cont notice-cont">
      <li v-for="item in noticeList" :key="item.id" class="item" @click="hrefFn(item.id)">
        <span class="dot" />
        <span class="date">[{{ item.publishDate.slice(5) }}]</span>
        <span class="title ell">{{ item.title }}</span>
      </li>
    </ul>
    <div v-else class="empty">
      <img :src="tipIcon" alt="" class="icon">
      <div class="text">暂无最新通知公告</div>
    </div>
  </div>
</template>

<script>
import iconSvg from '@/components/icon-svg'
import routeToNewTab from '@/mixins/routeToNewTab'
import formatDate from '@/utils/format-date'
import calc from './../dragHome/calc'
export default {
  name: 'Notice',
  components: {
    iconSvg
  },
  filters: {
    month (value) {
      return formatDate(value, 'MM-dd')
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
      interval: null,
      prevIcon: true,
      nextIcon: false,
      tipIcon: require('@/assets/home/components/tipIcon.png'),
      noticeList: [],
      pageNum: 1,
      pageSize: 5,
      total: 0,
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
    resize (PBlockW, PBlockH) {
      // 动态计算数据条数
      const itemH = this.itemH
      const colNum = this.colNum
      const blockH = PBlockH || this.blockConfig.blockH - 55 - 10
      this.pageSize = calc(itemH, colNum, blockH)
      this.init({
        pageNum: this.pageNum,
        pageSize: this.pageSize
      })
    },
    change (data) {
      if (data === 'NOTICE') {
        this.init({ pageNum: this.pageNum, pageSize: this.pageSize })
      }
    },
    init (params) {
      this.$api('home.noticeList', params).then(res => {
        this.noticeList = res.data || []
        this.total = res.total
        this.pageNum = params.pageNum
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
    prevFn () {
      if (this.pageNum === 1) {
        return false
      }
      this.init({ pageNum: --this.pageNum, pageSize: this.pageSize })
    },
    nextFn () {
      if (this.total === 0 || Math.ceil(this.total / this.pageSize) === this.pageNum) {
        return false
      }
      this.init({ pageNum: ++this.pageNum, pageSize: this.pageSize })
    },
    refreshFn () {
      this.init({ pageNum: 1, pageSize: this.pageSize })
    },
    hrefFn (id) {
      this.$router.push({ path: `/notice/detail?id=${id}&type=mySee` })
    }
  }
}
</script>

<style lang="scss">
@import '@/ui/size/mixin.scss';
@mixin del($sc: 1, $fs: 14PX){
  .component-box {
    background-color: #fff;
    height: 100%;
    .notice-cont{
      @if $fs == 14PX {
        padding-top: 10px;
      } @else {
        padding-top: 12px;
      }
      height: calc(100% - 55px);
      .item {
        display: block;
        padding: 0 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        .dot{
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          vertical-align: middle;
          background: #191F24;
        }
        .date{
          margin-left: 6px;
        }
        .title{
          flex: 1;
          display: inline-block;
          margin-left: 8px;
          @if $fs == 14PX {
            height: 40px;
            line-height: 40px;
          } @else {
            height: 42px;
            line-height: 42px;
          }
          font-size: $fs;
          color: #191F24;
          vertical-align: middle;
        }
        &:hover{
          background-color: rgba(73, 156, 248, 0.08);
          .date{
            color: #499CF8;
          }
          .dot{
            background: #499CF8;
          }
          .title{
            color: #499CF8;
          }
        }
      }
    }
    .empty{
      height: calc(100% - 55px);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .icon{
        width: 190px;
        height: 76px;
      }
      .text{
        text-align: center;
        height: 20px;
        font-size: $fs;
        color: rgba(25, 31, 36, 0.48);
        line-height: 20px;
      }
    }
  }
}
@import '@/ui/size/scale.scss';
</style>
