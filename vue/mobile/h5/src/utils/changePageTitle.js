/*
 * @Author: your name
 * @Date: 2020-10-19 17:01:56
 * @LastEditTime: 2020-10-23 14:31:28
 * @LastEditors: pengpeng
 * @Description: 修改页面title值
 * @FilePath: \h5\src\utils\changePageTitle.js
 */
export default function changePageTitle (text) {
  // console.log(text)
  document.querySelector('title').innerText = text
  // document.title = text
}
