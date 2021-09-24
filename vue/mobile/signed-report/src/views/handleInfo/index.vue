<template>
    <div class="box" id="box">
      <Panel v-if="showHandleInfo">
        <div class="title">办理信息</div>
        <div class="item" v-show="showPanel[0]">
          <div class="label">{{ownDepartmentHandleText}}</div>
          <div class="list">
            <div class="block" v-for="(item, index) in ownDepartmentHandleData" :key="index">
              <img :src="item.img" alt="" class="header">
              <span class="name">{{item.name}}</span>
              <span @click="deleteFn('ownDepartmentHandle',item.id,item.name)" class="icon-box">
                <SvgIcon href="chahao" class="delete"/>
              </span>
            </div>
          </div>
          <div v-if="disableData.enableOwnDepartment" class="add" @click="toLink('/ownDepartmentHandle')">
            <SvgIcon href="yaoqing" class="icon"/>
          </div>
          <div v-else class="add">
            <SvgIcon href="yaoqingjinyong" class="icon"/>
          </div>
        </div>
        <div class="item" v-show="showPanel[1]">
          <div class="label">{{otherDepartmentHandleText}}</div>
          <div class="list">
            <div class="block" v-for="(item, index) in otherDepartmentHandleData" :key="index">
              <img src="./../../assets/img/group.png" alt="" class="header">
              <span class="name">{{item.dept}}</span>
              <span @click="deleteFn('otherDepartmentHandle',item.id,item.dept)" class="icon-box">
                <SvgIcon href="chahao" class="delete"/>
              </span>
            </div>
          </div>
          <div v-if="disableData.enableOtherDepartment" class="add" @click="toLink('/otherDepartmentHandle')">
            <SvgIcon href="yaoqing" class="icon"/>
          </div>
          <div v-else class="add">
            <SvgIcon href="yaoqingjinyong" class="icon"/>
          </div>
        </div>
        <div class="item" v-show="showPanel[2]">
          <div class="label">集团领导阅示</div>
          <div class="list">
            <div class="block" v-for="(item, index) in groupLeaderData" :key="index">
              <img :src="item.photo" alt="" class="header">
              <span class="name">{{item.later}}</span>
              <span @click="deleteFn('groupLeader',item.id,item.later)" class="icon-box">
                <SvgIcon href="chahao" class="delete"/>
              </span>
            </div>
          </div>
          <div class="add" @click="toLink('/groupLeaderCirculate')">
            <SvgIcon href="yaoqing" class="icon"/>
          </div>
        </div>
        <div class="item" v-show="showPanel[3]">
          <div class="label">总助级领导阅示</div>
          <div class="list">
            <div class="block" v-for="(item, index) in groupLeaderAssistantData" :key="index">
              <img :src="item.photo" alt="" class="header">
              <span class="name">{{item.later}}</span>
              <span @click="deleteFn('groupLeaderAssistant',item.id,item.later)" class="icon-box">
                <SvgIcon href="chahao" class="delete"/>
              </span>
            </div>
          </div>
          <div class="add" @click="toLink('/groupLeaderAssistantCirculate')">
            <SvgIcon href="yaoqing" class="icon"/>
          </div>
        </div>
        <div class="item" v-show="showPanel[4]">
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
        <div class="item" v-show="showPanel[5]">
          <div class="label">其他部门传阅</div>
          <div class="list">
            <div class="block" v-for="(item, index) in otherDepartmentCirculateData" :key="index">
              <img src="./../../assets/img/group.png" alt="" class="header">
              <span class="name">{{item.dept}}</span>
              <span @click="deleteFn('otherDepartmentCirculate',item.id,item.dept)" class="icon-box">
                <SvgIcon href="chahao" class="delete"/>
              </span>
            </div>
          </div>
          <div class="add" @click="toLink('/otherDepartmentCirculate')">
            <SvgIcon href="yaoqing" class="icon"/>
          </div>
        </div>
        <div class="item" v-show="showPanel[7]">
          <div class="label">转送其他部门</div>
          <div class="list">
            <div class="block" v-for="(item, index) in otherDepartmentHandleData" :key="index">
              <img src="./../../assets/img/group.png" alt="" class="header">
              <span class="name">{{item.dept}}</span>
              <span @click="deleteFn('otherDepartmentHandle',item.id,item.dept)" class="icon-box">
                <SvgIcon href="chahao" class="delete"/>
              </span>
            </div>
          </div>
          <div v-if="disableData.enableOtherDepartment" class="add" @click="toLink('/otherDepartmentHandle')">
            <SvgIcon href="yaoqing" class="icon"/>
          </div>
          <div v-else class="add">
            <SvgIcon href="yaoqingjinyong" class="icon"/>
          </div>
        </div>
        <div class="item checkbox" v-show="showPanel[7]">
          <van-checkbox-group v-model="complaint">
            <van-cell-group>
              <van-cell
                clickable
                title="转为总部签收"
                @click="complaintGroupFn"
              >
              <template #right-icon>
                <van-checkbox name="group" ref="checkboxes" :disabled="disableData.enableComplaintGroup"/>
              </template>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
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
      <Panel v-if="showSettle">
        <div class="item settle">
          <div class="label required">办结状态</div>
          <div class="list">
            <van-radio-group v-model="transferredStatus" class="radio-box" @change="transferredStatusChange">
              <van-radio name="false">
                未办结
              </van-radio>
              <van-radio name="true" :disabled="completedDisable">
                已办结
              </van-radio>
            </van-radio-group>
          </div>
        </div>
        <div class="item settle" v-if="showTransferredOpinion">
          <div class="label required">办结意见</div>
          <div class="list settleText">
            <span class="text">{{transferredOpinion.text}}</span>
            <span @click="toLink('/conclusions')" class="icon-box">
              <SvgIcon href="youjiantou" class="icon"/>
            </span>
          </div>
        </div>
        <div class="item" v-show="showPanel[6]" v-if="showGroupTransferred">
          <div class="label required">办结审批人</div>
          <div class="list">
            <div class="block" v-for="(item, index) in groupTransferredData" :key="index">
              <img :src="item.img" alt="" class="header">
              <span class="name">{{item.name}}</span>
              <span @click="deleteFn('ownDepartmentHandle',item.id,item.name)" class="icon-box">
                <SvgIcon href="chahao" class="delete"/>
              </span>
            </div>
          </div>
          <div class="add" @click="toLink('/settleApprover')">
            <SvgIcon href="yaoqing" class="icon"/>
          </div>
        </div>
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
  CheckboxGroup,
  cellGroup,
  cell,
  ActionSheet,
  Toast,
  Dialog
} from 'vant'
import Panel from '@c/Panel'

