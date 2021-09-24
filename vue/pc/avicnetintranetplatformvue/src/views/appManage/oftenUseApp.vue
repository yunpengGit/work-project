<template>
  <div>
    <div class="top">
      <!-- <div class="search clearfix">
        <i class="el-icon-search" @click="searchFn" />
        <el-input v-model="search" placeholder="搜索常用应用" class="header-search-input" @change="searchFn" />
      </div> -->
      <div class="btn-box">
        <el-button v-if="!draggableEnabled" type="primary" @click="sortFn">排序</el-button>
        <el-button v-if="!draggableEnabled" type="primary" @click="$router.push('/appManage/setOftenUseApp')">设置常用业务</el-button>
        <el-button v-else type="primary" @click="saveFn">保存</el-button>
      </div>
    </div>
    <div class="bottom">
      <draggable
        :list="appAll"
        :disabled="!draggableEnabled"
        class="content"
        ghost-class="ghost"
        :move="checkMoveGroup"
        @start="dragging = true"
        @end="dragging = false"
      >
        <transition-group type="transition" :name="'flip-list'">
          <div v-for="item in appAll" :key="item.order" class="group">
            <div class="left">
              <img :src="item.appIcon" :alt="item.appName" class="img">
              <p class="text ell" :title="item.appName">{{ item.appName }}</p>
            </div>
            <div class="right list">
              <draggable
                :list="item.resourceList"
                :disabled="!draggableEnabled"
                class="list-group"
                ghost-class="ghost"
                :move="checkMoveList"
                @start="dragging = true"
                @end="dragging = false"
              >
                <transition-group type="transition" :name="'flip-list'">
                  <div v-for="ele in item.resourceList" :key="ele.order" class="item">
                    <icon-svg v-if="draggableEnabled" name="tuozhuai" class="draggable-icon" />
                    <img :src="ele.icon" :alt="ele.resourceName" class="img">
                    <p class="text ell" :title="ele.resourceName">{{ ele.resourceName }}</p>
                  </div>
                </transition-group>
              </draggable>
            </div>
          </div>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
import iconSvg from '@/components/icon-svg'
import draggable from 'vuedraggable'
export default {
  name: 'OftenUseApp',
  components: {
    iconSvg,
    draggable
  },
  data () {
    return {
      draggableEnabled: false,
      search: '',
      appAll: []
    }
  },
  watch: {
    '$route' () {
      this.getUserEmpowerAppList()
    }
  },
  created () {
    this.getUserEmpowerAppList()
  },
  methods: {
    searchFn () {
      // document.getElementById(Id) && document.getElementById(Id).scrollIntoView()
    },
    getUserEmpowerAppList () {
      this.$api('appManage.appList').then(res => {
        this.appAll = res.data && res.data.map(ele => {
          ele.order = ele.appId
          ele.resourceList = ele.resourceList && ele.resourceList.map(item => {
            item.order = item.resourceCode
            return item
          })
          return ele
        })
      })
    },
    sortFn () {
      this.draggableEnabled = !this.draggableEnabled
    },
    checkMoveGroup () {
      // console.log(this.appAll)
    },
    checkMoveList () {
      // console.log(this.appAll)
    },
    saveFn () {
      this.$api('appManage.rankAppAndResource', this.appAll).then(res => {
        this.draggableEnabled = !this.draggableEnabled
        this.$message.success('保存成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped >
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
  .btn-box{

  }
}
.bottom{
  margin: 16px 0;
  background-color: #fff;
  padding: 25px;
  .content{
    span{
      display: block;
    }
  }
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
      text-align: center;
    }
    .left{
      display: flex;
      width: 125px;
      min-height: 120px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: #F6F6F6;
      box-shadow: 1px 0px 0px 0px #EBEBEB;
    }
    .right{
      flex: 1;
    }
    .list-group{
      span{
        display: flex;
        flex-wrap: wrap;
      }
      .item{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 120px;
        width: 120px;
      }
    }
  }
  .draggable-icon{
    position: relative;
    right: -20px;
    top: 10px;
    height: 24px;
    width: 24px;
    border-radius: 50%;
    background-color: #fff;
    cursor: pointer;
  }
}

</style>
