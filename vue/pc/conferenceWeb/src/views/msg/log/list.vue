<template>
  <div style="padding-left: 8px; padding-right: 8px; margin-top: 8px">
    <div class="clearfix">
      <div
        style="background-color: white; padding-left: 10px; padding-top: 15px"
      >
        主题名称：{{ themeCodeStr }}
      </div>
      <div
        style="background-color: white; padding-left: 10px; padding-top: 15px"
      >
        <el-form :inline="true" :model="pageInfo">
          <el-form-item label="姓名" v-if="!isinquire">
            <el-input v-model.trim="pageInfo.attendeeName" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model.trim="pageInfo.userPhone" />
          </el-form-item>
          <el-form-item label="推送状态" v-if="!showinquire">
            <el-select v-model="pageInfo.status" placeholder="全部" clearable>
              <el-option :key="1" label="成功" :value="1" />
              <el-option :key="2" label="失败" :value="2" />
              <el-option :key="-1" label="待推送" :value="-1" />
              <el-option :key="0" label="推送中" :value="0" />
              <el-option :key="3" label="已重发" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="推送时间" v-if="!showinquire">
            <el-date-picker
              v-model="inputTimes"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="daterange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              size="small"
            />
          </el-form-item>
           
           <el-form-item label="职务" v-if="showinquire">
            <el-input v-model.trim="pageInfo.position" />
          </el-form-item>
          <el-form-item label="标签"  v-if="showinquire">
              <el-select
                  v-model="pageInfo.tagIdsIn"
                  class="width100Class"
                  placeholder="全部"
                  clearable
              >
                  <el-option
                      v-for="item in tagList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                  />
              </el-select>
          </el-form-item>
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
      <div
        style="
          float: left;
          text-center: left;
          margin-left: 10px;
          padding-bottom: 10px;
        "
      >
        <el-button v-permission="buttons.MsgLog.send" @click="sendBatch"
          >批量重发</el-button
        >
      </div>
      <div style="float: right; text-center: right; padding-bottom: 10px">
        <!-- <el-button v-permission="buttons.MsgLog.export" @click="exportResult">导出查询结果</el-button> -->
      </div>
      <el-table
        ref="table"
        :data="tableData"
        :height="
          tableHeight +
          (this.$store.state.menu.buttons.indexOf(buttons.MsgLog.export) !==
            -1 ||
          this.$store.state.menu.buttons.indexOf(buttons.MsgLog.send) !== -1
            ? 0
            : 32)
        "
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" :selectable="selectInit" />
        <!-- width="250" -->
        <el-table-column prop="tplContent" label="推送内容" v-if="!showinquire">
          <template slot-scope="scope">
            <CusTomTooltip :value="formatTableCellData(scope.row.tplContent)" />
            <!-- <el-tooltip placement="bottom" effect="light">
                            <div slot="content">
                                {{ scope.row.tplContent }}
                            </div>
                            <div class="danhangxianshibuquan">{{ formatTableCellData(scope.row.tplContent) }}</div>
                        </el-tooltip> -->
          </template>
        </el-table-column>
        <el-table-column prop="attendeeName" label="姓名" v-if="!showinquire||isinquire"/>
        <el-table-column prop="userName" label="姓名" v-else/>
        <el-table-column prop="position" label="职务" v-if="showinquire"/>
        <el-table-column prop="tagVOs" label="标签" v-if="showinquire">
          <template slot-scope="scope">
              {{ scope.row.tagVOs !== null && scope.row.tagVOs.length > 0 ? '' : '-' }}
              <el-tag v-for="tagVO in scope.row.tagVOs" :key="tagVO.id" :style="{ backgroundColor: tagVO.backgroundColor, color: tagVO.fontColor }" type="info">
                  <el-tooltip placement="bottom" effect="light">
                      <div slot="content">
                          {{ tagVO.name }}
                      </div>
                      <div class="danhangxianshibuquan">{{ tagVO.name !== null && tagVO.name.length > 5 ? tagVO.name.substr(0,4) + '...' : tagVO.name }}</div>
                  </el-tooltip>
              </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="userPhone" label="手机号">
          <template slot-scope="scope">
            <PhoneEncryption :value="scope.row.userPhone" />
            <!-- <div>
                            <span>{{ formatTableCellData(formatPhone(scope.row.userPhone)) }}</span>
                            <span style="display:none">{{ scope.row.userPhone }}</span>
                            <el-button v-show="scope.row.userPhone !== null && scope.row.userPhone !== ''" icon="el-icon-view" type="text" @click="(event) => qiehuanshoujijiami(event)" />
                        </div> -->
            <!-- <div @click="xianshi">aaa</div> -->
          </template>
        </el-table-column>
        <el-table-column prop="successCount" label="推送方式">
          <template slot-scope="scope">
            {{ scope.row.tplScope === 0 ? "IM" : "短信" }}
          </template>
        </el-table-column>
        <el-table-column prop="organizationName" label="单位名称" v-if="showinquire"/>
        <el-table-column prop="createUserName" label="推送人" v-if="!showinquire" />
        <el-table-column prop="verifyTime" label="推送时间" v-if="!isinquire" >
          <template slot-scope="scope">
            {{ scope.row.verifyTime ?  scope.row.verifyTime  : "-" }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="推送时间" v-if="!showinquire&&isinquire"/>
        <el-table-column prop="status" label="推送状态" v-if="!showinquire">
          <template slot-scope="scope">
            <!-- 成功 失败  推送中 已重发  待推送 -->
            <span v-show="scope.row.status === -1">待推送</span>
            <span v-show="scope.row.status === 0">推送中</span>
            <span v-show="scope.row.status === 1">成功</span>
            <span v-show="scope.row.status === 2" style="color: #ff0000">失败</span>
            <span v-show="scope.row.status === 3">已重发</span>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="100" v-if="!showinquire">
          <template slot-scope="scope">
            <!-- v-permission="buttons.NoticeInside.edit" -->
            <el-button
              :disabled="scope.row.status !== 2"
              @click.native.prevent="send(scope.row)"
            >
              重发
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
</template>

<script>
import { getTableHeight, formatPhone } from "@/utils/index";
import { getList, retrySendMsg } from "@/api/msg";
import { getDicList } from "@/api/common";
import { getConferenceId } from "@/utils/conference-auth";
import { showLoading, closeLoading } from "@/utils/loading";
import { getList as getTagList } from '@/api/attendeeTag'
export default {
  name: "MsgLog",
  components: {},
  props: {},
  data() {
    return {
      multipleSelection: [],
      themeCodeStr: null,
      inputTimes: [],
      themeCodes: [],
      buttons: this.Global.buttons,
      conferenceId: getConferenceId(),
      tableData: [],
      tableHeight: getTableHeight(200),
      pageInfo: {
        themeCode: null,
        templatelogId: null, // 手动推送
        pageNum: 1,
        pageSize: 10,
        total: 0,
        attendeeName:'',
        position:'',
        tagIdsIn:''
      },
      verifyStatus:null,
      isinquire:true,
      showinquire:false,
      tagList: [],
    };
  },
  created() {
    console.log(this.$route,"router")
    if (this.$route.params.from && this.$route.params.from === "hand") {
      this.pageInfo.templatelogId = this.$route.params.templatelogId;
      this.verifyStatus=this.$route.params.verifyStatus
      if(!this.$route.params.hasOwnProperty('isinquire')){
        this.showinquire=true
      }
      if(this.$route.params.hasOwnProperty('isinquire')&&this.verifyStatus!==1){
        this.isinquire=false
      }
    } else {
      this.pageInfo.themeCode = this.$route.params.code;
    }
    this.getThemeCodes();
    this.search();
    this.getTagList()
  },
  methods: {
    selectInit(row, index) {
      if (row.status === 2) {
        return true; // 可勾选
      } else {
        return false; // 不可勾选
      }
    },
    getTagList() {
            getTagList({ conferenceId: this.conferenceId }).then((res) => {
                this.tagList = res.result.list
                console.log(this.tagList,'this.tagList')
            })
        },
    send(row) {
      this.sendSubmit([row.id]);
    },
    sendBatch() {
      if (this.multipleSelection.length === 0) {
        this.$message("至少选择一条记录");
        return;
      }
      const param = [];
      this.multipleSelection.forEach((item) => {
        param.push(item.id);
      });
      this.sendSubmit(param);
    },
    sendSubmit(param) {
      this.$confirm("请确认是否重发消息？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var load = showLoading();
          retrySendMsg(param)
            .then((res) => {
              if (res.success) {
                this.$message(res.message);
                this.search();
              }
              closeLoading(load);
            })
            .catch(() => {
              closeLoading(load);
            });
        })
        .catch(() => {});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    exportResult() {},
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
    formatPhone(val) {
      return formatPhone(val);
    },
    calculationSuccessRange(val1, val2) {
      return (val1 / val2).toFixed(2);
    },
    getThemeCodes() {
      getDicList({ code: "themeCode" }).then((response) => {
        this.themeCodes = response.result;
        this.themeCodes.forEach((item) => {
          if (item.valCode === this.$route.params.code) {
            this.themeCodeStr = item.valName;
          }
        });
      });
    },
    resetSearch() {
      this.inputTimes = [];
      this.pageInfo = {
        // themeCode: this.$route.params.code,
        pageNum: 1,
        pageSize: 10,
        total: this.pageInfo.total,
        attendeeName:'',
        position:'',
        tagIdsIn:''
      };
      if (this.$route.params.from && this.$route.params.from === "hand") {
        this.pageInfo.templatelogId = this.$route.params.templatelogId;
      } else {
        this.pageInfo.themeCode = this.$route.params.code;
      }
    },
    getList() {
      if (this.inputTimes !== null && this.inputTimes.length === 2) {
        this.pageInfo.startTime = this.inputTimes[0];
        this.pageInfo.endTime = this.inputTimes[1];
      } else {
        this.pageInfo.startTime = null;
        this.pageInfo.endTime = null;
      }
      this.pageInfo.conferenceId = this.conferenceId;
      getList(this.pageInfo).then((res) => {
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
.widthClass {
  width: 150px;
}
.danhangxianshibuquan {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
