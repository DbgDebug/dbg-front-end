import request from '@/utils/request-service'
import { Service, Permission } from './types'

export const defaultService: Service = {
  id: -1,
  serviceName: '',
  displayName: '',
  createTime: 0,
  updateTime: 0,
  status: 0
}

export const defaultPermission: Permission = {
  id: -1,
  serviceId: -1,
  serviceName: '',
  displayName: '',
  permissionId: '',
  permissionName: '',
  path: '',
  createTime: 0,
  updateTime: 0,
  status: 0,
  isUpdate: 0
}

export const getServiceList = (params: any) =>
  request({
    url: '/get_service_list',
    method: 'get',
    params
  })

export const getPermissionTree = () =>
  request({
    url: '/get_permission_tree',
    method: 'get'
  })

export const addService = (data: any) =>
  request({
    url: '/add_service',
    method: 'post',
    data
  })

export const editService = (data: any) =>
  request({
    url: '/edit_service',
    method: 'post',
    data
  })

export const deleteService = (data: any) =>
  request({
    url: '/delete_service',
    method: 'post',
    data
  })

export const getPermissionList = (params: any) =>
  request({
    url: '/get_permission_list',
    method: 'get',
    params
  })

export const addPermission = (data: any) =>
  request({
    url: '/add_permission',
    method: 'post',
    data
  })

export const editPermission = (data: any) =>
  request({
    url: '/edit_permission',
    method: 'post',
    data
  })

export const setPermissionStatus = (data: any) =>
  request({
    url: '/set_permission_status',
    method: 'post',
    data
  })

export const deletePermission = (data: any) =>
  request({
    url: '/delete_permission',
    method: 'post',
    data
  })

export const getPermissionTmpList = (params: any) =>
  request({
    url: '/get_permission_tmp_list',
    method: 'get',
    params
  })

export const addToPermission = (data: any) =>
  request({
    url: '/add_to_permission',
    method: 'post',
    data
  })

export const updateToPermission = (data: any) =>
  request({
    url: '/update_to_permission',
    method: 'post',
    data
  })

export const deletePermissionTmp = (data: any) =>
  request({
    url: '/delete_permission_tmp',
    method: 'post',
    data
  })

export const setPermissionTmpStatus = (data: any) =>
  request({
    url: '/set_permission_tmp_status',
    method: 'post',
    data
  })
