<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-30 16:54:44
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-09-09 19:17:10
-->
<template>
  <div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  beforeRouteLeave(to, from, next) {
    console.log(to, from)
    next()
  },
  mounted() {
    const url = window.location.href
    if (url.includes('sign=conference')) {
      const arr = url.split('&')
      let result = ''
      arr.forEach(ele => {
        if (ele.includes('conferenceId')) {
          result = ele.split('=')[1]
        }
      })
      // this.routeParams.id = result
      setTimeout(() => {
        if (!sessionStorage.getItem('userBasicInfo')) {
          this.$api({
            url: 'user.userInfo'
          }).then(res => {
            const data = res.result
            const userBasicInfo = {
              name: data.ssoUserName,
              mobile: data.mobile ? data.mobile.slice(-4) : ''
            }
            sessionStorage.setItem('userBasicInfo', `${userBasicInfo.name}  ${userBasicInfo.mobile}`)
          }).finally(() => {
            this.$router.replace({
              name: 'conferenceDesk',
              query: {
                [this.$enc('id')]: this.$enc(result)
              }
            })
          })
        } else {
          this.$router.replace({
            name: 'conferenceDesk',
            query: {
              [this.$enc('id')]: this.$enc(result)
            }
          })
        }
      })
    }
    // 会议签到
    if (url.includes('sign=signIn')) {
      const arr = url.split('&')
      let conferenceId = ''
      let conferenceAttendeeId = ''
      arr.forEach(ele => {
        if (ele.includes('conferenceId')) {
          conferenceId = ele.split('=')[1]
        }
        if (ele.includes('conferenceAttendeeId')) {
          conferenceAttendeeId = ele.split('=')[1]
        }
      })
      setTimeout(() => {
        if (!sessionStorage.getItem('userBasicInfo')) {
          this.$api({
            url: 'user.userInfo'
          }).then(res => {
            const data = res.result
            const userBasicInfo = {
              name: data.ssoUserName,
              mobile: data.mobile ? data.mobile.slice(-4) : ''
            }
            sessionStorage.setItem('userBasicInfo', `${userBasicInfo.name}  ${userBasicInfo.mobile}`)
          }).finally(() => {
            this.$router.replace({
              name: 'jumpMiddle',
              query: {
                [this.$enc('id')]: this.$enc(conferenceId),
                [this.$enc('attendeeId')]: this.$enc(conferenceAttendeeId)
              }
            })
          })
        } else {
          this.$router.replace({
            name: 'jumpMiddle',
            query: {
              [this.$enc('id')]: this.$enc(conferenceId),
              [this.$enc('attendeeId')]: this.$enc(conferenceAttendeeId)
            }
          })
        }
      })
    }
    // 待办
    if (url.includes('sign=backlog')) {
      const arr = url.split('&')
      let conferenceId = ''
      let attendeeId = ''
      let taskType = ''
      let taskId = ''
      arr.forEach(ele => {
        if (ele.includes('conferenceId')) {
          conferenceId = ele.split('=')[1]
        }
        if (ele.includes('attendeeId')) {
          attendeeId = ele.split('=')[1]
        }
        if (ele.includes('taskType')) {
          taskType = ele.split('=')[1]
        }
        if (ele.includes('taskId')) {
          taskId = ele.split('=')[1]
        }
      })
      setTimeout(() => {
        let name = ''
        // 待办跳转
        if (taskType === '1') {
          // 报名审核
          name = 'attendeeForms'
        } else if (taskType === '2' || taskType === '4') {
          // 报名变更
          name = 'attendeeFormsChange'
        } else if (taskType === '3') {
          // 取消报名
          name = 'attendeeFormsCancel'
        } else if (taskType === '5') {
          // 请假
          name = 'backlogDetail/leave'
        } else if (taskType === '51' || taskType === '52' || taskType === '53' || taskType === '61' || taskType === '62' || taskType === '63') {
          name = 'backlogDetail/resource'
        }
        if (name) {
          sessionStorage.setItem('isJumpToHome', true)
          setTimeout(() => {
            if (!sessionStorage.getItem('userBasicInfo')) {
              this.$api({
                url: 'user.userInfo'
              }).then(res => {
                const data = res.result
                const userBasicInfo = {
                  name: data.ssoUserName,
                  mobile: data.mobile ? data.mobile.slice(-4) : ''
                }
                sessionStorage.setItem('userBasicInfo', `${userBasicInfo.name}  ${userBasicInfo.mobile}`)
              }).finally(() => {
                this.$router.replace({
                  name,
                  query: {
                    [this.$enc('id')]: this.$enc(conferenceId),
                    [this.$enc('attendeeId')]: this.$enc(attendeeId),
                    [this.$enc('taskType')]: this.$enc(taskType),
                    [this.$enc('taskId')]: this.$enc(taskId),
                    [this.$enc('isBacklog')]: this.$enc(true)
                    // [this.$enc('isJumpToHome')]: this.$enc(true)
                  }
                })
              })
            } else {
              this.$router.replace({
                name,
                query: {
                  [this.$enc('id')]: this.$enc(conferenceId),
                  [this.$enc('attendeeId')]: this.$enc(attendeeId),
                  [this.$enc('taskType')]: this.$enc(taskType),
                  [this.$enc('taskId')]: this.$enc(taskId),
                  [this.$enc('isBacklog')]: this.$enc(true)
                  // [this.$enc('isJumpToHome')]: this.$enc(true)
                }
              })
            }
          })
        }
      })
    }
    // 用车安排审核
    if (url.includes('sign=carAudit')) {
      const arr = url.split('&')
      let conferenceId = ''
      arr.forEach(ele => {
        if (ele.includes('conferenceId')) {
          conferenceId = ele.split('=')[1]
        }
      })
      setTimeout(() => {
        if (!sessionStorage.getItem('userBasicInfo')) {
          this.$api({
            url: 'user.userInfo'
          }).then(res => {
            const data = res.result
            const userBasicInfo = {
              name: data.ssoUserName,
              mobile: data.mobile ? data.mobile.slice(-4) : ''
            }
            sessionStorage.setItem('userBasicInfo', `${userBasicInfo.name}  ${userBasicInfo.mobile}`)
          }).finally(() => {
            this.$router.replace({
              name: 'carAudit',
              query: {
                [this.$enc('conferenceId')]: this.$enc(conferenceId)
              }
            })
          })
        } else {
          this.$router.replace({
            name: 'carAudit',
            query: {
              [this.$enc('conferenceId')]: this.$enc(conferenceId)
            }
          })
        }
      })
    }
    // 住宿安排审核
    if (url.includes('sign=stayAudit1')) {
      const arr = url.split('&')
      let conferenceId = ''
      arr.forEach(ele => {
        if (ele.includes('conferenceId')) {
          conferenceId = ele.split('=')[1]
        }
      })
      setTimeout(() => {
        if (!sessionStorage.getItem('userBasicInfo')) {
          this.$api({
            url: 'user.userInfo'
          }).then(res => {
            const data = res.result
            const userBasicInfo = {
              name: data.ssoUserName,
              mobile: data.mobile ? data.mobile.slice(-4) : ''
            }
            sessionStorage.setItem('userBasicInfo', `${userBasicInfo.name}  ${userBasicInfo.mobile}`)
          }).finally(() => {
            this.$router.replace({
              name: 'stayAudit',
              query: {
                [this.$enc('conferenceId')]: this.$enc(conferenceId)
              }
            })
          })
        } else {
          this.$router.replace({
            name: 'stayAudit',
            query: {
              [this.$enc('conferenceId')]: this.$enc(conferenceId)
            }
          })
        }
      })
    }
    // 用餐安排审核
    if (url.includes('sign=dinnerAudit')) {
      const arr = url.split('&')
      let conferenceId = ''
      arr.forEach(ele => {
        if (ele.includes('conferenceId')) {
          conferenceId = ele.split('=')[1]
        }
      })
      setTimeout(() => {
        if (!sessionStorage.getItem('userBasicInfo')) {
          this.$api({
            url: 'user.userInfo'
          }).then(res => {
            const data = res.result
            const userBasicInfo = {
              name: data.ssoUserName,
              mobile: data.mobile ? data.mobile.slice(-4) : ''
            }
            sessionStorage.setItem('userBasicInfo', `${userBasicInfo.name}  ${userBasicInfo.mobile}`)
          }).finally(() => {
            this.$router.replace({
              name: 'dinnerAudit',
              query: {
                [this.$enc('conferenceId')]: this.$enc(conferenceId)
              }
            })
          })
        } else {
          this.$router.replace({
            name: 'dinnerAudit',
            query: {
              [this.$enc('conferenceId')]: this.$enc(conferenceId)
            }
          })
        }
      })
    }
    // 票证安排审核
    if (url.includes('sign=ticketAudit')) {
      const arr = url.split('&')
      let conferenceId = ''
      arr.forEach(ele => {
        if (ele.includes('conferenceId')) {
          conferenceId = ele.split('=')[1]
        }
      })
      setTimeout(() => {
        if (!sessionStorage.getItem('userBasicInfo')) {
          this.$api({
            url: 'user.userInfo'
          }).then(res => {
            const data = res.result
            const userBasicInfo = {
              name: data.ssoUserName,
              mobile: data.mobile ? data.mobile.slice(-4) : ''
            }
            sessionStorage.setItem('userBasicInfo', `${userBasicInfo.name}  ${userBasicInfo.mobile}`)
          }).finally(() => {
            this.$router.replace({
              name: 'ticketAudit',
              query: {
                [this.$enc('conferenceId')]: this.$enc(conferenceId)
              }
            })
          })
        } else {
          this.$router.replace({
            name: 'ticketAudit',
            query: {
              [this.$enc('conferenceId')]: this.$enc(conferenceId)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
