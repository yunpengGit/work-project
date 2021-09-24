<template>
  <div class="business app-container">
    <div v-show="leftShow" class="left-content">
      <div class="search-content">
        <el-input v-model="deptWord" placeholder="搜索企业名称" />
        <icon-svg
          slot="suffix"
          class="search-suffix"
          name="sousuo"
          @click.native="getDepts"
        />
        <i class="el-icon-d-arrow-left close-icon" @click="leftShow = false" />
      </div>
      <org-tree
        ref="tree"
        :tree-data="treeData"
        tree-node="id"
        @nodeClick="nodeClick(arguments)"
        @clickTree="clickTree(arguments)"
        @add="addOrg"
        @edit="upData"
        @cancel="cancel"
      />
    </div>
    <div class="right-content">
      <sp-table
        keys="quickSearch"
        :is-index="false"
        :table-cols="tableCols"
        :api="getList"
      >
        <div slot="handle" class="right-top">
          <i v-show="!leftShow" class="el-icon-d-arrow-left" @click="leftShow = true" />
          <el-button v-hasPermi="['system:business:add']" type="primary" @click="addOrg()">添加企业</el-button>
        </div>
      </sp-table>
    </div>
    <add
      v-if="addVisibile"
      :add-drawer.sync="addVisibile"
      :current-id="listId"
      :default-name="treeDeptName"
      :default-id="treeId"
      @submitSuccess="submitSuccess"
      @closeAdd="closeAdd"
    />
    <detail
      v-if="detailVisibile"
      :detail-drawer.sync="detailVisibile"
      :current-id="listId"
      @closeDetail="closeAdd"
    />
  </div>
</template>

