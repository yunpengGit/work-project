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
                <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                    <el-form-item label="参会人姓名" prop="accompanyAttendeeId">
                        <el-select
                            v-model="ruleForm.accompanyAttendeeId"
                            filterable
                            remote
                            reserve-keyword
                            placeholder="请输入参会人姓名"
                            :remote-method="remoteMethod"
                            :loading="loading"
                            style="width:80%"
                            @change="changeAttendee"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.fixAttributeCommonVO.attendeeName"
                                :value="item.id"
                            >
                                <span style="float: left">{{ item.fixAttributeCommonVO.attendeeName }}</span>
                                <span style="float: left">{{ '(' + item.fixAttributeCommonVO.phone + ')' }}</span>
                                <!-- <span style="float: left">{{ item.fixAttributeCommonVO.position }}</span> -->
                                <span style="float: right; color: #8492a6; font-size: 13px">
                                    {{ item.fixAttributeCommonVO.position !== null && item.fixAttributeCommonVO.position.length > 8 ? ("(" + item.fixAttributeCommonVO.position.substr(0,7) + '...)') : (item.fixAttributeCommonVO.position !== null && item.fixAttributeCommonVO.position !== '' ? ('(' + item.fixAttributeCommonVO.position + ')') : '') }}
                                </span>
                                <span style="float: right; color: #8492a6; font-size: 13px">
                                    {{ formatOrgName(item.fixAttributeCommonVO.organizationSortName, item.fixAttributeCommonVO.organizationName, 5) }}
                                </span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input class="keepOutRight" v-model="ruleForm.attendeePhone" disabled show-word-limit maxlength="30" style="width:80%" placeholder="请输入手机号" />
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-radio-group v-model="ruleForm.sex" disabled>
                            <el-radio label="1">男</el-radio>
                            <el-radio label="2">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="职务">
                        <el-input class="keepOutRight" v-model="ruleForm.position" disabled show-word-limit maxlength="30" style="width:80%" placeholder="请输入职务" />
                    </el-form-item>
                    <el-form-item label="单位名称">
                        <el-input class="keepOutRight" v-model="ruleForm.organizationSortName" disabled show-word-limit maxlength="30" style="width:80%" placeholder="请输入单位名称" />
                    </el-form-item>
                    <el-form-item v-show="attendeePhone !== null" label="主宾姓名">
                        <el-input class="keepOutRight" v-model="attendeeName" disabled show-word-limit maxlength="30" style="width:80%" placeholder="请输入主宾姓名" />
                    </el-form-item>
                    <el-form-item label="分组名称">
                        <el-input class="keepOutRight" v-model="groupName" disabled show-word-limit maxlength="30" style="width:80%" placeholder="请输入分组名称" />
                    </el-form-item>
                </el-scrollbar>
            </el-form>
            <div class="demo-drawer__footer" style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD">
                <el-button style="height:32px;margin-top:12px" @click="closeDialog">取 消</el-button>
                <el-button type="primary" :loading="loading" style="height:32px;margin-top:12px" @click="insert">保存</el-button>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { getConferenceId } from '@/utils/conference-auth'
import { getList } from '@/api/attendee'
import { insertGroupAttendee } from '@/api/attendeeGroup'
import { getTableHeight } from '@/utils/index'
export default {
    name: 'GroupAddAttendee',
    props: {
        types: {
            type: Array,
            default: () => {
                return []
            }
        },
        groupId: {
            type: Number,
            default: null
        },
        dialogTitle: {
            type: String,
            default: null
        },
        dialogVisible: {
            type: Boolean,
            default: false
        },
        groupName: {
            type: String,
            default: null
        },
        attendeeName: {
            type: String,
            default: null
        },
        attendeePhone: {
            type: String,
            default: null
        },
        groupType: {
            type: Number,
            default: null
        }
    },
    data() {
        // var validatePass = (rule, value, callback) => {
        //     if (this.ruleForm.type === 1 || this.ruleForm.type === 2) {
        //         if (value === null || value === '') {
        //             callback(new Error('主宾姓名不能为空'))
        //         } else {
        //             callback()
        //         }
        //     } else {
        //         callback()
        //     }
        // }
        return {
            options: [],
            loading: false,
            dialogHeight: getTableHeight(35) + 'px',
            ruleForm: {
                sex: null,
                attendeePhone: null,
                conferenceId: getConferenceId(),
                name: '',
                type: 1,
                accompanyAttendeeId: null,
                description: '',
                position: null,
                organizationSortName: null
            },
            rules: {
                name: [{ required: true, message: '分组名称不能为空', pattern: '[^ \x22]+', trigger: 'blur' }],
                type: [{ required: true, message: '请选择分组类型', trigger: 'change' }],
                accompanyAttendeeId: [{ required: true, message: '主宾姓名不能为空', trigger: 'change' }]
            }
        }
    },
    watch: {
        dialogVisible(val) {
            if (val) {
                this.attendeeName = this.attendeeName + this.attendeePhone
                this.options = []
            }
        }
    },
    methods: {
        remoteMethod(query) {
            if (query !== null && query.length > 1) {
                var dataTemp = {
                    attendeeNameLike: query,
                    attendeeRoleFlagEqual: this.groupType === 1 ? [0] : [0, 1, 3, 4],
                    resFlag: 2,
                    signStatusEqual: [3],
                    conferenceId: getConferenceId()
                }

                getList(dataTemp).then(res => {
                    if (res.success) {
                        this.options = res.result.list
                    }
                })
            } else {
                this.options = []
            }
        },
        changeAttendee(val) {
            if (this.options !== null) {
                this.options.forEach(item => {
                    if (item.id === val) {
                        this.ruleForm.sex = item.fixAttributeCommonVO.sex
                        this.ruleForm.position = item.fixAttributeCommonVO.position
                        this.ruleForm.attendeePhone = item.fixAttributeCommonVO.phone
                        this.ruleForm.organizationSortName = item.fixAttributeCommonVO.organizationSortName !== null && item.fixAttributeCommonVO.organizationSortName !== '' ? item.fixAttributeCommonVO.organizationSortName : item.fixAttributeCommonVO.organizationName
                        if (this.ruleForm.name === null || this.ruleForm.name === '') {
                            // if (this.ruleForm.type === 1) {
                            //     this.ruleForm.name = item.fixAttributeCommonVO.attendeeName + '的主随分组'
                            // }
                            // if (this.ruleForm.type === 2) {
                            //     this.ruleForm.name = item.fixAttributeCommonVO.attendeeName + '的陪同分组'
                            // }
                        }
                    }
                })
            } else {
                this.ruleForm.sex = null
                this.ruleForm.position = null
                this.ruleForm.organizationSortName = null
            }
        },
        insert() {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    this.loading = true
                    this.ruleForm.id = this.groupId
                    insertGroupAttendee(this.ruleForm).then(res => {
                        if (res.success) {
                            this.$message(res.message)
                            this.closeDialog()
                        }
                        this.loading = false
                    }).catch(() => {
                        this.loading = false
                    })
                }
            })
        },
        closeDialog() {
            this.ruleForm = {
                sex: null,
                attendeePhone: null,
                conferenceId: getConferenceId(),
                name: '',
                type: 1,
                attendeeId: null,
                description: '',
                position: null,
                organizationSortName: null
            }
            this.options = []
            this.$refs['ruleForm'].resetFields()
            this.$emit('closeDialog', null)
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
