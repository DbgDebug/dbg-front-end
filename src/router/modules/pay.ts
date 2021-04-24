import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const payRoutes: RouteConfig = {
  path: '/pay',
  component: Layout,
  redirect: '/pay/pay-test',
  name: 'payModule',
  meta: {
    title: 'payModule',
    icon: 'shopping'
  },
  children: [
    {
      path: '/pay-test',
      component: () => import('@/views/pay/pay-test.vue'),
      name: 'PayTest',
      meta: {
        title: 'payTest',
        icon: 'shopping'
      }
    }
  ]
}

export default payRoutes
