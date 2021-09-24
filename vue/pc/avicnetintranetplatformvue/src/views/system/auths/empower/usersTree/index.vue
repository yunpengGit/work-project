<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-04-09 11:07:47
 * @LastEditors: caofeng
 * @LastEditTime: 2021-08-25 17:59:24
-->
<template>
  <div class="auth-users-tree">
    <el-tree
      ref="tree"
      node-key="customKey"
      show-checkbox
      lazy
      :load="getOrgTree"
      :data="usersTreeData"
      :empty-text="emptyText"
      :default-expand-all="false"
      :highlight-current="true"
      :props="defaultProps"
      :check-strictly="true"
      @check-change="checkChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    // 选中的数据集合
    selectedUsersData: {
      type: Array,
      default: () => []
    },
    // 渲染tree的数据
    usersTreeData: {
      type: Array,
      default: () => []
    },
    // tree未加载出来或者内容为空时候展示的文本
    emptyText: {
      type: String,
      default: ''
    },
    roleId: {
      type: String,
      default: ''
    },
    authorizedUsersData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: function (data, node) {
          return data.hasUsers ? false : !(data.children && data.children.length)
        }
      },
      // 已经授权的人的userId
      filterUserId: []
    }
  },
  watch: {
    // 检测选中的数据变化，根据选中数据来决定tree的选中与否
    selectedUsersData (newVal) {
      const checkedKeys = []
      newVal.map(ele => {
        if (ele.customKey !== undefined) {
          checkedKeys.push(ele.customKey)
        }
      })
      this.filterUserId.map(ele => {
        if (ele !== undefined) {
          checkedKeys.push(ele)
        }
      })
      this.$refs.tree.setCheckedKeys(checkedKeys)
    }
  },
  methods: {
    // 递归数据
    recursionGet (valueId, nodes) {
      let value = null
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === valueId) {
          value = nodes[i].children
          break
        }
        if (nodes[i].children instanceof Array && nodes[i].children.length > 0) {
          const text = this.recursionGet(valueId, nodes[i].children)
          if (text) {
            return text
          }
        }
      }
      return value
    },
    // 点击箭头
    getOrgTree (node, resolve) {
      if (node.level !== 0) {
        const id = node.data.id
        const data = this.usersTreeData
        if (node.data.userId) {
          resolve([])
        } else {
          const loadingData = this.recursionGet(id, data)
          if (!loadingData.length) {
            if (node.data.hasUsers) {
              this.$api('auths.getGivenRole', {
                roleId: this.roleId,
                deptId: node.data.id,
                ancestorSeparator: '>'
              }).then(res => {
                for (let i = 0; i < res.data.length; i++) {
                  res.data[i].label = res.data[i].userName
                  res.data[i].customKey = `${res.data[i].userId}${res.data[i].ancestorsNames}`
                  const filterUserId = this.authorizedUsersData.find(ele => {
                    return ele.userId === res.data[i].userId
                  })
                  if (filterUserId) {
                    res.data[i].disabled = true
                    if (this.filterUserId.indexOf(res.data[i].customKey) === -1) {
                      this.filterUserId.push(res.data[i].customKey)
                    }
                  }
                }
                const checkedKeys = []
                this.selectedUsersData.map(ele => {
                  if (ele.customKey !== undefined) {
                    checkedKeys.push(ele.customKey)
                  }
                })
                this.$refs.tree.setCheckedKeys(this.filterUserId.concat(checkedKeys))
                if (res.code === 200) {
                  resolve(res.data)
                }
              })
            } else {
              resolve(loadingData)
            }
          } else {
            resolve(loadingData)
          }
        }
      }
    },
    // 节点选中状态发生变化时的回调
    checkChange (nodes, isSelect) {
      if (nodes.userId) {
        if (isSelect) {
          this.$emit('addBilateralData', nodes)
        } else {
          this.$emit('delBilateralData', nodes)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.auth-users-tree::v-deep {
  .el-tree-node__label {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
