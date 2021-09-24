<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-04-26 08:52:16
 * @LastEditors: zongmz
 * @LastEditTime: 2021-05-19 17:40:41
-->
<template>
  <div class="mail-list-container">
    <div class="mail-list-top">
      <div class="mail-list-oper">
        <div class="mail-list-choice">
          <el-select v-model="selectVal" placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="mail-list-filter">
          <div v-if="selectVal === '单位'" class="mail-search-unit">
            <icon-svg
              slot="suffix"
              class="mail-search-suffix"
              name="sousuo"
              @click.native="searchUnitClick"
            />
            <el-input
              v-model="unitVal"
              type="text"
              placeholder="全称/简称/代号"
              @input="querySearchAsync"
              @blur="unitBlur"
              @focus="unitFocus"
            />
          </div>
          <div v-if="selectVal === '人员'" class="mail-search-staff">
            <icon-svg
              slot="suffix"
              class="mail-search-suffix"
              name="sousuo"
              @click.native="searchStaffClick"
            />
            <el-input
              v-model="staffVal"
              placeholder="姓名/职务/电话"
              @keyup.enter.native="staffSearch"
            />
          </div>
          <div
            v-if="searchFlag"
            v-loading="loading"
            :class="restaurants.length >= 4?'mail-search-scroll':''"
            class="mail-search"
          >
            <ul v-if="restaurants.length">
              <li
                v-for="ele in restaurants"
                :key="ele.orgId"
                @mousedown="handleSelect(ele)"
                v-html="showSearchResult(ele)"
              />
            </ul>
            <p v-else class="mail-search-null">
              <span v-if="!loading">没有搜到您要查询的内容，换个搜索条件试试</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="mail-list-main">
      <div class="mail-list-tree" :style="{height:`${treeHeight}px`}">
        <el-tree
          ref="treeData"
          class="mail-tree"
          empty-text="加载中，请稍后"
          lazy
          :render-content="renderContent"
          :expand-on-click-node="false"
          :default-expanded-keys="expandChecked"
          :data="treeData"
          :props="defaultProps"
          :load="getOrgTree"
          highlight-current
          node-key="orgId"
          @node-click="handleNodeClick"
        />
      </div>
      <div class="mail-list-content">
        <div class="mail-list-table">
          <el-table
            :data="tableData"
            empty-text="没有搜到您要查询的内容，换个搜索条件试试! "
            style="width: 100%"
          >
            <el-table-column
              v-for="ele in tableColumn"
              :key="ele.prop"
              :prop="ele.prop"
              :label="ele.label"
              :width="ele.width ? ele.width : ''"
              :align="ele.align ? ele.align : ''"
            />
          </el-table>
        </div>
        <div class="mail-list-pagination clearfix">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50, 100]"
            :page-size="pageSize"
            :total="listTotalData"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import iconSvg from '@/components/icon-svg'
