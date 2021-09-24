<template>
  <div>
    <van-nav-bar title="服务专线" left-arrow @click-left="back" />
    <ul>
      <li v-for="item in list" :key="item.id">
        <div class="content" flex>
          <img :src="serviceLogoMap.get(item.name_short)" :alt="item.name_short" />
          <p flex="dir:column main:between">
            <span class="name">{{item.name_short}}</span>
            <span class="tel" flex="cross:center">
              <van-icon name="phone-o" />
              <a :href="`tel:${item.hot_tel}`">{{item.hot_tel}}</a>
            </span>
          </p>
        </div>
        <div class="footer" flex="dir:row-reverse cross:center">
          <!-- <van-button @click="deving" round plain size="mini" type="warning">查看评价</van-button> -->
          <router-link :to="`/serviceInfo?name=${item.name_short}`">
            <van-button round plain size="mini" type="info">查看简介</van-button>
          </router-link>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { NavBar, Toast, Icon, Button } from 'vant'
import Vue from 'vue'
import ApiService from '@/api/service'
import staticDataMaps from '@/mock/staticDataMap'

const { serviceLogoMap } = staticDataMaps
Vue.use(NavBar).use(Icon).use(Button)

export default {
  data () {
    return {
      list: [],
      serviceLogoMap
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    deving () {
      Toast('正在开发中，敬请期待!')
    },
    back () {
      this.$router.back()
    },
    getList () {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      const { categoryId, tel } = userInfo
      ApiService.getServiceList({
        categoryId,
        obtUserName: tel
      }).then((result) => {
        const { successState, model, resultStr } = result.CommonModel
        if (successState) {
          this.list = model
        } else {
          Toast(resultStr)
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
li {
  background-color: white;
  margin-bottom: 6px;
  padding-left: 8px;
  .content {
    padding: 10px 8px 14px 0;
    border-bottom: 1px solid #eeeeee;
  }
  img {
    width: 54px;
    height: 54px;
  }
  p {
    margin: 0;
    padding: 2px 8px;
  }
  .name {
    font-size: 15px;
    color: #4a4a4a;
  }
  .tel {
    font-size: 13px;
    color: #3e85d0;
    a {
      color: #3e85d0;
    }
    .van-icon {
      font-size: 20px;
      padding-right: 6px;
      margin-right: 6px;
      border-right: 1px solid #eee;
    }
  }
}
.footer {
  padding: 6px 0;
  button {
    font-size: 8px;
    padding: 0 10px;
    margin-right: 8px;
  }
}
</style>
