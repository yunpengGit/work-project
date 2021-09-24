<template>
    <div style="height:100%">
        <el-row style="height:100%">
            <el-col :span="18" style="height:100%;padding-right:5px">
                <div style="height:45%;padding-bottom:5px">
                    <ToDoWork />
                </div>
                <div style="height:55%;padding-top:5px">
                    <Meetinglist />
                </div>
            </el-col>
            <el-col :span="6" style="height:100%;padding-left:5px">
                <DateAndTimeLine />
            </el-col>
        </el-row>
    </div>
</template>

<script>
import ToDoWork from '@/views/platform/toDoWork'
import Meetinglist from '@/views/platform/meetingList'
import DateAndTimeLine from '@/views/common/dateAndTimeLine'
import { setConferenceId, setConferenceTemplate } from '@/utils/conference-auth'
export default {
    name: 'Platform',
    components: {
        ToDoWork,
        Meetinglist,
        DateAndTimeLine
    },
    data() {
        return {
        }
    },
    mounted() {
        document.getElementById('gongzuotai').className = 'headerMenu-is-active'
        // border-bottom-color: transparent;
    },
    created() {
        setConferenceId('')
        setConferenceTemplate('')
    },
    methods: {}
}
</script>

