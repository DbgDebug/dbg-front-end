import request from '@/utils/request-service'

export const getH264RawData = () =>
  request({
    url: '/jmeter',
    method: 'get'
  })