import request from '@/utils/request-json'
import { ArticleTag, ArticleCategory, Article, ArticleDetail } from './types'

export const defaultArticleTag: ArticleTag = {
  id: 0,
  articleId: 0,
  tag: ''
}

export const defaultArticle: Article = {
  id: 0,
  author: '',
  title: '',
  content: '',
  markdown: '',
  createTime: 0,
  updateTime: 0,
  status: 1
}

export const defaultArticleDetail: ArticleDetail = {
  id: 0,
  categories: [],
  author: '',
  title: '',
  content: '',
  markdown: '',
  createTime: 0,
  updateTime: 0,
  status: 1,
  tags: []
}

export const defaultArticleCategory: ArticleCategory = {
  id: 0,
  categoryId: '',
  categoryName: '',
  createTime: 0,
  updateTime: 0,
  status: 0
}

export const getArticleList = (params: any) =>
  request({
    url: '/blog/article/list',
    method: 'get',
    params
  })

export const getArticle = (id: number) =>
  request({
    url: `/blog/article/${id}`,
    method: 'get'
  })

export const createArticle = (data: any) =>
  request({
    url: '/blog/article',
    method: 'post',
    data
  })

export const updateArticle = (id: number, data: any) =>
  request({
    url: `/blog/article/${id}`,
    method: 'put',
    data
  })

export const deleteArticle = (id: number) =>
  request({
    url: `/blog/article/${id}`,
    method: 'delete'
  })

export const getArticleByTag = (tag: string, params: any) =>
  request({
    url: `/blog/article/${tag}`,
    method: 'get',
    params
  })

export const getCategoryList = (params: any) =>
  request({
    url: '/blog/category/list',
    method: 'get',
    params
  })

export const createCategory = (data: ArticleCategory) =>
  request({
    url: '/blog/category',
    method: 'post',
    data
  })

export const updateCategory = (id: number, data: any) =>
  request({
    url: `/blog/category/${id}`,
    method: 'put',
    data
  })

export const deleteCategory = (id: number) =>
  request({
    url: `/blog/category/${id}`,
    method: 'delete'
  })

export const createArticleTag = (data: any) =>
  request({
    url: '/blog/article/tag',
    method: 'post',
    data
  })

export const updateArticleTag = (id: number, data: any) =>
  request({
    url: `/blog/article/tag/${id}`,
    method: 'put',
    data
  })

export const deleteArticleTag = (id: number) =>
  request({
    url: `/blog/article/tag/${id}`,
    method: 'delete'
  })
