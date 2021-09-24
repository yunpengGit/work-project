<template>
    <div class="">
        <el-dialog
            title="资源下发"
            width="40%"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="closeDialog"
        >
            <el-form
                ref="ruleForm"
                :model="ruleForm"
                :rules="rules"
                label-width="0px"
                class="demo-ruleForm"
            >
                <el-form-item>
                    选择资源组处理
                </el-form-item>
                <el-form-item>
                    <div class="marginleftClass">
                        <el-checkbox v-model="checkAll" style="float:left" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
                        <el-checkbox-group v-model="xietong" style="float:left;margin-left:30px" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="xieton in xietongs" :key="xieton.value" :label="xieton.value">{{ xieton.text }}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="ziyuanxiafaSubmit">确定</el-button>
                <el-button @click="closeDialog">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
// getTaskCount
import { sendToTask } from '@/api/attendee'
import { getConferenceId } from '@/utils/conference-auth'
import { getView as getConferenceView } from '@/api/conference'
export default {
    name: 'TaskHand',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        attendeeIds: {
            type: Array,
            default: null
        },
        sourceType: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            allCheckeds: [],
            xietong: [],
            ruleForm: {},
            rules: {},
            checkAll: true,
            isIndeterminate: false,
            xietongs: []
        }
    },
    created() {
        this.getConferenceView()
    },
    methods: {
        getConferenceView() {
            getConferenceView({ 'id': getConferenceId() }).then(res => {
                if (res.result.useVehicleFlag === 1) {
                    this.allCheckeds.push('useVehicleFlag')
                    this.xietong.push('useVehicleFlag')
                    this.xietongs.push({ value: 'useVehicleFlag', text: '车辆组' })
                }
                if (res.result.useRoomFlag === 1) {
                    this.allCheckeds.push('useRoomFlag')
                    this.xietong.push('useRoomFlag')
                    this.xietongs.push({ value: 'useRoomFlag', text: '住宿组' })
                }
                if (res.result.useCardFlag === 1) {
                    this.allCheckeds.push('useCardFlag')
                    this.xietong.push('useCardFlag')
                    this.xietongs.push({ value: 'useCardFlag', text: '票证组' })
                }
                if (res.result.useDinnerFlag === 1) {
                    this.allCheckeds.push('useDinnerFlag')
                    this.xietong.push('useDinnerFlag')
                    this.xietongs.push({ value: 'useDinnerFlag', text: '餐饮组' })
                }
            })
        },
        handleCheckAllChange(val) {
            this.xietong = val ? this.allCheckeds : []
            this.isIndeterminate = false
        },
        handleCheckedCitiesChange(value) {
            const checkedCount = value.length
            this.checkAll = checkedCount === this.allCheckeds.length
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.allCheckeds.length
        },
        closeDialog() {
            this.$emit('closeDialog', null)
        },
        xifarenwuSubmit(types) {
            this.$confirm('请确认是否下发任务信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loading = true
                sendToTask({ 'conferenceId': getConferenceId(), 'attendeeIds': this.attendeeIds, 'types': types, 'sourceType': this.sourceType }).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        this.closeDialog()
                    }
                    this.loading = false
                }).catch(() => {
                    this.loading = false
                })
            }).catch(() => {
                this.loading = false
            })
        },
        ziyuanxiafaSubmit() {
            if (this.xietong === null || this.xietong.length === 0) {
                this.$message('请选择需要下发的资源组')
            } else {
                var types = []
                if (this.xietong.indexOf('useVehicleFlag') > -1) {
                    // types.push(50)
                    types.push(61)
                    types.push(62)
                    types.push(63)
                }
                if (this.xietong.indexOf('useRoomFlag') > -1) {
                    types.push(52)
                }
                if (this.xietong.indexOf('useCardFlag') > -1) {
                    types.push(53)
                }
                if (this.xietong.indexOf('useDinnerFlag') > -1) {
                    types.push(51)
                }
                this.xifarenwuSubmit(types)
                // this.loading = true
                // getTaskCount({ attendeeIds: [this.$route.params.id], types: types }).then(resForCount => {
                //     if (resForCount.success) {
                //         if (resForCount.result > 0) {
                //             this.$confirm('资源组存在未处理任务，下发将覆盖任务?', '提示', {
                //                 confirmButtonText: '确定',
                //                 cancelButtonText: '取消',
                //                 type: 'warning'
                //             }).then(() => {
                //                 this.xifarenwuSubmit(types)
                //             })
                //         } else {
                //             this.xifarenwuSubmit(types)
                //         }
                //     }
                //     this.loading = true
                // }).catch(() => {
                //     this.loading = true
                // })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
