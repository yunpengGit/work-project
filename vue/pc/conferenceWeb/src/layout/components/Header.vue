<template>
    <div class="app-header headerClass">
        <div class="clearfix">
            <div style="float: left; padding-top: 10px; height： 50px">
                <img src="@/assets/logo-new.svg" style="height:30px;">
                <!-- <svg-icon icon-class="logo" class="logo" /> -->
            </div>
            <div class="header-title" style="float: left; width: 40px;color:white;text-align: center;margin-left: -5px">
                <!-- {{ buttons }} -->
                <el-divider v-if="noConferenceNamePaths.indexOf(this.$route.path) === -1" direction="vertical" />

                <!--  -->
            </div>
            <div class="header-title" style="float: left; font-size: 16px;color:white;">
                {{ noConferenceNamePaths.indexOf(this.$route.path) === -1 ? this.$store.state.user.conferenceName : '' }}
            </div>
            <div class="rightUser" style="float: right;">
                <span id="gongzuotai" style="height:50px;">
                    <router-link v-if="noWorkbenchPaths.indexOf(this.$route.path) === -1" class="xingmingClass" to="/index">工作台</router-link>
                </span>
                <!-- <el-link :underline="false" type="info" style="float: right;color:white">工作台</el-link> -->
                <!-- <el-menu class="el-menu-demo" mode="horizontal" style="background-color:#00274C;color:white">
                        <el-menu-item id="gongzuotai" index="1" class="headerMenu">
                            <router-link to="/index">工作台</router-link>
                        </el-menu-item>

                    </el-menu> -->
                <img :src="loginPhoto !== null && loginPhoto !== '' ? loginPhoto : (defaultPhoto)" style="height:24px;border-radius:24px;width:24px;overflow: hidden;margin-left:24px;">
                <span class="xingmingClass" style="margin-left:10px;width:50px">
                    {{ loginName }}
                </span>
            </div>
            <!-- <div class="rightUser" style="width:550px;float: right;">
                <div>
                    <el-menu class="el-menu-demo" mode="horizontal">
                        <el-menu-item id="gongzuotai" index="1" class="headerMenu">
                            <router-link to="/index">工作台</router-link>
                        </el-menu-item>

                    </el-menu>
                </div>
                <div>
                    <span class="headerMenuDivide">&nbsp;</span>
                </div>
                <div style="padding-left:20px;margin-left: 10px;padding-right:3px;line-height:0px">
                    <img :src="loginPhoto !== null && loginPhoto !== '' ? loginPhoto : (imagePath + defaultPhoto)" style="height:22px;border-radius:25px;overflow: hidden;">
                </div>
                <span>
                    {{ loginName }}
                </span>
            </div> -->
        </div>
    </div>
</template>

<script>
import { loginInfo } from '@/api/login'
import { removeToken } from '@/utils/user-auth'
import { getOssPublicBaseUrl } from '@/utils/x-sso-publicbaseurl'
// import { getConferenceId } from '@/utils/conference-auth'
// import { getView } from '@/api/conference'
export default {
    name: 'Header',
    data() {
        return {
            imagePath: getOssPublicBaseUrl(),
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
            noConferenceNamePaths: ['/index', '/meetingCreate/create', '/meetingCreate/todoWorkList/0', '/index/dataScreen', '/selectConferenceTemplate', '/index/dataScreen', '/conferenceView'],
            noWorkbenchPaths: ['/index'],
            loginName: '',
            loginPhoto: ''
            // conferenceId: this.$store.state.user.conferenceId,
            // conferenceName:
        }
    },
    watch: {
        // conferenceId() {
        //     alert(this.conferenceId)
        //     if (this.conferenceId !== undefined && this.conferenceId !== null && this.conferenceId !== '') {
        //         getView({ 'conferenceId': getConferenceId() }).then(res => {
        //             this.conferenceName = res.result.name
        //         })
        //     } else {
        //         this.conferenceName = null
        //     }
        // }
    },
    created() {
        loginInfo().then(res => {
            this.loginName = res.result.ssoUserName
            this.loginPhoto = res.result.ssoPhoto
        })
    },
    methods: {
        toggleAlarmTable() {
            this.$store.dispatch('sideBar/toggleAlarmTable')
        },
        async logout() {
            removeToken()
            this.$router.push('/')
            // await this.$store.dispatch('user/logout')
            // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        },
        toggleSideBar() {
            this.$store.dispatch('sideBar/toggleSideBar')
        }
    }
}
</script>

<style lang="scss" type="text/scss" scoped>
    .rightUser{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .rightUser .index{
        margin-right:30px
    }
    .el-avatar {
        overflow: inherit;
        margin-left: 20px;
    }
    .logo {
        font-size: 40px;
        fill: #fff !important;
    }
    .el-badge {
        margin-right: 25px;
        margin-top: 5px;
    }
    @media (max-width: 700px) {
        .header-title {
            display: none;
        }
    }
    .headerMenu {
        height: 50px;
        line-height: 50px;
        padding: 0px;
        margin-left: 40px;
        font-size: 15px;
    }
    .headerMenu-is-active {
        // border-bottom:solid #1E89FF 3px !important;
    }
    .headerMenuDivide {
        border-right-style: solid;
        border-right-width: 1px;
        border-right-color: #E8D9B5;
        padding-left: 30px;
    }
    .el-dropdown-link {
        cursor: pointer;
    }
    .el-icon-arrow-down {
        font-size: 12px;
    }
    .el-menu-item a {
        line-height: 50px;
        text-decoration: none;
        display: inline-block;
        height: inherit;
    }
    .headerClass {
        height: 50px !important;
        background: #00274C !important;
        box-shadow: 0px -1px 0px 0px rgba(255, 255, 255, 0.16) !important;
    }
    .xingmingClass {
        height: 20px;
        font-size: 15px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 20px;
    }
</style>
