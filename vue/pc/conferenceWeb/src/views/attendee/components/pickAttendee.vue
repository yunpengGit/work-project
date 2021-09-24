<template>
    <div class="">
        <el-drawer title="选择人员" :visible.sync="pickDialogVisible" :before-close="closeDialog" size="50%">
            <el-row :style="{'height': dialogHeight,'width':'100%','padding-left':'10px','padding-right':'10px'}">

                <el-col v-show="!(attendeeRoleFlagEqual !== null && attendeeRoleFlagEqual.length === 1 && attendeeRoleFlagEqual[0] === 0)" :span="20">
                    <el-radio-group v-model="radio">
                        <el-radio :label="0">{{ getConferenceTemplate(2) }}</el-radio>
                        <el-radio :label="3" style="margin-left:-5px">嘉宾</el-radio>
                        <el-radio :label="4" style="margin-left:-5px">临时来宾</el-radio>
                        <el-radio :label="1" style="margin-left:-5px">会务组</el-radio>
                        <el-radio :label="2" style="margin-left:-5px">司机</el-radio>
                        <!-- v-show="attendeeRoleFlagEqual !== null && attendeeRoleFlagEqual.indexOf(2) === -1" -->
                    </el-radio-group>
                    <div style="height:10px;width:100%" />
                </el-col>

                <el-col :span="20">
                    <el-input
                        v-model="pageInfo.nameOrPhoneLike"
                        style="width:50%"
                        placeholder="按姓名/手机号/单位查询"
                        class="input-with-select"
                    >
                        <el-button slot="append" icon="el-icon-search" @click="search" />
                    </el-input>
                </el-col>
                <el-col :span="10" :style="{'margin-top':'10px', 'height':leftOrRightHeight }">
                    <ul class="infinite-list ulClass">
                        <el-pagination
                            small
                            layout="prev, pager, next"
                            style="text-align:center;"
                            :total="pageInfo.total"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                        />
                        <li v-for="item in leftData" :key="item.id" class="infinite-list-item" style="width:95%">
                            {{ item.fixAttributeCommonVO.attendeeName }}
                            {{
                                formatOrgName(item.fixAttributeCommonVO.organizationSortName, item.fixAttributeCommonVO.organizationName, 8) !== null ? "-" + formatOrgName(item.fixAttributeCommonVO.organizationSortName, item.fixAttributeCommonVO.organizationName, 8) : ""
                            }}
                            <!-- item.fixAttributeCommonVO.organizationSortName !== null && item.fixAttributeCommonVO.organizationSortName !== '' ?
                                    (item.fixAttributeCommonVO.organizationSortName.length > 8 ? ('-' + item.fixAttributeCommonVO.organizationSortName.substr(0,7) + '...') : ('-' + item.fixAttributeCommonVO.organizationSortName)) :
                                    (item.fixAttributeCommonVO.organizationName !== null && item.fixAttributeCommonVO.organizationName != '' ?
                                        (item.fixAttributeCommonVO.organizationName.length > 8 ? ('-' + item.fixAttributeCommonVO.organizationName.substr(0,7) + '...') : ('-' + item.fixAttributeCommonVO.organizationName)) : '') -->
                            {{ item.fixAttributeCommonVO.position !== null && item.fixAttributeCommonVO.position.length > 8 ? ("(" + item.fixAttributeCommonVO.position.substr(0,7) + '...)') : (item.fixAttributeCommonVO.position !== null && item.fixAttributeCommonVO.position !== '' ? ('(' + item.fixAttributeCommonVO.position + ')') : '') }}
                            <el-checkbox
                                :value="leftSelectedIds.indexOf(item.id) !== -1"
                                style="float:right"
                                @change="leftChange(item.id)"
                            />
                        </li>
                    </ul>
                </el-col>
                <el-col
                    :span="4"
                    :style="{'margin-top':'10px', 'height':leftOrRightHeight, 'padding-left':'20px','padding-right':'20px' }"
                >
                    <div style="height:60%;margin-top:150px;">
                        <el-button
                            :disabled="rightSelectedIds.length === 0"
                            class="el-icon-arrow-left"
                            type="primary"
                            style="width:100%"
                            @click="removeAttendee"
                        />
                        <el-button
                            :disabled="leftSelectedIds.length === 0"
                            class="el-icon-arrow-right"
                            style="margin-top:10px;width:100%;margin-left:0"
                            type="primary"
                            @click="addAttendee"
                        />
                    </div>
                </el-col>
                <el-col :span="10" :style="{'margin-top':'10px', 'height':leftOrRightHeight }">
                    <ul class="infinite-list ulClass">
                        <li v-for="item in rightData" :key="item.id" class="infinite-list-item" style="width:95%">
                            {{ item.fixAttributeCommonVO.attendeeName }}
                            {{
                                formatOrgName(item.fixAttributeCommonVO.organizationSortName, item.fixAttributeCommonVO.organizationName, 8) !== null ? "-" + formatOrgName(item.fixAttributeCommonVO.organizationSortName, item.fixAttributeCommonVO.organizationName, 8) : ""
                            }}
                            {{ item.fixAttributeCommonVO.position !== null && item.fixAttributeCommonVO.position.length > 8 ? ("(" + item.fixAttributeCommonVO.position.substr(0,7) + '...)') : (item.fixAttributeCommonVO.position !== null && item.fixAttributeCommonVO.position !== '' ? ('(' + item.fixAttributeCommonVO.position + ')') : '') }}
                            <el-checkbox
                                style="float:right"
                                :value="rightSelectedIds.indexOf(item.id) !== -1"
                                @change="rightChange(item.id)"
                            />
                        </li>
                    </ul>
                </el-col>
            </el-row>
            <!-- <el-transfer
                v-model="value"
                filterable
                :filter-method="filterMethod"
                filter-placeholder="请输入"
                :data="data"
                :render-content="renderContent"
                :style="{'height': dialogHeight, 'margin-left': '40px'}"
                :props="{
                    key: 'id',
                    label: 'fixAttributeCommonVO.attendeeName'
                }"
            /> -->
            <div
                class="demo-drawer__footer"
                style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD"
            >
                <el-button style="height:32px;margin-top:12px" @click="closeDialog">取 消</el-button>
                <el-button type="primary" :loading="loading" style="height:32px;margin-top:12px" @click="insert">保存
                </el-button>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { getTableHeight } from '@/utils/index'
