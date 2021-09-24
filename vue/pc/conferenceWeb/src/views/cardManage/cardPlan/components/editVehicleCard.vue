<template>
    <el-drawer :title="title" :before-close="handleClose" :visible.sync="dialog" direction="rtl"
        custom-class="demo-drawer" ref="drawer" size="40%">
        <el-form ref="form" size="small" :model="form" label-width="120px" :rules="rules"
            :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto'}">
            <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                <el-form-item label="证件名称" prop="cardId" style="width:80%">
                    <el-select style="width:100%" v-model="form.cardId" placeholder="全部" clearable filterable
                        :disabled="cardIdDisabled">
                        <el-option v-for="item in cardOptions" :key="item.id" :label="item.cardName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证件状态" prop="cardStatus" style="width:80%">
                    <el-select style="width:100%" v-model="form.cardStatus" placeholder="全部" clearable filterable>
                        <el-option v-for="item in cardStatusOptions" :key="item.enumKey" :label="item.enumValue"
                            :value="item.enumKey">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="车型" prop="vehicleType" style="width:80%">
                    <el-select style="width:100%" v-model="form.vehicleType" placeholder="请选择" filterable
                        :disabled="vehicleTypeDisabled">
                        <el-option v-for="item in vehicleTypeOptions" :key="item.id" :label="item.name" :value="item.id"
                            @click.native="vehicleTypeClick()">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="车牌号" prop="vehicleId" style="width:80%">
                    <el-select style="width:100%" v-model="form.vehicleId" placeholder="请选择" filterable
                        :disabled="vehicleIdDisabled">
                        <el-option v-for="item in vehicleOptions" :key="item.id" :label="item.platNum" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="公司名称" prop="companyName" style="width:80%">
                    <el-input class="keepOutRight" v-model="form.companyName" maxlength="30" show-word-limit></el-input>
                </el-form-item>

                <el-form-item type="textarea" label="描述" prop="description" style="width:80%">
                    <el-input v-model="form.description" maxlength="300" show-word-limit></el-input>
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
import { updateVehicleCardTask, addVehicleCardTask, getCardList } from '@/api/card'
import { getVehicleTypeList, getCarList } from '@/api/car'

import { getList } from '@/api/attendee'
import { getTableHeight } from '@/utils/index'
import { num2Valid } from '@/utils/valid-common.js'
import { getConferenceId } from '@/utils/conference-auth'
export default {
    name: '',
    // import引入的组件需要注入到对象中才能使用
    // 例如：import 《组件名称》 from '《组件路径》';
    props: {
        cardStatusOptions: {
            type: Array,
            default: ""
        }
    },
    components: {},
    data () {
        // 这里存放数据
        return {
            form: {
                id: "",
                cardId: "",
                vehicleType: "",
                vehicleId: "",
                companyName: "",
                description: "",
                cardStatus: ""
            },
            vehicleTypeDisabled: false,
            vehicleIdDisabled: false,
            cardIdDisabled: false,
            cardOptions: [],
            vehicleTypeOptions: [],
            vehicleOptions: [],
            title: "",
            dialog: false,
            dialogHeight: getTableHeight(35) + 'px',
            loading: false,
            rules: {
                cardId: [
                    { required: true, message: '请选择证件', trigger: 'blur' }
                ],
                cardStatus: [
                    { required: true, message: '请选择证件状态', trigger: 'blur' }
                ],
                vehicleType: [
                    { required: true, message: '请选择车型', trigger: 'blur' }
                ],
                vehicleId: [
                    { required: true, message: '请选择车牌号', trigger: 'blur' }
                ]
            }
        };
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {
        "dialog": function (val) {
            if (val) {
                this.getVehicleOptions();
                this.getCardOptions();
                this.getVehicleTypeOptions();
            }
        }
    },
    // 方法集合
    methods: {
        vehicleTypeClick (item) {

            this.form.vehicleId = ""
            this.getVehicleOptions();//选中车型后，根据车型筛选车辆信息
        },

        getVehicleTypeOptions () {
            getVehicleTypeList({ conferenceId: getConferenceId() }).then(response => {
                if (response.success) {
                    this.vehicleTypeOptions = response.result.list;
                    console.log(this.vehicleTypeOptions)
                }
            })
        },
        getVehicleOptions () {
            getCarList({ "conferenceId": getConferenceId(), "vehicleTypeId": this.form.vehicleType }).then(response => {
                if (response.success) {
                    this.vehicleOptions = response.result.list;
                }
            })
        },
        getCardOptions () {
            getCardList({ "conferenceId": getConferenceId(), "cardType": 2 }).then(res => {
                if (res.success) {
                    this.cardOptions = res.result.list;
                }
            })
        },


        showEdit (row) {
            if (!row) {
                this.title = "添加车证";
            } else {
                this.title = "编辑车证";
                this.vehicleTypeDisabled = true;
                this.vehicleIdDisabled = true;
                this.cardIdDisabled = true;
                var data = Object.assign({}, row);
                this.form.id = 1,  //这里的修改是根据两个id  这个id为了判断编辑和新增
                    this.form.cardId = data.card.id,
                    this.form.vehicleType = data.vehicle.vehicleType,
                    this.form.cardStatus = data.card.cardStatus + "",
                    this.form.vehicleId = data.vehicle.id,
                    this.form.description = data.card.description,
                    this.form.companyName = data.card.companyName

            }
            this.dialog = true;
        },
        resetForm (form) {
            this.$refs[form].resetFields();
            this.form = this.$options.data().form;
            this.vehicleTypeDisabled = false;
            this.vehicleIdDisabled = false;
            this.cardIdDisabled = false;

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
            var param = {
                "vehicle": { "id": this.form.vehicleId },
                "card": {
                    "id": this.form.cardId,
                    "companyName": this.form.companyName, "cardStatus": this.form.cardStatus,
                    "description": this.form.description
                }
            }
            updateVehicleCardTask(param).then(response => {
                if (response.success) {
                    this.$message("修改成功")
                    this.cancelForm()
                    this.$emit("getListInfo")
                }
                this.loading = false;

            })
        },
        handleAdd () {
            var param = {
                "vehicle": { "id": this.form.vehicleId },
                "card": {
                    "id": this.form.cardId,
                    "companyName": this.form.companyName, "cardStatus": this.form.cardStatus,
                    "description": this.form.description
                }
            }
            addVehicleCardTask(param).then(response => {
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
                        console.log("this.form" + this.form)
                        this.handleUpdate();

                    } else {
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