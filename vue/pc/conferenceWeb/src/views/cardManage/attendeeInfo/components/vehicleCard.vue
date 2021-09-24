<template>
    <div>
        <div style="padding-left:8px;padding-right:8px;margin-top:0px">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form ref="form" :inline="true" :model="form">
                    <el-form-item label="车牌号" prop="platNumLike">
                        <el-input v-model.trim="form.platNumLike" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="车型" prop="vehicleTypeLike">
                        <el-input v-model.trim="form.vehicleTypeLike" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="公司" prop="companyNameLike">
                        <el-input v-model="form.companyNameLike" size="small" type="text" style="width: 120px" />
                    </el-form-item>
                    <el-form-item label="证件名称" prop="cardId">
                        <el-select v-model="form.cardId" placeholder="全部" clearable filterable style="width:140px">
                            <el-option
                                v-for="item in cardOptions"
                                :key="item.id"
                                :label="item.cardName"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="证件状态" prop="cardStatus">
                        <el-select v-model="form.cardStatus" placeholder="全部" clearable style="width:140px" filterable>
                            <el-option
                                v-for="item in cardStatusOptions"
                                :key="item.enumKey"
                                :label="item.enumValue"
                                :value="item.enumKey"
                            />
                        </el-select>
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
            <!-- <div style="float: left; padding-bottom:10px">
                <el-button type="primary" @click="handleDialog">调整证件状态</el-button>
            </div> -->
            <div style="float: right;padding-bottom:10px">
                <!-- <el-button type="primary" @click="handleEdit">添加</el-button>
                <el-button>导入</el-button> -->
                <!-- <el-button v-permission="buttons.CardAttendeeInfo.carExport">导出查询结果</el-button> 20210527biaoji -->
            </div>
            <el-table
                ref="table"
                :data="vehicleCardInfoList"
                :height="tableHeight+ (this.$store.state.menu.buttons.indexOf(Global.buttons.CardAttendeeInfo.carExport) !== -1
                    ? 0: 32)"
                style="width: 100%"
                :row-class-name="tableRowClassName"
                :header-cell-style="{
                    background:'#f7f7f7'
                }"
            >
                <el-table-column type="selection" prop="id" />
                <el-table-column label="车牌号">
                    <template slot-scope="scope">
                        {{ scope.row.platNum }}
                    </template>
                </el-table-column>
                <el-table-column label="车型">
                    <template slot-scope="scope">
                        <div v-if="scope.row.vehicleTypeVO!=null && scope.row.vehicleTypeVO!=''">
                            {{ scope.row.vehicleTypeVO.name }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="公司">
                    <template slot-scope="scope">
                        <div v-if="scope.row.vehicleCompanyVO!=null && scope.row.vehicleCompanyVO!=''">
                            {{ scope.row.vehicleCompanyVO.name }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="证件信息">
                    <template slot-scope="scope">
                        <el-popover
                            v-if="scope.row.cardList !=null && scope.row.cardList.length > 0 "
                            placement="bottom-start"
                            width="250px"
                            trigger="hover"
                        >
                            <div v-for="cardList in scope.row.cardList" :key="cardList.id">
                                {{ cardList.cardName }} (
                                {{ cardList.cardStatusStr }} )

                            </div>
                            <div
                                v-if="scope.row.cardList !=null && scope.row.cardList.length > 0 "
                                slot="reference"
                                class=" content"
                            >
                                {{ scope.row.cardList[0].cardName }} (
                                {{ scope.row.cardList[0].cardStatusStr }} )
                                <span v-if="scope.row.cardList !=null && scope.row.cardList.length > 1">...</span>

                            </div>
                        </el-popover>

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

    </div>
</template>

<script>

import { getCardList, getCardStatusOptions, getVehicleInfoList } from '@/api/card'
import { getTableHeight } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
export default {
    name: 'VehicleCardInfoList',
    components: {},
    props: {

    },
    data() {
        return {
            buttons: this.Global.buttons,
            form: {
                conferenceId: getConferenceId(),
                cardId: '',
                companyNameLike: '',
                cardStatus: '',
                platNumLike: '',
                vehicleTypeLike: ''

            },
            paramData: {
                conferenceId: getConferenceId(),
                attendeeRoleFlagEqual: [0, 1, 2, 3, 4],
                pageSize: 10,
                pageNum: 1
            },
            pageInfo: {
                pageSizeList: [10, 20, 30],
                total: 0
            },
            vehicleCardInfoList: [],
            cardOptions: [],
            cardStatusOptions: [],
            tableHeight: getTableHeight(183) // 20210527biaoji

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
        this.getCardOptions()
        this.getCardStatusOptions()
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

        getCardStatusOptions () {
            getCardStatusOptions().then(res => {
                if (res.success) {
                    this.cardStatusOptions = res.result.list;
                }
            })
        },
        getCardOptions () {
            getCardList({ "conferenceId": getConferenceId(), "cardType": 2 }).then(res => {
                if (res.success) {
                    this.cardOptions = res.result.list;
                }
            })
        },



        // handleDialog () {
        //     var selectedList = this.$refs.table.selection;
        //     if (selectedList.length > 0) {
        //         //      this.$refs["changeStatusDialog"].showDialog(selectedList);
        //     } else {
        //         this.$message("至少选择一条数据")
        //     }
        // },

        handleSizeChange (val) {
            console.log("长度改变：" + val)
            this.paramData.pageSize = val
            this.getListInfo(this.paramData)
        },
        handleCurrentChange (val) {
            console.log("当前页码改变：" + val)
            this.paramData.pageNum = val
            this.getListInfo(this.paramData)
        },




        tableRowClassName ({ row, rowIndex }) {
            let index = rowIndex + 1;
            if (index % 2 == 0) {
                return 'warning-row'
            }
        },
        onSubmit () {
            var params = this.form;
            for (var key in params) {
                if (params[key] === '') {
                    delete params[key]
                }
            }
            params['pageSize'] = this.paramData.pageSize;
            params['pageNum'] = 1;
            params['attendeeRoleFlagEqual'] = [0, 1, 2, 3, 4];
            this.getListInfo(params)
        },
        resetForm (form) {
            this.$refs[form].resetFields();
        },


        getListInfo (param) {
            getVehicleInfoList(param).then(response => {
                if (response.success) {
                    console.log("vehicleCardInfoList" + response.result.list);
                    this.vehicleCardInfoList = response.result.list;
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
