<template>
    <div class="switch-box" v-if="state">
      <div class="switch">
        <router-link to="/" exact-active-class="active">因公</router-link>
        <router-link to="/private" exact-active-class="active">因私</router-link>
      </div>
    </div>
</template>

<script>
import toData from './toData.js'
export default {
  data () {
    return {
      state: true
    }
  },
  mounted () {
    toData.$on('privateState', (val) => {
      this.state = val
    })
  }
}
</script>

<style lang="less" scoped>
.switch-box{
  position: fixed;
  top: 0;
  left: -70px;
  margin-left: 50%;
  z-index: 1000;
  width: 140px;
  height: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  & > .switch{
    width: 140px;
    height: 24px;
    background-color: #0188CC;
    line-height: 24px;
    border: 1px solid #fff;
    border-radius: 24px;
    color: #fff;
    display: flex;
    & > a{
      color: #fff;
    }
    .active{
      color: #0188CC;
      background-color: #fff;
    }
    & > a{
      display: inline-block;
      height: inherit;
      flex-basis: 50%;
      border-radius: 24px;
      text-align: center;
    }
  }
}
</style>
