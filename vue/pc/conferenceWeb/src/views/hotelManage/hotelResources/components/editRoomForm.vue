<template>
    <el-drawer :title="title" :before-close="handleClose" :visible.sync="dialog" direction="rtl" destroy-on-close
        custom-class="demo-drawer" ref="drawer" size="40%">
        <div v-if="dialog">
            <el-form ref="form" size="small" :model="form" label-width="120px" :rules="rules"
            :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto'}">
                <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                    <el-form-item label="酒店名称" prop="hotelId" style="width:80%">
                        <el-select v-model="form.hotelId" placeholder="请选择" clearable filterable style="width:100%">
                            <el-option v-for="item in hotelOptions" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="房型名称" prop="modelName" style="width:80%">
                        <el-input class="keepOutRight" v-model="form.modelName" maxlength="30" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="床位数" prop="capacity" style="width:80%">
                        <el-input v-model="form.capacity" maxlength="6" show-word-limit></el-input>
                    </el-form-item>
                    <tagsChoice ref="tagsChoice" :form="form" />
                    <el-form-item label="备注" style="width:80%">
                        <el-input type="textarea" v-model="form.description" maxlength="300" show-word-limit></el-input>
                    </el-form-item>

                </el-scrollbar>

            </el-form>
            <div class="demo-drawer__footer"
                style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD">
                <el-button type="primary" :loading="loading" style="height:32px;margin-top:12px" @click="onSubmit('form')">
                    保存</el-button>
                <el-button style="height:32px;margin-top:12px" @click="cancelForm">取消</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script>
import { updateRoomForm, addRoomForm, getRoomFormById, getHotelList } from '@/api/hotel'
import { getTableHeight } from '@/utils/index'
import { telephoneValid, num3Valid } from '@/utils/valid-common.js'
import { getConferenceId } from '@/utils/conference-auth'
import tagsChoice from '@/views/tagsChoice/index.vue'

export default {
    name: '',
    components: { tagsChoice },
    // import引入的组件需要注入到对象中才能使用
    // 例如：import 《组件名称》 from '《组件路径》';
    props: {
        hotelOptions: {
            type: Array,
            default: []
        }
    },
    data () {
        // 这里存放数据
        return {
            form: {
                id: "",
                conferenceId: getConferenceId(),  //这里后面再改  先设置会议为1
                modelName: '',
                hotelId: "",
                capacity: "",
                description: ""
            },
            title: "",
            dialog: false,
            dialogHeight: getTableHeight(35) + 'px',
            loading: false,
            rules: {
                modelName: [
                    { required: true, message: '请输入房型名称', trigger: 'blur' }
                ],
                capacity: [
                    { required: true, message: '请输入床位数', trigger: 'blur' },
                    num3Valid()
                ],
                hotelId: [
                    { required: true, message: '请选择酒店', trigger: 'blur' }
                ]
            }
        };
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {

    },
    // 方法集合
    methods: {

        showEdit (row) {
            if (!row) {
                this.title = "添加房型信息";
            } else {
                this.title = "编辑房型信息";
                setTimeout(() => {
                    this.form = Object.assign({}, row);
                })
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
            updateRoomForm(this.form).then(response => {
                if (response.success) {
                    this.$message("修改成功")
                    this.cancelForm()
                    this.$emit("getListInfo")
                }
                this.loading = false;

            })
        },
        handleAdd () {
            addRoomForm(this.form).then(response => {
                console.log("two")
                if (response.success) {
                    this.$message("新增成功")
                    this.cancelForm()
                    this.$emit("getListInfo")
                }
                this.loading = false;


            })
        },
        // 验证适用人群是否有未填/未选项
        tagVer() {
            const applicablePeopleTypesData = this.$refs.tagsChoice.applicablePeopleTypes
            const applicablePeopleTypes = []
            let continueFlag = true
            if (applicablePeopleTypesData.length) {
                for (let i = 0; i < applicablePeopleTypesData.length; i++) {
                    if (applicablePeopleTypesData[i].typeValue === 1) {
                        if (applicablePeopleTypesData[i].inputValue) {
                            applicablePeopleTypes.push({
                                type: applicablePeopleTypesData[i].typeValue,
                                value: applicablePeopleTypesData[i].inputValue
                            })
                            applicablePeopleTypesData[i].warning = false
                        } else {
                            continueFlag = false
                            applicablePeopleTypesData[i].warning = true
                        }
                    } else {
                        if (this.$refs.tagsChoice.tagsOptions.length) {
                            if (applicablePeopleTypesData[i].tagsValue) {
                                applicablePeopleTypes.push({
                                    type: applicablePeopleTypesData[i].typeValue,
                                    value: applicablePeopleTypesData[i].tagsValue
                                })
                                applicablePeopleTypesData[i].warning = false
                            } else {
                                continueFlag = false
                                applicablePeopleTypesData[i].warning = true
                            }
                        }
                    }
                }
            }
            if (continueFlag) {
                return applicablePeopleTypes
            } else {
                return continueFlag
            }
        },
        onSubmit (form) {
            this.$refs[form].validate((valid) => {
                const tagVer = this.tagVer()
                if (valid && tagVer) {
                    if (tagVer) {
                        this.form.applicablePeopleTypes = tagVer
                    }
                    this.loading = true;
                    //先根据form.id 来判断是增加还是修改  存在form.id  那么就是修改
                    if (this.form.id !== "") {
                        console.log(this.form)
                        this.handleUpdate();
                    } else { // 新增餐厅
                        this.handleAdd();
                        console.log(this.loading)
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