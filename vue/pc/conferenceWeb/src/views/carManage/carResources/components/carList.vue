<template>
    <div>
        <div style="padding-left:8px;padding-right:8px;margin-top:0px">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form ref="form" :inline="true" :model="form">
                    <div class="inquire_form">
                    <div class="form_left">
                    <el-form-item label="车型" prop="vehicleTypeLike">
                        <el-input v-model.trim="form.vehicleTypeLike" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="车牌号" prop="platNumLike">
                        <el-input v-model.trim="form.platNumLike" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="座位数" prop="seatNum">
                        <el-input v-model.trim="form.seatNum" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="司机" prop="driverNameLike">
                        <el-input v-model.trim="form.driverNameLike" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="手机" prop="driverPhoneLike">
                        <el-input v-model.trim="form.driverPhoneLike" size="small" style="width: 120px" />
                    </el-form-item>
                    </div>
                    <el-form-item class="form_operation">
                        <i class="el-icon-arrow-down" style="margin-right:10px" @click="showMore" />
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                        <el-button @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                    </div>
                    <el-form-item v-show="showMoreFlag" label="车辆所属公司" prop="vehicleCompanyLike">
                        <el-input v-model.trim="form.vehicleCompanyLike" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item v-show="showMoreFlag" label="司机所属公司" prop="driverCompanyLike">
                        <el-input v-model.trim="form.driverCompanyLike" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item v-show="showMoreFlag" label="颜色" prop="vehicleColor">
                        <el-select v-model="form.vehicleColor" placeholder="全部" clearable style="width:120px">
                            <el-option
                                v-for="item in colorOptions"
                                :key="item.valCode"
                                :label="item.valName"
                                :value="item.valCode"
                            />
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
            <div style="float: left; padding-bottom:10px">
                <el-button v-permission="buttons.CarInfo.batchDelete" type="primary" @click="delSelectedWithConfirm">
                    批量删除</el-button>
                <el-button v-permission="buttons.CarInfo.importShare" type="primary" @click="importRes">
                    导入共享资源</el-button>
                <el-button v-permission="buttons.CarInfo.addToShare" type="primary" @click="addToRes">
                    添加至共享资源</el-button>
            </div>
            <div style="float: right;padding-bottom:10px">
                <el-button v-permission="buttons.CarInfo.insert" type="primary" @click="handleEdit">添加车辆</el-button>
                <el-button v-permission="buttons.CarInfo.import" @click="importCar">导入车辆信息</el-button>
                <el-button v-permission="buttons.CarInfo.export" @click="exportVehicle">导出查询结果</el-button>
            </div>
            <el-table
                ref="table"
                :data="carList"
                :height="tableHeight+ (this.$store.state.menu.buttons.indexOf(Global.buttons.CarInfo.batchDelete) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.CarInfo.insert) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.CarInfo.import) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.CarInfo.importShare) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.CarInfo.addToShare) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.CarInfo.export) !== -1 ? 0: 32)"
                style="width: 100%"
                tooltip-effect="light"
                :row-class-name="tableRowClassName"
                :header-cell-style="{
                    background:'#f7f7f7' ,'align':'center'
                }"
            >
                <el-table-column type="selection" prop="id" />
                <el-table-column label="车辆信息">
                    <template slot-scope="scope">
                        <div v-if="scope.row.vehicleTypeVO !== null && scope.row.vehicleTypeVO !== ''">
                            {{ scope.row.vehicleTypeVO.name }} | {{ scope.row.vehicleColorStr }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="platNum" label="车牌号" />
                <el-table-column label="座位数">
                    <template slot-scope="scope">
                        <div v-if="scope.row.vehicleTypeVO !== null && scope.row.vehicleTypeVO !== ''">
                            {{ scope.row.vehicleTypeVO.seatNum }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="车辆所属公司" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.vehicleCompanyVO !== null && scope.row.vehicleCompanyVO !== ''">
                            {{ scope.row.vehicleCompanyVO.name }}
                        </span>
                        <span v-else>
                            -
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="司机信息" align="left">
                    <template slot-scope="scope">
                        <div v-if="scope.row.driverVO !== null && scope.row.driverVO !== ''">
                            <div>{{ scope.row.driverVO.name }} </div>
                            <PhoneEncryption :value="scope.row.driverVO.phone" />
                            <!-- <span>{{ formatPhone(scope.row.driverVO.phone) }}</span>
                            <span style="display:none">{{ scope.row.driverVO.phone }}</span>
                            <el-button icon="el-icon-view" type="text" @click="(event) => qiehuanshoujijiami(event)" /> -->
                        </div>
                        <div v-else>
                            -
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="司机所属公司" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span
                            v-if="scope.row.driverVO !==null && scope.row.driverVO.vehicleCompanyVO !== null && scope.row.driverVO.vehicleCompanyVO !== ''"
                        >
                            {{ scope.row.driverVO.vehicleCompanyVO.name }}
                        </span>
                        <span v-else>
                            -
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            v-permission="buttons.CarInfo.edit"
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            v-permission="buttons.CarInfo.delete"
                            size="mini"
                            type="danger"
                            @click="handleDeleteWithConfirm(scope.$index, scope.row)"
                        >
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <div style="float:right;padding:10px"> -->
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
        <editCar ref="editCar" @getListInfo="getListInfo(paramData)" />
        <importCarRes :dialog-visible="importDialogVisible" @closeDialog="closeImportDialog" />
    </div>
</template>
<script>
import { getCarList, deleteCar, getVehicleColor, shareCar, downCar, exportVehicle } from '@/api/car'
import editCar from './editCar'
import { getTableHeight, formatPhone } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
import importCarRes from './importCarRes'
import { showLoading, closeLoading } from '@/utils/loading'

export default {
    name: 'CarList',
    components: { editCar, importCarRes },
    data() {
        return {
            buttons: this.Global.buttons,
            form: {
                conferenceId: getConferenceId(),
                platNumLike: '',
                vehicleTypeLike: '',
                seatNum: '',
                driverNameLike: '',
                driverPhoneLike: '',
                vehicleCompanyLike: '',
                driverCompanyLike: '',
                vehicleColor: ''

            },
            importDialogVisible: false,
            paramData: {
                conferenceId: getConferenceId(),
                pageSize: 10,
                pageNum: 1
            },
            pageInfo: {
                pageSizeList: [10, 20, 30],
                total: 0
            },
            showMoreFlag: false,
            colorOptions: [],
            carList: [],
            tableHeight: getTableHeight(215)

        }
    },
    watch: {
        // '$route' () {  // 对route进行监控  添加返回时会调用刷新数据
        //     this.getListInfo()

        // }
        'showMoreFlag': {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.tableHeight = getTableHeight(266)
                } else {
                    this.tableHeight = getTableHeight(215)
                }
            }
        }

    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() { },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.getColorOptions()
        this.getListInfo(this.paramData)
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
        exportVehicle() {
            const load = showLoading()
            var tempData = JSON.parse(JSON.stringify(this.paramData))
            tempData.pageSize = null
            tempData.pageNum = null
            exportVehicle(tempData).then(res => {
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
        importCar() {
            this.importDialogVisible = true
        },
        importRes() {
            downCar('conferenceId=' + getConferenceId()).then(res => {
                if (res.success) {
                    var message = '成功导入' + res.result.successCount + '条'
                    if (res.result.failCount) {
                        message += ',' + res.result.failCount + '条失败'
                    }
                    this.$message(message)
                    this.getListInfo(this.paramData)
                }
            })
        },
        addToRes() {
            shareCar('conferenceId=' + getConferenceId()).then(res => {
                if (res.success) {
                    var message = '成功共享' + res.result.successCount + '条'
                    if (res.result.failCount) {
                        message += ',' + res.result.failCount + '条失败'
                    }
                    this.$message(message)
                    this.getListInfo(this.paramData)
                }
            })
        },
        importDining() {
            this.importDialogVisible = true
        },
        closeImportDialog() {
            this.importDialogVisible = false
            this.getListInfo(this.paramData)
        },
        formatPhone(val) {
            return formatPhone(val)
        },
        qiehuanshoujijiami(event) {
            if (event.currentTarget.parentElement.children[1].style.display === 'none') {
                event.currentTarget.parentElement.children[1].style.display = ''
                event.currentTarget.parentElement.children[2].style.display = 'none'
            } else {
                event.currentTarget.parentElement.children[1].style.display = 'none'
                event.currentTarget.parentElement.children[2].style.display = ''
            }
        },
        delSelectedWithConfirm() {
            var selectedList = this.$refs.table.selection
            if (selectedList.length == 0) {
                this.$message('至少选择一条记录')
                return
            }
            this.$confirm('请确认是否删除车辆信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delSelected()
            }).catch(() => { })
        },
        handleDeleteWithConfirm(index, row) {
            this.$confirm('请确认是否删除车辆信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.handleDelete(index, row)
            }).catch(() => { })
        },
        showMore() {
            this.showMoreFlag = !this.showMoreFlag
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
        delSelected() {
            var ids = []
            var selectedList = this.$refs.table.selection
            if (selectedList.length == 0) {
                this.$message('至少选择一条记录')
                return
            }
            for (const item of selectedList) {
                ids.push(item.id)
            }

            console.log(ids)
            deleteCar(ids).then(response => {
                if (response.success) {
                    this.$message('删除成功')
                    this.paramData.pageNum = 1
                    this.getListInfo(this.paramData)
                }
            })
        },

        handleEdit(index, row) {
            if (row) {
                this.$refs['editCar'].showEdit(row)
            } else {
                this.$refs['editCar'].showEdit()
            }
        },
        handleDelete(index, row) {
            var id = []
            id.push(row.id)
            deleteCar(id).then(response => {
                if (response.success) {
                    this.$message('删除成功')
                    this.paramData.pageNum = 1
                    this.getListInfo(this.paramData)
                }
            })
        },
        tableRowClassName({ row, rowIndex }) {
            const index = rowIndex + 1
            if (index % 2 == 0) {
                return 'warning-row'
            }
        },
        onSubmit() {
            var params = Object.assign({}, this.form)
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
        getColorOptions() {
            getVehicleColor().then(response => {
                if (response.success) {
                    this.colorOptions = response.result
                } else {
                    this.$message('车的颜色分类获取失败' + response.message)
                }
            })
        },
        getListInfo(param) {
            getCarList(param).then(response => {
                if (response.success) {
                    console.log('carList' + response.result.list)
                    this.carList = response.result.list
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
//     background: #c0c0c0;
// } // 单数行的颜色

::v-deep .el-table .warning-row {
    background: #f7f7f7;
}
</style>
