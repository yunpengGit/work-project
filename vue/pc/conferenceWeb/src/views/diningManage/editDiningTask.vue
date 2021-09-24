<template>
    <el-drawer ref="drawer" :title="title" :before-close="handleClose" :visible.sync="dialog" direction="rtl"
        custom-class="demo-drawer" size="40%" append-to-body>
        <el-form ref="form" size="small" :model="form" label-width="120px" :rules="rules"
            :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto'}">
            <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">

                <el-form-item label="餐厅名称" prop="diningId" style="width:80%">
                    <el-select v-model="form.diningId" placeholder="请选择" filterable style="width:100%">
                        <el-option v-for="item in diningList" :key="item.id" :value="item.id" :label="item.dinnerRoom"
                            @click.native="dinnerClick(item)" />
                    </el-select>
                </el-form-item>
                <el-form-item label="餐位数" style="width:80%">
                    <el-input v-model="seatNum" :disabled="true" />
                </el-form-item>

                <el-form-item label="用餐类型" prop="typeCode1" style="width:80%">
                    <el-select v-model="form.typeCode1" placeholder="请选择" style="width:100%">
                        <el-option v-for="item in taskTypeOptions" :key="item.typeCode" :label="item.typeCode"
                            :value="item.typeCode" @click.native="typeCodeClick(item)" />
                    </el-select>
                </el-form-item>
                <el-form-item style="width:80%" v-if="form.zidingyiFlag">
                    <el-input v-model="form.typeCode2" placeholder="请输入用餐类型名称" />
                </el-form-item>

                <el-form-item label="用餐日期" style="width:80%">
                    <span slot="label"><span style="color:red">*</span> 用餐日期</span>
                    <el-date-picker v-model="doubleDateTime" type="daterange" range-separator="至" style="width:100%"
                        start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
                </el-form-item>
                <el-form-item label="用餐时间" style="width:80%" :key='getDateTime()'>
                    <span slot="label"><span style="color:red">*</span> 用餐时间</span>
                    <el-time-select style="width:40%" placeholder="起始时间" v-model="form.startTime" is-range
                        value-format='HH:mm:ss' :picker-options="{
      start: '00:00',
      step: '00:05',
      end: '23:55'
    }">
                    </el-time-select>&nbsp;&nbsp;至&nbsp;&nbsp;
                    <el-time-select style="width:40%" value-format='HH:mm:ss' placeholder="结束时间" v-model="form.endTime"
                        :picker-options="{
      start: '00:00',
      step: '00:05',
      end: '23:55',
      minTime: form.startTime
    }">
                    </el-time-select>
                </el-form-item>
                <el-form-item label="备注" prop="description" style="width:80%">
                    <el-input v-model="form.description" type="textarea" maxlength="300" show-word-limit />
                </el-form-item>
            </el-scrollbar>
        </el-form>

        <div class="demo-drawer__footer"
            style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD">
<!--            <el-button type="primary" :loading="copyLoading" style="height:32px;margin-top:12px" v-if="editType === 'copy'" @click="onSubmit('form','saveAndSubmit')">-->
<!--                保存并发布</el-button>-->
            <el-button type="primary" :loading="loading" style="height:32px;margin-top:12px" @click="onSubmit('form','onlySave')">
                保存</el-button>
            <el-button style="height:32px;margin-top:12px" @click="cancelForm">取消</el-button>
            <el-button v-show="this.form.id && editType != 'copy'" type="danger" style="height:32px;margin-top:12px" @click="cancelTask">取消任务
            </el-button>
        </div>
    </el-drawer>
</template>

