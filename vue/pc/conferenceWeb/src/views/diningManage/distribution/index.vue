<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:8px">
        <div>
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <commonSearch
                    ref="commonSearch"
                    :show-dinner-flag="true"
                    @onSubmit="onSubmit"
                    @changeTableHeight="changeTableHeight"
                />
                <!-- <el-form ref="form" :inline="true" :model="form">
                    <el-form-item label="姓名" prop="attendeeNameLike">
                        <el-input v-model.trim="form.attendeeNameLike" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="手机" prop="phoneLike">
                        <el-input v-model.trim="form.phoneLike" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="单位名称" prop="allOrganizationNameLike">
                        <el-input v-model.trim="form.allOrganizationNameLike" size="small" style="width: 120px" />
                    </el-form-item>

                    <el-form-item label="分配状态" prop="taskResult">
                        <el-select v-model="form.taskResult" placeholder="默认未分配" style="width:120px">
                            <el-option
                                v-for="item in taskResultOptions"
                                :key="item.id"
                                :label="item.value"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item style="float: right;">
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                        <el-button @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                </el-form> -->
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
            <div style="float: left; padding-bottom:10px">
                <el-button
                    v-permission="buttons.DiningDistribution.batchDistribution"
                    type="primary"
                    @click="handleDialog"
                >批量分配</el-button>
                <!-- <el-button type="primary" @click="delSelectedWithConfirm">标记完成</el-button> -->
            </div>
            <div style="float: right;padding-bottom:10px">
                <el-button v-permission="buttons.DiningDistribution.export" @click="exportExcel">导出查询结果</el-button>
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
            </div>
            <el-table
                ref="table"
                :data="taskAttendeeList"
                :height="tableHeight+ (this.$store.state.menu.buttons.indexOf(Global.buttons.DiningDistribution.batchDistribution) !== -1
                    ? 0: 42)"
                style="width: 100%"
                tooltip-effect="light"
                :row-class-name="tableRowClassName"
                :header-cell-style="{
                    background:'#f7f7f7'
                }"
            >
                <el-table-column type="selection" prop="id" />
                <el-table-column prop="name" label="姓名" :min-width="150">
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
                <el-table-column label="是否用餐">
                    <template slot-scope="scope">
                        {{ scope.row.attendee.fixAttributeCommonVO.bookDinnerFlag ===1 ? "是" : "否" }}
                    </template>
                </el-table-column>
                <!-- <el-table-column label="到达时间"  >
                    <template slot-scope="scope">
                        {{ scope.row.attendee.fixAttributeCommonVO.arriveTime }}
                    </template>
                </el-table-column>
                <el-table-column label="返程时间"  >
                    <template slot-scope="scope">
                        {{ scope.row.attendee.fixAttributeCommonVO.returnTime }}
                    </template>
                </el-table-column> -->
                <el-table-column label="分配状态" :min-width="80">
                    <template slot-scope="scope">
                        <div>
                            <div v-if="scope.row.attendeeTask">
                                {{ scope.row.attendeeTask.resultStr }}
                            </div>
                            <div v-else>
                                未分配
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="320px">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.row.attendeeTask !==null && scope.row.attendeeTask.result !==100 && scope.row.attendeeTask.result !==110 "
                            v-permission="buttons.DiningDistribution.ignore"
                            size="mini"
                            @click="handleIgnoreWithConfirm(scope.$index, scope.row)"
                        >忽略
                        </el-button>
                        <el-button size="mini" @click="handleAttendeeTaskDialog(scope.$index, scope.row)">
                            查看用餐
                        </el-button>
                        <el-button
                            v-permission="buttons.DiningDistribution.distribution"
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)"
                        >分配用餐</el-button>
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
        <attendeeTaskDialog ref="attendeeTaskDialog" @getListInfo="getListInfo(paramData)" />

    </div>
</template>
<script>
import attendeeTaskDialog from './components/attendeeTaskDialog'

