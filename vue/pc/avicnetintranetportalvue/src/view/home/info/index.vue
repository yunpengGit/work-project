<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-03-29 17:46:03
 * @LastEditors: peng
 * @LastEditTime: 2021-09-13 13:57:07
-->
<template>
  <div class="info">
    <!-- <div class="left">
      <ul class="list-nav">
        <li v-for="ele in navList" :key="ele.id" :class="{'active': ele.id === currentCatalogId}" :title="ele.name" @click="navFn(ele)">{{ ele.name }}</li>
      </ul>
    </div> -->
    <!-- <div class="page-title">{{ title }}</div> -->
    <div class="right">
      <ul v-if="contentList.length>0" class="list-info">
        <li v-for="ele in contentList" :key="ele.id">
          <a @click.prevent="href(ele)">
            <div v-if="ele.logoUrl" class="img-box">
              <img :src="ele.logoUrl" alt="">
            </div>
            <div class="doc-box">
              <div class="header">
                <span class="title-status">
                  <span class="title">{{ ele.title }}</span>
                  <span class="status" :class="{'orange':ele.secretLevelDesc==='公开'}">{{ ele.secretLevelDesc }}</span>
                </span>
                <span class="date">{{ ele.publishTime }}</span>
              </div>
              <p v-if="ele.summary.length < 80" class="text">{{ ele.summary }}</p>
              <p v-else class="text">{{ ele.summary.substring(0, 80) }}...</p>
            </div>
          </a>
        </li>
      </ul>
      <div v-if="contentList.length>0" class="pagination">
        <sp-pagination :total="total" @change="pageChangeFn" />
      </div>
      <div v-else class="empty">
        <img :src="empty" alt="">
        <span class="text">此栏目尚无更新内容</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  components: {
  },
  data () {
    return {
      title: '',
      currentCatalogId: '',
      total: 0,
      empty: require('./../../../assets/empty.png'),
      navList: [],
      contentList: []
    }
  },
  created () {
    // console.log(this.$route.query.catalogId)
    // this.init()
    this.title = this.$route.query.title
    this.navFn(this.$route.query.catalogId)
  },
  methods: {
    toDetail (id) {
      this.$router.push({ path: '/information/detail', query: { id }})
    },
    async init (params) {
      const res = await this.$api('home.subscribingInfo')
      this.navList = res.data.subscribingCatalogs
      // console.log(params)
      let pageNum, pageSize
      if (params) {
        pageNum = params.pageNum
        pageSize = params.pageSize
      } else {
        pageNum = 1
        pageSize = 10
      }
      this.navList[0].active = true
      const { id } = this.navList[0]
      this.currentCatalogId = id
      const data = {
        catalogId: id,
        pageNum,
        pageSize
      }
      this.initContent(data)
    },
    navFn (id) {
      this.currentCatalogId = id
      const data = {
        catalogId: id,
        pageNum: 1,
        pageSize: 10
      }
      this.initContent(data)
    },
    initContent (params) {
      this.$api('home.subscribeContentsList', params).then(res => {
        this.total = res.total
        this.contentList = res.data
      })
    },
    async pageChangeFn (params) {
      // console.log(params)
      const { pageNum, pageSize } = params
      const data = {
        catalogId: this.currentCatalogId,
        pageNum,
        pageSize
      }
      this.initContent(data)
    },
    href (item) {
      // console.log(item)
      const { id, catalogType } = item
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

<style scoped lang="scss">
@import '@/ui/size/mixin.scss';
@mixin del($sc: 1, $fs: 14px){
  .info{
    position: relative;
    margin: 9px 0 26px;
    padding: 30px 18px;
    background-color: #fff;
    border-radius: 4px;
    .page-title{
      position: absolute;
      top: 20px;
      padding-left: 10px;
      width: 360px;
      height: 16px;
      font-size: 16px;
      color: #191F24;
      line-height: 16px;
      border-left: 6px solid #499CF8;
    }
    .left{
      width: 172px * $sc;
      .list-nav{
        // padding: 20px 0;
        height: 100%;
        background-color: #fff;
        border-right: 1px solid rgba(25, 31, 36, 0.08);;
        li{
          padding: 0 30px;
          // margin-top: 4px;
          height: 50px * $sc;
          overflow: hidden;
          line-height: 50px * $sc;
          font-size: $fs;
          color: #191F24;
          cursor: pointer;
          border-bottom: 1px solid rgba(25, 31, 36, 0.08);;
          &:first-child{
            // margin-top: 0;
            border-top-left-radius: 4px;
          }
          &:hover,
          &.active{
            background-color: #499CF8;
            color: #fff;
          }
        }
      }
    }
    .right{
      // margin-left: 48px;
      margin: 0 auto 56px;
      width: 1280px;
      flex: 1;
      min-height: 700px;
      .list-info{
        li{
          border-bottom: 1px solid rgba(25, 31, 36, 0.08);
          a{
            padding: 24px;
            display: flex;
            align-items: center;
            &:hover{
              background: #F7F7F7;
              .doc-box{
                .header{
                  .title{
                    color: #1E89FF;
                  }
                }
              }
            }
            .img-box{
              margin-right: 20px;
              width: 150px;
              height: 80px;
              img{
                width: 100%;
                height: 100%;
              }
            }
            .doc-box{
              padding: 7px 0;
              flex: 1;

              .header{
                display: flex;
                justify-content: space-between;
                .title-status{
                  flex-grow: 1;
                  display: flex;
                  align-items: center;
                }
                .title{
                  max-width: 800px;
                  font-size: $fs;
                  line-height: 19px * $sc;
                  color: #191F24;
                }
                .status{
                  margin-left: 8px;
                  padding: 0 10px;
                  height: 18px;
                  line-height: 18px;
                  text-align: center;
                  font-size: 12px;
                  background: #FBDAD4;
                  color: #EA340F;
                  border-radius: 2px;
                  &.orange{
                    color: #FF8200;
                    background: rgba($color: #FF8200, $alpha: 0.18);
                  }
                }
                .date{
                  text-align: right;
                  width: 140px;
                  font-size: $fs;
                  color: rgba(25, 31, 36, 0.56);
                }
              }
              .text{
                margin-top: 8px;
                font-size: $fs;
                line-height: 24px * $sc;
                color: rgba(25, 31, 36, 0.56);
              }
            }
          }
        }
      }
      .pagination{
        margin-top: 23px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
      .empty{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .text{
          font-size: 14px;
          color: rgba(25, 31, 36, 0.48);
        }
      }
    }
  }
}
@import '@/ui/size/mixin.scss';
@import '@/ui/size/scale.scss';
</style>
