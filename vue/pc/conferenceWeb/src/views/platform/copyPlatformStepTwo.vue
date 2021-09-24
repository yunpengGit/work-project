<template>
  <el-dialog
      :title="'复制会议活动'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="closeDialog"
  >
    <div class="title-div">
      <div class="remark-span">已选择的会议</div>
      <div class="platform-name-div">
        <ul>
          <li>
            {{ copyPlatformData ? copyPlatformData.name : "" }}
          </li>
        </ul>
      </div>
      <div class="remark-span select-copy-remark-div">请在下面选择需要复制的信息</div>
      <el-row class="select-item-row">
        <el-checkbox-group v-model="selectCopyItem">
          <el-col :span="12" class="select-item-col">
            <el-checkbox label="0" name="type" class="select-item-checkbox" :checked="checkbox">
              {{  copyPlatformData?copyPlatformData.conferenceTemplate.lable1:'' }}
            </el-checkbox>
          </el-col>
          <el-col :span="12" class="select-item-col">
            <el-checkbox label="1" name="type" class="select-item-checkbox">车辆信息</el-checkbox>
          </el-col>
          <el-col :span="12" class="select-item-col">
            <el-checkbox label="2" name="type" class="select-item-checkbox">住宿信息</el-checkbox>
          </el-col>
          <el-col :span="12" class="select-item-col">
            <el-checkbox label="3" name="type" class="select-item-checkbox">餐饮信息</el-checkbox>
          </el-col>
          <el-col :span="12" class="select-item-col">
            <el-checkbox label="4" name="type" class="select-item-checkbox">票证信息</el-checkbox>
          </el-col>
        </el-checkbox-group>
      </el-row>
    </div>
    <div class="bottom-div">
      <span v-show="selectCopyItem.length > 0">已选<span style="color: #0F6AD9">{{
          selectCopyItem.length
        }}</span>项</span>
      <el-button type="primary" class="over-btn" @click="over" :loading="loading">完成</el-button>
      <el-button type="primary" class="next-btn" @click="lastStep">上一步</el-button>
      <el-button class="cancel-btn" @click="closeDialog">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "CopyPlatformStepTwo",
  props: {
    copyPlatformData: {
      type: Object,
      default: {}
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    loading:{
      type: Boolean,
      default: false
    }
  },
  watch: {},
  data() {
    return {
      selectCopyItem: [],
      checkbox: true,
    }
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog")
    },
    over() {
      if (this.selectCopyItem.find(item => item == 0)) {
        this.$emit("over", this.selectCopyItem)
      } else {
        this.$message.warning("会议/活动/培训信息为必选项")
      }
    },
    lastStep() {
      this.$emit("lastStep")
    }
  }
}
</script>

<style lang="scss" scoped>
.title-div {
  .remark-span {
    color: #8c939d;
  }

  .select-copy-remark-div {
    margin-top: 15px;
  }

  .platform-name-div {
    font-weight: bold;
    margin-top: 5px;
    font-size: 16px;

    ul li {
      list-style: disc;
      margin-left: 15px;
    }
  }

  .select-item-row {
    margin-top: 15px;

    .select-item-col {
      margin-top: 5px;

      .select-item-checkbox {
        font-weight: bold;
      }
    }
  }
}

.bottom-div {
  margin-top: 30px;
  height: 40px;
  width: 100%;
  display: inline-block;

  .over-btn {
    float: right;
  }

  .next-btn {
    float: right;
    margin-right: 10px;
  }

  .cancel-btn {
    margin-right: 10px;
    float: right;
  }
}
</style>