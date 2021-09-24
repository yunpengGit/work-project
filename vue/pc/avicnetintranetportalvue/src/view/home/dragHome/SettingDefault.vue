<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-05-30 18:12:46
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-06-22 10:40:58
-->
<template>
  <el-form ref="form" :label-position="labelPosition" :model="form" label-width="100px" class="content-box">
    <div class="group">
      <div class="label">基本配置</div>
      <div class="content">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
      </div>
      <el-form-item class="btn">
        <el-button @click="resetForm('form')">取消</el-button>
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </el-form-item>
    </div>
  </el-form>
</template>
<script>
// import CoverUpload from './../../management/news/components/cover-upload'
export default {
  components: {
    // CoverUpload
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      fileOptions: {
        type: '.jpg,.jpeg,.bmp,.gif,.png',
        size: 500 * 1024
      },
      labelPosition: 'left',
      form: {
        title: this.title,
        operation: '',
        iconURl: '',
        time: '',
        date: '',
        line: 10,
        source: '',
        type: '',
        border: '',
        adaptive: ''
      }
    }
  },
  methods: {
    updateImgFn (imgUrl) {
      this.$confirm('是否删除该图标?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.iconUrl = imgUrl
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {})
    },
    // 上传成功回调
    uploadSuccessFn (list) {
      // console.log(list)
      this.form.iconUrl = list
      // this.$refs.form.validateField('logoUrl')
      // this.logoUrlFn()
    },
    inputNumberChange (value) {
      // console.log(value)
    },
    submitForm (formName) {
      this.$emit('editComponent',
        {
          title: this.form.title
        }
      )
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss">
.el-drawer{
  .el-drawer__header{
    & > span {
      text-align: center;
    }
  }
  .el-drawer__body{
    overflow: auto;
    padding: 6px;
    background-color: #F2F2F2;
  }
}
</style>
<style lang="scss" scoped>
@import './setting.scss'
</style>
