<template>
  <a-layout>
    <a-layout-sider v-if="!isClose">
      <div class="left" v-if="TreeSearch">
        <slot name='left' v-if="!isClose"></slot>
        <div>
          <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="searchTree" />
          <a-tree
            :auto-expand-parent="autoExpandParent"
            show-icon
            :tree-data="gData"
            class="draggable-tree"
            :default-expanded-keys="expandedKeys"
            draggable
            @dragenter="onDragEnter"
            @drop="onDrop"
            @select="nodeSelect"
          >
            <icon-font slot="company" type="company" class="tree-icon"/>
            <template slot="title" slot-scope="{ title }">
              <span v-if="title.indexOf(searchValue) > -1">
                {{ title.substr(0, title.indexOf(searchValue)) }}
                <span style="color: #40a9ff">{{ searchValue }}</span>
                {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else>{{ title }}</span>
            </template>
          </a-tree>
        </div>
      </div>
    </a-layout-sider>
    <a-layout-content>
      <a-icon :type="iconType" class="icon" @click="LeftToggle"/>
      <div class="right">
        <div class="page-menu-tabs" v-if="tabs && tabs.items">
        <!-- @change="callback" :activeKey="activeKey" -->
          <a-tabs :tabBarStyle="{margin: 0}" :activeKey="tabs.active()" @change="tabs.callback">
            <a-tab-pane v-for="item in tabs.items" :tab="item.title" :key="item.key"></a-tab-pane>
          </a-tabs>
        </div>
        <div class="content">
          <div class="page-header-index-wide">
            <slot>
              <!-- keep-alive  -->
              <keep-alive>
                <router-view ref="content" />
              </keep-alive>
            </slot>
          </div>
        </div>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { getListByParams } from '@/api/supplier/domesticTicketServiceSettings.js'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('supplier')
// import { mapState, mapActions } from 'vuex'
const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}

export default {
  name: 'LeftAndRightColumns',
  data () {
    return {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: false,
      gData: [],
      treeDataList: [],
      iconType: 'left-circle',
      isClose: false,
      TreeSearch: false,
      tabs: {}
    }
  },
  mounted () {
    this.getTreeData()
    this.getPageMeta()
  },
  updated () {
    this.getPageMeta()
  },
  computed: {
    // ...mapState('supplier', ['company'])
    // ...mapState({ company: state => state.supplier.company })
    ...mapState(['company'])
  },
  methods: {
    // ...mapActions('supplier', ['setCompany']),
    // ...mapActions(['supplier/setCompany']),
    ...mapActions(['setCompany']),
    getTreeData() {
      const data = {
        code: '1001'
      }
      getListByParams(data).then((res) => {
        if (res.model.length > 0) {
          this.gData = res.model.map(item => {
            item.key = item.id
            item.title = item.name
            item.scopedSlots = { title: 'title' }
            item.slots = { icon: 'company' }
            return item
          })
        }
        this.getTreeDataList()
      })
    },
    getTreeDataList() {
      const generateList = data => {
        for (let i = 0; i < data.length; i++) {
          const node = data[i]
          const key = node.key
          this.treeDataList.push({ key, title: node.title })
          if (node.children) {
            generateList(node.children)
          }
        }
      }
      generateList(this.gData)
    },
    callback(key) {
      console.log(key)
    },
    LeftToggle() {
      this.isClose = !this.isClose
      if (this.iconType === 'left-circle') {
        this.iconType = 'right-circle'
      } else {
        this.iconType = 'left-circle'
      }
    },
    getPageMeta () {
      // eslint-disable-next-line
      this.pageTitle = (typeof(this.title) === 'string' || !this.title) ? this.title : this.$route.meta.title

      const content = this.$refs.content
      if (content) {
        if (content.pageMeta) {
          Object.assign(this, content.pageMeta)
        } else {
          this.tabs = content.tabs
          this.TreeSearch = content.TreeSearch
        }
      }
    },
    searchTree(e) {
      const value = e.target.value
      const expandedKeys = this.treeDataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, this.gData)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
    },
    nodeSelect(selectedKeys, e) {
      // selectedKeys, e:{selected: bool, selectedNodes, node, event}
      if (e.selectedNodes[0] && e.selectedNodes[0].data) {
        // console.log(e.selectedNodes[0].data.props)
        // this['supplier/setCompany'](e.selectedNodes[0].data.props)
        if (this.company.id !== e.selectedNodes[0].data.props.id) {
          this.$router.push('/supplier/layout/orderSettings')
        }
        this.setCompany(e.selectedNodes[0].data.props)
        // console.log(this.company)
      }
    },
    onDragEnter(info) {
      console.log(info)
      // expandedKeys 需要受控时设置
      // this.expandedKeys = info.expandedKeys
    },
    onDrop(info) {
      console.log(info)
      const dropKey = info.node.eventKey
      const dragKey = info.dragNode.eventKey
      const dropPos = info.node.pos.split('-')
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
      const loop = (data, key, callback) => {
        data.forEach((item, index, arr) => {
          if (item.key === key) {
            return callback(item, index, arr)
          }
          if (item.children) {
            return loop(item.children, key, callback)
          }
        })
      }
      const data = [...this.gData]

      // Find dragObject
      let dragObj
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1)
        dragObj = item
      })
      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, item => {
          item.children = item.children || []
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.push(dragObj)
        })
      } else if (
        (info.node.children || []).length > 0 && // Has children
        info.node.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, item => {
          item.children = item.children || []
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.unshift(dragObj)
        })
      } else {
        let ar
        let i
        loop(data, dropKey, (item, index, arr) => {
          ar = arr
          i = index
        })
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj)
        } else {
          ar.splice(i + 1, 0, dragObj)
        }
      }
      this.gData = data
    }
  }
}
</script>
<style scoped lang="less">
.tree-icon{
  font-size: 20px;
}
.ant-layout-sider,
.ant-layout-content{
  background-color: #fff;
}
.ant-layout-content{
  padding-left: 10px;
  width: 100%;
}
// .box{
//   height: 100%;
//   width: 100%;
//   display: flex;
//   .left{
//     position: relative;
//     min-height: 100%;
//     margin-right: 16px;
//     .icon{
//       border-radius: 50%;
//       font-size: 16px;
//       position: absolute;
//       top: 8px;
//       right: -20px;
//     }
//   }
//   .is-close{
//     width: 1px;
//     padding: 0;
//     margin-right: 0;
//   }
//   .right{
//     flex: 1;
//     background-color: #fff;
//   }
// }
</style>
