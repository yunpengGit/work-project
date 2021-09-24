<template>
    <el-drawer
        ref="drawer"
        :title="title"
        :before-close="handleClose"
        :visible.sync="dialog"
        direction="rtl"
        custom-class="demo-drawer"
        size="40%"
    >
        <el-form
            ref="form"
            size="small"
            :model="form"
            label-width="120px"
            :rules="rules"
            :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto'}"
        >
            <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                <el-form-item label="姓名" prop="name" style="width:80%">
                    <el-input v-model="form.name" class="keepOutRight" maxlength="30" show-word-limit :disabled="nameDisabled" />
                </el-form-item>
                <el-form-item label="手机" prop="phone" style="width:80%">
                    <el-input v-model.number="form.phone" class="keepOutRight" maxlength="11" show-word-limit />
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="form.sex">
                        <el-radio v-for="item in sex" :key="item.id" :label="item.valCode">
                            {{ item.valName }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="公司" prop="companyId" style="width:80%">
                    <el-select v-model="form.companyId" placeholder="请选择" filterable clearable style="width:100%">
                        <el-option v-for="item in companyList" :key="item.id" :value="item.id" :label="item.name" />
                    </el-select>
                </el-form-item>
                
                <el-form-item label="身份证号" prop="idCard" style="width:80%">
                    <el-input v-model="form.idCard" class="keepOutRight" maxlength="18" show-word-limit />
                </el-form-item>
                <el-form-item label="年龄" prop="age" style="width:80%">
                    <el-input v-model="age" :disabled="true" />
                </el-form-item>
                <el-form-item label="驾龄(年)" prop="drivingAge" style="width:80%">
                    <el-input v-model="form.drivingAge" class="keepOutRight" maxlength="11" show-word-limit />
                </el-form-item>
                <el-form-item label="照片" prop="photoUrl">
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
                        <i class="el-icon-plus avatar-uploader-icon" style="margin-top:-15px;margin-left:-15px" />
                    </el-upload>
                    <div
                        class="_48OpacityClass"
                        style="margin-top:5px;width:360px;white-space:normal;word-break:break-all;word-wrap:break-word;"
                    >
                        格式可以是jpg/png，大小为20K～200K，35毫米×48毫米左右。相当于大一寸照片。
                    </div>
                </el-form-item>
                <el-form-item label="邮箱" prop="email" style="width:80%">
                    <el-input v-model="form.email" class="keepOutRight" maxlength="50" show-word-limit />
                </el-form-item>

                <el-form-item label="描述" style="width:80%" prop="description">
                    <el-input v-model="form.description" type="textarea" maxlength="300" show-word-limit />
                </el-form-item>
            </el-scrollbar>

        </el-form>
        <div
            class="demo-drawer__footer"
            style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD"
        >
            <el-button type="primary" :loading="loading" style="height:32px;margin-top:12px" @click="onSubmit('form')">
                保存</el-button>
            <el-button style="height:32px;margin-top:12px" @click="cancelForm">取消</el-button>
        </div>
    </el-drawer>
</template>

<script>
import { updateDriver, addDriver, getDriverById, getCompanyList, getSexOptioin, getUserByMobile } from '@/api/car'
import { getTableHeight } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
import { getOssPublicBaseUrl } from '@/utils/x-sso-publicbaseurl'
import { getToken } from '@/utils/user-auth'
import { telephoneValid, num2Valid } from '@/utils/valid-common.js'

export default {
    name: '',
    // import引入的组件需要注入到对象中才能使用
    // 例如：import 《组件名称》 from '《组件路径》';
    components: {},
    data() {
        // 这里存放数据
        return {
            form: {
                id: '',
                conferenceId: getConferenceId(), // 这里后面再改  先设置会议为1
                phone: '',
                name: '',
                sex: '1',
                idCard: '',
                drivingAge: '',
                email: '',
                companyId: '',
                description: '',
                photoUrl: ''
            },
            accept: '.png, .jpg',
            age: '',
            sex: [],
            samplePicture: '',
            companyList: [],
            title: '',
            dialog: false,
            dialogHeight: getTableHeight(35) + 'px',
            uploadUrl: process.env.VUE_APP_BASE_API + '/files/upload',
            uploadHeader: { 'authToken': getToken() }, // 使用this.$store.state 会和 this.$options.data().form 冲突
            imagePath: '',
            fileList: [],
            loading: false,
            hideUploadEdit: false,
            nameDisabled: false,
            phoneDisabled: false,
            uploadData: {
                fileGroup: 8, // 文件组
                conferenceId: getConferenceId() // 会议ID，编辑会议上传附件传值
            },
            rules: {
                name: [
                    { required: true, message: '请输入司机姓名', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: this.validPhone, trigger: 'blur' }
                ],
                // photoUrl: [
                //     { required: true, message: '请上传头像', trigger: 'blur' }
                // ],
                // sex: [
                //     { required: true, message: '请选择性别', trigger: 'blur' }
                // ],
                idCard: [
                    { required: false, message: '请输入身份证号码', trigger: 'blur' },
                    { validator: this.validID, trigger: 'blur' }
                ],
                drivingAge: [
                    { required: false, message: '请输入驾龄', trigger: 'blur' },
                    num2Valid()
                ],
                // companyId: [
                //     { required: true, message: '请选择出租公司', trigger: 'blur' }
                // ],
                email: [
                    { required: false, message: '请选择出租公司', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ]

            }
        }
    },
    // 监听属性 类似于data概念
    computed: {

    },
    // 监控data中的数据变化
    watch: {
        'form.idCard': function(val) {
            if (val == '') {
                this.age = ''
            }
        },
        'dialog': function(val) {
            if (val) {
                this.getCompanyOptions()
                this.getSexOptions()
            }
        }
    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

        // if (typeof (this.$route.query.driverID) !== "undefined") {
        //     //根绝参数有无来判断是新增还是修改  若是修改调用根据id查餐厅接口  然后对data属性赋值即可
        //     var params = {
        //         id: this.$route.query.driverID
        //     }
        //     getDriverById(params).then(response => {
        //         if (response.success) {
        //             this.form = response.result;
        //             console.log(this.form)
        //             this.form.companyId = response.result.vehicleCompanyVO.id
        //             this.go(this.form.idCard.length)
        //         }
        //     })
        // }
    },
    // 这里存放数据
    beforeCreate() {
    },
    // 生命周期 - 挂载之前
    beforeMount() { },
    // 生命周期 - 更新之前
    beforeUpdate() { },
    // 生命周期 - 更新之后
    updated() { },
    // 生命周期 - 销毁之前
    beforeDestroy() { },
    // 生命周期 - 销毁完成
    destroyed() { },
    // 如果页面有keep-alive缓存功能，这个函数会触发
    activated() { },
    // 方法集合
    methods: {

        validPhone(rule, value, callback) {
            if (value === null || value === '') {
                callback()
            }
            if (isNaN(value)) {
                callback(new Error('手机号格式错误'))
            } else if (!(/^[1][0,1,2,3,4,5,6,7,8,9][0-9]{9}$/.test(value))) {
                callback(new Error('手机号格式错误'))
            } else {
                callback()
                // getUserByMobile({ 'mobile': value }).then(res => {
                //     if (res.success) {
                //         // 且是内部用户
                //         if (res.result !== null && res.result.user.innerFlag === 1) {
                //             this.form.name = res.result.userName
                //             this.nameDisabled = true
                //             return callback()
                //         } else {
                //             this.nameDisabled = false
                //             return callback()
                //         }
                //     }
                // })
            }
        },

        beforeUploadImg(file) {
            this.uploadData.conferenceId = getConferenceId()
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

        handleRemoveImg(file, fileList) {
            this.form.photoUrl = ''
            this.hideUploadEdit = fileList.length >= 1
        },

        onSuccessImg(response, file, fileList) {
            if (response.code === 2000) {
                // this.imageUrl = URL.createObjectURL(file.raw)
                this.form.photoUrl = response.result[0].filePath
                this.fileList = [{ 'name': file.name, 'url': response.result[0].downloadUrl }]
            } else {
                this.$message(response.message)
                this.form.photoUrl = ''
                this.fileList = []
            }
        },

        handleChange(file, fileList) {
            // 大于1张隐藏
            this.hideUploadEdit = fileList.length >= 1
        },
        onExceedImg(files, fileList) {
            this.$message('请删除已上传附件')
        },

        onError(err, file, fileList) {
            this.$message('上传失败')
            console.log(err)
        },
        // handleAvatarSuccess (res, file) {
        //     if (res.success) {
        //         console.log(res)
        //         console.log("file" + file)
        //         this.form.photoUrl = res.result[0].filePath;
        //         console.log(getOssBaseUrl() + this.form.photoUrl)
        //     } else {
        //         this.$message("上传失败leya")
        //     }
        // },
        // 上传图片前校验
        beforeAvatarUpload(file) {
            console.log(file.type)
            const isJPG = /^image\/(jpeg|png|jpg|gif|svg)$/g.test(file.type)
            console.log('filesize' + file.size)
            const isLt2M = file.size / 1024 < 200 && file.size / 1024 > 20
            if (!isJPG) {
                this.$message('上传图片只能是图片格式!')
            }
            if (!isLt2M) {
                this.$message('上传图片大小为20~200kb!')
            }
            return isJPG && isLt2M
        },
        // 身份证验证
        async validID(rule, value, callback) {
            // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
            if (value === null || value === '') {
                callback()
            }
            const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
            if (reg.test(value)) {
                await this.go(value.length)
                callback()
            } else {
                callback(new Error('身份证号码不正确'))
            }
        },

        // 实现自动生成年龄
        go(val) {
            const iden = this.form.idCard
            const myDate = new Date()
            const month = myDate.getMonth() + 1
            const day = myDate.getDate()
            let age = 0
            if (val === 18) {
                age = myDate.getFullYear() - iden.substring(6, 10) - 1
                if (iden.substring(10, 12) < month || iden.substring(10, 12) == month && iden.substring(12, 14) <= day) age++
            }
            if (val === 15) {
                age = myDate.getFullYear() - iden.substring(6, 8) - 1901
                if (iden.substring(8, 10) < month || iden.substring(8, 10) == month && iden.substring(10, 12) <= day) age++
            }
            this.age = age
        },

        showEdit(row) {
            if (!row) {
                this.title = '添加司机信息'
                this.fileList = []
                this.hideUploadEdit = false
                console.log(this.form)
            } else {
                this.title = '编辑司机信息'
                this.form = Object.assign({}, row)
                // this.nameDisabled = true //放开允许修改
                this.phoneDisabled = true
                this.getFilePath(this.form.photoUrl).then(res => {
                    this.imagePath = res.result
                })
                console.log('url---' + this.imagePath + this.form.photoUrl)
                this.form.phone = this.form.phone ? parseInt(this.form.phone) : ''
                if (this.form.idCard != null && this.form.idCard != '') {
                    this.go(this.form.idCard.length)
                }
                this.form.companyId = this.form.vehicleCompanyVO ? this.form.vehicleCompanyVO.id : ''
                if (this.form.photoUrl !== null && this.form.photoUrl !== '') {
                    this.getFilePath(this.form.photoUrl).then(res => {
                        this.imagePath = res.result
                        this.fileList = [{ 'name': this.form.photoUrl, 'url': this.imagePath }]
                        this.hideUploadEdit = this.fileList.length >= 1
                    })
                } else {
                    this.fileList = []
                    this.hideUploadEdit = false
                }
            }
            this.dialog = true
        },
        resetForm(form) {
            this.fileList = []
            this.nameDisabled = false
            this.phoneDisabled = false
            this.$refs[form].resetFields()
            this.form = this.$options.data().form
        },
        handleClose(done) {
            done()
            this.resetForm('form')
            this.dialog = false
        },
        cancelForm() {
            this.resetForm('form')
            this.dialog = false
        },

        getCompanyOptions() {
            getCompanyList({ conferenceId: getConferenceId() }).then(response => {
                if (response.success) {
                    this.companyList = response.result.list
                }
            })
        },

        getSexOptions() {
            getSexOptioin().then(response => {
                if (response.success) {
                    this.sex = response.result
                }
            })
        },

        handleUpdate() {
            updateDriver(this.form).then(response => {
                if (response.success) {
                    this.$message('修改成功')
                    this.cancelForm()
                    this.$emit('getListInfo')
                }
                this.loading = false
            })
        },
        handleAdd() {
            addDriver(this.form).then(response => {
                if (response.success) {
                    this.$message('新增成功')
                    this.cancelForm()
                    this.$emit('getListInfo')
                }
                this.loading = false
            })
        },
        onSubmit(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.loading = true
                    // 先根据form.id 来判断是增加还是修改  存在form.id  那么就是修改
                    if (this.form.id !== '') {
                        console.log(this.form)
                        this.handleUpdate()
                    } else { // 新增餐厅
                        this.handleAdd()
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
    }
}
</script>
<style lang='scss'scoped >
// @import url(); 引入公共css类
// ::v-deep .el-drawer.rtl.demo-drawer {
//     overflow: scroll;
//     margin: 30px 0px;
//     height: 600px;
//     width: 40% !important;
// }
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}

// ::v-deep .el-upload--picture-card {
//     width: 74px;
//     height: 74px;
//     padding-right: 25px;
// }

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
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

::v-deep .hide .el-upload--picture-card {
    display: none;
}
</style>
