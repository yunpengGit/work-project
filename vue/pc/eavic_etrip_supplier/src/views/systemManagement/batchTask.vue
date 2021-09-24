<template>
  <div class="batchTaskContent">
    <div class="left" v-show="treeCircle">
        <slot name='left'></slot>
        <div>
          <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="searchTree" />
          <a-tree
            :auto-expand-parent="autoExpandParent"
            show-icon
            :tree-data="gData"
            class="draggable-tree"
            :default-expanded-keys="expandedKeys"
            draggable
            :selectedKeys="defaultSelectedKeys"
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
      <a-icon :class="treeCircle?'treeCircle':'treeNone'" :type="treeCircle?'left-circle':'right-circle'" theme="filled" :style="{fontSize:'20px'}" @click="()=> treeCircle = !treeCircle" />
    <a-tabs class="right">
      <a-tab-pane tab="批量任务">
        <div v-if='showTab'>
          <div class="title">{{tabList}}/任务列表</div>
          <a-divider />
        <div class="table-page-search-wrapper">
          <a-form layout="inline" >
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-item label="任务ID">
                  <a-input
                    v-model="queryParam.id"
                    placeholder="请输入"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="任务类型">
                  <a-select v-model="queryParam.taskTypeCode">
                      <a-select-option value="">所以</a-select-option>
                      <a-select-option v-for="item in taskTypeList" :value='item.taskTypeCode' :key="item.id+'_1'">{{item.taskTypeName}}</a-select-option>
                    </a-select>
                </a-form-item>
              </a-col>
              <template>
                <a-col :md="8" :sm="24">
                  <a-form-item label="任务状态">
                    <a-select v-model="queryParam.state">
                      <a-select-option v-for="item in statusList" :value='item.id' :key="item.id">{{item.title}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </template>
              <a-col :md="24" :sm="24">
                <span class="table-page-search-submitButtons" :style="{ float: 'right', overflow: 'hidden' } ">
                  <a-button type="primary" html-type="submit" icon="search" @click="$refs.table.refreshFn(true)">
                      查询
                    </a-button>
                    <a-button @click="reset">
                      重置
                    </a-button>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <s-table
          ref="table"
          size="default"
          rowKey = "id"
          :columns="columns"
          :data="loadData"
          showPagination="auto"
          :scroll="{ x: 900}"
        >
          <template slot="num" slot-scope="text, record, index">
            <span>{{index + 1}}</span>
          </template>
          <template slot="id" slot-scope="text, record">
            <div class="btn">
              <span class="blueSpan" @click="detailFn(record)">{{record.id}}</span>
            </div>
          </template>
          <template slot="taskTypeCode" slot-scope="text, record">
            <span v-text="record.taskTypeCode!=null?(taskTypeList.filter((item)=>item.taskTypeCode == record.taskTypeCode))[0].taskTypeName:''"></span>
          </template>
          <template slot="operating" slot-scope="text, record">
            <div>
              <span v-if="record.state == 0">排队等待中请稍后</span>
              <span class="blueSpan" v-if="record.state == 1">进行中</span>
              <span class="redSpan" v-if="record.state == 3">异常退出</span>
              <span class="greenSpan" v-if="record.state == 2">已完成</span>
            </div>
          </template>
        </s-table>
        </div>
        <a-empty v-else description="请先选择供应商" style="padding: 16px;"/>
      </a-tab-pane>
    </a-tabs>
    <div></div>
    <a-drawer
      :title="drawerTitle"
      :width="890"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="drawerClose"
    >
      <a-form :label-col="{ span: 5 }"
      :wrapper-col="{ span: 15 }"
      >
        <a-form-item label="任务ID">
          <div>{{this.drawerForm.id}}</div>
        </a-form-item>
        <a-form-item label="任务类型">
          <div v-text="this.drawerForm.taskTypeCode!=null?(taskTypeList.filter((item)=>item.taskTypeCode == this.drawerForm.taskTypeCode))[0].taskTypeName:''"></div>
        </a-form-item>
        <a-form-item label="任务状态">
          <div>
              <span v-if="this.drawerForm.state == 0">任务排队等待中请稍后</span>
              <span class="blueSpan" v-if="this.drawerForm.state == 1">进行中</span>
              <span class="redSpan" v-if="this.drawerForm.state == 3">异常退出</span>
              <span class="greenSpan" v-if="this.drawerForm.state == 2">已完成</span>
          </div>
          <a-progress :percent="percentDeil.percent" :status="percentDeil.status" :format="percent => percentDeil.state ==1?(this.percentDeil.totalNum || 0) + '/' + (this.percentDeil.num || 0):'' ">
          </a-progress>
        </a-form-item>
        <a-form-item label="异常原因" v-if="this.drawerForm.state == 3">
          <div class="redSpan">{{this.drawerForm.errorMsg}}</div>
        </a-form-item>
        <a-form-item label="任务开始时间">
          <div>{{this.drawerForm.startTime}}</div>
        </a-form-item>
        <a-form-item label="任务结束时间" >
          <a-radio-group>
            <div>{{this.drawerForm.endTime}}</div>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="任务创建时上传的文件">
          <a :href="this.drawerForm.uploadFilePath">{{drawerForm.uploadFileName}}</a>
        </a-form-item>
        <a-form-item label="任务完成后生成的文件">
          <a :href="this.drawerForm.feedbackFilePath">{{drawerForm.feedbackFileName}}</a>
        </a-form-item>
        <a-form-item label="任务所属公司">
          <div>{{this.drawerForm.categoryName}}</div>
        </a-form-item>
        <a-form-item label="操作人">
          <span>{{this.drawerForm.createName}}</span>
          <a-icon type="history" :style="{padding: '0px 16px'}" />
          <span>{{this.drawerForm.createTime}}</span>
        </a-form-item>
        <a-form-item labelAlign="right">
          <a-button type="primary" @click="()=> visible = !visible">
            返回
          </a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script>
import Vue from 'vue'
import { USER_MODEL } from '@/store/mutation-types'
import { getListByParams } from '@/api/order/getCompany.js'
import { taskTypegetListByParams, getPageByParams, taskProgress } from '@/api/systemManagement/batchTask'

import { STable } from '@/components'
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
const columns = [
  {
    title: '序号',
    dataIndex: 'num',
    width: 60,
    scopedSlots: { customRender: 'num' }
  },
  {
    title: '任务ID',
    dataIndex: 'id',
    scopedSlots: { customRender: 'id' }

  },
  {
    title: '任务类型',
    dataIndex: 'taskTypeCode',
    scopedSlots: { customRender: 'taskTypeCode' }
  },
  {
    title: '开始时间',
    dataIndex: 'startTime'
  },
  {
    title: '结束时间',
    dataIndex: 'endTime'
  },
  {
    title: '企业',
    dataIndex: 'categoryName'
  },
  {
    title: '操作人',
    dataIndex: 'createName'
  },
  {
    title: '操作',
    dataIndex: 'operating',
    width: 160,
    scopedSlots: { customRender: 'operating' }
  }
]

export default {
  name: 'batchTask',
  components: {
    STable
  },
  data () {
    return {
      showTab: false,
      selectedKeysTreeCategoryId: '',
      treeCircle: true,
      drawerForm: {},
      tabList: '',
      queryParam: {},
      taskTypeList: [],
      statusList: [{
        id: '',
        title: '所有'
      }, {
        id: 0,
        title: '未处理'
      }, {
        id: 1,
        title: '处理中'
      }, {
        id: 2,
        title: '已处理'
      }, {
        id: 3,
        title: '处理异常'
      }],
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.queryParam.categoryId = this.showTab == true ? this.selectedKeysTreeCategoryId : ''
        return getPageByParams(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.model
          })
      },
      drawerTitle: '',
      visible: false,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: false,
      gData: [],
      treeDataList: [],
      iconType: 'left-circle',
      percentDeil: {},
      timer: '',
      defaultSelectedKeys: []
    }
  },
  async created() {
    await this.getTreeData()
    this.taskTypeListData()
    if (JSON.stringify(this.$route.query) != '{}') {
      this.queryParam.id = this.$route.query.taskId
      this.selectedKeysTreeCategoryId = this.$route.query.categoryId
      this.defaultSelectedKeys = []
      this.defaultSelectedKeys.push(this.$route.query.categoryId)
      this.tabList = ''
      this.showTab = true
      this.tabList = this.mapTreeName(this.gData)
    }
  },
  watch: {
    tabList(newVal, oldVal) {
      if (newVal == '') {
        this.showTab = false
      } else {
        this.showTab = true
      }
    }
  },
  methods: {
    reset() {
      this.queryParam = {}
      this.$refs.table.refreshFn()
    },
    detailFn(record) {
      this.drawerTitle = '详情'
      this.visible = true
      if (record.uploadFilePath) {
        const startStr = record.uploadFilePath.lastIndexOf('/')
        const endtStr = record.uploadFilePath.lastIndexOf('.xls')
        record.uploadFileName = record.uploadFilePath.substring(startStr + 1, endtStr) + '.xsl'
      }
      if (record.feedbackFilePath) {
        const startStrFeed = record.feedbackFilePath.lastIndexOf('/')
        const endtStrFeed = record.feedbackFilePath.lastIndexOf('.xls')
        record.feedbackFileName = record.feedbackFilePath.substring(startStrFeed + 1, endtStrFeed) + '.xsl'
      }
      this.drawerForm = record
      this.drawerInit(record.id)
      this.timer = setInterval(() => {
        this.drawerInit(record.id)
      }, 2000)
    },
    drawerInit(id) {
      taskProgress({ id: id }).then(res => {
        if (res.code == 1000000) {
          const statusNum = res.model.state
          this.percentDeil = {
            percent: (res.model.totalNum || 0) / (res.model.num || 0),
            totalNum: res.model.totalNum,
            num: res.model.num,
            state: res.model.state,
            status: statusNum == 1 ? 'active' : statusNum == 2 ? 'success' : statusNum == 3 ? 'exception' : 'normal'
          }
          this.drawerForm.state = res.model.state
          if (res.model.state == 3 || res.model.state == 2) {
            this.percentDeil.percent = 100
            clearInterval(this.timer)
          }
        }
      })
    },
    drawerClose() {
      this.visible = false
      clearInterval(this.timer)
    },
    async getTreeData() {
      const userModel = Vue.ls.get(USER_MODEL)
      const data = {
        code: '1001',
        supplierId: userModel.employee.supplierId
      }
      await getListByParams(data).then((res) => {
        if (res.model.length > 0) {
          this.gData = res.model.map(item => {
            item.key = item.categoryId
            item.title = item.categoryName
            item.scopedSlots = { title: 'title' }
            item.slots = { icon: 'company' }
            return item
          })
          this.gData.unshift({ key: '', title: '全部', slots: { icon: 'company' } })
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
    taskTypeListData() {
      taskTypegetListByParams({}).then(res => {
        if (res.code == 1000000) {
          this.taskTypeList = res.model
        }
      })
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
      this.defaultSelectedKeys = selectedKeys
      this.showTab = false
      if (e.selectedNodes[0] && e.selectedNodes[0].data) {
        if (e.selectedNodes[0].data.props.id || e.selectedNodes[0].data.props.title == '全部') {
          this.$nextTick(() => {
            this.tabList = e.selectedNodes[0].data.props.categoryName || e.selectedNodes[0].data.props.title + '企业'
            this.showTab = true
            this.selectedKeysTreeCategoryId = e.selectedNodes[0].data.props.categoryId
          })
        }
      }
    },
    mapTreeName(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].categoryId == this.selectedKeysTreeCategoryId) {
          return data[i].categoryName
        } else if (data[i].children) {
          this.mapTreeName(data[i].children)
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.batchTaskContent{
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
    z-index: 10;
  }
  .treeNone {
    position: absolute;
    left: 0px;
    z-index: 10;
  }
}
.btn {
  cursor: pointer;
}
.redSpan {
  color: rgb(255, 52, 52);
}
.greenSpan {
  color: rgb(41, 168, 0);
}
.blueSpan {
  color: rgb(1, 150, 250);
  padding-right: 6px;
}
</style>
