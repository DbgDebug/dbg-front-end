import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const programRoutes: RouteConfig = {
  path: '/program',
  component: Layout,
  redirect: '/program/program-list',
  name: 'program',
  meta: {
    title: 'program',
    icon: 'list'
  },
  children: [
    {
      path: '/program-list',
      component: () => import('@/views/program/java.vue'),
      name: 'JavaList',
      meta: {
        title: 'program',
        icon: 'list'
      }
    }
  ]
}

export default programRoutes
