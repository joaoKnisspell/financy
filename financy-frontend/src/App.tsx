import AuthLayout from "./layouts/auth-layout"
import DefaultLayout from "./layouts/default-layout"
import Categories from "./pages/app/categories"
import Home from "./pages/app/home"
import Profile from "./pages/app/profile"
import Transactions from "./pages/app/transactions"
import LoginPage from "./pages/auth/login"
import RegisterPage from "./pages/auth/register"
import GuestRoute from "./components/auth/guest-route"
import ProtectedRoute from "./components/auth/protected-route"
import { Routes, Route } from "react-router"

function App() {

  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/categorias" element={<Categories />} />
          <Route path="/transacoes" element={<Transactions />} />
          <Route path="/perfil" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
