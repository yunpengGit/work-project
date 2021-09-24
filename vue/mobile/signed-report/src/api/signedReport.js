import { http } from '@/http'
// const BASE_URL = 'http://j5yahw.natappfree.cc'
const BASE_URL = ''
const signedReport = {
  getCanCreate (data) {
    return http({
      url: BASE_URL + '/km/imissive/km_imissive_staff/kmImissiveStaff.do?method=getCanCreate',
      method: 'get',
      data
    })
  },
  getUpcoming (data) {
    return http({
      url: BASE_URL + '/sys/notify/sys_notify_todo/sysNotifyMainIndex.do?method=query&dataType=todo&fdType=13&&&orderby=fdCreateTime&ordertype=down&q.from=imissive',
      method: 'get',
      data
    })
  },
  getUnread (data) {
    return http({
      url: BASE_URL + '/sys/notify/sys_notify_todo/sysNotifyMainIndex.do?method=query&dataType=toview&fdType=2&&&orderby=fdCreateTime&ordertype=down&q.from=imissive',
      method: 'get',
      data
    })
  },
  getAllReceived (data) {
    return http({
      url: BASE_URL + '/km/imissive/km_imissive_receive_main/kmImissiveReceiveMain.do?method=query&orderby=docCreateTime&ordertype=down',
      method: 'get',
      data
    })
  },
  getAllPost (data) {
    return http({
      url: BASE_URL + '/km/imissive/km_imissive_send_main/kmImissiveSendMain.do?method=query&orderby=docCreateTime&ordertype=down',
      method: 'get',
      data
    })
  },
  getReceivedSort (data) {
    return http({
      url: BASE_URL + '/km/imissive/km_imissive_receive_main/kmImissiveReceiveMain.do?method=getTempList',
      method: 'get',
      data
    })
  },
  getPostSort (data) {
    return http({
      url: BASE_URL + '/km/imissive/km_imissive_send_main/kmImissiveSendMain.do?method=getTempList',
      method: 'get',
      data
    })
  },
  newReceivedSort (data) {
    return http({
      url: BASE_URL + '/km/imissive/km_imissive_receive_main/kmImissiveReceiveMain.do?method=add&mobile=true',
      method: 'get',
      data
    })
  },
  newPostSort (data) {
    return http({
      url: BASE_URL + '/km/imissive/km_imissive_send_main/kmImissiveSendMain.do?method=add&mobile=true',
      method: 'get',
      data
    })
  }
}
export default signedReport
