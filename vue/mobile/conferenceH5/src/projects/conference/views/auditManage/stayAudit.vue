<!--
 * @Descripttion:
 * @Author: wanghz
 * @Date: 2021-08-25 20:08:44
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-31 09:17:56
-->
<template>
  <div class="car-audit">
    <div class="car-audit-search">
      <van-search
        v-model="searchVal"
        shape="round"
        background="#fff"
        autofocus
        left-icon=""
        placeholder="输入姓名或标签查询"
        @search="search"
        @clear="clearSearchValue"
      />
      <img class="search-icon" src="@/assets/images/search.svg" alt="" />
    </div>
    <list
      ref="list"
      nullText="暂无待审核信息"
      :params="params"
      @onRefresh="onRefresh"
      @onLoad="onLoad"
      @loadFinish="loadFinish"
      :clear="clear"
      @resetClear="resetClear"
    >
      <template v-slot:item="data">
        <div v-for="(ele, index) in data.data" :key="index" class="msg-item" @click="linkTo(ele, index)">
          <div class="audit-item-title">
            <div class="title-text">
              <div class="pic" :class="ele.auditStatus === 2 ? '' : 'pic-checked'" @click.stop="choice(ele, index)">
                <img :src="ele.checked ? choose : chooseDefault" alt="" />
              </div>
              <span
                >{{ ele.data.modelName }} <span v-if="ele.data.roomNo" style="font-weight: 700">·</span>
                {{ ele.data.roomNo }}</span
              >
            </div>
            <div class="audit-type">
              <span
                class="status"
                :class="ele.auditStatus === 2 ? 'in-review' : ele.auditStatus === 1 ? 'pass' : 'no-pass'"
              >
                {{ ele.auditStatus === 2 ? '待审核' : ele.auditStatus === 1 ? '审核通过' : '审核不通过' }}</span
              >
              <img src="@/assets/images/skip.svg" alt="" />
            </div>
          </div>
          <div class="audit-item-content">
            <div class="content-title">
              {{ ele.data.hotelName }}
            </div>
            <div class="time">
              <span class="label">入住时间</span>
              <span class="value">{{ formatCode(ele.data.startDate, ele.data.endDate) }}</span>
            </div>
            <div class="place">
              <span class="label">住宿方式</span>
              <span class="value">{{ ele.data.oneself ? '单住' : '合住' }}</span>
            </div>
            <div class="person" v-if="ele.data.attendees.length">
              <span class="label">住宿人员</span><span class="value">{{ filterAttendees(ele.data.attendees) }}</span>
            </div>
            <div class="place">
              <span class="label">申请类型</span>
              <span class="value">{{ ele.businessFlag ? '取消发布申请' : '发布申请' }}</span>
            </div>
          </div>
        </div>
      </template>
    </list>
    <div class="bottom">
      <div class="batch-btn-all" @click="choiceAll">
        <img :src="batchShowBtnFlag ? choose : chooseDefault" alt="" />
        <span>全选</span>
      </div>
      <van-button
