<template>
    <el-drawer ref="drawer" :title="title" :before-close="closeDialog" :visible.sync="dialogVisible" direction="rtl"
        custom-class="demo-drawer" size="40%" append-to-body>
        <el-form ref="form" size="small" :model="form" label-width="120px" :rules="rules"
            :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto'}">
            <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">

                <el-form-item label="入住时间" prop="doubleTime" style="width:80%">
                    <el-date-picker v-model="form.doubleTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                        type="daterange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"
                        placeholder="选择时间范围" size="small" :picker-options="doubleTimeOptions"
                        style="width:280px;margin-left:20px;width:100%" />
                </el-form-item>

                <el-form-item label="房间使用方式" prop="oneself">
                    <el-radio-group v-model="form.oneself" style="margin-left:20px">
                        <el-radio :label="1"
                            :disabled="choosedAttendeeList.length!==1 || (row.totalCount-row.remainCount)>0">
                            单住(当前时间段内，该房间无法再分配给他人)
                        </el-radio>
                        <br>
                        <el-radio :label="0" style="margin-top:5px"
                            :disabled="choosedAttendeeList.length!==1 || (row.totalCount-row.remainCount)>0">
                            合住
                        </el-radio>
                    </el-radio-group>

                </el-form-item>

                <el-form-item label="房间号" prop="roomNo" style="width:80%">
                    <el-input class="keepOutRight" style="margin-left:20px" v-model="form.roomNo" maxlength="20" show-word-limit />
                </el-form-item>

                <el-form-item label="房间位置" style="width:80%">
                    <el-input style="margin-left:20px" v-model="form.description" type="textarea" maxlength="300"
                        show-word-limit disabled />
                </el-form-item>

                <el-form-item label="房间描述" style="width:80%">
                    <el-input style="margin-left:20px" v-model="form.remark" type="textarea" maxlength="300"
                        show-word-limit disabled />
                </el-form-item>

            </el-scrollbar>
        </el-form>
        <div class="demo-drawer__footer"
            style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD">
            <el-button style="height:32px;margin-top:12px" @click="closeDialog">取 消</el-button>
            <el-button style="margin-left:50px" :loading="loading" type="primary" @click="onSubmit('form')">
                {{isChangeRoom?'确认选择':'确认分配'}}</el-button>
        </div>

        <div v-if="confirmDialogVisible">
            <!-- <el-dialog v-if="isChangeRoom" ref="dialog" :title="`正在为${this.attendeeList[0].fixAttributeCommonVO.attendeeName}更换房间`" :visible.sync="confirmDialogVisible" width="30%" append-to-body
                top="200px" :close-on-click-modal="false" :show-close="false">
                <span>{{ confirmMessage }}</span>
                <p>已分配房间将自动取消，请确认是否继续操作</p>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="laterClick">取消</el-button>
                    <el-button @click="nextClick">确认</el-button>
                </span>
            </el-dialog> -->
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

    </el-drawer>
</template>
<script>

