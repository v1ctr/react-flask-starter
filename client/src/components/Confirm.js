import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { useToasts } from 'react-toast-notifications';
import API from '../utils/API';

function Confirm() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { addToast } = useToasts();
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
                addToast("A new confirmation email has been sent.", { appearance: 'success' });
            }
        } catch (error) {
            if (error.response) {
                addToast(error.response.data.description, { appearance: 'error' });
            } else {
                addToast("Ooops. Something went wrong.", { appearance: 'error' });
            }
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          );
    } else {
        if (error) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full space-y-5">
                        <div className="flex items-center justify-center">
                            <svg className="h-24 w-24 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Confirmation Failed</h2>
                        <p className="mt-2 text-center text-sm text-gray-600">{error}</p>
                        <div>
                            <button onClick={resendConfirmation} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Resend Confirmation E-Mail</button>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full space-y-5">
                        <div className="flex items-center justify-center">
                            <svg className="h-24 w-24 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Confirmation Successfull</h2>
                        <p className="mt-2 text-center text-sm text-gray-600">You have confirmed your account.</p>
                        <div>
                            <Link to="/me" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Go to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default Confirm;