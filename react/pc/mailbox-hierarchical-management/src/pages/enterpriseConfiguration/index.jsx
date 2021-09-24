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
const DefaultConfig = lazy(() => import('./DefaultConfig'))
import {
  selectCompanyConfiguresByParam,
  selectCompanyDilatationConfiguresByParam,
  saveCompanyConfigure,
  updateCompanyConfigure,
  saveCompanyDilatationConfigure,
  updateCompanyDilatationConfigure,
} from './service'
import { Box, BtnBox } from './style'
import './../../style/page.less'
const GB = 1024 * 1024 * 1024
function EnterpriseConfiguration() {
  const CDrawerRef = useRef()
  const createConfigRef = useRef()
  const CDrawerDefaultRef = useRef()
  const defaultConfigRef = useRef()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState({})
  const dataMap = new Map([
    [10 * GB, { title: '10G邮箱空间扩容', id: 'expansion10' }],
    [20 * GB, { title: '20G邮箱空间扩容', id: 'expansion20' }],
    [50 * GB, { title: '50G邮箱空间扩容', id: 'expansion50' }],
    [100 * GB, { title: '100G邮箱空间扩容', id: 'expansion100' }],
  ])
  const columns = [
    {
      title: '企业名称',
      dataIndex: 'companyName',
    },
    {
      title: '邮箱扩容类型',
      // dataIndex: 'maxMailStorage',
      render: (_, record) => {
        return <div>{dataMap.get(+record.emailDilatationStorage).title}</div>
      },
    },
    {
      title: '邮箱扩容总数量',
      dataIndex: 'emailDilatationCount',
    },
    {
      title: '邮箱可扩容数量',
      dataIndex: 'emailDilatationSurplusCount',
    },
    {
      title: '扩容生效日期',
      dataIndex: 'createTime',
      render: (_, record) => {
        return <div>{dayjs(record.createTime).format('YYYY-MM-DD')}</div>
      },
    },
    {
      title: '扩容失效日期',
      dataIndex: 'dilatationEffective',
      render: (_, record) => {
        return (
          <div>{dayjs(record.dilatationEffective).format('YYYY-MM-DD')}</div>
        )
      },
    },
    {
      title: '操作',
      render: (_, record) => {
        return (
          <div>
            <a
              onClick={() => {
                modifyConfigurationFn(record)
              }}
            >
              修改配置
            </a>
          </div>
        )
      },
    },
  ]
  const config = {
    title: '新增企业配置',
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
    getSelectCompanyConfiguresByParam({
      pageIndex: page - 1,
      pageSize,
    })
  }
  useEffect(() => {
    getSelectCompanyConfiguresByParam()
		// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // 获取平台默认配置

  // 分页查询企业扩容配置
  // const getSelectCompanyConfiguresByParam = (params) => {
  // 	selectCompanyConfiguresByParam(params).then((res) => {
  // 		setTotal(res.total)
  // 		const arr = res.data.map((item) => {
  // 			item.key = item.companyId
  // 			return item
  // 		})
  // 		setData(arr)
  // 	})
  // }
  // 分页查询企业扩容配置
  const getSelectCompanyConfiguresByParam = (params) => {
    setLoading(true)
		params = {...params, ...searchData }
    selectCompanyDilatationConfiguresByParam(params).then((res) => {
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
    setPagination({
      current: 1,
      pageIndex: 1,
      pageSize: 10,
    })
		setSearchData(params)
    getSelectCompanyConfiguresByParam(params)
  }
  // 新增企业配置
  // 标记Create 展示隐藏flag
  const [showCreate, setShowCreate] = useState(false)
  const createEnterpriseConfigurationFn = () => {
    CDrawerRef.current.showDrawer()
    createConfigRef.current.resetForm()
    setCurrent({})
    setShowCreate(true)
  }
  // const saveCompanyConfigureFn = (params) => {
  // 	saveCompanyConfigure(params).then((res) => {
  // 		CDrawerRef.current.closeDrawer()
  // 		getSelectCompanyConfiguresByParam()
  // 	})
  // }
  // 新增企业扩容配置
  const saveCompanyDilatationConfigureFn = (params) => {
    saveCompanyDilatationConfigure(params).then((res) => {
      CDrawerRef.current.closeDrawer()
      getSelectCompanyConfiguresByParam()
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
    CDrawerRef.current.showDrawer({ title: '修改企业配置', type: 'edit' })
    setShowCreate(true)
  }
  // const updateCompanyConfigureFn = (params) => {
  // 	updateCompanyConfigure(params).then((res) => {
  // 		CDrawerRef.current.closeDrawer()
  // 	})
  // }
  // 更新企业扩容配置
  const updateCompanyDilatationConfigureFn = (params) => {
    updateCompanyDilatationConfigure(params).then((res) => {
      getSelectCompanyConfiguresByParam(pagination)
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
              onClick={createEnterpriseConfigurationFn}
            >
              新增企业配置
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
                create: saveCompanyDilatationConfigureFn,
                edit: updateCompanyDilatationConfigureFn,
              }}
              closeCDrawer={closeCDrawerCreate}
              showCreate={showCreate}
            />
          </Suspense>
        </CDrawer>
        <CDrawer
          cRef={CDrawerDefaultRef}
          config={configDefault}
          closeFn={closeDrawerCallBackDefault}
        >
          <Suspense fallback={<Loading />}>
            <DefaultConfig
              cRef={defaultConfigRef}
              closeCDrawer={closeCDrawerDefault}
              showDefault={showDefault}
            />
          </Suspense>
        </CDrawer>
      </div>
    </Box>
  )
}
export default EnterpriseConfiguration
