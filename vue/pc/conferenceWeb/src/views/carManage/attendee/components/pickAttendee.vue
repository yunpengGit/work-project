<template>
    <div class="">
        <el-drawer title="选择人员" :visible.sync="pickDialogVisible" :before-close="closeDialog" size="40%">
            <el-row :style="{'height': dialogHeight,'width':'100%','padding-left':'10px','padding-right':'10px'}">
                <el-col :span="24">
                    <el-input v-model="searchValue" style="width:50%" placeholder="请输入姓名或手机号" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="getList" />
                    </el-input>
                </el-col>
                <el-col :span="10" :style="{'margin-top':'10px', 'height':leftOrRightHeight }">
                    <ul class="infinite-list ulClass">
                        <li v-for="item in leftData" :key="item.id" class="infinite-list-item" style="width:95%">
                            {{ item.fixAttributeCommonVO.attendeeName }}
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
                    <div style="height:100%;margin-top:150px;">
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
                <el-button type="primary" :loading="loading" style="height:32px;margin-top:12px" @click="insert">保存
                </el-button>
                <el-button style="height:32px;margin-top:12px" @click="closeDialog">取消</el-button>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { getTableHeight } from '@/utils/index'
import { getList } from '@/api/attendee'
import { getConferenceId } from '@/utils/conference-auth'
export default {
    name: 'PickAttendee',
    props: {
        pickDialogVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            count: 5,
            searchValue: '',
            loading: false,
            dialogHeight: getTableHeight(35) + 'px',
            leftOrRightHeight: getTableHeight(85) + 'px',
            leftData: [],
            leftSelectedIds: [],
            // leftSelectedData: [],
            rightSelectedIds: [],
            // rightSelectedData: [],
            rightData: []
        }
    },
    watch: {
        pickDialogVisible(val) {
            if (val) {
                // this.getList()
                this.searchValue = ''
                this.leftSelectedIds = []
                this.rightSelectedIds = []
                this.rightData = []
                this.leftData = []
            }
        }
    },
    methods: {
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
            this.leftSelectedIds = []
            this.rightSelectedIds = []
            var arrayTemp = []
            getList({ 'conferenceId': getConferenceId(), 'nameOrPhoneLike': this.searchValue, 'signStatusEqual': [3], 'attendeeRoleFlagEqual': [0, 1, 2, 3, 4] }).then(res => {
                this.leftData = res.result.list
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
                this.$message('未添加' + this.getConferenceTemplate(2))
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
</style>
