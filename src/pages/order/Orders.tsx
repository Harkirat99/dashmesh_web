import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import Header from "@/components/Header";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/index";
import { CustomerForm } from "@/components/forms/CustomerForm";
import OrderTable from "@/components/modules/OrderTable";
import { getOrders } from "@/store/slices/orderSlice";
import { getCustomers } from "@/store/slices/customerSlice";
import { AddOrder } from "@/components/forms/AddOrder";

const Orders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data, loading} = useSelector((state: RootState) => state.order);

  useEffect(() => {
    dispatch(getOrders({limit: 100000, search}));
  }, [search]);

  useEffect(() => {
    dispatch(getCustomers({}));
  }, [])

  return (
    <>
      <Header title="Customers" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <Button onClick={() => setOpen(!open)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Order
          </Button>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Orders Management</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search order..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)}/>
            </div>
          </CardHeader>
          <CardContent>
            <OrderTable data={data} loading={loading}/>
          </CardContent>
        </Card>
        <AddOrder open={open} type="global" setOpen={setOpen} />
      </div>
    </>
  );
};

export default Orders;
