<template>
    <el-drawer ref="drawer" :title="title" :before-close="handleClose" :visible.sync="dialog" direction="rtl"
        custom-class="demo-drawer" size="40%">
        <el-form ref="form" size="small" :model="form" label-width="120px" :rules="rules"
            :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto'}">
            <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                <el-form-item label="酒店名称" prop="hotelId" style="width:80%">
                    <el-select v-model="form.hotelId" placeholder="请选择" clearable filterable style="width:100%">
                        <el-option v-for="item in hotelOptions" :key="item.id" :label="item.name" :value="item.id"
                            @click.native="hotelClick(item)" />
                    </el-select>
                </el-form-item>
                <el-form-item label="房型名称" prop="modelId" style="width:80%">
                    <el-select v-model="form.modelId" placeholder="请选择" clearable filterable style="width:100%">
                        <el-option v-for="item in roomFormOptions" :key="item.id" :label="item.modelName"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="添加方式" prop="addType" style="width:80%">
                    <el-radio-group v-model="form.addType">
                        <el-radio :label="1">单个添加</el-radio>
                        <el-radio :label="2">批量添加</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item v-if="form.addType === 1" label="房间号" prop="roomNo" style="width:80%">
                    <el-input class="keepOutRight" v-model="form.roomNo" maxlength="20" show-word-limit />
                </el-form-item>

                <el-form-item v-if="form.addType === 2" label="房间数量" prop="roomCount" style="width:80%">
                    <el-input v-model="form.roomCount" maxlength="20" show-word-limit />
                </el-form-item>

                <el-form-item label="房间位置" style="width:80%">
                    <el-input v-model="form.description" type="textarea" maxlength="300" show-word-limit />
                </el-form-item>
                <el-form-item label="房间描述" style="width:80%">
                    <el-input v-model="form.remark" type="textarea" maxlength="300" show-word-limit />
                </el-form-item>
                <el-form-item label="可用时间" prop="doubleTime" style="width:80%">
                    <!-- <div v-for="(userDate,index) in form.userDates" :key="userDate+index" style="height:45px">
                        <el-date-picker
                            v-model="userDate.useDate"
                            type="date"
                            placeholder="选择日期"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd"
                        />

                        <el-button
                            icon="el-icon-delete"
                            style="margin-left:5px;margin-top:3px"
                            @click.prevent="remove(index)"
                        />
                    </div> -->

                    <el-date-picker v-model="doubleTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="daterange"
                        range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"
                        size="small" style="width:70%" />
                    <el-button size="small" style="margin-top:5px;color:#1E89FF" @click="addtime"><i
                            class="el-icon-plus" /> 添加</el-button>
                </el-form-item>
                <div
                    style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px;margin-left:50px">
                    <el-table ref="table" :data="form.userDates" style="width: 80%" :height="tableHeight"
                        :header-cell-style="{
                            background:'#f7f7f7'
                        }">

                        <el-table-column label="可用时间">
                            <template slot-scope="scope">
                                {{ scope.row.useDate }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="remove(scope.$index)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
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

import { updateRoom, addRoom, getRoomById, getRoomFormByHotelId } from '@/api/hotel'
import { getTableHeight, getDateStr } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
import { num2Valid } from '@/utils/valid-common.js'
export default {
    name: '',
    // import引入的组件需要注入到对象中才能使用
    // 例如：import 《组件名称》 from '《组件路径》';
    components: {},
    props: {

        hotelOptions: {
            type: Array,
            default: []
        }
    },
    data () {
        var validateRoomCount = (rule, value, callback) => {
            if (this.form.addType === 2) {
                if (value === '') {
                    callback(new Error('房间数量不能为空'))
                } else {
                    if (!(/^(([1-9]{1}\d*)|(0{1}))?$/.test(value))) {
                        callback(new Error('请输入整数'))
                    } else {
                        callback()
                    }

                    callback()
                }
            } else {
                callback()
            }
        }

        // 这里存放数据
        return {
            form: {
                id: '',
                conferenceId: getConferenceId(), // 这里后面再改  先设置会议为1
                roomNo: '',
                hotelId: '',
                modelId: '',
                description: '',
                addType: 1,
                roomCount: '',
                userDates: [],
                remark: ''
            },
            //     pageUserDates: [],
            roomFormOptions: [],
            doubleTime: '',
            tempStartTime: '',
            tempEndTime: '',
            title: '',
            dialog: false,
            tableHeight: getTableHeight(260) + 'px',
            dialogHeight: getTableHeight(35) + 'px',
            loading: false,
            rules: {
                hotelId: [
                    { required: true, message: '请选择酒店', trigger: 'blur' }
                ],
                modelId: [
                    { required: true, message: '请选择房型', trigger: 'blur' }
                ],
                roomCount: [
                    { validator: validateRoomCount, trigger: 'blur' }
                ]
            }
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {

        'doubleTime': {
            handler (newVal, oldVal) {
                if (newVal) {
                    this.tempStartDate = newVal[0]
                    this.tempEndDate = newVal[1]
                } else {
                    this.tempStartDate = ''
                    this.tempEndDate = ''
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
    activated () { },
    // 方法集合
    methods: {

        hotelClick (item) {
            this.form.modelId = ''
            this.getRoomFormByHotelId(item.id)
        },
        remove (index) {
            this.form.userDates.splice(index, 1)
        },
        getRoomFormByHotelId (val) {
            getRoomFormByHotelId({ 'hotelId': val }).then(res => {
                if (res.success) {
                    this.roomFormOptions = res.result
                }
            })
        },

        addtime () {
            if (this.tempStartDate.length <= 0) {
                this.$message('请选择可用起始时间')
                return false
            }

            if (this.tempEndDate.length <= 0) {
                this.$message('请选择可用截止时间')
                return false
            }

            const alreadyExistsArry = []
            for (const item of this.form.userDates) {
                alreadyExistsArry.push(item.useDate)
            }

            const dateStr = getDateStr(this.tempStartDate, this.tempEndDate, 0)
            dateStr.split(',').forEach(item1 => {
                const tempObj = { 'useDate': item1 }
                if (alreadyExistsArry.indexOf(item1) < 0) {
                    this.form.userDates.push(tempObj)
                }
            })
            this.doubleTime = ''
        },

        showAdd (row) {
            if (!row) {
                this.title = '添加房间信息'
            } else {
                this.title = '编辑房间信息'

                getRoomById({ 'id': row.id }).then(res => {
                    if (res.success) {
                        this.form = res.result
                        this.form.modelId = res.result.roomFormVO.id
                        this.form.hotelId = res.result.roomFormVO.hotelVO.id
                        this.getRoomFormByHotelId(this.form.hotelId)
                    }
                })
            }
            this.dialog = true
        },
        resetForm (form) {
            this.roomFormOptions = []
            this.$refs[form].resetFields()
            this.form = this.$options.data().form
        },
        handleClose (done) {
            done()
            this.resetForm('form')
            this.doubleTime = ''
            this.tempStartTime = ''
            this.tempEndTime = ''
            this.dialog = false
        },
        cancelForm () {
            this.resetForm('form')
            this.doubleTime = ''
            this.tempStartTime = ''
            this.tempEndTime = ''
            this.dialog = false
        },

        handleUpdate () {
            updateRoom(this.form).then(response => {
                if (response.success) {
                    this.$message('修改成功')
                    this.cancelForm()
                    this.$emit('getListInfo')
                }
                this.loading = false
            })
        },
        handleAdd () {
            console.log(this.form.userDates)
            addRoom(this.form).then(response => {
                console.log('two')
                if (response.success) {
                    this.$message('新增成功')
                    this.cancelForm()
                    this.$emit('getListInfo')
                }
                this.loading = false
                console.log(this.form)
            })
        },
        onSubmit (form) {
            // console.log(this.form)
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.form.userDates = this.quchong(this.form.userDates)
                    this.form.userDates = this.form.userDates.filter(item => item.useDate !== '')
                    this.loading = true
                    //     this.pageDatesToFormDates();
                    // 先根据form.id 来判断是增加还是修改  存在form.id  那么就是修改
                    if (this.form.id !== '') {
                        console.log(this.form)
                        this.handleUpdate()
                    } else { // 新增餐厅
                        console.log('one')
                        this.handleAdd()
                        console.log('three')
                        console.log(this.loading)//
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        quchong (param) {
            const map = new Map()
            for (const item of param) {
                if (!map.has(item)) {
                    map.set(item, item)
                }
            }
            return [...map.values()]
        }
    }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
</style>
