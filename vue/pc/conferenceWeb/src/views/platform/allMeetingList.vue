<template>
    <div style="padding-top:14px">
        <div style="height:48px;width:100%;margin-top:14px;border-bottom:solid 1px rgba(25, 31, 36, 0.12);">
            <span style="float:left;line-height: 24px;height:24px;margin-top:4px;color: rgba(25, 31, 36, 0.64);">日期：</span>
            <el-date-picker
                v-model="inputTimes"
                type="daterange"
                range-separator="至"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="选择开始日期"
                end-placeholder="选择结束日期"
                :editable="false"
            />

            <el-input v-model.trim="pageInfo.nameLikeOrStationLike" placeholder="请输入会议名称、地点、城市或主办单位搜索" @keyup.enter.native="getList" style="float: right;width:350px;margin-right:2px;">
                <el-button slot="append" icon="el-icon-search" @click="getList" />
            </el-input>
        </div>
        <div style="min-height:234px;width:100%;margin-top:10px;padding-bottom:30px;" class="huiyiliebiaoClass">
            <el-row style="margin-top:-25px">
                <el-col v-for="(item, index) in conferenceList" :key="index" :span="8" :style="index % 3 === 0 ? {'margin-left': '-20px','padding-left': '20px','margin-top':'40px'} : {'padding-left': '20px','margin-top':'40px','margin-left': '10px'}">
                    <el-link :underline="false" style="width: 100%" @click="jinruhuiyi(item)"><MeetingCard :my-conference-list="myConferenceList" :conference-flag="2" :conference="item" style="width: 100%" /></el-link>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
import { getAllList } from '@/api/conference'
import MeetingCard from './meetingCard'
import { getView } from '@/api/conference'
import { showLoading, closeLoading } from '@/utils/loading'
import { setConferenceId, setConferenceTemplate } from '@/utils/conference-auth'
export default {
    name: 'AllMeetingList',
    components: {
        MeetingCard
    },
    props: {
        myConferenceList: {
            type: Array,
            default: function() {
                return []
            }
        }
    },
    data() {
        return {
            inputTimes: [],
            imagePath: getOssBaseUrl(),
            conference: {
                coverVOs: [],
                name: null
            },
            pageInfo: {
                nameLikeOrStationLike: null
            },
            conferenceList: [],
            activeName: 'first'
        }
    },
    watch: {
        activeName(val) {
            this.getList()
        }
    },
    created() {
        this.getList()
    },
    methods: {
        jinruhuiyi(val) {
            if (this.myConferenceList.find(item => item.id === val.id)) {
                this.$store.state.user.conferenceId = null
                setConferenceId(val.id)
                var load = showLoading()
                getView({ 'id': val.id }).then(res => {
                    if (res.success) {
                        setConferenceTemplate(res.result.conferenceTemplate)
                    }
                })
                closeLoading(load)
                //

                if (val.conferenceStatus === 1) {
                    this.$router.push(`/meeting/update`)
                } else {
                    this.$router.push(`/data`)
                }
            } else {
                this.$router.push({
                    path: '/conferenceView',
                    query: {
                        conferenceId: val.id
                    }
                })
            }
        },
        getList() {
            if (this.activeName === 'first') {
                this.pageInfo.conferenceStatusEqual = [2, 3, 4, 5]
            } else if (this.activeName === 'second') {
                this.pageInfo.conferenceStatusEqual = [4]
            } else if (this.activeName === 'third') {
                this.pageInfo.conferenceStatusEqual = [5]
            }

            if (this.inputTimes !== null && this.inputTimes.length === 2) {
                this.pageInfo.startTime = this.inputTimes[0]
                this.pageInfo.endTime = this.inputTimes[1]
            } else {
                this.pageInfo.startTime = null
                this.pageInfo.endTime = null
            }

            getAllList(this.pageInfo).then(response => {
                if (this.activeName === 'first') {
                    if (response.result.list !== null && response.result.list.length > 0) {
                        this.conference = response.result.list[0]
                        var tempList = response.result.list
                        this.conferenceList = tempList
                    } else {
                        this.conferenceList = []
                    }
                } else {
                    this.conferenceList = response.result.list
                }
            })

            //
        },
        createConference() {}
    }
}
</script>
<style lang="scss" scoped>
    .conferenceNameClass {
        display: inline;
        height: 24px;
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191F24;
        line-height: 24px;
    }

    .jinxingzhongClass {
        background-color: #009F15;
        color: #FFFFFF;
    }

    .weikaishiClass {
        background-color:#0F6AD9;
        color: #FFFFFF;
    }

    .yiquxiaoClass {
        background-color: #797979;
        color: #FFFFFF;
    }

    .yijieshuClass {
        background-color: #FFFFFF;
        color:#191F24;
    }

    .statusClass {
        margin-left: 10px;
        display: inline;
        padding-top: 4px;
        padding-bottom: 4px;
        padding-left: 8px;
        padding-right: 8px;
        height: 24px;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
        border-radius: 2px;
        width: 68px;
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        line-height: 16px;
    }
    .biaotiClass {

        height: 16px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #191F24;
        line-height: 16px;
    }
    .huiyishijianClass {
        height: 16px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(25, 31, 36, 0.72);
        line-height: 16px;
    }
    .baomingshijianClass {
        height: 16px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #EA340F;
        line-height: 16px;
    }
    .tianjiahuiyizuzhiClass {
        width: 114px;
        height: 32px;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #1E89FF;
    }
    .listTitleClass {
        height: 20px;
        font-size: 15px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191F24;
        line-height: 20px;
    }

    .lianghangxianshibuquan {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

</style>
<style lang="scss">
.huiyiliebiaoClass {
    .el-tabs__nav-wrap::after {
        width:0 !important;
    }
    .el-tabs__nav-scroll {
        padding-left:18px;
        border-bottom: solid 1px rgba(25, 31, 36, 0.12);
    }
    .el-tabs__nav {
        width: 100%;
    }
    .is-disabled {
        float: right;
    }
    .el-link--inner {
        width: 100%
    }
}

</style>
