import React, { useState } from 'react'
import { Form, Row, Col, Input, Button, Select } from 'antd'
import { localStorageGet } from './../../utils/localStorageFn'

const SearchForm = (props) => {
	const userInfo = JSON.parse(localStorageGet('loginInfo'))
	const { identity } = userInfo
	const formRef = React.createRef()
	const layout = {
		labelCol: {
			span: 4
		},
		wrapperCol: {
			span: 10
		}
	}
	const ColSpan = 6
	const onFinish = (values) => {
		values.name = values.name2
		values.companyName = values.companyName2
		delete values.name2
		delete values.companyName2
		props.fn(values)
	}
	const onReset = () => {
		formRef.current.resetFields()
	}
	return (
		<Form ref={formRef} className="ant-advanced-search-form" onFinish={onFinish}>
			<Row gutter={24}>
				<Col span={ColSpan}>
					<Form.Item name="name2" label="公共邮箱名称">
						<Input placeholder="请输入公共邮箱名称" />
					</Form.Item>
				</Col>
				{identity == '1' ? (
					<Col span={ColSpan}>
						<Form.Item name="companyName2" label="所属企业">
							<Input placeholder="请输入所属企业名称" />
						</Form.Item>
					</Col>
				) : (
					''
				)}
				<Col span={ColSpan}>
					<Form.Item name="email" label="公共邮箱地址">
						<Input placeholder="请输入公共邮箱地址" />
					</Form.Item>
				</Col>
				<Col span={ColSpan}>
					<Form.Item>
						<Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
							查询
						</Button>
						<Button htmlType="button" onClick={onReset}>
							重置
						</Button>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	)
}
export default SearchForm
