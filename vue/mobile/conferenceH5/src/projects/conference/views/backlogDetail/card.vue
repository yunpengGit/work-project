<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-04 20:09:53
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-20 11:40:45
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
      ref="list"
      :params="params"
      :clear="clear"
      @resetClear="resetClear"
      @onRefresh="onRefresh"
      @onLoad="onLoad"
      @loadFinish="loadFinish"
    >
      <template v-slot:item="data">
        <div
          v-for="(ele, index) in data.data"
          :key="index"
          class="list-item"
        >
          <div class="pic" @click="choice(ele, index)"><img :src="ele.checked ? choose : chooseDefault" alt=""></div>
          <dl>
            <dt>
              {{ ele.cardName }}
              <div class="num">
                剩余{{ ele.remainCount }}张
              </div>
            </dt>
            <dd>
              有效期：{{ validityTime(ele.effectiveTime, ele.invalidTime) }}
            </dd>
          </dl>
        </div>
      </template>
    </list>
    <div class="single-btn-bottom single-btn-bottom-allow" v-if="isLoading">
      <van-button type="info" @click="submit">确认分配</van-button>
    </div>
    <van-popup
      v-model="submitShow"
      position="bottom"
      :style="{ width: '100%' }"
      round
    >
      <div class="submit-container">
        <h3>选择下一步操作</h3>
        <ul>
          <li v-for="(ele, index) in submitData" :key="index" @click="submitChoice(index)">
            <img :src="ele.checked ? checkedIcon : ''" alt="">
            <span>{{ ele.name }}</span>
          </li>
        </ul>
        <i />
        <van-button type="info" @click="submitFinnal">确定</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import list from '@/components/list'
import chooseDefault from '@/assets/images/chooseDefault.svg'
import choose from '@/assets/images/choose.svg'
import checkedIcon from '@/assets/images/checked.svg'
export default {
  components: { list },
  props: {
    routeParams: {
      default: Object
    }
  },
  data() {
    return {
      submitShow: false,
      submitData: [
        { name: '分配完成', checked: true },
        { name: '继续分配', checked: false },
        { name: '稍后分配', checked: false }
      ],
      chooseDefault, choose, checkedIcon,
      isLoading: false,
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
    submitFinnal() {
      let indexChoice = null
      this.submitData.forEach((ele, index) => {
        if (ele.checked) {
          indexChoice = index
        }
      })
      if (indexChoice === 0) {
        // 分配完成
        this.$dialog.confirm({
          title: '确定完成票证分配任务',
          message: '确认完成？',
          className: 'customDialog'
        }).then(() => {
          // ignoreTask
          const conferenceId = this.routeParams.id
          const attendeeId = this.routeParams.attendeeId
          const taskType = this.routeParams.taskType
          const param = {
            conferenceId, attendeeId, type: taskType, result: 100
          }
          console.log(this.routeParams)
          this.$api({
            url: 'task.ignoreTask',
            data: [param]
          }).then(res => {
            if (res.code === 2000) {
              this.$toast.success('分配完成')
              setTimeout(() => {
                if (sessionStorage.getItem('isJumpToHome')) {
                  sessionStorage.removeItem('isJumpToHome')
                  this.$router.replace({
                    name: 'conferenceDesk',
                    query: {
                      [this.$enc('id')]: this.$enc(this.routeParams.id)
                    }
                  })
                } else {
                  this.$router.go(-2)
                }
                // this.$router.go(-2)
                // this.$router.replace({
                //   name: 'backlog',
                //   [this.$enc('id')]: this.$enc(this.routeParams.id)
                // })
              })
            }
          })
        }).catch(() => {
          this.$toast('取消')
        })
      } else if (indexChoice === 1) {
        // 继续分配
        this.submitShow = false
      } else if (indexChoice === 2) {
        // 稍后分配
        this.$router.go(-1)
      }
    },
    submitChoice(index) {
      this.submitData.forEach(ele => {
        ele.checked = false
      })
      this.submitData[index].checked = true
    },
    submit() {
      const res = []
      this.$refs.list.listData.forEach(ele => {
        if (ele.checked) {
          res.push(ele)
        }
      })
      if (!res.length) {
        this.$toast('请至少选择一个票证')
        return false
      }
      this.$dialog.confirm({
        title: `为此参会人分配票证`,
        message: '确认分配？',
        className: 'customDialog'
      }).then(() => {
        const attendeeId = this.routeParams.attendeeId
        const cardUserInfo = JSON.parse(sessionStorage.getItem('cardUserInfo'))
        const params = {
          attendeeVOList: [
            {
              id: attendeeId,
              fixAttributeVO: {
                organizationName: cardUserInfo.fixAttributeCommonVO.organizationName,
                organizationSortName: cardUserInfo.fixAttributeCommonVO.organizationSortName
              }
            }
          ],
          card: {
            cardStatus: this.tabsIndex + 1,
            id: res[0].id
          }
        }
        this.$api({
          url: 'manage.addCardPerson',
          data: params
        }).then(res => {
          this.$toast.success('分配成功')
          this.submitShow = true
        })
      }).catch(() => {
        this.$toast('取消分配')
      })
    },
    // 单选及反选
    choice(ele, index) {
      this.$refs.list.listData.forEach((ele, indexChoice) => {
        if (index === indexChoice) {
          ele.checked = !ele.checked
        } else {
          ele.checked = false
        }
        this.$set(this.$refs.list.listData, indexChoice, ele)
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
    },
    loadFinish(result) {
      const data = result.result.list
      data.forEach(ele => {
        ele.checked = false
      })
      this.isLoading = true
    }
  }
  // destroyed() {
  //   sessionStorage.removeItem('cardUserInfo')
  // }
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
    padding-bottom: 64px;
    .list-item {
      width: 100%;
      border-radius: 8px;
      background-color: #fff;
      overflow: hidden;
      padding: 16px;
      margin-top: 12px;
      @include list(row,flex-start,center);
      .pic {
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
  .single-btn-bottom {
    position: fixed;
    background-color: #fff;
    z-index: 9;
    @include list(row, space-between,center);
    .van-button {
      width: 167px;
    }
    .van-button__text {
      font-size: 15px;
    }
  }
  .single-btn-bottom-allow {
    .van-button {
      width: 100%;
    }
  }
  .submit-container {
    h3 {
      width: 100%;
      height: 40px;
      font-size: 14px;
      text-align: center;
      line-height: 40px;
      color: rgba(25, 31, 36, 0.64);
      border-bottom: 1px solid #eeeeef;
    }
    li {
      width: 100%;
      font-size: 17px;
      line-height: 56px;
      padding: 0 16px;
      border-bottom: 1px solid #eeeeef;
      @include list(row, flex-start, center);
      img {
        margin-right: 16px;
      }
    }
    i {
      display: block;
      width: 100%;
      height: 16px;
      background-color: rgba(25, 31, 36, 0.04);
    }
    .van-button {
      width: 100%;
      height: 56px;
    }
  }
}
</style>
