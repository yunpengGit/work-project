<template>
  <div>
    <div class="top">
      <!-- <div class="search clearfix">
        <i class="el-icon-search" @click="searchFn" />
        <el-input v-model="search" placeholder="搜索常用应用" class="header-search-input" @change="searchFn" />
      </div> -->
      <div class="btn-box">
        <el-button type="primary" @click="saveFn">保存</el-button>
      </div>
    </div>
    <div class="bottom">
      <div v-for="group in appAll" :key="group.appId" class="group">
        <div class="left">
          <el-checkbox v-model="group.checkAll" @change="checkAllFn(group)">
            <img :src="group.appIcon" :alt="group.appName" class="img" @click.stop.prevent="modifyIconFn(group)">
            <p class="text ell" :title="group.appName">{{ group.appName }}</p>
          </el-checkbox>
        </div>
        <div class="right list">
          <div v-for="(item, idx) in group.resourceList" :key="group.appId+idx" class="group-list">
            <el-checkbox
              v-for="ele in item"
              :key="ele.resourceCode"
              v-model="ele.checked"
              class="item"
              @change="checkedFn(group)"
            >
              <img :src="ele.icon" :alt="ele.resourceName" class="img" @click.stop.prevent="modifyIconFn(ele)">
              <p class="text ell" :title="ele.resourceName">{{ ele.resourceName }}</p>
            </el-checkbox>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="图标库" :visible.sync="dialogVisible">
      <div class="icon-box">
        <div v-for="item in allIcon" :key="item.appId" class="group">
          <div class="header">{{ item.appName }}</div>
          <div class="list">
            <div v-for="ele in item.appIcons" :key="ele.icon" class="img">
              <icon-svg v-if="ele.isUsed === 1" name="yiyong" class="status" />
              <img :src="ele.icon" alt="" @click="checkedIconFn(ele)">
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import iconSvg from '@/components/icon-svg'
const _cloneDeep = require('lodash.clonedeep')
export default {
  name: 'OftenUseApp',
  components: {
    iconSvg
  },
  data () {
    return {
      currentApp: {},
      dialogVisible: false,
      draggableEnabled: false,
      search: '',
      appAll: [],
      allIcon: []
    }
  },
  created () {
    this.getUserEmpowerAppList()
    this.getAppIconList()
  },
  methods: {
    searchFn () {
      // document.getElementById(Id) && document.getElementById(Id).scrollIntoView()
    },
    getUserEmpowerAppList () {
      this.$api('appManage.appList').then(res => {
        if (res.data) {
          this.appAll = res.data.map((item) => {
            if (item.resourceList) {
              if (item.resourceList.some(ele => {
                return ele.isBusinessType !== 1
              })) {
                item.checkAll = false
              } else {
                item.checkAll = true
              }
            }

            // 数组分组
            const arr = []
            let index = 0
            const count = 12

            item.resourceList && item.resourceList.forEach((ele, idx) => {
              if (ele.isBusinessType === 1) {
                ele.checked = true
              } else {
                ele.checked = false
              }

              // 数组分组
              index = Math.floor(idx / count)
              if (!Array.isArray(arr[index])) {
                arr[index] = []
              }
              arr[index].push(ele)
            })
            item.resourceList = arr
            return item
          })
        }
        // console.log(this.appAll)
      })
    },
    getAppIconList () {
      this.$api('appManage.appIconList').then(res => {
        this.allIcon = res.data
      })
    },
    saveFn () {
      let data = _cloneDeep(this.appAll)
      data = data.map(item => {
        delete item.checkAll
        let arr = []
        item.resourceList && item.resourceList.forEach(ele => {
          arr = [...arr, ...ele]
        })
        arr = arr.map(ele => {
          if (ele.checked) {
            ele.isBusinessType = 1
          } else {
            ele.isBusinessType = 0
          }
          delete ele.checked
          return ele
        })
        item.resourceList = arr
        return item
      })
      // console.log(data)
      this.$api('appManage.rankAppAndResource', data).then(res => {
        this.getUserEmpowerAppList()
        this.$router.push('/appManage/oftenUseApp')
      })
    },
    checkAllFn (group) {
      this.$nextTick(() => {
        group.resourceList && group.resourceList.forEach(item => {
          item && item.forEach(ele => {
            if (group.checkAll) {
              ele.checked = true
            } else {
              ele.checked = false
            }
          })
        })
      })
    },
    checkedFn (group) {
      // 展开 多层数组
      let arr = []
      group.resourceList && group.resourceList.forEach(ele => {
        arr = [...arr, ...ele]
      })
      const isCheckall = arr && arr.some(ele => {
        return ele.checked === false
      })
      group.checkAll = !isCheckall
    },
    modifyIconFn (item) {
      this.currentApp = item
      this.dialogVisible = true
    },
    checkedIconFn (ele) {
      // eslint-disable-next-line no-prototype-builtins
      if (this.currentApp.hasOwnProperty('icon')) {
        this.currentApp.icon = ele.icon
      }
      // eslint-disable-next-line no-prototype-builtins
      if (this.currentApp.hasOwnProperty('appIcon')) {
        this.currentApp.appIcon = ele.icon
      }
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped >
@mixin fcc() {
  display: flex;
  justify-content: center;
  align-self: center;
}
@mixin checkbox(){
  ::v-deep .el-checkbox{
    margin-right: 0;
    height: 126px;
    width: 126px;
    @include fcc();
    flex-direction: column-reverse;
    .el-checkbox__input{
      @include fcc();
    }
    .el-checkbox__label{
      display: flex;
      justify-content: center;
      align-items: center;
      padding-left: 0;
      flex-direction: column;
      @include fcc();
    }
  }
}
.top{
  display: flex;
  justify-content: space-between;
  .search{
    padding: 0 16px;
    background-color: #fff;
    display: flex;
    align-items: center;
    height: 36px;
    width: 400px;
    border-radius: 4px;
    border: 1px solid #DADBDC;
  }
}
.bottom{
  margin: 16px 0;
  background-color: #fff;
  padding: 25px;
  .group{
    margin-top: 18px;
    display: flex;
    border-radius: 4px;
    border: 1px solid #EBEBEB;
    &:first-child{
      margin-top: 0;
    }
    .img{
      width: 44px;
      height: 44px;
      overflow: hidden;
    }
    .text{
      margin-top: 4px;
      width: 56px;
      height: 20px;
      font-size: 14px;
      color: #191F24;
      line-height: 20px;
    }
    .left{
      box-sizing: border-box;
      display: flex;
      width: 122px;
      min-height: 120px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: #F6F6F6;
      box-shadow: 1px 0px 0px 0px #EBEBEB;
      @include checkbox();
    }
    .right{
      box-sizing: border-box;
      flex: 1;
      .group-list{
        display: flex;
        flex-wrap: wrap;
        border-top: 1px solid #ebebeb;
        &:first-child{
          border-top: 0;
        }
      }
      .item{
        height: 126px;
        width: 126px;
      }
      @include checkbox();
    }
  }
}
.el-dialog__wrapper{
  .el-dialog__body{
    height: 500px;
    overflow: auto;
  }
  .icon-box{
    border-radius: 4px;
    border: 1px solid rgba(25, 31, 36, 0.12);
    .header{
      padding: 0 12px;
      display: flex;
      align-items: center;
      height: 40px;
      background: rgba(25, 31, 36, 0.04);
    }
    .list{
      display: flex;
      flex-wrap: wrap;
      .img{
        width: 64px;
        height: 64px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;
        .status{
          position: absolute;
          top: 12px;
          left: 12px;
          width: 28px;
          height: 28px;
        }
        img{
          width: 40px;
          height: 40px;
        }
      }
    }
  }
}
</style>
