import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const fileRoutes: RouteConfig = {
  path: '/file',
  component: Layout,
  redirect: '/file/file-list',
  name: 'fileManage',
  meta: {
    title: 'fileManage',
    icon: 'folder'
  },
  children: [
    {
      path: '/file-list',
      component: () => import('@/views/file/file-list.vue'),
      name: 'FileList',
      meta: {
        title: 'fileManage',
        icon: 'list'
      }
    }
  ]
}

export default fileRoutes