import { getList, getPredictColumn } from '@/api/attendee'
import { getConferenceId } from '@/utils/conference-auth'
import { getList as getTagList } from '@/api/attendeeTag'
export default {
    name: 'PickAttendee',
    props: {
        pickDialogVisible: {
            type: Boolean,
            default: false
        },
        attendeeRoleFlagEqual: {
            type: Array,
            default: () => {
                return [0]
            }
        },
        msgFlag: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            radio: 0,
            tagId: null,
            organizationName: null,
            position: null,
            tagList: [],
            positionList: [],
            organizationNameList: [],
            activeName: 'first',
            count: 5,
            loading: false,
            dialogHeight: getTableHeight(35) + 'px',
            leftOrRightHeight: getTableHeight(85) + 'px',
            leftData: [],
            leftSelectedIds: [],
            // leftSelectedData: [],
            rightSelectedIds: [],
            // rightSelectedData: [],
            rightData: [],
            pageInfo: {
                nameOrPhoneLike: null,
                pageNum: 1,
                pageSize: 20,
                resFlag: 2,
                signStatusEqual: [3],
                total: null
            }
        }
    },
    watch: {
        radio() {
            this.search()
        },
        activeName() {
            this.tagId = null
            this.organizationName = null
            this.position = null
        },
        tagId() {
            this.getList()
        },
        organizationName() {
            this.getList()
        },
        position() {
            this.getList()
        },
        pickDialogVisible(val) {
            if (val) {
                if (!(this.attendeeRoleFlagEqual !== null && this.attendeeRoleFlagEqual.length === 1 && this.attendeeRoleFlagEqual[0] === 0)) {
                    this.leftOrRightHeight = getTableHeight(125) + 'px'
                } else {
                    this.leftOrRightHeight = getTableHeight(85) + 'px'
                }
                this.getList()
                this.pageInfo.nameOrPhoneLike = ''
                this.leftSelectedIds = []
                this.rightSelectedIds = []
                this.rightData = []
                this.leftData = []
                this.getTagList()
                this.getOrganizationNameList()
                this.getPositionList()
                this.tagId = null
                this.organizationName = null
                this.position = null
            }
        }
    },
    methods: {
        handleCurrentChange(val) {
            this.pageInfo.pageNum = val
            this.getList()
        },
        handleSizeChange(val) {
            this.pageInfo.pageSize = val
            this.getList()
        },
        xuanzedanwei(val) {
            this.organizationName = val
        },
        xuanzezhiwu(val) {
            this.position = val
        },
        search() {
            this.tagId = null
            this.organizationName = null
            this.position = null
            this.getList()
        },
        getOrganizationNameList() {
            getPredictColumn({ 'conferenceId': getConferenceId(), 'column': 'organizationName' }).then(res => {
                this.organizationNameList = res.result
            })
        },
        getPositionList() {
            getPredictColumn({ 'conferenceId': getConferenceId(), 'column': 'position' }).then(res => {
                this.positionList = res.result
            })
        },
        xuanzebiaoqian(val) {
            this.tagId = val
        },
        getTagList() {
            getTagList({ 'conferenceId': getConferenceId() }).then(res => {
                this.tagList = res.result.list
            })
        },
        leftChange(id) {
            if (this.leftSelectedIds.indexOf(id) === -1) {
                this.leftSelectedIds.push(id)
            } else {
                // alert(this.leftSelectedIds.indexOf(id))
                this.leftSelectedIds.splice(this.leftSelectedIds.indexOf(id), 1)
            }
        },
        addAttendee() {
            var arrayTemp = []
            this.leftData.forEach((item, index) => {
                if (this.leftSelectedIds.indexOf(item.id) !== -1) {
                    // this.leftData.splice(index, 1)
                    this.rightData.push(item)
                } else {
                    arrayTemp.push(item)
                }
            })
            this.leftData = arrayTemp
            this.leftSelectedIds = []
        },
        rightChange(id) {
            if (this.rightSelectedIds.indexOf(id) === -1) {
                this.rightSelectedIds.push(id)
            } else {
                this.rightSelectedIds.splice(this.rightSelectedIds.indexOf(id), 1)
            }
        },
        removeAttendee() {
            var arrayTemp = []
            this.rightData.forEach((item, index) => {
                if (this.rightSelectedIds.indexOf(item.id) !== -1) {
                    // this.rightData.splice(index, 1)
                    this.leftData.push(item)
                } else {
                    arrayTemp.push(item)
                }
            })
            this.rightData = arrayTemp
            this.rightSelectedIds = []
        },
        getList() {
            if (this.activeName === 'first') {
                this.organizationName = null
                this.position = null
            } else if (this.activeName === 'second') {
                this.tagId = null
                this.position = null
            } else if (this.activeName === 'third') {
                this.tagId = null
                this.organizationName = null
            } else {
                this.tagId = null
                this.organizationName = null
                this.position = null
            }

            this.pageInfo.tagIdsIn = this.tagId
            this.pageInfo.organizationName = this.organizationName
            this.pageInfo.position = this.position

            this.pageInfo.conferenceId = getConferenceId()
            // this.pageInfo.attendeeRoleFlagEqual = this.attendeeRoleFlagEqual// yurc
            this.pageInfo.attendeeRoleFlagEqual = [this.radio]
            this.leftSelectedIds = []
            this.rightSelectedIds = []
            var arrayTemp = []
            getList(this.pageInfo).then(res => {
                this.leftData = res.result.list
                this.pageInfo.total = res.result.total
                this.leftData.forEach((item, index) => {
                    var count = 0
                    this.rightData.forEach(item1 => {
                        if (item.id === item1.id) {
                            count++
                        }
                    })
                    if (count === 0) {
                        arrayTemp.push(item)
                    }
                })
                this.leftData = arrayTemp
            })
        },
        closeDialog() {
            this.$emit('closeDialog', null)
        },
        insert() {
            if (this.rightData === null || this.rightData.length === 0) {
                this.$message('未添加' + this.getConferenceTemplate(2) + '')
            } else {
                if (this.msgFlag === 1) {
                    var rightDataIds1 = []
                    this.rightData.forEach(item => {
                        rightDataIds1.push(item)
                    })
                    this.$emit('closeDialog', rightDataIds1)
                } else {
                    var rightDataIds = []
                    this.rightData.forEach(item => {
                        rightDataIds.push(item.id)
                    })
                    this.$emit('closeDialog', rightDataIds)
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.ulClass {
    overflow: auto;
    width: 100%;
    height: 100%;
    border: solid 1px rgba(25, 31, 36, 0.08);
    border-radius: 10px;
    padding: 10px;
    line-height: 25px;
}
.activeLi {
    background-color: #ecf5ff;
}
</style>
