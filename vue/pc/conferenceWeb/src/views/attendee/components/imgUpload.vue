<template>
    <div class="">
        <el-upload
            class="upload-demo upload-remove-delete-text marginleftClass"
            :class="{hide:hideUploadEdit}"
            list-type="picture-card"
            name="files"
            :accept="acceptFile"
            :headers="uploadHeader"
            :action="uploadUrl"
            :data="uploadData"
            :on-success="onSuccessImg"
            :on-remove="handleRemoveImg"
            :on-change="handleChange"
            :file-list="fileList"
            :before-upload="beforeUploadImg"
            :on-exceed="onExceedImg"
        >
            <i class="el-icon-plus avatar-uploader-icon" />
            <div slot="file" slot-scope="{file}">
                <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url"
                    alt=""
                >
                <span class="el-upload-list__item-actions">
                    <span
                        class="el-upload-list__item-preview"
                        @click="handlePictureCardPreview(file)"
                    >
                        <i class="el-icon-view" />
                    </span>
                    <span
                        class="el-upload-list__item-delete"
                        @click="handleRemove(file)"
                    >
                        <i class="el-icon-delete" />
                    </span>
                </span>
            </div>
        </el-upload>
        <el-image-viewer
            v-if="showViewer"
            :on-close="closeViewer"
            :url-list="showViewerSrcList"
        />
        <div
            v-if="titleMsessage !== null && titleMsessage !== ''"
            class="_48OpacityClass marginleftClass"
            style="float:left;margin-top:5px;width:360px;white-space:normal;word-break:break-all;word-wrap:break-word;"
        >
            {{ titleMsessage }}
        </div>
    </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { getConferenceId } from '@/utils/conference-auth'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
import { checkPngHeightWidth } from '@/utils/index'
export default {
    name: 'ImgUpload',
    components: {
        ElImageViewer
    },
    props: {
        oldFileListStr: {
            type: String,
            default: null
        },
        uploadCount: {
            type: Number,
            default: 1
        },
        oldFileList: {
            type: Array,
            default: () => {
                return []
            }
        },
        fieldIndex: {
            type: Number,
            default: 0
        },
        fieldGroup: {
            type: Number,
            default: 0
        },
        titleMsessage: {
            type: String,
            default: null
        },
        acceptFile: {
            type: String,
            default: ''
        },
        maxVal: {
            type: String,
            default: ''
        },
        picMaxHeight: {
            type: String,
            default: ''
        },
        picMinHeight: {
            type: String,
            default: ''
        },
        picMaxWidth: {
            type: String,
            default: ''
        },
        picMinWidth: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            showViewerSrcList: [],
            showViewer: false,
            imagePath: getOssBaseUrl(),
            fileList: [],
            submitFileList: [],
            hideUploadEdit: false,
            accept: '.png, .jpg',
            uploadHeader: { 'authToken': this.$store.state.user.token },
            uploadUrl: process.env.VUE_APP_BASE_API + '/files/upload',
            uploadData: {
                fileGroup: 7, // 文件组
                conferenceId: getConferenceId() // 会议ID，编辑会议上传附件传值
            }
        }
    },
    watch: {
        // oldFileListStr() {
        //     this.initFile()
        // }
    },
    created() {
        this.initFile()
    },
    methods: {
        handleRemove(file) {
            this.handleRemoveImg(file, this.fileList)
        },
        handlePictureCardPreview(file) {
            this.showViewer = true
            this.showViewerSrcList = [file.url]
        },
        closeViewer() {
            this.showViewer = false
            this.showViewerSrcList = []
        },
        initFile() {
            if (this.oldFileList !== null) {
                var fileListTemp = []
                this.oldFileList.forEach(item => {
                    this.getFilePath(item.fileUrl).then(res => {
                        fileListTemp.push({ 'name': item.fileName, 'url': res.result })
                    })
                })
                this.fileList = fileListTemp
                this.submitFileList = this.oldFileList
                // this.fileList = fileListTemp
                // alert(this.fileList.length)
            } else {
                this.submitFileList = []
                this.fileList = []
            }
            this.hideUploadEdit = this.submitFileList.length >= this.uploadCount
            // alert(this.uploadCount)
        },
        /** *********************************图片上传相关开始***********************/
        onSuccessImg(response, file, fileList) { // 图片上传成功
            if (response.code === 2000) {
                const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
                const fileName = file.name.substring(0, file.name.lastIndexOf('.'))

                this.submitFileList.push({
                    fileName: fileName,
                    fileSuffix: fileSuffix,
                    fileUrl: response.result[0].filePath,
                    uuid: file.uid
                })

                this.fileList.push({
                    name: fileName,
                    url: response.result[0].downloadUrl,
                    uid: file.uid
                })

                this.$emit('addImg', this.fieldGroup, this.fieldIndex, this.submitFileList)
            } else {
                this.$message(response.message)
            }
        },
        handleRemoveImg(file, fileList) {
            this.fileList.splice(this.fileList.findIndex(item => item.uid === file.uid), 1)
            this.submitFileList.splice(this.submitFileList.findIndex(item => item.uuid === file.uid), 1)
            this.$emit('addImg', this.fieldGroup, this.fieldIndex, this.submitFileList)
            // this.submitFileList.splice
            this.hideUploadEdit = fileList.length >= this.uploadCount
        },
        beforeUploadImg(file) {
            return (new Promise((resolve, reject) => {
                this.uploadData.conferenceId = getConferenceId()
                const fileName = file.name.substring(file.name.lastIndexOf('.') + 1)
                if (this.acceptFile !== null && this.acceptFile !== '' && this.acceptFile.indexOf(fileName) === -1) {
                    this.$message({
                        message: '上传文件格式不正确，请选择' + this.acceptFile + '的文件!',
                        type: 'info'
                    })
                    reject()
                }

                const isLt5M = file.size / 1024 / 1024 > (this.maxVal === null || this.maxVal === '' ? 50 : this.maxVal)
                if (isLt5M) {
                    this.$message({
                        message: '文件大小不能超过' + (this.maxVal === null || this.maxVal === '' ? 50 : this.maxVal) + 'M!',
                        type: 'info'
                    })
                    reject()
                }

                checkPngHeightWidth(file, this.picMaxWidth, this.picMinWidth, this.picMaxHeight, this.picMinHeight, (val, val1) => {
                    if (!val) {
                        this.$message(val1)
                        reject()
                    }
                    resolve(file)
                })
            }))
        },
        onExceedImg(files, fileList) {
            this.$message('请删除已上传附件')
        },
        handleChange(file, fileList) {
            // 大于1张隐藏
            this.hideUploadEdit = fileList.length >= this.uploadCount
        }
        /** *********************************图片上传相关结束***********************/
    }
}
</script>
<style lang="scss" scoped>
.marginleftClass {
    margin-left: 5%;
}
._48OpacityClass {
    width: 343px;
    height: 32px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(25, 31, 36, 0.48);
    line-height: 16px;
}
</style>
