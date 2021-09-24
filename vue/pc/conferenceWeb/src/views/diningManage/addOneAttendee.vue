<template>
    <div class="">
        <el-drawer :title="title" :visible.sync="dialogVisible" :before-close="closeDialog" size="40%" append-to-body>
            <el-form
                ref="ruleForm"
                :model="ruleForm"
                :rules="rules"
                label-width="140px"
                class="demo-ruleForm"
                :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto',}"
            >
                <!-- 'border-top': 'solid #ccc 1px' -->
                <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                    <el-form-item label="用餐人姓名" prop="attendeeId">
                        <el-select
                            v-model="ruleForm.attendeeId"
                            filterable
                            remote
                            reserve-keyword
                            placeholder="用餐人姓名"
                            :disabled="nameDisabled"
                            :remote-method="remoteMethod"
                            :loading="loading"
                            class="width360"
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
                        <!-- <el-input v-model="ruleForm.attendeeName" class="width360" show-word-limit maxlength="30" placeholder="参会人姓名" @blur="findAttendeeIdByNameAndPhone" /> -->
                    </el-form-item>
                    <el-form-item label="手机号" prop="attendeePhone">
                        <el-input
                            v-model="ruleForm.attendeePhone"
                            class="width360"
                            show-word-limit
                            maxlength="11"
                            disabled
                        />
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-input v-model="ruleForm.sex" class="width360" disabled />
                    </el-form-item>
                    <el-form-item label="职务">
                        <el-input v-model="ruleForm.position" class="width360" disabled />
                    </el-form-item>
                    <el-form-item label="单位全称/简称">
                        <el-input v-model="ruleForm.organizationName" class="width360" disabled />
                    </el-form-item>
                    <el-form-item label="参会人类型">
                        <el-input v-model="ruleForm.typeStr" class="width360" disabled />
                    </el-form-item>
                    <el-form-item label="用餐日期">
                        <el-input v-model="diningDate" class="width360" disabled />
                    </el-form-item>
                    <el-form-item label="用餐时间">
                        <el-input v-model="diningTime" class="width360" disabled />
                    </el-form-item>
                    <el-form-item label="桌号">
                        <el-select v-model="ruleForm.tableNo" placeholder="全部" class="width360" size="small">
                            <el-option
                                v-for="item in tableNoList"
                                :key="item.val"
                                :label="item.val"
                                :value="item.val"
                            />
                        </el-select>
                    </el-form-item>

                </el-scrollbar>
            </el-form>
            <div
                class="demo-drawer__footer"
                style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD"
            >
                <el-button
                    v-if="!changeFlag"
                    type="primary"
                    :disabled="ruleForm.attendees === null || ruleForm.attendees.length === 0"
                    :loading="loading"
                    style="height:32px;margin-top:12px"
                    @click="insert"
                >确认添加</el-button>
                <el-button
                    v-if="changeFlag"
                    type="primary"
                    :disabled="ruleForm.attendees === null || ruleForm.attendees.length === 0"
                    :loading="loading"
                    style="height:32px;margin-top:12px"
                    @click="change"
                >确认修改</el-button>
                <el-button style="height:32px;margin-top:12px" @click="closeDialog">取 消</el-button>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { getConferenceId } from '@/utils/conference-auth'
import { addDiningTaskAttendee, updateTableNo } from '@/api/dining'

