<template>
    <div class="" :style="{'background-color': 'white', 'height': allHeight + 'px'}">
        <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%;">
            <div style="height:68px;width: 100%;">
                <div style="width: 84%;margin-left: 8%">
                    <el-button style="margin-top:18px;height: 32px;" @click="fanhui"><i class="el-icon-back" style="margin-right:4px" />返回</el-button>
                    <span style="margin-left:16px;height: 25px;font-size: 20px;font-family: PingFangSC-Medium, PingFang SC;font-weight: 500;color: #191F24;line-height: 25px;padding-top:3px"> {{ conference.name }}</span>
                </div>
            </div>
            <div style="min-height:234px;width: 84%;margin-left: 8%">
                <el-row style="border-radius: 4px;background: rgba(25, 31, 36, 0.04);">
                    <el-col :span="12">
                        <img style="height:234px;width: 100%" :src="conference.coverVOs !== null && conference.coverVOs.length > 0 ? (conference.coverVOs[0].downloadUrl) : ''">
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
                            <div style="margin-top:30px;width: 100%;height:16px">
                                <span class="createOrgClass" style="float: left"> {{ conference.createOrganizationName }}</span>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <div v-if="(conferenceTemplate === null || conferenceTemplate.introductionFlag === 1) && (conference.introduction !== null && conference.introduction !== '')" style="width: 100%;margin-top: 34px;">
                    <div style="width: 100%;text-align: center" class="dabiaotiClass">
                        <svg-icon icon-class="huiyijieshao" style="margin-right:8px;" />会议介绍
                    </div>
                    <div style="font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.88);line-height: 28px;white-space: pre-line;width: 100%" class="huiyijieshaoneirongCLass">
                        {{ conference.introduction }}
                    </div>
                </div>
                <div v-if="guestList !== null && guestList.length > 0" style="width: 100%;margin-top: 60px;">
                    <div style="width: 100%;text-align: center" class="dabiaotiClass">
                        <svg-icon icon-class="huiyijiabin" style="margin-right:8px;" />会议嘉宾
                    </div>
                    <div style="width: 100%;margin-top: 20px;">
                        <el-row style="border-radius: 4px;padding-bottom:10px;">
                            <el-col v-for="(item, index) in guestList" :key="'guest' + index" :span="8" style="box-shadow: 0px -1px 0px 0px rgba(25, 31, 36, 0.08), -1px 0px 0px 0px rgba(25, 31, 36, 0.08), 1px 0px 0px 0px rgba(25, 31, 36, 0.08), 0px 1px 0px 0px rgba(25, 31, 36, 0.08);">

                                <div style="width: 100%;padding: 20px 20px 32px 20px;">
                                    <div style="float:left;height: 140px;width: 26%;text-align: left">
                                        <img style="height: 100%;max-width: 100%" :src="item.billUrl !== null && item.billUrl !== '' ? item.billUrl : (defaultPhoto)">
                                    </div>
                                    <div style="float:left;height: 140px;width: 70%;margin-left: 3%">
                                        <div class="jiabinxingming">{{ item.name }}</div>
                                        <div class="jiabindanwei lianghangxianshibuquan" style="margin-top : 4px">{{ item.organizationName }}</div>
                                        <div style="margin-top: 24px;height: 80px">
                                            <div v-for="(item1, index1) in formatTitles(item.title)" v-show="formatTitles(item.title).length === 4 || index1 < 3" :key="'jiabintouxian' + index1" class="jiabintouxian">{{ item1 }}</div>
                                            <div v-if="formatTitles(item.title).length > 4" class="jiabintouxian">...</div>
                                        </div>
                                    </div>
                                    <div style="width: 100%;margin-top: 20px;float:left;">
                                        <div class="yanjiangzhutiClass">演讲主题：</div>
                                        <div class="yanjiangzhutiNeiRongClass">{{ item.theme }}</div>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <div v-if="agendaList !== null && agendaList.length > 0" style="width: 100%;margin-top: 60px;">
                    <div style="width: 100%;text-align: center" class="dabiaotiClass">
                        <svg-icon icon-class="huiyiyicheng" style="margin-right:8px;" />会议议程
                    </div>
                    <div style="width: 100%;margin-top: 20px;">
                        <el-row ref="yichengDiv" style="padding-bottom: 1px;height:auto;">
                            <el-col :span="7" style="height:100%;">
                                <div ref="yichengLeftDiv" style="background: rgba(255, 255, 255, 0.04);border: 1px solid rgba(25, 31, 36, 0.08);">
                                    <div v-for="(item1, index1) in agendaList" :key="'yichengriqi' + index1" :style="{'width':'100%','padding-left': '10px', 'background-color' : (item1.date === selectedAgendaDate ? 'rgba(25, 31, 36, 0.04)' : '')}" class="yichengriqiClass">
                                        <el-link :underline="false" @click="(event) => xuanzeyichengriqi(item1)">
                                            <span style="font-size:14px;line-height:32px;color:#191F24;" :title="item1.date">{{ item1.date }}
                                                {{ formatXingqi(item1.date) }}
                                            </span>

                                        </el-link>
                                        <div style="float:right;height: 20px;wdith:20px;margin-right:10px;margin-top: 2px"><i :style="{'opacity': (item1.date === selectedAgendaDate ? '100' : '0')}" class="el-icon-caret-right" /></div>
                                        <img v-if="findTianqiItem(item1) !== null" style="float:right;height: 20px;margin-top: 10px;margin-right:10px;" :src="tianqiImg + findTianqiItem(item1).wea_img + '.png'">
                                        <span v-if="findTianqiItem(item1) !== null" style="font-size: 12px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.48);line-height: 40px;margin-right:10px;float:right">{{ findTianqiItem(item1).tem1 }}/{{ findTianqiItem(item1).tem2 }}</span>
                                    </div>

                                </div>
                            </el-col>
                            <el-col :span="17">
                                <div ref="yichengRightDiv" style="background: rgba(25, 31, 36, 0.04);padding-top: 20px;padding-bottom: 20px">
                                    <div>
                                        <div v-for="(item2, index2) in childrenAgendaList" :key="'item2' + index2">
                                            <div style="width:100%;padding-right:10px;padding-left:20px;">
                                                <el-link :underline="false" @click="(event) => xianshizijiedian(event)">
                                                    <div style="font-size:14px;line-height:32px;color:#191F24;float: left">{{ formatTime(item2) }}</div>
                                                    <div style="font-size:14px;line-height:32px;color:#191F24;margin-left:10px;float: left">
                                                        <div :title="item2.name">
                                                            {{ formatName(item2.name) }}
                                                        </div>
                                                        <div :title="item2.address" style="height: 16px;font-size: 12px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.48);line-height: 16px;">
                                                            {{ formatAddress(item2.address) }}
                                                        </div>
                                                    </div>
                                                </el-link>
                                            </div>
                                            <div style="width:100%;padding-right:20px;">
                                                <div v-if="item2.children !== undefined && item2.children !== null">
                                                    <div v-for="(item3, index3) in item2.children" :key="'item3' + index3">
                                                        <div style="width:100%;padding-right:10px;padding-left:40px;">
                                                            <el-link :underline="false">
                                                                <div style="font-size:14px;line-height:32px;color: rgba(25, 31, 36, 0.64);;float: left">{{ formatTime(item3) }}</div>
                                                                <div style="font-size:14px;line-height:32px;color:#191F24;margin-left:10px;float: left">
                                                                    <div :title="item3.name">
                                                                        {{ formatName(item3.name) }}
                                                                    </div>
                                                                    <div :title="item3.address" style="height: 16px;font-size: 12px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.48);line-height: 16px;">
                                                                        {{ formatAddress(item3.address) }}
                                                                    </div>
                                                                </div>
                                                            </el-link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <div v-if="orgList !== null && orgList.length > 0" style="width: 100%;margin-top: 60px;">
                    <div style="width: 100%;text-align: center" class="dabiaotiClass">
                        <svg-icon icon-class="huiyizuzhi" style="margin-right:8px;" />会议组织
                    </div>
                    <div style="width: 100%;margin-top: 20px;">
                        <el-row style="border-radius: 4px;">
                            <el-col v-for="(item, index) in orgList" :key="item.orgTypeName" :span="orgList.length === 1 ? 24 : (orgList.length === 2 ? 12 : 8)" style="">
                                <div style="height: 21px;font-size: 16px;font-family: PingFangSC-Medium, PingFang SC;font-weight: 500;color: #191F24;line-height: 21px;text-align: center;width: 100%">
                                    {{ item.orgTypeName }}
                                </div>
                                <div :style="(index%3 === 0 || index%3 === 1) ? {'border-right': 'solid 1px rgba(25, 31, 36, 0.12)'} : {}" class="huiyizuzhimingchengClass">
                                    <div v-for="item1 in item.orgs" :key="'会议组织'+item1.id">
                                        {{ item1.organizationName }}
                                    </div>
                                </div>

                            </el-col>
                        </el-row>
                    </div>
                </div>
                <div v-if="(conferenceTemplate === null || conferenceTemplate.noticeFlag === 1) && (conference.notice !== null && conference.notice !== '')" style="width: 100%;margin-top: 60px;">
                    <div style="width: 100%;text-align: center" class="dabiaotiClass">
                        <svg-icon icon-class="huiyixuzhi" style="margin-right:8px;" />会议须知
                    </div>
                    <div style="width: 100%;padding-left: 23%;padding-right: 23%;margin-top: 20px">
                        <div style="white-space: pre-line;width:100%;background: rgba(25, 31, 36, 0.04);padding: 20px 40px 20px 40px;font-size: 15px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.88);line-height: 28px;">
                            {{ conference.notice }}
                        </div>
                    </div>
                </div>
                <div v-if="conference.contactInformation !== null && conference.contactInformation !== ''" style="width: 100%;margin-top: 60px;">
                    <div style="width: 100%;text-align: center" class="dabiaotiClass">
                        <svg-icon icon-class="lianxiwomen" style="margin-right:8px;" />联系我们
                    </div>
                    <div style="width: 100%;padding-left: 23%;padding-right: 23%;margin-top: 20px">
                        <div style="white-space: pre-line;width:100%;background: rgba(25, 31, 36, 0.04);padding: 20px 40px 20px 40px;font-size: 15px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.88);line-height: 28px;">
                            {{ conference.contactInformation }}
                        </div>
                    </div>
                </div>
                <div v-if="fileList !== null && fileList.length > 0" style="width: 100%;margin-top: 60px;margin-bottom: 100px">
                    <div style="width: 100%;text-align: center" class="dabiaotiClass">
                        <svg-icon icon-class="huiyicailiao" style="margin-right:8px;" />会议材料
                    </div>
                    <div style="width: 100%;padding-left: 23%;padding-right: 23%;margin-top: 20px">
                        <div v-for="item in fileList" :key="'file' + item.id" style="margin-top: 1px;height: 64px;background: #FFFFFF;box-shadow: 0px 1px 0px 0px rgba(25, 31, 36, 0.08);padding: 22px 3px 22px 3px;">
                            <svg-icon :icon-class="panduanwenjianleixing(item)" style="float:left;height: 24px;width: 18px" />
                            <div style="float:left;margin-left: 15px;width: 80%" class="ziliaomingchengClass lianghangxianshibuquan">
                                {{ item.materialName }}
                            </div>
                            <svg-icon v-if="item.materialType !== 2" icon-class="xiazai" style="float:right;height: 24px;width: 18px;cursor: pointer;" @click.native.prevent="xiazaihuiyiziliao(item)" />
                        </div>
                    </div>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
