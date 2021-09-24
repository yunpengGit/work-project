import { Empty, Button } from 'antd'
import qs from 'qs'
import styled from 'styled-components'
import { useStore } from './../store';
import { login } from './../api/home'
import {localStorageSet, localStorageGet } from './../utils/localStorageFn'
import img from './../assets/images/error@2x.png'
const SEmpty = styled(Empty)`
  background-color: #fff;
  margin: 0;
  height: 660px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const imageStyle = {
  width: 260,
  height: 120,
}
function Error () {
	const [state, dispatch] = useStore();
	const reloadFn = () => {
		const search = qs.parse(window.location.search.replace(/^\?/, ''))
		let params = {
			serverUrl: process.env.REACT_APP_SERVER_URL,
		}
		if (process.env.NODE_ENV === 'development') {
			search.ticket = state.ticket
			params.companyId = state.companyId
			params.userId = state.userId
		}
		const {ticket}  = search
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
	}
  return (
    <SEmpty
			imageStyle={imageStyle}
      image={img}
      description={
        <span
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
					}}
				>
          <span style={{
						height: 22,
						fontSize: 16,
						fontWeight: 'bold',
						color: '#45484B',
						lineHeight: '22px'}}
					>
						出错啦…
					</span>
          <span style={{
						height: 18,
						fontSize: 12,
						color: '#45484B',
						lineHeight: '22px'}}
					>
						网络异常，点击下方按钮重试
					</span>
        </span>
      }
    >
			<Button type="primary" onClick={reloadFn}>重新加载</Button>
    </SEmpty>
  )
}
export default Error
