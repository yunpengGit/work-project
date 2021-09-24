<template>
    <div class="">
        <el-dialog
            title="通知信息"
            width="45%"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="closeDialog"
        >
            <el-form
                label-width="100px"
                class="demo-ruleForm"
                style="padding-bottom:20px"
            >
                <el-form-item label="通知内容">
                    <el-input
                        v-model="noticeInsideContent"
                        :disabled="true"
                        type="textarea"
                        :rows="8"
                        style="width:80%"
                    />
                </el-form-item>
            </el-form>
            <div class="demo-drawer__footer" style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD">
                <el-button style="height:32px;margin-top:12px" @click="closeDialog">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'NoticeInsideView',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        noticeInsideContent: {
            type: String,
            default: null
        }
    },
    methods: {
        closeDialog() {
            this.$emit('closeDialog', null)
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
