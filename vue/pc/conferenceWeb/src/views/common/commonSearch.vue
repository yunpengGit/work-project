<template>

    <el-form ref="form" :inline="true" :model="form">
        <div class="inquire_form">
        <div class="form_left">
        <el-form-item label="姓名" prop="attendeeNameLike">
            <el-input v-model.trim="form.attendeeNameLike" size="small" style="width: 120px" />
        </el-form-item>
        <el-form-item label="手机" prop="phoneLike">
            <el-input v-model.trim="form.phoneLike" size="small" style="width: 120px" />
        </el-form-item>

        <el-form-item label="单位名称" prop="organizationNameLike">
            <el-input v-model.trim="form.organizationNameLike" size="small" style="width: 120px" />
        </el-form-item>
        <el-form-item label="标签" prop="tagIdsIn">
            <el-select v-model="form.tagIdsIn" placeholder="全部" clearable style="width:100px">
                <el-option v-for="item in tagOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
        </el-form-item>

        <el-form-item
            v-show="hotelFlag || cardFlag || showArriveAndReturn || showDinnerFlag"
            label="分配状态"
            prop="taskResult"
        >
            <el-select v-model="form.taskResult" placeholder="默认未分配" clearable style="width:120px">
                <el-option v-for="item in taskResultOptions" :key="item.id" :label="item.value" :value="item.id" />
            </el-select>
        </el-form-item>
        </div>
        <el-form-item class="form_operation">
            <i class="el-icon-arrow-down" style="margin-right:10px" @click="showMore" />
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
        </div>
        <br v-show="showMoreFlag">

        <el-form-item
            v-show="hotelFlag && showMoreFlag || cardFlag && showMoreFlag || showArriveAndReturn && showMoreFlag || showDinnerFlag && showMoreFlag"
            label="人员类别"
            prop="attendeeRoleFlagEqual"
        >
            <el-select v-model="attendeeRoleFlagEqual" placeholder="全部" collapse-tags multiple style="width:150px">
                <el-option v-for="item in attendeeRoleOptions" :key="item.id" :label="item.value" :value="item.id" />
            </el-select>
        </el-form-item>

        <el-form-item v-show="showMoreFlag" label="职务" prop="positionLike">
            <el-input v-model.trim="form.positionLike" size="small" style="width: 90px" />
        </el-form-item>
        <el-form-item v-show="showMoreFlag" :label="getConferenceTemplate(2) + '类型'" prop="honourFlag">
            <el-select v-model="form.honourFlag" placeholder="全部" clearable style="width:80px">
                <el-option v-for="item in attendeeTypeOptions" :key="item.id" :label="item.value" :value="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item v-show="showHonoruName && showMoreFlag" label="主宾" prop="honourNameLike">
            <el-input v-model.trim="form.honourNameLike" size="small" style="width: 80px" />
        </el-form-item>
        <el-form-item v-show="showMoreFlag" label="参会状态" prop="meetingStatus">
            <el-select v-model="form.meetingStatus" placeholder="全部" clearable style="width:100px">
                <el-option v-for="item in meetingStatusOptions" :key="item.id" :label="item.value" :value="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item v-show="showMoreFlag" :label="getConferenceTemplate(1) + '议程'" prop="agendaIdsIn">
            <el-cascader
                v-model="agendaId"
                :options="yiChengOptions"
                :props="{ multiple: true, value: 'id',
                          label: 'name', children: 'children',checkStrictly: true,emitPath:false}"
                clearable
                collapse-tags
                style="width:160px"
            />
        </el-form-item>
        <el-form-item v-show="showMoreFlag && hotelFlag " label="是否住宿" prop="bookStayFlag">
            <el-select v-model="form.bookStayFlag" placeholder="全部" clearable style="width:80px">
                <el-option v-for="item in pickUpFlagOptions" :key="item.id" :label="item.value" :value="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item v-show="showMoreFlag" label="分组" prop="groupIdsIn">

            <el-select v-model="groupIdsIn" placeholder="全部" collapse-tags multiple style="width:140px">
                <el-option v-for="item in groupOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item v-show="showMoreFlag" label="职级" prop="positionLevel">
            <el-select v-model="form.positionLevel" placeholder="全部" clearable style="width:100px">
                <el-option
                    v-for="item in positionLevelOptions"
                    :key="item.valCode"
                    :label="item.valName"
                    :value="item.valCode"
                />
            </el-select>
        </el-form-item>
        <!-- <br v-show="showMoreFlag && showArriveAndReturn || showMoreFlag && cardFlag || showMoreFlag && cardInfoFlag"> -->
        <el-form-item v-show="showMoreFlag && showArriveAndReturn" label="是否接站" prop="pickUpFlag">
            <el-select v-model="form.pickUpFlag" placeholder="全部" clearable style="width:100px">
                <el-option v-for="item in pickUpFlagOptions" :key="item.id" :label="item.value" :value="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item
            v-show="showMoreFlag && showArriveAndReturn || showMoreFlag && cardFlag"
            label="到达时间"
            prop="arriveDoubleTime"
        >
            <el-date-picker
                v-model="form.arriveDoubleTime"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                size="small"
                style="width:295px"
                :default-time="configDefaultTime"
            />
        </el-form-item>

        <el-form-item v-show="showMoreFlag && showArriveAndReturn" label="到达班次/车次" prop="arriveFlightLike">
            <el-input v-model.trim="form.arriveFlightLike" size="small" style="width: 120px" />
        </el-form-item>

        <el-form-item v-show="showMoreFlag && showArriveAndReturn" label="到达地点" prop="arriveStationLike">
            <el-input v-model.trim="form.arriveStationLike" size="small" style="width: 120px" />
        </el-form-item>
        <br v-show="showMoreFlag && showArriveAndReturn">
        <el-form-item v-show="showMoreFlag && showArriveAndReturn" label="是否送站" prop="pickOutFlag">
            <el-select v-model="form.pickOutFlag" placeholder="全部" clearable style="width:100px">
                <el-option v-for="item in pickOutFlagOptions" :key="item.id" :label="item.value" :value="item.id" />
            </el-select>
        </el-form-item>

        <el-form-item
            v-show="showMoreFlag && showArriveAndReturn || showMoreFlag && cardFlag"
            label="返程时间"
            prop="returnDoubleTime"
        >
            <el-date-picker
                v-model="form.returnDoubleTime"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :default-time="configDefaultTime"
                placeholder="选择时间范围"
                size="small"
                style="width:295px"
            />
        </el-form-item>

        <el-form-item v-show="showMoreFlag && showArriveAndReturn" label="返回航班/车次/游轮" prop="returnFlightLike">
            <el-input v-model.trim="form.returnFlightLike" size="small" style="width: 120px" />
        </el-form-item>

        <el-form-item v-show="showMoreFlag && showArriveAndReturn" label="返程地点" prop="returnStationLike">
            <el-input v-model.trim="form.returnStationLike" size="small" style="width: 120px" />
        </el-form-item>
        <!-- <br v-show="showMoreFlag && showDinnerFlag "> -->
        <el-form-item v-show="showMoreFlag && showDinnerFlag" label="是否用餐" prop="bookDinnerFlag">
            <el-select v-model="form.bookDinnerFlag" placeholder="全部" clearable style="width:100px">
                <el-option v-for="item in pickUpFlagOptions" :key="item.id" :label="item.value" :value="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item v-show="showMoreFlag && cardFlag" label="是否制证" prop="bookTicketFlag">
            <el-select v-model="form.bookTicketFlag" placeholder="全部" clearable style="width:100px">
                <el-option v-for="item in pickUpFlagOptions" :key="item.id" :label="item.value" :value="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item v-show="showMoreFlag && cardInfoFlag" label="证件名称" prop="cardId">
            <el-select v-model="form.cardId" placeholder="全部" clearable filterable style="width:140px">
                <el-option v-for="item in cardOptions" :key="item.id" :label="item.cardName" :value="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item v-show="showMoreFlag && cardInfoFlag" label="证件状态" prop="cardStatus">
            <el-select v-model="form.cardStatus" placeholder="全部" clearable style="width:100px">
                <el-option
                    v-for="item in cardStatusOptions"
                    :key="item.enumKey"
                    :label="item.enumValue"
                    :value="item.enumKey"
                />
            </el-select>
        </el-form-item>

        <!-- -住宿--- -->
        <el-form-item
            v-show="showMoreFlag && hotelFlag || showMoreFlag && hotelInfoFlag "
            label="到达时间"
            prop="arriveDoubleTime"
        >
            <el-date-picker
                v-model="form.arriveDoubleTime"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :default-time="configDefaultTime"
                placeholder="选择时间范围"
                size="small"
                style="width:295px"
            />
        </el-form-item>

        <el-form-item
            v-show="showMoreFlag && hotelFlag || showMoreFlag && hotelInfoFlag "
            label="返程时间"
            prop="returnDoubleTime"
        >
            <el-date-picker
                v-model="form.returnDoubleTime"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :default-time="configDefaultTime"
                placeholder="选择时间范围"
                size="small"
                style="width:295px"
            />
        </el-form-item>

        <el-form-item v-show="showMoreFlag && hotelInfoFlag " label="是否单住" prop="oneself">
            <el-select v-model="form.oneself" placeholder="全部" clearable style="width:100px">
                <el-option v-for="item in pickUpFlagOptions" :key="item.id" :label="item.value" :value="item.id" />
            </el-select>
        </el-form-item>
    </el-form>

