<template>
  <div ref="componentBox" class="component-box">
    <div class="continer-box continer-box-title clearfix">
      <span class="fl info-name">
        未读邮件
        <span v-if="sourceData.length!==0" class="tip-num">{{ sourceData.length }}</span>
      </span>
      <span class="fr info-btn-notext" @click="linkToNewTab('https://kmail.avicnet.cn/sso')">
        <el-tooltip class="item" effect="dark" content="更多" placement="bottom">
          <span class="info-btn-notext-icon"><icon-svg name="gengduo" /></span>
        </el-tooltip>
      </span>
      <span class="fr info-btn-notext" @click="refreshFn">
        <el-tooltip class="item" effect="dark" content="刷新" placement="bottom">
          <span class="info-btn-notext-icon"><icon-svg name="shuaxin" /></span>
        </el-tooltip>
      </span>
      <span class="fr info-btn" @click="linkToNewTab('https://kmail.avicnet.cn/sso?menumark=10')">
        <span class="info-btn-icon"><icon-svg name="xieyoujian" />写邮件</span>
      </span>
    </div>
    <div class="component-box-cont email-cont">
      <ul v-if="data.length>0">
        <li v-for="item in data" :key="item.mailId">
          <div class="left fix">
            <!-- <span class="fl dot" /> -->
            <a :href="item.detailUrl" target="_blank" class="fl title">{{ item.mailsubject }}</a>
            <span class="fl mj">{{ item.mailSecuritylevel }}</span>
            <span v-if="item.isAttachment==='1'" class="fl attach">
              <icon-svg name="fujian" />
            </span>
          </div>
          <div class="right">
            <span class="fl name" :title="item.sender">{{ item.sender }}</span>
            <!-- <span v-if="item.isAttachment" class="fl attach">
                <icon-svg name="fujian" />
              </span> -->
            <span class="fl date">{{ item.date | day }}</span>
            <span class="readed fl" @click.prevent="readedFn(item)">已读</span>
          </div>
        </li>
      </ul>
      <div v-else class="empty">
        <img :src="tipIcon" alt="" class="icon">
        <div class="text">{{ tipText }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import IconSvg from '@/components/icon-svg'
import calc from './../dragHome/calc'
import routeToNewTab from '@/mixins/routeToNewTab'
import formatDate from '@/utils/format-date'
export default {
  name: 'Email',
  components: {
    IconSvg
  },
  filters: {
    day (value) {
      return formatDate(value, 'yyyy-MM-dd')
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
      tipIcon: require('@/assets/home/components/email.png'),
      tipText: '暂无未读邮件',
      data: [],
      sourceData: [],
      params: {
        page: 1,
        size: 3
      },
      itemH: 34,
      colNum: 1,
      timer: ''
    }
  },
  created () {
    this.timer = setInterval(() => {
      this.refreshFn()
    }, 10000)
  },
  mounted () {
    if (this.blockConfig && JSON.stringify(this.blockConfig) !== '{}' && this.blockConfig.config) {
      this.componentConfig = this.blockConfig.config
    }
    this.resize()
  },
  destroyed () {
    clearInterval(this.timer)
  },
  methods: {
    resize (PBlockW, PBlockH) {
      // 动态计算数据条数
      const itemH = this.itemH
      const colNum = this.colNum
      const blockH = PBlockH || this.blockConfig.blockH - 55 - 10
      // console.log(itemH, colNum, blockH)
      this.params.size = calc(itemH, colNum, blockH)
      // console.log(this.params.size)
      this.init()
    },
    init () {
      this.$api('home.mailList', this.params).then(res => {
        this.sourceData = res.data
        this.$emit('updateNum', res.total, 'Email')
        this.data = res.data.slice(0, this.params.size)
      })
    },
    refreshFn () {
      this.init()
    },
    async readedFn (item) {
      await this.$api('home.updateMailStatus', [item.mailboxId])
        .then(res => {
          this.init()
        })
        .catch(() => {
          this.init()
        })
    },
    linkToNewTab (url) {
      window.open(url, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/ui/size/mixin.scss';
@mixin del($sc: 1, $fs: 14PX){
  .component-box {
    height: 100%;
    background-color: #fff;
    .tip-num{
      font-family: 'Helvetica';
      height: 16px;
      font-size: 16px * $sc;
      font-weight: bold;
      color: #FF4402;
    }
    .message {
      ::v-deep .el-badge__content.is-fixed {
        position: inherit;
        left: -15px;
        top: 8px;
      }
    }
    .email-cont {
      @if $fs == 14PX {
        padding-top: 10px;
      } @else {
        padding-top: 8px;
      }

      width: 100%;
      height: calc(100% - 55px);
      overflow: hidden;
      ul {
        li {
          display: flex;
          justify-content: space-between;
          padding: 0 20px;
          @if $fs == 14PX {
            height: 34px;
            line-height: 34px;
          } @else {
            height: 38px;
            line-height: 38px;
          }
          font-size: $fs;
          .left{
            flex: 1;
            display: flex;
            /* width: percent(700px,1034px); */
            .dot {
              margin: 14px 7px 14px 0;
              width: 4px;
              height: 4px;
              border-radius: 4px;
              background: #191f24;
              vertical-align: middle;
            }
            .title {
              /* flex: 1; */
              /* max-width: percent(642px,700px); */
              color: #191f24;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .mj{
              margin-top: 9px;
              margin-left: 10px;
              padding: 0 6px;
              height: 20px;
              line-height: 20px;
              text-align: center;
              font-size: 12px * $sc;
              color: #499CF8;
              background-color: rgba($color: #499CF8, $alpha: 0.12);
              border-radius: 2px;
            }
            .attach {
              margin-left: 10px;
              .icon {
                width: 12px;
                height: 14px;
              }
            }
          }
          .right{
            width: 290px;
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
            .name {
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
            .readed {
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
            .dot {
              background-color: #499CF8;
            }
            .title{
              color: #499CF8;
            }
          }
        }
      }
      .empty{
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .icon{
          width: 190px;
          height: 76px;
        }
        .text{
          height: 20px;
          font-size: $fs;
          color: rgba(25, 31, 36, 0.48);
          line-height: 20px;
        }
      }
    }
  }
}
@import '@/ui/size/scale.scss'
</style>
