<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:8px" class="canhuirenTaabClass">
        <el-tabs v-model="activeName" style="background-color: white;padding-left:10px">
            <el-tab-pane name="tripUpdate">
                <span slot="label">行程变更审核
                    <el-badge
                        :value="total4"
                        :class="total4 > 0 ? 'hongdianShowClass' : 'hongdianHideClass'"
                        style="margin-top:5px;margin-left:3px"
                    />
                </span>
            </el-tab-pane>
            <el-tab-pane name="askForLeave">
                <span slot="label">请假审核
                    <el-badge
                        :value="total5"
                        :class="total5 > 0 ? 'hongdianShowClass' : 'hongdianHideClass'"
                        style="margin-top:5px;margin-left:3px"
                    />
                </span>
            </el-tab-pane>
        </el-tabs>
        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form :inline="true" :model="pageInfo">
                    <div class="inquire_form">
                    <div class="form_left">
                    <el-form-item label="姓名">
                        <el-input
                            v-model.trim="pageInfo.attendeeNameLike"
                            class="widthClass keepOutRight"
                            maxlength="25"
                            placeholder=""
                        />
                    </el-form-item>
                    
                    <el-form-item label="手机">
                        <el-input v-model.trim="pageInfo.phoneLike" class="widthClass keepOutRight" maxlength="25" placeholder="" />
                    </el-form-item>

                    <el-form-item label="职务">
                        <el-input v-model.trim="pageInfo.positionLike" class="widthClass keepOutRight" maxlength="25" placeholder="" />
                    </el-form-item>

                    <el-form-item label="单位名称">
                        <el-input
                            v-model.trim="pageInfo.allOrganizationNameLike"
                            class="widthClass keepOutRight"
                            maxlength="25"
                            placeholder=""
                        />
                    </el-form-item>
                    </div>
                    <el-form-item class="form_operation">
                        <el-button
                            :class="dakaichaxunClass === 1 ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
                            type="text"
                            style="margin-left:10px;margin-right:5px"
                            @click="dakaichaxun"
                        />
                        <el-button type="primary" @click="search">查询</el-button>
                        <el-button @click="resetSearch">重置</el-button>
                        
                    </el-form-item>
                    </div>
                    <!-- <el-form-item v-if="dakaichaxunClass === 0" label="标签">
                        <el-select v-model="pageInfo.tagIdsIn" class="width100Class" placeholder="全部" clearable>
                            <el-option
                                v-for="item in tagList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item> -->
                    <br v-show="dakaichaxunClass === 0">
                    <el-form-item v-if="dakaichaxunClass === 0" label="职级" clearable>
                        <el-select v-model="pageInfo.positionLevel" class="width100Class" placeholder="全部" clearable>
                            <el-option
                                v-for="item in positionLevels"
                                :key="item.valCode"
                                :label="item.valName"
                                :value="item.valCode"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" :label="getConferenceTemplate(2) + '类型'">
                        <el-select v-model="pageInfo.honourFlag" class="width100Class" placeholder="全部" clearable>
                            <el-option :key="1" label="主宾" :value="1" />
                            <el-option :key="0" label="随员" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0 && pageInfo.honourFlag === 0" label="主宾姓名">
                        <el-input
                            v-model.trim="pageInfo.honourNameLike"
                            class="width100Class keepOutRight"
                            maxlength="25"
                            placeholder=""
                        />
                    </el-form-item>
                    <el-form-item
                        v-if="dakaichaxunClass === 0 && conferenceView.setAgendaFlag === 1"
                        :label="getConferenceTemplate(1) + '议程'"
                    >
                        <el-cascader
                            v-model="pageInfo.agendaIdsIn"
                            style="width: 150px"
                            placeholder="全部"
                            class="widthClass"
                            :options="agendas"
                            clearable
                            collapse-tags
                            :props="{
                                emitPath: false,
                                multiple: true,
                                checkStrictly: true,
                                'label': 'name',
                                'value': 'id'
                            }"
                        />

                    </el-form-item>
                    <!-- <el-form-item v-if="dakaichaxunClass === 0" label="资源分配情况">
                        <el-select v-model="pageInfo.synergyStatus" class="width100Class" placeholder="全部" clearable>
                            <el-option :key="1" label="完成" :value="1" />
                            <el-option :key="0" label="未完成" :value="0" />
                        </el-select>
                    </el-form-item> -->
                </el-form>
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
            <div style="float: left; text-center: left;padding-bottom:10px;">
                <!-- <el-button type="primary" @click="ex"></el-button> -->
                <el-dropdown
                    v-show="this.$store.state.menu.buttons.indexOf(Global.buttons.AttendeeChangeQuery.addTag) !== -1 ||
                        this.$store.state.menu.buttons.indexOf(Global.buttons.AttendeeChangeQuery.check) !== -1"
                    @command="handleCommand"
                >
                    <el-button type="primary">
                        批量操作
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-permission="Global.buttons.AttendeeChangeQuery.addTag" command="dabiaoqian">
                            打标签</el-dropdown-item>
                        <el-dropdown-item v-permission="Global.buttons.AttendeeChangeQuery.check" command="shenhe">审核
                        </el-dropdown-item>
                        <!-- <el-dropdown-item command="shenhetongguo">审核通过</el-dropdown-item>
                        <el-dropdown-item command="shenhebutongguo">审核不通过</el-dropdown-item> -->
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div style="float: right; text-center: right;padding-bottom:10px;">
                <el-dropdown @command="shaixuan">
                    <el-button>
                        列表筛选<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                            command="moren"
                            :class="!allColumnFlag ? 'isActiveClass' : 'isNotActiveClass'"
                        >默认列表</el-dropdown-item>
                        <el-dropdown-item
                            command="quanbu"
                            :class="allColumnFlag ? 'isActiveClass' : 'isNotActiveClass'"
                        >全部列表</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <el-table
                ref="table"
                :data="tableData"
                :height="(dakaichaxunClass === 0 ? (tableHeight - 52) : tableHeight)"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" />
                <!-- width="180" -->
                <el-table-column prop="name" label="姓名" :min-width="200">
                    <template slot-scope="scope">
                        <AttendeeInfomation :accompany-flag="1" :accompany-totips="scope.row.attendee.linkAttendeeList" :photo-url="scope.row.attendee.ssoUserPhoto" :attendee-name="scope.row.attendee.fixAttributeCommonVO.attendeeName" :attendee-role-flag="scope.row.attendee.fixAttributeCommonVO.attendeeRoleFlag" :honour-flag="scope.row.attendee.fixAttributeCommonVO.honourFlag" :sex="scope.row.attendee.fixAttributeCommonVO.sex" />
                    </template>
                </el-table-column>
                <!-- width="200" -->
                <el-table-column
                    v-if="conferenceView.useVehicleFlag === 1 || conferenceView.useCardFlag === 1
                        || conferenceView.useDinnerFlag === 1 || conferenceView.useRoomFlag === 1"
                    prop="name"
                    label="资源分配情况"
                >
                    <template slot-scope="scope">
                        <span
                            v-if="conferenceView.useVehicleFlag !== 1
                                && conferenceView.useCardFlag !== 1
                                && conferenceView.useDinnerFlag !== 1
                                && conferenceView.useRoomFlag !== 1"
                        >
                            -
                        </span>
                        <el-tag
                            v-if="conferenceView.useVehicleFlag === 1 && scope.row.attendee.vehicleStatus === 2"
                            style="background-color:#00B194;color:white"
                            type="info"
                        >车</el-tag>
                        <el-tag
                            v-if="conferenceView.useVehicleFlag === 1 && scope.row.attendee.vehicleStatus !== 2"
                            type="info"
                        >车</el-tag>

                        <el-tag
                            v-if="conferenceView.useCardFlag === 1 && scope.row.attendee.ticketStatus === 2"
                            style="background-color:#00B194;color:white"
                            type="info"
                        >票</el-tag>
                        <el-tag
                            v-if="conferenceView.useCardFlag === 1 && scope.row.attendee.ticketStatus !== 2"
                            type="info"
                        >票</el-tag>

                        <el-tag
                            v-if="conferenceView.useDinnerFlag === 1 && scope.row.attendee.foodStatus === 2"
                            style="background-color:#00B194;color:white"
                            type="info"
                        >餐</el-tag>
                        <el-tag
                            v-if="conferenceView.useDinnerFlag === 1 && scope.row.attendee.foodStatus !== 2"
                            type="info"
                        >餐</el-tag>

                        <el-tag
                            v-if="conferenceView.useRoomFlag === 1 && scope.row.attendee.stayStatus === 2"
                            style="background-color:#00B194;color:white"
                            type="info"
                        >房</el-tag>
                        <el-tag
                            v-if="conferenceView.useRoomFlag === 1 && scope.row.attendee.stayStatus !== 2"
                            type="info"
                        >房</el-tag>

                    </template>
                </el-table-column>
                <el-table-column label="职务">
                    <template slot-scope="scope">
                        <div :title="scope.row.attendee.fixAttributeCommonVO.position">
                            {{ formatTableCellData(scope.row.attendee.fixAttributeCommonVO.position) }}</div>
                    </template>
                </el-table-column>
                <!-- width="120" -->
                <el-table-column label="手机" min-width="120px">
                    <template slot-scope="scope">
                        <PhoneEncryption :value="scope.row.attendee.fixAttributeCommonVO.phoneForMsg" />
                        <!-- <div>
                            <span>{{ formatTableCellData(formatPhone(scope.row.attendee.fixAttributeCommonVO.phoneForMsg)) }}</span>
                            <span style="display:none">{{ scope.row.attendee.fixAttributeCommonVO.phoneForMsg }}</span>
                            <svg-icon v-show="scope.row.attendee.fixAttributeCommonVO.phoneForMsg !== null && scope.row.attendee.fixAttributeCommonVO.phoneForMsg !== ''" class="biyan" @click="(event) => qiehuanshoujijiami(event)" />
                        </div> -->
                    </template>
                </el-table-column>
                <!-- width="120" -->
                <el-table-column prop="fixAttributeCommonVO.organizationSortName" label="单位简称/全称">
                    <template slot-scope="scope">
                        <div>
                            {{ formatOrgName(scope.row.attendee.fixAttributeCommonVO.organizationSortName,scope.row.attendee.fixAttributeCommonVO.organizationName) }}
                        </div>
                    </template>
                </el-table-column>
                <!-- width="250" -->
                <el-table-column label="变更信息">
                    <template slot-scope="scope">
                        <div v-if="activeName === 'tripUpdate'">
                            <el-tooltip placement="bottom" effect="light">
                                <div slot="content">
                                    {{ formatChangeBefore(scope.row.changeContent) }}<br>
                                    {{ formatChangeAfter(scope.row.changeContent) }}
                                </div>
                                <div class="danhangxianshibuquan">
                                    {{ formatChangeAfter(scope.row.changeContent) }}
                                </div>
                            </el-tooltip>
                        </div>
                        <div v-else>
                            <el-tooltip placement="bottom" effect="light">
                                <div slot="content">
                                    {{ formatLeave(scope.row.changeContent) }}<br>
                                </div>
                                <div class="danhangxianshibuquan">{{ formatLeave(scope.row.changeContent) }}</div>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <AttendeeAllColumn v-if="allColumnFlag" :all-column-list="allColumnList" :attendee-flag="2" />
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="edit(scope.row)">
                            查看详情
                        </el-button>
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
        <el-dialog
            title="审核不通过"
            width="30%"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="closeDialog"
        >
            <el-form
                ref="examineForm"
                :model="examineForm"
                :rules="examineRules"
                label-width="60px"
                class="demo-ruleForm"
            >
                <el-form-item
                    label="原因"
                    prop="verifyReason"
                    :rules="[
                        { required: true, message: '请输入审核不通过原因', trigger: 'blur' }
                    ]"
                >
                    <el-input
                        v-model="examineForm.verifyReason"
                        type="textarea"
                        :rows="4"
                        show-word-limit
                        maxlength="300"
                        placeholder="请填写审核不通过原因"
                    />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button :loading="loading" type="primary" @click="returnSubmit">退回</el-button>
                <el-button @click="closeDialog">取消</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="选择标签"
            width="30%"
            :visible.sync="tagDialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="closeTagDialog"
        >
            <el-form ref="tagForm" :model="tagForm" :rules="tagRules" label-width="100px" class="demo-ruleForm">
                <el-form-item label="请选择标签" prop="tagId">
                    <el-select v-model="tagForm.tagId" placeholder="请选择标签" style="width: 100%">
                        <el-option v-for="item in tagList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="tagSubmit">提交</el-button>
                <el-button @click="closeTagDialog">取消</el-button>
            </span>
        </el-dialog>

        <el-dialog title="请选择您要执行的操作" :visible.sync="centerDialogVisible" width="25%">

            <!-- <span style="padding-bottom:10px">请选择您要执行的操作</span> -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="shenhebutongguo">审核不通过</el-button>
                <el-button type="primary" @click="shenhetongguo">审核通过</el-button>
                <el-button @click="centerDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <TaskHand
            :attendee-ids="attendeeIds"
            :dialog-visible="taskDialogVisible"
            :source-type="sourceType"
            @closeDialog="closeXiafarenwu"
        />
    </div>
