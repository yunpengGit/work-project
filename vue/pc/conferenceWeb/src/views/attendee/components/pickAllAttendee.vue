<template>
    <div v-if="dialogVisible">
        <el-dialog ref="dialog" :visible.sync="dialogVisible" width="90%" top="10px" :show-close="false" append-to-body :before-close="closeDialog">
            <div style="margin-top:-40px">
                <div style="padding-left:8px;padding-right:8px;margin-top:8px">
                    <div class="clearfix">
                        <div style="background-color: white;padding-left:10px;padding-top: 15px">
                            <el-form :inline="true" :model="pageInfo">
                                <el-form-item label="姓名">
                                    <el-input
                                        v-model="pageInfo.attendeeNameLike"
                                        class="widthClass"
                                        maxlength="25"
                                        placeholder=""
                                    />
                                </el-form-item>

                                <el-form-item label="手机">
                                    <el-input v-model.trim="pageInfo.phoneLike" class="widthClass" maxlength="25" placeholder="" />
                                </el-form-item>
                                <el-form-item label="标签">
                                    <el-select v-model="pageInfo.tagIdsIn" class="width100Class" placeholder="全部" clearable>
                                        <el-option v-for="item in tagList" :key="item.id" :label="item.name" :value="item.id" />
                                    </el-select>
                                </el-form-item>

                                <el-form-item label="单位名称">
                                    <el-input
                                        v-model="pageInfo.allOrganizationNameLike"
                                        class="widthClass"
                                        maxlength="25"
                                        placeholder=""
                                    />
                                </el-form-item>
                                <el-form-item label="人员类别" prop="attendeeRoleFlagEqual">
                                    <el-select
                                        v-model="attendeeRoleFlagEqual"
                                        placeholder="全部"
                                        collapse-tags
                                        multiple
                                        style="width:140px"
                                    >
                                        <el-option
                                            v-for="item in attendeeRoleOptions"
                                            :key="item.id"
                                            :label="item.value"
                                            :value="item.id"
                                        />
                                    </el-select>
                                </el-form-item>

                                <el-form-item style="float: right">
                                    <el-button type="primary" @click="search">查询</el-button>
                                    <el-button @click="resetSearch">重置</el-button>
                                    <el-button
                                        :class="dakaichaxunClass === 1 ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
                                        type="text"
                                        style="margin-left:10px;margin-right:5px"
                                        @click="dakaichaxun"
                                    />
                                </el-form-item>
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

                                <el-form-item v-if="dakaichaxunClass === 0" label="职务">
                                    <el-input v-model.trim="pageInfo.positionLike" class="widthClass keepOutRight" maxlength="25" placeholder="" />
                                </el-form-item>

                                <el-form-item v-if="dakaichaxunClass === 0" :label="getConferenceTemplate(2) + '类型'">
                                    <el-select v-model="pageInfo.honourFlag" class="width100Class" placeholder="全部" clearable>
                                        <el-option :key="1" label="主宾" :value="1" />
                                        <el-option :key="0" label="随员" :value="0" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-if="dakaichaxunClass === 0" label="参会状态">
                                    <el-select v-model="pageInfo.meetingStatus" class="width100Class" placeholder="全部" clearable>
                                        <el-option
                                            v-for="item in meetingStatuss"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                        />
                                    </el-select>
                                </el-form-item>
                                <el-form-item
                                    v-if="dakaichaxunClass === 0 && conferenceView.setAgendaFlag === 1"
                                    :label="getConferenceTemplate(1) + '议程'"
                                >
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
                                <el-form-item v-if="dakaichaxunClass === 0" label="是否协助订票" clearable>
                                    <el-select v-model="pageInfo.bookTicketFlag" class="width100Class" placeholder="全部" clearable>
                                        <el-option :key="1" label="是" :value="1" />
                                        <el-option :key="0" label="否" :value="0" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-if="dakaichaxunClass === 0" label="预订车票类型" clearable>
                                    <el-select
                                        v-model="pageInfo.ticketFlag"
                                        style="width:80px"
                                        class="width100Class"
                                        placeholder="全部"
                                        clearable
                                    >
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
                                        format="yyyy-MM-dd HH:mm"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        type="daterange"
                                        range-separator="-"
                                        start-placeholder="开始时间"
                                        end-placeholder="结束时间"
                                        placeholder="选择时间范围"
                                        size="small"
                                        style="width:290px"
                                    />
                                </el-form-item>
                                <el-form-item v-if="dakaichaxunClass === 0" label="到达班次/车次">
                                    <el-input
                                        v-model="pageInfo.arriveFlightLike"
                                        class="widthClass keepOutRight"
                                        maxlength="25"
                                        placeholder=""
                                    />
                                </el-form-item>
                                <el-form-item v-if="dakaichaxunClass === 0" label="到达地点">
                                    <el-input
                                        v-model="pageInfo.arriveStationLike"
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
                                        format="yyyy-MM-dd HH:mm"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        type="daterange"
                                        range-separator="-"
                                        start-placeholder="开始时间"
                                        end-placeholder="结束时间"
                                        placeholder="选择时间范围"
                                        size="small"
                                        style="width:290px"
                                    />
                                </el-form-item>
                                <el-form-item v-if="dakaichaxunClass === 0" label="返程班次/车次">
                                    <el-input
                                        v-model="pageInfo.returnFlightLike"
                                        class="widthClass keepOutRight"
                                        maxlength="25"
                                        placeholder=""
                                    />
                                </el-form-item>
                                <el-form-item v-if="dakaichaxunClass === 0" label="返程地点">
                                    <el-input
                                        v-model="pageInfo.returnStationLike"
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
                        <el-table
                            ref="table"
                            :data="tableData"
                            :row-class-name="tableRowClassName"
                            :header-cell-style="{
                                background:'#f7f7f7',color:'#000000'
                            }"
                            :height="(dakaichaxunClass === 0 ? (tableHeight - 208) : tableHeight)"
                            style="width: 100%;"
                            @selection-change="handleSelectionChange"
                        >
                            <el-table-column type="selection" width="55" />
                            <el-table-column prop="name" label="姓名" :min-width="160">
                                <template slot-scope="scope">
                                    <el-tooltip
                                        v-if="scope.row.accompanyTotips && scope.row.accompanyTotips.length>0"
                                        placement="bottom"
                                        effect="light"
                                    >
                                        <div slot="content">
                                            <div v-for="item in scope.row.accompanyTotips" :key="item.name">
                                                <div>
                                                    {{ item.name }}
                                                </div>
                                                <div v-for="item in item.attendeeAccompany" :key="item.id">
                                                    &nbsp; &nbsp; &nbsp; &nbsp;
                                                    {{ item.attendeeFixAttribute.attendeeName + '（' + item.attendeeFixAttribute.phone + '）' }}
                                                </div>
                                            </div>
                                        </div>
                                        <div style="height:32px">
                                            <AttendeeInfomation :photo-url="scope.row.ssoUserPhoto" :attendee-name="scope.row.fixAttributeCommonVO.attendeeName" :attendee-role-flag="scope.row.fixAttributeCommonVO.attendeeRoleFlag" :honour-flag="scope.row.fixAttributeCommonVO.honourFlag" :sex="scope.row.fixAttributeCommonVO.sex" />
                                            <!-- <img
                                                style="width:32px;height:32px;float:left;border-radius:50%"
                                                :src="imagePath + (scope.row.fixAttributeCommonVO.photoUrl !== null && scope.row.fixAttributeCommonVO.photoUrl !== '' ? scope.row.fixAttributeCommonVO.photoUrl : defaultPhoto)"
                                            >
                                            <span
                                                style="margin-top:8px;margin-left:5px;float:left"
                                                :title="scope.row.fixAttributeCommonVO.attendeeName"
                                            >{{ scope.row.fixAttributeCommonVO.attendeeName != null && scope.row.fixAttributeCommonVO.attendeeName.length > 4 ? scope.row.fixAttributeCommonVO.attendeeName.substr(0,4) + '...' : scope.row.fixAttributeCommonVO.attendeeName }}</span>
                                            <span
                                                v-if="scope.row.attendeeRoleFlag===0 && scope.row.fixAttributeCommonVO.honourFlag === 1"
                                                style="margin-top:8px;float:left"
                                            >（主宾）</span>
                                            <span
                                                v-if="scope.row.attendeeRoleFlag===0 && scope.row.fixAttributeCommonVO.honourFlag !== 1"
                                                style="margin-top:8px;float:left"
                                            >（随员）</span> -->
                                        </div>
                                    </el-tooltip>
                                    <div
                                        v-if="!scope.row.accompanyTotips || scope.row.accompanyTotips.length===0"
                                        style="height:32px"
                                    >
                                        <AttendeeInfomation :photo-url="scope.row.ssoUserPhoto" :attendee-name="scope.row.fixAttributeCommonVO.attendeeName" :attendee-role-flag="scope.row.fixAttributeCommonVO.attendeeRoleFlag" :honour-flag="scope.row.fixAttributeCommonVO.honourFlag" :sex="scope.row.fixAttributeCommonVO.sex" />
                                        <!-- <img
                                            style="width:32px;height:32px;float:left;border-radius:50%"
                                            :src="imagePath + (scope.row.fixAttributeCommonVO.photoUrl !== null && scope.row.fixAttributeCommonVO.photoUrl !== '' ? scope.row.fixAttributeCommonVO.photoUrl : defaultPhoto)"
                                        >
                                        <span
                                            style="margin-top:8px;margin-left:5px;float:left"
                                            :title="scope.row.fixAttributeCommonVO.attendeeName"
                                        >{{ scope.row.fixAttributeCommonVO.attendeeName != null && scope.row.fixAttributeCommonVO.attendeeName.length > 4 ? scope.row.fixAttributeCommonVO.attendeeName.substr(0,4) + '...' : scope.row.fixAttributeCommonVO.attendeeName }}</span>
                                        <span
                                            v-if="scope.row.attendeeRoleFlag===0 && scope.row.fixAttributeCommonVO.honourFlag === 1"
                                            style="margin-top:8px;float:left"
                                        >（主宾）</span>
                                        <span
                                            v-if="scope.row.attendeeRoleFlag===0 && scope.row.fixAttributeCommonVO.honourFlag !== 1"
                                            style="margin-top:8px;float:left"
                                        >（随员）</span> -->
                                    </div>

                                </template>
                            </el-table-column>
                            <!-- width="180" -->
                            <el-table-column
                                v-show="conferenceView.useVehicleFlag === 1 || conferenceView.useCardFlag === 1
                                    || conferenceView.useDinnerFlag === 1 || conferenceView.useRoomFlag === 1"
                                prop="name"
                                label="资源分配情况"
                                :min-width="160"
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
                            <el-table-column label="标签">
                                <template slot-scope="scope">
                                    {{ scope.row.tagVOs !== null && scope.row.tagVOs.length > 0 ? '' : '-' }}
                                    <el-tag
                                        v-for="(tagVO, index) in scope.row.tagVOs"
                                        :key="tagVO.id"
                                        :style="{ backgroundColor: tagVO.backgroundColor, color: tagVO.fontColor }"
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
                            <el-table-column label="手机" min-width="120px">
                                <template slot-scope="scope">
                                    <PhoneEncryption :value="scope.row.fixAttributeCommonVO.phone" />
                                    <!-- <div>
                                        <span>{{ formatTableCellData(formatPhone(scope.row.fixAttributeCommonVO.phone)) }}</span>
                                        <span style="display:none">{{ scope.row.fixAttributeCommonVO.phone }}</span>
                                        <el-button
                                            v-show="scope.row.fixAttributeCommonVO.phone !== null && scope.row.fixAttributeCommonVO.phone !== ''"
                                            icon="el-icon-view"
                                            type="text"
                                            @click="(event) => qiehuanshoujijiami(event)"
                                        />
                                    </div> -->
                                </template>
                            </el-table-column>
                            <el-table-column prop="fixAttributeCommonVO.organizationSortName" label="单位简称/全称">
                                <template slot-scope="scope">
                                    <div
                                        v-if="scope.row.fixAttributeCommonVO.organizationSortName || scope.row.fixAttributeCommonVO.organizationName"
                                    >
                                        {{ formatOrgName(scope.row.fixAttributeCommonVO.organizationSortName,scope.row.fixAttributeCommonVO.organizationName) }}
                                    </div>
                                    <div v-else>
                                        -
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
                                        查看{{ getConferenceTemplate(1) }}安排
                                    </el-button>

                                    <el-button
                                        v-permission="Global.buttons.AttendeeQuery.downloadCode"
                                        @click.native.prevent="xiazaierweima(scope.row.signInCodeUrl)"
                                    >
                                        下载二维码
                                    </el-button>
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
                    <el-drawer
                        size="45%"
                        append-to-body
                        :visible.sync="xingchengDialogVisible"
                        :before-close="closeXingchengDialog"
                        :title="'查看' + getConferenceTemplate(1) + '安排'"
                    >
                        <XingchengTree
                            :attendee-id="attendeeId"
                            :tree-height="dialogHeight"
                            style="margin-left:20px;margin-top:-10px"
                        />

                    </el-drawer>
                </div>
            </div>

            <span slot="footer" class="dialog-footer">
                <div style="margin-top:-30px">
                    <el-button type="primary" @click="onSubmit">确 定</el-button>
                    <el-button @click="closeDialog">关闭</el-button>
                </div>
            </span>
        </el-dialog>
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
import { getView as getConferenceView } from '@/api/conference'
import XingchengTree from '@/views/conferenceOverview/inMeeting/xingchengTree'
export default {
    name: 'PickAllAttendee',
    components: {
        XingchengTree
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            buttons: this.$store.state.menu.buttons,
            dialogHeight: getTableHeight(35),
            arriveTimes: [],
            returnTimes: [],
            xingchengDialogVisible: false,
            attendeeId: 0,
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
            multipleSelection: [],
            conferenceView: {},
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
                total: 0,
                attendeeRoleFlagEqual: ''
            },
            attendeeRoleFlagEqual: [0],

            attendeeGroups: [],
            attendeeRoleOptions: [{ id: 0, value: '' + this.getConferenceTemplate(2) + '' }, { id: 3, value: '嘉宾' }, { id: 4, value: '临时来宾' }, { id: 1, value: '会务组' }, { id: 2, value: '司机' }]

        }
    },
    watch: {
        dialogVisible(val) {
            if (val) {
                this.getTagList()
                this.getConferenceView()
                this.getAgendaList()
                this.getPositionLevels()
                this.search()
                this.getAttendeeGroups()
            }
        }
    },
    created() {

    },
    methods: {
        edit(val) {
            this.$router.push({
                path: `/attendeeManagement/attendee/show/${val.id}`
            })
        },
        onSubmit() {
            if (this.multipleSelection.length === 0) {
                this.$message('至少选择一条记录')
                return
            }
            const param = []
            this.multipleSelection.forEach(item => {
                param.push(item.id)
            })
            this.$emit('closeDialog', param)
        },
        closeDialog() {
            this.$emit('closeDialog', null)
        },
        xiazaierweima(val) {
            const link = document.createElement('a')
            link.href = this.imagePath + val// 下载链接
            link.style.display = 'none'// a标签隐藏
            document.body.appendChild(link)
            link.click()
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
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        getConferenceView() { // 获取会议详情
            getConferenceView({ 'id': getConferenceId() }).then(res => {
                this.conferenceView = res.result
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
            this.attendeeRoleFlagEqual = [0]
            this.pageInfo = {
                resFlag: 2,
                pageNum: 1,
                pageSize: 10,
                total: this.pageInfo.total,
                attendeeRoleFlagEqual: ''
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
            //   this.pageInfo.attendeeRoleFlagEqual = [0, 1, 2, 3, 4]
            if (this.attendeeRoleFlagEqual.length === 0) {
                this.attendeeRoleFlagEqual = [0, 1, 2, 3, 4]
            }
            this.pageInfo.attendeeRoleFlagEqual = this.attendeeRoleFlagEqual.join(',')
            getList(this.pageInfo).then(res => {
                this.tableData = res.result.list
                this.pageInfo.total = res.result.total
            })
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
        tableRowClassName({ row, rowIndex }) {
            const index = rowIndex + 1
            if (index % 2 == 0) {
                return 'warning-row'
            }
        }

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
