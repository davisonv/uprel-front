import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { AuthProvider } from '../context/AuthContext'

import PrivateRoute from '../navigation/PrivateRoute'

import { Login } from '../autenticacao/pages'
import { Dashboard } from '../dashboard/pages'
import App  from '../App'
import history from './history'

function AppRouter() {



  const router = createBrowserRouter([{
    path: "/",
    element: <App />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "/",
        element: <PrivateRoute><Dashboard /></PrivateRoute>,
      },
      {
        path: "/dashboard",
        element:<PrivateRoute><Dashboard /></PrivateRoute>,
      },


    ]
  }])

  return (
    <AuthProvider>
      <RouterProvider router={router}  history={history}/>
    </AuthProvider>
  )
}

export default AppRouter;