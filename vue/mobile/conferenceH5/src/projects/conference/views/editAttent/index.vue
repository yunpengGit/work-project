<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-01 22:40:33
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-09 19:37:52
-->
<template>
  <div class="enroll-manage-container">
    <van-search
      v-model="searchVal"
      shape="round"
      background="#fff"
      placeholder="按姓名/手机号搜索参会人"
      @search="search"
    />
    <div class="enroll-manage">
      <list
        :params="params"
        :clear="clear"
        :cut="cut"
        @resetCut="resetCut"
        @resetClear="resetClear"
        @onRefresh="onRefresh"
        @onLoad="onLoad"
      >
        <template v-slot:item="data">
          <div
            v-for="(ele, index) in data.data"
            :key="index"
            class="list-item"
          >
            <dl>
              <dt>{{ ele.fixAttributeCommonVO.attendeeName }}<i class="refuse">{{ ele.meetingStatusStr }}</i></dt>
              <dd>{{ ele.fixAttributeCommonVO.organizationSortName }} / {{ ele.fixAttributeCommonVO.deptName }}</dd>
              <dd><span>职务：</span>{{ ele.fixAttributeCommonVO.position }}</dd>
              <dd><span>联系方式：</span>{{ ele.fixAttributeCommonVO.phone }}</dd>
            </dl>
            <div class="attent-btn">
              <van-button
                plain
                type="info"
                @click="addAttent(ele.id, index)"
              >关注</van-button>
            </div>
          </div>
        </template>
      </list>
    </div>
  </div>
</template>

<script>
import list from '@/components/list'
export default {
  components: { list },
  props: {
    routeParams: {
      default: Object
    }
  },
  data() {
    return {
      searchVal: '',
      params: {
        httpUrl: 'desk.getAttentNo',
        type: 'up',
        // 模拟数据
        httpParams: {
          conferenceId: '',
          nameOrPhoneLike: '',
          pageNum: 1,
          pageSize: 10
        }
      },
      clear: false,
      cut: ''

    }
  },
  created() {
    this.$nextTick(() => {
      const conferenceId = this.routeParams.conferenceId
      this.params.httpParams.conferenceId = conferenceId
    })
  },
  methods: {
    search() {
      this.clear = true
      this.params.httpParams.pageNum = 1
      this.params.httpParams.nameOrPhoneLike = this.searchVal
    },
    resetClear() {
      this.clear = false
    },
    resetCut() {
      this.cut = ''
    },
    onRefresh() {
      this.params.httpParams.pageNum++
      this.params.type = 'down'
    },
    onLoad() {
      this.params.httpParams.pageNum++
      this.params.type = 'up'
    },
    addAttent(id, index) {
      const conferenceId = this.routeParams.conferenceId
      const attendeeIds = [String(id)]
      this.$api({
        url: 'desk.addAttent',
        data: {
          conferenceId,
          attendeeIds
        }
      }).then(res => {
        if (res.code === 2000) {
          this.cut = String(index)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.enroll-manage-container {
  min-height: 100%;
  background-color: #f8f8f8;
  .list-container {
    height: calc(100% - 54px);
    top: 54px;
    // padding: 10px;
    .list-item {
      width: 100%;
      background-color: #fff;
      border-radius: 8px;
      margin-top: 10px;
      overflow: hidden;
      // padding: 16px 16px 12px;
      i {
        border-radius: 8px;
        padding: 4px 14px;
        // background-color: rgba(3, 190, 28, 0.08);
        // color: #1E89FF;
      }
      .refuse {
        background-color: rgba(244, 249, 255, 1);
        color: rgba(30, 137, 255, 1);
      }
      dl {
        line-height: 18px;
        padding: 16px 16px 12px;
        dt {
          font-size: 14px;
          font-weight: 500;
          @include list(row,space-between,center);
          margin-bottom: 8px;
        }
        dd {
          font-size: 13px;
          color: rgba(25, 31, 36, 0.64);
          margin-bottom: 4px;
          span {
            font-weight: 500;
          }
        }
      }
    }
    .attent-btn {
      width: 100%;
      border-top: 1px solid rgba(25, 31, 36, 0.14);
      .van-button {
        width: 100%;
        border: 0;
        height: 44px;
        .van-button__text {
          font-size: 17px;
        }
      }
    }
  }
}
</style>
