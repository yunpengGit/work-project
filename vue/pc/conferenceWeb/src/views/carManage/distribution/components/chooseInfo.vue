<template>

    <el-drawer ref="drawer" :title="title" :before-close="handleClose" :visible.sync="dialog" direction="rtl"
        custom-class="demo-drawer" size="45%" append-to-body>
        <el-form ref="form" size="small" :model="form" label-width="140px" label-position="left" :rules="rules"
            :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto','margin-left':'30px','margin-top':'-15px'}">
            <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                <!-- <el-form-item v-if="carFlag" style="width:80%">
                    <span slot="label" style="font-size:18px;color:black">任务信息</span>
                </el-form-item> -->
                <el-form-item label="车辆信息" style="width:80%">
                    <span>{{ this.form.carInfo }}</span>
                </el-form-item>
                <!-- 20210509 -->
                <el-form-item label="车辆描述" prop="description" style="width:80%">
                    <!-- <el-input v-model="form.description" type="textarea" size="small" maxlength="300" show-word-limit
                        placeholder="" /> -->
                    <span>{{ this.form.description ? this.form.description:'无' }}</span>
                </el-form-item>
                <el-form-item v-if="!carFlag" label="可用座位数" style="width:80%">
                    <span>{{ this.form.remainCount }}</span>
                </el-form-item>
                <el-form-item v-if="!carFlag" label="司机" style="width:80%">
                    <span>{{ this.form.driverInfo }}</span>
                </el-form-item>
                <el-form-item v-if="carFlag" label="" style="width:80%" prop="driverId">
                    <span slot="label"><span style="color:red">*</span> 司机</span>
                    <el-select v-model="form.driverId" placeholder="请选择" style="width:100%">
                        <el-option v-for="item in driverOptions" :key="item.id" :value="item.id" :label="item.name" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="!carFlag" label="出发时间" style="width:80%">
                    <span v-if="this.form.startTime">{{ this.form.startTime.slice(0,16) }}</span>
                </el-form-item>
                <el-form-item v-if="carFlag" label="出发时间" prop="startTime" style="width:80%">
                    <span slot="label"><span style="color:red">*</span> 出发时间</span>
                    <el-date-picker v-model="form.startTime" type="datetime" :default-time="configDefaultTime[0]"
                        format="yyyy-MM-dd HH:mm" style="width:100%" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item v-if="!carFlag" :label="flag==='pickUp'?'接站时间':'上车时间'" style="width:80%">
                    <span v-if="this.form.getOnVehicleTime">{{ this.form.getOnVehicleTime.slice(0,16) }}</span>
                </el-form-item>
                <el-form-item v-if="carFlag" label="" prop="startTime" style="width:80%">
                    <span slot="label"><span style="color:red">*</span> {{flag==='pickUp'?'接站时间':'上车时间'}}</span>
                    <el-date-picker v-model="form.getOnVehicleTime" type="datetime" :default-time="configDefaultTime[0]"
                        format="yyyy-MM-dd HH:mm" style="width:100%" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <!-- <el-form-item v-if="carFlag" label="" style="width:80%" prop="doubleTime">
                    <span slot="label"><span style="color:red">*</span> 用车时间</span>
                    <el-date-picker v-model="form.doubleTime" type="datetimerange" range-separator="-"
                        start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd HH:mm"
                        :default-time="configDefaultTime" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" />
                </el-form-item> -->
                <el-form-item v-if="!carFlag" :label="flag==='pickUp'?'接站地点':'上车地点'" style="width:80%">
                    <span>{{ this.form.startAddress }}</span>
                </el-form-item>
                <!-- <el-form-item v-if="carFlag" label="" style="width:80%" prop="startAddress">
                    <span slot="label"><span style="color:red">*</span> 出发地点</span>
                    <el-input v-model="form.startAddress" size="small" maxlength="50" show-word-limit />
                </el-form-item> -->
                <el-form-item v-if="carFlag" label="" prop="startAddress" style="width:80%">
                    <span slot="label"><span style="color:red">*</span> {{flag==='pickUp'?'接站地点':'上车地点'}}</span>
                    <el-autocomplete v-model="form.startAddress" :fetch-suggestions="querySearchAsync" class="keepOutRight"
                        style="width:100%" placeholder="出发地点" maxlength="20" show-word-limit @select="handleSelect" />
                </el-form-item>
                <el-form-item v-if="!carFlag" label="详细位置" style="width:80%">
                    <span>{{ this.form.getOnVehicleAddress?this.form.getOnVehicleAddress:'无' }}</span>
                </el-form-item>
                <el-form-item v-if="carFlag" label="详细位置" prop="getOnVehicleAddress" style="width:80%">
                    <el-input v-model="form.getOnVehicleAddress" class="keepOutRight" size="small" maxlength="50" show-word-limit
                        placeholder="请输入详细上车位置" />
                </el-form-item>

                <el-form-item v-if="!carFlag" :label="flag==='pickOut'?'返程时间':'送达时间'" style="width:80%">

                    <span v-if="this.form.endTime">{{ this.form.endTime.slice(0,16) }}</span>
                </el-form-item>
                <el-form-item v-if="!carFlag" :label="flag==='pickOut'?'返程地点':'送达地点'" style="width:80%">
                    <span>{{ this.form.endAddress }}</span>
                </el-form-item>
                <el-form-item v-if="carFlag" label="送达时间" prop="endTime" style="width:80%">
                    <span slot="label"><span style="color:red">*</span> {{flag==='pickOut'?'返程时间':'送达时间'}}</span>
                    <el-date-picker v-model="form.endTime" type="datetime" :default-time="configDefaultTime[1]"
                        format="yyyy-MM-dd HH:mm" style="width:100%" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item v-if="carFlag" label="" prop="endAddress" style="width:80%">
                    <span slot="label"><span style="color:red">*</span> {{flag==='pickOut'?'返程地点':'送达地点'}}</span>
                    <el-autocomplete class="keepOutRight" v-model="form.endAddress" :fetch-suggestions="querySearchAsync" placeholder="送达地点"
                        style="width:100%" maxlength="20" show-word-limit @select="handleSelect" />
                </el-form-item>

                <!-- <el-form-item v-if="carFlag" label="任务主题" prop="title" style="width:80%">
                    <el-input v-model="form.title" maxlength="30" show-word-limit />
                </el-form-item> -->
                <!-- <el-form-item v-if="carFlag" style="width:80%">
                    <span slot="label" style="font-size:18px;color:black">乘车人信息</span>
                </el-form-item> -->
                <el-form-item label="乘车人" style="width:80%">
                    <span>{{ this.form.attendeeName }}</span>
                </el-form-item>
                <!-- <el-form-item label="手机号" style="width:80%">
                    <span>{{this.form.attendeePhone}}</span>
                </el-form-item> -->
                <el-form-item label="" prop="contact">
                    <span slot="label"><span style="color:red">*</span> 联系方式</span>
                    <el-radio-group v-model="form.contact">
                        <el-radio :label="true">乘车人</el-radio>
                        <el-radio :label="false">指定联系人</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="form.contact === false" label="" prop="name" style="width:80%">
                    <span slot="label">联系人姓名</span>
                    <el-input class="keepOutRight" v-model="form.name" show-word-limit maxlength="30" placeholder="联系人姓名" />
                </el-form-item>
                <el-form-item v-if="form.contact === false" label="" prop="phone" style="width:80%">
                    <span slot="label"> 联系人电话</span>
                    <el-input class="keepOutRight" v-model="form.phone" show-word-limit maxlength="11" placeholder="联系人电话" />
                </el-form-item>
                <!-- <el-form-item label="联系人姓名" prop="type" style="width:80%">
                    <el-input v-model="form.name" maxlength="30" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="联系人电话" prop="type" style="width:80%">
                    <el-input v-model="form.phone" maxlength="11" show-word-limit></el-input>
                </el-form-item> -->
                <!-- <el-form-item label="自动发布任务" prop="publish" v-if="carFlag">
                    <el-radio-group v-model="form.publish">
                        <el-radio v-for="item in publishOptions" :key="item.id" :label="item.id">
                            {{item.name}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item> -->
                <!-- <attendeeTable ref="attendeeTable" v-if="!carFlag">   //无法调用里面showdialog方法
                </attendeeTable> -->
                <div v-if="!carFlag">

                    <div style="background-color: white;padding-left:0px;padding-top:10px;padding-right: 30px">

                        <el-table ref="table" :data="vehicleTaskAttendeeList" style="width: 100%" :height="tableHeight"
                            :row-class-name="tableRowClassName" :header-cell-style="{
                                background:'#f7f7f7'
                            }">
                            <el-table-column :label="getConferenceTemplate(2) + '信息'" align="left" width="153px">
                                <template slot-scope="scope">
                                    <div style="height:32px">
                                        <img style="width:32px;height:32px;float:left;border-radius:50%"
                                            :src="imagePath + (scope.row.fixAttributeCommonVO.photoUrl!== null && scope.row.fixAttributeCommonVO.photoUrl !== '' ? scope.row.fixAttributeCommonVO.photoUrl : defaultPhoto)">
                                        <span style="margin-top:8px;margin-left:5px;float:left"
                                            :title="scope.row.fixAttributeCommonVO.attendeeName">{{ scope.row.fixAttributeCommonVO.attendeeName != null && scope.row.fixAttributeCommonVO.attendeeName.length > 4 ? scope.row.fixAttributeCommonVO.attendeeName.substr(0,4) + '...' : scope.row.fixAttributeCommonVO.attendeeName }}</span>
                                        <!-- <span v-if="scope.row.fixAttributeCommonVO.honourFlag === 1"
                                    style="margin-top:8px;float:left">（主宾）</span>
                                <span v-else style="margin-top:8px;float:left">（随员）</span> -->
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="职务">
                                <template slot-scope="scope">
                                    <div :title="scope.row.fixAttributeCommonVO.position" class="content1">
                                        {{ scope.row.fixAttributeCommonVO.position }}</div>
                                </template>
                            </el-table-column>

                            <el-table-column label="手机">
                                <template slot-scope="scope">
                                    <div :title="scope.row.fixAttributeCommonVO.phone">
                                        {{ scope.row.fixAttributeCommonVO.phone }}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="单位简称/全称">
                                <template slot-scope="scope">
                                    <div>
                                        {{ formatTableCellData(formatOrgName(scope.row.fixAttributeCommonVO.organizationSortName,scope.row.fixAttributeCommonVO.organizationName)) }}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="120px">
                                <template slot-scope="scope">
                                    <el-button size="mini" @click="handleRemoveWithConfirm(scope.$index, scope.row)">移除
                                    </el-button>

                                </template>
                            </el-table-column>
                        </el-table>

                    </div>
                </div>
            </el-scrollbar>

        </el-form>
        <div class="demo-drawer__footer"
            style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD">
            <el-button type="primary" v-if="!carFlag" :loading="loading" style="height:32px;margin-top:12px;"
                @click="addTask()">
                创建新任务</el-button>
            <el-button type="primary" :loading="loading" style="height:32px;margin-top:12px;" @click="onSubmit('form')">
                确认选择</el-button>
            <el-button style="height:32px;margin-top:12px" @click="cancelForm">取 消</el-button>

        </div>

    </el-drawer>

