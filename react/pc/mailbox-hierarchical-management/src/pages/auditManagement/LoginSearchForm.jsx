import React, { useState } from 'react'
import { Form, Row, Col, Input, Button, Select, DatePicker } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
import locale from 'antd/lib/locale/zh_CN'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

const LoginSearchForm = (props) => {
	const formRef = React.createRef()
	const onFinish = (values) => {
		props.fn(values)
	}
	const onReset = () => {
		formRef.current.resetFields()
	}
	const rangeConfig = {
		rules: [
			{
				type: 'array'
			}
		]
	}
	const disabledDate = (current) => {
		return current && current > dayjs(Date.now() - 24 * 60 * 60 * 1000).endOf('day')
	}
	return (
		<Form ref={formRef} className="ant-advanced-search-form" onFinish={onFinish}>
			<Row gutter={24}>
				{/* <Col>
          <Form.Item
            name="activeStatus"
            label="查询类型"
          >
            <Select
              placeholder="请选择"
              allowClear
            >
              <Option value="">邮箱管理</Option>
              <Option value="1">邮箱组管理</Option>
              <Option value="0">公共邮箱配置</Option>
            </Select>
          </Form.Item>
        </Col> */}
				{/* <Col>
          <Form.Item
            name="name"
            label="员工姓名"
          >
            <Input placeholder="请输入员工姓名" />
          </Form.Item>
        </Col> */}
				<Col>
					<Form.Item
						name="email"
						label="邮箱地址"
						rules={[
							{
								required: true
							}
						]}
					>
						<Input placeholder="请输入员工邮箱地址" />
					</Form.Item>
				</Col>
				<Col>
					<Form.Item
						name="rangePicker"
						label="时间范围"
						{...rangeConfig}
						rules={[
							{
								required: true
							}
						]}
					>
						<RangePicker showTime disabledDate={disabledDate} locale={locale} />
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
export default LoginSearchForm
