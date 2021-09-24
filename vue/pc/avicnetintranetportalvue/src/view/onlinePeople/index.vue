<template>
  <div class="online-people">
    <div class="left-layout layout">
      <el-tree
        ref="orgTree"
        :data="tree"
        node-key="orgId"
        :load="getOrgTree"
        highlight-current
        :props="defaultProps"
        lazy
        @node-click="handleNodeClick"
      />
    </div>
    <div class="right-layout">
      <div class="table-filters layout">
        <span class="input-lable">关键词：</span>
        <el-input v-model="searchValue" placeholder="请输入关键词" />
        <span class="placeholder-tag" />
        <el-button @click="onReset">重置</el-button>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </div>
      <div class="main-content layout">
        <div class="header">
          <span class="title">在线人员</span>
          <icon-svg name="shuaxin" @click.native="getUserList" />
        </div>
        <div v-if="userList.length" class="user-content">
          <el-collapse v-model="activeNames">
            <el-collapse-item v-for="org in userList" :key="org.orgId" :name="org.orgId">
              <template slot="title">
                <div class="title">
                  <icon-svg name="zhankai-biaodannei" /> {{ org.orgNameShort||org.orgName }}（{{ org.onlineUserCount }}）
                </div>
              </template>
              <ul class="user-list">
                <li v-for="user in org.onlineUserList" :key="user.userId">
                  <el-popover trigger="hover" width="259">
                    <div class="other-info">
                      <p>
                        <span>职务：</span>
                        <span>{{ user.position }}</span>
                      </p>
                      <p>
                        <span>座机电话：</span>
                        <span>{{ user.officePhone }}</span>
                      </p>
                    </div>
                    <div slot="reference" class="user-item">
                      <img :src="user.avatar" alt="">
                      <span>{{ user.nickName }}</span>
                    </div>
                  </el-popover>
                </li>
              </ul>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import iconSvg from '../../components/icon-svg.vue'
export default {
  components: { iconSvg },
  data () {
    return {
      searchValue: '',
      activeNames: [],
      tree: [],
      userList: [{
        orgNameShort: '1',
        onlineUserCount: 10,
        onlineUserList: [
          {
            avatar: '',
            nickName: '张三',
            position: '部长',
            officePhone: '0551-876901'
          }
        ]
      }],
      isInit: true,
      defaultProps: {
        children: 'children',
        isLeaf: (data) => !data.hasChildren,
        label: (data, node) => {
          const icons = new Map([
            [2, 'bumen'],
            [1, 'qiye']
          ])
          const icon = icons.get(data.orgType)
          return (
            <span class='tree-item' title={data.orgNameShort || data.orgName}>
              <icon-svg name={icon} />
              {data.orgNameShort || data.orgName}（{data.onlineUserCount}）
            </span>
          )
        }
      }
    }
  },
  methods: {
    onReset () {
      this.searchValue = ''
    },
    onSearch () {
      this.getUserList()
    },
    getUserList () {
      const deptId = this.$refs.orgTree.getCurrentKey()
      const { searchValue } = this
      this.$api('onlinePeople.orgUser', {
        deptId,
        searchValue
      }).then(res => {
        this.userList = [res.data]
        this.activeNames = res.data.orgId
      })
    },
    // 组织树懒加载
    getOrgTree (node, resolve) {
      if (node.level === 0) {
        this.$api('onlinePeople.orgTopTree').then((res) => {
          resolve([res.data])
          this.$refs.orgTree.setCurrentKey(res.data.orgId)
          this.getUserList()
        })
      } else {
        const deptId = node.data.orgId
        this.$api('onlinePeople.orgTree', { deptId }).then((res) => {
          resolve(res.data)
        })
      }
    },
    // 切换公司、部门
    handleNodeClick (data) {
      this.getUserList()
    }
  }
}
</script>

<style lang="scss" scoped>
.other-info {
  p {
    display: flex;
    align-items: flex-start;
    font-size: 14px;
    line-height: 18px;
    &:not(:first-of-type) {
      margin-top: 16px;
    }
    span {
      &:first-of-type {
        flex-grow: 0;
        flex-shrink: 0;
        width: 85px;
        color: rgba(25, 31, 36, 0.64);
      }
      &:last-of-type {
        color: #191F24;
      }
    }
  }
}
.online-people {
  display: flex;
  .left-layout {
    width: 280px;
    margin-right: 16px;
    overflow: auto;
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
    .main-content {
      display: flex;
      flex-direction: column;
      margin-top: 16px;
      flex-grow: 1;
      flex-shrink: 1;
      overflow: hidden;
      .header {
        border-bottom: 1px solid #eef0f4;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        .icon {
          width: 24px;
          height: 24px;
          cursor: pointer;
        }
        .title {
          font-size: 14px;
          color: #181f25;
          line-height: 18px;
          display: flex;
          align-items: center;
          &::before {
            content: "";
            width: 4px;
            height: 14px;
            border-radius: 1px;
            background: #1e89ff;
            margin-right: 6px;
          }
        }
      }
      .user-content {
        padding: 12px 16px;
        .el-collapse {
          border: 1px solid #dadbdc;
          border-radius: 4px;
          overflow: hidden;
          .title {
            padding: 0 12px;
            font-size: 14px;
            color: #181f25;
            line-height: 18px;
            .icon {
              margin-right: 4px;
              transform: rotate(-90deg);
            }
          }
          .user-list {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            margin-top: -8px;
            li {
              width: 114px;
              font-size: 14px;
              color: #181F25;
              line-height: 18px;
              margin-top: 24px;
              .user-item {
                display: flex;
                align-items: center;
                &:hover {
                  color: #1E89FF;
                }
              }
            }
            img {
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: #eee;
              margin-right: 8px;
            }
          }
        }
      }
    }
  }
}

.layout {
  background: #ffffff;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
  border-radius: 4px;
}
</style>
<style lang="scss">
// element-ui组件样式覆盖，zmzh调整好后再删去
.online-people {
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

  .el-collapse-item__header {
    line-height: 42px;
    height: 42px;
    border-bottom: 1px solid #dadbdc;
    background: #f6f6f6;
    &.is-active .icon {
      transform: rotate(0deg) !important;
    }
    .el-icon-arrow-right {
      display: none;
    }
  }
  .el-collapse-item__content {
    padding: 0 16px 16px;
  }

  // 组织树
  .el-tree {
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
}
</style>
