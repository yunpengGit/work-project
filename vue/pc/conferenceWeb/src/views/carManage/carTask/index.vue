<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:8px">
        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form ref="form" :inline="true" :model="form">
                    <div class="inquire_form">
                    <div class="form_left">
                    <el-form-item label="司机" prop="driverNameLike">
                        <el-input v-model.trim="form.driverNameLike" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="司机手机" prop="phoneLike">
                        <el-input v-model.trim="form.phoneLike" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="出发地点" prop="startAddressLike">
                        <el-input v-model.trim="form.startAddressLike" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="目的地点" prop="endAddressLike">
                        <el-input v-model.trim="form.endAddressLike" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="座位数" prop="seatNum">
                        <el-input v-model.trim="form.seatNum" size="small" style="width: 120px" />
                    </el-form-item>
                    </div>
                    <el-form-item  class="form_operation">
                        <i class="el-icon-arrow-down" style="margin-right:10px" @click="showMore" />
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                        <el-button @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                    </div>
                    <el-form-item v-if="showMoreFlag" label="用车时间" prop="doubleTime">
                        <el-date-picker
                            v-model="form.doubleTime"
                            type="datetimerange"
                            range-separator="-"
                            :default-time="configDefaultTime"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="width:300px"
                        />
                    </el-form-item>
                    <el-form-item v-if="showMoreFlag" label="车型" prop="vehicleTypeLike">
                        <el-input v-model.trim="form.vehicleTypeLike" size="small" style="width: 100px" />
                    </el-form-item>
                    <el-form-item v-if="showMoreFlag" label="车牌号" prop="platNumLike">
                        <el-input v-model.trim="form.platNumLike" size="small" type="text" style="width: 100px" />
                    </el-form-item>
                    <el-form-item v-if="showMoreFlag" label="任务类型" prop="type">
                        <el-select v-model="form.type" placeholder="全部" clearable style="width:100px">
                            <el-option
                                v-for="item in taskTypeOptions"
                                :key="item.valCode"
                                :label="item.valName"
                                :value="item.valCode"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="showMoreFlag" label="任务状态" prop="status">
                        <el-select v-model="form.status" placeholder="全部" clearable style="width:100px">
                            <el-option
                                v-for="item in statusOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item v-show="showMoreFlag" label="发布状态" prop="publish">
                        <el-select v-model="form.publish" placeholder="全部" clearable style="width:100px">
                            <el-option
                                v-for="item in publishOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item> -->
                    <el-form-item v-if="showMoreFlag" :label="getConferenceTemplate(2) +'姓名'" prop="attendeeNameLike">
                        <el-input v-model.trim="form.attendeeNameLike" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item
                        v-if="showMoreFlag"
                        :label="getConferenceTemplate(2) +'手机'"
                        prop="attendeePhoneLike"
                    >
                        <el-input v-model.trim="form.attendeePhoneLike" size="small" style="width: 120px" />
                    </el-form-item>

                    <el-form-item v-if="showMoreFlag" label="单位名称" prop="organizationNameLike">
                        <el-input v-model.trim="form.organizationNameLike" size="small" style="width: 120px" />
                    </el-form-item>

                    <el-form-item v-if="showMoreFlag" label="职务" prop="positionLike">
                        <el-input v-model.trim="form.positionLike" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item v-if="showMoreFlag" label="标签" prop="tagIdsIn">
                        <el-select v-model="form.tagIdsIn" placeholder="全部" clearable style="width:120px">
                            <el-option v-for="item in tagOptions" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="showMoreFlag" :label="getConferenceTemplate(2) + '类型'" prop="honourFlag">
                        <el-select v-model="form.honourFlag" placeholder="全部" clearable style="width:80px">
                            <el-option
                                v-for="item in attendeeTypeOptions"
                                :key="item.id"
                                :label="item.value"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="showMoreFlag" label="分组" prop="groupIdsIn">

                        <el-select v-model="groupIdsIn" placeholder="全部" collapse-tags multiple style="width:140px">
                            <el-option
                                v-for="item in groupOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="showMoreFlag" label="职级" prop="positionLevel">
                        <el-select v-model="form.positionLevel" placeholder="全部" clearable style="width:100px">
                            <el-option
                                v-for="item in positionLevelOptions"
                                :key="item.valCode"
                                :label="item.valName"
                                :value="item.valCode"
                            />
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px;">
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
                <el-button v-permission="buttons.CarTask.batchPublish" type="primary" @click="batchPublish">批量发布
                </el-button>
                <el-button v-permission="buttons.CarTask.batchPublish" type="primary" @click="cancelPublish">取消发布
                </el-button>
                <el-dialog
                    :title="`正在${issueDialogText}用车任务`"
                    :visible.sync="issueDialogVisible"
                    width="400px">
                    <span>
                        共{{issueDialogText}} {{issueDialogLength}}条用车任务，请确认是否需要上级审核？
                    </span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="issueDialogVisible = false">取 消</el-button>
                        <el-button type="primary" plain @click="issueDialogSubmit">不需要</el-button>
                        <el-button type="primary" @click="issueDialogRatify">需要</el-button>
                    </span>
                </el-dialog>
            </div>
            <div style="float: right;padding-bottom:10px">
                <el-button v-permission="buttons.CarTask.add" type="primary" @click="handleEdit">添加用车任务</el-button>
                <el-button v-permission="buttons.CarTask.import" @click="importCarTask">导入用车任务</el-button>
                <el-button v-permission="buttons.CarTask.export" @click="exportTask">导出查询结果</el-button>
            </div>
            <el-table
                ref="table"
                :data="vehicleTaskList"
                style="width: 100%"
                :height="tableHeight+ (this.$store.state.menu.buttons.indexOf(Global.buttons.CarTask.export) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.CarTask.export) !== -1 || this.$store.state.menu.buttons.indexOf(Global.buttons.CarTask.add) !== -1 || this.$store.state.menu.buttons.indexOf(Global.buttons.CarTask.batchPublish) !== -1
                    ? 0: 32)"
                :row-class-name="tableRowClassName"
                tooltip-effect="light"
                :header-cell-style="{
                    background:'#f7f7f7'
                }"
            >
                <el-table-column type="selection" prop="id" :selectable="selectInit"/>
                <el-table-column prop="typeStr" label="任务类型" />

                <el-table-column label="车辆信息" min-width="110px">
                    <template slot-scope="scope">
                        {{ scope.row.vehicle.platNum }}
                        ({{ scope.row.vehicle.vehicleTypeVO.name }})
                        {{ scope.row.vehicle.vehicleTypeVO.seatNum }}座

                    </template>
                </el-table-column>
                <el-table-column label="司机" align="left" min-width="110px">
                    <template slot-scope="scope">
                        <div v-if="scope.row.driverVO">
                            <div>{{ scope.row.driverVO.name }} </div>
                            <PhoneEncryption :value="scope.row.driverVO.phone" />
                            <!--  <span>{{ formatPhone(scope.row.driverVO.phone) }}</span>
                            <span style="display:none">{{ scope.row.driverVO.phone }}</span>
                            <el-button icon="el-icon-view" type="text" @click="(event) => qiehuanshoujijiami(event)" /> -->
                        </div>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="已用|剩余座位数" width="110px">
                    <template slot-scope="scope">
                        {{ scope.row.vehicle.vehicleTypeVO.seatNum-scope.row.remainCount }} |
                        {{ scope.row.remainCount < 0 ? 0: scope.row.remainCount }}

                    </template>
                </el-table-column> -->
                <el-table-column label="上车时间" min-width="120px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.getOnVehicleTime"> {{ scope.row.getOnVehicleTime.slice(0,16) }} </span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="startAddress" label="上车地点" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ formatTableCellData(scope.row.startAddress) }}
                    </template>
                </el-table-column>
                <el-table-column label="送达时间" min-width="120px">
                    <template slot-scope="scope">
                        {{ scope.row.endTime.slice(0,16) }}
                    </template>
                </el-table-column>
                <el-table-column prop="endAddress" label="送达地点" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ formatTableCellData(scope.row.endAddress) }}
                    </template>
                </el-table-column>
                <el-table-column label="任务状态">
                    <template slot-scope="scope">
                        <div v-if="!scope.row.publish && scope.row.status !== -1 ">
                            未发布
                        </div>
                        <div v-else-if="scope.row.publish===2">待审核</div>
                        <div v-else>
                            {{ scope.row.statusStr === '已出发' ? '进行中' : scope.row.statusStr === '已到达上车位置' ? '已完成' : scope.row.statusStr }}
                        </div>
                    </template>
                </el-table-column>

                <!-- <el-table-column label="发布状态">
                    <template slot-scope="scope">
                        <div v-if="scope.row.publish">
                            已发布
                        </div>
                        <div v-else>
                            未发布
                        </div>
                    </template>
                </el-table-column> -->
                <el-table-column label="操作" fixed="right" width="220px">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleTask(scope.$index, scope.row)">查看任务</el-button>
                        <el-button
                            v-permission="buttons.CarTask.edit"
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑任务</el-button>
                        <!-- <el-button size="mini" @click="showAttendeeDialog(scope.$index, scope.row)">查看乘车人
                        </el-button>
                        <el-button size="mini" @click="handleAdd(scope.$index, scope.row)">添加人员</el-button> -->
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
        <carTaskInfo ref="carTaskInfo" @getListInfo="getListInfo(paramData)" />
        <editCarTask
            ref="editCarTask"
            :task-type-options="taskTypeOptions"
            @getListInfo="getListInfo(paramData)"
            @handleCommand="handleCommand"
        />
        <attendeeList ref="attendeeList" @getListInfo="getListInfo(paramData)" />

        <PickAttendee
            :pick-dialog-visible="pickDialogVisible"
            :attendee-role-flag-equal="[0,1,3,4]"
            @closeDialog="closePickAttendeeDialog"
        />
        <importCarTask :dialog-visible="importDialogVisible" @closeDialog="closeImportDialog" />
        <auditTask @closeDialog="closeAuditDialog" :businessFlag="businessFlag" :isdialog="isAuditDialog" :businessIds="businessIds" :type="1"/>
    </div>
