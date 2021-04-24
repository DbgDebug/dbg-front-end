import request from '@/utils/request-json'
import { Product, Order, OrderForm, ProductForm, PayQRCode } from '@/api/types'

export const defaultProduct: Product = {
  productId: 0,
  productName: '',
  price: 0,
  quantity: 0
}

export const defaultOrder: Order = {
  orderId: 0,
  totalAmount: 0,
  createTime: 0,
  paymentTime: 0,
  deliveryTime: 0,
  expressTime: 0,
  finishTime: 0,
  splitTime: 0,
  splitReason: '',
  productList: []
}

export const defaultPayQRCode: PayQRCode = {
  outTradeNo: '',
  subject: '',
  totalAmount: '',
  qrCodeUrl: '',
  createTime: 0,
}

export const defaultOrderForm: OrderForm = {
  productList: []
}

export const defaultProductForm: ProductForm = {
  productId: 0,
  quantity: 0
}

export const getProductList = () =>
  request({
    url: '/pay/product/list',
    method: 'get'
  })

export const createOrder = (data: any) =>
  request({
    url: '/pay/order/create',
    method: 'post',
    data
  })

export const payQRCode = (params: any) =>
  request({
    url: '/pay/payment/pay_qrcode',
    method: 'post',
    params
  })

export const payTest = (params: any) =>
  request({
    url: '/pay/test/a',
    method: 'get',
    params
  })
