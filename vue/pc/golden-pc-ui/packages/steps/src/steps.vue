<!--
 * @Descripttion: 
 * @Author: pengpeng
 * @Date: 2021-04-19 14:14:06
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-04-22 10:28:26
-->
<template>
  <div
    class="el-steps"
    :class="[
      !simple && 'el-steps--' + direction,
      simple && 'el-steps--simple',
      stepsSize ? 'el-steps--' + stepsSize : '',
    ]">
      <slot></slot>
  </div>
</template>

<script>
import Migrating from 'golden-pc-ui/src/mixins/migrating';

export default {
  name: 'ElSteps',

  mixins: [Migrating],

  props: {
    size: String,
    space: [Number, String],
    active: Number,
    direction: {
      type: String,
      default: 'horizontal'
    },
    alignCenter: Boolean,
    simple: Boolean,
    finishStatus: {
      type: String,
      default: 'finish'
    },
    processStatus: {
      type: String,
      default: 'process'
    }
  },

  data() {
    return {
      steps: [],
      stepOffset: 0
    };
  },
  computed: {
    stepsSize() {
      return this.size || (this.$ELEMENT || {}).size;
    }
  },
  methods: {
    getMigratingConfig() {
      return {
        props: {
          'center': 'center is removed.'
        }
      };
    }
  },

  watch: {
    active(newVal, oldVal) {
      this.$emit('change', newVal, oldVal);
    },

    steps(steps) {
      steps.forEach((child, index) => {
        child.index = index;
      });
    }
  }
};
</script>
