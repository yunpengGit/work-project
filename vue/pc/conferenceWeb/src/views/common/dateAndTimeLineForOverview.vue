<template>
    <div style="height:100%;background-color:#ffffff" class="rili">
        <div class="datei">
            <div style="width: 100%;height: 20%;padding:16px">
                <div class="zuoshangriqi" style="float: left">
                    {{ huoquriqi(value) }}
                </div>
                <div class="zuoshangwenzi" style="float: left;margin-top:20px;margin-left:2px">
                    日
                </div>
                <div style="float:right;cursor:pointer" class="jiantouDiv" @click="xiageyue">
                    <i style="width:10px;height:20px" class="el-icon-arrow-right" />
                </div>
                <div style="float:right;">
                    <div class="yuefen" style="margin-top:9px;text-align:center">{{ GMTToStrYYYYMMOfChiness(value) }}</div>
                </div>
                <div style="float:right;cursor:pointer" class="jiantouDiv" @click="shanggeyue">
                    <i style="width:10px;height:20px" class="el-icon-arrow-left" />
                </div>
            </div>
            <el-calendar v-model="value" style="height:80%">
                <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
                <template
                    slot="dateCell"
                    slot-scope="{data}"
                >
                    <div class="riliriqiClass" :style="data.isSelected ? {'background-color':'#1E89FF','color': 'white'} : {}" @click="dakaixicheng(data.day)">
                        <div style="height:15px;width:15px;">
                            {{ data.day.split('-').slice(2).join('-') }}
                        </div>
                        <div v-show="agendaDates.indexOf(data.day) !== -1">
                            <div class="rilixiaoyuandianClass" :style="data.isSelected ? {'background-color':'#FFFFFF'}:{'background-color':'#1E89FF'}" />
                        </div>
                    </div>
                </template>
            </el-calendar>

            <!-- <el-calendar v-model="value" /> -->
        </div>
        <div class="timeline">
            <div v-show="!(conderences !== null && conderences.length > 0)" :style="{'text-align':'center'}">
                <div style="margin-top:20px;"><img src="@/assets/table-no-data.png"></div>
                <div style="margin-left:-12px;margin-top:20px;font-size: 14px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.48);line-height: 18px;">暂无数据</div>
            </div>
            <div v-for="conference in conderences" :key="conference.id">
                <div class="timelinetitle">
                    {{ conference.name }}
                </div>
                <el-timeline>
                    <el-timeline-item v-for="aendaParent in conference.conferenceAgendas" :key="aendaParent.id" :timestamp="(aendaParent.startTime !== null && aendaParent.startTime.length > 5 ? aendaParent.startTime.substr(0,5) : aendaParent.startTime) + '-' + (aendaParent.endTime !== null && aendaParent.endTime.length > 5 ? aendaParent.endTime.substr(0,5) : aendaParent.endTime)" placement="top" color="#1E89FF">
                        <div class="phei">{{ zuidashigezifu(aendaParent.name) }}</div>
                        <div class="phui">{{ zuidashigezifu(aendaParent.address) }}</div>
                        <div v-if="aendaParent.children !== null && aendaParent.children.length > 0" style="padding-top:15px">
                            <el-timeline>
                                <el-timeline-item v-for="aenda in aendaParent.children" :key="aenda.id" :timestamp="(aenda.startTime !== null && aenda.startTime.length > 5 ? aenda.startTime.substr(0,5) : aenda.startTime) + '-' + (aenda.endTime !== null && aenda.endTime.length > 5 ? aenda.endTime.substr(0,5) : aenda.endTime)" placement="top" color="#1E89FF">
                                    <div class="phei">{{ zuidashigezifu(aenda.name) }}</div>
                                    <div class="phui">{{ zuidashigezifu(aenda.address) }}</div>
                                </el-timeline-item>
                            </el-timeline>
                        </div>
                    </el-timeline-item>
                </el-timeline>
            </div>
        </div>
    </div>
</template>

<script>
import { selectListByGroupUserOrAttendee, queryListByDate } from '@/api/agenda'
import { getConferenceId } from '@/utils/conference-auth'
import { GMTToStrYYYYMMDD, GMTToStrYYYYMMOfChiness } from '@/utils/index'

