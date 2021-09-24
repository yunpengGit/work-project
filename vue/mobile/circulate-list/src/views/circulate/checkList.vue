<template>
  <div class="list">
    <van-checkbox-group v-model="result" ref="checkList">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell class="item" v-for="(item) in data" :key="item.opinonid">
          <van-checkbox :name="item.opinionId">
            <img :src="item.personPhoto" alt="" class="header">
            <div class="info"><span class="name">{{item.personName}}</span><span class="department">{{item.departmentName}}</span></div>
          </van-checkbox>
        </van-cell>
      </van-list>
      </van-checkbox-group>
      <div class="btn">
        <van-checkbox v-model="checkAll">全选</van-checkbox>
        <van-button type="info" @click="submintFn">确定{{btnText}}</van-button>
      </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { Toast } from 'vant';
import { recallRemindList, deleteBacks, addReminds } from '../../api/circulate';

const { mapState } = createNamespacedHelpers('circulate');
export default {
  name: 'checkList',
  data() {
    return {
      result: [],
      data: [],
      checkAll: false,
      loading: false,
      finished: false,
      pageno: 1,
    };
  },
  computed: {
    ...mapState(['mainId']),
    btnText() {
      let text = '撤回';
      if (this.$route.query.type === 'tips') {
        text = '提醒';
      }
      return text;
    },
  },
  created() {

  },
  methods: {
    onLoad() {
      this.recallRemindList();
    },
    recallRemindList() {
      const data = {
        mainId: this.mainId,
        pageno: this.pageno,
      };
      recallRemindList(data).then((res) => {
        this.loading = false;
        if (res.status === '1') {
          this.pageno += 1;
          if (res.data.length > 0) {
            this.data = [...this.data, ...res.data];
          } else {
            Toast.fail(res.msg);
          }
          if (this.data.length >= res.total) {
            this.finished = true;
          }
        } else {
          Toast.fail(res.msg);
        }
      });
    },
    submintFn() {
      let fnMethod = deleteBacks;
      if (this.$route.query.type === 'tips') {
        fnMethod = addReminds;
      }
      if (this.result.length === 0) {
        Toast.fail('请选择要处理的项');
      }
      const data = {
        mainId: this.mainId,
        opinionIds: this.result.join(';'),
      };
      fnMethod(data).then((res) => {
        if (res.status === '1') {
          Toast.success(res.msg);
          this.$router.push('/');
        } else {
          Toast.fail(res.msg);
        }
      });
    },
  },
  components: {

  },
  watch: {
    checkAll: {
      handler(n) {
        this.$refs.checkList.toggleAll(n);
      },
    },
  },
};
</script>

<style scoped lang="less">
.list{
  padding-bottom: 60px;
}
.van-cell{
  padding: 0;
}
/deep/.van-checkbox-group{
  .van-checkbox{
    padding-left: 14px;
    background-color: #fff;
    .van-checkbox__label{
      height: 60px;
      display: flex;
      align-items: center;
      flex: 1;
      border-bottom: 1px solid #C5CED8;
      .header{
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      .info{
        padding-left: 14px;
        padding-right: 16px;
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .name{
          font-size:17px;
          font-weight:400;
          color:rgba(4,16,31,1);
        }
        .department{
          font-size:15px;
          font-weight:400;
          color:rgba(123,130,131,1);
        }
      }
    }
    &:last-child{
      .van-checkbox__label{
        border-bottom: 0;
      }
    }
  }
}
.btn{
  box-shadow: 0 0 10px #999;
  padding-left: 14px;
  padding-right: 8px;
  height: 50px;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  .van-checkbox{
    flex-grow: 1;
  }
  /deep/.van-button{
    height: 34px;
    border: 0;
    font-size:17px;
  }
}
</style>
