<template>
    <div
        class="confereMain"
        :style="{'padding-top':'5px','padding-right':'1em','padding-bottom':'1em','padding-left':'1em','height':allHeight + 'px'}"
    >
        <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%;padding-top: 12px;">
            <!-- <div class="titleBackgroundClass">
                <div class="titleClass">
                    会议活动总览
                </div>
            </div> -->
            <div ref="leftDiv" :style="{ 'width': leftWidth + 'px', 'height': '100%', 'float': 'left' }">
                <div
                    class="shangxiajiantou"
                    :style="huoqushifouweiyige() ? {'box-shadow':' -1px 0px 0px 0px rgba(25, 31, 36, 0.06)'} : {'box-shadow':' -1px 0px 0px 0px #FFFFFF'}"
                >
                    <el-link
                        v-show="huoqushifouweiyige()"
                        style="width: 100%; height: 50%;border-bottom:solid 1px #DDDDDD"
                        :underline="false"
                        @click="shangyige"
                    >
                        <div style="width: 100%; height: 100%;">
                            <svg-icon icon-class="tongji_shang" />
                        </div>
                    </el-link>
                    <el-link
                        v-show="huoqushifouweiyige()"
                        style="width: 100%; height: 50%;transform:rotate(180deg);"
                        :underline="false"
                        @click="xiayige"
                    >
                        <div style="width: 100%; height: 100%;">
                            <svg-icon icon-class="tongji_shang" />
                        </div>
                    </el-link>
                </div>
                <el-carousel
                    v-if="conferenceView.conferenceStatus === 2 || conferenceView.conferenceStatus === 1"
                    ref="huandengpian"
                    height="176px"
                    direction="vertical"
                    :autoplay="false"
                >
                    <el-carousel-item v-if="conferenceoverview1">
                        <div
                            :style="{'height': '176px','width': (leftWidth - 44) + 'px','float': 'left','background-color': 'white','border-radius': '4px'}"
                        >
                            <div style="width: 22%;float:left;">
                                <div class="jinriyongcherenshuClass2">
                                    <span class="jinriyongcherenshubiaotiClass2">累计报名人数：</span>
                                    <span class="jinriyongcherenshuneirongClass2">{{ conferenceInfo.signCount }}人</span>
                                </div>
                                <div class="jinriyongcherenshuClass2">
                                    <span class="jinriyongcherenshubiaotiClass2">累计通过人数：</span>
                                    <span
                                        class="jinriyongcherenshuneirongClass2"
                                    >{{ conferenceInfo.conferenceSignTotalCount }}人</span>
                                </div>
                            </div>
                            <div style="width: 34%;float:left;min-width:300px">
                                <div style="float: left;padding-left: 24px;">
                                    <div class="jinribaomingshuClass" style="font-size: 0.9em">今日审核通过人数：</div>
                                    <div class="jinribaomingrenshuValueClass">{{ conferenceInfo.todayAuditPassCount }}人
                                    </div>

                                    <div class="zuoribaomingshuClass">昨日通过率：<span
                                        style="color: #FF8200;margin-left:12px;"
                                    >{{ conferenceInfo.yesterdayPassCountPer }}%</span>
                                    </div>
                                </div>
                                <div
                                    style="float: right;height: 120px;margin-top:90px;margin-right: 80px;font-size: 10px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.64);line-height: 16px;"
                                >
                                    通过率
                                </div>
                                <el-progress
                                    type="circle"
                                    :percentage="conferenceInfo.todayPassCountPer*1"
                                    style="margin-right: -80px;float: right;height: 120px;margin-top:28px"
                                    :stroke-width="20"
                                    stroke-linecap="butt"
                                    color="#FF820A"
                                />

                            </div>
                            <div class="tongjiyoubianClass" :style="{'max-width': leftRightMaxWidth + 'px'}">
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">
                                        报名人数
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ conferenceInfo.todaySignCount }}人
                                    </div>
                                </div>
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);margin-top: 1em;border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">
                                        审核不通过人数
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ conferenceInfo.todayAuditNoPassCount }}人
                                    </div>
                                </div>
                            </div>
                            <div class="tongjiyoubianClass" :style="{'max-width': leftRightMaxWidth + 'px'}">
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">
                                        待审核人数
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ conferenceInfo.todayAuditWaitCount }}人
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-carousel-item>
                    <el-carousel-item v-if="conferenceoverview2">
                        <div
                            :style="{'height': '176px','width': (leftWidth - 44) + 'px','float': 'left','background-color': 'white','border-radius': '4px'}"
                        >
                            <div style="width: 22%;float:left;">
                                <div class="jinriyongcherenshuClass">
                                    <span class="jinriyongcherenshubiaotiClass">用车任务数：</span>
                                    <span class="jinriyongcherenshuneirongClass">{{ vehicleInfo.taskCount }}</span>
                                </div>
                                <div class="jinriyongcherenshuClass">
                                    <span class="jinriyongcherenshubiaotiClass">接站任务数：</span>
                                    <span
                                        class="jinriyongcherenshuneirongClass"
                                    >{{ vehicleInfo.arriveTaskCount }}</span>
                                </div>
                                <div class="jinriyongcherenshuClass">
                                    <span class="jinriyongcherenshubiaotiClass">送站任务数：</span>
                                    <span
                                        class="jinriyongcherenshuneirongClass"
                                    >{{ vehicleInfo.returnTaskCount }}</span>
                                </div>
                            </div>
                            <div style="width: 34%;float:left;min-width:300px">
                                <div style="float: left;padding-left: 24px;">
                                    <div class="jinribaomingshuClass">分配人数：</div>
                                    <div class="jinribaomingrenshuValueClass">{{ vehicleInfo.finishUserCount }}人</div>
                                    <div class="zuoribaomingshuClass">昨日分配率：<span
                                        style="color: #FF8200;margin-left:12px;"
                                    >{{ vehicleInfo.yesterdayUseVehiclePer }}%</span>
                                    </div>
                                </div>
                                <div
                                    style="float: right;height: 120px;margin-top:90px;margin-right: 80px;font-size: 10px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.64);line-height: 16px;"
                                >
                                    分配率
                                </div>
                                <el-progress
                                    type="circle"
                                    :percentage="vehicleInfo.todayUseVehiclePer*1"
                                    style="margin-right: -80px;float: right;height: 120px;margin-top:28px"
                                    :stroke-width="20"
                                    stroke-linecap="butt"
                                    color="#FF820A"
                                />

                            </div>
                            <div class="tongjiyoubianClass" :style="{'max-width': leftRightMaxWidth + 'px'}">
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">
                                        需要接站人数
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ vehicleInfo.needArriveUserCount }}人
                                    </div>
                                </div>
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);margin-top: 1em;border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">
                                        需要送站人数
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ vehicleInfo.needRetuenUserCount }}人
                                    </div>
                                </div>
                            </div>
                            <div class="tongjiyoubianClass" :style="{'max-width': leftRightMaxWidth + 'px'}">

                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">
                                        待分配人数
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ vehicleInfo.waitUserCount }}人
                                    </div>
                                </div>
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);border-radius: 8px;margin-top: 1em;"
                                >
                                    <div class="leftTopRightBiaoti">
                                        无需分配人数
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ vehicleInfo.ignoreUenUserCount }}人
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-carousel-item>
                    <el-carousel-item v-if="conferenceoverview3">
                        <div
                            :style="{'height': '176px','width': (leftWidth - 44) + 'px','float': 'left','background-color': 'white','border-radius': '4px'}"
                        >
                            <div style="width: 22%;float:left;">
                                <div class="jinriyongcherenshuClass">
                                    <span class="jinriyongcherenshubiaotiClass">房间总数：</span>
                                    <span class="jinriyongcherenshuneirongClass">{{ roomInfo.roomToatalCount }}</span>
                                </div>
                                <div class="jinriyongcherenshuClass">
                                    <span class="jinriyongcherenshubiaotiClass">房间使用数量：</span>
                                    <span class="jinriyongcherenshuneirongClass">{{ roomInfo.roomUseCount }}</span>
                                </div>
                                <div class="jinriyongcherenshuClass">
                                    <span class="jinriyongcherenshubiaotiClass">单住房间数量：</span>
                                    <span
                                        class="jinriyongcherenshuneirongClass"
                                    >{{ roomInfo.roomOneselfUseCount }}</span>
                                </div>
                            </div>
                            <div style="width: 34%;float:left;min-width:300px">
                                <div style="float: left;padding-left: 24px;">
                                    <div class="jinribaomingshuClass">分配人数：</div>
                                    <div class="jinribaomingrenshuValueClass">{{ roomInfo.finishUserCount }}人</div>
                                    <div class="zuoribaomingshuClass">昨日分配率 ：<span
                                        style="color: #FF8200;margin-left:12px;"
                                    >{{ roomInfo.yesterdayUsePer }}%</span>
                                    </div>
                                </div>
                                <div
                                    style="float: right;height: 120px;margin-top:90px;margin-right: 80px;font-size: 10px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.64);line-height: 16px;"
                                >
                                    分配率
                                </div>
                                <el-progress
                                    type="circle"
                                    :percentage="roomInfo.todayUsePer*1"
                                    style="margin-right: -80px;float: right;height: 120px;margin-top:28px"
                                    :stroke-width="20"
                                    stroke-linecap="butt"
                                    color="#FF820A"
                                />

                            </div>
                            <div class="tongjiyoubianClass" :style="{'max-width': leftRightMaxWidth + 'px'}">
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">
                                        需要住宿人数
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ roomInfo.needBookRoomUserCount }}人
                                    </div>
                                </div>
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);margin-top: 1em;border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">
                                        待分配人数
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ roomInfo.waitUserCount }}人
                                    </div>
                                </div>
                            </div>
                            <div class="tongjiyoubianClass" :style="{'max-width': leftRightMaxWidth + 'px'}">
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">
                                        合住人数
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ roomInfo.mergeUserCount }}人
                                    </div>
                                </div>
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);margin-top: 1em;border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">
                                        单住人数
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ roomInfo.oneselfUserCount }}人
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-carousel-item>
                    <el-carousel-item v-if="conferenceoverview4">
                        <div
                            :style="{'height': '176px','width': (leftWidth - 44) + 'px','float': 'left','background-color': 'white','border-radius': '4px'}"
                        >
                            <div style="width: 22%;float:left;">
                                <div class="jinriyongcherenshuClass2">
                                    <span class="jinriyongcherenshubiaotiClass2">餐厅总数：</span>
                                    <span class="jinriyongcherenshuneirongClass2">{{ dinnerInfo.diningCount }}</span>
                                </div>
                                <div class="jinriyongcherenshuClass2">
                                    <span class="jinriyongcherenshubiaotiClass2">餐位总数：</span>
                                    <span class="jinriyongcherenshuneirongClass2">{{ dinnerInfo.seatNumCount }}</span>
                                </div>
                            </div>
                            <div style="width: 34%;float:left;min-width:300px">
                                <div style="float: left;padding-left: 24px;">
                                    <div class="jinribaomingshuClass">分配人数：</div>
                                    <div class="jinribaomingrenshuValueClass">{{ dinnerInfo.finishUserCount }}人</div>
                                    <div class="zuoribaomingshuClass">昨日分配率：<span
                                        style="color: #FF8200;margin-left:12px;"
                                    >{{ dinnerInfo.yesterdayPer }}%</span>
                                    </div>
                                </div>
                                <div
                                    style="float: right;height: 120px;margin-top:90px;margin-right: 80px;font-size: 10px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.64);line-height: 16px;"
                                >
                                    分配率
                                </div>
                                <el-progress
                                    type="circle"
                                    :percentage="dinnerInfo.todayPer*1"
                                    style="margin-right: -80px;float: right;height: 120px;margin-top:28px"
                                    :stroke-width="20"
                                    stroke-linecap="butt"
                                    color="#FF820A"
                                />

                            </div>
                            <div class="tongjiyoubianClass" :style="{'max-width': leftRightMaxWidth + 'px'}">
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">
                                        参会总人数
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ conferenceInfo.conferenceSignTotalCount }}人
                                    </div>
                                </div>
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);margin-top: 1em;border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">
                                        需要用餐人数
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ dinnerInfo.needBookDinnerUserCount }}人
                                    </div>
                                </div>
                            </div>
                            <div class="tongjiyoubianClass" :style="{'max-width': leftRightMaxWidth + 'px'}">
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">
                                        待分配人数
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ dinnerInfo.waitUserCount }}人
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-carousel-item>
                    <el-carousel-item v-if="conferenceoverview5">
                        <div
                            :style="{'height': '176px','width': (leftWidth - 44) + 'px','float': 'left','background-color': 'white','border-radius': '4px'}"
                        >
                            <div style="width: 22%;float:left;">
                                <div class="jinriyongcherenshuClass2">
                                    <span class="jinriyongcherenshubiaotiClass2">证件种类：</span>
                                    <span class="jinriyongcherenshuneirongClass2">{{ cardInfo.cardTypeCount }}</span>
                                </div>
                                <div class="jinriyongcherenshuClass2">
                                    <span class="jinriyongcherenshubiaotiClass2">证件总数：</span>
                                    <span class="jinriyongcherenshuneirongClass2">{{ cardInfo.cardCount }}张</span>
                                </div>
                            </div>
                            <div style="width: 34%;float:left;min-width:300px">
                                <div style="float: left;padding-left: 24px;">
                                    <div class="jinribaomingshuClass">分配数量：</div>
                                    <div class="jinribaomingrenshuValueClass">{{ cardInfo.finishCardCount }}张</div>
                                    <div class="zuoribaomingshuClass">昨日分配率：<span
                                        style="color: #FF8200;margin-left:12px;"
                                    >{{ cardInfo.yesterdayPer }}%</span>
                                    </div>
                                </div>
                                <div
                                    style="float: right;height: 120px;margin-top:90px;margin-right: 80px;font-size: 10px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.64);line-height: 16px;"
                                >
                                    分配率
                                </div>
                                <el-progress
                                    type="circle"
                                    :percentage="cardInfo.todayPer*1"
                                    style="margin-right: -80px;float: right;height: 120px;margin-top:28px"
                                    :stroke-width="20"
                                    stroke-linecap="butt"
                                    color="#FF820A"
                                />

                            </div>
                            <div class="tongjiyoubianClass" :style="{'max-width': leftRightMaxWidth + 'px'}">
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">
                                        需要证件人数
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ cardInfo.needBookCardUserCount }}人
                                    </div>
                                </div>
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);margin-top: 1em;border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">
                                        待分配人数
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ cardInfo.waitUserCount }}人
                                    </div>
                                </div>
                            </div>
                            <!-- <div :style="{'padding-right': '0.75em','padding-top': '1.5em','padding-bottom': '1.5em','padding-left': '1.5em','width': '22%','float':'left','max-width': leftRightMaxWidth + 'px'}">
                                <div style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);border-radius: 8px;">
                                    <div class="leftTopRightBiaoti">
                                        需要证件车辆
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ commonStatistics.waitUserCount }}台
                                    </div>
                                </div>
                                <div style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);margin-top: 1em;border-radius: 8px;">
                                    <div class="leftTopRightBiaoti">
                                        待分配车辆
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ commonStatistics.cardTypeCount }}台
                                    </div>
                                </div>
                            </div> -->
                        </div>
                    </el-carousel-item>
                </el-carousel>
                <el-carousel
                    v-if="conferenceView.conferenceStatus === 3 || conferenceView.conferenceStatus === 4 || conferenceView.conferenceStatus === 5"
                    ref="huandengpian"
                    height="176px"
                    direction="vertical"
                    :autoplay="false"
                >
                    <el-carousel-item v-if="conferenceoverview1">
                        <div
                            :style="{'height': '176px','width': (leftWidth - 44) + 'px','float': 'left','background-color': 'white','border-radius': '4px'}"
                        >
                            <div style="width: 22%;float:left;">
                                <div class="jinriyongcherenshuClass2">
                                    <span class="jinriyongcherenshubiaotiClass2">总报名人数：</span>
                                    <span
                                        class="jinriyongcherenshuneirongClass2"
                                    >{{ conferenceInfo.conferenceSignTotalCount }}人</span>
                                </div>
                                <div class="jinriyongcherenshuClass2">
                                    <span class="jinriyongcherenshubiaotiClass2">总报到人数：</span>
                                    <span
                                        class="jinriyongcherenshuneirongClass2"
                                    >{{ conferenceInfo.conferenceCheckInTotalCount }}人</span>
                                </div>
                            </div>
                            <div style="width: 34%;float:left;min-width:300px">
                                <div style="float: left;padding-left: 24px;">
                                    <div class="jinribaomingshuClass">今日实到人数：</div>
                                    <div class="jinribaomingrenshuValueClass">
                                        {{ conferenceInfo.conferenceTodayRealCheckInCount }}人</div>

                                    <div class="zuoribaomingshuClass">昨日签到率：<span
                                        style="color: #FF8200;margin-left:12px;"
                                    >{{ conferenceInfo.conferenceYesterdayCheckInCountPer }}%</span>
                                    </div>
                                </div>
                                <div
                                    style="float: right;height: 120px;margin-top:90px;margin-right: 80px;font-size: 10px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.64);line-height: 16px;"
                                >
                                    签到率
                                </div>
                                <el-progress
                                    type="circle"
                                    :percentage="conferenceInfo.conferenceTodayCheckInCountPer*1"
                                    style="margin-right: -80px;float: right;height: 120px;margin-top:28px"
                                    :stroke-width="20"
                                    stroke-linecap="butt"
                                    color="#FF820A"
                                />

                            </div>
                            <div class="tongjiyoubianClass" :style="{'max-width': leftRightMaxWidth + 'px'}">
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">

                                        应到人数
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ conferenceInfo.conferenceTodayAgendaCheckInTotalCount }}人
                                    </div>
                                </div>
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);margin-top: 1em;border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">

                                        请假人数
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ conferenceInfo.conferenceTodayLeaveCount }}人
                                    </div>
                                </div>
                            </div>
                            <div class="tongjiyoubianClass" :style="{'max-width': leftRightMaxWidth + 'px'}">
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">

                                        未到人数
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ conferenceInfo.conferenceTodayNoCheckInCount }}人
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-carousel-item>
                    <el-carousel-item v-if="conferenceoverview2">
                        <div
                            :style="{'height': '176px','width': (leftWidth - 44) + 'px','float': 'left','background-color': 'white','border-radius': '4px'}"
                        >
                            <div style="width: 22%;float:left;">
                                <div class="jinriyongcherenshuClass">
                                    <span class="jinriyongcherenshubiaotiClass">今日用车人次：</span>
                                    <span
                                        class="jinriyongcherenshuneirongClass"
                                    >{{ vehicleInfo.todayUserCount }}人次</span>
                                </div>
                                <div class="jinriyongcherenshuClass">
                                    <span class="jinriyongcherenshubiaotiClass">今日用车任务数：</span>
                                    <span class="jinriyongcherenshuneirongClass">{{ vehicleInfo.todayTaskCount }}</span>
                                </div>
                                <div class="jinriyongcherenshuClass">
                                    <span class="jinriyongcherenshubiaotiClass">任务完成率：</span>
                                    <span class="jinriyongcherenshuneirongClass">{{ vehicleInfo.taskFinishPer }}</span>
                                </div>
                            </div>
                            <div style="width: 34%;float:left;min-width:300px">
                                <div style="float: left;padding-left: 24px;">
                                    <div class="jinribaomingshuClass">今日使用车辆：</div>
                                    <div class="jinribaomingrenshuValueClass">{{ vehicleInfo.todayVehicleCount }}台</div>
                                    <div class="zuoribaomingshuClass">昨日使用率：<span
                                        style="color: #FF8200;margin-left:12px;"
                                    >{{ vehicleInfo.yesterdayUseVehiclePer }}</span>
                                    </div>
                                </div>
                                <div
                                    style="float: right;height: 120px;margin-top:90px;margin-right: 80px;font-size: 10px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.64);line-height: 16px;"
                                >
                                    使用率
                                </div>
                                <el-progress
                                    type="circle"
                                    :percentage="vehicleInfo.todayUseVehiclePer*1"
                                    style="margin-right: -80px;float: right;height: 120px;margin-top:28px"
                                    :stroke-width="20"
                                    stroke-linecap="butt"
                                    color="#FF820A"
                                />

                            </div>
                            <div class="tongjiyoubianClass" :style="{'max-width': leftRightMaxWidth + 'px'}">
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">

                                        车辆总数
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ vehicleInfo.vehicleTotalCount }}台
                                    </div>
                                </div>
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);margin-top: 1em;border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">

                                        空闲车辆
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ vehicleInfo.todayVehicleFreeCount }}台
                                    </div>
                                </div>
                            </div>
                            <div class="tongjiyoubianClass" :style="{'max-width': leftRightMaxWidth + 'px'}" />
                        </div>
                    </el-carousel-item>
                    <el-carousel-item v-if="conferenceoverview3">
                        <div
                            :style="{'height': '176px','width': (leftWidth - 44) + 'px','float': 'left','background-color': 'white','border-radius': '4px'}"
                        >
                            <div style="width: 22%;float:left;">
                                <div class="jinriyongcherenshuClass">
                                    <span class="jinriyongcherenshubiaotiClass">总入住人数：</span>
                                    <span class="jinriyongcherenshuneirongClass">{{ roomInfo.userCount }}人</span>
                                </div>
                                <div class="jinriyongcherenshuClass">
                                    <span class="jinriyongcherenshubiaotiClass">今日入住人数：</span>
                                    <span class="jinriyongcherenshuneirongClass">{{ roomInfo.todayUserCount }}人</span>
                                </div>
                                <div class="jinriyongcherenshuClass">
                                    <span class="jinriyongcherenshubiaotiClass">今日离开人数：</span>
                                    <span
                                        class="jinriyongcherenshuneirongClass"
                                    >{{ roomInfo.todayLeaveUserCount }}人</span>
                                </div>
                            </div>
                            <div style="width: 34%;float:left;min-width:300px">
                                <div style="float: left;padding-left: 24px;">
                                    <div class="jinribaomingshuClass">今日使用房间：</div>
                                    <div class="jinribaomingrenshuValueClass">{{ roomInfo.todayRoomCount }}间</div>
                                    <div class="zuoribaomingshuClass">昨日使用率 ：<span
                                        style="color: #FF8200;margin-left:12px;"
                                    >{{ roomInfo.yesterdayUsePer }}</span>
                                    </div>
                                </div>
                                <div
                                    style="float: right;height: 120px;margin-top:90px;margin-right: 80px;font-size: 10px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.64);line-height: 16px;"
                                >
                                    使用率
                                </div>
                                <el-progress
                                    type="circle"
                                    :percentage="roomInfo.todayUsePer*1"
                                    style="margin-right: -80px;float: right;height: 120px;margin-top:28px"
                                    :stroke-width="20"
                                    stroke-linecap="butt"
                                    color="#FF820A"
                                />

                            </div>
                            <div class="tongjiyoubianClass" :style="{'max-width': leftRightMaxWidth + 'px'}">
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">
                                        房型种类
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ roomInfo.roomFormCount }}种
                                    </div>
                                </div>
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);margin-top: 1em;border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">
                                        房间总数
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ roomInfo.roomToatalCount }}间
                                    </div>
                                </div>
                            </div>
                            <div class="tongjiyoubianClass" :style="{'max-width': leftRightMaxWidth + 'px'}">
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">
                                        空闲房间
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ roomInfo.roomFreeCount }}间
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-carousel-item>
                    <el-carousel-item v-if="conferenceoverview4">
                        <div
                            :style="{'height': '176px','width': (leftWidth - 44) + 'px','float': 'left','background-color': 'white','border-radius': '4px'}"
                        >
                            <div style="width: 22%;float:left;">
                                <div class="jinriyongcherenshuClass2">
                                    <span class="jinriyongcherenshubiaotiClass2">今日参会人数：</span>
                                    <span
                                        class="jinriyongcherenshuneirongClass2"
                                    >{{ conferenceInfo.conferenceTodayAgendaCheckInTotalCount }}人</span>
                                </div>
                                <div class="jinriyongcherenshuClass2">
                                    <span class="jinriyongcherenshubiaotiClass2">今日用餐人数：</span>
                                    <span
                                        class="jinriyongcherenshuneirongClass2"
                                    >{{ dinnerInfo.todayUserCount }}人</span>
                                </div>
                            </div>
                            <div style="width: 34%;float:left;min-width:300px">
                                <div style="float: left;padding-left: 24px;">
                                    <div class="jinribaomingshuClass">今日使用餐位：</div>
                                    <div class="jinribaomingrenshuValueClass">{{ dinnerInfo.todayMaxSeatNumCountSum }}
                                    </div>
                                    <div class="zuoribaomingshuClass">昨日使用率：<span
                                        style="color: #FF8200;margin-left:12px;"
                                    >{{ dinnerInfo.yesterdayPer }}%</span>
                                    </div>
                                </div>
                                <div
                                    style="float: right;height: 120px;margin-top:90px;margin-right: 80px;font-size: 10px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.64);line-height: 16px;"
                                >
                                    使用率
                                </div>
                                <el-progress
                                    type="circle"
                                    :percentage="dinnerInfo.todayPer*1"
                                    style="margin-right: -80px;float: right;height: 120px;margin-top:28px"
                                    :stroke-width="20"
                                    stroke-linecap="butt"
                                    color="#FF820A"
                                />

                            </div>
                            <div class="tongjiyoubianClass" :style="{'max-width': leftRightMaxWidth + 'px'}">
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">

                                        餐厅总数
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ dinnerInfo.diningCount }}
                                    </div>
                                </div>
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);margin-top: 1em;border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">

                                        餐位总数
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ dinnerInfo.seatNumCount }}
                                    </div>
                                </div>
                            </div>
                            <div class="tongjiyoubianClass" :style="{'max-width': leftRightMaxWidth + 'px'}">
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">

                                        剩余餐位
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ dinnerInfo.freeSeatNmuCount }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-carousel-item>
                    <el-carousel-item v-if="conferenceoverview5">
                        <div
                            :style="{'height': '176px','width': (leftWidth - 44) + 'px','float': 'left','background-color': 'white','border-radius': '4px'}"
                        >
                            <div style="width: 22%;float:left;">
                                <div class="jinriyongcherenshuClass2">
                                    <span class="jinriyongcherenshubiaotiClass2">总发证人数：</span>
                                    <span class="jinriyongcherenshuneirongClass2">{{ cardInfo.userCount }}人</span>
                                </div>
                                <div class="jinriyongcherenshuClass2">
                                    <span class="jinriyongcherenshubiaotiClass2">总发证车辆：</span>
                                    <span class="jinriyongcherenshuneirongClass2">{{ cardInfo.vehilceCount }}台</span>
                                </div>
                            </div>
                            <div style="width: 34%;float:left;min-width:300px">
                                <div style="float: left;padding-left: 24px;">
                                    <div class="jinribaomingshuClass">今日发证数量：</div>
                                    <div class="jinribaomingrenshuValueClass">{{ cardInfo.todayUserAndVehicleCount }}张
                                    </div>
                                    <div class="zuoribaomingshuClass">昨日发证率：<span
                                        style="color: #FF8200;margin-left:12px;"
                                    >{{ cardInfo.yesterdayPer }}</span>
                                    </div>
                                </div>
                                <div
                                    style="float: right;height: 120px;margin-top:90px;margin-right: 80px;font-size: 10px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.64);line-height: 16px;"
                                >
                                    发证率
                                </div>
                                <el-progress
                                    type="circle"
                                    :percentage="cardInfo.todayPer*1"
                                    style="margin-right: -80px;float: right;height: 120px;margin-top:28px"
                                    :stroke-width="20"
                                    stroke-linecap="butt"
                                    color="#FF820A"
                                />

                            </div>
                            <div class="tongjiyoubianClass" :style="{'max-width': leftRightMaxWidth + 'px'}">
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">
                                        嘉宾证总数
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ cardInfo.cardType1Count }}张
                                    </div>
                                </div>
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);margin-top: 1em;border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">
                                        剩余数量
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ cardInfo.cardType1FreeCount }}张
                                    </div>
                                </div>
                            </div>
                            <div class="tongjiyoubianClass" :style="{'max-width': leftRightMaxWidth + 'px'}">
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">

                                        车证总数
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ cardInfo.cardType2Count }}张
                                    </div>
                                </div>
                                <div
                                    style="width: 100%;height: 56px;background: rgba(25, 31, 36, 0.04);margin-top: 1em;border-radius: 8px;"
                                >
                                    <div class="leftTopRightBiaoti">
                                        剩余数量
                                    </div>
                                    <div class="leftTopRightNeirong">
                                        {{ cardInfo.cardType2FreeCount }}张
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-carousel-item>
                </el-carousel>
                <LeftMiddle ref="leftMiddle" />
                <!-- , 'height': leftBottomHeight + 'px' -->
                <div
                    ref="leftBottomDiv"
                    :style="{'width':'100%','margin-top':'1em','background-color':'white','border-radius': '4px', 'padding': '16px'}"
                >
                    <div class="wodedaibanClass">
                        <div
                            style="width: 4px;height: 16px;background: #1E89FF;float:left;margin-right:4px;margin-top:1px;"
                        />
                        我的待办
                        <el-link type="primary" style="float: right" :underline="false" @click="chakangengduodaiban">
                            查看更多</el-link>
                    </div>
                    <div v-show="total0 > 0" class="wodedaibantishiwenziClass" style="margin-top: 16px;">
                        您有 <span style="color:#1E89FF">{{ total0 }}</span> 条任务待处理
                    </div>
                    <div v-show="total0 === 0" class="wodedaibantishiwenziClass" style="margin-top: 16px;">

                        您有 0 条任务待处理

                    </div>
                    <div v-show="total0 === 0" style="margin-top: 24px;width: 100%;margin-left:-12px;height: 64px" />
                    <div v-show="total0 > 0" style="margin-top: 24px;width: 100%;margin-left:-12px;height: 64px">
                        <el-button
                            :type="renwuleixing === 0 ? 'primary' : '' "
                            style="margin-top: 5px;margin-left: 12px;"
                            @click="gaibianRenwuleixing(0)"
                        >
                            全部待办
                            <span
                                v-show="total0 > 0"
                                style="margin-left: 5px;padding-left: 5px;padding-right: 5px;height: 16px;background: #EA340F;border-radius: 9px;lineheight:16px;font-size:10px;color:white"
                            >{{ total0 }}</span>
                        </el-button>
                        <!-- 1：报名审核，2：报名变更审核， 3：取消报名，4：行程变更，5：请假，51：用餐资源分配，52：住宿资源分配，53：制证资源分配 61:接站用车； 62：送站用车； 63：会议用车 -->
                        <el-button
                            :type="renwuleixing === 1 ? 'primary' : '' "
                            style="margin-top: 5px;margin-left: 12px;"
                            @click="gaibianRenwuleixing(1)"
                        >报名审核
                            <span
                                v-show="total1 > 0"
                                style="margin-left: 5px;padding-left: 5px;padding-right: 5px;height: 16px;background: #EA340F;border-radius: 9px;lineheight:16px;font-size:10px;color:white"
                            >{{ total1 }}</span>
                        </el-button>
                        <el-button
                            :type="renwuleixing === 2 ? 'primary' : '' "
                            style="margin-top: 5px;margin-left: 12px;"
                            @click="gaibianRenwuleixing(2)"
                        >报名变更审核
                            <span
                                v-show="total2 > 0"
                                style="margin-left: 5px;padding-left: 5px;padding-right: 5px;height: 16px;background: #EA340F;border-radius: 9px;lineheight:16px;font-size:10px;color:white"
                            >{{ total2 }}</span>
                        </el-button>
                        <el-button
                            :type="renwuleixing === 3 ? 'primary' : '' "
                            style="margin-top: 5px;margin-left: 12px;"
                            @click="gaibianRenwuleixing(3)"
                        >取消报名
                            <span
                                v-show="total3 > 0"
                                style="margin-left: 5px;padding-left: 5px;padding-right: 5px;height: 16px;background: #EA340F;border-radius: 9px;lineheight:16px;font-size:10px;color:white"
                            >{{ total3 }}</span>
                        </el-button>
                        <el-button
                            :type="renwuleixing === 4 ? 'primary' : '' "
                            style="margin-top: 5px;margin-left: 12px;"
                            @click="gaibianRenwuleixing(4)"
                        >行程变更
                            <span
                                v-show="total4 > 0"
                                style="margin-left: 5px;padding-left: 5px;padding-right: 5px;height: 16px;background: #EA340F;border-radius: 9px;lineheight:16px;font-size:10px;color:white"
                            >{{ total4 }}</span>
                        </el-button>
                        <el-button
                            :type="renwuleixing === 5 ? 'primary' : '' "
                            style="margin-top: 5px;margin-left: 12px;"
                            @click="gaibianRenwuleixing(5)"
                        >请假
                            <span
                                v-show="total5 > 0"
                                style="margin-left: 5px;padding-left: 5px;padding-right: 5px;height: 16px;background: #EA340F;border-radius: 9px;lineheight:16px;font-size:10px;color:white"
                            >{{ total5 }}</span>
                        </el-button>
                        <el-button
                            :type="renwuleixing === 6 ? 'primary' : '' "
                            style="margin-top: 5px;margin-left: 12px;"
                            @click="gaibianRenwuleixing(6)"
                        >用车资源分配
                            <span
                                v-show="total6 > 0"
                                style="margin-left: 5px;padding-left: 5px;padding-right: 5px;height: 16px;background: #EA340F;border-radius: 9px;lineheight:16px;font-size:10px;color:white"
                            >{{ total6 }}</span>
                        </el-button>
                        <el-button
                            :type="renwuleixing === 7 ? 'primary' : '' "
                            style="margin-top: 5px;margin-left: 12px;"
                            @click="gaibianRenwuleixing(7)"
                        >用餐资源分配
                            <span
                                v-show="total7 > 0"
                                style="margin-left: 5px;padding-left: 5px;padding-right: 5px;height: 16px;background: #EA340F;border-radius: 9px;lineheight:16px;font-size:10px;color:white"
                            >{{ total7 }}</span>
                        </el-button>
                        <el-button
                            :type="renwuleixing === 8 ? 'primary' : '' "
                            style="margin-top: 5px;margin-left: 12px;"
                            @click="gaibianRenwuleixing(8)"
                        >住宿资源分配
                            <span
                                v-show="total8 > 0"
                                style="margin-left: 5px;padding-left: 5px;padding-right: 5px;height: 16px;background: #EA340F;border-radius: 9px;lineheight:16px;font-size:10px;color:white"
                            >{{ total8 }}</span>
                        </el-button>
                        <el-button
                            :type="renwuleixing === 9 ? 'primary' : '' "
                            style="margin-top: 5px;margin-left: 12px;"
                            @click="gaibianRenwuleixing(9)"
                        >制证资源分配
                            <span
                                v-show="total9 > 0"
                                style="margin-left: 5px;padding-left: 5px;padding-right: 5px;height: 16px;background: #EA340F;border-radius: 9px;lineheight:16px;font-size:10px;color:white"
                            >{{ total9 }}</span>
                        </el-button>

                    </div>
                    <div
                        v-show="total === 0"
                        :style="{'margin-top': '29px','width': '100%', 'height': '540px','text-align': 'center'}"
                    >
                        <img src="../../../assets/table-no-data.png" style="height: 8em">
                        <div style="width: 100%;text-align:center" class="wushujuwenziClass">暂无待办信息，休息一下吧</div>
                    </div>
                    <!-- , 'height': leftBottomTableHeight + 'px' -->
                    <div v-show="total > 0" :style="{'margin-top': '19px','width': '100%'}">
                        <el-table :data="tableData" stripe style="width: 100%" height="490px">
                            <el-table-column width="50">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.level === 3">
                                        <el-tag size="mini" color="#FF8200">
                                            <font color="#ffffff">紧急</font>

                                        </el-tag>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="标题" min-width="120">
                                <template slot-scope="scope">
                                    {{ formatTableCellData(scope.row.todoTitle) }}
                                </template>
                            </el-table-column>
                            <el-table-column label="发起人" width="120">
                                <template slot-scope="scope">
                                    {{ formatTableCellData(scope.row.createUserName) }}
                                </template>
                            </el-table-column>
                            <el-table-column label="接收时间" width="120">
                                <template slot-scope="scope">
                                    {{ scope.row.createTime !== null && scope.row.createTime.length >= 17 ? scope.row.createTime.substr(0,16) : scope.row.createTime }}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center" fixed="right" width="120">
                                <template slot-scope="scope">
                                    <el-button size="mini" @click="lijichuli(scope.row)">
                                        立即处理
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
                                :total="total"
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                            />
                        </div>
                        <!-- -->
                        <!-- -->
                    </div>
                </div>
            </div>
            <div :style="{ 'width': rightWidth + 'px', 'height': '100%', 'float': 'left', 'margin-left': '1em' }">
                <div
                    :class="conferenceView.conferenceStatus === 2 ? 'rightWeiKaishiClass' : (conferenceView.conferenceStatus === 3 ? 'rightJinXingZhongClass' : 'rightYiJieShuClass')"
                    style="color: white"
                >
                    <div class="conferenceNameClass">
                        {{ conferenceView.name }}
                    </div>
                    <div class="conferenceDateClass">
                        <span>{{ GMTToStrNianYueRiOfChiness(conferenceView.startTime) }}</span>
                        {{ conferenceView.startTime !== null && conferenceView.startTime !== '' ? '-' : '' }}
                        <span>{{ GMTToStrNianYueRiOfChiness(conferenceView.endTime) }}</span>
                    </div>
                    <div class="conferenceStatClass" style="float: left;width: 160px;">
                        <svg-icon
                            v-show="conferenceView.conferenceStatus === 3"
                            style="margin-right:9px;"
                            icon-class="jinxingzhong"
                        />
                        <svg-icon
                            v-show="conferenceView.conferenceStatus === 2"
                            style="margin-right:9px;"
                            icon-class="weikaishi"
                        />
                        <svg-icon
                            v-show="conferenceView.conferenceStatus === 4"
                            style="margin-right:9px;"
                            icon-class="yijieshu"
                        />
                        {{ conferenceView.conferenceStatus !== 2 ? conferenceView.conferenceStatusStr : getDaysBetweenForWeikaishi(new Date(), conferenceView.startTime) !== '0' ? '距离会议开始还有' : '会议将于今日' }}
                    </div>
                    <div
                        v-show="conferenceView.conferenceStatus === 2 "
                        class="conferenceStatClass3"
                        style="float: right;margin-right: 16px;"
                    >
                        {{ getDaysBetweenForWeikaishi(new Date(), conferenceView.startTime) !== '0' ? '天' : '开始' }}
                    </div>
                    <div
                        v-show="conferenceView.conferenceStatus === 3"
                        class="conferenceStatClass3"
                        style="float: right;margin-right: 16px;"
                    >
                        天
                    </div>
                    <!-- <div
                        v-show="conferenceView.conferenceStatus === 2 || conferenceView.conferenceStatus === 3"
                        class="conferenceStatClass2"
                        style="float: right;margin-right: 12px;"
                    >
                        {{ getDaysBetween(conferenceView.startTime, new Date()) }}
                    </div> -->

                    <div
                        v-show="conferenceView.conferenceStatus === 2"
                        class="conferenceStatClass2"
                        style="float: right;margin-right: 12px;"
                    >
                        {{ getDaysBetweenForWeikaishi(new Date(), conferenceView.startTime) !== '0' ? getDaysBetweenForWeikaishi(new Date(), conferenceView.startTime) : GMTToStrHHmm(conferenceView.startTime) }}
                    </div>
                    <div
                        v-show=" conferenceView.conferenceStatus === 3"
                        class="conferenceStatClass2"
                        style="float: right;margin-right: 12px;"
                    >
                        {{ getDaysBetween(conferenceView.startTime, new Date()) }}
                    </div>
                    <div
                        v-show="conferenceView.conferenceStatus === 3"
                        class="conferenceStatClass3"
                        style="float: right;margin-right: 16px;"
                    >
                        第
                    </div>
                </div>

                <!-- 'height': rightBottomHeight + 'px', -->
                <!-- 'height': (rightBottomHeight - 28) + 'px', -->
                <div :style="{ 'background-color': 'white'}">
                    <!-- <div><el-link :underline="false" class="gengzaodeyichengClass">更早的议程</el-link></div> -->
                    <div
                        :style="{'overflow-x':'hidden','overflow-y':'auto', 'padding': '16px','height': rightDivHeight + 'px'}"
                    >
                        <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                            <OverviewAgenda ref="overviewAgenda" :conference-view="conferenceView" />
                        </el-scrollbar>
                    </div>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
