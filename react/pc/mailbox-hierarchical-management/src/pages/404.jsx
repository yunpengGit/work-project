import { Empty, Button } from 'antd'
import styled from 'styled-components'
import img from './../assets/images/404@2x.png'
const SEmpty = styled(Empty)`
  background-color: #fff;
  margin: 0;
  height: 660px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .text{
    fontSize: 14;
    color: '#808695';
  }
`
const imageStyle = {
  width: 260,
  height: 120,
}
function ErrorPage404 () {
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
						没找到当前页面
					</span>
        </span>
      }
    >
			{/* <Button type="primary">重新加载</Button> */}
    </SEmpty>
  )
}
export default ErrorPage404
