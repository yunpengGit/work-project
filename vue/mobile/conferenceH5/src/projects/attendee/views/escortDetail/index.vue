<!--
* @Descripttion:
* @Author: wanghz
* @Date: 2021-07-16 15:44:00
* @LastEditors: Please set LastEditors
* @LastEditTime:
-->
<template>
  <div>
    <div class="top">
      <div class="escort-info-item">
        <div class="label">姓名</div>
        <div class="value">{{ attendeeDetailData.fixAttributeCommonVO.attendeeName }}</div>
      </div>
      <div class="escort-info-item">
        <div class="label">手机号</div>
        <div class="value">{{ attendeeDetailData.fixAttributeCommonVO.phone }}</div>
      </div>
      <div class="escort-info-item">
        <div class="label">性别</div>
        <div class="value">{{ attendeeDetailData.fixAttributeCommonVO.sexStr || '-' }}</div>
      </div>
      <div class="escort-info-item">
        <div class="label">职务</div>
        <div class="value">{{ attendeeDetailData.fixAttributeCommonVO.position || '-' }}</div>
      </div>
      <div class="escort-info-item">
        <div class="label">单位名称</div>
        <div class="value">
          {{ attendeeDetailData.fixAttributeCommonVO.organizationName }}
        </div>
      </div>
      <!-- <div class="escort-info-item remark">
      <div class="label">备注</div>
      <div class="value">{{}}</div>
    </div> -->
    </div>
    <div class="bottom">
      <a
:href="'tel:' + attendeeDetailData.fixAttributeCommonVO.phone"
        ><van-button block type="info" native-type="submit">语音通话</van-button></a
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    routeParams: {
      type: Object
    }
  },
  data() {
    return {
      attendeeDetailData: {
        fixAttributeCommonVO: {
          attendeeName: '',
          organizationName: '',
          position: '',
          phone: ''
        }
      }
    }
  },
  created() {
    this.getAttendeeDetail()
  },
  mounted() {},
  methods: {
    // 根据id查看参会人信息
    getAttendeeDetail() {
      const id = this.routeParams.attendeeId
      this.$api({
        url: 'attendeeApi.getAttendeeDetail',
        data: {
          id,
          publish: 1
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result
          this.attendeeDetailData = data
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.top {
  font-size: 15px;
  .escort-info-item {
    background-color: #fff;
    height: 53px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f1f1f2;
    .label {
      color: rgba(25, 31, 36, 0.64);
    }
  }
}
.bottom {
  width: 100%;
  padding: 10px 16px;
  position: fixed;
  bottom: 0;
  background-color: #fff;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  a {
    width: 100%;
    display: block;
  }
  .van-button {
    border-radius: 4px;
  }
}
</style>
