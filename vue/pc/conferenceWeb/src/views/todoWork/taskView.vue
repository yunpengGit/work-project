<template>
    <div class="">
        <el-dialog
            title="任务信息"
            width="65%"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="closeDialog"
        >
            <el-form
                label-width="120px"
                class="demo-ruleForm"
                style="padding-bottom:20px"
            >
                <div
                    v-show="taskView.type === 2 || taskView.type === 4"
                    class="changeContentClass"
                    style="width:100%;background-color:white;height:72px;border-bottom: solid rgba(25, 31, 36, 0.08) 1px;white-space: nowrap;overflow-x: auto;overflow-y: hidden;-webkit-overflow-scrolling:touch;padding-left:20px;padding-top:16px;padding-right:20px;"
                >
                    <el-scrollbar style="height:100%;width:100%">
                        <div style="display: inline-block;padding-left:10px;font-size:14px;line-height:20px">
                            <div>
                                <span>变更前：</span>
                            </div>
                            <div>
                                <span style="color:#1E89FF">变更后：</span>
                            </div>
                        </div>
                        <div
                            v-for="changeItem in changeList"
                            :key="changeItem.code"
                            style="display: inline-block;padding-left:10px;font-size:14px;line-height:20px"
                        >
                            <div>
                                <span style="color: rgba(25, 31, 36, 0.48);">{{ changeItem.attribute }}：</span>
                                <span v-if="changeItem.code !== 'photoUrl'">{{ changeItem.beforeValue }}</span>
                                <span v-else class="demo-image__preview" style="float:right;margin-top:2px">
                                    <el-image
                                        style="width:13px;height:13px;border-radius:50%;margin-top:2px"
                                        :src="imagePath + (changeItem.beforeValue !== null && changeItem.beforeValue !== '' ? changeItem.beforeValue : defaultPhoto)"
                                        :preview-src-list="[imagePath + (changeItem.beforeValue !== null && changeItem.beforeValue !== '' ? changeItem.beforeValue : defaultPhoto)]"
                                    />
                                </span>
                            </div>
                            <div>
                                <span style="color: rgba(25, 31, 36, 0.48);">{{ changeItem.attribute }}：</span>
                                <span
                                    v-if="changeItem.code !== 'photoUrl'"
                                    style="color:#1E89FF"
                                >{{ changeItem.afterValue }}</span>
                                <!-- <img v-else style="width:15px;height:15px;border-radius:50%" :src="imagePath + (changeItem.afterValue !== null && changeItem.afterValue !== '' ? changeItem.afterValue : defaultPhoto)"> -->
                                <span v-else class="demo-image__preview">
                                    <el-image
                                        style="width:14px;height:14px;border-radius:50%;margin-top:4px"
                                        :src="imagePath + (changeItem.afterValue !== null && changeItem.afterValue !== '' ? changeItem.afterValue : defaultPhoto)"
                                        :preview-src-list="[imagePath + (changeItem.afterValue !== null && changeItem.afterValue !== '' ? changeItem.afterValue : defaultPhoto)]"
                                    />
                                </span>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
                <div
                    v-show="taskView.type === 3"
                    class="changeContentClass"
                    style="width:100%;background-color:white;height:72px;border-bottom: solid rgba(25, 31, 36, 0.08) 1px;white-space: nowrap;overflow-x: auto;overflow-y: hidden;-webkit-overflow-scrolling:touch;padding-left:20px;padding-top:16px;padding-right:20px;"
                >
                    <div style="display: inline-block;padding-left:10px;font-size:14px;line-height:20px">
                        <div style="margin-top:10px">
                            <span>变更类型：{{ taskView.attendeeName }}申请取消参会</span>
                        </div>
                    </div>
                </div>
                <div
                    v-show="taskView.type === 5"
                    class="changeContentClass"
                    style="width:100%;background-color:white;height:72px;border-bottom: solid rgba(25, 31, 36, 0.08) 1px;white-space: nowrap;overflow-x: auto;overflow-y: hidden;-webkit-overflow-scrolling:touch;padding-left:20px;padding-top:16px;padding-right:20px;"
                >
                    <div style="display: inline-block;padding-left:10px;font-size:14px;line-height:20px">
                        <div>
                            <span>请假类型：{{ changeList.typeStr }}</span>
                            <span
                                style="margin-left:20px"
                            >离会时间：{{ changeList.leaveTime !== undefined && changeList.leaveTime !== null && changeList.leaveTime.length === 19 ? changeList.leaveTime.substr(0,16) : changeList.leaveTime }}</span>
                            <span
                                v-show="changeList.type !== 4"
                                style="margin-left:20px"
                            >返回时间：{{ changeList.returnTime !== undefined && changeList.returnTime !== null && changeList.returnTime.length === 19 ? changeList.returnTime.substr(0,16) : changeList.returnTime }}</span>
                        </div>
                        <div>
                            <span :title="changeList.reason">请假原因：{{ changeList.reason }}</span>
                        </div>
                    </div>
                </div>
                <el-form-item label="任务标题" style="margin-top:10px">
                    <el-input
                        v-model="taskView.todoTitle"
                        :disabled="true"
                        type="text"
                        style="width:80%"
                    />
                </el-form-item>
                <el-form-item label="会议名称">
                    <el-input
                        v-model="taskView.conferenceName"
                        :disabled="true"
                        type="text"
                        style="width:80%"
                    />
                </el-form-item>
                <el-form-item :label="getConferenceTemplate(2) + '姓名'">
                    <el-input
                        v-model="taskView.attendeeName"
                        :disabled="true"
                        type="text"
                        style="width:80%"
                    />
                </el-form-item>
                <el-form-item :label="getConferenceTemplate(2) + '单位名称'">
                    <el-input
                        v-model="taskView.orgName"
                        :disabled="true"
                        type="text"
                        style="width:80%"
                    />
                </el-form-item>
                <el-form-item label="任务类别">
                    <el-input
                        v-model="taskView.typeStr"
                        :disabled="true"
                        type="text"
                        style="width:80%"
                    />
                </el-form-item>
                <el-form-item label="状态">
                    <el-input
                        v-model="taskView.resultStr"
                        :disabled="true"
                        type="text"
                        style="width:80%"
                    />
                </el-form-item>
                <el-form-item v-show="taskView.result === 2 || taskView.result === -3" label="拒绝原因">
                    <el-input
                        v-model="taskView.verifyReason"
                        :disabled="true"
                        type="textarea"
                        :rows="8"
                        style="width:80%"
                    />
                </el-form-item>
                <el-form-item label="发起人">
                    <el-input
                        v-model="taskView.createUserName"
                        :disabled="true"
                        type="text"
                        style="width:80%"
                    />
                </el-form-item>
                <el-form-item label="发起时间">
                    <el-input
                        v-model="taskView.createTime"
                        :disabled="true"
                        type="text"
                        style="width:80%"
                    />
                </el-form-item>
                <el-form-item label="审核人">
                    <el-input
                        v-model="taskView.verifyUserName"
                        :disabled="true"
                        type="text"
                        style="width:80%"
                    />
                </el-form-item>
                <el-form-item label="审核时间">
                    <el-input
                        v-model="taskView.verifyTime"
                        :disabled="true"
                        type="text"
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
import { getTaskView } from '@/api/attendee'
export default {
    name: 'TaskView',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        taskId: {
            type: null,
            default: null
        }
    },
    data() {
        return {
            taskView: {

            },
            changeList: []
        }
    },
    watch: {
        dialogVisible(val) {
            if (val) {
                this.getTaskView()
            }
        }
    },
    methods: {
        closeDialog() {
            this.$emit('closeDialog', null)
        },
        getTaskView() {
            getTaskView({ 'id': this.taskId }).then(res => {
                this.taskView = res.result
                if (this.taskView.type === 2 || this.taskView.type === 4 || this.taskView.type === 5) {
                    if (this.taskView.changeContent !== null && this.taskView.changeContent !== '') {
                        this.changeList = JSON.parse(this.taskView.changeContent)
                    }
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
