<!--
 * @Author: caofeng
 * @LastEditors: caofeng
 * @Date: 2021-07-19 15:23:16
 * @LastEditTime: 2021-07-26 16:21:49
 * @FilePath: \conferenceH5e:\项目\内网\avicnetintranetplatformvue\src\views\componentManage\develop\index.vue
-->

<template>
  <div class="main">
    <sp-table
      keys="componentName"
      :is-index="true"
      index-label="序号"
      :is-handle="true"
      :table-cols="tableCols"
      :api="onload"
    >
      <div slot="handle">
        <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增组件</el-button>
      </div>
    </sp-table>

    <!--选择授权-->
    <select-personnel
      :dialog-visiable.sync="dialogVisible"
      :selected-list="authorizer"
      @confirm="onConfirm"
    />

  </div>
</template>

<script>
import SelectPersonnel from '@/components/SelectPersonnel'
export default {
  components: { SelectPersonnel },

  props: {},
  data () {
    return {
      authorizer: [],
      dialogVisible: false,
      activeComponent: '',
      tableCols: [
        { label: '名称', prop: 'label', align: 'center' },
        { label: '业务分类', prop: 'categoryName' },
        { label: '组件类型', template: scope => this.typeOpts[scope.row.componentName] },
        { label: '状态', template: scope => scope.row.enableStatus ? '启用' : '停用' },
        { label: '操作', width: '220', template: scope => {
          return <div>
            <el-button type='text' on-click={() => this.onEdit(scope.row)}>编辑</el-button>
            <el-button type='text' on-click={() => this.onAuthorize(scope.row)}>授权</el-button>
            <el-button type='text' on-click={() => this.onSwitch(scope.row)}>{scope.row.enableStatus ? '停用' : '启用'}</el-button>
            <el-button type='text' on-click={() => this.onDelete(scope.row)}>删除</el-button>
          </div>
        } }
      ],
      typeOpts: {
        'CustomizeList': '通用列表',
        'CustomizeNews': '通用图文'
      }
    }
  },
  methods: {
    onload (params) {
      return this.$api('componentManage.listComponentPage', params)
    },
    onAdd () {
      this.$router.push('/componentManage/addDevelop')
    },
    onEdit ({ componentId }) {
      this.$router.push(`/componentManage/addDevelop?componentId=${componentId}`)
    },
    // 授权
    onAuthorize ({ authList, componentId }) {
      this.activeComponent = componentId
      this.dialogVisible = true
      this.authorizer = authList.map(d => {
        return {
          id: d.deptUserId,
          name: d.deptUserName,
          type: d.type
        }
      })
    },
    // 授权 --- 确定
    onConfirm (val) {
      const data = val.map(d => {
        return {
          deptUserId: d.id,	// 组织或用户Id
          deptUserName: d.name,	// 组织活用户名称
          type: d.type	// 类型1组织 2用户
        }
      })
      this.$api('componentManage.authComponent', { componentId: this.activeComponent, data }).then(() => {
        this.$message.success('授权成功')
        this.$store.commit('UPDATE_ALL_TABLE_DATA')
      })
    },
    // 启用/停用
    onSwitch ({ componentId, enableStatus }) {
      const text = enableStatus ? '停用' : '启用'
      this.$confirm(`确认${text}此组件吗？`, '提示', { type: 'warning' })
        .then(_ => {
          this.$api('componentManage.enableStatusComponent', { componentId, enableStatus: enableStatus ? 0 : 1 })
            .then(() => {
              this.$message.success(`此组件已被${text}`)
              this.$store.commit('UPDATE_ALL_TABLE_DATA')
            })
        })
    },
    onDelete ({ componentId }) {
      this.$confirm('确认删除此组件吗？', '提示', { type: 'warning' })
        .then(_ => {
          this.$api('componentManage.deleteComponent', { componentId }).then(() => {
            this.$message.success('此组件已被删除')
            this.$store.commit('UPDATE_ALL_TABLE_DATA')
          })
        })
    }
  }
}
</script>

