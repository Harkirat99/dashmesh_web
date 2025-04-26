import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import Header from "@/components/Header";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/index";
import { getGlobalTransactions } from "@/store/slices/transactionSlice";
import TransactionTable from "@/components/modules/TransactionTable";
import { AddTransaction } from "@/components/forms/AddTransaction";
import { getCustomers } from "@/store/slices/customerSlice";
import { useSearchParams } from "react-router-dom";

const Transactions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data, loading} = useSelector((state: RootState) => state.transaction);
  const [searchParams] = useSearchParams();
  const customer = searchParams.get("customer") || "";

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
    dispatch(getGlobalTransactions(conditionObj));
  }, [search]);

  useEffect(() => {
    dispatch(getCustomers({}));
  }, [])

  return (
    <>
      <Header title="Transaction" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Transaction</h2>
          <Button onClick={() => setOpen(!open)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Transaction Management</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search transaction..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)}/>
            </div>
          </CardHeader>
          <CardContent>
            <TransactionTable data={data} loading={loading} customer={customer} />
          </CardContent>
        </Card>
        <AddTransaction open={open} type="global" setOpen={setOpen}/>
      </div>
    </>
  );
};

export default Transactions;
