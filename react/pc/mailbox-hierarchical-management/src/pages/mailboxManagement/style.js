/*
 * @Author: your name
 * @Date: 2020-11-06 10:02:01
 * @LastEditTime: 2020-11-13 17:21:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mailbox-hierarchical-management\src\pages\mailboxManagement\style.js
 */
import styled from 'styled-components'
export const Box = styled.div`
	display: flex;
	.ant-tree{
		padding: 16px;
		width: 230px;
		border: 1px solid #e3e3e3;
	}
	& > .right{
		padding-left: 32px;
		flex: 1;
		.ant-empty{
			margin: 0;
		}
		.form-box{
			margin-bottom: 16px;
			padding: 24px;
			background-color: #fff;
			.form-title{
				position: relative;
				padding-left: 14px;
				margin-bottom: 24px;
				font-size: 18px;
				font-weight: bold;
				color: #292C33;
				line-height: 18px;
				&:before{
					position: absolute;
					left: 0;
					content: '';
					display: inline-block;
					width: 4px;
					height: 18px;
					background: #FFD633;
				}
				.num{
					color: #808695;
				}
			}
		}
		.table-box{
			background-color: #fff;
			.ant-divider-horizontal{
				margin-top:0;
			}
		}
	}
	.ant-modal-body{
		.item{
			padding: 8px;
			display: flex;
			div{
				font-size: 12px;
				color: #949494;
				flex: 1;
			}
		}
	}
`
export const BtnBox =styled.div`
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
`
