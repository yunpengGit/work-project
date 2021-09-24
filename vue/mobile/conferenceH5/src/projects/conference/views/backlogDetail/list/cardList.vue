<template>
  <div class="manage-use-car-container">
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
        >
          <div class="cardFace">
            <p class="cardFaceTop">
               <van-popover
                v-model="showPopover[index]"
                theme="dark"
                :actions="popoverText"
                placement="bottom-end"
                trigger="click"
                @select="cardCancel(ele, ...arguments)"
              >
                <template #reference>
                  <b>···</b>
                </template>
              </van-popover>
            </p>
            <span class="cardname"> VIP{{ ele.cardName }}</span>
            <p>有效期：{{ validityTime(ele.effectiveTime, ele.invalidTime) }}</p>
          </div>
          <p class="cardExplain">
           <img src="@/assets/images/explainIcon.png" alt="">证件使用说明：仅可用于本次会议VIP嘉宾授权使用
          </p>
        </div>
      </template>
    </list>
  </div>
</template>

<script>
import list from '@/components/list'
import { Toast } from 'vant'
export default {
  components: { list },
  props: {
    routeParams: {
      default: Object
    }
  },
  data() {
    return {
      // 筛选条件车型
      modelListData: [],
      params: {
        httpUrl: 'plan.getCardList',
        type: 'up',
        httpParams: {
          conferenceId: '',
          attendeeId: '',
          pageNum: 1,
          pageSize: 10
        }
      },
      popoverText: [{ text: '取消任务' }],
      clear: false,
      showPopover: []
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
    const attendeeId = this.routeParams.attendeeId
    const id = this.routeParams.id
    this.$nextTick(() => {
      this.params.httpParams.conferenceId = id
      this.params.httpParams.attendeeId = attendeeId
    })
  },
  methods: {
    cardCancel(ele, popoverText) {
      this.$dialog.confirm({
        title: `是否取消该任务？`,
        message: '确认删除？',
        className: 'customDialog'
      }).then(() => {
        const attendeeId = this.routeParams.attendeeId
        const id = ele.id
        const cardStatus = 6
        const organizationName = ele.organizationName
        const organizationSortName = ele.organizationSortName
        const description = ele.description
        if (ele.cardType === 1) {
          const params = {
            attendee: {
              id: attendeeId
            },
            card: {
              cardStatus,
              description,
              id,
              organizationName,
              organizationSortName
            }
          }
          this.$api({
            url: 'plan.updateGuesCard',
            data: params
          }).then(res => {
            if (res.code === 2000) {
              Toast('取消任务成功')
              window.location.reload()
            }
          }).catch(err => {
            Toast(err.message)
          })
        }
      })
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
   .list-container {
    // height: calc(100% - 54px);
    // top: 54px;
    height: calc(100% - 110px);
    padding: 24px 16px 50px;
    margin: 100px 0;
    .list-item {
      width: 100%;
      // border-radius: 8px;
      // background-color: #fff;
      // overflow: hidden;
      // padding:0 16px;
      margin-bottom: 12px;
      // @include list(row,flex-start,center);
      .cardFace{
        width: 100%;
        height: 150px;
        border-radius: 8px;
        background: url('../../../../../assets/images/cardBg.png') no-repeat;
        background-size: 100% 100%;
        overflow: hidden;
        // margin-bottom: 12px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: rgba(162, 162, 162, 1);
        padding: 10px;
        position: relative;
        .cardFaceTop{
          width: 100%;
          display: flex;
          justify-content: flex-end;
          b{
            font-size: 20px;
            font-weight: 600;
          }
        }
        .cardname{
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%);
          background: linear-gradient(180deg, #FFEEC1 0%, #D4BD8E 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 30px;
          font-weight: 900;
          font-family: PingFangSC-Semibold, PingFang SC;
        }
        p{
          height: 30px;
          display: flex;
          align-items: center;
        }
      }
      .cardExplain{
        width: 100%;
        margin-top: 10px;
        display: flex;
        align-items: center;
        img{
          width: 15px;
          height: 15px;
        }
      }
      // .pic {
      //   width: 48px;
      //   height: 48px;
      //   margin-right: 8px;
      // }
      // dl {
      //   height: 48px;
      //   flex: 1;
      //   dt {
      //     font-size: 16px;
      //     font-weight: 500;
      //     line-height: 26px;
      //     @include list(row,space-between,center);
      //     margin-bottom: 8px;
      //     .num {
      //       font-size: 13px;
      //       color: rgba(25, 31, 36, 0.64);
      //       font-weight: normal;
      //     }
      //   }
      //   dd {
      //     font-size: 13px;
      //     color: rgba(25, 31, 36, 0.64);
      //   }
      // }
    }
  }
}
</style>
