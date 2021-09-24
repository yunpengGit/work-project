<template>
    <div class="">
        <div v-show="defaultCheck === null|| defaultCheck === ''" class="marginleftClass" style="height:30px">
            <span v-show="xietongs !== null && xietongs.length > 0" style="float:left">筛选：</span>
            <el-checkbox
                v-show="xietongs !== null && xietongs.length > 0"
                v-model="checkAll"
                style="float:left"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange"
            >全选</el-checkbox>
            <el-checkbox-group
                v-model="xietong"
                style="float:left;margin-left:30px"
                @change="handleCheckedCitiesChange"
            >
                <el-checkbox v-for="xieton in xietongs" :key="xieton.value" :label="xieton.value">{{ xieton.text }}
                </el-checkbox>
            </el-checkbox-group>
        </div>
        <div
            class=""
            :style="{'height':treeHeight + 'px','overflow-x':'hidden','overflow-y':'auto', 'padding-bottom': '10px'}"
        >
            <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                <div
                    v-show="defaultCheck === 'useRoomFlag' || defaultCheck === 'useCardFlag'"
                    style="background-color: white;padding-top:10px;padding-right: 10px;padding-bottom: 10px"
                >
                    <div
                        v-if="fangData !== null && fangData.length > 0 && xietong.indexOf('useRoomFlag') !== -1"
                        style="background-color: white;padding-top:10px;padding-right: 10px;padding-bottom: 10px"
                    >
                        <el-card
                            v-for="fangView in fangData"
                            :key="fangView.id"
                            class="box-card"
                            shadow="never"
                            style="border-radius:8px;margin-top:5px"
                        >
                            <div class="text item fanghaoClass">
                                <i class="el-icon-office-building" style="color:#FF8200" /><span
                                    class="jiudianClass"
                                    style="margin-left:5px"
                                >{{ fangView.roomFormVO.hotelVO.name }}</span>
                                <!-- <el-button style="float: right; padding: 3px 0" type="text">查看详情</el-button> -->
                            </div>
                            <div style="width:100%;height:8px" />
                            <div class="text item fanghaoClass">
                                {{ fangView.roomFormVO.modelName }}
                                <el-divider direction="vertical" /> {{ fangView.roomNo }}
                            </div>
                            <div style="width:100%;height: 6px" />
                            <div class="text item dizhiClass">
                                地址：{{ fangView.roomFormVO.hotelVO.address }}
                            </div>
                            <div style="width:100%;height:6px" />
                            <div class="text item dizhiClass">
                                时间：{{ fangView.startDate }} - {{ fangView.endDate }}
                                <span style="float: right">共{{ fangView.days }}天</span>
                            </div>
                        </el-card>

                    </div>
                    <!-- <div
                        v-if="(fangData === null && fangData.length === 0) && xietong.indexOf('useRoomFlag') !== -1"
                        :style="{'text-align':'center'}"
                    >
                        <div style="margin-top:60px;"><img src="@/assets/tree-no-data.png"></div>
                        <div
                            style="margin-left:-12px;margin-top:20px;font-size: 14px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.48);line-height: 18px;"
                        >
                            暂无数据</div>
                    </div> -->
                    <br>
                    <div
                        v-if="piaoData !== null && piaoData.length > 0 && xietong.indexOf('useCardFlag') !== -1"
                        style="background-color: white;padding-top:10px;padding-right: 10px;padding-bottom: 10px"
                    >
                        <div style="width:100%;">
                            <el-card
                                v-for="piaoView in piaoData"
                                :key="piaoView.id"
                                class="box-card jiabinzhengImageClass"
                                shadow="never"
                            >
                                <div style="width: 100%;height:25px" />
                                <div style="text-align:center;font-size: 20px" class="jiabinMIngziCLass">
                                    {{ piaoView.cardName }}
                                </div>
                                <div style="width: 100%;height:25px" />
                                <div class="bottom clearfix" style="text-align: center;">
                                    <time class="time jiabinshijianClass">
                                        有效期：{{ piaoView.effectiveTime !== null && piaoView.effectiveTime !== '' && piaoView.effectiveTime.length > 16 ? piaoView.effectiveTime.substr(0,16) : piaoView.effectiveTime }}
                                        ~{{ piaoView.invalidTime !== null && piaoView.invalidTime !== '' && piaoView.invalidTime.length > 16 ? piaoView.invalidTime.substr(0,16) : piaoView.invalidTime }}
                                    </time>
                                </div>
                            </el-card>
                        </div>
                    </div>
                    <!-- <div
                        v-if="(piaoData === null || piaoData.length === 0) && xietong.indexOf('useCardFlag') !== -1"
                        :style="{'text-align':'center'}"
                    >
                        <div style="margin-top:60px;"><img src="@/assets/tree-no-data.png"></div>
                        <div
                            style="margin-left:-12px;margin-top:20px;font-size: 14px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.48);line-height: 18px;"
                        >
                            暂无数据</div>
                    </div> -->
                </div>
                <div
                    v-show="defaultCheck !== 'useRoomFlag' && defaultCheck !== 'useCardFlag' && defaultCheck !== 'useDinnerFlag'"
                    style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px;padding-bottom: 10px"
                >
                    <div
                        v-show="zhuancheList !== null && zhuancheList.length > 0"
                        style="width:100%;padding-left:8px;padding-right:16px;"
                    >
                        <el-row
                            v-for="zhuanche in zhuancheList"
                            :key="'zhuanche' + zhuanche.id"
                            style="background: #EBF8FF;height:96px;padding;color:rgba(25, 31, 36, 0.64);padding-left:10px;padding-right:10px;padding-top:15px;margin-top:5px;"
                        >
                            <el-col :span="4" style="text-align:center;height:48px;">
                                用车时间：
                            </el-col>
                            <el-col :span="20" style="text-align:left;height:48px;">
                                {{ GMTToStrNianYueRiOfChiness(zhuanche.startTime) }} 至  {{ GMTToStrNianYueRiOfChiness(zhuanche.endTime) }}
                            </el-col>
                            <el-col :span="4" style="text-align:center;height:48px;">
                                车辆信息：
                            </el-col>
                            <el-col :span="8" style="text-align:left;height:48px;">
                                {{ zhuanche.vehicle.vehicleTypeVO.name }}({{ zhuanche.vehicle.platNum }})
                            </el-col>
                            <el-col :span="4" style="text-align:center;height:48px;">
                                司机信息：
                            </el-col>
                            <el-col :span="8" style="text-align:left;height:48px;">
                                {{ zhuanche.driverVO.name }}({{ zhuanche.driverVO.phone }})
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <div
                    v-show="defaultCheck !== 'useRoomFlag' && defaultCheck !== 'useCardFlag'"
                    style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px;padding-bottom: 10px"
                >

                    <div
                        v-show="!(xietong.indexOf('useVehicleFlag') === -1 && xietong.indexOf('useDinnerFlag') === -1) && (data !== null && data.length > 0)"
                        style="width:100%"
                    >

                        <el-tree
                            v-show="data !== null && data.length > 0"
                            ref="tree"
                            :data="data"
                            :props="defaultProps"
                            default-expand-all
                            :expand-on-click-node="false"
                            :render-content="renderContent"
                            :filter-node-method="filterNode"
                            class="xingchengxinxi"
                        />
                    </div>
                    <!-- <div
                        v-show="!(xietong.indexOf('useVehicleFlag') === -1 && xietong.indexOf('useDinnerFlag') === -1) && !(data !== null && data.length > 0)"
                        :style="{'text-align':'center'}"
                    >
                        <div style="margin-top:60px;"><img src="@/assets/tree-no-data.png"></div>
                        <div
                            style="margin-left:-12px;margin-top:20px;font-size: 14px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.48);line-height: 18px;"
                        >
                            暂无数据</div>
                    </div> -->
                    <div
                        v-if="fangData !== null && fangData.length > 0 && xietong.indexOf('useRoomFlag') !== -1"
                        style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px;padding-bottom: 10px"
                    >
                        <el-divider v-if="fangData !== null && fangData.length > 0">住房安排</el-divider>
                        <el-row>
                            <el-col v-for="fangView in fangData" :key="fangView.id" :span="12">
                                <div style="width:100%;display: flex;align-items: center;justify-content: center;">
                                    <el-card class="box-card" shadow="never" style="width:300px;border-radius:8px">
                                        <div class="text item fanghaoClass">
                                            <i class="el-icon-office-building" style="color:#FF8200" /><span
                                                class="jiudianClass"
                                                style="margin-left:5px"
                                            >{{ fangView.roomFormVO.hotelVO.name }}</span>
                                            <!-- <el-button style="float: right; padding: 3px 0" type="text">查看详情</el-button> -->
                                        </div>
                                        <div style="width:100%;height:8px" />
                                        <div class="text item fanghaoClass">
                                            {{ fangView.roomFormVO.modelName }}
                                            <el-divider direction="vertical" /> {{ fangView.roomNo }}
                                        </div>
                                        <div style="width:100%;height: 6px" />
                                        <div class="text item dizhiClass">
                                            地址：{{ fangView.roomFormVO.hotelVO.address }}
                                        </div>
                                        <div style="width:100%;height:6px" />
                                        <div class="text item dizhiClass">
                                            时间：{{ fangView.startDate }} - {{ fangView.endDate }}
                                            <span style="float: right">共{{ fangView.days }}天</span>
                                        </div>
                                    </el-card>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div
                        v-if="piaoData !== null && piaoData.length > 0 && xietong.indexOf('useCardFlag') !== -1"
                        style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px;padding-bottom: 10px"
                    >
                        <el-divider>票证安排</el-divider>
                        <el-row>
                            <el-col v-for="piaoView in piaoData" :key="piaoView.id" :span="12">
                                <div style="width:100%;display: flex;align-items: center;justify-content: center;">
                                    <el-card class="box-card jiabinzhengImageClass" style="width:300px;" shadow="never">
                                        <div style="width: 100%;height:25px" />
                                        <div style="text-align:center;font-size: 20px" class="jiabinMIngziCLass">
                                            {{ piaoView.cardName }}
                                        </div>
                                        <div style="width: 100%;height:25px" />
                                        <div class="bottom clearfix" style="text-align: center;">
                                            <time class="time jiabinshijianClass">
                                                有效期：{{ piaoView.effectiveTime !== null && piaoView.effectiveTime !== '' && piaoView.effectiveTime.length > 16 ? piaoView.effectiveTime.substr(0,16) : piaoView.effectiveTime }}
                                                ~{{ piaoView.invalidTime !== null && piaoView.invalidTime !== '' && piaoView.invalidTime.length > 16 ? piaoView.invalidTime.substr(0,16) : piaoView.invalidTime }}
                                            </time>
                                        </div>
                                    </el-card>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script>
