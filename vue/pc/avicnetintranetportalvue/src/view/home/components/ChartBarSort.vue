<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-05-30 10:21:22
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-06-09 21:41:18
-->
<template>
  <div class="home-line">
    <div class="continer-box continer-box-title clearfix">
      <span class="fl">
        直属单位排名
      </span>
      <span class="fr info-btn-notext" @click="linkToNewTab()">
        <el-tooltip class="item" effect="dark" content="更多" placement="bottom">
          <span class="info-btn-notext-icon"><icon-svg name="gengduo" /></span>
        </el-tooltip>
      </span>
      <span class="fr info-btn-notext" @click="refreshFn">
        <el-tooltip class="item" effect="dark" content="刷新" placement="bottom">
          <span class="info-btn-notext-icon"><icon-svg name="shuaxin" /></span>
        </el-tooltip>
      </span>
    </div>
    <div id="bar1" ref="chart" class="bar1" />
  </div>
</template>

<script>
import IconSvg from '@/components/icon-svg'
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import {
  BarChart
} from 'echarts/charts'
import {
  CanvasRenderer
} from 'echarts/renderers'

echarts.use(
  [TitleComponent, TooltipComponent, GridComponent, LegendComponent, BarChart, CanvasRenderer]
)

export default {
  name: 'ChartBar',
  components: {
    IconSvg
  },
  data () {
    return {
      option: {},
      chart: ''
    }
  },
  mounted () {
    const _t = this
    window.addEventListener('resize', function () {
      _t.chart.resize()
    })
    this.init()
  },
  methods: {
    setSize () {
      // ! 修复 百分比占位时 echarts 不展示问题
      setTimeout(() => {
        const line = document.querySelector('#bar1')
        // console.log(line)
        line.style.width = line.clientWidth
        line.style.height = line.clientHeight
      }, 0)
    },
    init () {
      const chartDom = document.getElementById('bar1')
      this.chart = echarts.init(chartDom)

      this.option = {
        // title: {
        //   text: '世界人口总量',
        //   subtext: '数据来自网络'
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['2020年']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['中航国际', '中航工业机载系统', '中航工业汽车', '中航工业自动驾驶', '中航工业物联网', '中航工业商城']
        },
        series: [
          {
            name: '2020年',
            type: 'bar',
            data: [1008203, 23489, 29034, 104970, 31744, 630230]
          }
        ]
      }
      this.chart.setOption(this.option)
    },
    refreshFn () {
      this.init()
    }
  }
}
</script>

<style scoped lang="scss">
.bar1{
  background-color: #fff;
  /* width: 100%;
  height: 100%; */
  width: 1035px;
  height: 445px;
}
</style>
