<template>
    <div class="">
        <el-drawer :title="'添加用车任务'" :visible.sync="dialogVisible" :before-close="closeDialog" size="40%">
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
                    <el-form-item label="出发时间" prop="startTime">
                        <el-date-picker
                            v-model="ruleForm.startTime"
                            :default-time="configDefaultTime[0]"
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            placeholder="选择日期时间"
                            class="width360"
                            :editable="false"
                            :picker-options="startPickerOptions"
                            @change="changeStartTime"
                        />
                    </el-form-item>
                    <el-form-item label="到达时间" prop="endTime">
                        <el-date-picker
                            v-model="ruleForm.endTime"
                            :default-time="configDefaultTime[1]"
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            placeholder="选择日期时间"
                            class="width360"
                            :editable="false"
                            :picker-options="endPickerOptions"
                        />
                    </el-form-item>
                    <el-form-item label="出发地点" prop="startAddress">
                        <el-autocomplete
                            v-model="ruleForm.startAddress"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入出发地点"
                            class="width360 keepOutRight"
                            maxlength="20"
                            show-word-limit
                            @select="handleSelect"
                        />
                    </el-form-item>
                    <el-form-item label="到达地点" prop="endAddress">
                        <el-autocomplete
                            v-model="ruleForm.endAddress"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入到达地点"
                            class="width360 keepOutRight"
                            maxlength="20"
                            show-word-limit
                            @select="handleSelect"
                        />
                    </el-form-item>
                    <el-form-item label="车辆信息">
                        <el-input v-model="ruleForm.vehicleName" class="width360" disabled />
                    </el-form-item>
                    <el-form-item label="司机信息">
                        <el-input v-model="ruleForm.driverName" class="width360" disabled />
                    </el-form-item>
                    <!-- <el-form-item label="任务主题" prop="title">
                        <el-input v-model="ruleForm.title" class="width360" show-word-limit maxlength="30" />
                    </el-form-item> -->
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
                <el-button type="primary" :loading="loading" style="height:32px;margin-top:12px" @click="insert">保存
                </el-button>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { getConferenceId } from '@/utils/conference-auth'
import { getTableHeight, GMTToStrYYYYMMDDOfChiness } from '@/utils/index'
import { addVehicleTask } from '@/api/car'
import { getVehicleTaskById, getAddressListByConferenceId } from '@/api/special'
export default {
    name: 'AddSubTask',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        taskId: {
            type: null,
            default: null
        },
        attendeeId: {
            type: null,
            default: null
        }
    },
    data() {
        return {
            addressList: [],
            startTime: null,
            endTime: null,
            startPickerOptions: {
                disabledDate: (time) => {
                    if (this.startTime !== null && this.startTime !== '') {
                        return time.getTime() > (new Date(this.endTime).getTime()) ||
                            time.getTime() < (new Date(this.startTime).getTime() - 24 * 60 * 60 * 1000 + 1) ||
                            (this.ruleForm.endTime !== null && this.ruleForm.endTime !== '' && time.getTime() > (new Date(this.ruleForm.endTime).getTime()))
                    }
                    return time.getTime() < (new Date().getTime() - 24 * 60 * 60 * 1000 + 1)
                }
            },
            endPickerOptions: {
                disabledDate: (time) => {
                    if (this.startTime !== null && this.startTime !== '') {
                        return time.getTime() > (new Date(this.endTime).getTime()) ||
                            time.getTime() < (new Date(this.startTime).getTime() - 24 * 60 * 60 * 1000 + 1) ||
                            (this.ruleForm.startTime !== null && this.ruleForm.startTime !== '' && time.getTime() < (new Date(this.ruleForm.startTime).getTime() - 24 * 60 * 60 * 1000 + 1))
                    }
                    return time.getTime() < (new Date().getTime() - 24 * 60 * 60 * 1000 + 1)
                }
            },
            dialogHeight: getTableHeight(35) + 'px',
            loading: false,
            ruleForm: {
                startTime: null,
                endTime: null,
                attendees: null,
                vehicleName: null,
                vehicleId: null,
                driverName: null,
                driverId: null,
                description: null,
                contactPerson: null,
                phone: null,
                title: null
            },
            rules: {
                startTime: [{ required: true, message: '请输入出发时间', pattern: '[^ \x22]+', trigger: 'change' }],
                endTime: [{ required: true, message: '请输入到达时间', pattern: '[^ \x22]+', trigger: 'change' }],
                startAddress: [{ required: true, message: '请输入出发地点', pattern: '[^ \x22]+', trigger: 'change' }],
                endAddress: [{ required: true, message: '请输入到达地点', pattern: '[^ \x22]+', trigger: 'change' }]
            }
        }
    },
    watch: {
        dialogVisible(val) {
            if (val) {
                this.getAddressListByConferenceId()
                this.getVehicleTaskById()
            }
        }
    },
    created() {
    },
    methods: {
        changeStartTime() {
            if (this.ruleForm.startTime !== null && this.ruleForm.startTime !== '') {
                this.ruleForm.title = GMTToStrYYYYMMDDOfChiness(this.ruleForm.startTime) + this.getConferenceTemplate(1) + '用车'
            } else {
                this.ruleForm.title = ''
            }
        },
        getVehicleTaskById() {
            getVehicleTaskById({ id: this.taskId }).then(res => {
                if (res.success && res.result !== null) {
                    this.ruleForm.vehicleName = res.result.vehicle.vehicleTypeVO.name + '-' + res.result.vehicle.platNum
                    this.ruleForm.vehicleId = res.result.vehicle.id
                    this.ruleForm.driverName = res.result.driverVO.name
                    this.ruleForm.driverId = res.result.driverVO.id
                    this.startTime = res.result.startTime
                    this.endTime = res.result.endTime
                } else {
                    this.ruleForm.vehicleName = null
                    this.ruleForm.vehicleId = null
                    this.ruleForm.driverName = null
                    this.ruleForm.driverId = null
                    this.startTime = null
                    this.endTime = null
                }
            })
        },
        createStateFilter(queryString) {
            return (state) => {
                return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
            }
        },
        getAddressListByConferenceId() {
            getAddressListByConferenceId({ conferenceId: getConferenceId(), addressLike: null }).then(res => {
                if (res.success) {
                    var list = []
                    if (res.result.list !== null && res.result.list.length > 0) {
                        res.result.list.forEach(item => {
                            list.push({ value: item })
                        })
                        this.addressList = list
                        // clearTimeout(this.timeout)
                        // this.timeout = setTimeout(() => {

                        // }, 500)
                        // cb(list)
                    }
                }
            })
        },
        querySearchAsync(queryString, cb) {
            var results = queryString ? this.addressList.filter(this.createStateFilter(queryString)) : []
            cb(results)
        },
        handleSelect() { },

        closeDialog() {
            this.ruleForm = {
                startTime: null,
                endTime: null,
                attendees: null,
                vehicleName: null,
                vehicleId: null,
                driverName: null,
                driverId: null,
                description: null,
                contactPerson: null,
                phone: null,
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
                    this.ruleForm.parentId = this.taskId
                    // this.ruleForm.attendees = [{ id: this.attendeeId }]
                    addVehicleTask(this.ruleForm).then(res => {
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
</style>
