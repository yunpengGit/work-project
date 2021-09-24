<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-05-30 18:12:46
 * @LastEditors: peng
 * @LastEditTime: 2021-09-14 15:14:16
-->
<template>
  <div class="content-box">
    <div class="group">
      <div class="label">
        <span class="title req">栏目选择</span>
        <!-- <el-button type="text" @click="add"><icon-svg name="xinjian" />新增</el-button> -->
      </div>
      <treeselect
        v-model="catalogId"
        :class="{'require': isRequire}"
        :options="catalogsTreeData"
        :default-expand-level="1"
        no-options-text="没有可选项！"
        placeholder="请选择栏目"
        @select="select"
      />
      <div v-show="isRequire" class="require-text">请选择栏目</div>
      <el-checkbox
        :value="contentsQueryScope==='INCLUDES_CHILDREN'"
        @input="change"
      >
        包含子栏目
      </el-checkbox>
      <div class="btn-box">
        <el-button @click="resetForm('form')">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: {
    Treeselect
  },
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      catalogId: null,
      catalogName: '',
      catalogsTreeData: [],
      contentsQueryScope: 'SELF_ONLY',
      isRequire: false
    }
  },
  watch: {
    config (n, o) {
      if (n.config) {
        this.catalogId = n.config.catalogId
        this.catalogName = n.config.catalogName
        this.contentsQueryScope = n.config.contentsQueryScope
      } else {
        this.catalogId = null
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.$api('news.userCatalogsTree', { filterType: 'VIEWABLE_ENABLED' }).then(res => {
        const data = res.data
      ;(function recursive (data) {
          data && data.forEach(ele => {
            if (ele.status === 0) {
              ele.isDisabled = true
            }
            ele.label = ele.name
            if (ele.children) {
              if (ele.children.length === 0) {
                delete ele.children
              } else {
                recursive(ele.children)
              }
            }
          })
        })(data)
        this.catalogsTreeData = data
      })
    },
    select (node, instanceId) {
      this.catalogName = node.label
    },
    change () {
      if (this.contentsQueryScope === 'INCLUDES_CHILDREN') {
        this.contentsQueryScope = 'SELF_ONLY'
      } else {
        this.contentsQueryScope = 'INCLUDES_CHILDREN'
      }
    },
    submitForm () {
      // console.log(this.components)
      if (this.catalogId) {
        this.isRequire = false
      } else {
        this.isRequire = true
        return
      }
      const data = {
        catalogId: this.catalogId,
        catalogName: this.catalogName,
        contentsQueryScope: this.contentsQueryScope
      }
      // console.log(data)
      this.$emit('editComponent', data)
    },
    resetForm () {
      this.$emit('exitEditItem')
    }
  }
}
</script>
<style lang="scss" scoped>
@import './setting.scss';
.label{
  display: flex;
  justify-content: space-between;
  .el-button {
    .icon{
      margin-right: 6px;
      width: 14px;
      height: 14px;
      vertical-align: top;
    }
  }
}
.group{
  .req::before{
    content: "*";
    color: #EA340F;
    margin-right: 4px;
  }
  ::v-deep .vue-treeselect.require .vue-treeselect__control{
    border-color: #EA340F;
  }
  .require-text{
    margin: 0 14px;
    color: #EA340F;
  }
  .vue-treeselect,
  .el-checkbox{
    margin: 4px 14px;
  }
}
.btn-box{
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 10px;
  text-align: right;
}
</style>
