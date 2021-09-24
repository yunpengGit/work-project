<template>
    <div class="audit-container">
        <el-drawer
        ref="drawer"
        :title="title"
        :before-close="closeDialog"
        :visible.sync="isdialog"
        direction="rtl"
        class="audit-container"
        custom-class="demo-drawer"
        size="40%"
        append-to-body
    >
        <el-form
            ref="form"
            size="small"
            :model="form"
            :rules="rules"
            :label-position="'left'"
            label-width="110px"
            :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto'}"
        >
                <el-form-item label="审核人类型" prop="auditType"   style="margin-left:30px">
                    <el-radio-group v-model="form.auditType" style="display:flex;">
                        <el-radio :label="1" style="margin-top:5px">
                            会务组
                        </el-radio>
                        <br>
                        <el-radio :label="2" style="margin-top:5px">
                            上级领导
                        </el-radio>
                    </el-radio-group>
                    <ul class="content">
                        <li>
                            会务组：由本场会议的会务组管理员或组长审核
                        </li>
                        <li>
                            上级领导：通过OA递交公司领导审核
                        </li>
                    </ul>
                </el-form-item>

                <el-form-item label="审核角色" prop="roleId" style="margin-left:30px" v-if="form.auditType===1">
                    <el-select
                        style="width:80%"
                        v-model="form.roleId"
                        filterable
                        placeholder="请选择审核角色"
                        :loading="loading"
                        @change="reviewTheRoleChange"
                    >
                        <el-option
                            v-for="item in reviewTheRoleOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="审核人" prop="userId" style="margin-left:30px" v-if="form.auditType===1">
                        <el-select v-model="form.userId" style="width:80%" placeholder="请选择审核人" clearable filterable>
                            <el-option
                            v-for="item in ApproverOptions"
                            :key="item.userId"
                            :label="item.userName"
                            :value="item.userId"
                        >
                        </el-option>
                            <!-- <el-option label="全部" value="" />
                            <el-option :key="0" label="非专享" value="0" />
                            <el-option :key="1" label="专享" value="1" /> -->

                        </el-select>
                    </el-form-item>
                  <el-form-item label="审核流程" prop="templateId" style="margin-left:30px" v-if="form.auditType===2">
                     <el-select
                        v-model="form.templateId"
                        style="width:80%"
                        filterable
                        placeholder="审批流程"
                        :loading="loading"
                        @change="changeAttendee"
                    >
                        <el-option
                            v-for="item in approvalProcessOptions"
                            :key="item.templateId"
                            :label="item.templateName"
                            :value="item.templateId"
                        >
                        </el-option>
                    </el-select>

                </el-form-item>
                <el-form-item label="备注" prop="remark" style="margin-left:30px">
                    <el-input
                        v-model="form.remark"
                        style="width: 80%"
                        type="textarea"
                        :rows="4"
                        show-word-limit
                        maxlength="300"
                    />
                </el-form-item>

            <!-- </el-scrollbar> -->

        </el-form>
        <div
            class="demo-drawer__footer"
            style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD"
        >
            <el-button style="height:32px;margin-top:12px" @click="closeDialog">取 消</el-button>
            <el-button
                type="primary"
                :loading="loading"
                style="height:32px;margin-top:12px"
                @click="insert"
            >确认选择</el-button>
        </div>

    </el-drawer>
    </div>
</template>

