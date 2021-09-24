<template>
  <div style="padding-left: 8px; padding-right: 8px; margin-top: 8px">
    <el-tabs v-model="activeName" class="tabs">
      <!-- @tab-click="handleClick" -->
      <el-tab-pane label="手动推送" name="hand"></el-tab-pane>
      <el-tab-pane label="系统推送" name="auto"></el-tab-pane>
    </el-tabs>
    <div v-show="activeName === 'auto'">
      <div class="clearfix">
        <div style="background-color: white; padding-left: 10px">
          <el-form :inline="true" :model="pageInfo">
            <el-form-item label="发送方式">
              <el-select
                v-model="pageInfo.tplScope"
                placeholder="全部"
                clearable
              >
                <el-option :key="0" label="IM" :value="0" />
                <el-option :key="1" label="短信" :value="1" />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="模板主题">
                        <el-select v-model="pageInfo.themeCode" style="width:250px" placeholder="全部" clearable>
                            <el-option
                                v-for="item in themeCodes"
                                :key="item.valCode"
                                :label="item.valName"
                                :value="item.valCode"
                            />
                        </el-select>
                    </el-form-item> -->
            <el-form-item style="float: right">
              <el-button type="primary" @click="search">查询</el-button>
              <el-button @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div style="background-color: #eef0f4; height: 8px; width: 100%" />
      <div
        style="
          background-color: white;
          padding-left: 10px;
          padding-top: 10px;
          padding-right: 10px;
        "
      >
        <div style="float: right; text-center: right; padding-bottom: 10px">
          <!--  -->
          <!-- <el-button
            v-permission="Global.buttons.MsgLog.sendNew"
            type="primary"
            @click="add"
            >发送新通知</el-button
          > -->
        </div>
        <el-table
          ref="table"
          :data="tableData"
          :height="
            tableHeight +
            (this.$store.state.menu.buttons.indexOf(
              Global.buttons.MsgLog.sendNew
            ) !== -1
              ? 0
              : 32)
          "
          style="width: 100%"
        >
          <!-- <el-table-column
                    type="selection"
                    width="55"
                /> -->
          <!-- width="250" -->
          <el-table-column prop="themeCodeStr" label="推送主题" />
          <!-- <el-table-column
                    prop="successCount"
                    label="发送方式"
                >
                    <template slot-scope="scope">
                        {{ scope.row.tplScope === 0 ? 'IM' : '短信' }}
                    </template>
                </el-table-column> -->
          <el-table-column prop="sendCount" label="推送人次" />
          <el-table-column prop="successCount" label="成功人次">
            <template slot-scope="scope">
              {{ scope.row.successCount !== null ? scope.row.successCount : 0 }}
            </template>
          </el-table-column>
          <el-table-column prop="failCount" label="失败人次">
            <template slot-scope="scope">
              {{ scope.row.failCount ? scope.row.failCount : 0 }}
            </template>
          </el-table-column>
          <el-table-column label="成功率">
            <template slot-scope="scope">
              {{
                calculationSuccessRange(
                  scope.row.successCount,
                  scope.row.sendCount
                )
              }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                v-permission="buttons.MsgLog.view"
                :disabled="scope.sendCount === 0"
                @click.native.prevent="view(scope.row)"
              >
                查看详情
              </el-button>
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
    </div>
    <div v-show="activeName === 'hand'">
      <!-- <div class="clearfix">
        <div style="background-color: white; padding-left: 10px">
          <el-form :inline="true" :model="pageInfo">
            <el-form-item label="发送方式">
              <el-select v-model="handTplScope" placeholder="全部" clearable>
                <el-option :key="0" label="IM" :value="0" />
                <el-option :key="1" label="短信" :value="1" />
              </el-select>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" @click="searchHandData">查询</el-button>
              <el-button @click="resetSearchHandData">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div> -->
      <div style="background-color: #eef0f4; height: 8px; width: 100%" />
      <div
        style="
          background-color: white;
          padding-left: 10px;
          padding-top: 10px;
          padding-right: 10px;
        "
      >
        <div style="float: right; text-center: right; padding-bottom: 10px">
          <el-button
            v-permission="Global.buttons.MsgLog.sendNew"
            type="primary"
            @click="add"
            >发送新通知</el-button
          >
        </div>
        <el-table
          ref="table"
          :data="handMsgTableData"
          :height="
            handTableHeight +
            (this.$store.state.menu.buttons.indexOf(
              Global.buttons.MsgLog.sendNew
            ) !== -1
              ? 0
              : 32)
          "
          style="width: 100%"
        >
          <el-table-column prop="themeCodeStr" label="推送主题" />
          <el-table-column prop="tplContent" label="推送内容 " />
          <el-table-column prop="receiveUserTypeStr" label="推送范围 " />
          <el-table-column prop="createUserName" label="申请人 " />
          <el-table-column prop="createTime" label="申请时间 " />
          <el-table-column label="审核状态">
            <template slot-scope="scope">
              <span v-if="scope.row.verifyStatus === 1">审核通过</span>
              <span v-else-if="scope.row.verifyStatus === 0" style="color:#3399ff;"
                >待审核</span
              >
              <span v-else style="color: red">审核不通过</span>
            </template>
          </el-table-column>
          <el-table-column prop="msgTotal" label="推送人次" />
          <!-- <el-table-column prop="successCount" label="成功人次">
            <template slot-scope="scope">
              {{ scope.row.successCount !== null ? scope.row.successCount : 0 }}
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="failCount" label="失败人次">
            <template slot-scope="scope">
              {{ scope.row.failCount ? scope.row.failCount : 0 }}
            </template>
          </el-table-column> -->
          <el-table-column label="成功率">
            <template slot-scope="scope">
              {{
                calculationSuccessRange(
                  scope.row.successCount,
                  scope.row.msgTotal
                )
              }}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="verifyTime" label="推送时间">
            <template slot-scope="scope">
              {{ scope.row.verifyTime ? scope.row.verifyTime : "-" }}
            </template>
          </el-table-column> -->
          
          
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                v-permission="buttons.MsgLog.view"
                :disabled="scope.sendCount === 0"
                @click.native.prevent="viewHandDetail(scope.row)"
              >
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-wrapper">
          <el-pagination
            :current-page="handPageNum"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="handPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="handTotal"
            @size-change="handleHandSizeChange"
            @current-change="handleHandCurrentChange"
          />
        </div>
      </div>
    </div>
    <SendMsg :dialog-visible="dialogVisible" @closeDialog="closeDialog" />
  </div>
</template>

<script>
import { getTableHeight } from "@/utils/index";
import { getStatistics, getHandList } from "@/api/msg";
import { getDicList } from "@/api/common";
import { getConferenceId } from "@/utils/conference-auth";
import SendMsg from "./sendMsg";
export default {
  name: "MsgLog",
  components: {
    SendMsg,
  },
  props: {},
  data() {
    return {
      dialogVisible: false,
      themeCodes: [],
      buttons: this.Global.buttons,
      conferenceId: getConferenceId(),
      tableData: [],
      tableHeight: getTableHeight(165),
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      activeName: "hand",
      // 手动推送相关
      handMsgTableData: [], // 手动推送表格数据
      handPageNum: 1,
      handPageSize: 10,
      handTotal: 0,
      handTplScope: null, // 手动推送方式
      handTableHeight: getTableHeight(165),
    };
  },
  created() {
    // this.getThemeCodes();
    this.search();
    this.getHandMsgTableData();
  },
  methods: {
    //   查询手动推动列表
    searchHandData() {
      this.handPageNum = 1;
      this.getHandMsgTableData();
    },
    //   重置手动推动列表
    resetSearchHandData() {
      //     this.pageInfo = {
      //     pageNum: 1,
      //     pageSize: 10,
      //     total: this.pageInfo.total,
      //   };
    },
    //   获取手动推送表格数据
    getHandMsgTableData() {
      const paramsData = {};
      paramsData.conferenceId = this.conferenceId;
      paramsData.pageNum = this.handPageNum;
      paramsData.pageSize = this.handPageSize;
      paramsData.total = this.handTotal;
      //   paramsData.tplScope = this.handTplScope;

      getHandList(paramsData).then((response) => {
        console.log(response.result,'000');
        if (response.code === 2000) {
          this.handMsgTableData = response.result.list;
          this.handTotal = response.result.total;
        }
      });
    },

    // 查看手动推送详情
    viewHandDetail(val) {
      console.log(val,'val11')
      this.$router.push({
        name: "msgLogList",
        params: {
          templatelogId: val.id,
          from: "hand",
          code:val.themeCode,
          isinquire:true,
          verifyStatus:val.verifyStatus
        },
      });
    },

    handleHandCurrentChange(val) {
      this.handPageNum = val;
      this.getHandMsgTableData();
    },
    handleHandSizeChange(val) {
      this.handPageSize = val;
      this.getHandMsgTableData();
    },

    closeDialog() {
      this.dialogVisible = false;
      this.search();
      this.getHandMsgTableData();
    },
    add() {
      this.dialogVisible = true;
    },
    view(val) {
      this.$router.push({
        path: `/msg/msglog/list/${val.themeCode}`,
      });
    },
    calculationSuccessRange(val1, val2) {
      if (val1 === null) {
        val1 = 0;
      }
      if (val2 === null || val2 === 0) {
        return "-";
      }
      return ((val1 / val2) * 100).toFixed(2) + "%";
    },
    getThemeCodes() {
      getDicList({ code: "themeCode" }).then((response) => {
        this.themeCodes = response.result;
      });
    },
    resetSearch() {
      this.startTimes = [];
      this.endTimes = [];
      this.pageInfo = {
        pageNum: 1,
        pageSize: 10,
        total: this.pageInfo.total,
      };
    },
    getList() {
      this.pageInfo.conferenceId = this.conferenceId;
      getStatistics(this.pageInfo).then((res) => {
        this.tableData = res.result.list;
        this.pageInfo.total = res.result.total;
      });
    },
    search() {
      this.pageInfo.pageNum = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNum = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val;
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
.tabs {
  background-color: #fff;
  padding-left: 8px;
  // height: ;
}
.widthClass {
  width: 150px;
}
</style>
