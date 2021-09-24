<template>
    <div class="">
        <div style="width:100%;height: 100px;margin-top:1em;background-color:white;border-radius: 4px;">
            <el-row>
                <el-col :span="4">
                    <el-link :underline="false" style="width:100%;text-align:center;box-shadow: 1px 0px 0px 0px rgba(25, 31, 36, 0.04);height: 100px" @click="openShareDialog">
                        <svg-icon icon-class="middle_2" style="height:36px;width:36px;margin-top: 14px" />
                        <div class="middleWenziClass">
                            分享会议活动
                        </div>
                    </el-link>
                </el-col>
                <el-col :span="4" :style="{ opacity: daibaomingDisabled ? 0.4 : 1}">
                    <el-link :disabled="daibaomingDisabled" :underline="false" style="width:100%;text-align:center;box-shadow: 1px 0px 0px 0px rgba(25, 31, 36, 0.04);height: 100px" @click="daibaoming">
                        <svg-icon icon-class="middle_1" style="height:36px;width:36px;margin-top: 14px" />
                        <div class="middleWenziClass">
                            代报名
                        </div>
                    </el-link>
                </el-col>
                <el-col :span="4" :style="{ opacity: tianjiacanhuirenDisabled ? 0.4 : 1}">
                    <el-link :disabled="tianjiacanhuirenDisabled" :underline="false" style="width:100%;text-align:center;box-shadow: 1px 0px 0px 0px rgba(25, 31, 36, 0.04);height: 100px" @click="tianjiacanhuiren">
                        <svg-icon icon-class="middle_3" style="height:36px;width:36px;margin-top: 14px" />
                        <div class="middleWenziClass">
                            添加参会人
                        </div>
                    </el-link>
                </el-col>
                <el-col :span="4" :style="{ opacity: baodaoDisabled ? 0.4 : 1}">
                    <el-link :disabled="baodaoDisabled" :underline="false" style="width:100%;text-align:center;box-shadow: 1px 0px 0px 0px rgba(25, 31, 36, 0.04);height: 100px" @click="openCheckinDialog">
                        <svg-icon icon-class="middle_6" style="height:36px;width:36px;margin-top: 14px" />
                        <div class="middleWenziClass">
                            快速报到
                        </div>
                    </el-link>
                </el-col>
                <el-col :span="4" :style="{ opacity: qiandaoDisabled ? 0.4 : 1}">
                    <el-link :disabled="qiandaoDisabled" :underline="false" style="width:100%;text-align:center;box-shadow: 1px 0px 0px 0px rgba(25, 31, 36, 0.04);height: 100px" @click="openCheckinDialog2">
                        <svg-icon icon-class="middle_4" style="height:36px;width:36px;margin-top: 14px" />
                        <div class="middleWenziClass">
                            快速签到
                        </div>
                    </el-link>
                </el-col>
                <el-col :span="4">
                    <el-link :underline="false" style="width:100%;text-align:center;box-shadow: 1px 0px 0px 0px rgba(25, 31, 36, 0.04);height: 100px" @click="changyonglianxiren">
                        <svg-icon icon-class="middle_5" style="height:36px;width:36px;margin-top: 14px" />
                        <div class="middleWenziClass">
                            常用联系人
                        </div>
                    </el-link>
                </el-col>
            </el-row>
            <ConferenceShare :dialog-visible="shareDialogVisible" @closeDialog="closeShareDialog" />
        </div>
    </div>
</template>

<script>
import { getConferenceId } from '@/utils/conference-auth'
import { getSignConfig } from '@/api/signup'
import ConferenceShare from '@/views/conferenceOverview/inMeeting/conferenceShare'
import { GMTToStrMMDDHH } from '@/utils/index'
export default {
    name: 'LeftMiddle',
    components: {
        ConferenceShare
    },
    data() {
        return {
            daibaomingDisabled: this.$store.state.menu.buttons.indexOf(this.Global.buttons.SignupQuery.signup) === -1,
            tianjiacanhuirenDisabled: this.$store.state.menu.buttons.indexOf(this.Global.buttons.AttendeeQuery.signup) === -1,
            baodaoDisabled: this.$store.state.menu.buttons.indexOf(this.Global.buttons.SignInManage.signin) === -1,
            qiandaoDisabled: this.$store.state.menu.buttons.indexOf(this.Global.buttons.SignInManage.signin) === -1,
            shareDialogVisible: false,
            signConfig: {}
        }
    },
    methods: {
        getSignConfig() { // 获取报名设置
            getSignConfig({ 'conferenceId': getConferenceId() }).then(res => {
                this.signConfig = res.result
            })
        },
        tianjiacanhuiren() {
            this.$router.push({
                path: `/attendeeManagement/attendee/edit/0`
            })
        },
        daibaoming() {
            getSignConfig({ 'conferenceId': getConferenceId() }).then(res => {
                this.signConfig = res.result
                if (new Date(this.signConfig.endTime).getTime() >= new Date().getTime() && new Date(this.signConfig.startTime).getTime() <= new Date().getTime()) {
                    this.$router.push({
                        path: `/attendeeManagement/attendee/signup/0`
                    })
                } else {
                    if (new Date(this.signConfig.startTime).getTime() > new Date().getTime()) {
                        this.$message('报名未开始，请于' + GMTToStrMMDDHH(this.signConfig.startTime) + '后报名')
                    } else {
                        this.$message('报名已结束')
                    }
                }
            })
        },
        openCheckinDialog() {
            this.$router.push('/attendeeManagement/signinManage')
        },
        openCheckinDialog2() {
            this.$router.push({
                path: '/attendeeManagement/signinManage',
                query: {
                    activeName: 2
                }
            })
        },
        changyonglianxiren() {
            this.$router.push('/contact')
        },
        openShareDialog() {
            this.shareDialogVisible = true
        },
        closeShareDialog() {
            this.shareDialogVisible = false
        }
    }
}
</script>
<style lang="scss" scoped>
.middleWenziClass {
    width:100%;
    text-align:center;
    margin-top:12px;
    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(25, 31, 36, 0.72);
    line-height: 20px;
}
</style>
<style lang="scss">
.el-link.el-link--default.is-disabled {
    background: white !important;
}
</style>
