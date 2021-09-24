<template>
  <div class="set-work">
    <div class="top-wrap">

      <div class="title">
        <span>已选常办业务</span>
        <span>（{{ selectedWork.length }}）</span>
        <span class="tip">显示在首页常办业务区域</span>
      </div>
      <div class="selected-list">
        <draggable
          :list="selectedWork"
          ghost-class="ghost"
          style="height:100%"
        >
          <transition-group
            type="transition"
            :name="'flip-list'"
            tag="div"
          >
            <div
              v-for="item in selectedWork"
              :key="item.appOrResourceId"
              class="item"
              @click="onDeleteSelected(item)"
            >
              <!-- key不能使用index，不然transition不生效 -->
              <span class="text ell">{{ item.appOrResourceName }}</span>
              <span class="icon-del">-</span>
            </div>

          </transition-group>
        </draggable>
      </div>
    </div>

    <div class="bottom-wrap">
      <div class="title">业务操作列表</div>
      <div class="option-list">

        <div v-for="group in allWork" :key="group.appId" class="group">
          <div class="header">
            <el-checkbox v-model="group.selected" :disabled="!!group.disabled" @change="checkAllFn(group.selected,group)" />
            <div class="img-wrap">
              <img :src="group.appIcon" :alt="group.appName">
              <p class="ell">{{ group.appName }}</p>
            </div>
          </div>
          <div class="group-list">
            <div
              v-for="item in group.businessList"
              :key="item.appOrResourceId"
              class="ell"
              :class="['item', item.customFlag ? 'custom' : '']"
            >
              <el-checkbox
                v-model="item.selected"
                @change="handelChangeSelected(item.selected, item)"
              >
                {{ item.appOrResourceName }}
              </el-checkbox>
              <span v-if="group.customFlag" class="icon-item" style="marginRight: 12px;" @click="onUpdateCustom(item)"><iconSvg name="bianji" /></span>
              <span v-if="group.customFlag" class="icon-item" @click="onDeleteCustom(item)"><iconSvg name="del" /></span>
              <!-- <i v-if="group.customFlag" class="el-icon-edit-outline" @click="onUpdateCustom(item)" /> -->
              <!-- <i v-if="group.customFlag" class="el-icon-delete" @click="onDeleteCustom(item)" /> -->
            </div>
            <span v-if="group.customFlag" class="btn-add" @click="onUpdateCustom({})">
              <i class="el-icon-circle-plus-outline" /> 添加自定义业务
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="btn-box">
      <el-button @click="cancelFn">取消</el-button>
      <el-button type="primary" :loading="saveLoading" @click="saveFn">保存</el-button>
    </div>

    <custom :dialog-visible.sync="dialogVisible" :item="currentItem" :type="1" @saveCustom="onSaveCustom" />

  </div>
</template>

<script>
import draggable from 'vuedraggable'
import iconSvg from '@/components/icon-svg'
import dry from '@/assets/dry.png'
import Custom from './dialog/custom.vue'