import { getTableHeight } from '@/utils/index'
import { getList, findAttendeeIdByNameAndPhone } from '@/api/attendee'
import { showLoading, closeLoading } from '@/utils/loading'
import { addVehicleTaskAttendee } from '@/api/car'
import { telephoneValid } from '@/utils/valid-common'
export default {
    name: 'AddAttendeeToSpecial',
    components: {
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        taskId: {
            type: null,
            default: null
        },
        diningDate: {
            type: null,
            default: null
        },
        diningTime: {
            type: null,
            default: null
        },
        tableNoList: {
            type: null,
            default: null
        }
        // nameDisabled: {
        //     type: Boolean,
        //     default: false
        // }

    },
    data() {
        return {
            title: '添加用餐人员',
            changeFlag: false,
            options: [],
            dialogHeight: getTableHeight(35) + 'px',
            loading: false,
            ruleForm: {
                attendeeId: null,
                attendeeName: null,
                attendeePhone: null,
                attendees: null,
                description: null,
                sex: null,
                position: null,
                organizationName: null,
                typeStr: null,
                tableNo: null
            },
            nameDisabled: false,

            rules: {
                attendeeId: [{ required: true, message: '请选择乘车人', trigger: 'change' }]
                // attendeeName: [{ required: true, message: '请输入参会人名称', pattern: '[^ \x22]+', trigger: 'blur' }],
                // attendeePhone: [{ required: true, message: '请输入参会人手机', pattern: '[^ \x22]+', trigger: 'blur' },
                //     telephoneValid()],
                // contactPerson: [{ required: true, message: '请输入联系人', pattern: '[^ \x22]+', trigger: 'blur' }],
                // phone: [{ required: true, message: '请输入联系人电话', pattern: '[^ \x22]+', trigger: 'blur' },
                //     telephoneValid()]
            }
        }
    },
    watch: {
        dialogVisible() {
            this.options = []
        }

    },
    methods: {
        changeAttendee(val) {
            if (this.options !== null) {
                this.options.forEach(item => {
                    if (item.id === val) {
                        this.ruleForm.attendeePhone = item.fixAttributeCommonVO.phone
                        this.ruleForm.sex = item.fixAttributeCommonVO.sexStr
                        this.ruleForm.position = item.fixAttributeCommonVO.position
                        this.ruleForm.typeStr = item.fixAttributeCommonVO.honourFlag === 1 ? '主宾' : '随员'
                        this.ruleForm.organizationName = this.formatOrgName(item.fixAttributeCommonVO.organizationSortName, item.fixAttributeCommonVO.organizationName)
                        this.ruleForm.attendees = [
                            { id: val }
                        ]
                    }
                })
            } else {
                this.ruleForm.attendees = []
            }
        },
        remoteMethod(query) {
            if (query !== null && query.length > 1) {
                var dataTemp = {
                    attendeeNameLike: query,
                    attendeeRoleFlagEqual: [0, 1, 3, 4],
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
        // findAttendeeIdByNameAndPhone () {
        //     var valieMessage = ''
        //     this.$refs.ruleForm.validateField(['attendeeName', 'attendeePhone'], (valid) => {
        //         if (valid !== null && valid !== '') {
        //             valieMessage = valid
        //         }
        //     })
        //     if (valieMessage !== null && valieMessage !== '') {
        //         return false
        //     }
        //     var load = showLoading()
        //     var dataTemp = {
        //         conferenceId: getConferenceId(),
        //         attendeeName: this.ruleForm.attendeeName,
        //         phone: this.ruleForm.attendeePhone
        //     }
        //     findAttendeeIdByNameAndPhone(dataTemp).then(res => {
        //         if (res.success) {
        //             if (res.result === null) {
        //                 this.$message('' + this.getConferenceTemplate(2) + '不存在')
        //                 this.ruleForm.attendeeName = null
        //                 this.ruleForm.attendeePhone = null
        //                 this.ruleForm.attendees = []
        //             } else {
        //                 this.ruleForm.attendees = [{ id: res.result }]
        //             }
        //         } else {
        //             this.$message('' + this.getConferenceTemplate(2) + '不存在')
        //             this.ruleForm.attendeeName = null
        //             this.ruleForm.attendeePhone = null
        //             this.ruleForm.attendees = []
        //         }
        //         closeLoading(load)
        //     }).catch(() => {
        //         closeLoading(load)
        //     })
        // },
        changeTitle() {
            this.title = '添加用餐人员'
            this.changeFlag = false
        },
        initData(row) {
            this.title = '编辑'
            this.changeFlag = true
            this.nameDisabled = true
            this.options = [row]
            this.ruleForm.attendeeId = row.fixAttributeCommonVO.attendeeId

            this.ruleForm.attendeePhone = row.fixAttributeCommonVO.phone
            this.ruleForm.sex = row.fixAttributeCommonVO.sexStr
            this.ruleForm.position = row.fixAttributeCommonVO.position
            this.ruleForm.typeStr = row.fixAttributeCommonVO.honourFlag === 1 ? '主宾' : '随员'
            this.ruleForm.organizationName = this.formatOrgName(row.fixAttributeCommonVO.organizationSortName, row.fixAttributeCommonVO.organizationName)
            this.ruleForm.attendees = [
                { id: row.fixAttributeCommonVO.attendeeId }
            ]
            this.ruleForm.tableNo = row.tableNo
        },
        closeDialog() {
            this.ruleForm = {
                attendeeId: null,
                attendeeName: null,
                attendeePhone: null,
                attendees: null,
                description: null,
                sex: null,
                position: null,
                organizationName: null,
                typeStr: null,
                tableNo: null
            }
            this.nameDisabled = false
            this.$refs['ruleForm'].resetFields()
            this.$emit('closeDialog', null)
            // getConferenceId()
        },
        insert() {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    var attendeeIdList = [this.ruleForm.attendeeId]
                    var dinnerAttendees = [{ 'taskId': this.taskId, 'tableNo': this.ruleForm.tableNo }]
                    var param = { 'attendeeIdList': attendeeIdList, 'dinnerAttendees': dinnerAttendees }
                    addDiningTaskAttendee(param).then(res => {
                        if (res.success) {
                            this.$message(res.message)
                            this.closeDialog()
                        }
                    })
                }
            })
        },
        change() {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    var param = { 'attendeeId': this.ruleForm.attendeeId, 'taskId': this.taskId, 'tableNo': this.ruleForm.tableNo }
                    updateTableNo(param).then(res => {
                        if (res.success) {
                            this.$message(res.message)
                            this.closeDialog()
                        }
                    })
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.width360 {
    width: 330px;
}
.tianjiahuiyizuzhiClass {
    width: 74px;
    height: 32px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #1e89ff;
}

// ::v-deep .el-drawer__header span:focus {
//     outline: 0 !important;
// }
</style>
