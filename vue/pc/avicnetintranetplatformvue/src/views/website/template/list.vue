<!--
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-06-06 11:32:26
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-01 14:05:10
-->
<template>
  <div class="manage-box">
    <ul class="list">
      <li v-for="ele in list" :key="ele.appId" class="item">
        <div class="tips">
          <!-- <span class="icon-span" @click="authorize(ele)"><icon-svg class="icon-svg" name="shouquan" /></span> -->
          <span class="icon-span" @click="editTemplate(ele)"><icon-svg class="icon-svg" name="edit-plan" /></span>
          <span class="icon-span" @click="delTemplate(ele)"><icon-svg class="icon-svg" name="del" /></span>
        </div>
        <div class="top">
          <img :src="ele.siteImageUrl || siteDemo" :alt="ele.templateName">
        </div>
        <div class="doc"><span>{{ ele.siteName }}</span></div>
      </li>
      <li class="item">
        <div class="top add">
          <img :src="templateAddPng" alt="点击添加站点">
        </div>
        <div class="doc add"><span @click="addTemplate">点击添加站点</span></div>
      </li>
    </ul>

    <select-personnel
      :dialog-visiable.sync="selectVisiable"
      :selected-list="selectedList"
      @confirm="(val)=>{autConfrim(val)}"
    />
    <sp-dialog title="查看站点页面" width="1200px" uid="website-dialog" />
    <sp-dialog :title="title" width="600px" uid="website-add-dialog" />
    <!-- website-add-dialog -->
  </div>
</template>

<script>
import iconSvg from '@/components/icon-svg'
import templateAddPng from '@/assets/template-add.png'
import siteDemo from '@/assets/site-demo.png'
import SelectPersonnel from '@/components/SelectPersonnel'
export default {
  components: { iconSvg, SelectPersonnel },
  data () {
    return {
      list: [],
      siteDemo: siteDemo,
      title: '',
      templateAddPng: templateAddPng,
      page: { pageNum: '1', pageSize: '99' },
      selectedList: [],
      autTemplateId: '',
      selectVisiable: false // 授权弹窗
    }
  },
  created () {
    this.initList(this.page)
  },
  methods: {
    initList (params) {
      this.$api('website.webSiteList', params).then(res => {
        this.list = res.data
      })
    },
    addTemplate () {
      this.title = '新增站点'
      this.$store.commit('OPEN_DIALOG', {
        uid: 'website-add-dialog',
        component: require('./components/website-add-dialog').default
      })
    },
    authorize (item) {
      // website-dialog
      console.log(item, 222)
      this.selectedList = item.siteAuths.map(v => {
        return {
          id: v.deptUserId,
          label: v.deptUserName,
          isPerson: v.type
        }
      })
      this.selectVisiable = true
      this.autTemplateId = item.siteId
    },
    autConfrim (list) {
      const arry = []
      list.forEach(v => {
        const obj = {}
        obj.deptUserId = v.id
        obj.deptUserName = v.label
        obj.type = v.isPerson ? 2 : 1
        arry.push(obj)
      })
      this.$api('website.webSiteAuth', { siteId: this.autTemplateId, data: arry }).then(res => {
        this.selectedList = []
        this.autTemplateId = ''
        this.initList(this.page)
        this.$message({
          message: '恭喜你，站点授权成功',
          type: 'success'
        })
      })
    },
    editTemplate (item) {
      this.$router.push({
        path: '/website/page',
        query: {
          siteId: item.siteId
        }
      })
    },
    delTemplate (item) {
      this.$api('website.webSiteDel', { siteId: item.siteId }).then(() => {
        this.initList(this.page)
        this.$message({
          message: '恭喜你，站点删除成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.manage-box{
  width: 100%;
  overflow: hidden;
  .list{
    margin: 24px 0;
    width: 101%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .item{
        position: relative;
        width: calc(20% - 21px);
        margin-right: 21px;
        margin-bottom: 24px;
        padding: 12px;
        box-sizing: border-box;
        height: 258px;
        background: #FFFFFF;
        box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.12);
        border-radius: 4px;
      &:hover{
            // box-shadow: 1px 2px 20px rgba(0, 0, 0, 0.22);
        .tips{
            display: inline-block;
      }
      }
      a{
        display: block;
        height: inherit;
      }
      .tips{
        display: none;
        position: absolute;
        right: 0;
        top: 0;
        border-radius: 0px 4px 0px 18px;
        width: 82px;
        height: 34px;
        background: rgba(25, 31, 36, .72);
        .icon-span{
          display: inline-block;
          width: 16px;
          height: 16px;
          cursor: pointer;
          margin: 8px 8px 0 14px;
          .icon-svg{
            width: 16px;
            height: 16px;
            color: white;
          }
        }
      }
      .top{
        height: 192px;
        background-color: #FFF;
        img{
          width: 100%;
          height: 192px;
        }
        &.add{
          background: #F5F5F5;
          text-align: center;
          img{
            margin-top: 66px;
            width: 60px;
            height: 60px;
        }
        }
      }
      .doc{
        width: 100%;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        margin: 17px 0 5px;
        font-size: 14px;
        color: rgba(25, 31, 36, 0.64);
        line-height: 20px;
        &.add{
          cursor: pointer;
          color: #499CF8;
          text-align: center;
        }
      }
    }
  }
}
</style>
