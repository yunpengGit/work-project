<template>
  <div class="warper-box">
    <sp-table
      keys="sharerUserNameLike1"
      :is-index="true"
      :is-pagination="true"
      :is-handle="true"
      :table-cols="tableCols"
      :api="onload"
    >
      <div slot="handle">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="edit(false)"
        >添加分享人</el-button>
      </div>
    </sp-table>
    <el-dialog
      :title="editValue.sharerId?'编辑':'添加分享人'"
      :visible.sync="editDialog"
      width="510px"
      top="200px"
    >
      <div>
        <el-form ref="form" label-position="left">
          <el-form-item v-if="editValue.sharerId" label="权限拥有者：" label-width="120px">
            <span style="color: #191f24; font-weight: 500">{{
              editValue.sharerUserName
            }}</span>
          </el-form-item>
          <el-form-item v-else label="权限拥有者：" label-width="120px">
            <div class="can-reader">
              <el-tag
                v-for="(item,i) in shareList"
                :key="item.id"
                type="info"
                closable
                @close="shareList.splice(i,1)"
              >{{ item.label }}</el-tag>
              <span
                v-if="!shareList.length"
                class="add-btn"
                @click="addShare"
              ><i class="el-icon-plus" />添加</span>
            </div>
          </el-form-item>
          <el-form-item
            label="编辑权限："
            prop="writePermsUserIds"
            label-width="120px"
          >
            <div class="can-reader">
              <el-tag
                v-for="item in editValue.writePermsUserItems"
                :key="item.id"
                type="info"
                closable
                @close="deleteReader('READWRITE', item.id)"
              >{{ item.label }}</el-tag>
              <span
                class="add-btn"
                @click="addReader('READWRITE')"
              ><i class="el-icon-plus" />添加</span>
            </div>
          </el-form-item>
          <el-form-item
            label="查看权限："
            prop="readPermsUserIds"
            label-width="120px"
          >
            <div class="can-reader">
              <el-tag
                v-for="item in editValue.readPermsUserItems"
                :key="item.id"
                type="info"
                closable
                @close="deleteReader('READONLY', item.id)"
              >{{ item.label }}</el-tag>
              <span
                class="add-btn"
                @click="addReader('READONLY')"
              ><i class="el-icon-plus" />添加</span>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取消</el-button>
        <el-button type="primary" @click="confirm('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 选择权限拥有者： -->
    <select-personnel
      :select-type="['personnel']"
      :dialog-visiable.sync="selectShareVisiable"
      :selected-list="shareList"
      :max-select-num="1"
      @confirm="(val)=>{shareList=val}"
    />
    <!--选择编辑权限和查看权限人员-->
    <select-personnel
      :select-type="['personnel']"
      :dialog-visiable.sync="selectReaderVisiable"
      :selected-list="canReaderList"
      @confirm="confirmSelectedUserIds"
    />
  </div>
</template>

