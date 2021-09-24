<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-04 20:09:53
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-11 14:16:36
-->
<template>
  <div class="manage-use-car-container">
    <div class="tabs-type">
      <div
        v-for="(ele, index) in tabsTypeData"
        :key="ele.text"
        class="tabs-type-item"
        :class="ele.checked ? 'tabs-type-item-checked' : ''"
        @click="tabsTypeHandle(index)"
      >
        {{ ele.text }}
        <i :class="ele.checked ? 'show' : ''"></i>
      </div>
    </div>
    <list
      :params="params"
      :clear="clear"
      @resetClear="resetClear"
      @onRefresh="onRefresh"
      @onLoad="onLoad"
    >
      <template v-slot:item="data">
        <div
          v-for="(ele, index) in data.data"
          :key="index"
          class="list-item"
          @click="linkDetail(ele)"
        >
          <div class="pic">
            <img src="@/assets/images/vip.svg" alt="">
          </div>
          <dl>
            <dt>
              {{ ele.cardName }}
              <div class="num">
                可用{{ ele.remainCount }}张 | 共{{ ele.totalCount }}张
              </div>
            </dt>
            <dd>
              有效期：{{ validityTime(ele.effectiveTime, ele.invalidTime) }}
            </dd>
          </dl>
        </div>
      </template>
    </list>
  </div>
</template>

<script>
import list from '@/components/list'
export default {
  components: { list },
  props: {
    routeParams: {
      default: Object
    }
  },
  data() {
    return {
      // 当前选中的是嘉宾证还是车证
      tabsIndex: 0,
      tabsTypeData: [
        { text: '嘉宾证', checked: true, cardType: '1' },
        { text: '车证', checked: false, cardType: '2' }
      ],
      filterInput: {
        // 车牌号筛选
        platNumLike: '',
        // 出发地筛选
        startAddressLike: '',
        // 目的地筛选
        endAddressLike: ''
      },
      // 筛选条件车型
      modelListData: [],
      params: {
        httpUrl: 'manage.getCardList',
        type: 'up',
        httpParams: {
          conferenceId: '',
          cardType: '1',
          pageNum: 1,
          pageSize: 10
        }
      },
      clear: false
    }
  },
  computed: {
    validityTime() {
      return function(effectiveTime, invalidTime) {
        let result = '-'
        if (effectiveTime && invalidTime) {
          result = `${effectiveTime.slice(0, -9)} - ${invalidTime.slice(0, -9)}`
        }
        return result
      }
    }
  },
  created() {
    console.log(this.routeParams)
    const id = this.routeParams.id
    this.$nextTick(() => {
      this.params.httpParams.conferenceId = id
    })
  },
  methods: {
    linkDetail(ele) {
      const name = this.tabsIndex === 0 ? 'manageCardPerson' : 'manageCardCars'
      console.log(ele)
      this.$router.push({
        name,
        query: {
          [this.$enc('cardId')]: this.$enc(ele.id),
          [this.$enc('conferenceId')]: this.$enc(this.routeParams.id),
          [this.$enc('cardName')]: this.$enc(ele.cardName),
          [this.$enc('cardStatus')]: this.$enc(ele.cardStatus),
          [this.$enc('remainCount')]: this.$enc(ele.remainCount),
          [this.$enc('totalCount')]: this.$enc(ele.totalCount)
        }
      })
    },
    tabsTypeHandle(index) {
      // 当前选中的不允许点击
      if (this.tabsTypeData[index].checked) {
        return
      }
      this.tabsTypeData.forEach(ele => {
        ele.checked = false
      })
      this.tabsTypeData[index].checked = true
      this.tabsIndex = index
      const cardType = this.tabsTypeData[index].cardType
      this.clear = true
      this.params.httpParams.cardType = cardType
      this.params.httpParams.pageNum = 1
    },
    resetClear() {
      this.clear = false
    },
    onRefresh() {
      this.params.httpParams.pageNum++
      this.params.type = 'down'
    },
    onLoad() {
      this.params.httpParams.pageNum++
      this.params.type = 'up'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.manage-use-car-container{
  min-height: 100%;
  background-color: #f8f8f8;
  .tabs-type {
    width: 100%;
    height: 54px;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    padding: 0 16px;
    @include list(row,space-between,center);
    .tabs-type-item {
      width: 164px;
      height: 38px;
      line-height: 38px;
      text-align: center;
      font-size: 15px;
      border-radius: 22px;
      color: rgba(25, 31, 36, 0.64);
      i {
        display: none;
        width: 30px;
        height: 3px;
        background: linear-gradient(270deg, #40BEFF 0%, #1E89FF 100%);
        border-radius: 2px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 4px;
      }
    }
    .tabs-type-item-checked {
        color: rgba(25, 31, 36, 1);
        background-color: rgba(25, 31, 36, 0.04);
        font-weight: 500;
    }
  }
  .list-container {
    height: calc(100% - 54px);
    top: 54px;
    // padding-top: 12px;
    .list-item {
      width: 100%;
      border-radius: 8px;
      background-color: #fff;
      overflow: hidden;
      padding: 16px;
      margin-bottom: 12px;
      @include list(row,flex-start,center);
      .pic {
        width: 48px;
        height: 48px;
        margin-right: 8px;
      }
      dl {
        height: 48px;
        flex: 1;
        dt {
          font-size: 16px;
          font-weight: 500;
          line-height: 26px;
          @include list(row,space-between,center);
          margin-bottom: 8px;
          .num {
            font-size: 13px;
            color: rgba(25, 31, 36, 0.64);
            font-weight: normal;
          }
        }
        dd {
          font-size: 13px;
          color: rgba(25, 31, 36, 0.64);
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.manage-use-car-container::v-deep {
  .van-pull-refresh {
    padding-top: 12px;
  }
}
</style>

