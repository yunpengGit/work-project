<template>
  <div class="permission-1620636404291">
    <sp-table
      keys="leaderName,leaderType,editorName"
      :is-index="true"
      index-label="序号"
      :is-handle="true"
      :table-cols="tableCols"
      :api="onload"
    >
      <div slot="handle">
        <el-button type="primary" @click="onAdd">添加可编辑者</el-button>
      </div>
    </sp-table>

    <el-dialog v-if="dialogVisible" :title="leaderId? '编辑':'新增'" :visible.sync="dialogVisible" class="person-dialog">

      <el-form ref="ruleForm" :model="form" :rules="rules">
        <el-form-item label="领导姓名：" prop="leader">
          <span v-if="leaderId" class="leader-name">{{ form.leader.length && form.leader[0].name }}</span>
          <div v-else class="selete-wrap">
            <el-tag v-for="(item,index) in form.leader" :key="index" closable type="info" @close="form.leader.splice(index,1)">{{ item.name }}</el-tag>
            <span v-if="!form.leader.length" class="btn-add" @click="selectLeaderVisiable = true"><i class="el-icon-plus" />添加</span>
          </div>
        </el-form-item>

        <el-form-item label="领导类型：" prop="leaderType">
          <el-select
            v-model="form.leaderType"
            placeholder="请选择"
            class="item-select"
          >
            <el-option v-for="(key,value) in leaderTypes" :key="key" :label="key" :value="Number(value)" />
          </el-select>
        </el-form-item>

        <el-form-item label="可编辑者：" prop="editors">
          <div class="selete-wrap">
            <el-tag v-for="(item,index) in form.editors" :key="index" closable type="info" @close="form.editors.splice(index,1)">{{ item.name }}</el-tag>
            <span class="btn-add" @click="selectEditorVisiable = true"><i class="el-icon-plus" />添加</span>
          </div>
        </el-form-item>

        <el-form-item label="排序号：" prop="showOrder">
          <el-input v-model="form.showOrder" placeholder="请输入内容" maxlength="3" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSure">确 定</el-button>
      </div>
    </el-dialog>

    <!--选择领导-->
    <select-personnel
      :dialog-visiable.sync="selectLeaderVisiable"
      :selected-list="form.leader"
      :max-select-num="1"
      :select-type="['personnel']"
      @confirm="(val) => (form.leader = val)"
    />

    <!--选择可编辑者-->
    <select-personnel
      :dialog-visiable.sync="selectEditorVisiable"
      :selected-list="form.editors"
      :select-type="['personnel']"
      @confirm="(val) => (form.editors = val)"
    />

  </div>
</template>

