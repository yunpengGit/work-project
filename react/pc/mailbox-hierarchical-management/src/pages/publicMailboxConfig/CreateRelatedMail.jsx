import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useImperativeHandle,
} from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Input, Button, Select, Radio, Row, Col, Checkbox } from 'antd'
import axios from 'axios'
import CModal from '../../components/CModal'
import CTree from '../../components/CTree'
import TreeContext from '../../components/CTree/context'
const { Option } = Select
import { CreateMailGroupPage } from './style'
import { orgList } from '../../api/common'
import { selectCompanyDilatationConfigureByCompanyId } from './../home/service'
import { localStorageGet } from '../../utils/localStorageFn'
import { selectRootOrgList } from '../enterpriseConfiguration/service'
const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 4,
    span: 20,
  },
}
const GB = 1024 * 1024 * 1024
const MB = 1024 * 1024
const CreateMailGroup = (props) => {
  const userInfo = JSON.parse(localStorageGet('loginInfo'))
  const { companyName, companyId, identity } = userInfo
  const formRef = React.createRef()
  const { fn, current } = props
  const { create, edit, closeDrawer } = fn
  const modalTree = useRef()
  // 组织机构树
  const [treeData, setTreeData] = useState([])
  const [selectData, setSelectData] = useState({})
  // 是否扩容
  const [expansion, setExpansion] = useState(false)
  // 邮箱空间选项
  const [selectOption, setSelectOption] = useState([])
  // 附件默认大小
  const [defaultAttachmentTotalSize, setDefaultAttachmentTotalSize] = useState(
    '30',
  )
  // 默认展示密码,编辑隐藏
  const [disabledEmail, setDisabledEmail] = useState(false)
  // 默认展示密码,编辑隐藏
  const [showPassword, setShowPassword] = useState(true)
	// 扩容对应id
	const [storageType, setStorageType] = useState([])
  useImperativeHandle(props.cRef, () => ({
    resetForm: () => {
      onReset()
    },
  }))
  const [emailSuffix, setEmailSuffix] = useState('avicnet.cn')
  useEffect(() => {
		setEmailSuffix(process.env.REACT_APP_EMAIL_SUFFIX)
    if (current.name) {
      setShowPassword(false)
      onFill(current)
      selectCompanyDilatationConfigureByCompanyIdFn({
        companyId: current.companyId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current])
  // modal配置参数
  const modalConfig = {
    title: '选择部门',
  }
  // 查询扩容状态
  const selectCompanyDilatationConfigureByCompanyIdFn = (data) => {
    selectCompanyDilatationConfigureByCompanyId(data).then((res) => {
      const result = res
      if (result.data && result.data.length > 0) {
        setExpansion(true)
        const dataMap = new Map([
          [10 * GB, { text: '10G', value: '10' }],
          [20 * GB, { text: '20G', value: '20' }],
          [50 * GB, { text: '50G', value: '50' }],
          [100 * GB, { text: '100G', value: '100' }],
        ])
        let arr = []
        let storageType = []
        result.data.forEach((item) => {
          storageType.push(item)
          arr.push(dataMap.get(+item.emailDilatationStorage))
        })
        setStorageType(storageType)
        arr.sort((pro, next) => {
          return pro.value - next.value
        })
        setSelectOption(arr)
      } else {
        setExpansion(false)
      }
    })
  }
  const onReset = () => {
    setDisabledEmail(false)
    setShowPassword(true)
    setSelectData({})
    formRef.current.resetFields()
  }
  const onFill = (params) => {
    if (current && current.email) {
      setDisabledEmail(true)
      const arr = current.email.split('@')
      params.emailPrefix = arr[0]
      params.emailSuffix = arr[1]
    }
    setSelectData({
      title: params.departmentName,
      key: params.departmentId,
    })
    let checkboxGroup = []
    if (current.initPasswdChanged && current.initPasswdChanged == 0) {
      checkboxGroup.push('initPasswdChanged')
    }
    if (current.contactShare && current.contactShare == 1) {
      checkboxGroup.push('contactShare')
    }
    params.checkboxGroup = checkboxGroup
    params.storageSize = params.storageSize / GB + ''
    formRef.current.setFieldsValue(params)
  }
  // 扩容空间类型数据
  const onFinish = (values, bool) => {
    const isEditMember = bool
    values.email = values.emailPrefix + '@' + values.emailSuffix
    delete values.emailSuffix
    values.checkboxGroup&&values.checkboxGroup.forEach((element) => {
      switch (element) {
        case 'initPasswdChanged':
          values.initPasswdChanged = 0
          break
        case 'contactShare':
          values.contactShare = 1
          break
        default:
      }
    })
    delete values.emailSuffix
    delete values.checkboxGroup
		// console.log(storageType)
		const companyDilatationIdData = storageType.filter(item => GB * values.storageSize == item.emailDilatationStorage )
    const companyDilatationId = companyDilatationIdData&&companyDilatationIdData[0]&&companyDilatationIdData[0].companyDilatationId
		values = {...values,companyDilatationId}
		values.storageSize = values.storageSize * GB
    if (current.name) {
      edit(values, isEditMember)
    } else {
      create(values, isEditMember)
    }
  }
  // 保存并管理关联关系
  const saveAndAddMember = async () => {
    const values = await formRef.current.validateFields()
    onFinish(values, true)
  }
  const onCancel = () => {
    // onReset()
    closeDrawer()
  }
  // 获取公司组织架构
  const getOrgList = () => {
    const data = {
      id: companyId,
    }
    orgList(data).then((res) => {
      let arr = []
      arr = res.data.map((item) => {
        return {
          title: item.orgName,
          key: item.orgId,
        }
      })
      setTreeData([
        {
          title: companyName,
          key: companyId,
          children: arr,
        },
      ])
    })
  }
  // 超级管理员获取顶级公司列表
  const selectRootOrgListFn = () => {
    selectRootOrgList().then((res) => {
      let arr = []
      arr = res.data.map((item) => {
        return {
          title: item.orgName,
          key: item.orgId,
        }
      })
      setTreeData(arr)
    })
  }
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
        return {
          title: item.orgName,
          key: item.orgId,
        }
      })
    } else {
      message.error(res.data.message)
    }
    return arr
  }
  // 组织机构选中数据更新
  const selectDataTree = (params) => {
    setSelectData(params)
    formRef.current.setFieldsValue({
      outerDepartmentId: params.key,
    })
  }
  // 展示机构数
  const showOrgTree = async () => {
    await setTreeData([])
    // 获取公司组织架构
    if (identity != '1') {
      await getOrgList()
    } else {
      await selectRootOrgListFn()
    }
    modalTree.current.showModal()
  }
  // modal确认按钮
  const modalSubmit = () => [modalTree.current.closeModal()]
  const storageSizeChange = (value) => {
    if (value >= 10) {
      setDefaultAttachmentTotalSize('100')
    } else {
      setDefaultAttachmentTotalSize('30')
    }
  }
  return (
    <CreateMailGroupPage>
      <Form {...layout} ref={formRef} onFinish={onFinish}>
        <Form.Item
          name="name"
          label="公共邮箱名称"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="请输入公共邮箱名称" />
        </Form.Item>
        {/* <EmailSuffixInput/> */}
        <Form.Item noStyle>
          <Row>
            <Col span={18}>
              <Form.Item
                style={{ marginLeft: -14 }}
                labelCol={{ span: 6 }}
                label="公共邮箱地址"
                name="emailPrefix"
                rules={[
                  {
                    required: true,
                    pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))*$/,
                    // max: 10,
                    message: '请输入字母、数字或二者组合，例如：public001',
                  },
                ]}
              >
                <Input
                  style={{ MarginLeft: 12 }}
                  disabled={disabledEmail}
                  placeholder="请输入字母、数字或二者组合，例如：public001"
                />
              </Form.Item>
            </Col>
            <Col span={1}>
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: 5,
                }}
              >
                @
              </span>
            </Col>
            <Col span={5}>
              <Form.Item noStyle name="emailSuffix" initialValue={emailSuffix}>
                <Select disabled={disabledEmail}>
                  <Option value={emailSuffix}>{emailSuffix}</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        {showPassword ? (
          <Form.Item
            name="password"
            label="邮箱密码"
            rules={[
              {
                required: true,
                pattern: /(?!^[0-9]+$)(?!^[a-z]+$)(?!^[A-Z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{8,}$/,
                message:
                  '密码长度不能小于8位，包含以下至少两种字符：大小字母、数字和符号!',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
        ) : (
          ''
        )}
        {showPassword ? (
          <Form.Item
            name="confirm1"
            label="确认密码"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: '请再次输入邮箱登录密码',
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject('您输入的两个密码不匹配!')
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        ) : (
          ''
        )}
        <Form.Item noStyle>
          <Row>
            <Col span={12} className="hidden-input">
              <Form.Item
                name="outerDepartmentId"
                label="所属部门"
                rules={[
                  {
                    required: true,
                  },
                ]}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 9 }}
              >
                <Input value={selectData.key} />
              </Form.Item>
            </Col>
            <Col span={12} pull={8} style={{ paddingTop: 5, marginLeft: -8 }}>
              {selectData.title ? (
                <span style={{ paddingLeft: 8 }}>{selectData.title}</span>
              ) : (
                ''
              )}
              <a onClick={showOrgTree} style={{ paddingLeft: 8 }}>
                通过组织架构选择
              </a>
            </Col>
          </Row>
        </Form.Item>
        {expansion ? (
          <Form.Item label="邮箱空间" name="storageSize">
            <Select
              placeholder="请选择"
              allowClear
              onChange={storageSizeChange}
            >
              {selectOption.map((ele, index) => {
                return (
                  <Option value={ele.value} key={index}>
                    {ele.text}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
        ) : (
          <Form.Item label="邮箱空间">
            <span>{5}G</span>
          </Form.Item>
        )}
        <Form.Item label="邮箱附件">
          <span>100M</span>
          {/* <span>{defaultAttachmentTotalSize}M</span> */}
          {/* <span style={{ color: '#949494' }}>
            （邮箱空间扩容后，该账号的附件容量也将由30M自动扩大至100M）
          </span> */}
        </Form.Item>
        {/* <Form.Item name="checkboxGroup" label="其他设置">
          <Checkbox.Group>
            <Row>
              <Col span={24}>
                <Checkbox
                  value="contactShare"
                  style={{
                    lineHeight: '32px',
                  }}
                >
                  在通讯录中显示此邮箱
                </Checkbox>
                <span style={{ fontSize: 12, color: '#949494' }}>
                  可根据公共邮箱需求选择，支持多选或不做任何其他设置
                </span>
              </Col>
              <Col span={24}>
								<Checkbox
									value="initPasswdChanged"
									style={{
										lineHeight: '32px',
									}}
								>
									初次登录需要修改密码
								</Checkbox>
							</Col>
              <Col span={12}>
								<Checkbox
									value="C"
									style={{
										lineHeight: '32px',
									}}
								>
									开启POP3/SMTP服务
								</Checkbox>
							</Col>
							<Col span={12}>
								<Checkbox
									value="D"
									style={{
										lineHeight: '32px',
									}}
								>
									开启IMAP/SMTP服务
								</Checkbox>
							</Col>
            </Row>
          </Checkbox.Group>
        </Form.Item> */}
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
            保存
          </Button>
          <Button
            htmlType="button"
            style={{ marginRight: 10 }}
            onClick={saveAndAddMember}
          >
            保存并且管理关联邮箱
          </Button>
          <Button htmlType="button" onClick={onCancel}>
            取消
          </Button>
        </Form.Item>
      </Form>
      <CModal cRef={modalTree} submit={modalSubmit} config={modalConfig}>
        <TreeContext.Provider value={{ treeData }}>
          <CTree parentFn={{ getOrgChildrenList, selectDataTree }} />
        </TreeContext.Provider>
      </CModal>
    </CreateMailGroupPage>
  )
}
export default CreateMailGroup
