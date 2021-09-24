<template>
    <div v-if="dialogVisible">
        <el-dialog ref="dialog" :visible.sync="dialogVisible" width="90%" top="10px" :show-close="false">
            <div slot="title" style="padding:10px;">
                <div class="title">正在为以下人员分配用车</div>
                <div class="scrollbar" v-if="flag==='pickUp'">
                    <div v-for="item in attendeeList" :key="item.attendeeId" class="attendee-item">
                        <span class="attendee-name">{{ item.attendee.fixAttributeCommonVO.attendeeName }}</span><span
                            v-if="item.attendee.fixAttributeCommonVO.arriveFlight">乘坐{{ item.attendee.fixAttributeCommonVO.arriveFlight }}</span><span
                            v-if="item.attendee.fixAttributeCommonVO.arriveTime && item.attendee.fixAttributeCommonVO.arriveStation">于{{ item.attendee.fixAttributeCommonVO.arriveTime.slice(0,16) }}</span><span
                            v-if="item.attendee.fixAttributeCommonVO.arriveTime && !item.attendee.fixAttributeCommonVO.arriveStation">于{{ item.attendee.fixAttributeCommonVO.arriveTime.slice(0,16) }}到达</span><span
                            v-if="item.attendee.fixAttributeCommonVO.arriveStation">到达{{ item.attendee.fixAttributeCommonVO.arriveStation }}</span><br/>
                        <span class="attendee-name">基本信息：</span>单位：{{ item.attendee.fixAttributeCommonVO.organizationSortName ? item.attendee.fixAttributeCommonVO.organizationSortName: item.attendee.fixAttributeCommonVO.organizationName }}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;职位：{{ item.attendee.fixAttributeCommonVO.position }}<span v-if="item.attendee.roomTaskList && item.attendee.roomTaskList.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;入住酒店：<span v-for="(item,index) in item.attendee.roomTaskList" :key="index">{{item.roomFormVO.hotelVO.name}}</span></span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;联系方式：{{ formatPhone(item.attendee.fixAttributeCommonVO.phone) }}
                        <div v-if="item.attendeeTask && item.attendeeTask.changeContent && item.attendee.vehicleTaskList && item.attendee.vehicleTaskList.length">
                            <!-- 首次分配不显示变更信息 -->
                            <span class="attendee-name">变更信息：</span>
                            <div style="margin-top: -20px;margin-left: 100px;">
                                <div v-for="itemSub in formatLogContent(item.attendeeTask.changeContent)"
                                :key="itemSub.code" >
                                <div v-show="itemSub.code !== 'photoUrl' && itemSub.code !== 'agenda'">
                                    <span style="font-weight:700;">·</span> {{ itemSub.attribute }}变更，
                                    由“{{ itemSub.beforeValue !== null && itemSub.beforeValue !== '' ? itemSub.beforeValue : '无' }}”
                                    变更为“{{ itemSub.afterValue !== null && itemSub.afterValue !== '' ? itemSub.afterValue : '无' }}”
                                </div>
                                <div v-show="itemSub.code === 'photoUrl'">
                                    <span style="font-weight:700;">·</span> {{ itemSub.attribute }}有变更
                                    <el-link :underline="false" type="info"
                                        :href="imagePath + (itemSub.afterValue !== null && itemSub.afterValue !== '' ? itemSub.afterValue : defaultPhoto)">
                                        详情</el-link>
                                </div>
                                <div v-if="itemSub.code === 'agenda'">
                                    <span style="font-weight:700;">·</span> {{ formatAgenda(itemSub.beforeValue, itemSub.afterValue) }}
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                <div class="scrollbar" v-if="flag==='pickOut'">
                    <div v-for="item in attendeeList" :key="item.attendeeId" class="attendee-item">
                        <span class="attendee-name">{{ item.attendee.fixAttributeCommonVO.attendeeName }}</span><span
                            v-if="item.attendee.fixAttributeCommonVO.arriveFlight">乘坐{{ item.attendee.fixAttributeCommonVO.arriveFlight }}</span><span
                            v-if="item.attendee.fixAttributeCommonVO.arriveTime && item.attendee.fixAttributeCommonVO.arriveStation">于{{ item.attendee.fixAttributeCommonVO.arriveTime.slice(0,16) }}</span><span
                            v-if="item.attendee.fixAttributeCommonVO.arriveTime && !item.attendee.fixAttributeCommonVO.arriveStation">于{{ item.attendee.fixAttributeCommonVO.arriveTime.slice(0,16) }}到达</span><span
                            v-if="item.attendee.fixAttributeCommonVO.arriveStation">到达{{ item.attendee.fixAttributeCommonVO.arriveStation }}</span><br/>
                        <span class="attendee-name">基本信息：</span>单位：{{ item.attendee.fixAttributeCommonVO.organizationSortName ? item.attendee.fixAttributeCommonVO.organizationSortName: item.attendee.fixAttributeCommonVO.organizationName }}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;职位：{{ item.attendee.fixAttributeCommonVO.position }}<span v-if="item.attendee.roomTaskList && item.attendee.roomTaskList.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;入住酒店：<span v-for="(item,index) in item.attendee.roomTaskList" :key="index">{{item.roomFormVO.hotelVO.name}}</span></span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;联系方式：{{ formatPhone(item.attendee.fixAttributeCommonVO.phone) }}
                        <div v-if="item.attendeeTask && item.attendeeTask.changeContent && item.attendee.vehicleTaskList && item.attendee.vehicleTaskList.length">
                            <!-- 首次分配不显示变更信息 -->
                            <span class="attendee-name">变更信息：</span>
                            <div style="margin-top: -20px;margin-left: 100px;">
                                <div v-for="itemSub in formatLogContent(item.attendeeTask.changeContent)"
                                :key="itemSub.code" >
                                <div v-show="itemSub.code !== 'photoUrl' && itemSub.code !== 'agenda'">
                                    <span style="font-weight:700;">·</span> {{ itemSub.attribute }}变更，
                                    由“{{ itemSub.beforeValue !== null && itemSub.beforeValue !== '' ? itemSub.beforeValue : '无' }}”
                                    变更为“{{ itemSub.afterValue !== null && itemSub.afterValue !== '' ? itemSub.afterValue : '无' }}”
                                </div>
                                <div v-show="itemSub.code === 'photoUrl'">
                                    <span style="font-weight:700;">·</span> {{ itemSub.attribute }}有变更
                                    <el-link :underline="false" type="info"
                                        :href="imagePath + (itemSub.afterValue !== null && itemSub.afterValue !== '' ? itemSub.afterValue : defaultPhoto)">
                                        详情</el-link>
                                </div>
                                <div v-if="itemSub.code === 'agenda'">
                                    <span style="font-weight:700;">·</span> {{ formatAgenda(itemSub.beforeValue, itemSub.afterValue) }}
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                <div class="scrollbar" v-if="flag==='meeting'">
                    <div v-for="item in attendeeList" :key="item.attendeeId" class="attendee-item">
                        <span class="attendee-name">{{ item.attendee.fixAttributeCommonVO.attendeeName }}</span><span
                            v-if="item.attendee.fixAttributeCommonVO.arriveFlight">乘坐{{ item.attendee.fixAttributeCommonVO.arriveFlight }}</span><span
                            v-if="item.attendee.fixAttributeCommonVO.arriveTime && item.attendee.fixAttributeCommonVO.arriveStation">于{{ item.attendee.fixAttributeCommonVO.arriveTime.slice(0,16) }}</span><span
                            v-if="item.attendee.fixAttributeCommonVO.arriveTime && !item.attendee.fixAttributeCommonVO.arriveStation">于{{ item.attendee.fixAttributeCommonVO.arriveTime.slice(0,16) }}到达</span><span
                            v-if="item.attendee.fixAttributeCommonVO.arriveStation">到达{{ item.attendee.fixAttributeCommonVO.arriveStation }}</span><br/>
                        <span class="attendee-name">基本信息：</span>单位：{{ item.attendee.fixAttributeCommonVO.organizationSortName ? item.attendee.fixAttributeCommonVO.organizationSortName: item.attendee.fixAttributeCommonVO.organizationName }}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;职位：{{ item.attendee.fixAttributeCommonVO.position }}<span v-if="item.attendee.roomTaskList && item.attendee.roomTaskList.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;入住酒店：<span v-for="(item,index) in item.attendee.roomTaskList" :key="index">{{item.roomFormVO.hotelVO.name}}</span></span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;联系方式：{{ formatPhone(item.attendee.fixAttributeCommonVO.phone) }}
                        <div v-if="item.attendeeTask && item.attendeeTask.changeContent && item.attendee.vehicleTaskList && item.attendee.vehicleTaskList.length">
                            <!-- 首次分配不显示变更信息 -->
                            <span class="attendee-name">变更信息：</span>
                            <div style="margin-top: -20px;margin-left: 100px;">
                                <div v-for="itemSub in formatLogContent(item.attendeeTask.changeContent)"
                                :key="itemSub.code" >
                                <div v-show="itemSub.code !== 'photoUrl' && itemSub.code !== 'agenda'">
                                    <span style="font-weight:700;">·</span> {{ itemSub.attribute }}变更，
                                    由“{{ itemSub.beforeValue !== null && itemSub.beforeValue !== '' ? itemSub.beforeValue : '无' }}”
                                    变更为“{{ itemSub.afterValue !== null && itemSub.afterValue !== '' ? itemSub.afterValue : '无' }}”
                                </div>
                                <div v-show="itemSub.code === 'photoUrl'">
                                    <span style="font-weight:700;">·</span> {{ itemSub.attribute }}有变更
                                    <el-link :underline="false" type="info"
                                        :href="imagePath + (itemSub.afterValue !== null && itemSub.afterValue !== '' ? itemSub.afterValue : defaultPhoto)">
                                        详情</el-link>
                                </div>
                                <div v-if="itemSub.code === 'agenda'">
                                    <span style="font-weight:700;">·</span> {{ formatAgenda(itemSub.beforeValue, itemSub.afterValue) }}
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>

            <carTask ref="carTask" :attendee-list="attendeeList" :flag="flag" @refresh="refresh" />

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
                <!-- <el-button type="primary" @click="onSubmit">确 定</el-button> -->
            </span>
        </el-dialog>

    </div>
