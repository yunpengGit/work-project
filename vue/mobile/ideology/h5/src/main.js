/*
 * @Description:
 * @Author: peng
 * @Date: 2021-08-10 15:15:51
 * @LastEditors: peng
 * @LastEditTime: 2021-08-10 15:36:58
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./components";

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
