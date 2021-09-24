/*
 * @Author: your name
 * @Date: 2020-11-06 09:52:04
 * @LastEditTime: 2021-01-26 15:30:00
 * @LastEditors: peng
 * @Description: In User Settings Edit
 * @FilePath: \mailbox-hierarchical-management\src\pages\home\style.js
 */
import styled from 'styled-components'

export const Page = styled.div`
padding-bottom: 30px;
.title{
  position: relative;
  padding-left: 13px;
  font-size: 16px;
  font-weight: bold;
  color: #17233D;
  &::before{
    position: absolute;
    top: 6px;
    left: 0;
    display: inline-block;
    content: '';
    width: 3px;
    height: 14px;
    background: #1E89FF;
    border-radius: 2px;
  }
}
.top{
  display: flex;
  .left{
    display: flex;
    flex: 1;
    height: 300px;
    background: #FFFFFF;
    border-radius: 2px;
    border: 1px solid #E8EAEC;
    & > div{
      width: 50%;
      padding: 20px;
      height: 100%;
      &:first-child{
        border-right: 1px dashed #E8EAEC;
      }
    }
  }
  .right{
    padding: 20px;
    margin-left: 16px;
		height: 300px;
    background: #FFFFFF;
    border-radius: 2px;
		border: 1px solid #E8EAEC;
		.box{
			overflow-y: auto;
			overflow-x: hidden;
			height: 242px;
			display: flex;
			flex-wrap: wrap;
			&>div{
				min-width: 50%;
				height: 100%;
				flex: 1;
				display: none;
				align-items: center;
				flex-direction: column;
			}
			&::-webkit-scrollbar {
				margin-right: 3px;
				width: 5px;
				background: rgba(255, 255, 255, 0);
			}
			&::-webkit-scrollbar-thumb{
				margin-right: 3px;
				background: rgba(0, 0, 0, 0.1);
				border-radius: 10px;
			}
		}
		.no-data{
			height: 242px;
			.icon{
				height: 138px;
				position: relative;
				margin-top: 16px;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.tip{
				padding: 16px;
			}
		}
		.expansionTip{
			position: relative;
			background-color: #fff;
			margin-top: -16px;
			display:flex;
			justify-content: center;
			align-items: center;
			.item{
				display: flex;
				justify-content: center;
				align-items: center;
				margin-right: 16px;
				.dot{
					display:flex;
					width: 10px;
					height: 10px;
					border-radius: 500%;
				}
				span{
					margin: 0 4px;
				}
			}
		}
  }
}
.content{
  background-color: #fff;
  padding: 20px;
  margin-top: 16px;
  height: 374px;
  display: flex;
  flex-direction: column;
  #mailboxReceiveSend{
    flex: 1;
  }
}
`
