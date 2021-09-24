<!--
 * @Descripttion: 待办列表
 * @Author: zongmz
 * @Date: 2021-03-18 18:55:19
 * @LastEditors: zongmz
 * @LastEditTime: 2021-07-21 18:21:45
-->
<template>
  <div class="doAndRead-1620370673495">
    <sp-table
      ref="multipleTable"
      :selection.sync="selection"
      :keys="keyStr"
      uid="doAndRead"
      :is-index="true"
      index-label="编号"
      :table-cols="tableCols"
      :api="onload"
    >
      <div v-if="isToDo" slot="handle">
        <el-button type="primary" @click="onMultOpen">批量打开</el-button>
        <el-button type="primary">标记完成</el-button>
      </div>
    </sp-table>
  </div>
</template>

<script>
import iconSvg from '@/components/icon-svg'
import dayjs from 'dayjs'

export default {
  name: 'List',
  // eslint-disable-next-line vue/no-unused-components
  components: { iconSvg },
  props: {
    isToDo: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tableCols: [],
      selection: this.isToDo ? [] : null
    }
  },
  computed: {
    keysMoreStr () {
      return this.isToDo ? 'urgentLevel,businessType,overDueFlag,showState,timeRange' : ''
    },
    keyStr () {
      return this.isToDo ? 'searchKey,urgentLevel,businessType,overDueFlag,showState,timeRange' : 'searchKey,timeRanges'
    }
  },
  created () {
    this.formatTableCols()
  },
  methods: {
    toJson (str) {
      return str ? JSON.parse(str) : []
    },
    obj (color) {
      return {
        'border': `1px solid rgba(${color}, 1)`,
        'border-radius': '2px',
        'color': `rgba(${color}, 1)`
      }
    },
    onload (params) {
      params.category = this.$route.meta.type
      if (params.timeRange) {
        params.beginTime = params.timeRange ? params.timeRange[0] : null
        params.endTime = params.timeRange ? params.timeRange[1] : null
        delete params.timeRange
      }
      return this.$api('doAndRead.list', params)
    },
    onToggle (row) {
      this.$api(
        'doAndRead.showHide',
        { todoUserId: row.todoUserId, showType: row.showState ? 'HIDE' : 'SHOW' }
      ).then(res => {
        this.$message({
          type: 'success',
          message: row.showState ? '已隐藏' : '已显示在首页待办'
        })
        this.$store.commit('UPDATE_ALL_TABLE_DATA')
      })
    },
    onOpenDetail (row) {
      window.open(row.pcUrl)
      this.$api('doAndRead.setKnown', { todoUserId: row.todoUserId })
    },
    onMultOpen () {
      const selection = this.selection
      if (selection.length) {
        // todo 批量打开，会被浏览器拦截，除非用户手动允许
        this.$api('doAndRead.batchSetKnown', selection.map(d => d.todoUserId))
        selection.map(d => window.open(d.pcUrl))
      } else {
        this.$message({
          type: 'error',
          message: '请勾选您要打开的待办工作'
        })
      }
    },
    formatTableCols () {
      this.tableCols = [
        {
          label: '标题', width: '650px', template: scope => {
            return <div class='title-wrap'>
              <a href='javascript:void(0)'
                on-click={() => this.onOpenDetail(scope.row)}
                class={(this.isToDo && ((scope.row.adventDays <= 5 && scope.row.adventDays > 0) || scope.row.overdueDays > 0) ? 'limit-time' : '')}
              >{scope.row.todoTitle}</a>
              {
                this.isToDo && scope.row.urgentLevel === 3 ? <span class='urgency first'><icon-svg name='teji1'/>特急</span> : null
              }
              {
                this.isToDo && scope.row.urgentLevel === 2 ? <span class='urgency second'><icon-svg name='teji1'/>加急</span> : null
              }
              {
                this.isToDo && scope.row.overdueDays ? <span class='overdue'><icon-svg name='yuqi'/>逾期{scope.row.overdueDays}天</span> : null
              }
              {
                this.isToDo && scope.row.isCare ? <span class='attention'><icon-svg name='guanzhugongzuo1'/></span> : null
              }
              {
                this.isToDo && this.toJson(scope.row.label).length ? this.toJson(scope.row.label).map(t => {
                  return <span class='status' style={this.obj(t.color)}>{ t.name }</span>
                }) : null
              }
            </div>
          }
        },
        { label: '发起人', prop: 'sendUserName' },
        { label: '类型', prop: 'businessType' },
        { label: '接收日期', template: scope => { return <span>{dayjs(scope.row.sendTime).format('YYYY-MM-DD')}</span> } },
        { label: `${this.isToDo ? '限办日期' : '办理日期'}`, template: scope => { return <span>{ scope.row.limitTime ? dayjs(scope.row.limitTime).format('YYYY-MM-DD') : '--'}</span> } }
      ]
      if (this.isToDo) {
        this.tableCols.push({
          label: '操作',
          width: '110px',
          template: scope => {
            return <el-button class='btn-toggle' type='text' on-click={() => this.onToggle(scope.row)}>{ scope.row.showState ? '标记完成' : '显示' }</el-button>
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/ui/flex.scss';
.title-wrap {
  @include flex-single;
    a {
        cursor: pointer;
        color: rgba(25, 31, 36, 0.88);
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        margin-right: 8px;
        &:hover {
            color: #1E89FF;
        }
        &.limit-time {
            color: #EA340F;
        }
    }
    .status {
      text-align: center;
      flex-shrink: 0;
      margin-right: 10px;
      padding:0 7px;
      @include flex-inline;
    }
    .urgency,
    .overdue,
    .attention {
      text-align: center;
      flex-shrink: 0;
      color: #FD3C34;
      margin-right: 10px;
      border: 1px solid #FD3C34;
      @include flex-inline;
    }
    .urgency .second {
      color: #FF6C00;
      border: 1px solid #FF6C00;
    }
}
</style>
<style lang="scss">
@import '@/ui/size/mixin.scss';
@mixin del($sc: 1, $fs: 14px){
  .doAndRead-1620370673495 {
    // 由于不同页面labelItem的文字宽度不一样，所以宽度在各自引用的vue文件里使用scle动态变化
    .sp-form-box .expand-box-dis .el-form-item__label{
      width: 71px * $sc;
    }
    .attention,
    .urgency,
    .overdue{
        padding: 0 2px * $sc;
        height: 16px * $sc;
        line-height: 16px * $sc;
        border-radius: 2px * $sc;
        font-size: 12px * $sc;
        .icon {
          width: 12px * $sc;
          height: 12px * $sc;
        }
    }
  }
}

@import '@/ui/size/mixin.scss';
@import '@/ui/size/scale.scss';
</style>
