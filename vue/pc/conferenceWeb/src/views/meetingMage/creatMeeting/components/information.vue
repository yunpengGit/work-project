<template>
    <div style="background-color:white">
        <el-form
            ref="ruleForm"
            class="conferenceFormClass"
            label-position="right"
            label-width="26%"
            :model="ruleForm"
            :rules="rules"
            :style="{'height': formHeight,'overflow-x':'hidden','overflow-y':'auto'}"
        >
            <div style="opacity:0;position: absolute;margin-left:100px;">
                <div ref="yaoqinghan" style="position:relative;width:375px;height:171px;z-index:-10000">
                    <img ref="imgDiv" object-fit="fill" style="width:375px;height: 171px;" :src="ruleForm.coverVOs !== null && ruleForm.coverVOs.length > 0 ? (imagePath + ruleForm.coverVOs[0].downloadUrl) : ''">
                    <div class="riqiwenzi">
                        {{ ruleForm.name }}
                    </div>
                </div>
            </div>

            <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                <el-form-item
                    :label="getConferenceTemplate(1) + '名称'"
                    prop="name"
                >
                    <el-input
                        v-model="ruleForm.name"
                        class="keepOutRight"
                        :disabled="conferenceDisabled"
                        maxlength="30"
                        show-word-limit
                        :placeholder="'请输入' + getConferenceTemplate(1) + '名称'"
                    />
                </el-form-item>

                <el-form-item v-show="false" :label="getConferenceTemplate(1) + '模板'" prop="conferenceTemplateCode">
                    <el-select v-model="ruleForm.conferenceTemplateCode" :validate-event="false" :disabled="conferenceDisabled" :placeholder="'请选择' + getConferenceTemplate(1) + '模板'">
                        <el-option
                            v-for="item in conferenceTemplates"
                            :key="item.valCode"
                            :label="item.valName"
                            :value="item.valCode"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item :label="getConferenceTemplate(1) + '封面'" prop="fileList">
                    <div class="fl">
                        <el-upload
                            ref="files"
                            style=""
                            class="upload-demo upload-remove-delete-text marginleftClass"
                            :validate-event="false"
                            list-type="picture-card"
                            name="files"
                            :accept="accept"
                            :headers="uploadHeader"
                            :action="uploadUrl"
                            :on-success="onSuccess"
                            :on-error="onError"
                            :on-remove="handleRemove"
                            :file-list="fileList"
                            :show-file-list="showFileList"
                            :before-upload="beforeUpload"
                            :on-exceed="onExceed"
                            :disabled="conferenceDisabled"
                            :data="uploadData"
                        >
                            <div v-if="ruleForm.coverVOs !== null && ruleForm.coverVOs.length > 0" class="image-div" style="margin-left:-2px;margin-top:-3px;width: 150px;height: 75px;">
                                <!-- <el-image style="width: 150px;height: 75px;" :src="imagePath + ruleForm.coverVOs[0].coverUrl" /> -->
                                <el-image style="width: 150px;height: 75px;" :src="imagePath + ruleForm.coverVOs[0].downloadUrl" />
                                <div v-if="!conferenceDisabled" class="image-mask" style="cursor:pointer;">
                                    <i class="el-icon-upload2" style="color: white;height: 25px;margin-top: 25px" />
                                </div>
                            </div>
                            <i v-else class="el-icon-plus avatar-uploader-icon" />
                        </el-upload>
                        <div class="_48OpacityClass marginleftClass" style="margin-top:5px;width:360px;white-space:normal;word-break:break-all;word-wrap:break-word;">
                            <!-- 注意：图片应用于系统和当前会议的Banner，尺寸750x400，限制300KB以内，支持jpg、jpeg、gif、png、svg -->
                            <!-- 默认第一张图片作为{{ getConferenceTemplate(1) }}封面图，有多张图片时将作为{{ getConferenceTemplate(1) }}详情页的轮播图。建议尺寸：750*345   大小：400KB以上，1MB以下 -->

                            封面用做系统显示，建议尺寸：750x345，大小不能超过10M
                        </div>
                    </div>
                </el-form-item>
                <el-form-item :label="getConferenceTemplate(1) + '时间'" prop="huiyiriqis">
                    <el-date-picker
                        v-model="huiyiriqis"
                        :validate-event="false"
                        class="marginleftClass"
                        :disabled="conferenceDisabled"
                        :default-time="configDefaultTime"
                        style="width:360px"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="选择开始时间"
                        end-placeholder="选择结束时间"
                        :picker-options="pickerOptions"
                        :editable="false"
                    />
                </el-form-item>
                <el-form-item :label="getConferenceTemplate(1) + '地点'" prop="station">
                    <el-input class="keepOutRight" v-model="ruleForm.station" :validate-event="false" :disabled="conferenceDisabled" show-word-limit maxlength="50" :placeholder="'请输入'+ getConferenceTemplate(1) +'所在场所或建筑物名称，如：云湖度假村'" />
                </el-form-item>

                <el-form-item v-if="conferenceTemplate === null || conferenceTemplate.detailsAddressFlag === 1" label="详细地址" prop="address">
                    <el-select v-model="ruleForm.provinceValue" :validate-event="false" :disabled="conferenceDisabled" placeholder="请选择" style="width: 180px;float:left" @change="getCitys">
                        <el-option
                            v-for="item in provinces"
                            :key="item.value"
                            :label="item.text"
                            :value="item.value"
                        />
                    </el-select>
                    <el-select v-model="ruleForm.cityValue" :validate-event="false" :disabled="conferenceDisabled" placeholder="请选择" style="width: 180px;float:left;margin-left:2px" @change="cityChange">
                        <el-option
                            v-for="item in citys"
                            :key="item.value"
                            :label="item.text"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="conferenceTemplate === null || conferenceTemplate.detailsAddressFlag === 1" prop="address" style="margin-top:-15px">
                    <el-input class="keepOutRight" v-model="ruleForm.address" :validate-event="false" :validate-on-rule-change="false" show-word-limit maxlength="50" :disabled="conferenceDisabled" :placeholder="'请输入' + getConferenceTemplate(1) + '详细地址'" />
                </el-form-item>
                <el-form-item v-if="conferenceTemplate === null || conferenceTemplate.checkInFlag === 1" label="报到时间" prop="checkInTimes">
                    <el-select v-model="ruleForm.checkInTimeFlag" :validate-event="false" :disabled="conferenceDisabled" style="width: 180px;float:left" @change="checkInTimeFlagChange">
                        <el-option :key="3" label="起始于" :value="3" />
                        <el-option :key="1" label="截止至" :value="1" />
                        <el-option :key="2" label="起止时间" :value="2" />
                    </el-select>
                    <el-date-picker
                        v-show="ruleForm.checkInTimeFlag === 3"
                        v-model="checkInStartTime"
                        placeholder="选择时间"
                        :validate-event="false"
                        :disabled="conferenceDisabled"
                        style="width:180px;margin-left:2px;float:left"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="configDefaultTime[0]"
                        type="datetime"
                        :picker-options="baodaoPickerOptions"
                        :editable="false"
                    />
                    <el-date-picker
                        v-show="ruleForm.checkInTimeFlag === 1"
                        v-model="checkInStartTime"
                        placeholder="选择时间"
                        :validate-event="false"
                        :disabled="conferenceDisabled"
                        style="width:180px;margin-left:2px;float:left"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="configDefaultTime[1]"
                        type="datetime"
                        :picker-options="baodaoPickerOptions"
                        :editable="false"
                    />
                </el-form-item>
                <el-form-item v-show="ruleForm.checkInTimeFlag === 2" v-if="conferenceTemplate === null || conferenceTemplate.checkInFlag === 1" style="margin-top:-15px">
                    <el-date-picker
                        v-model="checkInTimes"
                        :validate-event="false"
                        class="marginleftClass"
                        :disabled="conferenceDisabled"
                        style="width:360px"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="configDefaultTime"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="选择开始时间"
                        end-placeholder="选择结束时间"
                        :picker-options="baodaoPickerOptions"
                        :editable="false"
                    />
                </el-form-item>
                <el-form-item v-if="conferenceTemplate === null || conferenceTemplate.checkInFlag === 1" label="报到地点" prop="checkInAddress">
                    <div class="marginleftClass" style="height:45px">
                        <el-input class="keepOutRight" v-model="ruleForm.checkInAddress" :validate-event="false" show-word-limit maxlength="30" :disabled="conferenceDisabled" style="width:360px;float:left;margin-top:3px;margin-left:2px" placeholder="请输入报到时的详细地址" />
                        <!-- <el-popover
                            placement="bottom"
                            width="100"
                            trigger="hover"
                        >
                            <div style="width:100%;text-align:center">
                                <img :src="imagePath + ruleForm.signInCodeUrl" style="width:100%">
                                <el-link :href="imagePath + ruleForm.signInCodeUrl" :underline="false">下载</el-link>
                            </div>
                            <el-button v-show="conferenceDisabled && ruleForm.checkInStartTime != null && ruleForm.checkInStartTime != ''" slot="reference" class="erweimaClass" size="small" type="primary" style="margin-left:10px;margin-top:3px;color:#1E89FF">报到码</el-button>
                        </el-popover> -->
                    </div>
                </el-form-item>
                <el-form-item :label="getConferenceTemplate(1) + '类型'" prop="type">
                    <el-select v-model="ruleForm.type" :validate-event="false" :disabled="conferenceDisabled" :placeholder="'请选择' + getConferenceTemplate(1) + '类型'">
                        <el-option
                            v-for="item in conferenceTypes"
                            :key="item.valCode"
                            :label="item.valName"
                            :value="item.valCode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="conferenceTemplate === null || conferenceTemplate.conferenceOrganizationFlag === 1" :label="getConferenceTemplate(1) + '组织'" prop="organizationPOs">
                    <div v-for="(organizationPO) in organizationPOs" :key="organizationPO.organizationCode" class="marginleftClass" style="height:45px">
                        <el-select v-model="organizationPO.organizationType" :disabled="conferenceDisabled" placeholder="请选择" style="width: 100px;float:left;margin-top:3px;margin-left:0px">
                            <el-option
                                v-for="item in conferenceOrganizationTypes"
                                :key="item.valCode"
                                :label="item.valName"
                                :value="item.valCode"
                            />
                        </el-select>
                        <el-input class="keepOutRight" v-model="organizationPO.organizationName" :placeholder="'请输入组织名称'" show-word-limit maxlength="30" :disabled="conferenceDisabled" style="width:200px;float:left;margin-top:3px;margin-left:2px" />
                        <!-- <el-upload
                            :disabled="conferenceDisabled"
                            class="upload-demo upload-remove-delete-text"
                            :accept="accept"
                            name="files"
                            :headers="uploadHeader"
                            :action="uploadUrl"
                            :data="logoUploadData"
                            :show-file-list="false"
                            style="float:left;margin-left:5px;width:38px;height:38px;border:solid 1px #DDDDDD;border-style:dashed;border-radius:4px"
                            :on-success="(response, file, fileList) => logoSuccess(response, file, fileList,i)"
                        >
                            <img
                                v-if="organizationPO.organizationLogo"
                                style="width:38px;height:38px"
                                :src="imagePath + organizationPO.organizationLogo"
                            >
                            <div v-else>
                                <i class="el-icon-plus" style="width:36px;height:40px;color:#CCCCCC" />
                            </div>

                        </el-upload> -->
                        <el-button :disabled="conferenceDisabled" icon="el-icon-delete" style="margin-left:5px;margin-top:3px" @click.prevent="removeZuzhi(organizationPO)" />
                    </div>
                    <el-button v-show="!(organizationPOs !== null && organizationPOs.length > 9)" class="marginleftClass tianjiahuiyizuzhiClass" :disabled="conferenceDisabled" size="small" type="primary" style="margin-top:5px;color:#1E89FF" @click="tianjiahuiyizuzhi"><i class="el-icon-plus" />  添加{{ getConferenceTemplate(1) }}组织</el-button>
                </el-form-item>
                <el-form-item label="服务电话" prop="servicePhone">
                    <el-input class="keepOutRight" v-model="ruleForm.servicePhone" :disabled="conferenceDisabled" maxlength="20" show-word-limit :placeholder="conferenceDisabled ? '无' : '请输入服务电话号码，如：010-898988888'" />
                </el-form-item>
                <el-form-item label="联系方式" prop="conferenceContactsVOS" label-width="26%" style="margin-bottom:0;">
                    <el-form :model="value" v-for="(value,key) in ruleForm.conferenceContactsVOS" :key="key" style="display:flex;flex-wrap:wrap;margin-left:5%;">
                    <el-form-item prop="contactsName">
                        <el-input
                        v-model="value.contactsName"
                        placeholder="请输入联系人姓名"
                        class="marginleftClass"
                        :disabled="conferenceDisabled"
                        type="text"
                        style="width:150px;margin:0;"
                        @input="InputFn"
                        show-word-limit
                    />
                    </el-form-item>
                    <el-form-item  prop="contactsPhone" :rules="[{min:11,max:11,message: '请输入11位电话',trigger: 'change'}]">
                        <el-input
                        v-model="value.contactsPhone"
                        @input="InputFn"
                        type="text"
                       :disabled="conferenceDisabled"
                        placeholder="请输入联系人电话"
                        style="width:150px; marginRight:0; marginLeft:10px;"
                    />
                    </el-form-item>
                    <el-form-item prop="unitOrDuty" style="margin-left:10px;">
                        <el-input
                        v-model="value.unitOrDuty"
                        @input="InputFn"
                        placeholder="请输入单位或职责"
                        :disabled="conferenceDisabled"
                        style="width:150px; marginLeft:0;marginRight:0;"
                    />
                    </el-form-item>
                    <el-button v-if="ruleForm.conferenceContactsVOS.length>1" icon="el-icon-delete" @click="cancelContactInformation(key)" style="margin-left:10px;padding:0 7px; height:32px;"></el-button>
                    <el-button v-if="key===ruleForm.conferenceContactsVOS.length-1" icon="el-icon-plus" @click="addContactInformation" style="margin-left:10px; padding:0 7px;height:32px;"></el-button>
                    </el-form>
                    <!-- <li  style="margin-bottom:10px">
                        <el-input
                        v-model="value.contactsName"
                        placeholder="请输入联系人姓名"
                        class="marginleftClass"
                        :disabled="conferenceDisabled"
                        type="text"
                        style="width:150px;"
                        show-word-limit
                        
                    />
                    <el-input
                        v-model="value.contactsPhone"
                        placeholder="请输入联系人电话"
                        :disabled="conferenceDisabled"
                        style="width:150px; marginLeft:0;"
                    />
                    <el-input
                        v-model="value.unitOrDuty"
                        placeholder="请输入单位或职责"
                        :disabled="conferenceDisabled"
                        style="width:160px; marginLeft:0;"
                    />
                    <el-button v-if="ruleForm.conferenceContactsVOS.length>1" icon="el-icon-delete" @click="cancelContactInformation(key)" style="padding:9px 7px;"></el-button>
                    <el-button v-if="key===ruleForm.conferenceContactsVOS.length-1" icon="el-icon-plus" @click="addContactInformation" style="margin-left:0; padding:9px 7px;"></el-button>
                    </li> -->
                    <!-- <el-input
                        v-model="ruleForm.contactInformation"
                        :placeholder="conferenceDisabled ? '无' : '请输入会务组或联络人的联系方式'"
                        class="marginleftClass"
                        :disabled="conferenceDisabled"
                        type="textarea"
                        :rows="6"
                        style="width:360px;float:left;"
                        maxlength="300"
                        show-word-limit
                    />
                    <font class="textarea48OpacityClass" style="float:left;margin-left:20px;line-height:18px">如：<br>
                        赵兰兰<br>
                        电话：18811223344<br>
                        联系方式：zhanglanlan@avic.com<br>
                        官网地址：https://www.avic.com<br>
                        孙某某 13666778899<br>
                        等等</font> -->
                </el-form-item>
                <el-form-item v-if="conferenceTemplate === null || conferenceTemplate.introductionFlag === 1" :label="getConferenceTemplate(1) + '介绍'" prop="introduction">
                    <el-input
                        v-model="ruleForm.introduction"
                        class="marginleftClass"
                        :disabled="conferenceDisabled"
                        type="textarea"
                        :rows="6"
                        :placeholder="conferenceDisabled ? '无' : ('请输入' + getConferenceTemplate(1) + '介绍')"
                        maxlength="2000"
                        show-word-limit
                        style="width:360px"
                    />
                </el-form-item>
                <el-form-item v-if="conferenceTemplate === null || conferenceTemplate.noticeFlag === 1" :label="getConferenceTemplate(1) + '须知'" prop="notice">
                    <el-input
                        v-model="ruleForm.notice"
                        class="marginleftClass"
                        :disabled="conferenceDisabled"
                        type="textarea"
                        :rows="6"
                        :placeholder="conferenceDisabled ? '无' : ('请输入' + getConferenceTemplate(1) + '须知')"
                        style="width:360px;float:left;"
                        maxlength="300"
                        show-word-limit
                    />
                    <font style="float:left;margin-left:20px;line-height:18px" class="textarea48OpacityClass">
                        如：<br>
                        参加{{ getConferenceTemplate(1) }}需注意以下内容：<br>
                        1.{{ getConferenceTemplate(2) }}请着正装参加{{ getConferenceTemplate(1) }}<br>
                        2.{{ getConferenceTemplate(2) }}请必须携带有效证件签到<br>
                        3.{{ getConferenceTemplate(1) }}期间请将手机调整静音<br>
                        4.禁止在会场大声喧哗<br>
                        5.{{ getConferenceTemplate(1) }}结束后请到会务组领取餐票<br>
                        ...
                    </font>
                </el-form-item>
                <el-form-item v-if="conferenceTemplate === null || conferenceTemplate.setAgendaFlag === 1" label="议程设置" prop="setAgendaFlag">
                    <el-radio-group v-model="ruleForm.setAgendaFlag" class="marginleftClass">
                        <el-radio :disabled="conferenceDisabled" :label="1">需要</el-radio>
                        <el-radio :disabled="conferenceDisabled" :label="0">不需要<span class="_48OpacityClass" style="margin-left:10px">（不设置【议程信息】也可以发布{{ getConferenceTemplate(1) }}）</span></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="报名设置" prop="setSignConfigFlag">
                    <el-radio-group v-model="ruleForm.setSignConfigFlag" class="marginleftClass">
                        <el-radio :disabled="conferenceDisabled" :label="1">需要</el-radio>
                        <el-radio :disabled="conferenceDisabled" :label="0">不需要<span class="_48OpacityClass" style="margin-left:10px">（不设置【报名信息】也可以发布{{ getConferenceTemplate(1) }}）</span></el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- <el-form-item
                    class="daimaClass"
                    label="会议口令"
                    prop="signPassword"
                >
                    <el-switch
                        v-model="huiyikouling"
                        class="marginleftClass"
                        :active-text="huiyikouling ? '已开启' : '已关闭'"
                        inactive-text=""
                        :disabled="conferenceDisabled"
                    />
                    <el-input v-show="huiyikouling" v-model="ruleForm.signPassword" maxlength="5" show-word-limit :disabled="!huiyikouling || conferenceDisabled" style="width:100px" placeholder="会议口令" />
                    <span v-show="!huiyikouling" style="margin-left:10px" class="_48OpacityClass">会议口令：一个5位数字串，申请会议联络人时，输入该数字才能成功注册</span>
                    <span v-show="huiyikouling" style="color:#ff4949;margin-left:10px">*</span>
                    <span v-show="huiyikouling" style="margin-left:10px" class="_48OpacityClass">需输入5位数字，申请会议联络人时，输入该数字才能成功注册</span>
                </el-form-item> -->
                <el-form-item v-if="conferenceTemplate === null || conferenceTemplate.useVehicleFlag === 1 || conferenceTemplate.useCardFlag === 1 || conferenceTemplate.useDinnerFlag === 1 || conferenceTemplate.useRoomFlag === 1" :label="getConferenceTemplate(1) + '服务'">
                    <div class="marginleftClass">
                        <el-checkbox-group v-model="xietong">
                            <el-checkbox v-for="xieton in xietongs" :key="xieton.value" :disabled="conferenceDisabled" :label="xieton.value">{{ xieton.text }}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </el-form-item>
                <el-form-item label="是否可见" prop="pushToLobbyFlag">
                    <el-radio-group v-model="ruleForm.pushToLobbyFlag" class="marginleftClass">
                        <el-radio :disabled="conferenceDisabled" :label="1">可见</el-radio>
                        <el-radio :disabled="conferenceDisabled" :label="0">不可见</el-radio>
                    </el-radio-group>
                    <div class="marginleftClass">
                        <span class="_48OpacityClass">设置{{ getConferenceTemplate(2) }}是否可在会议活动大厅中看到本场{{ getConferenceTemplate(1) }}</span>
                    </div>
                </el-form-item>

                <el-form-item label="参会范围" prop="visibaleFlag">
                    <el-radio-group v-model="ruleForm.visibaleFlag" class="marginleftClass">
                        <div style="margin-bottom:10px;margin-top:10px">
                            <el-radio :disabled="conferenceDisabled" :label="2">仅本单位</el-radio>
                        </div>
                        <div style="margin-bottom:10px;">
                            <el-radio :disabled="conferenceDisabled" :label="1">本单位及下属单位</el-radio>
                        </div>
                        <div style="margin-bottom:10px;">
                            <el-radio :disabled="conferenceDisabled" :label="3">全集团</el-radio>
                        </div>
                        <!-- <div style="margin-bottom:10px;">
                            <el-radio :disabled="conferenceDisabled" :label="4">不公开<span class="_48OpacityClass" style="margin-left:10px">（发布后不在会议活动大厅显示）</span></el-radio>
                        </div> -->
                    </el-radio-group>
                </el-form-item>

                <el-form-item
                    v-if="conferenceTemplate === null || conferenceTemplate.conferenceCodeFlag === 1"
                    class="daimaClass"
                    :label="getConferenceTemplate(1) + '代码'"
                    prop="conferenceCode"
                >
                    <!-- <el-switch
                        v-model="huiyidaima"
                        class="marginleftClass"
                        :active-text="huiyidaima ? '已开启' : '已关闭'"
                        inactive-text=""
                        :disabled="conferenceDisabled"
                    /> -->

                    <el-radio-group v-model="huiyidaima" class="marginleftClass">
                        <el-radio :disabled="conferenceDisabled" :label="true">开启</el-radio>
                        <el-radio :disabled="conferenceDisabled" :label="false">关闭</el-radio>
                    </el-radio-group>
                    <el-input v-show="huiyidaima" v-model="ruleForm.conferenceCode" maxlength="5" show-word-limit :disabled="!huiyidaima || conferenceDisabled" style="width:140px" :placeholder="'请输入5位数字'" />

                    <span v-show="huiyidaima" style="color:#ff4949;margin-left:10px">*</span>
                    <!-- <span v-show="huiyidaima" style="margin-left:10px" class="_48OpacityClass"></span> -->
                    <div class="marginleftClass">
                        <span class="_48OpacityClass">{{ getConferenceTemplate(2) }}可通过{{ getConferenceTemplate(1) }}代码搜索到本场{{ getConferenceTemplate(1) }}，如需开启请设置5位数字代码</span>
                    </div>
                </el-form-item>

                <!-- <el-form-item label="是否需要报到" prop="checkInFlag">
                    <el-radio-group v-model="ruleForm.checkInFlag" class="marginleftClass">
                        <el-radio :disabled="conferenceDisabled" :label="1">是</el-radio>
                        <el-radio :disabled="conferenceDisabled" :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item> -->

            </el-scrollbar>
        </el-form>
    </div>
