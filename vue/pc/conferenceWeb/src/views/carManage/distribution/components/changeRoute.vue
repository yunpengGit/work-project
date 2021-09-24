<template>
    <div>
        <div style="padding-left:8px;padding-right:8px;margin-top:0px">
            <div style="padding-left:10px;padding-top: 0px">
                <meetingSearch
                    ref="commonSearch"
                    :change-rout-flag="true"
                    @onSubmit="onSubmit"
                    @changeTableHeight="changeTableHeight"
                />
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
            <div style="float: left; padding-bottom:10px">
                <!-- <el-button type="primary" @click="addCarTask">添加接站用车</el-button> -->
                <!-- <el-button type="primary" @click="delSelectedWithConfirm">标记完成</el-button> -->
                <el-button v-permission="buttons.Meeting.batchDistribute" type="primary" @click="handleDialog">批量分配用车
                </el-button>
            </div>
            <div style="float: right;padding-bottom:10px">
                <!-- <el-dropdown @command="handleCommand">
                    <el-button>
                        列表筛选<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="jiezhan">接站</el-dropdown-item>
                        <el-dropdown-item command="songzhan"> 送站</el-dropdown-item>
                        <el-dropdown-item command="huiyi"> 会议用车</el-dropdown-item>
                        <el-dropdown-item command="quanbu"> 全部字段</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown> -->
                <el-button v-permission="buttons.Meeting.export" @click="exportExcel">导出查询结果</el-button>
                <!-- <el-button v-permission="buttons.Meeting.export">导出查询结果</el-button> 20210527biaoji -->
                <!-- <el-button>导入用车任务</el-button> -->
            </div>
            <el-table
                ref="table"
                :data="taskAttendeeList"
                :height="tableHeight+ (this.$store.state.menu.buttons.indexOf(Global.buttons.Meeting.export) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.Meeting.batchDistribute) !== -1
                    ? 0: 32)"
                style="width: 100%"
                tooltip-effect="light"
                :row-class-name="tableRowClassName"
                :header-cell-style="{
                    background:'#f7f7f7'
                }"
            >
                <el-table-column type="selection" prop="id" />
                <el-table-column prop="name" label="姓名" :min-width="130">
                    <template slot-scope="scope">
                        <AttendeeInfomation :accompany-flag="2" :accompany-totips="scope.row.attendee.accompanyTotips" :photo-url="scope.row.attendee.ssoUserPhoto" :attendee-name="scope.row.attendee.fixAttributeCommonVO.attendeeName" :attendee-role-flag="scope.row.attendee.fixAttributeCommonVO.attendeeRoleFlag" :honour-flag="scope.row.attendee.fixAttributeCommonVO.honourFlag" :sex="scope.row.attendee.fixAttributeCommonVO.sex" />
                    </template>
                </el-table-column>
                <el-table-column label="人员类别" :min-width="70" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-show="scope.row.attendee.attendeeRoleFlag === 0">{{ getConferenceTemplate(2) }}</span>
                        <span v-show="scope.row.attendee.attendeeRoleFlag === 1">会务组</span>
                        <span v-show="scope.row.attendee.attendeeRoleFlag === 2">司机</span>
                        <span v-show="scope.row.attendee.attendeeRoleFlag === 3">嘉宾</span>
                        <span v-show="scope.row.attendee.attendeeRoleFlag === 4">临时来宾</span>
                    </template>
                </el-table-column>
                <el-table-column label="职务" show-overflow-tooltip :min-width="70">
                    <template slot-scope="scope">
                        <span>
                            {{ formatTableCellData(scope.row.attendee.fixAttributeCommonVO.position) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="标签">
                    <template slot-scope="scope">
                        {{ scope.row.attendee.tagVOs !== null && scope.row.attendee.tagVOs.length > 0 ? '' : '-' }}
                        <el-tag
                            v-for="(tagVO, index) in scope.row.attendee.tagVOs"
                            :key="tagVO.id"
                            :style="{ backgroundColor: tagVO.backgroundColor, color: tagVO.fontColor }"
                            type="info"
                        >
                            <el-tooltip placement="bottom" effect="light">
                                <div slot="content">
                                    {{ tagVO.name }}
                                </div>
                                <div class="danhangxianshibuquan">
                                    {{ tagVO.name !== null && tagVO.name.length > 5 ? tagVO.name.substr(0,4) + '...' : tagVO.name }}
                                </div>
                            </el-tooltip>
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="手机" show-overflow-tooltip :min-width="100">
                    <template slot-scope="scope">
                        <PhoneEncryption :value="scope.row.attendee.fixAttributeCommonVO.phone" />
                        <!-- <div>
                            <span>{{ formatPhone(scope.row.attendee.fixAttributeCommonVO.phone) }}</span>
                            <span style="display:none">{{ scope.row.attendee.fixAttributeCommonVO.phone }}</span>
                            <el-button icon="el-icon-view" type="text" @click="(event) => qiehuanshoujijiami(event)" />
                        </div> -->
                    </template>
                </el-table-column>
                <el-table-column label="单位简称/全称" show-overflow-tooltip :min-width="100">
                    <template slot-scope="scope">
                        {{ formatTableCellData(formatOrgName(scope.row.attendee.fixAttributeCommonVO.organizationSortName,scope.row.attendee.fixAttributeCommonVO.organizationName)) }}
                    </template>
                </el-table-column>

                <el-table-column label="变更信息" width="200px">
                    <template slot-scope="scope">
                        <!-- <el-popover placement="bottom-start" trigger="hover" width="300">
                            <div
                                v-if="scope.row.attendeeTask !==null && scope.row.attendeeTask.changeContent !=null && JSON.parse(scope.row.attendeeTask.changeContent).length>0 ">
                                变更后： <br><span v-for="changeContent in JSON.parse(scope.row.attendeeTask.changeContent)"
                                    :key="changeContent.code"><span
                                        v-if="changeContent.code !== 'photoUrl'">&nbsp;&nbsp;&nbsp;&nbsp;{{ changeContent.attribute }}：
                                        {{ changeContent.afterValue }}&nbsp;&nbsp;&nbsp;&nbsp; <br></span></span> <br>
                                变更前：<br> <span v-for="changeContent in JSON.parse(scope.row.attendeeTask.changeContent)"
                                    :key="changeContent.code"><span
                                        v-if="changeContent.code !== 'photoUrl'">&nbsp;&nbsp;&nbsp;&nbsp;{{ changeContent.attribute }}：
                                        {{ changeContent.beforeValue }}&nbsp;&nbsp;&nbsp;&nbsp;<br></span></span><br>

                            </div>

                            <div v-if="scope.row.attendeeTask !==null && scope.row.attendeeTask.changeContent !=null && JSON.parse(scope.row.attendeeTask.changeContent).length>0 "
                                slot="reference" class="content">
                                变更后： <span v-for="changeContent in JSON.parse(scope.row.attendeeTask.changeContent)"
                                    :key="changeContent.code"><span
                                        v-if="changeContent.code !== 'photoUrl'">{{ changeContent.attribute }}：
                                        {{ changeContent.afterValue }}&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
                                变更前： <span v-for="changeContent in JSON.parse(scope.row.attendeeTask.changeContent)"
                                    :key="changeContent.code"><span
                                        v-if="changeContent.code !== 'photoUrl'">{{ changeContent.attribute }}：
                                        {{ changeContent.beforeValue }}&nbsp;&nbsp;&nbsp;&nbsp;</span></span>

                            </div>
                        </el-popover> -->

                        <el-tooltip placement="bottom" effect="light">
                            <div
                                v-if="scope.row.attendeeTask !==null && scope.row.attendeeTask.changeContent !=null && JSON.parse(scope.row.attendeeTask.changeContent).length>0 "
                                slot="content"
                            >
                                变更后： <br><span
                                    v-for="changeContent in JSON.parse(scope.row.attendeeTask.changeContent)"
                                    :key="changeContent.code"
                                ><span
                                    v-if="changeContent.code !== 'photoUrl'"
                                >&nbsp;&nbsp;&nbsp;&nbsp;{{ changeContent.attribute }}：
                                    {{ changeContent.afterValue }}&nbsp;&nbsp;&nbsp;&nbsp; <br></span></span> <br>
                                变更前：<br> <span
                                    v-for="changeContent in JSON.parse(scope.row.attendeeTask.changeContent)"
                                    :key="changeContent.code"
                                ><span
                                    v-if="changeContent.code !== 'photoUrl'"
                                >&nbsp;&nbsp;&nbsp;&nbsp;{{ changeContent.attribute }}：
                                    {{ changeContent.beforeValue }}&nbsp;&nbsp;&nbsp;&nbsp;<br></span></span><br>

                            </div>

                            <div
                                v-if="scope.row.attendeeTask !==null && scope.row.attendeeTask.changeContent !=null && JSON.parse(scope.row.attendeeTask.changeContent).length>0 "
                                class="content"
                            >
                                变更后： <span
                                    v-for="changeContent in JSON.parse(scope.row.attendeeTask.changeContent)"
                                    :key="changeContent.code"
                                ><span
                                    v-if="changeContent.code !== 'photoUrl'"
                                >{{ changeContent.attribute }}：
                                    {{ changeContent.afterValue }}&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
                                变更前： <span
                                    v-for="changeContent in JSON.parse(scope.row.attendeeTask.changeContent)"
                                    :key="changeContent.code"
                                ><span
                                    v-if="changeContent.code !== 'photoUrl'"
                                >{{ changeContent.attribute }}：
                                    {{ changeContent.beforeValue }}&nbsp;&nbsp;&nbsp;&nbsp;</span></span>

                            </div>
                        </el-tooltip>
                        <div
                            v-if="scope.row.attendeeTask ===null || scope.row.attendeeTask.changeContent ===null || JSON.parse(scope.row.attendeeTask.changeContent).length==0 "
                            class="content"
                        >
                            -
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="分配状态" show-overflow-tooltip :min-width="80">
                    <template slot-scope="scope">
                        <div>
                            <span v-if="scope.row.attendeeTask">
                                {{ scope.row.attendeeTask.resultStr }}
                            </span>
                            <span v-else>
                                未分配
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="270px" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.row.attendeeTask !==null && scope.row.attendeeTask.result !==100 && scope.row.attendeeTask.result !==110 "
                            v-permission="buttons.Meeting.ignore"
                            size="mini"
                            @click="handleIgnoreWithConfirm(scope.$index, scope.row)"
                        >忽略
                        </el-button>
                        <el-button size="mini" @click="handleAttendeeTaskDialog(scope.$index, scope.row)">查看用车
                        </el-button>
                        <el-button
                            v-permission="buttons.Meeting.distribute"
                            size="mini"
                            @click="handleDialog(scope.$index, scope.row)"
                        >分配用车</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <div style="float:right;padding:10px"> -->
            <div class="page-wrapper">
                <el-pagination
                    :current-page="paramData.pageNum"
                    background
                    :page-sizes="pageInfo.pageSizeList"
                    :page-size="paramData.pageSize"
                    layout="total, prev, pager, next, sizes ,jumper"
                    :total="pageInfo.total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </div>
        <taskDialog ref="taskDialog" @closeDialog="closeDialog" @getListInfo="getListInfo(paramData)" />
        <attendeeTaskDialog ref="attendeeTaskDialog" @closeDialog="closeDialog" @getListInfo="getListInfo(paramData)" />
        <!-- <addTask :dialog-visible="addTaskDialogVisible" @closeDialog="closeAddTask" flag="meeting"></addTask> -->
    </div>
</template>
<script>
import taskDialog from './taskDialog'
import attendeeTaskDialog from './attendeeTaskDialog'
import { getPickUpTaskAttendeeList, updateTaskState, getMeetingList, ignoreTask } from '@/api/car'
import { getTableHeight, formatPhone } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
import meetingSearch from './meetingSearch.vue'
import addTask from './addTask'
import { showLoading, closeLoading } from '@/utils/loading'
import { exportVehiclTaskAttendee } from '@/api/synergyFiles'
export default {
    name: 'NewRegist',
    components: { taskDialog, meetingSearch, attendeeTaskDialog, addTask },
    data() {
        return {
            buttons: this.Global.buttons,
            paramData: {
                conferenceId: getConferenceId(),
                // taskSourceType: 1, //任务来源  1报名新增  2报名变更 4行程变更 5请假
                // typeEqual: 50,   //50：用车资源分配，51：用餐资源分配，52：住宿资源分配，53：制证资源分配’
                // statusFlag: 1,  //1待办 2已办
                // type: 61,

                //  taskResult: 101,
                attendeeRoleFlagEqual: '0',
                pageSize: 10,
                pageNum: 1,
                taskResult: '',
                hasLinkAttendee: 1
            },
            pageInfo: {
                pageSizeList: [10, 20, 30],
                total: 0
            },
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
            taskAttendeeList: [],
            tableHeight: getTableHeight(200),
            imagePath: getOssBaseUrl(),
            addTaskDialogVisible: false
        }
    },
    watch: {
        // '$route' () {  // 对route进行监控  添加返回时会调用刷新数据
        //     this.getListInfo()

        // }

    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() { },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.getListInfo(this.paramData)
    },
    // 这里存放数据
    beforeCreate() { },
    // 生命周期 - 挂载之前
    beforeMount() { },
    // 生命周期 - 更新之前
    beforeUpdate() { },
    // 生命周期 - 更新之后
    updated() { },
    // 生命周期 - 销毁之前
    beforeDestroy() { },
    // 生命周期 - 销毁完成
    destroyed() { },
    // 如果页面有keep-alive缓存功能，这个函数会触发
    activated() { },
    methods: {
        exportExcel() {
            const load = showLoading()
            var exportParams = this.$refs.commonSearch.getSearchData()
            exportParams['pageSize'] = null
            exportParams['pageNum'] = null
            exportParams['type'] = 63
            exportParams['hasLinkAttendee'] = 1

            exportVehiclTaskAttendee(exportParams).then(res => {
                if (decodeURI(res.headers['filename']) == null || decodeURI(res.headers['filename']) === 'undefined') {
                    this.$message('文件不存在')
                } else {
                    const blob = new Blob([res.data], { type: 'application/octet-stream' })
                    const fileName = decodeURIComponent(decodeURI(res.headers['filename']))
                    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                        navigator.msSaveBlob(blob, fileName)
                    } else {
                        const link = document.createElement('a')
                        link.style.display = 'none'
                        link.href = URL.createObjectURL(blob)
                        link.setAttribute('download', fileName)
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                    }
                }
                closeLoading(load)
            })
                .catch(error => {
                    this.$message({
                        title: '错误',
                        desc: '系统数据错误'
                    })
                    console.log(error)
                    closeLoading(load)
                })
        },
        handleIgnoreWithConfirm(index, row) {
            this.$confirm('请确认是否忽略该条用车分配？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.handleIgnore(index, row)
            }).catch(() => { })
        },
        handleIgnore(index, row) {
            if (row.attendee.vehicleTaskList.length > 0) {
                var param1 = {
                    'conferenceId': getConferenceId(),
                    'attendeeId': row.attendee.id,
                    'type': 63,
                    'result': 100
                }
            } else {
                var param1 = {
                    'id': row.attendeeTask.id,
                    'result': 110
                }
            }

            // var param2 = {
            //     "conferenceId": getConferenceId(),
            //     "attendeeId": row.attendee.id,
            //     "type": 61,
            //     "result": 110
            // }
            var params = [param1]
            ignoreTask(params).then(res => {
                if (res.success) {
                    this.$message('操作成功')
                    this.getListInfo(this.paramData)
                }
            })
        },
        closeAddTask() {
            this.addTaskDialogVisible = false
        },
        addCarTask() {
            this.addTaskDialogVisible = true
        },
        handleAttendeeTaskDialog(index, row) {
            this.$refs['attendeeTaskDialog'].showDialog(row, 3) // type=3  会议用车
        },

        closeDialog() {
            this.$refs['taskDialog'].dialogVisible = false
        },
        formatPhone(val) {
            return formatPhone(val)
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
        changeTableHeight(val) {
            this.tableHeight = getTableHeight(val)
        },

        handleCommand(command) {
            console.log(command)
            if (command == 'cancelTask') {
                // this.cancelSelected()
            }
            if (command == 'deleteTask') {
                //   this.delSelected()
            }
        },

        handleSizeChange(val) {
            console.log('长度改变：' + val)
            this.paramData.pageSize = val
            this.getListInfo(this.paramData)
        },
        handleCurrentChange(val) {
            console.log('当前页码改变：' + val)
            this.paramData.pageNum = val
            this.getListInfo(this.paramData)
        },

        handleDialog(index, row) {
            if (row) {
                var list = []
                list.push(row)
                this.$refs['taskDialog'].showDialog(list, 'meeting')
            } else {
                var selectedList = this.$refs.table.selection
                if (selectedList.length > 0) {
                    this.$refs['taskDialog'].showDialog(selectedList, 'meeting')
                } else {
                    this.$message('未选择' + this.getConferenceTemplate(2) + '')
                }
            }
        },

        handleEdit() {
            alert('跳转中。。。')
        },

        tableRowClassName({ row, rowIndex }) {
            const index = rowIndex + 1
            if (index % 2 == 0) {
                return 'warning-row'
            }
        },
        // commonSearch组件参入参数
        onSubmit(param) {
            var params = Object.assign({}, param)
            params['pageSize'] = this.paramData.pageSize
            params['pageNum'] = 1
            params['conferenceId'] = this.paramData.conferenceId
            params['hasLinkAttendee'] = 1
            console.log(params)
            this.getListInfo(params)
        },

        getListInfo(param) {
            getMeetingList(param).then(response => {
                if (response.success) {
                    this.taskAttendeeList = response.result.list
                    this.pageInfo.total = response.result.total
                    this.paramData = param
                }
            })
            // getPickUpTaskAttendeeList(param).then(response => {
            //     if (response.success) {
            //         console.log("taskAttendeeList" + response.result.list);
            //         this.taskAttendeeList = response.result.list;
            //         this.pageInfo.total = response.result.total
            //         this.paramData = param;
            //         this.$emit("getToDoNum");
            //         //  this.$emit("getToDoNum", this.pageInfo.total)
            //     }
            // })
        }
    }
}
</script>
<style lang='scss' scoped >
// ::v-deep .el-table tr {
//     background: #c0c0c0;
// } // 单数行的颜色

::v-deep .el-table .warning-row {
    background: #f7f7f7;
}
::v-deep .el-table .cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.content {
    display: -webkit-box;
    overflow: hidden;
    white-space: normal !important;
    text-overflow: ellipsis;
    word-wrap: break-word;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
</style>
