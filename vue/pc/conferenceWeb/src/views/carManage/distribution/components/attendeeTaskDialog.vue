<template>
    <div>
        <el-dialog ref="dialog" :title="title" :visible.sync="dialogVisible" width="90%" top="80px">

            <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">

                <el-table ref="table" :data="attendeeTaskList" style="width: 100%" tooltip-effect="light"
                    :height="tableHeight" :header-cell-style="{
                        background:'#f7f7f7'
                    }">
                    <!-- <el-table-column type="selection"   prop="id">
                    </el-table-column> -->
                    <!-- <el-table-column label="任务主题" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div>{{ scope.row.title }}</div>
                        </template>
                    </el-table-column> -->
                    <el-table-column label="车辆信息" width="160px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div>{{ scope.row.vehicle.vehicleTypeVO.name }}</div>
                            <div>
                                ({{ scope.row.vehicle.platNum }})&nbsp;&nbsp;
                                {{ scope.row.vehicle.vehicleTypeVO.seatNum }}座
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="司机信息" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div>{{ scope.row.driverVO.name }}</div>
                            <div>({{ scope.row.driverVO.phone }})</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="出发时间" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div v-if="scope.row.startTime">{{ scope.row.startTime.slice(0,16) }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="出发地点" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div>{{ scope.row.startAddress }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="到达时间" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div v-if="scope.row.endTime">{{ scope.row.endTime.slice(0,16) }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="到达地点" width="140px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div>{{ scope.row.endAddress }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="任务状态" width="140px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div v-if="!scope.row.publish && scope.row.status !== -1 ">
                                未发布
                            </div>
                            <div v-else>
                                {{ scope.row.statusStr }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="250px">
                        <template slot-scope="scope">

                            <el-button v-permission="buttons.PickUp.cancel" size="mini"
                                @click="cancleWithConfirm(scope.$index, scope.row)">取消用车</el-button>
                            <el-button v-permission="buttons.PickUp.add" size="mini"
                                @click="add(scope.$index, scope.row)">添加同乘人员</el-button>
                        </template>
                    </el-table-column>
                </el-table>

            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>

            </span>
        </el-dialog>
        <PickAttendee :pick-dialog-visible="pickDialogVisible" :attendee-role-flag-equal="[0,1,3,4]"
            @closeDialog="closePickAttendeeDialog" />
    </div>
</template>
<script>
import carTask from './carTask'
import { getAllResourceList, deleteVehicleTaskAttendee, addVehicleTaskAttendee } from '@/api/car'
import { getConferenceId } from '@/utils/conference-auth'
import { getTableHeight, formatPhone } from '@/utils/index'
import PickAttendee from '@/views/attendee/components/pickAttendee'

export default {
    name: 'TaskDialog',
    components: { carTask, PickAttendee },
    data () {
        return {
            buttons: this.Global.buttons,
            dialogVisible: false,
            attendeeTaskList: [],
            tableHeight: getTableHeight(220),
            attendeeId: '',
            type: '',
            pickDialogVisible: false,
            taskId: '',
            title: ''
        }
    },
    watch: {
        // '$route' () {  // 对route进行监控  添加返回时会调用刷新数据
        //     this.getListInfo()

        // }

    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created () { },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted () {
        // this.$refs.dialog[0].$el.firstChild.style.height = '90%';
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
        cancleWithConfirm (index, row) {
            this.$confirm('请确认是否取消用车任务?', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.cancle(index, row)
            }).catch(() => { })
        },
        add (index, row) {
            this.taskId = row.id
            this.pickDialogVisible = true
        },
        closePickAttendeeDialog (val) {
            if (val !== null) {
                var attendees = []
                val.forEach(item => {
                    attendees.push({ 'id': item })
                })
                var params = {
                    'taskId': this.taskId,
                    'attendees': attendees,
                    'conferenceId': getConferenceId(),
                    "contact": true
                }
                console.log(params)
                addVehicleTaskAttendee(params).then(res => {
                    if (res.success) {
                        this.pickDialogVisible = false
                        this.$message('操作成功')
                        this.$emit('getListInfo')
                    }
                })
            } else {
                this.pickDialogVisible = false
            }
        },
        cancle (index, row) {
            var taskId = row.id
            var attendees = [{ 'id': this.attendeeId }]
            var param = { 'taskId': taskId, 'attendees': attendees }
            deleteVehicleTaskAttendee(param).then(res => {
                if (res.success) {
                    this.$message('操作成功')
                    this.refresh()
                    this.$emit('getListInfo')
                }
            })
        },
        formatPhone (val) {
            return formatPhone(val)
        },
        refresh () {
            getAllResourceList({ 'attendeeId': this.attendeeId, 'type': this.type }).then(res => {
                if (res.success) {
                    this.attendeeTaskList = res.result.vehicleTaskList
                }
            })
        },

        showDialog (row, type) {
            if (type == 1) {
                this.title = '接站用车记录'
            }
            if (type == 2) {
                this.title = '送站用车记录'
            }
            if (type == 3) {
                this.title = this.getConferenceTemplate(1) + '用车记录'
            }
            this.attendeeId = row.attendee.id
            this.type = type

            getAllResourceList({ 'attendeeId': row.attendee.id, 'type': type }).then(res => {
                if (res.success) {
                    this.attendeeTaskList = res.result.vehicleTaskList
                }
            })
            this.dialogVisible = true
        }
        // onSubmit () {

        //     var taskId = this.$refs["carTask"].$refs.table.selection[0].id;
        //     var attendees = [];
        //     this.attendeeIds.forEach(item => {
        //         attendees.push({ "id": item })
        //     })
        //     var params = {
        //         "taskId": taskId,
        //         "attendees": attendees
        //     }
        //     console.log(params)
        //     addVehicleTaskAttendee(params).then(res => {
        //         if (res.success) {
        //             this.$message("操作成功！")
        //             this.$refs["carTask"].getListInfo(this.$refs["carTask"].paramData)
        //             this.$emit("closeDialog")
        //         }
        //     })
        // }

    }
}
</script>
<style lang='scss'  >
</style>
