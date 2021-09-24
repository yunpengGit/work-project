<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-03-29 17:53:03
 * @LastEditors: zongmz
 * @LastEditTime: 2021-07-06 11:03:50
-->
<template>
  <div class="subscribe">
    <div class="block-box">
      <div class="header">
        <div>
          <span class="label">订阅栏目</span><span class="tips">{{ tipsSubscribe }}</span>
        </div>
        <div>
          <el-button v-if="!draggableEnabled" type="primary" @click="sortFn">排序</el-button>
          <el-button v-else type="primary" @click="saveSubscribeFn">保存</el-button>
        </div>
      </div>
      <draggable
        :list="listSubscribe"
        tag="ul"
        :disabled="!draggableEnabled"
        class="clearfix list-subscribe"
        ghost-class="ghost"
        :move="checkMove"
        @start="dragging = true"
        @end="dragging = false"
      >
        <transition-group type="transition" :name="'flip-list'">
          <li v-for="item in listSubscribe" :key="item.id" class="item">
            <div class="info-content">
              <div v-if="item.logoUrl" class="img-box">
                <img :src="item.logoUrl" alt="">
              </div>
              <div class="doc">
                <div class="title">{{ item.name }}</div>
                <div class="text">{{ item.description }}</div>
              </div>
            </div>
            <span v-if="draggableEnabled" class="draggable-icon">
              <icon-svg name="tuozhuai" />
            </span>
            <span v-else class="close" @click="focusWorkCancelFn(item.id)">
              <icon-svg name="shanchu" />
            </span>
          </li>
        </transition-group>
      </draggable>
    </div>
    <div class="block-box">
      <div class="header"><div><span class="label">未订阅栏目</span><span class="tips">勾选相关栏目，保存后，可在门户首页查看该栏目相关内容</span></div></div>
      <ul class="list-unsubscribe">
        <li v-for="item in listUnsubscribe" :key="item.id" class="item">
          <el-checkbox v-model="item.checked" @change="focusWorkcheckedFn(item.id)">
            <div class="info-content">
              <div v-if="item.logoUrl" class="img-box">
                <img :src="item.logoUrl" alt="">
              </div>
              <div class="doc">
                <div class="title">{{ item.name }}</div>
                <div class="text">{{ item.summary }}</div>
              </div>
            </div>
          </el-checkbox>
        </li>
      </ul>
    </div>
    <div class="btn-box">
      <el-button @click="cancelFn">取消</el-button>
      <el-button type="primary" @click="saveFn">保存</el-button>
    </div>
  </div>
</template>

<script>
import iconSvg from '@/components/icon-svg'
const _cloneDeep = require('lodash.clonedeep')
import draggable from 'vuedraggable'
export default {
  name: 'Subscribe',
  components: {
    iconSvg,
    draggable
  },
  data () {
    return {
      initListSubscribe: [], // 初始订阅数据，同来判断是否订阅有调整
      tipsSubscribe: '鼠标滑过栏目，点击右侧×可取消订阅，取消后，该栏目将不在门户首页显示',
      draggableEnabled: false,
      listSubscribe: [],
      listUnsubscribe: []
    }
  },
  created () {
    this.$api('home.subscribingInfo').then(res => {
      this.listSubscribe = res.data.subscribingCatalogs && res.data.subscribingCatalogs.map(ele => {
        ele.catalogId = ele.id
        return ele
      })
      this.initListSubscribe = _cloneDeep(this.listSubscribe)
      this.listUnsubscribe = res.data.unsubscribedCatalogs && res.data.unsubscribedCatalogs.map(ele => {
        ele.catalogId = ele.id
        ele.checked = false
        return ele
      })
    })
  },
  methods: {
    sortFn () {
      this.draggableEnabled = !this.draggableEnabled
      this.tipsSubscribe = '拖动任一栏目卡片调整排序，点击右侧【保存】按钮，可调整门户首页资讯栏目栏目排序'
    },
    saveSubscribeFn () {
      this.$api('home.subscribeSave', this.listSubscribe).then(res => {
        this.$message.success('保存成功')
        this.draggableEnabled = !this.draggableEnabled
        this.tipsSubscribe = '鼠标滑过栏目，点击右侧×可取消订阅，取消后，该栏目将不在门户首页显示'
      })
    },
    focusWorkCancelFn (id) {
      let item
      this.listSubscribe = this.listSubscribe.filter(ele => {
        if (ele.id === id) {
          item = ele
          return false
        } else {
          return true
        }
      })
      item.checked = false
      this.listUnsubscribe.push(item)
    },
    focusWorkcheckedFn (id) {
      let item
      this.listUnsubscribe = this.listUnsubscribe.filter(ele => {
        if (ele.id === id) {
          item = ele
          return false
        } else {
          return true
        }
      })
      this.listSubscribe.push(item)
    },
    cancelFn () {
      const isUpdateSubscribe = JSON.stringify(this.initListSubscribe) === JSON.stringify(this.listSubscribe)
      if (!isUpdateSubscribe) {
        this.$confirm('是否取消订阅调整?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push('/')
        }).catch(() => {})
      } else {
        this.$router.push('/')
      }
    },
    saveFn () {
      this.$api('home.subscribeSave', this.listSubscribe).then(res => {
        this.$message.success('保存成功')
        this.$router.push('/')
      })
    },
    checkMove () {}
  }
}
</script>

<style scoped lang="scss">
@import "./../../../ui/themeVar.scss";
.subscribe{
  // margin: 0 16px;
  padding: 20px 10px;
  background-color: #fff;
  .block-box{
    .header{
      position: relative;
      height: 32px;
      margin: 0 10px;
      padding-left: 10px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      & > div{
        display: flex;
      }
      ::before{
        position: absolute;
        top: 8px;
        left: 0;
        content: "";
        width: 4px;
        height: 16px;
        background-color: #1E89FF;
      }
      .label{
        font-size: 16px;
        font-weight: bold;
        color: #191F24;
      }
      .tips{
        display: flex;
        align-items: center;
        margin-left: 12px;
        font-size: 12px;
        color: rgba(25, 31, 36, 0.64);
      }
    }
  }
  .list-subscribe,
  .list-unsubscribe{
    width: 102%;
    &>span{
      display: block;
    }
    .item{
      display: inline-block;
      position: relative;
      box-sizing: border-box;
      padding: 20px;
      margin: 0 10px;
      margin-bottom: 24px;
      width: 31.5%;
      height: 120px;
      background-color: #F8F9FB;

      .draggable-icon,
      .close{
        position: absolute;
        top: 6px;
        right: 6px;
        cursor: pointer;
        .icon{
          width: 24px;
          height: 24px;
        }
      }
      .close{
        display: none;
      }
      &:hover{
        background-color: #F2F4F6;
        .close{
          display: inline-block;
        }
      }
      .info-content{
        display: flex;
        .img-box{
          margin-right: 16px;
          width: 150px;
          height: 80px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .doc{
          padding: 7px 0;
          flex: 1;
          .title{
            margin-bottom: 12px;
            font-size: 14px;
            color: #131F26;
          }
          .text{
            font-size: 14px;
            line-height: 20px;
            color: rgba(25, 31, 36, 0.64);
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
  }
  .list-unsubscribe{
    display: flex;
    flex-wrap: wrap;
  }
  .btn-box{
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
::v-deep .list-unsubscribe{
  .item{
    .el-checkbox{
      width: 100%;
      height: 100%;
      white-space: pre-wrap;
      .el-checkbox__input{
        position: absolute;
        top: -6px;
        right: -6px;
      }
    }
  }
}
</style>
