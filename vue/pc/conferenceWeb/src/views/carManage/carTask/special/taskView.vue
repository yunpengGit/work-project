<template>
    <div class="">
        <el-drawer
            :title="'查看用车'"
            :visible.sync="dialogVisible"
            :before-close="closeDialog"
            size="50%"
        >
            <el-form
                ref="ruleForm"
                :model="ruleForm"
                label-width="135px"
                class="demo-ruleForm"
                :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto'}"
            >
                <!-- 'border-top': 'solid #ccc 1px' -->
                <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                    <h5 style="margin-left:50px">专车信息</h5>
                    <el-form-item label="车辆信息：">
                        {{ ruleForm.vehicleName }}
                    </el-form-item>
                    <el-form-item label="司机信息：">
                        {{ ruleForm.driverName }}
                    </el-form-item>
                    <el-form-item label="用车时间：">
                        {{ geshihuashijian(ruleForm.startTime) }}~
                        {{ geshihuashijian(ruleForm.endTime) }}
                    </el-form-item>
                    <h5 style="margin-left:50px">乘车人信息</h5>
                    <el-form-item
                        v-for="(item, index) in attendeeList"
                        v-show="index === 0"
                        :key="item.id"
                        :label="index === 0 ? '乘车人：' : '同乘人员：'"
                    >
                        {{ item.fixAttributeCommonVO.attendeeName }}
                        ({{ item.fixAttributeCommonVO.phone }})
                    </el-form-item>
                    <el-form-item
                        label="联系人："
                    >
                        {{ attendeeList !== null && attendeeList.length > 0 ? attendeeList[0].contactPerson : '' }}
                        {{ attendeeList !== null && attendeeList.length > 0 ?
                            attendeeList[0].contactPhone !== null && attendeeList[0].contactPhone !== '' ? ('(' + attendeeList[0].contactPhone + ')') : ''
                            : '' }}
                    </el-form-item>
                    <div v-for="(item, index) in attendeeList" :key="'tcry' + index">
                        <el-form-item
                            v-if="index !== 0"
                            :label="index === 1 ? '同乘人员：' : ''"
                            style="width: 350px"
                        >
                            {{ item.fixAttributeCommonVO.attendeeName + ' (' + item.fixAttributeCommonVO.phone + ')' }}  <el-link :underline="false" style="float: right" type="danger" @click="deleteAttendee(item.id)">移除</el-link>
                            <!-- <el-button type="text" style="float: right" @click="deleteAttendee(item.id)">移除</el-button>  -->
                            <!-- {{ formattongchengrenyuan(attendeeList) }} -->

                            <!-- {{ item.fixAttributeCommonVO.attendeeName }}
                            ({{ item.fixAttributeCommonVO.phone }}) -->
                        </el-form-item>
                    </div>
                    <!-- <h5 style="margin-left:50px">专车信息</h5> -->

                    <!-- <el-form-item label="联系人">
                        {{ ruleForm.contactPerson }}
                    </el-form-item> -->
                    <!-- <h5 style="margin-left:50px">用车记录</h5> -->
                    <h5 style="margin-left:50px">用车记录</h5>
                    <el-table
                        :data="tableData"
                        :height="tableHeight"
                        style="margin-left:7%;width:86%;border-radius:10px"
                        border
                    >
                        <el-table-column
                            label="出发时间"
                            width="120"
                        >
                            <template slot-scope="scope">
                                {{ geshihuashijian(scope.row.startTime) }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="上车时间"
                            width="120"
                        >
                            <template slot-scope="scope">
                                {{ geshihuashijian(scope.row.getOnVehicleTime) }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="上车地点"
                        >
                            <template slot-scope="scope">
                                {{ scope.row.startAddress }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="送达时间"
                            width="120"
                        >
                            <template slot-scope="scope">
                                {{ geshihuashijian(scope.row.endTime) }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="送达地点"
                        >
                            <template slot-scope="scope">
                                {{ scope.row.endAddress }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="statusStr"
                            label="用车状态"
                            width="70"
                        >
                            <template slot-scope="scope">
                                <div v-if="!scope.row.publish && scope.row.status !== -1 ">
                                    未发布
                                </div>
                                <div v-else>
                                    {{ scope.row.statusStr }}
                                </div>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column
                            label="操作"
                            width="180"
                        >
                            <template slot-scope="scope">
                                <el-button
                                    v-permission="buttons.SpecialVehicleTask.cancel"
                                    :disabled="scope.row.status !== 0"
                                    type="text"
                                    @click.native.prevent="cancelVehicleTask(scope.row)"
                                >
                                    取消任务
                                </el-button>
                                <el-button
                                    :disabled="scope.row.status !== 0"
                                    type="text"
                                    @click.native.prevent="addAttendee(scope.row)"
                                >
                                    添加同乘人员
                                </el-button>
                            </template>
                        </el-table-column> -->
                    </el-table>
                </el-scrollbar>
            </el-form>
            <div class="demo-drawer__footer" style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD">
                <el-button
                    type="primary"
                    :loading="loading"
                    style="height:32px;margin-top:12px"
                    @click="quxiaozhuanche"
                >取消专车</el-button>
                <el-button style="height:32px;margin-top:12px" @click="closeDialog">取 消</el-button>
            </div>
        </el-drawer>
        <AddAttendeeToSpecial :dialog-visible="addAttendeeToSpecialDialogVisible" :task-id="subTaskId" @closeDialog="closeAddAttendeeToSpecial" />
    </div>
</template>

<script>
import { getConferenceId } from '@/utils/conference-auth'
import { getTableHeight } from '@/utils/index'
import { cancelVehicleTask } from '@/api/car'
import { cancel, getTaskList, getSpecialTaskView, getSpecialTaskAttendeeList, deleteAttendee } from '@/api/special'
import AddAttendeeToSpecial from './addAttendee'
export default {
    name: 'SpecialTaskView',
    components: {
        AddAttendeeToSpecial
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        taskId: {
            type: null,
            default: false
        }
    },
    data() {
        return {
            attendeeList: [],
            subTaskId: null,
            addAttendeeToSpecialDialogVisible: false,
            buttons: this.Global.buttons,
            tableData: [],
            dialogHeight: getTableHeight(35) + 'px',
            tableHeight: getTableHeight(260),
            loading: false,
            ruleForm: {
                vehicleName: null,
                driverName: null,
                contactPerson: null,
                platNum: null,
                startTime: null,
                endTime: null
            }
        }
    },
    watch: {
        dialogVisible(val) {
            if (val) {
                this.getVehicleTaskAttendeeList()
                this.getVehicleTaskById()
            }
        }
    },
    created() {

    },
    methods: {
        deleteAttendee(val) {
            this.$confirm('请确认是否移除同乘人员？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteAttendee({ 'taskId': this.taskId, 'attendees': [{ 'id': val }] }).then(res => {
                    if (res.success) {
                        this.getVehicleTaskAttendeeList()
                        this.$message(res.message)
                    }
                })
            }).catch(() => { })
        },
        quxiaozhuanche() {
            this.$confirm('请确认是否取消用车任务？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                cancel([this.taskId]).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        this.closeDialog()
                    }
                })
            }).catch(() => { })
        },
        formattongchengrenyuan(val) {
            var resultStr = ''
            val.forEach((item, index) => {
                if (index > 0) {
                    resultStr += item.fixAttributeCommonVO.attendeeName + ' (' + item.fixAttributeCommonVO.phone + ')，'
                }
            })
            return resultStr.substr(0, resultStr.length - 1)
        },
        getVehicleTaskAttendeeList() {
            getSpecialTaskAttendeeList({ taskId: this.taskId, conferenceId: getConferenceId() }).then(res => {
                this.attendeeList = res.result.list
            })
        },
        addAttendee(val) {
            this.addAttendeeToSpecialDialogVisible = true
            this.subTaskId = val.id
        },
        closeAddAttendeeToSpecial() {
            this.addAttendeeToSpecialDialogVisible = false
            this.subTaskId = null
        },
        getChildrenVehicleTaskById() {
            getTaskList({ conferenceId: getConferenceId(),
                platNumLike: this.ruleForm.platNum,

                startTime: this.ruleForm.startTime,
                endTime: this.ruleForm.endTime }).then(res => {
                this.tableData = res.result.list
            })
        },
        cancelVehicleTask(val) {
            this.$confirm('请确认是否取消用车任务？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                cancelVehicleTask([val.id]).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        this.getChildrenVehicleTaskById()
                    }
                })
            }).catch(() => {})
        },
        getVehicleTaskById() {
            getSpecialTaskView({ id: this.taskId }).then(res => {
                if (res.success && res.result !== null) {
                    this.ruleForm.vehicleName = res.result.vehicle.vehicleTypeVO.name + '(' + res.result.vehicle.platNum + ') - ' + res.result.vehicle.vehicleTypeVO.seatNum + '座'
                    this.ruleForm.driverName = res.result.driverVO.name + '(' + res.result.driverVO.phone + ')'
                    this.ruleForm.contactPerson = res.result.contactPerson + '(' + res.result.phone + ')'

                    this.ruleForm.platNum = res.result.vehicle.platNum

                    this.ruleForm.startTime = res.result.startTime
                    this.ruleForm.endTime = res.result.endTime
                } else {
                    this.ruleForm.vehicleName = null
                    this.ruleForm.driverName = null
                }
                this.getChildrenVehicleTaskById()
            })
        },
        closeDialog() {
            this.$emit('closeDialog', null)
            // getConferenceId()
        },
        geshihuashijian(val) {
            if (val === null || val === '') {
                return ''
            }
            if (val.length > 16) {
                return val.substr(0, 16)
            }
            return val
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
