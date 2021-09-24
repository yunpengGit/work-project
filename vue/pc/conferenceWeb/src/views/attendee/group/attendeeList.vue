<template>
    <div class="">
        <el-drawer
            title="查看人员信息"
            :visible.sync="dialogVisible"
            :before-close="closeDialog"
            size="75%"
        >
            <div class="clearfix">
                <div style="background-color: white;padding-left:10px;">
                    <el-form :inline="true" :model="pageInfo">

                        <el-form-item label="姓名">
                            <el-input v-model.trim="pageInfo.attendeeNameLike" class="widthClass" maxlength="25" placeholder="" />
                        </el-form-item>
                        <el-form-item label="手机">
                            <el-input v-model.trim="pageInfo.phoneLike" class="widthClass" maxlength="25" placeholder="" />
                        </el-form-item>
                        <el-form-item label="职务">
                            <el-input v-model.trim="pageInfo.positionLike" class="widthClass" maxlength="25" placeholder="" />
                        </el-form-item>
                        <el-form-item label="单位名称">
                            <el-input v-model.trim="pageInfo.allOrganizationNameLike" style="width:120px" class="widthClass" maxlength="25" placeholder="" />
                        </el-form-item>

                        <el-form-item style="float: right">
                            <el-button type="primary" @click="search">查询</el-button>
                            <el-button @click="resetSearch">重置</el-button>
                            <!-- <el-button :class="dakaichaxunClass === 1 ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" type="text" style="margin-left:10px;margin-right:5px" @click="dakaichaxun" /> -->
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div style="background-color: #EEF0F4;height:8px;width:100%" />
            <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
                <div style="float: left; text-center: left;margin-left:10px;padding-bottom:10px;">
                    <!-- <el-button v-permission="Global.buttons.AttendeeGroup.deleteAttendee" @click="deleteBatch">批量删除</el-button> -->
                </div>
                <!-- <div style="float: right; text-center: right;padding-bottom:10px;">
                    <el-button v-permission="Global.buttons.AttendeeGroup.addAttendee" type="primary" @click="add">添加</el-button>
                </div> -->
                <el-table
                    ref="table"
                    :data="tableData"
                    :height="(dakaichaxunClass === 0 ? (tableHeight - 52) : tableHeight) + (this.$store.state.menu.buttons.indexOf(Global.buttons.AttendeeGroup.addAttendee) !== -1 ||
                        this.$store.state.menu.buttons.indexOf(Global.buttons.AttendeeGroup.deleteAttendee) !== -1 ? 0: 32)"
                    style="width: 100%;"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column v-if="groupType !== 3" width="58px">
                        <template slot-scope="scope">
                            <div v-if="scope.row.personTypeStr !== null && scope.row.personTypeStr !== ''">
                                <el-tag size="mini" color="#FF8200">
                                    <font color="#ffffff">{{ scope.row.personTypeStr }}</font>
                                </el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- width="180" -->

                    <el-table-column
                        prop="name"
                        label="姓名"
                    >
                        <template slot-scope="scope">
                            <AttendeeInfomation :photo-url="scope.row.ssoUserPhoto" :attendee-name="scope.row.attendeeFixAttribute.attendeeName" :attendee-role-flag="scope.row.attendeeFixAttribute.attendeeRoleFlag" :honour-flag="scope.row.attendeeFixAttribute.honourFlag" :sex="scope.row.attendeeFixAttribute.sex" :honour-visible-flag="1" />
                            <!-- <div style="height:40px">
                                <img
                                    style="width:40px;height:40px;float:left;border-radius:50%"
                                    :src="scope.row.attendeeFixAttribute.photoUrl !== null && scope.row.attendeeFixAttribute.photoUrl !== '' ? scope.row.attendeeFixAttribute.photoUrl : (defaultPhoto)"
                                >
                                <div style="width:100%;">
                                    <span style="margin-left:5px;float:left;margin-top:10px;" :title="scope.row.attendeeFixAttribute.attendeeName">
                                        {{ scope.row.attendeeFixAttribute.attendeeName != null && scope.row.attendeeFixAttribute.attendeeName.length > 4 ? scope.row.attendeeFixAttribute.attendeeName.substr(0,4) + '...' : scope.row.attendeeFixAttribute.attendeeName }}</span>
                                </div><br>
                            </div> -->
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="职务"
                    >
                        <template slot-scope="scope">
                            <div :title="scope.row.attendeeFixAttribute.position">{{ formatTableCellData(scope.row.attendeeFixAttribute.position) }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="手机"
                        min-width="120px"
                    >
                        <template slot-scope="scope">
                            <PhoneEncryption :value="scope.row.attendeeFixAttribute.phoneForMsg" />
                            <!-- <div>
                                <span>{{ formatTableCellData(formatPhone(scope.row.attendeeFixAttribute.phoneForMsg)) }}</span>
                                <span style="display:none">{{ scope.row.attendeeFixAttribute.phoneForMsg }}</span>
                                <el-button v-show="scope.row.attendeeFixAttribute.phoneForMsg !== null && scope.row.attendeeFixAttribute.phoneForMsg !== ''" icon="el-icon-view" type="text" @click="(event) => qiehuanshoujijiami(event)" />
                            </div> -->
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="fixAttributeCommonVO.organizationSortName"
                        label="单位简称"
                    >
                        <template slot-scope="scope">
                            <div>{{ formatTableCellData(formatOrgName(scope.row.attendeeFixAttribute.organizationSortName, scope.row.attendeeFixAttribute.organizationName)) }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="100"
                    >
                        <template slot-scope="scope">
                            <el-button
                                @click.native.prevent="del(scope.row)"
                            >
                                删除
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
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取消</el-button>
            </span>
        </el-drawer>
    </div>
</template>

<script>
import { getTableHeight, getMeetingStatuss, formatPhone } from '@/utils/index'
import { getList as getTagList } from '@/api/attendeeTag'
import { getConferenceId } from '@/utils/conference-auth'
import { getOssPublicBaseUrl } from '@/utils/x-sso-publicbaseurl'
import { getAttendeeList, deleteByAttendeeIdsAndGroupId } from '@/api/attendeeGroup'
import { getListNoDate as getListNoDate } from '@/api/agenda'
import { getDicList } from '@/api/common'
import { getView as getConferenceView } from '@/api/conference'

export default {
    name: 'GroupAttendeeList',
    components: {
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        groupId: {
            type: null,
            default: null
        },
        groupName: {
            type: null,
            default: null
        },
        groupType: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            conferenceView: {},
            meetingStatuss: getMeetingStatuss(),
            dakaichaxunClass: 1,
            tagList: [],
            agendas: [],
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
            imagePath: getOssPublicBaseUrl(),
            pickDialogVisible: false,
            multipleSelection: [],
            tableHeight: getTableHeight(140),
            tableData: [],
            pageInfo: {
                pageNum: 1,
                pageSize: 10,
                total: 0
            }
        }
    },
    watch: {
        dialogVisible(val) {
            if (val) {
                this.getList()
                this.getPositionLevels()
                this.getAgendaList()
                this.getTagList()
                this.dakaichaxunClass = 1
                this.getConferenceView()
            }
        }
    },
    methods: {
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
        getConferenceView() { // 获取会议详情
            getConferenceView({ 'id': getConferenceId() }).then(res => {
                this.conferenceView = res.result
            })
        },
        getPositionLevels() { // 获取职级列表
            getDicList({ 'code': 'positionLevel' }).then(response => {
                this.positionLevels = response.result
            })
        },
        dakaichaxun() {
            this.dakaichaxunClass = this.dakaichaxunClass === 1 ? 0 : 1
        },
        getTagList() {
            getTagList({ 'conferenceId': getConferenceId() }).then(res => {
                this.tagList = res.result.list
            })
        },
        getAgendaList() { // 获取会议议程树
            getListNoDate({ 'conferenceId': getConferenceId() }).then(res => {
                this.agendas = res.result
            })
        },
        resetSearch() {
            this.pageInfo = {
                pageNum: 1,
                pageSize: 10,
                total: this.pageInfo.total
            }
        },
        add() {
            this.pickDialogVisible = true
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        del(row) {
            this.deleteSubmit([row.id])
        },
        deleteBatch() {
            if (this.multipleSelection.length === 0) {
                this.$message('至少选择一条记录')
                return
            }
            const param = []
            this.multipleSelection.forEach(item => {
                param.push(item.id)
            })
            this.deleteSubmit(param)
        },
        deleteSubmit(param) {
            this.$confirm('请确认是否删除分组下人员信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteByAttendeeIdsAndGroupId({ 'attendeeAccompanyIds': param }).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        this.search()
                    }
                })
            }).catch(() => {})
        },
        closeDialog() {
            this.$emit('closeDialog', null)
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
        getList() {
            this.pageInfo.conferenceId = getConferenceId()
            this.pageInfo.id = this.groupId
            getAttendeeList(this.pageInfo).then(res => {
                this.tableData = res.result.list
                this.pageInfo.total = res.result.total
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.widthClass {
    width: 110px
}
.width100Class {
    width: 90px;
}
.danhangxianshibuquan {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
