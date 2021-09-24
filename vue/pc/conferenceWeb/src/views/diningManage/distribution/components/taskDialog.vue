<template>
    <div v-if="dialogVisible">
        <el-dialog ref="dialog" :visible.sync="dialogVisible" width="90%" top="10px" :show-close="false"
            :before-close="handleClose">
             <div slot="title" style="padding:10px;">
                <div class="title">正在为以下人员分配用餐</div>
                <div class="scrollbar">
                    <div v-for="item in attendeeList" :key="item.attendeeId" class="attendee-item">
                        <span class="attendee-name">{{ item.attendee.fixAttributeCommonVO.attendeeName }}</span><br/>
                        <span class="attendee-name">基本信息：</span>单位：{{ item.attendee.fixAttributeCommonVO.organizationSortName ? item.attendee.fixAttributeCommonVO.organizationSortName: item.attendee.fixAttributeCommonVO.organizationName }}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;职位：{{ item.attendee.fixAttributeCommonVO.position }}<span v-if="item.attendee.roomTaskList && item.attendee.roomTaskList.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;入住酒店：<span v-for="(item,index) in item.attendee.roomTaskList" :key="index">{{item.roomFormVO.hotelVO.name}}</span></span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;联系方式：{{ formatPhone(item.attendee.fixAttributeCommonVO.phone) }}
                        <div v-if="item.attendeeTask && item.attendeeTask.changeContent && item.attendee.dinnerTaskList && item.attendee.dinnerTaskList.length">
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
            <diningTask ref="diningTask" :attendeeIds='attendeeIds' />

            <span slot="footer" class="dialog-footer">
                <el-button @click="close">关闭</el-button>
                <el-button type="primary" @click="onSubmit">确认分配</el-button>
            </span>

            <div v-if="confirmDialogVisible">
                <el-dialog ref="dialog" title="提示" :visible.sync="confirmDialogVisible" width="30%" append-to-body
                    top="200px" :close-on-click-modal="false" :show-close="false">
                    <span>{{ confirmMessage }}</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="finishClick">分配完成</el-button>
                        <el-button @click="laterClick">稍后分配</el-button>
                        <el-button @click="nextClick">继续分配</el-button>
                    </span>
                </el-dialog>
            </div>
        </el-dialog>

        <chooseTableNo ref="chooseTableNo" @insert='insert' />

    </div>
</template>
<script>
import diningTask from './diningTask'
import chooseTableNo from './chooseTableNo'

import { getTableHeight } from '@/utils/index'
import { addDiningTaskAttendee } from '@/api/dining'
import { getConferenceId } from '@/utils/conference-auth'
import { ignoreTask } from '@/api/car'
import { formatPhone } from '@/utils/index'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'

