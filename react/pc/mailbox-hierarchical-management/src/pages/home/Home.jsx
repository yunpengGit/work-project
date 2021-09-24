import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Avatar, Image, Row, Col } from 'antd'
import { Page } from './style'
import CPie from '../../components/Cpie'
import CLine from '../../components/CLine'
import {
  queryMailInfoByCompanyId,
  queryMailSendAndRecvByCompanyId,
  selectEmailCountByParam,
  selectAllCompanyDilatationConfigure,
} from './service'
import { useStore } from './../../store'
import meiyoukuorongxinxi from './../../assets/images/home/meiyoukuorongxinxi.png'
const GB = 1024 * 1024 * 1024
const MB = 1024 * 1024
const Home = () => {
  // 显示隐藏扩容
  const [expansion, setExpansion] = useState(false)
  const [state] = useStore()
  const history = useHistory()
  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const init = () => {
    const data = {
      companyId: state.companyId,
    }
    queryMailInfoByCompanyIdFn(data)
    selectEmailCountByParamFn(data)
    queryMailSendAndRecvByCompanyIdFn(data)
    expansionFn(data)
  }
  const queryMailInfoByCompanyIdFn = (data) => {
    if (
      process.env.REACT_APP_ENV === 'development' ||
      process.env.REACT_APP_ENV === 'test'
    ) {
      let result = {}
      result.data = [
        {
          orgId: 'ec76daa3a54b42dfa8a1a579236d4c8d',
          orgName: '航空工业集团总部',
          mailBoxSize: 1099511627776,
          usedSize: 109951162777.6,
          mailBoxCount: 20480,
          usedCount: 2048,
        },
      ]
      pieFn(result)
    } else {
      // const result = await queryMailInfoByCompanyId(data)
      queryMailInfoByCompanyId(data).then((res) => {
        const result = res
        pieFn(result)
      })
    }
    function pieFn(result) {
      CPie({
        id: 'useRate',
        doc: `${Math.round(result.data[0].mailBoxSize / GB)}G\n总空间`,
        color: ['#ED8E57', '#3DACA7'],
        data: [
          { type: '已使用空间', value: result.data[0].usedSize / GB },
          {
            type: '可用空间',
            value:
              result.data[0].mailBoxSize / GB - result.data[0].usedSize / GB,
          },
        ],
      })
    }
  }
  const selectEmailCountByParamFn = (data) => {
    // if (process.env.REACT_APP_ENV === 'development' || process.env.REACT_APP_ENV === 'test') {
    // 	let result = {}
    // 	result.data = [
    // 		{
    // 			"orgId": "ec76daa3a54b42dfa8a1a579236d4c8d",
    // 			"orgName": "航空工业集团总部",
    // 			"mailBoxSize": 1099511627776,
    // 			"usedSize": 109951162777.6,
    // 			"mailBoxCount": 20480,
    // 			"usedCount": 2048
    // 		}
    // 	]
    // 	pieFn(result)
    // } else {
    // 	// const result = await queryMailInfoByCompanyId(data)
    // 	selectEmailCountByParam(data).then(res => {
    // 		const result = res
    // 		pieFn(result)
    // 	})
    // }

    selectEmailCountByParam(data).then((res) => {
      const result = res
      pieFn(result)
    })
    function pieFn(result) {
      CPie({
        id: 'spaceUseRate',
        doc: `${result.data[0].totalCount}\n总量`,
        color: ['#F8AF7B', '#42C1EA'],
        data: [
          { type: '冻结邮箱数量', value: result.data[0].blockEmailCount },
          { type: '正常邮箱数量', value: result.data[0].availableEmailCount },
        ],
      })
    }
  }
  const expansionFn = (data) => {
    selectAllCompanyDilatationConfigure(data).then((res) => {
      const result = res
      if (result.data && result.data.length > 0) {
        dataFn(result.data)
      } else {
        setExpansion(false, data)
      }
    })
    function dataFn(data) {
      const dataMap = new Map([
        [10 * GB, { title: '10G邮箱空间扩容', id: 'expansion10', data: {} }],
        [20 * GB, { title: '20G邮箱空间扩容', id: 'expansion20', data: {} }],
        [50 * GB, { title: '50G邮箱空间扩容', id: 'expansion50', data: {} }],
        [100 * GB, { title: '100G邮箱空间扩容', id: 'expansion100', data: {} }],
      ])
      let config = {
        color: ['#EE9E01', '#2CD8C4'],
        // width: 165,
        height: 210,
        label: false,
        legend: false,
        appendPadding: 0,
      }
      if (data.length === 1) {
        config.width = undefined
      } else {
        data.forEach((ele) => {
          const item = dataMap.get(+ele.emailDilatationStorage)
          document.querySelector(`.${item.id}`).style.display = 'flex'
          item.data = {
            emailDilatationCount:
              (item.data.emailDilatationCount
                ? item.data.emailDilatationCount
                : 0) + ele.emailDilatationCount,
            emailDilatationSurplusCount:
              (item.data.emailDilatationSurplusCount
                ? item.data.emailDilatationSurplusCount
                : 0) + ele.emailDilatationSurplusCount,
          }
        })
        const arr = [10 * GB, 20 * GB, 50 * GB, 100 * GB]
        arr.forEach((ele) => {
          const item = dataMap.get(ele)
          const { id, data } = item
          if (data.emailDilatationCount) {
            config.id = id
            const param = {
              config,
              data,
            }
            pieFn(param)
          }
        })
      }
      setExpansion(true)
    }
    function pieFn(param) {
      const { config, data } = param
      CPie({
        doc: `${data.emailDilatationCount}\n总量`,
        ...config,
        data: [
          {
            type: '已扩容账号数量',
            value:
              +data.emailDilatationCount - data.emailDilatationSurplusCount,
          },
          { type: '可扩容账号数量', value: data.emailDilatationSurplusCount },
        ],
      })
    }
  }
  const queryMailSendAndRecvByCompanyIdFn = (data) => {
    let resultData = []
    if (
      process.env.REACT_APP_ENV === 'development' ||
      process.env.REACT_APP_ENV === 'test'
    ) {
      resultData = require('./line.json')
      lineFn(resultData)
    } else {
      queryMailSendAndRecvByCompanyId(data).then((res) => {
        const result = res
        let recvMailCountArr = []
        let sendMailCountArr = []
        let recvOuterMailCountArr = []
        let sendOuterMailCountArr = []
        result.data.forEach((ele) => {
          recvMailCountArr.push({
            name: '邮件接收量',
            value: ele.recvMailCount | 0,
            date: ele.statisticsDate,
          })
          recvOuterMailCountArr.push({
            name: '域外邮件接收量',
            value: ele.recvOuterMailCount | 0,
            date: ele.statisticsDate,
          })
          sendMailCountArr.push({
            name: '邮件发送量',
            value: ele.sendMailCount | 0,
            date: ele.statisticsDate,
          })
          sendOuterMailCountArr.push({
            name: '域外邮件发送量',
            value: ele.sendOuterMailCount | 0,
            date: ele.statisticsDate,
          })
        })
        resultData = [
          ...recvMailCountArr,
          ...sendMailCountArr,
          ...recvOuterMailCountArr,
          ...sendOuterMailCountArr,
        ]
        lineFn(resultData)
      })
    }
    function lineFn(resultData) {
      CLine({
        id: 'mailboxReceiveSend',
        color: ['#0189FF', '#2CD9C5', '#EE9E01', '#8C54FF'],
        xField: 'date',
        yField: 'value',
        seriesField: 'name',
        yAxis: {
          label: {
            formatter: (v) => {
              if (
                process.env.REACT_APP_ENV === 'development' ||
                process.env.REACT_APP_ENV === 'test'
              ) {
                return `${v / 10e8}`
              } else {
                return `${v}`
              }
            },
          },
        },
        // xAxis,
        data: resultData,
        // xField: 'date',
        // yField: 'value',
        // seriesField: 'name',
        // data: [...recvMailCountArr,...recvOuterMailCountArr,...sendMailCountArr,...sendOuterMailCountArr]
      })
    }
  }
  return (
    <Page>
      <div className="top">
        <Row style={{width: '100%'}}>
          <Col span={16}>
            <div className="left">
              <div className="space-use-rate">
                <div className="title">邮件空间使用率</div>
                <div id="useRate"></div>
              </div>
              <div className="use-rate">
                <div className="title">邮箱状态</div>
                <div id="spaceUseRate"></div>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="right">
              <div className="title">邮箱空间扩容情况</div>
              <div
                className="box"
                style={{ display: expansion ? 'flex' : 'none' }}
              >
                <div className="expansion10">
                  <span>10G邮箱空间扩容</span>
                  <div id="expansion10"></div>
                </div>
                <div className="expansion20">
                  <span>20G邮箱空间扩容</span>
                  <div id="expansion20"></div>
                </div>
                <div className="expansion50">
                  <span>50G邮箱空间扩容</span>
                  <div id="expansion50"></div>
                </div>
                <div className="expansion100">
                  <span>100G邮箱空间扩容</span>
                  <div id="expansion100"></div>
                </div>
              </div>
              <div
                className="expansionTip"
                style={{ display: expansion ? 'flex' : 'none' }}
              >
                <div className="item">
                  <span
                    className="dot"
                    style={{ backgroundColor: '#EE9E01' }}
                  ></span>
                  <span>已扩容账号数量</span>
                </div>
                <div className="item">
                  <span
                    className="dot"
                    style={{ backgroundColor: '#2CD8C4' }}
                  ></span>
                  <span>可扩容账号数量</span>
                </div>
              </div>
              <div
                className="no-data"
                style={{ display: !expansion ? 'block' : 'none' }}
              >
                <div
                  className="icon"
                  style={{
                    backgroundImage: `url(${meiyoukuorongxinxi})`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  <span className="text">暂无数据</span>
                </div>
                <div className="tip">
                  当前尚无任何扩容信息，如需为邮箱进行空间扩容，请在商网客户端【工作台-工作审批-邮箱扩容】
                  中发起申请。
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className="content">
        <div className="title">邮件收发量</div>
        <div id="mailboxReceiveSend"></div>
      </div>
    </Page>
  )
}
export default Home
