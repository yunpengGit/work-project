import React from 'react'
import { Form, Input, Button, Select } from 'antd';
const { Option } = Select;
const layout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 10,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 2,
    span: 10,
  },
};
const CForm = () => {
  const formRef = React.createRef();
  const onGenderChange = (value) => {
    formRef.current.setFieldsValue({
      note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
    });
  };
  const onFinish = (values) => {
  };
  const onReset = () => {
    formRef.current.resetFields();
  };
  const onFill = () => {
    formRef.current.setFieldsValue({
      name: '员工1',
      address: '1234qwer@qq.com',
      status: '0'
    });
  };
  return (
    <Form {...layout} ref={formRef}  onFinish={onFinish}>
      <Form.Item
        name="name"
        label="员工姓名"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="address"
        label="邮箱地址"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="status"
        label="邮箱状态"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder="请选择"
          onChange={onGenderChange}
          allowClear
        >
          <Option value="">所有状态</Option>
          <Option value="1">禁用状态</Option>
          <Option value="0">正常状态</Option>
        </Select>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
      >
        {({ getFieldValue }) => {
          return getFieldValue('gender') === 'other' ? (
            <Form.Item
              name="customizeGender"
              label="Customize Gender"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          ) : null;
        }}
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          查询
        </Button>
        <Button htmlType="button" onClick={onReset}>
          重置
        </Button>
        <Button type="link" htmlType="button" onClick={onFill}>
          回显
        </Button>
      </Form.Item>
    </Form>
  );
}
export default CForm
