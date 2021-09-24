<!--
 * @Descripttion: mqtt消息组件
 * @Author: zongmz
 * @Date: 2021-04-27 11:25:49
 * @LastEditors: zongmz
 * @LastEditTime: 2021-09-02 17:13:41
-->
<template>
  <div />
</template>
<script>
import mqtt from 'mqtt'
import { mapState } from 'vuex'
import { getToken } from '@/utils/auth'
import { getItem } from '@/utils/storage'
import store from '@/store'

const options = {
  connectTimeout: 40000,
  clientId: `portal_${new Date().getTime()}`,
  username: 'server_name',
  password: getToken(),
  clean: true
}
export default {
  name: 'MqttClient',
  data () {
    return {
      client: mqtt.connect(`wss://${process.env.VUE_APP_MQTT_URL}:443/mqtt`, options),
      userId: null
    }
  },
  computed: {
    ...mapState({
      deptPathData: state => state.deptPaths.deptPaths
    })
  },
  created () {
    store.dispatch('getDeptPathFn')
    this.userId = JSON.parse(getItem('userInfo')) && JSON.parse(getItem('userInfo')).userId
    this.buildConnect()
  },
  // destroyed () {
  //   this.client.end()
  // },
  methods: {
    Uint8ArrayToString (fileData) {
      let dataString = ''
      for (var i = 0; i < fileData.length; i++) {
        dataString += String.fromCharCode(fileData[i])
      }
      return dataString
    },
    mqttDepts () {
      this.deptPathData.forEach(v => {
        this.subscribeOrg(v)
      })
    },
    subscribeOrg (id) {
      this.client.subscribe(`TOPIC-REFRESH/ORG/${id}`, err => {
        if (err) {
          console.log(err, 'org')
        }
      })
    },
    // 建立新连接
    buildConnect () {
      this.client.on('connect', data => {
        // 连接成功后订阅主题
        this.client.subscribe(`TOPIC-REFRESH/USER/${this.userId}`, err => {
          if (err) {
            console.log(err, 'userID')
          }
        })
        this.mqttDepts()
      })
      this.client.on('message', (topic, message, packet) => {
        let objStr = this.Uint8ArrayToString(packet.payload)
        objStr = objStr.replace(/\s+/g, '')
        const obj = (new Function('return ' + objStr))()
        // console.log('====================================')
        // console.log(obj, 29292)
        // console.log('====================================')
        const type = obj.module
        this.$emit('change', type)
      })
    }
  }
}
</script>
