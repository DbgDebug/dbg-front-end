import request from '@/utils/request-service'
import requestJson from '@/utils/request-json'
import { LiveRoom, GiftStatistics, Up } from './types'

export const defaultLiveRoom: LiveRoom = {
  id: 0,
  roomid: '',
  up: '',
  createTime: '',
  updateTime: '',
  status: 0
}

export const defaultgiftStatistics: GiftStatistics = {
  id: 0,
  roomId: 0,
  giftName: '',
  num: 0,
  price: 0,
  date: 0
}

export const defaultUp: Up = {
  roomid: -1,
  up: '全部'
}

export const getUpList = () =>
  request({
    url: '/get_up_list',
    method: 'get'
  })

export const getDanmuList = (params: any) =>
  request({
    url: '/get_danmu_list',
    method: 'get',
    params
  })

export const getCacheDanmuList = () =>
  request({
    url: '/get_cache_danmu',
    method: 'get'
  })

export const addRoom = (data: any) =>
  request({
    url: '/add_room',
    method: 'post',
    data
  })

export const editRoom = (data: any) =>
  request({
    url: '/edit_room',
    method: 'post',
    data
  })

export const deleteRoom = (data: any) =>
  request({
    url: '/delete_room',
    method: 'post',
    data
  })

export const start = (data: any) =>
  request({
    url: '/start',
    method: 'post',
    data
  })

export const stop = (data: any) =>
  request({
    url: '/stop',
    method: 'post',
    data
  })

export const stopNow = (data: any) =>
  request({
    url: '/stop_now',
    method: 'post',
    data
  })

export const getRoomList = (params: any) =>
  request({
    url: '/get_room_list',
    method: 'get',
    params
  })

export const getMonitorRoomList = (params: any) =>
  request({
    url: '/get_monitor_room_list',
    method: 'get',
    params
  })

export const getRealRoomId = (params: any) =>
  request({
    url: '/get_real_room_id',
    method: 'get',
    params
  })

export const refreshStatistics = (params: any) =>
  request({
    url: '/refresh_statistics',
    method: 'get',
    params
  })

export const getGiftStatistics = (roomId: number, date: number, giftType: number) =>
  requestJson({
    url: `/dotnet/bilibili/gift/statistics/${roomId}/${date}/${giftType}`,
    method: 'get'
  })
