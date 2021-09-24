<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:8px">
        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form ref="form" :inline="true" :model="form">
                    <div class="inquire_form">
                    <div class="form_left">
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
                    </div>
                    <el-form-item  class="form_operation">
                        <i class="el-icon-arrow-down" style="margin-right:10px" @click="showMore" />
                        <el-button type="primary" size="small" @click="onSubmit">查询
                        </el-button>
                        <el-button size="small" @click="resetForm('form')">重置
                        </el-button>
                    </el-form-item>
                    </div>
                    <el-form-item v-show="showMoreFlag" label="计划状态" prop="status">
                        <el-select v-model="form.status" placeholder="全部" size="small" style="width:120px">
                            <el-option
                                v-for="item in statusOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>

                    <!-- <el-form-item v-show="showMoreFlag" label="发布状态" prop="publish">
                        <el-select v-model="form.publish" placeholder="全部" clearable style="width:120px">
                            <el-option
                                v-for="item in publishOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
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
            <div style="float: left; padding-bottom:10px">
                <el-button v-permission="buttons.DiningTask.add" type="primary" @click="handleEdit">添加用餐任务</el-button>
                <!-- 已和产品确认：权限权限与添加相同 -->
                <el-button v-permission="buttons.DiningTask.add" type="primary" @click="copyPublishDialogVisible = true;">复制用餐计划
                </el-button>
                <el-button v-permission="buttons.DiningTask.batchPublish" type="primary" @click="batchPublish">批量发布
                </el-button>
                <el-button v-permission="buttons.DiningTask.batchPublish" type="primary" @click="cancelPublish">取消发布
                </el-button>
                <el-dialog
                    :title="`正在${issueDialogText}用餐任务`"
                    :visible.sync="issueDialogVisible"
                    width="400px">
                    <span>
                        共{{issueDialogText}} {{issueDialogLength}}条用餐任务，请确认是否需要上级审核？
                    </span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="issueDialogVisible = false">取 消</el-button>
                        <el-button type="primary" plain @click="issueDialogSubmit">不需要</el-button>
                        <el-button type="primary" @click="issueDialogRatify">需要</el-button>
                    </span>
                </el-dialog>
            </div>
            <div style="float: right;padding-bottom:10px">
                <el-button v-permission="buttons.DiningTask.import" @click="importDiningTask">导入用餐任务</el-button>
                <el-button v-permission="buttons.DiningTask.export" @click="exportTask">导出查询结果</el-button>
            </div>
            <el-table
                ref="table"
                :data="diningTaskList"
                style="width: 100%"
                :height="tableHeight+ (this.$store.state.menu.buttons.indexOf(Global.buttons.DiningTask.add) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.DiningTask.batchPublish) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.DiningTask.import) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.DiningTask.export) !== -1
                    ? 0: 42)"
                tooltip-effect="light"
                :row-class-name="tableRowClassName"
                :header-cell-style="{
                    background:'#f7f7f7'
                }"
            >
                <el-table-column type="selection" prop="id" :selectable="selectInit"/>
                <el-table-column label="餐厅名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.dining.dinnerRoom }}
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
                        {{ scope.row.dining.seatNum -scope.row.remainCount }}&nbsp;|&nbsp;{{ 0 > scope.row.remainCount ? 0: scope.row.remainCount }}
                    </template>

                </el-table-column>
                <!-- <el-table-column label="使用率">
                    <template slot-scope="scope">
                        <el-progress
                            :percentage="scope.row.usageRate.replace('%','') > 100 ? 100 : scope.row.usageRate.replace('%','')"
                            :format="format(scope.row.usageRate.replace('%',''))"
                            :text-inside="true"
                            :stroke-width="18"
                            :color="customColorMethod"
                        />

                {{ scope.row.usageRate }}
