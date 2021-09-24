<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-04 20:09:53
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-11 17:11:55
-->
<template>
  <div class="manage-stay-staff-container">
    <div class="filter-container">
      <van-search
        v-model="searchVal"
        shape="round"
        background="#fff"
        placeholder="输入姓名查询"
        @search="search"
      />
      <div class="filter-btn" @click="filterHandler">
        筛选
        <img src="@/assets/images/filter.svg" alt="">
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
          :key="ele.id"
          class="list-item"
          @click="choice(index)"
        >
          <div class="pic"><img :src="ele.checked ? choose : chooseDefault" alt=""></div>
          <dl>
            <dt>
              {{ ele.fixAttributeCommonVO.attendeeName }}
            </dt>
            <dd>{{ ele.fixAttributeCommonVO.organizationName }}</dd>
            <dd><span>职务：</span>{{ ele.fixAttributeCommonVO.position ? ele.fixAttributeCommonVO.position : '-' }}</dd>
            <dd><span>电话：</span><span class="contact">{{ ele.fixAttributeCommonVO.phone }}</span></dd>
          </dl>
        </div>
      </template>
    </list>
    <van-popup
      v-model="sidePopupShow"
      position="right"
      :style="{ width: '315px',height:'100%' }"
      round
    >
      <div class="popup-container">
        <div class="filter-item">
          <div class="popup-title">
            <i />
            职务类型
          </div>
          <ul class="filter-condition">
            <li
              v-for="(ele,index) in jobData"
              :key="index"
              @click="jobChoice(index)"
              :class="ele.checked ? 'filter-btn-checked' : ''"
            >
              {{ ele.enumValue }}
            </li>
          </ul>
        </div>
        <div class="filter-item">
          <div class="popup-title">
            <i />
            人员类别
          </div>
          <ul class="filter-condition">
            <li
              v-for="(ele,index) in userTypeData"
              :key="index"
              @click="typeChoice(index)"
              :class="ele.checked ? 'filter-btn-checked' : ''"
            >
              {{ ele.enumValue }}
            </li>
          </ul>
        </div>
        <div class="filter-item">
          <div class="popup-title">
            <i />
            其他条件筛选
          </div>
          <div class="filter-input">
            <van-search
              v-model="filterInput.phoneLike"
              background="#fff"
              placeholder="输入手机号查询"
            />
          </div>
          <div class="filter-input">
            <van-search
              v-model="filterInput.organizationNameLike"
              background="#fff"
              placeholder="输入单位名称/简称查询"
            />
          </div>
        </div>
      </div>
      <div class="filter-submit-btn">
        <van-button @click="resetHandler">重置</van-button>
        <van-button type="info" @click="submitHandler">确定</van-button>
      </div>
    </van-popup>
    <div class="btn-container" v-if="isLoading">
      <div class="choice">
        <div class="pic" @click="choiceAll"><img :src="choiceAllFlag ? choose : chooseDefault" alt=""></div>
        全选
        <i />
        已选{{ choiceNum }}人
      </div>
      <van-button
        type="info"
        @click="submit"
      >
        确认选择
      </van-button>
    </div>
    <van-action-sheet
      v-model="actionShow"
      description="请选择桌号"
      :actions="actions"
      cancel-text="取消"
      @select="onSelect"
    />
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
      default: Object
    }
  },
  data() {
    return {
      chooseDefault, choose,
      actionShow: false,
      isLoading: false,
      actions: [],
      // 已选人数
      choiceNum: '0',
      // 是否全选
      choiceAllFlag: false,
      searchVal: '',
      sidePopupShow: false,
      filterInput: {
        // 手机号筛选
        phoneLike: '',
        // 输入单位名称/简称查询
        organizationNameLike: ''
      },
      // 职务类型
      jobData: [],
      // 人员类别
      userTypeData: [
        { enumValue: '参会人', enumKey: 0, checked: true },
        { enumValue: '会务组', enumKey: 1, checked: false },
        { enumValue: '司机', enumKey: 2, checked: false },
        { enumValue: '嘉宾', enumKey: 3, checked: false },
        { enumValue: '临时来宾', enumKey: 4, checked: false }
      ],
      params: {
        httpUrl: 'desk.getEnrollManage',
        type: 'up',
        // 模拟数据
        httpParams: {
          conferenceId: '',
          // 0参会人 1会务组 2司机 3嘉宾 4临时来宾
          attendeeRoleFlagEqual: 0,
          // 参会人状态 （ -3 报名驳回 -2 失效 -1 取消参会 0草稿 1报名待审核 2 报名不通过  3成功报名   ）
          signStatusEqual: 3,
          // 职务类型
          position: '',
          // 手机号
          phoneLike: '',
          // 单位名称查询
          organizationNameLike: '',
          // 搜索框搜索内容
          attendeeNameLike: '',
          pageNum: 1,
          pageSize: 10
        }
      },
      clear: false,
      // 所选的人员
      attendeeIdList: [],
      // 所选的桌号
      tableNo: ''
    }
  },
  created() {
    console.log(this.routeParams)
    const conferenceId = this.routeParams.conferenceId
    this.$nextTick(() => {
      this.params.httpParams.conferenceId = conferenceId
    })
    // 获取职务类型
    this.getJob()
    // 获取餐厅信息
    this.getRestaurantDetail()
  },
  methods: {
    onSelect(item) {
      this.tableNo = item.name
      this.addMealUser()
    },
    addMealUser() {
      this.$dialog.confirm({
        title: '新增用餐任务',
        message: '确认新增？',
        className: 'customDialog'
      }).then(() => {
        const attendeeIdList = this.attendeeIdList
        const taskId = this.routeParams.taskId
        const tableNo = this.tableNo
        const dinnerAttendees = [
          { taskId, tableNo }
        ]
        const params = {
          attendeeIdList, dinnerAttendees
        }
        this.$api({
          url: 'desk.addMealUsers',
          data: params
        }).then(res => {
          if (res.code === 2000) {
            this.$toast('添加成功')
            setTimeout(() => {
              this.$router.go(-1)
            }, 300)
          }
        })
      }).catch(() => {
        this.$toast('取消新增用餐任务')
      })
    },
    submit() {
      const attendeeIdList = []
      this.$refs.list.listData.forEach(ele => {
        if (ele.checked) {
          attendeeIdList.push(ele.fixAttributeCommonVO.attendeeId)
        }
      })
      if (!attendeeIdList.length) {
        this.$toast('请至少选择一名参会人员')
        return
      }
      this.attendeeIdList = attendeeIdList
      if (this.actions.length) {
        // 没有桌号
        this.actionShow = true
      } else {
        this.addMealUser()
      }
    },
    // 全选
    choiceAll() {
      this.choiceAllFlag = !this.choiceAllFlag
      const attendeeIdList = []
      this.$refs.list.listData.forEach((ele, index) => {
        ele.checked = this.choiceAllFlag
        this.$set(this.$refs.list.listData, index, ele)
        if (ele.checked) {
          // 计算已选人数
          attendeeIdList.push(ele.fixAttributeCommonVO.attendeeId)
        }
      })
      this.choiceNum = attendeeIdList.length
    },
    // 单选及反选
    choice(index) {
      const data = this.$refs.list.listData[index]
      data.checked = !data.checked
      this.$set(this.$refs.list.listData, index, data)
      let isAll = true
      const attendeeIdList = []
      this.$refs.list.listData.forEach(ele => {
        if (ele.checked) {
          // 计算已选人数
          attendeeIdList.push(ele.fixAttributeCommonVO.attendeeId)
        }
        if (!ele.checked) {
          isAll = false
        }
      })
      this.choiceNum = attendeeIdList.length
      this.choiceAllFlag = isAll
    },
    // 搜索
    search() {
      this.clear = true
      this.params.httpParams.pageNum = 1
      this.params.httpParams.attendeeNameLike = this.searchVal
    },
    // 重置搜索条件
    resetHandler() {
      this.resetJobStatus()
      this.resetUserTypeStatus()
      this.resetInputStatus()
    },
    // 确定
    submitHandler() {
      const position = []
      this.jobData.forEach(ele => {
        if (ele.checked) {
          position.push(ele.enumKey)
        }
      })
      this.params.httpParams.position = position.join(',')
      const attendeeRoleFlagEqual = []
      this.userTypeData.forEach(ele => {
        if (ele.checked) {
          attendeeRoleFlagEqual.push(ele.enumKey)
        }
      })
      this.params.httpParams.attendeeRoleFlagEqual = attendeeRoleFlagEqual.join(',')
      // 清空现有list数据
      this.clear = true
      // 合并输入框内容筛选条件
      const httpParams = Object.assign({}, this.params.httpParams, this.filterInput)
      this.params.httpParams = httpParams
      // 关闭弹窗
      this.sidePopupShow = false
      // 每次筛选重置选择信息
      this.choiceAllFlag = false
      this.choiceNum = '0'
    },
    getJob() {
      const conferenceId = this.routeParams.conferenceId
      this.$api({
        url: 'manage.getJob',
        data: {
          conferenceId
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result.list
          data.forEach(ele => {
            ele.checked = false
          })
          this.jobData = data
        }
      })
    },
    // 重置职务选择状态
    resetJobStatus() {
      this.jobData.forEach(ele => {
        ele.checked = false
      })
    },
    // 重置人员类别
    resetUserTypeStatus() {
      this.userTypeData.forEach((ele, index) => {
        if (index !== 0) {
          ele.checked = false
        }
      })
    },
    // 重置筛选中输入框的内容
    resetInputStatus() {
      Object.keys(this.filterInput).forEach(key => {
        this.filterInput[key] = ''
      })
    },
    // 职务类型选择
    jobChoice(index) {
      this.jobData.forEach(ele => {
        ele.checked = false
      })
      this.$set(this.jobData[index], 'checked', true)
    },
    // 人员类别选择
    typeChoice(index) {
      const isChecked = this.userTypeData[index].checked
      this.$set(this.userTypeData[index], 'checked', !isChecked)
    },
    // 更多筛选条件
    filterHandler() {
      this.sidePopupShow = true
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
    },
    getRestaurantDetail() {
      const id = this.routeParams.id
      this.$api({
        url: 'desk.getRestaurantDetail',
        data: {
          id
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result
          const actions = []
          data.tableNoList.forEach(ele => {
            actions.push({ name: ele })
          })
          this.actions = actions
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.manage-stay-staff-container {
  min-height: 100%;
  background-color: #f8f8f8;
  .filter-container {
    width: 100%;
    height: 48px;
    line-height: 48px;
    background-color: #fff;
    padding: 0 16px;
    @include list(row, space-between, center);
    .van-search {
      padding: 0;
      width: 283px;
    }
    .filter-btn {
      @include list(row, flex-start, center);
      font-size: 13px;
      img {
        margin-left: 4px;
      }
    }
  }
  .list-container {
    height: calc(100% - 48px);
    top: 48px;
    // padding-top: 12px;
    padding-bottom: 50px;
    .list-item {
      width: 100%;
      background-color: #fff;
      border-radius: 8px;
      margin-bottom: 10px;
      padding: 16px 16px 12px;
      @include list(row, flex-start,center);
      .pic {
        margin-right: 12px;
      }
      i {
        border-radius: 8px;
        padding: 4px 14px;
        background-color: rgba(3, 190, 28, 0.08);
        color: #1E89FF;
      }
      .refuse {
        background-color: rgba(244, 249, 255, 1);
        color: rgba(30, 137, 255, 1);
      }
      dl {
        line-height: 18px;
        dt {
          font-size: 16px;
          font-weight: 500;
          @include list(row,flex-start,center);
          margin-bottom: 10px;
          .status {
            display: block;
            width: 44px;
            height: 18px;
            text-align: center;
            line-height: 18px;
            color: #fff;
            background-color: rgba(248, 183, 0, 1);
            border-radius: 4px;
            font-size: 12px;
            margin-left: 8px;
          }
          .status-making {
            background-color: rgba(3, 190, 28, 1);
          }
          .status-unclaimed {
            background-color: rgba(30, 137, 255, 1);
          }
          .status-drew {
            background-color: rgba(255, 130, 0, 1);
          }
          .status-isvoid {
            background-color: rgba(25, 31, 36, 0.32);
          }
        }
        dd {
          font-size: 13px;
          margin-bottom: 6px;
          span {
            color: rgba(25, 31, 36, 0.64);
          }
          .contact {
            color: rgba(30, 137, 255, 1);
          }
        }
      }
    }
  }
  .popup-container {
    width: 100%;
    height: 100%;
    padding: 24px 16px 50px;
    position: absolute;
    left: 0;
    top: 0;
    .popup-title {
      width: 100%;
      height: 50px;
      line-height: 50px;
      font-size: 15px;
      font-weight: 500;
      @include list(row,flex-start,center);
      i {
        display: block;
        width: 4px;
        height: 14px;
        border-radius: 2px;
        background-color: rgba(30, 137, 255, 1);
        margin-right: 4px;
      }
    }
    .filter-condition {
      margin:10px 0 10px -12px;
      li {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        color: rgba(25, 31, 36, 0.8);
        background-color: rgba(25, 31, 36, 0.04);
        border-radius: 6px;
        padding: 0 25px;
        margin: 0 0 12px 12px;
      }
      .filter-btn-checked {
        background-color: rgba(30, 137, 255, 1);
        color: #fff;
      }
    }
    .filter-input {
      width: 100%;
      margin-bottom: 16px;
      .van-search {
        padding: 0;
      }
    }
    .filter-submit-btn {
      width: 100%;
      height: 50px;
      @include absolute('','',0,0);
      .van-button {
        width: 50%;
        height: 100%;
      }
    }
  }
  .btn-container {
    width: 100%;
    padding: 0 16px;
    height: 50px;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 9;
    background-color: #fff;
    @include list(row, space-between, center);
    .choice {
      font-size: 15px;
      color: rgba(25, 31, 36, 0.8);
      @include list(row, flex-start, center);
      .pic {
        width: 24px;
        height: 24px;
        margin-right: 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      i {
        display: block;
        width: 1px;
        height: 22px;
        background-color: #D8D8D8;
        margin: 0 10px;
      }
    }
    .van-button {
      width: 96px;
      height: 38px;
      border-radius: 25px;
    }
  }
}
</style>
