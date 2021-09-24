<template>
    <div>
        <el-dialog v-if="dialogVisible" ref="dialog" :visible.sync="dialogVisible" width="50%" :show-close="false">
             <div slot="title" style="padding:10px;">
                <div class="title">正在为以下人员分配票证</div>
                <div class="scrollbar">
                    <div v-for="item in attendeeList" :key="item.attendeeId" class="attendee-item">
                        <span class="attendee-name">{{ item.attendee.fixAttributeCommonVO.attendeeName }}</span><br/>
                        <span class="attendee-name">基本信息：</span>单位：{{ item.attendee.fixAttributeCommonVO.organizationSortName ? item.attendee.fixAttributeCommonVO.organizationSortName: item.attendee.fixAttributeCommonVO.organizationName }}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;职位：{{ item.attendee.fixAttributeCommonVO.position }}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;联系方式：{{ formatPhone(item.attendee.fixAttributeCommonVO.phone) }}
                        <div v-if="item.attendeeTask && item.attendeeTask.changeContent && item.attendee.cardList && item.attendee.cardList.length">
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
            <diningTask ref="diningTask" :attendee-ids="attendeeIds" />

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
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
    </div>
</template>
<script>
import diningTask from './diningTask' //  名字懒得改了
import { getTableHeight } from '@/utils/index'
import { batchAddAttendeeCard } from '@/api/card'
import { getConferenceId } from '@/utils/conference-auth'
import { ignoreTask } from '@/api/car'
import { formatPhone } from '@/utils/index'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'

export default {
    name: 'TaskDialog',
    props: {
        attendeeIds: {
            type: Array
        }
    },
    components: { diningTask },
    data () {
        return {
            dialogVisible: false,
            attendeeList: [],
            confirmMessage: '',
            confirmDialogVisible: false,
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
                params.push({ 'conferenceId': getConferenceId(), 'attendeeId': item.attendee.id, 'type': 53, 'result': 100 })
            })
            ignoreTask(params).then(res => {
                if (res.success) {
                    this.$emit('closeDialog')
                    this.$emit('getListInfo')
                    // 刷新代办列表的数据  关闭弹框
                    this.confirmDialogVisible = false
                    return;
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
                    params.push({ 'conferenceId': getConferenceId(), 'attendeeId': item.attendee.id, 'type': 53, 'result': 100 })
                })
                ignoreTask(params).then(res => {
                    if (res.success) {
                        this.$emit('closeDialog')
                        this.$emit('getListInfo') // 刷新代办列表的数据  关闭弹框
                        this.confirmDialogVisible = false
                        return;
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
                    params.push({ 'conferenceId': getConferenceId(), 'attendeeId': item.attendee.id, 'type': 53, 'result': 100 })
                })
                ignoreTask(params).then(res => {
                    if (res.success) {
                        this.$emit('getListInfo') // 刷新代办列表的数据  不关弹框
                        this.confirmDialogVisible = false
                        return;
                    }
                })
                this.$emit('getListInfo') // 刷新代办列表的数据  不关弹框
                this.confirmDialogVisible = false
            } else {
                this.$emit('getListInfo') // 刷新代办列表的数据  不关弹框
                this.confirmDialogVisible = false
            }
        },

        showDialog (attendeeList, flag) {
            this.attendeeList = attendeeList;
            this.dialogVisible = true;
            this.zhanKaiArray = []
            // if (flag) {
            //     this.title = "分配"
            // } else {
            //     this.title = "批量分配"
            // }
        },
        onSubmit () {
            if (this.$refs["diningTask"].$refs.table.selection.length === 0) {
                this.$message("请选择分配的证件")
                return
            }
            var cardId = this.$refs["diningTask"].$refs.table.selection[0].id;
            var attendeeVOList = [];

            this.attendeeList.forEach(item => {

                attendeeVOList.push({
                    "fixAttributeVO": {
                        "organizationSortName": item.attendee.fixAttributeCommonVO.organizationSortName,
                        "organizationName": item.attendee.fixAttributeCommonVO.organizationName
                    }, id: item.attendee.id
                })
            })
            var params = {
                "attendeeVOList": attendeeVOList,
                "card": {
                    "id": cardId,
                    "cardStatus": 1     //给证件分配一个默认状态
                }
            }
            console.log(params)
            batchAddAttendeeCard(params).then(res => {
                if (res.success) {
                    this.$message("操作成功！")
                    this.$refs["diningTask"].getCardOptions()
                    //   this.$emit("closeDialog")
                    //  this.$emit("getListInfo")
                    if (this.attendeeList.length === 1) {
                        var message = '证件分配完成，是否继续为' + this.attendeeList[0].attendee.fixAttributeCommonVO.attendeeName + '分配证件?'
                    } else {
                        var message = '证件分配完成，是否继续为' + this.attendeeList.length + '位' + this.getConferenceTemplate(2) + '分配证件?'
                    }
                    this.confirmDialogVisible = true
                    this.confirmMessage = message
                }
            })
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
            width: 120px;display:inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
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
