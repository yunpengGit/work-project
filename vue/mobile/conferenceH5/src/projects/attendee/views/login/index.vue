<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-25 14:34:54
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-09 19:08:22
-->
<template>
  <div class="login-container">
    <van-form @submit="loginIn">
      <van-field
        v-model="username"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="loginIn">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { setToken } from '@/utils/auth'
export default {
  data() {
    return {
      // username: '15122122369',
      // username: '18910393269',
      username: '18500194594',
      // password: '123'
      password: 'y12345678'
    }
  },
  mounted() {
  },
  methods: {
    loginIn() {
      const userName = this.username
      const pwd = this.password
      // 设备唯一标识 - 必传
      const identification = '111'
      const data = {
        identifierCode: identification,
        userInfo: {
          userName,
          pwd
        }
      }
      this.$api({
        url: 'user.login',
        data
      }).then(res => {
        if (res.code === 2000) {
          const token = res.result.token
          setToken(token)
          setTimeout(() => {
            this.$router.push('home')
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100%;
  background-color: #f8f8f8;
  width: 100%;
  padding: 20px 0;
}
</style>
