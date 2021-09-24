<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-08-30 15:45:55
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-09-07 16:21:58
-->
<template>
  <div class="build-meet-container">
    <h3 class="h3-title">基本信息</h3>
    <van-field
      required
      class="input"
      v-model="params.name"
      label="会议名称"
      placeholder="请输入会议名称"
    />
    <van-field
      readonly
      required
      class="input"
      v-model="params.type"
      label="会议类型"
      placeholder="请选择"
      right-icon="arrow"
    />
    <van-field
      class="textarea"
      type="textarea"
      v-model="params.introduction"
      rows="3"
      autosize
      maxlength="500"
      show-word-limit
      label="会议介绍"
      placeholder="请输入会议介绍"
    />
    <div class="custom-cell">
      <div class="custom-title"><span>会议封面</span></div>
      <div class="custom-value">
        <div class="upload-cover">
          <van-uploader
            v-model="coverPOs"
            :after-read="afterReadFile"
            :before-read="beforeReadFile"
            accept="*"
          >
            <div class="upload-btn"></div>
          </van-uploader>
          <p>封面用作系统展示<br/>建议尺寸：750×345大小不能超过10M</p>
        </div>
      </div>
    </div>
    <van-field
      readonly
      required
      class="input"
      v-model="paramsVal.conferenceTime"
      label="会议时间"
      placeholder="请选择"
      right-icon="arrow"
    />
    <van-field
      required
      class="input"
      v-model="params.address"
      label="会议地点"
      placeholder="请输入会议地点"
    />
    <van-field
      required
      class="input"
      v-model="params.visibaleFlag"
      label="会议范围"
      placeholder="请输入会议范围"
      right-icon="arrow"
    />
    <van-field
      required
      class="input"
      v-model="params.name"
      label="是否公开"
      placeholder="请选择"
      right-icon="arrow"
    />
    <p class="cell-tips">设置是否公开本场会议活动，不公开则仅能通过搜索或扫码报名参加</p>
    <div class="dom" :class="domShow ? '' : 'dom-hide'">
      <van-field
        required
        class="input"
        v-model="params.name"
        label="会议地址/跳转页面"
        placeholder="请选择"
        right-icon="arrow"
      />
      <van-field
        required
        class="input"
        v-model="params.name"
        label="报到时间"
        placeholder="请选择"
        right-icon="arrow"
      />
      <van-field
        required
        class="input"
        v-model="params.address"
        label="报到地点"
        placeholder="请输入报到地点"
      />
      <div class="cell-handle">
        <h3>
          会议组织
          <div class="handle-btn">+ 添加</div>
        </h3>
        <ul>
          <li>
            <div>主办方：啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊主办方：啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊</div>
            <van-icon name="arrow" />
          </li>
          <li>
            <div>主办方：啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊主办方：啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊</div>
            <van-icon name="arrow" />
          </li>
        </ul>
      </div>
      <div class="cell-handle">
        <h3>
          联系方式
          <div class="handle-btn">+ 添加</div>
        </h3>
        <ul>
          <li>
            <div>主办方：啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊主办方：啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊</div>
            <van-icon name="arrow" />
          </li>
          <li>
            <div>主办方：啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊主办方：啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊</div>
            <van-icon name="arrow" />
          </li>
        </ul>
      </div>
      <van-field
        class="textarea"
        type="textarea"
        v-model="params.introduction"
        rows="3"
        autosize
        maxlength="500"
        show-word-limit
        label="会议须知"
        placeholder="请输入会议须知"
      />
    </div>
    <div class="dom-handle">
      <div @click="domHide">
        收起基本信息
        <van-icon name="arrow-up" />
      </div>
    </div>
    <h3 class="h3-title">报名信息</h3>
    <!-- 单选 -->
    <van-action-sheet
      v-model="sheetShow"
      :actions="sheetActions"
      cancel-text="取消"
      close-on-click-action
      @select="sheetSelect"
      @close="sheetClose"
    />
    <!-- <van-popup v-model="popupShow" position="bottom" :style="{ width: '100%', minHeight: '40%', maxHeight: '60%'}" round  @close="popupClose" v-if="param">
      <div class="popup-choice-container">
        <div class="popup-choice">
          <van-radio-group
            v-for="(ele, index) in basicSingleData(groupIndex)"
            :key="index"
            v-model="ele.fieldValueStr"
          >
            <van-cell-group v-if="ele._showFlag">
              <van-cell
                v-for="(eleChild, indexChild) in ele.signFormOptionVOs"
                :key="indexChild"
                :title="eleChild.optionText"
                @click="singleChoice(ele, eleChild)"
              >
                <template #right-icon>
                  <van-radio :name="eleChild.optionText" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
          <van-checkbox-group
            v-model="multipleResult"
            v-if="multipleSeq"
          >
            <van-cell-group >
              <van-cell
                v-for="(eleChild, indexChild) in multipleData"
                :key="indexChild"
                clickable
                :title="eleChild.optionText"
                @click="toggle(indexChild)"
              >
                <template #right-icon>
                  <van-checkbox :name="eleChild.optionText" ref="checkboxes"/>
                </template>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
        </div>
      </div>
      <div class="popup-btn" @click="popupComfire"><van-button type="default">确认</van-button></div>
    </van-popup> -->
  </div>
