<template>
    <div class="huiyigaikuanghuizhongltbk" style="height:100%">
        <el-row style="height:80%">
            <el-col
                :span="conferenceView.conferenceStatus === 3 ? 12 : 0"
                class="zuobiankuang"
                style="height:100%"
            >
                <div class="huiyidiyituan" style="height:100%">
                    <el-row style="height:100%">
                        <el-col :span="12" class="zuobiankuang" style="height:100%">
                            <div class="huiyidiyitian" style="height:40%">
                                {{ getConferenceTemplate(1) }}第&nbsp;<span class="huiyidijitian">1</span>&nbsp;天
                            </div>
                            <div class="yibaomingtitle" style="height:40%">
                                已报名总人数：<span class="yibaomingcon">288人</span>
                            </div>
                            <div class="huiyishijian" style="height:10%">
                                开始时间：{{ conferenceView.startTime !== undefined && conferenceView.startTime !== null && conferenceView.startTime.length >= 17 ? conferenceView.startTime.substr(0,16) : conferenceView.startTime }}
                            </div>
                            <div class="huiyishijian" style="height:10%">
                                结束时间：{{ conferenceView.endTime !== undefined && conferenceView.endTime !== null && conferenceView.endTime.length >= 17 ? conferenceView.endTime.substr(0,16) : conferenceView.endTime }}
                            </div>
                        </el-col>
                        <el-col :span="12" style="height:100%;padding-left:10px" class="overviewClass">
                            <div class="echarttext" style="height:80%">
                                <el-progress :stroke-width="10" type="circle" :percentage="25" :format="format" />
                            </div>

                            <div class="echarttext" style="height:10%">
                                已签到:<span class="echarttexthei">7</span>&nbsp;未签到:<span class="echarttexthei">126</span>
                            </div>
                            <div class="echarttext" style="height:10%">
                                今日参会认数:<span class="echarttexthei">26</span>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
            <el-col
                :span="conferenceView.conferenceStatus === 4 || conferenceView.conferenceStatus === 2 ? 12 : 0"
                class="zuobiankuang"
                style="height:100%"
            >
                <div class="huiyidiyituan" style="height:100%">
                    <el-row style="height:100%">
                        <el-col :span="12" class="zuobiankuang" style="height:100%">
                            <div class="huiyidiyitian" style="height:40%">
                                {{ getConferenceTemplate(1) }}第&nbsp;<span class="huiyidijitian">1</span>&nbsp;天
                            </div>
                            <div class="yibaomingtitle" style="height:40%">
                                已结束或未开始：<span class="yibaomingcon">288人</span>
                            </div>
                            <div class="huiyishijian" style="height:10%">
                                开始时间：2020-03-28 16:00
                            </div>
                            <div class="huiyishijian" style="height:10%">
                                结束时间：2020-04-09 21:00
                            </div>
                        </el-col>
                        <el-col :span="12" style="height:100%;padding-left:10px" class="overviewClass">
                            <div class="echarttext" style="height:80%">
                                <el-progress :stroke-width="10" type="circle" :percentage="25" :format="format" />
                            </div>

                            <div class="echarttext" style="height:10%">
                                已签到:<span class="echarttexthei">7</span>&nbsp;未签到:<span class="echarttexthei">126</span>
                            </div>
                            <div class="echarttext" style="height:10%">
                                今日参会认数:<span class="echarttexthei">26</span>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
            <el-col :span="conferenceView.conferenceStatus === 1 || conferenceView.conferenceStatus === 5 ? 24 : 12" style="height:100%">
                <div class="tongzhibk" style="height:100%">
                    <el-row style="height:20%">
                        <el-col :span="12" class="tongzhigongao">
                            通知公告
                        </el-col>
                        <el-col :span="12" class="gengduo">
                            <!-- 更多>> -->
                            <el-link type="primary" class="gengduolink" @click="gengduotongzhi">更多>></el-link>
                        </el-col>
                    </el-row>
                    <div class="huidilanzi" :style="tongzhi1.noticeContent !== undefined && tongzhi1.noticeContent !== null && tongzhi1.noticeContent !== '' ? {'height':'40%','cursor':'pointer'} : {'height':'40%'}" @click="openNoticeView(tongzhi1.noticeContent)">
                        <div style="height:75%">
                            <el-row>
                                <el-col :span="1">
                                    {{ tongzhi1.noticeContent !== null && tongzhi1.noticeContent !== '' ? '●' : '' }}
                                </el-col>
                                <el-col :span="23" :title="tongzhi1.noticeContent">
                                    {{ tongzhi1.noticeContent !== null && tongzhi1.noticeContent.length > 30 ? tongzhi1.noticeContent.substr(0,30) + '...' : tongzhi1.noticeContent }}
                                    <!-- 30日晚上19:40，会务组召开碰头会，请各组长参加，地点：盛华楼第7会议室。 -->
                                </el-col>
                            </el-row>
                        </div>
                        <div class="huidilanzitime" style="float:right">
                            {{ tongzhi1 !== null && tongzhi1 !== null && tongzhi1.onlineTime != null && tongzhi1.onlineTime.length === 19 ? tongzhi1.onlineTime.substr(0,16) : tongzhi1.onlineTime }}
                        </div>
                    </div>
                    <div class="baidilanzi" :style="tongzhi2.noticeContent !== undefined && tongzhi2.noticeContent !== null && tongzhi2.noticeContent !== '' ? {'height':'40%','cursor':'pointer'} : {'height':'40%'}" @click="openNoticeView(tongzhi2.noticeContent)">
                        <div style="height:75%">
                            <el-row>
                                <el-col :span="1">
                                    {{ tongzhi2 !== null && tongzhi2.noticeContent !== null && tongzhi2.noticeContent !== '' ? '●' : '' }}
                                </el-col>
                                <el-col :span="23" :title="tongzhi2.noticeContent">
                                    {{ tongzhi2.noticeContent !== null && tongzhi2.noticeContent.length > 30 ? tongzhi2.noticeContent.substr(0,30) + '...' : tongzhi2.noticeContent }}
                                    <!-- 按照工作会会务要求，自29日（今天）13:30起，请会务组工作人员着集团公司正装西… -->
                                </el-col>
                            </el-row>
                        </div>
                        <div class="baidilanzitime" style="margin-top: -5px">
                            {{ tongzhi2 !== null && tongzhi2.onlineTime != null && tongzhi2.onlineTime.length === 19 ? tongzhi2.onlineTime.substr(0,16) : tongzhi2.onlineTime }}
                            <!-- 2020-08-29 -->
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row class="anniuhang" style="height:20%;">
            <el-col :span="5" class="zuobiankuang" style="height:100%">
                <el-button class="butda" @click="openShareDialog">
                    <span class="tubiao">
                        <img src="@/assets/chaxun.svg" alt="" class="tubiaoimg">
                    </span>
                    <span class="tubiaowenzi">
                        &nbsp;分享{{ getConferenceTemplate(1) }}活动
                    </span>
                </el-button>
            </el-col>
            <el-col :span="5" class="zuobiankuang" style="height:100%">
                <!-- <button class="butda"><img src="@/assets/sunny.svg" alt="" style="height:10px">&nbsp;快速签到</button> -->
                <el-button :class="kuaisuqiandaoDisabled ? 'butda classOpacity50' : 'butda classOpacity100'" :disabled="kuaisuqiandaoDisabled" @click="openCheckinDialog">
                    <span class="tubiao">
                        <img src="@/assets/chaxun.svg" alt="" class="tubiaoimg">
                    </span>
                    <span class="tubiaowenzi">
                        &nbsp;快速签到
                    </span>
                </el-button>
            </el-col>
            <el-col :span="4" class="zuobiankuang" style="height:100%">
                <el-button :class="tianjiacanhuirenDisabled ? 'butda classOpacity50' : 'butda classOpacity100' " :disabled="tianjiacanhuirenDisabled" @click="add">
                    <span class="tubiao">
                        <img src="@/assets/tianjiacanhuiren.svg" alt="" class="tubiaoimg">
                    </span>
                    <span class="tubiaowenzi">
                        &nbsp;添加{{ getConferenceTemplate(2) }}
                    </span>
                </el-button>
            </el-col>
            <el-col :span="5" class="zuobiankuang" style="height:100%">
                <!-- <button class="butda"><img src="@/assets/sunny.svg" alt="" style="height:10px">&nbsp;查看行程</button> -->
                <el-button :class="kuaisuqiandaoDisabled ? 'butda classOpacity50' : 'butda classOpacity100'" :disabled="kuaisuqiandaoDisabled" @click="openChakanxingcheng">
                    <span class="tubiao">
                        <img src="@/assets/chakanxingcheng.svg" alt="" class="tubiaoimg">
                    </span>
                    <span class="tubiaowenzi">
                        &nbsp;查看行程
                    </span>
                </el-button>
            </el-col>
            <el-col :span="5" style="height:100%">
                <el-button :class="(this.$store.state.menu.routeCodes === null || this.$store.state.menu.routeCodes.indexOf('attendeeQuery') === -1) ? 'butda classOpacity50' : 'butda classOpacity100' " :disabled="(this.$store.state.menu.routeCodes === null || this.$store.state.menu.routeCodes.indexOf('attendeeQuery') === -1)" @click="attendeeQuery">
                    <span class="tubiao">
                        <img src="@/assets/chaxun.svg" alt="" class="tubiaoimg">
                    </span>
                    <span class="tubiaowenzi">
                        &nbsp;{{ getConferenceTemplate(2) }}查询
                    </span>
                </el-button>
            </el-col>
        </el-row>
        <FastCheckInBefore :title="checkInTitle" :active-name="activeName" :dialog-visible="checkinDialogVisible" @closeDialog="closeCheckinDialog" />
        <ConferenceShare :dialog-visible="shareDialogVisible" @closeDialog="closeShareDialog" />
        <NoticeInsideView :dialog-visible="noticeDialogVisible" :notice-inside-content="noticeInsideContent" @closeDialog="closeNoticeDialog" />
    </div>
