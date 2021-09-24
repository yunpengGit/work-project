<template>
  <div class="export-plan-1620643383879">
    <el-dialog
      title="导出领导安排"
      :visible="dialogVisible"
      @update:visible="visibaleChange"
    >

      <el-form ref="ruleForm" :model="form" :rules="rules">
        <el-form-item label="安排时间：" prop="dateRange">
          <el-date-picker
            v-model="form.dateRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>

        <el-form-item label="选择领导：" prop="selectLeaders" class="leader-wrap">
          <div v-for="(item,index) in leaderOptions" :key="index" class="leader-item">
            <template v-if="item.leaders.length">
              <el-checkbox v-model="item.checkAll" :indeterminate="item.isIndeterminate" class="leader-type" @change="handleCheckAllChange(item)">{{ item.label }}</el-checkbox>
              <el-checkbox-group v-model="item.checked" @change="handleCheckOneChange(item)">
                <el-checkbox v-for="d in item.leaders" :key="d.leaderId" :label="d.leaderId">{{ d.leaderName }}</el-checkbox>
              </el-checkbox-group>
            </template>
          </div>

        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visibaleChange">取 消</el-button>
        <el-button type="primary" :disabled="!leaderOptions.length" @click="onSure">导 出</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { saveAs } from 'file-saver'
import axios from 'axios'
import { getToken } from '@/utils/auth'
export default {
  name: 'ExportPlan',
  components: { },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    allLeaders: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      form: {
        selectLeaders: [],
        dateRange: [dayjs().day(1).format('YYYY-MM-DD'), dayjs().day(7).format('YYYY-MM-DD')]
      },
      rules: {
        dateRange: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        selectLeaders: [
          { type: 'array', required: true, message: '请选择领导', trigger: 'blur' }
        ]
      },
      leaderOptions: []
    }
  },
  computed: {},
  watch: {
    'leaderOptions': {
      handler (n) {
        const leaders = []
        this.leaderOptions.map(d => { leaders.push(...d.checked) })
        this.form.selectLeaders = leaders
      },
      deep: true
    }
  },
  created () {
    this.getLeaders()
  },
  mounted () {},
  methods: {
    visibaleChange () {
      this.$emit('update:dialog-visible', false)
    },
    getLeaders () {
      // 所有领导
      const leaders = this.allLeaders
      const group_leader = [] // 集团领导
      const senior_manager = [] // 高管
      const department_leaders = [] // 部门领导

      leaders.map(d => {
        switch (d.leaderType) {
          case 1 :
            group_leader.push(d)
            break
          case 10 :
            senior_manager.push(d)
            break
          case 20 :
            department_leaders.push(d)
            break
        }
      })

      const obj = {
        checked: [],
        checkAll: false,
        isIndeterminate: false
      }
      if (group_leader.length) {
        this.leaderOptions.push({ ...obj, label: '集团领导', leaders: group_leader })
      }

      if (senior_manager.length) {
        this.leaderOptions.push({ ...obj, label: '总助级高管', leaders: senior_manager })
      }

      if (department_leaders.length) {
        this.leaderOptions.push({ ...obj, label: '部门领导', leaders: department_leaders })
      }
    },
    onSure () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.leaderOptions.map(d => {
            if (d.checked.length) {
              setTimeout(() => {
                const req = {
                  type: d.leaders[0].leaderType,
                  leaders: d.checked.join(','),
                  planStartTime: this.form.dateRange[0],
                  planEndTime: this.form.dateRange[1]
                }

                let params = ''
                for (const key in req) {
                  params = `${params}${key}=${req[key]}&`
                }
                params = params.substr(0, params.length - 1)
                axios({
                  url: process.env.VUE_APP_BASE_API + '/portal/plan/export?' + params,
                  method: 'get',
                  responseType: 'blob',
                  headers: { 'Authorization': `Bearer ${getToken()}` }
                }).then(res => {
                  const patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
                  const contentDisposition = decodeURI(res.headers['content-disposition'])
                  const result = patt.exec(contentDisposition)
                  const fileName = result[1].replace(/\"/g, '')
                  saveAs(res.data, fileName)
                })
              })
            }
          })
        } else {
          return false
        }
      })
    },
    handleCheckAllChange (item) {
      item.checked = item.checkAll ? item.leaders.map(v => v.leaderId) : []
      item.isIndeterminate = false
    },
    handleCheckOneChange (item) {
      const checkedCount = item.checked.length
      item.checkAll = checkedCount === item.leaders.length
      item.isIndeterminate = checkedCount > 0 && checkedCount < item.leaders.length
    }
  }
}
</script>

<style lang="scss" scoped>
.export-plan-1620643383879 ::v-deep {
  .el-dialog {
    width: 500px;
    .el-dialog__body {
      padding-bottom: 0;
    }
    .el-form-item__label {
      width: 100px;
    }
    .leader-wrap {
      .el-form-item__content {
        float: left;
        margin-top: 10px;
        margin-left: 20px !important;
        .leader-item {
            display: flex;
            align-items: baseline;
          .leader-type {
            width: 100px;
            margin-right: 30px;
          }
          .el-checkbox-group {
            // display: inline-block;
            display: flex;
            flex-wrap: wrap;
            width: 295px;
            vertical-align: top;
            padding: 6px 0;
            border-bottom: 1px solid rgba(25, 31, 36, 0.08);
            .el-checkbox {
              margin-top: 6px;
              margin-bottom: 6px;
              width: 85px;
              margin-right: 13px;
            }
          }
          &:last-child {
            .el-checkbox-group {
              border-bottom: 0;
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
@import '@/ui/size/mixin.scss';
@mixin del($sc: 1, $fs: 14px){
  .export-plan-1620643383879 {
    .el-dialog {
      width: 500px * $sc !important;
       .el-form {
          .el-form-item__label {
            width: 100px * $sc!important;
          }
          .leader-wrap {
              .leader-item {
                .leader-type {
                  width: 100px * $sc!important;
                }
                .el-checkbox-group {
                  width: 295px * $sc!important;
                  .el-checkbox {
                    margin-top: 6px * $sc!important;
                    margin-bottom: 6px * $sc!important;
                    width: 85px * $sc!important;
                    margin-right: 13px * $sc!important;
                  }
                }
              }
          }
       }
    }
  }
}
@import '@/ui/size/mixin.scss';
@import '@/ui/size/scale.scss';
</style>
