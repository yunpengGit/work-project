<template>
    <div class="">
        <el-row>
            <el-col :span="10" style="background-color:#FFFFFF;padding-left:15px">
                <!-- <el-input
                    v-model="filterText"
                    placeholder="输入议程名称搜索"
                    style="margin-top:10px;width:70%"
                />
                <el-button style="margin-left:12px;width:12%" type="primary" @click="search">查询</el-button>
                <el-button style="margin-left:3px;width:12%" @click="resetSearch">重置</el-button> -->

                <div style="margin-top:10px;height:10px" />
                <div>
                    <!-- <span style="padding-top:25px;color:#191F24">全部议程</span> -->
                    <el-button type="text" style="margin-left:5px;font-size:16px;color:#191F24" @click="quanbuyicheng">全部议程</el-button>

                    <el-button v-permission="Global.buttons.AttendeeAgenda.export" style="color:#191F24;float:right;margin-right:15px" @click="exportAgenda">导出</el-button>

                    <el-button v-permission="Global.buttons.AttendeeAgenda.yichengzuoweitu" style="color:#191F24;float:right;margin-right:15px" @click="yichengzuoweitu">议程座位图</el-button>
                </div>
                <div style="height:10px" />
                <div v-show="data !== null && data.length > 0" :style="{'height':paneHeight,'overflow-x':'hidden','overflow-y':'auto', 'padding-bottom': '10px'}">
                    <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                        <el-tree
                            v-show="data !== null && data.length > 0"
                            ref="tree"
                            :data="data"
                            :props="defaultProps"
                            default-expand-all
                            :filter-node-method="filterNode"
                            :expand-on-click-node="false"
                            :render-content="renderContent"
                        />
                    </el-scrollbar>
                </div>
                <div v-show="!(data !== null && data.length > 0)" :style="{'text-align':'center', 'height':paneHeight}">
                    <div style="margin-top:60px;"><img src="@/assets/table-no-data.png"></div>
                    <div style="margin-left:-12px;margin-top:20px;font-size: 14px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.48);line-height: 18px;">暂无数据</div>
                </div>
            </el-col>
            <el-col v-show="agendaId === null || agendaId === ''" :span="14" :style="{'background-color':'#EEF0F4', 'padding-left': '10px','padding-top':'10px'}">
                <h3 style="color: #191F24">全部议程</h3>
                <el-table
                    :data="tableDataAllAgenda"
                    style="width: 100%"
                    row-key="id"
                    border
                    default-expand-all
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                    :height="paneHeight"
                >
                    <!-- width="240" -->
                    <el-table-column
                        :label="getConferenceTemplate(1) + '活动时间'"
                    >
                        <template slot-scope="scope">
                            <!-- <span v-if="scope.row.conductDate === undefined || scope.row.conductDate === null || scope.row.conductDate === ''">{{ scope.row.date }}</span> -->
                            <span>
                                {{ scope.row.conductDate }}  {{ scope.row.startTime !== null && scope.row.startTime.length > 0 ? scope.row.startTime.substr(0, 5) : scope.row.startTime }}~{{ scope.row.endTime !== null && scope.row.endTime.length > 0 ? scope.row.endTime.substr(0, 5) : scope.row.endTime }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="议程标题"
                    />
                    <!-- width="90" -->
                    <el-table-column
                        label="人数"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.attendeeCount }}
                            <!-- <el-link v-show="scope.row.codePath !== null && scope.row.codePath !== ''" :href="imagePath + scope.row.codePath" type="primary">下载</el-link> -->
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col v-show="agendaId !== null && agendaId !== ''" :span="14" :style="{'background-color':'#EEF0F4', 'padding-left': '10px','padding-top':'10px'}">
                <div class="clearfix">
                    <div style="background-color: white;padding-left:10px;padding-top:10px;">
                        <el-form :inline="true" :model="pageInfo">
                            <el-form-item label="姓名">
                                <el-input v-model.trim="pageInfo.attendeeNameLike" class="width100Class" maxlength="25" />
                            </el-form-item>
                            <el-form-item label="手机">
                                <el-input v-model.trim="pageInfo.phoneLike" class="width100Class" maxlength="25" />
                            </el-form-item>
                            <el-form-item label="单位名称">
                                <el-input v-model.trim="pageInfo.allOrganizationNameLike" class="widthClass" maxlength="25" />
                            </el-form-item>
                            <el-form-item style="float: right">
                                <el-button type="primary" @click="tableSearch">查询</el-button>
                                <el-button @click="resetTableSearch">重置</el-button>
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
                            <el-form-item v-if="dakaichaxunClass === 0" label="职务">
                                <el-input v-model.trim="pageInfo.positionLike" class="widthClass" maxlength="25" placeholder="" />
                            </el-form-item>
                            <el-form-item v-if="dakaichaxunClass === 0" :label="getConferenceTemplate(2) + '类型'">
                                <el-select v-model="pageInfo.honourFlag" class="width100Class" placeholder="全部" clearable>
                                    <el-option :key="1" label="主宾" :value="1" />
                                    <el-option :key="0" label="随员" :value="0" />
                                </el-select>
                            </el-form-item>
                            <el-form-item v-if="pageInfo.honourFlag === 0" label="主宾姓名">
                                <el-input v-model.trim="pageInfo.honourNameLike" class="width100Class" maxlength="25" placeholder="" />
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div style="background-color: #EEF0F4;height:8px;width:100%" />
                <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
                    <div style="float: left; text-center: left;margin-left:10px;padding-bottom:10px">
                        <el-button v-permission="Global.buttons.AttendeeAgenda.deleteAttendee" :disabled="isRequiredAgenda" @click="deleteBatch">批量删除</el-button>
                    </div>
                    <div style="float: right; text-center: right;padding-bottom:10px">
                        <el-button v-permission="Global.buttons.AttendeeAgenda.addAttendee" :disabled="isRequiredAgenda" type="primary" @click="importAttendee">导入</el-button>
                        <el-button v-permission="Global.buttons.AttendeeAgenda.addAttendee" :disabled="isRequiredAgenda" type="primary" @click="add">添加</el-button>
                        <!-- <el-button v-permission="Global.buttons.AttendeeAgenda.importAttendee" @click="add">导入</el-button> -->
                    </div>
                    <el-table
                        ref="table"
                        :data="tableData"
                        :height="(dakaichaxunClass === 0 ? (tableHeight - 52) : tableHeight) + (this.$store.state.menu.buttons.indexOf(Global.buttons.AttendeeAgenda.deleteAttendee) !== -1 || this.$store.state.menu.buttons.indexOf(Global.buttons.AttendeeAgenda.addAttendee) !== -1 ? 0: 32)"
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
                                    <AttendeeInfomation :photo-url="scope.row.ssoUserPhoto" :attendee-name="scope.row.fixAttributeCommonVO.attendeeName" :attendee-role-flag="scope.row.fixAttributeCommonVO.attendeeRoleFlag" :honour-flag="scope.row.fixAttributeCommonVO.honourFlag" :sex="scope.row.fixAttributeCommonVO.sex" />
                                    <!-- <img
                                        style="width:40px;height:40px;float:left;border-radius:50%"
                                        :src="scope.row.fixAttributeCommonVO.photoUrl !== null && scope.row.fixAttributeCommonVO.photoUrl !== '' ? scope.row.fixAttributeCommonVO.photoUrl : (defaultPhoto)"
                                    >
                                    <div style="width:100%;padding-top:10px;">
                                        <span style="margin-left:5px;float:left" :title="scope.row.fixAttributeCommonVO.attendeeName">
                                            {{ scope.row.fixAttributeCommonVO.attendeeName != null && scope.row.fixAttributeCommonVO.attendeeName.length > 4 ? scope.row.fixAttributeCommonVO.attendeeName.substr(0,4) + '...' : scope.row.fixAttributeCommonVO.attendeeName }}</span>
                                        <span v-if="scope.row.fixAttributeCommonVO.honourFlag === 1" style="float:left">（主宾）</span>
                                        <span v-else style="float:left">（随员）</span>
                                    </div><br> -->
                                    <!-- <span style="width:100%;">{{ scope.row.fixAttributeCommonVO.phone }}</span> -->
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
                                <el-tag v-for="tagVO in scope.row.tagVOs" :key="tagVO.id" style="margin-left:4px" :style="{ backgroundColor: tagVO.backgroundColor, color: tagVO.fontColor }" type="info">
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
                            label="单位名称"
                        >
                            <template slot-scope="scope">
                                <div>{{ formatTableCellData(formatOrgName(scope.row.fixAttributeCommonVO.organizationSortName, scope.row.fixAttributeCommonVO.organizationName)) }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="180"
                        >
                            <template slot-scope="scope">
                                <el-button
                                    v-permission="Global.buttons.AttendeeAgenda.chakanzuoweitu"
                                    @click.native.prevent="filesSeat(scope.row)"
                                >
                                    座位图
                                </el-button>
                                <el-button
                                    v-permission="Global.buttons.AttendeeAgenda.deleteAttendee"
                                    :disabled="isRequiredAgenda"
                                    @click.native.prevent="del(scope.row)"
                                >
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="page-wrapper">
                        <el-pagination
                            :page-sizes="[10, 20, 30, 40]"
                            :current-page="pageInfo.pageNum"
                            :page-size="pageInfo.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="pageInfo.total"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                        />
                    </div>
                </div>
            </el-col>
        </el-row>
        <PickAllAttendee :dialog-visible="pickDialogVisible" @closeDialog="closePickAttendeeDialog" />
        <!-- <PickAttendee :pick-dialog-visible="pickDialogVisible" @closeDialog="closePickAttendeeDialog" /> -->
        <SeatingPlanList :dialog-visible="seatingPlanDialogVisible" @closeDialog="closeSeatingPlanDialog" />
        <ImportAttendeeAgenda :agenda-id="agendaId" :dialog-visible="importDialogVisible" @closeDialog="closeImportDialog" />
    </div>
</template>

<script>
import { getTableHeight, getSourceTypes } from '@/utils/index'
import { getList } from '@/api/attendee'
import { getConferenceId } from '@/utils/conference-auth'
import { getOssPublicBaseUrl } from '@/utils/x-sso-publicbaseurl'
// import PickAttendee from '../components/pickAttendee'
import PickAllAttendee from '../components/pickAllAttendee'
import SeatingPlanList from './seatingPlanList'
import { getList as getAgendaList, deleteByAttendeeIdsAndAgendaId, insertAgendaAttendee, getListNoDate, exportAgendaAttendee } from '@/api/agenda'
import { getList as getTagList } from '@/api/attendeeTag'
import { filesSeat } from '@/api/seatingPlan'
import { showLoading, closeLoading } from '@/utils/loading'
import ImportAttendeeAgenda from './importAttendeeAgenda'
export default {
    name: 'AttendeeAgenda',
    components: {
        ImportAttendeeAgenda,
        SeatingPlanList,
        PickAllAttendee
        // PickAttendee
    },
    data() {
        return {
            isRequiredAgenda: false,
            importDialogVisible: false,
            seatingPlanDialogVisible: false,
            tableDataAllAgenda: [],
            dakaichaxunClass: 1,
            tagList: [],
            sourceTypes: getSourceTypes(),
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
            data: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            agendaId: null,
            imagePath: getOssPublicBaseUrl(),
            pickDialogVisible: false,
            filterText: '',
            tableHeight: getTableHeight(170),
            tableData: [],
            paneHeight: getTableHeight(60) + 'px',
            multipleSelection: [],
            pageInfo: {
                attendeeRoleFlagEqual: [0, 1, 2, 3, 4],
                resFlag: 2,
                pageNum: 1,
                pageSize: 10,
                total: 0
            }
        }
    },
    created() {
        this.getAgendaList()
        this.getTagList()
        this.getListNoDate()
    },
    methods: {
        importAttendee() {
            this.importDialogVisible = true
        },
        closeImportDialog() {
            this.importDialogVisible = false
            this.tableSearch()
        },
        exportAgenda() {
            const load = showLoading()
            exportAgendaAttendee({ conferenceId: getConferenceId() }).then(res => {
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
        filesSeat(val) {
            var loadind = showLoading()
            filesSeat({ agendaId: this.agendaId, attendeeId: val.id }).then(res => {
                if (res.success) {
                    if (res.result !== null && res.result !== '') {
                        const link = document.createElement('a')
                        link.style.display = 'none'
                        link.href = res.result
                        link.setAttribute('download', '座位图.png')
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                    } else {
                        this.$message('座位图不存在')
                    }
                }
                closeLoading(loadind)
            }).catch(() => {
                closeLoading(loadind)
            })
        },
        yichengzuoweitu() {
            this.seatingPlanDialogVisible = true
        },
        closeSeatingPlanDialog() {
            this.seatingPlanDialogVisible = false
            this.getAgendaList()
            this.getTagList()
            this.getListNoDate()
        },
        getListNoDate() {
            getListNoDate({ 'conferenceId': getConferenceId() }).then(res => {
                this.tableDataAllAgenda = res.result
            })
        },
        quanbuyicheng() {
            this.agendaId = null
            this.getListNoDate()
        },
        dakaichaxun() {
            this.dakaichaxunClass = this.dakaichaxunClass === 1 ? 0 : 1
        },
        getTagList() {
            getTagList({ 'conferenceId': getConferenceId() }).then(res => {
                this.tagList = res.result.list
            })
        },
        closePickAttendeeDialog(val) {
            if (val !== null) {
                var dataTemp = {
                    agendaId: this.agendaId,
                    attendeeIds: val
                }
                insertAgendaAttendee(dataTemp).then(res => {
                    if (res.success) {
                        this.pickDialogVisible = false
                        this.getList()
                    }
                })
            } else {
                this.pickDialogVisible = false
                this.getList()
            }
        },
        add() {
            if (this.agendaId !== null) {
                this.pickDialogVisible = true
            }
        },
        getAgendaList() {
            getAgendaList({ 'conferenceId': getConferenceId() }).then(res => {
                this.data = res.result
            })
        },
        resetTableSearch() {
            this.pageInfo = {
                resFlag: 2,
                pageNum: 1,
                pageSize: 10,
                total: 0
            }
        },
        tableSearch() {
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
            this.pageInfo.agendaIdsIn = this.agendaId
            getList(this.pageInfo).then(res => {
                this.tableData = res.result.list
                this.pageInfo.total = res.result.total
            })
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
            this.$confirm('请确认是否删除该议程下人员信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteByAttendeeIdsAndAgendaId({ 'id': this.agendaId, 'attendeeIds': param }).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        this.tableSearch()
                    }
                })
            }).catch(() => {})
        },
        resetSearch() {
            this.filterText = null
            this.$refs.tree.filter(this.filterText)
        },
        search() {
            this.$refs.tree.filter(this.filterText)
        },
        getView(val) {
            this.agendaId = val.id
            this.isRequiredAgenda = val.freeFlag === 0
            this.getList()
        },
        filterNode(value, data) {
            if (!value) return true
            if (data.name !== undefined) {
                return data.name.indexOf(value) !== -1
            } else {
                return false
            }
        },
        renderContent(h, { node, data, store }) {
            if (data.parentId === undefined) {
                return (
                    <span class='custom-tree-node' style='width:100%;padding-right:10px;'>
                        <span style='font-size:14px;line-height:32px;color:#191F24;' title={ data.date }>{data.date}</span>
                    </span>)
            } else {
                var str = ''
                if (node.label.length > 10) {
                    str = node.label.substring(0, 10) + '...'
                } else {
                    str = node.label
                }
                var dateStr = (data.startTime !== null && data.startTime.length === 8 ? data.startTime.substr(0, 5) : data.startTime) +
                '~' + (data.endTime !== null && data.endTime.length === 8 ? data.endTime.substr(0, 5) : data.endTime)

                console.log(str)
                if (!node.isLeaf) {
                    return (
                        <span class='custom-tree-node' style='width:100%;padding-right:10px;padding-top:3px;height:40px' >
                            <span style='font-size:14px;line-height:32px;color:#191F24;' title={ node.label } on-click={ () => this.getView(data) }>{dateStr}<span style='margin-left:20px;'>{ str }</span><span v-show={ data.recommend !== null && data.recommend !== '' } style='padding-left:2px;padding-right:2px;margin-left:10px;background: #FF8200;color:white;width: 52px;height: 20px;border-radius: 3px;font-size: 11px;line-height:13px;padding:3px;font-size: 11px;line-height:13px;padding:3px;font-family: PingFangSC-Medium, PingFang SC;'>{ data.recommend }</span></span>
                        </span>)
                } else {
                    if (data.parentId === null || data.parentId === '' || data.parentId === undefined) {
                        return (
                            <span class='custom-tree-node' style='width:100%;padding-right:10px;padding-top:3px;height:40px'>
                                <span style='font-size:14px;line-height:32px;color:#191F24;' title={ node.label } on-click={ () => this.getView(data) }>{dateStr}<span style='margin-left:20px;'>{str}</span><span v-show={ data.recommend !== null && data.recommend !== '' } style='padding-left:2px;padding-right:2px;margin-left:10px;background: #FF8200;color:white;width: 52px;height: 20px;border-radius: 3px;font-size: 11px;line-height:13px;padding:3px;font-size: 11px;line-height:13px;padding:3px;font-family: PingFangSC-Medium, PingFang SC;'>{ data.recommend }</span></span>
                            </span>)
                    } else {
                        return (
                            <span class='custom-tree-node' style='width:100%;padding-right:10px;padding-top:3px;height:40px' >
                                <span style='font-size:14px;line-height:32px;color:#191F24 0.64;' title={ node.label } on-click={ () => this.getView(data) }>{dateStr}<span style='margin-left:20px;'>{str}</span><span v-show={ data.recommend !== null && data.recommend !== '' } style='padding-left:2px;padding-right:2px;margin-left:10px;background: #FF8200;color:white;width: 52px;height: 20px;border-radius: 3px;font-size: 11px;line-height:13px;padding:3px;font-size: 11px;line-height:13px;padding:3px;font-family: PingFangSC-Medium, PingFang SC;'>{ data.recommend }</span></span>
                            </span>)
                    }

                //
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.widthClass {
    width: 90px
}
.width100Class {
    width: 90px
}
.danhangxianshibuquan {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
