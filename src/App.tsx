import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import Layout from "@/components/Layout"
import Dashboard from "@/pages/Dashboard"
import Customers from "@/pages/customer/Customers";
import CustomerDashboard from "@/pages/customer/CustomerDashboard";
import Transactions from "@/pages/transaction/Transactions";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Orders from "@/pages/order/Orders";
import Seasons from "./pages/season/Seasons";
import Suppliers from "./pages/supplier/Suppliers";
import Products from "./pages/product/Products";
import SupplierDashboard from "./pages/supplier/SupplierDashboard";
import { CustomerLedger } from "./pages/customer/CustomerLedger";
import Expense from "./pages/expense/Expense";

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
               <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/:id" element={<CustomerDashboard />} />
            <Route path="customers/ledger/:id" element={<CustomerLedger />} />
            <Route path="orders" element={<Orders />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="seasons" element={<Seasons />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="suppliers/:id" element={<SupplierDashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="expense" element={<Expense />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  )
}
export default App
