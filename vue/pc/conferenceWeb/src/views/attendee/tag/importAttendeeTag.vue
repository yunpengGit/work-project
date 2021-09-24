<template>
    <div class="">
        <el-dialog
            title="导入"
            width="40%"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="closeDialog"
        >

            <div style="width: 100%;padding-bottom:10px">
                请选择要导入的文件（Excel文件，文件大小不超过5M）
                <el-link :href="imagePath + '/importTemplate/议程导入模板.xlsx'" :underline="false" type="primary" style="float: right">
                    <i class="el-icon-download" />
                    下载模板
                </el-link>

            </div>
            <el-upload
                class="importClass"
                drag
                action="https://jsonplaceholder.typicode.com/posts/"
            >
                <i class="el-icon-upload" />
                <div class="el-upload__text" style="width: 100%">拖拽或<em>点击选择文件</em></div>
            </el-upload>
            <div class="demo-drawer__footer" style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #FFFFFF">
                <el-button type="primary" @click="closeDialog">导入</el-button>
                <el-button style="height:32px;margin-top:12px" @click="closeDialog">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
export default {
    name: 'ImportAttendeeTag',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            imagePath: getOssBaseUrl()
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
