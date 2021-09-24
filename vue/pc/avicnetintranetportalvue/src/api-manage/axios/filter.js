/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-18 11:26:44
 * @LastEditors: zongmz
 * @LastEditTime: 2021-08-10 13:50:43
 */
// import ElementUI from '@avic/golden-pc-ui'
export default {
  response: [
    function (response) {
      if (!response) {
        return Promise.reject(response)
      }
      // return response.data;
      if (response.status !== 200) {
        return Promise.reject(response)
      } else {
        if (response.data.code && response.data.code !== 200) {
          // ElementUI.Message({
          //   type: 'error',
          //   message: response.data.msg || ''
          // })
          return Promise.reject(response)
        }
        return response.headers['content-type'] === 'application/octet-stream;charset=UTF-8' ? response : response.data
      }
    }
  ]
}
