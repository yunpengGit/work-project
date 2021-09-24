<template>
    <div>
        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form :inline="true" :model="pageInfo">
                    <el-row>
                        <el-col :span="7">
                            <el-form-item label="嘉宾姓名">
                                <el-input v-model.trim="pageInfo.nameLike" maxlength="25" style="width:150px" placeholder="" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="职务">
                                <el-input v-model.trim="pageInfo.titleLike" maxlength="25" style="width:150px" placeholder="" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="单位名称">
                                <el-input v-model.trim="pageInfo.organizationNameLike" maxlength="25" style="width:150px" placeholder="" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item style="float: right">
                                <el-button type="primary" @click="search">查询</el-button>
                                <el-button @click="resetSearch">重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
            <div style="float: left; text-center: left;margin-left:10px;padding-bottom:10px;">
                <el-button v-permission="Global.buttons.ConferenceView.guestUpdate" @click="deleteBatch">批量删除</el-button>
            </div>
            <div style="float: right; text-center: right;padding-bottom:10px;">
                <el-button v-permission="Global.buttons.ConferenceView.guestUpdate" type="primary" @click="add">添加</el-button>
            </div>
            <el-table
                ref="table"
                :data="tableData"
                :height="tableHeight + (this.$store.state.menu.buttons.indexOf(Global.buttons.ConferenceView.guestUpdate) !== -1 ? 0: 32)"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
            >
                <el-table-column
                    type="selection"
                    width="55"
                />
                <el-table-column
                    prop="name"
                    label="嘉宾姓名"
                >
                    <template slot-scope="scope">
                        <div style="height:32px">
                            <img
                                style="width:32px;height:32px;float:left;border-radius:50%"
                                :src="scope.row.billUrl !== null && scope.row.billUrl !== '' ? scope.row.billUrl : (defaultPhoto)"
                            ><span style="margin-top:8px;margin-left:5px;float:left" :title="scope.row.name">{{ scope.row.name !== null && scope.row.name.length > 4 ? scope.row.name.substr(0,4) + '...' : scope.row.name }}</span>
                        </div>
                    </template>
                </el-table-column>
                <!-- width="200" -->
                <el-table-column
                    label="职务"
                >
                    <template slot-scope="scope">
                        {{ formatTableCellData(scope.row.title) }}
                        <!-- {{ scope.row.title !== null && scope.row.title.length > 0 ? '' : '-' }}
                        <span v-if="scope.row.title !== null && scope.row.title !== ''">
                            <el-tag v-for="title in scope.row.title.split(',')" :key="title" style="margin-left:4px" type="info">{{ title }}</el-tag>
                        </span> -->
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    label="手机"
                >
                    <template slot-scope="scope">
                        <div>
                            <span>{{ formatTableCellData(formatPhone(scope.row.mobile)) }}</span>
                            <span style="display:none">{{ scope.row.mobile }}</span>
                            <el-button v-show="scope.row.mobile !== null && scope.row.mobile !== ''" icon="el-icon-view" type="text" @click="(event) => qiehuanshoujijiami(event)" />
                        </div>
                    </template>
                </el-table-column> -->
                <el-table-column
                    prop="organizationName"
                    label="单位"
                >
                    <template slot-scope="scope">
                        <CusTomTooltip :value="formatTableCellData(scope.row.organizationName)" />
                        <!-- <el-tooltip placement="bottom" effect="light">
                            <div slot="content">
                                {{ scope.row.organizationName }}
                            </div>
                            <div class="danhangxianshibuquan">{{ formatTableCellData(scope.row.organizationName) }}</div>
                        </el-tooltip> -->
                    </template>
                </el-table-column>
                <el-table-column
                    prop="theme"
                    label="嘉宾主题"
                />
                <!-- <template slot-scope="scope">
                        <el-tooltip placement="bottom" effect="light">
                            <div slot="content">
                                {{ scope.row.introduce }}
                            </div>
                            <div class="danhangxianshibuquan">{{ formatTableCellData(scope.row.introduce) }}</div>
                        </el-tooltip>
                    </template> -->
                <!-- </el-table-column> -->
                <el-table-column
                    label="操作"
                    width="300"
                >
                    <template slot-scope="scope">
                        <el-button
                            v-permission="Global.buttons.ConferenceView.guestUpdate"
                            @click.native.prevent="edit(scope.row)"
                        >
                            编辑
                        </el-button>
                        <el-button
                            v-permission="Global.buttons.ConferenceView.guestUpdate"
                            @click.native.prevent="updateSeq(scope.row.id, 1)"
                        >
                            上移
                        </el-button>
                        <el-button
                            v-permission="Global.buttons.ConferenceView.guestUpdate"
                            @click.native.prevent="updateSeq(scope.row.id, 0)"
                        >
                            下移
                        </el-button>
                        <el-button
                            v-permission="Global.buttons.ConferenceView.guestUpdate"
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
                :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto',}"
            >
                <!-- 'border-top': 'solid #ccc 1px' -->
                <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                    <el-form-item label="嘉宾姓名" prop="name">
                        <el-input class="keepOutRight" v-model="ruleForm.name" :disabled="ruleForm !== null && ruleForm.id !== undefined && ruleForm.id !== null && ruleForm.id !== ''" show-word-limit maxlength="30" style="width:80%" placeholder="请输入嘉宾姓名" />
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input class="keepOutRight" v-model="ruleForm.mobile" :disabled="ruleForm !== null && ruleForm.id !== undefined && ruleForm.id !== null && ruleForm.id !== ''" show-word-limit maxlength="11" style="width:80%" placeholder="请输入手机号" />
                    </el-form-item>
                    <el-form-item label="单位名称" prop="organizationName">
                        <el-input class="keepOutRight" v-model="ruleForm.organizationName" show-word-limit maxlength="30" style="width:80%" placeholder="请输入单位名称" />
                    </el-form-item>
                    <el-form-item label="照片">
                        <el-upload
                            class="upload-demo upload-remove-delete-text"
                            :class="{hide:hideUploadEdit}"
                            list-type="picture-card"
                            name="files"
                            :accept="accept"
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
                        </el-upload>
                        <div class="_48OpacityClass" style="margin-top:5px;width:360px;white-space:normal;word-break:break-all;word-wrap:break-word;">
                            格式可以是jpg/png，大小为20K～200K，35毫米×48毫米左右。相当于大一寸照片。
                        </div>
                    </el-form-item>
                    <div v-for="(title, index) in ruleForm.titles" :key="title.code">
                        <el-form-item
                            v-if="index === 0"
                            label="职务"
                            :prop="'titles.' + index + '.name'"
                            :rules="[
                                { required: true, message: '请输入职务', trigger: 'blur' },
                            ]"
                        >
                            <el-input
                                v-model="title.name"
                                class="keepOutRight"
                                show-word-limit
                                maxlength="20"
                                placeholder="职务"
                                style="width:50%"
                            />
                            <el-button icon="el-icon-delete" style="margin-left:5px;" @click.prevent="removeTitle(title)" />
                        </el-form-item>
                        <el-form-item
                            v-else
                            :prop="'titles.' + index + '.name'"
                            :rules="[
                                { required: true, message: '请输入职务', trigger: 'blur' },
                            ]"
                        >
                            <el-input
                                class="keepOutRight"
                                v-model="title.name"
                                show-word-limit
                                maxlength="20"
                                placeholder="职务"
                                style="width:50%"
                            />
                            <el-button icon="el-icon-delete" style="margin-left:5px;" @click.prevent="removeTitle(title)" />
                        </el-form-item>
                    </div>
                    <el-form-item v-show="!(ruleForm.titles !== undefined && ruleForm.titles !== null && ruleForm.titles.length === 10)" :label="ruleForm.titles === null || ruleForm.titles.length === 0 ? '职务': ''" prop="titles">
                        <el-button class="tianjiahuiyizuzhiClass" size="small" type="primary" style="margin-top:5px;color:#1E89FF" @click="tianjiaTitle"><i class="el-icon-plus" />  添加职务</el-button>
                    </el-form-item>
                    <el-form-item label="演讲主题" prop="theme">
                        <el-input class="keepOutRight" v-model="ruleForm.theme" show-word-limit maxlength="30" placeholder="请输入演讲主题" style="width:80%" />
                    </el-form-item>
                    <el-form-item label="嘉宾简介" prop="introduce">
                        <el-input class="keepOutRight" v-model="ruleForm.introduce" show-word-limit maxlength="60" :placeholder="'用作' + getConferenceTemplate(1) + '宣传或' + getConferenceTemplate(1) + '详情显示，如，阿里巴巴CEO'" style="width:80%" />
                        <!-- <el-input
                            v-model="ruleForm.introduce"
                            type="textarea"
                            :rows="8"
                            show-word-limit
                            maxlength="300"
                            placeholder="嘉宾介绍"
                            style="width:80%"
                        /> -->
                    </el-form-item>
                </el-scrollbar>
            </el-form>
            <div class="demo-drawer__footer" style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD">
                <el-button style="height:32px;margin-top:12px" @click="closeDialog">取 消</el-button>
                <el-button type="primary" :loading="loading" style="height:32px;margin-top:12px" @click="insertGuest">保存</el-button>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { getTableHeight, formatPhone } from '@/utils/index'