import handleApi from '@a/handleApi'
Vue.use(Button)
  .use(RadioGroup)
  .use(Radio)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(cellGroup)
  .use(cell)
  .use(ActionSheet)
  .use(Toast)
  .use(Dialog)
export default {
  data () {
    return {
      processsId: '',
      ownDepartmentHandleText: '本部门办理人',
      otherDepartmentHandleText: '其他部门办理',
      showGroupTransferred: false,
      roleType: '',
      groupHeader: require('./../../assets/img/group.png'),
      companyHeader: require('./../../assets/img/company.png'),
      degree: this.$store.state.handle.degree,
      showHandleInfo: true,
      showPanel: [false, false, false, false, false, false],
      showDegree: true,
      showSettle: false,
      // complaint: this.$store.state.handle.complaint,
      // complaintGroup: [],
      // complaintIndex: '',
      // complaintRadioDisable: false,
      completedDisable: false,
      isRequired: true,
      auditNote: '',
      auditNoteName: '',
      auditNoteActions: [],
      saveAuditNote: false,
      commonShow: false,
      isAppend: '',
      flag: false // 是否重新生成办理意见
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
    // let clientHeight = document.documentElement.clientHeight || document.body.clientHeight
    // window.onresize = function () {
    //   var nowClientHeight = document.documentElement.clientHeight || document.body.clientHeight
    //   if (clientHeight - nowClientHeight > 60) { // 因为ios有自带的底部高度
    //     // 键盘弹出的事件处理
    //     document.getElementById('box').classList.add('focusState')
    //   } else {
    //     // 键盘收起的事件处理
    //     document.getElementById('box').classList.remove('focusState')
    //   }
    // }
    //   [0, '本部门办理人'],
    //   [1, '其他部门办理'],
    //   [2, '集团领导阅示'],
    //   [3, '总助级领导阅示'],
    //   [4, '本部门传阅'],
    //   [5, '其他部门传阅']
    //   [6, '办结审批人']
    //   [7, '办理异常处理']
    if (process.env.NODE_ENV === 'development') {
      this.roleType = 'groupAllTube'
    } else {
      this.roleType = window.parent.getNodeType()
      this.getProcessId()
    }
    this.getUsages()
    if (this.roleType === 'deptCreate' || this.roleType === 'deptStaff' || this.roleType === 'groupHandleDepartment') {
      this.isRequired = false
    }
    this.$store.dispatch('setRoleType', this.roleType)
    if (this.roleType === 'groupHost' || this.roleType === 'groupTransactor') {
      this.showSettle = true
    }
    if (this.roleType === 'deptCreate') {
      this.otherDepartmentHandleText = '其他部门文书'
    }
    if (this.roleType === 'groupHost') {
      this.ownDepartmentHandleText = '部门领导批示'
    } else if (this.roleType === 'groupCreate') {
      this.ownDepartmentHandleText = '综管部领导批示'
    }
    if (this.roleType === 'groupTransactor' || this.roleType === 'subCompany') {
      this.showDegree = false
    } else {
      this.showDegree = true
    }
    if (this.roleType === 'subCreate' || this.roleType === 'subAllTube' || this.roleType === 'subAllTube') {
      this.$store.dispatch('setSubsidiaryCompany', true)
    }
    const typeMap = new Map([
      ['groupHost', ['0', '4', '5', '6']], // 主办理人内容：本部门领导（本部门办理人）、本部门阅、其他部门阅、紧急程度选项。
      ['groupDepartmentLeader', ['0', '2', '3', '4', '5']], // 办理部门领导显示内容：本部门办理人、本部门传阅、集团领导、送总助级领导、其他部门传阅；
      ['groupHandleDepartment', ['0', '4', '5']], // 总部收文-部门文书 内容：本部门办理人、本部门传阅、其他部门传阅；
      ['groupTransactor', ['4', '5', '6']], // 办理人
      ['groupAllTube', ['0', '1', '2', '3', '4', '5']], // 综合管理部领导批示显示内容：本部门办理人、其他部门办理、集团领导阅示、总助级领导阅示、本部门传阅、其他部门传阅；
      ['groupCreate', ['0', '1', '4', '5']], // 拟稿人环节显示内容：本部门办理人、其他部门办理、本部门传阅、其他部门传阅；
      // ['deptCreate', ['0', '1', '4', '5']], // 部门拟稿节点显示内容：本部门办理人、本部门传阅、其他部门传阅；
      ['deptCreate', ['0', '4', '5', '7']], // 部门收文-收文登记员 内容：本部门办理人、本部门传阅、其他部门传阅；
      ['deptStaff', ['0', '4', '5', '7']], // 部门领导显示内容：本部门办理人、集团领导阅示、总助级领导阅示、本部门传阅、其他部门传阅；
      ['deptLader', ['0', '2', '3', '4', '5']] // 部门领导显示内容：本部门办理人、集团领导阅示、总助级领导阅示、本部门传阅、其他部门传阅；
    ])
    let showList = typeMap.get(this.roleType)
    this.showPanelFn(showList)
  },
  computed: {
    disableData () {
      const ownDepartmentHandleDataLen = this.ownDepartmentHandleData.length
      const otherDepartmentHandleDataLen = this.otherDepartmentHandleData.length
      const complaintGroupLen = this.complaint.length
      let enableOwnDepartment = true
      let enableOtherDepartment = true
      let enableComplaintGroup = false // 是否禁用checkbox
      if (this.roleType !== 'deptCreate' && this.roleType !== 'deptStaff') {
        if (ownDepartmentHandleDataLen > 0) {
          enableOtherDepartment = false
        } else if (otherDepartmentHandleDataLen > 0) {
          enableOwnDepartment = false
        }
      } else {
        if (ownDepartmentHandleDataLen > 0) {
          enableOtherDepartment = false
          enableComplaintGroup = true
        } else if (otherDepartmentHandleDataLen > 0) {
          enableOwnDepartment = false
          enableComplaintGroup = true
        } else if (complaintGroupLen > 0) {
          enableOwnDepartment = false
          enableOtherDepartment = false
        }
      }
      if (this.$store.state.handle.transferredStatus !== 'false') {
        enableOwnDepartment = false
      }
      return { enableOwnDepartment, enableOtherDepartment, enableComplaintGroup }
    },
    complaint: {
      get () {
        return this.$store.state.handle.complaint
      },
      set (val) {
        this.$store.dispatch('setComplaint', val)
      }
    },
    transferredStatus: {
      get () {
        return this.$store.state.handle.transferredStatus
      },
      set (val) {
        this.$store.dispatch('setTransferredStatus', val)
      }
    },
    showTransferredOpinion () {
      return this.$store.state.handle.transferredStatus !== 'false'
    },
    isSubsidiaryCompany () {
      return this.$store.state.handle.subsidiaryCompany
    },
    groupLeaderData: {
      get () {
        let arr = this.$store.state.handleChosen.groupLeaderData
        return arr
      },
      set (val) {
        return val
      }
    },
    companyLeaderData: {
      get () {
        let arr = this.$store.state.handleChosen.companyLeaderData
        return arr
      },
      set (val) {
        return val
      }
    },
    groupLeaderAssistantData: {
      get () {
        let arr = this.$store.state.handleChosen.groupLeaderAssistantData
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
    groupTransferredData: {
      get () {
        let arr = this.$store.state.handleChosen.groupTransferredData
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
        groupLeaderMsg += `呈请${item.later}${item.staffing}阅示；`
      })
      return groupLeaderMsg
    },
    companyLeaderMsg () {
      let companyLeaderMsg = ''
      this.companyLeaderData.forEach(item => {
        companyLeaderMsg += `呈请${item.later}${item.staffing}阅示；`
      })
      return companyLeaderMsg
    },
    groupLeaderAssistantMsg () {
      let groupLeaderAssistantMsg = ''
      this.groupLeaderAssistantData.forEach(item => {
        groupLeaderAssistantMsg += `请${item.staffing}${item.later}阅示；`
      })
      return groupLeaderAssistantMsg
    },
    ownDepartmentHandleMsg () {
      let ownDepartmentHandleMsg = ''
      if (this.roleType === 'groupHost') {
        this.ownDepartmentHandleData.forEach(item => {
          ownDepartmentHandleMsg += `请${item.name}阅；`
        })
      } else if (this.roleType === 'groupCreate') {
        this.ownDepartmentHandleData.forEach(item => {
          ownDepartmentHandleMsg += `请${item.name}${item.staffing}阅示；`
        })
      } else {
        this.ownDepartmentHandleData.forEach(item => {
          ownDepartmentHandleMsg += `请${item.name}办理；`
        })
      }
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
        if (item.orgType === '1' || item.orgType === '8') {
          otherDepartmentHandleMsg += `请${item.name}阅示；`
        } else {
          otherDepartmentHandleMsg += `请${item.dept}阅示；`
        }
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
          departmentList += `${item.dept},`
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
    transferredOpinion: {
      get () {
        return this.$store.state.handle.transferredOpinion
      },
      set (val) {
        return val
      }
    },
    transferredOpinionMsg () {
      return this.transferredOpinion.text ? this.transferredOpinion.text : ''
    },
    auditNoteMsg () {
      // // eslint-disable-next-line no-debugger
      // debugger
      if (this.$store.state.handle.notUpdateMsg) {
        return this.$store.state.handle.auditNote
      }
      let msg
      if (!this.isRequired) {
        msg = this.$store.state.handle.auditNote
      } else {
        msg = this.groupLeaderMsg + this.groupLeaderAssistantMsg + this.ownDepartmentHandleMsg + this.otherDepartmentHandleMsg + this.ownDepartmentCirculateMsg + this.otherDepartmentCirculateMsg
      }
      let msgAppend = this.auditNoteName + this.transferredOpinionMsg
      const replaceNum = (strObj, index, replaceStr) => {
        var str = strObj.substr(0, index - 1) + replaceStr + strObj.substring(index, strObj.length)
        return str
      }
      if (msg && msg !== '') {
        if (this.isRequired) {
          msg = replaceNum(msg, msg && msg.length, '。')
        }
        // if (!this.auditNoteName && !this.transferredOpinionMsg) {
        //   msg = msg + '。'
        // } else {
        //   if (this.isRequired) {
        //     msg = replaceNum(msg, msg && msg.length, '。')
        //   }
        // }
      }
      if (this.isAppend && this.isAppend === 'false' && this.auditNoteName) {
        msg = this.auditNoteName
      } else {
        msg = msg + msgAppend
      }
      this.$store.dispatch('setAuditNote', msg)
      // 判断当前是否为已办结如果是已办结 打标记,当办理意见相关属性变花时 不操作 办结意见
      if (this.$store.state.handle.transferredStatus === 'true' && this.transferredOpinionMsg !== '') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.$store.dispatch('setNotUpdateMsg', true)
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return msg
    }
  },
  methods: {
    complaintGroupFn () {
      if (!this.disableData.enableComplaintGroup) {
        this.$refs.checkboxes.toggle()
      }
    },
    async getProcessId () {
      let oldProcessId = this.$store.state.handle.processId
      this.processId = await window.parent.getProcessId()
      this.$store.dispatch('setProcessId', this.processId)
      this.OwnDepartmentHandleData = this.$store.state.handleChosen.ownDepartmentHandleData
      if (oldProcessId !== this.$store.state.handle.processId && this.roleType === 'groupDepartmentLeader' && this.OwnDepartmentHandleData && this.OwnDepartmentHandleData.length === 0) {
        this.getHistoryHandler()
      }
    },
    getHistoryHandler () {
      handleApi.getHistoryHandler(
        {
          processId: this.processId
        }
      ).then(res => {
        if (res.data && res.data.length > 0) {
          this.$store.dispatch('setOwnDepartmentHandleData', res.data)
        }
      }).catch((e) => {
        Toast.fail(e)
      })
    },
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
      this.$router.push(url)
    },
    radioGroupChange () {
      this.$store.dispatch('setDegree', this.degree)
    },
    transferredStatusChange () {
      if (this.$store.state.handle.transferredStatus !== 'false') {
        this.toLink('/conclusions')
      }
      this.$store.dispatch('setTransferredStatus', this.transferredStatus)
      this.$store.dispatch('setTransferredOpinion', {})
      if (this.transferredStatus === 'false') {
        if (this.roleType === 'groupHost' || this.roleType === 'groupTransactor') {
          this.enableOwnDepartment = true
          this.showGroupTransferred = false
        }
      }
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
      }).catch(() => {
      })
    },
    auditNoteChange (e) {
      this.$store.dispatch('setAuditNote', e.target.value)
    },
    submitData (canStar) {
      let auditNote = this.auditNote
      let degree = this.degree
      let leader = this.groupLeaderData
      let companyLeader = this.companyLeaderData
      let assistant = this.groupLeaderAssistantData
      let mineDept = this.ownDepartmentHandleData
      let otherDept = this.otherDepartmentHandleData
      let mineDeptCirculated = this.ownDepartmentCirculateData
      let otherDeptCirculated = this.otherDepartmentCirculateData
      let complaint = this.complaint && this.complaint[0]
      let transferredStatus = this.transferredStatus
      let groupTransferred = this.groupTransferredData
      let saveAuditNote = this.saveAuditNote

      if (this.showTransferredOpinion && !this.transferredOpinion.text) {
        Toast('请选择办结意见！')
        return false
      } else if (this.showGroupTransferred && this.groupTransferredData.length === 0) {
        Toast('请选择办结审批人！')
      } else {
        let transferredOpinion
        if (this.transferredOpinion.id <= 5) {
          transferredOpinion = true
        } else {
          transferredOpinion = false
        }
        let zhjwProcessData = {
          canStar, // true 继续办理 false 立即结束
          groupTransferred, // 办结审批人
          auditNote, // '审批意见',
          degree, // '紧急程度', // 1-紧急，2-急，3-一般
          leader, // '集团领导阅示(leader配置表ID，多选)',
          companyLeader,
          assistant, // '总助级领导阅示(leader配置表ID，多选)',
          mineDept, // '本部门办理人(组织架构人员，单选)',
          otherDept, // '其他部门办理(staff配置表ID，单选)',
          mineDeptCirculated, // '本部门传阅(组织架构，部门、人员多选)',
          otherDeptCirculated, // '其他部门传阅(staff配置表ID，多选)',
          complaint, // 转办处理
          transferredStatus, // 办结状态
          transferredOpinion,
          saveAuditNote
        }
        if (this.roleType === 'deptStaff' || this.roleType === 'deptCreate') {
          if (this.complaint === 'group') {
            Dialog.confirm({
              message: `转总部办理后，该部门签收流程将废弃，请确认!`
            }).then(() => {
              window.parent.review_submit({ zhjwProcessData })
            })
          } else {
            window.parent.review_submit({ zhjwProcessData })
          }
        } else {
          window.parent.review_submit({ zhjwProcessData })
        }
      }
    },
    submitFn () {
      // 综合管理部领导
      if (this.roleType === 'groupAllTube') {
        // 选择了本部门办理人、其他部门办理,集团领导或总助级领导
        if (this.ownDepartmentHandleData.length !== 0 || this.otherDepartmentHandleData.length !== 0 || this.groupLeaderAssistantData.length !== 0 || this.groupLeaderData.length !== 0) {
          if (this.auditNote !== '') {
            // if (this.groupLeaderAssistantData.length !== 0 || this.groupLeaderData.length !== 0) {
            //   let canStar = true
            //   this.submitData(canStar)
            // } else {
            //   this.submitData()
            // }
            this.submitData()
          } else {
            Toast('办理意见不允许为空！！')
          }
          // 未选择本部门办理人或者其他部门办理
        } else {
          Dialog.confirm({
            message: '您未选择本部门办理人或办理部门，是否立即结束流程？',
            confirmButtonText: '继续办理',
            cancelButtonText: '立即结束'
          }).then(() => {
            let canStar = true
            if (this.auditNote !== '') {
              this.submitData(canStar)
            } else {
              Toast('办理意见不允许为空！！')
            }
          }).catch(() => {
            let canStar = false
            if (this.auditNote !== '') {
              this.submitData(canStar)
            } else {
              Toast('办理意见不允许为空！！')
            }
          })
        }
      // 部门领导
      } else if (this.roleType === 'groupDepartmentLeader' || this.roleType === 'deptLader') {
        // 未选择本部门办理人
        if (this.ownDepartmentHandleData.length === 0) {
          Dialog.confirm({
            message: '您未选择本部门办理人，是否立即结束流程？',
            confirmButtonText: '继续办理',
            cancelButtonText: '立即结束'
          }).then(() => {
            let canStar = true
            if (this.auditNote !== '') {
              this.submitData(canStar)
            } else {
              Toast('办理意见不允许为空！！')
            }
          }).catch(() => {
            let canStar = false
            if (this.auditNote !== '') {
              this.submitData(canStar)
            } else {
              Toast('办理意见不允许为空！！')
            }
          })
          // 选择了本部门办理人
        } else {
          if (this.auditNote !== '') {
            this.submitData()
          } else {
            Toast('办理意见不允许为空！！')
          }
        }
      } else if (this.roleType === 'groupCreate' || this.roleType === 'groupHandleDepartment' || this.roleType === 'deptCreate' || this.roleType === 'subCreate') {
        if (this.ownDepartmentHandleData.length !== 0 || this.otherDepartmentHandleData.length !== 0) {
          if (this.roleType === 'deptCreate' || this.roleType === 'groupHandleDepartment' || this.roleType === 'groupCreate') {
            this.submitData()
          } else {
            if (this.auditNote !== '') {
              this.submitData()
            } else {
              Toast('办理意见不允许为空！！')
            }
          }
        } else {
          if (this.roleType === 'deptCreate' && this.complaint && this.complaint[0]) {
            this.submitData()
          } else {
            Toast('请选择办理人！')
            return false
          }
        }
      } else {
        if (this.roleType === 'deptStaff') {
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
    },
    roleType: {
      handler (n) {
        if (this.roleType === 'groupHost') {
          if (this.ownDepartmentHandleData.length > 0) {
            this.$store.dispatch('setTransferredStatus', 'false')
            this.completedDisable = true
          }
        }
      },
      deep: true,
      immediate: true
    },
    ownDepartmentHandleData: {
      handler (n) {
        this.$nextTick(() => {
          if (this.roleType === 'groupHost') {
            if (this.ownDepartmentHandleData.length === 0) {
              this.completedDisable = false
            }
          }
        })
      },
      deep: true,
      immediate: true
    },
    transferredOpinion: {
      handler (n) {
        if (this.transferredOpinion.text && this.transferredOpinion.id > 5) {
          this.$nextTick(() => {
            if (this.transferredStatus !== 'false') {
              if (this.roleType === 'groupHost' || this.roleType === 'groupTransactor') {
                this.enableOwnDepartment = false
                this.showGroupTransferred = true
              }
            }
          })
        }
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
.focusState {position: absolute;}
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
      .icon-box{
        padding: 12px;
        .icon{
          width: 14px;
          height: 18px;
        }
      }
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
  .checkbox{
    padding-right: 0;
    .van-cell{
      padding-left: 0;
      padding-top: 16px;
      padding-bottom: 16px;
      font-size:15px;
      color:#040F1E;
    }
    [class*='van-hairline']::after{
      border: 0;
    }
    .van-checkbox{
      padding-left: 2px;
    }
  }
  .settle{
    .label{
      width: 80px;
    }
    .list{
      padding-top: 0;
    }
    .settleText{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .text{
        font-size: 13px;
        width: 260px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .radio-box,
  .check-box{
    height: 56px;
    display: flex;
    justify-content: space-around;
  }
  [flex~='dir:column'] {
    padding-bottom: 10px;
    height: auto;
    flex-direction: column;
    & > .van-checkbox{
      padding: 10px 0;
    }
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
