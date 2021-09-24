<template>
    <el-drawer
        ref="drawer"
        :title="title"
        :before-close="closeDialog"
        :visible.sync="dialog"
        direction="rtl"
        custom-class="demo-drawer"
        size="40%"
        append-to-body
    >

        <el-form
            ref="ruleForm"
            size="small"
            :model="ruleForm"
            label-width="127px"
            :rules="rules"
            :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto'}"
        >
            <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                <el-form-item label="入住时间" prop="doubleTime">
                    <el-date-picker
                        v-model="ruleForm.doubleTime"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        :picker-options="doubleTimeOptions"
                        range-separator="-"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        placeholder="选择时间范围"
                        size="small"
                        style="width:80%"
                    />
                </el-form-item>

                <el-form-item label="房间使用方式" prop="oneself">
                    <el-radio-group v-model="ruleForm.oneself" style="margin-left:30px">
                        <el-radio :label="1">
                            单住(当前时间段内，该房间无法再分配给他人)
                        </el-radio>
                        <br>
                        <el-radio :label="0" style="margin-top:5px">
                            合住
                        </el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="入住人姓名" prop="attendeeId">
                    <el-select
                        v-model="ruleForm.attendeeId"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="入住人姓名"
                        :remote-method="remoteMethod"
                        :loading="loading"
                        style="width:80%"
                        @change="changeAttendee"
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.fixAttributeCommonVO.attendeeName"
                            :value="item.id"
                        >
                            <span style="float: left">{{ item.fixAttributeCommonVO.attendeeName }}</span>
                            <span style="float: left">{{ '(' + item.fixAttributeCommonVO.phone + ')' }}</span>
                            <!-- <span style="float: left">{{ item.fixAttributeCommonVO.position }}</span> -->
                            <span style="float: right; color: #8492a6; font-size: 13px">
                                {{ item.fixAttributeCommonVO.position !== null && item.fixAttributeCommonVO.position.length > 8 ? ("(" + item.fixAttributeCommonVO.position.substr(0,7) + '...)') : (item.fixAttributeCommonVO.position !== null && item.fixAttributeCommonVO.position !== '' ? ('(' + item.fixAttributeCommonVO.position + ')') : '') }}
                            </span>
                            <span style="float: right; color: #8492a6; font-size: 13px">
                                {{ formatOrgName(item.fixAttributeCommonVO.organizationSortName, item.fixAttributeCommonVO.organizationName, 5) }}
                            </span>
                        </el-option>
                    </el-select>

                </el-form-item>
                <el-form-item label="入住人手机号" prop="attendeePhone">
                    <el-input
                        v-model="ruleForm.attendeePhone"
                        style="width:80%"
                        show-word-limit
                        maxlength="11"
                        disabled
                    />
                </el-form-item>

                <!-- <el-form-item style="margin-left:30px">
                    <el-button type="primary" :loading="loading" @click="onSubmit('form')">添加</el-button>
                </el-form-item> -->

            </el-scrollbar>

        </el-form>
        <div
            class="demo-drawer__footer"
            style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD"
        >
            <el-button style="height:32px;margin-top:12px" @click="closeDialog">取 消</el-button>
            <el-button
                type="primary"
                :disabled="attendeeIdList === null || attendeeIdList.length === 0"
                :loading="loading"
                style="height:32px;margin-top:12px"
                @click="insert"
            >保存</el-button>
        </div>

    </el-drawer>
</template>

<script>
import { roomTaskInsert } from '@/api/hotel'
import { getList } from '@/api/attendee'
import { getTableHeight, formatPhone } from '@/utils/index'
import { getConferenceId } from '@/utils/conference-auth'

export default {
    name: '',
    // import引入的组件需要注入到对象中才能使用
    // 例如：import 《组件名称》 from '《组件路径》';
    props: {

    },
    data() {
        // 这里存放数据
        return {
            ruleForm: {
                doubleTime: [],
                startDate: '',
                endDate: '',
                oneself: 1,
                attendeeId: null
            },
            attendeeIdList: [],
            options: [],
            roomId: '',
            title: '',
            dialog: false,
            pickDialogVisible: false,
            dialogHeight: getTableHeight(35) + 'px',
            tableHeight: getTableHeight(250),
            loading: false,
            maxStartTime: '',
            maxEndTime: '',
            rules: {
                doubleTime: [
                    { required: true, message: '请选择入住时间', trigger: 'blur' }
                ],
                attendeeId: [{ required: true, message: '请输入' + this.getConferenceTemplate(2) + '名称', trigger: 'blur' }]

            },
            doubleTimeOptions: {
                disabledDate: (time) => {
                    return time.getTime() < (new Date(this.maxStartTime).getTime() - 24 * 60 * 60 * 1000) ||
                        time.getTime() > (new Date(this.maxEndTime).getTime())
                }
            }
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {
        dialog() {
            this.options = []
        },
        'ruleForm.doubleTime': {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.ruleForm.startDate = newVal[0]
                    this.ruleForm.endDate = newVal[1]
                } else {
                    this.ruleForm.startDate = ''
                    this.ruleForm.endDate = ''
                }
            },
            deep: true,
            immediate: true
        }

    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

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

        changeAttendee(val) {
            if (this.options !== null) {
                this.options.forEach(item => {
                    if (item.id === val) {
                        this.ruleForm.attendeePhone = item.fixAttributeCommonVO.phone
                        this.attendeeIdList.push(item.id)
                    }
                })
            } else {
                this.attendeeIdList = []
            }
        },

        closeDialog() {
            this.resetForm('ruleForm')
            this.options = []
            this.$emit('getListInfo')
            this.dialog = false
        },

        resetForm(form) {
            this.$refs[form].resetFields()
            this.attendeeIdList = []
        },

        insert() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    if (this.ruleForm.startDate === this.ruleForm.endDate) {
                        this.$message('入住时间至少为一天')
                        return
                    }
                    this.loading = true
                    var params = {
                        'attendeeIdList': this.attendeeIdList,
                        'conferenceId': getConferenceId(),
                        'endDate': this.ruleForm.endDate,
                        'startDate': this.ruleForm.startDate,
                        'oneself': this.ruleForm.oneself,
                        'roomId': this.roomId
                    }
                    console.log(params)
                    roomTaskInsert(params).then(res => {
                        if (res.success) {
                            this.$message('操作成功')
                            this.closeDialog()
                        }
                        this.loading = false
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },

        remoteMethod(query) {
            if (query !== null && query.length > 1) {
                var dataTemp = {
                    attendeeNameLike: query,
                    attendeeRoleFlagEqual: [0, 1, 2, 3, 4],
                    resFlag: 2,
                    signStatusEqual: [3],
                    conferenceId: getConferenceId()
                }

                getList(dataTemp).then(res => {
                    if (res.success) {
                        this.options = res.result.list
                    }
                })
            } else {
                this.options = []
            }
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
</style>