export default {
  components: {
    iconSvg
  },
  data () {
    return {
      // 默认选中的值
      expandChecked: [],
      loading: false,
      searchFlag: false,
      // 单位 - 最后一次搜索的内容
      lastSearchVal: '',
      // 单位/人员选择
      typeOptions: [{
        value: '单位',
        label: '单位'
      }, {
        value: '人员',
        label: '人员'
      }],
      // 默认选择是单位
      selectVal: '单位',
      // table数据
      tableData: [],
      // table列渲染项
      tableColumn: [
        { prop: 'serialNum', label: '序号', width: '60', align: 'center' },
        { prop: 'nickName', label: '姓名', width: '130' },
        { prop: 'companyName', label: '部门' },
        { prop: 'positionDesc', label: '职务', width: '150' },
        { prop: 'mobile', label: '手机', width: '130' },
        { prop: 'officePhone', label: '座机', width: '150' },
        { prop: 'ipPhone', label: 'IP电话', width: '150' },
        { prop: 'jhEmail', label: 'JH网邮箱', width: '200' },
        { prop: 'officeAddress', label: '办公地点', width: '180' }
      ],
      // 人员搜索的value值
      staffVal: '',
      // 搜索单位的value值
      unitVal: '',
      // 单位下的输入框防抖时间
      // debounce: 300,
      // 左侧tree的高度，通过动态计算获得
      treeHeight: 0,
      // 数据总量
      listTotalData: 0,
      // 当前页数
      currentPage: 1,
      // 每页展示的数据量 默认10条
      pageSize: 10,
      // 缓存下来的unitData
      unitDataCache: false,
      // 搜索结果
      restaurants: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'orgName',
        isLeaf: (data) => data.nodeType === 'REAL_ORG' && !data.hasChildren
      },
      orgId: ''
    }
  },
  created () {
    // page-frame-content
    this.$nextTick(() => {
      const contentHeight = document.querySelector('.page-frame-content').clientHeight
      const topHeight = document.querySelector('.mail-list-top').clientHeight
      this.treeHeight = contentHeight - topHeight
      window.addEventListener('resize', this.handleHeight, false)
    })
  },
  destroyed () {
    window.removeEventListener('resize', this.handleHeight, false)
  },
  methods: {
    searchStaffClick () {
      this.staffSearch()
    },
    searchUnitClick () {
      const queuryVal = this.unitVal
      this.$api('addrbook.searchUnit', {
        searchValue: queuryVal
      }).then(res => {
        if (res.code === 200) {
          res.data.map(ele => {
            ele.value = ele.orgName
          })
        }
        this.restaurants = res.data
        this.lastSearchVal = queuryVal
        if (res.data.length === 1) {
          // 如果只搜到了一条数据则请求树接口并展开
          this.handleSelect(this.restaurants[0])
        } else {
          // 如果没有搜到数据或者搜到多条数据则将下拉框展开 - 进一步选择
          this.searchFlag = true
        }
      })
    },
    showSearchResult (data) {
      const name = data.orgName
      const nameList = name.split(this.unitVal)
      return nameList.length > 1
        ? nameList.join(
          `<span class="mail-search-checked">${this.unitVal}</span>`
        )
        : name
    },
    renderContent (h, { node, data, store }) {
      return (
        <div class='mail-custom-tree-node'>
          <div class={(data.nodeType !== 'REAL_ORG' || data.hasChildren) ? 'mail-tree-node-icon mail-hide' : 'mail-tree-node-icon'}>
            <i></i>
          </div>
          <span>{node.label}</span>
          <span class='mail-list-count'>{data.employeeCount !== undefined ? `(${data.employeeCount})` : ''}</span>
        </div>
      )
    },
    // 动态计算左侧tree的高度
    handleHeight () {
      const contentHeight = document.querySelector('.page-frame-content').clientHeight
      const topHeight = document.querySelector('.mail-list-top').clientHeight
      this.treeHeight = contentHeight - topHeight
    },
    // 处理列表数据 - 人员：添加序号 / 处理部门名称
    processStaffData (data) {
      data.map((ele, key) => {
        // 序号
        ele.serialNum = key + 1
        // 部门
        const companyName = []
        ele.companyDepts.map(eleChild => {
          companyName.push(eleChild.orgName)
        })
        ele.companyName = companyName.join('>')
      })
    },
    // 处理列表数据 - 单位：添加序号 / 处理部门名称
    processUnitData (data) {
      data.map((ele, key) => {
        // 序号
        ele.serialNum = key + 1
        // 部门 - 非末级将本级部门筛选出来 是末级则保留
        const companyName = []
        ele.companyDepts.map(eleChild => {
          if (eleChild.type !== 1) {
            companyName.push(eleChild.orgName)
          }
        })
        ele.companyName = companyName.join('>')
      })
    },
    // 将节点设置为展开或者关闭状态
    setAllExpand (state) {
      const nodes = this.$refs.treeData.store.nodesMap
      for (const i in nodes) {
        nodes[i].expanded = state
      }
    },
    // 搜索人员的接口处理
    getStaffList (pageNum, pageSize) {
      if (!this.staffVal.trim().length) {
        return
      }
      this.orgId = ''
      this.expandChecked = []
      this.setAllExpand(false)
      this.$refs.treeData.setCurrentKey(null)
      this.$api('addrbook.getUnitList', {
        searchValue: this.staffVal,
        pageNum,
        pageSize
      }).then(res => {
        if (res.code === 200) {
          this.listTotalData = res.total
          this.processStaffData(res.data)
          this.tableData = res.data
        }
      })
    },
    getUnitList (pageNum, pageSize, data) {
      const orgId = data.orgId
      this.$api('addrbook.getUnitList', {
        pageNum,
        pageSize,
        orgId
      }).then(res => {
        if (res.code === 200) {
          this.listTotalData = res.total
          this.processUnitData(res.data)
          this.tableData = res.data
        }
      })
    },
    // 人员-输入内容后的回车事件
    staffSearch () {
      this.getStaffList(this.currentPage, this.pageSize)
    },
    // 每页展示条数事件
    handleSizeChange (val) {
      // 每页 ${val} 条
      this.pageSize = val
      if (this.unitDataCache) {
        this.getUnitList(this.currentPage, val, this.unitDataCache)
      } else {
        this.getStaffList(this.currentPage, val)
      }
    },
    // 跳转页数事件
    handleCurrentChange (val) {
      // 当前页: ${val}`;
      this.currentPage = val
      if (this.unitDataCache) {
        this.getUnitList(val, this.pageSize, this.unitDataCache)
      } else {
        this.getStaffList(val, this.pageSize)
      }
    },
    // 输入框防抖处理
    throttle (queryString, method, content) {
      clearTimeout(method.t)
      method.t = setTimeout(() => {
        method.call(content, queryString)
      }, 300)
    },
    // 单位-输入框输入事件
    querySearchAsync () {
      const queuryVal = this.unitVal
      if (!queuryVal.length) {
        this.loading = false
        this.searchFlag = false
        this.restaurants = []
        return false
      }
      if (this.lastSearchVal !== queuryVal) {
        this.searchFlag = true
        this.loading = true
        this.throttle(queuryVal, this.getSearch)
      } else {
        this.searchFlag = true
      }
    },
    // 执行搜索
    getSearch (queuryVal) {
      this.$api('addrbook.searchUnit', {
        searchValue: queuryVal
      }).then(res => {
        if (res.code === 200) {
          res.data.map(ele => {
            ele.value = ele.orgName
          })
        }
        // this.orgId = res.orgId
        this.restaurants = res.data
        this.lastSearchVal = queuryVal
        this.loading = false
      })
    },
    // 搜索出来的下拉框选择事件
    handleSelect (data) {
      this.unitVal = data.value
      this.searchFlag = false
      this.lastSearchVal = data.value
      const orgId = data.orgId
      this.orgId = data.orgId
      this.$api('addrbook.getUnitTree', {
        autoLocateInTree: true,
        parentId: orgId
      }).then(res => {
        this.treeData = res.data
        const resFinal = res.autoUnfoldingNodes.pop()
        this.expandChecked = res.autoUnfoldingNodes
        setTimeout(() => {
          this.$refs.treeData.setCurrentKey(resFinal)
          this.getUnitList(this.currentPage, this.pageSize, data)
        })
      })
    },
    handleNodeClick (data) {
      this.$refs.treeData.setCurrentKey(data.orgId)
      // this.setAllExpand(false)
      this.unitDataCache = data
      this.currentPage = 1
      /*  此处是否可以优化到 then 内部？ */
      this.listTotalData = 0
      this.getUnitList(this.currentPage, this.pageSize, this.unitDataCache)
    },
    getOrgTree (node, resolve, data = {}) {
      if (node.level === 0) {
        this.$api('addrbook.getUnitTree', data).then(res => {
          if (res.code === 200) {
            resolve(res.data)
          }
        })
      } else {
        if (node.data.nodeType === 'REAL_ORG') {
          const orgId = node.data.orgId
          this.$api('addrbook.getUnitTree', {
            parentId: orgId
          }).then(res => {
            if (res.code === 200) {
              resolve(res.data)
            }
          })
        } else {
          resolve(node.data.children)
        }
      }
    },
    // 单位 失焦事件
    unitBlur () {
      this.searchFlag = false
    },
    unitFocus () {
      this.querySearchAsync()
    }
  }
}
</script>

