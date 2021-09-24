<template>
  <div class="users app-container">
    <div class="left-content">
      <div class="search-content">
        <el-input v-model="deptWord" placeholder="搜索部门名称" />
        <icon-svg
          slot="suffix"
          class="search-suffix"
          name="sousuo"
          @click.native="getDepts"
        />
      </div>
      <org-tree
        ref="tree"
        :tree-data="treeData"
        tree-node="id"
        :need-action="false"
        @nodeClick="nodeClick"
        @clickTree="clickTree(arguments)"
      />
    </div>
    <div class="right-content">
      <sp-table
        keys="userName"
        keys-more="phonenumber,status,workNo,secretLevel,type"
        :is-index="true"
        :table-cols="tableCols"
        :api="getList"
      />
    </div>
    <detail
      v-if="detailVisibile"
      :detail-drawer.sync="detailVisibile"
      :current-id="currentId"
      @closeDetail="closeAdd"
    />
  </div>
</template>

<script>
import iconSvg from '@/components/icon-svg'
import orgTree from '../business/OrgTree/index'
import detail from './detail'
export default {
  components: { iconSvg, orgTree, detail },
  data () {
    return {
      // 部门树数据
      treeData: [],
      // 树结构搜索关键词
      deptWord: '',
      // 当前选中树节点id和名称
      listId: '',
      listDeptName: '',
      // 当前操作列表项id
      currentId: '',
      mData: null,
      detailVisibile: false,
      tableCols: [
        {
          label: '登录名', prop: 'userName'
        },
        {
          label: '姓名', prop: 'nickName'
        },
        {
          label: '人员编码', prop: 'workNo'
        },
        {
          label: '手机号', prop: 'phonenumber'
        },
        {
          label: '所属企业', prop: 'sysUserCompanyName'
        },
        {
          label: '所属部门', prop: 'deptName'
        },
        {
          label: '员工类型', template: scope => {
            return this.getUserType(scope.row.type)
          }
        },
        {
          label: '密级', prop: 'secretLevelLabel'
        },
        {
          label: '账号状态', template: scope => {
            return scope.row.status === '1' ? '停用' : '正常'
          }
        },
        {
          label: '操作', template: scope => {
            return <div>
              <el-button
                type='text'
                v-hasPermi= { ['system:user:query'] }
                on-click={() => this.getDetail(scope.row.userId)}
              >查看</el-button>
            </div>
          }
        }
      ]
    }
  },
  methods: {
    // 获取列表数据
    getList (params) {
      params.deptId = this.listId
      return this.$api('users.list', params)
    },
    // 更新列表
    refreshData () {
      this.$store.commit('UPDATE_ALL_TABLE_DATA')
    },
    // 点击节点
    nodeClick (data) {
      this.listId = data.id
      this.listDeptName = data.label
      this.refreshData()
    },
    // 获取下级节点
    clickTree (tree) {
      const node = tree[0]
      const resolve = tree[1]
      let deptId
      if (node.level !== 0) {
        deptId = node.data.id
      }
      this.$api('depts.lazyTree', { deptId }).then(res => {
        resolve(res.data)
      })
    },
    // 根据企业名称查询企业树
    getDepts () {
      this.$api('depts.nameDepts', {
        deptName: this.deptWord,
        withHasChildren: true
      }).then(res => {
        if (res.code === 200) {
          this.treeData = res.data
          this.$refs.tree.$refs.orgTree.store.defaultExpandAll = true
        }
      })
    },
    // 员工类型匹配
    getUserType (type) {
      let typeText = ''
      switch (type) {
        case 1:
          typeText = '其他'
          break
        case 2:
          typeText = '专项'
          break
        case 3:
          typeText = '正式员工'
          break
      }
      return typeText
    },
    closeAdd () {
      this.currentId = ''
      this.listId = ''
      this.listDeptName = ''
    },
    // 查看详情
    getDetail (id) {
      this.currentId = id
      this.detailVisibile = true
    }
  }
}
</script>

<style lang="scss" scoped>
.users {
  display: flex;
  // margin: 16px;
  .left-content {
    width: 280px;
    margin-right: 18px;
    flex-shrink: 0;
    background-color: #fff;
    transition: .3s ease-in-out;
    .search-content {
      padding: 8px;
      .el-input {
        width: 90%;
      }
      .search-suffix {
        position: absolute;
        left: 230px;
        margin-top: 6px;
        cursor: pointer;
      }
    }
  }
  .right-content {
    flex: 1 0;
    overflow: hidden;
    ::v-deep .el-form-item__label {
      width: 80px;
    }
  }
}
</style>
