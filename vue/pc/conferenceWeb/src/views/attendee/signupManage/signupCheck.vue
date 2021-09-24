<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:8px" class="canhuirenTaabClass">
        <el-tabs v-model="activeName" style="background-color: white;">
            <el-tab-pane label="" name="signAdd">
                <span slot="label">报名审核<el-badge :value="total1" :class="total1 > 0 ? 'hongdianShowClass' : 'hongdianHideClass'" style="margin-top:5px;margin-left:3px" /></span>
            </el-tab-pane>
            <el-tab-pane label="" name="signUpdate">
                <span slot="label">报名变更审核<el-badge :value="total2" :class="total2 > 0 ? 'hongdianShowClass' : 'hongdianHideClass'" style="margin-top:5px;margin-left:3px" /></span>
            </el-tab-pane>
            <el-tab-pane label="" name="signCancel">
                <span slot="label">报名取消审核<el-badge :value="total3" :class="total3 > 0 ? 'hongdianShowClass' : 'hongdianHideClass'" style="margin-top:5px;margin-left:3px" /></span>
            </el-tab-pane>
        </el-tabs>
        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form :inline="true" :model="pageInfo">
                    <div class="inquire_form">
                    <div class="form_left">
                    <el-form-item label="姓名">
                        <el-input v-model.trim="pageInfo.attendeeNameLike" class="widthClass" maxlength="25" placeholder="" />
                    </el-form-item>

                    <el-form-item label="手机">
                        <el-input v-model.trim="pageInfo.phoneLike" class="widthClass" maxlength="25" placeholder="" />
                    </el-form-item>
                    <el-form-item label="标签">
                        <el-select v-model="pageInfo.tagIdsIn" class="width100Class" placeholder="全部" clearable>
                            <el-option
                                v-for="item in tagList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                    
                    <el-form-item label="单位名称">
                        <el-input v-model.trim="pageInfo.allOrganizationNameLike" class="widthClass" maxlength="25" placeholder="" />
                    </el-form-item>
                     </div>
                    <el-form-item class="form_operation">
                        <el-button :class="dakaichaxunClass === 1 ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" type="text" style="margin-left:10px;margin-right:5px" @click="dakaichaxun" />
                        <el-button type="primary" @click="search">查询</el-button>
                        <el-button @click="resetSearch">重置</el-button>
                    </el-form-item>
                    </div>

                    <el-form-item v-if="dakaichaxunClass === 0" label="职务">
                        <el-input v-model.trim="pageInfo.positionLike" class="widthClass" maxlength="25" placeholder="" />
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="报名来源" clearable>
                        <el-select v-model="pageInfo.sourceType" class="width100Class" placeholder="全部" clearable>
                            <el-option
                                v-for="item in sourceTypes"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
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
                        <el-input v-model.trim="pageInfo.honourNameLike" class="width100Class" maxlength="25" placeholder="" />
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0 && conferenceView.setAgendaFlag === 1" :label="getConferenceTemplate(1) + '议程'">
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
                    <!-- <el-form-item v-if="dakaichaxunClass === 0" label="报名状态">
                        <el-select v-model="pageInfo.signStatusTemp" class="width100Class" placeholder="全部" clearable>
                            <el-option
                                v-for="item in signStatuss"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item> -->
                    <el-form-item v-if="dakaichaxunClass === 0" label="报名人">
                        <el-input v-model.trim="pageInfo.createUserNameLike" class="width100Class" maxlength="25" placeholder="" />
                    </el-form-item>
                   
                    
                </el-form>
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
            <div style="float: left; text-center: left;padding-bottom:10px;">
                <!-- <el-button type="primary" @click="ex"></el-button> -->
                <el-dropdown
                    v-show="this.$store.state.menu.buttons.indexOf(Global.buttons.SignupCheck.addTag) !== -1 ||
                        this.$store.state.menu.buttons.indexOf(Global.buttons.SignupCheck.check) !== -1"
                    @command="handleCommand"
                >
                    <el-button type="primary">
                        批量操作
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-permission="Global.buttons.SignupCheck.addTag" command="dabiaoqian">打标签</el-dropdown-item>
                        <el-dropdown-item v-permission="Global.buttons.SignupCheck.check" command="shenhe">审核</el-dropdown-item>
                        <!-- <el-dropdown-item command="shenhetongguo">审核通过</el-dropdown-item>
                        <el-dropdown-item command="shenhebutongguo">审核不通过</el-dropdown-item> -->
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div v-if="activeName === 'signAdd'" style="float: right; text-center: left;margin-left:10px;padding-bottom:10px;">
                <el-button v-permission="Global.buttons.SignupQuery.export" @click="exportExcel">导出查询结果</el-button>
            </div>
            <div style="float: right; text-center: right;padding-bottom:10px;">
                <!-- <el-button @click="shaixuan">列表筛选</el-button> -->
                <el-dropdown @command="shaixuan">
                    <el-button>
                        列表筛选<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="moren" :class="!allColumnFlag ? 'isActiveClass' : 'isNotActiveClass'">默认列表</el-dropdown-item>
                        <el-dropdown-item command="quanbu" :class="allColumnFlag ? 'isActiveClass' : 'isNotActiveClass'">全部列表</el-dropdown-item>
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
                <el-table-column
                    type="selection"
                    width="55"
                />
                <!-- width="180" -->
                <el-table-column
                    prop="name"
                    label="姓名"
                    :min-width="200"
                >
                    <template slot-scope="scope">
                        <div style="height:32px">
                            <AttendeeInfomation :accompany-flag="1" :accompany-totips="scope.row.attendee.linkAttendeeList" :photo-url="scope.row.attendee.ssoUserPhoto" :attendee-name="scope.row.attendee.fixAttributeCommonVO.attendeeName" :attendee-role-flag="scope.row.attendee.fixAttributeCommonVO.attendeeRoleFlag" :honour-flag="scope.row.attendee.fixAttributeCommonVO.honourFlag" :sex="scope.row.attendee.fixAttributeCommonVO.sex" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="职务"
                >
                    <template slot-scope="scope">
                        <div :title="scope.row.attendee.fixAttributeCommonVO.position">{{ formatTableCellData(scope.row.attendee.fixAttributeCommonVO.position) }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="标签"
                >
                    <template slot-scope="scope">
                        {{ scope.row.attendee.tagVOs !== null && scope.row.attendee.tagVOs.length > 0 ? '' : '-' }}
                        <el-tag v-for="tagVO in scope.row.attendee.tagVOs" :key="tagVO.id" style="margin-left:4px" :style="{ backgroundColor: tagVO.backgroundColor, color: tagVO.fontColor }" type="info">
                            <el-tooltip placement="bottom" effect="light">
                                <div slot="content">
                                    {{ tagVO.name }}
                                </div>
                                <div class="danhangxianshibuquan">{{ tagVO.name !== null && tagVO.name.length > 5 ? tagVO.name.substr(0,4) + '...' : tagVO.name }}</div>
                            </el-tooltip>
                        </el-tag>
                    </template>
                </el-table-column>
                <!-- width="120" -->
                <el-table-column
                    label="手机"
                    min-width="120px"
                >
                    <template slot-scope="scope">
                        <PhoneEncryption :value="scope.row.attendee.fixAttributeCommonVO.phoneForMsg ? scope.row.attendee.fixAttributeCommonVO.phoneForMsg : scope.row.attendee.fixAttributeCommonVO.phone" />
                        <!-- <div>
                            <span>{{ formatTableCellData(formatPhone(scope.row.attendee.fixAttributeCommonVO.phoneForMsg)) }}</span>
                            <span style="display:none">{{ formatTableCellData(scope.row.attendee.fixAttributeCommonVO.phoneForMsg) }}</span>
                            <el-button v-show="scope.row.attendee.fixAttributeCommonVO.phoneForMsg !== null && scope.row.attendee.fixAttributeCommonVO.phoneForMsg !== ''" icon="el-icon-view" type="text" @click="(event) => qiehuanshoujijiami(event)" />
                        </div> -->
                    </template>
                </el-table-column>
                <!-- width="120" -->
                <el-table-column
                    prop="fixAttributeCommonVO.organizationSortName"
                    label="单位简称/全称"
                >
                    <template slot-scope="scope">
                        <div>{{ formatTableCellData(formatOrgName(scope.row.attendee.fixAttributeCommonVO.organizationSortName, scope.row.attendee.fixAttributeCommonVO.organizationName)) }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="报名来源"
                >
                    <!-- <template slot-scope="scope">
                        <span v-show="scope.row.attendee.sourceType === 1">后台录入</span>
                        <span v-show="scope.row.attendee.sourceType === 2">本人报名</span>
                        <span v-show="scope.row.attendee.sourceType === 3">代报名</span>
                        <span v-show="scope.row.attendee.sourceType === 4">会务组代报名</span>
                    </template> -->
                    <template slot-scope="scope">
                        <span v-show="scope.row.attendee.sourceType === null">-</span>
                        <span v-show="scope.row.attendee.sourceType === 1">后台录入</span>
                        <span v-show="scope.row.attendee.sourceType === 2">本人报名</span>
                        <span v-show="scope.row.attendee.sourceType === 3 || scope.row.attendee.sourceType === 4">
                            <div>{{ scope.row.attendee.createUserName }} <el-tag size="mini">代</el-tag></div>
                            <PhoneEncryption :value="scope.row.attendee.createUserPhone" />
                            <!-- <div>
                                <span>{{ formatPhone(scope.row.attendee.createUserPhone) }}</span>
                                <span style="display:none">{{ scope.row.attendee.createUserPhone }}</span>
                                <el-button icon="el-icon-view" type="text" @click="(event) => qiehuanshoujijiami(event)" />
                            </div> -->
                        <!-- </span>
                        <span v-show="scope.row.sourceType === 4">
                            会务组代报名 -->
                        </span>
                        <span v-show="scope.row.attendee.sourceType === 5">受邀参加</span>
                    </template>
                </el-table-column>
                <AttendeeAllColumn v-if="allColumnFlag" :all-column-list="allColumnList" :attendee-flag="2" />
                <el-table-column
                    label="操作"
                    width="100"
                >
                    <template slot-scope="scope">
                        <el-button
                            v-permission="Global.buttons.SignupCheck.view"
                            @click.native.prevent="edit(scope.row)"
                        >
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
            width="35%"
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
                <el-form-item v-show="activeName === 'signAdd'" label="" prop="signStatus">
                    <el-radio v-model="examineForm.signStatus" :label="2" @change="reasonChange(0)">退回重填<span class="_48OpacityClass" style="margin-left:10px">（{{ getConferenceTemplate(2) }}调整报名信息后可重新提交申请）</span></el-radio>
                    <el-radio v-model="examineForm.signStatus" :label="-3" @change="reasonChange(1)">禁止报名<span class="_48OpacityClass" style="margin-left:10px">（{{ getConferenceTemplate(2) }}禁止报名本次{{ getConferenceTemplate(1) }}）</span></el-radio>
                </el-form-item>
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
            <el-form
                ref="tagForm"
                :model="tagForm"
                :rules="tagRules"
                label-width="100px"
                class="demo-ruleForm"
            >
                <el-form-item label="请选择标签" prop="tagId">
                    <el-select v-model="tagForm.tagId" placeholder="请选择标签" style="width: 100%">
                        <el-option
                            v-for="item in tagList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="tagSubmit">提交</el-button>
                <el-button @click="closeTagDialog">取消</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="请选择您要执行的操作"
            :visible.sync="centerDialogVisible"
            width="25%"
        >
            <!-- <span style="padding-bottom:10px"></span> -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="shenhebutongguo">审核不通过</el-button>
                <el-button type="primary" @click="shenhetongguo">审核通过</el-button>
                <el-button @click="centerDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <TaskHand :attendee-ids="attendeeIds" :dialog-visible="taskDialogVisible" :source-type="sourceType" @closeDialog="closeXiafarenwu" />
    </div>
</template>

<script>
import { getTableHeight, formatPhone, getSourceTypes } from '@/utils/index'
import { getTaskList, exportExcel } from '@/api/attendee'
import { getList as getTagList } from '@/api/attendeeTag'
import { getOssPublicBaseUrl } from '@/utils/x-sso-publicbaseurl'
import { getConferenceId } from '@/utils/conference-auth'
import { examineBatch } from '@/api/attendee'
import { getListNoDate as getListNoDate } from '@/api/agenda'
import { insertTagAttendee } from '@/api/attendeeTag'
import TaskHand from '../components/task-hand'
import { getView as getConferenceView, getSignConfigAll } from '@/api/conference'
import AttendeeAllColumn from '@/views/attendee/components/attendeeAllColumn'
import { showLoading, closeLoading } from '@/utils/loading'
import { getConferenceVerifyReason, editConferenceVerifyReason } from '@/api/newExtend'
import { loginInfo } from '@/api/login'

export default {
    name: 'SignupCheck',
    components: {
        TaskHand,
        AttendeeAllColumn
    },
    props: {
    },
    data() {
        return {
            allColumnFlag: false,
            allColumnList: [],
            conferenceView: {},
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
            activeName: 'signAdd',
            agendas: [],
            sourceTypes: getSourceTypes(),
            dakaichaxunClass: 1,
            loading: false,
            examineRules: {},
            examineForm: {
                signStatus: 2,
                verifyReason: null
            },
            dialogVisible: false,
            conferenceId: getConferenceId(),
            tagList: [],
            imagePath: getOssPublicBaseUrl(),
            tableData: [],
            tableHeight: getTableHeight(215),
            multipleSelection: [],
            total1: 0,
            total2: 0,
            total3: 0,
            pageInfo: {
                agendaIdsIn: [],
                typeEqual: [1],
                statusFlag: 1,
                // resFlag: 1,
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            userId: null,
            verifyReasonData: [],
            choiceIndex: 0
        }
    },
    watch: {
        activeName() {
            this.getList1()
            this.getList2()
            this.getList3()
            this.pageInfo.total = 0
            this.search()
        }
    },
    created() {
        this.getSignConfigAll()
        this.getAgendaList()
        // if (this.$route.name === 'conferenceCreate') {
        //     this.tableHeight = getTableHeight(182)
        // } else {
        //     this.tableHeight = getTableHeight(212)
        // }
        this.search()
        this.getList1()
        this.getList2()
        this.getList3()
        this.getTagList()
        this.getConferenceView()
        // this.getVerifyReason()
    },
    methods: {
        reasonChange(index) {
            this.choiceIndex = index
            this.$set(this.examineForm, 'verifyReason', this.verifyReasonData[index].auditMind)
        },
        // getVerifyReason() {
            // loginInfo().then(res => {
            //     this.userId = res.result.id
            //     getConferenceVerifyReason({ 'conferenceId': getConferenceId(), attendeeId: this.userId }).then(res => {
            //         this.verifyReasonData = res.result
            //         this.$set(this.examineForm, 'verifyReason', '11111111111111111111')
            //     })
            // })
        // },
        exportExcel() {
            const load = showLoading()

            var tempData = JSON.parse(JSON.stringify(this.pageInfo))

            tempData.conferenceId = this.conferenceId

            tempData.signStatusEqual = [1]

            tempData.attendeeRoleFlagEqual = [0]

            tempData.hasLinkAttendee = 1
            tempData.hasLight = 1
            tempData.pageSize = null
            tempData.pageNum = null
            tempData.exportNamePrefix = '报名审核'
            exportExcel(tempData).then(res => {
                if (res.success) {
                    // this.$message('正在为您导出数据,稍后请通过会务通知获取下载链接')

                    this.$alert('正在为您导出数据,稍后请通过会务通知获取下载链接', '操作成功', {
                        confirmButtonText: '我知道了',
                        callback: action => {
                        }
                    })
                }
                closeLoading(load)
            }).catch(() => {
                closeLoading(load)
            })
            // exportExcel(tempData).then(res => {
            //     if (decodeURI(res.headers['filename']) == null || decodeURI(res.headers['filename']) === 'undefined') {
            //         this.$message('添加导出任务成功')
            //     } else {
            //         const blob = new Blob([res.data], { type: 'application/octet-stream' })
            //         const fileName = decodeURIComponent(decodeURI(res.headers['filename']))
            //         if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            //             navigator.msSaveBlob(blob, fileName)
            //         } else {
            //             const link = document.createElement('a')
            //             link.style.display = 'none'
            //             link.href = URL.createObjectURL(blob)
            //             link.setAttribute('download', fileName)
            //             document.body.appendChild(link)
            //             link.click()
            //             document.body.removeChild(link)
            //         }
            //     }
            //     closeLoading(load)
            // })
            //     .catch(error => {
            //         this.$message({
            //             title: '错误',
            //             desc: '系统数据错误'
            //         })
            //         console.log(error)
            //         closeLoading(load)
            //     })
        },
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
        shaixuan(command) {
            if (command === 'quanbu') {
                this.allColumnFlag = true
            } else {
                this.allColumnFlag = false
            }
            this.$nextTick(() => { this.$refs.table.doLayout() })
        },
        getConferenceView() { // 获取会议详情
            getConferenceView({ 'id': getConferenceId() }).then(res => {
                this.conferenceView = res.result
            })
        },
        shenhe() {
            loginInfo().then(res => {
                this.userId = res.result.id
                this.centerDialogVisible = true
                
            })
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
                        this.getList1()
                        this.getList2()
                        this.getList3()
                        this.search()
                        this.closeTagDialog()
                    }
                })
            }).catch(() => {})
        },
        getTagList() {
            getTagList({ 'conferenceId': this.conferenceId }).then(res => {
                this.tagList = res.result.list
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        getList() {
            this.pageInfo.conferenceId = this.conferenceId
            this.pageInfo.hasLinkAttendee = 1
            getTaskList(this.pageInfo).then(res => {
                this.tableData = res.result.list
                this.pageInfo.total = res.result.total
            })
        },
        getList1() {
            getTaskList({ 'typeEqual': [1], 'statusFlag': 1, 'conferenceId': getConferenceId() }).then(res => {
                this.total1 = res.result.total
            })
        },
        getList2() {
            this.pageInfo.conferenceId = this.conferenceId
            getTaskList({ 'typeEqual': [2], 'statusFlag': 1, 'conferenceId': getConferenceId() }).then(res => {
                this.total2 = res.result.total
            })
        },
        getList3() {
            getTaskList({ 'typeEqual': [3], 'statusFlag': 1, 'conferenceId': getConferenceId() }).then(res => {
                this.total3 = res.result.total
            })
        },
        edit(val) {
            // this.$router.push({ name: 'attendeeView' })
            this.$router.push({
                path: `/attendeeManagement/attendee/check/${val.attendeeId}/${val.type}/${val.id}`
            })
            // this.$route.meta.title = val.attendee.fixAttributeCommonVO.attendeeName + '的报名表单'
        },
        search() {
            this.pageInfo.pageNum = 1
            if (this.activeName === 'signAdd') {
                this.pageInfo.typeEqual = [1]
            } else if (this.activeName === 'signUpdate') {
                this.pageInfo.typeEqual = [2]
            } else if (this.activeName === 'signCancel') {
                this.pageInfo.typeEqual = [3]
            }
            this.getList()
        },
        resetSearch() {
            this.pageInfo = {
                agendaIdsIn: [],
                typeEqual: [1],
                statusFlag: 1,
                // resFlag: 1,
                pageNum: 1,
                pageSize: 10,
                total: this.pageInfo.total
            }
        },
        handleCurrentChange(val) {
            this.pageInfo.pageNum = val
            if (this.activeName === 'signAdd') {
                this.pageInfo.typeEqual = [1]
            } else if (this.activeName === 'signUpdate') {
                this.pageInfo.typeEqual = [2]
            } else if (this.activeName === 'signCancel') {
                this.pageInfo.typeEqual = [3]
            }
            this.getList()
        },
        handleSizeChange(val) {
            this.pageInfo.pageSize = val
            if (this.activeName === 'signAdd') {
                this.pageInfo.typeEqual = [1]
            } else if (this.activeName === 'signUpdate') {
                this.pageInfo.typeEqual = [2]
            } else if (this.activeName === 'signCancel') {
                this.pageInfo.typeEqual = [3]
            }
            this.getList()
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
            if (this.multipleSelection.length === 0) {
                this.$message('至少选择一条记录')
                return
            }
            this.dialogVisible = true
            this.examineForm = {
                signStatus: 2,
                verifyReason: null
            }
            // 每次打开弹窗将默认值带过来
            getConferenceVerifyReason({ 'conferenceId': getConferenceId(), attendeeId: this.userId }).then(res => {
                console.log(res)
                this.verifyReasonData = res.result
                this.$set(this.examineForm, 'verifyReason', this.verifyReasonData[0].auditMind)
            })
        },
        shenhetongguo() {
            if (this.multipleSelection.length === 0) {
                this.$message('至少选择一条记录')
                return
            }
            this.examineForm.signStatus = 3
            this.examineFormSubmitForshenhetongguo()
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

                if (this.activeName === 'signAdd') {
                    this.examineForm.auditType = 1
                } else if (this.activeName === 'signUpdate') {
                    this.examineForm.auditType = 2
                } else if (this.activeName === 'signCancel') {
                    this.examineForm.auditType = 3
                }

                // var xiafarenwuFlag = false

                // if (this.examineForm.auditType !== 1 && this.examineForm.auditType !== 3) {
                //     xiafarenwuFlag = true
                // } else {
                //     xiafarenwuFlag = false
                // }

                // alert(this.examineForm.auditType !== 1 && this.examineForm.auditType !== 3)

                examineBatch(this.examineForm).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        this.closeDialog()
                        // alert(xiafarenwuFlag)
                        // if (xiafarenwuFlag) {
                        //     this.xiafarenwu(param)
                        // }
                        this.getList1()
                        this.getList2()
                        this.getList3()
                        this.search()
                    }
                })
            }).catch(() => {})
        },
        examineFormSubmit() {
            this.$confirm('请确认是否审核通过该报名信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 修改审核默认值
                const data = {
                    conferenceId: getConferenceId(),
                    attendeeId: this.userId,
                    auditMind: this.examineForm.verifyReason,
                    id: this.verifyReasonData[this.choiceIndex].id,
                    type: this.choiceIndex
                }
                editConferenceVerifyReason(data).then(res => {
                    this.verifyReasonData = res.result
                })
                /* 修改审核默认值结束 */
                this.centerDialogVisible = false
                const param = []
                this.multipleSelection.forEach(item => {
                    param.push(item.attendeeId)
                })
                this.examineForm.attendeeIds = param

                if (this.activeName === 'signAdd') {
                    this.examineForm.auditType = 1
                } else if (this.activeName === 'signUpdate') {
                    this.examineForm.auditType = 2
                } else if (this.activeName === 'signCancel') {
                    this.examineForm.auditType = 3
                }

                examineBatch(this.examineForm).then(res => {
                    if (res.success) {
                        this.getList1()
                        this.getList2()
                        this.getList3()
                        this.search()
                        this.$message(res.message)
                        this.closeDialog()
                    }
                })
            }).catch(() => {})
        },
        returnSubmit() {
            this.$refs['examineForm'].validate(valid => {
                if (valid) {
                    this.examineFormSubmit()
                }
            })
        },
        dakaichaxun() {
            this.dakaichaxunClass = this.dakaichaxunClass === 1 ? 0 : 1
        },
        getAgendaList() { // 获取会议议程树
            getListNoDate({ 'conferenceId': getConferenceId() }).then(res => {
                this.agendas = res.result
            })
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
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}



._48OpacityClass {
    width: 343px;
    height: 32px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(25, 31, 36, 0.48);
    line-height: 16px;
}
</style>
