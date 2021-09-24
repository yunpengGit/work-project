<template>
  <div class="warper-box">
    <sp-table
      keys="subjectLike,
        ownerNameLike,
        labelIdsIn,
        authorityTypesIn,
        creatorNameLike"
      keys-more="dateFrom,dateFrom"
      :is-index="true"
      :table-cols="tableCols"
      :api="onload"
    />
    <div class="edit-form">
      <el-drawer
        title="日程详情"
        direction="rtl"
        :visible.sync="detailDrawer"
        size="40%"
        :wrapper-closable="false"
      >
        <detail-form
          :event-id="eventId"
          :event-date="eventDate"
          :value="detailDrawer"
          show-creator
          @detailDrawerClose="detailDrawerClose"
        />
      </el-drawer>
    </div>
  </div>
</template>

<script>
import detailForm from '../../schedule/eventManage/detail'
export default {
  components: {
    detailForm
  },
  data () {
    return {
      // 表格
      tableCols: [
        {
          label: '标题',
          prop: 'subject',
          template: (scope) => {
            return (
              <div>
                <el-button type='text' on-click={() => this.detail(scope.row)}>
                  {scope.row.subject}
                </el-button>
              </div>
            )
          }
        },
        { label: '拥有者', prop: 'ownerName' },
        { label: '日程类型', prop: 'label.name' },
        {
          label: '公开范围',
          template: (scope) => this.authorityTypeObj[scope.row.authorityType]
        },
        { label: '创建人', prop: 'creatorName' },
        { label: '创建时间', prop: 'createdTime' }
      ],
      authorityTypeObj: {
        DEFAULT: '分享可见',
        PRIVATE: '私密'
      },
      detailDrawer: false,
      eventId: null,
      eventDate: null
    }
  },
  methods: {
    onload (params) {
      if (params.dateFrom) {
        params.createdDateFrom = params.dateFrom[0]
        params.createdDateTo = params.dateFrom[1]
        delete params.dateFrom
      }
      return this.$api('schedule.getOriginalEvents', params)
    },
    detail (data) {
      this.eventId = data.eventId
      this.detailDrawer = true
    },
    detailDrawerClose () {
      this.detailDrawer = false
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-date-editor .el-input__inner {
    padding: 0 30px;
  }
}
</style>
