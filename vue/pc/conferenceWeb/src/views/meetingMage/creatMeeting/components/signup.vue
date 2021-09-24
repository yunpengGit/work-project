<template>
    <div style="background-color:white">
        <el-tabs v-model="activeNameSignup" class="activeNameSignup" style="background-color:white;padding-left:18px" @tab-click="handleClick">
            <el-tab-pane name="signupFirst">
                <span slot="label" style="margin-top:15px;font-size:16px">报名设置</span>

                <el-form ref="ruleForm" class="conferenceFormClass" :style="{'height': formHeight,'overflow-x':'hidden','overflow-y':'auto', 'margin-top': '15px'}" label-position="right" label-width="10%" :model="ruleForm" :rules="rules">
                    <el-scrollbar style="height:100%">
                        <el-form-item label="报名时间" prop="signupTimes">
                            <el-select v-model="ruleForm.signTimeFlag" class="marginleftClass" :validate-event="false" :disabled="conferenceDisabled" style="width: 180px;float:left" @change="signTimeFlagChange">
                                <el-option :key="3" label="起始于" :value="3" />
                                <el-option :key="1" label="截止至" :value="1" />
                                <el-option :key="2" label="起止时间" :value="2" />
                            </el-select>
                            <el-date-picker
                                v-show="ruleForm.signTimeFlag === 3"
                                v-model="ruleForm.signStartTime"
                                placeholder="选择时间"
                                :validate-event="false"
                                :disabled="conferenceDisabled"
                                style="width:180px;margin-left:2px;float:left"
                                format="yyyy-MM-dd HH:mm"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :default-time="configDefaultTime[0]"
                                type="datetime"
                                :picker-options="pickerOptions"
                                :editable="false"
                            />
                            <el-date-picker
                                v-show="ruleForm.signTimeFlag === 1"
                                v-model="ruleForm.signStartTime"
                                placeholder="选择时间"
                                :disabled="conferenceDisabled"
                                style="width:180px;margin-left:2px;float:left"
                                format="yyyy-MM-dd HH:mm"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :default-time="configDefaultTime[1]"
                                :picker-options="pickerOptions"
                                type="datetime"
                                :editable="false"
                            />
                            <!-- <div v-show="ruleForm.signTimeFlag !== 2" style="margin-left:5%;width: 313px;height: 18px;font-size: 14px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.48);line-height: 18px;">
                                <span class="_48OpacityClass" style="">注：参会人只能在此期间报名</span>
                            </div> -->

                            <!-- :picker-options="pickerOptions" -->
                            <el-date-picker
                                v-show="ruleForm.signTimeFlag === 2"
                                v-model="ruleForm.signupTimes"
                                :default-time="configDefaultTime"
                                class="marginleftClass"
                                :disabled="conferenceDisabled"
                                style="width:330px;margin-left:2px;float:left"
                                format="yyyy-MM-dd HH:mm"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions"
                                :editable="false"
                            />
                        </el-form-item>
                        <!-- <el-form-item style="margin-top:-15px;margin-left:5%">
                            <div style="margin-left:180px;width: 313px;height: 18px;font-size: 14px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.48);line-height: 18px;">
                                <span class="_48OpacityClass" style="">注：参会人只能在此期间报名</span>
                            </div>
                        </el-form-item> -->
                        <el-form-item v-show="false" label="集团内报名人范围" prop="visibaleFlag">
                            <div>
                                <el-radio-group v-model="ruleForm.visibaleFlag" class="marginleftClass" style="float: left;margin-top:10px">
                                    <el-radio :disabled="conferenceDisabled" :label="2">仅本单位</el-radio>
                                    <el-radio :disabled="conferenceDisabled" :label="1">本单位及下属单位</el-radio>
                                    <el-radio :disabled="conferenceDisabled" :label="3">全集团</el-radio>
                                </el-radio-group>
                            </div>
                        </el-form-item>
                        <el-form-item v-if="conferenceTemplate === null || conferenceTemplate.examineFlag === 1" label="报名审核">
                            <el-radio-group v-model="ruleForm.examineFlag" class="marginleftClass">
                                <el-radio :disabled="conferenceDisabled" :label="1">需要</el-radio>
                                <!-- <span class="_48OpacityClass">（需要审核参会资格）</span> -->
                                <el-radio :disabled="conferenceDisabled" :label="0">不需要</el-radio>
                                <!-- <span class="_48OpacityClass">（不需要审核参会资格，{{ getConferenceTemplate(2) }}报名可直接参会））</span> -->
                            </el-radio-group>
                            <div class="marginleftClass">
                                <span class="_48OpacityClass">设置本场{{ getConferenceTemplate(1) }}的报名信息是否需要审核</span>
                            </div>
                        </el-form-item>
                        <el-form-item v-if="conferenceTemplate === null || conferenceTemplate.signConfigOaFlowFlag === 1 && ruleForm.examineFlag === 1" label="" prop="oaFlowCodess">
                            <el-select v-model="ruleForm.oaFlowCodes" class="marginleftClass width360" :disabled="conferenceDisabled" multiple :placeholder="conferenceDisabled ? 'OA审批（可选）' : 'OA审批（可选）'">
                                <el-option
                                    v-for="item in templateList"
                                    :key="item.templateId"
                                    :label="item.templateName"
                                    :value="item.templateId"
                                />
                            </el-select>
                            <div class="marginleftClass">
                                <span class="_48OpacityClass">如报名信息需通过OA审批，请选择相应流程（审批流程需在OA工作流中配置）</span>
                            </div>
                        </el-form-item>
                        <!-- <el-form-item label="是否设置外部参会人表单">
                            <el-radio-group v-model="ruleForm.examineFlag">
                                <el-radio :disabled="conferenceDisabled" :label="1">是</el-radio>
                                <el-radio :disabled="conferenceDisabled" :label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item> -->
                        <el-form-item label="表单设置">
                            <div style="margin-bottom:10px;">
                                <el-checkbox class="marginleftClass" :value="true" disabled>基本信息</el-checkbox>
                            </div>
                            <div style="margin-bottom:10px;">
                                <el-checkbox :disabled="conferenceDisabled" :value="ruleForm.setRouteFlag === 1" class="marginleftClass" @change="changeSetRouteFlag">行程信息<span class="_48OpacityClass">（需要{{ getConferenceTemplate(2) }}报名时填写行程信息，可在表单设置中配置）</span></el-checkbox>
                            </div>
                            <div style="margin-bottom:10px;">
                                <el-checkbox :disabled="conferenceDisabled || setAgendaFlag === 0" :value="ruleForm.agendaFreeFlag === 1" class="marginleftClass" @change="changeAgendaFreeFlag">议程信息<span class="_48OpacityClass">（允许{{ getConferenceTemplate(2) }}报名时自选议程）</span></el-checkbox>
                            </div>
                        </el-form-item>
                        <el-form-item label="报名范围">
                            <el-checkbox class="marginleftClass" :value="true" disabled>商网用户<span class="_48OpacityClass">（通过商网办公App报名）</span></el-checkbox>
                            <el-checkbox :disabled="conferenceDisabled" :value="ruleForm.externalVisibaleFlag === 1" class="marginleftClass" @change="changeExternalVisibaleFlag">非商网用户<span class="_48OpacityClass">（通过手机浏览器报名）</span></el-checkbox>
                        </el-form-item>
                        <!-- <el-form-item label="是否需要参会人填写行程">
                            <el-radio-group v-model="ruleForm.setRouteFlag" class="marginleftClass">
                                <div style="margin-bottom:10px;margin-top:10px">
                                    <el-radio :disabled="conferenceDisabled" :label="1">需要<span class="_48OpacityClass">（需要设置报名表单中的行程信息，支持报名人报名时定制行程</span></el-radio>
                                </div>
                                <div style="margin-bottom:10px;">
                                    <el-radio :disabled="conferenceDisabled" :label="0">不需要<span class="_48OpacityClass">（不需要设置报名表单中的行程信息，行程信息在报名人报名时隐藏）</span></el-radio>
                                </div>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item v-show="setAgendaFlag === 1" label="是否需要参会人自选议程">
                            <el-radio-group v-model="ruleForm.agendaFreeFlag" class="marginleftClass">
                                <el-radio :disabled="conferenceDisabled" :label="1">需要<span class="_48OpacityClass">（允许参会人自己选择会议议程）</span></el-radio>
                                <el-radio :disabled="conferenceDisabled" :label="0">不需要</el-radio>
                            </el-radio-group>
                        </el-form-item> -->
                        <el-form-item label="报名人数" prop="checkAllowNumFlag">
                            <el-radio-group v-model="ruleForm.checkAllowNumFlag" class="marginleftClass">
                                <el-radio :disabled="conferenceDisabled" :label="1">限制</el-radio>
                                <el-radio :disabled="conferenceDisabled" :label="0">不限制</el-radio>
                            </el-radio-group>
                            <!-- <el-select v-model="ruleForm.checkAllowNumFlag" class="marginleftClass width360" :disabled="conferenceDisabled">
                                <el-option :key="1" label="限制" :value="1" />
                                <el-option :key="0" label="不限制" :value="0" />
                            </el-select> -->
                        </el-form-item>
                        <el-form-item v-if="!(ruleForm.checkAllowNumFlag === 0)" label="报名人数" prop="allowNum">
                            <el-input v-model="ruleForm.allowNum" class="marginleftClass width360" :disabled="conferenceDisabled" />
                        </el-form-item>
                        <el-form-item label="报名须知">
                            <el-input
                                v-model="ruleForm.notice"
                                class="marginleftClass width360"
                                :disabled="conferenceDisabled"
                                type="textarea"
                                :rows="6"
                                :placeholder="conferenceDisabled ? '无' : ('请输入报名须知')"
                                maxlength="300"
                                show-word-limit
                            />
                        </el-form-item>
                    </el-scrollbar>
                </el-form>
            </el-tab-pane>
            <el-tab-pane name="signupSecond" style="">
                <span slot="label" style="margin-top:15px;font-size:16px">商网用户表单</span>
                <signupForm ref="innerForm" :sign-up-form-disabled="conferenceDisabled" :inner-flag="1" :conference-id="conferenceId" :xingcheng-flag="ruleForm.setRouteFlag" :table-list="ruleForm.signFormConfigInnerVOs" />
            </el-tab-pane>
            <el-tab-pane name="signupThird" style="" :disabled="ruleForm.externalVisibaleFlag !== 1">
                <span slot="label" style="margin-top:15px;font-size:16px">非商网用户表单</span>
                <signupForm ref="externalForm" :sign-up-form-disabled="conferenceDisabled" :inner-flag="0" :conference-id="conferenceId" :xingcheng-flag="ruleForm.setRouteFlag" :table-list="ruleForm.signFormConfigExternalVOs" @synForm="synForm" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import { getTableHeight, GMTToStrYYYYMMDDHHmmss } from '@/utils/index'
