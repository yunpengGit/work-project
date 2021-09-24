<!--
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-04-23 11:07:17
 * @LastEditors: zongmz
 * @LastEditTime: 2021-04-27 11:02:32
-->
<template>
  <div v-if="visible">
    <el-dialog :visible="visible" title="文件上传" @update:visible="visibaleChange">
      <el-upload
        class=""
        :action="action"
        multiple
        :file-list="fileList"
        :data="uploadParams"
        :before-upload="beforeUpload"
        :on-success="uploadSuccess"
        :headers="uploadHeader"
        :before-remove="beforeRemove"
      >
        <el-button type="primary">选择文件</el-button>
      </el-upload>
    </el-dialog>
  </div>

</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'UploadFile',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      fileList: [], // 文件列表
      action: '/api/file/info',
      uploadParams: {
        name: '', // 文件名称
        secretLevel: 60, // 密级等级
        businessType: 'notice', // 业务类型
        storageType: 'oss' // 存储类型
      },
      // 上传头部
      uploadHeader: {
        'Authorization': ''
      }
    }
  },

  created () {
    this.uploadHeader['Authorization'] = `Bearer ${getToken()}`
  },

  methods: {
    // 弹框开关切换
    visibaleChange () {
      this.$emit('update:visible', !this.visible)
    },

    // 上传之前的回调
    beforeUpload ({ name }) {
      this.uploadParams.name = name
    },

    // 上传之后的回调
    uploadSuccess (res) {
      const { data } = res
      if (!data) return this.$message.error(`${res.msg}`)
      const params = {
        name: data.name,
        time: data.createTime,
        size: data.size,
        mj: data.secretLevel,
        id: data.id
      }
      this.$emit('upload-success', params)
    },

    // 删除之前的回调
    beforeRemove (file) {
      const id = file.response && file.response.data.id
      const removeFn = this.$parent.removeOne
      if (removeFn) return removeFn(id)
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-dialog {
    width: 500px;

    .el-upload-list__item {
      outline: none;
    }
  }
</style>
