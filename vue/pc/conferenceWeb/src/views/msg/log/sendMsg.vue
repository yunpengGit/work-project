<template>
    <div class="">
        <el-drawer
            :title="dialogTitle"
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
                <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%" required>
                    <el-form-item label="推送方式" prop="tplScope">
                        <el-radio-group v-model="ruleForm.tplScope" @change="changeThemeCode">
                            <el-radio :label="0">IM</el-radio>
                            <el-radio :label="1">短信</el-radio>
                            <el-radio :label="2">自动匹配</el-radio>
                            <el-radio :label="3">全部</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="人员类型" prop="receiveUserType" required>
                        <el-radio-group v-model="ruleForm.receiveUserType" @change="changeReceiveUserType">
                            <el-radio :label="1">{{ getConferenceTemplate(2) }}</el-radio>
                            <el-radio :label="2" style="margin-left:-7px">会务组</el-radio>
                            <el-radio :label="3" style="margin-left:-7px">司机</el-radio>
                            <el-radio :label="4" style="margin-left:-7px">嘉宾</el-radio>
                            <el-radio :label="5" style="margin-left:-7px">临时来宾</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="人员范围" prop="sendScope" required>
                        <el-radio-group v-model="ruleForm.sendScope">
                            <el-radio :label="0">全部人员</el-radio>
                            <el-radio :label="1">指定人员</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-show="ruleForm.sendScope === 1">
                        <el-button class="tianjiahuiyizuzhiClass" size="small" type="primary" style="margin-top:5px;color:#1E89FF" @click="tianjiarenyuan"><i class="el-icon-plus" />  添加人员</el-button>
                    </el-form-item>
                    <el-form-item v-show="ruleForm.sendScope === 1" label="人员信息" prop="nameContent">
                        <el-input
                            v-model="ruleForm.nameContent"
                            type="textarea"
                            :rows="8"
                            show-word-limit
                            maxlength="300"
                            style="width:80%"
                        />
                    </el-form-item>
                    
                    <el-form-item label="推送主题" style="margin-top:10px" prop="themeCode">
                        <el-select v-model="ruleForm.themeCode" placeholder="推送主题" style="width:80%" @change="changeThemeCode">
                            <el-option
                                v-for="item in themeCodes"
                                :key="item.valCode"
                                :label="item.valName"
                                :value="item.valCode"
                            />
                        </el-select>
                    </el-form-item>
                    <!-- :required="ruleForm.tplScope === 0 || ruleForm.tplScope === 2 || ruleForm.tplScope === 3" -->
                    <el-form-item v-show="(ruleForm.tplScope === 0 || ruleForm.tplScope === 2 || ruleForm.tplScope === 3) && false" label="推送标题" prop="tplTitle">
                        <el-input class="keepOutRight" v-model="ruleForm.tplTitle" show-word-limit maxlength="30" style="width:80%" placeholder="请输入推送标题" />
                    </el-form-item>
                    <el-form-item label="推送内容" prop="tplContent">
                        <el-input
                            v-model="ruleForm.tplContent"
                            type="textarea"
                            :rows="8"
                            show-word-limit
                            maxlength="200"
                            style="width:80%"
                        />
                    </el-form-item>
