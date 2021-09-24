<template>
    <el-drawer ref="drawer" :title="title" :before-close="handleClose" :visible.sync="dialog" direction="rtl"
        custom-class="demo-drawer" size="45%" append-to-body>
        <el-form ref="form" size="small" :model="form" label-width="140px" label-position="left" :rules="rules"
            :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto','margin-left':'30px','margin-top':'-15px'}">
            <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">

                <el-form-item label="餐厅名称" prop="diningId" style="width:80%">
                    <span>{{ this.form.diningName }}</span>
                </el-form-item>
                <el-form-item label="餐位数" prop="seatNum" style="width:80%">
                    <span>{{ this.seatNum}}</span>
                </el-form-item>

                <el-form-item label="用餐类型" prop="typeCode" style="width:80%">
                    <span>{{ this.form.typeCode1}}</span>
                </el-form-item>

                <el-form-item label="用餐日期" style="width:80%">
                    <span>{{ this.doubleDateTime[0]}}&nbsp;-&nbsp;{{ this.doubleDateTime[1]}}</span>
                </el-form-item>

                <el-form-item label="用餐时间" style="width:80%">
                    <span
                        v-if='this.form.startTime'>{{ this.form.startTime.slice(0,5)}}&nbsp;-&nbsp;{{ this.form.endTime.slice(0,5)}}</span>
                </el-form-item>
                <el-form-item label="任务状态" style="width:80%">
                    <span>{{ changeStatus(this.form)}}</span>
                </el-form-item>
                <el-form-item label="备注" prop="description" style="width:80%">
                    <span>{{ this.form.description ? this.form.description:'无'}}</span>
                </el-form-item>

                <div style="background-color: white;padding-left:0px;padding-top:10px;padding-right: 30px">

                    <el-table ref="table" :data="diningTaskAttendeeList" style="width: 100%" :header-cell-style="{
                                background:'#f7f7f7'
                            }">
                        <el-table-column :label="getConferenceTemplate(2) + '信息'" align="left" min-width="100px">
                            <template slot-scope="scope">
                                <div style="height:32px">
                                    <img style="width:32px;height:32px;float:left;border-radius:50%"
                                        :src="imagePath + (scope.row.fixAttributeCommonVO.photoUrl!== null && scope.row.fixAttributeCommonVO.photoUrl !== '' ? scope.row.fixAttributeCommonVO.photoUrl : defaultPhoto)">
                                    <span style="margin-top:8px;margin-left:5px;float:left"
                                        :title="scope.row.fixAttributeCommonVO.attendeeName">{{ scope.row.fixAttributeCommonVO.attendeeName != null && scope.row.fixAttributeCommonVO.attendeeName.length > 4 ? scope.row.fixAttributeCommonVO.attendeeName.substr(0,4) + '...' : scope.row.fixAttributeCommonVO.attendeeName }}</span>

                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="职务" min-width="70px">
                            <template slot-scope="scope">
                                <div :title="scope.row.fixAttributeCommonVO.position" class="content1">
                                    {{  formatTableCellData(scope.row.fixAttributeCommonVO.position) }}</div>
                            </template>
                        </el-table-column>

                        <el-table-column label="手机" min-width="70px">
                            <template slot-scope="scope">
                                <div :title="scope.row.fixAttributeCommonVO.phone">
                                    {{ scope.row.fixAttributeCommonVO.phone }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="单位简称/全称" min-width="80px">
                            <template slot-scope="scope">
                                <div>
                                    {{ formatTableCellData(formatOrgName(scope.row.fixAttributeCommonVO.organizationSortName,scope.row.fixAttributeCommonVO.organizationName)) }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="桌号" min-width="70px">
                            <template slot-scope="scope">
                                <div>
                                    {{ formatTableCellData(scope.row.tableNo) }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="180px">
                            <template slot-scope="scope">
                                <!-- <el-button type="text" size="mini" @click="showAttendeeInfo( scope.row.id)">人员详情
                                </el-button> -->
                                <el-button v-permission="buttons.DiningTask.change" v-if="tableNoList.length!==0"
                                    type="text" size="mini" @click="editOne(scope.row)">编辑
                                </el-button>
                                <el-button v-permission="buttons.DiningTask.removeAttendee" type="text" size="mini"
                                    @click="handleRemoveWithConfirm(scope.$index, scope.row)">移除
                                </el-button>

                            </template>
                        </el-table-column>
                    </el-table>

                </div>

            </el-scrollbar>
        </el-form>

        <div class="demo-drawer__footer"
            style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD">
            <el-button v-permission="buttons.DiningTask.addAttendee" type="primary" :loading="loading"
                style="height:32px;margin-top:12px" @click="addOne()">
                添加用餐人员</el-button>
            <el-button style="height:32px;margin-top:12px" @click="cancelForm">关闭</el-button>

        </div>
        <addOneAttendee ref="addOneAttendee" :dialog-visible="addOneAttendeeDialog" @closeDialog="closeDialog"
            :task-id="paramData.taskId" :diningTime="diningTime" :diningDate='diningDate' :tableNoList='tableNoList' />

    </el-drawer>
</template>

<script>
import { getDiningById, updateDiningTask, addDiningTask, getDiningList, getTaskTypeOptions, getDiningTaskAttendeeList, deleteDiningTaskAttendee } from '@/api/dining'
import { getTableHeight } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
import addOneAttendee from './addOneAttendee'


export default {
    name: '',
    components: {
        addOneAttendee
    },
    // import引入的组件需要注入到对象中才能使用
    // 例如：import 《组件名称》 from '《组件路径》';
    props: {

    },
    data () {
        // 这里存放数据
        return {
            buttons: this.Global.buttons,
            form: {
                id: '',
                conferenceId: getConferenceId(), // 这里后面再改  先设置会议为1
                dinnerStartDate: null,
                dinnerEndDate: null,
                startTime: null,
                endTime: null,
                typeCode: null,
                diningId: '',
                description: '',
                zidingyiFlag: false,
                typeCode1: '',
                typeCode2: ''
            },
            paramData: {
                conferenceId: getConferenceId(),
                taskId: '',
                pageSize: 99,
                pageNum: 1

            },
            nameDisabled: false,
            tableNoList: [],
            //  tableHeight: getTableHeight(160),
            addOneAttendeeDialog: false,
            imagePath: getOssBaseUrl(),
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
            diningTaskAttendeeList: [],
            doubleDateTime: '',
            seatNum: '',
            doubleTime: '', // 这个放在里面会导致编辑页面初始化后无法编辑，所以放在了form外面，导致无法使用rule的校验  手动加吧
            title: '',
            dialog: false,
            diningList: [],
            dialogHeight: getTableHeight(20) + 'px',
            loading: false,
            diningDate: '',
            diningTime: '',
            rules: {

            }
        }
    },
    // 监听属性 类似于data概念
    computed: {

    },
    // 监控data中的数据变化
    watch: {
        'doubleDateTime': {
            handler (newVal, oldVal) {
                if (newVal) {
                    this.form.dinnerStartDate = newVal[0]
                    this.form.dinnerEndDate = newVal[1]
                } else {
                    this.form.dinnerStartDate = ''
                    this.form.dinnerEndDate = ''
                }
            },
            deep: true,
            immediate: true
        }

    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created () {

    },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted () {

    },
    // 这里存放数据
    beforeCreate () {
    },
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
    // 方法集合
    methods: {
        refresh () {
            this.getListInfo(this.paramData)
            this.$emit('getListInfo')
        },
        closeDialog () {
            this.nameDisabled = false
            this.addOneAttendeeDialog = false
            this.refresh()
        },
        addOne () {
            this.addOneAttendeeDialog = true
            this.$refs['addOneAttendee'].changeTitle();
        },
        editOne (row) {
            this.addOneAttendeeDialog = true
            this.$refs['addOneAttendee'].initData(row);
        },
        deleteDiningTaskAttendee (param) {
            deleteDiningTaskAttendee(param).then(res => {
                if (res.success) {
                    this.$message('操作成功')
                    this.getListInfo(this.paramData)
                    this.$emit('getListInfo')
                }
            })
        },
        handleRemove (index, row) {
            const attendees = [{ 'attendeeId': row.id }]
            const param = { 'taskId': this.paramData.taskId, 'dinnerAttendees': attendees }
            this.deleteDiningTaskAttendee(param)
        },
        handleRemoveWithConfirm (index, row) {
            this.$confirm('请确认是否从当前任务中移除' + row.fixAttributeCommonVO.attendeeName + '？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.handleRemove(index, row)
            }).catch(() => { })
        },
        showAttendeeInfo (val) {
            this.$router.push({
                path: `/attendeeManagement/attendee/show/${val}`
            })
        },
        getListInfo (param) {
            getDiningTaskAttendeeList(param).then(response => {
                if (response.success) {
                    console.log('getDiningTaskAttendeeList' + response.result.list)
                    this.diningTaskAttendeeList = response.result.list
                    this.paramData = param
                }
            })
        },
        changeStatus (row) {
            if (row.status == -1) {
                return '已取消'
            }
            if(row.publish == 0){
              return '未发布'
            } else if(row.publish == 2){
              return '待审核'
            }

            if (row.status == 0) {
                return '正常'
            }
        },
        getDateTime () {
            return new Date().getTime()   //上面组件拿到数据没有渲染  加个key
        },

        dinnerDateClick () {
            this.form.diningId = ''
            this.seatNum = ''
            this.doubleTime = ''
        },
        typeCodeClick (item) {

            if (item.typeCode === '早餐') {
                this.form.startTime = '07:00'
                this.form.endTime = '08:00'
                return
            }
            if (item.typeCode === '午餐') {
                this.form.startTime = '11:00'
                this.form.endTime = '12:00'
                return
            }
            if (item.typeCode === '晚餐') {
                this.form.startTime = '17:00'
                this.form.endTime = '18:00'
                return
            }
            if (item.typeCode === '自定义') {
                this.form.zidingyiFlag = true
                this.form.startTime = '07:00'
                this.form.endTime = '08:00'
                return
            }
            this.form.startTime = '07:00'
            this.form.endTime = '08:00'
        },
        dinnerClick (item) {
            this.seatNum = item.seatNum
        },
        getDiningList () {
            var params = { 'conferenceId': this.form.conferenceId }
            getDiningList(params).then(response => {
                if (response.success) {
                    this.diningList = response.result.list
                }
            })
        },
        getTaskTypeOptions (param) {
            getTaskTypeOptions(param).then(response => {
                if (response.success) {
                    this.taskTypeOptions = response.result;
                    var a = { 'typeCode': '自定义' }
                    this.taskTypeOptions.push(a)
                }
            })
        },
        showEdit (row) {
            //  this.getDiningList();
            // this.getTaskTypeOptions()
            if (!row) {
                this.title = '添加用餐任务'//不存在这种情况
            } else {
                this.title = '任务信息'
                this.paramData.taskId = row.id
                this.getListInfo(this.paramData)
                this.form = Object.assign({}, row)
                this.form.diningName = this.form.dining.dinnerRoom
                this.seatNum = this.form.dining.seatNum
                this.form.typeCode1 = this.form.typeCode;
                console.log('diningid' + this.form.diningId)
                this.doubleDateTime = [this.form.dinnerStartDate, this.form.dinnerEndDate]

                this.form.startTime = this.form.startTime.slice(0, 5);
                this.form.endTime = this.form.endTime.slice(0, 5)
                // this.startTime = '01:00'
                // this.endTime = '03:00'
                this.seatNum = this.form.dining.seatNum
                this.diningDate = this.doubleDateTime[0] + ' - ' + this.doubleDateTime[1]
                this.diningTime = this.form.startTime + ' - ' + this.form.endTime
                this.getTableNoList()
            }
            this.dialog = true
        },
        getTableNoList () {
            getDiningById({ id: this.form.diningId }).then(response => {
                if (response.success) {
                    this.tableNoList = response.result.tableNoList.map(n => { return { val: n } })

                } else {
                    this.$message('数据获取失败')
                }
            })
        },

        resetForm (form) {
            this.$refs[form].resetFields()
            this.form = {
                id: '',
                conferenceId: getConferenceId(), // 这里后面再改  先设置会议为1
                dinnerStartDate: null,
                dinnerEndDate: null,
                startTime: null,
                endTime: null,
                typeCode: null,
                diningId: '',
                description: '',
                zidingyiFlag: false,
                typeCode1: '',
                typeCode2: ''
            },
                //  this.form = this.$options.data().form
                this.seatNum = ''
            this.doubleDateTime = ''
            this.form.startTime = null
            this.form.endTime = null
            console.log('cancle' + this.form.conferenceId)
        },
        handleClose (done) {
            done()
            this.resetForm('form')
            this.dialog = false
        },
        cancelForm () {
            this.resetForm('form')
            this.dialog = false
        },

        handleUpdate () {
            updateDiningTask(this.form).then(response => {
                if (response.success) {
                    this.$message('修改成功')
                    this.cancelForm()
                    this.$emit('getListInfo')
                }
                this.loading = false
            })
        },
        handleAdd () {

            addDiningTask(this.form).then(response => {
                if (response.success) {
                    this.$message('新增成功')
                    this.cancelForm()
                    this.$emit('getListInfo')
                }
                this.loading = false
            })
        },
        // onSubmit (form) {
        //     this.$refs[form].validate((valid) => {
        //         if (valid) {
        //             // if (!this.form.startTime ) {
        //             //     this.$message('用选择用餐时间')
        //             //     return
        //             // }
        //             if (this.form.typeCode1 === '自定义') {
        //                 if (this.form.typeCode2 === '' || this.form.typeCode2 === null) {
        //                     this.$message("请输入自定义类型名称")
        //                     return
        //                 }
        //                 this.form.typeCode = this.form.typeCode2
        //             } else {
        //                 this.form.typeCode = this.form.typeCode1
        //             }
        //             if (!this.doubleDateTime) {
        //                 this.$message("请选择用餐日期")
        //                 return
        //             }
        //             if (!this.form.startTime || !this.form.endTime) {
        //                 this.$message("请选择用餐时间")
        //                 return
        //             }
        //             this.form.startTime = this.form.startTime + ':00'
        //             this.form.endTime = this.form.endTime + ':00'
        //             if (this.form.typeCode1 === '自定义') {
        //                 if (this.form.typeCode2 === '' || this.form.typeCode2 === null) {
        //                     this.$message("请输入自定义类型名称")
        //                     return
        //                 }
        //                 this.form.typeCode = this.form.typeCode2
        //             } else {
        //                 this.form.typeCode = this.form.typeCode1
        //             }
        //             this.loading = true
        //             // 先根据form.id 来判断是增加还是修改  存在form.id  那么就是修改
        //             if (this.form.id !== '') {
        //                 console.log(this.form)
        //                 this.handleUpdate()
        //             } else { // 新增餐厅
        //                 this.handleAdd()
        //             }
        //         } else {
        //             console.log('error submit!!')
        //             return false
        //         }
        //     })
        // }

    }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
</style>
