import {useState} from 'react'
import {message} from 'antd'
import dayjs from 'dayjs'
import CTable from '../../components/CTable'
import { TableContext } from '../../components/CTable/context'
import CPagination from '../../components/CPagination'
import CEmpty from '../../components/CEmpty'
import LoginSearchForm from './LoginSearchForm'
import './../../style/page.less'
import {selectAliMailLogInfoByParam} from './service'
function Loginlogs () {
  const columns = [
    // {
    //   title: '员工姓名',
    //   dataIndex: 'name',
    // },
    {
      title: '邮箱地址',
      dataIndex: 'account',
    },
    {
      title: '登录时间',
      dataIndex: 'ctime',
    },
    {
      title: '登陆方式',
			dataIndex: 'src',
			render: (_, record) =>{
				switch (record.src) {
					case '1':
						return "web"
					case '2':
						return "pop3"
					case '4':
						return "smtp"
					case '8':
						return "Imap"
					case '16':
						return "Caldav"
					case '128':
						return "Mail"
					default:
							return '-'
				}
			}
    },
    {
      title: 'IP',
      dataIndex: 'peer',
    },
  ];
	// 表格数据
	const [pageIndex, setPageIndex] = useState(0);
	const pageSize = 10;
	const [searchParams, setSearchParams] = useState({});
	const [dataAll, setDataAll] = useState([])
	const [data, setData] = useState([])
	const [isNext, setIsNext] = useState(false)
	const [currentCursor, setCurrentCursor] = useState()
	const searchFn = (params) => {
		const {email, rangePicker} = params
		setPageIndex(0)
		setCurrentCursor('')
		setDataAll([])
		const data = {
			email,
			aliMailLogInfoQuery: {
				queryType: 'SlsQueryLogin',
				count: pageSize,
				"beginTime": dayjs(rangePicker[0]).unix(),
				"endTime": dayjs(rangePicker[1]).unix(),
			}
		}
		if(currentCursor)
		data.aliMailLogInfoQuery.currentCursor = currentCursor
		setSearchParams(data)
		// ! 处理 useState 异步不及时更新问题
		// setPageIndex(0, tableDataFn(data, 1))
		tableDataFn(data, 1, true)
	}
	// 获取日志数据
	const tableDataFn = (params, num, isSearch) => {
		selectAliMailLogInfoByParam(params).then((res) => {
			if (res.status.statusCode  == '100') {
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
					setCurrentCursor(res.data.assistant.nextCursor)
					setIsNext(res.data.hasMore)
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
				const indexPrev = (pageIndex * pageSize)
				const indexNext = (pageIndex + 1) * pageSize
				const arr = dataAll.slice(indexPrev, indexNext)
				setData(arr)
				setPageIndex(pageIndex + num)
			} else {
				searchParams.aliMailLogInfoQuery.currentCursor = currentCursor
				tableDataFn(searchParams,num)
			}
		}
  }
  return (
    <div>
      <div className="form-box">
        <LoginSearchForm fn={searchFn}/>
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
export default Loginlogs
