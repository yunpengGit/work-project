<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:0px">

        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form ref="form" :inline="true" :model="form">
                    <el-form-item label="餐厅名称" prop="dinnerRoomLike">
                        <el-input v-model.trim="form.dinnerRoomLike" size="small" type="text" style="width:120px" />
                    </el-form-item>
                    <el-form-item label="用餐类型" prop="typeCode">
                        <el-select v-model="form.typeCode" placeholder="全部" style="width:120px" size="small">
                            <el-option
                                v-for="item in taskTypeOptions"
                                :key="item.typeCode"
                                :label="item.typeCode"
                                :value="item.typeCode"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="餐位数" prop="seatNum">
                        <el-input v-model.trim="form.seatNum" size="small" style="width:120px" />
                    </el-form-item>
                    <el-form-item label="用餐时间" prop="doubleTime">
                        <el-date-picker
                            v-model="form.doubleTime"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围"
                            size="small"
                            style="width:280px"
                        />
                    </el-form-item>
                    <el-form-item style="float:right">
                        <!-- <i class="el-icon-arrow-down" style="margin-right:10px" @click="showMore" /> -->
                        <el-button type="primary" size="small" @click="onSubmit">查询
                        </el-button>
                        <el-button size="small" @click="resetForm('form')">重置
                        </el-button>
                    </el-form-item>
                    <!-- <el-form-item v-show="showMoreFlag" label="任务状态" prop="status">
                        <el-select v-model="form.status" placeholder="全部" size="small" style="width:120px">
                            <el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item> -->
                </el-form>
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
            <!-- <div style="float: left; padding-bottom:10px">
                <el-dropdown @command="handleCommand">
                    <el-button type="primary">
                        批量操作<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="cancelTask">取消任务</el-dropdown-item>
                        <el-dropdown-item command="deleteTask"> 删除任务</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div> -->
            <!-- <div style="float: right;padding-bottom:10px">
                <el-button type="primary" @click="handleEdit">添加</el-button>
            </div> -->
            <div style="float: right;padding-bottom:10px">
                <el-checkbox v-model="checked">仅查看推荐</el-checkbox>
            </div>
            <el-table
                ref="table"
                :data="diningTaskList"
                style="width: 100%"
                :height="tableHeight"
                :header-cell-class-name="cellClass"
                :row-class-name="tableRowClassName"
                :header-cell-style="{
                    background:'#f7f7f7'
                }"
                @select="select"
                @select-all="selectAll"
            >
                <el-table-column width="58px">
                    <template slot-scope="scope">

                        <div v-if="scope.row.assignment">
                            <el-tag size="mini" color="#03BE1C">
                                <font color="#ffffff">已分配</font>
                            </el-tag>
                        </div>
                    </template>
                </el-table-column>

                <!-- <el-table-column type="selection" prop="id" :selectable="checkSelectable" /> -->
                <el-table-column type="selection" prop="id" />
                <el-table-column label="餐厅名称">
                    <template slot-scope="scope">
                        <div class="matching-style">{{ scope.row.dining.dinnerRoom }}<i v-if="scope.row.matching">推荐</i></div>
                    </template>
                </el-table-column>
                <el-table-column prop="typeCode" label="用餐类型" />
                <el-table-column label="用餐日期" width="160px">
                    <template slot-scope="scope">
                        {{ scope.row.dinnerStartDate }}&nbsp;-&nbsp;{{ scope.row.dinnerEndDate }}
                    </template>
                </el-table-column>

                <el-table-column label="用餐时间">
                    <template slot-scope="scope">
                        {{ scope.row.startTime.slice(0,5) }}&nbsp;-&nbsp;{{ scope.row.endTime.slice(0,5) }}
                    </template>
                </el-table-column>
                <el-table-column label="餐位数">
                    <template slot-scope="scope">
                        {{ scope.row.dining.seatNum }}
                    </template>
                </el-table-column>
                <el-table-column label="已用|剩余餐位">
                    <template slot-scope="scope">
                        {{ scope.row.dining.seatNum -scope.row.remainCount }}|{{ scope.row.remainCount < 0 ? 0: scope.row.remainCount }}
                    </template>
                </el-table-column>

                <el-table-column label="用餐状态">
                    <template slot-scope="scope">
                        {{ changeStatus(scope.row.status) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="240px">
                    <template slot-scope="scope">
                        <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
                        <el-button size="mini" @click="showAttendeeDialog(scope.$index, scope.row)">查看用餐人员
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- style="position:absolute;bottom:0px;right:20px;width:100%;background:#fff" -->
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
        <editDiningTask
            ref="editDiningTask"
            :task-type-options="taskTypeOptions"
            @getListInfo="getListInfo(paramData)"
            @handleCommand="handleCommand"
        />
        <attendeeList ref="attendeeList" @getListInfo="getListInfo(paramData)" />
    </div>
</template>
<script>
import { getDiningTaskList, deleteDiningTask, getTaskTypeOptions, cancelDiningTask } from '@/api/dining'
import editDiningTask from '../../editDiningTask'
import { getConferenceId } from '@/utils/conference-auth'
import attendeeList from './attendeeList'
import { getTableHeight } from '@/utils/index'

export default {
    name: 'DiningTask',
    components: { editDiningTask, attendeeList },
    props: {
        attendeeIds: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            checked: false,
            form: {
                conferenceId: getConferenceId(),
                dinnerRoomLike: '',
                typeCode: '',
                status: '',
                startDinnerDate: '',
                endDinnerDate: '',
                doubleTime: '',
                seatNum: '',
                matching: true
            },
            showMoreFlag: false,
            taskTypeOptions: [], // 早餐 中餐  晚餐类型 直接传中文
            statusOptions: [{ id: -1, name: '已取消' }, { id: 0, name: '正常' }],
            diningTaskList: [],
            paramData: {
                conferenceId: getConferenceId(),
                pageSize: 10,
                pageNum: 1,
                status: [0]
            },

            pageInfo: {
                pageSizeList: [10, 20, 30],
                total: 0
            },

            tableHeight: getTableHeight(220)
        }
    },
    watch: {
        // '$route' () {  // 对route进行监控  添加返回时会调用刷新数据
        //     this.getListInfo(this.paramData)

        // },
        checked(val) {
            this.paramData.matching = val
            this.getListInfo(this.paramData)
        },
        'form.doubleTime': {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.form.startDinnerDate = newVal[0]
                    this.form.endDinnerDate = newVal[1]
                } else {
                    this.form.startDinnerDate = ''
                    this.form.endDinnerDate = ''
                }
            },
            deep: true,
            immediate: true
        },
        'showMoreFlag': {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.tableHeight = getTableHeight(265)
                } else {
                    this.tableHeight = getTableHeight(220)
                }
            }
        }

    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() { },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        console.log(this.attendeeIds)
        this.paramData.attendeeId = this.attendeeIds
        this.getListInfo(this.paramData)
        this.getTaskTypeOptions()
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
        checkSelectable(row, index) {
            return !row.assignment
        },
        getAttendeeIds() {
            return this.attendeeIds
        },
        cellClass(row) {
            if (row.columnIndex === 0) {
                return 'disabledCheck'
            }
        },
        format(value) {
            return () => {
                return value + '%'
            }
        },

        // 限制只能单选
        // select (selection, row) {
        //     if (selection.length > 1) {
        //         const del_row = selection.shift()
        //         this.$refs.table.toggleRowSelection(del_row, false)
        //     }
        // },
        // selectAll (selection) {
        //     if (selection.length > 1) {
        //         selection.length = 1
        //     }
        // },

        showAttendeeDialog(index, row) {
            if (row) {
                this.$refs['attendeeList'].showDialog(row)
            }
        },
        showMore() {
            this.showMoreFlag = !this.showMoreFlag
        },
        customColorMethod(percentage) {
            if (percentage <= 50) {
                return '#039D12'
            } else if (percentage <= 60) {
                return '#F59A23'
            } else {
                return '#DF4D2D'
            }
        },
        // handleCommand (command) {
        //     this.$confirm('确认删除吗?', '提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText: '取消',
        //         type: 'warning'
        //     }).then(() => {
        //         if (command == "cancelTask") {

        //         }
        //         if (command == "deleteTask") {
        //             //  this.delSelected()
        //         }
        //     }).catch(() => { })
        // },
        handleCommand(command) {
            this.$confirm('请确认是否取消任务？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.cancelSelected(command)
            }).catch(() => { })
        },
        cancelSelected(id) {
            var ids = []
            // var selectedList = this.$refs.table.selection;
            // for (let item of selectedList) {
            //     ids.push(item.id)
            // }
            ids.push(id)// 需求改成   取消任务不需要批量
            var params = ids
            console.log(ids)
            cancelDiningTask(params).then(response => {
                if (response.success) {
                    this.$message('取消成功')
                    this.getListInfo(this.paramData)
                    this.$refs['editDiningTask'].cancelForm()
                }
            })
        },

        changeStatus(status) {
            if (status == -1) {
                return '已取消'
            }
            if (status == 0) {
                return '正常'
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

        handleEdit(index, row) {
            if (row) {
                this.$refs['editDiningTask'].showEdit(row)
            } else {
                this.$refs['editDiningTask'].showEdit()
            }
        },

        tableRowClassName({ row, rowIndex }) {
            const index = rowIndex + 1
            if (index % 2 == 0) {
                return 'warning-row'
            }
        },
        onSubmit() {
            var params = Object.assign({}, this.form)
            for (var key in params) {
                if (params[key] === '') {
                    delete params[key]
                }
                if (key == 'doubleTime') {
                    delete params[key]
                }
            }
            // 这里需要加入pageSize和pageNum参数
            params['pageSize'] = this.paramData.pageSize
            params['pageNum'] = 1
            params['status'] = [0]
            params['attendeeId'] = this.attendeeIds
            this.getListInfo(params)
        },
        resetForm(form) {
            this.$refs[form].resetFields()
        },
        getListInfo(param) {
            param.matchingAttendeeIds = param.attendeeId
            getDiningTaskList(param).then(response => {
                if (response.success) {
                    console.log('diningTaskList' + response.result.list)
                    this.diningTaskList = response.result.list
                    this.pageInfo.total = response.result.total
                    this.paramData = param
                }
            })
        },
        getTaskTypeOptions() {
            getTaskTypeOptions({ 'conferenceId': this.form.conferenceId }).then(response => {
                if (response.success) {
                    console.log('type result' + response.result)
                    this.taskTypeOptions = response.result
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

/* 去掉全选按钮 */
::v-deep .el-table .disabledCheck .cell .el-checkbox__inner {
    display: none !important;
}

::v-deep .el-table .disabledCheck .cell::before {
    content: "";
    text-align: center;
    line-height: 37px;
}
</style>
