import {LoadBox} from './style'
import LoadIcon from './../../assets/images/load-icon.png'
const Loading = () => (
	<LoadBox>
		<div className="loader-ring">
			<div className="loader-ring-light"></div>
			<img src={LoadIcon} className="load-icon"/>
		</div>
	</LoadBox>
)
export default Loading
