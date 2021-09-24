<template>
  <div class="businessManagement">
    <div>企业信息</div>
    <a-divider />
    <a-descriptions title="企业基本信息" layout="vertical">
      <a-descriptions-item label="企业全称">
        {{tree.name}}
      </a-descriptions-item>
      <a-descriptions-item label="企业简称">
        {{tree.nameShort}}
      </a-descriptions-item>
      <a-descriptions-item label="上级企业">
        {{tree.parentName}}
      </a-descriptions-item>
      <a-descriptions-item label="集团统一编码">
        {{tree.no}}
      </a-descriptions-item>
      <a-descriptions-item label="统一社会信息代码">
        {{tree.iamOrgId}}
      </a-descriptions-item>
      <a-descriptions-item label="企业类型">
        {{tree.updateTime}}
      </a-descriptions-item>
      <a-descriptions-item label="排序号">
        {{tree.showOrder}}
      </a-descriptions-item>
      <a-descriptions-item label="状态">
        {{tree.updateTime}}
      </a-descriptions-item>
    </a-descriptions>
    <a-divider />
    <!-- <a-descriptions title="服务商信息" layout="vertical" :column='1'>
      <a-descriptions-item label="国内机票服务商">
        {{treeSelected.name}}
      </a-descriptions-item>
      <a-descriptions-item label="服务要求">
        {{treeSelected.nameShort}}
      </a-descriptions-item>
      <a-descriptions-item label="上级企业">
        不知道字段
      </a-descriptions-item>
      <a-descriptions-item label="国外机票服务商">
        {{treeSelected.showOrder}}
      </a-descriptions-item>
      <a-descriptions-item label="服务要求">
        不知道字段
      </a-descriptions-item>
    </a-descriptions>
    <a-divider /> -->
    <a-descriptions title="管理员信息" layout="vertical" :column='1'>
    </a-descriptions>
     <a-table :columns="columns" :data-source="tableData" :pagination='false' rowKey='id'>
      </a-table>
  </div>
</template>

<script>
import { getCategoryById } from '@/api/organizationManagement/corporateInfo'
export default {
  name: 'businessManagement',
  props: {
    treeSelected: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tree: {},
      columns: [{
        title: '管理员账号',
        dataIndex: 'user',
        key: 'user'
      },
      {
        title: '管理员姓名',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '电话',
        dataIndex: 'mobiel',
        key: 'mobiel'
      },
      {
        title: '手机号码',
        dataIndex: 'tel',
        key: 'tel'
      },
      {
        title: '电子邮箱',
        dataIndex: 'email',
        key: 'email'
      }
      ],
      tableData: []
    }
  },
  watch: {
  },
  created() {
    this.tree = JSON.parse(JSON.stringify(this.treeSelected))
    this.parentidFindName()
  },
  methods: {
    // onLocat() {
    //   getCategoryById({ id: this.treeSelected[0] }).then(res => {
    //     if (res.code == '1000000') {
    //       this.treeSelected = JSON.parse(JSON.stringify(res.model))
    //       this.parentidFindName()
    //     } else {
    //       // message.error(res.resultStr)
    //     }
    //   })
    // },
    parentidFindName() {
      if (this.treeSelected.parentId == null) {
        this.tree.parentName = '无'
        return false
      }
      getCategoryById({ id: this.treeSelected.parentId }).then(res => {
        if (res.code == '1000000') {
          this.tree = Object.assign({ }, this.tree, { parentName: res.model.name })
        } else {
          // message.error(res.resultStr)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
