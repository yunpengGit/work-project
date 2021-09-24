<template>
    <div class="">
        <el-drawer :title="'分配桌号'" :visible.sync="dialogVisible" :before-close="closeDialog" size="40%" append-to-body>
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm"
                :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto',}">
                <!-- 'border-top': 'solid #ccc 1px' -->
                <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                    <div v-for="(item,index) in selectionShow" :key="item.id">
                        <el-form-item label="用餐类型" style="width:80%">
                            <!-- <el-input v-model="item.typeCode" class="width360" disabled /> -->
                            <span>{{ item.typeCode}}</span>
                        </el-form-item>
                        <el-form-item label="用餐日期" style="width:80%">
                            <!-- <el-input v-model="item.startTime" class="width360" disabled /> -->
                            <span>{{ item.dinnerStartDate}} - {{ item.dinnerEndDate}}</span>
                        </el-form-item>
                        <el-form-item label="用餐时间" style="width:80%">
                            <span>{{ item.startTime.slice(0,5)}} - {{ item.endTime.slice(0,5)}}</span>
                        </el-form-item>
                        <el-form-item label="">
                            <span slot="label"> 桌号</span>
                            <el-select v-model="tableNo[index]" placeholder="全部" class="width360" size="small">
                                <el-option v-for="item1 in item.dining.tableNoList" :key="item1" :label="item1"
                                    :value="item1+'-'+item.id" />
                            </el-select>
                        </el-form-item>
                        <!-- 把任务的id拼在桌号的后面 -->
                        <span style="padding-left">
                            <el-divider v-if="index!=selectionShow.length-1"></el-divider>
                        </span>

                    </div>

                </el-scrollbar>
            </el-form>
            <div class="demo-drawer__footer"
                style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD">
                <el-button type="primary" :loading="loading" style="height:32px;margin-top:12px" @click="insert">确认分配
                </el-button>
                <el-button style="height:32px;margin-top:12px" @click="closeDialog">取 消</el-button>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { getConferenceId } from '@/utils/conference-auth'
import { addDiningTaskAttendee } from '@/api/dining'

import { getTableHeight } from '@/utils/index'
import { getList, findAttendeeIdByNameAndPhone } from '@/api/attendee'
import { showLoading, closeLoading } from '@/utils/loading'
import { addVehicleTaskAttendee } from '@/api/car'
import { telephoneValid } from '@/utils/valid-common'
export default {
    name: 'AddAttendeeToSpecial',
    components: {
    },
    props: {
        // dialogVisible: {
        //     type: Boolean,
        //     default: false
        // },
        // taskId: {
        //     type: null,
        //     default: null
        // },
        // diningDate: {
        //     type: null,
        //     default: null
        // },
        // diningTime: {
        //     type: null,
        //     default: null
        // },
        // tableNoList: {
        //     type: null,
        //     default: null
        // }
        // nameDisabled: {
        //     type: Boolean,
        //     default: false
        // }

    },
    data () {
        return {
            dialogHeight: getTableHeight(35) + 'px',
            loading: false,
            // typeStr:null,
            // diningDate:null,
            // diningTime:null,
            tableNo: [],
            dialogVisible: false,
            selection: null,
            selectionShow: null,


            rules: {
                // attendeeId: [{ required: true, message: '请选择乘车人', trigger: 'change' }],
                // attendeeName: [{ required: true, message: '请输入参会人名称', pattern: '[^ \x22]+', trigger: 'blur' }],
                // attendeePhone: [{ required: true, message: '请输入参会人手机', pattern: '[^ \x22]+', trigger: 'blur' },
                //     telephoneValid()],
                // contactPerson: [{ required: true, message: '请输入联系人', pattern: '[^ \x22]+', trigger: 'blur' }],
                // phone: [{ required: true, message: '请输入联系人电话', pattern: '[^ \x22]+', trigger: 'blur' },
                //     telephoneValid()]
                //   tableNo: [{ required: true, message: '请选择桌号', trigger: 'change' }]
            }
        }
    },
    methods: {


        showDialog (selection) {
            this.selection = selection;
            this.selectionShow = selection.filter(item => item.dining.tableCount > 0)
            console.log('selection' + this.selection)
            console.log('selectionShow' + this.selectionShow)

            this.dialogVisible = true
        },
        closeDialog () {
            // this.ruleForm = {
            //     attendeeId: null,
            //     attendeeName: null,
            //     attendeePhone: null,
            //     attendees: null,
            //     description: null,
            //     sex: null,
            //     position: null,
            //     organizationName: null,
            //     typeStr: null,
            //     tableNo: null
            // }
            // this.nameDisabled = false
            // this.$refs['ruleForm'].resetFields()
            // this.$emit('closeDialog', null)
            // getConferenceId()
            this.dialogVisible = false
        },
        insert () {
            // if (this.tableNo.some(item => {
            //     return item === '' || item === null
            // })) {
            //     this.$message("请选择桌号")
            //     return;
            // }
            // if (this.tableNo.length !== this.selectionShow.length) {
            //     this.$message("请选择桌号")
            //     return;
            // }
            // if (this.tableNo.some(item => {
            //     return item === '' || item === null
            // })) {
            //     this.$message("请选择桌号")
            //     return;
            // }

            // if (1) {
            //     console.log(this.tableNo)
            //     return
            // }
            var param = []
            var a = [];//用于存放选了桌号的任务
            this.tableNo.forEach((item, index) => {
                if (item.indexOf('-') !== -1) {
                    var arr = item.split('-');
                    param.push({ 'taskId': arr[1], 'tableNo': arr[0] })
                    a.push(arr[1])
                }
            });
            this.selection.forEach(item => {
                if (a.indexOf(item.id + '') === -1) {
                    param.push({ 'taskId': item.id, 'tableNo': '' })
                }
            })
            this.$emit('insert', param)

        }
    }
}
</script>
<style lang="scss" scoped>
.width360 {
    width: 330px;
}
.tianjiahuiyizuzhiClass {
    width: 74px;
    height: 32px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #1e89ff;
}

// ::v-deep .el-drawer__header span:focus {
//     outline: 0 !important;
// }
</style>
