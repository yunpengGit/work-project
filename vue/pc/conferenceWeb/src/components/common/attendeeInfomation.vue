<template>
    <!-- 标签管理、车辆任务管理查看任务未包含 -->
    <div class="">
        <img
            style="width:32px;height:32px;float:left;border-radius:50%"
            :src="photoUrl !== null && photoUrl !== '' ? photoUrl : (sex === null || sex === '' ? require('@/assets/male.png') : (sex === '1' || sex === 1) ? require('@/assets/male.png') : require('@/assets/female.png'))"
        >
        <span
            style="margin-top:8px;margin-left:5px;float:left"
            :title="attendeeName"
        >{{ attendeeName != null && attendeeName.length > 4 ? attendeeName.substr(0,4) + '...' : attendeeName }}</span>
        <span
            v-if="(attendeeRoleFlag===0 || attendeeRoleFlag == null) && honourFlag === 1 && honourVisibleFlag !== 1"
            style="margin-top:8px;float:left"
        >（主宾）</span>
        <span
            v-if="(attendeeRoleFlag===0 || attendeeRoleFlag == null) && honourFlag !== 1 && honourVisibleFlag !== 1"
            style="margin-top:8px;float:left"
        >（随员）</span>
        <el-tooltip v-if="accompanyFlag === 2 && accompanyTotips !== null && accompanyTotips.length > 0" placement="bottom" effect="light">
            <div slot="content">
                <div v-if="accompanyTotips !== null && accompanyTotips.length > 0">
                    <div v-for="(accompanyTotip,index1) in accompanyTotips" :key="'tips' + index1">
                        <div>
                            {{ accompanyTotip.name }}
                        </div>
                        <div v-for="(item, index2) in accompanyTotip.attendeeAccompany" :key="'subTips' + index2" style="padding-left: 20px;">
                            {{ item.attendeeFixAttribute.attendeeName + '（' + item.attendeeFixAttribute.phone + '）' }}
                        </div>
                    </div>
                </div>
            </div>
            <div style="margin-top:8px;margin-left:5px;float:left" @mouseover="event => onMouseOver(event)" @mouseout="event => onMouseOut(event)">
                <svg-icon icon-class="yuanquantanhaohei" />
                <svg-icon icon-class="yuanquantanhaolan" style="display: none;" />
            </div>
        </el-tooltip>
        <el-tooltip v-if="accompanyFlag === 1 && accompanyTotips !== null && accompanyTotips.length > 0" placement="bottom" effect="light">
            <div v-if="honourFlag === 1" slot="content">

                <div
                    v-if="accompanyTotips !== null && accompanyTotips.length > 0"
                >
                    <div>
                        随员信息：
                    </div>
                    <div v-for="item in accompanyTotips" :key="item.id">
                        {{ item.attendeeName + '（' + item.phone + '）' }}
                    </div>
                </div>
                <div v-else>
                    随员信息：无
                </div>
            </div>
            <div v-else slot="content">
                <div>
                    主宾信息：
                </div>
                <div v-for="item in accompanyTotips" :key="item.id">
                    {{ item.attendeeName + '（' + item.phone + '）' }}
                </div>
            </div>
            <div style="margin-top:8px;margin-left:5px;float:left" @mouseover="event => onMouseOver(event)" @mouseout="event => onMouseOut(event)">
                <svg-icon icon-class="yuanquantanhaohei" />
                <svg-icon icon-class="yuanquantanhaolan" style="display: none;" />
            </div>
        </el-tooltip>
    </div>
</template>

<script>
export default {
    name: 'AttendeeInfomation',
    props: {
        accompanyFlag: {
            type: Number,
            default: null
        },
        accompanyTotips: {
            type: Array,
            default: null
        },
        photoUrl: {
            type: String,
            default: null
        },
        sex: {
            type: String,
            default: null
        },
        attendeeName: {
            type: String,
            default: null
        },
        attendeeRoleFlag: {
            type: Number,
            default: null
        },
        honourFlag: {
            type: Number,
            default: null
        },
        honourVisibleFlag: {
            type: Number,
            default: null
        }
    },
    methods: {
        onMouseOver(event) {
            event.currentTarget.children[0].style.display = 'none'
            event.currentTarget.children[1].style.display = ''
        },
        onMouseOut(event) {
            event.currentTarget.children[0].style.display = ''
            event.currentTarget.children[1].style.display = 'none'
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
