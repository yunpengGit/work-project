import { useState, useContext, useEffect, useRef } from 'react'
import { Divider, Form, Row, Col, Input, Button, Spin } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import CTable from '../../components/CTable'
import { TableContext } from '../../components/CTable/context'
import CModal from '../../components/CModal'
import CTranfer from '../../components/CTranfer'
import CEmpty from '../../components/CEmpty'
import { BtnBox } from './style'
import Loading from '../../components/Loading'
import drawerContext from '../../components/CDrawer/context'
import {
  getEmailGroupMember,
  saveMailGroupMembers,
  getAllEmail,
  selectAllEmailByParam,
  getAllEmailGroupMember,
  deleteMailGroupMembers,
} from '../../api/mailboxGroupManagement'
import { localStorageGet } from './../../utils/localStorageFn'
const Member = (props) => {
  const isShow = useContext(drawerContext)
  const userInfo = JSON.parse(localStorageGet('loginInfo'))
  const childRef = useRef()
  const tranferRef = useRef()
  const { current } = props
  const { address } = current
  // 当前邮箱组成员分页
  const [data, setData] = useState([])
  // 当前邮箱组所有成员
  const [relatedData, setRelatedData] = useState([])
  // 当前企业所有员工邮箱添加邮件组关系处理后数据
  const [tranferData, setTranferData] = useState([])
  // 当前table选中成员key
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  // 表格数据总数
  const [total, setTotal] = useState()
  // 分页配置
  const [pagination, setPagination] = useState()
  useEffect(() => {
    if (isShow) {
      getEmailGroupMemberFn({ address })
    }
  }, [isShow, address])
  const columns = [
    {
      title: '员工姓名',
      dataIndex: 'userName',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '邮箱地址',
      dataIndex: 'memberAddress',
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
                deleteMailGroupMembersFn(record)
              }}
            >
              移出邮件组
            </a>
          </div>
        )
      },
    },
  ]
  const transferConfig = {
    relatedId: 'mailGroupMemberId',
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
        return item.key
      })
      setSelectedRowKeys(arrKeys)
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  }
  const modalConfig = {
    title: '选择邮件组成员',
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
  // 分页改变触发方法
  const pageChange = (page, pageSize) => {
    setPagination({
      pageIndex: page - 1,
      pageSize,
    })
    getEmailGroupMemberFn({
      address: current.address,
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
    const { memberAddress } = values
    const data = {
      memberAddress,
      address: current.address,
    }
    getEmailGroupMemberFn(data)
  }
  // 从通讯录中添加
  const addFromAddressBook = () => {
    initTranfer()
    childRef.current.showModal()
  }
  // 获取当前邮件组成员分页
  const getEmailGroupMemberFn = (params) => {
    getEmailGroupMember(params).then((res) => {
      setTotal(res.total)
      const obj = res.data.map((item) => {
        item.key = item.mailGroupMemberId
        return item
      })
      setData(obj)
    })
  }
  // 获取当前邮件组所有成员
  const getAllEmailGroupMemberFn = () => {
    const data = {
      address: current.address,
    }
    getAllEmailGroupMember(data).then(async (res) => {
      const obj = res.data.map((item) => {
        item.key = item.userId
        return item
      })
      await setRelatedData(obj)
      setLoading(false)
    })
  }
  // 获取所有员工邮箱地址
  const getAllEmailFn = (params) => {
    selectAllEmailByParam(params).then((res) => {
      const arr = res.data.map((item) => {
        item.key = item.outerStaffId
        item.title = item.userName
        return item
      })
      setTranferData(arr)
    })
  }
  // 初始化tranfer
  const initTranfer = async () => {
    await getAllEmailFn({ orgParentId: userInfo.companyId })
    getAllEmailGroupMemberFn()
  }
  // 添加邮件组成员
  const saveMailGroupMembersFn = () => {
    const data = tranferRef.current.selectKeys()
    const obj = {
      mailGroupId: current.mailGroupId,
      address: current.address,
      mailGroupMemberBOs: data.map((item) => {
        item.userId = item.outerStaffId
        item.memberAddress = item.displayAlias
        return item
      }),
    }
    saveMailGroupMembers(obj).then((res) => {
      getEmailGroupMemberFn({ address: current.address })
      childRef.current.closeModal()
    })
  }
  // 批量删除邮件组成员
  const batchDeleteMailGroupMembersFn = () => {
    let dataParams = {
      mailGroupMemberIds: selectedRowKeys.join(','),
    }
    deleteMailGroupMembers(dataParams).then(() => {
      const filterData = data.filter((item) => {
        return !selectedRowKeys.includes(item.key)
      })
      setData(filterData)
    })
  }
  // 单个删除邮件组成员
  const deleteMailGroupMembersFn = (params) => {
    let dataParams = {
      mailGroupMemberIds: params.key,
    }
    deleteMailGroupMembers(dataParams).then(() => {
      const filterData = data.filter((item) => {
        return item.key !== params.key
      })
      setData(filterData)
    })
  }
  const [loading, setLoading] = useState(true)
  return (
    <div>
      <div style={memberTitle.div}>
        <span style={memberTitle.span}></span>
        {current.name}
        {'<' + current.address + '>'}
      </div>
      <Form className="ant-advanced-search-form" onFinish={onFinish}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="memberAddress" label="查询组成员">
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
              onClick={batchDeleteMailGroupMembersFn}
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
      <CModal
        cRef={childRef}
        submit={saveMailGroupMembersFn}
        config={modalConfig}
      >
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