import { getSignConfig, setSignConfig } from '@/api/signup'
import { getTemplateList } from '@/api/oaFlow'
import SignupForm from './signup-form'
export default {
    name: 'Signup',
    components: {
        SignupForm
    },
    props: {
        conferenceId: {
            type: null,
            default: null
        },
        conferenceDisabled: {
            type: Boolean,
            default: false
        },
        activeName: {
            type: String,
            default: null
        },
        conferenceStartTime: {
            type: String,
            default: null
        },
        conferenceEndTime: {
            type: String,
            default: null
        },
        setAgendaFlag: {
            type: null,
            default: null
        },
        conferenceTemplate: {
            type: Object,
            default: null
        }
    },
    data() {
        var validatePass = (rule, value, callback) => {
            if (isNaN(value)) {
                callback(new Error('请输入数字'))
            } else if (!(value > 0)) {
                callback(new Error('必须大于0'))
            } else if (!(/^(([0-9]{1}\d*)|(0{1}))?$/.test(value))) {
                callback(new Error('请输入整数'))
            } else if (value.length > 4) {
                callback(new Error('请输入4位有效数字'))
            } else {
                if (this.ruleForm.checkPass !== '') {
                    this.$refs.ruleForm.validateField('checkPass')
                }
                callback()
            }
        }
        return {
            templateList: [],
            pickerOptions: {
                disabledDate: (time) => {
                    if (this.conferenceStartTime !== null && this.conferenceStartTime !== '') {
                        return time.getTime() > (new Date(this.conferenceEndTime).getTime()) ||
                        time.getTime() < (new Date().getTime() - 24 * 60 * 60 * 1000)
                    }
                    return time.getTime() < (new Date().getTime() - 24 * 60 * 60 * 1000)
                }
            },
            checkBoxValue: false,
            formHeight: getTableHeight(140) + 'px',
            rules: {
                signStartTime: [{ required: true, message: '请输入报名时间', trigger: 'blur' }],
                signupTimes: [{ required: true, message: '请输入报名时间', trigger: 'blur' }],
                allowNum: [{ required: true, message: '请输入限制报名人数', trigger: 'blur' },
                    { validator: validatePass, trigger: 'blur' }]
            },
            ruleForm: {
                notice: null,
                startTime: null,
                endTime: null,
                signStartTime: null,
                signTimeFlag: 2,
                oaFlowCodes: [],
                allowNum: 0,
                checkAllowNumFlag: 0,
                signupTimes: [],
                visibaleFlag: 3,
                externalVisibaleFlag: null,
                examineFlag: null,
                oaFlows: null,
                setRouteFlag: null,
                agendaFreeFlag: null,
                signFormConfigInnerVOs: null,
                signFormConfigExternalVOs: null
            },
            activeNameSignup: 'signupFirst'
        }
    },
    computed: {
        signStartTime() {
            return this.ruleForm.signStartTime
        }

    },
    watch: {
        signStartTime(val) {
            if (val !== null && val !== '') {
                this.ruleForm.signupTimes = [val, val]
            } else {
                this.ruleForm.signupTimes = []
            }
        },
        checkBoxValue(val) {
            if (val) {
                this.ruleForm.externalVisibaleFlag = 1
            } else {
                this.ruleForm.externalVisibaleFlag = 0
            }
        },
        activeName() {
            this.getSignConfig()
        }
    },
    created() {
        if (this.$route.name === 'conferenceCreate') {
            this.formHeight = getTableHeight(100) + 'px'
        } else {
            this.formHeight = getTableHeight(140) + 'px'
        }
        if (this.conferenceId !== null) {
            this.getSignConfig()
        }
        this.getTemplateList()
    },
    methods: {
        synForm() {
            var tempData = JSON.parse(JSON.stringify(this.ruleForm.signFormConfigInnerVOs))
            var externalData = this.ruleForm.signFormConfigExternalVOs.filter(item => item.initFlag === 1)
            var customData = []
            var haveDateFieldLabel = '';
            tempData.forEach((item, index) => {
                var externalDataIndex = externalData.findIndex(item1 => item1.fieldCode === item.fieldCode)
                if (item.initFlag === 1) {
                  if (externalDataIndex !== -1) {
                    var externalDataTemp = externalData[externalDataIndex]
                    if(externalDataTemp.haveData){
                      haveDateFieldLabel = haveDateFieldLabel + externalDataTemp.fieldLabel + ","
                    } else {
                      externalDataTemp.fieldLabel = item.fieldLabel
                      var signFormFieldRuleVOTemp = item.signFormFieldRuleVO
                      if (signFormFieldRuleVOTemp !== null) {
                        signFormFieldRuleVOTemp.id = externalDataTemp.signFormFieldRuleVO !== undefined && externalDataTemp.signFormFieldRuleVO !== null && externalDataTemp.signFormFieldRuleVO.id !== undefined &&
                        externalDataTemp.signFormFieldRuleVO.id !== null && externalDataTemp.signFormFieldRuleVO.id !== '' ? externalDataTemp.signFormFieldRuleVO.id : null
                      }
                      externalDataTemp.signFormFieldRuleVO = item.signFormFieldRuleVO
                      var signFormFieldRulePOTemp = item.signFormFieldRulePO
                      if (signFormFieldRulePOTemp !== null) {
                        signFormFieldRulePOTemp.id = externalDataTemp.signFormFieldRulePO !== undefined && externalDataTemp.signFormFieldRulePO !== null && externalDataTemp.signFormFieldRulePO.id !== undefined &&
                        externalDataTemp.signFormFieldRulePO.id !== null && externalDataTemp.signFormFieldRulePO.id !== '' ? externalDataTemp.signFormFieldRulePO.id : null
                      }
                      externalDataTemp.signFormFieldRulePO = item.signFormFieldRulePO
                      externalDataTemp.signFormOptionVOs = item.signFormOptionVOs
                      externalDataTemp.showFlag = item.showFlag
                      externalDataTemp.requireFlag = item.requireFlag
                      externalData.splice(externalDataIndex, 1, externalDataTemp)
                    }
                  }
                } else {
                  if (externalDataIndex !== -1) {
                    var externalDataTemp = externalData[externalDataIndex]
                    if(externalDataTemp.haveData){
                      haveDateFieldLabel = haveDateFieldLabel + externalDataTemp.fieldLabel + ","
                    } else {
                      var tempData = item
                      tempData.id = null
                      tempData.innerFlag = 0
                      customData.push(tempData)
                    }
                  } else {
                    var tempData = item
                    tempData.id = null
                    tempData.innerFlag = 0
                    customData.push(tempData)
                  }
                }
            })
            if (customData !== null && customData.length > 0) {
                externalData = externalData.concat(customData)
            }
            this.ruleForm.signFormConfigExternalVOs = externalData
            if(haveDateFieldLabel != ''){
              haveDateFieldLabel = haveDateFieldLabel.substr(0, haveDateFieldLabel.length - 1);
              this.$alert(haveDateFieldLabel + ' 已存在报名信息，无法自动同步', '提醒', {
                confirmButtonText: '我知道了',
                callback: action => {
                }
              })
            }
        },
        signTimeFlagChange() {
            this.ruleForm.signStartTime = null
            this.ruleForm.signupTimes = []
        },
        changeSetRouteFlag() {
            this.ruleForm.setRouteFlag = (this.ruleForm.setRouteFlag === 1 ? 0 : 1)
        },
        changeAgendaFreeFlag() {
            this.ruleForm.agendaFreeFlag = (this.ruleForm.agendaFreeFlag === 1 ? 0 : 1)
        },
        getTemplateList() {
            getTemplateList().then(res => {
                this.templateList = res.result
            })
        },
        changeExternalVisibaleFlag() {
            // alert(this.ruleForm.externalVisibaleFlag === 1 ? 0 : 1)
            this.ruleForm.externalVisibaleFlag = (this.ruleForm.externalVisibaleFlag === 1 ? 0 : 1)
        },
        getSignConfig() {
            getSignConfig({ 'conferenceId': this.conferenceId }).then(res => {
                // this.ruleForm = res.result
                this.ruleForm.id = res.result.id
                this.ruleForm.signTimeFlag = res.result.signTimeFlag !== undefined && res.result.signTimeFlag !== null ? res.result.signTimeFlag : 2
                this.ruleForm.checkAllowNumFlag = res.result.checkAllowNumFlag
                this.ruleForm.visibaleFlag = res.result.visibaleFlag !== null ? res.result.visibaleFlag : 3
                this.ruleForm.externalVisibaleFlag = res.result.externalVisibaleFlag
                this.checkBoxValue = this.ruleForm.externalVisibaleFlag === 1
                this.ruleForm.examineFlag = res.result.examineFlag
                this.ruleForm.oaFlowCodes = res.result.oaFlowCodes
                this.ruleForm.allowNum = res.result.allowNum
                this.ruleForm.setRouteFlag = res.result.setRouteFlag
                this.ruleForm.notice = res.result.notice
                this.ruleForm.agendaFreeFlag = res.result.agendaFreeFlag
                this.ruleForm.signFormConfigInnerVOs = res.result.signFormConfigInnerVOs
                this.ruleForm.signFormConfigExternalVOs = res.result.signFormConfigExternalVOs
                if (this.ruleForm.examineFlag === null || this.ruleForm.examineFlag === '') {
                    this.ruleForm.examineFlag = 1
                }
                if (!(this.conferenceTemplate === null || this.conferenceTemplate.examineFlag === 1)) {
                    this.ruleForm.examineFlag = 0
                }
                if (this.ruleForm.signTimeFlag === 2) {
                    if (res.result.startTime !== null && res.result.endTime !== null) {
                        this.ruleForm.signupTimes = [res.result.startTime, res.result.endTime]
                    }
                } else if (this.ruleForm.signTimeFlag === 1) {
                    this.ruleForm.signStartTime = res.result.endTime
                } else if (this.ruleForm.signTimeFlag === 3) {
                    this.ruleForm.signStartTime = res.result.startTime
                }
            })
        },
        handleClick() {

        },
        submitSignup() {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    if (this.ruleForm.setRouteFlag === 1) {
                        var tableData4 = this.$refs.innerForm.getTableData4()
                        var tableData4Ex = this.$refs.externalForm.getTableData4()
                        var innerSelectFlag = 0
                        var externalFlag = 0
                        tableData4.forEach(item => {
                            if (item.showFlag === 1) {
                                innerSelectFlag = 1
                            }
                        })
                        tableData4Ex.forEach(item => {
                            if (item.showFlag === 1) {
                                externalFlag = 1
                            }
                        })
                        if (innerSelectFlag === 0 || (externalFlag === 0 && this.ruleForm.externalVisibaleFlag === 1)) {
                            this.$message('请勾选行程信息')
                            return false
                        }
                    }
                    if (this.ruleForm.checkAllowNumFlag === 0) {
                        this.ruleForm.allowNum = 0
                    }

                    if (this.ruleForm.signTimeFlag === 2) {
                        if (this.ruleForm.signupTimes !== null) {
                            this.ruleForm.startTime = this.ruleForm.signupTimes[0]
                            this.ruleForm.endTime = this.ruleForm.signupTimes[1]
                        } else {
                            this.ruleForm.startTime = null
                            this.ruleForm.endTime = null
                        }
                    } else if (this.ruleForm.signTimeFlag === 1) {
                        if (this.ruleForm.signStartTime !== null && this.ruleForm.signStartTime !== '') {
                            if (this.ruleForm.startTime === null || this.ruleForm.startTime === '') {
                                this.ruleForm.startTime = GMTToStrYYYYMMDDHHmmss(new Date())
                            }
                            this.ruleForm.endTime = this.ruleForm.signStartTime
                        } else {
                            this.ruleForm.startTime = null
                            this.ruleForm.endTime = null
                        }
                    } else if (this.ruleForm.signTimeFlag === 3) {
                        if (this.ruleForm.signStartTime !== null && this.ruleForm.signStartTime !== '') {
                            this.ruleForm.startTime = this.ruleForm.signStartTime
                            if (this.conferenceEndTime !== null) {
                                if (this.ruleForm.endTime !== this.conferenceEndTime) {
                                    this.ruleForm.endTime = this.conferenceEndTime
                                }
                            } else {
                                this.ruleForm.endTime = null
                            }
                        } else {
                            this.ruleForm.startTime = null
                            this.ruleForm.endTime = null
                        }
                    }

                    var oaFlowTemp = []
                    if (this.ruleForm.oaFlowCodes !== null && this.ruleForm.oaFlowCodes.length > 0 && this.templateList !== null && this.templateList.length > 0) {
                        this.templateList.forEach(item => {
                            if (this.ruleForm.oaFlowCodes.indexOf(item.templateId) !== -1) {
                                oaFlowTemp.push({ 'oaFlowCode': item.templateId, 'oaFlowName': item.templateName, 'conferenceId': this.conferenceId })
                            }
                        })
                    }
                    this.ruleForm.oaFlows = oaFlowTemp
                    this.ruleForm.conferenceId = this.conferenceId
                    this.ruleForm.signFormConfigInnerPOs = this.$refs.innerForm.getTableData()
                    this.ruleForm.signFormConfigExternalPOs = this.$refs.externalForm.getTableData()
                    this.$emit('setHideLoading', true)
                    setSignConfig(this.ruleForm).then(res => {
                        if (res.success) {
                            this.$message(res.message)

                            this.$emit('checkFull', res.result)

                            this.getSignConfig()
                        }
                        this.$emit('setHideLoading', false)
                    }).catch(() => {
                        this.$emit('setHideLoading', false)
                    })
                } else {
                    this.activeNameSignup = 'signupFirst'
                }
            })

            // var c = a.concat(b)
        }
    }
}
</script>
<style>
.activeNameSignup .is-disabled span {
    color: rgba(25, 31, 36, 0.38);
}
</style>
<style lang="scss" scoped>
.width360{
        width:360px;
}
.marginleftClass {
     margin-left: 5%;
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
