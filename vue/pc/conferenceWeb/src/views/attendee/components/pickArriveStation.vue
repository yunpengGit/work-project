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
                    label="到达地点"
                >
                    <template slot-scope="scope">
                        <div :title="scope.row.destAirportName">{{ scope.row.destAirportName + (scope.row.destTerminal !== null ? scope.row.destTerminal : '') }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="到达时间"
                >
                    <template slot-scope="scope">
                        <div :title="scope.row.sta">{{ formatTableCellData(scope.row.sta) }}</div>
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
    name: 'PickArriveStation',
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
            default: '请选择到达地点'
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
