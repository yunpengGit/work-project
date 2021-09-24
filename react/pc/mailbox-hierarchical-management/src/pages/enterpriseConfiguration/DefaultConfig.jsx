import React, {useState, useEffect, useRef} from 'react'
import { Form, InputNumber, Button, Row, Col, message} from 'antd';
import { CreateMailGroupPage } from './style'
import { getSystemParam, updateSystemParam } from './service'

const GB = 1024*1024*1024
const MB = 1024*1024
// const POSITIVE_INTEGER = /^[1-9]\d*$/
const POSITIVE_INTEGER = /^[1-9]\d*$/
// 表单字段对应更新字段code
const nameToKey = new Map([
	['minMailStorage', 'MIN_STORAGE_SIZE'],
	['maxMailStorage', 'MAX_STORAGE_SIZE'],
	['defaultMailStorage', 'STORAGE_SIZE'],
	['minMailAttachmentStorage', 'MIN_ATTACHMENT_TOTAL_SIZE'],
	['maxMailAttachmentStorage', 'MAX_ATTACHMENT_TOTAL_SIZE'],
	['defaultMailAttachmentStorage', 'ATTACHMENT_TOTAL_SIZE'],
])
const DefaultConfig = props => {
	const formRef = React.createRef();
	const modalTree = useRef();
	const {closeCDrawer, showDefault} = props;
	// 邮箱空间
	const [storageConfig, setStorageConfig] = useState({
		min: 1,
		max: 1024,
	})
	// 邮箱附件
	const [attachmentConfig, setAttachmentConfig] = useState({
		min: 1,
		max: 1024,
	})
	//默认参数map映射关系
	let [defaultConfigMap, setDefaultConfigMap] = useState()
  const onFinish = (values) => {
		// console.log(values)
		const data = {
			systemParamBOS:[]
		}
		// 数据条件转换
		const GArr = ['MIN_STORAGE_SIZE', 'MAX_STORAGE_SIZE', 'STORAGE_SIZE']
		Object.keys(values).forEach(key => {
			let value
			if (GArr.includes(nameToKey.get(key))) {
				value = values[key]*GB
			} else {
				value = values[key]*MB
			}
			let obj = {
				systemParamId: defaultConfigMap.get(nameToKey.get(key)),
				systemParamValue: value
			}
			data.systemParamBOS.push(obj)
		})
		updateSystemParam(data).then(res => {
			message.success('更新成功')
			closeCDrawer()
		})
	};
  // const onReset = () => {
  //   formRef.current.resetFields();
	// };
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(async () => {
		if (showDefault) {
			const result = await getSystemParam()
			let data = {}
			// 缓存 key code对应关系
			let configMapArr = []
			if (result.success) {
				const STORAGE_SIZE = "STORAGE_SIZE" // 平台默认邮箱空间
				const MAX_STORAGE_SIZE = "MAX_STORAGE_SIZE" // 平台可配最大邮箱空间
				const MIN_STORAGE_SIZE = "MIN_STORAGE_SIZE" // 平台可配最小邮箱空间
				const ATTACHMENT_TOTAL_SIZE = "ATTACHMENT_TOTAL_SIZE" // 平台默认附件大小
				const MAX_ATTACHMENT_TOTAL_SIZE = "MAX_ATTACHMENT_TOTAL_SIZE" // 平台可配最大附件大小
				const MIN_ATTACHMENT_TOTAL_SIZE = "MIN_ATTACHMENT_TOTAL_SIZE" // 平台可配最小附件大小
				let minMailStorage = ''
				let maxMailStorage = ''
				let defaultMailStorage = ''
				let minMailAttachmentStorage = ''
				let maxMailAttachmentStorage = ''
				let defaultMailAttachmentStorage = ''
				result.data.forEach(ele => {
					configMapArr.push([ele.systemParamCode,ele.systemParamId])
					switch(ele.systemParamCode) {
						case MIN_STORAGE_SIZE:
							minMailStorage = ele.systemParamValue/GB;
							// setStorageMinNumber(minMailStorage)
							break;
						case MAX_STORAGE_SIZE:
							maxMailStorage = ele.systemParamValue/GB;
							// setStorageMaxNumber(maxMailStorage)
							break;
						case STORAGE_SIZE:
							defaultMailStorage = ele.systemParamValue/GB;
							break;
						case MIN_ATTACHMENT_TOTAL_SIZE:
							minMailAttachmentStorage = ele.systemParamValue/MB;
							break;
						case MAX_ATTACHMENT_TOTAL_SIZE:
							maxMailAttachmentStorage = ele.systemParamValue/MB;
							break;
						case ATTACHMENT_TOTAL_SIZE:
							defaultMailAttachmentStorage = ele.systemParamValue/MB;
							break
						default:
					}
				})
				data = {
					minMailStorage,
					maxMailStorage,
					defaultMailStorage,
					minMailAttachmentStorage,
					maxMailAttachmentStorage,
					defaultMailAttachmentStorage,
				}
			}
			onFill(data)
			// eslint-disable-next-line react-hooks/exhaustive-deps
			setDefaultConfigMap(new Map(configMapArr))
			// console.log(data.minMailStorage)
			// 初始化设置字段区间范围
			setStorageConfig({
				min: data.minMailStorage,
				max: data.maxMailStorage,
			})
			setAttachmentConfig({
				min: data.minMailAttachmentStorage,
				max: data.maxMailAttachmentStorage,
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[showDefault])
	const onFill = (params) => {
		formRef.current.setFieldsValue(params);
	};
  const onCancel = () => {
		// onReset()
    closeCDrawer()
	};
	// form 默认数据
	// modal确认按钮
	const modalSubmit = () => [
		modalTree.current.closeModal()
	]
	// 邮箱最小空间change
	const minMailStorageChange = value => {
		let {max} = storageConfig
		const data = {
			min: value,
			max,
		}
		setStorageConfig(data)
	}
	// 邮箱最大空间change
	const maxMailStorageChange = value => {
		if (value == 0) {
			return
		}
		let {min} = storageConfig
		const data = {
			min,
			max: value,
		}
		setStorageConfig(data)
	}
	// 邮箱空间默认change
	const storageDefaultChange = value => {

	}
	// 邮箱最小附件change
	const minAttachmentStorageChange = value => {
		let {max} = attachmentConfig
		const data = {
			min: value,
			max,
		}
		setAttachmentConfig(data)
	}
	// 邮箱最大附件change
	const maxAttachmentStorageChange = value => {
		let {min} = attachmentConfig
		const data = {
			min,
			max: value,
		}
		setAttachmentConfig(data)
	}
	// 邮箱空间附件change
	const attachmentStorageDefaultChange = value => {

	}
  return (
    <CreateMailGroupPage>
      <Form
				// {...layout}
				ref={formRef}
				onFinish={onFinish}
			>
				<div className="small-title">邮箱空间配置</div>
				<Form.Item noStyle>
          <Row>
            <Col>
							<Form.Item
								name="minMailStorage"
								label="可配最小空间"
								rules={[
									{
										required: true,
										pattern: POSITIVE_INTEGER,
										message: '请输入正整数'
									},
								]}
							>
								<InputNumber min={1} max={storageConfig.max} onChange={minMailStorageChange} />
							</Form.Item>
						</Col>
						<Col push={1} style={{marginTop: 4}}>
							<span style={{marginRight: 8}}>单位: GB</span><span style={{color: '#949494'}}>(设置所有企业邮箱可配置的最小空间)</span>
						</Col>
					</Row>
        </Form.Item>
				<Form.Item noStyle>
          <Row>
            <Col>
							<Form.Item
								name="maxMailStorage"
								label="可配最大空间"
								rules={[
									{
										required: true,
										pattern: POSITIVE_INTEGER,
										message: '请输入正整数'
									},
								]}
							>
								<InputNumber min={storageConfig.min} onChange={maxMailStorageChange} />
							</Form.Item>
						</Col>
						<Col push={1} style={{marginTop: 4}}>
							<span style={{marginRight: 8}}>单位: GB</span><span style={{color: '#949494'}}>(设置所有企业邮箱可配置的最大空间)</span>
						</Col>
					</Row>
        </Form.Item>
				<Form.Item noStyle>
          <Row>
            <Col>
							<Form.Item
								name="defaultMailStorage"
								label="默认空间"
								rules={[
									{
										required: true,
										pattern: POSITIVE_INTEGER,
										message: '请输入正整数'
									},
								]}
							>
								<InputNumber min={storageConfig.min} max={storageConfig.max} onChange={storageDefaultChange} />
							</Form.Item>
						</Col>
						<Col push={1} style={{marginTop: 4}}>
							<span style={{marginRight: 8}}>单位: GB</span><span style={{color: '#949494'}}>(设置所有企业的邮箱默认空间大小)</span>
						</Col>
					</Row>
        </Form.Item>
        <div className="small-title">邮箱附件配置</div>
				<Form.Item noStyle>
          <Row>
            <Col>
							<Form.Item
								name="minMailAttachmentStorage"
								label="可配最小附件"
								rules={[
									{
										required: true,
										pattern: POSITIVE_INTEGER,
										message: '请输入正整数'
									},
								]}
							>
								<InputNumber min={1} max={attachmentConfig.max} onChange={minAttachmentStorageChange} />
							</Form.Item>
						</Col>
						<Col push={1} style={{marginTop: 4}}>
							<span style={{marginRight: 8}}>单位: MB</span><span style={{color: '#949494'}}>(设置所有企业邮箱可配置的附件最小值)</span>
						</Col>
					</Row>
        </Form.Item>
				<Form.Item noStyle>
          <Row>
            <Col>
							<Form.Item
								name="maxMailAttachmentStorage"
								label="可配最大附件"
								rules={[
									{
										required: true,
										pattern: POSITIVE_INTEGER,
										message: '请输入正整数'
									},
								]}
							>
								<InputNumber min={attachmentConfig.min}  onChange={maxAttachmentStorageChange} />
							</Form.Item>
						</Col>
						<Col push={1} style={{marginTop: 4}}>
							<span style={{marginRight: 8}}>单位: MB</span><span style={{color: '#949494'}}>(设置所有企业邮箱可配置的附件最大值)</span>
						</Col>
					</Row>
        </Form.Item>
				<Form.Item noStyle>
          <Row>
            <Col>
							<Form.Item
								name="defaultMailAttachmentStorage"
								label="默认附件"
								rules={[
									{
										required: true,
										pattern: POSITIVE_INTEGER,
										message: '请输入正整数'
									},
								]}
							>
								<InputNumber min={attachmentConfig.min} max={attachmentConfig.max} onChange={attachmentStorageDefaultChange} />
							</Form.Item>
						</Col>
						<Col push={1} style={{marginTop: 4}}>
							<span style={{marginRight: 8}}>单位: MB</span><span style={{color: '#949494'}}>( 设置所有企业的邮箱默认附件大小)</span>
						</Col>
					</Row>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{marginRight: 10}}>
            保存
          </Button>
          <Button htmlType="button" onClick={onCancel}>
            取消
          </Button>
        </Form.Item>
      </Form>
      </CreateMailGroupPage>
  );
}
export default DefaultConfig
