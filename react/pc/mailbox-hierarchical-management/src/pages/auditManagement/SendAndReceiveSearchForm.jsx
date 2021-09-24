import React, { useState } from 'react';
import { Form, Row, Col, Input, Button, Select, DatePicker } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/lib/locale/zh_CN';
import dayjs from 'dayjs'

const {Option} = Select
const { RangePicker } = DatePicker;

const SendAndReceiveSearchForm = (props) => {
	const {fn} = props
  const formRef = React.createRef();
  const onFinish = (values) => {
    fn(values)
  };
  const onReset = () => {
    formRef.current.resetFields();
  };
  const rangeConfig = {
    rules: [
      {
        type: 'array',
      },
    ],
	};
	const disabledDate = (current) => {
		return current && current > dayjs(Date.now() - 24 * 60 * 60 * 1000).endOf('day');
	}
  return (
    <Form
      ref={formRef}
      className="ant-advanced-search-form"
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col>
          <Form.Item
            name="queryType"
						label="查询类型"
						rules={[
							{
								required: true,
							},
						]}
          >
            <Select
              placeholder="请选择"
							allowClear
            >
              <Option value="AccountRecvMail">收信日志</Option>
              <Option value="AccountSendMail">发信日志</Option>
              <Option value="AccountDelMail">删除日志</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name="target"
						label="邮箱地址"
						rules={[
							{
								required: true,
							},
						]}
          >
            <Input placeholder="请输入邮箱地址" />
          </Form.Item>
        </Col>
        <Col>
					<Form.Item
						name="rangePicker"
						label="时间范围"
						{...rangeConfig}
						rules={[
							{
								required: true,
							},
						]}
					>
            <RangePicker showTime disabledDate={disabledDate} locale={locale}/>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{marginRight: 8}}>
              查询
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default SendAndReceiveSearchForm
