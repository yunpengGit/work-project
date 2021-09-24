<template>
    <div class="">
        <el-dialog
            :title="title"
            width="58%"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="closeDialog"
        >
            <el-table
                :data="tableData"
                style="width: 100%"
                :height="tableHeight"
            >
                <el-table-column
                    label="出发地点"
                >
                    <template slot-scope="scope">
                        <div :title="scope.row.deptAirportName">{{ scope.row.deptAirportName + (scope.row.deptTerminal !== null ? scope.row.deptTerminal : '') }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="出发时间"
                >
                    <template slot-scope="scope">
                        <div :title="scope.row.std">{{ formatTableCellData(scope.row.std) }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="100"
                >
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            @click.native.prevent="xuanze(scope.row)"
                        >
                            选择
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="width:100%;height:5px" />
        </el-dialog>
    </div>
</template>

<script>
import { getTableHeight } from '@/utils/index'
export default {
    name: 'PickReturnStation',
    components: {
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        tableData: {
            type: Array,
            default: () => {
                return []
            }
        },
        title: {
            type: String,
            default: '请选择出发地点'
        }
    },
    data() {
        return {
            tableHeight: getTableHeight(235)
        }
    },
    methods: {
        closeDialog() {
            this.$emit('closeDialog', null)
        },
        xuanze(val) {
            this.$emit('closeDialog', val)
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
