import React, { useState } from 'react';
import { Redirect } from 'react-router-dom'
import { message, Result } from 'antd';
import { useForm } from "react-hook-form";
import { useAuth } from "../context/auth";
import API from '../utils/API';


function ResetPassword() {
    const { accessToken } = useAuth();
    const { register, handleSubmit, errors } = useForm();
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const onSubmit = data => reset(data);

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
            if (error.response && error.response.data) {
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset your Password</h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="shadow sm:rounded-md sm:overflow-hidden">
                            <div className="p-8 bg-white space-y-5">
                                <div>
                                    <label htmlFor="email-adress" className="block text-sm font-medium text-gray-700">Email address</label>
                                    <input
                                        type="text"
                                        name="email"
                                        id="email-adress"
                                        autoComplete="email"
                                        ref={register({ 
                                            required: "Please input your email adress!", 
                                            pattern: {
                                                value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                                                message: "Not a valid email adress."
                                            }
                                        })}
                                        className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md${errors.email ? ' border-red-400' : ''}`} />
                                    {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>}
                                </div>

                                <div>
                                    <button 
                                        type="submit"
                                        className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500${loading ? ' cursor-not-allowed' : ''}`}
                                        disabled={loading}>
                                        {loading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>}
                                        Reset Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default ResetPassword;