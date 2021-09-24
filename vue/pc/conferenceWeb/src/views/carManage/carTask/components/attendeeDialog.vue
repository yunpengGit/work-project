<template>
    <div v-if="dialogVisible">
        <el-dialog ref="dialog" :visible.sync="dialogVisible" width="90%" top="10px" :show-close="false" append-to-body>
            <div style="margin-top:-40px">
                <refAttendeeList ref="refAttendeeList" />
            </div>

            <span slot="footer" class="dialog-footer">
                <div style="margin-top:-30px">
                    <el-button type="primary" @click="onSubmit">确 定</el-button>
                    <el-button @click="dialogVisible = false">关闭</el-button>
                </div>
            </span>
        </el-dialog>

    </div>
</template>
<script>
import refAttendeeList from './refAttendeeList'
import { addVehicleTaskAttendee } from '@/api/car'
import { getConferenceId } from '@/utils/conference-auth'
import { getTableHeight, formatPhone } from '@/utils/index'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'


export default {
    name: 'TaskDialog',
    components: { refAttendeeList },
    data () {
        return {
            taskId: '',
            dialogVisible: false,
            imagePath: getOssBaseUrl(),
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO
        }
    },
    watch: {


    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created () { },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted () {
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
    methods: {


        showDialog (param) {
            this.dialogVisible = true
            this.taskId = param
            this.$message(param)
        },
        refresh (val) {
            this.$emit('getListInfo')
            if (val) {
                this.dialogVisible = false
            }
        },
        onSubmit () {
            var selectedList = this.$refs['refAttendeeList'].$refs['table'].selection
            if (selectedList.length === 0) {
                this.$message("至少选择一条数据")
                return
            }
            var attendees = []
            selectedList.forEach(item => {
                attendees.push({ 'id': item.id })
            })
            var params = {
                'taskId': this.taskId,
                'attendees': attendees,
                'conferenceId': getConferenceId(),
                "contact": true  //待处理  批量时先默认联系乘车人
            }
            console.log(params)
            addVehicleTaskAttendee(params).then(res => {
                if (res.success) {
                    this.dialogVisible = false
                    this.$emit("refresh")
                }
            })

        },


    }
}
</script>
<style lang='scss'  >
</style>
