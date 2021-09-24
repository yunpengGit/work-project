<template>
    <div style="background-color:white;padding-top:8px">

        <el-form
            ref="form"
            :style="{'height': tableHeight,'overflow-x':'hidden','overflow-y':'auto', 'margin-top': '15px'}"
            label-position="right"
            label-width="27%"
            :model="form"
        >

            <el-scrollbar style="height:100%">

                <el-divider> 票证信息</el-divider>
                <div style="background-color: white;padding-left:10px;padding-right: 10px">
                    <div style="float: right;padding-bottom:5px;">
                        <el-button type="primary" @click="addCard">添加</el-button>
                    </div>
                    <el-table
                        ref="table"
                        :data="list.cardList"
                        style="width: 100%;margin-bottom:60px"
                        :header-cell-style="{
                            background:'#f7f7f7'
                        }"
                    >
                        <el-table-column label="证件名称" align="center" prop="cardName" />

                        <el-table-column label="证件状态" align="center" prop="cardStatusStr" />
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="deleteCard(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                </div>

                <el-divider> 车辆信息</el-divider>
                <div style="background-color: white;padding-left:10px;padding-right: 10px">
                    <div style="float: right;padding-bottom:5px;">
                        <el-button type="primary" @click="addCar">添加</el-button>
                    </div>
                    <el-table
                        ref="table"
                        :data="list.vehicleTaskList"
                        style="width: 100%;margin-bottom:60px"
                        :header-cell-style="{
                            background:'#f7f7f7'
                        }"
                    >
                        <el-table-column label="任务类型" align="center" prop="typeStr" width="100px" />

                        <el-table-column label="用车时间" align="center" width="180px">
                            <template slot-scope="scope">
                                <div class="content1">
                                    {{ scope.row.startTime.slice(5,16) }}~{{ scope.row.endTime.slice(5,16) }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="出发地点" align="center">
                            <template slot-scope="scope">
                                <div :title="scope.row.startAddress" class="content1">
                                    {{ scope.row.startAddress }}
                                </div>
                            </template>

                        </el-table-column>
                        <el-table-column label="目的地点" align="center">
                            <template slot-scope="scope">
                                <div :title="scope.row.endAddress" class="content1">
                                    {{ scope.row.endAddress }}
                                </div>
                            </template>

                        </el-table-column>

                        <el-table-column label="车牌号" align="center" prop="vehicle.platNum" />
                        <el-table-column label="车型" align="center" width="80px" prop="vehicle.vehicleTypeVO.name" />
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="deleteVehicle(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                </div>
                <el-divider> 餐饮信息</el-divider>
                <div style="background-color: white;padding-left:10px;padding-right: 10px">
                    <div style="float: right;padding-bottom:5px;">
                        <el-button type="primary" @click="addDining">添加</el-button>
                    </div>
                    <el-table
                        ref="table"
                        :data="list.dinnerTaskList"
                        style="width: 100%;margin-bottom:60px"
                        :header-cell-style="{
                            background:'#f7f7f7'
                        }"
                    >
                        <el-table-column label="用餐类型" align="center" prop="typeCode" />

                        <el-table-column label="用餐时间" align="center" width="230px">
                            <template slot-scope="scope">
                                <div class="content1">
                                    {{ scope.row.dinnerDate.slice(5,10) }} {{ scope.row.startTime.slice(0,5) }} ~
                                    {{ scope.row.endTime.slice(0,5) }}
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column label="餐厅" align="center" prop="dining.dinnerRoom" />
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="deleteDining(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                </div>

                <el-divider> 住宿信息</el-divider>
                <div style="background-color: white;padding-left:10px;padding-right: 10px">
                    <div style="float: right;padding-bottom:5px;">
                        <el-button type="primary" @click="addHotel">添加</el-button>
                    </div>
                    <el-table
                        ref="table"
                        :data="list.roomTaskList"
                        style="width: 100%;margin-bottom:60px"
                        :header-cell-style="{
                            background:'#f7f7f7'
                        }"
                    >
                        <el-table-column label="酒店" align="center" prop="roomFormVO.hotelVO.name" />

                        <el-table-column label="房型" align="center" prop="roomFormVO.modelName" />

                        <el-table-column label="房间号" align="center" prop="roomNo" />

                        <el-table-column label="入住时间" align="center" width="230px">
                            <template slot-scope="scope">
                                <div class="content1">
                                    {{ scope.row.startDate.slice(5,10) }} ~
                                    {{ scope.row.endDate.slice(5,10) }}
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="deleteHotel(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                </div>

            </el-scrollbar>

        </el-form>
        <cardDialog ref="cardDialog" @closeDialog="closeCardDialog" />
        <carDialog ref="carDialog" @closeDialog="closeCarDialog" />
        <diningDialog ref="diningDialog" @closeDialog="closeDiningDialog" />
        <hotelDialog ref="hotelDialog" @closeDialog="closeHotelDialog" />
    </div>
</template>

<script>
import { getAllResourceList, deleteVehicleTaskAttendee, getAttendeeList } from '@/api/car'
import { updateAttendeeCardStatus } from '@/api/card'
import { deleteDiningTaskAttendee } from '@/api/dining'
import { deleteAttendeeInRoom } from '@/api/hotel'
import { getList } from '@/api/attendee'
import { getTableHeight } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'

