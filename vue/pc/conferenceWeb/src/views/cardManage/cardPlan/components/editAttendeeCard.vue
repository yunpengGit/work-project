<template>
    <el-drawer ref="drawer" :title="title" :before-close="handleClose" :visible.sync="dialog" direction="rtl"
        custom-class="demo-drawer" size="40%">
        <el-form ref="form" size="small" :model="form" label-width="120px" :rules="rules"
            :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto'}">
            <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                <el-form-item label="证件名称" prop="cardId" style="width:80%">
                    <el-select v-model="form.cardId" placeholder="全部" style="width:100%" clearable filterable
                        :disabled="cardIdDisabled">
                        <el-option v-for="item in cardOptions" :key="item.id" :label="item.cardName" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="证件状态" prop="cardStatus" style="width:80%">
                    <el-select v-model="form.cardStatus" placeholder="全部" style="width:100%" clearable filterable>
                        <el-option v-for="item in cardStatusOptions" :key="item.enumKey" :label="item.enumValue"
                            :value="item.enumKey" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="getConferenceTemplate(2) + '姓名'" prop="name" style="width:80%">
                    <el-input class="keepOutRight" v-model="form.name" maxlength="20" show-word-limit :disabled="nameDisabled" />
                </el-form-item>
                <el-form-item label="手机" prop="phone" style="width:80%" :error="phoneError">
                    <el-input class="keepOutRight" v-model="form.phone" maxlength="11" show-word-limit :disabled="phoneDisabled" />

                </el-form-item>
                <el-form-item label="单位全称" prop="organizationName" style="width:80%">
                    <el-input class="keepOutRight" v-model="form.organizationName" maxlength="30" show-word-limit />
                </el-form-item>
                <el-form-item label="单位简称" prop="organizationSortName" style="width:80%">
                    <el-input class="keepOutRight" v-model="form.organizationSortName" maxlength="10" show-word-limit />
                </el-form-item>
                <el-form-item label="描述" prop="description" style="width:80%">
                    <el-input v-model="form.description" type="textarea" maxlength="300" show-word-limit />
                </el-form-item>
            </el-scrollbar>
        </el-form>
        <div class="demo-drawer__footer"
            style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD">
            <el-button type="primary" :loading="loading" style="height:32px;margin-top:12px" @click="onSubmit('form')">
                保存</el-button>
            <el-button style="height:32px;margin-top:12px" @click="cancelForm">取消</el-button>
        </div>
    </el-drawer>
</template>

