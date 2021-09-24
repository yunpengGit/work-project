<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-27 16:48:37
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-25 22:55:28
-->
<template>
  <div class="search-container">
    <van-search
      ref="search"
      v-model="searchVal"
      shape="round"
      background="#fff"
      placeholder="请输入会议名称、地点、城市或主办单位搜索"
      @search="search"
    />
    <ul v-if="historyData.length" class="history-tips-container">
      <li>搜索历史</li>
      <li class="checked" @click="clearHistory">全部清空</li>
    </ul>
    <div class="history-container">
      <ul class="history-content">
        <li
          v-for="(ele, index) in historyData"
          :key="index"
        >
          <span @click="linkSearchList(index)">{{ ele.text }}</span>
          <div class="search-del" @click.prevent="delHistory(index)"><img src="@/assets/images/searchDel.svg" alt=""></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchVal: '',
      historyData: []
    }
  },
  created() {
    const historyData = localStorage.getItem('historyData') ? JSON.parse(localStorage.getItem('historyData')) : null
    historyData && (this.historyData = historyData)
    setTimeout(() => {
      document.querySelector('.van-field__control').focus()
    })
  },
  methods: {
    search() {
      const searchVal = this.searchVal
      const isExist = this.historyData.findIndex(ele => ele.text === this.searchVal)
      if (isExist !== -1) {
        if (this.historyData.length > 1) {
          const del = this.historyData.splice(isExist, 1)
          this.historyData.unshift(del[0])
        }
      } else {
        this.historyData.unshift({ text: this.searchVal })
      }
      localStorage.setItem('historyData', JSON.stringify(this.historyData))
      this.$router.replace({
        path: 'searchList',
        query: {
          [this.$enc('searchVal')]: this.$enc(searchVal)
        }
      })
    },
    linkSearchList(index) {
      const searchVal = this.historyData[index].text
      const isExist = this.historyData.findIndex(ele => ele.text === searchVal)
      if (isExist !== -1) {
        if (this.historyData.length > 1) {
          const del = this.historyData.splice(isExist, 1)
          this.historyData.unshift(del[0])
        }
      }
      localStorage.setItem('historyData', JSON.stringify(this.historyData))
      this.$router.replace({
        path: 'searchList',
        query: {
          [this.$enc('searchVal')]: this.$enc(searchVal)
        }
      })
    },
    // 单条历史记录删除
    delHistory(index) {
      this.historyData.splice(index, 1)
      localStorage.setItem('historyData', JSON.stringify(this.historyData))
    },
    // 全部清空
    clearHistory() {
      this.$dialog.confirm({
        message: '是否清空所有搜索历史？',
        className: 'customDialog'
      }).then(() => {
        this.historyData = []
        localStorage.removeItem('historyData')
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.search-container {
  min-height: 100%;
  background: rgba(25, 31, 36, 0.04);
  .history-tips-container {
    width: 100%;
    line-height: 44px;
    padding: 0 16px;
    border-top: 1px solid #ebedf0;
    border-bottom: 1px solid #ebedf0;
    @include list(row,space-between,center);
  }
  .history-container {
    position: fixed;
    left: 0;
    top: 97px;
    width: 100%;
    height: calc(100% - 97px);
    overflow-y: scroll;
    li {
      width: 100%;
      padding: 0 16px;
      line-height: 56px;
      position: relative;
      @include list(row,space-between,center);
      background-color: #fff;
      > span {
        flex: 1;
        margin-right: 16px;
      }
      &::after {
        content: '';
        display: block;
        width: calc(100% - 16px);
        height: 1px;
        background-color: #ebedf0;
        @include absolute('', 0, 0, '');
      }
      &:nth-last-of-type(1) {
        &::after {
          display: none;
        }
      }
      .search-del {
        // width: 56px;
        height: 56px;
        @include list(row,flex-end,center);
      }
    }
  }
}
</style>
