<template>
    <div v-if="dialogVisible" class="">
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
                <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                    <el-form-item label="任务类型">
                        <el-input v-model="type" class="width360" disabled />
                    </el-form-item>
                    <el-form-item label="用车时间" prop="datetimes">
                        <el-date-picker
                            v-model="ruleForm.datetimes"
                            format="yyyy-MM-dd HH:mm"
                            :default-time="configDefaultTime"
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

                    <el-form-item prop="vehicleName" label="司机信息">
                        <el-input v-model="ruleForm.driverName" disabled class="width360" style="width: 256px;" />
                        <el-button
                            class="tianjiahuiyizuzhiClass"
                            size="small"
                            type="primary"
                            style="margin-top:5px;color:#1E89FF"
                            @click="xuanzesiji"
                        >选择</el-button>
                    </el-form-item>
                    <el-form-item label="出发地点" prop="startAddress">
                        <el-autocomplete
                            v-model="ruleForm.startAddress"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="出发地点"
                            class="width360"
                            @select="handleSelect"
                        />
                    </el-form-item>
                    <el-form-item label="到达地点" prop="endAddress">
                        <el-autocomplete
                            v-model="ruleForm.endAddress"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="到达地点"
                            class="width360"
                            @select="handleSelect"
                        />
                    </el-form-item>
                    <el-form-item label="乘车人姓名" prop="attendeeId">
                        <el-select
                            v-model="ruleForm.attendeeId"
                            filterable
                            remote
                            reserve-keyword
                            placeholder="乘车人姓名"
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
                        <!-- <el-autocomplete
                            v-model="ruleForm.attendeeName"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="出发地点"
                            class="width360"
                            @select="handleSelect"
                        /> -->
                        <!-- <el-input v-model="ruleForm.attendeeName" class="width360" show-word-limit maxlength="30" placeholder="乘车人姓名" @blur="findAttendeeIdByNameAndPhone" /> -->
                    </el-form-item>
                    <el-form-item label="乘车人手机号" prop="attendeePhone">
                        <el-input
                            v-model="ruleForm.attendeePhone"
                            class="width360 keepOutRight"
                            show-word-limit
                            maxlength="11"
                            disabled
                        />
                    </el-form-item>
                    <!-- <el-form-item label="参会人姓名" prop="attendeeName">
                        <el-input v-model="ruleForm.attendeeName" class="width360" show-word-limit maxlength="30"
                            placeholder="参会人姓名" @blur="findAttendeeIdByNameAndPhone" />
                    </el-form-item>
                    <el-form-item label="参会人手机号" prop="attendeePhone">
                        <el-input v-model="ruleForm.attendeePhone" class="width360" show-word-limit maxlength="11"
                            placeholder="参会人手机号" @blur="findAttendeeIdByNameAndPhone" />
                    </el-form-item> -->
                    <!-- <el-form-item label="任务主题" prop="title">
                        <el-input v-model="ruleForm.title" class="width360" maxlength="30" show-word-limit />
                    </el-form-item> -->
                    <!-- <el-form-item label="联系方式" prop="contact">
                        <el-radio-group v-model="ruleForm.contact">
                            <el-radio :label="1">本人</el-radio>
                            <el-radio :label="0">指定联系</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="ruleForm.contact === 0" label="联系人姓名" prop="contactPerson">
                        <el-input v-model="ruleForm.contactPerson" class="width360" show-word-limit maxlength="30"
                            placeholder="联系人姓名" />
                    </el-form-item>
                    <el-form-item v-if="ruleForm.contact === 0" label="联系人电话" prop="phone">
                        <el-input v-model="ruleForm.phone" class="width360" show-word-limit maxlength="11"
                            placeholder="联系人电话" />
                    </el-form-item> -->
                    <el-form-item label="自动发布任务" prop="publish">
                        <el-radio-group v-model="ruleForm.publish">
                            <el-radio v-for="item in publishOptions" :key="item.id" :label="item.id">
                                {{ item.name }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="备注" prop="description">
                        <el-input
                            v-model="ruleForm.description"
                            show-word-limit
                            maxlength="300"
                            placeholder=""
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

        <PickSpecialDriver :dialog-visible="pickDriverDialogVisible" @closeDialog="closePickDriverDialog" />
    </div>
</template>

<script>
import { getConferenceId } from '@/utils/conference-auth'
import { getTableHeight } from '@/utils/index'
import { getList, findAttendeeIdByNameAndPhone } from '@/api/attendee'
import { showLoading, closeLoading } from '@/utils/loading'
import { addVehicleTask } from '@/api/car'
import PickSpecialCar from './pickCar'
import PickSpecialDriver from './pickDriver'
import { getVehicleTaskById, getAddressListByConferenceId } from '@/api/special'

export default {
    name: 'AddTask',
    components: {
        PickSpecialCar,
        PickSpecialDriver
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        flag: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            options: [],
            startTime: null,
            endTime: null,
            pickDriverDialogVisible: false,
            pickCarDialogVisible: false,
            dialogHeight: getTableHeight(35) + 'px',
            type: '接站用车',
            loading: false,
            publishOptions: [{ 'id': 1, 'name': '是' }, { 'id': 0, 'name': '否' }],
            ruleForm: {
                publish: 1,
                type: '',
                title: '',
                startAddress: '',
                endAddress: '',
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
                description: null
                // contactPerson: null,
                // phone: null
            },
            rules: {
                datetimes: [{ required: true, message: '请输入用车时间', trigger: 'blur' }],
                attendeeName: [{ required: true, message: '请输入' + this.getConferenceTemplate(2) + '名称', pattern: '[^ \x22]+', trigger: 'blur' }],
                attendeePhone: [{ required: true, message: '请输入' + this.getConferenceTemplate(2) + '手机', pattern: '[^ \x22]+', trigger: 'blur' }],
                vehicleName: [{ required: true, message: '请输入车辆信息', pattern: '[^ \x22]+', trigger: 'blur' }],
                driverName: [{ required: true, message: '请输入司机', pattern: '[^ \x22]+', trigger: 'blur' }],
                // contactPerson: [{ required: true, message: '请输入联系人', pattern: '[^ \x22]+', trigger: 'blur' }],
                // phone: [{ required: true, message: '请输入联系人电话', pattern: '[^ \x22]+', trigger: 'blur' }],
                //  title: [{ required: true, message: '请输入任务主题', pattern: '[^ \x22]+', trigger: 'blur' }],
                startAddress: [{ required: true, message: '请输入出发地点', pattern: '[^ \x22]+', trigger: 'change' }],
                endAddress: [{ required: true, message: '请输入到达地点', pattern: '[^ \x22]+', trigger: 'change' }]
            }
        }
    },
    watch: {
        dialogVisible() {
            this.options = []
        },
        'ruleForm.datetimes': {
            handler(newVal, oldVal) {
                if (newVal !== null && newVal !== '' && newVal.length > 1) {
                    this.ruleForm.title = new Date(this.ruleForm.datetimes[0]).getMonth() + 1 + '月' + new Date(this.ruleForm.datetimes[0]).getDate() + '日'
                    if (new Date(this.ruleForm.datetimes[0]).getHours() < 12) {
                        this.ruleForm.title += '上午'
                    } else {
                        this.ruleForm.title += '下午'
                    }
                    this.ruleForm.title += this.type
                } else {
                    this.ruleForm.title = ''
                }
            },
            deep: true,
            immediate: true
        }
    },
    mounted() {
        if (this.flag === 'pickOut') {
            this.type = '送站用车'
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
        // getDefaultTitle () {
        //     this.ruleForm.title = new Date(this.ruleForm.datetimes[0]).getMonth() + 1 + '月' + new Date(this.ruleForm.datetimes[0]).getDate() + '日';
        //     if (new Date(this.ruleForm.datetimes[0]).getHours() < 12) {
        //         this.ruleForm.title += '上午'
        //     } else {
        //         this.ruleForm.title += '下午'
        //     }
        //     this.ruleForm.title += this.type
        // },
        handleSelect() {

        },
        querySearchAsync(queryString, cb) {
            getAddressListByConferenceId({ conferenceId: getConferenceId(), addressLike: queryString }).then(res => {
                if (res.success) {
                    var list = []
                    if (res.result.list !== null && res.result.list.length > 0) {
                        res.result.list.forEach(item => {
                            list.push({ value: item })
                        })
                        clearTimeout(this.timeout)
                        this.timeout = setTimeout(() => {
                            cb(list)
                        }, 1000 * Math.random())
                        // cb(list)
                    }
                }
            })
        },
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
            this.ruleForm = {
                options: [],
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
                phone: null,
                publish: 1
            }
            this.$refs['ruleForm'].resetFields()
            this.$emit('closeDialog', null)
            // getConferenceId()
        },
        insert() {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    this.ruleForm.conferenceId = getConferenceId()
                    if (this.flag === 'pickUp') {
                        this.ruleForm.type = '1'
                    }
                    if (this.flag === 'pickOut') {
                        this.ruleForm.type = '2'
                    }

                    this.ruleForm.startTime = this.ruleForm.datetimes[0]
                    this.ruleForm.endTime = this.ruleForm.datetimes[1]
                    addVehicleTask(this.ruleForm).then(res => {
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
            this.pickDriverDialogVisible = true
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
