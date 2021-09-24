<!--
 * @Description: 
 * @Author: peng
 * @Date: 2021-08-11 16:48:56
 * @LastEditors: peng
 * @LastEditTime: 2021-08-26 14:27:03
-->
<script>
import info from "./../api/index";
export default {
  props: {
    keyword: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      baseUrl: "",
      pageNo: 1,
      rowSize: 10,
      total: 0,
      list: [],
      loading: false,
      error: false,
      finished: false,
    };
  },
  methods: {
    onLoad() {
      const { pageNo, rowSize, keyword, author, unit, award, jointime } = this;
      const data = {
        pageNo,
        rowSize,
        queryString: keyword,
        author,
        unit,
        award,
        jointime,
      };
      info
        .getSearch(data)
        .then((res) => {
          this.baseUrl = res.getContextPath;
          if (res.queryPage.list && res.queryPage.list.length > 0) {
            this.list = [...this.list, ...res.queryPage.list];
            this.pageNo += 1;
          }
          this.finished = true;
          this.loading = false;
          this.total = res.queryPage.totalrows;
          if (this.list.length >= res.queryPage.totalrows) {
            this.finished = true;
          }
        })
        .catch((err) => {
          // this.loading = false;
          // this.refreshing = true;
          // console.log(err);
          this.error = false;
          throw new Error(err);
        });
    },
  },
  render() {
    return (
      <div class="search-list">
        <div class="total">搜索到{this.total}项结果</div>
        <van-list
          v-model={this.loading}
          finished={this.finished}
          finished-text="没有更多了"
          error-text="请求失败，点击重新加载"
          onLoad={this.onLoad}
        >
          {this.list.map((e) => {
            return (
              <div
                key={e.lksFieldsMap.docKey && e.lksFieldsMap.docKey.value}
                class="item"
                onClick={() => {
                  window.location.href =
                    this.baseUrl + e.lksFieldsMap.linkStr &&
                    e.lksFieldsMap.linkStr.value;
                }}
              >
                <div
                  class="title"
                  domPropsInnerHTML={
                    e.lksFieldsMap.extendField4 &&
                    e.lksFieldsMap.extendField4.value
                  }
                ></div>
                <div
                  class="doc"
                  domPropsInnerHTML={
                    e.lksFieldsMap.fullText && e.lksFieldsMap.fullText.value
                  }
                ></div>
                <div class="info">
                  <span
                    domPropsInnerHTML={
                      e.lksFieldsMap.extendField1 &&
                      e.lksFieldsMap.extendField1.value
                    }
                  ></span>
                  <span
                    domPropsInnerHTML={
                      e.lksFieldsMap.extendField3 &&
                      e.lksFieldsMap.extendField3.value
                    }
                  ></span>
                  <span
                    domPropsInnerHTML={
                      e.lksFieldsMap.extendField2 &&
                      e.lksFieldsMap.extendField2.value
                    }
                  ></span>
                </div>
              </div>
            );
          })}
        </van-list>
      </div>
    );
  },
};
</script>
<style lang="less">
font {
  color: #ea340f !important;
}
</style>
<style lang="less" scoped>
@import "./../css/common.less";
.search-list {
  & > .total {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 48px;
    font-size: 14px;
    color: #626262;
    .border1px(bottom,#f4f4f4);
  }
  .van-list {
    height: calc(100vh - 100px);
  }
  ::v-deep .van-list {
    padding-left: 16px;
    .item {
      position: relative;
      padding: 16px 16px 16px 0;
      .title {
        font-size: 18px;
        color: #191f24;
        line-height: 26px;
        .line-hide(2);
      }
      .doc {
        margin-top: 8px;
        font-size: 14px;
        color: #8d8d8d;
        line-height: 18px;
        .line-hide(3);
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
}
</style>
