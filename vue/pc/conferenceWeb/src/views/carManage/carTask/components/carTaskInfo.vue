<template>

    <el-drawer
        ref="drawer"
        :title="title"
        :before-close="handleClose"
        :visible.sync="dialog"
        direction="rtl"
        custom-class="demo-drawer"
        size="45%"
    >
        <el-form
            ref="form"
            size="small"
            :model="form"
            label-width="140px"
            label-position="left"
            :rules="rules"
            :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto','margin-left':'30px','margin-top':'-15px'}"
        >
            <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                <el-form-item style="width:80%">
                    <span slot="label" style="font-size:16px;color:black">任务信息</span>
                </el-form-item>
                <el-form-item label="任务类型" style="width:80%">
                    <span>{{ this.form.type }}</span>
                </el-form-item>
                <!-- <el-form-item label="任务主题" style="width:80%">
                    <span>{{ this.form.title }}</span>
                </el-form-item> -->

                <el-form-item label="车辆信息" style="width:80%">
                    <span>{{ this.form.carInfo }}</span>
                </el-form-item>
                <el-form-item label="可用座位数" style="width:80%">
                    <span>{{ this.form.remainCount }}</span>
                </el-form-item>
                <el-form-item label="司机" style="width:80%">
                    <span>{{ this.form.driverInfo }}</span>
                </el-form-item>
                <!-- <el-form-item label="出发时间" style="width:80%">
                    <span v-if="this.form.startTime">{{ this.form.startTime.slice(0,16) }}</span>
                </el-form-item> -->
                <el-form-item v-if="flag==='pickUp'" label="接站时间" style="width:80%">
                    <span v-if="this.form.getOnVehicleTime">{{ this.form.getOnVehicleTime.slice(0,16) }}</span>
                </el-form-item>
                <el-form-item v-if="flag==='pickUp'" label="接站地点" style="width:80%">
                    <span>{{ this.form.startAddress }}</span>
                </el-form-item>
                <el-form-item
                    v-if="flag==='pickOut' || flag==='meeting' || flag==='special'"
                    label="上车时间"
                    style="width:80%"
                >
                    <span v-if="this.form.getOnVehicleTime">{{ this.form.getOnVehicleTime.slice(0,16) }}</span>
                </el-form-item>
                <el-form-item
                    v-if="flag==='pickOut' || flag==='meeting' || flag==='special'"
                    label="上车地点"
                    style="width:80%"
                >
                    <span>{{ this.form.startAddress }}</span>
                </el-form-item>
                <el-form-item label="详细位置" style="width:80%">
                    <span>{{ this.form.getOnVehicleAddress ? this.form.getOnVehicleAddress:'无' }}</span>
                </el-form-item>
                <el-form-item
                    v-if="flag==='pickUp' || flag==='meeting' || flag==='special'"
                    label="送达时间"
                    style="width:80%"
                >
                    <span v-if="this.form.endTime">{{ this.form.endTime.slice(0,16) }}</span>
                </el-form-item>
                <el-form-item
                    v-if="flag==='pickUp' || flag==='meeting' || flag==='special'"
                    label="送达地点"
                    style="width:80%"
                >
                    <span>{{ this.form.endAddress }}</span>
                </el-form-item>
                <el-form-item v-if="flag==='pickOut'" label="返程时间" style="width:80%">
                    <span v-if="this.form.endTime">{{ this.form.endTime.slice(0,16) }}</span>
                </el-form-item>
                <el-form-item v-if="flag==='pickOut'" label="返程地点" style="width:80%">
                    <span>{{ this.form.endAddress }}</span>
                </el-form-item>
                <!-- <el-form-item label="任务状态" style="width:80%">
                    <span>{{ this.form.carStatus }}</span>
                </el-form-item> -->
                <el-form-item label="任务状态" style="width:80%">
                    <span>{{ this.form.taskStatus ==='未发布' && this.form.carStatus !=='已取消' ? this.form.taskStatus : this.form.carStatus }}</span>
                </el-form-item>
                <el-form-item label="备注" style="width:80%">
                    <span>{{ this.form.description?this.form.description:'无' }}</span>
                </el-form-item>
                <el-divider />
                <el-form-item style="width:80%">
                    <span slot="label" style="font-size:16px;color:black">乘车人信息</span>
                </el-form-item>

                <div>
                    <div style="background-color: white;padding-left:0px;padding-top:10px;padding-right: 30px">

                        <el-table
                            ref="table"
                            :data="vehicleTaskAttendeeList"
                            style="width: 100%"
                            :height="tableHeight"
                            :row-class-name="tableRowClassName"
                            :header-cell-style="{
                                background:'#f7f7f7'
                            }"
                        >
                            <el-table-column :label="getConferenceTemplate(2) + '信息'" align="left" width="130px">
                                <template slot-scope="scope">
                                    <div style="height:32px">
                                        <img
                                            style="width:32px;height:32px;float:left;border-radius:50%"
                                            :src="scope.row.ssoUserPhoto !== null && scope.row.ssoUserPhoto !== '' ? scope.row.ssoUserPhoto : (scope.row.fixAttributeCommonVO.sex === null || scope.row.fixAttributeCommonVO.sex === '' ? require('@/assets/male.png') : (scope.row.fixAttributeCommonVO.sex === '1' || scope.row.fixAttributeCommonVO.sex === 1) ? require('@/assets/male.png') : require('@/assets/female.png'))"
                                        >
                                        <span
                                            style="margin-top:8px;margin-left:5px;float:left"
                                            :title="scope.row.fixAttributeCommonVO.attendeeName"
                                        >{{ scope.row.fixAttributeCommonVO.attendeeName != null && scope.row.fixAttributeCommonVO.attendeeName.length > 4 ? scope.row.fixAttributeCommonVO.attendeeName.substr(0,4) + '...' : scope.row.fixAttributeCommonVO.attendeeName }}</span>
                                        <!-- <span v-if="scope.row.fixAttributeCommonVO.honourFlag === 1"
                                    style="margin-top:8px;float:left">（主宾）</span>
                                <span v-else style="margin-top:8px;float:left">（随员）</span> -->
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="职务" width="70px">
                                <template slot-scope="scope">
                                    <div :title="scope.row.fixAttributeCommonVO.position" class="content1">
                                        {{ formatTableCellData(scope.row.fixAttributeCommonVO.position) }}</div>
                                </template>
                            </el-table-column>

                            <el-table-column label="手机" width="95px">
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
                            <el-table-column label="联系人">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.contactPhone===scope.row.fixAttributeCommonVO.phone">
                                        乘车人
                                    </div>
                                    <div v-else>
                                        {{ scope.row.contactPerson }}<span
                                            v-if="scope.row.contactPhone"
                                        >{{ '('+scope.row.contactPhone+')' }}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="170px">

                                <template slot-scope="scope">
                                    <!-- <el-button size="mini" type="text" @click="showAttendeeInfo( scope.row.id)">
                                        人员详情
                                    </el-button> -->
                                    <el-button size="mini" type="text" @click="changeContact(scope.row)">
                                        联系人变更
                                    </el-button>
                                    <el-button
                                        v-permission="buttons.CarTask.removeAttendee"
                                        size="mini"
                                        type="text"
                                        @click="handleRemoveWithConfirm(scope.$index, scope.row)"
                                    >移除
                                    </el-button>

                                </template>
                            </el-table-column>
                        </el-table>

                    </div>
                </div>
                <div v-if="resultShow">
                    <el-form-item style="width:80%">
                        <span slot="label" style="font-size:16px;color:black">任务执行结果</span>
                    </el-form-item>
                    <el-form-item label="实际开始时间" style="width:80%">
                        <span v-if="this.form.realStartTime">{{ this.form.realStartTime.slice(0,16) }}</span>
                        <span v-else>
                            -
                        </span>
                    </el-form-item>
                    <el-form-item label="实际结束时间" style="width:80%">
                        <span v-if="this.form.realEndTime">{{ this.form.realEndTime.slice(0,16) }}</span>
                        <span v-else>
                            -
                        </span>
                    </el-form-item>

                </div>
            </el-scrollbar>

        </el-form>
        <div
            class="demo-drawer__footer"
            style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD"
        >
            <el-button
                v-permission="buttons.CarTask.batchAddAttendee"
                type="primary"
                :loading="loading"
                style="height:32px;margin-top:12px;"
                :disabled="addDisabled"
                @click="batchAdd()"
            >
                批量添加乘车人</el-button>
            <el-button
                v-permission="buttons.CarTask.addAttendee"
                type="primary"
                :loading="loading"
                style="height:32px;margin-top:12px;"
                :disabled="addDisabled"
                @click="addOne()"
            >
                添加乘车人</el-button>
            <el-button style="height:32px;margin-top:12px" @click="cancelForm">取 消</el-button>

        </div>
        <attendeeDialog ref="attendeeDialog" @getListInfo="getListInfo(paramData)" @refresh="refresh()" />
        <addOneAttendee :dialog-visible="addOneAttendeeDialog" :task-id="paramData.taskId" @closeDialog="closeDialog" />
        <changeContact ref="changeContact" @getListInfo="getListInfo(paramData)" />

    </el-drawer>

