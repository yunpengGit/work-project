<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline"
      >
        <a-row :gutter="48">
          <a-col  :md="8" :sm="24">
            <a-form-item label="部门">
              <a-tree-select
                v-model="queryParam.deptId"
                style="width: 100%"
                show-search
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="treeData"
                placeholder="请选择"
                tree-default-expand-all
              >
              </a-tree-select>
            </a-form-item>
          </a-col>
          <a-col  :md="8" :sm="24">
            <a-form-item label="是否启用">
              <a-select
                v-model="queryParam.enable"
                placeholder="请选择状态"
              >
                <a-select-option :value="1">
                  启用
                </a-select-option>
                <a-select-option :value="0">
                  未启用
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item>
              <a-button type="primary" html-type="submit" icon="search" @click="queryFn">
                查询
              </a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="tree-and-table">
      <div class="tree" v-if="showCostCenterTree">
        <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="searchCostCenterTree" />
        <a-tree
          :expanded-keys="expandedKeys"
          :auto-expand-parent="autoExpandParent"
          :tree-data="costCenterTreeData"
          @select="selectCostCenterTree"
          @expand="onExpand"
        >
          <template slot="title" slot-scope="{ title }">
            <span v-if="title.indexOf(searchValue) > -1">
              {{ title.substr(0, title.indexOf(searchValue)) }}
              <span style="color: #f50">{{ searchValue }}</span>
              {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
            </span>
            <span v-else>{{ title }}</span>
          </template>
        </a-tree>
      </div>
      <div class=table>
        <div class="title">成本中心列表</div>
        <div class="btn-box">
          <a-button type="primary" icon="plus" @click="addFn()">
            添加
          </a-button>
          <a-button type="danger" icon="delete" @click="deleteBatchFn" :disabled = "isDisableBtn">
            批量删除
          </a-button>
        </div>
        <a-table
          :columns="columns"
          rowKey="id"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :data-source="dataSource"
          showPagination="auto"
        >
          <template slot="name" slot-scope="text, record">
            <span @click="detailFn(record)" class="blue cursor">{{record.name}}</span>
          </template>
          <template slot="enable" slot-scope="text, record">
            <span :class="{'red': record.enable === 0,'green': record.enable === 1}">
              {{ record.enable === 1 ? '启用' : '禁用'}}
            </span>
          </template>
          <template slot="type" slot-scope="text, record">
            <span>
              {{ record.type === 1 ? '目录' : '子节点'}}
            </span>
          </template>
          <template slot="operating" slot-scope="text, record">
            <div class="btn">
              <!-- <span class="blue" @click="detailFn(record)"><a-icon type="profile"/>详情</span> -->
              <span class="blue" @click="editFn(record)"><a-icon type="edit"/>编辑</span>
              <a-popconfirm
                title="确定要删除吗?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="deleteFn(record)"
                class="red"
              >
                <a-icon type="delete"/>删除
              </a-popconfirm>
              <!-- <span class="red"  @click="deleteFn(record)"><a-icon type="delete"/>删除</span> -->
            </div>
          </template>
        </a-table>
      </div>
    </div>
    <a-drawer
      :title="drawerTitle"
      :width="890"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="drawerClose"
    >
       <detail-list v-if="isDetail" v-slot:list :col="1">
        <detail-list-item term="所属企业">{{detailData.companyName}}</detail-list-item>
        <detail-list-item term="所属部门">{{detailData.deptName}}</detail-list-item>
        <detail-list-item term="成本中心名称">{{detailData.name}}</detail-list-item>
        <detail-list-item term="成本中心编号">{{detailData.code}}</detail-list-item>
        <detail-list-item term="成本中心类型">{{detailData.type === 1 ? '目录' : '节点'}}</detail-list-item>
        <detail-list-item term="上级成本中心">{{detailData.parentName}}</detail-list-item>
        <detail-list-item term="起始时间">{{detailData.startTime}}</detail-list-item>
        <detail-list-item term="结束时间">{{detailData.endTime}}</detail-list-item>
        <detail-list-item term="预剩余金额">{{detailData.preresidueMoney}}</detail-list-item>
        <detail-list-item term="剩余金额">{{detailData.preresidueMoney}}</detail-list-item>
        <detail-list-item term="顺序号">{{detailData.order}}</detail-list-item>
        <detail-list-item term="是否启用">
          <span class="blue" v-if="detailData.enable === 1">启用</span>
          <span class="red" v-else-if="detailData.enable === 0">未启用</span>
        </detail-list-item>
      </detail-list>
      <a-form
        v-else
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 15 }"
        :form="drawerForm"
      >
        <a-form-item label="公司名称">
          <span>{{companyName}}</span>
        </a-form-item>
        <a-form-item label="所属部门">
          <a-tree-select
            v-decorator="['deptId', { rules: [{ required: true, message: '必填字段' }] }]"
            style="width: 100%"
            show-search
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            placeholder="请选择"
            tree-default-expand-all
            @change="drawerDeptIdChange"
          >
          </a-tree-select>
        </a-form-item>
        <a-form-item label="成本中心类型">
          <a-select
            v-decorator="['type', { rules: [{ required: true, message: '必填字段'}]}]"
            placeholder="请选择类型"
          >
            <a-select-option :value="1">
              目录
            </a-select-option>
            <a-select-option :value="2">
              叶子节点
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="成本中心名称">
          <a-input
            :maxLength="maxLength"
            v-decorator="['name', { rules: [{ required: true, message: '最多可输入50个字符', max: 50 }] }]"
            placeholder="请输入"
            @change="drawerNameChange"
            :suffix="drawerNameNum"
          />
        </a-form-item>
        <a-form-item label="成本中心编号">
          <a-input
            :maxLength="maxLength"
            v-decorator="['code', { rules: [{ required: true, message: '最多可输入50个字符', max: 50 }] }]"
            placeholder="请输入"
            @change="drawerCodeChange"
            :suffix="drawerCodeNum"
          />
        </a-form-item>
        <a-form-item label="上级成本中心">
          <a-tree-select
            v-decorator="['parentId', { rules: [{ required: true, message: '必填字段' }] }]"
            style="width: 60%"
            show-search
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="drawerCostCenterTreeData"
            placeholder="请选择"
            tree-default-expand-all
          >
          </a-tree-select>
          <span class="ant-form-text" style="padding: 0 10px">
            (*请先选择所属本部*)
          </span>
        </a-form-item>
        <a-form-item label="起始结束时间">
          <a-range-picker
            v-decorator="['costCenterRangeTime', { rules: [{ required: true, message: '必填字段' }] }]"
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            :placeholder="['开始时间', '结束时间']"
          />
        </a-form-item>
        <a-form-item label="预存金额">
          <a-input
            v-decorator="['preresidueMoney', { rules: [{ required: true, message: '必填字段' }] }]"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item label="预剩余金额">
          <span>{{!isEdit ? 0 : editData.balance}}</span>
        </a-form-item>
        <a-form-item label="剩余金额">
           <span>{{!isEdit ? 0 : editData.balance}}</span>
        </a-form-item>
        <a-form-item label="序号">
          <a-input-number v-decorator="['order']" :min="1" />
          <span class="ant-form-text">
            (*相同目录下顺序号越大越靠前*)
          </span>
        </a-form-item>
        <a-form-item label="是否启用">
          <a-select
            v-decorator="['enable']"
            placeholder="请选择状态"
          >
            <a-select-option :value="1">
              启用
            </a-select-option>
            <a-select-option :value="0">
              未启用
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :style="{'display': 'none'}">
          <a-input
            v-decorator="['id']"
            type="hidden"
          />
        </a-form-item>
        <a-form-item labelAlign="right">
          <a-button type="primary" @click="drawerFn()">
            保存
          </a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script>
