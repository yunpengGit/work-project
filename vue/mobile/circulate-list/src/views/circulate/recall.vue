<template>
  <div>
    <div class="list" v-if="data.length>0">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell class="item" v-for="(item, index) in data" :key="index">
          <div class="box">
            <div class="img">
              <img :src="item.personPhoto" alt="" class="header">
            </div>
            <div class="info">
              <div class="top">
                <span class="name">{{item.personName}}</span>
                <span class="status revoked">已撤销</span>
              </div>
              <div class="bottom">
                <span class="departmentName">{{item.departmentName}}</span>
                <span class="fdReadTime">{{item.fdReadTime}}</span>
              </div>
            </div>
          </div>
        </van-cell>
      </van-list>
    </div>
    <van-empty description="暂无已撤销人员数据" v-else>
    </van-empty>
  </div>
</template>
<script>
import Vue from 'vue';
import { createNamespacedHelpers } from 'vuex';
import { Toast } from 'vant';
import { viewOpinion } from '../../api/circulate';

const { mapState } = createNamespacedHelpers('circulate');

Vue.use(Toast);

export default {
  name: 'list',
  data() {
    return {
      active: 0,
      loading: false,
      finished: false,
      pageno: 1,
      data: [],
    };
  },
  computed: {
    ...mapState(['mainId']),
  },
  created() {
    this.viewOpinion();
  },
  methods: {
    onLoad() {
      this.viewOpinion();
    },
    viewOpinion() {
      const data = { mainId: this.mainId, docStatus: 'recall', pageno: this.pageno };
      viewOpinion(data).then((res) => {
        this.loading = false;
        // eslint-disable-next-line eqeqeq
        if (res.status == 1) {
          this.pageno += 1;
          if (res.data.length > 0) {
            this.data = [...this.data, ...res.data];
          }
          if (this.data.length >= res.total) {
            this.finished = true;
          }
        } else {
          Toast.fail(res.msg);
        }
      });
    },
  },
};
</script>
<style scoped lang="less">
@import './index.less';
</style>
