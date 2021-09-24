<template>
  <div class="plan-items-wrap-1620646753072" :class="{'no-permission': !leaderInfo.editFlag}">
    <!-- 对此领导没有编辑权限的不可拖拽排序 -->
    <draggable
      :list="itemList"
      ghost-class="ghost"
      :disabled="!leaderInfo.editFlag || itemList.length < 2"
      style="height:100%"
      handle=".mover"
      @end="onDragEnd"
      @start="visible = false"
    >
      <transition-group
        v-popover:popover
        type="transition"
        :name="'flip-list'"
        tag="div"
        class="plan-items"
        @click.self.native="onClickItems(itemList)"
      >
        <div
          v-for="item in itemList"
          :key="item.planId"
          class="item"
          :class="{'updated': isManage && item.showUpdateStatus}"
          @click="onClickItem(item)"
        >
          <div style="width: 100%;">
            <div class="type">{{ type[item.type - 1] }}</div>
            <el-tooltip
              popper-class="popper-address"
              effect="light"
              :content="item.address"
              placement="bottom"
              :open-delay="500"
              :disabled="item.disabledAddress"
            >
              <div
                v-if="item.address"
                class="addr"
                @mouseover="disabledTip($event,item,'disabledAddress')"
              >地址：{{ item.address }}</div>
            </el-tooltip>

            <el-tooltip
              popper-class="popper-content"
              effect="light"
              :content="item.content"
              placement="bottom"
              :open-delay="500"
              :disabled="item.disabledContent"
            >
              <div
                v-if="item.content"
                class="content"
                @mouseover="disabledTip($event,item,'disabledContent')"
              >内容：{{ item.content }}</div>
            </el-tooltip>
          </div>
          <!-- <icon-svg name="tuodong1" class="mover" /> -->
        </div>
      </transition-group>
    </draggable>

    <!-- 对当前领导没有编辑权限，不出现菜单弹框 -->
    <el-popover
      v-if="leaderInfo.editFlag"
      ref="popover"
      v-model="visible"
      :disabled="disabled"
      :visible-arrow="false"
      popper-class="plan-popover"
      placement="right-start"
    >
      <div class="btn-wrap">
        <el-button v-if="!disabledEdit()" type="text" @click="onEdit"><icon-svg name="edit-plan" />编辑详情</el-button>
        <el-button v-if="!disabledCopy()" type="text" @click="onCopy"><icon-svg name="copy-plan" />复制安排</el-button>
        <el-button v-if="!disabledPaste()" type="text" @click="onPaste"><icon-svg name="paste-plan" />粘贴安排</el-button>
        <el-button v-if="!disabledAdd()" type="text" @click="onAdd"><icon-svg name="add-plan" />新建安排</el-button>
      </div>
    </el-popover>

  </div>
</template>

<script>
import dayjs from 'dayjs'
import draggable from 'vuedraggable'
import iconSvg from '@/components/icon-svg'
const dayTypes = ['全天', '上午', '下午']
import { getItem } from '@/utils/storage'
const type = ['总部办公', '总部会议', '京内会议', '京内办事', '京外出差', '出国', '培训', '休假']

export default {
  name: 'PlanItem',
  components: { iconSvg, draggable },
  props: {
    // 当前单元格的所有安排
    itemList: {
      type: Array,
      default () {
        return []
      }
    },
    // 当前单元格的领导信息
    leaderInfo: {
      type: Object,
      default () {
        return {}
      }
    },
    // 当前单元格的所在日期
    date: {
      type: String,
      default: ''
    },
    // 当前单元格的时段
    dayType: {
      type: String,
      default: ''
    },
    // 安排列表是否刷新
    isRefresh: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      type,
      dayTypes,
      curPlan: {},
      visible: false,
      disabled: false
    }
  },
  computed: {
    isManage () {
      const { roles } = JSON.parse(getItem('userInfo'))
      return !!roles.find(v => v.roleKey === 'portal-in-leaderweek')
    }
  },
  watch: {
    isRefresh () {
      this.computeCellHeight()
    }
  },
  created () {},
  mounted () {
    window.addEventListener('resize', this.computeCellHeight)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.computeCellHeight)
  },
  methods: {
    disabledTip (e, item, disabledKey) {
      const ele = e.target
      if (ele.scrollWidth <= ele.clientWidth) {
        this.$set(item, disabledKey, true)
      }
    },
    // 表格刷新时，div高度撑满td
    computeCellHeight () {
      this.$el.style.height = ''
      setTimeout(() => {
        this.$el.style.height = this.$el.parentElement.clientHeight + 'px'
      }, 300)
    },
    disabledEdit () {
      // 点击空白处没有编辑
      return this.isClickEmpty
    },
    disabledCopy () {
      // 点击空白处没有复制
      return this.isClickEmpty
    },
    disabledPaste () {
      // 单元格最多只能有1条安排
      // 没有复制，则粘贴置灰
      return !this.$store.state.cache.copyInfo || this.itemList.length >= 1
    },
    disabledAdd () {
      // 单元格最多只能有1条安排
      return this.itemList.length >= 1
    },
    // 最小维度计划点击
    onClickItem (plan) {
      this.disabled = false
      this.curPlan = plan
      this.isClickEmpty = false
    },
    // 单个领导单个时间段空白处点击
    onClickItems (itemList) {
      this.isClickEmpty = true
      const { copyInfo } = this.$store.state.cache
      this.disabled = copyInfo ? !!itemList.length : true
      if (!copyInfo && !itemList.length && this.leaderInfo.editFlag) this.onAdd()
    },
    onCopy () {
      this.visible = false
      this.$store.commit('setCache', {
        key: 'copyInfo',
        data: this.curPlan
      })
    },
    onPaste () {
      // todo 的存储改为vuex
      this.visible = false
      const { copyInfo } = this.$store.state.cache
      this.$store.commit('clearCache', 'copyInfo')
      const week = dayjs(this.date).day()
      const req = Object.assign({}, copyInfo, {
        recurDay: week ? week : 7,
        planId: '',
        leaderId: this.leaderInfo.leaderId,
        planDate: this.date,
        dayType: this.dayTypes.findIndex(v => v === this.dayType)
      })
      this.$api('leadersWeekly.addPlan', { ...req }).then((res) => {
        this.$message.success('操作成功')
        this.$parent.onLoadPlan() // 日历刷新
      })
    },
    onAdd () {
      this.visible = false
      this.$emit('onAddOrEdit', {
        leaderId: this.leaderInfo.leaderId,
        planDate: this.date,
        dayType: this.dayTypes.findIndex(v => v === this.dayType)
      })
    },
    onEdit () {
      this.visible = false
      this.$emit('onAddOrEdit', this.curPlan)
    },
    onDragEnd () {
      const planIds = []
      this.itemList.map(d => planIds.push(d.planId))
      this.$api('leadersWeekly.orderPlan', { planIds: planIds.join(',') })
    }
  }
}
</script>

