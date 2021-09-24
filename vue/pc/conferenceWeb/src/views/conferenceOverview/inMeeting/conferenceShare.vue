<template>
    <div class="">
        <el-dialog
            :title="'分享' + getConferenceTemplate(1) + '活动'"
            width="45%"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="closeDialog"
            style="overflow: hidden"
        >
            <el-form
                ref="ruleForm"
                :model="ruleForm"
                :rules="rules"
                label-width="100px"
                class="demo-ruleForm"
                style="padding-bottom:20px"
            >
                <el-form-item label="参会链接">
                    <div style="height:45px">
                        <el-input
                            v-model="ruleForm.signUrl"
                            readonly
                            style="width:360px;float:left;margin-top:3px;margin-left:2px"
                        />
                        <el-button
                            v-clipboard:copy="ruleForm.signUrl"
                            v-clipboard:success="onCopy"
                            v-clipboard:error="onError"
                            class="erweimaClass"
                            size="small"
                            type="primary"
                            style="margin-left:10px;margin-top:3px;color:#1E89FF"
                        >复制链接</el-button>
                    </div>
                    <!-- conferenceDisabled
                    el-icon-full-screen -->
                </el-form-item>
                <el-form-item :label="getConferenceTemplate(1) + '二维码'">
                    <div style="height:200px;">
                        <img
                            readonly
                            :src="imagePath + ruleForm.signCodeDownloadUrl"
                            style="width:200px;height:200px;float:left;margin-top:3px;margin-left:2px"
                        >
                        <!-- :href="imagePath + ruleForm.signCodeDownloadUrl" -->
                        <el-link :underline="false" style="margin-top:160px">
                            <el-button
                                class="erweimaClass"
                                size="small"
                                type="primary"
                                style="margin-left:10px;margin-top:3px;color:#1E89FF"
                                @click="xiazaierweima"
                            >下载二维码</el-button>
                        </el-link>
                        <el-link :underline="false" style="margin-top:160px">
                            <el-button
                                class="erweimaClass"
                                size="small"
                                type="primary"
                                style="margin-left:10px;margin-top:3px;color:#1E89FF"
                                @click="toImage"
                            >生成邀请函</el-button>
                        </el-link>
                    </div>
                </el-form-item>
                <el-form-item v-show="ruleForm.conferenceCode !== null && ruleForm.conferenceCode !== ''" :label="getConferenceTemplate(1) + '代码'">
                    <div style="height:45px">
                        <el-input
                            v-model="ruleForm.conferenceCode"
                            readonly
                            style="width:160px;float:left;margin-top:3px;margin-left:2px"
                        />
                        <el-button
                            v-clipboard:copy="ruleForm.conferenceCode"
                            v-clipboard:success="onCopy"
                            v-clipboard:error="onError"
                            :disabled="ruleForm.conferenceCode === null || ruleForm.conferenceCode === ''"
                            :class="ruleForm.conferenceCode === null || ruleForm.conferenceCode === '' ? 'erweimaDisabledClass': 'erweimaClass'"
                            size="small"
                            type="primary"
                            style="margin-left:10px;margin-top:3px;"
                        >复制代码</el-button>
                    </div>
                    <!-- conferenceDisabled
                    el-icon-full-screen -->
                </el-form-item>
                <div style="opacity:0;position: absolute;">
                    <div ref="yaoqinghan" style="position:relative;width:828px;z-index:-10000">
                        <img src="@/assets/yaoqinghan2x.png">
                        <div class="riqiwenzi">
                            {{ GMTToStrYYYYMMDDOfdian(ruleForm.startTime) }}  至  {{ GMTToStrYYYYMMDDOfdian(ruleForm.endTime) }}
                        </div>
                        <div class="didianwenzi">
                            {{ ruleForm.station != null && ruleForm.station.length > 24 ? ruleForm.station.substr(0, 24) : ruleForm.station }}
                        </div>
                        <div :class="ruleForm.name !== null && ruleForm.name.length < 21 ? 'mingziweniz' : 'mingziwenizdayu20'">
                            {{ ruleForm.name != undefined && ruleForm.name != null ? (ruleForm.name.length > 20 ? ruleForm.name.substr(0,15) : ruleForm.name.substr(0,10)) : '' }}<br>

                            {{ ruleForm.name != null && ruleForm.name.length > 10 ?
                                (ruleForm.name.length > 20 ? ruleForm.name.substring(15,ruleForm.name.length) :
                                    ruleForm.name.substring(10,ruleForm.name.length)) : '' }}
                        </div>
                        <img ref="imgDiv" class="erweima">
                    </div>
                </div>
            </el-form>
        </el-dialog>
        <!-- <el-dialog
            title="邀请函"
            :visible.sync="yaoqinghanVisible"
            width="866px"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            style="opacity: 0;"
        >
            <div ref="yaoqinghan" style="position:relative;width:828px;">
                <img src="@/assets/yaoqinghan2x.png">
                <div class="riqiwenzi">
                    {{ GMTToStrYYYYMMDDOfdian(ruleForm.startTime) }}  至  {{ GMTToStrYYYYMMDDOfdian(ruleForm.endTime) }}
                </div>
                <div class="didianwenzi">
                    {{ ruleForm.station != null && ruleForm.station.length > 24 ? ruleForm.station.substr(0, 24) : ruleForm.station }}
                </div>
                <div :class="ruleForm.name !== null && ruleForm.name.length < 21 ? 'mingziweniz' : 'mingziwenizdayu20'">
                    {{ ruleForm.name != null && ruleForm.name.length > 20 ? ruleForm.name.substr(0,15) : ruleForm.name.substr(0,10) }}<br>
                    {{ ruleForm.name != null && ruleForm.name.length > 10 ?
                        (ruleForm.name.length > 20 ? ruleForm.name.substring(15,ruleForm.name.length) :
                            ruleForm.name.substring(10,ruleForm.name.length)) : '' }}
                </div>
                <img ref="imgDiv" class="erweima">
            </div>
        </el-dialog> -->
    </div>
