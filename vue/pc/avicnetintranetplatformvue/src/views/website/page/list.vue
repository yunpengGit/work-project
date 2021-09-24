<!--
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-06-06 11:32:26
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-01 14:06:09
-->
<template>
  <div class="manage-box">
    <ul class="list">
      <li v-for="ele in list" :key="ele.appId" class="item">
        <div class="tips">
          <span class="icon-span" @click="operation(ele,'auth')"><icon-svg class="icon-svg" name="shouquan" /></span>
          <span class="icon-span" @click="operation(ele,'edit')"><icon-svg class="icon-svg" name="edit-plan" /></span>
          <span class="icon-span" @click="operation(ele,'del')"><icon-svg class="icon-svg" name="del" /></span>
        </div>
        <div class="top">
          <img :src="pageUrl" :alt="ele.templateName">
        </div>
        <div class="doc">
          <span>{{ ele.pageName }}</span>
          <el-button type="text" style="margin-left:10px" @click="operation(ele,'view')">预览</el-button>
          <el-button v-if="ele.publishState !==2" type="text" @click="operation(ele,'publish')">发布</el-button>
          <el-button
            v-else
            v-clipboard:copy="portalUrl+ele.pageUrl"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            type="text"
            @click="operation(ele,'copy')"
          >复制地址</el-button>
        </div>
      </li>
      <li class="item">
        <div class="top add">
          <img :src="templateAddPng" alt="点击添加页面">
        </div>
        <div class="doc add"><span @click="operation('','add')">点击添加页面</span></div>
      </li>
    </ul>
    <select-personnel
      :dialog-visiable.sync="selectVisiable"
      :selected-list="selectedList"
      @confirm="(val)=>{autConfrim(val)}"
    />
    <!-- <sp-dialog title="查看站点页面" width="1200px" uid="website-dialog" />
    <sp-dialog :title="title" width="600px" uid="website-add-dialog" /> -->
    <!-- website-add-dialog -->
  </div>
</template>

<script>
import iconSvg from '@/components/icon-svg'
import templateAddPng from '@/assets/template-add.png'
import templateDemo from '@/assets/template-demo.png'
import { Base64 } from 'js-base64'
import SelectPersonnel from '@/components/SelectPersonnel'
export default {
  components: { iconSvg, SelectPersonnel },
  data () {
    return {
      pageUrl: templateDemo,
      list: [],
      title: '',
      templateAddPng: templateAddPng,
      page: { pageNum: '1', pageSize: '99' },
      selectedList: [],
      autTemplateId: '',
      selectVisiable: false, // 授权弹窗
      portalUrl: `https:${process.env.VUE_APP_INDEX_LINK}`
    }
  },
  created () {
    this.initList({ siteId: this.$route.query.siteId })
  },
  methods: {
    initList (params) {
      this.$api('website.webSitePageList', params).then(res => {
        this.list = res.data
      })
    },
    operation (data, type) {
      switch (type) {
        case 'del':
          this.onDelect(data)
          break
        case 'publish':
          this.publish(data)
          break
        case 'add':
          this.add(data)
          break
        case 'edit':
          this.edit(data)
          break
        case 'view':
          this.view(data)
          break
        case 'auth':
          this.authorize(data)
          break
        default:
          break
      }
    },
    authorize (item) {
      this.selectedList = item.siteAuths.map(v => {
        return {
          id: v.deptUserId,
          label: v.deptUserName,
          isPerson: v.type
        }
      })
      this.selectVisiable = true
      this.autTemplateId = item.pageId
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
      this.$api('website.pageAuth', { pageId: this.autTemplateId, data: arry }).then(res => {
        this.selectedList = []
        this.autTemplateId = ''
        this.initList({ siteId: this.$route.query.siteId })
        this.$message({
          message: '恭喜你，页面授权成功',
          type: 'success'
        })
      })
    },
    onDelect (data) {
      this.$confirm(`确定删除${data.pageName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api('website.pageDelete', { pageId: data.pageId }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.initList({ siteId: this.$route.query.siteId })
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(() => {})
    },
    publish (data) {
      const msg = data.publishState === 2 ? `确定撤回${data.pageName}?` : `确定发布${data.pageName}?`
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const pageUrl = `/website/${Base64.encode(data.pageId)}`

        const req = {
          publishState: data.publishState === 2 ? '1' : '2',
          pageUrl: pageUrl
        }
        this.$api('website.pagePublish', { pageId: data.pageId, ...req }).then(res => {
          if (res.code === 200) {
            this.$message.success(`${data.publishState === 2 ? '撤回' : '发布'}成功`)
            this.initList({ siteId: this.$route.query.siteId })
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(() => {})
    },
    add (data) {
      window.open(`${this.portalUrl}/dragHome?siteId=${Base64.encode(this.$route.query.siteId)}`, '_blank')
    },
    edit (data) {
      window.open(`${this.portalUrl}/dragHome?siteId=${Base64.encode(this.$route.query.siteId)}&pageId=${Base64.encode(data.pageId)}`, '_blank')
    },
    view (data) {
      if (data.publishState !== 2) {
        window.open(`${this.portalUrl}/website-view?pageId=${Base64.encode(data.pageId)}`, '_blank')
      } else {
        window.open(`${this.portalUrl}/website/${Base64.encode(data.pageId)}`, '_blank')
      }
    },
    onCopy () {
      this.$message.success('复制成功！')
    },
    onError () {
      this.$message.error('复制失败，请重试！')
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
        width: 120px;
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
        span{
          float: left;
        }
        ::v-deep .el-button{
          float: right;
          padding: 0;
          line-height: 20px;
        }
        &.add{
          cursor: pointer;
          color: #499CF8;
          text-align: center;
          span{
          float: inherit;
        }
        }
      }
    }
  }
}
</style>
