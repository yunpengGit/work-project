<template>
    <div>
        <div style="padding-left:8px;padding-right:8px;margin-top:0px">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form ref="form" :inline="true" :model="form">
                    <el-form-item label="证件名称" prop="cardNameLike">
                        <el-input v-model.trim="form.cardNameLike" size="small" type="text" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="证件状态" prop="cardStatus">
                        <el-select v-model="form.cardStatus" placeholder="全部" clearable style="width:120px" filterable>
                            <el-option
                                v-for="item in cardStatusOptions"
                                :key="item.enumKey"
                                :label="item.enumValue"
                                :value="item.enumKey"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="车牌号" prop="platNumLike">
                        <el-input v-model.trim="form.platNumLike" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="车型" prop="vehicleTypeLike">
                        <el-input v-model.trim="form.vehicleTypeLike" size="small" style="width: 120px" />
                    </el-form-item>

                    <el-form-item style="float: right;">
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                        <el-button @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
            <div style="float: left; padding-bottom:10px">
                <el-button v-permission="buttons.CardPlan.changeCar" type="primary" @click="handleDialog">调整证件状态
                </el-button>
            </div>
            <div style="float: right;padding-bottom:10px">
                <el-button v-permission="buttons.CardPlan.addCar" type="primary" @click="handleEdit">添加车证</el-button>
                <el-button v-permission="buttons.CardPlan.importCar" @click="importVehicleCard">导入车证信息</el-button>
                <el-button v-permission="buttons.CardPlan.exportCar" @click="exportTaskVehicle">导出查询结果</el-button>
            </div>
            <el-table
                ref="table"
                :data="vehicleCardTaskList"
                :height="tableHeight+ (this.$store.state.menu.buttons.indexOf(Global.buttons.CardPlan.changeCar) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.CardPlan.addCar) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.CardPlan.importCar) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.CardPlan.exportCar) !== -1
                    ? 0: 42)"
                style="width: 100%"
                :row-class-name="tableRowClassName"
                :header-cell-style="{
                    background:'#f7f7f7'
                }"
            >
                <el-table-column type="selection" prop="id" />
                <el-table-column label="证件名称">
                    <template slot-scope="scope">
                        <div v-if="scope.row.card!=null && scope.row.card!=''">
                            {{ scope.row.card.cardName }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="证件状态">
                    <template slot-scope="scope">
                        <div v-if="scope.row.card!=null && scope.row.card!=''">
                            {{ scope.row.card.cardStatusStr }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="车型">
                    <template slot-scope="scope">
                        <div v-if="scope.row.vehicle!=null && scope.row.vehicle!=''">
                            {{ scope.row.vehicle.vehicleTypeVO.name }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="车牌号">
                    <template slot-scope="scope">
                        <div v-if="scope.row.vehicle!=null && scope.row.vehicle!=''">
                            {{ scope.row.vehicle.platNum }}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="操作" fixed="right" width="200">
                    <template slot-scope="scope">
                        <el-button
                            v-permission="buttons.CardPlan.editCar"
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑车证</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page-wrapper">
                <el-pagination
                    :current-page="paramData.pageNum"
                    background
                    :page-sizes="pageInfo.pageSizeList"
                    :page-size="paramData.pageSize"
                    layout="total, prev, pager, next, sizes ,jumper"
                    :total="pageInfo.total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </div>
        <editVehicleCard
            ref="editVehicleCard"
            :card-status-options="cardStatusOptions"
            @getListInfo="getListInfo(paramData)"
        />
        <changeStatusDialog
            ref="changeStatusDialog"
            :card-status-options="cardStatusOptions"
            @updateCardStatus="updateVehicleCardStatus"
        />
        <importVehicleCardRes :dialog-visible="importDialogVisible" @closeDialog="closeImportDialog" />
    </div>
</template>

<script>
import editVehicleCard from './editVehicleCard'
import changeStatusDialog from './changeVechcleDialog'
import { getVehicleCardTaskList, updateVehicleCardStatus, exportTaskVehicle } from '@/api/card'
import { getTableHeight } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
import importVehicleCardRes from './importVehicleCardRes'
import { showLoading, closeLoading } from '@/utils/loading'

export default {
    name: 'VehicleCardTaskList',
    components: { editVehicleCard, changeStatusDialog, importVehicleCardRes },
    props: {
        cardStatusOptions: {
            type: Array,
            default: ''
        }
    },
    data() {
        return {
            importDialogVisible: false,
            buttons: this.Global.buttons,
            form: {
                conferenceId: getConferenceId(),
                cardNameLike: '',
                cardStatus: '',
                platNumLike: '',
                vehicleTypeLike: ''

            },
            paramData: {
                conferenceId: getConferenceId(),
                pageSize: 10,
                pageNum: 1
            },
            pageInfo: {
                pageSizeList: [10, 20, 30],
                total: 0
            },
            vehicleCardTaskList: [],
            tableHeight: getTableHeight(215)

        }
    },
    watch: {
        // '$route' () {  // 对route进行监控  添加返回时会调用刷新数据
        //     this.getListInfo()

        // }

    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() { },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.getListInfo(this.paramData)
        this.$nextTick(() => { this.$refs.table.doLayout() })
    },
    // 这里存放数据
    beforeCreate() { },
    // 生命周期 - 挂载之前
    beforeMount() { },
    // 生命周期 - 更新之前
    beforeUpdate() { },
    // 生命周期 - 更新之后
    updated() { },
    // 生命周期 - 销毁之前
    beforeDestroy() { },
    // 生命周期 - 销毁完成
    destroyed() { },
    // 如果页面有keep-alive缓存功能，这个函数会触发
    activated() { },
    methods: {
        exportTaskVehicle() {
            const load = showLoading()
            var tempData = JSON.parse(JSON.stringify(this.paramData))
            tempData.pageSize = null
            tempData.pageNum = null
            exportTaskVehicle(tempData).then(res => {
                if (decodeURI(res.headers['filename']) == null || decodeURI(res.headers['filename']) === 'undefined') {
                    this.$message('文件不存在')
                } else {
                    const blob = new Blob([res.data], { type: 'application/octet-stream' })
                    const fileName = decodeURIComponent(decodeURI(res.headers['filename']))
                    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                        navigator.msSaveBlob(blob, fileName)
                    } else {
                        const link = document.createElement('a')
                        link.style.display = 'none'
                        link.href = URL.createObjectURL(blob)
                        link.setAttribute('download', fileName)
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                    }
                }
                closeLoading(load)
            })
                .catch(error => {
                    this.$message({
                        title: '错误',
                        desc: '系统数据错误'
                    })
                    console.log(error)
                    closeLoading(load)
                })
        },

        closeImportDialog() {
            this.importDialogVisible = false
            this.getListInfo(this.paramData)
        },
        importVehicleCard() {
            this.importDialogVisible = true
        },
        updateVehicleCardStatus(param) {
            updateVehicleCardStatus(param).then(res => {
                if (res.success) {
                    this.$message('证件状态修改成功')
                    this.getListInfo(this.paramData)
                    this.$refs['changeStatusDialog'].closeDialog()
                }
            })
        },

        handleDialog() {
            var selectedList = this.$refs.table.selection
            if (selectedList.length > 0) {
                this.$refs['changeStatusDialog'].showDialog(selectedList)
            } else {
                this.$message('至少选择一条数据')
            }
        },

        handleSizeChange(val) {
            console.log('长度改变：' + val)
            this.paramData.pageSize = val
            this.getListInfo(this.paramData)
        },
        handleCurrentChange(val) {
            console.log('当前页码改变：' + val)
            this.paramData.pageNum = val
            this.getListInfo(this.paramData)
        },

        handleEdit(index, row) {
            if (row) {
                this.$refs['editVehicleCard'].showEdit(row)
            } else {
                this.$refs['editVehicleCard'].showEdit()
            }
        },

        tableRowClassName({ row, rowIndex }) {
            const index = rowIndex + 1
            if (index % 2 == 0) {
                return 'warning-row'
            }
        },
        onSubmit() {
            var params = this.form
            for (var key in params) {
                if (params[key] === '') {
                    delete params[key]
                }
            }
            params['pageSize'] = this.paramData.pageSize
            params['pageNum'] = 1
            this.getListInfo(params)
        },
        resetForm(form) {
            this.$refs[form].resetFields()
        },

        getListInfo(param) {
            getVehicleCardTaskList(param).then(response => {
                if (response.success) {
                    console.log('getVehicleCardTaskList' + response.result.list)
                    this.vehicleCardTaskList = response.result.list
                    this.pageInfo.total = response.result.total

                    this.paramData = param
                }
            })
        }

    }
}
</script>

<style lang='scss' scoped >
// ::v-deep .el-table tr {
//   background: #c0c0c0;
// } // 单数行的颜色

::v-deep .el-table .warning-row {
    background: #f7f7f7;
}
</style>
