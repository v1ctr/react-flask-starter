import React from 'react';
import { Route, useLocation, Switch, Link } from "react-router-dom";
import { Menu, Transition } from '@headlessui/react'
import User from '../components/User';
import { useAuth } from '../context/auth';

function BaseContainer() {
    const location = useLocation();
    const { signOut } = useAuth();

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sider */}
            <div className="flex flex-col flex-none w-56 bg-indigo-900 text-indigo-200">
                <div className="text-lg flex items-center justify-center h-16">React Flask Starter</div>
                {/* Menu */}
                <ul>
                    <li>
                        <Link to="/me" className={`flex h-10 px-4 items-center text-sm hover:bg-indigo-700 hover:text-white${location.pathname==='/me' ? ' bg-indigo-700 text-white': ''}`}>
                            <svg className="flex-shrink-0 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profile
                        </Link>
                    </li>

                     <li>
                        <Link to="/test" className={`flex h-10 px-4 items-center text-sm hover:bg-indigo-700 hover:text-white${location.pathname==='/test' ? ' bg-indigo-700 text-white': ''}`}>
                            <svg className="flex-shrink-0 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Item 2
                        </Link>
                    </li>

                    <li>
                        <Link to="/test2" className={`flex h-10 px-4 items-center text-sm hover:bg-indigo-700 hover:text-white${location.pathname==='/test2' ? ' bg-indigo-700 text-white': ''}`}>
                            <svg className="flex-shrink-0 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                            </svg>
                            Item 3
                        </Link>
                    </li>                               
                </ul>
            </div>
            <div className="flex flex-col flex-1">
                {/* Header */}
                <div className="relative flex items-center justify-end h-16 bg-white shadow-sm px-2 sm:px-6 lg:px-8">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        {/* Profile dropdown */}
                        <div className="ml-3 relative">
                        <Menu>
                        {({ open }) => (
                                <>    
                                    <div>
                                        <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" id="user-menu" aria-haspopup="true">
                                        <span className="sr-only">Open user menu</span>
                                        <img className="h-8 w-8 rounded-full" src={"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} alt=""/>
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        show={open}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items static className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 outline-none">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                to="/me"
                                                className={`${
                                                    active
                                                    ? "bg-gray-100"
                                                    : "text-gray-700"
                                                } block px-4 py-2 text-sm outline-none`}
                                                >
                                                Your Profile
                                                </Link>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                onClick={signOut}
                                                className={`${
                                                    active
                                                    ? "bg-gray-100"
                                                    : "text-gray-700"
                                                } block w-full px-4 py-2 text-sm text-left outline-none focus:outline-none`}
                                                >
                                                Sign out
                                                </button>
                                            )}
                                        </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </>
                            )}
                        </Menu>
                    </div>
                </div>
                </div>
                {/* Content */}
                <div className="p-4">
                    <Switch>
                        <Route path="/me" component={User} />
                    </Switch>
                </div>
            </div>
        </div>
    );
}

export default BaseContainer;