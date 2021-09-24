<template>
    <div class="addTempAttendeeClass">
        <el-drawer
            title="添加临时来宾"
            :visible.sync="dialogVisible"
            :before-close="closeDialog"
            size="40%"
        >
            <el-form
                ref="ruleForm"
                :model="ruleForm"
                :rules="rules"
                label-width="120px"
                class="demo-ruleForm"
                :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto',}"
            >
                <!-- 'border-top': 'solid #ccc 1px' -->
                <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                    <el-form-item label="姓名" prop="ssoUserName">
                        <el-input class="keepOutRight" v-model="ruleForm.ssoUserName" show-word-limit maxlength="30" style="width:80%" placeholder="姓名" />
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input class="keepOutRight" v-model="ruleForm.mobile" show-word-limit maxlength="11" style="width:80%" placeholder="手机号" />
                    </el-form-item>
                    <div style="float: right; text-center: right;padding-bottom:10px;margin-right:15%">
                        <el-button type="primary" @click="insert">保存</el-button>
                    </div>
                    <el-table
                        :data="tableData"
                        style="margin-left:7%;width:86%;border-radius:10px"
                        height="300"
                        border
                    >
                        <el-table-column
                            label="姓名"
                            width="220"
                        >
                            <template slot-scope="scope">
                                {{ scope.row.fixAttributeCommonVO.attendeeName }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="手机"
                        >
                            <template slot-scope="scope">
                                <PhoneEncryption :value="scope.row.fixAttributeCommonVO.phoneForMsg" />
                                <!-- <div>
                                    <span>{{ formatTableCellData(formatPhone(scope.row.fixAttributeCommonVO.phone)) }}</span>
                                    <span style="display:none">{{ scope.row.fixAttributeCommonVO.phone }}</span>
                                    <el-button v-show="scope.row.fixAttributeCommonVO.phone !== null && scope.row.fixAttributeCommonVO.phone !== ''" icon="el-icon-view" type="text" @click="(event) => qiehuanshoujijiami(event)" />
                                </div> -->
                                <!-- <div @click="xianshi">aaa</div> -->
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="60"
                        >
                            <template slot-scope="scope">
                                <el-button type="text" @click.native.prevent="del(scope.row.id)">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-scrollbar>
            </el-form>
            <div class="demo-drawer__footer" style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD">
                <el-button style="height:32px;margin-top:12px" @click="closeDialog">关 闭 </el-button>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { getTableHeight, formatPhone } from '@/utils/index'
import { insertTempAttendee, getList, deleteByIds } from '@/api/attendee'
import { getConferenceId } from '@/utils/conference-auth'
import { telephoneValid } from '@/utils/valid-common'
export default {
    name: 'AddTempAttendee',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            tableData: [],
            loading: false,
            dialogHeight: getTableHeight(35) + 'px',
            ruleForm: {
                ssoUserName: null,
                mobile: null
            },
            rules: {
                ssoUserName: [{ required: true, message: '请输入姓名', pattern: '[^ \x22]+', trigger: 'blur' }],
                mobile: [{ required: true, message: '请输入手机号', pattern: '[^ \x22]+', trigger: 'blur' },
                    telephoneValid()]
            }
        }
    },
    watch: {
        dialogVisible(val) {
            if (val) {
                this.getList()
            }
        }
    },
    methods: {
        del(val) {
            var attendeeIds = [val]
            this.$confirm('请确认是否删除临时' + this.getConferenceTemplate(2) + '信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteByIds(attendeeIds).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        this.getList()
                    }
                })
            }).catch(() => {})
        },
        getList() {
            var dataTemp = {
                conferenceId: getConferenceId(),
                attendeeRoleFlagEqual: [4]
            }
            getList(dataTemp).then(res => {
                this.tableData = res.result.list
            })
        },
        qiehuanshoujijiami(event) {
            if (event.currentTarget.parentElement.children[0].style.display === 'none') {
                event.currentTarget.parentElement.children[0].style.display = ''
                event.currentTarget.parentElement.children[1].style.display = 'none'
            } else {
                event.currentTarget.parentElement.children[0].style.display = 'none'
                event.currentTarget.parentElement.children[1].style.display = ''
            }
        },
        formatPhone(val) {
            return formatPhone(val)
        },
        closeDialog() {
            this.$refs['ruleForm'].resetFields()
            this.$emit('closeDialog', null)
        },
        insert() {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    this.ruleForm.conferenceId = getConferenceId()
                    this.ruleForm.attendeeRoleFlag = 4
                    this.loading = true
                    insertTempAttendee(this.ruleForm).then(res => {
                        if (res.success) {
                            this.$message(res.message)
                            this.getList()
                            this.$refs['ruleForm'].resetFields()
                            // this.closeDialog()
                        }
                        this.loading = false
                    }).catch(() => {
                        this.loading = false
                    })
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
<style lang="scss" >
.addTempAttendeeClass {
    .el-table__empty-text {
        margin-top: -110px !important;
        background-image: url(../../../assets/table-no-data.png) !important;
        background-size: 100% 100% !important;
        background-repeat: no-repeat !important;
        width:150px !important;
        height:90px !important;
        padding-top:85px !important;
        font-size: 16px !important;
        text-align: center !important;
    }
}
</style>
