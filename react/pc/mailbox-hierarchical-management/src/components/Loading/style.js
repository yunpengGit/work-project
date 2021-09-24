/*
 * @Author: your name
 * @Date: 2020-12-25 09:44:13
 * @LastEditTime: 2020-12-25 14:59:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mailbox-hierarchical-management\src\components\Loading\style.js
 */
import styled from 'styled-components'
export const LoadBox = styled.div`
height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	.loader-ring{
		display: flex;
		position: relative;
		width: 112px;
		height: 95px;
		border-radius: 8px;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		.loader-ring-light{
			width: 60px;
			height: 60px;
			border-radius: 60px;
			box-shadow: 0 1px 0.5px 0.5px #009eff inset;
			animation: rotate-360 2s linear infinite;
		}
		.load-icon{
			position: absolute;
			top: 18px;
			left: 26px;
			width: 60px;
			height: 60px;
			background-size: 100% 100%;
		}
		@keyframes rotate-360 {
			from {
				transform: rotate(0);
			}
			to {
				transform: rotate(360deg);
			}
		}
	}
`
