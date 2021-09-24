<!--
 * @Description: 
 * @Author: peng
 * @Date: 2021-08-10 15:15:51
 * @LastEditors: peng
 * @LastEditTime: 2021-08-23 15:56:17
-->
<!--<template>
  <div class="home">
    <div class="search-box">
      <van-search v-model="keyword" shape="round" placeholder="搜索" />
      <div class="btn-box">
        <span class="cancel" v-if="keyword">取消</span>
        <img
          v-else
          src="./../assets/svg/shaixuan.svg"
          alt=""
          class="icon"
          @click="showPopup"
        />
      </div>
    </div>
    <img src="./../assets/img/banner.png" alt="" class="banner" />
    <div class="list-box">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          error-text="请求失败，点击重新加载"
          @load="onLoad"
        >
          <div v-for="item in list" :key="item.fdId" class="item">
            <div class="title">{{ item.title }}</div>
            <div class="info">
              <span>{{ item.unit }}</span>
              <span>{{ item.jointTime }}</span>
              <levelRender :award="item.award" />
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <van-popup
      v-model="show"
      position="right"
      :style="{ width: '348px', height: '100%' }"
    >
      <div class="content">
        <div v-for="item in paramsList" :key="item.field">
          <div class="label">{{ item.title }}</div>
          <div class="list">
            <span
              v-for="(e, idx) in item.list"
              :key="e"
              class="active"
              @click="checked(item, idx)"
              >{{ e }}</span
            >
          </div>
        </div>
        <div class="label">年度</div>
        <div class="list">
          <span class="active" @click="checked(item, index)">2009-2010</span>
          <span>2010-2011</span>
          <span>2011-2012</span>
        </div>
        <div class="label">获奖等级</div>
        <div class="list">
          <span class="active">一等奖</span>
          <span>二等奖</span>
          <span>三等奖</span>
        </div>
      </div>
      <div class="btn">
        <van-button type="default" @click="hidePopup">取消</van-button>
        <van-button type="info">确定</van-button>
      </div>
    </van-popup>
  </div>
</template>
-->

<script>
// @ is an alias to /src
import info from "./../api/index";
import Search from "./../components/Search.vue";
const levelRender = {
  name: "Home",
  props: {
    award: {
      type: String,
    },
  },
  data() {
    return {
      jinpai: require("./../assets/svg/jinpai.svg"),
      yinpai: require("./../assets/svg/yinpai.svg"),
      tongpai: require("./../assets/svg/tongpai.svg"),
    };
  },
  render() {
    let img, color;
    const award = this.award;
    switch (award) {
      case "一等奖":
        img = this.jinpai;
        color = "#f9bc00";
        break;
      case "二等奖":
        img = this.yinpai;
        color = "#84aabe";
        break;
      case "三等奖":
        img = this.tongpai;
        color = "#ff8615";
        break;
      default:
        break;
    }
    return (
      <span>
        <img src={img} alt="" class="icon" style="marginRight: 6px" />
        <span
          style={{
            color,
          }}
        >
          {award}
        </span>
      </span>
    );
  },
};

