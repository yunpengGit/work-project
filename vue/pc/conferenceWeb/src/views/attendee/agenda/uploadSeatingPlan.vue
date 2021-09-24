<template>
    <div class="uploadSeatingPlanClass">
        <el-drawer
            :title="'上传座位图'"
            :visible.sync="dialogVisible"
            :before-close="closeDialog"
            size="40%"
        >
            <el-form
                ref="ruleForm"
                :model="ruleForm"
                :rules="rules"
                label-width="120px"
                :disabled="ruleForm.id !== null && ruleForm.id !== ''"
                class="demo-ruleForm"
                :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto',}"
            >
                <!-- 'border-top': 'solid #ccc 1px' -->
                <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                    <el-form-item label="座位图" prop="name">
                        <el-upload
                            style="margin-top:5px;float:left"
                            class="upload-demo upload-remove-delete-text"
                            :accept="accept"
                            name="files"
                            :headers="uploadHeader"
                            :action="uploadUrl"
                            :file-list="fileList"
                            :show-file-list="false"
                            :on-success="onSuccess"
                            :before-upload="beforeUpload"
                            :data="uploadData"
                            :on-remove="handleRemove"
                            :on-preview="onPreview"
                        >
                            <div

                                class="shangchuanwenjian"
                                :style="{'background': ruleForm.id !== null && ruleForm.id !== '' ? '#FF820099' : '#FF8200'}"
                            >
                                <svg-icon icon-class="shangchuan" />
                                {{ ruleForm.name === null || ruleForm.name === '' ? '上传文件' : '重新上传' }}
                            </div>
                            <!-- <el-button v-if="ruleForm.name === null || ruleForm.name === ''" :class="ruleForm.name !== null && ruleForm.name !== '' ? 'tianjiahuiyizuzhiDisabledClass' : 'tianjiahuiyizuzhiClass'" size="small" type="primary"><i class="el-icon-plus" />  上传文件</el-button> -->
                            <div slot="tip" class="el-upload__tip" style="width:80%">点击按钮上传座位图文件（仅支持Excel），系统会根据文件内{{ getConferenceTemplate(2) }}姓名自动标记，{{ getConferenceTemplate(2) }}可自行下载</div>

                        </el-upload>
                    </el-form-item>
                    <div
                        v-if="ruleForm.name !== null && ruleForm.name !== ''"
                        style="width: 70%;height: 44px;background: rgba(25, 31, 36, 0);margin-left:120px;cursor: pointer;line-height:44px;margin-top:-10px;"
                        @click="onPreview"
                    >
                        <svg-icon icon-class="excel" style="height:44px;width: 20px;margin-right:16px;float:left" />
                        {{ ruleForm.name }}
                    </div>
                    <el-form-item label="适用议程" prop="agendaIds">
                        <el-tree
                            ref="tree"
                            empty-text=""
                            style="margin-top:5px;"
                            show-checkbox
                            node-key="id"
                            check-strictly
                            :data="data"
                            :props="defaultProps"
                            :default-checked-keys="defaultCheckedKeys"
                            default-expand-all
                            :filter-node-method="filterNode"
                            :expand-on-click-node="false"
                            :render-content="renderContent"
                            @check="check"
                        />
                    </el-form-item>
                </el-scrollbar>
            </el-form>
            <div class="demo-drawer__footer" style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD">
                <el-button style="height:32px;margin-top:12px" @click="closeDialog">取 消</el-button>
                <el-button v-if="ruleForm.id === null || ruleForm.id === ''" type="primary" :loading="loading" style="height:32px;margin-top:12px" @click="insert">保存</el-button>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { getTableHeight } from '@/utils/index'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
