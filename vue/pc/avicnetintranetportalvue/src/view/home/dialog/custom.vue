<!--
 * @Author: your name
 * @Date: 2021-06-06 18:17:11
 * @LastEditTime: 2021-06-30 19:03:41
 * @LastEditors: zongmz
 * @Description: In User Settings Edit
 * @FilePath: \avicnetintranetportalvue\src\view\home\dialog\cuscustom.vue
-->
<template>
  <div>
    <el-dialog :title="`自定义常${type ? '办' : '用'}${typeStr}`" :visible="dialogVisible" @update:visible="visibaleChange">
      <el-form ref="ruleForm" :model="form" :rules="rules">

        <el-form-item :label="`${typeStr}名称`" prop="appOrResourceName">
          <el-input v-model="form.appOrResourceName" :placeholder="`请输入自定义${typeStr}名称`" :maxlength="type ? 10 : 5" />
        </el-form-item>

        <el-form-item :label="`${typeStr}URL`" prop="url">
          <el-input v-model="form.url" :placeholder="`请输入自定义${typeStr}URL，请以http:// 或 https:// 开头`" />
        </el-form-item>

        <el-form-item v-if="!type" :label="`${typeStr}图标`" prop="icon">
          <div :class="['img-wrap', !form.icon ? 'add' : '']" @click="onAddIcon">
            <i v-if="!form.icon" class="el-icon-plus" />
            <img v-else :src="form.icon">
          </div>
          <el-upload
            class="avatar-uploader"
            :headers="headers"
            :action="action"
            :show-file-list="false"
            :on-success="uploadSuccessFn"
            :before-upload="beforeUpload"
          >
            <el-button type="text" style="marginLeft: 12px">自定义图标</el-button>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visibaleChange">取消</el-button>
        <el-button type="primary" @click="onSure">保存</el-button>
      </div>
    </el-dialog>

    <icon-library v-if="!type" :icon-dialog-visible.sync="iconDialogVisible" @iconSure="onIconSure" />
  </div>

</template>

<script>
import IconLibrary from './iconLibrary.vue'
import { getToken } from '@/utils/auth'
export default {
  components: { IconLibrary },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {}
    },
    type: { // 0应用 1业务
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      fileOptions: {
        type: '.jpg,.jpeg,.bmp,.gif,.png',
        size: 20 * 1024
      },
      action: `/api/file/publicPic/upload`,
      headers: {
        Authorization: `Bearer ${getToken()}`
      },
      form: {
        appOrResourceName: '',
        icon: '',
        url: ''
      },
      rules: {
        appOrResourceName: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      },
      iconDialogVisible: false
    }
  },
  computed: {
    typeStr () {
      return this.type ? '业务' : '应用'
    }
  },
  watch: {
    item (n, o) {
      this.form = Object.assign(
        {},
        {
          appOrResourceName: '',
          icon: '',
          url: ''
        },
        n
      )
    }
  },
  created () {},
  mounted () {},
  methods: {
    visibaleChange () {
      this.$refs['ruleForm'].clearValidate()
      this.$emit('update:dialog-visible', false)
    },
    beforeUpload (file) {
      const arr = file.name.split('.')
      const type = arr[arr.length - 1]
      // console.log(type)
      const isJPG = this.fileOptions.type.indexOf(type) === -1
      // const isLt = (file.size / this.fileOptions.size) > 1

      if (isJPG) {
        this.$message.error(`上传图标格式支持：${this.fileOptions.type}!`)
        return false
      }
      // if (isLt) {
      //   this.$message.error(`上传图标大小不能超过 ${this.fileOptions.size / 1024}kb!`)
      //   return false
      // }
      return !isJPG
    },
    uploadSuccessFn (response, file, fileList) {
      // console.log(response, file, fileList)
      if (response.code === 200) {
        this.form.icon = response.data
      }
    },
    // 选择icon
    onAddIcon () {
      this.iconDialogVisible = true
    },
    // 选择icon确定
    onIconSure (obj) {
      this.form.icon = obj.icon
    },
    onSure () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const id = this.form.appOrResourceId
          this.$api(`setApplication.${id ? 'editCustom' : 'addCustom'}`, { ...this.form, type: this.type }).then(res => {
            this.$message.success('保存成功')
            this.$emit('update:dialog-visible', false)
            this.$emit('saveCustom', id ? this.form : res.data)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  width: 660px;
  .el-form {
    .el-form-item {
      display: flex;
      .el-form-item__label {
        width: 80px;
        padding-right: 0;
        margin-right: 36px;
        margin-left: 50px;
      }
      .el-input {
        width: 381px;
      }
      .avatar-uploader{
        margin-top: 40px;
        float: right;
      }
      .img-wrap {
        display: inline-block;
        width: 62px;
        height: 62px;
        line-height: 62px;
        text-align: center;
        cursor: pointer;
        border-radius: 5px;
        border: 1px dashed transparent;
        &.add {
          border-color: #D8D8D8;
          &:hover {
            border-color: #1E89FF;
            i { color: #1E89FF;}
          }
        }
        i {
          font-size: 18px;
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
