<!--
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-06-06 18:56:56
 * @LastEditors: zongmz
 * @LastEditTime: 2021-06-08 10:56:56
-->
<template>
  <div class="form-container" style="padding:0">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="130px"
      label-position="right"
    >
      <el-form-item label="站点名称：" prop="siteName">
        <el-input v-model="form.siteName" style="width:300px" />
      </el-form-item>
      <el-form-item label="站点封面：">
        <cover-upload :image-url.sync="form.siteImageUrl" :file-options="fileOptions" @success="uploadSuccessFn" @updateImg="updateImgFn" />
        <span class="tips">图片应用于封面位置，支持：.jpg,.jpeg,.bmp,.gif,.png类型文件，500KB以下</span>
      </el-form-item>
      <el-form-item style="margin:0">
        <el-button type="primary" @click="saveFn">保存</el-button>
        <el-button @click="cancelFn">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import CoverUpload from '@/views/news/components/cover-upload'
export default {
  components: {
    CoverUpload
  },
  data () {
    return {
      fileOptions: {
        type: '.jpg,.jpeg,.bmp,.gif,.png',
        size: 500 * 1024
      },
      form: {
        siteName: '',
        siteImageUrl: ''
      },
      rules: {
        siteName: [
          { required: true, message: '请输入站点名称', trigger: 'blur' },
          { max: 64, message: '长度最多 64 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    uploadSuccessFn (url) {
      this.form.siteImageUrl = url
    },
    updateImgFn (imgUrl) {
      this.$confirm('是否删除该封面?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.siteImageUrl = imgUrl
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {})
    },
    saveFn () {
      this.$refs.form.validate((isValidate) => {
        if (isValidate) {
          this.$api('website.webSiteAdd', this.form).then(res => {
            this.$message.success('新增站点成功')
            this.closedPage()
          })
        }
      })
    },
    cancelFn () {
      this.closedPage()
    },
    closedPage () {
      this.$parent.$parent.$parent.initList({ pageNum: '1', pageSize: '99' })
      this.$store.commit('CLOSE_DIALOG', { uid: 'website-add-dialog' })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../news/components/form.scss";
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
