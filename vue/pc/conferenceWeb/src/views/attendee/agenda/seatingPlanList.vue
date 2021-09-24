<template>
    <div class="seatingPlanClass">
        <el-dialog
            :title="'议程座位图'"
            width="58%"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="closeDialog"
        >
            <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
                <div style="float: left; text-center: right;padding-bottom:10px;">
                    <div
                        style="line-height: 32px;text-align:center;width: 108px;height: 32px;background: #FF8200;box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.08);border-radius: 4px;color:white;cursor: pointer"
                        @click="shangchuanzuoweitu"
                    >
                        <svg-icon icon-class="shangchuan" />
                        上传座位图
                    </div>
                </div>
                <el-table
                    :data="tableData"
                    style="width: 100%;"
                    :height="tableHeight"
                    empty-text="请先上传座位图"
                >
                    <el-table-column
                        label="文件名称"
                    >
                        <template slot-scope="scope">
                            <div :title="scope.row.name" style="line-height: 50px;"> <svg-icon icon-class="excel" style="height:50px;width: 20px;margin-right:16px;float:left" />{{ formatTableCellData(scope.row.name) }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="createUserName"
                        label="上传人"
                        width="100"
                    />
                    <el-table-column
                        label="上传时间"
                        width="150"
                    >
                        <template slot-scope="scope">
                            <div>
                                {{ scope.row.createTime !== null && scope.row.createTime !== '' ? (scope.row.createTime.length === 19 ? scope.row.createTime.substr(0,16) : scope.row.createTime) : '-' }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="150"
                    >
                        <template slot-scope="scope">
                            <el-button
                                type="tetx"
                                @click.native.prevent="chakan(scope.row)"
                            >
                                查看
                            </el-button>
                            <el-button
                                type="tetx"
                                @click.native.prevent="shanchu(scope.row)"
                            >
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div style="width:100%;height:25px" />
        </el-dialog>
        <UploadSeatingPlan :seating-plan-id="seatingPlanId" :dialog-visible="uploadDialogVisible" @closeDialog="closeUploadDialog" />
    </div>
</template>

<script>
import { getConferenceId } from '@/utils/conference-auth'
import { getList, deleteSeatingPlan } from '@/api/seatingPlan'
import { getTableHeight } from '@/utils/index'
import UploadSeatingPlan from './uploadSeatingPlan'
export default {
    name: 'SeatingPlanList',
    components: {
        UploadSeatingPlan
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            seatingPlanId: null,
            uploadDialogVisible: false,
            tableData: [],
            tableHeight: getTableHeight(285),
            pageInfo: {
                conferenceId: getConferenceId()
            }
        }
    },
    watch: {
        dialogVisible(val) {
            if (val) {
                this.getList()
            }
        }
    },
    methods: {
        closeUploadDialog() {
            this.seatingPlanId = null
            this.getList()
            this.uploadDialogVisible = false
        },
        shangchuanzuoweitu() {
            this.uploadDialogVisible = true
        },
        shanchu(val) {
            this.$confirm('请确认是否删除座位图？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteSeatingPlan({ id: val.id }).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        this.getList()
                    }
                })
            }).catch(() => {
            })
        },
        closeDialog() {
            this.$emit('closeDialog', null)
        },
        chakan(val) {
            this.seatingPlanId = val.id
            this.uploadDialogVisible = true
        },
        getList() {
            getList(this.pageInfo).then(res => {
                this.tableData = res.result
            })
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
<style lang="scss" >
.seatingPlanClass {
    .el-table__empty-text {
        margin-top: -110px !important;
        background-image: url(../../../assets/table-no-data.png) !important;
        background-size: 100% 100% !important;
        background-repeat: no-repeat !important;
        width:150px !important;
        height:90px !important;
        padding-top:85px !important;
        font-size: 16px !important;
        text-align: center !important;
    }
}
</style>
