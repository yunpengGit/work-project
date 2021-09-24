<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:8px">
        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form ref="form" :inline="true" :model="form">
                    <div class="inquire_form">
                    <div class="form_left">
                    <el-form-item label="入住时间" prop="doubleTime">
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

                    <el-form-item label="房间号" prop="roomNoLike">
                        <el-input v-model.trim="form.roomNoLike" size="small" style="width: 80px" />
                    </el-form-item>

                    <el-form-item label="房间状态" prop="hotelId">
                        <el-select
                            v-model="form.fullStatusList"
                            collapse-tags
                            placeholder="全部"
                            value=""
                            multiple
                            clearable
                            style="width:130px"
                        >
                            <el-option :key="0" label="空闲" :value="0" />
                            <el-option :key="1" label="未满" :value="1" />
                            <el-option :key="2" label="已满 " :value="2" />

                        </el-select>
                    </el-form-item>

                    <el-form-item label="房间使用方式" prop="hotelId">
                        <el-select v-model="form.oneself" placeholder="请选择" clearable filterable style="width:120px">
                            <el-option label="全部" value=""/>
                            <el-option :key="0" label="合住" :value="0" />
                            <el-option :key="1" label="单住" :value="1" />

                        </el-select>
                    </el-form-item>
                    </div>
                    <el-form-item class="form_operation">
                        <i class="el-icon-arrow-down" style="margin-right:10px" @click="showMore" />
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                        <el-button @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                    </div>
                    <el-form-item v-show="showMoreFlag" label="容量(人)" prop="remainCount">
                        <el-input v-model.trim="form.remainCount" size="small" style="width: 80px" />
                    </el-form-item>

                    <el-form-item v-show="showMoreFlag" label="酒店" prop="hotelId">
                        <el-select v-model="form.hotelId" placeholder="请选择" clearable filterable style="width:120px">
                            <el-option
                                v-for="item in hotelOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                                @click.native="hotelClick(item)"
                            />
                        </el-select>
                    </el-form-item>

                    <el-form-item v-show="showMoreFlag" label="房型" prop="modelId">
                        <el-select v-model="form.modelId" placeholder="请选择" clearable filterable style="width:120px">
                            <el-option
                                v-for="item in roomFormOptions"
                                :key="item.id"
                                :label="item.modelName"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>

                    <el-form-item v-show="showMoreFlag" label="任务状态" prop="publish">
                        <el-select v-model="form.isPublish" placeholder="全部" clearable style="width:120px">
                            <el-option
                                v-for="item in publishOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>

                </el-form>
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px;">
            <!-- <div style="float: left; padding-bottom:10px; display:inline;"> -->
            <!-- <el-form-item label="房间状态" prop="fullStatusList">
                    <el-checkbox-group v-model="form.fullStatusList" size="mini" @change="fullStatusListClick">
                        <el-checkbox-button :label="0">空闲</el-checkbox-button>
                        <el-checkbox-button :label="1">未满</el-checkbox-button>
                        <el-checkbox-button :label="2">已满</el-checkbox-button>

                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="房间使用方式" prop="oneself">
                    <el-checkbox-group v-model="form.oneself" size="mini" @change="oneselfClick">
                        <el-checkbox-button :label="0">合住</el-checkbox-button>
                        <el-checkbox-button :label="1">单住</el-checkbox-button>
                    </el-checkbox-group>
                </el-form-item> -->
            <div style="float: left; padding-bottom:10px">
                <el-button v-permission="buttons.HotelPlan.batchPublic" type="primary" @click="batchPublish">批量发布
                </el-button>
                <el-button v-permission="buttons.HotelPlan.batchPublic" type="primary" @click="cancelPublish">取消发布
                </el-button>
                <el-dialog
                    :title="`正在${issueDialogText}住宿任务`"
                    :visible.sync="issueDialogVisible"
                    width="400px">
                    <span>
                        共{{issueDialogText}} {{issueDialogLength}}条住宿任务，请确认是否需要上级审核？
                    </span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="issueDialogVisible = false">取 消</el-button>
                        <el-button type="primary" plain @click="issueDialogSubmit">不需要</el-button>
                        <el-button type="primary" @click="issueDialogRatify">需要</el-button>
                    </span>
                </el-dialog>
            </div>
            <div style="float: right;padding-bottom:10px">
                <el-button v-permission="buttons.HotelPlan.import" @click="importHotelTask">导入住宿任务</el-button>
                <el-button v-permission="buttons.HotelPlan.export" @click="exportTask">导出查询结果</el-button>
            </div>
            <el-table
                ref="table"
                tooltip-effect="light"
                :data="roomTaskList"
                style="width: 100%"
                :height="tableHeight+ (this.$store.state.menu.buttons.indexOf(Global.buttons.HotelPlan.batchPublic) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.HotelPlan.import) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.HotelPlan.export) !== -1
                    ? 0: 42)"
                :row-class-name="tableRowClassName"
                :header-cell-style="{
                    background:'#f7f7f7'
                }"
            >
                <el-table-column type="selection" prop="id" :selectable="selectInit"/>
                <el-table-column label="入住时间" width="200px">
                    <template slot-scope="scope">
                        {{ scope.row.startDate }} ~ {{ scope.row.endDate }}
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="startDate" label="开始时间"   />
                <el-table-column prop="endDate" label="结束时间"  > -->
                <el-table-column label="房型 | 床位数" width="120px">
                    <template slot-scope="scope">
                        {{ scope.row.roomFormVO.modelName }} | {{ scope.row.roomFormVO.capacity }}
                    </template>
                </el-table-column>
                <el-table-column label="房间号" prop="roomNo">
                    <template slot-scope="scope">
                        <span v-if="scope.row.roomNo !==null && scope.row.roomNo !=='' ">
                            {{ scope.row.roomNo }}
                        </span>
                        <span v-else>
                            -
                        </span>
                    </template>
                </el-table-column>

                <el-table-column label="房间位置" prop="roomNo" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ formatTableCellData(scope.row.description) }}
                    </template>
                </el-table-column>

                <el-table-column label="已使用|剩余床位" width="120px">
                    <template slot-scope="scope">
                        {{ scope.row.totalCount-scope.row.remainCount }}|{{ 0 > scope.row.remainCount ? 0: scope.row.remainCount }}
                    </template>
                </el-table-column>
                <el-table-column label="房间状态">
                    <template slot-scope="scope">
                        {{ scope.row.fullStatusStr }}
                    </template>
                </el-table-column>
                <el-table-column label="使用方式">
                    <template slot-scope="scope">
                        {{ scope.row.oneself===0 ? "合住" : "单住" }}
                    </template>
                </el-table-column>
                <el-table-column label="酒店" prop="roomFormVO.hotelVO.name" />
                <el-table-column label="任务状态">
                    <template slot-scope="scope">
                        {{ changePublishStatus(scope.row.publish) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300px" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            v-permission="buttons.HotelPlan.addAttendee"
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)"
                        >添加住宿人员</el-button>
                        <el-button size="mini" @click="handleView(scope.$index, scope.row)">查看住宿人员</el-button>
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
        <editHotelTask ref="editHotelTask" @getListInfo="getListInfo(paramData)" @handleCommand="handleCommand" />

        <viewHotelTask ref="viewHotelTask" @getListInfo="getListInfo(paramData)" @handleCommand="handleCommand" />
        <importHotelTask :dialog-visible="importDialogVisible" @closeDialog="closeImportDialog" />
        <auditTask @closeDialog="closeAuditDialog" :businessFlag="businessFlag" :isdialog="isAuditDialog" :businessIds="businessIds" :type="2"/>
    </div>
</template>
<script>
import { cancelPublish, getRoomTaskList, getRoomFormList, getHotelList, batchPublish, exportTask, getRoomFormByHotelId } from '@/api/hotel'
import editHotelTask from './components/editHotelTask'
import viewHotelTask from './components/viewHotelTask'
import { getTableHeight, getSubtDate } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
import importHotelTask from './components/importHotelTask'
import { showLoading, closeLoading } from '@/utils/loading'
import auditTask from "@/components/auditTask.vue"

export default {
    name: 'CarTask',
    components: { editHotelTask, viewHotelTask, importHotelTask,auditTask },
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
                fullStatusList: [],
                oneself: [],
                doubleTime: [],
                modelId: '',
                roomNoLike: '',
                hotelId: '',
                remainCount: '',
                startDate: '',
                endDate: '',
                isPublish: ''
            },
            roomTaskList: [],
            paramData: {
                conferenceId: getConferenceId(),
                pageSize: 10,
                pageNum: 1

            },
            showMoreFlag: false,
            roomFormOptions: '',
            hotelOptions: '',

            pageInfo: {
                pageSizeList: [10, 20, 30],
                total: 0
            },

            tableHeight: getTableHeight(168),
            publishOptions: [{ id: '', name: '全部' }, { id: 0, name: '未发布' },{ id: 2, name: '待审核' }, { id: 1, name: '已发布' }]
        }
    },
    watch: {
        '$route'() { // 对route进行监控  添加返回时会调用刷新数据
            this.getListInfo(this.paramData)
        },
        'showMoreFlag': {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.tableHeight = getTableHeight(211)
                } else {
                    this.tableHeight = getTableHeight(165)
                }
            }
        },

        'form.doubleTime': {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.form.startDate = newVal[0]
                    this.form.endDate = newVal[1]
                } else {
                    this.form.startDate = ''
                    this.form.endDate = ''
                }
            },
            deep: true,
            immediate: true
        },
        'form.hotelId': {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.getRoomFormOptions()
                }
            }
        }

    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() { },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.getRoomFormOptions()
        this.getHotelOptions()
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

        hotelClick(item) {
            this.form.modelId = ''
            this.getRoomFormByHotelId(item.id)
        },
        selectInit(row, index) {
            if (row.publish === 2) {
                return false; // 可勾选
            } else {
                return true; // 不可勾选
            }
        },
        getRoomFormByHotelId(val) {
            getRoomFormByHotelId({ 'hotelId': val }).then(res => {
                if (res.success) {
                    this.roomFormOptions = res.result
                }
            })
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

        closeImportDialog() {
            this.importDialogVisible = false
            this.getListInfo(this.paramData)
        },
        importHotelTask() {
            this.importDialogVisible = true
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
        // 批量取消发布
        cancelPublish() {
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
            // var param = []
            // var selectedList = this.$refs.table.selection
            // for (const item of selectedList) {
            //     param.push({ 'startDate': item.startDate, 'endDate': item.endDate, 'roomId': item.roomId })
            // }
            if(this.issueDialogText==='发布'){
              var param = []
              var selectedList = this.$refs.table.selection
              if (selectedList.length === 0) {
                this.$message('至少选择一条记录')
                return false
              }

              for (const item of selectedList) {
                param.push({ 'startDate': item.startDate, 'endDate': item.endDate, 'roomId': item.roomId })
              }

              batchPublish(param).then(response => {
                if (response.success) {
                  this.$message('发布成功')
                  this.issueDialogVisible=false;
                  this.getListInfo(this.paramData)
                }
              })
            }else{
              var param = []
              var selectedList = this.$refs.table.selection
              if (selectedList.length === 0) {
                this.$message('至少选择一条记录')
                return false
              }

              for (const item of selectedList) {
                param.push({ 'startDate': item.startDate, 'endDate': item.endDate, 'roomId': item.roomId })
              }

              cancelPublish(param).then(response => {
                if (response.success) {
                  this.$message('取消发布成功')
                  this.issueDialogVisible=false;
                  this.getListInfo(this.paramData)
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

        fullStatusListClick(val) {
            this.onSubmit()
        },
        oneselfClick(val) {
            this.onSubmit()
        },
        handleCommand(command) {
            this.$confirm('请确认是否取消任务？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.cancelSelected(command)
            }).catch(() => { })
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
                    this.$refs['editHotelTask'].cancelForm()
                }
            })
        },

        // 添加住宿人员
        handleEdit(index, row) {
            if (row) {
                this.$refs['editHotelTask'].showEdit(row)
            } else {
                this.$refs['editHotelTask'].showEdit()
            }
        },

        // 查看住宿人员
        handleView(index, row) {
            if (row) {
                this.$refs['viewHotelTask'].showView(row)
            } else {
                this.$refs['viewHotelTask'].showView()
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
            this.form = this.$options.data().form
            this.$refs[form].resetFields()
        },
        getListInfo(param) {
            getRoomTaskList(param).then(response => {
                if (response.success) {
                    console.log('roomTaskList' + response.result.list)
                    // 不需要减一天了 直接显示接口中返回数据
                    // response.result.list.forEach(item => {
                    //     // item.endDate = getSubtDate(item.endDate, 0)
                    //     item.endDateStr = getSubtDate(item.endDate, 0)
                    // })

                    this.roomTaskList = response.result.list
                    this.pageInfo.total = response.result.total
                    this.paramData = param
                }
            })
        },
        getRoomFormOptions() {
            getRoomFormList({ conferenceId: getConferenceId() }).then(response => {
                if (response.success) {
                    this.roomFormOptions = response.result.list
                    console.log('roomformoptions ' + this.roomFormOptions)
                }
            })
        },
        getHotelOptions() {
            getHotelList({ conferenceId: getConferenceId() }).then(response => {
                if (response.success) {
                    this.hotelOptions = response.result.list
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
