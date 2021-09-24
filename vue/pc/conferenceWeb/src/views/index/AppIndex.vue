<template>
    <section class="app-main" style="height:75vh">
        <Header />
        <div class="content">
            <div class="left">
                <div class="indexHeader">
                    <!-- <ul class="numtype">
                        <li style="width:40px">
                            &nbsp;
                        </li>
                        <li style="width:45px">
                            <img src="@/assets/meetinging.svg" alt="" style="height:40px">
                        </li>
                        <li style="width:150px">
                            进行中的会议 18
                        </li>
                        <li style="width: 1px;height: 40px;background: rgba(25, 31, 36, 0.09);" />
                        <li>
                            <img src="" alt="">
                            未开始的会议 29
                        </li>
                    </ul> -->
                    <el-row style="padding-left:15px;">
                        <el-col :span="1" style="height:64px;">
                            <img src="@/assets/meetinging.svg" alt="" style="height:40px;margin-top:12px">
                        </el-col>
                        <el-col :span="4">
                            <span class="htitle">进行中的会议</span><span class="hcontent"> 18</span>
                        </el-col>
                        <!-- <el-col :span="1" style="height:64px;">
                            <span class="divide">&nbsp;</span>
                        </el-col> -->
                        <!-- <el-col :span="1">
                            <div style="background-color:yellow">
                                &nbsp;b
                            </div>
                        </el-col> -->
                        <el-col :span="1" style="height:64px;">
                            <img src="@/assets/meetingwill.svg" alt="" style="height:40px;margin-top:12px">
                        </el-col>
                        <el-col :span="4">
                            <span class="htitle">未开始的会议</span><span class="hcontent"> 29</span>
                        </el-col>
                        <el-col :span="14">
                            <button class="creat" @click="chuangjianhuiyi">+ 创建会议</button>
                        </el-col>
                    </el-row>
                    <!-- <button class="creat">+ 创建会议</button> -->
                </div>
                <!-- <div style="height:20px"></div> -->
                <div class="divmain">
                    <div class="inputdiv">
                        <el-row>
                            <el-col :span="5">
                                <span class="inputtitle">会议名称</span><el-input v-model.trim="pageInfo.queryParamterLike" placeholder="请输入会议名称" style="width:120px" class="inputcontent" />
                            </el-col>
                            <el-col :span="5">
                                <span class="inputtitle">会议状态</span><el-input v-model="inputMeetingState" placeholder="请输入会议状态" style="width:120px" class="inputcontent" />
                            </el-col>
                            <el-col :span="8">
                                <span class="inputtitle">会议时间</span><el-date-picker
                                    v-model="inputTime"
                                    type="datetimerange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    align="right"
                                    class="inputcontent"
                                    style="width:230px"
                                />
                            </el-col>
                            <el-col :span="4">
                                <el-button>重置</el-button>
                                <el-button type="primary" @click="getList">查询</el-button>
                            </el-col>
                            <el-col :span="2" style="text-align: right">
                                <el-dropdown>
                                    <span class="el-dropdown-link">
                                        <i class="el-icon-arrow-down el-icon--right" />展开
                                    </span>
                                </el-dropdown>
                            </el-col>
                        </el-row>
                    </div>
                    <div style="padding-top:20px;height:100%">
                        <el-table
                            :data="tableData"
                            stripe
                            style="width: 100%"
                            height="80%"
                        >
                            <el-table-column
                                label="会议名称"
                                width="280"
                            >
                                <template slot-scope="scope">
                                    <el-link type="primary" @click="goDetail(scope.row.name)">{{ scope.row.name }}</el-link>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="会议类型"
                                width="180"
                            >
                                <template slot-scope="scope">
                                    <p>{{ scope.row.name }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="主办方"
                                width="180"
                            >
                                <template slot-scope="scope">
                                    <p>{{ scope.row.name }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="会议状态"
                                width="180"
                            >
                                <template slot-scope="scope">
                                    <p>{{ scope.row.name }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="会议场所"
                                width="280"
                            >
                                <template slot-scope="scope">
                                    <p>{{ scope.row.name }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="会议时间"
                                width="180"
                            >
                                <template slot-scope="scope">
                                    <span>{{ scope.row.date }}</span>
                                    <br>
                                    <span>{{ scope.row.date }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center" fixed="right">
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        @click="handleEdit(scope.$index, scope.row)"
                                    >发布</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- <div style="height:15px" /> -->
                        <div style="float: right;padding-top:15px">
                            <el-pagination
                                :current-page="pageInfo.pageNum"
                                :page-sizes="[10, 20, 30, 40]"
                                :total="pageInfo.total"
                                layout="total, sizes, prev, pager, next, jumper"
                                :page-size="pageInfo.pageSize"
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                            />
                        </div>
                    </div>
                    <div style="height:25px" />
                </div>
            </div>
            <div class="right" style="height:100%">
                <div class="rightmain">
                    <!-- <el-calendar v-model="value" />
                    <div class="timeline">
                        <el-timeline :reverse="reverse">
                            <el-timeline-item
                                v-for="(activity, index) in activities"
                                :key="index"
                                :timestamp="activity.timestamp"
                            >
                                {{ activity.content }}
                            </el-timeline-item>
                        </el-timeline>
                    </div> -->
                    <DateAndTimeLine />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Header from '../../layout/components/Header'
import DateAndTimeLine from '@/views/common/dateAndTimeLine'
import { getList } from '@/api/conference'
export default {
    name: 'AppMain',
    components: {
        Header,
        DateAndTimeLine
    },
    data() {
        return {
            pageInfo: {
                queryParamterLike: null,
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            tableData: [],
            inputMeetingName: '',
            inputMeetingState: '',
            inputTime: ''
            // reverse: true,
            // activities: [{
            //     content: '活动按期开始',
            //     timestamp: '2018-04-15'
            // }, {
            //     content: '通过审核',
            //     timestamp: '2018-04-13'
            // }, {
            //     content: '创建成功',
            //     timestamp: '2018-04-11'
            // }]
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
        chuangjianhuiyi() {
            // this.$router.push({ path: '/index' })
            const routes = this.$router.resolve({ name: 'diningPlan', query: { productId: 1 }})
            window.open(routes.href, '_blank')
        },
        handleSizeChange(val) {
            this.pageInfo.pageSize = val
            getList(this.pageInfo).then(response => {
                this.tableData = response.result.list
                this.pageInfo.total = response.result.total
            })
        },
        handleCurrentChange(val) {
            this.pageInfo.pageNum = val
            getList(this.pageInfo).then(response => {
                this.tableData = response.result.list
                this.pageInfo.total = response.result.total
            })
        },
        getList() {
            getList(this.pageInfo).then(response => {
                this.tableData = response.result.list
                this.pageInfo.total = response.result.total
            })
        },
        goDetail(item) {
            this.$router.push(`/meeting/update`)
        }
    }
}
</script>
<style scoped>
.indexHeader{
    background: #fff;
    height:64px;
    /* display: flex; */
    /* justify-content: space-between; */
    /* align-items: center; */
    line-height: 64px;
    position: relative;
}
.indexHeader .numtype{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size:16px;
    color: #191F24;
}
.numtype li {
    width:239px;
    text-align: center;
}
.indexHeader .creat{
    width: 160px;
    height: 64px;
    background: linear-gradient(225deg, #55B0FF 0%, #0279FC 100%);
    border:none;
    font-size: 17px;
    color: #FFFFFF;
    float: right;
}
.content{
    margin-top:20px;
    display: flex;
    padding:0 20px;
    height: 100%;
}
.content .left{
    width:74% !important;
    min-width: 74%;
    height: 100%;
}
.divide {
        border-right-style: solid;
        border-right-width: 1px;
        border-right-color: #eff0f0;
        font-size: 30px;
    }
    .htitle {
font-size: 16px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: rgba(25, 31, 36, 0.64);
line-height: 22px;
    }
    .hcontent {
font-size: 22px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #191F24;
line-height: 28px;
    }
    .divmain {
        background-color: #FAFAFA;
        margin-top: 10px;
        padding:20px;
        /* height:70vh; */
        height: 100%;
    }
    .inputcontent {
background: #FFFFFF;
/* border-radius: 4px; */
/* border: 1px solid rgba(25, 31, 36, 0.24); */
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
  .rightmain {
      padding-left: 20px;
      height: 100%;
  }
  /* .timeline {
      padding: 20px;
      background-color: #fafafa;
  } */
</style>
<style>
.el-table th {
      background-color: #f5f5f5;
  }
  .el-table th.is-leaf, .el-table td {
      border:none;
  }
  .el-table thead {
font-size: 14px;
font-family: PingFangSC-Medium, PingFang SC;
font-weight: 500;
color: rgba(25, 31, 36, 0.8);
line-height: 18px;
  }
  .el-table .cell {
      line-height: 18px;
  }
  .el-table thead .cell {
      line-height: 32px;
  }
  .el-table--enable-row-transition .el-table__body td {
      padding-top: 3px;
      padding-bottom: 3px;
  }
  .el-table tr {
      background-color:#fafafa;
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
      background-color:#f5f5f5;
  }
  .el-table td div {
      font-size: 14px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: rgba(25, 31, 36, 0.64);
line-height: 18px;
  }
  /* .el-calendar-table .el-calendar-day {
      height: 58px;
  } */
  .el-table__fixed-right-patch {
      background-color: #f5f5f5;
  }
</style>
