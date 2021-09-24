<template>
    <el-drawer
        ref="drawer"
        :title="title"
        :before-close="closeDialog"
        :visible.sync="dialog"
        direction="rtl"
        custom-class="demo-drawer"
        size="60%"
        append-to-body
    >

        <el-form
            ref="form"
            size="small"
            label-width="127px"
            :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto'}"
        >
            <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">

                <div style="background-color: white;padding-left:10px;padding-right: 10px">
                    <div style="float: left; padding-bottom:10px">
                        <el-button type="primary" @click="handleDelete">
                            批量移除
                        </el-button>
                    </div>
                    <div style="float: right;padding-bottom:10px">
                        <!-- <el-button type="primary" @click="handleAdd">添加</el-button> -->

                    </div>
                    <el-table
                        ref="table"
                        :data="diningTaskAttendeeList"
                        style="width: 100%"
                        :height="tableHeight"
                        :row-class-name="tableRowClassName"
                        :header-cell-style="{
                            background:'#f7f7f7'
                        }"
                    >
                        <el-table-column type="selection" prop="id" />
                        <el-table-column label="姓名" align="left" width="100px">
                            <template slot-scope="scope">
                                <div style="height:32px">

                                    <span
                                        style="margin-top:8px;margin-left:5px;float:left"
                                        :title="scope.row.fixAttributeCommonVO.attendeeName"
                                    >{{ scope.row.fixAttributeCommonVO.attendeeName != null && scope.row.fixAttributeCommonVO.attendeeName.length > 4 ? scope.row.fixAttributeCommonVO.attendeeName.substr(0,4) + '...' : scope.row.fixAttributeCommonVO.attendeeName }}</span>

                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="职务" width="180px">
                            <template slot-scope="scope">
                                <div :title="scope.row.fixAttributeCommonVO.position" class="content1">
                                    {{ scope.row.fixAttributeCommonVO.position }}</div>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column label="标签"  >
                            <template slot-scope="scope">
                                <el-tag
                                    v-for="tagVO in scope.row.attendeeTagList"
                                    :key="tagVO.tagId"
                                    style="margin-left:4px"
                                    type="info"
                                >{{ tagVO.tagName }}</el-tag>
                            </template>
                        </el-table-column> -->
                        <el-table-column label="手机">
                            <template slot-scope="scope">
                                <PhoneEncryption :value="scope.row.fixAttributeCommonVO.phone" />
                                <!-- <div>
                                    <span>{{ formatPhone(scope.row.fixAttributeCommonVO.phone) }}</span>
                                    <span style="display:none">{{ scope.row.fixAttributeCommonVO.phone }}</span>
                                    <el-button icon="el-icon-view" type="text"
                                        @click="(event) => qiehuanshoujijiami(event)" />
                                </div> -->
                            </template>
                        </el-table-column>
                        <el-table-column label="单位简称/全称">
                            <template slot-scope="scope">
                                <div>
                                    {{ formatTableCellData( formatOrgName(scope.row.fixAttributeCommonVO.organizationSortName,scope.row.fixAttributeCommonVO.organizationName) ) }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="参会状态">
                            <template slot-scope="scope">
                                {{ scope.row.meetingStatusStr }}
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

                <PickAttendee
                    :pick-dialog-visible="pickDialogVisible"
                    :attendee-role-flag-equal="[0,1,2]"
                    @closeDialog="closePickAttendeeDialog"
                />

            </el-scrollbar>

        </el-form>

    </el-drawer>
</template>

<script>
import { getDiningTaskAttendeeList, deleteDiningTaskAttendee } from '@/api/dining'
import { addDiningTaskAttendee } from '@/api/dining'

import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
import PickAttendee from '@/views/attendee/components/pickAttendee'
import { getTableHeight, formatPhone } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
import commonSearch from '@/views/common/commonSearch'

export default {
    name: '',
    components: { PickAttendee, commonSearch },
    data() {
        return {

            diningTaskAttendeeList: [],
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
            tableHeight: getTableHeight(160),
            dialog: false,
            dialogHeight: getTableHeight(35) + 'px',
            title: ''
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
        //   this.paramData.taskId = this.$route.query.diningTaskId
        //   this.paramData.attendeeRoleFlagEqual = [0, 1, 2] // 20201114  列表查的不只是参会人 还有会务组和司机  所有任务下的参会人列表都要加入attendeeRoleFlagEqual  这个参数
        //  this.getListInfo(this.paramData)
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
        closePickAttendeeDialog(val) {
            if (val !== null) {
                var attendees = []
                val.forEach(item => {
                    attendees.push({ 'id': item })
                })
                var params = {
                    'taskId': this.paramData.taskId,
                    'attendees': attendees
                }
                console.log(params)
                addDiningTaskAttendee(params).then(res => {
                    if (res.success) {
                        this.pickDialogVisible = false
                        this.getListInfo(this.paramData)
                    }
                })
            } else {
                this.pickDialogVisible = false
            }
        },

        handleDelete() {
            var selectedList = this.$refs.table.selection
            if (selectedList.length == 0) {
                this.$message('至少选择一条记录')
                return
            }
            this.$confirm('请确认是否删除用餐人员信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delSelected()
            }).catch(() => { })
        },

        delSelected() {
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
            deleteDiningTaskAttendee(params).then(response => {
                if (response.success) {
                    this.$message('删除成功')
                    this.paramData.pageNum = 1
                    this.getListInfo(this.paramData)
                }
            })
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
            this.pickDialogVisible = true
        },

        tableRowClassName({ row, rowIndex }) {
            const index = rowIndex + 1
            if (index % 2 == 0) {
                return 'warning-row'
            }
        },
        // commonSearch组件参入参数
        onSubmit(param) {
            // var params = Object.assign({}, this.paramData, param);//由于我把paramData定义为即是初始化数据又是记录数据所以不能这样用，手动赋值吧
            var params = Object.assign({}, param)
            params['pageSize'] = this.paramData.pageSize
            params['pageNum'] = 1
            params['taskId'] = this.paramData.taskId
            params['attendeeRoleFlagEqual'] = [0, 1, 2, 3, 4]
            console.log(params)
            this.getListInfo(params)
        },

        changeTableHeight(val) {
            this.tableHeight = getTableHeight(val)
        },

        resetForm(form) {
            this.$refs[form].resetFields()
        },
        getListInfo(param) {
            getDiningTaskAttendeeList(param).then(response => {
                if (response.success) {
                    console.log('getDiningTaskAttendeeList' + response.result.list)
                    this.diningTaskAttendeeList = response.result.list
                    this.pageInfo.total = response.result.total
                    this.paramData = param
                }
            })
        },
        showView(row) {
            if (!row) {
                this.$message('打开异常')
                return
            } else {
                this.title = '查看用餐人员'
                this.paramData.taskId = row.id
                this.paramData.attendeeRoleFlagEqual = [0, 1, 2, 3, 4] // 20201114  列表查的不只是参会人 还有会务组和司机  所有任务下的参会人列表都要加入attendeeRoleFlagEqual  这个参数
                this.getListInfo(this.paramData)
            }
            this.dialog = true
        },

        closeDialog() {
            this.dialog = false
            this.$emit('getListInfo')
        }

    }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
.el-tag + .el-tag {
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
</style>
