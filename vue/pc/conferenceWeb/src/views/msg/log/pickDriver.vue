<template>
    <div class="">
        <el-dialog
            title="选择司机"
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
                            <el-input v-model.trim="pageInfo.nameLike" />
                        </el-form-item>
                        <el-form-item label="出租公司">
                            <el-input v-model.trim="pageInfo.companyNameLike" />
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
                    prop="name"
                />
                <el-table-column
                    label="单位"
                >
                    <template slot-scope="scope">
                        {{ scope.row.vehicleCompanyVO !== null ? scope.row.vehicleCompanyVO.name : '' }}
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
import { getDriverList as getList } from '@/api/car'
import { getConferenceId } from '@/utils/conference-auth'
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
            loading: false,
            multipleSelection: [],
            tableData: [],
            pageInfo: {
                companyNameLike: null,
                nameLike: null
            }
        }
    },
    watch: {
        dialogVisible(val) {
            this.pageInfo = {
                companyNameLike: null,
                nameLike: null
            }
            this.getList()
        }
    },
    methods: {
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
