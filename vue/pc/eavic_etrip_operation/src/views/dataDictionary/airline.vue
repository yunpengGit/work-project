<template>
  <div>
    <a-tabs>
      <a-tab-pane :tab="tabList[0]">
        <div class="title">{{tabList[0]}}</div>
        <div class="table-page-search-wrapper">
          <a-form layout="inline" >
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-item label="ID">
                  <a-input
                    v-model="queryParam.id"
                    placeholder="请输入"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="航空公司名称">
                  <a-input
                    v-model="queryParam.name"
                    placeholder="请输入"
                  />
                </a-form-item>
              </a-col>
              <template v-if="advanced">
                <a-col :md="8" :sm="24">
                  <a-form-item label="航空公司英文名称">
                    <a-input
                      v-model="queryParam.enName"
                      placeholder="请输入"
                    />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="国内国际">
                    <a-select
                      v-model="queryParam.state"
                      placeholder="请选择状态"
                      @change="selectChange"
                    >
                      <a-select-option value="">
                        所有
                      </a-select-option>
                      <a-select-option :value="0">
                        国内
                      </a-select-option>
                      <a-select-option :value="1">
                        国际
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="运单前三位数字">
                    <a-input
                      v-model="queryParam.waybillCode"
                      placeholder="请输入"
                    />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="航空公司二字代码">
                    <a-input
                      v-model="queryParam.airlineTwoCode"
                      placeholder="请输入"
                    />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="航空公司三字代码">
                    <a-input
                      v-model="queryParam.airlineThreeCode"
                      placeholder="请输入"
                    />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                </a-col>
              </template>
              <a-col :md="!advanced && 6 || 24" :sm="24">
                <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                  <a-button type="primary" html-type="submit" icon="search" @click="$refs.table.refreshFn(true)">
                      查询
                    </a-button>
                    <a-button @click="reset">
                      重置
                    </a-button>
                    <a @click="toggleAdvanced" style="margin-left: 8px">
                      {{ advanced ? '收起' : '展开' }}
                      <a-icon :type="advanced ? 'up' : 'down'"/>
                    </a>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="btn-box">
          <a-button type="primary" icon="plus" @click="addFn()">
            添加
          </a-button>
          <a-button type="primary" icon="upload" @click="showDrawer({title: '添加'})">
            批量导入
          </a-button>
          <a-button type="primary" icon="download" @click="showDrawer({title: '添加'})" :disabled="isDisableBtn">
            下载导出
          </a-button>
          <a-button type="danger" icon="delete" @click="deleteBatchFn" :disabled="isDisableBtn">
            批量删除
          </a-button>
        </div>
        <s-table
          ref="table"
          size="default"
          rowKey = "id"
          :columns="columns"
          :data="loadData"
          :alert="options.alert"
          :rowSelection="options.rowSelection"
          showPagination="auto"
          :scroll="{ x: 1900 }"
          >
          <template slot="num" slot-scope="text, record, index">
            <span>{{index + 1}}</span>
          </template>
          <template slot="state" slot-scope="text, record">
            <span :class="{'red': record.state === 1,'green': record.state === 0}">
              <!-- <a-icon type="close-circle" theme="filled" v-if="record.state === 1"/>
              <a-icon type="check-circle" theme="filled" v-else/> -->
              {{ record.state === 0 ? '国内' : '国际'}}
            </span>
          </template>
          <span slot='createName' slot-scope="text, record">
            <div>{{record.createName}}</div>
            <div>{{record.createTime}}</div>
          </span>
          <span slot='updateName' slot-scope="text, record">
            <div>{{record.updateName}}</div>
            <div>{{record.updateTime}}</div>
          </span>
          <span slot="description" slot-scope="text">
            <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
          </span>
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
            </div>
          </template>
        </s-table>
      </a-tab-pane>
    </a-tabs>
    <a-drawer
      :title="drawerTitle"
      :width="890"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="drawerClose"
    >
      <a-form :label-col="{ span: 5 }"
      :wrapper-col="{ span: 15 }"
      :form="drawerForm"
      >
        <a-form-item :style="{'display': 'none'}">
          <a-input
            v-decorator="['id']"
            type="hidden"
          />
        </a-form-item>
        <a-form-item label="运单前三位数字">
          <a-input
            v-decorator="['waybillCode', { rules: [{ required: true, message: '必填' }] }]"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item label="航空公司二字代码">
          <a-input
            v-decorator="['airlineTwoCode', { rules: [{ required: true, message: '必填' }] }]"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item label="航空公司三字代码">
          <a-input
            v-decorator="['airlineThreeCode', { rules: [{ required: true, message: '必填' }] }]"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item label="航空公司名称">
          <a-input
            v-decorator="['name', { rules: [{ required: true, message: '必填' }] }]"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item label="航空公司英文名称">
          <a-input
            v-decorator="['enName', { rules: [{ required: true, message: '必填' }] }]"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item label="国内国际" >
          <a-radio-group v-decorator="['state', { rules: [{ required: true}] }]">
            <a-radio :value="0">
              国内
            </a-radio>
            <a-radio :value="1">
              国际
            </a-radio>
          </a-radio-group>
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
import { save, update, getPageByParams, deleteById, deleteByIds } from '@/api/dataDictionary/airline.js'
import { STable, Ellipsis } from '@/components'

