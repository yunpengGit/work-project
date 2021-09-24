<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-30 21:31:48
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-11 22:50:09
-->
<template>
  <div class="detail-container" v-if="conferenceData">
    <div class="pic">
      <img :src="conferenceData.coverVOs[0].downloadUrl" alt="">
    </div>
    <dl class="synopsis">
      <dt>{{ conferenceData.name }}</dt>
      <dd v-if="conferenceData.setSignConfigFlag === 1">
        <span>报名时间：</span>
        {{ signUpTime }}
      </dd>
      <dd><span>会议时间：</span>{{ conferenceData.startTime.slice(0, conferenceData.startTime.length - 3) }} ~ {{ conferenceData.endTime.slice(0, conferenceData.endTime.length - 3) }}</dd>
      <dd><span>会议地点：</span>{{ conferenceData.station }}</dd>
    </dl>
    <div ref="floor1" class="recom detail-item" v-if="conferenceData.introduction">
      <h3 class="detail-title-pic">
        <img src="@/assets/images/recom.png" alt="">
        会议介绍
      </h3>
      <p>{{ conferenceData.introduction }}</p>
    </div>
    <div ref="floor2" class="guest detail-item" v-if="guestData.length">
      <h3 class="detail-title-pic">
        <img src="@/assets/images/guest.png" alt="">
        会议嘉宾
      </h3>
      <div v-for="(ele, index) in guestData" :key="index" class="guest-item">
        <div class="pic-text">
          <div class="pic"><img :src="ele.billUrl" alt=""></div>
          <div class="text">
            <h3 class="title">{{ ele.name }}</h3>
            <h4 class="company">{{ ele.organizationName }}</h4>
            <ul class="duties">
              <li v-for="(eleChild, indexChild) in duties(index)" :key="indexChild">{{ eleChild }}</li>
            </ul>
          </div>
        </div>
        <dl class="theme">
          <dt><i></i>演讲主题</dt>
          <dd>{{ ele.theme }}</dd>
        </dl>
      </div>
    </div>
    <div ref="floor3" class="agenda detail-item" v-if="agendaData.length">
      <h3 class="detail-title-pic">
        <img src="@/assets/images/agenda.png" alt="">
        会议议程
      </h3>
      <div v-for="(ele, index) in agendaData" :key="index" class="agenda-list">
        <div v-for="(eleChild, indexChild) in ele.children" :key="indexChild" class="agenda-item">
          <div class="time">{{ eleChild.conductDate }} {{ eleChild.startTime }}-{{ eleChild.endTime }}</div>
          <div class="name">{{ eleChild.name }}</div>
        </div>
      </div>
    </div>
    <div ref="floor4" class="org detail-item" v-if="conferenceData.organizationVOs.length">
      <h3 class="detail-title-pic">
        <img src="@/assets/images/org.png" alt="">
        会议组织
      </h3>
      <dl v-for="(ele, index) in conferenceData.organizationVOs" :key="index">
        <dt>{{ ele.organizationTypeStr }}</dt>
        <dd>{{ ele.organizationName }}</dd>
      </dl>
    </div>
    <div ref="floor5" class="note detail-item" v-if="conferenceData.notice">
      <h3 class="detail-title-pic">
        <img src="@/assets/images/note.png" alt="">
        会议须知
      </h3>
      <p v-html="notice" />
    </div>
    <div ref="floor6" class="contacts detail-item" v-if="conferenceData.contactsVOMS.length">
      <h3 class="detail-title-pic">
        <img src="@/assets/images/contacts.png" alt="">
        联系我们
      </h3>
      <div
        class="contacts-item"
        :style="{
          border: index === conferenceData.contactsVOMS.length - 1 ? 'none' : '',
          'padding-top': index === 0 ? '0' : ''
        }"
        v-for="(item, index) in conferenceData.contactsVOMS"
        :key="index"
      >
        <div class="group-name">{{ item.unitOrDuty }}</div>
        <div class="group-item" v-for="(childItem, childIndex) in item.contactsVOS" :key="childIndex">
          <div class="contact-name">姓名：{{ childItem.contactsName }}</div>
          <div class="contact-phone">
            <span>电话：{{ childItem.contactsPhone }}</span>
            <a class="text" :href="`tel:${childItem.contactsPhone}`">
              <img src="@/assets/images/phone.svg" class="icon" />
            </a>
          </div>
        </div>
      </div>
      <!-- <p v-html="contacts" /> -->
    </div>
    <!-- <div class="single-btn-bottom single-btn-bottom-allow">
      <van-button
        @click="$router.go(-1)"
      >返回</van-button>
    </div> -->
    <div class="jump-floor-container">
      <swiper ref="btn" :options="swiperOptions" v-if="isLoading">
        <swiper-slide v-for="(ele, index) in typesData" :key="index">
          <div
            class="types-item"
            :class="typesData[index].checked ? 'types-item-checked' : ''"
            @click="typesChoice(index)"
          >
            {{ ele.name }}
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  components: { swiper, swiperSlide },
  props: {
    routeParams: {
      type: Object
    }
  },
  data() {
    return {
      isLoading: false,
      // 会议详情
      conferenceData: null,
      // 议程数据
      agendaData: [],
      // 嘉宾数据
      guestData: [],
      swiperOptions: {
        slidesPerView: 'auto',
        spaceBetween: 12,
        slidesOffsetBefore: 6,
        freeMode: true
      },
      typesData: [
        { top: '', name: '会议介绍', type: 'floor1', checked: true },
        { top: '', name: '会议嘉宾', type: 'floor2', checked: false },
        { top: '', name: '会议议程', type: 'floor3', checked: false },
        { top: '', name: '会议组织', type: 'floor4', checked: false },
        { top: '', name: '会议须知', type: 'floor5', checked: false },
        { top: '', name: '联系我们', type: 'floor6', checked: false }
      ],
      floorHeight: [],
      timer: null,
      clickFlag: false
    }
  },
  computed: {
    btn() {
      return this.$refs.btn.swiper
    },
    // 报名时间
    signUpTime() {
      if (this.conferenceData.signTimeFlag === 3) {
        return `起始于  ${this.conferenceData.signStartTime.slice(0, -3)}`
      } else if (this.conferenceData.signTimeFlag === 2) {
        return `${this.conferenceData.signStartTime.slice(0, -3)}  ~  ${this.conferenceData.signEndTime.slice(0, -3)}`
      } else if (this.conferenceData.signTimeFlag === 1) {
        return `截止至  ${this.conferenceData.signEndTime.slice(0, -3)}`
      } else {
        return ''
      }
    },
    // 职务处理
    duties() {
      return function(index) {
        const title = this.guestData[index].title
        return title ? title.split(',') : []
      }
    },
    notice() {
      return this.conferenceData.notice.replace(/\n/g, '<br/>')
    },
    contacts() {
      return this.conferenceData.contactInformation.replace(/\n/g, '<br/>')
    }
  },
  created() {
    // this.recomRect=this.$refs['recom'].getBoundingClientRect();
    window.addEventListener('scroll', this.scroll, false)
    const getData = async function() {
      await this.getConferenceDetail()
      await this.getAgenda()
      await this.getGuest()
      this.isLoading = true
      const refs = this.$refs
      Object.keys(refs).forEach(ele => {
        const data = refs[ele]
        if (!this.typesData.find(eleFind => eleFind.type === ele)) {
          const index = this.typesData.findIndex(eleFine => eleFine.type === ele)
          this.typesData.slice(index, 1)
        } else {
          const index = this.typesData.findIndex(eleFine => eleFine.type === ele)
          this.typesData[index].top = data.offsetTop
        }
      })
    }.bind(this)
    getData()
  },
  methods: {
    scroll(e) {
      if (!this.clickFlag) {
        e = e || window.e
        const scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop
        if (!this.timer) {
          this.scrollTop = scrollTop
        }
        let lastIndex = 0
        for (let i = 0; i < this.typesData.length; i++) {
          this.typesData[i].checked = false
          if (scrollTop >= this.typesData[i].top - 150) {
            lastIndex = i
          }
        }
        this.typesData[lastIndex].checked = true
      }
    },
    // 对象排序 根据seq值排序表单
    sortByKey(array, key) {
      return array.sort(function(a, b) {
        console.log(a)
        const x = a[key]
        const y = b[key]
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
      })
    },
    typesChoice(index) {
      // 当前选中的不允许点击
      if (this.typesData[index].checked) {
        return
      }
      this.clickFlag = true
      this.typesData.forEach(ele => {
        ele.checked = false
      })
      this.typesData[index].checked = true
      const scrollTop = this.typesData[index].top
      // const dprNum = document.querySelector('html').getAttribute('data-dpr')
      const screenWidth = document.documentElement.clientWidth
      const targetWidth = this.btn.slides[index].offsetWidth
      console.log(screenWidth, this.btn.slides[index].slideNavWidth, targetWidth)
      // this.btn.setTransition(300)
      // this.btn.setTranslate(-10000)
      scrollTo(0, scrollTop - 150)
      setTimeout(() => {
        this.clickFlag = false
      })
      // let num = 0
      // this.timer = setInterval(() => {
      //   num++
      //   const speed = Math.floor(scrollTop / 28) * num
      //   console.log(speed)
      //   scrollTo(0, speed)
      //   if (speed >= scrollTop) {
      //     clearInterval(this.timer)
      //     this.timer = null
      //   }
      // }, 15)
    },
    getConferenceDetail() {
      return new Promise(resolve => {
        const id = this.routeParams.id
        // 获取会议详情
        this.$api({
          url: 'desk.getDetail',
          data: {
            id
          }
        }).then(res => {
          if (res.code === 2000) {
            this.conferenceData = res.result
            resolve()
          }
        })
      })
    },
    getAgenda() {
      return new Promise(resolve => {
        const id = this.routeParams.id
        // 获取议程详情
        this.$api({
          url: 'desk.getAgenda',
          data: {
            conferenceId: id,
            // 我也不知为啥要传这个参数 接口文档没有注释 只是上一版本里面传了这个
            queryFlag: 2
          }
        }).then(res => {
          if (res.code === 2000) {
            this.agendaData = res.result
            resolve()
          }
        })
      })
    },
    getGuest() {
      return new Promise(resolve => {
        const id = this.routeParams.id
        // 获取嘉宾
        this.$api({
          url: 'desk.getGuest',
          data: {
            conferenceId: id
          }
        }).then(res => {
          if (res.code === 2000) {
            this.guestData = res.result.list
            resolve()
          }
        })
      })
    }
  },
  destroyed() {
    window.removeEventListener('scroll', this.scroll, false)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.detail-container {
  min-height: 100%;
  background-color:rgba(25, 31, 36, 0.04);
  // padding-bottom: 64px;
  .pic {
    width: 100%;
    height: 171px;
    overflow: hidden;
    position: relative;
    z-index: 1;
    img {
      width: 100%;
    }
  }
  .synopsis {
    width: 100%;
    background-color: #fff;
    border-radius: 16px 16px 0px 0px;
    padding: 16px;
    margin: -16px 0 12px;
    overflow: hidden;
    position: relative;
    z-index: 2;
    dt {
      font-size: 20px;
      font-weight: 500;
      line-height: 25px;
      margin-bottom: 10px;
    }
    dd {
      font-size: 14px;
      line-height: 18px;
      color: rgba(25, 31, 36, 1);
      margin-bottom: 6px;
      span {
        color: rgba(25, 31, 36, 0.64);
      }
    }

  }
  .detail-item {
    width: 100%;
    padding: 20px 16px 30px;
    background-color: #fff;
    margin-bottom: 12px;
    overflow: hidden;
  }
  .recom {
    p {
      font-size: 15px;
      color: rgba(25, 31, 36, 0.88);
      line-height: 24px;
    }
  }
  .detail-title-pic {
    font-size: 17px;
    font-weight: 500;
    line-height: 22px;
    padding-bottom: 28px;
    @include list(row,flex-start,center);
    img {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
  }
  .agenda {
    width: 100%;
    padding-bottom: 20px;
    .agenda-list {
      width: 100%;
      // margin-bottom: 16px;
      padding: 0 4px 24px;
      position: relative;
      &::after {
        content: '';
        display: block;
        width: 1px;
        height: 100%;
        border-left: 1px dashed rgba(194, 232, 255, 1);
        @include absolute(3px,'','',8px);

      }
      &:nth-last-of-type(1) {
        &::after {
          display: none;
        }
      }
      .agenda-item {
        padding: 0 0 20px 15px;
        position: relative;
        z-index: 2;
        &::before {
          content: '';
          display: block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1px solid rgba(30, 137, 255, 1);
          @include absolute(2px,'','',0);
          background-color: #fff;
        }
         &::after {
          content: '';
          display: block;
          width: calc(100% + 16px);
          height: 1px;
          background-color:rgba(25, 31, 36, 0.08) ;
          @include absolute('','',7.5px,15px)
        }
        &:nth-last-of-type(1) {
          padding-bottom: 0;
          &::after {
            content: '';
            display: block;
            width: calc(100% + 16px);
            height: 1px;
            background-color:rgba(25, 31, 36, 0.08) ;
            @include absolute('','',-12px,15px)
          }
        }
        .time {
          font-size: 13px;
          color: rgba(25, 31, 36, 0.64);
          line-height: 18px;
          margin-bottom: 3px;
        }
        .name {
          font-size: 14px;
          color: rgba(25, 31, 36, 0.88);
          line-height: 18px;
        }
      }
    }
  }
  .note, .contacts {
    .contacts-item {
      padding: 16px 16px 8px 0;
      font-size: 15px;
      color: rgba(25, 31, 36, 0.88);
      line-height: 28px;
      border-bottom: 1px solid rgba(25, 31, 36, 0.08);
      .group-item {
        padding: 5px 0;
        .contact-phone {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
    p {
      font-size: 15px;
      color: rgba(25, 31, 36, 0.88);
      line-height: 28px;
    }
  }
  .guest {
    .guest-item {
      width: 100%;
      border-bottom: 1px solid rgba(25, 31, 36, 0.08);
      margin-top: 20px;
      padding-bottom: 20px;
      .pic-text {
        width: 100%;
        padding-left: 116px;
        min-height: 140px;
        position: relative;
        .pic {
          width: 100px;
          height: 140px;
          overflow: hidden;
          @include absolute(0,'','',0);
          img {
            width: 100%;
          }
        }
        .title {
          height: 28px;
          background: url('../../../../assets/images/guestName.png') no-repeat left;
          background-size: 74px 28px;
          font-size: 16px;
          line-height: 28px;
          color: #fff;
          font-weight: 500;
          padding-left: 8px;
        }
        .company {
          font-size: 12px;
          color: rgba(3, 76, 179, 1);
          line-height: 16px;
          padding: 6px 8px;
          background-color: rgba(235, 248, 255, 1);
          margin-bottom: 12px;
        }
        .duties {
          li {
            font-size: 14px;
            line-height: 20px;
            padding-left: 6px;
            margin-bottom: 1px;
            position: relative;
            &::before {
              content: '';
              display: block;
              width: 2px;
              height: 2px;
              background-color: #191F24;
              @include absolute(50%,'','',0);
              transform: translateY(-50%);
              border-radius: 50%;
            }
          }
        }
      }
      .theme {
        font-size: 14px;
        dt {
          color: rgba(25, 31, 36, 0.64);
          line-height: 22px;
          @include list(row,flex-start,center);
          margin-bottom: 4px;
          i {
            display: block;
            width: 4px;
            height: 16px;
            background-color: rgba(25, 31, 36, 0.16);
            margin-right: 3px;
          }
        }
        dd {
          line-height: 18px;
          font-weight: 500;
        }
      }
    }
  }
  .org {
    dl {
      border-bottom: 1px solid rgba(25, 31, 36, 0.08);
      padding-bottom: 10px;
      margin-top: 10px;
      dt {
        font-size: 14px;
        line-height: 18px;
        color: rgba(25, 31, 36, 0.64);
        margin-bottom: 4px;
      }
      dd {
        font-size: 16px;
        line-height: 21px;
        color: rgba(25, 31, 36, 0.88);
        padding-left: 12px;
        position: relative;
        &::before {
          content: '';
          display: block;
          width: 4px;
          height: 4px;
          background-color: #191F24;
          @include absolute(50%,'','',0);
          transform: translateY(-50%);
          border-radius: 50%;
        }
      }
    }
  }
  .single-btn-bottom {
    position: fixed;
    background-color: #fff;
    z-index: 9;
    @include list(row, space-between,center);
    .van-button {
      width: 167px;
    }
    .van-button__text {
      font-size: 15px;
    }
  }
  .single-btn-bottom-allow {
    .van-button {
      width: 100%;
    }
  }
  .jump-floor-container {
    // width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9;
    background-color: #fff;
    border-bottom: 1px solid #ebedf0;
    .swiper-container {width: 100%;height: 100%;}
    // .swiper-wrapper {
    //   width: auto !important;
    // }
    .swiper-slide {
      width: auto !important;
      // @include list(row, flex-start, center);
      .types-item {
        font-size: 14px;
        line-height: 40px;
        text-align: center;
        margin: 0 8px;
        border-radius: 15px;
        position: relative;
      }
      .types-item-checked {
        color: rgba(30, 137, 255, 1);
        &::after {
          content: '';
          display: block;
          width: 24px;
          height: 3px;
          border-radius: 2px;
          background: linear-gradient(270deg, #40BEFF 0%, #1E89FF 100%);
          @include absolute('','',0,50%);
          transform: translateX(-50%);
        }
      }
    }
  }
}
</style>
