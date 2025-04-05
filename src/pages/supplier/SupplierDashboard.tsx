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
import { AppDispatch, RootState } from "../../store/index";
import { Button } from "@/components/ui/button";
import { AddStock } from "@/components/forms/AddStock";
import { getStocks } from "@/store/slices/stockSlice";
import StockTable from "@/components/modules/StockTable";


const SupplierDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const { data, loading } = useSelector((state: RootState) => state.stock);
  const [addStock, setAddStock] = useState(false);

  useEffect(() => {
    dispatch(getStocks({supplier: id, limit: 100000, sortBy: "createdAt:desc"}));
  }, []);

  return (
    <>
      <Header title="Dashboard" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Card className="p-6">
          <div className="flex items-center justify-between space-y-2">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight">
                {"Buyer"} 
              </h2>
            </div>
            <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <p className="tracking-tight">New Jhinda</p>
            </div>
            <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <p className="tracking-tight">+91 8307213553</p>
              </div>
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
              <div className="text-2xl font-bold">₹0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Due</CardTitle>
              <IndianRupeeIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹0
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        </div>
        <div className="flex items-center justify-between">
          <h4 className="text-2xl font-bold tracking-tight">
            Recent Stock Created
          </h4>
          <Button onClick={() => setAddStock(!addStock)}>
            <Plus className="mr-2 h-4 w-4" />
              Add New Stock
          </Button>
        </div>
        <StockTable data={data} loading={loading} />
      </div>
     <AddStock open={addStock} setOpen={setAddStock} type="add" />
    </>
  );
};

export default SupplierDashboard;
