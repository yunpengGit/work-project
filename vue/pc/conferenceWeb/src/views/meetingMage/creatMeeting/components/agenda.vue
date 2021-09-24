<template>
    <el-tabs v-model="activeNameAgenda" :stretch="false" style="background-color:white;padding-left:18px;padding-right:18px" @tab-click="handleClick">
        <el-tab-pane name="agendaFirst">
            <span slot="label" style="margin-top:15px;font-size:16px;">议程信息</span>
            <el-row>
                <el-col :span="12" style="background-color:#FFFFFF;padding-left:20px">
                    <!-- <el-input
                        v-model="filterText"
                        placeholder="输入议程名称搜索"
                        style="margin-top:10px;width:70%"
                    />

                    <el-button style="margin-top:10px;margin-left:3px;float:right" @click="resetSearch">重置</el-button>
                    <el-button style="margin-top:10px;margin-left:12px;float:right" type="primary" @click="search">查询</el-button>
                    <div style="height:10px" /> -->
                    <div>
                        <!-- <span style="padding-top:25px;color:#191F24">全部议程</span> -->
                        <el-button type="text" style="margin-left:5px;font-size:16px;color:#191F24" @click="quanbuyicheng">全部议程</el-button>
                        <el-button v-permission="Global.buttons.ConferenceView.agendaUpdate" type="text" style="margin-left:5px;font-size:16px;background-color:#E7F8FF;padding:1px 1px 1px 1px;" icon="el-icon-plus" @click="openDialog" />
                        <!-- <el-button v-permission="Global.buttons.ConferenceView.agendaExport" style="color:#191F24;float:right;margin-right:15px" @click="quanbuyicheng">导出</el-button> -->
                    </div>
                    <div v-show="data !== null && data.length > 0" :style="{'height':paneHeight,'overflow-x':'hidden','overflow-y':'auto', 'padding-bottom': '10px'}">
                        <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                            <el-tree
                                ref="tree"
                                :data="data"
                                :props="defaultProps"
                                default-expand-all
                                :filter-node-method="filterNode"
                                :expand-on-click-node="false"
                                :render-content="renderContent"
                            />
                        </el-scrollbar>
                    </div>
                    <div v-show="!(data !== null && data.length > 0)" style="text-align:center">
                        <div style="margin-top:60px;"><img src="@/assets/table-no-data.png"></div>
                        <div style="margin-left:-12px;margin-top:20px;font-size: 14px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.48);line-height: 18px;">暂无数据</div>
                        <div v-permission="Global.buttons.ConferenceView.agendaUpdate" style="margin-left:-12px;margin-top:10px;"> <el-button @click="openDialog">创建议程</el-button></div>
                    </div>
                </el-col>
                <el-col v-show="viewForm !== null && viewForm.conductDate !== null && viewForm.conductDate !== '' && viewForm.conductDate !== undefined" :span="12" :style="{'background-color':'#FAFAFA', 'height': viewHeight, 'padding-left': '25px','padding-top':'10px'}">
                    <h3 style="margin-left:30px;color: #191F24">议程信息</h3>
                    <el-form :style="{'height': viewHeight, 'padding-bottom':'50px'}" label-position="right" label-width="125px" size="mini">
                        <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                            <el-form-item label="议程标题：">
                                <span style="color: #191F24">{{ formatTableCellData(viewForm.name) }}</span>
                            </el-form-item>
                            <el-form-item label="上级议程：">
                                <span style="color: #191F24">{{ formatTableCellData(viewForm.parentName) }}</span>
                            </el-form-item>
                            <el-form-item label="议程日期：">
                                <span style="color: #191F24">{{ formatTableCellData(viewForm.conductDate) }}</span>
                            </el-form-item>
                            <el-form-item label="议程时间：">
                                <span style="color: #191F24">
                                    {{ viewForm !== null && viewForm.startTime !== undefined && viewForm.startTime !== null && viewForm.startTime.length === 8 ? viewForm.startTime.substr(0, 5) : viewForm.startTime }}
                                    <span v-if="viewForm !== null && viewForm.startTime !== undefined && viewForm.startTime !== null">-</span>
                                    {{ viewForm !== null && viewForm.endTime !== undefined && viewForm.endTime !== null && viewForm.endTime.length === 8 ? viewForm.endTime.substr(0, 5) : viewForm.endTime }}
                                </span>
                            </el-form-item>
                            <el-form-item label="议程地点：">
                                <span style="color: #191F24"> {{ formatTableCellData(viewForm.address) }}</span>
                            </el-form-item>
                            <el-form-item label="推荐程度：">
                                <span style="color: #191F24">{{ formatTableCellData(viewForm.recommend) }}</span>
                            </el-form-item>
                            <el-form-item label="议程分组：">
                                <span style="color: #191F24">{{ formatTableCellData(formatGroup(viewForm.groupId)) }}</span>
                            </el-form-item>
                            <el-form-item label="可见范围：">
                                <span style="color: #191F24">
                                    <span v-if="viewForm.attendeeShowFlag === 1">全体</span>
                                    <span v-if="viewForm.attendeeShowFlag === 0">仅会务组可见</span>
                                    <span v-if="viewForm.attendeeShowFlag === 2">指定{{ getConferenceTemplate(2) }}</span>
                                </span>
                            </el-form-item>
                            <el-form-item label="是否必选：">
                                <span style="color: #191F24">
                                    <span v-if="viewForm.freeFlag === 0">必选</span>
                                    <span v-if="viewForm.freeFlag === 1">不必选</span>
                                </span>
                            </el-form-item>

                            <!-- <el-form-item label="序号：">
                                <span style="color: #191F24">{{ viewForm.seq }}</span>
                            </el-form-item> -->
                            <el-form-item label="联系人：">
                                <span style="color: #191F24"> {{ formatTableCellData(viewForm.linkMan) }}</span>
                            </el-form-item>
                            <el-form-item label="手机：">
                                <span style="color: #191F24">{{ formatTableCellData(viewForm.phone) }}</span>
                            </el-form-item>
                            <el-form-item label="二维码：">
                                <span style="color: #191F24">
                                    <el-link v-if="viewForm.codePath !== null && viewForm.codePath !== '' && viewForm.codePath !== undefined" v-permission="Global.buttons.ConferenceView.agendaDownload" type="primary" @click="xiazaierweima(viewForm.oldPath)">下载</el-link>
                                    <span v-else>-</span>
                                </span>
                            </el-form-item>
                        </el-scrollbar>
                    </el-form>
                </el-col>
                <el-col v-show="!(viewForm !== null && viewForm.conductDate !== null && viewForm.conductDate !== '' && viewForm.conductDate !== undefined)" :span="12" :style="{'background-color':'#FAFAFA', 'height': viewHeight, 'padding-left': '10px','padding-top':'10px'}">
                    <h3 style="color: #191F24">全部议程</h3>
                    <el-table
                        :data="tableData"
                        style="width: 100%"
                        row-key="id"
                        border
                        default-expand-all
                        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                        :height="tableHeight"
                    >
                        <!-- width="240" -->
                        <el-table-column
                            :label="getConferenceTemplate(1) + '活动时间'"
                        >
                            <template slot-scope="scope">
                                <!-- <span v-if="scope.row.conductDate === undefined || scope.row.conductDate === null || scope.row.conductDate === ''">{{ scope.row.date }}</span> -->
                                <span>
                                    {{ scope.row.conductDate }}  {{ scope.row.startTime !== null && scope.row.startTime.length > 0 ? scope.row.startTime.substr(0, 5) : scope.row.startTime }}~{{ scope.row.endTime !== null && scope.row.endTime.length > 0 ? scope.row.endTime.substr(0, 5) : scope.row.endTime }}
                                </span>
                            </template>
                        </el-table-column>
                        <!-- width="90" -->
                        <el-table-column
                            prop="name"
                            label="议程标题"
                        />
                        <el-table-column
                            label="操作"
                        >
                            <template slot-scope="scope">
                                <!-- {{ scope.row.attendeeCount }} -->
                                <el-link v-if="scope.row.codePath !== null && scope.row.codePath !== ''" v-permission="Global.buttons.ConferenceView.agendaDownload" type="primary" @click="xiazaierweima(scope.row.oldPath)">下载签到码</el-link>
                                <span v-else>-</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <el-drawer
                :title="dialogTitle"
                :visible.sync="dialogVisible"
                :before-close="closeDialog"
                size="40%"
            >
                <el-form
                    ref="ruleForm"
                    :model="ruleForm"
                    :rules="rules"
                    label-width="120px"
                    class="demo-ruleForm"
                    :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto'}"
                >
                    <el-scrollbar ref="myScrollbar" wrap-class="scrollbar-wrapper" style="height:100%">
                        <el-form-item label="议程标题" prop="name">
                            <el-input v-model="ruleForm.name" class="width360 keepOutRight" show-word-limit maxlength="60" placeholder="请输入议程标题" />
                        </el-form-item>
                        <el-form-item v-if="ruleForm.parentName !== null && ruleForm.parentName !== ''" label="上级议程" prop="parentName">
                            <el-input v-model="ruleForm.parentName" placeholder="请选择上级" class="width360 keepOutRight" show-word-limit maxlength="60" disabled />
                        </el-form-item>
                        <el-form-item label="议程日期" prop="conductDate">
                            <el-date-picker
                                v-model="ruleForm.conductDate"
                                :disabled="isSub"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                type="date"
                                placeholder="选择日期时间"
                                class="width360"
                                :picker-options="pickerOptions"
                                :editable="false"
                            />
                        </el-form-item>
                        <el-form-item label="议程时间" prop="startTime">
                            <el-time-select
                                v-model="ruleForm.startTime"
                                placeholder="起始时间"
                                style="width:162px"
                                :picker-options="{
                                    start: '00:00',
                                    step: '00:05',
                                    end: '24:00',
                                    minTime: parentStartTime,
                                    maxTime: ruleForm.endTime > parentEndTime ? parentEndTime : ruleForm.endTime
                                }"
                            />
                            <el-time-select
                                v-model="ruleForm.endTime"
                                style="width:162px"
                                placeholder="结束时间"
                                :picker-options="{
                                    start: '00:00',
                                    step: '00:05',
                                    end: '24:00',
                                    minTime: ruleForm.startTime > parentStartTime ? ruleForm.startTime : parentStartTime,
                                    maxTime: parentEndTime
                                }"
                            />
                        </el-form-item>

                        <el-form-item label="议程地点" prop="address">
                            <el-input v-model="ruleForm.address" class="width360 keepOutRight" show-word-limit maxlength="60" placeholder="请输入议程地点" />
                        </el-form-item>
                        <el-form-item label="推荐程度" prop="recommend">
                            <el-input v-model="ruleForm.recommend" class="width360" show-word-limit maxlength="4" placeholder="请输入推荐程度，如“强烈推荐”等。" />
                            <div><span class="_48OpacityClass">定义{{ getConferenceTemplate(2) }}选择议程时的参考信息</span></div>
                        </el-form-item>
                        <el-form-item label="议程分组" prop="groupId">
                            <el-select v-model="ruleForm.groupId" placeholder="请选择议程分组" class="width360" clearable>
                                <el-option
                                    v-for="item in groupsFormat"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                />
                            </el-select>
                            <div><span class="_48OpacityClass">同一分组内的{{ getConferenceTemplate(2) }}不允许重复</span></div>
                        </el-form-item>
                        <el-form-item label="可见范围" prop="attendeeShowFlag">
                            <el-radio-group v-model="ruleForm.attendeeShowFlag">
                                <div style="margin-bottom:10px;margin-top:10px">
                                    <el-radio :disabled="parentShowFlag === 0 || parentShowFlag == 2" :label="1">全体</el-radio>
                                </div>
                                <div style="margin-bottom:10px;">
                                    <el-radio :disabled="parentShowFlag === 0" :label="2">指定{{ getConferenceTemplate(2) }}<span class="_48OpacityClass">(参加该议程的人)</span></el-radio>
                                </div>
                                <div style="margin-bottom:10px;">
                                    <el-radio :label="0">仅会务组可见</el-radio>
                                </div>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="是否必选" prop="freeFlag">
                            <el-radio-group v-model="ruleForm.freeFlag">
                                <div style="margin-bottom:10px;margin-top:10px">
                                    <el-radio :label="0">必选<span class="_48OpacityClass">（{{ getConferenceTemplate(2) }}必须参加，报名时不可选）</span></el-radio>
                                </div>
                                <div style="margin-bottom:10px;">
                                    <el-radio :label="1">不必选<span class="_48OpacityClass">（报名时{{ getConferenceTemplate(2) }}可选择参加）</span></el-radio>
                                </div>
                            </el-radio-group>
                        </el-form-item>
                        <!-- <el-form-item label="序号" prop="seq">
                            <el-input v-model="ruleForm.seq" show-word-limit maxlength="5" placeholder="用于议程排序，填写数字，如1，2..." class="width360" />
                        </el-form-item> -->
                        <el-form-item label="联系人" prop="linkMan">
                            <el-input  v-model="ruleForm.linkMan" show-word-limit maxlength="30" placeholder="请输入联系人" class="width360 keepOutRight" />
                        </el-form-item>
                        <el-form-item label="手机" prop="phone">
                            <el-input v-model="ruleForm.phone" show-word-limit maxlength="11" placeholder="请输入手机" class="width360" />
                        </el-form-item>
                        <el-form-item label="描述" prop="content">
                            <el-input v-model="ruleForm.content" show-word-limit maxlength="300" placeholder="请输入描述" class="width360" type="textarea" :rows="4" />
                        </el-form-item>
                    </el-scrollbar>
                </el-form>

                <div class="demo-drawer__footer" style="text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD">
                    <el-button @click="closeDialog">取 消</el-button>
                    <el-button type="primary" :loading="loading" @click="insertAgenda">保存</el-button>
                </div>
            </el-drawer>

        </el-tab-pane>
        <el-tab-pane name="agendaSecond">
            <span slot="label" style="margin-top:15px;font-size:16px">分组设置</span>
            <el-form
                ref="ruleGroupForm"
                :model="ruleGroupForm"
                label-width="120px"
                class="demo-dynamic"
                :style="{'height': yichengfenzuHeight,'overflow-x':'hidden','overflow-y':'auto'}"
            >
                <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                    <div class="_48OpacityClass marginleftClass" style="margin-top:5px;width:360px;white-space:normal;word-break:break-all;word-wrap:break-word;">
                        说明：定义议程的分组，分组内的{{ getConferenceTemplate(2) }}不允许重复。
                    </div>
                    <el-form-item
                        v-for="(group, index) in ruleGroupForm.groups"
                        :key="group.id"
                        label="议程分组"
                        :prop="'groups.' + index + '.name'"
                        :rules="[
                            { required: true, message: '请输入议程分组', trigger: 'blur' }
                        ]"
                    >
                        <div>
                            <el-input
                            class="keepOutRight"
                                v-model="group.name"
                                show-word-limit
                                maxlength="30"
                                placeholder="议程分组"
                                style="width:50%"
                                :disabled="group.agendaCount > 0"
                            />
                            <el-button
                                :disabled="group.agendaCount > 0"
                                icon="el-icon-delete"
                                style="margin-left:5px;margin-top:5px"
                                @click.prevent="removeGroup(group)"
                            />
                        </div>

                    </el-form-item>
                    <el-form-item>
                        <el-button class="tianjiahuiyizuzhiClass" size="small" type="primary" style="margin-top:5px;color:#1E89FF" @click="tianjiaGroup"><i class="el-icon-plus" />  添加议程分组</el-button>
                    </el-form-item>
                </el-scrollbar>
            </el-form>
            <div style="padding-bottom:5px;padding-top:5px;text-align:center;position:sticky;background-color:white;z-index:9999">
                <el-button v-permission="Global.buttons.ConferenceView.agendaGroupUpdate" type="primary" :loading="loading" @click="submitAgendaGroup">暂存</el-button>
            </div>
        </el-tab-pane>
    </el-tabs>

