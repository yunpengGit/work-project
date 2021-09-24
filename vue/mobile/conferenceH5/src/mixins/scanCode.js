/*
 * @Author: caofeng
 * @Date: 2021-07-06 16:04:19
 * @LastEditTime: 2021-08-24 18:14:24
 * @LastEditors: zhaohx
 * @Description: In User Settings Edit
 * @FilePath: \conferenceH5\src\mixins\scanCode.js
 */
import { scanCode, savePictureForLocate } from '@/utils/jsApiUtil'

const ScanCodeMixin = {
  methods: {
    handelScanCode() {
      scanCode().then(res => {
        const url = res.content.qrcode
        const urlOnLine = process.env.VUE_APP_BASE_ADDRESS
        if (url.includes('https://dwz.cn/')) {
          this.$api({
            url: 'dic.getLink',
            data: {
              shortUrl: url
            }
          }).then(res => {
            const url = res.result
            if (url) {
              if (!url.includes(urlOnLine) && !url.includes('sign=signIn')) {
                this.$toast('请扫描参会人【个人名片】')
                return
              }
              location.href = url
            } else {
              location.href = res.content.qrcode
            }
          })
        } else {
          location.href = res.content.qrcode
        }
      })
    },
    handleSavePic(url) {
      savePictureForLocate(url).then(res => {
        // alert('成功')
        // alert(res)
      }).catch(err => {
        // alert('失败')
        // alert(err)
      })
    },
    // 参会人-会议大厅扫码
    handleScan() {
      scanCode().then(res => {
        location.href = res.content.qrcode
      })
    },
    // 参会人-会议首页扫码签到
    handleSignCode(conferenceId) {
      scanCode().then(res => {
        // const url = res.content.qrcode
        // const urlOnLine = process.env.VUE_APP_BASE_ADDRESS
        // console.log(url, 'url---')
        // console.log(conferenceId, 'conferenceId---')
        // alert(url)
        // alert(urlOnLine)
        // alert(!(url.includes(urlOnLine)))
        // alert(!url.includes('flag=agendaSign'))
        // alert(!url.includes('flag=conferenceSign'))
        // if (!(url.includes(urlOnLine)) && !(url.includes('flag=conferenceSign')) && !(url.includes('flag=agendaSign'))) {
        //   this.$toast('请扫描本场会议签到码或报道码！')
        //   return
        // }
        location.href = res.content.qrcode
      })
    }

  }
}

export default ScanCodeMixin
