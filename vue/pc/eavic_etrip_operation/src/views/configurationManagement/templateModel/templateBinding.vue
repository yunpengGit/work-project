<template>
  <div class="templateBinding content">
    <div class="left" v-show="treeCircle">
      <a-input-search style="margin-bottom: 8px"  @search="onChangeTreeSearch"/>
      <a-tree :showLine="true" :tree-data="treeData" :load-data="onLoadData"
        :expanded-keys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        @select="selectedTreeAuthority"
        @expand="onExpand"
        :replaceFields="{title:'name', key:'id'}"
      >
        <div slot="name" slot-scope="{ name }">
          <span v-if="name.indexOf(searchValue) > -1">
            {{ name.substr(0, name.indexOf(searchValue)) }}
            <span style="color: #f50">{{ searchValue }}</span>
            {{ name.substr(name.indexOf(searchValue) + searchValue.length) }}
          </span>
          <span v-else>{{ name }}</span>
        </div>
      </a-tree>
    </div>
      <a-icon :class="treeCircle?'treeCircle':'treeNone'" :type="treeCircle?'left-circle':'right-circle'" theme="filled" :style="{fontSize:'20px'}" @click="()=> treeCircle = !treeCircle" />
    <div class="right" >
    <div v-if="treeSelected != ''">
      <div>模板关系绑定</div>
      <a-divider />
      <div class="table-page-search-wrapper">
       <a-form layout="inline" >
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="ID">
              <a-input
                v-model="queryParam.id"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="模板名称">
              <a-input
                v-model="queryParam.typeName"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="模板类型">
              <a-select v-model="queryParam.templateTypeId">
                <a-select-option value=''>
                  所有
                </a-select-option>
                <a-select-option v-for="item in modelList" :key="item.id" :value='item.id'>
                  {{item.typeName}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <span class="table-page-search-submitButtons" :style="{ float: 'right', overflow: 'hidden' }">
              <a-button type="primary" html-type="submit" icon="search" @click="$refs.table.refreshFn(true)">
                  查询
              </a-button>
              <a-button @click="reset">重置</a-button>
            </span>
          </a-col>
        </a-row>
       </a-form>
       <div class="btn-box">
        <a-button type="primary" icon="plus" @click="add">添加</a-button>
        <a-button type="danger"  icon="delete" :disabled='selectedRowKeys.length == 0' @click="batchDele">批量解绑</a-button>
       </div>
      </div>
      <s-table
        :columns="columns"
        ref="table"
        size="default"
        rowKey = "id"
        :alert="options.alert"
        :rowSelection="options.rowSelection"
        :data="loadData"
        showPagination="auto"
      >
        <span slot="name" slot-scope="text, record" class="btn">
          <span class="blue" @click="detail(record)" v-text="record.templateId!=null?(TemplateList.filter((item)=>item.id == record.templateId))[0].name:''"></span>
          <!-- <span class="blue" @click="detail(record)">{{record.name}}</span> -->
        </span>
        <span slot="updateName" slot-scope="text, record">
          <div>{{record.updateName}}</div>
          <div>{{record.updateTime}}</div>
        </span>
        <span slot="templateTypeId" slot-scope="text, record">
          <span v-text="record.templateTypeId!=null?(modelList.filter((item)=>item.id == record.templateTypeId))[0].typeName:''"></span>
        </span>
        <span slot='operating' slot-scope="text, record" class="btn">
          <span class="red" @click="untieRowIndex(record)"><a-icon type='delete'/>解绑</span>
        </span>
      </s-table>
    </div>
    </div>
    <a-drawer
      :title="drawerTitle"
      :width="780"
      :body-style="{ paddingBottom: '80px' }"
      :visible="visible"
      @close="()=>visible = false"
    >
      <div class="table-page-search-wrapper" v-if="drawerStatus == 'detail'">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="24" :sm="24">
              <a-form-item label="模板名称">
                <div>{{rowIndexData.name}}</div>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="模板类型">
                <div v-text="rowIndexData.templateTypeId!=null?(modelList.filter((item)=>item.id == rowIndexData.templateTypeId))[0].typeName:''"></div>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="模板序号">
                <div>{{rowIndexData.templateNum}}</div>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24" :style="{marginBottom: '20px'}">
              <a-form-item label="上传的文件">
                <div>{{rowIndexData.filePath}}</div>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="上传图片">
                <div><img :src='rowIndexData.img'  @click="handlePreview({url:rowIndexData.img})"/></div>
              </a-form-item>
            </a-col>
          </a-row>
          <div class="btn" style="marginTop:90px">
            <a-button @click="()=> visible = false"><a-icon type="right"/>取消</a-button>
          </div>
        </a-form>
      </div>
      <div v-if="visible && drawerStatus == 'add'">
        <a-transfer
          class="tree-transfer"
          :titles="['要添加的模板', '已选择的模板']"
          :showSearch="true"
          :data-source="transferDataSource"
          :target-keys="targetKeys"
          :render="item => item.title"
          :show-select-all="false"
          @change="onChange"
        >
          <template
            slot="children"
            slot-scope="{
              props: { direction, selectedKeys },
              on: { itemSelect },
            }"
          >
          <a-tree
            v-if="direction === 'left'"
            blockNode
            checkable
            checkStrictly
            defaultExpandAll
            :checkedKeys="[...selectedKeys, ...targetKeys]"
            :treeData="CategoryTemplateList"
            @check="(_, props) => {onChecked(_, props, [...selectedKeys, ...targetKeys],itemSelect)}"
            @select="(_, props) => {onChecked(_, props, [...selectedKeys, ...targetKeys],itemSelect)}"
          />
          </template>
        </a-transfer>
        <div class="btn" style="margin-top:30px">
          <a-button type="primary" icon="save" @click="bindSave">保存</a-button>
          <a-button @click="()=> visible = false"><a-icon type="right"/>取消</a-button>
        </div>
      </div>
    </a-drawer>
    <a-modal :visible="previewVisible" :footer="null" @cancel="()=> previewVisible = false">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
