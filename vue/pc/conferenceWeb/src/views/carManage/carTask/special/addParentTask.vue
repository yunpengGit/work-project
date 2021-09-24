<template>
    <div class="">
        <el-drawer :title="'添加用车'" :visible.sync="dialogVisible" :before-close="closeDialog" size="40%">
            <el-form
                ref="ruleForm"
                :model="ruleForm"
                :rules="rules"
                label-width="120px"
                class="demo-ruleForm"
                :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto',}"
            >
                <!-- 'border-top': 'solid #ccc 1px' -->
                <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%;margin-top:-20px">
                    <h5 style="margin-left:50px">乘车人信息</h5>

                    <el-form-item :label="getConferenceTemplate(2) + '姓名'" prop="attendeeId">
                        <el-select
                            v-model="ruleForm.attendeeId"
                            filterable
                            remote
                            reserve-keyword
                            :placeholder="'请输入' + getConferenceTemplate(2) + '姓名'"
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
                    </el-form-item>
                    <el-form-item :label="getConferenceTemplate(2) + '手机号'" prop="attendeePhone">
                        <el-input
                            v-model="ruleForm.attendeePhone"
                            class="width360"
                            show-word-limit
                            maxlength="11"
                            disabled
                        />
                    </el-form-item>
                    <el-form-item label="联系方式" prop="contact">
                        <el-radio-group v-model="ruleForm.contact">
                            <el-radio :label="1">乘车人</el-radio>
                            <el-radio :label="0">指定联系人</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="ruleForm.contact === 0" label="联系人姓名" prop="contactPerson">
                        <el-input
                            v-model="ruleForm.contactPerson"
                            class="width360"
                            show-word-limit
                            maxlength="30"
                            placeholder="请输入联系人姓名"
                        />
                    </el-form-item>
                    <el-form-item v-if="ruleForm.contact === 0" label="联系人电话" prop="contactPhone">
                        <el-input
                            v-model="ruleForm.contactPhone"
                            class="width360"
                            show-word-limit
                            maxlength="11"
                            placeholder="请输入联系人电话"
                        />
                    </el-form-item>
                    <div style="width: 100%;padding-left:40px;padding-right: 20%;">
                        <el-divider />
                    </div>

                    <h5 style="margin-left:50px">专车信息</h5>
                    <el-form-item label="用车时间" prop="datetimes">
                        <el-date-picker
                            v-model="ruleForm.datetimes"
                            :default-time="configDefaultTime"
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetimerange"
                            start-placeholder="选择开始时间"
                            end-placeholder="选择结束时间"
                            class="width360"
                            :editable="false"
                        />
                    </el-form-item>
                    <el-form-item prop="vehicleName" label="车辆信息">
                        <el-input v-model="ruleForm.vehicleName" disabled class="width360" style="width: 256px;" />
                        <el-button
                            class="tianjiahuiyizuzhiClass"
                            size="small"
                            type="primary"
                            style="margin-top:5px;color:#1E89FF"
                            @click="xuanzecheliang"
                        >选择</el-button>
                    </el-form-item>

                    <el-form-item prop="driverName" label="司机信息">
                        <el-input v-model="ruleForm.driverName" disabled class="width360" style="width: 256px;" />
                        <el-button
                            class="tianjiahuiyizuzhiClass"
                            size="small"
                            type="primary"
                            style="margin-top:5px;color:#1E89FF"
                            @click="xuanzesiji"
                        >选择</el-button>
                    </el-form-item>
                    <el-form-item label="备注" prop="description">
                        <el-input
                            v-model="ruleForm.description"
                            show-word-limit
                            maxlength="300"
                            placeholder="请输入备注"
                            class="width360"
                            type="textarea"
                            :rows="4"
                        />
                    </el-form-item>
                </el-scrollbar>
            </el-form>
            <div
                class="demo-drawer__footer"
                style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD"
            >
                <el-button style="height:32px;margin-top:12px" @click="closeDialog">取 消</el-button>
                <el-button
                    type="primary"
                    :disabled="ruleForm.attendees === null || ruleForm.attendees.length === 0"
                    :loading="loading"
                    style="height:32px;margin-top:12px"
                    @click="insert"
                >保存</el-button>
            </div>
        </el-drawer>
        <PickSpecialCar
            :start-time="startTime"
            :end-time="endTime"
            :dialog-visible="pickCarDialogVisible"
            @closeDialog="closePickCarDialog"
        />

        <PickSpecialDriver
            :start-time="startTime"
            :end-time="endTime"
            :dialog-visible="pickDriverDialogVisible"
            @closeDialog="closePickDriverDialog"
        />
    </div>
</template>