import { getTableHeight, formatXingqi, GMTToStrYYYYMMDD } from '@/utils/index'
import { getView, getTemplateView, downloadFile } from '@/api/conference'
import { getFileList } from '@/api/materials'
import { getList as getGuestList } from '@/api/guest'
import { getList as getAgendaList } from '@/api/agenda'
import { getOssPublicBaseUrl } from '@/utils/x-sso-publicbaseurl'
import axios from 'axios'
import { formatCity } from '@/utils/city'
export default {
    name: 'ConferenceView',
    data() {
        return {
            tianqiApi: process.env.VUE_APP_TIANQI_API,
            tianqiImg: process.env.VUE_APP_TIANQI_IMG,
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
            imagePath: getOssPublicBaseUrl(),
            allHeight: getTableHeight(-50),
            conferenceTemplate: {},
            conference: {
                coverVOs: [],
                name: null,
                conferenceStatus: null,
                conferenceStatusStr: null,
                startTime: null,
                endTime: null,
                station: null,
                signTimeFlag: null,
                signStartTime: null,
                signEndTime: null
            },
            fileList: [],
            agendaList: [],
            guestList: [],
            orgList: [],
            tianqis: [],
            childrenAgendaList: [],
            selectedAgendaDate: null
        }
    },
    created() {
        this.getView(this.$route.query.conferenceId)
        this.getFileList(this.$route.query.conferenceId)
        this.getGuestList(this.$route.query.conferenceId)

        //  this.$refs.yichengLeftDiv.style.minHeight = this.$refs.yichengLeftDiv.innerHeight
    },
    mounted() {
        getAgendaList({ 'conferenceId': this.$route.query.conferenceId }).then(res => {
            this.agendaList = res.result
            if (this.agendaList !== null && this.agendaList.length > 0) {
                var jintian = this.agendaList.find(item => {
                    GMTToStrYYYYMMDD(new Date()) === item.date
                })
                if (jintian !== undefined) {
                    this.selectedAgendaDate = jintian.date
                    this.childrenAgendaList = jintian.children
                } else {
                    var weilai = this.agendaList.findIndex(item => {
                        item.date >= GMTToStrYYYYMMDD(new Date())
                    })

                    if (weilai !== -1) {
                        this.selectedAgendaDate = this.agendaList[weilai].date
                        this.childrenAgendaList = this.agendaList[weilai].children
                    } else {
                        this.selectedAgendaDate = this.agendaList[0].date
                        this.childrenAgendaList = this.agendaList[0].children
                    }
                }

                setTimeout(() => {
                    this.$refs.yichengRightDiv.style.minHeight = this.agendaList.length * 42 + 'px'
                    this.$refs.yichengLeftDiv.style.minHeight = this.$refs.yichengRightDiv.offsetHeight + 'px'
                }, 15)

                // this.$refs.yichengLeftDiv.style.minHeight = this.$refs.yichengLeftDiv.style.minHeight
            }
        })
    },
    methods: {
        formatXingqi(val) {
            return formatXingqi(val)
        },
        xuanzeyichengriqi(val) {
            this.selectedAgendaDate = val.date
            this.childrenAgendaList = val.children
            setTimeout(() => {
                this.$refs.yichengLeftDiv.style.minHeight = this.$refs.yichengRightDiv.offsetHeight + 'px'
            }, 10)
        },
        formatAddress(address) {
            if (address === null || address.length < 15) {
                return address
            } else {
                return address.substr(0, 14) + '...'
            }
        },
        formatName(name) {
            if (name === null || name.length < 10) {
                return name
            } else {
                return name.substr(0, 9) + '...'
            }
        },
        formatTime(data) {
            return (data.startTime !== null && data.startTime.length === 8 ? data.startTime.substr(0, 5) : data.startTime) +
                '~' + (data.endTime !== null && data.endTime.length === 8 ? data.endTime.substr(0, 5) : data.endTime)
        },
        xianshizijiedian(event) {
            var oldDisplay = event.currentTarget.parentElement.parentElement.children[1].style.display
            if (oldDisplay !== 'none') {
                event.currentTarget.parentElement.parentElement.children[1].style.display = 'none'
            } else {
                event.currentTarget.parentElement.parentElement.children[1].style.display = ''
            }
            setTimeout(() => {
                this.$refs.yichengLeftDiv.style.minHeight = this.$refs.yichengRightDiv.offsetHeight + 'px'
            }, 10)
        },
        findTianqiItem(data) {
            if (this.tianqis === null || this.tianqis.length === 0) {
                return null
            }
            var tianItem = this.tianqis.find(item => item.date === data.date)
            if (tianItem === undefined || tianItem === null) {
                return null
            }
            return tianItem
        },
        huyoqutianqi() {
            var city = formatCity(this.conference.provinceValue, this.conference.cityValue)
            if (city !== null && city !== '') {
                var cityTemp = city.replace('市', '')
                axios.get(this.tianqiApi + '&city=' + cityTemp).then(response => {
                    console.log(response.data.data)
                    this.tianqis = response.data.data
                }).catch(error => {
                    console.log(error)
                    // _that.$message('天气获取失败')
                })
            }
        },
        formatTitles(val) {
            if (val === null || val === '') {
                return []
            }
            return val.split(',')
        },
        fanhui() {
            window.history.back()
        },
        formatOrgList(val) {
            if (val === null || val.length === 0) {
                return []
            }
            var orgTypes = []
            var orgs = []
            val.forEach(item => {
                if (orgTypes.indexOf(item.organizationTypeStr) === -1) {
                    orgTypes.push(item.organizationTypeStr)
                }
            })
            orgTypes.forEach(item => {
                orgs.push({
                    orgTypeName: item,
                    orgs: val.filter(item1 => item1.organizationTypeStr === item)
                })
            })
            this.orgList = orgs
        },
        panduanwenjianleixing(val) {
            if (val.materialType === 2) {
                return 'Web'
            } else {
                const fileType = val.materialName.substring(val.materialName.lastIndexOf('.') + 1)
                if (fileType === 'txt') {
                    return 'txt'
                }
                if (fileType === 'pdf') {
                    return 'PDF'
                }
                if (fileType === 'xls' || fileType === 'xlsx') {
                    return 'excel'
                }
                if (fileType === 'jpg' || fileType === 'png') {
                    return 'picture'
                }
                if (fileType === 'doc' || fileType === 'docx') {
                    return 'Word'
                }
            }
            return 'Unknow'
        },
        getFileList(val) {
            getFileList({ conferenceId: val }).then(res => {
                this.fileList = res.result.list
            })
        },
        getGuestList(val) {
            getGuestList({ conferenceId: val }).then(res => {
                this.guestList = res.result.list
            })
        },
        getAgendaList(val) {
            getAgendaList({ 'conferenceId': val }).then(res => {
                this.agendaList = res.result
            })
        },
        getView(val) {
            getView({ 'id': val }).then(res => {
                this.conference = res.result
                this.huyoqutianqi()
                this.formatOrgList(this.conference.organizationVOs)

                this.getTemplateView(val)
            })
        },
        getTemplateView(conferenceId) {
            if (conferenceId !== null) {
                getTemplateView(conferenceId).then(res => {
                    if (res.success) {
                        this.conferenceTemplate = res.result
                    }
                })
            }
        },
        xiazaihuiyiziliao(val) {
            downloadFile({ filePath: val.materialUrl }).then(response => {
                const blob = new Blob([response.data], { type: 'application/octet-stream' })
                const fileName = val.materialName
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob, fileName)
                } else {
                    const link = document.createElement('a')
                    link.style.display = 'none'
                    link.href = URL.createObjectURL(blob)
                    link.setAttribute('download', val.materialName)
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                }
            }).catch(() => {
            })
            // const link = document.createElement('a')
            // link.href = val.materialUrl// 下载链接
            // link.download = val.materialName
            // // link.setAttribute('download', val.materialName)
            // link.style.display = 'none'// a标签隐藏
            // document.body.appendChild(link)
            // link.click()
        }
    }
}
</script>
<style lang="scss" scoped>
.yichengriqiClass {
    height: 40px;
    background: rgba(255, 255, 255, 0);
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #191F24;
    line-height: 40px;
}
.jiabinxingming {
    height: 22px;
    font-size: 18px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #191F24;
    line-height: 22px;
}
.jiabindanwei {
    height: 16px;
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #034CB3;
    line-height: 16px;
}
.jiabintouxian {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(25, 31, 36, 0.72);
    line-height: 20px;
}
.yanjiangzhutiNeiRongClass {
    height: 36px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #191F24;
    line-height: 18px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.yanjiangzhutiClass {
    height: 22px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(25, 31, 36, 0.64);
    line-height: 22px;
}
.huiyizuzhimingchengClass {
    padding-left: 21%;
    padding-right: 21%;
    text-align: center;
    width: 100%;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(25, 31, 36, 0.88);
    line-height: 18px;
    margin-top: 20px
}
.ziliaomingchengClass {
    height: 24px;
    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #191F24;
    line-height: 24px;
}
.huiyijieshaoneirongCLass {
    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(25, 31, 36, 0.88);
    line-height: 24px;
}
.dabiaotiClass {

    height: 25px;
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #191F24;
    line-height: 25px;
}
.createOrgClass {
    height: 16px;
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #191F24;
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
.baomingshijianClass {
    height: 16px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #EA340F;
    line-height: 16px;
}
.lianghangxianshibuquan {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
