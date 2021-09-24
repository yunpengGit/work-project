<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-27 16:48:37
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-09-07 16:31:44
-->
<template>
  <div class="search-container">
    <van-search
      v-model="searchVal"
      shape="round"
      background="#fff"
      autofocus
      left-icon=""
      placeholder="请输入会议活动名称或主办方名称"
      @search="search"
    />
    <img class="search-icon" src="@/assets/images/search.svg" alt="" />
    <div class="line"></div>
    <ul v-if="historyData.length" class="history-tips-container">
      <li>搜索历史</li>
      <li class="checked" @click="clearHistory"><img src="@/assets/images/delete.svg" alt="" /></li>
    </ul>
    <div class="history-container" :style="{ top: historyData.length ? '120px' : '70px' }">
      <ul class="history-content">
        <li class="history-item" v-for="(ele, index) in historyData" :key="index" @click="linkSearchList(index)">
          <span>{{ ele.text }}</span>
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
      this.$router.replace({
        path: 'searchList',
        query: {
          [this.$enc('searchVal')]: this.$enc(searchVal)
        }
      })
    },
    // 单条历史记录删除
    delHistory(index) {
      console.log(index, 'index有值么？')
      this.historyData.splice(index, 1)
      localStorage.setItem('historyData', JSON.stringify(this.historyData))
    },
    // 全部清空
    clearHistory() {
      this.$dialog
        .confirm({
          message: '是否清空所有搜索历史？',
          className: 'attendeeDialog'
        })
        .then(() => {
          this.historyData = []
          localStorage.removeItem('historyData')
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.search-container {
  position: relative;
  background-color: #f2f5fc;
  height: 100%;
  .search-icon {
    position: absolute;
    top: 17px;
    left: 38px;
  }
  .line {
    background-color: #fff;
    border-bottom: 1px solid #ebecec;
    height: 7px;
  }
  .van-search {
    padding: 7px 10px 7px 20px;
  }
  .van-cell {
    align-items: center;
    ::v-deep .van-cell__value {
      padding-left: 32px;
    }
  }
  .van-search__content {
    height: 38px;
    line-height: 38px;
    background: linear-gradient(right, #f5f7fd, #e8ecf9);
  }
  ::v-deep .van-field__control {
    font-size: 16px;
    color: #191f24;
    font-weight: 400;
  }
  .history-tips-container {
    width: 100%;
    line-height: 52px;
    height: 52px;
    padding: 0 16px;
    background-color: #fff;
    @include list(row, space-between, center);
    li {
      font-size: 16px;
    }
    .checked {
      width: 17px;
      img {
        width: 100%;
      }
    }
  }
  .history-container {
    background-color: #f2f5fc;
    position: fixed;
    left: 0;
    top: 111px;
    width: 100%;
    height: calc(100% - 111px);
    overflow-y: scroll;
    .history-content {
      // display: flex;
      // @include list(row, space-between, center);
      // flex-wrap: wrap;
    }
    li {
      width: 50%;
      padding: 0 16px;
      line-height: 56px;
      font-size: 16px;
    }
  }
}
</style>
