<template>

    <div style="padding-top:14px">
        <div v-if="conference !== null && conference.name !== null && conference.name !== ''" style="min-height:234px;width:100%;">
            <el-row style="border-radius: 4px;background: rgba(25, 31, 36, 0.04);">
                <el-col :span="12">
                    <img style="height:234px;width: 100%" :src="conference.coverVOs !== null && conference.coverVOs.length > 0 ? (imagePath + conference.coverVOs[0].coverUrl) : ''">
                </el-col>
                <el-col :span="12" style="padding-left: 30px;padding-top: 40px">
                    <div style="width: 100%;height: 24px;">
                        <div class="conferenceNameClass" style="max-width:60%;float: left;">
                            <div class="lianghangxianshibuquan" style="width:100%">
                                {{ conference.name }}
                            </div>
                        </div>
                        <div v-if="conference.conferenceStatus === 1" class="statusClass yiquxiaoClass" style="float: left;">
                            <svg-icon icon-class="yiquxiao" style="margin-right:4px;" />
                            <span>{{ conference.conferenceStatusStr }}</span>
                        </div>
                        <div v-if="conference.conferenceStatus === 2" class="statusClass weikaishiClass " style="float: left;">
                            <svg-icon icon-class="weikaishi" style="margin-right:4px;" />
                            <span>{{ conference.conferenceStatusStr }}</span>
                        </div>
                        <div v-if="conference.conferenceStatus === 3" class="statusClass jinxingzhongClass" style="float: left;">
                            <svg-icon icon-class="jinxingzhong" style="margin-right:4px;" />
                            <span>{{ conference.conferenceStatusStr }}</span>
                        </div>
                        <div v-if="conference.conferenceStatus === 4" class="statusClass yijieshuClass" style="float: left;">
                            <svg-icon icon-class="yijieshu" style="margin-right:4px;" />
                            <span>{{ conference.conferenceStatusStr }}</span>
                        </div>
                        <div v-if="conference.conferenceStatus === 5" class="statusClass yiquxiaoClass" style="float: left;">
                            <svg-icon icon-class="yiquxiao" style="margin-right:4px;" />
                            <span>{{ conference.conferenceStatusStr }}</span>
                        </div>
                    </div>
                    <div style="width: 100%">
                        <div style="margin-top:16px;width: 100%;height:16px">
                            <span class="biaotiClass" style="float: left">会议时间：</span>
                            <span class="huiyishijianClass" style="max-width:60%;float: left">
                                <span class="lianghangxianshibuquan" style="width:100%">
                                    <span>{{ conference.startTime !== null && conference.startTime.length >= 17 ? conference.startTime.substr(0,16) : conference.startTime }}</span>
                                    {{ conference.startTime !== null && conference.startTime !== '' ? '至' : '' }} <span>{{ conference.endTime !== null && conference.endTime.length >= 17 ? conference.endTime.substr(0,16) : conference.endTime }}</span>
                                </span>
                            </span>
                        </div>
                        <div style="margin-top:8px;width: 100%;height:16px">
                            <span class="biaotiClass" style="float: left">会议场所：</span>
                            <span class="huiyishijianClass" style="max-width:60%;float: left">
                                <span class="lianghangxianshibuquan" style="width:100%">
                                    {{ conference.station }}
                                </span>
                            </span>
                        </div>
                        <div style="margin-top:8px;width: 100%;height:16px">
                            <span class="biaotiClass" style="float: left">报名时间：</span>
                            <span v-if="conference.signTimeFlag !== null" class="baomingshijianClass" style="max-width:60%;float: left">
                                <span class="huiyishijianClass" style="width:100%">
                                    <span v-if="conference.signTimeFlag === 2" class="lianghangxianshibuquan" style="width:100%">
                                        <span>{{ conference.signStartTime !== null && conference.signStartTime.length >= 17 ? conference.signStartTime.substr(0,16) : conference.signStartTime }}</span>
                                        {{ conference.signStartTime !== null && conference.signStartTime !== '' ? '至' : '' }} <span>{{ conference.signEndTime !== null && conference.signEndTime.length >= 17 ? conference.signEndTime.substr(0,16) : conference.signEndTime }}</span>
                                    </span>
                                    <span v-if="conference.signTimeFlag === 1" class="lianghangxianshibuquan" style="width:100%">
                                        截止至{{ conference.signEndTime !== null && conference.signEndTime.length >= 17 ? conference.signEndTime.substr(0,16) : conference.signEndTime }}
                                    </span>
                                    <span v-if="conference.signTimeFlag === 3" class="lianghangxianshibuquan" style="width:100%">
                                        起始于{{ conference.signStartTime !== null && conference.signStartTime.length >= 17 ? conference.signStartTime.substr(0,16) : conference.signStartTime }}
                                    </span>
                                </span>
                            </span>
                            <span v-if="conference.signTimeFlag === null" class="baomingshijianClass" style="max-width:60%;float: left">
                                <span class="lianghangxianshibuquan" style="width:100%">
                                    <span v-if="conference.signTimeFlag === 2" class="lianghangxianshibuquan" style="width:100%">
                                        报名已截止
                                    </span>
                                </span>
                            </span>
                        </div>
                        <div style="margin-top:44px">
                            <el-button class="tianjiahuiyizuzhiClass" style="margin-left:10px;margin-top:5px;color:#1E89FF;float:left" size="small" type="primary" @click="jinruhuiyi(conference)">进入会议</el-button>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div style="min-height:234px;width:100%;margin-top:20px;padding-bottom:30px;" class="huiyiliebiaoClass">
            <el-tabs v-model="activeName">
                <el-tab-pane label="近期会议" name="first">
                    <el-row style="margin-top:-20px">
                        <el-col v-for="(item, index) in conferenceList" :key="index" :span="8" :style="index % 3 === 0 ? {'margin-left': '-20px','padding-left': '20px','margin-top':'40px'} : {'padding-left': '20px','margin-top':'40px','margin-left': '10px'}">
                            <el-link :underline="false" style="width: 100%" @click="jinruhuiyi(item)"><MeetingCard :conference="item" style="width: 100%" /></el-link>
                        </el-col>
                        <el-col v-show="conferenceList === null || conferenceList.length === 0" :span="24" style="text-align:center;height:100%;margin-top: 40px;">
                            <img src="../../assets/meiyouhuiyi.png" style="height: 14em">
                            <div style="width: 100%;text-align:center" class="wushujuwenziClass">这里什么都没有，赶紧创建会议吧！</div>
                            <div style="width: 100%;text-align:center;">
                                <el-button class="chuangjianhuiyihuodongClass" style="margin-top:40px;" type="primary" @click="createConference(conference)"><i class="el-icon-plus" style="margin-right: 4px;width:11px" />创建会议活动</el-button>
                            </div>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="历史会议" name="second">
                    <el-row style="margin-top:-20px;">
                        <el-col v-for="(item, index) in conferenceList" :key="index" :span="8" :style="index % 3 === 0 ? {'margin-left': '-20px','padding-left': '20px','margin-top':'40px'} : {'padding-left': '20px','margin-top':'40px','margin-left': '10px'}">
                            <el-link :underline="false" style="width: 100%" @click="jinruhuiyi(item)"><MeetingCard :conference="item" style="width: 100%" /></el-link>
                        </el-col>

                        <el-col v-show="conferenceList === null || conferenceList.length === 0" :span="24" style="text-align:center;height:100%;margin-top: 40px;">
                            <img src="../../assets/meiyouhuiyi.png" style="height: 14em">
                            <div style="width: 100%;text-align:center" class="wushujuwenziClass">这里什么都没有！</div>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="已取消的会议" name="third">
                    <el-row style="margin-top:-20px">
                        <el-col v-for="(item, index) in conferenceList" :key="index" :span="8" :style="index % 3 === 0 ? {'margin-left': '-20px','padding-left': '20px','margin-top':'40px'} : {'padding-left': '20px','margin-top':'40px','margin-left': '10px'}">
                            <el-link :underline="false" style="width: 100%" @click="jinruhuiyi(item)"><MeetingCard :conference="item" style="width: 100%" /></el-link>
                        </el-col>
                        <el-col v-show="conferenceList === null || conferenceList.length === 0" :span="24" style="text-align:center;height:100%;margin-top: 40px;">
                            <img src="../../assets/meiyouhuiyi.png" style="height: 14em">
                            <div style="width: 100%;text-align:center" class="wushujuwenziClass">这里什么都没有！</div>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane name="fourth" disabled :stretch="true">
                    <span slot="label">
                        <el-input v-model.trim="pageInfo.nameLikeOrStationLike" placeholder="请输入会议名称、地点、城市或主办单位搜索" @keyup.enter.native="getList" style="float: right;width:350px;margin-right:2px;">
                            <el-button slot="append" icon="el-icon-search" @click="getList" />
                        </el-input>
                    </span>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>

