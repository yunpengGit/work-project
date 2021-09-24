<template>
    <div class="">
        <el-dialog
            title="选择会务组人员"
            width="60%"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="closeDialog"
        >
            <div class="clearfix">
                <div style="background-color: white;padding-left:10px;padding-top: 15px">
                    <el-form :inline="true" :model="pageInfo">
                        <el-form-item label="姓名">
                            <el-input v-model.trim="pageInfo.conferenceGroupUserNameLike" />
                        </el-form-item>
                        <el-form-item label="单位名称">
                            <el-input v-model.trim="pageInfo.organizationNameOrShortNameLike" />
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
                            <el-button type="primary" @click="getList">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <el-table ref="table" :data="tableData" :height="400" style="width: 100%;" @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    width="55"
                />
                <el-table-column
                    label="姓名"
                    prop="userName"
                />
                <el-table-column
                    prop="createUserName"
                    label="单位简称/全称"
                >
                    <template slot-scope="scope">
                        <div>{{ scope.row.organizationShortName === null || scope.row.organizationShortName === '' ? formatTableCellData(scope.row.organizationName) : formatTableCellData(scope.row.organizationShortName) }}</div>
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
                <!-- <el-table-column
                    v-show=""
                    label="单位"
                    prop="position"
                >
                    <template slot-scope="scope">
                    </template>
                </el-table-column> -->
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button :loading="loading" type="primary" @click="pickUser">确定</el-button>
                <el-button @click="closeDialog">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getList } from '@/api/conferenceGroupUser'
import { getConferenceId } from '@/utils/conference-auth'
import { getList as getRoleList } from '@/api/conferenceGroupRole'
export default {
    name: 'MsgPickDriver',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        selectIds: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            roles: [],
            loading: false,
            multipleSelection: [],
            tableData: [],
            pageInfo: {
                conferenceGroupUserNameLike: null,
                organizationNameOrShortNameLike: null,
                conferenceGroupRoleId: null
            }
        }
    },
    watch: {
        dialogVisible(val) {
            if (val) {
                this.pageInfo = {
                    conferenceGroupUserNameLike: null,
                    organizationNameOrShortNameLike: null,
                    conferenceGroupRoleId: null
                }
                this.getRoleList()
                this.getList()
            }
        }
    },
    methods: {
        getRoleList() {
            getRoleList({ 'conferenceId': getConferenceId() }).then(res => {
                this.roles = res.result.list
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        getList() {
            this.pageInfo.conferenceId = getConferenceId()
            getList(this.pageInfo).then(res => {
                this.tableData = []
                res.result.list.forEach(item => {
                    if (this.selectIds.indexOf(item.id) === -1) {
                        this.tableData.push(item)
                    }
                })

                // selectIds.

                // this.tableData = res.result.list
            })
        },
        closeDialog() {
            this.$emit('closeDialog', null)
        },
        pickUser() {
            // var users = []
            // this.tableData.forEach(item => {
            //     if (this.multipleSelection.indexOf(item.id) !== -1) {
            //         users.push(item)
            //     }
            // })
            console.log(this.multipleSelection)
            this.$emit('closeDialog', this.multipleSelection)
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
