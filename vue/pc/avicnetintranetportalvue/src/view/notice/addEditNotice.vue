<template>
  <div class="addEditNotice-1620442084598">
    <div class="notice-title">{{ noticeId ? '编辑' : '新建' }}公告</div>
    <el-form
      ref="notice-form"
      :model="form"
      :rules="noticeRule"
      label-position="left"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题" maxlength="128" />
      </el-form-item>

      <el-form-item label="分类" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio
            v-for="item in noticeClassifyList"
            :key="item.classificationId"
            :label="item.classificationId"
          >{{ item.classificationName }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="MJ" prop="mj">
        <el-select v-model="form.mj" class="limite-width">
          <el-option
            v-for="item in secretLevel"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="Number(item.dictValue)"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="正文" prop="content">
        <tinymce-editor
          v-model="form.content"
          business-type="notice"
          placeholder="请输入通知公告内容"
        />
        <!-- <div class="el-textarea el-input--mini">
          <textarea v-model="form.content" class="el-textarea__inner" name="t1" rows="10" cols="40" placeholder="请输入通知公告内容" />
        </div> -->

        <!-- <el-input
          v-model="form.content"
          type="textarea"
          :show-word-limit="true"
          :autosize="{ minRows: 10, maxRows: 40}"
          placeholder="请输入通知公告内容"
        /> -->
      </el-form-item>

      <el-form-item label="落款部门" prop="department">
        <el-input
          class="limite-width"
          :value="form.department.length ? form.department[0].name : ''"
          @focus="selectDepartmentVisiable = true"
        />
      </el-form-item>

      <el-form-item label="落款日期" prop="signDate">
        <el-date-picker
          v-model="form.signDate"
          type="date"
          class="limite-width"
          placeholder="请选择日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        />
      </el-form-item>

      <el-form-item label="有效期" prop="validityDate" required class="validity-date">
        <el-radio-group v-model="form.validityDate">
          <el-radio
            v-for="(name, value) in validityDateList"
            :key="value"
            :label="Number(value)"
          >{{ name }}</el-radio>
        </el-radio-group>
        <span class="custom-days" :class="{hidden: form.validityDate}">
          <el-input v-model="form.customDays" />
          <label>天</label>
        </span>
      </el-form-item>

      <el-form-item label="上传附件" prop="fileList">
        <enclosure ref="enclosure" :mj="Number(form.mj || -1)" :file-list="fileList" @changeFileMj="changeFileMj" />
      </el-form-item>

      <el-form-item label="可阅读者" prop="canReaderList">
        <div class="can-reader">
          <div class="container">
            <div
              v-for="(item, index) in form.canReaderList"
              :key="item.id"
              class="reader-item"
            >
              <span>{{ item.name }}</span>
              <i
                class="reader-delete el-icon-close"
                @click="deleteReader(index)"
              />
            </div>
            <div class="add-btn" @click="selectReaderVisiable = true"><i class="el-icon-plus" />添加人</div>
          </div>
          <!-- <div class="tips">默认集团总部全员可见</div> -->
        </div>
      </el-form-item>

      <el-form-item>
        <el-button @click="previewNotice">预览</el-button>
        <el-button @click="saveNotice">保存</el-button>
        <el-button type="primary" @click="saveAndPublish">提交审批并发布</el-button>
      </el-form-item>
    </el-form>

    <!--选择落款部门-->
    <select-personnel
      :dialog-visiable.sync="selectDepartmentVisiable"
      :selected-list="form.department"
      :max-select-num="1"
      :select-type="['department']"
      @confirm="(val) => (form.department = val)"
    />
    <!--选择可阅读者-->
    <select-personnel
      :dialog-visiable.sync="selectReaderVisiable"
      :selected-list="form.canReaderList"
      @confirm="(val) => (form.canReaderList = val)"
    />
  </div>
</template>

<script>
import { TinymceEditor, Enclosure } from '@/components'
import SelectPersonnel from '@/components/SelectPersonnel'
// import SelectPersonnel from './SelectPersonnel'
import formatDate from '@/utils/format-date'
import { getItem, setItem } from '@/utils/storage'
import { fileType } from '@/utils/common'
import { closeTagView } from '@/utils/closeTagView'
import { mapGetters } from 'vuex'
// import store from '@/store'
const validityDateList = { 3: '3天', 7: '7天', 14: '14天', '': '其他' }

export default {
  components: { SelectPersonnel, TinymceEditor, Enclosure },

  data () {
    return {
      routeData: {},
      noticeId: '',
      form: {
        title: '', // 标题
        type: 1, // 分类
        mj: '', // 密级
        content: '', // 内容
        department: [], // 落款部门
        signDate: formatDate(new Date(), 'yyyy-MM-dd'), // 落款日期
        validityDate: 3, // 有效期id
        customDays: '', // 用户自定义有效期天数
        selFileList: [], // 文件列表
        canReaderList: [] // 可阅读者数组
      },
      // 表单校验规则
      noticeRule: {
        title: { required: true, message: '标题尚未填写', trigger: 'blur' },
        type: { required: true, message: '分类尚未填写', trigger: 'change' },
        content: { required: true, message: '正文尚未填写', trigger: 'blur' },
        department: {
          required: true,
          message: '落款部门尚未填写',
          trigger: 'blur'
        },
        signDate: {
          required: true,
          message: '落款日期尚未填写',
          trigger: 'blur'
        },
        fileList: { validator: this.checkFileMj, trigger: 'blur' },
        validityDate: { validator: this.checkDate, trigger: 'blur' },
        mj: { required: true, message: 'MJ尚未填写', trigger: 'blur' },
        canReaderList: {
          required: true,
          message: '可阅读者尚未填写',
          trigger: 'change'
        }
      },
      validityDateList, // 有效期列表
      noticeClassifyList: [], // 分类列表
      fileList: [], // 上传附件列表
      selectDepartmentVisiable: false, // 选择组织架构弹框开关
      selectReaderVisiable: false, // 选择组织架构弹框开关
      pickerOptions: {
        // 今天之前不可选
        disabledDate (time) {
          return new Date().setHours(0, 0, 0) - 60 * 1000 - time > 0
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'secret',
      'userInfo'
    ]),
    secretLevel () {
      const epSecretArry = ['10', '20', '30']
      const userSecretLevel = this.userInfo.secretLevel
      const data = this.secret
      if (userSecretLevel === '1') {
        data = this.secret.filter(v => epSecretArry.indexOf(v.dictValue) > -1)
      }
      return data
    }
  },
  watch: {
    // 用户自定义有效期天数 只能为整数
    'form.customDays': function (n, o) {
      if (n !== '' && !/^$|(^[1-9]\d*$)/.test(n)) {
        this.$nextTick(() => {
          this.form.customDays = o
        })
      }
    }
  },
  created () {
    this.routeData = {
      ...this.$route,
      title: this.$route.meta.title || 'no-name'
    }
    // this.routeData = Object.assign({}, this.$route, {
    //   title: this.$route.meta.title || 'no-name'
    // })
    this.noticeId = this.$route.query['id'] || ''
    this.getClassifyList()
    if (this.noticeId) {
      this.getNoticeContent()
      this.getFileList(this.noticeId)
    }
    const { dept } = JSON.parse(getItem('userInfo'))
    this.form.department = [{ id: dept.deptId, name: dept.deptName, type: 1 }]
  },

  methods: {
    fileType, // 格式化文件类型
    formatDate, // 格式化日期
    checkDate (rule, value, callback) {
      if (!value) {
        if (this.form.customDays) { // 其它
          callback()
        } else {
          callback(new Error('有效期尚未填写'))
        }
      } else {
        callback()
      }
    },
    checkFileMj (rule, value, callback) {
      const fileList = this.$refs.enclosure.fileListData
      if (fileList.length) {
        if (fileList.filter(item => !item.secretLevel).length) {
          callback(new Error('请选择附件密级'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    changeFileMj (row) {
      this.fileList = this.fileList.map(e => {
        if (e.id === row.id) {
          e.secretLevel = row.secretLevel
          e.mj = row.secretLevel
        }
        return e
      })
      this.$refs['notice-form'].validate(['fileList'])
    },
    // 获取分类列表
    getClassifyList () {
      this.$api('notice.classifyList', { enableFlag: 1 }).then((res) => {
        this.noticeClassifyList = res.data
      })
    },
    // 获取通知公告详情
    getNoticeContent () {
      this.$api('notice.startNoticeDetail', { id: this.noticeId }).then(
        (res) => {
          const d = res.data
          this.form.title = d.title
          this.form.type = d.type
          this.form.content = d.content
          this.form.signDate = d.signDate
          this.form.mj = d.secretLevel
          this.form.department = [{ name: d.signDept, id: d.signDeptId, type: 1 }]

          // 有效期处理
          const date = this.validityDateList[d.effectiveDay]
          this.form.validityDate = date ? d.effectiveDay : 0
          this.form.customDays = date ? '' : d.effectiveDay

          // 可阅读者拼装
          if (d.readerId && d.readerName) {
            const list = []
            d.readerId.split(';').map((v, index) => {
              v && list.push({
                id: v,
                name: d.readerName.split(';')[index],
                type: d.readType.split(';')[index]
              })
            })
            this.form.canReaderList = list
          }
        }
      )
    },

    // 获取附件列表
    getFileList (businessId) {
      this.$api('notice.fileList', { businessId }).then((res) => {
        const { data = [] } = res
        this.fileList = data.map((d) => {
          return {
            id: d.id,
            name: d.name,
            mj: d.secretLevel,
            secretLevel: d.secretLevel,
            time: d.createTimestamp,
            size: d.size
          }
        })
      })
    },

    // 删除阅读者
    deleteReader (index) {
      this.form.canReaderList.splice(index, 1)
    },

    // 预览通知公告
    previewNotice () {
      const { title, content, signDate, department } = this.form
      const previewData = {
        info: { title, content, signDate, signDept: department.length ? department[0].name : '' },
        fileList: this.fileList
      }
      setItem('previewData', previewData, true)
      window.open(
        `${window.location.protocol}//${window.location.host}/notice/detail?id=${this.noticeId}&type=myStart&mode=preview`
      )
    },

    // 为新增通知公告接口准备参数
    async _getApiParams () {
      try {
        const isValidate = await this.$refs['notice-form'].validate()
        if (!isValidate) return false
        const { title, type, content, department, signDate, canReaderList, mj } = this.form
        return {
          title,
          type,
          content,
          signDept: department.map((item) => item.name).join(';'),
          signDeptId: department.map((item) => item.id).join(';'),
          signDate: signDate,
          secretLevel: mj,
          effectiveDay: Number(this.form.validityDate || this.form.customDays),
          readerId: canReaderList.map((item) => item.id).join(';'),
          readerName: canReaderList.map((item) => item.name).join(';'),
          readType: canReaderList.map((item) => item.type).join(';'), // 组织是1，用户是2
          sysFileInfos: this.$refs.enclosure.fileListData.map((item) => {
            const obj = {
              ...item,
              id: item.id,
              secretLevel: item.mj
            }
            return obj
            // return Object.assign({}, item, {
            //   id: item.id,
            //   secretLevel: item.mj
            // })
          })
        }
      } catch (err) {
        return false
      }
    },

    // 保存通知公告
    async saveNotice () {
      const params = await this._getApiParams()
      if (!params) return
      // 调配content 换行与空格
      const arr = []
      params.content.split('\n').forEach(item => arr.push(`<p>${item.trim()}</p>`))
      params.content = arr.join('<br>')
      // console.log(params, 222)
      this.$api(
        `notice.${this.noticeId ? 'updateSave' : 'addSave'}`,
        !this.noticeId ? params : { ...params, id: this.noticeId }
        // !this.noticeId ? params : Object.assign({}, params, { id: this.noticeId })
      ).then((res) => {
        this.$message.success(res.msg)
        closeTagView.closeTag(this.routeData)
        setTimeout(() => { this.$router.push('/notice/myStart/list') }, 0)
      })
    },

    // 保存并发布通知公告
    async saveAndPublish () {
      const params = await this._getApiParams()
      if (!params) return
      // 调配content 换行与空格
      const arr = []
      params.content.split('\n').forEach(item => arr.push(`<p>${item.trim()}</p>`))
      params.content = arr.join('<br>')
      this.$api(
        `notice.${this.noticeId ? 'updateSubmit' : 'addSubmit'}`,
        !this.noticeId ? params : { ...params, id: this.noticeId }
        // !this.noticeId ? params : Object.assign({}, params, { id: this.noticeId })
      ).then(() => {
        this.$message.success('提交成功，等待审核')
        closeTagView.closeTag(this.routeData)
        setTimeout(() => { this.$router.push('/notice/myStart/list') }, 0)
      }).catch(() => {
        this.$message.error('提交失败，请重新提交')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/ui/flex.scss';
.addEditNotice-1620442084598 {
  position: relative;
  padding: 42px 0 5px 0;
  background-color: #fff;
  @include flex-single(center,center);

  .notice-title {
    position: absolute;
    top: 51px;
    left: 56px;
    font-size: 16px;
    color: #191f24;
    line-height: 21px;

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: -8px;
      margin-top: -7px;
      height: 15px;
      width: 4px;
      background-color: #1e89ff;
    }
  }

  .tinymce-editor ::v-deep{
    display: inline-block;
    width: 968px;
    height: 320px;
    .tox-statusbar {
      display: none;
    }
    .tox-tinymce {
      width: 968px;
      height: 320px !important;
      border-radius: 4px;
      border: none;
      .tox-toolbar__primary {
        background: none;
        border-radius: 4px 4px 0 0;
        border: 1px solid rgba(25, 31, 36, 0.16);
        border-bottom: 0;
      }
      .tox-edit-area {
        border-radius: 0 0 4px 4px;
        border: 1px solid rgba(25, 31, 36, 0.16);
        border-top: none;
      }
      .tox-toolbar__group:not(:last-of-type) {
        border-right: 0;
      }
      .tox-mbtn {
        padding: 0 10px;
        // height: 48px;
      }
      .tox-menubar {
        background: none;
      }
    }
  }

  .el-form ::v-deep {
    .el-form-item {
      margin-bottom: 36px;
      .el-form-item__label {
        width: 95px !important;
      }
      .el-form-item__content {
        margin-left: 105px !important;
      }
      .limite-width .el-input__inner{
        width: 294px;
      }
    }
    .el-form-item__error {
      padding-top: 8px;
    }
  }

  .validity-date ::v-deep {
    .el-form-item__content {
      @include flex-single;
    }
    .custom-days {
      .el-input {
        margin-left: 20px;
        margin-right: 10px;
        width: 78px;
      }
      label {
        font-size: 14px;
      }
      &.hidden {
        opacity: 0;
      }
    }
  }

  .can-reader {
    .container {
      position: relative;
      min-height: 90px;
      padding: 10px 12px;
      border-radius: 4px;
      border: 1px solid #dadbdc;

      div {
        font-size: 14px;
        height: 24px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        margin-bottom: 10px;
        border: 1px solid transparent;
        @include flex-inline;
        i {
          font-size: 12px;
        }
      }

      .reader-item {
        margin-right: 8px;
        color: #191f24;
        background-color: #f6f6f6;
        i {
          margin-left: 3px;
        }
      }

      .add-btn {
        color: #499CF8;
        border-color: #499CF8;
        i {
          margin-right: 3px;
        }
      }
    }

    .tips {
      margin: 10px 0 14px 0;
      font-size: 14px;
      color: rgba(25, 31, 36, 0.24);
    }
  }
}
</style>

<style lang="scss">
@import '@/ui/size/mixin.scss';
@mixin del($sc: 1, $fs: 14px){
  .addEditNotice-1620442084598 {

    .notice-title {
      font-size: 16px * $sc;
      line-height: 21px * $sc;

      &::before {
        left: -8px *$sc;
        margin-top: -7px * $sc;
        height: 15px * $sc;
        width: 4px * $sc;
      }
    }

    .el-form {
      .el-form-item {
        .el-form-item__label {
          width: 95px * $sc !important;
        }
        .el-form-item__content {
          margin-left: 105px * $sc  !important;
        }
        .limite-width {
          width: 294px * $sc;
        }
      }
    }

    .tinymce-editor {
      .tox-mbtn {
        font-size: $fs;
      }
    }

    .custom-days {
      label {
        font-size: $fs !important;
      }
    }

    .can-reader {
      .container {
        div {
          font-size: $fs;
          height: 24px * $sc;
          padding: 4px * $sc 8px * $sc;
          i {
            font-size: 12px * $sc;
          }
        }
      }

      .tips {
        font-size: $fs;
      }
    }
  }
}

@import '@/ui/size/scale.scss';
</style>
