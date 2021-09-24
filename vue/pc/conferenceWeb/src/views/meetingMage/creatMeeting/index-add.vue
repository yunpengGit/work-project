<template>
    <div style="background-color:#EEF0F4;">
        <div style="box-shadow: 0px 2px 4px 0px rgba(25, 31, 36, 0.08);padding-top:7px;position:sticky;background-color:white;z-index:999;padding-bottom:5px;height:50px">
            <span style="font-weight: 500;margin-left: 11%;font-size:16px;color: #191F24;font-family: PingFangSC-Medium, PingFang SC;;margin-top:8px;float:left">创建{{ getConferenceTemplate(1) }}</span>
            <el-button v-show="!(conferenceStatus === 0 && conferenceDisabled)" style="float:right;margin-right:11%;font-size:15px;padding-left:7px" :disabled="conferenceDisabled || baseInfomationFullFlag === 0 || agendaInfomationFullFlag === 0 || signupInfomationFullFlag === 0" type="primary" :class="fabuClass" @click="fabu"><i class="el-icon-s-promotion" />&nbsp;发布{{ getConferenceTemplate(1) }}</el-button>
            <el-button v-if="conferenceStatus === 0 || conferenceStatus === 2 || conferenceStatus === -1" v-permission="Global.buttons.ConferenceView.delete" style="float:right;margin-right:10px;font-size:15px;padding-left:7px" type="danger" @click="deleteConference"><i class="el-icon-delete" />&nbsp;删除{{ getConferenceTemplate(1) }}</el-button>
            <el-button v-if="conferenceStatus === 0 && conferenceDisabled" :disabled="panduanshifoudayudangqianshijian(conferenceStartTime)" style="float:right;margin-right:11%;font-size:15px;" @click="quxiaofabu">取消{{ getConferenceTemplate(1) }}</el-button>
            <span v-show="conferenceStatus === 0 && !conferenceDisabled && !(conferenceDisabled || baseInfomationFullFlag === 0 || agendaInfomationFullFlag === 0 || signupInfomationFullFlag === 0)" class="_48OpacityClass">您已填写完成{{ getConferenceTemplate(1) }}的所有必要信息，可点击右侧按钮发布。</span>
        </div>
        <el-tabs v-model="activeName" class="jibenxinxiClass" tab-position="left" :style="{'width':'80%','margin-left':'10%','height':paneTabsHeight, 'background-color':'#EEF0F4','padding-right': '8px'}" :stretch="true" @tab-click="handleClick">
            <el-tab-pane name="first" :style="{'height':paneHeight, 'overflow-y':overflowY, 'overflow-x':overflowX, 'background-color':'#EEF0F4','padding-left': '8px'}">
                <span slot="label" style="float:left;">
                    <!-- <i v-if="baseInfomationFullFlag === 1" class="el-icon-check" style="color:#1E89FF" />
                    <i v-else class="el-icon-check" style="color: white;opacity: 0" /> -->
                    <i v-if="baseInfomationFullFlag === 1" class="el-icon-success" style="color:#03BE1C;" />
                    <i v-else class="el-icon-success" style="color: white;opacity: 0" />
                    基本信息
                    <span>（必填）</span>
                    <i v-if="activeName === 'first'" class="el-icon-caret-right" />
                </span>
                <information
                    ref="information"
                    :conference-template="conferenceTemplate"
                    :conference-id="conferenceId"
                    :active-name="activeName"
                    style="overflow-x:hidden;padding-top:20px;"
                    @shezhiTabkeyong="shezhiTabkeyong"
                    @shezhiyichengbitian="shezhiyichengbitian"
                    @shezhibaomingbitian="shezhibaomingbitian"
                    @checkFull="checkFull"
                    :conferenceStatus.sync='conferenceStatus'
                    @setHideLoading="setHideLoading"
                />
            </el-tab-pane>
            <el-tab-pane v-if="conferenceTemplate === null || conferenceTemplate.setAgendaFlag === 1" :lazy="true" :disabled="tabsDisabledFlag || !yichengbitian" name="second" :style="{'height':paneHeight, 'overflow-y':overflowY, 'overflow-x':overflowX, 'background-color':'#EEF0F4','padding-left': '8px'}">
                <span slot="label" style="float:left">
                    <i v-if="agendaInfomationFullFlag === 1 && (!(tabsDisabledFlag || !yichengbitian))" class="el-icon-success" style="color:#03BE1C" />
                    <i v-else class="el-icon-success" style="color: white;opacity: 0" />
                    议程信息
                    <span v-if="yichengbitian">（必填）</span>
                    <span v-else style="color:white;opacity: 0">（必填）</span>
                    <i v-if="activeName === 'second'" class="el-icon-caret-right" />
                </span>
                <agenda :conference-start-time="conferenceStartTime" :conference-end-time="conferenceEndTime" :conference-id="conferenceId" :active-name="activeName" style="height:100%;" @checkFull="checkFull" />
            </el-tab-pane>
            <el-tab-pane :lazy="true" :disabled="tabsDisabledFlag || !baomingbitian" name="third" :style="{'height':paneHeight, 'overflow-y':overflowY, 'overflow-x':overflowX, 'background-color':'#EEF0F4','padding-left': '8px'}">
                <span slot="label" style="float:left">
                    <i v-if="signupInfomationFullFlag === 1 && (!(tabsDisabledFlag || !baomingbitian))" class="el-icon-success" style="color:#03BE1C" />
                    <i v-else class="el-icon-success" style="color: white;opacity: 0" />
                    报名信息
                    <span v-if="baomingbitian" style="width:55px">（必填）</span>
                    <span v-else style="color:white;opacity: 0">（必填）</span>
                    <i v-if="activeName === 'third'" class="el-icon-caret-right" />
                </span>
                <!-- <el-scrollbar style="height:100%;"> -->
                <signup
                    ref="signup"
                    :conference-template="conferenceTemplate"
                    :set-agenda-flag="setAgendaFlag"
                    :conference-start-time="conferenceStartTime"
                    :conference-end-time="conferenceEndTime"
                    :conference-id="conferenceId"
                    :active-name="activeName"
                    style="overflow-x:hidden;"
                    @checkFull="checkFull"
                    @setHideLoading="setHideLoading"
                />
                <!-- </el-scrollbar> -->
            </el-tab-pane>
            <el-tab-pane v-if="conferenceTemplate === null || conferenceTemplate.conferenceGuestFlag === 1" :lazy="true" :disabled="tabsDisabledFlag" name="fourth" :style="{'height':paneHeight, 'overflow-y':overflowY, 'overflow-x':overflowX, 'background-color':'#EEF0F4'}">
                <span slot="label" style="float:left">
                    <i class="el-icon-check" style="color: white;opacity: 0" />
                    嘉宾信息
                    <span style="color:white;opacity: 0">（必填）</span>
                    <i v-if="activeName === 'fourth'" class="el-icon-caret-right" />
                </span>
                <guest :conference-id="conferenceId" :active-name="activeName" style="margin-top:8px" />
            </el-tab-pane>
            <el-tab-pane v-if="conferenceTemplate === null || conferenceTemplate.conferenceMaterialsFlag === 1" :lazy="true" :disabled="tabsDisabledFlag" name="five" :style="{'height':paneHeight, 'overflow-y':overflowY, 'overflow-x':overflowX, 'background-color':'#EEF0F4','padding-left': '8px'}">
                <span slot="label" style="float:left;">
                    <i class="el-icon-check" style="color: white;opacity: 0" />
                    {{ getConferenceTemplate(1) }}资料
                    <span style="color:white;opacity: 0">（必填）</span>
                    <i v-if="activeName === 'five'" class="el-icon-caret-right" />
                </span>
                <materials :conference-id="conferenceId" :active-name="activeName" style="margin-top:8px" />
            </el-tab-pane>
            <div v-if="activeName === 'first' || activeName === 'third'" style="height:60px;margin-left:8px;border-top:solid 1px #EEF0F4;text-align:center;position:sticky;background-color:white;box-shadow: 0px 1px 0px 0px rgba(25, 31, 36, 0.08);">
                <!-- <div style="float:left;width:8px;height:100px;background-color:#EEF0F4">&nbsp;</div>
                <div style="float:right;width:2px;height:100px;background-color:#EEF0F4">&nbsp;</div> -->
                <el-button style="margin-top:5px;height:30px" @click="closePage">返回</el-button>
                <el-button :loading="loading" style="margin-top:5px;height:30px" type="primary" :disabled="conferenceDisabled" @click="onSubmit">暂存</el-button>
            </div>
        </el-tabs>
        <!-- <div style="padding-top:10px;text-align:center;position:sticky;background-color:white;z-index:2">
            <el-button>关闭</el-button>
            <el-button type="primary" @click="onSubmit">保存</el-button>
        </div> -->
    </div>
