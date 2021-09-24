<template>
  <div class="manage-box">
    <!-- <div class="search clearfix">
      <i class="el-icon-search" @click="searchFn" />
      <el-input v-model="search" placeholder="搜索常用应用" class="header-search-input" @change="searchFn" />
    </div> -->
    <ul class="list">
      <li v-for="ele in list" :key="ele.appId" class="item">
        <a :href="ele.pcUrl" target="_blank">
          <div class="top">
            <img :src="ele.appIcon" alt="">
            <span class="title">{{ ele.appName }}</span>
          </div>
          <div class="doc"><span>{{ ele.remark }}</span></div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AppManage',
  data () {
    return {
      search: '',
      themeColor: ['#3FA8F5', '#2FCFCA', '#6BD36A', '#E0CD48', '#F29A5F', '#F56B6B'],
      list: []
    }
  },
  created () {
    this.$api('home.manageList').then(res => {
      this.list = res.data
    })
  },
  methods: {
    searchFn () {}
  }
}
</script>

<style lang="scss" scoped>
@import './../../ui/size/mixin.scss';
.manage-box{
  width: 100%;
  overflow: hidden;
  .search{
    margin-left: 24px;
    padding: 0 16px;
    background-color: #fff;
    display: flex;
    align-items: center;
    height: 36px;
    width: 400px;
    border-radius: 4px;
    border: 1px solid #DADBDC;
  }
  .list{
    margin: 24px 0;
    width: 101%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .item{
      width: calc(25% - 21px);
      height: 200px;
      margin-right: 21px;
      margin-bottom: 24px;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.12);
      &:hover{
        box-shadow: 1px 2px 20px rgba(0, 0, 0, 0.22);
      }
      a{
        display: block;
        height: inherit;
      }
      .top{
        padding-left: 24px;
        height: 64px;
        background-color: #F9FAFA;
        display: flex;
        align-items: center;
        img{
          width: 40px;
          height: 40px;
        }
        .title{
          margin-left: 12px;
          font-size: 16px;
          font-weight: 500;
          color: #191F24;
        }
      }
      .doc{
        /* white-space: pre-wrap; */
        margin: 16px 24px;
        font-size: 14px;
        color: rgba(25, 31, 36, 0.64);
        line-height: 20px;
        @include lineClamp(5,20px,'span')
      }
    }
  }
}
</style>
