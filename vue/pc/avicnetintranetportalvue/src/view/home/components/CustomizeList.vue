<!--
 * @Description:
 * @Author: peng
 * @Date: 2021-07-19 09:43:16
 * @LastEditors: zongmz
 * @LastEditTime: 2021-08-24 15:42:15
-->
<script>
// import axios from 'axios'
// import ElementUI from '@avic/golden-pc-ui'
import iconSvg from '@/components/icon-svg'
import formatDate from '@/utils/format-date'
import calc from '../dragHome/calc'
import routeToNewTab from '@/mixins/routeToNewTab'
import customizeStatus from '../mixin/customizeStatus'
import MqttClient from '@/components/MqttMessage'
export default {
  name: 'CustomizeList',
  components: {
    iconSvg,
    MqttClient
  },
  filters: {
    month (value) {
      return formatDate(value, 'MM-dd')
    }
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
          url: 'https://portal-in-api.avicnet.cn/portal/notice/view/list',
          head: '',
          refreshTime: 0 // 标识不刷新
        },

        dataField: [
          {
            field: 'title',
            label: '标题', // 表头显示名
            link: '', // 跳转 全路径
            width: '60%'
          },
          {
            'field': 'publishDate',
            'label': '时间',
            'link': '',
            'width': '30%'
          }
        ],
        showFieldLabel: false,
        num: true, // 序号
        showRefreshBtn: true,
        showMoreBtn: true,
        moreLink: ''
      },
      tipIcon: require('@/assets/home/components/tipIcon.png'),
      tipText: '暂无数据',
      list: [],
      pageNum: 1,
      pageSize: 5,
      total: 0,
      itemH: 40,
      colNum: 1
    }
  },
  mounted () {
    if (this.blockConfig && JSON.stringify(this.blockConfig) !== '{}' && this.blockConfig.componentAttr) {
      this.config = JSON.parse(this.blockConfig.componentAttr)
      this.config.label = this.blockConfig.label
      // status 1正常 2已删除 3已停用 4未被授权
      // console.log(this.config.dataField)
      // console.log(123)
      if (this.blockConfig.status && this.blockConfig.status !== 1) {
        this.componentStatus(this.blockConfig.status)
      } else {
        if (this.config.reqParams.dataType === '2') {
          this.initListData(JSON.parse(this.config.reqParams.list))
        } else {
          // console.log(123)
          this.resize()
        }
      }
    }
  },
  methods: {
    resize (PBlockW, PBlockH) {
      // 动态计算数据条数
      const itemH = this.itemH
      const colNum = this.colNum
      const blockH = PBlockH || this.blockConfig.blockH - 55 - 10
      this.pageSize = calc(itemH, colNum, blockH)
      this.init({
        pageNum: this.pageNum,
        pageSize: this.pageSize
      })
    },
    change (data) {
      if (data === 'CustomizeList') {
        this.init({ pageNum: this.pageNum, pageSize: this.pageSize })
      }
    },
    init (params) {
      if (this.config.reqParams.dataType === '2') {
        this.list = (
          this.config.reqParams.list &&
          this.config.reqParams.list.splice(0, params.pageSize)
        ) || []
      } else {
        // const { requestType, url, method, version, apiName, head, body } = this.config.reqParams

        // // 请求体
        // const request = {
        //   url,
        //   method,
        //   responseType: 'json'
        // }

        // // 处理参数
        // request[method.toLowerCase() === 'post' ? 'data' : 'params'] = body ? JSON.parse(body) : ''

        // // 处理headers
        // if (head) {
        //   request.headers = JSON.parse(head)
        // }
        // // 处理headers
        // if (body) {
        //   request.headers = JSON.parse(head)
        // }

        // axios({ ...request }).then(res => {
        //   this.initListData(res.data)
        //   // this.list = res.data || []
        //   this.total = res.total
        //   this.pageNum = params.pageNum
        // }).catch(error => {
        // // 请求失败，
        //   ElementUI.Message({
        //     type: 'error',
        //     message: error
        //   })
        // })
        // console.log(this.config)
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
    // 策略 遍历 response 数据, 第一个数组则为展示数据
    initListData (res) {
      for (const key in res) {
        if (Object.prototype.toString.call(res[key]) === '[object Array]') {
          this.list = res[key]
          break
        }
      }
    },
    refreshFn () {
      this.init({ pageNum: 1, pageSize: this.pageSize })
    }
  },
  render () {
    return (
      <div ref='componentBox' class='component-box'>
        <div class='continer-box continer-box-title clearfix'>
          <span class='fl info-name'>
            { this.config.label }
          </span>
          {
            this.config.showMoreBtn
              ? (<span class='fr info-btn-notext' onClick={() => this.routeToNewTab({ url: this.config.moreLink })}>
                <el-tooltip class='item' effect='dark' content='更多' placement='bottom'>
                  <span class='info-btn-notext-icon'><icon-svg name='gengduo' /></span>
                </el-tooltip>
              </span>)
              : ''
          }
          {
            this.config.showRefreshBtn
              ? (<span class='fr info-btn-notext' onClick={() => this.refreshFn()}>
                <span class='info-btn-notext-icon'>
                  <el-tooltip class='item' effect='dark' content='刷新' placement='bottom'>
                    <icon-svg name='shuaxin' />
                  </el-tooltip>
                </span>
              </span>)
              : ''
          }
        </div>
        {
          this.config.showFieldLabel
            ? (
              <ul class='list-header'>
                {
                  this.config.dataField.map((e, idx) => {
                    return (<li style={{ width: e.width + '%', paddingLeft: this.config.num && idx === 1 ? '20px' : 0 }} ><span key={e.field} class='ell'>{ e.label }</span></li>)
                  })
                }
              </ul>
            )
            : ''
        }
        {
          this.list.length > 0
            ? (
              <ul class='component-box-cont notice-cont'>
                {
                  this.config.dataField[0].link
                    ? (
                      <div class='active'>
                        {
                          this.list && this.list.map((item, index) => {
                            return (
                              <li key={item.id} class='item' onClick={() => this.routeToNewTab({ url: item[this.config.dataField[0].link] })}>
                                {this.config.num ? <span class='num'>{ index + 1 }、</span> : ''}
                                {
                                  this.config.dataField.map(e => {
                                    return <span key={e.field + '' + index} style={{ width: e.width + '%' }} class='ell'>{ item[e.field] }</span>
                                  })
                                }
                              </li>
                            )
                          })
                        }
                      </div>
                    )
                    : (
                      <div>
                        {
                          this.list && this.list.map((item, index) => {
                            return (
                              <li key={item.id} class='item'>
                                {this.config.num ? <span class='num'>{ index + 1 }、</span> : ''}
                                {
                                  this.config.dataField.map(e => {
                                    return <span key={e.field + '' + index} style={{ width: e.width + '%' }} class='ell'>{ item[e.field] }</span>
                                  })
                                }
                              </li>
                            )
                          })
                        }
                      </div>
                    )
                }
              </ul>
            )
            : (
              <div class='empty'>
                <img src={this.tipIcon} alt='' class='icon'/>
                <div class='text'>{ this.tipText }</div>
              </div>
            )
        }
        {this.config.reqParams.refreshTime > 0 ? <mqtt-client time={this.config.reqParams.refreshTime} onChange={() => this.change()} /> : ''}
      </div>
    )
  }
}
</script>

<style lang="scss">
@import '@/ui/size/mixin.scss';
@mixin del($sc: 1, $fs: 14PX){
  .component-box {
    background-color: #fff;
    height: 100%;
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
    .list-header{
      display: flex;
      padding: 0 20px;
      background: #F9F9F9;
      li{
        height: 44px;
        display: flex;
        span{
          display: flex;
          align-items: center;
          font-size: 14px;
          font-weight: 500;
          color: rgba(25, 31, 36, 0.56);
        }
      }
    }
    .notice-cont{
      @if $fs == 14PX {
        padding-top: 10px;
      } @else {
        padding-top: 12px;
      }
      height: calc(100% - 55px);
      .item {
        display: block;
        padding: 0 20px;
        display: flex;
        align-items: center;
        font-size: $fs;
        color: #191F24;
        .dot{
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          vertical-align: middle;
          background: #191F24;
        }
        .date{
          margin-left: 6px;
        }
        & > span{
          @if $fs == 14PX {
            height: 40px;
            line-height: 40px;
          } @else {
            height: 42px;
            line-height: 42px;
          }
          vertical-align: middle;
        }
        .title{
          flex: 1;
          display: inline-block;
          margin-left: 8px;
          @if $fs == 14PX {
            height: 40px;
            line-height: 40px;
          } @else {
            height: 42px;
            line-height: 42px;
          }
          vertical-align: middle;
        }
      }
      & > .active{
        & > .item{
          cursor: pointer;
          &:hover{
            background-color: rgba(73, 156, 248, 0.08);
            & > span{
              color: #499CF8;
            }
            .date{
              color: #499CF8;
            }
            .dot{
              background: #499CF8;
            }
            .title{
              color: #499CF8;
            }
          }
        }
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
@import '@/ui/size/scale.scss';
</style>
