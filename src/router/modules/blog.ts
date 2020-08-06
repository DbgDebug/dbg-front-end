import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const blogRoutes: RouteConfig = {
  path: '/blog',
  component: Layout,
  redirect: '/blog/article-list',
  name: 'blogManage',
  meta: {
    title: 'blogManage',
    icon: 'list'
  },
  children: [
    {
      path: 'article-list',
      component: () => import('@/views/blog/article-list.vue'),
      name: 'ArticleList1',
      meta: {
        title: 'articleList',
        icon: 'list'
      }
    },
    {
      path: 'article-create',
      component: () => import('@/views/blog/article-create.vue'),
      name: 'ArticleCreate',
      meta: {
        title: 'createArticle',
        icon: 'edit'
      }
    },
    {
      path: 'article-category',
      component: () => import('@/views/blog/article-category.vue'),
      name: 'ArticleCategory',
      meta: {
        title: 'articleCategory',
        icon: 'list'
      }
    }
  ]
}

export default blogRoutes
