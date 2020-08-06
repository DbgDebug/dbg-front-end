import request from '@/utils/request-service'
import { Account } from './types'

export const defaultAccount: Account = {
  id: -1,
  username: '',
  password: '',
  realName: '',
  email: '',
  sex: 0,
  status: 0,
  roleIds: [],
  permissionSet: [],
  lastTime: 0
}

export const getAccountList = (params: any) =>
  request({
    url: '/get_account_list',
    method: 'get',
    params
  })

export const addAccount = (data: any) =>
  request({
    url: '/add_account',
    method: 'post',
    data
  })

export const editAccount = (data: any) =>
  request({
    url: '/edit_account',
    method: 'post',
    data
  })

export const deleteAccount = (data: any) =>
  request({
    url: '/delete_account',
    method: 'post',
    data
  })

export const updatePassword = (data: any) =>
  request({
    url: '/update_password',
    method: 'post',
    data
  })
