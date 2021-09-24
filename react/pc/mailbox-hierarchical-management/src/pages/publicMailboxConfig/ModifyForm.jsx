import React, { useEffect, useCallback, useImperativeHandle } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Input, Button } from 'antd'
import { CreateMailGroupPage } from './style'
import { localStorageGet } from '../../utils/localStorageFn'
const layout = {
	labelCol: {
		span: 4
	},
	wrapperCol: {
		span: 20
	}
}
const tailLayout = {
	wrapperCol: {
		offset: 4,
		span: 20
	}
}
const ModifyMailGroup = (props) => {
	const formRef = React.createRef()
	const { current, fn } = props
	const { modalSubmit, closeDrawer } = fn
	useEffect(() => {
		if (current.name) {
			onReset()
			onFill(current)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [current])

	const onReset = () => {
		formRef.current.resetFields()
	}
	const onFill = (current) => {
		const data = {
			email2: current.email
		}
		formRef.current.setFieldsValue(data)
	}
	const onFinish = (values) => {
		values.email = values.email2
		values.password = values.password2
		modalSubmit(values)
	}
	const onCancel = () => {
		// onReset()
		closeDrawer()
	}
	// 密码校验
	return (
		<CreateMailGroupPage>
			<Form {...layout} ref={formRef} onFinish={onFinish}>
				<Form.Item name="email2" label="公共邮箱地址">
					<Input disabled />
				</Form.Item>
				<Form.Item
					name="password2"
					label="邮箱密码"
					rules={[
						{
							required: true,
							pattern: /(?!^[0-9]+$)(?!^[a-z]+$)(?!^[A-Z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{8,}$/,
							message: '密码长度不能小于8位，包含以下至少两种字符：大小字母、数字和符号!'
						}
					]}
					hasFeedback
				>
					<Input.Password placeholder="密码长度不能小于8位，包含以下至少两种字符：大小字母、数字和符号!" />
				</Form.Item>

				<Form.Item
					name="confirm2"
					label="确认密码"
					dependencies={['password2']}
					hasFeedback
					rules={[
						{
							required: true,
							message: '请再次输入邮箱登录密码'
						},
						({ getFieldValue }) => ({
							validator(rule, value) {
								if (!value || getFieldValue('password2') === value) {
									return Promise.resolve()
								}
								return Promise.reject('您输入的两个密码不匹配!')
							}
						})
					]}
				>
					<Input.Password placeholder="请再次输入邮箱登录密码" />
				</Form.Item>
				<Form.Item {...tailLayout}>
					<Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
						保存
					</Button>
					<Button htmlType="button" onClick={onCancel}>
						取消
					</Button>
				</Form.Item>
			</Form>
		</CreateMailGroupPage>
	)
}
export default ModifyMailGroup
