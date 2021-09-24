<template>
  <div class="privacy" :style="'height:' + mainHeight">
    <div class="btn-box">
      <el-button @click="onReset">重置</el-button>
      <el-button type="primary" @click="onSave">保存</el-button>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="同企业" name="same">
        <sp-table
          row-key="viewerLevel"
          :page-hieght="false"
          :table-cols="tableCols"
          :expand-row-keys="expandRow.same"
          :api="getPrivacySame"
        >
          <div slot-scope="{row}" class="checkbox-setting-wrap">
            <div v-for="item in row.privacyLevelRules" :key="item.id">
              <span>{{ item.anotherLevel }}级</span>
              <el-checkbox :value="isCheckAll(item)" @change="onCheckAll(item)">全选</el-checkbox>
              <el-checkbox v-for="data in item.privacyFieldSettings" :key="item.id + data.fieldName" v-model="data.checked">{{ data.fieldDesc }}</el-checkbox>
            </div>
          </div>
        </sp-table>
      </el-tab-pane>
      <el-tab-pane label="跨企业" name="cross">
        <sp-table
          row-key="viewerLevel"
          :table-cols="tableCols"
          :expand-row-keys="expandRow.cross"
          :page-hieght="false"
          :api="getPrivacyCross"
          :table-hieght="tableHieght"
        >
          <div slot-scope="{row}" class="checkbox-setting-wrap">
            <div v-for="item in row.privacyLevelRules" :key="item.id">
              <span>{{ item.anotherLevel }}级</span>
              <el-checkbox :value="isCheckAll(item)" @change="onCheckAll(item)">全选</el-checkbox>
              <el-checkbox v-for="data in item.privacyFieldSettings" :key="item.id + data.fieldName" v-model="data.checked">{{ data.fieldDesc }}</el-checkbox>
            </div>
          </div>
        </sp-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'Privacy',
  props: {},
  data () {
    return {
      activeName: 'same',
      mainHeight: '',
      tableHieght: '',
      tableCols: [],
      list: {
        same: [],
        cross: []
      },
      defaultList: {
        same: '',
        cross: ''
      },
      expandRow: {
        same: [],
        cross: []
      }
    }
  },
  computed: {
    isCheckAll () {
      return (item) => {
        return !(item['privacyFieldSettings'].find(d => !d.checked))
      }
    }
  },
  watch: {},
  created () {
    // this.getPrivacy()
    this.formatTableCols()
  },
  mounted () {
    window.addEventListener('resize', this.heightFn)
    this.heightFn()
  },
  methods: {
    heightFn () {
      const pageHeight = document.querySelector('.page-frame-content').clientHeight
      this.mainHeight = pageHeight - 20 + 'px'
      setTimeout(() => {
        const tabHeadHeight = document.querySelector('el-tabs__header') ? document.querySelector('el-tabs__header').clientHeight : ''
        document.querySelector('el-tabs__header') ? this.tableHieght = pageHeight - tabHeadHeight - 20 + 'px' : this.tableHieght = ''
      }, 100)
    },
    getPrivacySame () {
      return this.$api('addrbook.privacyList').then(res => {
        const rcb = {}
        rcb.rows = res.data.privacyLevelsInSameCompany
        const same = JSON.stringify(res.data.privacyLevelsInSameCompany)
        this.defaultList.same = same
        this.list.same = JSON.parse(same)
        return rcb
      })
    },
    getPrivacyCross () {
      return this.$api('addrbook.privacyList').then(res => {
        const rcb = {}
        rcb.rows = res.data.privacyLevelsInCrossCompany
        const cross = JSON.stringify(res.data.privacyLevelsInCrossCompany)
        this.defaultList.cross = cross
        this.list.cross = JSON.parse(cross)
        return rcb
      })
    },
    onReset () {
      this.$store.commit('UPDATE_ALL_TABLE_DATA')
      // this.list[this.activeName] = JSON.parse(this.defaultList[this.activeName])
    },
    onSave () {
      // 过滤出所有选中项
      const data = this.list[this.activeName]
      const selected = []
      data.map(d => {
        d['privacyLevelRules'].map(v => {
          const viewPermitFields = []
          v['privacyFieldSettings'].map(s => { s.checked && viewPermitFields.push(s.fieldName) })
          selected.push({ id: v.id, viewPermitFields })
        })
      })

      this.$api('addrbook.setPrivacyList', selected)
        .then(() => {
          this.$message.success('保存成功')
          this.$store.commit('UPDATE_ALL_TABLE_DATA')
        })
        .catch(() => { this.$message.error('保存失败，请稍后再试') })
    },
    onCheckAll (item) {
      const status = this.isCheckAll(item)
      // eslint-disable-next-line no-return-assign
      item['privacyFieldSettings'].map(d => d.checked = !status)
    },
    onOpen (row) {
      const expand = this.expandRow[this.activeName]
      const isExpand = expand.includes(row.viewerLevel)
      if (!isExpand) {
        expand.push(row.viewerLevel)
      } else {
        expand.splice(expand.indexOf(row.viewerLevel), 1)
      }
    },
    formatTableCols () {
      this.tableCols = [
        { label: '隐私级别', width: '200px',
          template: scope => {
            return <span>{scope.row.viewerLevel}级{scope.row.viewerLevel === 0 ? '（高）' : ''}</span>
          }
        },
        { label: '级别说明', prop: 'levelDesc' },
        { label: '可见信息', width: '100px', template: scope => {
          return <el-button type='text' class='btn-set' on-click={() => this.onOpen(scope.row)}>设置</el-button>
        } }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.privacy {
  background: #fff;
  position: relative;
  .btn-box {
    position: absolute;
    z-index: 9;
    right: 10px;
    top:16px;
  }
}
::v-deep .el-tabs {
  .el-tab-pane {
    padding: 9px 24px 0 24px;
  }
  .el-tabs__item {
    padding: 0 32px;
    line-height: 25px;
    font-size: 16px;
  }
  .el-tabs__nav-wrap.is-top {
    padding-left: 40px;
    padding-top: 24px;
  }
  .el-tabs__nav-wrap::after {
    height: 1px;
  }
  .el-tabs__active-bar {
    height: 3px;
  }
  .btn-set {
    color: #4285F4;
  }
  .el-checkbox {
    margin-right: 0;
    margin-left: 40px;
  }
  .el-table__expanded-cell {
    background: rgba(25, 31, 36, 0.08);
    &:hover {
      background-color: rgba(25, 31, 36, 0.08) !important;
    }
  }
  .el-table__expand-icon {
    display: none;
  }
  .sp-pagination {
    display: none;
  }
  .sp-page-box {
    border: 1px solid rgba(25, 31, 36, 0.12);
    border-top: 0;
  }
}
</style>
