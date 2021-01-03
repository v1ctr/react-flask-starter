import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { Button, message, Result } from 'antd';
import API from '../utils/API';


function NewPassword() {
    const { register, handleSubmit, errors } = useForm();
    const [loading, setLoading] = useState(false);
    const [passwordReseted, setPasswordReseted] = useState(false);
    let { token } = useParams();

    const onSubmit = data => save(data);

    async function save(values) {
        setLoading(true);
        try {
            let result = await API.post('/auth/reset/' + token, values);
            if (result.status === 200) {
                setPasswordReseted(true);
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Enter New Password</h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="shadow sm:rounded-md sm:overflow-hidden">
                            <div className="p-8 bg-white space-y-5">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        autoComplete="new-password"
                                        ref={register({ required: true })}
                                        className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md${errors.password ? ' border-red-400' : ''}`} />
                                    {errors.password && <p className="mt-2 text-sm text-red-400">Please input a new password!</p>}
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
                                        Save Password
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

export default NewPassword;