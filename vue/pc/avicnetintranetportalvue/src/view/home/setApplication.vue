<template>
  <div class="set-app">

    <div class="top-wrap">
      <div class="title">
        <span>已选常用应用（{{ selectedApp.length }}）</span>
        <span class="tip">显示在首页常用应用区域</span>
      </div>

      <div class="selected-list">
        <draggable
          :list="selectedApp"
          ghost-class="ghost"
          style="height:100%"
        >
          <transition-group
            type="transition"
            :name="'flip-list'"
            tag="div"
          >
            <div
              v-for="item in selectedApp"
              :key="item.appOrResourceId"
              class="item"
              @click="onDeleteSelected(item)"
            >
              <!-- key不能使用index，不然transition不生效 -->
              <img :src="item.icon">
              <p class="text ell">{{ item.appOrResourceName }}</p>
              <span class="icon-del">-</span>
            </div>
          </transition-group>
        </draggable>
      </div>
    </div>

    <div class="bottom-wrap">
      <div class="title">应用列表</div>

      <div class="empower-list">
        <div v-for="item in empowerApp" :key="item.appOrResourceId" class="item">
          <img :src="item.icon" @click="onAddSelected(item)">
          <p class="text ell">{{ item.appOrResourceName }}</p>
        </div>
      </div>

      <div class="custom-list">
        <div v-for="item in customApp" :key="item.appOrResourceId" class="item">
          <img :src="item.icon" @click="onAddSelected(item)">
          <p class="text ell">{{ item.appOrResourceName }}</p>
          <div class="icon-btn">
            <span class="icon-item" style="marginRight: 20px" @click="onUpdateCustom(item)"><iconSvg name="bianji1" /></span>
            <span class="icon-item" @click="onDeleteCustom(item)"><icon-svg name="del" /></span>
          </div>
        </div>

        <div class="custom-add" @click="onUpdateCustom({})">
          <span><i class="el-icon-plus" /></span>
          <p class="text ell">自定义添加</p>
        </div>
      </div>
    </div>

    <div class="btn-box">
      <el-button @click="cancelFn">取消</el-button>
      <el-button type="primary" :loading="saveLoading" @click="saveFn">保存</el-button>
    </div>

    <custom :dialog-visible.sync="dialogVisible" :item="currentItem" :type="0" @saveCustom="onSaveCustom" />
  </div>
</template>

<script>
import iconSvg from '@/components/icon-svg'
import Custom from './dialog/custom.vue'
import draggable from 'vuedraggable'

