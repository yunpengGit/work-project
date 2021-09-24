<template>
    <div class="">
        <el-row>
            <el-col :span="10" style="background-color:#FFFFFF;padding-left:15px">
                <div>
                    <el-button type="text" style="margin-left:5px;font-size:16px;color:#191F24" @click="quanbuyicheng">全部议程</el-button>

                    <el-button v-permission="Global.buttons.AttendeeAgenda.export" style="color:#191F24;float:right;margin-right:15px" @click="daochuquanbu">导出</el-button>
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
                    <div style="margin-top:60px;"><img src="@/assets/tree-no-data.png"></div>
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
                    :height="quanbuyichengHeight"
                >
                    <!-- width="240" -->
                    <el-table-column
                        label="会议活动时间"
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
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div style="background-color: #EEF0F4;height:8px;width:100%" />
                <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
                    <div style="float: left; text-center: left;margin-left:10px;padding-bottom:10px">
                        <!-- v-permission="Global.buttons.AttendeeAgenda.deleteAttendee" -->
                        <el-button v-permission="Global.buttons.SignInManage.signin" @click="signinBatch">批量签到</el-button>
                    </div>
                    <div style="float: right; text-center: right;padding-bottom:10px;">
                        <el-button v-permission="Global.buttons.AttendeeAgenda.export" type="primary" @click="daochudange">导出</el-button>
                    </div>
                    <el-table
                        ref="table"
                        :data="tableData"
                        :height="tableHeight + (this.$store.state.menu.buttons.indexOf(Global.buttons.AttendeeAgenda.deleteAttendee) !== -1 || this.$store.state.menu.buttons.indexOf(Global.buttons.AttendeeAgenda.addAttendee) !== -1 ? 0: 32)"
                        style="width: 100%;"
                        @selection-change="handleSelectionChange"
                    >
                        <el-table-column
                            type="selection"
                            width="55"
                        />
                        <el-table-column
                            prop="fixAttributeCommonVO.attendeeName"
                            label="姓名"
                        />
                        <el-table-column
                            label="职务"
                        >
                            <template slot-scope="scope">
                                <div :title="scope.row.fixAttributeCommonVO.position">{{ formatTableCellData(scope.row.fixAttributeCommonVO.position) }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="手机"
                        >
                            <template slot-scope="scope">
                                <PhoneEncryption :value="scope.row.fixAttributeCommonVO.phone" />
                                <!-- <div>
                                    <span>{{ formatTableCellData(formatPhone(scope.row.fixAttributeCommonVO.phone)) }}</span>
                                    <span style="display:none">{{ scope.row.fixAttributeCommonVO.phone }}</span>
                                    <el-button v-show="scope.row.fixAttributeCommonVO.phone !== null && scope.row.fixAttributeCommonVO.phone !== ''" icon="el-icon-view" type="text" @click="(event) => qiehuanshoujijiami(event)" />
                                </div> -->
                                <!-- <div @click="xianshi">aaa</div> -->
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="fixAttributeCommonVO.organizationSortName"
                            label="单位简称/全称"
                        >
                            <template slot-scope="scope">
                                <div>{{ formatTableCellData(formatOrgName(scope.row.fixAttributeCommonVO.organizationSortName, scope.row.fixAttributeCommonVO.organizationName)) }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="签到状态"
                        >
                            <template slot-scope="scope">
                                {{ scope.row.agendaVOs[0].signInStatusStr }}
                            </template>

                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="170"
                        >
                            <template slot-scope="scope">
                                <el-button
                                    v-permission="Global.buttons.SignInManage.signin"
                                    :disabled=" scope.row.agendaVOs[0].signInStatus === 1"
                                    @click.native.prevent="signin(scope.row)"
                                >
                                    签到
                                </el-button>
                                <el-button
                                    v-permission="Global.buttons.SignInManage.signin"
                                    :disabled=" scope.row.agendaVOs[0].signInStatus !== 1"
                                    @click.native.prevent="unsignin(scope.row)"
                                >
                                    取消签到
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
    </div>
</template>

<script>
import { getTableHeight, getSourceTypes, formatPhone } from '@/utils/index'
import { getList } from '@/api/attendee'
import { exportAgendaSigninExcel } from '@/api/signin'
import { showLoading, closeLoading } from '@/utils/loading'
import { getConferenceId } from '@/utils/conference-auth'
import { getList as getAgendaList, getListNoDate, agendaSignInByOrganized, agendaCancelByOrganized } from '@/api/agenda'
export default {
    name: 'SigninAgenda',
    components: {
    },
    props: {
        activeName: {
            type: String,
            default: null
        }
    },
    data() {
        return {
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
            pickDialogVisible: false,
            filterText: '',
            tableHeight: getTableHeight(225),
            tableData: [],
            paneHeight: getTableHeight(93) + 'px',
            quanbuyichengHeight: getTableHeight(110) + 'px',
            multipleSelection: [],
            pageInfo: {
                resFlag: 2,
                pageNum: 1,
                pageSize: 10,
                total: 0
            }
        }
    },
    watch: {
        activeName(val) {
            this.getAgendaList()
            this.getListNoDate()
        }
    },
    created() {
        this.getAgendaList()
        this.getListNoDate()
    },
    methods: {
        daochudange() {
            const load = showLoading()

            this.pageInfo.conferenceId = getConferenceId()
            this.pageInfo.signStatusEqual = [3]
            var tempData = JSON.parse(JSON.stringify(this.pageInfo))
            tempData.pageSize = null
            tempData.pageNum = null
            tempData.agendaIdsIn = this.agendaId
            tempData.allAgendaFlag = 0
            exportAgendaSigninExcel(tempData).then(res => {
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
        daochuquanbu() {
            const load = showLoading()

            this.pageInfo.conferenceId = getConferenceId()
            this.pageInfo.signStatusEqual = [3]
            var tempData = JSON.parse(JSON.stringify(this.pageInfo))
            tempData.pageSize = null
            tempData.pageNum = null
            tempData.allAgendaFlag = 1
            exportAgendaSigninExcel(tempData).then(res => {
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
        formatPhone(val) {
            return formatPhone(val)
        },
        exportResult() {},
        qiehuanshoujijiami(event) {
            if (event.currentTarget.parentElement.children[0].style.display === 'none') {
                event.currentTarget.parentElement.children[0].style.display = ''
                event.currentTarget.parentElement.children[1].style.display = 'none'
            } else {
                event.currentTarget.parentElement.children[0].style.display = 'none'
                event.currentTarget.parentElement.children[1].style.display = ''
            }
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
        unsignin(row) {
            //  var submitData = {
            //     attendeeIds: [this.attendeeId],
            //     agendaIds: [data.id]
            // }
            // agendaCancelByOrganized(submitData).then(res => {
            //     if (res.success) {
            //         this.$message(res.message)
            //         // this.getListByUser(this.attendeeId)
            //         data.signInType = null
            //         this.$emit('refreshChenInstatus', null)
            //         // that.innerHTML = '签到'
            //         // that.onclick = this.qiandao(node, data, event)
            //     }
            // })
            this.$confirm('请确认是否取消签到？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var submitData = {
                    conferenceId: getConferenceId(),
                    attendeeIds: [row.id],
                    agendaIds: [this.agendaId]
                }
                agendaCancelByOrganized(submitData).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        this.tableSearch()
                        // this.getListByUser(this.attendeeId)
                        // that.innerHTML = '取消签到'
                        // event = this.quxiaoqiandao(node, data, event)
                    }
                })
            }).catch(() => {})
        },
        signin(row) {
            this.signinSubmit([row.id])
        },
        signinBatch() {
            if (this.multipleSelection.length === 0) {
                this.$message('至少选择一条记录')
                return
            }
            const param = []
            this.multipleSelection.forEach(item => {
                param.push(item.id)
            })
            this.signinSubmit(param)
        },
        signinSubmit(param) {
            this.$confirm('请确认是否签到？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var submitData = {
                    conferenceId: getConferenceId(),
                    attendeeIds: param,
                    signInType: 3,
                    agendaId: this.agendaId
                }
                agendaSignInByOrganized(submitData).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        this.tableSearch()
                        // this.getListByUser(this.attendeeId)
                        // that.innerHTML = '取消签到'
                        // event = this.quxiaoqiandao(node, data, event)
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

                if (!node.isLeaf) {
                    return (
                        <span class='custom-tree-node' style='width:100%;padding-right:10px;padding-top:3px;height:40px' >
                            <span style='font-size:14px;line-height:32px;color:#191F24;' title={ node.label } on-click={ () => this.getView(data) }>{dateStr}<span style='margin-left:20px;'>{ str }</span><span v-show={ data.recommend !== null && data.recommend !== '' } style=''>{ data.recommend }</span></span>
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
