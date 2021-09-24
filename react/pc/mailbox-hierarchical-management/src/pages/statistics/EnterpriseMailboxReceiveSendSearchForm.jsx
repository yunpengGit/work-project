import React from 'react'
import { Form, Row, Col, Input, Button, DatePicker } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
import locale from 'antd/lib/locale/zh_CN'
import dayjs from 'dayjs'
import { localStorageGet } from './../../utils/localStorageFn'

const { RangePicker } = DatePicker
const EnterpriseMailboxReceiveSendSearchForm = (props) => {
	const userInfo = JSON.parse(localStorageGet('loginInfo'))
	const { identity } = userInfo
	const formRef = React.createRef()
	const onFinish = (values) => {
		if (values.rangePicker) {
			values.startDate = dayjs(values.rangePicker[0]).format("YYYY-MM-DD")
			values.endDate = dayjs(values.rangePicker[1]).format("YYYY-MM-DD")
			delete values.rangePicker
		}
		props.fn(values)
	}
	const onReset = () => {
		formRef.current.resetFields()
	}
	const disabledDate = (current) => {
		return current && current > dayjs(Date.now() - 24 * 60 * 60 * 1000).endOf('day')
	}
	return (
		<Form ref={formRef} className="ant-advanced-search-form" onFinish={onFinish}>
			<Row gutter={24}>
				{identity == '1' ? (
					<Col>
						<Form.Item name="companyName" label="企业名称">
							<Input placeholder="请输入企业名称" />
						</Form.Item>
					</Col>
				) : (
					''
				)}
				<Col>
					<Form.Item
						name="rangePicker"
						label="时间范围"
						rules={[
							{
								type: 'array'
							}
						]}
					>
						<RangePicker disabledDate={disabledDate} locale={locale} />
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
export default EnterpriseMailboxReceiveSendSearchForm
