import request from '@/utils/request-service'

export const getUserInfo = () =>
  request({
    url: '/user_info',
    method: 'get'
  })

export const login = (data: any) =>
  request({
    url: '/login',
    method: 'post',
    data
  })

export const logout = () =>
  request({
    url: '/logout',
    method: 'get'
  })