</template>
<script>
import { getDicList, uploadFile } from '@/api/common'
import { getTempId, insert, getView, update, downloadFile } from '@/api/conference'
import { getProvinces, getCitys } from '@/utils/city'
import { setConferenceId, setConferenceTemplate } from '@/utils/conference-auth'
import { getTableHeight, GMTToStrYYYYMMDDHHmmss, checkPngSize } from '@/utils/index'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
import html2canvas from 'html2canvas'
export default {
    name: 'Information',
    components: {
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
        conferenceTemplate: {
            type: Object,
            default: null
        },
        conferenceStatus:{
            type: Number,
            default: null
        }
    },
    data() {
        var validatePass = (rule, value, callback) => {
            var zg = /^[0-9]*$/
            if (value === null || value === '') {
                callback()
            }
            if (!zg.test(value) || value.length !== 5) {
                callback(new Error('请输入五位数字'))
            } else {
                if (this.ruleForm.checkPass !== '') {
                    this.$refs.ruleForm.validateField('checkPass')
                }
                callback()
            }
        }
        var nameValidate = (rule, value, callback) => {
            if (value === null || value === '') {
                callback(new Error('请输入' + this.getConferenceTemplate(1) + '名称'))
            }
            console.log(value.indexOf('/'))
            console.log(value.indexOf('\\'))
            if (value.indexOf('/') > -1 || value.indexOf('\\') > -1) {
                callback(new Error(this.getConferenceTemplate(1) + '名称不允许包含/或\\'))
            } else {
                callback()
            }
        }
        return {
            showFileList: true,
            coverImgs: [],
            checkInStartTime: null,
            hideUploadEdit: false,
            formHeight: getTableHeight(50) + 'px',
            pickerOptions: {
                disabledDate: (time) => {
                    return time.getTime() < (new Date().getTime() - 24 * 60 * 60 * 1000)
                }
            },
            baodaoPickerOptions: {
                disabledDate: (time) => {
                    if (this.huiyiriqis !== null && this.huiyiriqis.length > 0) {
                        return time.getTime() > (new Date(this.huiyiriqis[1]).getTime()) ||
                        time.getTime() < (new Date().getTime() - 24 * 60 * 60 * 1000)
                    }
                    return time.getTime() < (new Date().getTime() - 24 * 60 * 60 * 1000)
                }
            },
            huiyiriqis: [],
            checkInTimes: [],
            imagePath: getOssBaseUrl(),
            organizationPOs: [],
            huiyikouling: false,
            huiyidaima: false,
            conferenceTemplates: [],
            conferenceTypes: [],
            provinces: [],
            citys: [],
            imageUrl: '',
            rules: {
                name: [{ required: true, message: '请输入' + this.getConferenceTemplate(1) + '名称', pattern: '[^ \x22]+', trigger: 'blur' },
                    { validator: nameValidate, trigger: ['blur', 'change'] }],
                fileList: [{ required: true, message: '请上传' + this.getConferenceTemplate(1) + '封面', trigger: 'blur' }],
                conferenceTemplateCode: [{ required: false, message: '请选择' + this.getConferenceTemplate(1) + '模板', trigger: 'change' }],
                huiyiriqis: [{ required: true, message: '请输入' + this.getConferenceTemplate(1) + '时间', trigger: 'blur' }],
                station: [{ required: true, message: '请输入' + this.getConferenceTemplate(1) + '地点', pattern: '[^ \x22]+', trigger: 'blur' }],
                // address: [{ required: true, message: '请输入详细地址', pattern: '[^ \x22]+', trigger: 'blur' }],
                type: [{ required: true, message: '请选择' + this.getConferenceTemplate(1) + '类型', trigger: 'change' }],
                conferenceCode: [{ required: true, message: '请输入' + this.getConferenceTemplate(1) + '代码', pattern: '[^ \x22]+', trigger: 'blur' },
                    { validator: validatePass, trigger: 'blur' }],
                signPassword: [{ validator: validatePass, trigger: 'blur' }]
            },
            xietong: ['useVehicleFlag', 'useCardFlag', 'useDinnerFlag', 'useRoomFlag'],
            xietongs: [
                { value: 'useVehicleFlag', text: '车辆安排' },
                { value: 'useRoomFlag', text: '住宿安排' },
                { value: 'useDinnerFlag', text: '餐饮安排' },
                { value: 'useCardFlag', text: '票证安排' }
            ],
            accept: '.png, .jpg',
            uploadHeader: { 'authToken': this.$store.state.user.token },
            uploadUrl: process.env.VUE_APP_BASE_API + '/files/upload',
            logoUploadData: {
                fileGroup: 3, // 文件组
                conferenceTempId: '', // 会议临时ID，新建会议上传附件传值
                conferenceId: '' // 会议ID，编辑会议上传附件传值
            },
            uploadData: {
                fileGroup: 1, // 文件组
                conferenceTempId: '', // 会议临时ID，新建会议上传附件传值
                conferenceId: '' // 会议ID，编辑会议上传附件传值
            },
            dialogImageUrl: '',
            dialogVisible: false,
            samplePicture: '',
            fileList: [],
            huiyizuzhi: [],
            conferenceOrganizationTypes: [],
            ruleForm: {
                templateCoverFlag: 1,
                checkInStartTime: null,
                checkInEndTime: null,
                checkInTimeFlag: 3,
                id: null,
                coverVOs: [],
                coverPOs: [],
                coverUrls: [],
                huiyiriqis: [],
                provinceValue: null,
                cityValue: null,
                provinceText: null,
                cityText: null,
                conferenceTempId: null,
                name: null,
                startTime: null,
                endTime: null,
                station: null,
                type: null,
                address: null,
                pushToLobbyFlag: 1,
                conferenceTemplateCode: '1',
                visibaleFlag: 2,
                contactInformation: null,
                conferenceContactsVOS:[
                    {
                        contactsName:'',
                        contactsPhone:'',
                        type:null,
                        unitOrDuty:''
                    }
                ],
                notice: null,
                introduction: null,
                organizationPOs: [],
                checkInFlag: 0,
                setAgendaFlag: 1,
                setSignConfigFlag: 1,
                signPassword: '',
                conferenceCode: ''
            }
        }
    },
    computed: {
        setAgendaFlag() {
            return this.ruleForm.setAgendaFlag
        },
        setSignConfigFlag() {
            return this.ruleForm.setSignConfigFlag
        }
    },
    watch: {
        huiyikouling(val) {
            if (!val) {
                this.$refs.ruleForm.clearValidate('signPassword')
                this.ruleForm.signPassword = null
            }
        },
        huiyidaima(val) {
            if (!val) {
                this.$refs.ruleForm.clearValidate('conferenceCode')
                this.ruleForm.conferenceCode = null
            }
        },
        setAgendaFlag(val) {
            this.$emit('shezhiyichengbitian', val === 1)
        },
        setSignConfigFlag(val) {
            this.$emit('shezhibaomingbitian', val === 1)
        },
        organizationPOs(val) {
            this.ruleForm.organizationPOs = this.organizationPOs
        }
    },
    created() {
        if (this.$route.name === 'conferenceCreate') {
            this.ruleForm.coverVOs = [{ 'coverUrl': this.conferenceTemplate.cover, 'downloadUrl': this.conferenceTemplate.coverDownloadUrl }]
            this.formHeight = getTableHeight(50) + 'px'
        } else {
            this.formHeight = getTableHeight(90) + 'px'
            // if (this.$store.state.menu.buttons.indexOf(this.Global.buttons.ConferenceView.submit) > -1) {
            //     this.formHeight = getTableHeight(90) + 'px'
            // } else {
            //     this.formHeight = getTableHeight(50) + 'px'
            // }
        }
        this.getProvinces()
        this.getConferenceTemplates()
        this.getConferenceTypes()
        this.getConferenceOrganizationTypes()
        if (this.$route.name !== 'conferenceUpdate') {
            getTempId().then(res => {
                this.ruleForm.conferenceTempId = res.result
                this.uploadData.conferenceTempId = res.result
                this.logoUploadData.conferenceTempId = res.result
            })
            // xietong: ['useVehicleFlag', 'useCardFlag', 'useDinnerFlag', 'useRoomFlag'],
            var xietongmoren = []
            if (this.conferenceTemplate === null) {
                xietongmoren = ['useVehicleFlag', 'useCardFlag', 'useDinnerFlag', 'useRoomFlag']
            } else {
                if (this.conferenceTemplate.useVehicleFlag === 1) {
                    xietongmoren.push('useVehicleFlag')
                }
                if (this.conferenceTemplate.useCardFlag === 1) {
                    xietongmoren.push('useCardFlag')
                }
                if (this.conferenceTemplate.useDinnerFlag === 1) {
                    xietongmoren.push('useDinnerFlag')
                }
                if (this.conferenceTemplate.useRoomFlag === 1) {
                    xietongmoren.push('useRoomFlag')
                }
            }

            this.xietong = xietongmoren
        } else {
            this.getView()
        }

        if (!(this.conferenceTemplate === null || this.conferenceTemplate.setAgendaFlag === 1)) {
            this.ruleForm.setAgendaFlag = 0
        }

        this.$emit('shezhiyichengbitian', this.ruleForm.setAgendaFlag === 1)
        this.$emit('shezhibaomingbitian', this.ruleForm.setSignConfigFlag === 1)
    },
    methods: {
        addContactInformation(){
            this.$forceUpdate();
            this.ruleForm.conferenceContactsVOS=[...this.ruleForm.conferenceContactsVOS,{
                contactsName:'',
                contactsPhone:'',
                type:null,
                unitOrDuty:''
            }]
            // this.ruleForm.conferenceContactsVOS.push({
                // contactsName:'',
                // contactsPhone:'',
                // type:null,
                // unitOrDuty:''
            // })

            
        },
        cancelContactInformation(index){
            this.$forceUpdate();
            this.ruleForm.conferenceContactsVOS.splice(index,1)
        },
        InputFn(value){
            this.$forceUpdate();
            console.log(value,"value")
        },
        checkInTimeFlagChange() {
            this.checkInTimes = []
            this.checkInStartTime = null
        },
        shezhiTabkeyong() {
            this.$emit('shezhiTabkeyong', this.ruleForm.id)
        },
        getView() {
            getView({ 'id': this.conferenceId }).then(res => {
                this.ruleForm = {...this.ruleForm,...res.result}
                // this.ruleForm=res.result
               
                if (this.ruleForm.organizationVOs !== null && this.ruleForm.organizationVOs !== undefined) {
                    this.organizationPOs = this.ruleForm.organizationVOs
                }
                this.huiyiriqis = [this.ruleForm.startTime, this.ruleForm.endTime]

                if (this.ruleForm.checkInTimeFlag === 2) {
                    this.checkInTimes = [this.ruleForm.checkInStartTime, this.ruleForm.checkInEndTime]
                } else if (this.ruleForm.checkInTimeFlag === 1) {
                    this.checkInStartTime = this.ruleForm.checkInEndTime
                } else if (this.ruleForm.checkInTimeFlag === 3) {
                    this.checkInStartTime = this.ruleForm.checkInStartTime
                }

                this.shezhiTabkeyong()
                this.citys = getCitys(this.ruleForm.provinceValue)
                // var images = []
                // this.coverImgs = res.result.coverVOs
                // if (res.result !== null && res.result.coverVOs !== null && res.result.coverVOs !== undefined) {
                //     res.result.coverVOs.forEach(item => {
                //         images.push({ 'uid': item.coverUrl, 'name': item.coverUrl, 'url': getOssBaseUrl() + item.coverUrl })
                //     })
                // }
                // this.fileList = images
                // this.hideUploadEdit = images.length >= 1
                this.uploadData.conferenceId = res.result.id
                this.logoUploadData.conferenceId = res.result.id

                this.xietong = []
                if (this.ruleForm.useVehicleFlag === 1) {
                    this.xietong.push('useVehicleFlag')
                }
                if (this.ruleForm.useCardFlag === 1) {
                    this.xietong.push('useCardFlag')
                }
                if (this.ruleForm.useDinnerFlag === 1) {
                    this.xietong.push('useDinnerFlag')
                }
                if (this.ruleForm.useRoomFlag === 1) {
                    this.xietong.push('useRoomFlag')
                }

                if (this.ruleForm.signPassword !== null && this.ruleForm.signPassword !== '') {
                    this.huiyikouling = true
                }

                if (this.ruleForm.conferenceCode !== null && this.ruleForm.conferenceCode !== '') {
                    this.huiyidaima = true
                }

                // if (this.ruleForm.pushToLobbyFlag === 0) {
                //     this.ruleForm.visibaleFlag = 4
                // }

                if (this.ruleForm.conferenceTemplateCode === null || this.ruleForm.conferenceTemplateCode === '') {
                    this.ruleForm.conferenceTemplateCode = '1'
                }
                if(res.result.contactsVOS){
                    this.ruleForm.conferenceContactsVOS=res.result.contactsVOS
                }
                 
                 console.log(this.ruleForm,"rule")
            })
        },
        dataURItoBlob(dataURI) {
            var byteString = atob(dataURI.split(',')[1])
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
            var ab = new ArrayBuffer(byteString.length)
            var ia = new Uint8Array(ab)
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i)
            }
            return new Blob([ab], { type: mimeString })
        },
        submitConference() {
            let valieMessage1 = ''
            let valieMessage2 = ''
            if (this.huiyikouling) {
                this.$refs.ruleForm.validateField('signPassword', (valid) => {
                    if (valid) {
                        valieMessage1 = valid
                    }
                })
            }
            
            if (this.huiyidaima) {
                this.$refs.ruleForm.validateField('conferenceCode', (valid) => {
                    valieMessage2 = valid
                })
            }

            if (!((valieMessage1 === null || valieMessage1 === '') && (valieMessage2 === null || valieMessage2 === ''))) {
                return
            }
            let isPhoneLength=false
            if(this.ruleForm.conferenceContactsVOS.length){
                this.ruleForm.conferenceContactsVOS.map((item)=>{
                if(item.contactsPhone&&item.contactsPhone.length!==11){
                    isPhoneLength=true
                }
            })
            }
            
            if(isPhoneLength){
                this.$message.info('请输入长度为11位的号码')
                return
            }
            this.$refs.ruleForm.validateField('name', (validTemp) => {
                if (validTemp === null || validTemp === '') {
                    this.$emit('setHideLoading', true)

                    if (this.ruleForm.templateCoverFlag === 1) {
                        this.showFileList = false
                        downloadFile({ filePath: this.conferenceTemplate.cover }).then(response => {
                            // this.$refs.imgDiv.src = URL.createObjectURL(new Blob([response.data], {
                            //     type: 'application/octet-stream'
                            // }))

                            // const dataURL = URL.createObjectURL(new Blob([response.data], {
                            //     type: 'application/octet-stream'
                            // }))
                            const formData = new FormData()
                            formData.append('fileGroup', 1)
                            formData.append('conferenceTempId', this.uploadData.conferenceTempId)
                            formData.append('conferenceId', this.uploadData.conferenceId)
                            formData.append('files', new Blob([response.data]), 'templateImg.png')

                            // this.imgUrl = dataURL
                            // this.fileList = [{ 'uid': 'templateImg', 'name': 'templateImg.png', 'url': 'https://sw-huiwu-test.oss-cn-beijing.aliyuncs.com/20210125000090/conferenceCover/QQ%E6%88%AA%E5%9B%BE202012241722391611557590517.png' }]
                            uploadFile(formData).then(res => {
                                this.fileList = [{ 'uid': this.uploadData.conferenceTempId, 'name': 'templateImg.png', 'url': res.result[0].downloadUrl }]
                                this.ruleForm.coverVOs = [{ 'coverUrl': res.result[0].filePath, 'downloadUrl': res.result[0].downloadUrl }]
                                if ((valieMessage1 === null || valieMessage1 === '') && (valieMessage2 === null || valieMessage2 === '')) {
                                    this.submitFunction()
                                }
                            })

                            // html2canvas(this.$refs.yaoqinghan, { allowTaint: true, useCORS: true }).then(canvas => {
                            //     const dataURL = canvas.toDataURL('image/png')
                            //     const formData = new FormData()
                            //     formData.append('fileGroup', 1)
                            //     formData.append('conferenceTempId', this.uploadData.conferenceTempId)
                            //     formData.append('conferenceId', this.uploadData.conferenceId)
                            //     formData.append('files', this.dataURItoBlob(dataURL), 'templateImg.png')

                            //     uploadFile(formData).then(res => {
                            //         this.fileList = [{ 'uid': this.uploadData.conferenceTempId, 'name': 'templateImg.png', 'url': res.result[0].downloadUrl }]
                            //         this.ruleForm.coverVOs = [{ 'coverUrl': res.result[0].filePath, 'downloadUrl': res.result[0].downloadUrl }]
                            //         if ((valieMessage1 === null || valieMessage1 === '') && (valieMessage2 === null || valieMessage2 === '')) {
                            //             this.submitFunction()
                            //         }
                            //     })
                            // })
                        }).catch(() => {
                        })
                    } else {
                        if ((valieMessage1 === null || valieMessage1 === '') && (valieMessage2 === null || valieMessage2 === '')) {
                            this.submitFunction()
                        }
                    }
                }
            })
        },

        submitFunction() {
            this.$refs.ruleForm.validateField('name', (valid) => {
                if (valid === null || valid === '') {
                    // this.loading = true
                    if (this.ruleForm.coverVOs !== undefined && this.ruleForm.coverVOs !== null && this.ruleForm.coverVOs.length > 0) {
                        this.ruleForm.coverVOs[0].mainFlag = 1
                    }
                    this.ruleForm.coverPOs = this.ruleForm.coverVOs
                    this.ruleForm.organizationPOs = this.organizationPOs
                    if (this.huiyiriqis !== null && this.huiyiriqis.length === 2) {
                        this.ruleForm.startTime = this.huiyiriqis[0]
                        this.ruleForm.endTime = this.huiyiriqis[1]
                    } else {
                        this.ruleForm.startTime = null
                        this.ruleForm.endTime = null
                    }

                    // if (this.ruleForm.visibaleFlag === 4) {
                    //     this.ruleForm.pushToLobbyFlag = 0
                    // } else {
                    //     this.ruleForm.pushToLobbyFlag = 1
                    // }

                    if (this.ruleForm.checkInTimeFlag === 2) {
                        if (this.checkInTimes !== null && this.checkInTimes.length === 2) {
                            this.ruleForm.checkInStartTime = this.checkInTimes[0]
                            this.ruleForm.checkInEndTime = this.checkInTimes[1]
                        } else {
                            this.ruleForm.checkInStartTime = null
                            this.ruleForm.checkInEndTime = null
                        }
                    } else if (this.ruleForm.checkInTimeFlag === 1) {
                        if (this.checkInStartTime !== null && this.checkInStartTime !== '') {
                            if (this.ruleForm.checkInStartTime === null || this.ruleForm.checkInStartTime === '') {
                                this.ruleForm.checkInStartTime = GMTToStrYYYYMMDDHHmmss(new Date())
                            }
                            this.ruleForm.checkInEndTime = this.checkInStartTime
                        } else {
                            this.ruleForm.checkInStartTime = null
                            this.ruleForm.checkInEndTime = null
                        }
                    } else if (this.ruleForm.checkInTimeFlag === 3) {
                        if (this.checkInStartTime !== null && this.checkInStartTime !== '') {
                            this.ruleForm.checkInStartTime = this.checkInStartTime
                            if (this.ruleForm.endTime !== null) {
                                if (this.ruleForm.checkInEndTime !== this.ruleForm.endTime) {
                                    this.ruleForm.checkInEndTime = this.ruleForm.endTime
                                }
                            } else {
                                this.ruleForm.checkInEndTime = null
                            }
                        } else {
                            this.ruleForm.checkInStartTime = null
                            this.ruleForm.checkInEndTime = null
                        }
                    }

                    // if ((this.ruleForm.checkInStartTime !== null && this.ruleForm.checkInStartTime !== '') ||
                    //     (this.ruleForm.checkInEndTime !== null && this.ruleForm.checkInEndTime !== '')) {
                    //     this.ruleForm.checkInFlag = 1
                    // } else {
                    //     this.ruleForm.checkInFlag = 0
                    // }

                    this.ruleForm.checkInFlag = 1

                    if (this.xietong !== null) {
                        if (this.xietong.indexOf('useVehicleFlag') > -1) {
                            this.ruleForm.useVehicleFlag = 1
                        } else {
                            this.ruleForm.useVehicleFlag = 0
                        }

                        if (this.xietong.indexOf('useCardFlag') > -1) {
                            this.ruleForm.useCardFlag = 1
                        } else {
                            this.ruleForm.useCardFlag = 0
                        }

                        if (this.xietong.indexOf('useDinnerFlag') > -1) {
                            this.ruleForm.useDinnerFlag = 1
                        } else {
                            this.ruleForm.useDinnerFlag = 0
                        }

                        if (this.xietong.indexOf('useRoomFlag') > -1) {
                            this.ruleForm.useRoomFlag = 1
                        } else {
                            this.ruleForm.useRoomFlag = 0
                        }
                    } else {
                        this.ruleForm.useVehicleFlag = 0
                        this.ruleForm.useCardFlag = 0
                        this.ruleForm.useDinnerFlag = 0
                        this.ruleForm.useRoomFlag = 0
                    }
                    /**
                     * @Descripttion: 应后端要求，当联系方式电话+姓名+职位都为空时,type传null,否则固定传1
                     * @LastEditors: wanghz
                     * @LastEditTime:2021-8-30 10:32
                     */
                    this.ruleForm.conferenceContactsVOS.forEach(item=>{
                        if(item.contactsName !== '' || item.contactsPhone !== '' || item.unitOrDuty !== '') {
                            item.type = 1
                        }
                    })
                    console.log(this.ruleForm.coverPOs)
                    if (this.ruleForm.id === undefined || this.ruleForm.id === null || this.ruleForm.id === '') {
                        this.ruleForm.conferenceTemplateId = this.conferenceTemplate.id
                        insert(this.ruleForm).then(res => {
                            if (res.success) {
                                this.$message(res.message)
                                this.ruleForm.id = res.result
                                setConferenceId(res.result)
                                this.uploadData.conferenceId = res.result
                                this.logoUploadData.conferenceId = res.result
                                // this.$emit('conferenceStatusFn',1)
                                getView({ 'id': res.result }).then(res1 => {
                                    if (res1.success) {
                                        let data=res1.result.status
                                        // this.$emit('conferenceStatusFn',data)
                                        this.$emit('updata:conferenceStatus',data)
                                        console.log(res1,res1.result.status, 'res1')
                                        setConferenceTemplate(res1.result.conferenceTemplate)
                                    }
                                })

                                if (this.ruleForm.coverVOs !== undefined && this.ruleForm.coverVOs !== null && this.ruleForm.coverVOs.length > 0) {
                                    this.ruleForm.coverVOs.forEach((item, index) => {
                                        this.ruleForm.coverVOs[index].coverUrl = this.ruleForm.coverVOs[index].coverUrl.replace(this.ruleForm.conferenceTempId, res.result)
                                    })
                                }

                                this.$store.dispatch('menu/getButtons').then(() => {
                                    this.shezhiTabkeyong()
                                })

                                this.$emit('shezhiyichengbitian', this.ruleForm.setAgendaFlag === 1)
                                this.$emit('shezhibaomingbitian', this.ruleForm.setSignConfigFlag === 1)
                                this.$emit('checkFull', res.result)
                            }
                            this.$emit('setHideLoading', false)
                        }).catch(() => {
                            this.$emit('setHideLoading', false)
                        })
                    } else {
                        this.$emit('setHideLoading', true)
                        update(this.ruleForm).then(res => {
                            if (res.success) {
                                this.$message(res.message)
                                this.shezhiTabkeyong()

                                this.$emit('shezhiyichengbitian', this.ruleForm.setAgendaFlag === 1)
                                this.$emit('shezhibaomingbitian', this.ruleForm.setSignConfigFlag === 1)
                                this.$emit('checkFull', res.result)

                                this.$store.state.user.conferenceName = this.ruleForm.name
                            }
                            this.$emit('setHideLoading', false)
                        }).catch(() => {
                            this.$emit('setHideLoading', false)
                        })
                    }
                } else {
                    this.$emit('setHideLoading', false)
                }
            })
        },

        tianjiahuiyizuzhi() {
            this.organizationPOs.push({ 'organizationType': '', 'organizationName': '', 'organizationLogo': '' })
        },
        getConferenceOrganizationTypes() {
            getDicList({ 'code': 'conferenceOrganizationType' }).then(response => {
                this.conferenceOrganizationTypes = response.result
            })
        },
        getConferenceTemplates() {
            getDicList({ 'code': 'conferenceTemplate' }).then(response => {
                this.conferenceTemplates = response.result
            })
        },
        getConferenceTypes() {
            getDicList({ 'code': 'conferenceType' }).then(response => {
                this.conferenceTypes = response.result
            })
        },
        getProvinces() {
            this.provinces = getProvinces()
        },
        getCitys() {
            if (this.ruleForm.provinceValue !== null && this.ruleForm.provinceValue !== '') {
                this.provinces.forEach(item => {
                    if (item.value === this.ruleForm.provinceValue) {
                        this.ruleForm.provinceText = item.text
                    }
                })
            } else {
                this.provinceText = null
            }
            this.ruleForm.cityValue = null
            this.citys = getCitys(this.ruleForm.provinceValue)
        },
        cityChange() {
            if (this.ruleForm.cityValue !== null && this.ruleForm.cityValue !== '') {
                this.citys.forEach(item => {
                    if (item.value === this.ruleForm.cityValue) {
                        this.ruleForm.cityText = item.text
                    }
                })
            } else {
                this.cityText = null
            }
        },
        removeZuzhi(item) {
            var index = this.organizationPOs.indexOf(item)
            if (index !== -1) {
                this.organizationPOs.splice(index, 1)
            }
        },
        logoSuccess(response, file, fileList, index) {
            this.ruleForm.organizationPOs[index].organizationLogo = response.result[0].filePath
            // alert(20)
        },
        onSuccess(response, file, fileList) {
            if (this.fileList == null) {
                this.fileList = []
            }

            if (this.ruleForm.coverVOs == null) {
                this.ruleForm.coverVOs = []
            }

            if (response.code === 2000) {
                this.fileList = [{ 'uid': file.uid, 'name': file.name, 'url': response.result[0].downloadUrl }]
                this.ruleForm.coverVOs = [{ 'coverUrl': response.result[0].filePath, 'downloadUrl': response.result[0].downloadUrl }]
                this.ruleForm.templateCoverFlag = 0
            } else {
                this.fileList = []
                this.ruleForm.coverVOs = []
            }
        },
        handleRemove(file, fileList) {
            this.fileList = []
            this.ruleForm.coverVOs = []
        },
        handleChange(file, fileList) {
        // 大于1张隐藏
            this.hideUploadEdit = fileList.length >= 1
        },
        onError(err, file, fileList) {
            this.$message('上传失败')
            console.log(err)
        },
        beforeUpload(file) {
            return (new Promise((resolve, reject) => {
                console.log(file)
                const isLt5M = file.size / 1024 / 1024 <= 10
                if (!isLt5M) {
                    this.$message('上传文件大小不能超过 10M')
                    reject()
                }
                checkPngSize(file, 2, (val) => {
                // alert('1' + val)
                // sizeFlag = val
                    if (!val) {
                        this.$message('图片宽高比需为' + '2:1' + '。已选图片不符合要求，请重新选择')
                        reject()
                    }
                    this.showFileList = false
                    resolve(file)
                })
            }))

            // alert(checkPngSize(file, 1.8, 2.2))
            // alert(checkPngSize(file, 1.8, 2.2))
            // var sizeFlag = false

            // return false
        },
        onExceed(files, fileList) {
            this.$message('请上传最多5个封面')
        }
    }
}
</script>
<style lang="scss" scoped>
.riqiwenzi {
    height: 68px;
    font-size: 22px;
    font-family: AlibabaPuHuiTi-Regular, AlibabaPuHuiTi;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 34px;
    position: absolute;
    top: 25%;
    text-align:center;
    width: 100%;
    padding-left: 22px;
    padding-right: 22px;
}
.image-div {
    width: 150px;
    height: 75px;
    position: relative;
}
.image-div img {
    width: 150px;
    height: 75px;
}
.image-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 0;
    background: rgba(101, 101, 101, 0.6);
    color: #ffffff;
    opacity: 0;
    line-height: 75px;
}
.image-div:hover .image-mask {
    opacity: 1;
    cursor: default;
}
.marginleftClass {
     margin-left: 5%;
}
.el-input{
    margin-left: 5%;
    width:360px;
}
.el-select{
    margin-left: 5%;
    width:360px;
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

.textarea48OpacityClass {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(25, 31, 36, 0.48);
    line-height: 16px;
}

.tianjiahuiyizuzhiClass {
    height: 32px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #1E89FF;
}
.erweimaClass {
    height: 32px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #1E89FF;
}
</style>
