import request from '@/utils/request-service'
import { Role } from './types'

export const defaultRole: Role = {
  id: -1,
  creatorId: -1,
  roleLevel: 10,
  roleName: '',
  createTime: 0,
  updateTime: 0,
  status: 0,
  permissionSet: []
}

export const getRoleList = (params: any) =>
  request({
    url: '/get_role_list',
    method: 'get',
    params
  })

export const addRole = (data: any) =>
  request({
    url: '/add_role',
    method: 'post',
    data
  })

export const editRole = (data: any) =>
  request({
    url: '/edit_role',
    method: 'post',
    data
  })

export const deleteRole = (data: any) =>
  request({
    url: '/delete_role',
    method: 'post',
    data
  })
