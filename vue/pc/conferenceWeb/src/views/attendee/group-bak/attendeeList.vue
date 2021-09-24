<template>
    <div class="">
        <el-drawer
            title="查看人员信息"
            :visible.sync="attendeeDialogVisible"
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
                            <el-button :class="dakaichaxunClass === 1 ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" type="text" style="margin-left:10px;margin-right:5px" @click="dakaichaxun" />
                        </el-form-item>
                        <el-form-item v-if="dakaichaxunClass === 0" label="标签">
                            <el-select v-model="pageInfo.tagIdsIn" class="width100Class" placeholder="全部" clearable>
                                <el-option
                                    v-for="item in tagList"
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
                        <el-form-item v-if="dakaichaxunClass === 0" label="参会状态">
                            <el-select v-model="pageInfo.meetingStatus" class="width100Class" placeholder="全部" clearable>
                                <el-option
                                    v-for="item in meetingStatuss"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="dakaichaxunClass === 0 && conferenceView.setAgendaFlag === 1" :label="getConferenceTemplate(1) + '议程'">
                            <el-cascader
                                v-model="pageInfo.agendaIdsIn"
                                style="width: 150px"
                                placeholder="全部"
                                :options="agendas"
                                class="widthClass"
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
                    </el-form>
                </div>
            </div>
            <div style="background-color: #EEF0F4;height:8px;width:100%" />
            <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
                <div style="float: left; text-center: left;margin-left:10px;padding-bottom:10px;">
                    <el-button v-permission="Global.buttons.AttendeeGroup.deleteAttendee" @click="deleteBatch">批量删除</el-button>
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
                    <el-table-column
                        type="selection"
                        width="55"
                    />
                    <!-- width="180" -->
                    <el-table-column
                        prop="name"
                        label="姓名"
                    >
                        <template slot-scope="scope">
                            <div style="height:40px">
                                <img
                                    style="width:40px;height:40px;float:left;border-radius:50%"
                                    :src="scope.row.fixAttributeCommonVO.photoUrl !== null && scope.row.fixAttributeCommonVO.photoUrl !== '' ? scope.row.fixAttributeCommonVO.photoUrl : (defaultPhoto)"
                                >
                                <div style="width:100%;">
                                    <span style="margin-left:5px;float:left" :title="scope.row.fixAttributeCommonVO.attendeeName">
                                        {{ scope.row.fixAttributeCommonVO.attendeeName != null && scope.row.fixAttributeCommonVO.attendeeName.length > 4 ? scope.row.fixAttributeCommonVO.attendeeName.substr(0,4) + '...' : scope.row.fixAttributeCommonVO.attendeeName }}</span>
                                    <span v-if="scope.row.fixAttributeCommonVO.honourFlag === 1" style="float:left">（主宾）</span>
                                    <span v-else style="float:left">（随员）</span>
                                </div><br>
                                <span style="width:100%;">{{ scope.row.fixAttributeCommonVO.phone }}</span>
                            </div>
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
                            <el-tag v-for="tagVO in scope.row.tagVOs" :key="tagVO.id" style="margin-left:4px" type="info">
                                <!-- {{ tagVO.name }} -->
                                <el-tooltip placement="bottom" effect="light">
                                    <div slot="content">
                                        {{ tagVO.name }}
                                    </div>
                                    <div class="danhangxianshibuquan">{{ tagVO.name !== null && tagVO.name.length > 5 ? tagVO.name.substr(0,4) + '...' : tagVO.name }}</div>
                                </el-tooltip>
                            </el-tag>
                            <!-- <el-tag v-for="tagVO in scope.row.tagVOs" :key="tagVO.id" style="margin-left:4px" type="info">{{ tagVO.name }}</el-tag> -->
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="fixAttributeCommonVO.organizationSortName"
                        label="单位简称"
                    >
                        <template slot-scope="scope">
                            <div>{{ formatTableCellData(formatOrgName(scope.row.fixAttributeCommonVO.organizationSortName, scope.row.fixAttributeCommonVO.organizationName)) }}</div>
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
        <PickAttendee :pick-dialog-visible="pickDialogVisible" @closeDialog="closePickAttendeeDialog" />
    </div>
</template>

<script>
import { getTableHeight, getMeetingStatuss } from '@/utils/index'
import { getList } from '@/api/attendee'
import { getList as getTagList } from '@/api/attendeeTag'
import PickAttendee from '../components/pickAttendee'
import { getConferenceId } from '@/utils/conference-auth'
import { getOssPublicBaseUrl } from '@/utils/x-sso-publicbaseurl'
import { insertGroupAttendee, deleteByAttendeeIdsAndGroupId } from '@/api/attendeeGroup'
import { getListNoDate as getListNoDate } from '@/api/agenda'
import { getDicList } from '@/api/common'
import { getView as getConferenceView } from '@/api/conference'
export default {
    name: 'GroupAttendeeList',
    components: {
        PickAttendee
    },
    props: {
        attendeeDialogVisible: {
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
                resFlag: 2,
                pageNum: 1,
                pageSize: 10,
                total: 0
            }
        }
    },
    watch: {
        attendeeDialogVisible(val) {
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
                resFlag: 2,
                pageNum: 1,
                pageSize: 10,
                total: this.pageInfo.total
            }
        },
        closePickAttendeeDialog(val) {
            if (val !== null) {
                var dataTemp = {
                    groupId: this.groupId,
                    groupName: this.groupName,
                    attendeeIds: val
                }
                insertGroupAttendee(dataTemp).then(res => {
                    if (res.success) {
                        this.pickDialogVisible = false
                        this.getList()
                    }
                })
            } else {
                this.pickDialogVisible = false
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
                deleteByAttendeeIdsAndGroupId({ 'groupId': this.groupId, 'attendeeIds': param }).then(res => {
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
            this.pageInfo.groupIdsIn = this.groupId
            getList(this.pageInfo).then(res => {
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
