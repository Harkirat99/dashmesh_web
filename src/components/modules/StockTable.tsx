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
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { formatPrice } from "@/lib/converter";

interface TransactionProps {
  data: [];
  loading: boolean;
}
const StockTable = ({ data, loading }: TransactionProps) => {
    const navigate = useNavigate();
  
    return (
    <Card className="gap-0">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr No</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Order Value</TableHead>
              <TableHead>Additional Charges</TableHead>
              <TableHead>Tax Amount</TableHead>
              <TableHead>Grand Total</TableHead>
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
                  <TableRow key={item?.id} className="cursor-pointer" onClick={() => navigate(`/suppliers/${item?.id}`)}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{format(item?.date, "PPP")}</TableCell>
                    <TableCell>{formatPrice(item?.orderValue)}</TableCell>
                    <TableCell>{formatPrice(item?.additionalCharges)}</TableCell>
                    <TableCell>{formatPrice(item?.taxAmount)}</TableCell>
                    <TableCell>{formatPrice(item?.grandTotal)}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StockTable;
