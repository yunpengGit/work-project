/*
 * @Author: your name
 * @Date: 2020-11-04 10:57:16
 * @LastEditTime: 2021-01-22 15:30:20
 * @LastEditors: peng
 * @Description: In User Settings Edit
 * @FilePath: \mailbox-hierarchical-management\src\components\CTable\context.js
 */
import { createContext } from 'react';

export let Context = createContext()
export const TableContext = props => {
	const { columns, data, loading, rowSelection, pagination } = props
	return (
		<Context.Provider value={{ columns, data, loading, rowSelection, pagination }}>
			{props.children}
		</Context.Provider>
	)
}
