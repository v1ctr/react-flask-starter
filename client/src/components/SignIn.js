import React from 'react';
import { Redirect, Link } from "react-router-dom";
import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from "../context/auth";
import './SignIn.css';

const { Title } = Typography;

function SignIn(props) {
  const { accessToken, signIn } = useAuth();

  const referer = props.location.state?.referer || '/me';

  if (accessToken) {
    return <Redirect to={referer} />;
  }

  return (
    <React.Fragment>
      <Title style={{
        textAlign: "center"
      }} level={2} >Sign In</Title>
      <Form
        name="signin_form"
        className="signin-form"
        onFinish={signIn}
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input your email adress!',
            }
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="E-Mail" autoComplete="username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            autoComplete="current-password"
          />
        </Form.Item>
        <Form.Item>
          <Link className="signin-form-forgot" to="/auth/reset">{"Forgot Password"}</Link>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="signin-form-button">
            Sign in
          </Button>
          <Link to="/auth/signup">{"Don't have an account? Sign Up"}</Link>
        </Form.Item>
      </Form>
    </React.Fragment>
  );
}

export default SignIn;