import taskDialog from './components/taskDialog'
import commonSearch from '@/views/common/commonSearch'
import { getTaskAttendeeList, updateTaskState, ignoreTask } from '@/api/car'
import { getDiningTaskMeetingList } from '@/api/dining'
import { getTableHeight, formatPhone } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
import { showLoading, closeLoading } from '@/utils/loading'
import { exportDinnerTaskAttendee } from '@/api/synergyFiles'
export default {
    name: 'NewRegist',
    components: { taskDialog, commonSearch, attendeeTaskDialog },
    data() {
        return {
            buttons: this.Global.buttons,
            form: {
                conferenceId: getConferenceId(),
                attendeeNameLike: '',
                allOrganizationNameLike: '',
                phoneLike: '',
                taskResult: 101

            },
            paramData: {
                conferenceId: getConferenceId(),
                // taskSourceType: 1, //任务来源  1报名新增  2报名变更 4行程变更 5请假
                // typeEqual: 51,   //50：用车资源分配，51：用餐资源分配，52：住宿资源分配，53：制证资源分配’
                // statusFlag: 1,  //1待办 2已办
                taskResult: 101,
                attendeeRoleFlagEqual: [0, 1, 2, 3, 4],
                pageSize: 10,
                pageNum: 1,
                hasLinkAttendee: 1
            },
            pageInfo: {
                pageSizeList: [10, 20, 30],
                total: 0
            },
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
            taskAttendeeList: [],
            tableHeight: getTableHeight(160),
            imagePath: getOssBaseUrl(),
            taskResultOptions: [{ id: '', value: '全部' }, { id: 101, value: '待分配' }, { id: 100, value: '已分配' }, { id: 110, value: '未分配' }]

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
            exportParams['hasLinkAttendee'] = 1

            exportDinnerTaskAttendee(exportParams).then(res => {
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
        handleAttendeeTaskDialog(index, row) {
            this.$refs['attendeeTaskDialog'].showDialog(row)
        },
        handleIgnoreWithConfirm(index, row) {
            this.$confirm('请确认是否忽略该条用餐分配？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.handleIgnore(index, row)
            }).catch(() => { })
        },
        handleIgnore(index, row) {
            var param1 = {
                'id': row.attendeeTask.id,
                'result': 110
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

        resetForm(form) {
            this.$refs[form].resetFields()
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
        delSelectedWithConfirm() {
            this.$confirm('请确认是否标记完成？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var ids = []
                var selectedList = this.$refs.table.selection
                if (selectedList.length == 0) {
                    this.$message('至少选择一条记录')
                    return
                }
                for (const item of selectedList) {
                    ids.push(item.id)
                }
                var params = {
                    'taskIds': ids,
                    'result': 100,
                    'status': 2,
                    'type': 51
                }
                console.log(params)
                updateTaskState(params).then(response => {
                    if (response.success) {
                        this.$message('标记成功')
                        this.getListInfo(this.paramData)
                    }
                })
            }).catch(() => { })
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

        handleDialog() {
            var ids = []
            var selectedList = this.$refs.table.selection
            for (const item of selectedList) {
                ids.push(item.attendee.id)
            }
            console.log(ids)
            if (ids.length > 0) {
                this.$refs['taskDialog'].showDialog(ids, selectedList)
            } else {
                this.$message('未选择' + this.getConferenceTemplate(2))
            }
        },

        handleEdit(index, row) {
            var ids = []
            var selectedList = []
            ids.push(row.attendee.id)
            selectedList.push(row)
            if (ids.length > 0) {
                this.$refs['taskDialog'].showDialog(ids, selectedList, row)
            } else {
                this.$message('未选择' + this.getConferenceTemplate(2))
            }
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
            params['hasLinkAttendee'] = 1
            // params['taskSourceType'] = this.paramData.taskSourceType;
            // params['typeEqual'] = this.paramData.typeEqual;
            // params['statusFlag'] = this.paramData.statusFlag;
            // params['attendeeRoleFlagEqual'] = this.paramData.attendeeRoleFlagEqual
            console.log(params)
            this.getListInfo(params)
        },

        getListInfo(param) {
            getDiningTaskMeetingList(param).then(response => {
                if (response.success) {
                    console.log('taskAttendeeList' + response.result.list)
                    this.taskAttendeeList = response.result.list
                    this.pageInfo.total = response.result.total
                    this.paramData = param
                    //   this.$emit("getToDoNum", this.pageInfo.total)
                }
            })
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