<script>
import SelectPersonnel from '@/components/SelectPersonnel'
const leaderTypes = {
  1: '集团领导',
  10: '总助级高管',
  20: '部门领导'
}
export default {
  name: 'Permission',
  components: { SelectPersonnel },

  props: {},
  data () {
    return {
      form: {
        leader: [],
        leaderType: '',
        editors: [],
        showOrder: ''
      },
      leaderId: '',
      leaderTypes,
      tableData: [],
      dialogVisible: false,
      selectEditorVisiable: false,
      selectLeaderVisiable: false,
      tableCols: [
        { label: '领导姓名', prop: 'leaderName', align: 'center' },
        { label: '领导类型', template: scope => leaderTypes[scope.row.leaderType] },
        { label: '可编辑者', prop: 'editorName' },
        { label: '排序号', prop: 'showOrder', align: 'center' },
        { label: '操作', width: '120', template: scope => {
          return <div>
            <el-button type='text' on-click={() => this.onEdit(scope.row)}>编辑</el-button>
            <el-button type='text' on-click={() => this.onDelete(scope.row)}>删除</el-button>
          </div>
        } }
      ],
      rules: {
        leader: [
          { type: 'array', required: true, message: '请添加领导', trigger: 'change' }
        ],
        leaderType: [
          { required: true, message: '请选择领导类型', trigger: 'change' }
        ],
        editors: [
          { type: 'array', required: true, message: '请添加可编辑者', trigger: 'change' }
        ],
        showOrder: [
          { required: true, message: '请输入排序号', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    // 排序号为从1开始的整数
    'form.showOrder': function (n, o) {
      if (n !== '' && !/^$|(^[1-9]\d*$)/.test(n)) {
        this.$nextTick(() => {
          this.form.showOrder = o
        })
      }
    }
  },
  methods: {
    onload (params) {
      return this.$api('leadersWeekly.authList', params)
    },
    onAdd () {
      this.dialogVisible = true
      this.leaderId = ''
      this.form = {
        leader: [],
        leaderType: '',
        editors: [],
        showOrder: ''
      }
    },
    onEdit ({ leaderId }) {
      this.leaderId = leaderId
      this.$api('leadersWeekly.authInfo', { leaderId }).then((res) => {
        const { leaderId, leaderName, leaderType, showOrder, editors } = res.data
        this.form.leader = [{ id: leaderId, name: leaderName, type: 2 }]
        this.form.leaderType = leaderType
        this.form.showOrder = showOrder
        this.form.editors = editors.map(v => { return { id: v.editorId, name: v.editorName, type: 2 } })
      }).catch(() => {})
      this.dialogVisible = true
    },
    onSure () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const req = {
            leaderId:	this.form.leader[0].id,
            leaderName: this.form.leader[0].name,
            leaderType: this.form.leaderType,
            showOrder: this.form.showOrder,
            editors: this.form.editors.map(v => { return { editorId: v.id, editorName: v.name } })
          }
          this.$api(`leadersWeekly.${this.leaderId ? 'authEdit' : 'authAdd'}`, { ...req }).then((res) => {
            this.$message.success('操作成功')
            this.dialogVisible = false
            this.$store.commit('UPDATE_ALL_TABLE_DATA')
          }).catch((e) => {
            this.$message.error(e.msg)
          })
        } else {
          return false
        }
      })
    },
    onDelete ({ leaderId }) {
      this.$confirm('请确认是否删除？')
        .then(_ => {
          this.$api('leadersWeekly.authDelete', { leaderId }).then(() => {
            this.$message.success('删除成功')
            this.$store.commit('UPDATE_ALL_TABLE_DATA')
          }).catch(() => {
            this.$message.error('删除失败，请稍后再试')
          })
        }).catch(_ => {})
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep   .person-dialog {
  .selete-wrap {
     border-radius: 4px;
     border: 1px solid rgba(25, 31, 36, 0.16);
     box-sizing: border-box;
     padding: 4px;
     display: flex;
     flex-wrap: wrap;
     .el-tag {
        margin: 3px 4px 3px 0;
     }
     .btn-add {
      border-radius: 4px;
      border: 1px solid #1e89ff;
      color: #1e89ff;
      text-align: center;
      cursor: pointer;
      margin: 3px 4px 3px 0;
      padding: 0 9px;
      font-size: 14px;
      height: 26px;
      line-height: 26px;
     }
  }

  .selete-wrap,
  .el-select,
  .el-input {
    width: 310px;
  }
}
</style>

<style lang="scss">
@import '@/ui/size/mixin.scss';
@mixin del($sc: 1, $fs: 14px){
  .permission-1620636404291 {
    .person-dialog {
      .el-dialog {
        width: 450px * $sc;
        .el-form .el-form-item__label {
          width: 100px * $sc;
        }
        .leader-name {
          font-size: $fs;
        }
        .selete-wrap,
        .el-select,
        .el-input {
          width: 310px * $sc;
        }
        .btn-add {
          padding: 0 9px* $sc;
          font-size: $fs;
          height: 26px * $sc;
          line-height: 26px * $sc;
        }
      }
    }
  }
}

@import '@/ui/size/mixin.scss';
@import '@/ui/size/scale.scss';
</style>
