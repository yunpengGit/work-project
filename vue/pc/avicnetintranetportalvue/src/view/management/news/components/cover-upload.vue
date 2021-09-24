<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-03-26 10:28:46
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-04-13 11:38:07
-->
<template>
  <div>
    <el-upload
      class="img-box"
      list-type="picture-card"
      :disabled="disabled"
      :action="action"
      :headers="headers"
      :show-file-list="false"
      :on-success="onSuccess"
      :on-error="onError"
      :before-upload="beforeUpload"
    >
      <img v-if="url" :src="url" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
    <span v-if="url" class="upload-edit-btn-box">
      <span v-if="pageType!=='view'" class="delete" @click="deleteFn">删除</span>
      <span class="preview" @click="previewFn">预览</span>
    </span>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'Upload',
  props: {
    fileOptions: {
      type: Object,
      default: () => {
        return { type: '.jpg,.jpeg,.bmp,.gif,.png', size: 500 * 1024 }
      }
    },
    pageType: {
      type: String,
      default: 'viwe'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    imageUrl: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      action: '/api/file/publicPic/upload',
      headers: {
        Authorization: `Bearer ${getToken()}`
        // Authorization: `Bearer 02f94f4b-9c34-44a4-83b0-c5d8516f833c`
      },
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  computed: {
    url () {
      return this.imageUrl
    }
  },
  methods: {
    beforeUpload (file) {
      // console.log(file.name)
      const arr = file.name.split('.')
      const type = arr[arr.length - 1]
      // console.log(type)
      const isJPG = this.fileOptions.type.indexOf(type) === -1
      const isLt = (file.size / this.fileOptions.size) > 1

      if (isJPG) {
        this.$message.error(`上传封面图片格式支持：${this.fileOptions.type}!`)
        return false
      }
      if (isLt) {
        this.$message.error(`上传封面图大小不能超过 ${this.fileOptions.size / 1024}kb!`)
        return false
      }
      return !isJPG && !isLt
    },
    onSuccess (response, file, fileList) {
      if (response.code === 200) {
        this.$message({
          type: 'success',
          message: '上传成功'
        })
        this.$emit('success', response.data)
      } else {
        this.$message.error(response.msg)
      }
    },
    onError () {
    },
    deleteFn (file, fileList) {
      this.$emit('updateImg', '')
    },
    previewFn () {
      this.dialogImageUrl = this.url
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.img-box{
  display: inline-block;
  vertical-align: text-bottom;
}
.upload-edit-btn-box{
  .delete,
  .preview{
    line-height: 1;
    margin-left: 10px;
    color: #1e89ff;
    cursor: pointer;
  }
}

</style>
