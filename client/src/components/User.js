import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Descriptions, Spin, Alert, Divider, message } from 'antd';
import API from '../utils/API';

function User() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState({});

  const [form] = Form.useForm();

  async function onFinish(values) {
    try {
      let result = await API.put('/user/me', values);
      if (result.status === 201) {
        message.success('Saved user');
      } else {
        message.error('Failed');
      }
    } catch (error) {
      message.error('Error');
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        let result = await API.get('/user/me');
        if (result.status === 200) {
          setUser(result.data);
          form.setFieldsValue({
            first_name: result.data.email,
            last_name: result.data.last_name
          });
        } else {
          message.error('Failed');
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    fetchData();
  }, [form])

  if (loading) {
    return (<Spin />);
  } else {
    return (
      <React.Fragment>
        {error &&
          <Alert
            message="Error"
            description={error.message}
            type="error"
            closable
          />
        }
        <Descriptions title="User Info">
          <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
          <Descriptions.Item label="E-Mail">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Created at">{user.created_at}</Descriptions.Item>
        </Descriptions>
        <Divider />
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="first_name" label="First Name">
            <Input />
          </Form.Item>
          <Form.Item name="last_name" label="Last Name">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </React.Fragment>
    );
  }
}

export default User;