<!--
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-06-06 13:09:25
 * @LastEditors: zongmz
 * @LastEditTime: 2021-06-09 10:52:44
-->
<template>
  <div class="roomManage">
    <div>
      <el-button type="primary" @click="operation('','add')">添加页面</el-button>
    </div>
    <div class="main">
      <div class="table-wrap">
        <el-table ref="meeting-table" :data="tableData" stripe style="width: 100%">
          <el-table-column type="index" width="60" :index="indexMethod" label="序号" />
          <!--                    <el-table-column prop="showOrder" label="showOrder"></portalUrl>-->
          <el-table-column prop="pageName" width="160" label="页面名称" />
          <el-table-column label="页面地址">
            <template slot-scope="scope">
              <div>
                {{ scope.row.pageUrl ? `${portalUrl}${scope.row.pageUrl}` : '' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="roomAddress" width="100" label="发布状态">
            <template slot-scope="scope">
              <div>
                {{ scope.row.publishState !==2 ? '未发布' : '已发布' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="{row}">
              <div class="btn-opt">
                <a class="btn-del" @click="operation(row,'view')">预览</a>
                <a class="btn-del" @click="operation(row,'edit')">编辑</a>
                <!-- <a class="btn-del" @click="operation(row,'publish')">发布{{ row.publishState !==2 ? '发布' : '撤回' }}</a> -->
                <a v-if="row.publishState !==2" class="btn-del" @click="operation(row,'publish')">发布</a>
                <a class="btn-del" @click="operation(row,'del')">删除</a>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div class="sp-pagination" style="position:relative; border:0">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 50, 100, 500]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { Base64 } from 'js-base64'

export default {
  name: 'RoomManage',
  props: {
    webSiteInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      title: '会议室管理',
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dragTR: null,
      timeStamp: null,
      portalUrl: `https:${process.env.VUE_APP_INDEX_LINK}`
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getRoomList()
  },
  mounted () {
    this.thBindDragEvent()
  },
  methods: {
    indexMethod (index) {
      return index + 1
    },
    getRoomList () {
      const req = {
        siteId: this.webSiteInfo.siteId
      }
      this.$api('website.webSitePageList', req).then(res => {
        this.tableData = res.data
        this.total = res.total
        // this.timeStamp = res.timeStamp
        this.$nextTick(() => {
          this.bindDraggableEvent()
        })
      })
    },
    operation (data, type) {
      switch (type) {
        case 'del':
          this.onDelect(data)
          break
        case 'publish':
          this.publish(data)
          break
        case 'add':
          this.add(data)
          break
        case 'edit':
          this.edit(data)
          break
        case 'view':
          this.view(data)
          break
        default:
          break
      }
    },
    onDelect (data) {
      this.$confirm(`确定删除${data.pageName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api('website.pageDelete', { pageId: data.pageId }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getRoomList()
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(() => {})
    },
    publish (data) {
      const msg = data.publishState === 2 ? `确定撤回${data.pageName}?` : `确定发布${data.pageName}?`
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const pageUrl = `/website/${Base64.encode(data.pageId)}`

        const req = {
          publishState: data.publishState === 2 ? '1' : '2',
          pageUrl: pageUrl
        }
        this.$api('website.pagePublish', { pageId: data.pageId, ...req }).then(res => {
          if (res.code === 200) {
            this.$message.success(`${data.publishState === 2 ? '撤回' : '发布'}成功`)
            this.getRoomList()
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(() => {})
    },
    add (data) {
      window.open(`${this.portalUrl}/dragHome?siteId=${Base64.encode(this.webSiteInfo.siteId)}`, '_blank')
    },
    edit (data) {
      window.open(`${this.portalUrl}/dragHome?siteId=${Base64.encode(this.webSiteInfo.siteId)}&pageId=${Base64.encode(data.pageId)}`, '_blank')
    },
    view (data) {
      if (data.publishState !== 2) {
        window.open(`${this.portalUrl}/website-view?pageId=${Base64.encode(data.pageId)}`, '_blank')
      } else {
        window.open(`${this.portalUrl}/website/${Base64.encode(data.pageId)}`, '_blank')
      }
    },
    thBindDragEvent () {
      const ElTable = this.$refs['meeting-table'].$el
      const th = ElTable.querySelector('thead')
      th.addEventListener('drop', (ev) => { // 绑定拖动结束事件
        ev.preventDefault()
        const moveData = { ...this.tableData[this.dragTRIndex] }
        this.putOrder(moveData, { ...this.tableData[0] })
        this.tableData.splice(this.dragTRIndex, 1)
        this.tableData.splice(0, 0, moveData)
      })

      th.addEventListener('dragover', (ev) => {
        const tr = ElTable.querySelectorAll('tbody tr')
        const _tr = tr[0]
        if (_tr.className.indexOf('dragover-top') < 0) {
          _tr.className += ' dragover-top'
        }
        ev.preventDefault()
      })
      th.addEventListener('dragend', (ev) => {
        this.removeDragClass(ev)
      })
      th.addEventListener('dragleave', (ev) => {
        this.removeDragClass(ev)
      })
      th.addEventListener('dragexit', (ev) => {
        this.removeDragClass(ev)
      })
      th.addEventListener('dragenter', (ev) => {
        ev.preventDefault()
      })
    },
    dragstart (ev) { // 绑定开始拖动事件
      this.dragTRIndex = ev.target.rowIndex
    },
    drop (ev) { // 绑定拖动结束事件
      ev.preventDefault()
      const tr = this.findParentNode(ev.target, 'TR')
      const index = tr.rowIndex
      const moveData = { ...this.tableData[this.dragTRIndex] }
      console.log('====================================')
      console.log(moveData, this.dragTRIndex, this.tableData[this.dragTRIndex > index ? index + 1 : index], index)
      console.log('====================================')
      this.putOrder(moveData, { ...this.tableData[this.dragTRIndex > index ? index + 1 : index] })
      this.tableData.splice(this.dragTRIndex, 1)
      this.tableData.splice(index + 1, 0, moveData)
    },
    dragover (ev) { // 拖拽覆盖
      const tr = this.findParentNode(ev.target, 'TR')
      if (tr.className.indexOf('dragover') < 0) {
        tr.className += ' dragover'
      }
      ev.preventDefault()
    },
    preventDefault (ev) {
      ev.preventDefault()
    },
    bindDraggableEvent () { // 绑定表格拖拽事件
      const ElTable = this.$refs['meeting-table'].$el
      const tr = ElTable.querySelectorAll('tr.el-table__row')
      tr.forEach(t => {
        t.setAttribute('draggable', true) // 允许拖动
        t.removeEventListener('dragstart', this.dragstart, false)
        t.addEventListener('dragstart', this.dragstart, false)
        t.removeEventListener('dragstart', this.drop, false)
        t.addEventListener('drop', this.drop, false)
        t.removeEventListener('dragover', this.dragover, false)
        t.addEventListener('dragover', this.dragover, false)
        t.removeEventListener('dragend', this.removeDragClass, false)
        t.addEventListener('dragend', this.removeDragClass, false)
        t.removeEventListener('dragleave', this.removeDragClass, false)
        t.addEventListener('dragleave', this.removeDragClass, false)
        t.removeEventListener('dragexit', this.removeDragClass, false)
        t.addEventListener('dragexit', this.removeDragClass, false)
        t.removeEventListener('dragenter', this.preventDefault, false)
        t.addEventListener('dragenter', this.preventDefault, false)
      })
    },
    findParentNode (el, nodeName) { // 寻找父级标签
      function b (node) {
        if (node.tagName === nodeName) {
          return node
        } else {
          return b(node.parentNode)
        }
      }

      return b(el)
    },
    removeDragClass (ev) {
      const ElTable = this.$refs['meeting-table'].$el
      const trs = ElTable.querySelectorAll('tr')
      trs.forEach(tr => {
        if (tr.className.indexOf('dragover') > -1) {
          tr.className = tr.className.replace(/ dragover/g, '')
        }
        if (tr.className.indexOf('dragover-top') > -1) {
          tr.className = tr.className.replace(/ dragover-top/g, '')
        }
        ev.preventDefault()
      })
    },
    putOrder (sortRoom, targetRoom) {
      console.log(sortRoom, targetRoom, 222)
      const params = {
        pageId: sortRoom.pageId,
        oldOrder: sortRoom.showOrder,
        newOrder: targetRoom.showOrder
      }
      this.$api('website.pageOrder', params).then(res => {
        if (res.code === 200) {
          this.$nextTick(() => {
            this.bindDraggableEvent()
          })
          this.getRoomList()
        } else {
          this.$message.error('排序失败，请重试')
          this.getRoomList()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    .header {
        height: 65px;
        background: #fff;
        padding: 0 20px 0 10px;
        margin-bottom: 20px;

        i {
            font-size: 20px;
        }

        .title {
            font-size: 16px;
            margin-left: 20px;
        }

    }

    .main {
        background: #fff;

        .ant-tag {
            color: rgba(0, 0, 0, 0.65);
        }

        .table-wrap {
            padding: 20px;
        }

        .btn-opt {
            .btn-del {
                margin-left: 10px;
            }

            a {
                text-decoration: none;
                color: #4285f4;
                font-size: 14px;
            }
        }
    }

    .header a {
        text-decoration: none;
        color: #fff;
    }

    ::v-deep .header .iconTip {
        width: 16px;
        color: #409EFF;
        font-size: 16px;
    }

    ::v-deep .table-wrap tbody tr {
        cursor: pointer;
    }
</style>
