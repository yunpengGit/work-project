<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:8px">
        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form :inline="true" :model="pageInfo">
                    <el-form-item label="分组名称">
                        <el-input v-model.trim="pageInfo.nameLike" class="widthClass" maxlength="25" placeholder="" />
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
            <div style="float: left; text-center: left;margin-left:10px;padding-bottom:10px;">
                <el-button v-permission="Global.buttons.AttendeeGroup.delete" @click="deleteBatch">批量删除</el-button>
            </div>
            <div style="float: right; text-center: right;padding-bottom:10px;">
                <el-button v-permission="Global.buttons.AttendeeGroup.insert" type="primary" @click="add">添加</el-button>
                <el-button v-permission="Global.buttons.AttendeeGroup.import" @click="add">导入</el-button>
                <el-button v-permission="Global.buttons.AttendeeGroup.export" @click="add">导出查询结果</el-button>
            </div>
            <el-table
                ref="table"
                :data="tableData"
                :height="tableHeight + (this.$store.state.menu.buttons.indexOf(Global.buttons.AttendeeGroup.insert) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.AttendeeGroup.delete) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.AttendeeGroup.export) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.AttendeeGroup.import) !== -1 ? 0: 32)"
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
                    label="分组名称"
                />
                <el-table-column
                    prop="relationAttendeeNum"
                    label="关联人数"
                />
                <el-table-column
                    prop="createUserName"
                    label="添加人"
                />
                <el-table-column
                    prop="createTime"
                    label="添加时间"
                />
                <el-table-column
                    label="操作"
                    width="360"
                >
                    <template slot-scope="scope">
                        <el-button
                            v-permission="Global.buttons.AttendeeGroup.edit"
                            @click.native.prevent="edit(scope.row)"
                        >
                            编辑
                        </el-button>
                        <el-button
                            v-permission="Global.buttons.AttendeeGroup.delete"
                            @click.native.prevent="del(scope.row)"
                        >
                            删除
                        </el-button>
                        <el-button
                            @click.native.prevent="viewAttendee(scope.row)"
                        >
                            查看{{ getConferenceTemplate(2) }}
                        </el-button>
                        <el-button
                            v-permission="Global.buttons.AttendeeGroup.addAttendee"
                            @click.native.prevent="addAttendee(scope.row)"
                        >
                            添加{{ getConferenceTemplate(2) }}
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
                    <el-form-item label="分组名称" prop="name">
                        <el-input class="keepOutRight" v-model="ruleForm.name" show-word-limit maxlength="30" style="width:80%" placeholder="请输入姓名" />
                    </el-form-item>
                    <el-form-item label="分组描述" prop="description">
                        <el-input
                            v-model="ruleForm.description"
                            type="textarea"
                            :rows="8"
                            show-word-limit
                            maxlength="300"
                            placeholder="请输入分组描述"
                            style="width:80%"
                        />
                    </el-form-item>
                </el-scrollbar>
            </el-form>
            <div class="demo-drawer__footer" style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD">
                <el-button style="height:32px;margin-top:12px" @click="closeDialog">取 消</el-button>
                <el-button type="primary" :loading="loading" style="height:32px;margin-top:12px" @click="insert">保存</el-button>
            </div>
        </el-drawer>
        <GroupAttendeeList :group-name="groupName" :attendee-dialog-visible="attendeeDialogVisible" :group-id="groupId" @closeDialog="closeAttendeeDialog" />
        <PickAttendee :pick-dialog-visible="pickDialogVisible" @closeDialog="closePickAttendeeDialog" />
    </div>
</template>

<script>
import { getTableHeight } from '@/utils/index'
import { getList, insert, update, deleteBatch, getView, insertGroupAttendee } from '@/api/attendeeGroup'
import { getConferenceId } from '@/utils/conference-auth'
import GroupAttendeeList from './attendeeList'
import PickAttendee from '../components/pickAttendee'
export default {
    name: 'AttendeeGroup',
    components: {
        GroupAttendeeList,
        PickAttendee
    },
    props: {
    },
    data() {
        return {
            pickDialogVisible: false,
            attendeeDialogVisible: false,
            groupId: null,
            groupName: null,
            dialogHeight: getTableHeight(35) + 'px',
            multipleSelection: [],
            loading: false,
            ruleForm: {
                id: null,
                name: null,
                description: null
            },
            rules: {
                name: [{ required: true, message: '请输入分组名称', pattern: '[^ \x22]+', trigger: 'blur' }]
            },
            dialogTitle: '添加标签',
            dialogVisible: false,
            conferenceId: getConferenceId(),
            tableData: [],
            tableHeight: getTableHeight(170),
            pageInfo: {
                pageNum: 1,
                pageSize: 10,
                total: 0
            }
        }
    },
    created() {
        this.search()
    },
    methods: {
        addAttendee(val) {
            this.groupId = val.id
            this.groupName = val.name
            this.pickDialogVisible = true
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
                        this.groupId = null
                        this.groupName = null
                    }
                })
            } else {
                this.groupId = null
                this.groupName = null
                this.pickDialogVisible = false
            }
        },
        closeAttendeeDialog() {
            this.groupId = null
            this.groupName = null
            this.attendeeDialogVisible = false
            this.getList()
        },
        viewAttendee(val) {
            this.groupId = val.id
            this.groupName = val.name
            this.attendeeDialogVisible = true
        },
        resetSearch() {
            this.pageInfo = {
                pageNum: 1,
                pageSize: 10,
                total: this.pageInfo.total
            }
        },
        edit(val) {
            getView({ 'id': val.id }).then(res => {
                this.dialogTitle = '编辑分组'
                this.dialogVisible = true
                this.ruleForm.id = res.result.id
                this.ruleForm.name = res.result.name
                this.ruleForm.description = res.result.description
            })
        },
        add(val) {
            this.dialogTitle = '添加分组'
            this.dialogVisible = true
            this.ruleForm.id = null
            this.ruleForm.name = null
            this.ruleForm.description = null
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
            this.$confirm('请确认是否删除分组信息？', '', {
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
        }
    }
}
</script>
<style lang="scss" scoped>
.widthClass {
    width: 150px;
}
</style>
