<template>
    <div style="height:100%;background-color:#ffffff" class="riliWork">
        <div class="datei">
            <div style="width: 100%;height: 20%;padding:16px">
                <div class="zuoshangriqi" style="float: left">
                    {{ huoquriqi(value) }}
                </div>
                <div class="zuoshangwenzi" style="float: left;margin-top:20px;margin-left:5px">
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
                    <div class="riliriqiClass" :style="data.isSelected ? {'background-color':'#1E89FF','color': 'white'} : {}">
                        <div style="height:20px;width:20px;">
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
                <div style="margin-top:60px;"><img src="@/assets/table-no-data.png"></div>
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
    name: 'DateAndTimeLine',
    props: {
    },
    data() {
        return {
            value: GMTToStrYYYYMMDD(new Date()),
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
            // ["2020-11-23","2020-11-25","2020-11-24","2020-11-26","2020-11-27","2020-11-28","2020-11-29","2020-11-30","2020-12-01","2020-12-06","2020-12-08","2020-12-10","2020-12-15","2020-12-13","2020-12-14","2020-12-11","2020-12-02","2020-12-03","2020-12-17","2020-12-09","2020-12-04","2020-12-05","2020-12-31"]

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
                    if (item > GMTToStrYYYYMMDD(this.value)) {
                        this.value = item
                        return true
                    }
                })
            } else {
                this.dakaixicheng(this.value)
            }
        },
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
        height: 22px;
        font-size: 17px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191F24;
        line-height: 22px;
    }
    .nongli {
        width: 104px;
        height: 18px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #191F24;
        line-height: 18px;
    }
    .jiantouDiv {
        padding-top:10px;
        padding-left:12px;
        width: 40px;
        height: 40px;
        background: #FAFAFA;
        border-radius: 4px;
        border: 1px solid rgba(25, 31, 36, 0.04);
    }
    .zuoshangriqi {
        width: 41px;
        height: 44px;
        font-size: 40px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191F24;
        line-height: 44px;
    }
    .zuoshangwenzi {
        width: 14px;
        height: 18px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #191F24;
        line-height: 18px;
    }
    .timeline {
        padding: 20px;
        background-color: #fafafa;
        height: 42%;
        overflow: auto;
    }
    .datei {
        height: 58%;
        overflow: hidden;
        /* zoom: 0.8; */
        /* overflow: auto; */
    }
    .phei {
        /* width: 200px; */
        margin-top:4px;
        height: 20px;
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
        font-size: 1em;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(25, 31, 36, 0.48);
        line-height: 16px;
    }
    .timelinetitle {
        font-size: 17px;
        /* font-size: 1.4em; */
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191F24;
        line-height: 20px;
        margin-bottom: 20px;

    }
    .el-timeline {
        font-size: inherit;
    }

</style>

<style>
    .riliWork .el-timeline-item__timestamp {
        /* font-size: 12px; */
        font-size: 1em;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(25, 31, 36, 0.48);
        line-height: 16px;
    }
    .riliWork .el-timeline-item__timestamp.is-top {
        margin-bottom: 1px;
        padding-top: 0px;
    }
    .riliWork .el-timeline-item__node--normal {
        width: 4px;
        height: 4px;
        left: 3px;
        top:2px;
    }

    .riliWork .el-calendar-table td {
        border: none;
        border-radius:50%;
    }
    .riliWork .el-calendar-table tr:first-child td {
        border: none
    }
    .riliWork .el-calendar-table tr td:first-child {
        border: none
    }
    .riliWork .el-calendar__body {
        height:90%
    }
    .riliWork .el-calendar__body .el-calendar-table {
        height:100%
    }
    .riliWork .el-calendar-table .el-calendar-day{
        text-align: center;
    }

    .riliriqiClass {
        width:38px;
        height:38px;
        border-radius: 50%;
        padding:9px
    }
    .rilixiaoyuandianClass {
        border-radius:50%;
        width:4px;
        height:4px;
        margin-left:45%
    }

    .riliWork .el-calendar-table .el-calendar-day {
        padding: 0px;
        height: 38px !important;
        text-align: center;
    }
    .riliWork .el-calendar__body {
        padding-top: 0px;
    }
    .riliWork .el-calendar-table thead th {
        padding-top: 5px;
        padding-bottom: 7px;
    }

    .riliWork .datei .el-button--mini {
        font-size: 1em;
        padding-left: 5px;
        padding-right: 5px;
    }
    .riliWork .is-selected {
        background-color:  rgba(25, 31, 36, 0) !important
    }
    .riliWork .el-calendar-day {
         background-color:  rgba(25, 31, 36, 0) !important
    }
    .riliWork .el-calendar__header {
        display: none;
    }
</style>
