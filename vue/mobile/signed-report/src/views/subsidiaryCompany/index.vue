<template>
    <div class="box">
      <Panel v-if="showHandleInfo">
        <div class="title">办理信息</div>
        <div class="item" v-show="showPanel[0]">
          <div class="label">本部门办理人</div>
          <div class="list">
            <div class="block" v-for="(item, index) in ownDepartmentHandleData" :key="index">
              <img :src="item.photo?item.photo:item.img?item.img:groupHeader" alt="" class="header">
              <span class="name">{{item.name}}</span>
              <span @click="deleteFn('ownDepartmentHandle',item.id,item.name)" class="icon-box">
                <SvgIcon href="chahao" class="delete"/>
              </span>
            </div>
          </div>
          <div v-if="show.ownDepartmentHandle" class="add" @click="toLink('/ownDepartmentHandle')">
            <SvgIcon href="yaoqing" class="icon"/>
          </div>
          <div v-else class="add">
            <SvgIcon href="yaoqingjinyong" class="icon"/>
          </div>
        </div>
        <div class="item" v-show="showPanel[1]">
          <div class="label">其他部门办理</div>
          <div class="list">
            <div class="block" v-for="(item, index) in otherDepartmentHandleData" :key="index">
              <img :src="item.photo?item.photo:item.img?item.img:groupHeader" alt="" class="header">
              <span class="name">{{item.name}}</span>
              <span @click="deleteFn('otherDepartmentHandle',item.id,item.name)" class="icon-box">
                <SvgIcon href="chahao" class="delete"/>
              </span>
            </div>
          </div>
          <div v-if="show.otherDepartmentHandle" class="add" @click="toLink('/otherDepartmentHandle')">
            <SvgIcon href="yaoqing" class="icon"/>
          </div>
          <div v-else class="add">
            <SvgIcon href="yaoqingjinyong" class="icon"/>
          </div>
        </div>
        <div class="item" v-show="showPanel[2]">
          <div class="label">公司领导批示</div>
          <div class="list">
            <div class="block" v-for="(item, index) in groupLeaderData" :key="index">
              <img :src="item.img?item.img:groupHeader" alt="" class="header">
              <span class="name">{{item.name}}</span>
              <span @click="deleteFn('groupLeader',item.id,item.name)" class="icon-box">
                <SvgIcon href="chahao" class="delete"/>
              </span>
            </div>
          </div>
          <div v-if="show.groupLeader" class="add" @click="toLink('/groupLeaderCirculate')">
            <SvgIcon href="yaoqing" class="icon"/>
          </div>
          <div v-else class="add">
            <SvgIcon href="yaoqingjinyong" class="icon"/>
          </div>
        </div>
        <div class="item" v-show="showPanel[3]">
          <div class="label">本部门传阅</div>
          <div class="list">
            <div class="block" v-for="(item, index) in ownDepartmentCirculateData" :key="index">
              <img :src="item.img?item.img:groupHeader" alt="" class="header">
              <span class="name">{{item.name}}</span>
              <span @click="deleteFn('ownDepartmentCirculate',item.id,item.name)" class="icon-box">
                <SvgIcon href="chahao" class="delete"/>
              </span>
            </div>
          </div>
          <div class="add" @click="toLink('/ownDepartmentCirculate')">
            <SvgIcon href="yaoqing" class="icon"/>
          </div>
        </div>
        <div class="item" v-show="showPanel[4]">
          <div class="label">其他部门传阅</div>
          <div class="list">
            <div class="block" v-for="(item, index) in otherDepartmentCirculateData" :key="index">
              <img :src="item.photo?item.photo:item.img?item.img:groupHeader" alt="" class="header">
              <span class="name">{{item.name}}</span>
              <span @click="deleteFn('otherDepartmentCirculate',item.id,item.name)" class="icon-box">
                <SvgIcon href="chahao" class="delete"/>
              </span>
            </div>
          </div>
          <div class="add" @click="toLink('/otherDepartmentCirculate')">
            <SvgIcon href="yaoqing" class="icon"/>
          </div>
        </div>
      </Panel>
      <Panel v-if="showDegree">
        <div class="title">办理紧急程度</div>
        <van-radio-group v-model="degree" class="radio-box" @change="radioGroupChange">
          <van-radio name="1">紧急</van-radio>
          <van-radio name="2">急</van-radio>
          <van-radio name="3">一般</van-radio>
        </van-radio-group>
      </Panel>
      <Panel>
        <div class="title-box">
          <div class="title" :class="{'required':isRequired}">办理意见</div>
          <div class="common-msg" @click="showCommon"><SvgIcon href="changyongyijian" class="icon"/>常用意见</div>
        </div>
        <textarea id="" class="msg" v-model="auditNote" @change="auditNoteChange"></textarea>
        <div class="is-common">
          <van-checkbox v-model="saveAuditNote" icon-size="14px">添加为常用意见</van-checkbox>
        </div>
      </Panel>
      <div class="btn-box">
        <van-button type="info" class="btn" @click="submitFn">提交</van-button>
      </div>
      <van-action-sheet v-model="commonShow" :actions="auditNoteActions" @select="onSelect" />
    </div>
