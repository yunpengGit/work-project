<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:8px">
        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form :inline="true" :model="pageInfo">
                    <el-form-item label="内容">
                        <el-input v-model.trim="pageInfo.noticeContentLike" class="widthClass" maxlength="25" placeholder="" />
                    </el-form-item>
                    <el-form-item label="上线时间">
                        <el-date-picker
                            v-model="startTimes"
                            type="datetimerange"
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            align="right"
                            class="inputcontent"
                        />
                    </el-form-item>
                    <el-form-item style="float: right">
                        <el-button type="primary" @click="search">查询</el-button>
                        <el-button @click="resetSearch">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
            <el-table
                ref="table"
                :data="tableData"
                :height="tableHeight"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
            >
                <el-table-column
                    type="selection"
                    width="55"
                />
                <el-table-column
                    prop="noticeContent"
                    label="内容"
                    width="180"
                />
                <el-table-column
                    label="发送范围"
                >
                    <template slot-scope="scope">
                        <span v-show="scope.row.noticeScope === '0'">全体</span>
                        <span v-show="scope.row.noticeScope === '1'">仅会务组</span>
                        <span v-show="scope.row.noticeScope === '2'">仅{{ getConferenceTemplate(2) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="状态"
                >
                    <template slot-scope="scope">
                        <span v-show="scope.row.status === 0">草稿</span>
                        <span v-show="scope.row.status === 1">已上线</span>
                        <span v-show="scope.row.status === 2">已下线</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="onlineTime"
                    label="上线时间"
                >
                    <template slot-scope="scope">
                        {{ scope.row.onlineTime !== null && scope.row.onlineTime !== '' ? (scope.row.onlineTime.length === 19 ? scope.row.onlineTime.substr(0,16) : scope.row.onlineTime) : '-' }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="offlineTime"
                    label="下线时间"
                >
                    <template slot-scope="scope">
                        {{ scope.row.offlineTime !== null && scope.row.offlineTime !== '' ? (scope.row.offlineTime.length === 19 ? scope.row.offlineTime.substr(0,16) : scope.row.offlineTime) : '-' }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="100"
                >
                    <template slot-scope="scope">
                        <el-button
                            @click.native.prevent="edit(scope.row)"
                        >
                            详情
                        </el-button>
                        <!-- <el-button
                            v-show="scope.row.status !== 1"
                            @click.native.prevent="shangxian(scope.row)"
                        >
                            上线
                        </el-button>
                        <el-button
                            v-show="scope.row.status === 1"
                            @click.native.prevent="xiaxian(scope.row)"
                        >
                            下线
                        </el-button>
                        <el-button
                            @click.native.prevent="del(scope.row)"
                        >
                            删除
                        </el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <div class="page-wrapper">
                <el-pagination
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageInfo.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageInfo.total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </div>
        <el-drawer
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            :before-close="closeDialog"
            size="40%"
        >
            <el-form
                ref="ruleForm"
                :model="ruleForm"
                :rules="rules"
                label-width="120px"
                class="demo-ruleForm"
                :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto',}"
            >
                <!-- 'border-top': 'solid #ccc 1px' -->
                <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                    <el-form-item label="发布范围" prop="noticeScope">
                        <el-radio-group v-model="ruleForm.noticeScope">
                            <el-radio :disabled="true" label="0">全体</el-radio>
                            <el-radio :disabled="true" label="1">仅会务组</el-radio>
                            <el-radio :disabled="true" label="2">仅{{ getConferenceTemplate(2) }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="通知内容" prop="noticeContent">
                        <el-input
                            v-model="ruleForm.noticeContent"
                            :disabled="true"
                            type="textarea"
                            :rows="8"
                            show-word-limit
                            maxlength="200"
                            style="width:80%"
                        />
                    </el-form-item>
                </el-scrollbar>
            </el-form>
            <div class="demo-drawer__footer" style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD">
                <!-- <el-button :disabled="ruleForm != null && ruleForm.status === 1" type="primary" :loading="loading" style="height:32px;margin-top:12px" @click="insert">保存</el-button> -->
                <el-button style="height:32px;margin-top:12px" @click="closeDialog">取 消</el-button>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { getTableHeight } from '@/utils/index'
import { getList, insert, update, deleteBatch, getView, updateStatusBatch } from '@/api/noticeInside'
import { getConferenceId } from '@/utils/conference-auth'
export default {
    name: 'AttendeeNoticeInside',
    components: {
    },
    props: {
    },
    data() {
        return {
            dialogHeight: getTableHeight(35) + 'px',
            multipleSelection: [],
            loading: false,
            ruleForm: {
                id: null,
                noticeScope: '0',
                noticeContent: null
            },
            rules: {
                noticeScope: [{ required: true, message: '请选择发布范围', trigger: 'change' }],
                noticeContent: [{ required: true, message: '请输入通知内容', pattern: '[^ \x22]+', trigger: 'blur' }]
            },
            dialogTitle: '添加通知',
            dialogVisible: false,
            conferenceId: getConferenceId(),
            tableData: [],
            tableHeight: getTableHeight(122),
            startTimes: [],
            endTimes: [],
            pageInfo: {
                pageNum: 1,
                pageSize: 10,
                total: 0,
                noticeScopes: ['0', '1'],
                status: 1
            }
        }
    },
    created() {
        this.search()
    },
    methods: {
        resetSearch() {
            this.startTimes = []
            this.endTimes = []
            this.pageInfo = {
                pageNum: 1,
                pageSize: 10,
                total: this.pageInfo.total,
                noticeScopes: ['0', '1'],
                status: 1
            }
        },
        edit(val) {
            getView({ 'id': val.id }).then(res => {
                this.dialogTitle = '编辑通知'
                this.dialogVisible = true
                this.ruleForm = res.result
            })
        },
        add(val) {
            this.dialogTitle = '添加通知'
            this.dialogVisible = true
            this.ruleForm = {
                id: null,
                noticeScope: '0',
                noticeContent: null
            }
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
            this.$confirm('请确认是否删除通知信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteBatch({ 'ids': param }).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        this.search()
                    }
                })
            }).catch(() => {})
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        insert() {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    this.ruleForm.conferenceId = this.conferenceId
                    if (this.ruleForm.id !== null && this.ruleForm.id !== '' && this.ruleForm.id !== undefined) {
                        update(this.ruleForm).then(res => {
                            this.loading = true
                            if (res.success) {
                                this.$message('保存成功')
                                this.closeDialog()
                                this.getList()
                                this.loading = false
                            }
                        }).catch(() => {
                            this.loading = false
                        })
                    } else {
                        insert(this.ruleForm).then(res => {
                            if (res.success) {
                                this.$message('保存成功')
                                this.closeDialog()
                                this.getList()
                                this.loading = false
                            }
                        }).catch(() => {
                            this.loading = false
                        })
                    }
                }
            })
        },
        closeDialog(val) {
            this.dialogVisible = false
            this.search()
            this.$refs['ruleForm'].resetFields()
            this.ruleForm.id = null
        },
        getList() {
            this.pageInfo.conferenceId = this.conferenceId
            if (this.startTimes !== null && this.startTimes.length > 0) {
                this.pageInfo.onlineTimeStart = this.startTimes[0]
                this.pageInfo.onlineTimeEnd = this.startTimes[1]
            } else {
                this.pageInfo.onlineTimeStart = null
                this.pageInfo.onlineTimeEnd = null
            }
            if (this.endTimes !== null && this.endTimes.length > 0) {
                this.pageInfo.offlineTimeStart = this.endTimes[0]
                this.pageInfo.offlineTimeEnd = this.endTimes[1]
            } else {
                this.pageInfo.offlineTimeStart = null
                this.pageInfo.offlineTimeEnd = null
            }
            getList(this.pageInfo).then(res => {
                this.tableData = res.result.list
                this.pageInfo.total = res.result.total
            })
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
        shangxian(row) {
            this.$confirm('请确认是否上线通知信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var dataTemp = {
                    ids: [row.id],
                    status: 1
                }
                this.updateStatus(dataTemp)
            })
        },
        xiaxian(row) {
            this.$confirm('请确认是否下线通知信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var dataTemp = {
                    ids: [row.id],
                    status: 2
                }
                this.updateStatus(dataTemp)
            })
        },
        updateStatus(val) {
            updateStatusBatch(val).then(res => {
                if (res.success) {
                    this.$message(res.message)
                    this.getList()
                }
            }).catch(() => {})
        }
    }
}
</script>
<style lang="scss" scoped>
.widthClass {
    width: 150px;
}
</style>