</template>
<script>
import { getTableHeight, GMTToStrYYYYMMDD } from '@/utils/index'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
import { getList, getView, insert, deleteById, update, updateByConferenceId, findByConferenceId, updateSeq, getListNoDate } from '@/api/agenda'
import { telephoneValid } from '@/utils/valid-common'

import { downloadFile } from '@/api/conference'
import { showTextLoading, closeLoading } from '@/utils/loading'
export default {
    name: 'Agenda',
    props: {
        conferenceId: {
            type: null,
            default: null
        },
        conferenceStartTime: {
            type: String,
            default: null
        },
        conferenceEndTime: {
            type: String,
            default: null
        }
    },
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === null || value === '') {
                callback()
            }
            if (isNaN(value)) {
                callback(new Error('请输入数字'))
            } else if (!(value > 0)) {
                callback(new Error('必须大于0'))
            } else if (!(/^(([1-9]{1}\d*)|(0{1}))?$/.test(value))) {
                callback(new Error('请输入整数'))
            } else if (value.length > 10) {
                callback(new Error('请输入10位有效数字'))
            } else {
                if (this.ruleForm.checkPass !== '') {
                    this.$refs.ruleForm.validateField('checkPass')
                }
                callback()
            }
        }
        return {
            defaultPalce: null,
            parentStartTime: null,
            parentEndTime: null,
            shijianfanweiStart: null,
            shijianfanweiEnd: null,
            parentShowFlag: null,
            isSub: false,
            pickerOptions: {
                disabledDate: (time) => {
                    // if (this.conferenceStartTime !== null && this.conferenceStartTime !== '') {
                    //     return time.getTime() > (new Date(this.conferenceEndTime).getTime()) ||
                    //     time.getTime() < (new Date(this.conferenceStartTime).getTime() - 24 * 60 * 60 * 1000 + 1)
                    // }
                    return time.getTime() < (new Date().getTime() - 24 * 60 * 60 * 1000 + 1)
                }
            },
            ruleGroupForm: {
                groups: [{ 'name': null, 'id': null }]
            },
            imagePath: getOssBaseUrl(),
            dialogHeight: getTableHeight(20) + 'px',
            activeNameAgenda: 'agendaFirst',
            dialogTitle: '新建议程',
            conductTimes: [],
            viewForm: {
                conductTimes: null,
                priority: 1,
                attendeeShowFlag: 1,
                freeFlag: 1,
                conductDate: null,
                displayFormatCode: null,
                recommend: null,
                name: null,
                address: null,
                groupId: null,
                seq: null,
                linkMan: null,
                phone: null,
                content: null,
                startTime: '',
                endTime: null,
                oldPath: null
            },
            ruleForm: {
                id: null,
                conductTimes: null,
                priority: 1,
                attendeeShowFlag: 1,
                freeFlag: 1,
                conductDate: null,
                displayFormatCode: null,
                recommend: null,
                name: null,
                address: null,
                groupId: null,
                seq: null,
                linkMan: null,
                phone: null,
                content: null,
                oldPath: null,
                startTime: this.configDefaultTime[0].substr(0, 5),
                endTime: this.configDefaultTime[1].substr(0, 5)
            },
            rules: {
                // priority: [{ required: true, message: '请选择议程重要性', trigger: 'change' }],
                // attendeeShowFlag: [{ required: true, message: '请选择可见范围', trigger: 'change' }],
                // freeFlag: [{ required: true, message: '请选择是否必选', trigger: 'change' }],
                // displayFormatCode: [{ required: true, message: '请选择日期显示格式', trigger: 'change' }],
                conductDate: [{ required: true, message: '请输入议程日期', trigger: 'blur' }],
                startTime: [{ required: true, message: '请输入议程时间',
                    validator: (rules, value, cb) => {
                        const { endTime } = this.ruleForm
                        if (!value || !endTime) {
                            return cb(new Error('请输入议程时间'))
                        }

                        return cb()
                    }, trigger: 'blur' }],
                endTime: [{ required: true, message: '请输入议程结束时间', trigger: 'blur' }],
                name: [{ required: true, message: '请输入议程标题', pattern: '[^ \x22]+', trigger: 'blur' }],
                // recommend: [{ required: true, message: '请输入推荐程度', pattern: '[^ \x22]+', trigger: 'blur' }],
                address: [{ required: true, message: '请输入议程地点', pattern: '[^ \x22]+', trigger: 'blur' }],
                seq: [{ validator: validatePass, trigger: 'blur' }],
                // linkMan: [{ required: true, message: '请输入联系人', pattern: '[^ \x22]+', trigger: 'blur' }],
                phone: [telephoneValid]
            },
            loading: false,
            dialogVisible: false,
            options: [{
                value: 'yyyy-MM-dd',
                label: 'yyyy-MM-dd'
            }, {
                value: 'yyyy/MM/dd',
                label: 'yyyy/MM/dd'
            }],
            tableHeight: getTableHeight(140) + 'px',
            paneHeight: getTableHeight(110) + 'px',
            paneNoDataHeight: getTableHeight(140) + 'px',
            viewHeight: getTableHeight(100) + 'px',
            yichengfenzuHeight: getTableHeight(120) + 'px',
            filterText: '',
            data: [],
            tableData: [],
            groupsFormat: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            }
        }
    },
    watch: {
        dialogVisible(val) {
            if (val) {
                this.findGroupsByConferenceId()
            }
        },
        activeNameAgenda(val) {
            this.findGroupsByConferenceId()
        },
        conferenceId() {
            this.getList()
        },
        conductTimes() {
            this.ruleForm.conductTimes = this.conductTimes
        }
        // filterText(val) {
        //     this.$refs.tree.filter(val)
        // }
    },
    created() {
        if (this.$route.name === 'conferenceCreate') {
            this.tableHeight = getTableHeight(140) + 'px'
            this.paneHeight = getTableHeight(110) + 'px'
            this.viewHeight = getTableHeight(80) + 'px'
            this.yichengfenzuHeight = getTableHeight(90) + 'px'
        } else {
            this.tableHeight = getTableHeight(160) + 'px'
            this.paneHeight = getTableHeight(130) + 'px'
            this.viewHeight = getTableHeight(100) + 'px'
            this.yichengfenzuHeight = getTableHeight(120) + 'px'
        }

        this.getList()
        this.findGroupsByConferenceId()
        this.getListNoDate()
    },
    methods: {
        xiazaierweima(path) {
            const load1 = showTextLoading('正在下载...')
            downloadFile({ filePath: path }).then(res => {
                if (decodeURI(res.headers['filename']) == null || decodeURI(res.headers['filename']) === 'undefined') {
                    this.$message('文件不存在')
                } else {
                    const blob = new Blob([res.data], { type: 'application/octet-stream' })

                    const fileName = path.substring(path.lastIndexOf('/') + 1, path.length)
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
        getListNoDate() {
            getListNoDate({ 'conferenceId': this.conferenceId }).then(res => {
                this.tableData = res.result
            })
        },
        updateSeq(id, moveFlag) {
            updateSeq({ 'id': id, 'moveFlag': moveFlag }).then(res => {
                if (res.success) {
                    this.getList()
                    this.getListNoDate()
                }
            })
        },
        quanbuyicheng() {
            this.viewForm = {
                conductTimes: null,
                priority: 1,
                attendeeShowFlag: 1,
                freeFlag: 1,
                conductDate: null,
                displayFormatCode: null,
                recommend: null,
                name: null,
                address: null,
                groupId: null,
                seq: null,
                linkMan: null,
                phone: null,
                content: null,
                startTime: '',
                endTime: null,
                oldPath: null
            }
            this.getListNoDate()
        },
        findGroupsByConferenceId() {
            this.groupsFormat = []
            findByConferenceId({ 'conferenceId': this.conferenceId }).then(res => {
                this.ruleGroupForm.groups = res.result.list
                this.groupsFormat = res.result.list
            })
        },
        tianjiaGroup() {
            this.ruleGroupForm.groups.push({ 'id': null, 'name': null })
        },
        removeGroup(item) {
            var index = this.ruleGroupForm.groups.indexOf(item)
            if (index !== -1) {
                this.ruleGroupForm.groups.splice(index, 1)
            }
        },
        getView(val) {
            getView({ 'id': val.id }).then(res => {
                this.viewForm.conductDate = res.result.conductDate
                this.viewForm.name = res.result.name
                this.viewForm.address = res.result.address
                this.viewForm.priority = res.result.priority
                this.viewForm.groupId = res.result.groupId
                this.viewForm.attendeeShowFlag = res.result.attendeeShowFlag
                this.viewForm.freeFlag = res.result.freeFlag
                this.viewForm.seq = res.result.seq
                this.viewForm.linkMan = res.result.linkMan
                this.viewForm.phone = res.result.phone
                this.viewForm.content = res.result.content
                this.viewForm.recommend = res.result.recommend
                this.viewForm.conductDate = GMTToStrYYYYMMDD(this.viewForm.conductDate)
                this.viewForm.parentName = res.result.parentName
                this.viewForm.codePath = res.result.codePath
                this.viewForm.startTime = res.result.startTime
                this.viewForm.endTime = res.result.endTime
                this.viewForm.oldPath = res.result.oldPath
            })
        },
        resetSearch() {
            this.filterText = null
            this.$refs.tree.filter(this.filterText)
        },
        search() {
            this.$refs.tree.filter(this.filterText)
        },
        deleteAgenda(node, data) {
            // 删除议程将自动删除参会人与议程的关系，是否确定删除?
            this.$confirm('请确认是否删除议程信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteById({ 'ids': [data.id] }).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        this.getList()
                        this.getListNoDate()
                    }
                })
            }).catch(() => {})
        },
        getList() {
            getList({ 'conferenceId': this.conferenceId }).then(res => {
                this.data = res.result
                this.$emit('checkFull', this.conferenceId)
            })
        },
        insertAgenda() {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    if (this.ruleForm.id !== null && this.ruleForm.id !== '' && this.ruleForm.id !== undefined) {
                        // this.ruleForm.startTime = this.ruleForm.conductTimes[0]
                        // this.ruleForm.endTime = this.ruleForm.conductTimes[1]
                        this.loading = true
                        this.ruleForm.conferenceId = this.conferenceId
                        update(this.ruleForm).then(res => {
                            if (res.success) {
                                this.$message('保存成功')
                                this.closeDialog()
                                this.getList()
                                this.getListNoDate()
                            }
                            this.loading = false
                        }).catch(() => {
                            this.loading = false
                        })
                    } else {
                        this.loading = true
                        // this.ruleForm.startTime = this.ruleForm.conductTimes[0]
                        // this.ruleForm.endTime = this.ruleForm.conductTimes[1]
                        this.ruleForm.conferenceId = this.conferenceId
                        insert(this.ruleForm).then(res => {
                            if (res.success) {
                                this.$message('保存成功')
                                this.closeDialog()
                                this.getList()
                                this.getListNoDate()
                            }
                            this.loading = false
                        }).catch(() => {
                            this.loading = false
                        })
                    }
                }
            })
        },
        openDialogByDate(val) {
            this.shijianfanweiStart = null
            this.shijianfanweiEnd = null
            this.parentShowFlag = null
            this.ruleForm.parentName = null
            this.ruleForm.parentId = null
            this.ruleForm.conductDate = val
            this.ruleForm.startTime = this.configDefaultTime[0].substr(0, 5)
            this.ruleForm.endTime = this.configDefaultTime[1].substr(0, 5)
            // this.ruleForm.conductTimes = null
            this.dialogTitle = '新建议程'
            this.dialogVisible = true
            this.isSub = false
        },
        openDialog(val) {
            if (val !== null && val.id !== undefined) {
                getView({ 'id': val.id }).then(res => {
                    this.shijianfanweiStart = val.startTime
                    this.shijianfanweiEnd = val.endTime
                    this.ruleForm.parentId = val.id
                    this.ruleForm.parentName = val.name
                    this.parentShowFlag = val.attendeeShowFlag
                    this.ruleForm.attendeeShowFlag = val.attendeeShowFlag
                    this.ruleForm.conductDate = res.result.conductDate
                    this.ruleForm.conductTimes = null
                    this.ruleForm.startTime = res.result.startTime
                    this.ruleForm.endTime = res.result.endTime

                    this.ruleForm.address = res.result.address

                    var startTemp = res.result.startTime.replace(':', '')
                    if (startTemp !== '0000') {
                        var newStartTime = '0000'
                        if (startTemp.slice(2) === '00') {
                            newStartTime = (startTemp - 41) + ''
                        } else {
                            newStartTime = (startTemp - 1) + ''
                        }

                        if (newStartTime >= 1000) {
                            this.parentStartTime = newStartTime.slice(0, 2) + ':' + newStartTime.slice(2)
                        } else if (newStartTime < 1000 && newStartTime >= 100) {
                            this.parentStartTime = '0' + newStartTime.slice(0, 1) + ':' + newStartTime.slice(1)
                        } else if (newStartTime < 100 && newStartTime >= 10) {
                            this.parentStartTime = '00:' + newStartTime
                        } else if (newStartTime < 10) {
                            this.parentStartTime = '00:0' + newStartTime
                        }
                    }

                    var endTemp = res.result.endTime.replace(':', '')
                    if (endTemp !== '2359') {
                        var newEndTime = (parseInt(endTemp) + 1) + ''
                        if (newEndTime >= 1000) {
                            this.parentEndTime = newEndTime.slice(0, 2) + ':' + newEndTime.slice(2)
                        } else if (newEndTime < 1000 && newEndTime >= 100) {
                            this.parentEndTime = '0' + newEndTime.slice(0, 1) + ':' + newEndTime.slice(1)
                        } else if (newEndTime < 100 && newEndTime >= 10) {
                            this.parentEndTime = '00:' + newEndTime
                        } else if (newEndTime < 10) {
                            this.parentEndTime = '00:0' + newEndTime
                        }
                    }

                    this.dialogTitle = '新建议程'
                    this.dialogVisible = true
                    this.isSub = true
                })
            } else {
                this.shijianfanweiStart = null
                this.shijianfanweiEnd = null
                this.parentShowFlag = null
                this.ruleForm.parentName = null
                this.ruleForm.parentId = null
                this.ruleForm.conductDate = null
                this.ruleForm.startTime = this.configDefaultTime[0].substr(0, 5)
                this.ruleForm.endTime = this.configDefaultTime[1].substr(0, 5)
                // this.ruleForm.conductTimes = null
                this.dialogTitle = '新建议程'
                this.dialogVisible = true
                this.isSub = false
            }
            setTimeout(() => {
                this.$refs['myScrollbar'].wrap.scrollTop = 0
            }, 10)
        },
        openDialogUpdate(val) {
            if (val !== null) {
                getView({ 'id': val.id }).then(res => {
                    this.dialogTitle = '编辑议程'
                    this.ruleForm.id = res.result.id
                    this.ruleForm.conductDate = res.result.conductDate
                    this.ruleForm.displayFormatCode = res.result.displayFormatCode
                    this.ruleForm.name = res.result.name
                    this.ruleForm.address = res.result.address
                    this.ruleForm.priority = res.result.priority
                    this.ruleForm.groupId = res.result.groupId
                    this.ruleForm.attendeeShowFlag = res.result.attendeeShowFlag
                    this.ruleForm.freeFlag = res.result.freeFlag
                    this.ruleForm.seq = res.result.seq
                    this.ruleForm.linkMan = res.result.linkMan
                    this.ruleForm.phone = res.result.phone
                    this.ruleForm.content = res.result.content
                    this.ruleForm.parentId = res.result.parentId
                    this.ruleForm.recommend = res.result.recommend
                    this.ruleForm.parentName = res.result.parentName
                    this.parentShowFlag = res.result.parentShowFlag
                    this.viewForm.codePath = res.result.codePath
                    this.viewForm.oldPath = res.result.oldPath
                    // this.ruleForm.conductTimes = [res.result.startTime, res.result.endTime]
                    // alert(res.result.startTime)
                    this.ruleForm.startTime = res.result.startTime
                    this.ruleForm.endTime = res.result.endTime
                    this.dialogVisible = true
                })
            } else {
                this.shijianfanweiStart = null
                this.shijianfanweiEnd = null
                this.ruleForm = {
                    conductTimes: null,
                    priority: 1,
                    attendeeShowFlag: 1,
                    freeFlag: 1,
                    conductDate: null,
                    displayFormatCode: null,
                    recommend: null,
                    name: null,
                    address: null,
                    groupId: null,
                    seq: null,
                    linkMan: null,
                    phone: null,
                    content: null,
                    startTime: '',
                    endTime: null,
                    oldPath: null
                }
                this.dialogVisible = true
            }
            setTimeout(() => {
                this.$refs['myScrollbar'].wrap.scrollTop = 0
            }, 10)
        },
        closeDialog() {
            this.ruleForm = {
                id: null,
                conductTimes: null,
                priority: 1,
                attendeeShowFlag: 1,
                freeFlag: 1,
                conductDate: null,
                displayFormatCode: null,
                name: null,
                address: null,
                recommend: null,
                groupId: '',
                seq: null,
                linkMan: null,
                phone: null,
                content: null,
                startTime: '',
                endTime: null,
                oldPath: null
            }
            this.defaultPalce = null
            this.parentStartTime = null
            this.parentEndTime = null

            this.shijianfanweiStart = null
            this.shijianfanweiEnd = null
            this.$refs['ruleForm'].clearValidate()
            this.dialogVisible = false
        },
        filterNode(value, data) {
            if (!value) return true
            if (data.name !== undefined) {
                return data.name.indexOf(value) !== -1
            } else {
                return false
            }
        },
        renderContent(h, { node, data, store }) {
            if (data.parentId === undefined) {
                return (
                    <span class='custom-tree-node' style='width:100%;padding-right:10px;' on-mouseout={(event) => { event.currentTarget.children[1].style.display = 'none' }} on-mouseover={(event) => { event.currentTarget.children[1].style.display = '' }}>
                        <span style='font-size:14px;line-height:32px;color:#191F24;' title={ data.date }>{data.date}</span>
                        <span style='display: none'>
                            <el-button v-permission={this.Global.buttons.ConferenceView.agendaGroupUpdate} type='text' style='margin-left:12px;float:right;font-size:14px' icon='el-icon-plus' on-click={ () => this.openDialogByDate(data.date) }></el-button>
                        </span>
                    </span>)
            } else {
                var str = ''
                if (node.label.length > 6) {
                    str = node.label.substring(0, 6) + '...'
                } else {
                    str = node.label
                }
                var dateStr = (data.startTime !== null && data.startTime.length === 8 ? data.startTime.substr(0, 5) : data.startTime) +
                '~' + (data.endTime !== null && data.endTime.length === 8 ? data.endTime.substr(0, 5) : data.endTime)

                console.log(str)
                if (!node.isLeaf) {
                    return (
                        <span class='custom-tree-node' style='width:100%;padding-right:10px;padding-top:3px;height:40px' on-mouseout={(event) => { event.currentTarget.children[1].style.display = 'none' }} on-mouseover={(event) => { event.currentTarget.children[1].style.display = '' }} >
                            <span style='font-size:14px;line-height:32px;color:#191F24;' title={ node.label } on-click={ () => this.getView(data) }>{dateStr}
                                <span style='margin-left:20px;'>{ str }</span>
                                <span v-show={ data.recommend !== null && data.recommend !== '' } style='padding-left:2px;padding-right:2px;margin-left:10px;background: #FF8200;color:white;height: 20px;border-radius: 3px;font-size: 11px;line-height:13px;padding:3px;font-family: PingFangSC-Medium, PingFang SC;'>{ data.recommend }</span>
                            </span>
                            <span style='display: none'>
                                <el-button v-permission={this.Global.buttons.ConferenceView.agendaGroupUpdate} type='text' style='margin-left:12px;float:right;font-size:14px' icon='el-icon-bottom' on-click={ () => this.updateSeq(data.id, 2) }></el-button>
                                <el-button v-permission={this.Global.buttons.ConferenceView.agendaGroupUpdate} type='text' style='margin-left:12px;float:right;font-size:14px' icon='el-icon-top' on-click={ () => this.updateSeq(data.id, 1) }></el-button>

                                <el-button v-permission={this.Global.buttons.ConferenceView.agendaGroupUpdate} type='text' style='margin-left:12px;float:right;font-size:14px' icon='el-icon-edit-outline' on-click={ () => this.openDialogUpdate(data) }></el-button>
                                <el-button v-permission={this.Global.buttons.ConferenceView.agendaGroupUpdate} type='text' style='margin-left:12px;float:right;font-size:14px' icon='el-icon-plus' on-click={ () => this.openDialog(data) }></el-button>
                            </span>
                        </span>)
                } else {
                    if (data.parentId === null || data.parentId === '' || data.parentId === undefined) {
                        return (
                            <span class='custom-tree-node' style='width:100%;padding-right:10px;padding-top:3px;height:40px' on-mouseout={(event) => { event.currentTarget.children[1].style.display = 'none' }} on-mouseover={(event) => { event.currentTarget.children[1].style.display = '' }}>
                                <span style='font-size:14px;line-height:32px;color:#191F24;' title={ node.label } on-click={ () => this.getView(data) }>{dateStr}
                                    <span style='margin-left:20px;'>{str}</span>
                                    <span v-show={ data.recommend !== null && data.recommend !== '' } style='padding-left:2px;padding-right:2px;margin-left:10px;background: #FF8200;color:white;height: 20px;border-radius: 3px;font-size: 11px;line-height:13px;padding:3px;font-family: PingFangSC-Medium, PingFang SC;'>{ data.recommend }</span></span>
                                <span style='display: none'>
                                    <el-button type='text' v-permission={this.Global.buttons.ConferenceView.agendaGroupUpdate} style='margin-left:12px;float:right;font-size:14px' icon='el-icon-bottom' on-click={ () => this.updateSeq(data.id, 2) }></el-button>
                                    <el-button type='text' v-permission={this.Global.buttons.ConferenceView.agendaGroupUpdate} style='margin-left:12px;float:right;font-size:14px' icon='el-icon-top' on-click={ () => this.updateSeq(data.id, 1) }></el-button>

                                    <el-button type='text' v-permission={this.Global.buttons.ConferenceView.agendaGroupUpdate} style='margin-left:12px;float:right;font-size:14px'icon='el-icon-delete' on-click={ () => this.deleteAgenda(node, data) }></el-button>
                                    <el-button type='text' v-permission={this.Global.buttons.ConferenceView.agendaGroupUpdate} style='margin-left:12px;float:right;font-size:14px' icon='el-icon-edit-outline' on-click={ () => this.openDialogUpdate(data) }></el-button>
                                    <el-button type='text' v-permission={this.Global.buttons.ConferenceView.agendaGroupUpdate} style='margin-left:12px;float:right;font-size:14px' icon='el-icon-plus' on-click={ () => this.openDialog(data) }></el-button>
                                </span>
                            </span>)
                    } else {
                        return (
                            <span class='custom-tree-node' style='width:100%;padding-right:10px;padding-top:3px;height:40px' on-mouseout={(event) => { event.currentTarget.children[1].style.display = 'none' }} on-mouseover={(event) => { event.currentTarget.children[1].style.display = '' }}>
                                <span style='font-size:14px;line-height:32px;color:#191F24 0.64;' title={ node.label } on-click={ () => this.getView(data) }>{dateStr}
                                    <span style='margin-left:20px;'>{str}</span>
                                    <span v-show={ data.recommend !== null && data.recommend !== '' } style='padding-left:2px;padding-right:2px;margin-left:10px;background: #FF8200;color:white;height: 20px;border-radius: 3px;font-size: 11px;line-height:13px;padding:3px;font-family: PingFangSC-Medium, PingFang SC;'>{ data.recommend }</span></span>
                                <span style='display: none'>
                                    <el-button type='text' v-permission={this.Global.buttons.ConferenceView.agendaGroupUpdate} style='margin-left:12px;float:right;font-size:14px' icon='el-icon-bottom' on-click={ () => this.updateSeq(data.id, 2) }></el-button>
                                    <el-button type='text' v-permission={this.Global.buttons.ConferenceView.agendaGroupUpdate} style='margin-left:12px;float:right;font-size:14px' icon='el-icon-top' on-click={ () => this.updateSeq(data.id, 1) }></el-button>

                                    <el-button type='text' v-permission={this.Global.buttons.ConferenceView.agendaGroupUpdate} style='margin-left:12px;float:right;font-size:14px'icon='el-icon-delete' on-click={ () => this.deleteAgenda(node, data) }></el-button>
                                    <el-button type='text' v-permission={this.Global.buttons.ConferenceView.agendaGroupUpdate} style='margin-left:12px;float:right;font-size:14px' icon='el-icon-edit-outline' on-click={ () => this.openDialogUpdate(data) }></el-button>
                                </span>
                            </span>)
                    }

                //
                }
            }
        },
        handleClick(tab, event) {
            console.log(tab, event)
        },
        formatGroup(val) {
            let name = ''
            if (this.groupsFormat !== null) {
                this.groupsFormat.forEach(item => {
                    if (item.id === val) {
                        name = item.name
                    }
                })
            }
            return name
        },
        submitAgendaGroup() {
            // if(this.groups !== null && this.groups.length > 0){
            //     this.groups.forEach(item => {

            //     })
            // }

            this.$refs['ruleGroupForm'].validate(valid => {
                if (valid) {
                    const agendaGroup = {
                        'conferenceId': this.conferenceId,
                        'conferenceAgendaGroupPOList': this.ruleGroupForm.groups
                    }
                    updateByConferenceId(agendaGroup).then(res => {
                        if (res.success) {
                            this.$message('保存成功')
                            this.findGroupsByConferenceId()
                        }
                    })
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.yichengxianshibuxia {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
 .el-scrollbar__wrap{overflow-x: hidden!important;}
    .width360{
        width:330px;
    }
    ._48OpacityClass {
        width: 343px;
        height: 32px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(25, 31, 36, 0.48);
        line-height: 16px;
    }
    .tianjiahuiyizuzhiClass {
        width: 114px!important;
        height: 32px!important;
        background: #FFFFFF!important;
        border-radius: 4px!important;
        border: 1px solid #1E89FF!important;
    }
    .marginleftClass {
        margin-left: 50px;
    }
    ._48OpacityClass {
        width: 343px;
        height: 32px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(25, 31, 36, 0.48);
        line-height: 16px;
    }
</style>
