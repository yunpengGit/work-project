<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-05-30 10:21:22
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-06-08 16:02:19
-->
<template>
  <div class="home-line">
    <div class="continer-box continer-box-title clearfix">
      <span class="fl">
        区域展示
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
    <div id="map" ref="chart" class="map" />
  </div>
</template>

<script>
import IconSvg from '@/components/icon-svg'
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import {
  LineChart
} from 'echarts/charts'
import {
  CanvasRenderer
} from 'echarts/renderers'

echarts.use(
  [TitleComponent, ToolboxComponent, TooltipComponent, GridComponent, LegendComponent, LineChart, CanvasRenderer]
)

export default {
  name: 'ChartMap',
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
        const line = document.querySelector('#map')
        // console.log(line)
        line.style.width = line.clientWidth
        line.style.height = line.clientHeight
      }, 0)
    },
    init () {
      const chartDom = document.getElementById('map')
      this.chart = echarts.init(chartDom)
      const option = {
        color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
        title: {
          text: '渐变堆叠面积图'
        },
        // tooltip: {
        //   trigger: 'axis',
        //   axisPointer: {
        //     type: 'cross',
        //     label: {
        //       backgroundColor: '#6a7985'
        //     }
        //   }
        // },
        legend: {
          data: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Line 1',
            type: 'line',
            stack: '总量',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(128, 255, 165)'
              }, {
                offset: 1,
                color: 'rgba(1, 191, 236)'
              }])
            },
            emphasis: {
              focus: 'series'
            },
            data: [140, 232, 101, 264, 90, 340, 250]
          },
          {
            name: 'Line 2',
            type: 'line',
            stack: '总量',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0, 221, 255)'
              }, {
                offset: 1,
                color: 'rgba(77, 119, 255)'
              }])
            },
            emphasis: {
              focus: 'series'
            },
            data: [120, 282, 111, 234, 220, 340, 310]
          },
          {
            name: 'Line 3',
            type: 'line',
            stack: '总量',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(55, 162, 255)'
              }, {
                offset: 1,
                color: 'rgba(116, 21, 219)'
              }])
            },
            emphasis: {
              focus: 'series'
            },
            data: [320, 132, 201, 334, 190, 130, 220]
          },
          {
            name: 'Line 4',
            type: 'line',
            stack: '总量',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(255, 0, 135)'
              }, {
                offset: 1,
                color: 'rgba(135, 0, 157)'
              }])
            },
            emphasis: {
              focus: 'series'
            },
            data: [220, 402, 231, 134, 190, 230, 120]
          },
          {
            name: 'Line 5',
            type: 'line',
            stack: '总量',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            label: {
              show: true,
              position: 'top'
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(255, 191, 0)'
              }, {
                offset: 1,
                color: 'rgba(224, 62, 76)'
              }])
            },
            emphasis: {
              focus: 'series'
            },
            data: [220, 302, 181, 234, 210, 290, 150]
          }
        ]
      }
      this.chart.setOption(option)
    },
    refreshFn () {
      this.init()
    }
  }
}
</script>

<style scoped lang="scss">
.map{
  background-color: #fff;
  /* width: 100%;
  height: 100%; */
  width: 509px;
  height: 445px;
}
</style>