</template>
<script>
import ConferenceShare from '@/views/conferenceOverview/inMeeting/conferenceShare'
import FastCheckInBefore from '@/views/conferenceOverview/inMeeting/fast-check-in-before'
import NoticeInsideView from '@/views/conferenceOverview/inMeeting/noticeInsideView'
import { getSignConfig } from '@/api/signup'
import { getConferenceId } from '@/utils/conference-auth'
import { getList } from '@/api/noticeInside'
import { getView as getConferenceView } from '@/api/conference'
export default {
    name: 'ConferenceOverview',
    components: {
        ConferenceShare,
        FastCheckInBefore,
        NoticeInsideView
    },
    data() {
        return {
            checkInTitle: null,
            noticeInsideContent: null,
            noticeDialogVisible: false,
            kuaisuqiandaoDisabled: this.$store.state.menu.buttons.indexOf(this.Global.buttons.AttendeeQuery.trip) === -1,
            tianjiacanhuirenDisabled: this.$store.state.menu.buttons.indexOf(this.Global.buttons.AttendeeQuery.signup) === -1,
            activeName: 'second',
            checkinDialogVisible: false,
            tongzhi1: {
                onlineTime: '',
                noticeContent: ''
            },
            tongzhi2: {
                onlineTime: '',
                noticeContent: ''
            },
            tianjiaCanhuirenButtonDisabled: true,
            tianjiaCanhuirenButtonDisabled2: true,
            signConfig: {},
            shareDialogVisible: false,
            conferenceView: {}
        }
    },
    created() {
        this.getConferenceView()
        this.getSignConfig()
        this.getList()
    },
    methods: {
        closeNoticeDialog() {
            this.noticeInsideContent = null
            this.noticeDialogVisible = false
        },
        openNoticeView(val) {
            if (val !== undefined && val !== null && val !== '') {
                this.noticeInsideContent = val
                this.noticeDialogVisible = true
            }
        },
        getConferenceView() { // 获取会议详情
            getConferenceView({ 'id': getConferenceId() }).then(res => {
                this.conferenceView = res.result
                // alert(this.conferenceView.conferenceStatus)
            })
        },
        closeCheckinDialog() {
            this.checkinDialogVisible = false
        },
        openChakanxingcheng() {
            this.checkInTitle = '查看行程'
            this.activeName = 'first'
            this.checkinDialogVisible = true
        },
        openCheckinDialog() {
            this.$router.push('/attendeeManagement/signinManage')
            // this.checkInTitle = '快速签到'
            // this.activeName = 'second'
            // this.checkinDialogVisible = true
        },
        getList() {
            var pageInfo = {
                conferenceId: getConferenceId(),
                noticeScopes: ['0', '1'],
                status: 1,
                pageNum: 1,
                pageSize: 2
            }
            getList(pageInfo).then(res => {
                if (res.result !== null && res.result.list != null && res.result.list.length > 0) {
                    this.tongzhi1 = res.result.list[0]
                    if (res.result.list.length > 1) {
                        this.tongzhi2 = res.result.list[1]
                    }
                } else {
                    this.tongzhi1 = {
                        onlineTime: '',
                        noticeContent: ''
                    }
                    this.tongzhi2 = {
                        onlineTime: '',
                        noticeContent: ''
                    }
                }
            })
        },
        gengduotongzhi() {
            this.$router.push({
                path: `/attendee/noticeInside`
            })
        },
        format(percentage) {
            return `${percentage}%签到率`
        },
        add() {
            // alert(JSON.stringify(this.$store.state.menu.routeCodes))
            this.$router.push({
                path: `/attendeeManagement/attendee/edit/0`
            })
        },
        attendeeQuery() {
            this.$router.push({
                path: `/attendeeManagement/attendeeQuery`
            })
        },
        getSignConfig() { // 获取报名设置
            getSignConfig({ 'conferenceId': getConferenceId() }).then(res => {
                this.signConfig = res.result
                this.tianjiaCanhuirenButtonDisabled = (new Date(this.signConfig.endTime).getTime() >= new Date().getTime() && new Date(this.signConfig.startTime).getTime() <= new Date().getTime())
                // setTimeout(() => {

                // }, 1000)
                // alert((this.roleCodes === null || this.roleCodes.indexOf('attendeeQuery') === -1))
            })
        },
        closeShareDialog() {
            this.shareDialogVisible = false
        },
        openShareDialog() {
            this.shareDialogVisible = true
        }
    }
}
</script>
<style scoped>
    .huiyigaikuanghuizhongltbk {
        background-color: #FAFAFA;
    }
    .huiyidiyituan {
        padding: 10px;
    }
    .zuobiankuang {
        border-right-style: solid;
        border-right-width: 1px;
        border-right-color: #eef0f4;
    }
    .huiyidiyitian {
        /* font-size: 18px; */
        font-size: 1.5em;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191F24;
        /* line-height: 22px; */
    }
    .huiyidijitian {
        background: #1E89FF;
        border-radius: 4px;
        /* font-size: 18px; */
        font-size: 1em;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 22px;
        padding-top: 1px;
        padding-bottom: 1px;
        padding-right: 10px;
        padding-left: 10px;
        /* padding-right: 5%;
        padding-left: 5%; */
    }
    .yibaomingtitle {
        /* font-size: 12px; */
        font-size: 1em;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(25, 31, 36, 0.64);
        line-height: 16px;
    }
    .yibaomingcon {
        /* font-size: 22px; */
        font-size: 1.8em;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191F24;
        line-height: 28px;
    }
    .huiyishijian {
        /* font-size: 12px; */
        font-size: 1em;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(25, 31, 36, 0.64);
        line-height: 16px;
    }
    .echarttext {
        /* font-size: 12px; */
        font-size: 1em;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(25, 31, 36, 0.64);
        line-height: 16px;
        text-align: center;
    }
    .echarttexthei {
        /* font-size: 12px; */
        font-size: 1em;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191F24;
        line-height: 16px;
    }
    .tongzhigongao {
        /* font-size: 16px; */
        font-size: 1.3em;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191F24;
        /* line-height: 21px; */
    }
    .gengduo {
        text-align: right;
    }
    .gengduolink {
        /* font-size: 13px; */
        font-size: 1em;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #1E89FF;
        /* line-height: 18px; */
    }
    .huidilanzi {
        background: rgba(25, 31, 36, 0.04);
        border-radius: 6px;
        padding: 5px;
        /* font-size: 15px; */
        font-size: 1.25em;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #1E89FF;
        /* line-height: 16px; */
    }
    .huidilanzitime {
        /* font-size: 12px; */
        font-size: 1em;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #1E89FF;
        line-height: 12px;
        text-align: right;
    }
    .baidilanzi {
        padding: 5px;
        /* font-size: 15px; */
        font-size: 1.25em;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #191F24;
        /* line-height: 16px; */
    }
    .baidilanzitime {
        /* font-size: 12px; */
        font-size: 1em;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #5f6972;
        line-height: 12px;
        text-align: right;
    }
    .tongzhibk {
        padding-top: 5px;
        padding-right: 10px;
        padding-left: 10px;
    }
    .anniuhang {
        border-top-style: solid;
        border-top-width: 1px;
        border-top-color: #eef0f4;
        /* text-align: center; */
        padding: 0px;
    }
    .butda {
        height: 100%;
        width: 100%;
        border: none;
        background-color: #FAFAFA;
        /* font-size: 15px; */
        font-size: 1.25em;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(25, 31, 36, 0.72);
        line-height: 15px;
        /* text-align: left; */
        /* padding: 0px; */
    }
    .tubiao {
        /* position: fixed; */
        /* text-align: right; */
        /* float: right; */
        /* vertical-align: top; */
        /* vertical-align: middle; */
    }
    .tubiaowenzi {
        vertical-align:middle;
        color: rgba(25, 31, 36, 0.72);
    }
    .tubiaoimg {
        /* height:80%; */
        height: 22px;
        vertical-align: middle
    }
    .classOpacity50 {
        opacity: 0.5;
    }
     .classOpacity100 {
        opacity: 1;
    }
</style>
