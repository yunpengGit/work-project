import { Layout } from 'antd';
import {BrowserRouter as Router} from 'react-router-dom'
import CHeader from '../components/CHeader'
import ErrorOrSuccess from './ErrorOrSuccess.jsx'
import {StylePage} from './stylePage'
import {StoreProvider} from './../store'

const Page = () => {
  return (
		<StylePage>
			<Router>
				<Layout>
					<StoreProvider>
						<CHeader/>
						<ErrorOrSuccess/>
					</StoreProvider>
				</Layout>
			</Router>
		</StylePage>
	)
}
export default Page
