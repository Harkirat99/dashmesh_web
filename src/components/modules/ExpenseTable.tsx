import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { formatPrice } from "@/lib/converter";

interface TransactionProps {
  data: [];
  loading: boolean;
}
const ExpenseTable = ({ data, loading }: TransactionProps) => {
  
  return (
    <Card className="gap-0">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr No</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Partner</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Harmeet Balance</TableHead>
              <TableHead>Sandeep Balance</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell>
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[150px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                  </TableRow>
                ))
              : Array.isArray(data) &&
                data?.map((item: any, index) => (
                  <TableRow key={item?.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{item?.source =="transaction" ? "Transaction" : "Expense"}</TableCell>
                    <TableCell>{item?.partner}</TableCell>
                    <TableCell>{"Paid"}</TableCell>
                    <TableCell>{formatPrice(item?.amount)}</TableCell>
                    <TableCell>{item?.note}</TableCell>
                    <TableCell>{formatPrice(item?.p1Balance)}</TableCell>
                    <TableCell>{formatPrice(item?.p2Balance)}</TableCell>
                    <TableCell>{format(item?.date, "PPP")}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ExpenseTable;
