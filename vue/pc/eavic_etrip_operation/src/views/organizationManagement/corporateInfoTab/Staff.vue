<template>
  <div class="departmentManagement">
    <div v-show='queryHide'>
      <div>员工列表</div>
      <a-divider />
      <div class="table-page-search-wrapper">
       <a-form layout="inline" >
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="员工姓名">
                <a-input
                v-model="queryParam.likeName"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="手机号码">
              <a-input
                v-model="queryParam.mobile"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="性别">
                <a-select v-model="queryParam.sex">
                  <a-select-option value="">所有</a-select-option>
                  <a-select-option :value='1'>男</a-select-option>
                  <a-select-option :value='2'>女</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="所属部门">
                 <a-input
                  v-model="queryParam.deptId"
                  style="width: 100%"
                  placeholder="请输入"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="企业职级">
                <a-select v-model="queryParam.categoryJobDuty">
                  <a-select-option :value="item.id" v-for="item in jobDutyList" :key="item.id">
                    {{ item.name }}
                  </a-select-option>
                  </a-select>
                <!-- <a-input
                  v-model="queryParam.categoryId"
                  style="width: 100%"
                  placeholder="请输入"
                /> -->
               </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="在职状态">
                <a-select v-model="queryParam.state">
                  <a-select-option value="">所有</a-select-option>
                  <a-select-option :value='1'>离职</a-select-option>
                  <a-select-option :value='0'>在职</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 6 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" html-type="submit" icon="search" @click="$refs.table.refreshFn(true)">
                  查询
                </a-button>
                <a-button @click="reset">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                 </a>
              </span>
          </a-col>
        </a-row>
      </a-form>
      </div>
      <a-divider />
      <s-table
        :columns="columns"
        ref="table"
        size="default"
        rowKey = "id"
        :data="loadData"
        showPagination="auto"
      >
        <span slot='state' slot-scope="state">
          <a-badge :status="state == 1?'default':'success'" :text="state == 1?'离职':'在职'" />
        </span>
        <span slot='operating' slot-scope="text, record" class="btn">
          <span class="blue" @click="detailRowIndex(record)">查看</span>
          <span class="blue" @click="editRowIndex(record)">编辑</span>
        </span>
        <span slot="sex" slot-scope="sex">
          <span v-text="sex==1?'男':'女'"></span>
        </span>
      </s-table>
    </div>
    <div v-show="!queryHide" class="table-page-search-wrapper">
      <div>编辑员工列表</div>
      <a-divider />
      <a-descriptions title="基本信息" layout="vertical">
      </a-descriptions>
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="8">
            <a-form-item label="员工姓名">
              <div>{{detailForm.name}}</div>
                <!-- <a-input
                v-model="detailForm.name"
                placeholder="请输入"
              /> -->
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="手机号码">
                <div>{{detailForm.mobile}}</div>
              <!-- <a-input
                v-model="detailForm.mobile"
                placeholder="请输入"
              /> -->
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="员工编号">
                <div>{{detailForm.user_no}}</div>
              <!-- <a-input
                v-model="detailForm.user_no"
                placeholder="请输入"
              /> -->
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="性别" >
              <div v-text="detailForm.sex==1?'男':'女'">{{detailForm.sex}}</div>
              <!-- <a-select v-model="detailForm.sex">
                <a-select-option :value='1'>男</a-select-option>
                <a-select-option :value='2'>女</a-select-option>
              </a-select> -->
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="邮箱" >
              <div>{{detailForm.email}}</div>
              <!-- <a-input
                v-model="detailForm.email"
                placeholder="请输入"
              /> -->
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="身份证号码">
              <a-input
                v-model="detailForm.idcard"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="生日" >
              <a-date-picker v-model="detailForm.birdthDay"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="所属部门">
              <div>{{detailForm.dept_id}}</div>
              <!-- <a-input
                v-model="detailForm.dept_id"
                placeholder="请输入"
              /> -->
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="企业职级">
              <div>{{detailForm.category_job_duty}}</div>
              <!-- <a-input
                v-model="detailForm.category_job_duty"
                placeholder="请输入"
              /> -->
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="在职状态" >
              <div v-text="queryParam.state ==1?'离职':'在职'"></div>
              <!-- <a-select v-model="queryParam.state">
                <a-select-option :value='1'>离职</a-select-option>
                <a-select-option :value='2'>在职</a-select-option>
              </a-select> -->
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="排序号" >
              <div>{{detailForm.country}}</div>
              <!-- <a-input
                v-model="detailForm.country"
                placeholder="请输入"
              /> -->
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="平台账号">
              <div>{{detailForm.country}}</div>
              <!-- <a-input
                v-model="detailForm.country"
                placeholder="请输入"
              /> -->
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!-- <a-descriptions title="基本信息" layout="vertical">
        <a-descriptions-item label="员工姓名">
          不知道字段
        </a-descriptions-item>
        <a-descriptions-item label="手机号码">
          不知道字段
        </a-descriptions-item>
        <a-descriptions-item label="员工编号">
          不知道字段
        </a-descriptions-item>
        <a-descriptions-item label="性别">
          不知道字段
        </a-descriptions-item>
        <a-descriptions-item label="邮箱">
          不知道字段
        </a-descriptions-item>
        <a-descriptions-item label="身份证号码">
          <a-input></a-input>
        </a-descriptions-item>
        <a-descriptions-item label="生日">
          <a-date-picker />
        </a-descriptions-item>
        <a-descriptions-item label="所属部门">
          不知道字段
        </a-descriptions-item>
        <a-descriptions-item label="企业职级">
          不知道字段
        </a-descriptions-item>
        <a-descriptions-item label="在职状态">
          不知道字段
        </a-descriptions-item>
        <a-descriptions-item label="排序号">
          不知道字段
        </a-descriptions-item>
        <a-descriptions-item label="平台账号">
          不知道字段
        </a-descriptions-item>
      </a-descriptions> -->
      <a-divider />
      <a-descriptions title="国际机票预订信息" layout="vertical">
        <a-descriptions-item label="护照号（因公）">
          <a-input v-model="detailForm.passportPublic"></a-input>
        </a-descriptions-item>
        <a-descriptions-item label="护照有效期（因公）">
          <a-date-picker />
        </a-descriptions-item>
        <a-descriptions-item label="护照英文名（因公）">
          <a-input v-model="detailForm.country"></a-input>
        </a-descriptions-item>
        <a-descriptions-item label="护照号（因私）">
          <a-input v-model="detailForm.passportPrivate"></a-input>
        </a-descriptions-item>
        <a-descriptions-item label="护照有效期（因私）">
          <a-date-picker />
        </a-descriptions-item>
        <a-descriptions-item label="护照英文名（因私）">
          <a-input v-model="detailForm.country"></a-input>
        </a-descriptions-item>
        <a-descriptions-item label="其他证件名称">
          <a-input v-model="detailForm.other_paperes"></a-input>
        </a-descriptions-item>
        <a-descriptions-item label="其他证件号">
          <a-input v-model="detailForm.laissez_passer"></a-input>
        </a-descriptions-item>
        <a-descriptions-item label="国籍">
          <a-input v-model="detailForm.country"></a-input>
        </a-descriptions-item>
      </a-descriptions>
      <div class="buttonFooter">
        <a-button type="primary" @click="editSave" icon='save'>保存</a-button>
        <a-button @click="()=> queryHide=true">取消</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getPersonListByCategoryId, getPersonById, getCategoryJobDutyList, getPersonCardList } from '@/api/organizationManagement/corporateInfo'
