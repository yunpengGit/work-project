<template>
    <div class="content">
      <div class="left" v-show="treeCircle">
        <a-input-search style="margin-bottom: 8px"  @search="onChangeTreeSearch"/>
        <a-tree :showLine="true" :tree-data="treeData" :load-data="onLoadData"
          :expanded-keys="expandedKeys"
          :auto-expand-parent="autoExpandParent"
          @select="selectedTreeAuthority"
          @expand="onExpand"
          :replaceFields="{title:'name', key:'id'}"
        >
          <div slot="name" slot-scope="{ name }">
            <span v-if="name.indexOf(searchValue) > -1">
              {{ name.substr(0, name.indexOf(searchValue)) }}
              <span style="color: #f50">{{ searchValue }}</span>
              {{ name.substr(name.indexOf(searchValue) + searchValue.length) }}
            </span>
            <span v-else>{{ name }}</span>
          </div>
        </a-tree>
      </div>
      <a-icon :class="treeCircle?'treeCircle':'treeNone'" :type="treeCircle?'left-circle':'right-circle'" theme="filled" :style="{fontSize:'20px'}" @click="()=> treeCircle = !treeCircle" />
      <div class="right">
        <a-tabs default-active-key="1" :animated="false" v-model="activeTab">
          <a-tab-pane key="1" tab="企业管理"></a-tab-pane>
          <a-tab-pane key="2" tab="部门管理"></a-tab-pane>
          <a-tab-pane key="3" tab="员工管理"></a-tab-pane>
          <a-tab-pane key="4" tab="职级管理"></a-tab-pane>
          <a-tab-pane key="5" tab="成本中心管理"></a-tab-pane>
          <a-tab-pane key="6" tab="开票信息管理"></a-tab-pane>
          <a-tab-pane key="7" tab="企业设置"></a-tab-pane>
        </a-tabs>
        <business :treeSelected=treeSelected  v-if="activeTab==1 && (Object.keys(treeSelected)).length != 0" />
        <department :treeSelected=treeSelected  v-if="activeTab==2 && (Object.keys(treeSelected)).length != 0" />
        <staff :treeSelected=treeSelected  v-if="activeTab==3 && (Object.keys(treeSelected)).length != 0" />
        <rank :treeSelected=treeSelected  v-if="activeTab==4 && (Object.keys(treeSelected)).length != 0" />
        <CostCenterManagement :treeSelected=treeSelected  v-if="activeTab==5 && (Object.keys(treeSelected)).length != 0" />
        <billingIofo :treeSelected=treeSelected  v-if="activeTab==6 && (Object.keys(treeSelected)).length != 0" />
      </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { getCategoryListByParentId, getCategoryById } from '@/api/organizationManagement/corporateInfo'
import Business from './corporateInfoTab/Business'
import Department from './corporateInfoTab/Department'
import Staff from './corporateInfoTab/Staff'
import Rank from './corporateInfoTab/Rank'
import CostCenterManagement from './corporateInfoTab/CostCenterManagement'
import BillingIofo from './corporateInfoTab/BillingInfo'

import { Descriptions } from 'ant-design-vue'
Vue.use(Descriptions)
export default {
  name: 'corporateInfo',
  components: {
    Business,
    Department,
    Staff,
    Rank,
    CostCenterManagement,
    BillingIofo
  },
  data() {
    return {
      activeTab: '',
      treeCircle: true,
      treeData: [],
      dataList: [], // 用于树搜索的数据存储
      treeHide: true,
      loading: false,
      drawerTitle: '',
      expandedKeys: [0],
      autoExpandParent: true,
      searchValue: '',
      treeSelected: {},
      drawerVisible: false
    }
  },
  watch: {
    activeTab(active) {
    }
  },
  created() {
    this.activeTab = '1'
    this.getLimitgroupTree(0, '')
  },
  methods: {
    onLoadData(treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        getCategoryListByParentId({ parentId: treeNode.dataRef.id, type: 2 }).then(res => {
          if (res.code == '1000000') {
            treeNode.dataRef.children = JSON.parse(JSON.stringify(res.model))
          } else {
          // message.error(res.resultStr)
          }
        })
        setTimeout(() => {
          this.treeData = [...this.treeData]
          console.log(this.treeData)
          resolve()
        }, 200)
      })
    },
    getLimitgroupTree(parentId, likeName) {
      getCategoryListByParentId({ parentId: parentId, type: 2, likeName: likeName }).then(res => {
        if (res.code == '1000000') {
          this.treeData = JSON.parse(JSON.stringify(res.model))
        } else {
          // message.error(res.resultStr)
        }
      })
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onChangeTreeSearch(e) {
      const value = e
      if (e == '') {
        this.getLimitgroupTree(0, '')
        return false
      }
      // 搜过企业名称 likeName
      this.getLimitgroupTree('', value)
    },
    selectedTreeAuthority(selectedKeys) {
      this.treeSelected = {}
      if (selectedKeys.length == 0) {
        return false
      }
      getCategoryById({ id: selectedKeys[0] }).then(res => {
        if (res.code == '1000000') {
          this.treeSelected = JSON.parse(JSON.stringify(res.model))
        } else {
          // message.error(res.resultStr)
        }
      })
    },
    iconClickTreeHide() {
      this.treeHide = !this.treeHide
    },
    editShow(rowIndex) {
    },
    save() {
    }
  }
}
</script>

<style scoped lang="less">
.content{
  margin: -24px;
  display: flex;
  min-height: 100%;
  background: #f0f2f5;
  position: relative;
  .left{
    margin-right: 10px;
    width: 260px;
    flex-shrink: 0;
    overflow: hidden;
  }
  .right{
    flex: 1;
  }
  .left,.right{
    padding: 24px;
    background: rgb(255, 255, 255);
  }
  .treeCircle {
    position: absolute;
    left: 260px;
  }
  .treeNone {
    position: absolute;
    left: 0px;
  }
}
</style>
