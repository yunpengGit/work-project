<!--
 * @Descripttion:
 * @Author: aq.hu
 * @Date: 2021-03-24 17:55:49
 * @LastEditors: zongmz
 * @LastEditTime: 2021-05-19 17:13:43
-->
<template>
  <div class="people-change">
    <sp-table
      keys="userName,outgoingType,deptId"
      :is-index="true"
      :table-cols="tableCols"
      :api="getList"
    >
      <div slot="form">
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="$router.push('/peopleChange/add')"
        >登记</el-button>
      </div>
    </sp-table>
    <detail v-if="drawer" :drawer.sync="drawer" :dynamic-id="detailId" />
  </div>
</template>

<script>

import { getItem } from '@/utils/storage'
import detail from './detail'

export default {
  components: { detail },
  data () {
    return {
      userName: '', // 姓名关键词
      outgoingType: '', // 类型关键词
      tableCols: [
        {
          label: '姓名',
          prop: 'userName',
          width: '160px'
        },
        { label: '周期',
          width: '400px',
          template: scope => {
            return `${scope.row.outStartTime} - ${scope.row.outEndTime}`
          }
        },
        { label: '类型',
          width: '130px',
          template: scope => {
            return this.getType(scope.row.outgoingType)
          }
        },
        { label: '地址',
          showOverflowTooltip: true,
          template: scope => {
            return scope.row.meetingAddr === '' ? scope.row.businessTripAddr : scope.row.meetingAddr
          }
        },
        { label: '接收人',
          prop: 'receiveUserName',
          width: '160px'
        },
        { label: '登记时间',
          width: '210px',
          prop: 'registerDate'
        },
        {
          label: '操作',
          width: '110px',
          template: scope => {
            return <div>
              <el-button
                type='text'
                on-click={() => this.getDetail(scope.row.dynamicId)}
              >查看</el-button>
            </div>
          }
        }
      ],
      userList: [],
      userInfo: null,
      deptId: '', // 部门id
      drawer: false, // 详情抽屉
      detailId: ''
    }
  },
  created () {
    this.userInfo = JSON.parse(getItem('userInfo'))
  },
  methods: {
    // 获取表格数据
    getList (params) {
      return this.$api('peopleChange.getList', params)
    },
    // 更新列表
    refreshData () {
      this.$store.commit('UPDATE_ALL_TABLE_DATA')
    },
    // 类型转换
    getType (value) {
      let text = ''
      switch (value) {
        case 1:
          text = '市外出差'
          break
        case 2:
          text = '外出开会'
          break
        case 3:
          text = '市内办事'
          break
        case 4:
          text = '休假请假'
          break
      }
      return text
    },
    // 查看详情
    getDetail (id) {
      this.detailId = id
      this.drawer = true
    },
    // 注销
    cancel (dynamicId) {
      this.$confirm('确定注销此条动态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api('peopleChange.revokeData', { dynamicId }).then(res => {
          if (res.code === 200) {
            this.$message.success('注销成功')
            this.refreshData()
          }
        })
      }).catch(() => {})
    },
    // 编辑
    upData (id) {
      this.$router.push({
        path: '/peopleChange/add',
        query: { id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.people-change {
  .layout {
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
    border-radius: 4px;
  }
}
</style>
