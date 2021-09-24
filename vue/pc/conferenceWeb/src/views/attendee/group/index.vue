<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:8px">
        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form :inline="true" :model="pageInfo">
                    <div class="inquire_form">
                    <div class="form_left">
                    <el-form-item label="姓名">
                        <el-input v-model.trim="pageInfo.attendeeNameLike" class="widthClass" maxlength="25" placeholder="" />
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input v-model.trim="pageInfo.phoneLike" class="widthClass" maxlength="25" placeholder="" />
                    </el-form-item>
                    <el-form-item label="单位名称">
                        <el-input v-model.trim="pageInfo.allOrganizationNameLike" class="widthClass" maxlength="25" placeholder="" />
                    </el-form-item>
                    <el-form-item label="分组名称">
                        <el-input v-model.trim="pageInfo.accompanyNameLike" class="widthClass" maxlength="25" placeholder="" />
                    </el-form-item>
                    </div>
                    <el-form-item class="form_operation">
                        <el-button type="primary" @click="search">查询</el-button>
                        <el-button @click="resetSearch">重置</el-button>
                    </el-form-item>
                    </div>
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
                <!-- <el-button v-permission="Global.buttons.AttendeeGroup.import" @click="add">导入</el-button>
                <el-button v-permission="Global.buttons.AttendeeGroup.export" @click="add">导出查询结果</el-button> -->
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
                    label="分组类型"
                >
                    <template slot-scope="scope">
                        {{ formatTypes(scope.row.type) }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="linkCount"
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
        <GroupAdd :attendee-name="attendeeName" :attendee-phone="attendeePhone" :group-id="groupId" :types="types" :dialog-title="dialogTitle" :dialog-visible="dialogVisible" @closeDialog="closeDialog" />
        <GroupAddAttendee :group-type="groupType" :group-name="groupName" :attendee-name="attendeeName" :attendee-phone="attendeePhone" :group-id="groupId" :types="types" :dialog-title="'添加人员'" :dialog-visible="pickDialogVisible" @closeDialog="closeDialog" />
        <AttendeeList :group-type="groupType" :group-name="groupName" :attendee-name="attendeeName" :attendee-phone="attendeePhone" :group-id="groupId" :types="types" :dialog-title="'添加人员'" :dialog-visible="attendeeDialogVisible" @closeDialog="closeDialog" />
        <!-- <GroupAttendeeList :group-name="groupName" :attendee-dialog-visible="attendeeDialogVisible" :group-id="groupId" @closeDialog="closeAttendeeDialog" />
        <PickAttendee :pick-dialog-visible="pickDialogVisible" @closeDialog="closePickAttendeeDialog" /> -->
    </div>
</template>

<script>
import { getTableHeight } from '@/utils/index'
import { getList, deleteBatch } from '@/api/attendeeGroup'
import { getConferenceId } from '@/utils/conference-auth'
import GroupAdd from './add'
import GroupAddAttendee from './addAttendee'
import AttendeeList from './attendeeList'
export default {
    name: 'AttendeeGroup',
    components: {
        GroupAdd,
        GroupAddAttendee,
        AttendeeList
        // GroupAttendeeList,
        // PickAttendee
    },
    props: {
    },
    data() {
        return {
            groupType: null,
            attendeeName: null,
            attendeePhone: null,
            types: [
                { id: 1, name: '主宾随员' },
                { id: 2, name: '商务陪同 ' },
                { id: 3, name: '好友分组' }
            ],
            pickDialogVisible: false,
            attendeeDialogVisible: false,
            groupId: null,
            groupName: null,
            multipleSelection: [],
            dialogTitle: '添加分组',
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
        formatTypes(val) {
            var type = this.types.find(item => item.id === val)
            if (type === undefined || type === null) {
                return ''
            }
            return type.name
        },
        addAttendee(val) {
            this.attendeeName = val.attendeeFixAttribute.attendeeName
            this.attendeePhone = val.attendeeFixAttribute.phone
            this.groupType = val.type
            this.groupName = val.name
            this.groupId = val.id
            this.pickDialogVisible = true
        },
        viewAttendee(val) {
            this.attendeeName = val.attendeeFixAttribute.attendeeName
            this.attendeePhone = val.attendeeFixAttribute.phone
            this.groupType = val.type
            this.groupName = val.name
            this.groupId = val.id
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
            this.attendeeName = val.attendeeFixAttribute.attendeeName
            this.attendeePhone = val.attendeeFixAttribute.phone
            this.groupName = val.name
            this.dialogTitle = '编辑分组'
            this.dialogVisible = true
            this.groupId = val.id
        },
        add() {
            this.dialogTitle = '添加分组'
            this.dialogVisible = true
        },
        closeDialog() {
            this.search()
            this.groupType = null
            this.attendeeName = null
            this.attendeePhone = null
            this.groupName = null
            this.pickDialogVisible = false
            this.attendeeDialogVisible = false
            this.dialogVisible = false
            this.groupId = null
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