import { getTableHeight, formatPhone } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
import { roomTaskInsert } from '@/api/hotel'
import { ignoreTask } from '@/api/car'
import { getXingchengListByUser } from '@/api/agenda'
export default {
    name: 'DistributeDialog',
    components: {},
    props: {

        attendeeList: {
            type: Array,
            default: []
        }
    },
    data () {
        return {
            form: {
                doubleTime: [],
                startDate: '',
                endDate: '',
                oneself: 0,
                roomNo: '',
                description: '',
                remark: ''
            },
            row: "",
            loading: false,
            choosedAttendeeList: [],
            title: '',
            dialogVisible: false,
            roomId: '',
            attendeeIds: [],
            tableHeight: getTableHeight(350),
            dialogHeight: getTableHeight(35) + 'px',
            maxStartTime: '',
            maxEndTime: '',
            confirmDialogVisible: false,
            doubleTimeOptions: {
                disabledDate: (time) => {
                    return time.getTime() < (new Date(this.maxStartTime).getTime() - 24 * 60 * 60 * 1000) ||
                        time.getTime() > (new Date(this.maxEndTime).getTime())
                }
            },
            rules: {
                doubleTime: [
                    { required: true, message: '请选择入住时间', trigger: 'blur' }
                ]

            },
            isChangeRoom:false,
            roomFormVO:""
        }
    },
    watch: {
        // '$route' () {  // 对route进行监控  添加返回时会调用刷新数据
        //     this.getListInfo()

        // }
        'form.doubleTime': {
            handler (newVal, oldVal) {
                if (newVal) {
                    this.form.startDate = newVal[0]
                    this.form.endDate = newVal[1]
                } else {
                    this.form.startDate = ''
                    this.form.endDate = ''
                }
            },
            deep: true,
            immediate: true
        },
        attendeeList:{
            handler:function(newData,oldData){
                if(newData[0].hasOwnProperty('fixAttributeCommonVO')){
                    this.isChangeRoom=true
                }else{
                    this.isChangeRoom=false
                }
            }
        }

    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created () { },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted () {
         if(this.attendeeList[0].hasOwnProperty('fixAttributeCommonVO')){
            this.isChangeRoom=true
        }else{
            this.isChangeRoom=false
        }

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

        closeDialog () {
            this.resetForm('form')
            this.dialogVisible = false
        },

        resetForm (form) {
            this.$refs[form].resetFields()
            this.form = this.$options.data().form
        },

        formatPhone (val) {
            return formatPhone(val)
        },
        qiehuanshoujijiami (event) {
            if (event.currentTarget.parentElement.children[0].style.display === 'none') {
                event.currentTarget.parentElement.children[0].style.display = ''
                event.currentTarget.parentElement.children[1].style.display = 'none'
            } else {
                event.currentTarget.parentElement.children[0].style.display = 'none'
                event.currentTarget.parentElement.children[1].style.display = ''
            }
        },

        showDialog (row, startDate, endDate) {
            this.title = '选择房间'
            this.row = row
            this.roomId = row.roomId
            this.dialogVisible = true
            this.choosedAttendeeList = []
            this.attendeeList.forEach(item => {
                item.attendee?this.choosedAttendeeList.push(item.attendee):this.choosedAttendeeList.push(item)
                // 
            })
            this.maxStartTime = row.startDate
            this.maxEndTime = row.endDate
            //查询条件中的日期带过来
            if (startDate && endDate) {
                this.form.doubleTime = [startDate, endDate]
            }
            if (row.oneself === 0) {
                this.form.oneself = 0
            } else {
                this.form.oneself = 1
            }
            this.form.roomNo = row.roomNo
            this.form.description = row.description
            this.form.remark = row.remark
            this.roomFormVO=row.roomFormVO
            console.log(row,'row111')
        },
        onSubmit (form) {
            
            this.$refs[form].validate((valid) => {
                // console.log(this.form,"form")
                if (valid) {
                    if (this.form.startDate === this.form.endDate) {
                        this.$message('入住时间至少为一天')
                        return
                    }

                    const attendeeIdList = []
                    this.choosedAttendeeList.forEach(item => {
                        console.log(item,"item??")
                        attendeeIdList.push(item.id)
                    })

                    this.loading = true
                    var params = {
                        attendeeIdList,
                        'conferenceId': getConferenceId(),
                        'endDate': this.form.endDate,
                        'startDate': this.form.startDate,
                        'oneself': this.form.oneself,
                        'roomId': this.roomId,
                        'roomNo': this.form.roomNo
                    }
                    if(this.isChangeRoom){
                        params.changeRoomFlag=true
                    
                    this.$msgbox({
                        title: `正在为${this.attendeeList[0].fixAttributeCommonVO.attendeeName}更换房间`,
                        message:`入住时间：${this.form.startDate}至${this.form.endDate}，入住酒店：${this.roomFormVO.hotelVO.name}，房型：${this.roomFormVO.modelName}，房间号：${this.form.roomNo}` ,
                        showCancelButton: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        beforeClose: (action, instance, done) => {
                            if (action === 'confirm') {
                            // instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '执行中...';
                            roomTaskInsert(params).then(res => {
                            if (res.success) {
                                // instance.confirmButtonLoading = false;
                                this.$emit('getListInfo')
                                this.closeDialog() // 保存成功关闭抽屉页面
                                done();
                            }else{
                                this.closeDialog() // 保存成功关闭抽屉页面
                                done();
                            }
                            this.loading = false
                            }).catch(()=>{
                                // instance.confirmButtonLoading = false;
                                done();
                            })
                            } else {
                            done();
                            }
                        }
                        }).then(action => {
                            this.$message('操作成功')
                            getXingchengListByUser({ 'attendeeId': this.attendeeList[0].fixAttributeCommonVO.attendeeId}).then(res => {
                                this.$emit('parentFangData',res.result.roomTaskList)
                                // this.data = res.result.vehicleDinnerDateList
                                // this.fangData = res.result.roomTaskList
                                // this.piaoData = res.result.cardList
                            })
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '取消操作'
                            });   
                            this.$emit('closeDialog')
                            this.$emit('getListInfo') // 刷新代办列表的数据  关闭弹框
                            this.closeDialog() // 保存成功关闭抽屉页面    
                        });
                    }else{
                        roomTaskInsert(params).then(res => {
                        if (res.success) {
                            this.$message('操作成功')
                            this.$emit('getListInfo')
                            this.closeDialog() // 保存成功关闭抽屉页面
                            // if(this.isChangeRoom){
                            //     var message = `入住时间：${this.form.startDate}至${this.form.endDate}，入住酒店：${this.roomFormVO.hotelVO.name}，房型：${this.roomFormVO.modelName}，房间号：${this.form.roomNo}`
                            // }else{
                            if (this.attendeeList.length === 1) {
                                var message = '住宿任务分配完成，是否继续为' + this.attendeeList[0].attendee.fixAttributeCommonVO.attendeeName + '分配住宿?'
                            } else {
                                var message = '住宿任务分配完成，是否继续为' + this.attendeeList.length + '位' + this.getConferenceTemplate(2) + '分配住宿?'
                            }
                            // }
                            
                            this.confirmDialogVisible = true
                            this.confirmMessage = message
                        }
                        this.loading = false
                    })
                    }
                    
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },

        finishClick () {
            //    var flag = this.noAllDaiFenPei();
            // 直接改状态 if (flag) {
            var params = []
            
            this.attendeeList.forEach(item => {
                const attendeeId=item.fixAttributeCommonVO?item.fixAttributeCommonVO.id:item.attendee.id
                params.push({ 'conferenceId': getConferenceId(), 'attendeeId': attendeeId, 'type': 52, 'result': 100 })
            })
            ignoreTask(params).then(res => {
                if (res.success) {
                    // 刷新代办列表的数据  关闭弹框
                    this.confirmDialogVisible = false
                    this.$emit('closeDialog')
                    this.$emit('getListInfo') // 刷新代办列表的数据  关闭弹框
                    this.closeDialog() // 保存成功关闭抽屉页面
                }
            })
        },
        laterClick () {
            this.confirmDialogVisible = false
            this.$emit('closeDialog')
            this.$emit('getListInfo') // 刷新代办列表的数据  关闭弹框
            this.closeDialog() // 保存成功关闭抽屉页面
        },
        nextClick () {
            this.confirmDialogVisible = false
            this.$emit('getListInfo') // 刷新代办列表的数据  不关弹框
            this.closeDialog() // 保存成功关闭抽屉页面
        }

    }
}
</script>
<style lang='scss'  >
</style>
