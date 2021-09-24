<template>
    <div class="">
        <el-card :body-style="{ padding: '0px' }">
            <div style="position: absolute;z-index:999;width: 100%;height: 170px">
                <div v-if="conference.conferenceStatus === 1" class="statusClass yiquxiaoClass" style="float: left;margin-left: 0px;border-radius: 4px 0px 18px 0px;">
                    <svg-icon icon-class="yiquxiao" style="margin-right:4px;" />
                    <span>{{ conference.conferenceStatusStr }}</span>
                </div>
                <div v-if="conference.conferenceStatus === 2" class="statusClass weikaishiClass " style="float: left;margin-left: 0px;border-radius: 4px 0px 18px 0px;">
                    <svg-icon icon-class="weikaishi" style="margin-right:4px;" />
                    <span>{{ conference.conferenceStatusStr }}</span>
                </div>
                <div v-if="conference.conferenceStatus === 3" class="statusClass jinxingzhongClass" style="float: left;margin-left: 0px;border-radius: 4px 0px 18px 0px;">
                    <svg-icon icon-class="jinxingzhong" style="margin-right:4px;" />
                    <span>{{ conference.conferenceStatusStr }}</span>
                </div>
                <div v-if="conference.conferenceStatus === 4" class="statusClass yijieshuClass" style="float: left;margin-left: 0px;border-radius: 4px 0px 18px 0px;">
                    <svg-icon icon-class="yijieshu" style="margin-right:4px;" />
                    <span>{{ conference.conferenceStatusStr }}</span>
                </div>
                <div v-if="conference.conferenceStatus === 5" class="statusClass yiquxiaoClass" style="float: left;margin-left: 0px;border-radius: 4px 0px 18px 0px;">
                    <svg-icon icon-class="yiquxiao" style="margin-right:4px;" />
                    <span>{{ conference.conferenceStatusStr }}</span>
                </div>

            </div>
            <div style="position: relative;width: 100%;height: 170px">
                <img
                    :src="conference.coverVOs !== null && conference.coverVOs.length > 0 ? (imagePath + conference.coverVOs[0].coverUrl) : ''"
                    style="height: 170px;width:100%"
                    class="image"
                >
                <div style="position: absolute; left: 10px; top: 145px;font-size: 14px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: #FFFFFF;line-height: 18px;">
                    {{ conference.typeStr }}
                </div>
                <div v-show="myConferenceList.find(item => item.id === conference.id) !== undefined && conferenceFlag === 2" style="position: absolute; right: 10px; top: 145px;">
                    <svg-icon icon-class="xiaohuangren" />
                </div>
            </div>

            <div style="padding: 16px;">
                <div class="listTitleClass lianghangxianshibuquan">{{ conference.name }}</div>
                <div style="width: 100%;margin-top:8px;height:16px">
                    <span class="biaotiClass" style="float: left">会议时间：</span>
                    <span class="huiyishijianClass" style="max-width:60%;float: left">
                        <span class="lianghangxianshibuquan" style="width:100%">
                            <span>{{ conference.startTime !== null && conference.startTime.length >= 17 ? conference.startTime.substr(0,16) : conference.startTime }}</span>
                            {{ conference.startTime !== null && conference.startTime !== '' ? '至' : '' }} <span>{{ conference.endTime !== null && conference.endTime.length >= 17 ? conference.endTime.substr(0,16) : conference.endTime }}</span>
                        </span>
                    </span>
                </div>
                <div style="width: 100%;margin-top:4px;height:16px">
                    <span class="biaotiClass" style="float: left">会议地点：</span>
                    <span class="huiyishijianClass" style="max-width:60%;float: left">
                        <span class="lianghangxianshibuquan" style="width:100%">
                            {{ conference.station }}
                        </span>
                    </span>
                </div>
                <div style="width: 100%;margin-top:4px;height:16px">
                    <span class="biaotiClass" style="float: left">创建单位：</span>
                    <span class="huiyishijianClass" style="max-width:60%;float: left">
                        <span class="lianghangxianshibuquan" style="width:100%">
                            {{ conference.createOrganizationName }}
                        </span>
                    </span>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
export default {
    name: 'MeetingCard',
    props: {
        conferenceFlag: {
            type: Number,
            default: 1
        },
        myConferenceList: {
            type: Array,
            default: function() {
                return []
            }
        },
        conference: {
            type: Object,
            default: function() {
                return {
                    name: null,
                    startTime: null,
                    endTime: null,
                    station: null,
                    createOrganizationName: null
                }
            }
        }
    },
    data() {
        return {
            userId: this.$store.state.user.users.userId,
            imagePath: getOssBaseUrl()
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

</style>
