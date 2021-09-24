<template>
    <div class="">
        <el-dialog :title="title" :width="width" top="12%" v-if="dialogVisible" :visible.sync="dialogVisible"
            :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialog">

            <div v-show="!shangchuanwancheng">
                <div style="width: 100%;padding-bottom:10px">
                    请选择要导入的文件（Excel文件，文件大小不超过{{ fileSize }}M）
                    <el-link :href="publicImagePath+'importTemplate/住宿/住宿任务导入模板.xlsx'" :underline="false" type="primary"
                        style="float: right">
                        <i class="el-icon-download" />
                        下载模板
                    </el-link>

                </div>
                <el-upload class="importClass" drag name="file" :accept="accept" :headers="uploadHeader"
                    :action="uploadUrl" :data="uploadData" :on-success="onSuccess" :on-error="onError"
                    :file-list="fileList" :before-upload="beforeUpload" :show-file-list="false">
                    <i class="el-icon-upload" />
                    <div class="el-upload__text" style="width: 100%">拖拽或<em>点击选择文件</em></div>
                </el-upload>
                <div class="demo-drawer__footer"
                    style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #FFFFFF">
                    <!-- <el-button type="primary" @click="closeDialog">导入</el-button> -->
                    <el-button style="height:32px;margin-top:12px" @click="closeDialog">关 闭</el-button>
                </div>
            </div>
            <!-- <div v-show="shangchuanwancheng">
                <div style="width: 100%;padding-bottom:10px">
                    导入完成。成功{{ successCount }}条，失败{{ failCount }}条。
                    <el-link v-if="failCount > 0" :href="imagePath + failPath" :underline="false" type="primary"
                        style="float: right">
                        <i class="el-icon-download" />
                        下载错误文件
                    </el-link>

                </div>
            </div> -->
            <div v-show="shangchuanwancheng">
                <div style="width: 100%;padding-bottom:10px">
                    成功{{ successCount }}条，失败{{ failCount }}条。
                    <!-- <el-link v-if="failCount > 0" :href="failPath" :underline="false" type="primary">
                        <i class="el-icon-download" />
                        下载错误文件
                    </el-link> -->

                </div>
                <div class="demo-drawer__footer" style="height:60px;padding-top:3px;border-top:solid 1px #FFFFFF">
                    <div style="float:right">
                        <el-button v-if="failCount > 0" style="height:32px;margin-top:12px;" @click="downFile">
                            下载错误文件
                        </el-button>
                        <el-button type="primary" style="height:32px;margin-top:12px;" @click="closeDialog">我知道了
                        </el-button>
                    </div>
                </div>

            </div>

        </el-dialog>
    </div>
</template>

<script>
import { getImportRoomTaskResult } from '@/api/hotel'
import { getConferenceId } from '@/utils/conference-auth'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
import { showLoading, closeLoading } from '@/utils/loading'
import { getOssPublicBaseUrl } from '@/utils/x-sso-publicbaseurl'

export default {
    name: 'ImportInvitation',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            fileList: [],
            failPath: null,
            successCount: 0,
            failCount: 0,
            shangchuanwancheng: false,
            load: null,
            fileSize: 5,
            accept: '.xls, .xlsx',
            uploadHeader: { 'authToken': this.$store.state.user.token },
            uploadUrl: process.env.VUE_APP_BASE_API + '/synergy/files/import/room/task',
            uploadData: {
                uuid: '',
                conferenceId: getConferenceId() // 会议ID，编辑会议上传附件传值
            },
            imagePath: getOssBaseUrl(),
            publicImagePath: getOssPublicBaseUrl(),
            title: '导入',
            width: '40%'

        }
    },
    watch: {
        dialogVisible () {
            this.shangchuanwancheng = false
            this.successCount = 0
            this.failCount = 0
            this.failPath = 0
            this.title = '导入'
            this.width = '40%'
        }

    },
    methods: {
        downFile () {
            window.location.href = this.failPath
        },
        closeDialog () {
            this.$emit('closeDialog', null)
        },
        onSuccess (response, file, fileList) {
            if (response.code === 2000) {
                //  this.$message(response.message)
                this.partMethod();
            } else {
                this.$message(response.message)
                this.closeLoading()
            }
        },
        partMethod () {
            var that = this;
            setTimeout(function () {
                that.getImportRoomTaskResult()
            }, 1000);
        },
        closeLoading () {
            if (this.load !== null) {
                closeLoading(this.load)
            }
        },
        getImportRoomTaskResult () {
            getImportRoomTaskResult({ 'uuid': this.uploadData.uuid, 'conferenceId': getConferenceId() }).then(res => {
                if (res.success && res.result.state === 2) {
                    this.successCount = res.result.succeedNumber
                    this.failCount = res.result.errorNumber
                    console.log("state--------------------" + res.result.state)
                    this.shangchuanwancheng = true
                    this.title = '导入完成'
                    this.width = '25%'
                    this.failPath = res.result.errorFile
                    this.closeLoading()
                } else {
                    console.log("state--------------------" + res.result.state)
                    this.partMethod();
                }
            })
        },
        onError (response) {
            this.$message(response.message)
            if (this.load !== null) {
                closeLoading(this.load)
            }
        },
        beforeUpload (file) {
            console.log(this.publicImagePath)
            this.uploadData.conferenceId = getConferenceId()
            const fileName = file.name.substring(file.name.lastIndexOf('.') + 1)
            const extension = fileName === 'xls'
            const extension2 = fileName === 'xlsx'
            this.uploadData.uuid = this.generateUUID()
            if (!extension && !extension2) {
                this.$message({
                    message: '上传文件只能是 xls、xlsx格式!',
                    type: 'info'
                })
                return false
            }

            const isLt200K = file.size / 1024 / 1024 > this.fileSize
            if (isLt200K) {
                this.$message({
                    message: '文件大小超过限制!',
                    type: 'info'
                })
                return false
            }
            this.load = showLoading()
            return true
        },
        generateUUID () {
            var d = new Date().getTime();
            if (window.performance && typeof window.performance.now === "function") {
                d += performance.now(); //use high-precision timer if available
            }
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