import { STable } from '@/components'
export default {
  name: 'departmentManagement',
  components: {
    STable
  },
  props: {
    treeSelected: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      advanced: true,
      queryHide: true,
      jobDutyList: [],
      queryParam: {
        categoryId: this.treeSelected.id,
        type: 2
        // name: '',
        // parentDepartment: '',
        // status: ''
      },
      detailForm: {},
      visible: false,
      loadData: parameter => {
        return getPersonListByCategoryId(Object.assign(parameter, this.queryParam, { categoryId: this.treeSelected.id, type: 2 }))
          .then(res => {
            return res.model
          })
      },
      columns: [{
        title: '员工姓名',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '手机号码',
        dataIndex: 'mobile',
        key: 'mobile'
      },
      {
        title: '员工编号',
        dataIndex: 'user_no',
        key: 'user_no'
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
        scopedSlots: { customRender: 'sex' }

      },
      {
        title: '所属部门',
        dataIndex: 'dept_id',
        key: 'dept_id'
      },
      {
        title: '企业职级',
        dataIndex: 'category_job_duty',
        key: 'category_job_duty'
      },
      {
        title: '在职状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: { customRender: 'state' }
      },
      {
        title: '操作',
        dataIndex: 'operating',
        width: 180,
        scopedSlots: { customRender: 'operating' }
      }],
      tableData: [{ state: '1' }]
    }
  },
  watch: {
  },
  created() {
    this.getJobDutyList()
  },
  methods: {
    getJobDutyList() {
      getCategoryJobDutyList({ categoryId: this.treeSelected.id }).then(res => {
        this.jobDutyList = res.model
      })
    },
    reset() {
      this.queryParam = {}
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    drawerClose() {
      this.visible = false
    },
    editRowIndex() {
      this.queryHide = false
      //
    },
    detailRowIndex(rowIndex) {
      this.detailForm = {}
      this.queryHide = false
      getPersonById({ id: rowIndex.id }).then(res => {
        if (res.code == '1000000') {
          this.detailForm = res.model
          const txtparm = this.detailForm.idcard
          if (txtparm.length == 18) {
            const year = txtparm.substring(6, 10)
            const month = txtparm.substring(10, 12)
            const date = txtparm.substring(12, 14)
            this.detailForm.birdthDay = year + '-' + month + '-' + date
          }
        }
      })
      getPersonCardList({ id: rowIndex.id }).then(res => {

      })
      //
    },
    editSave() {
      //
    }
  }
}
</script>

<style scoped lang="less">
@import './index.less'; // 这个分号一定要写，要不会报错
</style>
