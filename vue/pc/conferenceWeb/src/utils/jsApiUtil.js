// todo 后续考虑与mixins合二为一，都合在mixins里
// 这样方便将所有使用jsapi的地方都统一在一个地方，修改方便


const jsapi = new JsApi()
// d11d727a3455427
// 8012104293027840
const authParams = {
  appId: 'd11d727a3455427', // app的唯一标识
  currTime: '1578661525', // 生成签名的时间戳
  once: 'NHzaCD/Y7f8uEdp5DdgYGrCqVqfojJSF9QO/G4dwy7OzYtEHr/8/BtR9E6f0K/OlXuo1UNSHRIMlysciGEYsIKmGQ4pVn5kzJfEG7RxF9HUikbMEsKs5bSe0k0TBT1DqToOYBV10wjh9N/L+HG60YPn/Keg/S0Y1Y6dGpcV+L0k=', // 生成签名的随机串
  sign: 'd2c054fa66bc78c84fc08b62f6f645ffeb2a25e0902afd95177873ad5774ee33' // 签名
}



// 鉴权
function getAuth () {
  return new Promise((resolve, reject) => {
    api.getJsapiAuth().then(res => {
      // alert(`授权参数：${JSON.stringify(res)}`)
      if (res.success) {
        jsapi.auth({
          ...res.data,
          success: function (d) {
            // alert(`jsapi.auth成功:${d}`)
            resolve(res.data)
          },
          fail: function (e) {
            // alert(`jsapi.auth失败:${e}`)
            reject(e)
          }
        })
      } else {
        // log('调用api.getJsapiAuth失败', res.message)
        // alert('未进授权回调')
        reject(res)
      }
    })
  })
}
// 调起通讯录接口
export function toAddressBook (members, maxNum = 50) {
  return new Promise((resolve, reject) => {
    // getAuth().then(d => {
      jsapi.addressBook({
        appId: 'd11d727a3455427', // 必填，第三方的唯一标识
        type: 2, // 1 单选；2 多选，默认为1
        members,
        maxNum,
        authLevel: 1,
        success: function (res) {
          alert(res.code)
          // resolve(res)
        },
        fail: function(e) {
        alert(e.code)
        console.log(e,'---e---')
        // reject(e)
      }
      })
    // })
  })
}
// getAuth()
// createAddressWindow({
      // allType:true,
      // currentUserSecret:'d5m488481u4ztqf8',
      // customTag:'1630311126792',
      // maxNum:50,
      // type: 1,
      // source:2,
      // titleName: '联系人',
//       success: function(res) {
//         console.log('res',JSON.parse(JSON.stringify(res)))
//         resolve(res)
//       },
//       fail: function(e) {
//         alert(e)
//         reject(e)
//       }
//     })
//addressBook
export function createAddressWindow() {
  return new Promise((resolve, reject) => {
    jsapi.addressBook({
      appId: '2b613b38555846b',
      // maxNum:50,
      // type: 1,
      // source:2,
      // members:'',
      // toast: '提示语',
      // status:1,

      // manager:"",
      // allType:true,
      // currentUserSecret:'d5m488481u4ztqf8',
      // customTag:'1630311126792',
      // maxNum:50,
      type: 1,
      // source:2,
      // titleName: '联系人',
      success: function(res) {
        alert('res')
        alert(res.code)
        // console.log('res',JSON.parse(JSON.stringify(res)))
        resolve(res)
      },
      fail: function(e) {
        alert(e.code)
        reject(e)
      }
    })
  })
}
// 设置app的title(主要是安卓用，ios会直接取document.title)
// export function setPageTitle(title) {
//   try {
//     jsapi.setPageTitle({
//       title
//     })
//   } catch (e) {
//     console.log(`setPageTitle出错：${e}`)
//   }
//   document.title = title
// }

// 调用扫码接口
// export function scanCode() {
//   return new Promise((resolve, reject) => {
//     jsapi.scanQRCode({
//       appId: authParams.appId,
//       success: function(res) {
//         resolve(res)
//       },
//       fail: function(e) {
//         console.log(e)
//         // Toast(`扫码失败[${e.code}]，请联系客服或点击重试`)
//         reject(e)
//       }
//     })
//   })
// }

// 调用保存图片接口
// export function savePictureForLocate(url) {
//   return new Promise((resolve, reject) => {
//     jsapi.savePictureForLocate({
//       appId: authParams.appId,
//       PictureUrl: url, // 需要传输的图片的url地址
//       PictureType: 'png', // 需要传输的图片的类型 'png'
//       success: function(res) {
//         resolve(res)
//       },
//       fail: function(e) {
//         reject(e)
//       }
//     })
//   })
// }
