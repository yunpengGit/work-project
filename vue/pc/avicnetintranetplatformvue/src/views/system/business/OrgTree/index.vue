<template>
  <el-tree
    ref="orgTree"
    class="org-tree"
    :data="treeData"
    :node-key="treeNode"
    :load="getOrgTree"
    highlight-current
    :props="defaultProps"
    :expand-on-click-node="false"
    lazy
    @node-click="handleNodeClick"
  >
    <span
      slot-scope="{ node, data }"
      class="custom-tree-node"
      @mouseenter="mouseenter(node, data)"
      @mouseleave="mouseleave(node, data)"
    >
      <span class="tree-label">
        <span
          :title="data.label"
          class="treeNodeStyle"
        >{{ data.label }}
        </span>
        <div v-if="needAction" v-show="mouseId === data.id" class="tree-action">
          <i
            v-hasPermi="[`${permiText}:add`]"
            class="el-icon-plus tree-icon"
            title="添加"
            @click.stop="add(data)"
          />
          <i
            v-hasPermi="[`${permiText}:edit`]"
            class="el-icon-edit-outline tree-icon"
            title="编辑"
            @click.stop="edit(data)"
          />
          <i
            v-hasPermi="[`${permiText}:remove`]"
            class="el-icon-delete tree-icon"
            title="删除"
            @click.stop="cancel(data)"
          />
        </div>
      </span>
    </span>
  </el-tree>
</template>

<script>
export default {
  name: 'OrganizeTree',
  props: {
    treeData: {
      type: Array,
      default: () => []
    },
    // node-key的值
    treeNode: {
      type: String,
      default: ''
    },
    // 权限前缀
    permiText: {
      type: String,
      default: 'system:business'
    },
    // 树结构是否可操作
    needAction: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      mouseId: '',
      defaultProps: {
        children: 'children',
        isLeaf: (data) => !data.hasChildren
      }
    }
  },
  methods: {
    // 获取子节点
    getOrgTree (node, resolve) {
      this.$emit('clickTree', node, resolve)
    },
    // 点击节点
    handleNodeClick (data, node) {
      this.$emit('nodeClick', data, node)
    },
    // 树节点鼠标移入移出
    mouseenter (node, data) {
      this.mouseId = data.id
    },
    mouseleave (node, data) {
      this.mouseId = ''
    },
    // 新增
    add (data) {
      this.$emit('add', data)
    },
    // 编辑
    edit (data) {
      this.$emit('edit', data)
    },
    // 删除
    cancel (data) {
      this.$emit('cancel', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.org-tree {
  overflow: auto;
  height: calc(100% - 48px);
}
.custom-tree-node {
  min-width: calc(100% - 24px);
  height: 100%;
  .tree-label {
    min-width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .treeNodeStyle {
      max-width: 180px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .tree-action {
        .tree-icon {
          margin-right: 5px;
          color: #1E89FF;
          cursor: pointer;
          &:last-child {
            margin-right: 12px;
          }
        }
    }
  }
}
</style>

<style lang="scss">
.org-tree {
  min-width: 100%;
  padding-right: 2px;
  .el-tree-node__label {
    min-width: 100%;
  }
  .el-tree-node {
    min-width: 100%;
  }
}
</style>
