<template>
  <div class="auth-confirm-box">
    <div class="auth-confirm">
      <div class="auth-info">
        <img class="header-img" :src="authInfo.subscriberPhoto" alt="">
        <div>
          <p class="user-name">
            {{ authInfo.subscriberUserName }} {{ descriptionText }}
          </p>
          <p class="user-department">{{ orgName }}</p>
        </div>
      </div>
      <div class="action-buttons">
        <div v-if="showActionBtns">
          <button class="btn agree" @click="confirmEventAuth(true)">
            同意
          </button>
          <button class="btn refuse" @click="confirmEventAuth(false)">
            拒绝
          </button>
        </div>
        <button
          v-if="authInfo.approvalStatus === 'CONFIRMED'"
          class="btn disabled"
        >
          已同意
        </button>
        <button
          v-if="authInfo.approvalStatus === 'REJECTED'"
          class="btn disabled"
        >
          已拒绝
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      id: '',
      authInfo: {
        approvalStatus: '', // 请求状态 WAITING_CONFIRM 等待确认
        requestId: '', // 请求id
        permsType: '', // 权限范围 READONLY-仅查看 READWRITE-创建、编辑、查看
        subscriberUserName: '',
        subscriberPhoto: '',
        subscriberOrgs: [] // 组织架构
      }
    }
  },
  computed: {
    // 请求权限文案
    descriptionText () {
      let text = ''
      switch (this.authInfo.permsType) {
        case 'READONLY':
          text = '请求查看您的日程'
          break
        case 'READWRITE':
          text = '请求创建、编辑、查看您的日程'
          break
      }
      return text
    },
    // 是否展示操作按钮
    showActionBtns () {
      let show = false
      if (this.authInfo.approvalStatus === 'WAITING_CONFIRM') {
        // 待审批的请求才可以操作
        show = true
      }
      return show
    },
    // 计算需要展示的部门名称
    orgName () {
      // type：2的是需要展示部门
      const orgNameList = this.authInfo.subscriberOrgs
        .filter((t) => t.type === 2)
        .map((t) => t.orgName)
      return orgNameList.join('/')
    }
  },
  watch: {},
  created () {
    this.id = this.$route.query.authzReqId
    if (this.id) {
      this.getInfo()
    }
  },
  methods: {
    // 获取授权请求信息
    getInfo () {
      this.$api('schedule.getEventAuthReq', { authzReqId: this.id }).then(
        (res) => {
          if (res.code === 200) {
            const resData = res.data
            this.authInfo = resData
          } else {
            this.$message.error(res.msg || '发生未知错误')
          }
        }
      )
    },
    confirmEventAuth (approved) {
      this.$api('schedule.confirmEventAuth', {
        requestId: this.id,
        approved
      }).then((res) => {
        if (res.code === 200) {
          this.getInfo()
        } else {
          this.$message.error(res.msg || '发生未知错误')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.auth-confirm-box {
  background: #fff;
  height: calc(100vh - 120px);
  .auth-confirm {
    text-align: center;
    padding-top: 60px;
    .auth-info {
      margin-bottom: 40px;
      .header-img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin-bottom: 30px;
      }
      .user-name {
        font-size: 20px;
        font-weight: 500;
        color: #191f24;
        margin-bottom: 12px;
      }
      .user-department {
        font-size: 13px;
        color: rgba(25, 31, 36, 0.64);
      }
    }
    .action-buttons {
      .btn {
        margin: 0 auto 20px;
        display: block;
        width: 240px;
        height: 40px;
        border-radius: 4px;
        font-size: 18px;
        color: #191f24;
        &:focus,
        &:active {
          outline: none;
        }
        cursor: pointer;
        &.agree {
          background: #1e89ff;
          box-shadow: 0px 3px 8px 0px rgba(30, 137, 255, 0.3);
          color: #fff;
          &:active {
            background: #0f6ad9 !important;
          }
          &:hover {
            background: #47a6ff;
          }
        }
        &.refuse {
          background: #ffffff;
          box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(25, 31, 36, 0.16);
          &:active {
            border: 1px solid #0f6ad9 !important;
            color: #0f6ad9 !important;
          }
          &:hover {
            border: 1px solid #47a6ff;
            color: #47a6ff;
          }
        }
        &.disabled {
          border: 1px solid rgba(25, 31, 36, 0.16);
          color: rgba(25, 31, 36, 0.64);
          background: #fff;
        }
      }
    }
  }
}
</style>
