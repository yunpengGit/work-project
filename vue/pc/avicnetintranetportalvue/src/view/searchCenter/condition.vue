<!--
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-04-23 11:07:17
 * @LastEditors: zongmz
 * @LastEditTime: 2021-04-27 11:03:19
-->
<template>
  <div class="condition-box">
    <div class="condition-group">
      <el-checkbox>全选</el-checkbox>
    </div>
    <div class="condition-group">
      <label>时间：</label>
      <div class="group">
        <span>不限</span>
        <span>一天内</span>
        <span>近一周</span>
        <span>近一个月</span>
        <span>近三个月</span>
        <span>近半年</span>
        <el-date-picker
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </div>
    </div>
    <div class="condition-group">
      <label>资料状态：</label>
      <span>不限</span>
      <el-checkbox-group v-model="checkList">
        <el-checkbox label="1">发布</el-checkbox>
        <el-checkbox label="2">待审</el-checkbox>
        <el-checkbox label="3">驳回</el-checkbox>
        <el-checkbox label="4">草稿</el-checkbox>
        <el-checkbox label="5">过期</el-checkbox>
        <el-checkbox label="6">废弃</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="condition-group">
      <label>资料域：</label>
      <span>不限</span>
      <el-checkbox-group v-model="checkList">
        <el-checkbox label="1">标题</el-checkbox>
        <el-checkbox label="2">正文</el-checkbox>
        <el-checkbox label="3">简介</el-checkbox>
        <el-checkbox label="4">创建者</el-checkbox>
        <el-checkbox label="5">创建部门</el-checkbox>
        <el-checkbox label="6">MJ</el-checkbox>
        <el-checkbox label="7">含附件</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      checkList: ['1']
    }
  }
}
</script>
<style lang="scss" scoped>
.condition-box {
    border-radius: 4px;
    border: 1px solid #DADBDC;
    padding: 15px;
    .condition-group {
      display: flex;
      align-items: center;
      label {
        width: 80px;
        color: rgba(25, 31, 36, 0.64);
      }
    }
}
</style>
