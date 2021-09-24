import {useState} from 'react'
import { message } from 'antd'
import dayjs from 'dayjs'
import CTable from '../../components/CTable'
import { TableContext } from '../../components/CTable/context'
import CPagination from '../../components/CPagination'
import CEmpty from '../../components/CEmpty'
import SendAndReceiveSearchForm from './SendAndReceiveSearchForm'
import {selectAliMailLogByParam} from './service'
import './../../style/page.less'
function SendAndReceiveLogs () {
	const [queryType, setQueryType] = useState('AccountRecvMail');
	const [dataIndex, setDataIndex] = useState('mail_from');
	const columns= [
    {
      title: '收信时间',
			dataIndex: 'time',
			render: (_, reducer) => {
        return (
          dayjs(reducer.time*1000).format("YYYY-MM-DD HH:mm:ss")
        )
      }
    },
    {
      title: ({ sortOrder, sortColumn, filters }) => {
				switch (queryType) {
					case 'AccountRecvMail':
						setDataIndex('mail_from')
						return '发信人'
					case 'AccountSendMail':
						setDataIndex('mail_to')
						return '收信人'
					case 'AccountDelMail':
						setDataIndex('mail_from')
						return '发信人'
				}
			},
      dataIndex: dataIndex,
      // render: (_, reducer) => {
			// 	// let str = reducer.mail_from.replace(/(\*)("*)/g, '$1$2')
			// 	// str = str.replace('\\', '')
			// 	// str = str.replace('\\"', '')
      //   return (
      //     reducer.mail_from.replace(/\\"/g, '')
      //   )
      // }
    },
    {
      title: '主题',
      dataIndex: 'subject',
    },
	];
	// 表格数据
	const [pageIndex, setPageIndex] = useState(0);
	const pageSize = 10;
	const [searchParams, setSearchParams] = useState({});
	const [dataAll, setDataAll] = useState([])
	const [data, setData] = useState([])
	const [isNext, setIsNext] = useState(false)
	// 分页控制参数
	// let queryCondition = {}
	const [queryCondition, setQueryCondition] = useState()
	const searchFn = async (params) => {
		// 查询重置分页控制参数
		setQueryCondition({})
		const {queryType, target, rangePicker} = params
		setPageIndex(0)
		const data = {
			queryType,
			target,
			count: pageSize,
			beginTime: {
				second: dayjs(rangePicker[0]).unix()
			},
			endTime: {
				second: dayjs(rangePicker[1]).unix()
			},
			queryCondition: {}
		}
		setSearchParams(data)
		await tableDataFn(data, 1, true)
		setQueryType(queryType)
	}
	// 获取日志数据
	const tableDataFn = (params, num, isSearch) => {
		selectAliMailLogByParam(params).then((res) => {
			if (res.status.statusCode == '100') {
				// 动态改变表格字段
				// changeQueryType(params.queryType)
				if (res.data.logs&&res.data.logs.length>0) {
					const arr = res.data.logs.map((item, index) => {
						item.key = index
						return item
					})
					setDataAll([...dataAll, ...arr])
					setData(arr)
					if(isSearch){
						setPageIndex(num)
					} else {
						setPageIndex(pageIndex + num)
					}
					setQueryCondition({
						currentCursor: res.data.assistant.nextCursor
					})
					setIsNext(res.data.hasMore)
					if (res.data&&res.data.assistant&&res.data.assistant.NextTable) {
						setQueryCondition({
							currentCursor: res.data.assistant.nextCursor,
							currentTable: res.data.assistant.NextTable,
							currentTableOffset: res.data.assistant.NextTableOffset
						})
					}
				} else {
					setData([])
					message.warning('没有查到数据!!!')
				}
			}
		})
	}
	// 分页改变触发方法
  const pageChange = (num) => {
		// 当点击上一页时 获取当前缓存数据
		if (num === -1) {
			setIsNext(true)
			const indexPrev = (pageIndex - 2) * pageSize
			const indexNext = (pageIndex - 1) * pageSize
			const arr = dataAll.slice(indexPrev, indexNext)
			setData(arr)
			setPageIndex(pageIndex + num)

		} else {
			// 判断下一页是否已缓存,后缓存使用缓存没缓存请求新数据
			if (Math.ceil(dataAll.length/pageSize)>pageIndex) {
				const indexPrev = (pageIndex * pageSize) + 1
				const indexNext = (pageIndex + 1) * pageSize
				const arr = dataAll.slice(indexPrev, indexNext)
				setData(arr)
				setPageIndex(pageIndex + num)
			} else {
				searchParams.queryCondition = queryCondition
				tableDataFn(searchParams,num)
			}
		}
  }
  return (
    <div>
      <div className="form-box">
        <SendAndReceiveSearchForm fn={searchFn}/>
      </div>
      <div className="table-box" style={{paddingBottom: 16,backgroundColor: '#ffffff'}}>
				{data.length === 0?<CEmpty/>:<TableContext columns={columns} data={data} pagination={{"disabled": true}}>
					<CTable />
				</TableContext>}
				{pageIndex===0?"":<CPagination changeFn= {pageChange} current={pageIndex} isNext={isNext}/>}
			</div>
    </div>
  )
}
export default SendAndReceiveLogs

