import { lazy, Suspense, useState, useEffect, useRef } from 'react'
import { Button } from 'antd'
import { PlusOutlined, FormOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import CTable from './../../components/CTable'
import { TableContext } from './../../components/CTable/context'
import CDrawer from './../../components/CDrawer'
import CEmpty from './../../components/CEmpty'
import SearchForm from './SearchForm'
import Loading from './../../components/Loading'
const CreateConfig = lazy(() => import('./CreateConfig'))
import {
  selectCompanyDomainByParam,
  saveCompanyDomain,
  updateCompanyDomain
} from './service'
import { Box, BtnBox } from './style'
import './../../style/page.less'
function EnterpriseConfiguration() {
  const CDrawerRef = useRef()
  const createConfigRef = useRef()
  const CDrawerDefaultRef = useRef()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState({})
  const columns = [
    {
      title: '企业名称',
      dataIndex: 'companyName',
    },
    {
      title: '域别名',
      width:'300px',
      dataIndex: 'domainAlias',
    },
    {
      title: '操作',
      width:'120px',
      render: (_, record) => {
        return (
          <div>
            <a
              onClick={() => {
                modifyConfigurationFn(record)
              }}
            >
              修改域别名
            </a>
          </div>
        )
      },
    },
  ]
  const config = {
    title: '新增企业域别名',
  }
  const configDefault = {
    title: `默认配置（所有企业的默认配置，不对已新增配置的企业生效）`,
  }
  // 表格数据总数
  const [total, setTotal] = useState()
  // 分页配置
  const [pagination, setPagination] = useState({})
  // 分页改变触发方法
  const pageChange = (page, pageSize) => {
    setPagination({
      pageIndex: page - 1,
      pageSize,
    })
    selectCompanyDomainByParamFn({
      pageIndex: page - 1,
      pageSize,
    })
  }
  useEffect(() => {
    selectCompanyDomainByParamFn()
		// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // 分页查询企业域别名
  const selectCompanyDomainByParamFn = (params) => {
    setLoading(true)
    selectCompanyDomainByParam(params).then((res) => {
      setLoading(false)
      setTotal(res.total)
      const arr = res.data.map((item, index) => {
        item.key = index
        return item
      })
      setData(arr)
    })
  }
	// 查询参数
	const [searchData, setSearchData] = useState({})
  // 查询方法
  const searchFormFn = (params) => {
		const pageConfig = {
      current: 1,
      pageIndex: 1,
      pageSize: 10,
    }
    setPagination(pageConfig)
		setSearchData(params)
		params = {...params,...pageConfig}
    selectCompanyDomainByParamFn(params)
  }
  // 标记Create 展示隐藏flag
  const [showCreate, setShowCreate] = useState(false)
  const createCompanyDomainFn = () => {
    CDrawerRef.current.showDrawer({ title: '修改域别名', type: 'edit' })
    createConfigRef.current.resetForm()
    setCurrent({})
    setShowCreate(true)
  }
  // 新增企业域别名
  const saveCompanyDomainFn = (params) => {
    saveCompanyDomain(params).then((res) => {
      CDrawerRef.current.closeDrawer()
      selectCompanyDomainByParamFn()
    })
  }
  // 标记Create 展示隐藏flag
  const [showDefault, setShowDefault] = useState(false)
  // 默认配置
  const defaultConfigurationFn = () => {
    CDrawerDefaultRef.current.showDrawer()
    setShowDefault(true)
  }
  // 修改配置
  const modifyConfigurationFn = (record) => {
    setCurrent(record)
    CDrawerRef.current.showDrawer({ title: '修改域别名', type: 'edit' })
    setShowCreate(true)
  }
  // 更新企业扩容配置
  const updateCompanyDomainFn = (params) => {
    updateCompanyDomain(params).then((res) => {
      selectCompanyDomainByParamFn(pagination)
      CDrawerRef.current.closeDrawer()
    })
  }
  const closeCDrawerCreate = () => {
    CDrawerRef.current.closeDrawer()
    setShowCreate(false)
  }
  const closeCDrawerDefault = () => {
    CDrawerDefaultRef.current.closeDrawer()
    setShowDefault(false)
  }
  const closeDrawerCallBackCreate = () => {
    setShowCreate(false)
  }
  const closeDrawerCallBackDefault = () => {
    setShowDefault(false)
  }
  return (
    <Box>
      <div className="form-box">
        <SearchForm fn={searchFormFn} />
      </div>
      <div className="table-box">
        <BtnBox>
          <div className="left">
            <Button
              type="primary"
              style={{ marginRight: 10 }}
              icon={<PlusOutlined />}
              onClick={createCompanyDomainFn}
            >
              新增企业域别名
            </Button>
            {/* <Button icon={<FormOutlined />} onClick={defaultConfigurationFn}>
              平台默认配置
            </Button> */}
          </div>
        </BtnBox>
        {data.length === 0 ? (
          <CEmpty />
        ) : (
          <TableContext
            columns={columns}
            data={data}
            loading={loading}
            pagination={{ ...pagination, total, onChange: pageChange }}
          >
            <CTable />
          </TableContext>
        )}
        <CDrawer
          cRef={CDrawerRef}
          config={config}
          closeFn={closeDrawerCallBackCreate}
        >
          <Suspense fallback={<Loading />}>
            <CreateConfig
              cRef={createConfigRef}
              current={current}
              fn={{
                create: saveCompanyDomainFn,
                edit: updateCompanyDomainFn,
              }}
              closeCDrawer={closeCDrawerCreate}
              showCreate={showCreate}
            />
          </Suspense>
        </CDrawer>
      </div>
    </Box>
  )
}
export default EnterpriseConfiguration