type="info"
@click="batchChoiceShow = true"
:disabled="checkedCount === 0 && !batchShowBtnFlag"
        >确认审核</van-button
      >
    </div>
    <van-overlay :show="batchChoiceShow" z-index="9" @click="batchChoiceShow = false">
      <div class="batch-choice" @click.stop>
        <dl>
          <dt>正在审核住宿安排</dt>
          <dd>请选择审核意见，住宿安排会在审核通过后自动发布，住宿人员可通过“会议安排”实时查看</dd>
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
import chooseDefault from '@/assets/images/chooseDefault.svg'
import choose from '@/assets/images/choose.svg'
export default {
  components: { list },
  props: {
    routeParams: {
      type: Object
    }
  },
  data() {
    return {
      choose,
      chooseDefault,
      // 是否所有数据都不可以选择
      isAllUnChoice: false,
      // 全选按钮
      batchShowBtnFlag: false,
      // 审核弹窗
      batchChoiceShow: false,
      // 当前选中项个数
      checkedCount: 0,
      searchVal: '',
      params: {
        httpUrl: 'message.getAuditList',
        type: 'up',
        httpParams: {
          conferenceId: '',
          likeConditions: '', // 模糊查询条件
          type: 2, // 车房餐证任务类型 1用车 2住宿 3用餐 4票证
          total: 0,
          pageNum: 1,
          pageSize: 10
        }
      },
      clear: false
    }
  },
  created() {
    const conferenceId = this.routeParams.conferenceId
    this.$nextTick(() => {
      this.params.httpParams.conferenceId = conferenceId
    })
  },
  methods: {
    // 将 2020-01-02 00:00:00 转换为 2020年01月01日 00:00
    formatCode(start, end) {
      const startStr = start.replace('-', '年').replace('-', '月')
      const startNewStr = startStr.slice(0, 10) + '日 ' + startStr.slice(11, 16)
      const endStr = end.replace('-', '年').replace('-', '月')
      const endNewStr = endStr.slice(0, 10) + '日 ' + endStr.slice(11, 16)
      // const startNewStr = start.replace(/-/g, '.').slice(0, 16)
      // let endNewStr = end.replace(/-/g, '.').slice(0, 16)
      if (startNewStr.slice(0, 4) === endNewStr.slice(0, 4)) {
        // 如果年份相同则截止日期年份不显示
        // endNewStr = endNewStr.slice(5, endNewStr.length)
      }
      return `${startNewStr} - ${endNewStr}`
    },
    // 处理乘车人信息
    filterAttendees(data) {
      let str = ''
      data.forEach(item => {
        const name = item.name
        let tags = ''
        if (item.attendeeTags.length) {
          item.attendeeTags.forEach(element => {
            tags = tags + element.name
          })
        }
        let person = ''
        if (tags) {
          person = name + '(' + tags + ')'
        } else {
          person = name
        }
        str = str + '、' + person
      })
      return str.substring(1)
    },
    // 查询
    search() {
      this.clear = true
      this.params.httpParams.likeConditions = this.searchVal
    },
    // 清除搜索框内容
    clearSearchValue() {
      this.clear = true
      this.params.httpParams.likeConditions = ''
    },
    // 点击列表页
    linkTo(ele) {
      // 查询任务是否还存在
      this.$api({
        url: 'message.showTaskIsExist',
        data: { id: ele.data.id }
      }).then(res => {
        if (res.code === 2000) {
          this.$router.push({
            name: 'stayPeopleInfo',
            query: {
              [this.$enc('auditItem')]: this.$enc(ele),
              [this.$enc('conferenceId')]: this.$enc(this.routeParams.conferenceId)
            }
          })
        } else {
          this.$toast(res.message)
        }
      })
    },
    // 审核弹窗选择审核状态
    submitFinnal(auditStatus) {
      this.batchChoiceShow = false
      const params = {}
      params.type = 2
      params.auditStatus = auditStatus
      const ids = []
      this.$refs.list.listData.forEach((ele, indexChoice) => {
        if (ele.checked) {
          ids.push(ele.auditTaskId)
        }
      })
      params.ids = ids
      this.$api({
        url: 'message.setAudit',
        data: params
      })
        .then(res => {
          this.$toast.success('审核成功')
          setTimeout(() => {
            window.location.reload()
          }, 300)
        })
        .catch(err => {
          const msg = err.message
          this.$toast(msg)
        })
    },
    // 确定审核
    submit() {
      const checked = []
      this.$refs.list.listData.forEach((ele, indexChoice) => {
        if (ele.checked) {
          checked.push(ele.id)
        }
      })
      if (!checked.length) {
        this.$toast('请至少选择一项审核信息')
        return
      }
      this.batchChoiceShow = true
    },
    // 全选
    choiceAll() {
      if (!this.isAllUnChoice) {
        this.$toast('当前页没有可选中项')
        return
      }
      this.batchShowBtnFlag = !this.batchShowBtnFlag
      this.changeData(this.batchShowBtnFlag)
    },
    // 批量更改listData数据
    changeData(status) {
      const checked = []
      this.$refs.list.listData.forEach((ele, indexChoice) => {
        if (ele.auditStatus === 2) {
          ele.checked = status
          this.$set(this.$refs.list.listData, indexChoice, ele)
        }
        if (ele.checked) {
          checked.push(ele.id)
        }
      })
      this.checkedCount = checked.length
      console.log()
    },
    // 退出选择
    choiceCancel() {
      this.batchShowBtnFlag = false
      this.changeData(false)
    },
    // 多选及反选
    choice(ele, index) {
      // 如果不是 待审核状态 禁止点击
      if (ele.auditStatus !== 2) {
        return
      }
      let checkedAll = true
      this.$refs.list.listData.forEach((ele, indexChoice) => {
        if (index === indexChoice) {
          ele.checked = !ele.checked
        }
        if (!ele.checked) {
          this.batchShowBtnFlag = false
          checkedAll = false
        }
        this.$set(this.$refs.list.listData, indexChoice, ele)
      })
      if (checkedAll) {
        this.batchShowBtnFlag = true
      }
      const checked = []
      this.$refs.list.listData.forEach((ele, indexChoice) => {
        if (ele.checked) {
          checked.push(ele.id)
        }
      })
      this.checkedCount = checked.length
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
        // 只有待审核状态的才允许进行选择
        if (ele.auditStatus === 2) {
          ele.checked = false
          this.isAllUnChoice = true
        }
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
.car-audit {
  min-height: 100%;
  background-color: #f8f8f8;
  .car-audit-search {
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
  }
  .list-container {
    height: calc(100% - 64px);
    top: 64px;
    padding: 0 0 64px;
  }
  ::v-deep .van-pull-refresh {
    padding-top: 0;
  }
  .msg-item {
    width: 100%;
    background-color: #fff;
    padding: 0px 20px 16px 20px;
    margin-bottom: 12px;
    .pic {
      margin-right: 7px;
    }
    .pic-checked {
      img {
        width: 100%;
      }
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background-color: #c7c8ca;
    }
    .audit-item-title {
      height: 52px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title-text,
      .audit-type {
        display: flex;
        align-items: center;
      }
      .title-text {
        height: 18px;
        font-size: 18px;
        font-weight: 500;
        color: #191f24;
        line-height: 18px;
      }
      .audit-type {
        height: 16px;
        font-size: 14px;
        font-weight: 400;
        color: #1e89ff;
        line-height: 16px;
        .status {
          height: 20px;
          line-height: 20px;
          border-radius: 4px;
          padding: 0 10px;
          font-size: 14px;
        }
        .in-review {
          background: #f4f9ff;
          color: #1e89ff;
        }
        .pass {
          background: #f0f0f0;
          color: #6b7f99;
        }
        .no-pass {
          background: #fff1f1;
          color: #fd3c34;
        }
        img {
          margin-left: 2px;
        }
      }
    }
    .audit-item-content {
      background: #f6f6f6;
      border-radius: 3px;
      padding: 19px 9px 11px 22px;
      .content-title {
        font-size: 18px;
        font-weight: 500;
        color: #191f24;
        line-height: 18px;
        margin-bottom: 18px;
      }
      .time,
      .place,
      .person {
        font-size: 14px;
        color: rgba(25, 31, 36, 0.64);
        line-height: 18px;
        margin-bottom: 8px;
        display: flex;
        .label {
          font-weight: 500;
          width: 66px;
        }
        .value {
          flex: 1;
          font-weight: 400;
        }
      }
      .person {
        .value {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .bottom {
    z-index: 999;
    position: fixed;
    bottom: 0;
    height: 64px;
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    .batch-btn-all {
      @include list(row, flex-start, center);
      font-size: 16px;
      img {
        margin-right: 11px;
      }
    }
    .van-button {
      width: 210px;
      font-size: 18px;
      border-radius: 8px;
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