export default {
    name: 'TaskDialog',
    components: { diningTask, chooseTableNo },
    data () {
        return {
            attendeeIds: [],
            attendeeList: [],
            dialogVisible: false,
            confirmMessage: '',
            confirmDialogVisible: false,
            title: '',
            imagePath: getOssBaseUrl(),
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
            taskId: [],
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
        close () {
            this.dialogVisible = false
            this.$emit('getListInfo')
        },
        handleClose (done) {
            done()
            this.$emit('getListInfo')
        },
        formatPhone (val) {
            return formatPhone(val)
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

        noAllDaiFenPei () {
            var flag = false
            this.attendeeList.forEach(item => {
                if (item.attendeeTask === null || item.attendeeTask.status !== 1 || item.attendeeTask.result !== null) {
                    flag = true
                }
            })
            return flag
        },

        finishClick () {
            //    var flag = this.noAllDaiFenPei();
            // 直接改状态 if (flag) {
            var params = []
            this.attendeeList.forEach(item => {
                params.push({ 'conferenceId': getConferenceId(), 'attendeeId': item.attendee.id, 'type': 51, 'result': 100 })
            })
            ignoreTask(params).then(res => {
                if (res.success) {
                    this.$emit('closeDialog')
                    this.$emit('getListInfo')
                    // 刷新代办列表的数据  关闭弹框
                    this.confirmDialogVisible = false
                    return // 下面this.$emit('getListInfo') 还是会执行  这个return没啥用
                }
            })
            this.confirmDialogVisible = false
            this.$emit('closeDialog')
            this.$emit('getListInfo') // 刷新代办列表的数据  关闭弹框
        },
        laterClick () {
            var flag = this.noAllDaiFenPei()
            if (flag) {
                var params = []
                this.attendeeList.forEach(item => {
                    params.push({ 'conferenceId': getConferenceId(), 'attendeeId': item.attendee.id, 'type': 51, 'result': 100 })
                })
                ignoreTask(params).then(res => {
                    if (res.success) {
                        this.$emit('closeDialog')
                        this.$emit('getListInfo') // 刷新代办列表的数据  关闭弹框
                        this.confirmDialogVisible = false
                        return
                    }
                })
                this.$emit('closeDialog')
                this.$emit('getListInfo') // 刷新代办列表的数据  关闭弹框
                this.confirmDialogVisible = false
            } else {
                this.$emit('closeDialog')
                this.$emit('getListInfo') // 刷新代办列表的数据  关闭弹框
                this.confirmDialogVisible = false
            }
        },
        nextClick () {
            var flag = this.noAllDaiFenPei()
            if (flag) {
                var params = []
                this.attendeeList.forEach(item => {
                    params.push({ 'conferenceId': getConferenceId(), 'attendeeId': item.attendee.id, 'type': 51, 'result': 100 })
                })
                ignoreTask(params).then(res => {
                    if (res.success) {
                        this.$emit('getListInfo') // 刷新代办列表的数据  关闭弹框
                        this.confirmDialogVisible = false
                        return
                    }
                })
                this.$emit('getListInfo') // 刷新代办列表的数据  不关弹框
                this.confirmDialogVisible = false
            } else {
                this.$emit('getListInfo') // 刷新代办列表的数据  不关弹框
                this.confirmDialogVisible = false
            }
        },

        showDialog (ids, selectedList, row) {
            // if (row) {
            //     this.title = '分配用餐'
            // } else {
            //     this.title = '批量分配'
            // }
            this.attendeeIds = ids
            this.attendeeList = selectedList
            this.dialogVisible = true
            this.zhanKaiArray = []
        },
        insert (tableNo) {
            var attendeeIdList = this.attendeeIds;
            var dinnerAttendees = []
            if (tableNo === '') {
                this.taskId.forEach(item => {
                    dinnerAttendees.push({ 'taskId': item, 'tableNo': '' })
                })
            } else {
                dinnerAttendees = tableNo
            }
            var params = {
                'attendeeIdList': attendeeIdList,
                'dinnerAttendees': dinnerAttendees
            }
            console.log(params)
            addDiningTaskAttendee(params).then(res => {
                if (res.success) {
                    this.$message('操作成功')
                    this.$refs['diningTask'].getListInfo(this.$refs['diningTask'].paramData)
                    this.$refs['chooseTableNo'].closeDialog()
                    //  this.$emit("closeDialog")
                    //  this.$emit("getListInfo")
                    // 三按钮弹框
                    if (this.attendeeList.length === 1) {
                        var message = '用餐任务分配完成，是否继续为' + this.attendeeList[0].attendee.fixAttributeCommonVO.attendeeName + '分配用餐?'
                    } else {
                        var message = '用餐任务分配完成，是否继续为' + this.attendeeList.length + '位' + this.getConferenceTemplate(2) + '分配用餐?'
                    }
                    this.confirmDialogVisible = true
                    this.confirmMessage = message
                }
            })
        },
        onSubmit () {

            if (this.$refs['diningTask'].$refs.table.selection.length === 0) {
                this.$message('请选择用餐任务')
                return false
            }

            this.$refs['diningTask'].$refs.table.selection.forEach(item => {
                this.taskId.push(item.id)
            })
            var selection = this.$refs['diningTask'].$refs.table.selection
            var n = selection.filter(item => item.dining.tableNoList.length > 0)
            if (n.length > 0) {
                this.$refs['chooseTableNo'].showDialog(selection)
            } else {
                this.insert('');
            }


        }

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
