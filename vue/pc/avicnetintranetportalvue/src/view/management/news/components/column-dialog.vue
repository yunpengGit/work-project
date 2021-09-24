<!--
 * @Descripttion: 栏目表单
 * @Author: zongmz
 * @Date: 2021-03-23 10:04:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-11 10:40:26
-->
<template>
  <div class="form-container">
    <!-- <div class="form-container-title"><span class="line" /><span class="name">{{ pageTitle }}</span></div> -->
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="130px"
      label-position="left"
    >
      <el-form-item label="上级栏目：">
        <treeselect
          v-model="form.parentId"
          :disabled="formDisabled"
          :options="catalogsTreeData"
          :default-expand-level="1"
          placeholder="请选择上级栏目"
        />
        <!-- <el-input v-model="form.name" /> -->
      </el-form-item>
      <el-form-item label="栏目名称：" prop="name">
        <el-input v-model="form.name" :disabled="formDisabled" />
      </el-form-item>
      <el-form-item label="栏目描述：" prop="description">
        <div class="w600">
          <el-input v-model="form.description" :maxlength="60" type="textarea" :row="2" placeholder="请输入内容，最多60个字符" :disabled="formDisabled" />
        </div>
      </el-form-item>
      <el-form-item label="封面：" prop="logoUrl">
        <cover-upload :image-url.sync="form.logoUrl" :page-type="routerType" :disabled="formDisabled" :file-options="fileOptions" @success="uploadSuccessFn" @updateImg="updateImgFn" />
        <span class="tips">图片应用于封面位置，支持：.jpg,.jpeg,.bmp,.gif,.png类型文件，500KB以下</span>
      </el-form-item>
      <el-form-item label="排序：" prop="showOrder">
        <el-input v-model="form.showOrder" :disabled="formDisabled" />
      </el-form-item>
      <el-form-item label="可见者：" prop="catalogViewerPerms">
        <div class="select-org-tree">
          <div class="container">
            <div
              v-for="(item, index) in form.catalogViewerPerms"
              :key="item.id"
              class="item"
            >
              <span>{{ item.label }}</span>
              <i
                class="delete el-icon-close"
                :class="{'disabled': formDisabled}"
                @click="deleteFn(index)"
              />
            </div>
            <div class="switch" :class="{'disabled': formDisabled}" @click="selectVisiable = true">
              <!-- <img src="@/assets/notice/can-reader-icon.png"> -->
              <icon-svg name="tongxunlu" class="icon" />
            </div>
          </div>
          <!-- <div class="tips">默认集团总部全员可见</div> -->
        </div>
      </el-form-item>
      <el-form-item label="栏目管理权限：" prop="catalogManagerPerms">
        <div class="select-org-tree">
          <div class="container">
            <div
              v-for="(item, index) in form.catalogManagerPerms"
              :key="item.id"
              class="item"
            >
              <span>{{ item.label }}</span>
              <i
                class="delete el-icon-close"
                :class="{'disabled': formDisabled}"
                @click="deleteManageFn(index)"
              />
            </div>
            <div class="switch" :class="{'disabled': formDisabled}" @click="selectVisiableManage = true">
              <!-- <img src="@/assets/notice/can-reader-icon.png"> -->
              <icon-svg name="tongxunlu" class="icon" />
            </div>
          </div>
          <!-- <div class="tips">默认集团总部全员可见</div> -->
        </div>
      </el-form-item>

      <!-- <el-form-item label="栏目ID：">
          <el-input v-model="form.id" />
        </el-form-item> -->
      <el-form-item v-show="routerType === 'view'" label="作者：">
        <el-input v-model="form.author" :disabled="true" />
      </el-form-item>
      <el-form-item v-show="routerType === 'view'" label="单位：">
        <el-input v-model="form.organization" :disabled="true" />
      </el-form-item>
      <el-form-item>
        <el-button v-if="routerType !== 'view'" type="primary" @click="saveFn">保存</el-button>
        <el-button v-if="routerType !== 'view'" @click="cancelFn">取消</el-button>
        <el-button v-if="routerType === 'view'" @click="cancelFn">返回</el-button>
      </el-form-item>
    </el-form>
    <!--选择可见者-->
    <select-personnel
      :dialog-visiable.sync="selectVisiable"
      :selected-list="form.catalogViewerPerms"
      @confirm="(val) => (form.catalogViewerPerms = val)"
    />
    <!--选择可见者-->
    <select-personnel
      :dialog-visiable.sync="selectVisiableManage"
      :selected-list="form.catalogManagerPerms"
      @confirm="(val) => (form.catalogManagerPerms = val)"
    />
  </div>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
