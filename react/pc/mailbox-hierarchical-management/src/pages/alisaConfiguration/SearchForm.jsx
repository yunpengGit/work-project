import React from 'react'
import { Form, Row, Col, Input, Button, Select, DatePicker } from 'antd'
const SearchForm = (props) => {
	const formRef = React.createRef()
	const onFinish = (values) => {
		props.fn(values)
	}
	const onReset = () => {
		formRef.current.resetFields()
	}
	return (
		<Form ref={formRef} className="ant-advanced-search-form" onFinish={onFinish}>
			<Row gutter={24}>
				<Col>
					<Form.Item name="companyName" label="企业名称">
						<Input placeholder="请输入企业名称" />
					</Form.Item>
				</Col>
				<Col>
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
