<template>
    <div style="background-color: #EEF0F4">
        <el-row :style="{'height': tabsHeight}">
            <el-col
                v-show="allFormDisabled || (ruleForm.signStatus === 3 && ruleForm.changeStatus === 1) || (ruleForm.signStatus === null && ruleForm.changeStatus === 1)"
                :span="24"
            >
                <div
                    v-show="!allFormDisabled "
                    class="changeContentClass"
                    style="width:100%;background-color:white;height:72px;border-bottom: solid rgba(25, 31, 36, 0.08) 1px;white-space: nowrap;overflow-x: auto;overflow-y: hidden;-webkit-overflow-scrolling:touch;padding-left:20px;padding-top:16px;padding-right:20px;"
                >
                    <el-scrollbar style="height:100%;width:100%">
                        <div style="display: inline-block;padding-left:10px;font-size:14px;line-height:20px">
                            <div>
                                <span>变更前：</span>
                            </div>
                            <div>
                                <span style="color:#1E89FF">变更后：</span>
                            </div>
                        </div>
                        <div
                            v-for="changeItem in changeList"
                            :key="changeItem.code"
                            style="display: inline-block;padding-left:10px;font-size:14px;line-height:20px"
                        >
                            <div>
                                <span style="color: rgba(25, 31, 36, 0.48);">{{ changeItem.attribute }}：</span>
                                <span v-if="changeItem.type !== 10 && changeItem.type !== 9 && changeItem.code !== 'photoUrl'">{{ changeItem.beforeValue }}</span>
                                <span v-if="changeItem.code === 'photoUrl'" class="demo-image__preview" style="float:right;margin-top:2px">
                                    <el-image
                                        style="width:13px;height:13px;border-radius:50%;margin-top:2px"
                                        :src="changeItem.beforeValue !== null && changeItem.beforeValue !== '' && changeItem.beforeValue.indexOf('http') !== -1 ? changeItem.beforeValue : (defaultPhoto)"
                                        :preview-src-list="[changeItem.beforeValue !== null && changeItem.beforeValue !== '' && changeItem.beforeValue.indexOf('http') !== -1 ? changeItem.beforeValue : (defaultPhoto)]"
                                    />
                                </span>
                                <span v-if="changeItem.type === 10">
                                    <span
                                        v-for="(pic, index) in formatPicChangeContent(changeItem.beforeValue)"
                                        :key="'pic' + index"
                                    >
                                        <el-link
                                            :underline="false"
                                            type="info"
                                            @click="chakanzhaopianxiangqing(pic.fileUrl)"
                                        >
                                            [{{ pic.fileName }}]</el-link>{{ index !== formatPicChangeContent(changeItem.beforeValue).length - 1 ? ',' : '' }}
                                    </span>

                                </span>
                                <span v-if="changeItem.type === 9">

                                    <!-- <span v-show="formatPicChangeContent(itemSub.beforeValue).length === 0">
                                        无
                                    </span> -->
                                    <span
                                        v-for="(pic, index) in formatPicChangeContent(changeItem.beforeValue)"
                                        :key="'pic' + index"
                                    >
                                        <el-image
                                            style="width:13px;height:13px;border-radius:50%;margin-top:2px"
                                            :src="pic.fileUrl"
                                            :preview-src-list="[ viewPicUrl ]"
                                            @click="event => clickPic(event, pic)"
                                            @error.once="event => getPicFilePath(event, pic)"
                                        />
                                    </span>
                                </span>
                            </div>
                            <div>
                                <span style="color: rgba(25, 31, 36, 0.48);">{{ changeItem.attribute }}：</span>
                                <span
                                    v-if="changeItem.type !== 10 && changeItem.type !== 9 && changeItem.code !== 'photoUrl'"
                                    style="color:#1E89FF"
                                >{{ changeItem.afterValue }}</span>
                                <!-- <img v-else style="width:15px;height:15px;border-radius:50%" :src="imagePath + (changeItem.afterValue !== null && changeItem.afterValue !== '' ? changeItem.afterValue : defaultPhoto)"> -->
                                <span v-if="changeItem.code === 'photoUrl'" class="demo-image__preview">
                                    <el-image
                                        style="width:14px;height:14px;border-radius:50%;margin-top:4px"
                                        :src="(changeItem.afterValue !== null && changeItem.afterValue !== '' && changeItem.afterValue.indexOf('http') !== -1) ? changeItem.afterValue : (defaultPhoto)"
                                        :preview-src-list="[changeItem.afterValue !== null && changeItem.afterValue !== '' && changeItem.afterValue.indexOf('http') !== -1 ? changeItem.afterValue : (defaultPhoto)]"
                                    />
                                </span>
                                <span v-if="changeItem.type === 10">

                                    <span
                                        v-for="(pic, index) in formatPicChangeContent(changeItem.afterValue)"
                                        :key="'pic' + index"
                                    >
                                        <el-link
                                            :underline="false"
                                            type="info"
                                            @click="chakanzhaopianxiangqing(pic.fileUrl)"
                                        >
                                            [{{ pic.fileName }}]</el-link>{{ index !== formatPicChangeContent(changeItem.afterValue).length - 1 ? ',' : '' }}
                                    </span>

                                </span>
                                <span v-if="changeItem.type === 9">

                                    <span
                                        v-for="(pic, index) in formatPicChangeContent(changeItem.afterValue)"
                                        :key="'pic' + index"
                                    >
                                        <el-image
                                            style="width:13px;height:13px;border-radius:50%;margin-top:2px"
                                            :src="pic.fileUrl"
                                            :preview-src-list="[ viewPicUrl ]"
                                            @click="event => clickPic(event, pic)"
                                            @error.once="event => getPicFilePath(event, pic)"
                                        />
                                    </span>
                                </span>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
                <div
                    v-show="allFormDisabled && taskView !== null && taskView.type === 3"
                    class="changeContentClass"
                    style="width:100%;background-color:white;height:72px;border-bottom: solid rgba(25, 31, 36, 0.08) 1px;white-space: nowrap;overflow-x: auto;overflow-y: hidden;-webkit-overflow-scrolling:touch;padding-left:20px;padding-top:16px;padding-right:20px;"
                >
                    <!-- <div style="display: inline-block;padding-left:10px;font-size:14px;line-height:20px">
                        <div style="margin-top:10px">
                            <span>变更类型：{{ ruleForm.signFormConfigFormatVO.attendeeName.fieldValue }}申请取消参会</span>
                        </div>
                    </div> -->
                    <div style="display: inline-block;padding-left:10px;font-size:14px;line-height:20px">
                        <div>
                            <span>变更类型：{{ ruleForm.signFormConfigFormatVO.attendeeName.fieldValue }}申请取消参会</span>
                        </div>
                        <div v-if="taskView !== null">
                            <span :title="taskView.cancelMettingReason">原因：{{ taskView.cancelMettingReason }}</span>
                        </div>
                    </div>
                </div>
                <div
                    v-show="allFormDisabled && taskView !== null && taskView.type === 5"
                    class="changeContentClass"
                    style="width:100%;background-color:white;height:72px;border-bottom: solid rgba(25, 31, 36, 0.08) 1px;white-space: nowrap;overflow-x: auto;overflow-y: hidden;-webkit-overflow-scrolling:touch;padding-left:20px;padding-top:16px;padding-right:20px;"
                >
                    <div style="display: inline-block;padding-left:10px;font-size:14px;line-height:20px">
                        <div>
                            <span>请假类型：{{ changeList.typeStr }}</span>
                            <span
                                style="margin-left:20px"
                            >离会时间：{{ changeList.leaveTime !== undefined && changeList.leaveTime !== null && changeList.leaveTime.length === 19 ? changeList.leaveTime.substr(0,16) : changeList.leaveTime }}</span>
                            <span
                                v-show="changeList.type !== 4"
                                style="margin-left:20px"
                            >返回时间：{{ changeList.returnTime !== undefined && changeList.returnTime !== null && changeList.returnTime.length === 19 ? changeList.returnTime.substr(0,16) : changeList.returnTime }}</span>
                        </div>
                        <div>
                            <span :title="changeList.reason">请假原因：{{ changeList.reason }}</span>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col
                :span="ruleForm.id !== null && ruleForm.id !== '' && ruleForm.signStatus !== 0 ? 17 : 24"
                class="canhuirenClass"
            >
                <el-tabs v-model="activeNameSignup" style="background-color:#EEF0F4;">
                    <el-tab-pane name="first" style="padding-left:8px;padding-right:8px">
                        <span slot="label" style="margin-top:15px;font-size:16px;margin-left:15px;">基本信息</span>
                        <div style="background-color:white;padding-top:8px">
                            <div
                                v-show="ruleForm.id !== undefined && ruleForm.id !== null && ruleForm.id !== '' && ruleForm.signStatus !== 0"
                                style="width:100%;padding-left:8px;padding-right:16px;"
                            >
                                <el-row
                                    style="background: #EBF8FF;height:48px;padding;color:rgba(25, 31, 36, 0.64);padding-left:20px;padding-right:20px;padding-top:15px;"
                                >
                                    <el-col :span="3" style="text-align:right">
                                        {{ this.$route.name === 'attendeeViewForUpdate' || (this.$route.name === 'attendeeViewForCheck' && (taskView.type === 4 || taskView.type === 5)) ? '参会状态：' : '报名状态：' }}
                                    </el-col>
                                    <el-col :span="5" style="text-align:left">
                                        <el-tag style="background-color:#1E89FF;color:#FFF;margin-top:-1px">
                                            {{ this.$route.name === 'attendeeViewForUpdate' || (this.$route.name === 'attendeeViewForCheck' && (taskView.type === 4 || taskView.type === 5)) ? (ruleForm.meetingStatusStr) : (ruleForm.signStatusStr !== null && ruleForm.signStatusStr !== '' ? ruleForm.signStatusStr : '报名成功') }}
                                        </el-tag>
                                    </el-col>
                                    <el-col :span="3" style="text-align:right">报名来源：</el-col>
                                    <el-col :span="5" style="text-align:left">
                                        {{ ruleForm.sourceType === 1 ? '后台录入' : ruleForm.sourceType === 2 ? '本人报名' : ruleForm.sourceType === 3 ? '代报名' : ruleForm.sourceType === 4 ? '会务组代报名' : ruleForm.sourceType === 5 ? '受邀参加' : '-' }}
                                        {{ ruleForm.sourceType === 1 || ruleForm.sourceType === 3 || ruleForm.sourceType === 4 ? ('（录入人：' + ruleForm.createUserName + '）') : '' }}</el-col>
                                    <el-col :span="3" style="text-align:right">报名时间：</el-col>
                                    <el-col :span="5" style="text-align:left">{{ baomingshijian }}</el-col>
                                </el-row>
                            </div>
                            <el-form
                                ref="ruleForm"
                                :disabled="allFormDisabled"
                                class="conferenceFormClass"
                                :style="{'height': formHeight,'overflow-x':'hidden','overflow-y':'auto', 'margin-top': '15px'}"
                                label-position="right"
                                label-width="27%"
                                :model="ruleForm"
                                :rules="rules"
                            >
                                <el-scrollbar style="height:100%">
                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.attendeeName.showFlag === 1"
                                        :label="ruleForm.signFormConfigFormatVO.attendeeName.fieldLabel"
                                        :prop="'signFormConfigFormatVO.attendeeName.fieldValue'"
                                        maxlength="30"
                                        class="keepOutRight"
                                        show-word-limit
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.attendeeName.requireFlag === 1, message: '请输入' + ruleForm.signFormConfigFormatVO.attendeeName.fieldLabel, trigger: 'blur' }
                                        ]"
                                    >
                                        <el-input
                                            v-model="ruleForm.signFormConfigFormatVO.attendeeName.fieldValue"
                                            :disabled="ruleForm.id !== null && ruleForm.id !== '' && ruleForm.signStatus !== 0 && ruleForm.signStatus !== 2"
                                            class="marginleftClass width360"
                                            :placeholder="'请输入' + ruleForm.signFormConfigFormatVO.attendeeName.fieldLabel"
                                            @blur="refreshSignConfig"
                                        />
                                    </el-form-item>
                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.phone.showFlag === 1"
                                        :label="ruleForm.signFormConfigFormatVO.phone.fieldLabel"
                                        :prop="'signFormConfigFormatVO.phone.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.phone.requireFlag === 1, message: '请输入' + ruleForm.signFormConfigFormatVO.phone.fieldLabel, trigger: 'blur' },
                                            telephoneValid
                                        ]"
                                    >
                                        <div class="phone-custom">
                                            <el-input
                                                ref="phoneCustom"
                                                v-model="ruleForm.signFormConfigFormatVO.phone.fieldValue"
                                                maxlength="11"
                                                show-word-limit
                                                :disabled="ruleForm.id !== null && ruleForm.id !== '' && ruleForm.signStatus !== 0 && ruleForm.signStatus !== 2"
                                                :placeholder="'请输入' + ruleForm.signFormConfigFormatVO.phone.fieldLabel"
                                                class="width360 keepOutRight"
                                                :class="!(ruleForm.id !== null && ruleForm.id !== '' && ruleForm.signStatus !== 0 && ruleForm.signStatus !== 2) ? 'width260' : ''"
                                                @blur="refreshSignConfig"
                                            />
                                            <el-button v-if="!(ruleForm.id !== null && ruleForm.id !== '' && ruleForm.signStatus !== 0 && ruleForm.signStatus !== 2)" type="text" class="phone-custom-btn" @click="phoneCustom">生成虚拟号码</el-button>
                                            <div v-if="!(ruleForm.id !== null && ruleForm.id !== '' && ruleForm.signStatus !== 0 && ruleForm.signStatus !== 2)" class="phone-custom-tips" @click="phoneCustomDetail">
                                                <div>
                                                    <div>?</div>
                                                    <span>什么是虚拟号码？</span>
                                                </div>
                                            </div>
                                        </div>
                                    </el-form-item>
                                    <el-form-item
                                        v-if="ruleForm.signFormConfigFormatVO.phoneForMsg !== undefined && ruleForm.signFormConfigFormatVO.phoneForMsg != null"
                                        v-show="ruleForm.signFormConfigFormatVO.phoneForMsg.showFlag === 1 && !(ruleForm.id === undefined || ruleForm.id === null || ruleForm.id === '')"
                                        :label="ruleForm.signFormConfigFormatVO.phoneForMsg.fieldLabel"
                                        :prop="'signFormConfigFormatVO.phoneForMsg.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.phoneForMsg.requireFlag === 1 && validFlag === 1, message: '请输入' + ruleForm.signFormConfigFormatVO.phoneForMsg.fieldLabel, trigger: 'blur' },
                                            telephoneValid
                                        ]"
                                    >
                                        <el-input
                                            v-model="ruleForm.signFormConfigFormatVO.phoneForMsg.fieldValue"
                                            maxlength="11"
                                            show-word-limit
                                            :placeholder="'请输入' + ruleForm.signFormConfigFormatVO.phoneForMsg.fieldLabel"
                                            class="marginleftClass width360 keepOutRight"
                                        />
                                    </el-form-item>

                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.sex.showFlag === 1"
                                        :label="ruleForm.signFormConfigFormatVO.sex.fieldLabel"
                                        :prop="'signFormConfigFormatVO.sex.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.sex.requireFlag === 1 && validFlag === 1, message: '请选择' + ruleForm.signFormConfigFormatVO.sex.fieldLabel, trigger: 'change' }
                                        ]"
                                    >
                                        <el-radio-group
                                            v-model="ruleForm.signFormConfigFormatVO.sex.fieldValue"
                                            class="marginleftClass"
                                        >
                                            <el-radio label="1">男</el-radio>
                                            <el-radio label="2">女</el-radio>
                                        </el-radio-group>
                                    </el-form-item>

                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.nation.showFlag === 1"
                                        :label="ruleForm.signFormConfigFormatVO.nation.fieldLabel"
                                        :prop="'signFormConfigFormatVO.nation.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.nation.requireFlag === 1 && validFlag === 1, message: '请选择' + ruleForm.signFormConfigFormatVO.nation.fieldLabel, trigger: 'change' }
                                        ]"
                                    >
                                        <el-select
                                            v-model="ruleForm.signFormConfigFormatVO.nation.fieldValue"
                                            class="marginleftClass width360"
                                            :placeholder="'请选择' + ruleForm.signFormConfigFormatVO.nation.fieldLabel"
                                        >
                                            <el-option
                                                v-for="item in nations"
                                                :key="item.valCode"
                                                :label="item.valName"
                                                :value="item.valCode"
                                            />
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.organizationSortName.showFlag === 1"
                                        :label="ruleForm.signFormConfigFormatVO.organizationSortName.fieldLabel"
                                        :prop="'signFormConfigFormatVO.organizationSortName.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.organizationSortName.requireFlag === 1 && validFlag === 1, message: '请输入' + ruleForm.signFormConfigFormatVO.organizationSortName.fieldLabel, trigger: 'blur' }
                                        ]"
                                    >
                                        <el-input
                                            v-model="ruleForm.signFormConfigFormatVO.organizationSortName.fieldValue"
                                            class="marginleftClass width360 keepOutRight"
                                            maxlength="30"
                                            show-word-limit
                                            :placeholder="'请输入' + ruleForm.signFormConfigFormatVO.organizationSortName.fieldLabel"
                                        />
                                    </el-form-item>
                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.organizationName.showFlag === 1"
                                        :label="ruleForm.signFormConfigFormatVO.organizationName.fieldLabel"
                                        :prop="'signFormConfigFormatVO.organizationName.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.organizationName.requireFlag === 1 && validFlag === 1, message: '请输入' + ruleForm.signFormConfigFormatVO.organizationName.fieldLabel, trigger: 'blur' }
                                        ]"
                                    >
                                        <el-input
                                            v-model="ruleForm.signFormConfigFormatVO.organizationName.fieldValue"
                                            maxlength="30"
                                            show-word-limit
                                            class="marginleftClass width360 keepOutRight"
                                            :placeholder="'请输入' + ruleForm.signFormConfigFormatVO.organizationName.fieldLabel"
                                        />
                                    </el-form-item>

                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.deptShortName.showFlag === 1"
                                        :label="ruleForm.signFormConfigFormatVO.deptShortName.fieldLabel"
                                        :prop="'signFormConfigFormatVO.deptShortName.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.deptShortName.requireFlag === 1 && validFlag === 1, message: '请输入' + ruleForm.signFormConfigFormatVO.deptShortName.fieldLabel, trigger: 'blur' }
                                        ]"
                                    >
                                        <el-input
                                            v-model="ruleForm.signFormConfigFormatVO.deptShortName.fieldValue"
                                            class="marginleftClass width360 keepOutRight"
                                            maxlength="30"
                                            show-word-limit
                                            :placeholder="'请输入' + ruleForm.signFormConfigFormatVO.deptShortName.fieldLabel"
                                        />
                                    </el-form-item>
                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.deptName.showFlag === 1"
                                        :label="ruleForm.signFormConfigFormatVO.deptName.fieldLabel"
                                        :prop="'signFormConfigFormatVO.deptName.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.deptName.requireFlag === 1 && validFlag === 1, message: '请输入' + ruleForm.signFormConfigFormatVO.deptName.fieldLabel, trigger: 'blur' }
                                        ]"
                                    >
                                        <el-input
                                            v-model="ruleForm.signFormConfigFormatVO.deptName.fieldValue"
                                            maxlength="30"
                                            show-word-limit
                                            class="marginleftClass width360 keepOutRight"
                                            :placeholder="'请输入' + ruleForm.signFormConfigFormatVO.deptName.fieldLabel"
                                        />
                                    </el-form-item>

                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.position.showFlag === 1"
                                        :label="ruleForm.signFormConfigFormatVO.position.fieldLabel"
                                        :prop="'signFormConfigFormatVO.position.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.position.requireFlag === 1 && validFlag === 1, message: '请输入' + ruleForm.signFormConfigFormatVO.position.fieldLabel, trigger: 'blur' }
                                        ]"
                                    >
                                        <el-input
                                            v-model="ruleForm.signFormConfigFormatVO.position.fieldValue"
                                            maxlength="20"
                                            show-word-limit
                                            class="marginleftClass width360 keepOutRight"
                                            :placeholder="'请输入' + ruleForm.signFormConfigFormatVO.position.fieldLabel"
                                        />
                                    </el-form-item>

                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.positionLevel.showFlag === 1"
                                        :label="ruleForm.signFormConfigFormatVO.positionLevel.fieldLabel"
                                        :prop="'signFormConfigFormatVO.positionLevel.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.positionLevel.requireFlag === 1 && validFlag === 1, message: '请选择' + ruleForm.signFormConfigFormatVO.positionLevel.fieldLabel, trigger: 'change' }
                                        ]"
                                    >
                                        <el-select
                                            v-model="ruleForm.signFormConfigFormatVO.positionLevel.fieldValue"
                                            class="marginleftClass width360"
                                            :placeholder="'请选择' + ruleForm.signFormConfigFormatVO.positionLevel.fieldLabel"
                                        >
                                            <el-option
                                                v-for="item in positionLevels"
                                                :key="item.valCode"
                                                :label="item.valName"
                                                :value="item.valCode"
                                            />
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.cardType.showFlag === 1"
                                        :label="ruleForm.signFormConfigFormatVO.cardType.fieldLabel"
                                        :prop="'signFormConfigFormatVO.cardType.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.cardType.requireFlag === 1 && validFlag === 1, message: '请选择' + ruleForm.signFormConfigFormatVO.cardType.fieldLabel, trigger: 'change' }
                                        ]"
                                    >
                                        <!-- :disabled="ruleForm.id !== null && ruleForm.id !== '' && ruleForm.signStatus !== 0 && ruleForm.signStatus !== 2" -->
                                        <el-select
                                            v-model="ruleForm.signFormConfigFormatVO.cardType.fieldValue"
                                            class="marginleftClass width360"
                                            :placeholder="'请选择' + ruleForm.signFormConfigFormatVO.cardType.fieldLabel"
                                            @change="changeCardType"
                                        >
                                            <el-option
                                                v-for="item in cardTypes"
                                                :key="item.valCode"
                                                :label="item.valName"
                                                :value="item.valCode"
                                            />
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.cardNum.showFlag === 1"
                                        :label="ruleForm.signFormConfigFormatVO.cardNum.fieldLabel"
                                        :prop="'signFormConfigFormatVO.cardNum.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.cardNum.requireFlag === 1 && validFlag === 1, message: '请输入' + ruleForm.signFormConfigFormatVO.cardNum.fieldLabel, trigger: 'blur' },
                                            (ruleForm.signFormConfigFormatVO.cardType.fieldValue === '1'|| ruleForm.signFormConfigFormatVO.cardType.showFlag === 0)
                                                && (currentCardNum === null || currentCardNum === '' || currentCardNum.indexOf('*') === -1)
                                                ? cardValid : {}
                                        ]"
                                    >
                                        <!-- :disabled="ruleForm.id !== null && ruleForm.id !== '' && ruleForm.signStatus !== 0 && ruleForm.signStatus !== 2" -->
                                        <el-input
                                            v-model="ruleForm.signFormConfigFormatVO.cardNum.fieldValue"
                                            :disabled="(ruleForm.signFormConfigFormatVO.cardType.fieldValue === '1' || ruleForm.signFormConfigFormatVO.cardType.showFlag === 0) && (currentCardNum !== null && currentCardNum !== '' && currentCardNum.indexOf('*') !== -1)"
                                            :maxlength="ruleForm.signFormConfigFormatVO.cardType.fieldValue === '1' ? '18' : '20'"
                                            show-word-limit
                                            :placeholder="'请输入' + ruleForm.signFormConfigFormatVO.cardNum.fieldLabel"
                                            class="marginleftClass width360 keepOutRight"
                                        />
                                    </el-form-item>

                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.email.showFlag === 1"
                                        :label="ruleForm.signFormConfigFormatVO.email.fieldLabel"
                                        :prop="'signFormConfigFormatVO.email.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.email.requireFlag === 1 && validFlag === 1, message: '请输入' + ruleForm.signFormConfigFormatVO.email.fieldLabel, trigger: 'blur' },
                                            emailValid
                                        ]"
                                    >
                                        <el-input
                                            v-model="ruleForm.signFormConfigFormatVO.email.fieldValue"
                                            maxlength="50"
                                            show-word-limit
                                            class="marginleftClass width360 keepOutRight"
                                            :placeholder="'请输入' + ruleForm.signFormConfigFormatVO.email.fieldLabel"
                                        />
                                    </el-form-item>

                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.honourFlag.showFlag === 1"
                                        :label="ruleForm.signFormConfigFormatVO.honourFlag.fieldLabel"
                                        :prop="'signFormConfigFormatVO.honourFlag.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.honourFlag.requireFlag === 1 && validFlag === 1, message: '请选择' + ruleForm.signFormConfigFormatVO.honourFlag.fieldLabel, trigger: 'change' }
                                        ]"
                                    >
                                        <el-select
                                            v-model="ruleForm.signFormConfigFormatVO.honourFlag.fieldValue"
                                            :disabled="ruleForm.id != null && ruleForm.id != '' && ruleForm.signStatus !== 0 && ruleForm.signStatus !== 2"
                                            class="marginleftClass width360"
                                            :placeholder="'请选择' + ruleForm.signFormConfigFormatVO.honourFlag.fieldLabel"
                                        >
                                            <el-option key="1" label="主宾" value="1" />
                                            <el-option key="0" label="随员" value="0" />
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item
                                        v-for="(attendee, index) in ruleForm.linkAttendeeList"
                                        v-show="!(ruleForm.id === null || ruleForm.id === '' || ruleForm.signStatus === 0 || ruleForm.signStatus === 2)"
                                        :key="index"
                                        :label="ruleForm.signFormConfigFormatVO.honourFlag.fieldValue === '1'?('随员' + (index + 1)):'主宾'"
                                    >
                                        <el-input
                                            v-model="attendee.attendeeName"
                                            disabled
                                            class="marginleftClass width360"
                                        />
                                    </el-form-item>

                                    <el-form-item
                                        v-if="(ruleForm.id === null || ruleForm.id === '' || ruleForm.signStatus === 0 || ruleForm.signStatus === 2) && ruleForm.signFormConfigFormatVO.honourFlag.fieldValue === '0'"
                                        :prop="'signFormConfigFormatVO.honourId.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.honourFlag.fieldValue === '0', message: '请选择主宾', trigger: 'change' }
                                        ]"
                                        label="主宾"
                                    >
                                        <el-input
                                            v-model="honourName"
                                            disabled
                                            class="marginleftClass width360"
                                            style="width: 256px;"
                                        />
                                        <el-button
                                            class="tianjiahuiyizuzhiClass"
                                            size="small"
                                            type="primary"
                                            style="margin-top:5px;color:#1E89FF"
                                            @click="xuanzezhubin"
                                        >选择主宾</el-button>
                                        <el-input
                                            v-model="ruleForm.signFormConfigFormatVO.honourFlag.fieldValue"
                                            style="display:none;"
                                        />

                                    </el-form-item>

                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.photoUrl.showFlag === 1"
                                        :label="ruleForm.signFormConfigFormatVO.photoUrl.fieldLabel"
                                        :prop="'signFormConfigFormatVO.photoUrl.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.photoUrl.requireFlag === 1 && validFlag === 1, message: '请上传' + ruleForm.signFormConfigFormatVO.photoUrl.fieldLabel, trigger: 'change' }
                                        ]"
                                    >

                                        <el-upload
                                            class="upload-demo upload-remove-delete-text marginleftClass"
                                            :class="{hide:hideUploadEdit}"
                                            list-type="picture-card"
                                            name="files"
                                            :accept="ruleForm.signFormConfigFormatVO.photoUrl.signFormFieldRuleVO !== null ? formatAccept(ruleForm.signFormConfigFormatVO.photoUrl.signFormFieldRuleVO.accept) : ''"
                                            :headers="uploadHeader"
                                            :action="uploadUrl"
                                            :data="uploadData"
                                            :on-success="onSuccessImg"
                                            :on-remove="handleRemoveImg"
                                            :on-change="handleChange"
                                            :file-list="fileList"
                                            :before-upload="(file) => beforeUploadImg(file, ruleForm.signFormConfigFormatVO.photoUrl.signFormFieldRuleVO)"
                                            :on-exceed="onExceedImg"
                                        >
                                            <i class="el-icon-plus avatar-uploader-icon" />
                                            <div slot="file" slot-scope="{file}">
                                                <img
                                                    class="el-upload-list__item-thumbnail"
                                                    :src="file.url"
                                                    alt=""
                                                >
                                                <span class="el-upload-list__item-actions">
                                                    <span
                                                        class="el-upload-list__item-preview"
                                                        @click="handlePictureCardPreview(file)"
                                                    >
                                                        <i class="el-icon-view" />
                                                    </span>
                                                    <span
                                                        class="el-upload-list__item-delete"
                                                        @click="handleRemove(file)"
                                                    >
                                                        <i class="el-icon-delete" />
                                                    </span>
                                                </span>
                                            </div>
                                        </el-upload>

                                        <div
                                            class="_48OpacityClass marginleftClass"
                                            style="float:left;margin-top:5px;width:360px;white-space:normal;word-break:break-all;word-wrap:break-word;"
                                        >
                                            {{ ruleForm.signFormConfigFormatVO.photoUrl.signFormFieldRuleVO !== null ? ruleForm.signFormConfigFormatVO.photoUrl.signFormFieldRuleVO.titleMsessage : '' }}
                                            <!-- 格式可以是jpg/png，大小为20K～200K，35毫米×48毫米左右。相当于大一寸照片。 -->
                                        </div>
                                    </el-form-item>

                                    <el-form-item
                                        v-for="(item, index) in ruleForm.signFormConfigFormatVO.baseInfos"
                                        v-show="item.showFlag === 1"
                                        :key="item.id"
                                        :label="item.fieldLabel"
                                        :prop="'signFormConfigFormatVO.baseInfos.' + index + '.fieldValue'"
                                        :rules="[
                                            { required: item.requireFlag === 1, message: '请输入' + item.fieldLabel, trigger: item.type === 1 ? 'blur' : 'change' }
                                        ]"
                                    >
                                        <el-input
                                            v-if="item.type === 1"
                                            v-model="item.fieldValue"
                                            :maxlength="item.signFormFieldRuleVO.maxLength"
                                            show-word-limit
                                            class="marginleftClass width360 keepOutRight"
                                            :placeholder="item.signFormFieldRuleVO !== undefined && item.signFormFieldRuleVO !== null && item.signFormFieldRuleVO.titleMsessage !== null && item.signFormFieldRuleVO.titleMsessage !== '' ? item.signFormFieldRuleVO.titleMsessage : ('请输入' + item.fieldLabel)"
                                        />
                                        <ImgUpload
                                            v-if="item.type === 9"
                                            :old-file-list-str="item.fieldValue"
                                            :title-msessage="item.signFormFieldRuleVO !== undefined && item.signFormFieldRuleVO !== null && item.signFormFieldRuleVO.titleMsessage !== null && item.signFormFieldRuleVO.titleMsessage !== undefined ? item.signFormFieldRuleVO.titleMsessage : ''"
                                            :upload-count="item.signFormFieldRuleVO !== undefined && item.signFormFieldRuleVO !== null && item.signFormFieldRuleVO.uploadCount !== null && item.signFormFieldRuleVO.uploadCount !== undefined ? item.signFormFieldRuleVO.uploadCount : 1"
                                            :old-file-list="JSON.parse(item.fieldValue)"
                                            :field-index="index"
                                            :field-group="1"
                                            :max-val="item.signFormFieldRuleVO !== null ? item.signFormFieldRuleVO.maxVal : ''"
                                            :pic-max-height="item.signFormFieldRuleVO !== null ? item.signFormFieldRuleVO.picMaxHeight : ''"
                                            :pic-min-height="item.signFormFieldRuleVO !== null ? item.signFormFieldRuleVO.picMinHeight : ''"
                                            :pic-max-width="item.signFormFieldRuleVO !== null ? item.signFormFieldRuleVO.picMaxWidth : ''"
                                            :pic-min-width="item.signFormFieldRuleVO !== null ? item.signFormFieldRuleVO.picMinWidth : ''"
                                            :accept-file="item.signFormFieldRuleVO !== null ? formatAccept(item.signFormFieldRuleVO.accept) : ''"
                                            @addImg="addImg"
                                        />
                                        <attendee-select
                                            v-if="item.type === 8 || (item.type === 6 && item.signFormOptionVOs !== null && item.signFormOptionVOs.length > 2)"
                                            v-model="item.fieldValue"
                                            :placeholder="item.signFormFieldRuleVO !== undefined && item.signFormFieldRuleVO !== null && item.signFormFieldRuleVO.titleMsessage !== null && item.signFormFieldRuleVO.titleMsessage !== '' ? item.signFormFieldRuleVO.titleMsessage : ('请输入' + item.fieldLabel)"
                                            :options="item.signFormOptionVOs !== undefined && item.signFormOptionVOs !== null ? item.signFormOptionVOs : []"
                                        />

                                        <attendee-radio
                                            v-if="item.type === 6 && item.signFormOptionVOs !== null && item.signFormOptionVOs.length <= 2"
                                            v-model="item.fieldValue"
                                            :options="item.signFormOptionVOs !== undefined && item.signFormOptionVOs !== null ? item.signFormOptionVOs : []"
                                        />

                                        <attendee-check
                                            v-if="item.type === 7"
                                            v-model="item.fieldValue"
                                            :options="item.signFormOptionVOs !== undefined && item.signFormOptionVOs !== null ? item.signFormOptionVOs : []"
                                            @changgeCheck="changgeCheck('signFormConfigFormatVO.baseInfos.' + index + '.fieldValue')"
                                        />

                                        <FileUpload
                                            v-if="item.type === 10"
                                            :old-file-list-str="item.fieldValue"
                                            :title-msessage="item.signFormFieldRuleVO !== undefined && item.signFormFieldRuleVO !== null && item.signFormFieldRuleVO.titleMsessage !== null && item.signFormFieldRuleVO.titleMsessage !== undefined ? item.signFormFieldRuleVO.titleMsessage : ''"
                                            :upload-count="item.signFormFieldRuleVO !== undefined && item.signFormFieldRuleVO !== null && item.signFormFieldRuleVO.uploadCount !== null && item.signFormFieldRuleVO.uploadCount !== undefined ? item.signFormFieldRuleVO.uploadCount : 1"
                                            :old-file-list="JSON.parse(item.fieldValue)"
                                            :max-val="item.signFormFieldRuleVO !== null ? item.signFormFieldRuleVO.maxVal : ''"
                                            :accept-file="item.signFormFieldRuleVO !== null ? formatAccept(item.signFormFieldRuleVO.accept) : ''"
                                            :field-index="index"
                                            :field-group="1"
                                            @addImg="addImg"
                                        />

                                    </el-form-item>
                                    <el-form-item label="标签">
                                        <el-select
                                            v-model="ruleForm.tagIds"
                                            multiple
                                            placeholder="请选择标签"
                                            class="marginleftClass width360"
                                        >
                                            <el-option
                                                v-for="item in tags"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id"
                                            />
                                        </el-select>
                                    </el-form-item>

                                </el-scrollbar>
                            </el-form>
                        </div>
                    </el-tab-pane>
                    <el-form v-if="signConfig.setRouteFlag !== 1" ref="ruleForm1" :model="ruleForm" :rules="rules1" />
                    <el-tab-pane
                        v-if="signConfig.setRouteFlag === 1"
                        name="second"
                        style="padding-left:8px;padding-right:8px"
                    >
                        <span slot="label" style="margin-top:15px;font-size:16px">行程信息</span>
                        <div style="background-color:white;padding-top:8px">
                            <el-form
                                ref="ruleForm1"
                                :disabled="allFormDisabled"
                                class="conferenceFormClass"
                                :style="{'height': xingchengHeight,'overflow-x':'hidden','overflow-y':'auto', 'margin-top': '15px'}"
                                label-position="right"
                                label-width="27%"
                                :model="ruleForm"
                                :rules="rules1"
                            >
                                <el-scrollbar style="height:100%">
                                    <el-divider
                                        v-if="!(ruleForm.signFormConfigFormatVO.cardFlag.showFlag !== 1 && ruleForm.signFormConfigFormatVO.arriveTime.showFlag !== 1 && ruleForm.signFormConfigFormatVO.returnTime.showFlag !== 1 && ruleForm.signFormConfigFormatVO.bookDinnerFlag.showFlag !== 1 && ruleForm.signFormConfigFormatVO.bookStayFlag.showFlag !== 1 && ruleForm.signFormConfigFormatVO.bookTicketFlag.showFlag !== 1 && ruleForm.signFormConfigFormatVO.ticketFlag.showFlag !== 1) && (ruleForm.signFormConfigFormatVO.reserveServices === null || ruleForm.signFormConfigFormatVO.reserveServices.length === 0)"
                                    >
                                        会务安排</el-divider>

                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.arriveTime.showFlag === 1"
                                        :label="'到达日期'"
                                        :prop="'signFormConfigFormatVO.arriveTime.fieldValue'"
                                        :rules="[
                                            { required: (ruleForm.signFormConfigFormatVO.arriveTime.requireFlag == 1 || (ruleForm.arriveTime !== null && ruleForm.arriveTime !== '')) && validFlag === 1, message: '请选择' + ruleForm.signFormConfigFormatVO.arriveTime.fieldLabel, trigger: 'change' }
                                        ]"
                                    >
                                        <!-- ruleForm.signFormConfigFormatVO.arriveTime.fieldLabel -->
                                        <el-date-picker
                                            v-model="ruleForm.signFormConfigFormatVO.arriveTime.fieldValue"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            type="date"
                                            :placeholder="'请选择到达日期'"
                                            class="marginleftClass width360"
                                            :editable="false"
                                            @change="changeArriveDate"
                                        />
                                        <!-- @blur="getFlightStatusForJiezhan" -->
                                    </el-form-item>
                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.returnTime.showFlag === 1"
                                        :label="'返程日期'"
                                        :prop="'signFormConfigFormatVO.returnTime.fieldValue'"
                                        :rules="[
                                            { required: (ruleForm.signFormConfigFormatVO.returnTime.requireFlag === 1 || (ruleForm.returnTime !== null && ruleForm.returnTime !== '')) && validFlag === 1, message: '请选择' + ruleForm.signFormConfigFormatVO.returnTime.fieldLabel, trigger: 'change' }
                                        ]"
                                    >
                                        <el-date-picker
                                            v-model="ruleForm.signFormConfigFormatVO.returnTime.fieldValue"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            type="date"
                                            :placeholder="'请选择返程日期'"
                                            class="marginleftClass width360"
                                            :editable="false"
                                            @change="changeReturnDate"
                                        />
                                    </el-form-item>
                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.bookDinnerFlag.showFlag == 1"
                                        :label="ruleForm.signFormConfigFormatVO.bookDinnerFlag.fieldLabel"
                                        :prop="'signFormConfigFormatVO.bookDinnerFlag.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.bookDinnerFlag.requireFlag == 1 && validFlag === 1, message: '请选择' + ruleForm.signFormConfigFormatVO.bookDinnerFlag.fieldLabel, trigger: 'change' }
                                        ]"
                                    >
                                        <el-radio-group
                                            v-model="ruleForm.signFormConfigFormatVO.bookDinnerFlag.fieldValue"
                                            class="marginleftClass"
                                        >
                                            <el-radio label="1">是</el-radio>
                                            <el-radio label="0">否</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.bookStayFlag.showFlag == 1"
                                        :label="ruleForm.signFormConfigFormatVO.bookStayFlag.fieldLabel"
                                        :prop="'signFormConfigFormatVO.bookStayFlag.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.bookStayFlag.requireFlag == 1 && validFlag === 1, message: '请选择' + ruleForm.signFormConfigFormatVO.bookStayFlag.fieldLabel, trigger: 'change' }
                                        ]"
                                    >
                                        <el-radio-group
                                            v-model="ruleForm.signFormConfigFormatVO.bookStayFlag.fieldValue"
                                            class="marginleftClass"
                                        >
                                            <el-radio label="1">是</el-radio>
                                            <el-radio label="0">否</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.cardFlag.showFlag === 1"
                                        :label="ruleForm.signFormConfigFormatVO.cardFlag.fieldLabel"
                                        :prop="'signFormConfigFormatVO.cardFlag.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.cardFlag.requireFlag === 1 && validFlag === 1, message: '请选择' + ruleForm.signFormConfigFormatVO.cardFlag.fieldLabel, trigger: 'change' }
                                        ]"
                                    >
                                        <el-radio-group
                                            v-model="ruleForm.signFormConfigFormatVO.cardFlag.fieldValue"
                                            class="marginleftClass"
                                        >
                                            <el-radio label="1">是</el-radio>
                                            <el-radio label="0">否</el-radio>
                                        </el-radio-group>

                                    </el-form-item>
                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.bookTicketFlag.showFlag === 1"
                                        :label="ruleForm.signFormConfigFormatVO.bookTicketFlag.fieldLabel"
                                        :prop="'signFormConfigFormatVO.bookTicketFlag.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.bookTicketFlag.requireFlag == 1 && validFlag === 1, message: '请选择' + ruleForm.signFormConfigFormatVO.bookTicketFlag.fieldLabel, trigger: 'change' }
                                        ]"
                                    >
                                        <el-radio-group
                                            v-model="ruleForm.signFormConfigFormatVO.bookTicketFlag.fieldValue"
                                            class="marginleftClass"
                                        >
                                            <el-radio label="1">是</el-radio>
                                            <el-radio label="0">否</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.ticketFlag.showFlag === 1 && ruleForm.signFormConfigFormatVO.bookTicketFlag.fieldValue === '1'"
                                        :label="ruleForm.signFormConfigFormatVO.ticketFlag.fieldLabel"
                                        :prop="'signFormConfigFormatVO.ticketFlag.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.ticketFlag.requireFlag === 1 && validFlag === 1, message: '请选择' + ruleForm.signFormConfigFormatVO.ticketFlag.fieldLabel, trigger: 'change' }
                                        ]"
                                    >
                                        <el-radio-group
                                            v-model="ruleForm.signFormConfigFormatVO.ticketFlag.fieldValue"
                                            class="marginleftClass"
                                        >
                                            <el-radio label="1">去程</el-radio>
                                            <el-radio label="2">返程</el-radio>
                                            <el-radio label="3">往返</el-radio>
                                        </el-radio-group>
                                    </el-form-item>

                                    <el-form-item
                                        v-for="(item, index) in ruleForm.signFormConfigFormatVO.reserveServices"
                                        v-show="item.showFlag === 1"
                                        :key="item.id"
                                        :label="item.fieldLabel"
                                        :prop="'signFormConfigFormatVO.reserveServices.' + index + '.fieldValue'"
                                        :rules="[
                                            { required: item.requireFlag === 1, message: '请输入' + item.fieldLabel, trigger: item.type === 1 ? 'blur' : 'change' }
                                        ]"
                                    >
                                        <el-input
                                            v-if="item.type === 1"
                                            v-model="item.fieldValue"
                                            :maxlength="item.signFormFieldRuleVO.maxLength"
                                            show-word-limit
                                            class="marginleftClass width360 keepOutRight"
                                            :placeholder="item.signFormFieldRuleVO !== undefined && item.signFormFieldRuleVO !== null && item.signFormFieldRuleVO.titleMsessage !== null && item.signFormFieldRuleVO.titleMsessage !== '' ? item.signFormFieldRuleVO.titleMsessage : ('请输入' + item.fieldLabel)"
                                        />
                                        <ImgUpload
                                            v-if="item.type === 9"
                                            :title-msessage="item.signFormFieldRuleVO !== undefined && item.signFormFieldRuleVO !== null && item.signFormFieldRuleVO.titleMsessage !== null && item.signFormFieldRuleVO.titleMsessage !== undefined ? item.signFormFieldRuleVO.titleMsessage : ''"
                                            :upload-count="item.signFormFieldRuleVO !== undefined && item.signFormFieldRuleVO !== null && item.signFormFieldRuleVO.uploadCount !== null && item.signFormFieldRuleVO.uploadCount !== undefined ? item.signFormFieldRuleVO.uploadCount : 1"
                                            :old-file-list="JSON.parse(item.fieldValue)"
                                            :field-index="index"
                                            :field-group="2"
                                            :max-val="item.signFormFieldRuleVO !== null ? item.signFormFieldRuleVO.maxVal : ''"
                                            :pic-max-height="item.signFormFieldRuleVO !== null ? item.signFormFieldRuleVO.picMaxHeight : ''"
                                            :pic-min-height="item.signFormFieldRuleVO !== null ? item.signFormFieldRuleVO.picMinHeight : ''"
                                            :pic-max-width="item.signFormFieldRuleVO !== null ? item.signFormFieldRuleVO.picMaxWidth : ''"
                                            :pic-min-width="item.signFormFieldRuleVO !== null ? item.signFormFieldRuleVO.picMinWidth : ''"
                                            :accept-file="item.signFormFieldRuleVO !== null ? formatAccept(item.signFormFieldRuleVO.accept) : ''"
                                            @addImg="addImg"
                                        />
                                        <attendee-select
                                            v-if="item.type === 8 || (item.type === 6 && item.signFormOptionVOs !== null && item.signFormOptionVOs.length > 2)"
                                            v-model="item.fieldValue"
                                            :placeholder="item.signFormFieldRuleVO !== undefined && item.signFormFieldRuleVO !== null && item.signFormFieldRuleVO.titleMsessage !== null && item.signFormFieldRuleVO.titleMsessage !== '' ? item.signFormFieldRuleVO.titleMsessage : ('请输入' + item.fieldLabel)"
                                            :options="item.signFormOptionVOs !== undefined && item.signFormOptionVOs !== null ? item.signFormOptionVOs : []"
                                        />

                                        <attendee-radio
                                            v-if="item.type === 6 && item.signFormOptionVOs !== null && item.signFormOptionVOs.length <= 2"
                                            v-model="item.fieldValue"
                                            :options="item.signFormOptionVOs !== undefined && item.signFormOptionVOs !== null ? item.signFormOptionVOs : []"
                                        />

                                        <attendee-check
                                            v-if="item.type === 7"
                                            v-model="item.fieldValue"
                                            :options="item.signFormOptionVOs !== undefined && item.signFormOptionVOs !== null ? item.signFormOptionVOs : []"
                                            @changgeCheck="changgeCheck('signFormConfigFormatVO.reserveServices.' + index + '.fieldValue')"
                                        />

                                        <FileUpload
                                            v-if="item.type === 10"
                                            :old-file-list-str="item.fieldValue"
                                            :title-msessage="item.signFormFieldRuleVO !== undefined && item.signFormFieldRuleVO !== null && item.signFormFieldRuleVO.titleMsessage !== null && item.signFormFieldRuleVO.titleMsessage !== undefined ? item.signFormFieldRuleVO.titleMsessage : ''"
                                            :upload-count="item.signFormFieldRuleVO !== undefined && item.signFormFieldRuleVO !== null && item.signFormFieldRuleVO.uploadCount !== null && item.signFormFieldRuleVO.uploadCount !== undefined ? item.signFormFieldRuleVO.uploadCount : 1"
                                            :old-file-list="JSON.parse(item.fieldValue)"
                                            :field-index="index"
                                            :field-group="2"
                                            :max-val="item.signFormFieldRuleVO !== null ? item.signFormFieldRuleVO.maxVal : ''"
                                            :accept-file="item.signFormFieldRuleVO !== null ? formatAccept(item.signFormFieldRuleVO.accept) : ''"
                                            @addImg="addImg"
                                        />
                                    </el-form-item>

                                    <el-divider
                                        v-if="!(ruleForm.signFormConfigFormatVO.pickUpFlag.showFlag !== 1&&ruleForm.signFormConfigFormatVO.arriveTime.showFlag !== 1&&ruleForm.signFormConfigFormatVO.arriveFlight.showFlag !== 1&&ruleForm.signFormConfigFormatVO.arriveStation.showFlag !== 1 && (ruleForm.signFormConfigFormatVO.pickUpServices === null || ruleForm.signFormConfigFormatVO.pickUpServices.length === 0))"
                                    >
                                        来程信息</el-divider>
                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.pickUpFlag.showFlag === 1"
                                        :label="ruleForm.signFormConfigFormatVO.pickUpFlag.fieldLabel"
                                        :prop="'signFormConfigFormatVO.pickUpFlag.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.pickUpFlag.requireFlag === 1 && validFlag === 1, message: '请选择' + ruleForm.signFormConfigFormatVO.pickUpFlag.fieldLabel, trigger: 'change' }
                                        ]"
                                    >
                                        <el-radio-group
                                            v-model="ruleForm.signFormConfigFormatVO.pickUpFlag.fieldValue"
                                            class="marginleftClass"
                                        >
                                            <el-radio label="1">是</el-radio>
                                            <el-radio label="0">否</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.arriveFlight.showFlag === 1"
                                        :label="ruleForm.signFormConfigFormatVO.arriveFlight.fieldLabel"
                                        :prop="'signFormConfigFormatVO.arriveFlight.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.arriveFlight.requireFlag === 1 && validFlag === 1, message: '请输入' + ruleForm.signFormConfigFormatVO.arriveFlight.fieldLabel, trigger: 'blur' }
                                        ]"
                                    >
                                        <el-input
                                            v-model="ruleForm.signFormConfigFormatVO.arriveFlight.fieldValue"
                                            maxlength="20"
                                            show-word-limit
                                            :placeholder="'请输入' + ruleForm.signFormConfigFormatVO.arriveFlight.fieldLabel"
                                            class="marginleftClass width360 keepOutRight"
                                            @input="ruleForm.signFormConfigFormatVO.arriveFlight.fieldValue = ruleForm.signFormConfigFormatVO.arriveFlight.fieldValue.toUpperCase()"
                                            @blur="getFlightStatusForJiezhan"
                                        />
                                    </el-form-item>
                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.arriveTime.showFlag === 1"
                                        prop="arriveTime"
                                        :label="'到达时间'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.arriveTime.requireFlag == 1 && validFlag === 1, message: '请选择到达时间', trigger: 'change' }
                                        ]"
                                    >
                                        <el-time-picker
                                            v-model="ruleForm.arriveTime"
                                            class="marginleftClass width360"
                                            placeholder="到达时间"
                                            format="HH:mm"
                                            value-format="HH:mm"
                                            :picker-options="{
                                                start: '00:00',
                                                step: '00:01',
                                                end: '24:00',
                                            }"
                                            @change="changeArriveTime"
                                        />
                                    </el-form-item>
                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.arriveStation.showFlag === 1"
                                        :label="ruleForm.signFormConfigFormatVO.arriveStation.fieldLabel"
                                        :prop="'signFormConfigFormatVO.arriveStation.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.arriveStation.requireFlag === 1 && validFlag === 1, message: '请输入' + ruleForm.signFormConfigFormatVO.arriveStation.fieldLabel, trigger: 'blur' }
                                        ]"
                                    >
                                        <el-autocomplete
                                            v-model="ruleForm.signFormConfigFormatVO.arriveStation.fieldValue"
                                            :maxlength="20"
                                            show-word-limit
                                            :fetch-suggestions="querySearchAsync"
                                            :placeholder="'请输入' + ruleForm.signFormConfigFormatVO.arriveStation.fieldLabel"
                                            class="marginleftClass width360 keepOutRight"
                                            @select="handleSelect"
                                        />

                                        <!-- <el-input
                                            v-model="ruleForm.signFormConfigFormatVO.arriveStation.fieldValue"
                                            maxlength="20"
                                            show-word-limit
                                            :placeholder="'请输入' + ruleForm.signFormConfigFormatVO.arriveStation.fieldLabel"
                                            class="marginleftClass width360"
                                        /> -->
                                    </el-form-item>

                                    <el-form-item
                                        v-for="(item, index) in ruleForm.signFormConfigFormatVO.pickUpServices"
                                        v-show="item.showFlag === 1"
                                        :key="item.id"
                                        :label="item.fieldLabel"
                                        :prop="'signFormConfigFormatVO.pickUpServices.' + index + '.fieldValue'"
                                        :rules="[
                                            { required: item.requireFlag === 1, message: '请输入' + item.fieldLabel, trigger: item.type === 1 ? 'blur' : 'change' }
                                        ]"
                                    >
                                        <el-input
                                            v-if="item.type === 1"
                                            v-model="item.fieldValue"
                                            :maxlength="item.signFormFieldRuleVO.maxLength"
                                            show-word-limit
                                            class="marginleftClass width360 keepOutRight"
                                            :placeholder="item.signFormFieldRuleVO !== undefined && item.signFormFieldRuleVO !== null && item.signFormFieldRuleVO.titleMsessage !== null && item.signFormFieldRuleVO.titleMsessage !== '' ? item.signFormFieldRuleVO.titleMsessage : ('请输入' + item.fieldLabel)"
                                        />
                                        <ImgUpload
                                            v-if="item.type === 9"
                                            :title-msessage="item.signFormFieldRuleVO !== undefined && item.signFormFieldRuleVO !== null && item.signFormFieldRuleVO.titleMsessage !== null && item.signFormFieldRuleVO.titleMsessage !== undefined ? item.signFormFieldRuleVO.titleMsessage : ''"
                                            :upload-count="item.signFormFieldRuleVO !== undefined && item.signFormFieldRuleVO !== null && item.signFormFieldRuleVO.uploadCount !== null && item.signFormFieldRuleVO.uploadCount !== undefined ? item.signFormFieldRuleVO.uploadCount : 1"
                                            :old-file-list="JSON.parse(item.fieldValue)"
                                            :field-index="index"
                                            :field-group="3"
                                            :max-val="item.signFormFieldRuleVO !== null ? item.signFormFieldRuleVO.maxVal : ''"
                                            :pic-max-height="item.signFormFieldRuleVO !== null ? item.signFormFieldRuleVO.picMaxHeight : ''"
                                            :pic-min-height="item.signFormFieldRuleVO !== null ? item.signFormFieldRuleVO.picMinHeight : ''"
                                            :pic-max-width="item.signFormFieldRuleVO !== null ? item.signFormFieldRuleVO.picMaxWidth : ''"
                                            :pic-min-width="item.signFormFieldRuleVO !== null ? item.signFormFieldRuleVO.picMinWidth : ''"
                                            :accept-file="item.signFormFieldRuleVO !== null ? formatAccept(item.signFormFieldRuleVO.accept) : ''"
                                            @addImg="addImg"
                                        />

                                        <attendee-select
                                            v-if="item.type === 8 || (item.type === 6 && item.signFormOptionVOs !== null && item.signFormOptionVOs.length > 2)"
                                            v-model="item.fieldValue"
                                            :placeholder="item.signFormFieldRuleVO !== undefined && item.signFormFieldRuleVO !== null && item.signFormFieldRuleVO.titleMsessage !== null && item.signFormFieldRuleVO.titleMsessage !== '' ? item.signFormFieldRuleVO.titleMsessage : ('请输入' + item.fieldLabel)"
                                            :options="item.signFormOptionVOs !== undefined && item.signFormOptionVOs !== null ? item.signFormOptionVOs : []"
                                        />

                                        <attendee-radio
                                            v-if="item.type === 6 && item.signFormOptionVOs !== null && item.signFormOptionVOs.length <= 2"
                                            v-model="item.fieldValue"
                                            :options="item.signFormOptionVOs !== undefined && item.signFormOptionVOs !== null ? item.signFormOptionVOs : []"
                                        />

                                        <attendee-check
                                            v-if="item.type === 7"
                                            v-model="item.fieldValue"
                                            :options="item.signFormOptionVOs !== undefined && item.signFormOptionVOs !== null ? item.signFormOptionVOs : []"
                                            @changgeCheck="changgeCheck('signFormConfigFormatVO.pickUpServices.' + index + '.fieldValue')"
                                        />

                                        <FileUpload
                                            v-if="item.type === 10"
                                            :old-file-list-str="item.fieldValue"
                                            :title-msessage="item.signFormFieldRuleVO !== undefined && item.signFormFieldRuleVO !== null && item.signFormFieldRuleVO.titleMsessage !== null && item.signFormFieldRuleVO.titleMsessage !== undefined ? item.signFormFieldRuleVO.titleMsessage : ''"
                                            :upload-count="item.signFormFieldRuleVO !== undefined && item.signFormFieldRuleVO !== null && item.signFormFieldRuleVO.uploadCount !== null && item.signFormFieldRuleVO.uploadCount !== undefined ? item.signFormFieldRuleVO.uploadCount : 1"
                                            :old-file-list="JSON.parse(item.fieldValue)"
                                            :field-index="index"
                                            :field-group="3"
                                            :max-val="item.signFormFieldRuleVO !== null ? item.signFormFieldRuleVO.maxVal : ''"
                                            :accept-file="item.signFormFieldRuleVO !== null ? formatAccept(item.signFormFieldRuleVO.accept) : ''"
                                            @addImg="addImg"
                                        />
                                    </el-form-item>

                                    <el-divider
                                        v-if="!(ruleForm.signFormConfigFormatVO.pickOutFlag.showFlag !== 1 && ruleForm.signFormConfigFormatVO.returnTime.showFlag !== 1 && ruleForm.signFormConfigFormatVO.returnFlight.showFlag !== 1 && ruleForm.signFormConfigFormatVO.returnStation.showFlag !== 1 && (ruleForm.signFormConfigFormatVO.pickOutServices === null || ruleForm.signFormConfigFormatVO.pickOutServices.length === 0))"
                                    >
                                        返程信息</el-divider>
                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.pickOutFlag.showFlag === 1"
                                        :label="ruleForm.signFormConfigFormatVO.pickOutFlag.fieldLabel"
                                        :prop="'signFormConfigFormatVO.pickOutFlag.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.pickOutFlag.requireFlag === 1 && validFlag === 1, message: '请选择' + ruleForm.signFormConfigFormatVO.pickOutFlag.fieldLabel, trigger: 'change' }
                                        ]"
                                    >
                                        <el-radio-group
                                            v-model="ruleForm.signFormConfigFormatVO.pickOutFlag.fieldValue"
                                            class="marginleftClass"
                                        >
                                            <el-radio label="1">是</el-radio>
                                            <el-radio label="0">否</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.returnFlight.showFlag === 1"
                                        :label="ruleForm.signFormConfigFormatVO.returnFlight.fieldLabel"
                                        :prop="'signFormConfigFormatVO.returnFlight.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.returnFlight.requireFlag === 1 && validFlag === 1, message: '请输入' + ruleForm.signFormConfigFormatVO.returnFlight.fieldLabel, trigger: 'blur' }
                                        ]"
                                    >
                                        <el-input
                                            v-model="ruleForm.signFormConfigFormatVO.returnFlight.fieldValue"
                                            maxlength="20"
                                            show-word-limit
                                            :placeholder="'请输入' + ruleForm.signFormConfigFormatVO.returnFlight.fieldLabel"
                                            class="marginleftClass width360 keepOutRight"
                                            @input="ruleForm.signFormConfigFormatVO.returnFlight.fieldValue = ruleForm.signFormConfigFormatVO.returnFlight.fieldValue.toUpperCase()"
                                            @blur="getFlightStatusForSongzhan"
                                        />
                                    </el-form-item>
                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.returnTime.showFlag === 1"
                                        :label="'返程时间'"
                                        prop="returnTime"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.returnTime.requireFlag == 1 && validFlag === 1, message: '请选择返程时间', trigger: 'change' }
                                        ]"
                                    >

                                        <el-time-picker
                                            v-model="ruleForm.returnTime"
                                            class="marginleftClass width360"
                                            placeholder="返程时间"
                                            format="HH:mm"
                                            value-format="HH:mm"
                                            :picker-options="{
                                                start: '00:00',
                                                step: '00:01',
                                                end: '24:00',
                                            }"
                                            @change="changeReturnTime"
                                        />
                                    </el-form-item>
                                    <el-form-item
                                        v-show="ruleForm.signFormConfigFormatVO.returnStation.showFlag === 1"
                                        :label="ruleForm.signFormConfigFormatVO.returnStation.fieldLabel"
                                        :prop="'signFormConfigFormatVO.returnStation.fieldValue'"
                                        :rules="[
                                            { required: ruleForm.signFormConfigFormatVO.returnStation.requireFlag === 1 && validFlag === 1, message: '请输入' + ruleForm.signFormConfigFormatVO.returnStation.fieldLabel, trigger: 'blur' }
                                        ]"
                                    >
                                        <el-autocomplete
                                            v-model="ruleForm.signFormConfigFormatVO.returnStation.fieldValue"
                                            :maxlength="20"
                                            show-word-limit
                                            :fetch-suggestions="querySearchAsync"
                                            :placeholder="'请输入' + ruleForm.signFormConfigFormatVO.returnStation.fieldLabel"
                                            class="marginleftClass width360 keepOutRight"
                                            @select="handleSelect"
                                        />
                                        <!-- <el-input
                                            v-model="ruleForm.signFormConfigFormatVO.returnStation.fieldValue"
                                            maxlength="20"
                                            show-word-limit
                                            :placeholder="'请输入' + ruleForm.signFormConfigFormatVO.returnStation.fieldLabel"
                                            class="marginleftClass width360"
                                        /> -->
                                    </el-form-item>

                                    <el-form-item
                                        v-for="(item, index) in ruleForm.signFormConfigFormatVO.pickOutServices"
                                        v-show="item.showFlag === 1"
                                        :key="item.id"
                                        :label="item.fieldLabel"
                                        :prop="'signFormConfigFormatVO.pickOutServices.' + index + '.fieldValue'"
                                        :rules="[
                                            { required: item.requireFlag === 1, message: '请输入' + item.fieldLabel, trigger: item.type === 1 ? 'blur' : 'change' }
                                        ]"
                                    >
                                        <el-input
                                            v-if="item.type === 1"
                                            v-model="item.fieldValue"
                                            :maxlength="item.signFormFieldRuleVO.maxLength"
                                            show-word-limit
                                            class="marginleftClass width360 keepOutRight"
                                            :placeholder="item.signFormFieldRuleVO !== undefined && item.signFormFieldRuleVO !== null && item.signFormFieldRuleVO.titleMsessage !== null && item.signFormFieldRuleVO.titleMsessage !== '' ? item.signFormFieldRuleVO.titleMsessage : ('请输入' + item.fieldLabel)"
                                        />
                                        <ImgUpload
                                            v-if="item.type === 9"
                                            :title-msessage="item.signFormFieldRuleVO !== undefined && item.signFormFieldRuleVO !== null && item.signFormFieldRuleVO.titleMsessage !== null && item.signFormFieldRuleVO.titleMsessage !== undefined ? item.signFormFieldRuleVO.titleMsessage : ''"
                                            :upload-count="item.signFormFieldRuleVO !== undefined && item.signFormFieldRuleVO !== null && item.signFormFieldRuleVO.uploadCount !== null && item.signFormFieldRuleVO.uploadCount !== undefined ? item.signFormFieldRuleVO.uploadCount : 1"
                                            :old-file-list="JSON.parse(item.fieldValue)"
                                            :field-index="index"
                                            :field-group="4"
                                            :max-val="item.signFormFieldRuleVO !== null ? item.signFormFieldRuleVO.maxVal : ''"
                                            :pic-max-height="item.signFormFieldRuleVO !== null ? item.signFormFieldRuleVO.picMaxHeight : ''"
                                            :pic-min-height="item.signFormFieldRuleVO !== null ? item.signFormFieldRuleVO.picMinHeight : ''"
                                            :pic-max-width="item.signFormFieldRuleVO !== null ? item.signFormFieldRuleVO.picMaxWidth : ''"
                                            :pic-min-width="item.signFormFieldRuleVO !== null ? item.signFormFieldRuleVO.picMinWidth : ''"
                                            :accept-file="item.signFormFieldRuleVO !== null ? formatAccept(item.signFormFieldRuleVO.accept) : ''"
                                            @addImg="addImg"
                                        />

                                        <attendee-select
                                            v-if="item.type === 8 || (item.type === 6 && item.signFormOptionVOs !== null && item.signFormOptionVOs.length > 2)"
                                            v-model="item.fieldValue"
                                            :placeholder="item.signFormFieldRuleVO !== undefined && item.signFormFieldRuleVO !== null && item.signFormFieldRuleVO.titleMsessage !== null && item.signFormFieldRuleVO.titleMsessage !== '' ? item.signFormFieldRuleVO.titleMsessage : ('请输入' + item.fieldLabel)"
                                            :options="item.signFormOptionVOs !== undefined && item.signFormOptionVOs !== null ? item.signFormOptionVOs : []"
                                        />

                                        <attendee-radio
                                            v-if="item.type === 6 && item.signFormOptionVOs !== null && item.signFormOptionVOs.length <= 2"
                                            v-model="item.fieldValue"
                                            :options="item.signFormOptionVOs !== undefined && item.signFormOptionVOs !== null ? item.signFormOptionVOs : []"
                                        />

                                        <attendee-check
                                            v-if="item.type === 7"
                                            v-model="item.fieldValue"
                                            :options="item.signFormOptionVOs !== undefined && item.signFormOptionVOs !== null ? item.signFormOptionVOs : []"
                                            @changgeCheck="changgeCheck('signFormConfigFormatVO.pickOutServices.' + index + '.fieldValue')"
                                        />

                                        <FileUpload
                                            v-if="item.type === 10"
                                            :old-file-list-str="item.fieldValue"
                                            :title-msessage="item.signFormFieldRuleVO !== undefined && item.signFormFieldRuleVO !== null && item.signFormFieldRuleVO.titleMsessage !== null && item.signFormFieldRuleVO.titleMsessage !== undefined ? item.signFormFieldRuleVO.titleMsessage : ''"
                                            :upload-count="item.signFormFieldRuleVO !== undefined && item.signFormFieldRuleVO !== null && item.signFormFieldRuleVO.uploadCount !== null && item.signFormFieldRuleVO.uploadCount !== undefined ? item.signFormFieldRuleVO.uploadCount : 1"
                                            :old-file-list="JSON.parse(item.fieldValue)"
                                            :field-index="index"
                                            :field-group="4"
                                            :max-val="item.signFormFieldRuleVO !== null ? item.signFormFieldRuleVO.maxVal : ''"
                                            :accept-file="item.signFormFieldRuleVO !== null ? formatAccept(item.signFormFieldRuleVO.accept) : ''"
                                            @addImg="addImg"
                                        />
                                    </el-form-item>

                                </el-scrollbar>
                            </el-form>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane
                        v-if="conferenceView.setAgendaFlag === 1"
                        name="third"
                        style="padding-left:8px;padding-right:8px;height:100%"
                    >
                        <span
                            slot="label"
                            style="margin-top:15px;font-size:16px"
                        >{{ getConferenceTemplate(1) }}议程</span>
                        <div style="background-color:white;width:100%">
                            <div
                                v-show="agendas !== null && agendas.length > 0"
                                style="margin-left:10%;width:50%;padding-top:10px;"
                            >
                                <span style="padding-top:25px;color:#191F24">全部议程</span>
                                <span style="color:#191F24;float:right">选择参加议程</span>
                                <!-- <el-button type="text" style="margin-left:5px;font-size:16px;color:#191F24">全部议程</el-button> -->
                            </div>
                            <div
                                v-show="agendas !== null && agendas.length > 0"
                                :style="{'height':paneHeight,'overflow-x':'hidden','overflow-y':'auto', 'padding-bottom': '10px'}"
                            >
                                <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                                    <el-tree
                                        ref="tree"
                                        style="margin-left:10%;margin-top:10px;width:50%;"
                                        :data="agendas"
                                        :props="defaultProps"
                                        default-expand-all
                                        :filter-node-method="filterNode"
                                        :expand-on-click-node="false"
                                        :render-content="renderContent"
                                    />
                                </el-scrollbar>
                            </div>
                            <div v-show="!(agendas !== null && agendas.length > 0)" :style="{'text-align':'center', 'height':paneHeight}">
                                <div style="padding-top:160px;"><img src="@/assets/tree-no-data.png"></div>
                                <div
                                    style="margin-left:-12px;margin-top:20px;font-size: 14px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.48);line-height: 18px;"
                                >
                                    暂无数据</div>
                            </div>
                            <div v-show="!(agendas !== null && agendas.length > 0)" style="height: 30px;width: 100%" />
                        </div>
                    </el-tab-pane>
                    <el-tab-pane
                        v-if="false"
                        v-show="this.$route.params.id !== null && this.$route.params.id !== '0'"
                        name="fourth"
                        style="padding-left:8px;padding-right:8px"
                        :disabled="ruleForm.externalVisibaleFlag === 0"
                    >
                        <span slot="label" style="margin-top:15px;font-size:16px">资源分配</span>
                        <ResourceView
                            v-show="activeNameSignup === 'fourth'"
                            :table-height="xingchengHeight"
                            :attendee-id="this.$route.params.id"
                        />
                    </el-tab-pane>
                </el-tabs>
            </el-col>
            <el-col
                v-show="ruleForm.id !== null && ruleForm.id !== '' && ruleForm.signStatus !== 0"
                class="biangengjiluClass"
                :span="7"
                style="background-color: rgba(25, 31, 36, 0.04);"
            >
                <div
                    style="padding-left:5px;color: #191F24;font-size:17px;padding-top:10px;width:100%;height:39px;background-color:#FFFFFF;border-bottom: solid rgba(25, 31, 36, 0.08) 1px;"
                />
                <!-- border-left: solid rgba(25, 31, 36, 0.08) 1px -->
                <div
                    class="logTypeDiv"
                    :style="{'height': yichengHeight,'overflow-x':'hidden','overflow-y':'auto','background-color': 'rgba(25, 31, 36, 0)'}"
                    style=""
                >
                    <el-tabs v-model="activeNameLog" :stretch="true" type="card">
                        <!-- <el-tab-pane name="zhizhengjilu" :style="{'height': logHeight,'overflow-x':'hidden','overflow-y':'auto', 'padding-left': '8px', 'padding-right': '8px'}">
                            <span slot="label" style="margin-top:15px;font-size:16px;">制证记录</span>
                            <el-scrollbar style="height:100%;padding-top:10px">
                                制证记录
                            </el-scrollbar>
                        </el-tab-pane> -->
                        <!-- <el-tab-pane
                            name="yongchejilu"
                            :style="{'height': logHeight,'overflow-x':'hidden','overflow-y':'auto', 'padding-left': '8px', 'padding-right': '8px'}"
                        >
                            <span slot="label" style="margin-top:15px;font-size:16px;">用车记录</span>
                            <el-scrollbar style="height:100%;padding-top:10px">
                                用车记录
                            </el-scrollbar>
                        </el-tab-pane> -->
                        <el-tab-pane
                            name="caozuojilu"
                            :style="{'height': logHeight,'overflow-x':'hidden','overflow-y':'auto', 'padding-left': '8px', 'padding-right': '8px'}"
                        >
                            <span slot="label" style="margin-top:15px;font-size:16px;">操作记录</span>
                            <el-scrollbar style="height:100%;padding-top:10px">
                                <el-timeline>
                                    <el-timeline-item
                                        v-for="item in logData"
                                        :key="item.id"
                                        :timestamp="item.createTime"
                                        placement="top"
                                    >
                                        <el-card>
                                            <div slot="header" class="clearfix">
                                                <div class="titleClass">
                                                    [{{ item.title }}{{ item.bizResultStr !== null && item.bizResultStr !== '' ? ('-' + item.bizResultStr) : '' }}]
                                                </div>
                                                <!-- {{ formatLogContent(item.changeContent) }} -->
                                                <div
                                                    v-for="itemSub in formatLogContent(item.changeContent)"
                                                    :key="itemSub.code"
                                                    class="contentClass"
                                                >
                                                    <div
                                                        v-if="itemSub.type === 9"
                                                    >

                                                        {{ itemSub.attribute }}变更，
                                                        由“
                                                        <span v-show="formatPicChangeContent(itemSub.beforeValue).length === 0">
                                                            无
                                                        </span>
                                                        <span
                                                            v-for="(pic, index) in formatPicChangeContent(itemSub.beforeValue)"
                                                            :key="'pic' + index"
                                                        >
                                                            <el-image
                                                                style="width:13px;height:13px;border-radius:50%;margin-top:2px"
                                                                :src="pic.fileUrl"
                                                                :preview-src-list="[ viewPicUrl ]"
                                                                @click="event => clickPic(event, pic)"
                                                                @error.once="event => getPicFilePath(event, pic)"
                                                            />
                                                            <!-- <el-link
                                                                :underline="false"
                                                                type="info"
                                                                @click="chakanzhaopianxiangqing(pic.fileUrl)"
                                                            >
                                                                {{ pic.fileName }}</el-link>{{ index !== formatPicChangeContent(itemSub.beforeValue).length - 1 ? ',' : '' }} -->
                                                        </span>
                                                        ”变更为

                                                        “
                                                        <span v-show="formatPicChangeContent(itemSub.afterValue).length === 0">
                                                            无
                                                        </span>
                                                        <span
                                                            v-for="(pic, index) in formatPicChangeContent(itemSub.afterValue)"
                                                            :key="'pic' + index"
                                                        >
                                                            <el-image
                                                                style="width:13px;height:13px;border-radius:50%;margin-top:2px"
                                                                :src="pic.fileUrl"
                                                                :preview-src-list="[ viewPicUrl ]"
                                                                @click="event => clickPic(event, pic)"
                                                                @error.once="event => getPicFilePath(event, pic)"
                                                            />
                                                        </span>
                                                        ”
                                                    </div>
                                                    <div
                                                        v-if="itemSub.type === 10"
                                                    >

                                                        {{ itemSub.attribute }}变更，
                                                        由“
                                                        <span v-show="formatPicChangeContent(itemSub.beforeValue).length === 0">
                                                            无
                                                        </span>
                                                        <span
                                                            v-for="(pic, index) in formatPicChangeContent(itemSub.beforeValue)"
                                                            :key="'pic' + index"
                                                        >
                                                            <el-link
                                                                :underline="false"
                                                                type="info"
                                                                @click="chakanzhaopianxiangqing(pic.fileUrl)"
                                                            >
                                                                [{{ pic.fileName }}]</el-link>{{ index !== formatPicChangeContent(itemSub.beforeValue).length - 1 ? ',' : '' }}
                                                        </span>
                                                        ”变更为

                                                        “
                                                        <span v-show="formatPicChangeContent(itemSub.afterValue).length === 0">
                                                            无
                                                        </span>
                                                        <span
                                                            v-for="(pic, index) in formatPicChangeContent(itemSub.afterValue)"
                                                            :key="'pic' + index"
                                                        >
                                                            <el-link
                                                                :underline="false"
                                                                type="info"
                                                                @click="chakanzhaopianxiangqing(pic.fileUrl)"
                                                            >
                                                                [{{ pic.fileName }}]</el-link>{{ index !== formatPicChangeContent(itemSub.afterValue).length - 1 ? ',' : '' }}
                                                        </span>
                                                        ”
                                                    </div>
                                                    <div
                                                        v-show="itemSub.type !== 9 && itemSub.type !== 10 && itemSub.code !== 'photoUrl' && itemSub.code !== 'agenda'"
                                                    >
                                                        {{ itemSub.attribute }}变更，
                                                        由“{{ itemSub.beforeValue !== null && itemSub.beforeValue !== '' ? itemSub.beforeValue : '无' }}”
                                                        变更为“{{ itemSub.afterValue !== null && itemSub.afterValue !== '' ? itemSub.afterValue : '无' }}”
                                                    </div>
                                                    <div v-show="itemSub.type !== 9 && itemSub.type !== 10 && itemSub.code === 'photoUrl'">
                                                        {{ itemSub.attribute }}有变更
                                                        <el-link
                                                            :underline="false"
                                                            type="info"
                                                            @click="chakanzhaopianxiangqing(itemSub.afterValue)"
                                                        >
                                                            详情</el-link>
                                                    </div>
                                                    <div v-if="itemSub.code === 'agenda'">
                                                        {{ formatAgenda(itemSub.beforeValue, itemSub.afterValue) }}
                                                    </div>
                                                </div>
                                                <div
                                                    v-show="item.eventRemark !== undefined &&item.eventRemark !== null && item.eventRemark !== ''"
                                                    style=" margin-top:16px;"
                                                ><span
                                                    class="remarkTitleClass"
                                                >备注：</span><span
                                                    class="remarkClass"
                                                >{{ item.eventRemark }} </span></div>
                                            </div>
                                            <div v-if="item.createUserInnerFlag === 1 || item.createUserInnerFlag === null" style="height:30px;padding-bottom:5px;padding-top:5px;">
                                                <img
                                                    style="float:left;height:22px;width:22px;border-radius:50%"
                                                    :src="item.createSsoUserPhoto !== null && item.createSsoUserPhoto !== '' ? item.createSsoUserPhoto : (item.createUserSex === null || item.createUserSex === '' ? require('@/assets/male.png') : (item.createUserSex === '1' || item.createUserSex === 1) ? require('@/assets/male.png') : require('@/assets/female.png'))"
                                                >
                                                <span
                                                    class="nameClass"
                                                    style="float:left;margin-left:12px;"
                                                >{{ item.createUserName }}
                                                    <el-divider
                                                        v-if="item.createOrganizationName !== null && item.createOrganizationName !== ''"
                                                        direction="vertical"
                                                    />
                                                    {{ item.createOrganizationName }}
                                                </span>
                                            </div>
                                            <div v-else style="height:30px;padding-bottom:5px;padding-top:5px;">
                                                <img
                                                    style="float:left;height:22px;width:22px;border-radius:50%"
                                                    :src="item.createSsoUserPhoto !== null && item.createSsoUserPhoto !== '' ? item.createSsoUserPhoto : (item.createUserSex === null || item.createUserSex === '' ? require('@/assets/male.png') : (item.createUserSex === '1' || item.createUserSex === 1) ? require('@/assets/male.png') : require('@/assets/female.png'))"
                                                >
                                                <span
                                                    class="nameClass"
                                                    style="float:left;margin-left:12px;"
                                                >{{ item.createUserPhone }} （非商网用户）
                                                    <el-divider
                                                        v-if="item.createOrganizationName !== null && item.createOrganizationName !== ''"
                                                        direction="vertical"
                                                    />
                                                    {{ item.createOrganizationName }}
                                                </span>
                                            </div>
                                        </el-card>
                                    </el-timeline-item>
                                </el-timeline>
                            </el-scrollbar>
                        </el-tab-pane>
                        <el-tab-pane
                            name="oaShenhejilu"
                            :style="{'height': logHeight,'overflow-x':'hidden','overflow-y':'auto', 'padding-left': '8px', 'padding-right': '8px'}"
                        >
                            <span slot="label" style="margin-top:15px;font-size:16px;">OA审核记录</span>
                            <el-scrollbar style="height:100%;padding-top:10px;">
                                <el-card
                                    v-for="oaFlow in oaFlowLogs"
                                    :key="oaFlow.id"
                                    class="box-card"
                                    style="margin-top:5px;margin-right:10px"
                                >
                                    <div slot="header" class="clearfix">
                                        <span>{{ oaFlow.oaFlowInstTitle }}</span>
                                    </div>
                                    <el-timeline style="margin-top:10px">
                                        <el-timeline-item
                                            v-for="item in oaFlow.oaFlowLogs"
                                            :key="item.fdId"
                                            :timestamp="item.fdReceiveTime"
                                            placement="top"
                                        >
                                            <el-card>
                                                <h4>{{ item.fdFactNodeName }}</h4>
                                                <div style="height:40px;">
                                                    <!-- <img style="float:left;height:30px;width:30px;border-radius:50%" src="http://sw-huiwu-test.oss-cn-beijing.aliyuncs.com/120/attendeePhoto/微信图片_202009291734281603244181686.jpg"> -->
                                                    <span style="float:left;margin-left:10px;margin-top:5px">
                                                        {{ item.fdName }}
                                                        <!-- {{ item.fdFactNodeName !== null && item.fdFactNodeName !== '' ? ('-' + item.fdFactNodeName) : '' }} -->
                                                        {{ item.fdActionInfo !== null && item.fdActionInfo !== '' ? ('-' + item.fdActionInfo) : '' }}
                                                    </span>

                                                </div>
                                                <!-- <div v-show="item.fdAuditNote !== null && item.fdAuditNote !== ''" style="height:40px;">
                                                    <span style="float:left;margin-left:10px;margin-top:5px">
                                                        {{ item.fdAuditNote }}
                                                    </span>
                                                </div> -->
                                            </el-card>
                                        </el-timeline-item>
                                    </el-timeline>
                                </el-card>
                            </el-scrollbar>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-col>
        </el-row>
        <div
            style="height:60px;border-top:solid 1px #EEF0F4;text-align:center;position:sticky;background-color:white;box-shadow: 0px 1px 0px 0px rgba(25, 31, 36, 0.08);"
        >
            <!-- 代报名， 添加参合人                  新增编辑 -->
            <el-button
                v-show="!(taskCount !== null && taskCount > 0 && (this.$route.name === 'attendeeViewForSignUp' || this.$route.name === 'attendeeViewForUpdate'))
                    && !(ruleForm.changeStatus === 1 && this.$route.name !== 'attendeeViewForCheck') && (ruleForm.id === null || ruleForm.id === '' || ruleForm.signStatus === 0)"
                :disabled="(taskView !== null && taskView.oaFlowFlag === 1) || allFormDisabled"
                :loading="loading"
                style="margin-top:10px"
                @click="zancun"
            >
                暂存
            </el-button>
            <!-- 变更审核    报名审核    参会人保存 -->
            <el-button
                v-show="!(taskCount !== null && taskCount > 0 && (this.$route.name === 'attendeeViewForSignUp' || this.$route.name === 'attendeeViewForUpdate')) &&
                    !allFormDisabled && !(ruleForm.changeStatus === 1 && this.$route.name !== 'attendeeViewForCheck') && ((ruleForm.signStatus === null && ruleForm.id !== null) || ruleForm.signStatus === 1 || ruleForm.signStatus === 3) && this.$route.name !== 'attendeeViewForShow'"
                :disabled="allFormDisabled || (taskView !== null && taskView.oaFlowFlag === 1)"
                :loading="loading"
                style="margin-top:10px"
                @click="baocun"
            >
                保存
            </el-button>
            <!-- 代报名， 添加参合人                  新增编辑 -->
            <el-button
                v-show="!(taskCount !== null && taskCount > 0 && (this.$route.name === 'attendeeViewForSignUp' || this.$route.name === 'attendeeViewForUpdate')) &&
                    !(ruleForm.changeStatus === 1 && this.$route.name !== 'attendeeViewForCheck') && (ruleForm.id === null || ruleForm.id === '' || ruleForm.signStatus === 0) && this.$route.name !== 'attendeeViewForShow'"
                :disabled="allFormDisabled || (taskView !== null && taskView.oaFlowFlag === 1)"
                :loading="loading"
                style="margin-top:10px"
                @click="tijiao"
            >
                提交
            </el-button>
            <el-button
                v-show="!(taskCount !== null && taskCount > 0 && (this.$route.name === 'attendeeViewForSignUp' || this.$route.name === 'attendeeViewForUpdate')) &&
                    this.$route.name === 'attendeeViewForSignUp' && ruleForm.signStatus === 3 && taskView === null && ruleForm.changeStatus !== 1"
                :loading="loading"
                style="margin-top:10px"
                :disabled="allFormDisabled"
                @click="cancelAttendeeMetting"
            >
                取消报名
            </el-button>
            <!-- 变更审核    报名审核   -->
            <el-button
                v-show="!(taskCount !== null && taskCount > 0 && (this.$route.name === 'attendeeViewForSignUp' || this.$route.name === 'attendeeViewForUpdate')) &&
                    !(ruleForm.changeStatus === 1 && this.$route.name !== 'attendeeViewForCheck') && (ruleForm.signStatus === 1 || (ruleForm.signStatus === 3 && taskView !== null) || (ruleForm.signStatus === null && ruleForm.changeStatus === 1))"
                :disabled="taskView !== null && taskView.oaFlowFlag === 1"
                type="warning"
                :loading="loading"
                :class="taskView !== null && taskView.oaFlowFlag === 1 ? 'shenhebutongguoDisabledClass' : 'shenhebutongguoActiveClass'"
                @click="shenhebutongguo"
            >
                审核不通过
            </el-button>
            <el-button
                v-show="!(taskCount !== null && taskCount > 0 && (this.$route.name === 'attendeeViewForSignUp' || this.$route.name === 'attendeeViewForUpdate')) &&
                    !(ruleForm.changeStatus === 1 && this.$route.name !== 'attendeeViewForCheck') && (ruleForm.signStatus === 1 || (ruleForm.signStatus === 3 && taskView !== null) || (ruleForm.signStatus === null && ruleForm.changeStatus === 1))"
                :disabled="taskView !== null && taskView.oaFlowFlag === 1"
                :loading="loading"
                style="margin-top:10px"
                type="primary"
                @click="shenhetongguo"
            >
                审核通过
            </el-button>
            <el-button
                v-show="(getConferenceTemplate(0) !== null && getConferenceTemplate(0) !== '' && getConferenceTemplate(0).signConfigOaFlowFlag === 1) && (!(taskCount !== null && taskCount > 0 && (this.$route.name === 'attendeeViewForSignUp' || this.$route.name === 'attendeeViewForUpdate')) &&
                    !(ruleForm.changeStatus === 1 && this.$route.name !== 'attendeeViewForCheck') && (ruleForm.signStatus === 1 || (ruleForm.signStatus === 3 && taskView !== null) || (ruleForm.signStatus === null && ruleForm.changeStatus === 1)))"
                :disabled="taskView !== null && taskView.oaFlowFlag === 1"
                :loading="loading"
                style="margin-top:10px"
                type="primary"
                @click="openOaFlowDialog"
            >
                OA审核
            </el-button>
            <el-button
                v-show="(getConferenceTemplate(0) !== null && getConferenceTemplate(0) !== '' && getConferenceTemplate(0).signConfigOaFlowFlag === 1) && (!(taskCount !== null && taskCount > 0 && (this.$route.name === 'attendeeViewForSignUp' || this.$route.name === 'attendeeViewForUpdate')) &&
                    (taskView !== null && taskView.oaFlowFlag === 1) && !(ruleForm.changeStatus === 1 && this.$route.name !== 'attendeeViewForCheck') && (ruleForm.signStatus === 1 || (ruleForm.signStatus === 3 && taskView !== null) || (ruleForm.signStatus === null && ruleForm.changeStatus === 1)))"
                :loading="loading"
                style="margin-top:10px"
                @click="withdraw"
            >
                撤回
            </el-button>
            <!-- <el-button
                v-show="!(taskCount !== null && taskCount > 0 && (this.$route.name === 'attendeeViewForSignUp' || this.$route.name === 'attendeeViewForUpdate')) &&
                    (conferenceView.useVehicleFlag === 1 || conferenceView.useRoomFlag === 1 || conferenceView.useCardFlag === 1 || conferenceView.useDinnerFlag === 1) &&
                    this.$route.name !== 'attendeeViewForCheck' && ruleForm.signStatus === 3 && taskView === null && ruleForm.changeStatus !== 1"
                :loading="loading"
                style="margin-top:10px"
                type="primary"
                @click="xiafarenwu"
            >
                任务下发
            </el-button> -->
            <el-button
                v-show="!(taskCount !== null && taskCount > 0 && (this.$route.name === 'attendeeViewForSignUp' || this.$route.name === 'attendeeViewForUpdate')) &&
                    this.$route.name === 'attendeeViewForUpdate' && ruleForm.signStatus === 3 && taskView === null && ruleForm.changeStatus !== 1"
                :loading="loading"
                style="margin-top:10px"
                @click="daiqingjia"
            >
                代请假
            </el-button>
            <el-button
                v-show="ruleForm.signStatus === -3"
                :loading="loading"
                style="margin-top:10px"
                type="primary"
                @click="huifubaomingzige"
            >
                恢复报名资格
            </el-button>

        </div>
        <el-dialog
            title="审核不通过"
            width="35%"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="closeDialog"
        >
            <el-form
                ref="examineForm"
                :model="examineForm"
                :rules="examineRules"
                label-width="60px"
                class="demo-ruleForm"
            >
                <el-form-item v-show="ruleForm.signStatus === 1" label="" prop="signStatus">
                    <!-- <el-radio v-model="examineForm.signStatus" :label="2">退回重新填写</el-radio>
                    <el-radio v-model="examineForm.signStatus" :label="-3">取消报名资格</el-radio> -->
                    <el-radio v-model="examineForm.signStatus" :label="2" @change="reasonChange(0)">退回重填<span
                        class="_48OpacityClass"
                        style="margin-left:10px"
                    >（{{ getConferenceTemplate(2) }}调整报名信息后可重新提交申请）</span></el-radio>
                    <el-radio v-model="examineForm.signStatus" :label="-3" @change="reasonChange(1)">禁止报名<span
                        class="_48OpacityClass"
                        style="margin-left:10px"
                    >（{{ getConferenceTemplate(2) }}禁止报名本次{{ getConferenceTemplate(1) }}）</span>
                    </el-radio>
                </el-form-item>
                <el-form-item
                    label="原因"
                    prop="verifyReason"
                    :rules="[
                        { required: true, message: '请输入审核不通过原因', trigger: 'blur' }
                    ]"
                >
                    <el-input
                        v-model="examineForm.verifyReason"
                        type="textarea"
                        :rows="4"
                        show-word-limit
                        maxlength="300"
                        placeholder="请填写审核不通过原因"
                    />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button :loading="loading" type="primary" @click="returnSubmit">退回</el-button>
                <el-button @click="closeDialog">取消</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="选择主宾"
            width="50%"
            :visible.sync="honourDialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="closeHonourDialog"
        >
            <div class="clearfix">
                <div style="background-color: white;padding-left:10px;padding-top: 15px">
                    <el-form :inline="true" :model="pageInfo">
                        <el-form-item :label="getConferenceTemplate(2) + '姓名'">
                            <el-input
                                class="keepOutRight"
                                v-model="pageInfo.attendeeName"
                                maxlength="25"
                                :placeholder="'请输入' + getConferenceTemplate(2) + '姓名'"
                            />
                        </el-form-item>
                        <el-form-item style="float: right">
                            <el-button type="primary" @click="search">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <el-table ref="table" :data="honours" :height="tableHeight" style="width: 100%;">
                <el-table-column width="55">
                    <template slot-scope="scope">
                        <el-radio v-model="radio" :label="scope.row.id" @change="radioChange(scope.row)">&nbsp;
                        </el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="报名人信息">
                    <template slot-scope="scope">
                        <div style="height:32px">
                            <img
                                style="width:32px;height:32px;float:left;border-radius:50%"
                                :src="scope.row.ssoUserPhoto !== null && scope.row.ssoUserPhoto !== '' ? scope.row.ssoUserPhoto : (scope.row.fixAttributeCommonVO.sex === null || scope.row.fixAttributeCommonVO.sex === '' ? require('@/assets/male.png') : (scope.row.fixAttributeCommonVO.sex === '1' || scope.row.fixAttributeCommonVO.sex === 1) ? require('@/assets/male.png') : require('@/assets/female.png'))"
                            >
                            <span
                                style="margin-top:8px;margin-left:5px;float:left"
                            >{{ scope.row.fixAttributeCommonVO.attendeeName }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="职务">
                    <template slot-scope="scope">
                        <div :title="scope.row.fixAttributeCommonVO.position">
                            {{ scope.row.fixAttributeCommonVO.position }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="手机">
                    <template slot-scope="scope">
                        <div :title="scope.row.fixAttributeCommonVO.phone">{{ scope.row.fixAttributeCommonVO.phone }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="fixAttributeCommonVO.organizationSortName" label="单位简称/全称">
                    <template slot-scope="scope">
                        <div>
                            {{ formatOrgName(scope.row.fixAttributeCommonVO.organizationSortName,scope.row.fixAttributeCommonVO.organizationName) }}
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button :loading="loading" type="primary" @click="pickHonour">确定</el-button>
                <el-button @click="closeHonourDialog">取消</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="OA审核"
            width="30%"
            :visible.sync="oaFlowDialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="closeOaFlowDialog"
        >
            <el-form
                ref="oaFlowForm"
                :model="oaFlowForm"
                :rules="oaFlowRules"
                label-width="120px"
                class="demo-ruleForm"
            >
                <el-form-item label="请选择审核模板" prop="oaFlowCode">
                    <el-select v-model="oaFlowForm.oaFlowCode" placeholder="请选择审核模板" style="width: 100%">
                        <el-option
                            v-for="item in oaFlows"
                            :key="item.oaFlowCode"
                            :label="item.oaFlowName"
                            :value="item.oaFlowCode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="verifyReason">
                    <el-input
                        v-model="oaFlowForm.oaFlowRequest.taskRemark"
                        style="width: 100%"
                        type="textarea"
                        :rows="4"
                        show-word-limit
                        maxlength="300"
                    />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="oaFlowSubmit">提交</el-button>
                <el-button @click="closeOaFlowDialog">取消</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="代请假"
            width="40%"
            :visible.sync="qingjiaDialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="closeQingjiaDialog"
        >
            <el-form
                ref="qingjiaForm"
                :model="qingjiaForm"
                :rules="qingjiaRules"
                label-width="120px"
                class="demo-ruleForm"
            >
                <el-form-item label="请假类型 " prop="type">
                    <el-radio-group v-model="qingjiaForm.type">
                        <el-radio :label="3">离会外出</el-radio>
                        <el-radio :label="4">提前离会</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-show="qingjiaForm.type === 3" label="请假时间" prop="qingjiashijian">
                    <el-date-picker
                        v-model="qingjiaForm.qingjiashijian"
                        :default-time="configDefaultTime"
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
                <el-form-item v-show="qingjiaForm.type === 4" label="离会时间" prop="leaveTime">
                    <el-date-picker
                        v-model="qingjiaForm.leaveTime"
                        :default-time="configDefaultTime[0]"
                        placeholder="选择离会时间"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        :picker-options="pickerOptions"
                        :editable="false"
                    />
                </el-form-item>
                <el-form-item label="请假原因" prop="reason">
                    <el-input
                        v-model="qingjiaForm.reason"
                        style="width: 100%"
                        type="textarea"
                        :rows="4"
                        show-word-limit
                        maxlength="100"
                    />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="loading" @click="qingjiaSubmit">提交</el-button>
                <el-button @click="closeQingjiaDialog">取消</el-button>
            </span>
        </el-dialog>
        <el-image-viewer
            v-if="showViewer"
            :on-close="closeViewer"
            :url-list="showViewerSrcList"
        />
        <TaskHand
            :attendee-ids="attendeeIds"
            :dialog-visible="taskDialogVisible"
            :source-type="sourceType"
            @closeDialog="closeXiafarenwu"
        />
        <PickArriveStation :dialog-visible="pickArriveStationVisible" :table-data="arriveStations" @closeDialog="closePickArriveStation" />
        <PickReturnStation :dialog-visible="pickReturnStationVisible" :table-data="returnStations" @closeDialog="closePickReturnStation" />
        <!-- <el-dialog
            :visible.sync="phoneCustomShow"
        >
            <span>需要注意的是内容是默认不居中的</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="phoneCustomShow = false">取 消</el-button>
                <el-button type="primary" @click="phoneCustomShow = false">确 定</el-button>
            </span>
        </el-dialog> -->
    </div>
</template>
<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { getTableHeight, checkPngHeightWidth } from '@/utils/index'
import { getView, update, examine, examineBatch, getSignForm, getHonourList, getDraft, getUser, getChangeView, getFlightNews, vertifybyConferenceId, getTaskView, cancelAttendeeMetting, leaveOrganized, getTaskCount, recoverSignStatus, getAddressListByConferenceId } from '@/api/attendee'
import { getDicList } from '@/api/common'
import { getList as getTagList } from '@/api/attendeeTag'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
import { getOssPublicBaseUrl } from '@/utils/x-sso-publicbaseurl'
import { getConferenceId } from '@/utils/conference-auth'
import { getView as getConferenceView } from '@/api/conference'
import { getList as getAgendaList } from '@/api/agenda'
import { getSignConfig } from '@/api/signup'
import { telephoneValid, emailValid, cardValid } from '@/utils/valid-common'
import { getList as getLogList } from '@/api/log'
import { getList as getOaFlowList, insert as insertOaFlowInst, getOaFlowLogByAttendeeId, withdraw } from '@/api/oaFlow'
import { showLoading, closeLoading } from '@/utils/loading'
import TaskHand from './task-hand'
import ResourceView from './resourceView'
import ImgUpload from './imgUpload'
import AttendeeSelect from './attendeeSelect'
import AttendeeRadio from './attendeeRadio'
import AttendeeCheck from './attendeeCheck'
import FileUpload from './fileUpload'
import PickArriveStation from './pickArriveStation'
import PickReturnStation from './pickReturnStation'
import { getConferenceVerifyReason, editConferenceVerifyReason } from '@/api/newExtend'
import { loginInfo } from '@/api/login'
import { getPhone } from '@/api/newExtend'

export default {
    name: 'Attendee',
    components: {
        ElImageViewer,
        TaskHand, ResourceView, ImgUpload, AttendeeSelect, AttendeeRadio, AttendeeCheck, FileUpload,
        PickArriveStation, PickReturnStation
    },
    props: {

    },
    data() {
        return {
            // 虚拟号码详情介绍
            phoneCustomShow: false,
            // 是否是虚拟号码
            phoneCustomFlag: false,
            showViewerSrcList: [],
            showViewer: false,
            baomingshijian: null,
            currentCardNum: null,
            viewPicUrl: process.env.VUE_APP_DEFAULT_PHOTO,
            pickArriveStationVisible: false,
            arriveStations: [],
            pickReturnStationVisible: false,
            returnStations: [],
            addressList: [],
            isCloseFlag: 1,
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
            taskCount: 0,
            checkGroupIds: [],
            pickerOptions: {
                disabledDate: (time) => {
                    return time.getTime() > ((new Date(this.conferenceView.endTime).getTime())) ||
                        time.getTime() < ((new Date(this.conferenceView.startTime).getTime()))
                }
            },
            qingjiaDialogVisible: false,
            qingjiaForm: {
                type: 3,
                // 离会时间
                leaveTime: null,
                // 返回时间
                returnTime: null,
                // 理由
                reason: null,
                qingjiashijian: []
            },
            qingjiaRules: {
                qingjiashijian: [{ required: true, message: '请输入请假时间', trigger: 'blur' }],
                leaveTime: [{ required: true, message: '请输入离会时间', trigger: 'blur' }],
                reason: [{ required: true, message: '请输入请假原因', pattern: '[^ \x22]+', trigger: 'blur' }]
            },
            allFormDisabled: true,
            sourceType: null,
            attendeeIds: [],
            taskDialogVisible: false,
            oaFlowLogs: [],
            taskView: null,
            baseAddress: process.env.VUE_APP_BASE_ADDRESS,
            oaFlowDialogVisible: false,
            oaFlowForm: {
                oaFlowInstTitle: null,
                oaFlowCode: null,
                oaFlowName: null,
                oaFlowRequest: {
                    fdUrl: null,
                    fdBeizhu: null
                }
            },
            oaFlowRules: {
                oaFlowCode: [{ required: true, message: '请选择流程模板', trigger: 'change' }]
            },
            oaFlows: [],
            changeList: [],
            fileList: [],
            hideUploadEdit: false,
            routeName: this.$route.name,
            validFlag: 1, // 验证是否必填
            activeNameLog: 'caozuojilu',
            tableHeight: 300 + 'px',
            honours: [],
            pageInfo: {
                attendeeName: null,
                conferenceId: getConferenceId(),
                honourFlag: 1
            },
            radio: null,
            cardTypes: [],
            telephoneValid: telephoneValid(),
            emailValid: emailValid(),
            cardValid: cardValid('1'),
            examineRules: {},
            examineForm: {
                signStatus: 2,
                verifyReason: null
            },
            dialogVisible: false,
            positionLevels: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            signConfig: {},
            agendas: [],
            conferenceView: {},
            accept: '.png, .jpg',
            uploadHeader: { 'authToken': this.$store.state.user.token },
            uploadUrl: process.env.VUE_APP_BASE_API + '/files/upload',
            uploadData: {
                fileGroup: 7, // 文件组
                conferenceId: getConferenceId() // 会议ID，编辑会议上传附件传值
            },
            imagePath: getOssBaseUrl(),
            loading: false,
            nations: [],
            tags: [],
            carTypes: [],
            checkBoxValue: false,
            paneHeight: getTableHeight(110) + 'px',
            xingchengHeight: getTableHeight(101) + 'px',
            yichengHeight: getTableHeight(68) + 'px', // 暂用于log
            logHeight: getTableHeight(125) + 'px',
            formHeight: getTableHeight(148) + 'px',
            tabsHeight: getTableHeight(30) + 'px',
            rules: {
            },
            rules1: {
            },
            ruleForm: {
                arriveTime: null,
                returnTime: null,
                id: null,
                signFormConfigFormatVO: {
                    honourName: null,
                    honourId: null,
                    attendeeName: {
                    },
                    organizationName: {}
                }
            },
            activeNameSignup: 'first',
            honourDialogVisible: false,
            honourName: '',
            honour: {
                name: null,
                id: null
            },
            logData: [],
            userId: null,
            verifyReasonData: [],
            choiceIndex: 0
        }
    },
    watch: {
        taskDialogVisible(val) {
            if (!val) {
                if (this.isCloseFlag !== 1) {
                    this.closePage()
                }
            }
        }
    },
    // beforeCreate() {
    //     alert(this.$route.params.id)
    //     this.$route.meta.title = this.$route.params.id + '的报名表单'
    // },
    created() {
        this.getAddressListByConferenceId()
        this.getTaskCount()

        if (this.$route.name === 'attendeeViewForCheck') {
            getChangeView({ 'id': this.$route.params.id }).then(res => {
                this.ruleForm = this.formatResultAddTime(res.result)
                this.getCurrentCardNum()
                this.getArriveTimeView()
                if (res.result.signFormConfigFormatVO.photoUrl.fieldValue !== null && res.result.signFormConfigFormatVO.photoUrl.fieldValue !== '') {
                    this.fileList = [{ 'name': res.result.signFormConfigFormatVO.photoUrl.fieldValue, 'url': this.imagePath + res.result.signFormConfigFormatVO.photoUrl.downloadUrl }]
                    this.hideUploadEdit = this.fileList.length >= 1
                }
                if (this.$route.params.type === 1) {
                    this.allFormDisabled = false
                }
                this.setCol()
            })
        } else {
            this.allFormDisabled = false
            if (this.$route.params.id !== null && this.$route.params.id !== '0') {
                getView({ 'id': this.$route.params.id }).then(res => {
                    // alert(res.result.signFormConfigFormatVO.attendeeName.fieldValue)

                    this.ruleForm = this.formatResultAddTime(res.result)
                    this.getCurrentCardNum()
                    this.getArriveTimeView()
                    if (res.result.signFormConfigFormatVO.photoUrl.fieldValue !== null && res.result.signFormConfigFormatVO.photoUrl.fieldValue !== '') {
                        this.fileList = [{ 'name': res.result.signFormConfigFormatVO.photoUrl.fieldValue, 'url': this.imagePath + res.result.signFormConfigFormatVO.photoUrl.downloadUrl }]
                        this.hideUploadEdit = this.fileList.length >= 1
                    }

                    if (this.ruleForm.signFormConfigFormatVO.honourFlag.fieldValue === '0' &&
                        this.ruleForm.linkAttendeeList !== null && this.ruleForm.linkAttendeeList.length > 0) {
                        this.ruleForm.signFormConfigFormatVO.honourId.fieldValue = this.ruleForm.linkAttendeeList[0].attendeeId
                        this.honourName = this.ruleForm.linkAttendeeList[0].attendeeName
                    }

                    this.setCol()
                    if (this.ruleForm.signStatus === 0) {
                        this.formHeight = getTableHeight(100) + 'px'
                    }
                })
            } else {
                this.hideUploadEdit = false
                this.formHeight = getTableHeight(100) + 'px'
                var dataTemp = {
                    'conferenceId': getConferenceId(),
                    'innerFlag': 1
                }
                this.getSignForm(dataTemp)
            }
        }

        this.getNations()
        this.getCardTypes()
        this.getSignConfig()
        this.getConferenceView()
        this.getAgendaList()
        this.getTagList()
        this.getPositionLevels()
        this.getLogList()
        this.getOaFlowList()
        this.getTaskView()
        this.getOaFlowLogByAttendeeId()
    },
    methods: {
        // 虚拟手机号码详情
        phoneCustomDetail() {
            this.phoneCustomShow = true
            this.$confirm('<div>虚拟号码是由系统随机生成的一组数字，可帮助无法提供手机号码的参会人顺利报名，如需使用可点击 “生成虚拟号码” 按钮。</div><dl><dt>虚拟号码有以下使用限制：</dt><dd>无法登录系统</dd><dd>无法收到系统消息通知</dd><dd>仅可通过代报名了解会议安排</dd></dl>', '什么是虚拟号码？', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '填写真实号码',
                cancelButtonText: '生成虚拟号码',
                distinguishCancelAndClose: true,
                customClass: 'phone-custom-alert'
            }).then(() => {
                // 执行取消
                this.ruleForm.signFormConfigFormatVO.phone.fieldValue = ''
                this.$refs.phoneCustom.focus()
            }).catch(action => {
                // 执行确定
                if (action === 'cancel') {
                    this.phoneCustom()
                }
            })
        },
        // 生成虚拟手机
        phoneCustom() {
            getPhone({ id: this.pageInfo.conferenceId }).then(res => {
                const data = res.result
                this.ruleForm.signFormConfigFormatVO.phone.fieldValue = data
                this.phoneCustomFlag = true
                this.refreshSignConfig()
            })
        },
        reasonChange(index) {
            this.choiceIndex = index
            this.$set(this.examineForm, 'verifyReason', this.verifyReasonData[index].auditMind)
        },
        formatResultAddTime(val) {
            val.arriveTime = null
            val.returnTime = null
            return val
        },
        handleRemove(file) {
            this.fileList = []
            this.handleRemoveImg(file, this.fileList)
        },
        handlePictureCardPreview(file) {
            this.showViewer = true
            this.showViewerSrcList = [file.url]
        },
        closeViewer() {
            this.showViewer = false
            this.showViewerSrcList = []
        },
        changeCardType() {
            if (this.ruleForm.signFormConfigFormatVO.cardType.fieldValue === '1') {
                if (this.currentCardNum === null || this.currentCardNum === '' || this.currentCardNum.indexOf('*') === -1) {
                    if (this.ruleForm.signFormConfigFormatVO.attendeeName.fieldValue !== null && this.ruleForm.signFormConfigFormatVO.attendeeName.fieldValue !== '' &&
                    this.ruleForm.signFormConfigFormatVO.phone.fieldValue !== null && this.ruleForm.signFormConfigFormatVO.phone.fieldValue !== '') {
                        getUser({
                            'userName': this.ruleForm.signFormConfigFormatVO.attendeeName.fieldValue,
                            'mobile': this.ruleForm.signFormConfigFormatVO.phone.fieldValue
                        }).then(res1 => {
                            if (res1.success && res1.result !== null) {
                                this.currentCardNum = res1.result.idNumber
                                if (this.ruleForm.signFormConfigFormatVO.cardType.showFlag === 0 || this.ruleForm.signFormConfigFormatVO.cardType.fieldValue === '1') {
                                    this.ruleForm.signFormConfigFormatVO.cardNum.fieldValue = res1.result.idNumber
                                }
                            }
                        })
                    }
                } else {
                    this.ruleForm.signFormConfigFormatVO.cardNum.fieldValue = this.currentCardNum
                }
            } else {
                this.ruleForm.signFormConfigFormatVO.cardNum.fieldValue = null
            }
        },
        getCurrentCardNum() {
            if (this.ruleForm.signFormConfigFormatVO.cardType !== null && this.ruleForm.signFormConfigFormatVO.cardType.showFlag === 1 && (this.ruleForm.signFormConfigFormatVO.cardType.fieldValue === null || this.ruleForm.signFormConfigFormatVO.cardType.fieldValue === '')) {
                this.ruleForm.signFormConfigFormatVO.cardType.fieldValue = '1'
            }
            this.currentCardNum = this.ruleForm.signFormConfigFormatVO.cardNum.fieldValue
        },
        formatAccept(val) {
            if (val === null || val === '') {
                return ''
            }
            var temp = val.split(',')
            var resultTemp = ''
            temp.forEach((item, index) => {
                if (index === temp.length - 1) {
                    resultTemp += '.' + item
                } else {
                    resultTemp += '.' + item + ','
                }
            })
            return resultTemp
        },
        getPicFilePath(event, pic) {
            this.getFilePath(pic.fileUrl).then(res => {
                event.srcElement.attributes['src'].value = res.result
                // alert(event.srcElement.attributes['src'].value)
            })
        },
        clickPic(event, pic) {
            this.viewPicUrl = event.srcElement.attributes['src'].value
        },
        formatPicChangeContent(val) {
            if (val === null || val === '') {
                return []
            }
            var picList = JSON.parse(val)
            // picList.forEach((item, index) => {
            //     this.getFilePath(item.fileUrl).then(res => {
            //         picList[index].fileUrl = res.result
            //     })
            // })
            // alert(JSON.stringify(picList))
            return picList
        },
        changgeCheck(val) {
            this.$refs.ruleForm.validateField(val, (valid) => {
            })
        },
        getArriveTimeView() {
            if (this.ruleForm.signFormConfigFormatVO.arriveTime.fieldValue !== null && this.ruleForm.signFormConfigFormatVO.arriveTime.fieldValue !== '' && this.ruleForm.signFormConfigFormatVO.arriveTime.fieldValue.substr(17, 2) !== '01') {
                this.ruleForm.arriveTime = this.ruleForm.signFormConfigFormatVO.arriveTime.fieldValue.substr(11, 5)
            } else {
                this.ruleForm.arriveTime = null
            }

            if (this.ruleForm.signFormConfigFormatVO.returnTime.fieldValue !== null && this.ruleForm.signFormConfigFormatVO.returnTime.fieldValue !== '' && this.ruleForm.signFormConfigFormatVO.returnTime.fieldValue.substr(17, 2) !== '01') {
                this.ruleForm.returnTime = this.ruleForm.signFormConfigFormatVO.returnTime.fieldValue.substr(11, 5)
            } else {
                this.ruleForm.returnTime = null
            }
        },
        changeArriveDate() {
            if (this.ruleForm.signFormConfigFormatVO.arriveTime.fieldValue !== null && this.ruleForm.signFormConfigFormatVO.arriveTime.fieldValue !== ''
            ) {
                if (this.ruleForm.arriveTime !== null && this.ruleForm.arriveTime !== '') {
                    this.ruleForm.signFormConfigFormatVO.arriveTime.fieldValue = this.ruleForm.signFormConfigFormatVO.arriveTime.fieldValue.substr(0, 11) + this.ruleForm.arriveTime + ':00'
                } else {
                    this.ruleForm.signFormConfigFormatVO.arriveTime.fieldValue = this.ruleForm.signFormConfigFormatVO.arriveTime.fieldValue.substr(0, 11) + '00:00:01'
                }
            } else {
                this.ruleForm.arriveTime = null
            }
        },
        changeReturnDate() {
            if (this.ruleForm.signFormConfigFormatVO.returnTime.fieldValue !== null && this.ruleForm.signFormConfigFormatVO.returnTime.fieldValue !== ''
            ) {
                if (this.ruleForm.returnTime !== null && this.ruleForm.returnTime !== '') {
                    this.ruleForm.signFormConfigFormatVO.returnTime.fieldValue = this.ruleForm.signFormConfigFormatVO.returnTime.fieldValue.substr(0, 11) + this.ruleForm.returnTime + ':00'
                } else {
                    this.ruleForm.signFormConfigFormatVO.returnTime.fieldValue = this.ruleForm.signFormConfigFormatVO.returnTime.fieldValue.substr(0, 11) + '00:00:01'
                }
            } else {
                this.ruleForm.returnTime = null
            }
        },
        changeArriveTime() {
            if (this.ruleForm.signFormConfigFormatVO.arriveTime.fieldValue !== null && this.ruleForm.signFormConfigFormatVO.arriveTime.fieldValue !== '') {
                if (this.ruleForm.arriveTime !== null && this.ruleForm.arriveTime !== '') {
                    this.ruleForm.signFormConfigFormatVO.arriveTime.fieldValue = this.ruleForm.signFormConfigFormatVO.arriveTime.fieldValue.substr(0, 11) + this.ruleForm.arriveTime + ':00'
                } else {
                    this.ruleForm.signFormConfigFormatVO.arriveTime.fieldValue = this.ruleForm.signFormConfigFormatVO.arriveTime.fieldValue.substr(0, 11) + '00:00:01'
                }
            }
        },
        changeReturnTime() {
            if (this.ruleForm.signFormConfigFormatVO.returnTime.fieldValue !== null && this.ruleForm.signFormConfigFormatVO.returnTime.fieldValue !== ''
            ) {
                if (this.ruleForm.returnTime !== null && this.ruleForm.returnTime !== '') {
                    this.ruleForm.signFormConfigFormatVO.returnTime.fieldValue = this.ruleForm.signFormConfigFormatVO.returnTime.fieldValue.substr(0, 11) + this.ruleForm.returnTime + ':00'
                } else {
                    this.ruleForm.signFormConfigFormatVO.returnTime.fieldValue = this.ruleForm.signFormConfigFormatVO.returnTime.fieldValue.substr(0, 11) + '00:00:01'
                }
            }
        },
        chakanzhaopianxiangqing(val) {
            if (val !== null && val !== '') {
                this.getFilePath(val).then(res => {
                    window.location.href = res.result
                })
            } else {
                window.location.href = this.defaultPhoto
            }
        },
        // getFileRealPath(val) {
        //     return this.getFilePath(val).then(res => {
        //         return res.result
        //     }).result
        // },
        addImg(group, index, submitFileList) {
            var tempData = JSON.stringify(submitFileList)
            if (tempData === '' || tempData === '[]') {
                tempData = null
            }
            if (group === 1) {
                this.ruleForm.signFormConfigFormatVO.baseInfos[index].fieldValue = tempData
                this.$refs.ruleForm.clearValidate('signFormConfigFormatVO.baseInfos.' + index + '.fieldValue')
            } else if (group === 2) {
                this.ruleForm.signFormConfigFormatVO.reserveServices[index].fieldValue = tempData
                this.$refs.ruleForm.clearValidate('signFormConfigFormatVO.reserveServices.' + index + '.fieldValue')
            } else if (group === 3) {
                this.ruleForm.signFormConfigFormatVO.pickUpServices[index].fieldValue = tempData
                this.$refs.ruleForm.clearValidate('signFormConfigFormatVO.pickUpServices.' + index + '.fieldValue')
            } else if (group === 4) {
                this.ruleForm.signFormConfigFormatVO.pickOutServices[index].fieldValue = tempData
                this.$refs.ruleForm.clearValidate('signFormConfigFormatVO.pickOutServices.' + index + '.fieldValue')
            }
        },
        formatAgenda(beforeValue, afterValue) {
            var befores = []
            var afters = []
            var delValue = ''
            var addValue = ''
            if (beforeValue !== null && beforeValue.length > 0) {
                befores = beforeValue.split(';')
            }
            if (afterValue !== null && afterValue.length > 0) {
                afters = afterValue.split(';')
            }
            befores.forEach(item => {
                if (item !== null && item !== '' && afters.indexOf(item) === -1) {
                    delValue += item + ';'
                }
            })

            afters.forEach(item => {
                if (item !== null && item !== '' && befores.indexOf(item) === -1) {
                    addValue += item + ';'
                }
            })

            var resultStr = ''
            if (addValue !== null && addValue !== '') {
                addValue = addValue.substr(0, addValue.length - 1)
                resultStr += '议程变更，新增“' + addValue + '”'
            }

            if (delValue !== null && delValue !== '') {
                delValue = delValue.substr(0, delValue.length - 1)
                if (resultStr === '') {
                    resultStr += '议程变更，取消“' + delValue + '”'
                } else {
                    resultStr += '，取消“' + delValue + '”'
                }
            }

            return resultStr
        },
        formatLogContent(val) {
            if (val === undefined || val === null || val === '') {
                return []
            } else {
                return JSON.parse(val)
            }
        },
        huifubaomingzige() {
            this.$confirm('请确认是否恢复报名资格？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loading = true
                recoverSignStatus({ attendeeIds: [this.$route.params.id] }).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        // this.getView()
                        this.closePage()
                    }
                    this.loading = false
                }).catch(() => {
                    this.loading = false
                })
            })
        },
        getTaskCount() {
            getTaskCount({ attendeeIds: [this.$route.params.id], types: [1, 2, 3, 4, 5] }).then(res => {
                if (res.success) {
                    this.taskCount = res.result
                }
            })
        },
        qingjiaSubmit() {
            //  this.$refs.ruleForm.validateField((valid) => {

            // })
            var valieMessage = null

            if (this.qingjiaForm.type === 3) {
                this.$refs['qingjiaForm'].validateField(['qingjiashijian', 'reason'], valid => {
                    if (valid !== null && valid !== '') {
                        valieMessage = valid
                    }
                })
            } else {
                this.$refs['qingjiaForm'].validateField(['leaveTime', 'reason'], valid => {
                    if (valid !== null && valid !== '') {
                        valieMessage = valid
                    }
                })
            }

            if (valieMessage !== null && valieMessage !== '') {
                return false
            }
            this.$confirm('请确认是否提交请假单？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.qingjiaForm.type === 3) {
                    this.qingjiaForm.leaveTime = this.qingjiaForm.qingjiashijian[0]
                    this.qingjiaForm.returnTime = this.qingjiaForm.qingjiashijian[1]
                } else {
                    this.qingjiaForm.returnTime = null
                }
                this.qingjiaForm.attendeeIds = [this.$route.params.id]
                this.qingjiaForm.conferenceId = getConferenceId()
                this.loading = true
                leaveOrganized(this.qingjiaForm).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        this.closeQingjiaDialog()
                        this.getOaFlowLogByAttendeeId()
                        this.getLogList()
                        // this.xiafarenwu()
                    }
                    this.loading = false
                }).catch(() => {
                    this.loading = false
                })
            }).catch(() => {
                this.loading = false
            })
        },
        closeQingjiaDialog() {
            this.qingjiaForm = {
                type: 3,
                leaveTime: null,
                returnTime: null,
                reason: null,
                qingjiashijian: []
            }
            this.qingjiaDialogVisible = false
        },
        daiqingjia() {
            this.qingjiaDialogVisible = true
        },
        xiafarenwu() {
            if (this.conferenceView.useVehicleFlag === 1 || this.conferenceView.useRoomFlag === 1 || this.conferenceView.useCardFlag === 1 || this.conferenceView.useDinnerFlag === 1) {
                if (this.$route.name === 'attendeeViewForCheck') {
                    this.sourceType = this.taskView.type
                } else if (this.$route.name === 'attendeeViewForSignUp') {
                    this.sourceType = 2
                } else {
                    this.sourceType = 4
                }
                this.attendeeIds = [this.$route.params.id]
                this.taskDialogVisible = true
            }
        },
        closeXiafarenwu() {
            this.taskDialogVisible = false
        },
        cancelAttendeeMetting() {
            this.loading = true
            this.$confirm('请确认是否取消报名？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                cancelAttendeeMetting({ 'conferenceId': getConferenceId, 'attendeeIds': [this.$route.params.id] }).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        this.closePage()
                    }
                    this.loading = false
                }).catch(() => {
                    this.loading = false
                })
            }).catch(() => {
                this.loading = false
            })
        },
        getOaFlowLogByAttendeeId() {
            getOaFlowLogByAttendeeId({ 'attendeeId': this.$route.params.id }).then(res => {
                this.oaFlowLogs = res.result
            })
        },
        getTaskView() {
            getTaskView({ 'id': this.$route.params.taskId }).then(res => {
                this.taskView = res.result
                if (this.taskView !== null) {
                    if ((this.taskView.type !== 3 && this.taskView.type !== 5)) {
                        this.allFormDisabled = false
                    }
                    this.setCol()
                }
            })
        },
        openOaFlowDialog() {
            this.oaFlowDialogVisible = true
        },
        closeOaFlowDialog() {
            this.oaFlowForm = {
                oaFlowInstTitle: null,
                oaFlowCode: null,
                oaFlowName: null,
                oaFlowRequest: {
                    fdUrl: null,
                    fdBeizhu: null
                }
            }
            this.oaFlowDialogVisible = false
            this.$refs['oaFlowForm'].resetFields()
        },
        withdraw() {
            this.loading = true
            this.$confirm('请确认是否撤回审批信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                withdraw({ 'attendeeTaskId': this.$route.params.taskId }).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        getView({ 'id': this.$route.params.id }).then(res => {
                            this.ruleForm = this.formatResultAddTime(res.result)
                            this.getCurrentCardNum()
                            this.getArriveTimeView()

                            if (res.result.signFormConfigFormatVO.photoUrl.fieldValue !== null && res.result.signFormConfigFormatVO.photoUrl.fieldValue !== '') {
                                this.fileList = [{ 'name': res.result.signFormConfigFormatVO.photoUrl.fieldValue, 'url': this.imagePath + res.result.signFormConfigFormatVO.photoUrl.downloadUrl }]
                                this.hideUploadEdit = this.fileList.length >= 1
                            }

                            // if (that.$route.name !== 'attendeeViewForCheck') {
                            //     that.formHeight = getTableHeight(148) + 'px'
                            // }
                        })
                        this.getTaskView()
                        this.getOaFlowLogByAttendeeId()
                        this.getLogList()
                    }
                    this.loading = false
                }).catch(() => {
                    this.loading = false
                })
            }).catch(() => {
                this.loading = false
            })
        },
        oaFlowSubmit() {
            this.$refs['oaFlowForm'].validate(valid => {
                if (valid) {
                    this.oaFlows.forEach(item => {
                        if (item.oaFlowCode === this.oaFlowForm.oaFlowCode) {
                            this.oaFlowForm.oaFlowName = item.oaFlowName
                        }
                    })
                    this.oaFlowForm.oaFlowInstTitle = this.taskView.todoTitle
                    this.oaFlowForm.oaFlowRequest.fdUrl = process.env.VUE_APP_BASE_ADDRESS
                    this.oaFlowForm.attendeeTaskId = this.$route.params.taskId
                    // this.oaFlowForm
                    insertOaFlowInst(this.oaFlowForm).then(res => {
                        if (res.success) {
                            this.closeOaFlowDialog()
                            this.getTaskView()
                            this.getOaFlowLogByAttendeeId()
                            this.getLogList()
                        }
                    })
                }
            })
        },
        getOaFlowList() {
            getOaFlowList({ 'conferenceId': getConferenceId() }).then(res => {
                this.oaFlows = res.result.list
            })
        },
        setCol() { // 根据会议状态确定是否显示变更内容.
            console.log('1951')
            console.log(this.ruleForm.changeStatus === 1)
            console.log(this.allFormDisabled)
            if (this.ruleForm.changeStatus === 1 || this.allFormDisabled) {
                this.yichengHeight = getTableHeight(142) + 'px'
                this.xingchengHeight = getTableHeight(175) + 'px'
                this.logHeight = getTableHeight(199) + 'px'
                this.formHeight = getTableHeight(222) + 'px'
                this.paneHeight = getTableHeight(184) + 'px'
                // this.changeList = JSON.parse('[{"afterValue":"这里是新数据","after":"37","attribute":"name","code":"id","beforeValue":"旧数据","before":"517"},{"afterValue":"这里是新数据","attribute":"name","code":"conferenceId","beforeValue":"旧数据","before":"125"},{"afterValue":"这里是新数据","attribute":"name","code":"attendeeId","beforeValue":"旧数据","before":"271"},{"afterValue":"这里是新数据","after":"35","attribute":"name","code":"attendeeRecordId","beforeValue":"旧数据"},{"afterValue":"这里是新数据","after":"11111111111111111111","attribute":"name","code":"organizationName","beforeValue":"旧数据","before":"职务123"},{"afterValue":"这里是新数据","after":"","attribute":"name","code":"email","beforeValue":"旧数据"},{"afterValue":"这里是新数据","after":"37","attribute":"name","code":"id","beforeValue":"旧数据","before":"517"},{"afterValue":"这里是新数据","attribute":"name","code":"conferenceId","beforeValue":"旧数据","before":"125"},{"afterValue":"这里是新数据","attribute":"name","code":"attendeeId","beforeValue":"旧数据","before":"271"},{"afterValue":"这里是新数据","after":"35","attribute":"name","code":"attendeeRecordId","beforeValue":"旧数据"},{"afterValue":"这里是新数据","after":"11111111111111111111","attribute":"name","code":"organizationName","beforeValue":"旧数据","before":"职务123"},{"afterValue":"这里是新数据","after":"","attribute":"name","code":"email","beforeValue":"旧数据"}]')

                if (this.allFormDisabled) {
                    if (this.taskView.changeContent !== null && this.taskView.changeContent !== '') {
                        this.changeList = JSON.parse(this.taskView.changeContent)
                        // alert(this.taskView.changeContent)
                    }
                } else {
                    if (this.ruleForm.changeContent !== null && this.ruleForm.changeContent !== '') {
                        this.changeList = JSON.parse(this.ruleForm.changeContent)
                        // alert(this.ruleForm.changeContent)
                    }
                }
                if (this.changeList !== null) {
                    this.changeList.forEach((item, index) => {
                        if (item.code === 'photoUrl') {
                            if (item.beforeValue !== null && item.beforeValue !== '') {
                                this.getFilePath(item.beforeValue).then(res => {
                                    this.changeList[index].beforeValue = res.result
                                })
                            }
                            if (item.afterValue !== null && item.afterValue !== '') {
                                this.getFilePath(item.afterValue).then(res => {
                                    this.changeList[index].afterValue = res.result
                                })
                            }
                        }
                    })
                }
                console.log(this.changeList)
                // setTimeout(() => {
                //     this.changeList = JSON.parse(JSON.stringify(changeListTemp))
                //     console.log(this.changeList)
                // }, 100)
            } else {
                this.yichengHeight = getTableHeight(68) + 'px'
                this.xingchengHeight = getTableHeight(100) + 'px'
                this.logHeight = getTableHeight(125) + 'px'
                this.formHeight = getTableHeight(148) + 'px'
                this.paneHeight = getTableHeight(110) + 'px'
            }
        },
        closePickArriveStation(val) {
            this.pickArriveStationVisible = false
            this.arriveStations = []

            this.ruleForm.arriveTime = val.sta
            this.ruleForm.signFormConfigFormatVO.arriveTime.fieldValue = val.destFlightDate + ' ' + val.sta + ':00'
            this.ruleForm.signFormConfigFormatVO.arriveStation.fieldValue = val.destAirportName + (val.destTerminal !== null ? val.destTerminal : '')
        },
        getFlightStatusForJiezhan() { // 接站获取航班详情
            if (this.ruleForm.signFormConfigFormatVO.arriveTime.fieldValue !== null &&
                this.ruleForm.signFormConfigFormatVO.arriveTime.fieldValue !== '' &&
                this.ruleForm.signFormConfigFormatVO.arriveFlight.fieldValue !== null &&
                this.ruleForm.signFormConfigFormatVO.arriveFlight.fieldValue !== '') {
                var loadSongzhan = showLoading()
                getFlightNews({ 'flag': 'dest', 'fnum': this.ruleForm.signFormConfigFormatVO.arriveFlight.fieldValue, 'querydate': this.ruleForm.signFormConfigFormatVO.arriveTime.fieldValue.substr(0, 10) }).then(res => {
                    if (res.result !== null && res.result.model !== null && res.result.model.errCode === '0' && res.result.model.flightStatusList !== null && res.result.model.flightStatusList.length > 0) {
                        if (res.result.model.flightStatusList.length === 1) {
                            this.ruleForm.arriveTime = res.result.model.flightStatusList[res.result.model.flightStatusList.length - 1].sta
                            this.ruleForm.signFormConfigFormatVO.arriveTime.fieldValue = res.result.model.flightStatusList[res.result.model.flightStatusList.length - 1].destFlightDate + ' ' + res.result.model.flightStatusList[res.result.model.flightStatusList.length - 1].sta + ':00'
                            this.ruleForm.signFormConfigFormatVO.arriveStation.fieldValue = res.result.model.flightStatusList[res.result.model.flightStatusList.length - 1].destAirportName + (res.result.model.flightStatusList[res.result.model.flightStatusList.length - 1].destTerminal !== null ? res.result.model.flightStatusList[res.result.model.flightStatusList.length - 1].destTerminal : '')
                        } else {
                            this.pickArriveStationVisible = true
                            this.arriveStations = res.result.model.flightStatusList
                        }
                    }
                    //  else {
                    //     this.ruleForm.signFormConfigFormatVO.arriveStation.fieldValue = ''
                    // }
                    closeLoading(loadSongzhan)
                })
                // getFlightStatus({ 'fnum': this.ruleForm.signFormConfigFormatVO.arriveFlight.fieldValue, 'querydate': this.ruleForm.signFormConfigFormatVO.arriveTime.fieldValue.substr(0, 10) }).then(res => {
                //     if (res.result !== null) {
                //         if (res.result.model.data.estimated_arrtime !== null && res.result.model.data.estimated_arrtime !== '') {
                //             this.ruleForm.signFormConfigFormatVO.arriveTime.fieldValue = GMTToStrYYYYMMDDHHmmss2(res.result.model.data.estimated_arrtime)
                //         }
                //         this.ruleForm.signFormConfigFormatVO.arriveStation.fieldValue = res.result.model.data.fdstAirport
                //     }
                // })
            }
        },
        closePickReturnStation(val) {
            this.pickReturnStationVisible = false
            this.returnStations = []

            this.ruleForm.returnTime = val.std
            this.ruleForm.signFormConfigFormatVO.returnTime.fieldValue = val.deptFlightDate + ' ' + val.std + ':00'
            this.ruleForm.signFormConfigFormatVO.returnStation.fieldValue = val.deptAirportName + (val.deptTerminal !== null ? val.deptTerminal : '')
        },
        getFlightStatusForSongzhan() { // 送站获取航班详情
            if (this.ruleForm.signFormConfigFormatVO.returnTime.fieldValue !== null &&
                this.ruleForm.signFormConfigFormatVO.returnTime.fieldValue !== '' &&
                this.ruleForm.signFormConfigFormatVO.returnFlight.fieldValue !== null &&
                this.ruleForm.signFormConfigFormatVO.returnFlight.fieldValue !== '') {
                var loadSongzhan = showLoading()
                getFlightNews({ 'flag': 'dept', 'fnum': this.ruleForm.signFormConfigFormatVO.returnFlight.fieldValue, 'querydate': this.ruleForm.signFormConfigFormatVO.returnTime.fieldValue.substr(0, 10) }).then(res => {
                    if (res.result !== null && res.result.model !== null && res.result.model.errCode === '0' && res.result.model.flightStatusList !== null && res.result.model.flightStatusList.length > 0) {
                        if (res.result.model.flightStatusList.length === 1) {
                            this.ruleForm.returnTime = res.result.model.flightStatusList[res.result.model.flightStatusList.length - 1].std
                            this.ruleForm.signFormConfigFormatVO.returnTime.fieldValue = res.result.model.flightStatusList[res.result.model.flightStatusList.length - 1].deptFlightDate + ' ' + res.result.model.flightStatusList[res.result.model.flightStatusList.length - 1].std + ':00'
                            this.ruleForm.signFormConfigFormatVO.returnStation.fieldValue = res.result.model.flightStatusList[res.result.model.flightStatusList.length - 1].deptAirportName + (res.result.model.flightStatusList[res.result.model.flightStatusList.length - 1].deptTerminal !== null ? res.result.model.flightStatusList[res.result.model.flightStatusList.length - 1].deptTerminal : '')
                        } else {
                            this.pickReturnStationVisible = true
                            this.returnStations = res.result.model.flightStatusList
                        }
                    }
                    //  else {
                    //     this.ruleForm.signFormConfigFormatVO.returnStation.fieldValue = ''
                    // }
                    closeLoading(loadSongzhan)
                })
            }
        },
        closePage() { // 关闭Tab页
            this.$store.dispatch('tagsBar/delVisitedView', this.$route)
            this.$router.go(-1)
            // window.close()
        },
        getLogList(val) { // 获取log列表
            var tempData = { conferenceId: getConferenceId(), attendeeId: this.$route.params.id }
            if (val !== null && val !== '') {
                tempData.bizCode = val
            }
            getLogList(tempData).then(res => {
                this.logData = res.result.list

                var baomingshijians = this.logData.filter(item => item.operateType === 101 || item.operateType === 102 || item.operateType === 103)
                if (baomingshijians !== null && baomingshijians.length > 0) {
                    this.baomingshijian = baomingshijians[baomingshijians.length - 1].createTime
                }
            })
        },
        shezhimorenzhi() {
            this.ruleForm.signFormConfigFormatVO.honourFlag.fieldValue = '1'
            // alert(this.ruleForm.signFormConfigFormatVO.sex.fieldValue)
            if (this.ruleForm.signFormConfigFormatVO.sex.fieldValue === null ||
                this.ruleForm.signFormConfigFormatVO.sex.fieldValue === '') {
                this.ruleForm.signFormConfigFormatVO.sex.fieldValue = '1'
            }

            if (this.ruleForm.signFormConfigFormatVO.cardFlag.fieldValue === null ||
                this.ruleForm.signFormConfigFormatVO.cardFlag.fieldValue === '') {
                this.ruleForm.signFormConfigFormatVO.cardFlag.fieldValue = '0'
            }

            if (this.ruleForm.signFormConfigFormatVO.bookDinnerFlag.fieldValue === null ||
                this.ruleForm.signFormConfigFormatVO.bookDinnerFlag.fieldValue === '') {
                this.ruleForm.signFormConfigFormatVO.bookDinnerFlag.fieldValue = '0'
            }

            if (this.ruleForm.signFormConfigFormatVO.bookStayFlag.fieldValue === null ||
                this.ruleForm.signFormConfigFormatVO.bookStayFlag.fieldValue === '') {
                this.ruleForm.signFormConfigFormatVO.bookStayFlag.fieldValue = '0'
            }

            if (this.ruleForm.signFormConfigFormatVO.bookTicketFlag.fieldValue === null ||
                this.ruleForm.signFormConfigFormatVO.bookTicketFlag.fieldValue === '') {
                this.ruleForm.signFormConfigFormatVO.bookTicketFlag.fieldValue = '0'
            }

            if (this.ruleForm.signFormConfigFormatVO.pickUpFlag.fieldValue === null ||
                this.ruleForm.signFormConfigFormatVO.pickUpFlag.fieldValue === '') {
                this.ruleForm.signFormConfigFormatVO.pickUpFlag.fieldValue = '0'
            }

            if (this.ruleForm.signFormConfigFormatVO.pickOutFlag.fieldValue === null ||
                this.ruleForm.signFormConfigFormatVO.pickOutFlag.fieldValue === '') {
                this.ruleForm.signFormConfigFormatVO.pickOutFlag.fieldValue = '0'
            }

            this.ruleForm.sourceType = 3
            this.ruleForm.conferenceId = getConferenceId()
        },
        getSignForm(dataTemp) { // 获取报名表单
            console.log(dataTemp)
            getSignForm(dataTemp).then(res => {
                this.ruleForm = this.formatResultAddTime(res.result)
                var temp = res.result
                temp.honourFlag
                this.shezhimorenzhi()
            })
        },
        pickHonour() { // 选择主宾
            this.ruleForm.signFormConfigFormatVO.honourId.fieldValue = this.honour.id
            this.honourName = this.honour.name
            this.closeHonourDialog()
        },
        closeHonourDialog() { // 关闭获取主宾的页面
            this.honour.id = null
            this.honour.name = null
            this.radio = null
            this.honourDialogVisible = false
        },
        radioChange(val) { // 选择主宾变化
            this.honour.id = val.id
            this.honour.name = val.fixAttributeCommonVO.attendeeName
        },
        search() { // 获取主宾
            this.getHonourList()
        },
        xuanzezhubin() { // 打开选择主宾页面
            this.getHonourList()
            this.honourDialogVisible = true
        },
        getHonourList() { // 获取主宾列表
            getHonourList(this.pageInfo).then(res => {
                this.honours = res.result.list
            })
        },
        closeDialog() { // 关闭审核页面
            this.dialogVisible = false
            this.examineForm = {
                signStatus: 2,
                verifyReason: null
            }
        },
        getPositionLevels() { // 获取职级列表
            getDicList({ 'code': 'positionLevel' }).then(response => {
                this.positionLevels = response.result
            })
        },
        getSignConfig() { // 获取报名设置
            getSignConfig({ 'conferenceId': getConferenceId() }).then(res => {
                this.signConfig = res.result
            })
        },
        getConferenceView() { // 获取会议详情
            getConferenceView({ 'id': getConferenceId() }).then(res => {
                this.conferenceView = res.result
            })
        },
        getAgendaList() { // 获取会议议程树
            getAgendaList({ 'conferenceId': getConferenceId(), 'queryFlag': 1 }).then(res => {
                this.agendas = res.result
            })
        },
        refreshPage() {
            const h = this.$createElement
            this.$msgbox({
                title: '提示',
                message: h('p', null, [
                    h('span', null, '报名人信息发生变化，请刷新页面后再做审核')
                ]),
                confirmButtonText: '我知道了'
            }).then(action => {
                this.getView()
                this.closeDialog()
            }).catch(action => {
                this.getView()
                this.closeDialog()
            })
        },
        returnSubmit() { // 提交审核不通过
            this.$refs['examineForm'].validate(valid => {
                if (valid) {
                    this.$confirm('请确认是否审核不通过该报名信息？', '', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        // 修改审核默认值
                        const data = {
                            conferenceId: getConferenceId(),
                            attendeeId: this.userId,
                            auditMind: this.examineForm.verifyReason,
                            id: this.verifyReasonData[this.choiceIndex].id,
                            type: this.choiceIndex
                        }
                        editConferenceVerifyReason(data).then(res => {
                            this.verifyReasonData = res.result
                        })
                        /* 修改审核默认值结束 */
                        this.loading = true
                        this.examineForm.attendeeIds = [this.ruleForm.attendeeId !== null ? this.ruleForm.attendeeId : this.ruleForm.id]
                        this.examineForm.auditType = this.taskView.type
                        this.examineForm.attendeeModifyTime = this.ruleForm.modifyTime

                        examineBatch(this.examineForm).then(res => {
                            if (res.success) {
                                this.getView()
                                this.$message(res.message)
                                this.closeDialog()
                                this.closePage()
                            }
                            if (res.message === '报名信息发生改变') {
                                this.refreshPage()
                            }
                            this.loading = false
                        }).catch(() => {
                            this.loading = false
                        })

                        // if (this.taskView.type !== 3 && this.taskView.type !== 5) {
                        //     this.examineForm.submitFlag = 0
                        //     if (this.$route.name === 'attendeeViewForCheck') {
                        //         this.ruleForm.updateFlag = this.taskView.type
                        //     }
                        //     this.ruleForm.signFormConfigFormatPO = this.ruleForm.signFormConfigFormatVO
                        //     this.examineForm.attendeeCommonPO = this.ruleForm
                        //     examine(this.examineForm).then(res => {
                        //         if (res.success) {
                        //             this.getView()
                        //             this.$message(res.message)
                        //             this.closeDialog()
                        //             this.closePage()
                        //         }
                        //         this.loading = false
                        //     }).catch(() => {
                        //         this.loading = false
                        //     })
                        // } else {
                        //     examineBatch(this.examineForm).then(res => {
                        //         if (res.success) {
                        //             this.getView()
                        //             this.$message(res.message)
                        //             this.closeDialog()
                        //             this.closePage()
                        //         }
                        //         this.loading = false
                        //     }).catch(() => {
                        //         this.loading = false
                        //     })
                        // }
                    }).catch(() => {
                        this.loading = false
                    })
                } else {
                    this.loading = false
                }
            })
        },
        shenhetongguo() { // 提交审核通过
            this.validFlag = 1
            var that = this
            setTimeout(() => {
                that.$refs['ruleForm'].validate(valid => {
                    if (valid) {
                        that.$refs['ruleForm1'].validate(valid1 => {
                            if (valid1) {
                                this.$confirm('请确认是否审核通过该报名信息？', '', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    that.loading = true

                                    that.examineForm.attendeeIds = [this.ruleForm.attendeeId !== null ? this.ruleForm.attendeeId : this.ruleForm.id]
                                    that.examineForm.signStatus = 3

                                    that.examineForm.auditType = this.taskView.type
                                    this.examineForm.attendeeModifyTime = this.ruleForm.modifyTime

                                    // examineBatch(that.examineForm).then(res => {
                                    //     if (res.success) {
                                    //         that.getView()
                                    //         that.$message(res.message)
                                    //         that.closeDialog()
                                    //         that.closePage()
                                    //     }
                                    //     if (res.message === '报名信息发生改变') {
                                    //         this.refreshPage()
                                    //     }
                                    //     that.loading = false
                                    // }).catch(() => {
                                    //     that.loading = false
                                    // })

                                    if (that.taskView.type !== 3 && this.taskView.type !== 5) {
                                        that.ruleForm.signFormConfigFormatPO = this.ruleForm.signFormConfigFormatVO
                                        if (that.$route.name === 'attendeeViewForCheck') {
                                            that.ruleForm.updateFlag = this.taskView.type
                                        }
                                        that.examineForm.attendeeCommonPO = this.ruleForm
                                        that.examineForm.submitFlag = 0

                                        examine(that.examineForm).then(res => {
                                            if (res.success) {
                                                // this.getView()
                                                that.$message(res.message)
                                                that.closeDialog()
                                                that.closePage()
                                            }
                                            if (res.message === '报名信息发生改变') {
                                                this.refreshPage()
                                            }
                                            that.loading = false
                                        }).catch(() => {
                                            that.loading = false
                                        })
                                    } else {
                                        examineBatch(that.examineForm).then(res => {
                                            if (res.success) {
                                                that.getView()
                                                that.$message(res.message)
                                                that.closeDialog()
                                                that.closePage()
                                            }
                                            if (res.message === '报名信息发生改变') {
                                                this.refreshPage()
                                            }
                                            that.loading = false
                                        }).catch(() => {
                                            that.loading = false
                                        })
                                    }
                                }).catch(() => {
                                    that.loading = false
                                })
                            } else {
                                this.activeNameSignup = 'second'
                                that.loading = false
                            }
                        })
                    } else {
                        this.activeNameSignup = 'first'
                        that.loading = false
                    }
                })
            }, 100)
        },
        shenhebutongguo() { // 打开审核不通过页面
            this.validFlag = 1
            var that = this

            that.dialogVisible = true
            that.examineForm = {
                signStatus: 2,
                verifyReason: null
            }
            loginInfo().then(res => {
                this.userId = res.result.id
                // 每次打开弹窗将默认值带过来
                getConferenceVerifyReason({ 'conferenceId': getConferenceId(), attendeeId: this.userId }).then(res => {
                    console.log(res)
                    this.verifyReasonData = res.result
                    this.$set(this.examineForm, 'verifyReason', this.verifyReasonData[0].auditMind)
                })
            })

            // setTimeout(() => {
            //     that.$refs['ruleForm'].validate(valid => {
            //         if (valid) {
            //             that.$refs['ruleForm1'].validate(valid1 => {
            //                 if (valid1) {

            //                 } else {
            //                     this.activeNameSignup = 'second'
            //                     that.loading = false
            //                 }
            //             })
            //         } else {
            //             this.activeNameSignup = 'first'
            //             that.loading = false
            //         }
            //     })
            // }, 100)
        },
        tijiao() { // 提交
            this.validFlag = 1
            this.loading = true
            var that = this
            setTimeout(function() {
                that.$refs['ruleForm'].validate(valid => {
                    console.log(valid)
                    if (valid) {
                        that.$refs['ruleForm1'].validate(valid1 => {
                            if (valid1) {
                                if (that.$route.name === 'attendeeViewForUpdate') {
                                    that.ruleForm.sourceType = 1
                                } else {
                                    that.ruleForm.sourceType = 4
                                }
                                that.ruleForm.signFormConfigFormatPO = that.ruleForm.signFormConfigFormatVO
                                that.ruleForm.submitFlag = 1
                                that.ruleForm.roleFlag = 1
                                console.log(1)
                                update(that.ruleForm).then(res => {
                                    console.log(2)
                                    if (res.success) {
                                        // getView({ 'id': res.result }).then(res => {
                                        //     that.ruleForm = res.result
                                        //     that.formHeight = getTableHeight(148) + 'px'
                                        // })
                                        that.closePage()
                                        that.$message(res.message)
                                    }
                                    that.loading = false
                                }).catch(() => {
                                    that.loading = false
                                })
                            } else {
                                console.log(3)
                                this.activeNameSignup = 'second'
                                that.loading = false
                            }
                        })
                    } else {
                        console.log(4)
                        this.activeNameSignup = 'first'
                        that.loading = false
                    }
                })
            }, 100)
        },
        zancun() { // 暂存
            this.validFlag = 0
            this.loading = true
            var that = this
            setTimeout(function() {
                that.$refs['ruleForm'].validate(valid => {
                    that.validFlag = 1
                    if (valid) {
                        that.$refs['ruleForm1'].validate(valid1 => {
                            if (valid1) {
                                if (that.$route.name === 'attendeeViewForUpdate') {
                                    that.ruleForm.sourceType = 1
                                } else {
                                    that.ruleForm.sourceType = 4
                                }
                                that.ruleForm.signFormConfigFormatPO = that.ruleForm.signFormConfigFormatVO
                                that.ruleForm.submitFlag = 0
                                that.ruleForm.roleFlag = 1
                                update(that.ruleForm).then(res => {
                                    if (res.success) {
                                        getView({ 'id': res.result }).then(res => {
                                            that.ruleForm = that.formatResultAddTime(res.result)
                                            this.getCurrentCardNum()
                                            this.getArriveTimeView()

                                            if (res.result.signFormConfigFormatVO.photoUrl.fieldValue !== null && res.result.signFormConfigFormatVO.photoUrl.fieldValue !== '') {
                                                that.fileList = [{ 'name': res.result.signFormConfigFormatVO.photoUrl.fieldValue, 'url': that.imagePath + res.result.signFormConfigFormatVO.photoUrl.downloadUrl }]
                                                that.hideUploadEdit = that.fileList.length >= 1
                                            }
                                            this.getOaFlowLogByAttendeeId()
                                            this.getLogList()

                                            // if (that.$route.name !== 'attendeeViewForCheck') {
                                            //     that.formHeight = getTableHeight(148) + 'px'
                                            // }
                                        })
                                        that.$message(res.message)
                                    }
                                    that.loading = false
                                }).catch(() => {
                                    that.loading = false
                                })
                            } else {
                                this.activeNameSignup = 'second'
                                that.loading = false
                            }
                        })
                    } else {
                        this.activeNameSignup = 'first'
                        that.loading = false
                    }
                })
            }, 100)
        },
        baocun() { // 保存
            this.loading = true
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    this.$refs['ruleForm1'].validate(valid1 => {
                        if (valid1) {
                            this.ruleForm.signFormConfigFormatPO = this.ruleForm.signFormConfigFormatVO
                            this.ruleForm.submitFlag = 0
                            this.ruleForm.roleFlag = 1

                            if (this.$route.name === 'attendeeViewForCheck') {
                                this.ruleForm.updateFlag = this.$route.params.type
                            } else if (this.$route.name === 'attendeeViewForSignUp') {
                                this.ruleForm.updateFlag = 2
                            } else {
                                this.ruleForm.updateFlag = 4
                            }

                            update(this.ruleForm).then(res => {
                                if (res.success) {
                                    this.getView()
                                    this.$message(res.message)
                                    this.getOaFlowLogByAttendeeId()
                                    this.getLogList()
                                    // this.closePage()
                                }
                                this.loading = false
                            }).catch(() => {
                                this.loading = false
                            })
                        } else {
                            this.activeNameSignup = 'second'
                            this.loading = false
                        }
                    })
                } else {
                    this.activeNameSignup = 'first'
                    this.loading = false
                }
            })
        },
        onSubmit() { //
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    if (this.ruleForm.id !== null && this.ruleForm.id !== '' && this.ruleForm.id !== undefined) {
                        // update(this.ruleForm)
                    }
                }
            })
        },
        getNations() { // 获取民族
            getDicList({ 'code': 'nation' }).then(response => {
                this.nations = response.result
            })
        },
        getCardTypes() { // 获取证件类型
            getDicList({ 'code': 'cardType' }).then(response => {
                this.cardTypes = response.result
            })
        },
        getView() { // 获取参会人详情
            getView({ 'id': this.$route.params.id }).then(res => {
                this.ruleForm = this.formatResultAddTime(res.result)
                this.getCurrentCardNum()
                this.getArriveTimeView()
                if (res.result.signFormConfigFormatVO.photoUrl.fieldValue !== null && res.result.signFormConfigFormatVO.photoUrl.fieldValue !== '') {
                    this.fileList = [{ 'name': res.result.signFormConfigFormatVO.photoUrl.fieldValue, 'url': this.imagePath + res.result.signFormConfigFormatVO.photoUrl.downloadUrl }]
                    this.hideUploadEdit = this.fileList.length >= 1
                }
                if (!this.$route.name === 'attendeeViewForCheck') {
                    this.formHeight = getTableHeight(148) + 'px'
                }
            })
        },
        getTagList() { // 获取标签列表
            getTagList({ 'conferenceId': getConferenceId() }).then(res => {
                this.tags = res.result.list
            })
        },
        /** *********************************图片上传相关开始***********************/
        onSuccessImg(response, file, fileList) { // 图片上传成功
            if (response.code === 2000) {
                // this.imageUrl = URL.createObjectURL(file.raw)
                this.$refs.ruleForm.clearValidate('signFormConfigFormatVO.photoUrl.fieldValue')
                this.ruleForm.signFormConfigFormatVO.photoUrl.fieldValue = response.result[0].filePath
            } else {
                this.$message(response.message)
                this.ruleForm.signFormConfigFormatVO.photoUrl.fieldValue = ''
            }
        },
        handleRemoveImg(file, fileList) {
            this.ruleForm.signFormConfigFormatVO.photoUrl.fieldValue = ''
            this.hideUploadEdit = fileList.length >= 1
        },
        beforeUploadImg(file, val) {
            if (val !== null) {
                return (new Promise((resolve, reject) => {
                    this.uploadData.conferenceId = getConferenceId()
                    const fileName = file.name.substring(file.name.lastIndexOf('.') + 1)

                    if (val.accept !== null && val.accept !== '' && val.accept.indexOf(fileName) === -1) {
                        this.$message({
                            message: '上传文件格式不正确，请选择' + val.accept + '的文件!',
                            type: 'info'
                        })
                        reject()
                    }

                    const isLt5M = file.size / 1024 / 1024 > (val.maxVal === null || val.maxVal === '' ? 50 : val.maxVal)
                    if (isLt5M) {
                        this.$message({
                            message: '图片大小不能超过' + (val.maxVal === null || val.maxVal === '' ? 50 : val.maxVal) + 'M!',
                            type: 'info'
                        })
                        reject()
                    }

                    checkPngHeightWidth(file, val.picMaxWidth, val.picMinWidth, val.picMaxHeight, val.picMinHeight, (val, val1) => {
                        if (!val) {
                            this.$message(val1)
                            reject()
                        }
                        resolve(file)
                    })
                }))
            } else {
                this.uploadData.conferenceId = getConferenceId()

                const isLt5M = file.size / 1024 / 1024 > 50
                if (isLt5M) {
                    this.$message({
                        message: '图片大小超过限制!',
                        type: 'info'
                    })
                    return false
                }
                return true
            }
        },
        onExceedImg(files, fileList) {
            this.$message('请删除已上传附件')
        },
        handleChange(file, fileList) {
            // 大于1张隐藏
            this.hideUploadEdit = fileList.length >= 1
        },
        /** *********************************图片上传相关结束***********************/

        /** *********************************议程树相关开始***********************/
        filterNode(value, data) {
            if (!value) return true
            if (data.name !== undefined) {
                return data.name.indexOf(value) !== -1
            } else {
                return false
            }
        },
        pickAgenda(data, event) {
            if (event) {
                if (data.groupId !== null && this.checkGroupIds.indexOf(data.groupId) === -1) {
                    this.checkGroupIds.push(data.groupId)
                }
                this.ruleForm.agendaIds.push(data.id)
            } else {
                if (data.groupId !== null && this.checkGroupIds.indexOf(data.groupId) !== -1) {
                    this.checkGroupIds.splice(this.checkGroupIds.indexOf(data.groupId), 1)
                }
                var index = this.ruleForm.agendaIds.indexOf(data.id)
                if (index > -1) {
                    this.ruleForm.agendaIds.splice(index, 1)
                }
                // this.ruleForm.agendaIds.foreach(item =)
            }
            //    this.ruleForm.agendaIds = []
        },
        renderContent(h, { node, data, store }) {
            // alert(JSON.stringify(this.ruleForm.agendaIds))
            if (this.ruleForm.agendaIds === null) {
                this.ruleForm.agendaIds = []
            }

            // if (!(data.attendeeShowFlag === 0 || (data.attendeeShowFlag === 2 && this.ruleForm.agendaIds.indexOf(data.id) === -1))) {
            if (this.ruleForm.agendaIds.indexOf(data.id) !== -1 && data.groupId !== null && this.checkGroupIds.indexOf(data.groupId) === -1) {
                this.checkGroupIds.push(data.groupId)
            }

            if (data.parentId === undefined) {
                return (
                    <span class='custom-tree-node' style='width:100%;padding-right:10px;'>
                        <span style='font-size:14px;line-height:32px;color:#191F24;' title={data.date}>{data.date}</span>
                    </span>)
            } else {
                // this.signConfig.agendaFreeFlag === 0 ||
                var allDisabled = data.freeFlag === 0
                if (allDisabled) {
                    if (this.ruleForm.agendaIds.indexOf(data.id) === -1) {
                        this.ruleForm.agendaIds.push(data.id)
                    }
                }
                var str = ''
                if (node.label.length > 10) {
                    str = node.label.substring(0, 10) + '...'
                } else {
                    str = node.label
                }
                // var dateStr = data.startTime + '~' + data.endTime

                var dateStr = (data.startTime !== null && data.startTime.length === 8 ? data.startTime.substr(0, 5) : data.startTime) +
                    '~' + (data.endTime !== null && data.endTime.length === 8 ? data.endTime.substr(0, 5) : data.endTime)

                return (
                    <span class='custom-tree-node' style='width:100%;padding-right:10px;padding-top:3px;height:40px' >
                        <span style='font-size:14px;line-height:32px;color:#191F24;' title={node.label} >{dateStr}<span style='margin-left:20px;'>{str}</span></span>
                        <span>
                            <el-checkbox disabled={allDisabled || this.allFormDisabled || (data.groupId !== null && this.checkGroupIds.indexOf(data.groupId) !== -1 && this.ruleForm.agendaIds.indexOf(data.id) === -1)} on-change={(event) => { this.pickAgenda(data, event) }} value={this.ruleForm.agendaIds.indexOf(data.id) !== -1 || allDisabled} style='margin-top:6px;float:right;font-size:14px;margin-right:20px' />
                        </span>
                        <span v-show={ data.recommend !== null && data.recommend !== '' } style='padding-left:2px;padding-right:2px;margin-left:10px;background: #FF8200;color:white;width: 52px;height: 20px;border-radius: 3px;font-size: 11px;line-height:13px;padding:3px;font-size: 11px;line-height:13px;padding:3px;font-family: PingFangSC-Medium, PingFang SC;'>{ data.recommend }</span>

                        <span v-show={ this.panduanqingjia(this.ruleForm.agendaVOs, data) } style='padding-left:2px;padding-right:2px;margin-left:10px;background: #F8B700;color:white;width: 52px;height: 20px;border-radius: 3px;font-size: 11px;line-height:13px;padding:3px;font-size: 11px;line-height:13px;padding:3px;font-family: PingFangSC-Medium, PingFang SC;'>请假</span>
                    </span>)
            }
        },
        panduanqingjia(val1, val2) {
            if (val1 === null) {
                return false
            }
            var yichengTemp = val1.find(item => item.id === val2.id)
            if (yichengTemp === undefined) {
                return false
            }
            if (yichengTemp.leaveStatus === 1) {
                return true
            }
            return false
        },
        getAddressListByConferenceId() {
            getAddressListByConferenceId({ conferenceId: getConferenceId(), addressLike: null }).then(res => {
                if (res.success) {
                    var list = []
                    if (res.result.list !== null && res.result.list.length > 0) {
                        res.result.list.forEach(item => {
                            list.push({ value: item })
                        })
                        this.addressList = list
                        // clearTimeout(this.timeout)
                        // this.timeout = setTimeout(() => {

                        // }, 500)
                        // cb(list)
                    }
                }
            })
        },

        handleSelect() { },
        createStateFilter(queryString) {
            return (state) => {
                return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
            }
        },
        querySearchAsync(queryString, cb) {
            var results = queryString ? this.addressList.filter(this.createStateFilter(queryString)) : []
            cb(results)
        },
        /** *********************************议程树相关结束***********************/
        refreshSignConfig() { // 重新加载报名表单信息
            this.currentCardNum = null
            var valieMessage = ''
            this.$refs.ruleForm.validateField(['signFormConfigFormatVO.attendeeName.fieldValue', 'signFormConfigFormatVO.phone.fieldValue'], (valid) => {
                if (valid !== null && valid !== '') {
                    valieMessage = valid
                }
            })
            if (valieMessage !== null && valieMessage !== '') {
                return false
            }
            var nameTemp = this.ruleForm.signFormConfigFormatVO.attendeeName.fieldValue
            var phoneTemp = this.ruleForm.signFormConfigFormatVO.phone.fieldValue
            if (this.ruleForm.signFormConfigFormatVO.attendeeName.fieldValue !== null &&
                this.ruleForm.signFormConfigFormatVO.attendeeName.fieldValue !== '' &&
                this.ruleForm.signFormConfigFormatVO.phone.fieldValue !== null &&
                this.ruleForm.signFormConfigFormatVO.phone.fieldValue !== '') {
                var load = showLoading()
                getDraft({
                    'conferenceId': getConferenceId(),
                    'attendeeName': this.ruleForm.signFormConfigFormatVO.attendeeName.fieldValue,
                    'phone': this.ruleForm.signFormConfigFormatVO.phone.fieldValue
                }).then(res => {
                    if (!res.success) {
                        this.ruleForm.signFormConfigFormatVO.attendeeName.fieldValue = ''
                        this.ruleForm.signFormConfigFormatVO.phone.fieldValue = ''
                        closeLoading(load)
                    } else {
                        if (res.result !== null) {
                            this.ruleForm = this.formatResultAddTime(res.result)
                            this.getCurrentCardNum()
                            closeLoading(load)
                        } else {
                            getUser({
                                'userName': this.ruleForm.signFormConfigFormatVO.attendeeName.fieldValue,
                                'mobile': this.ruleForm.signFormConfigFormatVO.phone.fieldValue
                            }).then(res1 => {
                                if (!res1.success) {
                                    this.ruleForm.signFormConfigFormatVO.attendeeName.fieldValue = ''
                                    this.ruleForm.signFormConfigFormatVO.phone.fieldValue = ''
                                    closeLoading(load)
                                } else {
                                    if (res1.result !== null) {
                                        var queryData = { userId: res1.result.user.id, conferenceId: getConferenceId() }
                                        if (this.$route.name === 'attendeeViewForUpdate') {
                                            queryData.withoutTime = 1
                                        }
                                        vertifybyConferenceId(queryData).then(res3 => {
                                            if (res3.success) {
                                                var dataTemp = {
                                                    'conferenceId': getConferenceId(),
                                                    'innerFlag': res1.result.user.innerFlag
                                                }
                                                getSignForm(dataTemp).then(res2 => {
                                                    this.ruleForm.signFormConfigFormatVO = res2.result.signFormConfigFormatVO
                                                    this.ruleForm.signFormConfigFormatVO.honourFlag.fieldValue = '1'
                                                    this.ruleForm.signFormConfigFormatVO.attendeeName.fieldValue = nameTemp
                                                    this.ruleForm.signFormConfigFormatVO.phone.fieldValue = phoneTemp

                                                    this.ruleForm.conferenceId = getConferenceId()
                                                    this.ruleForm.innerFlag = res1.result.user.innerFlag
                                                    this.ruleForm.sourceType = 4

                                                    this.ruleForm.userId = res1.result.user.id

                                                    this.currentCardNum = res1.result.idNumber
                                                    if (this.ruleForm.signFormConfigFormatVO.cardType.showFlag === 0 || this.ruleForm.signFormConfigFormatVO.cardType.fieldValue === '1') {
                                                        this.ruleForm.signFormConfigFormatVO.cardNum.fieldValue = res1.result.idNumber
                                                    }

                                                    if (res1.result.user.innerFlag === 1) {
                                                        if (res1.result.sex !== null && res1.result.sex !== '') {
                                                            this.ruleForm.signFormConfigFormatVO.sex.fieldValue = res1.result.sex + ''
                                                        }

                                                        this.ruleForm.signFormConfigFormatVO.nation.fieldValue = res1.result.nationality
                                                        this.ruleForm.signFormConfigFormatVO.organizationName.fieldValue = res1.result.mainJobOrg.companyName
                                                        this.ruleForm.signFormConfigFormatVO.organizationSortName.fieldValue = res1.result.mainJobOrg.companyShortName

                                                        this.ruleForm.signFormConfigFormatVO.deptName.fieldValue = res1.result.mainJobOrg.deptName
                                                        this.ruleForm.signFormConfigFormatVO.deptShortName.fieldValue = res1.result.mainJobOrg.deptShortName

                                                        this.ruleForm.signFormConfigFormatVO.position.fieldValue = res1.result.mainJobOrg.userTitle
                                                        this.ruleForm.signFormConfigFormatVO.email.fieldValue = res1.result.email
                                                    }
                                                    this.ruleForm.signFormConfigFormatVO.phoneForMsg.fieldValue = this.ruleForm.signFormConfigFormatVO.phone.fieldValue
                                                    this.shezhimorenzhi()
                                                    closeLoading(load)
                                                    // alert(JSON.stringify(this.ruleForm))
                                                }).catch(() => {
                                                    this.ruleForm.signFormConfigFormatVO.attendeeName.fieldValue = ''
                                                    this.ruleForm.signFormConfigFormatVO.phone.fieldValue = ''
                                                    closeLoading(load)
                                                })
                                            } else {
                                                this.ruleForm.signFormConfigFormatVO.attendeeName.fieldValue = ''
                                                this.ruleForm.signFormConfigFormatVO.phone.fieldValue = ''
                                                closeLoading(load)
                                            }
                                        }).catch(() => {
                                            this.ruleForm.signFormConfigFormatVO.attendeeName.fieldValue = ''
                                            this.ruleForm.signFormConfigFormatVO.phone.fieldValue = ''
                                            closeLoading(load)
                                        })
                                    } else {
                                        var queryData1 = { userId: null, conferenceId: getConferenceId() }
                                        if (this.$route.name === 'attendeeViewForUpdate') {
                                            queryData1.withoutTime = 1
                                        }
                                        vertifybyConferenceId(queryData1).then(res3 => {
                                            if (res3.success) {
                                                var dataTemp1 = {
                                                    'conferenceId': getConferenceId(),
                                                    'innerFlag': 0
                                                }
                                                getSignForm(dataTemp1).then(res2 => {
                                                    this.ruleForm.signFormConfigFormatVO = res2.result.signFormConfigFormatVO
                                                    this.ruleForm.signFormConfigFormatVO.honourFlag.fieldValue = '1'
                                                    this.ruleForm.signFormConfigFormatVO.attendeeName.fieldValue = nameTemp
                                                    this.ruleForm.signFormConfigFormatVO.phone.fieldValue = phoneTemp
                                                    this.ruleForm.conferenceId = getConferenceId()
                                                    this.ruleForm.innerFlag = 0
                                                    this.ruleForm.sourceType = 4
                                                    this.ruleForm.signFormConfigFormatVO.phoneForMsg.fieldValue = this.ruleForm.signFormConfigFormatVO.phone.fieldValue
                                                    this.shezhimorenzhi()
                                                    closeLoading(load)
                                                    // alert(JSON.stringify(this.ruleForm))
                                                }).catch(() => {
                                                    this.ruleForm.signFormConfigFormatVO.attendeeName.fieldValue = ''
                                                    this.ruleForm.signFormConfigFormatVO.phone.fieldValue = ''
                                                    closeLoading(load)
                                                })
                                            } else {
                                                this.ruleForm.signFormConfigFormatVO.attendeeName.fieldValue = ''
                                                this.ruleForm.signFormConfigFormatVO.phone.fieldValue = ''
                                                closeLoading(load)
                                            }
                                        }).catch(() => {
                                            this.ruleForm.signFormConfigFormatVO.attendeeName.fieldValue = ''
                                            this.ruleForm.signFormConfigFormatVO.phone.fieldValue = ''
                                            closeLoading(load)
                                        })
                                    }
                                }
                            }).catch(() => {
                                this.ruleForm.signFormConfigFormatVO.attendeeName.fieldValue = ''
                                this.ruleForm.signFormConfigFormatVO.phone.fieldValue = ''
                                closeLoading(load)
                            })
                        }
                    }
                }).catch(() => {
                    this.ruleForm.signFormConfigFormatVO.attendeeName.fieldValue = ''
                    this.ruleForm.signFormConfigFormatVO.phone.fieldValue = ''
                    closeLoading(load)
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.width360 {
    width: 360px;
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

.tianjiahuiyizuzhiClass {
    width: 100px;
    height: 32px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #1e89ff;
}

.shenhebutongguoActiveClass {
    margin-top: 10px;
    background-color: #ff8200;
}

.shenhebutongguoDisabledClass {
    margin-top: 10px;
    background-color: #ff8200;
    opacity: 0.5;
}

.titleClass {
    height: 16px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #00274c;
    line-height: 16px;
}

.contentClass {
    margin-top: 8px;
    width: 292px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #191f24;
    line-height: 18px;
}

.remarkTitleClass {
    margin-top: 16px;
    width: 36px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(25, 31, 36, 0.64);
    line-height: 16px;
}

.remarkClass {
    width: 256px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(25, 31, 36, 0.64);
    line-height: 16px;
}
.nameClass {
    height: 22px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(25, 31, 36, 0.64);
    line-height: 22px;
}
.phone-custom::v-deep {
    position: relative;
    width: 360px;
    margin-left: 5%;
    .width260 {
        width: 260px;
    }
    .phone-custom-btn {
        color: #1890f0;
        width: 90px;
        height: 32px;
        position: absolute;
        right: 0;
        top: 0;
        text-align: center;
        line-height: 32px;
        padding: 0;
        border: 1px solid #1890f0;
    }
    .phone-custom-tips {
        overflow: hidden;
        > div {
            cursor: pointer;
            color: #1890f0;
            padding: 10px 0 0;
            float: left;
            div {
                display: inline-block;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                text-align: center;
                line-height: 16px;
                background-color: #fff;
                border: 1px solid #1890f0;
                margin-right: 4px;
            }
        }
    }
}
</style>
<style lang="scss">
.phone-custom-alert {
    width: 300px;
    padding-bottom: 0;
    dl {
        padding: 10px;
        box-sizing: border-box;
        background-color: rgba(242, 242, 242, 1);
        dd {
            margin-left: 0;
            position: relative;
            display: flex;
            align-items: center;
            &::before {
                content: '';
                display: block;
                width: 3px;
                height: 3px;
                border-radius: 50%;
                background-color: #555;
                margin: 0 5px 0 7px;
            }
        }
    }
    .el-message-box__content {
        padding-bottom: 0;
    }
    .el-message-box__btns {
        padding: 0;
        .el-button {
            padding: 0;
            width: 100%;
            line-height: 40px;
            border-radius: 0;
            background-color: #fff;
            border: 0;
            color: #303133;
            border-top: 1px solid #eee;
            font-size: 14px;
            &:nth-of-type(1) {
                color: #1890f0;
            }
        }
    }
    .el-message-box__btns button:nth-child(2) {
        margin-left: 0;
    }
}
</style>
