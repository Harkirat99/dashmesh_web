import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import Layout from "@/components/Layout"
import Dashboard from "@/pages/Dashboard"
import Customers from "@/pages/customer/Customers"
import CustomerDashboard from "@/pages/customer/CustomerDashboard"
import Products from "@/pages/Products"
import Transactions from "@/pages/Transactions"
import NotFound from "@/pages/NotFound"
import Login from "@/pages/Login"
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <Routes>
        <Route index  path="/login" element={<Login />} />
          < Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/:id" element={<CustomerDashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  )
}
// 

export default App


