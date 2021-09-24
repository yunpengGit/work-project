<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:8px">
        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form :inline="true" :model="pageInfo">
                    <div class="inquire_form">
                    <div class="form_left">
                    <el-form-item label="姓名">
                        <el-input v-model.trim="pageInfo.nameLike" class="widthClass" maxlength="25" placeholder="" />
                    </el-form-item>
                    <el-form-item label="手机">
                        <el-input v-model.trim="pageInfo.phoneLike" class="widthClass" maxlength="25" placeholder="" />
                    </el-form-item>
                    <el-form-item label="职务">
                        <el-input v-model.trim="pageInfo.positionLike" class="widthClass" maxlength="25" placeholder="" />
                    </el-form-item>
                    <el-form-item label="单位名称">
                        <el-input v-model.trim="pageInfo.allOrganizationNameLike" class="widthClass" maxlength="25" placeholder="" />
                    </el-form-item>
                    </div>
                    <el-form-item  class="form_operation">
                        <el-button :class="dakaichaxunClass === 1 ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" type="text" style="margin-left:10px;margin-right:5px" @click="dakaichaxun" />
                        <el-button type="primary" @click="search">查询</el-button>
                        <el-button @click="resetSearch">重置</el-button>
                        
                    </el-form-item>
                    </div>
                    <el-form-item v-if="dakaichaxunClass === 0" label="邀请状态">
                        <el-select v-model="pageInfo.inviteStatusList" style="width:150px" placeholder="全部" clearable>
                            <el-option :key="1" label="未发送" :value="1" />
                            <el-option :key="2" label="待确认" :value="2" />
                            <el-option :key="3" label="接受" :value="3" />
                            <el-option :key="4" label="拒绝" :value="4" />
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
            <div style="float: left; text-center: left;margin-left:10px;padding-bottom:10px;">
                <el-button v-permission="Global.buttons.InvitationList.send" @click="deleteBatch">批量移除</el-button>
                <el-button v-permission="Global.buttons.InvitationList.send" @click="addBatch">批量添加</el-button>
            </div>
            <div style="float: right; text-center: right;padding-bottom:10px;">
                <!-- v-permission="Global.buttons.InvitationList.insert" -->
                <el-button v-permission="Global.buttons.InvitationList.send" @click="sendBatch">批量发送</el-button>
                <el-button v-permission="Global.buttons.InvitationList.insert" type="primary" @click="add">添加</el-button>
                <!-- v-permission="Global.buttons.InvitationList.import" -->
                <el-button v-permission="Global.buttons.InvitationList.import" @click="importInvite">导入</el-button>
                <!-- v-permission="Global.buttons.InvitationList.export" -->
                <!-- <el-button v-permission="Global.buttons.InvitationList.export" @click="add">导出查询结果</el-button> -->
            </div>
            <el-table
                ref="table"
                :data="tableData"
                :height="(tableHeight + (this.$store.state.menu.buttons.indexOf(Global.buttons.InvitationList.send) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.InvitationList.insert) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.InvitationList.import) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.InvitationList.export) !== -1 ? 0: 32)) - (dakaichaxunClass === 0 ? 50 : 0)"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
            >
                <el-table-column
                    type="selection"
                    width="55"
                    :selectable="selectInit"
                />
                <el-table-column
                    prop="name"
                    label="姓名"
                    width="180"
                >
                    <template slot-scope="scope">
                        {{ scope.row.name }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="手机号"
                    min-width="120px"
                >
                    <template slot-scope="scope">
                        <PhoneEncryption :value="scope.row.phone" />
                        <!-- <div>
                            <span>{{ formatTableCellData(formatPhone(scope.row.phone)) }}</span>
                            <span style="display:none">{{ scope.row.phone }}</span>
                            <el-button v-show="scope.row.phone !== null && scope.row.phone !== ''" icon="el-icon-view" type="text" @click="(event) => qiehuanshoujijiami(event)" />
                        </div> -->
                        <!-- <div @click="xianshi">aaa</div> -->
                    </template>
                </el-table-column>
                <el-table-column
                    label="职务"
                >
                    <template slot-scope="scope">
                        <div :title="scope.row.position">{{ formatTableCellData(scope.row.position) }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="单位简称/全称"
                >
                    <template slot-scope="scope">
                        <div>{{ formatTableCellData(formatOrgName(scope.row.organizationSortName, scope.row.organizationName)) }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="邀请状态"
                >
                    <template slot-scope="scope">
                        <div v-if="scope.row.inviteStatus != 4">{{ scope.row.inviteStatusStr }}</div>
                        <CusTomTooltip v-else :value=" scope.row.inviteStatusStr + (scope.row.rejectReason !== null ? '(' + scope.row.rejectReason + ')' : '')" />
                        <!-- rejectReason -->
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="150"
                >
                    <template slot-scope="scope">
                        <!-- v-permission="Global.buttons.InvitationList.send" -->
                        <el-button
                            v-permission="Global.buttons.InvitationList.send"
                            :disabled="scope.row.inviteStatus !== 1 && scope.row.inviteStatus !== 2"
                            @click.native.prevent="send(scope.row)"
                        >
                            发送
                        </el-button>

                        <el-button
                            v-permission="Global.buttons.InvitationList.delete"
                            :disabled="scope.row.inviteStatus !== 1"
                            @click.native.prevent="del(scope.row)"
                        >
                            移除
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
                    <el-form-item label="姓名" prop="name">
                        <el-input class="keepOutRight" v-model="ruleForm.name" show-word-limit maxlength="30" style="width:80%" placeholder="请输入姓名" @blur="getUser" />
                    </el-form-item>
                    <el-form-item label="手机号" prop="phone">
                        <el-input class="keepOutRight" v-model="ruleForm.phone" show-word-limit maxlength="11" style="width:80%" placeholder="请输入手机号" @blur="getUser" />
                    </el-form-item>
                    <el-form-item label="职务" prop="position">
                        <el-input class="keepOutRight" maxlength="20" v-model="ruleForm.position" show-word-limit placeholder="请输入职务" style="width:80%" />
                    </el-form-item>
                    <el-form-item label="单位全称" prop="organizationName">
                        <el-input class="keepOutRight" v-model="ruleForm.organizationName" show-word-limit maxlength="30" placeholder="请输入单位全称" style="width:80%" />
                    </el-form-item>
                    <el-form-item label="单位简称" prop="organizationSortName">
                        <el-input class="keepOutRight" v-model="ruleForm.organizationSortName" show-word-limit maxlength="30" placeholder="请输入单位简称" style="width:80%" />
                    </el-form-item>
                </el-scrollbar>
            </el-form>
            <div class="demo-drawer__footer" style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD">
                <el-button style="height:32px;margin-top:12px" @click="closeDialog">取 消</el-button>
                <el-button type="primary" :loading="loading" style="height:32px;margin-top:12px" @click="insert">保存</el-button>
            </div>
        </el-drawer>
        <ImportInvitation :dialog-visible="importDialogVisible" @closeDialog="closeImportDialog" />
        <!-- <AddressBook/> -->
    </div>
</template>

<script>
import { getTableHeight, formatPhone } from '@/utils/index'
import { getList, insert, sendInvite, deleteBatch } from '@/api/invitation'
import { getUser } from '@/api/attendee'
import { getConferenceId } from '@/utils/conference-auth'
import { telephoneValid } from '@/utils/valid-common'
import { showLoading, closeLoading } from '@/utils/loading'
import ImportInvitation from './importInvitation'
import {toAddressBook} from "@/utils/jsApiUtil"
export default {
    name: 'ContactList',
    components: {
        ImportInvitation,
        // AddressBook
    },
    props: {
    },
    data() {
        return {
            dakaichaxunClass: 1,
            importDialogVisible: false,
            dialogTitle: '',
            ruleForm: {
                id: null,
                name: null,
                phone: null,
                position: null,
                organizationName: null,
                organizationSortName: null
            },
            rules: {
                name: [{ required: true, message: '请输入姓名', pattern: '[^ \x22]+', trigger: 'blur' }],
                phone: [{ required: true, message: '请输入手机号', pattern: '[^ \x22]+', trigger: 'blur' },
                    telephoneValid()],
                organizationName: [{ required: true, message: '请输入单位名称', pattern: '[^ \x22]+', trigger: 'blur' }]
            },
            dialogHeight: getTableHeight(35) + 'px',
            loading: false,
            dialogVisible: false,
            conferenceId: getConferenceId(),
            tableData: [],
            tableHeight: getTableHeight(170),
            multipleSelection: [],
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
        dakaichaxun() {
            this.dakaichaxunClass = this.dakaichaxunClass === 1 ? 0 : 1
        },
        selectInit(row, index) {
            if (row.inviteStatus === 1 || row.inviteStatus === 2) {
                return true // 可勾选
            } else {
                return false // 不可勾选
            }
        },
        closeImportDialog() {
            this.importDialogVisible = false
            this.search()
        },
        importInvite() {
            this.importDialogVisible = true
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
        resetSearch() {
            this.pageInfo = {
                contacterNameLike: '',
                pageNum: 1,
                pageSize: 10,
                total: this.pageInfo.total
            }
        },
        getUser() {
            if (this.ruleForm.name !== null && this.ruleForm.name !== '' &&
            this.ruleForm.phone !== null && this.ruleForm.phone !== '') {
                var valieMessage = ''
                this.$refs.ruleForm.validateField(['name', 'phone'], (valid) => {
                    valieMessage = valid
                })
                if (valieMessage !== null && valieMessage !== '') {
                    return false
                }
                var load = showLoading()
                getUser({ 'userName': this.ruleForm.name,
                    'mobile': this.ruleForm.phone }).then(res1 => {
                    if (!res1.success) {
                        this.ruleForm.name = ''
                        this.ruleForm.phone = ''
                        closeLoading(load)
                    } else {
                        if (res1.result !== null) {
                            this.ruleForm.organizationName = res1.result.mainJobOrg.companyName
                            this.ruleForm.organizationSortName = res1.result.mainJobOrg.companyShortName
                            this.ruleForm.position = res1.result.mainJobOrg.userTitle
                        }
                        closeLoading(load)
                    }
                }).catch(() => {
                    closeLoading(load)
                })
            }
        },
        insert() {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    this.ruleForm.conferenceId = this.conferenceId
                    insert(this.ruleForm).then(res => {
                        if (res.success) {
                            this.$message(res.message)
                            this.closeDialog()
                            this.search()
                            this.loading = false
                        }
                    }).catch(() => {
                        this.loading = false
                    })
                }
            })
        },
        send(row) {
            this.sendSubmit([row.id])
        },
        sendBatch() {
            if (this.multipleSelection.length === 0) {
                this.$message('至少选择一条记录')
                return
            }
            const param = []
            this.multipleSelection.forEach(item => {
                param.push(item.id)
            })
            this.sendSubmit(param)
        },
        sendSubmit(param) {
            this.$confirm('请确认是否发送邀请?', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                sendInvite({ ids: param }).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        this.search()
                    }
                })
            }).catch(() => {})
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
        //批量添加
        addBatch(){
            toAddressBook({members:''}).then((res)=>{
                alert('121')
            })
            // this.$electron.ipcRenderer.send('createAddressWindow',{
            //     allType:true,
            //     currentUserSecret:'d5m488481u4ztqf8',
            //     customTag:'1630311126792',
            //     maxNum:50,
            //     type: 1,
            //     source:2,
            //     titleName: '联系人'})
            //     alert('111')
        },
        deleteSubmit(param) {
            this.$confirm('请确认是否删除邀请?', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteBatch({ ids: param }).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        this.search()
                    }
                })
            }).catch(() => {})
        },
        add() {
            this.dialogTitle = '添加邀请人'
            this.dialogVisible = true
            this.ruleForm = {
                id: null,
                name: null,
                phone: null,
                position: null,
                organizationName: null,
                organizationSortName: null
            }
        },
        closeDialog(val) {
            this.dialogVisible = false
            this.search()
            this.$refs['ruleForm'].resetFields()
            this.ruleForm.id = null
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
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
