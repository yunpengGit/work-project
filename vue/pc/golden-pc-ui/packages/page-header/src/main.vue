<!--
 * @Descripttion: 
 * @Author: pengpeng
 * @Date: 2021-04-19 14:14:06
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-04-21 09:43:08
-->
<template>
  <div
    :class="['el-page-header', pageHeaderSize ? 'el-page-header--' + pageHeaderSize : '']"
  >
    <div class="el-page-header__left" @click="$emit('back')">
      <i class="el-icon-back"></i>
      <div class="el-page-header__title">
        <slot name="title">{{ title }}</slot>
      </div>
    </div>
    <div class="el-page-header__content">
      <slot name="content">{{ content }}</slot>
    </div>
  </div>
</template>

<script>
import { t } from 'golden-pc-ui/src/locale';
export default {
  name: 'ElPageHeader',

  props: {
    size: String,
    title: {
      type: String,
      default() {
        return t('el.pageHeader.title');
      }
    },
    content: String
  },
  computed: {
    pageHeaderSize() {
      return this.size || (this.$ELEMENT || {}).size;
    }
  }
};
</script>
