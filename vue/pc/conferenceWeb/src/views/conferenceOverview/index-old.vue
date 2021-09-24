<template>
    <div class="confereMain" style="padding:10px;height:100%">
        <el-row style="height:100%">
            <el-col :span="18" style="height:100%;padding-right:5px">
                <div style="height:35%;padding-bottom:5px">
                    <InMeetingLeftTop />
                </div>
                <div style="height:35%;padding-top:5px;padding-bottom:5px">
                    <InMeetingLeftMiddle />
                </div>
                <div style="height:30%;padding-top:5px">
                    <InMeetingLeftBottom />
                </div>
            </el-col>
            <el-col :span="6" style="height:100%;padding-left:5px">
                <InMeetingRight />
            </el-col>
        </el-row>
    </div>
</template>

<script>
import InMeetingLeftTop from '@/views/conferenceOverview/inMeeting/leftTop'
import InMeetingLeftMiddle from '@/views/conferenceOverview/inMeeting/leftMiddle'
import InMeetingLeftBottom from '@/views/conferenceOverview/inMeeting/leftBottom'
import InMeetingRight from '@/views/conferenceOverview/inMeeting/right'
export default {
    name: 'ConferenceOverview',
    components: {
        InMeetingLeftTop,
        InMeetingLeftMiddle,
        InMeetingLeftBottom,
        InMeetingRight
    }
}
</script>

<style>
    /* @media screen and (max-width: 500000px) {
        .confereMain {
            font-size: 22px;
        }
        .el-timeline-item__node--normal {
            width: 10px;
            height: 10px;
            left: 3px;
            top: 2px;
        }
        .el-timeline-item__tail {
            position: absolute;
            left: 6px;
            height: 100%;
            border-left: 4px solid #dfe4ed;
        }
        .el-calendar-table .el-calendar-day {
            height: 60px;
        }
    }
    @media screen and (max-width: 2000px) {
        .confereMain {
            font-size: 16px;
        }
        .el-timeline-item__node--normal {
            width: 4px;
            height: 4px;
            left: 3px;
            top: 2px;
        }
        .el-timeline-item__tail {
            position: absolute;
            left: 4px;
            height: 100%;
            border-left: 2px solid #dfe4ed;
        }
        .el-calendar-table .el-calendar-day {
            height: 39px;
        }
    } */
    @media screen and (max-width: 1400000px) {
        .confereMain {
            font-size: 12px;
        }
        .el-timeline-item__node--normal {
            width: 4px;
            height: 4px;
            left: 3px;
            top: 2px;
        }
        .el-timeline-item__tail {
            position: absolute;
            left: 4px;
            height: 100%;
            border-left: 2px solid #dfe4ed;
        }
        .el-calendar-table .el-calendar-day {
            height: 40px;
        }
    }
</style>
