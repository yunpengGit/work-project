<template>
    <div :class="!sideBar ? 'hideSidebar' : ''" class="app-wrapper">
        <Header />
        <SideBar class="sideBar-container" />
        <div class="main-container">
            <TagsBar />
            <!-- <AppMain /> -->
            <section class="app-main">
                <!-- <AppMain /> -->
                <div class="meetingDetail">
                    <div class="leftCard">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <div class="head">
                                    <div class="left">
                                        <h2>2020年度工作会 <span class="show">未开始</span> </h2>
                                        <ul>
                                            <li>
                                                报名时间:2020-12-02
                                            </li>
                                            <li>
                                                会议时间:2020-12-02
                                            </li>
                                            <li>
                                                会议地点:北京市大兴区经济开发区格兰云天国际大酒店
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="right">
                                        <h2>签到情况 <span>|</span>  <span>已报名总人数：288人</span></h2>
                                    </div>
                                </div>
                            </div>
                            <div style="display:flex; justify-content: space-around;">
                                <div v-for="o in 5" :key="o" style="width:140px;height:98px;text-align: center;" class="text item">
                                    <img style="width:48px;height:48px;margin-bottom:5px;" src="@/assets/logo_new.png" alt=""><br>
                                    {{ '列表内容 ' }}
                                </div>
                            </div>
                        </el-card>
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span style="font-size:16px">代办事项 (5)</span>
                                <el-button style="float: right; padding: 3px 0" type="text">更多</el-button>
                            </div>
                            <div class="text item tabList">
                                <ul>
                                    <li v-for="o in 4" :key="o">
                                        <div> {{ '列表内容 ' + o }}</div>
                                        <div> {{ '列表内容 ' + o }}</div>
                                        <div> {{ '列表内容 ' + o }}</div>
                                    </li>
                                </ul>
                            </div>
                        </el-card>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-card class="box-card">
                                    <div slot="header" class="clearfix">
                                        <span style="font-size:16px">合作商联系人</span>
                                        <el-button style="float: right; padding: 3px 0" type="text">更多</el-button>
                                    </div>
                                    <div class="text item tabList">
                                        <ul>
                                            <li v-for="o in 4" :key="o">
                                                <div>  {{ '列表内容 ' + o }}</div>
                                                <div>  {{ '列表内容 ' + o }}</div>
                                                <div>  {{ '列表内容 ' + o }}</div>
                                            </li>
                                        </ul>
                                    </div>
                                </el-card>
                            </el-col>
                            <el-col :span="12">
                                <el-card class="box-card">
                                    <div slot="header" class="clearfix">
                                        <span style="font-size:16px">会务组联系人</span>
                                        <el-button style="float: right; padding: 3px 0" type="text">更多</el-button>
                                    </div>
                                    <div class="text item tabList">
                                        <ul>
                                            <li v-for="o in 4" :key="o">
                                                <div>  {{ '列表内容 ' + o }}</div>
                                                <div>  {{ '列表内容 ' + o }}</div>
                                                <div>  {{ '列表内容 ' + o }}</div>
                                            </li>
                                        </ul>
                                    </div>
                                </el-card>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import Header from './components/Header'
import SideBar from './components/SideBar/index'
import TagsBar from './components/TagsBar/index'
import AppMain from './components/AppMain'
export default {
    components: {
        Header,
        SideBar,
        TagsBar,
        AppMain
    },
    computed: {
        sideBar() {
            return this.$store.state.sideBar.sideBarOpened
        },
        alarmTable() {
            return this.$store.state.sideBar.alarmTableOpened
        }
    }
}
</script>

<style lang="scss" type="text/scss" scoped>
    @import "~@/styles/mixin.scss";

    .app-wrapper {
        @include clearfix;
        position: relative;
        height: 100%;
        width: 100%;
    }
.meetingDetail{
    font-size: 14px;
    .show{
        display: inline-block;
        width: 42px;
        height: 14px;
        font-size: 10px;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 14px;
        text-align: center;
        background: #1E89FF;
        border-radius: 2px;
    }
}
.head{
    display: flex;
    justify-content: space-between;
}
.head .left,.right{
    width:415px;
}
.head .left{
    margin-right:20px;
}
.head .right span{
    font-size:16px;
    color: #727578;
}
.leftCard{
    width:1250px;
    margin: 10px;
}
.box-card{
    margin-bottom: 10px;
}
.tabList li{
    display: flex;
    justify-content: space-between;
}
.tabList li div{
    height:36px;
    line-height: 36px;
}
</style>
