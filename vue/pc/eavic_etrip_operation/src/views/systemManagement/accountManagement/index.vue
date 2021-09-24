<template>
  <div class="accountManagement">
    <a-tabs default-active-key="1" :animated="false" v-model="activeTab">
      <a-tab-pane key="1" tab="系统帐号"></a-tab-pane>
      <a-tab-pane key="2" tab="供应商帐号"></a-tab-pane>
      <a-tab-pane key="3" tab="企业帐号"></a-tab-pane>
    </a-tabs>
    <div>
      <div class="tabClassDiv">
            <a-form-model :model="queryParam" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" :style="{marginTop:'10px'}">
              <a-row :gutter="16">
                <a-col :span="6">
                  <a-form-model-item has-feedback label="ID">
                    <a-input v-model="queryParam.id" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item has-feedback label="名称">
                    <a-input v-model="queryParam.username" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item has-feedback label="手机">
                    <a-input v-model="queryParam.mobile" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item has-feedback label="UID">
                    <a-input v-model="queryParam.ssoUserId" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item has-feedback label="邮箱">
                    <a-input v-model="queryParam.email" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item has-feedback label="角色">
                    <a-select v-model="queryParam.roleId" showSearch optionFilterProp='children'>
                      <a-select-option value="">所有</a-select-option>
                      <a-select-option :value="item.id" v-for="(item, index) in rolesList" :key="index+'rolesquery'">
                        {{ item.name }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item has-feedback label="状态">
                    <a-select v-model="queryParam.state">
                      <a-select-option :value="item.value" v-for="(item, index) in statusList" :key="index+'status'">
                        {{ item.title }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6" v-if="activeTab !=1">
                  <a-form-model-item has-feedback label="供应商" v-if="activeTab == 2">
                    <a-select v-model="queryParam.supplierId">
                      <a-select-option value="">所有</a-select-option>
                      <a-select-option :value="item.id" v-for="(item, index) in gysList" :key="index+'gysquery'">
                        {{ item.name }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                   <a-form-model-item has-feedback label="企业" v-if="activeTab == 3">
                    <a-input v-model="queryParam.categoryId" autocomplete="off"/>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row type="flex" justify="end">
                <a-col>
                    <a-button type="primary" icon="search" @click="querySearch()">查询</a-button>
                </a-col>
              </a-row>
            </a-form-model>
            <a-button v-if="activeTab==1 || activeTab==2" type="primary" icon="plus" @click="add">添加</a-button>
            <a-button :style="{marginLeft:'10px'}" type="primary" :disabled="batchDeleState" @click="freezeOrThawModal=true" icon="lock">冻结或解冻</a-button>
            <a-button v-if="activeTab==1 || activeTab==2" :style="{marginLeft:'10px'}" type="danger" icon="delete" :disabled="batchDeleState" @click="batchDele">批量删除</a-button>
            <a-table
              :columns="columns"
              :data-source="tableData"
              :style="{marginTop:'10px'}"
              :row-selection="rowSelection"
              :pagination="false"
              :rowKey="record => record.id +'_'+activeTab+'_'+record.ssoUserId"
            >
              <span slot="username" slot-scope="text, record">
                <span class="blueSpan btn" @click="more(record)">
                  {{record.username}}
                </span>
              </span>
              <span slot="roleList" slot-scope="text, record" :title="record.roleList.map(item => {return item.name+'\n'}).join(',').replace(/\,/g,'').replace(/[\n]$/,'')">
                <div v-for="item in record.roleList.slice(0,2)" :key="item.id">{{ item.name }}</div>
                <div v-if="record.roleList.length >= 3">...</div>
              </span>
              <span slot="freezeState" slot-scope="freezeState">
                <span>
                  <a-icon
                    :type="freezeState == '1' ? 'close-circle' : 'check-circle'"
                    :class="freezeState =='1' ? 'redSpan' : 'greenSpan'"
                  />
                  <span v-text="freezeState == '1' ? '冻结' : '可用'" :class="freezeState == '1' ? 'redSpan' : 'greenSpan'"></span>
                </span>
              </span>
              <span slot="createName" slot-scope="text, record">
                <div>{{ record.createName }}</div>
                <div>{{ record.createTime }}</div>
              </span>
              <span slot="updateName" slot-scope="text, record">
                <div>{{ record.updateName }}</div>
                <div>{{ record.updateTime }}</div>
              </span>
              <span slot="operating" slot-scope="text, record">
                <span class="btn">
                  <span class="blueSpan" @click="editShow(record)">
                    <a-icon type='edit'/>
                    <span v-text="activeTab == 1 || activeTab ==2 ?'编辑':'角色'"></span>
                    </span>
                  <span class="blueSpan" @click="more(record)"><a-icon type='menu'/>更多</span>
                </span>
              </span>
            </a-table>
            <a-pagination
              class="paginationConten"
              show-size-changer
              show-quick-jumper
              :showTotal="total => `共 ${total} 条`"
              :page-size-options="pageSizeOptions"
              :total="total"
              :pageSize="pageSize"
              :defaultCurrent="pageNumber"
              :current="pageNumber"
              @change="pageChange"
              @showSizeChange="pageSizeChange"
            />
          </div>
    </div>
    <a-drawer
      class="accountDrawerDiv"
      :zIndex='900'
      :title="drawerTitle"
      placement="right"
      :width="720"
      :body-style="{ paddingBottom: '80px' }"
      :visible="drawerVisible"
      @close="drawerVisible=false"
    >
    <a-spin :spinning="loading">
     <a-form-model
        ref="ruleForm"
        :model="addParam"
        :rules="addParamRules"
        :validateOnRuleChange="false"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        >
        <div class="drawerTitleDes" v-show="modalSureBtnStatus=='add'">新增的账号首次使用请点击对应登录页的“找回密码”进行设置</div>
        <div v-show="modalSureBtnStatus=='add' || modalSureBtnStatus=='edit'">
          <a-form-model-item label="帐号" prop="userName" v-if="activeTab !=3">
            <a-input v-model="addParam.userName" />
          </a-form-model-item>
          <a-form-model-item label="姓名" prop="name" v-if="activeTab !=3">
            <a-input v-model="addParam.name" />
          </a-form-model-item>
          <a-form-model-item label="手机" prop="mobile" v-if="activeTab !=3">
            <a-input v-model="addParam.mobile" />
          </a-form-model-item>
          <a-form-model-item label="邮箱" prop="email" v-if="activeTab !=3">
            <a-input v-model="addParam.email" />
          </a-form-model-item>
          <a-form-model-item label="所属供应商" prop="supplierId"  v-if="activeTab == 2">
            <a-select v-model="addParam.supplierId" showSearch optionFilterProp='children'>
              <a-select-option :value="item.id" v-for="(item, index) in gysList" :key="index+'gysSelect'">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="角色" prop="roles" required :rules = '{ "validator": checkRoles, "tigger": "change,blue" }'>
            <a-select v-model="addParam.roles" showSearch optionFilterProp='children' @select="rolesSelectFunction">
              <a-select-option :value="item.id" v-for="(item, index) in rolesList" :key="index+'rolesSelect'">
                {{ item.name }}
              </a-select-option>
            </a-select>
            <a-tag closable v-for="item in rolesListTag" :key="item.id+'rolesTagSelect'" @close='drawerRolesSelect(item)'>
              {{item.name}}
            </a-tag>
          </a-form-model-item>
        </div>
        <div v-if="modalSureBtnStatus =='detail'">
          <a-form-model-item label="帐号">
            <div v-text="addParam.userName"></div>
          </a-form-model-item>
          <a-form-model-item label="姓名">
            <div v-text="addParam.name"></div>
          </a-form-model-item>
          <a-form-model-item label="手机">
            <div v-text="addParam.mobile"></div>
          </a-form-model-item>
          <a-form-model-item label="邮箱">
            <div v-text="addParam.email"></div>
          </a-form-model-item>
          <a-form-model-item label="所属供应商"  v-if="activeTab == 2">
            <div>{{addParam.supplierName}}</div>
          </a-form-model-item>
           <a-form-model-item label="所属企业" v-if="activeTab == 3">
            <div>{{addParam.categoryName}}</div>
          </a-form-model-item>
          <a-form-model-item label="角色">
            <a-tag :closable="modalSureBtnStatus=='add' || modalSureBtnStatus=='edit'?true:false"
              v-for="item in rolesListTag" :key="item.id+'_rolesTagDes'" @close='drawerRolesSelect(item)'>
              {{item.name}}
            </a-tag>
          </a-form-model-item>
           <a-form-model-item label="添加人">
            <div>
              <span class="blueSpan">{{addParam.createName}}</span>
              <a-icon type="history" :style="{ fontSize: '18px',margin: '0px 20px'}"/>
              <span>{{addParam.createTime}}</span>
            </div>
          </a-form-model-item>
           <a-form-model-item label="修改人">
            <div>
              <span class="blueSpan">{{addParam.updateName}}</span>
              <a-icon type="history" :style="{ fontSize: '18px',margin: '0px 20px'}"/>
              <span>{{addParam.updateTime}}</span>
            </div>
          </a-form-model-item>
        </div>
      </a-form-model>
        <div class="drawerFooter">
          <a-button v-if="modalSureBtnStatus=='detail' && activeTab!=3" type="primary" @click="modalSureBtnStatus='edit'" icon='edit'>编辑</a-button>
          <a-button v-if="modalSureBtnStatus=='detail'" type="primary" @click="freezeOrThawModal=true" icon="lock">冻结或解冻</a-button>
          <a-button v-if="modalSureBtnStatus=='detail' && activeTab!=3" type="danger" @click="deleteFunction" icon='delete'>删除</a-button>
          <a-button v-if="(modalSureBtnStatus=='edit' || modalSureBtnStatus=='add')" type="primary" @click="save" icon='save'>保存</a-button>
          <a-button @click="drawerVisible=false">取消</a-button>
        </div>
    </a-spin>
    </a-drawer>
    <a-modal v-model="freezeOrThawModal" :footer="null" :width="416" :maskClosable="false" :closable="false" class="accountDrawerDiv ant-modal-confirm-confirm">
      <div class="ant-modal-confirm-body">
        <a-icon type="question-circle" :style="{ fontSize: '20px'}" class="anticon"/>
        <span class="ant-modal-confirm-title">将选中的账号执行什么操作？</span>
      </div>
      <div style="height:30px"></div>
      <div class="drawerFooter">
          <a-button type="danger" ghost @click="freezeEmployeeFunction(1)">冻结</a-button>
          <a-button type="primary" ghost @click="freezeEmployeeFunction(0)">解冻</a-button>
          <a-button @click="freezeOrThawModal=false" >取消</a-button>
        </div>
    </a-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import { getPageByParams, getListByParams, save, update, deleteById, deleteByIds, getSupplierListByParams, freezeEmployee } from '@/api/accountManagement'
import { FormModel, Pagination } from 'ant-design-vue'
Vue.use(FormModel).use(Pagination)

export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    var checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      } else {
        const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的邮箱'))
        }
      }
    }
    return {
      activeTab: '',
      queryParam: {
        id: '',
        userName: '',
        mobile: '',
        email: '',
        ssoUserId: '',
        roleId: '',
        categoryId: '',
        supplierId: '',
        state: ''
      },
      statusList: [
        {
          title: '所有',
          value: ''
        },
        {
          title: '可用',
          value: 0
        },
        {
          title: '冻结',
          value: 1
        }
      ],
      rolesList: [],
      rolesListTag: [],
      rolesListTagId: [],
      gysList: [],
      columns: [],
      tableData: [],
      pageSizeOptions: ['10', '20', '30', '50'],
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      modalSureBtnStatus: '',
      addParam: {
        userName: '',
        name: '',
        email: '',
        mobile: '',
        supplierId: '',
        roles: ''
      },
      addParamRules: {
        userName: [
          { required: true, message: '帐号必填', trigger: 'blur' },
          { min: 1, max: 30, message: '最多能输入30个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '姓名必填', trigger: 'blur' },
          { min: 1, max: 20, message: '最多能输入20个字符', trigger: 'blur' }
        ],
        mobile: [
          { validator: checkPhone, required: true, trigger: 'blur' },
          { min: 1, max: 11, message: '最多能输入11个字符', trigger: 'blur' }
        ],
        email: [
          { validator: checkEmail, required: true, trigger: 'blur' }
        ],
        supplierId: [{ required: true, message: '供应商必选', trigger: 'change' }]
        // roles: [{ validator: checkRoles, required: true, trigger: 'change' }]
      },
      selectedRowKeys: [],
      selectedRows: [],
      batchDeleState: true,
      loading: false,
      drawerVisible: false,
      drawerTitle: '',
      freezeOrThawModal: false
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
          this.batchDeleState = false
          if (selectedRows.length == '0') {
            this.batchDeleState = true
          }
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        },
        selectedRowKeys: this.selectedRowKeys
      }
    }
  },
  watch: {
    activeTab(active) {
      this.queryParam.id = ''
      this.queryParam.userName = ''
      this.queryParam.mobile = ''
      this.queryParam.email = ''
      this.queryParam.uid = ''
      this.queryParam.state = ''
      this.batchDeleState = true
      this.tableData = []
      this.total = 0
      if (active == 1) {
        this.columns = [
          {
            title: '序号',
            dataIndex: 'num',
            key: 'num',
            width: '80px',
            customRender: (text, record, index) =>
              `${(this.pageNumber - 1) * this.pageSize + index + 1}`
          },
          {
            title: 'id',
            key: 'id',
            dataIndex: 'id',
            width: '140px'
          },
          {
            title: '姓名',
            key: 'username',
            dataIndex: 'username',
            ellipsis: true,
            scopedSlots: { customRender: 'username' }
          },
          {
            title: '手机',
            key: 'mobile',
            dataIndex: 'mobile',
            ellipsis: true
          },
          {
            title: '角色',
            key: 'roleList',
            dataIndex: 'roleList',
            ellipsis: true,
            scopedSlots: { customRender: 'roleList' }
          },
          {
            title: '状态',
            key: 'freezeState',
            dataIndex: 'freezeState',
            width: '80px',
            scopedSlots: { customRender: 'freezeState' }
          },
          {
            title: '修改人',
            key: 'updateName',
            dataIndex: 'updateName',
            scopedSlots: { customRender: 'updateName' }
          },
          {
            title: '操作',
            key: 'operating',
            width: '140px',
            dataIndex: 'operating',
            scopedSlots: { customRender: 'operating' }
          }
        ]
      } else if (this.activeTab == 2) {
        this.columns = [
          {
            title: '序号',
            dataIndex: 'num',
            key: 'num',
            width: '60px',
            customRender: (text, record, index) =>
              `${(this.pageNumber - 1) * this.pageSize + index + 1}`
          },
          {
            title: 'id',
            key: 'id',
            dataIndex: 'id'
          },
          {
            title: '姓名',
            key: 'username',
            dataIndex: 'username',
            ellipsis: true,
            scopedSlots: { customRender: 'username' }
          },
          {
            title: '手机',
            key: 'mobile',
            dataIndex: 'mobile',
            ellipsis: true
          },
          {
            title: '所属供应商',
            key: 'supplierName',
            dataIndex: 'supplierName',
            ellipsis: true
          },
          {
            title: '角色',
            key: 'roleList',
            dataIndex: 'roleList',
            ellipsis: true,
            scopedSlots: { customRender: 'roleList' }
          },
          {
            title: '状态',
            key: 'freezeState',
            dataIndex: 'freezeState',
            scopedSlots: { customRender: 'freezeState' }
          },
          {
            title: '修改人',
            key: 'updateName',
            dataIndex: 'updateName',
            scopedSlots: { customRender: 'updateName' }
          },
          {
            title: '操作',
            key: 'operating',
            dataIndex: 'operating',
            width: '140px',
            scopedSlots: { customRender: 'operating' }
          }
        ]
      } else if (this.activeTab == 3) {
        this.columns = [
          {
            title: '序号',
            dataIndex: 'num',
            key: 'num',
            width: '60px',
            customRender: (text, record, index) =>
              `${(this.pageNumber - 1) * this.pageSize + index + 1}`
          },
          {
            title: 'id',
            key: 'id',
            dataIndex: 'id'
          },
          {
            title: '姓名',
            key: 'username',
            dataIndex: 'username',
            ellipsis: true,
            scopedSlots: { customRender: 'username' }
          },
          {
            title: '手机',
            key: 'mobile',
            dataIndex: 'mobile',
            ellipsis: true
          },
          {
            title: '所属企业',
            key: 'categoryName',
            dataIndex: 'categoryName',
            ellipsis: true
          },
          {
            title: '角色',
            key: 'roleList',
            dataIndex: 'roleList',
            ellipsis: true,
            scopedSlots: { customRender: 'roleList' }
          },
          {
            title: '状态',
            key: 'freezeState',
            dataIndex: 'freezeState',
            scopedSlots: { customRender: 'freezeState' }
          },
          {
            title: '操作',
            key: 'operating',
            dataIndex: 'operating',
            width: '140px',
            scopedSlots: { customRender: 'operating' }
          }
        ]
      }
      this.querySearch()
    }
  },
  created() {
    this.activeTab = '1'
    this.getRolesList()
    this.getGysList()
  },
  methods: {
    checkRoles(rule, value, callback) {
      if (this.rolesListTagId.length == 0) {
        return callback(new Error('请选择角色'))
      } else {
        callback()
      }
    },
    querySearch(pageNumber, pageSize) {
      let params = {}
      this.pageNumber = pageNumber || 1
      params = Object.assign({}, this.queryParam, { pageSize: pageSize || this.pageSize, pageNumber: pageNumber || this.pageNumber })
      if (this.activeTab == 1) {
        params.accountType = 3
      } else if (this.activeTab == 2) {
        params.accountType = 2
      } else if (this.activeTab == 3) {
        params.accountType = 1
      }
      this.selectedRowKeys = []
      this.selectedRows = []
      getPageByParams(params).then(res => {
        if (res.code == '1000000') {
          this.tableData = res.model.list
          this.total = res.model.totalRow
          this.pageNumber = res.model.pageNumber
          this.pageSize = res.model.pageSize
          this.selectedRowKeys = []
        } else {
          Vue.prototype.$message.error(res.resultStr)
          this.tableData = []
          this.total = 0
          this.pageNumber = 1
          this.pageSize = 10
          this.selectedRowKeys = []
        }
      })
    },
    pageChange(current, size) {
      this.pageNumber = current
      this.pageSize = size
      this.querySearch(current, size)
    },
    pageSizeChange(current, size) {
      this.pageNumber = 1
      this.pageSize = size
      this.querySearch(1, size)
    },
    getRolesList() {
      // 获取角色列表
      getListByParams({}).then(res => {
        if (res.code == '1000000') {
          this.rolesList = res.model
        } else {
          this.rolesList = []
        }
      })
    },
    getGysList() {
      // 获取供应商列表
      getSupplierListByParams({}).then(res => {
        if (res.code == '1000000') {
          this.gysList = res.model
        } else {
          this.gysList = []
        }
      })
    },
    add() {
      this.drawerVisible = true
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
        const row = {
          userName: '',
          name: '',
          email: '',
          mobile: '',
          roles: '',
          id: ''
        }
        this.addParam = row
      })
      this.modalSureBtnStatus = 'add'
      this.rolesListTag = []
      this.rolesListTagId = []
      if (this.activeTab == 1) {
        this.drawerTitle = '添加管理员帐号'
      } else if (this.activeTab == 2) {
        this.drawerTitle = '添加供应商帐号'
      } else if (this.activeTab == 3) {
        this.drawerTitle = '添加企业帐号'
      }
    },
    editShow(rowIndex) {
      this.drawerVisible = true
      this.modalSureBtnStatus = 'edit'
      this.rolesListTag = []
      this.rolesListTagId = []
      if (this.activeTab == 1) {
        this.drawerTitle = '修改管理员帐号'
      } else if (this.activeTab == 2) {
        this.drawerTitle = '修改供应商帐号'
      } else if (this.activeTab == 3) {
        this.drawerTitle = '修改帐号角色'
      }
      const row = {
        userName: rowIndex.username,
        name: rowIndex.name,
        email: rowIndex.email,
        mobile: rowIndex.mobile,
        roles: rowIndex.roleList.length != 0 ? rowIndex.roleList[rowIndex.roleList.length - 1].id : '',
        id: rowIndex.id,
        supplierId: rowIndex.supplierId
      }
      this.addParam = Object.assign({}, this.addParam, row)
      this.rolesListTag = JSON.parse(JSON.stringify(rowIndex.roleList))
      rowIndex.roleList.map(item => this.rolesListTagId.push(item.id))
    },
    more(rowIndex) {
      this.drawerVisible = true
      this.rolesListTag = []
      this.rolesListTagId = []
      this.modalSureBtnStatus = 'detail'
      if (this.activeTab == 1) {
        this.drawerTitle = '管理员帐号详情'
      } else if (this.activeTab == 2) {
        this.drawerTitle = '供应商帐号详情'
      } else if (this.activeTab == 3) {
        this.drawerTitle = '企业帐号详情'
      }
      const row = {
        userName: rowIndex.username,
        name: rowIndex.name,
        email: rowIndex.email,
        mobile: rowIndex.mobile,
        roles: rowIndex.roleList.length != 0 ? rowIndex.roleList[rowIndex.roleList.length - 1].id : '',
        id: rowIndex.id
      }
      this.addParam = rowIndex
      this.addParam = Object.assign({}, this.addParam, row)
      this.rolesListTag = JSON.parse(JSON.stringify(rowIndex.roleList))
      rowIndex.roleList.map(item => this.rolesListTagId.push(item.id))
    },
    save() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          const params = {}
          if (this.activeTab == 1 || this.activeTab == 2 || this.activeTab == 3) {
            params.username = this.addParam.userName
            params.name = this.addParam.name
            params.mobile = this.addParam.mobile
            params.email = this.addParam.email
            params.roleList = []
            this.rolesListTagId.map(item => {
              params.roleList.push({ id: item })
            })
            if (this.activeTab == 1) {
              params.accountType = 3
            } else if (this.activeTab == 2) {
              params.supplierId = this.addParam.supplierId
              params.accountType = 2
            }
          }
          if (this.activeTab == 3) {
            // params.roleList = this.rolesListTagId
            params.accountType = 1
          }
          let uriApi = null
          if (this.modalSureBtnStatus == 'add') {
            uriApi = save
          } else if (this.modalSureBtnStatus == 'edit') {
            uriApi = update
            params.id = this.addParam.id
          }
          this.loading = true
          // 所有新增修改调用服务的地方
          uriApi(params).then(res => {
            this.loading = false
            if (res.code == '1000000') {
              Vue.prototype.$message.success(res.resultStr)
              this.drawerVisible = false
              this.querySearch()
            } else {
              Vue.prototype.$message.error(res.resultStr)
            }
          })
        } else {
          return false
        }
      })
    },
    batchDele() { // 批量删除
      Vue.prototype.$confirm({
        title: '确认删除选中的帐号？',
        onOk: () => {
          const ids = []
          this.selectedRows.map(item => {
            ids.push(item.id)
          })
          const params = {}
          params.ids = ids.join(',')
          if (this.activeTab == 1) {
            params.accountType = 3
          } else if (this.activeTab == 2) {
            params.accountType = 2
          }
          deleteByIds(params).then(res => {
            if (res.code == '1000000') {
              Vue.prototype.$message.success(`${res.resultStr}共${res.model}条`)
              this.querySearch()
            } else {
              Vue.prototype.$message.error(res.resultStr)
            }
          })
        }
      })
    },
    freezeEmployeeFunction(state) {
      const params = {}
      if (this.drawerVisible) {
        params.ids = this.addParam.id
      } else {
        const ids = []
        this.selectedRows.map(item => ids.push(item.id))
        params.ids = ids.join(',')
      }
      if (this.activeTab == 1) {
        params.accountType = 3
      } else if (this.activeTab == 2) {
        params.accountType = 2
      } else if (this.activeTab == 3) {
        params.accountType = 1
      }
      params.state = state
      freezeEmployee(params).then(res => {
        if (res.code == '1000000') {
          this.freezeOrThawModal = false
          this.drawerVisible = false
          Vue.prototype.$message.success(`${res.resultStr}共${res.model}条`)
          this.querySearch()
        } else {
          Vue.prototype.$message.error(res.resultStr)
        }
      })
    },
    rolesSelectFunction(value, option) {
      const roles = this.rolesList.filter(item => item.id == value)
      if (this.rolesListTagId.indexOf(value) == -1) {
        this.rolesListTag.push(roles[0])
        this.rolesListTagId.push(roles[0].id)
      }
    },
    drawerRolesSelect(node) {
      // 觉得tag标签的关闭事件
      this.rolesListTagId.splice(this.rolesListTagId.indexOf(node.id), 1)
      this.rolesListTag = this.rolesListTag.filter(item => item.name != node.name)
    },
    deleteFunction() {
      Vue.prototype.$confirm({
        title: '确认删除帐号',
        onOk: () => {
          deleteById({ id: this.addParam.id }).then(res => {
            this.loading = false
            if (res.code == '1000000') {
              Vue.prototype.$message.success(res.resultStr)
              this.drawerVisible = false
              this.querySearch()
            } else {
              Vue.prototype.$message.error(res.resultStr)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.accountManagement {
  .paginationConten {
    display:flex;
    justify-content: flex-end;
    margin-top: 10px
  }
  .description {
    padding: 10px 20px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 6px;
    .ant-descriptions-title {
      padding: 0px 20px;
    }
    .ant-descriptions-view {
      padding: 0px 20px;
    }
  }
}
.accountDrawerDiv {
  .drawerTitleDes {
    border-left: 2px solid rgb(1, 150, 250);
    padding-left: 6px;
    color: #ccc;
    position: relative;
    top: -16px;
  }
  .drawerFooter {
    text-align: center;
    button {
      margin: 10px;
    }
  }
  .ant-tag {
    background-color: #888;
    color: #fff;
    font-size: 14px;
    padding: 2px 8px;
    .anticon-close {
      color: #fff;
    }
    .anticon {
      color: #fff;
    }
  }
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
.btn {
  cursor: pointer;
}
</style>
