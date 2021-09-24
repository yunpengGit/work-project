<script>
import iconSvg from '@/components/icon-svg'
import routeToNewTab from '@/mixins/routeToNewTab'
import formatDate from '@/utils/format-date'
import calc from './../dragHome/calc'
export default {
  name: 'Notice',
  components: {
    iconSvg
  },
  filters: {
    month (value) {
      return formatDate(value, 'MM-dd')
    }
  },
  mixins: [routeToNewTab],
  props: {
    blockConfig: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      catalog: {},
      isDefault: true,
      blockTitle: '',
      tipIcon: require('@/assets/home/components/tipIcon.png'),
      tipAddIcon: require('@/assets/home/components/tipAddIcon.png'),
      list: [],
      pageNum: 1,
      pageSize: 5,
      total: 0,
      itemH: 40,
      colNum: 1
    }
  },
  watch: {
    blockTitle (n) {
      if (n) {
        this.isDefault = false
      }
    }
  },
  mounted () {
    // console.log(this.blockConfig)
    if (this.blockConfig && JSON.stringify(this.blockConfig) !== '{}' && this.blockConfig.config) {
      // this.componentConfig = this.blockConfig.config
      this.blockTitle = this.blockConfig.config.catalogName
      this.catalog = this.blockConfig.config
      // console.log(this.blockConfig.config)
      this.init(this.blockConfig.config)
    }
  },
  methods: {
    resize (PBlockW, PBlockH) {
      // 动态计算数据条数
      const itemH = this.itemH
      const colNum = this.colNum
      const blockH = PBlockH || this.blockConfig.blockH - 55 - 10
      this.pageSize = calc(itemH, colNum, blockH)
      delete this.catalog.catalogName
      this.init(this.catalog)
    },
    updateConfig (params) {
      this.catalog = { ...params }
      this.blockTitle = params.catalogName
      delete this.catalog.catalogName
      this.init(this.catalog)
    },
    init (params) {
      params = {
        ...params,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.$api('dragHome.contents', params).then(res => {
        this.list = res.data || []
        this.total = res.total
        this.pageNum = params.pageNum
      })
    },
    more () {
      this.$router.push({ path: '/information/info-list', query: { catalogId: this.catalog.catalogId, title: this.catalog.catalogName }})
    },
    refreshFn () {
      this.init(this.catalog)
    },
    hrefFn (item) {
      const { id, catalogType } = item
      // console.log(item)
      if (catalogType === 2) {
        // 调用预览
        this.$api('news.contentsQueryIds', { id }).then(res => {
          const attachments = res.data.attachments || []
          // console.log(attachments)
          let len = attachments.length
          while (len--) {
            const item = attachments.shift()
            this.preview(item.id)
          }
        })
      } else {
        this.$router.push({ path: `/information/detail?id=${id}&type=mySee` })
      }
    },
    preview (fileId) {
      this.$api('news.fileConvertPreview', { fileId }).then(res => {
        window.open(res.data)
      })
    }
  },

  render () {
    return (
      <div ref='componentBox' class='component-box'>
        {
          this.isDefault
            ? (
              <div class='tip-box'>
                <img src={this.tipAddIcon} alt='' class='icon'/>
                <div class='text'>编辑添加组件</div>
              </div>
            )
            : (
              <div style='height:100%'>
                <div class='continer-box continer-box-title clearfix'>
                  <span class='fl info-name'>
                    { this.blockTitle }
                  </span>
                  <span class='fr info-btn-notext' onClick={() => this.more()}>
                    <el-tooltip class='item' effect='dark' content='更多' placement='bottom'>
                      <span class='info-btn-notext-icon'><icon-svg name='gengduo' /></span>
                    </el-tooltip>
                  </span>
                  <span class='fr info-btn-notext' onClick={this.refreshFn}>
                    <span class='info-btn-notext-icon'>
                      <el-tooltip class='item' effect='dark' content='刷新' placement='bottom'>
                        <icon-svg name='shuaxin' />
                      </el-tooltip>
                    </span>
                  </span>
                </div>
                {
                  this.list.length > 0 ? (
                    <ul class='component-box-cont notice-cont'>
                      {
                        this.list.map(item => {
                          return (
                            <li key={item.id} class='item' onClick={() => this.hrefFn(item)}>
                              <span class='dot' />
                              <span class='date'>[{ item.publishTime.slice(5) }]</span>
                              <span class='title ell'>{ item.title }</span>
                            </li>
                          )
                        })
                      }
                    </ul>)
                    : (
                      <div class='empty'>
                        <img src={this.tipIcon} alt='' class='icon'/>
                        <div class='text'>当前栏目没有内容</div>
                      </div>
                    )
                }
              </div>
            )
        }
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
    .tip-box{
      height: 100%;
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
        cursor: pointer;
        display: flex;
        align-items: center;
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
          font-size: $fs;
          color: #191F24;
          vertical-align: middle;
        }
        &:hover{
          background-color: rgba(73, 156, 248, 0.08);
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
      }
    }
  }
}
@import '@/ui/size/scale.scss';
</style>
