<template>
    <div class="">
        <el-drawer
            :size="defaultCheck !== 'useRoomFlag' && defaultCheck !== 'useCardFlag' ? '45%' : '350px'"
            :visible.sync="dialogVisible"
            :before-close="closeDialog"
            :title="title"
        >

            <XingchengTree :default-check="defaultCheck" style="margin-left:20px" :attendee-id="attendeeId" :tree-height="dialogHeight" />
        </el-drawer>
    </div>
</template>

<script>
import XingchengTree from '@/views/conferenceOverview/inMeeting/xingchengTree'
import { getTableHeight } from '@/utils/index'
export default {
    name: 'Chakanxingcheng',
    components: {
        XingchengTree
    },
    props: {
        attendeeId: {
            type: null,
            default: null
        },
        dialogVisible: {
            type: Boolean,
            default: false
        },
        defaultCheck: {
            type: null,
            default: null
        },
        title: {
            type: String,
            default: '查看行程'
        }
    },
    data() {
        return {
            dialogHeight: getTableHeight(35)
        }
    },
    watch: {
    },
    methods: {
        closeDialog() {
            this.$emit('closeDialog', null)
        }
    }

}
</script>
<style lang="scss" scoped>
</style>
