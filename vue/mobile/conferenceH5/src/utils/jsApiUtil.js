/*
 * @Author: caofeng
 * @Date: 2021-07-06 15:43:16
 * @LastEditTime: 2021-08-12 21:16:38
 * @LastEditors: zhaohx
 * @Description: In User Settings Edit
 * @FilePath: \conferenceH5\src\utils\jsApiUtil.js
 */

// todo 后续考虑与mixins合二为一，都合在mixins里
// 这样方便将所有使用jsapi的地方都统一在一个地方，修改方便
import { Toast } from 'vant'

// function log(message, data) {
//   var el = document.createElement('div')
//   el.style.marginTop = '20px'
//   el.style.fontSize = '15px'
//   el.style.wordBreak = 'break-word'
//   el.innerHTML = message + '<br/>' + (data ? JSON.stringify(data) : '')
//   document.bodyappendChild(el)
// }
const jsapi = new JsApi()
// d11d727a3455427
// 8012104293027840
const authParams = {
  appId: 'd11d727a3455427', // app的唯一标识
  currTime: '1578661525', // 生成签名的时间戳
  once: 'NHzaCD/Y7f8uEdp5DdgYGrCqVqfojJSF9QO/G4dwy7OzYtEHr/8/BtR9E6f0K/OlXuo1UNSHRIMlysciGEYsIKmGQ4pVn5kzJfEG7RxF9HUikbMEsKs5bSe0k0TBT1DqToOYBV10wjh9N/L+HG60YPn/Keg/S0Y1Y6dGpcV+L0k=', // 生成签名的随机串
  sign: 'd2c054fa66bc78c84fc08b62f6f645ffeb2a25e0902afd95177873ad5774ee33' // 签名
}

// let authParams = ''
// // 鉴权
// function getAuth () {
//   return new Promise((resolve, reject) => {
//   api.getJsapiAuth().then(res => {
//     if (res.success) {
//       authParams = res.data
//       jsapi.auth({
//         ...res.data,
//         success: function (d) {
//           // resolve(res.data)
//         },
//         fail: function (e) {
//           // resolve(res.data)
//           // reject(e)
//         }
//       })
//     } else {
//       // reject(res)
//     }
//   }).catch(e => {
//     // Toast('系统开小差～请稍后再试！')
//   })
//   // })
// }

// getAuth()

// 设置app的title(主要是安卓用，ios会直接取document.title)
export function setPageTitle(title) {
  try {
    jsapi.setPageTitle({
      title
    })
  } catch (e) {
    console.log(`setPageTitle出错：${e}`)
  }
  document.title = title
}

// 调用扫码接口
export function scanCode() {
  return new Promise((resolve, reject) => {
    jsapi.scanQRCode({
      appId: authParams.appId,
      success: function(res) {
        resolve(res)
      },
      fail: function(e) {
        console.log(e)
        // Toast(`扫码失败[${e.code}]，请联系客服或点击重试`)
        reject(e)
      }
    })
  })
}

// 调用保存图片接口
export function savePictureForLocate(url) {
  return new Promise((resolve, reject) => {
    jsapi.savePictureForLocate({
      appId: authParams.appId,
      PictureUrl: url, // 需要传输的图片的url地址
      PictureType: 'png', // 需要传输的图片的类型 'png'
      success: function(res) {
        resolve(res)
      },
      fail: function(e) {
        reject(e)
      }
    })
  })
}