<!-- 
                    <div style="margin-left:120px">
                        <span class="_88OpacityClass">智能模板变量说明</span>
                        <br>
                        <span class="_48OpacityClass"> ${conferenceName}</span><span class="_48OpacityClass marginLeftClass">{{ getConferenceTemplate(1) }}名称</span><br>
                        <span class="_48OpacityClass"> ${conferenceStartTime}</span><span class="_48OpacityClass marginLeftClass">{{ getConferenceTemplate(1) }}开始时间</span><br>
                        <span class="_48OpacityClass"> ${conferenceEndTime}</span><span class="_48OpacityClass marginLeftClass">{{ getConferenceTemplate(1) }}结束时间</span><br>
                        <span class="_48OpacityClass"> ${conferenceStation}</span><span class="_48OpacityClass marginLeftClass">{{ getConferenceTemplate(1) }}地点</span><br>
                        <span class="_48OpacityClass"> ${attendeeName}</span><span class="_48OpacityClass marginLeftClass">人员姓名</span><br>
                        <span class="_48OpacityClass"> ${createUserName}</span><span class="_48OpacityClass marginLeftClass">代报名姓名</span><br>
                        <span class="_48OpacityClass"> ${confereceServicePhone}</span><span class="_48OpacityClass marginLeftClass">{{ getConferenceTemplate(1) }}服务电话</span><br>
                        <span class="_48OpacityClass"> ${appName}</span><span class="_48OpacityClass marginLeftClass">应用名称</span><br>
                        <span class="_48OpacityClass"> ${noticeName}</span><span class="_48OpacityClass marginLeftClass">通知渠道名称</span><br>
                        <span class="_48OpacityClass"> ${changeContent}</span><span class="_48OpacityClass marginLeftClass">变更内容</span><br>
                    </div> -->
                </el-scrollbar>
            </el-form>
            <div class="demo-drawer__footer" style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD">
                <el-button style="height:32px;margin-top:12px" @click="closeDialog">取 消</el-button>
                <el-button type="primary" :loading="loading" style="height:32px;margin-top:12px" @click="insert">发送</el-button>
            </div>
        </el-drawer>
        <PickAttendeeToMsg :dialog-visible="pickDialogVisible" :receiveUserType="ruleForm.receiveUserType"  @closeDialog="closePickAttendeeDialog" />
        <!-- <PickDriver :select-ids="selectUserIds" :dialog-visible="pickDriverDialogVisible" @closeDialog="closePickDriverDialog" />
        <PickGroupRoleUser :select-ids="selectUserIds" :dialog-visible="pickRoleUsersDialogVisible" @closeDialog="closePickRoleUsersDialog" />
        <PickGuest :select-ids="selectUserIds" :dialog-visible="pickGuestDialogVisible" @closeDialog="closePickGuestDialog" /> -->
    </div>
</template>

