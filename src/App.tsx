import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import Layout from "@/components/Layout"
import Dashboard from "@/pages/Dashboard"
import Customers from "@/pages/customer/Customers"
import CustomerDashboard from "@/pages/customer/CustomerDashboard"
import Transactions from "@/pages/transaction/Transactions"
import NotFound from "@/pages/NotFound"
import Login from "@/pages/Login"
import ProtectedRoute from "./components/ProtectedRoute";
import Orders from "@/pages/order/Orders";
import Seasons from "./pages/season/Seasons"

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
            <Route path="orders" element={<Orders />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="seasons" element={<Seasons />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  )
}
export default App