<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-04 20:09:53
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-17 18:12:12
-->
<template>
  <div class="manage-check-in-container">
    <div class="filter-container">
      <div class="drivers-count">
        应到:<span class="total">{{ personsNum.totalCount }}人</span>
        <span class="handle">已到:{{ personsNum.checkInCount }}人</span>
        <span class="surplus">未到:{{ personsNum.checkOutCount }}人</span>
        <span class="surplus">请假:{{ personsNum.checkOutLeaveCount }}人</span>
      </div>
      <div class="filter-btn" @click="filterHandler">
        筛选
        <img src="@/assets/images/filter.svg" alt="">
      </div>
    </div>
    <list
      ref="list"
      :params="params"
      :clear="clear"
      :nullText="nullText"
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
          <div class="header-pic">
            <img :src="headerPic(ele)" alt="">
            <div
              class="tips"
              :class="ele.agendaVOs[0].signInStatus === 1 ? 'tips-checked' : ele.agendaVOs[0].leaveStatus === 1 ? 'tips-leave' : ''"
            >
              {{ ele.agendaVOs[0].signInStatus === 1 ? '已签到' : ele.agendaVOs[0].leaveStatus === 1 ? '请假' : '未签到' }}
            </div>
          </div>
          <dl>
            <dt>
              <div class="content">
                <h5>{{ ele.fixAttributeCommonVO.attendeeName }}</h5>
                <i />
                <span>{{ ele.fixAttributeCommonVO.position }}</span>
              </div>
              <van-popover
                v-model="showPopoverSignInList[index]"
                theme="dark"
                :actions="popoverTextSignInList"
                placement="bottom-end"
                trigger="click"
                @open="openSignInList(ele)"
                @select="cardCancelSignInList(ele, index, ...arguments)"
              >
                <template #reference>
                  <img src="@/assets/svg/invitation/morenew4.svg" />
                </template>
              </van-popover>
              <!-- <div class="more" @click="showPicDetail(index)">
                <i />
                <i />
                <i />
                <ul class="showDetail" v-if="ele.checked">
                  <li
                    @click.stop="$router.push({
                      name: 'attendee',
                      query: {
                        [$enc('conferenceId')]: $enc(routeParams.conferenceId),
                        [$enc('attendeeId')]: $enc(ele.id)
                      }
                    })"
                  ><span>查看详情</span></li>
                  <li @click="statusChange(false, ele, index)">
                    <span>{{ ele.agendaVOs[0].signInStatus === 1 ? '取消签到' : '签到' }}</span>
                  </li>
                </ul>
              </div> -->
            </dt>
            <dd>{{ ele.fixAttributeCommonVO.organizationName }}</dd>
            <dd>
              <span>{{ ele.phoneShow? ele.fixAttributeCommonVO.phone : phone(ele.fixAttributeCommonVO.phone) }}</span>
              <img :src="ele.phoneShow ? hideDark :show" alt="" @click="phoneChange(index)">
            </dd>
          </dl>
        </div>
      </template>
    </list>
    <div class="single-btn-bottom">
      <van-button
        round
        type="info"
        @click="statusChangeAll(true)"
      >全部签到</van-button>
    </div>
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
            查询条件
          </div>
          <div class="filter-input">
            <van-search
              v-model="filterInput.nameOrPhoneLike"
              background="#fff"
              placeholder="输入姓名查询"
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
              v-model="filterInput.position"
              background="#fff"
              placeholder="输入职务查询"
            />
          </div>
          <div class="filter-input">
            <van-search
              v-model="filterInput.allOrganizationNameLike"
              background="#fff"
              placeholder="输入单位名称查询"
            />
          </div>
        </div>
        <div class="popup-item">
          <div class="popup-title">
            <i />
            签到状态
          </div>
          <ul class="filter-condition">
            <li
              v-for="(ele,index) in seatData"
              :key="index"
              @click="seatChoice(index)"
              :class="ele.checked ? 'filter-btn-checked' : ''"
            >
              {{ ele.name }}
            </li>
          </ul>
        </div>
      </div>
      <div class="filter-submit-btn">
        <van-button @click="resetHandler">重置</van-button>
        <van-button type="info" @click="submitHandler">确定</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import list from '@/components/list'
