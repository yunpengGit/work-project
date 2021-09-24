<template>
    <div>
        <div style="padding-left:8px;padding-right:8px;margin-top:0px">
            <div style="background-color: white;padding-left:10px;padding-top: 0px">
                <pick-out-search ref="commonSearch" @onSubmit="onSubmit" @changeTableHeight="changeTableHeight" />
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
            <div style="float: left; padding-bottom:10px">
                <el-button type="primary" @click="handleDialog">批量分配</el-button>
                <el-button type="primary" @click="delSelectedWithConfirm">标记完成</el-button>
            </div>
            <div style="float: right;padding-bottom:10px">
                <el-dropdown @command="handleCommand">
                    <el-button>
                        列表筛选<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="jiezhan">接站</el-dropdown-item>
                        <el-dropdown-item command="songzhan"> 送站</el-dropdown-item>
                        <el-dropdown-item command="huiyi"> {{ getConferenceTemplate(1) }}用车</el-dropdown-item>
                        <el-dropdown-item command="quanbu"> 全部字段</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <el-table ref="table" :data="taskAttendeeList" :height="tableHeight" style="width: 100%"
                :row-class-name="tableRowClassName" :header-cell-style="{
                    background:'#f7f7f7'
                }">
                <el-table-column type="selection" prop="id" />
                <el-table-column :label="getConferenceTemplate(2) + '信息'" align="left" width="150px">
                    <template slot-scope="scope">
                        <div style="height:32px">
                            <img style="width:32px;height:32px;float:left;border-radius:50%"
                                :src="imagePath + (scope.row.attendee.fixAttributeCommonVO.photoUrl!== null && scope.row.attendee.fixAttributeCommonVO.photoUrl !== '' ? scope.row.attendee.fixAttributeCommonVO.photoUrl : defaultPhoto)">
                            <span style="margin-top:8px;margin-left:5px;float:left"
                                :title="scope.row.attendee.fixAttributeCommonVO.attendeeName">{{ scope.row.attendee.fixAttributeCommonVO.attendeeName != null && scope.row.attendee.fixAttributeCommonVO.attendeeName.length > 4 ? scope.row.attendee.fixAttributeCommonVO.attendeeName.substr(0,4) + '...' : scope.row.attendee.fixAttributeCommonVO.attendeeName }}</span>
                            <span v-if="scope.row.attendee.fixAttributeCommonVO.honourFlag === 1"
                                style="margin-top:8px;float:left">（主宾）</span>
                            <span v-else style="margin-top:8px;float:left">（随员）</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="职务" width="140px">
                    <template slot-scope="scope">
                        <div :title="scope.row.attendee.fixAttributeCommonVO.position" class="content1">
                            {{ scope.row.attendee.fixAttributeCommonVO.position }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="手机">
                    <template slot-scope="scope">
                        <PhoneEncryption :value="scope.row.attendee.fixAttributeCommonVO.phone" />
                        <!-- <div>
                            <span>{{ formatPhone(scope.row.attendee.fixAttributeCommonVO.phone) }}</span>
                            <span style="display:none">{{ scope.row.attendee.fixAttributeCommonVO.phone }}</span>
                            <el-button icon="el-icon-view" type="text" @click="(event) => qiehuanshoujijiami(event)" />
                        </div> -->
                    </template>
                </el-table-column>
                <el-table-column label="单位简称/全称">
                    <template slot-scope="scope">
                        <div>
                            {{ formatOrgName(scope.row.attendee.fixAttributeCommonVO.organizationSortName,scope.row.attendee.fixAttributeCommonVO.organizationName) }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="变更信息" width="400px">
                    <template slot-scope="scope">
                        <el-popover placement="bottom-start" trigger="hover" width="300">
                            <div v-if="scope.row.changeContent !=null && JSON.parse(scope.row.changeContent).length>0 ">
                                变更后： <br><span v-for="changeContent in JSON.parse(scope.row.changeContent)"
                                    :key="changeContent.code">&nbsp;&nbsp;&nbsp;&nbsp;{{ changeContent.attribute }}：
                                    {{ changeContent.afterValue }}&nbsp;&nbsp;&nbsp;&nbsp; <br></span> <br>
                                变更前：<br> <span v-for="changeContent in JSON.parse(scope.row.changeContent)"
                                    :key="changeContent.code">&nbsp;&nbsp;&nbsp;&nbsp;{{ changeContent.attribute }}：
                                    {{ changeContent.beforeValue }}&nbsp;&nbsp;&nbsp;&nbsp;<br></span><br>

                            </div>
                            <div v-if="scope.row.changeContent !=null && JSON.parse(scope.row.changeContent).length>0 "
                                slot="reference" class="content">
                                变更后： <span v-for="changeContent in JSON.parse(scope.row.changeContent)"
                                    :key="changeContent.code">{{ changeContent.attribute }}：
                                    {{ changeContent.afterValue }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                变更前： <span v-for="changeContent in JSON.parse(scope.row.changeContent)"
                                    :key="changeContent.code">{{ changeContent.attribute }}：
                                    {{ changeContent.beforeValue }}&nbsp;&nbsp;&nbsp;&nbsp;</span>

                            </div>

                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">分配</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <div style="float:right;padding:10px"> -->
            <div class="page-wrapper">
                <el-pagination :current-page="paramData.pageNum" background :page-sizes="pageInfo.pageSizeList"
                    :page-size="paramData.pageSize" layout="total, prev, pager, next, sizes ,jumper"
                    :total="pageInfo.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </div>
        <taskDialog ref="taskDialog" @closeDialog="closeDialog" />
    </div>
</template>
<script>
import taskDialog from './taskDialog'

import commonSearch from '@/views/common/commonSearch'
import { getTaskAttendeeList, updateTaskState } from '@/api/car'
import { getTableHeight, formatPhone } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
import PickOutSearch from './pickOutSearch.vue'

export default {
    name: 'NewRegist',
    components: { taskDialog, PickOutSearch },
    data () {
        return {
            paramData: {
                conferenceId: getConferenceId(),
                taskSourceType: 2, // 任务来源  1报名新增  2报名变更 4行程变更 5请假
                typeEqual: 50, // 50：用车资源分配，51：用餐资源分配，52：住宿资源分配，53：制证资源分配’
                statusFlag: 1, // 1待办 2已办
                pageSize: 10,
                pageNum: 1
            },
            pageInfo: {
                pageSizeList: [10, 20, 30],
                total: 0
            },
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
            taskAttendeeList: [],
            tableHeight: getTableHeight(200),
            imagePath: getOssBaseUrl()
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
        this.getListInfo(this.paramData)
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
        closeDialog () {
            this.$refs['taskDialog'].dialogVisible = false
        },
        formatPhone (val) {
            return formatPhone(val)
        },
        qiehuanshoujijiami (event) {
            if (event.currentTarget.parentElement.children[0].style.display === 'none') {
                event.currentTarget.parentElement.children[0].style.display = ''
                event.currentTarget.parentElement.children[1].style.display = 'none'
            } else {
                event.currentTarget.parentElement.children[0].style.display = 'none'
                event.currentTarget.parentElement.children[1].style.display = ''
            }
        },
        changeTableHeight (val) {
            this.tableHeight = getTableHeight(val)
        },

        handleCommand (command) {
            console.log(command)
            if (command == 'cancelTask') {
                // this.cancelSelected()
            }
            if (command == 'deleteTask') {
                //   this.delSelected()
            }
        },
        delSelectedWithConfirm () {
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
                    'type': 50
                }
                updateTaskState(params).then(response => {
                    if (response.success) {
                        this.$message('标记完成成功')
                        this.getListInfo(this.paramData)
                    }
                })
            }).catch(() => { })
        },

        handleSizeChange (val) {
            console.log('长度改变：' + val)
            this.paramData.pageSize = val
            this.getListInfo(this.paramData)
        },
        handleCurrentChange (val) {
            console.log('当前页码改变：' + val)
            this.paramData.pageNum = val
            this.getListInfo(this.paramData)
        },

        handleDialog () {
            var ids = []
            var selectedList = this.$refs.table.selection
            for (const item of selectedList) {
                ids.push(item.attendeeId)
            }

            if (ids.length > 0) {
                this.$refs['taskDialog'].showDialog(ids)
            } else {
                this.$message('未选择' + this.getConferenceTemplate(2))
            }
        },

        handleEdit () {
            alert('跳转中。。。')
        },

        tableRowClassName ({ row, rowIndex }) {
            const index = rowIndex + 1
            if (index % 2 == 0) {
                return 'warning-row'
            }
        },
        // commonSearch组件参入参数
        onSubmit (param) {
            var params = Object.assign({}, param)
            params['pageSize'] = this.paramData.pageSize
            params['pageNum'] = this.paramData.pageNum
            params['taskSourceType'] = this.paramData.taskSourceType
            params['typeEqual'] = this.paramData.typeEqual
            params['statusFlag'] = this.paramData.statusFlag
            console.log(params)
            this.getListInfo(params)
        },

        getListInfo (param) {
            getTaskAttendeeList(param).then(response => {
                if (response.success) {
                    console.log('taskAttendeeList' + response.result.list)
                    this.taskAttendeeList = response.result.list
                    this.pageInfo.total = response.result.total
                    this.paramData = param
                    this.$emit('getToDoNum', this.pageInfo.total)
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
