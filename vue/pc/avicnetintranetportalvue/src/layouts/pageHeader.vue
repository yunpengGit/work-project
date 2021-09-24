<!--
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-04-25 09:20:26
 * @LastEditors: zongmz
 * @LastEditTime: 2021-06-09 19:01:14
-->
<template>
  <div class="page-head-box">
    <span class="title">{{ $route.query.title ? $route.query.title : routeMeta.title }}</span>
    <span class="mj">
      当前页面MJ：
      <el-select v-model="value" clearable placeholder="请选择">
        <el-option v-for="item in options" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
      </el-select>
    </span>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      value: ''
    }
  },
  computed: {
    ...mapGetters([
      'secret'
    ]),
    routeMeta () {
      return this.$route.meta
    },
    options () {
      return this.secret
    }
  }
}
</script>
<style lang="scss">
  .data-theme--mini{
    .mj{
      .el-select{
        .el-input{
          .el-input__inner {
            height: 32.6666666667px;
            line-height: 32.6666666667px;
          }
        }
      }
    }
  }
  .data-theme--small{
    .mj{
      .el-select{
        .el-input{
          .el-input__inner {
            height: 37.3333333333px;
            line-height: 37.3333333333px;
          }
        }
      }
    }
  }
  .data-theme--medium{
    .mj{
      .el-select{
        .el-input{
          .el-input__inner {
            height: 42px;
            line-height: 42px;
          }
        }
      }
    }
  }
</style>
