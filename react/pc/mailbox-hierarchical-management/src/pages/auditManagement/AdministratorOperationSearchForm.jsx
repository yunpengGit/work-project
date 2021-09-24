import React, { useState } from 'react';
import { Form, Row, Col, Input, Button, Select, DatePicker } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/lib/locale/zh_CN';
import dayjs from 'dayjs'

const { Option } = Select;
const { RangePicker } = DatePicker;

const AdministratorOperationSearchForm = (props) => {
	const formRef = React.createRef();
  const onFinish = (values) => {
    props.fn(values)
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
			initialValues={{
				titleType: "1",
			}}
    >
      <Row gutter={24}>
        <Col>
          <Form.Item
						name="titleType"
						label="查询类型"
						rules={[
							{
								required: true,
							},
						]}
          >
            <Select>
              <Option value="1">邮箱管理</Option>
              <Option value="2">邮箱组管理</Option>
              <Option value="3">公共邮箱配置</Option>
            </Select>
          </Form.Item>
        </Col>
        {/* <Col>
          <Form.Item
            name="address"
            label="邮箱地址"
          >
            <Input placeholder="请输入组内成员邮箱地址" />
          </Form.Item>
        </Col> */}
        <Col>
          <Form.Item name="rangePicker" label="时间范围" {...rangeConfig}>
						<RangePicker disabledDate={disabledDate} locale={locale}/>
          </Form.Item>
        </Col>
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
export default AdministratorOperationSearchForm
