<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:0px">
        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form ref="form" :inline="true" :model="form">
                    <el-form-item label="入住时间" prop="doubleTime">
                        <el-date-picker
                            v-model="form.doubleTime"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围"
                            size="small"
                            style="width:280px"
                        />
                    </el-form-item>

                    <el-form-item label="房间状态" prop="hotelId">
                        <el-select
                            v-model="form.fullStatusList"
                            style="width:140px"
                            collapse-tags
                            placeholder="全部"
                            value=""
                            multiple
                            clearable
                        >
                            <el-option :key="0" label="空闲" value="0" />
                            <el-option :key="1" label="未满" value="1" />
                            <el-option :key="2" label="已满 " value="2" />

                        </el-select>
                    </el-form-item>

                    <el-form-item label="房间使用方式" prop="hotelId">
                        <el-select v-model="form.oneself" placeholder="请选择" clearable filterable style="width:120px">
                            <el-option label="全部" value="" />
                            <el-option :key="0" label="合住" value="0" />
                            <el-option :key="1" label="单住" value="1" />

                        </el-select>
                    </el-form-item>
                    <el-form-item label="房间号" prop="roomNoLike">
                        <el-input v-model.trim="form.roomNoLike" size="small" style="width:80px" />
                    </el-form-item>

                    <el-form-item style="float: right;">
                        <i class="el-icon-arrow-down" style="margin-right:10px" @click="showMore" />
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                        <el-button @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                    <br v-show="showMoreFlag">
                    <el-form-item v-show="showMoreFlag" label="酒店" prop="hotelId">
                        <el-select v-model="form.hotelId" placeholder="请选择" clearable filterable style="width:120px">
                            <el-option
                                v-for="item in hotelOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                                @click.native="hotelClick(item)"
                            />
                        </el-select>
                    </el-form-item>

                    <el-form-item v-show="showMoreFlag" label="房型" prop="modelId">
                        <el-select v-model="form.modelId" placeholder="请选择" clearable filterable style="width:120px">
                            <el-option
                                v-for="item in roomFormOptions"
                                :key="item.id"
                                :label="item.modelName"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>

                    <el-form-item v-show="showMoreFlag" label="容量(人)" prop="remainCount">
                        <el-input v-model.trim="form.remainCount" size="small" style="width:120px" />
                    </el-form-item>

                </el-form>
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px;">
            <div style="float: right;padding-bottom:10px">
                <el-checkbox v-model="checked">仅查看推荐</el-checkbox>
            </div>
            <el-table
                ref="table"
                tooltip-effect="light"
                :data="roomTaskList"
                style="width: 100%"
                :height="tableHeight"
                :row-class-name="tableRowClassName"
                :header-cell-style="{
                    background:'#f7f7f7'
                }"
            >
                <el-table-column label="开始时间" :min-width="100">
                    <template slot-scope="scope">
                        <div class="matching-style">{{ scope.row.startDate }}<i v-if="scope.row.matching">推荐</i></div>
                    </template>
                </el-table-column>
                <el-table-column prop="endDate" label="结束时间" :min-width="100">
                    <template slot-scope="scope">
                        {{ scope.row.endDate }}
                    </template>
                </el-table-column>
                <el-table-column label="房间号" prop="roomNo" :min-width="80">
                    <template slot-scope="scope">
                        {{ formatTableCellData(scope.row.roomNo) }}
                        <span style="color:#74b9ff;">
                            {{scope.row.allocationFlag?'(已分配)':''}}
                        </span>
                        
                    </template>
                </el-table-column>
                <el-table-column label="房间位置" :min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ formatTableCellData(scope.row.description) }}
                    </template>
                </el-table-column>
                <el-table-column label="房型 | 床位数" :min-width="100">
                    <template slot-scope="scope">
                        {{ scope.row.roomFormVO.modelName }} | {{ scope.row.roomFormVO.capacity }}
                    </template>
                </el-table-column>

                <el-table-column label="已使用/剩余床位" :min-width="110">
                    <template slot-scope="scope">
                        {{ scope.row.totalCount-scope.row.remainCount }} / {{ scope.row.remainCount }}
                    </template>
                </el-table-column>
                <el-table-column label="酒店" prop="roomFormVO.hotelVO.name" :min-width="100" />
                <el-table-column label="房间状态" :min-width="80">
                    <template slot-scope="scope">
                        {{ scope.row.fullStatusStr }}
                    </template>
                </el-table-column>
                <el-table-column label="房间使用方式" :min-width="100">
                    <template slot-scope="scope">
                        {{ scope.row.oneself===0 ? "合住" : "单住" }}
                    </template>
                </el-table-column>

                <el-table-column label="操作" :min-width="230">
                    <template slot-scope="scope">
                        <el-button size="mini" :disabled="scope.row.allocationFlag" @click="handleEdit(scope.$index, scope.row)">选择房间</el-button>
                        <el-button size="mini" @click="handleView(scope.$index, scope.row)">查看住宿人员</el-button>
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
        <!-- <editHotelTask ref="editHotelTask" @getListInfo="getListInfo(paramData)" @handleCommand="handleCommand">
        </editHotelTask> -->
        <distributeDialog
            ref="distributeDialog"
            :attendee-list="attendeeList"
            @getListInfo="getListInfo(paramData)"
            @closeDialog="closeDialog"
            @handleCommand="handleCommand"
            @parentFangData="parentFangData"
        />
        <viewHotelTask ref="viewHotelTask" @getListInfo="getListInfo(paramData)" @handleCommand="handleCommand" />

    </div>
