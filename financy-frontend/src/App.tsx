import AuthLayout from "./layouts/auth-layout"
import DefaultLayout from "./layouts/default-layout"
import Categories from "./pages/app/categories"
import Home from "./pages/app/home"
import Transactions from "./pages/app/transactions"
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
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/categorias" element={<Categories />} />
        <Route path="/transacoes" element={<Transactions />} />
      </Route>
    </Routes>
  )
}

export default App
