import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useAuth } from "../context/auth";

function SignUp() {
  const { accessToken, signUp } = useAuth();
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = data => signUp(data);

  if (accessToken) {
    return <Redirect to='/me' />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign up for an account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or
          <Link to="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">{" sign in, if you already have an account"}</Link>
          </p>
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
                  ref={register({ required: true })}
                  className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md${errors.email ? ' border-red-400' : ''}`} />
                  {errors.email && <p className="mt-2 text-sm text-red-400">Please input an email adress!</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  ref={register({ required: true })}
                  className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md${errors.password ? ' border-red-400' : ''}`} />
                  {errors.password && <p className="mt-2 text-sm text-red-400">Please input a password!</p>}
              </div>

              <div>
                <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Sign up</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;