</template>
<script>
import { getRoomTaskList, getRoomFormList, getHotelList, getSynergyDetail, getRoomFormByHotelId } from '@/api/hotel'
// import editHotelTask from './components/editHotelTask'
import distributeDialog from './distributeDialog'
import viewHotelTask from '../../hotelPlan/components/viewHotelTask'
import { getTableHeight, getSubtDate } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'

export default {
    name: 'CarTask',
    components: { distributeDialog, viewHotelTask },
    props: {
        attendeeList: {
            type: Array,
            default: []
        },
        attendeeIds: {
            type: Array
        }
    },
    data() {
        return {
            checked: false,
            form: {
                conferenceId: getConferenceId(),
                fullStatusList: [],
                oneself: [],
                doubleTime: [],
                modelId: '',
                roomNoLike: '',
                hotelId: '',
                remainCount: '',
                startDate: '',
                endDate: ''
            },
            roomTaskList: [],
            paramData: {
                conferenceId: getConferenceId(),
                pageSize: 10,
                pageNum: 1

            },
            showMoreFlag: false,
            roomFormOptions: '',
            hotelOptions: '',

            pageInfo: {
                pageSizeList: [10, 20, 30],
                total: 0
            },

            tableHeight: getTableHeight(200)
        }
    },
    watch: {
        checked(val) {
            this.paramData.matching = val
            this.getListInfo(this.paramData)
        },
        '$route'() { // 对route进行监控  添加返回时会调用刷新数据
            this.getListInfo(this.paramData)
        },
        'showMoreFlag': {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.tableHeight = getTableHeight(211)
                } else {
                    this.tableHeight = getTableHeight(165)
                }
            }
        },

        'form.doubleTime': {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.form.startDate = newVal[0]
                    this.form.endDate = newVal[1]
                } else {
                    this.form.startDate = ''
                    this.form.endDate = ''
                }
            },
            deep: true,
            immediate: true
        },

        'form.hotelId': {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.getRoomFormOptions()
                }
            }
        }

    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() { },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.getRoomFormOptions()
        this.getHotelOptions()
        this.getSynergyDetail()
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
        parentFangData(data){
            this.$emit('update:houseData',data)
          
            
            console.log(this.$parent.houseData,'dat000')
        },
        hotelClick(item) {
            this.form.modelId = ''
            this.getRoomFormByHotelId(item.id)
        },
        getRoomFormByHotelId(val) {
            getRoomFormByHotelId({ 'hotelId': val }).then(res => {
                if (res.success) {
                    this.roomFormOptions = res.result
                }
            })
        },
        getSynergyDetail() {

            getSynergyDetail({ 'id': getConferenceId() }).then(res => {
                if (res.success) {
                    // 默认入住时间逻辑  会议开始日期-1  到   会议结束日期
                    this.form.doubleTime = [getSubtDate(res.result.startTime.slice(0, 10), 0), res.result.endTime.slice(0, 10)]
                    this.paramData.startDate = this.form.doubleTime[0]
                    this.paramData.endDate = this.form.doubleTime[1]
                    this.getListInfo(this.paramData)
                }
            })
        },
        closeDialog() {
            this.$emit('closeDialog')
        },

        fullStatusListClick(val) {
            this.onSubmit()
        },
        oneselfClick(val) {
            this.onSubmit()
        },
        handleCommand(command) {
            this.$confirm('确认取消该任务吗?', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.cancelSelected(command)
            }).catch(() => { })
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
        // delSelected () {
        //     var ids = []
        //     var selectedList = this.$refs.table.selection;
        //     if (selectedList.length == 0) {
        //         this.$message("至少选择一条记录")
        //         return;
        //     }
        //     for (let item of selectedList) {
        //         ids.push(item.id)
        //     }
        //     var params = ids;
        //     console.log(ids)
        //     deleteVehicleTask(params).then(response => {
        //         if (response.success) {
        //             this.$message("删除成功")
        //             this.getListInfo(this.paramData)
        //         }
        //     })
        // },

        // cancelSelected (id) {
        //     var ids = []
        //     // var selectedList = this.$refs.table.selection;
        //     // for (let item of selectedList) {
        //     //     ids.push(item.id)
        //     // }
        //     ids.push(id);//需求改成   取消任务不需要批量
        //     var params = ids;
        //     console.log(ids)
        //     cancelVehicleTask(params).then(response => {
        //         if (response.success) {
        //             this.$message("取消成功")
        //             this.getListInfo(this.paramData)
        //             this.$refs["editHotelTask"].cancelForm();
        //         }
        //     })
        // },

        handleEdit(index, row) {
            if (row) {
                this.$refs['distributeDialog'].showDialog(row, this.paramData.startDate, this.paramData.endDate)
            } else {
                this.$message('error')
            }
        },

        // 查看住宿人员
        handleView(index, row) {
            if (row) {
                this.$refs['viewHotelTask'].showView(row)
            } else {
                this.$refs['viewHotelTask'].showView()
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
            this.getListInfo(params)
        },
        resetForm(form) {
            this.form = this.$options.data().form
            this.$refs[form].resetFields()
        },
        getListInfo(param) {
            // console.log(param,this.attendeeList,"param")
            param.attendeeIdList = this.attendeeIds
            param.matchingAttendeeIds = this.attendeeIds
            if(this.attendeeList[0].fixAttributeCommonVO){
                param.attendeeId=this.attendeeList[0].fixAttributeCommonVO.attendeeId
            }
            getRoomTaskList(param).then(response => {
                if (response.success) {
                    console.log('roomTaskList' + response.result.list)

                    // response.result.list.forEach(item => {
                    //     // item.endDate = getSubtDate(item.endDate, 0)
                    //     item.endDateStr = getSubtDate(item.endDate, 0)
                    // })

                    this.roomTaskList = response.result.list
                    this.pageInfo.total = response.result.total
                    this.paramData = param
                }
            })
        },
        getRoomFormOptions() {
            getRoomFormList({ conferenceId: getConferenceId() }).then(response => {
                if (response.success) {
                    this.roomFormOptions = response.result.list
                    console.log('roomformoptions ' + this.roomFormOptions)
                }
            })
        },
        getHotelOptions() {
            getHotelList({ conferenceId: getConferenceId() }).then(response => {
                if (response.success) {
                    this.hotelOptions = response.result.list
                }
            })
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
</style>
