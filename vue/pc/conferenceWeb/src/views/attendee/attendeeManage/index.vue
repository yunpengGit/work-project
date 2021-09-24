<template>
    <div style="padding-left: 8px; padding-right: 8px; margin-top: 8px">
        <div class="clearfix">
            <div
                style="background-color: white; padding-left: 10px; padding-top: 15px"
            >
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

                    <el-form-item label="手机">
                        <el-input
                            v-model.trim="pageInfo.phoneLike"
                            class="widthClass"
                            maxlength="25"
                            placeholder=""
                        />
                    </el-form-item>
                    <el-form-item label="标签">
                        <el-select
                            v-model="pageInfo.tagIdsIn"
                            class="width100Class"
                            placeholder="全部"
                            clearable
                        >
                            <el-option
                                v-for="item in tagList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
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
                    <el-form-item  class="form_operation">
                        <el-button
                            :class="
                                dakaichaxunClass === 1
                                    ? 'el-icon-arrow-down'
                                    : 'el-icon-arrow-up'
                            "
                            type="text"
                            style="margin-left: 10px; margin-right: 5px"
                            @click="dakaichaxun"
                        />
                        <el-button type="primary" @click="search">查询</el-button>
                        <el-button @click="resetSearch">重置</el-button>
                        
                    </el-form-item>
                    </div>
                    <el-form-item v-if="dakaichaxunClass === 0" label="职级" clearable>
                        <el-select
                            v-model="pageInfo.positionLevel"
                            class="width100Class"
                            placeholder="全部"
                            clearable
                        >
                            <el-option
                                v-for="item in positionLevels"
                                :key="item.valCode"
                                :label="item.valName"
                                :value="item.valCode"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="职务">
                        <el-input
                            v-model.trim="pageInfo.positionLike"
                            class="widthClass"
                            maxlength="25"
                            placeholder=""
                        />
                    </el-form-item>
                    <el-form-item
                        v-if="dakaichaxunClass === 0"
                        :label="getConferenceTemplate(2) + '类型'"
                    >
                        <el-select
                            v-model="pageInfo.honourFlag"
                            class="width100Class"
                            placeholder="全部"
                            clearable
                        >
                            <el-option :key="1" label="主宾" :value="1" />
                            <el-option :key="0" label="随员" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="参会状态">
                        <el-select
                            v-model="pageInfo.meetingStatus"
                            class="width100Class"
                            placeholder="全部"
                            clearable
                        >
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
                                label: 'name',
                                value: 'id',
                            }"
                        />
                    </el-form-item>
                    <el-form-item
                        v-if="dakaichaxunClass === 0"
                        label="参会方式"
                        clearable
                    >
                        <el-select
                            v-model="pageInfo.sourceType"
                            class="width100Class"
                            placeholder="全部"
                            clearable
                        >
                            <el-option
                                v-for="item in sourceTypes"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        v-if="dakaichaxunClass === 0"
                        label="是否制证"
                        clearable
                    >
                        <el-select
                            v-model="pageInfo.cardFlag"
                            class="width100Class"
                            placeholder="全部"
                            clearable
                        >
                            <el-option :key="1" label="是" :value="1" />
                            <el-option :key="0" label="否" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        v-if="dakaichaxunClass === 0"
                        label="是否住宿"
                        clearable
                    >
                        <el-select
                            v-model="pageInfo.bookStayFlag"
                            class="width100Class"
                            placeholder="全部"
                            clearable
                        >
                            <el-option :key="1" label="是" :value="1" />
                            <el-option :key="0" label="否" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        v-if="dakaichaxunClass === 0"
                        label="是否用餐"
                        clearable
                    >
                        <el-select
                            v-model="pageInfo.bookDinnerFlag"
                            class="width100Class"
                            placeholder="全部"
                            clearable
                        >
                            <el-option :key="1" label="是" :value="1" />
                            <el-option :key="0" label="否" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        v-if="dakaichaxunClass === 0"
                        label="是否需要协助订票"
                        clearable
                    >
                        <el-select
                            v-model="pageInfo.bookTicketFlag"
                            class="width100Class"
                            placeholder="全部"
                            clearable
                        >
                            <el-option :key="1" label="是" :value="1" />
                            <el-option :key="0" label="否" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        v-if="dakaichaxunClass === 0"
                        label="预订机票/车票/船票类型"
                        clearable
                    >
                        <el-select
                            v-model="pageInfo.ticketFlag"
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
                    <el-form-item
                        v-if="dakaichaxunClass === 0"
                        label="是否接站"
                        clearable
                    >
                        <el-select
                            v-model="pageInfo.pickUpFlag"
                            class="width100Class"
                            placeholder="全部"
                            clearable
                        >
                            <el-option :key="1" label="是" :value="1" />
                            <el-option :key="0" label="否" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        v-if="dakaichaxunClass === 0"
                        label="到达时间"
                        clearable
                    >
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
                            style="width: 290px"
                        />
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="到达班次/车次">
                        <el-input
                            v-model.trim="pageInfo.arriveFlightLike"
                            class="widthClass"
                            maxlength="25"
                            placeholder=""
                        />
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="到达地点">
                        <el-input
                            v-model.trim="pageInfo.arriveStationLike"
                            class="widthClass"
                            maxlength="25"
                            placeholder=""
                        />
                    </el-form-item>
                </el-form>
                <el-form :inline="true" :model="pageInfo">
                    <el-form-item
                        v-if="dakaichaxunClass === 0"
                        label="是否送站"
                        clearable
                    >
                        <el-select
                            v-model="pageInfo.pickOutFlag"
                            class="width100Class"
                            placeholder="全部"
                            clearable
                        >
                            <el-option :key="1" label="是" :value="1" />
                            <el-option :key="0" label="否" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        v-if="dakaichaxunClass === 0"
                        label="返程时间"
                        clearable
                    >
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
                            style="width: 290px"
                        />
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="返程班次/车次">
                        <el-input
                            v-model.trim="pageInfo.returnFlightLike"
                            class="widthClass"
                            maxlength="25"
                            placeholder=""
                        />
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="返程地点">
                        <el-input
                            v-model.trim="pageInfo.returnStationLike"
                            class="widthClass"
                            maxlength="25"
                            placeholder=""
                        />
                    </el-form-item>
                    <el-form-item v-if="dakaichaxunClass === 0" label="分组">
                        <el-select
                            v-model="pageInfo.groupIdsIn"
                            collapse-tags
                            multiple
                            style="width: 200px"
                            placeholder="全部"
                            clearable
                        >
                            <el-option
                                v-for="item in attendeeGroups"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        v-if="dakaichaxunClass === 0"
                        label="人员类别"
                        prop="attendeeRoleFlagEqual"
                    >
                        <el-select
                            v-model="attendeeRoleFlagEqual"
                            placeholder="全部"
                            collapse-tags
                            multiple
                            style="width: 200px"
                        >
                            <el-option
                                v-for="item in attendeeRoleOptions"
                                :key="item.id"
                                :label="item.value"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div style="background-color: #eef0f4; height: 8px; width: 100%" />
        <div
            style="
        background-color: white;
        padding-left: 10px;
        padding-top: 10px;
        padding-right: 10px;
      "
        >
            <div
                style="
          float: left;
          text-center: left;
          margin-left: 10px;
          padding-bottom: 10px;
        "
            >
                <el-button
                    v-permission="Global.buttons.AttendeeQuery.addTag"
                    @click="dabiaoqian"
                >批量打标签</el-button>
            </div>
            <div style="float: right; text-center: right; padding-bottom: 10px">
                <el-button
                    v-permission="Global.buttons.AttendeeQuery.signup"
                    type="primary"
                    @click="addTempAttendee"
                >添加临时来宾</el-button>
                <el-button
                    v-permission="Global.buttons.AttendeeQuery.signup"
                    type="primary"
                    @click="add"
                >添加{{ getConferenceTemplate(2) }}</el-button>
                <el-button
                    v-permission="Global.buttons.AttendeeQuery.seq"
                    @click="paixu"
                >{{ getConferenceTemplate(2) }}排序</el-button>
                <!-- <el-button @click="shaixuan">列表筛选</el-button> -->
                <el-dropdown @command="shaixuan">
                    <el-button>
                        列表筛选<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                            command="moren"
                            :class="!allColumnFlag ? 'isActiveClass' : 'isNotActiveClass'"
                        >默认列表</el-dropdown-item>
                        <el-dropdown-item
                            command="quanbu"
                            :class="allColumnFlag ? 'isActiveClass' : 'isNotActiveClass'"
                        >全部列表</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown
                    v-permission="Global.buttons.AttendeeQuery.export"
                    @command="selectAttendeeInfo"
                >
                    <el-button>
                        导出参会人信息<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                            command="baseInfo"
                        >参会人基本信息</el-dropdown-item>
                        <el-dropdown-item
                            command="accessoryInfo"
                        >参会人附件信息</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <!-- v-permission="Global.buttons.AttendeeQuery.import" -->
                <el-button @click="importAttendee">导入参会人</el-button>
                <!-- <el-button v-permission="Global.buttons.AttendeeQuery.export" @click="exportExcel">导出查询结果</el-button> -->
            </div>
            <el-table
                ref="table"
                :data="tableData"
                :height="dakaichaxunClass === 0 ? tableHeight - 258 : tableHeight"
                style="width: 100%"
                @selection-change="handleSelectionChange"
            >
                <!-- v-loading="tableLoading" -->
                <!-- <template slot="empty">
                    <TableEmptyImage v-show="!tableLoading" />
                </template> -->
                <el-table-column type="selection" width="55" />
                <el-table-column prop="name" label="姓名" :min-width="200">
                    <template slot-scope="scope">
                        <div style="height: 32px">
                            <AttendeeInfomation
                                :accompany-flag="2"
                                :accompany-totips="scope.row.accompanyTotips"
                                :photo-url="scope.row.ssoUserPhoto"
                                :attendee-name="scope.row.fixAttributeCommonVO.attendeeName"
                                :attendee-role-flag="
                                    scope.row.fixAttributeCommonVO.attendeeRoleFlag
                                "
                                :honour-flag="scope.row.fixAttributeCommonVO.honourFlag"
                                :sex="scope.row.fixAttributeCommonVO.sex"
                            />
                        </div>
                    </template>
                </el-table-column>
                <!-- width="180" -->
                <el-table-column
                    v-show="
                        conferenceView.useVehicleFlag === 1 ||
                            conferenceView.useCardFlag === 1 ||
                            conferenceView.useDinnerFlag === 1 ||
                            conferenceView.useRoomFlag === 1
                    "
                    prop="name"
                    label="资源分配情况"
                    :min-width="200"
                >
                    <template slot-scope="scope">
                        <span
                            v-if="
                                conferenceView.useVehicleFlag !== 1 &&
                                    conferenceView.useCardFlag !== 1 &&
                                    conferenceView.useDinnerFlag !== 1 &&
                                    conferenceView.useRoomFlag !== 1
                            "
                        >
                            -
                        </span>
                        <el-tag
                            v-if="
                                conferenceView.useVehicleFlag === 1 &&
                                    scope.row.vehicleStatus === 2
                            "
                            style="background-color: #00b194; color: white"
                            type="info"
                        >车</el-tag>
                        <el-tag
                            v-if="
                                conferenceView.useVehicleFlag === 1 &&
                                    scope.row.vehicleStatus !== 2
                            "
                            type="info"
                        >车</el-tag>

                        <el-tag
                            v-if="
                                conferenceView.useCardFlag === 1 && scope.row.ticketStatus === 2
                            "
                            style="background-color: #00b194; color: white"
                            type="info"
                        >票</el-tag>
                        <el-tag
                            v-if="
                                conferenceView.useCardFlag === 1 && scope.row.ticketStatus !== 2
                            "
                            type="info"
                        >票</el-tag>

                        <el-tag
                            v-if="
                                conferenceView.useDinnerFlag === 1 && scope.row.foodStatus === 2
                            "
                            style="background-color: #00b194; color: white"
                            type="info"
                        >餐</el-tag>
                        <el-tag
                            v-if="
                                conferenceView.useDinnerFlag === 1 && scope.row.foodStatus !== 2
                            "
                            type="info"
                        >餐</el-tag>

                    </template>
                </el-table-column>
                <el-table-column
                    label="职务"
                >
                    <template slot-scope="scope">
                        <div :title="scope.row.fixAttributeCommonVO.position">{{ formatTableCellData(scope.row.fixAttributeCommonVO.position) }}</div>
                    </template>
                </el-table-column>
                <!-- width="90" -->
                <el-table-column
                    label="标签"
                >
                    <template slot-scope="scope">
                        {{ scope.row.tagVOs !== null && scope.row.tagVOs.length > 0 ? '' : '-' }}
                        <el-tag v-for="tagVO in scope.row.tagVOs" :key="tagVO.id" :style="{ backgroundColor: tagVO.backgroundColor, color: tagVO.fontColor }" type="info">
                            <el-tooltip placement="bottom" effect="light">
                                <div slot="content">
                                    {{ tagVO.name }}
                                </div>
                                <div class="danhangxianshibuquan">{{ tagVO.name !== null && tagVO.name.length > 5 ? tagVO.name.substr(0,4) + '...' : tagVO.name }}</div>
                            </el-tooltip>
                        </el-tag>
                    </template>
                </el-table-column>
                <!-- width="120" -->
                <el-table-column
                    label="手机"
                    min-width="120px"
                >
                    <template slot-scope="scope">
                        <PhoneEncryption :value="scope.row.fixAttributeCommonVO.phoneForMsg ? scope.row.fixAttributeCommonVO.phoneForMsg : scope.row.fixAttributeCommonVO.phone" />
                        <!-- <div>
                            <span>{{ formatTableCellData(formatPhone(scope.row.fixAttributeCommonVO.phoneForMsg)) }}</span>
                            <span style="display:none">{{ scope.row.fixAttributeCommonVO.phoneForMsg }}</span>
                            <el-button v-show="scope.row.fixAttributeCommonVO.phoneForMsg !== null && scope.row.fixAttributeCommonVO.phoneForMsg !== ''" icon="el-icon-view" type="text" @click="(event) => qiehuanshoujijiami(event)" />
                        </div> -->
                        <!-- <div @click="xianshi">aaa</div> -->
                    </template>
                </el-table-column>
                <!-- width="120" -->
                <el-table-column
                    prop="fixAttributeCommonVO.organizationSortName"
                    label="单位简称/全称"
                >
                    <template slot-scope="scope">
                        <div>
                            {{
                                formatOrgName(
                                    scope.row.fixAttributeCommonVO.organizationSortName,
                                    scope.row.fixAttributeCommonVO.organizationName
                                )
                            }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="参会状态">
                    <template slot-scope="scope">
                        {{ formatTableCellData(scope.row.meetingStatusStr) }}
                    </template>
                </el-table-column>
                <AttendeeAllColumn
                    v-if="allColumnFlag"
                    :all-column-list="allColumnList"
                    :attendee-flag="1"
                />
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
            <el-form
                ref="tagForm"
                :model="tagForm"
                :rules="tagRules"
                label-width="100px"
                class="demo-ruleForm"
            >
                <el-form-item label="请选择标签" prop="tagId">
                    <el-select
                        v-model="tagForm.tagId"
                        placeholder="请选择标签"
                        style="width: 100%"
                    >
                        <el-option
                            v-for="item in tagList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="tagSubmit">提交</el-button>
                <el-button @click="closeTagDialog">取消</el-button>
            </span>
        </el-dialog>
        <!-- 选择[参会人附件信息]弹窗 -->
        <el-dialog
            v-if="accessoryDialogVisible"
            title="请选择需要下载的附件"
            width="70%"
            :visible.sync="accessoryDialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="closeAccessoryDialog"
        >
            <el-table
                :data="accessoryTableData"
                border
                style="width: 100%"
                max-height="300px"
                @selection-change="handleSelectionAccessoryChange"
            >
                <el-table-column type="selection" width="45" :selectable="selectInit" />
                <el-table-column prop="fieldLabel" label="附件名称" />
                <el-table-column prop="type" label="附件类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type == 9">图片</span>
                        <span v-else-if="scope.row.type == 10">文件</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="fileCounts" label="附件数量" />
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="comfirmSubmit">确认</el-button>
                <el-button @click="closeAccessoryDialog">取消</el-button>
            </span>
        </el-dialog>

        <el-drawer
            size="45%"
            :visible.sync="xingchengDialogVisible"
            :before-close="closeXingchengDialog"
            :title="'查看' + getConferenceTemplate(1) + '安排'"
        >
            <XingchengTree
                :attendee-id="attendeeId"
                :tree-height="dialogHeight"
                style="margin-left: 20px; margin-top: -10px"
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
        <AddTempAttendee
            :dialog-visible="addTempAttendeeDialogVisible"
            @closeDialog="closeAddTempAttendeeDialog"
        />

        <ImportAttendeeSeq
            :dialog-visible="importAttendeeSeqDialogVisible"
            @closeDialog="closeImportAttendeeSeq"
        />

        <ImportAttendee :dialog-visible="imporAttendeetDialogVisible" @closeDialog="closeImportAttendeeDialog" />
    </div>
</template>

<script>
import { getList as getAttendeeGroups } from '@/api/attendeeGroup'
import {
    getTableHeight,
    formatPhone,
    getSourceTypes,
    getMeetingStatuss
} from '@/utils/index'
import {
    getList,
    //   exportExcel,
    exportBaseExcel,
    getFileList,
    exportFileList
} from '@/api/attendee'
import { getOssPublicBaseUrl } from '@/utils/x-sso-publicbaseurl'
import { getListNoDate as getListNoDate } from '@/api/agenda'
import { getDicList } from '@/api/common'
import { getList as getTagList } from '@/api/attendeeTag'
import { getConferenceId } from '@/utils/conference-auth'
import { getList as getGroupList } from '@/api/attendeeGroup'
import {
    getView as getConferenceView,
    getSignConfigAll
} from '@/api/conference'
import { getSignConfig } from '@/api/signup'
import { insertTagAttendee } from '@/api/attendeeTag'
// import AgendaTree from '@/views/conferenceOverview/inMeeting/agendaTree'
import XingchengTree from '@/views/conferenceOverview/inMeeting/xingchengTree'
import AddTempAttendee from '@/views/attendee/components/addTempAttendee'
import AttendeeAllColumn from '@/views/attendee/components/attendeeAllColumn'
import { showLoading, closeLoading } from '@/utils/loading'
import ImportAttendeeSeq from './importAttendeeSeq'
import ImportAttendee from './importAttendee'
// import FastCheckIn from '@/views/conferenceOverview/inMeeting/fast-check-in'
export default {
    name: 'AttendeeList',
    components: {
    // AgendaTree,
        XingchengTree,
        // FastCheckIn,
        AddTempAttendee,
        AttendeeAllColumn,
        ImportAttendeeSeq,
        ImportAttendee
    },
    props: {},
    data() {
        return {
            imporAttendeetDialogVisible: false,
            tableLoading: false,
            attendeeRoleFlagEqual: [0],
            attendeeRoleOptions: [
                { id: 0, value: this.getConferenceTemplate(2) },
                { id: 3, value: '嘉宾' },
                { id: 4, value: '临时来宾' },
                { id: 1, value: '会务组' },
                { id: 2, value: '司机' }
            ],
            importAttendeeSeqDialogVisible: false,
            allColumnFlag: false,
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
            imagePath: getOssPublicBaseUrl(),
            tableData: [],
            tableHeight: getTableHeight(160),
            pageInfo: {
                resFlag: 2,
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            attendeeGroups: [],
            accessoryDialogVisible: false, // 选择[参会人附件信息]弹窗
            accessorySelectionList: [], // 选择的附件集合
            accessoryTableData: []
        }
    },
    beforeCreate() {
        this.tableLoading = true
    },
    created() {
    // alert(1)
        this.getSignConfigAll()
        this.getConferenceView()
        this.getAgendaList()
        this.getPositionLevels()
        this.search()
        this.getTagList()
        this.getSignConfig()
        this.getAttendeeGroups()
    },
    methods: {
        importAttendee() {
            this.imporAttendeetDialogVisible = true
        },
        closeImportAttendeeDialog() {
            this.search()
            this.imporAttendeetDialogVisible = false
        },
        selectInit(row, index) {
            if (row.fileCounts > 0) {
                return true // 可勾选
            } else {
                return false // 不可勾选
            }
        },
        getSignConfigAll() {
            getSignConfigAll({ conferenceId: getConferenceId() }).then((res) => {
                if (res.result !== null && res.result.length > 0) {
                    res.result.forEach((item) => {
                        if (item.initFlag === 1) {
                            this.allColumnList.push({
                                name: item.fieldLabel,
                                code: item.fieldCode
                            })
                        }
                    })
                } else {
                    this.allColumnList = []
                }
            })
        },
        xiazaierweima(val) {
            const link = document.createElement('a')
            link.href = this.imagePath + val // 下载链接
            link.style.display = 'none' // a标签隐藏
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
            getAttendeeGroups({ conferenceId: getConferenceId() }).then((res) => {
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
            if (
                event.currentTarget.parentElement.children[0].style.display === 'none'
            ) {
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
            this.$confirm('请确认是否保存标签信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    const param = []
                    this.multipleSelection.forEach((item) => {
                        param.push(item.id)
                    })
                    this.tagForm.attendeeIds = param
                    this.tagList.forEach((item) => {
                        if (item.id === this.tagForm.tagId) {
                            this.tagForm.tagName = item.name
                        }
                    })
                    insertTagAttendee(this.tagForm).then((res) => {
                        if (res.success) {
                            this.$message(res.message)
                            this.search()
                            this.closeTagDialog()
                        }
                    })
                })
                .catch(() => {})
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
        getSignConfig() {
            // 获取报名设置
            getSignConfig({ conferenceId: getConferenceId() }).then((res) => {
                this.signConfig = res.result
                // alert(this.signConfig.startTime)
                // alert()
            })
        },
        getConferenceView() {
            // 获取会议详情
            getConferenceView({ id: getConferenceId() }).then((res) => {
                this.conferenceView = res.result
            })
        },
        getGroupList() {
            getGroupList({ conferenceId: this.conferenceId }).then((res) => {
                this.groupList = res.result.list
            })
        },
        getTagList() {
            getTagList({ conferenceId: this.conferenceId }).then((res) => {
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
            this.tableLoading = true
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
            this.pageInfo.signStatusEqual = [-3, -2, -1, 1, 2, 3]

            if (
                this.attendeeRoleFlagEqual === null ||
        this.attendeeRoleFlagEqual.length === 0
            ) {
                this.pageInfo.attendeeRoleFlagEqual = [0, 1, 2, 3, 4]
            } else {
                this.pageInfo.attendeeRoleFlagEqual = this.attendeeRoleFlagEqual
            }

            this.pageInfo.hasLinkAttendee = 1
            this.pageInfo.hasLight = 1
            getList(this.pageInfo).then((res) => {
                this.tableData = res.result.list
                this.pageInfo.total = res.result.total
                this.tableLoading = false
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
        getPositionLevels() {
            // 获取职级列表
            getDicList({ code: 'positionLevel' }).then((response) => {
                this.positionLevels = response.result
            })
        },
        getAgendaList() {
            // 获取会议议程树
            getListNoDate({ conferenceId: getConferenceId() }).then((res) => {
                this.agendas = res.result
            })
        },
        dakaichaxun() {
            this.dakaichaxunClass = this.dakaichaxunClass === 1 ? 0 : 1
        },
        paixu() {
            this.importAttendeeSeqDialogVisible = true
        },
        closeImportAttendeeSeq() {
            this.search()
            this.importAttendeeSeqDialogVisible = false
        },
        shaixuan(command) {
            if (command === 'quanbu') {
                this.allColumnFlag = true
            } else {
                this.allColumnFlag = false
            }
            this.$nextTick(() => {
                this.$refs.table.doLayout()
            })
        },
        // 筛选参会人信息
        selectAttendeeInfo(command) {
            if (command === 'accessoryInfo') {
                this.accessoryDialogVisible = true
                this.getAccessoryTableData()
            } else {
                this.downloadBaseInfo()
            }
        },
        // 下载参会人基本信息
        downloadBaseInfo() {
            const load = showLoading()
            var tempData = JSON.parse(JSON.stringify(this.pageInfo))
            if (this.arriveTimes !== null && this.arriveTimes.length === 2) {
                tempData.arriveStartTime = this.arriveTimes[0]
                tempData.arriveEndTime = this.arriveTimes[1]
            } else {
                tempData.arriveStartTime = null
                tempData.arriveEndTime = null
            }
            if (this.returnTimes !== null && this.returnTimes.length === 2) {
                tempData.returnStartTime = this.returnTimes[0]
                tempData.returnEndTime = this.returnTimes[1]
            } else {
                tempData.returnStartTime = null
                tempData.returnEndTime = null
            }
            tempData.conferenceId = this.conferenceId
            tempData.signStatusEqual = [3]

            tempData.attendeeRoleFlagEqual = [0]

            tempData.hasLinkAttendee = 1
            tempData.hasLight = 1
            tempData.pageSize = null
            tempData.pageNum = null
            tempData.exportNamePrefix = '参会人查询'

            if (
                this.attendeeRoleFlagEqual === null ||
        this.attendeeRoleFlagEqual.length === 0
            ) {
                tempData.attendeeRoleFlagEqual = [0, 1, 2, 3, 4]
            } else {
                tempData.attendeeRoleFlagEqual = this.attendeeRoleFlagEqual
            }
            exportBaseExcel(tempData)
                .then((res) => {
                    if (
                        decodeURI(res.headers['filename']) == null ||
            decodeURI(res.headers['filename']) === 'undefined'
                    ) {
                        this.$message('文件不存在')
                    } else {
                        const blob = new Blob([res.data], {
                            type: 'application/octet-stream'
                        })
                        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                            navigator.msSaveBlob(blob, decodeURI(res.headers['filename']))
                        } else {
                            const link = document.createElement('a')
                            link.style.display = 'none'
                            link.href = URL.createObjectURL(blob)
                            link.setAttribute('download', decodeURI(res.headers['filename']))
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)
                        }
                    }
                    closeLoading(load)
                })
                .catch((error) => {
                    console.log(error)
                    closeLoading(load)
                })
        },
        // 选择附件
        handleSelectionAccessoryChange(list) {
            this.accessorySelectionList = list
        },
        // 获取可导出附件列表
        getAccessoryTableData() {
            //   const load = showLoading();
            var tempData = JSON.parse(JSON.stringify(this.pageInfo))
            if (this.arriveTimes !== null && this.arriveTimes.length === 2) {
                tempData.arriveStartTime = this.arriveTimes[0]
                tempData.arriveEndTime = this.arriveTimes[1]
            } else {
                tempData.arriveStartTime = null
                tempData.arriveEndTime = null
            }
            if (this.returnTimes !== null && this.returnTimes.length === 2) {
                tempData.returnStartTime = this.returnTimes[0]
                tempData.returnEndTime = this.returnTimes[1]
            } else {
                tempData.returnStartTime = null
                tempData.returnEndTime = null
            }
            tempData.conferenceId = this.conferenceId
            tempData.signStatusEqual = [3]

            tempData.attendeeRoleFlagEqual = [0]

            tempData.hasLinkAttendee = 1
            tempData.hasLight = 1
            tempData.pageSize = null
            tempData.pageNum = null
            tempData.exportNamePrefix = '参会人查询'

            if (
                this.attendeeRoleFlagEqual === null ||
        this.attendeeRoleFlagEqual.length === 0
            ) {
                tempData.attendeeRoleFlagEqual = [0, 1, 2, 3, 4]
            } else {
                tempData.attendeeRoleFlagEqual = this.attendeeRoleFlagEqual
            }
            getFileList(tempData)
                .then((res) => {
                    if (res.success) {
                        this.accessoryTableData = res.result
                    }
                })
                .catch(() => {
                    //   closeLoading(load);
                })
        },
        // 关闭弹窗
        closeAccessoryDialog() {
            this.accessoryDialogVisible = false
            this.accessorySelectionList = []
        },
        // 确认下载
        comfirmSubmit() {
            if (this.accessorySelectionList.length) {
                this.exportExcel()
            } else {
                this.$message('请选择需要导出的附件!')
            }
        },
        // 导出附件列表
        exportExcel() {
            const load = showLoading()
            var tempData = JSON.parse(JSON.stringify(this.pageInfo))
            if (this.arriveTimes !== null && this.arriveTimes.length === 2) {
                tempData.arriveStartTime = this.arriveTimes[0]
                tempData.arriveEndTime = this.arriveTimes[1]
            } else {
                tempData.arriveStartTime = null
                tempData.arriveEndTime = null
            }
            if (this.returnTimes !== null && this.returnTimes.length === 2) {
                tempData.returnStartTime = this.returnTimes[0]
                tempData.returnEndTime = this.returnTimes[1]
            } else {
                tempData.returnStartTime = null
                tempData.returnEndTime = null
            }
            tempData.conferenceId = this.conferenceId
            tempData.signStatusEqual = [3]
            tempData.attendeeRoleFlagEqual = [0]
            tempData.hasLinkAttendee = 1
            tempData.hasLight = 1
            tempData.pageSize = null
            tempData.pageNum = null
            tempData.exportNamePrefix = '参会人查询'
            if (
                this.attendeeRoleFlagEqual === null ||
        this.attendeeRoleFlagEqual.length === 0
            ) {
                tempData.attendeeRoleFlagEqual = [0, 1, 2, 3, 4]
            } else {
                tempData.attendeeRoleFlagEqual = this.attendeeRoleFlagEqual
            }
            // 下载附件表单配置的ID集合
            const fileSignFormConfigIds = []
            this.accessorySelectionList.forEach((item) => {
                fileSignFormConfigIds.push(item.id)
            })
            tempData.downloadFileSignFormConfigIds = fileSignFormConfigIds

            exportFileList(tempData)
                .then((res) => {
                    if (res.success) {
                        this.accessoryDialogVisible = false
                        this.$alert(
                            '正在为您导出数据,稍后请通过会务通知获取下载链接',
                            '导出提醒',
                            {
                                confirmButtonText: '我知道了',
                                callback: (action) => {}
                            }
                        )
                    }
                    closeLoading(load)
                })
                .catch(() => {
                    closeLoading(load)
                })
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
