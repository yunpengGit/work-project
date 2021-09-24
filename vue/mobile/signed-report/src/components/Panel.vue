<template>
  <div class="panel">
    <slot></slot>
  </div>
</template>
<style scoped lang="less">
.panel{
  margin-top: 8px;
  padding-left: 12px;
  background-color: #fff;
  &:first-child{
    margin-top: 0;
  }
}
</style>
