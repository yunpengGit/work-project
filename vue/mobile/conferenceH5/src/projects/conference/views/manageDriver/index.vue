<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-04 20:09:53
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-22 13:10:53
-->
<template>
  <div class="manage-use-car-container">
    <div class="filter-container">
      <div class="drivers-count">
        <img src="@/assets/images/drivers.svg" alt="">
        <span>会议可用司机共{{ dirversCount }}人</span>
      </div>
      <div class="filter-btn" @click="filterHandler">
        筛选
        <img src="@/assets/images/filter.svg" alt="">
      </div>
    </div>
    <list
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
          @click="$router.push({
            name: 'editDriver',
            query: {
              [$enc('id')]: $enc(ele.id),
              [$enc('conferenceId')]: $enc(routeParams.id)
            }
          })"
        >
          <dl>
            <dt>
              {{ ele.name }}
              <div class="detail">
                {{ ele.sex === '1' ? '男' : '女' }} | {{ ele.drivingAge ? ele.drivingAge : '多' }}年驾龄
              </div>
            </dt>
            <dd><span>电话：</span><span class="contact">{{ ele.phone }}</span></dd>
            <dd>所属公司：{{ ele.vehicleCompanyVO ? ele.vehicleCompanyVO.name ? ele.vehicleCompanyVO.name : '-' : '-' }}</dd>
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
        <div class="popup-item">
          <div class="popup-title">
            <i />
            性别
          </div>
          <ul class="filter-condition">
            <li
              v-for="(ele,index) in sexData"
              :key="index"
              @click="sexChoice(index)"
              :class="ele.checked ? 'filter-btn-checked' : ''"
            >
              {{ ele.text }}
            </li>
          </ul>
        </div>
        <div class="popup-item">
          <div class="popup-title">
            <i />
            其他条件筛选
          </div>
          <div class="filter-input">
            <van-search
              v-model="filterInput.nameLike"
              background="#fff"
              placeholder="输入司机姓名查询"
            />
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
              v-model="filterInput.companyNameLike"
              background="#fff"
              placeholder="输入所属公司查询"
            />
          </div>
        </div>
      </div>
       <div class="filter-submit-btn">
          <van-button @click="resetHandler">重置</van-button>
          <van-button type="info" @click="submitHandler">确定</van-button>
        </div>
    </van-popup>
    <div class="single-btn-bottom">
      <van-button
        type="info"
        @click="$router.push({
          name: 'addDriver',
          query: {
            [$enc('conferenceId')]: $enc(routeParams.id)
          }
        })"
      >添加司机</van-button>
    </div>
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
      // 司机人数
      dirversCount: '',
      sidePopupShow: false,
      filterInput: {
        nameLike: '',
        phoneLike: '',
        companyNameLike: ''
      },
      // 性别
      sexData: [
        { text: '男', checked: false, sex: 1 },
        { text: '女', checked: false, sex: 2 }
      ],
      params: {
        customParams: true,
        httpUrl: 'manage.getDriversList',
        type: 'up',
        // 模拟数据
        httpParams: {
          conferenceId: '',
          // // 性别
          // sex: '',
          // // 司机姓名
          // nameLike: '',
          // // 手机号查询
          // phoneLike: '',
          // // 所属公司
          // companyNameLike: '',
          pageNum: 1,
          pageSize: 10
        }
      },
      clear: false
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
    // 重置搜索条件
    resetHandler() {
      this.resetSex()
      this.resetInputStatus()
    },
    // 确定
    submitHandler() {
      // 性别
      const sexType = []
      this.sexData.forEach(ele => {
        if (ele.checked) {
          sexType.push(ele.sex)
        }
      })
      if (sexType.length === 1) {
        this.params.httpParams.sex = sexType.join(',')
      } else {
        delete this.params.httpParams.sex
      }
      // 清空现有list数据
      this.clear = true
      this.params.httpParams.pageNum = 1
      // 合并输入框内容筛选条件
      Object.keys(this.filterInput).forEach(ele => {
        if (!this.filterInput[ele]) {
          this.filterInput[ele] = null
        }
      })
      const httpParams = Object.assign({}, this.params.httpParams, this.filterInput)
      this.params.httpParams = httpParams
      // 关闭弹窗
      this.sidePopupShow = false
    },
    sexChoice(index) {
      const isChecked = this.sexData[index].checked
      this.$set(this.sexData[index], 'checked', !isChecked)
    },
    resetSex() {
      this.sexData.forEach(ele => {
        ele.checked = false
      })
    },
    // 重置筛选中输入框的内容
    resetInputStatus() {
      Object.keys(this.filterInput).forEach(key => {
        this.filterInput[key] = ''
      })
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
    loadFinish(data) {
      this.dirversCount = data.result.total
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.manage-use-car-container{
  min-height: 100%;
  background-color: #f8f8f8;
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
      background-color: rgba(25, 31, 36, 0.04);
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
        color: #1E89FF;
        color: rgba(25, 31, 36, 1);
        font-weight: 500;
      }
  }
  .filter-container {
    width: 100%;
    height: 48px;
    line-height: 48px;
    background-color: #fff;
    padding: 0 16px;
    @include list(row, space-between, center);
    .drivers-count {
      font-size: 15px;
      color: rgba(224, 143, 0, 1);
      @include list(row, flex-start, center);
      img {
        margin-right: 6px;
      }
    }
    .filter-btn {
      line-height: 48px;
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
    padding-bottom: 64px;
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
          font-size: 16px;
          font-weight: 500;
          @include list(row,space-between,center);
          margin-bottom: 10px;
          .detail {
            font-size: 14px;
            color: rgba(25, 31, 36, 0.64);
            @include list(row,flex-start,center);
            font-weight: normal;
          }
        }
        dd {
          font-size: 13px;
          margin-bottom: 6px;
          color: rgba(25, 31, 36, 0.48);
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
}
</style>
