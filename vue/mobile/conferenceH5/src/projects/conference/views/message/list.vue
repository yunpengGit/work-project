<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-08-15 22:46:13
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-31 09:11:32
-->
<template>
  <div class="message-detail-container">
    <div class="car-people-search">
      <van-search
        v-model="searchVal"
        shape="round"
        background="#fff"
        autofocus
        left-icon=""
        placeholder="输入姓名、职务或标签查询"
        @search="search"
        @clear="clearSearchValue"
      />
      <img class="search-icon" src="@/assets/images/search.svg" alt="" />
      <div class="person-time">报名审核通知 | 推送人次：{{personNumber}}</div>
    </div>
    <list
      ref="list"
      nullText="暂无信息"
      :params="params"
      :customClass="routeParams.status !== '0' ? 'list-container-checked':''"
      @onRefresh="onRefresh"
      @onLoad="onLoad"
      @loadFinish="loadFinish"
      :clear="clear"
      @resetClear="resetClear"
    >
      <template v-slot:item="data">
        <div
          v-for="(ele, index) in data.data"
          :key="index"
          class="msg-item"
        >
          <div class="photo">
            <img :src="ele.photoUrl ? ele.photoUrl : ele.sex === '2' ? femaleSex : male" alt="" />
          </div>
          <div class="car-people-info">
            <div
              class="car-people-title"
              :style="{ 'margin-bottom': ele.tagVOs && ele.tagVOs.length ? '7px' : '16px' }"
            >
              <span class="name">{{ ele.userName }}</span
              ><span class="line" v-if="ele.position"></span><span class="position">{{ ele.position }}</span>
              <span class="msg-tip">{{ ele.tplScope === 0 ? 'IM信息' : '短信信息' }}</span>
            </div>

            <div class="tag" v-if="ele.tagVOs && ele.tagVOs.length">
              <span
                class="tag-item"
                v-for="(eleChild, indexChild) in ele.tagVOs"
                :key="indexChild"
                :style="{ color: eleChild.fontColor, backgroundColor: eleChild.backgroundColor }"
              >
                {{ eleChild.name }}
              </span>
            </div>
            <div class="company">{{ ele.organizationName }}</div>
            <div class="phone" v-if="ele.userPhone">
              <span>{{ ele.phoneShow ? ele.userPhone : phone(ele.userPhone) }}</span>
              <img :src="ele.phoneShow ? hideDark : show" alt="" @click="phoneChange(index)" />
            </div>
          </div>
        </div>
      </template>
    </list>
    <div class="single-btn-bottom single-btn-bottom-allow" v-if="isLoading && routeParams.status === '0'">
      <van-button
        type="info"
        @click="submit"
      >确认审核</van-button>
    </div>
    <van-overlay :show="batchChoiceShow" z-index="9" @click="batchChoiceShow=false">
      <div class="batch-choice" @click.stop>
        <dl>
          <dt>消息审核</dt>
          <dd>请选择审核意见，消息通知会在审核通过后按策略推送</dd>
        </dl>
        <ul>
          <li><van-button type="info" @click="submitFinnal(1)">审核通过</van-button></li>
          <li><van-button type="danger" @click="submitFinnal(2)">审核不通过</van-button></li>
          <li @click="batchChoiceShow = false"><van-button type="default">取消</van-button></li>
        </ul>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import list from '@/components/list'
