import { lazy, Suspense } from 'react'
import { Switch, Route } from 'react-router-dom'
import { Layout } from 'antd'
import LeftNav from './../components/LeftNav.jsx'
import InitRouter from './../router/InitRouter'
import { useStore } from './../store'
import Loading from './../components/Loading'
const Error = lazy(() => import('../pages/Error.jsx'))
const { Content, Sider } = Layout
const ErrorOrSuccess = () => {
  const [state] = useStore()
  return (
    <>
      {state.isError ? (
        <Switch>
          <Route exact path="*">
            <Suspense fallback={<Loading />}>
              <Error />
            </Suspense>
          </Route>
        </Switch>
      ) : (
        <Layout>
          <Sider>
            <LeftNav />
          </Sider>
          <Content style={{ padding: 16 }}>
            <Switch>
              <InitRouter />
            </Switch>
          </Content>
        </Layout>
      )}
    </>
  )
}
export default ErrorOrSuccess
