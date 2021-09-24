<template>
  <div class="copyright">
    <router-link to="/planeNote">
      <van-button class="journey-link-btn" type="info" block round>
        <div class="journey-link" flex="cross:center main:center">
          <svg-icon href="iconmap" class="journey-icon" />
          <span>行程记录</span>
        </div>
      </van-button>
    </router-link>
    <div class="footer">
      <p>
        中国航空工业集团有限公司
        <br />
        <small>Aviation Industry Corporation of China,Ltd</small>
      </p>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Button } from 'vant'
Vue.use(Button)
export default {
  name: 'Copyright'
}
</script>

<style lang="less" scoped>
.copyright {
  padding: 0 20px;
  font-size: 12px;
}
.journey-link-btn {
  height: 38px;
  line-height: 38px;
}
.journey-link {
  font-size: 14px;
}
.journey-icon {
  height: 22px;
  width: 22px;
  margin-right: 12px;
}
.footer {
  text-align: center;
  padding-bottom: 4px;
  font-size: 13px;
  color: #999;
  p {
    margin: 10px 0 0;
    line-height: 1;
  }
  small {
    font-size: 8px;
  }
}
</style>
