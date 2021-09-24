<template>
    <div>
        <div style="padding-left:8px;padding-right:8px;margin-top:0px">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form ref="form" :inline="true" :model="form">
                    <div class="inquire_form">
                    <div class="form_left">
                    <el-form-item label="证件名称" prop="cardNameLike">
                        <el-input v-model.trim="form.cardNameLike" size="small" type="text" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="证件状态" prop="cardStatus">
                        <el-select v-model="form.cardStatus" placeholder="全部" clearable style="width:120px" filterable>
                            <el-option
                                v-for="item in cardStatusOptions"
                                :key="item.enumKey"
                                :label="item.enumValue"
                                :value="item.enumKey"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="姓名" prop="attendeeNameLike">
                        <el-input v-model.trim="form.attendeeNameLike" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="手机" prop="phoneLike">
                        <el-input v-model.trim="form.phoneLike" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="单位名称" prop="organizationNameLike">
                        <el-input v-model.trim="form.organizationNameLike" size="small" style="width: 120px" />
                    </el-form-item>
                    </div>
                    <el-form-item class="form_operation">
                        <i class="el-icon-arrow-down" style="margin-right:10px" @click="showMore" />
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                        <el-button @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                    </div>
                    <el-form-item v-show="showMoreFlag" label="任务状态" prop="publish">
                        <el-select v-model="form.publish" placeholder="全部" clearable style="width:120px">
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
            <div style="float: left; padding-bottom:10px">
                <el-button v-permission="buttons.CardPlan.changeAttendee" type="primary" @click="handleDialog">调整证件状态
                </el-button>
                <el-button v-permission="buttons.CardPlan.attendeeBatchPublish" type="primary" @click="batchPublish">
                    批量发布</el-button>
                <el-button v-permission="buttons.CardPlan.attendeeBatchPublish" type="primary" @click="cancelPublish">
                    取消发布</el-button>
                <el-dialog
                    :title="`正在${issueDialogText}制证任务`"
                    :visible.sync="issueDialogVisible"
                    width="400px">
                    <span>
                        共{{issueDialogText}} {{issueDialogLength}}条制证任务，请确认是否需要上级审核？
                    </span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="issueDialogVisible = false">取 消</el-button>
                        <el-button type="primary" plain @click="issueDialogSubmit">不需要</el-button>
                        <el-button type="primary" @click="issueDialogRatify">需要</el-button>
                    </span>
                </el-dialog>
            </div>
            <div style="float: right;padding-bottom:10px">
                <el-button v-permission="buttons.CardPlan.addAttendee" type="primary" @click="handleEdit">添加嘉宾证
                </el-button>
                <el-button v-permission="buttons.CardPlan.importAttendee" @click="importAttendeeCard">导入嘉宾证信息
                </el-button>
                <el-button v-permission="buttons.CardPlan.exportAttendee" @click="exportTaskAttendee">导出查询结果
                </el-button>
            </div>
            <!-- 
                :height="tableHeight+ (this.$store.state.menu.buttons.indexOf(Global.buttons.CardPlan.changeAttendee) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.CardPlan.attendeeBatchPublish) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.CardPlan.addAttendee) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.CardPlan.exportAttendee) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.CardPlan.importAttendee) !== -1
                    ? 0: 42)"
             -->
            <!-- <div style="width:100%;height:670px;"> -->
            <el-table
                ref="table"
                :data="attendeeCardTaskList"
                 :height="tableHeight+ (this.$store.state.menu.buttons.indexOf(Global.buttons.CardPlan.changeAttendee) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.CardPlan.attendeeBatchPublish) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.CardPlan.addAttendee) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.CardPlan.exportAttendee) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.CardPlan.importAttendee) !== -1
                    ? 0: 32)"
                style="width: 100%"
                :row-class-name="tableRowClassName"
                :header-cell-style="{
                    background:'#f7f7f7'
                }"
            >
                <el-table-column type="selection" prop="id" :selectable="selectInit"/>
                <el-table-column label="证件名称">
                    <template slot-scope="scope">
                        <div v-if="scope.row.card!=null && scope.row.card!=''">
                            {{ scope.row.card.cardName }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="证件状态">
                    <template slot-scope="scope">
                        <div v-if="scope.row.card!=null && scope.row.card!=''">
                            {{ scope.row.card.cardStatusStr }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="姓名" align="left">
                    <template slot-scope="scope">
                        <!-- <div style="height:32px">
                            <img style="width:32px;height:32px;float:left;border-radius:50%"
                                :src="imagePath + (scope.row.attendee.fixAttributeVO.photoUrl!== null && scope.row.attendee.fixAttributeVO.photoUrl !== '' ? scope.row.attendee.fixAttributeVO.photoUrl : defaultPhoto)">
                            <span style="margin-top:8px;margin-left:5px;float:left"
                                :title="scope.row.attendee.fixAttributeVO.attendeeName">{{ scope.row.attendee.fixAttributeVO.attendeeName != null && scope.row.attendee.fixAttributeVO.attendeeName.length > 4 ? scope.row.attendee.fixAttributeVO.attendeeName.substr(0,4) + '...' : scope.row.attendee.fixAttributeVO.attendeeName }}</span>
                            <span v-if="scope.row.attendee.fixAttributeVO.honourFlag === 1"
                                style="margin-top:8px;float:left">（主宾）</span>
                            <span v-else style="margin-top:8px;float:left">（随员）</span>
                        </div> -->
                        <span :title="scope.row.attendee.fixAttributeVO.attendeeName">
                            {{ scope.row.attendee.fixAttributeVO.attendeeName != null && scope.row.attendee.fixAttributeVO.attendeeName.length > 4 ? scope.row.attendee.fixAttributeVO.attendeeName.substr(0,6) + '...' : scope.row.attendee.fixAttributeVO.attendeeName }}</span>
                        <span v-if="scope.row.attendee.fixAttributeVO.honourFlag === 1">（主宾）</span>
                        <span v-else>（随员）</span>
                    </template>
                </el-table-column>
                <el-table-column label="手机">
                    <template slot-scope="scope">
                        <PhoneEncryption :value="scope.row.attendee.fixAttributeVO.phone" />
                        <!-- <div>
                            <span>{{ formatPhone(scope.row.attendee.fixAttributeVO.phone) }}</span>
                            <span style="display:none">{{ scope.row.attendee.fixAttributeVO.phone }}</span>
                            <el-button icon="el-icon-view" type="text" @click="(event) => qiehuanshoujijiami(event)" />
                        </div> -->
                    </template>
                </el-table-column>

                <el-table-column label="单位简称/全称">

                    <template slot-scope="scope">
                        <div>
                            {{ formatTableCellData(formatOrgName(scope.row.card.organizationSortName,scope.row.card.organizationName) ) }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="任务状态"  width="220">
                    <template slot-scope="scope">
                        <div v-if="scope.row.card.publish===1">
                            已发布
                        </div>
                        <div v-else-if="scope.row.card.publish===2">
                            待审核
                        </div>
                        <div v-else>
                            未发布
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="220" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            v-permission="buttons.CardPlan.editAttendee"
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑嘉宾证</el-button>
                    </template>
                </el-table-column>
            </el-table>
             <!-- </div> -->
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
        <editAttendeeCard
            ref="editAttendeeCard"
            :card-status-options="cardStatusOptions"
            @getListInfo="getListInfo(paramData)"
        />
        <changeStatusDialog
            ref="changeStatusDialog"
            :card-status-options="cardStatusOptions"
            @updateCardStatus="updateAttendeeCardStatus"
        />
        <importAttendeeCardRes :dialog-visible="importDialogVisible" @closeDialog="closeImportDialog" />
        <auditTask @closeDialog="closeAuditDialog" :businessFlag="businessFlag" :isdialog="isAuditDialog" :businessIds="businessIds" :type="4"/>
    </div>
</template>

<script>
import editAttendeeCard from './editAttendeeCard'
import changeStatusDialog from './changeStatusDialog'
import { cancelPublish, getAttendeeCardTaskList, updateAttendeeCardStatus, getCardStatusOptions, batchPublish, exportTaskAttendee } from '@/api/card'
import { getTableHeight, formatPhone } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
import importAttendeeCardRes from './importAttendeeCardRes'
import { showLoading, closeLoading } from '@/utils/loading'
import auditTask from "@/components/auditTask.vue"

export default {
    name: 'AttendeeCardTaskList',
    components: { editAttendeeCard, changeStatusDialog, importAttendeeCardRes,auditTask },
    props: {
        cardStatusOptions: {
            type: Array,
            default: ''
        },
        flagNum: {
            type: Number
        }
    },
    data() {
        return {
            issueDialogText:'',
            issueDialogLength:0,
            businessFlag:null,
            issueDialogVisible:false,
            isAuditDialog:false,
            importDialogVisible: false,
            buttons: this.Global.buttons,
            businessIds:[],
            form: {
                conferenceId: getConferenceId(),
                cardNameLike: '',
                cardStatus: '',
                publish: '',
                attendeeNameLike: '',
                phoneLike: '',
                organizationNameLike: ''
            },
            paramData: {
                conferenceId: getConferenceId(),
                pageSize: 10,
                pageNum: 1
                //   attendeeRoleFlagEqual:[0,1,2]    //这个未涉及hanyang的多条件查询 可以不用传入attendeeRoleFlagEqual
            },
            pageInfo: {
                pageSizeList: [10, 20, 30],
                total: 0
            },
            attendeeCardTaskList: [],
            tableHeight: getTableHeight(215),
            imagePath: getOssBaseUrl(),
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
            showMoreFlag: false,
            publishOptions: [{ id: '', name: '全部' }, { id: 0, name: '未发布' },{ id: 2, name: '待审核' }, { id: 1, name: '已发布' }]
        }
    },
    watch: {
        'showMoreFlag': {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.tableHeight = getTableHeight(265)
                } else {
                    this.tableHeight = getTableHeight(215)
                }
            }
        },
        'flagNum': {
            handler(newVal) {
                if (newVal) {
                    // setTimeout(() => {
                        this.$refs.table.doLayout() 
                    // });
                }
            }
        }
        // '$route' () {  // 对route进行监控  添加返回时会调用刷新数据
        //     this.getListInfo()

        // }

    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() { },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.getListInfo(this.paramData)
        this.$nextTick(() => { 
            // this.$refs.table.doLayout() 
            console.log(this.$refs.table)
        })
        window.addEventListener('resize', this.computedTable)
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
        computedTable() {
            setTimeout(() => {
                this.$refs.table.doLayout() 
            });
        },
        exportTaskAttendee() {
            const load = showLoading()
            var tempData = JSON.parse(JSON.stringify(this.paramData))
            tempData.pageSize = null
            tempData.pageNum = null
            exportTaskAttendee(tempData).then(res => {
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
            if (row.card.publish === 2) {
                return false; // 可勾选
            } else {
                return true; // 不可勾选
            }
        },
        closeImportDialog() {
            this.importDialogVisible = false
            this.getListInfo(this.paramData)
        },
        importAttendeeCard() {
            this.importDialogVisible = true
        },
        showMore() {
            this.showMoreFlag = !this.showMoreFlag
        },
        updateAttendeeCardStatus(param) {
            updateAttendeeCardStatus(param).then(res => {
                if (res.success) {
                    this.$message('证件状态修改成功')
                    this.getListInfo(this.paramData)
                    this.$refs['changeStatusDialog'].closeDialog()
                }
            })
        },

        handleDialog() {
            var selectedList = this.$refs.table.selection
            if (selectedList.length > 0) {
                this.$refs['changeStatusDialog'].showDialog(selectedList)
            } else {
                this.$message('至少选择一条数据')
            }
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
            var params = {
                ids: ids.join(',')
            }
            console.log(ids)
            // deleteCompany(this.$qs.stringify(params)).then(response => {
            //     if (response.success) {
            //         this.$message("删除成功")
            //         this.getListInfo(this.paramData)
            //     }
            // })
        },

        handleEdit(index, row) {
            if (row) {
                this.$refs['editAttendeeCard'].showEdit(row)
            } else {
                this.$refs['editAttendeeCard'].showEdit()
            }
        },
        handleDelete(index, row) {
            var params = {
                ids: row.id
            }
            // deleteCompany(this.$qs.stringify(params)).then(response => {
            //     if (response.success) {
            //         this.$message("删除成功")
            //         this.getListInfo(this.paramData)
            //     }
            // })
        },
        tableRowClassName({ row, rowIndex }) {
            const index = rowIndex + 1
            if (index % 2 == 0) {
                return 'warning-row'
            }
        },
        onSubmit() {
            var params = this.form
            for (var key in params) {
                if (params[key] === '') {
                    delete params[key]
                }
            }
            params['pageSize'] = this.paramData.pageSize
            params['pageNum'] = 1
            //   params['attendeeRoleFlagEqual']=[0,1,2]    //这个未涉及hanyang的多条件查询 可以不用传入attendeeRoleFlagEqual
            this.getListInfo(params)
        },
        resetForm(form) {
            this.$refs[form].resetFields()
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done()
                    this.resetForm('form')
                    this.dialog = false
                })
                .catch(_ => { })
        },

        getListInfo(param) {
            getAttendeeCardTaskList(param).then(response => {
                if (response.success) {
                    console.log('attendeeCardTaskList' + response.result.list)
                    this.attendeeCardTaskList = response.result.list
                    this.pageInfo.total = response.result.total

                    this.paramData = param
                    
                }
            })
        },
        // 批量发布
        batchPublish() {
            var selectedList = this.$refs.table.selection
            if (selectedList.length == 0) {
                this.$message('至少选择一条记录')
                return
            }
            console.log(selectedList,'selectedList')
            this.businessIds = []
            for (const item of selectedList) {
                if(item.card.publish!==1){
                    this.businessIds.push(item.card.cardAttendeeId)
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
            if (selectedList.length == 0) {
                this.$message('至少选择一条记录')
                return
            }
            this.businessIds = []
             for (const item of selectedList) {
                if(item.card.publish!==0){
                    this.businessIds.push(item.card.cardAttendeeId)
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
            var selectedList = this.$refs.table.selection
            const obj = { 'cardAttendeeList': selectedList }
            if(this.issueDialogText==='发布'){
                batchPublish(obj).then(response => {
                if (response.success) {
                    this.$message('发布成功')
                    this.getListInfo(this.paramData)
                    this.issueDialogVisible=false;
                }
            })
            }else{
                cancelPublish(obj).then(response => {
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

    }
}
</script>

<style lang='scss' scoped >
// ::v-deep .el-table tr {
//   background: #c0c0c0;
// } // 单数行的颜色

::v-deep .el-table .warning-row {
    background: #f7f7f7;
}
::v-deep .el-dialog__body{
    margin: 30px 0;
}
// ::v-deep .el-table__fixed-right .el-table__fixed-body-wrapper{
//     top:37px !important;
// }
</style>
