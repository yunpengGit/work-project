<template>
  <div ref="componentBox" class="component-box home-information">
    <div class="continer-box continer-box-title information-fix clearfix">
      <span class="fl">
        资讯栏目
      </span>
      <!-- <span class="fr info-btn-notext" @click="$router.push('/information')">
        <el-tooltip class="item" effect="dark" content="更多" placement="bottom">
          <span class="info-btn-notext-icon"><icon-svg name="gengduo" /></span>
        </el-tooltip>
      </span> -->
      <span class="fr info-btn" @click="$router.push('/information/subscribe')">
        <span class="info-btn-icon"><icon-svg name="dingyue" />订阅</span>
      </span>
      <span v-hasPermi="['news:content:add']" class="fr info-btn" @click="routeToNewTab({path: platformUrl+`/news/content`,query: {isHome: true}})">
        <span class="info-btn-icon"><icon-svg name="xinjian" />新建</span>
      </span>

    </div>
    <div class="information-cont information-cont-fix clearfix">
      <div v-for="(item, idx) in infoData" :key="item.catalogId" class="info-item">
        <div class="info-item-title"><span class="line" /><span class="text">{{ item.catalogName }}</span><span class="more" @click="$router.push({path: '/information/info-list',query:{catalogId: item.catalogId, title: item.catalogName}})"><icon-svg name="gengduo" /></span></div>
        <div class="info-item-cont">
          <div class="info-item-cont-top">
            <img :src="item.logoUrl?item.logoUrl:defaultImg[idx%6]" :alt="item.title">
            <div class="left">
              <p class="info-item-cont-top-title ell" :title="item.hotObj.title">
                <a @click.prevent="detail(item)">{{ item.hotObj.title }}</a>
                <!-- <router-link :to="{path:'/information/detail',query:{id:item.hotObj.id}}">{{ item.hotObj.title }}</router-link> -->
              </p>
              <p class="info-item-cont-top-des">
                <a @click.prevent="detail(item)">{{ item.hotObj.summary }}</a>
                <!-- <router-link :to="{path:'/information/detail',query:{id:item.hotObj.id}}">{{ item.hotObj.summary }}</router-link> -->
              </p>
            </div>
          </div>
          <ul class="info-item-cont-list">
            <li v-for="t in item.contents" :key="t.id">
              <span class="dot" />
              <a @click.prevent="detail(t)">{{ t.title }}</a>
              <!-- <router-link :to="{path:'/information/detail',query:{id:t.id}}">{{ t.title }}</router-link> -->
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import iconSvg from '@/components/icon-svg'
import routeToNewTab from '@/mixins/routeToNewTab'
import calc from './../dragHome/calc'
export default {
  name: 'Information',
  components: {
    iconSvg
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
      showNew: false,
      interval: null,
      platformUrl: process.env.VUE_APP_INDEX_LINK,
      defaultImg: [
        require('./../../../assets/home/infoDefaultImg/1.png'),
        require('./../../../assets/home/infoDefaultImg/2.png'),
        require('./../../../assets/home/infoDefaultImg/3.png'),
        require('./../../../assets/home/infoDefaultImg/4.png'),
        require('./../../../assets/home/infoDefaultImg/5.png'),
        require('./../../../assets/home/infoDefaultImg/6.png')
      ],
      infoData: [],
      itemH: 218,
      colNum: 3
    }
  },
  mounted () {
    if (this.blockConfig && JSON.stringify(this.blockConfig) !== '{}' && this.blockConfig.config) {
      this.componentConfig = this.blockConfig.config
    }
    this.resize()
  },
  methods: {
    init (pageSize) {
      this.$api('home.subscribeList').then(res => {
        res.data && res.data.forEach((v, i) => {
          v.hotObj = v.contents[0]
          v.contents.splice(0, 1)
        })
        const data = [...res.data]
        if (data.length > pageSize) {
          data.length = pageSize
        }
        // console.log(data)
        this.infoData = data
      })
    },
    resize (PBlockW, PBlockH) {
      // 动态计算数据条数
      const itemH = this.itemH
      const colNum = this.colNum
      const blockH = PBlockH || (this.blockConfig.blockH - 55 - 15)
      // console.log(itemH, colNum, blockH)
      this.pageSize = calc(itemH, colNum, blockH)
      // console.log(this.pageSize)
      this.init(this.pageSize)
      // console.log(itemH, colNum, blockH)
    },
    detail (item) {
      let id, catalogType
      const { hotObj } = item
      catalogType = item.catalogType
      id = item.id
      if (hotObj) {
        catalogType = hotObj.catalogType
        id = hotObj.id
      }
      if (catalogType === 2) {
        // 调用预览
        this.$api('news.contentsQueryIds', { id }).then(res => {
          const attachments = res.data.attachments || []
          // console.log(attachments)
          attachments.forEach(e => {
            this.preview(e.id)
          })
        })
      } else {
        this.$router.push({ path: '/information/detail', query: { id }})
      }
    },
    preview (fileId) {
      this.$api('news.fileConvertPreview', { fileId }).then(res => {
        window.open(res.data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/ui/size/mixin.scss';
@mixin del($sc: 1, $fs: 14PX){
  .home-information {
    height: 100%;
    background-color: #fff;
    .information-fix{
      height: 54px !important;
      line-height: 54px !important;
      &.continer-box-title{
        border: 0;
        &::before{
          top: 14px !important;
        }
      }
    }
    .info-btn-notext,.info-btn{
      height: 54px !important;
    }
    .information-cont {
      padding-top: 15px;
      height: calc(100% - 55px);
      display: flex;
      flex-wrap: wrap;
      overflow: auto;
      align-content: flex-start;
      .info-item {
        margin-bottom: 0;
        box-sizing: border-box;
        font-size: 14px;
        width: 33.33333333%;
        color: #191f24;
        padding-left: 20px;
        padding-right: 35px;
        height: 218px;
        box-sizing: border-box;
        &:nth-child(3n){
          padding-right: 20px;
        }
        a {
          color: #191f24;
          &:hover {
            color: #499CF8;
          }
        }
        &-title {
          background: #F9F9F9;
          margin-bottom: 11px;
          line-height: 34px;
          height: 34px;
          border-radius: 0px 1px 1px 0px;
          display: flex;
          .line {
            margin: 9px 13px 10px 0;
            width: 3px;
            height: 15px;
            background: #499CF8;
            border-radius: 2px;
            vertical-align: middle;
          }
          .text{
            flex-grow: 1;
          }
          .more{
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            color: rgba(25, 31, 36, 0.26);
            width: 40px;
          }
        }
        &-cont {
          &-top {
            width: 100%;
            height: 80px;
            line-height: 19px;
            img {
              float: left;
              width: 150px;
              height: 80px;
            }
            &-title {
              margin: 0 0 12px 166px;
              line-height: 24px;
            }
            &-des {
              line-height: 22px;
              color: rgba(25, 31, 36, 0.64);
              margin: 0 0 0 166px;
              a {
                  color: rgba(25, 31, 36, 0.64);
                &:hover {
                  color: rgba(25, 31, 36, 0.64);
                }
              }
              @include lineClamp(2,22px,'a')
            }
          }
          &-list {
            margin-top: 10px;
            li {
              height: 28px;
              line-height: 28px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              &:hover {
                .dot {
                  background: #499CF8;
                }
              }
              .dot {
                margin-right: 7px;
                width: 4px;
                height: 4px;
                border-radius: 4px;
                background: #191f24;
                vertical-align: middle;
              }
            }
          }
        }
      }
    }
  }
}
@import '@/ui/size/scale.scss'
</style>
