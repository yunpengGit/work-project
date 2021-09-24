<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:8px">
        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <commonSearch ref="commonSearch" :show-arrive-and-return="false" @onSubmit="onSubmit"
                    @changeTableHeight="changeTableHeight" />
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
            <div style="float: left; padding-bottom:10px">
                <el-button type="primary" @click="handleDelete">
                    批量移除
                </el-button>
            </div>
            <div style="float: right;padding-bottom:10px">
                <el-button type="primary" @click="handleAdd">添加</el-button>

            </div>
            <el-table ref="table" :data="vehicleTaskAttendeeList" style="width: 100%" :height="tableHeight"
                :row-class-name="tableRowClassName" :header-cell-style="{
                    background:'#f7f7f7'
                }">
                <el-table-column type="selection" prop="id" />
                <el-table-column label="姓名" align="left" width="150px">
                    <template slot-scope="scope">
                        <div style="height:32px">
                            <img style="width:32px;height:32px;float:left;border-radius:50%"
                                :src="imagePath + (scope.row.fixAttributeCommonVO.photoUrl!== null && scope.row.fixAttributeCommonVO.photoUrl !== '' ? scope.row.fixAttributeCommonVO.photoUrl : defaultPhoto)">
                            <span style="margin-top:8px;margin-left:5px;float:left"
                                :title="scope.row.fixAttributeCommonVO.attendeeName">{{ scope.row.fixAttributeCommonVO.attendeeName != null && scope.row.fixAttributeCommonVO.attendeeName.length > 4 ? scope.row.fixAttributeCommonVO.attendeeName.substr(0,4) + '...' : scope.row.fixAttributeCommonVO.attendeeName }}</span>
                            <span v-if="scope.row.fixAttributeCommonVO.honourFlag === 1"
                                style="margin-top:8px;float:left">（主宾）</span>
                            <span v-else style="margin-top:8px;float:left">（随员）</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="职务" width="180px">
                    <template slot-scope="scope">
                        <div :title="scope.row.fixAttributeCommonVO.position" class="content1">
                            {{ scope.row.fixAttributeCommonVO.position }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="标签">
                    <template slot-scope="scope">
                        <el-tag v-for="tagVO in scope.row.attendeeTagList" :key="tagVO.tagId" style="margin-left:4px"
                            type="info">{{ tagVO.tagName }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="手机">
                    <template slot-scope="scope">
                        <div :title="scope.row.fixAttributeCommonVO.phone">{{ scope.row.fixAttributeCommonVO.phone }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="单位简称/全称">
                    <template slot-scope="scope">
                        <div>
                            {{ formatTableCellData(formatOrgName(scope.row.fixAttributeCommonVO.organizationSortName,scope.row.fixAttributeCommonVO.organizationName) )}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="参会状态">
                    <template slot-scope="scope">
                        {{ scope.row.signStatusStr }}
                    </template>
                </el-table-column>

            </el-table>
            <div class="page-wrapper">
                <el-pagination :current-page="paramData.pageNum" background :page-sizes="pageInfo.pageSizeList"
                    :page-size="paramData.pageSize" layout="total, prev, pager, next, sizes ,jumper"
                    :total="pageInfo.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </div>

        <PickAttendee :pick-dialog-visible="pickDialogVisible" :attendee-role-flag-equal="[0,1,3,4]"
            @closeDialog="closePickAttendeeDialog" />
    </div>
</template>
<script>
import { getVehicleTaskAttendeeList, deleteVehicleTaskAttendee } from '@/api/car'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
import PickAttendee from '@/views/attendee/components/pickAttendee'
import { addVehicleTaskAttendee } from '@/api/car'
import { getTableHeight } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
import commonSearch from '@/views/common/commonSearch'

export default {
    name: '',
    components: { PickAttendee, commonSearch },
    data () {
        return {

            vehicleTaskAttendeeList: [],
            paramData: {
                conferenceId: getConferenceId(),
                pageSize: 10,
                pageNum: 1
            },
            pickDialogVisible: false,
            pageInfo: {
                pageSizeList: [10, 20, 30],
                total: 0
            },
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
            imagePath: getOssBaseUrl(),
            tableHeight: getTableHeight(160)
        }
    },
    watch: {
        // '$route' () {  // 对route进行监控  添加返回时会调用刷新数据
        //     this.getListInfo()

        // }

    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created () { },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted () {
        this.paramData.taskId = this.$route.query.vehicleTaskId
        this.paramData.attendeeRoleFlagEqual = [0, 1, 2, 3, 4]
        this.getListInfo(this.paramData)
    },
    // 这里存放数据
    beforeCreate () { },
    // 生命周期 - 挂载之前
    beforeMount () { },
    // 生命周期 - 更新之前
    beforeUpdate () { },
    // 生命周期 - 更新之后
    updated () { },
    // 生命周期 - 销毁之前
    beforeDestroy () { },
    // 生命周期 - 销毁完成
    destroyed () { },
    // 如果页面有keep-alive缓存功能，这个函数会触发
    activated () { },
    methods: {

        closePickAttendeeDialog (val) {
            if (val !== null) {
                var attendees = []
                val.forEach(item => {
                    attendees.push({ 'id': item })
                })
                var params = {
                    'taskId': this.paramData.taskId,
                    'attendees': attendees,
                    'conferenceId': getConferenceId()
                }
                console.log(params)
                addVehicleTaskAttendee(params).then(res => {
                    if (res.success) {
                        this.pickDialogVisible = false
                        this.getListInfo(this.paramData)
                    }
                })
            } else {
                this.pickDialogVisible = false
            }
        },

        handleDelete () {
            var selectedList = this.$refs.table.selection
            if (selectedList.length == 0) {
                this.$message('至少选择一条记录')
                return
            }
            this.$confirm('请确认是否删除用车人员信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delSelected()
            }).catch(() => { })
        },

        delSelected () {
            var selectedList = this.$refs.table.selection
            if (selectedList.length == 0) {
                this.$message('至少选择一条记录')
                return
            }
            var attendees = []
            selectedList.forEach(item => {
                attendees.push({ 'id': item.id })
            })
            var params = {
                'taskId': this.paramData.taskId,
                'attendees': attendees
            }
            console.log(params)
            deleteVehicleTaskAttendee(params).then(response => {
                if (response.success) {
                    this.$message('删除成功')
                    this.paramData.pageNum = 1
                    this.getListInfo(this.paramData)
                }
            })
        },

        handleSizeChange (val) {
            console.log('长度改变：' + val)
            this.paramData.pageSize = val
            this.getListInfo(this.paramData)
        },
        handleCurrentChange (val) {
            console.log('当前页码改变：' + val)
            this.paramData.pageNum = val
            this.getListInfo(this.paramData)
        },
        handleAdd () {
            // this.$refs["addAttendee"].showEdit();
            this.pickDialogVisible = true
        },

        tableRowClassName ({ row, rowIndex }) {
            const index = rowIndex + 1
            if (index % 2 == 0) {
                return 'warning-row'
            }
        },
        // commonSearch组件参入参数
        onSubmit (param) {
            // var params = Object.assign({}, this.paramData, param);//由于我把paramData定义为即是初始化数据又是记录数据所以不能这样用，手动赋值吧
            var params = Object.assign({}, param)
            params['pageSize'] = this.paramData.pageSize
            params['pageNum'] = 1
            params['taskId'] = this.paramData.taskId
            params['attendeeRoleFlagEqual'] = [0, 1, 2, 3, 4]
            console.log(params)
            this.getListInfo(params)
        },

        changeTableHeight (val) {
            this.tableHeight = getTableHeight(val)
        },

        resetForm (form) {
            this.agendaId = []
            this.$refs[form].resetFields()
        },
        getListInfo (param) {
            getVehicleTaskAttendeeList(param).then(response => {
                if (response.success) {
                    console.log('getVehicleTaskAttendeeList' + response.result.list)
                    this.vehicleTaskAttendeeList = response.result.list
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
</style>
