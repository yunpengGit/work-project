import React, { useEffect, useState, useImperativeHandle } from 'react'
import { Tooltip, Form, Row, Col, Input, Button, message, Radio, Select } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import clonedeep from 'lodash.clonedeep'
import CTable from '../../components/CTable'
import { TableContext } from '../../components/CTable/context'
import { selectMonoderivativeBase, saveMailMonoderivative, selectApprovers, saveApprovers } from './service'
import { selectCompanyDilatationConfigureByCompanyId } from '../home/service'
import { localStorageGet } from '../../utils/localStorageFn'
const { Option } = Select

const layout = {
	labelCol: {
		span: 6
	},
	wrapperCol: {
		span: 18
	}
}
const OneWayImport = (props) => {
	const userInfo = JSON.parse(localStorageGet('loginInfo'))
	const { companyName, companyId } = userInfo
	const formRef = React.createRef()
	const { current, showDrawer, closeCDrawer, searchFn } = props
	useEffect(() => {
		if (showDrawer){
			selectApproversFn()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showDrawer])

	let approverEmail = ''
	// 查询 是否 已经设置 单导审批邮件
	const selectApproversFn = () => {
		const data = {
			email: current.displayAlias?current.displayAlias:current.email
		}
		if(current.isMonoderivative === 1){
			selectApprovers(data).then((res) => {
				if(res.success){
					approverEmail = res.data[0]&&res.data[0].approverEmail?res.data[0].approverEmail:''
					formRef.current&&formRef.current.setFieldsValue({isMonoderivative: current.isMonoderivative, approverEmail: approverEmail});
				}
			})
			setShowApprove(true)
		} else {
			formRef.current.setFieldsValue({isMonoderivative: current.isMonoderivative});
			setShowApprove(false)
		}
	}
	const onFinish = (values) => {
		const { isMonoderivative, approverEmail} = values
		const data = {
			email: current.email,
			displayAlias: current.displayAlias,
			isMonoderivative,
			mailApproverBOs: [
				{
					approverEmail
				}
			]
		}
		saveApproversFn(data)
	}
	const saveApproversFn = (data) => {
		saveApprovers(data).then((res) => {
			if(res.success){
				message.success('设置成功')
				closeCDrawer()
				// 保存成功重新查列表数据
				searchFn()
			}
		})
	}
	const onCancel = () => {
		closeCDrawer()
	}

	const [showApprove, setShowApprove] = useState(true)
	const [showAccount, setShowAccount] = useState(false)
	const ChangeImport = (e) => {
		if (e.target.value === 1) {
			setShowApprove(true)
		} else {
			setShowApprove(false)
		}
	}
	const ChangeApprove = (e) => {
		if (e.target.value === 1) {
			setShowAccount(true)
		} else {
			setShowAccount(false)
		}
	}
	return (
		<Form {...layout} ref={formRef} onFinish={onFinish}>
			<Form.Item label="员工姓名">
				<span>{current.name}</span>
			</Form.Item>
			<Form.Item label="邮箱地址">
				<span>{current.displayAlias}</span>
			</Form.Item>
			<Form.Item label="所属部门">
				<span>{current.departmentName}</span>
			</Form.Item>
			<Form.Item
				label={
					<span>
						开启邮件单导权限&nbsp;
						<Tooltip title="开启后，该邮箱账号可以向内网邮箱发送邮件，实现信息自动化单向导入。">
							<QuestionCircleOutlined />
						</Tooltip>
					</span>
				}
				name="isMonoderivative"
			>
				<Radio.Group onChange={ChangeImport} value={1}>
					<Radio value={1}>开启</Radio>
					<Radio value={0}>不开启</Radio>
				</Radio.Group>
			</Form.Item>
			{showApprove ? (
				<Form.Item
					label={
						<span>
							单导邮件审批设置&nbsp;
							<Tooltip title="员工向内网邮箱发送邮件时，需进行审批（对于不需审批的特殊人员，审批人可设置为员工本人）">
								<QuestionCircleOutlined />
							</Tooltip>
						</span>
					}
				>
					<Form.Item
						label="审批邮箱账号"
						name="approverEmail"
						rules={[
							{
								required: true,
								pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
								message: "请输入正确的邮箱账号"
							}
						]}
					>
						<Input />
					</Form.Item>
					{/* <Radio.Group onChange={ChangeApprove} style={{ width: '100%' }}>
						<Row>
							<Col span={6} style={{ marginTop: 4 }}>
								<Radio value={1}>需审批</Radio>
							</Col>
							<Col span={14}>
								{showAccount ? (
									<Form.Item
										label="审批邮箱账号"
										name="账号"
										rules={[
											{
												required: true
											}
										]}
									>
										<Input />
									</Form.Item>
								) : (
									''
								)}
							</Col>
						</Row>
						<Row>
							<Col>
								<Radio value={2}>不需审批</Radio>
							</Col>
						</Row>
					</Radio.Group> */}
				</Form.Item>
			) : (
				''
			)}
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
export default OneWayImport
