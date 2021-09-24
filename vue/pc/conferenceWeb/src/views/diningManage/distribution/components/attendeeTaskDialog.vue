<template>
    <div v-if="dialogVisible">
        <el-dialog ref="dialog" :title="title" :visible.sync="dialogVisible" width="90%" top="80px">

            <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">

                <el-table ref="table" :data="diningTaskList" style="width: 100%" :height="tableHeight"
                    tooltip-effect="light" :row-class-name="tableRowClassName" :header-cell-style="{
                    background:'#f7f7f7'
                }">
                    <!-- <el-table-column type="selection" prop="id" /> -->
                    <el-table-column label="餐厅名称" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{ scope.row.dining.dinnerRoom }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="typeCode" label="用餐类型" />
                    <el-table-column label="用餐日期" width='160px'>
                        <template slot-scope="scope">
                            {{ scope.row.dinnerStartDate }}&nbsp;-&nbsp;{{ scope.row.dinnerEndDate }}
                        </template>
                    </el-table-column>

                    <el-table-column label="用餐时间">
                        <template slot-scope="scope">
                            {{ scope.row.startTime.slice(0,5) }}&nbsp;-&nbsp;{{ scope.row.endTime.slice(0,5) }}
                        </template>
                    </el-table-column>

                    <el-table-column label="任务状态">
                        <template slot-scope="scope">
                            {{ changeStatus(scope.row) }}
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" width="320px">
                        <template slot-scope="scope">
                            <el-button v-permission="buttons.DiningDistribution.changeDining" size="mini"
                                @click="editOne(scope.row)">调整用餐
                            </el-button>
                            <el-button v-permission="buttons.DiningDistribution.cancelDining" size="mini"
                                @click="handleRemoveWithConfirm(scope.$index, scope.row)">取消用餐
                            </el-button>

                        </template>
                    </el-table-column>
                </el-table>

            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>

            </span>
        </el-dialog>
        <addOneAttendee ref="addOneAttendee" :dialog-visible="addOneAttendeeDialog" @closeDialog="closeDialog" />
    </div>
</template>
<script>
import { getTaskListById, deleteDiningTaskAttendee, getDiningById } from '@/api/dining'
import { getConferenceId } from '@/utils/conference-auth'
import { getTableHeight, formatPhone } from '@/utils/index'
import PickAttendee from '@/views/attendee/components/pickAttendee'
import addOneAttendee from './addOneAttendee'
export default {
    name: 'TaskDialog',
    components: { PickAttendee, addOneAttendee },
    data () {
        return {
            buttons: this.Global.buttons,
            addOneAttendeeDialog: false,
            dialogVisible: false,
            diningTaskList: [],
            tableHeight: getTableHeight(220),
            attendeeId: '',
            type: '',
            pickDialogVisible: false,
            taskId: '',
            title: '',
            row: ''
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
        tableRowClassName ({ row, rowIndex }) {
            const index = rowIndex + 1
            if (index % 2 == 0) {
                return 'warning-row'
            }
        },
        closeDialog () {
            this.addOneAttendeeDialog = false
            this.refresh()
        },
        editOne (row) {
            getDiningById({ 'id': row.dining.id }).then(res => {
                if (res.success) {
                    if (res.result.tableNoList.length === 0) {
                        this.$message("该餐厅不存在桌号，无需调整桌号")
                    } else {
                        this.addOneAttendeeDialog = true
                        var tableNoList = res.result.tableNoList.map(n => { return { val: n } })
                        var date = row.dinnerStartDate + ' - ' + row.dinnerEndDate
                        var time = row.startTime.slice(0, 5) + ' - ' + row.endTime.slice(0, 5)
                        this.$refs['addOneAttendee'].initData(this.row.attendee, tableNoList, date, time, row.id, row.tableNo);
                    }
                }
            })



        },
        deleteDiningTaskAttendee (param) {
            deleteDiningTaskAttendee(param).then(res => {
                if (res.success) {
                    this.$message('操作成功')
                    this.refresh()
                }
            })
        },
        handleRemoveWithConfirm (index, row) {
            this.$confirm('请确认是否取消？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.handleRemove(index, row)
            }).catch(() => { })
        },
        handleRemove (index, row) {
            const attendees = [{ 'attendeeId': this.attendeeId }]
            const param = { 'taskId': row.id, 'dinnerAttendees': attendees }
            this.deleteDiningTaskAttendee(param)
        },
        changeStatus (row) {
            if (row.status == -1) {
                return '已取消'
            }
            if (!row.publish) {
                return '未发布'
            }

            if (row.status == 0) {
                return '正常'
            }
        },

        // add (index, row) {
        //     this.taskId = row.id
        //     this.pickDialogVisible = true
        // },
        // closePickAttendeeDialog (val) {
        //     if (val !== null) {
        //         var attendees = []
        //         val.forEach(item => {
        //             attendees.push({ 'id': item })
        //         })
        //         var params = {
        //             'taskId': this.taskId,
        //             'attendees': attendees,
        //             'conferenceId': getConferenceId(),
        //             "contact": true
        //         }
        //         console.log(params)
        //         addVehicleTaskAttendee(params).then(res => {
        //             if (res.success) {
        //                 this.pickDialogVisible = false
        //                 this.$message('操作成功')
        //                 this.$emit('getListInfo')
        //             }
        //         })
        //     } else {
        //         this.pickDialogVisible = false
        //     }
        // },

        formatPhone (val) {
            return formatPhone(val)
        },
        refresh () {
            getTaskListById({ 'attendeeId': this.row.attendee.id, 'conferenceId': getConferenceId() }).then(res => {
                if (res.success) {
                    this.diningTaskList = res.result.list
                }
            })
        },

        showDialog (row) {
            this.diningTaskList = []
            this.title = '用餐信息'
            this.attendeeId = row.attendee.id
            this.row = row

            getTaskListById({ 'attendeeId': row.attendee.id, 'conferenceId': getConferenceId() }).then(res => {
                if (res.success) {
                    this.diningTaskList = res.result.list
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
