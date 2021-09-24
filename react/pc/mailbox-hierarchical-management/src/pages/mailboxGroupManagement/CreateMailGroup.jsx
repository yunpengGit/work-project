import React, {useState, useEffect, useRef, useImperativeHandle} from 'react'
import { Form, Input, InputNumber, Button, Select, Radio, Row, Col, message} from 'antd';
import axios from 'axios'
import CModal from './../../components/CModal'
import CTree from '../../components/CTree'
import TreeContext from '../../components/CTree/context'
import { CreateMailGroupPage } from './style'
import { orgList } from './../../api/common'
import {localStorageGet} from './../../utils/localStorageFn'
const { Option } = Select;
const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 4,
    span: 20,
  },
};
const CreateMailGroup = props => {
	const userInfo = JSON.parse(localStorageGet("loginInfo"))
	const {companyName, companyId} = userInfo
	const formRef = React.createRef();
	const modalTree = useRef();
  const {fn, current} = props;
	const {createMailGroup,editMailGroup,closeCDrawer} = fn
	 // 组织机构树
	const [treeData, setTreeData] = useState([]);
	const [selectData, setSelectData] = useState({});
	// 邮件组类型禁用
	const [typeDisable, setTypeDisable] = useState(false);
	// 是否保存后操作成员
	useImperativeHandle(props.cRef, () => ({
    resetForm: () => {
      onReset()
    },
  }))
	// modal配置参数
	const modalConfig = {
    title: '选择部门'
	}
  const onFinish = (values, bool) => {
		const isEditMember = bool
    values.address = values.emailPrefix +'@' + values.emailSuffix
		delete values.emailSuffix
		values.mailGroupId = current.mailGroupId
    if(current.name) {
      editMailGroup({...values, isEditMember});
    } else {
      createMailGroup({...values, isEditMember})
    }
	};
	const saveAndAddMember = async () => {
		const values = await formRef.current.validateFields();
		onFinish(values, true)
	}
  const onReset = () => {
		setTypeDisable(false)
		setSelectData({})
    formRef.current.resetFields();
  };
	const [emailSuffix, setEmailSuffix] = useState('avicnet.cn')
	useEffect(() => {
		setEmailSuffix(process.env.REACT_APP_EMAIL_SUFFIX)
		if(current.name) {
			onFill(current)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[current])
	const onFill = (params) => {
		if(params.address) {
			const arr = params.address.split('@')
			params.emailPrefix = arr[0]
			params.emailSuffix = arr[1]
		}
		setSelectData({
			title: params.departmentName,
			key: params.departmentId,
		})
		formRef.current.setFieldsValue(params);
	};
  const onCancel = () => {
		// onReset()
    closeCDrawer()
	};
	// 默认状态成员数量 以及按钮控制
	const [memberDefaultValue, setMemberDefaultValue] = useState(100)
	// 获取公司组织架构
	const getOrgList = () => {
		const data = {
			id: companyId
		}
		orgList(data).then((res) => {
			let arr = []
			arr = res.data.map((item) => {
        return {
          title: item.orgName,
          key: item.orgId,
        }
      })
			setTreeData([{
				title: companyName,
				key: companyId,
				children: arr,
			}])
		})
	}
	const getOrgChildrenList = async (params) => {
    const res = await axios({
      url: `/api/org/${params.id}/orgList`,
      method: 'get',
      headers:{
        Authorization: JSON.parse(localStorageGet("loginInfo")).token
      }
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
	// form 默认数据
  const [initFormData, setInitFormData] = useState({
		// type: "0",
		maxAccountNum: memberDefaultValue,
		userName: `${userInfo.userName}<${userInfo.email}>`,
	});
	// 组织机构选中数据更新
  const selectDataTree = (params) => {
		setSelectData(params)
		formRef.current.setFieldsValue({
			...initFormData,
			departmentId: params.key
		});
	}
	// 展示机构数
	const showOrgTree = async () => {
		await getOrgList()
		modalTree.current.showModal()
	}
	// modal确认按钮
	const modalSubmit = () => [
		modalTree.current.closeModal()
	]
	const onChange =(value) => {
		if(value > 5000) {
			message.warning('成员数量最多不能超过5000人!!')
		}
	}
  return (
    <CreateMailGroupPage>
      <Form
				{...layout}
				ref={formRef}
				onFinish={onFinish}
				initialValues={initFormData}
			>
				{/* <Form.Item
					name="type"
					label="邮件组类型"
				>
					<Radio.Group disabled={typeDisable}>
            <Radio value="0">普通邮件组</Radio>
            <Radio value="1">动态邮件组</Radio>
          </Radio.Group>
				</Form.Item>
        <Form.Item
          name="mailGroupId"
          hidden = {true}
        >
          <Input/>
        </Form.Item> */}
				<Form.Item
					noStyle
				>
					<Row>
            <Col span={12} className="hidden-input">
							<Form.Item
								name="departmentId"
								label="所属部门"
								rules={[
									{
										required: true,
									},
								]}
								labelCol= {{span: 8}}
								wrapperCol= {{span: 9}}
							>
								<Input value={selectData.key}/>
							</Form.Item>
						</Col>
						<Col span={12} pull={8} style={{paddingTop: 5,marginLeft: -8}}>
							{selectData.title?<span style={{paddingLeft: 8}}>{selectData.title}</span>:''}
							<a onClick={showOrgTree} style={{paddingLeft: 8}}>通过组织架构选择</a>
						</Col>
					</Row>
        </Form.Item>
        <Form.Item
          name="name"
          label="邮件组名称"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="请输入邮件组名称"/>
        </Form.Item>
        {/* <EmailSuffixInput/> */}
        <Form.Item noStyle >
          <Row>
            <Col span={18}>
              <Form.Item
								style={{marginLeft: -14}}
								labelCol={{span: 6}}
								label="邮件组地址"
                name="emailPrefix"
                rules={[
                  {
                    required: true,
                    pattern: /^[0-9a-zA-Z]*$/,
                    max: 10,
                    message: "请输入字母、数字或二者组合，例如：public001"
                  },
                ]}
              >
                <Input style={{MarginLeft: 12}} disabled={current.name} placeholder="请输入字母、数字或二者组合，例如：public001"/>
              </Form.Item>
            </Col>
            <Col span={1}>
              <span style={{display: "flex",justifyContent: "center",marginTop: 5}}>@</span>
            </Col>
            <Col span={5}>
              <Form.Item
                noStyle
                name = "emailSuffix"
                initialValue={emailSuffix}
              >
                <Select disabled={current.name} >
                  <Option value={emailSuffix}>{emailSuffix}</Option>
                </Select>
              </Form.Item>
            </Col>
            </Row>
        </Form.Item>
        <Form.Item
          name="userName"
          label="申请人"
        >
          <Input disabled/>
        </Form.Item>
        <Form.Item
          name="maxAccountNum"
          label="成员数量"
        >
					<InputNumber min={current.memberNumber} max={5000} step={10} style={{marginRight: 10}}/>
					{/* {memberConfig.minBtn?<Button type="primary" style={{marginRight: 10}} onClick={minInputNumber}>最小</Button>:""}
					{memberConfig.maxBtn?<Button type="primary" style={{marginRight: 10}} onClick={maxInputNumber}>最大</Button>:""} */}
        </Form.Item>
        <Form.Item
          name="authority"
          label="邮件组权限"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            placeholder="请选择"
            allowClear
          >
            <Option value="0">允许所有帐号（域内外均可）向邮件组发信</Option>
            <Option value="1">允许所有同域帐号向邮件组发信</Option>
            <Option value="2">只允许成员向邮件组发信</Option>
            {/* <Option value="3">所有邮件组成员</Option>
            <Option value="4">除了白名单列表成员，其他都不允许</Option> */}
          </Select>
        </Form.Item>
        <Form.Item
          name="newMemberNotice"
          label="自动发信通知"
        >
          <Radio.Group>
            <Radio value="0">邮件组添加新成员后不通知</Radio>
            <Radio value="1">邮件组添加新成员后通知</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" style={{marginRight: 10}}>
            保存
          </Button>
          <Button htmlType="button" style={{marginRight: 10}} onClick={saveAndAddMember}>
            保存并管理成员
          </Button>
          <Button type="link" htmlType="button" onClick={onCancel}>
            取消
          </Button>
        </Form.Item>
      </Form>
			<CModal cRef={modalTree} submit={modalSubmit} config={modalConfig}>
				<TreeContext.Provider value={{treeData}}>
					<CTree parentFn = {{getOrgChildrenList, selectDataTree}}/>
				</TreeContext.Provider>
			</CModal>
      </CreateMailGroupPage>
  );
}
export default CreateMailGroup
