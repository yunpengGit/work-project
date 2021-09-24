<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-05-30 10:21:22
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-06-09 21:38:42
-->
<template>
  <div class="home-line">
    <div class="continer-box continer-box-title clearfix">
      <span class="fl">
        成本费用占营业收入
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
    <div id="gauge" ref="chart" class="gauge" />
  </div>
</template>

<script>
import IconSvg from '@/components/icon-svg'
import * as echarts from 'echarts/core'
import {
  GaugeChart
} from 'echarts/charts'
import {
  CanvasRenderer
} from 'echarts/renderers'

echarts.use(
  [GaugeChart, CanvasRenderer]
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
        const line = document.querySelector('#gauge')
        // console.log(line)
        line.style.width = line.clientWidth
        line.style.height = line.clientHeight
      }, 0)
    },
    init () {
      const chartDom = document.getElementById('gauge')
      this.chart = echarts.init(chartDom)

      this.option = {
        series: [{
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 120,
          splitNumber: 12,
          itemStyle: {
            color: '#58D9F9',
            shadowColor: 'rgba(0,138,255,0.45)',
            shadowBlur: 10,
            shadowOffsetX: 2,
            shadowOffsetY: 2
          },
          progress: {
            show: true,
            roundCap: true,
            width: 18
          },
          pointer: {
            icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
            length: '75%',
            width: 16,
            offsetCenter: [0, '5%']
          },
          axisLine: {
            roundCap: true,
            lineStyle: {
              width: 18
            }
          },
          axisTick: {
            splitNumber: 2,
            lineStyle: {
              width: 2,
              color: '#999'
            }
          },
          splitLine: {
            length: 12,
            lineStyle: {
              width: 3,
              color: '#999'
            }
          },
          axisLabel: {
            distance: 30,
            color: '#999',
            fontSize: 14
          },
          title: {
            show: false
          },
          detail: {
            backgroundColor: '#fff',
            borderColor: '#999',
            borderWidth: 2,
            width: '60%',
            lineHeight: 50,
            height: 40,
            borderRadius: 8,
            offsetCenter: [0, '35%'],
            valueAnimation: true,
            formatter: function (value) {
              return '{value|' + value.toFixed(0) + '}'
            },
            rich: {
              value: {
                fontSize: 30,
                fontWeight: 'bolder',
                color: '#777'
              },
              unit: {
                fontSize: 20,
                color: '#999',
                padding: [0, 0, -20, 10]
              }
            }
          },
          data: [{
            value: 30
          }]
        }]
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
.gauge{
  background-color: #fff;
  /* width: 100%;
  height: 100%; */
  width: 509px;
  height: 445px;
}
</style>
