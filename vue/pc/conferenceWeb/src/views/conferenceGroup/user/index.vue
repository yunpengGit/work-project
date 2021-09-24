<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:8px">
        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form :inline="true" :model="pageInfo">
                    <el-form-item label="姓名">
                        <el-input v-model.trim="pageInfo.conferenceGroupUserNameLike" class="widthClass" maxlength="25" placeholder="" />
                    </el-form-item>
                    <el-form-item label="手机">
                        <el-input v-model.trim="pageInfo.conferenceGroupUserMobilLike" class="widthClass" maxlength="25" placeholder="" />
                    </el-form-item>
                    <el-form-item label="单位名称">
                        <el-input v-model.trim="pageInfo.organizationNameOrShortNameLike" class="widthClass" maxlength="25" placeholder="" />
                    </el-form-item>
                    <el-form-item label="角色">
                        <el-select v-model="pageInfo.conferenceGroupRoleId" placeholder="全部" clearable>
                            <el-option
                                v-for="item in roles"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
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
                <el-button v-permission="Global.buttons.ConferenceGroupUser.delete" @click="deleteBatch">批量删除</el-button>
            </div>
            <div style="float: right; text-center: right;padding-bottom:10px;">
                <el-button v-permission="Global.buttons.ConferenceGroupUser.insert" type="primary" @click="add">添加</el-button>
                <!-- <el-button v-permission="Global.buttons.ConferenceGroupUser.export" @click="add">导出查询结果</el-button> -->
            </div>
            <el-table
                ref="table"
                :data="tableData"
                :height="tableHeight + (this.$store.state.menu.buttons.indexOf(Global.buttons.ConferenceGroupUser.delete) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.ConferenceGroupUser.insert) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.ConferenceGroupUser.export) !== -1 ? 0: 32)"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
            >
                <el-table-column
                    type="selection"
                    width="55"
                    :selectable="selectInit"
                />
                <!-- width="180" -->
                <el-table-column
                    prop="userName"
                    label="会务组人员"
                />
                <el-table-column
                    prop="mobile"
                    label="手机"
                >
                    <template slot-scope="scope">
                        <PhoneEncryption :value="scope.row.mobile" />
                        <!-- <div>
                            <span>{{ formatPhone(scope.row.mobile) }}</span>
                            <span style="display:none">{{ scope.row.mobile }}</span>
                            <el-button icon="el-icon-view" type="text" @click="(event) => qiehuanshoujijiami(event)" />
                        </div> -->
                    </template>
                </el-table-column>
                <el-table-column
                    prop="createUserName"
                    label="单位简称/全称"
                >
                    <template slot-scope="scope">
                        <div>{{ formatTableCellData(formatOrgName(scope.row.organizationShortName, scope.row.organizationName)) }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="角色"
                >
                    <template slot-scope="scope">
                        <el-tag v-for="conferenceGroupRole in scope.row.conferenceGroupRoleList" :key="conferenceGroupRole.id" style="margin-left:4px" type="info">{{ conferenceGroupRole.name }}</el-tag>
                    </template>
                </el-table-column>
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
                    width="150"
                >
                    <template slot-scope="scope">
                        <el-button
                            v-permission="Global.buttons.ConferenceGroupUser.edit"
                            @click.native.prevent="edit(scope.row)"
                        >
                            编辑
                        </el-button>
                        <el-button
                            v-permission="Global.buttons.ConferenceGroupUser.delete"
                            :disabled="scope.row.defaultFlag === 1"
                            @click.native.prevent="del(scope.row)"
                        >
                            删除
                        </el-button>
                        <!-- <el-button
                            @click.native.prevent="viewAttendee(scope.row)"
                        >
                            查看人员
                        </el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <div class="page-wrapper">
                <el-pagination
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageInfo.pageSize"
                    :current-page="pageInfo.pageNum"
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
                    <el-form-item label="姓名" prop="userName">
                        <el-input v-model="ruleForm.userName" class="keepOutRight" :disabled="ruleForm.id !== undefined && ruleForm.id !== null && ruleForm.id !== ''" show-word-limit maxlength="30" style="width:80%" placeholder="请输入姓名" @blur="getUser" />
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="ruleForm.mobile" class="keepOutRight" :disabled="ruleForm.id !== undefined && ruleForm.id !== null && ruleForm.id !== ''" show-word-limit maxlength="11" style="width:80%" placeholder="请输入手机" @blur="getUser" />
                    </el-form-item>
                    <el-form-item label="单位全称" prop="organizationName">
                        <el-input class="keepOutRight" v-model="ruleForm.organizationName" show-word-limit maxlength="30" style="width:80%" placeholder="请输入单位全称" />
                    </el-form-item>
                    <el-form-item label="单位简称" prop="organizationShortName">
                        <el-input class="keepOutRight" v-model="ruleForm.organizationShortName" show-word-limit maxlength="30" style="width:80%" placeholder="请输入单位简称" />
                    </el-form-item>
                    <el-form-item label="角色" prop="conferenceGroupRoleIdList">
                        <el-select v-model="ruleForm.conferenceGroupRoleIdList" placeholder="请选择角色" style="width:80%" multiple>
                            <el-option
                                v-for="item in roles"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                                :disabled="item.code === 1 && ruleForm.defaultFlag === 1"
                            />
                        </el-select>
                    </el-form-item>
                </el-scrollbar>
            </el-form>
            <div class="demo-drawer__footer" style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD">
                <el-button style="height:32px;margin-top:12px" @click="closeDialog">取 消</el-button>
                <el-button type="primary" :loading="loading" style="height:32px;margin-top:12px" @click="insert">保存</el-button>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { getTableHeight, formatPhone } from '@/utils/index'
import { getList, insert, update, deleteBatch, getView } from '@/api/conferenceGroupUser'
import { getList as getRoleList } from '@/api/conferenceGroupRole'
import { getConferenceId } from '@/utils/conference-auth'
import { getUser } from '@/api/attendee'
import { showLoading, closeLoading } from '@/utils/loading'
import { telephoneValid } from '@/utils/valid-common'
export default {
    name: 'ConferenceGroupUser',
    props: {
    },
    data() {
        return {
            roles: [],
            dialogHeight: getTableHeight(35) + 'px',
            multipleSelection: [],
            loading: false,
            ruleForm: {
                id: null,
                userName: null,
                mobile: null,
                organizationName: null,
                organizationShortName: null,
                conferenceGroupRoleIdList: [],
                defaultFlag: 0
            },
            rules: {
                userName: [{ required: true, message: '请输入人员名称', pattern: '[^ \x22]+', trigger: 'blur' }],
                mobile: [{ required: true, message: '请输入手机', pattern: '[^ \x22]+', trigger: 'blur' }, telephoneValid()],
                organizationName: [{ required: true, message: '请输入单位全称', pattern: '[^ \x22]+', trigger: 'change' }],
                // organizationShortName: [{ required: true, message: '请输入单位简称', pattern: '[^ \x22]+', trigger: 'blur' }],
                conferenceGroupRoleIdList: [{ required: true, message: '请选择角色', trigger: 'change' }]
            },
            dialogTitle: '添加会务组人员',
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
    watch: {
        dialogVisible(val) {
            if (val) {
                this.getRoleList()
            }
        }
    },
    created() {
        this.getRoleList()
        this.search()
    },
    methods: {
        selectInit(row, index) {
            if (row.defaultFlag === 1) {
                return false // 不可勾选
            } else {
                return true // 可勾选
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
        },
        getUser() {
            var valieMessage = ''
            this.$refs.ruleForm.validateField(['userName', 'mobile'], (valid) => {
                if (valid !== null && valid !== '') {
                    valieMessage = valid
                }
            })
            if (valieMessage !== null && valieMessage !== '') {
                return false
            }
            var load = showLoading()
            getUser({ 'userName': this.ruleForm.userName,
                'mobile': this.ruleForm.mobile }).then(res => {
                if (!res.success) {
                    this.ruleForm.userName = ''
                    this.ruleForm.mobile = ''
                    closeLoading(load)
                } else {
                    if (res.result !== null) {
                        if (res.result.user.innerFlag === 1) {
                            this.ruleForm.organizationName = res.result.mainJobOrg.companyName
                            this.ruleForm.organizationShortName = res.result.mainJobOrg.companyShortName
                            this.ruleForm.userId = res.result.user.id
                            this.ruleForm.organizationCode = res.result.user.ssoOrganizationCode
                        } else {
                            this.ruleForm.userName = ''
                            this.ruleForm.mobile = ''
                            this.$message('不是商网内部人员')
                        }

                        closeLoading(load)
                    } else {
                        this.ruleForm.userName = ''
                        this.ruleForm.mobile = ''
                        closeLoading(load)
                        this.$message('人员不存在')
                    }
                }
            })
        },
        getRoleList() {
            getRoleList({ 'conferenceId': getConferenceId() }).then(res => {
                this.roles = res.result.list
            })
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
                this.dialogTitle = '编辑会务组人员'
                this.dialogVisible = true
                this.ruleForm.id = res.result.id
                this.ruleForm.userName = res.result.userName
                this.ruleForm.mobile = res.result.mobile
                this.ruleForm.organizationName = res.result.organizationName
                this.ruleForm.organizationShortName = res.result.organizationShortName
                this.ruleForm.conferenceGroupRoleIdList = res.result.conferenceGroupRoleIds
                this.ruleForm.defaultFlag = res.result.defaultFlag
            })
        },
        add(val) {
            this.dialogTitle = '添加会务组人员'
            this.dialogVisible = true
            this.ruleForm = {
                id: null,
                userName: null,
                mobile: null,
                organizationName: null,
                organizationShortName: null,
                conferenceGroupRoleIdList: [],
                defaultFlag: 0
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
            this.$confirm('请确认是否删除会务组人员信息?', '', {
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
                    this.loading = true
                    if (this.ruleForm.id !== null && this.ruleForm.id !== '' && this.ruleForm.id !== undefined) {
                        update(this.ruleForm).then(res => {
                            if (res.success) {
                                this.$message('保存成功')
                                this.closeDialog()
                                this.search()
                            }
                            this.loading = false
                        }).catch(() => {
                            this.loading = false
                        })
                    } else {
                        insert(this.ruleForm).then(res => {
                            if (res.success) {
                                this.$message('保存成功')
                                this.closeDialog()
                                this.search()
                            }
                            this.loading = false
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
            this.ruleForm = {
                id: null,
                userName: null,
                mobile: null,
                organizationName: null,
                organizationShortName: null,
                conferenceGroupRoleIdList: [],
                defaultFlag: 0
            }
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
