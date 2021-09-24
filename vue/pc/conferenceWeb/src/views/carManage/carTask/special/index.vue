<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:8px">
        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form :inline="true" :model="pageInfo">
                    <el-form-item :label="getConferenceTemplate(2) + '姓名'">
                        <el-input v-model.trim="pageInfo.attendeeNameLike" class="widthClass" placeholder="" />
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input v-model.trim="pageInfo.phoneLike" class="widthClass" placeholder="" />
                    </el-form-item>
                    <el-form-item label="单位名称">
                        <el-input
                            v-model.trim="pageInfo.allOrganizationNameLike"
                            class="widthClass"
                            maxlength="25"
                            placeholder=""
                        />
                    </el-form-item>
                    <el-form-item style="float: right">
                        <el-button type="primary" @click="search">查询</el-button>
                        <el-button @click="resetSearch">重置</el-button>
                        <el-button
                            :class="dakaichaxunClass === 1 ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
                            type="text"
                            style="margin-left:10px;margin-right:5px"
                            @click="dakaichaxun"
                        />
                    </el-form-item>
                </el-form>
                <el-form :inline="true" :model="pageInfo">
                    <el-form-item v-if="dakaichaxunClass === 0" label="到达时间" clearable>
                        <el-date-picker
                            v-model="arriveTimes"
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围"
                            size="small"
                            style="width:290px"
                        />
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="到达班次/车次">
                        <el-input
                            v-model.trim="pageInfo.arriveFlightLike"
                            class="widthClass"
                            maxlength="25"
                            placeholder=""
                        />
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="到达地点">
                        <el-input
                            v-model.trim="pageInfo.arriveStationLike"
                            class="widthClass"
                            maxlength="25"
                            placeholder=""
                        />
                    </el-form-item>
                </el-form>
                <el-form :inline="true" :model="pageInfo">
                    <el-form-item v-if="dakaichaxunClass === 0" label="返程时间" clearable>
                        <el-date-picker
                            v-model="returnTimes"
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围"
                            size="small"
                            style="width:290px"
                        />
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="返程班次/车次">
                        <el-input
                            v-model.trim="pageInfo.returnFlightLike"
                            class="widthClass"
                            maxlength="25"
                            placeholder=""
                        />
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="返程地点">
                        <el-input
                            v-model.trim="pageInfo.returnStationLike"
                            class="widthClass"
                            maxlength="25"
                            placeholder=""
                        />
                    </el-form-item>

                </el-form>
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
            <div style="float: left; text-center: left;margin-left:10px;padding-bottom:10px;">
                <el-button v-permission="buttons.SpecialVehicleTask.publish" type="primary" @click="piliangfabu">批量发布</el-button>
                <!-- v-permission="buttons.SpecialVehicleTask.publish"
                v-permission="buttons.SpecialVehicleTask.unPublish" -->
                <el-button v-permission="buttons.SpecialVehicleTask.unPublish" type="primary" @click="piliangquxiaofabu">取消发布</el-button>
            </div>
            <div style="float: right; text-center: right;padding-bottom:10px;">
                <el-button v-permission="buttons.SpecialVehicleTask.insert" type="primary" @click="add">添加专车
                </el-button>
            </div>
            <el-table
                ref="table"
                :data="tableData"
                :height="dakaichaxunClass === 0 ? (tableHeight + (this.$store.state.menu.buttons.indexOf(Global.buttons.SpecialVehicleTask.cancel) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.SpecialVehicleTask.insert) !== -1 ? 0: 32) - 104) : (tableHeight + (this.$store.state.menu.buttons.indexOf(Global.buttons.SpecialVehicleTask.cancel) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.SpecialVehicleTask.insert) !== -1 ? 0: 32))"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="45" />
                <el-table-column prop="fixAttributeCommonVO.attendeeName" label="姓名" />
                <el-table-column prop="fixAttributeCommonVO.position" label="职务">
                    <template slot-scope="scope">
                        {{ formatTableCellData(scope.row.fixAttributeCommonVO.position) }}
                    </template>
                </el-table-column>
                <!-- width="120" -->
                <el-table-column prop="noticeContent" label="手机号" :min-width="120">
                    <template slot-scope="scope">
                        <PhoneEncryption :value="scope.row.fixAttributeCommonVO.phone" />
                        <!-- <div>
                            <span>{{ formatTableCellData(formatPhone(scope.row.fixAttributeCommonVO.phone)) }}</span>
                            <span style="display:none">{{ scope.row.fixAttributeCommonVO.phone }}</span>
                            <el-button
                                v-show="scope.row.fixAttributeCommonVO.phone !== null && scope.row.fixAttributeCommonVO.phone !== ''"
                                icon="el-icon-view"
                                type="text"
                                @click="(event) => qiehuanshoujijiami(event)"
                            />
                        </div> -->
                    </template>
                </el-table-column>
                <el-table-column prop="organizationSortName" label="单位简称/全称" :min-width="100">
                    <template slot-scope="scope">
                        <div>
                            {{ formatOrgName(scope.row.fixAttributeCommonVO.organizationSortName,scope.row.fixAttributeCommonVO.organizationName) }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="organizationSortName" label="车辆信息" :min-width="180">
                    <template slot-scope="scope">
                        <div>{{
                            geshihuacheliangxinxi(scope.row.vehicleTaskList).chexing
                        }}
                        </div>
                        <div>{{
                            geshihuacheliangxinxi(scope.row.vehicleTaskList).chepai + ' - ' +
                                geshihuacheliangxinxi(scope.row.vehicleTaskList).zuowei + '座'
                        }}
                        </div>
                        <!-- <div>{{ formatOrgName(scope.row.attendee.fixAttributeCommonVO.organizationSortName,scope.row.attendee.fixAttributeCommonVO.organizationName) }}</div> -->
                    </template>
                </el-table-column>
                <el-table-column label="用车时间" :min-width="200">
                    <template slot-scope="scope">
                        <div>
                            {{ scope.row.vehicleTaskList !== null && scope.row.vehicleTaskList.length > 0 ? geshihuashijian(scope.row.vehicleTaskList[0].startTime) : '' }}
                        </div>
                        <div>
                            {{ scope.row.vehicleTaskList !== null && scope.row.vehicleTaskList.length > 0 ? geshihuashijian(scope.row.vehicleTaskList[0].endTime) : '' }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <div>
                            {{ scope.row.vehicleTaskList !== null && scope.row.vehicleTaskList.length > 0 ? (scope.row.vehicleTaskList[0].publish ? '已发布' : '未发布') : '' }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150px"  fixed="right">
                    <template slot-scope="scope">
                        <!-- v-permission="buttons.NoticeInside.edit" -->
                        <el-button
                            v-permission="buttons.SpecialVehicleTask.view"
                            @click.native.prevent="chakanyongche(scope.row)"
                        >
                            查看用车
                        </el-button>
                        <!-- <el-button
                            v-permission="buttons.SpecialVehicleTask.cancel"
                            @click.native.prevent="del(scope.row)"
                        >
                            取消任务
                        </el-button> -->
                        <!-- v-permission="buttons.SpecialVehicleTask.addAttendee" -->
                        <!-- <el-button @click.native.prevent="addAttendee(scope.row)">
                            添加同乘人员
                        </el-button> -->
                        <!-- 专车中添加同乘人员的按钮先隐藏 20210518  yurongchao-->
                    </template>
                </el-table-column>
            </el-table>
            <div class="page-wrapper">
                <el-pagination
                    :current-page="pageInfo.pageNum"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageInfo.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageInfo.total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </div>
        <AddParentTask :dialog-visible="addParentTaskDialogVisible" @closeDialog="closeAddParentTask" />
        <SpecialTaskView :task-id="taskId" :dialog-visible="ckakanDialogVisible" @closeDialog="closeChakanTask" />
        <AddSubTask
            :attendee-id="attendeeId"
            :task-id="taskId"
            :dialog-visible="addSubTaskDialogVisible"
            @closeDialog="closeAddSubTask"
        />
        <AddAttendeeToSpecial
            :dialog-visible="addAttendeeToSpecialDialogVisible"
            :task-id="subTaskId"
            @closeDialog="closeAddAttendeeToSpecial"
        />
        <AddSpecialTaskDialog ref="addSpecialTaskDialog" />
    </div>
</template>

<script>
// import { getTableHeight, formatPhone, getSourceTypes, getMeetingStatuss } from '@/utils/index'
import { getTableHeight, formatPhone } from '@/utils/index'
import { getList, publish, unPublish } from '@/api/special'
import { cancelVehicleTask } from '@/api/car'
import { getConferenceId } from '@/utils/conference-auth'
import AddParentTask from './addParentTask'
import SpecialTaskView from './taskView'
import AddSubTask from './addSubTask'
import AddAttendeeToSpecial from './addAttendee'
import AddSpecialTaskDialog from './attendeeDialog'
export default {
    name: 'SpecialCarList',
    components: {
        AddParentTask,
        SpecialTaskView,
        AddSubTask,
        AddAttendeeToSpecial,
        AddSpecialTaskDialog
    },
    props: {
    },
    data() {
        return {
            dakaichaxunClass: 1,
            subTaskId: null,
            addAttendeeToSpecialDialogVisible: false,
            attendeeId: null,
            addSubTaskDialogVisible: false,
            ckakanDialogVisible: false,
            taskId: null,
            addParentTaskDialogVisible: false,
            buttons: this.Global.buttons,
            multipleSelection: [],
            conferenceId: getConferenceId(),
            tableData: [],
            tableHeight: getTableHeight(160),
            startTimes: [],
            endTimes: [],
            pageInfo: {
                pageNum: 1,
                pageSize: 10,
                total: 0
            }
        }
    },
    created() {
        this.search()
    },
    methods: {
        piliangquxiaofabu() {
            if (this.multipleSelection.length === 0) {
                this.$message('至少选择一条记录')
                return
            }
            const param = []
            this.multipleSelection.forEach(item => {
                param.push(item.vehicleTaskList[0].id)
            })
            unPublish(param).then(res => {
                if (res.success) {
                    this.$message(res.message)
                    this.search()
                }
            })
        },
        piliangfabu() {
            if (this.multipleSelection.length === 0) {
                this.$message('至少选择一条记录')
                return
            }
            const param = []
            this.multipleSelection.forEach(item => {
                param.push(item.vehicleTaskList[0].id)
            })
            publish(param).then(res => {
                if (res.success) {
                    this.$message(res.message)
                    this.search()
                }
            })
        },
        dakaichaxun() {
            this.dakaichaxunClass = this.dakaichaxunClass === 1 ? 0 : 1
        },
        addAttendee(val) {
            this.$refs.addSpecialTaskDialog.showDialog(val.vehicleTaskList[0].id)
            // this.addAttendeeToSpecialDialogVisible = true
            // this.subTaskId = val.vehicleTaskList[0].id
        },
        closeAddAttendeeToSpecial() {
            this.search()
            this.addAttendeeToSpecialDialogVisible = false
            this.subTaskId = null
        },
        closeAddSubTask() {
            this.attendeeId = null
            this.taskId = null
            this.addSubTaskDialogVisible = false
            this.search()
        },
        closeChakanTask() {
            this.taskId = null
            this.ckakanDialogVisible = false
            this.search()
        },
        closeAddParentTask() {
            this.addParentTaskDialogVisible = false
            this.search()
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
        resetSearch() {
            this.startTimes = []
            this.endTimes = []
            this.pageInfo = {
                pageNum: 1,
                pageSize: 10,
                total: this.pageInfo.total
            }
        },
        add(val) {
            this.addParentTaskDialogVisible = true
        },
        del(row) {
            this.deleteSubmit([row.vehicleTaskList[0].id])
        },
        deleteBatch() {
            if (this.multipleSelection.length === 0) {
                this.$message('至少选择一条记录')
                return
            }
            const param = []
            this.multipleSelection.forEach(item => {
                param.push(item.vehicleTaskList[0].id)
            })
            this.deleteSubmit(param)
        },
        deleteSubmit(param) {
            this.$confirm('请确认是否取消用车任务？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                cancelVehicleTask(param).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        this.search()
                    }
                })
            }).catch(() => { })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        getList() {
            this.pageInfo.conferenceId = this.conferenceId
            if (this.startTimes !== null && this.startTimes.length > 0) {
                this.pageInfo.onlineTimeStart = this.startTimes[0]
                this.pageInfo.onlineTimeEnd = this.startTimes[1]
            } else {
                this.pageInfo.onlineTimeStart = null
                this.pageInfo.onlineTimeEnd = null
            }
            if (this.endTimes !== null && this.endTimes.length > 0) {
                this.pageInfo.offlineTimeStart = this.endTimes[0]
                this.pageInfo.offlineTimeEnd = this.endTimes[1]
            } else {
                this.pageInfo.offlineTimeStart = null
                this.pageInfo.offlineTimeEnd = null
            }
            this.pageInfo.type = '4'
            getList(this.pageInfo).then(res => {
                this.tableData = res.result.list
                this.pageInfo.total = res.result.total
            })
        },
        search() {
            this.pageInfo.pageNum = 1
            this.getList()
        },
        handleCurrentChange(val) {
            this.pageInfo.pageNum = val
            this.getList()
        },
        handleSizeChange(val) {
            this.pageInfo.pageSize = val
            this.getList()
        },
        geshihuacheliangxinxi(val) {
            if (val !== null && val.length > 0) {
                return {
                    chexing: val[0].vehicle.vehicleTypeVO.name,
                    chepai: val[0].vehicle.platNum,
                    zuowei: val[0].vehicle.vehicleTypeVO.seatNum
                }
            } else {
                return null
            }
        },
        geshihuashijian(val) {
            if (val === null || val === '') {
                return ''
            }
            if (val.length > 16) {
                return val.substr(0, 16)
            }
            return val
        },
        chakanyongche(val) {
            this.taskId = val.vehicleTaskList[0].id
            this.ckakanDialogVisible = true
        },
        tianjiayongcherenwu(val) {
            this.attendeeId = val.id
            this.taskId = val.vehicleTaskList[0].id
            this.addSubTaskDialogVisible = true
        }
    }
}
</script>
<style lang="scss" scoped>
.widthClass {
    width: 150px;
}
::v-deep .el-dialog__body{
    margin: 30px 0;
}
</style>
