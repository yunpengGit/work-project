<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-05-30 10:21:22
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-06-09 22:12:38
-->
<template>
  <div class="home-pie">
    <div class="continer-box continer-box-title clearfix">
      <span class="fl">
        主要指标预算执行情况
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
    <div id="pie" class="pie" />
  </div>
</template>

<script>
import IconSvg from '@/components/icon-svg'
import * as echarts from 'echarts/core'
import {
  TitleComponent
} from 'echarts/components'
import {
  PieChart
} from 'echarts/charts'
import {
  CanvasRenderer
} from 'echarts/renderers'

echarts.use(
  [TitleComponent, PieChart, CanvasRenderer]
)
export default {
  name: 'PieChart',
  components: {
    IconSvg
  },
  data () {
    return {
      option: {},
      chart: ''
    }
  },
  created () {
    // // ! 修复 百分比占位时 echarts 不展示问题
    // const line = document.querySelector('#pie')
    // line.style.width = line.clientWidth
    // line.style.height = line.clientHeight
  },
  mounted () {
    this.init()
    // // ! 修复 百分比占位时 echarts 不展示问题
    // setTimeout(() => {
    //   const line = document.querySelector('#pie')
    //   line.style.width = line.clientWidth
    //   line.style.height = line.clientHeight
    // }, 0)
    const _t = this
    window.addEventListener('resize', function () {
      _t.chart.resize()
    })
  },
  methods: {
    init () {
      const chartDom = document.getElementById('pie')
      this.chart = echarts.init(chartDom)
      var data = [{
        name: '已完成',
        value: 70
      }, {
        name: '未完成',
        value: 8
      }]
      var data1 = [{
        name: '利润',
        value: 70
      }, {
        name: '成本',
        value: 8
      }]
      this.option = {
        title: [{
          subtext: '营业收入',
          left: '12%',
          top: '10%',
          textAlign: 'center'
        }, {
          subtext: '利润',
          left: '36%',
          top: '10%',
          textAlign: 'center'
        }, {
          subtext: 'EAV',
          left: '62%',
          top: '10%',
          textAlign: 'center'
        }, {
          subtext: '净利润',
          left: '86%',
          top: '10%',
          textAlign: 'center'
        }],
        series: [{
          type: 'pie',
          center: ['50%', '50%'],
          data: data,
          label: {
            position: 'outer',
            alignTo: 'none',
            bleedMargin: 5
          },
          left: 0,
          right: '75%',
          top: 0,
          bottom: 0
        }, {
          type: 'pie',
          center: ['50%', '50%'],
          data: data,
          label: {
            position: 'outer',
            alignTo: 'labelLine',
            bleedMargin: 5
          },
          left: '25%',
          right: '50%',
          top: 0,
          bottom: 0
        }, {
          type: 'pie',
          center: ['50%', '50%'],
          data: data,
          label: {
            position: 'outer',
            alignTo: 'edge',
            margin: 20
          },
          left: '50%',
          right: '25%',
          top: 0,
          bottom: 0
        },
        {
          type: 'pie',
          center: ['50%', '50%'],
          data: data1,
          left: '75%',
          right: 0,
          top: 0,
          bottom: 0
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
.pie{
  background-color: #fff;
  /* width: 100%;
  height: 100%; */
  width: 1035px;
  height: 445px;
}
</style>
