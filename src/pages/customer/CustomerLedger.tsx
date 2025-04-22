import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import {  useParams } from "react-router-dom";
import { getCustomerLedgerDetail } from "@/store/slices/customerSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/index";
import { getSeasonsDropdown } from "@/store/slices/seasonSlice";
import moment from "moment-timezone";
import DateSelector from "@/components/modules/dashboard/DateSelector";
import { BarChart, IndianRupeeIcon, Users } from "lucide-react";

export function CustomerLedger() {
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { ledger } = useSelector((state: RootState) => state.customer);
    const { dropdown } = useSelector((state: RootState) => state.season);
    const [startDate, setStartDate] = useState(moment().subtract(1, "month").toISOString());
    const [endDate, setEndDate] = useState(moment().toISOString());
    
    const handleDateChanged = ({start, end}: any) => {
      console.log(start, end);
      if(start){}setStartDate(start);
      if(end) setEndDate(end);
    } 
  
    useEffect(() => {
      dispatch(getCustomerLedgerDetail({id: `${id}`, startDate, endDate}));
    }, [startDate, endDate]);
    
    useEffect(() => {
      dispatch(getSeasonsDropdown({}));
    }, [])

  return (
    <>
    <Header title="Customers" />
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Harmeet Singh</h2>
        <DateSelector data={dropdown} handleDateChanged={handleDateChanged}/>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Balance
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{ledger?.metrics?.currentBalance}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance in season</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{ledger?.metrics?.balanceInSeason}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Previous Balance</CardTitle>
              <IndianRupeeIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{ledger?.metrics?.balanceBeforeSeason}
              </div>
            </CardContent>
          </Card>
        </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledger?.records.map((entry: any, index : number) => (
                <TableRow key={index}>
                  <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                  <TableCell className="capitalize">{entry.type}</TableCell>
                  <TableCell>
                    {entry.type === "order" && entry.items ? (
                      <ul className="list-disc ml-4">
                        {entry.items.map((item: any, idx: number) => (
                          <li key={idx}>
                            {item.name} {item.quantity}×{item.size}: {item.orderPrice}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.type === "transaction" ? "-" : "+"}{entry.type === "transaction"
                      ? entry.amount
                      : entry.totalPrice}
                  </TableCell>
                  <TableCell className="text-right">{entry.balance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </>
  );
}
