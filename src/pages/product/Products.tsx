import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {  Search } from "lucide-react";
import Header from "@/components/Header";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/index";
import { getProducts } from "@/store/slices/productSlice";
import ProductTable from "@/components/modules/ProductTable";
// import { AddProduct } from "@/components/forms/AddStock";

const Products = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState("");
  const { data, loading} = useSelector((state: RootState) => state.product);

  useEffect(() => {
    dispatch(getProducts({limit: 100000, sortBy: "createdAt:desc", search}));
  }, [search]);


  return (
    <>
      <Header title="Products" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          {/* <Button onClick={() => setOpen(!open)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button> */}
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Product Management</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)}/>
            </div>
          </CardHeader>
          <CardContent>
            <ProductTable data={data} loading={loading} />
          </CardContent>
        </Card>
        {/* <AddProduct open={open} type="global" setOpen={setOpen}/> */}
      </div>
    </>
  );
};

export default Products;
