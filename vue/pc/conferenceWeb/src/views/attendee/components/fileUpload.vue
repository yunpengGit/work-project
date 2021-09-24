<template>
    <div class="fileUploadClass marginleftClass">
        <el-upload
            v-show="submitFileList.length < uploadCount"
            class="upload-demo upload-remove-delete-text"
            name="files"
            :accept="acceptFile"
            :headers="uploadHeader"
            :action="uploadUrl"
            :on-success="onSuccess"
            :file-list="fileList"
            :show-file-list="false"
            :data="uploadData"
            :before-upload="beforeUpload"
        >
            <el-button type="primary" class="el-button-search" style="margin-top:12px;"><i class="el-icon-plus" style="margin-right: 4px;width:16px" />上传文件</el-button>
        </el-upload>
        <el-table
            ref="table"
            stripe
            :data="submitFileList"
            :height="250"
            style="width: 70%;margin-top:12px"
        >
            <el-table-column
                label="文件名称"
            >
                <template slot-scope="scope">
                    <CusTomTooltip :value="scope.row.fileName" />
                </template>
            </el-table-column>
            <el-table-column
                label="文件大小"
            >
                <template slot-scope="scope">
                    <CusTomTooltip :value="scope.row.fileSize" />
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="120"
                fixed="right"
            >
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click.native.prevent="viewFile(scope.row)"
                    >
                        查看
                    </el-button>
                    <el-button
                        type="text"
                        class="removeButtonClass"
                        @click.native.prevent="removeFile(scope.row)"
                    >
                        移除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { getConferenceId } from '@/utils/conference-auth'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
export default {
    name: 'FileUpload',
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
        }
    },
    data() {
        return {
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
        oldFileListStr() {
            this.initFile()
        }
    },
    created() {
        this.initFile()
    },
    methods: {
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
            } else {
                this.submitFileList = []
                this.fileList = []
            }
        },
        removeFile(val) {
            this.submitFileList.splice(this.submitFileList.findIndex(item => item.fileUrl === val.fileUrl), 1)
            this.$emit('addImg', this.fieldGroup, this.fieldIndex, this.submitFileList)
        },
        viewFile(val) {
            this.getFilePath(val.fileUrl).then(res => {
                window.location.href = res.result
            })
        },
        /** *********************************图片上传相关开始***********************/
        onSuccess(response, file, fileList) { // 图片上传成功
            if (response.code === 2000) {
                const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
                const fileName = file.name.substring(0, file.name.lastIndexOf('.'))

                var fileSize = file.size / 1024
                if (fileSize > 1024) {
                    fileSize = (fileSize / 1024).toFixed(2) + 'MB'
                } else {
                    fileSize = fileSize.toFixed(2) + 'KB'
                }

                this.submitFileList.push({
                    fileName: fileName,
                    fileSize: fileSize,
                    fileSuffix: fileSuffix,
                    fileUrl: response.result[0].filePath,
                    uuid: file.uid
                })

                this.$emit('addImg', this.fieldGroup, this.fieldIndex, this.submitFileList)
            } else {
                this.$message(response.message)
            }
        },
        beforeUpload(file) {
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
                resolve(file)
            }))
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
<style lang="scss">
.fileUploadClass {
    .el-table__empty-text {
        margin-top: -110px !important;
        background-image: url(../../../assets/table-no-data.png) !important;
        background-size: 100% 100% !important;
        background-repeat: no-repeat !important;
        width:150px !important;
        height:90px !important;
        padding-top:85px !important;
        font-size: 16px !important;
        text-align: center !important;
    }
}

</style>
