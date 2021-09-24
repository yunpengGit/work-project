<!--
* @Descripttion:
* @Author: wanghz
* @Date: 2021-07-16 15:44:00
* @LastEditors: Please set LastEditors
* @LastEditTime:
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
      <div class="car-people-top">
        <span>{{
          auditItem.data.vehicleTaskType === '1'
            ? '接站用车'
            : auditItem.data.vehicleTaskType === '2'
            ? '送站用车'
            : auditItem.data.vehicleTaskType === '3'
            ? '会议用车'
            : '专车'
        }}</span>
        <span
          >{{ auditItem.data.vehicleTypeName }} | {{ auditItem.data.vehicleColor }}&nbsp;&nbsp;{{
            auditItem.data.platNum
          }}</span
        >
      </div>
    </div>
    <list
      ref="list"
      nullText="暂无信息"
      :params="params"
      :customClass="routeParams.status !== '0' ? 'list-container-checked' : ''"
      @onRefresh="onRefresh"
      @onLoad="onLoad"
      :clear="clear"
      @loadFinish="loadFinish"
    >
      <template v-slot:item="data">
        <div v-for="(ele, index) in data.data" :key="index" class="msg-item">
          <div class="photo">
            <img
              :src="
                ele.fixAttributeCommonVO.photoUrl
                  ? ele.fixAttributeCommonVO.photoUrl
                  : ele.fixAttributeCommonVO.sex === '2'
                  ? femaleSex
                  : male
              "
              alt=""
            />
          </div>
          <div class="car-people-info">
            <div
              class="car-people-title"
              :style="{ 'margin-bottom': ele.tagVOs && ele.tagVOs.length ? '7px' : '16px' }"
            >
              <span class="name">{{ ele.fixAttributeCommonVO.attendeeName }}</span
              ><span class="line" v-if="ele.fixAttributeCommonVO.position"></span
              ><span class="position">{{ ele.fixAttributeCommonVO.position }}</span>
              <span class="msg-tip"></span>
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
            <div class="company">{{ ele.fixAttributeCommonVO.organizationName }}</div>
            <div class="phone" v-if="ele.fixAttributeCommonVO.phone">
              <span>{{ ele.phoneShow ? ele.fixAttributeCommonVO.phone : phone(ele.fixAttributeCommonVO.phone) }}</span>
              <img :src="ele.phoneShow ? hideDark : show" alt="" @click="phoneChange(index)" />
            </div>
          </div>
        </div>
      </template>
    </list>
    <div class="single-btn-bottom single-btn-bottom-allow" v-if="auditItem.auditStatus === 2">
      <van-button type="info" @click="submit">确认审核</van-button>
    </div>
    <van-overlay :show="batchChoiceShow" z-index="9" @click="batchChoiceShow = false">
      <div class="batch-choice" @click.stop>
        <dl>
          <dt>正在审核用车安排</dt>
          <dd>请选择审核意见，用餐安排会在审核通过后自动发布，用餐人员可通过“会议安排”实时查看</dd>
        </dl>
        <ul>
          <li><van-button type="info" @click="submitFinnal(true)">审核通过</van-button></li>
          <li><van-button type="danger" @click="submitFinnal(false)">审核不通过</van-button></li>
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
      male,
      femaleSex,
      show,
      hideDark,
      // 审核弹窗
      batchChoiceShow: false,
      // 搜索值
      searchVal: '',
      // 当前任务信息
      auditItem: {},
      params: {
        httpUrl: 'message.getVehicleAttendees',
        type: 'up',
        httpParams: {
          conferenceId: '',
          taskId: '',
          nameOrPositionOrTag: '',
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
    const conferenceId = this.routeParams.conferenceId
    const auditItem = JSON.parse(this.routeParams.auditItem)
    this.auditItem = auditItem
    this.$nextTick(() => {
      this.params.httpParams.conferenceId = conferenceId
      this.params.httpParams.taskId = this.auditItem.data.id
    })
  },
  methods: {
    // 查询
    search() {
      this.clear = true
      this.params.httpParams.nameOrPositionOrTag = this.searchVal
    },
    // 清除搜索框内容
    clearSearchValue() {
      this.clear = true
      this.params.httpParams.nameOrPositionOrTag = ''
    },
    // 审核弹窗选择审核状态
    submitFinnal(auditStatus) {
      this.batchChoiceShow = false
      const params = {}
      params.type = 1
      params.auditStatus = auditStatus
      params.ids = [this.auditItem.auditTaskId]
      this.$api({
        url: 'message.setAudit',
        data: params
      })
        .then(res => {
          this.$toast.success('审核成功')
          setTimeout(() => {
            this.$router.back()
          }, 300)
        })
        .catch(err => {
          const msg = err.message
          this.$toast(msg)
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
      // this.params.httpParams.auditTaskId
      const data = result.result.list

      data.forEach(ele => {
        ele.phoneShow = false
      })
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
    .car-people-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
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
        border-radius: 4px;
        overflow: hidden;
      }
    }
    .car-people-info {
      background-color: #fff;
      width: 100%;
      .car-people-title {
        margin-bottom: 16px;
        .name {
          height: 22px;
          font-size: 17px;
          font-weight: 500;
          color: #191f24;
          line-height: 22px;
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
      .company {
        font-size: 15px;
        font-weight: 400;
        color: #191f24;
        line-height: 20px;
        margin-bottom: 8px;
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
