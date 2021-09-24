<!--
 * @Author: your name
 * @Date: 2020-10-19 13:00:31
 * @LastEditTime: 2020-10-29 14:12:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \h5\src\views\home\detailCompany.vue
-->
<template>
  <div class="info-page">
    <!-- <van-nav-bar title="服务商简介" left-arrow @click-left="back" /> -->
    <div class="head-title">
      <img :src="info.logo" />
      <span>{{info.title}}</span>
    </div>
    <div class="panel" v-for="(item, index) in info.infos" :key="index">
      <div class="panel-title"><img :src="item.logo" alt="" v-if="item.logo"><span>{{item.title}}</span></div>
      <div v-for="(ele, index) in item.list" :key="'item.list'+index">
        <div class="label-text" v-if="ele.title">{{ele.title}}</div>
        <div class="text" v-if="ele.text">{{ele.text}}</div>
        <ul v-if="ele.list">
          <li v-for="(ele, index) in ele.list" :key="'ele.list'+index">
            <div>{{ele.title}}</div>
            <div>{{ele.text}}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { NavBar, Icon, Button } from 'vant'
import detailCompanyInfo from '@/assets/mock/detailCompanyInfo'

Vue.use(NavBar)
  .use(Icon)
  .use(Button)
export default {
  data () {
    return {
      info: {}
    }
  },
  methods: {
    back () {
      this.$router.back()
    }
  },
  created () {
    // this.$changePageTitle(`${this.$route.query.companyName}简介`)
    this.info = detailCompanyInfo.get(this.$route.query.companyName)
  }
}
</script>

<style lang="less" scoped>
.head-title {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  background: #FFFFFF;
  font-size: 17px;
  font-weight: bold;
  color: #13171C;
  line-height: 24px;
  img {
    width: 30px;
    margin-right: 5px;
  }
}
.panel{
  margin-top: 10px;
  padding: 15px;
  background-color: #fff;
  .panel-title{
    display: flex;
    align-items: center;
    img{
      margin-right: 8px;
      width: 24px;
      height: 24px;
    }
    span{
      font-size: 17px;
      font-weight: bold;
      color: #13171C;
    }
  }
  .label-text{
    margin-top: 12px;
    font-size: 15px;
    font-weight: bold;
    color: #13171C;
    line-height: 21px;
  }
  .text{
    margin-top: 10px;
    font-size: 15px;
    color: #52585D;
    line-height: 21px;
  }
  ul{
    margin-top: 10px;
    padding: 15px 10px;
    background: #F5F7F9;
    border-radius: 4px;
    li{
      margin-top: 10px;
      &:first-child{
        margin-top: 0;
      }
    }
    div{
      padding-left: 12px;
      &:nth-child(1){
        font-size: 15px;
        font-weight: bold;
        color: #52585D;
        line-height: 21px;
        position: relative;
        &::before{
          position: absolute;
          top: 10px;
          left: 0;
          content: '';
          display: flex;
          width: 4px;
          height: 4px;
          background-color: #52585D;
          border-radius: 50%;
        }
      }
      &:nth-child(2){
        margin-top: 3px;
        font-size: 12px;
        color: #81878E;
        line-height: 15px;
      }
    }
  }
}
</style>
