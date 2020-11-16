import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { Result, Button, Spin, message } from 'antd';
import API from '../utils/API';

function Confirm() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    let { token } = useParams();

    useEffect(() => {
        async function postData() {
            try {
                let result = await API.post('/auth/confirm/' + token);
                if (result.status !== 200) {
                    setError("The confirmation link is invalid or has expired.");
                }
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.description);
                } else {
                    setError("The confirmation link is invalid or has expired.");
                }
            } finally {
                setLoading(false);
            }
        }
        setLoading(true);
        postData();
    }, [token])

    async function resendConfirmation() {
        setLoading(true);
        try {
            let result = await API.post('/auth/resend');
            if (result.status === 200) {
                message.success("A new confirmation email has been sent.");
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

    if (loading) {
        return (<Spin />);
    } else {
        if (error) {
            return (
                <Result
                    status="error"
                    title="Confirmation Failed"
                    subTitle={error}
                    extra={[
                        <Button type="primary" onClick={resendConfirmation} key="resend">
                            Resend Confirmation E-Mail
                        </Button>,
                    ]}
                />
            )
        } else {
            return (
                <Result
                    status="success"
                    title="Confirmation Successfull"
                    subTitle="You have confirmed your account."
                    extra={[
                        <Link to="/me" key="dashboard">
                            <Button type="primary">
                                Go to Dashboard
                            </Button>
                        </Link>
                    ]}
                />
            );
        }
    }
}

export default Confirm;