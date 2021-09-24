<template>
  <div class="batchTaskContent">
    <a-tabs v-model="activeTab">
      <a-tab-pane key="1" tab="模板类型">
        <templateType />
      </a-tab-pane>
      <a-tab-pane key="2" tab="模板">
        <templateTemplate />
      </a-tab-pane>
      <a-tab-pane key="3" tab="模板关系绑定">
        <templateBinding />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import TemplateType from './templateModel/templateType'
import TemplateTemplate from './templateModel/templateTemplate'
import TemplateBinding from './templateModel/templateBinding'
export default {
  name: 'templateModel',
  components: {
    TemplateType,
    TemplateTemplate,
    TemplateBinding
  },
  data () {
    return {
      activeTab: ''
    }
  },
  created() {
    this.activeTab = '1'
  }
}
</script>
