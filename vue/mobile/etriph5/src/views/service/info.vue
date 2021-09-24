<template>
  <div class="info-page">
    <van-nav-bar title="服务商简介" left-arrow @click-left="back" />
    <div flex-item="0" class="head-title" flex="cross:center main:center">
      <img :src="info.logo" />
      <span>{{info.title}}</span>
    </div>
    <ul flex="dir:column">
      <li v-for="(item, index) in info.infos" :key="item.title">
        <div class="title" flex="cross:center">
          <span>{{++index}}</span>
          {{item.title}}
        </div>
        <div v-for="(text, index) in item.list" :key="index">
          <div v-if="text.title" class="sub-title" flex="cross:center">
            <svg-icon flex-item="0" :href="text.logo||'iconjiaotongfei'"></svg-icon>
            <span>{{text.title}}</span>
          </div>
          <div :class="['text', {indent: !text.title}]" v-html="text.text"></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { NavBar, Icon, Button } from 'vant'
import Vue from 'vue'
import staticDataMaps from '@/mock/staticDataMap'

const { serviceInfoMap } = staticDataMaps
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
    this.info = serviceInfoMap.get(this.$route.query.name)
  }
}
</script>

<style lang="less" scoped>
.head-title {
  background: white;
  font-size: 14px;
  color: #4a4a4a;
  padding: 10px 0;
  img {
    width: 40px;
    margin-right: 8px;
  }
}
li {
  margin-top: 8px;
  background: white;
  padding: 8px;
}

li {
  .title {
    font-size: 16px;
    color: #666;
    line-height: 40px;
    margin-bottom: 12px;
    span {
      background: rgba(100, 156, 219, 0.527);
      color: white;
      width: 14px;
      text-align: center;
      margin-right: 8px;
    }
  }
  .sub-title {
    font-size: 13px;
    color: #666;
    margin-bottom: 12px;
    .icon {
      width: 26px;
      height: 26px;
      margin-right: 8px;
    }
  }
  .text {
    font-size: 11px;
    color: #666;
    margin-bottom: 12px;
    &.indent {
      text-indent: 1em;
    }
  }
}
</style>
