import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Users,
  IndianRupeeIcon,
  Phone,
  MapPin,
  Plus,
} from "lucide-react";
import Header from "@/components/Header";
import { useDispatch, useSelector } from "react-redux";
import {  useParams } from "react-router-dom";
import { getCustomerDetail } from "@/store/slices/customerSlice";
import { getOrders } from "@/store/slices/orderSlice";
import { getTransactions } from "@/store/slices/transactionSlice";

import { AppDispatch, RootState } from "../../store/index";
import TransactionTable from "@/components/modules/TransactionTable";
import OrderTable from "@/components/modules/OrderTable";
import { Button } from "@/components/ui/button";
import { AddOrder } from "@/components/forms/AddOrder";
import { AddTransaction } from "@/components/forms/AddTransaction";



const CustomerDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const { data } = useSelector((state: RootState) => state.customer);
  const { data: orders, loading: ordersLoading } = useSelector((state: RootState) => state.order);
  const { data: transactions, loading: transactionLoading } = useSelector((state: RootState) => state.transaction);
  const [addOrder, setAddOrder] = useState(false);
  const [addTransaction, setAddTransaction] = useState(false);


  useEffect(() => {
    dispatch(getCustomerDetail(`${id}`));
    dispatch(getOrders({customer: id, limit: 10}));
    dispatch(getTransactions({customer: id, limit: 10}));
  }, []);

  return (
    <>
      <Header title="Dashboard" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Card className="p-6">
          <div className="flex items-center justify-between space-y-2">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight">
                {data?.firstName + " " + data?.lastName} {data?.fatherName ? `S/O ${data?.fatherName}` : ""} 
              </h2>
            </div>
            <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <p className="tracking-tight">{data?.address}</p>
            </div>
            <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <p className="tracking-tight">+91 {data?.number}</p>
              </div>
              {data?.alternateNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <p className="tracking-tight">+91 {data?.alternateNumber}</p>
                </div>
              )}
              
              
            </div>
           
          </div>
        </Card>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Amount
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{data?.totalAmount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{data?.paidAmount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Due</CardTitle>
              <IndianRupeeIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{data?.totalAmount - data?.paidAmount}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        </div>
        <div className="flex items-center justify-between">
          <h4 className="text-2xl font-bold tracking-tight">
            Recent Transactions
          </h4>
          <Button onClick={() => setAddTransaction(!addTransaction)}>
            <Plus className="mr-2 h-4 w-4" />
              Add Transaction
          </Button>
        </div>
        <TransactionTable data={transactions} loading={transactionLoading} />
        <div className="flex items-center justify-between">
          <h4 className="text-2xl font-bold tracking-tight">
            Recent Orders
          </h4>
          <Button onClick={() => setAddOrder(!addOrder)}>
            <Plus className="mr-2 h-4 w-4" />
              Add Order
          </Button>
        </div>
        <OrderTable data={orders} loading={ordersLoading}/>
      </div>
     <AddOrder open={addOrder} setOpen={setAddOrder} type="add" />
     <AddTransaction open={addTransaction} setOpen={setAddTransaction} type="add" />
    </>
  );
};

export default CustomerDashboard;
