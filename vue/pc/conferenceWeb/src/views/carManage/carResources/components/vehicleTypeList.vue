<template>
    <div>
        <div style="padding-left:8px;padding-right:8px;margin-top:0px">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form ref="form" :inline="true" :model="form">
                    <el-form-item label="车型" prop="nameLike">
                        <el-input v-model.trim="form.nameLike" size="small" type="text" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="座位数" prop="seatNum">
                        <el-input v-model.trim="form.seatNum" size="small" style="width: 120px" />
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
                <el-button
                    v-permission="buttons.VehicleType.batchDelete"
                    type="primary"
                    @click="delSelectedWithConfirm"
                >批量删除</el-button>
                <el-button v-permission="buttons.VehicleType.importShare" type="primary" @click="importRes">
                    导入共享资源</el-button>
                <el-button v-permission="buttons.VehicleType.addToShare" type="primary" @click="addToRes">
                    添加至共享资源</el-button>
            </div>
            <div style="float: right;padding-bottom:10px">
                <el-button v-permission="buttons.VehicleType.insert" type="primary" @click="handleEdit">添加车型</el-button>
                <el-button v-permission="buttons.VehicleType.import" @click="importCarType">导入车型信息</el-button>
                <el-button v-permission="buttons.VehicleType.export" @click="exportType">导出查询结果</el-button>
            </div>
            <el-table
                ref="table"
                :data="vehicleTypeList"
                :height="tableHeight+ (this.$store.state.menu.buttons.indexOf(Global.buttons.VehicleType.batchDelete) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.VehicleType.insert) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.VehicleType.import) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.VehicleType.importShare) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.VehicleType.addToShare) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.VehicleType.export) !== -1 ? 0: 32)"
                style="width: 100%"
                :row-class-name="tableRowClassName"
                :header-cell-style="{
                    background:'#f7f7f7'
                }"
            >
                <el-table-column type="selection" prop="id" />
                <el-table-column prop="name" label="车型" />
                <el-table-column prop="seatNum" label="座位数" />
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            v-permission="buttons.VehicleType.edit"
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            v-permission="buttons.VehicleType.delete"
                            size="mini"
                            type="danger"
                            @click="handleDeleteWithConfirm(scope.$index, scope.row)"
                        >
                            删除
                        </el-button>
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
        <editVehicleType ref="editVehicleType" @getListInfo="getListInfo(paramData)" />
        <importCarTypeRes :dialog-visible="importDialogVisible" @closeDialog="closeImportDialog" />
    </div>
</template>

<style lang='scss' scoped >
// ::v-deep .el-table tr {
//   background: #c0c0c0;
// } // 单数行的颜色

::v-deep .el-table .warning-row {
    background: #f7f7f7;
}

.contents {
    padding: 10px;
}
.button-three {
    float: right;
}
.botton {
    margin-left: 10px;
}
.form-content {
    width: auto;
    height: auto;
    background: #fafafa;
    padding-left: 20px;
    padding-right: 10px;
    padding-top: 10px;
}

.lables {
    width: auto;
    height: auto;
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 10px;
    background: #ffffff;
    box-shadow: 0px 0px 0px 0px rgba(25, 31, 36, 0.08);
}
</style>

<script>
import editVehicleType from './editVehicleType'
import { getVehicleTypeList, deleteVehicleType, shareType, downType, exportType } from '@/api/car'
import { getTableHeight } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
import importCarTypeRes from './importCarTypeRes'
import { showLoading, closeLoading } from '@/utils/loading'

export default {
    name: 'VehicleTypeList',
    components: { editVehicleType, importCarTypeRes },
    data() {
        return {
            importDialogVisible: false,
            buttons: this.Global.buttons,
            form: {
                conferenceId: getConferenceId(),
                nameLike: '',
                seatNum: ''
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
            vehicleTypeList: [],
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
        exportType() {
            const load = showLoading()
            var tempData = JSON.parse(JSON.stringify(this.paramData))
            tempData.pageSize = null
            tempData.pageNum = null
            exportType(tempData).then(res => {
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
        importCarType() {
            this.importDialogVisible = true
        },
        importRes() {
            downType('conferenceId=' + getConferenceId()).then(res => {
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
            shareType('conferenceId=' + getConferenceId()).then(res => {
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

        delSelectedWithConfirm() {
            var selectedList = this.$refs.table.selection
            if (selectedList.length == 0) {
                this.$message('至少选择一条记录')
                return
            }
            this.$confirm('请确认是否删除车型信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delSelected()
            }).catch(() => { })
        },
        handleDeleteWithConfirm(index, row) {
            this.$confirm('请确认是否删除车型信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.handleDelete(index, row)
            }).catch(() => { })
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
            var params = {
                ids: ids.join(',')
            }
            console.log(ids)
            deleteVehicleType(this.$qs.stringify(params)).then(response => {
                if (response.success) {
                    this.$message('删除成功')
                    this.paramData.pageNum = 1
                    this.getListInfo(this.paramData)
                }
            })
        },

        handleEdit(index, row) {
            if (row) {
                this.$refs['editVehicleType'].showEdit(row)
            } else {
                this.$refs['editVehicleType'].showEdit()
            }
        },
        handleDelete(index, row) {
            var params = {
                ids: row.id
            }
            deleteVehicleType(this.$qs.stringify(params)).then(response => {
                if (response.success) {
                    this.paramData.pageNum = 1
                    this.$message('删除成功')
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
            getVehicleTypeList(param).then(response => {
                if (response.success) {
                    console.log('vehicleTypeList' + response.result.list)
                    this.vehicleTypeList = response.result.list
                    this.pageInfo.total = response.result.total

                    this.paramData = param
                }
            })
        }

    }
}
</script>
