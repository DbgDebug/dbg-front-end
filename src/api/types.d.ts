export interface IArticleData {
  id: number
  status: string
  title: string
  abstractContent: string
  fullContent: string
  sourceURL: string
  imageURL: string
  timestamp: string | number
  platforms: string[]
  disableComment: boolean
  importance: number
  author: string
  reviewer: string
  type: string
  pageviews: number
}

export interface IRoleData {
  key: string
  name: string
  description: string
  routes: any
}

export interface ITransactionData {
  orderId: string
  timestamp: string | number
  username: string
  price: number
  status: string
}

export interface IUserData {
  id: number
  username: string
  password: string
  name: string
  email: string
  phone: string
  avatar: string
  introduction: string
  roles: string[]
}

export interface FileProperty {
  fileName: string
  path: string
  updateTime: number
  type: number
}

export interface LiveRoom {
  id: number
  up: string
  roomid: string | number
  createTime: string | number
  updateTime: string | number
  status: number
}

export interface Danmu {
  id: number
  roomid: string | number
  uid: number
  nickname: string
  sendTime: string | number
  danmu: number
}

export interface Up {
  roomid: number
  up: string
}

export interface GiftStatistics {
  id: number,
  roomId: number,
  giftName: string,
  num: number,
  price: number,
  date: number | string
}

export interface Service {
  id: number,
  serviceName: string,
  displayName: string,
  createTime: number | string,
  updateTime: number | string,
  status: number
}

export interface Permission {
  id: number,
  serviceId: number,
  serviceName: string,
  displayName: string,
  permissionId: string,
  permissionName: string,
  path: string,
  createTime: number | string,
  updateTime: number | string,
  status: number,
  isUpdate: number
}

export interface PermissionTree {
  id: number,
  name: string,
  disabled: boolean,
  children: PermissionTree[]
}

export interface Role {
  id: number,
  creatorId: number,
  roleLevel: number,
  roleName: string,
  createTime: number | string,
  updateTime: number | string,
  status: number,
  permissionSet: number[]
}

export interface Account {
  id: number,
  username: string,
  password: string,
  realName: string,
  email: string,
  sex: number,
  status: number,
  roleIds: number[],
  permissionSet: number[],
  lastTime: number
}

export interface ArticleTag {
  id: number,
  articleId: number,
  tag: string
}

export interface Article {
  id: number,
  author: string,
  title: string,
  content: string,
  markdown: string,
  createTime: number | string,
  updateTime: number | string,
  status: number
}

export interface ArticleCategory {
  id: number,
  categoryId: string,
  categoryName: string,
  createTime: number | string,
  updateTime: number | string,
  status: number
}

export interface ArticleDetail {
  id: number,
  author: string,
  categories: ArticleCategory[],
  title: string,
  content: string,
  markdown: string,
  createTime: number | string,
  updateTime: number | string,
  status: number,
  tags: ArticleTag[]
}

export interface Product {
  productId: number,
  productName: string,
  price: number,
  quantity: number
}

export interface Order {
  orderId: number,
  totalAmount: number,
  createTime: number,
  paymentTime: number,
  deliveryTime: number,
  expressTime: number,
  finishTime: number,
  splitTime: number,
  splitReason: string,
  productList: Product[]
}

export interface ProductForm {
  productId: number,
  quantity: number
}

export interface OrderForm {
  productList: ProductForm[]
}

export interface PayQRCode {
  outTradeNo: string,
  subject: string,
  totalAmount: string,
  qrCodeUrl: string,
  createTime: number
}
