<template>
    <el-drawer :title="title" :before-close="handleClose" :visible.sync="dialog" direction="rtl"
        custom-class="demo-drawer" ref="drawer" size="40%">
        <el-form ref="form" size="small" :model="form" label-width="120px" :rules="rules"
            :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto'}">
            <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                <el-form-item label="车型" prop="vehicleType" style="width:80%">
                    <el-select v-model="form.vehicleType" placeholder="请选择" filterable clearable style="width:100%">
                        <el-option v-for="item in vehicleTypeOptions" :key="item.id" :label="item.name" :value="item.id"
                            @click.native="vehicleTypeClick(item.seatNum)">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="座位数" prop="seatNum" style="width:80%">
                    <el-input v-model="seatNum" :disabled=true></el-input>
                </el-form-item>
                <el-form-item label="车牌号" prop="platNum" style="width:80%">
                    <el-input v-model="form.platNum" class="keepOutRight" maxlength="30" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="颜色" prop="vehicleColor" style="width:80%">
                    <el-select v-model="form.vehicleColor" placeholder="请选择" filterable clearable style="width:100%">
                        <el-option v-for="item in colorOptions" :key="item.valCode" :label="item.valName"
                            :value="item.valCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="车辆所属公司" prop="companyId" style="width:80%">
                    <el-select v-model="form.companyId" placeholder="请选择" filterable clearable style="width:100%">
                        <el-option v-for="item in companyList" :key="item.id" :value="item.id" :label="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="司机" prop="driverId" style="width:80%">
                    <el-select v-model="form.driverId" placeholder="请选择" filterable clearable style="width:100%">
                        <el-option v-for="item in driverList" :key="item.id" :value="item.id" :label="item.name"
                            @click.native="driverClick(item.phone,item.vehicleCompanyVO.id)">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机" style="width:80%">
                    <el-input v-model="phone" :disabled=true></el-input>
                </el-form-item>
                <el-form-item label="司机所属公司" prop="companyId" style="width:80%">
                    <el-select v-model="driverCompanyId" placeholder="" filterable clearable :disabled=true
                        style="width:100%">
                        <el-option v-for="item in companyList" :key="item.id" :value="item.id" :label="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述" style="width:80%">
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
import { updateCar, addCar, getCarById, getCompanyList, getDriverList, getVehicleColor, getVehicleTypeList } from '@/api/car'
import { getTableHeight } from '@/utils/index'
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
                platNum: '',
                vehicleType: "",
                vehicleColor: "",
                companyId: "",
                driverId: "",
                description: ""
            },
            title: "",
            dialog: false,
            phone: "",
            seatNum: "",
            driverCompanyId: "",
            companyList: [],
            driverList: [],
            colorOptions: [],
            vehicleTypeOptions: [],
            dialogHeight: getTableHeight(35) + 'px',
            loading: false,
            rules: {
                platNum: [
                    { required: true, message: '请输入车牌号', trigger: 'blur' }
                ],
                vehicleColor: [
                    { required: true, message: '请选择颜色', trigger: 'blur' }
                ],
                vehicleType: [
                    { required: true, message: '请选择车型', trigger: 'blur' }
                ]
            }
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {
        "form.driverId": function (val) {
            if (val == "") {
                this.phone = ""
                this.driverCompanyId = ""
            }
        },
        "form.vehicleType": function (val) {
            if (val == "") {
                this.seatNum = ""
            }
        },
        "dialog": function (val) {
            if (val) {
                this.getColorOptions();
                this.getCompanyOptions();
                this.getDriverOptions();
                this.getVehicleTypeOptions();
            }
        },
        immediate: true,
        deep: true
    },
    // 方法集合
    methods: {

        showEdit (row) {
            if (!row) {
                this.title = "添加车辆信息";
            } else {
                this.title = "编辑车辆信息";
                this.form = Object.assign({}, row);
                for (var i in this.form) {
                    console.log(i + ":" + this.form[i], typeof (this.form[i]))
                }
                this.seatNum = this.form.vehicleTypeVO.seatNum;
                // this.form.companyId = this.form.companyId == null ? "" : parseInt(this.form.companyId)
                if (this.form.driverVO != null && this.form.driverVO != "") {
                    this.phone = this.form.driverVO.phone
                    if (this.form.driverVO.vehicleCompanyVO != null && this.form.driverVO.vehicleCompanyVO != "") {
                        this.driverCompanyId = this.form.driverVO.vehicleCompanyVO.name
                    }
                }

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

        getCompanyOptions () {
            getCompanyList({ conferenceId: getConferenceId() }).then(response => {
                if (response.success) {
                    this.companyList = response.result.list;
                }
            })
        },


        getDriverOptions () {
            getDriverList({ conferenceId: getConferenceId() }).then(response => {
                if (response.success) {
                    this.driverList = response.result.list;
                    console.log(this.driverList)

                }
            })
        },

        getColorOptions () {
            getVehicleColor().then(response => {
                if (response.success) {
                    this.colorOptions = response.result;
                } else {
                    this.$message("车的颜色分类获取失败" + response.message)
                }
            })
        },
        getVehicleTypeOptions () {
            getVehicleTypeList({ conferenceId: getConferenceId() }).then(response => {
                if (response.success) {
                    this.vehicleTypeOptions = response.result.list;
                    console.log(this.vehicleTypeOptions)
                } else {
                    this.$message("车型列表获取失败" + response.message)
                }
            })
        },


        // 选择餐厅后 显示该餐厅的座位数
        driverClick (phone, companyId) {
            this.phone = phone
            this.driverCompanyId = companyId
        },
        vehicleTypeClick (val) {
            this.seatNum = val
        },

        handleUpdate () {
            updateCar(this.form).then(response => {
                if (response.success) {
                    this.$message("修改成功")
                    this.cancelForm()
                    this.$emit("getListInfo")
                }
                this.loading = false;

            })
        },
        handleAdd () {
            addCar(this.form).then(response => {
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
                        this.handleAdd();
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
        // this.getColorOptions();   //这些数据加载放在dialog打开后
        // this.getCompanyOptions();
        // this.getDriverOptions();
        // this.getVehicleTypeOptions();
        // if (typeof (this.$route.query.carID) !== "undefined") {
        //     //根绝参数有无来判断是新增还是修改  若是修改调用根据id查餐厅接口  然后对data属性赋值即可
        //     var params = {
        //         id: this.$route.query.carID
        //     }
        //     getCarById(params).then(response => {
        //         if (response.success) {
        //             this.form = response.result;
        //             console.log(this.form)
        //             this.form.companyId = response.result.companyId == null ? "" : parseInt(response.result.companyId)//接口竟然传来个字符串类型，手动改成数字类型
        //             this.phone = response.result.driverVO.phone
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