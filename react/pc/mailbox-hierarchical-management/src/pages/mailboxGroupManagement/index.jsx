import {useState, useEffect, useRef} from 'react'
import { message, Button, Divider, Popconfirm } from 'antd';
import { PlusOutlined, StopOutlined, CheckCircleOutlined, DeleteOutlined  } from '@ant-design/icons';
import CTable from '../../components/CTable'
import { TableContext } from '../../components/CTable/context'
import CDrawer from '../../components/CDrawer'
import CEmpty from '../../components/CEmpty'
import SearchForm from './SearchForm'
import Member from './Member'
import CreateMailGroup from './CreateMailGroup'
import {Box, BtnBox} from './style'
import {saveMailGroup, updateMailGroup, selectEmailGroupByParam, batchUpdateMailGroup, deleteMailGroup} from './../../api/mailboxGroupManagement'
import {localStorageGet} from './../../utils/localStorageFn'
function MailboxGroupManagement () {
  const userInfo = JSON.parse(localStorageGet("loginInfo"))
  const {companyId, identity} = userInfo
  const childRef = useRef();
  const createGroupRef = useRef();
  const [data, setData] = useState([])
  // 邮箱组选中项
  const [selectedRows, setSelectedRows] = useState([])
  // 动态处理邮件组新增和编辑提交方法
	const [current, setCurrent] = useState({})
	// 表格数据总数
  const [total, setTotal] = useState();
  // 分页配置
  const [pagination, setPagination] = useState({});
  useEffect(() => {
		getSelectEmailGroupByParam()
		// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const config ={
		title: '新建邮件组',
		type: 'create'
  }
  const childRefMember = useRef();
  const configMember ={
    title: '邮件组成员管理'
  }
  const columns = [
    {
      title: '邮件组名称',
      dataIndex: 'name',
    },
    {
      title: '邮箱组地址',
      dataIndex: 'address'
    },
    {
      title: '成员数量',
			dataIndex: 'memberNumber',
			render: (_, record) =>{
				if (record.memberNumber) {
					return record.memberNumber
				} else {
					return 0
				}
			}
		},
		{
			title: '邮件组权限',
			dataIndex: 'authority',
			render: (_, record) =>{
				switch (record.authority) {
					case '0':
						return '允许所有帐号（域内外均可）向邮件组发信'
					case '1':
						return '允许所有同域帐号向邮件组发信'
					case '2':
						return '只允许成员向邮件组发信'
				}
			}
		},
    {
      title: '状态',
      dataIndex: 'status',
      render: text => {
        if (text === 1) {
          return <span style={{
            color: 'red'
          }}>冻结</span>
        } else {
          return <span>正常</span>
        }
      },
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'x',
      render: (_, record) =>{
          return (
            <div>
              <a onClick={() => showDrawerEdit(record)} style={{marginRight: 16}}>编辑</a>
              <a onClick={() => showDrawerMember(record)} style={{marginRight: 16}}>成员管理</a>
							<Popconfirm title="确认要删除吗?" onConfirm={() => deleteFn(record)}>
								<a>删除</a>
							</Popconfirm>
            </div>
          )
        }
      },
  ];
  const rowSelection = {
    type: 'checkbox',
    onChange: (selectedRowKeys, selectedRows) => {
      const kyes = selectedRows.map((item) => {
        return item.key
      })
      setSelectedRows(kyes)
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };
  // 分页改变触发方法
  const pageChange = (page, pageSize) => {
    setPagination({
      pageIndex: page - 1,
      pageSize
    })
    // const data = Object.assign(defaultPagination,pagination,{page, pageSize,total})
    getSelectEmailGroupByParam({
      pageIndex: page - 1,
      pageSize
    })
  }
	// 查询参数
	const [searchData, setSearchData] = useState({})
  // 查询方法
  const searchFormFn = params => {
		setPagination({
			current: 1,
      pageIndex: 1,
      pageSize: 10
    })
		setSearchData(params)
    getSelectEmailGroupByParam(params)
  }
  // 通过参数查询邮件组列表
  const getSelectEmailGroupByParam = (params = {}) => {
		if (identity != '1') {
			params.orgParentId = companyId
		}
		params = {...params, ...searchData}
    selectEmailGroupByParam(params).then((res) => {
			setTotal(res.total)
      const arr = res.data.map((item) => {
        item.key = item.address
        return item
      })
      setData(arr)
    })
  }
  // 批量处理状态
  const batchUpdateMailGroupFN = (bool) => {
    const data = {
      addressList: selectedRows,
      status: bool
    }
    batchUpdateMailGroup(data).then((res) => {
      getSelectEmailGroupByParam()
    })
  }
  // 禁用邮箱组
  const disableMailGroup = () => {
    batchUpdateMailGroupFN(1)
  }
  // 启用邮箱组
  const enableMailGroup = () => {
    batchUpdateMailGroupFN(0)
  }
  // 批量删除邮箱组
  const deleteFn = (record) => {
    const params = {
      addressStr: record.address
    }
    deleteMailGroup(params).then((res) => {
      message.success("删除成功")
      const arr = data.filter((item) => {
        return !selectedRows.includes(item.key)
      })
			setData(arr)
			getSelectEmailGroupByParam()
    })
  }
  // 批量删除邮箱组
  const batchDeleteFn = () => {
    const params = {
      addressStr: selectedRows.join(',')
    }
    deleteMailGroup(params).then((res) => {
      message.success("删除成功")
      const arr = data.filter((item) => {
        return !selectedRows.includes(item.key)
      })
			setData(arr)
			getSelectEmailGroupByParam()
    })
  }
  // 创建邮件组
  const createMailGroup = (params) => {
    saveMailGroup(params).then((res) => {
      getSelectEmailGroupByParam()
			childRef.current.closeDrawer();
			if (params.isEditMember) {
				showDrawerMember(params)
			}
    })
  }
  const createMailGroupFn = () => {
    setCurrent({userName: userInfo.userName})
		childRef.current.showDrawer({title: '新建邮件组', type: 'create'});
		createGroupRef.current.resetForm()
  }
  // 编辑邮件组提交
  const editMailGroup = (params) => {
    updateMailGroup(params).then((res) => {
      getSelectEmailGroupByParam()
			childRef.current.closeDrawer();
			if (params.isEditMember) {
				showDrawerMember(params)
			}
    })
  }
  const showDrawerEdit = async (record) => {
    if (record.status === 1) {
      message.warning("当前账号已冻结,无法操作!!!")
      return
    }
    setCurrent(record)
		childRef.current.showDrawer({title: '邮件组编辑', type: 'edit'});
	}
	// 关闭 CDrawer
	const closeCDrawer = () => {
		childRef.current.closeDrawer();
	}
  // 管理邮件组成员
  const showDrawerMember = (record) => {
    if (record.status === 1) {
      message.warning("当前账号已禁用,无法操作!!!")
      return
    }
    setCurrent(record)
    childRefMember.current.showDrawer();
  }
  return (
    <Box>
      <div className="form-box">
        <SearchForm fn={searchFormFn}/>
      </div>
      <div className="table-box">
        <BtnBox>
          <div className="left">
            <Button type="primary" icon={<PlusOutlined />} onClick={createMailGroupFn}>新建邮件组</Button>
          </div>
          {data.length === 0?'':<div className="right">
						<Popconfirm title="确认要冻结吗?" onConfirm={disableMailGroup}>
							<Button icon={<StopOutlined />} disabled={selectedRows.length === 0} style={{marginRight: 10}}>冻结邮件组</Button>
						</Popconfirm>
						<Popconfirm title="确认要启用吗?" onConfirm={enableMailGroup}>
						<Button icon={<CheckCircleOutlined  />} disabled={selectedRows.length === 0} style={{marginRight: 10}} >启用邮件组</Button>
						</Popconfirm>
						<Popconfirm title="确认要删除吗?" onConfirm={batchDeleteFn}>
							<Button icon={<DeleteOutlined  />} disabled={selectedRows.length === 0}>删除邮件组</Button>
						</Popconfirm>
          </div>}
        </BtnBox>
        <Divider/>
        {data.length === 0?<CEmpty/>:<TableContext columns={columns} data={data} rowSelection={rowSelection} pagination={{...pagination, total, onChange: pageChange}}>
          <CTable/>
        </TableContext>
        }
        <CDrawer cRef={childRef} config={config}>
          <CreateMailGroup cRef={createGroupRef} fn={{createMailGroup,editMailGroup, closeCDrawer}} current = {current}/>
        </CDrawer>
        <CDrawer cRef={childRefMember} config={configMember}>
          <Member current = {current}/>
        </CDrawer>
      </div>
    </Box>
  )
}
export default MailboxGroupManagement
