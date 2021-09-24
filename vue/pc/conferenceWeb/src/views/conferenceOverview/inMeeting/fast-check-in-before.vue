<template>
    <div class="">
        <el-dialog
            :title="title"
            width="58%"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="closeDialog"
        >
            <div class="clearfix">
                <div style="background-color: white;padding-left:10px;padding-top: 15px">
                    <el-form :inline="true" :model="pageInfo">
                        <el-form-item label="姓名">
                            <el-input v-model.trim="pageInfo.attendeeNameLike" class="widthClass" placeholder="请输入姓名" />
                        </el-form-item>
                        <el-form-item label="手机">
                            <el-input v-model.trim="pageInfo.phoneLike" class="widthClass" />
                        </el-form-item>
                        <el-form-item style="float: right">
                            <el-button type="primary" @click="search">查询</el-button>
                            <el-button @click="resetSearch">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <el-table
                :data="attendeeList"
                style="width: 100%"
                :height="tableHeight"
            >
                <el-table-column
                    prop="name"
                    :label="getConferenceTemplate(2) + '信息'"
                    width="170"
                >
                    <template slot-scope="scope">
                        <div style="height:32px">
                            <AttendeeInfomation :photo-url="scope.row.ssoUserPhoto" :attendee-name="scope.row.fixAttributeCommonVO.attendeeName" :attendee-role-flag="scope.row.fixAttributeCommonVO.attendeeRoleFlag" :honour-flag="scope.row.fixAttributeCommonVO.honourFlag" :sex="scope.row.fixAttributeCommonVO.sex" />

                            <!-- <img
                                style="width:32px;height:32px;float:left;border-radius:50%"
                                :src="scope.row.fixAttributeCommonVO.photoUrl !== null && scope.row.fixAttributeCommonVO.photoUrl !== '' ? scope.row.fixAttributeCommonVO.photoUrl : (defaultPhoto)"
                            >
                            <span style="margin-top:8px;margin-left:5px;float:left" :title="scope.row.fixAttributeCommonVO.attendeeName">{{ scope.row.fixAttributeCommonVO.attendeeName != null && scope.row.fixAttributeCommonVO.attendeeName.length > 4 ? scope.row.fixAttributeCommonVO.attendeeName.substr(0,4) + '...' : scope.row.fixAttributeCommonVO.attendeeName }}</span>
                            <span v-if="scope.row.fixAttributeCommonVO.honourFlag === 1" style="margin-top:8px;float:left">（主宾）</span>
                            <span v-else style="margin-top:8px;float:left">（随员）</span> -->
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="contactPerson"
                    label="手机"
                >
                    <template slot-scope="scope">
                        <PhoneEncryption :value="scope.row.fixAttributeCommonVO.phone" />
                        <!-- <div>
                            <span>{{ formatPhone(scope.row.fixAttributeCommonVO.phone) }}</span>
                            <span style="display:none">{{ scope.row.fixAttributeCommonVO.phone }}</span>
                            <el-button icon="el-icon-view" type="text" @click="(event) => qiehuanshoujijiami(event)" />
                        </div> -->
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
                    prop="fixAttributeCommonVO.organizationSortName"
                    label="单位简称/全称"
                    width="120"
                >
                    <template slot-scope="scope">
                        <div>{{ formatOrgName(scope.row.fixAttributeCommonVO.organizationSortName,scope.row.fixAttributeCommonVO.organizationName) }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="100"
                >
                    <template slot-scope="scope">
                        <el-button
                            type="tetx"
                            @click.native.prevent="chakan(scope.row)"
                        >
                            查看
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
            <div style="width:100%;height:5px" />
        </el-dialog>
        <FastCheckIn
            :title="title"
            :active-name="activeName"
            :dialog-visible="checkInDialogVisible"
            :attendee-id="attendeeId"
            @closeDialog="closeCheckinDialog"
        />
    </div>
</template>

<script>
import { getConferenceId } from '@/utils/conference-auth'
import { getList } from '@/api/attendee'
import { formatPhone, getTableHeight } from '@/utils/index'
import FastCheckIn from '@/views/conferenceOverview/inMeeting/fast-check-in'
import { getOssPublicBaseUrl } from '@/utils/x-sso-publicbaseurl'
export default {
    name: 'FastCheckInBefore',
    components: {
        FastCheckIn
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        activeName: {
            type: String,
            default: 'second'
        },
        title: {
            type: String,
            default: '查看行程'
        }
    },
    data() {
        return {
            checkInDialogVisible: false,
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
            tableHeight: getTableHeight(235),
            attendeeId: null,
            attendeeList: [],
            imagePath: getOssPublicBaseUrl(),
            pageInfo: {
                conferenceId: getConferenceId(),
                resFlag: 2,
                signStatusEqual: [3],
                pageNum: 1,
                pageSize: 10,
                total: 0,
                attendeeNameLike: null,
                phoneLike: null
            }
        }
    },
    watch: {
        dialogVisible(val) {
            if (val) {
                this.getAttendeeList()
            }
        }
    },
    methods: {
        closeCheckinDialog() {
            this.attendeeId = null
            this.checkInDialogVisible = false
        },
        closeDialog() {
            this.$emit('closeDialog', null)
        },
        chakan(val) {
            this.attendeeId = val.id
            this.checkInDialogVisible = true
        },
        search() {
            this.pageInfo.pageNum = 1
            this.getAttendeeList()
        },
        handleCurrentChange(val) {
            this.pageInfo.pageNum = val
            this.getList()
        },
        handleSizeChange(val) {
            this.pageInfo.pageSize = val
            this.getList()
        },
        getAttendeeList() {
            getList(this.pageInfo).then(res => {
                this.attendeeList = res.result.list
                this.pageInfo.total = res.result.total
            })
        },
        resetSearch() {
            this.pageInfo = {
                conferenceId: getConferenceId(),
                resFlag: 2,
                signStatusEqual: [3],
                pageNum: 1,
                pageSize: 10,
                total: this.pageInfo.total,
                attendeeNameLike: null,
                phoneLike: null
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
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
