import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import Header from "@/components/Header";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/index";
import OrderTable from "@/components/modules/OrderTable";
import { getGlobalOrders } from "@/store/slices/orderSlice";
import { AddOrder } from "@/components/forms/AddOrder";
import { getCustomers } from "@/store/slices/customerSlice";
import { useSearchParams } from "react-router-dom";

const Orders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data, loading } = useSelector((state: RootState) => state.order);
  const [searchParams] = useSearchParams();
  const customer = searchParams.get("customer") || "";
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    let conditionObj: { [key: string]: any } = {
      search,
    };
    if (customer) {
      conditionObj = {
        ...conditionObj,
        customer: customer,
      };
    }
    dispatch(getGlobalOrders(conditionObj));
  }, [search]);

  useEffect(() => {
    dispatch(getCustomers({}));
  }, []);

  const handleEdit = (order: any) => {
    setEditData(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditData(null);
  };

  return (
    <>
      <Header title="Orders" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Order
          </Button>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Orders Management</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search order..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <OrderTable 
              data={data} 
              loading={loading} 
              showCustomers={true} 
              customer={customer}
              onEdit={handleEdit}
            />
          </CardContent>
        </Card>
        <AddOrder 
          open={open} 
          type="global" 
          setOpen={handleClose}
          editData={editData}
        />
      </div>
    </>
  );
};

export default Orders;
