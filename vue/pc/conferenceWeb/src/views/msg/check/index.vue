<!--
* @Descripttion:
* @Author: wanghz
* @Date: 2021-07-16 15:44:00
* @LastEditors: Please set LastEditors
* @LastEditTime: 
-->
<template>
  <div style="margin: 8px; padding: 8px; background: #fff">
    <div class="operationBtn">
      <el-button type="primary" @click="batchReview">批量审核</el-button>
      <el-button @click="refresh">刷新列表</el-button>
    </div>
    <div>
      <el-table
        ref="table"
        :data="verfyTableData"
        :height="tableHeight"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        >
        <el-table-column type="selection" width="55" :selectable="selectable" />
        <el-table-column prop="themeCodeStr" label="推送主题" />
        <el-table-column prop="tplContent" label="推送内容 " />
          <el-table-column prop="receiveUserTypeStr" label="推送范围 " />
        <el-table-column prop="msgTotal" label="推送人次" />
        <el-table-column prop="createUserName" label="申请人" />
        <el-table-column prop="createTime" label="申请时间" />
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <span v-if="scope.row.verifyStatus === 1">审核通过</span>
            <span
              v-else-if="scope.row.verifyStatus === 0"
              style="color: #3399ff"
              >待审核</span
            >
            <span v-else style="color: red">审核不通过</span>
          </template>
        </el-table-column>
        <el-table-column prop="verifyUserName" label="审核人">
          <template slot-scope="scope">
            {{ scope.row.verifyUserName ? scope.row.verifyUserName : "-" }}
          </template>
        </el-table-column>
        <el-table-column prop="verifyTime" label="审核时间">
          <template slot-scope="scope">
            {{ scope.row.verifyTime ? scope.row.verifyTime : "-" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              v-permission="buttons.MsgLog.view"
              :disabled="scope.sendCount === 0"
              @click.native.prevent="viewHandDetail(scope.row)"
            >
              查看详情{{ scope.verifyStatus }}
            </el-button>
            <el-button
              type="primary"
              v-permission="buttons.MsgLog.view"
              v-if="scope.row.verifyStatus === 0"
              :disabled="scope.sendCount === 0"
              @click.native.prevent="singleAudit(scope.row)"
            >
              审核
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-wrapper">
        <el-pagination
          :current-page="pageNum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog
      title="消息审核"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div style="padding: 20px 0">
        请选择审核意见，消息通知会在审核通过后按策略推送
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="submitAudit(2)">审核不通过</el-button>
        <el-button type="primary" @click="submitAudit(1)">审核通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTableHeight } from "@/utils/index";
import { getHandList, verifyHand } from "@/api/msg";
import { getConferenceId } from "@/utils/conference-auth";

export default {
  data() {
    return {
      buttons: this.Global.buttons,
      tableHeight: getTableHeight(110),
      conferenceId: getConferenceId(),
      verfyTableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [],
      dialogVisible: false,
    };
  },
  created() {
    this.getVerfyTableData();
  },
  mounted() {},
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 批量审核
    batchReview() {
      if (this.multipleSelection.length === 0) {
        this.$message("请选择需要审核的数据！");
      } else {
        this.dialogVisible = true;
      }
    },
    selectable(row) {
      if (row.verifyStatus === 0) {
        return true; // 可以选择
      } else {
        return false; // 禁用
      }
    },
    handleClose() {
      this.dialogVisible = false;
      this.multipleSelection = [];
    },
    // 审核单条数据
    singleAudit(row) {
      this.dialogVisible = true;
      this.multipleSelection = [row];
    },

    // 查看手动推送详情
    viewHandDetail(val) {
      this.$router.push({
        path: "/msg/msgcheck/list",
        query: {
          templatelogId: val.id,
          code:val.themeCode,
          from: "hand",
        },
      });
    },

    // 提交审核意见
    submitAudit(verifyStatus) {
      this.dialogVisible = false;
      let arr = [];
      this.multipleSelection.forEach((item) => {
        const obj = {};
        obj.id = item.id;
        obj.verifyStatus = verifyStatus;
        arr.push(obj);
      });

      verifyHand(arr).then((response) => {
        console.log(response.result);
        if (response.code === 2000) {
          this.$message({
            message: response.message,
            type: "success",
          });
          this.getVerfyTableData();
        } else {
           this.$message({
            message: response.message,
            type: "error",
          });
        }
      });
    },

    // 刷新列表
    refresh() {
      this.pageNum = 1;
      this.getVerfyTableData();
    },

    // 获取表格数据
    getVerfyTableData() {
      const paramsData = {};
      paramsData.conferenceId = this.conferenceId;
      paramsData.pageNum = this.pageNum;
      paramsData.pageSize = this.pageSize;
      paramsData.total = this.total;

      getHandList(paramsData).then((response) => {
        console.log(response.result);
        if (response.code === 2000) {
          this.verfyTableData = response.result.list;
          this.total = response.result.total;
        }
      });
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getVerfyTableData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getVerfyTableData();
    },
  },
};
</script>

<style scoped lang="scss">
.operationBtn {
  margin-bottom: 8px;
  background-color: #fff;
}
</style>
