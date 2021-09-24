<!--
 * @Descripttion: 栏目表单
 * @Author: zongmz
 * @Date: 2021-03-23 10:04:44
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-05-27 20:19:10
-->
<template>
  <div class="form-container">
    <!-- <div class="form-container-title"><span class="line" /><span class="name">{{ pageTitle }}</span></div> -->
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="栏目：" prop="catalogId">
        <treeselect
          v-model="form.catalogId"
          :disabled="formDisabled"
          :options="catalogsTreeData"
          :default-expand-level="1"
          placeholder="请选择栏目"
        />
      </el-form-item>
      <el-form-item label="标题：" prop="title">
        <el-input v-model="form.title" :disabled="formDisabled" />
      </el-form-item>
      <el-form-item label="MJ：" prop="secretLevel">
        <el-select v-model="form.secretLevel">
          <el-option
            v-for="item in secretLevel"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="封面：" prop="logoUrl">
        <cover-upload :image-url="form.logoUrl" :disabled="formDisabled" :page-type="routerType" :file-options="fileOptions" @success="uploadSuccessFn" @updateImg="updateImgFn" />
        <span class="tips">图片应用于封面位置，支持：.jpg,.jpeg,.bmp,.gif,.png类型文件，500KB以下</span>
      </el-form-item>
      <el-form-item label="摘要：" prop="summary">
        <div class="w600">
          <el-input v-model="form.summary" :maxlength="300" type="textarea" :row="2" placeholder="请输入内容" :disabled="formDisabled" />
        </div>
      </el-form-item>
      <el-form-item label="正文：" prop="body">
        <div class="max1200">
          <!-- <tinymce-editor ref="editor" v-model="form.body" :disabled="formDisabled" /> -->
        </div>
      </el-form-item>
      <el-form-item label="附件：" prop="attachments">
        <div class="max1200">
          <enclosure ref="enclosure" :file-list="attachments" business-type="cms" :mj="Number(form.secretLevel || -1)" :disabled="formDisabled" @changeFileMj="changeFileMj" @upload="uploadFileSuccess" />
        </div>
      </el-form-item>
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
  </div>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
const _cloneDeep = require('lodash.clonedeep')
import { getItem } from '@/utils/storage'
import { Enclosure } from '@/components'
import CoverUpload from './cover-upload'
export default {
  components: { Treeselect, Enclosure, CoverUpload },
  props: {
    routerType: {
      type: String,
      default: () => {}
    },
    contentData: {
      type: Object,
      default: () => {}
    },
    secretLevel: {
      type: Array,
      default: () => []
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
      pageTitle: '新建内容',
      catalogsTreeData: [],
      attachments: [],
      form: {
        catalogId: null,
        title: '',
        secretLevel: '', // 密级
        logoUrl: '',
        summary: '',
        body: '',
        attachments: [
          // {
          //   createTime: '',
          //   id: '',
          //   name: '',
          //   secretLevel: '',
          //   size: 0,
          //   suffix: ''
          // }
        ],
        author: '',
        organization: ''
      },
      rules: {
        catalogId: [
          { required: true, message: '请选择栏目', trigger: 'change' }
        ],
        secretLevel: { required: true, message: 'MJ尚未填写', trigger: 'blur' },
        attachments: { validator: this.checkFileMj, trigger: 'blur' },
        title: [
          { required: true, message: '请输入内容标题', trigger: 'blur' },
          { max: 64, message: '长度最多 64 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    contentData (newVal) {
      this.isAdd = false
      newVal.attachments = newVal.attachments && newVal.attachments.map(ele => {
        ele.mj = ele.secretLevel
        return ele
      })
      this.form = _cloneDeep(newVal)
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
            str = '编辑内容'
            break
          case 'view':
            str = '内容详细'
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
    this.form.author = userInfo && userInfo.nickName
    this.form.organization = userInfo && userInfo.dept.companyName
    this.$api('news.catalogsTree', { filterType: 'SELF_MANAGE' }).then(res => {
      const data = res.data
      ;(function recursive (data) {
        data && data.forEach(ele => {
          if (ele.status === 0) {
            ele.isDisabled = true
          }
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
  },
  methods: {
    checkFileMj (rule, value, callback) {
      const fileList = this.$refs.enclosure.fileListData
      if (fileList.length) {
        if (fileList.filter(item => !item.mj).length) {
          callback(new Error('请选择附件密级'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    changeFileMj (row) {
      this.attachments = this.attachments.map(e => {
        if (e.id === row.id) {
          e.secretLevel = row.secretLevel
          e.mj = row.secretLevel
        }
        return e
      })
    },
    logoUrlFn (rule, value, callback) {
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
    uploadFileSuccess (file) {
      this.attachments.push(file)
    },
    // 上传成功回调
    uploadSuccessFn (list) {
      this.form.logoUrl = list
      // this.$refs.form.validateField('logoUrl')
      // this.logoUrlFn()
    },
    // 表单数据处理 // ! 使用异步回调校验报异常错误 Error in v-on handler (Promise/async): "false"
    async _getApiParams () {
      const isValidate = await this.$refs.form.validate()
      // console.log(isValidate)
      if (!isValidate) return
      const list = _cloneDeep(this.attachments)
      const arr = list && list.map(ele => {
        ele.secretLevel = ele.mj
        return ele
      })
      // console.log(this.form)
      this.form.attachments = arr
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
    async saveFn () {
      let apiUrl = 'news.contentsAdd'
      if (!this.isAdd) {
        apiUrl = 'news.contentsEdit'
      }
      this.$refs.form.validate((isValidate) => {
        if (isValidate) {
          // const list = _cloneDeep(this.form.attachments)
          // // 判断 附件 mj 必填
          // const isMj = list.some(e => {
          //   return !e.secretLevel
          // })
          // if (isMj) {
          //   this.$message.error('请选择附件mj')
          //   return false
          // }
          // const arr = list && list.map(ele => {
          //   ele.secretLevel = ele.mj
          //   return ele
          // })
          // this.form.attachments = list
          this.$api(apiUrl, this.form).then(res => {
            this.$message.success('保存成功')
            if (this.$route.query.isHome) {
              setTimeout(() => {
                window.opener = null
                window.close()
              }, 3000)
            } else {
              this.$router.go(-1)
            }
          })
        }
      })
    },
    cancelFn () {
      if (!this.isAdd) {
        this.$router.push('/news-manage/content/content-list')
      } else {
        if (this.isFormChange()) {
          this.$confirm('是否关闭新建内容页?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.push('/news-manage/content/content-list')
          }).catch(() => {})
        } else {
          this.$router.push('/news-manage/content/content-list')
        }
      }
    },
    isFormChange () {
      let flag = false
      const arr = Object.values(this.form)
      // 判断 新建表单是否操作过
      const nullArr = arr.filter((item, index) => {
        return index > 0 && index < 5
      })
      // 第一项 判断是否未 null
      if (arr[0] !== null) {
        flag = true
      } else if (nullArr.some(e => e !== '')) { // 前 2 - 5 项判断非  ''
        flag = true
      } else if (arr[5].length > 1) { // 附件 大于 一项
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
.new-container {
  .new-container-title {
    display: block;
    span {
      display: inline-block;
      vertical-align: top;
    }
    .line {
      display: inline-block;
      width: 4px;
      height: 15px;
      background-color: #1e89ff;
      margin-right: 10px;
    }
    .name {
      font-size: 16px;
      font-weight: bold;
      color: #191f24;
    }
  }
}
.tips{
  font-size: 12px;
  color: rgba(25, 31, 36, 0.48);
  line-height: 16px;
}
</style>
