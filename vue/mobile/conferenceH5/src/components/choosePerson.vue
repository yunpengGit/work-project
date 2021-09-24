<!--
 * @Author: aq.hu
 * @Date: 2021-07-26 10:35:58
 * @LastEditTime: 2021-08-11 14:12:54
 * @LastEditors: zhaohx
 * @Description: 选人list(住宿/票证)
-->
<template>
  <div class="choose-person">
    <div class="top-search">
      <van-search
        v-model="nameValue"
        class="search"
        center
        placeholder="输入姓名查询"
        @search="filedSearch"
      />
      <span class="screen-contain" @click="popShow = true">
        筛选<img src="@/assets/images/filter.svg" alt="">
      </span>
    </div>
    <list
      ref="list"
      :clear="clear"
      @resetClear="resetClear"
      :params="listParams"
      @onRefresh="onRefresh"
      @onLoad="onLoad"
    >
      <template v-slot:item="data">
        <van-checkbox-group
          v-model="peopleResult"
          ref="checkboxGroup"
          @change="checkGroupChange"
        >
          <div class="card" v-for="(ele, i) in data.data" :key="i" @click="clickItem(i)">
            <van-checkbox :name="ele" :ref="'checkbox'+ i" />
            <div class="card-right">
              <div class="name">{{ ele.fixAttributeCommonVO.attendeeName }}</div>
              <div class="normal-text">{{ ele.fixAttributeCommonVO.organizationSortName }}</div>
              <div class="normal-text"><span>职位：</span>{{ ele.fixAttributeCommonVO.position }}</div>
              <div class="phone"><span>电话：</span>{{ ele.fixAttributeCommonVO.phone }}</div>
            </div>
          </div>
        </van-checkbox-group>
      </template>
    </list>
    <div class="list-btn">
      <div class="choose-all">
        <van-checkbox
          v-model="checkAll"
          class="box-check"
          :disabled="couldAll"
          @click="toggleAll"
        >全选</van-checkbox>
        <div class="people-num">已选{{ peopleResult.length }}人</div>
      </div>
      <div>
        <van-button round type="info" :disabled="peopleResult.length === 0" @click="confirm">确认选择</van-button>
      </div>
    </div>
    <van-popup v-model="popShow" position="right" class="pop-content">
      <div>
        <div class="pop-title"><span class="line" />职务</div>
        <div class="tag-content">
          <span
            :class="popParams.position === t.enumValue ? 'spanActive' : ''"
            v-for="(t, i) in jobData"
            :key="i"
            @click="positionChange(t.enumValue)"
          >{{ t.enumValue }}</span>
        </div>
      </div>
      <div>
        <div class="pop-title"><span class="line" />人员类别</div>
        <div class="tag-content">
          <span
            :class="personSelect.indexOf(i) > -1 ? 'spanActive' : ''"
            v-for="(t, i) in personCategory"
            :key="i"
            @click="personChange(i)"
          >{{ t.value }}</span>
        </div>
      </div>
      <div class="filed-content">
        <div class="pop-title"><span class="line" />其他查询条件</div>
        <van-field
          v-model="popParams.phoneLike"
          class="filed-value"
          center
          left-icon="search"
          placeholder="输入手机号查询" />
        <van-field
          v-model="popParams.organizationNameLike"
          class="filed-value"
          center
          left-icon="search"
          placeholder="输入单位名称/简称查询" />
      </div>
      <div class="pop-btns">
        <van-button @click="reset">重置</van-button>
        <van-button type="info" @click="getSearch">确定</van-button>
      </div>
    </van-popup>
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
      popShow: false,
      jobData: [],
      personCategory: [{
        value: '参会人'
      }, {
        value: '会务组'
      }, {
        value: '司机'
      }, {
        value: '嘉宾'
      }, {
        value: '临时来宾'
      }],
      conferenceId: '',
      popParams: {
        conferenceId: '',
        attendeeRoleFlagEqual: '',
        // TODO 是否定值
        signStatusEqual: 3,
        pageNum: 1,
        pageSize: 10,
        position: '',
        phoneLike: '',
        organizationNameLike: ''
      },
      personSelect: [0],
      listParams: {
        httpUrl: 'manage.getAgendaPersons',
        type: 'up',
        httpParams: {
          conferenceId: '',
          attendeeRoleFlagEqual: 0,
          signStatusEqual: 3,
          attendeeNameLike: '',
          pageNum: 1,
          pageSize: 10
        }
      },
      clear: false,
      peopleResult: [],
      checkAll: false,
      nameValue: ''
    }
  },
  created() {
    this.conferenceId = this.routeParams.conferenceId
    this.$nextTick(() => {
      this.listParams.httpParams.conferenceId = this.routeParams.conferenceId
    })
    this.getJob()
  },
  computed: {
    couldAll() {
      if (this.$refs.list && this.$refs.list.listData.length === 0) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    // 获取职位
    getJob() {
      this.$api({
        url: 'manage.getJob',
        data: {
          conferenceId: this.routeParams.conferenceId
        }
      }).then(res => {
        if (res.code === 2000) {
          this.jobData = res.result.list
        }
      })
    },
    onRefresh() {
      this.listParams.httpParams.pageNum++
      this.listParams.type = 'down'
    },
    onLoad() {
      this.listParams.httpParams.pageNum++
      this.listParams.type = 'up'
    },
    // 点击整张卡片选中
    clickItem(index) {
      this.$refs[`checkbox${index}`][0].toggle()
    },
    // 全选与反选
    toggleAll() {
      if (this.checkAll === true) {
        this.$refs.checkboxGroup.toggleAll(true)
      } else {
        this.$refs.checkboxGroup.toggleAll()
      }
    },
    checkGroupChange() {
      const selectLen = this.peopleResult.length
      const listLen = this.$refs.list.listData.length
      if (selectLen !== listLen) {
        this.checkAll = false
      } else {
        this.checkAll = true
      }
    },
    // 选择职位
    positionChange(value) {
      if (value === this.popParams.position) {
        this.popParams.position = ''
      } else {
        this.popParams.position = value
      }
    },
    // 选择人员
    personChange(i) {
      const index = this.personSelect.indexOf(i)
      if (index !== -1) {
        this.personSelect.splice(index, 1)
      } else {
        this.personSelect.push(i)
      }
      this.popParams.attendeeRoleFlagEqual = this.personSelect.join(',')
    },
    // 重置
    reset() {
      this.personSelect = [0]
      this.popParams.attendeeRoleFlagEqual = ''
      this.popParams.position = ''
      this.popParams.phoneLike = ''
      this.popParams.organizationNameLike = ''
    },
    resetClear() {
      this.clear = false
    },
    // 姓名查询
    filedSearch() {
      this.clear = true
      this.listParams.httpParams.pageNum = 1
      this.listParams.httpParams.attendeeNameLike = this.nameValue
    },
    // 查询
    getSearch() {
      this.popParams.conferenceId = this.conferenceId
      this.$api({
        url: 'manage.getAgendaPersons',
        data: this.popParams
      }).then(res => {
        if (res.code === 2000) {
          this.$refs.list.listData = res.result.list
          this.popShow = false
        }
      })
    },
    confirm() {
      this.$emit('comfirm', this.peopleResult)
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  font-family: PingFangSC-Regular, PingFang SC;
}
.choose-person {
  height: 100%;
  background-color: #f5f4f9;
  .list-container {
    height: calc(100% - 48px);
    top: 48px;
    padding: 0 10px 54px;
  }
  .top-search {
    padding: 6px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    .search {
      width: 85%;
      height: 36px;
      color: #191F24;
      border-radius: 20px;
      background-color: rgba(25, 31, 36, 0.04);
    }
    .screen-contain {
      display: flex;
      align-items: center;
      font-size: 13px;
      font-weight: 500;
      color: #191F24;
      img {
        margin-left: 3px;
      }
    }
  }
  .card {
    margin: 0 10px 12px;
    padding: 16px;
    display: flex;
    background-color: #fff;
    border-radius: 8px;
    &:nth-last-of-type(1) {
      margin-bottom: 0;
    }
    &-right {
      margin-left: 16px;
      .name {
        font-size: 16px;
        font-weight: 500;
        line-height: 21px;
        color: #191F24;
      }
      .normal-text {
        margin-top: 8px;
        font-size: 14px;
        font-weight: 400;
        color: #191F24;
        line-height: 18px;
      }
      .phone {
        margin-top: 8px;
        font-size: 14px;
        font-weight: 400;
        line-height: 18px;
        color: #1E89FF;
      }
      span {
        font-size: 14px;
        font-weight: 400;
        line-height: 18px;
        color: rgba(25, 31, 36, 0.48);
      }
    }
  }
  .list-btn {
    width: 100%;
    padding: 8px 10px;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 9;
    .choose-all {
      display: flex;
      align-items: center;
      .box-check {
        font-size: 15px;
        font-weight: 400;
        line-height: 20px;
        color: rgba(25, 31, 36, 0.8);
      }
      .people-num {
        padding-left: 8px;
        margin-left: 8px;
        font-size: 15px;
        font-weight: 400;
        line-height: 20px;
        color: rgba(25, 31, 36, 0.8);
        border-left: 1px solid #D8D8D8;
      }
    }
    button {
      height: 38px;
    }
  }
  .pop-content {
    width: 80%;
    height: 100%;
    padding: 0 16px;
    .pop-title {
      padding-left: 8px;
      margin: 16px 0;
      position: relative;
      font-size: 15px;
      font-weight: 500;
      color: #191F24;
      line-height: 18px;
      .line {
        width: 4px;
        height: 14px;
        position: absolute;
        left: 0;
        top: 1px;
        background-color: #1E89FF;
        border-radius: 2px;
      }
    }
    .tag-content {
      display: flex;
      flex-wrap: wrap;
      span {
        width: 30%;
        height: 30px;
        margin-right: 12px;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        background-color: rgba(25, 31, 36, 0.04);
        &:nth-child(3n) {
          margin-right: 0;
        }
      }
      .spanActive {
        background-color: #1E89FF;
        color: #fff;
        font-weight: 500;
      }
    }
    .filed-content {
      .filed-value {
        margin-bottom: 16px;
        height: 36px;
        border-radius: 6px;
        background-color: rgba(25, 31, 36, 0.04);
        &:after {
          border-bottom: none;
        }
      }
    }
    .pop-btns {
      display: flex;
      width: 100%;
      background-color: #fff;
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 9;
      button {
        flex-grow: 1;
        flex-shrink: 0;
        border-radius: 0;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.choose-person::v-deep {
  .van-pull-refresh {
    padding-top: 12px;
  }
}
</style>

