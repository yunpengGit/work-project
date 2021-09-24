<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-03-29 17:53:49
 * @LastEditors: peng
 * @LastEditTime: 2021-08-20 15:40:13
-->
<template>
  <div class="detail">
    <main>
      <div class="title">{{ contentData.title }}</div>
      <div class="content-author">
        <span>作者：{{ contentData.author }}</span>
        <span>{{ contentData.publishTime | day }}</span>
      </div>
      <p>{{ contentData.summary }}</p>
      <img v-if="contentData.logoUrl" :src="contentData.logoUrl">
      <div class="content-doc" v-html="contentData.body" />
      <down-load-files v-if="contentData.attachments.length>0" style="margin-top:50px" :attachments="contentData.attachments" />
    </main>
  </div>
</template>

<script>
import formatDate from '@/utils/format-date'
import { DownLoadFiles } from '@/components'

export default {
  name: 'Detail',
  components: {
    DownLoadFiles
  },
  filters: {
    day (value) {
      return formatDate(value, 'yyyy/MM/dd')
    }
  },
  data () {
    return {
      contentData: {
        catalogName: '',
        title: '',
        author: '',
        publishTime: '',
        summary: '',
        logoUrl: '',
        body: '',
        attachments: []
      }
    }
  },
  created () {
    this.$api('news.contentsQueryIds', { id: this.$route.query.id }).then(res => {
      this.contentData = res.data
    })
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
@import "./../../../ui/themeVar.scss";
.detail{
  background-color: #fff;
  padding: 50px 24px;
  height: calc(100% - 120px);

  main{
    width: 1088px;
    margin: 32px auto;
    @include fs();
    line-height: 22px;
    .title{
      text-align: center;
      font-size: 32px;
      font-weight: bold;
      color: #191F24;
      line-height: 40px;
      margin-bottom: 20px;
    }
    .content-author{
      margin-bottom: 20px;
      font-size: 14px;
      color: rgba(25, 31, 36, 0.64);
      line-height: 20px;
      display: flex;
      justify-content: center;
      span{
        margin: 0 4px;
      }
    }
    ::v-deep .content-doc  * {
      &::after{
        display: table;
        clear: both;
        content: '';
      }
    }

    p, pre{
      margin-bottom: 30px;
    }
    img{
      max-width: 100%;
      margin: 0 auto 30px;;
      display: block;
    }
    p, pre{
      display: inline-block;
    }
    p, pre{
      margin-top: 0;
      text-align: left;
    }
  }
}
</style>