</template>
                </el-table-column> -->

                <el-table-column label="任务状态">
                    <template slot-scope="scope">
                        {{ changeStatus(scope.row) }}
                    </template>
                </el-table-column>
                <!-- <el-table-column label="发布状态">
                    <template slot-scope="scope">
                        {{ changePublishStatus(scope.row.publish) }}
                    </template>
                </el-table-column> -->
                <el-table-column label="操作" width="320px">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleInfo(scope.$index, scope.row)">查看任务</el-button>
                        <el-button
                            v-permission="buttons.DiningTask.edit"
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑任务</el-button>
                        <!-- <el-button size="mini" @click="handleAdd(scope.$index, scope.row)">添加用餐人员
                        </el-button>
                        <el-button size="mini" @click="handleView(scope.$index, scope.row)">查看用餐人员
                        </el-button> -->
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
        <editDiningTask ref="editDiningTask" @getListInfo="getListInfo(paramData)" @handleCommand="handleCommand" />
        <diningTaskInfo ref="diningTaskInfo" @getListInfo="getListInfo(paramData)" />
        <viewDiningTask ref="viewDiningTask" @getListInfo="getListInfo(paramData)" @handleCommand="handleCommand" />
        <PickAttendee
            :pick-dialog-visible="pickDialogVisible"
            :attendee-role-flag-equal="[0,1,2,3,4]"
            @closeDialog="closePickAttendeeDialog"
        />

        <importDiningTask :dialog-visible="importDialogVisible" @closeDialog="closeImportDialog" />

        <!-- [复制用餐计划]弹窗 -->
        <el-dialog
            v-if="copyPublishDialogVisible"
            title="复制用餐计划"
            width="70%"
            :visible.sync="copyPublishDialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="closeCopyPublishDialog"
        >
            <p style="font-size:12px; color: #9b9c9b; margin-bottom: 20px;">请选择需要复制的用餐计划，计划内用餐人员将自动复制到新计划中</p>
            <el-table
                :data="diningTaskList"
                border
                style="width: 100%"
                height="300px"
                highlight-current-row
                @current-change="handleCopyChange"
            >
                <el-table-column label="选择" width="55">
            　　　　<template slot-scope="scope">
            　　　　　　<el-radio v-model="currentRow" :label="scope.row"><i /></el-radio>
            　　　　</template>
            　　</el-table-column>
                <el-table-column label="餐厅名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.dining.dinnerRoom }}
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
            </el-table>
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
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="comfirmCopy">确认</el-button>
                <el-button @click="closeCopyPublishDialog">取消</el-button>
            </span>
        </el-dialog>
        <auditTask @closeDialog="closeAuditDialog" :businessFlag="businessFlag" :isdialog="isAuditDialog" :businessIds="businessIds" :type="3"/>
    </div>
</template>
<script>
import { cancelPublish, getDiningTaskList, deleteDiningTask, getTaskTypeOptions, cancelDiningTask, addDiningTaskAttendee, batchPublish, exportTask } from '@/api/dining'
import editDiningTask from './editDiningTask'
import viewDiningTask from './viewDiningTask'
import diningTaskInfo from './diningTaskInfo'

import { getConferenceId } from '@/utils/conference-auth'
import PickAttendee from '@/views/attendee/components/pickAttendee'

import { getTableHeight } from '@/utils/index'
import importDiningTask from './importDiningTask'
import { showLoading, closeLoading } from '@/utils/loading'
import auditTask from "@/components/auditTask.vue"

