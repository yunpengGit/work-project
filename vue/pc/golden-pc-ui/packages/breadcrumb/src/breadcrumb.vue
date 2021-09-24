<!--
 * @Descripttion: 
 * @Author: pengpeng
 * @Date: 2021-04-19 14:14:06
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-04-20 09:15:16
-->
<template>
  <div
    :class="['el-breadcrumb', breadcrumbSize ? 'el-breadcrumb--' + breadcrumbSize : '']"
    aria-label="Breadcrumb" role="navigation">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'ElBreadcrumb',

    props: {
      size: String,
      separator: {
        type: String,
        default: '/'
      },
      separatorClass: {
        type: String,
        default: ''
      }
    },

    provide() {
      return {
        elBreadcrumb: this
      };
    },
    computed: {
      breadcrumbSize() {
        return this.size || (this.$ELEMENT || {}).size;
      }
    },
    mounted() {
      const items = this.$el.querySelectorAll('.el-breadcrumb__item');
      if (items.length) {
        items[items.length - 1].setAttribute('aria-current', 'page');
      }
    }
  };
</script>
