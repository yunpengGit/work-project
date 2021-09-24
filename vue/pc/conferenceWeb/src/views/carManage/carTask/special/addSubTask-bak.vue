<template>
    <div class="">
        <el-drawer
            :title="'添加用车'"
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
                    <el-form-item label="出发时间" prop="startTime">
                        <el-date-picker
                            v-model="ruleForm.startTime"
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            placeholder="选择日期时间"
                            class="width360"
                            :editable="false"
                            :picker-options="startPickerOptions"
                            @change="startTimes"
                        />
                    </el-form-item>
                    <el-form-item label="到达时间" prop="endTime">
                        <el-date-picker
                            v-model="ruleForm.endTime"
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
                    <el-form-item label="车辆信息">
                        <el-input v-model="ruleForm.vehicleName" class="width360" disabled />
                    </el-form-item>
                    <el-form-item label="司机信息">
                        <el-input v-model="ruleForm.driverName" class="width360" disabled />
                    </el-form-item>
                    <el-form-item label="备注" prop="description">
                        <el-input v-model="ruleForm.description" show-word-limit maxlength="300" placeholder="" class="width360" type="textarea" :rows="4" />
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
import { getTableHeight, GMTToStrHHmmss, GMTToStrYYYYMMDD } from '@/utils/index'
import { addVehicleTask } from '@/api/car'
import { getVehicleTaskById, getAddressListByConferenceId } from '@/api/special'
export default {
    name: 'AddSubTaskBak',
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
            startTime: null,
            endTime: null,
            startPickerOptions: {
                selectableRange: '00:00:00 - 23:59:59',
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
                phone: null
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
                this.getVehicleTaskById()
                this.startTimes()
            }
        }
    },
    created() {
    },
    methods: {
        startTimes() {
            var kaishishijian = '00:00:00'
            var jieshushijian = '23:59:59'
            console.log(this.ruleForm)
            if (this.ruleForm.startTime !== null &&
            this.ruleForm.startTime !== '') {
                if (GMTToStrYYYYMMDD(this.ruleForm.startTime) === GMTToStrYYYYMMDD(this.startTime)) {
                    if (this.startTime !== null && this.startTime !== '') {
                        kaishishijian = GMTToStrHHmmss(this.startTime)
                    }
                }
                if (GMTToStrYYYYMMDD(this.ruleForm.startTime) === GMTToStrYYYYMMDD(this.endTime)) {
                    if (this.endTime !== null && this.endTime !== '') {
                        jieshushijian = GMTToStrHHmmss(this.endTime)
                    }
                }

                if (this.ruleForm.endTime !== null &&
                    this.ruleForm.endTime !== '') {
                    if (GMTToStrYYYYMMDD(this.ruleForm.startTime) === GMTToStrYYYYMMDD(this.ruleForm.endTime)) {
                        jieshushijian = GMTToStrHHmmss(this.ruleForm.endTime)
                    }
                }
            }

            this.startPickerOptions.selectableRange = kaishishijian + ' - ' + jieshushijian
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
        handleSelect() {},

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
                phone: null
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
                    this.ruleForm.attendees = [{ id: this.attendeeId }]
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
    .width360{
        width:330px;
    }
    .tianjiahuiyizuzhiClass {
        width: 74px;
        height: 32px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #1e89ff;
    }
</style>
