<template>
  <div class="logo">
    <router-link :to="{name:'home'}">
      <SvgIcon href="guanlizhongxin" class="icon"/>
      <span v-if="showTitle" class='title'>{{ title }}</span>
    </router-link>
  </div>
</template>

<script>

export default {
  name: 'Logo',
  props: {
    title: {
      type: String,
      default: '差旅平台供应商',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
<style lang='less' scoped>
/deep/.router-link-exact-active{
  height: 100%;
}
.logo{
  padding: 16px 10px;
  background-color: rgb(1, 150, 250);
  .icon{
    vertical-align: middle;
    width: 40px;
    height: 40px;
  }
}
.title{
  vertical-align: middle;
  margin-left: 10px;
  width: 200px;
  color: #fff;
  font-size: 22px;
}
</style>
