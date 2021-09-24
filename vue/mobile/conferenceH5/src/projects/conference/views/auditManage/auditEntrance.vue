<!--
* @Descripttion:
* @Author: wanghz
* @Date: 2021-08-24 15:44:00
* @LastEditors: Please set LastEditors
* @LastEditTime:
-->
<template>
  <div class="audit-entrance">
    <ul>
      <li class="audit-entrance-item" v-for="(item, index) in auditListData" :key="index" @click="linkAudit(item)">
        <div class="item-title">
          <img :src="item.icon" alt="" />
          <span>{{ item.title }}</span>
        </div>
        <div class="item-num">
          <span v-if="item.num">{{ item.num }}</span>
          <img src="@/assets/images/skip.svg" alt="" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import auditCar from '@/assets/images/auditCar.svg'
import auditStay from '@/assets/images/auditStay.svg'
import auditDinner from '@/assets/images/auditDinner.svg'
import auditTicket from '@/assets/images/auditTicket.svg'
import auditMsg from '@/assets/images/auditMsg.svg'

export default {
  props: {
    routeParams: {
      type: Object
    }
  },
  data() {
    return {
      auditListData: [
        { key: 'vehicleTaskCounts', icon: auditCar, title: '用车安排审核', link: 'carAudit', num: 0 },
        { key: 'roomTaskCounts', icon: auditStay, title: '住宿安排审核', link: 'stayAudit', num: 0 },
        { key: 'dinnerTaskCounts', icon: auditDinner, title: '用餐安排审核', link: 'dinnerAudit', num: 0 },
        { key: 'cardTaskCounts', icon: auditTicket, title: '票证安排审核', link: 'ticketAudit', num: 0 },
        { key: 'msgTaskCounts', icon: auditMsg, title: '消息审核', link: 'message', num: 0 }
      ]
    }
  },
  created() {
    this.getAuditCounts()
  },
  mounted() {},
  methods: {
    // 获取审核任务数量
    getAuditCounts() {
      const conferenceId = this.routeParams.id
      this.$api({
        url: 'message.getAuditCounts',
        data: {
          conferenceId,
          auditStatus: 2 // 审核任务状态，不传查询全部 0拒绝审核任务 1通过审核任务 2待审核
        }
      }).then(res => {
        const data = res.result
        this.auditListData.forEach(element => {
          for (const key in data) {
            if (key === element.key) {
              element.num = data[key]
            }
          }
        })
      })
    },
    // 跳转到审核页面
    linkAudit(item) {
      this.$router.push({
        name: item.link,
        query: {
          [this.$enc('conferenceId')]: this.$enc(this.routeParams.id)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.audit-entrance {
  .audit-entrance-item {
    height: 64px;
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 14px;
    .item-title,
    .item-num {
      display: flex;
      align-items: center;
    }
    .item-title {
      img {
        margin-right: 16px;
      }
      span {
        height: 22px;
        font-size: 17px;
        font-weight: 400;
        color: #191f24;
        line-height: 22px;
      }
    }
    .item-num {
      height: 18px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(25, 31, 36, 0.56);
      line-height: 18px;
    }
  }
}
</style>
