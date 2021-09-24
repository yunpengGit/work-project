/*
 * @Author: your name
 * @Date: 2020-10-19 10:37:18
 * @LastEditTime: 2020-10-23 16:51:47
 * @LastEditors: pengpeng
 * @Description: 数组对象根据某个属性值分组(copyKey[自定义的分组key], key[需要在分组上保留的愿key])
 * @FilePath: \h5\src\utils\arrayToGroup.js
 */
export default function arrayToGroup (arr, copyKey, key) {
  const result = []
  let obj = {
    list: []
  }
  arr.forEach(ele => {
    const copyValue = ele[copyKey]
    const value = ele[key]
    if (obj[copyKey] === copyValue) {
      obj.list.push(ele)
    } else {
      obj = {
        list: []
      }
      obj[copyKey] = copyValue
      obj[key] = value
      obj.list.push(ele)
      result.push(obj)
    }
  })
  return result
};
