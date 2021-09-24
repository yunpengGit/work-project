<template>
    <section class="app-main">
        <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
                <router-view :key="key" />
            </keep-alive>
        </transition>
    </section>
    <!-- <div class="meetingDetail">
        <div class="leftCard">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <div class="head">
                        <div class="left">
                            <h2>2020年度工作会222 <span class="show">未开始</span> </h2>
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
    </div> -->
</template>

<script>
export default {
    name: 'AppMain',
    computed: {
        cachedViews() {
            // alert(this.$store.state.tagsBar.cachedViews)
            return this.$store.state.tagsBar.cachedViews
        },
        key() {
            return this.$route.fullPath
        }
    }
}
</script>
