<template>

    <el-form ref="form" :inline="true" :model="form">
        <el-form-item label="返程时间" prop="returnDoubleTime">
            <el-date-picker
                v-model="form.returnDoubleTime"
                type="datetimerange"
                range-separator="-"
                :default-time="configDefaultTime"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width:300px;"
            />
        </el-form-item>
        <el-form-item label="出发地点" prop="returnStationLike">
            <el-input v-model.trim="form.returnStationLike" size="small" style="width: 120px" />
        </el-form-item>

        <el-form-item label="分配状态" prop="taskResult">
            <el-select v-model="form.taskResult" placeholder="默认未分配" clearable style="width:120px">
                <el-option v-for="item in taskResultOptions" :key="item.id" :label="item.value" :value="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="tagIdsIn">
            <el-select v-model="form.tagIdsIn" placeholder="全部" clearable style="width:120px">
                <el-option v-for="item in tagOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item style="float: right;">
            <i class="el-icon-arrow-down" style="margin-right:10px" @click="showMore" />
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
        <br v-show="showMoreFlag">

        <el-form-item v-show="showMoreFlag" label="姓名" prop="attendeeNameLike">
            <el-input v-model.trim="form.attendeeNameLike" size="small" style="width: 100px" />
        </el-form-item>
        <el-form-item v-show="showMoreFlag" label="手机" prop="phoneLike">
            <el-input v-model.trim="form.phoneLike" size="small" style="width: 100px" />
        </el-form-item>

        <el-form-item v-show="showMoreFlag" label="单位名称" prop="allOrganizationNameLike">
            <el-input v-model.trim="form.allOrganizationNameLike" size="small" style="width: 100px" />
        </el-form-item>

        <el-form-item v-show="showMoreFlag" label="班次/车次" prop="returnFlightLike">
            <el-input v-model.trim="form.returnFlightLike" size="small" style="width: 100px" />
        </el-form-item>
        <el-form-item v-show="showMoreFlag" label="人员类别" prop="attendeeRoleFlagEqual">
            <el-select v-model="attendeeRoleFlagEqual" placeholder="全部" collapse-tags multiple style="width:150px">
                <el-option v-for="item in attendeeRoleOptions" :key="item.id" :label="item.value" :value="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item v-show="showMoreFlag" label="职务" prop="positionLike">
            <el-input v-model.trim="form.positionLike" size="small" style="width: 100px" />
        </el-form-item>
        <el-form-item v-show="showMoreFlag" :label="getConferenceTemplate(2) + '类型'" prop="honourFlag">
            <el-select v-model="form.honourFlag" placeholder="全部" clearable style="width:80px">
                <el-option v-for="item in attendeeTypeOptions" :key="item.id" :label="item.value" :value="item.id" />
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
                style="width:210px"
            />
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
        <el-form-item v-show="showMoreFlag" label="分组" prop="groupIdsIn">
            <el-select v-model="groupIdsIn" placeholder="全部" collapse-tags multiple style="width:140px">
                <el-option v-for="item in groupOptions" :key="item.id" :label="item.name" :value="item.id" />
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

    },
    data() {
        return {
            groupIdsIn: [],
            form: {
                conferenceId: getConferenceId(),
                taskResult: 101,
                attendeeNameLike: '',
                phoneLike: '',
                positionLike: '',
                allOrganizationNameLike: '',
                positionLevel: '',
                tagIdsIn: '',
                honourFlag: '',
                honourNameLike: '',
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
                returnStartTime: '', //
                returnEndTime: '',
                returnFlightLike: '',
                returnStationLike: '',
                bookDinnerFlag: '',
                bookTicketFlag: '',
                cardStatus: '',
                cardId: '',
                oneself: '',
                attendeeRoleFlagEqual: ''

            },
            positionLevelOptions: [],
            tagOptions: [],
            groupOptions: [],
            yiChengOptions: [],
            agendaId: [],
            cardStatusOptions: [],
            cardOptions: [],
            attendeeTypeOptions: [{ id: 0, value: '随员' }, { id: 1, value: '主宾' }],
            meetingStatusOptions: [{ id: 1, value: '待参会' }, { id: 2, value: '参会中' }, { id: 3, value: '离会外出' }, { id: 4, value: '提前离会' }, { id: 5, value: '完成参会' }],
            // 参会状态固定写死的
            pickUpFlagOptions: [{ id: 0, value: '否' }, { id: 1, value: '是' }],
            pickOutFlagOptions: [{ id: 0, value: '否' }, { id: 1, value: '是' }],
            showHonoruName: false,
            showMoreFlag: false,
            // 分配状态
            taskResultOptions: [{ id: '', value: '全部' }, { id: 101, value: '待分配' }, { id: 100, value: '已分配' }, { id: 110, value: '未分配' }],
            attendeeRoleFlagEqual: [0],
            attendeeRoleOptions: [{ id: 0, value: this.getConferenceTemplate(2) }, { id: 3, value: '嘉宾' }, { id: 4, value: '临时来宾' }, { id: 1, value: '会务组' }, { id: 2, value: '司机' }]

        }
    },
    watch: {

        'showMoreFlag': {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$emit('changeTableHeight', 303)
                } else {
                    this.$emit('changeTableHeight', 200)
                }
            }
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
            this.attendeeRoleFlagEqual.forEach(item => {
                this.form.attendeeRoleFlagEqual = this.form.attendeeRoleFlagEqual + ',' + item
            })
            this.form.groupIdsIn = this.groupIdsIn.join(',')
            var params = Object.assign({}, this.form)
            for (var key in params) {
                if (params[key] === '') {
                    delete params[key]
                }
            }

            // delete params['arriveDoubleTime'];
            delete params['returnDoubleTime']

            return params
        },
        showMore() {
            this.showMoreFlag = !this.showMoreFlag
        },
        onSubmit() {
            this.form.agendaIdsIn = ''
            this.agendaId.forEach(item => {
                this.form.agendaIdsIn = this.form.agendaIdsIn + ',' + item
            })
            this.form.attendeeRoleFlagEqual = ''
            this.attendeeRoleFlagEqual.forEach(item => {
                this.form.attendeeRoleFlagEqual = this.form.attendeeRoleFlagEqual + ',' + item
            })
            this.form.groupIdsIn = this.groupIdsIn.join(',')
            var params = Object.assign({}, this.form)
            for (var key in params) {
                if (params[key] === '') {
                    delete params[key]
                }
            }

            // delete params['arriveDoubleTime'];
            delete params['returnDoubleTime']
            this.$emit('onSubmit', params)
        },
        resetForm(form) {
            this.agendaId = []
            this.attendeeRoleFlagEqual = [0]
            this.groupIdsIn = []
            this.$refs[form].resetFields()
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
        }
    }
}
</script>
<style lang='scss' scoped >
</style>