</template>

<script>
import { updateVehicleTask, getDriverList } from '@/api/car'
import { getTableHeight } from '@/utils/index'
import { telephoneValid } from '@/utils/valid-common.js'
import { getConferenceId } from '@/utils/conference-auth'
import attendeeTable from './attendeeList'
import { getVehicleTaskAttendeeList, deleteVehicleTaskAttendee } from '@/api/car'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
import { getAddressListByConferenceId } from '@/api/special'

export default {
    name: '',
    components: { attendeeTable },
    // import引入的组件需要注入到对象中才能使用
    // 例如：import 《组件名称》 from '《组件路径》';
    props: {
        attendeeList: {
            type: Array,
            default: []
        },
        flag: {
            type: String,
            default: ''
        }
    },
    data () {
        // 这里存放数据
        return {
            form: {
                taskId: '',
                name: '',
                phone: '',
                carInfo: '',
                driverInfo: '',
                startTime: '',
                endTime: '',
                startAddress: '',
                endAddress: '',
                attendeeName: '',
                attendeePhone: '',
                driverId: '',
                doubleTime: [],
                vehicleId: '',
                contact: true,
                publish: 0,
                title: '',
                remainCount: "",
                getOnVehicleTime: '',
                getOnVehicleAddress: '',
                description: ''


            },
            carFlag: false,
            title: '',
            row: "",
            dialog: false,
            driverOptions: [],
            dialogHeight: getTableHeight(20) + 'px',
            loading: false,
            publishOptions: [{ 'id': 1, 'name': '是' }, { 'id': 0, 'name': '否' }],
            //
            paramData: {
                conferenceId: getConferenceId(),
                taskId: '',
                pageSize: 99,
                pageNum: 1

            },
            vehicleTaskAttendeeList: [],
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
            imagePath: getOssBaseUrl(),
            tableHeight: getTableHeight(160),
            rules: {

                // driverId: [
                //     { validator: this.driverIdValidator, message: '请选择司机', trigger: 'blur' }
                // ],
                // contact: [
                //     { validator: this.contactValidator, message: '请选择联系方式', trigger: 'blur' }
                // ],
                // doubleTime: [
                //     { validator: this.doubleTimeValidator, message: '请选择用车时间', trigger: 'blur' }
                // ],
                // startAddress: [
                //     { validator: this.startAddressValidator, message: '请输入出发地点', trigger: 'blur' }
                // ],
                // endAddress: [
                //     { validator: this.endAddressValidator, message: '请输入到达地点', trigger: 'blur' }
                // ],
                // name: [
                //     { validator: this.nameValidator, message: '请输入联系人姓名', trigger: 'blur' }
                // ],
                // phone: [
                //     { validator: this.phoneValidator, message: '请输入联系人手机号', trigger: 'blur' }
                // ]
            }
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {
        'form.doubleTime': {
            handler (newVal, oldVal) {
                if (newVal) {
                    // this.vehicleTypeDisabled = false;
                    this.form.startTime = newVal[0]
                    this.form.endTime = newVal[1]
                } else {
                    // this.vehicleTypeDisabled = true;
                    this.form.startTime = ''
                    this.form.endTime = ''
                }

                // if (newVal !== null && newVal !== '' && newVal.length > 1) {
                //     this.form.title = new Date(this.form.doubleTime[0]).getMonth() + 1 + '月' + new Date(this.form.doubleTime[0]).getDate() + '日'
                //     if (new Date(this.form.doubleTime[0]).getHours() < 12) {
                //         this.form.title += '上午'
                //     } else {
                //         this.form.title += '下午'
                //     }
                //     if (this.flag === 'pickUp') {
                //         this.form.title += '接站用车'
                //     }
                //     if (this.flag === 'pickOut') {
                //         this.form.title += '送站用车'
                //     }
                //     if (this.flag === 'meeting') {
                //         this.form.title += this.getConferenceTemplate(1) + '用车'
                //     }
                // } else {
                //     this.form.title = ''
                // }
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
        // this.getDriverOptions();
        // this.getVehicleTypeList();
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
        addTask () {
            this.form = this.$options.data().form
            this.carFlag = false
            this.showDialog(this.row, true)
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
                        // cb(list)
                    } else {
                        cb(list)
                    }
                }
            })
        },
        handleRemoveWithConfirm (index, row) {
            this.$confirm('请确认是否从当前任务中移除' + row.fixAttributeCommonVO.attendeeName + '？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.handleRemove(index, row)
            }).catch(() => { })
        },
        handleRemove (index, row) {
            var param = {
                'taskId': this.paramData.taskId,
                'attendees': [{ 'id': row.id }]
            }
            deleteVehicleTaskAttendee(param).then(res => {
                if (res.success) {
                    this.$message('操作成功')
                    this.paramData.pageNum = 1
                    this.getListInfo(this.paramData)
                }
            })
        },
        initAttendeeList (row) {
            if (!row) {
                this.$message('未接收到任务id')
            } else {
                this.vehicleTaskAttendeeList = []
                this.paramData.taskId = row.taskId
                this.paramData.attendeeRoleFlagEqual = [0, 1, 2, 3, 4]
                this.getListInfo(this.paramData)
            }
        },
        tableRowClassName ({ row, rowIndex }) {
            const index = rowIndex + 1
            if (index % 2 == 0) {
                return 'warning-row'
            }
        },
        getListInfo (param) {
            getVehicleTaskAttendeeList(param).then(response => {
                if (response.success) {
                    console.log('getVehicleTaskAttendeeList' + response.result.list)
                    this.vehicleTaskAttendeeList = response.result.list
                    this.paramData = param
                }
            })
        },
        // async phoneValidator (rule, value, callback) {

        //     if (value) {
        //         callback()
        //     } else {
        //         callback(new Error('请输入联系人电话号码'))
        //     }
        // },

        // async nameValidator (rule, value, callback) {

        //     if (value) {
        //         callback()
        //     } else {
        //         callback(new Error('请输入联系人姓名'))
        //     }
        // },

        // async endAddressValidator (rule, value, callback) {
        //     if (this.carFlag) {
        //         if (value) {
        //             callback()
        //         } else {
        //             callback(new Error('请输入到达地点'))
        //         }
        //     } else {
        //         callback()
        //     }

        // },
        // async startAddressValidator (rule, value, callback) {
        //     if (this.carFlag) {
        //         if (value) {
        //             callback()
        //         } else {
        //             callback(new Error('请输入出发地点'))
        //         }
        //     } else {
        //         callback()
        //     }

        // },
        // async doubleTimeValidator (rule, value, callback) {
        //     if (this.carFlag) {
        //         if (value) {
        //             callback()
        //         } else {
        //             callback(new Error('请选择用车时间'))
        //         }
        //     } else {
        //         callback()
        //     }

        // },
        // async contactValidator (rule, value, callback) {
        //     if (value === null || value === "") {
        //         callback(new Error('请选择联系人'))
        //     } else {
        //         callback()
        //     }
        // },

        // async driverIdValidator (rule, value, callback) {
        //     if (this.carFlag) {
        //         if (value) {
        //             callback()
        //         } else {
        //             callback(new Error('请选择司机'))
        //         }
        //     } else {
        //         callback()
        //     }

        // },
        cancelForm () {
            // this.$refs['form'].resetFields();
            this.form = this.$options.data().form
            this.dialog = false
            this.carFlag = false
        },
        getDriverOptions () {
            getDriverList({ conferenceId: getConferenceId() }).then(response => {
                if (response.success) {
                    this.driverOptions = response.result.list
                }
            })
        },
        handleClose (done) {
            done()
            //    this.$refs['form'].resetFields();
            this.form = this.$options.data().form
            this.dialog = false
            this.carFlag = false
        },
        handleClose2 () {
            //   this.$refs['form'].resetFields();
            this.form = this.$options.data().form
            this.dialog = false
            this.carFlag = false
        },
        showDialog (row, flag) {
            this.row = row;
            if (!row.taskId || flag) {
                this.getDriverOptions()
                this.carFlag = true
                this.title = '添加用车任务'
                if (row.vehicleVO.driverVO) {
                    this.form.driverId = row.vehicleVO.driverVO.id
                }
                if (this.flag === 'pickUp' && this.attendeeList[0].attendee.fixAttributeCommonVO.arriveTime) {
                    this.form.endTime = this.format(new Date(this.attendeeList[0].attendee.fixAttributeCommonVO.arriveTime).getTime() + 60 * 60 * 2 * 1000)
                    this.form.startTime = this.format(new Date(this.attendeeList[0].attendee.fixAttributeCommonVO.arriveTime).getTime() - 60 * 60 * 2 * 1000)
                    //  this.form.doubleTime = [this.form.startTime, this.form.endTime]
                    this.form.getOnVehicleTime = this.attendeeList[0].attendee.fixAttributeCommonVO.arriveTime
                }
                if (this.flag === 'pickOut' && this.attendeeList[0].attendee.fixAttributeCommonVO.returnTime) {
                    this.form.endTime = this.attendeeList[0].attendee.fixAttributeCommonVO.returnTime
                    this.form.startTime = this.format(new Date(this.form.endTime).getTime() - 60 * 60 * 3 * 1000)
                    //    this.form.doubleTime = [this.form.startTime, this.form.endTime]
                }
                if (this.flag === 'pickUp') {
                    this.form.startAddress = this.attendeeList[0].attendee.fixAttributeCommonVO.arriveStation
                }
                if (this.flag === 'pickOut') {
                    this.form.endAddress = this.attendeeList[0].attendee.fixAttributeCommonVO.returnStation
                }

                this.form.vehicleId = row.vehicleVO.id
                this.dialog = true
                if (row.vehicleVO) {
                    this.form.carInfo = row.vehicleVO.vehicleTypeVO.name + ' (' + row.vehicleVO.platNum + ') ' + ' ' + row.vehicleVO.vehicleTypeVO.seatNum + '座'
                    this.form.description = row.vehicleVO.description
                }
                this.form.attendeeName = []
                this.attendeeList.forEach(item => {
                    this.form.attendeeName.push(item.attendee.fixAttributeCommonVO.attendeeName + '(' + item.attendee.fixAttributeCommonVO.phone + ')')
                })
                this.form.attendeeName = this.form.attendeeName.join(',')

                // this.form.attendeePhone = [];
                // this.attendeeList.forEach(item => {
                //     this.form.attendeePhone.push(item.attendee.fixAttributeCommonVO.phone)
                // })
                // this.form.attendeePhone = this.form.attendeePhone.join(',');
            } else {
                this.form.taskId = row.vehicleTaskVO.id
                this.dialog = true
                // this.carFlag = false;
                // this.showAttendeeDialog(1, row);
                this.title = '用车任务信息'
                this.initAttendeeList(row)
                if (row.vehicleVO) {
                    this.form.carInfo = row.vehicleVO.vehicleTypeVO.name + ' (' + row.vehicleVO.platNum + ') ' + ' ' + row.vehicleVO.vehicleTypeVO.seatNum + '座'
                    this.form.description = row.vehicleVO.description
                }
                this.form.remainCount = row.vehicleTaskVO.remainCount
                this.form.driverInfo = row.vehicleTaskVO.driverVO.name + '(' + row.vehicleTaskVO.driverVO.phone + ')'
                this.form.startTime = row.vehicleTaskVO.startTime
                this.form.endTime = row.vehicleTaskVO.endTime
                this.form.getOnVehicleTime = row.vehicleTaskVO.getOnVehicleTime
                this.form.startAddress = row.vehicleTaskVO.startAddress
                this.form.endAddress = row.vehicleTaskVO.endAddress
                this.form.getOnVehicleAddress = row.vehicleTaskVO.getOnVehicleAddress
                this.form.attendeeName = []
                this.attendeeList.forEach(item => {
                    this.form.attendeeName.push(item.attendee.fixAttributeCommonVO.attendeeName + '(' + item.attendee.fixAttributeCommonVO.phone + ')')
                })
                this.form.attendeeName = this.form.attendeeName.join(',')

                // this.form.attendeePhone = [];
                // this.attendeeList.forEach(item => {
                //     this.form.attendeePhone.push(item.attendee.fixAttributeCommonVO.phone)
                // })
                // this.form.attendeePhone = this.form.attendeePhone.join(',');
            }
        },

        onSubmit (form) {
            //任务主题虽不显示 但是要赋值
            this.form.title = new Date(this.form.startTime).getMonth() + 1 + '月' + new Date(this.form.startTime).getDate() + '日'
            if (new Date(this.form.startTime).getHours() < 12) {
                this.form.title += '上午'
            } else {
                this.form.title += '下午'
            }
            if (this.flag === 'pickUp') {
                this.form.title += '接站用车'
            }
            if (this.flag === 'pickOut') {
                this.form.title += '送站用车'
            }
            if (this.flag === 'meeting') {
                this.form.title += this.getConferenceTemplate(1) + '用车'
            }

            this.$refs[form].validate((valid) => {
                if (valid) {
                    if (this.carFlag) {
                        if (this.form.driverId === null || this.form.driverId === '') {
                            this.$message('请选择司机信息')
                            return
                        }
                        if (this.form.startTime === null || this.form.startTime === '') {

                            this.$message('请选择出发时间')
                            return
                        }
                        if (this.form.endTime === null || this.form.endTime === '') {
                            var message = ''
                            message = this.flag === 'pickOut' ? '返程时间' : '送达时间'
                            this.$message('请选择' + message)
                            return
                        }
                        if (this.form.getOnVehicleTime === null || this.form.getOnVehicleTime === '') {
                            var message = ''
                            message = this.flag === 'pickUp' ? '接站时间' : '上车时间'
                            this.$message('请选择' + message)
                            return
                        }
                        if (this.form.startAddress === null || this.form.startAddress === '') {
                            var message = ''
                            message = this.flag === 'pickUp' ? '接站地点' : '上车地点'
                            this.$message('请选择' + message)
                            return
                        }
                        if (this.form.endAddress === null || this.form.endAddress === '') {
                            var message = ''
                            message = this.flag === 'pickOut' ? '返程地点' : '送达地点'
                            this.$message('请选择' + message)
                            return
                        }
                        if (this.form.endTime < this.form.startTime || this.form.endTime < this.form.getOnVehicleTime) {
                            this.$message('送达时间不能早于出发时间和上车时间')
                            return
                        }
                    }

                    if (this.form.contact === null || this.form.contact === '') {
                        this.$message('请选择联系方式')
                        return
                    }
                    if (this.form.contact === false) {
                        // if (this.form.name === null || this.form.name === "") {
                        //     this.$message("请选择联系人姓名")
                        //     return;
                        // }
                        // if (this.form.phone === null || this.form.phone === "") {
                        //     this.$message("请选择联系人电话")
                        //     return;
                        // }   //取消这两个非空
                    }




                    if (this.carFlag) {
                        this.$emit('carSubmit', this.form)
                    } else {
                        this.$emit('submit', this.form.name, this.form.phone, this.form.taskId, this.form.contact)
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        add0 (m) { return m < 10 ? '0' + m : m },
        format (shijianchuo) {
            // shijianchuo是整数，否则要parseInt转换
            var time = new Date(shijianchuo)
            var y = time.getFullYear()
            var m = time.getMonth() + 1
            var d = time.getDate()
            var h = time.getHours()
            var mm = time.getMinutes()
            var s = time.getSeconds()
            return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s)
        }
        // showAttendeeDialog (index, row) {
        //     if (row) {
        //         this.$refs["attendeeTable"].showDialog(row);
        //     }
        // }

    }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
::v-deep :focus {
    outline: 0;
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
