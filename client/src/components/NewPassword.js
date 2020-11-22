import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom'
import { Form, Input, Button, message, Result, Typography } from 'antd';
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

function NewPassword() {
    const [loading, setLoading] = useState(false);
    const [passwordReseted, setPasswordReseted] = useState(false);
    let { token } = useParams();

    async function save(values) {
        setLoading(true);
        try {
            let result = await API.post('/auth/reset/' + token, values);
            if (result.status === 200) {
                setPasswordReseted(true);
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

    if (passwordReseted) {
        return (
            <Result
                status="success"
                title="Password Reset Successfull"
                subTitle="Your new password has been saved."
                extra={[
                    <Link to="/auth/signin" key="signin">
                        <Button type="primary">
                            Go to SignIn
                        </Button>
                    </Link>
                ]}
            />
        );
    } else {
        return (
            <React.Fragment>
                <Title level={2} style={{
                    textAlign: "center"
                }}>Enter New Password</Title>
                <Form
                    {...formItemLayout}
                    name="new_password_form"
                    className="reset-form"
                    onFinish={save}
                    scrollToFirstError
                >
                    <Form.Item
                        name="password"
                        label="New Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your new password!',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button loading={loading} type="primary" htmlType="submit" className="reset-form-button">
                            Save Password
                    </Button>
                    </Form.Item>
                </Form>
            </React.Fragment>
        );
    }
}

export default NewPassword;