<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:8px">
        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <commonSearch
                    ref="commonSearch"
                    :dinner-info-height-flag="true"
                    @onSubmit="onSubmit"
                    @changeTableHeight="changeTableHeight"
                />
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">

            <div style="float: right;padding-bottom:10px">
                <!-- <el-dropdown @command="handleCommand">
                    <el-button>
                        列表筛选<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="cancelTask">基本字段</el-dropdown-item>
                        <el-dropdown-item command="deleteTask"> 全部字段</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown> -->
                <el-button v-permission="buttons.DiningAttendeeInfo.export" @click="exportExcel">导出查询结果</el-button>

            </div>
            <el-table
                ref="table"
                :data="attendeeInfoList"
                style="width: 100%"
                :height="tableHeight+ (this.$store.state.menu.buttons.indexOf(Global.buttons.DiningAttendeeInfo.export) !== -1
                    ? 0: 32)"
                :row-class-name="tableRowClassName"
                :header-cell-style="{
                    background:'#f7f7f7'
                }"
            >
                <el-table-column type="selection" prop="id" />
                <!-- <el-table-column label="姓名" align="left" width="150px">
                    <template slot-scope="scope">
                        <div style="height:32px">
                            <img style="width:32px;height:32px;float:left;border-radius:50%"
                                :src="imagePath + (scope.row.fixAttributeCommonVO.photoUrl!== null && scope.row.fixAttributeCommonVO.photoUrl !== '' ? scope.row.fixAttributeCommonVO.photoUrl : defaultPhoto)">
                            <span style="margin-top:8px;margin-left:5px;float:left"
                                :title="scope.row.fixAttributeCommonVO.attendeeName">{{ scope.row.fixAttributeCommonVO.attendeeName != null && scope.row.fixAttributeCommonVO.attendeeName.length > 4 ? scope.row.fixAttributeCommonVO.attendeeName.substr(0,4) + '...' : scope.row.fixAttributeCommonVO.attendeeName }}</span>
                            <span v-if="scope.row.attendeeRoleFlag===0"> <span
                                    v-if="scope.row.fixAttributeCommonVO.honourFlag === 1"
                                    style="margin-top:8px;float:left">（主宾）</span>
                                <span v-else style="margin-top:8px;float:left">（随员）</span> </span>
                        </div>
                    </template>
                </el-table-column> -->
                <el-table-column prop="name" label="姓名" :min-width="130">
                    <template slot-scope="scope">
                        <AttendeeInfomation :accompany-flag="2" :accompany-totips="scope.row.accompanyTotips" :photo-url="scope.row.ssoUserPhoto" :attendee-name="scope.row.fixAttributeCommonVO.attendeeName" :attendee-role-flag="scope.row.fixAttributeCommonVO.attendeeRoleFlag" :honour-flag="scope.row.fixAttributeCommonVO.honourFlag" :sex="scope.row.fixAttributeCommonVO.sex" />
                    </template>
                </el-table-column>
                <el-table-column label="职务" width="120px">
                    <template slot-scope="scope">
                        <div :title="scope.row.fixAttributeCommonVO.position" class="content1">
                            {{ formatTableCellData(scope.row.fixAttributeCommonVO.position) }}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="手机">
                    <template slot-scope="scope">
                        <PhoneEncryption :value="scope.row.fixAttributeCommonVO.phone" />
                        <!-- <div>
                            <span>{{ formatPhone(scope.row.fixAttributeCommonVO.phone) }}</span>
                            <span style="display:none">{{ scope.row.fixAttributeCommonVO.phone }}</span>
                            <el-button icon="el-icon-view" type="text" @click="(event) => qiehuanshoujijiami(event)" />
                        </div> -->
                    </template>
                </el-table-column>
                <el-table-column label="单位简称/全称">
                    <template slot-scope="scope">
                        <div>
                            {{ formatTableCellData(formatOrgName(scope.row.fixAttributeCommonVO.organizationSortName,scope.row.fixAttributeCommonVO.organizationName) ) }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="参会状态">
                    <template slot-scope="scope">
                        {{ scope.row.meetingStatusStr }}
                    </template>
                </el-table-column>
                <el-table-column label="用餐信息">
                    <template slot-scope="scope">
                        <el-popover
                            v-if="scope.row.dinnerTaskList !=null && scope.row.dinnerTaskList.length>0 "
                            placement="bottom-start"
                            width="250px"
                            trigger="hover"
                        >
                            <div v-for="dinnerTaskList in scope.row.dinnerTaskList" :key="dinnerTaskList.id">
                                {{ dinnerTaskList.dinnerDate }} &nbsp;&nbsp;
                                {{ dinnerTaskList.startTime.slice(0,5) }}~
                                {{ dinnerTaskList.endTime.slice(0,5) }} &nbsp;&nbsp;
                                {{ dinnerTaskList.dining.dinnerRoom }}&nbsp;&nbsp;
                                {{ dinnerTaskList.typeCode }}

                            </div>
                            <div
                                v-if="scope.row.dinnerTaskList !=null && scope.row.dinnerTaskList.length>0 "
                                slot="reference"
                                class="content"
                            >
                                {{ scope.row.dinnerTaskList[0].dinnerDate }} &nbsp;&nbsp;
                                {{ scope.row.dinnerTaskList[0].startTime.slice(0,5) }}~
                                {{ scope.row.dinnerTaskList[0].endTime.slice(0,5) }} &nbsp;&nbsp;
                                {{ scope.row.dinnerTaskList[0].dining.dinnerRoom }}&nbsp;&nbsp;
                                {{ scope.row.dinnerTaskList[0].dining.dinnerTypes }}

                            </div>
                        </el-popover>

                    </template>
                </el-table-column>
                <el-table-column label="操作" width="220px">
                    <template slot-scope="scope">
                        <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">查看详情</el-button> -->
                        <el-button size="mini" @click="chakanxingcheng(scope.row.id)">查看用餐</el-button>
                    </template>
                </el-table-column>

            </el-table>
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
        <Chakanxingcheng
            :title="'查看用餐'"
            :default-check="defaultCheck"
            :attendee-id="attendeeId"
            :dialog-visible="chakanxingchengDialogVisible"
            @closeDialog="closeChakanxingcheng"
        />
    </div>
</template>
<script>
import { getAttendeeInfoList } from '@/api/dining'

import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
import { addVehicleTaskAttendee } from '@/api/car'

import { getTableHeight, formatPhone } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
import commonSearch from '@/views/common/commonSearch'
import Chakanxingcheng from '@/views/common/chakanxingcheng'
import { showLoading, closeLoading } from '@/utils/loading'
import { exportDinnerTaskAttendeeQuery } from '@/api/synergyFiles'
export default {
    name: '',
    components: { commonSearch, Chakanxingcheng },
    data() {
        return {
            buttons: this.Global.buttons,
            defaultCheck: '',
            attendeeId: null,
            chakanxingchengDialogVisible: false,
            attendeeInfoList: [],
            paramData: {
                conferenceId: getConferenceId(),
                pageSize: 10,
                pageNum: 1,
                attendeeRoleFlagEqual: [0, 1, 2, 3, 4],
                hasLinkAttendee: 1
            },
            pageInfo: {
                pageSizeList: [10, 20, 30],
                total: 0
            },
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
            imagePath: getOssBaseUrl(),
            tableHeight: getTableHeight(178)
        }
    },
    watch: {
        // '$route' () {  // 对route进行监控  添加返回时会调用刷新数据
        //     this.getListInfo()

        // }

    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() { },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.getListInfo(this.paramData)
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
        exportExcel() {
            const load = showLoading()
            var exportParams = this.$refs.commonSearch.getSearchData()
            exportParams['attendeeRoleFlagEqual'] = [0, 1, 2, 3, 4]
            exportParams['hasLinkAttendee'] = 1

            exportDinnerTaskAttendeeQuery(exportParams).then(res => {
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
        chakanxingcheng(attendeeId) {
            this.defaultCheck = 'useDinnerFlag'
            this.attendeeId = attendeeId
            this.chakanxingchengDialogVisible = true
        },
        closeChakanxingcheng() {
            this.defaultCheck = null
            this.attendeeId = null
            this.chakanxingchengDialogVisible = false
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
        changeTableHeight(val) {
            this.tableHeight = getTableHeight(val)
        },
        handleCommand(command) {
            this.$confirm('请确认是否删除用餐人员信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (command == 'cancelTask') {
                    //  this.cancelSelected()
                }
                if (command == 'deleteTask') {
                    //   this.delSelected()
                }
            }).catch(() => { })
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
        handleAdd() {
            // this.$refs["addAttendee"].showEdit();
            // this.pickDialogVisible = true
        },

        tableRowClassName({ row, rowIndex }) {
            const index = rowIndex + 1
            if (index % 2 == 0) {
                return 'warning-row'
            }
        },
        // commonSearch组件参入参数
        onSubmit(param) {
            var params = Object.assign({}, param)
            params['pageSize'] = this.paramData.pageSize
            params['pageNum'] = 1
            params['attendeeRoleFlagEqual'] = [0, 1, 2, 3, 4]
            params['hasLinkAttendee'] = 1

            console.log(params)
            this.getListInfo(params)
        },
        resetForm(form) {
            this.$refs[form].resetFields()
        },
        getListInfo(param) {
            getAttendeeInfoList(param).then(response => {
                if (response.success) {
                    console.log('getAttendeeInfoList' + response.result.list)
                    this.attendeeInfoList = response.result.list
                    this.pageInfo.total = response.result.total
                    this.paramData = param
                }
            })
        }
    }
}
</script>
<style lang='scss' scoped >
// ::v-deep .el-table tr {
//     background: #c0c0c0;
// } // 单数行的颜色

::v-deep .el-table .warning-row {
    background: #f7f7f7;
}
.content {
    display: -webkit-box;
    overflow: hidden;
    white-space: normal !important;
    text-overflow: ellipsis;
    word-wrap: break-word;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}
</style>
