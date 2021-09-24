<template>
    <div v-if="dialogVisible">
        <el-dialog ref="dialog" title="联系人变更" :visible.sync="dialogVisible" width="35%" append-to-body>

            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm"
                :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto',}">
                <!-- 'border-top': 'solid #ccc 1px' -->
                <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                    <el-form-item label="联系方式" prop="contact">
                        <el-radio-group v-model="ruleForm.contact">
                            <el-radio :label="1">乘车人</el-radio>
                            <el-radio :label="0">指定联系人</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="ruleForm.contact === 0" label="联系人姓名" prop="contactPerson">
                        <el-input v-model="ruleForm.contactPerson" class="width360 keepOutRight" show-word-limit maxlength="30"
                            placeholder="请输入联系人姓名" />
                    </el-form-item>
                    <el-form-item v-if="ruleForm.contact === 0" label="联系人电话" prop="contactPhone">
                        <el-input v-model="ruleForm.contactPhone" class="width360" show-word-limit maxlength="11"
                            placeholder="请输入联系人电话" />
                    </el-form-item>
                </el-scrollbar>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <div style="margin-top:-30px">
                    <el-button type="primary" @click="onSubmit('ruleForm')">确 定</el-button>
                    <el-button @click="dialogVisible = false">关闭</el-button>
                </div>
            </span>
        </el-dialog>

    </div>
</template>
<script>
import { addVehicleTaskAttendee, changeContact } from '@/api/car'
import { getConferenceId } from '@/utils/conference-auth'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
import { telephoneValid } from '@/utils/valid-common'
import { getTableHeight } from '@/utils/index'




export default {
    name: 'TaskDialog',
    components: {},
    data () {
        return {
            row: '',
            dialogVisible: false,
            imagePath: getOssBaseUrl(),
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
            dialogHeight: getTableHeight(360) + 'px',
            ruleForm: {
                contact: '',
                contactPerson: '',
                contactPhone: '',
                taskId: ''
            },
            rules: {
                contact: [{ required: true, message: '请选择联系方式', trigger: 'blur' }],

                contactPerson: [{ required: true, message: '请输入联系人', pattern: '[^ \x22]+', trigger: 'blur' }],
                contactPhone: [{ required: true, message: '请输入联系人电话', pattern: '[^ \x22]+', trigger: 'blur' },
                telephoneValid()]
            }
        }
    },
    watch: {


    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created () { },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted () {
    },
    // 这里存放数据
    beforeCreate () { },
    // 生命周期 - 挂载之前
    beforeMount () { },
    // 生命周期 - 更新之前
    beforeUpdate () { },
    // 生命周期 - 更新之后
    updated () { },
    // 生命周期 - 销毁之前
    beforeDestroy () { },
    // 生命周期 - 销毁完成
    destroyed () { },
    // 如果页面有keep-alive缓存功能，这个函数会触发
    activated () { },
    methods: {


        showDialog (param, taskId) {
            this.dialogVisible = true
            this.row = param
            if (this.row.contactPhone === this.row.fixAttributeCommonVO.phone) {
                this.ruleForm.contact = 1
                this.ruleForm.contactPhone = ''
                this.ruleForm.contactPerson = ''
            } else {
                this.ruleForm.contact = 0
                this.ruleForm.contactPhone = this.row.contactPhone
                this.ruleForm.contactPerson = this.row.contactPerson
            }
            this.ruleForm.taskId = taskId
        },

        onSubmit (form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    console.log(this.ruleForm.taskId)
                    if (this.ruleForm.contact === 0) {
                        this.ruleForm.contact = false
                    } else {
                        this.ruleForm.contact = true
                    }
                    var param = {
                        "taskId": this.ruleForm.taskId,
                        "attendeeId": this.row.id,
                        "contactPerson": this.ruleForm.contactPerson,
                        "contactPhone": this.ruleForm.contactPhone,
                        "contact": this.ruleForm.contact,
                        "conferenceId": getConferenceId()
                    }
                    changeContact(param).then(res => {
                        if (res.success) {
                            this.dialogVisible = false
                            this.$message("操作成功")
                            this.$emit("getListInfo")
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }




    }
}
</script>
<style lang='scss' scoped >
.width360 {
    width: 270px;
}
</style>
