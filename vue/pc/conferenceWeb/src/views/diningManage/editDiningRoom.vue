<template>
    <el-drawer ref="drawer" :title="title" :before-close="handleClose" :visible.sync="dialog" direction="rtl" destroy-on-close custom-class="demo-drawer" size="40%">
        <div v-if="dialog">
            <el-form ref="form" size="small" :model="form" label-width="120px" :rules="rules"
            :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto'}">
                <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                    <el-form-item label="餐厅名称" prop="dinnerRoom" style="width:80%">
                        <el-input class="keepOutRight" v-model="form.dinnerRoom" maxlength="50" show-word-limit />
                    </el-form-item>
                    <el-form-item label="餐厅位置" prop="diningAddress" style="width:80%">
                        <el-input class="keepOutRight" v-model="form.diningAddress" maxlength="50" show-word-limit />
                    </el-form-item>
                    <el-form-item label="餐位数" prop="seatNum" style="width:80%">
                        <el-input class="keepOutRight" v-model="form.seatNum" maxlength="6" show-word-limit />
                    </el-form-item>
                    <el-form-item label="桌号" prop="tableNoList" style="width:80%">
                        <div v-for="(item,index) in tableNoList" :key="item+index" style="height:45px">
                            <el-input v-model="item.val" maxlength="10" show-word-limit style="width:50%" />
                            <el-button icon="el-icon-delete" style="margin-left:5px;margin-top:3px" @click.prevent="remove(index)" />
                        </div>
                        <el-button size="small" style="margin-top:5px;color:#1E89FF" @click="add"><i class="el-icon-plus" />
                            添加</el-button>
                    </el-form-item>
                    <tagsChoice ref="tagsChoice" :form="form" />
                    <el-form-item label="用餐须知" style="width:80%">
                        <el-input v-model="form.notice" type="textarea" maxlength="300" show-word-limit />
                    </el-form-item>
                    <el-form-item label="联系电话" prop="phone" style="width:80%">
                        <el-input class="keepOutRight" v-model="form.phone" maxlength="11" show-word-limit />
                    </el-form-item>
                    <el-form-item label="联系人" prop="contactPerson" style="width:80%">
                        <el-input class="keepOutRight" v-model="form.contactPerson" maxlength="50" show-word-limit />
                    </el-form-item>
                    <el-form-item label="联系人电话" prop="contactPhone" style="width:80%">
                        <el-input class="keepOutRight" v-model="form.contactPhone" maxlength="11" show-word-limit />
                    </el-form-item>
                    <el-form-item label="描述" style="width:80%">
                        <el-input v-model="form.description" type="textarea" maxlength="300" show-word-limit />
                    </el-form-item>
                    <!-- <el-form-item v-for="item in form.dinnerTypes" :key="item.typeCode" :label="item.typeCode"
                        style="width:80%">
                        <el-radio-group v-model="item.enableFlag" style="max-width:45%">
                            <el-radio :label="1">提供</el-radio>
                            <el-radio :label="0" style="margin-left: -20px">不提供</el-radio>
                        </el-radio-group>
                        <el-time-picker v-show="item.enableFlag === 1" v-model="item.startTime" class="yongcanshijianclass"
                            style="width:26%;margin-left:2%" format="HH:mm" value-format="HH:mm:ss" :picker-options="{
                                selectableRange: '00:00:00 - 23:59:59'
                            }" :clearable="false" size="mini" />
                        <el-time-picker v-show="item.enableFlag === 1" v-model="item.endTime" class="yongcanshijianclass"
                            format="HH:mm" style="width:26%" value-format="HH:mm:ss" :picker-options="{
                                selectableRange: '00:00:00 - 23:59:59'
                            }" :clearable="false" size="mini" />
                    </el-form-item> -->
                    <!-- <el-form-item prop="dinnerTypes" style="width:80%">
                        <el-table :data="form.dinnerTypes">
                            <el-table-column prop="enableFlag" label="是否可用"   width="70px">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'dinnerTypes.' + scope.$index + '.enableFlag'">
                                        <el-switch v-model="scope.row.enableFlag" :active-value="1" :inactive-value="0" />
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="用餐类型"   width="70px">
                                <template slot-scope="scope">
                                    {{ scope.row.typeCode }}
                                </template>
                            </el-table-column>

                            <el-table-column prop="startTime" label="开始时间"  >
                                <template slot-scope="scope">
                                    <el-form-item :prop="'dinnerTypes.' + scope.$index + '.startTime'">
                                        <el-time-picker
                                            v-model="scope.row.startTime"
                                            style="width:100px"
                                            format="HH:mm"
                                            value-format="HH:mm:ss"
                                            :picker-options="{
                                                selectableRange: '00:00:00 - 23:59:59'
                                            }"
                                            :clearable="false"
                                            size="mini"
                                        />
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column prop="endTime" label="结束时间"  >
                                <template slot-scope="scope">
                                    <el-form-item :prop="'dinnerTypes.' + scope.$index + '.endTime'">
                                        <el-time-picker
                                            v-model="scope.row.endTime"
                                            format="HH:mm"
                                            style="width:100px"
                                            value-format="HH:mm:ss"
                                            :picker-options="{
                                                selectableRange: '00:00:00 - 23:59:59'
                                            }"
                                            :clearable="false"
                                            size="mini"
                                        />
                                    </el-form-item>
                                </template>
                            </el-table-column>

                        </el-table>
                    </el-form-item> -->
                </el-scrollbar>

            </el-form>
            <div class="demo-drawer__footer"
                style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD">
                <el-button type="primary" :loading="loading" style="height:32px;margin-top:12px" @click="onSubmit('form')">
                    保存</el-button>
                <el-button style="height:32px;margin-top:12px" @click="cancelForm">取 消</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script>
