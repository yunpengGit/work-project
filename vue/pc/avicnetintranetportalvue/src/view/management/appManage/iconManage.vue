<template>
  <div class="icon-manage">
    <div v-for="item in appAll" :key="item.appId" class="group" :class="{'batch': item.batch}">
      <div class="title">
        <span class="text">{{ item.appName }}</span>
        <div class="btn-box">
          <div v-if="item.appIcons&&item.appIcons.length>0">
            <el-button v-if="!item.batch" @click="() => item.batch = !item.batch">批量操作</el-button>
            <el-button v-if="item.batch" @click="cancelBatchFn(item)">取消批量选择</el-button>
            <el-button v-if="item.batch" @click="batchDeleteIconFn(item.appIcons)">批量删除</el-button>
            <el-checkbox v-if="item.batch" v-model="item.checkAll" @change="checkAllFn(item)">
              全选
            </el-checkbox>
          </div>
          <el-tooltip class="item" effect="dark" :content="`图标上传，支持：${fileOptions.type}类型文件，${fileOptions.size/1024}KB以下`" placement="top-start">
            <el-upload
              v-if="!item.batch"
              class="upload-demo"
              :action="action"
              :headers="headers"
              :on-change="uploadChange"
              :before-upload="beforeUpload"
              :show-file-list="false"
              :data="uploadData"
              :on-success="uploadSuccessFn"
              multiple
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <el-button type="primary" @click="uploadClick(item.appId)">点击上传</el-button>
            </el-upload>
          </el-tooltip>
        </div>
      </div>
      <div class="list">
        <div v-for="ele in item.appIcons" :key="ele.icon" class="item" :class="{'checked': ele.checked}" @click="checkedFn(item, ele)">
          <div class="checked-box">
            <span class="icon-box">
              <icon-svg v-if="ele.isUsed === 1" name="yiyong" class="status" />
              <img :src="ele.icon" alt="" class="icon-img">
            </span>
            <span class="delete" @click.stop="deleteIconFn(item.appIcons, ele.id)">
              <icon-svg name="del" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import iconSvg from '@/components/icon-svg'
