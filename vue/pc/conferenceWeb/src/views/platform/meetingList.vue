<template>
    <div class="caedback" style="height:100%">
        <div>
            <el-button type="primary" class="creat" @click="createConference">
                +创建会议活动
            </el-button>
        </div>
        <div class="heightpos">
            <el-row style="padding-bottom:10px">
                <el-col :span="5">
                    <span class="inputtitle">会议名称</span><el-input v-model.trim="pageInfo.nameLike" placeholder="" style="width:120px" class="inputcontent" />
                </el-col>
                <el-col :span="5">
                    <span class="inputtitle">会议地点</span><el-input v-model.trim="pageInfo.stationLike" placeholder="" style="width:120px" class="inputcontent" />
                </el-col>
                <el-col :span="6">

                    <span class="inputtitle" style="width:7%">会议状态</span>
                    <el-select
                        v-model="pageInfo.conferenceStatusEqual"
                        style="width:73%"
                        collapse-tags
                        placeholder="全部"
                        multiple
                        clearable
                    >
                        <el-option :key="1" label="未发布" :value="1" />
                        <el-option :key="2" label="未开始" :value="2" />
                        <el-option :key="3" label="进行中 " :value="3" />
                        <el-option :key="4" label="已结束" :value="4" />
                        <el-option :key="5" label="已取消" :value="5" />
                        <!-- 1未发布 2未开始 3进行中 4已结束 5已取消 -->
                    </el-select>
                </el-col>
                <el-col :span="7">
                    <span class="inputtitle">会议时间</span><el-date-picker
                        v-model="inputTimes"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right"
                        class="inputcontent"
                        style="width:215px;margin-left:5px"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :editable="false"
                    />
                </el-col>
                <el-col :span="1">
                    <el-button type="primary" @click="getList">查询</el-button>
                    <!-- <el-button>重置</el-button> -->
                </el-col>
                <!-- <el-col :span="2" style="text-align: right">
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            <i class="el-icon-arrow-down el-icon--right" />展开
                        </span>
                    </el-dropdown>
                </el-col> -->
                <!-- <el-col :span="12" style="text-align: right;">
                    <el-link type="primary" class="titlelink">更多>></el-link>
                </el-col> -->
            </el-row>
        </div>
        <div class="tablediv tablediv2">
            <el-table
                :data="tableData"
                stripe
                style="width: 100%"
                height="100%"
            >
                <el-table-column
                    label="会议名称"
                    min-width="120"
                >
                    <template slot-scope="scope">
                        <el-link type="primary" @click="goDetail(scope.row)">{{ scope.row.name }}</el-link>
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    label="会议类型"
                >
                    <template slot-scope="scope">
                        <p>{{ scope.row.typeStr }}</p>
                    </template>
                </el-table-column> -->
                <!-- <el-table-column
                    label="主办方"
                >
                    <template slot-scope="scope">
                        <p>{{ scope.row.name }}</p>
                    </template>
                </el-table-column> -->
                <el-table-column
                    label="会议状态"
                    width="80"
                >
                    <template slot-scope="scope">
                        <p>{{ formatTableCellData(scope.row.conferenceStatusStr) }}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    label="会议地点"
                >
                    <template slot-scope="scope">
                        <p>{{ formatTableCellData(scope.row.station) }}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    label="会议时间"
                    width="250"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.startTime !== null && scope.row.startTime.length >= 17 ? scope.row.startTime.substr(0,16) : scope.row.startTime }}</span>
                        {{ scope.row.startTime !== null && scope.row.startTime !== '' ? '~' : '-' }} <span>{{ scope.row.endTime !== null && scope.row.endTime.length >= 17 ? scope.row.endTime.substr(0,16) : scope.row.endTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="goDetail(scope.row)">
                            查看详情
                        </el-button>

                        <!-- <el-link type="primary" >{{ scope.row.name }}</el-link> -->
                        <!-- <el-button
                            v-if="scope.row.status === 0"
                            size="mini"
                            @click="fabu(scope.row)"
                        >发布</el-button>
                        <el-button
                            v-if="scope.row.status === 1"
                            :disabled="panduanshifoudayudangqianshijian(scope.row.startTime)"
                            size="mini"
                            @click="quxiaofabu(scope.row)"
                        >取消发布</el-button>
                    </template> -->
                    </template></el-table-column>
            </el-table>
        </div>
        <ConferenceTemplate :dialog-visible="dialogVisible" @closeDialog="closeDialog" />
    </div>
</template>

<script>
import { getList } from '@/api/conference'
import { setConferenceId, setConferenceTemplate } from '@/utils/conference-auth'
import { getView } from '@/api/conference'
import { fabu, cancel } from '@/api/conference'
import ConferenceTemplate from '@/views/meetingMage/creatMeeting/conferenceTemplate'
// import { formatTableCellData } from '@/utils/index'
export default {
    components: {
        ConferenceTemplate
    },
    data() {
        return {
            dialogVisible: false,
            pageInfo: {
                conferenceStatusEqual: [2, 3],
                nameLike: null,
                pageNum: 1,
                total: 0
                // pageSize: 10
            },
            tableData: [],
            inputMeetingName: '',
            inputMeetingState: '',
            inputTimes: []
        }
    },
    computed: {
        cachedViews() {
            return this.$store.state.tagsBar.cachedViews
        },
        key() {
            return this.$route.fullPath
        }
    },
    created() {
        this.getList()
    },
    methods: {
        closeDialog(val) {
            if (val !== null) {
                setConferenceTemplate(val)
                // this.getConferenceTemplate()
                this.$router.push({
                    path: '/meetingCreate/create',
                    query: {
                        conferenceTemplate: val
                    }
                })
            }
            this.dialogVisible = false
        },
        // formatTableCellData(val) {
        //     return formatTableCellData(val)
        // },
        panduanshifoudayudangqianshijian(val) {
            if (val === null || val === '') {
                return true
            }
            var date = new Date(val)
            if (date.getTime() <= new Date().getTime()) {
                return true
            }
            return false
        },
        createConference() {
            setConferenceId('')
            setConferenceTemplate('')
            this.dialogVisible = true
            // this.$router.push({
            //     path: '/meetingCreate/create'
            // })
        },
        handleSizeChange(val) {
            if (this.inputTimes !== null && this.inputTimes.length === 2) {
                this.pageInfo.startTime = this.inputTimes[0]
                this.pageInfo.endTime = this.inputTimes[1]
            } else {
                this.pageInfo.startTime = null
                this.pageInfo.endTime = null
            }
            this.pageInfo.pageSize = val
            getList(this.pageInfo).then(response => {
                this.tableData = response.result.list
                this.pageInfo.total = response.result.total
            })
        },
        handleCurrentChange(val) {
            if (this.inputTimes !== null && this.inputTimes.length === 2) {
                this.pageInfo.startTime = this.inputTimes[0]
                this.pageInfo.endTime = this.inputTimes[1]
            } else {
                this.pageInfo.startTime = null
                this.pageInfo.endTime = null
            }
            this.pageInfo.pageNum = val
            getList(this.pageInfo).then(response => {
                this.tableData = response.result.list
                this.pageInfo.total = response.result.total
            })
        },
        getList() {
            if (this.inputTimes !== null && this.inputTimes.length === 2) {
                this.pageInfo.startTime = this.inputTimes[0]
                this.pageInfo.endTime = this.inputTimes[1]
            } else {
                this.pageInfo.startTime = null
                this.pageInfo.endTime = null
            }
            this.pageInfo.pageNum = 1
            getList(this.pageInfo).then(response => {
                this.tableData = response.result.list
                this.pageInfo.total = response.result.total
            })
        },
        goDetail(item) {
            setConferenceId(item.id)

            getView({ 'id': item.id }).then(res => {
                if (res.success) {
                    setConferenceTemplate(res.result.conferenceTemplate)
                }
            })

            this.$router.push(`/meeting/update`)
        },
        fabu(val) {
            fabu({ 'id': val.id }).then(res => {
                if (res.success) {
                    this.$message('发布成功')
                    this.getList()
                }
            })
        },
        quxiaofabu(val) {
            cancel({ 'id': val.id }).then(res => {
                if (res.success) {
                    this.$message('取消成功')
                    this.getList()
                }
            })
        }
    }
}
</script>

<style scoped>
    .caedback {
        background-color: #FAFAFA;
        padding: 20px;
        padding-top: 10px;
        position: relative;
    }
    .cardtitle {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191F24;
        line-height: 21px;
    }
    .cardtitlered {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #EA340F;
        line-height: 21px;
    }
    .titlelink {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #1E89FF;
        line-height: 18px;
    }
    .tablediv {
        position: absolute;
        top:100px;
        bottom: 15px;
        left: 20px;
        right: 20px;
    }
    .creat {
        background: linear-gradient(225deg, #1FDDFF 0%, #0062FF 100%);
        border-radius: 4px;
        width: 150px;
        height: 38px;
        font-size: 15px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        /* line-height: 38px; */
        text-align: center;
        margin-bottom: 10px;
        border:none;
    }
    .inputcontent {
        background: #FFFFFF;
        margin-left: 15px;
    }
    .inputtitle {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(25, 31, 36, 0.64);
        line-height: 16px;
    }
    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }
    .el-dropdown {
        padding-top: 5px;
    }
</style>

<style>
    .el-main {
        height: 100%;
    }

</style>