export default {
  name: 'Index',
  components: { iconSvg, Custom, draggable },
  data () {
    return {
      currentItem: {},
      dialogVisible: false,
      selectedApp: [],
      empowerApp: [],
      customApp: [],
      saveLoading: false
    }
  },
  watch: {},
  created () {
    this.init()
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
    async init () {
      const selectedApp = await this.$api('setApplication.selectedWorkOrApp', { type: 0 })
      this.selectedApp = selectedApp.data // 已选中的应用

      const empowerApp = await this.$api('setApplication.empowerApp')
      this.empowerApp = empowerApp.data.filter(v => !v.selected) // 未选中授权应用列表

      const customApp = await this.$api('setApplication.customApp')
      this.customApp = customApp.data.filter(v => !v.selected) // 未选中自定义应用列表
    },

    // 更新已选列表 flag ? 更新 ： 删除
    updateSelected (flag, item) {
      item = { ...item, selected: true }
      const isHas = this.selectedApp.findIndex(v => v.appOrResourceId === item.appOrResourceId)
      if (flag) {
        this.selectedApp = this.selectedApp.concat(isHas === -1 ? item : [])
      } else {
        isHas > -1 && this.selectedApp.splice(isHas, 1)
      }
    },
    // 更新未选列表 flag ? 更新 ： 删除
    updateUnSelected (flag, item) {
      item = { ...item, selected: false }
      const list = item.customFlag ? this.customApp : this.empowerApp
      const index = list.findIndex(v => v.appOrResourceId === item.appOrResourceId)
      if (flag) {
        if (index > -1) { // 更新
          this.$set(list, index, item)
        } else { // 新增
          list.push(item)
        }
      } else {
        index > -1 && list.splice(index, 1)
      }
    },
    // 删除已选
    onDeleteSelected (item) {
      this.updateSelected(false, item)
      this.updateUnSelected(true, item)
    },
    // 添加已选
    onAddSelected (item) {
      if (this.selectedApp.length >= 20) {
        this.$message.warning('最多可选20个常用应用，请先取消一个再重新勾选应用')
        return false
      }
      this.updateSelected(true, item)
      this.updateUnSelected(false, item)
    },
    // 添加 or 编辑自定义
    onUpdateCustom (item) {
      this.currentItem = item
      this.dialogVisible = true
    },
    // 删除自定义
    onDeleteCustom (item) {
      this.$confirm('是否删除当前应用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api('setApplication.removeCustom', { id: item.appOrResourceId }).then(res => {
          this.$message.success('删除成功')
          // 从已选里删除
          this.updateSelected(false, item)
          // 从自定义里删除
          this.updateUnSelected(false, item)
        })
      }).catch(() => {})
    },
    // 自定义保存
    onSaveCustom (newItem) {
      this.updateUnSelected(true, newItem)
    },
    cancelFn () {
      this.$router.go(-1)
    },
    // 保存 -- todo 使用节流
    saveFn () {
      this.saveLoading = true
      const req = {
        type: 0,
        list: this.selectedApp
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
.set-app{
    padding-bottom: 80px;
    .top-wrap,
    .bottom-wrap {
        background: #FFFFFF;
        box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.08);
        border-radius: 4px;
    }
    .top-wrap {
        margin-bottom: 16px;
        padding: 20px 30px 33px 30px;
    }

    .bottom-wrap {
      min-height: 460px;
      padding: 20px 22px;
    }

    .selected-list {
       height: 86px;
       margin-top: 20px;
       .item {
        width: 84px;
        height: 86px;
        border-radius: 4px;
        margin-left: 5px;
        &:hover {
          .icon-del {
              display: block;
          }
        }
       }
    }
    .empower-list, .custom-list {
       .item {
          width: 102px;
          height: 92px;
          border-radius: 8px;
          margin-right: 27px;
          margin-bottom: 14px;
       }
    }
    .empower-list {
      border-bottom: 1px solid rgba(25, 31, 36, 0.06);
      padding: 35px 0 5px 0;
    }
    .custom-list {
      padding: 31px 0;
      .item:hover .icon-btn {
        display: block;
      }
    }

// 公共的样式，小心修改
  .item {
      position: relative;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        background: #F5F5F5;
      }
      img {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        cursor: pointer;
      }
      .text {
          @include fs();
          font-size: 14px;
          color: #191F24;
          text-align: center;
          width: 100%;
          line-height: 14px;
          margin-top: 10px;
      }
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
    .tip {
      height: 20px;
      font-size: 14px;
      color: rgba(25, 31, 36, 0.64);
      line-height: 20px;
    }
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

  .icon-btn {
    display: none;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 102px;
    height: 28px;
    line-height: 26px;
    background: #191F24;
    border-radius: 0px 0px 8px 8px;
    opacity: 0.72;
    text-align: center;
    .icon-item {
      width: 14px;
      height: 14px;
      color: #fff;
      cursor: pointer;
      .icon{
        width: 100%;
        height: 100%;
      }
    }
  }

  .custom-add {
    width: 102px;
    height: 92px;
    cursor: pointer;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    vertical-align: top;
    &:hover {
      span {
        border-color: #1E89FF;
      }
      p, i {
          color: #1E89FF;
      }
    }
    span {
      width: 40px;
      height: 40px;
      line-height: 40px;
      background: #FFFFFF;
      border-radius: 8px;
      border: 1px solid #DBDBDB;
      text-align: center;
    }
    .text {
      @include fs();
      font-size: 14px;
      color: #191F24;
      text-align: center;
      width: 100%;
      line-height: 14px;
      margin-top: 10px;
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