export default {
  name: 'IconManage',
  components: {
    iconSvg
  },
  data () {
    return {
      fileOptions: {
        type: '.jpg,.jpeg,.bmp,.gif,.png',
        size: 20 * 1024
      },
      appId: '',
      uploadData: {
        businessType: 'icon',
        name: ''
      },
      fileList: [],
      // action: `${window.location.origin}/portal/appIcon/addIcon?appId=48533534796222464`,
      action: `/api/file/publicPic/upload`,
      headers: {
        Authorization: `Bearer ${getToken()}`
        // Authorization: `Bearer 02f94f4b-9c34-44a4-83b0-c5d8516f833c`
      },
      appAll: []
    }
  },
  created () {
    this.getAppIconList()
  },
  methods: {
    uploadClick (id) {
      this.appId = id
    },
    getAppIconList () {
      this.$api('appManage.appIconList').then(res => {
        this.appAll = res.data.map(ele => {
          ele.checkedAll = false
          ele.batch = false
          ele.appIcons = ele.appIcons && ele.appIcons.map(item => {
            item.checked = false
            return item
          })
          return ele
        })
      })
    },
    uploadChange (id) {
    },
    beforeUpload (file) {
      const arr = file.name.split('.')
      const type = arr[arr.length - 1]
      // console.log(type)
      const isJPG = this.fileOptions.type.indexOf(type) === -1
      const isLt = (file.size / this.fileOptions.size) > 1

      if (isJPG) {
        this.$message.error(`上传图标格式支持：${this.fileOptions.type}!`)
        return false
      }
      if (isLt) {
        this.$message.error(`上传图标大小不能超过 ${this.fileOptions.size / 1024}kb!`)
        return false
      }
      return !isJPG && !isLt
    },
    uploadSuccessFn (response, file, fileList) {
      // console.log(response, file, fileList)
      if (response.code === 200) {
        const data = {
          appId: this.appId,
          appIcons: [response.data]
        }
        // console.log(this.appId)
        this.$api('appManage.appIconSaveIcon', data).then(res => {
          const group = this.appAll.find(ele => {
            return ele.appId === this.appId
          })
          if (!Array.isArray(group.appIcons)) {
            group.appIcons = []
          }
          const iconData = {
            checked: false,
            icon: response.data,
            id: res.data,
            isUsed: 0
          }
          // console.log(iconData)
          // console.log(group.appIcons)
          this.$set(group.appIcons, group.appIcons.length, iconData)
          // group.appIcons.push(response.data.path)
        })
      }
    },
    handleExceed (files, fileList) {
      // this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    checkedFn (group, item) {
      if (!group.batch) {
        return false
      }
      item.checked = !item.checked
      const isCheckall = group.appIcons && group.appIcons.some(ele => {
        return ele.checked === false
      })
      group.checkAll = !isCheckall
    },
    checkAllFn (item) {
      this.$nextTick(() => {
        item.appIcons = item.appIcons && item.appIcons.map(ele => {
          if (item.checkAll) {
            ele.checked = true
          } else {
            ele.checked = false
          }
          return ele
        })
      })
    },
    cancelBatchFn (item) {
      item.batch = !item.batch
      item.appIcons = item.appIcons.map(ele => {
        ele.checked = false
        return ele
      })
    },
    batchDeleteIconFn (item) {
      let ids = []
      item.forEach(ele => {
        if (ele.checked) {
          ids.push(ele.id)
        }
      })
      ids = ids.join(',')
      // console.log(ids)
      this.deleteFn(ids)
    },
    deleteIconFn (item, ids) {
      this.deleteFn(ids)
    },
    deleteFn (ids) {
      this.$api('appManage.appIconDelete', { ids }).then(res => {
        // item = item.filter(ele => {
        //   return ids !== ele.id
        // })
        this.getAppIconList()
        this.$message.success('删除成功')
      })
    }
  }
}
</script>

<style scoped lang="scss">
.icon-manage{
  padding: 25px;
  background-color: #fff;
  .group{
    margin-top: 16px;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 4px;
    border: 1px solid #EBEBEB;
    &:first-child{
      margin-top: 0;
    }
    .title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      padding: 0 16px;
      height: 54px;
      background: rgba(140, 138, 137, 0.09);
      border-radius: 0px 4px 0px 0px;
      .btn-box{
        display: flex;
        .el-button + .el-button{
          margin-left: 16px;
        }
        .el-checkbox{
          margin-left: 16px;
        }
        .upload-demo{
          margin-left: 16px;
        }
      }
    }
    .list{
      display: flex;
      flex-wrap: wrap;
      .item{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 126px;
        height: 104px;
        border-radius: 2px;
        &.checked{
          .checked-box{
            border-color: #4285F4;
          }
        }
        &:hover{
          cursor: pointer;
          background-color: rgba(25, 31, 36, 0.04);
          .checked-box{
            .delete{
              display: flex;
            }
          }
        }
        .checked-box{
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 106px;
          height: 86px;
          border-radius: 2px;
          border: 1px solid transparent;
          .icon-box{
            position: relative;
            .status{
              position: absolute;
              top: 0;
              left: 0;
              width: 28px;
              height: 28px;
            }
            .icon-img{
              height: 40px;
              width: 40px;
            }
          }
          .delete{
            position: absolute;
            display: none;
            bottom: 6px;
            width: 14px;
            height: 14px;
            color: rgba($color: #191F24, $alpha: 0.64);
          }
        }
      }
    }
  }
  .batch{
    .list{
      .item{
        &:hover{
          .checked-box{
            border-color: #4285F4;
          }
          background-color: transparent;
          .checked-box{
            .delete{
              display: none;
            }
          }
        }
      }
    }
  }
}
</style>
