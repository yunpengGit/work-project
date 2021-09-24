<template>
    <div class="private">
      <div class="header-img">
        <img :src="headerImg" alt="">
      </div>
      <div class="type-list" v-for="(group, index) in items" :key="index">
        <div class="type">{{group.title}}</div>
        <van-grid :column-num="2">
            <van-grid-item
              class="item"
              v-for="(item) in group.list"
              :key="item.name"
              @click="toLink(item.name,item.grayState)"
            >
            <router-link v-if="item.grayState===0&&typeList.get(item.name).link" :to="typeList.get(item.name).link">
              <div class="item">
                <img class="logo-icon" v-if="typeList.get(item.name).src" :src="item.grayState ? typeList.get(item.name).src0 : typeList.get(item.name).src" alt />
                <span class="name">{{ item.name }}</span>
              </div>
            </router-link>
            <div class="item" v-else>
              <img class="logo-icon" v-if="typeList.get(item.name).src" :src="item.grayState ? typeList.get(item.name).src0 : typeList.get(item.name).src" alt />
              <span class="name">{{ item.name }}</span>
            </div>
            </van-grid-item>
          </van-grid>
      </div>
      <dy-form ref="submitForm" :action="ctripData.url" />
      <dy-form ref="sqForm" :action="sqData.url" method='get'/>
      <!-- <dy-form ref="fiytaForm" :action="fiytaData.url" method='get'/> -->
    </div>
</template>

