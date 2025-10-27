import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Home from './src/pages/Home'
import About from './src/pages/About'
import SignIn from './src/pages/SignIn'
import SignUp from './src/pages/SignUp'
import Profile from './src/pages/Profile'
import PrivateRoute from './src/components/PrivateRoute'
import AppLayout from './src/pages/AppLayout'
import CreateListing from './src/pages/CreateListing'
import UpdateListing from './src/pages/UpdateListing'
import Listing from './src/pages/Listing'
import Search from './src/pages/Search'

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
                path: '/sign-up',
                element: <SignUp />
            },
            {
                path: '/listing/:listingId',
                element: <Listing />
            },
            {
                path: '/search',
                element: <Search />
            },
            {
                element: <PrivateRoute />,
                children: [{
                    path: '/profile',
                    element: <Profile />
                },
                {
                    path: '/create-listing',
                    element: <CreateListing />
                },
                {
                    path: '/update-listing/:listingId',
                    element: <UpdateListing />
                }]


            }]
    }
])

export default routes