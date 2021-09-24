<template>
  <div class="left-list-box">
    <div class="el-menu-box">
      <div class="menu-item">
        <i class="el-icon-coin" />
        <span>所有日程</span>
      </div>
      <div class="menu-item">
        <i class="el-icon-user" />
        <span>我的日程</span>
      </div>
      <div class="menu-item">
        <i class="el-icon-share" />
        <span>全部分享</span>
      </div>
    </div>
    <div class="user-list-box">
      <div class="user-list-group">
        <div class="group-title">
          <span>编辑权限</span><i class="el-icon-caret-bottom" />
        </div>
        <div class="group-content">
          <div class="user-box active">
            <el-avatar> user </el-avatar>
            <div>
              <h6>姓名1</h6>
              <p>综合管理部</p>
            </div>
          </div>
          <div class="user-box">
            <el-avatar> user </el-avatar>
            <div>
              <h6>姓名2</h6>
              <p>综合管理部</p>
            </div>
          </div>
        </div>
      </div>
      <div class="user-list-group">
        <div class="group-title">
          <span>查阅权限</span><i class="el-icon-caret-bottom" />
        </div>
        <div class="group-content">
          <div class="user-box active">
            <el-avatar> user </el-avatar>
            <div>
              <h6>姓名1</h6>
              <p>综合管理部</p>
            </div>
          </div>
          <div class="user-box">
            <el-avatar> user </el-avatar>
            <div>
              <h6>姓名2</h6>
              <p>综合管理部</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {},
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.left-list-box {
  flex-shrink: 0;
  // border-right: 1px solid #eef0f4;
  height: 100%;
  overflow: hidden;
  .el-menu-box {
    padding: 0 8px;
    border-bottom: 1px solid #eef0f4;
    .menu-item {
      cursor: pointer;
      width: 254px;
      height: 40px;
      line-height: 40px;
      padding: 0 18px;
      box-sizing: border-box;
      border-radius: 2px;
      &:hover,
      &.active {
        background: rgba(25, 31, 36, 0.04);
      }
      i {
        font-size: 18px;
        font-weight: 500;
        color: #191f24;
        margin-right: 18px;
      }
      span {
        font-size: 15px;
        color: #191f24;
        font-weight: 500;
      }
    }
  }

  .user-list-box {
    padding: 16px 8px;
    height: calc(100% - 170px);
    overflow-y: auto;
    .user-list-group {
      margin-bottom: 20px;
      .group-title {
        margin-bottom: 8px;
        span {
          height: 18px;
          font-size: 13px;
          color: rgba(25, 31, 36, 0.64);
          line-height: 18px;
        }
        i {
          font-size: 16px;
          color: rgba(25, 31, 36, 0.64);
          cursor: pointer;
        }
      }
      .group-content {
        .user-box {
          display: flex;
          height: 64px;
          border-radius: 4px;
          align-items: center;
          padding: 0 16px;
          &:hover,
          &.active {
            background: rgba(25, 31, 36, 0.04);
          }
          div {
            margin-left: 12px;
            h6 {
              margin: 0;
              font-size: 15px;
              color: #191f24;
            }
            p {
              margin: 0;
              font-size: 13px;
              color: rgba(25, 31, 36, 0.64);
            }
          }
        }
      }
    }
  }
}
</style>
