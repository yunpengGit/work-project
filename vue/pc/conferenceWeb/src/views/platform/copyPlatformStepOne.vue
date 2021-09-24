<template>
  <el-dialog
      :title="'复制会议活动'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="closeDialog"
  >
    <div class="title-div">
      <span class="remark-span">请选择需要复制会议/活动/培训</span>
      <el-button type="primary" @click="search" :loading="searchLoading" class="search-button">查询</el-button>
      <el-input v-model="nameLike" placeholder="请输入关键字搜索" class="search-input" @change="search"/>
    </div>
    <div class="content-div">
      <el-table
          :data="tableData"
          :show-header="false"
          :max-height="'200'"
          @row-click="rowClick"
          style="width: 100%">
        <el-table-column width="50">
          <template scope="scope">
            <el-radio :label="scope.row.id" v-model="selectId" style="color: #fff;"></el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="name"/>
        <el-table-column prop="conferenceStatusStr"/>
      </el-table>
    </div>
    <div class="bottom-div">
      <span v-show="selectId">已选<span style="color: #0F6AD9">1</span>项</span>
      <el-button type="primary" class="next-btn" @click="next">下一步</el-button>
      <el-button class="cancel-btn" @click="closeDialog">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {getList} from '@/api/conference'

export default {
  name: 'CopyPlatformStepOne',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      nameLike: '',
      searchLoading: false,
      selectId: null,
      tableData: []
    }
  },
  created() {
    this.search();
  },
  watch: {},
  methods: {
    search() {
      this.searchLoading = true;
      getList({nameLike: this.nameLike}).then(response => {
        this.searchLoading = false;
        this.selectId = null;
        this.tableData = response.result.list !== null && response.result.list.length > 0 ? response.result.list : []
      })
    },
    rowClick(row) {
      this.selectId = row.id
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
    next() {
      if (this.selectId == null) {
        this.$message.warning("请选择要复制的会议活动！")
        return
      }
      let selectData = this.tableData.find(item => item.id === this.selectId)
      this.$emit("next", selectData);
    }
  }
}
</script>
<style lang="scss" scoped>
.title-div {
  height: 32px;
  width: 100%;
  display: inline-block;

  .remark-span {
    line-height: 32px;
    color: #8c939d;
  }

  .search-input {
    width: 45%;
    float: right;
    margin-right: 5px;
  }

  .search-button {
    float: right;
  }
}

.content-div {
  margin-top: 10px;

  ::v-deep .el-radio__label {
    display: none;
  }
}

.bottom-div {
  margin-top: 10px;
  height: 40px;
  width: 100%;
  display: inline-block;

  .next-btn {
    float: right;
  }

  .cancel-btn {
    margin-right: 10px;
    float: right;
  }
}
</style>