<style lang="scss">
.plan-popover {
    min-width: 130px !important;
    padding: 0;
    margin-left: -20px !important;
    margin-top: 20px !important;
}
.popper-address,
.popper-content {
  max-width: 200px;
  white-space: pre-wrap;
  margin-left: 10px;
}
</style>

<style lang="scss" scoped>
.plan-items-wrap-1620646753072:not(.no-permission) {
  cursor: pointer;
  .item:hover {
    background: #EBF8FF;
    .mover {
      opacity: 1;
      &:hover {
        color: #47A6FF;
      }
    }
  }
}
.plan-items-wrap-1620646753072 {
  font-size: 0;
  cursor: default;
  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
  .plan-items {
    min-height: 55px;
    text-align: left;
    width: 215px;
    padding: 4px;
    height: calc(100% - 8px);
  }
}

.item {
    padding: 0.08rem;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4px;
    &:first-child {
      margin-top: 0;
    }
    .mover {
      height: 0.15rem;
      flex-shrink: 0;
      opacity: 0;
    }
    &.updated {
        box-shadow: 0px 0px 8px 0px #0079FF;
    }
    .type-addr {
      width: 100%;
    }
    .type {
        font-size: 15px;
        color: #191F24;
        white-space: nowrap;
        overflow: hidden;
        display: flex;
        align-items: center;
    }
    .addr {
        font-size: 13px;
        color: rgba(25, 31, 36, 0.56);
        margin-top: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .content {
        font-size: 13px;
        margin-top: 2px;
        color: rgba(25, 31, 36, 0.56);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        .icon {
            width: 14px;
            height: 14px;
            margin-right: 3px;
            vertical-align: text-bottom;
        }
    }
}

.btn-wrap {
    button {
        margin: 0;
        width: 100%;
        height: 48px;
        display: block;
        font-size: 16px;
        color: rgba(25, 31, 36, 0.72);
        &.is-disabled {
          opacity: 0.31;
        }
        &:hover {
          background: #EBF8FF;
          color: #1E89FF;
        }
        &.is-disabled:hover {
            background: #fff;
            color: rgba(25, 31, 36, 0.72);
        }
        .icon {
            width: 17px;
            height: 17px;
            margin-right: 9px;
            vertical-align: top;
        }

    }
}
</style>

<style lang="scss">
@import '@/ui/size/mixin.scss';
@mixin del($sc: 1, $fs: 14px){
  .plan-items-wrap-1620646753072 {
    .plan-items {
      min-height: 55px * $sc;
      padding: 4px * $sc;
      height: calc(100% - 8px * #{$sc});
    }

    .item {
      padding: 8px * $sc;
      .mover {
        height: 15px * $sc;
      }
      .type {
          font-size: 15px * $sc;
      }
      .addr {
          font-size: 13px * $sc;
      }
      .content {
          font-size: 13px * $sc;
          .icon {
              width: 14px * $sc;
              height: 14px * $sc;
              margin-right: 3px * $sc;
          }
      }
    }

    .btn-wrap {
      button {
        height: 48px;
        font-size: 16px;
        .icon {
            width: 17px;
            height: 17px;
            margin-right: 9px;
            vertical-align: top;
        }
      }
    }
  }
}
@import '@/ui/size/mixin.scss';
@import '@/ui/size/scale.scss';
</style>
