import { Routes, Route, Navigate } from 'react-router'
import { Toaster } from "@/components/ui/toast"

// Auth imports
import Login from './comps/auth/Login'

// Employee imports
import EmployeeHome from './comps/employee/EmployeeHome'
import AddRequest from './comps/employee/AddRequest'

// Admin imports
import AdminHome from './comps/admin/AdminHome'

// Misc imports
import ThemeButton from './comps/misc/ThemeButton'
import Layout from './comps/misc/Layout'

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

        {/* Employee Routes */}
        <Route element={<Layout />}>
          <Route path="/employeeHome" element={<EmployeeHome />} />
          <Route path="/addRequest" element={<AddRequest />} />
        </Route>
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
