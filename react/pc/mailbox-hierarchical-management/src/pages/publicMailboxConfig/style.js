/*
 * @Author: your name
 * @Date: 2020-11-06 13:33:05
 * @LastEditTime: 2021-01-06 13:17:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mailbox-hierarchical-management\src\pages\mailboxGroupManagement\style.js
 */
import styled from 'styled-components'
export const Box = styled.div`
.form-box{
  margin-bottom: 16px;
  padding: 24px;
  background-color: #fff;
}
.table-box{
  background-color: #fff;
  .ant-divider-horizontal{
    margin-top:0;
  }
}
.member-title{
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
}
`
export const BtnBox =styled.div`
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
`
export const CreateMailGroupPage = styled.div`
padding: 30px 16px;
background-color: #fff;
.hidden-input{
	.ant-form-item-control-input{
		.ant-form-item-control-input-content{
			visibility: hidden;
		}
	}
}
.title{
  margin-bottom: 30px;
  padding-left: 14px;
  position: relative;
  font-size: 18px;
  font-weight: bold;
  color: #292C33;
  &:before{
    position: absolute;
    top: 6px;
    left: 0;
    content: '';
    display: inline-block;
    width: 4px;
    height: 18px;
    background: #FFD633;
  }
}
`
