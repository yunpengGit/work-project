import {useState} from 'react'
import {message} from 'antd'
import dayjs from 'dayjs'
import CTable from '../../components/CTable'
import { TableContext } from '../../components/CTable/context'
import CEmpty from '../../components/CEmpty'
import AdministratorOperationSearchForm from './AdministratorOperationSearchForm'
import './../../style/page.less'
import {selectOperationLogByParam} from './service'
import {localStorageGet} from './../../utils/localStorageFn'

function AdministratorOperationLogs () {
	const userInfo = JSON.parse(localStorageGet("loginInfo"))
	const {companyId} = userInfo
  const columns = [
    {
      title: '操作人姓名',
      dataIndex: 'operatorName',
    },
    {
      title: '邮箱地址',
      dataIndex: 'operatorEmail',
    },
    {
      title: '操作时间',
			dataIndex: 'operateTime',
			render: (_, record) => {
				return dayjs(record.operateTime).format("YYYY-MM-DD HH:mm:ss")
			}
    },
    {
      title: '操作类型',
      dataIndex: 'operateDetail',
    },
    {
      title: 'IP',
      dataIndex: 'operIp',
    },
  ];
	// 表格数据总数
  const [total, setTotal] = useState();
	const [pagination, setPagination] = useState({});
	const [data, setData] = useState([])
	const [searchParams, setSearchParams] = useState({
		titleType: 1
	})
	const searchFn = (params) => {
		setPagination({
			current: 1,
      pageIndex: 1,
      pageSize: 10
    })
		const {titleType, rangePicker} = params
		// console.log(rangePicker)
		const operateTimeFrom = rangePicker && new Date(dayjs(rangePicker[0]).valueOf()) + ""
		const operateTimeTo = rangePicker && new Date(dayjs(rangePicker[1]).valueOf()) + ""
		const data = {
			companyId,
			titleType,
			operateTimeFrom,
			operateTimeTo,
		}
		setSearchParams(data)
		getSelectOperationLogByParam(data)
	}
	// 获取日志数据
	const getSelectOperationLogByParam = (params) => {
		selectOperationLogByParam(params).then((res) => {
			if (res.data.length>0) {
				setTotal(res.total)
				const arr = res.data.map((item) => {
					item.key = item.logId
					return item
				})
				setData(arr)
			} else {
				message.warning('没有查到数据!!!')
			}
		})
	}
	// 分页改变触发方法
  const pageChange = (page, pageSize) => {
    setPagination({
      pageIndex: page - 1,
      pageSize
		})
		getSelectOperationLogByParam({
			...searchParams,
			pageIndex: page - 1,
      pageSize,
		})
  }
  return (
    <div>
      <div className="form-box">
        <AdministratorOperationSearchForm fn={searchFn}/>
      </div>
      {data.length === 0?<CEmpty/>:<TableContext columns={columns} data={data} pagination={{...pagination, total, onChange: pageChange}}>
        <CTable/>
      </TableContext>}
    </div>
  )
}
export default AdministratorOperationLogs