import {
  getDeptListByParentId,
  save,
  update,
  getLikeQueryByName,
  getCostCenterVoListByParentId,
  deleteById,
  deleteByIds
} from '@/api/organizationManagement/costCenterManagement.js'
import listToTree from '@/utils/listToTree'
import cloneDeep from 'lodash.clonedeep'
import moment from 'moment'
import { DetailList } from '@/components'
const DetailListItem = DetailList.Item

const columns = [
  {
    title: '成本中心名称',
    dataIndex: 'name',
    width: 120,
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '上级成本中心',
    dataIndex: 'costCenterName1',
    width: 120
  },
  {
    title: '所属部门',
    dataIndex: 'deptName'
  },
  {
    title: '状态',
    dataIndex: 'enable',
    scopedSlots: { customRender: 'enable' }
  },
  {
    title: '类型',
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '操作',
    dataIndex: 'operating',
    scopedSlots: { customRender: 'operating' }
  }
]
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
  name: 'CostCenterManagement',
  components: {
    DetailList,
    DetailListItem
  },
  props: {
    treeSelected: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      companyName: this.treeSelected.name,
      treeData: [],
      value: undefined,
      drawerForm: this.$form.createForm(this, { name: 'drawerForm' }),
      queryParam: {},
      expandedKeys: [],
      deptId: '',
      searchValue: '',
      autoExpandParent: true,
      costCenterData: [],
      costCenterListData: [],
      treeDataList: [],
      columns,
      selectedRowKeys: [],
      selectedRows: [],
      drawerTitle: '',
      visible: false,
      isDetail: true,
      isEdit: false,
      editData: {}, // 剩余金额
      drawerSubmit: '',
      drawerNameNum: '0/50',
      drawerCodeNum: '0/50',
      maxLength: 50,
      drawerCostCenterTreeData: []
    }
  },
  computed: {
    isDisableBtn() {
      let flag = true
      if (this.selectedRowKeys.length > 0) {
        flag = false
      }
      return flag
    },
    dataSource() {
      const arr = cloneDeep(this.costCenterListData)
      return arr
    },
    costCenterTreeData() {
      let arr = cloneDeep(this.costCenterData)
      arr = arr.map(item => {
        // item.key = item.id
        item.title = item.name
        item.scopedSlots = { title: 'title' }
        item.slots = { icon: 'company' }
        return item
      })
      arr = listToTree({
        setting: {
          name: 'name',
          key: 'id',
          pId: 'parentId'
        },
        list: arr
      })
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
      generateList(arr)
      return arr
    },
    showCostCenterTree() {
      const flag = this.costCenterTreeData.length > 0
      return flag
    }
  },
  mounted() {
    this.initDeptTree()
  },
  methods: {
    listToTree(list) {
      list = list.map(item => {
        const data = {
          label: item.name,
          value: `${item.name}#${item.id}`,
          key: item.id,
          pId: item.parentId || 0
        }
        return Object.assign(item, data)
      })
      const temp = {}
      const treeData = []
      // 数组转 键值对
      list.forEach(item => {
        temp[item.id] = item
      })
      // const tempKeys = Object.keys(temp)
      list.forEach(item => {
        // 当前项 pId
        const _itemPId = item.pId
        // 获取父级项
        const parentItemByPid = temp[_itemPId]
        if (parentItemByPid && item.id !== item.pId) {
          if (!parentItemByPid.children) {
            parentItemByPid.children = []
          }
          parentItemByPid.children.push(item)
        } else {
          treeData.push(item)
        }
      })
      return JSON.parse(JSON.stringify(treeData))
    },
    initDeptTree () {
      const data = {
        categoryId: this.treeSelected.id,
        type: 1
      }
      getDeptListByParentId(data).then((res) => {
        if (res.model.length > 0) {
          this.treeData = listToTree({
            setting: {
              name: 'name',
              key: 'id',
              pId: 'parentId'
            },
            list: res.model
          })
        }
      })
    },
    // 查询成本中心
    queryFn() {
      const data = {
        categoryId: this.treeSelected.id
      }
      const queryData = cloneDeep(this.queryParam)
      this.deptId = queryData.deptId.split('#')[1]
      queryData.deptId = this.deptId
      // 查询成本中心树
      getLikeQueryByName(Object.assign(queryData, data))
        .then(res => {
          if (res.model.length > 0) {
            this.costCenterData = res.model
          }
        })
      // 查询陈本中心列表
      this.getCostCenterVoListByParentIdFn({ deptId: +this.deptId })
    },
    getCostCenterVoListByParentIdFn({ deptId, parentId = 0 }) {
      const data = {
        deptId,
        parentId,
        categoryId: this.treeSelected.id
      }
      getCostCenterVoListByParentId(data).then(res => {
        if (res.model.length > 0) {
          this.costCenterListData = res.model
        }
      })
    },
    selectCostCenterTree(selectedKeys, e) {
      // selectedKeys, e:{selected: bool, selectedNodes, node, event}
      // console.log(selectedKeys)
      if (e.selected) {
        this.getCostCenterVoListByParentIdFn({ deptId: +this.deptId, parentId: +selectedKeys[0].split('#')[1] })
      }
    },
    searchCostCenterTree(e) {
      const value = e.target.value
      const expandedKeys = this.treeDataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, this.costCenterTreeData)
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
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    selectChange(key) {
    },
    showDrawer({ record, title }) {
      this.drawerTitle = title
      this.visible = true
    },
    drawerDeptIdChange(value) {
      const data = {
        categoryId: this.treeSelected.id,
        deptId: value.split('#')[1]
      }
      getLikeQueryByName(data)
        .then(res => {
          if (res.model.length > 0) {
            this.drawerCostCenterTreeData = listToTree({
              setting: {
                name: 'name',
                key: 'id',
                pId: 'parentId'
              },
              list: res.model
            })
          }
        })
    },
    addFn(record) {
      this.drawerTitle = '新增'
      this.isDetail = false
      this.isEdit = false
      this.visible = true
      this.drawerForm.resetFields()
      this.drawerSubmit = save
    },
    detailFn(record) {
      this.drawerTitle = '详情'
      this.isDetail = true
      record.companyName = this.companyName
      this.detailData = record
      this.visible = true
      this.drawerInit()
    },
    editFn(record) {
      this.drawerTitle = '编辑'
      this.isDetail = false
      this.isEdit = true
      this.visible = true
      this.drawerFormData = record
      this.drawerSubmit = update
      const drawerFormData = {
        id: record.id,
        name: record.name,
        code: record.code,
        type: record.type + '',
        costCenterRangeTime: [moment(record.startTime), moment(record.endTime)],
        parentId: record.costCenterName1,
        deptId: record.deptName,
        order: +record.order,
        enable: record.enable,
        preresidueMoney: 0
      }
      this.editData.balance = record.preresidueMoney
      this.editData.parentId = record.parentId
      this.editData.deptId = record.deptId
      this.drawerInit(drawerFormData)
    },
    deleteFn(record) {
      const data = {
        id: record.id
      }
      deleteById(data).then((res) => {
        if (res.code === 1000000) {
          this.$message.success(res.resultStr)
          // this.listData = this.listData.filters((item) => {
          //   return item.id !== record.id
          // })
          this.$refs.table.refreshFn()
        } else {
          this.$message.error(res.resultStr)
        }
      })
    },
    deleteBatchFn() {
      if (this.selectedRows.length < 1) {
        this.$message.warning('请选择要删除的数据！')
        return
      }
      const selectedRowKeys = this.selectedRowKeys
      this.$confirm({
        title: '删除',
        content: `确定要删除已选中的数据吗`,
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          const data = { ids: selectedRowKeys + '' }
          deleteByIds(data).then((res) => {
            if (res.code === 1000000) {
              this.$message.success(res.resultStr)
              // this.listData = this.listData.filters((item) => {
              //   this.selectedRows.forEach(element => {
              //     return element.id !== item.id
              //   })
              // })
              this.$refs.table.refreshFn()
            } else {
              this.$message.error(res.resultStr)
            }
          })
        },
        onCancel() {}
      })
    },
    drawerNameChange(e) {
      const num = (e.target.value + '').length
      this.drawerNameNum = `${num}/30`
    },
    drawerCodeChange(e) {
      const num = (e.target.value + '').length
      this.drawerCodeNum = `${num}/30`
    },
    drawerInit(drawerFormData) {
      let initData = {}
      if (drawerFormData) {
        initData = drawerFormData
      }
      // 表单回显必须使用后 nextTick
      this.$nextTick(() => {
        this.drawerForm.setFieldsValue(initData)
      })
    },
    drawerFn() {
      this.drawerForm.validateFields({ force: true }, (err, values) => {
        if (!err) {
          let data = { ...values }
          data = cloneDeep(data)
          let parentId = +(data.parentId && data.parentId.split('#')[1])
          let deptId = +(data.deptId && data.deptId.split('#')[1])
          if (this.isEdit) {
            if (data.parentId) {
              // 当没编辑过 parentId
              if (data.parentId.indexOf('#') === -1) {
                parentId = this.editData.parentId
              }
            }
            if (data.deptId) {
              // 当没编辑过 deptId
              if (data.deptId.indexOf('#') === -1) {
                deptId = this.editData.deptId
              }
            }
          }
          data = {
            id: data.id,
            name: data.name,
            code: data.code,
            type: +data.type,
            startTime: data.costCenterRangeTime[0].format('YYYY-MM-DD HH:mm:ss'),
            endTime: data.costCenterRangeTime[1].format('YYYY-MM-DD HH:mm:ss'),
            parentId,
            deptId,
            order: +data.order,
            enable: +data.enable,
            preresidueMoney: data.preresidueMoney
          }
          this.drawerSubmit(data).then((res) => {
            if (res.code === 1000000) {
              this.$message.success(res.resultStr)
              this.visible = false
              this.$refs.table.refreshFn()
            } else {
              this.$message.error(res.resultStr)
            }
          })
        }
      })
    },
    tablePageChange (page, pageSize) {
      // console.log(page, pageSize)
    },
    drawerClose() {
      this.visible = false
    },
    onExpand(expandedKeys) {
      // console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    }
  },
  watch: {
    value: {
      handler(n, o) {
        // 通过部门查询部门下的成本中心
        // this.
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="less">
@import './index.less'; // 这个分号一定要写，要不会报错
.tree-and-table{
  display: flex;
  .tree{
    padding-top: 12px;
    width: 200px;
    margin-right: 10px;
  }
  .table{
    flex: 1;
    .title{
      padding-left: 10px;
      margin-bottom: 10px;
      height: 45px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #b4bbc5;
    }
    .btn-box{
      margin-bottom: 16px;
    }
  }
}
</style>
