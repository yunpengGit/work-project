<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-05-30 10:21:22
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-06-09 22:28:57
-->
<template>
  <div class="home-line">
    <div class="continer-box continer-box-title clearfix">
      <span class="fl">
        重要排名
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
    <div id="bar" ref="chart" class="bar" />
  </div>
</template>

<script>
import IconSvg from '@/components/icon-svg'
import * as echarts from 'echarts/core'
import {
  DatasetComponent,
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
  [DatasetComponent, TooltipComponent, GridComponent, LegendComponent, BarChart, CanvasRenderer]
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
    // const _t = this
    // window.addEventListener('resize', function () {
    //   _t.chart.resize()
    // })
    this.init()
  },
  methods: {
    setSize () {
      // ! 修复 百分比占位时 echarts 不展示问题
      setTimeout(() => {
        const line = document.querySelector('#bar')
        // console.log(line)
        line.style.width = line.clientWidth
        line.style.height = line.clientHeight
      }, 0)
    },
    init () {
      const chartDom = document.getElementById('bar')
      this.chart = echarts.init(chartDom)

      this.option = {
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            ['product', '2019', '2020'],
            ['工业总产值', 43.3, 85.8],
            ['工业增加值', 83.1, 73.4],
            ['出口', 86.4, 65.2],
            ['进口', 72.4, 39.1]
          ]
        },
        xAxis: { type: 'category' },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          { type: 'bar' },
          { type: 'bar' }
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
.bar{
  background-color: #fff;
  /* width: 100%;
  height: 100%; */
  width: 509px;
  height: 445px;
}
</style>
