import React from 'react'
import { Form, Row, Col, Input, Button, Select, DatePicker } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
import locale from 'antd/lib/locale/zh_CN'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker
const { Option } = Select
const GB = 1024 * 1024 * 1024
const SearchForm = (props) => {
	const formRef = React.createRef()
	const onFinish = (values) => {
		if (values.rangePicker) {
			const [dilatationEffectiveFrom, dilatationEffectiveTo] = values.rangePicker
			values.dilatationEffectiveFrom = new Date(dayjs(dilatationEffectiveFrom)) + ''
			values.dilatationEffectiveTo = new Date(dayjs(dilatationEffectiveTo)) + ''
		}
		delete values.rangePicker
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
					<Form.Item name="emailDilatationStorage" label="扩容空间">
						<Select placeholder="请选择" allowClear>
							<Option value={10 * GB}>10G</Option>
							<Option value={20 * GB}>20G</Option>
							<Option value={50 * GB}>50G</Option>
							<Option value={100 * GB}>100G</Option>
						</Select>
					</Form.Item>
				</Col>
				<Col>
					<Form.Item
						name="rangePicker"
						label="有效期"
						rules={[
							{
								type: 'array'
							}
						]}
					>
						<RangePicker locale={locale} />
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
