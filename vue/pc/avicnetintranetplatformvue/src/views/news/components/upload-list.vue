<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-03-26 10:28:46
 * @LastEditors: zongmz
 * @LastEditTime: 2021-04-21 17:31:19
-->
<template>
  <div>
    <el-upload
      :action="action"
      :headers="headers"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-success="onSuccess"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'Upload',
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
  methods: {
    onSuccess (response, file, fileList) {
      if (response.code === 200) {
        this.$emit('success', response.data)
      } else {
        this.$message.error(response.msg)
      }
      // console.log(response, file, fileList)
    },
    // onError (err, file, fileList) {
    //   // console.log(err)
    //   // this.$message.error(err)
    // },
    // handleRemove (file, fileList) {
    //   console.log(file, fileList)
    // },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>
