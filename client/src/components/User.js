import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useToasts } from 'react-toast-notifications';
import API from '../utils/API';


function User() {
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, setValue } = useForm();
  const { addToast } = useToasts();
  const [user, setUser] = useState({});

  async function onSubmit(values) {
    try {
      let result = await API.put('/user/me', values);
      if (result.status === 201) {
        addToast('Saved User', { appearance: 'success' });
      } else {
        addToast('Failed', { appearance: 'error' });
      }
    } catch (error) {
      addToast('Error', { appearance: 'error' });
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        let result = await API.get('/user/me');
        if (result.status === 200) {
          setUser(result.data);
          setTimeout(() => setValue("first_name", result.data['first_name']));
          setTimeout(() => setValue("last_name", result.data['last_name']));
        } else {
          addToast('Failed', { appearance: 'error' });
        }
      } catch (error) {
        if (error && error.message) {
          addToast(error.message, { appearance: 'error' });
        }else {
          addToast('error', { appearance: 'error' });
        }
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    fetchData();
  }, [setValue, addToast])

  if (loading) {
    return (
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    );
  } else {
    return (
      <>
        <h1 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h1>
        <div className="mt-5 shadow sm:rounded-md sm:overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white px-4 py-5 sm:p-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                  <p className="block text-sm font-medium text-gray-700">ID</p>
                  <p className="block text-sm text-gray-700">{user.id}</p>
                </div>
                <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                  <p className="block text-sm font-medium text-gray-700">E-Mail</p>
                  <p className="block text-sm text-gray-700">{user.email}</p>
                </div>
                <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                  <p className="block text-sm font-medium text-gray-700">Created at</p>
                  <p className="block text-sm text-gray-700">{user.created_at}</p>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First name</label>
                  <input ref={register()} type="text" name="first_name" id="first_name" autoComplete="given-name" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last name</label>
                  <input ref={register()} type="text" name="last_name" id="last_name" autoComplete="family-name" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Save
              </button>
          </div>
          </form>
        </div>
      </>
    );
  }
}

export default User;