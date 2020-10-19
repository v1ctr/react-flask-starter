import React from 'react';
import { Redirect, Link } from "react-router-dom";
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from "../context/auth";
import API from "../utils/API";
import './SignIn.css';

function SignIn(props) {
  const { accessToken, setAccessToken, refreshToken, setRefreshToken } = useAuth();

  const referer = props.location.state?.referer || '/me';

  async function onFinish(values) {
    try {
      let result = await API.post('/auth/signin', values);
      if (result.status === 200) {
        setAccessToken(result.data.access_token);
        setRefreshToken(result.data.refresh_token);
      } else {
        console.log("failed");
      }
    } catch (error) {
      console.log("error");
    }
 }

  if (accessToken) {
    return <Redirect to={referer} />;
  }

  return (
      <Form
        name="signin_form"
        className="signin-form"
        onFinish={onFinish}
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
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="E-Mail" autoComplete="username"/>
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
          <Button type="primary" htmlType="submit" className="signin-form-button">
            Sign in
          </Button>
          <Link to="/auth/signup">{"Don't have an account? Sign Up"}</Link>
        </Form.Item>
      </Form>
  );
}

export default SignIn;