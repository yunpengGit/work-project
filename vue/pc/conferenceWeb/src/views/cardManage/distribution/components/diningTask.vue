<template>

    <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
        <div style="float: right;padding-bottom:10px">
            <el-checkbox v-model="checked">仅查看推荐</el-checkbox>
        </div>
        <el-table :data="cardList" ref="table" style="width: 100%" @select="select" @select-all="selectAll"
            :header-cell-class-name="cellClass" :height="300" :row-class-name="tableRowClassName" :header-cell-style="{ 
        background:'#f7f7f7'
                }">
            <el-table-column type="selection" prop="id">
            </el-table-column>
            <el-table-column label="证件名称">
                <template slot-scope="scope">
                    <div class="matching-style">{{ scope.row.cardName }}<i v-if="scope.row.matching">推荐</i></div>
                </template>
            </el-table-column>
            <el-table-column prop="totalCount" label="总数量(张)" />
            <el-table-column label="已分配(张)" width="180px">
                <template slot-scope="scope">
                    {{scope.row.totalCount - scope.row.remainCount}}
                </template>
            </el-table-column>

        </el-table>

    </div>
</template>
<script>
import { getCardList } from '@/api/card'
import { getConferenceId } from '@/utils/conference-auth'

export default {
    name: 'cardList',
    props: {
        attendeeIds: {
            type: Array
        }
    },
    components: {},
    methods: {
        showDialog() {
            // alert(1)
        },
        cellClass (row) {
            if (row.columnIndex === 0) {
                return 'disabledCheck'
            }
        },

        //限制只能单选
        select (selection, row) {
            if (selection.length > 1) {
                let del_row = selection.shift()
                this.$refs.table.toggleRowSelection(del_row, false)
            }
        },
        selectAll (selection) {
            if (selection.length > 1) {
                selection.length = 1
            }
        },



        tableRowClassName ({ row, rowIndex }) {
            let index = rowIndex + 1;
            if (index % 2 == 0) {
                return 'warning-row'
            }
        },
        getCardOptions (matching = false) {
            const attendeeIds = this.attendeeIds
            const matchingAttendeeIds = this.attendeeIds
            console.log(555, this.attendeeIds)
            getCardList({ "conferenceId": getConferenceId(), "cardType": 1, matching, attendeeIds, matchingAttendeeIds }).then(res => {
                if (res.success) {
                    this.cardList = res.result.list;
                }
            })
        }

    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created () { },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted () {
        // this.getListInfo(this.paramData)
        this.getCardOptions()
    },
    watch: {
        // '$route' () {  // 对route进行监控  添加返回时会调用刷新数据
        //     this.getListInfo(this.paramData)

        // },
        checked(val) {
            this.getCardOptions(val)
            // this.paramData.matching = val
            // this.getListInfo(this.paramData)
        }



    },
    // 这里存放数据
    beforeCreate () { },
    // 生命周期 - 挂载之前 
    beforeMount () { },
    // 生命周期 - 更新之前 
    beforeUpdate () { },
    // 生命周期 - 更新之后 
    updated () { },
    // 生命周期 - 销毁之前 
    beforeDestroy () { },
    // 生命周期 - 销毁完成 
    destroyed () { },
    // 如果页面有keep-alive缓存功能，这个函数会触发
    activated () { },
    data () {
        return {
            cardList: [],
            checked: false
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
/* 去掉全选按钮 */
::v-deep .el-table .disabledCheck .cell .el-checkbox__inner {
    display: none !important;
}

::v-deep .el-table .disabledCheck .cell::before {
    content: "";
    text-align: center;
    line-height: 37px;
}
</style>