<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-05-30 18:12:46
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-06-09 19:55:07
-->
<template>
  <el-form ref="form" :label-position="labelPosition" :model="form" :rules="rules" label-width="100px" class="form">
    <div class="group">
      <div class="label">基本配置</div>
      <div class="content">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="操作" prop="operation">
          <el-checkbox v-model="form.operation">更多</el-checkbox>
        </el-form-item>
        <el-form-item label="刷新时间" prop="time">
          <el-input v-model="form.time" style="width: 140px;" /><span style="marginLeft: 10px;">分钟</span>
          <span class="tips">为空或0表示不刷新,建议配置5分钟以上</span>
        </el-form-item>
      </div>
    </div>
    <div class="group">
      <div class="label">内容配置</div>
      <div class="content">
        <el-form-item label="x" prop="x">
          <el-input v-model="form.x" style="width: 130px" />
          <span style="marginLeft: 10px">栏目</span>
        </el-form-item>
        <el-form-item label="y" prop="y">
          <el-input v-model="form.y" style="width: 130px" />
          <span style="marginLeft: 10px">值</span>
        </el-form-item>
        <el-form-item label="s" prop="s">
          <el-input v-model="form.s" style="width: 130px" />
          <span style="marginLeft: 10px">系列</span>
        </el-form-item>
        <el-form-item label="数据源类型" prop="date">
          <el-select v-model="form.dataType" placeholder="请选择数据源类型">
            <el-option label="API接口" value="1" />
            <el-option label="静态数据" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据源" prop="dataSource">
          <el-select v-model="form.dataSource" placeholder="请选择数据源" style="width: 130px;">
            <el-option label="请求接口" value="1" />
            <el-option label="静态数据" value="2" />
          </el-select>
          <el-button type="primary" style="marginLeft: 10px;">新建</el-button>
        </el-form-item>
        <el-form-item label="Base URL" prop="url">
          <el-input v-model="form.url" />
        </el-form-item>
        <el-form-item label="请求方式" prop="method">
          <el-select v-model="form.method" placeholder="请选择请求方式">
            <el-option label="GET" value="1" />
            <el-option label="POST" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间" prop="date">
          <el-select v-model="form.date" placeholder="请选择发布时间">
            <el-option label="一个月" value="1" />
            <el-option label="三个月" value="2" />
            <el-option label="半年" value="3" />
            <el-option label="一年" value="4" />
            <el-option label="不限" value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="行数" prop="line">
          <el-input-number v-model="form.line" controls-position="right" :min="5" :max="50" @change="inputNumberChange" />
        </el-form-item>
      </div>
    </div>
    <div class="group">
      <div class="label">外观配置</div>
      <div class="content">
        <el-form-item label="边框" prop="border">
          <el-radio-group v-model="form.border">
            <el-radio label="1">有边框</el-radio>
            <el-radio label="2">无边框</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="自适应" prop="adaptive">
          <el-radio-group v-model="form.adaptive">
            <el-radio label="1">文档数超出，卡片高度自动扩展</el-radio>
            <el-radio label="2">文档数超出，卡片高度自动扩展</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
    </div>
    <!-- <el-form-item>
      <el-button @click="resetForm('form')">取消</el-button>
      <el-button type="primary" @click="submitForm('form')">保存</el-button>
    </el-form-item> -->
  </el-form>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      labelPosition: 'left',
      form: {
        title: this.title,
        operation: '',
        time: '',
        line: 10,
        source: '',
        type: '',
        dataType: '1',
        dataSource: '1',
        method: '1',
        date: '1',
        border: '1',
        adaptive: '1'
      },
      rules: {
        // name: [
        //   { required: true, message: '请输入标题', trigger: 'blur' }
        //   // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        // ],
        // time: [
        //   { required: true, message: '请填写刷新时间', trigger: 'change' }
        // ],
        // date: [
        //   { type: 'date', required: true, message: '请选择发布时间', trigger: 'change' }
        // ],
        // line: [
        //   { required: true, message: '请填写行数', trigger: 'blur' }
        // ],
        // source: [
        //   { required: true, message: '请填写数据源', trigger: 'blur' }
        // ],
        // type: [
        //   { required: true, message: '请至少选择一个展现形式', trigger: 'change' }
        // ],
        // border: [
        //   { required: true, message: '请选择有无边框', trigger: 'change' }
        // ],
        // adaptive: [
        //   { required: true, message: '请选择自适应', trigger: 'blur' }
        // ]
      }
    }
  },
  methods: {
    inputNumberChange (value) {
      // console.log(value)
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss">
.el-drawer__wrapper .el-drawer__container {
  .el-drawer{
    .el-drawer__header{
      & > span {
        text-align: center;
      }
    }
  }
  .el-drawer__body{
    overflow: auto;
    padding-bottom: 30px;
  }
}
</style>
<style lang="scss" scoped>
.form{
  padding: 6px;
  background-color: #F2F2F2;
}
.group{
  background-color: #fff;
  padding-bottom: 10px;
  margin-bottom: 6px;
  .content{
    padding-left: 20px;
    padding-right: 50px;
  }
}
.label{
  padding-left: 20px;
  position: relative;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid rgba($color: #191f24, $alpha: 0.06);
  margin-bottom: 10px;
  &::before{
    margin-right: 7px;
    position: absolute;
    top: 13px;
    left: 10px;
    content: '';
    display: inline-block;
    height: 14px;
    width: 3px;
    background-color: #499CF8;
    border-radius: 2px;
  }
}
.el-radio{
  margin-bottom: 6px;
}
.tips{
  font-size: 12px;
  color: rgba(25, 31, 36, 0.48);
  line-height: 16px;
}
::v-deep .img-box{
  .el-upload--picture-card,
  .el-upload-list__item-actions{
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
  }
  .el-upload--picture-card .avatar{
    width: 60px;
    height: 60px;
  }
  .el-upload-list__item{
    width: 60px;
    height: 60px;
  }
}

</style>
