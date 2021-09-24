<!--
 * @Author: aq.hu
 * @Date: 2021-04-19 17:18:27
 * @LastEditTime: 2021-04-20 11:30:05
 * @LastEditors: aq.hu
 * @Description: 
-->
<template>
  <a
    :class="[
      'el-link',
      type ? `el-link--${type}` : '',
      disabled && 'is-disabled',
      underline && !disabled && 'is-underline',
      linkSize ? 'el-link--' + linkSize : ''
    ]"
    :href="disabled ? null : href"
    v-bind="$attrs"
    @click="handleClick"
  >

    <i :class="icon" v-if="icon"></i>

    <span v-if="$slots.default" class="el-link--inner">
      <slot></slot>
    </span>

    <template v-if="$slots.icon"><slot v-if="$slots.icon" name="icon"></slot></template>
  </a>
</template>

<script>

export default {
  name: 'ElLink',

  props: {
    type: {
      type: String,
      default: 'default'
    },
    underline: {
      type: Boolean,
      default: true
    },
    disabled: Boolean,
    href: String,
    icon: String,
    size: String
  },

  computed: {
    linkSize() {
      return this.size || (this.$ELEMENT || {}).size;
    }
  },

  methods: {
    handleClick(event) {
      if (!this.disabled) {
        if (!this.href) {
          this.$emit('click', event);
        }
      }
    }
  }
};
</script>