<style lang="scss">
@mixin del($sc: 1, $fs: 14px){
  .mail-list-container {
    font-size: $fs;
    width: 100%;
    // height: calc(100% - 144px * #{$sc});
    background-color: #fff;
    border-radius: 4px;
    overflow: hidden;
    .mail-list-top {
      padding: 16px * $sc;
      border-bottom: 1px solid #DDDDDD;
      .mail-list-oper {
        display: flex;
        width: 326px * $sc;
        border: 1px solid rgba(25, 31, 36, 0.16);
        border-radius: 4px ;
        .mail-list-choice {
          width: 102px * $sc;
          .el-select {
            .el-input::after {
              display: block;
              content: '';
              width: 1px;
              height: 18px * $sc;
              background-color: rgba(25, 31, 36, 0.16);
              position: absolute;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
            }
            .el-input__inner {
              text-align: center;
              border: 0;
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
            }
          }
        }
        .mail-list-filter {
          flex: 1;
          position: relative;
          .mail-search-unit, .mail-search-staff {
            display: flex;
            align-items: center;
            cursor: pointer;
            .mail-search-suffix {
              color:  rgba(25, 31, 36, 0.24);
              margin: 0 6px * $sc  0 9px * $sc;
            }
          }
          .el-select {
            width: 100%;
          }
          .el-input__inner {
            border: 0;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
          .mail-search {
            width: 406px * $sc;
            min-height: 150px * $sc;
            max-height: 280px * $sc;
            background-color: #fff;
            position: absolute;
            left: 0;
            top: 44px * $sc;
            z-index: 9;
            border-radius: 4px;
            box-shadow: 0px 4px 16px 0px rgba(25, 31, 36, 0.16);
            li {
              width: 100%;
              height: 40px * $sc;
              line-height: 40px * $sc;
              padding: 0 36px * $sc;
              box-sizing: border-box;
              font-weight: 400;
              transition: all .2s;
              cursor: pointer;
              &:hover {
                background-color: #499CF8;
                color: #fff;
                .mail-search-checked {
                  color: #fff;
                }
              }
              .mail-search-checked {
                color: #499CF8;
                transition: all .2s;
              }
            }
            .mail-search-null {
              text-align: center;
              line-height: 150px * $sc;
              color: rgba(25, 31, 36, 0.64);
            }
          }
          .mail-search-scroll {
            overflow-y: scroll;
          }
        }
      }
    }
    .mail-list-main {
      display: flex;
      position: relative;
      &::after {
        content: '';
        display: block;
        width: 1px;
        height: 100%;
        background-color: #ddd;
        position: absolute;
        left: 300px;
        top: 0;
      }
      .mail-list-tree {
        width: 300px;
        flex-shrink: 0;
        background-color: #fff;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
        border-radius: 0px 0px 4px 4px;
        overflow-y: scroll;
        .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
          background-color: #F0F7FF;
          .mail-custom-tree-node {
            font-weight: bold;
            color: #499CF8;
            .mail-list-count {
              font-weight: bold;
              color: #499CF8;
            }
            .mail-tree-node-icon i{
              border-color: #499CF8;
            }
          }
        }
        .mail-tree{
          font-size: $fs;
          .el-tree-node__content{
            height: 36px * $sc;
            padding-bottom: 8px * $sc;
            padding-left: 0 !important;
          }
          .el-tree-node {
            position: relative;
          }
          .el-tree-node__children {
            padding-left: 28px * $sc;
          }
          .el-tree-node::before {
            content: "";
            height: 100%;
            width: 1px;
            position: absolute;
            left: -3px * $sc;
            top: -19px * $sc;
            border-width: 1px;
            border-left: 1px dotted #C0C0C0;
          }
          .el-tree-node:last-child::before {
            height: 38px * $sc;
          }
          .el-tree-node::after {
            content: "";
            width: 14px * $sc;
            height: 20px * $sc;
            position: absolute;
            left: -3px * $sc;
            top: 18px * $sc;
            border-width: 1px;
            border-top: 1px dotted #C0C0C0;
          }
          & > .el-tree-node::after {
            border-top: none;
          }
          & > .el-tree-node::before {
            border-left: none;
          }
          .el-tree-node__expand-icon{
            &.is-leaf{
              color: transparent;
            }
          }
          // .el-tree-node__children {
          //   .el-tree-node {
          //     position: relative;
          //   }
          //   // 竖线
          //   &>.el-tree-node::before {
          //     content: "";
          //     display: block;
          //     height: calc(100% - 23px);
          //     width: 1px;
          //     position: absolute;
          //     left: 44px;
          //     top: 30px;
          //     border-width: 1px;
          //     border-left: .5px dotted #C0C0C0;
          //     z-index: 1;
          //   }
          //   &>.el-tree-node:last-child:before{
          //     border-left: none;
          //   }
          //   .mail-border-none::before{
          //     border-left: none;
          //   }
          // }
        }
        .mail-custom-tree-node {
          display: flex;
          .mail-tree-node-icon {
            width: 20px;
            height: 20px;
            display: block;
            margin-left: 24px;
            i {
              display: block;
              box-sizing: border-box;
              width: 10px;
              height: 10px;
              margin-top: -1px;
              border: 1px solid #E4E6E8;
              border-top: 0;
              border-right: 0;
            }
          }
          .mail-hide {
            display: none;
          }
        }
        .el-tree-node__expand-icon {
          transition: none;
        }
        .el-icon-caret-right:before {
          content: '';
        }
        .el-tree-node__content > .el-tree-node__expand-icon {
          width: 17px;
          height: 17px;
          margin: 7.5px 9.5px 7.5px 17.5px;
          padding: 0;
          // border: 1px solid #DDDFE2;
          box-sizing: border-box;
          position: relative;
          // &::before {
          //   content :'';
          //   display: block;
          //   opacity: 1;
          //   width: 1px;
          //   height: 9px;
          //   background-color: #191F24;
          //   position: absolute;
          //   left: 50%;
          //   top: 50%;
          //   transform: translate(-50%, -50%);
          //   transition: all .15s;
          // }
          // &::after {
          //   content :'';
          //   display: block;
          //   width: 9px;
          //   height: 1px;
          //   background-color: #191F24;
          //   position: absolute;
          //   left: 50%;
          //   top: 50%;
          //   transform: translate(-50%, -50%);
          // }
          & {
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEaADAAQAAAABAAAAEQAAAACOk5MBAAABKUlEQVQ4Ec1TsU4CQRCd2fNuL4YooCHYYKJ2NH6CjY2fwNfY8gcYQ2HhL9jY+A/WhkhMMETuhESC3u4OO8SQY81trrDgVbPz5r2dnbtBsCAiTGezjtHUtrHknB9kAgwGtdreLSJmyAbjj8kzG0gZWi369b9sphRopSZHzcYpJtNp53vxc99sHJYS54uS9BMM0Y0gpc9lFOW50jHr7AtOhAEMfKqLy6tiGhEIKBTFFeWZ7THZcZt2Z/A6HIKbu+v34LjVWkv/mDw9PqxJDtjAzW0U2MP2zOR/OhFA2n1j/sxD9MH+b0YgigEvUxHyX8GtyTIFAsWItzgevY/fpIwOVjtkrcuADb7m80WlXm2vFNZoP0nSrjLmjAi8u8QX2Hs0dxBWdq+rcfyyBGP3b1bTlDnJAAAAAElFTkSuQmCC);
            // &::before{
              // display: none;
            // }
            // &::after{
              // display: none;
            // }
          }
        }
        .el-tree-node__expand-icon.expanded {
          background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEaADAAQAAAABAAAAEQAAAACOk5MBAAABFUlEQVQ4EWNkgIK3Hz6E/v/HYPD//38OmBhu+v9fJgam20JC/PMYGRn/MoIUvnz1+sy/fwzG7OysQB5YCLd+qMzvP38Y/v7580JSQkyFEeiC4F8/f6+REBMhqBFdwbv3Hxj+/vs/len/n39m7Gxs6PJE8UH6/v/7r8r0n5GRhSgd2BQxMjL8Z/jPxoRNjlSxwWMIRng4unkR9M3CuTMZ5GRl4eowDNm/axtckljG4AkT6riE8f//P8T6HZs6YHr7x8TIyHQHlJnIAb9//2EA5uLHQIf8Z33+4tUjdnY2CXAeAhpNDAAZ8PXbt6+cAnyaYB1Ag7jfvn3f/vf/P83//xkwoh3dUKA9f4AueMLMxVknzMX1GABto17OtRiemgAAAABJRU5ErkJggg==);
          // &::before{
            // opacity: 0;
            // height: 0;
          // }
        }
        .el-tree-node__expand-icon.expanded {
          transform: none;
        }
        .el-tree-node__expand-icon.is-leaf {
          // visibility: hidden;
          display: none;
        }
        .mail-list-count {
          margin-left: 5px;
          color: #989898;
        }
        .mail-tree-node-checked {
          font-weight: bold;
          color: #499CF8;
          background-color: #F0F7FF;;
          .mail-list-count {
            color: #499CF8;
          }
          .mail-tree-node-icon {
            border-width: 2px;
            border-color: #499CF8;
          }
          .el-tree-node {
            margin-bottom: 8px;
          }
        }
      }
      .mail-list-content {
        flex: 1;
        background: #FFFFFF;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
        border-radius: 4px;
        position: relative;
        display: flex;
        flex-direction: column;
        .mail-list-table {
          flex: 1;
          position: relative;
          .el-table {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
          .el-table__body-wrapper {
            overflow-y: scroll;
            width: 100%;
            height: calc(100% - 46.5px);
          }
            th{
              background-color: #F0F7FF;
            }
            &::before {
              display: none;
            }
          }
        }
        .mail-list-pagination {
          width: 100%;
          padding: 14px 16px;
          box-sizing: border-box;
          background-color: #fff;
          position: relative;
          &::after {
            content: '';
            display: block;
            width: 100%;
            height: 1px;
            background-color: #ECEDED;
            position: absolute;
            left: 16px;
            top: 0;
          }
          .el-pagination {
            text-align: right;
            font-weight: normal;
          }
        }
      }
    }
    *::-webkit-scrollbar {
      width: 8px;
      background-color: ccc;
    }
  }
}
@import '@/ui/size/mixin.scss';
@import '@/ui/size/scale.scss';
</style>