<script>
import { roomTaskInsert } from '@/api/hotel'
import { getTableHeight, formatPhone } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'
import { getList } from '@/api/conferenceGroupRole'
import { getTemplateList } from '@/api/oaFlow'
import { getapprovalProcessList,auditSubmit} from "@/api/conferenceGroupUser"
export default {
    name: '',
    // import引入的组件需要注入到对象中才能使用
    // 例如：import 《组件名称》 from '《组件路径》';
    props: {
      isdialog:{
          type:Boolean,
          default:false
      },
      title:{
          type:String,
          default:'选择审核人'
      },
      type:{
          type:Number,
          default:1
      },
      businessIds:{
        type:Array,
        default:()=>{
          return [];
        }
      },
      businessFlag:{
          type:Number,
          default:null
      }

    },
    data() {
        // 这里存放数据
        return {
            auditType:1,
            loading:false,
            reviewTheRoleOptions:[],
            dialogHeight: getTableHeight(35) + 'px',
            tableHeight: getTableHeight(250),
            form:{
                auditType:1,
                businessIds:[],
                remark:'',
                roleId:'',
                templateId:'',
                templateName:'',
                type:'',
                userId:'',
                businessFlag:null
            },
            rules: {
                auditType: [{ required: true, message: '请选择审核人类型', trigger: 'blur' }],
                roleId: [{ required: true, message: '请选择审核名角色', trigger: 'blur' }],
                userId: [{ required: true, message: '请选择审核人', trigger: 'blur' }]
            },
            approvalProcessOptions:[],
            ApproverOptions:[]
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {
        businessIds:{
            handler:function(newData){
                console.log(newData,'newData')
                this.form.businessIds=newData
            },
            deep:true
        }
    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.reviewTheRoleList()
        this.approvalProcessList()
        this.form.type=this.type
    },
    // 这里存放数据
    beforeCreate() {
    },
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
    // 方法集合
    methods: {
        // 打开对话框
        showEdit(row) {
            if (!row) {
                this.$message('打开异常')
                return
            } else {
                this.title = '添加住宿人员'
                this.roomId = row.roomId
                this.maxEndTime = row.endDate
                this.maxStartTime = row.startDate
                // this.getAttendeeInRoomList();
            }
            this.dialog = true
        },
        //审核角色列表
        reviewTheRoleList(){
            getList({conferenceId: getConferenceId(),taskPublishAuditFlag:0}).then((res)=>{
                this.reviewTheRoleOptions=res.result.list
                // console.log(res.result.list,"审核角色")
            })
        },
        //审批人发生变化
        reviewTheRoleChange(vld){
            this.getApproverList(vld)
        },
        //审批人列表
        getApproverList(vld){
            getapprovalProcessList({conferenceGroupRoleId:vld,conferenceId: getConferenceId(),}).then((res)=>{
                this.ApproverOptions=res.result.list
                console.log(res,"审批人列表")
            })
        },
        //审批流程列表
        approvalProcessList() {
            getTemplateList().then(res => {
                this.approvalProcessOptions = res.result
            })
        },
        changeAttendee(vld) {
            let obj = {};
            obj = this.approvalProcessOptions.find((item)=>{ //这里的Data就是上面遍历的数据源
            return item.templateId === vld; //筛选出匹配数据
            });
            this.form.templateName = obj.templateName;
        },

        closeDialog() {
            this.form={
                auditType:1,
                businessIds:[],
                remark:'',
                roleId:'',
                templateId:'',
                templateName:'',
                type:this.type,
                userId:'',
                businessFlag:null
            }
            console.log(this.form,'form')
            this.$emit('closeDialog')
            this.resetForm('form')
            // this.options = []
            // this.$emit('getListInfo')
            // this.dialog = false
        },
        resetForm(form) {
            this.$refs[form].resetFields()
            // this.attendeeIdList = []
            this.ApproverOptions = []
            this.form.userId = ''
        },

        insert() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.form.businessFlag=this.businessFlag
                    auditSubmit({...this.form,conferenceId: getConferenceId()}).then((res)=>{
                        if(res.code===2000){
                            this.$message.info('操作成功')
                            this.$emit('closeDialog')
                            this.resetForm('form')
                            this.form={
                                auditType:1,
                                businessIds:[],
                                remark:'',
                                roleId:'',
                                templateId:'',
                                templateName:'',
                                type:this.type,
                                userId:'',
                                businessFlag:null
                            }
                        }
                    })
                }
            })
        },

        remoteMethod(query) {
            // if (query !== null && query.length > 1) {
            //     var dataTemp = {
            //         attendeeNameLike: query,
            //         attendeeRoleFlagEqual: [0, 1, 2, 3, 4],
            //         resFlag: 2,
            //         signStatusEqual: [3],
            //         conferenceId: getConferenceId()
            //     }

            //     getList(dataTemp).then(res => {
            //         if (res.success) {
            //             this.options = res.result.list
            //         }
            //     })
            // } else {
            //     this.options = []
            // }
        }

    }
}
</script>
<style lang='scss' scoped>
::v-deep :focus {
    outline: 0;
}

.el-tag + .el-tag {
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.audit-container ::v-deep {
    .el-form-item__label {
        text-align: right;
    }
    .content {
        padding-top: 20px;
         li {
            color: #999;
            line-height: 22px;
         }
    }
    .el-radio {
        line-height: 23px;
    }
}



</style>
