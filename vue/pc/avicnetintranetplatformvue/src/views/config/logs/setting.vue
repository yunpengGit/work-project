<!--
 * @Descripttion:日志设置
 * @Author: zhaohx
 * @Date: 2021-04-07 16:13:01
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-06-01 22:59:46
-->
<template>
  <el-tabs type="border-card">
    <el-tab-pane label="日志设置" class="set-pane">
      <div class="info-text">日志存储空间阈值（总存储空间的80%）
        <span>{{ settingInfo.logThreshold }}M</span>
      </div>
      <div class="info-text">当前日志存储空间（总存储空间的80%）
        <span>{{ settingInfo.logUsed }}M</span>
      </div>
      <div class="tips">
        说明：阈值根据日志存储空间先固定为80%，当日志存储空间达到阈值时，系统将进行警告提醒。在待办中形成提醒。
        <span>禁止转储最近6个月的日志</span>
      </div>
    </el-tab-pane>
    <el-tab-pane label="日志转储" class="action-pane">
      <div>
        <span>日志时间：</span>
        <el-date-picker
          v-model="dateRange"
          unlink-panels
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        />
      </div>
      <div class="tips">*禁止转储最近6个月的日志！</div>
      <div class="tips">
        <span v-if="dumpTime">最近转储时间：{{ dumpTime }}</span>
        <span v-if="beginTime">日志时间：{{ beginTime }} 至 {{ endTime }}</span>
      </div>
      <el-button
        class="btn"
        type="primary"
        :loading="dumping"
        @click="logDump"
      >{{ dumping ? '转储中' : '确定' }}</el-button>
    </el-tab-pane>
    <el-tab-pane label="转储记录">
      <sp-table
        ref="dumpRecord"
        :height="tableHeight"
        keys="dumpTime, logTime"
        :is-index="true"
        :table-cols="tableCols"
        :page-height="false"
        :api="getList"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { getToken } from '@/utils/auth'
import { saveAs } from 'file-saver'
import axios from 'axios'
export default {
  data () {
    return {
      dateRange: '',
      tableCols: [
        { label: '转储时间', prop: 'createTime' },
        { label: '日志开始时间', prop: 'dumpStartTime' },
        { label: '日志结束时间', prop: 'dumpEndTime' },
        {
          label: '下载', template: scope => {
            return <div>
              <el-button
                type='text'
                on-click={() => this.download(scope.row)}
              >下载转储文件</el-button>
            </div>
          }
        }
      ],
      settingInfo: {
        logThreshold: 0,
        logUsed: 0
      },
      dumping: false,
      dumpTime: '',
      beginTime: '',
      endTime: '',
      tableHeight: 0
    }
  },
  created () {
    this.getSetting()
    this.getLast()
  },
  mounted () {
    setTimeout(() => {
      document.querySelector('.el-table__body-wrapper').style.maxHeight = `${parseFloat(this.getStyle(document.querySelector('.el-table__body-wrapper'), 'maxHeight')) - 61}px`
      this.tableHeight = `${parseFloat(this.getStyle(document.querySelector('.el-table__body-wrapper'), 'maxHeight')) - 61}px`
    }, 110)
  },
  methods: {
    getStyle (ele, attr) {
      return ele.currentStyle ? ele.currentStyle[attr] : document.defaultView.getComputedStyle(ele, null)[attr]
    },
    // 获取转储记录表格
    getList (params) {
      if (Array.isArray(params.logTime)) {
        params.dumpStartTimeStr = params.logTime ? params.logTime[0] : null
        params.dumpEndTimeStr = params.logTime ? params.logTime[1] : null
        delete params.logTime
      }
      if (Array.isArray(params.dumpTime)) {
        params.beginTime = params.dumpTime ? params.dumpTime[0] : null
        params.endTime = params.dumpTime ? params.dumpTime[1] : null
        delete params.dumpTime
      }
      return this.$api('setting.logList', params)
    },
    // 获取日志设置数据
    getSetting () {
      this.$api('setting.logSetting').then(res => {
        if (res.code === 200) {
          // 后台返回bytb，转为M
          this.settingInfo.logThreshold = res.data.logThreshold / (1024 * 1024)
          this.settingInfo.logUsed = res.data.logUsed / (1024 * 1024)
        }
      })
    },
    // 获取最近一次日志时间
    getLast () {
      this.$api('setting.logList').then(res => {
        if (res.code === 200) {
          const info = res.data[0]
          this.dumpTime = info && info.createTime
          this.beginTime = info && info.dumpStartTime
          this.endTime = info && info.dumpEndTime
        }
      })
    },
    // 下载转储文件
    download (rows) {
      const params = {
        path: rows.dumpPath,
        fileName: rows.dumpFileName
      }
      axios({
        url: '/api/file/download',
        method: 'post',
        responseType: 'blob',
        headers: { 'Authorization': `Bearer ${getToken()}` },
        data: JSON.stringify(params)
      }).then(res => {
        const patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
        // console.log(res, blob, 22)
        const contentDisposition = decodeURI(res.headers['content-disposition'])
        const result = patt.exec(contentDisposition)
        const fileName = result[1]
        const blob = new Blob([res.data])
        saveAs(blob, fileName)
        this.$message.success('下载成功')
      }).catch(e => {
        this.$message.error('下载失败')
      })
    },
    // 日志转储
    logDump () {
      this.dumping = true
      if (!this.dateRange) {
        this.$message.error('请选择日志时间！')
        return
      } else {
        this.$api('setting.logDump', {
          beginTime: this.dateRange[0],
          endTime: this.dateRange[1]
        }).then(res => {
          this.dumping = false
          if (res.code === 200) {
            this.dateRange = ''
            this.getLast()
            this.$store.commit('UPDATE_ALL_TABLE_DATA')
            this.$message.success(res.msg)
          }
        }).catch(() => {
          this.dumping = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scope>
.set-pane {
  padding: 16px;
  .info-text {
    margin-top: 40px;
    font-size: 18px;
    span {
      margin-left: 16px;
    }
  }
  .tips {
    margin-top: 80px;
    font-size: 18px;
    color: rgb(205,0,22);
    span {
      display: block;
      margin-top: 10px;
    }
  }
}
.action-pane {
  padding: 36px;
  .tips {
    margin-top: 24px;
    font-size: 18px;
    color: rgb(205,0,22);
  }
  .btn {
    margin-top: 24px;
  }
}
</style>
