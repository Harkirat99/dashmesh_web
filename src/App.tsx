import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import Layout from "@/components/Layout"
import Dashboard from "@/pages/Dashboard"
import Users from "@/pages/Users"
import Products from "@/pages/Products"
import Transactions from "@/pages/Transactions"
import NotFound from "@/pages/NotFound"
import Login from "@/pages/Login"
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <Routes>
        <Route index element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route path="dasboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="products" element={<Products />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App


