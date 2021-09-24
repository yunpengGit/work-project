<template>
  <div class="part">
    <div v-if="title" class="title">{{ title }}</div>
    <van-grid :column-num="items.length > 1 ? 2 : 1">
      <van-grid-item
        class="item"
        v-for="(item) in items"
        :key="item.name"
        @click="$emit('itemTap', item)"
      >
        <router-link v-if="item.grayState===0&&listMap.get(item.name).link" :to="listMap.get(item.name).link">
          <div flex="main:center cross:center">
            <img class="logo-icon" v-if="listMap.get(item.name).src" :src="item.grayState ? listMap.get(item.name).src0 : listMap.get(item.name).src" alt />
            <svg-icon
              v-else-if="logoMap.get(item.name)"
              class="logo-icon"
              :href="item.grayState ? logoMap.get(item.name)+'_gray' : logoMap.get(item.name)"
            />
            <span>{{ item.name }}</span>
          </div>
        </router-link>
        <div flex="main:center cross:center" v-else>
            <img class="logo-icon" v-if="listMap.get(item.name).src" :src="item.grayState ? listMap.get(item.name).src0 : listMap.get(item.name).src" alt />
            <svg-icon
              v-else-if="logoMap.get(item.name)"
              class="logo-icon"
              :href="item.grayState ? logoMap.get(item.name)+'_gray' : logoMap.get(item.name)"
            />
            <span>{{ item.name }}</span>
          </div>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import Vue from 'vue'
import { Grid, GridItem, Image } from 'vant'
import staticDataMaps from '../../mock/staticDataMap'
import IndexConfig from '@/mock/indexConfig'

Vue.use(Grid).use(GridItem).use(Image)
const { logoMap } = staticDataMaps
const { listMap } = IndexConfig
export default {
  name: 'Part',
  props: {
    title: {
      type: String,
      default: ''
    },
    items: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      logoMap,
      listMap
    }
  }
}
</script>

<style lang="less" scoped>
@import '~vant/es/style/var';

.part {
  background: white;
  margin-bottom: 10px;
  font-size: 14px;
  a {
    color: #333333;
    font-size: 14px;
  }
  .logo-icon {
    width: auto;
    height: 40px;
    margin-right: 18px;
    &.icon {
      width: 28px;
      height: 28px;
    }
  }
}

.part .title {
  font-size: 12px;
  line-height: 30px;
  color: #007ec8;
  padding: 0 10px;
  border-left: 2px solid #007ec8;
  position: relative;
  &:before {
    position: absolute;
    left: -1px;
    top: 9px;
    z-index: 1;
    content: '';
    width: 0;
    height: 0;
    border: 5px solid;
    border-color: transparent transparent transparent #007ec8;
  }
}

.item {
  height: 68px;
}
</style>

<style scoped>
.item /deep/ .van-grid-item__content {
  padding: 4px;
}
</style>