export default {
  name: 'Index',
  components: { iconSvg, draggable, Custom },
  data () {
    return {
      dry,
      currentItem: {},
      dialogVisible: false,
      allWork: [],
      selectedWork: [],
      saveLoading: false
    }
  },
  watch: {
    allWork: {
      deep: true,
      handler (n, o) {
        n.map(v => {
          if (!v.businessList.length) {
            this.$set(v, 'disabled', true)
          } else {
            this.$set(v, 'selected', !v.businessList.find(v => !v.selected))
          }
        })
      }
    }
  },
  created () {
    this.getSelectedWork()
    this.getAllWork()
  },
  methods: {
    // 拖动时隐藏删除按钮
    handelDelBtn (flag) {
      const box = document.getElementsByClassName('selected-list')[0]
      const items = box.getElementsByClassName('icon-del')
      Array.from(items).map(ele => {
        ele.className = flag ? 'icon-del' : 'icon-del hiden'
      })
    },
    // 已选中的业务
    async getSelectedWork () {
      const { data } = await this.$api('setApplication.selectedWorkOrApp', { type: 1 })
      this.selectedWork = data
    },
    // 所有业务
    async getAllWork () {
      const empowerWork = await this.$api('setApplication.empowerWork')
      const customWork = await this.$api('setApplication.customWork')
      this.allWork = [
        ...empowerWork.data,
        {
          appIcon: this.dry,
          appId: 'zidingyi',
          appName: '自定义',
          customFlag: 1,
          businessList: [...customWork.data]
        }
      ]
    },
    // 删除已选
    onDeleteSelected (item) {
      this.handelChangeSelected(false, item)
      this.allWork.map(group => {
        const selObj = group.businessList.find(v => v.appOrResourceId === item.appOrResourceId)
        if (selObj) {
          selObj.selected = false
        }
      })
    },
    // 更新已选列表 flag ? 更新 ： 删除
    handelChangeSelected (flag, item) {
      const isHas = this.selectedWork.findIndex(v => v.appOrResourceId === item.appOrResourceId)
      if (flag) {
        this.selectedWork = this.selectedWork.concat(isHas === -1 ? item : [])
      } else {
        isHas > -1 && this.selectedWork.splice(isHas, 1)
      }
    },

    // 更新自定义列表 flag ? 更新 ： 删除
    handelCustomList (flag, item) {
      const list = this.allWork[this.allWork.length - 1].businessList
      const index = list.findIndex(v => v.appOrResourceId === item.appOrResourceId)
      if (flag) {
        if (index > -1) { // 更新
          this.$set(list, index, item)
          if (item.selected) { // 维护到已选
            const index = this.selectedWork.findIndex(v => v.appOrResourceId === item.appOrResourceId)
            this.$set(this.selectedWork, index, item)
          }
        } else { // 新增
          list.push(item)
        }
      } else {
        index > -1 && list.splice(index, 1)
      }
    },
    // 多选：选中 || 取消选中
    checkAllFn (flag, group) {
      group.businessList.map(v => {
        v.selected = flag
        this.handelChangeSelected(flag, v)
      })
    },
    // 添加 or 编辑自定义
    onUpdateCustom (item) {
      this.currentItem = item
      this.dialogVisible = true
    },
    // 删除自定义
    onDeleteCustom (item) {
      this.$confirm('是否删除当前业务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api('setApplication.removeCustom', { id: item.appOrResourceId }).then(res => {
          this.$message.success('删除成功')
          // 从已选里删除
          this.handelChangeSelected(false, item)
          // 从自定义里删除
          this.handelCustomList(false, item)
        })
      }).catch(() => {})
    },
    // 自定义保存
    onSaveCustom (newItem) {
      this.handelCustomList(true, newItem)
    },
    // 取消
    cancelFn () {
      this.$router.go(-1)
    },
    // 保存 -- todo 使用节流
    saveFn () {
      this.saveLoading = true
      if (this.selectedWork.length >= 20) {
        this.$message.warning('最多可选20个常办业务')
        this.saveLoading = false
        return false
      }
      const req = {
        type: 1,
        list: this.selectedWork
      }
      this.$api('setApplication.saveWorkOrApp', req).then((res) => {
        this.saveLoading = false
        this.$message.success('保存成功')
        this.$router.push('/')
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/ui/themeVar.scss";
@mixin ell() {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: keep-all;
  white-space: nowrap;
}
.set-work {
    padding-bottom: 80px;
    .top-wrap,
    .bottom-wrap {
        background: #FFFFFF;
        box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.08);
        border-radius: 4px;
        padding: 20px 30px 0;
    }
    .top-wrap {
        margin-bottom: 16px;
    }

    .bottom-wrap {
      min-height: 460px;
    }

  .title {
    @include fs(2);
    font-size: 16px;
    font-weight: 500;
    color: #191F24;
    line-height: 21px;
    position: relative;
    &::before {
        content: '';
        position: absolute;
        width: 4px;
        height: 15px;
        background: #1E89FF;
        left: -12px;
        top: 3px;
    }
    .tip{
      height: 20px;
      font-size: 14px;
      color: rgba(25, 31, 36, 0.64);
      line-height: 20px;
    }
  }

  .selected-list {
    margin-top: 22px;
    min-height: 117px;
    margin-left: -9px;
    .item {
        box-sizing: border-box;
        padding: 0 4px;
        width: calc(10% - 37px);
        height: 40px;
        background: #F1F6FF;
        border-radius: 4px;
        margin-left: 19px;
        margin-right: 18px;
        margin-bottom: 16px;
        position: relative;
        cursor: pointer;
        display: inline-flex;
        justify-content: center;
        align-items: center;
      &:hover {
        background: #E4EEFF;
        .icon-del {
            display: block;
        }
      }

       /* &:nth-child(10),
       &:nth-child(20) {
         margin-right: 0;
       } */

      .text {
        max-width: 110px;
        display: inline-block;
        @include fs();
        color: #191F24;
        text-align: center;
        font-size: 14px;
      }

      .icon-del {
        position: absolute;
        right: -6px;
        top: -6px;
        width: 16px;
        height: 16px;
        line-height: 13px;
        color: #fff;
        background: #FF4402;
        border-radius: 8px;
        text-align: center;
        font-size: 22px;
        display: none;
        cursor: pointer;
        &.hiden {
            display: none !important;
        }
      }
    }
    // .ghost {
    //     opacity: 0.5;
    //     background: #c8ebfb;
    // }
  }

  .option-list {
    margin-top: 28px;
    .group {
        & > * {
            box-sizing: border-box;
        }
      border-radius: 4px;
      border: 1px solid #E3E4E4;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      .header {
        width: 210px;
        background: #F9F9F9;
        align-self: stretch;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        .el-checkbox {
            margin-left: 34px;
        }
        .img-wrap {
            width: 90px;
            margin-left: 14px;
            text-align: center;
            img {
                width: 40px;
                height: 40px;
                margin-bottom: 10px;
            }
            p {
                font-size: 14px;
                color: #191F24;
                line-height: 14px;
            }
        }
      }
      .group-list {
        flex-grow: 1;
        min-height: 96px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: 4px 0;
        .item {
          width: 208px;
          height: 60px;
          display: flex;
          align-items: center;
          border-radius: 6px;
          margin: 4px 6px;
          .icon-item{
            display: none;
            width: 14px;
            height: 16px;
            color: #848484;
            cursor: pointer;
            .icon{
              width: 100%;
              height: 100%;
            }
          }
          .el-checkbox {
              margin: 0 16px;
              ::v-deep .el-checkbox__label {
                @include ell();
                max-width: 155px;
              }
          }
          &.custom {
            &:hover {
                background: #F8F8F8;
                .icon-item{
                  display: inline-block;
                }
                i {
                    display: block;
                }
            }
            ::v-deep .el-checkbox__label {
                @include ell();
                width: 100px;
            }
          }
          i {
              display: none;
              margin-right: 10px;
              color: #848484;
              font-size: 16px;
              cursor: pointer;
              &:hover {
                  color: #909090;
              }
          }
        }
        .el-icon-circle-plus-outline {
            font-size: 18px;
            margin-left: 18px;
            vertical-align: text-bottom;
        }
        .btn-add {
          cursor: pointer;
          color: #499CF8;
        }
      }
      &:first-child {
        margin-top: 0;
      }
    }
  }
  .btn-box{
    position: fixed;
    bottom: 0;
    left: 66px;
    z-index: 99;
    padding: 20px 0;
    text-align: right;
    width: calc(100% - 66px);
    background: #FFFFFF;
    box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.08);
    .el-button:last-child {
      margin-right: 39px;
    }
  }
}
</style>
