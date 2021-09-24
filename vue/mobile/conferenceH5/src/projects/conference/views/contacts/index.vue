<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-01 13:28:28
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-11 23:38:01
-->
<template>
  <div class="contacts-container">
    <div class="meeting-type">
      <div
        v-for="(ele, index) in contactsTypeData"
        :key="ele.text"
        class="meeting-type-item"
        :class="ele.checked ? 'meeting-type-item-checked' : ''"
        @click="contactsTypeHandle(index)"
      >
        {{ ele.text }}
      </div>
    </div>
    <div class="contacts" v-if="tabIndex === 0">
      <div
        v-for="(ele, index) in contactsData"
        :key="index"
        class="list-item"
      >
          <dl>
            <dt>
              {{ ele.roleName }}
            </dt>
            <dd v-for="(eleChild, indexChild) in ele.cgList" :key="indexChild">
             <a :href="`tel:${eleChild.mobile}`">
                <div class="content">
                  <div class="pic"><img :src="eleChild.photo ? eleChild.photo : String(eleChild.sex) === '2' ? femaleSex : male" alt=""></div>
                  <ul>
                    <li class="name">{{ eleChild.userName }}</li>
                    <li class="phone">{{ eleChild.mobile }}</li>
                  </ul>
                </div>
                <img src="@/assets/images/phone.svg" alt="" class="contacts-icon">
              </a>
            </dd>
          </dl>
      </div>
    </div>
    <div class="contacts aa" v-else>
      <div
        v-for="(ele, index) in contactsDataPartner"
        :key="index"
        class="list-item"
      >
        <dl>
          <dt>
            {{ ele.typeName }}
          </dt>
          <dd v-for="(eleChild, indexChild) in ele.cgList" :key="indexChild">
            <a :href="`tel:${eleChild.phone}`">
              <div class="content">
                <div class="pic"><img :src="eleChild.photoUrl ? eleChild.photoUrl : male" alt=""></div>
                <ul>
                  <li class="name">{{ eleChild.name }}</li>
                  <li class="phone">{{ eleChild.phone }}</li>
                </ul>
              </div>
            <img src="@/assets/images/phone.svg" alt="" class="contacts-icon">
            </a>
          </dd>
        </dl>
      </div>
    </div>
    <van-empty
      v-if="(tabIndex === 0 && !contactsData.length) || (tabIndex === 1 && !contactsDataPartner.length)"
      :image="dataNull"
      description="暂无联系人信息"
    />
  </div>
</template>

<script>
import male from '@/assets/images/male.png'
import femaleSex from '@/assets/images/femaleSex.png'
import dataNull from '@/assets/images/dataNull.png'
export default {
  props: {
    routeParams: {
      default: Object
    }
  },
  data() {
    return {
      male, femaleSex, dataNull,
      contactsTypeData: [
        { text: '会务组通讯录', checked: true },
        { text: '合作方通讯录', checked: false }
      ],
      // 会务组通讯录
      contactsData: [],
      // 合作方通讯录
      contactsDataPartner: [],
      tabIndex: 0
    }
  },
  created() {
    const conferenceId = this.routeParams.id
    // 会务组通讯录
    this.$api({
      url: 'desk.getMeetingGroupPhone',
      data: {
        conferenceId
      }
    }).then(res => {
      if (res.code === 2000) {
        this.contactsData = res.result.list
      }
    })
    // 合作方通讯录
    this.$api({
      url: 'desk.getPartnerPhone',
      data: {
        conferenceId
      }
    }).then(res => {
      if (res.code === 2000) {
        console.log(res)
        this.contactsDataPartner = res.result.list
      }
    })
  },
  methods: {
    contactsTypeHandle(index) {
      // 当前选中的不允许点击
      if (this.contactsTypeData[index].checked) {
        return
      }
      this.contactsTypeData.forEach(ele => {
        ele.checked = false
      })
      this.tabIndex = index
      this.contactsTypeData[index].checked = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.contacts-container::v-deep {
  min-height: 100%;
  background-color: #f8f8f8;
  padding-top: 56px;
  .meeting-type {
    width: 100%;
    overflow: hidden;
    background-color: #fff;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9;
    .meeting-type-item {
      float: left;
      width: 50%;
      line-height: 56px;
      text-align: center;
      font-size: 17px;
      position: relative;
      &::after {
        content: '';
        display: none;
        width: 30px;
        height: 3px;
        background: linear-gradient(270deg, #40BEFF 0%, #1E89FF 100%);
        border-radius: 2px;
        @include absolute('','',10px,50%);
        transform: translateX(-50%);
      }
    }
    .meeting-type-item-checked {
      color: rgba(30, 137, 255, 1);
      &::after {
        display: block;
      }
    }
  }
  .contacts {
    width: 100%;
    a {
      color: #191F24;
    }
    .list-item {
      dl {
        dt {
          height: 44px;
          line-height: 44px;
          font-size: 13px;
          font-weight: 500;
          padding: 0 16px;
          color: rgba(25, 31, 36, 0.64);
        }
        dd {
          width: 100%;
          a {
            display: block;
            height: 66px;
            padding: 12px 16px 14px;
            background-color: #fff;
            @include list(row, space-between,center);
          }
          .content {
            @include list(row, flex-start);
            .pic {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              overflow: hidden;
              margin-right: 16px;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .name {
              font-size: 18px;
              line-height: 22px;
            }
            .phone {
              font-size: 14px;
              color: rgba(25, 31, 36, 0.64);
              line-height: 20px;
            }
          }
          .contacts-icon {
            width: 16px;
            height: 16px;
          }
        }
      }
    }
  }
  .van-empty__image {
    width: 176px;
    height: 103px;
  }
}
</style>
