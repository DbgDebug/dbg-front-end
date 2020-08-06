import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const accountRoutes: RouteConfig = {
  path: '/account',
  component: Layout,
  redirect: '/account/account-list',
  name: '用户管理',
  meta: {
    title: 'accountManage',
    icon: 'list'
  },
  children: [
    {
      path: '/account-list',
      component: () => import('@/views/account/account-list.vue'),
      name: 'AccountList',
      meta: {
        title: 'accountList',
        icon: 'list'
      }
    }
  ]
}

export default accountRoutes
