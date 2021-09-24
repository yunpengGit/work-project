<template>
  <div class="main">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
      label-position="left"
      class="demo-form"
    >

      <el-form-item label="组件模型：" prop="componentName">
        <el-select v-model="form.componentName" @change="onChangeModel">
          <el-option
            v-for="{label,value} in typeOpts"
            :key="value"
            :label="label"
            :value="value"
          />
        </el-select>
      </el-form-item>

      <p class="title">基本信息</p>

      <el-form-item label="标题：" prop="label">
        <el-input v-model="form.label" placeholder="请输入标题" />
      </el-form-item>

      <el-form-item label="业务分类：" prop="categoryId">
        <el-select v-model="form.categoryId" placeholder="请选择业务分类">
          <el-option
            v-for="{categoryName,categoryId} in categoryOpts"
            :key="categoryId"
            :label="categoryName"
            :value="`${categoryId}`"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="密级：" prop="secretLevel">
        <el-select v-model="form.secretLevel" placeholder="请选择组件密级">
          <el-option
            v-for="{dictValue,dictLabel} in secretLevelOpts"
            :key="dictValue"
            :label="dictLabel"
            :value="Number(dictValue)"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="缩略图：" prop="iconUrl">
        <cover-upload
          :image-url.sync="form.iconUrl"
          :page-type="routerType"
          :file-options="fileOptions"
          @success="uploadSuccessFn"
          @updateImg="updateImgFn"
        />
      </el-form-item>

      <p class="title">数据属性</p>

      <el-form-item label="数据来源：" prop="componentAttr.reqParams.dataType">
        <el-radio-group v-model="form.componentAttr.reqParams.dataType">
          <el-radio label="1" class="limit-width">REST接口</el-radio>
          <el-radio label="2" class="limit-width">静态数据</el-radio>
          <el-radio label="3" class="limit-width">CSB</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 接口请求设置 -->
      <div v-show="form.componentAttr.reqParams.dataType !== '2'">
        <el-form-item label="请求方式：" prop="componentAttr.reqParams.method">
          <el-radio-group v-model="form.componentAttr.reqParams.method">
            <el-radio label="get" class="limit-width" />
            <el-radio label="post" class="limit-width" />
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-show="form.componentAttr.reqParams.dataType === '3'"
          label="服务名称："
          prop="componentAttr.reqParams.apiName"
        >
          <el-input
            v-model="form.componentAttr.reqParams.apiName"
            placeholder="请输入服务名称"
          />
        </el-form-item>

        <el-form-item
          v-show="form.componentAttr.reqParams.dataType === '3'"
          label="版本号："
          prop="componentAttr.reqParams.version"
          class="request-url"
        >
          <el-input
            v-model="form.componentAttr.reqParams.version"
            placeholder="请输入版本号"
          />
          <el-button
            type="primary"
            @click="onTest"
          >测试</el-button>
        </el-form-item>

        <el-form-item
          v-show="form.componentAttr.reqParams.dataType === '1'"
          label="请求地址："
          prop="componentAttr.reqParams.url"
          class="request-url"
        >
          <el-input
            v-model="form.componentAttr.reqParams.url"
            placeholder="请输入请求地址"
          />
          <el-button type="primary" @click="onTest">测试</el-button>
        </el-form-item>

        <el-form-item label="head：" prop="componentAttr.reqParams.head">
          <el-input
            v-model="form.componentAttr.reqParams.head"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入head（json格式）"
          />
        </el-form-item>

        <el-form-item label="body：" prop="componentAttr.reqParams.body">
          <el-input
            v-model="form.componentAttr.reqParams.body"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入body内容（json格式）"
          />
        </el-form-item>

        <el-form-item label="刷新时间：" prop="refreshTime">
          <el-input v-model="form.componentAttr.reqParams.refreshTime" class="refresh-time" placeholder="0表示不刷新" />
          <span>分</span>
        </el-form-item>
      </div>

      <div v-show="form.componentAttr.reqParams.dataType === '2'">
        <el-form-item label="静态数据：" prop="componentAttr.reqParams.list">
          <el-input
            v-model="form.componentAttr.reqParams.list"
            type="textarea"
            :autosize="{ minRows: 4 }"
            placeholder="请输入静态数据（json格式）"
          />
        </el-form-item>
      </div>

      <div class="set-table-title">
        <p class="title">{{ activeConfig.test1 }}</p>
        <el-button v-if="activeConfig.showAddBtn" type="primary" @click="onAdd">添加列表</el-button>
      </div>

      <table>
        <thead>
          <th>显示名</th>
          <th>映射字段</th>
          <th>是否有链接</th>
          <th v-if="activeConfig.table.showWidth">宽度百分比</th>
          <th v-if="activeConfig.table.showOperate">操作</th>
        </thead>
        <tbody>
          <tr v-for="(d,index) in form.componentAttr.dataField" :key="index">
            <td>
              <span v-if="!activeConfig.table.labelWritable">{{ d.label }}</span>
              <el-input v-else v-model="d.label" placeholder="请输入" />
            </td>
            <td><el-input v-model="d.field" placeholder="请输入" /></td>
            <td><el-input v-model="d.link" placeholder="请输入链接" /></td>
            <td v-if="activeConfig.table.showWidth">
              <div class="width-percent">
                <el-input v-model="d.width" placeholder="请输入" @input="validateMethod(d)" />
                <span>%</span>
              </div>
            </td>
            <td v-if="activeConfig.table.showOperate">
              <el-button type="text" :disabled="index === 0" @click="onMove(d,index,-1)">上移</el-button>
              <el-button type="text" :disabled="index + 1 === form.componentAttr.dataField.length" @click="onMove(d,index,1)">下移</el-button>
              <el-button type="text" @click="onRemove(d,index)">移除</el-button>
            </td>
          </tr>
        </tbody>

      </table>

      <el-form-item v-if="activeConfig.table.showHeader" label="是否显示表头：">
        <el-radio-group v-model="form.componentAttr.showFieldLabel">
          <el-radio :label="false">无</el-radio>
          <el-radio :label="true">有</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="activeConfig.table.showIndex" label="是否显示序号：">
        <el-radio-group v-model="form.componentAttr.num">
          <el-radio :label="false">无</el-radio>
          <el-radio :label="true">有</el-radio>
        </el-radio-group>
      </el-form-item>

      <p class="title">按钮属性</p>

      <el-form-item label="是否显示刷新：" prop="showRefreshBtn">
        <el-checkbox v-model="form.componentAttr.showRefreshBtn">显示</el-checkbox>
      </el-form-item>

      <el-form-item label="是否显示更多：" prop="componentAttr.moreLink" class="show-more-form">
        <el-checkbox v-model="form.componentAttr.showMoreBtn">显示</el-checkbox>
        <el-input v-model="form.componentAttr.moreLink" class="more-link" placeholder="请输入" />
      </el-form-item>

      <el-form-item class="footer">
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button type="primary" plain @click="onPreview">预览</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>

    <test-dialog v-if="test.visible" :dialog-visible.sync="test.visible" :request-info="test.info" />
    <preview-dialog :dialog-visible.sync="preview.visible" :info="preview.info" @onSubmit="onSubmit" />
  </div>
