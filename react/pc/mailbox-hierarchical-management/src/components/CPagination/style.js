/*
 * @Author: your name
 * @Date: 2020-12-14 15:52:51
 * @LastEditTime: 2020-12-14 16:25:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mailbox-hierarchical-management\src\components\CPagination\style.js
 */
import styled from 'styled-components'
export const PaginationBox = styled.div`
padding-right: 16px;
background-color: #fff;
display: flex;
justify-content: flex-end;
.prev,
.next{
	display: inline-block;
	padding: 0 8px;
	height: 32px;
	color: rgba(0,0,0,.85);
	line-height: 32px;
	text-align: center;
	vertical-align: middle;
	list-style: none;
	border-radius: 2px;
	cursor: pointer;
	transition: all .3s;
}
.unabled{
	color: #1890ff;
	text-decoration: none;
	background-color: transparent;
	outline: none;
	cursor: pointer;
}
.disabled{
	color: rgba(0,0,0,.25);
	// pointer-events: none;
	cursor: not-allowed;
}
.page-list{
	line-height: 32px;
	text-align: center;
	background-color: #fff;
	border: 1px solid #d9d9d9;
	border-radius: 2px;
	display: block;
	padding: 0 12px;
	color: rgba(0,0,0,.85);
}
`
