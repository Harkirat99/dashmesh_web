import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import Header from "@/components/Header";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/index";
import { getExpenses, getExpenseLedger } from "@/store/slices/expenseSlice";
import ExpenseTable from "@/components/modules/ExpenseTable";
import { AddExpense } from "@/components/forms/AddExpense";
import moment from "moment-timezone";
import DateSelector from "@/components/modules/dashboard/DateSelector";
import { getSeasonsDropdown } from "@/store/slices/seasonSlice";

const Expense = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data, loading} = useSelector((state: RootState) => state.expense);
  const { dropdown } = useSelector((state: RootState) => state.season);
  const [startDate, setStartDate] = useState(
    moment().subtract(1, "month").toISOString()
  );
  const [endDate, setEndDate] = useState(moment().toISOString());


  const handleDateChanged = ({ start, end }: any) => {
    if (start) setStartDate(start);
    if (end) setEndDate(end);
  };

  useEffect(() => {
    dispatch(getExpenseLedger({startDate, endDate }));
  }, [startDate, endDate]);

 useEffect(() => {
    dispatch(getSeasonsDropdown({}));
  }, []);
  return (
    <>
      <Header title="Expense" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Expense</h2>
          <Button onClick={() => setOpen(!open)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>
        <div className="flex justify-end">
          <DateSelector data={dropdown} handleDateChanged={handleDateChanged} />
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Expense Management</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search expense..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)}/>
            </div>
          </CardHeader>
          <CardContent>
            <ExpenseTable data={data?.transactions} loading={loading} />
          </CardContent>
        </Card>
        <AddExpense open={open} type="global" setOpen={setOpen}/>
      </div>
    </>
  );
};

export default Expense;
