<template>
    <div class="">
        <el-dialog
            title="选择模板"
            width="40%"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="closeDialog"
        >
            <el-form
                ref="ruleForm"
                label-width="10px"
                class="demo-ruleForm"
            >
                <el-form-item>
                    <div v-for="item in templateList" :key="item.id">
                        <div style="width:200px;height:120px;float:left;margin-left:20px" @click="pickTemplate(item)">
                            <img style="width:200px;height:100px" :src="imagePath + item.cover">
                            <i v-if="item.id === templateId" class="el-icon-check" style="position: absolute;margin-left:-5px;margin-top:-5px;border-radius:50%;background-color:green;color:white" />
                            <div style="line-height:20px;width:100px;text-align:center">{{ item.name }}</div>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="xuanzemuban">确定</el-button>
                <el-button @click="closeDialog">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getTemplateList } from '@/api/conference'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
export default {
    name: 'ConferenceTemplate',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            templateView: null,
            templateId: null,
            templateList: [],
            imagePath: getOssBaseUrl()
        }
    },
    watch: {
        dialogVisible(val) {
            if (val) {
                getTemplateList().then(res => {
                    this.templateList = res.result
                })
            }
        }
    },
    methods: {
        pickTemplate(val) {
            this.templateId = val.id
            this.templateView = val
        },
        closeDialog() {
            this.$emit('closeDialog', null)
        },
        xuanzemuban() {
            if (this.templateId === null) {
                this.$message('请选择会议活动模板')
            } else {
                this.$emit('closeDialog', this.templateView)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
