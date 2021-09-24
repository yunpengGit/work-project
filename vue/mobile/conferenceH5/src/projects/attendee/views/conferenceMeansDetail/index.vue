<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-01 13:28:28
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-07-08 11:33:30
-->
<template>
  <div class="material-container">
    <list
      :params="params"
      @onRefresh="onRefresh"
      @onLoad="onLoad"
    >
      <template v-slot:item="data">
        <div
          v-for="ele in data.data[routeParams.type].conferenceMaterialsList"
          :key="ele.id"
          class="material-list"
        >
          <a :href="ele.materialUrl">
            <div
              class="material-item"
            >
              <img :src="srcParse(ele)" alt="" class="material-pic">
              <van-cell-group>
                <van-cell :title="ele.materialName ? ele.materialName : '-'" is-link />
              </van-cell-group>
            </div>
          </a>
        </div>
      </template>
    </list>
  </div>
</template>

<script>
import list from '@/components/list'
import web from '@/assets/images/Web.svg'
import video from '@/assets/images/video.svg'
import voice from '@/assets/images/voice.svg'
import ppt from '@/assets/images/ppt.svg'
import txt from '@/assets/images/txt.svg'
import folder from '@/assets/images/folder.svg'
import picture from '@/assets/images/picture.svg'
import excel from '@/assets/images/excel.svg'
import word from '@/assets/images/Word.svg'
import zip from '@/assets/images/Zip.svg'
import unknow from '@/assets/images/Unknow.svg'
import pdf from '@/assets/images/PDF.svg'

export default {
  components: { list },
  props: {
    routeParams: {
      type: Object
    }
  },
  data() {
    return {
      web, video, voice, ppt, txt, folder, picture, excel, word, zip, unknow, pdf,
      params: {
        httpUrl: 'attendeeApi.getMaterial',
        type: 'up',
        httpParams: {
          conferenceId: '',
          pageNum: 1,
          pageSize: 1000
        }
      }
    }
  },
  computed: {
    srcParse() {
      return function(ele) {
        if (ele.materialType === 2) {
          return web
        } else if (ele.materialType === 1) {
          const name = ele.materialName
          let type = ''
          if (!name.length) {
            return unknow
          }
          type = name.slice(name.lastIndexOf('.') + 1, name.length).toLowerCase()
          if (type === 'com') {
            return web
          } else if (type === 'txt') {
            return txt
          } else if (type === 'xlsx' || type === 'xls') {
            return excel
          } else if (type === 'pdf') {
            return pdf
          } else if (type === 'jpg' || type === 'png') {
            return picture
          } else if (type === 'doc' || type === 'docx') {
            return word
          } else if (type === 'ppt') {
            return ppt
          } else {
            return unknow
          }
        }
      }
    }
  },
  created() {
    this.$nextTick(() => {
      const conferenceId = this.routeParams.conferenceId
      const pageNum = this.routeParams.pageNum
      this.params.httpParams.conferenceId = conferenceId
      this.params.httpParams.pageNum = pageNum
    })
  },
  methods: {
    onRefresh() {
      this.params.httpParams.pageNum++
      this.params.type = 'down'
    },
    onLoad() {
      this.params.httpParams.pageNum++
      this.params.type = 'up'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.material-container {
  .list-container {
    height: calc(100% - 10px);
    top: 10px;
    background-color: #f6f6f6;
    padding: 0;
  }
  .material-item {
    width: 100%;
    height: 56px;
    padding: 0 16px;
    background-color: #fff;
    @include list(row,flex-start,center);
    .material-pic {
      width: 24px;
      height: 24px;
      margin-right: 16px;
    }
    .van-cell-group {
      flex: 1;
    }
    .van-cell {
      height: 56px;
      line-height: 56px;
      padding: 0;
      .van-cell__left-icon, .van-cell__right-icon {
        line-height: 56px;
      }
    }
  }
}
</style>
