/*
 * @Description:
 * @Author: peng
 * @Date: 2021-08-10 15:15:51
 * @LastEditors: peng
 * @LastEditTime: 2021-08-10 15:34:07
 */
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "Home" */ "../views/Home.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