</template>

<script>
import Vue from 'vue'
import {
  Button,
  RadioGroup,
  Radio,
  Checkbox,
  ActionSheet,
  Toast,
  Dialog
} from 'vant'
import Panel from '@c/Panel'

import handleApi from '@a/subsidiaryCompany'

Vue.use(Button)
  .use(RadioGroup)
  .use(Radio)
  .use(Checkbox)
  .use(ActionSheet)
  .use(Toast)
  .use(Dialog)

export default {
  data () {
    return {
      roleType: '',
      groupHeader: require('./../../assets/img/group.png'),
      companyHeader: require('./../../assets/img/company.png'),
      degree: this.$store.state.handle.degree,
      showHandleInfo: true,
      isCommon: true,
      showPanel: [false, false, false, false, false, false],
      showDegree: true,
      enableOwnDepartment: true,
      enableGroupLeader: true,
      enableOtherDepartment: true,
      isRequired: true,
      auditNote: '',
      auditNoteName: '',
      auditNoteActions: [],
      saveAuditNote: false,
      commonShow: false,
      isAppend: ''
    }
  },
  created () {
    const u = navigator.userAgent
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) { // 安卓手机
      window.addEventListener('resize', function () {
        // Document 对象的activeElement 属性返回文档中当前获得焦点的元素。
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
          console.log('安卓触发', document.activeElement.tagName)
          window.setTimeout(function () {
            document.activeElement.scrollIntoView(true)
          }, 50)
        }
      })
    }
    //   [0, '本部门办理人'],
    //   [1, '其他部门办理'],
    //   [2, '公司领导批示'],
    //   [3, '本部门传阅'],
    //   [4, '其他部门传阅']
    if (process.env.NODE_ENV === 'development') {
      this.roleType = 'subTransfer'
    } else {
      this.roleType = window.parent.getNodeType()
    }
    this.getUsages()
    this.$store.dispatch('setRoleType', this.roleType)
    this.$store.dispatch('setSubsidiaryCompany', true)
    if (this.roleType === 'subTransfer') {
      this.isRequired = false
    }
    const typeMap = new Map([
      ['subAllTube', ['0', '1', '2', '3', '4']], // 子公司分发领导批示显示内容：本部门办理人、其他部门办理、公司领导阅示、本部门传阅、其他部门传阅；
      ['subTransfer', ['0', '1', '2', '3', '4']] // 子公司分发领导批示显示内容：本部门办理人、其他部门办理、公司领导阅示、本部门传阅、其他部门传阅；
    ])
    let showList = typeMap.get(this.roleType)
    this.showPanelFn(showList)
  },
  computed: {
    isSubsidiaryCompany () {
      return this.$store.state.handle.subsidiaryCompany
    },
    show () {
      // let groupLeaderLength = this.groupLeaderData.length
      let ownDepartmentHandleLength = this.ownDepartmentHandleData.length
      let otherDepartmentHandleLength = this.otherDepartmentHandleData.length
      let ownDepartmentHandle = true
      let otherDepartmentHandle = true
      let groupLeader = true

      if (ownDepartmentHandleLength === 0 && otherDepartmentHandleLength === 0) {
        ownDepartmentHandle = true
        otherDepartmentHandle = true
      } else if (ownDepartmentHandleLength) {
        otherDepartmentHandle = false
      } else if (otherDepartmentHandleLength > 0) {
        ownDepartmentHandle = false
      }
      //  else if (groupLeaderLength > 0) {
      //   ownDepartmentHandle = false
      //   otherDepartmentHandle = false
      // }
      return { ownDepartmentHandle, otherDepartmentHandle, groupLeader }
    },
    groupLeaderData: {
      get () {
        let arr = this.$store.state.handleChosen.groupLeaderData
        arr = arr.filter(item => {
          return item.isCheck
        })
        return arr
      },
      set (val) {
        return val
      }
    },
    otherDepartmentHandleData: {
      get () {
        let arr = this.$store.state.handleChosen.otherDepartmentHandleData
        return arr
      },
      set (val) {
        return val
      }
    },
    otherDepartmentCirculateData: {
      get () {
        let arr = this.$store.state.handleChosen.otherDepartmentCirculateData
        arr = arr.filter(item => {
          return item.isCheck
        })
        return arr
      },
      set (val) {
        return val
      }
    },
    ownDepartmentHandleData: {
      get () {
        let arr = this.$store.state.handleChosen.ownDepartmentHandleData
        return arr
      },
      set (val) {
        return val
      }
    },
    ownDepartmentCirculateData: {
      get () {
        let arr = this.$store.state.handleChosen.ownDepartmentCirculateData
        arr = arr.filter(item => {
          return item.isCheck
        })
        return arr
      },
      set (val) {
        return val
      }
    },
    groupLeaderMsg () {
      let groupLeaderMsg = ''
      this.groupLeaderData.forEach(item => {
        groupLeaderMsg += `呈请${item.name}${item.staffing}阅示；`
      })
      return groupLeaderMsg
    },
    ownDepartmentHandleMsg () {
      let ownDepartmentHandleMsg = ''
      this.ownDepartmentHandleData.forEach(item => {
        ownDepartmentHandleMsg += `请${item.name}${item.staffing}办理；`
      })
      return ownDepartmentHandleMsg
    },
    ownDepartmentCirculateMsg () {
      let ownDepartmentCirculateMsg = ''
      let department = ''
      let circulatorList = ''
      this.ownDepartmentCirculateData.forEach(item => {
        if (item.orgType === '2') {
          department += `${item.name}/`
        } else if (item.orgType === '8') {
          circulatorList += `${item.name}/`
        }
      })
      const replaceNum = (strObj, index, replaceStr) => {
        var str = strObj.substr(0, index - 1) + replaceStr + strObj.substring(index, strObj.length)
        return str
      }
      circulatorList = replaceNum(circulatorList, circulatorList.length, '')
      if (department === '' && circulatorList !== '') {
        ownDepartmentCirculateMsg += `请${circulatorList}阅；`
      } else if (department !== '' && circulatorList === '') {
        department = replaceNum(department, department.length, '')
        ownDepartmentCirculateMsg += `请${department}阅；`
      } else if (department !== '' && circulatorList !== '') {
        ownDepartmentCirculateMsg += `请${department}${circulatorList}阅；`
      }
      return ownDepartmentCirculateMsg
    },
    otherDepartmentHandleMsg () {
      let otherDepartmentHandleMsg = ''
      this.otherDepartmentHandleData.forEach(item => {
        otherDepartmentHandleMsg += `请${item.name}${item.staffing}办理；`
        // if (item.orgType === '1' || item.orgType === '8') {
        //   otherDepartmentHandleMsg += `请${item.name}${item.staffing}办理；`
        // } else {
        // }
      })
      return otherDepartmentHandleMsg
    },
    otherDepartmentCirculateMsg () {
      let otherDepartmentCirculateMsg = ''
      let departmentList = ''
      let companyList = ''
      this.otherDepartmentCirculateData.forEach(item => {
        if (item.orgType === '1' || item.orgType === '8') {
          companyList += `${item.name},`
        } else {
          departmentList += `${item.name},`
        }
      })
      if (departmentList || companyList) {
        otherDepartmentCirculateMsg = `请${companyList}${departmentList}阅；`
      }
      const replaceNum = (strObj, index, replaceStr) => {
        var str = strObj.substr(0, index - 1) + replaceStr + strObj.substring(index, strObj.length)
        return str
      }
      otherDepartmentCirculateMsg = replaceNum(otherDepartmentCirculateMsg, otherDepartmentCirculateMsg.length - 2, '')
      return otherDepartmentCirculateMsg
    },
    auditNoteMsg () {
      let msg
      if (this.roleType === 'subTransfer') {
        msg = msg = this.$store.state.handle.auditNote
      } else {
        msg = this.groupLeaderMsg + this.ownDepartmentHandleMsg + this.otherDepartmentHandleMsg + this.ownDepartmentCirculateMsg + this.otherDepartmentCirculateMsg
      }
      let msgAppend = this.auditNoteName
      const replaceNum = (strObj, index, replaceStr) => {
        var str = strObj.substr(0, index - 1) + replaceStr + strObj.substring(index, strObj.length)
        return str
      }
      if (msg && msg !== '') {
        if (this.isRequired) {
          msg = replaceNum(msg, msg && msg.length, '。')
        }
      }
      if (this.isAppend && this.isAppend === 'false' && this.auditNoteName) {
        msg = this.auditNoteName
      } else {
        msg = msg + msgAppend
      }
      return msg
    }
  },
  methods: {
    getUsages () {
      handleApi.getUsages().then((res) => {
        if (res.data && res.data.length > 0) {
          this.isAppend = res.isAppend
          res.data.forEach(item => {
            let obj = {}
            obj.name = item
            this.auditNoteActions.push(obj)
          })
        }
      }).catch((e) => {
        Toast.fail(e)
      })
    },
    showPanelFn (list) {
      if (list.length === 0) {
        this.showHandleInfo = false
      } else if (list.length === 6) {
        this.showHandleInfo = true
        this.showPanel = [true, true, true, true, true, true]
      } else {
        this.showHandleInfo = true
        list.forEach(item => {
          this.showPanel[item] = true
        })
      }
    },
    showCommon () {
      if (this.auditNoteActions.length > 0) {
        this.commonShow = true
      } else {
        Toast('暂时没有数据')
      }
    },
    onSelect (item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.$nextTick(() => {
        this.auditNoteName = item.name
      })
      this.commonShow = false
    },
    toLink (url) {
      this.$router.push('/subsidiaryCompany' + url)
    },
    radioGroupChange () {
      this.$store.dispatch('setDegree', this.degree)
    },
    deleteFn (type, id, name) {
      Dialog.confirm({
        message: `确定将${name}移除吗？`
      }).then(() => {
        let chosenArr = this.$store.state.handleChosen[type]
        let chosenDataArr = this.$store.state.handleChosen[`${type}Data`]
        const isType = type => obj => Object.prototype.toString.call(obj) === `[object ${type}]`
        const isArray = isType('Array')
        const isString = isType('String')
        if (isArray(chosenArr)) {
          chosenArr.splice(chosenArr.indexOf(id), 1)
        } if (isString(chosenArr)) {
          chosenArr = ''
        }
        chosenDataArr = chosenDataArr.filter(item => item.id !== id)
        this.$store.dispatch(`set${type.replace(type[0], type[0].toUpperCase())}`, chosenArr)
        this.$store.dispatch(`set${type.replace(type[0], type[0].toUpperCase())}Data`, chosenDataArr)
      }).catch((e) => {
        // Toast(e)
      })
    },
    submitData (canStar) {
      let auditNote = this.auditNote
      let degree = this.degree
      let companyLeader = this.groupLeaderData
      let mineDept = this.ownDepartmentHandleData
      let otherDept = this.otherDepartmentHandleData
      let mineDeptCirculated = this.ownDepartmentCirculateData
      let otherDeptCirculated = this.otherDepartmentCirculateData
      let saveAuditNote = this.saveAuditNote
      let zhjwProcessData = {
        canStar, // true 继续办理 false 立即结束
        auditNote, // '审批意见',
        degree, // '紧急程度', // 1-紧急，2-急，3-一般
        companyLeader, // '集团领导阅示(leader配置表ID，多选)',
        mineDept, // '本部门办理人(组织架构人员，单选)',
        otherDept, // '其他部门办理(staff配置表ID，单选)',
        mineDeptCirculated, // '本部门传阅(组织架构，部门、人员多选)',
        otherDeptCirculated, // '其他部门传阅(staff配置表ID，多选)',
        saveAuditNote
      }
      window.parent.review_submit({ zhjwProcessData })
    },
    auditNoteChange (e) {
      this.$store.dispatch('setAuditNote', e.target.value)
    },
    submitFn () {
      if (this.ownDepartmentHandleData.length === 0 && this.otherDepartmentHandleData.length === 0 && this.groupLeaderData.length === 0) {
        Dialog.confirm({
          message: '您未选择办理人，是否立即结束流程？'
        }).then(() => {
          if (this.roleType === 'subTransfer') {
            this.submitData()
          } else {
            if (this.auditNote !== '') {
              this.submitData()
            } else {
              Toast('办理意见不允许为空！！')
            }
          }
        }).catch(() => {
        })
      } else {
        if (this.roleType === 'subTransfer') {
          this.submitData()
        } else {
          if (this.auditNote !== '') {
            this.submitData()
          } else {
            Toast('办理意见不允许为空！！')
          }
        }
      }
    }
  },
  watch: {
    auditNoteMsg: {
      handler (n) {
        this.auditNote = n
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    Panel
  }
}
</script>

<style scoped lang="less">
.van-popup--bottom.van-popup--round {
    border-radius: 0;
}
.van-action-sheet{
  max-height: 30%;
  height: 30%;
}
.van-action-sheet__item{
  height: auto;
}
.van-action-sheet__item, .van-action-sheet__cancel{
  padding: 6px;
  font-size: 16px;
  line-height: 30px;
  color: #767a8a;
}
/deep/ .van-radio__label,
/deep/ .van-checkbox__label{
  font-size: 14px;
}
::placeholder {
  font-size:17px;
  color:rgba(197,206,216,1);
}
*{
  box-sizing: border-box;
}
.box{
  padding-bottom: 88px;
  width: 100vw;
}
.pb12{
  padding-bottom: 12px;;
}
.required{
  &::before{
    content: '*';
    color: red;
  }
}
.panel{
  margin-top: 8px;
  padding-left: 12px;
  background-color: #fff;
  .title-box{
    display: flex;
    justify-content: space-between;
  }
  .common-msg{
    margin-right: 16px;
    font-size:14px;
    color:#1E89FF;
    line-height:17px;
    display: flex;
    align-items: center;
    .icon{
      margin-right: 2px;
      width: 14px;
      height: 14px;
    }
  }
  .msg{
    width: 363px;
    padding-right: 12px;
    font-size: 17px;
    line-height: 20px;
    min-height: 100px;
    resize: none;
    border: 0;
  }
  .title{
    height: 44px;
    font-size:14px;
    color:#5F6A79;
    display: flex;
    align-items: center;
  }
  .item{
    &::after{
        content: '';
        clear: both;
        display: block;
      }
    padding-right: 12px;
    min-height: 56px;
    border-bottom: 1px solid #C5CED8;
    .label{
      margin-right: 12px;
      margin-top: 18px;
      float: left;
      width: 110px;
      height: 20px;
      line-height: 20px;
      font-size:15px;
      color:#040F1E;
    }
    .list{
      &::after{
        content: '';
        clear: both;
        display: block;
      }
      padding-top: 12px;
      min-height: 54px;
      .block{
        float: left;
        margin-right: 12px;
        padding-right: 6px;
        margin-bottom: 12px;
        height: 30px;
        background:#EAF4FF;
        border-radius:15px;
        display: flex;
        align-items: center;
        .header{
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        .name{
          display: flex;
          align-items: center;
          margin: 0 6px;
          height:30px;
          font-size:13px;
          color:#676767;
        }
        .icon-box {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .delete{
          width: 10px;
          height: 10px;
          align-self: center
        }
      }
    }
    .add{
      float: right;
      margin-top: -38px;
      .icon{
        width: 26px;
        height: 26px;
      }
    }
    &:last-child{
      border-bottom: 0;
    }
  }
  .radio-box{
    height: 56px;
    display: flex;
    justify-content: space-around;
  }
}
.is-common{
  padding-bottom: 12px;
}
.btn-box{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 64px;
  background-color: #fff;
  box-shadow:0px 2px 0px 0px rgba(197,206,216,1);
  display: flex;
  justify-content: center;
  align-items: center;
  .btn{
    width: 335px;
    height: 44px;
    border-radius: 8px;
  }
}
</style>
