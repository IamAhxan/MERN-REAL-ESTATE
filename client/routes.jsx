import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Home from './src/pages/Home'
import About from './src/pages/About'
import SignIn from './src/pages/SignIn'
import SignUp from './src/pages/SignUp'
import Profile from './src/pages/Profile'
import AppLayout from './src/pages/AppLayout'

const routes = createBrowserRouter([
{
    path: '/',
    element: <AppLayout />,
    children: [


    {
        path: '/',
        element: <Home />
    },
    {
        path: '/about',
        element: <About />
    },
    {
        path: '/sign-in',
        element: <SignIn />
    },
    {
        path: '/sign-out',
        element: <SignUp />
    },
    {
        path: '/profile',
        element: <Profile />
    }]}
])

export default routes