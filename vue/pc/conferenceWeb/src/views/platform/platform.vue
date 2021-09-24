<template>
  <div :style="{'height': formHeight,'overflow-x':'hidden','overflow-y':'auto'}">
    <el-scrollbar wrap-class="scrollbar-wrapper" :style="{'height':'100%'}">
      <div :style="{'min-height': formHeight}" class="huiyidatingClass">
        <div style="padding-top:14px" class="huiyiRadioClass">
          <el-radio-group v-model="radio1">
            <el-radio-button :label="1">
              <svg-icon v-show="radio1 === 1" icon-class="wodebai" style="margin-right:4px;"/>
              <svg-icon v-show="radio1 === 2" icon-class="wode" style="margin-right:4px;"/>
              我的会议活动
              <!-- <i class="el-icon-user" style="margin-right: 4px;width:11px" /> -->
            </el-radio-button>
            <el-radio-button :label="2">
              <!-- <i class="el-icon-menu" style="margin-right: 4px;width:11px" /> -->
              <svg-icon v-show="radio1 === 2" icon-class="dating" style="margin-right:4px;"/>
              <svg-icon v-show="radio1 === 1" icon-class="datinghei" style="margin-right:4px;"/>
              会议活动大厅
            </el-radio-button>
          </el-radio-group>
          <el-button type="primary" class="chuangjianhuiyiClass" style="float:right" @click="createConference">
            <i class="el-icon-plus" style="margin-right: 4px;width:11px"/>创建会议活动
          </el-button>
          <el-button type="primary" plain class="copy-platform-class" style="float:right"
                     @click="dialogVisibleCopyOne = true">
            <i class="el-icon-document-copy" style="margin-right: 4px;width:11px"/>复制会议活动
          </el-button>
        </div>
        <MyMeetingList v-show="radio1 === 1" @createConference="createConference"
                       @shezhiConferceList="shezhiConferceList"/>
        <AllMeetingList v-show="radio1 === 2" :my-conference-list="myConferenceList"/>
        <ConferenceTemplate :dialog-visible="dialogVisible" @closeDialog="closeDialog"/>
        <CopyPlatformStepOne :dialogVisible="dialogVisibleCopyOne" @closeDialog="dialogVisibleCopyOne = false"
                             @next="copyPlatformStepOneNext"/>
        <CopyPlatformStepTwo :dialog-visible="dialogVisibleCopyTwo" :copyPlatformData="copyPlatformData"
                             @closeDialog="dialogVisibleCopyTwo = false" @lastStep="copyPlatformStepTwoLastStep"
                             @over="copyPlatformStepTwoOver" :loading="dialogVisibleCopyTwoLoading"/>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import MyMeetingList from './myMeetingList'
import AllMeetingList from './allMeetingList'
import CopyPlatformStepOne from './copyPlatformStepOne'
import CopyPlatformStepTwo from './copyPlatformStepTwo'
import ConferenceTemplate from '@/views/meetingMage/creatMeeting/conferenceTemplate'
import {setConferenceId, setConferenceTemplate} from '@/utils/conference-auth'
import {getTableHeight} from '@/utils/index'
import {copy} from '@/api/conference'

export default {
  name: 'Platform',
  components: {
    ConferenceTemplate,
    MyMeetingList,
    AllMeetingList,
    CopyPlatformStepOne,
    CopyPlatformStepTwo
  },
  data() {
    return {
      formHeight: getTableHeight(-55) + 'px',
      myConferenceList: [],
      dialogVisible: false,
      dialogVisibleCopyOne: false,
      dialogVisibleCopyTwo: false,
      dialogVisibleCopyTwoLoading: false,
      radio1: 1,
      copyPlatformData: null
    }
  },
  mounted() {
    document.getElementById('gongzuotai').className = 'headerMenu-is-active'
    // border-bottom-color: transparent;
  },
  created() {
    setConferenceId('')
    setConferenceTemplate('')
  },
  methods: {
    shezhiConferceList(val) {
      this.myConferenceList = val
    },
    createConference() {
      setConferenceId('')
      setConferenceTemplate('')
      this.$router.push({
        path: '/selectConferenceTemplate'
      })
    },
    copyPlatformStepOneNext(selectData) {
      this.copyPlatformData = selectData;
      this.dialogVisibleCopyOne = false;
      this.dialogVisibleCopyTwo = true;
    },
    copyPlatformStepTwoLastStep() {
      this.dialogVisibleCopyTwo = false;
      this.dialogVisibleCopyOne = true;
    },
    copyPlatformStepTwoOver(selectCopyItem) {
      this.dialogVisibleCopyTwoLoading = true;
      // 拿到所有信息了，开始创建会议信息
      copy(this.copyPlatformData.id, selectCopyItem).then(res => {
        this.dialogVisibleCopyTwoLoading = false
        if (res.success) {
          this.$message.success("复制成功")
          this.dialogVisibleCopyTwo = false;
          setConferenceId(res.result.id)
          setConferenceTemplate(res.result.conferenceTemplate)
          this.$router.push(`/meeting/update`)
        }
      })
    },
    closeDialog(val) {
      if (val !== null) {
        setConferenceTemplate(val)
        // this.getConferenceTemplate()
        this.$router.push({
          path: '/meetingCreate/create',
          query: {
            conferenceTemplate: JSON.stringify(val)
          }
        })
      }
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
.huiyidatingClass {
  padding-left: 20%;
  padding-right: 20%;
  background-color: white;
  min-height: 100%;

  .el-radio-button__inner {
    height: 40px;
    padding-top: 0px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    line-height: 40px;
    border-radius: 4px;
    box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.04);
    border-radius: 4px 0px 0px 4px;
  }

  .huiyiRadioClass {
    .is-active {
      border-radius: 4px;
      background: #1E89FF;

    }
  }
}

.huiyidatingClass {
  .chuangjianhuiyiClass .copy-platform-class {
    height: 40px;
    box-shadow: 0px 3px 8px 0px rgba(30, 137, 255, 0.3);
    border-radius: 4px;
    padding-top: 0px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    line-height: 40px;
  }

  .copy-platform-class {
    margin-right: 5px;
  }

  .chuangjianhuiyiClass {
    background: #1E89FF;
  }
}
</style>
