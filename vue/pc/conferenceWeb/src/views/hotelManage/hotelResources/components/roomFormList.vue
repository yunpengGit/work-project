<template>
    <div>
        <div style="padding-left:8px;padding-right:8px;margin-top:0px">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form ref="form" :inline="true" :model="form">
                    <el-form-item label="房型名称" prop="modelNameLike">
                        <el-input v-model.trim="form.modelNameLike" size="small" type="text" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="床位数" prop="capacity">
                        <el-input v-model.trim="form.capacity" size="small" style="width: 120px" />
                    </el-form-item>
                    <!-- <el-form-item label="酒店名称" prop="hotelId">
                        <el-select v-model="form.hotelId" placeholder="全部" clearable filterable>
                            <el-option v-for="item in hotelOptions" :key="item.id" :label="item.name"
                                :value="item.id" />
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="酒店名称" prop="hotelNameLike">
                        <el-input v-model.trim="form.hotelNameLike" size="small" style="width: 120px" />
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
                <el-button v-permission="buttons.RoomType.batchDelete" type="primary" @click="delSelectedWithConfirm">
                    批量删除
                </el-button>
                <el-button v-permission="buttons.RoomType.importShare" type="primary" @click="importRes">
                    导入共享资源</el-button>
                <el-button v-permission="buttons.RoomType.addToShare" type="primary" @click="addToRes">
                    添加至共享资源</el-button>
            </div>
            <div style="float: right;padding-bottom:10px">
                <el-button v-permission="buttons.RoomType.insert" type="primary" @click="handleEdit">添加房型</el-button>
                <el-button v-permission="buttons.RoomType.import" @click="importRoomForm">导入房型信息</el-button>
                <el-button v-permission="buttons.RoomType.export" @click="exportRoomForm">导出查询结果</el-button>
            </div>
            <el-table
                ref="table"
                :data="roomFormList"
                :height="tableHeight+ (this.$store.state.menu.buttons.indexOf(Global.buttons.RoomType.batchDelete) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.RoomType.insert) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.RoomType.import) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.RoomType.importShare) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.RoomType.addToShare) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.RoomType.export) !== -1 ? 0: 32)"
                style="width: 100%"
                :row-class-name="tableRowClassName"
                :header-cell-style="{
                    background:'#f7f7f7'
                }"
            >
                <el-table-column type="selection" prop="id" />
                <el-table-column prop="modelName" label="房型名称" />
                <el-table-column prop="capacity" label="床位数" />
                <el-table-column prop="hotelVO.name" label="酒店名称" />
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            v-permission="buttons.RoomType.edit"
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            v-permission="buttons.RoomType.delete"
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
        <editRoomForm ref="editRoomForm" :hotel-options="hotelOptions" @getListInfo="getListInfo(paramData)" />
        <importRoomFormRes :dialog-visible="importDialogVisible" @closeDialog="closeImportDialog" />
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
import editRoomForm from './editRoomForm'
import { getRoomFormList, deleteRoomForm, getHotelList, shareModel, downModel, exportRoomForm } from '@/api/hotel'
import { getTableHeight } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
import importRoomFormRes from './importRoomFormRes'
import { showLoading, closeLoading } from '@/utils/loading'

export default {
    name: 'RoomList',
    components: { editRoomForm, importRoomFormRes },
    props: {
        hotelOptions: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            importDialogVisible: false,
            buttons: this.Global.buttons,
            form: {
                conferenceId: getConferenceId(),
                modelNameLike: '',
                hotelNameLike: ''
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
            roomFormList: [],
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

        exportRoomForm() {
            const load = showLoading()
            var tempData = JSON.parse(JSON.stringify(this.paramData))
            tempData.pageSize = null
            tempData.pageNum = null
            exportRoomForm(tempData).then(res => {
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
        importRoomForm() {
            this.importDialogVisible = true
        },

        importRes() {
            downModel('conferenceId=' + getConferenceId()).then(res => {
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
            shareModel('conferenceId=' + getConferenceId()).then(res => {
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
            this.$confirm('请确认是否删除房型信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delSelected()
            }).catch(() => { })
        },
        handleDeleteWithConfirm(index, row) {
            this.$confirm('请确认是否删除房型信息？', '', {
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
            deleteRoomForm(this.$qs.stringify(params)).then(response => {
                if (response.success) {
                    this.$message('删除成功')
                    this.paramData.pageNum = 1
                    this.getListInfo(this.paramData)
                }
            })
        },

        handleEdit(index, row) {
            if (row) {
                this.$refs['editRoomForm'].showEdit(row)
            } else {
                this.$refs['editRoomForm'].showEdit()
            }
        },
        handleDelete(index, row) {
            var params = {
                ids: row.id
            }
            deleteRoomForm(this.$qs.stringify(params)).then(response => {
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
            getRoomFormList(param).then(response => {
                if (response.success) {
                    console.log('roomformlist' + response.result.list)
                    this.roomFormList = response.result.list
                    this.pageInfo.total = response.result.total

                    this.paramData = param
                }
            })
            this.$emit('getOptionInfo')
        }

    }
}
</script>