import male from '@/assets/images/male.png'
import femaleSex from '@/assets/images/femaleSex.png'
import show from '@/assets/images/showDark.svg'
import hideDark from '@/assets/images/hideDark.svg'
export default {
  components: { list },
  props: {
    routeParams: {
      type: Object
    }
  },
  data() {
    return {
      male, femaleSex, show, hideDark,
      // 搜索值
      searchVal: '',
      // 推送人次
      personNumber: 0,
      batchChoiceShow: false,
      isLoading: false,
      params: {
        httpUrl: 'message.getMsgDetailList',
        type: 'up',
        httpParams: {
          conferenceId: '',
          templatelogId: '',
          total: 0,
          pageNum: 1,
          pageSize: 10
        }
      },
      clear: false
    }
  },
  computed: {
    // 手机号码隐藏中间四位
    phone() {
      return function(phone) {
        const result = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
        return result
      }
    }
  },
  created() {
    console.log(this.routeParams)
    const { conferenceId, templatelogId } = this.routeParams
    this.$nextTick(() => {
      this.params.httpParams.conferenceId = conferenceId
      this.params.httpParams.templatelogId = templatelogId
    })
  },
  methods: {
    // 查询
    search() {
      const { conferenceId, templatelogId } = this.routeParams
      this.clear = true
      this.params.httpParams = {
        conferenceId,
        templatelogId,
        attendeeNameOrPosition: this.searchVal,
        total: 0,
        pageNum: 1,
        pageSize: 10
      }
    },
    // 清除搜索框内容
    clearSearchValue() {
      this.clear = true
      this.params.httpParams.attendeeNameOrPosition = ''
    },
    // 审核弹窗选择审核状态
    submitFinnal(type) {
      this.batchChoiceShow = false
      const params = []
      const id = this.routeParams.templatelogId
      params.push({ id, verifyStatus: type })
      this.$api({
        url: 'message.setMsgStatus',
        data: params
      }).then(res => {
        this.$toast.success('审核成功')
        setTimeout(() => {
          this.$router.replace({
            name: 'messageList',
            query: {
              [this.$enc('templatelogId')]: this.$enc(this.routeParams.templatelogId),
              [this.$enc('conferenceId')]: this.$enc(this.routeParams.conferenceId),
              [this.$enc('status')]: this.$enc(-1)
            }
          })
        }, 300)
      })
    },
    // 确认审核
    submit() {
      this.batchChoiceShow = true
    },
    // 切换手机号码状态
    phoneChange(index) {
      const data = this.$refs.list.listData[index]
      data.phoneShow = !data.phoneShow
      this.$set(this.$refs.list.listData, index, data)
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
      this.personNumber = result.result.total
      const data = result.result.list
      data.forEach(ele => {
        ele.phoneShow = false
      })
      this.status = data[0].tplType
      this.isLoading = true
    },
    resetClear() {
      this.clear = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.message-detail-container {
  min-height: 100%;
  background-color: #f8f8f8;
  padding-bottom: 64px;
  .car-people-search {
    position: fixed;
    top: 0;
    width: 100%;
    .search-icon {
      position: absolute;
      top: 17px;
      left: 38px;
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
      background: linear-gradient(to left, #f5f7fd, #e8ecf9);
    }
    .person-time {
      height: 50px;
      line-height: 50px;
      padding: 0 16px;
      font-size: 13px;
    }
  }
  .list-container {
    height: calc(100% - 104px);
    top: 104px;
    padding: 0 0 64px;
  }
  ::v-deep .van-pull-refresh {
    padding-top: 0;
  }
  .list-container-checked {
    padding: 0;
  }
  .msg-item {
    background-color: #fff;
    display: flex;
    padding: 16px 20px;
    margin-bottom: 12px;
    .photo {
      width: 56px;
      height: 56px;
      border-radius: 4px;
      margin-right: 16px;
      img {
        width: 100%;
        overflow: hidden;
        border-radius: 4px;
      }
    }
    .car-people-info {
      background-color: #fff;
      flex: 1;
      .car-people-title {
        .name {
          height: 22px;
          font-size: 17px;
          font-weight: 500;
          color: #191f24;
          line-height: 22px;
          max-width: 30px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .line {
          display: inline-block;
          width: 1px;
          height: 16px;
          background: #eceded;
          margin: 0 12px;
        }
        .position {
          height: 20px;
          font-size: 15px;
          font-weight: 400;
          color: #191f24;
          line-height: 20px;
        }
        .msg-tip {
          float: right;
          height: 18px;
          font-size: 14px;
          font-weight: 400;
          color: #828587;
          line-height: 18px;
        }
      }
      .company {
        font-size: 15px;
        font-weight: 400;
        color: #191f24;
        line-height: 20px;
        margin-bottom: 8px;
      }
      .tag {
        margin-bottom: 10px;
        .tag-item {
          display: inline-block;
          margin-right: 5px;
          height: 16px;
          text-align: center;
          line-height: 16px;
          border-radius: 2px;
          padding: 0 5px;
        }
      }
      .phone {
        font-size: 15px;
        font-weight: 400;
        color: #191f24;
        @include list(row);
        img {
          margin-left: 15px;
        }
      }
    }
  }
  .batch-choice {
    width: 80%;
    background-color: #fff;
    @include absolute(50%, '', '', 50%);
    transform: translate(-50%, -50%);
    border-radius: 8px;
    overflow: hidden;
    padding: 16px 16px 0;
    dl {
      margin-bottom: 30px;
    }
    dt {
      font-size: 17px;
      margin-bottom: 20px;
      font-weight: 500;
    }
    dd {
      font-size: 14px;
      line-height: 18px;
    }
    li {
      margin-bottom: 10px;
      .van-button {
        width: 100%;
        padding: 0;
      }
    }
  }
}
</style>
