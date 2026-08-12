import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { Toaster } from "@/components/ui/toast"

// Auth imports
import Login from './comps/auth/Login'

// User imports
import UserHome from './comps/user/UserHome'

// Admin imports
import AdminHome from './comps/admin/AdminHome'

// Misc imports
import ThemeButton from './comps/misc/ThemeButton'

function App() {

  return (
    <>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:id/:token" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verifyregistration/:token" element={<VerifyRegistration />} /> */}

        {/* User Routes */}
        <Route path="/userHome" element={<UserHome />} />

        {/* Admin Routes */}

        <Route path="/adminhome" element={<AdminHome />} />
        {/* <Route path="/manageUsers" element={<ManageUsers />} />
            <Route path="/auditlogs" element={<AuditLogs />} /> */}
      </Routes>
      <Toaster />
      <ThemeButton />
    </>
  )
}

export default App
