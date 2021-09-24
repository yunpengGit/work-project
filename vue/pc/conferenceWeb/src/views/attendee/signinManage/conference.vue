<template>
    <div>
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
                    <el-form-item label="单位名称">
                        <el-input v-model.trim="pageInfo.allOrganizationNameLike" class="widthClass" maxlength="25" placeholder="" />
                    </el-form-item>
                    <el-form-item label="报到状态">
                        <el-select v-model="pageInfo.checkInStatus" class="width100Class" placeholder="全部" clearable>
                            <el-option :key="1" label="已报到" :value="1" />
                            <el-option :key="2" label="未报到" :value="2" />
                        </el-select>
                    </el-form-item>
                    </div>
                    <el-form-item  class="form_operation">
                        <el-button type="primary" @click="search">查询</el-button>
                        <el-button @click="resetSearch">重置</el-button>
                    </el-form-item>
                    </div>
                </el-form>
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
            <div style="float: left; text-center: left;margin-left:10px;padding-bottom:10px;height:42px;">
                <!-- v-permission="Global.buttons.ConferenceView.materialUpdate" -->
                <el-button v-permission="Global.buttons.SignInManage.signin" @click="signinBatch">批量报到</el-button>
            </div>
            <div style="float: right; text-center: right;padding-bottom:10px;height:42px;">
                <el-button v-if="signInCodeUrl !== null && signInCodeUrl !== ''" v-permission="Global.buttons.SignInManage.export" type="primary" @click="xiazaibaodaoma">下载报到码</el-button>
                <el-button v-permission="Global.buttons.SignInManage.export" type="primary" @click="exportResult">导出报到信息</el-button>
            </div>
            <el-table
                ref="table"
                :data="tableData"
                :height="tableHeight + ((this.$store.state.menu.buttons.indexOf(Global.buttons.ConferenceView.materialUpdate) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.ConferenceView.materialUpdate) !== -1
                ) ? 0: 32)"
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
                        <div>{{ formatTableCellData(formatOrgName(scope.row.fixAttributeCommonVO.organizationSortName,scope.row.fixAttributeCommonVO.organizationName)) }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="报到状态"
                >
                    <template slot-scope="scope">
                        {{
                            scope.row.checkInType !== null && scope.row.checkInType !== '' ? '已报到' : '未报到'
                        }}
                    </template>

                </el-table-column>
                <el-table-column
                    prop="checkInTime"
                    label="报到时间"
                >
                    <template slot-scope="scope">
                        <div>{{ formatTableCellData(scope.row.checkInTime) }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="180"
                >
                    <template slot-scope="scope">
                        <el-button
                            v-permission="Global.buttons.SignInManage.signin"
                            :disabled="scope.row.checkInType !== null && scope.row.checkInType !== ''"
                            @click.native.prevent="signin(scope.row)"
                        >
                            报到
                        </el-button>
                        <el-button
                            v-permission="Global.buttons.SignInManage.signin"
                            :disabled="scope.row.checkInType === null || scope.row.checkInType === ''"
                            @click.native.prevent="unsignin(scope.row)"
                        >
                            取消报到
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
    </div>
</template>

<script>
import { getView, downloadFile } from '@/api/conference'
import { getTableHeight, formatPhone } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
import { getList, checkInByOrganized, cancelCheckInByOrganized } from '@/api/attendee'
import { exportExcel } from '@/api/signin'
import { showTextLoading, showLoading, closeLoading } from '@/utils/loading'

// import Sortable from 'sortablejs'
export default {
    name: 'SigninConference',
    props: {
        activeName: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            oldSignInCodeUrl: null,
            signInCodeUrl: null,
            loading: false,
            tableData: [],
            tableHeight: getTableHeight(230),
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
            this.getConferenceView()
            this.search()
        }
    },
    created() {
        this.getConferenceView()
        this.search()
    },
    methods: {
        getConferenceView() {
            getView({ 'id': getConferenceId() }).then(res => {
                this.signInCodeUrl = res.result.signInCodeUrl
                this.oldSignInCodeUrl = res.result.oldSignInCodeUrl
            })
        },
        xiazaibaodaoma() {
            const load1 = showTextLoading('正在下载...')
            downloadFile({ filePath: this.oldSignInCodeUrl }).then(res => {
                if (decodeURI(res.headers['filename']) == null || decodeURI(res.headers['filename']) === 'undefined') {
                    this.$message('文件不存在')
                } else {
                    const blob = new Blob([res.data], { type: 'application/octet-stream' })

                    const fileName = this.oldSignInCodeUrl.substring(this.oldSignInCodeUrl.lastIndexOf('/') + 1, this.oldSignInCodeUrl.length)
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
                closeLoading(load1)
            }).catch(error => {
                console.log(error)
                closeLoading(load1)
            })
        },
        formatPhone(val) {
            return formatPhone(val)
        },
        exportResult() {
            const load = showLoading()

            this.pageInfo.conferenceId = getConferenceId()
            this.pageInfo.signStatusEqual = [3]
            var tempData = JSON.parse(JSON.stringify(this.pageInfo))
            tempData.pageSize = null
            tempData.pageNum = null
            exportExcel(tempData).then(res => {
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
        qiehuanshoujijiami(event) {
            if (event.currentTarget.parentElement.children[0].style.display === 'none') {
                event.currentTarget.parentElement.children[0].style.display = ''
                event.currentTarget.parentElement.children[1].style.display = 'none'
            } else {
                event.currentTarget.parentElement.children[0].style.display = 'none'
                event.currentTarget.parentElement.children[1].style.display = ''
            }
        },
        resetSearch() {
            this.pageInfo = {
                resFlag: 2,
                pageNum: 1,
                pageSize: 10,
                total: this.pageInfo.total
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        getList() {
            this.pageInfo.conferenceId = getConferenceId()
            this.pageInfo.signStatusEqual = [3]
            getList(this.pageInfo).then(res => {
                this.tableData = res.result.list
                this.pageInfo.total = res.result.total
            })
        },
        search() {
            this.pageInfo.pageNum = 1
            this.getList()
        },
        unsignin(row) {
            this.unsigninSubmit([row.id])
        },
        signin(row) {
            this.signinSubmit([row.id])
        },
        handleCurrentChange(val) {
            this.pageInfo.pageNum = val
            this.getList()
        },
        handleSizeChange(val) {
            this.pageInfo.pageSize = val
            this.getList()
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
            this.$confirm('请确认是否报到？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var checkInData = {
                    conferenceId: getConferenceId(),
                    attendeeIds: param,
                    signInType: 3
                }
                checkInByOrganized(checkInData).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        this.getList()
                    }
                })
            }).catch(() => {})
        },
        unsigninSubmit(param) {
            this.$confirm('请确认是否取消报到？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var checkInData = {
                    conferenceId: getConferenceId(),
                    attendeeIds: param
                }
                cancelCheckInByOrganized(checkInData).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        this.getList()
                    }
                })
            }).catch(() => {})
        }
    }
}
</script>
<style lang="scss" scoped>
.el-drawer__body {
    overflow: auto;
    /* overflow-x: auto; */
}

.el-drawer__container ::-webkit-scrollbar{
    display: none;
}

 .DataBriefing .el-scrollbar__wrap{
    overflow-x: hidden;
  }
.headerRowClassName {
    background-color: #f5f5f5 !important;
    padding-top: 6px !important;
    padding-bottom: 6px !important;
}
.tianjiahuiyizuzhiClass {
    width: 114px;
    height: 32px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #1E89FF;
}
.danhangxianshibuquan {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.widthClass {
    width: 150px;
}
</style>
