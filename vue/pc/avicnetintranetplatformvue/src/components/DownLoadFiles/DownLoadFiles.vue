<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-04-02 10:46:23
 * @LastEditors: zongmz
 * @LastEditTime: 2021-05-21 17:38:08
-->
<template>
  <div class="components-attachment-download">
    <div class="header">
      <span class="label">附件文档</span>
      <el-button @click="download">下载全部</el-button>
    </div>
    <div class="th">
      <span>附件名称</span>
      <span><span class="size">大小</span><span>操作</span></span>
    </div>
    <ul class="list">
      <li v-for="f in attachments" :key="f.id" class="file">
        <span><icon-svg :name="fileType(f.name)" /><span>{{ f.name }}</span></span>
        <span><span class="size">{{ `${Math.round(f.size / 1024)}KB` }}</span><a href="#" @click="download(f)">下载</a></span>
      </li>
    </ul>
  </div>
</template>

<script>
import iconSvg from '@/components/icon-svg'
import { fileType } from '@/utils/common'
import { saveAs } from 'file-saver'

export default {
  name: 'DownLoadFiles',
  components: {
    iconSvg
  },
  props: {
    attachments: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {

    }
  },
  methods: {
    fileType,
    download (row) {
      let params = {}
      if (row.id) {
        params = { ids: row.id }
      } else {
        params = this.attachments.map(ele => {
          return ele.id
        })
        params = { ids: params.join(',') }
      }
      this.$api('notice.downFile', params).then(res => {
        let blob
        if (row.id || this.attachments.length === 1) {
          blob = new Blob([res.data])
          saveAs(blob, row.name)
          return
        }
        blob = new Blob([res.data], { type: 'application/zip' })
        const patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
        // console.log(res, blob, 22)
        const contentDisposition = decodeURI(res.headers['content-disposition'])
        const result = patt.exec(contentDisposition)
        const fileName = result[1]
        saveAs(blob, fileName)
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/ui/size/mixin.scss';
@mixin fbc{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
@mixin del($sc: 1, $fs: 14px){
  .components-attachment-download{
    .header{
      margin-bottom: 14px;
      background: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .label{
        font-size: $fs;
        line-height: 18px * $sc;
        color: rgba(25, 31, 36, 0.64);
      }
    }
    .size{
      text-align: left;
      width: 150px * $sc;
      margin-right: 40px;
    }
    .th{
      padding: 0 46px * $sc 0 16px * $sc;
      @include fbc;
      height: 43px * $sc;
      font-size: $fs;
      line-height: 18px * $sc;
      font-weight: 500;
      color: #191F24;
      background-color: #F0F7FF;
      border: 1px solid rgba(25, 31, 36, 0.16);
      border-bottom: 0;
      border-radius: 4px 4px 0 0;
    }
    .list{
      border: 1px solid rgba(25, 31, 36, 0.16);
      border-top: 0;
      border-radius: 0 0 4px 4px;
      .file{
        padding: 0 46px * $sc 0 16px * $sc;
        height: 54px * $sc;
        @include fbc;
        border-bottom: 1px solid rgba(25, 31, 36, 0.16);
        font-size: $fs;
        line-height: 18px * $sc;
        color: rgba(25, 31, 36, 0.88);
        &:last-child {
          border-bottom: 0;
        }
        span .icon {
          margin-right: 15px;
        }
        a{
          color: #1e89ff;
        }
      }
    }
  }
}
@import '@/ui/size/scale.scss';
</style>
