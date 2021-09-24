<template>
  <div>
    <el-dialog
      title="权限编辑"
      :visible="dialogVisiable"
      width="510px"
      top="200px"
      @update:visible="visibaleChange"
    >
      <div>
        <el-form label-position="left">
          <el-form-item label="分享人：" label-width="120px">
            <span style="color: #191f24; font-weight: 500">{{
              editValue.name
            }}</span>
          </el-form-item>
          <el-form-item label="权限：" label-width="120px">
            <el-select
              v-model="editValue.permsType"
              placeholder="请选择"
              :style="{ width: '300px' }"
            >
              <el-option
                v-for="item in optionArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visibaleChange(false)">取消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    dialogVisiable: {
      type: Boolean,
      default: false
    },
    editValue: {
      type: Object,
      default () {
        return {
          name: '',
          permsType: '',
          authzId: ''
        }
      }
    }
  },
  data () {
    return {
      optionArr: [
        {
          label: '可查看',
          value: 'READONLY'
        },
        {
          label: '可创建、编辑、查看',
          value: 'READWRITE'
        }
      ]
    }
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {
    visibaleChange (val) {
      this.$emit('update:dialog-visiable', val)
    },
    // 弹框确定事件
    confirm () {
      this.visibaleChange(false)
      this.dialogClosed()
    },
    dialogClosed () {
      const { permsType, authzId } = this.editValue
      this.$api('schedule.putEventAuth', { permsType, authzId }).then((res) => {
        if (res.code === 200) {
          // 权限变更成功
          this.$message.success('权限变更成功')
          this.$emit('refreshData')
        } else {
          this.$message.error(res.msg || '发生未知错误')
          this.editValue.permsType =
            this.editValue.permsType === 'READONLY' ? 'READWRITE' : 'READONLY'
        }
      })
    }
  }
}
</script>