import show from '@/assets/images/showDark.svg'
import hideDark from '@/assets/images/hideDark.svg'
import male from '@/assets/images/male.png'
import femaleSex from '@/assets/images/femaleSex.png'
export default {
  components: { list },
  props: {
    routeParams: {
      default: Object
    }
  },
  data() {
    return {
      show, hideDark, male, femaleSex,
      nullText: '',
      showPopoverSignInList: [],
      popoverTextSignInList: [{ text: '查看详情' }, { text: '签到' }],
      personsNum: {
        // 应报到总数
        totalCount: 0,
        // 已经报到人数
        checkInCount: 0,
        // 未报到人数
        checkOutCount: 0,
        // 请假人数
        checkOutLeaveCount: ''
      },
      // 剩余未签到的人的id
      signedOutAttendeeIds: [],
      sidePopupShow: false,
      filterInput: {
        attendeeNameLike: '',
        phoneLike: '',
        position: '',
        allOrganizationNameLike: ''
      },
      // 接站状态
      seatData: [
        { name: '未签到', checked: true, checkInStatus: 7 },
        { name: '已签到', checked: false, checkInStatus: 6 },
        { name: '请假', checked: false, checkInStatus: 8 }
      ],
      params: {
        // customParams: true,
        httpUrl: 'manage.getAgendaPersons',
        type: 'up',
        httpParams: {
          // 参会人姓名 / 参会人手机号
          nameOrPhoneLike: '',
          // 参会人职务
          position: '',
          // 参会人公司名称
          allOrganizationNameLike: '',
          // 签到状态 1 未签到 2 已签到
          checkInStatus: '7',
          resFlag: 2,
          signStatusEqual: 3,
          conferenceId: '',
          agendaIdsIn: '',
          pageNum: 1,
          pageSize: 10
        }
      },
      clear: false
    }
  },
  computed: {
    headerPic() {
      return function(ele) {
        let result = ''
        if (ele.innerFlag === 1) {
          if (ele.ssoUserPhoto) {
            result = ele.ssoUserPhoto
          } else {
            result = ele.fixAttributeCommonVO.sex === '1' ? male : femaleSex
          }
        } else {
          result = ele.fixAttributeCommonVO.sex === '1' ? male : femaleSex
        }
        return result
      }
    },
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
    const agendaId = this.routeParams.agendaId
    document.title = this.routeParams.name
    // const totalCount = this.routeParams.totalCount
    // const signedCount = this.routeParams.signedCount
    // this.personsNum.total = totalCount
    // this.personsNum.signIn = signedCount
    this.$nextTick(() => {
      this.params.httpParams.conferenceId = conferenceId
      this.params.httpParams.agendaIdsIn = agendaId
    })
  },
  methods: {
    cardCancelSignInList(ele, index, val) {
      const conferenceId = this.routeParams.conferenceId
      if (val.text === '查看详情') {
        this.$router.push({
          name: 'attendee',
          query: {
            [this.$enc('conferenceId')]: this.$enc(conferenceId),
            [this.$enc('attendeeId')]: this.$enc(ele.id)
          }
        })
      } else {
        this.statusChange(false, ele, index)
      }
    },
    // 打开菜单
    openSignInList(ele) {
      if (ele.agendaVOs[0].signInStatus === 1) {
        this.popoverTextSignInList[1].text = '取消签到'
      } else {
        this.popoverTextSignInList[1].text = '签到'
      }
    },
    // 全部签到
    statusChangeAll() {
      let allSign = false
      if (!this.signedOutAttendeeIds.length) {
        allSign = true
      }
      if (allSign) {
        this.$toast('所有人员已经全部报到过了')
        return
      }
      console.log(this.signedOutAttendeeIds)
      this.$dialog.confirm({
        title: '报到确认',
        message: '请确定是否全部人员都已签到',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        className: 'customDialog'
      }).then(() => {
        this.signIn(true)
      }).catch(() => {})
    },
    statusChange(all = false, ele, index) {
      // 签到或者取消签到
      const signInStatus = ele.agendaVOs[0].signInStatus
      if (signInStatus === 1) {
        this.signOut(ele, index)
      } else {
        this.signIn(all, ele, index)
      }
    },
    // 签到
    signIn(all = false, ele, index) {
      const conferenceId = this.routeParams.conferenceId
      const agendaId = this.routeParams.agendaId
      const data = this.$refs.list.listData
      let attendeeIds = ''
      if (all) {
        const attendeeIdsArr = this.signedOutAttendeeIds
        attendeeIds = attendeeIdsArr.join()
        console.log(attendeeIds)
      } else {
        attendeeIds = ele.fixAttributeCommonVO.attendeeId
      }
      this.$api({
        url: 'manage.signIn',
        params: {
          conferenceId: conferenceId,
          signInType: 3,
          agendaId: agendaId,
          attendeeIds: attendeeIds
        }
      }).then(res => {
        if (res.code === 2000) {
          if (!all) {
            const indexChecked = this.signedOutAttendeeIds.findIndex(ele => {
              return ele === attendeeIds
            })
            this.signedOutAttendeeIds.splice(indexChecked, 1)
          } else {
            this.signedOutAttendeeIds = []
          }
          data.forEach((eleData, indexData) => {
            if (!all) {
              if (index === indexData) {
                eleData.agendaVOs[0].signInStatus = 1
                // this.$set(this.$refs.list.listData, indexData, eleData)
                setTimeout(() => {
                  // 只有有选项选中时才执行删除
                  let seatIndex = null
                  this.seatData.forEach((ele, indexData) => {
                    if (ele.checked) {
                      seatIndex = indexData
                    }
                  })
                  if (seatIndex !== null) {
                    this.$refs.list.listData.splice(indexData, 1)
                  }
                  this.countComputed('签到成功')
                }, 300)
                // this.personsNum.checkInCount++
                // this.personsNum.checkOutCount--
                // if (eleData.agendaVOs[0].leaveStatus === 1) {
                //   eleData.meetingStatus = null
                //   this.personsNum.checkInCount++
                //   this.personsNum.checkOutLeaveCount--
                // } else {
                //   this.personsNum.checkInCount++
                //   this.personsNum.checkOutCount--
                // }
              }
            } else {
              eleData.agendaVOs[0].signInStatus = 1
              this.$set(this.$refs.list.listData, indexData, eleData)
              this.countComputed('全部签到成功')
              // this.personsNum.checkInCount = this.personsNum.totalCount
              // this.personsNum.checkInCount = 0
              // this.personsNum.checkOutCount = 0
              // this.personsNum.checkInCount = this.personsNum.totalCount - this.personsNum.checkOutLeaveCount
              // this.personsNum.checkOutCount = 0
              setTimeout(() => {
                window.location.reload()
              }, 150)
            }
          })
          // this.$toast('签到成功')
        }
      })
    },
    // 取消签到
    signOut(ele, index) {
      const conferenceId = this.routeParams.conferenceId
      const agendaId = this.routeParams.agendaId
      const data = this.$refs.list.listData
      const attendeeIds = ele.fixAttributeCommonVO.attendeeId
      this.signedOutAttendeeIds.push(attendeeIds)
      this.$api({
        url: 'manage.cancelSignIn',
        params: {
          conferenceId,
          agendaIds: agendaId,
          attendeeIds: attendeeIds
        }
      }).then(res => {
        if (res.code === 2000) {
          data.forEach((eleData, indexData) => {
            if (index === indexData) {
              eleData.agendaVOs[0].signInStatus = 0
              // this.$set(this.$refs.list.listData, indexData, eleData)
              setTimeout(() => {
                // 只有有选项选中时才执行删除
                let seatIndex = null
                this.seatData.forEach((ele, indexData) => {
                  if (ele.checked) {
                    seatIndex = indexData
                  }
                })
                if (seatIndex !== null) {
                  this.$refs.list.listData.splice(indexData, 1)
                }
                this.countComputed('取消签到成功')
              }, 300)
              // this.personsNum.checkInCount--
              // this.personsNum.checkOutCount++
              // if (eleData.agendaVOs[0].leaveStatus === 1) {
              //   this.personsNum.checkInCount--
              //   this.personsNum.checkOutLeaveCount++
              // } else {
              //   this.personsNum.checkInCount--
              //   this.personsNum.checkOutCount++
              // }
            }
          })
          // this.$toast('取消签到成功')
        }
      })
    },
    // 打开查看详情/签到小弹窗
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
    // 切换手机号码状态
    phoneChange(index) {
      const data = this.$refs.list.listData[index]
      data.phoneShow = !data.phoneShow
      this.$set(this.$refs.list.listData, index, data)
    },
    // 重置搜索条件
    resetHandler() {
      this.resetSeat()
      this.resetInputStatus()
    },
    submitHandler() {
      // 接站状态
      const seatType = []
      this.seatData.forEach(ele => {
        if (ele.checked) {
          seatType.push(ele.checkInStatus)
        }
      })
      this.params.httpParams.checkInStatus = seatType.join(',')
      // 清空现有list数据
      this.clear = true
      this.params.httpParams.pageNum = 1
      // 合并输入框内容筛选条件
      const httpParams = Object.assign({}, this.params.httpParams, this.filterInput)
      this.params.httpParams = httpParams
      // 关闭弹窗
      this.sidePopupShow = false
    },
    seatChoice(index) {
      // const isChecked = this.seatData[index].checked
      // this.$set(this.seatData[index], 'checked', !isChecked)
      // // this.seatData.forEach(ele => {
      // //   ele.checked = false
      // // })
      // // this.$set(this.seatData[index], 'checked', true)
      // 支持单选 反选 禁止多选
      this.seatData.forEach((ele, indexData) => {
        if (indexData !== index) {
          ele.checked = false
        }
      })
      this.$set(this.seatData[index], 'checked', !this.seatData[index].checked)
    },
    resetSeat() {
      this.seatData.forEach(ele => {
        ele.checked = false
      })
    },
    // 重置筛选中输入框的内容
    resetInputStatus() {
      Object.keys(this.filterInput).forEach(key => {
        this.filterInput[key] = ''
      })
    },
    countComputed(toast = '') {
      const params = this.params.httpParams
      this.$api({
        url: 'manage.getSignCount',
        data: params
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result
          this.personsNum.totalCount = data.totalCount
          this.personsNum.checkInCount = data.signedCount
          this.personsNum.checkOutCount = data.signedOutCount
          this.personsNum.checkOutLeaveCount = data.signedOutLeaveCount
          this.signedOutAttendeeIds = data.signedOutAttendeeIds
          console.log(this.signedOutAttendeeIds)
          this.$refs.list.listData.forEach(ele => {
            ele.phoneShow = false
          })
          const count = this.$refs.list.listData
          if (!count.length) {
            const data = this.seatData.find(ele => ele.checked)
            this.nullText = `暂无${data.name}人员信息`
          }
          if (toast) {
            this.$toast(toast)
          }
        }
      })
    },
    loadFinish(res) {
      // console.log(count)
      // const data = res.result
      // this.personsNum.totalCount = data.totalCount
      // this.personsNum.checkInCount = data.checkInCount
      // this.personsNum.checkOutCount = data.checkOutCount
      // this.signedOutAttendeeIds = data.signedOutAttendeeIds
      this.countComputed()
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.manage-check-in-container{
  .filter-container {
    width: 100%;
    height: 48px;
    line-height: 48px;
    background-color: #fff;
    padding: 0 16px;
    @include list(row, space-between, center);
    .drivers-count {
      font-size: 13px;
      color: rgba(109, 113, 116, 1);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
      span {
        margin-right: 6px;
      }
      .total {
        color: rgba(25, 31, 36, 1);
      }
      .handle {
        color: rgba(30, 137, 255, 1);
      }
      .surplus {
        color: rgba(234, 52, 15, 1);
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
    padding: 0 12px 64px;
    .list-item {
      width: 100%;
      background-color: #fff;
      border-radius: 8px;
      margin-bottom: 10px;
      padding: 16px 17px 12px 16px;
      @include list(row, flex-start);
      .header-pic {
        width: 56px;
        height: 56px;
        border-radius: 4px;
        overflow: hidden;
        margin-right: 16px;
        position: relative;
        img {
          width: 100%;
          height: 100%;
        }
        .tips {
          width: 100%;
          height: 20px;
          text-align: center;
          line-height: 20px;
          background-color: rgba(0, 0, 0, 0.32);
          color: rgba(236, 236, 236, 1);
          @include absolute('','',0,0);
        }
        .tips-checked {
          background-color: rgba(0, 92, 192, 0.72);
          color: #fff;
        }
        .tips-leave {
          background-color: rgba(255, 167, 30, .7);
          color: #fff;
        }
      }
      dl {
        flex: 1;
        // width: 100%;
        dt {
          @include list(row,space-between,center);
          font-size: 15px;
          margin-bottom: 10px;
          .content {
            @include list(row,flex-start,center);
            h5 {
              font-size: 17px;
              font-weight: 500;
            }
            i {
              display: block;
              width: 1px;
              height: 16px;
              background-color: rgba(236, 237, 237, 1);
              margin: 0 12px;
            }
          }
          .more {
            @include list(row,flex-start,center);
            position: relative;
            i {
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
          line-height: 20px;
          margin-bottom: 8px;
          @include list(row,flex-start,center);
          img {
            margin-left: 8px;
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
      @include list(row,space-between,center);
      li {
        width: 50%;
        display: inline-block;
        height: 40px;
        line-height: 40px;
        font-size: 15px;
        color: rgba(25, 31, 36, 0.8);
        background-color: rgba(25, 31, 36, 0.04);
        border-radius: 6px;
        text-align: center;
        // padding: 0 31px;
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
  .single-btn-bottom {
    .van-button__content {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
