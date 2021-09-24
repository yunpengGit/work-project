<template>
    <el-drawer ref="drawer" :title="title" :before-close="closeDialog" :visible.sync="dialog" direction="rtl"
        custom-class="demo-drawer" size="60%" append-to-body>

        <el-form ref="form" size="small" label-width="127px" v-loading="loading"
            :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto'}">
            <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">

                <div style="background-color: white;padding-left:20px;padding-top:20px;padding-right: 20px;">

                    <el-table ref="table" :data="attendeeInRoomList" style="width: 100%" :height="tableHeight"
                        :header-cell-style="{
                            background:'#f7f7f7'
                        }">
                        <el-table-column label="姓名" width="150px">
                            <template slot-scope="scope">
                                <div>
                                    <span
                                        :title="scope.row.attendee.fixAttributeCommonVO.attendeeName">{{ scope.row.attendee.fixAttributeCommonVO.attendeeName != null && scope.row.attendee.fixAttributeCommonVO.attendeeName.length > 4 ? scope.row.attendee.fixAttributeCommonVO.attendeeName.substr(0,4) + '...' : scope.row.attendee.fixAttributeCommonVO.attendeeName }}</span>

                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="性别">
                            <template slot-scope="scope">
                                {{ scope.row.attendee.fixAttributeCommonVO.sex ==="1" ? "男" : "女" }}
                            </template>
                        </el-table-column>

                        <el-table-column label="手机" width="160px">
                            <template slot-scope="scope">
                                <PhoneEncryption :value="scope.row.attendee.fixAttributeCommonVO.phone" />
                                <!-- <div>
                                    <span>{{ formatPhone(scope.row.attendee.fixAttributeCommonVO.phone) }}</span>
                                    <span
                                        style="display:none"
                                    >{{ scope.row.attendee.fixAttributeCommonVO.phone }}</span>
                                    <el-button
                                        icon="el-icon-view"
                                        type="text"
                                        @click="(event) => qiehuanshoujijiami(event)"
                                    />
                                </div> -->
                            </template>
                        </el-table-column>

                        <el-table-column label="入住时间" width="180px">
                            <template slot-scope="scope">
                                <div>
                                    {{ scope.row.roomTaskShow.startDate }}~{{ scope.row.roomTaskShow.endDate }}
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column label="单位名称">
                            <template slot-scope="scope">
                                <div>
                                    {{ scope.row.attendee.fixAttributeCommonVO.organizationSortName === null || scope.row.attendee.fixAttributeCommonVO.organizationSortName === '' ? scope.row.attendee.fixAttributeCommonVO.organizationName : scope.row.attendee.fixAttributeCommonVO.organizationSortName }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="handleDeleteWithConfirm(scope.$index, scope.row)">移除
                                </el-button>
                            </template>
                        </el-table-column>

                    </el-table>

                </div>

            </el-scrollbar>

        </el-form>

    </el-drawer>
</template>

<script>
import { getAttendeeInRoomList, deleteAttendeeInRoom } from '@/api/hotel'
import { getList } from '@/api/attendee'
import { getTableHeight, formatPhone, getSubtDate } from '@/utils/index'
import { telephoneValid } from '@/utils/valid-common.js'
import { getConferenceId } from '@/utils/conference-auth'
import PickAttendee from '@/views/attendee/components/pickAttendee'

export default {
    name: '',
    components: { PickAttendee },
    // import引入的组件需要注入到对象中才能使用
    // 例如：import 《组件名称》 from '《组件路径》';
    props: {

    },
    data () {
        // 这里存放数据
        return {
            attendeeInRoomList: [],
            attendeeList: [],
            conferenceId: getConferenceId(),
            roomId: '',
            title: '',
            dialog: false,
            pickDialogVisible: false,
            dialogHeight: getTableHeight(35) + 'px',
            tableHeight: getTableHeight(250),
            loading: false,
            maxStartTime: '',
            maxEndTime: '',
            loading: false

        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {},
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

        handleDeleteWithConfirm (index, row) {
            this.$confirm('请确认是否移除该' + this.getConferenceTemplate(2) + '', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.handleDelete(index, row)
            }).catch(() => { })
        },

        // 表格中删除直接接触人员与房间关系
        handleDelete (index, item) {
            //  this.attendeeList.splice(index, 1)
            // this.attendeeInRoomList.splice(index, 1)

            deleteAttendeeInRoom({
                'roomId': this.roomId, 'attendeeId': item.attendee.fixAttributeCommonVO.attendeeId,
                'startDate': item.roomTaskShow.startDate, 'endDate': item.roomTaskShow.endDate
            }).then(res => {
                if (res.success) {
                    this.$message('操作成功')
                    this.getAttendeeInRoomList()
                }
            })
        },
        getAttendeeInRoomList () {
            this.loading = true
            getAttendeeInRoomList({ 'conferenceId': this.conferenceId, 'roomId': this.roomId, 'startDate': this.maxStartTime, 'endDate': this.maxEndTime }).then(res => {
                if (res.success) {
                    this.attendeeInRoomList = res.result.list
                    // this.attendeeInRoomList.forEach(item => {
                    //     // item.endDate = getSubtDate(item.endDate, 0)
                    //     item.roomTaskShow.endDateStr = getSubtDate(item.roomTaskShow.endDate, 0)
                    // })
                    this.$emit('getListInfo')
                }
                this.loading = false
            })
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

        showView (row) {
            if (!row) {
                this.$message('打开异常')
                return
            } else {
                this.title = '查看住宿人员'
                this.roomId = row.roomId
                this.maxEndTime = row.endDate
                this.maxStartTime = row.startDate
                this.getAttendeeInRoomList()
            }
            this.dialog = true
        },

        closeDialog () {
            this.dialog = false
            this.$emit('getListInfo')
            this.attendeeInRoomList = []
            this.loading = false
        }

    }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类

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
