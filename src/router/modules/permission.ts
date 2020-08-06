import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const permissionRouters: RouteConfig = {
  path: '/permission',
  component: Layout,
  redirect: '/permission/permission-list',
  meta: {
    title: 'permission',
    icon: 'lock',
    alwaysShow: true // will always show the root menu
  },
  children: [
    {
      path: 'role-list',
      component: () => import('@/views/permission/role-list.vue'),
      name: 'RoleList',
      meta: { title: 'roleList' }
    },
    {
      path: 'service-list',
      component: () => import('@/views/permission/service-list.vue'),
      name: 'ServiceList',
      meta: { title: 'serviceList' }
    },
    {
      path: 'permission-list',
      component: () => import('@/views/permission/permission-list.vue'),
      name: 'PermissionList',
      meta: { title: 'permissionList' }
    },
    {
      path: 'page-list',
      component: () => import('@/views/permission/page-list.vue'),
      name: 'PageList',
      meta: { title: 'pagePermission' }
    }
  ]
}

export default permissionRouters
