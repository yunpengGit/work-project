/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-04-08 18:34:13
 * @LastEditors: zongmz
 * @LastEditTime: 2021-05-31 15:56:57
 */
// import JSZip from 'jszip'
export const download = {
  singleFile: function (res, saveName) {
    const data = res.data
    if (!data) {
      return
    }

    // if (typeof data === 'object' && data instanceof Blob) {
    //   data = window.URL.createObjectURL(data) // 创建blob地址
    // }
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(data, saveName)
    } else {
      var eleLink = document.createElement('a')
      eleLink.href = data
      eleLink.download = saveName || ''
      eleLink.style.display = 'none'
      document.body.appendChild(eleLink)
      eleLink.click()
      window.URL.revokeObjectURL(data)
    }
  },

  BatchFiles: function (res) {
    // 把blob格式文件转成FIle类型
    var blob = new Blob([res.data], { type: 'application/zip' })
    // 从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
    var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
    // console.log(res, blob, 22)
    var contentDisposition = decodeURI(res.headers['content-disposition'])
    var result = patt.exec(contentDisposition)
    var fileName = result[1]
    fileName = fileName.replace(/\"/g, '')
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, fileName)
    } else {
      const aLink = document.createElement('a')
      aLink.href = URL.createObjectURL(blob)
      aLink.setAttribute('download', fileName) // 设置下载文件名称
      document.body.appendChild(aLink)
      aLink.click()
    }
    // document.body.appendChild(aLink)

    // const files = new window.File([res], saveName, { type: 'application/zip' })
    // console.log(files, 222)
    // 读取zip压缩文件里面的文件内容
    // JSZip.loadAsync(files).then((zip) => {
    //   for (const key in zip.files) {
    //     // 用blob的格式读取，方便后面下载到本地
    //     // console.log(zip.files[key].name)
    //     // console.log(saveName)
    //     const base = zip.file(zip.files[key].name).async('blob')
    //     base.then(res => {
    //       this.singleFile(res, zip.files[key].name)
    //     })
    //   }
    // })
  }
}