const columns = [
  {
    title: '序号',
    dataIndex: 'num',
    width: 60,
    scopedSlots: { customRender: 'num' },
    fixed: 'left'
  },
  {
    title: 'ID',
    dataIndex: 'id',
    width: 60,
    fixed: 'left'
  },
  {
    title: '航空公司名称',
    dataIndex: 'name',
    width: 160,
    fixed: 'left'
  },
  {
    title: '航空公司英文名称',
    dataIndex: 'enName'
  },
  {
    title: '运单前三位数字代码',
    dataIndex: 'waybillCode'
  },
  {
    title: '航空公司二字代码',
    dataIndex: 'airlineTwoCode'
  },
  {
    title: '航空公司三字代码',
    dataIndex: 'airlineThreeCode'
  },
  {
    title: '状态',
    dataIndex: 'state',
    width: 100,
    ellipsis: true,
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '添加人',
    dataIndex: 'createName',
    ellipsis: true,
    width: 140,
    scopedSlots: { customRender: 'createName' }
  },
  {
    title: '修改人',
    dataIndex: 'updateName',
    ellipsis: true,
    width: 140,
    scopedSlots: { customRender: 'updateName' }
  },
  {
    title: '操作',
    dataIndex: 'operating',
    width: 160,
    scopedSlots: { customRender: 'operating' },
    fixed: 'right'
  }
]

export default {
  name: 'authority',
  components: {
    STable,
    Ellipsis
  },
  data () {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      drawerForm: this.$form.createForm(this, { name: 'drawerForm' }),
      tabList: ['航空公司字典'],
      queryParam: {},
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log(1)
        return getPageByParams(Object.assign(parameter, this.queryParam))
          .then(res => {
            console.log(res)
            return res.model
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      // custom table alert & rowSelection
      options: {
        alert: { show: false, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: false,
      loading: false,
      drawerTitle: '',
      visible: false,
      drawerSubmit: '',
      drawerNameNum: '0/30',
      maxLength: 30
    }
  },
  computed: {
    isDisableBtn() {
      let flag = true
      if (this.selectedRowKeys.length > 0) {
        flag = false
      }
      return flag
    }
  },
  methods: {
    reset() {
      this.queryParam = {}
      this.$refs.table.refreshFn()
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    selectChange(key) {
      console.log(key)
    },
    showDrawer({ record, title }) {
      this.drawerTitle = title
      this.visible = true
    },
    addFn(record) {
      this.drawerTitle = '新增'
      this.visible = true
      this.drawerForm.resetFields()
      this.drawerSubmit = save
    },
    detailFn(record) {
      this.drawerTitle = '详情'
      this.visible = true
      this.drawerInit()
    },
    editFn(record) {
      this.drawerTitle = '编辑'
      this.visible = true
      this.drawerFormData = record
      this.drawerSubmit = update
      const drawerFormData = {
        id: record.id,
        waybillCode: record.waybillCode,
        airlineTwoCode: record.airlineTwoCode,
        airlineThreeCode: record.airlineThreeCode,
        name: record.name,
        enName: record.enName,
        state: record.state
      }
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
    drawerInit(drawerFormData) {
      let initData = {
        name: '',
        state: 2
      }
      if (drawerFormData) {
        initData = drawerFormData
      }
      // 表单会先必须使用后 nextTick
      this.$nextTick(() => {
        this.drawerForm.setFieldsValue(initData)
      })
    },
    drawerFn() {
      this.drawerForm.validateFields({ force: true }, (err, values) => {
        if (!err) {
          console.log('login form', values)
          const data = { ...values }
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
      console.log(page, pageSize)
    },
    drawerClose() {
      this.visible = false
    },
    treeLoadData() {
    },
    onExpand(expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck(checkedKeys) {
      console.log('onCheck', checkedKeys)
      this.checkedKeys = checkedKeys
    },
    onSelect(selectedKeys, info) {
      console.log('onSelect', info)
      this.selectedKeys = selectedKeys
    }
  }
}
</script>

<style scoped lang="less">
@import './index.less'; // 这个分号一定要写，要不会报错
</style>
