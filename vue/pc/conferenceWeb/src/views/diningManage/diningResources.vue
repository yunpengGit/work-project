<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:8px">
        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form ref="form" :inline="true" :model="form">
                    <el-form-item label="餐厅名称" prop="dinnerRoomLike">
                        <el-input v-model.trim="form.dinnerRoomLike" size="small" type="text" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="餐厅位置" prop="diningAddressLike">
                        <el-input v-model.trim="form.diningAddressLike" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="餐位数" prop="seatNum">
                        <el-input v-model.trim="form.seatNum" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="联系人" prop="contactPersonLike">
                        <el-input v-model.trim="form.contactPersonLike" size="small" style="width: 120px" />
                    </el-form-item>
                    <!-- <el-form-item label="手机" prop="phoneLike">
                        <el-input v-model.trim="form.phoneLike" size="small" style="width: 120px" />
                    </el-form-item> -->
                    <el-form-item style="float:right">
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                        <el-button @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
            <div style="float: left; padding-bottom:10px">
                <el-button v-permission="buttons.Dining.delete" type="primary" @click="delSelectedWithConfirm">批量删除</el-button>

                <el-button v-permission="buttons.Dining.importShare" type="primary" @click="importRes">
                    导入共享资源</el-button>
                <el-button v-permission="buttons.Dining.addToShare" type="primary" @click="addToRes">
                    添加至共享资源</el-button>
            </div>
            <div style="float: right;padding-bottom:10px">
                <el-button v-permission="buttons.Dining.insert" type="primary" @click="handleEdit">添加餐厅</el-button>
                <el-button v-permission="buttons.Dining.import" @click="importDining">导入餐厅信息</el-button>
                <el-button v-permission="buttons.Dining.export" @click="exportDining">导出查询结果</el-button>
            </div>
            <el-table
                ref="table"
                :data="diningList"
                style="width: 100%"
                :height="tableHeight+ (this.$store.state.menu.buttons.indexOf(Global.buttons.Dining.addToShare) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.Dining.insert) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.Dining.import) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.Dining.importShare) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.Dining.export) !== -1 ? 0: 32)"
                :row-class-name="tableRowClassName"
                :header-cell-style="{
                    background:'#f7f7f7'
                }"
            >
                <el-table-column type="selection" prop="id" />
                <el-table-column prop="dinnerRoom" label="餐厅名称" />
                <el-table-column prop="diningAddress" label="餐厅位置" />
                <el-table-column prop="seatNum" label="餐位数" />
                <el-table-column prop="phone" label="联系电话">
                    <template slot-scope="scope">
                        {{ formatTableCellData(scope.row.phone) }}
                    </template>
                </el-table-column>
                <el-table-column prop="contactPerson" label="联系人">
                    <template slot-scope="scope">
                        {{ formatTableCellData(scope.row.contactPerson) }}
                    </template>
                </el-table-column>
                <el-table-column prop="contactPhone" label="联系人电话">
                    <template slot-scope="scope">
                        {{ formatTableCellData(scope.row.contactPhone) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            v-permission="buttons.Dining.edit"
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button v-permission="buttons.Dining.delete" size="mini" type="danger" @click="handleDeleteWithConfirm(scope.$index, scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- style="position:absolute;bottom:0px;right:20px;width:100%;background:#fff" -->
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
        <editDiningRoom ref="editDiningRoom" @getListInfo="getListInfo(paramData)" />
        <importDiningRes :dialog-visible="importDialogVisible" @closeDialog="closeImportDialog" />

    </div>
</template>
<script>
import editDiningRoom from './editDiningRoom'
import { getDiningList, deleteDining, shareDining, downDining, exportDining } from '@/api/dining'

import { getTableHeight } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
import importDiningRes from './importDiningRes'
import { showLoading, closeLoading } from '@/utils/loading'

export default {
    name: 'DiningResources',
    components: { editDiningRoom, importDiningRes },
    data() {
        return {
            buttons: this.Global.buttons,
            form: {
                conferenceId: getConferenceId(),
                dinnerRoomLike: '',
                diningAddressLike: '',
                seatNum: '',
                contactPersonLike: '',
                phoneLike: ''
            },
            importDialogVisible: false,
            diningList: [],
            paramData: {
                conferenceId: getConferenceId(),
                pageSize: 10,
                pageNum: 1

            },

            pageInfo: {
                pageSizeList: [10, 20, 30],
                total: 0
            },

            tableHeight: getTableHeight(160)
        }
    },
    watch: {

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

        exportDining() {
            const load = showLoading()
            var tempData = JSON.parse(JSON.stringify(this.paramData))
            tempData.pageSize = null
            tempData.pageNum = null
            exportDining(tempData).then(res => {
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

        importRes() {
            downDining('conferenceId=' + getConferenceId()).then(res => {
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
            shareDining('conferenceId=' + getConferenceId()).then(res => {
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
        delSelectedWithConfirm() {
            var selectedList = this.$refs.table.selection
            if (selectedList.length == 0) {
                this.$message('至少选择一条记录')
                return
            }
            this.$confirm('请确认是否删除餐厅信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delSelected()
            }).catch(() => { })
        },
        handleDeleteWithConfirm(index, row) {
            this.$confirm('请确认是否删除餐厅信息？', '', {
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

            deleteDining(ids).then(response => {
                if (response.success) {
                    this.$message('删除成功')
                    this.paramData.pageNum = 1
                    this.getListInfo(this.paramData)
                }
            })
        },

        handleEdit(index, row) {
            if (row) {
                this.$refs['editDiningRoom'].showEdit(row)
            } else {
                this.$refs['editDiningRoom'].showEdit()
            }
        },
        handleDelete(index, row) {
            var id = []
            id.push(row.id)
            deleteDining(id).then(response => {
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
            // 这里需要加入pageSize和pageNum参数
            params['pageSize'] = this.paramData.pageSize
            params['pageNum'] = 1
            this.getListInfo(params)
        },
        resetForm(form) {
            console.log(this.form)
            this.$refs[form].resetFields()
        },
        getListInfo(param) {
            getDiningList(param).then(response => {
                if (response.success) {
                    console.log('diningList' + response.result.list)
                    this.diningList = response.result.list
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
