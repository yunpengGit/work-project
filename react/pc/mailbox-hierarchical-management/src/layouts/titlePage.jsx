import styled from 'styled-components'
const TitleStyle = styled.div`
  display: inline-block;
  margin-left: 8px;
  margin-bottom: 16px;
  font-size: 20px;
  font-weight: bold;
  color: #17233D;
  & > .box-shadow{
    margin-top: -7px;
    width: 100%;
    height: 7px;
    background: linear-gradient(180deg, rgba(30, 137, 255, 0) 0%, #1E89FF 100%);
    border-radius: 4px;
  }
`

const TitlePage = props=>{
  return (
      <>
        <TitleStyle>{props.title}<div className="box-shadow"></div></TitleStyle>
        {props.children}
      </>
  )
}
export default TitlePage