import { updateDining, newUpdateDining, addDining, getDiningById, getTaskTypeOptions } from '@/api/dining'

import { getTableHeight } from '@/utils/index'
import { telephoneValid, num3Valid } from '@/utils/valid-common.js'
import { getConferenceId } from '@/utils/conference-auth'
import tagsChoice from '@/views/tagsChoice/index.vue'

export default {
    components: { tagsChoice },
    name: '',
    // import引入的组件需要注入到对象中才能使用
    // 例如：import 《组件名称》 from '《组件路径》';
    data() {
        // 这里存放数据
        return {
            form: {
                id: '',
                conferenceId: getConferenceId(),
                dinnerRoom: '',
                diningAddress: '',
                seatNum: '',
                contactPerson: '',
                contactPhone: '',
                phone: '',
                description: '',
                //     dinnerTypes: [],
                //     provideFlag: 1,
                tableNoList: [],
                // 须知
                notice: ''

            },
            tableNoList: [],
            title: '',
            dialog: false,
            dialogHeight: getTableHeight(35) + 'px',
            loading: false,
            rules: {
                dinnerRoom: [
                    { required: true, message: '请输入餐厅名称', trigger: 'blur' }
                ],
                diningAddress: [
                    { required: true, message: '请输入餐厅位置', trigger: 'blur' }
                ],
                seatNum: [
                    { required: true, message: '请输入餐厅容量', trigger: 'blur' },
                    num3Valid()
                ],
               
                // phone: [
                //     { required: false, message: '', trigger: 'blur' },
                //     telephoneValid()

                // ],
                contactPhone: [
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
    // 生命周期 - 创建完成（可以访问当前this实例）
    created () {

    },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted () {
        // if (typeof (this.$route.query.diningID) !== "undefined") {
        //     //根绝参数有无来判断是新增还是修改  若是修改调用根据id查餐厅接口  然后对data属性赋值即可
        //     var params = {
        //         id: this.$route.query.diningID
        //     }
        //     getDiningById(params).then(response => {
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
    activated () { },
    // 方法集合
    methods: {
        add () {
            var obj = { val: '' };
            this.tableNoList.push(obj)
        },
        remove (index) {
            if (this.form.relevanceFlag) {
                this.$message.error("餐厅已关联用餐计划，无法删除桌号");
                return false;
            }
            this.tableNoList.splice(index, 1)
        },
        getDinnerTypes () {
            getTaskTypeOptions().then(response => {
                if (response.success) {
                    console.log('type result' + response.result)
                    this.form.dinnerTypes = response.result
                }
            })
        },
        showEdit (row) {
            if (!row) {
                this.title = '添加餐厅'
                //   this.getDinnerTypes()// 新增时用餐类型和时间从默认数据接口中获取
            } else {
                this.title = '编辑餐厅'
                getDiningById({ id: row.id }).then(response => {
                    if (response.success) {
                        this.form = response.result
                        this.tableNoList = response.result.tableNoList.map(n => { return { val: n } })
                    } else {
                        this.$message('数据获取失败')
                    }
                }) // 列表中没有详情信息 需要用id详情接口
            }
            this.dialog = true
        },

        resetForm (form) {
            //  this.$refs[form].resetFields(); //这方法导致报错   下面这行就够了
            this.form = this.$options.data().form
        },
        handleClose (done) {
            done()
            this.loading = false
            this.tableNoList = []
            this.resetForm('form')
            this.dialog = false
        },
        cancelForm () {
            this.resetForm('form')
            this.tableNoList = []
            this.dialog = false
        },
        handleUpdate () {
            // 应后端要求更改接口请求路径
            newUpdateDining(this.form).then(response => {
                if (response.success) {
                    this.$message('修改成功')
                    this.cancelForm()
                    this.$emit('getListInfo')
                }
                this.loading = false
            })
        },
        handleAdd () {
            addDining(this.form).then(response => {
                if (response.success) {
                    this.$message('新增成功')
                    this.cancelForm()
                    this.$emit('getListInfo')
                }
                this.loading = false
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
                    this.form.tableNoList = []
                    this.tableNoList.forEach(item => {
                        this.form.tableNoList.push(item.val)
                    })
                    if (tagVer) {
                        this.form.applicablePeopleTypes = tagVer
                    }
                    // var flag = this.form.dinnerTypes.some(item => item.startTime === null || item.endTime === null)
                    // if (flag) {
                    //     this.$message('请选择供应时间')
                    //     return
                    // }
                    // var flag1 = this.form.dinnerTypes.some(item => item.startTime > item.endTime)
                    // if (flag1) {
                    //     this.$message('开始时间不应大于结束时间')
                    //     return
                    // }
                    this.loading = true
                    // 先根据form.id 来判断是增加还是修改  存在form.id  那么就是修改
                    if (this.form.id !== '') {
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
<style lang='scss' scoped>
// @import url(); 引入公共css类
// ::v-deep .el-drawer.rtl.demo-drawer {
//     overflow: scroll;
//     margin: 30px 0px;
//     height: 600px;
//     width: 55% !important;
// }
</style>
<style lang='scss'>
.yongcanshijianclass .el-input__inner {
    padding-right: 5px !important;
}
</style>

