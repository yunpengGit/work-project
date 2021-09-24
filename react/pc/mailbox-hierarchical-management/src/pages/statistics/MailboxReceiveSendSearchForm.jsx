import React from 'react';
import { Form, Row, Col, Input, Button, DatePicker } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/lib/locale/zh_CN';
const { RangePicker } = DatePicker;

const MailboxReceiveSendSearchForm = (props) => {
  const formRef = React.createRef();
  const onFinish = (values) => {
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
            name="userName"
            label="邮箱名称"
          >
            <Input placeholder="请输入邮箱名称" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name="emails"
            label="邮箱地址"
          >
            <Input placeholder="请输入邮箱地址" />
          </Form.Item>
        </Col>
        {/* <Col>
          <Form.Item name="range-picker" label="时间范围" {...rangeConfig}>
            <RangePicker locale={locale}/>
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
export default MailboxReceiveSendSearchForm
