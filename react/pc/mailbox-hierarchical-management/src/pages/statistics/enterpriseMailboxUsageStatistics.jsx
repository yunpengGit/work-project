import React, { useEffect, useState } from 'react'
import CTable from '../../components/CTable'
import { TableContext } from '../../components/CTable/context'
import CEmpty from '../../components/CEmpty'
import EnterpriseMailboxUsageSearchForm from './EnterpriseMailboxUsageSearchForm'
import './../../style/page.less'
import { queryMailInfoByCompanyId } from './service'
import { localStorageGet } from '../../utils/localStorageFn'
const GB = 1024 * 1024 * 1024
function MailboxUsageStatistics() {
	const userInfo = JSON.parse(localStorageGet('loginInfo'))
	const { companyId, identity } = userInfo
	const columns = [
		{
			title: '公司名称',
			dataIndex: 'orgName'
		},
		{
			title: '邮箱空间(GB)',
			dataIndex: 'mailBoxSize',
			render: (text) => text / GB
		},
		{
			title: '已用空间(GB)',
			dataIndex: 'usedSize',
			render: (text) => (text / GB).toFixed(4)
		},
		{
			title: '邮件数量上限',
			dataIndex: 'mailBoxCount'
		},
		{
			title: '已用邮件数量',
			dataIndex: 'usedCount'
		}
	]
	useEffect(() => {
		initSearch()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	const [data, setData] = useState([])
	// 表格数据总数
	const [total, setTotal] = useState()
	// 分页配置
	const [pagination, setPagination] = useState({})
	// 分页改变触发方法
	const pageChange = (page, pageSize) => {
		setPagination({
			pageIndex: page,
			pageSize
		})
		queryFn({
			pageNo: page,
			pageSize
		})
	}
	const initSearch = () => {
		queryFn()
	}
	// 查询参数
	const [searchData, setSearchData] = useState({})
	const searchFormFn = (value) => {
		setPagination({
			current: 1,
			pageIndex: 1,
			pageSize: 10
		})
		setSearchData(value)
		queryFn(value)
	}
	const queryFn = (data = { pageSize: 10 }) => {
		if (identity != 1) {
			data.companyId = companyId
		}
		data = {...data, ...searchData}
		queryMailInfoByCompanyId(data).then((res) => {
			setTotal(res.total)
			setData(res.data)
		})
	}
	return (
		<div>
			{identity != '1'?'':<div className="form-box">
				<EnterpriseMailboxUsageSearchForm fn={searchFormFn} />
			</div>}
			{data.length === 0 ? (
				<CEmpty />
			) : (
				<TableContext columns={columns} data={data} pagination={{ ...pagination, total, onChange: pageChange }}>
					<CTable />
				</TableContext>
			)}
		</div>
	)
}
export default MailboxUsageStatistics
