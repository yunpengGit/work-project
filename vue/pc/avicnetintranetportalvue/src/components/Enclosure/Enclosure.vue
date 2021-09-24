<template>
  <div class="upload-files">
    <div class="upload-header">
      <el-upload
        class=""
        :action="action"
        :show-file-list="false"
        :file-list="fileListData"
        :data="uploadParams"
        :before-upload="beforeUpload"
        :on-success="uploadSuccess"
        :headers="uploadHeader"
      >
        <el-button type="primary">+ 添加附件</el-button>
      </el-upload>
      <el-button class="delete-btn" :disabled="!fileListData.length || !($refs['file-table'].selection&&$refs['file-table'].selection.length)" @click="removeMulti">批量删除</el-button>
    </div>
    <el-table ref="file-table" :data="fileListData" empty-text="暂无附件">
      <el-table-column type="selection" align="center" />
      <el-table-column label="附件名称" min-width="330px">
        <template #default="{ row }">
          <div class="file-info">
            <div class="file-name">
              <icon-svg :name="fileType(row.name)" class="file-icon" />
              <a @click="downLoad(row)">{{ row.name }}</a>
              <icon-svg name="shangchuanchenggong" class="file-icon shangchuanchenggong" />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="MJ" width="140">
        <template #default="{ row }">
          <el-select v-model="row.secretLevel" class="file-mj" placeholder="请选择mj" @change="changeMJ(row)">
            <el-option v-for="item in secretLevel" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="大小" width="100">
        <template #default="{ row: { size } }">
          {{ `${Math.round(size / 1024)}kb` }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ $index, row }">
          <el-button type="text" @click="removeOne(row, $index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { fileType } from '@/utils/common'
import formatDate from '@/utils/format-date'
import { saveAs } from 'file-saver'
// import { download } from '@/utils/download'
import iconSvg from '@/components/icon-svg'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import store from '@/store'

export default {
  components: {
    iconSvg
  },
  props: {
    mj: {
      type: Number,
      default: -1
    },
    businessType: {
      type: String,
      default: 'notice'
    },
    action: {
      type: String,
      default: '/api/file/info'
    },
    fileList: {
      type: Array,
      // default: function () { return [] }
      default: () => []
    }
  },
  data () {
    return {
      // isUploadVisible: false, // 上传文件弹框开关
      // secretLevel,
      fileListData: [],
      uploadParams: {
        name: '', // 文件名称
        secretLevel: this.mj !== -1 ? this.mj : '', // 密级等级
        businessType: this.businessType, // 业务类型
        storageType: 'oss' // 存储类型
      },
      uploadHeader: {
        'Authorization': `Bearer ${getToken()}`
      }
    }
  },
  computed: {
    ...mapGetters([
      'secret'
    ]),
    secretLevel () {
      return this.secret
    }
  },
  watch: {
    mj (n, o) {
      this.uploadParams.secretLevel = this.mj !== -1 ? n : ''
      this.fileListData = this.fileListData.map(e => {
        e.mj = this.mj
        e.secretLevel = this.mj
        return e
      })
    }
  },
  mounted () {
    setTimeout(() => {
      this.fileListData = [...this.fileList].map(v => {
        return {
          time: v.createTime,
          id: v.id,
          mj: v.mj !== -1 ? v.mj : '',
          name: v.name,
          secretLevel: v.secretLevel !== -1 ? v.secretLevel : '',
          size: v.size,
          status: v.status,
          suffix: v.suffix,
          uid: v.uid
        }
      })
    }, 300)
  },
  created () {
    store.dispatch('getSecretLevelFn')
  },
  methods: {
    fileType, // 格式化文件类型
    formatDate, // 格式化日期
    changeMJ (row) {
      // console.log(row)
      // m j校验
      this.$emit('changeFileMj', row)
    },
    beforeUpload ({ name }) {
      this.uploadParams.name = name
    },
    // 上传成功
    uploadSuccess (res) {
      const { data } = res
      if (!data) return this.$message.error(`${res.msg}`)
      const params = {
        name: data.name,
        time: data.createTime,
        size: data.size,
        mj: this.mj ? (this.mj !== -1 ? this.mj : '') : data.secretLevel,
        secretLevel: this.mj ? (this.mj !== -1 ? this.mj : '') : data.secretLevel,
        id: data.id
      }
      // console.log(params, 222)
      this.fileListData.push(params)
      this.$emit('upload', params)
      // this.isUploadVisible = false
    },
    // 单个删除
    removeOne (row, index) {
      return this.$confirm(`确定删除附件 ${row.name} ？`).then(() => {
        // this.fileListData.splice(index, 1)
        return this.$api('notice.deleteFile', { ids: row.id }).then(() => {
          const _index =
            index || this.fileListData.findIndex((item) => item.id === row.id)
          _index > -1 && this.fileListData.splice(_index, 1)
        })
      }).catch(() => {

      })
    },

    // 批量删除
    removeMulti () {
      this.$confirm('确定删除？')
        .then(() => {
          const selected = this.$refs['file-table'].selection // 表格所有的选中项
          return this.$api('notice.deleteFile', { ids: selected.map((d) => d.id).join() }).then(() => {
            selected.forEach((select) => {
              const index = this.fileListData.findIndex(
                (file) => file.id === select.id
              )
              index > -1 && this.fileListData.splice(index, 1)
            })
          })
        })
        .catch(() => { })
    },
    downLoad (row) {
      this.$api('notice.downFile', { ids: row.id }).then(res => {
        const blob = new Blob([res.data])
        // const patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
        // const contentDisposition = decodeURI(res.headers['content-disposition'])
        // const result = patt.exec(contentDisposition)
        // const fileName = result[1]
        saveAs(blob, row.name)
        // download.singleFile(res, row.name)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-files {
  .el-table {
    border-radius: 4px;
    border: 1px solid rgba(25, 31, 36, 0.16);
    ::v-deep tr {
      &:last-child{
        td{
          border-bottom: none;
        }
      }
      td {
        padding: 11px 0;
        input::-webkit-input-placeholder{
          color:#191f24;
        }
        input::-moz-placeholder{   /* Mozilla Firefox 19+ */
          color:#191f24;
        }
        input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
          color:#191f24;
        }
        input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
          color:#191f24;
        }
      }
    }
  }

  .upload-header {
    display: flex;
    margin-bottom: 12px;

    .add-btn {
      position: relative;
    }

    .delete-btn {
      margin-left: 12px;
    }
  }

  .file-info {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .file-name {
      .file-icon {
        width: 18px;
        height: 24px;
        margin: 0 8px;
        &:first-child{
          margin-left: 0;
        }
      }
      .shangchuanchenggong{
        color: #67C33A;
      }
      a{
        display: inline-block;
        max-width: 210px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex-shrink: 0;
        vertical-align: middle;
      }
    }
  }
  .file-mj {
    width: 120px;
    margin-right: 20px;
    .el-input {
      width: 100%;
    }
  }
}
</style>
