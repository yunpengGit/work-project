<template>
  <div class="user-wrapper">
    <div class="content-box">
      <span class="serach">
        <a-input placeholder="搜索内容" class="search-input"/>
        <span class="search-btn-icon">
          <SvgIcon href="search" class="search-icon"/>
        </span>
      </span>
      <notice-icon class="action"/>
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small" :src="avatar" v-if="avatar"/>
          <a-icon type="user" v-else/>
          <span class='name'>{{ nickname }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="0">
            <router-link :to="{ name: 'center' }">
              <a-icon type="user"/>
              <span>个人中心</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="1">
            <router-link :to="{ name: 'settings' }">
              <a-icon type="setting"/>
              <span>账户设置</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="2" disabled>
            <a-icon type="setting"/>
            <span>测试</span>
          </a-menu-item>
          <a-menu-divider/>
          <a-menu-item key="3">
            <span @click="logout">
              <a-icon type="logout"/>
              <span>退出登录</span>
            </span>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import NoticeIcon from '@/components/NoticeIcon'
import { mapActions } from 'vuex'
import { USER_MODEL } from '@/store/mutation-types'

export default {
  name: 'UserMenu',
  components: {
    NoticeIcon
  },
  computed: {
    model() {
      return Vue.ls.get(USER_MODEL)
    },
    nickname() {
      return this.model.employee.name
    },
    avatar() {
      return this.model.employee.avatarPath
    }

  },
  methods: {
    ...mapActions(['Logout']),
    logout () {
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          return this.Logout({}).then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 100)
          }).catch(err => {
            this.$message.error({
              title: '错误',
              description: err.message
            })
          })
        },
        onCancel () {
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.search{
  &-input{
    width: 300px;
    border: 0;
    &:focus{
      box-shadow: none;
    }
  }
  &-icon{
    vertical-align: middle;
    width: 30px;
    height: 30px;
  }
}
.avatar{
  margin-right: 10px;
}
.name{
  vertical-align: middle;
}
.user-wrapper{
  padding-right: 20px;
  float: right;
}
</style>