import { getXingchengListByUser } from '@/api/agenda'
import { getSpecialTaskByAttendee } from '@/api/special'
import { getView as getConferenceView } from '@/api/conference'
import { getConferenceId } from '@/utils/conference-auth'
import { GMTToStrNianYueRiOfChiness } from '@/utils/index'

export default {
    name: 'XingchengTree',
    props: {
        attendeeId: {
            type: null,
            default: null
        },
        treeHeight: {
            type: Number,
            default: 270
        },
        defaultCheck: {
            type: null,
            default: null
        }
    },
    data() {
        return {
            allCheckeds: [],
            xietong: [],
            ruleForm: {},
            rules: {},
            checkAll: true,
            isIndeterminate: false,
            xietongs: [],
            defaultProps: {
                children: 'vehicleDinnerTaskVOList',
                label: 'name'
            },
            data: [],
            fangData: [],
            piaoData: [],
            zhuancheList: []
        }
    },
    watch: {
        defaultCheck(val) {
            if (val !== null && val !== '') {
                this.getConferenceView()
            }
        },
        attendeeId(val) {
            if (val !== null) {
                this.getXingchengListByUser(val)
                this.getSpecialTaskByAttendee(val)
            } else {
                this.data = []
                this.fangData = []
                this.piaoData = []
                this.zhuancheList = []
            }
        }
    },
    created() {
        if (this.attendeeId !== null && this.attendeeId !== '' && this.attendeeId !== 0) {
            this.getXingchengListByUser(this.attendeeId)
            this.getSpecialTaskByAttendee(this.attendeeId)
        }
        this.getConferenceView()
    },
    methods: {
        GMTToStrNianYueRiOfChiness(val) {
            return GMTToStrNianYueRiOfChiness(val)
        },
        getSpecialTaskByAttendee(val) {
            getSpecialTaskByAttendee({ conferenceId: getConferenceId(), attendeeId: val }).then(res => {
                if (res.success) {
                    if (res.result.total > 0) {
                        this.zhuancheList = res.result.list
                    }
                }
            })
        },
        getConferenceView() {
            this.allCheckeds = []
            this.xietong = []
            this.xietongs = []
            getConferenceView({ 'id': getConferenceId() }).then(res => {
                if (res.result.useVehicleFlag === 1) {
                    this.allCheckeds.push('useVehicleFlag')
                    this.xietong.push('useVehicleFlag')
                    this.xietongs.push({ value: 'useVehicleFlag', text: '用车' })
                }
                if (res.result.useRoomFlag === 1) {
                    this.allCheckeds.push('useRoomFlag')
                    this.xietong.push('useRoomFlag')
                    this.xietongs.push({ value: 'useRoomFlag', text: '用房' })
                }
                if (res.result.useCardFlag === 1) {
                    this.allCheckeds.push('useCardFlag')
                    this.xietong.push('useCardFlag')
                    this.xietongs.push({ value: 'useCardFlag', text: '票证' })
                }
                if (res.result.useDinnerFlag === 1) {
                    this.allCheckeds.push('useDinnerFlag')
                    this.xietong.push('useDinnerFlag')
                    this.xietongs.push({ value: 'useDinnerFlag', text: '用餐' })
                }

                if (this.defaultCheck !== null && this.defaultCheck !== '') {
                    this.xietong = [this.defaultCheck]
                    setTimeout(() => {
                        this.$refs.tree.filter()
                    }, 100)
                }
            })
        },
        handleCheckAllChange(val) {
            this.xietong = val ? this.allCheckeds : []
            this.isIndeterminate = false
            this.$refs.tree.filter()
        },
        handleCheckedCitiesChange(value) {
            const checkedCount = value.length
            this.checkAll = checkedCount === this.allCheckeds.length
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.allCheckeds.length
            this.$refs.tree.filter()
        },
        getXingchengListByUser(val) {
            getXingchengListByUser({ 'attendeeId': val }).then(res => {
                this.data = res.result.vehicleDinnerDateList
                this.fangData = res.result.roomTaskList
                this.piaoData = res.result.cardList
            })
        },
        filterNode(value, data) {
            if (this.xietong.indexOf('useVehicleFlag') === -1 && this.xietong.indexOf('useDinnerFlag') === -1) {
                return false
            }
            if (data.taskType === undefined) {
                return false
            } else if (data.taskType === 1 && this.xietong.indexOf('useVehicleFlag') !== -1) {
                return true
            } else if (data.taskType === 2 && this.xietong.indexOf('useDinnerFlag') !== -1) {
                return true
            }
            return false
        },
        renderContent(h, { node, data, store }) {
            if (data.taskDate !== undefined) {
                var dateStr = data.taskDate !== null && data.taskDate !== '' && data.taskDate.length > 10 ? data.taskDate.substr(0, 10) : data.taskDate
                return (
                    <span class='custom-tree-node' style='width:100%;padding-right:10px;'>
                        <span style='font-size: 14px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.64);line-height: 18px;'>{dateStr}</span>
                    </span>)
            } else {
                if (data.taskType === 1) {
                    var dateStr1 = data.vehicleTaskVO.startTime !== null && data.vehicleTaskVO.startTime !== '' && data.vehicleTaskVO.startTime.length > 10 ? data.vehicleTaskVO.startTime.substr(11, 5) : data.vehicleTaskVO.startTime
                    var dateStr2 = data.vehicleTaskVO.endTime !== null && data.vehicleTaskVO.endTime !== '' && data.vehicleTaskVO.endTime.length > 10 ? data.vehicleTaskVO.endTime.substr(11, 5) : data.vehicleTaskVO.endTime
                    return (
                        <span class='custom-tree-node' style='width:100%;padding-right:10px;'>
                            <el-row>
                                <el-col span={7}>
                                    <span style='font-size:14px;line-height:32px;color:#191F24;'>{dateStr1 + '-' + dateStr2}<span style='font-family: PingFangSC-Medium, PingFang SC;margin-left:4px;color:#1E89FF;font-size:14px;line-height: 18px;font-weight: 500;'>{data.vehicleTaskVO.typeStr}</span></span>
                                </el-col>
                                <el-col span={17} style='padding-top:5ox;padding-bottom:10px'>
                                    <div style='border-left: solid 1px rgba(25, 31, 36, 0.12);padding-left:30px;font-size:14px;line-height:32px;color:#191F24;'><span style='font-family: PingFangSC-Medium, PingFang SC;color:#191F24;font-size:14px;line-height: 18px;font-weight: 400;'>{data.vehicleTaskVO.startAddress ? data.vehicleTaskVO.startAddress : '无'}  →  {data.vehicleTaskVO.endAddress ? data.vehicleTaskVO.endAddress : '无'}</span></div>
                                    <div style='border-left: solid 1px rgba(25, 31, 36, 0.12);padding-left:30px;font-size: 12px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.64);line-height: 16px;'>{'司机：' + data.vehicleTaskVO.driverVO.name + '(' + data.vehicleTaskVO.driverVO.phone + ')'}</div>
                                    <div style='border-left: solid 1px rgba(25, 31, 36, 0.12);padding-left:30px;font-size: 12px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.64);line-height: 16px;'>{'车型：' + data.vehicleTaskVO.vehicle.vehicleTypeVO.name + '-' + data.vehicleTaskVO.vehicle.platNum}</div>
                                </el-col>
                            </el-row>
                        </span>)
                } else {
                    var dateStr3 = data.dinnerTaskVO.startTime !== null && data.dinnerTaskVO.startTime !== '' && data.dinnerTaskVO.startTime.length > 6 ? data.dinnerTaskVO.startTime.substr(0, 5) : data.dinnerTaskVO.startTime
                    var dateStr4 = data.dinnerTaskVO.endTime !== null && data.dinnerTaskVO.endTime !== '' && data.dinnerTaskVO.endTime.length > 6 ? data.dinnerTaskVO.endTime.substr(0, 5) : data.dinnerTaskVO.endTime
                    return (
                        <span class='custom-tree-node' style='width:100%;padding-right:10px;'>
                            <el-row>
                                <el-col span={7}>
                                    <span style='font-size:14px;line-height:32px;color:#191F24;'>{dateStr3 + '-' + dateStr4}<span style='font-family: PingFangSC-Medium, PingFang SC;margin-left:4px;color:#FF8200;font-size:14px;line-height: 18px;font-weight: 500;'>{data.dinnerTaskVO.typeCode}</span></span>
                                </el-col>
                                <el-col span={17} style='padding-top:5ox;padding-bottom:10px'>
                                    <span style='border-left: solid 1px rgba(25, 31, 36, 0.12);padding-left:30px;font-size:14px;line-height:32px;color:#191F24;' title={data.dinnerTaskVO.dining.dinnerRoom !== null && data.dinnerTaskVO.dining.dinnerRoom.length > 20 ? data.dinnerTaskVO.dining.dinnerRoom : ''}>{data.dinnerTaskVO.dining.dinnerRoom !== null && data.dinnerTaskVO.dining.dinnerRoom.length > 20 ? data.dinnerTaskVO.dining.dinnerRoom.substr(0, 20) + '...' : data.dinnerTaskVO.dining.dinnerRoom}</span>
                                </el-col>
                            </el-row>
                        </span>)
                }
            }
        }
        // this.getListByUser(val.id)
    }

}
</script>
<style lang="scss" scoped>
.fanghaoClass {
    font-size: 15px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #191f24;
    line-height: 20px;
}
.dizhiClass {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(25, 31, 36, 0.64);
    line-height: 16px;
}

.jiudianClass {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(25, 31, 36, 0.64);
    line-height: 16px;
}
.jiabinMIngziCLass {
    font-size: 23px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #1e89ff;
    line-height: 32px;
    background: linear-gradient(180deg, #ffeec1 0%, #d4bd8e 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.jiabinshijianClass {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.64);
    line-height: 16px;
}
</style>