export default {
  name: "Home",
  components: {
    levelRender,
    Search,
  },
  data() {
    return {
      keyword: "",
      banner: require("./../assets/img/banner.png"),
      shaixuan: require("./../assets/svg/shaixuan.svg"),
      pageNo: 1,
      rowSize: 5,
      list: [],
      params: {},
      paramsList: [],
      finishedText: "没有更多了",
      show: false,
      loading: false,
      error: false,
      finished: false,
      refreshing: false,
    };
  },
  created() {
    this.initFilterParams();
  },
  methods: {
    onLoad() {
      if (this.refreshing) {
        this.list = [];
        this.refreshing = false;
      }
      // 筛选则清空list
      if (this.show) {
        this.list = [];
      }
      const { pageNo, rowSize, keyword } = this;
      // console.log(this.params);
      const data = {
        pageNo,
        rowSize,
        keyword,
        ...this.params,
      };
      info
        .getList(data)
        .then((res) => {
          if (this.show) {
            this.show = false;
          }
          if (res.data && res.data.length > 0) {
            this.list = [...this.list, ...res.data];
            this.pageNo += 1;
          }
          this.loading = false;
          if (this.list.length >= res.dataSum) {
            // if (pageNo === 1 && res.data && res.data.length === 0) {
            //   this.finishedText = "没有相关数据";
            // } else {
            //   this.finishedText = "没有更多了";
            // }
            this.finished = true;
          }
        })
        .catch((err) => {
          // this.loading = false;
          // this.refreshing = true;
          console.log(err);
          this.error = false;
          throw new Error(err);
        });
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      this.pageNo = 1;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
    checked(e, index, item) {
      e.activeItem = item;
      this.$set(this.paramsList, index, e);
    },
    reset() {
      // console.log(13);
      this.paramsList = this.paramsList.map((e) => {
        if (e.activeItem) {
          e.activeItem = "";
        }
        return e;
      });
      this.params = {};
    },
    submitPopup() {
      // console.log(this.paramsList);
      this.paramsList = this.paramsList.map((e) => {
        // console.log(e.field, e.activeItem);
        if (e.activeItem) {
          this.params[e.field] = e.activeItem;
        }
        return e;
      });
      this.pageNo = 1;
      this.onLoad();
    },
    initFilterParams() {
      info.getParams().then((res) => {
        // console.log(res);
        // this.paramsList = res.data;
        if (res.data.length > 0) {
          this.paramsList = res.data.map((e) => {
            const len = e.list.length;
            // 填充null
            let num = Math.ceil(len / 3) * 3 - len;
            while (num > 0) {
              e.list.push(null);
              num--;
            }

            // e.list = Math.ceil(len / 3) * 3;
            // console.log(e.list);
            return e;
          });
        }
        // console.log(this.paramsList);
      });
    },
    showPopup() {
      this.show = true;
    },
    hidePopup() {
      this.show = false;
    },
  },
  render() {
    return (
      <div class="home">
        <div class="search-box">
          <van-search v-model={this.keyword} shape="round" placeholder="搜索" />
          <div class="btn-box">
            {this.keyword ? (
              <span class="cancel">取消</span>
            ) : (
              <img
                src={this.shaixuan}
                alt=""
                class="icon"
                onClick={() => this.showPopup()}
              />
            )}
          </div>
        </div>
        {this.keyword ? (
          <Search keyword={this.keyword} />
        ) : (
          <div>
            <img src={this.banner} alt="" class="banner" />
            <div class="list-box">
              <van-pull-refresh
                v-model={this.refreshing}
                onRefresh={this.onRefresh}
              >
                <van-list
                  v-model={this.loading}
                  finished={this.finished}
                  finished-text={this.finishedText}
                  error-text="请求失败，点击重新加载"
                  onLoad={this.onLoad}
                >
                  {this.list.map((e) => {
                    return (
                      <div
                        key={e.fdId}
                        class="item"
                        onClick={() => {
                          window.location.href = e.url;
                        }}
                      >
                        <div class="title">{e.title}</div>
                        <div class="info">
                          <span>{e.unit}</span>
                          <span>{e.jointTime}</span>
                          <levelRender award={e.award} />
                        </div>
                      </div>
                    );
                  })}
                </van-list>
              </van-pull-refresh>
            </div>
            <van-popup
              v-model={this.show}
              position="right"
              style={{ width: "348px", height: "100%" }}
            >
              <div class="content">
                {this.paramsList.map((e, index) => {
                  return (
                    <div key={e.field}>
                      <div class="label">{e.title}</div>
                      <div class="list">
                        {e.list.map((item) => {
                          return item ? (
                            <span
                              key={item}
                              class={[
                                "filter",
                                e.activeItem === item ? "active" : "",
                              ]}
                              onClick={() => this.checked(e, index, item)}
                            >
                              {item}
                            </span>
                          ) : (
                            <span></span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div class="btn">
                <van-button type="default" onClick={() => this.reset()}>
                  重置
                </van-button>
                <van-button type="info" onClick={() => this.submitPopup()}>
                  确定
                </van-button>
              </div>
            </van-popup>
          </div>
        )}
      </div>
    );
  },
};
</script>
<style lang="less" scoped>
@import "./../css/common.less";
.home {
  .search-box {
    padding: 0 16px;
    height: 52px;
    display: flex;
    align-items: center;
    .van-search {
      padding: 0 24px 0 0;
      flex: 1;
    }
    .btn-box {
      .cancel {
        height: 22px;
        font-size: 17px;
        color: #1e89ff;
        line-height: 22px;
      }
      .icon {
        width: 17px;
        height: 17px;
      }
    }
  }
  .banner {
    display: block;
    height: 120px;
  }
  .list-box {
    box-sizing: border-box;
    // padding-bottom: 40px;
    height: calc(100vh - 172px);
    .van-pull-refresh {
      height: 100%;
      .van-list {
        height: 100%;
        overflow: auto;
      }
    }
  }
  ::v-deep .van-list {
    padding-left: 16px;
    .item {
      position: relative;
      padding: 16px 16px 16px 0;
      .border1px(bottom,#f4f4f4);
      // box-shadow: 0px -1px 0px 0px #f4f4f4;
      .title {
        font-size: 18px;
        color: #191f24;
        line-height: 26px;
        .line-hide(2);
      }
      .info {
        margin-top: 8px;
        display: flex;
        justify-content: space-between;
        & > span {
          font-size: 14px;
          color: #8d8d8d;
          &:last-child {
            display: flex;
            align-items: center;
          }
        }
        .icon {
          width: 18px;
          height: 18px;
        }
      }
    }
    & > .van-list__loading {
      padding-right: 16px;
    }
  }
  .van-popup {
    .content {
      box-sizing: border-box;
      padding: 16px 16px;
      .label {
        padding-left: 8px;
        margin: 16px 0;
        position: relative;
        height: 18px;
        font-size: 15px;
        font-weight: 500;
        color: #191f24;
        line-height: 18px;
        &::before {
          position: absolute;
          top: 1px;
          left: 0;
          content: "";
          display: inline-block;
          width: 4px;
          height: 14px;
          border-radius: 2px;
          background-color: #1e89ff;
        }
      }
      .list {
        display: flex;
        justify-content: space-between;
        padding-bottom: 16px;
        flex-wrap: wrap;
        // align-content: flex-start;
        & > span {
          margin-bottom: 16px;
          width: 97px;
          height: 36px;
          &.filter {
            // margin-right: 30px;
            // &:nth-child(3n) {
            //   margin-right: 0;
            // }
            display: flex;
            justify-content: center;
            align-items: center;
            background: rgba(25, 31, 36, 0.04);
            border-radius: 6px;
            font-size: 14px;
            color: rgba(25, 31, 36, 0.8);
            &.active {
              background: #1e89ff;
              color: #ffffff;
            }
          }
        }
      }
    }

    .btn {
      width: 100%;
      display: flex;
      position: absolute;
      bottom: 0;
      box-shadow: 0px -1px 10px 0px rgba(25, 31, 36, 0.08);
      .van-button {
        border: 0;
        width: 50%;
        height: 50px;
        font-size: 17px;
        border-radius: 0;
      }
    }
  }
}
</style>
