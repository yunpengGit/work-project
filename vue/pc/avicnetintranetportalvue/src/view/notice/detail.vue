<template>
  <div class="noticeDetail-1620630449748">
    <div class="main">
      <div class="subject">{{ info.title }}</div>
      <div v-if="info.publishDate" class="time">{{ info.publishDate | dateFilter }}</div>

      <div class="notice-content">
        <div class="text-body" v-html="info.content" />
        <!-- <pre class="text-body">{{ info.content }}</pre> -->
        <div class="text-inscribe">{{ info.signDept }}</div>
      </div>

      <down-load-files v-if="fileList.length" :attachments="fileList" class="annex-wrap" />

      <!-- 预览不显示访问记录和审批记录 -->
      <div v-if="$route.query.mode !== 'preview'" class="access-approval">
        <el-tabs v-model="activeName">
          <el-tab-pane label="访问统计" name="first">
            <sp-table
              :is-index="true"
              index-label="序号"
              :page-hieght="false"
              :inline-mode="true"
              class="table-statistics"
              uid="accessStatistics"
              :table-cols="statisticsCols"
              :api="getAccessStatistics"
            />
          </el-tab-pane>
          <!-- 当前登录人是该公告的创建者才可见审批记录 -->
          <el-tab-pane v-if="isOwnCreated" label="审批记录" name="second">
            <sp-table
              class="hidden-pagination"
              :page-hieght="false"
              :inline-mode="true"
              uid="approvalRecord"
              :table-cols="recordCols"
              :api="getApprovalRecord"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { getItem } from '@/utils/storage'
import iconSvg from '@/components/icon-svg'
import { DownLoadFiles } from '@/components'
import dayjs from 'dayjs'

export default {
  name: 'Detail',
  // eslint-disable-next-line vue/no-unused-components
  components: { iconSvg, DownLoadFiles },
  filters: {
    dateFilter (time) {
      return time ? dayjs(time).format('YYYY年MM月DD日') : ''
    }
  },
  props: {},
  data () {
    return {
      id: '',
      info: {},
      fileList: [],
      isOwnCreated: false,
      activeName: 'first',
      statisticsCols: [
        { label: '阅读人', prop: 'reader' },
        { label: '部门', prop: 'deptment' },
        { label: '阅读时间', prop: 'viewTime' }
      ],
      recordCols: [
        { label: '时间', prop: 'createDate' },
        { label: '节点名称', prop: 'activityName' },
        { label: '操作', prop: 'actionName' },
        { label: '处理意见', template: (scope) => {
          const node = document.createElement('div')
          node.innerHTML = scope.row.msg
          return node.innerText
        } }
      ]
    }
  },
  created () {
    const { id, mode } = this.$route.query
    this.id = id

    if (mode === 'preview') {
      const { info, fileList } = getItem('previewData', true)
      this.info = info
      this.fileList = fileList
    } else {
      this.getInfo()
    }
    this.getFileList()
  },
  methods: {
    getInfo () {
      this.$api('notice.startNoticeDetail', { id: this.id }).then(res => {
        this.info = res.data
        const { userId } = JSON.parse(getItem('userInfo'))
        this.isOwnCreated = res.data.createdBy === userId
      })
    },
    getFileList () {
      if (this.$route.query.mode === 'preview') {
        const { fileList } = getItem('previewData', true)
        this.fileList = fileList
        const res = {}
        res.rows = fileList
        return new Promise((resolve, reject) => {
          resolve(res)
        })
      } else {
        return this.$api('notice.fileList', { businessId: this.id }).then(res => {
          this.fileList = res.rows
          return res
        })
      }
    },
    getAccessStatistics (params) {
      return this.$api('notice.accessStatistics', { id: this.id, ...params })
    },
    getApprovalRecord () {
      return this.$api('notice.approvalRecord', { processInstId: this.id })
    }
  }
}
</script>

<style lang="scss" scoped>
.noticeDetail-1620630449748 {
    background: #fff;
    min-height: calc(100vh - 110px);

    .main {
      width: 968px;
      margin: 0 auto;
      padding-bottom: 54px;
      .subject {
        padding-top: 54px;
        font-size: 32px;
        font-weight: 600;
        color: #191F24;
        line-height: 45px;
        text-align: center;
      }
      .time {
        margin-top: 12px;
        font-size: 14px;
        line-height: 19px;
        text-align: center;
        color: #9B9B9B;
      }
      .notice-content {
        margin-top: 42px;
        word-break: break-all;
        margin-bottom: 50px;
        overflow-x: auto;
        .text-body {
          margin-bottom: 40px;
          font-size: 16px;
          line-height: 24px;
          color: #191F24;
          p{
            word-wrap:break-word;
            word-break:break-all;
          }
        }
        .text-inscribe {
          text-align: right;
          font-size: 16px;
          color: #191F24;
          line-height: 21px;
        }
      }
      .annex-wrap {
        margin-bottom: 36px;
      }
      .access-approval ::v-deep {
        .el-tabs__header {
          margin: 0;
        }
        .el-tabs__nav-wrap {
          margin-bottom: 11px;
          &::after {
            height: 0;
          }
        }
        .el-tabs__item {
          font-size: 14px;
          line-height: 18px;
          height: 22px;
        }
        .hidden-pagination .sp-pagination {
          display: none;
        }
      }
    }
}

</style>

<style lang="scss">
@import '@/ui/size/mixin.scss';
@mixin del($sc: 1, $fs: 14px){
  .noticeDetail-1620630449748 {

    .main {
      .subject {
        font-size: 32px * $sc;
        line-height: 45px * $sc;
      }
      .time {
        font-size: $fs;
        line-height: 19px * $sc;
      }
      .notice-content {
        .text-body {
          font-size: 16px * $sc;
          line-height: 24px * $sc;
          p{
            text-indent:32px;
            word-wrap:break-word;
            word-break:break-all;
          }
        }
        .text-inscribe {
          font-size: 16px * $sc;
          line-height: 21px * $sc;
        }
      }

      .access-approval {
        .el-tabs__nav-wrap {
          margin-bottom: 11px * $sc;
        }
        .el-tabs__item {
          font-size: $fs;
          line-height: 18px * $sc;
          height: 22px * $sc;
        }
      }
    }
  }
}
// 注意调用顺序
@import '@/ui/size/mixin.scss';
@import '@/ui/size/scale.scss';
</style>
