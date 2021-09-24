import React, { useEffect, useState } from 'react'
import {Form, Input, Button, message, Select} from 'antd'
import { saveCompanyDomain, updateCompanyDomain, selectCompanyDomain } from './service'
const { Option } = Select;
const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}
const SetDomainAlias = (props) => {
  // const userInfo = JSON.parse(localStorageGet('loginInfo'))
  const formRef = React.createRef()
  const { current, companyId, showDrawer, closeCDrawer, fn } = props
	const {create, edit} = fn
  useEffect(() => {
    if (showDrawer) {
			selectCompanyDomainFn({
				companyId
			})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDrawer])
	useEffect(() => {
		if(current.emailAlias){
			onFill(current)
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[current])
	const onFill = (data) => {
		const {emailAlias} = data
		const arr = emailAlias.split('@')
		const obj = {
			emailPrefix:arr[0],
			emailSuffix:arr[1]
		}
		console.log(obj);
    formRef.current.setFieldsValue(obj);
  };
	const onCancel = () => {
		// onReset()
		closeCDrawer()
	}
  const onFinish = (values) => {
		const {emailPrefix,emailSuffix} = values
		const data = {
			email: current.email,
			emailAlias: emailPrefix +'@' + emailSuffix
		}
		if(current.emailAlias){
			edit(data)
		} else {
			create(data)
		}
  }
	// 查询公司域别名
	const [companyDomain, setCompanyDomain] = useState({})
	const [emailSuffix, setEmailSuffix] = useState([])
	const domainAlias =process.env.REACT_APP_EMAIL_SUFFIX
	const selectCompanyDomainFn = (data) => {
		selectCompanyDomain(data).then(res => {
			setCompanyDomain(res.data)
		})
	}
	useEffect(() => {
		setEmailSuffix(
			[domainAlias, companyDomain.domainAlias]
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyDomain])

	const selectAfter = (
		<Form.Item name="emailSuffix" noStyle>
			<Select className="select-after">
				{
					emailSuffix.map((e, idx) => {
						return (<Option value={e} key={idx}>{e}</Option>)
					})
				}
			</Select>
		</Form.Item>
	);
  return (
    <Form {...layout} ref={formRef} onFinish={onFinish} initialValues={{emailSuffix: domainAlias}}>
      <Form.Item
				label="别名设置"
				name="emailPrefix"
				extra="仅支持大小写字母、数字、下划线的组合，例如：zhangsan_001"
				rules={[
					{
						required: true,
						pattern: /^[a-zA-Z0-9_-]+$/,
						message: "请输入正确的域别名"
					},
				]}
			>
				<Input addonAfter={selectAfter} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
          保存
        </Button>
        <Button htmlType="button" onClick={onCancel}>
          取消
        </Button>
      </Form.Item>
    </Form>
  )
}
export default SetDomainAlias