</template>
<script>
import carTask from './carTask'
import { addVehicleTaskAttendee } from '@/api/car'
import { getConferenceId } from '@/utils/conference-auth'
import { getTableHeight, formatPhone } from '@/utils/index'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'


export default {
    name: 'TaskDialog',
    components: { carTask },
    data () {
        return {
            flag: '',
            dialogVisible: false,
            attendeeList: [],
            imagePath: getOssBaseUrl(),
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
            zhanKaiArray: []  //用来存储人员信息是否展开的序号
        }
    },
    watch: {
        // '$route' () {  // 对route进行监控  添加返回时会调用刷新数据
        //     this.getListInfo()

        // }

    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created () { },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted () {
        // this.$refs.dialog[0].$el.firstChild.style.height = '90%';
    },
    // 这里存放数据
    beforeCreate () { },
    // 生命周期 - 挂载之前
    beforeMount () { },
    // 生命周期 - 更新之前
    beforeUpdate () { },
    // 生命周期 - 更新之后
    updated () { },
    // 生命周期 - 销毁之前
    beforeDestroy () { },
    // 生命周期 - 销毁完成
    destroyed () { },
    // 如果页面有keep-alive缓存功能，这个函数会触发
    activated () { },
    methods: {
        zhanKaiArrayClick (index) {
            this.zhanKaiArray.push(index)
        },
        shouQiArrayClick (param) {
            var index = this.zhanKaiArray.indexOf(param);
            if (index > -1) {
                this.zhanKaiArray.splice(index, 1);
            }
        },
        formatAgenda (beforeValue, afterValue) {
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
        formatLogContent (val) {
            if (val === undefined || val === null || val === '') {
                return []
            } else {
                return JSON.parse(val)
            }
        },
        formatChangeAfter (val) {
            var changeVal = JSON.parse(val)
            var html = ''
            if (changeVal !== null) {
                changeVal.forEach((item, index) => {
                    if (index === 0) {
                        html += '变更后：'
                    }
                    if (item.code !== 'photoUrl') {
                        html += item.attribute + '：' + item.afterValue + ';'
                    }// 头像变化不展示出来
                    // } else {
                    //     html += item.attribute + '：' + '<div></div>' + ';'
                    // }
                })
            }
            return html
        },
        formatChangeBefore (val) {
            var changeVal = JSON.parse(val)
            var html = ''
            if (changeVal !== null) {
                changeVal.forEach((item, index) => {
                    if (index === 0) {
                        html += '变更前：'
                    }
                    if (item.code !== 'photoUrl') {
                        html += item.attribute + '：' + (item.beforeValue !== undefined ? item.beforeValue : '') + ';'
                    }// 头像变化不展示出来
                })
            }
            return html
        },
        formatPhone (val) {
            return formatPhone(val)
        },

        showDialog (attendeeList, flag) {
            this.flag = flag
            this.attendeeList = attendeeList
            console.log(attendeeList,'attendeeList-----------')
            this.dialogVisible = true
            this.zhanKaiArray = []
        },
        refresh (val) {
            this.$emit('getListInfo')
            if (val) {
                this.dialogVisible = false
            }
        }
        // onSubmit () {

        //     var taskId = this.$refs["carTask"].$refs.table.selection[0].id;
        //     var attendees = [];
        //     this.attendeeIds.forEach(item => {
        //         attendees.push({ "id": item })
        //     })
        //     var params = {
        //         "taskId": taskId,
        //         "attendees": attendees
        //     }
        //     console.log(params)
        //     addVehicleTaskAttendee(params).then(res => {
        //         if (res.success) {
        //             this.$message("操作成功！")
        //             this.$refs["carTask"].getListInfo(this.$refs["carTask"].paramData)
        //             this.$emit("closeDialog")
        //         }
        //     })
        // }

    }
}
</script>
<style lang='scss'  >
.title {
    font-size: 16px;
    color: #191F24;
    font-weight: 700;
    margin-bottom: 10px;
}
.scrollbar {
    background:#FAFAFA;
    padding:10px;
    max-height:128px;
    color:#393939 !important;
    overflow-y:auto;
    .attendee-item {
        padding-bottom:10px;
        color: #191F24;
        span {
            line-height: 23px;
            color:#393939 !important;
        }
        .attendee-name {
            font-weight:700;
            width: 100px;display:inline-block;
        }
    }
}
/* 设置滚动条的样式 */
.scrollbar::-webkit-scrollbar {
width:8px;
}
/* 滚动槽 */
.scrollbar::-webkit-scrollbar-track {
-webkit-box-shadow:inset006pxrgba(0,0,0,0.3);
border-radius:6px;
}
/* 滚动条滑块 */
.scrollbar::-webkit-scrollbar-thumb {
border-radius:6px;
background:rgba(0,0,0,0.1);
-webkit-box-shadow:inset006pxrgba(0,0,0,0.5);
}
.scrollbar::-webkit-scrollbar-thumb:window-inactive {
background:#CCCCCC;
}
</style>
