import React from 'react';
import { Form, Row, Col, Input, Button, Select } from 'antd';
const {Option} = Select

const SearchForm = (props) => {
  const formRef = React.createRef();
  const onFinish = (values) => {
		if (values.emailGroupName) {
			values.name = values.emailGroupName
			delete values.emailGroupName
		}
    props.fn(values)
  };
  const onReset = () => {
    formRef.current.resetFields();
  };
  return (
    <Form
      ref={formRef}
      className="ant-advanced-search-form"
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col>
          <Form.Item
            name="emailGroupName"
            label="邮件组名称"
          >
            <Input placeholder="请输入邮件组名称" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name="address"
            label="邮箱地址"
          >
            <Input placeholder="请输入邮件组邮箱地址" />
          </Form.Item>
        </Col>
        {/* <Col>
          <Form.Item
            name="type"
            label="邮件组类型"
          >
            <Select
              placeholder="请选择"
              allowClear
            >
              <Option value="">全部</Option>
              <Option value="0">普通邮件组</Option>
              <Option value="1">动态邮件组</Option>
            </Select>
          </Form.Item>
        </Col> */}
        <Col>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{marginRight: 8}}>
              查询
            </Button>
            <Button htmlType="button" onClick={onReset}>
              重置
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default SearchForm