<script>
import { getConferenceId } from '@/utils/conference-auth'
import { getTableHeight } from '@/utils/index'
import { getList, findAttendeeIdByNameAndPhone } from '@/api/attendee'
import { showLoading, closeLoading } from '@/utils/loading'
import { insert } from '@/api/special'
import PickSpecialCar from '../components/pickCar'
import PickSpecialDriver from '../components/pickDriver'
import { telephoneValid } from '@/utils/valid-common'
export default {
    name: 'AddParentTask',
    components: {
        PickSpecialCar,
        PickSpecialDriver
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            queryTemp: null,
            options: [],
            startTime: null,
            endTime: null,
            pickDriverDialogVisible: false,
            pickCarDialogVisible: false,
            dialogHeight: getTableHeight(35) + 'px',
            loading: false,
            ruleForm: {
                contact: 1,
                datetimes: [],
                attendeeId: null,
                attendeeName: null,
                attendeePhone: null,
                attendees: null,
                vehicleName: null,
                vehicleId: null,
                driverName: null,
                driverId: null,
                description: null,
                contactPerson: null,
                contactPhone: null,
                title: null
            },
            rules: {
                datetimes: [{ required: true, message: '请输入用车时间', trigger: 'blur' }],
                attendeeId: [{ required: true, message: '请选择乘车人', trigger: 'change' }],
                // attendeeName: [{ required: true, message: '请输入参会人名称', pattern: '[^ \x22]+', trigger: 'blur' }],
                // attendeePhone: [{ required: true, message: '请输入参会人手机', pattern: '[^ \x22]+', trigger: 'blur' },
                //     telephoneValid()],
                vehicleName: [{ required: true, message: '请输入车辆信息', pattern: '[^ \x22]+', trigger: 'change' }],
                driverName: [{ required: true, message: '请输入司机', pattern: '[^ \x22]+', trigger: 'change' }],
                // contactPerson: [{ required: true, message: '请输入联系人', pattern: '[^ \x22]+', trigger: 'blur' }],
                // phone: [{ required: true, message: '请输入联系人电话', pattern: '[^ \x22]+', trigger: 'blur' },
                //     telephoneValid()]
                contactPhone: [telephoneValid()]
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
                        this.ruleForm.attendees = [
                            { id: val }
                        ]
                        this.ruleForm.title = item.fixAttributeCommonVO.attendeeName + '的专车'
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

                this.queryTemp = query

                getList(dataTemp).then(res => {
                    if (res.success) {
                        if (query === this.queryTemp) {
                            this.options = res.result.list
                        }
                    }
                })
            } else {
                this.options = []
            }
        },
        // querySearchAsync(queryString, cb) {
        //     var dataTemp = {
        //         attendeeRoleFlagEqual: [0, 1, 3, 4],
        //         resFlag: 2,
        //         signStatusEqual: [3],
        //         conferenceId: getConferenceId()
        //     }

        //     getList(dataTemp).then(res => {
        //         if (res.success) {
        //             var list = []
        //             if (res.result.list !== null && res.result.list.length > 0) {
        //                 res.result.list.forEach(item => {
        //                     list.push({ value: item })
        //                 })
        //                 clearTimeout(this.timeout)
        //                 this.timeout = setTimeout(() => {
        //                     cb(list)
        //                 }, 1000 * Math.random())
        //                 // cb(list)
        //             }
        //         }
        //     })
        // },
        closePickDriverDialog(val) {
            if (val !== null) {
                this.ruleForm.driverName = val.name
                this.ruleForm.driverId = val.id
            }
            this.pickDriverDialogVisible = false
        },
        closePickCarDialog(val) {
            if (val !== null) {
                this.ruleForm.vehicleName = val.name
                this.ruleForm.vehicleId = val.id
                this.ruleForm.driverName = val.driverName
                this.ruleForm.driverId = val.driverId
            }
            this.pickCarDialogVisible = false
        },
        findAttendeeIdByNameAndPhone() {
            var valieMessage = ''
            this.$refs.ruleForm.validateField(['attendeeName', 'attendeePhone'], (valid) => {
                if (valid !== null && valid !== '') {
                    valieMessage = valid
                }
            })
            if (valieMessage !== null && valieMessage !== '') {
                return false
            }
            var load = showLoading()
            var dataTemp = {
                conferenceId: getConferenceId(),
                attendeeName: this.ruleForm.attendeeName,
                phone: this.ruleForm.attendeePhone
            }
            findAttendeeIdByNameAndPhone(dataTemp).then(res => {
                if (res.success) {
                    if (res.result === null) {
                        this.$message('' + this.getConferenceTemplate(2) + '不存在')
                        this.ruleForm.attendeeName = null
                        this.ruleForm.attendeePhone = null
                        this.ruleForm.attendees = []
                    } else {
                        this.ruleForm.attendees = [{ id: res.result }]
                    }
                } else {
                    this.$message('' + this.getConferenceTemplate(2) + '不存在')
                    this.ruleForm.attendeeName = null
                    this.ruleForm.attendeePhone = null
                    this.ruleForm.attendees = []
                }
                closeLoading(load)
            }).catch(() => {
                closeLoading(load)
            })
        },
        closeDialog() {
            this.options = []
            this.ruleForm = {
                contact: 1,
                datetimes: [],
                attendeeName: null,
                attendeePhone: null,
                attendees: null,
                vehicleName: null,
                vehicleId: null,
                driverName: null,
                driverId: null,
                description: null,
                contactPerson: null,
                contactPhone: null,
                title: null
            }
            this.$refs['ruleForm'].resetFields()
            this.$emit('closeDialog', null)
            // getConferenceId()
        },
        insert() {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    this.ruleForm.conferenceId = getConferenceId()
                    this.ruleForm.type = '4'
                    this.ruleForm.startTime = this.ruleForm.datetimes[0]
                    this.ruleForm.endTime = this.ruleForm.datetimes[1]
                    insert(this.ruleForm).then(res => {
                        if (res.success) {
                            this.$message(res.message)
                            this.closeDialog()
                        }
                    })
                }
            })
        },
        xuanzecheliang() {
            this.$refs.ruleForm.validateField('datetimes', (valid) => {
                if (valid === null || valid === '') {
                    this.startTime = this.ruleForm.datetimes[0]
                    this.endTime = this.ruleForm.datetimes[1]
                    this.pickCarDialogVisible = true
                } else {
                    this.$message('请输入用车时间')
                }
            })
            //
        },
        xuanzesiji() {
            this.$refs.ruleForm.validateField('datetimes', (valid) => {
                if (valid === null || valid === '') {
                    this.startTime = this.ruleForm.datetimes[0]
                    this.endTime = this.ruleForm.datetimes[1]
                    this.pickDriverDialogVisible = true
                } else {
                    this.$message('请输入用车时间')
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
</style>