const _cloneDeep = require('lodash.clonedeep')
import { getItem } from '@/utils/storage'
import iconSvg from '@/components/icon-svg'
// import SelectPersonnel from './../../../notice/SelectPersonnel'
import SelectPersonnel from '@/components/SelectPersonnel'
import CoverUpload from './cover-upload'
export default {
  components: {
    Treeselect,
    SelectPersonnel,
    CoverUpload,
    iconSvg
  },
  props: {
    routerType: {
      type: String,
      default: () => {}
    },
    columnData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      fileOptions: {
        type: '.jpg,.jpeg,.bmp,.gif,.png',
        size: 500 * 1024
      },
      isAdd: true,
      formDisabled: false,
      pageTitle: '新建栏目',
      catalogsTreeData: [],
      avicGroupInfo: {}, // 集团总部信息
      selectVisiable: false, // 可见者选择组织架构弹框开关
      selectVisiableManage: false, // 栏目管理权限选择组织架构弹框开关
      form: {
        parentId: null,
        name: '',
        description: '',
        logoUrl: '',
        showOrder: 0,
        catalogViewerPerms: [], // 可见者数组
        catalogManagerPerms: [], // 栏目管理权限
        author: '',
        organization: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入栏目名称', trigger: 'blur' },
          { max: 64, message: '长度最多 64 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请填写栏目描述', trigger: 'blur' },
          { max: 64, message: '长度最多 64 个字符', trigger: 'blur' }
        ],
        logoUrl: [
          { required: true, message: '请上传封面图片', trigger: 'change', validator: this.logoUrlFn }
        ],
        catalogViewerPerms: {
          required: true,
          message: '可阅读者尚未填写',
          trigger: 'change'
        }
      }
    }
  },
  watch: {
    columnData (newValue) {
      this.isAdd = false
      newValue.catalogViewerPerms = newValue.catalogViewerPerms && newValue.catalogViewerPerms.map(ele => {
        ele.id = ele.viewerId
        ele.label = ele.viewerName
        ele.type = ele.viewerType
        return ele
      })
      newValue.catalogManagerPerms = newValue.catalogManagerPerms && newValue.catalogManagerPerms.map(ele => {
        ele.id = ele.managerId
        ele.label = ele.managerName
        ele.type = ele.managerType
        return ele
      })
      this.form = newValue
    },
    routerType: {
      deep: true,
      immediate: true,
      handler: function (newVal, oldVal) {
        let str = '新建内容'
        switch (newVal) {
          case 'add':
            str = '新建内容'
            break
          case 'edit':
            str = '编辑栏目'
            break
          case 'view':
            str = '栏目详细'
            this.formDisabled = true
            break
          default:
            break
        }
        this.pageTitle = str
      }
    }
  },
  created () {
    const userInfo = JSON.parse(getItem('userInfo'))
    this.form.author = userInfo.nickName
    this.form.organization = userInfo.dept.companyName
    this.$api('news.catalogsTree').then(res => {
      const data = res.data
      ;(function recursive (data) {
        data && data.forEach(ele => {
          if (ele.status === 0) {
            ele.isDisabled = true
          }
          ele.viewerId = ele.id
          ele.label = ele.name
          if (ele.children) {
            if (ele.children.length === 0) {
              delete ele.children
            } else {
              recursive(ele.children)
            }
          }
        })
      })(data)
      this.catalogsTreeData = data
    })
    // 可见者初始化预选集团总部全员
    if (this.routerType === 'add') {
      this.$api('common.avicGroupInfo').then(res => {
        if (res.data && res.data.deptId) {
          this.avicGroupInfo = res.data
          const obj = {
            id: res.data.deptId,
            label: res.data.deptName,
            viewerId: res.data.deptId,
            viewerName: res.data.deptName,
            viewerType: res.data.orgType
          }
          this.$set(this.form.catalogViewerPerms, 0, obj)
        }
      })
    }
  },
  methods: {
    // 图片必填上传校验
    logoUrlFn (rule, value, callback = () => false) {
      // console.log('rule', rule, 'value', value, 'callback', callback)
      if (value === '') {
        callback(new Error('请上传封面图片'))
      } else {
        // console.log(123)
        if (this.form.logoUrl !== '') {
          // this.$refs.form.validateField('logoUrl')
        }
        callback()
      }
    },
    // 上传成功回调
    uploadSuccessFn (url) {
      // console.log(url)
      this.form.logoUrl = url
      // this.logoUrlFn()
    },
    // 表单数据处理
    async _getApiParams () {
      const isValidate = await this.$refs.form.validate()
      if (!isValidate) return
      const list = _cloneDeep(this.form.catalogViewerPerms)
      const arr = list && list.map(ele => {
        ele.viewerName = ele.label
        ele.viewerId = ele.id
        ele.viewerType = ele.isPerson ? 2 : 1
        ele.type = ele.viewerType
        return ele
      })
      // console.log(this.form)
      this.form.catalogViewerPerms = arr
      const listManage = _cloneDeep(this.form.catalogManagerPerms)
      const arrManage = listManage && listManage.map(ele => {
        ele.managerName = ele.label
        ele.managerId = ele.id
        ele.managerType = ele.isPerson ? 2 : 1
        ele.type = ele.managerType
        return ele
      })
      // console.log(this.form)
      this.form.catalogManagerPerms = arrManage
      return this.form
    },
    updateImgFn (imgUrl) {
      this.$confirm('是否删除该封面?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.logoUrl = imgUrl
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {})
    },
    // 删除可见者
    deleteFn (index) {
      this.form.catalogViewerPerms.splice(index, 1)
    },
    // 删除管理权限
    deleteManageFn (index) {
      this.form.catalogManagerPerms.splice(index, 1)
    },
    async saveFn () {
      let apiUrl = 'news.catalogsAdd'
      if (!this.isAdd) {
        apiUrl = 'news.catalogsEdit'
      }
      // const params = await this._getApiParams()
      this.$refs.form.validate((isValidate) => {
        if (isValidate) {
          const list = _cloneDeep(this.form.catalogViewerPerms)
          const arr = list && list.map(ele => {
            ele.viewerName = ele.label
            ele.viewerId = ele.id
            ele.viewerType = ele.managerType ? ele.managerType : (ele.isPerson ? 2 : 1)
            ele.type = ele.viewerType
            return ele
          })
          // console.log(this.form)
          this.form.catalogViewerPerms = arr
          const listManage = _cloneDeep(this.form.catalogManagerPerms)
          const arrManage = listManage && listManage.map(ele => {
            ele.managerName = ele.label
            ele.managerId = ele.id
            ele.managerType = ele.managerType ? ele.managerType : (ele.isPerson ? 2 : 1)
            ele.type = ele.managerType
            return ele
          })
          // console.log(this.form)
          this.form.catalogManagerPerms = arrManage
          this.$api(apiUrl, this.form).then(res => {
            this.$message.success('保存成功')
            this.$router.go(-1)
          })
        }
      })
    },
    cancelFn () {
      if (!this.isAdd) {
        this.$router.push('/news-manage/column/column-list')
      } else {
        if (this.isFormChange()) {
          this.$confirm('是否关闭新建栏目页?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.push('/news-manage/column/column-list')
          }).catch(() => {})
        } else {
          this.$router.push('/news-manage/column/column-list')
        }
      }
    },
    isFormChange () {
      let flag = false
      const arr = Object.values(this.form)
      // 判断 新建表单是否操作过

      const nullArr = arr.filter((item, index) => {
        return index > 0 && index < 4
      })
      // 第一项 判断是否未 null
      if (arr[0] !== null) {
        flag = true
      } else if (nullArr.some(e => e !== '')) { // 前 2 - 4 项判断非  ''
        flag = true
      } else if (arr[4] !== 0) { // 排序判断非 0
        flag = true
      } else if (arr[5].length > 1) { // 可见者判断 大于 一项
        flag = true
      } else if (arr[5] && arr[5][0] && arr[5][0].id !== this.avicGroupInfo.deptId) { // 可见者判断 非 初始化预选集团总部全员 一项
        flag = true
      }
      return flag
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./form.scss";
@import "./selectOrgTree.scss";
.new-container{
  .new-container-title{
    display: block;
    span{
      display: inline-block;
      vertical-align: top;
    }
    .line{
      display: inline-block;
      width: 4px;
      height: 15px;
      background-color: #1E89FF;
      margin-right: 10px;
    }
    .name{
      font-size: 16px;
      font-weight: bold;
      color: #191F24;
    }
  }
}
.tips{
  font-size: 12px;
  color: rgba(25, 31, 36, 0.48);
  line-height: 16px;
}
</style>
