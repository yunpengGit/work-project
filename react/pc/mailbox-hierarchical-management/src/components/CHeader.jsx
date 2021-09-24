import React, { useEffect }  from 'react';
import qs from 'qs'
import { Layout, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
const { Header } = Layout;
import { useStore } from './../store';
import { login } from './../api/home'
import logo from './../assets/images/home/logo@2x.png'
import {localStorageSet, localStorageGet } from './../utils/localStorageFn'
const CHeader= () => {
	const [state, dispatch] = useStore();
	const search = qs.parse(window.location.search.replace(/^\?/, ''))
	let params = {
		serverUrl: process.env.REACT_APP_SERVER_URL,
	}
	if (process.env.REACT_APP_ENV === 'development') {
		search.ticket = state.ticket
		params.companyId = state.companyId
		params.userId = state.userId
	}
	const {ticket}  = search
	useEffect(() => {
		const loginInfo = JSON.parse(localStorageGet("loginInfo"))
		if (loginInfo&&loginInfo.token) {
			dispatch({type: 'save', value: JSON.parse(localStorageGet("loginInfo"))})
		} else if (ticket) {
			params.ticket = ticket
			login(params).then((res) => {
				let data = res.data
				if (res.success){
					data.isError = false
				} else {
					data = {
						isError: true
					}
				}
				dispatch({type: 'save', value: data})
				localStorageSet("loginInfo", JSON.stringify(data), 12*60*60*1000)
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[dispatch])
	return (
		<Header>
			<div className="logo">
				<img src={logo} alt=""/>
			</div>
			{state.isError?'':<div className="userInfo">
				<div className="header">
					<Avatar size={40} icon={<UserOutlined />} src={state.photo}/>
				</div>
				<div className="info">
					<span className="nameEmail">{state.userName}{'<'+state.email+'>'}</span>
					<span className="company">{state.companyName}</span>
				</div>
			</div>}
		</Header>
	)
}
export default CHeader
