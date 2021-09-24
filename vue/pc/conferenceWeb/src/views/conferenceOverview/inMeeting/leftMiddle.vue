<template>
    <div class="daibanshixiangbk" style="height:100%">
        <div class="heightpos">
            <el-row style="padding-bottom:10px">
                <el-col :span="12">
                    <span class="cardtitle">待办事项</span>
                    &nbsp;
                    <span class="cardtitlered">
                        ({{ count }})
                    </span>
                </el-col>
                <el-col :span="12" style="text-align: right;">
                    <el-link type="primary" class="titlelink" @click="gengduo">更多>></el-link>
                </el-col>
            </el-row>
        </div>
        <div class="tablediv table-xiao">
            <el-table :data="tableData" stripe style="width: 100%" height="100%">
                <el-table-column prop="todoTitle" label="标题" min-width="120" />
                <el-table-column prop="conferenceName" :label="getConferenceTemplate(1) + '名称'" align="center" />
                <el-table-column prop="createUserName" label="发起人" align="center" />
                <el-table-column prop="createTime" label="接收时间" min-width="100" />
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" @click.native.prevent="view(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { getConferenceId } from '@/utils/conference-auth'
import { getTaskList } from '@/api/attendee'

export default {
    data() {
        return {
            tableData: [],
            count: 0
        }
    },
    created() {
        this.getList()
    },
    methods: {
        gengduo() {
            this.$router.push({
                path: `/meetingCreate/todoWorkList/${getConferenceId()}`
            })
        },
        view(val) {
            // if (val.type === 1) {
            //     this.$router.push({
            //         path: `/signupManagement/attendeeView/${val.attendeeId}`
            //     })
            // }

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
        },
        getList() {
            getTaskList({
                'conferenceId': getConferenceId(), statusFlag: 1, sortName: 'attendeetask.level desc, attendeetask.createTime',
                sortStatus: 'desc'
            }).then(res => {
                this.tableData = res.result.list
                if (res.result.list !== null) {
                    this.count = res.result.list.length
                } else {
                    this.count = 0
                }
            })
        }

    }
}
</script>

<style scoped>
.daibanshixiangbk {
    background-color: #fafafa;
    padding: 10px;
    position: relative;
}
.cardtitle {
    /* font-size: 16px; */
    font-size: 1.3em;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #191f24;
    /* line-height: 21px; */
}
.cardtitlered {
    /* font-size: 16px; */
    font-size: 1.3em;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ea340f;
    /* line-height: 21px; */
}
.titlelink {
    /* font-size: 13px; */
    font-size: 1.1em;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #1e89ff;
    /* line-height: 18px; */
}
.tablediv {
    position: absolute;
    /* top:40px; */
    top: 18%;
    bottom: 10px;
    left: 10px;
    right: 10px;
}
.el-table--enable-row-transition .el-table__body td {
    padding-top: 110px;
    padding-bottom: 110px;
}
.el-table--small {
    font-size: 1em;
}
.el-button--mini {
    font-size: 1em;
}
</style>