<script>
import iconSvg from '@/components/icon-svg'
import orgTree from './OrgTree/index'
import add from './add'
import detail from './detail'
import Params from '@/components/utils/router-params'
export default {
  components: { iconSvg, orgTree, add, detail },
  data () {
    return {
      // 企业树数据
      treeData: [],
      // 树结构搜索关键词
      deptWord: '',
      // 当前点击企业树节点id和名称
      treeId: '',
      treeDeptName: '',
      // 当前操作树节点的父级id
      treeParent: '',
      // 当前操作列表项id
      listId: '',
      // 是否为第一次加载树
      isFirst: true,
      // 根节点node和resolve方法
      node: null,
      resolve: null,
      // 企业树显示与否
      leftShow: true,
      addVisibile: false,
      detailVisibile: false,
      tableCols: [
        {
          label: '单位中文全称', prop: 'deptName', showOverflowTooltip: true
        },
        {
          label: '单位中文简称', prop: 'shortName', showOverflowTooltip: true
        },
        // {
        //   label: '企业管理员', prop: 'leader'
        // },
        {
          label: '军工行业代号', prop: 'militaryIndustryCode', showOverflowTooltip: true
        },
        {
          label: '企业类型', template: scope => {
            return this.getOrgType(scope.row.enterpriseType)
          }
        },
        {
          label: '操作', template: scope => {
            return <div>
              <el-button
                type='text'
                v-hasPermi={ ['system:business:query'] }
                on-click={() => this.getDetail(scope.row.deptId)}
              >查看</el-button>
              <el-button
                type='text'
                v-hasPermi= { ['system:business:edit'] }
                on-click={() => this.upData(scope.row)}
              >编辑</el-button>
              <el-button
                type='text'
                v-hasPermi={ ['system:business:remove'] }
                on-click={() => this.cancel(scope.row)}
              >注销</el-button>
            </div>
          }
        }
      ]
    }
  },
  methods: {
    // 获取列表数据
    getList (params) {
      params.parentId = this.treeId
      return this.$api('business.orgList', params)
    },
    // 更新列表
    refreshData () {
      this.$store.commit('UPDATE_ALL_TABLE_DATA')
    },
    // 点击节点
    nodeClick (dataNode) {
      const data = dataNode[0]
      const node = dataNode[1]
      this.treeId = data.id
      this.treeDeptName = data.label
      this.treeParent = node.parent
      const params = new Params('P')
      const parsedParams = params.parse(this.$route.query)
      if (parsedParams) {
        parsedParams.pageNum = 1
        const bbb = params.componentization(parsedParams)
        this.$router.push({
          query: {
            ...bbb
          }
        })
      }
      this.refreshData()
    },
    // 获取下级节点
    clickTree (tree) {
      const node = tree[0]
      const resolve = tree[1]
      if (this.isFirst) {
        this.node = tree[0]
        this.resolve = tree[1]
      }
      this.isFirst = false
      let deptId
      if (node.level !== 0) {
        deptId = node.data.id
      }
      this.$api('business.orgTree', { deptId }).then(res => {
        resolve(res.data)
      })
    },
    // 匹配企业类型
    getOrgType (type) {
      let typeText = ''
      switch (type) {
        case 10:
          typeText = '直属企业'
          break
        case 20:
          typeText = '直属业务单位'
          break
        case 30:
          typeText = '集团总部'
          break
        case 40:
          typeText = '直管功能单位'
          break
        case 50:
          typeText = '成员单位'
          break
        case 60:
          typeText = '所属控股单位'
          break
        case 70:
          typeText = '所属参股单位'
          break
      }
      return typeText
    },
    // 根据企业名称查询企业树
    getDepts () {
      this.$api('business.nameDepts', {
        quickSearch: this.deptWord,
        withHasChildren: true
      }).then(res => {
        if (res.code === 200) {
          this.treeData = res.data
          this.$refs.tree.$refs.orgTree.store.defaultExpandAll = true
        }
      })
    },
    refreshNode (id) {
      this.node.childNodes = [] // 这里把子节点清空，是因为再次调用 loadNode 的时候会往 childNodes 里 push 节点，所以会有节点重复的情况。
      this.clickTree([this.node, this.resolve])
      if (id) {
        const node = this.$refs.tree.$refs.orgTree.getNode(id)
        node.loaded = false
        node.isLeaf = false
        node.expand()
      }
      // else {
      //   this.node.childNodes = [] // 这里把子节点清空，是因为再次调用 loadNode 的时候会往 childNodes 里 push 节点，所以会有节点重复的情况。
      //   this.clickTree([this.node, this.resolve])
      // }
    },
    // 新增
    addOrg (val) {
      if (val) {
        this.treeId = val.id
        this.treeDeptName = val.label
      }
      this.listId = ''
      this.addVisibile = true
      // this.refreshNode()
    },
    // 新增成功
    submitSuccess (val) {
      this.$message.success('操作成功')
      this.addVisibile = false
      this.refreshData()
      const id = val === '0' ? '' : val
      this.refreshNode(id)
    },
    // 删除
    cancel (data) {
      const deptName = data.deptName || data.label
      const deptId = data.deptId || data.id
      this.$confirm(`确定注销${deptName}吗？`, '注销确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showInput: true,
        inputType: 'textarea',
        inputPlaceholder: '请填写注销原因（选填）'
      }).then(({ value }) => {
        this.$api('business.cancelOrg', {
          deptId,
          delRemark: value
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('注销成功')
            // 如果当前删除的树节点为树被选中的节点，删除完成后要更新其父节点并且表格更新为父节点
            if (this.treeId === deptId) {
              // 若当前删除的为根节点则没有父节点，这时将id置为-1
              const pId = this.treeParent.data.id
              this.treeId = pId
              this.refreshNode(pId, deptId)
              this.treeParent = this.treeParent.parent
            } else {
              this.refreshNode(this.treeId)
            }
            this.refreshData()
          }
        })
      }).catch(() => {})
    },
    // 编辑
    upData (data) {
      this.listId = data.id || data.deptId
      this.addVisibile = true
    },
    closeAdd () {
      this.listId = ''
    },
    // 查看详情
    getDetail (id) {
      this.listId = id
      this.detailVisibile = true
    }
  }
}
</script>

<style lang="scss" scoped>
.business {
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
      .close-icon {
        margin-left: 6px;
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
  .right-content {
    flex: 1 0;
    overflow: hidden;
    .right-top {
      i {
        margin-right: 8px;
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
}
</style>
