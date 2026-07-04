import AuthLayout from "./layouts/auth-layout"
import LoginPage from "./pages/auth/login"
import RegisterPage from "./pages/auth/register"
import { Routes, Route } from "react-router"

function App() {

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  )
}

export default App
