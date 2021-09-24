<template>
  <div class="content-box">
    <div class="bread-crumbs" ref="breadCrumbs">
      <div class="bread-crumbs-box">
        <span v-for="(item, index) in list" :key="index">
          <SvgIcon href="youjiantou" class="icon" v-if="index !== 0 && index === list.length-1"/>
          <SvgIcon href="shangjiantou" class="icon icon-up" v-else-if="index !== 0"/>
          <span @click="departmentInfo(index, item)">{{item.name}}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    list: {
      get () {
        let arr = this.$store.state.handle.breadcrumbs
        this.scrollLeftFn()
        return arr
      },
      set (val) {
        return val
      }
    }
  },
  created () {
    this.scrollLeftFn()
  },
  methods: {
    departmentInfo (index, item) {
      if (index === this.$store.state.handle.breadcrumbs.length - 1) {
        return
      }
      let arr = this.$store.state.handle.breadcrumbs
      arr.splice(index)
      this.$store.dispatch('setBreadcrumbs', arr)
      this.$emit('dataId', item)
    },
    scrollLeftFn () {
      this.$nextTick(() => {
        this.$refs.breadCrumbs.scrollBy(this.$refs.breadCrumbs.scrollWidth, 0)
      })
    }
  }
}
</script>

<style scoped lang="less">
*{
  box-sizing: border-box;
}
.content-box{
  padding-right: 16px;
}
.bread-crumbs{
  width: 100%;
  overflow-x: auto;
  &::-webkit-scrollbar{
    display: none;
  }
}
.bread-crumbs-box{
  padding: 19px 0;
  height: 60px;
  font-size:17px;
  color:#1E89FF;
  background-color: #fff;
  white-space: nowrap;
  // 在flex 布局中超出去不能垂直居中
  // display: flex;
  // align-items: center;
  // overflow-x: auto;
  .icon{
    margin: 0 4px;
    padding-top: 3px;
    width: 10px;
    height: 16px;
    // flex-shrink: 0;
  }
  .icon-up{
    transform: rotate(90deg)
  }
  & > span{
    display: inline-block;
    height: 22px;
    // align-items: center;
    // flex-shrink: 0;
    &:last-child{
      color: #7B8283;
    }
  }
}
</style>