<script>
import { updateAttendeeCardTask, addAttendeeCardTask, getCardList } from '@/api/card'
import { getList } from '@/api/attendee'
import { getTableHeight } from '@/utils/index'
import { num2Valid, telephoneValid } from '@/utils/valid-common.js'
import { getConferenceId } from '@/utils/conference-auth'
export default {
    name: '',
    components: {},
    // import引入的组件需要注入到对象中才能使用
    // 例如：import 《组件名称》 from '《组件路径》';
    props: {
        cardStatusOptions: {
            type: Array,
            default: ''
        }
    },
    data () {
        // 这里存放数据
        return {
            form: {
                id: '',
                attendeeId: '',
                cardId: '',
                organizationName: '',
                cardStatus: '',
                organizationSortName: '',
                description: '',
                name: '',
                phone: ''
            },
            nameDisabled: false,
            cardIdDisabled: false,
            phoneDisabled: false,
            cardOptions: [],
            title: '',
            dialog: false,
            dialogHeight: getTableHeight(35) + 'px',
            loading: false,
            submitFlag: false,
            editInitFlag: false,
            phoneError: '',

            rules: {
                name: [
                    { required: true, message: '请输入' + '姓名', trigger: 'blur' } // + this.getConferenceTemplate(2) 报错了
                ],
                cardId: [
                    { required: true, message: '请选择证件', trigger: 'blur' }
                ],
                cardStatus: [
                    { required: true, message: '请选择证件状态', trigger: 'blur' }
                ],

                organizationName: [
                    { required: true, message: '请输入单位全称', trigger: 'change' }
                ],

                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: this.validPhone, trigger: 'blur' }
                ]
            }
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {

        // "form.phone": {
        //     handler (newVal, oldVal) {
        //         if (newVal.length == 11) {
        //             this.$refs.form.validateField("phone");
        //             if (this.validPhoneSuccessFlag) {
        //                 getList({ 'conferenceId': getConferenceId(), 'phoneLike': this.form.phone, 'signStatusEqual': [3] }).then(res => {
        //                     if (res.success) {
        //                         if (res.result.list.length === 0) {
        //                             this.form.phone = ""
        //                             this.$message('没有该手机号的参会人，请重新输入')
        //                         } else {
        //                             this.form.attendeeId = res.result.list[0].fixAttributeCommonVO.attendeeId;
        //                             this.form.organizationSortName = res.result.list[0].fixAttributeCommonVO.organizationSortName;
        //                             this.form.organizationName = res.result.list[0].fixAttributeCommonVO.organizationName;
        //                             this.form.name = res.result.list[0].fixAttributeCommonVO.attendeeName;
        //                         }
        //                     }
        //                 })
        //             }
        //         }
        //     },
        //     deep: true,
        //     immediate: true
        // },
    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created () {

    },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted () {
        this.getCardOptions()
    },
    // 这里存放数据
    beforeCreate () {
    },
    // 生命周期 - 挂载之前
    beforeMount () { },
    // 生命周期 - 更新之前
    beforeUpdate () { },
    // 生命周期 - 更新之后
    updated () { },
    // 生命周期 - 销毁之前
    beforeDestroy () { },
    // 生命周期 - 销毁完成
    destroyed () { },
    // 如果页面有keep-alive缓存功能，这个函数会触发
    activated () { },
    // 方法集合
    methods: {
        validPhone (rule, value, callback) {
            if (this.form.id !== '') { // 编辑场景不验证手机号
                callback()
            } else {
                if (value === null || value === '') {
                    callback()
                } else {
                    if (isNaN(value)) {
                        callback(new Error('手机号格式错误'))
                    } else if (value.length !== 11) {
                        // else if (!(/^[1][0,1,2,3,4,5,6,7,8,9][0-9]{9}$/.test(value))) {
                        //     callback(new Error('手机号格式错误'))
                        // }
                        callback(new Error('手机号格式错误'))
                    } else {
                        getList({ 'conferenceId': getConferenceId(), 'phoneLike': value, 'signStatusEqual': [3], 'attendeeRoleFlagEqual': [0, 1, 2, 3, 4] }).then(res => {
                            if (res.success) {
                                if (res.result.list.length === 0) {
                                    return callback(new Error('没有该手机号的' + this.getConferenceTemplate(2) + '，请重新输入'))
                                } else {
                                    if (this.submitFlag == false) {
                                        this.form.attendeeId = res.result.list[0].fixAttributeCommonVO.attendeeId
                                        this.form.organizationSortName = res.result.list[0].fixAttributeCommonVO.organizationSortName
                                        this.form.organizationName = res.result.list[0].fixAttributeCommonVO.organizationName
                                        this.form.name = res.result.list[0].fixAttributeCommonVO.attendeeName
                                        return callback()
                                    } else {
                                        return callback()
                                    }
                                }
                            }
                        })
                    }
                }
            }
        },
        getCardOptions () {
            getCardList({ 'conferenceId': getConferenceId(), 'cardType': 1 }).then(res => {
                if (res.success) {
                    this.cardOptions = res.result.list
                }
            })
        },

        showEdit (row) {
            if (!row) {
                this.title = '添加嘉宾证'
            } else {
                this.title = '编辑嘉宾证'
                this.nameDisabled = true
                this.cardIdDisabled = true
                this.phoneDisabled = true
                var data = Object.assign({}, row)
                this.form.id = 1, // 这里的修改是根据两个id  这个id为了判断编辑和新增
                    this.form.attendeeId = data.attendee.id,
                    this.form.cardId = data.card.id,
                    this.form.organizationName = data.card.organizationName,
                    this.form.cardStatus = data.card.cardStatus + '',
                    this.form.organizationSortName = data.card.organizationSortName,
                    this.form.description = data.card.description,
                    this.form.name = data.attendee.fixAttributeVO.attendeeName,
                    this.form.phone = data.attendee.fixAttributeVO.phone
            }

            this.dialog = true
        },
        resetForm (form) {
            this.$refs[form].resetFields()
            this.form = this.$options.data().form
            this.phoneDisabled = false
            this.cardIdDisabled = false
            this.nameDisabled = false
        },
        handleClose (done) {
            done()
            this.resetForm('form')
            this.dialog = false
        },
        cancelForm () {
            this.resetForm('form')
            this.dialog = false
        },

        handleUpdate () {
            var param = {
                'attendee': { 'id': this.form.attendeeId },
                'card': {
                    'id': this.form.cardId, 'organizationName': this.form.organizationName,
                    'organizationSortName': this.form.organizationSortName, 'cardStatus': this.form.cardStatus,
                    'description': this.form.description
                }
            }

            updateAttendeeCardTask(param).then(response => {
                if (response.success) {
                    this.$message('修改成功')
                    this.cancelForm()
                    this.$emit('getListInfo')
                }
                this.loading = false
            })
        },
        handleAdd () {
            var param = {
                'attendee': { 'id': this.form.attendeeId },
                'card': {
                    'id': this.form.cardId, 'organizationName': this.form.organizationName,
                    'organizationSortName': this.form.organizationSortName, 'cardStatus': this.form.cardStatus,
                    'description': this.form.description
                }
            }
            addAttendeeCardTask(param).then(response => {
                if (response.success) {
                    this.$message('新增成功')
                    this.cancelForm()
                    this.$emit('getListInfo')
                }
                this.loading = false
            })
        },
        onSubmit (form) {
            this.submitFlag = true
            this.$refs[form].validate((valid) => {
                this.submitFlag = false
                if (valid) {
                    this.loading = true
                    // 先根据form.id 来判断是增加还是修改  存在form.id  那么就是修改
                    if (this.form.id !== '') {
                        console.log('this.form' + this.form)
                        this.handleUpdate()
                    } else {
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
<style lang='scss' scoped>
// @import url(); 引入公共css类
</style>
