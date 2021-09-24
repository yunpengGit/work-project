<template>
    <div class="">
        <el-dialog
            :title="title"
            width="58%"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="closeDialog"
        >
            <div class="clearfix">
                <div style="background-color: white;padding-left:24px;margin-top:20px;margin-bottom:20px">
                    <span class="biaotiClass">姓名：</span>
                    <span class="wenziClass">{{ geshihuawugezi(attendeeView.signFormConfigFormatVO.attendeeName.fieldValue) }}</span>

                    <span class="biaotiClass" style="margin-left:40px">手机号：</span>
                    <span class="wenziClass">{{ attendeeView.signFormConfigFormatVO.phone.fieldValue }}</span>

                    <span class="biaotiClass" style="margin-left:40px">单位：</span>
                    <span class="wenziClass">{{ formatOrgName(attendeeView.signFormConfigFormatVO.organizationSortName.fieldValue, attendeeView.signFormConfigFormatVO.organizationName.fieldValue, 5) }}</span>

                    <span class="biaotiClass" style="margin-left:40px">职务：</span>
                    <span class="wenziClass">{{ geshihuawugezi(attendeeView.signFormConfigFormatVO.position.fieldValue) }}</span>
                    <!-- <el-button v-if="conferenceView.checkInFlag === 1" v-permission="Global.buttons.AttendeeQuery.signin" size="mini" style="float: right" :disabled="attendeeView.checkInType !== null && attendeeView.checkInType !== '' " @click="huiyibaodao">会议报到</el-button> -->
                </div>
            </div>
            <XingchengTree :attendee-id="attendeeId" />
            <!-- <el-tabs v-model="activeNameCheckIn">
                <el-tab-pane label="查看行程" name="first">
                    <XingchengTree :attendee-id="attendeeId" />
                </el-tab-pane>
                <el-tab-pane label="快速签到" name="second">
                    <AgendaTree :attendee-id="attendeeId" @refreshChenInstatus="refreshChenInstatus" />
                </el-tab-pane>
            </el-tabs> -->
            <!-- <div> -->

        </el-dialog>
    </div>
</template>

<script>
import { getConferenceId } from '@/utils/conference-auth'
import { getView, checkInByOrganized } from '@/api/attendee'
import { getView as getConferenceView } from '@/api/conference'
import AgendaTree from '@/views/conferenceOverview/inMeeting/agendaTree'
import XingchengTree from '@/views/conferenceOverview/inMeeting/xingchengTree'
export default {
    name: 'FastCheckIn',
    components: {
        AgendaTree,
        XingchengTree
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        activeName: {
            type: String,
            default: 'second'
        },
        title: {
            type: String,
            default: '查看行程'
        },
        attendeeId: {
            type: null,
            default: null
        }

    },
    data() {
        return {
            activeNameCheckIn: this.activeName,
            conferenceView: {

            },
            attendeeView: {
                signFormConfigFormatVO: {
                    attendeeName: {},
                    position: {},
                    organizationSortName: {},
                    organizationName: {},
                    phone: {}
                }
            }
        }
    },
    watch: {
        dialogVisible(val) {
            if (val) {
                this.getConferenceView()
                this.getView()
            }
        }
    },
    created() {
        // this.getView()
    },
    methods: {
        refreshChenInstatus() {
            this.getConferenceView()
            this.getView()
        },
        geshihuawugezi(val) {
            if (val === null || val === '') {
                return '-'
            }
            if (val.length > 5) {
                return val.substr(0, 5) + '...'
            }
            return val
        },
        getView() {
            getView({ id: this.attendeeId }).then(res => {
                this.attendeeView = res.result
            })
        },
        getConferenceView() {
            getConferenceView({ 'id': getConferenceId() }).then(res => {
                this.conferenceView = res.result
                // alert(this.conferenceView.conferenceStatus)
            })
        },
        huiyibaodao() {
            var checkInData = {
                conferenceId: getConferenceId(),
                attendeeIds: [this.attendeeId],
                signInType: 3
            }
            checkInByOrganized(checkInData).then(res => {
                if (res.success) {
                    this.$message(res.message)
                    this.getConferenceView()
                    this.getView()
                }
            })
        },
        closeDialog() {
            this.$emit('closeDialog', null)
        }
    }
}
</script>
<style lang="scss" scoped>
.wenziClass {
    width: 45px;
    height: 28px;
    font-size: 15px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #191F24;
    line-height: 28px;
}
.biaotiClass {
    width: 45px;
    height: 28px;
    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(25, 31, 36, 0.56);
    line-height: 28px;
}
</style>
