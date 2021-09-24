<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-04-02 10:46:23
 * @LastEditors: zongmz
 * @LastEditTime: 2021-05-11 19:13:08
-->
<template>
  <div class="attachment-download">
    <div class="header">
      <span class="">附件文档{{ attachments.length }}</span>
      <el-button @click="downloadAllFn">下载全部</el-button>
    </div>
    <div class="th">
      <span>附件名称</span>
      <span><span class="size">大小</span><span>操作</span></span>
    </div>
    <ul class="list">
      <li v-for="f in attachments" :key="f.id" class="file">
        <span><icon-svg :name="fileType(f.name)" /><span>{{ f.name }}</span></span>
        <span><span class="size">{{ `${Math.round(f.size / 1024)}KB` }}</span><a :href="f.url">下载</a></span>
      </li>
    </ul>
  </div>
</template>

<script>
import iconSvg from '@/components/icon-svg'
import { fileType } from '@/utils/common'
export default {
  name: 'AttachmentDownload',
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
    downloadAllFn () {
      const busId = this.attachments.map(ele => {
        return ele.id
      })
      this.$api('home.downloadByBusId', { busId })
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
.attachment-download{
  padding-bottom: 16px;
  border-radius: 4px;
  border: 1px solid rgba(25, 31, 36, 0.16);
  .header{
    padding:  0 16px;
    height: 56px;
    background: #FFFFFF;
    box-shadow: 0px -1px 0px 0px rgba(25, 31, 36, 0.12);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .label{
      font-size: 16px;
      font-weight: bold;
      color: #191F24;
    }
  }
  .size{
    text-align: right;
    width: 100px;
    margin-right: 40px;
  }
  .th{
      padding:  0 16px;
      @include fbc;
      height: 38px;
      border: 1px solid rgba(25, 31, 36, 0.16);
      border-left: 0;
      border-right: 0;
    }
  .list{
    .file{
      padding:  0 16px;
      height: 44px;
      @include fbc;
      &:nth-child(2n){
        background: rgba(25, 31, 36, 0.04);
      }
      a{
        color: #1e89ff;
      }
    }
  }
}

</style>