<script>
import Vue from 'vue'
import { Grid, GridItem, Toast } from 'vant'
import PrivateConfig from '@/mock/privateConfig'
import DyForm from '@/components/DyForm'
import api from '@/api'
Vue.use(Grid).use(GridItem).use(Toast)
const {
  typeList,
  showList,
  showGroup,
  relationalMap,
  showTypeMap
} = PrivateConfig
export default {
  components: {
    DyForm
  },
  data () {
    return {
      headerImg: require('./../../image/private/private_banner_icon.png'),
      typeList,
      showList,
      showGroup,
      relationalMap,
      showTypeMap,
      userInfo: {
        functionModelList: []
      },
      obtUserName: '',
      items: [],
      arrGroup: [],
      data: [],
      ctripData: {
        url: '',
        isHotel: true,
        param: {
          accessuserid: '',
          appid: '',
          callback: '',
          corppaytype: '',
          employeeid: '',
          initpage: '',
          token: ''
        }
      },
      sqData: {
        url: ''
      },
      fiytaData: {
        url: ''
      }
    }
  },
  mounted () {
    this.getdata()
  },
  methods: {
    getdata () {
      let tel = localStorage.getItem('obtUserName')
      let obtCode = localStorage.getItem('obtCode')
      api.getPersonByPhone({
        tel: tel,
        obt_code: obtCode
      })
        .then(res => {
          if (res.PhoneModel.state === 1) {
            window.localStorage.setItem('userInfo', JSON.stringify(res.PhoneModel))
            let data = res.PhoneModel.functionModelList
            if (data === undefined || data === null || data.length === 0) {
              this.$router.push({
                name: 'errorPage',
                params: {
                  msg: res.PhoneModel.resultMsg,
                  title: '错误提示',
                  showHome: true
                }
              })
            } else {
              this.data = data
              this.showType(this.data)
            }
          } else {
            this.$router.push({
              name: 'errorPage',
              params: {
                msg: res.PhoneModel.resultMsg,
                title: '错误提示',
                showHome: true
              }
            })
          }
        })
        .catch(function (error) {
          Toast.fail(error)
        })
    },
    // 获取展示的类型
    showType (data) {
      // 过滤要展示的组
      let arrList = []
      showList.forEach((item) => {
        arrList.push(...data.filter(function (item1) {
          return item === item1.name
        }))
      })
      showGroup.forEach((item) => {
        this.arrGroup.push(...data.filter(function (item1) {
          return item === item1.name
        }))
      })
      // 返回名称展示名称
      arrList.forEach((item, index) => {
        item.name = relationalMap.get(item.name)
        if (!item.name) {
          arrList.splice(index, 1)
        }
      })
      this.arrGroup.forEach((item) => {
        item.name = relationalMap.get(item.name)
      })
      // 将处理好的展示对象分组

      let newList = []
      this.arrGroup.forEach((item, index) => {
        for (let i = 0, l = arrList.length; i < l; i++) {
          let obj = {
            list: []
          }
          if (item.name === showTypeMap.get(arrList[i].name)) {
            obj.title = item.name
            obj.list.push(arrList[i])
            newList.push(obj)
          }
        }
      })
      newList.forEach((item) => {
        if (this.items.length === 0) {
          this.items.push(item)
        } else {
          this.items.forEach((item1, index) => {
            if (item1.title === item.title) {
              item1.list.push(...item.list)
            } else {
              if (index === this.items.length - 1) {
                this.items.push(item)
              }
            }
          })
        }
      })
    },
    toLink (name, grayState) {
      if (grayState) {
        Toast(`您暂未开通${name}的服务`)
        return
      }
      let categoryId = JSON.parse(window.localStorage.getItem('userInfo')).categoryId
      let obtUserName = JSON.parse(window.localStorage.getItem('userInfo')).tel
      const nameMap = new Map([
        ['机票预订', 'FlightSearch'],
        ['酒店预订', 'HotelSearch'],
        ['机票订单', 'FlightOrder'],
        ['酒店订单', 'HotelOrder']
      ])
      let xcFunc = nameMap.get(name)
      if (xcFunc) {
        this.getXcUrl({
          categoryId,
          obtUserName,
          xcFunc,
          orderType: 1,
          callBack: location.href
        })
      } else {
        switch (name) {
          case '协议酒店':
            this.getHrsHotel()
            break
          case '首汽约车':
            this.getSqUrl({ obtUserName, callBack: location.href })
            break
          case '飞亚达':
            this.getFiytaUrl({ obtUserName, callBack: location.href })
            break
        }
      }
    },
    getXcUrl (data) {
      this.$store.dispatch('addLoading')
      api.loginXc(data).then(res => {
        this.ctripData = res.commonModel
        this.$refs.submitForm.submit(res.commonModel.param)
      }).catch(e => {
        console.error(e)
        this.$store.dispatch('removeLoading')
      })
    },
    getHrsHotel () { // 跳转协议酒店
      this.$store.dispatch('addLoading')
      api.getHrsHotel({
        username: JSON.parse(window.localStorage.getItem('userInfo')).tel,
        categoryId: JSON.parse(window.localStorage.getItem('userInfo')).categoryId,
        type: 1
      }).then(res => {
        this.$store.dispatch('removeLoading')
        if (res.CommonModel.successState) {
          this.$router.push({
            name: 'iframe',
            params: {
              src: res.CommonModel.model,
              title: '协议酒店（因私）',
              showHome: true
            }
          })
        } else {
          Toast(res.CommonModel.resultStr)
        }
      }).catch(err => {
        console.error(err)
        this.$store.dispatch('removeLoading')
      })
    },
    getSqUrl (data) {
      this.$store.dispatch('addLoading')
      api.loginSq(data).then(res => {
        this.$store.dispatch('removeLoading')
        if (res.CommonModel.successState) {
          this.sqData.url = res.CommonModel.model.url
          this.$refs.sqForm.submit()
        } else {
          Toast(res.CommonModel.resultStr)
        }
      }).catch(e => {
        console.error(e)
        this.$store.dispatch('removeLoading')
      })
    },
    getFiytaUrl (data) {
      this.$store.dispatch('addLoading')
      api.loginFiyta(data).then(res => {
        this.$store.dispatch('removeLoading')
        if (res.CommonModel.successState) {
          this.$router.push({
            name: 'iframe',
            params: {
              src: res.CommonModel.model.url,
              title: '飞亚达',
              showHome: true
            }
          })
        } else {
          Toast(res.CommonModel.resultStr)
        }
      }).catch(e => {
        console.error(e)
        this.$store.dispatch('removeLoading')
      })
    }
  }
}
</script>

<style scoped lang="less">
.van-grid-item__content{
  padding-top: 20px;
  padding-bottom: 17px;
}
.van-grid-item__content::after{
  border: 0;
}
[class*='van-hairline']::after{
  border: 0;
}
.private{
  padding-top: 46px;
}
.type-list{
  margin-top: 10px;
  display: flex;
  background-color: #fff;
  & > .type{
    width: 45px;
    font-size: 20px;
    color: #007EC8;
    text-align: center;
    letter-spacing: 3px;
    line-height: 59px;
  }
  & > div:nth-child(2){
    border-left: 1px solid #cfcfcf;
    flex: 1;
    display: flex;
     .item{
      display: flex;
      flex-direction: column;
      .logo-icon{
        width: 60px;
        height: 60px;
      }
      .name{
        margin-top: 4px;
        line-height: 22px;
        font-size: 16px;
        color: #4A4A4A;
        text-align: center;
      }
    }
  }
}

</style>
