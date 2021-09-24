import { useState, useEffect, useRef } from 'react'
import { message, Tooltip, Button, Upload } from 'antd'
import { QuestionCircleOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import axios from 'axios'
import { saveAs } from 'file-saver'
import CTable from '../../components/CTable'
import { TableContext } from '../../components/CTable/context'
import CTree from '../../components/CTree'
import TreeContext from '../../components/CTree/context'
import CDrawer from '../../components/CDrawer'
import CEmpty from '../../components/CEmpty'
import IconFont from '../../components/IconFont'
import SearchForm from './SearchForm'
import SetDomainAlias from './SetDomainAlias'
import EditMail from './EditMail'
import OneWayImport from './OneWayImport'
import { Box, BtnBox } from './style'
import { orgList, selectEmailByParam,createAccountAlias,updateAccountAlias,emailAliasImportTemplateDownloadService,emailAliasImportService } from './service'
import { localStorageGet } from './../../utils/localStorageFn'
import { selectRootOrgList } from './../enterpriseConfiguration/service'

const GB = 1024 * 1024 * 1024
function MailboxManagement() {
  const childRef = useRef()
  const userInfo = JSON.parse(localStorageGet('loginInfo'))
  const { companyName, companyId, identity } = userInfo

	useEffect(() => {
    // 获取公司组织架构
    if (identity != '1') {
      getOrgList()
    } else {
      selectRootOrgListFn()
    }
    // 查询当前对应邮箱列表
    let selectEmailByParam = {
      orgParentId: companyId,
    }
    setSearchParam(selectEmailByParam)
    getSelectEmailByParam(selectEmailByParam)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, companyName, identity])

  // 左侧组织机构模块
  const [treeData, setTreeData] = useState([])
  const [selectData, setSelectData] = useState({})
	// 超级管理员获取顶级公司列表
  const selectRootOrgListFn = () => {
    selectRootOrgList().then((res) => {
      let arr = []
      arr = res.data.map((item) => {
        item.title = item.orgName
        item.key = item.orgId
        return item
      })
      setTreeData(arr)
    })
  }
  // 获取公司组织架构
  const getOrgList = () => {
    const data = {
      id: companyId,
    }
    orgList(data).then((res) => {
      let arr = []
      arr = res.data.map((item) => {
        let iconName = 'gongsi'
        if (item.type == 2) {
          iconName = 'bumen'
        }

        item.title = item.orgName
        item.key = item.orgId
        item.icon = <IconFont type={iconName} />
        return item
      })
      setTreeData([
        {
          title: companyName,
          key: companyId,
          companyId,
          icon: <IconFont type="gongsi" />,
          children: arr,
        },
      ])
    })
  }
  // 获取公司下级组织架构
  const getOrgChildrenList = async (params) => {
    const res = await axios({
      url: `/api/org/${params.id}/orgList`,
      method: 'get',
      headers: {
        Authorization: JSON.parse(localStorageGet('loginInfo')).token,
      },
    })
    let arr = []
    if (res.data.success) {
      arr = res.data.data.map((item) => {
        let iconName = 'gongsi'
        if (item.type == 2) {
          iconName = 'bumen'
        }
        item.title = item.orgName
        item.key = item.orgId
        item.icon = <IconFont type={iconName} />
        return item
      })
    } else {
      message.error(res.data.message)
    }
    return arr
  }
  // 组织机构选中数据更新
  const selectDataTree = (params) => {
    setSelectData(params)
    setTitle(params.title)
    getSelectEmailByParam({ ...searchParam, orgParentId: params.key })
    setSearchParam({ orgParentId: params.key })
  }

  // 查询标题
  const [title, setTitle] = useState(companyName)
  // 查询邮箱表格参数
  const [searchParam, setSearchParam] = useState({})
	// 查询方法
  const searchFormFn = (value) => {
    value.orgParentId = selectData.key ? selectData.key : companyId
    setSearchParam(value)
    setPagination({
      // current: 1,
      pageIndex: 0,
      pageSize: 10,
    })
    getSelectEmailByParam(value)
  }
  // 通过选中组织机构树节点查询邮箱
  const getSelectEmailByParam = (params) => {
    setLoading(true)
    selectEmailByParam(params).then((res) => {
      setLoading(false)
      setTotal(res.total)
      if (res.data && res.data.length > 0) {
        const arr = res.data.map((item) => {
          item.key = item.email
          return item
        })
        setData(arr)
      } else {
        setData([])
        message.warning('没有查到数据!!')
      }
    })
  }

  // 表格模块
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const columns = [
    {
      title: '员工姓名',
      dataIndex: 'name',
    },
    {
      title: '邮箱地址',
      dataIndex: 'displayAlias',
    },
    {
      title: '邮箱别名',
      dataIndex: 'emailAlias',
    },
    {
      title: '所属部门',
      dataIndex: 'departmentName',
    },
    {
      title: '邮箱状态',
      dataIndex: 'activeStatus',
      render: (text) => {
        if (text === 1) {
          return (
            <span
              style={{
                color: 'red',
              }}
            >
              冻结
            </span>
          )
        } else {
          return <span>正常</span>
        }
      },
    },
    {
      title: '邮箱空间',
      dataIndex: 'storageSize',
      render: (_, record) => {
        if (record.storageSize) {
          return <span>{record.storageSize / GB}GB</span>
        } else {
          return <span>5GB</span>
        }
      },
    },
    {
      title: (
        <div>
          操作
          <Tooltip
            placement="top"
            title="单导设置：设置邮箱发信权限，是否支持向域外邮箱发信"
          >
            <QuestionCircleOutlined style={{ marginLeft: 10 }} />
          </Tooltip>
        </div>
      ),
      dataIndex: '',
      key: 'x',
      render: (_, record) => {
        return (
          <>
            <a onClick={() => editMailBtn(record)} style={{ marginRight: 8 }}>
              邮箱设置
            </a>
            <a onClick={() => oneWayImportBtn(record)} style={{ marginRight: 8 }}>单导设置</a>
            <a onClick={() => setDomainAliasBtn(record)}>
              别名设置
            </a>
          </>
        )
      },
    },
  ]
	const [current, setCurrent] = useState({})
	// 表格数据总数
  const [total, setTotal] = useState()
  // 分页配置
  const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	})
	// 分页改变触发方法
  const pageChange = (page, pageSize) => {
    setPagination({
      pageIndex: page - 1,
      pageSize,
    })
    getSelectEmailByParam({
      ...searchParam,
      orgParentId: selectData.key ? selectData.key : companyId,
      pageIndex: page - 1,
      pageSize,
    })
  }

	// setDomainAliasRef
	const setDomainAliasRef = useRef()
	const [currentCompanyId,setCurrentCompanyId] = useState(companyId)
	const [showDomainAlias, setShowDomainAlias] = useState(false)
	const setDomainAliasBtn = (item) => {
		const id = selectData.companyId?selectData.companyId:companyId
    setCurrent(item)
		setCurrentCompanyId(id)
		setShowDomainAlias(true)
		setDomainAliasRef.current.showDrawer()
	}
	const setDomainAliasClose = () => {
		setShowDomainAlias(false)
		setDomainAliasRef.current.closeDrawer()
	}



	// 邮箱设置
	const editMailRef = useRef()
	const [showEditMail, setShowEditMail] = useState(false)
	const editMailBtn = (item) => {
		if (item.activeStatus === 1) {
      message.warning('账号冻结状态!!')
      return
    }
    item.companyId = selectData.key || companyId
    item.companyId = selectData.key || companyId
    setCurrent(item)
    setShowEditMail(true)
    editMailRef.current.showDrawer()
	}
	const editMailClose = () => {
		setShowEditMail(false)
		editMailRef.current.closeDrawer()
	}

	// 单导设置
	const oneWayImportRef = useRef()
	const [showOneWayImport, setShowOneWayImport] = useState(false)
	const oneWayImportBtn = (item) => {
		if (item.activeStatus === 1) {
      message.warning('账号冻结状态!!')
      return
    }
    item.companyId = selectData.key || companyId
    setCurrent(item)
		setShowOneWayImport(true)
		oneWayImportRef.current.showDrawer()
	}
	const oneWayImportClose = () => {
		setShowOneWayImport(false)
		oneWayImportRef.current.closeDrawer()
	}
	const searchMail = () => {
		getSelectEmailByParam({ ...searchParam, orgParentId: selectData.key?selectData.key:companyId, ...pagination})
	}

	// 邮箱别名
	const createAccountAliasFn = (params) => {
		createAccountAlias(params).then(res => {
			message.success('新增企业域别名成功')
			data.forEach(e => {
				if(e.email === params.email){
					e.emailAlias = params.emailAlias
				}
			})
			setData(data)
			setDomainAliasRef.current.closeDrawer()
		})
	}

	const updateAccountAliasFn = (params) => {
		updateAccountAlias(params).then(res => {
			message.success('更新企业域别名成功')
			data.forEach(e => {
				if(e.email === params.email){
					e.emailAlias = params.emailAlias
				}
			})
			setData(data)
			setDomainAliasRef.current.closeDrawer()
		})
	}

	// 导入邮箱别名
	const downloadFile = () => {
		emailAliasImportTemplateDownloadService().then(res => {
			const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
			const patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
			console.log()
			const contentDisposition = decodeURI(res.headers['content-disposition'])
			const result = patt.exec(contentDisposition)
			const fileName = result[1]
			saveAs(blob,fileName)
		})
	}
	const uploadFile = () => {
		emailAliasImportService().then(res => {
			getSelectEmailByParam({
				orgParentId: companyId,
			})
		})
	}
	const token = JSON.parse(localStorageGet("loginInfo")).token
	// 导入
	const uploadProps = {
		accept: '.xlsx,.xls',
		name: 'file',
		multiple: false,
		showUploadList: false,
		action: '/api/uploadExcel/emailAliasImportService',
		headers: {
			Authorization: token
		},
		onChange: info => {
			// console.log(info)
			if(info.file.response){
				if(info.file.response.success){
					message.success('导入成功')
					getSelectEmailByParam({
						orgParentId: companyId,
					})
				} else {
					const msg = info.file.response.message||info.file.response.exception
					message.error(msg)
				}
			}
		}
	}
  return (
    <Box>
      <TreeContext.Provider value={{ treeData }}>
        <CTree
          parentFn={{ getOrgChildrenList, selectDataTree }}
          showIcon={true}
        />
      </TreeContext.Provider>
      <div className="right">
        <div className="form-box">
          <div className="form-title">
            {title}
            <span className="num">（邮箱数量：{total}）</span>
          </div>
          <SearchForm searchFn={searchFormFn} />
        </div>
        <div className="table-box">
          <BtnBox>
            <div className="left">
              {/* <Button
                type="primary"
                onClick={setDomainAliasBtn}
              >
                域别名设置
              </Button> */}
            </div>
            <div className="right">
							<Button type="link" icon={<DownloadOutlined />} onClick={downloadFile}>
								下载模板
							</Button>
							<Upload {...uploadProps}>
								<Button icon={<UploadOutlined />}>导入邮箱别名</Button>
							</Upload>
						</div>
          </BtnBox>
        </div>
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
						<CDrawer
              cRef={setDomainAliasRef}
              config={{
                title: '别名设置',
              }}
              closeFn={() => setShowDomainAlias(false)}
            >
              <SetDomainAlias
                current={current}
								showDrawer={showDomainAlias}
                companyId={currentCompanyId}
								fn={{
									create: createAccountAliasFn,
									edit: updateAccountAliasFn,
								}}
                closeCDrawer={setDomainAliasClose}
              />
            </CDrawer>
            <CDrawer
              cRef={editMailRef}
              config={{
                title: '邮箱设置',
              }}
              closeFn={() => setShowEditMail(false)}
            >
              <EditMail
                selectData={selectData}
                current={current}
                showDrawer={showEditMail}
                closeCDrawer={editMailClose}
              />
            </CDrawer>
            <CDrawer
              cRef={oneWayImportRef}
              config={{
                title: '单导设置',
              }}
              closeFn={() => setShowOneWayImport(false)}
            >
              <OneWayImport
                current={current}
								showDrawer={showOneWayImport}
								searchFn={searchMail}
                closeCDrawer={oneWayImportClose}
              />
            </CDrawer>
          </TableContext>
        )}
      </div>
    </Box>
  )
}
export default MailboxManagement
