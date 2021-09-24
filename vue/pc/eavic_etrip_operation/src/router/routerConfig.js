import { Basic, UserLayout, RouteView, LeftAndRightColumns } from './../layouts'

export const localRouterMap = [
  {
    path: '/',
    name: 'index',
    meta: { title: '首页' },
    component: Basic,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        id: '0',
        meta: { title: '系统首页', keepAlive: true, icon: 'home' },
        component: () => import('../views/home.vue')
      },
      {
        path: 'authorityManagement',
        name: 'authorityManagement',
        redirect: '/authorityManagement/index',
        component: RouteView,
        id: '2',
        meta: { title: '系统管理', keepAlive: true, icon: 'user' },
        children: [
          {
            path: 'index',
            name: 'authorityManagement/index',
            id: '2-1',
            meta: { title: '权限管理', keepAlive: true },
            component: () => import('../views/systemManagement/authorityManagement/index.vue')
          },
          {
            path: 'accountManagement',
            name: 'accountManagement',
            id: '2-2',
            meta: { title: '账户管理', keepAlive: true },
            component: () => import('../views/systemManagement/accountManagement/index.vue')
          }
        ]

      },
      {
        path: 'dataDictionary',
        name: 'dataDictionary',
        redirect: '/dataDictionary/sensitiveWords',
        component: RouteView,
        id: '3',
        meta: { title: '数据字典', keepAlive: true, icon: 'book' },
        children: [
          {
            path: 'sensitiveWords',
            name: 'sensitiveWords',
            id: '3-1',
            meta: { title: '敏感字字典', keepAlive: true },
            component: () => import('../views/dataDictionary/sensitiveWords.vue')
          },
          {
            path: 'mileage',
            name: 'mileage',
            id: '3-2',
            meta: { title: '里程字典', keepAlive: true },
            component: () => import('../views/dataDictionary/mileage.vue')
          },
          {
            path: 'airport',
            name: 'airport',
            id: '3-3',
            meta: { title: '机场字典', keepAlive: true },
            component: () => import('../views/dataDictionary/airport.vue')
          },
          {
            path: 'airline',
            name: 'airline',
            id: '3-4',
            meta: { title: '航空公司字典', keepAlive: true },
            component: () => import('../views/dataDictionary/airline.vue')
          },
          {
            path: 'city',
            name: 'city',
            id: '3-5',
            meta: { title: '城市字典', keepAlive: true },
            component: () => import('../views/dataDictionary/city.vue')
          }
        ]
      },
      {
        path: 'supplier',
        name: 'supplier',
        redirect: '/supplier/info',
        component: LeftAndRightColumns,
        id: 'supplier',
        meta: { title: '供应商', keepAlive: true, icon: 'gold' },
        children: [
          {
            path: 'info',
            name: 'info',
            id: 'supplier-info',
            meta: { title: '供应商信息', keepAlive: true },
            component: () => import('../views/supplier/info.vue')
          },
          {
            path: 'layout',
            name: 'layout',
            id: 'supplier-domesticTicketServiceSettings',
            meta: { title: '国内机票服务设置', keepAlive: true },
            component: () => import('../views/supplier/layout.vue'),
            redirect: 'orderSettings',
            children: [
              {
                path: 'orderSettings',
                name: 'orderSettings',
                id: 'supplier-domesticTicketServiceSettings-orderSettings',
                meta: { title: '订单设置', keepAlive: true },
                component: () => import('../views/supplier/orderSettings.vue')
              },
              {
                path: 'contact',
                name: 'contact',
                id: 'supplier-domesticTicketServiceSettings-contact',
                meta: { title: '供应商联系人', keepAlive: true },
                component: () => import('../views/supplier/contact.vue')
              },
              {
                path: 'serviceRelationship',
                name: 'serviceRelationship',
                id: 'supplier-domesticTicketServiceSettings-serviceRelationship',
                meta: { title: '服务关系', keepAlive: true },
                component: () => import('../views/supplier/serviceRelationship.vue')
              },
              {
                path: 'templateBinding',
                name: 'templateBinding',
                id: 'supplier-domesticTicketServiceSettings-templateBinding',
                meta: { title: '模板绑定', keepAlive: true },
                component: () => import('../views/supplier/templateBinding.vue')
              }
            ]
          }
        ]
      },
      {
        path: 'organizationManagement',
        name: 'organizationManagement',
        redirect: '/organizationManagement/corporateInfo',
        component: RouteView,
        id: 'organizationManagement',
        meta: { title: '组织管理', keepAlive: true, icon: 'setting' },
        children: [
          {
            path: 'corporateInfo',
            name: 'corporateInfo',
            id: 'organizationManagement-1',
            meta: { title: '企业信息', keepAlive: true },
            component: () => import('../views/organizationManagement/corporateInfo.vue')
          },
          {
            path: 'corporateAirTicket',
            name: 'corporateAirTicket',
            id: 'organizationManagement-2',
            component: () => import('../views/organizationManagement/corporateAirTicket.vue'),
            meta: { title: '企业机票', keepAlive: true },
            children: [
              {
                path: 'originalBill',
                name: 'originalBill',
                id: 'corporateAirTicket-originalBill',
                meta: { title: '机票-原始账单', keepAlive: true },
                component: () => import('../views/organizationManagement/corporateAirTicket/originalBill.vue')
              },
              {
                path: 'businessBill',
                name: 'businessBill',
                id: 'corporateAirTicket-businessBill',
                meta: { title: '机票-企业账单', keepAlive: true },
                component: () => import('../views/organizationManagement/corporateAirTicket/businessBill.vue')
              }
            ]
          },
          {
            path: 'corporateHotel',
            name: 'corporateHotel',
            id: 'organizationManagement-3',
            meta: { title: '企业酒店', keepAlive: true },
            component: () => import('../views/organizationManagement/corporateHotel.vue')
          },
          {
            path: 'corporateUseCar',
            name: 'corporateUseCar',
            id: 'organizationManagement-2',
            meta: { title: '企业用车', keepAlive: true },
            component: () => import('../views/organizationManagement/corporateUseCar.vue')
          }
        ]
      },
      {
        path: 'configurationManagement',
        name: 'configurationManagement',
        redirect: '/configurationManagement/templateType',
        component: RouteView,
        id: 'configurationManagement',
        meta: { title: '配置管理', keepAlive: true, icon: 'setting' },
        children: [
          {
            path: 'templateModel',
            name: 'templateModel',
            id: 'configurationManagement-templateModel',
            meta: { title: '模版配置', keepAlive: true },
            component: () => import('../views/configurationManagement/templateModel.vue')
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
/*
*基本路由
*
*/
export const baseRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '../views/user/login')
      },
      {
        path: 'recover',
        name: 'recover',
        component: () => import('../views/user/recover.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('../views/user/register.vue')
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/404')
  }
]
