<template>
  <div class="contacts">
    <div class="left-layout layout">
      <div class="tree-header">
        <el-input
          slot="reference"
          v-model="treeSearchValue"
          placeholder="全称/简称/代号"
          @click.native.stop="() => {}"
          @input="querySearchAsync"
        >
          <icon-svg
            slot="suffix"
            class="search-suffix"
            :name="treeSearchIcon"
            @click.native="suffixOnClick"
          />
        </el-input>
        <div v-if="showTreeSearchResult" class="search-result">
          <div v-if="treeSearchResult.length" class="search-list">
            <p class="search-total">
              共搜到
              <span class="height-light">
                {{ treeSearchResult.length }}
              </span>
              个企业
            </p>
            <p class="search-title">企业名称</p>
            <ul>
              <li
                v-for="item in treeSearchResult"
                :key="item.orgId"
                @click="handleSelect(item)"
                v-html="showSearchName(item)"
              />
            </ul>
          </div>
          <div v-else class="no-search-result">
            没有搜到您要查询的内容，换个搜索条件试试
          </div>
        </div>
      </div>
      <el-tree
        ref="orgTree"
        :style="'height:'+leftHeight"
        :data="tree"
        node-key="orgId"
        :load="getOrgTree"
        highlight-current
        :props="defaultProps"
        lazy
        :default-expanded-keys="expandedKeys"
        @node-click="handleNodeClick"
      />
    </div>
    <div class="right-layout">
      <div class="table-main layout">
        <div class="table">
          <sp-table keys="searchValue" :is-index="true" :table-cols="tableCols" :api="getUserList" @rowClick="tableRowOnClick" />
        </div>
      </div>
    </div>
    <el-drawer :visible.sync="showUserDrawer" size="640px" :with-header="false">
      <user-info :user="activeUser" @close="closeUserDrawer" />
    </el-drawer>

    <el-dialog v-if="authorityDialogVisible" :visible.sync="authorityDialogVisible" title="权限设置" class="authority-dialog">
      <el-form ref="authorityForm" :model="authorityForm" :rules="authorityFormRules">
        <el-form-item label="查看权限：" prop="viewPermsType">
          <el-select v-model="authorityForm.viewPermsType" placeholder="请选择">
            <el-option v-for="(item,index) in authorityOptions" :key="index" :label="item" :value="index" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="authorityDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSaveAuthority">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog v-if="privacyDialogVisible" :visible.sync="privacyDialogVisible" title="隐私级别" class="privacy-dialog">
      <el-form ref="privacyForm" :model="privacyForm" :rules="privacyFormRules">
        <el-form-item label="隐私级别：" prop="privacyLevel">
          <el-select v-model="privacyForm.privacyLevel" placeholder="请选择">
            <el-option v-for="item in privacyOption" :key="item" :label="item +`${!item ? '（高）':''}`" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="privacyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSavePrivacy">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import iconSvg from '@/components/icon-svg'
import UserInfo from './UserInfo'
import AuthCell from './AuthCell.vue'
// import EditOrDetail from './EditOrDetail'
import Params from '@/components/utils/router-params'