<script>
import { updateDiningTask, addDiningTask, getDiningList,copyDiningTask, getTaskTypeOptions } from '@/api/dining'
import { getTableHeight } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
export default {
    name: '',
    components: {

    },
    // import引入的组件需要注入到对象中才能使用
    // 例如：import 《组件名称》 from '《组件路径》';
    props: {

    },
    data () {
        // 这里存放数据
        return {
            form: {
                id: '',
                conferenceId: getConferenceId(), // 这里后面再改  先设置会议为1
                dinnerStartDate: null,
                dinnerEndDate: null,
                startTime: null,
                endTime: null,
                typeCode: null,
                diningId: '',
                description: '',
                zidingyiFlag: false,
                typeCode1: '',
                typeCode2: ''
            },
            taskTypeOptions: [],
            doubleDateTime: '',
            seatNum: '',
            doubleTime: '', // 这个放在里面会导致编辑页面初始化后无法编辑，所以放在了form外面，导致无法使用rule的校验  手动加吧
            title: '',
            dialog: false,
            diningList: [],
            dialogHeight: getTableHeight(35) + 'px',
            loading: false,
            rules: {
                dinnerDate: [
                    { required: true, message: '请输入用餐日期', trigger: 'blur' }
                ],
                typeCode1: [
                    { required: true, message: '请选择用餐类型', trigger: 'blur' }
                ],
                // typeCode2: [
                //     { required: true, message: '请输入自定义用餐类型', trigger: 'blur' }
                // ],

                diningId: [
                    { required: true, message: '请选择餐厅', trigger: 'blur' }
                ]
            },
            editType: '', // 用于判断是否为复制用餐计划
            copyLoading: false 
        }
    },
    // 监听属性 类似于data概念
    computed: {

    },
    // 监控data中的数据变化
    watch: {
        'doubleDateTime': {
            handler (newVal, oldVal) {
                if (newVal) {
                    this.form.dinnerStartDate = newVal[0]
                    this.form.dinnerEndDate = newVal[1]
                } else {
                    this.form.dinnerStartDate = ''
                    this.form.dinnerEndDate = ''
                }
            },
            deep: true,
            immediate: true
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
    activated () { },
    // 方法集合
    methods: {
        getDateTime () {
            return new Date().getTime()   //上面组件拿到数据没有渲染  加个key
        },
        cancelTask () {
            this.$emit('handleCommand', this.form.id)
        },
        dinnerDateClick () {
            this.form.diningId = ''
            this.seatNum = ''
            this.doubleTime = ''
        },
        typeCodeClick (item) {
            if (item.typeCode === '自定义') {
                this.form.zidingyiFlag = true
                this.form.startTime = '07:00'
                this.form.endTime = '08:00'
                return
            }
            if (item.typeCode === '早餐') {
                this.form.zidingyiFlag = false
                this.form.startTime = '07:00'
                this.form.endTime = '08:00'
                return
            }
            if (item.typeCode === '午餐') {
                this.form.zidingyiFlag = false
                this.form.startTime = '11:00'
                this.form.endTime = '12:00'
                return
            }
            if (item.typeCode === '晚餐') {
                this.form.zidingyiFlag = false
                this.form.startTime = '17:00'
                this.form.endTime = '18:00'
                return
            }
            this.form.zidingyiFlag = false
            this.form.startTime = '07:00'
            this.form.endTime = '08:00'
        },
        dinnerClick (item) {
            this.seatNum = item.seatNum
        },
        getDiningList () {
            var params = { 'conferenceId': this.form.conferenceId }
            getDiningList(params).then(response => {
                if (response.success) {
                    this.diningList = response.result.list
                }
            })
        },
        getTaskTypeOptions (param) {
            getTaskTypeOptions(param).then(response => {
                if (response.success) {
                    this.taskTypeOptions = response.result;
                    var a = { 'typeCode': '自定义' }
                    this.taskTypeOptions.push(a)
                }
            })
        },
        showEdit (row , type) {
            this.editType = type
            this.getDiningList();
            this.getTaskTypeOptions({ 'conferenceId': this.form.conferenceId })
            if (!row) {
                this.title = '添加用餐任务'
            } else {
                this.title = '编辑用餐任务'
                this.form = Object.assign({}, row)
                this.form.typeCode1 = this.form.typeCode;
                console.log('diningid' + this.form.diningId)
                this.doubleDateTime = [this.form.dinnerStartDate, this.form.dinnerEndDate]

                this.form.startTime = this.form.startTime.slice(0, 5);
                this.form.endTime = this.form.endTime.slice(0, 5)

                this.seatNum = this.form.dining.seatNum
            }
            this.dialog = true
        },

        resetForm (form) {
            this.$refs[form].resetFields()
            this.form = this.$options.data().form
            this.seatNum = ''
            this.doubleDateTime = ''
            this.form.startTime = null
            this.form.endTime = null
            console.log('cancle' + this.form.conferenceId)
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
            updateDiningTask(this.form).then(response => {
                if (response.success) {
                    this.$message('修改成功')
                    this.cancelForm()
                    this.$emit('getListInfo')
                }
                this.loading = false
            })
        },

        // 复制用餐计划
        handleCopy (saveTag) {
            // isPublish=false 保存 isPublish=true 保存并提交
            this.form.taskId = this.form.id
            if(saveTag==='saveAndSubmit') {
                this.form.isPublish= 1;
            }else {
                this.form.isPublish = 0
            }
            copyDiningTask(this.form).then(response => {
                if (response.success) {
                    this.$message.success('操作成功')
                    this.cancelForm()
                    this.$emit('getListInfo')
                }
            if(saveTag==='saveAndSubmit') {
                this.copyLoading= false;
            }else {
                this.loading = false
            }
            })
        },

        handleAdd () {

            addDiningTask(this.form).then(response => {
                if (response.success) {
                    this.$message('新增成功')
                    this.cancelForm()
                    this.$emit('getListInfo')
                }
                this.loading = false
            })
        },
        onSubmit (form, saveTag) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    // if (!this.form.startTime ) {
                    //     this.$message('用选择用餐时间')
                    //     return
                    // }
                    if (this.form.startTime > this.form.endTime) {
                        this.$message("用餐的开始时间不能晚于结束时间")
                        return
                    }
                    if (this.form.typeCode1 === '自定义') {
                        if (this.form.typeCode2 === '' || this.form.typeCode2 === null) {
                            this.$message("请输入自定义类型名称")
                            return
                        }
                        this.form.typeCode = this.form.typeCode2
                    } else {
                        this.form.typeCode = this.form.typeCode1
                    }
                    if (!this.doubleDateTime) {
                        this.$message("请选择用餐日期")
                        return
                    }
                    if (!this.form.startTime || !this.form.endTime) {
                        this.$message("请选择用餐时间")
                        return
                    }
                    this.form.startTime = this.form.startTime + ':00'
                    this.form.endTime = this.form.endTime + ':00'
                    if (this.form.typeCode1 === '自定义') {
                        if (this.form.typeCode2 === '' || this.form.typeCode2 === null) {
                            this.$message("请输入自定义类型名称")
                            return
                        }
                        this.form.typeCode = this.form.typeCode2
                    } else {
                        this.form.typeCode = this.form.typeCode1
                    }
                    if(saveTag==='saveAndSubmit') {
                        this.copyLoading= true;
                    }else {
                        this.loading = true
                    }
                    // 先根据form.id 来判断是增加还是修改  存在form.id且editType不为"copy"  那么就是修改
                    if (this.form.id !== '') {
                        if(this.editType === 'copy') {
                            this.handleCopy(saveTag)
                        }else {
                            this.loading = true
                            this.handleUpdate()
                        }
                        console.log(this.form)
                    } else { // 新增餐厅
                        this.loading = true
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
