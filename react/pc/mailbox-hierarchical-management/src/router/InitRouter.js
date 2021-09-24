/*
 * @Author: your name
 * @Date: 2020-12-25 14:09:38
 * @LastEditTime: 2021-06-24 18:07:08
 * @LastEditors: pengpeng
 * @Description: In User Settings Edit
 * @FilePath: \mailbox-hierarchical-management\src\router\InitRouter.js
 */
import { lazy, Suspense } from 'react'
import { Route, Redirect } from 'react-router-dom'
import Loading from '../components/Loading'
import routerConfig from './index'
const TitlePage = lazy(() => import('../layouts/titlePage.jsx'))
// const Home = lazy(() => import('../pages/home/Home.jsx'))
const ErrorPage404 = lazy(() => import('../pages/404.jsx'))
import { useStore } from './../store'
const InitRouter = () => {
  const [state] = useStore()
  const { identity } = state
  let flag = true
  const arr = []
  const routerArr = (function traverseRouter(data, bool) {
    // data.map((ele, index) => {
    for (let i = 0; i < data.length; i++) {
      // if ((data[i].title == '企业配置' && identity != 1) || data[i].isHide) {
      //   continue
      // } else {
      //   if (!data[i].children) {
      //     if (i == 0 && bool) {
      //       arr.push(
      //         // ! 不加key值会引发错误警告: Warning: Each child in a list should have a unique "key" prop.
      //         <div key={i}>
      //           <Route exact path={data[i].path} key={data[i].key}>
      //             <TitlePage title={data[i].title}>{data[i].page}</TitlePage>
      //           </Route>
      //           <Route exact path="/home" key={'/home'}>
      //             <Redirect to={data[i].path} />
      //           </Route>
      //         </div>,
      //       )
      //     } else {
      //       arr.push(
      //         <Route exact path={data[i].path} key={data[i].key}>
      //           <TitlePage title={data[i].title}>{data[i].page}</TitlePage>
      //         </Route>,
      //       )
      //     }
      //   } else {
      //     traverseRouter(data[i].children, false)
      //   }
      // }
			if (!data[i].children) {
				if (i == 0 && bool) {
					arr.push(
						// ! 不加key值会引发错误警告: Warning: Each child in a list should have a unique "key" prop.
						<div key={i}>
							<Route exact path={data[i].path} key={data[i].key}>
								<TitlePage title={data[i].title}>{data[i].page}</TitlePage>
							</Route>
							<Route exact path="/home" key={'/home'}>
								<Redirect to={data[i].path} />
							</Route>
						</div>,
					)
				} else {
					arr.push(
						<Route exact path={data[i].path} key={data[i].key}>
							<TitlePage title={data[i].title}>{data[i].page}</TitlePage>
						</Route>,
					)
				}
			} else {
				traverseRouter(data[i].children, false)
			}
    }
    return arr
  })(routerConfig, flag)
  return (
    <Suspense fallback={<Loading />}>
      {routerArr}
      {/* <Route path="*">
				<ErrorPage404 />
			</Route> */}
    </Suspense>
  )
}
export default InitRouter