const emptyTexts = {
  default: '暂无数据',
  searchResult: '没有搜到您要查询的内容，换个搜索条件试试'
}
export default {
  components: {
    UserInfo,
    iconSvg,
    // eslint-disable-next-line vue/no-unused-components
    AuthCell
  },

  data () {
    return {
      leftHeight: '',
      tableCols: [],
      searchValue: '',
      treeSearchIcon: 'sousuo',
      showUserDrawer: false,
      activeUser: null,
      showTreeSearchResult: false,
      treeSearchValue: '',
      expandedKeys: [],
      treeSearchResult: [],
      tree: [],
      popperOptions: {
        boundariesElement: document.querySelector('.contacts')
      },
      emptyText: emptyTexts.default,
      userList: [],
      authorityDialogVisible: false,
      authorityForm: {
        viewPermsType: ''
      },
      privacyDialogVisible: false,
      privacyForm: {
        privacyLevel: ''
      },
      authorityFormRules: {
        viewPermsType: [
          { required: true, message: '请选择权限', trigger: 'blur' }
        ]
      },
      privacyFormRules: {
        privacyLevel: [
          { required: true, message: '请选择隐私级别', trigger: 'blur' }
        ]
      },
      authorityOptions: ['仅查看本企业通讯录', '查看本企业及下属企业通讯录'],
      privacyOption: [0, 1, 2, 3, 4],
      defaultProps: {
        children: 'children',
        isLeaf: (data) => !data.hasChildren,
        label: (data, node) => {
          const icons = new Map([[2, 'bumen'], [1, 'qiye']])
          const icon = icons.get(data.orgType)
          return (
            <span class='tree-item' title={data.orgNameShort || data.orgName}>
              <icon-svg name={icon} />
              {data.orgNameShort || data.orgName}（{data.employeeCount}）
            </span>
          )
        }
      }
    }
  },
  created () {
    this.formatTableCols()
    document.querySelector('body').addEventListener('click', this.closeTreeSearchResult)
    window.addEventListener('resize', this.leftHeightFn)
    this.leftHeightFn()
  },
  beforeDestroy () {
    document.querySelector('body').removeEventListener('click', this.closeTreeSearchResult)
  },
  methods: {
    leftHeightFn () {
      setTimeout(() => {
        const pageHeight = document.querySelector('.page-frame-content').clientHeight - 45
        this.leftHeight = pageHeight - 20 + 'px'
      }, 10)
    },
    suffixOnClick () {
      if (this.treeSearchIcon === 'qingkongshanchu') {
        this.treeSearchIcon = 'sousuo'
        this.treeSearchValue = ''
        this.showTreeSearchResult = false
        this.treeSearchResult = []
        this.$api('addrbook.orgTree').then((res) => {
          this.tree = res.data
        })
      } else if (!this.treeSearchValue) {
        this.$api('addrbook.orgTree').then((res) => {
          this.tree = res.data
        })
      }
    },
    showSearchName (item) {
      const name = item.orgNameShort || item.orgName
      const nameList = name.split(this.treeSearchValue)
      return nameList.length > 1
        ? nameList.join(
          `<span style="color: #ff543b;">${this.treeSearchValue}</span>`
        )
        : name
    },
    // 切换公司、部门
    handleNodeClick (data) {
      const params = new Params('P')
      const parsedParams = params.parse(this.$route.query)
      if (parsedParams) {
        parsedParams.pageNum = 1
        const bbb = params.componentization(parsedParams)
        this.$router.push({
          query: {
            ...this.$route.query,
            ...bbb
          }
        })
      }
      // 选择公司，列表不展示
      this.orgType = data.orgType
      // if (data.orgType === 1) {
      //   this.emptyText = emptyTexts.default
      //   this.$store.commit('UPDATE_ALL_TABLE_DATA')
      //   return
      // }
      this.$store.commit('UPDATE_ALL_TABLE_DATA')
    },
    getUserList (params) {
      const orgId = this.$refs.orgTree.getCurrentKey()
      if (!orgId || this.orgType === 1) {
        return new Promise((res, rej) => {
          res.rows = []
          res(res)
        })
      } else {
        return this.$api('addrbook.orgUserList', {
          orgId: orgId,
          ...params
        })
      }
    },
    closeUserDrawer () {
      this.showUserDrawer = false
    },
    tableRowOnClick (row) {
      this.activeUser = row
      this.showUserDrawer = true
    },
    // 组织树懒加载
    getOrgTree (node, resolve) {
      let parentId
      if (node.level !== 0) {
        parentId = node.data.orgId
      }
      this.$api('addrbook.orgTree', {
        parentId
      }).then((res) => {
        if (!node.level && res.data.length) {
          this.expandedKeys = [res.data[0].orgId]
        }
        resolve(res.data)
      })
    },
    // 组织树搜索查询
    querySearchAsync (searchValue) {
      if (!searchValue) {
        this.showTreeSearchResult = false
        this.treeSearchIcon = 'sousuo'
        return
      }
      this.treeSearchIcon = 'qingkongshanchu'
      this.$api('addrbook.searchOrgTree', { searchValue }).then((res) => {
        this.treeSearchResult = res.data
        this.showTreeSearchResult = true
      })
    },
    // 组织树搜索确认
    handleSelect (item) {
      this.tree = [item]
      this.showTreeSearchResult = false
      this.$nextTick(() => {
        this.$refs.orgTree.setCurrentKey(item.companyId)
      })
      this.$store.commit('UPDATE_ALL_TABLE_DATA')
    },
    closeTreeSearchResult () {
      this.showTreeSearchResult = false
    },
    setAuthority (e, row) {
      this.authorityForm.viewPermsType = row.addrbookViewPermsType
      this.authorityDialogVisible = true
      this.activeUser = row
      e.stopPropagation()
    },
    setPrivacy (e, row) {
      // type === 3 正式员工0～3； type !== 3 非正式员工 2～4
      this.privacyOption = row.type === 3 ? [0, 1, 2, 3] : [2, 3, 4]
      this.privacyForm.privacyLevel = row.privacyLevel
      this.privacyDialogVisible = true
      this.activeUser = row
      e.stopPropagation()
    },
    onSaveAuthority () {
      this.$refs['authorityForm'].validate((valid) => {
        if (valid) {
          this.$api('addrbook.setAuthority',
            { userId: this.activeUser.userId,
              viewPermsType: this.authorityForm.viewPermsType })
            .then(() => {
              this.$message.success('设置成功')
              this.authorityDialogVisible = false
              this.$store.commit('UPDATE_ALL_TABLE_DATA')
            }).catch(() => {
              this.$message.error('设置失败，请稍后再试')
            })
        } else {
          return false
        }
      })
    },
    onSavePrivacy () {
      this.$refs['privacyForm'].validate((valid) => {
        if (valid) {
          this.$api('addrbook.setPrivacy',
            { userId: this.activeUser.userId,
              privacyLevel: `${this.privacyForm.privacyLevel}` })
            .then(() => {
              this.$message.success('设置成功')
              this.privacyDialogVisible = false
              this.$store.commit('UPDATE_ALL_TABLE_DATA')
            }).catch(() => {
              this.$message.error('设置失败，请稍后再试')
            })
        } else {
          return false
        }
      })
    },
    formatTableCols () {
      this.tableCols = [
        { label: '姓名', prop: 'nickName', width: '120' },
        { label: '部门',
          template: scope => scope.row.companyDepts.map((t) => t.orgName).join('/') || '--'
        }, {
          label: '职务', prop: 'positionDesc',
          template: scope => {
            return <auth-cell scope={scope} />
          }
        }, {
          label: '手机', prop: 'mobile', width: '120',
          template: scope => {
            return <auth-cell scope={scope} />
          }
        }, {
          label: '座机', prop: 'officePhone', width: '120',
          template: scope => {
            return <auth-cell scope={scope} />
          }
        }, {
          label: '邮箱', prop: 'email',
          template: scope => {
            return <auth-cell scope={scope} />
          }
        }, {
          label: '办公房间', prop: 'officeAddress',
          template: scope => {
            return <auth-cell scope={scope} />
          }
        }, {
          label: '操作', width: '160',
          template: scope => {
            return <div>
              <el-button type='text' on-click={($event) => this.setAuthority($event, scope.row)}>权限设置</el-button>
              <el-button type='text' on-click={($event) => this.setPrivacy($event, scope.row)}>隐私级别</el-button>
            </div>
          }
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.contacts {
  display: flex;
  margin: 0 16px;
  .tree-header {
    display: flex;
    align-items: center;
    position: relative;
    padding: 0 16px;
    height: 44px;
    border-bottom: 1px solid rgba(25, 31, 36, 0.12);

    & > span,
    .el-autocomplete {
      width: 100%;
    }

    .search-suffix {
      margin-top: 6px;
      cursor: pointer;
    }
    .search-result {
      position: absolute;
      width: 248px;
      box-shadow: 0px 4px 16px 0px rgba(25, 31, 36, 0.16);
      border-radius: 4px;
      z-index: 101;
      top: 38px;
      background: #fff;
      .search-list {
        .search-total {
          font-size: 12px;
          color: rgba(25, 31, 36, 0.48);
          background: #fff;
          line-height: 16px;
          padding: 16px 10px;
          .height-light {
            color: #ff543b;
          }
        }
        .search-title {
          font-size: 14px;
          font-weight: bold;
          color: #191f24;
          line-height: 19px;
          margin-bottom: 8px;
          padding: 0 10px;
        }
        li {
          font-size: 14px;
          color: rgba(25, 31, 36, 0.88);
          line-height: 36px;
          padding: 0 10px;
          cursor: pointer;
          &:hover {
            background: #f6f6f6;
          }
        }
      }
      .no-search-result {
        padding: 16px 10px;
        font-size: 12px;
        color: rgba(25, 31, 36, 0.48);
        line-height: 20px;
      }
    }
  }
  .left-layout {
    width: 280px;
    margin-right: 16px;
    flex-grow: 0;
    flex-shrink: 0;
  }
  .right-layout {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    flex-shrink: 1;
    .table-filters {
      height: 64px;
      flex-grow: 0;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      padding: 0 16px;
      .input-lable {
        font-size: 14px;
        color: rgba(25, 31, 36, 0.64);
        line-height: 18px;
        margin-right: 8px;
      }
      .placeholder-tag {
        flex-grow: 1;
        flex-shrink: 1;
      }
    }
    .table-main {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      flex-shrink: 1;
      overflow: hidden;
      .table {
        flex-grow: 1;
        flex-shrink: 1;
        overflow: auto;
      }
      .pagination {
        display: flex;
        align-items: center;
        height: 56px;
        border-top: 1px solid #ebeef5;
        padding: 0 16px;
        flex-grow: 0;
        flex-shrink: 0;
      }
    }
  }
}

.layout {
  background: #ffffff;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
  border-radius: 4px;
}
::v-deep .authority-dialog {
  .el-dialog {
    width: 420px;
  }
  .el-input__inner {
    width: 260px;
  }
  .el-form-item__label {
    width: 110px;
  }
}

::v-deep .privacy-dialog {
  .el-dialog {
    width: 330px;
  }
  .el-input__inner {
    width: 150px;
  }
  .el-form-item__label {
    width: 110px;
  }
}

</style>

<style lang="scss">
// element-ui组件样式覆盖，zmzh调整好后再删去
.contacts {
  .table-filters {
    .el-input {
      width: 194px;
    }
    .el-button {
      width: 64px;
      &.el-button--primary {
        background: #1e89ff;
      }
    }
  }

  // 组织树
  .el-tree {
    overflow: auto;
    .tree-item {
      [class*=" el-icon-"],
      [class^="el-icon-"] {
        color: #1e89ff;
        margin-right: 12px;
      }
    }
    .el-tree-node__content > .el-tree-node__expand-icon {
      padding: 6px 12px;
    }
    .el-tree-node__content {
      height: 40px;
    }
    .el-tree-node__label {
      flex-grow: 1;
      flex-shrink: 1;
      overflow: hidden;
      text-align: left;
      span {
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
      }
    }
  }

  // 表格
  .table {
    .el-table th > .cell {
      font-size: 14px;
      font-weight: bold;
      color: rgba(16, 32, 39, 0.48);
    }
    .el-table .cell {
      font-size: 14px;
      color: rgba(11, 32, 39, 0.88);
      span {
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
      }
    }
    .el-table__body .el-table__row {
      cursor: pointer;
    }
  }

  // 分页
  .pagination .el-pagination {
    display: flex;
    width: 100%;
    .el-pagination__total {
      flex-grow: 1;
      text-align: left;
    }
  }
}
</style>
