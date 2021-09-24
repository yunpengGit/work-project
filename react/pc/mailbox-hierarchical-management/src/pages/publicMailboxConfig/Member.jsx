import { useState, useContext, useCallback, useEffect, useRef } from 'react'
import { Divider, Form, Row, Col, Input, Button, message, Spin } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import CTable from '../../components/CTable'
import { TableContext } from '../../components/CTable/context'
import CModal from '../../components/CModal'
import CTranfer from '../../components/CTranfer'
import CEmpty from '../../components/CEmpty'
import { BtnBox } from './style'
import Loading from '../../components/Loading'
import {
  getAllEmail,
  selectAllEmailByParam,
  saveRelations,
  getMailLoginAccount,
  getAllMailLoginAccount,
  deleteMailLoginAccounts,
} from './service'
import drawerContext from '../../components/CDrawer/context'
import { localStorageGet } from './../../utils/localStorageFn'
const Member = (props) => {
  const isShow = useContext(drawerContext)
  const userInfo = JSON.parse(localStorageGet('loginInfo'))
  const childRef = useRef()
  const tranferRef = useRef()
  const { current, drawerMember } = props
  const { email, name, displayAlias } = current
  // 当前公共邮箱关联邮箱分页查询
  const [data, setData] = useState([])
  // 当前公共邮箱关联邮箱所有查询
  const [relatedData, setRelatedData] = useState([])
  // 当前企业所有员工邮箱添加关联关系处理后数据
  const [tranferData, setTranferData] = useState([])
  // 当前table选中成员key
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  // 表格数据总数
  const [total, setTotal] = useState()
  // 分页配置
  const [pagination, setPagination] = useState({})
  const columns = [
    {
      title: '员工姓名',
      dataIndex: 'allowLoginUserName',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '邮箱地址',
      dataIndex: 'allowLoginAccount',
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'x',
      render: (_, record) => {
        return (
          <div>
            <a
              onClick={() => {
                deleteMailLoginAccountsRecordFn(record)
              }}
            >
              移出公共邮箱
            </a>
          </div>
        )
      },
    },
  ]
  const transferConfig = {
    relatedId: 'mailLoginAccountsId',
    leftTableColumns: [
      {
        dataIndex: 'userName',
        title: '员工姓名',
      },
      {
        dataIndex: 'email',
        title: '邮箱',
      },
    ],
    rightTableColumns: [
      {
        dataIndex: 'userName',
        title: '员工姓名',
      },
    ],
  }
  const rowSelection = {
    type: 'checkbox',
    onChange: (selectedRowKeys, selectedRows) => {
      const arrKeys = selectedRows.map((item) => {
        return item.mailLoginAccountsId
      })
      setSelectedRowKeys(arrKeys)
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  }
  useEffect(() => {
    getMailLoginAccountFn()
		// eslint-disable-next-line react-hooks/exhaustive-deps
  },[email])
  // 已关联邮箱分页查询
  const getMailLoginAccountFn = (params) => {
    if (!isShow) {
      return
    }
    let data = {
      email: displayAlias?displayAlias : email,
    }
		if(params){
			const {pageIndex, pageSize} = params
			data = {
				...data,
				...params
			}
		}
    getMailLoginAccount(data).then((res) => {
      setTotal(res.total)
      const arr = res.data.map((item) => {
        item.key = item.allowLoginAccount
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
    getMailLoginAccountFn({
      email,
      pageIndex: page - 1,
      pageSize,
    })
  }
  // 查询
  const onFinish = (values) => {
    setPagination({
      current: 1,
      pageIndex: 1,
      pageSize: 10,
    })
    const data = {
			...values
    }
    getMailLoginAccountFn(data)
  }
  // 从通讯录中添加
  const addFromAddressBook = () => {
    initTranfer()
    childRef.current.showModal()
  }
  // 已关联邮箱查询所有
  const getAllMailLoginAccountFn = () => {
    const data = {
      email,
    }
    getAllMailLoginAccount(data).then(async (res) => {
      const arr = res.data.map((item) => {
        item.key = item.allowLoginUserId
        return item
      })
      await setRelatedData(arr)
      setLoading(false)
    })
  }
  // 获取所有员工邮箱地址
  const getAllEmailFn = (params) => {
    // getAllEmail(params).then((res) => {
    selectAllEmailByParam(params).then((res) => {
      const arr = res.data.map((item) => {
        item.key = item.outerStaffId
        item.title = item.userName
        return item
      })
      setTranferData(arr)
    })
  }
  // 初始化穿梭框
  const initTranfer = () => {
    getAllEmailFn({ orgParentId: userInfo.companyId })
    getAllMailLoginAccountFn()
  }
  // 添加邮件组成员
  const saveRelationsFn = async () => {
    const data = await tranferRef.current.selectKeys()
    if (data.length === 0) {
      message.warning('请将左侧数据添加到右边提交!!')
      return
    }
    const obj = {
      email,
      name,
      mailLoginAccountBOs: data.map((item) => {
        const obj = {
          allowLoginAccount: item.displayAlias ? item.displayAlias : item.email,
          allowLoginUserName: item.userName,
          allowLoginUserId: item.outerStaffId,
        }
        // console.log(item)
        item.allowLoginAccount = item.email
        item.allowLoginUserName = item.userName
        item.allowLoginUserId = item.userId
        return obj
      }),
    }
    saveRelations(obj).then((res) => {
      getMailLoginAccountFn()
      childRef.current.closeModal()
    })
  }
  // 删除公共邮箱成员
  const deleteMailLoginAccountsFn = (params) => {
    deleteMailLoginAccounts(params).then((res) => {
      getMailLoginAccountFn()
    })
  }
  // 批量删除公共邮箱成员
  const batchDeleteMailLoginAccountsRecord = (record) => {
    const obj = {
      mailLoginAccountsIds: selectedRowKeys.join(','),
    }
    deleteMailLoginAccountsFn(obj)
  }
  // 单个删除公共邮箱成员
  const deleteMailLoginAccountsRecordFn = (record) => {
    const obj = {
      mailLoginAccountsIds: record.mailLoginAccountsId,
    }
    deleteMailLoginAccountsFn(obj)
  }
  const memberTitle = {
    div: {
      position: 'relative',
      paddingLeft: 14,
      marginBottom: 24,
      fontSize: 18,
      fontWeight: 'bold',
      color: '#292C33',
      lineHeight: '18px',
    },
    span: {
      position: 'absolute',
      left: 0,
      content: '',
      display: 'inline-block',
      width: 4,
      height: '18px',
      background: '#FFD633',
    },
  }
  const [loading, setLoading] = useState(true)
  return (
    <div>
      <div style={memberTitle.div}>
        <span style={memberTitle.span}></span>
        {name}
        {'<' + email + '>'}
      </div>
      <Form className="ant-advanced-search-form" onFinish={onFinish}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="allowLoginAccount" label="成员邮箱地址">
              <Input placeholder="请输入邮箱地址" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: 8 }}
              >
                查询
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Divider />
      <BtnBox>
        <div className="left">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={addFromAddressBook}
          >
            从通讯录添加
          </Button>
        </div>
        <div className="right">
          {data.length === 0 ? (
            ''
          ) : (
            <Button
              icon={<DeleteOutlined />}
              onClick={batchDeleteMailLoginAccountsRecord}
              disabled={selectedRowKeys.length === 0}
            >
              移除选中成员
            </Button>
          )}
        </div>
      </BtnBox>
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
      <CModal cRef={childRef} submit={saveRelationsFn} config={{
    title: '选择邮件组成员',
  }}>
        <Spin indicator={<Loading />} spinning={loading}>
          <CTranfer
            cRef={tranferRef}
            tranferData={tranferData}
            selectData={relatedData}
            transferConfig={transferConfig}
          />
        </Spin>
      </CModal>
    </div>
  )
}
export default Member