<script>
import { sendManually, getTemplateList } from '@/api/msg'
import { getTableHeight } from '@/utils/index'
import { getDicList } from '@/api/common'
// import PickAttendee from '@/views/attendee/components/pickAttendee'
// import PickDriver from './pickDriver'
// import PickGroupRoleUser from './pickGroupRoleUser'
import PickAttendeeToMsg from './pickAttendee'
import { getConferenceId } from '@/utils/conference-auth'
export default {
    name: 'SendMsg',
    components: {
        PickAttendeeToMsg
        // PickAttendee
        // PickDriver,
        // PickGroupRoleUser,
        // PickGuest
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        var tplTitleValid = (rule, value, callback) => {
            if (this.ruleForm.tplScope === 0 || this.ruleForm.tplScope === 2 || this.ruleForm.tplScope === 3) {
                if (value === null || value === '') {
                    callback(new Error('请输入推送标题'))
                } else {
                    callback()
                }
            } else {
                callback()
            }
        }
        var validatePass = (rule, value, callback) => {
            if (this.ruleForm.sendScope === 1) {
                if (value === '') {
                    callback(new Error('手机号不能为空'))
                } else {
                    var reg = /^(\d+[,])*(\d+)$/
                    if (!reg.exec(value)) {
                        callback(new Error('手机号格式错误'))
                    }
                    callback()
                }
            } else {
                callback()
            }
        }
        return {
            loading: false,
            dialogHeight: getTableHeight(35) + 'px',
            dialogTitle: '发送新通知',
            selectUserIds: [],
            selectUserData: [],
            msgFlag: 1,
            pickDialogVisible: false,
            themeCodes: [],
            ruleForm: {
                tplScope: 0,
                receiveUserType: 1,
                sendScope: 0,
                themeCode: null,
                tplTitle: null,
                tplContent: null,
                nameContent: '',
                phoneContent:'',
                receiveUserTypes:[]
            },
            rules: {
                tplScope:[{ required: true, message: '请选择推送方式', trigger: 'change' }],
                receiveUserType:[{ required: true, message: '请选择人员类型', trigger: 'change' }],
                sendScope:[{ required: true, message: '请选择人员范围', trigger: 'change' }],
                nameContent:[{ required: true, message: '请添加人员信息', trigger: 'change' }],
                // tplTitle: [{ validator: tplTitleValid, pattern: '[^ \x22]+', trigger: ['blur', 'change'] }],
                // phoneContent: [{ validator: validatePass, trigger: 'change' }],
                themeCode: [{ required: true, message: '请选择推送主题', trigger: 'change' }],
                tplContent: [{ required: true, message: '请输入推送内容 ', pattern: '[^ \x22]+', trigger: ['blur', 'change'] }]
            }
        }
    },
    created() {
        this.getThemeCodes()
    },
    methods: {
        changeReceiveUserType() {
            this.selectUserIds = []
            this.selectUserData = []
        },
        changeThemeCode() {
            this.ruleForm.tplContent = null
            this.ruleForm.tplTitle = null
            if (this.ruleForm.themeCode !== null && this.ruleForm.themeCode !== '') {
                getTemplateList({ tplScope: this.ruleForm.tplScope, themeCode: this.ruleForm.themeCode,conferenceId:getConferenceId() }).then(res => {
                    if (res.success) {
                        if (res.result.total > 0) {
                            this.ruleForm.tplContent = res.result.list[0].tplContent
                            this.ruleForm.tplTitle = res.result.list[0].tplTitle
                        }
                    }
                })
            }
        },
        closeDialog() {
            this.ruleForm = {
                themeCode: null,
                tplTitle: null,
                tplContent: null,
                tplScope: 0,
                receiveUserType: 1,
                sendScope: 0,
                phoneContent: '',
                nameContent:'',
            }
            this.$refs['ruleForm'].resetFields()
            this.$emit('closeDialog', null)
        },
        closePickAttendeeDialog(val) {
            if (this.ruleForm.phoneContent === null) {
                this.ruleForm.phoneContent = ''
            }
            if (this.ruleForm.nameContent === null) {
                this.ruleForm.nameContent = ''
            }
            console.log(val,'val121')
            if (val !== null && val.length > 0) {
                val.forEach(item => {
                    if (this.ruleForm.phoneContent.indexOf(item.fixAttributeCommonVO.phone) === -1) {
                        if (this.ruleForm.phoneContent === '' || this.ruleForm.phoneContent.substr(this.ruleForm.phoneContent.length - 1, 1) === ',') {
                            this.ruleForm.phoneContent += item.fixAttributeCommonVO.phone
                        } else {
                            this.ruleForm.phoneContent += ',' + item.fixAttributeCommonVO.phone
                        }
                    }
                    if (this.ruleForm.nameContent.indexOf(item.fixAttributeCommonVO.attendeeName) === -1) {
                        if (this.ruleForm.nameContent === '' || this.ruleForm.nameContent.substr(this.ruleForm.nameContent.length - 1, 1) === ',') {
                            this.ruleForm.nameContent += item.fixAttributeCommonVO.attendeeName
                        } else {
                            this.ruleForm.nameContent += ',' + item.fixAttributeCommonVO.attendeeName
                        }
                    }
                })
            }
            this.pickDialogVisible = false
        },
        getThemeCodes() {
            console.log(333)
            getDicList({ 'code': 'manualThemeCode' }).then(response => {
                this.themeCodes = response.result
            })
        },
        tianjiarenyuan() {
            this.pickDialogVisible = true
        },
        insert() {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    var flag = true
                    if (this.ruleForm.sendScope === 1) {
                        // this.ruleForm.receiveUserType = null
                        this.ruleForm.receiveUserTypes = [this.ruleForm.receiveUserType]
                        var phones = this.ruleForm.phoneContent.split(',')

                        phones.forEach(item => {
                            if (item === null || item.length !== 11) {
                                this.$message({
                                    message: '手机号' + item + '格式不正确',
                                    type: 'error'
                                })
                                // this.$message('手机号格式不正确,' + )
                                flag = false
                            }
                        })
                        this.ruleForm.phoneNumList = phones
                    } else {
                        this.ruleForm.receiveUserTypes = [this.ruleForm.receiveUserType]
                    }
                    if (flag) {
                        this.ruleForm.conferenceId = getConferenceId()

                        this.loading = true
                        sendManually(this.ruleForm).then(res => {
                            if (res.success) {
                                this.$message(res.message)
                                this.closeDialog()
                            }
                            this.loading = false
                        }).catch(() => {
                            this.loading = false
                        })
                    }
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
._88OpacityClass{
     width: 343px;
    height: 30px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(25, 31, 36, 0.88);
    line-height: 22px;
}
._48OpacityClass {
    width: 343px;
    height: 30px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(25, 31, 36, 0.48);
    line-height: 20px;
}
.tianjiahuiyizuzhiClass {
    width: 114px;
    height: 32px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #1E89FF;
}
.marginLeftClass {
    margin-left: 15px;
}
</style>
