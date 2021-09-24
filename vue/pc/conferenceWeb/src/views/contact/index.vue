<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:8px">
        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form :inline="true" :model="pageInfo">
                    <div class="inquire_form">
                    <div class="form_left">
                    <el-form-item label="姓名">
                        <el-input v-model.trim="pageInfo.contacterNameLike" class="widthClass" maxlength="25" placeholder="" />
                    </el-form-item>
                    <el-form-item label="手机">
                        <el-input v-model.trim="pageInfo.mobile" class="widthClass" maxlength="25" placeholder="" />
                    </el-form-item>
                    <el-form-item label="职务">
                        <el-input v-model.trim="pageInfo.positionLike" class="widthClass" maxlength="25" placeholder="" />
                    </el-form-item>
                    <el-form-item label="单位名称">
                        <el-input v-model.trim="pageInfo.organizationNameOrShortNameLike" class="widthClass" maxlength="25" placeholder="" />
                    </el-form-item>
                    <el-form-item label="角色">
                        <el-select v-model="pageInfo.contacterRoleIds" multiple placeholder="请选择角色">
                            <el-option
                                v-for="item in contacterRoleIds"
                                :key="item.valCode"
                                :label="item.valName"
                                :value="item.valCode"
                            />
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="报名来源">
                        <el-select v-model="pageInfo.sourceType" class="widthClass" placeholder="全部" clearable>
                            <el-option :key="1" label="后台录入" :value="1" />
                            <el-option :key="2" label="本人报名" :value="2" />
                        </el-select>
                    </el-form-item> -->
                    </div>
                    <el-form-item class="form_operation">
                        <el-button type="primary" @click="search">查询</el-button>
                        <el-button @click="resetSearch">重置</el-button>
                    </el-form-item>
                     </div>
                </el-form>
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
            <div style="float: left; text-center: left;margin-left:10px;padding-bottom:10px;">
                <el-button v-permission="Global.buttons.ContactList.delete" @click="deleteBatch">批量删除</el-button>
            </div>
            <div style="float: right; text-center: right;padding-bottom:10px;">
                <el-button v-permission="Global.buttons.ContactList.insert" type="primary" @click="add">添加</el-button>
                <!-- <el-button v-permission="Global.buttons.ContactList.import" @click="add">导入</el-button>
                <el-button v-permission="Global.buttons.ContactList.export" @click="add">导出查询结果</el-button> -->
            </div>
            <el-table
                ref="table"
                :data="tableData"
                :height="tableHeight + (this.$store.state.menu.buttons.indexOf(Global.buttons.ContactList.delete) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.ContactList.insert) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.ContactList.import) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.ContactList.export) !== -1 ? 0: 32)"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
            >
                <el-table-column
                    type="selection"
                    width="55"
                />
                <el-table-column
                    prop="name"
                    label="联络人信息"
                    width="180"
                >
                    <template slot-scope="scope">
                        <div style="height:32px">
                            <img
                                style="width:32px;height:32px;float:left;border-radius:50%"
                                :src="scope.row.ssoUserPhoto !== null && scope.row.ssoUserPhoto !== '' ? scope.row.ssoUserPhoto : (scope.row.sex === null || scope.row.sex === '' ? require('@/assets/male.png') : (scope.row.sex === '1' || scope.row.sex === 1) ? require('@/assets/male.png') : require('@/assets/female.png'))"
                            >
                            <div style="margin-left:5px;float:left">
                                <div :title="scope.row.contacterName">{{ scope.row.contacterName != null && scope.row.contacterName.length > 4 ? scope.row.contacterName.substr(0,4) + '...' : scope.row.contacterName }}</div>
                                <div style="margin-top:-10px;padding-top:0;line-height:12px">
                                    <PhoneEncryption :value="scope.row.mobile" style="margin-top:8px;" />
                                    <!-- <span>{{ formatPhone(scope.row.mobile) }}</span>
                                    <span style="display:none">{{ scope.row.mobile }}</span>
                                    <el-button style="height:12px" icon="el-icon-view" type="text" @click="(event) => qiehuanshoujijiami(event)" /> -->
                                </div>
                            </div>
                            <!-- <br>
                            <span style="margin-left:5px;float:left" :title="scope.row.contacterName">{{ scope.row.contacterName }}</span> -->
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="职务"
                >
                    <template slot-scope="scope">
                        <div :title="scope.row.position">{{ formatTableCellData(scope.row.position) }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="单位简称/全称"
                >
                    <template slot-scope="scope">
                        <div>{{ formatTableCellData(formatOrgName(scope.row.organizationShortName, scope.row.organizationName)) }}</div>
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    label="报名来源"
                >
                    <template slot-scope="scope">
                        <span v-show="scope.row.sourceType === 1">后台录入</span>
                        <span v-show="scope.row.sourceType === 2">本人报名</span>
                    </template>
                </el-table-column> -->
                <el-table-column
                    label="角色"
                >
                    <template slot-scope="scope">
                        <div>{{ scope.row.contacterRoleNamesStr }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="注册时间"
                >
                    <template slot-scope="scope">
                        <div>{{ scope.row.createTime }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="180"
                >
                    <template slot-scope="scope">
                        <el-button
                            v-permission="Global.buttons.ContactList.edit"
                            @click.native.prevent="edit(scope.row)"
                        >
                            查看详情
                        </el-button>
                        <el-button
                            v-permission="Global.buttons.ContactList.delete"
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
                    <el-form-item label="姓名" prop="contacterName">
                        <el-input class="keepOutRight" v-model="ruleForm.contacterName" :disabled="ruleForm.id !== undefined && ruleForm.id !== null && ruleForm.id !== ''" show-word-limit maxlength="30" style="width:80%" placeholder="请输入姓名" @blur="getUser" />
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input class="keepOutRight" v-model="ruleForm.mobile" show-word-limit maxlength="11" style="width:80%" placeholder="请输入手机号" :disabled="ruleForm.id !== undefined && ruleForm.id !== null && ruleForm.id !== ''" @blur="getUser" />
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                        <el-radio-group v-model="ruleForm.sex">
                            <el-radio label="1">男</el-radio>
                            <el-radio label="2">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="照片">
                        <el-upload
                            :class="{hide:hideUploadEdit}"
                            class="upload-demo upload-remove-delete-text"
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
                    <el-form-item label="职务" prop="position">
                        <el-input class="keepOutRight" v-model="ruleForm.position" show-word-limit maxlength="20" placeholder="请输入职务" style="width:80%" />
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input class="keepOutRight" v-model="ruleForm.email" show-word-limit maxlength="50" placeholder="请输入邮箱" style="width:80%" />
                    </el-form-item>
                    <el-form-item label="单位全称" prop="organizationName">
                        <el-input class="keepOutRight" v-model="ruleForm.organizationName" show-word-limit maxlength="30" placeholder="请输入单位全称" style="width:80%" />
                    </el-form-item>
                    <el-form-item label="单位简称" prop="organizationShortName">
                        <el-input class="keepOutRight" v-model="ruleForm.organizationShortName" show-word-limit maxlength="10" placeholder="请输入单位简称" style="width:80%" />
                    </el-form-item>
                    <el-form-item label="角色" prop="contacterRoleIds">
                        <el-select  v-model="ruleForm.contacterRoleIds" multiple placeholder="请选择" style="width:80%">
                            <el-option
                                v-for="item in contacterRoleIds"
                                :key="item.valCode"
                                :label="item.valName"
                                :value="item.valCode"
                            />
                        </el-select>
                    </el-form-item>
                </el-scrollbar>
            </el-form>
            <div class="demo-drawer__footer" style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD">
                <el-button style="height:32px;margin-top:12px" @click="closeDialog">取 消</el-button>
                <el-button type="primary" :loading="loading" style="height:32px;margin-top:12px" @click="insert">保存</el-button>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { getTableHeight, formatPhone } from '@/utils/index'
import { getList, insert, update, getView, deleteBatch } from '@/api/contact'
import { getUser } from '@/api/attendee'
import { getOssPublicBaseUrl } from '@/utils/x-sso-publicbaseurl'
import { getConferenceId } from '@/utils/conference-auth'
import { telephoneValid, emailValid } from '@/utils/valid-common'
import { showLoading, closeLoading } from '@/utils/loading'
import { getRoles } from '@/api/newExtend'
export default {
    name: 'ContactList',
    props: {
    },
    data() {
        return {
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
            dialogTitle: '',
            accept: '.png, .jpg',
            uploadHeader: { 'authToken': this.$store.state.user.token },
            uploadUrl: process.env.VUE_APP_BASE_API + '/files/upload',
            uploadData: {
                fileGroup: 6, // 文件组
                conferenceId: this.conferenceId // 会议ID，编辑会议上传附件传值
            },
            hideUploadEdit: false,
            fileList: [],
            ruleForm: {
                sourceType: 1,
                id: null,
                contacterName: null,
                mobile: null,
                sex: '1',
                organizationName: null,
                organizationShortName: null,
                photoUrl: null,
                email: null,
                position: null,
                contacterRoleIds: []
            },
            // 联络人角色角色
            contacterRoleIds: [],
            rules: {
                contacterName: [{ required: true, message: '请输入姓名', pattern: '[^ \x22]+', trigger: 'blur' }],
                sex: [],
                mobile: [{ required: true, message: '请输入手机号', pattern: '[^ \x22]+', trigger: 'blur' },
                    telephoneValid()],
                email: [emailValid()],
                organizationName: [{ required: true, message: '请输入单位名称', pattern: '[^ \x22]+', trigger: 'blur' }],
                contacterRoleIds: [{ required: true, message: '请选择角色' }]
            },
            dialogHeight: getTableHeight(35) + 'px',
            loading: false,
            dialogVisible: false,
            conferenceId: getConferenceId(),
            imagePath: getOssPublicBaseUrl(),
            tableData: [],
            tableHeight: getTableHeight(170),
            multipleSelection: [],
            pageInfo: {
                contacterRoleIds: [],
                contacterNameLike: '',
                pageNum: 1,
                pageSize: 10,
                total: 0
            }
        }
    },
    created() {
        this.search()
        this.getRoles()
    },
    methods: {
        // 获取角色
        getRoles() {
            getRoles().then(res => {
                const data = res.result
                data.forEach(ele => {
                    ele.valCode = Number(ele.valCode)
                })
                this.contacterRoleIds = data
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
                contacterRoleIds: [],
                contacterNameLike: '',
                pageNum: 1,
                pageSize: 10,
                total: this.pageInfo.total
            }
        },
        getUser() {
            if (this.ruleForm.contacterName !== null && this.ruleForm.contacterName !== '' &&
            this.ruleForm.mobile !== null && this.ruleForm.mobile !== '') {
                var valieMessage = ''
                this.$refs.ruleForm.validateField(['contacterName', 'mobile'], (valid) => {
                    valieMessage = valid
                })
                if (valieMessage !== null && valieMessage !== '') {
                    return false
                }
                var load = showLoading()
                getUser({ 'userName': this.ruleForm.contacterName,
                    'mobile': this.ruleForm.mobile }).then(res1 => {
                    if (!res1.success) {
                        this.ruleForm.contacterName = ''
                        this.ruleForm.mobile = ''
                        closeLoading(load)
                    } else {
                        if (res1.result !== null) {
                            // alert(JSON.stringify(res1.result))
                            if (res1.result.sex !== null && res1.result.sex !== '') {
                                this.ruleForm.sex = res1.result.sex + ''
                            }

                            this.ruleForm.organizationName = res1.result.mainJobOrg.companyName
                            this.ruleForm.organizationShortName = res1.result.mainJobOrg.companyShortName
                            this.ruleForm.email = res1.result.email
                            this.ruleForm.position = res1.result.mainJobOrg.userTitle
                            // closeLoading(load)
                        }
                        closeLoading(load)
                        // else {
                        //     this.ruleForm.contacterName = ''
                        //     this.ruleForm.mobile = ''
                        //     closeLoading(load)

                        //     this.$message('人员不存在')
                        // }
                    }
                }).catch(() => {
                    closeLoading(load)
                })
            }
        },
        insert() {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
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
            this.$confirm('请确认是否删除联络人信息?', '', {
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
        edit(val) {
            getView({ 'id': val.id }).then(res => {
                console.log(res)
                this.dialogTitle = '编辑联络人'
                this.dialogVisible = true
                this.ruleForm.id = res.result.id
                if (res.result.photoUrl !== null && res.result.photoUrl !== '') {
                    this.fileList = [{ 'name': res.result.photoUrl, 'url': res.result.photoDownloadUrl }]
                    this.hideUploadEdit = this.fileList.length >= 1
                } else {
                    this.fileList = []
                    this.hideUploadEdit = this.fileList.length >= 1
                }
                // this.fileList = [this.imagePath + res.result.photoUrl]
                this.ruleForm.contacterName = res.result.contacterName
                this.ruleForm.mobile = res.result.mobile
                this.ruleForm.sex = res.result.sex
                this.ruleForm.organizationName = res.result.organizationName
                this.ruleForm.organizationShortName = res.result.organizationShortName
                this.ruleForm.photoUrl = res.result.photoUrl
                this.ruleForm.email = res.result.email
                this.ruleForm.position = res.result.position
                this.ruleForm.contacterRoleIds = res.result.contacterRoleIds
            })
        },
        add() {
            this.dialogTitle = '添加联络人'
            this.dialogVisible = true
            this.ruleForm.id = null
            this.hideUploadEdit = false
            this.ruleForm.contacterName = null
            this.ruleForm.mobile = null
            this.ruleForm.sex = '1'
            this.ruleForm.organizationName = null
            this.ruleForm.organizationShortName = null
            this.ruleForm.photoUrl = null
            this.ruleForm.email = null
            this.ruleForm.position = null
            this.ruleForm.contacterRoleIds = []
        },
        closeDialog(val) {
            this.dialogVisible = false
            this.search()
            this.$refs['ruleForm'].resetFields()
            this.ruleForm.id = null
            this.fileList = []
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
        search() {
            this.pageInfo.pageNum = 1
            this.getList()
        },
        handleCurrentChange(val) {
            this.pageInfo.pageNum = val
            this.getList()
        },
        handleSizeChange(val) {
            this.pageInfo.pageSize = val
            this.getList()
        },
        onSuccessImg(response, file, fileList) {
            if (response.code === 2000) {
                // this.imageUrl = URL.createObjectURL(file.raw)
                this.ruleForm.photoUrl = response.result[0].filePath
                this.fileList = [{ 'name': file.name, 'url': response.result[0].downloadUrl }]
            } else {
                this.$message(response.message)
                this.ruleForm.photoUrl = ''
                this.fileList = []
            }
        },
        handleRemoveImg(file, fileList) {
            this.ruleForm.photoUrl = ''
            this.hideUploadEdit = fileList.length >= 1
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
.widthClass {
    width: 120px;
}
</style>
