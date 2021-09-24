/*
 * @Author: your name
 * @Date: 2021-03-18 15:37:12
 * @LastEditTime: 2021-04-08 10:58:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \avicnetintranetportalvue\src\utils\common.js
 */
export function fileType (name) {
  const arr = name.split('.')
  const _target = arr[arr.length - 1]
  if (!_target) return
  const type = 'unknown'
  const fileTypes = {
    'PDF': ['pdf'],
    'Word': ['doc', 'docx'],
    'excel': ['xls', 'xlsx'],
    'Zip': ['zip', 'rar', '7z'],
    'txt': ['txt'],
    'ppt': ['ppt'],
    'voice': ['mp3'],
    'video': ['avi', 'MPEG', 'mov', 'mwv'],
    'picture': ['png', 'jpg', 'jpeg', 'svg', 'illustrator', 'gif'],
    'unknown': ['*'],
    'wangye': ['html']
  }
  // Object.values(fileTypes).map(item => {
  //   type = item.find(d => d === name)
  // })
  // return type || 'unknown'
  for (const key in fileTypes) {
    const item = fileTypes[key]
    if (item.includes(_target)) {
      return key
    }
  }
  return type
}

// 获取文件大小
export function fileSize (initSize, initType = 'B') {
  function changeSize (initSize, i) {
    if (initSize / 1024 >= 1) {
      i++
      return changeSize(initSize / 1024, i)
    } else {
      const size = initSize % 1 > 0 ? initSize.toFixed(2) : initSize
      return {
        index: i,
        size: size
      }
    }
  }

  const typeList = ['B', 'KB', 'MB', 'GB']
  for (let i = typeList.length - 1; i >= 0; i--) {
    if (typeList[i] === initType) {
      const _t = changeSize(initSize, i)
      return _t.size + typeList[_t.index]
    }
  }
}

/**
 * 文件流保存到本地
 * 方案一：get请求直接window.location.href
 * 方案二：post请求，可以使用xhr或axios，然后resolveBlob处理流文件下载
 * 方案三：如果下载是另存为，则创建一个隐形的表单来提交，设置form的target为_blank来弹出下载对话框
 * @param {*} res: response.data
 * @param {*} type: xlsx or zip
 */
export function resolveBlob (res, type) {
  const mimeMap = {
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    zip: 'application/zip'
  }
  const aLink = document.createElement('a')
  const blob = new Blob([res], { type: mimeMap[type] })
  // //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
  const patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
  const contentDisposition = decodeURI(res.headers['content-disposition'])
  const result = patt.exec(contentDisposition)
  let fileName = result[1]
  fileName = fileName.replace(/\"/g, '')
  aLink.href = URL.createObjectURL(blob)
  aLink.setAttribute('download', fileName) // 设置下载文件名称
  document.body.appendChild(aLink)
  aLink.click()
  document.body.removeChild(aLink)
}
