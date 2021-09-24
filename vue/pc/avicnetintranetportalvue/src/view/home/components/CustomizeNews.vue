<!--
 * @Description:
 * @Author: peng
 * @Date: 2021-07-20 17:21:16
 * @LastEditors: zongmz
 * @LastEditTime: 2021-08-24 15:42:32
-->
<script>
// import axios from 'axios'
// import ElementUI from '@avic/golden-pc-ui'
import iconSvg from '@/components/icon-svg'
import routeToNewTab from '@/mixins/routeToNewTab'
import customizeStatus from '../mixin/customizeStatus'
import calc from '../dragHome/calc'
import MqttClient from '@/components/MqttMessage'
export default {
  name: 'Information',
  components: {
    iconSvg,
    MqttClient
  },
  mixins: [routeToNewTab, customizeStatus],
  props: {
    blockConfig: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      config: { // 自定义组件配置参数
        label: '自定义',
        reqParams: {
          dataType: '', // 1:静态数据 or 2:接口请求
          list: [], // 静态数据
          method: 'GET',
          url: 'https://portal-in-api.avicnet.cn/portal/cms/user/home/contents',
          head: '',
          refreshTime: 0 // 标识不刷新
        },

        dataField: [],
        showFieldLabel: false,
        num: false, // 序号
        showRefreshBtn: false,
        showMoreBtn: false,
        moreLink: ''
      },
      showNew: false,
      interval: null,
      platformUrl: process.env.VUE_APP_INDEX_LINK,
      defaultImg: [
        require('./../../../assets/home/infoDefaultImg/1.png'),
        require('./../../../assets/home/infoDefaultImg/2.png'),
        require('./../../../assets/home/infoDefaultImg/3.png'),
        require('./../../../assets/home/infoDefaultImg/4.png'),
        require('./../../../assets/home/infoDefaultImg/5.png'),
        require('./../../../assets/home/infoDefaultImg/6.png')
      ],
      tipIcon: require('@/assets/home/components/tipIcon.png'),
      tipText: '暂无数据',
      infoData: [],
      list: [
        // { id: '', title: '', summary: '', logoUrl: '' }
      ],
      dataFieldMap: {},
      itemH: 218,
      colNum: 10
    }
  },
  watch: {
    infoData: {
      deep: true,
      immediate: true,
      handler (n) {
        // console.log(this.config.dataField)
        const list = n.map(e => {
          this.config.dataField && this.config.dataField.forEach(i => {
            if (i.label === '图片地址') {
              e.logoUrl = e[i.field]
            } else if (i.label === '标题') {
              e.title = e[i.field]
            } else {
              e.summary = e[i.field]
            }
          })
          return e
        })
        this.list = list
      }
    },
    config: {
      deep: true,
      immediate: true,
      handler (n) {
        n.dataField.forEach(i => {
          this.dataFieldMap[i.field] = i
        })
      }
    }
  },
  mounted () {
    if (this.blockConfig && JSON.stringify(this.blockConfig) !== '{}' && this.blockConfig.componentAttr) {
      this.config = JSON.parse(this.blockConfig.componentAttr)
      this.config.label = this.blockConfig.label
      // status 1正常 2已删除 3已停用 4未被授权
      if (this.blockConfig.status !== 1) {
        this.componentStatus(this.blockConfig.status)
      } else {
        if (this.config.reqParams.dataType === '2') {
          this.initListData(JSON.parse(this.config.reqParams.list))
        } else {
          this.resize()
        }
      }
    }
  },
  methods: {
    init (params) {
      if (this.config.reqParams.dataType === '2') {
        this.list = (
          this.config.reqParams.list &&
          this.config.reqParams.list.splice(0, params.pageSize)
        ) || []
      } else {
      //   const { url, method, head, body } = this.config.reqParams

        //   // 请求体
        //   const request = {
        //     url,
        //     method,
        //     responseType: 'json'
        //   }

        //   // 处理参数
        //   request[method.toLowerCase() === 'post' ? 'data' : 'params'] = body ? JSON.parse(body) : ''

        //   // 处理headers
        //   if (head) {
        //     request.headers = JSON.parse(head)
        //   }

        //   axios({ ...request }).then(res => {
        //     // console.log(res)
        //     this.initListData(res.data)
        //     // this.list = res.data || []
        //     // this.total = res.total
        //     // this.pageNum = params.pageNum
        //   }).catch(error => {
        //   // 请求失败，
        //     ElementUI.Message({
        //       type: 'error',
        //       message: error
        //     })
        //   })

        const { requestType, url, method, version, apiName, head, body } = this.config.reqParams
        const data = {
          requestType,
          reqUrl: url,
          method,
          version,
          apiName,
          header: head,
          contentBody: body
        }
        // // 处理header
        // if (head) {
        //   data.header = JSON.parse(head)
        // }
        // // 处理body
        // if (body) {
        //   data.contentBody = JSON.parse(body)
        // }
        this.$api('common.componentExec', data).then(res => {
          const result = JSON.parse(res.data)
          if (Object.prototype.toString.call(result) === '[object Array]') {
            this.list = result
          }
          if (Object.prototype.toString.call(result) === '[object Object]') {
            this.initListData(result)
            // this.list = JSON.parse(res.data) || []
            this.total = res.total
            this.pageNum = params.pageNum
          }
        })
      }
    },
    resize (PBlockW, PBlockH) {
      // 动态计算数据条数
      const itemH = this.itemH
      const colNum = this.colNum
      const blockH = PBlockH || (this.blockConfig.blockH - 55 - 15)
      // console.log(itemH, colNum, blockH)
      this.pageSize = calc(itemH, colNum, blockH)
      // console.log(this.pageSize)

      this.init({ pageSize: this.pageSize })
      // console.log(itemH, colNum, blockH)
    },
    // 策略 遍历 response 数据, 第一个数组则为展示数据
    initListData (res) {
      // console.log(res)
      for (const key in res) {
        if (Object.prototype.toString.call(res[key]) === '[object Array]') {
          this.list = res[key]
          break
        }
      }
      // console.log(this.list)
    },
    refreshFn () {
      this.init({ pageNum: 1, pageSize: this.pageSize })
    }
  },
  render () {
    return (
      <div ref='componentBox' class='component-box home-information'>
        <div class='continer-box continer-box-title information-fix clearfix'>
          <span class='fl'>
            { this.config.label }
          </span>
          {
            this.config.showMoreBtn ? (
              <span class='fr info-btn-notext' onClick={this.routeToNewTab({ url: this.config.moreLink })}>
                <el-tooltip class='item' effect='dark' content='更多' placement='bottom'>
                  <span class='info-btn-notext-icon'><icon-svg name='gengduo' /></span>
                </el-tooltip>
              </span>
            ) : ''
          }
          {
            this.config.showRefreshBtn ? (
              <span class='fr info-btn-notext' onClick={() => this.refreshFn()}>
                <span class='info-btn-notext-icon'>
                  <el-tooltip class='item' effect='dark' content='刷新' placement='bottom'>
                    <icon-svg name='shuaxin' />
                  </el-tooltip>
                </span>
              </span>
            ) : ''
          }
        </div>
        {
          this.list.length > 0
            ? (
              <div class='information-cont information-cont-fix clearfix'>
                <div class='info-item'>
                  {
                    this.list.map((item, idx) => {
                      return (
                        <div key={item.id} class='info-item-cont'>
                          {
                            idx < 1
                              ? (
                                <div class='info-item-cont-top'>
                                  <img src={item.logoUrl} alt={item.title}/>
                                  <div class='left'>
                                    {
                                      this.dataFieldMap['title'].link
                                        ? (
                                          <div
                                            title={item.title}
                                            class='info-item-cont-top-title ell active'
                                            onClick={() => this.routeToNewTab({ url: item[this.dataFieldMap['title'].link] })}
                                          >{ item.title }</div>
                                        )
                                        : (
                                          <div title={item.title} class='info-item-cont-top-title ell'>{ item.title }</div>
                                        )
                                    }
                                    {
                                      this.dataFieldMap['summary'].link
                                        ? (
                                          <div
                                            title={item.summary}
                                            class='info-item-cont-top-des'
                                            onClick={() => this.routeToNewTab({ url: item[this.dataFieldMap['summary'].link] })}
                                          >{ item.summary }</div>)
                                        : (<div title={item.summary} class='info-item-cont-top-des'>{ item.summary }</div>)
                                    }
                                  </div>
                                </div>
                              )
                              : (
                                <div class={{ 'info-item-cont-item': true, 'active': this.dataFieldMap['title'].link }}>
                                  <span class='dot'></span>
                                  {
                                    this.dataFieldMap['title'].link
                                      ? (
                                        <span
                                          class='text'
                                          onClick={() => this.routeToNewTab({ url: item[this.dataFieldMap['title'].link] })}
                                        >{ item.title }</span>
                                      )
                                      : (<span class='text'>{ item.title }</span>)
                                  }
                                </div>
                              )
                          }
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            )
            : (
              <div class='empty'>
                <img src={this.tipIcon} alt='' class='icon'/>
                <div class='text'>{ this.tipText }</div>
              </div>
            )
        }
      </div>
    )
  }
}
</script>

<style lang="scss" scoped>
@import '@/ui/size/mixin.scss';
@mixin del($sc: 1, $fs: 14PX){
  .home-information {
    height: 100%;
    background-color: #fff;
    .information-fix{
      height: 54px !important;
      line-height: 54px !important;
      &.continer-box-title{
        &::before{
          top: 14px !important;
        }
      }
    }
    .info-btn-notext,.info-btn{
      height: 54px !important;
    }
    .information-cont {
      padding-top: 15px;
      height: calc(100% - 55px);
      /* display: flex; */
      /* flex-wrap: wrap; */
      /* overflow: auto; */
      /* align-content: flex-start; */
      .info-item {
        margin-bottom: 0;
        box-sizing: border-box;
        font-size: 14px;
        color: #191f24;
        padding-left: 20px;
        padding-right: 35px;
        height: 218px;
        box-sizing: border-box;
        &:nth-child(3n){
          padding-right: 20px;
        }
        a {
          color: #191f24;
          &:hover {
            color: #499CF8;
          }
        }
        &-cont {
          &:nth-child(2){
            .info-item-cont-item {
              margin-top: 10px;
            }
          }
          &-top {
            width: 100%;
            height: 80px;
            line-height: 19px;
            display: flex;
            img {
              width: 150px;
              height: 80px;
            }
            .left{
              flex: 1;
              width:calc(100% - 162px);
            }
            &-title {
              width: 100%;
              margin: 0 0 12px 12px;
              line-height: 24px;
              &.active {
                cursor: pointer;
                &:hover {
                  color: #499CF8;
                }
              }
            }
            &-des {
              line-height: 22px;
              color: rgba(25, 31, 36, 0.64);
              margin: 0 0 0 12px;
              @include lineClamp(2,22px,'a')
            }
          }
          .info-item-cont-item {
            display: flex;
            align-items: center;
            .dot {
              margin-right: 7px;
              width: 4px;
              height: 4px;
              border-radius: 4px;
              background: #191f24;
              vertical-align: middle;
            }
            .text{
              width: calc(100% - 11px);
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              height: 28px;
              line-height: 28px;
            }
            &.active {
              &:hover {
                cursor: pointer;
                .dot {
                  background: #499CF8;
                }
                .text{
                  color: #499CF8;
                }
              }
            }
          }
        }
      }
    }
    .continer-box-title{
      position: relative;
      border-bottom: 1px solid rgba(25, 31, 36, 0.06);
      &::before {
        position: absolute;
        top: 18px;
        left: 0;
        content: "";
        width: 5px;
        height: 18px;
        background: #499CF8;
      }
    }
    .empty{
      height: calc(100% - 55px);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .icon{
        width: 190px;
        height: 76px;
      }
      .text{
        text-align: center;
        height: 20px;
        font-size: $fs;
        color: rgba(25, 31, 36, 0.48);
        line-height: 20px;
        font-size: 12px;
      }
    }
  }
}
@import '@/ui/size/scale.scss'
</style>
