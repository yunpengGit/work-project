<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:0px">
        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form ref="form" :inline="true" :model="form">
                    <el-form-item label="车牌号" prop="platNumLike">
                        <el-input v-model.trim="form.platNumLike" size="small" type="text" style="width: 100px" />
                    </el-form-item>
                    <el-form-item v-if="flag==='pickUp'" label="班次" prop="arriveFlight">
                        <el-input v-model.trim="form.arriveFlight" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item v-if="flag==='pickOut'" label="班次" prop="returnFlight">
                        <el-input v-model.trim="form.returnFlight" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item v-if="flag==='pickUp'" label="接站时间" prop="doubleTime">
                        <el-date-picker
                            v-model="form.doubleTime"
                            type="datetimerange"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            format="yyyy-MM-dd HH:mm"
                            :default-time="configDefaultTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="width:300px"
                        />
                    </el-form-item>
                    <el-form-item v-if="flag==='pickOut'" label="送达时间" prop="doubleTime">
                        <el-date-picker
                            v-model="form.doubleTime"
                            type="datetimerange"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            format="yyyy-MM-dd HH:mm"
                            :default-time="configDefaultTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="width:300px"
                        />
                    </el-form-item>
                    <el-form-item v-if="flag==='meeting'" label="用车时间" prop="doubleTime">
                        <el-date-picker
                            v-model="form.doubleTime"
                            type="datetimerange"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            format="yyyy-MM-dd HH:mm"
                            :default-time="configDefaultTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="width:300px"
                        />
                    </el-form-item>

                    <el-form-item v-if="flag==='pickUp'" label="接站地点" prop="startAddressLike">
                        <el-input v-model.trim="form.startAddressLike" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item v-if="flag==='pickOut'" label="送站地点" prop="endAddressLike">
                        <el-input v-model.trim="form.endAddressLike" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item v-if="flag==='meeting'" label="出发地点" prop="startAddressLike">
                        <el-input v-model.trim="form.startAddressLike" size="small" style="width: 120px" />
                    </el-form-item>
                    <el-form-item v-if="flag==='meeting'" label="到达地点" prop="endAddressLike">
                        <el-input v-model.trim="form.endAddressLike" size="small" style="width: 120px" />
                    </el-form-item>

                    <!-- <el-form-item label="司机" prop="driverNameLike">
                        <el-input size="small" style="width: 120px" v-model="form.driverNameLike" />
                    </el-form-item>
                    <el-form-item label="手机" prop="phoneLike">
                        <el-input size="small" style="width: 120px" v-model="form.phoneLike" />
                    </el-form-item> -->

                    <el-form-item style="float: right;">
                        <i class="el-icon-arrow-down" style="margin-right:10px" @click="showMore" />
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                        <el-button @click="resetForm('form')">重置</el-button>
                    </el-form-item>

                    <el-form-item v-show="showMoreFlag" label="车型" prop="vehicleTypeLike">
                        <el-input v-model.trim="form.vehicleTypeLike" size="small" style="width: 100px" />
                    </el-form-item>

                    <el-form-item v-show="showMoreFlag" label="可用座位数" prop="remainCount">
                        <el-select v-model="form.remainCount" placeholder="全部" clearable style="width:100px">
                            <el-option v-for="item in numOptions" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>

                </el-form>
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
            <!-- <div style="float: left; padding-bottom:10px">
                <el-dropdown @command="handleCommand">
                    <el-button type="primary">
                        批量操作<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="cancelTask">取消任务</el-dropdown-item>v-if="scope.row.isRecommend"
                        <el-dropdown-item command="deleteTask"> 删除任务</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div> -->
            <div style="float: right;padding-bottom:10px">
                <el-checkbox v-model="checked">仅显示空闲车辆</el-checkbox>
                <el-checkbox v-model="checkedRecom">仅查看推荐</el-checkbox>
            </div>
            <el-table
                ref="table"
                :data="vehicleTaskList"
                style="width: 100%"
                :height="tableHeight"
                :header-cell-class-name="cellClass"
                :row-class-name="tableRowClassName"
                tooltip-effect="light"
                :header-cell-style="{
                    background:'#f7f7f7'
                }"
                @select="select"
                @select-all="selectAll"
            >
                <el-table-column v-if="flag !=='meeting'" width="58px">
                    <template slot-scope="scope">
                        <div v-if="scope.row.isOrder">
                            <el-tag size="mini" color="#03BE1C">
                                <font color="#ffffff">已分配</font>
                            </el-tag>

                        </div>
                        <div v-if="!scope.row.isOrder && scope.row.isSpecial">
                            <el-tooltip v-if="scope.row.tooltip" placement="bottom" effect="light">
                                <div slot="content">
                                    {{ scope.row.tooltip }}
                                </div>
                                <div>
                                    <el-tag size="mini" color="#1E89FF">
                                        <font color="#ffffff">专车</font>
                                    </el-tag>
                                </div>
                            </el-tooltip>
                            <div v-if="!scope.row.tooltip">
                                <el-tag size="mini" color="#1E89FF">
                                    <font color="#ffffff">专车</font>
                                </el-tag>
                            </div>
                        </div>
                        <div v-if="!scope.row.isOrder && !scope.row.isSpecial && scope.row.isRecommend">
                            <el-tag size="mini" color="#FFBD0C">
                                <font color="#ffffff">推荐</font>
                            </el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column v-if="flag ==='meeting'" width="58px">
                    <template slot-scope="scope">
                        <div v-if="scope.row.isOrder">
                            <el-tag size="mini" color="#03BE1C">
                                <font color="#ffffff">已分配</font>
                            </el-tag>
                        </div>
                        <div v-if="!scope.row.isOrder && scope.row.isSpecial">
                            <el-tooltip v-if="scope.row.tooltip" placement="bottom" effect="light">
                                <div slot="content">
                                    {{ scope.row.tooltip }}
                                </div>
                                <div>
                                    <el-tag size="mini" color="#1E89FF">
                                        <font color="#ffffff">专车</font>
                                    </el-tag>
                                </div>
                            </el-tooltip>
                            <div v-if="!scope.row.tooltip">
                                <el-tag size="mini" color="#1E89FF">
                                    <font color="#ffffff">专车</font>
                                </el-tag>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="车型" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div class="matching-style">{{ scope.row.vehicleVO.vehicleTypeVO.name }}<i v-if="scope.row.matching">推荐</i></div>
                    </template>
                </el-table-column>
                <el-table-column prop="vehicleVO.platNum" label="车牌号" show-overflow-tooltip />
                <el-table-column prop="vehicleVO.vehicleColorStr" label="颜色" show-overflow-tooltip />
                <el-table-column label="可用 | 总座位数" :min-width="110" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.vehicleTaskVO.remainCount }} | {{ scope.row.vehicleVO.vehicleTypeVO.seatNum }}
                    </template>
                </el-table-column>
                <el-table-column label="司机" show-overflow-tooltip :min-width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.vehicleTaskVO.driverVO != null ">
                            {{ scope.row.vehicleTaskVO.driverVO.name }}<br>
                            {{ scope.row.vehicleTaskVO.driverVO.phone }}
                        </span>
                        <span v-else>
                            -
                        </span>

                    </template>
                </el-table-column>
                <el-table-column label="车辆状态" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <!-- <div>
                            <div
                                v-if="scope.row.vehicleTaskVO.remainCount=== scope.row.vehicleVO.vehicleTypeVO.seatNum ">
                                空闲
                            </div>
                            <div v-if="scope.row.vehicleTaskVO.remainCount===0 ">
                                已满
                            </div>
                            <div
                                v-if="scope.row.vehicleTaskVO.remainCount!==0 && scope.row.vehicleTaskVO.remainCount< scope.row.vehicleVO.vehicleTypeVO.seatNum ">
                                未满
                            </div>
                        </div> -->
                        <div>
                            <div v-if="scope.row.vehicleTaskVO.id===null ">
                                空闲
                            </div>
                            <div v-if="scope.row.vehicleTaskVO.id !==null && scope.row.vehicleTaskVO.remainCount===0 ">
                                已满
                            </div>
                            <div v-if="scope.row.vehicleTaskVO.id !==null && scope.row.vehicleTaskVO.remainCount!==0">
                                未满
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="flag==='meeting'"
                    prop="vehicleTaskVO.startAddress"
                    label="出发地点"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.vehicleTaskVO.startAddress">
                            {{ scope.row.vehicleTaskVO.startAddress }}
                        </span>
                        <span v-else>
                            -
                        </span>
                    </template>
                </el-table-column>
                <el-table-column v-if="flag==='meeting'" label="出发时间" width="160px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <!-- {{scope.row.startTime.slice(5,16)}}~{{scope.row.endTime.slice(5,16)}} -->
                        <span v-if="scope.row.vehicleTaskVO.startTime">
                            {{ scope.row.vehicleTaskVO.startTime.slice(0,16) }}
                        </span>
                        <span v-else>
                            -
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="flag==='meeting'"
                    prop="vehicleTaskVO.endAddress"
                    label="到达地点"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <!-- {{scope.row.startTime.slice(5,16)}}~{{scope.row.endTime.slice(5,16)}} -->
                        <span v-if="scope.row.vehicleTaskVO.endAddress">
                            {{ scope.row.vehicleTaskVO.endAddress }}
                        </span>
                        <span v-else>
                            -
                        </span>
                    </template>
                </el-table-column>
                <el-table-column v-if="flag==='meeting'" label="到达时间" :min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.vehicleTaskVO.endTime">
                            {{ scope.row.vehicleTaskVO.endTime.slice(0,16) }}
                        </span>
                        <span v-else>
                            -
                        </span>
                    </template>
                </el-table-column>

                <el-table-column
                    v-if="flag==='pickUp'"
                    prop="vehicleTaskVO.startAddress"
                    label="接站地点"
                    :min-width="120"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.vehicleTaskVO.startAddress">
                            {{ scope.row.vehicleTaskVO.startAddress }}
                        </span>
                        <span v-else>
                            -
                        </span>
                    </template>
                </el-table-column>

                <el-table-column v-if="flag==='pickUp'" label="接站时间" :min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <!-- {{scope.row.startTime.slice(5,16)}}~{{scope.row.endTime.slice(5,16)}} -->
                        <span v-if="scope.row.vehicleTaskVO.startTime">
                            {{ scope.row.vehicleTaskVO.startTime.slice(0,16) }}
                        </span>
                        <span v-else>
                            -
                        </span>
                    </template>
                </el-table-column>

                <el-table-column v-if="flag==='pickUp'" label="班次/车次" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div v-if="scope.row.flightList != null && scope.row.flightList.length > 0">
                            <div v-for="item in scope.row.flightList" :key="item">
                                {{ item }}
                            </div>

                        </div>
                        <div v-else>
                            -
                        </div>
                    </template>
                </el-table-column>

                <el-table-column
                    v-if="flag==='pickUp'"
                    prop="vehicleTaskVO.endAddress"
                    label="到达地点"
                    :min-width="120"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.vehicleTaskVO.endAddress">
                            {{ scope.row.vehicleTaskVO.endAddress }}
                        </span>
                        <span v-else>
                            -
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="flag==='pickOut'"
                    prop="vehicleTaskVO.endAddress"
                    label="送站地点"
                    :min-width="120"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.vehicleTaskVO.endAddress">
                            {{ scope.row.vehicleTaskVO.endAddress }}
                        </span>
                        <span v-else>
                            -
                        </span>
                    </template>
                </el-table-column>
                <el-table-column v-if="flag==='pickUp'" label="到达时间" :min-width="120">
                    <template slot-scope="scope">
                        <div v-if="scope.row.vehicleTaskVO.endTime">
                            {{ scope.row.vehicleTaskVO.endTime.slice(0,16) }}
                        </div>
                        <div v-else>
                            -
                        </div>
                    </template>
                </el-table-column>
                <el-table-column v-if="flag==='pickOut'" label="送达时间" :min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div v-if="scope.row.vehicleTaskVO.endTime">
                            {{ scope.row.vehicleTaskVO.endTime.slice(0,16) }}
                        </div>
                        <div v-else>
                            -
                        </div>
                    </template>
                </el-table-column>
                <el-table-column v-if="flag==='pickOut'" label="班次/车次" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div v-if="scope.row.flightList != null && scope.row.flightList.length > 0">
                            <div v-for="item in scope.row.flightList" :key="item">
                                {{ item }}
                            </div>
                        </div>
                        <div v-else>
                            -
                        </div>
                    </template>
                </el-table-column>

                <el-table-column
                    v-if="flag==='pickOut'"
                    prop="vehicleTaskVO.startAddress"
                    label="出发地点"
                    :min-width="120"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.vehicleTaskVO.startAddress">
                            {{ scope.row.vehicleTaskVO.startAddress }}
                        </span>
                        <span v-else>
                            -
                        </span>
                    </template>
                </el-table-column>
                <el-table-column v-if="flag==='pickOut'" label="出发时间" :min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <!-- {{scope.row.startTime.slice(5,16)}}~{{scope.row.endTime.slice(5,16)}} -->
                        <span v-if="scope.row.vehicleTaskVO.startTime">
                            {{ scope.row.vehicleTaskVO.startTime.slice(0,16) }}
                        </span>
                        <span v-else>
                            -
                        </span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" :min-width="120" fixed="right">
                    <template slot-scope="scope">
                        <div>
                            <!-- <el-row type="flex" justify="end">
                                <el-col :span="8">
                                    <el-button size="mini" @click="addTask(scope.$index, scope.row)">添加任务</el-button>
                                </el-col>
                                <el-col :span="8">
                                    <el-button size="mini" v-if="scope.row.taskId"
                                        @click="choose(scope.$index, scope.row)">选择任务
                                    </el-button>
                                </el-col>
                                <el-col :span="8">
                                    <el-button size="mini" v-if="scope.row.taskId"
                                        @click="showAttendeeDialog(scope.$index, scope.row)">查看乘车人
                                    </el-button>
                                </el-col>
                            </el-row> -->
                            <!-- <el-button size="mini" @click="addTask(scope.$index, scope.row)">添加任务</el-button> -->
                            <el-button
                                size="mini"
                                :disabled="scope.row.isOrder"
                                @click="choose(scope.$index, scope.row)"
                            >选择车辆
                            </el-button>
                            <!-- <el-button size="mini" v-if="scope.row.taskId"
                                @click="showAttendeeDialog(scope.$index, scope.row)">查看乘车人
                            </el-button> -->
                        </div>
                    </template>

                </el-table-column>
            </el-table>
            <!-- style="position:absolute;bottom:0px;right:20px;width:100%;background:#fff" -->
            <div class="page-wrapper">
                <el-pagination
                    :current-page="paramData.pageNum"
                    background
                    :page-sizes="pageInfo.pageSizeList"
                    :page-size="paramData.pageSize"
                    layout="total, prev, pager, next, sizes ,jumper"
                    :total="pageInfo.total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </div>
        <!-- <editCarTask ref="editCarTask" @getListInfo="getListInfo(paramData)" :taskTypeOptions="taskTypeOptions"
            @handleCommand="handleCommand">
        </editCarTask> -->

        <chooseInfo
            ref="chooseInfo"
            :attendee-list="attendeeList"
            :flag="flag"
            @submit="submit"
            @carSubmit="carSubmit"
        />
        <confirmDialog ref="confirmDialog" />

        <div v-if="dialogVisible">
            <el-dialog
                ref="dialog"
                title="提示"
                :visible.sync="dialogVisible"
                width="30%"
                append-to-body
                top="200px"
                :close-on-click-modal="false"
                :show-close="false"
            >
                <span>{{ confirmMessage }}</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="finishClick">分配完成</el-button>
                    <el-button @click="laterClick">稍后分配</el-button>
                    <el-button @click="nextClick">继续分配</el-button>
                </span>
            </el-dialog>
        </div>

    </div>
