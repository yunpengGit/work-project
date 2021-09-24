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
                <span class="status read" v-if="item.docStatus===read">已阅</span>
                <span class="status unread" v-if="item.docStatus===unread">未阅</span>
                <span class="status revoked" v-if="item.docStatus===revoked">已撤销</span>
              </div>
              <div class="bottom">
                <span class="departmentName">{{item.departmentName}}</span>
                <span class="fdReadTime">{{item.fdReadTime}}</span>
              </div>
            </div>
          </div>
          <div v-if="item.docContent" class="box-content">
            <van-divider :style="{ borderColor: '#C5CED8', margin: 0 }"/>
            <div class="title">传阅意见：</div>
            <div class="content">{{item.docContent}}</div>
          </div>
        </van-cell>
      </van-list>
    </div>
    <van-empty description="暂无传阅人员数据" v-else>
    </van-empty>
  </div>
</template>
<script>
import Vue from 'vue';
import { Toast } from 'vant';
// eslint-disable-next-line import/no-extraneous-dependencies
import qs from 'qs';
import { viewOpinion } from '../../api/circulate';

Vue.use(Toast);

export default {
  name: 'list',
  data() {
    return {
      active: 0,
      loading: false,
      finished: false,
      pageno: 1,
      read: 'read',
      unread: 'unread',
      revoked: 'recall',
      data: [],
    };
  },
  computed: {
    mainId() {
      let mainId;
      if (process.env.NODE_ENV === 'development') {
        mainId = '172fdff5a63cf00f8274a134df092aca';
      } else {
        const str = window.location.href.split('?');
        const search = qs.parse(str[1].split('#')[0]);
        if (!search.mainId) {
          Toast.fail('地址中没有mainId参数');
        } else {
          mainId = search.mainId;
        }
      }
      return mainId;
    },
  },
  created() {
    this.viewOpinion();
  },
  methods: {
    onLoad() {
      this.viewOpinion();
    },
    viewOpinion() {
      const data = { mainId: this.mainId, docStatus: 'all', pageno: this.pageno };
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
