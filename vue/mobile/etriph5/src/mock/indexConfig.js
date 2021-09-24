/*
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-03-25 11:43:09
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-06-16 14:04:45
 */
// 展示服务字段按照排列顺序
const partsArr = ['机票酒店-携程', '机票酒店-中航服', '空港嘉华', '阳光之旅', '华宇航服', '服务热线', '协议酒店', '携程-酒店']
// 后端返回字段和展示字段对应名称表
const partsMap = new Map([
  ['机票酒店-携程', '携程'],
  ['机票酒店-中航服', '中航服'],
  ['空港嘉华', '空港嘉华'],
  ['阳光之旅', '阳光之旅'],
  ['华宇航服', '华宇航服'],
  ['服务热线', '服务专线'],
  ['协议酒店', '协议酒店'],
  ['携程-酒店', '携程酒店']
])
// 展示分类表
const partsGroupMap = new Map([
  ['携程', '机票'],
  ['中航服', '机票'],
  ['空港嘉华', '机票'],
  ['阳光之旅', '机票'],
  ['华宇航服', '机票'],
  ['服务专线', '机票'],
  ['协议酒店', '酒店'],
  ['携程酒店', '酒店']
])
// 前端展示内容配置表
const listMap = new Map([
  ['携程', { src: require('./../image/home/xc_logo.jpg'), src0: require('./../image/home/xc_logo_gray.png'), name: '携程', link: '/ctrip' }],
  // ['中航服', { src: require('./../image/home/hz_logo.jpg'), src0: require('./../image/home/hz_logo_gray.png'), name: '中航服' }],
  ['中航服', { src: require('./../image/home/zhf_logo.png'), src0: require('./../image/home/zhf_logo_gray.png'), name: '中航服', link: '/hxCtrip/zhx' }],
  ['空港嘉华', { src: require('./../image/home/kgjh_logo.png'), src0: require('./../image/home/kgjh_logo_gray.png'), name: '空港嘉华', link: '/hxCtrip/kgjh' }],
  ['阳光之旅', { src: require('./../image/home/ygzl_logo.png'), src0: require('./../image/home/ygzl_logo_gray.jpg'), name: '阳光之旅', link: '/hxCtrip/ygzl' }],
  ['华宇航服', { src: require('./../image/home/hyhf_logo.jpg'), src0: require('./../image/home/hyhf_logo_gray.jpg'), name: '华宇航服', link: '/hxCtrip/hyhf' }],
  ['服务专线', { src: require('./../image/home/fwzx_logo.png'), name: '服务专线', link: '/service' }],
  ['协议酒店', { name: '协议酒店' }],
  ['携程酒店', { link: '/ctrip?type=hotel', name: '携程酒店' }]
])

export default {
  partsArr,
  partsMap,
  partsGroupMap,
  listMap
}
