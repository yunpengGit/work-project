<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-01 13:28:28
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-24 17:31:58
-->
<template>
  <div class="material-container">
    <list
      :params="params"
      @onRefresh="onRefresh"
      @onLoad="onLoad"
    >
      <template v-slot:item="data">
        <div
          v-for="(ele, index) in data.data"
          :key="ele.id"
          class="material-list"
        >
          <div
            class="material-item"
            @click="$router.push({
              name: 'materialDetail',
              query: {
                [$enc('id')]: $enc(routeParams.id),
                [$enc('pageNum')]: $enc(params.httpParams.pageNum),
                [$enc('type')]: $enc(index)
              }
            })"
          >
            <img :src="ele.iconDownloadUrl" alt="" class="material-pic">
            <van-cell-group>
              <van-cell :title="ele.materialGroupName" is-link :value="ele.conferenceMaterialsCount" />
            </van-cell-group>
          </div>
        </div>
      </template>
    </list>
  </div>
</template>

<script>
import list from '@/components/list'
export default {
  components: { list },
  props: {
    routeParams: {
      type: Object
    }
  },
  data() {
    return {
      activeNames: ['1'],
      params: {
        httpUrl: 'desk.getMaterial',
        type: 'up',
        httpParams: {
          conferenceId: '',
          pageNum: 1,
          pageSize: 1000
        }
      }
    }
  },
  created() {
    const id = this.routeParams.id
    this.$nextTick(() => {
      this.params.httpParams.conferenceId = id
    })
  },
  methods: {
    onRefresh() {
      this.params.httpParams.pageNum++
      this.params.type = 'down'
    },
    onLoad() {
      this.params.httpParams.pageNum++
      this.params.type = 'up'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.material-container {
  min-height: 100%;
  background-color: #f8f8f8;
  .list-container {
    // height: calc(100% - 10px);
    // top: 10px;
    padding: 0;
    // margin-top: 10px;
  }
  .material-item {
    width: 100%;
    height: 56px;
    padding: 0 16px;
    background-color: #fff;
    @include list(row,flex-start,center);
    .material-pic {
      width: 24px;
      height: 24px;
      margin-right: 16px;
    }
    .van-cell-group {
      flex: 1;
    }
    .van-cell {
      height: 56px;
      line-height: 56px;
      padding: 0;
      .van-cell__left-icon, .van-cell__right-icon {
        line-height: 56px;
      }
    }
  }
}
</style>
