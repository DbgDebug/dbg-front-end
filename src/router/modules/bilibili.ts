import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const bilibiliRoutes: RouteConfig = {
  path: '/bilibili',
  component: Layout,
  redirect: '/bilibili/up-list',
  name: '哔哩哔哩',
  meta: {
    title: 'bilibili',
    icon: 'list'
  },
  children: [
    {
      path: 'up-list',
      component: () => import('@/views/bilibili/up-list.vue'),
      name: 'UpList',
      meta: { title: 'bilibiliUpList' }
    },
    {
      path: 'danmu-list',
      component: () => import('@/views/bilibili/danmu-list.vue'),
      name: 'DanmuList',
      meta: { title: 'bilibiliDanmuList' }
    },
    {
      path: 'gift-statistics',
      component: () => import('@/views/bilibili/gift-statistics.vue'),
      name: 'GiftStatistics',
      meta: { title: 'giftStatistics' }
    }
  ]
}

export default bilibiliRoutes