</template>

<script>
export default {
  routeParams: {
    type: Object
  },
  data() {
    return {
      // 是否显示基本信息
      domShow: true,
      sheetShow: false,
      sheetActions: [],
      coverPOs: [],
      paramsVal: {
        // 会议时间 根据params.startTime和params.endTime结合而来
        conferenceTime: ''
      },
      params: {
        // 会议名称
        name: '',
        // 会议类型
        type: '',
        // 会议介绍
        introduction: '',
        // 会议封面
        coverPOs: [{ coverUrl: '' }],
        // coverVOs: [{ coverUrl: '' }],

        // 会议开始时间
        startTime: '',
        // 会议结束时间
        endTime: '',
        // 会议地点
        address: '',
        // 会议范围 1本单位及下属单位 2仅本企业 3全集团 默认1
        visibaleFlag: '',
        // 是否公开 1是 0 否 默认1
        pushToLobbyFlag: ''
      },
      // 行业
      tradeData: [],
      // 组织
      rganizeData: []
    }
  },
  created() {
    this.getTrade()
    this.getOrganize()
  },
  methods: {
    domHide() {
      this.domShow = !this.domShow
    },
    // 上传图片 - 读取文件之前判断图片格式是否合法
    beforeReadFile(file) {
      console.log(file)
    },
    afterReadFile(file) {

    },
    // sheet选择事件
    sheetSelect(item) {

    },
    // sheet关闭事件
    sheetClose() {

    },

    // 获取行业
    getTrade() {
      this.$api({
        url: 'dic.getTrade'
      }).then(res => {
        const data = res.result
        this.tradeData = data
      })
    },
    // 获取组织
    getOrganize() {
      this.$api({
        url: 'dic.getOrganize'
      }).then(res => {
        const data = res.result
        this.rganizeData = data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.build-meet-container::v-deep {
  min-height: 100%;
  background-color: #fff;
  .h3-title {
    width: 100%;
    height: 46px;
    line-height: 46px;
    font-size: 15px;
    padding: 0 20px;
    background-color: rgba(25, 31, 36, 0.04);
  }
  .textarea {
    font-size: 15px;
    padding: 0 25px 0 20px;
    .van-cell__title {
      line-height: 53px;
      width: auto;
      // flex: 1;
    }
    .van-cell__value {
      padding-left: 12px;
      // width: 100%;
    }
    .van-field__body {
      height: 125px;
      padding-top: 14px;
      textarea {
        font-size: 15px;
        height: 100% !important;
      }
    }
    .van-field__word-limit {
      margin-bottom: 11px;
      color: rgba(25, 31, 36, .5);
      font-size: 15px;
    }
  }
  .input {
    font-size: 15px;
    height: 53px;
    padding: 0 25px 0 20px;
    line-height: 53px;
    position: relative;
    .van-cell__title {
      flex: 1;
    }
    .van-cell__value {
      width: 100%;
      display: flex;
      padding-left: 12px;
      .van-field__body {
        width: 100%;
      }
    }
    .van-field__word-limit {
      margin: 0 0 0 10px;
      line-height: 53px;
      flex: 1;
    }
    &::after {
      content: '';
      display: block;
      width: calc(100% - 20px);
      height: 1px;
      background-color: #f0f0f1;
      position: absolute;
      left: 20px;
      bottom: 0;
    }
    .van-field__right-icon {
      padding-right: 0;
    }
  }
  .cell-handle {
    font-size: 15px;
    padding: 0 25px 20px 20px;
    position: relative;
    > h3 {
      width: 100%;
      height: 53px;
      line-height: 53px;
      color: rgba(25, 31, 36, 0.64);
      margin-bottom: 12px;
      @include list(row, flex-start, center);
      .handle-btn {
        width: 60px;
        height: 24px;
        line-height: 24px;
        background-color: rgba(237, 244, 253, 1);
        border-radius: 3px;
        font-size: 15px;
        color: rgba(30, 137, 255, 1);
        margin-left: 30px;
        padding-left: 5px;
      }
    }
    ul {
      li {
        width: 100%;
        padding-right: 23px;
        position: relative;
        margin-bottom: 22px;
        &:nth-last-of-type(1) {
          margin-bottom: 0;
        }
        div {
          width: 100%;
          font-size: 15px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        i {
          font-size: 16px;
          color: #969799;
          @include absolute(50%,-8px);
          transform: translateY(-50%);
        }
      }
    }
    &::after {
      content: '';
      display: block;
      width: calc(100% - 20px);
      height: 1px;
      background-color: #f0f0f1;
      position: absolute;
      left: 20px;
      bottom: 0;
    }
  }
  .custom-cell {
    font-size: 15px;
    padding: 0 25px 0 20px;
    display: flex;
    position: relative;
    &::after {
      content: '';
      display: block;
      width: calc(100% - 20px);
      height: 1px;
      background-color: #f0f0f1;
      position: absolute;
      left: 20px;
      bottom: 0;
    }
    .custom-title {
      margin-right: 12px;
      color: rgba(25, 31, 36, 0.64);
      line-height: 53px;
      span {
        position: relative;
        &::before {
          position: absolute;
          right: -0.26667rem;
          color: #ee0a24;
          font-size: 0.37333rem;
          content: "*";
        }
      }
    }
    .custom-value {
      padding: 14px 0 0 12px;
    }
  }
  .upload-cover {
    p {
      font-size: 14px;
      line-height: 20px;
      margin: 13px 0 20px;
      color: rgba(25, 31, 36, .5);
    }
  }
  .upload-btn {
    width: 117px;
    height: 64px;
    background-color: #f5f5f5;
    position: relative;
    &::after {
      content: '';
      display: block;
      width: 20px;
      height: 20px;
      @include absolute(50%,50%);
      transform: translate(50%,-50%);
      background: url('../../../../assets/images/addPic.svg');
    }
  }
  .cell-tips {
    width: 100%;
    padding: 8px 20px 16px;
    background-color: rgba(25, 31, 36, 0.04);
    font-size: 14px;
    line-height: 20px;
    color: rgba(25, 31, 36, .64);
  }
  .dom-handle {
    width: 100%;
    height: 46px;
    background-color: rgba(25, 31, 36, 0.04);
    @include list(row, center, center);
    div {
      color: rgba(30, 137, 255, 1);
      font-size: 14px;
      @include list(row, flex-start, center);
      i {
        margin-left: 7px;
      }
    }
  }
  .dom {
    overflow: hidden;
    height: auto;
    transition: all 1s;
  }
  .dom-hide {
    height: 10px;
  }
}
</style>
<style lang="scss" scoped>
.build-meet-container::v-deep {
  .van-cell {
    &--required {
      &::before {
        content: '';
      }
      .van-cell__title {
        color: rgba(25, 31, 36, 0.64);
        width: auto;
        flex: none;
        span {
          position: relative;
          white-space: nowrap;
          &:before {
            position: absolute;
            right: -10px;
            color: #ee0a24;
            font-size: 14px;
            content: '*';
          }
        }
      }
      .van-field__control {
        color: #191F24;
      }
    }
  }
}
</style>
