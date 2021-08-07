import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const videoRoutes: RouteConfig = {
  path: '/video',
  component: Layout,
  redirect: '/video/video-list',
  name: 'video',
  meta: {
    title: 'video',
    icon: 'list'
  },
  children: [
    {
      path: '/video-list',
      component: () => import('@/views/video/video.vue'),
      name: 'VideoList',
      meta: {
        title: 'video',
        icon: 'list'
      }
    }
  ]
}

export default videoRoutes
