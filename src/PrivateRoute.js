import React from 'react'
import { useContext } from 'react'
import { AppContext } from './context/appContext'
import { Outlet } from 'react-router-dom'
import Login from './pages/Login'


const PrivateRoute = () => {
  const {user} = useContext(AppContext);  
  return user? <Outlet/> : <Login/>
}

export default PrivateRoute