</template>

<script>
import { updateVehicleTask, getDriverList, getCarTaskById } from '@/api/car'
import { getTableHeight } from '@/utils/index'
import { telephoneValid } from '@/utils/valid-common.js'
import { getConferenceId } from '@/utils/conference-auth'
import attendeeTable from './attendeeList'
import attendeeDialog from './attendeeDialog'
import addOneAttendee from './addOneAttendee'
import changeContact from './changeContact'

import { getVehicleTaskAttendeeList, deleteVehicleTaskAttendee } from '@/api/car'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
import { getAddressListByConferenceId } from '@/api/special'

export default {
    name: '',
    components: { attendeeTable, attendeeDialog, addOneAttendee, changeContact },
    // import引入的组件需要注入到对象中才能使用
    // 例如：import 《组件名称》 from '《组件路径》';
    props: {
        attendeeList: {
            type: Array,
            default: ()=>{
                return []
            }
        },
        // flag: {
        //     type: String,
        //     default: ''
        // }
    },
    data() {
        // 这里存放数据
        return {

            addDisabled: false,
            resultShow: false,
            form: {
                type: '',
                taskId: '',
                title: '',
                taskStatus: '',
                carInfo: '',
                remainCount: '',
                driverInfo: '',
                startTime: '',
                endTime: '',
                startAddress: '',
                endAddress: '',
                carStatus: '',
                description: '',
                getOnVehicleTime: '',
                realStartTime: '',
                realEndTime: ''
            },
            addOneAttendeeDialog: false,
            flag: '',
            title: '',
            row: '',
            dialog: false,
            driverOptions: [],
            dialogHeight: getTableHeight(20) + 'px',
            loading: false,
            publishOptions: [{ 'id': true, 'name': '是' }, { 'id': false, 'name': '否' }],
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
            tableHeight: getTableHeight(300),
            buttons: this.Global.buttons,
            rules: {
            }
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {

    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    // 这里存放数据
    beforeCreate() {
    },
    // 生命周期 - 挂载之前
    beforeMount() { },
    // 生命周期 - 更新之前
    beforeUpdate() { },
    // 生命周期 - 更新之后
    updated() { },
    // 生命周期 - 销毁之前
    beforeDestroy() { },
    // 生命周期 - 销毁完成
    destroyed() { },
    // 如果页面有keep-alive缓存功能，这个函数会触发
    activated() { },
    // 方法集合
    methods: {
        changeContact(row) {
            this.$refs['changeContact'].showDialog(row, this.paramData.taskId)
        },
        showAttendeeInfo(val) {
            this.$router.push({
                path: `/attendeeManagement/attendee/show/${val}`
            })
        },
        closeDialog() {
            this.addOneAttendeeDialog = false
            this.refresh()
        },
        addOne() {
            this.addOneAttendeeDialog = true
        },
        refresh() {
            this.getListInfo(this.paramData)
            this.getCarTaskById()
            this.$emit('getListInfo')
        },
        batchAdd() {
            this.$refs['attendeeDialog'].showDialog(this.paramData.taskId)
        },

        handleRemoveWithConfirm(index, row) {
            this.$confirm('请确认是否从当前任务中移除' + row.fixAttributeCommonVO.attendeeName + '？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.handleRemove(index, row)
            }).catch(() => { })
        },
        handleRemove(index, row) {
            var param = {
                'taskId': this.paramData.taskId,
                'attendees': [{ 'id': row.id }]
            }
            deleteVehicleTaskAttendee(param).then(res => {
                if (res.success) {
                    this.$message('操作成功')
                    this.paramData.pageNum = 1
                    this.getListInfo(this.paramData)
                    this.getCarTaskById()
                    this.$emit('getListInfo')
                }
            })
        },
        initAttendeeList(row) {
            if (!row) {
                this.$message('未接收到任务id')
            } else {
                this.vehicleTaskAttendeeList = []
                this.paramData.taskId = row.id
                this.paramData.attendeeRoleFlagEqual = [0, 1, 2, 3, 4]
                this.getListInfo(this.paramData)
            }
        },
        tableRowClassName({ row, rowIndex }) {
            const index = rowIndex + 1
            if (index % 2 == 0) {
                return 'warning-row'
            }
        },
        getListInfo(param) {
            getVehicleTaskAttendeeList(param).then(response => {
                if (response.success) {
                    console.log('getVehicleTaskAttendeeList' + response.result.list)
                    this.vehicleTaskAttendeeList = response.result.list
                    this.paramData = param
                }
            })
        },

        cancelForm() {
            // this.$refs['form'].resetFields();
            //  this.form = this.$options.data().form  //buttons导致这里报错
            this.form = {
                type: '',
                taskId: '',
                title: '',
                taskStatus: '',
                carInfo: '',
                remainCount: '',
                driverInfo: '',
                startTime: '',
                endTime: '',
                startAddress: '',
                endAddress: '',
                carStatus: '',
                description: '',
                getOnVehicleTime: '',
                realStartTime: '',
                realEndTime: ''
            },
            this.addDisabled = false
            this.resultShow = false
            this.dialog = false
        },

        handleClose(done) {
            done()
            //    this.$refs['form'].resetFields();
            this.form = this.$options.data().form
            this.dialog = false
        },
        handleClose2() {
            //   this.$refs['form'].resetFields();
            this.form = this.$options.data().form
            this.dialog = false
        },
        showDialog(row) {
            this.addDisabled = false
            this.resultShow = false
            this.form.taskId = row.id
            this.initAttendeeList(row)
            this.dialog = true
            this.getCarTaskById()
            if (row.status === 2 || row.status === -1) {
                this.addDisabled = true
            }
            if (row.status > 0) {
                this.resultShow = true
            }
        },

        initFormData(row) {
            if (row.type === '1') {
                this.flag = 'pickUp'
            }
            if (row.type === '2') {
                this.flag = 'pickOut'
            }
            if (row.type === '3') {
                this.flag = 'meeting'
            }
            if (row.type === '4') {
                this.flag = 'special'
            }
            this.title = '查看用车任务'
            this.form = row
            this.form.type = row.typeStr
            this.form.title = row.title
            if (row.publish) {
                this.form.taskStatus = '已发布'
            } else {
                this.form.taskStatus = '未发布'
            }
            if (row.vehicle) {
                this.form.carInfo = row.vehicle.vehicleTypeVO.name + ' (' + row.vehicle.platNum + ') ' + ' ' + row.vehicle.vehicleTypeVO.seatNum + '座'
            }
            this.form.remainCount = row.remainCount
            this.form.driverInfo = row.driverVO.name + '(' + row.driverVO.phone + ')'
            this.form.startTime = row.startTime
            this.form.endTime = row.endTime
            this.form.startAddress = row.startAddress
            this.form.endAddress = row.endAddress
            this.form.carStatus = row.statusStr
            this.form.description = row.description
            this.form.realStartTime = row.realStartTime
            this.form.realEndTime = row.realEndTime
        },

        getCarTaskById() {
            getCarTaskById({ id: this.paramData.taskId }).then(res => {
                if (res.success) {
                    this.initFormData(res.result)
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
</style>
