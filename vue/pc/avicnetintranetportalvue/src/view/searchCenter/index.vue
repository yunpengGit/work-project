<template>
  <div class="search-center-container">
    <div class="search-center-header">
      <div class="header-box">
        <div class="search">
          <el-input v-model="params.searchText" />
          <el-button type="primary">搜索</el-button>
        </div>
        <div class="type-list">
          <span
            v-for="item in typeList"
            :key="item.value"
            :class="{active:params.type ===item.value}"
            @click="params.type =item.value"
          ><i :class="item.icon" />{{ item.label }}</span>
        </div>
      </div>
      <div class="content-box">
        <p class="tips">已为您找到相关结果约1,0800个，用时0.11秒</p>
        <condition />
        <div class="news-list">
          <div v-for="i in 10" :key="i" class="news-list-item">
            <div class="title">安全生产工作总结的通知</div>
            <div class="desc">根据集团公司职业健康管理重点工作安排，经研究，集团公司拟组织开展根据集团公司职业健康管理重点工作安排，经研究，集团公司拟组织开展根据集团公司职业健康管理重点工作安排，经研究，集团公司拟组织开展根据集团公司职业健康管理重点工作安排，经研究，集团公司拟组织开展根据集团公司职业健康管理重点工作安排，经研究，集团公司拟组织开展根据集团公司职业健康管理重点工作安排，经研究，集团公司拟组织开展根据集团公司职业健康管理重点工作安排，经研究，集团公司拟组织开展根据集团公司职业健康管理重点工作安排，经研究，集团公司拟组织开展根据集团公司职业健康管理重点工作安排，经研究，集团公司拟组织开展根据集团公司职业健康管理重点工作安排，经研究，集团公司拟组织开展根据集团公司职业健康管理重点工作安排，经研究，集团公司拟组织开展根据集团公司职业健康管理重点工作安排，经研究，集团公司拟组织开展</div>
            <div class="other">
              来源：公文系统 ｜  作者：高瑾宇 ｜ 创建时间：2020-10-29
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import condition from './condition'
export default {
  components: { condition },
  data () {
    return {
      params: {
        searchText: '',
        type: 1
      },
      typeList: [
        { label: '总部公文', value: 1, icon: 'el-icon-share' },
        { label: '外来文', value: 2, icon: 'el-icon-share' },
        { label: '会议纪要', value: 3, icon: 'el-icon-share' },
        { label: '活动', value: 4, icon: 'el-icon-share' },
        { label: '图片', value: 5, icon: 'el-icon-share' },
        { label: '人员', value: 6, icon: 'el-icon-share' },
        { label: '邮件', value: 7, icon: 'el-icon-share' }
      ],
      checkList: ['1']
    }
  }
}
</script>
<style lang="scss" scoped>
.search-center-container {
  background: #fff;
  height: calc(100vh - 80px);
  margin-top: -12px;
  overflow: auto;
  .search-center-header {
    background: #F4F6FA;
    height: 100px;
    padding-top: 15px;
    box-sizing: border-box;
    .header-box {
      width: 1000px;
      margin: 0 auto;
      .search {
        display: flex;
        &::v-deep{
          .el-input .el-input__inner {
            height: 40px;
            line-height: 40px;
          }
          .el-button {
            width: 85px;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            position: relative;
            left: -2px;
          }
        }
      }
      .type-list {
        display: flex;
        margin-top: 2px;
        span {
          padding: 12px 0;
          margin-right: 32px;
          border-bottom: 2px solid #F4F6FA;
          cursor: pointer;
          color: rgba(25, 31, 36, 0.64);
          &:hover,&.active {
            border-color: #4285F4;
            color: #191F24;
          }
        }
      }
    }
    .content-box {
      width: 1000px;
      margin: 0 auto;
      .tips {
        margin: 15px 0;
        text-align: center;
        font-size: 12px;
        color: rgba(25, 31, 36, 0.48);
      }
      .news-list {
        padding: 0 15px;
        &-item {
          padding: 15px 0;
          .title {
            font-size: 18px;
            color: #4285F4;
            margin-bottom: 14px;
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
          }
          .desc {
            color: rgba(25, 31, 36, 0.64);
            margin-bottom: 10px;
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            line-height: 20px;
          }
          .other {
            height: 16px;
            font-size: 12px;
            color: rgba(25, 31, 36, 0.48);
            line-height: 16px;
          }
        }
      }
    }
  }
}
</style>
