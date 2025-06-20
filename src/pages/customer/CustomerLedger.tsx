import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { useParams } from "react-router-dom";
import { getCustomerLedgerDetail } from "@/store/slices/customerSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/index";
import { getSeasonsDropdown } from "@/store/slices/seasonSlice";
import moment from "moment-timezone";
import DateSelector from "@/components/modules/dashboard/DateSelector";
import { BarChart, IndianRupeeIcon, Users, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PDFViewer } from "@react-pdf/renderer";
import { BillPdf } from "./BillPdf";
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from '@/components/pdf/Invoice';
export function CustomerLedger() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { ledger } = useSelector((state: RootState) => state.customer);
  const { dropdown } = useSelector((state: RootState) => state.season);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(
    moment().subtract(1, "month").toISOString()
  );
  const [endDate, setEndDate] = useState(moment().toISOString());

  const handleDateChanged = ({ start, end }: any) => {
    if (start) setStartDate(start);
    if (end) setEndDate(end);
  };

  useEffect(() => {
    dispatch(getCustomerLedgerDetail({ id: `${id}`, startDate, endDate }));
  }, [startDate, endDate]);

  useEffect(() => {
    dispatch(getSeasonsDropdown({}));
  }, []);

  return (
    <>
      <Header title="Customers" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">{ledger?.metrics?.name}</h2>
          <DateSelector data={dropdown} handleDateChanged={handleDateChanged} />
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Balance
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{ledger?.metrics?.currentBalance}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Balance in season
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{ledger?.metrics?.balanceInSeason}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Previous Balance
              </CardTitle>
              <IndianRupeeIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{ledger?.metrics?.balanceBeforeSeason}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="text-end">
          <Button onClick={() => setIsModalOpen(true)}><Printer/>Print Bill</Button>
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
                {ledger?.records.map((entry: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      {new Date(entry.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="capitalize">{entry.type}</TableCell>
                    <TableCell>
                      {entry.type === "order" && entry.items ? (
                        <ul className="list-disc ml-4">
                          {entry.items.map((item: any, idx: number) => (
                            <li key={idx}>
                              {item.name} {item.quantity}×{item.size} {item.unit}:{" "}
                              {item.price}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.type === "transaction" ? "-" : "+"}
                      {entry.type === "transaction"
                        ? entry.amount
                        : entry.totalPrice}
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.balance}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
        </DialogTrigger>
        <DialogContent
          className="!w-[95vw] !max-w-[95vw] !h-[90vh] p-0 overflow-hidden flex flex-col"
          style={{ maxWidth: '95vw', width: '95vw', height: '90vh' }}
        >
          <DialogHeader className="p-4">
            <DialogTitle>Print Preview</DialogTitle>
          </DialogHeader>
          <div className="h-[calc(100%-60px)]">
            <PDFViewer width="100%" height="100%">
              <BillPdf ledger={ledger} />
            </PDFViewer>
          </div>
        </DialogContent>
      </Dialog>

      <PDFDownloadLink document={<InvoicePDF />} fileName="invoice.pdf">
      {({ loading }) =>
        loading ? 'Loading document...' : 'Download Invoice PDF'
      }
    </PDFDownloadLink>
</div>
    </>
  );
}