</template>

<script>
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
import { getConferenceId } from '@/utils/conference-auth'
import { getView, downloadFile } from '@/api/conference'
import { GMTToStrYYYYMMDDOfdian } from '@/utils/index'
import html2canvas from 'html2canvas'
import { showTextLoading, showLoading, closeLoading } from '@/utils/loading'
// import axios from 'axios'
export default {
    name: 'ConferenceShare',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            yaoqinghanVisible: false,
            imagePath: getOssBaseUrl(),
            ruleForm: {
                signCodeDownloadUrl: null,
                signCodePath: null,
                signUrl: null,
                conferenceCode: null,
                startTime: null,
                endTime: null,
                name: null,
                station: null
            },
            // imgUrl: null,
            rules: {}
        }
    },
    created() {
        this.getView()
    },
    methods: {
        xiazaierweima() {
            const load1 = showTextLoading('正在下载...')
            downloadFile({ filePath: this.ruleForm.signCodePath }).then(res => {
                if (decodeURI(res.headers['filename']) == null || decodeURI(res.headers['filename']) === 'undefined') {
                    this.$message('文件不存在')
                } else {
                    const blob = new Blob([res.data], { type: 'application/octet-stream' })

                    const fileName = this.ruleForm.signCodePath.substring(this.ruleForm.signCodePath.lastIndexOf('/') + 1, this.ruleForm.signCodePath.length)
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
        },
        fenxianghuiyihuodong() {
            this.yaoqinghanVisible = true
            downloadFile({ filePath: this.ruleForm.signCodePath }).then(response => {
                // this.$refs.imgDiv.src = response.data
                this.$refs.imgDiv.src = URL.createObjectURL(new Blob([response.data], {
                    type: 'application/octet-stream'
                }))
                this.toImage()
                // alert(this.$refs.imgDiv)
            })
        },
        toImage() {
            var load = showLoading()
            downloadFile({ filePath: this.ruleForm.signCodePath }).then(response => {
                this.$refs.imgDiv.src = URL.createObjectURL(new Blob([response.data], {
                    type: 'application/octet-stream'
                }))
                html2canvas(this.$refs.yaoqinghan, { allowTaint: true, useCORS: true }).then(canvas => {
                    const dataURL = canvas.toDataURL('image/png')
                    // this.imgUrl = dataURL
                    const link = document.createElement('a')
                    link.href = dataURL// 下载链接
                    link.setAttribute('download', this.ruleForm.name + '邀请函.png')
                    link.style.display = 'none'// a标签隐藏
                    document.body.appendChild(link)
                    link.click()
                    this.yaoqinghanVisible = false
                    closeLoading(load)
                })
            }).catch(() => {
                closeLoading(load)
            })
        },
        GMTToStrYYYYMMDDOfdian(val) {
            return GMTToStrYYYYMMDDOfdian(val)
        },
        getView() {
            getView({ 'id': getConferenceId() }).then(res => {
                this.ruleForm = {
                    signCodeDownloadUrl: res.result.signCodeDownloadUrl,
                    signCodePath: res.result.signCodePath,
                    signUrl: res.result.signUrl,
                    conferenceCode: res.result.conferenceCode,
                    startTime: res.result.startTime,
                    endTime: res.result.endTime,
                    name: res.result.name,
                    // name: '复制失败复制失败复制失败复制失败复制失败失败复制失败复制失败',
                    station: res.result.station
                }
            })
        },
        closeDialog() {
            this.$emit('closeDialog', null)
        },
        onCopy: function(e) {
            this.$message('复制成功')
        },
        onError: function(e) {
            this.$message('复制失败')
        }
    }
}
</script>
<style lang="scss" scoped>
.erweimaClass {
    height: 32px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #1E89FF;
     color:#1E89FF
}

.erweimaDisabledClass {
    height: 32px;
     background: rgba(25, 31, 36, 0.08)!important;
    border-radius: 4px;
    color: rgba(25, 31, 36, 0.32) !important;
    border: none;
}

.riqiwenzi {
    height: 42px;
    font-size: 32px;
    font-family: AlibabaPuHuiTi-Regular, AlibabaPuHuiTi;
    font-weight: 800;
    color: #FFECC4;
    line-height: 42px;
    position: absolute;
    top: 444px;
    text-align:center;
   width: 100%;
}
.didianwenzi {
    position: absolute;
    top: 494px;
    text-align:center;
    width: 100%;
    height: 42px;
    font-size: 32px;
    font-family: AlibabaPuHuiTi-Regular, AlibabaPuHuiTi;
    font-weight: 800;
    color: #FFECC4;
    line-height: 42px;
}
.mingziweniz {
    position: absolute;
    top: 710px;
    text-align:center;
    width: 100%;
    height: 70px;
    font-size: 60px;
    font-family: AlibabaPuHuiTi-Bold, AlibabaPuHuiTi;
    font-weight: bold;
    color: #FFECC4;
    line-height: 70px;
    letter-spacing: 2px;
}

.mingziwenizdayu20 {
    position: absolute;
    top: 710px;
    text-align:center;
    width: 100%;
    height: 56px;
    font-size: 48px;
    font-family: AlibabaPuHuiTi-Bold, AlibabaPuHuiTi;
    font-weight: bold;
    color: #FFECC4;
    line-height: 48px;
    letter-spacing: 2px;
}

.erweima {
    position: absolute;
    top: 930px;
    left: 287px;
    width: 256px;
    height:256px;
}
</style>