</template>
<script>
import Information from './components/information'
import Agenda from './components/agenda'
import Signup from './components/signup'
import Guest from './components/guest'
import Materials from './components/materials'
import { getTableHeight } from '@/utils/index'
import { getConferenceId, setConferenceId } from '@/utils/conference-auth'
import { getView, checkFull, fabu, cancel, downloadFile, deleteById} from '@/api/conference'
import { showTextLoading, closeLoading } from '@/utils/loading'
export default {
    name: 'IndexAdd',
    components: {
        Information,
        Agenda,
        Signup,
        Guest,
        Materials
    },
    data() {
        return {
            signCodePath: null,
            signCodeDownloadUrl: null,
            signInCodeUrl: null,
            conferenceTemplate: null,
            setAgendaFlag: null,
            conferenceStatus: null,
            conferenceStartTime: null,
            conferenceEndTime: null,
            fabuClass: 'fabuDisabled',
            baseInfomationFullFlag: 0,
            agendaInfomationFullFlag: 0,
            signupInfomationFullFlag: 0,
            conferenceDisabled: false,
            yichengbitian: false,
            baomingbitian: false,
            conferenceId: getConferenceId(),
            activeName: 'first',
            paneTabsHeight: getTableHeight(-20) + 'px',
            paneHeight: getTableHeight(30) + 'px',
            overflowY: 'auto',
            overflowX: 'hidden',
            tabsDisabledFlag: true,
            loading: false
        }
    },
    watch: {
        activeName(val) {
            if (val === 'first' || val === 'third') {
                this.paneHeight = getTableHeight(30) + 'px'
            } else {
                this.paneHeight = getTableHeight(-20) + 'px'
            }
        },
        conferenceId(val) {
            if (val !== null) {
                this.getConferenceView()
                this.checkFull()
            }
        },
        conferenceDisabled(val) {
            this.shezhiActive()
        },
        baseInfomationFullFlag(val) {
            this.shezhiActive()
        },
        agendaInfomationFullFlag(val) {
            this.shezhiActive()
        },
        signupInfomationFullFlag(val) {
            this.shezhiActive()
        },
         conferenceStatus(newStatus){
            console.log(newStatus,"newStatus22")
        }
    },
    created() {
        this.conferenceTemplate = JSON.parse(this.$route.query.conferenceTemplate)

        // if (this.$route.query.templateId !== null) {
        //     getTemplateView(this.$route.query.templateId).then(res => {
        //         if (res.success) {
        //             this.conferenceTemplate = res.result
        //         }
        //     })
        // }
    },
    methods: {
        getConferenceView() {
            getView({ 'id': this.conferenceId }).then(res => {
                this.conferenceStatus = res.result.status
                this.conferenceDisabled = res.result.status !== 0
                this.conferenceStartTime = res.result.startTime
                this.conferenceEndTime = res.result.endTime
                this.setAgendaFlag = res.result.setAgendaFlag
                this.signInCodeUrl = res.result.signInCodeUrl
                this.signCodeDownloadUrl = res.result.signCodeDownloadUrl
                this.signCodePath = res.result.signCodePath
            })
        },
        deleteConference() {
            this.$confirm('请确认是否删除' + this.getConferenceTemplate(1) + '信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteById({ 'id': this.conferenceId }).then(res1 => {
                    if (res1.success) {
                        this.$message(res1.message)
                        this.conferenceDisabled = true
                        setConferenceId('')
                        this.$router.push({ path: '/index' })
                    }
                })
            })
        },
        panduanshifoudayudangqianshijian(val) {
            if (val === null || val === '') {
                return true
            }
            var date = new Date(val)
            if (date.getTime() <= new Date().getTime()) {
                return true
            }
            return false
        },
        shezhiActive() {
            if (!(this.conferenceDisabled || this.baseInfomationFullFlag === 0 || this.agendaInfomationFullFlag === 0 || this.signupInfomationFullFlag === 0)) {
                this.fabuClass = 'fabuActive'
            } else {
                this.fabuClass = 'fabuDisabled'
            }
        },
        closePage() {
            window.history.back(-1)
            // window.close()
        },
        checkFull(conferenceId) {
            if (conferenceId !== null && conferenceId !== undefined && conferenceId !== '') {
                this.conferenceId = conferenceId
                this.getConferenceView()
            }
            checkFull({ 'id': this.conferenceId }).then(res => {
                this.baseInfomationFullFlag = res.result.baseInfomationFullFlag
                this.agendaInfomationFullFlag = res.result.agendaInfomationFullFlag
                this.signupInfomationFullFlag = res.result.signupInfomationFullFlag
                // this.baseInfomationFullFlag = 1
                // this.agendaInfomationFullFlag = 1
                // this.signupInfomationFullFlag = 1
            })
        },
        shezhiyichengbitian(val) {
            this.yichengbitian = val
            if (val) {
                this.setAgendaFlag = 1
            } else {
                this.setAgendaFlag = 0
            }
        },
        shezhibaomingbitian(val) {
            this.baomingbitian = val
        },
        shezhiTabkeyong(conferenceId) {
            this.conferenceId = conferenceId
            this.tabsDisabledFlag = false
        },
        handleClick() {},
        onSubmit() {
            if (this.activeName === 'third') {
                this.$refs.signup.submitSignup()
            } else {
                this.$refs.information.submitConference()
            }
        },
        setHideLoading(val) {
            this.loading = val
        },
        downloadFunction(val) {
            if (val !== null && val !== '') {
                const load1 = showTextLoading('正在下载...')
                downloadFile({ filePath: val }).then(res => {
                    if (decodeURI(res.headers['filename']) == null || decodeURI(res.headers['filename']) === 'undefined') {
                        this.$message('文件不存在')
                    } else {
                        const blob = new Blob([res.data], { type: 'application/octet-stream' })

                        const fileName = val.substring(val.lastIndexOf('/') + 1, val.length)
                        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                            navigator.msSaveBlob(blob, fileName)
                        } else {
                            const link = document.createElement('a')
                            link.style.display = 'none'
                            link.href = URL.createObjectURL(blob)
                            link.setAttribute('download', fileName)
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)
                        }
                    }
                    closeLoading(load1)
                }).catch(error => {
                    console.log(error)
                    closeLoading(load1)
                })
            }
        },
        fabu() {
            // h('p', null, [
            // h('span', null, '您现在可以 '),
            // h('el-link', { attrs: { underline: false, type: 'primary', href: this.signCodeDownloadUrl }, style: { marginTop: '-3px' }}, '下载' + this.getConferenceTemplate(1) + '二维码'),
            // h('span', null, ' 或 '),
            // h('el-link', { attrs: { underline: false, type: 'primary', href: this.signInCodeUrl }, style: { marginTop: '-3px' }}, '下载报到码'),
            // h('span', null, '，也可以稍后从' + this.getConferenceTemplate(1) + '总览、签到管理中下载')
            this.$confirm('请确认是否发布' + this.getConferenceTemplate(1) + '信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                fabu({ 'id': this.conferenceId }).then(res => {
                    if (res.success) {
                        const h = this.$createElement
                        this.$msgbox({
                            title: this.getConferenceTemplate(1) + '发布成功',
                            message: h('p', null, [
                                h('span', null, '您可'),
                                h('el-link', { attrs: { underline: false, type: 'primary' }, on: { click: () => this.downloadFunction(this.signCodePath) }, style: { marginTop: '-3px' }}, '下载' + this.getConferenceTemplate(1) + '二维码'),
                                h('span', null, '，或稍后从' + this.getConferenceTemplate(1) + '总览中下载')
                            ]),
                            confirmButtonText: '我知道了'
                        }).then(action => {
                            this.$message(res.message)
                            this.conferenceDisabled = true
                            this.$router.push(`/meeting/update`)
                        }).catch(action => {
                            this.$message(res.message)
                            this.conferenceDisabled = true
                            this.$router.push(`/meeting/update`)
                        })
                        // this.$confirm('是否需要下载会议二维及报到码，您也可在会议活动总览、签到管理中下载', this.getConferenceTemplate(1) + '发布成功', {
                        //     distinguishCancelAndClose: true,
                        //     confirmButtonText: '立即下载',
                        //     cancelButtonText: '稍后下载'
                        // }).then(() => {
                        //     window.open(this.signInCodeUrl)
                        //     this.$message(res.message)
                        //     this.conferenceDisabled = true
                        //     this.$router.push(`/meeting/update`)
                        // }).catch(action => {
                        //     this.$message(res.message)
                        //     this.conferenceDisabled = true
                        //     this.$router.push(`/meeting/update`)
                        // })
                    }
                })
            }).catch(() => {})
        },
        quxiaofabu() {
            this.$confirm('请确认是否取消发布' + this.getConferenceTemplate(1) + '信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                cancel({ 'id': this.conferenceId }).then(res1 => {
                    if (res1.success) {
                        this.$message(res1.message)
                        this.conferenceDisabled = true
                        getView({ 'id': this.conferenceId }).then(res => {
                            this.conferenceStatus = res.result.status
                            this.conferenceDisabled = res.result.status !== 0
                            this.conferenceStartTime = res.result.startTime
                            this.conferenceEndTime = res.result.endTime
                        })
                    }
                })
            }).catch(() => {})
        }
    }
}
</script>
<style lang="scss" scoped>
.fabuDisabled {
    height: 36px;
    background: rgba(25, 31, 36, 0.08)!important;
    border-radius: 4px;
    color: rgba(25, 31, 36, 0.32) !important;
    border: none;

}
.fabuActive {
    height: 36px;
    background: #FF8200 !important;
    border-radius: 4px;
    color:#FFFFFF !important;
    border: none;
}

._48OpacityClass {
    width: 343px;
    height: 32px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(25, 31, 36, 0.48);
    line-height: 16px;
    float:right;
    margin-top:10px
}
</style>
