import Vue from 'vue';
import VueRouter from 'vue-router';
import circulate from '../layouts/circulate.vue';
import layout from '../views/circulate/layout.vue';

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'index',
    component: circulate,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/circulate/list.vue'),
    redirect: '/circulate',
    children: [
      {
        path: '/circulate',
        name: 'circulate',
        component: layout,
        redirect: '/all',
        children: [
          {
            path: '/all',
            name: 'all',
            component: () => import('../views/circulate/all.vue'),
          },
          {
            path: '/read',
            name: 'read',
            component: () => import('../views/circulate/read.vue'),
          },
          {
            path: '/unread',
            name: 'unread',
            component: () => import('../views/circulate/unread.vue'),
          },
          {
            path: '/recall',
            name: 'recall',
            component: () => import('../views/circulate/recall.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/checkList',
    name: 'checkList',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/circulate/checkList.vue'),
  },
];

const router = new VueRouter({
  // mode: 'history', // ! history模式打包后不能直接访问打包路径下index.html访问
  base: process.env.BASE_URL,
  routes,
});

export default router;
