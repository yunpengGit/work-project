import React, { useEffect, useState, useImperativeHandle } from 'react'
import { Form, Row, Col, Input, InputNumber, Button, message, Radio, Select } from 'antd'
import clonedeep from 'lodash.clonedeep'
import CTable from '../../components/CTable'
import { TableContext } from '../../components/CTable/context'
import { selectMonoderivativeBase, saveMailMonoderivative } from './service'
import { selectCompanyConfigure } from '../enterpriseConfiguration/service'
import { selectCompanyDilatationConfigureByCompanyId } from '../home/service'
import { localStorageGet } from '../../utils/localStorageFn'
const { Option } = Select

const GB = 1024 * 1024 * 1024
const MB = 1024 * 1024
const POSITIVE_INTEGER = /^[1-9]\d*$/
const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}
const EditMail = (props) => {
  const userInfo = JSON.parse(localStorageGet('loginInfo'))
  const { selectData, current, showDrawer, closeCDrawer } = props
  // 是否扩容
  const formRef = React.createRef()
  const [expansion, setExpansion] = useState(false)
  // 邮箱空间选项
  const [selectOption, setSelectOption] = useState([])
  // 扩容空间类型数据
  const [storageType, setStorageType] = useState([])
  // 附件默认大小
  const [defaultAttachmentTotalSize, setDefaultAttachmentTotalSize] = useState(30)
  useEffect(() => {
    if (showDrawer) {
      onFill(current)
      setDefaultAttachmentTotalSize(current.attachmentTotalSize / MB)
			// console.log(selectData)
      selectCompanyDilatationConfigureByCompanyIdFn({
        companyId: selectData.companyId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDrawer])
	const onFill = (params) => {
    let cloneData = clonedeep(params)
    cloneData.storageSize = cloneData.storageSize / GB
    setDefaultAttachmentTotalSize(30)
    formRef.current.setFieldsValue(cloneData)
  }
  const onCancel = () => {
    // onReset()
    closeCDrawer()
  }
  const onReset = () => {
    formRef.current.resetFields()
  }
  // 查询扩容状态
  const selectCompanyDilatationConfigureByCompanyIdFn = (data) => {
    selectCompanyDilatationConfigureByCompanyId(data).then((res) => {
      const result = res
      if (result.data && result.data.length > 0) {
        setStorageType(result.data)
        setExpansion(true)
        const dataMap = new Map([
          [10 * GB, { text: '10G', value: 10 }],
          [20 * GB, { text: '20G', value: 20 }],
          [50 * GB, { text: '50G', value: 50 }],
          [100 * GB, { text: '100G', value: 100 }],
        ])
        let arr = []
        let storageType = new Map()
        result.data.forEach((item) => {
          storageType.set(item.emailDilatationStorage, item.companyDilatationId)
          arr.push(dataMap.get(+item.emailDilatationStorage))
        })
        setStorageType(storageType)
        arr.sort((pro, next) => {
          return pro.value - next.value
        })
        setSelectOption(arr)
      }else {
				setExpansion(false)
			}
    })
  }

  // 提交单导公司关联状态
	const onFinish = (values) => {
    saveMailMonoderivativeFn(values)
  }
  const saveMailMonoderivativeFn = (params) => {
    let cloneData = clonedeep(params)

    cloneData.storageSize = cloneData.storageSize * GB
    const companyDilatationId = storageType.get(cloneData.storageSize + '')
    // console.log(params)
    const obj = {
      attachmentTotalSize: defaultAttachmentTotalSize * MB,
      email: current.email,
      displayAlias: current.displayAlias,
      ...cloneData,
      companyDilatationId,
    }
    saveMailMonoderivative(obj).then((res) => {
      closeCDrawer()
      message.success('设置成功')
    })
  }

	// 空间改变 改变附件大小
  const storageSizeChange = (value) => {
    if (value >= 10) {
      setDefaultAttachmentTotalSize(100)
    } else {
      setDefaultAttachmentTotalSize(30)
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
			{/* <Form.Item
				label="邮箱别名"
				name="domainAlias"
				extra="仅支持大小写字母、数字、下划线的组合，例如：163.com"
				rules={[
					{
						required: true,
						pattern: /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
						message: "请输入正确的域别名"
					},
				]}
			>
				<Input />
      </Form.Item> */}
      <Form.Item label="所属部门">
        <span>{current.departmentName}</span>
      </Form.Item>
      {expansion ? (
        <Form.Item
          label="邮箱空间"
          name="storageSize"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select placeholder="请选择" allowClear onChange={storageSizeChange}>
            {selectOption.map((ele, index) => {
              return (
                <Option value={ele.value} key={index}>
                  {ele.text}
                </Option>
              )
            })}
          </Select>
        </Form.Item>
      ) : (
        <Form.Item label="邮箱空间">
          <span>{current.storageSize / GB}G</span>
        </Form.Item>
      )}
      <Form.Item label="邮箱附件">
        {/* <span>{defaultAttachmentTotalSize}M</span> */}
        <span>100M</span>
        {/* <span style={{ color: '#949494' }}>
          （邮箱空间扩容后，该账号的附件容量也将由30M自动扩大至100M）
        </span> */}
      </Form.Item>
      {/* <Form.Item label="向内网邮箱发送邮件">
				<Radio.Group defaultValue={2}>
					<Radio value={1}>允许</Radio>
					<Radio value={2}>不允许</Radio>
				</Radio.Group>
			</Form.Item> */}
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
export default EditMail
