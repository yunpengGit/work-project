import { Empty } from 'antd'
import styled from 'styled-components'
import img from './../assets/images/empty@2x.png'
const SEmpty = styled(Empty)`
  background-color: #fff;
  margin: 0;
  height: 360px;
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
const CEmpty = (props) => {
  return (
    <SEmpty
      style={props.style}
      image={img}
      imageStyle={props.imageStyle?props.imageStyle:imageStyle}
      description={
        <span className="text">
          {props.title?props.style:'当前没有内容'}
        </span>
      }
    >
    </SEmpty>
  )
}
export default CEmpty
