<template>
    <el-drawer :title="title" :before-close="handleClose" :visible.sync="dialog" direction="rtl"
        custom-class="demo-drawer" ref="drawer" size="40%">
        <el-form ref="form" size="small" :model="form" label-width="120px" :rules="rules"
            :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto'}">
            <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                <el-form-item label="公司名称" prop="name" style="width:80%">
                    <el-input v-model="form.name" class="keepOutRight" maxlength="50" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="contactPerson" style="width:80%">
                    <el-input v-model="form.contactPerson" class="keepOutRight" maxlength="30" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="phone" style="width:80%">
                    <el-input v-model="form.phone" class="keepOutRight" maxlength="11" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address" style="width:80%">
                    <el-input v-model="form.address" class="keepOutRight" maxlength="50" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description" style="width:80%">
                    <el-input type="textarea" v-model="form.description" maxlength="300" show-word-limit>
                    </el-input>
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
import { updateCompany, addCompany, getCompanyById } from '@/api/car'
import { getTableHeight } from '@/utils/index'
import { telephoneValid } from '@/utils/valid-common.js'
import { getConferenceId } from '@/utils/conference-auth'
export default {
    name: '',
    // import引入的组件需要注入到对象中才能使用
    // 例如：import 《组件名称》 from '《组件路径》';
    components: {},
    data () {
        // 这里存放数据
        return {
            form: {
                id: "",
                conferenceId: getConferenceId(),  //这里后面再改  先设置会议为1
                name: '',
                contactPerson: "",
                phone: "",
                address: "",
                description: ""
            },
            title: "",
            dialog: false,
            dialogHeight: getTableHeight(35) + 'px',
            loading: false,
            rules: {
                name: [
                    { required: true, message: '请输入公司名称', trigger: 'blur' }
                ],
                phone: [
                    { required: false, message: '', trigger: 'blur' },
                    telephoneValid()
                ]
            }
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {},
    // 方法集合
    methods: {

        showEdit (row) {
            if (!row) {
                this.title = "添加公司信息";
            } else {
                this.title = "编辑公司信息";
                this.form = Object.assign({}, row);
            }
            this.dialog = true;
        },
        resetForm (form) {
            this.$refs[form].resetFields();
            this.form = this.$options.data().form;
        },
        handleClose (done) {
            done();
            this.resetForm('form')
            this.dialog = false
        },
        cancelForm () {
            this.resetForm('form')
            this.dialog = false
        },

        handleUpdate () {
            updateCompany(this.form).then(response => {
                if (response.success) {
                    this.$message("修改成功")
                    this.cancelForm()
                    this.$emit("getListInfo")
                }
                this.loading = false;

            })
        },
        handleAdd () {
            addCompany(this.form).then(response => {
                console.log("two")
                if (response.success) {
                    this.$message("新增成功")
                    this.cancelForm()
                    this.$emit("getListInfo")
                }
                this.loading = false;


            })
        },
        onSubmit (form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    //先根据form.id 来判断是增加还是修改  存在form.id  那么就是修改
                    if (this.form.id !== "") {
                        console.log(this.form)
                        this.handleUpdate();
                    } else { // 新增餐厅
                        console.log("one")
                        this.handleAdd();
                        console.log("three")
                        console.log(this.loading)//输出结果 one three true two ? 待处理
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created () {

    },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted () {
        // if (typeof (this.$route.query.companyID) !== "undefined") {
        //     //根绝参数有无来判断是新增还是修改  若是修改调用根据id查餐厅接口  然后对data属性赋值即可
        //     var params = {
        //         id: this.$route.query.companyID
        //     }
        //     getCompanyById(params).then(response => {
        //         if (response.success) {
        //             this.form = response.result;
        //             console.log(this.form)
        //         }
        //     })
        // }
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
    activated () { }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
</style>