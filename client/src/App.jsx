import React from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes } from 'react-router-dom'
import AdminDashboard from './components/AdminDashboard'
import RegisterUser from './components/RegisterationPage'
import CreateUser from './components/CreateUser'
import EditUser from './components/EditUser'
import AdminLogin from './components/AdminLogin';
import UserLogin from './components/UserLogin';
import UserProfile from './components/UserProfile';
import UpdateUser from './components/updateUser';

const App = () => {
  return (
    <div>
      <ToastContainer theme='dark' />
      <Routes>
        <Route path='/adminLogin' element={<AdminLogin/>} />
        <Route path='/dashboard' element={<AdminDashboard/>} />
        <Route path='/register' element={<RegisterUser/>} />
        <Route path='/' element={<UserLogin/>} />
        <Route path='/userProfile' element={<UserProfile />} />
        <Route path='/createUser' element={<CreateUser />} />
        <Route path='/editUser' element={<EditUser />} />
        <Route path='/updateUser' element={<UpdateUser />} />
      </Routes>
    </div>
  )
}

export default App
