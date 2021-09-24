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
import refAttendeeList from '../components/refAttendeeList'
// import { addVehicleTaskAttendee } from '@/api/car'
// import { getConferenceId } from '@/utils/conference-auth'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
import { addAttendee } from '@/api/special'
export default {
    name: 'AddSpecialTaskDialog',
    components: { refAttendeeList },
    data() {
        return {
            taskId: '',
            dialogVisible: false,
            imagePath: getOssBaseUrl(),
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO
        }
    },
    methods: {
        showDialog(param) {
            this.dialogVisible = true
            this.taskId = param
        },
        refresh(val) {
            this.$emit('getListInfo')
            if (val) {
                this.dialogVisible = false
            }
        },
        onSubmit() {
            var selectedList = this.$refs['refAttendeeList'].$refs['table'].selection
            if (selectedList.length === 0) {
                this.$message('至少选择一条数据')
            }
            var attendees = []
            selectedList.forEach(item => {
                attendees.push({ 'id': item.id })
            })
            var params = {
                'taskId': this.taskId,
                'attendees': attendees
            }
            addAttendee(params).then(res => {
                if (res.success) {
                    this.dialogVisible = false
                    this.$emit('refresh')
                }
            })
        }
    }
}
</script>
<style lang='scss'  >
</style>
