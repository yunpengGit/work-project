<!--
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-05-30 15:56:49
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-11 11:04:27
-->
<template>
  <div class="manage-box">
    <ul class="list">
      <li v-for="ele in list" :key="ele.appId" class="item">
        <div class="tips">
          <span class="icon-span" @click="authorize(ele)"><icon-svg class="icon-svg" name="shouquan" /></span>
          <span class="icon-span" @click="editTemplate(ele)"><icon-svg class="icon-svg" name="edit-plan" /></span>
          <span class="icon-span" @click="delTemplate(ele)"><icon-svg class="icon-svg" name="del" /></span>
        </div>
        <div class="top">
          <img :src="ele.templateUrl || 'https://uap-dev.oss-cn-beijing.aliyuncs.com/f1974802-7149-417e-be42-0a7ab9821084.jpg'" :alt="ele.templateName">
        </div>
        <div class="doc"><span>{{ ele.templateName }}</span></div>
      </li>
      <li class="item">
        <div class="top add">
          <img :src="templateAddPng" alt="点击添加模板">
        </div>
        <div class="doc add"><span @click="addTemplate">点击添加模板</span></div>
      </li>
    </ul>
    <select-personnel
      :dialog-visiable.sync="selectVisiable"
      :selected-list="selectedList"
      @confirm="(val)=>{autConfrim(val)}"
    />
  </div>
</template>

<script>
import iconSvg from '@/components/icon-svg'
import templateAddPng from '@/assets/template-add.png'
// import SelectPersonnel from '@/view/notice/SelectPersonnel'
import SelectPersonnel from '@/components/SelectPersonnel'
export default {
  components: { iconSvg, SelectPersonnel },
  data () {
    return {
      list: [],
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
      this.$api('dragHome.templateList', params).then(res => {
        this.list = res.data
      })
    },
    addTemplate () {
      this.$router.push({
        path: '/dragHome'
      })
    },
    authorize (item) {
      this.selectedList = item.authorizeList.map(v => {
        return {
          id: v.deptUserId,
          label: v.deptUserName,
          type: v.type
        }
      })
      this.selectVisiable = true
      this.autTemplateId = item.templateId
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
      this.$api('dragHome.authorizeTemplate', { templateId: this.autTemplateId, data: arry }).then(res => {
        this.selectedList = []
        this.autTemplateId = ''
        this.initList(this.page)
        this.$message({
          message: '恭喜你，模板授权成功',
          type: 'success'
        })
      })
    },
    editTemplate (item) {
      this.$router.push({
        path: '/dragHome',
        query: {
          templateId: item.templateId
        }
      })
    },
    delTemplate (item) {
      this.$api('dragHome.deleteTemplate', { templateId: item.templateId }).then(() => {
        this.initList(this.page)
        this.$message({
          message: '恭喜你，模板删除成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../../ui/size/mixin.scss';
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
