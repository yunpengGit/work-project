<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:8px">
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
                    <el-form-item v-if="dakaichaxunClass === 0" label="报名状态">
                        <el-select v-model="pageInfo.signStatusTemp" class="width100Class" placeholder="全部" clearable>
                            <el-option
                                v-for="item in signStatuss"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="报名时间" clearable>
                        <el-date-picker
                            v-model="signupTimes"
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetimerange"
                            range-separator="-"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围"
                            size="small"
                            style="width:310px"
                        />
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="审核时间" clearable>
                        <el-date-picker
                            v-model="verifyTimes"
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetimerange"
                            range-separator="-"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围"
                            size="small"
                            style="width:310px"
                        />
                    </el-form-item>
                    <!-- <el-form-item v-if="dakaichaxunClass === 0" label="报名人">
                        <el-input v-model.trim="pageInfo.createUserNameLike" class="width100Class" maxlength="25" placeholder="" />
                    </el-form-item> -->
                </el-form>
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
            <div style="float: left; text-center: left;margin-left:10px;padding-bottom:10px;">
                <el-button v-permission="Global.buttons.SignupQuery.addTag" @click="dabiaoqian">批量打标签</el-button>
            </div>
            <div style="float: right; text-center: left;margin-left:10px;padding-bottom:10px;">
                <el-button v-permission="Global.buttons.SignupQuery.export" @click="exportExcel">导出查询结果</el-button>
            </div>

            <div v-if="signConfig !== null && signConfig.startTime !== undefined && signConfig.startTime !== null" v-permission="Global.buttons.SignupQuery.signup" style="float: right; text-center: right;padding-bottom:10px;">
                <el-tooltip v-if="!(new Date(signConfig.endTime).getTime() >= new Date().getTime() && new Date(signConfig.startTime).getTime() <= new Date().getTime())" content="报名时间已截止" placement="left" effect="light">
                    <el-button type="primary" :disabled="!(new Date(signConfig.endTime).getTime() >= new Date().getTime() && new Date(signConfig.startTime).getTime() <= new Date().getTime())" @click="add">代报名</el-button>
                </el-tooltip>
                <el-button v-else type="primary" :disabled="!(new Date(signConfig.endTime).getTime() >= new Date().getTime() && new Date(signConfig.startTime).getTime() <= new Date().getTime())" @click="add">代报名</el-button>
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
                :height="(dakaichaxunClass === 0 ? (tableHeight -104) : tableHeight)"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
            >
                <el-table-column
                    type="selection"
                    width="55"
                    :selectable="selectInit"
                />
                <!-- width="180" -->
                <el-table-column
                    prop="name"
                    label="姓名"
                    :min-width="200"
                >
                    <template slot-scope="scope">
                        <div style="height:32px">
                            <AttendeeInfomation :accompany-flag="2" :accompany-totips="scope.row.accompanyTotips" :photo-url="scope.row.ssoUserPhoto" :attendee-name="scope.row.fixAttributeCommonVO.attendeeName" :attendee-role-flag="scope.row.fixAttributeCommonVO.attendeeRoleFlag" :honour-flag="scope.row.fixAttributeCommonVO.honourFlag" :sex="scope.row.fixAttributeCommonVO.sex" />
                            <!-- <img
                                style="width:32px;height:32px;float:left;border-radius:50%"
                                :src="scope.row.fixAttributeCommonVO.photoUrl !== null && scope.row.fixAttributeCommonVO.photoUrl !== '' ? scope.row.fixAttributeCommonVO.photoUrl : (defaultPhoto)"
                            >
                            <span style="margin-top:8px;margin-left:5px;float:left" :title="scope.row.fixAttributeCommonVO.attendeeName">{{ scope.row.fixAttributeCommonVO.attendeeName != null && scope.row.fixAttributeCommonVO.attendeeName.length > 4 ? scope.row.fixAttributeCommonVO.attendeeName.substr(0,4) + '...' : scope.row.fixAttributeCommonVO.attendeeName }}</span>
                            <span v-if="scope.row.fixAttributeCommonVO.honourFlag === 1" style="margin-top:8px;float:left">（主宾）</span>
                            <span v-else style="margin-top:8px;float:left">（随员）</span> -->
                        </div>

                        <!-- <el-tooltip placement="bottom" effect="light">
                            <div v-if="scope.row.fixAttributeCommonVO.honourFlag === 1" slot="content">

                                <div v-if="scope.row.linkAttendeeList !== null && scope.row.linkAttendeeList.length > 0">
                                    <div>
                                        随员信息：
                                    </div>
                                    <div v-for="item in scope.row.linkAttendeeList" :key="item.id">
                                        {{ item.attendeeName + '（' + item.phone + '）' }}
                                    </div>
                                </div>
                                <div v-else>
                                    随员信息：无
                                </div>
                            </div>
                            <div v-else slot="content">
                                <div>
                                    主宾信息：
                                </div>
                                <div v-for="item in scope.row.linkAttendeeList" :key="item.id">
                                    {{ item.attendeeName + '（' + item.phone + '）' }}
                                </div>
                            </div>
                            <div style="height:32px">
                                <img
                                    style="width:32px;height:32px;float:left;border-radius:50%"
                                    :src="scope.row.fixAttributeCommonVO.photoUrl !== null && scope.row.fixAttributeCommonVO.photoUrl !== '' ? scope.row.fixAttributeCommonVO.photoUrl : (defaultPhoto)"
                                >
                                <span style="margin-top:8px;margin-left:5px;float:left" :title="scope.row.fixAttributeCommonVO.attendeeName">{{ scope.row.fixAttributeCommonVO.attendeeName != null && scope.row.fixAttributeCommonVO.attendeeName.length > 4 ? scope.row.fixAttributeCommonVO.attendeeName.substr(0,4) + '...' : scope.row.fixAttributeCommonVO.attendeeName }}</span>
                                <span v-if="scope.row.fixAttributeCommonVO.honourFlag === 1" style="margin-top:8px;float:left">（主宾）</span>
                                <span v-else style="margin-top:8px;float:left">（随员）</span>
                            </div>
                        </el-tooltip> -->
                    </template>
                </el-table-column>
                <el-table-column
                    label="职务"
                >
                    <template slot-scope="scope">
                        <div :title="scope.row.fixAttributeCommonVO.position">{{ formatTableCellData(scope.row.fixAttributeCommonVO.position) }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="标签"
                >
                    <template slot-scope="scope">
                        {{ scope.row.tagVOs !== null && scope.row.tagVOs.length > 0 ? '' : '-' }}
                        <el-tag v-for="(tagVO, index) in scope.row.tagVOs" :key="tagVO.id" :style="{ backgroundColor: tagVO.backgroundColor, color: tagVO.fontColor }" type="info">
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
                        <PhoneEncryption :value="scope.row.fixAttributeCommonVO.phoneForMsg" />
                        <!-- <div>
                            <span>{{ formatTableCellData(formatPhone(scope.row.fixAttributeCommonVO.phoneForMsg)) }}</span>
                            <span style="display:none">{{ formatTableCellData(scope.row.fixAttributeCommonVO.phoneForMsg) }}</span>
                            <el-button v-show="scope.row.fixAttributeCommonVO.phoneForMsg !== null && scope.row.fixAttributeCommonVO.phoneForMsg !== ''" icon="el-icon-view" type="text" @click="(event) => qiehuanshoujijiami(event)" />
                        </div> -->
                    </template>
                </el-table-column>
                <!-- width="120" -->
                <el-table-column
                    prop="fixAttributeCommonVO.organizationSortName"
                    label="单位简称/全称"
                >
                    <template slot-scope="scope">
                        <div>{{ formatTableCellData(formatOrgName(scope.row.fixAttributeCommonVO.organizationSortName, scope.row.fixAttributeCommonVO.organizationName)) }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="报名来源"
                >
                    <template slot-scope="scope">
                        <span v-show="scope.row.sourceType === null">-</span>
                        <span v-show="scope.row.sourceType === 1">后台录入</span>
                        <span v-show="scope.row.sourceType === 2">本人报名</span>
                        <span v-show="scope.row.sourceType === 3 || scope.row.sourceType === 4">
                            <div>{{ scope.row.createUserName }} <el-tag size="mini">代</el-tag></div>
                            <PhoneEncryption :value="scope.row.createUserPhone" />
                        <!-- </span>
                        <span v-show="scope.row.sourceType === 4">
                            会务组代报名 -->
                        </span>
                        <span v-show="scope.row.sourceType === 5">受邀参加</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="报名状态"
                >
                    <template slot-scope="scope">
                        {{ formatTableCellData(scope.row.signStatusStr) }}
                    </template>
                </el-table-column>
                <AttendeeAllColumn v-if="allColumnFlag" :all-column-list="allColumnList" :attendee-flag="1" />
                <el-table-column
                    label="操作"
                    width="100"
                >
                    <template slot-scope="scope">
                        <el-button
                            v-permission="Global.buttons.SignupQuery.view"
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
    </div>
</template>

<script>
import { getTableHeight, formatPhone, getSignStatuss, getSourceTypes } from '@/utils/index'
import { getList, exportExcel } from '@/api/attendee'
import { getList as getTagList } from '@/api/attendeeTag'
import { getOssPublicBaseUrl } from '@/utils/x-sso-publicbaseurl'
import { getConferenceId } from '@/utils/conference-auth'
import { getListNoDate as getListNoDate } from '@/api/agenda'
import { getSignConfig } from '@/api/signup'
import { insertTagAttendee } from '@/api/attendeeTag'
import { getView as getConferenceView, getSignConfigAll } from '@/api/conference'
import AttendeeAllColumn from '@/views/attendee/components/attendeeAllColumn'
import { showLoading, closeLoading } from '@/utils/loading'
export default {
    name: 'SignupCheck',
    components: {
        AttendeeAllColumn
    },
    props: {
    },
    data() {
        return {
            verifyTimes: [],
            signupTimes: [],
            allColumnFlag: false,
            allColumnList: [],
            conferenceView: {},
            tagList: [],
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
            taskView: [],
            tagDialogVisible: false,
            tagForm: {
                tagId: null
            },
            tagRules: {
                tagId: [{ required: true, message: '请选择标签', trigger: 'change' }]
            },
            multipleSelection: [],
            signConfig: {},
            agendas: [],
            sourceTypes: getSourceTypes(1),
            dakaichaxunClass: 1,
            signStatuss: getSignStatuss(),
            conferenceId: getConferenceId(),
            imagePath: getOssPublicBaseUrl(),
            tableData: [],
            tableHeight: getTableHeight(160),
            pageInfo: {
                agendaIdsIn: [],
                resFlag: 1,
                pageNum: 1,
                pageSize: 10,
                total: 0
            }
        }
    },
    created() {
        this.getSignConfigAll()
        this.getAgendaList()
        this.search()
        this.getTagList()
        this.getSignConfig()
        this.getConferenceView()
    },
    methods: {
        exportExcel() {
            const load = showLoading()

            var tempData = JSON.parse(JSON.stringify(this.pageInfo))

            tempData.conferenceId = this.conferenceId

            if (tempData.signStatusTemp === undefined || tempData.signStatusTemp === null || tempData.signStatusTemp === '') {
                tempData.signStatusEqual = [-3, -2, -1, 2, 3]
            } else {
                tempData.signStatusEqual = [tempData.signStatusTemp]
            }

            tempData.attendeeRoleFlagEqual = [0]

            tempData.hasLinkAttendee = 1
            tempData.hasLight = 1
            tempData.pageSize = null
            tempData.pageNum = null
            tempData.exportNamePrefix = '报名查询'
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
        resetSearch() {
            this.pageInfo = {
                agendaIdsIn: [],
                resFlag: 1,
                pageNum: 1,
                pageSize: 10,
                total: this.pageInfo.total
            }
            this.signupTimes = []
            this.verifyTimes = []
        },
        selectInit(row, index) {
            if (row.signStatus !== 1 && row.signStatus !== 3 && row.signStatus !== 0) {
                return false // 不可勾选
            } else {
                return true // 可勾选
            }
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
        closeTagDialog() {
            this.tagDialogVisible = false
            // this.tagForm.tagId = null
            this.$refs['tagForm'].resetFields()
        },
        tagSubmit() {
            this.$confirm('请确认是否保存标签信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const param = []
                this.multipleSelection.forEach(item => {
                    param.push(item.id)
                })
                this.tagForm.attendeeIds = param
                this.tagList.forEach(item => {
                    if (item.id === this.tagForm.tagId) {
                        this.tagForm.tagName = item.name
                    }
                })
                insertTagAttendee(this.tagForm).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        this.search()
                        this.closeTagDialog()
                    }
                })
            }).catch(() => {})
        },
        dabiaoqian() {
            if (this.multipleSelection.length === 0) {
                this.$message('至少选择一条记录')
                return
            }
            this.tagDialogVisible = true
            this.tagForm.tagId = null
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        getSignConfig() { // 获取报名设置
            getSignConfig({ 'conferenceId': getConferenceId() }).then(res => {
                this.signConfig = res.result
                // alert((new Date(this.signConfig.endTime).getTime() >= new Date().getTime() && new Date(this.signConfig.startTime).getTime() <= new Date().getTime()))
                // alert(this.signConfig.startTime)
                // alert()
            })
        },
        dakaichaxun() {
            this.dakaichaxunClass = this.dakaichaxunClass === 1 ? 0 : 1
        },
        getTagList() {
            getTagList({ 'conferenceId': this.conferenceId }).then(res => {
                this.tagList = res.result.list
            })
        },
        getList() {
            this.pageInfo.conferenceId = this.conferenceId
            if (this.pageInfo.signStatusTemp === undefined || this.pageInfo.signStatusTemp === null || this.pageInfo.signStatusTemp === '') {
                this.pageInfo.signStatusEqual = [-3, -2, -1, 2, 3]
            } else {
                this.pageInfo.signStatusEqual = [this.pageInfo.signStatusTemp]
            }

            if (this.signupTimes !== null && this.signupTimes.length === 2) {
                this.pageInfo.signupStartTime = this.signupTimes[0]
                this.pageInfo.signupEndTime = this.signupTimes[1]
            } else {
                this.pageInfo.signupStartTime = null
                this.pageInfo.signupEndTime = null
            }

            if (this.verifyTimes !== null && this.verifyTimes.length === 2) {
                this.pageInfo.verifyStartTime = this.verifyTimes[0]
                this.pageInfo.verifyEndTime = this.verifyTimes[1]
            } else {
                this.pageInfo.verifyStartTime = null
                this.pageInfo.verifyEndTime = null
            }

            this.pageInfo.hasLinkAttendee = 1

            getList(this.pageInfo).then(res => {
                this.tableData = res.result.list
                this.pageInfo.total = res.result.total
            })
        },
        add() {
            this.$router.push({
                path: `/attendeeManagement/attendee/signup/0`
            })
            // this.$router.push({
            //     path: `/attendeeManagement/attendee/edit/0`
            // })
            // this.$route.meta.title = '代报名'
        },
        edit(val) {
            // this.$router.push({ name: 'attendeeView' })
            this.$router.push({
                // path: `/attendeeManagement/attendee/signup/${val.id}`
                path: `/attendeeManagement/attendee/signup/${val.id}`
            })
            // this.$route.meta.title = val.fixAttributeCommonVO.attendeeName + '的报名表单'
        },
        search() {
            this.pageInfo.pageNum = 1
            this.getList()
        },
        handleCurrentChange(val) {
            this.pageInfo.pageNum = val
            this.getList()
        },
        handleSizeChange(val) {
            this.pageInfo.pageSize = val
            this.getList()
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
    width: 130px;
}
.width100Class {
    width: 130px;
}
.danhangxianshibuquan {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