import { getConferenceId } from '@/utils/conference-auth'
import { getList as getAgendaList } from '@/api/agenda'
import { insert, getView } from '@/api/seatingPlan'
import { downloadFile } from '@/api/conference'
export default {
    name: 'UploadSeatingPlan',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        seatingPlanId: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            defaultCheckedKeys: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            data: [],
            fileList: [],
            dialogHeight: getTableHeight(35) + 'px',
            loading: false,
            accept: '.xls, .xlsx',
            uploadData: {
                fileGroup: 12, // 文件组
                conferenceId: getConferenceId() // 会议ID，编辑会议上传附件传值
            },
            uploadHeader: { 'authToken': this.$store.state.user.token },
            uploadUrl: process.env.VUE_APP_BASE_API + '/files/upload',
            imagePath: getOssBaseUrl(),
            ruleForm: {
                id: null,
                name: null,
                url: null,
                agendaIds: []
            },
            rules: {
                name: [{ required: true, message: '请上传座位图', pattern: '[^ \x22]+', trigger: ['blur', 'change'] }],
                agendaIds: [{ required: true, message: '请选择适用议程', trigger: 'blur' }]
            }
        }
    },
    watch: {
        dialogVisible(val) {
            if (val) {
                if (this.seatingPlanId !== null) {
                    this.getSeatingPlanView()
                }
                this.getAgendaList()
            }
        }
    },
    updated() {
        this.changeColor()
    },
    methods: {
        getSeatingPlanView() {
            getView({ id: this.seatingPlanId }).then(res => {
                this.ruleForm = res.result
                this.fileList = [{ name: res.result.name, url: res.result.url }]
                this.defaultCheckedKeys = res.result.agendaIds
            })
        },
        check(data, checked) {
            this.ruleForm.agendaIds = checked.checkedKeys
            this.$refs.ruleForm.validateField('agendaIds', (valid) => {
            })
        },
        getAgendaList() {
            getAgendaList({ 'conferenceId': getConferenceId() }).then(res => {
                this.data = res.result
            })
        },
        filterNode(value, data) {
        },
        changeColor() {
            var content = document.getElementsByClassName('el-tree-node__content')

            for (var i = 0; i < content.length; i++) {
                if (content[i].style.paddingLeft === '' || content[i].style.paddingLeft === '0px') {
                    content[i].children[1].style.display = 'none'
                }

                // if (content[i].parentElement.parentElement.style.display !== 'none') {
                //     showContents.push(content[i])
                // }
            }
        },
        onPreview() {
            downloadFile({ filePath: this.ruleForm.url }).then(response => {
                const blob = new Blob([response.data], { type: 'application/octet-stream' })
                const fileName = this.ruleForm.name
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob, fileName)
                } else {
                    const link = document.createElement('a')
                    link.style.display = 'none'
                    link.href = URL.createObjectURL(blob)
                    link.setAttribute('download', this.ruleForm.name)
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                }
            }).catch(() => {
            })
        },
        renderContent(h, { node, data, store }) {
            if (data.parentId === undefined) {
                return (
                    <span class='custom-tree-node' style='width:100%;padding-right:10px;'>
                        <span style='font-size:14px;line-height:32px;color:#191F24;' title={ data.date }>{data.date}</span>
                    </span>)
            } else {
                var str = ''
                if (node.label.length > 10) {
                    str = node.label.substring(0, 10) + '...'
                } else {
                    str = node.label
                }
                var dateStr = (data.startTime !== null && data.startTime.length === 8 ? data.startTime.substr(0, 5) : data.startTime) +
                '~' + (data.endTime !== null && data.endTime.length === 8 ? data.endTime.substr(0, 5) : data.endTime)

                if (!node.isLeaf) {
                    return (
                        <span class='custom-tree-node' style='width:100%;padding-right:10px;padding-top:3px;height:40px' >
                            <span style='font-size:14px;line-height:32px;color:#191F24;' title={ node.label }>{dateStr}<span style='margin-left:20px;'>{ str }</span><span v-show={ data.recommend !== null && data.recommend !== '' } style='padding-left:2px;padding-right:2px;margin-left:10px;background: #FF8200;color:white;width: 52px;height: 20px;border-radius: 3px;font-size: 11px;line-height:13px;padding:3px;font-size: 11px;line-height:13px;padding:3px;font-family: PingFangSC-Medium, PingFang SC;'>{ data.recommend }</span></span>
                        </span>)
                } else {
                    if (data.parentId === null || data.parentId === '' || data.parentId === undefined) {
                        return (
                            <span class='custom-tree-node' style='width:100%;padding-right:10px;padding-top:3px;height:40px'>
                                <span style='font-size:14px;line-height:32px;color:#191F24;' title={ node.label }>{dateStr}<span style='margin-left:20px;'>{str}</span><span v-show={ data.recommend !== null && data.recommend !== '' } style='padding-left:2px;padding-right:2px;margin-left:10px;background: #FF8200;color:white;width: 52px;height: 20px;border-radius: 3px;font-size: 11px;line-height:13px;padding:3px;font-size: 11px;line-height:13px;padding:3px;font-family: PingFangSC-Medium, PingFang SC;'>{ data.recommend }</span></span>
                            </span>)
                    } else {
                        return (
                            <span class='custom-tree-node' style='width:100%;padding-right:10px;padding-top:3px;height:40px' >
                                <span style='font-size:14px;line-height:32px;color:#191F24 0.64;' title={ node.label } >{dateStr}<span style='margin-left:20px;'>{str}</span><span v-show={ data.recommend !== null && data.recommend !== '' } style='padding-left:2px;padding-right:2px;margin-left:10px;background: #FF8200;color:white;width: 52px;height: 20px;border-radius: 3px;font-size: 11px;line-height:13px;padding:3px;font-size: 11px;line-height:13px;padding:3px;font-family: PingFangSC-Medium, PingFang SC;'>{ data.recommend }</span></span>
                            </span>)
                    }

                //
                }
            }
        },
        insert() {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    this.loading = true
                    this.ruleForm.conferenceId = getConferenceId()
                    insert(this.ruleForm).then(res => {
                        if (res.success) {
                            this.$message(res.message)
                            this.closeDialog()
                        }
                        this.loading = false
                    }).catch(() => {
                        this.loading = false
                    })
                }
            })
        },
        closeDialog() {
            this.ruleForm = {
                id: null,
                name: null,
                url: null,
                agendaIds: []
            }
            this.fileList = []
            this.defaultCheckedKeys = []
            this.$refs.ruleForm.clearValidate('agendaIds')
            this.$refs.ruleForm.clearValidate('name')
            this.$emit('closeDialog', null)
        },
        beforeUpload(file) {
            const fileName = file.name.substring(file.name.lastIndexOf('.') + 1)
            const extension = fileName === 'xls'
            const extension2 = fileName === 'xlsx'

            if (!extension && !extension2) {
                this.$message({
                    message: '上传文件只能是 xls、xlsx格式!',
                    type: 'info'
                })
                return false
            }

            const isLt2M = file.size / 1024 / 1024 < 10
            if (!isLt2M) {
                this.$message('上传文件大小不能超过 10MB')
            }
            return (isLt2M)
        },
        handleRemove() {
            this.ruleForm.name = null
            this.ruleForm.url = null
            this.fileList = []
        },
        onSuccess(response, file, fileList) {
            if (response.code === 2000) {
                this.fileList = [file]

                this.ruleForm.name = file.name
                this.ruleForm.url = response.result[0].filePath
                this.$refs.ruleForm.clearValidate('name')
            } else {
                this.ruleForm.name = null
                this.ruleForm.url = null
                this.fileList = []
                this.$message(response.message)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.tianjiahuiyizuzhiDisabledClass {
        width: 114px!important;
        height: 32px!important;
        background: #F5F5F5!important;
        border-radius: 4px!important;
        border: 1px solid #F5F5F5!important;
        color: #AAA;
    }
.tianjiahuiyizuzhiClass {
    width: 114px;
    height: 32px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #1E89FF;
    color:#1E89FF
}
.shangchuanwenjian {
    line-height: 32px;text-align:center;width: 108px;height: 32px;box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.08);border-radius: 4px;color:white;cursor: pointer
}
</style>
<style lang="scss">
.uploadSeatingPlanClass {
    .el-upload-list__item {
        width: 100% !important;
        height: 24px !important;
    }
    // .el-tree .el-tree-node .is-leaf + .el-checkbox .el-checkbox__inner{display: inline-block;}
    // .el-tree .el-tree-node .el-checkbox .el-checkbox__inner{display: none;}
}
</style>