</template>

<script>
import { getTableHeight, formatPhone, getSourceTypes, getMeetingStatuss } from '@/utils/index'
import { getTaskList, examineBatch } from '@/api/attendee'
import { getOssPublicBaseUrl } from '@/utils/x-sso-publicbaseurl'
import { getConferenceId } from '@/utils/conference-auth'
import { getListNoDate as getListNoDate } from '@/api/agenda'
import { getDicList } from '@/api/common'
import { getList as getTagList } from '@/api/attendeeTag'
import { getView as getConferenceView, getSignConfigAll } from '@/api/conference'
import { insertTagAttendee } from '@/api/attendeeTag'
import TaskHand from '../components/task-hand'
import AttendeeAllColumn from '@/views/attendee/components/attendeeAllColumn'
export default {
    name: 'AttendeeChangeList',
    components: {
        TaskHand,
        AttendeeAllColumn
    },
    props: {
    },
    data() {
        return {
            allColumnList: [],
            allColumnFlag: false,
            ziyuanfenpeiqingkuang: null,
            centerDialogVisible: false,
            sourceType: null,
            attendeeIds: [],
            taskDialogVisible: false,
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
            tagDialogVisible: false,
            tagForm: {
                tagId: null
            },
            tagRules: {
                tagId: [{ required: true, message: '请选择标签', trigger: 'change' }]
            },
            activeName: 'tripUpdate',
            conferenceView: {},
            tagList: [],
            agendas: [],
            positionLevels: [],
            sourceTypes: getSourceTypes(),
            dakaichaxunClass: 1,
            meetingStatuss: getMeetingStatuss(),
            loading: false,
            examineRules: {},
            examineForm: {
                signStatus: 2,
                verifyReason: null
            },
            dialogVisible: false,
            multipleSelection: [],
            conferenceId: getConferenceId(),
            imagePath: getOssPublicBaseUrl(),
            tableData: [],
            total4: 0,
            total5: 0,
            tableHeight: getTableHeight(215),
            pageInfo: {
                synergyStatus: null, // iyuan分配情况
                typeEqual: [4],
                statusFlag: 1,
                // resFlag: 2,
                pageNum: 1,
                pageSize: 10,
                total: 0
            }
        }
    },
    watch: {
        activeName() {
            this.getList4()
            this.getList5()
            this.pageInfo.total = 0
            this.search()
        }
    },
    created() {
        this.getSignConfigAll()
        this.getAgendaList()
        this.getPositionLevels()
        this.getConferenceView()
        this.search()
        this.getList4()
        this.getList5()
        this.getTagList()
    },
    methods: {
        getSignConfigAll() {
            getSignConfigAll({ conferenceId: getConferenceId() }).then(res => {
                if (res.result !== null && res.result.length > 0) {
                    res.result.forEach(item => {
                        if (item.initFlag === 1) {
                            this.allColumnList.push({ 'name': item.fieldLabel, 'code': item.fieldCode })
                        }
                        // this.allColumnList.push({ 'name': item.fieldLabel, 'code': item.fieldCode })
                    })
                } else {
                    this.allColumnList = []
                }
            })
        },
        shenhe() {
            this.centerDialogVisible = true
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
        xiafarenwu(attendeeIds) {
            if (this.conferenceView.useVehicleFlag === 1 || this.conferenceView.useRoomFlag === 1 || this.conferenceView.useCardFlag === 1 || this.conferenceView.useDinnerFlag === 1) {
                this.sourceType = 2
                this.attendeeIds = attendeeIds
                this.taskDialogVisible = true
            }
        },
        closeXiafarenwu() {
            this.taskDialogVisible = false
        },
        closeTagDialog() {
            this.tagDialogVisible = false
            // this.tagForm.tagId = null
            this.$refs['tagForm'].resetFields()
        },
        tagSubmit() {
            this.$confirm('请确认是否提交' + this.getConferenceTemplate(2) + '信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const param = []
                this.multipleSelection.forEach(item => {
                    param.push(item.attendeeId)
                })
                this.tagForm.attendeeIds = param
                this.tagList.forEach(item => {
                    if (item.id === this.tagForm.tagId) {
                        this.tagForm.tagName = item.name
                    }
                })
                insertTagAttendee(this.tagForm).then(res => {
                    if (res.success) {
                        this.getList4()
                        this.getList5()
                        this.search()
                        this.closeTagDialog()
                    }
                })
            }).catch(() => { })
        },
        getConferenceView() { // 获取会议详情
            getConferenceView({ 'id': getConferenceId() }).then(res => {
                this.conferenceView = res.result
            })
        },
        resetSearch() {
            this.pageInfo = {
                synergyStatus: null, // iyuan分配情况
                typeEqual: [4],
                statusFlag: 1,
                // resFlag: 2,
                pageNum: 1,
                pageSize: 10,
                total: 0
            }
        },
        getTagList() {
            getTagList({ 'conferenceId': this.conferenceId }).then(res => {
                this.tagList = res.result.list
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        handleCommand(command) {
            if (command === 'shenhe') {
                if (this.multipleSelection.length === 0) {
                    this.$message('至少选择一条记录')
                    return
                }
                this.shenhe()
            } else if (command === 'dabiaoqian') {
                this.dabiaoqian()
            }
        },
        dabiaoqian() {
            if (this.multipleSelection.length === 0) {
                this.$message('至少选择一条记录')
                return
            }
            this.tagDialogVisible = true
            this.tagForm.tagId = null
        },
        shenhebutongguo() {
            this.dialogVisible = true
            this.examineForm = {
                signStatus: 2,
                verifyReason: null
            }
        },
        shenhetongguo() {
            this.examineForm.signStatus = 3
            this.examineFormSubmitForshenhetongguo()
        },
        gengduo(command) {
            if (command === 'shenhebutongguo') {
                // this.shenhebutongguo()
            } else {
                // this.shenhetongguo()
            }
        },
        getList4() {
            getTaskList({ 'typeEqual': [4], 'statusFlag': 1, 'conferenceId': getConferenceId() }).then(res => {
                this.total4 = res.result.total
            })
        },
        getList5() {
            getTaskList({ 'typeEqual': [5], 'statusFlag': 1, 'conferenceId': getConferenceId() }).then(res => {
                this.total5 = res.result.total
            })
        },
        getList() {
            this.pageInfo.conferenceId = this.conferenceId
            this.pageInfo.hasLinkAttendee = 1
            this.pageInfo.hasLight = 1
            getTaskList(this.pageInfo).then(res => {
                this.tableData = res.result.list
                this.pageInfo.total = res.result.total
            })
        },
        edit(val) {
            // this.$router.push({ name: 'attendeeView' })
            this.$router.push({
                path: `/attendeeManagement/attendee/check/${val.attendeeId}/${val.type}/${val.id}`
            })
        },
        search() {
            this.pageInfo.pageNum = 1
            if (this.activeName === 'tripUpdate') {
                this.pageInfo.typeEqual = [4]
            } else if (this.activeName === 'askForLeave') {
                this.pageInfo.typeEqual = [5]
            }
            this.getList()
        },
        handleCurrentChange(val) {
            this.pageInfo.pageNum = val
            if (this.activeName === 'tripUpdate') {
                this.pageInfo.typeEqual = [4]
            } else if (this.activeName === 'askForLeave') {
                this.pageInfo.typeEqual = [5]
            }
            this.getList()
        },
        handleSizeChange(val) {
            this.pageInfo.pageSize = val
            if (this.activeName === 'tripUpdate') {
                this.pageInfo.typeEqual = [4]
            } else if (this.activeName === 'askForLeave') {
                this.pageInfo.typeEqual = [5]
            }
            this.getList()
        },
        closeDialog() {
            this.dialogVisible = false
            this.examineForm = {
                signStatus: 2,
                verifyReason: null
            }
        },
        examineFormSubmitForshenhetongguo() {
            this.$confirm('请确认是否审核通过该报名信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.centerDialogVisible = false
                const param = []
                this.multipleSelection.forEach(item => {
                    param.push(item.attendeeId)
                })
                this.examineForm.attendeeIds = param

                if (this.activeName === 'tripUpdate') {
                    this.examineForm.auditType = 4
                } else if (this.activeName === 'askForLeave') {
                    this.examineForm.auditType = 5
                }
                examineBatch(this.examineForm).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        this.closeDialog()
                        // this.xiafarenwu(param)
                        this.getList4()
                        this.getList5()
                        this.search()
                    }
                })
            }).catch(() => { })
        },
        examineFormSubmit() {
            this.$confirm('请确认是否审核不通过该报名信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.centerDialogVisible = false
                const param = []
                this.multipleSelection.forEach(item => {
                    param.push(item.attendeeId)
                })
                this.examineForm.attendeeIds = param

                if (this.activeName === 'tripUpdate') {
                    this.examineForm.auditType = 4
                } else if (this.activeName === 'askForLeave') {
                    this.examineForm.auditType = 5
                }
                examineBatch(this.examineForm).then(res => {
                    if (res.success) {
                        this.getList4()
                        this.getList5()
                        this.search()
                        this.$message(res.message)
                        this.closeDialog()
                    }
                })
            }).catch(() => { })
        },
        returnSubmit() {
            this.$refs['examineForm'].validate(valid => {
                if (valid) {
                    this.examineFormSubmit()
                }
            })
        },
        getPositionLevels() { // 获取职级列表
            getDicList({ 'code': 'positionLevel' }).then(response => {
                this.positionLevels = response.result
            })
        },
        getAgendaList() { // 获取会议议程树
            getListNoDate({ 'conferenceId': getConferenceId() }).then(res => {
                this.agendas = res.result
            })
        },
        dakaichaxun() {
            this.dakaichaxunClass = this.dakaichaxunClass === 1 ? 0 : 1
        },
        formatChangeAfter(val) {
            var changeVal = JSON.parse(val)
            var html = ''
            if (changeVal !== null) {
                changeVal.forEach((item, index) => {
                    if (index === 0) {
                        html += '变更后：'
                    }
                    if (item.code !== 'photoUrl') {
                        html += item.attribute + '：' + item.afterValue + ';'
                    } else {
                        html += item.attribute + '：' + '<div></div>' + ';'
                    }
                })
            }
            return html
        },
        formatChangeBefore(val) {
            var changeVal = JSON.parse(val)
            var html = ''
            if (changeVal !== null) {
                changeVal.forEach((item, index) => {
                    if (index === 0) {
                        html += '变更前：'
                    }
                    html += item.attribute + '：' + (item.beforeValue !== undefined ? item.beforeValue : '') + ';'
                })
            }
            return html
        },
        formatLeave(val) {
            var changeVal = JSON.parse(val)
            if (changeVal !== null) {
                var html = '请假类型：' + changeVal.typeStr + ';' + '离会时间：' +
                    (changeVal.leaveTime !== undefined && changeVal.leaveTime !== null && changeVal.leaveTime.length === 19 ? changeVal.leaveTime.substr(0, 16) : changeVal.leaveTime) +
                    ';' + (changeVal.type !== 4 ? ('返回时间：' + (changeVal.returnTime !== undefined && changeVal.returnTime !== null && changeVal.returnTime.length === 19 ? changeVal.returnTime.substr(0, 16) : changeVal.returnTime)) : '') +
                    ';请假原因：' + changeVal.reason

                return html
            }
            return null
        },
        shaixuan(command) {
            if (command === 'quanbu') {
                this.allColumnFlag = true
            } else {
                this.allColumnFlag = false
            }
            this.$nextTick(() => { this.$refs.table.doLayout() })
        }
    }
}
</script>
<style lang="scss" scoped>
.widthClass {
    width: 150px;
}
.hongdianShowClass {
    opacity: 1;
}
.hongdianHideClass {
    opacity: 0;
}
.widthClass {
    width: 120px;
}
.width100Class {
    width: 120px;
}
.danhangxianshibuquan {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
