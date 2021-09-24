<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:8px">
        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form ref="form" :inline="true" :model="form">
                    <div class="inquire_form">
                    <div class="form_left">
                    <el-form-item label="证件名称" prop="cardNameLike">
                        <el-input v-model.trim="form.cardNameLike" size="small" type="text" style="width: 100px" />
                    </el-form-item>
                    <el-form-item label="证件类型" prop="cardType">
                        <el-select v-model="form.cardType" placeholder="请选择" clearable style="width:110px" filterable>
                            <el-option
                                v-for="item in cardTypeOptions"
                                :key="item.cardType"
                                :label="item.cardTypeStr"
                                :value="item.cardType"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="生效时间" prop="effectiveTime">
                        <el-date-picker
                            v-model="form.effectiveTime"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期时间"
                        />
                    </el-form-item>
                    <el-form-item label="失效时间" prop="invalidTime">
                        <el-date-picker
                            v-model="form.invalidTime"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期时间"
                        />
                    </el-form-item>
                    </div>
                    <el-form-item  class="form_operation">
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                        <el-button @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                    </div>
                </el-form>
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
            <div style="float: left; padding-bottom:10px">
                <el-button v-permission="buttons.Card.batchDelete" type="primary" @click="delSelectedWithConfirm">批量删除
                </el-button>
            </div>
            <div style="float: right;padding-bottom:10px">
                <el-button v-permission="buttons.Card.insert" type="primary" @click="handleEdit">添加证件</el-button>
                <el-button v-permission="buttons.Card.import" @click="importCard">导入证件信息</el-button>
                <el-button v-permission="buttons.Card.export" @click="exportCard">导出查询结果</el-button>
            </div>
            <el-table
                ref="table"
                :data="cardList"
                style="width: 100%"
                :height="tableHeight+ (this.$store.state.menu.buttons.indexOf(Global.buttons.Card.batchDelete) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.Card.insert) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.Card.import) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.Card.export) !== -1 ? 0: 32)"
                tooltip-effect="light"
                :row-class-name="tableRowClassName"
                :header-cell-style="{
                    background:'#f7f7f7'
                }"
            >
                <el-table-column type="selection" prop="id" />
                <el-table-column prop="cardName" label="证件名称" />
                <el-table-column prop="cardTypeStr" label="证件类型" />
                <el-table-column prop="totalCount" label="证件数量(张)" />
                <el-table-column prop="effectiveTime" label="生效时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ formatTableCellData(scope.row.effectiveTime) }}
                    </template>
                </el-table-column>
                <el-table-column prop="invalidTime" label="失效时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ formatTableCellData(scope.row.invalidTime) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            v-permission="buttons.Card.edit"
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            v-permission="buttons.Card.delete"
                            size="mini"
                            type="danger"
                            @click="handleDeleteWithConfirm(scope.$index, scope.row)"
                        >
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
        <editCard ref="editCard" @getListInfo="getListInfo(paramData)" />
        <importCardRes :dialog-visible="importDialogVisible" @closeDialog="closeImportDialog" />
    </div>
</template>
<script>
import editCard from './components/editCard'
import { getCardList, deleteCard, exportCard } from '@/api/card'

import { getTableHeight } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
import importCardRes from './components/importCardRes'
import { showLoading, closeLoading } from '@/utils/loading'

export default {
    name: 'CardList',
    components: { editCard, importCardRes },
    data() {
        return {
            importDialogVisible: false,
            buttons: this.Global.buttons,
            form: {
                conferenceId: getConferenceId(),
                effectiveTime: '',
                invalidTime: '',
                cardNameLike: '',
                cardType: ''
            },
            cardList: [],
            cardTypeOptions: [{ cardType: 1, cardTypeStr: '嘉宾证' }, { cardType: 2, cardTypeStr: '车辆证' }],

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
        exportCard() {
            const load = showLoading()
            var tempData = JSON.parse(JSON.stringify(this.paramData))
            tempData.pageSize = null
            tempData.pageNum = null
            exportCard(tempData).then(res => {
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
        importCard() {
            this.importDialogVisible = true
        },

        delSelectedWithConfirm() {
            var selectedList = this.$refs.table.selection
            if (selectedList.length == 0) {
                this.$message('至少选择一条记录')
                return
            }
            this.$confirm('请确认是否删除证件信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delSelected()
            }).catch(() => { })
        },
        handleDeleteWithConfirm(index, row) {
            this.$confirm('请确认是否删除证件信息?', '提示', {
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

            deleteCard(ids).then(response => {
                if (response.success) {
                    this.$message('删除成功')
                    this.paramData.pageNum = 1
                    this.getListInfo(this.paramData)
                }
            })
        },

        handleEdit(index, row) {
            if (row) {
                this.$refs['editCard'].showEdit(row)
            } else {
                this.$refs['editCard'].showEdit()
            }
        },
        handleDelete(index, row) {
            var id = []
            id.push(row.id)
            deleteCard(id).then(response => {
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
            getCardList(param).then(response => {
                if (response.success) {
                    console.log('cardList' + response.result.list)
                    this.cardList = response.result.list
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
