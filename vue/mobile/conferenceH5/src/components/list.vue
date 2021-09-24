<!--
 * @Descripttion:
    此组件为上拉 / 下拉 加载更多组件。
    父组件必须设置 @onRefresh="onRefresh" 和 @onLoad="onLoad" 在两个函数中处理params的值，例如页码、参数等等。
    此组件需要搭配CSS使用：最外层元素 list-container 的height值和top值要根据具体业务页面来设定，默认高度100%且置顶。
    如果开启clear，需要设置父组件clear: false，父组件通过 @resetClear="resetClear" 接收且执行 this.clear = false。
    如果开启cut，需要设置父组件cut: val，val的值应该为需要删除的下标index, 父组件通过 @resetCut="resetCut" 接收且执行 this.cut = ''。
    loadFinish事件，表示list已经完成接口请求，父组件通过调用loadFinish事件，list组件将loadFinish事件emit出去，并将数据带到父组件去
 * @Author: zhaohx
 * @Date: 2021-06-27 17:55:55
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-25 16:05:45
-->
<template>
  <div :class="['list-container', customClass]">
    <van-pull-refresh v-model="isLoading" v-if="listData.length" @refresh="onRefresh" style="height: 100%">
      <van-list
        v-if="listData.length"
        v-model="loading"
        :finished="finished"
        :finished-text="finishedText"
        :immediate-check="false"
        @load="onLoad"
        >
          <div class="list-item-container">
            <slot name="item" :data="listData" />
          </div>
      </van-list>
      <!-- <van-empty
        v-if="!listData.length"
        :image="dataNull"
        :description="nullText"
      /> -->
    </van-pull-refresh>
    <van-empty v-if="!listData.length" :image="dataNull" :description="nullText" />
  </div>
</template>

<script>
import dataNull from '@/assets/images/dataNull.png'
export default {
  props: {
    // 请求接口的地址
    // httpUrl: {
    //   type: String,
    //   default: ''
    // },
    // 内含httpParams为请求接口的字段和值
    params: {
      type: Object,
      default: () => {}
    },
    // 是否将listData数据清空 - 加载更多需要借助push / unshift完成，但是有的场景需要将数据清空，此时传clear为true即可
    clear: {
      type: Boolean,
      default: false
    },
    // 是否执行删除逻辑 - 针对不需要clear清空 只需要删除个别数据的业务逻辑
    cut: {
      type: String,
      default: ''
    },
    // 当数据为空时候的提示文字，默认为 '这里什么都没有哦！'
    nullText: {
      type: String,
      default: '这里什么都没有哦！'
    },
    customClass: {
      type: String,
      default: ''
    }
    // finishedText: {
    //   type: String,
    //   default: '没有更多了'
    // }
  },
  data() {
    return {
      dataNull,
      finishedText: '没有更多了',
      listData: [],
      // 下拉时是否处于加载状态
      isLoading: false,
      // 每次onload需要先将loading设为true 请求完接口再设置为false
      loading: false,
      // 所有数据已经请求完毕
      finished: false,
      // 添加加载开关，以免对此重复请求接口
      scrollFlag: true,
      // 数据是否真正结束了 - tab切换时List的onLoad事件不会触发 根据realFinished字段来判断是否真正加载完毕
      realFinished: false
    }
  },
  watch: {
    params: {
      handler(newVal) {
        if (this.clear) {
          this.realFinished = false
          this.listData = []
        }
        setTimeout(() => {
          if (!this.realFinished) {
            this.finished = false
          }
          this.getList(newVal.type)
        })
      },
      // immediate: true,
      deep: true
    },
    cut: {
      handler(newVal) {
        if (newVal) {
          this.listData.splice(newVal, 1)
          this.$emit('resetCut')
        }
      }
    }
  },
  methods: {
    getList(type = 'up') {
      if (this.scrollFlag) {
        if (type === 'down') {
          // window.location.reload()
          window.location.reload()
          return false
        }
        this.scrollFlag = false
        this.$api({
          url: this.params.httpUrl,
          data: this.params.httpParams
        })
          .then(res => {
            if (res.code === 2000) {
              const data = res.result.list
              console.log(data)
              // data.forEach(ele => {
              //   ele.checked = false
              // })
              data.forEach(ele => {
                this.listData.push(ele)
                // type === 'down' ? this.listData.unshift(ele) : this.listData.push(ele)
              })
              this.isLoading = false
              this.loading = false
              this.scrollFlag = true
              // 最大可分页的数量
              const maxPageSize = Math.ceil(res.result.total / this.params.httpParams.pageSize)
              if (this.params.httpParams.pageNum >= maxPageSize) {
                this.finished = true
                this.realFinished = true
                // setTimeout(() => {
                //   this.finishedText = ' '
                // }, 1000)
              } else {
                this.realFinished = false
              }
              // if (!data.length) {
              //   this.finishedText = ''
              // }
              this.$emit('loadFinish', res)
            }
          })
          .catch(() => {
            this.listData = []
            this.finished = true
            this.isLoading = false
            this.loading = false
            this.scrollFlag = true
            this.realFinished = false
            this.finishedText = ''
          })
          .finally(() => {
            this.$emit('resetClear')
          })
      }
    },
    onRefresh() {
      this.$emit('onRefresh')
    },
    onLoad() {
      console.log('无法触发')
      this.loading = true
      this.$emit('onLoad')
    }
  }
}
</script>

<style lang="scss" scoped>
.list-container::v-deep {
  width: 100%;
  height: 100%;
  padding: 0 16px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9;
  .list-item-container {
    .list-item:nth-last-of-type(1) {
      margin-bottom: 0;
    }
  }
  .van-pull-refresh {
    overflow-y: scroll;
    padding-top: 10px;
    // height: calc(100% - 231px);
  }
  .van-empty__image {
    width: 176px;
    height: 103px;
  }
}
</style>
