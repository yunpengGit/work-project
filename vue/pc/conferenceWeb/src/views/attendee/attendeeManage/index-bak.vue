<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:8px">
        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form :inline="true" :model="pageInfo">
                    <div class="inquire_form">
                    <div class="form_left">
                    <el-form-item label="姓名">
                        <el-input
                            v-model.trim="pageInfo.attendeeNameLike"
                            class="widthClass"
                            maxlength="25"
                            placeholder=""
                        />
                    </el-form-item>

                    <!-- <el-form-item label="手机">
                        <el-input v-model.trim="pageInfo.phoneLike" class="widthClass" maxlength="25" placeholder="" />
                    </el-form-item> -->

                    <el-form-item label="职务">
                        <el-input v-model.trim="pageInfo.positionLike" class="widthClass" maxlength="25" placeholder="" />
                    </el-form-item>

                    <el-form-item label="单位名称">
                        <el-input
                            v-model.trim="pageInfo.allOrganizationNameLike"
                            class="widthClass"
                            maxlength="25"
                            placeholder=""
                        />
                    </el-form-item>
                    </div>
                    <el-form-item class="form_operation">
                         <el-button
                            :class="dakaichaxunClass === 1 ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
                            type="text"
                            style="margin-left:10px;margin-right:5px"
                            @click="dakaichaxun"
                        />
                        <el-button type="primary" @click="search">查询</el-button>
                        <el-button @click="resetSearch">重置</el-button>
                       
                    </el-form-item>
                    </div>
                    <el-form-item v-if="dakaichaxunClass === 0" label="职级" clearable>
                        <el-select v-model="pageInfo.positionLevel" class="width100Class" placeholder="全部" clearable>
                            <el-option
                                v-for="item in positionLevels"
                                :key="item.valCode"
                                :label="item.valName"
                                :value="item.valCode"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="标签">
                        <el-select v-model="pageInfo.tagIdsIn" class="width100Class" placeholder="全部" clearable>
                            <el-option v-for="item in tagList" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" :label="getConferenceTemplate(2) + '类型'">
                        <el-select v-model="pageInfo.honourFlag" class="width100Class" placeholder="全部" clearable>
                            <el-option :key="1" label="主宾" :value="1" />
                            <el-option :key="0" label="随员" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="参会状态">
                        <el-select v-model="pageInfo.signStatusTemp" class="width100Class" placeholder="全部" clearable>
                            <el-option
                                v-for="item in meetingStatuss"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item v-if="dakaichaxunClass === 0 && pageInfo.honourFlag === 0" label="主宾姓名">
                        <el-input v-model.trim="pageInfo.honourNameLike" class="width100Class" maxlength="25" placeholder="" />
                    </el-form-item> -->
                    <el-form-item v-if="dakaichaxunClass === 0 && conferenceView.setAgendaFlag === 1" label="会议议程">
                        <el-cascader
                            v-model="pageInfo.agendaIdsIn"
                            style="width: 150px"
                            placeholder="全部"
                            class="widthClass"
                            :options="agendas"
                            clearable
                            collapse-tags
                            :props="{
                                emitPath: false,
                                multiple: true,
                                checkStrictly: true,
                                'label': 'name',
                                'value': 'id'
                            }"
                        />

                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="分组">
                        <el-select v-model="pageInfo.groupIdsIn" class="width100Class" placeholder="全部" clearable>
                            <el-option
                                v-for="item in attendeeGroups"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="参会方式" clearable>
                        <el-select v-model="pageInfo.sourceType" class="width100Class" placeholder="全部" clearable>
                            <el-option v-for="item in sourceTypes" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="是否制证" clearable>
                        <el-select v-model="pageInfo.cardFlag" class="width100Class" placeholder="全部" clearable>
                            <el-option :key="1" label="是" :value="1" />
                            <el-option :key="0" label="否" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="是否住宿" clearable>
                        <el-select v-model="pageInfo.bookStayFlag" class="width100Class" placeholder="全部" clearable>
                            <el-option :key="1" label="是" :value="1" />
                            <el-option :key="0" label="否" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="是否用餐" clearable>
                        <el-select v-model="pageInfo.bookDinnerFlag" class="width100Class" placeholder="全部" clearable>
                            <el-option :key="1" label="是" :value="1" />
                            <el-option :key="0" label="否" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="是否需要协助订票" clearable>
                        <el-select v-model="pageInfo.bookTicketFlag" class="width100Class" placeholder="全部" clearable>
                            <el-option :key="1" label="是" :value="1" />
                            <el-option :key="0" label="否" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="预订机票/车票/船票类型" clearable>
                        <el-select v-model="pageInfo.ticketFlag" class="width100Class" placeholder="全部" clearable>
                            <el-option :key="1" label="去程" :value="1" />
                            <el-option :key="2" label="返程" :value="2" />
                            <el-option :key="3" label="往返" :value="3" />
                        </el-select>
                    </el-form-item>
                </el-form>
                <el-form :inline="true" :model="pageInfo">
                    <el-form-item v-if="dakaichaxunClass === 0" label="是否接站" clearable>
                        <el-select v-model="pageInfo.pickUpFlag" class="width100Class" placeholder="全部" clearable>
                            <el-option :key="1" label="是" :value="1" />
                            <el-option :key="0" label="否" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="到达时间" clearable>
                        <el-date-picker
                            v-model="arriveTimes"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围"
                            size="small"
                            style="width:280px"
                        />
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="到达班次/车次">
                        <el-input
                            v-model.trim="pageInfo.arriveFlightLike"
                            class="widthClass keepOutRight"
                            maxlength="25"
                            placeholder=""
                        />
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="到达地点">
                        <el-input
                            v-model.trim="pageInfo.arriveStationLike"
                            class="widthClass keepOutRight"
                            maxlength="25"
                            placeholder=""
                        />
                    </el-form-item>
                </el-form>
                <el-form :inline="true" :model="pageInfo">
                    <el-form-item v-if="dakaichaxunClass === 0" label="是否送站" clearable>
                        <el-select v-model="pageInfo.pickOutFlag" class="width100Class" placeholder="全部" clearable>
                            <el-option :key="1" label="是" :value="1" />
                            <el-option :key="0" label="否" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="返程时间" clearable>
                        <el-date-picker
                            v-model="returnTimes"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围"
                            size="small"
                            style="width:280px"
                        />
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="返程班次/车次">
                        <el-input
                            v-model.trim="pageInfo.returnFlightLike"
                            class="widthClass keepOutRight"
                            maxlength="25"
                            placeholder=""
                        />
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="返程地点">
                        <el-input
                            v-model.trim="pageInfo.returnStationLike"
                            class="widthClass keepOutRight"
                            maxlength="25"
                            placeholder=""
                        />
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
            <div style="float: left; text-center: left;margin-left:10px;padding-bottom:10px;">
                <el-button v-permission="Global.buttons.AttendeeQuery.addTag" @click="dabiaoqian">批量打标签</el-button>
            </div>
            <div style="float: right; text-center: right;padding-bottom:10px;">
                <el-button v-permission="Global.buttons.AttendeeQuery.signup" type="primary" @click="addTempAttendee">
                    添加临时来宾</el-button>
                <el-button v-permission="Global.buttons.AttendeeQuery.signup" type="primary" @click="add">
                    添加{{ getConferenceTemplate(2) }}</el-button>
                <el-button v-permission="Global.buttons.AttendeeQuery.seq" @click="paixu">
                    {{ getConferenceTemplate(2) }}排序</el-button>
                <el-button @click="shaixuan">列表筛选</el-button>
                <el-button v-permission="Global.buttons.AttendeeQuery.export" @click="add">导出查询结果</el-button>
            </div>
            <el-table
                ref="table"
                :data="tableData"
                :height="(dakaichaxunClass === 0 ? (tableHeight - 208) : tableHeight)"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" />

                <el-table-column
                    v-for="columnItem in defaultColumnList"
                    :key="columnItem.code"
                    :label="columnItem.name"
                >
                    <template v-if="columnItem.code === 'attendeeName'" slot-scope="scope">
                        <el-tooltip placement="bottom" effect="light">
                            <div v-if="scope.row.fixAttributeCommonVO.honourFlag === 1" slot="content">

                                <div
                                    v-if="scope.row.linkAttendeeList !== null && scope.row.linkAttendeeList.length > 0"
                                >
                                    <div>
                                        随员信息：
                                    </div>
                                    <div v-for="item in scope.row.linkAttendeeList" :key="item.id">
                                        {{ item.attendeeName + '（' + item.phone + '）' }}
                                    </div>
                                </div>
                                <div v-else>
                                    随员信息：无
                                </div>
                            </div>
                            <div v-else slot="content">
                                <div>
                                    主宾信息：
                                </div>
                                <div v-for="item in scope.row.linkAttendeeList" :key="item.id">
                                    {{ item.attendeeName + '（' + item.phone + '）' }}
                                </div>
                            </div>
                            <div style="height:32px">
                                <AttendeeInfomation :photo-url="scope.row.ssoUserPhoto" :attendee-name="scope.row.fixAttributeCommonVO.attendeeName" :attendee-role-flag="scope.row.fixAttributeCommonVO.attendeeRoleFlag" :honour-flag="scope.row.fixAttributeCommonVO.honourFlag" :sex="scope.row.fixAttributeCommonVO.sex" />
                                <!-- <img style="width:32px;height:32px;float:left;border-radius:50%"
                                    :src="scope.row.fixAttributeCommonVO.photoUrl !== null && scope.row.fixAttributeCommonVO.photoUrl !== '' ? scope.row.fixAttributeCommonVO.photoUrl : (imagePath + defaultPhoto)">
                                <span style="margin-top:8px;margin-left:5px;float:left"
                                    :title="scope.row.fixAttributeCommonVO.attendeeName">{{ scope.row.fixAttributeCommonVO.attendeeName != null && scope.row.fixAttributeCommonVO.attendeeName.length > 4 ? scope.row.fixAttributeCommonVO.attendeeName.substr(0,4) + '...' : scope.row.fixAttributeCommonVO.attendeeName }}</span>
                                <span v-if="scope.row.fixAttributeCommonVO.honourFlag === 1"
                                    style="margin-top:8px;float:left">（主宾）</span>
                                <span v-else style="margin-top:8px;float:left">（随员）</span> -->
                            </div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="姓名">
                    <template slot-scope="scope">
                        <el-tooltip placement="bottom" effect="light">
                            <div v-if="scope.row.fixAttributeCommonVO.honourFlag === 1" slot="content">

                                <div
                                    v-if="scope.row.linkAttendeeList !== null && scope.row.linkAttendeeList.length > 0"
                                >
                                    <div>
                                        随员信息：
                                    </div>
                                    <div v-for="item in scope.row.linkAttendeeList" :key="item.id">
                                        {{ item.attendeeName + '（' + item.phone + '）' }}
                                    </div>
                                </div>
                                <div v-else>
                                    随员信息：无
                                </div>
                            </div>
                            <div v-else slot="content">
                                <div>
                                    主宾信息：
                                </div>
                                <div v-for="item in scope.row.linkAttendeeList" :key="item.id">
                                    {{ item.attendeeName + '（' + item.phone + '）' }}
                                </div>
                            </div>
                            <div style="height:32px">
                                <AttendeeInfomation :photo-url="scope.row.ssoUserPhoto" :attendee-name="scope.row.fixAttributeCommonVO.attendeeName" :attendee-role-flag="scope.row.fixAttributeCommonVO.attendeeRoleFlag" :honour-flag="scope.row.fixAttributeCommonVO.honourFlag" :sex="scope.row.fixAttributeCommonVO.sex" />
                                <!-- <img
                                    style="width:32px;height:32px;float:left;border-radius:50%"
                                    :src="scope.row.fixAttributeCommonVO.photoUrl !== null && scope.row.fixAttributeCommonVO.photoUrl !== '' ? scope.row.fixAttributeCommonVO.photoUrl : (imagePath + defaultPhoto)"
                                >
                                <span
                                    style="margin-top:8px;margin-left:5px;float:left"
                                    :title="scope.row.fixAttributeCommonVO.attendeeName"
                                >{{ scope.row.fixAttributeCommonVO.attendeeName != null && scope.row.fixAttributeCommonVO.attendeeName.length > 4 ? scope.row.fixAttributeCommonVO.attendeeName.substr(0,4) + '...' : scope.row.fixAttributeCommonVO.attendeeName }}</span>
                                <span
                                    v-if="scope.row.fixAttributeCommonVO.honourFlag === 1"
                                    style="margin-top:8px;float:left"
                                >（主宾）</span>
                                <span v-else style="margin-top:8px;float:left">（随员）</span> -->
                            </div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <!-- width="180" -->
                <el-table-column
                    v-show="conferenceView.useVehicleFlag === 1 || conferenceView.useCardFlag === 1
                        || conferenceView.useDinnerFlag === 1 || conferenceView.useRoomFlag === 1"
                    prop="name"
                    label="资源分配情况"
                >
                    <template slot-scope="scope">
                        <span
                            v-if="conferenceView.useVehicleFlag !== 1
                                && conferenceView.useCardFlag !== 1
                                && conferenceView.useDinnerFlag !== 1
                                && conferenceView.useRoomFlag !== 1"
                        >
                            -
                        </span>
                        <el-tag
                            v-if="conferenceView.useVehicleFlag === 1 && scope.row.vehicleStatus === 2"
                            style="background-color:#00B194;color:white"
                            type="info"
                        >车</el-tag>
                        <el-tag v-if="conferenceView.useVehicleFlag === 1 && scope.row.vehicleStatus !== 2" type="info">
                            车</el-tag>

                        <el-tag
                            v-if="conferenceView.useCardFlag === 1 && scope.row.ticketStatus === 2"
                            style="background-color:#00B194;color:white"
                            type="info"
                        >票</el-tag>
                        <el-tag v-if="conferenceView.useCardFlag === 1 && scope.row.ticketStatus !== 2" type="info">票
                        </el-tag>

                        <el-tag
                            v-if="conferenceView.useDinnerFlag === 1 && scope.row.foodStatus === 2"
                            style="background-color:#00B194;color:white"
                            type="info"
                        >餐</el-tag>
                        <el-tag v-if="conferenceView.useDinnerFlag === 1 && scope.row.foodStatus !== 2" type="info">餐
                        </el-tag>

                        <el-tag
                            v-if="conferenceView.useRoomFlag === 1 && scope.row.stayStatus === 2"
                            style="background-color:#00B194;color:white"
                            type="info"
                        >房</el-tag>
                        <el-tag v-if="conferenceView.useRoomFlag === 1 && scope.row.stayStatus !== 2" type="info">房
                        </el-tag>

                    </template>
                </el-table-column>
                <el-table-column label="职务">
                    <template slot-scope="scope">
                        <div :title="scope.row.fixAttributeCommonVO.position">
                            {{ formatTableCellData(scope.row.fixAttributeCommonVO.position) }}</div>
                    </template>
                </el-table-column>
                <!-- width="90" -->
                <el-table-column label="标签">
                    <template slot-scope="scope">
                        {{ scope.row.tagVOs !== null && scope.row.tagVOs.length > 0 ? '' : '-' }}
                        <el-tag
                            v-for="(tagVO, index) in scope.row.tagVOs"
                            :key="tagVO.id"
                            :style="index != 0 ? {'margin-left':'4px'} : {}"
                            type="info"
                        >
                            <el-tooltip placement="bottom" effect="light">
                                <div slot="content">
                                    {{ tagVO.name }}
                                </div>
                                <div class="danhangxianshibuquan">
                                    {{ tagVO.name !== null && tagVO.name.length > 5 ? tagVO.name.substr(0,4) + '...' : tagVO.name }}
                                </div>
                            </el-tooltip>
                        </el-tag>
                    </template>
                </el-table-column>
                <!-- width="120" -->
                <el-table-column label="手机">
                    <template slot-scope="scope">
                        <div>
                            <span>{{ formatTableCellData(formatPhone(scope.row.fixAttributeCommonVO.phone)) }}</span>
                            <span style="display:none">{{ scope.row.fixAttributeCommonVO.phone }}</span>
                            <el-button
                                v-show="scope.row.fixAttributeCommonVO.phone !== null && scope.row.fixAttributeCommonVO.phone !== ''"
                                icon="el-icon-view"
                                type="text"
                                @click="(event) => qiehuanshoujijiami(event)"
                            />
                        </div>
                        <!-- <div @click="xianshi">aaa</div> -->
                    </template>
                </el-table-column>
                <!-- width="120" -->
                <el-table-column prop="fixAttributeCommonVO.organizationSortName" label="单位简称/全称">
                    <template slot-scope="scope">
                        <div>
                            {{ formatOrgName(scope.row.fixAttributeCommonVO.organizationSortName,scope.row.fixAttributeCommonVO.organizationName) }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="参会状态">
                    <template slot-scope="scope">
                        {{ formatTableCellData(scope.row.meetingStatusStr) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="230">
                    <template slot-scope="scope">
                        <el-button
                            v-permission="Global.buttons.AttendeeQuery.view"
                            @click.native.prevent="edit(scope.row)"
                        >
                            查看详情
                        </el-button>

                        <el-button
                            v-permission="Global.buttons.AttendeeQuery.trip"
                            @click.native.prevent="chalanxingcheng(scope.row.id)"
                        >
                            查看会议安排
                        </el-button>

                        <el-button
                            v-permission="Global.buttons.AttendeeQuery.downloadCode"
                            @click.native.prevent="xiazaierweima(scope.row.signInCodeUrl)"
                        >
                            下载二维码
                        </el-button>

                        <!-- <el-dropdown
                            v-show="buttons.indexOf(Global.buttons.AttendeeQuery.trip) !== -1 ||
                                buttons.indexOf(Global.buttons.AttendeeQuery.downloadCode) !== -1"
                            @command="(command) => handleCommandMore(command,scope.row.id)"
                        >
                            <el-button>
                                更多操作
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-permission="Global.buttons.AttendeeQuery.trip" command="chakanxingcheng">查看行程</el-dropdown-item>
                                <el-link v-permission="Global.buttons.AttendeeQuery.downloadCode" :href="imagePath + scope.row.signInCodeUrl" :underline="false"><el-dropdown-item command="shenhe">下载二维码</el-dropdown-item></el-link>
                            </el-dropdown-menu>
                        </el-dropdown> -->
                    </template>
                </el-table-column>
            </el-table>
            <div class="page-wrapper">
                <el-pagination
                    :current-page="pageInfo.pageNum"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageInfo.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageInfo.total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </div>
        <el-dialog
            title="选择标签"
            width="30%"
            :visible.sync="tagDialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="closeTagDialog"
        >
            <el-form ref="tagForm" :model="tagForm" :rules="tagRules" label-width="100px" class="demo-ruleForm">
                <el-form-item label="请选择标签" prop="tagId">
                    <el-select v-model="tagForm.tagId" placeholder="请选择标签" style="width: 100%">
                        <el-option v-for="item in tagList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="tagSubmit">提交</el-button>
                <el-button @click="closeTagDialog">取消</el-button>
            </span>
        </el-dialog>
        <el-drawer
            size="45%"
            :visible.sync="xingchengDialogVisible"
            :before-close="closeXingchengDialog"
            title="查看会议安排"
            append-to-body
        >
            <XingchengTree
                :attendee-id="attendeeId"
                :tree-height="dialogHeight"
                style="margin-left:20px;margin-top:-10px"
            />
            <!-- <el-tabs v-model="activeName" style="margin-left:10px;margin-top:-30px">
                <el-tab-pane label="行程信息" name="first">
                    <XingchengTree :attendee-id="attendeeId" :tree-height="dialogHeight" />
                </el-tab-pane>
                <el-tab-pane label="快速签到" name="second">
                    <AgendaTree :attendee-id="attendeeId" :tree-height="dialogHeight" />
                </el-tab-pane>
            </el-tabs> -->

        </el-drawer>
        <!-- <FastCheckIn
            :title="'查看行程'"
            :active-name="activeName"
            :dialog-visible="xingchengDialogVisible"
            :attendee-id="attendeeId"
            @closeDialog="closeXingchengDialog"
        /> -->
        <AddTempAttendee :dialog-visible="addTempAttendeeDialogVisible" @closeDialog="closeAddTempAttendeeDialog" />
    </div>
</template>

<script>
import { getList as getAttendeeGroups } from '@/api/attendeeGroup'
import { getTableHeight, formatPhone, getSourceTypes, getMeetingStatuss } from '@/utils/index'
import { getList } from '@/api/attendee'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
import { getListNoDate as getListNoDate } from '@/api/agenda'
import { getDicList } from '@/api/common'
import { getList as getTagList } from '@/api/attendeeTag'
import { getConferenceId } from '@/utils/conference-auth'
import { getList as getGroupList } from '@/api/attendeeGroup'
import { getView as getConferenceView, getSignConfigAll } from '@/api/conference'
import { getSignConfig } from '@/api/signup'
import { insertTagAttendee } from '@/api/attendeeTag'
// import AgendaTree from '@/views/conferenceOverview/inMeeting/agendaTree'
import XingchengTree from '@/views/conferenceOverview/inMeeting/xingchengTree'
import AddTempAttendee from '@/views/attendee/components/addTempAttendee'
// import FastCheckIn from '@/views/conferenceOverview/inMeeting/fast-check-in'
export default {
    name: 'AttendeeList',
    components: {
        // AgendaTree,
        XingchengTree,
        // FastCheckIn,
        AddTempAttendee
    },
    props: {
    },
    data() {
        return {
            defaultColumnList: [
                { name: '姓名', code: 'attendeeName' }
            ],
            allColumnList: [],
            addTempAttendeeDialogVisible: false,
            buttons: this.$store.state.menu.buttons,
            activeName: 'first',
            dialogHeight: getTableHeight(35),
            arriveTimes: [],
            returnTimes: [],
            xingchengDialogVisible: false,
            attendeeId: 0,
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
            tagDialogVisible: false,
            tagForm: {
                tagId: null
            },
            tagRules: {
                tagId: [{ required: true, message: '请选择标签', trigger: 'change' }]
            },
            multipleSelection: [],
            signConfig: {},
            conferenceView: {},
            groupList: [],
            tagList: [],
            agendas: [],
            positionLevels: [],
            sourceTypes: getSourceTypes(),
            dakaichaxunClass: 1,
            meetingStatuss: getMeetingStatuss(),
            conferenceId: getConferenceId(),
            imagePath: getOssBaseUrl(),
            tableData: [],
            tableHeight: getTableHeight(160),
            pageInfo: {
                resFlag: 2,
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            attendeeGroups: []
        }
    },
    created() {
        this.getConferenceView()
        this.getAgendaList()
        this.getPositionLevels()
        this.search()
        this.getTagList()
        this.getSignConfig()
        this.getAttendeeGroups()
    },
    methods: {
        getSignConfigAll() {
            getSignConfigAll({ conferenceId: getConferenceId() }).then(res => {
                if (res.result !== null && res.result.length > 0) {
                    res.result.forEach(item => {
                        this.allColumnList.push({ 'name': item.fieldLabel, 'code': item.fieldCode })
                    })
                } else {
                    this.allColumnList = []
                }
            })
        },
        xiazaierweima(val) {
            const link = document.createElement('a')
            link.href = this.imagePath + val// 下载链接
            link.style.display = 'none'// a标签隐藏
            document.body.appendChild(link)
            link.click()
        },
        addTempAttendee() {
            this.addTempAttendeeDialogVisible = true
        },
        closeAddTempAttendeeDialog() {
            this.addTempAttendeeDialogVisible = false
        },
        getAttendeeGroups() {
            getAttendeeGroups({ conferenceId: getConferenceId() }).then(res => {
                this.attendeeGroups = res.result.list
            })
        },
        closeXingchengDialog() {
            this.attendeeId = null
            this.search()
            this.xingchengDialogVisible = false
        },
        chalanxingcheng(val) {
            this.attendeeId = val
            this.xingchengDialogVisible = true
        },
        handleCommandMore(command, val) {
            if (command === 'chakanxingcheng') {
                this.attendeeId = val
                this.xingchengDialogVisible = true
            }
        },
        qiehuanshoujijiami(event) {
            if (event.currentTarget.parentElement.children[0].style.display === 'none') {
                event.currentTarget.parentElement.children[0].style.display = ''
                event.currentTarget.parentElement.children[1].style.display = 'none'
            } else {
                event.currentTarget.parentElement.children[0].style.display = 'none'
                event.currentTarget.parentElement.children[1].style.display = ''
            }
        },
        formatPhone(val) {
            return formatPhone(val)
        },
        closeTagDialog() {
            this.tagDialogVisible = false
            // this.tagForm.tagId = null
            this.$refs['tagForm'].resetFields()
        },
        tagSubmit() {
            this.$confirm('请确认是否提交' + this.getConferenceTemplate(2) + '信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const param = []
                this.multipleSelection.forEach(item => {
                    param.push(item.id)
                })
                this.tagForm.attendeeIds = param
                this.tagList.forEach(item => {
                    if (item.id === this.tagForm.tagId) {
                        this.tagForm.tagName = item.name
                    }
                })
                insertTagAttendee(this.tagForm).then(res => {
                    if (res.success) {
                        this.search()
                        this.closeTagDialog()
                    }
                })
            }).catch(() => { })
        },
        dabiaoqian() {
            if (this.multipleSelection.length === 0) {
                this.$message('至少选择一条记录')
                return
            }
            this.tagDialogVisible = true
            this.tagForm.tagId = null
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        getSignConfig() { // 获取报名设置
            getSignConfig({ 'conferenceId': getConferenceId() }).then(res => {
                this.signConfig = res.result
                // alert(this.signConfig.startTime)
                // alert()
            })
        },
        getConferenceView() { // 获取会议详情
            getConferenceView({ 'id': getConferenceId() }).then(res => {
                this.conferenceView = res.result
            })
        },
        getGroupList() {
            getGroupList({ 'conferenceId': this.conferenceId }).then(res => {
                this.groupList = res.result.list
            })
        },
        getTagList() {
            getTagList({ 'conferenceId': this.conferenceId }).then(res => {
                this.tagList = res.result.list
            })
        },
        resetSearch() {
            this.arriveTimes = []
            this.returnTimes = []
            this.pageInfo = {
                resFlag: 2,
                pageNum: 1,
                pageSize: 10,
                total: this.pageInfo.total
            }
        },
        getList() {
            if (this.arriveTimes !== null && this.arriveTimes.length === 2) {
                this.pageInfo.arriveStartTime = this.arriveTimes[0]
                this.pageInfo.arriveEndTime = this.arriveTimes[1]
            } else {
                this.pageInfo.arriveStartTime = null
                this.pageInfo.arriveEndTime = null
            }
            if (this.returnTimes !== null && this.returnTimes.length === 2) {
                this.pageInfo.returnStartTime = this.returnTimes[0]
                this.pageInfo.returnEndTime = this.returnTimes[1]
            } else {
                this.pageInfo.returnStartTime = null
                this.pageInfo.returnEndTime = null
            }
            this.pageInfo.conferenceId = this.conferenceId
            this.pageInfo.signStatusEqual = [-3, -2, -1, 0, 1, 2, 3]

            this.pageInfo.hasLinkAttendee = 1
            this.pageInfo.hasLight = 1
            getList(this.pageInfo).then(res => {
                this.tableData = res.result.list
                this.pageInfo.total = res.result.total
            })
        },
        add() {
            this.$router.push({
                path: `/attendeeManagement/attendee/edit/0`
            })
            // this.$route.meta.title = '添加参会人'
        },
        edit(val) {
            // this.$router.push({ name: 'attendeeView' })
            this.$router.push({
                path: `/attendeeManagement/attendee/edit/${val.id}`
            })
            // this.$route.meta.title = val.fixAttributeCommonVO.attendeeName + '的报名表单'
        },
        search() {
            this.pageInfo.pageNum = 1
            this.getList()
        },
        handleCurrentChange(val) {
            this.pageInfo.pageNum = val
            this.getList()
        },
        handleSizeChange(val) {
            this.pageInfo.pageSize = val
            this.getList()
        },
        getPositionLevels() { // 获取职级列表
            getDicList({ 'code': 'positionLevel' }).then(response => {
                this.positionLevels = response.result
            })
        },
        getAgendaList() { // 获取会议议程树
            getListNoDate({ 'conferenceId': getConferenceId() }).then(res => {
                this.agendas = res.result
            })
        },
        dakaichaxun() {
            this.dakaichaxunClass = this.dakaichaxunClass === 1 ? 0 : 1
        },
        paixu() {

        },
        shaixuan() { }

    }
}
</script>
<style lang="scss" scoped>
.widthClass {
    width: 120px;
}
.width100Class {
    width: 100px;
}
.danhangxianshibuquan {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
