<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:8px">
        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form :inline="true" :model="pageInfo">
                    <el-form-item label="联系人姓名">
                        <el-input v-model.trim="pageInfo.conferenceGroupUserNameLike" class="widthClass" maxlength="25" placeholder="" />
                    </el-form-item>
                    <el-form-item label="所属机构">
                        <el-select
                            v-model="pageInfo.type"
                            class="widthClass"
                            placeholder="全部"
                            clearable
                        >
                            <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id" />
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
            <el-table ref="table" :data="tableData" :height="tableHeight" style="width: 100%;">
                <el-table-column prop="name" label="联系人姓名" />
                <el-table-column prop="mobile" label="联系电话" />
                <el-table-column prop="roleName" label="联系人角色" />
                <el-table-column prop="organization" label="所属机构" />
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
    </div>
</template>

<script>
import { getTableHeight } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
import { getContactByConferenceId } from '@/api/overview'
export default {
    name: 'ConferenceContactList',
    data() {
        return {
            typeList: [
                { id: 1, name: '餐厅联系人' },
                { id: 2, name: '酒店联系人' },
                { id: 3, name: '车辆联系人' },
                { id: 4, name: '会务组' }
            ],
            tableHeight: getTableHeight(125),
            tableData: [],
            pageInfo: {
                statusFlag: 1,
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
        resetSearch() {
            this.pageInfo = {
                statusFlag: 1,
                pageNum: 1,
                pageSize: 10,
                total: this.pageInfo.total
            }
        },
        getList() {
            this.pageInfo.conferenceId = getConferenceId()
            getContactByConferenceId(this.pageInfo).then(res => {
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
    width: 350px;
}
</style>