</template>

<script>
import CoverUpload from './cover-upload'
import PreviewDialog from './preview-dialog.vue'
import TestDialog from './test-dialog.vue'
import validate from './validateMixin'

export default {
  components: {
    CoverUpload,
    PreviewDialog,
    TestDialog
  },
  mixins: [validate],
  props: {},
  data () {
    return {
      form: {
        componentId: '',
        componentName: 'CustomizeList',	// 组件模型
        label: '',	// 标题
        categoryId: '',	// 业务分类Id
        secretLevel: '', // 密级
        iconUrl: '',	// 缩略图
        type: 3,	// 3管理员自定义组件
        componentAttr: {
          reqParams: {
            dataType: '1', // 静态数据2 or 接口请求1
            method: '',
            url: '',
            head: '',
            body: '',
            refreshTime: '', // 标识不刷新
            list: '', // 静态数据
            version: '',	// 版本号
            apiName: ''	// 服务名称
          },
          dataField: [{
            label: '',
            field: '',
            link: ''
          }],
          showFieldLabel: false,
          num: false, // 序号
          showRefreshBtn: false,
          showMoreBtn: false,
          moreLink: ''
        },
        w: 12,
        h: 25
      },
      secretLevelOpts: [],
      categoryOpts: [],
      routerType: '',
      typeOpts: [
        { label: '通用列表', value: 'CustomizeList' },
        { label: '通用图文', value: 'CustomizeNews' }
      ],
      fileOptions: {
        type: '.jpg,.jpeg,.bmp,.gif,.png',
        size: 500 * 1024
      },
      preview: {
        visible: false,
        info: {}
      },
      test: {
        visible: false,
        info: {}
      },
      config: {
        CustomizeList: {
          test1: '设置通用列表',
          showAddBtn: true,
          table: {
            showOperate: true,
            showWidth: true,
            labelWritable: true,
            showHeader: true,
            showIndex: true
          }
        },
        CustomizeNews: {
          test1: '设置通用图文',
          showAddBtn: false,
          table: {
            showOperate: false,
            showWidth: false,
            labelWritable: false,
            showHeader: false,
            showIndex: false
          }
        }
      }
    }
  },
  computed: {
    activeConfig () {
      return this.config[this.form.componentName]
    }
  },
  watch: {
    // 排序号为从1开始的整数
    'form.componentAttr.reqParams.refreshTime': function (n, o) {
      if (n !== '' && !/^$|(^[0-9]\d*$)/.test(n)) {
        this.$nextTick(() => {
          this.form.componentAttr.reqParams.refreshTime = o
        })
      }
    }
  },
  created () {
    this.getMj()
    this.getCategoryList()
    this.form.componentId = this.$route.query.componentId
    if (this.form.componentId) {
      this.getDetail()
    }
  },
  methods: {
    // 获取密级
    getMj () {
      this.$api('common.getMj').then(res => {
        this.secretLevelOpts = res.data
      })
    },
    // 获取分类下拉数据
    getCategoryList () {
      this.$api('componentManage.listCategory').then((res) => {
        this.categoryOpts = res.data.filter(d => d.enableStatus)
      })
    },
    //  获取详情
    getDetail () {
      const { componentId } = this.form
      this.$api('componentManage.detailComponent', { componentId }).then((res) => {
        Object.assign(this.form, res.data)
        this.form.componentAttr = JSON.parse(res.data.componentAttr)
      })
    },

    // 切换模型
    onChangeModel (v) {
      this.form.componentAttr.showFieldLabel = false
      this.form.componentAttr.num = false
      switch (v) {
        case 'CustomizeList':
          this.form.componentAttr.dataField = [
            { label: '', field: '', link: '' }
          ]
          break
        case 'CustomizeNews':
          this.form.componentAttr.dataField = [
            { label: '标题', field: '', link: '' },
            { label: '图片地址', field: '', link: '' },
            { label: '摘要', field: '', link: '' }
          ]
          break
      }
    },
    // 预览
    onPreview () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.preview.visible = true
          const data = { ...this.form }
          data.componentAttr = JSON.stringify(data.componentAttr)
          this.preview.info = data
        } else {
          return false
        }
      })
    },
    // 提交
    onSubmit () {
      this.$refs.form.validate((valid) => {
        console.log(valid)
        if (valid) {
          const attr = JSON.parse(JSON.stringify(this.form.componentAttr))
          // 保存时处理参数 attr.reqParams
          const req = { ...this.form, componentAttr: JSON.stringify(attr) }
          this.$api(`componentManage.${this.form.componentId ? 'updateComponent' : 'addComponent'}`, req)
            .then((res) => {
              this.$message.success('操作成功')
              this.$router.back()
            })
        } else {
          return false
        }
      })
    },
    // 测试接口
    onTest () {
      const validArr = []
      const props = Object.keys(this.rules).filter(v => v.includes('componentAttr.reqParams'))
      this.$refs.form.validateField(props, valid => {
        validArr.push(valid)
      })
      setTimeout(() => {
        if (!validArr.find(v => v)) {
          this.test = {
            visible: true,
            info: this.form.componentAttr.reqParams
          }
        }
      }, 0)
    },
    // 图片上传成功回调
    uploadSuccessFn (url) {
      this.form.iconUrl = url
    },
    // 删除图片
    updateImgFn (imgUrl) {
      this.$confirm('是否删除该封面?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.iconUrl = imgUrl
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {})
    },
    /**
     *  d: 当前操作栏的数据
     *  index: 当前操作栏的index
     *  flag: 1：下移  -1：上移
     */
    onMove (d, index, flag) {
      const list = this.form.componentAttr.dataField
      const toIndex = index + flag
      const target = list[toIndex]
      list[index] = { ...target }
      list[toIndex] = { ...d }
      this.$forceUpdate()
    },
    // 新增
    onAdd () {
      this.form.componentAttr.dataField.push({
        field: '',
        label: '',
        link: '',
        width: ''
      })
    },
    // 移除
    onRemove (d, index) {
      this.form.componentAttr.dataField.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  background: #fff;
  padding: 32px 0 50px 0;
  .title {
    font-size: 16px;
    font-weight: bold;
    color: #191F24;
    line-height: 21px;
    margin: 22px 0 24px 0;
  }
}
::v-deep .el-form {
  width: 705px;
  margin: 0 auto;
  .el-form-item {
    &.footer {
      margin-top: 60px;
    }
    .el-textarea__inner {
      padding: 5px 8px;
    }
  }
  .show-more-form {
    .el-form-item__error {
      margin-left: 62px;
    }
  }
  .request-url {
    .el-form-item__content {
      display: flex;
    }
    .el-button {
      margin-left: 10px;
    }
  }
  .is-required .el-form-item__label {
    &::before {
      display: none;
    }
    &::after {
      content: "*";
      color: #EA340F;
    }
  }
  .el-select {
    width: 100%;
  }
  .el-input.refresh-time {
    width: 106px;
    margin-right: 10px;
  }
  .el-input.more-link {
    width: 234px;
    margin-left: 10px;
  }
  .img-box {
    width: 80px;
    height: 80px;
  }
  .limit-width {
    width: 85px;
  }
  .set-table-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

  table {
    width: 100%;
    margin-bottom: 20px;
    border-collapse: collapse;
    border-left: 1px solid rgba(25, 31, 36, 0.08);
    thead {
      background: #F5F5F5;
      box-shadow: 0px -1px 0px 0px rgba(25, 31, 36, 0.12);
      border-radius: 2px 2px 0px 0px;
      th {
        height: 38px;
        font-size: 14px;
        font-weight: 400;
        color: #191F24;
        line-height: 38px;
        border-right: 1px solid rgba(25, 31, 36, 0.08);
        border-bottom: 1px solid rgba(25, 31, 36, 0.08);
        &:nth-child(1) {
          width: 127px;
        }
        &:nth-child(2) {
          width: 127px;
        }
        &:nth-child(3) {
          width: 166px;
        }
        &:nth-child(4) {
          width: 127px;
        }
        &:nth-child(5) {
          width: 152px;
        }
      }
    }
    td {
        text-align: center;
        padding: 12px 14px;
        border-right: 1px solid rgba(25, 31, 36, 0.08);
        border-bottom: 1px solid rgba(25, 31, 36, 0.08);
        &:last-child {
          display: flex;
          justify-content: space-around;
          .el-button:last-child {
            color: rgba(233, 74, 41, 1);
            &:hover {
              color: #cc5137;
            }
          }
        }
        .width-percent  {
          display: flex;
          align-items: center;
          .el-input {
            margin-right: 3px;
          }
        }
    }
  }

</style>
