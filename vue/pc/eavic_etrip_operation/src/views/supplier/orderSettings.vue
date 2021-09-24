<template>
  <div class="detail">
    <div v-if="companyData">
      <Breadcrumb :baseBreadcrumbData="['国内机票','订单设置']"></Breadcrumb>
      <detail-list :col="3" title="订单设置" layout="vertical" :span="{label: 24,content: 24,labelTextLeft: true}" v-if="companyDetail">
        <template v-slot:button>
          <a-button type="primary" @click="editFn()" size="small" class="btn">
            编辑
          </a-button>
        </template>
        <template v-slot:list>
          <detail-list-item term="Office号">{{companyDetail.officeNum}}</detail-list-item>
          <detail-list-item term="APP预定服务费限制">{{companyDetail.appFeeLimit}}</detail-list-item>
          <detail-list-item term="电话预定服务费限制">{{companyDetail.telFeeLimit}}</detail-list-item>
          <detail-list-item term="邮件通知地址">{{companyDetail.emailNotifyAddress}}</detail-list-item>
          <detail-list-item term="服务专线">{{companyDetail.serviceLineTel}}</detail-list-item>
        </template>
      </detail-list>
      <a-empty v-else description="暂无订单设置信息">
        <a-button type="primary" @click="addFn()">
          新增
        </a-button>
      </a-empty>
      <a-drawer
        :title="drawerTitle"
        :width="890"
        :visible="visible"
        :body-style="{ paddingBottom: '80px' }"
        @close="drawerClose"
      >
        <a-form
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 15 }"
          :form="drawerForm"
        >
          <a-form-item :style="{'display': 'none'}">
            <a-input
              v-decorator="['id']"
              type="hidden"
            />
          </a-form-item>
          <a-form-item label="Office号">
            <a-input
              v-decorator="['officeNum', { rules: [{ max: 20, message: '必填项,不能超过20个字符'}] }]"
              placeholder="请输入"
            />
          </a-form-item>
          <a-form-item>
            <span slot="label">
              APP预定服务费限制
              <a-tooltip title="保留小数点后两位，多个金额用英文逗号分隔">
                <a-icon type="info-circle" />
              </a-tooltip>
            </span>
            <a-input
              v-decorator="['appFeeLimit', { rules: [{ max: 20, message: '必填项,不能超过20个字符'}] }]"
              placeholder="请输入"
            />
          </a-form-item>
          <a-form-item>
            <span slot="label">
              电话预定服务费限制
              <a-tooltip title="保留小数点后两位，多个金额用英文逗号分隔">
                <a-icon type="info-circle" />
              </a-tooltip>
            </span>
            <a-input
              v-decorator="['telFeeLimit']"
              placeholder="请输入"
            />
          </a-form-item>
          <a-form-item>
            <span slot="label">
              电话预定服务费限制
              <a-tooltip title="如果系统触发相关通知邮件，会发送至这个邮件地址">
                <a-icon type="info-circle" />
              </a-tooltip>
            </span>
            <a-input
              v-decorator="['emailNotifyAddress', { rules: [{pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, message: '请输入有效的邮箱'}]}]"
              placeholder="请输入"
            />
          </a-form-item>
          <a-form-item label="服务专线">
            <a-input
              v-decorator="['serviceLineTel']"
              placeholder="请输入"
            />
          </a-form-item>
          <a-row>
            <a-col :md="48" :style="{textAlign: 'right'}">
              <a-button type="primary" @click="drawerFn()">
                保存
              </a-button>
            </a-col>
          </a-row>
        </a-form>
      </a-drawer>
    </div>
    <a-empty v-else description="请先选择供应商" />
  </div>
</template>

<script>
import { DetailList } from '@/components'
import { save, getByParams } from '@/api/supplier/orderSettings.js'
import Breadcrumb from './Breadcrumb'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('supplier')
const DetailListItem = DetailList.Item

export default {
  name: 'orderSettings',
  components: {
    Breadcrumb,
    DetailList,
    DetailListItem
  },
  data () {
    return {
      visible: false,
      drawerTitle: '编辑供应商信息',
      drawerForm: this.$form.createForm(this, { name: 'drawerForm' }),
      companyDetail: ''
    }
  },
  computed: {
    ...mapState(['company']),
    breadcrumbList() {
      const arr = ['国内机票']
      // splice 使用替换时必须添加第二个参数
      arr.splice(1, 0, this.company.shortName, '订单设置')
      return arr
    },
    companyData() {
      return this.company
    }
  },
  mounted () {
    // this.getByParams()
  },
  methods: {
    getByParams() {
      const data = {
        code: '1001',
        supplierId: this.company.id
      }
      getByParams(data).then(res => {
        this.companyDetail = res.model
      })
    },
    addFn() {
      this.drawerTitle = '新增供应商信息'
      this.visible = true
      this.drawerForm.resetFields()
    },
    editFn() {
      this.drawerTitle = '编辑供应商信息'
      this.visible = true
      const record = this.companyDetail
      const drawerFormData = {
        officeNum: record.officeNum,
        serviceLineTel: record.serviceLineTel,
        telFeeLimit: record.telFeeLimit,
        appFeeLimit: record.appFeeLimit,
        emailNotifyAddress: record.emailNotifyAddress
      }
      this.drawerInit(drawerFormData)
    },
    drawerInit(drawerFormData) {
      let initData = {}
      if (drawerFormData) {
        initData = drawerFormData
      }
      // 表单回显必须使用后 nextTick
      this.$nextTick(() => {
        this.drawerForm.setFieldsValue(initData)
      })
    },
    drawerClose() {
      this.visible = false
    },
    drawerShow() {
      this.visible = true
    },
    drawerFn() {
      this.drawerForm.validateFields({ force: true }, (err, values) => {
        if (!err) {
          console.log('login form', values)
          const data = { ...values }
          data.code = '1001'
          data.supplierId = this.company.id
          save(data).then((res) => {
            if (res.code === 1000000) {
              this.$message.success(res.resultStr)
              this.visible = false
              this.$nextTick(() => {
                this.companyDetail = Object.assign(this.companyDetail, data)
              })
              console.log(this.companyDetail)
            } else {
              this.$message.error(res.resultStr)
            }
          })
        }
      })
    }
  },
  watch: {
    company: {
      handler(n) {
        this.getByParams()
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="less">
.detail{
  padding: 16px;
  .breadcrumb{
    margin-bottom: 16px;
    height: 30px;
    border-bottom: 1px #e3e3e3 solid;
    color: rgba(0, 0, 0, 0.85);
    span:last-child{
      color: rgba(0, 0, 0, 0.85);
    }
  }
  .btn{
    margin-left: 10px;
  }
}
</style>