import { getTableHeight, GMTToStrNianYueRiOfChiness, getDaysBetween, getDaysBetweenForWeikaishi, GMTToStrHHmm } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
import { getView } from '@/api/conference'
import { getTaskList } from '@/api/attendee'
import OverviewAgenda from './agendaTree'
import LeftMiddle from './leftMiddle'
import { getStatistics } from '@/api/overview'
export default {
    name: 'ConferenceOverview1600',
    components: {
        OverviewAgenda,
        LeftMiddle
    },
    data() {
        return {
            conferenceoverview1: this.$store.state.menu.buttons.indexOf(this.Global.buttons.ConferenceOverview.overview1) !== -1,
            conferenceoverview2: this.$store.state.menu.buttons.indexOf(this.Global.buttons.ConferenceOverview.overview2) !== -1,
            conferenceoverview3: this.$store.state.menu.buttons.indexOf(this.Global.buttons.ConferenceOverview.overview3) !== -1,
            conferenceoverview4: this.$store.state.menu.buttons.indexOf(this.Global.buttons.ConferenceOverview.overview4) !== -1,
            conferenceoverview5: this.$store.state.menu.buttons.indexOf(this.Global.buttons.ConferenceOverview.overview5) !== -1,
            vehicleInfo: {
                // 已开始
                todayUserCount: 0, // 今日用车人次
                todayTaskCount: 0, // 今日用车任务数
                taskFinishPer: '0.00', // 任务完成率
                todayVehicleCount: 0, // 今日使用车辆
                vehicleTotalCount: 0, // 车辆总数
                todayVehicleFreeCount: 0, // 空闲车辆
                // 未开始
                taskCount: 0, // 用车任务数
                arriveTaskCount: 0, // 接站任务数
                returnTaskCount: 0, // 送站任务数
                needArriveUserCount: 0, // 需要接站人数
                needRetuenUserCount: 0, // 需要送站人数
                finishUserCount: 0, // 已分配人数
                waitUserCount: 0, // 待分配人数
                ignoreUenUserCount: 6, // 无需分配人数
                // 开始前后百分比
                todayUseVehiclePer: '0.00',
                yesterdayUseVehiclePer: '0.00'
            },
            roomInfo: {
                // 进行中
                userCount: 0, // 总入住人数
                todayUserCount: 0, // 今日入住人数
                todayLeaveUserCount: 0, // 今日离开人数
                todayRoomCount: 0, // 今日使用房间数
                roomFormCount: 0, // 房型种类
                roomFreeCount: 0, // 空闲房间
                // 未开始
                roomUseCount: 0, // 房间使用数量
                roomOneselfUseCount: 0, // 单住房间数量
                needBookRoomUserCount: 0, // 需要分配住宿人数
                waitUserCount: 0, // 待分配人数
                mergeUserCount: 0, // 合住人数
                oneselfUserCount: 0, // 单住人数
                finishUserCount: 0, // 分配人数
                // 开始前后
                roomToatalCount: 0, // 房间总数
                todayUsePer: '0.00',
                yesterdayUsePer: '0.00'
            },
            dinnerInfo: {
                // 未开始
                finishUserCount: 0, // 分配人数
                // 参会总人数  会议概览-未开始-已通过人数
                needBookDinnerUserCount: 0, // 需要用餐人数
                waitUserCount: 0, // 待分配人数
                // 进行中
                // 今日参会人数  会议概览 - 进行中 - 应到人数
                todayUserCount: 0, // 今日用餐人数
                todayMaxSeatNumCountSum: 0, // 今日使用餐位
                freeSeatNmuCount: 0, // 剩余餐位
                // 开始前后
                diningCount: 0, // 餐厅总数
                seatNumCount: 0, // 餐位总数
                todayPer: '0.00',
                yesterdayPer: '0.00'
            },
            cardInfo: {
                // 已开始
                userCount: 0, // 总发证人数
                vehilceCount: 0, // 总发证车辆
                todayUserAndVehicleCount: 0, // 今日发证数量
                cardType1Count: 0, // 嘉宾证总数
                cardType1FreeCount: 0, // 嘉宾证剩余数量
                cardType2Count: 0, // 车证总数
                cardType2FreeCount: 0, // 车证剩余数量
                // 未开始
                cardTypeCount: 0, // 证件种类
                cardCount: 0, // 证件总数
                finishCardCount: 0, // 已分配证件数量
                needBookCardUserCount: 0, // 需要制证人数
                waitUserCount: 0, // 待分配人数
                // 开始前后
                todayPer: '0.00',
                yesterdayPer: '0.00'
            },
            conferenceInfo: {
                conferenceSignTotalCount: 0, // 总报名人数
                conferenceCheckInTotalCount: 0, // 总报到人数
                conferenceTodayRealCheckInCount: 0, // 今日实到人数
                conferenceTodayAgendaCheckInTotalCount: 0, // 应到人数
                conferenceTodayLeaveCount: 0, // 请假人数
                conferenceTodayNoCheckInCount: 0, // 未到人数
                conferenceTodayCheckInCountPer: 0, // 今日签到率
                conferenceYesterdayCheckInCountPer: 0 // 昨日签到率
            },
            conferenceView: {},
            pageInfo: {
                pageNum: 1,
                pageSize: 10
            },
            total: 0,
            total0: 0,
            total1: 0,
            total2: 0,
            total3: 0,
            total4: 0,
            total5: 0,
            total6: 0,
            total7: 0,
            total8: 0,
            total9: 0,
            typeEqual: [],
            tableData: [],
            rightDivHeight: 870,
            leftWidth: window.innerWidth - 16 * 3 - 200 - 366,
            rightWidth: 366,
            rightBottomHeight: getTableHeight(205),
            leftRightMaxWidth: ((window.innerWidth - 16 * 3 - 200 - 366 - 44) * 0.76 - 300) / 2,
            leftBottomHeight: getTableHeight(342),
            leftBottomTableHeight: getTableHeight(342) - 104,
            allHeight: getTableHeight(-20),
            renwuleixing: 0
        }
    },
    created() {
        this.huyoquhuiyi()
        this.huoqushuliang(0)
        this.huoqushuliang(1)
        this.huoqushuliang(2)
        this.huoqushuliang(3)
        this.huoqushuliang(4)
        this.huoqushuliang(5)
        this.huoqushuliang(6)
        this.huoqushuliang(7)
        this.huoqushuliang(8)
        this.huoqushuliang(9)
        this.getTaskList()
        //
    },
    mounted() {
        this.rightDivHeight = this.$refs.leftBottomDiv.offsetHeight + 135
    },
    methods: {
        huoqushifouweiyige() {
            var mm = 0
            if (this.conferenceoverview1) {
                mm++
            }
            if (this.conferenceoverview2) {
                mm++
            }
            if (this.conferenceoverview3) {
                mm++
            }
            if (this.conferenceoverview4) {
                mm++
            }
            if (this.conferenceoverview5) {
                mm++
            }
            if (mm <= 1) {
                return false
            } else {
                return true
            }
        },
        GMTToStrHHmm(val) {
            return GMTToStrHHmm(val)
        },
        chakangengduodaiban() {
            this.$router.push({
                path: `/meetingCreate/todoWorkList/${getConferenceId()}`
            })
        },
        getJinXingZhongStatistics() {
            var conferenceStatus = 1
            if (this.conferenceView.conferenceStatus === 1 || this.conferenceView.conferenceStatus === 2) {
                conferenceStatus = 1
            } else {
                conferenceStatus = 2
            }
            getStatistics({ conferenceId: getConferenceId(), statisticsType: 1, conferenceStatus: conferenceStatus }).then(res => {
                if (res.success) {
                    this.conferenceInfo = res.result.conferenceInfo
                }
            })
            getStatistics({ conferenceId: getConferenceId(), statisticsType: 2, conferenceStatus: conferenceStatus }).then(res => {
                if (res.success) {
                    this.vehicleInfo = res.result.vehicleInfo
                }
            })
            getStatistics({ conferenceId: getConferenceId(), statisticsType: 3, conferenceStatus: conferenceStatus }).then(res => {
                if (res.success) {
                    this.roomInfo = res.result.roomInfo
                }
            })
            getStatistics({ conferenceId: getConferenceId(), statisticsType: 4, conferenceStatus: conferenceStatus }).then(res => {
                if (res.success) {
                    this.dinnerInfo = res.result.dinnerInfo
                }
            })
            getStatistics({ conferenceId: getConferenceId(), statisticsType: 5, conferenceStatus: conferenceStatus }).then(res => {
                if (res.success) {
                    this.cardInfo = res.result.cardInfo
                }
            })
        },
        gaibianRenwuleixing(val) {
            this.renwuleixing = val
            if (val === 0) {
                this.typeEqual = [1, 2, 3, 4, 5, 51, 52, 53, 61, 62, 63]
            } else if (val === 1) {
                this.typeEqual = [1]
            } else if (val === 2) {
                this.typeEqual = [2]
            } else if (val === 3) {
                this.typeEqual = [3]
            } else if (val === 4) {
                this.typeEqual = [4]
            } else if (val === 5) {
                this.typeEqual = [5]
            } else if (val === 6) {
                this.typeEqual = [61, 62, 63]
            } else if (val === 7) {
                this.typeEqual = [51]
            } else if (val === 8) {
                this.typeEqual = [52]
            } else if (val === 9) {
                this.typeEqual = [53]
            }
            this.getTaskList()
        },
        getDaysBetweenForWeikaishi(val1, val2) {
            return getDaysBetweenForWeikaishi(val1, val2).replace('-', '')
        },
        getDaysBetween(val1, val2) {
            return getDaysBetween(val1, val2).replace('-', '')
        },
        huoqushuliang(val) {
            var dataTemp = { conferenceId: getConferenceId(), statusFlag: 1, pageNum: this.pageInfo.pageNum, pageSize: this.pageInfo.pageSize, typeEqual: [] }
            if (val === 0) {
                dataTemp.typeEqual = [1, 2, 3, 4, 5, 51, 52, 53, 61, 62, 63]
            } else if (val === 1) {
                dataTemp.typeEqual = [1]
            } else if (val === 2) {
                dataTemp.typeEqual = [2]
            } else if (val === 3) {
                dataTemp.typeEqual = [3]
            } else if (val === 4) {
                dataTemp.typeEqual = [4]
            } else if (val === 5) {
                dataTemp.typeEqual = [5]
            } else if (val === 6) {
                dataTemp.typeEqual = [61, 62, 63]
            } else if (val === 7) {
                dataTemp.typeEqual = [51]
            } else if (val === 8) {
                dataTemp.typeEqual = [52]
            } else if (val === 9) {
                dataTemp.typeEqual = [53]
            }
            getTaskList(dataTemp).then(res => {
                if (val === 0) {
                    this.total0 = res.result.total
                } else if (val === 1) {
                    this.total1 = res.result.total
                } else if (val === 2) {
                    this.total2 = res.result.total
                } else if (val === 3) {
                    this.total3 = res.result.total
                } else if (val === 4) {
                    this.total4 = res.result.total
                } else if (val === 5) {
                    this.total5 = res.result.total
                } else if (val === 6) {
                    this.total6 = res.result.total
                } else if (val === 7) {
                    this.total7 = res.result.total
                } else if (val === 8) {
                    this.total8 = res.result.total
                } else if (val === 9) {
                    this.total9 = res.result.total
                }
            })
        },

        GMTToStrNianYueRiOfChiness(val) {
            return GMTToStrNianYueRiOfChiness(val)
        },
        huyoquhuiyi() {
            getView({ 'id': getConferenceId() }).then(res => {
                this.conferenceView = res.result
                this.getJinXingZhongStatistics()
                this.$refs.overviewAgenda.huyoqutianqi(res.result)
                this.$refs.overviewAgenda.getAgendaList()
                this.$refs.leftMiddle.getSignConfig()
            })
        },
        lijichuli(val) {
            if (val.type === 50 || val.type === 61 || val.type === 62 || val.type === 63) {
                this.$router.push({ name: 'distribution', params: { sourceType: val.type }})
                return
            }
            if (val.type === 51) {
                this.$router.push({ name: 'diningDistribution', params: { sourceType: val.type }})
                return
            }
            if (val.type === 52) {
                this.$router.push({ name: 'hotelDistribution', params: { sourceType: val.type }})
                return
            }
            if (val.type === 53) {
                this.$router.push({ name: 'cardDistribution', params: { sourceType: val.type }})
                return
            }

            this.$router.push({
                path: `/attendeeManagement/attendee/check/${val.attendeeId}/${val.type}/${val.id}`
            })
        },
        shangyige() {
            this.$refs.huandengpian.prev()
        },
        xiayige() {
            this.$refs.huandengpian.next()
        },
        handleCurrentChange(val) {
            this.pageInfo.pageNum = val
            this.getTaskList()
        },
        handleSizeChange(val) {
            this.pageInfo.pageSize = val
            this.getTaskList()
        },
        getTaskList() {
            getTaskList({
                conferenceId: getConferenceId(), statusFlag: 1, sortName: 'attendeetask.level desc, attendeetask.createTime',
                sortStatus: 'desc', pageNum: this.pageInfo.pageNum, pageSize: this.pageInfo.pageSize, typeEqual: this.typeEqual
            }).then(res => {
                this.tableData = res.result.list
                if (res.result.list !== null) {
                    this.total = res.result.total
                } else {
                    this.total = 0
                }
                if (this.renwuleixing === 0) {
                    this.total0 = res.result.total
                } else if (this.renwuleixing === 1) {
                    this.total1 = res.result.total
                } else if (this.renwuleixing === 2) {
                    this.total2 = res.result.total
                } else if (this.renwuleixing === 3) {
                    this.total3 = res.result.total
                } else if (this.renwuleixing === 4) {
                    this.total4 = res.result.total
                } else if (this.renwuleixing === 5) {
                    this.total5 = res.result.total
                } else if (this.renwuleixing === 6) {
                    this.total6 = res.result.total
                } else if (this.renwuleixing === 7) {
                    this.total7 = res.result.total
                } else if (this.renwuleixing === 8) {
                    this.total8 = res.result.total
                } else if (this.renwuleixing === 9) {
                    this.total9 = res.result.total
                }
            })
        }
    }
}
</script>
<style scoped>
.titleClass {
    height: 22px;
    font-size: 1.05em;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #191f24;
    line-height: 22px;
}
.titleBackgroundClass {
    height: 44px;
    background: rgba(255, 255, 255, 0);
}
.rightWeiKaishiClass {
    height: 170px;
    background-image: url(../../../assets/weikaishi.png);
}
.rightJinXingZhongClass {
    height: 170px;
    background-image: url(../../../assets/jinxingzhong.png);
}
.rightYiJieShuClass {
    height: 170px;
    background-image: url(../../../assets/yijieshu.png);
}
.conferenceNameClass {
    padding-top: 16px;
    margin-left: 16px;
    width: 243px;
    height: 38px;
    font-size: 17px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    line-height: 22px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.conferenceDateClass {
    margin-left: 16px;
    margin-top: 4px;
    height: 16px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 16px;
}

.conferenceStatClass {
    margin-left: 16px;
    margin-top: 43px;
    height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 20px;
}
.conferenceStatClass2 {
    margin-top: 14px;
    height: 60px;
    font-size: 50px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 60px;
}
.conferenceStatClass3 {
    margin-top: 43px;
    height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 20px;
}

.jinriyongcherenshuClass {
    height: 59px;
    background: rgba(254, 254, 255, 0);
    box-shadow: 1px 0px 0px 0px rgba(25, 31, 36, 0.08),
        0px -1px 0px 0px rgba(25, 31, 36, 0.08);
}

.jinriyongcherenshuClass2 {
    height: 89px;
    background: rgba(254, 254, 255, 0);
    box-shadow: 1px 0px 0px 0px rgba(25, 31, 36, 0.08),
        0px -1px 0px 0px rgba(25, 31, 36, 0.08);
}
.jinriyongcherenshubiaotiClass {
    display: block;
    font-size: 1em;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(25, 31, 36, 0.64);
    line-height: 29px;
    margin-left: 1em;
}
.jinriyongcherenshubiaotiClass2 {
    display: block;
    font-size: 1em;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(25, 31, 36, 0.64);
    line-height: 44px;
    margin-left: 1em;
}
.jinriyongcherenshuneirongClass {
    display: block;
    font-size: 1.1em;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 500;
    color: #191f24;
    line-height: 29px;
    margin-left: 1em;
}
.jinriyongcherenshuneirongClass2 {
    display: block;
    font-size: 1.1em;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 500;
    color: #191f24;
    line-height: 44px;
    margin-left: 1em;
}
.jinribaomingshuClass {
    margin-top: 32px;
    height: 21px;
    font-size: 1em;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #191f24;
    line-height: 21px;
}
.jinribaomingrenshuValueClass {
    margin-top: 18px;
    height: 34px;
    font-size: 1.75em;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #191f24;
    line-height: 34px;
}

.wodedaibanClass {
    height: 20px;
    font-size: 15px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #191f24;
    line-height: 20px;
}
.wodedaibantishiwenziClass {
    height: 21px;
    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(25, 31, 36, 0.72);
    line-height: 21px;
}
.wushujuwenziClass {
    margin-top: 0.5em;
    height: 21px;
    font-size: 0.95em;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(25, 31, 36, 0.72);
    line-height: 21px;
}
.gengzaodeyichengClass {
    margin-left: 16px;
    height: 16px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(25, 31, 36, 0.48);
    line-height: 16px;
}
.zuoribaomingshuClass {
    display: none;
    margin-top: 31px;
    height: 16px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(25, 31, 36, 0.64);
    line-height: 16px;
}

.leftTopRightBiaoti {
    height: 21px;
    font-size: 1em;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #191f24;
    line-height: 1em;
    padding-top: 8px;
    margin-left: 8px;
}
.leftTopRightNeirong {
    height: 28px;
    font-size: 1.4em;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ea340f;
    line-height: 1.4em;
    padding-top: 4px;
    margin-left: 16px;
}
.tongjiyoubianClass {
    padding-right: 0.2em;
    padding-top: 1.5em;
    padding-bottom: 1.5em;
    padding-left: 0.2em;
    width: 22%;
    float: left;
}
</style>
<style>
.shangxiajiantou {
    height: 176px;width: 43px;float: right;background-color:white;border-radius: 4px;
}

.el-link.el-link--default.is-disabled {
    background: #d8d8d8;
}
.confereMain .el-tree-node__expand-icon {
    display: none;
}
.confereMain .el-carousel__indicators {
    display: none;
}
.el-progress--circle .el-progress__text,
.el-progress--dashboard .el-progress__text {
    margin-top: -5px;

    font-size: 1em;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ff8200;
    line-height: 21px;
}
@media screen and (min-width: 1600px) {
    .confereMain {
        font-size: 14px;
    }
}
</style>
