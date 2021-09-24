<!--
 * @Descripttion:
 * @Author: wanghz
 * @Date: 2021-08-13 15:51:35
 * @LastEditors: peng
 * @LastEditTime: 2021-09-09 21:30:29
-->
<template>
  <div></div>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {}
  },
  beforeRouteLeave(to, from, next) {
    // console.log(to, from)
    next()
  },
  async created() {
    // 判断当前是否在App中
    const jsapi = new JsApi()
    const token = getToken()
    /**
     * 跳转到此页面的场景：
     * 1.扫码会议二维码报名
     * 2.扫码签到码
     */
    const url = window.location.href
    const arr = url.split('&')
    let result = ''
    let flag = ''
    let conferenceAgendaId = ''
    arr.forEach(ele => {
      if (ele.includes('conferenceId')) {
        result = ele.split('=')[1]
      } else if (ele.includes('conferenceAgendaId')) {
        conferenceAgendaId = ele.split('=')[1]
      } else if (ele.includes('flag')) {
        flag = ele.split('=')[1]
      }
    })
    if (!jsapi.checkEnvironment()) {
      // 非商网
      // 1.报名 --- 跳转会议详情
      if (url.includes('flag=conferenceContacter')) {
        // const arr = url.split('&')
        // let result = ''
        // arr.forEach(ele => {
        //   if (ele.includes('conferenceId')) {
        //     result = ele.split('=')[1]
        //   }
        // })
        this.$router.replace({
          name: 'conferenceDetail',
          query: {
            [this.$enc('conferenceId')]: this.$enc(result),
            [this.$enc('isWeb')]: this.$enc(true)
          }
        })
        // setTimeout(() => {
        //   this.$router.replace({
        //     name: 'conferenceDetail',
        //     query: {
        //       [this.$enc('conferenceId')]: this.$enc(result),
        //       [this.$enc('isWeb')]: this.$enc(true)
        //     }
        //   })
        // })
      } else if (url.includes('flag=conferenceSign') || url.includes('flag=agendaSign')) {
        // 2.会议签到+议程签到 --- 无token则跳外网登录页，有则正常跳转
        if (token) {
          // const arr = url.split('&')
          // let result = ''
          // let flag = ''
          // let conferenceAgendaId = ''
          // arr.forEach(ele => {
          //   if (ele.includes('conferenceId')) {
          //     result = ele.split('=')[1]
          //   }
          //   if (ele.includes('conferenceAgendaId')) {
          //     conferenceAgendaId = ele.split('=')[1]
          //   }
          //   if (ele.includes('flag')) {
          //     flag = ele.split('=')[1]
          //   }
          // })
          this.$router.replace({
            name: 'conferenceSign',
            query: {
              [this.$enc('conferenceId')]: this.$enc(result),
              [this.$enc('flag')]: this.$enc(flag),
              [this.$enc('conferenceAgendaId')]: this.$enc(conferenceAgendaId)
            }
          })
          // arr.forEach(ele => {
          //   if (ele.includes('conferenceId')) {
          //     result = ele.split('=')[1]
          //   }
          // })
          // arr.forEach(ele => {
          //   if (ele.includes('flag')) {
          //     flag = ele.split('=')[1]
          //   }
          // })
          // arr.forEach(ele => {
          //   if (ele.includes('conferenceAgendaId')) {
          //     conferenceAgendaId = ele.split('=')[1]
          //   }
          // })
          // setTimeout(() => {
          //   this.$router.replace({
          //     name: 'conferenceSign',
          //     query: {
          //       [this.$enc('conferenceId')]: this.$enc(result),
          //       [this.$enc('flag')]: this.$enc(flag),
          //       [this.$enc('conferenceAgendaId')]: this.$enc(conferenceAgendaId)
          //     }
          //   })
          // })
        } else {
          // const arr = url.split('&')
          // let result = ''
          // arr.forEach(ele => {
          //   if (ele.includes('conferenceId')) {
          //     result = ele.split('=')[1]
          //   }
          // })
          this.$router.replace({
            name: 'webLogin',
            query: {
              [this.$enc('conferenceId')]: this.$enc(result)
            }
          })
          // setTimeout(() => {
          //   this.$router.replace({
          //     name: 'webLogin',
          //     query: {
          //       [this.$enc('conferenceId')]: this.$enc(result)
          //     }
          //   })
          // })
        }
      }
    } else {
      // 商网
      // 将所有链接转化为不带public的內部链接
      if (url.includes('public')) {
        const VUE_APP_DOMAIN = process.env.VUE_APP_DOMAIN
        const index = url.indexOf('/#/')
        const newUrl = VUE_APP_DOMAIN + url.slice(index, url.length)
        window.location.replace(newUrl)
      } else {
        // 报名-有未取消的报名信息跳首页，没有则跳会议详情
        if (url.includes('flag=conferenceContacter')) {
          // const arr = url.split('&')
          // let result = ''
          // arr.forEach(ele => {
          //   if (ele.includes('conferenceId')) {
          //     result = ele.split('=')[1]
          //   }
          // })
          const data = await this.getAttendeeInfo(result)

          if (data !== null) {
            if (Number(data.signStatus) === 2 || Number(data.signStatus) === 3 || Number(data.signStatus) === 3) {
              // 有未取消的报名信息跳首页
              this.$router.replace({
                name: 'conferenceHomePage',
                query: {
                  [this.$enc('conferenceId')]: this.$enc(result)
                }
              })
              // setTimeout(() => {
              //   this.$router.replace({
              //     name: 'conferenceHomePage',
              //     query: {
              //       [this.$enc('conferenceId')]: this.$enc(result)
              //     }
              //   })
              // })
            } else {
              // 跳商网详情
              this.$router.replace({
                name: 'conferenceDetail',
                query: {
                  [this.$enc('conferenceId')]: this.$enc(result)
                }
              })
              // setTimeout(() => {
              //   this.$router.replace({
              //     name: 'conferenceDetail',
              //     query: {
              //       [this.$enc('conferenceId')]: this.$enc(result)
              //     }
              //   })
              // })
            }
          } else {
            // 跳商网详情
            this.$router.replace({
              name: 'conferenceDetail',
              query: {
                [this.$enc('conferenceId')]: this.$enc(result)
              }
            })
            // setTimeout(() => {
            //   this.$router.replace({
            //     name: 'conferenceDetail',
            //     query: {
            //       [this.$enc('conferenceId')]: this.$enc(result)
            //     }
            //   })
            // })
          }
        } else if (url.includes('flag=conferenceSign') || url.includes('flag=agendaSign')) {
          // 会议签到+议程签到
          // const arr = url.split('&')
          // let result = ''
          // let flag = ''
          // let conferenceAgendaId = ''
          // arr.forEach(ele => {
          //   if (ele.includes('conferenceId')) {
          //     result = ele.split('=')[1]
          //   }
          //   if (ele.includes('conferenceAgendaId')) {
          //     conferenceAgendaId = ele.split('=')[1]
          //   }
          //   if (ele.includes('flag')) {
          //     flag = ele.split('=')[1]
          //   }
          // })
          // arr.forEach(ele => {
          //   if (ele.includes('flag')) {
          //     flag = ele.split('=')[1]
          //   }
          // })
          // arr.forEach(ele => {
          //   if (ele.includes('conferenceAgendaId')) {
          //     conferenceAgendaId = ele.split('=')[1]
          //   }
          // })
          // setTimeout(() => {
          //   this.$router.replace({
          //     name: 'conferenceSign',
          //     query: {
          //       [this.$enc('conferenceId')]: this.$enc(result),
          //       [this.$enc('flag')]: this.$enc(flag),
          //       [this.$enc('conferenceAgendaId')]: this.$enc(conferenceAgendaId)
          //     }
          //   })
          // })
          this.$router.replace({
            name: 'conferenceSign',
            query: {
              [this.$enc('conferenceId')]: this.$enc(result),
              [this.$enc('flag')]: this.$enc(flag),
              [this.$enc('conferenceAgendaId')]: this.$enc(conferenceAgendaId)
            }
          })
        }
      }
    }
  },
  methods: {
    // 通过会议id查看当前登录用户的参会人详情
    getAttendeeInfo(conferenceId) {
      return new Promise(resolve => {
        this.$api({
          url: 'attendeeApi.getAttendeeFromMeetingId',
          data: {
            conferenceId
          }
        }).then(res => {
          if (res.code === 2000) {
            /**
             * signStatus=0 草稿
             * signStatus=1 待审核
             * signStatus=2 审核不通过
             * signStatus=3 审核通过
             * signStatus=-1 取消参会
             * signStatus=-2 失效
             * signStatus= -3 报名驳回
             */
            const data = res.result
            resolve(data)
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
