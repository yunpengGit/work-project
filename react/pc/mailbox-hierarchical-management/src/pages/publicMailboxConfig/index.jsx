import { useState, useEffect, useRef } from 'react'
import { message, Button, Divider, Popconfirm } from 'antd'
import {
  PlusOutlined,
  StopOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import CTable from '../../components/CTable'
import { TableContext } from '../../components/CTable/context'
import CDrawer from '../../components/CDrawer'
import CModal from '../../components/CModal'
import CEmpty from '../../components/CEmpty'
import SearchForm from './SearchForm'
import Member from './Member'
import CreateRelatedMail from './CreateRelatedMail'
import ModifyForm from './ModifyForm'
import { Box, BtnBox } from './style'
import {
  selectPublicEmailByParam,
  saveEmail,
  updateAccountInfo,
  updateAccountPassword,
  deleteEmails,
  batchUpdateEmail,
} from './service'
import { localStorageGet } from './../../utils/localStorageFn'
function PublicMailboxConfig() {
  const userInfo = JSON.parse(localStorageGet('loginInfo'))
  const { companyId, identity } = userInfo
  const childRef = useRef()
  const childRefMember = useRef()
  const createRelateRef = useRef()
  const CDrawerModifyForm = useRef()
  const [data, setData] = useState([])
  const [current, setCurrent] = useState([])
  // 表格选中项key
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  // 成员管理Drawer显示隐藏状态
  const [drawerMember, setDrawerMember] = useState(false)
  // 表格数据总数
  const [total, setTotal] = useState()
  // 分页配置
  const [pagination, setPagination] = useState({})
  const columns = [
    {
      title: '公共邮件名称',
      dataIndex: 'name',
    },
    {
      title: '公共邮箱地址',
      dataIndex: 'email',
      width: 340,
      render: (_, record) =>
        record.displayAlias ? record.displayAlias : record.email,
    },
    {
      title: '所属部门',
      dataIndex: 'departmentName',
    },
    {
      title: '所属企业',
      dataIndex: 'companyName',
    },
    {
      title: '状态',
      dataIndex: 'activeStatus',
      width: 100,
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
      title: '操作',
      dataIndex: '',
      width: 240,
      key: 'x',
      render: (_, record) => {
        return (
          <div>
            <a
              onClick={() => {
                editRelateMailFn(record)
              }}
              style={{ marginRight: 8 }}
            >
              编辑
            </a>
            <a
              onClick={() => {
                modifyPasswordFn(record)
              }}
              style={{ marginRight: 8 }}
            >
              修改密码
            </a>
            <a
              onClick={() => {
                relatedMailFn(record)
              }}
              style={{ marginRight: 8 }}
            >
              关联邮箱
            </a>
            <Popconfirm
              title="确认要删除吗?"
              onConfirm={() => deleteFn(record)}
            >
              <a>删除</a>
            </Popconfirm>
            {/* <a onClick={()=>{deleteFn(record)}}>删除</a> */}
          </div>
        )
      },
    },
  ]
  const rowSelection = {
    type: 'checkbox',
    onChange: (selectedRowKeys, selectedRows) => {
      const arrKeys = selectedRows.map((item) => {
        return item.key
      })
      setSelectedRowKeys(arrKeys)
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  }
  useEffect(() => {
    selectPublicEmailByParamFn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // 查询公共邮箱
  const selectPublicEmailByParamFn = (params = {}) => {
    if (identity != '1') {
      params.orgParentId = companyId
    }
    if (!params.pageSize) {
      params.pageSize = 10
    }
		params = {...params, ...searchData}
    selectPublicEmailByParam(params).then((res) => {
      setTotal(res.total)
      const arr = res.data.map((item) => {
        item.key = item.email
        return item
      })
      setData(arr)
    })
  }
  // 分页改变触发方法
  const pageChange = (page, pageSize) => {
    setPagination({
      pageIndex: page - 1,
      pageSize,
    })
    // const data = Object.assign(defaultPagination,pagination,{page, pageSize,total})
    selectPublicEmailByParamFn({
      pageIndex: page - 1,
      pageSize,
    })
  }
	// 查询参数
	const [searchData, setSearchData] = useState({})
  // 查询方法
  const searchFormFn = (values) => {
    setPagination({
      current: 1,
      pageIndex: 1,
      pageSize: 10,
    })
    const data = {
      ...values,
    }
		setSearchData(values)
    selectPublicEmailByParamFn(data)
  }
  const config = { title: '新建公共邮箱' }
  // 创建公共邮箱
  const createRelatedMailFn = () => {
    setCurrent({})
    createRelateRef.current.resetForm()
    childRef.current.showDrawer({ title: '新建公共邮箱' })
  }
  const createRelateMail = (params, isEditMember) => {
    saveEmail(params).then((res) => {
      message.success('创建成功')
      childRef.current.closeDrawer()
      selectPublicEmailByParamFn()
      setSelectedRowKeys([])
      if (isEditMember) {
        relatedMailFn(params)
      }
    })
  }
  // 公共邮箱关联
  const relatedMailFn = (record) => {
    setCurrent(record)
    childRefMember.current.showDrawer()
  }
  // 编辑
  const editRelateMailFn = (record) => {
    setCurrent(record)
    childRef.current.showDrawer({ title: '编辑公共邮箱' })
  }
  const editRelateMail = (params, isEditMember) => {
    updateAccountInfo(params).then((res) => {
      message.success('更新成功')
      childRef.current.closeDrawer()
      selectPublicEmailByParamFn()
      if (isEditMember) {
        relatedMailFn(params)
      }
    })
  }
  const closeDrawerCreateRelatedMail = () => {
    childRef.current.closeDrawer()
  }
  // 修改密码
  const modifyPasswordFn = (record) => {
    setCurrent(record)
    CDrawerModifyForm.current.showDrawer()
  }
  const updateAccountPasswordFn = (params) => {
    const data = {
      email: params.email,
      password: params.password,
    }
    updateAccountPassword(data).then((res) => {
      message.success('更新成功')
      CDrawerModifyForm.current.closeDrawer()
    })
  }
  const closeDrawerModifyForm = () => {
    CDrawerModifyForm.current.closeDrawer()
  }
  // 单个删除邮箱
  const deleteFn = (record) => {
    const params = {
      emailsStr: record.email,
    }
    deleteEmails(params).then((res) => {
      setData(
        data.filter((ele) => {
          return ele.email !== record.email
        }),
      )
      message.success('删除成功')
    })
  }
  // 冻结
  const disableFn = () => {
    const data = {
      emails: selectedRowKeys,
      activeStatus: 1,
    }
    batchUpdateEmail(data).then((res) => {
      message.success('更新成功')
      selectPublicEmailByParamFn()
    })
  }
  // 启用
  const enableFn = () => {
    const data = {
      emails: selectedRowKeys,
      activeStatus: 0,
    }
    batchUpdateEmail(data).then((res) => {
      message.success('更新成功')
      selectPublicEmailByParamFn()
    })
  }
  // 批量删除邮箱
  const batchDeleteFn = () => {
    const params = {
      emailsStr: selectedRowKeys.join(','),
    }
    deleteEmails(params).then((res) => {
      setData(
        data.filter((ele) => {
          return !selectedRowKeys.includes(ele.email)
        }),
      )
      message.success('删除成功')
    })
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
              icon={<PlusOutlined />}
              style={{ marginRight: 10 }}
              onClick={createRelatedMailFn}
            >
              新建公共邮箱
            </Button>
          </div>
          {data.length === 0 ? (
            ''
          ) : (
            <div className="right">
              <Popconfirm title="确认要冻结吗?" onConfirm={disableFn}>
                <Button
                  icon={<StopOutlined />}
                  disabled={selectedRowKeys.length === 0}
                  style={{ marginRight: 10 }}
                >
                  冻结公共邮箱
                </Button>
              </Popconfirm>
              <Popconfirm title="确认要启用吗?" onConfirm={enableFn}>
                <Button
                  icon={<CheckCircleOutlined />}
                  disabled={selectedRowKeys.length === 0}
                  style={{ marginRight: 10 }}
                >
                  启用公共邮箱
                </Button>
              </Popconfirm>
              <Popconfirm title="确认要删除吗?" onConfirm={batchDeleteFn}>
                <Button
                  icon={<DeleteOutlined />}
                  disabled={selectedRowKeys.length === 0}
                >
                  批量删除邮箱
                </Button>
              </Popconfirm>
            </div>
          )}
        </BtnBox>
        <Divider />
        {data.length === 0 ? (
          <CEmpty />
        ) : (
          <TableContext
            columns={columns}
            data={data}
            rowSelection={rowSelection}
            pagination={{ ...pagination, total, onChange: pageChange }}
          >
            <CTable />
          </TableContext>
        )}
        <CDrawer cRef={childRef} config={config}>
          <CreateRelatedMail
            cRef={createRelateRef}
            current={current}
            fn={{
              create: createRelateMail,
              edit: editRelateMail,
              closeDrawer: closeDrawerCreateRelatedMail,
            }}
            current={current}
          />
        </CDrawer>
      </div>
      <CDrawer
        cRef={childRefMember}
        config={{ title: '公共邮件成员管理' }}
        isShow={drawerMember}
      >
        <Member current={current} drawerMember={drawerMember} />
      </CDrawer>
      <CDrawer cRef={CDrawerModifyForm} config={{ title: '修改密码' }}>
        <ModifyForm
          current={current}
          fn={{
            modalSubmit: updateAccountPasswordFn,
            closeDrawer: closeDrawerModifyForm,
          }}
        />
      </CDrawer>
    </Box>
  )
}
export default PublicMailboxConfig
