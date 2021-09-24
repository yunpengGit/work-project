import React, { useContext } from 'react'
import { Table } from 'antd'
import { Context } from './context'

const CTable = () => {
	let { columns, data, loading, rowSelection, pagination } = useContext(Context)
	let paginationDefault = {
		hideOnSinglePage: true,
		showQuickJumper: true,
		showSizeChanger: true
	}
	pagination = Object.assign(paginationDefault, pagination ? pagination : {})
	return (
		<div>
			<Table columns={columns} dataSource={data} loading={loading} rowSelection={rowSelection} pagination={pagination} />
		</div>
	)
}

export default CTable
