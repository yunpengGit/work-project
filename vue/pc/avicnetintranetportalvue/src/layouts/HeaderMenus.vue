<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-06-06 15:42:06
 * @LastEditors: peng
 * @LastEditTime: 2021-09-17 17:53:50
-->
<template>
  <div class="header-menus">
    <router-link v-for="item in list" :key="item.pageId" class="item" :class="{'active': item.pageUrl===$route.path}" :to="item.pageUrl">
      {{ item.pageName }}
    </router-link>
    <div v-if="isShow" class="box">
      <icon-svg name="xiala-shaixuan" class="icon" />
      <div class="list">
        <router-link v-for="item in boxList" :key="item.pageId" class="item" :class="{'active': item.pageUrl===$route.path}" :to="item.pageUrl">
          {{ item.pageName }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import iconSvg from '@/components/icon-svg'
export default {
  name: 'HeaderMenus',
  components: {
    iconSvg
  },
  data () {
    return {
      currentId: '',
      isShow: false,
      list: [],
      boxList: []
    }
  },
  created () {
    this.$api('home.siteUserList').then(res => {
      const sitePages = []
      res.data.forEach(e => {
        sitePages.push(...e.sitePages)
      })
      if (sitePages.length > 5) {
        this.isShow = true
        this.list = sitePages.splice(0, 5)
        this.boxList = sitePages
      } else {
        this.list = sitePages
      }
      // console.log(sitePages.splice(0, 5))
      // console.log(sitePages)
      // this.list = sitePages.splice(0, 5)
      // this.boxList = sitePages
      // console.log(this.boxList)
    })
  },
  methods: {
    routeTo (item) {
      this.$router.push(item.pageUrl)
    }
  }
}
</script>
<style lang="scss" scoped>
.box{
  margin-left: 10px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover{
    .list{
      display: inline-block;
    }
  }
  .icon{
    color: #fff;
    cursor: pointer;
  }
  .list{
    display: none;
    padding: 4px 14px;
    top: 40px;
    /* right: 0; */
    position: absolute;
    width: 126px;
    background: #F6F9FE;
    box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.18);
    border-radius: 4px;
    & > .item{
      display: flex;
      height: 34px;
      line-height: 34px;
      color:rgba(25, 31, 36, 0.88) !important;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &.active{
        color: #499CF8 !important;
        border: 0 !important;
      }
    }
  }
}
</style>
