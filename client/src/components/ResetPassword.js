import React, { useState } from 'react';
import { Redirect } from 'react-router-dom'
import { Form, Input, Button, message, Result, Typography } from 'antd';
import { useAuth } from "../context/auth";
import './ResetPassword.css';
import API from '../utils/API';

const { Title } = Typography;

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

function ResetPassword() {
    const { accessToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    if (accessToken) {
        return <Redirect to='/me' />;
    }

    async function reset(values) {
        setLoading(true);
        try {
            let result = await API.post('/auth/reset', values);
            if (result.status === 200) {
                setEmailSent(true);
            }
        } catch (error) {
            if (error.response) {
                message.error(error.response.data.description);
            } else {
                message.error("Ooops. Something went wrong.");
            }
        }
        setLoading(false);
    }

    if (emailSent) {
        return (
            <Result
                status="success"
                title="Reset Email Sent"
                subTitle="Please check your inbox."
            />
        );
    } else {
        return (
            <React.Fragment>
                <Title level={2} style={{
                    textAlign: "center"
                }}>Reset Password</Title>
                <Form
                    {...formItemLayout}
                    name="reset_form"
                    className="reset-form"
                    onFinish={reset}
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
                    <Form.Item {...tailFormItemLayout}>
                        <Button loading={loading} type="primary" htmlType="submit" className="reset-form-button">
                            Reset Password
                    </Button>
                    </Form.Item>
                </Form>
            </React.Fragment>
        );
    }
}

export default ResetPassword;