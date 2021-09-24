/**
 * 此处可直接引用自己项目封装好的 axios 配合后端联调
 */

import { axios } from '@/api/request'

// 获取验证图片  以及token
export function reqGet(data) {
  return axios({
    url: '/api/captcha/captcha/getCaptcha',
    method: 'post',
    data
  })
}

// 滑动或者点选验证
export function reqCheck(data) {
  return axios({
    url: '/api/captcha/captcha/checkCaptcha',
    method: 'post',
    data
  })
}