</template>

<script>
import { setConferenceId, setConferenceTemplate } from '@/utils/conference-auth'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
import { showLoading, closeLoading } from '@/utils/loading'
import { getList } from '@/api/conference'
import MeetingCard from './meetingCard'
import { getView } from '@/api/conference'
import { getTableHeight } from '@/utils/index'
export default {
    name: 'MyMeetingList',
    components: {
        MeetingCard
    },
    data() {
        return {
            formHeight: getTableHeight(0) + 'px',
            myConferenceList: [],
            imagePath: getOssBaseUrl(),
            conference: {
                startTime: null,
                endTime: null,
                conferenceStatus: null,
                signEndTime: null,
                signStartTime: null,
                signTimeFlag: null,
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
        createConference() {
            this.$emit('createConference', null)
        },
        jinruhuiyi(item) {
            this.$store.state.user.conferenceId = null
            setConferenceId(item.id)
            var load = showLoading()
            getView({ 'id': item.id }).then(res => {
                if (res.success) {
                    setConferenceTemplate(res.result.conferenceTemplate)
                }
            })
            closeLoading(load)
            //

            if (item.conferenceStatus === 1) {
                this.$router.push(`/meeting/update`)
            } else {
                this.$router.push(`/data`)
            }
        },
        getList() {
            if (this.activeName === 'first') {
                this.pageInfo.conferenceStatusEqual = [1, 2, 3]
            } else if (this.activeName === 'second') {
                this.pageInfo.conferenceStatusEqual = [4]
            } else if (this.activeName === 'third') {
                this.pageInfo.conferenceStatusEqual = [5]
            }
            getList(this.pageInfo).then(response => {
                if (this.activeName === 'first') {
                    this.myConferenceList = response.result.list
                    this.$emit('shezhiConferceList', response.result.list)
                    if (response.result.list !== null && response.result.list.length > 0) {
                        if (this.pageInfo.nameLikeOrStationLike !== undefined && this.pageInfo.nameLikeOrStationLike !== null && this.pageInfo.nameLikeOrStationLike !== '') {
                            var tempList = response.result.list
                            this.conferenceList = tempList
                        } else {
                            this.conference = response.result.list[0]
                            var tempList1 = response.result.list
                            tempList1.splice(0, 1)
                            this.conferenceList = tempList1
                        }
                    } else {
                        this.conferenceList = []
                    }
                } else {
                    this.conferenceList = response.result.list
                }
            })

            //
        }
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

    .wushujuwenziClass {
        margin-top: 32px;
        height: 21px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(25, 31, 36, 0.72);
        line-height: 21px;
    }

    .chuangjianhuiyihuodongClass {
        width: 182px;
        height: 48px;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #1E89FF;

        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #1E89FF;
        line-height: 21px;
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