</template>
<script>

import { getConferenceId } from '@/utils/conference-auth'
import { getYiChengList, getGroupList } from '@/api/car'
import { getDicList } from '@/api/common'
import { getList } from '@/api/attendeeTag'
import { getCardStatusOptions, getCardList } from '@/api/card'

export default {
    name: 'CommonSearch',
    components: {},
    props: {
        // 若传入showArriveAndReturn为true表示显示用车相关往返信息
        showArriveAndReturn: {
            type: Boolean,
            default: false
        },
        // 若传入showDinnerFlag为true表示显示是否用餐选择框
        showDinnerFlag: {
            type: Boolean,
            default: false
        },
        // 无tab页下加入showDinnerFlag后的表格高度调整用dinnerInfoHeightFlag为true
        dinnerInfoHeightFlag: {
            type: Boolean,
            default: false
        },
        // 若 card待办中所需要显示的字段，传入cardFlag为true
        cardFlag: {
            type: Boolean,
            default: false
        },
        // 若 card证件分配查询中所需要显示的字段，传入cardInfoFlag为true
        cardInfoFlag: {
            type: Boolean,
            default: false
        },
        hotelFlag: {
            type: Boolean,
            default: false
        },
        hotelInfoFlag: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            groupIdsIn: [],
            form: {
                conferenceId: getConferenceId(),
                attendeeNameLike: '',
                phoneLike: '',
                positionLike: '',
                organizationNameLike: '',
                positionLevel: '',
                tagIdsIn: '',
                honourFlag: '',
                honourNameLike: '',
                attendeeRoleFlagEqual: '',
                agendaIdsIn: '',
                groupIdsIn: '',
                meetingStatus: '',
                pickUpFlag: '',
                pickOutFlag: '',
                arriveDoubleTime: '',
                returnDoubleTime: '',
                arriveStartTime: '',
                arriveEndTime: '',
                arriveFlightLike: '',
                arriveStationLike: '',
                returnStartTime: '',
                returnEndTime: '',
                returnFlightLike: '',
                returnStationLike: '',
                bookDinnerFlag: '',
                bookTicketFlag: '',
                cardStatus: '',
                cardId: '',
                oneself: '',
                taskResult: 101

            },
            positionLevelOptions: [],
            attendeeRoleFlagEqual: [0],
            attendeeRoleOptions: [{ id: 0, value: '' + this.getConferenceTemplate(2) + '' }, { id: 3, value: '嘉宾' }, { id: 4, value: '临时来宾' }, { id: 1, value: '会务组' }, { id: 2, value: '司机' }],
            tagOptions: [],
            groupOptions: [],
            yiChengOptions: [],
            agendaId: [],
            cardStatusOptions: [],
            cardOptions: [],
            attendeeTypeOptions: [{ id: 0, value: '随员' }, { id: 1, value: '主宾' }],
            // meetingStatusOptions: [{ id: 1, value: '待参会' }, { id: 2, value: '参会中' }, { id: 3, value: '离会外出' }, { id: 4, value: '提前离会' }, { id: 5, value: '完成参会' }],
            meetingStatusOptions: [{ id: 1, value: '未报到' }, { id: 2, value: '已报到' }, { id: 3, value: '离会外出' }, { id: 4, value: '提前离会' }, { id: 5, value: '参会结束' }],
            // 参会状态固定写死的
            pickUpFlagOptions: [{ id: 0, value: '否' }, { id: 1, value: '是' }],
            pickOutFlagOptions: [{ id: 0, value: '否' }, { id: 1, value: '是' }],
            showHonoruName: false,
            showMoreFlag: false,

            // 分配状态
            taskResultOptions: [{ id: '', value: '全部' }, { id: 101, value: '待分配' }, { id: 100, value: '已分配' }, { id: 110, value: '未分配' }]

        }
    },
    watch: {
        'form.honourFlag': {
            handler(newVal, oldVal) {
                if (newVal === 0 && this.showMoreFlag) {
                    this.showHonoruName = true
                } else {
                    this.showHonoruName = false
                    if (newVal === 1) {
                        this.form.honourNameLike = ''
                    }
                }
            },
            deep: true,
            immediate: true
        },
        'showMoreFlag': {
            handler(newVal, oldVal) {
                if (newVal) {
                    if (this.hotelFlag) {
                        this.$emit('changeTableHeight', 263)
                        return
                    }
                    if (this.showDinnerFlag) {
                        this.$emit('changeTableHeight', 263)
                        return
                    }

                    if (this.showArriveAndReturn) {
                        this.$emit('changeTableHeight', 355)
                    } else {
                        if (this.cardFlag) {
                            this.$emit('changeTableHeight', 263)
                            return
                        }
                        if (this.showDinnerFlag || this.cardFlag || this.cardInfoFlag) {
                            if (this.dinnerInfoHeightFlag) {
                                this.$emit('changeTableHeight', 263)
                            } else {
                                this.$emit('changeTableHeight', 303)
                            }
                        } else {
                            this.$emit('changeTableHeight', 212)
                        }
                    }
                } else {
                    if (this.hotelFlag) {
                        this.$emit('changeTableHeight', 160)
                        return
                    }
                    if (this.showDinnerFlag) {
                        this.$emit('changeTableHeight', 160)
                        return
                    }
                    if (this.showArriveAndReturn) {
                        this.$emit('changeTableHeight', 200)
                    } else {
                        if (this.cardFlag) {
                            this.$emit('changeTableHeight', 160)
                            return
                        }
                        if (this.showDinnerFlag || this.cardFlag || this.cardInfoFlag) {
                            if (this.dinnerInfoHeightFlag) {
                                this.$emit('changeTableHeight', 160)
                            } else {
                                this.$emit('changeTableHeight', 200)
                            }
                        } else {
                            this.$emit('changeTableHeight', 160)
                        }
                    }
                }
            }
        },
        'form.arriveDoubleTime': {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.form.arriveStartTime = newVal[0]
                    this.form.arriveEndTime = newVal[1]
                } else {
                    this.form.arriveStartTime = ''
                    this.form.arriveEndTime = ''
                }
            },
            deep: true,
            immediate: true
        },
        'form.returnDoubleTime': {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.form.returnStartTime = newVal[0]
                    this.form.returnEndTime = newVal[1]
                } else {
                    this.form.returnStartTime = ''
                    this.form.returnEndTime = ''
                }
            },
            deep: true,
            immediate: true
        }

    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() { },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.getGroupOptions()
        this.getYiChengOptions()
        this.getTagList()
        this.getPositionLevelOptions()
        if (this.cardInfoFlag) {
            this.getCardOptions()
            this.getCardStatusOptions()
        }
    },
    // 这里存放数据
    beforeCreate() { },
    // 生命周期 - 挂载之前
    beforeMount() { },
    // 生命周期 - 更新之前
    beforeUpdate() { },
    // 生命周期 - 更新之后
    updated() { },
    // 生命周期 - 销毁之前
    beforeDestroy() { },
    // 生命周期 - 销毁完成
    destroyed() { },
    // 如果页面有keep-alive缓存功能，这个函数会触发
    activated() { },
    methods: {
        getSearchData() {
            this.form.agendaIdsIn = ''
            this.agendaId.forEach(item => {
                this.form.agendaIdsIn = this.form.agendaIdsIn + ',' + item
            })
            this.form.attendeeRoleFlagEqual = ''

            if (this.hotelFlag || this.cardFlag || this.showArriveAndReturn || this.showDinnerFlag) {
                this.attendeeRoleFlagEqual.forEach(item => {
                    this.form.attendeeRoleFlagEqual = this.form.attendeeRoleFlagEqual + ',' + item
                })
            }
            this.form.groupIdsIn = this.groupIdsIn.join(',')
            var params = Object.assign({}, this.form)

            for (var key in params) {
                if (params[key] === '') {
                    delete params[key]
                }
            }
            delete params['arriveDoubleTime']
            delete params['returnDoubleTime']
            return params
        },
        getCardOptions() {
            getCardList({ 'conferenceId': getConferenceId(), 'cardType': 1 }).then(res => {
                if (res.success) {
                    this.cardOptions = res.result.list
                }
            })
        },
        getCardStatusOptions() {
            getCardStatusOptions().then(res => {
                if (res.success) {
                    this.cardStatusOptions = res.result.list
                }
            })
        },
        getGroupOptions() {
            getGroupList({ 'conferenceId': getConferenceId() }).then(res => {
                if (res.success) {
                    this.groupOptions = res.result.list
                }
            })
        },
        getYiChengOptions() {
            getYiChengList({ 'conferenceId': getConferenceId() }).then(res => {
                if (res.success) {
                    this.yiChengOptions = res.result
                }
            })
        },
        getPositionLevelOptions() {
            var data = { code: 'positionLevel' }
            getDicList(data).then(res => {
                if (res.success) {
                    this.positionLevelOptions = res.result
                }
            })
        },
        getTagList() {
            getList({ conferenceId: getConferenceId() }).then(res => {
                if (res.success) {
                    this.tagOptions = res.result.list
                }
            })
        },
        showMore() {
            this.showMoreFlag = !this.showMoreFlag
        },
        onSubmit() {
            // 对agendaId处理  对form.agendaIdsin赋值
            // this.form.agendaIdsIn = []
            // this.agendaId.forEach(item => {
            //     this.form.agendaIdsIn = this.form.agendaIdsIn.concat(item)
            // })
            // this.form.agendaIdsIn = [...new Set(this.form.agendaIdsIn)]
            this.form.agendaIdsIn = ''
            this.agendaId.forEach(item => {
                this.form.agendaIdsIn = this.form.agendaIdsIn + ',' + item
            })
            this.form.attendeeRoleFlagEqual = ''

            if (this.hotelFlag || this.cardFlag || this.showArriveAndReturn || this.showDinnerFlag) {
                this.attendeeRoleFlagEqual.forEach(item => {
                    this.form.attendeeRoleFlagEqual = this.form.attendeeRoleFlagEqual + ',' + item
                })
            }
            this.form.groupIdsIn = this.groupIdsIn.join(',')
            var params = Object.assign({}, this.form)

            for (var key in params) {
                if (params[key] === '') {
                    delete params[key]
                }
            }
            delete params['arriveDoubleTime']
            delete params['returnDoubleTime']
            this.$emit('onSubmit', params)
        },
        resetForm(form) {
            this.agendaId = []
            this.groupIdsIn = []
            this.$refs[form].resetFields()
        }
    }
}
</script>
<style lang='scss' scoped >
</style>
