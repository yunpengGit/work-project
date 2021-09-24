<template>
    <div class="">
        <el-dialog
            title="选择车辆"
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
                <el-table-column label="车型">
                    <template slot-scope="scope">
                        {{ scope.row.vehicleTypeVO.name }}
                    </template>
                </el-table-column>
                <el-table-column label="座位数">
                    <template slot-scope="scope">
                        {{ scope.row.vehicleTypeVO.seatNum }}
                    </template>
                </el-table-column>
                <el-table-column label="颜色">
                    <template slot-scope="scope">
                        {{ scope.row.vehicleColorStr }}
                    </template>
                </el-table-column>
                <el-table-column label="车牌号">
                    <template slot-scope="scope">
                        {{ scope.row.platNum }}
                    </template>
                </el-table-column>
                <el-table-column label="司机">
                    <template slot-scope="scope">
                        {{ scope.row.driverVO !== null ? scope.row.driverVO.name : '' }}
                    </template>
                </el-table-column>
                <el-table-column label="司机电话">
                    <template slot-scope="scope">
                        {{ scope.row.driverVO ? scope.row.driverVO.phone : '' }}
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
import { getSpecialVehicleList } from '@/api/special'
import { getConferenceId } from '@/utils/conference-auth'
// import { getTableHeight } from '@/utils/index'
export default {
    name: 'PickSpecialCar',
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
            vehicle: {
                id: null,
                name: null,
                driverId: null,
                driverName: null
            }
        }
    },
    watch: {
        dialogVisible(val) {
            if (val) {
                this.getSpecialVehicleList()
            }
        }
    },
    created() {

    },
    methods: {
        getSpecialVehicleList() {
            this.tableData = []
            getSpecialVehicleList({ conferenceId: getConferenceId(), startTime: this.startTime, endTime: this.endTime }).then(res => {
                if (res.success) {
                    this.tableData = res.result.list
                }
            })
        },
        insert() {
            if (this.vehicle.id === null || this.vehicle.id === '') {
                this.$message('请选择车辆')
                return
            }
            this.$emit('closeDialog', this.vehicle)
        },
        closeDialog() {
            this.radio = null
            this.vehicle = {
                id: null,
                name: null,
                driverId: null,
                driverName: null
            }

            this.$emit('closeDialog', null)
        },
        radioChange(val) {
            this.vehicle.id = val.id
            this.vehicle.name = val.vehicleTypeVO.name + '(' + val.platNum + ')' + '-' + val.vehicleTypeVO.seatNum + '座'
            if (val.driverVO !== null) {
                this.vehicle.driverId = val.driverVO.id
                this.vehicle.driverName = val.driverVO.name
            }
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
