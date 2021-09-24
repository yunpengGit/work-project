<template>
  <div>
    <van-sticky>
      <van-tabs v-if="tabs && tabs.items" v-model="active" @change="tabs.callback">
        <van-tab v-for="(item, index) in tabs.items" :title="item.title" :key="item.key" :badge="badgeList[index]">
        </van-tab>
      </van-tabs>
    </van-sticky>
    <div class="content">
      <div class="">
        <slot>
          <!-- keep-alive  -->
          <keep-alive>
            <router-view ref="content" />
          </keep-alive>
        </slot>
      </div>
    </div>
    <div class="btn">
      <van-button plain type="info" @click="revokedFn" v-if="remindAuth">撤回</van-button>
      <van-button plain type="info" @click="tipsFn" v-if="recallAuth">提醒</van-button>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import qs from 'qs';
import { Toast } from 'vant';
import { createNamespacedHelpers } from 'vuex';
import { getCounts } from '../api/circulate';

const { mapState, mapActions } = createNamespacedHelpers('circulate');
export default {
  name: 'circulate',
  data() {
    return {
      tabs: {},
      badgeList: [],
      remindAuth: true,
      recallAuth: true,

    };
  },
  computed: {
    ...mapState(['mainId']),
    active: {
      get() {
        return this.tabs.active();
      },
      set(val) {
        return val;
      },
    },
    allBadge() {
      const len = this.allCounts;
      return this.tipNum(len);
    },
    unreadBadge() {
      const len = this.unreadCounts;
      return this.tipNum(len);
    },
    readBadge() {
      const len = this.readCounts;
      return this.tipNum(len);
    },
    revokedBadge() {
      const len = this.recallCounts;
      return this.tipNum(len);
    },
    mainId() {
      let mainId;
      // const str = window.location.href.split('?');
      // const search = qs.parse(str[1].split('#')[0]);
      // if (!search.mainId) {
      //   Toast.fail('地址中没有mainId参数');
      // } else {
      //   mainId = search.mainId;
      // }
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
  mounted() {
    this.getCounts();
    this.getPageMeta();
  },
  updated() {
    this.getPageMeta();
  },
  methods: {
    ...mapActions(['setMainId']),
    tipNum(num) {
      let len = num;
      if (len === 0) {
        len = '';
      } else if (len > 99) {
        len = '99+';
      }
      return len;
    },
    getCounts() {
      this.setMainId(this.mainId);
      const data = { mainId: this.mainId };
      getCounts(data).then((res) => {
        this.remindAuth = res.remindAuth;
        this.recallAuth = res.recallAuth;
        if (res.status === '1') {
          this.allCounts = res.allCounts;
          this.readCounts = res.readCounts;
          this.recallCounts = res.recallCounts;
          this.unreadCounts = res.unreadCounts;
          const arr = [
            this.tipNum(res.allCounts),
            this.tipNum(res.unreadCounts),
            this.tipNum(res.readCounts),
            this.tipNum(res.recallCounts),
          ];
          this.$nextTick(() => {
            this.badgeList = arr;
          });
        } else {
          Toast.fail(res.msg);
        }
      });
    },
    getPageMeta() {
      this.pageTitle = (typeof (this.title) === 'string' || !this.title) ? this.title : this.$route.meta.title;
      const { content } = this.$refs;
      if (content) {
        if (content.pageMeta) {
          Object.assign(this, content.pageMeta);
        } else {
          this.tabs = content.tabs;
        }
      }
    },
    revokedFn() {
      this.$router.push(
        {
          path: './checkList',
          query: {
            type: 'revoked',
          },
        },
      );
    },
    tipsFn() {
      this.$router.push(
        {
          path: './checkList',
          query: {
            type: 'tips',
          },
        },
      );
    },
  },
};
</script>

<style scoped lang="less">
/deep/.van-info{
  background-color: #1E89FF;
}
/deep/.van-tabs__line{
  background-color: #1E89FF;
}
.btn{
  box-shadow: 0 0 10px #999;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  /deep/.van-button{
    flex-grow: 1;
    border: 0;
    font-size:17px;
    color:rgba(30,137,255,1);
  }
}
</style>
