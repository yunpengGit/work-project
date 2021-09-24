<!--
 * @Author: aq.hu
 * @Date: 2021-07-26 10:34:21
 * @LastEditTime: 2021-08-27 16:23:26
 * @LastEditors: zhaohx
 * @Description: 添加住宿人
-->
<template>
  <div>
    <choose-person :routeParams="routeParams" @comfirm="peopleComfirm" />
    <van-calendar
      v-model="calendarShow"
      title="选择用房时间"
      type="range"
      color="#1989fa"
      :min-date="minDate"
      :max-date="maxDate"
      :default-date="null"
      :show-confirm="false"
      @select="btnDisabled = true"
      @confirm="onConfirm"
    >
      <div slot="footer">
        <van-cell center title="设置为单住">
          <template #right-icon>
            <van-switch v-model="checked" size="24" />
          </template>
        </van-cell>
        <van-button class="calendar-btn" :disabled="btnDisabled" round block type="info" @click="onSubmit">确定</van-button>
      </div>
    </van-calendar>
  </div>
</template>

<script>
import choosePerson from '@/components/choosePerson'
export default {
  components: { choosePerson },
  props: {
    routeParams: {
      default: Object
    }
  },
  data() {
    return {
      calendarShow: false,
      checked: true,
      minDate: '',
      maxDate: '',
      btnDisabled: true,
      params: {
        attendeeIdList: [],
        conferenceId: '',
        startDate: '',
        endDate: '',
        oneself: '',
        roomId: ''
      }
    }
  },
  watch: {
    calendarShow: {
      handler(val) {
        if (val === false) {
          this.btnDisabled = true
          this.checked = true
        }
      }
    }
  },
  created() {
    console.log(this.routeParams)
    const { endDate, startDate, roomId, conferenceId } = this.routeParams
    this.minDate = new Date(startDate)
    this.maxDate = new Date(endDate)
    this.params.roomId = roomId
    this.params.conferenceId = conferenceId
  },
  methods: {
    peopleComfirm(data) {
      this.calendarShow = true
      this.params.attendeeIdList = []
      data.map(t => {
        this.params.attendeeIdList.push(t.id.toString())
      })
    },
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    },
    onConfirm(date) {
      this.btnDisabled = false
      const [start, end] = date
      this.params.startDate = this.formatDate(start)
      this.params.endDate = this.formatDate(end)
    },
    onSubmit() {
      this.params.oneself = this.checked === true ? 1 : 0
      this.$dialog.confirm({
        title: '将为该人员分配房间',
        message: '确认分配',
        className: 'customDialog'
      }).then(() => {
        // on confirm
        this.$api({
          url: 'manage.allotRoom',
          data: this.params
        }).then(res => {
          if (res.code === 2000) {
            this.calendarShow = false
            this.$router.go(-2)
          }
        }).catch(err => {
          this.$toast({
            message: err.message,
            position: 'bottom'
          })
        })
      }).catch(() => {
        // on cancel
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar-btn {
  height: 36px;
  margin-bottom: 16px;
}
</style>
