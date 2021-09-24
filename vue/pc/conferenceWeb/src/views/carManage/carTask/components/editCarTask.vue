<template>
    <div>

        <el-drawer ref="drawer" :title="title" :before-close="handleClose" :visible.sync="dialog" direction="rtl"
            custom-class="demo-drawer" size="40%" append-to-body>
            <el-form ref="form" size="small" :model="form" label-width="120px" :rules="rules"
                :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto'}">
                <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%;width:100%">
                    <el-form-item label="任务类型" prop="type" style="width:80%">
                        <el-select v-model="form.type" placeholder="请选择" clearable style="width:100%"
                            :disabled='disabledFlag'>
                            <el-option v-for="item in taskTypeOptions" :key="item.valCode" :label="item.valName"
                                :value="item.valCode" />
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="" prop="doubleTime" style="width:80%">
                    <span slot="label"><span style="color:red">*</span> 用车时间</span>
                    <el-date-picker v-model="doubleTime" style="width:100%" type="datetimerange" range-separator="-"
                        :disabled='disabledFlag' start-placeholder="开始日期" end-placeholder="结束日期"
                        format="yyyy-MM-dd HH:mm" :default-time="configDefaultTime"
                        value-format="yyyy-MM-dd HH:mm:ss" />
                </el-form-item> -->
                    <!-- <el-form-item label="出发时间" prop="startTime" style="width:80%">
                        <el-date-picker v-model="form.startTime" type="datetime" :disabled='disabledFlag'
                            :default-time="configDefaultTime[0]" format="yyyy-MM-dd HH:mm" style="width:100%"
                            value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item> -->
                    <el-form-item :label="form.type==='1' || form.type==='' ? '接站时间':'上车时间'" prop="getOnVehicleTime"
                        style="width:80%">
                        <el-date-picker v-model="form.getOnVehicleTime" type="datetime" :disabled='disabledFlag'
                            :default-time="configDefaultTime[0]" format="yyyy-MM-dd HH:mm" style="width:100%"
                            @change="change"
                            value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item :label="form.type==='1' || form.type==='' ? '接站地点':'上车地点'" prop="startAddress"
                        style="width:80%">
                        <el-autocomplete v-model="form.startAddress" class="keepOutRight" :fetch-suggestions="querySearchAsync"
                            :disabled='disabledFlag' style="width:100%" placeholder="请输入上车地点" maxlength='20'
                            show-word-limit @select="handleSelect" />
                    </el-form-item>
                    <el-form-item label="详细位置" prop="getOnVehicleAddress" style="width:80%">
                        <el-input :disabled='disabledFlag' class="keepOutRight" v-model="form.getOnVehicleAddress" size="small"
                            maxlength="50" show-word-limit placeholder="请输入详细上车位置" />
                    </el-form-item>
                    <el-form-item :label="form.type==='2'? '返程时间':'送达时间'" prop="endTime" style="width:80%">
                        <el-date-picker v-model="form.endTime" type="datetime" :disabled='disabledFlag'
                            :default-time="configDefaultTime[1]" format="yyyy-MM-dd HH:mm" style="width:100%"
                            :picker-options="doubleTimeOptions" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item :label="form.type==='2'? '返程地点':'送达地点'" prop="endAddress" style="width:80%">
                        <el-autocomplete v-model="form.endAddress" :fetch-suggestions="querySearchAsync"
                            placeholder="请输入送达地点" class="keepOutRight" :disabled='disabledFlag' style="width:100%" maxlength="20"
                            show-word-limit @select="handleSelect" />
                    </el-form-item>
                    <!-- <el-form-item label="出发地点" prop="startAddress" style="width:80%">
                    <el-input v-model="form.startAddress" size="small" maxlength="50" show-word-limit />
                </el-form-item>
                <el-form-item label="目的地点" prop="endAddress" style="width:80%">
                    <el-input v-model="form.endAddress" size="small" maxlength="50" show-word-limit />
                </el-form-item> -->
                    <!-- <el-form-item label="联系人" prop="contactPerson" style="width:80%">
                    <el-input v-model="form.contactPerson" maxlength="30" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="contactPhone" style="width:80%">
                    <el-input v-model="form.contactPhone" maxlength="11" show-word-limit></el-input>
                </el-form-item> -->
                    <!-- <el-form-item label="车型" prop="vehicleType" style="width:80%">
                    <el-select v-model="form.vehicleType" style="width:100%" placeholder="请选择" filterable
                        :disabled='disabledFlag'>
                        <el-option v-for="item in vehicleTypeOptions" :key="item.id" :label="item.name" :value="item.id"
                            @click.native="vehicleTypeClick(item)" />
                    </el-select>
                </el-form-item>
                <el-form-item label="座位数" prop="seatNum" style="width:80%">
                    <el-input v-model="seatNum" :disabled="true" />
                </el-form-item>
                <el-form-item label="车牌号" prop="vehicleId" style="width:80%">
                    <el-select v-model="form.vehicleId" placeholder="请选择" style="width:100%" filterable clearable
                        :disabled='disabledFlag'>
                        <el-option v-for="item in vehicleOptions" :key="item.id" :label="item.platNum" :value="item.id"
                            @click.native="vehicleClick(item)" />
                    </el-select>
                </el-form-item>
                <el-form-item label="颜色" prop="vehicleColor" style="width:80%">
                    <el-input v-model="vehicleColor" size="small" :disabled="true" />
                </el-form-item>

                <el-form-item label="司机" prop="driverId" style="width:80%">
                    <el-select v-model="form.driverId" placeholder="请选择" style="width:100%" filterable
                        :disabled='driverDisabledFlag'>
                        <el-option v-for="item in driverOptions" :key="item.id" :value="item.id" :label="item.name"
                            @click.native="driverClick(item.phone)" />
                    </el-select>
                </el-form-item>
                <el-form-item label="手机" prop="driverPhone" style="width:80%">
                    <el-input v-model="driverPhone" :disabled="true" />
                </el-form-item> -->
                    <!-- <el-form-item label="任务主题" prop="title" style="width:80%">
                    <el-input v-model="form.title" maxlength="30" show-word-limit />
                </el-form-item> -->
                    <!-- <el-form-item label="自动发布任务" prop="publish">
                    <el-radio-group v-model="form.publish">
                        <el-radio v-for="item in publishOptions" :key="item.id" :label="item.id">
                            {{ item.name }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item> -->

                    <el-form-item prop="vehicleName" label="车辆信息">
                        <el-input v-model="form.vehicleName" disabled class="width360" style="width: 256px;" />
                        <el-button class="tianjiahuiyizuzhiClass" size="small" type="primary"
                            style="margin-top:5px;color:#1E89FF" @click="xuanzecheliang">选择</el-button>
                    </el-form-item>

                    <el-form-item prop="driverName" label="司机信息">
                        <el-input v-model="form.driverName" disabled class="width360" style="width: 256px;" />
                        <el-button class="tianjiahuiyizuzhiClass" size="small" type="primary"
                            style="margin-top:5px;color:#1E89FF" @click="xuanzesiji">选择</el-button>
                    </el-form-item>

                    <el-form-item label="备注" prop="description" style="width:80%">
                        <el-input v-model="form.description" type="textarea" maxlength="300" show-word-limit
                            :disabled='disabledFlag' />
                    </el-form-item>
                </el-scrollbar>

            </el-form>
            <div class="demo-drawer__footer"
                style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD">
                <el-button type="primary" :loading="loading" style="height:32px;margin-top:12px"
                    @click="onSubmit('form')">
                    保存</el-button>
                <el-button style="height:32px;margin-top:12px" @click="cancelForm">取 消</el-button>
                <el-button v-show="this.form.id" type="danger" style="height:32px;margin-top:12px" @click="cancelTask">
                    取消任务
                </el-button>
            </div>
        </el-drawer>
        <PickSpecialCar :start-time="startTime" :end-time="endTime" :dialog-visible="pickCarDialogVisible"
            @closeDialog="closePickCarDialog" />
        <PickSpecialDriver :start-time="startTime" :end-time="endTime" :dialog-visible="pickDriverDialogVisible"
            @closeDialog="closePickDriverDialog" />
    </div>

</template>

<script>
import { updateVehicleTask, addVehicleTask, getDriverList, getVehicleTypeList, getTaskVechicleList, getCarList } from '@/api/car'
import { getTableHeight } from '@/utils/index'
import { telephoneValid } from '@/utils/valid-common.js'
import { getConferenceId } from '@/utils/conference-auth'
import { getAddressListByConferenceId } from '@/api/special'
import PickSpecialCar from './pickCar'
import PickSpecialDriver from './pickDriver'


export default {
    name: '',
    components: { PickSpecialCar, PickSpecialDriver },
    // import引入的组件需要注入到对象中才能使用
    // 例如：import 《组件名称》 from '《组件路径》';
    props: {
        taskTypeOptions: {
            type: Array,
            default: ''
        }
    },
    data () {
        // 这里存放数据
        return {
            pickCarDialogVisible: false,
            pickDriverDialogVisible: false,
            startTime: '',
            endTime: '',


            form: {
                id: '',
                conferenceId: getConferenceId(),
                type: '',
                startAddress: '',
                endAddress: '',
                contactPerson: '',
                contactPhone: '',
                vehicleType: '',
                vehicleId: '',
                driverId: '',
                startTime: '',
                endTime: '',
                publish: 0,
                title: '',
                contact: false,
                getOnVehicleTime: '',
                getOnVehicleAddress: '',
                vehicleName: '',
                driverName: ''
            },
            disabledFlag: false,
            driverDisabledFlag: false,
            publishOptions: [{ 'id': 1, 'name': '是' }, { 'id': 0, 'name': '否' }],
            doubleTime: [],
            title: '',
            dialog: false,
            seatNum: '',
            driverPhone: '',
            vehicleColor: '',
            driverOptions: [],
            vehicleTypeOptions: [],
            vehicleOptions: [],
            vehicleTypeDisabled: false,
            dialogHeight: getTableHeight(35) + 'px',
            loading: false,
            editFlag: false,
            doubleTimeOptions: {
                disabledDate: (time) => {
                    return time.getTime() < (new Date(this.form.startTime).getTime() - 24 * 60 * 60 * 1000)

                }
            },
            rules: {
                type: [
                    { required: true, message: '请选择任务类型', trigger: 'blur' }
                ],
                // startTime: [
                //     { required: true, message: '请选择出发时间', trigger: 'blur' }
                // ],
                endTime: [
                    { validator: this.validEndTime, trigger: 'blur' },
                    { required: true, message: '', trigger: 'blur' }
                ],
                startAddress: [
                    { validator: this.validStartAddress, trigger: 'change' },
                    { required: true, message: '', trigger: 'change' }
                ],
                endAddress: [
                    { validator: this.validEndAddress, trigger: 'change' },
                    { required: true, message: '', trigger: 'change' }
                ],
                // contactPerson: [
                //     { required: true, message: '请输入联系人', trigger: 'blur' }
                // ],
                // contactPhone: [
                //     { required: true, message: '请输入手机号', trigger: 'blur' },
                //     telephoneValid()
                // ],
                vehicleType: [
                    { required: true, message: '请选择车辆类型', trigger: 'blur' }
                ],
                vehicleName: [
                    { required: true, message: '请选择车辆', trigger: 'blur' }
                ],
                driverName: [
                    { required: true, message: '请选择司机', trigger: 'blur' }
                ],
                getOnVehicleTime: [
                    { validator: this.validGetOnVehicleTime, trigger: 'blur' },
                    { required: true, message: '', trigger: 'blur' }
                ]
            }
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {
        'form.driverId': function (val) {
            if (val == '') {
                this.driverPhone = ''
            }
        },
        'form.description': function (val) {
            console.log(this.form)
        },
        'form.type': function (val) {
            this.$refs['form'].clearValidate()

        },

        // "form.vehicleType": function (val) {
        //     if (val == "") {
        //         this.seatNum = ""
        //     }
        //     this.form.vehicleId = ""
        // },  这里用监听导致编辑初始化页面时vehicleId赋值失败 车型为必选 去掉cleatable属性
        // 'doubleTime': {
        //     handler (newVal, oldVal) {
        //         if (newVal) {
        //             // this.vehicleTypeDisabled = false;
        //             this.form.startTime = newVal[0]
        //             this.form.endTime = newVal[1]
        //         } else {
        //             // this.vehicleTypeDisabled = true;
        //             this.form.startTime = ''
        //             this.form.endTime = ''
        //         }

        //         // 新增时初始化主题
        //         // if (!this.editFlag) {
        //         //     if (newVal !== null && newVal !== '' && newVal.length > 1) {
        //         //         this.form.title = new Date(this.doubleTime[0]).getMonth() + 1 + '月' + new Date(this.doubleTime[0]).getDate() + '日'
        //         //         if (new Date(this.doubleTime[0]).getHours() < 12) {
        //         //             this.form.title += '上午'
        //         //         } else {
        //         //             this.form.title += '下午'
        //         //         }
        //         //         if (this.form.type == 1) {
        //         //             this.form.title += '接站用车'
        //         //         }
        //         //         if (this.form.type == 2) {
        //         //             this.form.title += '送站用车'
        //         //         }
        //         //         if (this.form.type == 3) {
        //         //             this.form.title += this.getConferenceTemplate(1) + '用车'
        //         //         }
        //         //         if (this.form.type == 4) {
        //         //             this.form.title += '专车'
        //         //         }
        //         //     } else {
        //         //         this.form.title = ''
        //         //     }
        //         // }
        //     },
        //     deep: true,
        //     immediate: true
        // },
        'dialog': function (val) {
            if (val) {
                this.getDriverOptions()
                this.getVehicleTypeList()
            }
        }
    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created () {

    },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted () {
        // // this.getDriverOptions()
        // this.getVehicleTypeList()
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
    activated () { },
    // 方法集合
    methods: {
        change() {
            this.form.startTime = this.form.getOnVehicleTime
        },
        validEndTime (rule, value, callback) {
            if (this.form.type === '2') {
                var message = '返程时间'
            } else {
                var message = '送达时间'
            }

            if (value === null || value === '') {
                callback(new Error('请输入' + message))
            } else {
                callback()
            }

        },

        validEndAddress (rule, value, callback) {
            if (this.form.type === '2') {
                var message = '返程地点'
            } else {
                var message = '送达地点'
            }

            if (value === null || value === '') {
                callback(new Error('请输入' + message))
            } else {
                callback()
            }

        },

        validGetOnVehicleTime (rule, value, callback) {
            if (this.form.type === '1' || this.form.type === '') {
                var message = '接站时间'
            } else {
                var message = '上车时间'
            }

            if (value === null || value === '') {
                callback(new Error('请输入' + message))
            } else {
                callback()
            }

        },

        validStartAddress (rule, value, callback) {
            if (this.form.type === '1' || this.form.type === '') {
                var message = '接站地点'
            } else {
                var message = '上车地点'
            }

            if (value === null || value === '') {
                callback(new Error('请输入' + message))
            } else {
                callback()
            }

        },

        xuanzecheliang () {

            if (!this.form.startTime || !this.form.endTime) {
                this.$message('请先选择用车时间')
            } else {
                this.startTime = this.form.startTime
                this.endTime = this.form.endTime
                this.pickCarDialogVisible = true
            }
        },
        xuanzesiji () {
            if (!this.form.startTime || !this.form.endTime) {
                this.$message('请先选择用车时间')
            } else {
                this.startTime = this.form.startTime
                this.endTime = this.form.endTime
                this.pickDriverDialogVisible = true
            }
        },
        closePickDriverDialog (val) {
            if (val !== null) {
                this.form.driverName = val.name
                this.form.driverId = val.id
            }
            this.pickDriverDialogVisible = false
        },

        closePickCarDialog (val) {
            if (val !== null) {
                this.form.vehicleName = val.name
                this.form.vehicleId = val.id
                this.form.driverName = val.driverName
                this.form.driverId = val.driverId
            }
            this.pickCarDialogVisible = false
        },
        handleSelect () {

        },
        querySearchAsync (queryString, cb) {
            getAddressListByConferenceId({ conferenceId: getConferenceId(), addressLike: queryString }).then(res => {
                if (res.success) {
                    var list = []
                    if (res.result.list !== null && res.result.list.length > 0) {
                        res.result.list.forEach(item => {
                            list.push({ value: item })
                        })
                        clearTimeout(this.timeout)
                        this.timeout = setTimeout(() => {
                            cb(list)
                        }, 1000 * Math.random())
                    } else {
                        cb(list)
                    }

                }
            })
        },
        getAllVehicleOptions () {
            getCarList({ 'conferenceId': getConferenceId() }).then(response => {
                if (response.success) {
                    this.vehicleOptions = response.result.list
                }
            })
        },
        vehicleClick (item) {
            this.vehicleColor = item.vehicleColorStr // 选中车牌号带出颜色和车辆信息中默认的司机及司机手机号
            this.form.driverId = item.driverVO.id
            this.driverPhone = item.driverVO.phone
        },
        getVehicleOptions () {
            if (!this.form.startTime || !this.form.endTime) {
                this.$message('请先选择用车时间')
                this.form.vehicleType = ''
                this.seatNum = ''
                return
            }
            getTaskVechicleList({
                'conferenceId': this.form.conferenceId, 'vehicleTypeId': this.form.vehicleType,
                'startTime': this.form.startTime, 'endTime': this.form.endTime
            }).then(response => {
                if (response.success) {
                    this.vehicleOptions = response.result.list
                }
            })
        },
        showEdit (row) {
            if (!row) {
                this.title = '添加用车任务'
                this.editFlag = false

            } else {
                this.title = '编辑用车任务'
                this.editFlag = true
                if (row.status === 1) {
                    this.disabledFlag = true
                }
                if (row.status === 2 || row.status === -1) {
                    this.disabledFlag = true
                    this.driverDisabledFlag = true
                }
                //  this.form = row
                //    this.form = Object.assign({}, row);
                this.form = JSON.parse(JSON.stringify(row))
                this.form.contactPhone = parseInt(this.form.contactPhone)
                //  this.doubleTime = [this.form.startTime, this.form.endTime]
                this.form.vehicleType = this.form.vehicle.vehicleType
                this.seatNum = this.form.vehicle.vehicleTypeVO.seatNum
                //  this.getVehicleOptions();
                this.getAllVehicleOptions()
                this.vehicleColor = this.form.vehicle.vehicleColorStr
                this.form.driverId = this.form.driverVO.id
                this.driverPhone = this.form.driverVO.phone
                this.form.vehicleName = row.vehicle.vehicleTypeVO.name + '(' + row.vehicle.platNum + ')' + '-' + row.vehicle.vehicleTypeVO.seatNum + '座'
                this.form.driverName = row.driverVO.name

            }
            this.dialog = true
            this.$refs['form'].clearValidate()

        },

        resetForm (form) {
            this.$refs[form].resetFields()
            this.form = this.$options.data().form
            console.log('cancle' + this.form.conferenceId)
            this.seatNum = ''// 因为出现点击延迟一步问题（暂不清楚原因） 所以放在了form外面，所以手动清空
            this.driverPhone = ''
            this.vehicleColor = ''
            this.vehicleOptions = []
            this.doubleTime = []
        },
        handleClose (done) {
            // this.$confirm('确认关闭？')
            //     .then(_ => {
            //         done();
            //         this.resetForm('form')
            //         this.dialog = false
            //     })
            //     .catch(_ => { });
            done()
            this.resetForm('form')
            this.dialog = false
            this.disabledFlag = false
            this.driverDisabledFlag = false
        },
        cancelForm () {
            this.resetForm('form')
            this.dialog = false
        },
        cancelTask () {
            this.$emit('handleCommand', this.form.id)
        },

        driverClick (phone) {
            this.driverPhone = phone
        },
        vehicleTypeClick (item) {
            this.seatNum = item.seatNum
            this.form.vehicleId = ''
            this.vehicleColor = ''
            this.getVehicleOptions()// 选中车型后，根据车型筛选车辆信息
            console.log(item)
            console.log(item.id, item.name, item.seatNum)
        },
        getDriverOptions () {
            getDriverList({ conferenceId: getConferenceId() }).then(response => {
                if (response.success) {
                    this.driverOptions = response.result.list
                }
            })
        },

        getVehicleTypeList () {
            getVehicleTypeList({ conferenceId: getConferenceId() }).then(response => {
                if (response.success) {
                    this.vehicleTypeOptions = response.result.list
                }
            })
        },
        handleUpdate () {
            updateVehicleTask(this.form).then(response => {
                if (response.success) {
                    this.$message('修改成功')
                    this.cancelForm()
                    this.$emit('getListInfo')
                }
                this.loading = false
            })
        },
        handleAdd () {
            addVehicleTask(this.form).then(response => {
                if (response.success) {
                    this.$message('新增成功')
                    this.cancelForm()
                    this.$emit('getListInfo')
                }
                this.loading = false
            })
        },
        onSubmit (form) {

            //任务主题虽不显示 但是要赋值
            this.form.title = new Date(this.form.startTime).getMonth() + 1 + '月' + new Date(this.form.startTime).getDate() + '日'
            if (new Date(this.form.startTime).getHours() < 12) {
                this.form.title += '上午'
            } else {
                this.form.title += '下午'
            }
            if (this.form.type == 1) {
                this.form.title += '接站用车'
            }
            if (this.form.type == 2) {
                this.form.title += '送站用车'
            }
            if (this.form.type == 3) {
                this.form.title += this.getConferenceTemplate(1) + '用车'
            }
            if (this.form.type == 4) {
                this.form.title += '专车'
            }
            //  
            this.$refs[form].validate((valid) => {
                if (valid) {
                    if (this.form.endTime < this.form.startTime || this.form.endTime < this.form.getOnVehicleTime) {
                        this.$message('送达时间不能早于出发时间和上车时间')
                        return
                    }
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
<style lang='scss' scoped>
// @import url(); 引入公共css类
::v-deep :focus {
    outline: 0;
}

.width360 {
    width: 330px;
}
.tianjiahuiyizuzhiClass {
    width: 74px;
    height: 32px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #1e89ff;
}

// ::v-deep .el-drawer.rtl.demo-drawer {
//     overflow: scroll;
//     margin: 30px 0px;
//     width: 40% !important;
// }

// .el-drawer__body {
//     overflow: auto;
//     /* overflow-x: auto; */
// }

/*2.隐藏滚动条，太丑了*/
// .el-drawer__container ::-webkit-scrollbar {
//     display: none;
// }

// .DataBriefing .el-scrollbar__wrap {
//     overflow-x: hidden;
// }
</style>
