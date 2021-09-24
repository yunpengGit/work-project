<template>
  <div class="warper-box">
    <sp-table
      :keys="setting.authzType === 'SHARE'?'permsOwnerIdEqual,subscriberUserNameLike,permsType':'sharerUserNameLike,permsType'"
      :count="5"
      :is-index="true"
      :table-cols="tableCols"
      :api="onload"
    >
      <!-- 批量操作 -->
      <div v-if="$route.name === 'sharerList'" slot="handle">
        <el-button type="primary" icon="el-icon-plus" @click="addShare">
          {{ setting.addText }}
        </el-button>
      </div>
    </sp-table>
    <el-dialog
      :title="setting.addText"
      :visible.sync="addDialog"
      width="510px"
      top="200px"
    >
      <div>
        <el-form ref="form" label-position="left">
          <el-form-item label="权限所有者：" label-width="120px">
            <el-select
              v-model="form.permsOwner"
              value-key="sharerUserName"
              placeholder="请选择"
              :style="{ width: '300px' }"
              @change="ownerChange"
            >
              <el-option
                v-for="item in permsOwnerIdEqualArr"
                :key="item.sharerId"
                :label="item.sharerUserName"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="`${setting.addText}：`"
            prop="selectedUserIds"
            label-width="120px"
          >
            <div class="can-reader">
              <el-tag
                v-for="item in canReaderList"
                v-show="isReaderShow(item.id)"
                :key="item.id"
                type="info"
                closable
                @close="deleteReader(item.id)"
              >{{ item.label }}</el-tag>
              <span
                class="add-btn"
                @click="selectReaderVisiable = true"
              ><i class="el-icon-plus" />添加</span>
            </div>
          </el-form-item>
          <el-form-item label="分享权限：" label-width="120px">
            <el-select
              v-model="form.permsType"
              placeholder="请选择"
              :style="{ width: '300px' }"
            >
              <el-option
                v-for="item in optionArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取消</el-button>
        <el-button type="primary" @click="confirm('form')">确 定</el-button>
      </div>
    </el-dialog>
    <edit-dialog
      :dialog-visiable.sync="dialog"
      :edit-value.sync="editValue"
      @refreshData="refreshData"
    />
    <!--选择可阅读者-->
    <select-personnel
      :select-type="['personnel']"
      :dialog-visiable.sync="selectReaderVisiable"
      :selected-list="canReaderList"
      :disabled-list="disabledReaderList"
      @confirm="(val) => (canReaderList = val)"
    />
  </div>
</template>

<script>
import EditDialog from './editDialog'
// import SelectPersonnel from '../../notice/SelectPersonnel'
import SelectPersonnel from '@/components/SelectPersonnel'
import { getItem } from '@/utils/storage'