import { getList, insert, update, getView, deleteBatch, updateSeq } from '@/api/guest'
import { getOssPublicBaseUrl } from '@/utils/x-sso-publicbaseurl'
import { telephoneValid } from '@/utils/valid-common'
export default {
    name: 'Guest',
    props: {
        conferenceId: {
            type: null,
            default: null
        }
    },
    data() {
        return {
            hideUploadEdit: false,
            imagePath: getOssPublicBaseUrl(),
            dialogTitle: '添加嘉宾信息',
            accept: '.png, .jpg',
            uploadHeader: { 'authToken': this.$store.state.user.token },
            uploadUrl: process.env.VUE_APP_BASE_API + '/files/upload',
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
            uploadData: {
                fileGroup: 6, // 文件组
                conferenceId: this.conferenceId // 会议ID，编辑会议上传附件传值
            },
            fileList: [],
            loading: false,
            dialogVisible: false,
            ruleForm: {
                id: null,
                name: null,
                mobile: null,
                organizationName: null,
                introduce: null,
                theme: '',
                titles: []
            },
            rules: {
                name: [{ required: true, message: '请输入嘉宾姓名', pattern: '[^ \x22]+', trigger: 'blur' }],
                mobile: [{ required: true, message: '请输入手机号', pattern: '[^ \x22]+', trigger: 'blur' },
                    telephoneValid()],
                organizationName: [],
                theme: [{ required: true, message: '请输入演讲主题', pattern: '[^ \x22]+', trigger: 'blur' }]
            },
            tableData: [],
            tableHeight: getTableHeight(212),
            dialogHeight: getTableHeight(35) + 'px',
            multipleSelection: [],
            pageInfo: {
                pageNum: 1,
                pageSize: 10,
                total: 0
            }
        }
    },
    created() {
        if (this.$route.name === 'conferenceCreate') {
            this.tableHeight = getTableHeight(182)
        } else {
            this.tableHeight = getTableHeight(212)
        }
        this.search()
    },
    methods: {
        updateSeq(id, isUp) {
            updateSeq({ id: id, isUp: isUp }).then(res => {
                if (res.success) {
                    this.$message(res.message)
                    this.getList()
                }
            })
        },
        qiehuanshoujijiami(event) {
            if (event.currentTarget.parentElement.children[0].style.display === 'none') {
                event.currentTarget.parentElement.children[0].style.display = ''
                event.currentTarget.parentElement.children[1].style.display = 'none'
            } else {
                event.currentTarget.parentElement.children[0].style.display = 'none'
                event.currentTarget.parentElement.children[1].style.display = ''
            }
        },
        formatPhone(val) {
            return formatPhone(val)
        },
        resetSearch() {
            this.pageInfo = {
                pageNum: 1,
                pageSize: 10,
                total: this.pageInfo.total
            }
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
            this.dialogVisible = false
            this.search()
            this.$refs['ruleForm'].resetFields()
            this.ruleForm.titles = []
            this.fileList = []
            this.ruleForm.id = null
        },
        edit(val) {
            getView({ 'id': val.id }).then(res => {
                this.dialogTitle = '编辑嘉宾信息'
                this.dialogVisible = true
                // this.ruleForm = res.result
                // this.fileList = [res.result.billUrl]

                if (res.result.billUrl !== null && res.result.billUrl !== '') {
                    this.hideUploadEdit = true
                    this.fileList = [{ 'name': res.result.billUrl, 'url': res.result.billUrlForDetail }]
                } else {
                    this.fileList = []
                    this.hideUploadEdit = this.fileList.length >= 1
                }

                this.ruleForm.id = res.result.id
                this.ruleForm.name = res.result.name
                this.ruleForm.mobile = res.result.mobile
                this.ruleForm.organizationName = res.result.organizationName
                this.ruleForm.theme = res.result.theme
                this.ruleForm.introduce = res.result.introduce
                this.ruleForm.titles = []
                this.ruleForm.title = ''
                if (res.result.title !== null && res.result.title !== '') {
                    res.result.title.split(',').forEach(item => {
                        this.ruleForm.titles.push({ 'code': 'code', 'name': item })
                    })
                } else {
                    this.ruleForm.titles = []
                }
            })
        },
        search() {
            this.pageInfo.pageNum = 1
            this.getList()
        },
        add() {
            this.dialogTitle = '添加嘉宾信息'
            this.dialogVisible = true
            this.ruleForm.id = null
            this.ruleForm.name = null
            this.ruleForm.mobile = null
            this.ruleForm.organizationName = null
            this.ruleForm.theme = null
            this.ruleForm.introduce = null
            this.ruleForm.titles = []
            this.ruleForm.title = null
            this.fileList = []
            this.ruleForm.billUrl = null
            this.hideUploadEdit = false
        },
        del(row) {
            this.deleteSubmit([row.id])
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
            this.$confirm('请确认是否删除嘉宾信息？', '', {
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
        handleCurrentChange(val) {
            this.pageInfo.pageNum = val
            this.getList()
        },
        handleSizeChange(val) {
            this.pageInfo.pageSize = val
            this.getList()
        },
        insertGuest() {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    if (this.ruleForm.titles !== null && this.ruleForm.titles.length > 0) {
                        let touxian = ''
                        for (var i = 0; i < this.ruleForm.titles.length; i++) {
                            if (i !== this.ruleForm.titles.length - 1) {
                                touxian += this.ruleForm.titles[i].name + ','
                            } else {
                                touxian += this.ruleForm.titles[i].name
                            }
                        }
                        this.ruleForm.title = touxian
                    }

                    this.ruleForm.conferenceId = this.conferenceId
                    if (this.ruleForm.id !== null && this.ruleForm.id !== '' && this.ruleForm.id !== undefined) {
                        update(this.ruleForm).then(res => {
                            this.loading = true
                            if (res.success) {
                                this.$message('保存成功')
                                this.closeDialog()
                                this.getList()
                                this.loading = false
                            }
                        }).catch(() => {
                            this.loading = false
                        })
                    } else {
                        insert(this.ruleForm).then(res => {
                            if (res.success) {
                                this.$message('保存成功')
                                this.closeDialog()
                                this.getList()
                                this.loading = false
                            }
                        }).catch(() => {
                            this.loading = false
                        })
                    }
                }
            })
        },
        tianjiaTitle() {
            this.ruleForm.titles.push({ 'code': 'code', 'name': null })
        },
        removeTitle(item) {
            var index = this.ruleForm.titles.indexOf(item)
            if (index !== -1) {
                this.ruleForm.titles.splice(index, 1)
            }
        },
        onSuccessImg(response, file, fileList) {
            if (response.code === 2000) {
                // this.imageUrl = URL.createObjectURL(file.raw)
                this.ruleForm.billUrl = response.result[0].filePath
                // this.fileList = [{ 'name': file.name, 'url': response.result[0].downloadUrl }]
            } else {
                this.$message(response.message)
                this.ruleForm.billUrl = ''
                // this.fileList = []
            }
        },
        handleRemoveImg(file, fileList) {
            this.hideUploadEdit = fileList.length >= 1
            this.ruleForm.billUrl = ''
        },
        handleChange(file, fileList) {
        // 大于1张隐藏
            this.hideUploadEdit = fileList.length >= 1
        },
        beforeUploadImg(file) {
            this.uploadData.conferenceId = this.conferenceId
            const fileName = file.name.substring(file.name.lastIndexOf('.') + 1)
            const extension = fileName === 'png'
            const extension2 = fileName === 'jpg'

            if (!extension && !extension2) {
                this.$message({
                    message: '上传文件只能是 png、jpg格式!',
                    type: 'info'
                })
                return false
            }

            const isLt200K = file.size / 1024 > 200 || file.size / 1024 < 20
            if (isLt200K) {
                this.$message({
                    message: '图片大小超过限制!',
                    type: 'info'
                })
                return false
            }
            return true
        },
        onExceedImg(files, fileList) {
            this.$message('请删除已上传附件')
        }
    }
}
</script>
<style lang="scss" scoped>
.el-drawer__body {
    overflow: auto;
    /* overflow-x: auto; */
}

/*2.隐藏滚动条，太丑了*/
.el-drawer__container ::-webkit-scrollbar{
    display: none;
}

 .DataBriefing .el-scrollbar__wrap{
    overflow-x: hidden;
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
.danhangxianshibuquan {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
