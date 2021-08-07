import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const codeRoutes: RouteConfig = {
  path: '/code',
  component: Layout,
  redirect: '/code/editor',
  name: 'code',
  meta: {
    title: 'code',
    icon: 'list'
  },
  children: [
    {
      path: 'editor',
      component: () => import('@/views/code/editor.vue'),
      name: 'CodeEditor',
      meta: {
        title: 'codeEditor',
        icon: 'list'
      }
    }
  ]
}

export default codeRoutes
