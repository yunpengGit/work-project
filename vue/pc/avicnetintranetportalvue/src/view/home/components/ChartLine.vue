<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-05-30 10:21:22
 * @LastEditors: zongmz
 * @LastEditTime: 2021-07-21 18:27:55
-->
<template>
  <div class="home-line">
    <div class="continer-box continer-box-title clearfix">
      <span class="fl">
        使用统计
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
    <div id="line" ref="chart" class="line" />
  </div>
</template>

<script>
import * as echarts from 'echarts/core'
import IconSvg from '@/components/icon-svg'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent
} from 'echarts/components'
import {
  LineChart
} from 'echarts/charts'
import {
  CanvasRenderer
} from 'echarts/renderers'

echarts.use(
  [TitleComponent, TooltipComponent, GridComponent, VisualMapComponent, LineChart, CanvasRenderer]
)
export default {
  name: 'ChartLine',
  components: {
    IconSvg
  },
  data () {
    return {
      option: {},
      chart: ''
    }
  },
  watch: {
    // option: {
    //   handler (newVal, oldVal) {
    //     console.log(this.chart)
    //     if (this.chart) {
    //       console.log(newVal)
    //       const chartDom = document.getElementById('line')
    //       chartDom.style.width = chartDom.clientWidth
    //       chartDom.style.height = chartDom.clientHeight
    //       this.chart.setOption(newVal)
    //     } else {
    //       console.log(2)
    //       const chartDom = document.getElementById('line')
    //       this.chart = echarts.init(chartDom)
    //       this.init()
    //     }
    //   },
    //   deep: true
    // },
    // chart: {
    //   handler (newVal, oldVal) {
    //     if (newVal) {
    //       const chartDom = document.getElementById('line')
    //       chartDom.style.width = chartDom.clientWidth
    //       chartDom.style.height = chartDom.clientHeight
    //     }
    //   },
    //   deep: true
    // }
  },
  created () {
    // // ! 修复 百分比占位时 echarts 不展示问题
    // const line = document.querySelector('#line')
    // console.log(line)
    // line.style.width = line.clientWidth
    // line.style.height = line.clientHeight
  },
  mounted () {
    const _t = this
    window.addEventListener('resize', function () {
      _t.chart.resize()
    })
    // const chartDom = document.getElementById('line')
    // this.chart = echarts.init(chartDom)
    this.init()
    // this.setSize()
  },
  methods: {
    setSize () {
      // ! 修复 百分比占位时 echarts 不展示问题
      setTimeout(() => {
        const line = document.querySelector('#line')
        // console.log(line)
        line.style.width = line.clientWidth
        line.style.height = line.clientHeight
      }, 0)
    },
    init () {
      const chartDom = document.getElementById('line')
      this.chart = echarts.init(chartDom)

      const data = [['2020-06-05', 116], ['2020-06-06', 129], ['2020-06-07', 135], ['2020-06-08', 86], ['2020-06-09', 73], ['2020-06-10', 85], ['2020-06-11', 73], ['2020-06-12', 68], ['2020-06-13', 92], ['2020-06-14', 130], ['2020-06-15', 245], ['2020-06-16', 139], ['2020-06-17', 115], ['2020-06-18', 111], ['2020-06-19', 309], ['2020-06-20', 206], ['2020-06-21', 137], ['2020-06-22', 128], ['2020-06-23', 85], ['2020-06-24', 94], ['2020-06-25', 71], ['2020-06-26', 106], ['2020-06-27', 84], ['2020-06-28', 93], ['2020-06-29', 85], ['2020-06-30', 73], ['2020-07-01', 83], ['2020-07-02', 125], ['2020-07-03', 107], ['2020-07-04', 82], ['2020-07-05', 44], ['2020-07-06', 72], ['2020-07-07', 106], ['2020-07-08', 107], ['2020-07-09', 66], ['2020-07-10', 91], ['2020-07-11', 92], ['2020-07-12', 113], ['2020-07-13', 107], ['2020-07-14', 131], ['2020-07-15', 111], ['2020-07-16', 64], ['2020-07-17', 69], ['2020-07-18', 88], ['2020-07-19', 77], ['2020-07-20', 83], ['2020-07-21', 111], ['2020-07-22', 57], ['2020-07-23', 55], ['2020-07-24', 60]]

      const dateList = data.map(function (item) {
        return item[0]
      })
      const valueList = data.map(function (item) {
        return item[1]
      })

      this.option = {
        visualMap: [{
          show: false,
          type: 'continuous',
          seriesIndex: 0,
          min: 0,
          max: 400
        }, {
          show: false,
          type: 'continuous',
          seriesIndex: 1,
          dimension: 0,
          min: 0,
          max: dateList.length - 1
        }],

        title: [{
          top: 10,
          left: 'center',
          text: '用户操作日志'
        }, {
          top: '50%',
          left: 'center',
          text: '用户在线时长'
        }],
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [{
          data: dateList
        }, {
          data: dateList,
          gridIndex: 1
        }],
        yAxis: [{
        }, {
          gridIndex: 1
        }],
        grid: [{
          bottom: '60%'
        }, {
          top: '60%'
        }],
        series: [{
          type: 'line',
          showSymbol: false,
          data: valueList
        }, {
          type: 'line',
          showSymbol: false,
          data: valueList,
          xAxisIndex: 1,
          yAxisIndex: 1
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
.line{
  background-color: #fff;
  /* width: 100%;
  height: 100%; */
  width: 1035px;
  height: 445px;
}
</style>
