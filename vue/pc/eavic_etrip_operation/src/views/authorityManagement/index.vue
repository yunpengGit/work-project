<template>
  <div class="authorityManagement">
    <a-tabs default-active-key="1" :animated="false" v-model="activeTab" @tabClick="tabAddHide">
      <a-tab-pane key="1" tab="角色管理"></a-tab-pane>
      <a-tab-pane key="2" tab="权限组管理"></a-tab-pane>
      <a-tab-pane key="3" tab="权限链接管理"></a-tab-pane>
    </a-tabs>
    <div>
      <div class="authorityDiv">
        <div class="treeDiv" v-if="activeTab == 2">
          <a-input-search style="margin-bottom: 8px" placeholder="ID、权限组编号、权限组名称" @change="onChangeTreeSearch"/>
          <a-tree :showLine="true" :tree-data="treeDataUserAuthority"
            :defaultSelectedKeys="authorityDefaultSelectedKeys"
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
        <div class="authorityLeft">
          <div v-show="rootNodeClickShow && !( modalSureBtnStatus=='add' || modalSureBtnStatus=='edit')">
            <p>权限组管理</p>
            <span>在根节点下创建新的权限组节点</span>
            <a-button type="primary" @click="authorityAdd">添加子节点</a-button>
          </div>
          <div class="activetab2" v-if="activeTab == 2" v-show="!authorityAddModal && !rootNodeClickShow && defaultGroupShowState">
            <p>权限组管理</p>
            <a-descriptions class="description">
              <a-descriptions-item label="权限组名称">
                {{tableRowIndex.name}}
              </a-descriptions-item>
              <a-descriptions-item label="添加人">
                {{tableRowIndex.createName}}
              </a-descriptions-item>
              <a-descriptions-item>
                <span slot="label">
                  <a-icon type="history" :style="{ fontSize: '18px'}"/>
                </span>
                {{tableRowIndex.createTime}}
              </a-descriptions-item>
              <a-descriptions-item label="权限组编号">
                {{tableRowIndex.uniqueUuid}}
              </a-descriptions-item>
              <a-descriptions-item label="修改人">
                {{tableRowIndex.updateName}}
              </a-descriptions-item>
              <a-descriptions-item>
                <span slot="label">
                  <a-icon type="history" :style="{ fontSize: '18px'}"/>
                </span>
                {{tableRowIndex.updateTime}}
              </a-descriptions-item>
              <a-descriptions-item label="权限组全路径">
                {{tableRowIndex.path}}
              </a-descriptions-item>
              <a-descriptions-item label="顺序号">
                {{tableRowIndex.priority}}
              </a-descriptions-item>
              <a-descriptions-item label=""></a-descriptions-item>
              <a-descriptions-item label="权限组描述">
                {{tableRowIndex.description}}
              </a-descriptions-item>
            </a-descriptions>
            <a-row :gutter="24" :style="{marginBottom:'46px'}">
              <a-col :push="6" :span="6">
                <a-button type="primary" @click="authorityAdd">添加子节点</a-button>
              </a-col>
              <a-col :push="5" :span="4">
                <a-button @click="authorityEdit">编辑</a-button>
              </a-col>
              <a-col :push="5" :span="6">
                <a-button @click="authorityDele">删除</a-button>
              </a-col>
            </a-row>
          </div>
          <div class="tabClassDiv" v-show="!addDivRoles && !authorityAddModal && !rootNodeClickShow && (defaultGroupShowState || activeTab!=2)">
            <div v-if="activeTab==2" style="padding:10px 0pxborderBottom:1px solid #ccc">已绑定的权限链接列表</div>
            <a-form-model ref="ruleForm" :model="queryParam" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" :style="{marginTop:'10px'}">
              <a-row :gutter="16">
                <a-col :span="6">
                  <a-form-model-item has-feedback label="ID">
                    <a-input v-model="queryParam.id" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item has-feedback label="名称">
                    <a-input v-model="queryParam.name" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item has-feedback label="状态" v-if="activeTab==1">
                    <a-select v-model="queryParam.state">
                      <a-select-option :value="item.value" v-for="(item, index) in statusList" :key="index">
                        {{ item.title }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item has-feedback label="链接" v-if="activeTab!=1">
                    <a-input v-model="queryParam.uri" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item has-feedback label="">
                    <a-button type="primary" icon="search" @click="querySearch()">查询</a-button>
                  </a-form-model-item>
               </a-col>
              </a-row>
            </a-form-model>
            <a-button v-if="activeTab!=2" type="primary" @click="add">添加</a-button>
            <a-button v-if="activeTab==1" :style="{marginLeft:'10px'}" type="primary" @click="refreshAll">刷新缓存</a-button>
            <a-button v-if="activeTab==3" :style="{marginLeft:'10px'}" type="primary" :disabled="batchDeleState" @click="batchDele">批量删除</a-button>
            <a-button v-if="activeTab==2" type="primary" @click="bindLink">绑定链接</a-button>
            <a-button v-if="activeTab==2" :style="{marginLeft:'10px'}" type="primary" :disabled="batchDeleState" @click="batchDele">批量删除</a-button>
            <a-table
              :columns="columns"
              :data-source="tableData"
              :style="{marginTop:'10px'}"
              :row-selection="rowSelection"
              :pagination="false"
              :rowKey="record => record.id + activeTab"
            >
              <span slot="state" slot-scope="state">
                <span>
                  <a-icon
                    :type="state == '1' ? 'close-circle' : 'check-circle'"
                    :class="state =='1' ? 'redSpan' : 'greenSpan'"
                  />
                  <span v-text="state == '1' ? '禁用' : '有效'" :class="state == '1' ? 'redSpan' : 'greenSpan'"></span>
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
              <span slot="selectTab1" slot-scope="text, record">
                <span>
                  <span class="blueSpan" @click="detailsRoles(record)">详情</span>
                  <span class="blueSpan" @click="editUriShow(record)">编辑</span>
                  <span class="redSpan" @click="deleRoles(record)">删除</span>
                  <!-- <span class="blueSpan" @click="refreshRole(record)">刷新缓存</span> -->
                  <!-- <span class="blueSpan">更多...</span> -->
                </span>
              </span>
              <span slot="selectTab3" slot-scope="text, record">
                <span>
                  <span class="blueSpan" @click="detailsRoles(record)">详情</span>
                  <span class="blueSpan" @click="editUriShow(record)">编辑</span>
                  <span class="redSpan" @click="deleUri(record)">删除</span>
                </span>
              </span>
              <span slot="selectTab2" slot-scope="text, record">
                <span>
                  <span class="blueSpan" @click="detailsAuthority(record)">详情</span>
                  <span class="redSpan" @click="deleteByLimituriId(record)">移除</span>
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
          <a-spin v-show="authorityAddModal" :spinning="loading">
            <p>
              <span @click="tabAddHide" style="cursor: pointer">权限组管理</span>
              <span style="padding:0px 6px">/</span>
              <span v-if="activeTab == 2" v-text="modalSureBtnStatus=='add'?'新增权限组':modalSureBtnStatus=='edit'?'编辑权限组':'无'" style="cursor: pointer"></span>
            </p>
            <a-form-model
              ref="ruleFormAddParamAuthority"
              :model="addParamAuthority"
              :rules="addParamRulesAuthority"
              :validateOnRuleChange="false"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 10 }"
              v-show="activeTab==2 &&( modalSureBtnStatus=='add' || modalSureBtnStatus=='edit')">
              <a-form-model-item label="父节点路径" prop="parentName">
                <div v-text="addParamAuthority.parentName"></div>
              </a-form-model-item>
              <a-form-model-item label="权限组名称" prop="name">
                <a-input v-model="addParamAuthority.name" />
              </a-form-model-item>
              <a-form-model-item label="权限组描述" prop="description">
                <a-input v-model="addParamAuthority.description" />
              </a-form-model-item>
              <a-form-model-item label="顺序号" prop="priority">
                <a-input v-model="addParamAuthority.priority" type="Number" />
              </a-form-model-item>
              <a-row :gutter="16">
                <a-col :push="10" :span="12">
                  <a-button type="primary" @click="authorityAddModalSave">保存</a-button>
                </a-col>
                <a-col :span="6">
                  <a-button @click="tabAddHide">取消</a-button>
                </a-col>
              </a-row>
            </a-form-model>
          </a-spin>
        </div>
      </div>
    </div>
    <a-spin v-show="addDivRoles" :spinning="loading">
      <p><span @click="tabAddHide" style="cursor: pointer" v-text="activeTab== 1?'角色列表':activeTab==3 ?'权限链接列表':'权限组管理'">/</span>
      <span style="padding:0px 6px">/</span>
      <span v-if="activeTab == 1" v-text="modalSureBtnStatus=='add'?'添加角色':modalSureBtnStatus=='detail'?'角色详情':'角色修改'" style="cursor: pointer"></span>
      <span v-if="activeTab == 3" v-text="modalSureBtnStatus=='add'?'添加权限链接':modalSureBtnStatus=='detail'?'权限链接详情':'权限链接修改'" style="cursor: pointer"></span>
      <span v-if="activeTab == 2" v-text="modalSureBtnStatus=='add'?'添加角色':modalSureBtnStatus=='detail'?'角色详情':'角色修改'" style="cursor: pointer"></span></p>
      <a-form-model
        ref="ruleForm"
        :model="addParam"
        :rules="addParamRules"
        :validateOnRuleChange="false"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 10 }"
        v-show="modalSureBtnStatus=='add' || modalSureBtnStatus=='edit'?true:false">
        <a-form-model-item :label="activeTab== 1?'角色名称':activeTab==3?'链接名称':'无'" prop="name">
          <a-input v-model="addParam.name" />
        </a-form-model-item>
        <a-form-model-item label="链接地址" prop="uri" v-if="activeTab==3">
          <a-input v-model="addParam.uri" />
        </a-form-model-item>
        <a-form-model-item label="状态" prop="state" v-if="activeTab==1">
          <a-radio-group v-model="addParam.state">
            <a-radio :value="0">有效</a-radio>
            <a-radio :value="1">禁用</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="操作权限" prop="limitgroupIds" v-if="activeTab==1">
          <a-tree v-model="addParam.limitgroupIds" checkable
            :tree-data="treeDataUser"
            :replaceFields="{title:'name', key:'id'}"
            :defaultExpandedKeys='limitgroupIdsNow'
            :auto-expand-parent="autoExpandParentlimitgroup"
            :expandedKeys='limitgroupIdsNow'
            @expand="onExpandlimitgroup"
          />
        </a-form-model-item>
        <a-row :gutter="16">
          <a-col :push="10" :span="12">
            <a-button type="primary" @click="addModalhandleOk">保存</a-button>
          </a-col>
          <a-col :span="6">
            <!-- <a-button @click="() => { addDivRoles === false }">取消</a-button> -->
            <a-button @click="tabAddHide">取消</a-button>
          </a-col>
        </a-row>
      </a-form-model>
      <div v-show="modalSureBtnStatus=='detail'?true:false">
        <a-descriptions class="description" :title="activeTab==1?'角色信息':activeTab==3?'权限链接详情':'无'">
          <a-descriptions-item :label="activeTab==1?'角色名称':activeTab==3?'链接名称':'无'">
            {{tableRowIndex.name}}
          </a-descriptions-item>
          <a-descriptions-item label="添加人">
            {{tableRowIndex.createName}}
          </a-descriptions-item>
          <a-descriptions-item>
            <span slot="label">
              <a-icon type="history" :style="{ fontSize: '18px'}"/>
            </span>
            {{tableRowIndex.createTime}}
          </a-descriptions-item>
          <a-descriptions-item label="角色状态" v-if="activeTab == 1">
            <a-icon
              :type="tableRowIndex.state == '1' ? 'close-circle' : 'check-circle'"
              :class="tableRowIndex.state === '1' ? 'redSpan' : 'greenSpan'"
            />
            <span v-text="tableRowIndex.state === '1' ? '禁用' : '有效'" :class="tableRowIndex.state === '1' ? 'redSpan' : 'greenSpan'"></span>
          </a-descriptions-item>
          <a-descriptions-item label="链接地址" v-if="activeTab == 3">
            {{tableRowIndex.uri}}
          </a-descriptions-item>
          <a-descriptions-item label="修改人">
            {{tableRowIndex.updateName}}
          </a-descriptions-item>
          <a-descriptions-item>
            <span slot="label">
              <a-icon type="history" :style="{ fontSize: '18px'}"/>
            </span>
            {{tableRowIndex.updateTime}}
          </a-descriptions-item>
        </a-descriptions>
        <a-descriptions class="description" title="可操作权限" v-if="activeTab == 1">
          <a-descriptions-item>
            <a-tree v-model="addParam.limitgroupIds" checkable
              :tree-data="treeDataUser"
              :defaultExpandedKeys='limitgroupIdsNow'
              :defaultCheckedKeys='limitgroupIdsNow'
              :expandedKeys='limitgroupIdsNow'
              :auto-expand-parent="true"
              :replaceFields="{title:'name', key:'id'}"
              disabled
            />
          </a-descriptions-item>
        </a-descriptions>
        <a-row :gutter="16">
          <a-col :push="10" :span="12">
            <a-button type="primary" @click="editUriShow(tableRowIndex)">修改</a-button>
          </a-col>
          <a-col :span="6">
            <!-- <a-button @click="() => { addDivRoles === false }">取消</a-button> -->
            <a-button @click="deleRoles(tableRowIndex)">删除</a-button>
          </a-col>
        </a-row>
      </div>
    </a-spin>
    <a-modal class="detailModalStyle" v-model="addModal" title="权限组详情" @ok="deleteByLimituriId(addParamAuthorityDatil)" okText='删除' @cancel="authorityStateCale">
      <a-form-model
        :model="addParamAuthorityDatil"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 10 }"
        v-show="authorityState == 'detail'"
      >
        <a-form-model-item label="链接名称">
          <div>{{addParamAuthorityDatil.name}}</div>
        </a-form-model-item>
        <a-form-model-item label="链接地址">
          <div>{{addParamAuthorityDatil.uri}}</div>
        </a-form-model-item>
        <a-form-model-item label="绑定人">
          <div>{{addParamAuthorityDatil.createName}}</div>
        </a-form-model-item>
        <a-form-model-item label="绑定时间">
          <div>{{addParamAuthorityDatil.createTime}}</div>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal v-model="authorityShowTable" title="权限组详情" @cancel="authorityStateCale" width='75%' :footer='null'>
      <div>
        <a-form-model :model="queryParam" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" :style="{marginTop:'10px'}">
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-model-item label="ID">
                <a-input v-model="queryParam.id" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="名称">
                <a-input v-model="queryParam.name" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="链接">
                <a-input v-model="queryParam.uri" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="">
                <a-button type="primary" icon="search" @click="querySearch()">查询</a-button>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
        <a-button type="primary" icon="search" @click="bindSelected()">绑定选中项</a-button>
        <a-table
          :columns="columns"
          :data-source="tableDataAuthority"
          :style="{marginTop:'10px'}"
          :row-selection="rowSelectionAuthority"
          :pagination="false"
          :rowKey="record => record.id"
        >
          <span slot="selectTab2" slot-scope="text, record">
            <span>
              <span style="color: blue;padding: 0px 6px;cursor: pointer" class="blueSpan" @click="detailsAuthority(record)">详情</span>
              <span style="color: blue;padding: 0px 6px;cursor: pointer" class="blueSpan" v-if="!record.bindState" @click="bindSelected(record)">绑定</span>
              <span style="color:#ccc;padding: 0px 6px" v-if="record.bindState">已绑定</span>
            </span>
          </span>
        </a-table>
        <a-pagination
          class="paginationConten"
          show-size-changer
          show-quick-jumper
          :style="{display:'flex',justifyContent: 'flex-end',marginTop: '10px'}"
          :showTotal="totalAuthority => `共 ${totalAuthority} 条`"
          :page-size-options="pageSizeOptionsAuthority"
          :total="totalAuthority"
          :pageSize="pageSizeAuthority"
          :defaultCurrent="pageNumberAuthority"
          :current="pageNumberAuthority"
          @change="pageChange"
          @showSizeChange="pageSizeChange"
        />
      </div>
    </a-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import ApiAuthority from '@/api/service'
