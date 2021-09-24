<!--
* @Descripttion:
* @Author: wanghz
* @Date: 2021-07-16 15:44:00
* @LastEditors: Please set LastEditors
* @LastEditTime:
-->
<template>
  <div class="means-container">
    <list :params="params" @onRefresh="onRefresh" @onLoad="onLoad">
      <template v-slot:item="data">
        <div v-for="(ele, index) in data.data" :key="ele.id" class="means-list">
          <div
            class="means-item"
            @click="
              $router.push({
                name: 'conferenceMeansDetail',
                query: {
                  [$enc('conferenceId')]: $enc(routeParams.conferenceId),
                  [$enc('pageNum')]: $enc(params.httpParams.pageNum),
                  [$enc('type')]: $enc(index)
                }
              })
            "
          >
            <img :src="ele.iconDownloadUrl" alt="" class="means-pic" />
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
  components: {
    list
  },
  props: {
    routeParams: {
      type: Object
    }
  },
  data() {
    return {
      taskList: [],
      params: {
        httpUrl: 'attendeeApi.getMaterial',
        type: 'up',
        httpParams: {
          conferenceId: '',
          pageNum: 1,
          pageSize: 10
        }
      }
    }
  },

  created() {
    this.$nextTick(() => {
      this.params.httpParams.conferenceId = this.routeParams.conferenceId
    })
  },
  mounted() {},
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

<style scoped lang="scss">
@import '@/assets/css/core.scss';
.means-container {
  .list-container {
    height: calc(100% - 10px);
    top: 10px;
    background-color: #f6f6f6;
    padding: 0;
  }
  .means-item {
    width: 100%;
    height: 56px;
    padding: 0 16px;
    background-color: #fff;
    @include list(row, flex-start, center);
    .means-pic {
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
      .van-cell__left-icon,
      .van-cell__right-icon {
        line-height: 56px;
      }
    }
  }
}
</style>
