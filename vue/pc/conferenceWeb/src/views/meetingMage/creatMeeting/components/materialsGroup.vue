<template>
    <div class="materialsClass">
        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form :inline="true" :model="pageInfo">
                    <el-form-item label="文件夹名称">
                        <el-input v-model.trim="pageInfo.materialGroupNameLike" placeholder="" />
                    </el-form-item>
                    <el-form-item style="float: right">
                        <el-button type="primary" @click="search">查询</el-button>
                        <el-button @click="resetSearch">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
            <div style="float: left; text-center: left;margin-left:10px;padding-bottom:10px;height:42px;">
                <el-button v-permission="Global.buttons.ConferenceView.materialUpdate" @click="deleteBatch">批量删除</el-button>
            </div>
            <div style="float: right; text-center: right;padding-bottom:10px;height:42px;">
                <el-button v-permission="Global.buttons.ConferenceView.materialUpdate" type="primary" @click="add">添加文件夹</el-button>
            </div>
            <el-table
                ref="table"
                :data="tableData"
                :height="tableHeight + (this.$store.state.menu.buttons.indexOf(Global.buttons.ConferenceView.materialUpdate) !== -1 ? 0: 32)"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
            >
                <el-table-column
                    type="selection"
                    width="55"
                    :selectable="selectInit"
                />
                <el-table-column
                    prop="materialGroupName"
                    label="文件夹名称"
                />
                <el-table-column
                    prop="conferenceMaterialsCount"
                    label="文件数量"
                />
                <el-table-column
                    prop="createUserName"
                    label="添加人"
                />
                <el-table-column
                    prop="createTime"
                    label="添加时间"
                />
                <el-table-column
                    label="操作"
                    width="150"
                >
                    <template slot-scope="scope">
                        <el-button
                            v-permission="Global.buttons.ConferenceView.materialUpdate"
                            :disabled="scope.row.materialGroupName === ( getConferenceTemplate(1) + '资料')"
                            @click.native.prevent="edit(scope.row)"
                        >
                            编辑
                        </el-button>
                        <el-button
                            v-permission="Global.buttons.ConferenceView.materialUpdate"
                            :disabled="scope.row.materialGroupName === ( getConferenceTemplate(1) + '资料')"
                            @click.native.prevent="del(scope.row)"
                        >
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page-wrapper">
                <el-pagination
                    :current-page="pageInfo.pageNum"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageInfo.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageInfo.total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </div>

        <el-drawer
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            :before-close="closeDialog"
            size="40%"
        >
            <el-form
                ref="ruleForm"
                :model="ruleForm"
                :rules="rules"
                label-width="120px"
                class="demo-ruleForm"
                :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto'}"
            >
                <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">

                    <el-form-item label="文件夹" prop="materialGroupName">
                        <el-input class="keepOutRight" v-model="ruleForm.materialGroupName" show-word-limit maxlength="30" style="width:80%" placeholder="请输入文件夹名称" />
                    </el-form-item>
                    <el-form-item label="图标" prop="iconId">
                        <div v-for="logo in logos" :key="logo.id">
                            <div style="width:50px;height:50px;float:left;margin-left:10px" @click="pickLogo(logo)">
                                <img style="width:50px;height:50px" :src="imagePath + logo.iconDownloadUrl">
                                <i v-if="logo.id === ruleForm.iconId" class="el-icon-check" style="position: absolute;margin-left:-5px;margin-top:-5px;border-radius:50%;background-color:green;color:white" />
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="可见范围" prop="visibleRange">
                        <el-radio-group v-model="ruleForm.visibleRange">
                            <el-radio :label="1">会前可见</el-radio>
                            <el-radio :label="2">会后可见</el-radio>
                            <el-radio :label="3">仅会务组可见</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-table
                        id="wenjian"
                        :data="materialsData"
                        height="250"
                        style="margin-left:7%;width:86%;"
                        border
                    >
                        <el-table-column
                            label="文件名称"
                            width="220"
                        >
                            <template slot="header">
                                文件名称
                                <!-- <span style="font-color:#191F24;opacity:0.48;font-size:12px">(可以移动拖拽调整位置）</span> -->
                            </template>
                            <template slot-scope="scope">
                                <el-input v-show="scope.row.materialType === 2" v-model="scope.row.materialName" placeholder="请输入链接名称" maxlength="30" show-word-limit />
                                {{ scope.row.materialType === 1 ? scope.row.materialName : '' }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="文件描述"
                        >
                            <template slot-scope="scope">
                                {{ scope.row.materialType === 1 ? scope.row.materialSize + 'M' : '' }}
                                <el-input v-show="scope.row.materialType === 2" v-model="scope.row.materialUrl" placeholder="请输入链接地址" maxlength="200" show-word-limit />
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="60"
                        >
                            <template slot-scope="scope">
                                <el-button type="text" @click.native.prevent="delMaterial(scope.row)">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div style="height:50px">
                        <el-upload
                            style="margin-left:7%;margin-top:5px;float:left"
                            class="upload-demo upload-remove-delete-text"
                            :accept="accept"
                            name="files"
                            :headers="uploadHeader"
                            :action="uploadUrl"
                            :on-success="onSuccess"
                            :on-preview="onPreview"
                            :file-list="materialsData"
                            :show-file-list="false"
                            :before-upload="beforeUpload"
                            :on-exceed="onExceed"
                            :data="uploadData"
                        >
                            <el-button class="tianjiahuiyizuzhiClass" size="small" type="primary" style="color:#1E89FF"><i class="el-icon-plus" />  上传文件</el-button>
                        </el-upload>
                        <el-button class="tianjiahuiyizuzhiClass" style="margin-left:10px;margin-top:5px;color:#1E89FF;float:left" size="small" type="primary" @click="tianjiawangzhi"><i class="el-icon-plus" />  添加网址</el-button>
                    </div>
                    <div class="_48OpacityClass" style="margin-left:7%;margin-top:5px;">
                        网址请注意保留前缀的http或https，例如：https://www.avic.com
                    </div>

                </el-scrollbar>
            </el-form>

            <div class="demo-drawer__footer" style="text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD">
                <el-button style="height:32px;margin-top:12px" @click="closeDialog">取 消</el-button>
                <el-button :loading="loading" type="primary" style="height:32px;margin-top:12px" @click="insertMaterials">保存</el-button>
            </div>
        </el-drawer>
    </div>
</template>

<script>

import { getTableHeight, GMTToStrYYYYMMDD } from '@/utils/index'
import { getList, insert, update, getView, deleteBatch, getLogos } from '@/api/materials'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
// import Sortable from 'sortablejs'
export default {
    name: 'MaterialsGroup',
    props: {
        conferenceId: {
            type: null,
            default: null
        },
        activeName: {
            type: String,
            default: null
        },
        materialsActiveName: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            loading: false,
            uploadData: {
                fileGroup: 2, // 文件组
                conferenceTempId: '', // 会议临时ID，新建会议上传附件传值
                conferenceId: '' // 会议ID，编辑会议上传附件传值
            },
            // .doc\.docx\pdf\ppt\pptx\xls\xlsx
            accept: '.doc, .docx, .pdf, .ppt, .pptx, .xls, .xlsx',
            uploadHeader: { 'authToken': this.$store.state.user.token },
            uploadUrl: process.env.VUE_APP_BASE_API + '/files/upload',
            imagePath: getOssBaseUrl(),
            dialogTitle: '添加文件夹',
            materialsData: [],
            dialogVisible: false,
            ruleForm: {
                materialGroupName: '',
                materialType: 1,
                iconId: null,
                visibleRange: 1
            },
            rules: {
                materialGroupName: [{ required: true, message: '请输入文件夹名称', pattern: '[^ \x22]+', trigger: 'blur' }]
                // mobile: [{ required: true, message: '请输入嘉宾手机号', pattern: '[^ \x22]+', trigger: 'blur' }],
                // organizationName: [{ required: true, message: '请输入单位名称', pattern: '[^ \x22]+', trigger: 'blur' }],
                // theme: [{ required: true, message: '请输入演讲主题', pattern: '[^ \x22]+', trigger: 'blur' }]
            },
            tableData: [],
            tableHeight: getTableHeight(283),
            dialogHeight: getTableHeight(35) + 'px',
            multipleSelection: [],
            pageInfo: {
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            logos: []
        }
    },
    watch: {
        materialsActiveName(val) {
            if (val === 'second') {
                this.setHeight()
                this.getLogos()
                this.search()
                this.uploadData.conferenceId = this.conferenceId
            }
        },
        activeName(val) {
            if (val === 'five') {
                this.setHeight()
                this.getLogos()
                this.search()
                this.uploadData.conferenceId = this.conferenceId
            }
        }
    },
    created() {
        this.setHeight()
        this.getLogos()
        this.search()
        this.uploadData.conferenceId = this.conferenceId
    },
    methods: {
        selectInit(row, index) {
            if (row.materialGroupName === (this.getConferenceTemplate(1) + '资料')) {
                return false // 不可勾选
            } else {
                return true // 可勾选
            }
        },
        setHeight() {
            if (this.$route.name === 'conferenceCreate') {
                this.tableHeight = getTableHeight(243)
            } else {
                this.tableHeight = getTableHeight(283)
            }
        },
        resetSearch() {
            this.pageInfo = {
                pageNum: 1,
                pageSize: 10,
                total: this.pageInfo.total
            }
        },
        getLogos() {
            getLogos({}).then(res => {
                this.logos = res.result
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        getList() {
            this.pageInfo.conferenceId = this.conferenceId
            getList(this.pageInfo).then(res => {
                this.tableData = res.result.list
                this.pageInfo.total = res.result.total
            })
        },
        closeDialog(val) {
            this.$refs['ruleForm'].resetFields()
            this.dialogVisible = false
            this.search()
        },
        edit(val) {
            getView({ 'id': val.id }).then(res => {
                this.getLogos()
                this.dialogTitle = '编辑文件夹'
                this.dialogVisible = true
                this.ruleForm = res.result
                this.materialsData = this.ruleForm.conferenceMaterialsList
                this.imageUrl = getOssBaseUrl() + this.ruleForm.billUrl
            })
        },
        search() {
            this.pageInfo.pageNum = 1
            this.getList()
        },
        add() {
            this.getLogos()
            this.ruleForm = {
                materialGroupName: '',
                materialType: 1,
                iconId: null,
                visibleRange: 1
            }
            if (this.logos != null && this.logos.length > 0) {
                this.pickLogo(this.logos[0])
            }
            this.materialsData = []
            this.dialogTitle = '添加文件夹'
            this.dialogVisible = true
        },
        del(row) {
            this.deleteSubmit([row.id])
        },
        handleCurrentChange(val) {
            this.pageInfo.pageNum = val
            this.getList()
        },
        handleSizeChange(val) {
            this.pageInfo.pageSize = val
            this.getList()
        },
        deleteBatch() {
            if (this.multipleSelection.length === 0) {
                this.$message('至少选择一条记录')
                return
            }
            const param = []
            this.multipleSelection.forEach(item => {
                param.push(item.id)
            })
            this.deleteSubmit(param)
        },
        deleteSubmit(param) {
            this.$confirm('请确认是否删除文件夹信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteBatch({ 'ids': param }).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        this.search()
                    }
                })
            }).catch(() => {})
        },
        insertMaterials() {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    var flag = false
                    var dizhiGeshiFlag = false
                    if (this.materialsData !== null) {
                        this.materialsData.forEach(item => {
                            if (item.materialType === 2) {
                                if (item.materialUrl === null || item.materialUrl === '') {
                                    flag = true
                                } else {
                                    if (item.materialUrl.indexOf('http') !== 0 && item.materialUrl.indexOf('https') !== 0) {
                                        dizhiGeshiFlag = true
                                    }
                                }
                            }
                        })
                    }
                    if (flag) {
                        this.$message('地址不允许为空')
                        return
                    }
                    if (dizhiGeshiFlag) {
                        this.$message('链接地址需以http或https开头')
                        return
                    }
                    this.ruleForm.conferenceMaterialsList = this.materialsData

                    this.ruleForm.conferenceId = this.conferenceId
                    if (this.ruleForm.id !== null && this.ruleForm.id !== '' && this.ruleForm.id !== undefined) {
                        this.loading = true
                        update(this.ruleForm).then(res => {
                            if (res.success) {
                                this.$message('保存成功')
                                this.closeDialog()
                                this.getList()
                            }
                            this.loading = false
                        }).catch(() => {
                            this.loading = false
                        })
                    } else {
                        this.loading = true
                        insert(this.ruleForm).then(res => {
                            if (res.success) {
                                this.$message('保存成功')
                                this.closeDialog()
                                this.getList()
                            }
                            this.loading = false
                        }).catch(() => {
                            this.loading = false
                        })
                    }
                }
            })
        },
        pickLogo(val) {
            this.ruleForm.iconId = val.id
            this.ruleForm.iconUrl = val.iconUrl
        },
        delMaterial(val) {
            if (this.materialsData !== null && this.materialsData.length > 0) {
                this.materialsData.forEach((item, index) => {
                    if ((val.tempId !== undefined && val.tempId !== null && item.tempId === val.tempId) || (val.id !== undefined && val.id !== null && item.id === val.id)) {
                        this.materialsData.splice(index, 1)
                    }
                })
            }
            // if (this.materialsData !== null && this.materialsData.length > 0) {
            //     this.materialsData.forEach((item, index) => {
            //         if (item.materialName === val) {
            //             this.materialsData.splice(index, 1)
            //         }
            //     })
            // }
        },
        onSuccess(response, file, fileList) {
            if (this.materialsData == null) {
                this.materialsData = []
            }

            if (response.code === 2000) {
                this.materialsData.push({ tempId: new Date(), 'materialUrl': response.result[0].filePath, 'materialName': file.name, 'materialSize': (file.size / 1024 / 1024).toFixed(2), 'materialUploadDate': GMTToStrYYYYMMDD(new Date()), materialType: 1 })
            } else {
                this.$message(response.message)
            }
        },
        handleRemove(file, fileList) {
            for (let i = 0; i < this.materialsData.length; i++) {
                if (this.materialsData[i].uid === file.uid) {
                    this.materialsData.splice(i, 1)
                    break
                }
            }
        },
        onError(err, file, fileList) {
            this.$message('上传失败')
            console.log(err)
        },
        beforeUpload(file) {
            let flag = true
            if (this.materialsData != null && this.materialsData.length > 0) {
                for (let i = 0; i < this.materialsData.length; i++) {
                    if (this.materialsData[i].materialName === file.name && this.materialsData[i].materialType === 1) {
                        flag = false
                        this.$message('上传文件重复')
                        break
                    }
                }
            }
            if (!flag) {
                return flag
            }

            const isLt2M = file.size / 1024 / 1024 < 5
            if (!isLt2M) {
                this.$message('上传文件大小不能超过 5MB')
            }
            return (isLt2M && flag)
        },
        onExceed(files, fileList) {
        },
        onPreview(file) {
        },
        tianjiawangzhi() {
            this.materialsData.push({ tempId: new Date(), 'materialName': null, 'materialUrl': null, materialType: 2 })
        }

    }
}
</script>
<style lang="scss" scoped>
.el-drawer__body {
    overflow: auto;
    /* overflow-x: auto; */
}

.el-drawer__container ::-webkit-scrollbar{
    display: none;
}

 .DataBriefing .el-scrollbar__wrap{
    overflow-x: hidden;
  }
.headerRowClassName {
    background-color: #f5f5f5 !important;
    padding-top: 6px !important;
    padding-bottom: 6px !important;
}
.tianjiahuiyizuzhiClass {
    width: 114px;
    height: 32px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #1E89FF;
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
<style lang="scss" >
.materialsClass {
    .el-table__empty-text {
        margin-top: -110px !important;
        background-image: url(../../../../assets/table-no-data.png) !important;
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
