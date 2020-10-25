import React from 'react';
import { Link, Redirect} from 'react-router-dom'
import { Form, Input, Button } from 'antd';
import { useAuth } from "../context/auth";
import './SignUp.css';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function SignUp() {
  const { accessToken, signUp } = useAuth();

  if (accessToken) {
    return <Redirect to='/me' />;
  }

  return (
    <Form
      {...formItemLayout}
      name="signup_form"
      className="signup-form"
      onFinish={signUp}
      scrollToFirstError
    >
      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit" className="signup-form-button">
          Sign Up
        </Button>
        <Link to="/auth/signin">{"Already have an account? Sign in"}</Link>
      </Form.Item>
    </Form>
  );
}

export default SignUp;