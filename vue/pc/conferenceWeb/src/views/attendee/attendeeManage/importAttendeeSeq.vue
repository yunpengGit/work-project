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

            <div v-show="!shangchuanwancheng">
                <div style="width: 100%;padding-bottom:10px">
                    请选择要导入的文件（Excel文件，文件大小不超过{{ fileSize }}M）
                    <el-link :underline="false" type="primary" style="float: right" @click="xiazaimuban">
                        <i class="el-icon-download" />
                        下载模板
                    </el-link>

                </div>
                <el-upload
                    class="importClass"
                    drag
                    name="file"
                    :accept="accept"
                    :headers="uploadHeader"
                    :action="uploadUrl"
                    :data="uploadData"
                    :on-success="onSuccess"
                    :on-error="onError"
                    :file-list="fileList"
                    :before-upload="beforeUpload"
                    :show-file-list="false"
                >
                    <i class="el-icon-upload" />
                    <div class="el-upload__text" style="width: 100%">拖拽或<em>点击选择文件</em></div>
                </el-upload>
                <div class="demo-drawer__footer" style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #FFFFFF">
                    <!-- <el-button type="primary" @click="closeDialog">导入</el-button> -->
                    <el-button style="height:32px;margin-top:12px" @click="closeDialog">关 闭</el-button>
                </div>
            </div>
            <div v-show="shangchuanwancheng">
                <div style="width: 100%;padding-bottom:10px;height:100px;margin-top:30px;">
                    导入完成。成功{{ succeedNumber }}条，失败{{ errorNumber }}条。
                    <el-link v-if="errorNumber > 0" :underline="false" type="primary" style="float: right" @click="downloadError">
                        <i class="el-icon-download" />
                        下载错误文件
                    </el-link>

                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getConferenceId } from '@/utils/conference-auth'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
import { getImportAttendeeSeqResult, downloadErrorFile } from '@/api/attendee'
import { downloadFile } from '@/api/common'
import { getUuid } from '@/utils/index'
import {
    showTextLoading,
    closeLoading
} from '@/utils/loading'
export default {
    name: 'ImportAttendeeSeq',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            importResultText: '正在导入...',
            fileList: [],
            succeedNumber: 0,
            errorNumber: 0,
            shangchuanwancheng: false,
            load: null,
            fileSize: 50,
            accept: '.xls, .xlsx',
            uploadHeader: { 'authToken': this.$store.state.user.token },
            uploadUrl: process.env.VUE_APP_BASE_API + '/synergy/files/import/attendee',
            uploadData: {
                uuid: '' // 会议ID，编辑会议上传附件传值
            },
            imagePath: getOssBaseUrl()
        }
    },
    watch: {
        dialogVisible() {
            this.shangchuanwancheng = false
            this.importResultText = '正在导入...'
            this.succeedNumber = 0
            this.errorNumber = 0
        }

    },
    methods: {
        xiazaimuban() {
            const load1 = showTextLoading('正在下载...')
            downloadFile({ filePath: 'importTemplate/参会人排序模板.xlsx' }).then(res => {
                if (decodeURI(res.headers['filename']) == null || decodeURI(res.headers['filename']) === 'undefined') {
                    this.$message('文件不存在')
                } else {
                    const blob = new Blob([res.data], { type: 'application/octet-stream' })
                    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                        navigator.msSaveBlob(blob, '参会人排序模板.xlsx')
                    } else {
                        const link = document.createElement('a')
                        link.style.display = 'none'
                        link.href = URL.createObjectURL(blob)
                        link.setAttribute('download', '参会人排序模板.xlsx')
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                    }
                }
                closeLoading(load1)
            }).catch(error => {
                console.log(error)
                closeLoading(load1)
            })
        },
        downloadError() {
            window.location.href = this.errorFilePath
            // const load1 = showTextLoading('正在下载...')
            // downloadErrorFile({ filePath: this.errorFilePath }).then(res => {
            //     if (decodeURI(res.headers['filename']) == null || decodeURI(res.headers['filename']) === 'undefined') {
            //         this.$message('文件不存在')
            //     } else {
            //         const blob = new Blob([res.data], { type: 'application/octet-stream' })
            //         const fileName = decodeURIComponent(decodeURI(res.headers['filename']))
            //         if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            //             navigator.msSaveBlob(blob, fileName)
            //         } else {
            //             const link = document.createElement('a')
            //             link.style.display = 'none'
            //             link.href = URL.createObjectURL(blob)
            //             link.setAttribute('download', fileName)
            //             document.body.appendChild(link)
            //             link.click()
            //             document.body.removeChild(link)
            //         }
            //     }
            //     closeLoading(load1)
            // }).catch(error => {
            //     console.log(error)
            //     closeLoading(load1)
            // })
        },
        closeDialog() {
            this.$emit('closeDialog', null)
        },
        getImportResult() {
            getImportAttendeeSeqResult(this.uploadData).then(res => {
                if (res.success) {
                    if (res.result.state === 1) {
                        this.importResultText = '正在导入，成功' + res.result.succeedNumber + '条，失败' + res.result.errorNumber + '条。'
                        this.load.setText(this.importResultText)
                        setTimeout(() => {
                            this.getImportResult()
                        }, 1000)
                    } else {
                        if (this.load !== null) {
                            closeLoading(this.load)
                        }
                        this.succeedNumber = res.result.succeedNumber
                        this.errorNumber = res.result.errorNumber
                        this.shangchuanwancheng = true
                        this.errorFilePath = res.result.errorFile
                        if (res.result.errorMessage !== null && res.result.errorMessage !== '') {
                            this.$message(res.result.errorMessage)
                        }
                    }
                } else {
                    this.getImportResult()
                }
            })
        },
        onSuccess(response, file, fileList) {
            if (response.code === 2000) {
                // this.infoMessage(response.message)
                this.shangchuanwancheng = false
                setTimeout(() => {
                    this.getImportResult()
                }, 1000)
            } else {
                this.$message(response.message)
                if (this.load !== null) {
                    closeLoading(this.load)
                }
            }
        },
        onError(response) {
            this.$message(response.message)
            if (this.load !== null) {
                closeLoading(this.load)
            }
        },
        beforeUpload(file) {
            this.uploadData.uuid = getUuid()
            this.uploadData.conferenceId = getConferenceId()
            const fileName = file.name.substring(file.name.lastIndexOf('.') + 1)
            const extension = fileName === 'xls'
            const extension2 = fileName === 'xlsx'

            if (!extension && !extension2) {
                this.$message('上传文件只能是 xls、xlsx格式!')
                return false
            }

            const isLt200K = file.size / 1024 / 1024 > this.fileSize
            if (isLt200K) {
                this.$message('文件大小超过限制!')
                return false
            }
            this.load = showTextLoading(this.importResultText)
            return true
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
