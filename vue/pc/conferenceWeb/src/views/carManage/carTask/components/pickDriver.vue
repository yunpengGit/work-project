<template>
    <div class="">
        <el-dialog
            title="选择司机"
            width="50%"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="closeDialog"
        >
            <!-- <div class="clearfix">
                <div style="background-color: white;padding-left:10px;padding-top: 15px">
                    <el-form :inline="true" :model="pageInfo">
                        <el-form-item label="参会人姓名">
                            <el-input v-model.trim="pageInfo.attendeeName" maxlength="25" placeholder="请输入参会人姓名" />
                        </el-form-item>
                        <el-form-item style="float: right">
                            <el-button type="primary" @click="search">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div> -->
            <el-table ref="table" :data="tableData" :height="tableHeight" style="width: 100%;">
                <el-table-column width="55">
                    <template slot-scope="scope">
                        <el-radio v-model="radio" :label="scope.row.id" @change="radioChange(scope.row)">&nbsp;
                        </el-radio>
                    </template>
                </el-table-column>
                <el-table-column label="姓名">
                    <template slot-scope="scope">
                        {{ scope.row.name }}
                    </template>
                </el-table-column>
                <el-table-column label="手机">
                    <template slot-scope="scope">
                        <PhoneEncryption :value="scope.row.phone" />
                        <!-- <div>
                            <span>{{ formatTableCellData(formatPhone(scope.row.phone)) }}</span>
                            <span style="display:none">{{ scope.row.phone }}</span>
                            <el-button v-show="scope.row.phone !== null && scope.row.phone !== ''" icon="el-icon-view"
                                type="text" @click="(event) => qiehuanshoujijiami(event)" />
                        </div> -->
                    </template>
                </el-table-column>
                <el-table-column label="驾龄">
                    <template slot-scope="scope">
                        {{ scope.row.drivingAge }}
                    </template>
                </el-table-column>
                <el-table-column label="公司名称">
                    <template slot-scope="scope">
                        {{ scope.row.vehicleCompanyVO !== null ? scope.row.vehicleCompanyVO.name : '' }}
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button :loading="loading" type="primary" @click="insert">确定</el-button>
                <el-button @click="closeDialog">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getDriverList } from '@/api/special'
import { getConferenceId } from '@/utils/conference-auth'
import { formatPhone } from '@/utils/index'
export default {
    name: 'PickSpecialDriver',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        startTime: {
            type: null,
            default: null
        },
        endTime: {
            type: null,
            default: null
        }
    },
    data() {
        return {
            radio: null,
            loading: false,
            tableHeight: 400 + 'px',
            tableData: [],
            driver: {
                id: null,
                name: null
            }
        }
    },
    watch: {
        dialogVisible(val) {
            if (val) {
                this.getDriverList()
            }
        }
    },
    created() {

    },
    methods: {
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
        getDriverList() {
            this.tableData = []
            getDriverList({ conferenceId: getConferenceId(), startTime: this.startTime, endTime: this.endTime }).then(res => {
                if (res.success) {
                    this.tableData = res.result.list
                }
            })
        },
        insert() {
            if (this.driver.id === null || this.driver.id === '') {
                this.$message('请选择司机')
                return
            }
            this.$emit('closeDialog', this.driver)
        },
        closeDialog() {
            this.radio = null
            this.driver = {
                id: null,
                name: null
            }

            this.$emit('closeDialog', null)
        },
        radioChange(val) { // 选择主宾变化
            this.driver.id = val.id
            this.driver.name = val.name
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