</template>
<script>
import { getVehicleTaskList, deleteVehicleTask, getTaskTypeOptions, cancelVehicleTask, batchPublish, cancelPublish, addVehicleTaskAttendee, exportTask } from '@/api/car'
import editCarTask from './components/editCarTask'
import attendeeList from './components/attendeeList'
import carTaskInfo from './components/carTaskInfo'
import { getYiChengList, getGroupList } from '@/api/car'
import { getDicList } from '@/api/common'
import { getList } from '@/api/attendeeTag'

import { getTableHeight, formatPhone } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
import PickAttendee from '@/views/attendee/components/pickAttendee'
import importCarTask from './components/importCarTask'
import { showLoading, closeLoading } from '@/utils/loading'
import auditTask from "@/components/auditTask.vue"

export default {
    name: 'CarTask',
    components: { editCarTask, attendeeList, PickAttendee, carTaskInfo, importCarTask,auditTask },
    data() {
        return {
            importDialogVisible: false,
            buttons: this.Global.buttons,
            groupIdsIn: [],
            issueDialogText:'',
            businessFlag:null,
            issueDialogLength:0,
            issueDialogVisible:false,
            isAuditDialog:false,
            businessIds:[],
            form: {
                conferenceId: getConferenceId(),
                attendeeNameLike: '',
                phoneLike: '',
                positionLike: '',
                organizationNameLike: '',
                positionLevel: '',
                tagIdsIn: '',
                honourFlag: '',
                groupIdsIn: '',
                platNumLike: '',
                driverNameLike: '',
                attendeePhoneLike: '',
                type: '',
                status: '',
                publish: '',
                vehicleTypeLike: '',
                seatNum: '',
                startTime: '',
                endTime: '',
                startAddressLike: '',
                endAddressLike: '',
                doubleTime: ''
            },
            tagOptions: [],
            groupOptions: [],
            positionLevelOptions: [],
            choosedTaskId: '',
            pickDialogVisible: false,
            taskTypeOptions: [],
            attendeeTypeOptions: [{ id: 0, value: '随员' }, { id: 1, value: '主宾' }],
            statusOptions: [{ id: 100, name: '未发布' }, { id: 99, name: '待审核' },{ id: -1, name: '已取消' }, { id: 0, name: '未开始' }, { id: 1, name: '进行中' }, { id: 2, name: '已完成' }],
            publishOptions: [{ id: '', name: '全部' }, { id: 0, name: '未发布' }, { id: 1, name: '已发布' }],
            vehicleTaskList: [],
            paramData: {
                conferenceId: getConferenceId(),
                pageSize: 10,
                pageNum: 1

            },
            showMoreFlag: false,
            // currentPage: 1,
            // pageSize: 5,
            pageInfo: {
                pageSizeList: [10, 20, 30],
                total: 0
            },

            colorOptions: [],
            tableHeight: getTableHeight(160)
        }
    },
    watch: {
        '$route'() { // 对route进行监控  添加返回时会调用刷新数据
            this.getListInfo(this.paramData)
        },
        'showMoreFlag': {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.tableHeight = getTableHeight(319)
                } else {
                    this.tableHeight = getTableHeight(165)
                }
            }
        },

        'form.doubleTime': {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.form.startTime = newVal[0]
                    this.form.endTime = newVal[1]
                } else {
                    this.form.startTime = ''
                    this.form.endTime = ''
                }
            },
            deep: true,
            immediate: true
        }

    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() { },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.getListInfo(this.paramData)
        this.getTaskTypeOptions()
        this.getGroupOptions()
        this.getTagList()
        this.getPositionLevelOptions()
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
        selectInit(row, index) {
            if (row.publish === 2) {
                return false; // 可勾选
            } else {
                return true; // 不可勾选
            }
        },
        closeImportDialog() {
            this.importDialogVisible = false
            this.getListInfo(this.paramData)
        },
        importCarTask() {
            this.importDialogVisible = true
        },
        getTagList() {
            getList({ conferenceId: getConferenceId() }).then(res => {
                if (res.success) {
                    this.tagOptions = res.result.list
                }
            })
        },
        getPositionLevelOptions() {
            var data = { code: 'positionLevel' }
            getDicList(data).then(res => {
                if (res.success) {
                    this.positionLevelOptions = res.result
                }
            })
        },
        getGroupOptions() {
            getGroupList({ 'conferenceId': getConferenceId() }).then(res => {
                if (res.success) {
                    this.groupOptions = res.result.list
                }
            })
        },
        handleAdd(index, row) {
            this.pickDialogVisible = true
            this.choosedTaskId = row.id
        },
        closePickAttendeeDialog(val) {
            if (val !== null) {
                var attendees = []
                val.forEach(item => {
                    attendees.push({ 'id': item })
                })
                var params = {
                    'taskId': this.choosedTaskId,
                    'attendees': attendees,
                    'conferenceId': getConferenceId()
                }
                console.log(params)
                addVehicleTaskAttendee(params).then(res => {
                    if (res.success) {
                        this.pickDialogVisible = false
                        this.getListInfo(this.paramData)
                    }
                })
            } else {
                this.pickDialogVisible = false
            }
        },
        showAttendeeDialog(index, row) {
            if (row) {
                this.$refs['attendeeList'].showDialog(row)
            }
        },
        batchPublish() {
            var selectedList = this.$refs.table.selection
            if (selectedList.length === 0) {
                this.$message('请选择用车任务')
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
        cancelPublish() {
            var selectedList = this.$refs.table.selection
            if (selectedList.length === 0) {
                this.$message('请选择用车任务')
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
        },
        qiehuanshoujijiami(event) {
            if (event.currentTarget.parentElement.children[1].style.display === 'none') {
                event.currentTarget.parentElement.children[1].style.display = ''
                event.currentTarget.parentElement.children[2].style.display = 'none'
            } else {
                event.currentTarget.parentElement.children[1].style.display = 'none'
                event.currentTarget.parentElement.children[2].style.display = ''
            }
        },
        formatPhone(val) {
            return formatPhone(val)
        },
        handleCommand(command) {
            this.$confirm('请确认是否取消用车任务?', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.cancelSelected(command)
            }).catch(() => { })
        },

        addPerson(index, row) {
            this.$router.push({ path: '/carManager/addAttendee', query: { vehicleTaskId: row.id }})
        },
        showMore() {
            this.showMoreFlag = !this.showMoreFlag
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
        delSelected() {
            var ids = []
            var selectedList = this.$refs.table.selection
            if (selectedList.length == 0) {
                this.$message('至少选择一条记录')
                return
            }
            for (const item of selectedList) {
                ids.push(item.id)
            }
            var params = ids
            console.log(ids)
            deleteVehicleTask(params).then(response => {
                if (response.success) {
                    this.$message('删除成功')
                    this.paramData.pageNum = 1
                    this.getListInfo(this.paramData)
                }
            })
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
            cancelVehicleTask(params).then(response => {
                if (response.success) {
                    this.$message('取消成功')
                    this.getListInfo(this.paramData)
                    this.$refs['editCarTask'].cancelForm()
                }
            })
        },

        handleEdit(index, row) {
            if (row) {
                this.$refs['editCarTask'].showEdit(row)
            } else {
                this.$refs['editCarTask'].showEdit()
            }
        },

        handleTask(index, row) {
            if (row) {
                this.$refs['carTaskInfo'].showDialog(row)
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
            this.form.groupIdsIn = this.groupIdsIn.join(',')
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
            this.groupIdsIn = []
        },
        getListInfo(param) {
            if (param['status'] === 100) {
                param['publish'] = 0
                param['status'] = null
            } else if (param['status'] === 0 || param['status'] === 1 || param['status'] === 2) {
                param['publish'] = 1
            } else if(param['status'] === 99){
                param['publish'] = 2
                param['status'] = null
            } else {
                param['publish'] = null
            }

            getVehicleTaskList(param).then(response => {
                if (response.success) {
                    console.log('vehicleTaskList' + response.result.list)
                    this.vehicleTaskList = response.result.list
                    this.pageInfo.total = response.result.total
                    this.paramData = param
                }
            })
        },
        getTaskTypeOptions() {
            getTaskTypeOptions().then(response => {
                if (response.success) {
                    this.taskTypeOptions = response.result
                    this.taskTypeOptions = this.taskTypeOptions.filter(item => item.valCode !== '4')
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
::v-deep .el-dialog__body{
    margin: 30px 0;
}
</style>
