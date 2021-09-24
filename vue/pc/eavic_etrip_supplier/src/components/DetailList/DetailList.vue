<template>
  <div :class="['detail-list', size, layout === 'vertical' ? 'vertical': 'horizontal']">
    <div v-if="title" class="title">{{ title }}<slot name="button"></slot></div>
    <a-row :gutter="gutter">
      <slot name="list"></slot>
    </a-row>
  </div>
</template>

<script>
import { Col } from 'ant-design-vue/es/grid/'
const Item = {
  name: 'DetailListItem',
  props: {
    term: {
      type: String,
      default: '',
      required: false
    }
  },
  inject: {
    col: {
      type: Number
    },
    span: {
      type: Object
    }
  },
  computed: {
    labelClass () {
      if (this.span.labelTextLeft) {
        return `term text-left`
      } else {
        return `term`
      }
    }
  },
  // created () {
  //   console.log(this.span)
  // },
  render () {
    // ! 优化label和content的宽度占比
    // ! jsx 中使用slot
    const icon = this.$slots.icon
    return (
      <Col {...{ props: responsive[this.col] }} >
        <Col span={this.span.label}>
          <div class={this.labelClass} >{this.$props.term}{icon}</div>
        </Col>
        <Col span={this.span.content}>
          <div class="content">{this.$slots.default}</div>
        </Col>
      </Col>
    )
  }
}

const responsive = {
  1: { xs: 24 },
  2: { xs: 24, sm: 12 },
  3: { xs: 24, sm: 12, md: 8 },
  4: { xs: 24, sm: 12, md: 6 }
}

export default {
  name: 'DetailList',
  Item: Item,
  props: {
    gutter: {
      type: Array,
      required: false,
      default: () => [16, 6]
    },
    title: {
      type: String,
      default: '',
      required: false
    },
    col: {
      type: Number,
      required: false,
      default: 3
    },
    span: {
      type: Object,
      required: false,
      default: () => { return { label: 5, content: 15 } }
    },
    size: {
      type: String,
      required: false,
      default: 'large'
    },
    layout: {
      type: String,
      required: false,
      default: 'horizontal'
    }
  },
  provide () {
    return {
      col: this.col > 4 ? 4 : this.col,
      span: this.span
    }
  }
}
</script>

<style lang="less" scoped>
.ant-row{
  margin: 0 !important;
}
.detail-list {
  .title {
    color: rgba(0,0,0,.85);
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  /deep/ .term {
    color: rgba(0,0,0,.85);
    text-align: right;
    line-height: 20px;
    margin-right: 8px;
    padding-top: 4px;
    padding-bottom: 16px;
    white-space: nowrap;
    &.text-left{
      text-align: left;
    }
    &:not(:empty):after {
      content: ":";
      margin: 0 8px 0 2px;
      position: relative;
      top: -.5px;
    }
  }

  /deep/ .content {
    padding-top: 4px;
    padding-left: 6px;
    color: rgba(0,0,0,.65);
    min-height: 22px;
    line-height: 22px;
    // padding-bottom: 16px;
    width: 100%;
    // &:empty {
    //   content: ' ';
    //   height: 22px;
    //   padding-bottom: 16px;
    // }
  }

  &.small {

    .title {
      font-size: 14px;
      color: rgba(0, 0, 0, .65);
      font-weight: normal;
      margin-bottom: 12px;
    }
    /deep/ .term, .content {
      padding-bottom: 8px;
    }
  }

  &.large {
    /deep/ .term, .content {
      padding-bottom: 16px;
    }

    .title {
      font-size: 16px;
    }
  }

  &.vertical {
    .term {
      padding-bottom: 8px;
    }
    /deep/ .term, .content {
      display: block;
    }
  }
}
</style>
