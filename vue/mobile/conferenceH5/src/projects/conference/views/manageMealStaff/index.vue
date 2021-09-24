<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-04 20:09:53
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-11 11:25:30
-->
<template>
  <div class="manage-stay-staff-container">
    <div class="filter-container">
      <van-search
        v-model="searchVal"
        shape="round"
        background="#fff"
        placeholder="搜索"
        @search="search"
      />
      <div class="filter-btn" @click="filterHandler">
        筛选
        <img src="@/assets/images/filter.svg" alt="">
      </div>
    </div>
    <div class="room-info">
      <div class="room-number">
        {{ routeParams.mealName }}
        <i />
        {{ routeParams.mealType }}
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
        >
          <dl>
            <dt>
              {{ ele.fixAttributeCommonVO.attendeeName }}
              <div class="more" @click="showPicDetail(index)">
                <div class="i"/>
                <div class="i"/>
                <div class="i"/>
                <ul class="showDetail" v-if="ele.checked">
                  <li
                    @click.stop="deleteUser(ele, index)"
                  >
                    <span>移除</span>
                  </li>
                  <li @click="editUser(index)">
                    <span>修改</span>
                  </li>
                </ul>
              </div>
            </dt>
            <dd>{{ ele.fixAttributeCommonVO.organizationSortName }}</dd>
            <dd><span>桌号：</span>{{ ele.tableNo }}</dd>
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
      <div class="filter-submit-btn">
        <van-button @click="resetHandler">重置</van-button>
        <van-button type="info" @click="submitHandler">确定</van-button>
      </div>
    </van-popup>
    <van-action-sheet
      v-model="actionShow"
      description="请选择桌号"
      cancel-text="取消"
      :actions="actions"
      @select="onSelect"
    />
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
      actionShow: false,
      actions: [],
      searchVal: '',
      hotelName: '',
      roomNo: '',
      fullStatus: '',
      sidePopupShow: false,
      filterInput: {
        // 手机号筛选
        phoneLike: '',
        // 输入单位名称/简称查询
        organizationNameLike: ''
      },
      // 职务类型
      jobData: [],
      params: {
        httpUrl: 'manage.getMealStaff',
        type: 'up',
        // 模拟数据
        httpParams: {
          conferenceId: '',
          taskId: '',
          attendeeRoleFlagEqual: '0,1,2',
          pageNum: 1,
          pageSize: 10
        }
      },
      clear: false,
      // 当前操作的是第几个
      choiceIndex: 0
    }
  },
  created() {
    const routeParams = this.routeParams
    console.log(routeParams)
    this.$nextTick(() => {
      const httpParams = Object.assign({}, this.params.httpParams, routeParams)
      this.params.httpParams = httpParams
    })
    // 获取职务类型
    this.getJob()
    this.getRestaurantDetail()
  },
  methods: {
    // 移除用餐人
    deleteUser(ele, index) {
      this.$dialog.confirm({
        title: `将从用餐任务中删除人员`,
        message: '确认删除？',
        className: 'customDialog'
      }).then(() => {
        const taskId = this.routeParams.taskId
        const attendeeId = ele.fixAttributeCommonVO.attendeeId
        const params = {
          taskId, dinnerAttendees: [{ attendeeId }]
        }
        this.$api({
          url: 'desk.deleteMealUsers',
          data: params
        }).then(res => {
          if (res.code === 2000) {
            this.$refs.list.listData.splice(index, 1)
            this.$toast('用餐人员删除成功')
          }
        })
      }).catch(() => {})
    },
    // 修改用餐人
    editUser(index) {
      this.choiceIndex = index
      this.actionShow = true
    },
    onSelect(item) {
      const name = item.name
      this.$dialog.confirm({
        title: `修改桌号为${name}？`,
        message: '确认修改？',
        className: 'customDialog'
      }).then(() => {
        const choiceIndex = this.choiceIndex
        const data = this.$refs.list.listData[choiceIndex]
        const taskId = this.routeParams.taskId
        const attendeeId = data.fixAttributeCommonVO.attendeeId
        const tableNo = name
        const params = {
          taskId, attendeeId, tableNo
        }
        this.$api({
          url: 'desk.editMealUsers',
          data: params
        }).then(res => {
          if (res.code === 2000) {
            this.$toast('修改桌号成功')
            data.tableNo = name
            this.$set(this.$refs.list.listData, choiceIndex, data)
            this.actionShow = false
          }
        })
      }).catch(() => {})
    },
    // 打开查看详情/报到小弹窗
    showPicDetail(index) {
      const data = this.$refs.list.listData
      data.forEach((eleData, indexData) => {
        if (index !== indexData) {
          eleData.checked = false
          this.$set(this.$refs.list.listData, indexData, eleData)
        }
      })
      const dataChecked = this.$refs.list.listData[index]
      dataChecked.checked = !dataChecked.checked
      this.$set(this.$refs.list.listData, index, dataChecked)
    },
    search() {
      this.clear = true
      this.params.httpParams.pageNum = 1
      this.params.httpParams.attendeeNameLike = this.searchVal
    },
    // 重置搜索条件
    resetHandler() {
      this.resetJobStatus()
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
      // 清空现有list数据
      this.clear = true
      // 合并输入框内容筛选条件
      const httpParams = Object.assign({}, this.params.httpParams, this.filterInput)
      this.params.httpParams = httpParams
      // 关闭弹窗
      this.sidePopupShow = false
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
    // 重置筛选中输入框的内容
    resetInputStatus() {
      Object.keys(this.filterInput).forEach(key => {
        this.filterInput[key] = ''
      })
    },
    // 职务类型选择
    jobChoice(index) {
      const isChecked = this.jobData[index].checked
      this.$set(this.jobData[index], 'checked', !isChecked)
    },
    // 更多筛选条件
    filterHandler() {
      this.sidePopupShow = true
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
  .room-info {
    width: 100%;
    height: 36px;
    padding: 0 16px;
    font-size: 14px;
    background-color: rgba(255, 250, 235, 1);
    @include list(row,space-between,center);
    .room-number {
      color: rgba(224, 143, 0, 1);
      @include list(row,space-between,center);
      i {
        display: block;
        width: 1px;
        height: 14px;
        background-color: rgba(224, 143, 0, 1);
        margin: 0 10px;
      }
    }
    .room-status-free {
      color: rgba(3, 190, 28, 1);
    }
    .room-status-full-no {
      color: rgba(248, 183, 0, 1);
    }
    .room-status-full {
      color: rgba(25, 31, 36, 0.32);
    }
  }
  .list-container {
    height: calc(100% - 84px);
    top: 84px;
    // padding-top: 12px;
    .list-item {
      width: 100%;
      background-color: #fff;
      border-radius: 8px;
      margin-bottom: 10px;
      padding: 16px 16px 12px;
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
          font-size: 14px;
          font-weight: 500;
          @include list(row,space-between,center);
          margin-bottom: 10px;
          .more {
            @include list(row,flex-start,center);
            position: relative;
            .i {
              display: block;
              width: 3px;
              height: 3px;
              background-color: rgba(25, 31, 36, 1);
              border-radius: 50%;
              margin-left: 4px;
            }
            .showDetail {
              width: 128px;
              height: 144px;
              background: url('../../../../assets/images/popoverBg.svg') no-repeat;
              background-size: 128px 144px;
              position: absolute;
              right: -25px;
              top: -2px;
              padding: 16px 12px;
              li {
                width: 100%;
                height: 50%;
                border-bottom: 1px solid #e0e0e0;
                color: rgba(255,255,255,.8);
                @include list(row,center,center);
              }
            }
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
        padding: 0 31px;
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
}
</style>
