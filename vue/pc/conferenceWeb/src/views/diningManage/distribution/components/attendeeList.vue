<template>
    <el-drawer
        ref="drawer"
        :title="title"
        :before-close="handleClose"
        :visible.sync="dialog"
        direction="rtl"
        custom-class="demo-drawer"
        size="40%"
        append-to-body
    >

        <div style="padding-left:8px;padding-right:8px;margin-top:0px">
            <div class="clearfix">
                <div style="background-color: white;padding-left:10px;padding-top: 0px">
                    <el-form ref="form" :inline="true" :model="form">
                        <el-form-item label="姓名" prop="attendeeNameLike">
                            <el-input v-model.trim="form.attendeeNameLike" size="small" style="width: 120px" />
                        </el-form-item>
                        <el-form-item label="手机" prop="phoneLike">
                            <el-input v-model.trim="form.phoneLike" size="small" style="width: 120px" />
                        </el-form-item>

                        <el-form-item style="float: right;">
                            <el-button type="primary" @click="onSubmit">查询</el-button>
                            <el-button @click="resetForm('form')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div style="background-color: #EEF0F4;height:8px;width:100%" />
            <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">

                <el-table
                    ref="table"
                    :data="vehicleTaskAttendeeList"
                    style="width: 100%"
                    :height="tableHeight"
                    :row-class-name="tableRowClassName"
                    :header-cell-style="{
                        background:'#f7f7f7'
                    }"
                >
                    <el-table-column label="姓名" align="left" width="100px">
                        <template slot-scope="scope">
                            <div style="height:32px">
                                <!-- <img
                                    style="width:32px;height:32px;float:left;border-radius:50%"
                                    :src="imagePath + (scope.row.fixAttributeCommonVO.photoUrl!== null && scope.row.fixAttributeCommonVO.photoUrl !== '' ? scope.row.fixAttributeCommonVO.photoUrl : defaultPhoto)"
                                > -->
                                <span
                                    style="margin-top:8px;margin-left:5px;float:left"
                                    :title="scope.row.fixAttributeCommonVO.attendeeName"
                                >{{ scope.row.fixAttributeCommonVO.attendeeName != null && scope.row.fixAttributeCommonVO.attendeeName.length > 4 ? scope.row.fixAttributeCommonVO.attendeeName.substr(0,4) + '...' : scope.row.fixAttributeCommonVO.attendeeName }}</span>
                                <!-- <span v-if="scope.row.fixAttributeCommonVO.honourFlag === 1"
                                    style="margin-top:8px;float:left">（主宾）</span>
                                <span v-else style="margin-top:8px;float:left">（随员）</span> -->
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="职务" width="180px">
                        <template slot-scope="scope">
                            <div :title="scope.row.fixAttributeCommonVO.position" class="content1">
                                {{ formatTableCellData(scope.row.fixAttributeCommonVO.position) }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="手机">
                        <template slot-scope="scope">
                            <div :title="scope.row.fixAttributeCommonVO.phone">
                                {{ scope.row.fixAttributeCommonVO.phone }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="单位简称/全称">
                        <template slot-scope="scope">
                            <div>
                                {{ formatTableCellData(formatOrgName(scope.row.fixAttributeCommonVO.organizationSortName,scope.row.fixAttributeCommonVO.organizationName) ) }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleDeleteWithConfirm(scope.$index, scope.row)">移除
                            </el-button>
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

        </div>

    </el-drawer>
</template>

<script>
import { getDiningTaskAttendeeList, deleteDiningTaskAttendee } from '@/api/dining'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
import { getTableHeight } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
export default {
    name: '',
    // import引入的组件需要注入到对象中才能使用
    // 例如：import 《组件名称》 from '《组件路径》';
    components: {},
    data() {
        // 这里存放数据
        return {
            form: {
                conferenceId: getConferenceId(),
                attendeeNameLike: '',
                phoneLike: ''

            },
            paramData: {
                conferenceId: getConferenceId(),
                taskId: '',
                pageSize: 10,
                pageNum: 1

            },
            pageInfo: {
                pageSizeList: [10, 20, 30],
                total: 0
            },
            vehicleTaskAttendeeList: [],
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
            imagePath: getOssBaseUrl(),
            tableHeight: getTableHeight(110),
            dialog: false

        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {

        'dialog': function(val) {
            if (val) {

            }
        }

    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    // 这里存放数据
    beforeCreate() {
    },
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
    // 方法集合
    methods: {
        handleClose(done) {
            done()
            this.resetForm('form')
            this.$emit('getListInfo')
            this.dialog = false
        },

        showDialog(row) {
            if (!row) {
                this.$message('未接收到任务id')
            } else {
                this.title = '用餐人员信息'
                this.paramData.taskId = row.id
                this.paramData.attendeeRoleFlagEqual = [0, 1, 2, 3, 4]
                this.getListInfo(this.paramData)
                this.dialog = true
            }
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
        tableRowClassName({ row, rowIndex }) {
            const index = rowIndex + 1
            if (index % 2 == 0) {
                return 'warning-row'
            }
        },
        onSubmit() {
            var params = Object.assign({}, this.form)
            for (var key in params) {
                if (params[key] === '') {
                    delete params[key]
                }
            }
            // 这里需要加入pageSize和pageNum参数
            params['pageSize'] = this.paramData.pageSize
            params['pageNum'] = 1
            params['taskId'] = this.paramData.taskId
            params['attendeeRoleFlagEqual'] = [0, 1, 2, 3, 4]
            this.getListInfo(params)
        },
        resetForm(form) {
            this.$refs[form].resetFields()
        },
        getListInfo(param) {
            getDiningTaskAttendeeList(param).then(response => {
                if (response.success) {
                    console.log('getDiningTaskAttendeeList' + response.result.list)
                    this.vehicleTaskAttendeeList = response.result.list
                    this.pageInfo.total = response.result.total
                    this.paramData = param
                }
            })
        },

        handleDeleteWithConfirm(index, row) {
            this.$confirm('请确认是否移除该' + this.getConferenceTemplate(2), '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.handleDelete(index, row)
            }).catch(() => { })
        },

        //
        handleDelete(index, item) {
            const attendees = []
            attendees.push({ 'attendeeId': item.id })
            deleteDiningTaskAttendee({
                'taskId': this.paramData.taskId, 'dinnerAttendees': attendees
            }).then(res => {
                if (res.success) {
                    this.$message('操作成功')
                    this.getListInfo(this.paramData)
                }
            })
        }

    }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
::v-deep .el-table .warning-row {
    background: #f7f7f7;
}
</style>