</template>
<script>
import { ifExistTask, getPickUpVehicleTaskList, getPickOutVehicleTaskList, deleteVehicleTask, getTaskTypeOptions, cancelVehicleTask, addVehicleTask, getMeetingTaskList } from '@/api/car'
import { getSynergyDetail } from '@/api/hotel'

import editCarTask from '@/views/carManage/carTask/components/editCarTask'
import attendeeList from './attendeeList'
import chooseInfo from './chooseInfo'
import confirmDialog from './confirmDialog'

import { getTableHeight, formatPhone } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
import { addVehicleTaskAttendee, ignoreTask } from '@/api/car'
export default {
    name: 'CarTask',
    components: { editCarTask, attendeeList, chooseInfo, confirmDialog },
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
    data() {
        return {
            form: {
                conferenceId: getConferenceId(),
                queryType: '',
                platNumLike: '',
                driverNameLike: '',
                arriveFlight: '',
                returnFlight: '',
                remainCount: '',
                phoneLike: '',
                type: '',
                status: '',
                vehicleTypeLike: '',
                seatNum: '',
                startTime: '',
                endTime: '',
                startAddressLike: '',
                endAddressLike: '',
                doubleTime: ''
            },
            checked: false,
            checkedRecom: false,
            confirmMessage: '',
            dialogVisible: false,
            numOptions: [{ id: 1, name: '1' }, { id: 2, name: '2' }, { id: 3, name: '3' }, { id: 4, name: '4' }],
            taskTypeOptions: [],
            statusOptions: [{ id: -1, name: '已取消' }, { id: 0, name: '未开始' }, { id: 1, name: '已开始' }, { id: 2, name: '已完成' }],
            vehicleTaskList: [],
            paramData: {
                conferenceId: getConferenceId(),
                pageSize: 10,
                pageNum: 1,
                statusList: [0, 1] // 分配中的任务列表只显示这两个状态
            },
            showMoreFlag: false,
            // currentPage: 1,
            // pageSize: 5,
            pageInfo: {
                pageSizeList: [10, 20, 30],
                total: 0
            },

            tableHeight: getTableHeight(220)
        }
    },
    watch: {
        // '$route' () {  // 对route进行监控  添加返回时会调用刷新数据
        //     this.getListInfo()

        // }
        checkedRecom(val) {
            this.paramData.matching = val
            this.getListInfo(this.paramData)
        },
        checked(val) {
            if (val) {
                this.form.queryType = 2
                delete this.paramData['queryType']
            } else {
                this.form.queryType = ''
            }
            this.paramData.queryType = this.form.queryType
            this.getListInfo(this.paramData)
        },
        'showMoreFlag': {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.tableHeight = getTableHeight(265)
                } else {
                    this.tableHeight = getTableHeight(220)
                }
            }
        },

        'form.doubleTime': {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.form.startTime = newVal[0]
                    this.form.endTime = newVal[1]
                } else {
                    this.form.startTime = ''
                    this.form.endTime = ''
                }
            },
            deep: true,
            immediate: true
        }

    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() { },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        var attendeeIdList = []
        this.attendeeList.forEach(item => {
            attendeeIdList.push(item.attendee.id)
        })
        this.paramData.attendeeIdList = attendeeIdList

        if (this.flag === 'pickUp' && this.attendeeList[0].attendee.fixAttributeCommonVO.arriveTime) {
            this.form.startTime = this.format(new Date(this.attendeeList[0].attendee.fixAttributeCommonVO.arriveTime).getTime() - 60 * 60 * 2 * 1000)
            this.form.endTime = this.format(new Date(this.attendeeList[0].attendee.fixAttributeCommonVO.arriveTime).getTime() + 60 * 60 * 2 * 1000)
            this.form.doubleTime = [this.form.startTime, this.form.endTime]
        }
        if (this.flag === 'pickOut' && this.attendeeList[0].attendee.fixAttributeCommonVO.returnTime) {
            this.form.startTime = this.format(new Date(this.attendeeList[0].attendee.fixAttributeCommonVO.returnTime).getTime() - 60 * 60 * 2 * 1000)
            this.form.endTime = this.format(new Date(this.attendeeList[0].attendee.fixAttributeCommonVO.returnTime).getTime() + 60 * 60 * 2 * 1000)
            this.form.doubleTime = [this.form.startTime, this.form.endTime]
        }
        if (this.flag === 'pickOut' && this.form.startTime || this.flag === 'pickUp' && this.form.startTime) {
            this.paramData.startTime = this.form.startTime
            this.paramData.endTime = this.form.endTime
        } else { // 若小黄条页面接送站的时间查询条件没空  那么给当前时间前两个小时 20201228
            if (this.flag === 'pickOut' || this.flag === 'pickUp') {
                this.form.startTime = this.format(new Date().getTime() - 60 * 60 * 2 * 1000)
                this.form.endTime = this.format(new Date().getTime())
                this.form.doubleTime = [this.form.startTime, this.form.endTime]
                this.paramData.startTime = this.form.startTime
                this.paramData.endTime = this.form.endTime
            }
        }
        // if (this.flag === 'pickUp' && this.attendeeList[0].attendee.fixAttributeCommonVO.arriveFlight) {
        //     this.paramData.arriveFlight = this.attendeeList[0].attendee.fixAttributeCommonVO.arriveFlight
        //     this.form.arriveFlight = this.paramData.arriveFlight;
        // }
        // if (this.flag === 'pickOut' && this.attendeeList[0].attendee.fixAttributeCommonVO.returnFlight) {
        //     this.paramData.returnFlight = this.attendeeList[0].attendee.fixAttributeCommonVO.returnFlight
        //     this.form.returnFlight = this.paramData.returnFlight;
        // }
        if (this.flag === 'pickUp' && this.attendeeList[0].attendee.fixAttributeCommonVO.arriveTime) {
            var recommendList = []
            this.attendeeList.forEach(item => {
                var obj = { 'recommendDate': item.attendee.fixAttributeCommonVO.arriveTime, 'recommendFlight': item.attendee.fixAttributeCommonVO.arriveFlight }
                recommendList.push(obj)
            })
            this.paramData.recommendList = recommendList
        }
        if (this.flag === 'pickOut' && this.attendeeList[0].attendee.fixAttributeCommonVO.returnTime) {
            var recommendList = []
            this.attendeeList.forEach(item => {
                var obj = { 'recommendDate': item.attendee.fixAttributeCommonVO.returnTime, 'recommendFlight': item.attendee.fixAttributeCommonVO.returnFlight }
                recommendList.push(obj)
            })
            this.paramData.recommendList = recommendList
        }
        if (this.flag === 'meeting') { // 会议用车任务给出默认时间条件  会议开始时间到结束时间
            this.getSynergyDetail()
        } else {
            this.getListInfo(this.paramData)
        }
    },
    // 这里存放数据
    beforeCreate() { },
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
    methods: {
        getSynergyDetail() {
            getSynergyDetail({ 'id': getConferenceId() }).then(res => {
                if (res.success) {
                    this.form.doubleTime = [res.result.startTime, res.result.endTime]
                    this.paramData.startTime = this.form.doubleTime[0]
                    this.paramData.endTime = this.form.doubleTime[1]
                    this.getListInfo(this.paramData)
                }
            })
        },

        noAllDaiFenPei() {
            var flag = false
            this.attendeeList.forEach(item => {
                if (item.attendeeTask === null || item.attendeeTask.status !== 1 || item.attendeeTask.result !== null) {
                    flag = true
                }
            })
            return flag
        },

        finishClick() {
            var flag = this.noAllDaiFenPei()
            // if (flag) {
            var params = []
            this.attendeeList.forEach(item => {
                params.push({ 'conferenceId': getConferenceId(), 'attendeeId': item.attendee.id, 'type': 63, 'result': 100 })
            })
            ignoreTask(params).then(res => {
                if (res.success) {
                    this.$emit('refresh', true) // 刷新代办列表的数据  关闭弹框
                }
            })
            this.dialogVisible = false
            this.$emit('refresh', true) // 刷新代办列表的数据  关闭弹框
            //    this.dialogVisible = false;
            // return;
            //    }
            // 待分配的判断
            // if (this.attendeeList[0].attendeeTask !== null && this.attendeeList[0].attendeeTask.status === 1 && this.attendeeList[0].attendeeTask.result === null) {
            //     var params = [];
            //     this.attendeeList.forEach(item => {
            //         params.push({ "conferenceId": getConferenceId(), "attendeeId": item.attendee.id, "type": 63, "result": 100 });
            //     })
            //     ignoreTask(params).then(res => {
            //         if (res.success) {
            //             this.$emit("refresh", true)  //刷新代办列表的数据  关闭弹框
            //         }
            //     })
            //     this.dialogVisible = false;
            //     return;
            // }
            // 未分配的判断
            // if (this.attendeeList[0].attendeeTask === null || this.attendeeList[0].attendeeTask !== null && this.attendeeList[0].attendeeTask.result == 110) {
            //     var params = [];
            //     this.attendeeList.forEach(item => {
            //         params.push({ "conferenceId": getConferenceId(), "attendeeId": item.attendee.id, "type": 63, "result": 100 });
            //     })
            //     ignoreTask(params).then(res => {
            //         if (res.success) {
            //             this.$emit("refresh", true)  //刷新代办列表的数据  关闭弹框
            //         }
            //     })
            //     this.dialogVisible = false;
            //     return;
            // }
        },
        laterClick() {
            var flag = this.noAllDaiFenPei()
            if (flag) {
                var params = []
                this.attendeeList.forEach(item => {
                    params.push({ 'conferenceId': getConferenceId(), 'attendeeId': item.attendee.id, 'type': 63, 'result': 100 })
                })
                ignoreTask(params).then(res => {
                    if (res.success) {
                        this.$emit('refresh', true) // 刷新代办列表的数据  关闭弹框
                    }
                })
                this.dialogVisible = false
            } else {
                this.$emit('refresh', true) // 刷新代办列表的数据  关闭弹框
                this.dialogVisible = false
            }
            // 待分配的判断
            // if (this.attendeeList[0].attendeeTask !== null && this.attendeeList[0].attendeeTask.status === 1 && this.attendeeList[0].attendeeTask.result === null) {
            //     this.$emit("refresh", true)  //刷新代办列表的数据  关闭弹框
            //     this.dialogVisible = false;
            //     return;
            // }
            // 未分配的判断
            // if (this.attendeeList[0].attendeeTask === null || this.attendeeList[0].attendeeTask !== null && this.attendeeList[0].attendeeTask.result == 110) {
            //     var params = [];
            //     this.attendeeList.forEach(item => {
            //         params.push({ "conferenceId": getConferenceId(), "attendeeId": item.attendee.id, "type": 63, "result": 100 });
            //     })
            //     ignoreTask(params).then(res => {
            //         if (res.success) {
            //             this.$emit("refresh", true)  //刷新代办列表的数据  关闭弹框
            //         }
            //     })
            //     this.dialogVisible = false;
            //     return;
            // }
            // this.dialogVisible = false;
            // this.$emit("refresh", true)  //刷新代办列表的数据  关闭弹框
        },
        nextClick() {
            var flag = this.noAllDaiFenPei()
            if (flag) {
                var params = []
                this.attendeeList.forEach(item => {
                    params.push({ 'conferenceId': getConferenceId(), 'attendeeId': item.attendee.id, 'type': 63, 'result': 100 })
                })
                ignoreTask(params).then(res => {
                    if (res.success) {
                        this.$emit('refresh', false) // 刷新代办列表的数据  关闭弹框
                    }
                })
                this.dialogVisible = false
            } else {
                this.$emit('refresh', false) // 刷新代办列表的数据  不关闭弹框
                this.dialogVisible = false
            }
            // //待分配的判断
            // if (this.attendeeList[0].attendeeTask !== null && this.attendeeList[0].attendeeTask.status === 1 && this.attendeeList[0].attendeeTask.result === null) {
            //     this.$emit("refresh", false)  //刷新代办列表的数据  不关闭弹框
            //     this.dialogVisible = false;
            //     return;
            // }
            // //未分配的判断
            // if (this.attendeeList[0].attendeeTask === null || this.attendeeList[0].attendeeTask !== null && this.attendeeList[0].attendeeTask.result == 110) {
            //     var params = [];
            //     this.attendeeList.forEach(item => {
            //         params.push({ "conferenceId": getConferenceId(), "attendeeId": item.attendee.id, "type": 63, "result": 100 });
            //     })
            //     ignoreTask(params).then(res => {
            //         if (res.success) {
            //             this.$emit("refresh", false)  //刷新代办列表的数据  不关闭弹框
            //         }
            //     })
            //     this.dialogVisible = false;
            //     return;
            // }
            // this.dialogVisible = false;
            // this.$emit("refresh", false)  //刷新代办列表的数据  不关闭弹框
        },
        carSubmitMethod(form, replaceFlag) {
            var attendees = []
            this.attendeeList.forEach(item => {
                attendees.push({ 'id': item.attendee.id })
            })
            if (this.attendeeList[0].attendeeTask) {
                var param = {
                    'conferenceId': getConferenceId(),
                    'description': '',
                    'driverId': form.driverId,
                    'endAddress': form.endAddress,
                    'endTime': form.endTime,
                    'startAddress': form.startAddress,
                    'startTime': form.startTime,
                    'type': '1', // 接站用车
                    'vehicleId': form.vehicleId,
                    'attendees': attendees,
                    'contactPerson': form.name,
                    'contactPhone': form.phone,
                    'contact': form.contact,
                    'title': form.title,
                    'publish': form.publish,
                    'getOnVehicleAddress': form.getOnVehicleAddress,
                    'getOnVehicleTime': form.getOnVehicleTime
                }
            } else {
                var param = {
                    'conferenceId': getConferenceId(),
                    'description': '',
                    'driverId': form.driverId,
                    'endAddress': form.endAddress,
                    'endTime': form.endTime,
                    'startAddress': form.startAddress,
                    'startTime': form.startTime,
                    'type': '1', // 接站用车
                    'vehicleId': form.vehicleId,
                    'attendees': attendees,
                    'contactPerson': form.name,
                    'contactPhone': form.phone,
                    'contact': form.contact,
                    'title': form.title,
                    'publish': form.publish,
                    'getOnVehicleAddress': form.getOnVehicleAddress,
                    'getOnVehicleTime': form.getOnVehicleTime
                }
            }

            if (this.flag === 'pickUp') {
                param['type'] = 1
            }
            if (this.flag === 'pickOut') {
                param['type'] = 2
            }
            if (this.flag === 'meeting') {
                param['type'] = 3
            }
            param['replaceFlag'] = replaceFlag
            addVehicleTask(param).then(res => {
                if (res.success) {
                    this.$refs.chooseInfo.handleClose2()
                    this.$message('操作成功')
                    this.getListInfo(this.paramData)

                    if (this.flag === 'meeting') {
                        if (this.attendeeList.length === 1) {
                            var message = this.getConferenceTemplate(1) + '用车分配完成，是否继续为' + this.attendeeList[0].attendee.fixAttributeCommonVO.attendeeName + '分配用车?'
                        } else {
                            var message = this.getConferenceTemplate(1) + '用车分配完成，是否继续为' + this.attendeeList.length + '位' + this.getConferenceTemplate(2) + '分配用车?'
                        }
                        this.dialogVisible = true
                        this.confirmMessage = message

                        // this.$confirm(message, '提示', {
                        //     confirmButtonText: '继续分配',
                        //     cancelButtonText: '分配完成',
                        //     type: 'warning'
                        // }).then(() => {
                        //     this.$emit("refresh", false)  //刷新代办列表的数据  不关闭弹框

                        // }).catch(() => {
                        //     var params = [];
                        //     this.attendeeList.forEach(item => {
                        //         params.push({ "conferenceId": getConferenceId(), "attendeeId": item.attendee.id, "type": 63, "result": 100 });
                        //     })

                        //     ignoreTask(params).then(res => {
                        //         if (res.success) {
                        //             this.$emit("refresh", true)  //刷新代办列表的数据  关闭弹框
                        //         }
                        //     })
                        // })
                    } else {
                        this.$emit('refresh', true) // 刷新代办列表的数据 关闭弹框
                    }
                }
            })
        },
        carSubmit(form) {
            var ids = []
            this.attendeeList.forEach(item => {
                ids.push(item.attendee.id)
            })
            var type = -1
            if (this.flag === 'pickUp' || this.flag === 'pickOut') { // 接送站用车逻辑：先查询是否存在接送站 存在就弹框提示是否取消原来接送站任务
                if (this.flag === 'pickUp') {
                    type = 1
                } else {
                    type = 2
                }
                ifExistTask({ 'ids': ids, 'type': type }).then(res => {
                    if (res.success) {
                        if (res.result) {
                            this.$confirm('请确认是否取消原计划用车？', '', {
                                confirmButtonText: '确认取消',
                                cancelButtonText: '暂不取消',
                                type: 'warning'
                            }).then(() => {
                                this.carSubmitMethod(form, true)// 接送站用车中，如果有人已经分配过该任务了，弹框提示是否取消原有的任务。如果取消，接口加入replaceFlag为true
                            }).catch(() => {
                                this.carSubmitMethod(form, false)
                            })
                        } else {
                            this.carSubmitMethod(form, false)
                        }
                    }
                })
            } else { // 会议用车中不需要弹框提示
                this.carSubmitMethod(form, false)
            }
        },
        submitMethod(name, phone, taskId, contact, replaceFlag) {
            var attendees = []
            this.attendeeList.forEach(item => {
                attendees.push({ 'id': item.attendee.id })
            })
            var params = {
                'conferenceId': getConferenceId(),
                'taskId': taskId,
                'attendees': attendees,
                'contactPerson': name,
                'contactPhone': phone,
                'contact': contact
            }
            params['replaceFlag'] = replaceFlag
            console.log(params)
            addVehicleTaskAttendee(params).then(res => {
                if (res.success) {
                    this.$refs.chooseInfo.handleClose2()
                    this.getListInfo(this.paramData)
                    this.$message('操作成功')
                    if (this.flag === 'meeting') {
                        if (this.attendeeList.length === 1) {
                            var message = this.getConferenceTemplate(1) + '用车分配完成，是否继续为' + this.attendeeList[0].attendee.fixAttributeCommonVO.attendeeName + '分配用车?'
                        } else {
                            var message = this.getConferenceTemplate(1) + '用车分配完成，是否继续为' + this.attendeeList.length + '位' + this.getConferenceTemplate(2) + '分配用车?'
                        }
                        this.dialogVisible = true
                        this.confirmMessage = message

                        // this.$confirm(message, '提示', {
                        //     confirmButtonText: '继续分配',
                        //     cancelButtonText: '分配完成',
                        //     type: 'warning'
                        // }).then(() => {
                        //     this.$emit("refresh", false)  //刷新代办列表的数据  不关闭弹框

                        // }).catch(() => {
                        //     var params = [];
                        //     this.attendeeList.forEach(item => {
                        //         params.push({ "conferenceId": getConferenceId(), "attendeeId": item.attendee.id, "type": 63, "result": 100 });
                        //     })

                        //     ignoreTask(params).then(res => {
                        //         if (res.success) {
                        //             this.$emit("refresh", true)  //刷新代办列表的数据  关闭弹框
                        //         }
                        //     })
                        // })
                    } else {
                        this.$emit('refresh', true) // 刷新代办列表的数据 关闭弹框
                    }
                }
            })
        },
        submit(name, phone, taskId, contact) {
            var ids = []
            this.attendeeList.forEach(item => {
                ids.push(item.attendee.id)
            })

            var type = -1
            if (this.flag === 'pickUp' || this.flag === 'pickOut') {
                if (this.flag === 'pickUp') {
                    type = 1
                } else {
                    type = 2
                }
                ifExistTask({ 'ids': ids, 'type': type }).then(res => {
                    if (res.success) {
                        if (res.result) {
                            this.$confirm('请确认是否取消原计划用车？', '', {
                                confirmButtonText: '确认取消',
                                cancelButtonText: '暂不取消',
                                type: 'warning'
                            }).then(() => {
                                this.submitMethod(name, phone, taskId, contact, true) // 接送站用车中，如果有人已经分配过该任务了，弹框提示是否取消原有的任务。如果取消，接口加入replaceFlag为true
                            }).catch(() => {
                                this.submitMethod(name, phone, taskId, contact, false)
                            })
                        } else {
                            this.submitMethod(name, phone, taskId, contact, false)
                        }
                    }
                })
            } else {
                this.submitMethod(name, phone, taskId, contact, false)
            }
        },
        choose(index, row) {
            if (row.taskId) {
                this.$refs['chooseInfo'].showDialog(row)
            } else {
                this.$refs['chooseInfo'].showDialog(row, true)
            }
        },
        // addTask (index, row) {
        //     this.$refs['chooseInfo'].showDialog(row, true)
        // },
        cellClass(row) {
            if (row.columnIndex === 0) {
                return 'disabledCheck'
            }
        },
        qiehuanshoujijiami(event) {
            if (event.currentTarget.parentElement.children[1].style.display === 'none') {
                event.currentTarget.parentElement.children[1].style.display = ''
                event.currentTarget.parentElement.children[2].style.display = 'none'
            } else {
                event.currentTarget.parentElement.children[1].style.display = 'none'
                event.currentTarget.parentElement.children[2].style.display = ''
            }
        },
        formatPhone(val) {
            return formatPhone(val)
        },
        // 限制只能单选
        select(selection, row) {
            if (selection.length > 1) {
                const del_row = selection.shift()
                this.$refs.table.toggleRowSelection(del_row, false)
            }
        },
        selectAll(selection) {
            if (selection.length > 1) {
                selection.length = 1
            }
        },

        // handleCommand (command) {
        //     this.$confirm('确认删除吗?', '提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText: '取消',
        //         type: 'warning'
        //     }).then(() => {

        //         if (command == "cancelTask") {
        //             this.cancelSelected()
        //         }
        //         if (command == "deleteTask") {
        //             this.delSelected()
        //         }
        //     }).catch(() => { })
        // },
        handleCommand(command) {
            this.$confirm('请确认是否取消任务？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.cancelSelected(command)
            }).catch(() => { })
        },
        showAttendeeDialog(index, row) {
            if (row) {
                this.$refs['attendeeList'].showDialog(row)
            }
        },
        changeStatus(status) {
            if (status == -1) {
                return '已取消'
            }
            if (status == 0) {
                return '未开始'
            }
            if (status == 1) {
                return '已开始'
            }
            if (status == 2) {
                return '已完成'
            }
            if (status == 3) {
                return '已删除'
            }
        },
        addPerson(index, row) {
            this.$router.push({ path: '/carManager/addAttendee', query: { vehicleTaskId: row.id }})
        },
        showMore() {
            this.showMoreFlag = !this.showMoreFlag
        },
        handleSizeChange(val) {
            console.log('长度改变：' + val)
            this.paramData.pageSize = val
            this.getListInfo(this.paramData)
        },
        handleCurrentChange(val) {
            console.log('当前页码改变：' + val)
            this.paramData.pageNum = val
            this.getListInfo(this.paramData)
        },
        delSelected() {
            var ids = []
            var selectedList = this.$refs.table.selection
            if (selectedList.length == 0) {
                this.$message('至少选择一条记录')
                return
            }
            for (const item of selectedList) {
                ids.push(item.id)
            }
            var params = ids
            console.log(ids)
            deleteVehicleTask(params).then(response => {
                if (response.success) {
                    this.$message('删除成功')
                    this.paramData.pageNum = 1
                    this.getListInfo(this.paramData)
                }
            })
        },

        cancelSelected(id) {
            var ids = []
            // var selectedList = this.$refs.table.selection;
            // for (let item of selectedList) {
            //     ids.push(item.id)
            // }
            ids.push(id)// 需求改成   取消任务不需要批量
            var params = ids
            console.log(ids)
            cancelVehicleTask(params).then(response => {
                if (response.success) {
                    this.$message('取消成功')
                    this.getListInfo(this.paramData)
                    this.$refs['editCarTask'].cancelForm()
                }
            })
        },

        handleEdit(index, row) {
            if (row) {
                this.$refs['editCarTask'].showEdit(row)
            } else {
                this.$refs['editCarTask'].showEdit()
            }
        },

        tableRowClassName({ row, rowIndex }) {
            const index = rowIndex + 1
            if (index % 2 == 0) {
                return 'warning-row'
            }
        },
        onSubmit() {
            var params = Object.assign({}, this.form)
            for (var key in params) {
                if (params[key] === '') {
                    delete params[key]
                }
                if (key == 'doubleTime') {
                    delete params[key]
                }
            }
            // 这里需要加入pageSize和pageNum参数
            params['pageSize'] = this.paramData.pageSize
            params['pageNum'] = 1
            params['statusList'] = [0, 1]
            params['attendeeIdList'] = this.paramData.attendeeIdList
            params['recommendList'] = this.paramData.recommendList
            this.getListInfo(params)
        },
        resetForm(form) {
            // this.$refs.confirmDialog.showDialog("123")
            this.$refs[form].resetFields()
        },
        getListInfo(param) {
            param.matchingAttendeeIds = param.attendeeIdList
            if (this.flag === 'pickUp') {
                getPickUpVehicleTaskList(param).then(response => {
                    if (response.success) {
                        console.log('getPickUpVehicleTaskList' + response.result.list)
                        this.vehicleTaskList = response.result.list
                        this.pageInfo.total = response.result.total
                        this.paramData = param
                        // 对班次进行去重和处理
                        // this.vehicleTaskList[0].flightList = ['2']
                        this.vehicleTaskList.forEach(item => {
                            // item.flightList = ['1', '2']
                            item.flightList = []
                            item.attendeeVOList.forEach(n => {
                                if (n.fixAttributeVO.arriveFlight !== null && n.fixAttributeVO.arriveFlight !== '') {
                                    item.flightList.push(n.fixAttributeVO.arriveFlight)
                                } else {
                                    item.flightList.push('-')
                                }
                            })
                            item.flightList = [...new Set(item.flightList)]
                        })
                        this.$refs.table.doLayout()
                    }
                })
            }
            if (this.flag === 'pickOut') {
                getPickOutVehicleTaskList(param).then(response => {
                    if (response.success) {
                        console.log('getPickOutVehicleTaskList' + response.result.list)
                        this.vehicleTaskList = response.result.list
                        this.pageInfo.total = response.result.total
                        this.paramData = param

                        // 对班次进行去重和处理
                        this.vehicleTaskList.forEach(item => {
                            item.flightList = []
                            item.attendeeVOList.forEach(n => {
                                if (n.fixAttributeVO.returnFlight !== null && n.fixAttributeVO.returnFlight !== '') {
                                    item.flightList.push(n.fixAttributeVO.returnFlight)
                                } else {
                                    item.flightList.push('-')
                                }
                            })
                            item.flightList = [...new Set(item.flightList)]
                        })
                    }
                })
                return
            }
            if (this.flag === 'meeting') {
                getMeetingTaskList(param).then(response => {
                    if (response.success) {
                        console.log('meetingVehicleTaskList' + response.result.list)
                        this.vehicleTaskList = response.result.list
                        this.pageInfo.total = response.result.total
                        this.paramData = param
                    }
                })
                return
            }
        },

        getTaskTypeOptions(param) {
            getTaskTypeOptions(param).then(response => {
                if (response.success) {
                    this.taskTypeOptions = response.result
                }
            })
        },
        init() {
            var attendeeIdList = []
            this.attendeeList.forEach(item => {
                attendeeIdList.push(item.attendee.id)
            })
            this.paramData.attendeeIdList = attendeeIdList
            this.getListInfo(this.paramData)
        },
        add0(m) { return m < 10 ? '0' + m : m },
        format(shijianchuo) {
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

    }
}
</script>
<style lang='scss' scoped >
// ::v-deep .el-table tr {
//     background: #c0c0c0;
// } // 单数行的颜色

::v-deep .el-table .warning-row {
    background: #f7f7f7;
}
/* 去掉全选按钮 */
::v-deep .el-table .disabledCheck .cell .el-checkbox__inner {
    display: none !important;
}

::v-deep .el-table .disabledCheck .cell::before {
    content: "";
    text-align: center;
    line-height: 37px;
}
</style>
