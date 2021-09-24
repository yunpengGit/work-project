<template>
  <div class="user-info">
    <div class="header">
      <span>个人信息登记表</span>
      <i class="el-icon-close" @click="onClose" />
    </div>
    <div class="content">
      <div class="card">
        <div class="photo">
          <img :src="user.avatar" alt="头像">
        </div>
        <div class="base-info">
          <ul>
            <li>
              <span>工号：</span>
              <span>{{ user.workNo }}</span>
            </li>
            <li>
              <span>SM等级：</span>
              <span>{{ user.secretLevelDesc }}</span>
            </li>
            <li>
              <span>姓名：</span>
              <span>{{ user.nickName }}</span>
            </li>
            <li>
              <span>性别：</span>
              <span>{{ user.sex==='0'?'男':'女' }}</span>
            </li>
          </ul>
        </div>
      </div>
      <ul class="info-cell">
        <li>
          <span>部门：</span><span>{{ user.departments.map((t) => t.deptName).join("/") }}</span>
        </li>
        <li><span>职务：</span><auth-cell prop="positionDesc" :scope="user" /></li>
      </ul>
      <div class="info-part">
        <div class="title">联系方式</div>
        <ul class="info-cell">
          <li><span>手机：</span><auth-cell prop="mobile" :scope="user" /></li>
          <li><span>座机：</span><auth-cell prop="officePhone" :scope="user" /></li>
          <li><span>IP电话：</span><auth-cell prop="ipPhone" :scope="user" /></li>
          <li><span>邮箱：</span><auth-cell prop="email" :scope="user" /></li>
          <li><span>JH邮箱：</span><auth-cell prop="jhEmail" :scope="user" /></li>
          <li><span>办公房间：</span><auth-cell prop="officeAddress" :scope="user" /></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import AuthCell from './AuthCell.vue'
export default {
  components: {
    AuthCell
  },
  props: {
    user: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    onClose () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.user-info {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    height: 56px;
    border-bottom: 1px solid #eee;
    font-size: 16px;
    font-weight: bolder;
    color: #191f24;
    i {
      color: #b8babb;
      font-size: 20px;
      cursor: pointer;
    }
  }
  .content {
    padding: 0 16px;
    .card {
      background: #f7f8fa;
      margin-top: 24px;
      padding: 16px;
      display: flex;
      align-items: center;
      .photo {
        width: 110px;
        height: 110px;
        border-radius: 4px;
        margin-right: 24px;
        background: url(../../assets/userDefaultPhoto.png) no-repeat;
        background-size: cover;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .base-info ul li {
        display: flex;
        font-size: 14px;
        line-height: 18px;
        margin-top: 10px;
        &:first-of-type {
          margin-top: 0;
        }

        span {
          &:first-of-type {
            width: 130px;
            color: rgba(25, 31, 36, 0.64);
          }
          &:last-of-type {
            color: #191f24;
          }
        }
      }
    }
    .info-part {
      margin-top: 24px;
      padding-bottom: 24px;
      .title {
        font-size: 16px;
        font-weight: bold;
        color: #191f24;
        line-height: 21px;
        display: flex;
        align-items: center;
        &::before {
          content: "";
          display: block;
          width: 4px;
          margin-right: 4px;
          height: 15px;
          background: #1e89ff;
        }
      }
    }
    ul.info-cell li {
      line-height: 18px;
      display: flex;
      margin-top: 24px;
      span {
        &:first-of-type {
          width: 130px;
          color: rgba(25, 31, 36, 0.64);
        }
        &:last-of-type {
          color: #191f24;
        }
      }
    }
  }
}
</style>