<script>
// import SelectPersonnel from '../../notice/SelectPersonnel'
import SelectPersonnel from '@/components/SelectPersonnel'
export default {
  components: {
    SelectPersonnel
  },
  data () {
    return {
      // 表格
      tableCols: [
        { label: '权限拥有者', prop: 'sharerUserName' },
        { label: '所属部门', template: (scope) => {
          let department = ''
          for (const item of scope.row.sharerOrgs) {
            if (item.type === 2) {
              department = item.orgName
              break
            }
          }
          return (
            <div>
              {department}
            </div>
          )
        } },
        { label: '所属单位', template: (scope) => {
          let department = ''
          for (const item of scope.row.sharerOrgs) {
            if (item.type === 1) {
              department = item.orgName
              break
            }
          }
          return (
            <div>
              {department}
            </div>
          )
        } },
        { label: '编辑权限人数', prop: 'writePermsCount' },
        { label: '查看权限人数', prop: 'readPermsCount' },
        {
          label: '操作',
          width: '200',
          template: (scope) => {
            return (
              <div>
                <el-button type='text' on-click={() => this.edit(scope.row)}>
                  编辑
                </el-button>
                <el-button
                  type='text'
                  style='color:#F04134'
                  on-click={() => this.deleteWarning(scope.row)}
                >
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      editDialog: false,
      canReaderList: [],
      disabledReaderList: [],
      type: 1, // 1 选择编辑权限 // 2选择查看权限
      editValue: {
        sharerId: '',
        writePermsUserItems: [],
        readPermsUserItems: []
      },
      selectReaderVisiable: false,
      selectShareVisiable: false,
      shareList: []
    }
  },
  created () {
  },
  methods: {
    onload (params) {
      return this.$api('schedule.sharesStatistics', params)
    },
    refreshData () {
      this.$store.commit('UPDATE_ALL_TABLE_DATA')
    },
    edit (row) {
      if (!row) {
        this.$set(this.editValue, 'writePermsUserItems', [])
        this.$set(this.editValue, 'readPermsUserItems', [])
        this.editValue.sharerId = null
        this.editDialog = true
        return
      }
      this.$api('schedule.getEventSharesInfo', {
        userId: row.sharerId
      }).then((res) => {
        if (res.code === 200) {
          const resData = res.data
          this.editValue.writePermsUserItems = []
          this.editValue.readPermsUserItems = []
          resData.forEach((ele) => {
            const isRead = ele.latestPermsType === 'READONLY'
            this.editValue[
              isRead ? 'readPermsUserItems' : 'writePermsUserItems'
            ].push({
              label: ele[isRead ? 'subscriberUserName' : 'subscriberUserName'],
              id: ele[isRead ? 'subscriberId' : 'subscriberId'],
              type: 2
            })
          })
          this.editValue = { ...this.editValue, ...row }
          // console.log('this.editValue', this.editValue)
          this.editDialog = true
        } else {
          this.$message.error(res.msg || '发生未知错误')
        }
      })
    },
    confirm () {
      if (!this.editValue.sharerId && !this.shareList.length) {
        return this.$message.error('请选择权限拥有者')
      }
      if (
        !this.editValue.writePermsUserItems.length &&
        !this.editValue.readPermsUserItems.length
      ) {
        return this.$message.error('请选择人员')
      }

      const writePermsUserIds = []
      const readPermsUserIds = []
      this.editValue.writePermsUserItems.forEach((ele) => {
        writePermsUserIds.push(ele.id.toString())
      })
      this.editValue.readPermsUserItems.forEach((ele) => {
        readPermsUserIds.push(ele.id.toString())
      })
      const sharerId = this.editValue.sharerId || this.shareList[0].id

      const params = {
        sharerId: sharerId,
        writePermsUserIds,
        readPermsUserIds
      }
      this.eventSharesBatch(params)
      this.editDialog = false
    },
    deleteWarning (row) {
      this.$confirm('请确认是否删除？')
        .then((_) => {
          const writePermsUserIds = []
          const readPermsUserIds = []
          const params = {
            sharerId: row.sharerId,
            writePermsUserIds,
            readPermsUserIds
          }
          this.eventSharesBatch(params)
        })
        .catch((_) => {})
    },
    eventSharesBatch (params) {
      this.$api('schedule.eventSharesBatch', params).then((res) => {
        if (res.code === 200) {
          this.$message.success(`操作成功`)
          this.refreshData()
        } else {
          this.$message.error(res.msg || '发生未知错误')
        }
      })
    },
    addReader (type) {
      this.type = type
      this.canReaderList = this.editValue[
        type === 'READWRITE' ? 'writePermsUserItems' : 'readPermsUserItems'
      ]
      this.disabledReaderList = this.editValue[
        type === 'READWRITE' ? 'readPermsUserItems' : 'writePermsUserItems'
      ]
      this.selectReaderVisiable = true
    },
    addShare () {
      this.selectShareVisiable = true
    },
    confirmSelectedUserIds (data) {
      const type = this.type === 'READWRITE' ? 'writePermsUserItems' : 'readPermsUserItems'
      this.editValue[ type ] = []
      data.forEach((ele) => {
        this.editValue[ type].push(ele)
      })
    },
    deleteReader (type, id) {
      const readerList = this.editValue[
        type === 'READONLY' ? 'readPermsUserItems' : 'writePermsUserItems'
      ]
      const i = readerList.findIndex((e) => {
        return e.id === id
      })
      readerList.splice(i, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.can-reader {
  min-height: 68px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid rgba(25, 31, 36, 0.16);
  padding: 4px;
  display: flex;
  flex-wrap: wrap;
  .el-tag.el-tag--info {
    margin: 0 4px 8px 0;
    color: #333;
    border-radius: 2px;
    ::before {
      font-size: 16px;
      color: #333;
    }
  }
  .add-btn {
    width: 56px;
    height: 22px;
    border-radius: 2px;
    border: 1px solid #1e89ff;
    font-size: 12px;
    color: #1e89ff;
    text-align: center;
    line-height: 24px;
    cursor: pointer;
  }
}
</style>
