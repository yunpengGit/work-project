<template>
    <el-drawer :title="title" :before-close="handleClose" :visible.sync="dialog" direction="rtl" destroy-on-close
        custom-class="demo-drawer" ref="drawer" size="40%">
        <div v-if="dialog">
            <el-form ref="form" size="small" :model="form" label-width="120px" :rules="rules"
            :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto'}">
                <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">

                    <el-form-item label="证件名称" prop="cardName" style="width:80%">
                        <el-input class="keepOutRight" size="small" type="text" v-model="form.cardName" maxlength="20" show-word-limit />
                    </el-form-item>
                    <el-form-item label="证件类型" prop="cardType" style="width:80%">
                        <el-select v-model="form.cardType" placeholder="请选择" clearable style="width:100%" filterable
                            :disabled="cardTypeDisabled">
                            <el-option v-for="item in cardTypeOptions" :key="item.cardType" :label="item.cardTypeStr"
                                :value="item.cardType">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数量(张)" prop="totalCount" style="width:80%">
                        <el-input class="keepOutRight" size="small" type="text" v-model="form.totalCount" maxlength="6" show-word-limit />
                    </el-form-item>
                    <el-form-item label="生效时间" prop="effectiveTime" style="width:80%">
                        <el-date-picker v-model="form.effectiveTime" type="datetime" format="yyyy-MM-dd HH:mm:ss"
                            style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="失效时间" prop="invalidTime" style="width:80%">
                        <el-date-picker v-model="form.invalidTime" type="datetime" format="yyyy-MM-dd HH:mm:ss"
                            style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="取证须知" prop="description" style="width:80%">
                        <el-input type="textarea" v-model="form.notice" :rows="4" maxlength="300" show-word-limit>
                        </el-input>
                    </el-form-item>
                    <tagsChoice ref="tagsChoice" :form="form" />
                    <el-form-item label="证件描述" prop="description" style="width:80%">
                        <el-input type="textarea" v-model="form.description" :rows="4" maxlength="300" show-word-limit>
                        </el-input>
                    </el-form-item>
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
import { updateCard, addCard } from '@/api/card'

import { getTableHeight } from '@/utils/index'
import { telephoneValid, num3Valid } from '@/utils/valid-common.js'
import { getConferenceId } from '@/utils/conference-auth'
import tagsChoice from '@/views/tagsChoice/index.vue'

export default {
    name: '',
    // import引入的组件需要注入到对象中才能使用
    // 例如：import 《组件名称》 from '《组件路径》';
    components: { tagsChoice },
    data () {
        // 这里存放数据
        return {
            form: {
                id: "",
                conferenceId: getConferenceId(),  //这里后面再改  先设置会议为1
                cardName: '',
                cardType: "",
                cardTypeStr: "",
                effectiveTime: "",
                invalidTime: "",
                totalCount: "",
                description: "",
                // 须知
                notice: ''
            },
            cardTypeDisabled: false,
            title: "",
            dialog: false,
            dialogHeight: getTableHeight(35) + 'px',
            loading: false,
            cardTypeOptions: [{ cardType: 1, cardTypeStr: "嘉宾证" }, { cardType: 2, cardTypeStr: "车辆证" }],
            rules: {
                cardName: [
                    { required: true, message: '请输入证件名称', trigger: 'blur' }
                ],
                cardType: [
                    { required: true, message: '请选择类型', trigger: 'blur' }
                ],
                totalCount: [
                    { required: true, message: '请输入证件数量', trigger: 'blur' },
                    num3Valid()
                ]
            }
        };
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {},
    // 方法集合
    methods: {
        showEdit (row) {
            if (!row) {
                this.title = "添加证件";
            } else {
                this.title = "编辑证件";
                setTimeout(() => {
                    this.form = Object.assign({}, row);
                })
                this.cardTypeDisabled = true;
                // getDiningById({ id: row.id }).then(response => {
                //     if (response.success) {
                //         this.form = response.result;
                //     } else {
                //         this.$message("数据获取失败")
                //     }
                // });     //列表中没有详情信息 需要用id详情接口
            }
            this.dialog = true;
        },

        resetForm (form) {
            this.$refs[form].resetFields();
            this.form = this.$options.data().form;
            this.cardTypeDisabled = false
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
            updateCard(this.form).then(response => {
                if (response.success) {
                    this.$message("修改成功")
                    this.cancelForm()
                    this.$emit("getListInfo")
                }
                this.loading = false

            })

        },
        handleAdd () {
            addCard(this.form).then(response => {
                if (response.success) {
                    this.$message("新增成功")
                    this.cancelForm()
                    this.$emit("getListInfo")
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
                    if (this.form.totalCount < 1) {
                        this.$message("证件数量需大于零");
                        return;
                    }
                    if (this.form.effectiveTime > this.form.invalidTime) {
                        this.$message("证件生效日期需小于失效日期");
                        return;
                    }
                    if (tagVer) {
                        this.form.applicablePeopleTypes = tagVer
                    }
                    console.log(this.form)
                    this.loading = true;
                    //先根据form.id 来判断是增加还是修改  存在form.id  那么就是修改
                    if (this.form.id !== "") {
                        console.log(this.form)
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
</style>