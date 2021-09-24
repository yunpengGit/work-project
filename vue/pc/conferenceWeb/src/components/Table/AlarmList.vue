<template>
    <transition name="el-zoom-in-bottom">
        <div class="alarmList">
            <div class="clearfix title-row-wrapper">
                <div class="left">
                    当前告警
                </div>
                <div class="center">
                    <span>
                        <i class="el-icon-star-on" style="color: #e32f46;" />
                        紧急 12
                    </span>
                    <span>
                        <i class="el-icon-star-on" style="color: #e32f46;" />
                        严重 10
                    </span>
                    <span>
                        <i class="el-icon-star-on" style="color: #e32f46;" />
                        重要 12
                    </span>
                    <span>
                        <i class="el-icon-star-on" style="color: #e32f46;" />
                        次要 10
                    </span>
                    <span>
                        <i class="el-icon-star-on" style="color: #e32f46;" />
                        警告 10
                    </span>
                    <i style="margin-left: 50px;">
                        <el-button size="mini" type="primary">批量确认</el-button>
                    </i>
                </div>
                <div class="right">
                    <i class="el-icon-circle-close" title="关闭" style="font-size: 22px;" @click="toggleAlarmTable()" />
                </div>
            </div>
            <el-table
                :data="tableData"
                border
                style="width: 100%"
                max-height="300px"
            >
                <el-table-column
                    type="selection"
                    width="45"
                />
                <el-table-column
                    prop="level"
                    label="告警级别"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.level === 4" style="color: #f00;">严重</span>
                        <span v-else-if="scope.row.level === 3" style="color: #ff8c37;">重要</span>
                        <span v-else-if="scope.row.level === 2" style="color: #0ff;">预警</span>
                        <span v-else>正常</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="content"
                    label="告警内容"
                />
                <el-table-column
                    prop="device"
                    label="告警设备"
                />
                <el-table-column
                    prop="address"
                    label="位置"
                />
                <el-table-column
                    prop="date"
                    label="发生时间"
                />
                <el-table-column
                    prop="confirmStatus"
                    label="确认状态"
                />
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="80"
                >
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            size="mini"
                            @click.native.prevent="deleteRow(scope.$index, tableData)"
                        >
                            确认
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'AlarmList',
    data() {
        return {
            tableData: [{
                id: '1',
                date: '2016-05-04',
                address: '北京',
                device: '暖通设备',
                content: '告警内容1',
                level: 3,
                confirmStatus: '已确认'
            }, {
                id: '2',
                date: '2016-05-04',
                address: '北京',
                device: '暖通设备',
                content: '告警内容1',
                level: 1,
                confirmStatus: '已确认'
            }, {
                id: '3',
                date: '2016-05-04',
                address: '北京',
                device: '暖通设备',
                content: '告警内容1',
                level: 2,
                confirmStatus: '已确认'
            }, {
                id: '4',
                date: '2016-05-04',
                address: '北京',
                device: '暖通设备',
                content: '告警内容1',
                level: 3,
                confirmStatus: '已确认'
            }, {
                id: '5',
                date: '2016-05-04',
                address: '北京',
                device: '暖通设备',
                content: '告警内容1',
                level: 4,
                confirmStatus: '未确认'
            }]
        }
    },
    methods: {
        deleteRow(index, data) {

        },
        toggleAlarmTable() {
            this.$store.dispatch('sideBar/toggleAlarmTable')
        }
    }
}
</script>
<style lang="scss" scoped>
    .alarmList {
        position: absolute;
        bottom: 25px;
        width: 100%;
        z-index: 9999;
        background: #fff;
        padding: 0 20px;
        -webkit-box-shadow: 2px 2px 6px rgba(0,0,0,0.5);
        box-shadow: 2px 2px 6px rgba(0,0,0,0.5);

        .title-row-wrapper {
            line-height: 44px;

            .left {
                float: left;
            }

            .center {
                float: right;
                font-size: 12px;
                margin-right: 120px;

                & span {
                    margin-left: 20px;
                }
            }

            .right {
                position: absolute;
                right: 20px;
                top: 3px;
            }
        }

    }
</style>