import { Input, Tabs, Button, Select, FormModel, Row, Col, Table, Pagination, Modal, Radio, message, Tree, Breadcrumb, Spin, Descriptions } from 'ant-design-vue'
Vue.use(Input).use(Tabs).use(FormModel).use(Button).use(Select).use(Row).use(Col).use(Table).use(Pagination).use(Modal).use(Radio).use(message).use(Tree).use(Breadcrumb).use(Spin)
Vue.use(Descriptions)

export default {
  data() {
    return {
      activeTab: '',
      queryParam: {
        name: '',
        state: '',
        id: '',
        uri: ''
      },
      statusList: [
        {
          title: '所有',
          value: ''
        },
        {
          title: '有效',
          value: 0
        },
        {
          title: '禁用',
          value: 1
        }
      ],
      columns: [],
      tableData: [],
      pageSizeOptions: ['10', '20', '30', '50'],
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      addModal: false,
      modalSureBtnStatus: '',
      addParam: {
        name: '',
        state: 0,
        uri: '',
        id: '',
        limitgroupIds: []
      },
      authorityAddModal: false,
      addParamAuthority: {
        parentName: '',
        name: '',
        description: '',
        parentId: '',
        priority: '',
        uniqueUuid: ''
      },
      tableDataAuthority: [],
      pageSizeOptionsAuthority: ['10', '20', '30', '50'],
      pageNumberAuthority: 1,
      pageSizeAuthority: 10,
      totalAuthority: 0,
      addParamRules: {
        name: [
          { required: true, message: '用户角色必填', trigger: 'blur' },
          { min: 1, max: 20, message: '最多能输入20个字符', trigger: 'blur' }
        ],
        state: [{ required: true, message: '状态必选', trigger: 'change' }],
        uri: [{ required: true, message: '链接地址必填', trigger: 'blur' }],
        limitgroupIds: [{ required: true, message: '请选择权限组', trigger: 'change' }]
      },
      addParamRulesAuthority: {
        name: [
          { required: true, message: '权限组名称必填', trigger: 'blur' },
          { min: 1, max: 15, message: '最多能输入15个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '权限组描述必填', trigger: 'blur' },
          { min: 1, max: 50, message: '最多能输入50个字符', trigger: 'blur' }
        ],
        priority: [
          { required: true, message: '权限组描述必填', trigger: 'blur' },
          { min: 1, max: 5, message: '最多能输入5个字符', trigger: 'blur' }
        ]
      },
      addParamAuthorityDatil: {},
      authorityState: '',
      selectedRowKeys: [],
      authorityShowTable: false,
      selectedRowKeysAuthority: [],
      selectedRows: [],
      batchDeleState: true,
      loading: false,
      addDivRoles: false,
      tableRowIndex: {},
      limitgroupIdsNow: [],
      authorityDefaultSelectedKeys: [],
      expandedKeys: [0],
      searchValue: '',
      autoExpandParent: true,
      autoExpandParentlimitgroup: true,
      dataList: [],
      treeDataUser: [],
      treeDataUserAuthority: [],
      treeData: [],
      rootNodeClickShow: false,
      AllLimituriListByLimitgroupId: [],
      defaultGroupShowState: false
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
    },
    rowSelectionAuthority() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
          if (this.authorityState == 'showTable') {
            this.selectedRowKeysAuthority = selectedRowKeys
          }
        },
        selectedRowKeys: this.selectedRowKeysAuthority,
        getCheckboxProps: record => {
          return {
            props: {
              disabled: record.bindState
            }
          }
        }
      }
    }
  },
  watch: {
    activeTab(active) {
      this.queryParam.id = ''
      this.queryParam.name = ''
      this.queryParam.uri = ''
      this.queryParam.state = ''
      this.tableRowIndex = {}
      this.defaultGroupShowState = false
      if (active == 1) {
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
            title: '名称',
            key: 'name',
            dataIndex: 'name',
            ellipsis: true
          },
          {
            title: '状态',
            key: 'state',
            dataIndex: 'state',
            scopedSlots: { customRender: 'state' }
          },
          {
            title: '添加人',
            key: 'createName',
            dataIndex: 'createName',
            scopedSlots: { customRender: 'createName' }
          },
          {
            title: '修改人',
            key: 'updateName',
            dataIndex: 'updateName',
            scopedSlots: { customRender: 'updateName' }
          },
          {
            title: '操作',
            key: 'selectTab1',
            dataIndex: 'selectTab1',
            scopedSlots: { customRender: 'selectTab1' }
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
            title: '名称',
            key: 'name',
            dataIndex: 'name',
            ellipsis: true
          },
          {
            title: '链接',
            key: 'uri',
            dataIndex: 'uri',
            ellipsis: true
          },
          {
            title: '修改人',
            key: 'updateName',
            dataIndex: 'updateName',
            scopedSlots: { customRender: 'updateName' }
          },
          {
            title: '操作',
            key: 'selectTab3',
            dataIndex: 'selectTab3',
            scopedSlots: { customRender: 'selectTab3' }
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
            title: '链接名称',
            key: 'name',
            dataIndex: 'name',
            ellipsis: true
          },
          {
            title: '链接',
            key: 'uri',
            dataIndex: 'uri',
            ellipsis: true
          },
          {
            title: '操作',
            key: 'selectTab2',
            dataIndex: 'selectTab2',
            scopedSlots: { customRender: 'selectTab2' }
          }
        ]
      }
      this.querySearch()
    }
  },
  created() {
    this.activeTab = '1'
    this.getLimitgroupTree()
  },
  methods: {
    getLimitgroupTree() {
      ApiAuthority.getLimitgroupTreeByName({ name: '' }).then(res => {
        if (res.code == '1000000') {
          this.treeDataUser = res.model
          const treeData = [{ id: 0, name: '根结点', uniqueUuid: '0', children: [] }]
          treeData[0].children = res.model
          // this.treeDataUser = treeData
          this.treeDataUserAuthority = treeData
          this.generateList(this.treeDataUserAuthority)
        } else {
          message.error(res.resultStr)
        }
      })
    },
    querySearch(pageNumber, pageSize) {
      let params = {}
      if (this.authorityState == 'showTable') {
        this.pageNumberAuthority = pageNumber || 1
        params = Object.assign({}, this.queryParam, { pageSize: pageSize || this.pageSizeAuthority, pageNumber: pageNumber || this.pageNumberAuthority })
      } else {
        this.pageNumber = pageNumber || 1
        params = Object.assign({}, this.queryParam, { pageSize: pageSize || this.pageSize, pageNumber: pageNumber || this.pageNumber })
      }
      let queryApi = null
      if (this.activeTab == 3) { // uri查询
        queryApi = ApiAuthority.getPageByParamsUri
      } else if (this.activeTab == 1) { // 角色查询
        queryApi = ApiAuthority.getPageByParamsRoles
      } else if (this.activeTab == 2) { // 已绑定的权限链接列表
        if (this.authorityShowTable) {
          queryApi = ApiAuthority.getPageByParamsUri
        } else {
          queryApi = ApiAuthority.getLimituriPageByLimitgroupId
          params.uriName = params.name
          params.limituriId = params.id
          params.limitgroupId = this.tableRowIndex.id || 0
        }
      }
      this.selectedRowKeys = []
      this.selectedRows = []
      queryApi(params).then(res => {
        if (res.code == '1000000') {
          if (this.authorityState == 'showTable') {
            const tableData = JSON.parse(JSON.stringify(res.model.list))
            tableData.map(item => {
              if (this.AllLimituriListByLimitgroupId.indexOf(item.id) > -1) {
                item.bindState = true
              } else {
                item.bindState = false
              }
            })
            this.tableDataAuthority = tableData
            this.totalAuthority = res.model.totalRow
            this.pageNumberAuthority = res.model.pageNumber
            this.pageSizeAuthority = res.model.pageSize
            this.selectedRowKeysAuthority = []
            return false
          }
          this.tableData = res.model.list
          this.total = res.model.totalRow
          this.pageNumber = res.model.pageNumber
          this.pageSize = res.model.pageSize
          this.selectedRowKeys = []
        } else {
          message.error(res.resultStr)
          this.tableData = []
          this.total = 0
          this.pageNumber = 1
          this.pageSize = 10
          this.selectedRowKeys = []
        }
      })
    },
    pageChange(current, size) {
      if (this.authorityState == 'showTable') {
        this.pageNumberAuthority = current
        this.pageSizeAuthority = size
        this.querySearch(current, size)
        return false
      }
      this.pageNumber = current
      this.pageSize = size
      this.querySearch(current, size)
    },
    pageSizeChange(current, size) {
      if (this.authorityState == 'showTable') {
        this.pageNumberAuthority = 1
        this.pageSizeAuthority = size
        this.querySearch(1, size)
        return false
      }
      this.pageNumber = 1
      this.pageSize = size
      this.querySearch(1, size)
    },
    getLimitgroupList(params = {}) {
      // 不传参数查所有，传参数表示指定
      ApiAuthority.getLimitgroupListByRoleId(params).then(res => {
        if (res.code == '1000000') {
          const returnData = res.model
          const ids = []
          returnData.map(item => {
            ids.push(item.id)
          })
          this.limitgroupIdsNow = ids
          this.addParam.limitgroupIds = JSON.parse(JSON.stringify(this.limitgroupIdsNow))
        } else {
          message.error(res.resultStr)
        }
      })
    },
    add() {
      this.loading = false
      this.addDivRoles = true
      // this.addModal = false
      this.modalSureBtnStatus = 'add'
      // this.$refs.ruleForm.resetFields()
      this.addParam.uri = ''
      this.addParam.name = ''
      this.addParam.state = 0
      this.addParam.limitgroupIds = []
    },
    addModalhandleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          const params = {}
          let uriApi = null
          // uri 新增修改服务
          if (this.activeTab == 3) {
            params.uri = this.addParam.uri
            params.name = this.addParam.name
            if (this.modalSureBtnStatus == 'add') {
              params.id = ''
              uriApi = ApiAuthority.saveUri
            } else if (this.modalSureBtnStatus == 'edit') {
              params.id = this.addParam.id
              uriApi = ApiAuthority.updateUri
            }
          }
          // 角色 新增修改服务
          if (this.activeTab == 1) {
            params.subordinateSystem = 0
            params.name = this.addParam.name
            params.state = this.addParam.state
            // params.limitgroupIds = this.addParam.limitgroupIds.join(',')
            params.limitgroupIds = this.addParam.limitgroupIds
            if (this.modalSureBtnStatus == 'add') {
              uriApi = ApiAuthority.saveRoles
            } else if (this.modalSureBtnStatus == 'edit') {
              params.id = this.tableRowIndex.id
              uriApi = ApiAuthority.updateRoles
            }
          }
          console.log('入参', params)
          console.log('入参2', uriApi)
          // 所有新增修改调用服务的地方
          uriApi(params).then(res => {
            this.loading = false
            if (res.code == '1000000') {
              message.success(res.resultStr)
              this.addDivRoles = false
              this.querySearch()
            } else {
              message.error(res.resultStr)
            }
          })
        } else {
          return false
        }
      })
    },
    editUriShow(rowIndex) {
      this.modalSureBtnStatus = 'edit'
      this.addParam.limitgroupIds = []
      this.addParam.limitgroupIds = JSON.parse(JSON.stringify(this.limitgroupIdsNow))
      if (this.activeTab == 3) {
        this.addDivRoles = true
        this.addParam.uri = rowIndex.uri
        this.addParam.name = rowIndex.name
        this.addParam.id = rowIndex.id
      } else if (this.activeTab == 1) {
        this.tableRowIndex = rowIndex
        this.addDivRoles = true
        // this.addModal = false
        this.addParam.name = this.tableRowIndex.name
        this.addParam.state = Number(this.tableRowIndex.state)
        this.getLimitgroupList({ id: rowIndex.id })
      }
    },
    deleUri(rowIndex) {
      Modal.confirm({
        title: '确认删除此权限链接？',
        onOk: () => {
          ApiAuthority.deleteByIdUri({ id: rowIndex.id }).then(res => {
            if (res.code == '1000000') {
              message.success(res.resultStr)
              this.querySearch()
            } else {
              message.error(res.resultStr)
            }
          })
        }
      })
    },
    batchDele() { // 批量删除
      Modal.confirm({
        title: this.activeTab == 3 ? '确认删除选中的权限链接？' : this.activeTab == 2 ? '确认从权限组移除链接？' : '',
        onOk: () => {
          const ids = []
          this.selectedRows.map(item => {
            ids.push(item.id)
          })
          let api = null
          const params = {}
          if (this.activeTab == 3) {
            api = ApiAuthority.deleteByIdsUri
            params.ids = ids.join(',')
          } else if (this.activeTab == 2) {
            api = ApiAuthority.deleteByLimitgroupIdAndLimituriIds
            params.limitgroupId = this.tableRowIndex.id
            params.limituriIds = ids.join(',')
          }
          api(params).then(res => {
            if (res.code == '1000000') {
              message.success(`${res.resultStr}共${res.model}条`)
              this.querySearch()
            } else {
              message.error(res.resultStr)
            }
          })
        }
      })
    },
    refreshAll() {
      Modal.confirm({
        title: '确认刷新选中角色的权限缓存？',
        onOk: () => {
          const ids = []
          this.selectedRows.map(item => {
            ids.push(item.id)
          })
          if (ids.length == 0) {
            message.warn('请至少选择一条数据！')
            return false
          }
          ApiAuthority.refreshRoleCacheById({ ids: ids }).then(res => {
            if (res.code == '1000000' && res.model) {
              message.success(res.resultStr)
              this.querySearch()
            } else {
              message.error(res.resultStr)
            }
          })
        }
      })
      // Modal.confirm({
      //   title: '确认刷新所有角色对应的权限？',
      //   onOk: () => {
      //     ApiAuthority.refreshAllCache({}).then(res => {
      //       if (res.code == '1000000' && res.model) {
      //         message.success(res.resultStr)
      //         this.querySearch()
      //       } else {
      //         message.error(res.resultStr)
      //       }
      //     })
      //   }
      // })
    },
    refreshRole(rowIndex) {
      Modal.confirm({
        title: '确认刷新指定角色对应的权限？',
        onOk: () => {
          ApiAuthority.refreshRoleCacheById({ id: rowIndex.id }).then(res => {
            if (res.code == '1000000' && res.model) {
              message.success(res.resultStr)
              this.querySearch()
            } else {
              message.error(res.resultStr)
            }
          })
        }
      })
    },
    tabAddHide() {
      this.addDivRoles = false
      this.authorityAddModal = false
      this.modalSureBtnStatus = ''
    },
    detailsRoles(rowIndex) {
      console.log(rowIndex)
      this.addDivRoles = true
      this.modalSureBtnStatus = 'detail'
      this.tableRowIndex = rowIndex
      this.getLimitgroupList({ id: rowIndex.id })
      // this.addParam.limitgroupIds = JSON.parse(JSON.stringify(this.limitgroupIdsNow))
    },
    deleRoles(rowIndex) {
      // 删除角色
      Modal.confirm({
        title: '确认删除此角色？',
        onOk: () => {
          ApiAuthority.deleteByIdRoles({ id: rowIndex.id }).then(res => {
            if (res.code == '1000000' && res.model) {
              message.success(res.resultStr)
              this.addDivRoles = false
              this.querySearch()
            } else {
              message.error(res.resultStr)
            }
          })
        }
      })
    },
    authorityAdd() {
      this.authorityAddModal = true
      this.$refs.ruleFormAddParamAuthority.resetFields()
      this.modalSureBtnStatus = 'add'
      this.addParamAuthority.parentName = this.tableRowIndex.name
      this.addParamAuthority.parentId = this.tableRowIndex.id
    },
    authorityAddModalSave() {
      // 权限管理新增字节点
      const params = this.addParamAuthority
      let apiServe = null
      if (this.modalSureBtnStatus == 'add') {
        params.id = ''
        // 新增
        apiServe = ApiAuthority.saveGroup
      } else if (this.modalSureBtnStatus == 'edit') {
        // 编辑
        apiServe = ApiAuthority.updateGroup
      }
      apiServe(params).then(res => {
        if (res.code == '1000000' && res.model) {
          message.success(res.resultStr)
          this.getLimitgroupTree()
          // this.addDivRoles = false
          this.authorityAddModal = false
          this.modalSureBtnStatus = ''
          this.selectedTreeAuthority([this.tableRowIndex.id])
        } else {
          message.error(res.resultStr)
        }
      })
    },
    authorityEdit() {
      this.authorityAddModal = true
      this.modalSureBtnStatus = 'edit'
      this.addParamAuthority.id = this.tableRowIndex.id
      this.addParamAuthority.parentName = this.tableRowIndex.name
      this.addParamAuthority.parentId = this.tableRowIndex.parentId
      this.addParamAuthority.name = this.tableRowIndex.name
      this.addParamAuthority.uniqueUuid = this.tableRowIndex.uniqueUuid
      this.addParamAuthority.description = this.tableRowIndex.description
      this.addParamAuthority.priority = this.tableRowIndex.priority
    },
    authorityDele() {
      // 权限删除
      Modal.confirm({
        title: '确认删除此权限组？',
        onOk: () => {
          ApiAuthority.deleteByIdGroup({ id: this.tableRowIndex.id }).then(res => {
            if (res.code == '1000000' && res.model) {
              message.success(res.resultStr)
              this.defaultGroupShowState = false
              this.getLimitgroupTree()
            } else {
              message.error(res.resultStr)
            }
          })
        }
      })
    },
    detailsAuthority(rowIndex) {
      // 权限详情
      this.addModal = true
      this.authorityState = 'detail'
      this.addParamAuthorityDatil = rowIndex
    },
    bindLink() {
      // 查询所有已绑定的uri
      this.getAllLimituriListByLimitgroupId()
      this.authorityShowTable = true
      this.authorityState = 'showTable'
      this.pageNumberAuthority = 1
      this.pageSizeAuthority = 10
      this.queryParam.name = ''
      this.queryParam.id = ''
      this.queryParam.uri = ''
    },
    getAllLimituriListByLimitgroupId() {
      ApiAuthority.getLimituriListByLimitgroupId({ id: this.tableRowIndex.id }).then(res => {
        if (res.code == '1000000') {
          this.AllLimituriListByLimitgroupId = []
          const table = JSON.parse(JSON.stringify(res.model))
          for (let i = 0; i < table.length; i++) {
            this.AllLimituriListByLimitgroupId.push(table[i].id)
          }
          this.querySearch()
        } else {
          message.error(res.resultStr)
        }
      })
    },
    selectedTreeAuthority(selectedKeys) {
      this.defaultGroupShowState = true
      if (selectedKeys.length == 0) {
        this.tableRowIndex = {}
        this.defaultGroupShowState = false
        return false
      }
      // 权限组左侧树点击时调用接口获取详情。
      // e:{selected: bool, selectedNodes, node, event}
      this.queryParam.name = ''
      this.queryParam.id = ''
      this.queryParam.uri = ''
      if (selectedKeys.length === 0) {
        return false
      }
      if (selectedKeys[0] === 0) {
        this.tableRowIndex.name = '运营系统'
        this.tableRowIndex.id = 0
        this.rootNodeClickShow = true
        return false
      }
      this.rootNodeClickShow = false
      this.tableRowIndex.id = selectedKeys[0]
      ApiAuthority.getById({ id: selectedKeys[0] }).then(res => {
        if (res.code === 1000000) {
          this.tableRowIndex = res.model
        } else {
          message.error(res.resultStr)
        }
      })
      this.querySearch()
    },
    getParentKey(key, tree) {
      let parentKey
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.children) {
          if (node.children.some(item => (item.id === key.id || item.name === key.name || item.uniqueUuid === key.uniqueUuid))) {
            parentKey = node.id
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children)
          }
        }
      }
      return parentKey
    },
    generateList(data) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        node.scopedSlots = { title: 'name' }
        node.key = node.id
        // ID、权限组编号、权限组名称
        this.dataList.push({ id: node.id, name: node.name, uniqueUuid: node.uniqueUuid })
        if (node.children) {
          this.generateList(node.children)
        }
      }
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onChangeTreeSearch(e) {
      const value = e.target.value
      const expandedKeys = this.dataList
        .map(item => {
          // || item.id.toString().indexOf(value) > -1
          if (item.name.indexOf(value) > -1 || item.uniqueUuid.indexOf(value) > -1) {
            return this.getParentKey(item, this.treeDataUser)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      console.log(expandedKeys, value)
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
    },
    onExpandlimitgroup(expandedKeys) {
      this.limitgroupIdsNow = expandedKeys
      this.autoExpandParentlimitgroup = false
    },
    bindSelected(rowIndex = {}) {
      const params = {
        limitgroupId: this.tableRowIndex.id,
        limituriIds: rowIndex.id || this.selectedRowKeysAuthority.join(',')
      }
      Modal.confirm({
        title: '确认绑定选中项？',
        onOk: () => {
          ApiAuthority.saveBatch(params).then(res => {
            if (res.code == '1000000' && res.model) {
              message.success(res.resultStr)
              this.bindLink()
            } else {
              message.error(res.resultStr)
            }
          })
        }
      })
    },
    deleteByLimituriId(rowIndex) {
      Modal.confirm({
        title: '确认从权限组移除链接？',
        onOk: () => {
          const params = {
            limituriIds: rowIndex.id,
            limitgroupId: this.tableRowIndex.id
          }
          ApiAuthority.deleteByLimitgroupIdAndLimituriIds(params).then(res => {
            if (res.code === 1000000) {
              message.success(res.resultStr)
              this.addModal = false
              this.querySearch()
            } else {
              message.error(res.resultStr)
            }
          })
        }
      })
    },
    authorityStateCale() {
      this.authorityState = ''
      this.authorityShowTable = false
      this.querySearch()
    }
  }
}
</script>
<style lang="less" scoped>
.authorityManagement {
  table {
    .redSpan {
      color: red;
      cursor: pointer;
    }
    .greenSpan {
      color: green;
    }
    .blueSpan {
      color: blue;
      padding-right: 6px;
      cursor: pointer;
    }
  }
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
  .authorityDiv {
    display: flex;
    .treeDiv {
      width: 360px;
      height: 100%;
      padding: 0px 10px 0px;
      overflow: hidden;
      flex-direction: row;
    }
    .authorityLeft {
      width: 400px;
      flex-grow: 1;
      padding: 4px 0px 10px 10px;
      flex-direction: row;
    }
  }
}
</style>
