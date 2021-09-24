import React, { useState } from 'react'
import { Form, Row, Col, Input, Button, Select } from 'antd'

const Option = Select.Option
const GB = 1024 * 1024 * 1024
const SearchForm = (props) => {
  const formRef = React.createRef()
  const onFinish = (values) => {
    props.searchFn(values)
  }
  const onReset = () => {
    formRef.current.resetFields()
  }
  return (
    <Form
      ref={formRef}
      className="ant-advanced-search-form"
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col span={5}>
          <Form.Item name="userName" label="员工姓名">
            <Input placeholder="请输入员工姓名" />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item name="email" label="邮箱地址">
            <Input placeholder="请输入员工邮箱地址" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="activeStatus" label="邮箱状态">
            <Select placeholder="请选择" allowClear>
              <Option value="">所有状态</Option>
              <Option value="1">冻结</Option>
              <Option value="0">正常</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="storageSize" label="邮箱空间">
            <Select placeholder="请选择">
              <Option value={5 * GB}>5G</Option>
              <Option value={10 * GB}>10G</Option>
              <Option value={20 * GB}>20G</Option>
              <Option value={50 * GB}>50G</Option>
              <Option value={100 * GB}>100G</Option>
            </Select>
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
