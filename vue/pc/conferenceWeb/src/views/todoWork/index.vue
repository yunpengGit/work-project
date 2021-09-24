<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:8px">
        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form :inline="true" :model="pageInfo">
                    <el-form-item label="任务类别">
                        <el-select
                            v-model="pageInfo.typeEqual"
                            multiple=""
                            class="widthClass"
                            placeholder="全部"
                            clearable
                            collapse-tags
                        >
                            <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="任务状态">
                        <el-select v-model="pageInfo.statusFlag" class="widthClass" placeholder="全部" clearable>
                            <el-option :key="1" label="待办" :value="1" />
                            <el-option :key="2" label="已办" :value="2" />
                        </el-select>
                    </el-form-item>

                    <el-form-item style="float: right">
                        <el-button type="primary" @click="search">查询</el-button>
                        <el-button @click="resetSearch">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
            <el-table ref="table" :data="tableData" :height="tableHeight" style="width: 100%;">
                <el-table-column prop="todoTitle" label="标题" min-width="120" />
                <el-table-column prop="conferenceName" label="会议名称" align="center" />
                <el-table-column prop="createUserName" label="发起人" align="center" />
                <el-table-column prop="createTime" label="接收时间" min-width="100" />
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" @click.native.prevent="view(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page-wrapper">
                <el-pagination
                    :current-page="pageInfo.pageNum"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageInfo.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageInfo.total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </div>
        <TaskView :dialog-visible="dialogVisible" :task-id="taskId" @closeDialog="closeDialog" />
    </div>
</template>

<script>
import { getTableHeight } from '@/utils/index'
import { getConferenceId, setConferenceId, setConferenceTemplate } from '@/utils/conference-auth'
import { getTaskList } from '@/api/attendee'
import TaskView from './taskView'
import { getView } from '@/api/conference'
export default {
    name: 'TodoWork',
    components: {
        TaskView
    },
    props: {
    },
    data() {
        return {
            dialogVisible: false,
            taskId: null,
            typeList: [
                { id: 1, name: '报名审核' },
                { id: 2, name: '报名变更审核' },
                { id: 3, name: '取消报名' },
                { id: 4, name: '行程变更' },
                { id: 5, name: '请假' },
                { id: [61, 62, 63], name: '用车资源分配' },
                { id: 51, name: '用餐资源分配' },
                { id: 52, name: '住宿资源分配' },
                { id: 53, name: '制证资源分配' }
            ],
            tableHeight: getTableHeight(125),
            conferenceId: getConferenceId(),
            tableData: [],
            pageInfo: {
                statusFlag: 1,
                pageNum: 1,
                pageSize: 10,
                total: 0,
                sortName: 'attendeetask.level desc, attendeetask.createTime',
                sortStatus: 'desc'
            }
        }
    },
    created() {
        this.search()
    },
    mounted() {
        document.getElementById('wodegongzuo').className = 'el-menu-item headerMenu is-active'
        document.getElementById('wodegongzuo').style = ''
        document.getElementById('gongzuotai').className = 'el-menu-item headerMenu'
        document.getElementById('shenjirizhi').className = 'el-menu-item headerMenu'
    },
    methods: {
        closeDialog() {
            this.dialogVisible = false
            this.taskId = null
        },
        openTaskView(val) {
            this.dialogVisible = true
            this.taskId = val
        },
        resetSearch() {
            this.pageInfo = {
                statusFlag: 1,
                pageNum: 1,
                pageSize: 10,
                total: this.pageInfo.total,
                sortName: 'attendeetask.level desc, attendeetask.createTime',
                sortStatus: 'desc'
            }
        },
        view(val) {
            if (val.status !== 1) {
                this.openTaskView(val.id)
            } else {
                setConferenceId(val.conferenceId)

                getView({ 'id': val.conferenceId }).then(res => {
                    if (res.success) {
                        setConferenceTemplate(res.result.conferenceTemplate)
                    }
                })
                if (val.type === 50 || val.type === 61 || val.type === 62 || val.type === 63) {
                    this.$router.push({ name: 'distribution', params: { sourceType: val.type }})
                    return
                }

                if (val.type === 51) {
                    this.$router.push({ name: 'diningDistribution', params: { sourceType: val.type }})
                    return
                }
                if (val.type === 52) {
                    this.$router.push({ name: 'hotelDistribution', params: { sourceType: val.type }})
                    return
                }
                if (val.type === 53) {
                    this.$router.push({ name: 'cardDistribution', params: { sourceType: val.type }})
                    return
                }
                this.$router.push({
                    path: `/attendeeManagement/attendee/check/${val.attendeeId}/${val.type}/${val.id}`
                })
            }

            // if (val.type === 1) {
            //     this.$router.push({
            //         path: `/signupManagement/attendeeView/${val.attendeeId}`
            //     })
            // }
        },
        getList() {
            if (this.$route.params.conferenceId !== null && this.$route.params.conferenceId !== '' && this.$route.params.conferenceId !== 0 && this.$route.params.conferenceId !== '0') {
                this.pageInfo.conferenceId = this.$route.params.conferenceId
                getTaskList(this.pageInfo).then(res => {
                    this.tableData = res.result.list
                    this.pageInfo.total = res.result.total
                })
            } else {
                getTaskList(this.pageInfo).then(res => {
                    this.tableData = res.result.list
                    this.pageInfo.total = res.result.total
                })
            }
        },
        search() {
            this.pageInfo.pageNum = 1
            this.getList()
        },
        handleCurrentChange(val) {
            this.pageInfo.pageNum = val
            this.getList()
        },
        handleSizeChange(val) {
            this.pageInfo.pageSize = val
            this.getList()
        }
    }
}
</script>
<style lang="scss" scoped>
.widthClass {
    width: 350px;
}
</style>
