<template>
    <div>
        <div style="padding-left:8px;padding-right:8px;margin-top:0px">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form ref="form" :inline="true" :model="form">
                    <el-form-item label="酒店名称" prop="nameLike">
                        <el-input v-model.trim="form.nameLike" size="small" type="text" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="联系人姓名" prop="contactPersonLike">
                        <el-input v-model.trim="form.contactPersonLike" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="手机号" prop="phoneLike">
                        <el-input v-model.trim="form.phoneLike" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="酒店地址" prop="addressLike">
                        <el-input v-model.trim="form.addressLike" size="small" style="width: 200px" />
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
                <el-button v-permission="buttons.Hotel.batchDelete" type="primary" @click="delSelectedWithConfirm">批量删除
                </el-button>
                <el-button v-permission="buttons.Hotel.importShare" type="primary" @click="importRes">
                    导入共享资源</el-button>
                <el-button v-permission="buttons.Hotel.addToShare" type="primary" @click="addToRes">
                    添加至共享资源</el-button>
            </div>
            <div style="float: right;padding-bottom:10px">
                <el-button v-permission="buttons.Hotel.insert" type="primary" @click="handleEdit">添加酒店</el-button>
                <el-button v-permission="buttons.Hotel.import" @click="importHotel">导入酒店信息</el-button>
                <el-button v-permission="buttons.Hotel.export" @click="exportHotel">导出查询结果</el-button>
            </div>
            <el-table
                ref="table"
                :data="hotelList"
                :height="tableHeight+ (this.$store.state.menu.buttons.indexOf(Global.buttons.Hotel.batchDelete) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.Hotel.insert) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.Hotel.import) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.Hotel.importShare) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.Hotel.addToShare) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.Hotel.export) !== -1 ? 0: 32)"
                style="width: 100%"
                tooltip-effect="light"
                :row-class-name="tableRowClassName"
                :header-cell-style="{
                    background:'#f7f7f7'
                }"
            >
                <el-table-column type="selection" prop="id" />
                <el-table-column prop="name" label="酒店名称" />
                <el-table-column prop="contactPerson" label="联系人姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ formatTableCellData(scope.row.contactPerson) }}
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="手机号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ formatTableCellData(scope.row.phone) }}
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="酒店地址" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ formatTableCellData(scope.row.address) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            v-permission="buttons.Hotel.edit"
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            v-permission="buttons.Hotel.delete"
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
        <editHotel ref="editHotel" @getListInfo="getListInfo(paramData)" />
        <importHotelRes :dialog-visible="importDialogVisible" @closeDialog="closeImportDialog" />
    </div>
</template>

<style lang='scss' scoped >
// ::v-deep .el-table tr {
//   background: #c0c0c0;
// } // 单数行的颜色

::v-deep .el-table .warning-row {
    background: #f7f7f7;
}
</style>

<script>
import editHotel from './editHotel'
import { getHotelList, deleteHotel, downHotel, shareHotel, exportHotel } from '@/api/hotel'
import { getTableHeight } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
import importHotelRes from './importHotelRes'
import { showLoading, closeLoading } from '@/utils/loading'

export default {
    name: 'HotelList',
    components: { editHotel, importHotelRes },
    data() {
        return {
            importDialogVisible: false,
            buttons: this.Global.buttons,
            form: {
                conferenceId: getConferenceId(),
                nameLike: '',
                contactPersonLike: '',
                phoneLike: '',
                addressLike: ''
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
            hotelList: [],
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
        exportHotel() {
            const load = showLoading()
            var tempData = JSON.parse(JSON.stringify(this.paramData))
            tempData.pageSize = null
            tempData.pageNum = null
            exportHotel(tempData).then(res => {
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
        importHotel() {
            this.importDialogVisible = true
        },
        importRes() {
            downHotel('conferenceId=' + getConferenceId()).then(res => {
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
            shareHotel('conferenceId=' + getConferenceId()).then(res => {
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
            if (this.$refs.table.selection.length === 0) {
                this.$message('至少选择一条数据')
                return
            }
            this.$confirm('请确认是否删除酒店信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delSelected()
            }).catch(() => { })
        },
        handleDeleteWithConfirm(index, row) {
            this.$confirm('请确认是否删除酒店信息？', '', {
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
            for (const item of selectedList) {
                ids.push(item.id)
            }
            var params = {
                ids: ids.join(',')
            }
            console.log(ids)
            deleteHotel(this.$qs.stringify(params)).then(response => {
                if (response.success) {
                    this.$message('删除成功')
                    this.paramData.pageNum = 1
                    this.getListInfo(this.paramData)
                }
            })
        },

        handleEdit(index, row) {
            if (row) {
                this.$refs['editHotel'].showEdit(row)
            } else {
                this.$refs['editHotel'].showEdit()
            }
        },
        handleDelete(index, row) {
            var params = {
                ids: row.id
            }
            deleteHotel(this.$qs.stringify(params)).then(response => {
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
            getHotelList(param).then(response => {
                if (response.success) {
                    console.log('hotellist' + response.result.list)
                    this.hotelList = response.result.list
                    this.pageInfo.total = response.result.total
                    this.paramData = param
                }
            })
            this.$emit('getOptionInfo') // 刷新父组件中共用的options数据
        }

    }
}
</script>
