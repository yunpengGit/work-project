<!--
 * @Descripttion:
 * @Author: wanghz
 * @Date: 2021-08-13 15:51:35
 * @LastEditors: wanghz
 * @LastEditTime: 2021-08-13 15:51:35
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
    console.log(to, from)
    next()
  },
  async created() {
    // 判断当前是否在App中
    const jsapi = new JsApi()
    const token = getToken()
    /**
     * 跳转到此页面的场景：
     * 1.参会人IM + 司机IM 报名
     * 2.会议邀请链接
     * 3.会议邀请代办连接
     * 4.参会人OA议程
     */
    const url = window.location.href

    if (!jsapi.checkEnvironment()) {
      // 非商网
      // 无token则跳外网登录页，有则正常跳转
      if (token) {
        // 1.参会人IM报名-有未取消的报名信息跳首页，没有则跳会议详情
        if (url.includes('flag=conference') && !url.includes('flag=conferenceInviteUser')) {
          console.log('走这么')

          const arr = url.split('&')
          let result = ''
          arr.forEach(ele => {
            if (ele.includes('conferenceId')) {
              result = ele.split('=')[1]
            }
          })
          const data = await this.getAttendeeInfo(result)
          if (data !== null) {
            if (Number(data.signStatus) === 2 || Number(data.signStatus) === 3 || Number(data.signStatus) === 3) {
              // 有未取消的报名信息跳首页
              setTimeout(() => {
                this.$router.replace({
                  name: 'conferenceHomePage',
                  query: {
                    [this.$enc('conferenceId')]: this.$enc(result)
                  }
                })
              })
            } else {
              // 跳非商网详情
              setTimeout(() => {
                this.$router.replace({
                  name: 'conferenceDetail',
                  query: {
                    [this.$enc('conferenceId')]: this.$enc(result),
                    [this.$enc('isWeb')]: this.$enc(true)
                  }
                })
              })
            }
          } else {
            // 跳非商网详情
            setTimeout(() => {
              this.$router.replace({
                name: 'conferenceDetail',
                query: {
                  [this.$enc('conferenceId')]: this.$enc(result),
                  [this.$enc('isWeb')]: this.$enc(true)
                }
              })
            })
          }
        }

        // 2.会议邀请链接-跳转到邀请函
        if (url.includes('flag=conferenceInviteUser')) {
          const arr = url.split('&')
          let result = ''
          let conferenceInviteId = ''
          arr.forEach(ele => {
            if (ele.includes('conferenceId')) {
              result = ele.split('=')[1]
            }
            if (ele.includes('conferenceInviteId')) {
              conferenceInviteId = ele.split('=')[1]
            }
          })
          setTimeout(() => {
            this.$router.replace({
              name: 'invitation',
              query: {
                [this.$enc('conferenceId')]: this.$enc(result),
                [this.$enc('conferenceInviteId')]: this.$enc(conferenceInviteId)
              }
            })
          })
        }

        // 3.参会人OA议程
        if (url.includes('flag=conferenceAgenda')) {
          const arr = url.split('&')
          let result = ''
          let agendaId = ''
          arr.forEach(ele => {
            if (ele.includes('conferenceId')) {
              result = ele.split('=')[1]
            }
          })
          arr.forEach(ele => {
            if (ele.includes('agendaId')) {
              agendaId = ele.split('=')[1]
            }
          })
          setTimeout(() => {
            this.$router.replace({
              name: 'conferenceAgendaDetail',
              query: {
                [this.$enc('conferenceId')]: this.$enc(result),
                [this.$enc('agendaId')]: this.$enc(agendaId)
              }
            })
          })
        }

        // 1.参会人IM报名-参会人报名审核不通过跳转到会议首页
        if (url.includes('flag=conferenceAttendeeAuditNoPass')) {
          const arr = url.split('&')
          let result = ''
          arr.forEach(ele => {
            if (ele.includes('conferenceId')) {
              result = ele.split('=')[1]
            }
          })
          setTimeout(() => {
            this.$router.replace({
              name: 'conferenceHomePage',
              query: {
                [this.$enc('conferenceId')]: this.$enc(result)
              }
            })
          })
        }
      } else {
        const arr = url.split('&')
        let result = ''
        arr.forEach(ele => {
          if (ele.includes('conferenceId')) {
            result = ele.split('=')[1]
          }
        })
        setTimeout(() => {
          this.$router.replace({
            name: 'webLogin',
            query: {
              [this.$enc('conferenceId')]: this.$enc(result)
            }
          })
        })
      }
    } else {
      // 商网
      // 将所有链接转化为不带public的內部链接
      if (url.includes('public')) {
        const VUE_APP_DOMAIN = process.env.VUE_APP_DOMAIN
        const index = url.indexOf('/#/')
        const newUrl = VUE_APP_DOMAIN + url.slice(index, url.length)
        window.location.replace(newUrl)
        return
      } else {
        // 1.参会人IM报名-有未取消的报名信息跳首页，没有则跳会议详情
        //  && !url.includes('flag=conferenceInviteUser')
        if (url.includes('flag=conference')) {
          const arr = url.split('&')
          let result = ''
          arr.forEach(ele => {
            if (ele.includes('conferenceId')) {
              result = ele.split('=')[1]
            }
          })
          const data = await this.getAttendeeInfo(result)
          if (data !== null) {
            if (Number(data.signStatus) === 2 || Number(data.signStatus) === 3 || Number(data.signStatus) === 3) {
              // 有未取消的报名信息跳首页
              setTimeout(() => {
                this.$router.replace({
                  name: 'conferenceHomePage',
                  query: {
                    [this.$enc('conferenceId')]: this.$enc(result)
                  }
                })
              })
            } else {
              // 跳非商网详情
              setTimeout(() => {
                this.$router.replace({
                  name: 'conferenceDetail',
                  query: {
                    [this.$enc('conferenceId')]: this.$enc(result)
                  }
                })
              })
            }
          } else {
            // 跳非商网详情
            setTimeout(() => {
              this.$router.replace({
                name: 'conferenceDetail',
                query: {
                  [this.$enc('conferenceId')]: this.$enc(result)
                }
              })
            })
          }
        }

        // 2.会议邀请链接-跳转到邀请函
        //  && !url.includes('agentFlag=true')
        if (url.includes('flag=conferenceInviteUser')) {
          const arr = url.split('&')
          let result = ''
          let conferenceInviteId = ''
          arr.forEach(ele => {
            if (ele.includes('conferenceId')) {
              result = ele.split('=')[1]
            }
            if (ele.includes('conferenceInviteId')) {
              conferenceInviteId = ele.split('=')[1]
            }
          })

          setTimeout(() => {
            this.$router.replace({
              name: 'invitation',
              query: {
                [this.$enc('conferenceId')]: this.$enc(result),
                [this.$enc('conferenceInviteId')]: this.$enc(conferenceInviteId)
              }
            })
          })
        }

        // 3.参会人OA议程
        if (url.includes('flag=conferenceAgenda')) {
          const arr = url.split('&')
          let result = ''
          let agendaId = ''
          arr.forEach(ele => {
            if (ele.includes('conferenceId')) {
              result = ele.split('=')[1]
            }
          })
          arr.forEach(ele => {
            if (ele.includes('agendaId')) {
              agendaId = ele.split('=')[1]
            }
          })
          setTimeout(() => {
            this.$router.replace({
              name: 'conferenceAgendaDetail',
              query: {
                [this.$enc('conferenceId')]: this.$enc(result),
                [this.$enc('agendaId')]: this.$enc(agendaId)
              }
            })
          })
        }

        // 1.参会人IM报名-参会人报名审核不通过跳转到会议首页
        if (url.includes('flag=conferenceAttendeeAuditNoPass')) {
          const arr = url.split('&')
          let result = ''
          arr.forEach(ele => {
            if (ele.includes('conferenceId')) {
              result = ele.split('=')[1]
            }
          })
          setTimeout(() => {
            this.$router.replace({
              name: 'conferenceHomePage',
              query: {
                [this.$enc('conferenceId')]: this.$enc(result)
              }
            })
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
    },

    // 获取用户id
    getUserInfo() {
      return new Promise(resolve => {
        this.$api({
          url: 'attendeeApi.userInfo'
        }).then(res => {
          if (res.code === 2000) {
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