export default {
    name: 'DateAndTimeLineForOverview',
    props: {
    },
    data() {
        return {
            value: new Date(),
            agendaDates: [],
            conderences: []
        }
    },
    watch: {
        value(val) {
            this.dakaixicheng(val)
        }
    },
    created() {
        this.selectListByGroupUserOrAttendee()
    },
    methods: {
        zuidashigezifu(val) {
            if (val === null) {
                return ''
            }
            if (val.length > 10) {
                return val.substr(0, 10) + '..'
            } else {
                return val
            }
        },
        xiageyue() {
            var date = new Date(this.value)

            var year = date.getFullYear()
            var month = '01'

            if (date.getMonth() === 11) {
                month = '01'
                year = year + 1
            } else {
                month = date.getMonth() + 2
                if (month < 10) {
                    month = '0' + month
                }
            }

            this.value = year + '-' + month + '-' + '01'
        },
        shanggeyue() {
            var date = new Date(this.value)

            var year = date.getFullYear()
            var month = '01'

            if (date.getMonth() === 0) {
                month = '12'
                year = year - 1
            } else {
                month = date.getMonth()
                if (month < 10) {
                    month = '0' + month
                }
            }

            this.value = year + '-' + month + '-' + '01'
        },
        GMTToStrYYYYMMOfChiness(val) {
            return GMTToStrYYYYMMOfChiness(val)
        },
        dakaixicheng(val) {
            if (this.agendaDates.indexOf(GMTToStrYYYYMMDD(val)) > -1) {
                if (this.$route.path === '/index') {
                    queryListByDate({ queryDate: GMTToStrYYYYMMDD(val) }).then(res => {
                        this.conderences = res.result
                    })
                } else {
                    queryListByDate({ queryDate: GMTToStrYYYYMMDD(val), conferenceId: getConferenceId() }).then(res => {
                        this.conderences = res.result
                    })
                }
            } else {
                this.conderences = []
            }
        },
        selectListByGroupUserOrAttendee() {
            if (this.$route.path === '/index') {
                selectListByGroupUserOrAttendee().then(res => {
                    this.agendaDates = res.result
                    this.panduanshifoujintian()
                })
            } else {
                selectListByGroupUserOrAttendee({ conferenceId: getConferenceId() }).then(res => {
                    this.agendaDates = res.result
                    this.panduanshifoujintian()
                })
            }
        },
        panduanshifoujintian() {
            if (this.agendaDates.indexOf(GMTToStrYYYYMMDD(this.value)) === -1) {
                this.agendaDates.some(item => {
                    // console.log(item)
                    // console.log(this.value)
                    if (item > GMTToStrYYYYMMDD(this.value)) {
                        this.value = item

                        return true
                    }
                })
            } else {
                this.dakaixicheng(this.value)
            }
        },
        huoquriqi(time) {
            if (time === null || time === '') {
                return ''
            }
            var date = new Date(time)
            var str = ''
            if (date.getDate() < 10) {
                str += '0' + date.getDate() + ''
            } else {
                str += date.getDate() + ''
            }

            return str
        }
    }
}
</script>

<style scoped>
.yuefen {
        width: 104px;
        height: 17px;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191F24;
        line-height: 17px;
    }
    .nongli {
        width: 104px;
        height: 13px;
        font-size: 9px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #191F24;
        line-height: 13px;
    }
    .jiantouDiv {
        padding-top:7px;
        padding-left:9px;
        width: 30px;
        height: 30px;
        background: #FAFAFA;
        border-radius: 4px;
        border: 1px solid rgba(25, 31, 36, 0.04);
    }
    .zuoshangriqi {
        width: 31px;
        height: 33px;
        font-size: 30px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191F24;
        line-height: 33px;
    }
    .zuoshangwenzi {
        width: 14px;
        height: 13px;
        font-size: 9px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #191F24;
        line-height: 13px;
    }
    .timeline {
        padding: 20px;
        background-color: #fafafa;
        height: 40%;
        overflow: auto;
    }
    .datei {
        height: 60%;
        overflow: hidden;
        /* zoom: 0.8; */
        /* overflow: auto; */
    }
    .phei {
         margin-top:4px;
        /* width: 200px; */
        /* height: 20px; */
        font-size: 15px;
        /* font-size: 1.25em; */
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #191F24;
        line-height: 20px;
    }
    .phui {
         margin-top:6px;
        font-size: 12px;
        /* font-size: 1em; */
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(25, 31, 36, 0.48);
        line-height: 16px;
    }
    .timelinetitle {
        /* font-size: 17px; */
        font-size: 1.4em;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191F24;
        /* line-height: 20px; */
        margin-bottom: 20px;
    }
    .el-timeline {
        font-size: inherit;
    }

</style>

<style>
    .rili .el-timeline-item__timestamp {
        /* font-size: 12px; */
        font-size: 1em;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(25, 31, 36, 0.48);
        line-height: 16px;
    }
    .rili .el-timeline-item__timestamp.is-top {
        margin-bottom: 1px;
        padding-top: 0px;
    }
    .rili .el-timeline-item__node--normal {
        width: 4px;
        height: 4px;
        left: 3px;
        top:2px;
    }

    .rili .el-calendar-table td {
        border: none;
        border-radius:50%;
    }
    .rili .el-calendar-table tr:first-child td {
        border: none
    }
    .rili .el-calendar-table tr td:first-child {
        border: none
    }
    .rili .el-calendar__body {
        height:90%
    }
    .rili .el-calendar__body .el-calendar-table {
        height:100%
    }
    .rili .el-calendar-table .el-calendar-day{
        text-align: center;
    }

    .rili .riliriqiClass {
        width:30px;
        height:30px;
        border-radius: 50%;
        padding:7px
    }
    .rili .rilixiaoyuandianClass {
        border-radius:50%;
        width:4px;
        height:4px;
        margin-left:35%
    }

    .rili .el-calendar-table .el-calendar-day {
        padding: 0px;
        height: 30px !important;
        text-align: center;
    }
    .rili .el-calendar__body {
        padding-top: 0px;
    }
    .rili .el-calendar-table thead th {
        padding-top: 5px;
        padding-bottom: 7px;
    }

    .rili .datei .el-button--mini {
        font-size: 1em;
        padding-left: 5px;
        padding-right: 5px;
    }
    .rili .is-selected {
        background-color:  rgba(25, 31, 36, 0) !important
    }
    .rili .el-calendar-day {
         background-color:  rgba(25, 31, 36, 0) !important
    }
    .rili .el-calendar__header {
        display: none;
    }
</style>