import cardDialog from '@/views/cardManage/distribution/components/taskDialog'
import carDialog from '@/views/carManage/distribution/components/taskDialog'
import diningDialog from '@/views/diningManage/distribution/components/taskDialog'
import hotelDialog from '@/views/hotelManage/distribution/components/taskDialog'

export default {
    name: 'ResourceView',
    components: { cardDialog, carDialog, diningDialog, hotelDialog },
    // import引入的组件需要注入到对象中才能使用
    // 例如：import 《组件名称》 from '《组件路径》';
    props: {
        attendeeId: {
            type: String,
            default: ''
        },
        tableHeight: {
            type: String,
            default: getTableHeight(131) + 'px'
        }
    },
    data() {
        // 这里存放数据
        return {
            form: {

            },
            attendeeInfoList: [],
            list: []
            // tableHeight: getTableHeight(101) + 'px'
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {},
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() { },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.getAllResourceList()

        const val = []
        val.push(this.attendeeId)
        getList({ 'conferenceId': getConferenceId(), 'attendeeIdsIn': val, 'attendeeRoleFlagEqual': [0, 1, 2] }).then(res => {
            if (res.success) {
                this.attendeeInfoList = res.result.list
                this.attendeeInfoList.forEach(item => {
                    item.attendee = item
                    item.attendeeId = item.fixAttributeCommonVO.attendeeId
                })
            }
        })
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
    // 方法集合
    methods: {
        addHotel() {
            // 防止当前页面删除后任务列表的数据没有刷新
            if (this.$refs['hotelDialog'].$refs['diningTask']) {
                this.$refs['hotelDialog'].$refs['diningTask'].getListInfo(this.$refs['hotelDialog'].$refs['diningTask'].paramData)
            }
            this.$refs['hotelDialog'].showDialog(this.attendeeInfoList)
        },
        closeHotelDialog() {
            // this.$refs["hotelDialog"].dialogVisible = false;
            this.getAllResourceList()
        },
        //* ******/
        closeDiningDialog() {
            this.$refs['diningDialog'].dialogVisible = false
            this.getAllResourceList()
        },
        addDining() {
            if (this.$refs['diningDialog'].$refs['diningTask']) {
                this.$refs['diningDialog'].$refs['diningTask'].getListInfo(this.$refs['diningDialog'].$refs['diningTask'].paramData)
            }
            const ids = []
            ids.push(this.attendeeId)
            this.$refs['diningDialog'].showDialog(ids)
        },
        //* ******/
        closeCarDialog() {
            this.$refs['carDialog'].dialogVisible = false
            this.getAllResourceList()
        },
        addCar() {
            if (this.$refs['carDialog'].$refs['carTask']) {
                this.$refs['carDialog'].$refs['carTask'].getListInfo(this.$refs['carDialog'].$refs['carTask'].paramData)
            }
            const ids = []
            ids.push(this.attendeeId)
            this.$refs['carDialog'].showDialog(ids)
        },
        //* ******/
        closeCardDialog() {
            this.$refs['cardDialog'].dialogVisible = false
            this.getAllResourceList()
        },
        addCard() {
            if (this.$refs['cardDialog'].$refs['diningTask']) {
                this.$refs['cardDialog'].$refs['diningTask'].getCardOptions()
            }

            this.$refs['cardDialog'].showDialog(this.attendeeInfoList)
        },
        //* *****弹框部分 */
        handleAdd() {

        },
        deleteHotel(index, row) {
            const param = { 'roomId': row.roomId, 'attendeeId': this.attendeeId, 'startDate': row.startDate, 'endDate': row.endDate }
            this.deleteAttendeeInRoom(param)
        },
        deleteAttendeeInRoom(param) {
            deleteAttendeeInRoom(param).then(res => {
                if (res.success) {
                    this.$message('操作成功')
                    this.getAllResourceList()
                }
            })
        },
        deleteDining(index, row) {
            const attendees = [{ 'id': this.attendeeId }]
            const param = { 'taskId': row.id, 'attendees': attendees }
            this.deleteDiningTaskAttendee(param)
        },

        deleteDiningTaskAttendee(param) {
            deleteDiningTaskAttendee(param).then(res => {
                if (res.success) {
                    this.$message('操作成功')
                    this.getAllResourceList()
                }
            })
        },
        deleteVehicle(index, row) {
            const attendees = [{ 'id': this.attendeeId }]
            const param = { 'taskId': row.id, 'attendees': attendees }
            this.deleteVehicleTaskAttendee(param)
        },
        deleteVehicleTaskAttendee(param) {
            deleteVehicleTaskAttendee(param).then(res => {
                if (res.success) {
                    this.$message('操作成功')
                    this.getAllResourceList()
                }
            })
        },
        deleteCard(index, row) {
            const cardAttendeeList = []
            const cardAttendee = { 'attendee': { 'id': this.attendeeId }, 'card': { 'id': row.id }}
            cardAttendeeList.push(cardAttendee)
            const param = { 'cardAttendeeList': cardAttendeeList, 'cardStatus': '6' } // 取消为6
            console.log(param)
            this.updateAttendeeCardStatus(param)
        },
        updateAttendeeCardStatus(param) {
            updateAttendeeCardStatus(param).then(res => {
                if (res.success) {
                    this.$message('操作成功')
                    this.getAllResourceList()
                }
            })
        },
        getAllResourceList() {
            getAllResourceList({ 'attendeeId': this.attendeeId }).then(res => {
                if (res.success) {
                    this.list = res.result
                }
            })
        }
    }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
</style>