export default {
    name: 'DiningTask',
    components: { editDiningTask, viewDiningTask, PickAttendee, diningTaskInfo, importDiningTask,auditTask },
    data() {
        return {
            importDialogVisible: false,
            buttons: this.Global.buttons,
            issueDialogText:'',
            businessFlag:null,
            issueDialogLength:0,
            issueDialogVisible:false,
            isAuditDialog:false,
            businessIds:[],
            form: {
                conferenceId: getConferenceId(),
                dinnerRoomLike: '',
                typeCode: '',
                status: '',
                publish: '',
                startDinnerDate: '',
                endDinnerDate: '',
                doubleTime: '',
                seatNum: ''
            },
            showMoreFlag: false,
            taskTypeOptions: [], // 早餐 中餐  晚餐类型 直接传中文
            statusOptions: [{ id: '', name: '全部' }, { id: -1, name: '已取消' }, { id: 100, name: '未发布' },{ id: 99, name: '待审核' }, { id: 101, name: '已发布' }],
            publishOptions: [{ id: '', name: '全部' }, { id: 0, name: '未发布' }, { id: 1, name: '已发布' }],
            diningTaskList: [],
            paramData: {
                conferenceId: getConferenceId(),
                pageSize: 10,
                pageNum: 1

            },
            pickDialogVisible: false,
            pageInfo: {
                pageSizeList: [10, 20, 30],
                total: 0
            },

            tableHeight: getTableHeight(160),
            choosedTaskId: '',
            copyPublishDialogVisible: false, // 复制用餐计划弹窗
            currentRow: {}
        }
    },
    watch: {
        '$route'() { // 对route进行监控  添加返回时会调用刷新数据
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
                    this.tableHeight = getTableHeight(211)
                } else {
                    this.tableHeight = getTableHeight(165)
                }
            }
        }

    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() { },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
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
        // 关闭弹窗
        closeCopyPublishDialog() {
            this.currentRow = {}
            this.copyPublishDialogVisible = false
        },
        selectInit(row, index) {
            if (row.publish === 2) {
                return false; // 可勾选
            } else {
                return true; // 不可勾选
            }
        },

        // 确认复制
        comfirmCopy() {
            if (JSON.stringify(this.currentRow) == '{}') {
                this.$message('请选择用餐计划!')
            } else {
                this.copyPublishDialogVisible = false
                this.handleEdit(null, this.currentRow, 'copy')
            }
        },
        // 选中行改变
        handleCopyChange(val) {
            this.currentRow = val
        },
        exportTask() {
            const load = showLoading()
            var tempData = JSON.parse(JSON.stringify(this.paramData))
            tempData.pageSize = null
            tempData.pageNum = null
            exportTask(tempData).then(res => {
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

        importDiningTask() {
            this.importDialogVisible = true
        },
        closeImportDialog() {
            this.importDialogVisible = false
            this.getListInfo(this.paramData)
        },
        closePickAttendeeDialog(val) {
            if (val !== null) {
                var attendees = []
                val.forEach(item => {
                    attendees.push({ 'id': item })
                })
                var params = {
                    'taskId': this.choosedTaskId,
                    'attendees': attendees
                }
                console.log(params)
                addDiningTaskAttendee(params).then(res => {
                    if (res.success) {
                        this.pickDialogVisible = false
                        this.getListInfo(this.paramData)
                    }
                })
            } else {
                this.pickDialogVisible = false
            }
        },
        handleAdd(index, row) {
            // this.$refs["addAttendee"].showEdit();
            this.pickDialogVisible = true
            this.choosedTaskId = row.id
        },
        format(value) {
            return () => {
                return value + '%'
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
        changePublishStatus(publish) {
           if (publish===1) {
                return '已发布'
            } else if(publish===2){
                return '待审核'
            }
            else{
                return '未发布'
            }
        },
        changeStatus(row) {
            if (row.status == -1) {
                return '已取消'
            }
            if(row.publish===2){
                return '待审核'
            }
            if (!row.publish) {
                return '未发布'
            }
            if (row.status == 0) {
                return '正常'
            }
        },
        // addPerson(index, row) {
        //     this.$router.push({ path: '/dining/addAttendee', query: { diningTaskId: row.id }})
        // },

        // 查看用餐人员
        handleView(index, row) {
            if (row) {
                this.$refs['viewDiningTask'].showView(row)
            } else {
                this.$refs['viewDiningTask'].showView()
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

        handleEdit(index, row, type) {
            if (row) {
                this.$refs['editDiningTask'].showEdit(row, type)
            } else {
                this.$refs['editDiningTask'].showEdit()
            }
        },

        handleInfo(index, row) {
            if (row) {
                this.$refs['diningTaskInfo'].showEdit(row)
            } else {
                this.$refs['diningTaskInfo'].showEdit()
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

            this.getListInfo(params)
        },
        resetForm(form) {
            this.$refs[form].resetFields()
        },
        getListInfo(param) {
            if (param['status'] === 100) {
                param['publish'] = 0
                param['status'] = 0
            } else if (param['status'] === 101) {
                param['publish'] = 1
                param['status'] = 0
            }  else if (param['status'] === 99) {
                param['publish'] = 2
                param['status'] = 0
            }else {
                param['publish'] = null
            }
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
        },
        // 批量发布
        batchPublish() {
            var selectedList = this.$refs.table.selection
            if (selectedList.length === 0) {
                this.$message('至少选择一条记录')
                return false
            }

            this.businessIds = []
             for (const item of selectedList) {
                if(item.publish!==1){
                    this.businessIds.push(item.id)
                }
            }
            if(this.businessIds.length===0){
                this.$message('已发布的请勿重复发布')
                return false
            }
            
            this.businessFlag=0
            this.issueDialogLength=selectedList.length
            this.issueDialogText="发布"
            this.issueDialogVisible=true;
            
        },
        // 取消发布
        cancelPublish() {
            var ids = []
            var selectedList = this.$refs.table.selection
            if (selectedList.length === 0) {
                this.$message('至少选择一条记录')
                return false
            }
            this.businessIds = []
             for (const item of selectedList) {
                if(item.publish!==0){
                    this.businessIds.push(item.id)
                }
            }
            if(this.businessIds.length===0){
                this.$message('未发布的无法取消发布')
                return false
            }
            this.businessFlag=1
            this.issueDialogLength=selectedList.length
            this.issueDialogText="取消发布"
            this.issueDialogVisible=true;
        },
         //不需要审核
        issueDialogSubmit(){
            var ids = []
            var selectedList = this.$refs.table.selection
            for (const item of selectedList) {
            ids.push(item.id)
            }
            if(this.issueDialogText==='发布'){
                batchPublish(ids).then(response => {
                    if (response.success) {
                        this.$message('发布成功')
                        this.getListInfo(this.paramData)
                        this.issueDialogVisible=false;
                    }
                })
            }else{
               cancelPublish(ids).then(response => {
                if (response.success) {
                    this.$message('取消发布成功')
                    this.getListInfo(this.paramData)
                    this.issueDialogVisible=false;
                }
            })
            }
        },
        //需要审核
        issueDialogRatify(){
            this.isAuditDialog=true
            this.issueDialogVisible=false;
        },
        //关闭审核弹框
        closeAuditDialog(){
            this.isAuditDialog=false
            this.getListInfo(this.paramData)
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
::v-deep .el-dialog__body{
    margin: 30px 0;
}
</style>
