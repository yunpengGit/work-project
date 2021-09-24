<template>
  <div>
    <div style="padding-left: 8px; padding-right: 8px; margin-top: 0px">
      <div style="padding-left: 10px; padding-top: 0px">
        <commonSearch
          ref="commonSearch"
          :card-info-flag="true"
          @onSubmit="onSubmit"
          @changeTableHeight="changeTableHeight"
        />
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
      <!-- <div style="float: left; padding-bottom:10px">
                <el-button type="primary" @click="handleDialog">批量分配</el-button>
                <el-button type="primary" @click="delSelectedWithConfirm">标记完成</el-button>
            </div> -->
      <div style="float: right; padding-bottom: 10px">
        <!-- <el-button v-permission="buttons.CardAttendeeInfo.attendeeExport" @click="exportExcel">
                    导出查询结果
                </el-button> -->
        <el-dropdown
          @command="selectAttendeeInfo"
          v-permission="buttons.CardAttendeeInfo.attendeeExport"
        >
          <el-button>
            导出制证人员信息<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="baseInfo"
              >制证人员基本信息</el-dropdown-item
            >
            <el-dropdown-item command="accessoryInfo"
              >制证人员附件信息</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-table
        ref="table"
        :data="attendeeInfoList"
        :height="
          tableHeight +
          (this.$store.state.menu.buttons.indexOf(
            Global.buttons.CardAttendeeInfo.attendeeExport
          ) !== -1
            ? 0
            : 32)
        "
        style="width: 100%"
        :row-class-name="tableRowClassName"
        :header-cell-style="{
          background: '#f7f7f7',
        }"
      >
        <el-table-column type="selection" prop="id" />
        <!-- <el-table-column label="姓名" align="left" width="150px">
                    <template slot-scope="scope">
                        <div style="height:32px">
                            <img
                                style="width:32px;height:32px;float:left;border-radius:50%"
                                :src="imagePath + (scope.row.attendee.fixAttributeVO.photoUrl!== null && scope.row.attendee.fixAttributeVO.photoUrl !== '' ? scope.row.attendee.fixAttributeVO.photoUrl : defaultPhoto)"
                            >
                            <span
                                style="margin-top:8px;margin-left:5px;float:left"
                                :title="scope.row.attendee.fixAttributeVO.attendeeName"
                            >{{ scope.row.attendee.fixAttributeVO.attendeeName != null && scope.row.attendee.fixAttributeVO.attendeeName.length > 4 ? scope.row.attendee.fixAttributeVO.attendeeName.substr(0,4) + '...' : scope.row.attendee.fixAttributeVO.attendeeName }}</span>
                            <span v-if="scope.row.attendee.attendeeRoleFlag===0"> <span
                                                                                      v-if="scope.row.attendee.fixAttributeVO.honourFlag === 1"
                                                                                      style="margin-top:8px;float:left"
                                                                                  >（主宾）</span>
                                <span v-else style="margin-top:8px;float:left">（随员）</span> </span>
                        </div>
                    </template>
                </el-table-column> -->
        <el-table-column prop="name" label="姓名" :min-width="150">
          <template slot-scope="scope">
            <AttendeeInfomation
              :accompany-flag="2"
              :accompany-totips="scope.row.attendee.accompanyTotips"
              :photo-url="scope.row.attendee.ssoUserPhoto"
              :attendee-name="scope.row.attendee.fixAttributeVO.attendeeName"
              :attendee-role-flag="
                scope.row.attendee.fixAttributeVO.attendeeRoleFlag
              "
              :honour-flag="scope.row.attendee.fixAttributeVO.honourFlag"
              :sex="scope.row.attendee.fixAttributeVO.sex"
            />
          </template>
        </el-table-column>
        <el-table-column label="职务" width="120px">
          <template slot-scope="scope">
            <div :title="scope.row.attendee.fixAttributeVO.position">
              {{
                formatTableCellData(scope.row.attendee.fixAttributeVO.position)
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="手机">
          <template slot-scope="scope">
            <PhoneEncryption :value="scope.row.attendee.fixAttributeVO.phone" />
            <!-- <div>
                            <span>{{ formatPhone(scope.row.attendee.fixAttributeVO.phone) }}</span>
                            <span style="display:none">{{ scope.row.attendee.fixAttributeVO.phone }}</span>
                            <el-button icon="el-icon-view" type="text" @click="(event) => qiehuanshoujijiami(event)" />
                        </div> -->
          </template>
        </el-table-column>
        <el-table-column label="单位简称/全称">
          <template slot-scope="scope">
            <div>
              {{
                formatTableCellData(
                  formatOrgName(
                    scope.row.attendee.fixAttributeVO.organizationSortName,
                    scope.row.attendee.fixAttributeVO.organizationName
                  )
                )
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="参会状态">
          <template slot-scope="scope">
            {{ scope.row.attendee.meetingStatusStr }}
          </template>
        </el-table-column>
        <el-table-column label="证件信息">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.cardList != null && scope.row.cardList.length > 0"
              placement="bottom-start"
              width="250px"
              trigger="hover"
            >
              <div v-for="cardList in scope.row.cardList" :key="cardList.id">
                {{ cardList.cardName }} ( {{ cardList.cardStatusStr }} )
              </div>
              <div
                v-if="
                  scope.row.cardList != null && scope.row.cardList.length > 0
                "
                slot="reference"
                class="content"
              >
                {{ scope.row.cardList[0].cardName }} (
                {{ scope.row.cardList[0].cardStatusStr }} )
                <span
                  v-if="
                    scope.row.cardList != null && scope.row.cardList.length > 1
                  "
                  >...</span
                >
              </div>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="chakanzhizheng(scope.row.attendee.id)"
              >查看票证</el-button
            >
            <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">发证记录</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- <div style="float:right;padding:10px"> -->
      <div class="page-wrapper">
        <el-pagination
          :current-page="paramData.pageNum"
          background
          :page-sizes="pageInfo.pageSizeList"
          :page-size="paramData.pageSize"
          layout="total, prev, pager, next, sizes ,jumper"
          :total="pageInfo.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <Chakanxingcheng
        :title="'查看票证'"
        :default-check="defaultCheck"
        :attendee-id="attendeeId"
        :dialog-visible="chakanxingchengDialogVisible"
        @closeDialog="closeChakanxingcheng"
      />
    </div>
    <!-- 选择[制证人附件信息]弹窗 -->
    <el-dialog
      title="请选择需要下载的附件"
      width="70%"
      :visible.sync="accessoryDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="closeAccessoryDialog"
      v-if="accessoryDialogVisible"
    >
      <el-table
        :data="accessoryTableData"
        border
        style="width: 100%"
        max-height="300px"
        @selection-change="handleSelectionAccessoryChange"
      >
        <el-table-column type="selection" width="45" :selectable="selectInit"/>
        <el-table-column prop="fieldLabel" label="附件名称" />
        <el-table-column prop="type" label="附件类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 9">图片</span>
            <span v-else-if="scope.row.type == 10">文件</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="fileCounts" label="附件数量" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="comfirmSubmit">确认</el-button>
        <el-button @click="closeAccessoryDialog">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import commonSearch from "@/views/common/commonSearch";
import { getAttendeeInfoList, exportAttendeeBase } from "@/api/card";
import { getFileList, exportFileList } from "@/api/attendee";
import { getTableHeight, formatPhone } from "@/utils/index";
import { getConferenceId } from "@/utils/conference-auth";
import { getOssBaseUrl } from "@/utils/x-sso-baseurl";
import Chakanxingcheng from "@/views/common/chakanxingcheng";
import { showLoading, closeLoading } from "@/utils/loading";
import { exportCardTaskAttendeeZip } from "@/api/synergyFiles";
export default {
  name: "AttendeeCard",
  components: {
    commonSearch,
    Chakanxingcheng,
  },
  data() {
    return {
      buttons: this.Global.buttons,
      defaultCheck: "",
      attendeeId: null,
      chakanxingchengDialogVisible: false,
      paramData: {
        conferenceId: getConferenceId(),
        // attendeeRoleFlagEqual: [0, 1, 2],
        pageSize: 10,
        pageNum: 1,
        hasLinkAttendee: 1,
      },
      pageInfo: {
        pageSizeList: [10, 20, 30],
        total: 0,
      },
      defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
      attendeeInfoList: [],
      tableHeight: getTableHeight(218),
      imagePath: getOssBaseUrl(),
      accessoryDialogVisible: false, // 选择[制证人附件信息]弹窗
      accessorySelectionList: [], // 选择的附件集合
      accessoryTableData: [
        {
          id: "1",
          name: "hahahahha",
          type: "图片",
        },
        {
          id: "2",
          name: "2016-05-04",
          type: "文件",
        },
      ],
    };
  },
  watch: {
    // '$route' () {  // 对route进行监控  添加返回时会调用刷新数据
    //     this.getListInfo()
    // }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getListInfo(this.paramData);
  },
  // 这里存放数据
  beforeCreate() {},
  // 生命周期 - 挂载之前
  beforeMount() {},
  // 生命周期 - 更新之前
  beforeUpdate() {},
  // 生命周期 - 更新之后
  updated() {},
  // 生命周期 - 销毁之前
  beforeDestroy() {},
  // 生命周期 - 销毁完成
  destroyed() {},
  // 如果页面有keep-alive缓存功能，这个函数会触发
  activated() {},
  methods: {
    selectInit(row, index) {
      if (row.fileCounts > 0) {
        return true; // 可勾选
      } else {
        return false; // 不可勾选
      }
    },
    handleClick() {},
    // 筛选制证人信息
    selectAttendeeInfo(command) {
      if (command === "accessoryInfo") {
        this.accessoryDialogVisible = true;
        this.getAccessoryTableData();
      } else {
        this.downloadBaseInfo();
      }
    },
    // 下载制证人基本信息
    downloadBaseInfo() {
      var tempData = JSON.parse(JSON.stringify(this.pageInfo));
      tempData.conferenceId = this.paramData.conferenceId;
      tempData.signStatusEqual = [3];
      tempData.hasLinkAttendee = 1;
      tempData.hasLight = 1;
      tempData.pageSize = null;
      tempData.pageNum = null;
      tempData.exportNamePrefix = "参会人查询";
      exportAttendeeBase(tempData)
        .then((res) => {
          if (
            decodeURI(res.headers["filename"]) == null ||
            decodeURI(res.headers["filename"]) === "undefined"
          ) {
            this.$message("文件不存在");
          } else {
            const blob = new Blob([res.data], {
              type: "application/octet-stream",
            });
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              navigator.msSaveBlob(blob, decodeURI(res.headers["filename"]));
            } else {
              const link = document.createElement("a");
              link.style.display = "none";
              link.href = URL.createObjectURL(blob);
              link.setAttribute("download", decodeURI(res.headers["filename"]));
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }
          closeLoading(load);
        })
        .catch((error) => {
          console.log(error);
          closeLoading(load);
        });
    },
    // 选择附件
    handleSelectionAccessoryChange(list) {
      this.accessorySelectionList = list;
    },
    // 关闭弹窗
    closeAccessoryDialog() {
      this.accessoryDialogVisible = false;
      this.accessorySelectionList = [];
    },
    // 确认下载
    comfirmSubmit() {
      if (this.accessorySelectionList.length) {
        this.exportExcel();
      } else {
        this.$message("请选择需要导出的附件!");
      }
    },
    // 导出附件列表
    exportExcel() {
      var tempData = JSON.parse(JSON.stringify(this.pageInfo));
      tempData.conferenceId = this.paramData.conferenceId;
      tempData.signStatusEqual = [3];
      tempData.hasLinkAttendee = 1;
      tempData.hasLight = 1;
      tempData.pageSize = null;
      tempData.pageNum = null;
      tempData.exportNamePrefix = "制证人员附件信息";
      // 下载附件表单配置的ID集合
      let fileSignFormConfigIds = [];
      this.accessorySelectionList.forEach((item) => {
        fileSignFormConfigIds.push(item.id);
      });
      tempData.downloadFileSignFormConfigIds = fileSignFormConfigIds;

      exportFileList(tempData)
        .then((res) => {
          if (res.success) {
            this.accessoryDialogVisible = false;
            this.$alert(
              "正在为您导出数据,稍后请通过会务通知获取下载链接",
              "导出提醒",
              {
                confirmButtonText: "我知道了",
                callback: (action) => {},
              }
            );
          }
          closeLoading(load);
        })
        .catch(() => {
          closeLoading(load);
        });
    },

    // 获取可导出附件列表
    getAccessoryTableData() {
      var tempData = JSON.parse(JSON.stringify(this.pageInfo));
      tempData.conferenceId = this.paramData.conferenceId;
      tempData.signStatusEqual = [3];
      tempData.hasLinkAttendee = 1;
      tempData.hasLight = 1;
      tempData.pageSize = null;
      tempData.pageNum = null;
      tempData.exportNamePrefix = "制证人员附件信息";
      getFileList(tempData)
        .then((res) => {
          if (res.success) {
            this.accessoryTableData = res.result;
          }
        })
        .catch(() => {
          //   closeLoading(load);
        });
    },
    closeChakanxingcheng() {
      this.attendeeId = null;
      this.chakanxingchengDialogVisible = false;
      // this.defaultCheck = null
    },
    formatPhone(val) {
      return formatPhone(val);
    },
    qiehuanshoujijiami(event) {
      if (
        event.currentTarget.parentElement.children[0].style.display === "none"
      ) {
        event.currentTarget.parentElement.children[0].style.display = "";
        event.currentTarget.parentElement.children[1].style.display = "none";
      } else {
        event.currentTarget.parentElement.children[0].style.display = "none";
        event.currentTarget.parentElement.children[1].style.display = "";
      }
    },
    changeTableHeight(val) {
      this.tableHeight = getTableHeight(val);
    },

    handleSizeChange(val) {
      console.log("长度改变：" + val);
      this.paramData.pageSize = val;
      this.getListInfo(this.paramData);
    },
    handleCurrentChange(val) {
      console.log("当前页码改变：" + val);
      this.paramData.pageNum = val;
      this.getListInfo(this.paramData);
    },

    handleDialog() {
      var ids = [];
      var selectedList = this.$refs.table.selection;
      for (const item of selectedList) {
        ids.push(item.attendeeId);
      }

      if (ids.length > 0) {
        this.$refs["taskDialog"].showDialog(ids);
      } else {
        this.$message("未选择" + this.getConferenceTemplate(2) + "");
      }
    },
    chakanzhizheng(attendeeId) {
      this.attendeeId = attendeeId;
      this.chakanxingchengDialogVisible = true;
      this.defaultCheck = "useCardFlag";
    },
    handleEdit() {
      alert("缺接口");
    },

    tableRowClassName({ row, rowIndex }) {
      const index = rowIndex + 1;
      if (index % 2 == 0) {
        return "warning-row";
      }
    },
    // commonSearch组件参入参数
    onSubmit(param) {
      var params = Object.assign({}, param);
      params["pageSize"] = this.paramData.pageSize;
      params["pageNum"] = 1;
      params["hasLinkAttendee"] = 1;

      // params['attendeeRoleFlagEqual'] = [0, 1, 2]

      console.log(params);
      this.getListInfo(params);
    },

    getListInfo(param) {
      getAttendeeInfoList(param).then((response) => {
        if (response.success) {
          console.log("getAttendeeInfoList" + response.result.list);
          this.attendeeInfoList = response.result.list;
          this.pageInfo.total = response.result.total;
          this.paramData = param;
        }
      });
    },
  },
};
</script>
<style lang='scss' scoped >
// ::v-deep .el-table tr {
//     background: #c0c0c0;
// } // 单数行的颜色

::v-deep .el-table .warning-row {
  background: #f7f7f7;
}
.content {
  display: -webkit-box;
  overflow: hidden;
  white-space: normal !important;
  text-overflow: ellipsis;
  word-wrap: break-word;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
