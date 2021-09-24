import {PaginationBox} from './style'
const CPagination = (props) => {
	let {changeFn, current, isNext} = props
	const changePrev = () => {
		changeFn(-1)
	}
	const changeNext = () => {
		if (isNext) {
			changeFn(1)
		}
	}
	// const pageArr = new Array(Math.ceil(total/pageSize + 1))
	return (
		<PaginationBox>
			<span onClick={changePrev} className={`prev ${current===1?"disabled":"unabled"}`}>上一页</span>
			<span className="page-list">{current}</span>
			<span onClick={changeNext} className={`next unabled ${isNext?"":"disabled"}`}>下一页</span>
		</PaginationBox>
	)
}
export default CPagination