import { getPageByParams, getTreeByParams, getListByParams, save, getListByParamsTemplate, deleteById, deleteByIds } from '@/api/configurationManagement/templateModel/templateBinding'
import { getListByParamsTemplateType } from '@/api/configurationManagement/templateModel/templateTemplate'

import { getCategoryListByParentId } from '@/api/organizationManagement/corporateInfo'
import { STable } from '@/components'
function isChecked(selectedKeys, eventKey) {
  return selectedKeys.indexOf(eventKey) !== -1
}

function handleTreeData(data, targetKeys = []) {
  data.forEach(item => {
    item.disabled = targetKeys.includes(item.key)
    if (item.children) {
      handleTreeData(item.children, targetKeys)
    }
  })
  return data
}

export default {
  name: 'templateBinding',
  components: {
    STable
  },
  data() {
    return {
      treeCircle: true,
      treeData: [],
      dataList: [], // 用于树搜索的数据存储
      treeHide: true,
      expandedKeys: [0],
      autoExpandParent: true,
      searchValue: '',
      treeSelected: '',
      queryParam: {},
      modelList: [],
      drawerTitle: '',
      visible: false,
      drawerStatus: '',
      selectedRowKeys: [],
      selectedRows: [],
      options: {
        alert: { show: false, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      loadData: parameter => {
        this.queryParam.categoryId = this.treeSelected
        return getPageByParams(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.model
          })
      },
      columns: [{
        title: 'ID',
        dataIndex: 'id'
      },
      {
        title: '模板名称',
        dataIndex: 'name',
        scopedSlots: { customRender: 'name' }
      },
      {
        title: '模板类型名称',
        dataIndex: 'templateTypeId',
        scopedSlots: { customRender: 'templateTypeId' }
      },
      {
        title: '修改人',
        dataIndex: 'updateName',
        scopedSlots: { customRender: 'updateName' }
      },
      {
        title: '操作',
        dataIndex: 'operating',
        width: 180,
        scopedSlots: { customRender: 'operating' }
      }],
      drawerForm: this.$form.createForm(this, { name: 'drawerForm' }),
      rowIndexData: {},
      logoImageUrl: '',
      previewVisible: false,
      previewImage: '',
      getImgAdress: file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => resolve(reader.result)
          reader.onerror = error => reject(error)
        })
      },
      targetKeys: [],
      selectedKeys: [],
      templateTreeData: [],
      TemplateList: []
    }
  },
  created() {
    this.getLimitgroupTree(0, '')
    this.getmodelList()
    this.getListTemplate()
  },
  computed: {
    CategoryTemplateList: {
      get () {
        return handleTreeData(this.templateTreeData, this.targetKeys)
      },
      set (val) {
        return val
      }
    },
    transferDataSource() {
      const transferDataSource = []
      function flatten(list = []) {
        list.forEach(item => {
          transferDataSource.push(item)
          flatten(item.children)
        })
      }
      flatten(JSON.parse(JSON.stringify(this.templateTreeData)))
      return transferDataSource
    }
  },

  methods: {
    getmodelList() {
      getListByParamsTemplateType({}).then(res => {
        if (res.code == 1000000) {
          this.modelList = res.model
        }
      })
    },
    getListTemplate() {
      getListByParamsTemplate({}).then(res => {
        if (res.code == 1000000) {
          this.TemplateList = res.model
        }
      })
    },
    onChange(targetKeys) {
      this.targetKeys = targetKeys
    },
    onChecked(_, e, checkedKeys, itemSelect) {
      const { eventKey } = e.node
      itemSelect(eventKey, !isChecked(checkedKeys, eventKey))
    },
    reset() {
      this.queryParam = {}
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    add() {
      this.drawerStatus = ''
      this.visible = true
      this.drawerStatus = 'add'
      this.getCategoryTemplateMid()
      this.drawerTitle = '添加模板绑定关系'
      this.drawerForm.resetFields()
      this.getListTempalte()
    },
    getListTempalte() {
      getListByParams({ categoryId: this.treeSelected }).then(res => {
        if (res.code == 1000000) {
          const tagSelectArr = []
          res.model.map(item => {
            tagSelectArr.push(item.templateId + '')
          })
          this.targetKeys = JSON.parse(JSON.stringify(tagSelectArr))
        }
      })
    },
    getCategoryTemplateMid() {
      getTreeByParams({}).then(res => {
        if (res.code == 1000000) {
          this.templateTreeData = JSON.parse(JSON.stringify(res.model)).map(item => {
            item.key = item.id + ''
            item.title = item.typeName
            item.children = item.templateList
            item.children.map(itemChild => {
              itemChild.key = item.id + ''
              itemChild.title = itemChild.name
            })
            return item
          })
        }
      })
    },
    untieRowIndex(rowIndex) {
      this.$confirm({
        title: '解绑',
        content: `确认解除此公司的服务关系？`,
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          deleteById({ id: rowIndex.id }).then((res) => {
            if (res.code === 1000000) {
              this.$message.success(res.resultStr)
              this.selectedRowKeys = []
              this.selectedRows = []
              this.$refs.table.refreshFn()
            }
          })
        },
        onCancel() {}
      })
    },
    bindSave() {
      const mapList = JSON.parse(JSON.stringify(this.templateTreeData))
      const newObj = []
      this.targetKeys.map(itemKey => {
        mapList.map(itemList => {
          if (itemList.templateList.length == 0 && itemKey == itemList.id) {
            const params = {
              categoryId: this.treeSelected,
              templateTypeId: itemList.id,
              templateIds: []
            }
            newObj.push(params)
          }
          itemList.templateList.map(item => {
            if (itemKey == item.id) {
              const params = {
                categoryId: this.treeSelected,
                templateTypeId: item.templateTypeId,
                templateIds: [item.id]
              }
              newObj.push(params)
            }
          })
        })
      })
      save(newObj).then(res => {
        if (res.code == 1000000) {
          this.$message.success(res.resultStr)
          this.$refs.table.refreshFn()
          this.visible = false
        }
      })
    },
    batchDele() {
      this.$confirm({
        title: '解绑',
        content: `确定要解除这${this.selectedRowKeys.length}条公司的服务关系？`,
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          const data = { ids: this.selectedRowKeys + '' }
          deleteByIds(data).then((res) => {
            if (res.code === 1000000) {
              this.$message.success(res.resultStr)
              this.selectedRowKeys = []
              this.selectedRows = []
              this.$refs.table.refreshFn()
            }
          })
        },
        onCancel() {}
      })
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getImgAdress(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    detail(rowIndex) {
      this.visible = true
      this.drawerStatus = 'detail'
      this.drawerTitle = '模板详情'
      this.rowIndexData = rowIndex
    },
    onLoadData(treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        getCategoryListByParentId({ parentId: treeNode.dataRef.id, type: 2 }).then(res => {
          if (res.code == '1000000') {
            treeNode.dataRef.children = JSON.parse(JSON.stringify(res.model))
          } else {
          // message.error(res.resultStr)
          }
        })
        setTimeout(() => {
          this.treeData = [...this.treeData]
          console.log(this.treeData)
          resolve()
        }, 200)
      })
    },
    getLimitgroupTree(parentId, likeName) {
      getCategoryListByParentId({ parentId: parentId, type: 2, likeName: likeName }).then(res => {
        if (res.code == '1000000') {
          this.treeData = JSON.parse(JSON.stringify(res.model))
        }
      })
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onChangeTreeSearch(e) {
      const value = e
      if (e == '') {
        this.getLimitgroupTree(0, '')
        return false
      }
      // 搜过企业名称 likeName
      this.getLimitgroupTree('', value)
    },
    selectedTreeAuthority(selectedKeys) {
      this.treeSelected = selectedKeys[0]
      if (selectedKeys.length == 0) {
        this.treeSelected = ''
      } else {
        this.$nextTick(() => {
          this.$refs.table.refreshFn()
        })
      }
    },
    iconClickTreeHide() {
      this.treeHide = !this.treeHide
    }
  }
}
</script>

<style scoped lang="less">
@import './index.less'; // 这个分号一定要写，要不会报错
.content{
  margin: -16px -24px;
  display: flex;
  min-height: 100%;
  background: #f0f2f5;
  position: relative;
  .left{
    margin-right: 10px;
    width: 260px;
    flex-shrink: 0;
    overflow: hidden;
  }
  .right{
    flex: 1;
  }
  .left,.right{
    padding: 24px;
    background: rgb(255, 255, 255);
  }
  .treeCircle {
    position: absolute;
    left: 260px;
    top: 10px;
  }
  .treeNone {
    position: absolute;
    left: 26px;
  }
}
</style>
