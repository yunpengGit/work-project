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
    <div class="right" >
      <div>
        <a-tabs v-model="active">
          <a-tab-pane key="1" tab="原始账单">
            <div></div>
            <!-- <OriginalBill class="tabContent" v-if="treeSelected != ''" /> -->
          </a-tab-pane>
          <a-tab-pane key="2" tab="企业账单">
            <div></div>
            <!-- <BusinessBill class="tabContent"  v-if="treeSelected != ''" /> -->
          </a-tab-pane>
        </a-tabs>
         <router-view v-if="treeSelected != ''"/>
         <a-empty v-else description="请先选择供应商" style="padding: 16px;"/>
      </div>
    </div>
  </div>
</template>

<script>
import { getCategoryListByParentId } from '@/api/organizationManagement/corporateInfo'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('corporateairticket')
// import BusinessBill from './corporateAirTicket/businessBill'
// import OriginalBill from './corporateAirTicket/originalBill'

export default {
  name: 'corporateAirTicket',
  // components: {
  //   OriginalBill,
  //   BusinessBill
  // },
  data() {
    return {
      treeCircle: true,
      treeData: [],
      dataList: [], // 用于树搜索的数据存储
      treeHide: true,
      expandedKeys: [0],
      autoExpandParent: true,
      searchValue: '',
      treeSelected: '',
      active: '1'
    }
  },
  computed: {
    ...mapState(['company'])
  },
  created() {
    this.getLimitgroupTree(0, '')
    if (this.$route.path == '/organizationManagement/corporateAirTicket/businessBill') {
      this.active = '2'
    } else {
      this.active = '1'
    }
  },
  watch: {
    $route() {
      if (this.$route.path == '/organizationManagement/corporateAirTicket/businessBill') {
        this.active = '2'
      } else {
        this.active = '1'
      }
    },
    active(key, ole) {
      switch (key) {
        case '1':
          this.$router.push({
            path: '/organizationManagement/corporateAirTicket/originalBill'
          })
          break
        case '2':
          this.$router.push({
            path: '/organizationManagement/corporateAirTicket/businessBill'
          })
          break
        default:
          this.$router.push('/organizationManagement/corporateAirTicket')
      }
    }
  },
  methods: {
    ...mapActions(['setCompany']),
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
    selectedTreeAuthority(selectedKeys, e) {
      this.treeSelected = selectedKeys[0]
      if (selectedKeys.length == 0) {
        this.treeSelected = ''
        return false
      }
      this.setCompany(e.selectedNodes[0].data.props)
    },
    iconClickTreeHide() {
      this.treeHide = !this.treeHide
    }
  }
}
</script>

<style scoped lang="less">
.content{
  // margin: -24px;
  display: flex;
  min-height: 100%;
  background: #f0f2f5;
  position: relative;
  .left{
    margin-right: 10px;
    width: 240px;
    flex-shrink: 0;
    overflow: hidden;
    background: rgb(255, 255, 255);
    padding: 16px 16px 16px 0px;
  }
  .right{
    flex: 1;
    padding: 24px 0px 16px 16px;
    background: rgb(255, 255, 255);
  }
  // .left,.right{
  //   padding:24px;
  //   background: rgb(255, 255, 255);
  // }
  .treeCircle {
    position: absolute;
    left: 260px;
    top: 10px;
  }
  .treeNone {
    position: absolute;
    left: 26px;
  }
}
</style>