const setting = {
  sharerList: {
    addText: '添加分享人',
    apiUrl: 'schedule.getEventAuthAsSharer2',
    authzType: 'SHARE'
  },
  orderList: {
    addText: '分享给我的权限',
    apiUrl: 'schedule.getEventAuthAsSubscriber',
    authzType: 'SUBSCRIBE'
  }
}
export default {
  components: {
    EditDialog,
    SelectPersonnel
  },
  data () {
    return {
      tableCols: [],
      permsTypeObj: {
        NO: '无',
        READONLY: '允许查看',
        READWRITE: '允许创建、编辑、查看'
      },
      optionArr: [
        {
          label: '可查看',
          value: 'READONLY'
        },
        {
          label: '可创建、编辑、查看',
          value: 'READWRITE'
        }
      ],
      dialog: false,
      editValue: {
        name: '',
        permsType: '',
        authzId: ''
      },
      addDialog: false,
      canReaderList: [],
      disabledReaderList: [],
      form: {
        permsOwner: {
          sharerId: '',
          sharerUserName: ''
        },
        selectedUserIds: [],
        permsType: 'READONLY'
      },
      selectReaderVisiable: false,
      setting: '',
      permsOwnerIdEqualArr: []
    }
  },
  created () {
    this.setting = setting[this.$route.name]
    if (this.$route.name === 'sharerList') {
      this.getPermsOwners()
    }
    this.getTableCols()
  },
  methods: {
    getPermsOwners () {
      this.$api('schedule.getEventAuthAsSubscriber', {
        permsTypesIn: 'READWRITE',
        pageNum: 1,
        pageSize: 999
      }).then((res) => {
        if (res.code === 200) {
          this.permsOwnerIdEqualArr = [...res.data]
          const userInfo = JSON.parse(getItem('userInfo'))
          this.permsOwnerIdEqualArr.unshift({
            sharerUserName: userInfo.nickName,
            sharerId: userInfo.userId
          })
        } else {
          this.$message.error(res.msg || '发生未知错误')
        }
      })
    },
    deleteWarning (row) {
      this.$confirm('请确认是否删除？')
        .then((_) => {
          this.deleteEventAuth(row.authzId)
        })
        .catch((_) => {})
    },
    deleteEventAuth (authzId) {
      this.$api('schedule.deleteEventAuth', { authzId }).then((res) => {
        if (res.code === 200) {
          this.$message.success(`解除分享成功`)
          this.refreshData()
        } else {
          this.$message.error(res.msg || '发生未知错误')
        }
      })
    },
    ownerChange () {
      this.$api(this.setting.apiUrl, {
        permsOwnerIdEqual: this.form.permsOwner.sharerId,
        pageNum: 1,
        pageSize: 999
      }).then((res) => {
        if (res.code === 200) {
          this.canReaderList = []
          this.disabledReaderList = []
          this.canReaderList.push({
            id: this.form.permsOwner.sharerId,
            label: this.form.permsOwner.sharerUserName,
            type: 2
          })
          const resData = [...res.data]
          const isShare = this.$route.name === 'sharerList'
          // console.log(resData)
          resData.forEach((ele) => {
            this.canReaderList.push({
              id: isShare ? ele.subscriberId : ele.sharerId,
              label: isShare ? ele.subscriberUserName : ele.sharerUserName,
              type: 2
            })
          })
          this.disabledReaderList = JSON.parse(
            JSON.stringify(this.canReaderList)
          )
          this.addDialog = true
        } else {
          this.$message.error(res.msg || '发生未知错误')
        }
      })
    },
    addShare () {
      this.form.permsOwner.sharerId = JSON.parse(getItem('userInfo')).userId
      this.form.permsOwner.sharerUserName = JSON.parse(getItem('userInfo')).nickName
      this.ownerChange()
    },
    edit (row) {
      if (this.$route.name === 'sharerList') {
        row.name = row.subscriberUserName
      } else {
        row.name = row.sharerUserName
        row.permsType = row.latestPermsType
      }
      this.editValue = { ...row }
      this.dialog = true
    },
    deleteReader (id) {
      const i = this.canReaderList.findIndex((e) => {
        return e.id === id
      })
      this.canReaderList.splice(i, 1)
    },
    onload (params) {
      return this.$api(this.setting.apiUrl, params)
    },
    refreshData () {
      this.$store.commit('UPDATE_ALL_TABLE_DATA')
    },
    confirm () {
      const selectedUserIds = []
      this.canReaderList.forEach((ele) => {
        if (this.isReaderShow(ele.id)) {
          selectedUserIds.push(ele.id)
        }
      })
      if (!selectedUserIds.length) {
        return this.$message.error('请选择人员')
      }
      const { permsType } = this.form
      this.$api('schedule.postEventAuth', {
        selectedUserIds,
        permsType,
        authzType: this.setting.authzType
      }).then((res) => {
        if (res.code === 200) {
          this.$message.success('添加成功')
          this.addDialog = false
          this.refreshData()
        } else {
          this.$message.error(res.msg || '发生未知错误')
        }
      })
    },
    isReaderShow (id) {
      const i = this.disabledReaderList.findIndex((e) => {
        return e.id === id
      })
      return i < 0
    },
    toAuthConfirm (authzReqId) {
      this.$router.push({
        path: '/schedule/authConfirm',
        query: { authzReqId }
      })
    },
    getTableCols () {
      this.tableCols =
        this.$route.name === 'sharerList'
          ? [
            {
              label: '权限所有人',
              template: (scope) => (
                <div style='display: flex; alignItems: center '>
                  <span style='margin-left:5px'>
                    {scope.row.sharerUserName}
                  </span>
                </div>
              )
            },
            {
              label: '分享人员',
              template: (scope) => (
                <div style='display: flex; alignItems: center '>
                  <span style='margin-left:5px'>
                    {scope.row.subscriberUserName}
                  </span>
                </div>
              )
            },
            {
              label: '权限',
              template: (scope) => this.permsTypeObj[scope.row.latestPermsType]
            },
            {
              label: '状态',
              template: (scope) =>
                scope.row.currSubscribeReqId ? '待审核' : '已通过'
            },
            {
              label: '操作',
              width: '120',
              template: (scope) => {
                return scope.row.currSubscribeReqId ? (
                  <div>
                    <el-button
                      type='text'
                      on-click={() =>
                        this.toAuthConfirm(scope.row.currSubscribeReqId)
                      }
                    >
                        审核
                    </el-button>
                  </div>
                ) : (
                  <div>
                    <el-button
                      type='text'
                      on-click={() => this.edit(scope.row)}
                    >
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
          ]
          : [
            {
              label: '拥有者',
              prop: 'sharerUserName',
              template: (scope) => (
                <div style='display: flex; alignItems: center '>
                  <el-avatar
                    src={scope.row.sharerPhoto}
                  ></el-avatar>
                  <span style='margin-left:5px'>
                    {scope.row.sharerUserName}
                  </span>
                </div>
              )
            },
            {
              label: '分享权限',
              template: (scope) =>
                this.permsTypeObj[scope.row.latestPermsType]
            },
            {
              label: '审批状态',
              template: (scope) => {
                return (
                  <div>
                    {scope.row.currSubscribeReqId ? (
                      <span>待审核</span>
                    ) : (
                      <span style='color:#1E89FF'>已通过</span>
                    )}
                  </div>
                )
              }
            }
            // {
            //   label: '操作',
            //   width: '120',
            //   template: (scope) => {
            //     return (
            //       <div>
            //         <el-button
            //           type='text'
            //           disabled={scope.row.currSubscribeReqId ? true : false}
            //           on-click={() => this.edit(scope.row)}
            //         >
            //           <span>变更权限</span>
            //         </el-button>
            //       </div>
            //     )
            //   }
            // }
          ]
    }
  }
}
</script>
<style lang="scss" scoped>
.TableSearch {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.can-reader {
  width: 300px;
  box-sizing: border-box;
  min-height: 68px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid rgba(25, 31, 36, 0.16);
  padding: 4px;
  display: flex;
  flex-wrap: wrap;
  .el-tag.el-tag--info {
    margin: 0 4px 8px 0;
  }
  .add-btn {
    width: 56px;
    height: 22px;
    border-radius: 4px;
    border: 1px solid #1e89ff;
    font-size: 12px;
    color: #1e89ff;
    text-align: center;
    line-height: 24px;
    cursor: pointer;
  }
}
</style>
