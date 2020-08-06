import request from '@/utils/request-service'
import { FileProperty } from './types'

export const defaultFileProperty: FileProperty = {
  fileName: '',
  path: '',
  type: 0,
  updateTime: 0
}

export const getFileDir = (params: any) =>
  request({
    url: '/get_file_dir',
    method: 'get',
    params
  })
